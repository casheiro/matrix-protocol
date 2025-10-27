<template>
  <UDropdownMenu
    :items="dropdownItems"
    :popper="{ placement: 'bottom-end', arrow: true }"
    :ui="dropdownUI"
    :open="isOpen"
    @update:open="handleOpenChange"
  >
    <UButton
      variant="ghost"
      size="sm"
      :aria-label="$t('common.selectLanguage')"
      class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none"
      :ui="{ 
        base: 'focus:outline-none focus-visible:outline-none',
        ring: '',
        'focus-visible': ''
      }"
    >
      <template #leading>
        <UIcon 
          :name="currentLocale === 'pt' ? 'i-circle-flags-br' : 'i-circle-flags-us'"
          class="w-5 h-5 flex-shrink-0"
        />
      </template>
      
      <span class="font-medium">{{ currentLocale.toUpperCase() }}</span>
      
      <template #trailing>
        <UIcon 
          name="i-heroicons-chevron-down-20-solid" 
          class="w-4 h-4 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
        />
      </template>
    </UButton>

    <template #item="{ item }">
      <div class="flex items-center gap-3 w-full">
        <UIcon 
          :name="item.code === 'pt' ? 'i-circle-flags-br' : 'i-circle-flags-us'"
          class="w-5 h-5 flex-shrink-0"
        />
        <span class="flex-1 font-medium">{{ item.label }}</span>
        <UIcon 
          v-if="item.code === currentLocale"
          name="i-heroicons-check-20-solid" 
          class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0"
        />
      </div>
    </template>
  </UDropdownMenu>
</template>

<script setup>
// Composables
const { locale, locales, setLocale } = useI18n()
const route = useRoute()

// State
const isOpen = ref(false)

// Computed
const currentLocale = computed(() => locale.value)

const languageItems = computed(() => 
  locales.value.map(loc => ({
    label: loc.name,
    code: loc.code,
    onSelect: () => handleLanguageChange(loc.code)
  }))
)

// Dropdown UI customization for Nuxt UI 3.x
const dropdownUI = {
  container: 'w-48',
  width: 'w-48',
  item: {
    base: 'group flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md transition-colors duration-200',
    active: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    inactive: 'text-gray-900 dark:text-white hover:bg-blue-500/10 dark:hover:bg-slate-700/50'
  }
}

// Create dropdown items structure for Nuxt UI 3.x
const dropdownItems = computed(() => {
  return languageItems.value // Remover array wrapper
})

// Methods
const handleOpenChange = (open) => {
  isOpen.value = open
}

const handleLanguageChange = async (newLocale) => {
  await changeLanguage(newLocale)
  isOpen.value = false
}

const changeLanguage = async (newLocale) => {
  console.log('changeLanguage called:', {
    newLocale,
    currentLocale: locale.value,
    currentPath: route.path,
    setLocaleExists: typeof setLocale
  })
  
  if (typeof setLocale === 'function') {
    // Use setLocale() which properly updates locale, cookies, triggers hooks, and navigates
    await setLocale(newLocale)
    console.log('Locale changed to:', newLocale)
  } else {
    console.error('setLocale is not a function:', typeof setLocale)
  }
}

// Comentado: não forçar mudança de idioma no mount
// onMounted(() => {
//   if (process.client) {
//     const savedLocale = localStorage.getItem('nuxt-i18n-preferred-locale')
//     if (savedLocale && savedLocale !== locale.value) {
//       changeLanguage(savedLocale)
//     }
//   }
// })
</script>