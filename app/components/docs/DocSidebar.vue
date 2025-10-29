<template>
  <!-- Mobile Layout: Sticky Compact Navigation -->
  <div class="lg:hidden">
    <!-- Sticky Navigation Header -->
    <div class="sticky top-16 z-30 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 mb-2">
      <!-- Compact Navigation Header -->
      <div class="px-4 py-2">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-medium text-gray-900 dark:text-white">
            {{ $t('docs.navigation.title') }}
          </h3>
          <UButton
            @click="openDrawer"
            variant="ghost"
            size="xs"
            icon="i-heroicons-bars-3"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Ver Todos
          </UButton>
        </div>
      </div>
      
      <!-- Quick Links as Horizontal Tabs -->
      <div class="px-4 py-1 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div class="flex gap-1 overflow-x-auto scrollbar-hide">
          <UButton
            :to="localePath('/docs/quickstart')"
            variant="ghost"
            size="xs"
            icon="i-heroicons-rocket-launch"
            class="flex-shrink-0 text-xs px-2 py-1"
          >
            {{ $t('docs.quickLinks.quickstart') }}
          </UButton>
          <UButton
            :to="localePath('/docs/implementation')"
            variant="ghost"
            size="xs"
            icon="i-heroicons-cog-6-tooth"
            class="flex-shrink-0 text-xs px-2 py-1"
          >
            {{ $t('docs.quickLinks.implementation') }}
          </UButton>
          <UButton
            :to="localePath('/docs/frameworks')"
            variant="ghost"
            size="xs"
            icon="i-heroicons-cube"
            class="flex-shrink-0 text-xs px-2 py-1"
          >
            {{ $t('docs.quickLinks.frameworks') }}
          </UButton>
          <UButton
            :to="localePath('/resources')"
            variant="ghost"
            size="xs"
            icon="i-heroicons-arrow-down-tray"
            class="flex-shrink-0 text-xs px-2 py-1"
          >
            {{ $t('docs.quickLinks.downloads') }}
          </UButton>
        </div>
      </div>
    </div>

    <!-- Full Navigation Drawer - Teleported to body -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isDrawerOpen"
          class="fixed inset-0 z-[60] lg:hidden"
          @click="closeDrawer"
        >
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/50"></div>
          
          <!-- Drawer Content -->
          <Transition
            enter-active-class="transition-transform duration-300 ease-out"
            enter-from-class="translate-x-full"
            enter-to-class="translate-x-0"
            leave-active-class="transition-transform duration-200 ease-in"
            leave-from-class="translate-x-0"
            leave-to-class="translate-x-full"
          >
            <div
              v-if="isDrawerOpen"
              class="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-xl"
              @click.stop
            >
              <!-- Drawer Header -->
              <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ $t('docs.navigation.title') }}
                </h3>
                <UButton
                  @click="closeDrawer"
                  variant="ghost"
                  size="sm"
                  icon="i-heroicons-x-mark"
                  class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                />
              </div>
              
              <!-- Drawer Navigation Content -->
              <div class="flex-1 overflow-y-auto p-4">
                <nav class="space-y-1">
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
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>

  <!-- Desktop Layout: Original Sidebar -->
  <div class="hidden lg:flex lg:h-[calc(100vh-120px)] lg:flex-col lg:overflow-hidden">
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

    <!-- Desktop Quick Links -->
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
const route = useRoute()

// Drawer state management
const isDrawerOpen = ref(false)

const openDrawer = () => {
  isDrawerOpen.value = true
}

const closeDrawer = () => {
  isDrawerOpen.value = false
}

// Close drawer on route change
watch(() => route.path, () => {
  isDrawerOpen.value = false
})

// Use collapsible navigation composable
const {
  toggleExpanded,
  isExpanded,
  expandAll,
  collapseAll,
  isActivePath
} = useCollapsibleNav(props.navigation, props.currentPath)
</script>

<style scoped>
/* Hide scrollbar for horizontal scroll on mobile */
.scrollbar-hide {
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  scrollbar-width: none;  /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar { 
  display: none;  /* Safari and Chrome */
}
</style>

