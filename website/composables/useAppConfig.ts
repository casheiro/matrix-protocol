/**
 * Composable para acessar configurações da aplicação
 * 
 * IMPORTANTE: Este composable centraliza todas as configurações externas.
 * NUNCA hardcode URLs, links ou configurações diretamente nos componentes.
 * Sempre use este composable para acessar configurações de ambiente.
 * 
 * @example
 * ```vue
 * <script setup>
 * const { githubUrl, appName, appVersion } = useAppConfig()
 * </script>
 * 
 * <template>
 *   <a :href="githubUrl">{{ appName }} v{{ appVersion }}</a>
 * </template>
 * ```
 */
export const useAppConfig = () => {
  const config = useRuntimeConfig()
  
  return {
    // Application info
    appName: config.public.appName as string,
    appVersion: config.public.appVersion as string,
    appUrl: config.public.appUrl as string,
    
    // External links
    githubUrl: config.public.githubUrl as string,
    discordUrl: config.public.discordUrl as string,
    discussionsUrl: config.public.discussionsUrl as string,
    docsUrl: config.public.docsUrl as string,
    
    // API configuration
    apiBaseUrl: config.public.apiBaseUrl as string,
    
    // Analytics
    plausibleDomain: config.public.plausibleDomain as string,
    gaId: config.public.gaId as string,
    
    // Computed properties
    hasAnalytics: computed(() => 
      !!(config.public.plausibleDomain || config.public.gaId)
    ),
    
    hasExternalLinks: computed(() => 
      !!(config.public.githubUrl || config.public.discordUrl || config.public.discussionsUrl)
    ),
    
    // Helper methods
    getFullUrl: (path: string) => {
      const baseUrl = config.public.appUrl
      return `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
    },
    
    // Environment info
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production'
  }
}

// Type definition for better TypeScript support
export interface AppConfig {
  appName: string
  appVersion: string
  appUrl: string
  githubUrl: string
  discordUrl: string
  discussionsUrl: string
  docsUrl: string
  apiBaseUrl: string
  plausibleDomain: string
  gaId: string
  hasAnalytics: ComputedRef<boolean>
  hasExternalLinks: ComputedRef<boolean>
  getFullUrl: (path: string) => string
  isDevelopment: boolean
  isProduction: boolean
}