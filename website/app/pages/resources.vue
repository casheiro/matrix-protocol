<template>
  <div class="min-h-screen bg-slate-matrix-800 dark:bg-slate-matrix-800">
    <!-- Header -->
    <div class="bg-slate-matrix-700 dark:bg-slate-matrix-700 border-b border-slate-matrix-600 dark:border-slate-matrix-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <UIcon name="i-heroicons-folder-arrow-down" class="w-8 h-8 text-purple-600 dark:text-purple-400" />
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
        
        <!-- Quick Start Templates -->
        <section id="quickstart">
          <div class="flex items-center mb-6">
            <UIcon name="i-heroicons-rocket-launch" class="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ $t('resources.quickStart.title') }}
            </h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-document" class="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                  <h4 class="font-semibold">{{ $t('resources.quickStart.basicTemplate') }}</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                {{ $t('resources.quickStart.basicDescription') }}
              </p>
              <div class="flex space-x-3">
                <UButton
                  @click="downloadMatrixFile('moc-starter-template')"
                  color="success"
                  icon="i-heroicons-arrow-down-tray"
                  size="sm"
                  class="cursor-pointer"
                >
                  {{ $t('common.currentLanguage') }}
                </UButton>
              </div>
            </UCard>

            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-academic-cap" class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <h4 class="font-semibold">{{ $t('resources.quickStart.originalTemplate') }}</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                {{ $t('resources.quickStart.originalDescription') }}
              </p>
              <div class="flex space-x-3">
                <UButton
                  @click="downloadMatrixFile('moc-starter-template')"
                  color="info"
                  icon="i-heroicons-arrow-down-tray"
                  size="sm"
                  class="cursor-pointer"
                >
                  {{ $t('common.currentLanguage') }}
                </UButton>
              </div>
            </UCard>
          </div>
        </section>

        <!-- MOC Unified Structure -->
        <section id="unified-structure">
          <div class="mb-8">
            <UCard class="border-2 border-purple-500 bg-purple-50/5 dark:bg-purple-900/10">
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <UIcon name="i-heroicons-cube-transparent" class="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                      {{ $t('resources.unifiedStructure.title') }}
                    </h3>
                  </div>
                  <UBadge color="primary" variant="soft">
                    {{ $t('resources.unifiedStructure.normative') }}
                  </UBadge>
                </div>
              </template>
              
              <div class="space-y-6">
                <p class="text-lg text-gray-600 dark:text-gray-300">
                  {{ $t('resources.unifiedStructure.description') }}
                </p>
                
                <!-- 4 Hierarquias Obrigatórias -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div class="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                    <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                      <UIcon name="i-heroicons-eye" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div class="font-semibold text-gray-900 dark:text-white">Scope</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('resources.unifiedStructure.hierarchies.scope') }}</div>
                  </div>
                  <div class="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                    <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2">
                      <UIcon name="i-heroicons-squares-2x2" class="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div class="font-semibold text-gray-900 dark:text-white">Domain</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('resources.unifiedStructure.hierarchies.domain') }}</div>
                  </div>
                  <div class="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                    <div class="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-2">
                      <UIcon name="i-heroicons-star" class="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div class="font-semibold text-gray-900 dark:text-white">Maturity</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('resources.unifiedStructure.hierarchies.maturity') }}</div>
                  </div>
                  <div class="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                    <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-2">
                      <UIcon name="i-heroicons-clipboard-document-check" class="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div class="font-semibold text-gray-900 dark:text-white">Evaluation</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('resources.unifiedStructure.hierarchies.evaluation') }}</div>
                  </div>
                </div>
                
                <!-- Download button -->
                <div class="flex justify-center">
                  <UButton
                    @click="downloadMatrixFile('moc-unified-structure')"
                    color="primary"
                    size="lg"
                    icon="i-heroicons-arrow-down-tray"
                    class="cursor-pointer"
                  >
                    {{ $t('resources.unifiedStructure.download') }}
                  </UButton>
                </div>
              </div>
            </UCard>
          </div>
          
          <!-- Visual de Progressão -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
              {{ $t('resources.unifiedStructure.progression') }}
            </h4>
            <div class="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="text-center flex-1">
                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <UIcon name="i-heroicons-rocket-launch" class="w-6 h-6 text-white" />
                </div>
                <div class="text-green-600 dark:text-green-400 font-bold">Startup</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">3 níveis</div>
              </div>
              <UIcon name="i-heroicons-arrow-right" class="text-gray-400 mx-2" />
              <div class="text-center flex-1">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <UIcon name="i-heroicons-chart-bar-square" class="w-6 h-6 text-white" />
                </div>
                <div class="text-blue-600 dark:text-blue-400 font-bold">Scale-up</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">4 níveis</div>
              </div>
              <UIcon name="i-heroicons-arrow-right" class="text-gray-400 mx-2" />
              <div class="text-center flex-1">
                <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <UIcon name="i-heroicons-building-office-2" class="w-6 h-6 text-white" />
                </div>
                <div class="text-purple-600 dark:text-purple-400 font-bold">Enterprise</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">5 níveis</div>
              </div>
              <UIcon name="i-heroicons-arrow-right" class="text-gray-400 mx-2" />
              <div class="text-center flex-1">
                <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <UIcon name="i-heroicons-globe-alt" class="w-6 h-6 text-white" />
                </div>
                <div class="text-red-600 dark:text-red-400 font-bold">Corporation</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">6 níveis</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Templates by Organization Size -->
        <section id="templates">
          <div class="flex items-center mb-6">
            <UIcon name="i-heroicons-building-office" class="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ $t('resources.templates.title') }}
            </h3>
          </div>
          
          <!-- Templates separados por tamanho organizacional -->
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <!-- Startup Template -->
            <UCard class="border-green-200 dark:border-green-800">
              <template #header>
                <div class="text-center">
                  <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <UIcon name="i-heroicons-rocket-launch" class="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 class="font-semibold text-green-800 dark:text-green-200">Startup</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">5-50 funcionários</p>
                  <UBadge color="success" size="xs" class="mt-2">
                    <UIcon name="i-heroicons-check-circle" class="w-3 h-3 mr-1" />
                    Simples e Ágil
                  </UBadge>
                </div>
              </template>
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">
                Hierarquia flat, processos leves, foco em velocidade.
              </p>
              <UButton
                @click="downloadMatrixFile('moc-startup')"
                color="success"
                variant="outline"
                size="sm"
                block
                icon="i-heroicons-arrow-down-tray"
                class="cursor-pointer"
              >
                Download
              </UButton>
            </UCard>

            <!-- Scale-up Template -->
            <UCard class="border-blue-200 dark:border-blue-800">
              <template #header>
                <div class="text-center">
                  <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <UIcon name="i-heroicons-chart-bar-square" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 class="font-semibold text-blue-800 dark:text-blue-200">Scale-up</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">50-200 funcionários</p>
                  <UBadge color="info" size="xs" class="mt-2">
                    <UIcon name="i-heroicons-check-circle" class="w-3 h-3 mr-1" />
                    Tribes & Squads
                  </UBadge>
                </div>
              </template>
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">
                Estrutura ágil escalada, coordenação entre times.
              </p>
              <UButton
                @click="downloadMatrixFile('moc-scaleup')"
                color="info"
                variant="outline"
                size="sm"
                block
                icon="i-heroicons-arrow-down-tray"
                class="cursor-pointer"
              >
                Download
              </UButton>
            </UCard>

            <!-- Enterprise Template -->
            <UCard class="border-purple-200 dark:border-purple-800">
              <template #header>
                <div class="text-center">
                  <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <UIcon name="i-heroicons-building-office-2" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 class="font-semibold text-purple-800 dark:text-purple-200">Enterprise</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">200-1000 funcionários</p>
                  <UBadge color="primary" size="xs" class="mt-2">
                    <UIcon name="i-heroicons-check-circle" class="w-3 h-3 mr-1" />
                    Governança Formal
                  </UBadge>
                </div>
              </template>
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">
                Compliance, processos formais, múltiplas divisões.
              </p>
              <UButton
                @click="downloadMatrixFile('moc-enterprise')"
                color="primary"
                variant="outline"
                size="sm"
                block
                icon="i-heroicons-arrow-down-tray"
                class="cursor-pointer"
              >
                Download
              </UButton>
            </UCard>

            <!-- Corporation Template -->
            <UCard class="border-red-200 dark:border-red-800">
              <template #header>
                <div class="text-center">
                  <div class="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <UIcon name="i-heroicons-globe-alt" class="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h4 class="font-semibold text-red-800 dark:text-red-200">Corporation</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">1000+ funcionários</p>
                  <UBadge color="error" size="xs" class="mt-2">
                    <UIcon name="i-heroicons-check-circle" class="w-3 h-3 mr-1" />
                    Global & Regulado
                  </UBadge>
                </div>
              </template>
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">
                Multi-regional, board governance, compliance total.
              </p>
              <UButton
                @click="downloadMatrixFile('moc-corporation')"
                color="error"
                variant="outline"
                size="sm"
                block
                icon="i-heroicons-arrow-down-tray"
                class="cursor-pointer"
              >
                Download
              </UButton>
            </UCard>
          </div>
        </section>

        <!-- Implementation Guides -->
        <section id="guides">
          <div class="flex items-center mb-6">
            <UIcon name="i-heroicons-book-open" class="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ $t('resources.guides.title') }}
            </h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <h4 class="font-semibold">{{ $t('resources.guides.complete') }}</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                {{ $t('resources.guides.completeDescription') }}
              </p>
              <div class="flex space-x-3">
                <UButton
                  @click="downloadMatrixFile('implementation-guide')"
                  color="info"
                  icon="i-heroicons-arrow-down-tray"
                  size="sm"
                  class="cursor-pointer"
                >
                  {{ $t('common.currentLanguage') }}
                </UButton>
              </div>
            </UCard>

            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-clipboard-document-list" class="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                  <h4 class="font-semibold">{{ $t('resources.guides.readme') }}</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                {{ $t('resources.guides.readmeDescription') }}
              </p>
              <div class="flex space-x-3">
                <UButton
                  @click="downloadReadmeFile()"
                  color="success"
                  icon="i-heroicons-arrow-down-tray"
                  size="sm"
                  class="cursor-pointer"
                >
                  {{ $t('common.currentLanguage') }}
                </UButton>
              </div>
            </UCard>
          </div>
        </section>

        <!-- Case Studies -->
        <section id="cases">
          <div class="flex items-center mb-6">
            <UIcon name="i-heroicons-chart-pie" class="w-6 h-6 text-orange-600 dark:text-orange-400 mr-3" />
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ $t('resources.cases.title') }}
            </h3>
          </div>
          <div class="grid grid-cols-1 gap-6">
            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-academic-cap" class="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
                  <h4 class="font-semibold">{{ $t('resources.cases.knowledgeComparison') }}</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                {{ $t('resources.cases.knowledgeComparisonDescription') }}
              </p>
              <UButton
                :to="localePath('/docs/examples/knowledge')"
                color="warning"
                icon="i-heroicons-eye"
                size="sm"
                class="cursor-pointer"
              >
                {{ $t('common.viewOnline') }}
              </UButton>
            </UCard>
          </div>
        </section>

        <!-- Tools & Checklists -->
        <section id="tools">
          <div class="flex items-center mb-6">
            <UIcon name="i-heroicons-wrench-screwdriver" class="w-6 h-6 text-gray-600 dark:text-gray-400 mr-3" />
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ $t('resources.tools.title') }}
            </h3>
          </div>
          <div class="grid grid-cols-1 gap-6">
            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-book-open" class="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
                  <h4 class="font-semibold">{{ $t('resources.tools.documentation') }}</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                {{ $t('resources.tools.documentationDescription') }}
              </p>
              <div class="flex space-x-3">
                <UButton
                  :to="localePath('/docs')"
                  color="primary"
                  icon="i-heroicons-eye"
                  size="sm"
                  class="cursor-pointer"
                >
                  {{ $t('common.viewDocumentation') }}
                </UButton>
                <UButton
                  :to="localePath('/frameworks')"
                  color="primary"
                  variant="outline"
                  icon="i-heroicons-squares-2x2"
                  size="sm"
                  class="cursor-pointer"
                >
                  {{ $t('common.exploreFrameworks') }}
                </UButton>
              </div>
            </UCard>
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
            :to="localePath('/docs/implementation')"
            variant="outline"
            color="primary"
            size="lg"
            icon="i-heroicons-cog-6-tooth"
            class="cursor-pointer"
          >
            {{ $t('resources.cta.implementation') }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
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

// Função específica para download do arquivo README
const downloadReadmeFile = async () => {
  const currentLocale = locale.value
  const filename = currentLocale === 'pt' ? 'index.md' : 'README_EN.md'
  const path = `/downloads/${currentLocale}/${filename}`
  await downloadFile(path, filename)
}

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
  if (process.client && route.hash) {
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