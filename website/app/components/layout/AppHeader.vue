<template>
  <header 
    class="sticky top-0 z-50 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-600"
    role="banner"
  >
    
    <nav 
      id="main-nav"
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" 
      role="navigation"
      aria-label="Primary navigation"
      tabindex="0"
    >
      <div class="flex items-center justify-between h-18">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink 
            :to="localePath('index')" 
            class="flex items-center space-x-3 focus:outline-none rounded-lg p-1 -m-1"
            :aria-label="$t('navigation.homeLink')"
          >
            <img
              v-if="!isMobile"
              :src="getMatrixLogo('desktop')"
              alt=""
              class="h-10 w-auto transition-opacity duration-200"
              :class="{ 'opacity-0': !isHydrated }"
            />
            <img
              v-else
              :src="getMatrixLogo('mobile')" 
              alt=""
              class="h-10 w-auto transition-opacity duration-200"
              :class="{ 'opacity-0': !isHydrated }"
            />
            <span 
              v-if="!isMobile"
              class="text-xl font-bold text-gray-900 dark:text-white font-rajdhani"
            >
              Matrix Protocol
            </span>
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden lg:block">
          <div class="ml-10 flex items-center space-x-1">
            <!-- Frameworks Dropdown -->
            <NavigationFrameworkDropdown />

            <!-- Documentação (unificada) -->
            <UButton
              :to="`/${$i18n.locale}/docs`"
              variant="ghost"
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none"
              :class="{ 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/20': isProtocolActive }"
              size="sm"
            >
              {{ $t('navigation.protocol') }}
            </UButton>

            <!-- Recursos -->
            <UButton
              :to="`/${$i18n.locale}/resources`"
              variant="ghost"
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none"
              :class="{ 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/20': $route.path.includes('/resources') }"
              size="sm"
            >
              {{ $t('navigation.resources') }}
            </UButton>
          </div>
        </div>

        <!-- Right side controls -->
        <div class="flex items-center space-x-2">
          <!-- GitHub Link -->
          <UButton 
            v-if="config.githubUrl"
            :to="config.githubUrl" 
            external
            variant="ghost" 
            size="sm"
            icon="i-simple-icons-github"
            :aria-label="$t('common.githubLink')"
            class="hidden sm:inline-flex text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          />

          <!-- Language Selector -->
          <NavigationLanguageSelector />

          <!-- Mobile menu button -->
          <UButton 
            @click="toggleMobileMenu"
            variant="ghost" 
            size="sm"
            icon="i-heroicons-bars-3"
            class="lg:hidden"
            :aria-label="mobileMenuOpen ? $t('navigation.closeMenu') : $t('navigation.openMenu')"
            :aria-expanded="mobileMenuOpen"
            aria-controls="mobile-menu"
          />
        </div>
      </div>
    </nav>

    <!-- Mobile Navigation -->
    <LayoutMobileDrawer 
      v-model="mobileMenuOpen"
      @close="mobileMenuOpen = false"
    />
  </header>
</template>

<script setup>
// Composables
const { getMatrixLogo } = useMatrixAssets()
const { locale } = useI18n()
const localePath = useLocalePath()
const config = useMatrixConfig()
const { skipToContent } = useAccessibility()
const route = useRoute()

// Computed
const isProtocolActive = computed(() => {
  const path = route.path
  return path.includes('/protocol') || 
         path.includes('/quickstart') || 
         path.includes('/implementation') || 
         path.includes('/integration') || 
         path.includes('/glossary')
})

const isManualActive = computed(() => {
  const path = route.path
  return path.includes('/manual')
})

// Estado de hidratação para evitar inconsistência visual
const isHydrated = ref(false)

// Aguardar hidratação e inicialização do tema para sincronizar logos
onMounted(() => {
  // Marcar como hidratado imediatamente
  isHydrated.value = true
  
  // Escutar evento de inicialização do tema
  const handleThemeInit = () => {
    // Forçar re-render dos logos após inicialização do tema
    nextTick(() => {
      isHydrated.value = false
      nextTick(() => {
        isHydrated.value = true
      })
    })
  }
  
  window.addEventListener('theme-initialized', handleThemeInit)
  
  onUnmounted(() => {
    window.removeEventListener('theme-initialized', handleThemeInit)
  })
})

// Responsividade simplificada
const isMobile = ref(false)

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 1024
  }
  
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
  })
})

// Mobile menu state
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// Fechar menu mobile ao navegar
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})

// Fechar menu com ESC
onMounted(() => {
  const handleEscape = (event) => {
    if (event.key === 'Escape' && mobileMenuOpen.value) {
      mobileMenuOpen.value = false
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>

<style scoped>
/* Altura do header aumentada para 72px */
.h-18 {
  height: 4.5rem; /* 72px */
}
</style>