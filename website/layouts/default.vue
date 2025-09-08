<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
    <!-- Skip to main content for accessibility -->
    <a 
      href="#main-content" 
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
    >
      {{ $t('accessibility.skipToMain') }}
    </a>
    
    <!-- Header Navigation -->
    <LayoutAppHeader />
    
    <!-- Main Content -->
    <main 
      id="main-content"
      class="flex-1"
      tabindex="-1"
    >
      <slot />
    </main>
    
    <!-- Footer (placeholder for future implementation) -->
    <footer class="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 transition-colors duration-200">
      <div class="container mx-auto px-4">
        <div class="text-center text-gray-600 dark:text-gray-400">
          <p class="text-sm">
            &copy; {{ currentYear }} {{ appName }} v{{ appVersion }}
          </p>
          <p class="text-xs mt-1 opacity-75">
            {{ $t('footer.subtitle') }}
          </p>
        </div>
      </div>
    </footer>
    
    <!-- Mobile Menu Drawer (will be implemented in NAV-002) -->
    <Teleport to="body">
      <div
        v-if="isMenuOpen"
        class="fixed inset-0 z-50 lg:hidden"
        @click="closeMenu"
      >
        <!-- Overlay -->
        <div 
          class="fixed inset-0 bg-black/50 transition-opacity duration-300"
          aria-hidden="true"
        />
        <!-- Mobile drawer placeholder -->
        <div class="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300">
          <div class="p-4">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Mobile menu implementation coming in NAV-002
            </p>
            <button 
              @click="closeMenu"
              class="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
// App configuration using environment variables
const { appName, appVersion } = useMatrixConfig()

// Mobile menu state
const { isMenuOpen, toggleMenu } = useAppStore()

// Current year for footer
const currentYear = new Date().getFullYear()

// Close menu helper
const closeMenu = () => {
  if (isMenuOpen) {
    toggleMenu()
  }
}

// Layout metadata
useHead({
  htmlAttrs: {
    lang: 'pt' // Will be updated by i18n
  },
  bodyAttrs: {
    class: 'antialiased font-sans'
  }
})

// Prevent body scroll when menu is open
watch(isMenuOpen, (isOpen) => {
  if (process.client) {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (process.client) {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}

/* Smooth transitions for all elements */
* {
  @apply transition-colors duration-200;
}

/* Focus styles for accessibility */
:focus-visible {
  @apply ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900;
}
</style>