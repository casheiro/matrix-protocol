/**
 * Composable simplificado para SEO - compatível com o uso nas páginas migradas
 */
export const useSEO = (options: {
  title?: string | Ref<string> | ComputedRef<string>
  description?: string | Ref<string> | ComputedRef<string>
  ogType?: string
  keywords?: string
  canonical?: string
}) => {
  const { t, locale } = useI18n()
  const config = useMatrixConfig()
  
  const titleValue = computed(() => toValue(options.title) || `${toValue(config.appName)} - ${t('home.hero.subtitle')}`)
  const descriptionValue = computed(() => toValue(options.description) || t('home.hero.description'))
  
  // Keywords internacionalizados
  const defaultKeywords = t('seo.keywords.default')
  const pageKeywords = options.keywords || defaultKeywords
  const canonicalUrl = options.canonical || toValue(() => config.getFullUrl('/'))
  
  useHead({
    title: titleValue,
    meta: [
      // Básico
      { name: 'description', content: descriptionValue },
      { name: 'keywords', content: pageKeywords },
      { name: 'author', content: t('seo.author') },
      { name: 'robots', content: 'index, follow' },
      
      // Open Graph
      { property: 'og:title', content: titleValue },
      { property: 'og:description', content: descriptionValue },
      { property: 'og:type', content: options.ogType || 'website' },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:site_name', content: config.appName },
      { property: 'og:locale', content: locale.value === 'pt' ? 'pt_BR' : 'en_US' },
      
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: titleValue },
      { name: 'twitter:description', content: descriptionValue },
      
      // Outros
      { name: 'theme-color', content: '#1e293b' }, // slate-800
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'canonical', href: canonicalUrl }
    ]
  })
}