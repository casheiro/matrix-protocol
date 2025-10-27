<template>
  <UDropdownMenu
    :items="dropdownItems"
    :popper="{ placement: 'bottom-start', arrow: true }"
    :ui="dropdownUI"
    :open="isOpen"
    @update:open="handleOpenChange"
  >
    <UButton
      variant="ghost"
      class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none"
      :class="{ 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/20': isFrameworkRoute }"
      trailing-icon="i-heroicons-chevron-down-20-solid"
      size="sm"
      :aria-label="`${$t('navigation.frameworks')} menu`"
    >
      {{ $t('navigation.frameworks') }}
    </UButton>

    <template #item="{ item }">
      <div v-if="item.type === 'overview'" class="flex items-center gap-3 w-full">
        <!-- Overview Icon -->
        <div class="w-3 h-3 rounded-full flex-shrink-0 bg-gradient-to-br from-blue-500 to-emerald-500" />
        
        <!-- Overview Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-900 dark:text-white">
              {{ $t('navigation.frameworksOverview') }}
            </span>
            <span class="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
              {{ $t('navigation.overviewBadge') }}
            </span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
            {{ $t('navigation.frameworksOverviewDescription') }}
          </p>
        </div>
      </div>

      <div v-else-if="item.type === 'framework'" class="flex items-center gap-3 w-full">
        <!-- Framework Color Indicator -->
        <div 
          class="w-3 h-3 rounded-full flex-shrink-0"
          :class="getFrameworkColorClass(item.framework.key)"
        />
        
        <!-- Framework Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-900 dark:text-white">
              {{ item.framework.acronym }}
            </span>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ $t(`frameworks.${item.framework.key}.name`) }}
            </span>
          </div>
          <p class="text-xs text-gray-600 dark:text-gray-300 truncate mt-0.5">
            {{ $t(`frameworks.${item.framework.key}.description`) }}
          </p>
        </div>
      </div>

      <div v-else-if="item.type === 'mep'" class="flex items-center gap-3 w-full">
        <!-- MEP Icon -->
        <div class="w-3 h-3 rounded-full flex-shrink-0 bg-gradient-to-br from-blue-600 to-purple-600" />
        
        <!-- MEP Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-900 dark:text-white">MEP</span>
            <span class="text-xs px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
              {{ $t('mep.manifestBadge') }}
            </span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
            {{ $t('mep.principleDescription') }}
          </p>
        </div>
      </div>
    </template>
  </UDropdownMenu>
</template>

<script setup>
// Composables
const { frameworks } = useMatrixConfig()
const route = useRoute()
const { locale } = useI18n()

// State
const isOpen = ref(false)

// Computed
const isFrameworkRoute = computed(() => 
  route.path.includes('/frameworks')
)

// Dropdown UI customization for Nuxt UI 3.x
const dropdownUI = {
  container: 'w-72',
  width: 'w-72',
  item: {
    base: 'group flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md transition-colors duration-200',
    active: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    inactive: 'text-gray-600 dark:text-gray-300 hover:bg-blue-500/10 dark:hover:bg-blue-900/10'
  }
}

// Create dropdown items structure for Nuxt UI 3.x
const dropdownItems = computed(() => {
  const frameworkItems = frameworks.value.map(framework => ({
    type: 'framework',
    framework,
    label: `${framework.acronym} - ${framework.name}`,
    to: `/${locale.value}/frameworks/${framework.key}`,
    click: () => handleItemClick(`/frameworks/${framework.key}`)
  }))

  return [
    {
      type: 'overview',
      label: $t('navigation.frameworksOverview'),
      to: `/${locale.value}/frameworks`,
      click: () => handleItemClick('/frameworks')
    },
    { type: 'divider' },
    ...frameworkItems,
    { type: 'divider' },
    {
      type: 'mep',
      label: `MEP - ${$t('mep.subtitle')}`,
      to: `/${locale.value}/mep`,
      click: () => handleItemClick('/mep')
    }
  ]
})

// Methods
const handleOpenChange = (open) => {
  isOpen.value = open
}

const handleItemClick = (path) => {
  navigateTo(`/${locale.value}${path}`)
  isOpen.value = false
}

// Framework color mapping
const getFrameworkColorClass = (key) => {
  const colorMap = {
    mef: 'bg-emerald-500',
    zof: 'bg-orange-500', 
    oif: 'bg-blue-500',
    moc: 'bg-purple-500',
    mal: 'bg-red-500'
  }
  return colorMap[key] || 'bg-gray-500'
}
</script>