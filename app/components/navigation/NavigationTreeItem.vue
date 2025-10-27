<!--
/**
 * Navigation Tree Item Component
 * 
 * Individual tree item with expand/collapse functionality
 * Self-recursive for nested navigation structures
 * 
 * @author Marina Costa (Frontend Engineer)
 * @created 2025-10-16
 * @task TASK-2.4
 */
-->

<template>
  <div class="nav-tree-node">
    <!-- Item Content -->
    <button
      :class="itemClasses"
      @click="handleClick"
      @keydown="handleKeydown"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      :aria-expanded="hasChildren ? isExpanded : undefined"
      :aria-current="isCurrentPage ? 'page' : undefined"
      role="treeitem"
      :tabindex="0"
    >
      <!-- Expand/Collapse Icon -->
      <UIcon
        v-if="hasChildren"
        name="i-heroicons-chevron-right"
        :class="iconClasses"
      />
      
      <!-- Page Icon -->
      <UIcon
        v-else-if="showIcons"
        :name="item.icon || 'i-heroicons-document-text'"
        class="w-4 h-4 flex-shrink-0 text-gray-400 mr-2"
      />

      <!-- Item Content -->
      <div class="flex-1 min-w-0 ml-2">
        <div class="flex items-center gap-2">
          <!-- Title -->
          <span class="font-medium truncate">
            {{ item.title }}
          </span>
          
          <!-- Type Badge -->
          <span
            v-if="item.type === 'index'"
            class="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full flex-shrink-0"
          >
            {{ $t('navigation.indexBadge') }}
          </span>
        </div>

        <!-- Description -->
        <p
          v-if="showDescriptions && item.description"
          class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5"
        >
          {{ item.description }}
        </p>
      </div>

      <!-- Navigate to Page Button (for parents) -->
      <button
        v-if="hasChildren"
        @click.stop="handleNavigateToPage"
        class="opacity-0 group-hover:opacity-100 ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
        :aria-label="$t('navigation.goToPage', { title: item.title })"
      >
        <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-3 h-3" />
      </button>
    </button>

    <!-- Children -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-screen"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 max-h-screen"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="shouldShowChildren" class="children-container overflow-hidden">
        <NavigationTreeItem
          v-for="(child, index) in item.children"
          :key="`${child.path}-${index}`"
          :item="child"
          :current-path="currentPath"
          :max-depth="maxDepth"
          :show-icons="showIcons"
          :show-descriptions="showDescriptions"
          :level="level + 1"
          :is-last="index === item.children!.length - 1"
          @navigate="emit('navigate', $event)"
          @toggle="(itemPath: string, expanded: boolean) => emit('toggle', itemPath, expanded)"
          class="child-item"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { NavigationNode } from '../../../shared/types/navigation'

// Props
interface Props {
  item: NavigationNode
  currentPath: string
  maxDepth: number
  showIcons: boolean
  showDescriptions: boolean
  level: number
  isLast?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLast: false
})

// Emits
const emit = defineEmits<{
  navigate: [path: string]
  toggle: [itemPath: string, expanded: boolean]
}>()

// State
const isExpanded = ref(false)
const isHovered = ref(false)

// Computed
const hasChildren = computed(() => {
  return props.item.children && props.item.children.length > 0
})

const isCurrentPage = computed(() => {
  return props.currentPath === props.item.path
})

const shouldShowChildren = computed(() => {
  return hasChildren.value && isExpanded.value && props.level < props.maxDepth
})

const itemClasses = computed(() => {
  return [
    'nav-tree-item group flex items-center w-full px-3 py-2 rounded-md transition-all duration-200 text-left',
    {
      // Current page styling
      'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium': isCurrentPage.value,
      
      // Hover styling
      'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300': !isCurrentPage.value,
      
      // Level-based indentation
      'ml-0': props.level === 0,
      'ml-4': props.level === 1,
      'ml-8': props.level === 2,
      'ml-12': props.level >= 3,
    }
  ]
})

const iconClasses = computed(() => {
  const baseClasses = 'w-4 h-4 flex-shrink-0 transition-transform duration-200'
  
  if (!hasChildren.value) {
    return `${baseClasses} text-gray-400`
  }
  
  return isExpanded.value 
    ? `${baseClasses} text-gray-600 dark:text-gray-400 transform rotate-90`
    : `${baseClasses} text-gray-600 dark:text-gray-400`
})

// Methods
const handleClick = () => {
  if (hasChildren.value) {
    toggleExpanded()
  } else {
    emit('navigate', props.item.path)
  }
}

const handleNavigateToPage = () => {
  emit('navigate', props.item.path)
}

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
  emit('toggle', props.item.path, isExpanded.value)
}

// Keyboard handling
const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      handleClick()
      break
    case 'ArrowRight':
      if (hasChildren.value && !isExpanded.value) {
        event.preventDefault()
        toggleExpanded()
      }
      break
    case 'ArrowLeft':
      if (hasChildren.value && isExpanded.value) {
        event.preventDefault()
        toggleExpanded()
      }
      break
  }
}
</script>

<style scoped>
.nav-tree-node {
  position: relative;
}

.nav-tree-item {
  position: relative;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.nav-tree-item:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.children-container {
  border-left: 1px solid;
  border-color: rgb(229 231 235);
  margin-left: 0.5rem;
  margin-top: 0.25rem;
}

.dark .children-container {
  border-color: rgb(55 65 81);
}

.child-item {
  position: relative;
}

.child-item::before {
  content: '';
  position: absolute;
  left: -0.5rem;
  top: 1rem;
  width: 1rem;
  height: 1px;
  background-color: rgb(229 231 235);
}

.dark .child-item::before {
  background-color: rgb(55 65 81);
}

.child-item:last-child::after {
  content: '';
  position: absolute;
  left: -0.5rem;
  top: 1rem;
  bottom: 0;
  width: 1px;
  background-color: white;
}

.dark .child-item:last-child::after {
  background-color: rgb(17 24 39);
}

/* Animation performance optimization */
.max-h-0 {
  max-height: 0;
}

.max-h-screen {
  max-height: 100vh;
}
</style>