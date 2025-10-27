/**
 * Composable para configuração de SEO
 */
import { generateOGImageUrl } from '@/utils/og-helpers'

export const useMatrixSEO = () => {
  const { t, locale } = useI18n()
  const config = useMatrixConfig()
  
  const generatePageSEO = (options: {
    title?: string
    description?: string
    keywords?: string
    ogImage?: string
    canonical?: string
    type?: string
    framework?: string
    subtitle?: string
  }) => {
    const {
      title,
      description,
      keywords,
      ogImage,
      canonical,
      type = 'website',
      framework,
      subtitle
    } = options

    // Keywords internacionalizados
    const defaultKeywords = t('seo.keywords.default')
    const pageKeywords = keywords || defaultKeywords

    const pageTitle = title || `${toValue(config.appName)} - ${t('home.hero.subtitle')}`
    const pageDescription = description || t('home.hero.description')
    const canonicalUrl = canonical || toValue(() => config.getFullUrl('/'))
    
    // Generate dynamic OG image URL if not provided
    const ogImageUrl = ogImage 
      ? toValue(() => config.getFullUrl(ogImage))
      : toValue(() => config.getFullUrl(generateOGImageUrl({
          title: pageTitle,
          framework,
          locale: locale.value,
          subtitle: subtitle || pageDescription,
          type: type as 'website' | 'article'
        })))

    return {
      title: pageTitle,
      meta: [
        // Básico
        { name: 'description', content: pageDescription },
        { name: 'keywords', content: pageKeywords },
        { name: 'author', content: t('seo.author') },
        { name: 'robots', content: 'index, follow' },
        
        // Open Graph
        { property: 'og:title', content: pageTitle },
        { property: 'og:description', content: pageDescription },
        { property: 'og:type', content: type },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:image', content: ogImageUrl },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:site_name', content: config.appName },
        { property: 'og:locale', content: locale.value === 'pt' ? 'pt_BR' : 'en_US' },
        
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: pageTitle },
        { name: 'twitter:description', content: pageDescription },
        { name: 'twitter:image', content: ogImageUrl },
        
        // Outros
        { name: 'theme-color', content: '#1e293b' }, // slate-800
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'canonical', href: canonicalUrl }
      ],
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(generateSchemaOrg(pageTitle, pageDescription, canonicalUrl))
        }
      ]
    }
  }

  const generateSchemaOrg = (title: string, description: string, url: string) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Casheiro',
      description: 'Empresa criadora e mantenedora do Matrix Protocol',
      url: toValue(config.casheiroUrl),
      logo: toValue(() => config.getFullUrl('/logos/matrix/matrix-protocol-logo-white.svg')),
      foundingDate: '2025',
      sameAs: [
        toValue(config.casheiroUrl),
        toValue(config.githubUrl)
      ].filter(Boolean),
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'general',
        url: toValue(config.casheiroUrl)
      },
      mainEntity: {
        '@type': 'SoftwareApplication',
        name: toValue(config.appName),
        description,
        applicationCategory: 'Framework',
        operatingSystem: 'All',
        softwareVersion: toValue(config.appVersion),
        creator: {
          '@type': 'Organization',
          name: 'Casheiro',
          url: toValue(config.casheiroUrl)
        }
      }
    }
  }

  const generateFrameworkSEO = (frameworkKey: string) => {
    const framework = toValue(() => config.getFrameworkByKey(frameworkKey))
    if (!framework) return generatePageSEO({})

    return generatePageSEO({
      title: `${framework.acronym} - ${framework.name}`,
      description: t(`frameworks.${frameworkKey}.description`),
      keywords: `${framework.acronym}, ${framework.name}, Matrix Protocol, Framework, IA`,
      canonical: toValue(() => config.getFullUrl(`/frameworks/${frameworkKey}`)),
      type: 'article',
      framework: frameworkKey,
      subtitle: framework.description
    })
  }

  // Versão simplificada para uso direto nas páginas
  const applySEO = (options: {
    title?: string | Ref<string> | ComputedRef<string>
    description?: string | Ref<string> | ComputedRef<string>
    ogType?: string
    keywords?: string
    canonical?: string
  }) => {
    const titleValue = computed(() => toValue(options.title) || `${toValue(config.appName)} - ${t('home.hero.subtitle')}`)
    const descriptionValue = computed(() => toValue(options.description) || t('home.hero.description'))
    
    const seoConfig = generatePageSEO({
      title: titleValue.value,
      description: descriptionValue.value,
      type: options.ogType || 'website',
      keywords: options.keywords,
      canonical: options.canonical
    })
    
    useHead(seoConfig)
  }

  return {
    generatePageSEO,
    generateFrameworkSEO,
    generateSchemaOrg,
    applySEO
  }
}