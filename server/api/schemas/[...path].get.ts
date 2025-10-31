import { readFile } from 'fs/promises'
import { join } from 'path'
import { parse } from 'yaml'

/**
 * API Route para servir schemas YAML via HTTP
 * Mapeia URLs como https://matrix-protocol.org/schemas/mef/uki/1.0.0
 * para arquivos locais em content/{locale}/docs/frameworks/specifications/
 */
export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path') || ''
  const query = getQuery(event)
  const locale = (query.locale as string) || 'pt' // Default para português
  
  try {
    // Parse da URL path para extrair framework/type/version
    const pathParts = path.split('/')
    if (pathParts.length < 3) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid schema path. Expected format: framework/type/version'
      })
    }

    const [framework, type, version] = pathParts
    
    // Mapeamento de tipos de schema para nomes de arquivo
    const schemaFileMap: Record<string, Record<string, string>> = {
      mef: {
        'uki': 'mef-uki-schema.yaml',
        'decision-record': 'mef-decision-record-schema.yaml'
      },
      moc: {
        'hierarchy': 'moc-hierarchy-schema.yaml',
        'evaluation-criteria': 'moc-evaluation-criteria-schema.yaml',
        'arbitration-policies': 'moc-arbitration-policies-schema.yaml'
      },
      zof: {
        'workflow': 'zof-workflow-schema.yaml',
        'state-transition': 'zof-state-transition-schema.yaml',
        'enrichment-evaluation': 'zof-enrichment-evaluation-schema.yaml'
      },
      oif: {
        'archetype': 'oif-archetype-schema.yaml',
        'arbitration-explanation': 'oif-arbitration-explanation-schema.yaml'
      },
      mal: {
        'decision-record': 'mal-decision-record-schema.yaml',
        'arbitration-event': 'mal-arbitration-event-schema.yaml'
      }
    }

    const fileName = schemaFileMap[framework]?.[type]
    if (!fileName) {
      throw createError({
        statusCode: 404,
        statusMessage: `Schema not found: ${framework}/${type}`
      })
    }

    // Construir caminho para o arquivo
    const contentPath = join(
      process.cwd(),
      'content',
      locale,
      'docs',
      'frameworks',
      'specifications',
      framework,
      fileName
    )

    // Ler arquivo YAML
    const yamlContent = await readFile(contentPath, 'utf-8')
    
    // Validar se é um schema válido verificando campos obrigatórios
    try {
      const parsed = parse(yamlContent)
      if (!parsed.$id || !parsed.$schema) {
        throw new Error('Invalid schema format')
      }
      
      // Verificar se a versão solicitada corresponde à versão do arquivo
      if (parsed.$id && !parsed.$id.includes(version)) {
        console.warn(`Version mismatch: requested ${version}, file contains ${parsed.$id}`)
      }
    } catch (parseError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Invalid YAML schema format'
      })
    }

    // Configurar headers apropriados
    setHeader(event, 'Content-Type', 'application/x-yaml')
    setHeader(event, 'Cache-Control', 'public, max-age=3600') // Cache por 1 hora
    setHeader(event, 'Access-Control-Allow-Origin', '*')
    setHeader(event, 'Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
    
    // Adicionar headers informativos
    setHeader(event, 'X-Schema-Framework', framework)
    setHeader(event, 'X-Schema-Type', type)
    setHeader(event, 'X-Schema-Version', version)
    setHeader(event, 'X-Schema-Locale', locale)

    return yamlContent

  } catch (error: any) {
    console.error('Schema serving error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    if (error.code === 'ENOENT') {
      throw createError({
        statusCode: 404,
        statusMessage: `Schema file not found: ${path}`
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error while serving schema'
    })
  }
})