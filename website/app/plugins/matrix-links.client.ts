/**
 * Plugin para transformação automática de links problemáticos nos markdowns
 * Intercepta links que causam router warnings e os transforma para rotas válidas
 */
export default defineNuxtPlugin(() => {
  const { resolveLink, hasLink } = useMatrixLinks()
  const { $i18n } = useNuxtApp()

  // Mapeamento de links problemáticos para chaves corretas
  const problematicLinkPatterns = {
    // Frameworks - padrões antigos para novos
    '/pt/MEF_MATRIX_EMBEDDING_FRAMEWORK': 'mef',
    '/MEF_MATRIX_EMBEDDING_FRAMEWORK': 'mef',
    '/en/MEF_MATRIX_EMBEDDING_FRAMEWORK': 'mef',
    'MEF_MATRIX_EMBEDDING_FRAMEWORK.md': 'mef',
    'MEF_MATRIX_EMBEDDING_FRAMEWORK': 'mef',
    
    '/pt/ZOF_ZION_ORCHESTRATION_FRAMEWORK': 'zof',
    '/ZOF_ZION_ORCHESTRATION_FRAMEWORK': 'zof',
    '/en/ZOF_ZION_ORCHESTRATION_FRAMEWORK': 'zof',
    'ZOF_ZION_ORCHESTRATION_FRAMEWORK.md': 'zof',
    'ZOF_ZION_ORCHESTRATION_FRAMEWORK': 'zof',
    
    '/pt/OIF_OPERATOR_INTELLIGENCE_FRAMEWORK': 'oif',
    '/OIF_OPERATOR_INTELLIGENCE_FRAMEWORK': 'oif',
    '/en/OIF_OPERATOR_INTELLIGENCE_FRAMEWORK': 'oif',
    'OIF_OPERATOR_INTELLIGENCE_FRAMEWORK.md': 'oif',
    'OIF_OPERATOR_INTELLIGENCE_FRAMEWORK': 'oif',
    
    '/pt/MOC_MATRIX_ONTOLOGY_CATALOG': 'moc',
    '/MOC_MATRIX_ONTOLOGY_CATALOG': 'moc',
    '/en/MOC_MATRIX_ONTOLOGY_CATALOG': 'moc',
    'MOC_MATRIX_ONTOLOGY_CATALOG.md': 'moc',
    'MOC_MATRIX_ONTOLOGY_CATALOG': 'moc',
    
    '/pt/MAL_MATRIX_ARBITER_LAYER': 'mal',
    '/MAL_MATRIX_ARBITER_LAYER': 'mal',
    '/en/MAL_MATRIX_ARBITER_LAYER': 'mal',
    'MAL_MATRIX_ARBITER_LAYER.md': 'mal',
    'MAL_MATRIX_ARBITER_LAYER': 'mal',
    
    '/pt/MEP_MATRIX_EPISTEMIC_PRINCIPLE': 'mep',
    '/MEP_MATRIX_EPISTEMIC_PRINCIPLE': 'mep',
    '/en/MEP_MATRIX_EPISTEMIC_PRINCIPLE': 'mep',
    'MEP_MATRIX_EPISTEMIC_PRINCIPLE.md': 'mep',
    'MEP_MATRIX_EPISTEMIC_PRINCIPLE': 'mep',

    // Downloads problemáticos
    '/downloads/quick-start/MOC_STARTER_TEMPLATE_PT.yaml': 'moc-starter-template-pt',
    '/downloads/templates/MOC_UNIFIED_STRUCTURE.yaml': 'moc-unified-structure',
    '../quick-start/MOC_STARTER_TEMPLATE_PT.yaml': 'moc-starter-template-pt',
    '../templates/MOC_UNIFIED_STRUCTURE.yaml': 'moc-unified-structure'
  }

  /**
   * Transforma um link problemático em uma rota válida
   */
  const transformProblematicLink = (href: string): string | null => {
    // Primeiro, tenta match exato
    if (problematicLinkPatterns[href]) {
      const key = problematicLinkPatterns[href]
      return resolveLink(key)
    }

    // Tenta match por padrões
    for (const [pattern, key] of Object.entries(problematicLinkPatterns)) {
      if (href.includes(pattern) || href.endsWith(pattern)) {
        return resolveLink(key)
      }
    }

    // Tenta extrair nome do framework de URLs longas
    const frameworkPatterns = [
      { pattern: /MEF_MATRIX_EMBEDDING_FRAMEWORK/i, key: 'mef' },
      { pattern: /ZOF_ZION_ORCHESTRATION_FRAMEWORK/i, key: 'zof' },
      { pattern: /OIF_OPERATOR_INTELLIGENCE_FRAMEWORK/i, key: 'oif' },
      { pattern: /MOC_MATRIX_ONTOLOGY_CATALOG/i, key: 'moc' },
      { pattern: /MAL_MATRIX_ARBITER_LAYER/i, key: 'mal' },
      { pattern: /MEP_MATRIX_EPISTEMIC_PRINCIPLE/i, key: 'mep' }
    ]

    for (const { pattern, key } of frameworkPatterns) {
      if (pattern.test(href)) {
        return resolveLink(key)
      }
    }

    return null
  }

  /**
   * Processa todos os links em um elemento DOM
   */
  const processLinksInElement = (element: Element) => {
    const links = element.querySelectorAll('a[href]')
    let transformedCount = 0

    links.forEach((link) => {
      const href = link.getAttribute('href')
      if (!href) return

      const transformedHref = transformProblematicLink(href)
      if (transformedHref) {
        link.setAttribute('href', transformedHref)
        transformedCount++
        
        // Log para debugging em desenvolvimento
        if (process.dev) {
          console.log(`MatrixLinks: Transformed "${href}" → "${transformedHref}"`)
        }
      }
    })

    return transformedCount
  }

  /**
   * Observer para detectar mudanças no DOM e processar novos links
   */
  const setupDOMObserver = () => {
    if (typeof window === 'undefined') return

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element
              
              // Processa o elemento adicionado
              if (element.tagName === 'A' && element.hasAttribute('href')) {
                const href = element.getAttribute('href')
                if (href) {
                  const transformedHref = transformProblematicLink(href)
                  if (transformedHref) {
                    element.setAttribute('href', transformedHref)
                    if (process.dev) {
                      console.log(`MatrixLinks: Transformed new link "${href}" → "${transformedHref}"`)
                    }
                  }
                }
              }
              
              // Processa links filhos
              processLinksInElement(element)
            }
          })
        }
      })
    })

    // Observa mudanças no body
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    // Processa links existentes ao inicializar
    const initialCount = processLinksInElement(document.body)
    if (process.dev && initialCount > 0) {
      console.log(`MatrixLinks: Transformed ${initialCount} existing problematic links`)
    }

    return observer
  }

  // Função para processar conteúdo de markdown renderizado
  const processMarkdownContent = () => {
    // Processa especificamente containers de conteúdo do Nuxt Content
    const contentContainers = document.querySelectorAll('.prose, .markdown-content, .framework-markdown-content, [data-content]')
    
    contentContainers.forEach(container => {
      processLinksInElement(container)
    })
  }

  // Hook para execução no cliente
  if (process.client) {
    // Processa conteúdo inicial quando a página carrega
    onMounted(() => {
      processMarkdownContent()
      setupDOMObserver()
    })

    // Processa novamente após mudanças de rota
    const router = useRouter()
    router.afterEach(() => {
      nextTick(() => {
        processMarkdownContent()
      })
    })

    // Processa quando o i18n muda de locale
    watch(() => $i18n.locale.value, () => {
      nextTick(() => {
        processMarkdownContent()
      })
    })
  }

  return {
    provide: {
      matrixLinks: {
        transformProblematicLink,
        processLinksInElement,
        processMarkdownContent
      }
    }
  }
})