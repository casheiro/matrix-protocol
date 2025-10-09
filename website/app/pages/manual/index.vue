<template>
  <div class="manual-index min-h-screen bg-slate-matrix-800">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Manual Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white font-rajdhani mb-4">
          {{ $t('manual.title') }}
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          {{ $t('manual.description') }}
        </p>
      </div>

      <!-- Manual Sections -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <!-- Implementation Guide -->
        <UCard class="hover:shadow-lg transition-shadow">
          <div class="p-6">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <UIcon name="i-heroicons-book-open" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ $t('manual.sections.implementation.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {{ $t('manual.sections.implementation.description') }}
            </p>
            <NuxtLink 
              :to="localePath('/manual/MATRIX_PROTOCOL_IMPLEMENTATION_GUIDE')"
              class="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
            >
              {{ $t('common.readMore') }}
              <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-1" />
            </NuxtLink>
          </div>
        </UCard>

        <!-- Templates -->
        <UCard class="hover:shadow-lg transition-shadow">
          <div class="p-6">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <UIcon name="i-heroicons-document-duplicate" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ $t('manual.sections.templates.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {{ $t('manual.sections.templates.description') }}
            </p>
            <NuxtLink 
              :to="localePath('/manual/templates')"
              class="inline-flex items-center text-purple-600 dark:text-purple-400 hover:underline"
            >
              {{ $t('common.readMore') }}
              <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-1" />
            </NuxtLink>
          </div>
        </UCard>

        <!-- Tools -->
        <UCard class="hover:shadow-lg transition-shadow">
          <div class="p-6">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <UIcon name="i-heroicons-wrench-screwdriver" class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ $t('manual.sections.tools.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {{ $t('manual.sections.tools.description') }}
            </p>
            <NuxtLink 
              :to="localePath('/manual/tools')"
              class="inline-flex items-center text-green-600 dark:text-green-400 hover:underline"
            >
              {{ $t('common.readMore') }}
              <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-1" />
            </NuxtLink>
          </div>
        </UCard>

        <!-- Examples -->
        <UCard class="hover:shadow-lg transition-shadow">
          <div class="p-6">
            <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
              <UIcon name="i-heroicons-light-bulb" class="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ $t('manual.sections.examples.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {{ $t('manual.sections.examples.description') }}
            </p>
            <NuxtLink 
              :to="localePath('/manual/examples')"
              class="inline-flex items-center text-orange-600 dark:text-orange-400 hover:underline"
            >
              {{ $t('common.readMore') }}
              <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-1" />
            </NuxtLink>
          </div>
        </UCard>

        <!-- Reference -->
        <UCard class="hover:shadow-lg transition-shadow">
          <div class="p-6">
            <div class="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
              <UIcon name="i-heroicons-academic-cap" class="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ $t('manual.sections.reference.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {{ $t('manual.sections.reference.description') }}
            </p>
            <NuxtLink 
              :to="localePath('/manual/reference')"
              class="inline-flex items-center text-red-600 dark:text-red-400 hover:underline"
            >
              {{ $t('common.readMore') }}
              <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-1" />
            </NuxtLink>
          </div>
        </UCard>

        <!-- Quick Start -->
        <UCard class="hover:shadow-lg transition-shadow">
          <div class="p-6">
            <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
              <UIcon name="i-heroicons-rocket-launch" class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ $t('manual.sections.quickstart.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {{ $t('manual.sections.quickstart.description') }}
            </p>
            <NuxtLink 
              :to="localePath('/guides/quickstart')"
              class="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {{ $t('common.readMore') }}
              <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-1" />
            </NuxtLink>
          </div>
        </UCard>
      </div>

      <!-- Download Section -->
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white font-rajdhani mb-4">
          {{ $t('manual.download.title') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ $t('manual.download.description') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            :to="`/downloads/guides/MATRIX_PROTOCOL_IMPLEMENTATION_GUIDE_${$i18n.locale.value.toUpperCase()}.md`"
            variant="solid"
            color="blue"
            size="lg"
            external
          >
            <UIcon name="i-heroicons-arrow-down-tray" class="w-4 h-4 mr-2" />
            {{ $t('manual.download.complete') }}
          </UButton>
          <UButton
            :to="localePath('/resources')"
            variant="outline"
            color="blue"
            size="lg"
          >
            <UIcon name="i-heroicons-archive-box" class="w-4 h-4 mr-2" />
            {{ $t('manual.download.resources') }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $i18n } = useNuxtApp()
const localePath = useLocalePath()

// SEO
useSEO({
  title: 'Manual - Matrix Protocol',
  description: 'Manual completo de implementação do Matrix Protocol',
  ogType: 'website'
})
</script>