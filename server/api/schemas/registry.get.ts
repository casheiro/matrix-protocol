import { readFile } from 'fs/promises'
import { join } from 'path'

/**
 * API Route para retornar o schema registry completo
 * GET /api/schemas/registry
 */
export default defineEventHandler(async (event) => {
  try {
    const registryPath = join(process.cwd(), 'content', 'schema-registry.json')
    const registryContent = await readFile(registryPath, 'utf-8')
    const registry = JSON.parse(registryContent)
    
    // Configurar headers apropriados
    setHeader(event, 'Content-Type', 'application/json')
    setHeader(event, 'Cache-Control', 'public, max-age=300') // Cache por 5 minutos
    setHeader(event, 'Access-Control-Allow-Origin', '*')
    setHeader(event, 'Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
    
    return registry
    
  } catch (error: any) {
    console.error('Registry loading error:', error)
    
    if (error.code === 'ENOENT') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Schema registry not found'
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error while loading registry'
    })
  }
})