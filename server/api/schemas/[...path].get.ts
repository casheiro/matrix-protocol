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
    
    // Carregar registry para determinar filename
    const registryPath = join(process.cwd(), 'content', 'schema-registry.json')
    let registry: any
    
    try {
      const registryContent = await readFile(registryPath, 'utf-8')
      registry = JSON.parse(registryContent)
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Schema registry not found'
      })
    }

    const schemaInfo = registry.frameworks?.[framework]?.schemas?.[type]
    if (!schemaInfo) {
      throw createError({
        statusCode: 404,
        statusMessage: `Schema not found: ${framework}/${type}`
      })
    }

    const fileName = schemaInfo.filename
    
    // Verificar se a versão existe
    const versionInfo = schemaInfo.versions?.[version]
    if (!versionInfo) {
      // Se versão não especificada ou não existe, usar a latest
      const latestVersion = Object.entries(schemaInfo.versions || {})
        .find(([_, v]: [string, any]) => v.isLatest)?.[0]
      
      if (!latestVersion) {
        throw createError({
          statusCode: 404,
          statusMessage: `No versions found for schema: ${framework}/${type}`
        })
      }
      
      // Usar versão latest se não especificada
      if (!version || version === 'latest') {
        version = latestVersion
      } else {
        throw createError({
          statusCode: 404,
          statusMessage: `Version ${version} not found for schema: ${framework}/${type}`
        })
      }
    }

    // Tentar diferentes caminhos para localizar o arquivo na nova estrutura
    let yamlContent: string | null = null
    
    // Em produção, primeiro tentar o caminho de build  
    const buildPath = join(
      process.cwd(),
      '..',
      'content',
      'en',
      'docs',
      'frameworks',
      'specifications',
      framework,
      type,
      version,
      fileName
    )
    
    // Em desenvolvimento, usar o caminho normal
    const devPath = join(
      process.cwd(),
      'content',
      'en',
      'docs',
      'frameworks',
      'specifications',
      framework,
      type,
      version,
      fileName
    )
    
    try {
      yamlContent = await readFile(buildPath, 'utf-8')
    } catch {
      try {
        yamlContent = await readFile(devPath, 'utf-8')
      } catch (error) {
        throw createError({
          statusCode: 404,
          statusMessage: `Schema file not found: ${framework}/${type}/${version}`
        })
      }
    }
    
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
    // Detectar se é acesso direto do navegador vs programático
    const userAgent = getHeader(event, 'user-agent') || ''
    const acceptHeader = getHeader(event, 'accept') || ''
    const isBrowserRequest = 
      acceptHeader.includes('text/html') || 
      acceptHeader.includes('*/*') ||
      userAgent.includes('Mozilla')
    
    // Para navegadores, configurar para exibição inline
    if (isBrowserRequest) {
      setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
      setHeader(event, 'Content-Disposition', 'inline')
      // Headers anti-cache para desenvolvimento
      setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate')
      setHeader(event, 'Pragma', 'no-cache')
      setHeader(event, 'Expires', '0')
    } else {
      // Para requests programáticos, manter comportamento original
      setHeader(event, 'Content-Type', 'application/x-yaml')
      setHeader(event, 'Cache-Control', 'public, max-age=3600') // Cache por 1 hora
    }
    
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