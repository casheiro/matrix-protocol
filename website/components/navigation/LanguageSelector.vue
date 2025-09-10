<template>
  <UPopover 
    :popper="{ placement: 'bottom-end', offsetDistance: 8 }"
    :ui="{ 
      width: 'w-48',
      background: 'bg-white dark:bg-gray-900',
      shadow: 'shadow-xl',
      rounded: 'rounded-lg',
      ring: 'ring-1 ring-gray-200 dark:ring-gray-700'
    }"
  >
    <UButton 
      variant="ghost" 
      color="gray"
      size="sm"
      class="w-auto px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md rounded-md transition-all duration-300 focus:outline-none focus:ring-0 active:scale-[0.98]"
      :aria-label="$t('nav.languageSelector')"
      :aria-expanded="false"
      :aria-haspopup="true"
    >
      <div class="flex items-center space-x-2">
        <UIcon name="i-heroicons-language" class="w-4 h-4" />
        <span class="hidden sm:block text-xs font-medium">
          {{ currentLocaleDisplay }}
        </span>
        <UIcon name="i-heroicons-chevron-down" class="w-3 h-3" />
      </div>
    </UButton>

    <template #panel="{ close }">
      <div class="p-2" role="menu" :aria-label="$t('nav.languageMenu')">
        <div class="mb-2 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
            {{ $t('nav.selectLanguage') }}
          </h3>
        </div>
        
        <div class="space-y-1">
          <button
            v-for="locale in availableLocales"
            :key="locale.code"
            @click="switchLocale(locale.code, close)"
            class="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white hover:shadow-md rounded-md transition-all duration-300 focus:outline-none focus:ring-0 active:scale-[0.98]"
            :class="{
              'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300': locale.code === currentLocale,
              'font-medium': locale.code === currentLocale
            }"
            role="menuitem"
            :aria-pressed="locale.code === currentLocale"
          >
            <div class="flex items-center space-x-3">
              <!-- Flag Emoji -->
              <span class="text-lg" role="img" :aria-label="locale.flag">
                {{ locale.flag }}
              </span>
              
              <!-- Language Info -->
              <div class="text-left">
                <div class="font-medium">{{ locale.name }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ locale.nativeName }}
                </div>
              </div>
            </div>
            
            <!-- Current Language Indicator -->
            <UIcon 
              v-if="locale.code === currentLocale"
              name="i-heroicons-check" 
              class="w-4 h-4 text-blue-600 dark:text-blue-400" 
            />
          </button>
        </div>
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
interface LocaleInfo {
  code: string
  name: string
  nativeName: string
  flag: string
  iso: string
}

// i18n composable
const { locale, setLocale } = useI18n()

// Available locales with detailed information
const availableLocales = computed<LocaleInfo[]>(() => [
  {
    code: 'pt',
    name: 'Português',
    nativeName: 'Português (Brasil)',
    flag: '🇧🇷',
    iso: 'pt-BR'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English (US)',
    flag: '🇺🇸',
    iso: 'en-US'
  }
])

// Current locale
const currentLocale = computed(() => locale.value)

// Display text for current locale
const currentLocaleDisplay = computed(() => {
  const current = availableLocales.value.find(l => l.code === currentLocale.value)
  return current ? current.code.toUpperCase() : 'PT'
})

// Language switching with persistence
const switchLocale = async (newLocale: string, closePopover: () => void) => {
  if (newLocale === currentLocale.value) {
    closePopover()
    return
  }

  try {
    // Switch locale using Nuxt i18n
    await setLocale(newLocale as 'en' | 'pt')
    
    // Save preference to localStorage for persistence
    const languageCookie = useCookie('i18n_redirected', {
      default: () => newLocale,
      sameSite: 'lax',
      secure: true,
      maxAge: 60 * 60 * 24 * 365 // 1 year
    })
    languageCookie.value = newLocale

    // Close popover
    closePopover()

    // Navigate to current route with new locale
    await navigateTo({
      path: useRoute().path,
      query: useRoute().query
    })
    
  } catch (error) {
    console.error('Error switching language:', error)
    closePopover()
  }
}

// Initialize locale from cookie on mount
onMounted(() => {
  const savedLocale = useCookie('i18n_redirected')
  if (savedLocale.value && savedLocale.value !== currentLocale.value) {
    setLocale(savedLocale.value as 'en' | 'pt')
  }
})

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    // This will be handled by the UPopover component
  }
}

// Setup keyboard listeners
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Smooth transitions for all interactive elements */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Remove all focus rings and borders */
:deep(button) {
  @apply focus:outline-none focus:ring-0;
}

:deep(button:focus) {
  @apply ring-0 outline-none;
}

:deep(button:active) {
  @apply ring-0 outline-none;
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

/* Hover effects for language options */
.dark .hover\:bg-gray-800:hover {
  background-color: rgb(31 41 55);
}

/* Active language highlighting */
.bg-blue-50 {
  background-color: rgb(239 246 255);
}

.dark .bg-blue-900\/20 {
  background-color: rgb(30 58 138 / 0.2);
}

.text-blue-700 {
  color: rgb(29 78 216);
}

.dark .text-blue-300 {
  color: rgb(147 197 253);
}

/* Flag emoji sizing */
span[role="img"] {
  font-family: "Segoe UI Emoji", "Noto Color Emoji", "Apple Color Emoji", sans-serif;
  line-height: 1;
}
</style>