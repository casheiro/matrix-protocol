<template>
  <div class="space-y-1">
    <!-- Item without children -->
    <div v-if="!item.children || item.children.length === 0">
      <UButton
        :to="item.path"
        variant="ghost"
        size="sm"
        :icon="item.icon || 'i-heroicons-document-text'"
        class="w-full justify-start"
        :class="[
          isActivePath(item.path) ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : '',
          level > 0 ? 'text-sm' : ''
        ]"
        :style="{ paddingLeft: `${level * 1.5 + 0.75}rem` }"
      >
        {{ item.title }}
      </UButton>
    </div>
    
    <!-- Item with children -->
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
          :style="{ marginLeft: `${level * 1.5}rem` }"
        />
        <UButton
          :to="item.path"
          variant="ghost"
          size="sm"
          :icon="item.icon || 'i-heroicons-folder'"
          class="flex-1 justify-start font-medium"
          :class="[
            isActivePath(item.path) ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : '',
            level > 0 ? 'text-sm font-normal' : ''
          ]"
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
        <div v-if="isExpanded(item.path)" class="overflow-hidden">
          <!-- Recursive rendering for each child -->
          <NavItem
            v-for="child in item.children"
            :key="child.path"
            :item="child"
            :level="level + 1"
            :is-expanded="isExpanded"
            :toggle-expanded="toggleExpanded"
            :is-active-path="isActivePath"
          />
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
interface NavItemType {
  title: string
  path: string
  icon?: string
  children?: NavItemType[]
}

const props = defineProps<{
  item: NavItemType
  level: number
  isExpanded: (path: string) => boolean
  toggleExpanded: (path: string) => void
  isActivePath: (path: string) => boolean
}>()

const localePath = useLocalePath()
</script>