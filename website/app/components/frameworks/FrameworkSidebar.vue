<template>
  <div class="framework-sidebar-content h-full flex flex-col bg-white dark:bg-slate-matrix-700">
    <!-- Framework Header -->
    <div class="flex-shrink-0 p-6 border-b border-gray-200 dark:border-slate-matrix-600">
      <div class="flex items-center gap-4">
        <div 
          class="w-10 h-10 rounded-lg flex items-center justify-center"
          :class="frameworkBgClass"
        >
          <span class="text-white font-bold text-lg">
            {{ framework?.acronym?.charAt(0) }}
          </span>
        </div>
        <div>
          <h2 class="font-semibold text-gray-900 dark:text-white font-rajdhani">
            {{ framework?.acronym }}
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ framework?.name }}
          </p>
        </div>
      </div>

      <!-- Close button for mobile -->
      <div class="mt-4 lg:hidden">
        <UButton
          @click="$emit('closeMobile')"
          variant="ghost"
          size="sm"
          icon="i-heroicons-x-mark"
          block
          class="justify-center"
          :aria-label="$t('navigation.closeSidebar')"
        >
          {{ $t('navigation.close') }}
        </UButton>
      </div>
    </div>

    <!-- Navigation Sections -->
    <nav 
      class="flex-1 overflow-y-auto"
      role="navigation"
      :aria-label="`Seções do framework ${framework?.acronym}`"
    >
      <div class="p-4 space-y-2">
        <!-- Framework Overview -->
        <div 
          role="group" 
          :aria-labelledby="`${framework?.key}-overview-heading`"
        >
          <h3 
            :id="`${framework?.key}-overview-heading`"
            :class="sidebarSectionHeadingClasses"
            role="heading"
            aria-level="3"
          >
            {{ $t('frameworks.sections.overview') }}
          </h3>
          
          <ul role="list" class="ml-2 space-y-1">
            <li role="listitem">
              <UButton
                :to="localePath(`/frameworks/${framework?.key}`)"
                variant="ghost"
                size="sm"
                :class="getSidebarNavItemClasses('overview')"
                @click="handleSectionClick('overview')"
                block
                justify="start"
              >
                <UIcon name="i-heroicons-document-text" class="w-4 h-4" />
                {{ $t('frameworks.sections.introduction') }}
              </UButton>
            </li>
            <li role="listitem">
              <UButton
                :to="localePath(`/frameworks/${framework?.key}#architecture`)"
                variant="ghost"
                size="sm"
                :class="getSidebarNavItemClasses('architecture')"
                @click="handleSectionClick('architecture')"
                block
                justify="start"
              >
                <UIcon name="i-heroicons-cube" class="w-4 h-4" />
                {{ $t('frameworks.sections.architecture') }}
              </UButton>
            </li>
            <li role="listitem">
              <UButton
                :to="localePath(`/frameworks/${framework?.key}#principles`)"
                variant="ghost"
                size="sm"
                :class="getSidebarNavItemClasses('principles')"
                @click="handleSectionClick('principles')"
                block
                justify="start"
              >
                <UIcon name="i-heroicons-light-bulb" class="w-4 h-4" />
                {{ $t('frameworks.sections.principles') }}
              </UButton>
            </li>
          </ul>
        </div>

        <!-- Implementation -->
        <div 
          role="group" 
          :aria-labelledby="`${framework?.key}-implementation-heading`"
        >
          <h3 
            :id="`${framework?.key}-implementation-heading`"
            :class="sidebarSectionHeadingClasses"
            role="heading"
            aria-level="3"
          >
            {{ $t('frameworks.sections.implementation') }}
          </h3>
          
          <ul role="list" class="ml-2 space-y-1">
            <li role="listitem">
              <UButton
                :to="localePath(`/frameworks/${framework?.key}#getting-started`)"
                variant="ghost"
                size="sm"
                :class="getSidebarNavItemClasses('getting-started')"
                @click="handleSectionClick('getting-started')"
                block
                justify="start"
              >
                <UIcon name="i-heroicons-play" class="w-4 h-4" />
                {{ $t('frameworks.sections.gettingStarted') }}
              </UButton>
            </li>
            <li role="listitem">
              <UButton
                :to="localePath(`/frameworks/${framework?.key}#examples`)"
                variant="ghost"
                size="sm"
                :class="getSidebarNavItemClasses('examples')"
                @click="handleSectionClick('examples')"
                block
                justify="start"
              >
                <UIcon name="i-heroicons-code-bracket" class="w-4 h-4" />
                {{ $t('frameworks.sections.examples') }}
              </UButton>
            </li>
            <li role="listitem">
              <UButton
                :to="localePath(`/frameworks/${framework?.key}#best-practices`)"
                variant="ghost"
                size="sm"
                :class="getSidebarNavItemClasses('best-practices')"
                @click="handleSectionClick('best-practices')"
                block
                justify="start"
              >
                <UIcon name="i-heroicons-star" class="w-4 h-4" />
                {{ $t('frameworks.sections.bestPractices') }}
              </UButton>
            </li>
          </ul>
        </div>

        <!-- Advanced Topics (if applicable) -->
        <div 
          v-if="hasAdvancedSections"
          role="group" 
          :aria-labelledby="`${framework?.key}-advanced-heading`"
        >
          <h3 
            :id="`${framework?.key}-advanced-heading`"
            :class="sidebarSectionHeadingClasses"
            role="heading"
            aria-level="3"
          >
            {{ $t('frameworks.sections.advanced') }}
          </h3>
          
          <ul role="list" class="ml-2 space-y-1">
            <li role="listitem" v-if="framework?.key === 'moc'">
              <UButton
                :to="localePath(`/frameworks/${framework?.key}#yaml-structure`)"
                variant="ghost"
                size="sm"
                :class="getSidebarNavItemClasses('yaml-structure')"
                @click="handleSectionClick('yaml-structure')"
                block
                justify="start"
              >
                <UIcon name="i-heroicons-document" class="w-4 h-4" />
                {{ $t('frameworks.sections.yamlStructure') }}
              </UButton>
            </li>
            <li role="listitem" v-if="framework?.key === 'mal'">
              <UButton
                :to="localePath(`/frameworks/${framework?.key}#decision-trees`)"
                variant="ghost"
                size="sm"
                :class="getSidebarNavItemClasses('decision-trees')"
                @click="handleSectionClick('decision-trees')"
                block
                justify="start"
              >
                <UIcon name="i-heroicons-squares-2x2" class="w-4 h-4" />
                {{ $t('frameworks.sections.decisionTrees') }}
              </UButton>
            </li>
            <li role="listitem">
              <UButton
                :to="localePath(`/frameworks/${framework?.key}#api-reference`)"
                variant="ghost"
                size="sm"
                :class="getSidebarNavItemClasses('api-reference')"
                @click="handleSectionClick('api-reference')"
                block
                justify="start"
              >
                <UIcon name="i-heroicons-command-line" class="w-4 h-4" />
                {{ $t('frameworks.sections.apiReference') }}
              </UButton>
            </li>
          </ul>
        </div>

        <!-- External Resources -->
        <div 
          role="group" 
          :aria-labelledby="`${framework?.key}-resources-heading`"
        >
          <h3 
            :id="`${framework?.key}-resources-heading`"
            :class="sidebarSectionHeadingClasses"
            role="heading"
            aria-level="3"
          >
            {{ $t('frameworks.sections.resources') }}
          </h3>
          
          <ul role="list" class="ml-2 space-y-1">
            <li role="listitem">
              <UButton
                :to="localePath(`/resources?framework=${framework?.key}`)"
                variant="ghost"
                size="sm"
                :class="sidebarNavItemClasses"
                block
                justify="start"
              >
                <UIcon name="i-heroicons-folder" class="w-4 h-4" />
                {{ $t('frameworks.sections.examples') }}
              </UButton>
            </li>
            <li role="listitem">
              <UButton
                :to="localePath(`/resources?framework=${framework?.key}`)"
                variant="ghost"
                size="sm"
                :class="sidebarNavItemClasses"
                block
                justify="start"
              >
                <UIcon name="i-heroicons-arrow-down-tray" class="w-4 h-4" />
                {{ $t('frameworks.sections.downloads') }}
              </UButton>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Footer -->
    <div class="flex-shrink-0 p-4 border-t border-gray-200 dark:border-slate-matrix-600">
      <div class="text-xs text-gray-500 dark:text-gray-400 text-center">
        <p>{{ $t('frameworks.lastUpdated') }}: {{ new Date().toLocaleDateString($i18n.locale) }}</p>
        <p class="mt-1">
          {{ $t('frameworks.version') }}: {{ framework?.version || '0.0.1' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  framework?: {
    key: string
    acronym: string
    name: string
    description: string
    colorClass: string
    primaryColor: string
    version?: string
  }
  currentSection?: string
}

const props = withDefaults(defineProps<Props>(), {
  currentSection: 'overview'
})

// Emits
const emit = defineEmits<{
  sectionChange: [section: string]
  closeMobile: []
}>()

// Composables
const localePath = useLocalePath()

// Computed
const frameworkBgClass = computed(() => {
  const colorMap: Record<string, string> = {
    mef: 'bg-emerald-500',
    zof: 'bg-orange-500',
    oif: 'bg-blue-500',
    moc: 'bg-purple-500',
    mal: 'bg-red-500'
  }
  const key = props.framework?.key
  return (key && colorMap[key]) || 'bg-gray-500'
})

const hasAdvancedSections = computed(() => {
  // MOC has YAML structure, MAL has decision trees
  return ['moc', 'mal'].includes(props.framework?.key || '')
})

// Classes computed properties (converted from @apply)
const sidebarSectionHeadingClasses = computed(() => {
  return 'text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wide px-3 py-2 mt-4 first:mt-0'
})

const sidebarNavItemClasses = computed(() => {
  return 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-matrix-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 text-sm justify-start gap-3'
})

const sidebarNavItemActiveClasses = computed(() => {
  return 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
})

const sidebarNavItemActiveHoverClasses = computed(() => {
  return 'hover:bg-blue-100 dark:hover:bg-blue-900/50'
})

// Methods
const getSidebarNavItemClasses = (section: string) => {
  const baseClasses = sidebarNavItemClasses.value
  const isActive = props.currentSection === section
  
  if (isActive) {
    return `${baseClasses} ${sidebarNavItemActiveClasses.value} ${sidebarNavItemActiveHoverClasses.value}`
  }
  
  return baseClasses
}

const handleSectionClick = (section: string) => {
  emit('sectionChange', section)
  
  // Close mobile sidebar after navigation on small screens
  if (process.client && window.innerWidth < 1024) {
    emit('closeMobile')
  }
}

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  const currentTarget = event.currentTarget as HTMLElement
  if (!currentTarget) return
  
  const focusableElements = currentTarget.querySelectorAll(
    'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>
  
  const currentElement = event.target as Element
  const currentIndex = Array.from(focusableElements).findIndex(el => el === currentElement || el.contains(currentElement))
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      const nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0
      focusableElements[nextIndex]?.focus()
      break
      
    case 'ArrowUp':
      event.preventDefault()
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1
      focusableElements[prevIndex]?.focus()
      break
      
    case 'Home':
      event.preventDefault()
      focusableElements[0]?.focus()
      break
      
    case 'End':
      event.preventDefault()
      focusableElements[focusableElements.length - 1]?.focus()
      break
  }
}

// Add keyboard navigation to the navigation container
onMounted(() => {
  const nav = document.querySelector('.framework-sidebar-content nav') as HTMLElement
  if (nav) {
    nav.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  const nav = document.querySelector('.framework-sidebar-content nav') as HTMLElement
  if (nav) {
    nav.removeEventListener('keydown', handleKeydown)
  }
})
</script>