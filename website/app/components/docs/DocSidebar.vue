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
        <template v-for="item in navigation" :key="item.path">
          <!-- Top level items -->
          <div v-if="!item.children || item.children.length === 0">
            <UButton
              :to="localePath(item.path)"
              variant="ghost"
              size="sm"
              :icon="item.icon || 'i-heroicons-document-text'"
              class="w-full justify-start"
              :class="isActivePath(item.path) ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : ''"
            >
              {{ item.title }}
            </UButton>
          </div>
          
          <!-- Items with children -->
          <div v-else class="space-y-1">
            <!-- Parent item with toggle -->
            <div class="flex items-center gap-1">
              <UButton
                variant="ghost"
                size="xs"
                :icon="isExpanded(item.path) ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
                @click="toggleExpanded(item.path)"
                class="flex-shrink-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-transform duration-200"
                :class="{ 'rotate-90': isExpanded(item.path) }"
              />
              <UButton
                :to="localePath(item.path)"
                variant="ghost"
                size="sm"
                :icon="item.icon || 'i-heroicons-folder'"
                class="flex-1 justify-start font-medium"
                :class="isActivePath(item.path) ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : ''"
              >
                {{ item.title }}
              </UButton>
            </div>
            
            <!-- Children items with transition -->
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="max-h-0 opacity-0"
              enter-to-class="max-h-96 opacity-100"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="max-h-96 opacity-100"
              leave-to-class="max-h-0 opacity-0"
            >
              <div v-if="isExpanded(item.path)" class="ml-6 space-y-1 overflow-hidden">
                <UButton
                  v-for="child in item.children"
                  :key="child.path"
                  :to="localePath(child.path)"
                  variant="ghost"
                  size="sm"
                  :icon="child.icon || 'i-heroicons-document'"
                  class="w-full justify-start text-sm"
                  :class="isActivePath(child.path) ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : ''"
                >
                  {{ child.title }}
                </UButton>
              </div>
            </Transition>
          </div>
        </template>
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

