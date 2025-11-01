/**
 * Composable para gerenciamento centralizado de schemas do Matrix Protocol
 * Fornece URLs, metadados e utilitários para trabalhar com schemas YAML
 */

export interface SchemaMetadata {
  framework: string
  type: string
  version: string
  filename: string
  title: string
  description?: string // Opcional, será gerada via i18n
  url: string
  localPath: string
  status?: 'stable' | 'deprecated' | 'beta' | 'legacy'
  releaseDate?: string
  changelog?: string[]
  isLatest?: boolean
}

export interface SchemaRegistry {
  [framework: string]: {
    [type: string]: SchemaMetadata[]
  }
}

export const useMatrixSchemas = () => {
  const { locale } = useI18n()
  const config = useRuntimeConfig()

  // Base URL para schemas - dinâmica baseada no ambiente
  const getBaseSchemaUrl = () => {
    // Prioridade: config runtime > detecção automática
    if (config.public.schemaBaseUrl) {
      return config.public.schemaBaseUrl
    }
    
    // Fallback: detectar URL atual do browser (client-side)
    if (process.client && window?.location) {
      const { protocol, host } = window.location
      return `${protocol}//${host}/schemas`
    }
    
    // Fallback: usar siteUrl do config
    const siteUrl = config.public.siteUrl || 'http://localhost:3000'
    return `${siteUrl}/schemas`
  }

  const baseSchemaUrl = getBaseSchemaUrl()
  const localApiUrl = '/api/schemas'

  /**
   * Registro central de todos os schemas disponíveis
   * Mapeamento completo de frameworks -> tipos -> versões
   * URLs são geradas dinamicamente baseadas no ambiente
   */
  const schemaRegistry: SchemaRegistry = {
    mef: {
      uki: [
        {
          framework: 'mef',
          type: 'uki',
          version: '2.1.0',
          filename: 'mef-uki-schema-v2.1.0.yaml',
          title: 'MEF UKI Schema',
          url: `${baseSchemaUrl}/mef/uki/2.1.0`,
          localPath: '/content/{locale}/docs/frameworks/specifications/mef/mef-uki-schema.yaml',
          status: 'stable',
          releaseDate: '2024-10-15',
          changelog: ['Added x-corporate extensions', 'Enhanced validation patterns', 'Improved error messages'],
          isLatest: true
        },
        {
          framework: 'mef',
          type: 'uki',
          version: '2.0.0',
          filename: 'mef-uki-schema-v2.0.0.yaml',
          title: 'MEF UKI Schema',
          url: `${baseSchemaUrl}/mef/uki/2.0.0`,
          localPath: '/content/{locale}/docs/frameworks/specifications/mef/mef-uki-schema.yaml',
          status: 'stable',
          releaseDate: '2024-08-20',
          changelog: ['Breaking: Changed scope_ref pattern', 'Added relationship validation', 'New versioning structure'],
          isLatest: false
        },
        {
          framework: 'mef',
          type: 'uki',
          version: '1.0.0',
          filename: 'mef-uki-schema.yaml',
          title: 'MEF UKI Schema',
          url: `${baseSchemaUrl}/mef/uki/1.0.0`,
          localPath: '/content/{locale}/docs/frameworks/specifications/mef/mef-uki-schema.yaml',
          status: 'legacy',
          releaseDate: '2024-03-01',
          changelog: ['Initial release', 'Basic UKI validation patterns'],
          isLatest: false
        }
      ],
      'decision-record': [{
        framework: 'mef',
        type: 'decision-record',
        version: '1.0.0',
        filename: 'mef-decision-record-schema.yaml',
        title: 'MEF Decision Record Schema',
        url: `${baseSchemaUrl}/mef/decision-record/1.0.0`,
        localPath: '/content/{locale}/docs/frameworks/specifications/mef/mef-decision-record-schema.yaml',
        status: 'stable',
        releaseDate: '2024-05-12',
        changelog: ['Initial decision record schema', 'Persistence patterns defined'],
        isLatest: true
      }]
    },
    moc: {
      hierarchy: [{
        framework: 'moc',
        type: 'hierarchy',
        version: '1.0.0',
        filename: 'moc-hierarchy-schema.yaml',
        title: 'MOC Hierarchy Schema',
        url: `${baseSchemaUrl}/moc/hierarchy/1.0.0`,
        localPath: '/content/{locale}/docs/frameworks/specifications/moc/moc-hierarchy-schema.yaml'
      }],
      'evaluation-criteria': [{
        framework: 'moc',
        type: 'evaluation-criteria',
        version: '1.0.0',
        filename: 'moc-evaluation-criteria-schema.yaml',
        title: 'MOC Evaluation Criteria Schema',
        url: `${baseSchemaUrl}/moc/evaluation-criteria/1.0.0`,
        localPath: '/content/{locale}/docs/frameworks/specifications/moc/moc-evaluation-criteria-schema.yaml'
      }],
      'arbitration-policies': [{
        framework: 'moc',
        type: 'arbitration-policies',
        version: '1.0.0',
        filename: 'moc-arbitration-policies-schema.yaml',
        title: 'MOC Arbitration Policies Schema',
        url: `${baseSchemaUrl}/moc/arbitration-policies/1.0.0`,
        localPath: '/content/{locale}/docs/frameworks/specifications/moc/moc-arbitration-policies-schema.yaml'
      }]
    },
    zof: {
      workflow: [
        {
          framework: 'zof',
          type: 'workflow',
          version: '1.3.0',
          filename: 'zof-workflow-schema-v1.3.0.yaml',
          title: 'ZOF Workflow Schema',
          url: `${baseSchemaUrl}/zof/workflow/1.3.0`,
          localPath: '/content/{locale}/docs/frameworks/specifications/zof/zof-workflow-schema.yaml',
          status: 'beta',
          releaseDate: '2024-11-01',
          changelog: ['Added parallel execution support', 'Enhanced error handling', 'New automation triggers'],
          isLatest: true
        },
        {
          framework: 'zof',
          type: 'workflow',
          version: '1.2.0',
          filename: 'zof-workflow-schema-v1.2.0.yaml',
          title: 'ZOF Workflow Schema',
          url: `${baseSchemaUrl}/zof/workflow/1.2.0`,
          localPath: '/content/{locale}/docs/frameworks/specifications/zof/zof-workflow-schema.yaml',
          status: 'stable',
          releaseDate: '2024-09-10',
          changelog: ['Improved state transitions', 'Added conditional steps', 'Performance optimizations'],
          isLatest: false
        },
        {
          framework: 'zof',
          type: 'workflow',
          version: '1.0.0',
          filename: 'zof-workflow-schema.yaml',
          title: 'ZOF Workflow Schema',
          url: `${baseSchemaUrl}/zof/workflow/1.0.0`,
          localPath: '/content/{locale}/docs/frameworks/specifications/zof/zof-workflow-schema.yaml',
          status: 'stable',
          releaseDate: '2024-06-15',
          changelog: ['Initial workflow schema', 'Basic orchestration patterns'],
          isLatest: false
        }
      ],
      'state-transition': [{
        framework: 'zof',
        type: 'state-transition',
        version: '1.0.0',
        filename: 'zof-state-transition-schema.yaml',
        title: 'ZOF State Transition Schema',
        url: `${baseSchemaUrl}/zof/state-transition/1.0.0`,
        localPath: '/content/{locale}/docs/frameworks/specifications/zof/zof-state-transition-schema.yaml'
      }],
      'enrichment-evaluation': [{
        framework: 'zof',
        type: 'enrichment-evaluation',
        version: '1.0.0',
        filename: 'zof-enrichment-evaluation-schema.yaml',
        title: 'ZOF Enrichment Evaluation Schema',
        url: `${baseSchemaUrl}/zof/enrichment-evaluation/1.0.0`,
        localPath: '/content/{locale}/docs/frameworks/specifications/zof/zof-enrichment-evaluation-schema.yaml'
      }]
    },
    oif: {
      archetype: [{
        framework: 'oif',
        type: 'archetype',
        version: '1.0.0',
        filename: 'oif-archetype-schema.yaml',
        title: 'OIF Archetype Schema',
        url: `${baseSchemaUrl}/oif/archetype/1.0.0`,
        localPath: '/content/{locale}/docs/frameworks/specifications/oif/oif-archetype-schema.yaml'
      }],
      'arbitration-explanation': [{
        framework: 'oif',
        type: 'arbitration-explanation',
        version: '1.0.0',
        filename: 'oif-arbitration-explanation-schema.yaml',
        title: 'OIF Arbitration Explanation Schema',
        url: `${baseSchemaUrl}/oif/arbitration-explanation/1.0.0`,
        localPath: '/content/{locale}/docs/frameworks/specifications/oif/oif-arbitration-explanation-schema.yaml'
      }]
    },
    mal: {
      'decision-record': [{
        framework: 'mal',
        type: 'decision-record',
        version: '1.0.0',
        filename: 'mal-decision-record-schema.yaml',
        title: 'MAL Decision Record Schema',
        url: `${baseSchemaUrl}/mal/decision-record/1.0.0`,
        localPath: '/content/{locale}/docs/frameworks/specifications/mal/mal-decision-record-schema.yaml'
      }],
      'arbitration-event': [{
        framework: 'mal',
        type: 'arbitration-event',
        version: '1.0.0',
        filename: 'mal-arbitration-event-schema.yaml',
        title: 'MAL Arbitration Event Schema',
        url: `${baseSchemaUrl}/mal/arbitration-event/1.0.0`,
        localPath: '/content/{locale}/docs/frameworks/specifications/mal/mal-arbitration-event-schema.yaml'
      }]
    }
  }

  /**
   * Obter schema específico por framework, tipo e versão
   */
  const getSchema = (framework: string, type: string, version = 'latest'): SchemaMetadata | null => {
    const schemas = schemaRegistry[framework]?.[type]
    if (!schemas) return null
    
    if (version === 'latest') {
      return schemas.find(s => s.isLatest) || schemas[0] || null
    }
    
    return schemas.find(s => s.version === version) || schemas[0] || null
  }

  /**
   * Obter todos os schemas de um framework
   */
  const getFrameworkSchemas = (framework: string): SchemaMetadata[] => {
    const frameworkSchemas = schemaRegistry[framework]
    if (!frameworkSchemas) return []
    
    return Object.values(frameworkSchemas).flat()
  }

  /**
   * Obter lista de todos os schemas disponíveis
   */
  const getAllSchemas = (): SchemaMetadata[] => {
    return Object.values(schemaRegistry)
      .map(framework => Object.values(framework).flat())
      .flat()
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
  const schemaExists = (framework: string, type: string, version = '1.0.0'): boolean => {
    return getSchema(framework, type, version) !== null
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
  const getAvailableFrameworks = (): string[] => {
    return Object.keys(schemaRegistry)
  }

  /**
   * Obter tipos de schema disponíveis para um framework
   */
  const getFrameworkTypes = (framework: string): string[] => {
    return Object.keys(schemaRegistry[framework] || {})
  }

  /**
   * Validar se uma URL de schema é válida
   */
  const isValidSchemaUrl = (url: string): boolean => {
    const parsed = parseSchemaUrl(url)
    if (!parsed) return false
    
    return schemaExists(parsed.framework, parsed.type, parsed.version)
  }

  /**
   * Obter todas as versões de um schema específico
   */
  const getSchemaVersions = (framework: string, type: string): SchemaMetadata[] => {
    return schemaRegistry[framework]?.[type] || []
  }

  /**
   * Obter a versão mais recente de um schema
   */
  const getLatestSchemaVersion = (framework: string, type: string): SchemaMetadata | null => {
    const schemas = schemaRegistry[framework]?.[type]
    if (!schemas) return null
    
    return schemas.find(s => s.isLatest) || schemas[0] || null
  }

  /**
   * Verificar se um schema tem múltiplas versões
   */
  const hasMultipleVersions = (framework: string, type: string): boolean => {
    const schemas = schemaRegistry[framework]?.[type]
    return schemas ? schemas.length > 1 : false
  }

  /**
   * Obter contagem de versões por schema
   */
  const getVersionCount = (framework: string, type: string): number => {
    const schemas = schemaRegistry[framework]?.[type]
    return schemas ? schemas.length : 0
  }

  /**
   * Obter schemas únicos (apenas versão mais recente) para listagem
   */
  const getUniqueSchemas = (): SchemaMetadata[] => {
    return Object.values(schemaRegistry)
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
  const getVersionStats = () => {
    const allSchemas = getAllSchemas()
    const uniqueSchemas = getUniqueSchemas()
    
    return {
      totalVersions: allSchemas.length,
      uniqueSchemas: uniqueSchemas.length,
      multiVersionSchemas: uniqueSchemas.filter(schema => 
        hasMultipleVersions(schema.framework, schema.type)
      ).length,
      statusBreakdown: {
        stable: allSchemas.filter(s => s.status === 'stable').length,
        beta: allSchemas.filter(s => s.status === 'beta').length,
        deprecated: allSchemas.filter(s => s.status === 'deprecated').length,
        legacy: allSchemas.filter(s => s.status === 'legacy').length
      }
    }
  }

  return {
    // Data
    schemaRegistry,
    
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