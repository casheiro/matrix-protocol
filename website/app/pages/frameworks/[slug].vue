<template>
  <div class="framework-promotional-page min-h-screen bg-gradient-to-b from-slate-matrix-800 to-slate-matrix-900">
    <!-- Hero Section Premium -->
    <section class="hero-section relative overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" :class="frameworkGradient"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div class="text-center">
          <!-- Framework Icon -->
          <div class="flex justify-center mb-8">
            <div 
              class="w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl"
              :class="frameworkIconBg"
            >
              <span class="text-4xl font-bold text-white font-rajdhani">
                {{ frameworkData.acronym }}
              </span>
            </div>
          </div>
          
          <!-- Framework Title -->
          <h1 class="text-5xl lg:text-7xl font-bold text-white mb-6 font-rajdhani">
            {{ $t(`frameworks.${frameworkData.key}.name`) }}
          </h1>
          
          <!-- Subtitle -->
          <p class="text-xl lg:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            {{ $t(`frameworks.${frameworkData.key}.description`) }}
          </p>
          
          <!-- Version Badge -->
          <div class="flex justify-center mb-12">
            <UBadge
              :color="frameworkBadgeColor"
              :class="frameworkBadgeClass"
              variant="soft"
              size="lg"
              class="px-6 py-2 text-lg font-semibold"
            >
              {{ versionBadge }}
            </UBadge>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              :to="localePath('/docs/frameworks/' + route.params.slug)"
              size="xl"
              class="font-bold px-8 py-4 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
              :class="frameworkPrimaryButton"
            >
              <UIcon name="i-heroicons-book-open" class="w-6 h-6 mr-3" />
              {{ $t('frameworks.promotional.sections.documentation') }}
            </UButton>
            
            <UButton
              :to="localePath('/resources#download-center')"
              size="xl"
              class="font-semibold px-8 py-4 text-lg border-2 bg-transparent transition-all duration-300 transform hover:scale-105"
              :class="frameworkOutlineButton"
            >
              <UIcon name="i-heroicons-arrow-down-tray" class="w-6 h-6 mr-3" />
              {{ $t('frameworks.promotional.sections.downloadTemplates') }}
            </UButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section py-20 bg-slate-matrix-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-bold text-white mb-6 font-rajdhani">
            {{ $t('frameworks.promotional.sections.featuresTitle') }}
          </h2>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto">
            {{ featuresSubtitle }}
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="(feature, index) in frameworkFeatures" 
            :key="index"
            class="feature-card group"
          >
            <UCard class="h-full hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2 bg-slate-matrix-600 border-slate-matrix-500">
              <div class="text-center p-6">
                <div class="mb-6">
                  <div 
                    class="w-16 h-16 rounded-xl flex items-center justify-center mx-auto shadow-lg"
                    :class="frameworkIconBg"
                  >
                    <UIcon :name="feature.icon" class="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h3 class="text-xl font-bold text-white mb-4 font-rajdhani">
                  {{ rt(feature.title) }}
                </h3>
                
                <p class="text-gray-300 leading-relaxed">
                  {{ rt(feature.description) }}
                </p>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="benefits-section py-20 bg-gradient-to-r from-slate-matrix-800 to-slate-matrix-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <!-- Text Content -->
          <div>
            <h2 class="text-4xl lg:text-5xl font-bold text-white mb-8 font-rajdhani">
              {{ benefitsTitle }}
            </h2>
            
            <div class="space-y-6">
              <div 
                v-for="(benefit, index) in frameworkBenefits" 
                v-if="Array.isArray(frameworkBenefits) && frameworkBenefits.length > 0"
                :key="index"
                class="flex items-start space-x-4"
              >
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                  :class="frameworkIconBg"
                >
                  <UIcon name="i-heroicons-check" class="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-white mb-2">
                    {{ rt(benefit.title) }}
                  </h3>
                  <p class="text-gray-300 leading-relaxed">
                    {{ rt(benefit.description) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Visual Element -->
          <div class="flex justify-center">
            <div class="relative">
              <div 
                class="w-80 h-80 rounded-3xl shadow-2xl flex items-center justify-center"
                :class="frameworkGradient"
              >
                <img 
                  :src="frameworkLogoPath" 
                  :alt="`${frameworkData.acronym} Logo`"
                  class="w-64 h-64  object-contain brightness-0 invert"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Implementation Process -->
    <section class="process-section py-20 bg-slate-matrix-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-bold text-white mb-6 font-rajdhani">
            {{ $t('frameworks.promotional.sections.implementationTitle') }}
          </h2>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto">
            {{ implementationSubtitle }}
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div 
            v-for="(step, index) in implementationSteps" 
            v-if="Array.isArray(implementationSteps) && implementationSteps.length > 0"
            :key="index"
            class="text-center group"
          >
            <div class="mb-6">
              <div 
                class="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300"
                :class="frameworkIconBg"
              >
                <span class="text-2xl font-bold text-white">
                  {{ index + 1 }}
                </span>
              </div>
            </div>
            
            <h3 class="text-xl font-bold text-white mb-4 font-rajdhani">
              {{ rt(step.title) }}
            </h3>
            
            <p class="text-gray-300 leading-relaxed">
              {{ rt(step.description) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta-section py-20 bg-gradient-to-r from-slate-matrix-900 to-black">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl lg:text-5xl font-bold text-white mb-6 font-rajdhani">
          {{ $t('frameworks.promotional.sections.ctaTitle') }}
        </h2>
        
        <p class="text-xl text-gray-300 mb-12 leading-relaxed">
          {{ ctaSubtitle }}
        </p>
        
        <div class="flex flex-col sm:flex-row gap-6 justify-center">
          <UButton
            :to="localePath('/docs/quickstart')"
            size="xl"
            class="font-bold px-10 py-5 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
            :class="frameworkPrimaryButton"
          >
            <UIcon name="i-heroicons-rocket-launch" class="w-6 h-6 mr-3" />
            {{ $t('frameworks.promotional.sections.getStarted') }}
          </UButton>
          
          <UButton
            :to="localePath('/docs/examples')"
            size="xl"
            class="font-semibold px-10 py-5 text-lg border-2 bg-transparent transition-all duration-300 transform hover:scale-105"
            :class="frameworkOutlineButton"
          >
            <UIcon name="i-heroicons-beaker" class="w-6 h-6 mr-3" />
            {{ $t('frameworks.promotional.sections.viewExamples') }}
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Nuxt composables
const route = useRoute()
const localePath = useLocalePath()
const { t, tm, rt } = useI18n()
// Framework data using i18n directly in template

// Framework basic data 
const frameworkData = computed(() => {
  const key = String(route.params.slug)
  
  // Get acronym based on framework key
  const acronymMap = {
    mef: 'MEF',
    zof: 'ZOF', 
    oif: 'OIF',
    moc: 'MOC',
    mal: 'MAL'
  }
  
  return {
    key,
    acronym: acronymMap[key] || key.toUpperCase(),
    version: 'Beta'
  }
})

// Redirect se framework não existir
const validFrameworks = ['mef', 'zof', 'oif', 'moc', 'mal']
if (!validFrameworks.includes(route.params.slug)) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Framework not found'
  })
}

// Ícones para features (não traduzíveis)
const frameworkIcons = {
  mef: [
    'i-heroicons-document-text',
    'i-heroicons-link',
    'i-heroicons-shield-check'
  ],
  zof: [
    'i-heroicons-arrow-path',
    'i-heroicons-eye',
    'i-heroicons-cpu-chip'
  ],
  oif: [
    'i-heroicons-user-group',
    'i-heroicons-chat-bubble-left-right'
  ],
  moc: [
    'i-heroicons-building-office',
    'i-heroicons-key',
    'i-heroicons-adjustments-vertical'
  ],
  mal: [
    'i-heroicons-scale',
    'i-heroicons-document-check',
    'i-heroicons-bolt'
  ]
}

// Framework logo path from public/logos directory
const frameworkLogoPath = computed(() => {
  const slug = String(route.params.slug)
  return `/logos/${slug}/${slug}-logo-icon.svg`
})

// Framework features with i18n data using tm()
const frameworkFeatures = computed(() => {
  const slug = String(route.params.slug)
  const features = tm(`frameworks.${slug}.features`)
  const icons = frameworkIcons[slug] || []
  
  if (typeof features === 'object' && features !== null) {
    return Object.entries(features).map(([, value], index) => ({
      icon: icons[index] || 'i-heroicons-star',
      title: value,
      description: value
    }))
  }
  return []
})

const frameworkBenefits = computed(() => {
  const slug = String(route.params.slug)
  return tm(`frameworks.promotional.${slug}.benefits`)
})

const implementationSteps = computed(() => {
  const slug = String(route.params.slug)
  return tm(`frameworks.promotional.${slug}.implementationSteps`)
})

// Text computed properties with interpolation
const featuresSubtitle = computed(() => 
  t('frameworks.promotional.sections.featuresSubtitle', { framework: frameworkData.value.acronym })
)

const benefitsTitle = computed(() => 
  t('frameworks.promotional.sections.benefitsTitle', { framework: frameworkData.value.acronym })
)

const implementationSubtitle = computed(() => 
  t('frameworks.promotional.sections.implementationSubtitle', { framework: frameworkData.value.acronym })
)

const ctaSubtitle = computed(() => 
  t('frameworks.promotional.sections.ctaSubtitle', { framework: frameworkData.value.acronym })
)

const versionBadge = computed(() => 
  t('frameworks.promotional.sections.version', { version: frameworkData.value.version })
)

// Computed properties for styling
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

const frameworkGradient = computed(() => {
  const colorMap = {
    mef: 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600',
    zof: 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600', 
    oif: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
    moc: 'bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600',
    mal: 'bg-gradient-to-br from-red-400 via-red-500 to-red-600'
  }
  return colorMap[route.params.slug] || 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600'
})

const frameworkPrimaryButton = computed(() => {
  const colorMap = {
    mef: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white',
    zof: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white',
    oif: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white',
    moc: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white',
    mal: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white'
  }
  return colorMap[route.params.slug] || 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500 text-white'
})

const frameworkOutlineButton = computed(() => {
  const colorMap = {
    mef: 'border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400',
    zof: 'border-orange-500 text-orange-400 hover:bg-orange-500/10 hover:border-orange-400',
    oif: 'border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400',
    moc: 'border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400',
    mal: 'border-red-500 text-red-400 hover:bg-red-500/10 hover:border-red-400'
  }
  return colorMap[route.params.slug] || 'border-gray-500 text-gray-400 hover:bg-gray-500/10 hover:border-gray-400'
})

// Framework color for badges using Nuxt UI standard colors
const frameworkBadgeColor = computed(() => {
  const colorMap = {
    mef: 'success',
    zof: 'warning', 
    oif: 'info',
    moc: 'purple',
    mal: 'error'
  }
  return colorMap[route.params.slug] || 'gray'
})

// Framework badge classes for MOC (purple) since it's not a standard color
const frameworkBadgeClass = computed(() => {
  if (route.params.slug === 'moc') {
    return 'bg-purple-400/10 text-purple-400'
  }
  return ''
})

// Page validation
definePageMeta({
  validate: ({ params }) => {
    const validFrameworks = ['mef', 'zof', 'oif', 'moc', 'mal']
    return validFrameworks.includes(params.slug)
  }
})

// SEO with i18n
const seoTitle = computed(() => {
  const name = t(`frameworks.${frameworkData.value.key}.name`)
  return `${frameworkData.value.acronym} - ${name} | Matrix Protocol`
})

const seoDescription = computed(() => {
  const description = t(`frameworks.${frameworkData.value.key}.description`)
  return description || `Descubra o framework ${frameworkData.value.acronym} do Matrix Protocol`
})

useSEO({
  title: seoTitle,
  description: seoDescription,
  ogType: 'website'
})
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

.feature-card {
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
}

/* Smooth scrolling for anchor links */
html {
  scroll-behavior: smooth;
}
</style>