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
                  @click="downloadFile('/downloads/quick-start/MOC_STARTER_TEMPLATE_PT.yaml', 'MOC_STARTER_TEMPLATE_PT.yaml')"
                  color="success"
                  icon="i-heroicons-arrow-down-tray"
                  size="sm"
                  class="cursor-pointer"
                >
                  Português
                </UButton>
                <UButton
                  @click="downloadFile('/downloads/quick-start/MOC_STARTER_TEMPLATE.yaml', 'MOC_STARTER_TEMPLATE.yaml')"
                  color="success"
                  variant="outline"
                  icon="i-heroicons-arrow-down-tray"
                  size="sm"
                  class="cursor-pointer"
                >
                  English
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
                  @click="downloadFile('/downloads/quick-start/MOC_STARTER_TEMPLATE_PT.yaml', 'MOC_STARTER_TEMPLATE_PT.yaml')"
                  color="info"
                  icon="i-heroicons-arrow-down-tray"
                  size="sm"
                  class="cursor-pointer"
                >
                  Português
                </UButton>
                <UButton
                  @click="downloadFile('/downloads/quick-start/MOC_STARTER_TEMPLATE.yaml', 'MOC_STARTER_TEMPLATE.yaml')"
                  color="info"
                  variant="outline"
                  icon="i-heroicons-arrow-down-tray"
                  size="sm"
                  class="cursor-pointer"
                >
                  English
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
                    @click="downloadFile('/downloads/templates/MOC_UNIFIED_STRUCTURE.yaml', 'MOC_UNIFIED_STRUCTURE.yaml')"
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
                @click="downloadFile('/downloads/templates/MOC_STARTUP.yaml', 'MOC_STARTUP.yaml')"
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
                @click="downloadFile('/downloads/templates/MOC_SCALEUP.yaml', 'MOC_SCALEUP.yaml')"
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
                @click="downloadFile('/downloads/templates/MOC_ENTERPRISE.yaml', 'MOC_ENTERPRISE.yaml')"
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
                @click="downloadFile('/downloads/templates/MOC_CORPORATION.yaml', 'MOC_CORPORATION.yaml')"
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
                  @click="downloadFile('/downloads/MATRIX_PROTOCOL_IMPLEMENTATION_GUIDE_PT.md', 'MATRIX_PROTOCOL_IMPLEMENTATION_GUIDE_PT.md')"
                  color="info"
                  icon="i-heroicons-arrow-down-tray"
                  size="sm"
                  class="cursor-pointer"
                >
                  Português
                </UButton>
                <UButton
                  @click="downloadFile('/downloads/MATRIX_PROTOCOL_IMPLEMENTATION_GUIDE_EN.md', 'MATRIX_PROTOCOL_IMPLEMENTATION_GUIDE_EN.md')"
                  color="info"
                  variant="outline"
                  icon="i-heroicons-arrow-down-tray"
                  size="sm"
                  class="cursor-pointer"
                >
                  English
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
                  @click="downloadFile('/downloads/README.md', 'README.md')"
                  color="success"
                  icon="i-heroicons-arrow-down-tray"
                  size="sm"
                  class="cursor-pointer"
                >
                  Português
                </UButton>
                <UButton
                  @click="downloadFile('/downloads/README_EN.md', 'README_EN.md')"
                  color="success"
                  variant="outline"
                  icon="i-heroicons-arrow-down-tray"
                  size="sm"
                  class="cursor-pointer"
                >
                  English
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
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-building-office" class="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
                  <h4 class="font-semibold">{{ $t('resources.cases.techcorp') }}</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                {{ $t('resources.cases.techcorpDescription') }}
              </p>
              <div class="flex space-x-3">
                <UButton
                  @click="downloadFile('/downloads/reference/techcorp-case-study.md', 'techcorp-case-study.md')"
                  color="warning"
                  icon="i-heroicons-arrow-down-tray"
                  size="sm"
                  class="cursor-pointer"
                >
                  Português
                </UButton>
                <UButton
                  @click="downloadFile('/downloads/reference/techcorp-case-study-en.md', 'techcorp-case-study-en.md')"
                  color="warning"
                  variant="outline"
                  icon="i-heroicons-arrow-down-tray"
                  size="sm"
                  class="cursor-pointer"
                >
                  English
                </UButton>
              </div>
            </UCard>

            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-users" class="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                  <h4 class="font-semibold">{{ $t('resources.cases.organizational') }}</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                {{ $t('resources.cases.organizationalDescription') }}
              </p>
              <div class="flex space-x-3">
                <UButton
                  @click="downloadFile('/downloads/examples/EXEMPLO_ORGANIZACIONAL_TECHCORP.md', 'EXEMPLO_ORGANIZACIONAL_TECHCORP.md')"
                  color="primary"
                  icon="i-heroicons-arrow-down-tray"
                  size="sm"
                  class="cursor-pointer"
                >
                  Português
                </UButton>
                <UButton
                  @click="downloadFile('/downloads/examples/TECHCORP_ORGANIZATIONAL_EXAMPLE.md', 'TECHCORP_ORGANIZATIONAL_EXAMPLE.md')"
                  color="primary"
                  variant="outline"
                  icon="i-heroicons-arrow-down-tray"
                  size="sm"
                  class="cursor-pointer"
                >
                  English
                </UButton>
              </div>
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
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-clipboard-document-check" class="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
                  <h4 class="font-semibold">{{ $t('resources.tools.validation') }}</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                {{ $t('resources.tools.validationDescription') }}
              </p>
              <div class="flex space-x-3">
                <UButton
                  @click="downloadFile('/downloads/tools/validation-checklists-pt.md', 'validation-checklists-pt.md')"
                  color="neutral"
                  icon="i-heroicons-arrow-down-tray"
                  size="sm"
                  class="cursor-pointer"
                >
                  Português
                </UButton>
                <UButton
                  @click="downloadFile('/downloads/tools/validation-checklists.md', 'validation-checklists.md')"
                  color="neutral"
                  variant="outline"
                  icon="i-heroicons-arrow-down-tray"
                  size="sm"
                  class="cursor-pointer"
                >
                  English
                </UButton>
              </div>
            </UCard>

            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-map" class="w-5 h-5 text-teal-600 dark:text-teal-400 mr-2" />
                  <h4 class="font-semibold">{{ $t('resources.tools.phases') }}</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                {{ $t('resources.tools.phasesDescription') }}
              </p>
              <div class="flex space-x-3">
                <UButton
                  @click="downloadFile('/downloads/templates/FASES_IMPLEMENTACAO_DETALHADAS.md', 'FASES_IMPLEMENTACAO_DETALHADAS.md')"
                  color="success"
                  icon="i-heroicons-arrow-down-tray"
                  size="sm"
                  class="cursor-pointer"
                >
                  Português
                </UButton>
                <UButton
                  @click="downloadFile('/downloads/templates/IMPLEMENTATION_PHASES_DETAILED.md', 'IMPLEMENTATION_PHASES_DETAILED.md')"
                  color="success"
                  variant="outline"
                  icon="i-heroicons-arrow-down-tray"
                  size="sm"
                  class="cursor-pointer"
                >
                  English
                </UButton>
              </div>
            </UCard>
          </div>
        </section>

        <!-- Framework Specific Resources -->
        <!-- MEF Resources -->
        <section id="basic-mef">
          <div class="flex items-center mb-6">
            <div class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
              <span class="text-white font-bold text-sm">MEF</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              Matrix Embedding Framework - Recursos Básicos
            </h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-document" class="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />
                  <h4 class="font-semibold">Templates UKI Básicos</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Templates básicos para criação de Units of Knowledge Interlinked (UKIs)
              </p>
              <UButton
                @click="downloadMatrixFile('basic-templates')"
                color="success"
                icon="i-heroicons-arrow-down-tray"
                size="sm"
                class="cursor-pointer"
              >
                Download Templates
              </UButton>
            </UCard>
            
            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-book-open" class="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />
                  <h4 class="font-semibold">Guia de Implementação MEF</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Guia passo a passo para implementar o Matrix Embedding Framework
              </p>
              <UButton
                @click="downloadMatrixFile('implementation-guide-pt')"
                color="success"
                variant="outline"
                icon="i-heroicons-arrow-down-tray"
                size="sm"
                class="cursor-pointer"
              >
                Download Guia
              </UButton>
            </UCard>
          </div>
        </section>

        <section id="advanced-mef">
          <div class="flex items-center mb-6">
            <div class="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center mr-3">
              <span class="text-white font-bold text-sm">MEF</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              Matrix Embedding Framework - Recursos Avançados
            </h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />
                  <h4 class="font-semibold">Templates UKI Avançados</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Templates complexos com relacionamentos ontológicos e versionamento avançado
              </p>
              <UButton
                @click="downloadMatrixFile('advanced-templates')"
                color="success"
                icon="i-heroicons-arrow-down-tray"
                size="sm"
                class="cursor-pointer"
              >
                Download Templates
              </UButton>
            </UCard>
            
            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-academic-cap" class="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />
                  <h4 class="font-semibold">Casos de Uso Complexos</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Exemplos de implementação MEF em organizações de grande porte
              </p>
              <UButton
                @click="downloadMatrixFile('techcorp-case-study')"
                color="success"
                variant="outline"
                icon="i-heroicons-arrow-down-tray"
                size="sm"
                class="cursor-pointer"
              >
                Download Casos
              </UButton>
            </UCard>
          </div>
        </section>

        <!-- ZOF Resources -->
        <section id="basic-zof">
          <div class="flex items-center mb-6">
            <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
              <span class="text-white font-bold text-sm">ZOF</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              Zion Orchestration Framework - Recursos Básicos
            </h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-play" class="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
                  <h4 class="font-semibold">Workflows Básicos</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Templates de workflows básicos para orquestração de tarefas
              </p>
              <UButton
                @click="downloadFile('/downloads/frameworks/zof/basic-workflows.zip', 'zof-basic-workflows.zip')"
                color="warning"
                icon="i-heroicons-arrow-down-tray"
                size="sm"
                class="cursor-pointer"
              >
                Download Workflows
              </UButton>
            </UCard>
            
            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
                  <h4 class="font-semibold">Guia de Orquestração</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Manual completo para implementar orquestração de workflows
              </p>
              <UButton
                @click="downloadFile('/downloads/frameworks/zof/ZOF_ORCHESTRATION_GUIDE.md', 'ZOF_ORCHESTRATION_GUIDE.md')"
                color="warning"
                variant="outline"
                icon="i-heroicons-arrow-down-tray"
                size="sm"
                class="cursor-pointer"
              >
                Download Guia
              </UButton>
            </UCard>
          </div>
        </section>

        <section id="advanced-zof">
          <div class="flex items-center mb-6">
            <div class="w-8 h-8 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center mr-3">
              <span class="text-white font-bold text-sm">ZOF</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              Zion Orchestration Framework - Recursos Avançados
            </h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-cpu-chip" class="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
                  <h4 class="font-semibold">Workflows Complexos</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Workflows avançados com checkpoints e orquestração multi-agente
              </p>
              <UButton
                @click="downloadFile('/downloads/frameworks/zof/advanced-workflows.zip', 'zof-advanced-workflows.zip')"
                color="warning"
                icon="i-heroicons-arrow-down-tray"
                size="sm"
                class="cursor-pointer"
              >
                Download Workflows
              </UButton>
            </UCard>
            
            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-command-line" class="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
                  <h4 class="font-semibold">Integração de Sistemas</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Exemplos de integração ZOF com sistemas existentes
              </p>
              <UButton
                @click="downloadFile('/downloads/frameworks/zof/system-integration.md', 'zof-system-integration.md')"
                color="warning"
                variant="outline"
                icon="i-heroicons-arrow-down-tray"
                size="sm"
                class="cursor-pointer"
              >
                Download Exemplos
              </UButton>
            </UCard>
          </div>
        </section>

        <!-- OIF Resources -->
        <section id="basic-oif">
          <div class="flex items-center mb-6">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
              <span class="text-white font-bold text-sm">OIF</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              Operator Intelligence Framework - Recursos Básicos
            </h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-user-circle" class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <h4 class="font-semibold">Arquétipos Básicos</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Templates de arquétipos de operadores para diferentes funções
              </p>
              <UButton
                @click="downloadFile('/downloads/frameworks/oif/basic-archetypes.zip', 'oif-basic-archetypes.zip')"
                color="info"
                icon="i-heroicons-arrow-down-tray"
                size="sm"
                class="cursor-pointer"
              >
                Download Arquétipos
              </UButton>
            </UCard>
            
            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-light-bulb" class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <h4 class="font-semibold">Guia de Inteligência</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Manual para implementar sistemas de inteligência operacional
              </p>
              <UButton
                @click="downloadFile('/downloads/frameworks/oif/OIF_INTELLIGENCE_GUIDE.md', 'OIF_INTELLIGENCE_GUIDE.md')"
                color="info"
                variant="outline"
                icon="i-heroicons-arrow-down-tray"
                size="sm"
                class="cursor-pointer"
              >
                Download Guia
              </UButton>
            </UCard>
          </div>
        </section>

        <section id="advanced-oif">
          <div class="flex items-center mb-6">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mr-3">
              <span class="text-white font-bold text-sm">OIF</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              Operator Intelligence Framework - Recursos Avançados
            </h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-beaker" class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <h4 class="font-semibold">Arquétipos Complexos</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Arquétipos avançados com IA integrada e adaptação dinâmica
              </p>
              <UButton
                @click="downloadFile('/downloads/frameworks/oif/advanced-archetypes.zip', 'oif-advanced-archetypes.zip')"
                color="info"
                icon="i-heroicons-arrow-down-tray"
                size="sm"
                class="cursor-pointer"
              >
                Download Arquétipos
              </UButton>
            </UCard>
            
            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <h4 class="font-semibold">Análise de Performance</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Ferramentas de análise e otimização de operadores inteligentes
              </p>
              <UButton
                @click="downloadFile('/downloads/frameworks/oif/performance-analysis.md', 'oif-performance-analysis.md')"
                color="info"
                variant="outline"
                icon="i-heroicons-arrow-down-tray"
                size="sm"
                class="cursor-pointer"
              >
                Download Ferramentas
              </UButton>
            </UCard>
          </div>
        </section>

        <!-- MOC Resources -->
        <section id="basic-moc">
          <div class="flex items-center mb-6">
            <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <span class="text-white font-bold text-sm">MOC</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              Matrix Ontology Catalog - Recursos Básicos
            </h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-folder-open" class="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                  <h4 class="font-semibold">Ontologias Básicas</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Estruturas ontológicas básicas para diferentes tipos de organização
              </p>
              <UButton
                @click="downloadFile('/downloads/frameworks/moc/basic-ontologies.zip', 'moc-basic-ontologies.zip')"
                color="primary"
                icon="i-heroicons-arrow-down-tray"
                size="sm"
                class="cursor-pointer"
              >
                Download Ontologias
              </UButton>
            </UCard>
            
            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-squares-plus" class="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                  <h4 class="font-semibold">Guia de Catalogação</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Manual para criar e manter catálogos ontológicos organizacionais
              </p>
              <UButton
                @click="downloadFile('/downloads/frameworks/moc/MOC_CATALOGING_GUIDE.md', 'MOC_CATALOGING_GUIDE.md')"
                color="primary"
                variant="outline"
                icon="i-heroicons-arrow-down-tray"
                size="sm"
                class="cursor-pointer"
              >
                Download Guia
              </UButton>
            </UCard>
          </div>
        </section>

        <section id="advanced-moc">
          <div class="flex items-center mb-6">
            <div class="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center mr-3">
              <span class="text-white font-bold text-sm">MOC</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              Matrix Ontology Catalog - Recursos Avançados
            </h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-cube" class="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                  <h4 class="font-semibold">Ontologias Complexas</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Estruturas ontológicas avançadas para grandes corporações
              </p>
              <UButton
                @click="downloadFile('/downloads/frameworks/moc/advanced-ontologies.zip', 'moc-advanced-ontologies.zip')"
                color="primary"
                icon="i-heroicons-arrow-down-tray"
                size="sm"
                class="cursor-pointer"
              >
                Download Ontologias
              </UButton>
            </UCard>
            
            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                  <h4 class="font-semibold">Migração de Sistemas</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Guias de migração de sistemas legados para MOC
              </p>
              <UButton
                @click="downloadFile('/downloads/frameworks/moc/system-migration.md', 'moc-system-migration.md')"
                color="primary"
                variant="outline"
                icon="i-heroicons-arrow-down-tray"
                size="sm"
                class="cursor-pointer"
              >
                Download Guias
              </UButton>
            </UCard>
          </div>
        </section>

        <!-- MAL Resources -->
        <section id="basic-mal">
          <div class="flex items-center mb-6">
            <div class="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
              <span class="text-white font-bold text-sm">MAL</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              Matrix Arbiter Layer - Recursos Básicos
            </h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-scale" class="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                  <h4 class="font-semibold">Protocolos de Arbitragem</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Protocolos básicos para resolução de conflitos e arbitragem
              </p>
              <UButton
                @click="downloadFile('/downloads/frameworks/mal/basic-protocols.zip', 'mal-basic-protocols.zip')"
                color="error"
                icon="i-heroicons-arrow-down-tray"
                size="sm"
                class="cursor-pointer"
              >
                Download Protocolos
              </UButton>
            </UCard>
            
            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-clipboard-document-check" class="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                  <h4 class="font-semibold">Guia de Arbitragem</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Manual completo para implementar camadas de arbitragem
              </p>
              <UButton
                @click="downloadFile('/downloads/frameworks/mal/MAL_ARBITRATION_GUIDE.md', 'MAL_ARBITRATION_GUIDE.md')"
                color="error"
                variant="outline"
                icon="i-heroicons-arrow-down-tray"
                size="sm"
                class="cursor-pointer"
              >
                Download Guia
              </UButton>
            </UCard>
          </div>
        </section>

        <section id="advanced-mal">
          <div class="flex items-center mb-6">
            <div class="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center mr-3">
              <span class="text-white font-bold text-sm">MAL</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              Matrix Arbiter Layer - Recursos Avançados
            </h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-shield-check" class="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                  <h4 class="font-semibold">Arbitragem Complexa</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Protocolos avançados para arbitragem multi-domínio e hierárquica
              </p>
              <UButton
                @click="downloadFile('/downloads/frameworks/mal/advanced-arbitration.zip', 'mal-advanced-arbitration.zip')"
                color="error"
                icon="i-heroicons-arrow-down-tray"
                size="sm"
                class="cursor-pointer"
              >
                Download Protocolos
              </UButton>
            </UCard>
            
            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-document-magnifying-glass" class="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                  <h4 class="font-semibold">Auditoria e Compliance</h4>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Ferramentas de auditoria e conformidade para sistemas MAL
              </p>
              <UButton
                @click="downloadFile('/downloads/frameworks/mal/audit-compliance.md', 'mal-audit-compliance.md')"
                color="error"
                variant="outline"
                icon="i-heroicons-arrow-down-tray"
                size="sm"
                class="cursor-pointer"
              >
                Download Ferramentas
              </UButton>
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
            :to="localePath('/quickstart')"
            color="primary"
            size="lg"
            icon="i-heroicons-rocket-launch"
            class="cursor-pointer"
          >
            {{ $t('resources.cta.quickstart') }}
          </UButton>
          <UButton
            :to="localePath('/implementation')"
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