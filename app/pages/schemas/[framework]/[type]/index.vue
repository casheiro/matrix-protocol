<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-6">
            <!-- Framework Icon -->
            <div class="flex items-center justify-center p-3 rounded-lg" :class="getFrameworkClasses(framework)">
              <UIcon :name="getFrameworkIcon(framework)" class="w-8 h-8" />
            </div>
            
            <div>
              <div class="flex items-center gap-3 mb-2">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                  {{ latestSchema?.title }}
                </h1>
                <MatrixBadge :framework="framework" size="lg" variant="soft">
                  {{ framework.toUpperCase() }}
                </MatrixBadge>
              </div>
              <p class="text-lg text-gray-600 dark:text-gray-400">
                {{ $t(`schemas.descriptions.${framework}.${type}`) }}
              </p>
            </div>
          </div>
          
          <!-- Quick Actions -->
          <div class="hidden md:flex items-center gap-3">
            <UButton
              v-if="latestSchema"
              :to="getSchemaViewerUrl(latestSchema)"
              variant="solid"
              color="primary"
              icon="i-heroicons-eye"
            >
              {{ t('schemas.versions.viewLatest') }}
            </UButton>
            <UButton
              v-if="latestSchema"
              @click="openSchemaUrl(latestSchema.url)"
              variant="outline"
              icon="i-heroicons-arrow-top-right-on-square"
            />
          </div>
        </div>
        
        <!-- Breadcrumb -->
        <nav class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-4">
          <NuxtLink :to="localePath('/schemas')" class="hover:text-gray-700 dark:hover:text-gray-200">
            {{ t('schemas.title') }}
          </NuxtLink>
          <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
          <NuxtLink :to="localePath(`/schemas/${framework}`)" class="hover:text-gray-700 dark:hover:text-gray-200">
            {{ framework.toUpperCase() }}
          </NuxtLink>
          <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
          <span class="text-gray-900 dark:text-white">{{ type }}</span>
        </nav>
        
        <!-- Stats -->
        <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {{ versions.length }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ t('schemas.versions.stats.totalVersions') }}
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ latestSchema?.version }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ t('schemas.versions.stats.latestVersion') }}
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {{ statusBreakdown.stable }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ t('schemas.versions.stats.stableVersions') }}
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {{ daysSinceLastRelease }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ t('schemas.versions.stats.daysSinceRelease') }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        <!-- Main Content - Version Timeline -->
        <div class="xl:col-span-2 space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {{ t('schemas.versions.timeline.title') }}
            </h2>
            
            <!-- Timeline -->
            <div class="space-y-6">
              <div
                v-for="(version, index) in sortedVersions"
                :key="version.version"
                class="relative"
              >
                <!-- Timeline line -->
                <div 
                  v-if="index < sortedVersions.length - 1"
                  class="absolute left-4 top-8 w-0.5 h-16 bg-gray-200 dark:bg-gray-700"
                ></div>
                
                <!-- Timeline dot -->
                <div class="relative flex items-start gap-4">
                  <div 
                    class="flex items-center justify-center w-8 h-8 rounded-full border-2 bg-white dark:bg-gray-800"
                    :class="getTimelineDotClasses(version)"
                  >
                    <UIcon 
                      :name="getVersionIcon(version)" 
                      class="w-4 h-4"
                      :class="getTimelineDotTextClasses(version)"
                    />
                  </div>
                  
                  <!-- Version Card -->
                  <div class="flex-1 min-w-0">
                    <div 
                      class="border rounded-lg p-4"
                      :class="version.isLatest ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'"
                    >
                      <!-- Version Header -->
                      <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-3">
                          <h3 class="font-semibold text-gray-900 dark:text-white">
                            v{{ version.version }}
                          </h3>
                          <UBadge 
                            v-if="version.isLatest" 
                            color="blue" 
                            variant="solid"
                            size="sm"
                          >
                            {{ t('schemas.versions.latest') }}
                          </UBadge>
                          <UBadge 
                            :color="getStatusColor(version.status)" 
                            variant="soft"
                            size="sm"
                          >
                            {{ t(`schemas.status.${version.status}`) }}
                          </UBadge>
                        </div>
                        <span class="text-sm text-gray-500 dark:text-gray-400">
                          {{ formatDate(version.releaseDate) }}
                        </span>
                      </div>
                      
                      <!-- Changelog -->
                      <div v-if="version.changelog && version.changelog.length > 0" class="mb-4">
                        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {{ t('schemas.versions.changelog') }}:
                        </h4>
                        <ul class="space-y-1">
                          <li 
                            v-for="change in version.changelog" 
                            :key="change"
                            class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                          >
                            <UIcon 
                              :name="getChangeIcon(change)" 
                              :class="getChangeIconColor(change)"
                              class="w-3 h-3 mt-0.5 flex-shrink-0" 
                            />
                            {{ change }}
                          </li>
                        </ul>
                      </div>
                      
                      <!-- Actions -->
                      <div class="flex items-center gap-2">
                        <UButton
                          :to="getSchemaViewerUrl(version)"
                          variant="outline"
                          size="sm"
                          icon="i-heroicons-eye"
                        >
                          {{ t('schemas.actions.view') }}
                        </UButton>
                        
                        <UButton
                          @click="openSchemaUrl(version.url)"
                          variant="ghost"
                          size="sm"
                          icon="i-heroicons-arrow-top-right-on-square"
                        />
                        
                        <UButton
                          @click="downloadSchema(version)"
                          variant="ghost"
                          size="sm"
                          icon="i-heroicons-arrow-down-tray"
                        />
                        
                        <UButton
                          v-if="!version.isLatest"
                          :to="localePath(`/schemas/${framework}/${type}/${version.version}`)"
                          variant="ghost"
                          size="sm"
                          icon="i-heroicons-information-circle"
                        >
                          {{ t('schemas.versions.details') }}
                        </UButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Navigation -->
          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ t('schemas.versions.quickNav.title') }}
            </h3>
            <div class="space-y-2">
              <UButton
                v-for="version in sortedVersions.slice(0, 5)"
                :key="version.version"
                :to="localePath(`/schemas/${framework}/${type}/${version.version}`)"
                variant="ghost"
                size="sm"
                class="w-full justify-start"
                :class="version.isLatest ? 'bg-blue-50 dark:bg-blue-900/20' : ''"
              >
                <div class="flex items-center justify-between w-full">
                  <span>v{{ version.version }}</span>
                  <UBadge 
                    v-if="version.isLatest"
                    color="blue" 
                    variant="solid"
                    size="xs"
                  >
                    {{ t('schemas.versions.latest') }}
                  </UBadge>
                  <UBadge 
                    v-else
                    :color="getStatusColor(version.status)" 
                    variant="soft"
                    size="xs"
                  >
                    {{ version.status }}
                  </UBadge>
                </div>
              </UButton>
              
              <div v-if="sortedVersions.length > 5" class="text-xs text-gray-500 dark:text-gray-400 text-center pt-2">
                +{{ sortedVersions.length - 5 }} {{ t('schemas.versions.moreVersions') }}
              </div>
            </div>
          </div>
          
          <!-- Version Statistics -->
          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ t('schemas.versions.statistics.title') }}
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('schemas.status.stable') }}</span>
                <UBadge color="green" variant="soft" size="sm">{{ statusBreakdown.stable }}</UBadge>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('schemas.status.beta') }}</span>
                <UBadge color="blue" variant="soft" size="sm">{{ statusBreakdown.beta }}</UBadge>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('schemas.status.deprecated') }}</span>
                <UBadge color="orange" variant="soft" size="sm">{{ statusBreakdown.deprecated }}</UBadge>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('schemas.status.legacy') }}</span>
                <UBadge color="gray" variant="soft" size="sm">{{ statusBreakdown.legacy }}</UBadge>
              </div>
            </div>
          </div>
          
          <!-- Related Links -->
          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ t('schemas.versions.related.title') }}
            </h3>
            <div class="space-y-2">
              <UButton
                :to="localePath(`/schemas/${framework}`)"
                variant="ghost"
                size="sm"
                icon="i-heroicons-arrow-left"
                class="w-full justify-start"
              >
                {{ t('schemas.versions.related.backToFramework', { framework: framework.toUpperCase() }) }}
              </UButton>
              <UButton
                :to="localePath('/schemas')"
                variant="ghost"
                size="sm"
                icon="i-heroicons-home"
                class="w-full justify-start"
              >
                {{ t('schemas.versions.related.allSchemas') }}
              </UButton>
              <UButton
                :to="localePath('/docs/frameworks/schemas')"
                variant="ghost"
                size="sm"
                icon="i-heroicons-book-open"
                class="w-full justify-start"
              >
                {{ t('schemas.versions.related.documentation') }}
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SchemaMetadata } from '~/composables/useMatrixSchemas'
import MatrixBadge from '~/components/ui/MatrixBadge.vue'

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()

// Get params from route
const framework = computed(() => route.params.framework as string)
const type = computed(() => route.params.type as string)

// Get schemas data
const { getSchemaVersions, getLatestSchemaVersion } = useMatrixSchemas()

const versions = computed(() => getSchemaVersions(framework.value, type.value))
const latestSchema = computed(() => getLatestSchemaVersion(framework.value, type.value))

// Validate schema exists
if (!versions.value.length) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Schema not found'
  })
}

// SEO
useSEO({
  title: t('schemas.versions.seo.title', { 
    schema: latestSchema.value?.title,
    framework: framework.value.toUpperCase() 
  }),
  description: t('schemas.versions.seo.description', { 
    schema: latestSchema.value?.title 
  })
})

// Sort versions by date (latest first)
const sortedVersions = computed(() => {
  return [...versions.value].sort((a, b) => {
    if (a.isLatest) return -1
    if (b.isLatest) return 1
    
    if (a.releaseDate && b.releaseDate) {
      return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    }
    
    return b.version.localeCompare(a.version, undefined, { numeric: true })
  })
})

// Statistics
const statusBreakdown = computed(() => {
  const breakdown = { stable: 0, beta: 0, deprecated: 0, legacy: 0 }
  versions.value.forEach(v => {
    if (v.status && breakdown.hasOwnProperty(v.status)) {
      breakdown[v.status as keyof typeof breakdown]++
    }
  })
  return breakdown
})

const daysSinceLastRelease = computed(() => {
  if (!latestSchema.value?.releaseDate) return 0
  const releaseDate = new Date(latestSchema.value.releaseDate)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - releaseDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// UI Helpers
const getFrameworkIcon = (fw: string): string => {
  const icons: Record<string, string> = {
    mef: 'i-heroicons-cube',
    zof: 'i-heroicons-arrow-path',
    oif: 'i-heroicons-user-group',
    moc: 'i-heroicons-rectangle-stack',
    mal: 'i-heroicons-scale'
  }
  return icons[fw] || 'i-heroicons-document'
}

const getFrameworkClasses = (fw: string): string => {
  const classes: Record<string, string> = {
    mef: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    zof: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    oif: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    moc: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    mal: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
  }
  return classes[fw] || 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
}

const getStatusColor = (status?: string): string => {
  const colors: Record<string, string> = {
    stable: 'green',
    beta: 'blue',
    deprecated: 'orange',
    legacy: 'gray'
  }
  return colors[status || 'stable'] || 'gray'
}

const getVersionIcon = (version: SchemaMetadata): string => {
  if (version.isLatest) return 'i-heroicons-star'
  if (version.status === 'beta') return 'i-heroicons-beaker'
  if (version.status === 'deprecated') return 'i-heroicons-exclamation-triangle'
  if (version.status === 'legacy') return 'i-heroicons-archive-box'
  return 'i-heroicons-check-circle'
}

const getTimelineDotClasses = (version: SchemaMetadata): string => {
  if (version.isLatest) return 'border-blue-500 dark:border-blue-400'
  if (version.status === 'stable') return 'border-green-500 dark:border-green-400'
  if (version.status === 'beta') return 'border-blue-500 dark:border-blue-400'
  if (version.status === 'deprecated') return 'border-orange-500 dark:border-orange-400'
  return 'border-gray-300 dark:border-gray-600'
}

const getTimelineDotTextClasses = (version: SchemaMetadata): string => {
  if (version.isLatest) return 'text-blue-500 dark:text-blue-400'
  if (version.status === 'stable') return 'text-green-500 dark:text-green-400'
  if (version.status === 'beta') return 'text-blue-500 dark:text-blue-400'
  if (version.status === 'deprecated') return 'text-orange-500 dark:text-orange-400'
  return 'text-gray-500 dark:text-gray-400'
}

const getChangeIcon = (change: string): string => {
  if (change.toLowerCase().includes('breaking')) return 'i-heroicons-exclamation-triangle'
  if (change.toLowerCase().includes('added')) return 'i-heroicons-plus'
  if (change.toLowerCase().includes('removed')) return 'i-heroicons-minus'
  if (change.toLowerCase().includes('fixed')) return 'i-heroicons-wrench-screwdriver'
  if (change.toLowerCase().includes('improved') || change.toLowerCase().includes('enhanced')) return 'i-heroicons-arrow-trending-up'
  return 'i-heroicons-check'
}

const getChangeIconColor = (change: string): string => {
  if (change.toLowerCase().includes('breaking')) return 'text-red-500'
  if (change.toLowerCase().includes('added')) return 'text-green-500'
  if (change.toLowerCase().includes('removed')) return 'text-red-500'
  if (change.toLowerCase().includes('fixed')) return 'text-blue-500'
  if (change.toLowerCase().includes('improved') || change.toLowerCase().includes('enhanced')) return 'text-purple-500'
  return 'text-green-500'
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getSchemaViewerUrl = (schema: SchemaMetadata): string => {
  const { locale } = useI18n()
  const cleanPath = schema.localPath
    .replace('{locale}', locale.value)
    .replace(`/content/${locale.value}/`, '/')
  return `/${locale.value}/docs/viewer?file=${encodeURIComponent(cleanPath)}`
}

const openSchemaUrl = (url: string) => {
  window.open(url, '_blank')
}

const downloadSchema = async (schema: SchemaMetadata) => {
  try {
    const response = await $fetch(`/api/schemas/${schema.framework}/${schema.type}/${schema.version}`, {
      method: 'GET'
    })
    
    const blob = new Blob([response as string], { type: 'application/x-yaml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = schema.filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to download schema:', error)
  }
}
</script>