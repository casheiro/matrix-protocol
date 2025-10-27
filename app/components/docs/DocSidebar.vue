<template>
  <div class="h-[calc(100vh-120px)] flex flex-col overflow-hidden">
    <!-- Navigation Section -->
    <div class="flex-1 flex flex-col bg-white dark:bg-gray-900 shadow ring-1 ring-gray-200 dark:ring-gray-800 rounded-lg mb-4 min-h-0">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ $t('docs.navigation.title') }}
        </h3>
        <div class="flex items-center gap-1">
          <UButton
            variant="ghost"
            size="xs"
            icon="i-heroicons-chevron-up-down"
            :title="$t('docs.navigation.expandAll')"
            @click="expandAll"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          />
          <UButton
            variant="ghost"
            size="xs"
            icon="i-heroicons-minus"
            :title="$t('docs.navigation.collapseAll')"
            @click="collapseAll"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          />
        </div>
      </div>
      
      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto p-4">
        <nav class="space-y-1">
          <!-- Use recursive NavItem component for each top-level navigation item -->
          <NavItem
            v-for="item in navigation"
            :key="item.path"
            :item="item"
            :level="0"
            :is-expanded="isExpanded"
            :toggle-expanded="toggleExpanded"
            :is-active-path="isActivePath"
          />
        </nav>
      </div>
    </div>

    <!-- Quick Links Card -->
    <UCard class="flex-shrink-0 h-auto">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ $t('docs.quickLinks.title') }}
        </h3>
      </template>
      
      <nav class="space-y-2">
        <UButton
          :to="localePath('/docs/quickstart')"
          variant="ghost"
          size="sm"
          icon="i-heroicons-rocket-launch"
          class="w-full justify-start"
        >
          {{ $t('docs.quickLinks.quickstart') }}
        </UButton>
        
        <UButton
          :to="localePath('/docs/implementation')"
          variant="ghost"
          size="sm"
          icon="i-heroicons-cog-6-tooth"
          class="w-full justify-start"
        >
          {{ $t('docs.quickLinks.implementation') }}
        </UButton>
        
        <UButton
          :to="localePath('/docs/frameworks')"
          variant="ghost"
          size="sm"
          icon="i-heroicons-cube"
          class="w-full justify-start"
        >
          {{ $t('docs.quickLinks.frameworks') }}
        </UButton>
        
        <UButton
          :to="localePath('/resources')"
          variant="ghost"
          size="sm"
          icon="i-heroicons-arrow-down-tray"
          class="w-full justify-start"
        >
          {{ $t('docs.quickLinks.downloads') }}
        </UButton>
      </nav>
    </UCard>
  </div>
</template>

<script setup>
// Import NavItem component explicitly
import NavItem from './NavItem.vue'

const props = defineProps({
  navigation: {
    type: Array,
    default: () => []
  },
  currentPath: {
    type: String,
    default: ''
  }
})

const localePath = useLocalePath()

// Use collapsible navigation composable
const {
  toggleExpanded,
  isExpanded,
  expandAll,
  collapseAll,
  isActivePath
} = useCollapsibleNav(props.navigation, props.currentPath)
</script>

