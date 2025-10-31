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
  description: string
  url: string
  localPath: string
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
      uki: [{
        framework: 'mef',
        type: 'uki',
        version: '1.0.0',
        filename: 'mef-uki-schema.yaml',
        title: 'MEF UKI Schema',
        description: 'Schema canônico para Units of Knowledge Interlinked',
        url: `${baseSchemaUrl}/mef/uki/1.0.0`,
        localPath: '/content/{locale}/docs/frameworks/specifications/mef/mef-uki-schema.yaml'
      }],
      'decision-record': [{
        framework: 'mef',
        type: 'decision-record',
        version: '1.0.0',
        filename: 'mef-decision-record-schema.yaml',
        title: 'MEF Decision Record Schema',
        description: 'Schema para registros de decisão do MEF',
        url: `${baseSchemaUrl}/mef/decision-record/1.0.0`,
        localPath: '/content/{locale}/docs/frameworks/specifications/mef/mef-decision-record-schema.yaml'
      }]
    },
    moc: {
      hierarchy: [{
        framework: 'moc',
        type: 'hierarchy',
        version: '1.0.0',
        filename: 'moc-hierarchy-schema.yaml',
        title: 'MOC Hierarchy Schema',
        description: 'Schema para hierarquias organizacionais do MOC',
        url: `${baseSchemaUrl}/moc/hierarchy/1.0.0`,
        localPath: '/content/{locale}/docs/frameworks/specifications/moc/moc-hierarchy-schema.yaml'
      }],
      'evaluation-criteria': [{
        framework: 'moc',
        type: 'evaluation-criteria',
        version: '1.0.0',
        filename: 'moc-evaluation-criteria-schema.yaml',
        title: 'MOC Evaluation Criteria Schema',
        description: 'Schema para critérios de avaliação do MOC',
        url: `${baseSchemaUrl}/moc/evaluation-criteria/1.0.0`,
        localPath: '/content/{locale}/docs/frameworks/specifications/moc/moc-evaluation-criteria-schema.yaml'
      }],
      'arbitration-policies': [{
        framework: 'moc',
        type: 'arbitration-policies',
        version: '1.0.0',
        filename: 'moc-arbitration-policies-schema.yaml',
        title: 'MOC Arbitration Policies Schema',
        description: 'Schema para políticas de arbitragem do MOC',
        url: `${baseSchemaUrl}/moc/arbitration-policies/1.0.0`,
        localPath: '/content/{locale}/docs/frameworks/specifications/moc/moc-arbitration-policies-schema.yaml'
      }]
    },
    zof: {
      workflow: [{
        framework: 'zof',
        type: 'workflow',
        version: '1.0.0',
        filename: 'zof-workflow-schema.yaml',
        title: 'ZOF Workflow Schema',
        description: 'Schema para workflows do ZOF',
        url: `${baseSchemaUrl}/zof/workflow/1.0.0`,
        localPath: '/content/{locale}/docs/frameworks/specifications/zof/zof-workflow-schema.yaml'
      }],
      'state-transition': [{
        framework: 'zof',
        type: 'state-transition',
        version: '1.0.0',
        filename: 'zof-state-transition-schema.yaml',
        title: 'ZOF State Transition Schema',
        description: 'Schema para transições de estado do ZOF',
        url: `${baseSchemaUrl}/zof/state-transition/1.0.0`,
        localPath: '/content/{locale}/docs/frameworks/specifications/zof/zof-state-transition-schema.yaml'
      }],
      'enrichment-evaluation': [{
        framework: 'zof',
        type: 'enrichment-evaluation',
        version: '1.0.0',
        filename: 'zof-enrichment-evaluation-schema.yaml',
        title: 'ZOF Enrichment Evaluation Schema',
        description: 'Schema para avaliação de enriquecimento do ZOF',
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
        description: 'Schema para arquétipos do OIF',
        url: `${baseSchemaUrl}/oif/archetype/1.0.0`,
        localPath: '/content/{locale}/docs/frameworks/specifications/oif/oif-archetype-schema.yaml'
      }],
      'arbitration-explanation': [{
        framework: 'oif',
        type: 'arbitration-explanation',
        version: '1.0.0',
        filename: 'oif-arbitration-explanation-schema.yaml',
        title: 'OIF Arbitration Explanation Schema',
        description: 'Schema para explicações de arbitragem do OIF',
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
        description: 'Schema para registros de decisão do MAL',
        url: `${baseSchemaUrl}/mal/decision-record/1.0.0`,
        localPath: '/content/{locale}/docs/frameworks/specifications/mal/mal-decision-record-schema.yaml'
      }],
      'arbitration-event': [{
        framework: 'mal',
        type: 'arbitration-event',
        version: '1.0.0',
        filename: 'mal-arbitration-event-schema.yaml',
        title: 'MAL Arbitration Event Schema',
        description: 'Schema para eventos de arbitragem do MAL',
        url: `${baseSchemaUrl}/mal/arbitration-event/1.0.0`,
        localPath: '/content/{locale}/docs/frameworks/specifications/mal/mal-arbitration-event-schema.yaml'
      }]
    }
  }

  /**
   * Obter schema específico por framework, tipo e versão
   */
  const getSchema = (framework: string, type: string, version = '1.0.0'): SchemaMetadata | null => {
    const schemas = schemaRegistry[framework]?.[type]
    if (!schemas) return null
    
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

  return {
    // Data
    schemaRegistry,
    
    // Getters
    getSchema,
    getFrameworkSchemas,
    getAllSchemas,
    getAvailableFrameworks,
    getFrameworkTypes,
    
    // URL utilities
    getSchemaApiUrl,
    getSchemaCanonicalUrl,
    parseSchemaUrl,
    
    // Validation
    schemaExists,
    isValidSchemaUrl
  }
}