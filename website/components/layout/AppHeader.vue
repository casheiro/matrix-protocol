<template>
  <header 
    class="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 transition-colors duration-200"
    role="banner"
  >
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16 md:h-18">
        <!-- Logo Section -->
        <div class="flex items-center">
          <NuxtLink 
            to="/" 
            class="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
            :aria-label="`${appName} - ${$t('nav.homepage')}`"
          >
            <!-- Desktop Logo -->
            <img 
              :src="logoSrc"
              :alt="`${appName} Logo`"
              class="hidden md:block h-8 w-auto"
              loading="eager"
            />
            <!-- Mobile Icon -->
            <img 
              :src="iconSrc"
              :alt="`${appName} Icon`"
              class="block md:hidden h-7 w-auto"
              loading="eager"
            />
          </NuxtLink>
        </div>
        
        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center space-x-1" role="navigation">
          <!-- Main Navigation Items -->
          <template v-for="item in navigationItems" :key="item.to">
            <NuxtLink 
              :to="item.to"
              class="relative px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :class="{ 'text-gray-900 dark:text-white': isActiveRoute(item.to) }"
              :aria-current="isActiveRoute(item.to) ? 'page' : undefined"
            >
              {{ $t(item.labelKey) }}
              <!-- Active Page Indicator -->
              <span 
                v-if="isActiveRoute(item.to)" 
                class="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 dark:bg-white rounded-full transform transition-transform duration-200"
                aria-hidden="true"
              />
            </NuxtLink>
          </template>
          
          <!-- Frameworks Dropdown -->
          <FrameworkDropdown />
        </nav>
        
        <!-- Right Side Actions -->
        <div class="flex items-center space-x-2">
          <!-- Language Selector -->
          <LanguageSelector />
          
          <!-- GitHub Link -->
          <a 
            :href="githubUrl" 
            target="_blank"
            rel="noopener noreferrer"
            class="hidden md:flex items-center justify-center w-9 h-9 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :aria-label="$t('nav.github')"
          >
            <UIcon name="i-simple-icons-github" class="w-5 h-5" />
          </a>
          
          <!-- Dark Mode Toggle -->
          <UButton 
            variant="ghost" 
            color="gray"
            size="sm"
            square
            @click="toggleColorMode"
            :aria-label="$t(isDark ? 'nav.lightMode' : 'nav.darkMode')"
            class="w-9 h-9"
          >
            <UIcon 
              :name="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'" 
              class="w-5 h-5" 
            />
          </UButton>
          
          <!-- Mobile Menu Button -->
          <UButton
            variant="ghost"
            color="gray"
            size="sm"
            square
            class="lg:hidden w-9 h-9"
            @click="toggleMobileMenu"
            :aria-label="$t('nav.openMenu')"
            :aria-expanded="isMenuOpen"
            aria-controls="mobile-menu"
          >
            <UIcon 
              :name="isMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'" 
              class="w-5 h-5" 
            />
          </UButton>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { NavigationItem } from '~/types'

// App configuration from environment variables
const { githubUrl, appName } = useMatrixConfig()

// Color mode management
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

// Mobile menu state
const { isMenuOpen, toggleMenu } = useAppStore()

// Current route for active state detection
const route = useRoute()

// Logo sources based on theme
const logoSrc = computed(() => 
  isDark.value 
    ? '/assets/logos/matrix/matrix-protocol-logo-white.svg'
    : '/assets/logos/matrix/matrix-protocol-logo-gray.svg'
)

const iconSrc = computed(() => 
  isDark.value 
    ? '/assets/logos/matrix/matrix-protocol-icon-white.svg'
    : '/assets/logos/matrix/matrix-protocol-icon-gray.svg'
)

// Navigation items with i18n keys
const navigationItems: NavigationItem[] = [
  { 
    labelKey: 'nav.protocol',
    to: '/protocol' 
  },
  { 
    labelKey: 'nav.documentation',
    to: '/docs' 
  },
  { 
    labelKey: 'nav.examples',
    to: '/examples' 
  },
  { 
    labelKey: 'nav.resources',
    to: '/resources' 
  }
]

// Methods
const toggleColorMode = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

const toggleMobileMenu = () => {
  toggleMenu()
}

const isActiveRoute = (path: string): boolean => {
  if (path === '/' && route.path === '/') return true
  if (path !== '/' && route.path.startsWith(path)) return true
  return false
}

// Keyboard navigation for accessibility
const handleKeyNavigation = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isMenuOpen) {
    toggleMobileMenu()
  }
}

// Setup keyboard listeners
onMounted(() => {
  document.addEventListener('keydown', handleKeyNavigation)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyNavigation)
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}

/* Custom height classes */
.h-16 {
  height: 4rem; /* 64px mobile */
}

.h-18 {
  height: 4.5rem; /* 72px desktop */
}

/* Smooth transitions for all interactive elements */
a, button {
  @apply transition-all duration-200;
}

/* Active link indicator animation */
.router-link-active span {
  @apply scale-x-100;
}

/* Custom focus styles */
:focus-visible {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900;
}

/* Backdrop blur support fallback */
@supports not (backdrop-filter: blur(12px)) {
  header {
    @apply bg-white dark:bg-gray-900;
  }
}
</style>