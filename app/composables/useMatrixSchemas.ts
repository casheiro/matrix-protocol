/**
 * Composable para gerenciamento centralizado de schemas do Matrix Protocol
 * Carrega dados dinamicamente da API de registry em vez de usar dados hardcoded
 */

export interface SchemaMetadata {
  framework: string
  type: string
  version: string
  filename: string
  title: string
  description?: string
  url: string
  localPath: string
  status?: 'stable' | 'deprecated' | 'beta' | 'legacy'
  releaseDate?: string
  changelog?: string[]
  isLatest?: boolean
  breaking?: boolean
  category?: string
}

export interface SchemaVersionInfo {
  status: string
  releaseDate?: string
  changelog?: string[]
  isLatest: boolean
  breaking: boolean
}

export interface SchemaInfo {
  title: string
  description: string
  filename: string
  category: string
  versions: Record<string, SchemaVersionInfo>
}

export interface RegistryFramework {
  name: string
  description: string
  schemas: Record<string, SchemaInfo>
}

export interface SchemaRegistryData {
  frameworks: Record<string, RegistryFramework>
  metadata: {
    statistics: {
      totalFrameworks: number
      totalSchemas: number
      totalVersions: number
      statusBreakdown: Record<string, number>
    }
    categories: Record<string, string>
  }
}

export const useMatrixSchemas = () => {
  const { locale } = useI18n()
  const config = useRuntimeConfig()
  
  // Estado reativo para os dados do registry
  const registryData = ref<SchemaRegistryData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Base URL para schemas - dinâmica baseada no ambiente
  const getBaseSchemaUrl = () => {
    if (config.public.schemaBaseUrl) {
      return config.public.schemaBaseUrl
    }
    
    if (import.meta.client && window?.location) {
      const { protocol, host } = window.location
      return `${protocol}//${host}/schemas`
    }
    
    const siteUrl = config.public.siteUrl || 'http://localhost:3000'
    return `${siteUrl}/schemas`
  }

  const baseSchemaUrl = getBaseSchemaUrl()
  const localApiUrl = '/api/schemas'

  /**
   * Carregar dados do registry da API
   */
  const loadRegistry = async () => {
    if (registryData.value) return registryData.value
    
    isLoading.value = true
    error.value = null
    
    try {
      const response = await $fetch<SchemaRegistryData>('/api/schemas/registry')
      registryData.value = response
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar registry'
      console.error('Erro ao carregar schema registry:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Converter dados do registry para formato SchemaMetadata
   */
  const transformRegistryToSchemas = (registry: SchemaRegistryData): SchemaMetadata[] => {
    const schemas: SchemaMetadata[] = []
    
    Object.entries(registry.frameworks).forEach(([frameworkKey, framework]) => {
      Object.entries(framework.schemas).forEach(([typeKey, schemaInfo]) => {
        Object.entries(schemaInfo.versions).forEach(([version, versionInfo]) => {
          schemas.push({
            framework: frameworkKey,
            type: typeKey,
            version,
            filename: schemaInfo.filename,
            title: schemaInfo.title,
            description: schemaInfo.description,
            url: `${baseSchemaUrl}/${frameworkKey}/${typeKey}/${version}`,
            localPath: `/content/{locale}/docs/frameworks/specifications/${frameworkKey}/${typeKey}/${version}/${schemaInfo.filename}`,
            status: versionInfo.status as SchemaMetadata['status'],
            releaseDate: versionInfo.releaseDate,
            changelog: versionInfo.changelog,
            isLatest: versionInfo.isLatest,
            breaking: versionInfo.breaking,
            category: schemaInfo.category
          })
        })
      })
    })
    
    return schemas
  }

  /**
   * Computed para obter todos os schemas transformados
   */
  const allSchemas = computed<SchemaMetadata[]>(() => {
    if (!registryData.value) return []
    return transformRegistryToSchemas(registryData.value)
  })

  /**
   * Computed para obter schemas agrupados por framework e tipo
   */
  const schemasByFrameworkAndType = computed(() => {
    const grouped: Record<string, Record<string, SchemaMetadata[]>> = {}
    
    allSchemas.value.forEach(schema => {
      if (!grouped[schema.framework]) {
        grouped[schema.framework] = {}
      }
      if (!grouped[schema.framework][schema.type]) {
        grouped[schema.framework][schema.type] = []
      }
      grouped[schema.framework][schema.type].push(schema)
    })
    
    // Ordenar versões dentro de cada tipo
    Object.values(grouped).forEach(framework => {
      Object.values(framework).forEach(schemas => {
        schemas.sort((a, b) => {
          if (a.isLatest) return -1
          if (b.isLatest) return 1
          if (a.releaseDate && b.releaseDate) {
            return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
          }
          return b.version.localeCompare(a.version, undefined, { numeric: true })
        })
      })
    })
    
    return grouped
  })

  /**
   * Obter schema específico por framework, tipo e versão
   */
  const getSchema = async (framework: string, type: string, version = 'latest'): Promise<SchemaMetadata | null> => {
    await loadRegistry()
    
    const schemas = schemasByFrameworkAndType.value[framework]?.[type]
    if (!schemas) return null
    
    if (version === 'latest') {
      return schemas.find(s => s.isLatest) || schemas[0] || null
    }
    
    return schemas.find(s => s.version === version) || schemas[0] || null
  }

  /**
   * Obter todos os schemas de um framework
   */
  const getFrameworkSchemas = async (framework: string): Promise<SchemaMetadata[]> => {
    await loadRegistry()
    
    const frameworkSchemas = schemasByFrameworkAndType.value[framework]
    if (!frameworkSchemas) return []
    
    return Object.values(frameworkSchemas).flat()
  }

  /**
   * Obter lista de todos os schemas disponíveis
   */
  const getAllSchemas = async (): Promise<SchemaMetadata[]> => {
    await loadRegistry()
    return allSchemas.value
  }

  /**
   * Resolver URL do schema para chamada API local
   */
  const getSchemaApiUrl = (framework: string, type: string, version = '1.0.0'): string => {
    return `${localApiUrl}/${framework}/${type}/${version}?locale=${locale.value}`
  }

  /**
   * Obter URL canônica do schema (para referência externa)
   */
  const getSchemaCanonicalUrl = (framework: string, type: string, version = '1.0.0'): string => {
    return `${baseSchemaUrl}/${framework}/${type}/${version}`
  }

  /**
   * Verificar se schema existe
   */
  const schemaExists = async (framework: string, type: string, version = '1.0.0'): Promise<boolean> => {
    const schema = await getSchema(framework, type, version)
    return schema !== null
  }

  /**
   * Obter metadados do schema a partir de URL $id
   */
  const parseSchemaUrl = (schemaId: string): { framework: string; type: string; version: string } | null => {
    try {
      const url = new URL(schemaId)
      const pathParts = url.pathname.split('/').filter(p => p)
      
      if (pathParts.length < 4 || pathParts[0] !== 'schemas') {
        return null
      }
      
      return {
        framework: pathParts[1] || '',
        type: pathParts[2] || '',
        version: pathParts[3] || ''
      }
    } catch {
      return null
    }
  }

  /**
   * Obter lista de frameworks disponíveis
   */
  const getAvailableFrameworks = async (): Promise<string[]> => {
    await loadRegistry()
    return Object.keys(schemasByFrameworkAndType.value)
  }

  /**
   * Obter tipos de schema disponíveis para um framework
   */
  const getFrameworkTypes = async (framework: string): Promise<string[]> => {
    await loadRegistry()
    return Object.keys(schemasByFrameworkAndType.value[framework] || {})
  }

  /**
   * Validar se uma URL de schema é válida
   */
  const isValidSchemaUrl = async (url: string): Promise<boolean> => {
    const parsed = parseSchemaUrl(url)
    if (!parsed) return false
    
    return await schemaExists(parsed.framework, parsed.type, parsed.version)
  }

  /**
   * Obter todas as versões de um schema específico
   */
  const getSchemaVersions = async (framework: string, type: string): Promise<SchemaMetadata[]> => {
    await loadRegistry()
    return schemasByFrameworkAndType.value[framework]?.[type] || []
  }

  /**
   * Obter a versão mais recente de um schema
   */
  const getLatestSchemaVersion = async (framework: string, type: string): Promise<SchemaMetadata | null> => {
    await loadRegistry()
    
    const schemas = schemasByFrameworkAndType.value[framework]?.[type]
    if (!schemas) return null
    
    return schemas.find(s => s.isLatest) || schemas[0] || null
  }

  /**
   * Verificar se um schema tem múltiplas versões
   */
  const hasMultipleVersions = async (framework: string, type: string): Promise<boolean> => {
    await loadRegistry()
    
    const schemas = schemasByFrameworkAndType.value[framework]?.[type]
    return schemas ? schemas.length > 1 : false
  }

  /**
   * Obter contagem de versões por schema
   */
  const getVersionCount = async (framework: string, type: string): Promise<number> => {
    await loadRegistry()
    
    const schemas = schemasByFrameworkAndType.value[framework]?.[type]
    return schemas ? schemas.length : 0
  }

  /**
   * Obter schemas únicos (apenas versão mais recente) para listagem
   */
  const getUniqueSchemas = async (): Promise<SchemaMetadata[]> => {
    await loadRegistry()
    
    return Object.values(schemasByFrameworkAndType.value)
      .map(framework => 
        Object.values(framework).map(schemas => 
          schemas.find(s => s.isLatest) || schemas[0]
        )
      )
      .flat()
      .filter(Boolean) as SchemaMetadata[]
  }

  /**
   * Obter estatísticas de versões
   */
  const getVersionStats = async () => {
    await loadRegistry()
    
    if (!registryData.value) {
      return {
        totalVersions: 0,
        uniqueSchemas: 0,
        multiVersionSchemas: 0,
        statusBreakdown: { stable: 0, beta: 0, deprecated: 0, legacy: 0 }
      }
    }
    
    // Usar estatísticas diretamente do registry
    const stats = registryData.value.metadata.statistics
    const uniqueSchemas = await getUniqueSchemas()
    
    // Calcular schemas com múltiplas versões
    let multiVersionSchemas = 0
    for (const schema of uniqueSchemas) {
      if (await hasMultipleVersions(schema.framework, schema.type)) {
        multiVersionSchemas++
      }
    }
    
    return {
      totalVersions: stats.totalVersions,
      uniqueSchemas: stats.totalSchemas,
      multiVersionSchemas,
      statusBreakdown: stats.statusBreakdown
    }
  }

  // Auto-carregar registry na inicialização se estiver no client
  if (import.meta.client) {
    loadRegistry().catch(console.error)
  }

  return {
    // Estado reativo
    registryData: readonly(registryData),
    isLoading: readonly(isLoading),
    error: readonly(error),
    allSchemas,
    
    // Métodos de carregamento
    loadRegistry,
    
    // Getters
    getSchema,
    getFrameworkSchemas,
    getAllSchemas,
    getAvailableFrameworks,
    getFrameworkTypes,
    
    // Version management
    getSchemaVersions,
    getLatestSchemaVersion,
    hasMultipleVersions,
    getVersionCount,
    getUniqueSchemas,
    getVersionStats,
    
    // URL utilities
    getSchemaApiUrl,
    getSchemaCanonicalUrl,
    parseSchemaUrl,
    
    // Validation
    schemaExists,
    isValidSchemaUrl
  }
}