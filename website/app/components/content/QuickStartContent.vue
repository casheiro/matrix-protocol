<template>
  <div>
    <!-- Loading state -->
    <div v-if="pending" class="flex items-center justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-green-600" />
      <span class="ml-2 text-gray-600 dark:text-gray-300">{{ $t('docs.loading.quickstart') }}</span>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-red-400 mx-auto mb-4" />
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
        {{ $t('docs.errors.loadingError') }}
      </h2>
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        {{ error.message }}
      </p>
      <UButton
        variant="outline"
        color="error"
        icon="i-heroicons-arrow-path"
        @click="refresh()"
      >
        {{ $t('docs.errors.tryAgain') }}
      </UButton>
    </div>

    <!-- Content -->
    <div v-else-if="data">
      <ContentRenderer :value="data" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { $i18n } = useNuxtApp()

// Load quickstart content using robust strategy from frameworks/[slug].vue
const { data, error, pending, refresh } = await useAsyncData(
  `quickstart-content-${$i18n.locale.value}`,
  async () => {
    try {
      const locale = $i18n.locale.value
      const quickstartPath = 'quickstart'
      
      console.log('🔍 Querying collection:', locale, 'path:', quickstartPath)
      
      // First, try to get all content from collection to debug
      const allContent = await queryCollection(locale).all()
      console.log('📋 All content in collection:', allContent?.length || 0, 'items')
      if (allContent?.length > 0) {
        console.log('📄 Sample paths:', allContent.slice(0, 3).map(c => c._path || c.path))
      }
      
      // Try without leading slash since collection has prefix configured
      let content = await queryCollection(locale).path(quickstartPath).first()
      
      // If not found, try with leading slash
      if (!content) {
        console.log('🔄 Trying with leading slash...')
        content = await queryCollection(locale).path(`/${quickstartPath}`).first()
      }
      
      // If still not found, try with full path including locale
      if (!content) {
        console.log('🔄 Trying with full path...')
        content = await queryCollection(locale).path(`/${locale}/quickstart`).first()
      }
      
      console.log('📄 Content found:', content ? 'YES' : 'NO', content?.title || 'undefined')
      
      return content
    } catch (error) {
      console.error('❌ Error querying content:', error)
      console.warn(`No content found for quickstart in locale ${$i18n.locale.value}`)
      return null
    }
  }
)
</script>