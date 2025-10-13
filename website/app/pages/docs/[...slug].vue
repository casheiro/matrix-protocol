<template>
  <div class="docs-page min-h-screen bg-slate-matrix-800 dark:bg-slate-matrix-800">
    <!-- Header -->
    <DocHeader 
      :title="pageTitle"
      :description="pageDescription"
      :icon="pageIcon"
      :breadcrumbs="breadcrumbs"
    />

    <!-- Main Layout -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="lg:grid lg:grid-cols-12 lg:gap-8">
        <!-- Sidebar -->
        <aside class="lg:col-span-3">
          <div class="sticky top-24 space-y-4">
            <DocSidebar 
              :navigation="docsNavigation"
              :current-path="route.path"
            />
          </div>
        </aside>

        <!-- Content -->
        <main class="lg:col-span-9 mt-8 lg:mt-0">
          <div class="prose prose-gray dark:prose-invert max-w-none">
            <!-- Content Renderer -->
            <ContentRenderer
              v-if="docsContent"
              :value="docsContent"
              class="docs-markdown-content"
            />
            
            <!-- Fallback se conteúdo não encontrado -->
            <div v-else class="text-center py-16">
              <div class="text-gray-500 dark:text-gray-400">
                <UIcon name="i-heroicons-document-text" class="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h2 class="text-xl font-semibold mb-4">{{ fallbackTitle }}</h2>
                <p class="mb-6">{{ fallbackDescription }}</p>
                <UButton 
                  :to="localePath('/docs')"
                  variant="solid"
                  color="blue"
                  icon="i-heroicons-arrow-left"
                >
                  {{ fallbackBackButton }}
                </UButton>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
// Explicit component imports
import DocHeader from '~/components/docs/DocHeader.vue'
import DocSidebar from '~/components/docs/DocSidebar.vue'

// Nuxt composables
const route = useRoute()
const { $i18n } = useNuxtApp()
const localePath = useLocalePath()
const { t } = useI18n()

// Docs composables
const { getDocsNavigation } = useDocsNavigation()

// Construir path do conteúdo
const contentPath = computed(() => {
  const locale = $i18n.locale.value
  const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : (route.params.slug || 'index')
  return `${locale}/docs/${slug}`
})

// Buscar conteúdo da documentação usando padrão oficial @nuxt/content v3
const { data: docsContent, error: contentError } = await useAsyncData(
  route.path,
  async () => {
    try {
      const locale = $i18n.locale.value
      
      console.log('🔍 Loading content using official pattern:')
      console.log('  - Route path:', route.path)
      console.log('  - Locale:', locale)
      
      // Use official pattern: queryCollection(locale).path(route.path).first()
      const content = await queryCollection(locale).path(route.path).first()
      
      if (!content) {
        console.warn(`❌ Content not found for path: ${route.path}`)
        return null
      }
      
      console.log('✅ Content loaded successfully:', content.title || 'No title')
      return content
    } catch (error) {
      console.error('❌ Error loading content:', error)
      return null
    }
  }
)

// Navegação da documentação
const docsNavigation = await getDocsNavigation($i18n.locale.value)

// Dados da página
const pageTitle = computed(() => {
  if (docsContent.value?.title) {
    return docsContent.value.title
  }
  
  // Gerar título a partir do slug
  const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : (route.params.slug || 'index')
  if (slug === 'index') return 'Documentação'
  
  return slug.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Documentação'
})

const pageDescription = computed(() => {
  return docsContent.value?.description || `Documentação do Matrix Protocol: ${pageTitle.value}`
})

const pageIcon = computed(() => {
  return docsContent.value?.icon || 'i-heroicons-book-open'
})

// Fallbacks de tradução
const fallbackTitle = computed(() => {
  try {
    return t('docs.notFound.title')
  } catch {
    return $i18n.locale.value === 'pt' ? 'Conteúdo não encontrado' : 'Content not found'
  }
})

const fallbackDescription = computed(() => {
  try {
    return t('docs.notFound.description')
  } catch {
    return $i18n.locale.value === 'pt' 
      ? 'O conteúdo solicitado não foi encontrado na documentação.' 
      : 'The requested content was not found in the documentation.'
  }
})

const fallbackBackButton = computed(() => {
  try {
    return t('docs.notFound.backToDocs')
  } catch {
    return $i18n.locale.value === 'pt' ? 'Voltar à Documentação' : 'Back to Documentation'
  }
})

// Breadcrumbs
const breadcrumbs = computed(() => {
  const crumbs = [
    { label: 'Home', to: localePath('/') },
    { label: 'Documentação', to: localePath('/docs') }
  ]
  
  const slug = Array.isArray(route.params.slug) ? route.params.slug : [route.params.slug].filter(Boolean)
  
  if (slug.length > 0 && slug[0] !== 'index') {
    let currentPath = '/docs'
    
    slug.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === slug.length - 1
      
      crumbs.push({
        label: segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        to: isLast ? null : localePath(currentPath)
      })
    })
  }
  
  return crumbs
})

// SEO
const seoTitle = computed(() => `${pageTitle.value} - Documentação | Matrix Protocol`)
const seoDescription = computed(() => pageDescription.value)

useSEO({
  title: seoTitle,
  description: seoDescription,
  ogType: 'article'
})

// Validar rota
definePageMeta({
  validate: () => {
    // Aceitar qualquer slug para docs (conteúdo é validado dinamicamente)
    return true
  }
})

// Watch para mudanças de locale
watch(() => $i18n.locale.value, () => {
  // Conteúdo será recarregado automaticamente pelo useAsyncData
})
</script>

<style scoped>
/* Docs content styling - Tailwind CSS v4 compatible */
.docs-markdown-content :deep(*) {
  color: rgb(55 65 81); /* text-gray-700 */
}

.dark .docs-markdown-content :deep(*) {
  color: rgb(209 213 219); /* dark:text-gray-300 */
}

.docs-markdown-content :deep(h1),
.docs-markdown-content :deep(h2),
.docs-markdown-content :deep(h3),
.docs-markdown-content :deep(h4),
.docs-markdown-content :deep(h5),
.docs-markdown-content :deep(h6) {
  color: rgb(17 24 39); /* text-gray-900 */
  font-family: 'Rajdhani', sans-serif;
}

.dark .docs-markdown-content :deep(h1),
.dark .docs-markdown-content :deep(h2),
.dark .docs-markdown-content :deep(h3),
.dark .docs-markdown-content :deep(h4),
.dark .docs-markdown-content :deep(h5),
.dark .docs-markdown-content :deep(h6) {
  color: rgb(255 255 255); /* dark:text-white */
}

.docs-markdown-content :deep(a) {
  color: rgb(37 99 235); /* text-blue-600 */
  text-decoration: underline;
}

.docs-markdown-content :deep(a:hover) {
  text-decoration: underline;
}

.dark .docs-markdown-content :deep(a) {
  color: rgb(96 165 250); /* dark:text-blue-400 */
}

.docs-markdown-content :deep(code) {
  background-color: rgb(243 244 246); /* bg-gray-100 */
  padding: 0.125rem 0.25rem; /* px-1 py-0.5 */
  border-radius: 0.25rem; /* rounded */
  font-size: 0.875rem; /* text-sm */
}

.dark .docs-markdown-content :deep(code) {
  background-color: rgb(31 41 55); /* dark:bg-gray-800 */
}

.docs-markdown-content :deep(pre) {
  background-color: rgb(243 244 246); /* bg-gray-100 */
  padding: 1rem; /* p-4 */
  border-radius: 0.5rem; /* rounded-lg */
  overflow-x: auto; /* overflow-x-auto */
}

.dark .docs-markdown-content :deep(pre) {
  background-color: rgb(31 41 55); /* dark:bg-gray-800 */
}
</style>