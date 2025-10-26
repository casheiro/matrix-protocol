<template>
  <div class="min-h-screen bg-slate-matrix-800 dark:bg-slate-matrix-800">
    <!-- Header -->
    <div class="bg-slate-matrix-700 dark:bg-slate-matrix-700 border-b border-slate-matrix-600 dark:border-slate-matrix-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <UIcon name="i-heroicons-squares-plus" class="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <h1 class="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
              {{ $t('resources.title') }}
            </h1>
          </div>
          
          <!-- Breadcrumb Navigation -->
          <div class="flex items-center space-x-2 text-sm">
            <UButton
              :to="localePath('/')"
              variant="ghost"
              size="sm"
              icon="i-heroicons-home"
              class="cursor-pointer"
            >
              {{ $t('common.home') }}
            </UButton>
            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400" />
            <span class="text-gray-600 dark:text-gray-300">
              {{ $t('resources.title') }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Introduction -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {{ $t('resources.subtitle') }}
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {{ $t('resources.description') }}
        </p>
      </div>

      <!-- Resources Grid -->
      <div class="space-y-12">
        
        <!-- Start Here - User Profile Based Direction -->
        <section id="start-here">
          <div class="flex items-center mb-6">
            <UIcon name="i-heroicons-rocket-launch" class="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ $t('resources.startHere.title') }}
            </h3>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- New to Matrix Protocol -->
            <UCard class="border-green-200 dark:border-green-800 flex flex-col h-full">
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                  <h4 class="font-semibold text-green-800 dark:text-green-200">{{ $t('resources.startHere.newcomer.title') }}</h4>
                </div>
              </template>
              <div class="flex flex-col h-full">
                <p class="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                  {{ $t('resources.startHere.newcomer.description') }}
                </p>
                <div class="space-y-2 mt-auto">
                  <UButton
                    :to="localePath('/protocol')"
                    color="success"
                    icon="i-heroicons-book-open"
                    size="sm"
                    block
                    class="cursor-pointer"
                  >
                    {{ $t('resources.startHere.newcomer.readProtocol') }}
                  </UButton>
                  <UButton
                    :to="localePath('/docs/quickstart')"
                    variant="outline"
                    color="success"
                    icon="i-heroicons-bolt"
                    size="sm"
                    block
                    class="cursor-pointer"
                  >
                    {{ $t('resources.startHere.newcomer.quickStart') }}
                  </UButton>
                </div>
              </div>
            </UCard>

            <!-- Ready to Implement -->
            <UCard class="border-blue-200 dark:border-blue-800 flex flex-col h-full">
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <h4 class="font-semibold text-blue-800 dark:text-blue-200">{{ $t('resources.startHere.implementer.title') }}</h4>
                </div>
              </template>
              <div class="flex flex-col h-full">
                <p class="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                  {{ $t('resources.startHere.implementer.description') }}
                </p>
                <div class="space-y-2 mt-auto">
                  <UButton
                    :to="localePath('/docs/manual')"
                    color="info"
                    icon="i-heroicons-document-text"
                    size="sm"
                    block
                    class="cursor-pointer"
                  >
                    {{ $t('resources.startHere.implementer.implementationGuide') }}
                  </UButton>
                  <UButton
                    :to="localePath('/docs/manual/templates')"
                    variant="outline"
                    color="info"
                    icon="i-heroicons-clipboard-document-list"
                    size="sm"
                    block
                    class="cursor-pointer"
                  >
                    {{ $t('resources.startHere.implementer.templates') }}
                  </UButton>
                </div>
              </div>
            </UCard>

            <!-- Advanced User -->
            <UCard class="border-purple-200 dark:border-purple-800 flex flex-col h-full">
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-cpu-chip" class="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                  <h4 class="font-semibold text-purple-800 dark:text-purple-200">{{ $t('resources.startHere.advanced.title') }}</h4>
                </div>
              </template>
              <div class="flex flex-col h-full">
                <p class="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                  {{ $t('resources.startHere.advanced.description') }}
                </p>
                <div class="space-y-2 mt-auto">
                  <UButton
                    :to="localePath('/docs/examples')"
                    color="primary"
                    icon="i-heroicons-beaker"
                    size="sm"
                    block
                    class="cursor-pointer"
                  >
                    {{ $t('resources.startHere.advanced.examples') }}
                  </UButton>
                  <UButton
                    :to="localePath('/docs/manual/tools')"
                    variant="outline"
                    color="primary"
                    icon="i-heroicons-wrench-screwdriver"
                    size="sm"
                    block
                    class="cursor-pointer"
                  >
                    {{ $t('resources.startHere.advanced.tools') }}
                  </UButton>
                </div>
              </div>
            </UCard>
          </div>
        </section>

        <!-- Quick Access - Direct Links to Most Needed Documentation -->
        <section id="quick-access">
          <div class="flex items-center mb-6">
            <UIcon name="i-heroicons-bolt" class="w-6 h-6 text-orange-600 dark:text-orange-400 mr-3" />
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ $t('resources.quickAccess.title') }}
            </h3>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Frameworks -->
            <UCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push(localePath('/frameworks'))">
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-squares-2x2" class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <h4 class="font-semibold">{{ $t('resources.quickAccess.frameworks.title') }}</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {{ $t('resources.quickAccess.frameworks.description') }}
              </p>
              <div class="flex flex-wrap items-center gap-2 mt-2">
                <UBadge size="sm" color="success" variant="soft">MEF</UBadge>
                <UBadge size="sm" color="warning" variant="soft">ZOF</UBadge>
                <UBadge size="sm" color="info" variant="soft">OIF</UBadge>
                <UBadge size="sm" color="primary" variant="soft">MOC</UBadge>
                <UBadge size="sm" color="error" variant="soft">MAL</UBadge>
              </div>
            </UCard>

            <!-- Templates -->
            <UCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push(localePath('/docs/manual/templates'))">
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-document-duplicate" class="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                  <h4 class="font-semibold">{{ $t('resources.quickAccess.templates.title') }}</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {{ $t('resources.quickAccess.templates.description') }}
              </p>
              <div class="flex flex-wrap items-center gap-2 mt-2">
                <UBadge size="sm" color="success" variant="soft">Startup</UBadge>
                <UBadge size="sm" color="info" variant="soft">Scale-up</UBadge>
                <UBadge size="sm" color="primary" variant="soft">Enterprise</UBadge>
                <UBadge size="sm" color="error" variant="soft">Corporation</UBadge>
              </div>
            </UCard>

            <!-- Examples -->
            <UCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push(localePath('/docs/examples'))">
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-beaker" class="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                  <h4 class="font-semibold">{{ $t('resources.quickAccess.examples.title') }}</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {{ $t('resources.quickAccess.examples.description') }}
              </p>
              <div class="flex flex-wrap items-center gap-2 mt-2">
                <UBadge size="sm" color="warning" variant="soft">UKIs</UBadge>
                <UBadge size="sm" color="primary" variant="soft">MOC</UBadge>
                <UBadge size="sm" color="info" variant="soft">Workflows</UBadge>
              </div>
            </UCard>

            <!-- Tools -->
            <UCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push(localePath('/docs/manual/tools'))">
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-wrench-screwdriver" class="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
                  <h4 class="font-semibold">{{ $t('resources.quickAccess.tools.title') }}</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {{ $t('resources.quickAccess.tools.description') }}
              </p>
              <div class="flex flex-wrap items-center gap-2 mt-2">
                <UBadge size="sm" color="neutral" variant="soft">Validation</UBadge>
                <UBadge size="sm" color="info" variant="soft">Checklists</UBadge>
                <UBadge size="sm" color="success" variant="soft">Audit</UBadge>
              </div>
            </UCard>
          </div>
        </section>

        <!-- Download Center - Essential Downloads Only -->
        <section id="download-center">
          <div class="flex items-center mb-6">
            <UIcon name="i-heroicons-arrow-down-tray" class="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ $t('resources.downloadCenter.title') }}
            </h3>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Quick Start Template -->
            <UCard class="border-green-200 dark:border-green-800">
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <UIcon name="i-heroicons-rocket-launch" class="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                    <h4 class="font-semibold text-green-800 dark:text-green-200">{{ $t('resources.downloadCenter.quickStart.title') }}</h4>
                  </div>
                  <UBadge color="success" size="sm" variant="soft">{{ $t('resources.downloadCenter.quickStart.badge') }}</UBadge>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                {{ $t('resources.downloadCenter.quickStart.description') }}
              </p>
              <UButton
                @click="downloadMatrixFile('moc-starter-template')"
                color="success"
                icon="i-heroicons-arrow-down-tray"
                size="sm"
                block
                class="cursor-pointer"
              >
                {{ $t('common.currentLanguage') }}
              </UButton>
            </UCard>

            <!-- Unified Structure (Normative) -->
            <UCard class="border-purple-200 dark:border-purple-800">
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <UIcon name="i-heroicons-cube-transparent" class="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                    <h4 class="font-semibold text-purple-800 dark:text-purple-200">{{ $t('resources.downloadCenter.unified.title') }}</h4>
                  </div>
                  <UBadge color="primary" size="sm" variant="soft">{{ $t('resources.downloadCenter.unified.badge') }}</UBadge>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                {{ $t('resources.downloadCenter.unified.description') }}
              </p>
              <UButton
                @click="downloadMatrixFile('moc-unified-structure')"
                color="primary"
                icon="i-heroicons-arrow-down-tray"
                size="sm"
                block
                class="cursor-pointer"
              >
                {{ $t('resources.downloadCenter.unified.download') }}
              </UButton>
            </UCard>

            <!-- Implementation Guide -->
            <UCard class="border-blue-200 dark:border-blue-800">
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <h4 class="font-semibold text-blue-800 dark:text-blue-200">{{ $t('resources.downloadCenter.guide.title') }}</h4>
                  </div>
                  <UBadge color="info" size="sm" variant="soft">{{ $t('resources.downloadCenter.guide.badge') }}</UBadge>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                {{ $t('resources.downloadCenter.guide.description') }}
              </p>
              <UButton
                @click="downloadMatrixFile('implementation-guide')"
                color="info"
                icon="i-heroicons-arrow-down-tray"
                size="sm"
                block
                class="cursor-pointer"
              >
                {{ $t('common.currentLanguage') }}
              </UButton>
            </UCard>
          </div>
          
          <!-- Link to All Templates in Documentation -->
          <div class="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ $t('resources.downloadCenter.allTemplates.title') }}
            </h4>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              {{ $t('resources.downloadCenter.allTemplates.description') }}
            </p>
            <UButton
              :to="localePath('/docs/manual/templates')"
              variant="outline"
              icon="i-heroicons-folder-open"
              class="cursor-pointer"
            >
              {{ $t('resources.downloadCenter.allTemplates.viewAll') }}
            </UButton>
          </div>
        </section>







        <!-- Learn More - Structured Learning Paths -->
        <section id="learn-more">
          <div class="flex items-center mb-6">
            <UIcon name="i-heroicons-academic-cap" class="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ $t('resources.learnMore.title') }}
            </h3>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Learning Path for Beginners -->
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <UIcon name="i-heroicons-academic-cap" class="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                {{ $t('resources.learnMore.beginner.title') }}
              </h4>
              <div class="space-y-3">
                <div class="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                    <span class="text-green-600 dark:text-green-400 font-bold text-sm">1</span>
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-gray-900 dark:text-white">{{ $t('resources.learnMore.beginner.step1.title') }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('resources.learnMore.beginner.step1.description') }}</div>
                  </div>
                  <UButton :to="localePath('/protocol')" variant="ghost" size="xs" icon="i-heroicons-arrow-right" class="cursor-pointer" />
                </div>
                
                <div class="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                    <span class="text-blue-600 dark:text-blue-400 font-bold text-sm">2</span>
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-gray-900 dark:text-white">{{ $t('resources.learnMore.beginner.step2.title') }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('resources.learnMore.beginner.step2.description') }}</div>
                  </div>
                  <UButton :to="localePath('/frameworks')" variant="ghost" size="xs" icon="i-heroicons-arrow-right" class="cursor-pointer" />
                </div>
                
                <div class="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-3">
                    <span class="text-purple-600 dark:text-purple-400 font-bold text-sm">3</span>
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-gray-900 dark:text-white">{{ $t('resources.learnMore.beginner.step3.title') }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('resources.learnMore.beginner.step3.description') }}</div>
                  </div>
                  <UButton :to="localePath('/docs/quickstart')" variant="ghost" size="xs" icon="i-heroicons-arrow-right" class="cursor-pointer" />
                </div>
              </div>
            </div>

            <!-- Learning Path for Advanced Users -->
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <UIcon name="i-heroicons-cpu-chip" class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                {{ $t('resources.learnMore.advanced.title') }}
              </h4>
              <div class="space-y-3">
                <div class="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <div class="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mr-3">
                    <span class="text-orange-600 dark:text-orange-400 font-bold text-sm">1</span>
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-gray-900 dark:text-white">{{ $t('resources.learnMore.advanced.step1.title') }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('resources.learnMore.advanced.step1.description') }}</div>
                  </div>
                  <UButton :to="localePath('/docs/examples/knowledge')" variant="ghost" size="xs" icon="i-heroicons-arrow-right" class="cursor-pointer" />
                </div>
                
                <div class="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-3">
                    <span class="text-purple-600 dark:text-purple-400 font-bold text-sm">2</span>
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-gray-900 dark:text-white">{{ $t('resources.learnMore.advanced.step2.title') }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('resources.learnMore.advanced.step2.description') }}</div>
                  </div>
                  <UButton :to="localePath('/docs/manual')" variant="ghost" size="xs" icon="i-heroicons-arrow-right" class="cursor-pointer" />
                </div>
                
                <div class="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <div class="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-3">
                    <span class="text-red-600 dark:text-red-400 font-bold text-sm">3</span>
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-gray-900 dark:text-white">{{ $t('resources.learnMore.advanced.step3.title') }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('resources.learnMore.advanced.step3.description') }}</div>
                  </div>
                  <UButton :to="localePath('/docs/manual/tools')" variant="ghost" size="xs" icon="i-heroicons-arrow-right" class="cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      <!-- Call to Action -->
      <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-8 text-center mt-12">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {{ $t('resources.cta.title') }}
        </h3>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          {{ $t('resources.cta.description') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            :to="localePath('/docs/quickstart')"
            color="primary"
            size="lg"
            icon="i-heroicons-rocket-launch"
            class="cursor-pointer"
          >
            {{ $t('resources.cta.quickstart') }}
          </UButton>
          <UButton
            :to="localePath('/docs/manual')"
            variant="outline"
            color="primary"
            size="lg"
            icon="i-heroicons-book-open"
            class="cursor-pointer"
          >
            {{ $t('resources.cta.documentation') }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { resolveDownload } = useMatrixLinks()

// Função para fazer download de arquivos usando useMatrixLinks
const downloadMatrixFile = async (key: string) => {
  const downloadInfo = resolveDownload(key)
  if (downloadInfo) {
    await downloadFile(downloadInfo.url, downloadInfo.filename)
  } else {
    console.error(`MatrixLinks: Unknown download key "${key}"`)
  }
}

// Função simplificada - removida função específica para README

// Função para fazer download de arquivos
const downloadFile = async (filePath: string, fileName: string) => {
  try {
    const response = await fetch(filePath)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Download failed:', error)
    // Fallback: tentar abrir em nova aba
    window.open(filePath, '_blank')
  }
}

// Handle scroll to hash on mount and hash changes
const scrollToHash = () => {
  if (import.meta.client && route.hash) {
    nextTick(() => {
      const element = document.getElementById(route.hash.substring(1))
      if (element) {
        const headerHeight = 80
        const elementPosition = element.offsetTop - headerHeight
        
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        })
      }
    })
  }
}

// Handle URL hash changes
watch(() => route.hash, () => {
  scrollToHash()
})

// Scroll to hash on mount
onMounted(() => {
  scrollToHash()
})

// SEO usando composable padrão
const seoTitle = computed(() => `${t('resources.title')} | Matrix Protocol`)
const seoDescription = computed(() => t('resources.description'))

useSEO({
  title: seoTitle,
  description: seoDescription,
  ogType: 'website'
})
</script>