<template>
  <div class="space-y-4">
    <!-- Navigation Card -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ $t('docs.navigation.title') }}
        </h3>
      </template>
      
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
            <!-- Parent item -->
            <UButton
              :to="localePath(item.path)"
              variant="ghost"
              size="sm"
              :icon="item.icon || 'i-heroicons-folder'"
              class="w-full justify-start font-medium"
              :class="isActivePath(item.path) ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : ''"
            >
              {{ item.title }}
            </UButton>
            
            <!-- Children items -->
            <div class="ml-4 space-y-1">
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
          </div>
        </template>
      </nav>
    </UCard>

    <!-- Quick Links Card -->
    <UCard>
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

const { $i18n } = useNuxtApp()
const localePath = useLocalePath()

// Check if a path is currently active
const isActivePath = (path) => {
  if (!props.currentPath || !path) return false
  
  // Remove locale prefix for comparison
  const currentCleanPath = props.currentPath.replace(`/${$i18n.locale.value}`, '')
  const targetCleanPath = path.replace(`/${$i18n.locale.value}`, '')
  
  // Exact match or current path starts with target path + /
  return currentCleanPath === targetCleanPath || 
         currentCleanPath.startsWith(targetCleanPath + '/')
}
</script>

