<template>
  <div 
    class="border rounded-lg p-4 transition-all duration-200"
    :class="cardClasses"
  >
    <!-- Version Header -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-3">
        <h3 class="font-semibold text-gray-900 dark:text-white">
          v{{ schema.version }}
        </h3>
        
        <!-- Status Badges -->
        <UBadge 
          v-if="schema.isLatest" 
          color="blue" 
          variant="solid"
          size="sm"
        >
          {{ t('schemas.versions.latest') }}
        </UBadge>
        
        <UBadge 
          :color="getStatusColor(schema.status)" 
          variant="soft"
          size="sm"
        >
          {{ t(`schemas.status.${schema.status}`) }}
        </UBadge>
        
        <!-- Breaking Change Warning -->
        <UBadge 
          v-if="hasBreakingChanges"
          color="red" 
          variant="outline"
          size="sm"
          class="border-red-300 dark:border-red-700"
        >
          {{ t('schemas.versions.breaking') }}
        </UBadge>
      </div>
      
      <!-- Release Date -->
      <span class="text-sm text-gray-500 dark:text-gray-400">
        {{ formatDate(schema.releaseDate) }}
      </span>
    </div>
    
    <!-- Schema Info -->
    <div v-if="showDetails" class="mb-4 text-sm text-gray-600 dark:text-gray-400">
      <div class="grid grid-cols-2 gap-2">
        <div>
          <span class="font-medium">{{ t('schemas.details.framework') }}:</span>
          <MatrixBadge :framework="schema.framework" size="sm" variant="soft" class="ml-1">
            {{ schema.framework.toUpperCase() }}
          </MatrixBadge>
        </div>
        <div>
          <span class="font-medium">{{ t('schemas.details.type') }}:</span>
          <span class="font-mono ml-1">{{ schema.type }}</span>
        </div>
      </div>
    </div>
    
    <!-- Changelog -->
    <div v-if="showChangelog && schema.changelog && schema.changelog.length > 0" class="mb-4">
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ t('schemas.versions.changelog') }}:
      </h4>
      <ul class="space-y-1">
        <li 
          v-for="change in displayedChanges" 
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
      
      <!-- Show More/Less for long changelogs -->
      <UButton
        v-if="schema.changelog.length > maxChanges && !showAllChanges"
        @click="showAllChanges = true"
        variant="ghost"
        size="xs"
        class="mt-2"
      >
        {{ t('schemas.versions.showMoreChanges', { count: schema.changelog.length - maxChanges }) }}
      </UButton>
      
      <UButton
        v-if="showAllChanges && schema.changelog.length > maxChanges"
        @click="showAllChanges = false"
        variant="ghost"
        size="xs"
        class="mt-2"
      >
        {{ t('schemas.versions.showLessChanges') }}
      </UButton>
    </div>
    
    <!-- Schema URL (if compact) -->
    <div v-if="showUrl" class="mb-4 border-t border-gray-200 dark:border-gray-700 pt-3">
      <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
        {{ t('schemas.details.canonicalUrl') }}:
      </div>
      <div class="flex items-center gap-2">
        <code class="flex-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300 truncate">
          {{ schema.url }}
        </code>
        <UButton
          variant="ghost"
          size="xs"
          icon="i-heroicons-clipboard"
          @click="copyUrl(schema.url)"
          :title="t('schemas.actions.copyUrl')"
        />
      </div>
    </div>
    
    <!-- Actions -->
    <div class="flex flex-wrap gap-2">
      <UButton
        :to="getSchemaViewerUrl(schema)"
        :variant="schema.isLatest ? 'solid' : 'outline'"
        :color="schema.isLatest ? 'primary' : undefined"
        size="sm"
        icon="i-heroicons-eye"
        class="flex-1 sm:flex-none"
      >
        {{ t('schemas.actions.view') }}
      </UButton>
      
      <UButton
        @click="openSchemaUrl(schema.url)"
        variant="outline"
        size="sm"
        icon="i-heroicons-arrow-top-right-on-square"
        :title="t('schemas.actions.openUrl')"
      />
      
      <UButton
        @click="downloadSchema(schema)"
        variant="outline"
        size="sm"
        icon="i-heroicons-arrow-down-tray"
        :title="t('schemas.actions.download')"
      />
      
      <!-- Version History Link -->
      <UButton
        v-if="showVersionLink"
        :to="localePath(`/schemas/${schema.framework}/${schema.type}`)"
        variant="ghost"
        size="sm"
        icon="i-heroicons-clock"
        :title="t('schemas.actions.viewVersions')"
      >
        {{ t('schemas.actions.versions') }}
      </UButton>
      
      <!-- Compare Button (if provided) -->
      <UButton
        v-if="enableCompare && !schema.isLatest"
        @click="$emit('compare', schema)"
        variant="ghost"
        size="sm"
        icon="i-heroicons-arrows-right-left"
        :title="t('schemas.actions.compare')"
      >
        {{ t('schemas.actions.compare') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SchemaMetadata } from '~/composables/useMatrixSchemas'
import MatrixBadge from '~/components/ui/MatrixBadge.vue'

// Props
interface Props {
  schema: SchemaMetadata
  variant?: 'default' | 'compact' | 'detailed'
  showChangelog?: boolean
  showDetails?: boolean
  showUrl?: boolean
  showVersionLink?: boolean
  enableCompare?: boolean
  maxChanges?: number
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  showChangelog: true,
  showDetails: false,
  showUrl: false,
  showVersionLink: false,
  enableCompare: false,
  maxChanges: 3
})

// Emits
defineEmits<{
  compare: [schema: SchemaMetadata]
}>()

// Composables
const { t } = useI18n()
const localePath = useLocalePath()

// State
const showAllChanges = ref(false)

// Computed
const cardClasses = computed(() => {
  const base = 'hover:shadow-md'
  
  if (props.schema.isLatest) {
    return `${base} border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20`
  }
  
  if (props.variant === 'compact') {
    return `${base} border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800`
  }
  
  return `${base} border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800`
})

const hasBreakingChanges = computed(() => {
  return props.schema.changelog?.some(change => 
    change.toLowerCase().includes('breaking')
  ) || false
})

const displayedChanges = computed(() => {
  if (!props.schema.changelog) return []
  
  if (showAllChanges.value || props.schema.changelog.length <= props.maxChanges) {
    return props.schema.changelog
  }
  
  return props.schema.changelog.slice(0, props.maxChanges)
})

// Methods
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

const copyUrl = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url)
    // TODO: Show toast notification
  } catch (error) {
    console.error('Failed to copy URL:', error)
  }
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