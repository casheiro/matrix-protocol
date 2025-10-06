/**
 * Composable para gerenciar assets (logos) do Matrix Protocol
 * Fornece helpers para acessar logos corretos baseado no tema e contexto
 */
import { computed, readonly } from 'vue'
import { useMatrixConfig } from './useMatrixConfig'

export interface FrameworkAsset {
  key: string
  name: string
  acronym: string
  color: string
  logos: {
    full: string
    white: string
    icon: string
  }
}

export const useMatrixAssets = () => {
  // Usar useMatrixConfig que já tem colorMode integrado
  const { getCurrentLogo, getCurrentIcon } = useMatrixConfig()
  
  // Logos do Matrix Protocol principal - simplificado
  const getMatrixLogo = (variant: 'desktop' | 'mobile' = 'desktop') => {
    // Para desktop usa logo completo, para mobile usa ícone
    return getCurrentIcon()
  }
  
  // Definição de todos os frameworks com seus assets
  const frameworks: FrameworkAsset[] = [
    {
      key: 'mef',
      name: 'Matrix Embedding Framework',
      acronym: 'MEF',
      color: 'emerald',
      logos: {
        full: '/logos/mef/mef-logo-text-color-full.svg',
        white: '/logos/mef/mef-logo-color-text-white.svg',
        icon: '/logos/mef/mef-logo-icon.svg'
      }
    },
    {
      key: 'zof',
      name: 'Zion Orchestration Framework',
      acronym: 'ZOF', 
      color: 'orange',
      logos: {
        full: '/logos/zof/zof-logo-text-color-full.svg',
        white: '/logos/zof/zof-logo-color-text-white.svg',
        icon: '/logos/zof/zof-logo-icon.svg'
      }
    },
    {
      key: 'oif',
      name: 'Operator Intelligence Framework',
      acronym: 'OIF',
      color: 'blue',
      logos: {
        full: '/logos/oif/oif-logo-text-color-full.svg',
        white: '/logos/oif/oif-logo-color-text-white.svg',
        icon: '/logos/oif/oif-logo-icon.svg'
      }
    },
    {
      key: 'moc',
      name: 'Matrix Ontology Catalog',
      acronym: 'MOC',
      color: 'purple',
      logos: {
        full: '/logos/moc/moc-logo-text-color-full.svg',
        white: '/logos/moc/moc-logo-color-text-white.svg',
        icon: '/logos/moc/moc-logo-icon.svg'
      }
    },
    {
      key: 'mal',
      name: 'Matrix Arbiter Layer',
      acronym: 'MAL',
      color: 'red',
      logos: {
        full: '/logos/mal/mal-logo-text-color-full.svg',
        white: '/logos/mal/mal-logo-color-text-white.svg',
        icon: '/logos/mal/mal-logo-icon.svg'
      }
    }
  ]
  
  // Buscar framework por chave
  const getFramework = (key: string): FrameworkAsset | undefined => {
    return frameworks.find(fw => fw.key === key)
  }
  
  // Obter logo do framework baseado no contexto
  const getFrameworkLogo = (
    key: string, 
    variant: 'full' | 'white' | 'icon' = 'full',
    fallback = true
  ): string => {
    const framework = getFramework(key)
    
    if (!framework) {
      if (fallback) {
        return getMatrixLogo() // Fallback para logo principal
      }
      throw new Error(`Framework ${key} não encontrado`)
    }
    
    return framework.logos[variant]
  }
  
  // Obter classe de cor Tailwind do framework
  const getFrameworkColorClass = (key: string, shade = '500'): string => {
    const framework = getFramework(key)
    if (!framework) return 'gray-500'
    
    return `${framework.key}-${shade}`
  }
  
  // Verificar se asset existe (para debugging)
  const validateAsset = async (path: string): Promise<boolean> => {
    try {
      const response = await fetch(path, { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }
  
  // Assets para modo escuro/claro
  const getAssetForTheme = (lightAsset: string, darkAsset: string): string => {
    // Usar getCurrentIcon função para determinar o tema atual
    const currentIcon = getCurrentIcon()
    const isDark = currentIcon.includes('white') // white = dark mode
    return isDark ? darkAsset : lightAsset
  }
  
  return {
    // Logos principais
    getMatrixLogo,
    
    // Frameworks
    frameworks: readonly(frameworks),
    getFramework,
    getFrameworkLogo,
    getFrameworkColorClass,
    
    // Utilities
    validateAsset,
    getAssetForTheme,
    
    // Computed
    allFrameworkKeys: computed(() => frameworks.map(fw => fw.key)),
    frameworksCount: computed(() => frameworks.length)
  }
}