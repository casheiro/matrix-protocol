<template>
  <div class="relative">
    <!-- Timeline Container -->
    <div class="space-y-6">
      <div
        v-for="(version, index) in sortedVersions"
        :key="version.version"
        class="relative"
      >
        <!-- Timeline line (except for last item) -->
        <div 
          v-if="index < sortedVersions.length - 1"
          class="absolute left-4 top-12 w-0.5 bg-gray-200 dark:bg-gray-700"
          :style="{ height: `calc(100% + 1.5rem)` }"
        ></div>
        
        <!-- Timeline item -->
        <div class="relative flex items-start gap-4">
          <!-- Timeline dot -->
          <div 
            class="relative flex items-center justify-center w-8 h-8 rounded-full border-2 bg-white dark:bg-gray-800 z-10"
            :class="getTimelineDotClasses(version)"
          >
            <UIcon 
              :name="getVersionIcon(version)" 
              class="w-4 h-4"
              :class="getTimelineDotTextClasses(version)"
            />
            
            <!-- Pulse animation for latest version -->
            <div 
              v-if="version.isLatest"
              class="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-75"
            ></div>
          </div>
          
          <!-- Content -->
          <div class="flex-1 min-w-0 pb-8">
            <!-- Date and time info -->
            <div class="flex items-center justify-between mb-2">
              <time 
                :datetime="version.releaseDate"
                class="text-sm font-medium text-gray-900 dark:text-white"
              >
                {{ formatDate(version.releaseDate) }}
              </time>
              <span 
                v-if="version.releaseDate"
                class="text-xs text-gray-500 dark:text-gray-400"
              >
                {{ getRelativeTime(version.releaseDate) }}
              </span>
            </div>
            
            <!-- Version card -->
            <div 
              class="border rounded-lg p-4 transition-all duration-200 hover:shadow-md"
              :class="getVersionCardClasses(version)"
            >
              <!-- Version header -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    v{{ version.version }}
                  </h3>
                  
                  <!-- Badges -->
                  <div class="flex items-center gap-2">
                    <UBadge 
                      v-if="version.isLatest" 
                      color="blue" 
                      variant="solid"
                      size="sm"
                    >
                      {{ t('schemas.timeline.latest') }}
                    </UBadge>
                    
                    <UBadge 
                      :color="getStatusColor(version.status)" 
                      variant="soft"
                      size="sm"
                    >
                      {{ t(`schemas.status.${version.status}`) }}
                    </UBadge>
                    
                    <!-- Breaking changes warning -->
                    <UBadge 
                      v-if="hasBreakingChanges(version)"
                      color="red" 
                      variant="outline"
                      size="sm"
                      class="border-red-300 dark:border-red-700"
                    >
                      <UIcon name="i-heroicons-exclamation-triangle" class="w-3 h-3 mr-1" />
                      {{ t('schemas.timeline.breaking') }}
                    </UBadge>
                  </div>
                </div>
                
                <!-- Quick actions -->
                <div class="flex items-center gap-1">
                  <UButton
                    :to="getSchemaViewerUrl(version)"
                    variant="ghost"
                    size="sm"
                    icon="i-heroicons-eye"
                    :title="t('schemas.actions.view')"
                  />
                  <UButton
                    @click="$emit('download', version)"
                    variant="ghost"
                    size="sm"
                    icon="i-heroicons-arrow-down-tray"
                    :title="t('schemas.actions.download')"
                  />
                  <UButton
                    v-if="enableCompare && !version.isLatest"
                    @click="$emit('compare', version)"
                    variant="ghost"
                    size="sm"
                    icon="i-heroicons-arrows-right-left"
                    :title="t('schemas.actions.compare')"
                  />
                </div>
              </div>
              
              <!-- Changelog -->
              <div v-if="version.changelog && version.changelog.length > 0" class="mb-4">
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {{ t('schemas.timeline.whatsNew') }}:
                </h4>
                <ul class="space-y-2">
                  <li 
                    v-for="change in getDisplayedChanges(version)" 
                    :key="change"
                    class="flex items-start gap-3 text-sm"
                  >
                    <div 
                      class="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 mt-0.5"
                      :class="getChangeIconBg(change)"
                    >
                      <UIcon 
                        :name="getChangeIcon(change)" 
                        class="w-3 h-3"
                        :class="getChangeIconColor(change)"
                      />
                    </div>
                    <span class="text-gray-600 dark:text-gray-400">{{ change }}</span>
                  </li>
                </ul>
                
                <!-- Show more changes -->
                <UButton
                  v-if="version.changelog.length > maxChanges && !expandedVersions.has(version.version)"
                  @click="expandVersion(version.version)"
                  variant="ghost"
                  size="xs"
                  class="mt-3"
                >
                  {{ t('schemas.timeline.showMoreChanges', { count: version.changelog.length - maxChanges }) }}
                </UButton>
                
                <UButton
                  v-if="expandedVersions.has(version.version) && version.changelog.length > maxChanges"
                  @click="collapseVersion(version.version)"
                  variant="ghost"
                  size="xs"
                  class="mt-3"
                >
                  {{ t('schemas.timeline.showLessChanges') }}
                </UButton>
              </div>
              
              <!-- Migration info -->
              <div v-if="showMigrationInfo && hasBreakingChanges(version)" class="mb-4">
                <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                  <div class="flex items-start gap-2">
                    <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div class="text-sm">
                      <p class="font-medium text-amber-800 dark:text-amber-200 mb-1">
                        {{ t('schemas.timeline.migrationRequired') }}
                      </p>
                      <p class="text-amber-700 dark:text-amber-300">
                        {{ t('schemas.timeline.migrationDescription') }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Actions bar -->
              <div class="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-2">
                  <UButton
                    :to="getSchemaViewerUrl(version)"
                    :variant="version.isLatest ? 'solid' : 'outline'"
                    :color="version.isLatest ? 'primary' : undefined"
                    size="sm"
                    icon="i-heroicons-eye"
                  >
                    {{ t('schemas.actions.view') }}
                  </UButton>
                  
                  <UButton
                    @click="openSchemaUrl(version.url)"
                    variant="outline"
                    size="sm"
                    icon="i-heroicons-arrow-top-right-on-square"
                  >
                    {{ t('schemas.actions.openUrl') }}
                  </UButton>
                </div>
                
                <!-- Version metadata -->
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ t('schemas.timeline.filename') }}: 
                  <code class="font-mono">{{ version.filename }}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Timeline end marker -->
    <div v-if="sortedVersions.length > 0" class="relative flex items-center justify-center mt-6">
      <div class="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      <span class="ml-3 text-sm text-gray-500 dark:text-gray-400">
        {{ t('schemas.timeline.endOfHistory') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SchemaMetadata } from '~/composables/useMatrixSchemas'

// Props
interface Props {
  versions: SchemaMetadata[]
  maxChanges?: number
  showMigrationInfo?: boolean
  enableCompare?: boolean
  sortOrder?: 'desc' | 'asc'
}

const props = withDefaults(defineProps<Props>(), {
  maxChanges: 3,
  showMigrationInfo: true,
  enableCompare: false,
  sortOrder: 'desc'
})

// Emits
defineEmits<{
  download: [version: SchemaMetadata]
  compare: [version: SchemaMetadata]
}>()

// Composables
const { t } = useI18n()

// State
const expandedVersions = ref(new Set<string>())

// Computed
const sortedVersions = computed(() => {
  const sorted = [...props.versions].sort((a, b) => {
    if (a.isLatest) return -1
    if (b.isLatest) return 1
    
    if (a.releaseDate && b.releaseDate) {
      const dateA = new Date(a.releaseDate).getTime()
      const dateB = new Date(b.releaseDate).getTime()
      return props.sortOrder === 'desc' ? dateB - dateA : dateA - dateB
    }
    
    const versionCompare = b.version.localeCompare(a.version, undefined, { numeric: true })
    return props.sortOrder === 'desc' ? versionCompare : -versionCompare
  })
  
  return sorted
})

// Methods
const expandVersion = (version: string) => {
  expandedVersions.value.add(version)
}

const collapseVersion = (version: string) => {
  expandedVersions.value.delete(version)
}

const getDisplayedChanges = (version: SchemaMetadata) => {
  if (!version.changelog) return []
  
  if (expandedVersions.value.has(version.version) || version.changelog.length <= props.maxChanges) {
    return version.changelog
  }
  
  return version.changelog.slice(0, props.maxChanges)
}

const hasBreakingChanges = (version: SchemaMetadata): boolean => {
  return version.changelog?.some(change => 
    change.toLowerCase().includes('breaking')
  ) || false
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

const getVersionCardClasses = (version: SchemaMetadata): string => {
  if (version.isLatest) {
    return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
  }
  return 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
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

const getChangeIcon = (change: string): string => {
  if (change.toLowerCase().includes('breaking')) return 'i-heroicons-exclamation-triangle'
  if (change.toLowerCase().includes('added')) return 'i-heroicons-plus'
  if (change.toLowerCase().includes('removed')) return 'i-heroicons-minus'
  if (change.toLowerCase().includes('fixed')) return 'i-heroicons-wrench-screwdriver'
  if (change.toLowerCase().includes('improved') || change.toLowerCase().includes('enhanced')) return 'i-heroicons-arrow-trending-up'
  return 'i-heroicons-check'
}

const getChangeIconColor = (change: string): string => {
  if (change.toLowerCase().includes('breaking')) return 'text-red-600 dark:text-red-400'
  if (change.toLowerCase().includes('added')) return 'text-green-600 dark:text-green-400'
  if (change.toLowerCase().includes('removed')) return 'text-red-600 dark:text-red-400'
  if (change.toLowerCase().includes('fixed')) return 'text-blue-600 dark:text-blue-400'
  if (change.toLowerCase().includes('improved') || change.toLowerCase().includes('enhanced')) return 'text-purple-600 dark:text-purple-400'
  return 'text-green-600 dark:text-green-400'
}

const getChangeIconBg = (change: string): string => {
  if (change.toLowerCase().includes('breaking')) return 'bg-red-100 dark:bg-red-900/30'
  if (change.toLowerCase().includes('added')) return 'bg-green-100 dark:bg-green-900/30'
  if (change.toLowerCase().includes('removed')) return 'bg-red-100 dark:bg-red-900/30'
  if (change.toLowerCase().includes('fixed')) return 'bg-blue-100 dark:bg-blue-900/30'
  if (change.toLowerCase().includes('improved') || change.toLowerCase().includes('enhanced')) return 'bg-purple-100 dark:bg-purple-900/30'
  return 'bg-green-100 dark:bg-green-900/30'
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getRelativeTime = (dateString?: string): string => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return t('schemas.timeline.yesterday')
  if (diffDays < 7) return t('schemas.timeline.daysAgo', { days: diffDays })
  if (diffDays < 30) return t('schemas.timeline.weeksAgo', { weeks: Math.ceil(diffDays / 7) })
  if (diffDays < 365) return t('schemas.timeline.monthsAgo', { months: Math.ceil(diffDays / 30) })
  return t('schemas.timeline.yearsAgo', { years: Math.ceil(diffDays / 365) })
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