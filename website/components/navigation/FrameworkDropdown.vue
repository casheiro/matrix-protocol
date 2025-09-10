<template>
  <div class="relative">
    <!-- Dropdown Button -->
    <UButton 
      variant="ghost" 
      color="gray"
      trailing-icon="i-heroicons-chevron-down"
      class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 rounded-md"
      :class="{ 'text-gray-900 dark:text-white': isFrameworksActive }"
      :aria-haspopup="true"
      :aria-expanded="isOpen"
      :aria-label="$t('nav.frameworksDropdown')"
      @click="toggleDropdown"
    >
      {{ $t('nav.frameworks') }}
    </UButton>

    <!-- Dropdown Panel -->
    <div 
      v-if="isOpen"
      class="absolute left-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 shadow-xl rounded-lg ring-1 ring-gray-200 dark:ring-gray-700 z-50"
      role="menu" 
      :aria-label="$t('nav.frameworksMenu')"
    >
      <div class="p-4">
        <!-- Dropdown Header -->
        <div class="mb-3">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
            {{ $t('frameworks.title') }}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ $t('frameworks.subtitle') }}
          </p>
        </div>
        
        <!-- Framework List -->
        <div class="space-y-1">
          <NuxtLink
            v-for="framework in frameworks"
            :key="framework.key"
            :to="`/frameworks/${framework.key}`"
            @click="closeDropdown"
            class="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md transition-all duration-300 group focus:outline-none focus:ring-0 focus:bg-gray-50 dark:focus:bg-gray-800 active:scale-[0.98]"
            role="menuitem"
          >
            <!-- Framework Icon Container -->
            <div 
              class="flex items-center justify-center w-10 h-10 rounded-lg mr-3 flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
              :class="framework.colorClass"
            >
              <!-- Framework Icon -->
              <img 
                :src="`/assets/logos/${framework.key}/${framework.key}-logo-icon.svg`"
                :alt="`${framework.acronym} Icon`"
                class="w-6 h-6"
                loading="lazy"
              />
            </div>
            
            <!-- Framework Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-2 mb-1">
                <span class="font-semibold text-gray-900 dark:text-white text-sm">
                  {{ framework.acronym }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {{ $t(framework.nameKey) }}
                </span>
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-400 leading-tight line-clamp-2">
                {{ $t(framework.descriptionKey) }}
              </p>
            </div>
            
            <!-- Arrow Indicator -->
            <UIcon 
              name="i-heroicons-arrow-right" 
              class="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200 ml-2"
            />
          </NuxtLink>
        </div>
        
        <!-- Footer -->
        <div class="border-t border-gray-200 dark:border-gray-700 mt-4 pt-3">
          <NuxtLink 
            to="/frameworks"
            @click="closeDropdown"
            class="flex items-center justify-center p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
          >
            {{ $t('frameworks.viewAll') }}
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-1" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Current route for active state
const route = useRoute()

// Dropdown state
const isOpen = ref(false)

// Check if we're in a frameworks-related page
const isFrameworksActive = computed(() => 
  route.path.startsWith('/frameworks')
)

// Frameworks data with official colors and i18n keys
const frameworks = [
  {
    key: 'mef',
    acronym: 'MEF',
    nameKey: 'frameworks.mef.name',
    descriptionKey: 'frameworks.mef.description',
    colorClass: 'bg-mef-500'
  },
  {
    key: 'zof',
    acronym: 'ZOF', 
    nameKey: 'frameworks.zof.name',
    descriptionKey: 'frameworks.zof.description',
    colorClass: 'bg-zof-500'
  },
  {
    key: 'oif',
    acronym: 'OIF',
    nameKey: 'frameworks.oif.name',
    descriptionKey: 'frameworks.oif.description',
    colorClass: 'bg-oif-500'
  },
  {
    key: 'moc',
    acronym: 'MOC',
    nameKey: 'frameworks.moc.name',
    descriptionKey: 'frameworks.moc.description',
    colorClass: 'bg-moc-500'
  },
  {
    key: 'mal',
    acronym: 'MAL',
    nameKey: 'frameworks.mal.name',
    descriptionKey: 'frameworks.mal.description',
    colorClass: 'bg-mal-500'
  }
]

// Methods
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

// Close dropdown when clicking outside
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element
    if (isOpen.value && !target.closest('.relative')) {
      closeDropdown()
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<style scoped>
/* Line clamp utility for description text */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Remove all focus rings and borders */
[role="menuitem"]:focus {
  @apply outline-none ring-0;
}

/* Remove default button focus styles that cause border issues */
:deep(button) {
  @apply focus:outline-none focus:ring-0;
}

:deep(button:focus) {
  @apply ring-0 outline-none;
}

:deep(button:active) {
  @apply ring-0 outline-none;
}

/* Remove focus styles from links */
:deep(a) {
  @apply focus:outline-none focus:ring-0;
}

:deep(a:focus) {
  @apply ring-0 outline-none;
}

:deep(a:active) {
  @apply ring-0 outline-none;
}

:deep(a:visited) {
  @apply ring-0 outline-none;
}

/* Remove any webkit focus outlines */
:deep(*) {
  -webkit-tap-highlight-color: transparent;
  -webkit-focus-ring-color: transparent;
}

:deep(*:focus) {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

/* Elegant hover animations */
.group:hover .flex-shrink-0 {
  @apply scale-110;
  filter: brightness(1.1);
}

.group:hover {
  transform: translateY(-1px);
}

/* Smooth transitions for all properties */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Icon hover effects */
.group:hover .w-4.h-4 {
  @apply scale-110;
}

/* Active state with subtle scale */
.active\:scale-\[0\.98\]:active {
  transform: scale(0.98);
}
</style>