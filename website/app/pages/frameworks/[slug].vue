<template>
  <div class="framework-page min-h-screen bg-slate-matrix-800">
    <div class="flex">
      <!-- Sidebar -->
      <aside 
        v-if="false"
        class="hidden lg:block w-80 bg-slate-matrix-700 border-r border-slate-matrix-600 h-screen sticky top-0 overflow-y-auto"
      >
        <FrameworkSidebar
          :framework="frameworkData"
          :current-section="currentSection"
          @section-change="handleSectionChange"
        />
      </aside>

      <!-- Main Content -->
      <main class="flex-1 min-w-0">
        <div class="flex">
          <!-- Content Area -->
          <div class="flex-1 min-w-0">
            <div class="max-w-4xl mx-auto px-4 py-8">
              <!-- Framework Content -->
              <div class="framework-content">
                <!-- Framework Overview Card -->
                <div class="mb-8">
                  <UCard class="framework-overview-card">
                    <div class="flex items-start gap-6">
                      <!-- Framework Icon -->
                      <div 
                        class="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                        :class="frameworkIconBg"
                      >
                        <span class="text-2xl font-bold text-white">
                          {{ frameworkData?.acronym?.charAt(0) }}
                        </span>
                      </div>
                      
                      <!-- Framework Info -->
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-3 mb-2">
                          <h1 class="text-3xl font-bold text-gray-900 dark:text-white font-rajdhani">
                            {{ frameworkData?.acronym }}
                          </h1>
                          <UBadge
                            :color="getFrameworkColor(route.params.slug)"
                            variant="soft"
                            size="sm"
                          >
                            v{{ frameworkData?.version || '0.0.1' }}
                          </UBadge>
                        </div>
                        
                        <h2 class="text-xl text-gray-700 dark:text-gray-300 mb-4">
                          {{ frameworkData?.name }}
                        </h2>
                        
                        <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {{ frameworkData?.description }}
                        </p>
                      </div>
                    </div>
                  </UCard>
                </div>

                <!-- Action Buttons -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                  <UButton
                    :to="`/${$i18n.locale.value}/resources#basic-${route.params.slug}`"
                    variant="ghost"
                    size="lg"
                    block
                    class="border-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
                    :class="getFrameworkButtonClasses(route.params.slug, 'outline')"
                  >
                    <span class="flex items-center justify-center">
                      <UIcon name="i-heroicons-arrow-down-tray" class="w-5 h-5 mr-2 transition-transform duration-300 group-hover:translate-y-0.5" />
                      {{ $t('frameworks.actions.downloadTemplates') }}
                    </span>
                  </UButton>
                  
                  <UButton
                    :to="`/${$i18n.locale.value}/implementation`"
                    variant="ghost"
                    size="lg"
                    block
                    class="font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transform group"
                    :class="getFrameworkButtonClasses(route.params.slug, 'solid')"
                  >
                    <span class="flex items-center justify-center">
                      <UIcon name="i-heroicons-rocket-launch" class="w-5 h-5 mr-2 transition-transform duration-300 group-hover:translate-x-0.5" />
                      {{ $t('frameworks.actions.implementNow') }}
                    </span>
                  </UButton>
                </div>

                <!-- Framework Documentation Content -->
                <div class="prose prose-lg dark:prose-invert max-w-none">
                  <!-- Dynamic content from Nuxt Content will be rendered here -->
                  <ContentRenderer
                    v-if="frameworkContent"
                    :value="frameworkContent"
                    class="framework-markdown-content"
                  />
                  
                  <!-- Fallback content if no markdown found -->
                  <div v-else class="fallback-content">
                    <section id="overview" class="mb-12" role="region" aria-labelledby="overview-title">
                      <h2 id="overview-title" class="text-2xl font-bold mb-4">{{ $t('frameworks.sections.overview') }}</h2>
                      <p class="mb-4">
                        <strong>{{ frameworkData?.name }} ({{ frameworkData?.acronym }})</strong> 
                        {{ $t('frameworks.fallback.intro') }}
                      </p>
                      <p class="mb-6">
                        {{ frameworkData?.description }}
                      </p>
                    </section>

                    <section id="getting-started" class="mb-12" role="region" aria-labelledby="getting-started-title">
                      <h2 id="getting-started-title" class="text-2xl font-bold mb-4">{{ $t('frameworks.sections.gettingStarted') }}</h2>
                      <p class="mb-4">
                        {{ $t('frameworks.fallback.getStartedIntro', { framework: frameworkData?.acronym }) }}
                      </p>
                      <ol class="list-decimal list-inside space-y-2 mb-6">
                        <li>{{ $t('frameworks.fallback.steps.download') }}</li>
                        <li>{{ $t('frameworks.fallback.steps.study') }}</li>
                        <li>{{ $t('frameworks.fallback.steps.implement') }}</li>
                        <li>{{ $t('frameworks.fallback.steps.test') }}</li>
                      </ol>
                    </section>

                    <section id="examples" class="mb-12" role="region" aria-labelledby="examples-title">
                      <h2 id="examples-title" class="text-2xl font-bold mb-4">{{ $t('frameworks.sections.examples') }}</h2>
                      <p class="mb-6">
                        {{ $t('frameworks.fallback.examplesIntro', { framework: frameworkData?.acronym }) }}
                      </p>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <UCard>
                          <h3 class="font-semibold mb-2">{{ $t('frameworks.sections.examples') }} - {{ $t('common.basic') }}</h3>
                          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {{ $t('frameworks.fallback.basicExample') }}
                          </p>
                          <UButton 
                            :to="`/${$i18n.locale.value}/resources#basic-${route.params.slug}`"
                            variant="ghost"
                            size="sm"
                            class="transition-all duration-300 hover:shadow-md transform hover:scale-105"
                            :class="getFrameworkButtonClasses(route.params.slug, 'outline')"
                          >
                            {{ $t('frameworks.actions.viewExamples') }}
                          </UButton>
                        </UCard>
                        
                        <UCard>
                          <h3 class="font-semibold mb-2">{{ $t('frameworks.sections.examples') }} - {{ $t('common.advanced') }}</h3>
                          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {{ $t('frameworks.fallback.advancedExample') }}
                          </p>
                          <UButton 
                            :to="`/${$i18n.locale.value}/resources#advanced-${route.params.slug}`"
                            variant="ghost"
                            size="sm"
                            class="transition-all duration-300 hover:shadow-md transform hover:scale-105"
                            :class="getFrameworkButtonClasses(route.params.slug, 'outline')"
                          >
                            {{ $t('frameworks.actions.viewExamples') }}
                          </UButton>
                        </UCard>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Table of Contents (Desktop) -->
          <aside 
            class="hidden xl:block w-64 bg-slate-matrix-700 border-l border-slate-matrix-600"
          >
            <div class="sticky top-4 p-4">
              <TableOfContents
                :headings="tocHeadings"
                :active-heading="activeHeading"
                @heading-click="handleHeadingClick"
              />
            </div>
          </aside>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
// Explicit component imports
import FrameworkSidebar from '~/components/frameworks/FrameworkSidebar.vue'
import TableOfContents from '~/components/frameworks/TableOfContents.vue'

// Nuxt composables
const route = useRoute()
const { $i18n } = useNuxtApp()
const { getFramework } = useMatrixAssets()

// Framework data
const frameworkData = getFramework(route.params.slug)

// Redirect se framework não existir
if (!frameworkData) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Framework not found'
  })
}

// Reactive state
const currentSection = ref('overview')
const activeHeading = ref('')

// Computed properties
const frameworkIconBg = computed(() => {
  const colorMap = {
    mef: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    zof: 'bg-gradient-to-br from-orange-500 to-orange-600', 
    oif: 'bg-gradient-to-br from-blue-500 to-blue-600',
    moc: 'bg-gradient-to-br from-purple-500 to-purple-600',
    mal: 'bg-gradient-to-br from-red-500 to-red-600'
  }
  return colorMap[route.params.slug] || 'bg-gradient-to-br from-gray-500 to-gray-600'
})

const getFrameworkColor = (key) => {
  const colorMap = {
    mef: 'emerald',
    zof: 'orange', 
    oif: 'blue',
    moc: 'purple',
    mal: 'red'
  }
  return colorMap[key] || 'gray'
}

const getFrameworkButtonClasses = (framework, variant) => {
  const classes = {
    mef: {
      outline: 'border-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-400 text-emerald-600 dark:text-emerald-400 hover:text-emerald-500',
      solid: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white'
    },
    zof: {
      outline: 'border-orange-500 hover:bg-orange-500/10 hover:border-orange-400 text-orange-600 dark:text-orange-400 hover:text-orange-500',
      solid: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white'
    },
    oif: {
      outline: 'border-blue-500 hover:bg-blue-500/10 hover:border-blue-400 text-blue-600 dark:text-blue-400 hover:text-blue-500',
      solid: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white'
    },
    moc: {
      outline: 'border-purple-500 hover:bg-purple-500/10 hover:border-purple-400 text-purple-600 dark:text-purple-400 hover:text-purple-500',
      solid: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white'
    },
    mal: {
      outline: 'border-red-500 hover:bg-red-500/10 hover:border-red-400 text-red-600 dark:text-red-400 hover:text-red-500',
      solid: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white'
    }
  }
  
  return classes[framework]?.[variant] || ''
}

// Methods
const handleSectionChange = (section) => {
  currentSection.value = section
}

const handleHeadingClick = (headingId) => {
  activeHeading.value = headingId
}

// Load framework content using Nuxt Content 3 queryCollection
const { data: frameworkContent } = await useAsyncData(
  `framework-${route.params.slug}-${$i18n.locale.value}`,
  async () => {
    try {
      const locale = $i18n.locale.value
      const frameworkPath = `docs/frameworks/${route.params.slug}`
      
      console.log('🔍 Querying collection:', locale, 'path:', frameworkPath)
      
      // First, try to get all content from collection to debug
      const allContent = await queryCollection(locale).all()
      console.log('📋 All content in collection:', allContent?.length || 0, 'items')
      if (allContent?.length > 0) {
        console.log('📄 Sample paths:', allContent.slice(0, 3).map(c => c.path))
      }
      
      // Try without leading slash since collection has prefix configured
      let content = await queryCollection(locale).path(frameworkPath).first()
      
      // If not found, try with leading slash
      if (!content) {
        console.log('🔄 Trying with leading slash...')
        content = await queryCollection(locale).path(`/${frameworkPath}`).first()
      }
      
      // If still not found, try with full path including locale
      if (!content) {
        console.log('🔄 Trying with full path...')
        content = await queryCollection(locale).path(`/${locale}/docs/frameworks/${route.params.slug}`).first()
      }
      
      console.log('📄 Content found:', content ? 'YES' : 'NO', content?.title || 'undefined')
      
      return content
    } catch (error) {
      console.error('❌ Error querying content:', error)
      console.warn(`No content found for framework ${route.params.slug} in locale ${$i18n.locale.value}`)
      return null
    }
  }
)

// TOC headings - using ref instead of computed to allow modification
const tocHeadings = ref([])

// Generate fallback TOC when no content is found
const generateFallbackTOC = () => {
  return [
    { id: 'overview', level: 2, text: $t('frameworks.sections.overview') },
    { id: 'getting-started', level: 2, text: $t('frameworks.sections.gettingStarted') },
    { id: 'examples', level: 2, text: $t('frameworks.sections.examples') }
  ]
}

// Extract headings from rendered content for TOC
const extractHeadings = () => {
  if (import.meta.client) {
    const headings = []
    // Corrigido seletor para corresponder ao container real
    const headingElements = document.querySelectorAll('.framework-markdown-content h1, .framework-markdown-content h2, .framework-markdown-content h3, .framework-markdown-content h4, .framework-markdown-content h5, .framework-markdown-content h6')
    
    headingElements.forEach((heading) => {
      if (heading.id) {
        headings.push({
          id: heading.id,
          level: parseInt(heading.tagName.substring(1)),
          text: heading.textContent || ''
        })
      }
    })
    
    // Agora podemos modificar pois é ref, não computed
    tocHeadings.value = headings
    
    // Se não encontrou headings no markdown, usar fallback
    if (headings.length === 0 && !frameworkContent.value) {
      tocHeadings.value = generateFallbackTOC()
    }
  }
}

// Page validation
definePageMeta({
  validate: ({ params }) => {
    const validFrameworks = ['mef', 'zof', 'oif', 'moc', 'mal']
    return validFrameworks.includes(params.slug)
  }
})

// SEO usando composable padrão
const seoTitle = computed(() => {
  return `${frameworkData?.acronym} - ${frameworkData?.name} | Matrix Protocol`
})

const seoDescription = computed(() => {
  return frameworkData?.description || `Documentação completa do framework ${frameworkData?.acronym} do Matrix Protocol`
})

useSEO({
  title: seoTitle,
  description: seoDescription,
  ogType: 'article'
})

// Watch for locale changes to reload content
watch(() => $i18n.locale.value, () => {
  // Content will automatically reload due to useAsyncData reactivity
  nextTick(() => {
    if (frameworkContent.value) {
      extractHeadings()
    }
  })
})

// Extract headings when content loads - with improved timing
watch(() => frameworkContent.value, () => {
  if (frameworkContent.value && process.client) {
    // Use timeout to ensure content is fully rendered
    setTimeout(() => {
      extractHeadings()
    }, 100)
  } else {
    // Use fallback TOC when no content
    tocHeadings.value = generateFallbackTOC()
  }
})

// Initialize TOC on mount
onMounted(() => {
  if (import.meta.client) {
    // Set initial TOC
    if (frameworkContent.value) {
      setTimeout(() => {
        extractHeadings()
      }, 200)
    } else {
      tocHeadings.value = generateFallbackTOC()
    }
  }
})
</script>