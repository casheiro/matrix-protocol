<!--
/**
 * Language Switcher Component
 * 
 * Enhanced language selector with smart content validation
 * Integrates with dynamic navigation API for seamless locale switching
 * 
 * @author Bruno Oliveira (Full-Stack Developer)
 * @created 2025-10-16
 * @task TASK-2.5
 */
-->

<template>
  <div class="language-switcher">
    <!-- Desktop Dropdown -->
    <UDropdownMenu
      v-if="!compact"
      :items="dropdownItems"
      :popper="{ placement: 'bottom-end', arrow: true }"
      :ui="dropdownUI"
    >
      <UButton
        variant="ghost"
        size="sm"
        :loading="isSwitching"
        :disabled="isSwitching"
        class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        :aria-label="$t('common.selectLanguage')"
      >
        <span class="text-lg mr-1">{{ currentLocale.flag }}</span>
        <span class="hidden sm:inline">{{ currentLocale.name }}</span>
        <span class="sm:hidden">{{ currentLocale.code.toUpperCase() }}</span>
        <UIcon name="i-heroicons-chevron-down-20-solid" class="w-4 h-4 ml-1" />
      </UButton>
    </UDropdownMenu>

    <!-- Compact Toggle -->
    <div v-else class="compact-switcher flex items-center space-x-1">
      <button
        v-for="locale in availableLocales"
        :key="locale.code"
        @click="handleLocaleSwitch(locale.code)"
        :disabled="isSwitching || locale.code === currentLocale.code"
        class="locale-button"
        :class="{
          'active': locale.code === currentLocale.code,
          'loading': isSwitching
        }"
        :aria-label="$t('common.switchToLanguage', { language: locale.name })"
      >
        <span class="flag">{{ locale.flag }}</span>
        <span class="code">{{ locale.code.toUpperCase() }}</span>
      </button>
    </div>

    <!-- Loading Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isSwitching" class="switching-overlay">
        <div class="switching-content">
          <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
          <span class="text-xs">{{ $t('navigation.switchingLanguage') }}</span>
        </div>
      </div>
    </Transition>

    <!-- Error Toast -->
    <UNotification
      v-if="switchError"
      :title="$t('navigation.languageSwitchError')"
      :description="switchError"
      color="red"
      icon="i-heroicons-exclamation-triangle"
      :timeout="5000"
      @close="switchError = null"
    />

    <!-- Success Toast for Fallback -->
    <UNotification
      v-if="fallbackMessage"
      :title="$t('navigation.pageNotAvailable')"
      :description="fallbackMessage"
      color="amber"
      icon="i-heroicons-information-circle"
      :timeout="8000"
      @close="fallbackMessage = null"
    />
  </div>
</template>

<script setup lang="ts">
import type { Locale } from '../../../shared/types/navigation'

interface Props {
  compact?: boolean
  showCountryNames?: boolean
  persistPath?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
  showCountryNames: true,
  persistPath: true
})

// Composables
const { locale, t } = useI18n()
const route = useRoute()
const {
  availableLocales,
  currentLocale,
  switchLocale,
  checkPageExists
} = useNavigationI18n()

// State
const isSwitching = ref(false)
const switchError = ref<string | null>(null)
const fallbackMessage = ref<string | null>(null)

// Dropdown configuration for Nuxt UI 3.x
const dropdownUI = {
  content: 'w-48',
  item: 'group flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md transition-colors duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
}

// Create dropdown items
const dropdownItems = computed(() => {
  return availableLocales.value.map(loc => ({
    label: `${loc.flag} ${loc.name}`,
    click: () => handleLocaleSwitch(loc.code),
    disabled: loc.code === currentLocale.value.code || isSwitching.value,
    class: loc.code === currentLocale.value.code ? 'font-semibold' : ''
  }))
})

// Handle locale switching with validation
const handleLocaleSwitch = async (targetLocale: string) => {
  if (targetLocale === locale.value || isSwitching.value) return

  isSwitching.value = true
  switchError.value = null
  fallbackMessage.value = null

  try {
    if (props.persistPath) {
      // Use the API to determine the best target path
      const response = await $fetch('/api/navigation/locale-switch', {
        method: 'POST',
        body: {
          targetLocale,
          currentPath: route.path,
          preservePath: true
        }
      })

      // Navigate to the determined path
      await navigateTo(response.targetPath)

      // Show message if page was not found in target locale
      if (!response.pageExists && response.redirectType !== 'home') {
        fallbackMessage.value = response.message || 
          t('navigation.pageRedirectedMessage', { 
            locale: availableLocales.value.find(l => l.code === targetLocale)?.name 
          })
      }
    } else {
      // Simple locale switch to home page
      await switchLocale(targetLocale as Locale, false)
    }

  } catch (error) {
    console.error('Failed to switch locale:', error)
    switchError.value = error instanceof Error 
      ? error.message 
      : t('navigation.languageSwitchGenericError')
  } finally {
    isSwitching.value = false
  }
}

// Keyboard navigation support
const handleKeyDown = (event: KeyboardEvent, localeCode: string) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleLocaleSwitch(localeCode)
  }
}

// Preload content for all locales on mount
onMounted(async () => {
  try {
    // Preload navigation data for better switching performance
    const { preloadAllLocales } = useNavigationI18n()
    await preloadAllLocales()
  } catch (error) {
    console.warn('Failed to preload locale data:', error)
  }
})
</script>

<style scoped>
.language-switcher {
  @apply relative;
}

.compact-switcher {
  @apply bg-gray-100 dark:bg-gray-800 rounded-lg p-1;
}

.locale-button {
  @apply flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200;
  @apply text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white;
  @apply hover:bg-white dark:hover:bg-gray-700;
}

.locale-button.active {
  @apply bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm;
  @apply ring-1 ring-gray-200 dark:ring-gray-600;
}

.locale-button:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.locale-button.loading {
  @apply animate-pulse;
}

.flag {
  @apply text-sm;
}

.code {
  @apply font-mono;
}

.switching-overlay {
  @apply absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm;
  @apply flex items-center justify-center rounded-lg;
}

.switching-content {
  @apply flex items-center gap-2 text-gray-600 dark:text-gray-400;
}

/* Focus styles for accessibility */
.locale-button:focus {
  @apply outline-none ring-2 ring-blue-500 ring-opacity-50;
}

/* Animation for flag changes */
.flag {
  @apply transition-transform duration-200;
}

.locale-button:hover .flag {
  @apply scale-110;
}
</style>