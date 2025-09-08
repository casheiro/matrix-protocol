<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <div class="max-w-4xl mx-auto px-4 text-center">
      <!-- Hero Section -->
      <div class="mb-12">
        <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          {{ $t('home.title') }}
          <span class="inline-block ml-3 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-lg md:text-2xl font-semibold rounded-full">
            {{ $t('home.version') }}
          </span>
        </h1>
        
        <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          {{ $t('home.subtitle') }}
        </p>
        
        <p class="text-lg text-gray-500 dark:text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          {{ $t('home.description') }}
        </p>
      </div>
      
      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
        <UButton
          to="/docs"
          size="xl"
          class="px-8 py-4 text-lg font-semibold"
        >
          {{ $t('home.getStarted') }}
          <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 ml-2" />
        </UButton>
        
        <UButton
          to="/protocol"
          variant="outline"
          color="gray"
          size="xl"
          class="px-8 py-4 text-lg font-semibold"
        >
          {{ $t('home.viewDocs') }}
        </UButton>
      </div>
      
      <!-- Framework Preview Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <div
          v-for="framework in frameworks"
          :key="framework.key"
          class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
        >
          <!-- Framework Icon -->
          <div 
            class="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
            :class="framework.colorClass"
          >
            <img 
              :src="`/assets/logos/${framework.key}/${framework.key}-logo-icon.svg`"
              :alt="`${framework.acronym} Icon`"
              class="w-8 h-8"
              loading="lazy"
            />
          </div>
          
          <!-- Framework Info -->
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {{ framework.acronym }}
          </h3>
          
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            {{ $t(framework.nameKey) }}
          </p>
          
          <p class="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">
            {{ $t(framework.descriptionKey) }}
          </p>
        </div>
      </div>
      
      <!-- Status Information -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{{ $t('common.loading') }}</span>
          </div>
          <div class="hidden sm:block text-gray-300 dark:text-gray-600">•</div>
          <div class="hidden sm:flex items-center space-x-2">
            <UIcon name="i-heroicons-code-bracket" class="w-4 h-4" />
            <span>NAV-001 Implementation</span>
          </div>
          <div class="hidden md:block text-gray-300 dark:text-gray-600">•</div>
          <div class="hidden md:flex items-center space-x-2">
            <UIcon name="i-heroicons-globe-alt" class="w-4 h-4" />
            <span>{{ currentLocale.toUpperCase() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// i18n
const { locale } = useI18n()
const currentLocale = computed(() => locale.value)

// App configuration
const { appName } = useMatrixConfig()

// Frameworks data for preview
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

// i18n for meta tags
const { t } = useI18n()

// SEO Meta tags - using reactive computed values
const metaTitle = computed(() => `${appName} - ${t('meta.defaultTitle')}`)
const metaDescription = computed(() => t('meta.defaultDescription'))
const metaKeywords = computed(() => t('meta.keywords'))

useHead({
  title: metaTitle,
  meta: [
    {
      name: 'description',
      content: metaDescription
    },
    {
      name: 'keywords',
      content: metaKeywords
    },
    {
      property: 'og:title',
      content: metaTitle
    },
    {
      property: 'og:description',
      content: metaDescription
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: metaTitle
    },
    {
      name: 'twitter:description',
      content: metaDescription
    }
  ]
})

// Page layout
definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
/* Custom gradient backgrounds */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* Smooth transitions */
* {
  @apply transition-colors duration-200;
}

/* Card hover effects */
.hover\:shadow-xl:hover {
  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
</style>