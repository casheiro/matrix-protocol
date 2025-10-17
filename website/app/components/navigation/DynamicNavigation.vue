<!--
/**
 * Dynamic Navigation Component
 * 
 * Renders adaptive navigation based on content structure and user context
 * Uses navigation API endpoints for real-time content discovery
 * 
 * @author Marina Costa (Frontend Engineer)
 * @created 2025-10-16
 * @task TASK-2.4
 */
-->

<template>
  <nav 
    class="dynamic-navigation"
    :class="{ 'is-mobile': isMobile, 'is-loading': isLoading }"
    :aria-label="$t('navigation.dynamicNavLabel')"
  >
    <!-- Navigation Header -->
    <div class="nav-header flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
        {{ $t('navigation.dynamicTitle') }}
      </h3>
      
      <!-- Toggle Button for Mobile -->
      <button
        v-if="collapsible"
        @click="toggleCollapsed"
        class="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        :aria-label="isCollapsed ? $t('navigation.expand') : $t('navigation.collapse')"
      >
        <UIcon 
          :name="isCollapsed ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-up'"
          class="w-4 h-4 text-gray-500"
        />
      </button>
    </div>

    <!-- Navigation Content -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-96"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 max-h-96"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-show="!isCollapsed || !collapsible" class="nav-content overflow-hidden">
        <!-- Loading State -->
        <div v-if="isLoading" class="p-4">
          <div class="space-y-3">
            <USkeleton class="h-4 w-full" />
            <USkeleton class="h-4 w-3/4" />
            <USkeleton class="h-4 w-1/2" />
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-4">
          <UAlert
            icon="i-heroicons-exclamation-triangle"
            color="error"
            variant="subtle"
            :title="$t('navigation.errorTitle')"
            :description="error"
          />
          <UButton
            @click="refreshNavigation"
            variant="outline"
            size="sm"
            class="mt-3"
          >
            {{ $t('navigation.retry') }}
          </UButton>
        </div>

        <!-- Navigation Tree -->
        <NavigationTree
          v-else-if="navigationData"
          :items="navigationData"
          :current-path="currentPath"
          :max-depth="maxDepth"
          :show-icons="showIcons"
          :show-descriptions="showDescriptions"
          @navigate="handleNavigate"
          class="p-2"
        />

        <!-- Empty State -->
        <div v-else class="p-4 text-center">
          <UIcon name="i-heroicons-document-text" class="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ $t('navigation.noContent') }}
          </p>
        </div>
      </div>
    </Transition>

    <!-- Performance Info (Debug Mode) -->
    <div v-if="showDebugInfo && navigationStats" class="nav-debug border-t border-gray-200 dark:border-gray-700 p-2">
      <details class="group">
        <summary class="text-xs text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
          {{ $t('navigation.debugInfo') }} ({{ navigationStats.responseTime }}ms)
        </summary>
        <div class="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <div>{{ $t('navigation.totalPages') }}: {{ navigationStats.totalPages }}</div>
          <div>{{ $t('navigation.cacheHit') }}: {{ navigationStats.cached ? '✓' : '✗' }}</div>
          <div>{{ $t('navigation.locale') }}: {{ effectiveLocale }}</div>
        </div>
      </details>
    </div>
  </nav>
</template>

<script setup lang="ts">

// Props
interface Props {
  // Display configuration
  collapsible?: boolean
  maxDepth?: number
  showIcons?: boolean
  showDescriptions?: boolean
  
  // Content filtering
  section?: string
  locale?: string
  
  // UI customization
  isMobile?: boolean
  showDebugInfo?: boolean
  
  // Cache configuration
  enableCache?: boolean
  refreshInterval?: number // minutes
}

const props = withDefaults(defineProps<Props>(), {
  collapsible: false,
  maxDepth: 3,
  showIcons: true,
  showDescriptions: true,
  isMobile: false,
  showDebugInfo: false,
  enableCache: true,
  refreshInterval: 5
})

// Composables
const { $i18n } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const {
  currentLocale,
  fetchNavigationTree,
  isNavigationLoading,
  getNavigationError
} = useNavigationI18n()

// State
const isCollapsed = ref(false)
const isLoading = ref(false)
const error = ref<string | null>(null)
const navigationData = ref<NavigationNode[] | null>(null)
const navigationStats = ref<any>(null)
const lastFetch = ref<Date | null>(null)

// Computed  
const effectiveLocale = computed(() => props.locale || currentLocale.value.code)
const currentPath = computed(() => route.path)

// Auto-refresh functionality
let refreshTimer: NodeJS.Timeout | null = null

// Methods
const fetchNavigation = async (force = false) => {
  // Use enhanced i18n navigation fetching
  try {
    const tree = await fetchNavigationTree(effectiveLocale.value, {
      section: props.section,
      depth: props.maxDepth,
      cache: props.enableCache,
      force
    })
    
    if (tree) {
      navigationData.value = tree
      navigationStats.value = {
        totalPages: tree.length,
        responseTime: 0, // Will be updated by the composable
        cached: !force
      }
      lastFetch.value = new Date()
    }
    
    // Update loading and error states from composable
    isLoading.value = isNavigationLoading(effectiveLocale.value)
    error.value = getNavigationError(effectiveLocale.value)
    
  } catch (err) {
    console.error('Failed to fetch navigation:', err)
    error.value = err instanceof Error ? err.message : $i18n.t('navigation.fetchError')
    isLoading.value = false
  }
}

const refreshNavigation = () => {
  fetchNavigation(true)
}

const toggleCollapsed = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleNavigate = (path: string) => {
  router.push(path)
}

const setupAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
  
  if (props.refreshInterval > 0) {
    refreshTimer = setInterval(() => {
      fetchNavigation()
    }, props.refreshInterval * 60 * 1000) // Convert minutes to milliseconds
  }
}

// Lifecycle
onMounted(() => {
  fetchNavigation()
  setupAutoRefresh()
})

onBeforeUnmount(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})

// Watch for locale changes
watch(() => effectiveLocale.value, () => {
  fetchNavigation(true)
})

// Watch for section changes
watch(() => props.section, () => {
  fetchNavigation(true)
})

// Expose public methods
defineExpose({
  refresh: refreshNavigation,
  toggleCollapse: toggleCollapsed
})
</script>

<style scoped>
.dynamic-navigation {
  @apply bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden;
}

.dynamic-navigation.is-mobile {
  @apply border-0 rounded-none;
}

.dynamic-navigation.is-loading {
  @apply opacity-75;
}

.nav-content {
  @apply transition-all duration-200;
}

.nav-debug {
  @apply bg-gray-50 dark:bg-gray-800;
}

/* Transition utilities for better performance */
.max-h-0 {
  max-height: 0;
}

.max-h-96 {
  max-height: 24rem;
}
</style>