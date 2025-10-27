/**
 * Navigation Internationalization Composable
 * 
 * Provides multilingual support for dynamic navigation components
 * Handles locale switching, content discovery, and URL management
 * 
 * @author Bruno Oliveira (Full-Stack Developer)
 * @created 2025-10-16
 * @task TASK-2.5
 */

import type { NavigationNode, Locale } from '../../shared/types/navigation'

export interface NavigationLocaleConfig {
  code: string
  name: string
  iso: string
  direction: 'ltr' | 'rtl'
  flag?: string
}

export interface MultilingualNavigationData {
  [locale: string]: {
    tree?: NavigationNode[]
    breadcrumbs?: any[]
    siblings?: any
    lastFetch?: Date
    isLoading?: boolean
    error?: string | null
  }
}

export function useNavigationI18n() {
  const { locale, locales, setLocale, t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  
  // Multi-locale navigation data cache
  const navigationDataCache = ref<MultilingualNavigationData>({})
  
  // Available locales with enhanced configuration
  const availableLocales = computed<NavigationLocaleConfig[]>(() => {
    return (locales.value as any[]).map(loc => ({
      code: loc.code,
      name: loc.name,
      iso: loc.iso || loc.code,
      direction: loc.dir || 'ltr',
      flag: getLocaleFlag(loc.code)
    }))
  })
  
  // Current locale configuration
  const currentLocale = computed<NavigationLocaleConfig>(() => {
    return availableLocales.value.find(loc => loc.code === locale.value) || 
           availableLocales.value[0] || 
           { code: 'pt', name: 'Português', iso: 'pt-BR', direction: 'ltr', flag: '🇧🇷' }
  })
  
  // Get navigation data for specific locale
  const getNavigationData = (localeCode: string) => {
    if (!navigationDataCache.value[localeCode]) {
      navigationDataCache.value[localeCode] = {
        isLoading: false,
        error: null
      }
    }
    return navigationDataCache.value[localeCode]
  }
  
  // Fetch navigation tree for specific locale
  const fetchNavigationTree = async (
    localeCode: string, 
    options: {
      section?: string
      depth?: number
      cache?: boolean
      force?: boolean
    } = {}
  ) => {
    const data = getNavigationData(localeCode)
    
    // Check if we need to fetch
    if (!options.force && data.tree && data.lastFetch) {
      const timeSinceLastFetch = Date.now() - data.lastFetch.getTime()
      if (timeSinceLastFetch < 5 * 60 * 1000) { // 5 minutes cache
        return data.tree
      }
    }
    
    data.isLoading = true
    data.error = null
    
    try {
      const query = new URLSearchParams({
        locale: localeCode,
        cache: options.cache !== false ? 'true' : 'false'
      })
      
      if (options.section) {
        query.append('section', options.section)
      }
      
      if (options.depth) {
        query.append('depth', options.depth.toString())
      }
      
      const response = await $fetch(`/api/navigation/tree?${query.toString()}`)
      
      data.tree = response.tree
      data.lastFetch = new Date()
      data.error = null
      
      return data.tree
      
    } catch (error) {
      console.error(`Failed to fetch navigation for locale ${localeCode}:`, error)
      data.error = error instanceof Error ? error.message : 'Unknown error'
      return null
    } finally {
      data.isLoading = false
    }
  }
  
  // Switch locale with navigation preservation
  const switchLocale = async (newLocale: Locale, preservePath = true) => {
    if (newLocale === locale.value) return
    
    try {
      // Pre-fetch navigation data for new locale
      await fetchNavigationTree(newLocale, { cache: true })
      
      if (preservePath) {
        // Get current path without locale prefix
        const currentPath = route.path.replace(`/${locale.value}`, '') || '/'
        
        // Check if equivalent page exists in target locale
        const targetData = getNavigationData(newLocale)
        const pageExists = await checkPageExists(newLocale, currentPath)
        
        if (pageExists) {
          // Navigate to equivalent page in new locale
          await router.push(`/${newLocale}${currentPath}`)
        } else {
          // Fallback to home page in new locale
          await router.push(`/${newLocale}`)
        }
      }
      
      // Set the new locale
      await setLocale(newLocale)
      
      // Update HTML lang attribute
      if (process.client) {
        document.documentElement.lang = currentLocale.value.iso
        document.documentElement.dir = currentLocale.value.direction
      }
      
    } catch (error) {
      console.error('Failed to switch locale:', error)
      throw error
    }
  }
  
  // Check if a page exists in the target locale
  const checkPageExists = async (localeCode: string, path: string): Promise<boolean> => {
    try {
      const query = new URLSearchParams({
        path: path.startsWith('/') ? path : `/${path}`,
        locale: localeCode
      })
      
      await $fetch(`/api/navigation/breadcrumbs?${query.toString()}`)
      return true
    } catch {
      return false
    }
  }
  
  // Get locale-specific content path
  const getLocalizedPath = (path: string, targetLocale?: string) => {
    const target = targetLocale || locale.value
    
    // Remove existing locale prefix
    const cleanPath = path.replace(/^\/[a-z]{2}\//, '/').replace(/^\/[a-z]{2}$/, '/')
    
    // Add target locale prefix
    return `/${target}${cleanPath === '/' ? '' : cleanPath}`
  }
  
  // Get alternate language links for SEO
  const getAlternateLinks = (currentPath?: string) => {
    const path = currentPath || route.path
    const cleanPath = path.replace(/^\/[a-z]{2}\//, '/').replace(/^\/[a-z]{2}$/, '/')
    
    return availableLocales.value.map(loc => ({
      hreflang: loc.iso,
      href: `${useRuntimeConfig().public.siteUrl}/${loc.code}${cleanPath === '/' ? '' : cleanPath}`
    }))
  }
  
  // Get flag emoji for locale
  const getLocaleFlag = (localeCode: string): string => {
    const flags: Record<string, string> = {
      'pt': '🇧🇷',
      'en': '🇺🇸',
      'es': '🇪🇸',
      'fr': '🇫🇷',
      'de': '🇩🇪',
      'it': '🇮🇹',
      'ja': '🇯🇵',
      'ko': '🇰🇷',
      'zh': '🇨🇳'
    }
    return flags[localeCode] || '🌐'
  }
  
  // Get RTL/LTR direction for locale
  const getTextDirection = (localeCode?: string): 'ltr' | 'rtl' => {
    const rtlLocales = ['ar', 'he', 'fa', 'ur']
    const target = localeCode || locale.value
    return rtlLocales.includes(target) ? 'rtl' : 'ltr'
  }
  
  // Format date/time for current locale
  const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions) => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    
    return new Intl.DateTimeFormat(currentLocale.value.iso, { ...defaultOptions, ...options }).format(date)
  }
  
  // Format number for current locale
  const formatNumber = (number: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat(currentLocale.value.iso, options).format(number)
  }
  
  // Clear navigation cache
  const clearNavigationCache = (localeCode?: string) => {
    if (localeCode) {
      delete navigationDataCache.value[localeCode]
    } else {
      navigationDataCache.value = {}
    }
  }
  
  // Preload navigation data for all locales
  const preloadAllLocales = async (options: { section?: string; depth?: number } = {}) => {
    const promises = availableLocales.value.map(loc => 
      fetchNavigationTree(loc.code, { ...options, cache: true })
    )
    
    try {
      await Promise.allSettled(promises)
    } catch (error) {
      console.warn('Some locales failed to preload:', error)
    }
  }
  
  // Get navigation loading state for locale
  const isNavigationLoading = (localeCode?: string) => {
    const target = localeCode || locale.value
    return getNavigationData(target).isLoading || false
  }
  
  // Get navigation error for locale
  const getNavigationError = (localeCode?: string) => {
    const target = localeCode || locale.value
    return getNavigationData(target).error || null
  }
  
  // Generate hreflang meta tags for SEO
  const generateHreflangTags = (currentPath?: string) => {
    const alternates = getAlternateLinks(currentPath)
    
    return [
      ...alternates.map(link => ({
        rel: 'alternate',
        hreflang: link.hreflang,
        href: link.href
      })),
      // Add x-default for primary locale
      {
        rel: 'alternate',
        hreflang: 'x-default',
        href: alternates.find(link => link.hreflang.startsWith('pt'))?.href || alternates[0]?.href || '/'
      }
    ]
  }
  
  return {
    // State
    availableLocales,
    currentLocale,
    
    // Navigation data
    fetchNavigationTree,
    getNavigationData,
    clearNavigationCache,
    preloadAllLocales,
    
    // Locale switching
    switchLocale,
    checkPageExists,
    getLocalizedPath,
    
    // Utilities
    formatDate,
    formatNumber,
    getTextDirection,
    getLocaleFlag,
    
    // SEO
    getAlternateLinks,
    generateHreflangTags,
    
    // Status
    isNavigationLoading,
    getNavigationError
  }
}