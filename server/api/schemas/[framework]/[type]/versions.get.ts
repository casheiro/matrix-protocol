import { readFile } from 'fs/promises'
import { join } from 'path'

/**
 * API Route para listar versões de um schema específico
 * GET /api/schemas/{framework}/{type}/versions
 */
export default defineEventHandler(async (event) => {
  const framework = getRouterParam(event, 'framework')
  const type = getRouterParam(event, 'type')
  
  if (!framework || !type) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Framework and type are required'
    })
  }
  
  try {
    const registryPath = join(process.cwd(), 'content', 'schema-registry.json')
    const registryContent = await readFile(registryPath, 'utf-8')
    const registry = JSON.parse(registryContent)
    
    const schemaInfo = registry.frameworks?.[framework]?.schemas?.[type]
    if (!schemaInfo) {
      throw createError({
        statusCode: 404,
        statusMessage: `Schema not found: ${framework}/${type}`
      })
    }
    
    // Transformar versões em array ordenado
    const versions = Object.entries(schemaInfo.versions || {})
      .map(([version, info]: [string, any]) => ({
        version,
        ...info,
        framework,
        type,
        title: schemaInfo.title,
        description: schemaInfo.description,
        filename: schemaInfo.filename,
        category: schemaInfo.category
      }))
      .sort((a, b) => {
        // Latest primeiro
        if (a.isLatest) return -1
        if (b.isLatest) return 1
        
        // Depois por data de release
        if (a.releaseDate && b.releaseDate) {
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        }
        
        // Fallback para ordem de versão
        return b.version.localeCompare(a.version, undefined, { numeric: true })
      })
    
    // Configurar headers
    setHeader(event, 'Content-Type', 'application/json')
    setHeader(event, 'Cache-Control', 'public, max-age=300') // Cache por 5 minutos
    setHeader(event, 'Access-Control-Allow-Origin', '*')
    setHeader(event, 'Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
    
    return {
      framework,
      type,
      schema: {
        title: schemaInfo.title,
        description: schemaInfo.description,
        category: schemaInfo.category
      },
      versions,
      metadata: {
        totalVersions: versions.length,
        latestVersion: versions.find(v => v.isLatest)?.version,
        statusBreakdown: versions.reduce((acc, v) => {
          acc[v.status] = (acc[v.status] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      }
    }
    
  } catch (error: any) {
    console.error('Versions loading error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    if (error.code === 'ENOENT') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Schema registry not found'
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error while loading versions'
    })
  }
})