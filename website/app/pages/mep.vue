<template>
  <div class="mep-page min-h-screen bg-slate-matrix-800 dark:bg-slate-matrix-800">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <!-- MEP Logo/Icon -->
        <div class="mb-8">
          <div class="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span class="text-3xl font-bold text-white">📜</span>
          </div>
        </div>
        
        <h1 class="text-5xl font-bold font-rajdhani mb-4">
          Matrix Epistemic Principle
        </h1>
        
        <div class="text-xl text-blue-200 mb-6">
          {{ $t('mep.subtitle') }}
        </div>
        
        <!-- Philosophical Quote -->
        <blockquote class="text-2xl italic font-light text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
          "{{ $t('mep.quote') }}"
        </blockquote>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <UButton 
            size="lg" 
            variant="outline"
            color="blue"
            icon="i-heroicons-sparkles"
            class="cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200 border-2"
            @click="scrollToSection('principles')"
          >
            {{ $t('mep.actions.explorePrinciples') }}
          </UButton>
          
          <UButton 
            size="lg" 
            variant="outline" 
            color="purple"
            icon="i-heroicons-arrow-down-tray"
            class="cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200 border-2"
            @click="downloadManifesto"
          >
            {{ $t('mep.actions.downloadManifest') }}
          </UButton>
        </div>
      </div>
    </section>

    <!-- What is MEP Section -->
    <section class="py-16 bg-slate-matrix-700 dark:bg-slate-matrix-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6 font-rajdhani">
            {{ $t('mep.whatIs.title') }}
          </h2>
          <div class="text-lg text-gray-600 dark:text-gray-300 space-y-4 leading-relaxed">
            <p>{{ $t('mep.whatIs.description1') }}</p>
            <p>{{ $t('mep.whatIs.description2') }}</p>
            <p>{{ $t('mep.whatIs.description3') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- The 5 Fundamental Principles -->
    <section id="principles" class="py-16 bg-slate-matrix-800 dark:bg-slate-matrix-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-rajdhani">
            {{ $t('mep.principles.title') }}
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {{ $t('mep.principles.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Principle 1: Elasticidade Semântica -->
          <UCard class="principle-card h-full">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-arrows-pointing-out" class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {{ $t('mep.principles.semantic.title') }}
                </h3>
                <p class="text-gray-600 dark:text-gray-300 mb-4">
                  {{ $t('mep.principles.semantic.description') }}
                </p>
                <div class="text-sm text-gray-500 dark:text-gray-400 italic">
                  {{ $t('mep.principles.semantic.impact') }}
                </div>
              </div>
            </div>
          </UCard>

          <!-- Principle 2: Epistemologia Estratificada -->
          <UCard class="principle-card h-full">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-bars-3-bottom-left" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {{ $t('mep.principles.stratified.title') }}
                </h3>
                <p class="text-gray-600 dark:text-gray-300 mb-4">
                  {{ $t('mep.principles.stratified.description') }}
                </p>
                <div class="text-sm text-gray-500 dark:text-gray-400 italic">
                  {{ $t('mep.principles.stratified.impact') }}
                </div>
              </div>
            </div>
          </UCard>

          <!-- Principle 3: Promoção Responsável -->
          <UCard class="principle-card h-full">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-arrow-trending-up" class="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {{ $t('mep.principles.promotion.title') }}
                </h3>
                <p class="text-gray-600 dark:text-gray-300 mb-4">
                  {{ $t('mep.principles.promotion.description') }}
                </p>
                <div class="text-sm text-gray-500 dark:text-gray-400 italic">
                  {{ $t('mep.principles.promotion.impact') }}
                </div>
              </div>
            </div>
          </UCard>

          <!-- Principle 4: Autoridade Derivada -->
          <UCard class="principle-card h-full">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-shield-check" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {{ $t('mep.principles.authority.title') }}
                </h3>
                <p class="text-gray-600 dark:text-gray-300 mb-4">
                  {{ $t('mep.principles.authority.description') }}
                </p>
                <div class="text-sm text-gray-500 dark:text-gray-400 italic">
                  {{ $t('mep.principles.authority.impact') }}
                </div>
              </div>
            </div>
          </UCard>

          <!-- Principle 5: Explicabilidade Necessária -->
          <UCard class="principle-card h-full lg:col-span-2">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-light-bulb" class="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {{ $t('mep.principles.explainability.title') }}
                </h3>
                <p class="text-gray-600 dark:text-gray-300 mb-4">
                  {{ $t('mep.principles.explainability.description') }}
                </p>
                <div class="text-sm text-gray-500 dark:text-gray-400 italic">
                  {{ $t('mep.principles.explainability.impact') }}
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Relationship with Frameworks -->
    <section class="py-16 bg-slate-matrix-700 dark:bg-slate-matrix-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4 font-rajdhani">
            {{ $t('mep.frameworks.title') }}
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {{ $t('mep.frameworks.description') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- MEF Connection -->
          <UCard class="framework-connection">
            <div class="text-center">
              <div class="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-white font-bold">MEF</span>
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                {{ $t('frameworks.mef.name') }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                {{ $t('mep.frameworks.mef') }}
              </p>
            </div>
          </UCard>

          <!-- ZOF Connection -->
          <UCard class="framework-connection">
            <div class="text-center">
              <div class="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-white font-bold">ZOF</span>
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                {{ $t('frameworks.zof.name') }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                {{ $t('mep.frameworks.zof') }}
              </p>
            </div>
          </UCard>

          <!-- OIF Connection -->
          <UCard class="framework-connection">
            <div class="text-center">
              <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-white font-bold">OIF</span>
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                {{ $t('frameworks.oif.name') }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                {{ $t('mep.frameworks.oif') }}
              </p>
            </div>
          </UCard>

          <!-- MOC Connection -->
          <UCard class="framework-connection">
            <div class="text-center">
              <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-white font-bold">MOC</span>
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                {{ $t('frameworks.moc.name') }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                {{ $t('mep.frameworks.moc') }}
              </p>
            </div>
          </UCard>

          <!-- MAL Connection -->
          <UCard class="framework-connection">
            <div class="text-center">
              <div class="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-white font-bold">MAL</span>
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                {{ $t('frameworks.mal.name') }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                {{ $t('mep.frameworks.mal') }}
              </p>
            </div>
          </UCard>

          <!-- Protocol Core -->
          <UCard class="framework-connection border-2 border-blue-200 dark:border-blue-700">
            <div class="text-center">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <UIcon name="i-heroicons-cpu-chip" class="w-6 h-6 text-white" />
              </div>
              <h3 class="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                {{ $t('mep.frameworks.protocol.title') }}
              </h3>
              <p class="text-sm text-blue-700 dark:text-blue-400">
                {{ $t('mep.frameworks.protocol.description') }}
              </p>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Practical Applications -->
    <section class="py-16 bg-slate-matrix-800 dark:bg-slate-matrix-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4 font-rajdhani">
            {{ $t('mep.applications.title') }}
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {{ $t('mep.applications.description') }}
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <UCard>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {{ $t('mep.applications.governance.title') }}
            </h3>
            <ul class="space-y-3 text-gray-600 dark:text-gray-300">
              <li class="flex items-start gap-3">
                <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>{{ $t('mep.applications.governance.item1') }}</span>
              </li>
              <li class="flex items-start gap-3">
                <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>{{ $t('mep.applications.governance.item2') }}</span>
              </li>
              <li class="flex items-start gap-3">
                <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>{{ $t('mep.applications.governance.item3') }}</span>
              </li>
            </ul>
          </UCard>

          <UCard>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {{ $t('mep.applications.implementation.title') }}
            </h3>
            <ul class="space-y-3 text-gray-600 dark:text-gray-300">
              <li class="flex items-start gap-3">
                <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <span>{{ $t('mep.applications.implementation.item1') }}</span>
              </li>
              <li class="flex items-start gap-3">
                <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <span>{{ $t('mep.applications.implementation.item2') }}</span>
              </li>
              <li class="flex items-start gap-3">
                <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <span>{{ $t('mep.applications.implementation.item3') }}</span>
              </li>
            </ul>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-16 bg-blue-900 dark:bg-slate-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-white mb-4 font-rajdhani">
          {{ $t('mep.cta.title') }}
        </h2>
        <p class="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
          {{ $t('mep.cta.description') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton 
            :to="localePath('/frameworks')"
            size="lg"
            variant="outline"
            color="white"
            icon="i-heroicons-cube"
            class="cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200 border-2"
          >
            {{ $t('mep.cta.exploreFrameworks') }}
          </UButton>
          <UButton 
            :to="localePath('/docs/protocol')"
            size="lg"
            variant="outline"
            color="white"
            icon="i-heroicons-document-text"
            class="cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200 border-2"
          >
            {{ $t('mep.cta.readProtocol') }}
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Composables
const localePath = useLocalePath()
const { locale } = useI18n()

// Methods
const scrollToSection = (sectionId) => {
  if (process.client) {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerHeight = 80 // Approximate header height
      const elementPosition = element.offsetTop - headerHeight
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }
}

// Download manifesto function
const downloadManifesto = () => {
  if (!process.client) return
  
  const currentLocale = locale.value
  const fileName = `MEP_MANIFESTO_${currentLocale.toUpperCase()}.md`
  
  // Create download link directly to public file
  const link = document.createElement('a')
  link.href = `/downloads/mep/${fileName}`
  link.download = fileName
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// SEO usando composable padrão
const seoTitle = computed(() => 'MEP - Matrix Epistemic Principle | Matrix Protocol')
const seoDescription = computed(() => 'O manifesto epistemológico do Matrix Protocol que estabelece os princípios fundamentais de como o conhecimento é tratado, avaliado e promovido.')

useSEO({
  title: seoTitle,
  description: seoDescription,
  ogType: 'article'
})
</script>

<style scoped>
.principle-card {
  transition: all 0.3s;
  border-left-width: 4px;
}

.principle-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.principle-card:nth-child(1) {
  border-left-color: #10b981;
}

.principle-card:nth-child(2) {
  border-left-color: #3b82f6;
}

.principle-card:nth-child(3) {
  border-left-color: #f97316;
}

.principle-card:nth-child(4) {
  border-left-color: #8b5cf6;
}

.principle-card:nth-child(5) {
  border-left-color: #ef4444;
}

.framework-connection {
  transition: all 0.3s;
}

.framework-connection:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: scale(1.05);
}
</style>