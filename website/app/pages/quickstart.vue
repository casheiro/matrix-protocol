<template>
  <div class="min-h-screen bg-slate-matrix-800 dark:bg-slate-matrix-800">
    <!-- Header -->
    <div class="bg-slate-matrix-700 dark:bg-slate-matrix-700 border-b border-slate-matrix-600 dark:border-slate-matrix-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <UIcon name="i-heroicons-rocket-launch" class="w-8 h-8 text-green-600 dark:text-green-400" />
            <h1 class="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
              {{ $t('docs.sections.quickstart') }}
            </h1>
          </div>
          
          <!-- Breadcrumb Navigation -->
          <div class="flex items-center space-x-2 text-sm">
            <UButton
              :to="localePath('/')"
              variant="ghost"
              size="sm"
              icon="i-heroicons-home"
            >
              {{ $t('common.home') }}
            </UButton>
            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400" />
            <span class="text-gray-600 dark:text-gray-300">
              {{ $t('docs.sections.quickstart') }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="lg:grid lg:grid-cols-12 lg:gap-8">
        <!-- Sidebar -->
        <aside class="lg:col-span-3">
          <div class="sticky top-24 space-y-4">
            <!-- Quick Links -->
            <UCard>
              <template #header>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ $t('docs.sections.title') }}
                </h3>
              </template>
              <nav class="space-y-2">
                <UButton
                  :to="localePath('/protocol')"
                  variant="ghost"
                  size="sm"
                  icon="i-heroicons-document-text"
                  class="w-full justify-start"
                >
                  {{ $t('docs.sections.protocol') }}
                </UButton>
                <UButton
                  :to="localePath('/quickstart')"
                  variant="soft"
                  size="sm"
                  icon="i-heroicons-rocket-launch"
                  class="w-full justify-start"
                  color="success"
                >
                  {{ $t('docs.sections.quickstart') }}
                </UButton>
                <UButton
                  :to="localePath('/implementation')"
                  variant="ghost"
                  size="sm"
                  icon="i-heroicons-cog-6-tooth"
                  class="w-full justify-start"
                >
                  {{ $t('docs.sections.implementation') }}
                </UButton>
                <UButton
                  :to="localePath('/integration')"
                  variant="ghost"
                  size="sm"
                  icon="i-heroicons-arrows-right-left"
                  class="w-full justify-start"
                >
                  {{ $t('docs.sections.integration') }}
                </UButton>
                <UButton
                  :to="localePath('/glossary')"
                  variant="ghost"
                  size="sm"
                  icon="i-heroicons-book-open"
                  class="w-full justify-start"
                >
                  {{ $t('docs.sections.glossary') }}
                </UButton>
              </nav>
            </UCard>

            <!-- Related Links -->
            <UCard>
              <template #header>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ $t('common.relatedLinks') }}
                </h3>
              </template>
              <nav class="space-y-2">
                <UButton
                  :to="localePath('/frameworks')"
                  variant="ghost"
                  size="sm"
                  icon="i-heroicons-cube"
                  class="w-full justify-start"
                >
                  {{ $t('frameworks.title') }}
                </UButton>
                <UButton
                  :to="localePath('/resources')"
                  variant="ghost"
                  size="sm"
                  icon="i-heroicons-folder"
                  class="w-full justify-start"
                >
                  {{ $t('navigation.resources') }}
                </UButton>
              </nav>
            </UCard>
          </div>
        </aside>

        <!-- Content -->
        <main class="lg:col-span-9 mt-8 lg:mt-0">
          <div class="prose prose-gray dark:prose-invert max-w-none">
            <QuickStartContent />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

// SEO usando composable padrão
const seoTitle = computed(() => `${t('docs.sections.quickstart')} | Matrix Protocol`)
const seoDescription = computed(() => t('docs.quickstart.description'))

useSEO({
  title: seoTitle,
  description: seoDescription,
  ogType: 'article'
})
</script>