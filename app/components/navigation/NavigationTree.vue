<!--
/**
 * Navigation Tree Component
 * 
 * Renders hierarchical navigation tree with interactive expand/collapse
 * Supports nested content structure and keyboard navigation
 * 
 * @author Marina Costa (Frontend Engineer)
 * @created 2025-10-16
 * @task TASK-2.4
 */
-->

<template>
  <div 
    class="navigation-tree"
    role="tree"
    :aria-label="$t('navigation.treeLabel')"
  >
    <NavigationTreeItem
      v-for="(item, index) in visibleItems"
      :key="`${item.path}-${index}`"
      :item="item"
      :current-path="currentPath"
      :max-depth="maxDepth"
      :show-icons="showIcons"
      :show-descriptions="showDescriptions"
      :level="0"
      :is-last="index === visibleItems.length - 1"
      @navigate="handleNavigate"
      @toggle="handleToggle"
      class="tree-item"
    />

    <!-- Load More Button (if items are truncated) -->
    <div v-if="hasMoreItems" class="load-more mt-3 px-3">
      <UButton
        @click="loadMore"
        variant="ghost"
        size="sm"
        block
        :loading="isLoadingMore"
      >
        <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 mr-2" />
        {{ $t('navigation.loadMore', { count: remainingCount }) }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationNode } from '../../../shared/types/navigation'

// Props
interface Props {
  items: NavigationNode[]
  currentPath: string
  maxDepth?: number
  showIcons?: boolean
  showDescriptions?: boolean
  pageSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxDepth: 3,
  showIcons: true,
  showDescriptions: true,
  pageSize: 20
})

// Emits
const emit = defineEmits<{
  navigate: [path: string]
  toggle: [itemPath: string, expanded: boolean]
}>()

// State
const expandedItems = ref<Set<string>>(new Set())
const displayCount = ref(props.pageSize)
const isLoadingMore = ref(false)

// Computed
const visibleItems = computed(() => {
  return props.items.slice(0, displayCount.value)
})

const hasMoreItems = computed(() => {
  return props.items.length > displayCount.value
})

const remainingCount = computed(() => {
  return props.items.length - displayCount.value
})

// Methods
const handleNavigate = (path: string) => {
  emit('navigate', path)
}

const handleToggle = (itemPath: string, expanded: boolean) => {
  if (expanded) {
    expandedItems.value.add(itemPath)
  } else {
    expandedItems.value.delete(itemPath)
  }
  emit('toggle', itemPath, expanded)
}

const loadMore = async () => {
  isLoadingMore.value = true
  
  // Simulate loading delay for better UX
  await new Promise(resolve => setTimeout(resolve, 200))
  
  displayCount.value = Math.min(
    displayCount.value + props.pageSize,
    props.items.length
  )
  
  isLoadingMore.value = false
}

const expandAll = () => {
  const expandAllRecursive = (items: NavigationNode[]) => {
    for (const item of items) {
      expandedItems.value.add(item.path)
      if (item.children && item.children.length > 0) {
        expandAllRecursive(item.children)
      }
    }
  }
  expandAllRecursive(props.items)
}

const collapseAll = () => {
  expandedItems.value.clear()
}

// Initialize expanded state for current path
const initializeExpandedState = () => {
  // Auto-expand path to current page
  const pathSegments = props.currentPath.split('/').filter(Boolean)
  let currentPath = ''
  
  for (const segment of pathSegments) {
    currentPath += '/' + segment
    expandedItems.value.add(currentPath)
  }
}

// Lifecycle
onMounted(() => {
  initializeExpandedState()
})

// Watch for current path changes
watch(() => props.currentPath, () => {
  initializeExpandedState()
})

// Expose public methods
defineExpose({
  expandAll,
  collapseAll,
  expandedItems: readonly(expandedItems)
})
</script>

<style scoped>
.navigation-tree {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tree-item {
  transition: all 0.2s;
}

.load-more {
  border-top: 1px solid;
  border-color: rgb(243 244 246);
  padding-top: 0.75rem;
}

.dark .load-more {
  border-color: rgb(31 41 55);
}
</style>