export const useDocsNavigation = () => {
  const { t } = useI18n()

  // Cache for dynamic navigation to avoid repeated queries
  const navigationCache = new Map<string, { data: any[], timestamp: number }>()
  const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  // Use the new Navigation API
  const buildDynamicChildren = async (locale: string, basePath: string) => {
    const cacheKey = `${locale}-${basePath}`
    
    // Check cache first
    if (navigationCache.has(cacheKey)) {
      const cached = navigationCache.get(cacheKey)!
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data
      }
    }
    
    try {
      // Extract section from basePath (e.g., /docs -> docs, /docs/frameworks -> frameworks)
      const pathSegments = basePath.split('/').filter(Boolean)
      const section = pathSegments[pathSegments.length - 1] || 'docs'
      
      // Fetch navigation tree from the new API
      const response = await $fetch('/api/navigation/tree', {
        query: {
          locale,
          section,
          cache: 'true'
        }
      })
      
      if (response && response.tree) {
        // Cache the result
        navigationCache.set(cacheKey, {
          data: response.tree,
          timestamp: Date.now()
        })
        
        return response.tree
      }
      
      return []
    } catch (error) {
      console.warn(`Failed to fetch navigation tree for ${basePath}:`, error)
      
      // Fallback to empty array
      return []
    }
  }

  const getDocsNavigation = async (locale: string) => {
    try {
      // Use fully dynamic navigation from API
      const navigation = await buildDynamicChildren(locale, '/docs')
      
      if (navigation && navigation.length > 0) {
        return navigation
      }
      
      // Fallback navigation if API fails or returns empty
      return getFallbackNavigation(locale)
      
    } catch (error) {
      console.warn('Failed to load dynamic navigation, using fallback:', error)
      return getFallbackNavigation(locale)
    }
  }

  // Fallback navigation for error cases
  const getFallbackNavigation = (locale: string) => {
    return [
      {
        title: t('docs.sections.quickstart'),
        path: `/docs/quickstart`,
        icon: 'i-heroicons-rocket-launch'
      },
      {
        title: t('docs.sections.implementation'),
        path: `/docs/implementation`,
        icon: 'i-heroicons-cog-6-tooth'
      },
      {
        title: t('docs.sections.frameworks'),
        path: `/docs/frameworks`,
        icon: 'i-heroicons-cube'
      },
      {
        title: t('docs.sections.manual'),
        path: `/docs/manual`,
        icon: 'i-heroicons-book-open'
      }
    ]
  }

  return {
    getDocsNavigation
  }
}