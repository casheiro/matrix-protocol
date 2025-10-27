<template>
  <div>
    <!-- Hero Section -->
    <section class="relative py-20 px-4 overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <!-- Matrix Pattern -->
        <div class="absolute inset-0 opacity-10">
          <div 
            class="absolute inset-0"
            style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0); background-size: 20px 20px;"
          />
        </div>
      </div>

      <div class="relative max-w-7xl mx-auto text-center">
      <!-- Version Badge -->
      <div class="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-blue-900/30 border border-blue-700/50 rounded-full">
        <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        <span class="text-sm font-medium text-blue-300">
          {{ $t('common.version') }} Beta
        </span>
      </div>

      <!-- Main Title -->
      <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold font-rajdhani mb-6">
        <span class="text-white">Matrix</span>
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          Protocol
        </span>
      </h1>

      <!-- Subtitle -->
      <h2 class="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-300 mb-8">
        {{ $t('home.hero.subtitle') }}
      </h2>

      <!-- Description -->
      <p class="text-lg text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
        {{ $t('home.hero.description') }}
      </p>

      <!-- CTAs -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <UButton 
          :to="`/${$i18n.locale}/docs/quickstart`"
          size="xl"
          class="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <UIcon name="i-heroicons-rocket-launch" class="w-5 h-5 mr-2" />
          {{ $t('common.getStarted') }}
        </UButton>
        <UButton 
          :to="`/${$i18n.locale}/frameworks`"
          size="xl"
          class="px-8 py-4 border-2 border-emerald-500 text-emerald-300 hover:bg-emerald-500 hover:text-white bg-transparent rounded-xl transition-all duration-300 focus:outline-none "
        >
          <UIcon name="i-heroicons-squares-2x2" class="w-5 h-5 mr-2" />
          {{ $t('common.exploreFrameworks') }}
        </UButton>
      </div>

      <!-- Scroll Indicator -->
      <div class="mt-16">
        <div class="flex flex-col items-center text-gray-500">
          <span class="text-sm mb-2">{{ $t('home.hero.scrollDown') }}</span>
          <UIcon name="i-heroicons-chevron-down" class="w-5 h-5 animate-bounce" />
        </div>
      </div>
      </div>
    </section>

    <!-- Frameworks Section -->
    <section class="py-20 bg-slate-800">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <h2 class="text-4xl sm:text-5xl font-bold font-rajdhani text-white mb-6">
            {{ $t('home.frameworks.title') }}
          </h2>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {{ $t('home.frameworks.subtitle') }}
          </p>
        </div>

        <!-- Frameworks Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
        <!-- MEF Framework -->
        <article class="group">
          <UCard class="h-full bg-slate-800/50 border border-slate-600 hover:bg-slate-800/70 border-t-2 border-t-emerald-500 hover:border-emerald-500/30 transition-all duration-300 transform hover:scale-[1.02]">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-16 h-16 rounded-xl flex items-center justify-center p-3 bg-emerald-500/20 border border-emerald-400/30">
                <img src="/logos/mef/mef-logo-icon.svg" alt="MEF" class="w-full h-full object-contain" />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold text-white font-rajdhani">MEF</h3>
                <p class="text-sm text-gray-400">Matrix Embedding Framework</p>
              </div>
            </div>
            <p class="text-gray-300 leading-relaxed mb-6">
              {{ $t('frameworks.mef.description') }}
            </p>
            <div class="flex justify-end">
              <UButton :to="`/${$i18n.locale}/frameworks/mef`" variant="ghost" size="sm" class="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 group-hover:translate-x-1 transition-all duration-300">
                {{ $t('common.learnMore') }}
                <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-2" />
              </UButton>
            </div>
          </UCard>
        </article>

        <!-- ZOF Framework -->
        <article class="group">
          <UCard class="h-full bg-slate-800/50 border border-slate-600 hover:bg-slate-800/70 border-t-2 border-t-orange-500 hover:border-orange-500/30 transition-all duration-300 transform hover:scale-[1.02]">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-16 h-16 rounded-xl flex items-center justify-center p-3 bg-orange-500/20 border border-orange-400/30">
                <img src="/logos/zof/zof-logo-icon.svg" alt="ZOF" class="w-full h-full object-contain" />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold text-white font-rajdhani">ZOF</h3>
                <p class="text-sm text-gray-400">Zion Orchestration Framework</p>
              </div>
            </div>
            <p class="text-gray-300 leading-relaxed mb-6">
              {{ $t('frameworks.zof.description') }}
            </p>
            <div class="flex justify-end">
              <UButton :to="`/${$i18n.locale}/frameworks/zof`" variant="ghost" size="sm" class="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 group-hover:translate-x-1 transition-all duration-300">
                {{ $t('common.learnMore') }}
                <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-2" />
              </UButton>
            </div>
          </UCard>
        </article>

        <!-- OIF Framework -->
        <article class="group">
          <UCard class="h-full bg-slate-800/50 border border-slate-600 hover:bg-slate-800/70 border-t-2 border-t-blue-500 hover:border-blue-500/30 transition-all duration-300 transform hover:scale-[1.02]">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-16 h-16 rounded-xl flex items-center justify-center p-3 bg-blue-500/20 border border-blue-400/30">
                <img src="/logos/oif/oif-logo-icon.svg" alt="OIF" class="w-full h-full object-contain" />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold text-white font-rajdhani">OIF</h3>
                <p class="text-sm text-gray-400">Operator Intelligence Framework</p>
              </div>
            </div>
            <p class="text-gray-300 leading-relaxed mb-6">
              {{ $t('frameworks.oif.description') }}
            </p>
            <div class="flex justify-end">
              <UButton :to="`/${$i18n.locale}/frameworks/oif`" variant="ghost" size="sm" class="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 group-hover:translate-x-1 transition-all duration-300">
                {{ $t('common.learnMore') }}
                <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-2" />
              </UButton>
            </div>
          </UCard>
        </article>

        <!-- MOC Framework -->
        <article class="group">
          <UCard class="h-full bg-slate-800/50 border border-slate-600 hover:bg-slate-800/70 border-t-2 border-t-purple-500 hover:border-purple-500/30 transition-all duration-300 transform hover:scale-[1.02]">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-16 h-16 rounded-xl flex items-center justify-center p-3 bg-purple-500/20 border border-purple-400/30">
                <img src="/logos/moc/moc-logo-icon.svg" alt="MOC" class="w-full h-full object-contain" />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold text-white font-rajdhani">MOC</h3>
                <p class="text-sm text-gray-400">Matrix Ontology Catalog</p>
              </div>
            </div>
            <p class="text-gray-300 leading-relaxed mb-6">
              {{ $t('frameworks.moc.description') }}
            </p>
            <div class="flex justify-end">
              <UButton :to="`/${$i18n.locale}/frameworks/moc`" variant="ghost" size="sm" class="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 group-hover:translate-x-1 transition-all duration-300">
                {{ $t('common.learnMore') }}
                <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-2" />
              </UButton>
            </div>
          </UCard>
        </article>

        <!-- MAL Framework -->
        <article class="group">
          <UCard class="h-full bg-slate-800/50 border border-slate-600 hover:bg-slate-800/70 border-t-2 border-t-red-500 hover:border-red-500/30 transition-all duration-300 transform hover:scale-[1.02]">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-16 h-16 rounded-xl flex items-center justify-center p-3 bg-red-500/20 border border-red-400/30">
                <img src="/logos/mal/mal-logo-icon.svg" alt="MAL" class="w-full h-full object-contain" />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold text-white font-rajdhani">MAL</h3>
                <p class="text-sm text-gray-400">Matrix Arbiter Layer</p>
              </div>
            </div>
            <p class="text-gray-300 leading-relaxed mb-6">
              {{ $t('frameworks.mal.description') }}
            </p>
            <div class="flex justify-end">
              <UButton :to="`/${$i18n.locale}/frameworks/mal`" variant="ghost" size="sm" class="text-red-400 hover:text-red-300 hover:bg-red-500/10 group-hover:translate-x-1 transition-all duration-300">
                {{ $t('common.learnMore') }}
                <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-2" />
              </UButton>
            </div>
          </UCard>
        </article>
      </div>
      
      <!-- CTA to View All Frameworks -->
      <div class="text-center mt-12">
        <UButton
          :to="`/${$i18n.locale}/frameworks`"
          size="lg"
          class="border-2 border-blue-500 shadow-lg hover:shadow-xl hover:border-blue-400 hover:-translate-y-0.5 transition-all duration-300 text-blue-400 hover:bg-blue-500 hover:text-white bg-transparent rounded-xl px-6 py-3"
        >
          <UIcon name="i-heroicons-view-columns" class="w-5 h-5 mr-2" />
          {{ $t('home.frameworks.viewAll') }}
        </UButton>
        <p class="text-gray-400 text-sm mt-3 max-w-md mx-auto">
          {{ $t('home.frameworks.viewAllDescription') }}
        </p>
      </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-slate-900" role="region" aria-labelledby="features-title">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <h2 id="features-title" class="text-4xl sm:text-5xl font-bold font-rajdhani text-white mb-6">
            {{ $t('home.features.title') }}
          </h2>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {{ $t('home.features.subtitle') }}
          </p>
        </div>

        <!-- Features Grid - 4 Pilares -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-20" role="list">
          <!-- Pilar 1: Fundação Epistemológica -->
          <article class="group" role="listitem">
            <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 h-full hover:border-emerald-500/30 hover:bg-slate-800/70 transition-all duration-300 focus-within:border-emerald-500/50">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                  <UIcon name="i-heroicons-academic-cap" class="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-white font-rajdhani">
                    {{ $t('home.features.pillars.epistemological.title') }}
                  </h3>
                </div>
              </div>
              <p class="text-gray-300 leading-relaxed">
                {{ $t('home.features.pillars.epistemological.description') }}
              </p>
            </div>
          </article>

          <!-- Pilar 2: Estrutura Semântica -->
          <article class="group" role="listitem">
            <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 h-full hover:border-blue-500/30 hover:bg-slate-800/70 transition-all duration-300 focus-within:border-blue-500/50">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
                  <UIcon name="i-heroicons-cube-transparent" class="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-white font-rajdhani">
                    {{ $t('home.features.pillars.semantic.title') }}
                  </h3>
                </div>
              </div>
              <p class="text-gray-300 leading-relaxed">
                {{ $t('home.features.pillars.semantic.description') }}
              </p>
            </div>
          </article>

          <!-- Pilar 3: Colaboração IA -->
          <article class="group" role="listitem">
            <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 h-full hover:border-purple-500/30 hover:bg-slate-800/70 transition-all duration-300 focus-within:border-purple-500/50">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center">
                  <UIcon name="i-heroicons-cpu-chip" class="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-white font-rajdhani">
                    {{ $t('home.features.pillars.collaboration.title') }}
                  </h3>
                </div>
              </div>
              <p class="text-gray-300 leading-relaxed">
                {{ $t('home.features.pillars.collaboration.description') }}
              </p>
            </div>
          </article>

          <!-- Pilar 4: Governança Integrada -->
          <article class="group" role="listitem">
            <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 h-full hover:border-orange-500/30 hover:bg-slate-800/70 transition-all duration-300 focus-within:border-orange-500/50">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-16 h-16 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center">
                  <UIcon name="i-heroicons-shield-check" class="w-8 h-8 text-orange-400" />
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-white font-rajdhani">
                    {{ $t('home.features.pillars.governance.title') }}
                  </h3>
                </div>
              </div>
              <p class="text-gray-300 leading-relaxed">
                {{ $t('home.features.pillars.governance.description') }}
              </p>
            </div>
          </article>
        </div>

        <!-- MEP Principles Section -->
        <section class="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600 rounded-3xl p-8 lg:p-12" role="region" aria-labelledby="mep-title">
          <div class="text-center mb-12">
            <h3 id="mep-title" class="text-3xl font-bold text-white font-rajdhani mb-4">
              {{ $t('home.features.mep.title') }}
            </h3>
            <p class="text-gray-300 text-lg">
              {{ $t('home.features.mep.subtitle') }}
            </p>
          </div>

          <!-- MEP Principles Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            <!-- P1: Elasticidade Semântica -->
            <article class="bg-slate-800/50 border border-slate-600 rounded-xl p-6 text-center hover:border-emerald-500/30 focus-within:border-emerald-500/50 transition-all duration-300" role="listitem">
              <div class="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span class="text-emerald-400 font-bold">P1</span>
              </div>
              <h4 class="text-lg font-semibold text-white mb-2">
                {{ $t('home.features.mep.principles.p1.title') }}
              </h4>
              <p class="text-gray-400 text-sm">
                {{ $t('home.features.mep.principles.p1.description') }}
              </p>
            </article>

            <!-- P2: Epistemologia Estratificada -->
            <article class="bg-slate-800/50 border border-slate-600 rounded-xl p-6 text-center hover:border-blue-500/30 focus-within:border-blue-500/50 transition-all duration-300" role="listitem">
              <div class="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span class="text-blue-400 font-bold">P2</span>
              </div>
              <h4 class="text-lg font-semibold text-white mb-2">
                {{ $t('home.features.mep.principles.p2.title') }}
              </h4>
              <p class="text-gray-400 text-sm">
                {{ $t('home.features.mep.principles.p2.description') }}
              </p>
            </article>

            <!-- P3: Promoção Responsável -->
            <article class="bg-slate-800/50 border border-slate-600 rounded-xl p-6 text-center hover:border-purple-500/30 focus-within:border-purple-500/50 transition-all duration-300" role="listitem">
              <div class="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span class="text-purple-400 font-bold">P3</span>
              </div>
              <h4 class="text-lg font-semibold text-white mb-2">
                {{ $t('home.features.mep.principles.p3.title') }}
              </h4>
              <p class="text-gray-400 text-sm">
                {{ $t('home.features.mep.principles.p3.description') }}
              </p>
            </article>

            <!-- P4: Autoridade Derivada -->
            <article class="bg-slate-800/50 border border-slate-600 rounded-xl p-6 text-center hover:border-orange-500/30 focus-within:border-orange-500/50 transition-all duration-300" role="listitem">
              <div class="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span class="text-orange-400 font-bold">P4</span>
              </div>
              <h4 class="text-lg font-semibold text-white mb-2">
                {{ $t('home.features.mep.principles.p4.title') }}
              </h4>
              <p class="text-gray-400 text-sm">
                {{ $t('home.features.mep.principles.p4.description') }}
              </p>
            </article>

            <!-- P5: Explicabilidade Necessária -->
            <article class="bg-slate-800/50 border border-slate-600 rounded-xl p-6 text-center md:col-span-2 lg:col-span-1 hover:border-red-500/30 focus-within:border-red-500/50 transition-all duration-300" role="listitem">
              <div class="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span class="text-red-400 font-bold">P5</span>
              </div>
              <h4 class="text-lg font-semibold text-white mb-2">
                {{ $t('home.features.mep.principles.p5.title') }}
              </h4>
              <p class="text-gray-400 text-sm">
                {{ $t('home.features.mep.principles.p5.description') }}
              </p>
            </article>
          </div>

          <!-- MEP CTA -->
          <div class="text-center mt-12">
            <UButton
              :to="`/${$i18n.locale}/mep`"
              size="lg"
              class="border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white bg-transparent rounded-md px-4 py-2 transition-colors focus:outline-none "
            >
              <UIcon name="i-heroicons-book-open" class="w-5 h-5 mr-2" />
              {{ $t('home.features.mep.cta') }}
            </UButton>
          </div>
        </section>
      </div>
    </section>

    <!-- Quick Start Guide -->
    <section class="py-20 bg-slate-800" role="region" aria-labelledby="quickstart-title">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <h2 id="quickstart-title" class="text-4xl sm:text-5xl font-bold font-rajdhani text-white mb-6">
            {{ $t('home.quickStart.title') }}
          </h2>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {{ $t('home.quickStart.subtitle') }}
          </p>
        </div>

        <!-- Quick Start Timeline -->
        <ol class="max-w-4xl mx-auto list-none" role="list">
          <!-- Step 1: Escolher Template -->
          <li class="relative flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-16" role="listitem">
            <!-- Step Number -->
            <div class="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <span class="text-2xl font-bold text-white">1</span>
            </div>
            
            <!-- Timeline Line -->
            <div class="absolute left-10 top-20 w-px h-24 bg-gradient-to-b from-blue-500 to-emerald-500 hidden lg:block"></div>
            
            <!-- Step Content -->
            <div class="flex-1 text-center lg:text-left">
              <div class="bg-slate-900/50 border border-slate-700 rounded-2xl p-8 hover:border-blue-500/30 hover:bg-slate-900/70 transition-all duration-300 focus-within:border-blue-500/50">
                <div class="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div class="flex-1">
                    <h3 class="text-2xl font-bold text-white mb-3 font-rajdhani">
                      {{ $t('home.quickStart.steps.step1.title') }}
                    </h3>
                    <p class="text-gray-300 leading-relaxed mb-4">
                      {{ $t('home.quickStart.steps.step1.description') }}
                    </p>
                    <UButton
                      :to="`/${$i18n.locale}/resources`"
                      size="sm"
                      class="border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white bg-transparent rounded-md px-3 py-1.5 transition-colors focus:outline-none "
                    >
                      <UIcon name="i-heroicons-folder-arrow-down" class="w-4 h-4 mr-2" />
                      {{ $t('home.quickStart.steps.step1.cta') }}
                    </UButton>
                  </div>
                  <div class="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center lg:order-first">
                    <UIcon name="i-heroicons-document-duplicate" class="w-8 h-8 text-blue-400" />
                  </div>
                </div>
              </div>
            </div>
          </li>

          <!-- Step 2: Configurar Ontologia -->
          <li class="relative flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-16" role="listitem">
            <!-- Step Number -->
            <div class="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <span class="text-2xl font-bold text-white">2</span>
            </div>
            
            <!-- Timeline Line -->
            <div class="absolute left-10 top-20 w-px h-24 bg-gradient-to-b from-emerald-500 to-purple-500 hidden lg:block"></div>
            
            <!-- Step Content -->
            <div class="flex-1 text-center lg:text-left">
              <div class="bg-slate-900/50 border border-slate-700 rounded-2xl p-8 hover:border-emerald-500/30 hover:bg-slate-900/70 transition-all duration-300 focus-within:border-emerald-500/50">
                <div class="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div class="flex-1">
                    <h3 class="text-2xl font-bold text-white mb-3 font-rajdhani">
                      {{ $t('home.quickStart.steps.step2.title') }}
                    </h3>
                    <p class="text-gray-300 leading-relaxed mb-4">
                      {{ $t('home.quickStart.steps.step2.description') }}
                    </p>
                    <UButton
                      :to="`/${$i18n.locale}/frameworks/moc`"
                      size="sm"
                      class="border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white bg-transparent rounded-md px-3 py-1.5 transition-colors focus:outline-none "
                    >
                      <UIcon name="i-heroicons-squares-plus" class="w-4 h-4 mr-2" />
                      {{ $t('home.quickStart.steps.step2.cta') }}
                    </UButton>
                  </div>
                  <div class="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center lg:order-first">
                    <UIcon name="i-heroicons-squares-2x2" class="w-8 h-8 text-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          </li>

          <!-- Step 3: Criar UKIs -->
          <li class="relative flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-16" role="listitem">
            <!-- Step Number -->
            <div class="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span class="text-2xl font-bold text-white">3</span>
            </div>
            
            <!-- Step Content -->
            <div class="flex-1 text-center lg:text-left">
              <div class="bg-slate-900/50 border border-slate-700 rounded-2xl p-8 hover:border-purple-500/30 hover:bg-slate-900/70 transition-all duration-300 focus-within:border-purple-500/50">
                <div class="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div class="flex-1">
                    <h3 class="text-2xl font-bold text-white mb-3 font-rajdhani">
                      {{ $t('home.quickStart.steps.step3.title') }}
                    </h3>
                    <p class="text-gray-300 leading-relaxed mb-4">
                      {{ $t('home.quickStart.steps.step3.description') }}
                    </p>
                    <UButton
                      :to="`/${$i18n.locale}/frameworks/mef`"
                      size="sm"
                      class="border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white bg-transparent rounded-md px-3 py-1.5 transition-colors focus:outline-none "
                    >
                      <UIcon name="i-heroicons-link" class="w-4 h-4 mr-2" />
                      {{ $t('home.quickStart.steps.step3.cta') }}
                    </UButton>
                  </div>
                  <div class="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center lg:order-first">
                    <UIcon name="i-heroicons-puzzle-piece" class="w-8 h-8 text-purple-400" />
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ol>

        <!-- Final CTA -->
        <section class="text-center mt-16" role="region">
          <div class="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600 rounded-3xl p-8 lg:p-12 max-w-4xl mx-auto">
            <h3 class="text-3xl font-bold text-white mb-4 font-rajdhani">
              {{ $t('home.quickStart.final.title') }}
            </h3>
            <p class="text-gray-300 text-lg mb-8 leading-relaxed">
              {{ $t('home.quickStart.final.description') }}
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center" role="group">
              <UButton
                :to="`/${$i18n.locale}/docs/protocol`"
                size="lg"
                class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
              >
                <UIcon name="i-heroicons-academic-cap" class="w-5 h-5 mr-2" />
                {{ $t('home.quickStart.final.cta.docs') }}
              </UButton>
              
              <UButton
                :to="`/${$i18n.locale}/resources`"
                size="lg"
                class="border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white bg-transparent rounded-md px-4 py-2 transition-colors focus:outline-none "
              >
                <UIcon name="i-heroicons-folder" class="w-5 h-5 mr-2" />
                {{ $t('home.quickStart.final.cta.examples') }}
              </UButton>
            </div>
          </div>
        </section>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="py-20 bg-gradient-to-r from-slate-900 to-slate-800">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h2 class="text-4xl sm:text-5xl font-bold font-rajdhani text-white mb-6">
          {{ $t('common.getStarted') }}
        </h2>
        <p class="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          {{ $t('home.hero.description') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <UButton 
            :to="`/${$i18n.locale}/docs/quickstart`"
            size="xl"
            class="px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <UIcon name="i-heroicons-rocket-launch" class="w-5 h-5 mr-2" />
            {{ $t('common.getStarted') }}
          </UButton>
          <UButton 
            :to="config.discordUrl"
            external
            size="xl"
            class="px-8 py-4 border-2 border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white bg-transparent rounded-xl transition-all duration-300 focus:outline-none "
          >
            <UIcon name="i-heroicons-users" class="w-5 h-5 mr-2" />
            {{ $t('navigation.community') }}
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Composables
const { locale } = useI18n()
const config = useMatrixConfig()

// SEO internacionalizado
useSEO({
  ogType: 'website'
})
</script>