<!--
/**
 * Breadcrumbs Component
 * 
 * Renders breadcrumb navigation trail using navigation API
 * Supports rich structured data and accessibility features
 * 
 * @author Marina Costa (Frontend Engineer)
 * @created 2025-10-16
 * @task TASK-2.4
 */
-->

<template>
  <nav 
    class="breadcrumbs"
    :class="{ 'is-compact': compact, 'is-loading': isLoading }"
    :aria-label="$t('navigation.breadcrumbsLabel')"
  >
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center space-x-2">
      <USkeleton class="h-4 w-20" />
      <span class="text-gray-400">/</span>
      <USkeleton class="h-4 w-32" />
      <span class="text-gray-400">/</span>
      <USkeleton class="h-4 w-24" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-sm text-red-600 dark:text-red-400">
      {{ $t('navigation.breadcrumbsError') }}
    </div>

    <!-- Breadcrumb Trail -->
    <ol v-else-if="breadcrumbItems.length" class="breadcrumb-list flex items-center flex-wrap gap-1">
      <li
        v-for="(item, index) in visibleBreadcrumbs"
        :key="`${item?.path || 'breadcrumb'}-${index}`"
        class="breadcrumb-item flex items-center"
        :class="{
          'is-current': index === breadcrumbItems.length - 1,
          'is-truncated': index === 0 && shouldTruncate
        }"
      >
        <!-- Truncation Indicator -->
        <button
          v-if="index === 0 && shouldTruncate"
          @click="showAllBreadcrumbs"
          class="truncation-button text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 px-2 py-1 rounded text-xs transition-colors"
          :aria-label="$t('navigation.showAllBreadcrumbs')"
        >
          <UIcon name="i-heroicons-ellipsis-horizontal" class="w-4 h-4" />
        </button>

        <!-- Regular Breadcrumb Item -->
        <template v-else>
          <!-- Item Link -->
          <component
            :is="index === breadcrumbItems.length - 1 ? 'span' : 'a'"
            :href="index === breadcrumbItems.length - 1 ? undefined : item?.path"
            @click="index === breadcrumbItems.length - 1 ? undefined : handleBreadcrumbClick(item?.path || '', $event)"
            class="breadcrumb-link"
            :class="{
              'current-page': index === breadcrumbItems.length - 1,
              'clickable': index !== breadcrumbItems.length - 1
            }"
            :aria-current="index === breadcrumbItems.length - 1 ? 'page' : undefined"
          >
            <!-- Icon -->
            <UIcon
              v-if="showIcons && item?.icon"
              :name="item.icon"
              class="breadcrumb-icon w-4 h-4 flex-shrink-0"
            />

            <!-- Title -->
            <span class="breadcrumb-title">{{ item?.title }}</span>

            <!-- Type Badge -->
            <span
              v-if="showBadges && item?.type === 'index'"
              class="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full ml-2"
            >
              {{ $t('navigation.indexBadge') }}
            </span>
          </component>

          <!-- Separator -->
          <UIcon
            v-if="index < breadcrumbItems.length - 1"
            :name="separatorIcon"
            class="breadcrumb-separator w-4 h-4 mx-2 text-gray-400 flex-shrink-0"
          />
        </template>
      </li>
    </ol>

    <!-- Empty State -->
    <div v-else class="text-sm text-gray-500 dark:text-gray-400">
      {{ $t('navigation.noBreadcrumbs') }}
    </div>

    <!-- Structured Data -->
    <script type="application/ld+json" v-if="structuredData">
      {{ JSON.stringify(structuredData) }}
    </script>
  </nav>
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
  maxItems?: number
  showIcons?: boolean
  showBadges?: boolean
  separatorIcon?: string
  
  // Cache configuration
  enableCache?: boolean
  
  // Structured data
  enableStructuredData?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
  maxItems: 5,
  showIcons: true,
  showBadges: true,
  separatorIcon: 'i-heroicons-chevron-right',
  enableCache: true,
  enableStructuredData: true
})

// Composables
const { $i18n } = useNuxtApp()
const route = useRoute()

// State
const isLoading = ref(false)
const error = ref<string | null>(null)
const breadcrumbItems = ref<BreadcrumbItem[]>([])
const showTruncated = ref(false)

// Computed
const currentPath = computed(() => props.path || route.path)
const currentLocale = computed(() => props.locale || $i18n.locale.value)

const shouldTruncate = computed(() => {
  return !showTruncated.value && breadcrumbItems.value.length > props.maxItems
})

const visibleBreadcrumbs = computed(() => {
  if (!shouldTruncate.value) {
    return breadcrumbItems.value
  }

  // Show first item (as ellipsis), and last (maxItems - 1) items
  const lastItems = breadcrumbItems.value.slice(-(props.maxItems - 1))
  return [breadcrumbItems.value[0], ...lastItems]
})

const structuredData = computed(() => {
  if (!props.enableStructuredData || breadcrumbItems.value.length === 0) {
    return null
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbItems.value.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.title,
      'item': new URL(item.path, 'https://matrixprotocol.ai').toString()
    }))
  }
})

// Methods
const fetchBreadcrumbs = async () => {
  isLoading.value = true
  error.value = null

  try {
    const query = new URLSearchParams({
      path: currentPath.value,
      locale: currentLocale.value,
      cache: props.enableCache ? 'true' : 'false'
    })

    const response = await $fetch<BreadcrumbResponse>(`/api/navigation/breadcrumbs?${query.toString()}`)
    breadcrumbItems.value = response.breadcrumbs
    
  } catch (err) {
    console.error('Failed to fetch breadcrumbs:', err)
    error.value = err instanceof Error ? err.message : $i18n.t('navigation.fetchError')
    breadcrumbItems.value = []
  } finally {
    isLoading.value = false
  }
}

const handleBreadcrumbClick = (path: string, event: Event) => {
  // Allow default navigation behavior
  // This can be enhanced with custom navigation logic if needed
}

const showAllBreadcrumbs = () => {
  showTruncated.value = true
}

const refresh = () => {
  fetchBreadcrumbs()
}

// Lifecycle
onMounted(() => {
  fetchBreadcrumbs()
})

// Watch for path changes
watch(() => currentPath.value, () => {
  showTruncated.value = false // Reset truncation state
  fetchBreadcrumbs()
})

// Watch for locale changes  
watch(() => currentLocale.value, () => {
  fetchBreadcrumbs()
})

// Expose public methods
defineExpose({
  refresh,
  showAll: showAllBreadcrumbs
})
</script>

<style scoped>
.breadcrumbs {
  @apply py-2;
}

.breadcrumbs.is-compact {
  @apply py-1;
}

.breadcrumbs.is-loading {
  @apply opacity-75;
}

.breadcrumb-list {
  @apply text-sm;
}

.breadcrumb-item {
  @apply transition-all duration-200;
}

.breadcrumb-item.is-truncated {
  @apply relative;
}

.breadcrumb-link {
  @apply flex items-center gap-2 transition-colors duration-200;
}

.breadcrumb-link.clickable {
  @apply text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline cursor-pointer;
}

.breadcrumb-link.current-page {
  @apply text-gray-900 dark:text-white font-medium cursor-default;
}

.breadcrumb-icon {
  @apply text-gray-500 dark:text-gray-400;
}

.breadcrumb-title {
  @apply truncate max-w-[150px] sm:max-w-[200px] lg:max-w-none;
}

.breadcrumb-separator {
  @apply text-gray-400 dark:text-gray-500;
}

.truncation-button {
  @apply flex items-center justify-center min-w-[2rem] h-6;
}

.truncation-button:hover {
  @apply bg-gray-100 dark:bg-gray-800;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .breadcrumb-title {
    @apply max-w-[100px];
  }
  
  .breadcrumbs.is-compact .breadcrumb-link {
    @apply gap-1;
  }
  
  .breadcrumbs.is-compact .breadcrumb-icon {
    @apply w-3 h-3;
  }
}
</style>