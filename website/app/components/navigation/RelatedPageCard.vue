<!--
/**
 * Related Page Card Component
 * 
 * Individual card for displaying related pages in navigation
 * Used by RelatedPages component for parent, sibling, and child pages
 * 
 * @author Marina Costa (Frontend Engineer)
 * @created 2025-10-16
 * @task TASK-2.4
 */
-->

<template>
  <article
    class="group flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer transform transition-transform duration-200 hover:scale-[1.02] hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    :class="cardClasses"
    @click="handleClick"
    role="button"
    :tabindex="0"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <!-- Icon -->
    <UIcon
      v-if="showIcons"
      :name="page.icon || 'i-heroicons-document-text'"
      :class="iconClasses"
    />

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <h5 class="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
        {{ page.title }}
      </h5>
      
      <p
        v-if="showDescriptions && page.description"
        class="text-sm text-gray-600 dark:text-gray-300 mt-1 overflow-hidden"
        style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;"
      >
        {{ page.description }}
      </p>

      <!-- Type Badge -->
      <div v-if="page.type === 'index'" class="mt-2">
        <span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
          {{ $t('navigation.indexBadge') }}
        </span>
      </div>
    </div>

    <!-- Navigation Arrow -->
    <UIcon
      name="i-heroicons-arrow-top-right-on-square"
      class="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 mt-0.5"
    />
  </article>
</template>

<script setup lang="ts">
// Tipos auto-importados do shared/types/

// Props
interface Props {
  page: NavigationNode
  type: 'parent' | 'sibling' | 'child'
  showIcons: boolean
  showDescriptions: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  navigate: [path: string]
}>()

// Computed
const cardClasses = computed(() => {
  const baseClasses = []
  
  switch (props.type) {
    case 'parent':
      baseClasses.push('border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20')
      break
    case 'sibling':
      baseClasses.push('border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10')
      break
    case 'child':
      baseClasses.push('border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20')
      break
  }
  
  return baseClasses
})

const iconClasses = computed(() => {
  const baseClasses = ['w-5 h-5 flex-shrink-0']
  
  switch (props.type) {
    case 'parent':
      baseClasses.push('text-blue-600 dark:text-blue-400')
      break
    case 'sibling':
      baseClasses.push('text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400')
      break
    case 'child':
      baseClasses.push('text-emerald-600 dark:text-emerald-400')
      break
  }
  
  return baseClasses
})

// Methods
const handleClick = () => {
  emit('navigate', props.page.path)
}
</script>