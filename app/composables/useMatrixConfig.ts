/**
 * Matrix Protocol Configuration Composable
 * 
 * Centralizes access to all Matrix Protocol configuration values,
 * environment variables, and runtime settings.
 * 
 * Always use this composable instead of hardcoding URLs or configuration values.
 */
import { computed } from 'vue'

export const useMatrixConfig = () => {
  // Runtime config for environment variables
  const config = useRuntimeConfig()
  
  // Basic app information from runtime config
  const appName = computed(() => config.public.appName)
  const appVersion = computed(() => config.public.appVersion)
  const siteUrl = computed(() => config.public.siteUrl)

  // External links from environment variables
  const casheiroUrl = computed(() => config.public.casheiroUrl)
  const githubUrl = computed(() => config.public.githubUrl)
  const discordUrl = computed(() => config.public.discordUrl)
  const docsUrl = computed(() => config.public.docsUrl)

  // Framework information
  const frameworks = computed(() => [
    {
      key: 'mef',
      acronym: 'MEF',
      name: 'Matrix Embedding Framework',
      description: 'Estruturação de conhecimento versionado',
      colorClass: 'mef',
      primaryColor: '#2ECC71',
      logo: '/logos/mef/mef-logo-text-color-full.svg',
      logoWhite: '/logos/mef/mef-logo-color-text-white.svg',
      icon: '/logos/mef/mef-logo-icon.svg'
    },
    {
      key: 'zof',
      acronym: 'ZOF', 
      name: 'Zion Orchestration Framework',
      description: 'Workflows conceituais para equipes IA',
      colorClass: 'zof',
      primaryColor: '#E67E22',
      logo: '/logos/zof/zof-logo-text-color-full.svg',
      logoWhite: '/logos/zof/zof-logo-color-text-white.svg',
      icon: '/logos/zof/zof-logo-icon.svg'
    },
    {
      key: 'oif',
      acronym: 'OIF',
      name: 'Operator Intelligence Framework', 
      description: 'Arquétipos de inteligência artificial',
      colorClass: 'oif',
      primaryColor: '#2980B9',
      logo: '/logos/oif/oif-logo-text-color-full.svg',
      logoWhite: '/logos/oif/oif-logo-color-text-white.svg',
      icon: '/logos/oif/oif-logo-icon.svg'
    },
    {
      key: 'moc',
      acronym: 'MOC',
      name: 'Matrix Ontology Catalog',
      description: 'Catálogo de hierarquias organizacionais', 
      colorClass: 'moc',
      primaryColor: '#9B59B6',
      logo: '/logos/moc/moc-logo-text-color-full.svg',
      logoWhite: '/logos/moc/moc-logo-color-text-white.svg',
      icon: '/logos/moc/moc-logo-icon.svg'
    },
    {
      key: 'mal',
      acronym: 'MAL',
      name: 'Matrix Arbiter Layer',
      description: 'Arbitragem de conflitos e concorrência',
      colorClass: 'mal', 
      primaryColor: '#C0392B',
      logo: '/logos/mal/mal-logo-text-color-full.svg',
      logoWhite: '/logos/mal/mal-logo-color-text-white.svg',
      icon: '/logos/mal/mal-logo-icon.svg'
    }
  ])

  // Helper functions
  const getFrameworkByKey = (key: string) => {
    return frameworks.value.find(framework => framework.key === key)
  }

  const getFrameworkColor = (key: string) => {
    const framework = getFrameworkByKey(key)
    return framework?.primaryColor || '#6B7280'
  }

  const getFullUrl = (path: string) => {
    const baseUrl = siteUrl.value.replace(/\/$/, '')
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${baseUrl}${cleanPath}`
  }

  // Environment checks
  const isDevelopment = computed(() => process.env.NODE_ENV === 'development')
  const isProduction = computed(() => process.env.NODE_ENV === 'production')

  // Feature flags based on available configuration
  const hasGitHub = computed(() => !!githubUrl.value)
  const hasDiscord = computed(() => !!discordUrl.value)
  const hasDocs = computed(() => !!docsUrl.value)
  const hasExternalLinks = computed(() => hasGitHub.value || hasDiscord.value || hasDocs.value)

  // Matrix Protocol brand assets - tema dark fixo
  const brandAssets = computed(() => ({
    logo: '/logos/matrix/matrix-protocol-logo-white.svg',
    icon: '/logos/matrix/matrix-protocol-icon-white.svg'
  }))

  // Funções para obter logos - tema dark fixo
  const getCurrentLogo = () => {
    return brandAssets.value.logo
  }

  const getCurrentIcon = () => {
    return brandAssets.value.icon
  }

  // Navigation structure
  const navigation = computed(() => [
    { key: 'home', path: '/' },
    { key: 'frameworks', path: '/frameworks' },
    { key: 'protocol', path: '/protocol' },
    { key: 'resources', path: '/resources' }
  ])

  return {
    // Basic app info
    appName,
    appVersion,
    siteUrl,
    
    // External links
    casheiroUrl,
    githubUrl,
    discordUrl,
    docsUrl,
    
    // Framework data
    frameworks,
    getFrameworkByKey,
    getFrameworkColor,
    
    // Utilities
    getFullUrl,
    
    // Environment
    isDevelopment,
    isProduction,
    
    // Feature flags
    hasGitHub,
    hasDiscord, 
    hasDocs,
    hasExternalLinks,
    
    // Brand assets
    brandAssets,
    getCurrentLogo,
    getCurrentIcon,
    
    // Navigation
    navigation
  }
}

// Type definitions for TypeScript support
export interface MatrixFramework {
  key: string
  acronym: string
  name: string
  description: string
  colorClass: string
  primaryColor: string
  logo: string
  logoWhite: string
  icon: string
}

export interface MatrixConfig {
  appName: string
  appVersion: string
  siteUrl: string
  casheiroUrl: string
  githubUrl: string
  discordUrl: string
  docsUrl: string
  frameworks: MatrixFramework[]
  getFrameworkByKey: (key: string) => MatrixFramework | undefined
  getFrameworkColor: (key: string) => string
  getFullUrl: (path: string) => string
  isDevelopment: boolean
  isProduction: boolean
  hasGitHub: boolean
  hasDiscord: boolean
  hasDocs: boolean
  hasExternalLinks: boolean
  brandAssets: {
    logo: string
    icon: string
  }
  navigation: Array<{ key: string; path: string }>
}