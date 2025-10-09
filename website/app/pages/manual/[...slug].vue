<template>
  <div class="manual-page min-h-screen bg-slate-matrix-800">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Manual Content -->
      <div class="manual-content">
        <!-- Header com breadcrumb -->
        <div class="mb-8">
          <nav class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <NuxtLink :to="localePath('/')" class="hover:text-gray-700 dark:hover:text-gray-200">
              {{ $t('common.home') }}
            </NuxtLink>
            <span class="mx-2">/</span>
            <NuxtLink :to="localePath('/manual')" class="hover:text-gray-700 dark:hover:text-gray-200">
              Manual
            </NuxtLink>
            <span class="mx-2">/</span>
            <span class="text-gray-700 dark:text-gray-300">{{ pageTitle }}</span>
          </nav>
          
          <h1 v-if="pageTitle" class="text-3xl font-bold text-gray-900 dark:text-white font-rajdhani mb-4">
            {{ pageTitle }}
          </h1>
        </div>

        <!-- Content Renderer -->
        <div class="prose prose-lg dark:prose-invert max-w-none">
          <ContentRenderer
            v-if="manualContent"
            :value="manualContent"
            class="manual-markdown-content"
          />
          
          <!-- Fallback se conteúdo não encontrado -->
          <div v-else class="text-center py-16">
            <div class="text-gray-500 dark:text-gray-400">
              <h2 class="text-xl font-semibold mb-4">{{ $t('manual.notFound.title') }}</h2>
              <p class="mb-6">{{ $t('manual.notFound.description') }}</p>
              <NuxtLink 
                :to="localePath('/manual')"
                class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {{ $t('manual.notFound.backToManual') }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Nuxt composables
const route = useRoute()
const { $i18n } = useNuxtApp()
const localePath = useLocalePath()

// Construir path do conteúdo
const contentPath = computed(() => {
  const locale = $i18n.locale.value
  const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug
  return `manual/${slug}`
})

// Buscar conteúdo do manual
const { data: manualContent, error: contentError } = await useAsyncData(
  `manual-${contentPath.value}-${$i18n.locale.value}`,
  async () => {
    try {
      const locale = $i18n.locale.value
      console.log('🔍 Loading manual content:', `/${locale}/${contentPath.value}`)
      
      const content = await queryCollection(locale).path(`/${locale}/${contentPath.value}`).first()
      
      if (!content) {
        console.warn(`Manual content not found: /${locale}/${contentPath.value}`)
        return null
      }
      
      console.log('📄 Manual content loaded:', content.title || content._path)
      return content
    } catch (error) {
      console.error('❌ Error loading manual content:', error)
      return null
    }
  }
)

// Título da página
const pageTitle = computed(() => {
  if (manualContent.value?.title) {
    return manualContent.value.title
  }
  
  // Gerar título a partir do slug
  const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug
  return slug.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Manual'
})

// SEO
const seoTitle = computed(() => `${pageTitle.value} - Manual | Matrix Protocol`)
const seoDescription = computed(() => 
  manualContent.value?.description || 
  `Documentação do Matrix Protocol: ${pageTitle.value}`
)

useSEO({
  title: seoTitle,
  description: seoDescription,
  ogType: 'article'
})

// Validar rota
definePageMeta({
  validate: ({ params }) => {
    // Aceitar qualquer slug para manual (conteúdo é validado dinamicamente)
    return !!params.slug
  }
})

// Watch para mudanças de locale
watch(() => $i18n.locale.value, () => {
  // Conteúdo será recarregado automaticamente pelo useAsyncData
})
</script>

<style scoped>
/* Manual content styling - Tailwind CSS v4 compatible */
.manual-markdown-content :deep(*) {
  color: rgb(55 65 81); /* text-gray-700 */
}

.dark .manual-markdown-content :deep(*) {
  color: rgb(209 213 219); /* dark:text-gray-300 */
}

.manual-markdown-content :deep(h1),
.manual-markdown-content :deep(h2),
.manual-markdown-content :deep(h3),
.manual-markdown-content :deep(h4),
.manual-markdown-content :deep(h5),
.manual-markdown-content :deep(h6) {
  color: rgb(17 24 39); /* text-gray-900 */
  font-family: 'Rajdhani', sans-serif;
}

.dark .manual-markdown-content :deep(h1),
.dark .manual-markdown-content :deep(h2),
.dark .manual-markdown-content :deep(h3),
.dark .manual-markdown-content :deep(h4),
.dark .manual-markdown-content :deep(h5),
.dark .manual-markdown-content :deep(h6) {
  color: rgb(255 255 255); /* dark:text-white */
}

.manual-markdown-content :deep(a) {
  color: rgb(37 99 235); /* text-blue-600 */
  text-decoration: underline;
}

.manual-markdown-content :deep(a:hover) {
  text-decoration: underline;
}

.dark .manual-markdown-content :deep(a) {
  color: rgb(96 165 250); /* dark:text-blue-400 */
}

.manual-markdown-content :deep(code) {
  background-color: rgb(243 244 246); /* bg-gray-100 */
  padding: 0.125rem 0.25rem; /* px-1 py-0.5 */
  border-radius: 0.25rem; /* rounded */
  font-size: 0.875rem; /* text-sm */
}

.dark .manual-markdown-content :deep(code) {
  background-color: rgb(31 41 55); /* dark:bg-gray-800 */
}

.manual-markdown-content :deep(pre) {
  background-color: rgb(243 244 246); /* bg-gray-100 */
  padding: 1rem; /* p-4 */
  border-radius: 0.5rem; /* rounded-lg */
  overflow-x: auto; /* overflow-x-auto */
}

.dark .manual-markdown-content :deep(pre) {
  background-color: rgb(31 41 55); /* dark:bg-gray-800 */
}
</style>