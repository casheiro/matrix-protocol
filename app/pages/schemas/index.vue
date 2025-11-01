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
              v-model="selectedFrameworksDisplay"
              :items="frameworkSelectOptions"
              :placeholder="t('schemas.filter.framework')"
              :search-input="false"
              multiple
              size="lg"
              class="w-48"
              @update:model-value="updateSelectedFrameworks"
            />
          </div>
        </div>
        
        <!-- Active filters -->
        <div v-if="activeFilters.length > 0" class="mt-4 flex flex-wrap gap-2">
          <div
            v-for="filter in activeFilters"
            :key="filter.key"
            class="flex items-center gap-1"
          >
            <MatrixBadge
              v-if="filter.key.startsWith('framework-')"
              :framework="filter.key.replace('framework-', '')"
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
            </MatrixBadge>
            <UBadge
              v-else
              color="primary"
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
      </div>

      <!-- Schemas Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div
          v-for="schema in filteredSchemas"
          :key="schema.url"
          class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <!-- Schema Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-stretch gap-3">
              <div class="flex items-center border justify-center p-3 rounded-lg self-stretch aspect-square" :class="getFrameworkClasses(schema.framework)">
                <UIcon :name="getFrameworkIcon(schema.framework)" class="w-7 h-7" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">
                  {{ schema.title }}
                </h3>
                <div class="flex items-baseline gap-2 mt-1">
                  <MatrixBadge :framework="schema.framework" size="sm" variant="soft">
                    {{ schema.framework.toUpperCase() }}
                  </MatrixBadge>
                  <UBadge color="primary" size="sm" variant="outline">
                    v{{ schema.version }}
                  </UBadge>
                </div>
              </div>
            </div>
          </div>

          <!-- Schema Description -->
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {{ $t(`schemas.descriptions.${schema.framework}.${schema.type}`) }}
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
          v-if="searchQuery || selectedFrameworks.length > 0"
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
import MatrixBadge from '~/components/ui/MatrixBadge.vue'

const { t } = useI18n()

// SEO
useSEO({
  title: t('schemas.seo.title'),
  description: t('schemas.seo.description')
})

// State
const searchQuery = ref('')
const selectedFrameworks = ref<string[]>([]) // Array para múltiplos frameworks
const selectedFrameworksDisplay = ref<string[]>([]) // Array para valores de display

// Data - tornando reativo
const { getAllSchemas, getAvailableFrameworks } = useMatrixSchemas()

const allSchemas = computed(() => getAllSchemas())
const frameworks = computed(() => getAvailableFrameworks())

// Computed
const stats = computed(() => ({
  totalSchemas: allSchemas.value.length,
  frameworks: frameworks.value.length
}))

// Opções para USelectMenu (apenas frameworks, sem "todos")
const frameworkSelectOptions = computed(() => {
  return frameworks.value.map(fw => fw.toUpperCase())
})

// Mapeamento simplificado para converter valores do USelectMenu para valores internos
const frameworkValueMap = computed(() => {
  const map: Record<string, string> = {}
  frameworks.value.forEach(fw => {
    map[fw.toUpperCase()] = fw
  })
  return map
})

const filteredSchemas = computed(() => {
  let filtered = allSchemas.value

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(schema =>
      schema.title.toLowerCase().includes(query) ||
      schema.framework.toLowerCase().includes(query) ||
      schema.type.toLowerCase().includes(query)
    )
  }

  // Filter by frameworks (múltiplos)
  if (selectedFrameworks.value.length > 0) {
    filtered = filtered.filter(schema => 
      selectedFrameworks.value.includes(schema.framework)
    )
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

  // Criar um filtro para cada framework selecionado
  selectedFrameworks.value.forEach(framework => {
    filters.push({
      key: `framework-${framework}`,
      label: `${t('schemas.filter.framework')}: ${framework.toUpperCase()}`,
      color: 'blue'
    })
  })

  return filters
})

// Methods - ajustados para multiselect
const updateSelectedFrameworks = (displayValues: string[]) => {
  selectedFrameworksDisplay.value = displayValues
  selectedFrameworks.value = displayValues.map(display => frameworkValueMap.value[display]).filter(Boolean) as string[]
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedFrameworks.value = []
  selectedFrameworksDisplay.value = []
}

const removeFilter = (key: string) => {
  if (key === 'search') {
    searchQuery.value = ''
  } else if (key.startsWith('framework-')) {
    // Remover framework específico
    const framework = key.replace('framework-', '')
    selectedFrameworks.value = selectedFrameworks.value.filter(fw => fw !== framework)
    selectedFrameworksDisplay.value = selectedFrameworksDisplay.value.filter(display => 
      frameworkValueMap.value[display] !== framework
    )
  }
}

// Função removida - agora usando MatrixBadge com cores customizadas

const getFrameworkIcon = (framework: string): string => {
  const icons: Record<string, string> = {
    mef: 'i-heroicons-cube',
    zof: 'i-heroicons-arrow-path',
    oif: 'i-heroicons-user-group',
    moc: 'i-heroicons-rectangle-stack', // Mais simétrico que building-office
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
  // Remove o prefixo /content/{locale}/ para compatibilidade com a API
  const cleanPath = schema.localPath
    .replace('{locale}', locale.value)
    .replace(`/content/${locale.value}/`, '/')
  return `/${locale.value}/docs/viewer?file=${encodeURIComponent(cleanPath)}`
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