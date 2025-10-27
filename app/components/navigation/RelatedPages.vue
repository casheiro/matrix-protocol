<!--
/**
 * Related Pages Component
 * 
 * Shows contextually relevant pages including siblings, parent, and children
 * Uses navigation API for dynamic content discovery
 * 
 * @author Marina Costa (Frontend Engineer)
 * @created 2025-10-16
 * @task TASK-2.4
 */
-->

<template>
  <aside 
    class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
    :class="{ 'p-4': compact, 'opacity-75': isLoading }"
    :aria-label="$t('navigation.relatedPagesLabel')"
  >
    <!-- Section Header -->
    <div class="border-b border-gray-100 dark:border-gray-800 pb-2 mb-4 flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ $t('navigation.relatedPages') }}
      </h3>
      
      <!-- Refresh Button -->
      <button
        @click="refresh"
        :disabled="isLoading"
        class="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        :aria-label="$t('navigation.refreshRelated')"
      >
        <UIcon 
          name="i-heroicons-arrow-path"
          class="w-4 h-4 text-gray-500"
          :class="{ 'animate-spin': isLoading }"
        />
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="space-y-2">
        <USkeleton class="h-4 w-24" />
        <USkeleton class="h-12 w-full" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-6">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 mx-auto text-red-500 mb-2" />
      <p class="text-sm text-red-600 dark:text-red-400 mb-3">{{ error }}</p>
      <UButton @click="refresh" variant="outline" size="sm">
        {{ $t('navigation.retry') }}
      </UButton>
    </div>

    <!-- Related Content -->
    <div v-else class="space-y-6">
      <!-- Parent Page -->
      <div v-if="parentPage" class="border-t border-gray-100 dark:border-gray-800 pt-6 first:border-t-0 first:pt-0">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
          {{ $t('navigation.parentPage') }}
        </h4>
        <RelatedPageCard
          :page="parentPage"
          type="parent"
          :show-icons="showIcons"
          :show-descriptions="showDescriptions"
          @navigate="handleNavigate"
        />
      </div>

      <!-- Sibling Pages -->
      <div v-if="siblingPages.length > 0" class="border-t border-gray-100 dark:border-gray-800 pt-6 first:border-t-0 first:pt-0">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
          {{ $t('navigation.siblingPages') }}
        </h4>
        <div class="max-h-96 overflow-y-auto space-y-2">
          <RelatedPageCard
            v-for="page in visibleSiblings"
            :key="page.path"
            :page="page"
            type="sibling"
            :show-icons="showIcons"
            :show-descriptions="showDescriptions"
            @navigate="handleNavigate"
          />
        </div>
        
        <!-- Show More Siblings -->
        <UButton
          v-if="siblingPages.length > visibleSiblingsCount"
          @click="showMoreSiblings"
          variant="ghost"
          size="sm"
          class="mt-2 w-full"
        >
          {{ $t('navigation.showMoreSiblings', { count: siblingPages.length - visibleSiblingsCount }) }}
        </UButton>
      </div>

      <!-- Child Pages -->
      <div v-if="childPages.length > 0" class="border-t border-gray-100 dark:border-gray-800 pt-6 first:border-t-0 first:pt-0">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
          {{ $t('navigation.childPages') }}
        </h4>
        <div class="max-h-96 overflow-y-auto space-y-2">
          <RelatedPageCard
            v-for="page in visibleChildren"
            :key="page.path"
            :page="page"
            type="child"
            :show-icons="showIcons"
            :show-descriptions="showDescriptions"
            @navigate="handleNavigate"
          />
        </div>
        
        <!-- Show More Children -->
        <UButton
          v-if="childPages.length > visibleChildrenCount"
          @click="showMoreChildren"
          variant="ghost"
          size="sm"
          class="mt-2 w-full"
        >
          {{ $t('navigation.showMoreChildren', { count: childPages.length - visibleChildrenCount }) }}
        </UButton>
      </div>

      <!-- Empty State -->
      <div v-if="!parentPage && siblingPages.length === 0 && childPages.length === 0" class="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-center py-8">
        <UIcon name="i-heroicons-document-text" class="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ $t('navigation.noRelatedPages') }}
        </p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
// Tipos auto-importados do shared/types/

// Props
interface Props {
  // Content configuration
  path?: string
  locale?: string
  
  // Display options
  compact?: boolean
  maxSiblings?: number
  maxChildren?: number
  showIcons?: boolean
  showDescriptions?: boolean
  
  // Cache configuration
  enableCache?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
  maxSiblings: 3,
  maxChildren: 3,
  showIcons: true,
  showDescriptions: true,
  enableCache: true
})

// Composables
const { $i18n } = useNuxtApp()
const route = useRoute()
const router = useRouter()

// State
const isLoading = ref(false)
const error = ref<string | null>(null)
const parentPage = ref<NavigationNode | null>(null)
const siblingPages = ref<NavigationNode[]>([])
const childPages = ref<NavigationNode[]>([])
const visibleSiblingsCount = ref(props.maxSiblings)
const visibleChildrenCount = ref(props.maxChildren)

// Computed
const currentPath = computed(() => props.path || route.path)
const currentLocale = computed(() => props.locale || $i18n.locale.value)

const visibleSiblings = computed(() => {
  return siblingPages.value.slice(0, visibleSiblingsCount.value)
})

const visibleChildren = computed(() => {
  return childPages.value.slice(0, visibleChildrenCount.value)
})

// Methods
const fetchRelatedPages = async () => {
  isLoading.value = true
  error.value = null

  try {
    const query = new URLSearchParams({
      path: currentPath.value,
      locale: currentLocale.value,
      cache: props.enableCache ? 'true' : 'false'
    })

    const response = await $fetch<SiblingsResponse>(`/api/navigation/siblings?${query.toString()}`)
    
    parentPage.value = response.parent || null
    siblingPages.value = response.siblings || []
    childPages.value = response.children || []
    
    // Reset visible counts when data changes
    visibleSiblingsCount.value = props.maxSiblings
    visibleChildrenCount.value = props.maxChildren
    
  } catch (err) {
    console.error('Failed to fetch related pages:', err)
    error.value = err instanceof Error ? err.message : $i18n.t('navigation.fetchError')
    
    // Reset state on error
    parentPage.value = null
    siblingPages.value = []
    childPages.value = []
  } finally {
    isLoading.value = false
  }
}

const handleNavigate = (path: string) => {
  router.push(path)
}

const showMoreSiblings = () => {
  visibleSiblingsCount.value = Math.min(
    visibleSiblingsCount.value + props.maxSiblings,
    siblingPages.value.length
  )
}

const showMoreChildren = () => {
  visibleChildrenCount.value = Math.min(
    visibleChildrenCount.value + props.maxChildren,
    childPages.value.length
  )
}

const refresh = () => {
  fetchRelatedPages()
}

// Lifecycle
onMounted(() => {
  fetchRelatedPages()
})

// Watch for path changes
watch(() => currentPath.value, () => {
  fetchRelatedPages()
})

// Watch for locale changes
watch(() => currentLocale.value, () => {
  fetchRelatedPages()
})

// Expose public methods
defineExpose({
  refresh
})
</script>