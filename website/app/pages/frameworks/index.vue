<template>
  <div class="frameworks-page min-h-screen bg-slate-matrix-800 dark:bg-slate-matrix-800">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white py-20">
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-5xl font-bold font-rajdhani mb-6">
          {{ $t('frameworks.page.title') }}
        </h1>
        
        <p class="text-xl text-blue-200 mb-8 max-w-3xl mx-auto leading-relaxed">
          {{ $t('frameworks.page.subtitle') }}
        </p>
        
        <!-- Architecture Layers Visual -->
        <div class="max-w-4xl mx-auto mb-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <h3 class="font-semibold text-green-300 mb-2">{{ $t('frameworks.layers.oracle') }}</h3>
              <p class="text-sm text-gray-300">{{ $t('frameworks.layers.oracleDesc') }}</p>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <h3 class="font-semibold text-orange-300 mb-2">{{ $t('frameworks.layers.zion') }}</h3>
              <p class="text-sm text-gray-300">{{ $t('frameworks.layers.zionDesc') }}</p>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <h3 class="font-semibold text-blue-300 mb-2">{{ $t('frameworks.layers.operator') }}</h3>
              <p class="text-sm text-gray-300">{{ $t('frameworks.layers.operatorDesc') }}</p>
            </div>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton 
            size="lg" 
            color="white"
            icon="i-heroicons-rocket-launch"
            :to="localePath('/docs/quickstart')"
            class="border-2 border-white/30 shadow-lg hover:shadow-xl hover:border-white/50 hover:-translate-y-0.5 transition-all duration-300"
          >
            {{ $t('frameworks.page.actions.startImplementation') }}
          </UButton>
          
          <UButton 
            size="lg" 
            variant="outline" 
            color="white"
            icon="i-heroicons-folder"
            :to="localePath('/resources')"
            class="border-2 border-white/50 shadow-lg hover:shadow-xl hover:border-white/70 hover:-translate-y-0.5 transition-all duration-300 bg-transparent backdrop-blur-sm"
          >
            {{ $t('frameworks.page.actions.viewResources') }}
          </UButton>
        </div>
      </div>
    </section>

    <!-- MEP Special Section -->
    <section class="py-16 bg-slate-matrix-700 dark:bg-slate-matrix-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4 font-rajdhani">
            {{ $t('frameworks.mep.title') }}
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {{ $t('frameworks.mep.description') }}
          </p>
        </div>
        
        <div class="max-w-4xl mx-auto">
          <UCard class="framework-mep-card">
            <div class="flex items-start gap-6 p-6">
              <!-- MEP Icon -->
              <div class="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="text-2xl">📜</span>
              </div>
              
              <!-- MEP Content -->
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-4">
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-white font-rajdhani">
                    Matrix Epistemic Principle (MEP)
                  </h3>
                  <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                    {{ $t('frameworks.mep.badge') }}
                  </span>
                </div>
                
                <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {{ $t('frameworks.mep.longDescription') }}
                </p>
                
                <blockquote class="italic text-lg text-blue-900 dark:text-blue-300 border-l-4 border-blue-500 pl-4 mb-6">
                  "{{ $t('mep.quote') }}"
                </blockquote>
                
                <div class="flex flex-col sm:flex-row gap-3">
                  <UButton 
                    :to="localePath('/mep')"
                    color="purple"
                    icon="i-heroicons-document-text"
                    class="border-2 border-purple-400/50 shadow-lg hover:shadow-xl hover:border-purple-400/70 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {{ $t('frameworks.mep.actions.readManifesto') }}
                  </UButton>
                  
                  <UButton 
                    variant="outline"
                    color="purple"
                    icon="i-heroicons-light-bulb"
                    :to="localePath('/mep#principles')"
                    class="cursor-pointer border-2 border-purple-400/60 shadow-lg hover:shadow-xl hover:border-purple-400/80 hover:-translate-y-0.5 transition-all duration-300 bg-transparent backdrop-blur-sm"
                  >
                    {{ $t('frameworks.mep.actions.seePrinciples') }}
                  </UButton>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Oracle Layer Frameworks -->
    <section class="py-16 bg-emerald-50 dark:bg-emerald-900/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <div class="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <UIcon name="i-heroicons-shield-check" class="w-4 h-4" />
            {{ $t('frameworks.layers.oracle') }}
          </div>
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4 font-rajdhani">
            {{ $t('frameworks.oracle.title') }}
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {{ $t('frameworks.oracle.description') }}
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- MEF Framework -->
          <UCard class="framework-card oracle-layer">
            <div class="p-6">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center p-2">
                  <NuxtImg src="/logos/mef/mef-logo-icon.svg" alt="MEF Logo" class="w-full h-full" />
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                    {{ $t('frameworks.mef.name') }}
                  </h3>
                  <p class="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                    {{ $t('frameworks.mef.description') }}
                  </p>
                </div>
              </div>
              
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                {{ $t('frameworks.mef.longDescription') }}
              </p>
              
              <div class="mb-6">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">
                  {{ $t('frameworks.card.keyFeatures') }}
                </h4>
                <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li class="flex items-start gap-2">
                    <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{{ $t('frameworks.mef.features.uki') }}</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{{ $t('frameworks.mef.features.versioning') }}</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{{ $t('frameworks.mef.features.semantic') }}</span>
                  </li>
                </ul>
              </div>
              
              <div class="flex gap-3">
                <UButton 
                  :to="localePath('/frameworks/mef')"
                  color="emerald"
                  size="sm"
                  class="border-2 border-emerald-400/50 shadow-lg hover:shadow-xl hover:border-emerald-400/70 hover:-translate-y-0.5 transition-all duration-300"
                >
                  {{ $t('frameworks.card.actions.documentation') }}
                </UButton>
                <UButton 
                  :to="localePath('/docs/examples/knowledge')"
                  variant="outline"
                  color="emerald"
                  size="sm"
                  class="border-2 border-emerald-400/60 shadow-lg hover:shadow-xl hover:border-emerald-400/80 hover:-translate-y-0.5 transition-all duration-300 bg-transparent backdrop-blur-sm"
                >
                  {{ $t('frameworks.card.actions.examples') }}
                </UButton>
              </div>
            </div>
          </UCard>

          <!-- MAL Framework -->
          <UCard class="framework-card oracle-layer">
            <div class="p-6">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center p-2">
                  <NuxtImg src="/logos/mal/mal-logo-icon.svg" alt="MAL Logo" class="w-full h-full" />
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                    {{ $t('frameworks.mal.name') }}
                  </h3>
                  <p class="text-sm text-red-600 dark:text-red-400 font-medium">
                    {{ $t('frameworks.mal.description') }}
                  </p>
                </div>
              </div>
              
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                {{ $t('frameworks.mal.longDescription') }}
              </p>
              
              <div class="mb-6">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">
                  {{ $t('frameworks.card.keyFeatures') }}
                </h4>
                <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li class="flex items-start gap-2">
                    <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>{{ $t('frameworks.mal.features.arbitration') }}</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>{{ $t('frameworks.mal.features.conflicts') }}</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>{{ $t('frameworks.mal.features.governance') }}</span>
                  </li>
                </ul>
              </div>
              
              <div class="flex gap-3">
                <UButton 
                  :to="localePath('/frameworks/mal')"
                  color="red"
                  size="sm"
                  class="border-2 border-red-400/50 shadow-lg hover:shadow-xl hover:border-red-400/70 hover:-translate-y-0.5 transition-all duration-300"
                >
                  {{ $t('frameworks.card.actions.documentation') }}
                </UButton>
                <UButton 
                  :to="localePath('/docs/examples/knowledge')"
                  variant="outline"
                  color="red"
                  size="sm"
                  class="border-2 border-red-400/60 shadow-lg hover:shadow-xl hover:border-red-400/80 hover:-translate-y-0.5 transition-all duration-300 bg-transparent backdrop-blur-sm"
                >
                  {{ $t('frameworks.card.actions.examples') }}
                </UButton>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Zion Layer Frameworks -->
    <section class="py-16 bg-orange-50 dark:bg-orange-900/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <div class="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <UIcon name="i-heroicons-cog-6-tooth" class="w-4 h-4" />
            {{ $t('frameworks.layers.zion') }}
          </div>
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4 font-rajdhani">
            {{ $t('frameworks.zion.title') }}
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {{ $t('frameworks.zion.description') }}
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- ZOF Framework -->
          <UCard class="framework-card zion-layer">
            <div class="p-6">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center p-2">
                  <NuxtImg src="/logos/zof/zof-logo-icon.svg" alt="ZOF Logo" class="w-full h-full" />
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                    {{ $t('frameworks.zof.name') }}
                  </h3>
                  <p class="text-sm text-orange-600 dark:text-orange-400 font-medium">
                    {{ $t('frameworks.zof.description') }}
                  </p>
                </div>
              </div>
              
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                {{ $t('frameworks.zof.longDescription') }}
              </p>
              
              <div class="mb-6">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">
                  {{ $t('frameworks.card.keyFeatures') }}
                </h4>
                <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li class="flex items-start gap-2">
                    <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{{ $t('frameworks.zof.features.workflows') }}</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{{ $t('frameworks.zof.features.orchestration') }}</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{{ $t('frameworks.zof.features.collaboration') }}</span>
                  </li>
                </ul>
              </div>
              
              <div class="flex gap-3">
                <UButton 
                  :to="localePath('/frameworks/zof')"
                  color="orange"
                  size="sm"
                  class="border-2 border-orange-400/50 shadow-lg hover:shadow-xl hover:border-orange-400/70 hover:-translate-y-0.5 transition-all duration-300"
                >
                  {{ $t('frameworks.card.actions.documentation') }}
                </UButton>
                <UButton 
                  :to="localePath('/docs/examples/knowledge')"
                  variant="outline"
                  color="orange"
                  size="sm"
                  class="border-2 border-orange-400/60 shadow-lg hover:shadow-xl hover:border-orange-400/80 hover:-translate-y-0.5 transition-all duration-300 bg-transparent backdrop-blur-sm"
                >
                  {{ $t('frameworks.card.actions.examples') }}
                </UButton>
              </div>
            </div>
          </UCard>

          <!-- MOC Framework -->
          <UCard class="framework-card zion-layer">
            <div class="p-6">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center p-2">
                  <NuxtImg src="/logos/moc/moc-logo-icon.svg" alt="MOC Logo" class="w-full h-full" />
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                    {{ $t('frameworks.moc.name') }}
                  </h3>
                  <p class="text-sm text-purple-600 dark:text-purple-400 font-medium">
                    {{ $t('frameworks.moc.description') }}
                  </p>
                </div>
              </div>
              
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                {{ $t('frameworks.moc.longDescription') }}
              </p>
              
              <div class="mb-6">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">
                  {{ $t('frameworks.card.keyFeatures') }}
                </h4>
                <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li class="flex items-start gap-2">
                    <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>{{ $t('frameworks.moc.features.hierarchies') }}</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>{{ $t('frameworks.moc.features.ontologies') }}</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>{{ $t('frameworks.moc.features.catalog') }}</span>
                  </li>
                </ul>
              </div>
              
              <div class="flex gap-3">
                <UButton 
                  :to="localePath('/frameworks/moc')"
                  color="purple"
                  size="sm"
                  class="border-2 border-purple-400/50 shadow-lg hover:shadow-xl hover:border-purple-400/70 hover:-translate-y-0.5 transition-all duration-300"
                >
                  {{ $t('frameworks.card.actions.documentation') }}
                </UButton>
                <UButton 
                  :to="localePath('/docs/examples/knowledge')"
                  variant="outline"
                  color="purple"
                  size="sm"
                  class="border-2 border-purple-400/60 shadow-lg hover:shadow-xl hover:border-purple-400/80 hover:-translate-y-0.5 transition-all duration-300 bg-transparent backdrop-blur-sm"
                >
                  {{ $t('frameworks.card.actions.examples') }}
                </UButton>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Operator Layer Framework -->
    <section class="py-16 bg-blue-50 dark:bg-blue-900/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <div class="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <UIcon name="i-heroicons-cpu-chip" class="w-4 h-4" />
            {{ $t('frameworks.layers.operator') }}
          </div>
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4 font-rajdhani">
            {{ $t('frameworks.operator.title') }}
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {{ $t('frameworks.operator.description') }}
          </p>
        </div>

        <div class="max-w-3xl mx-auto">
          <!-- OIF Framework -->
          <UCard class="framework-card operator-layer">
            <div class="p-6">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center p-2">
                  <NuxtImg src="/logos/oif/oif-logo-icon.svg" alt="OIF Logo" class="w-full h-full" />
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                    {{ $t('frameworks.oif.name') }}
                  </h3>
                  <p class="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    {{ $t('frameworks.oif.description') }}
                  </p>
                </div>
              </div>
              
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                {{ $t('frameworks.oif.longDescription') }}
              </p>
              
              <div class="mb-6">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">
                  {{ $t('frameworks.card.keyFeatures') }}
                </h4>
                <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li class="flex items-start gap-2">
                    <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>{{ $t('frameworks.oif.features.archetypes') }}</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>{{ $t('frameworks.oif.features.intelligence') }}</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>{{ $t('frameworks.oif.features.patterns') }}</span>
                  </li>
                </ul>
              </div>
              
              <div class="flex gap-3">
                <UButton 
                  :to="localePath('/frameworks/oif')"
                  color="blue"
                  size="sm"
                  class="border-2 border-blue-400/50 shadow-lg hover:shadow-xl hover:border-blue-400/70 hover:-translate-y-0.5 transition-all duration-300"
                >
                  {{ $t('frameworks.card.actions.documentation') }}
                </UButton>
                <UButton 
                  :to="localePath('/docs/examples/knowledge')"
                  variant="outline"
                  color="blue"
                  size="sm"
                  class="border-2 border-blue-400/60 shadow-lg hover:shadow-xl hover:border-blue-400/80 hover:-translate-y-0.5 transition-all duration-300 bg-transparent backdrop-blur-sm"
                >
                  {{ $t('frameworks.card.actions.examples') }}
                </UButton>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Framework Relationships -->
    <section id="principles" class="py-16 bg-slate-matrix-700 dark:bg-slate-matrix-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4 font-rajdhani">
            {{ $t('frameworks.relationships.title') }}
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {{ $t('frameworks.relationships.description') }}
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {{ $t('frameworks.relationships.flowTitle') }}
            </h3>
            
            <div class="space-y-4">
              <div class="group relative flex items-center gap-4 p-6 bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border border-emerald-500/30 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                <div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">1</div>
                <div class="flex-1">
                  <h4 class="font-bold text-white mb-1 text-lg">{{ $t('frameworks.relationships.step1.title') }}</h4>
                  <p class="text-sm text-gray-200 leading-relaxed">{{ $t('frameworks.relationships.step1.description') }}</p>
                </div>
                <div class="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div class="group relative flex items-center gap-4 p-6 bg-gradient-to-br from-orange-900/40 to-orange-800/20 border border-orange-500/30 rounded-xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                <div class="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">2</div>
                <div class="flex-1">
                  <h4 class="font-bold text-white mb-1 text-lg">{{ $t('frameworks.relationships.step2.title') }}</h4>
                  <p class="text-sm text-gray-200 leading-relaxed">{{ $t('frameworks.relationships.step2.description') }}</p>
                </div>
                <div class="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div class="group relative flex items-center gap-4 p-6 bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-xl shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                <div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">3</div>
                <div class="flex-1">
                  <h4 class="font-bold text-white mb-1 text-lg">{{ $t('frameworks.relationships.step3.title') }}</h4>
                  <p class="text-sm text-gray-200 leading-relaxed">{{ $t('frameworks.relationships.step3.description') }}</p>
                </div>
                <div class="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div class="group relative flex items-center gap-4 p-6 bg-gradient-to-br from-red-900/40 to-red-800/20 border border-red-500/30 rounded-xl shadow-lg shadow-red-500/10 hover:shadow-red-500/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                <div class="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">4</div>
                <div class="flex-1">
                  <h4 class="font-bold text-white mb-1 text-lg">{{ $t('frameworks.relationships.step4.title') }}</h4>
                  <p class="text-sm text-gray-200 leading-relaxed">{{ $t('frameworks.relationships.step4.description') }}</p>
                </div>
                <div class="absolute inset-0 bg-gradient-to-br from-red-400/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
          
          <div class="text-center">
            <div class="inline-block p-8 bg-gradient-to-br from-slate-800/60 to-slate-700/40 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-slate-400/30 dark:border-blue-700 backdrop-blur-sm shadow-2xl">
              <h4 class="text-lg font-semibold text-white dark:text-white mb-4">
                {{ $t('frameworks.relationships.integration') }}
              </h4>
              
              <!-- Visual representation -->
              <div class="space-y-4">
                <div class="flex justify-center gap-3">
                  <div class="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-lg hover:scale-105 transition-transform duration-200">MEF</div>
                  <div class="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-lg hover:scale-105 transition-transform duration-200">MAL</div>
                </div>
                <div class="text-xs text-gray-300 dark:text-gray-400 font-medium">Oracle Layer</div>
                
                <div class="flex justify-center gap-3">
                  <div class="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-lg hover:scale-105 transition-transform duration-200">ZOF</div>
                  <div class="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-lg hover:scale-105 transition-transform duration-200">MOC</div>
                </div>
                <div class="text-xs text-gray-300 dark:text-gray-400 font-medium">Zion Layer</div>
                
                <div class="flex justify-center">
                  <div class="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-lg hover:scale-105 transition-transform duration-200">OIF</div>
                </div>
                <div class="text-xs text-gray-300 dark:text-gray-400 font-medium">Operator Layer</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-16 bg-gradient-to-r from-blue-900 to-purple-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-white mb-4 font-rajdhani">
          {{ $t('frameworks.cta.title') }}
        </h2>
        <p class="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
          {{ $t('frameworks.cta.description') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton 
            size="lg"
            color="white"
            icon="i-heroicons-academic-cap"
            :to="localePath('/mep')"
            class="border-2 border-white/30 shadow-lg hover:shadow-xl hover:border-white/50 hover:-translate-y-0.5 transition-all duration-300"
          >
            {{ $t('frameworks.cta.exploreMEP') }}
          </UButton>
          <UButton 
            size="lg"
            variant="outline"
            color="white"
            icon="i-heroicons-document-text"
            :to="localePath('/docs')"
            class="border-2 border-white/50 shadow-lg hover:shadow-xl hover:border-white/70 hover:-translate-y-0.5 transition-all duration-300 bg-transparent backdrop-blur-sm"
          >
            {{ $t('frameworks.cta.readProtocol') }}
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Composables
const localePath = useLocalePath()

// Methods
const scrollToSection = (sectionId) => {
  if (process.client) {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerHeight = 80
      const elementPosition = element.offsetTop - headerHeight
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }
}

// SEO usando composable padrão
const seoTitle = computed(() => 'Frameworks Matrix Protocol | MEF, ZOF, OIF, MOC, MAL')
const seoDescription = computed(() => 'Conheça os 5 frameworks do Matrix Protocol: MEF (Oracle), ZOF e MOC (Zion), OIF (Operator), MAL (Arbitragem) e o manifesto epistemológico MEP.')

useSEO({
  title: seoTitle,
  description: seoDescription,
  ogType: 'website'
})
</script>

<style scoped>
.framework-card {
  transition: all 0.3s;
}

.framework-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: scale(1.05);
}

.oracle-layer {
  border-left-width: 4px;
  border-left-color: #10b981;
}

.zion-layer {
  border-left-width: 4px;
  border-left-color: #f97316;
}

.operator-layer {
  border-left-width: 4px;
  border-left-color: #3b82f6;
}

.framework-mep-card {
  border-width: 2px;
  border-color: #e9d5ff;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
}

.dark .framework-mep-card {
  border-color: #6d28d9;
}

</style>