import { defineNuxtModule } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'

/**
 * Módulo Nuxt para transformar links problemáticos no conteúdo markdown
 * Intercepta o processamento do Nuxt Content e corrige links antes da renderização
 */
export default defineNuxtModule({
  meta: {
    name: 'link-transformer',
    configKey: 'linkTransformer'
  },
  
  setup(options, nuxt) {
    // Mapeamento completo de links problemáticos para rotas válidas
    const linkMappings: Record<string, string> = {
      // Frameworks - variações completas
      'MEF_MATRIX_EMBEDDING_FRAMEWORK.md': '/frameworks/mef',
      'MEF_MATRIX_EMBEDDING_FRAMEWORK': '/frameworks/mef',
      './MEF_MATRIX_EMBEDDING_FRAMEWORK.md': '/frameworks/mef',
      './MEF_MATRIX_EMBEDDING_FRAMEWORK': '/frameworks/mef',
      '../MEF_MATRIX_EMBEDDING_FRAMEWORK.md': '/frameworks/mef',
      '../MEF_MATRIX_EMBEDDING_FRAMEWORK': '/frameworks/mef',
      '/MEF_MATRIX_EMBEDDING_FRAMEWORK': '/frameworks/mef',
      '/pt/MEF_MATRIX_EMBEDDING_FRAMEWORK': '/frameworks/mef',
      '/en/MEF_MATRIX_EMBEDDING_FRAMEWORK': '/frameworks/mef',
      
      'ZOF_ZION_ORCHESTRATION_FRAMEWORK.md': '/frameworks/zof',
      'ZOF_ZION_ORCHESTRATION_FRAMEWORK': '/frameworks/zof',
      './ZOF_ZION_ORCHESTRATION_FRAMEWORK.md': '/frameworks/zof',
      './ZOF_ZION_ORCHESTRATION_FRAMEWORK': '/frameworks/zof',
      '../ZOF_ZION_ORCHESTRATION_FRAMEWORK.md': '/frameworks/zof',
      '../ZOF_ZION_ORCHESTRATION_FRAMEWORK': '/frameworks/zof',
      '/ZOF_ZION_ORCHESTRATION_FRAMEWORK': '/frameworks/zof',
      '/pt/ZOF_ZION_ORCHESTRATION_FRAMEWORK': '/frameworks/zof',
      '/en/ZOF_ZION_ORCHESTRATION_FRAMEWORK': '/frameworks/zof',
      
      'OIF_OPERATOR_INTELLIGENCE_FRAMEWORK.md': '/frameworks/oif',
      'OIF_OPERATOR_INTELLIGENCE_FRAMEWORK': '/frameworks/oif',
      './OIF_OPERATOR_INTELLIGENCE_FRAMEWORK.md': '/frameworks/oif',
      './OIF_OPERATOR_INTELLIGENCE_FRAMEWORK': '/frameworks/oif',
      '../OIF_OPERATOR_INTELLIGENCE_FRAMEWORK.md': '/frameworks/oif',
      '../OIF_OPERATOR_INTELLIGENCE_FRAMEWORK': '/frameworks/oif',
      '/OIF_OPERATOR_INTELLIGENCE_FRAMEWORK': '/frameworks/oif',
      '/pt/OIF_OPERATOR_INTELLIGENCE_FRAMEWORK': '/frameworks/oif',
      '/en/OIF_OPERATOR_INTELLIGENCE_FRAMEWORK': '/frameworks/oif',
      
      'MOC_MATRIX_ONTOLOGY_CATALOG.md': '/frameworks/moc',
      'MOC_MATRIX_ONTOLOGY_CATALOG': '/frameworks/moc',
      './MOC_MATRIX_ONTOLOGY_CATALOG.md': '/frameworks/moc',
      './MOC_MATRIX_ONTOLOGY_CATALOG': '/frameworks/moc',
      '../MOC_MATRIX_ONTOLOGY_CATALOG.md': '/frameworks/moc',
      '../MOC_MATRIX_ONTOLOGY_CATALOG': '/frameworks/moc',
      '/MOC_MATRIX_ONTOLOGY_CATALOG': '/frameworks/moc',
      '/pt/MOC_MATRIX_ONTOLOGY_CATALOG': '/frameworks/moc',
      '/en/MOC_MATRIX_ONTOLOGY_CATALOG': '/frameworks/moc',
      
      'MAL_MATRIX_ARBITER_LAYER.md': '/frameworks/mal',
      'MAL_MATRIX_ARBITER_LAYER': '/frameworks/mal',
      './MAL_MATRIX_ARBITER_LAYER.md': '/frameworks/mal',
      './MAL_MATRIX_ARBITER_LAYER': '/frameworks/mal',
      '../MAL_MATRIX_ARBITER_LAYER.md': '/frameworks/mal',
      '../MAL_MATRIX_ARBITER_LAYER': '/frameworks/mal',
      '/MAL_MATRIX_ARBITER_LAYER': '/frameworks/mal',
      '/pt/MAL_MATRIX_ARBITER_LAYER': '/frameworks/mal',
      '/en/MAL_MATRIX_ARBITER_LAYER': '/frameworks/mal',
      
      'MEP_MATRIX_EPISTEMIC_PRINCIPLE.md': '/mep',
      'MEP_MATRIX_EPISTEMIC_PRINCIPLE': '/mep',
      './MEP_MATRIX_EPISTEMIC_PRINCIPLE.md': '/mep',
      './MEP_MATRIX_EPISTEMIC_PRINCIPLE': '/mep',
      '../MEP_MATRIX_EPISTEMIC_PRINCIPLE.md': '/mep',
      '../MEP_MATRIX_EPISTEMIC_PRINCIPLE': '/mep',
      '/MEP_MATRIX_EPISTEMIC_PRINCIPLE': '/mep',
      '/pt/MEP_MATRIX_EPISTEMIC_PRINCIPLE': '/mep',
      '/en/MEP_MATRIX_EPISTEMIC_PRINCIPLE': '/mep',
      
      'MATRIX_PROTOCOL.md': '/protocol',
      'MATRIX_PROTOCOL': '/protocol',
      './MATRIX_PROTOCOL.md': '/protocol',
      './MATRIX_PROTOCOL': '/protocol',
      '../MATRIX_PROTOCOL.md': '/protocol',
      '../MATRIX_PROTOCOL': '/protocol',
      '/MATRIX_PROTOCOL': '/protocol',
      '/pt/MATRIX_PROTOCOL': '/protocol',
      '/en/MATRIX_PROTOCOL': '/protocol',
      
      // Templates MOC - mapeamento para downloads
      'templates/moc/startup.yaml': '/downloads/templates/MOC_STARTUP.yaml',
      './templates/moc/startup.yaml': '/downloads/templates/MOC_STARTUP.yaml',
      '../templates/moc/startup.yaml': '/downloads/templates/MOC_STARTUP.yaml',
      '/templates/moc/startup.yaml': '/downloads/templates/MOC_STARTUP.yaml',
      
      'templates/moc/enterprise.yaml': '/downloads/templates/MOC_ENTERPRISE.yaml',
      './templates/moc/enterprise.yaml': '/downloads/templates/MOC_ENTERPRISE.yaml',
      '../templates/moc/enterprise.yaml': '/downloads/templates/MOC_ENTERPRISE.yaml',
      '/templates/moc/enterprise.yaml': '/downloads/templates/MOC_ENTERPRISE.yaml',
      
      'templates/moc/scaleup.yaml': '/downloads/templates/MOC_SCALEUP.yaml',
      './templates/moc/scaleup.yaml': '/downloads/templates/MOC_SCALEUP.yaml',
      '../templates/moc/scaleup.yaml': '/downloads/templates/MOC_SCALEUP.yaml',
      '/templates/moc/scaleup.yaml': '/downloads/templates/MOC_SCALEUP.yaml',
      
      'templates/moc/corporation.yaml': '/downloads/templates/MOC_CORPORATION.yaml',
      './templates/moc/corporation.yaml': '/downloads/templates/MOC_CORPORATION.yaml',
      '../templates/moc/corporation.yaml': '/downloads/templates/MOC_CORPORATION.yaml',
      '/templates/moc/corporation.yaml': '/downloads/templates/MOC_CORPORATION.yaml',
      
      'templates/moc/basic-template.yaml': '/downloads/templates/MOC_BASIC_TEMPLATE.yaml',
      './templates/moc/basic-template.yaml': '/downloads/templates/MOC_BASIC_TEMPLATE.yaml',
      '../templates/moc/basic-template.yaml': '/downloads/templates/MOC_BASIC_TEMPLATE.yaml',
      '/templates/moc/basic-template.yaml': '/downloads/templates/MOC_BASIC_TEMPLATE.yaml'
    }

    // Hook para o Nuxt Content - intercepta ANTES do processamento
    nuxt.hook('content:context', (contentContext) => {
      // Adiciona transformador no início da lista para executar primeiro
      contentContext.transformers.unshift({
        name: 'matrix-link-transformer',
        extensions: ['.md'],
        transform(content: any) {
          let transformedContent = content
          let transformCount = 0

          // Função melhorada para transformar links
          const transformLinks = (text: string): string => {
            // Regex para links markdown [text](url) incluindo anchors
            let result = text.replace(
              /\[([^\]]+)\]\(([^)]+)\)/g,
              (match, linkText, linkUrl) => {
                // Separa anchor se existir
                const [baseUrl, anchor] = linkUrl.split('#')
                
                // Verifica mapeamento exato primeiro
                if (linkMappings[baseUrl]) {
                  transformCount++
                  const newUrl = anchor ? `${linkMappings[baseUrl]}#${anchor}` : linkMappings[baseUrl]
                  console.log(`[Link Transformer] ${baseUrl} → ${newUrl}`)
                  return `[${linkText}](${newUrl})`
                }
                
                // Verifica se termina com algum padrão conhecido
                for (const [pattern, replacement] of Object.entries(linkMappings)) {
                  if (baseUrl.endsWith(pattern) || baseUrl.includes(pattern)) {
                    transformCount++
                    const newUrl = anchor ? `${replacement}#${anchor}` : replacement
                    console.log(`[Link Transformer] ${baseUrl} → ${newUrl} (pattern match)`)
                    return `[${linkText}](${newUrl})`
                  }
                }
                
                return match
              }
            )

            // Também trata links HTML <a href="...">
            result = result.replace(
              /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/g,
              (match, href) => {
                const [baseUrl, anchor] = href.split('#')
                
                if (linkMappings[baseUrl]) {
                  transformCount++
                  const newUrl = anchor ? `${linkMappings[baseUrl]}#${anchor}` : linkMappings[baseUrl]
                  console.log(`[Link Transformer] HTML: ${baseUrl} → ${newUrl}`)
                  return match.replace(href, newUrl)
                }
                
                return match
              }
            )

            return result
          }

          // Transforma o conteúdo
          if (typeof transformedContent === 'string') {
            transformedContent = transformLinks(transformedContent)
          } else if (transformedContent && typeof transformedContent.body === 'string') {
            transformedContent.body = transformLinks(transformedContent.body)
          }

          if (transformCount > 0) {
            console.log(`[Link Transformer] Transformed ${transformCount} links in content`)
          }

          return transformedContent
        }
      })
    })

    console.log('[Link Transformer Module] Registered - comprehensive link transformation enabled')
  }
})