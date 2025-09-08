<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <div class="max-w-2xl mx-auto px-4 text-center">
      <div class="mb-8">
        <UIcon name="i-heroicons-code-bracket" class="w-16 h-16 mx-auto text-green-600 dark:text-green-400 mb-4" />
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {{ $t('examples.title') }}
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
          {{ $t('examples.subtitle') }}
        </p>
      </div>
      
      <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6 mb-8">
        <div class="flex items-center space-x-3">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          <p class="text-yellow-800 dark:text-yellow-200 font-medium">
            {{ $t('common.underConstruction') }}
          </p>
        </div>
      </div>
      
      <UButton to="/" size="lg" class="px-8 py-3">
        {{ $t('common.backHome') }}
        <UIcon name="i-heroicons-home" class="w-5 h-5 ml-2" />
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
// Meta tags
const { t } = useI18n()
const { appName } = useMatrixConfig()

useHead({
  title: computed(() => `${t('examples.title')} - ${appName}`)
})

// Page layout
definePageMeta({
  layout: 'default'
})
</script>