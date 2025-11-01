<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-6">
            <!-- Framework Icon -->
            <div class="flex items-center justify-center p-4 rounded-xl" :class="getFrameworkClasses(framework)">
              <UIcon :name="getFrameworkIcon(framework)" class="w-10 h-10" />
            </div>
            
            <div>
              <div class="flex items-center gap-3 mb-2">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                  {{ t(`frameworks.${framework}.name`) }}
                </h1>
                <MatrixBadge :framework="framework" size="lg" variant="soft">
                  {{ framework.toUpperCase() }}
                </MatrixBadge>
              </div>
              <p class="text-lg text-gray-600 dark:text-gray-400">
                {{ t('schemas.framework.description', { framework: framework.toUpperCase() }) }}
              </p>
            </div>
          </div>
          
          <!-- Breadcrumb -->
          <nav class="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <NuxtLink :to="localePath('/schemas')" class="hover:text-gray-700 dark:hover:text-gray-200">
              {{ t('schemas.title') }}
            </NuxtLink>
            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
            <span class="text-gray-900 dark:text-white">{{ framework.toUpperCase() }}</span>
          </nav>
        </div>
        
        <!-- Stats -->
        <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {{ stats.totalSchemas }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ t('schemas.framework.stats.totalSchemas') }}
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ stats.totalVersions }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ t('schemas.framework.stats.totalVersions') }}
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {{ stats.multiVersionSchemas }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ t('schemas.framework.stats.multiVersion') }}
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {{ stats.latestVersions }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ t('schemas.framework.stats.latest') }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Schemas List -->
      <div class="space-y-6">
        <div
          v-for="schemaType in schemaTypes"
          :key="schemaType.type"
          class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <!-- Schema Type Header -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class="flex items-center justify-center w-12 h-12 rounded-lg" :class="getFrameworkClasses(framework)">
                <UIcon name="i-heroicons-document-text" class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                  {{ schemaType.title }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {{ $t(`schemas.descriptions.${framework}.${schemaType.type}`) }}
                </p>
              </div>
            </div>
            
            <!-- Version indicator -->
            <div class="flex items-center gap-2">
              <UBadge 
                v-if="schemaType.versions.length > 1" 
                color="blue" 
                variant="soft"
                size="sm"
              >
                {{ t('schemas.framework.versions', { count: schemaType.versions.length }) }}
              </UBadge>
              <UBadge 
                :color="getStatusColor(schemaType.latestVersion.status)" 
                variant="outline"
                size="sm"
              >
                v{{ schemaType.latestVersion.version }}
              </UBadge>
            </div>
          </div>

          <!-- Version List -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- Latest Version (destacada) -->
            <div class="lg:col-span-2 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <UBadge color="blue" variant="solid" size="sm">
                    {{ t('schemas.framework.latest') }}
                  </UBadge>
                  <span class="font-mono text-sm font-medium">v{{ schemaType.latestVersion.version }}</span>
                  <UBadge 
                    :color="getStatusColor(schemaType.latestVersion.status)" 
                    variant="soft"
                    size="sm"
                  >
                    {{ t(`schemas.status.${schemaType.latestVersion.status}`) }}
                  </UBadge>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatDate(schemaType.latestVersion.releaseDate) }}
                </span>
              </div>
              
              <!-- Changelog -->
              <div v-if="schemaType.latestVersion.changelog" class="mb-4">
                <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('schemas.framework.changelog') }}:
                </h5>
                <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li v-for="change in schemaType.latestVersion.changelog" :key="change" class="flex items-start gap-2">
                    <UIcon name="i-heroicons-check" class="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                    {{ change }}
                  </li>
                </ul>
              </div>

              <!-- Actions for latest -->
              <div class="flex gap-2">
                <UButton
                  :to="getSchemaViewerUrl(schemaType.latestVersion)"
                  variant="outline"
                  size="sm"
                  icon="i-heroicons-eye"
                >
                  {{ t('schemas.actions.view') }}
                </UButton>
                
                <UButton
                  :to="localePath(`/schemas/${framework}/${schemaType.type}`)"
                  variant="outline"
                  size="sm"
                  icon="i-heroicons-clock"
                  v-if="schemaType.versions.length > 1"
                >
                  {{ t('schemas.framework.viewAllVersions') }}
                </UButton>
                
                <UButton
                  @click="openSchemaUrl(schemaType.latestVersion.url)"
                  variant="outline"
                  size="sm"
                  icon="i-heroicons-arrow-top-right-on-square"
                />
              </div>
            </div>

            <!-- Previous versions (se houver mais de uma versão) -->
            <div 
              v-if="schemaType.versions.length > 1"
              v-for="version in schemaType.previousVersions" 
              :key="version.version"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="font-mono text-sm">v{{ version.version }}</span>
                  <UBadge 
                    :color="getStatusColor(version.status)" 
                    variant="soft"
                    size="sm"
                  >
                    {{ t(`schemas.status.${version.status}`) }}
                  </UBadge>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatDate(version.releaseDate) }}
                </span>
              </div>
              
              <div class="flex gap-2 mt-3">
                <UButton
                  :to="getSchemaViewerUrl(version)"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-eye"
                >
                  {{ t('schemas.actions.view') }}
                </UButton>
                <UButton
                  @click="openSchemaUrl(version.url)"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-arrow-top-right-on-square"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Back to overview -->
      <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <UButton
          :to="localePath('/schemas')"
          variant="ghost"
          icon="i-heroicons-arrow-left"
        >
          {{ t('schemas.framework.backToOverview') }}
        </UButton>
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

// Get framework from route
const framework = computed(() => route.params.framework as string)

// Validate framework exists
const { getAvailableFrameworks, getFrameworkSchemas, getSchemaVersions, hasMultipleVersions, getLatestSchemaVersion } = useMatrixSchemas()
const availableFrameworks = getAvailableFrameworks()

if (!availableFrameworks.includes(framework.value)) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Framework not found'
  })
}

// SEO
useSEO({
  title: t('schemas.framework.seo.title', { framework: framework.value.toUpperCase() }),
  description: t('schemas.framework.seo.description', { framework: framework.value.toUpperCase() })
})

// Get framework schemas
const frameworkSchemas = computed(() => getFrameworkSchemas(framework.value))

// Group schemas by type with version information
const schemaTypes = computed(() => {
  const schemasByType = new Map<string, SchemaMetadata[]>()
  
  // Group by type
  frameworkSchemas.value.forEach(schema => {
    const existing = schemasByType.get(schema.type) || []
    existing.push(schema)
    schemasByType.set(schema.type, existing)
  })
  
  // Transform to format needed for template
  return Array.from(schemasByType.entries()).map(([type, versions]) => {
    // Sort versions by semantic version (latest first)
    const sortedVersions = versions.sort((a, b) => {
      if (a.isLatest) return -1
      if (b.isLatest) return 1
      // Simple version comparison - could be enhanced with proper semver
      return b.version.localeCompare(a.version, undefined, { numeric: true })
    })
    
    const latestVersion = sortedVersions.find(v => v.isLatest) || sortedVersions[0]
    const previousVersions = sortedVersions.filter(v => !v.isLatest)
    
    return {
      type,
      title: latestVersion.title,
      versions: sortedVersions,
      latestVersion,
      previousVersions
    }
  })
})

// Stats
const stats = computed(() => {
  const allVersions = frameworkSchemas.value
  const uniqueTypes = new Set(allVersions.map(s => s.type))
  
  return {
    totalSchemas: uniqueTypes.size,
    totalVersions: allVersions.length,
    multiVersionSchemas: Array.from(uniqueTypes).filter(type => 
      hasMultipleVersions(framework.value, type)
    ).length,
    latestVersions: allVersions.filter(s => s.isLatest).length
  }
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

const formatDate = (dateString?: string): string => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
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
</script>