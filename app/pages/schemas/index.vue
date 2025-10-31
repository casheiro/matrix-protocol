<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ t('schemas.title') }}
            </h1>
            <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
              {{ t('schemas.description') }}
            </p>
          </div>
          
          <!-- Stats -->
          <div class="hidden md:flex items-center gap-6">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {{ stats.totalSchemas }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ t('schemas.stats.totalSchemas') }}
              </div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                {{ stats.frameworks }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ t('schemas.stats.frameworks') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filter and Search -->
      <div class="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div class="flex-1">
            <UInput
              v-model="searchQuery"
              :placeholder="t('schemas.search.placeholder')"
              icon="i-heroicons-magnifying-glass"
              size="lg"
              class="w-full"
            />
          </div>
          
          <div class="flex gap-3">
            <USelectMenu
              v-model="selectedFramework"
              :options="frameworkOptions"
              :placeholder="t('schemas.filter.framework')"
              size="lg"
              class="w-48"
            />
            
            <UButton
              v-if="searchQuery || selectedFramework"
              variant="outline"
              size="lg"
              icon="i-heroicons-x-mark"
              @click="clearFilters"
            >
              {{ t('schemas.filter.clear') }}
            </UButton>
          </div>
        </div>
        
        <!-- Active filters -->
        <div v-if="activeFilters.length > 0" class="mt-4 flex flex-wrap gap-2">
          <UBadge
            v-for="filter in activeFilters"
            :key="filter.key"
            :color="filter.color"
            variant="soft"
            size="sm"
            class="flex items-center gap-1"
          >
            {{ filter.label }}
            <UButton
              variant="ghost"
              size="xs"
              icon="i-heroicons-x-mark"
              @click="removeFilter(filter.key)"
              class="ml-1 -mr-1"
            />
          </UBadge>
        </div>
      </div>

      <!-- Schemas Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div
          v-for="schema in filteredSchemas"
          :key="schema.url"
          class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <!-- Schema Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg" :class="getFrameworkClasses(schema.framework)">
                <UIcon :name="getFrameworkIcon(schema.framework)" class="w-5 h-5" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">
                  {{ schema.title }}
                </h3>
                <div class="flex items-center gap-2 mt-1">
                  <UBadge :color="getFrameworkColor(schema.framework)" size="sm" variant="soft">
                    {{ schema.framework.toUpperCase() }}
                  </UBadge>
                  <UBadge color="primary" size="sm" variant="outline">
                    v{{ schema.version }}
                  </UBadge>
                </div>
              </div>
            </div>
          </div>

          <!-- Schema Description -->
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {{ schema.description }}
          </p>

          <!-- Schema Details -->
          <div class="space-y-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
            <div class="flex items-center justify-between">
              <span>{{ t('schemas.details.type') }}:</span>
              <span class="font-mono">{{ schema.type }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span>{{ t('schemas.details.filename') }}:</span>
              <span class="font-mono">{{ schema.filename }}</span>
            </div>
          </div>

          <!-- Schema URL -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
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
          <div class="flex gap-2 mt-4">
            <UButton
              :to="getSchemaViewerUrl(schema)"
              variant="outline"
              size="sm"
              icon="i-heroicons-eye"
              class="flex-1"
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
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredSchemas.length === 0"
        class="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {{ t('schemas.empty.title') }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ t('schemas.empty.description') }}
        </p>
        <UButton
          v-if="searchQuery || selectedFramework"
          @click="clearFilters"
          variant="outline"
        >
          {{ t('schemas.empty.clearFilters') }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SchemaMetadata } from '~/composables/useMatrixSchemas'

const { t } = useI18n()
const { getAllSchemas, getAvailableFrameworks } = useMatrixSchemas()

// SEO
useSEO({
  title: t('schemas.seo.title'),
  description: t('schemas.seo.description')
})

// State
const searchQuery = ref('')
const selectedFramework = ref('')

// Data
const allSchemas = getAllSchemas()
const frameworks = getAvailableFrameworks()

// Computed
const stats = computed(() => ({
  totalSchemas: allSchemas.length,
  frameworks: frameworks.length
}))

const frameworkOptions = computed(() => [
  { label: t('schemas.filter.allFrameworks'), value: '' },
  ...frameworks.map(fw => ({
    label: fw.toUpperCase(),
    value: fw
  }))
])

const filteredSchemas = computed(() => {
  let filtered = allSchemas

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(schema =>
      schema.title.toLowerCase().includes(query) ||
      schema.description.toLowerCase().includes(query) ||
      schema.framework.toLowerCase().includes(query) ||
      schema.type.toLowerCase().includes(query)
    )
  }

  // Filter by framework
  if (selectedFramework.value) {
    filtered = filtered.filter(schema => schema.framework === selectedFramework.value)
  }

  return filtered
})

const activeFilters = computed(() => {
  const filters: Array<{ key: string; label: string; color: string }> = []

  if (searchQuery.value.trim()) {
    filters.push({
      key: 'search',
      label: `${t('schemas.filter.search')}: "${searchQuery.value}"`,
      color: 'blue'
    })
  }

  if (selectedFramework.value) {
    filters.push({
      key: 'framework',
      label: `${t('schemas.filter.framework')}: ${selectedFramework.value.toUpperCase()}`,
      color: getFrameworkColor(selectedFramework.value)
    })
  }

  return filters
})

// Methods
const clearFilters = () => {
  searchQuery.value = ''
  selectedFramework.value = ''
}

const removeFilter = (key: string) => {
  if (key === 'search') {
    searchQuery.value = ''
  } else if (key === 'framework') {
    selectedFramework.value = ''
  }
}

const getFrameworkColor = (framework: string): "primary" | "secondary" | "success" | "warning" | "error" => {
  const colors: Record<string, "primary" | "secondary" | "success" | "warning" | "error"> = {
    mef: 'success',   // Verde
    zof: 'warning',   // Laranja  
    oif: 'primary',   // Azul
    moc: 'secondary', // Roxo
    mal: 'error'      // Vermelho
  }
  return colors[framework] || 'primary'
}

const getFrameworkIcon = (framework: string): string => {
  const icons: Record<string, string> = {
    mef: 'i-heroicons-cube',
    zof: 'i-heroicons-arrow-path',
    oif: 'i-heroicons-user-group',
    moc: 'i-heroicons-building-office',
    mal: 'i-heroicons-scale'
  }
  return icons[framework] || 'i-heroicons-document'
}

const getFrameworkClasses = (framework: string): string => {
  const classes: Record<string, string> = {
    mef: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    zof: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    oif: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    moc: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    mal: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
  }
  return classes[framework] || 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
}

const getSchemaViewerUrl = (schema: SchemaMetadata): string => {
  const { locale } = useI18n()
  return `/${locale.value}/docs/viewer?file=${encodeURIComponent(schema.localPath.replace('{locale}', locale.value))}`
}

const copyUrl = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url)
    // TODO: Show toast notification
  } catch (error) {
    console.error('Failed to copy URL:', error)
  }
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