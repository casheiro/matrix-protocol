/**
 * Utility functions for Open Graph image generation
 * Provides framework colors, internationalization, and helper functions
 */

/**
 * Framework color definitions matching the Matrix Protocol brand
 */
export const frameworkColors = {
  mef: {
    primary: '#2ECC71',  // Emerald Green
    light: '#58D68D',
    dark: '#239B56'
  },
  zof: {
    primary: '#E67E22',  // Amber Orange
    light: '#F39C12',
    dark: '#D35400'
  },
  oif: {
    primary: '#2980B9',  // Deep Blue
    light: '#3498DB',
    dark: '#1F4E79'
  },
  moc: {
    primary: '#9B59B6',  // Neutral Lilac
    light: '#BB8FCE',
    dark: '#7D3C98'
  },
  mal: {
    primary: '#C0392B',  // Dark Red
    light: '#E74C3C',
    dark: '#922B21'
  }
} as const

/**
 * Get framework colors by framework key
 */
export function getFrameworkColors(frameworkKey: string) {
  const key = frameworkKey.toLowerCase() as keyof typeof frameworkColors
  return frameworkColors[key] || frameworkColors.mef
}

/**
 * Framework names in different languages
 */
export const frameworkNames = {
  mef: {
    en: 'Matrix Embedding Framework',
    pt: 'Framework de Incorporação da Matrix'
  },
  zof: {
    en: 'Zion Orchestration Framework',
    pt: 'Framework de Orquestração Zion'
  },
  oif: {
    en: 'Operator Intelligence Framework',
    pt: 'Framework de Inteligência do Operador'
  },
  moc: {
    en: 'Matrix Ontology Catalog',
    pt: 'Catálogo de Ontologia Matrix'
  },
  mal: {
    en: 'Matrix Arbiter Layer',
    pt: 'Camada de Arbitragem Matrix'
  }
} as const

/**
 * Get framework name in specified language
 */
export function getFrameworkName(frameworkKey: string, locale: string = 'en'): string {
  const key = frameworkKey.toLowerCase() as keyof typeof frameworkNames
  const lang = locale === 'pt' ? 'pt' : 'en'
  
  return frameworkNames[key]?.[lang] || frameworkNames.mef[lang]
}

/**
 * Localized text for OG images
 */
export const localeTexts = {
  en: {
    website: 'Website',
    article: 'Documentation',
    framework: 'Framework',
    protocol: 'Protocol',
    version: 'Version',
    poweredBy: 'Powered by Matrix Protocol'
  },
  pt: {
    website: 'Website',
    article: 'Documentação',
    framework: 'Framework',
    protocol: 'Protocolo',
    version: 'Versão',
    poweredBy: 'Desenvolvido com Matrix Protocol'
  }
} as const

/**
 * Get localized text object
 */
export function getLocaleText(locale: string = 'en') {
  return localeTexts[locale as keyof typeof localeTexts] || localeTexts.en
}

/**
 * Generate OG image URL with parameters
 */
export function generateOGImageUrl(params: {
  title?: string
  framework?: string
  locale?: string
  subtitle?: string
  type?: 'website' | 'article'
} = {}) {
  const searchParams = new URLSearchParams()
  
  if (params.title) searchParams.set('title', params.title)
  if (params.framework) searchParams.set('framework', params.framework)
  if (params.locale) searchParams.set('locale', params.locale)
  if (params.subtitle) searchParams.set('subtitle', params.subtitle)
  if (params.type) searchParams.set('type', params.type)
  
  return `/api/og?${searchParams.toString()}`
}

/**
 * Framework acronyms for display
 */
export const frameworkAcronyms = {
  mef: 'MEF',
  zof: 'ZOF', 
  oif: 'OIF',
  moc: 'MOC',
  mal: 'MAL'
} as const

/**
 * Get framework acronym
 */
export function getFrameworkAcronym(frameworkKey: string): string {
  const key = frameworkKey.toLowerCase() as keyof typeof frameworkAcronyms
  return frameworkAcronyms[key] || 'MEF'
}

/**
 * Validate framework key
 */
export function isValidFramework(frameworkKey: string): boolean {
  return Object.keys(frameworkColors).includes(frameworkKey.toLowerCase())
}

/**
 * Get all framework keys
 */
export function getAllFrameworkKeys(): string[] {
  return Object.keys(frameworkColors)
}

/**
 * Format title for OG image (truncate if too long)
 */
export function formatOGTitle(title: string, maxLength: number = 60): string {
  if (title.length <= maxLength) return title
  
  const truncated = title.substring(0, maxLength)
  const lastSpaceIndex = truncated.lastIndexOf(' ')
  
  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + '...'
  }
  
  return truncated + '...'
}

/**
 * Format subtitle for OG image
 */
export function formatOGSubtitle(subtitle: string, maxLength: number = 120): string {
  if (subtitle.length <= maxLength) return subtitle
  
  const truncated = subtitle.substring(0, maxLength)
  const lastSpaceIndex = truncated.lastIndexOf(' ')
  
  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + '...'
  }
  
  return truncated + '...'
}