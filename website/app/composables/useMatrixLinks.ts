interface LinkMapping {
  type: 'framework' | 'page' | 'download' | 'external'
  slug?: string
  path?: string
  url?: string
  filename?: string
}

interface MatrixLinkMappings {
  [key: string]: LinkMapping
}

/**
 * Composable para gerenciar links inteligentes do Matrix Protocol
 * Resolve links internos automaticamente considerando i18n e estrutura do site
 */
export const useMatrixLinks = () => {
  const { $i18n } = useNuxtApp()
  const localePath = useLocalePath()

  // Mapeamento centralizado de todos os links do Matrix Protocol
  const linkMappings: MatrixLinkMappings = {
    // Frameworks
    mef: {
      type: 'framework',
      slug: 'mef'
    },
    'matrix-embedding-framework': {
      type: 'framework', 
      slug: 'mef'
    },
    'MEF_MATRIX_EMBEDDING_FRAMEWORK': {
      type: 'framework',
      slug: 'mef'
    },
    
    zof: {
      type: 'framework',
      slug: 'zof'
    },
    'zion-orchestration-framework': {
      type: 'framework',
      slug: 'zof'
    },
    'ZOF_ZION_ORCHESTRATION_FRAMEWORK': {
      type: 'framework',
      slug: 'zof'
    },
    
    oif: {
      type: 'framework',
      slug: 'oif'
    },
    'operator-intelligence-framework': {
      type: 'framework',
      slug: 'oif'
    },
    'OIF_OPERATOR_INTELLIGENCE_FRAMEWORK': {
      type: 'framework',
      slug: 'oif'
    },
    
    moc: {
      type: 'framework',
      slug: 'moc'
    },
    'matrix-ontology-catalog': {
      type: 'framework',
      slug: 'moc'
    },
    'MOC_MATRIX_ONTOLOGY_CATALOG': {
      type: 'framework',
      slug: 'moc'
    },
    
    mal: {
      type: 'framework',
      slug: 'mal'
    },
    'matrix-arbiter-layer': {
      type: 'framework',
      slug: 'mal'
    },
    'MAL_MATRIX_ARBITER_LAYER': {
      type: 'framework',
      slug: 'mal'
    },

    // MEP (Manifesto)
    mep: {
      type: 'page',
      slug: 'mep'
    },
    'matrix-epistemic-principle': {
      type: 'page',
      slug: 'mep'
    },
    'MEP_MATRIX_EPISTEMIC_PRINCIPLE': {
      type: 'page',
      slug: 'mep'
    },

    // Páginas principais
    protocol: {
      type: 'page',
      slug: 'protocol'
    },
    integration: {
      type: 'page', 
      slug: 'integration'
    },
    glossary: {
      type: 'page',
      slug: 'glossary'
    },
    quickstart: {
      type: 'page',
      slug: 'quickstart'
    },
    implementation: {
      type: 'page',
      slug: 'implementation'
    },
    resources: {
      type: 'page',
      slug: 'resources'
    },

    // Downloads - Templates principais (existentes)
    'moc-starter-template': {
      type: 'download',
      path: 'quick-start/MOC_STARTER_TEMPLATE.yaml',
      filename: 'MOC_STARTER_TEMPLATE.yaml'
    },
    'moc-starter-template-pt': {
      type: 'download',
      path: 'quick-start/MOC_STARTER_TEMPLATE_PT.yaml',
      filename: 'MOC_STARTER_TEMPLATE_PT.yaml'
    },

    // Downloads - Template unificado (normativo)
    'moc-unified-structure': {
      type: 'download',
      path: 'templates/MOC_UNIFIED_STRUCTURE.yaml',
      filename: 'MOC_UNIFIED_STRUCTURE.yaml'
    },

    // Downloads - Templates organizacionais por tamanho
    'moc-startup': {
      type: 'download',
      path: 'templates/MOC_STARTUP.yaml',
      filename: 'MOC_STARTUP.yaml'
    },
    'moc-scaleup': {
      type: 'download',
      path: 'templates/MOC_SCALEUP.yaml',
      filename: 'MOC_SCALEUP.yaml'
    },
    'moc-enterprise': {
      type: 'download',
      path: 'templates/MOC_ENTERPRISE.yaml',
      filename: 'MOC_ENTERPRISE.yaml'
    },
    'moc-corporation': {
      type: 'download',
      path: 'templates/MOC_CORPORATION.yaml',
      filename: 'MOC_CORPORATION.yaml'
    },

    // Downloads - Guias de implementação (language-aware)
    'implementation-guide': {
      type: 'download',
      path: 'MATRIX_PROTOCOL_IMPLEMENTATION_GUIDE_PT.md', // PT default
      filename: 'MATRIX_PROTOCOL_IMPLEMENTATION_GUIDE.md'
    },

    // Downloads - Casos de uso
    'techcorp-case-study': {
      type: 'download',
      path: 'reference/techcorp-case-study.md',
      filename: 'techcorp-case-study.md'
    },
    'techcorp-case-study-en': {
      type: 'download',
      path: 'reference/techcorp-case-study-en.md',
      filename: 'techcorp-case-study-en.md'
    },

    // Downloads - Ferramentas
    'validation-checklists': {
      type: 'download',
      path: 'tools/validation-checklists.md',
      filename: 'validation-checklists.md'
    },
    'validation-checklists-pt': {
      type: 'download',
      path: 'tools/validation-checklists.md',
      filename: 'validation-checklists.md'
    },

    // Templates UKI - Business Rules
    'uki-discount-logic': {
      type: 'download',
      path: 'uki/business-rules/uki-pay-discount-logic-001.yaml',
      filename: 'uki-pay-discount-logic-001.yaml'
    },
    'uki-refund-policy': {
      type: 'download',
      path: 'uki/business-rules/uki-pay-refund-policy-002.yaml',
      filename: 'uki-pay-refund-policy-002.yaml'
    },
    'uki-fraud-thresholds': {
      type: 'download',
      path: 'uki/business-rules/uki-pay-fraud-thresholds-003.yaml',
      filename: 'uki-pay-fraud-thresholds-003.yaml'
    },
    'uki-currency-rates': {
      type: 'download',
      path: 'uki/business-rules/uki-pay-currency-rates-004.yaml',
      filename: 'uki-pay-currency-rates-004.yaml'
    },
    'uki-fee-calculation': {
      type: 'download',
      path: 'uki/business-rules/uki-pay-fee-calculation-005.yaml',
      filename: 'uki-pay-fee-calculation-005.yaml'
    },
    'uki-chargeback-rules': {
      type: 'download',
      path: 'uki/business-rules/uki-pay-chargeback-rules-006.yaml',
      filename: 'uki-pay-chargeback-rules-006.yaml'
    },

    // Templates UKI - Technical Patterns
    'uki-gateway-integration': {
      type: 'download',
      path: 'uki/technical-patterns/uki-pay-gateway-integration-007.yaml',
      filename: 'uki-pay-gateway-integration-007.yaml'
    },
    'uki-retry-strategy': {
      type: 'download',
      path: 'uki/technical-patterns/uki-pay-retry-strategy-008.yaml',
      filename: 'uki-pay-retry-strategy-008.yaml'
    },
    'uki-webhook-handling': {
      type: 'download',
      path: 'uki/technical-patterns/uki-pay-webhook-handling-009.yaml',
      filename: 'uki-pay-webhook-handling-009.yaml'
    },
    'uki-security-headers': {
      type: 'download',
      path: 'uki/technical-patterns/uki-pay-security-headers-010.yaml',
      filename: 'uki-pay-security-headers-010.yaml'
    },
    'uki-idempotency-keys': {
      type: 'download',
      path: 'uki/technical-patterns/uki-pay-idempotency-keys-011.yaml',
      filename: 'uki-pay-idempotency-keys-011.yaml'
    },
    'uki-error-handling': {
      type: 'download',
      path: 'uki/technical-patterns/uki-pay-error-handling-012.yaml',
      filename: 'uki-pay-error-handling-012.yaml'
    },

    // Templates UKI - Procedures
    'uki-pci-compliance': {
      type: 'download',
      path: 'uki/procedures/uki-pay-pci-compliance-013.yaml',
      filename: 'uki-pay-pci-compliance-013.yaml'
    },
    'uki-incident-response': {
      type: 'download',
      path: 'uki/procedures/uki-pay-incident-response-014.yaml',
      filename: 'uki-pay-incident-response-014.yaml'
    },
    'uki-deployment-process': {
      type: 'download',
      path: 'uki/procedures/uki-pay-deployment-process-015.yaml',
      filename: 'uki-pay-deployment-process-015.yaml'
    },
    'uki-monitoring-alerts': {
      type: 'download',
      path: 'uki/procedures/uki-pay-monitoring-alerts-016.yaml',
      filename: 'uki-pay-monitoring-alerts-016.yaml'
    },
    'uki-performance-optimization': {
      type: 'download',
      path: 'uki/procedures/uki-pay-performance-optimization-017.yaml',
      filename: 'uki-pay-performance-optimization-017.yaml'
    },


    // Pacotes ZIP de templates UKI
    'basic-templates': {
      type: 'download',
      path: 'frameworks/mef/basic-templates.zip',
      filename: 'mef-basic-templates.zip'
    },
    'advanced-templates': {
      type: 'download',
      path: 'frameworks/mef/advanced-templates.zip',
      filename: 'mef-advanced-templates.zip'
    },
    'all-uki-templates': {
      type: 'download',
      path: 'frameworks/mef/all-uki-templates.zip',
      filename: 'all-uki-templates.zip'
    },
    'business-rules-templates': {
      type: 'download',
      path: 'frameworks/mef/business-rules-templates.zip',
      filename: 'business-rules-templates.zip'
    },
    'technical-patterns-templates': {
      type: 'download',
      path: 'frameworks/mef/technical-patterns-templates.zip',
      filename: 'technical-patterns-templates.zip'
    },
    'procedures-templates': {
      type: 'download',
      path: 'frameworks/mef/procedures-templates.zip',
      filename: 'procedures-templates.zip'
    }
  }

  /**
   * Resolve um link baseado na chave do mapeamento
   */
  const resolveLink = (key: string, options: { locale?: string, absolute?: boolean } = {}): string => {
    const mapping = linkMappings[key]
    
    if (!mapping) {
      console.warn(`MatrixLinks: Unknown link key "${key}"`)
      return '#'
    }

    const locale = options.locale || $i18n.locale.value

    switch (mapping.type) {
      case 'framework':
        return localePath(`/frameworks/${mapping.slug}`)
        
      case 'page':
        return localePath(`/${mapping.slug}`)
        
      case 'download': {
        const downloadInfo = resolveDownload(key)
        return downloadInfo ? downloadInfo.url : `/downloads/${locale}/${mapping.path}`
      }
        
      case 'external':
        return mapping.url || '#'
        
      default:
        return '#'
    }
  }

  /**
   * Resolve um link de download com informações completas
   * Considera a linguagem atual para arquivos localizados
   */
  const resolveDownload = (key: string) => {
    const mapping = linkMappings[key]
    
    if (!mapping || mapping.type !== 'download') {
      console.warn(`MatrixLinks: "${key}" is not a valid download link`)
      return null
    }

    const locale = $i18n.locale.value
    
    // Arquivos compartilhados (ZIPs) que não dependem da linguagem
    const sharedFiles = [
      'frameworks/mef/basic-templates.zip',
      'frameworks/mef/advanced-templates.zip',
      'frameworks/mef/all-uki-templates.zip',
      'frameworks/mef/business-rules-templates.zip',
      'frameworks/mef/technical-patterns-templates.zip',
      'frameworks/mef/procedures-templates.zip'
    ]
    
    let url: string
    let filename: string
    let actualPath: string
    
    // Verifica se é um arquivo compartilhado
    if (mapping.path && sharedFiles.some(sharedPath => mapping.path?.includes(sharedPath))) {
      url = `/downloads/shared/${mapping.path}`
      actualPath = mapping.path
      filename = mapping.filename || mapping.path?.split('/').pop() || 'download'
    } else {
      // Para arquivos localizados, adapta o caminho e nome conforme idioma
      if (key === 'implementation-guide') {
        // Caso especial para guia de implementação
        actualPath = locale === 'pt' ? 'MATRIX_PROTOCOL_IMPLEMENTATION_GUIDE_PT.md' : 'MATRIX_PROTOCOL_IMPLEMENTATION_GUIDE_EN.md'
        filename = `MATRIX_PROTOCOL_IMPLEMENTATION_GUIDE_${locale.toUpperCase()}.md`
      } else {
        actualPath = mapping.path || 'download'
        filename = mapping.filename || mapping.path?.split('/').pop() || 'download'
      }
      
      url = `/downloads/${locale}/${actualPath}`
    }

    return {
      url,
      filename,
      path: actualPath,
      locale
    }
  }

  /**
   * Verifica se uma chave de link existe no mapeamento
   */
  const hasLink = (key: string): boolean => {
    return key in linkMappings
  }

  /**
   * Obtém informações completas sobre um link
   */
  const getLinkInfo = (key: string) => {
    const mapping = linkMappings[key]
    
    if (!mapping) {
      return null
    }

    return {
      ...mapping,
      key,
      resolvedUrl: resolveLink(key)
    }
  }

  /**
   * Lista todos os links disponíveis por tipo
   */
  const getLinksByType = (type: LinkMapping['type']) => {
    return Object.entries(linkMappings)
      .filter(([, mapping]) => mapping.type === type)
      .map(([key, mapping]) => ({
        key,
        ...mapping,
        resolvedUrl: resolveLink(key)
      }))
  }

  return {
    resolveLink,
    resolveDownload,
    hasLink,
    getLinkInfo,
    getLinksByType,
    linkMappings: readonly(linkMappings)
  }
}