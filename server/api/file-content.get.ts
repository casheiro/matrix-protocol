export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const filePath = query.path as string
  
  if (!filePath) {
    throw createError({
      statusCode: 400,
      statusMessage: 'File path is required'
    })
  }

  // Security: only allow files within content directory
  if (filePath.includes('..') || !filePath.startsWith('/docs/')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied'
    })
  }

  try {
    // Get current locale from query or default to 'pt'
    const locale = (query.locale as string) || 'pt'
    
    // Get file extension to determine handling method
    const fileExtension = filePath.split('.').pop()?.toLowerCase() || ''
    
    // Read directly from filesystem
    const { readFileSync, existsSync } = await import('fs')
    const { join } = await import('path')
    
    // Path deve sempre começar com /docs/, então simplesmente remover a barra inicial
    let normalizedPath = filePath.substring(1) // Remove primeira barra: /docs/... -> docs/...
    
    const possiblePaths = [
      // Produção - primeiro tentar o caminho de build (mesmo padrão da API schemas)
      join(process.cwd(), '..', 'content', locale, normalizedPath),
      // Desenvolvimento - usar o caminho normal
      join(process.cwd(), 'content', locale, normalizedPath),
      // Caminhos alternativos
      join(process.cwd(), '.output', 'content', locale, normalizedPath),
      join(process.cwd(), 'public', 'content', locale, normalizedPath),
      join('/app', 'content', locale, normalizedPath)
    ]
    
    let fullPath: string | null = null
    let content: string | null = null
    
    // Try each possible path
    for (const path of possiblePaths) {
      if (existsSync(path)) {
        fullPath = path
        content = readFileSync(path, 'utf-8')
        break
      }
    }
    
    if (!fullPath || content === null) {
      console.error(`File not found in any of the following paths:`, possiblePaths)
      throw createError({
        statusCode: 404,
        statusMessage: 'File not found'
      })
    }
    
    // Extract title from YAML files if possible
    let title = null
    if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
      try {
        // Simple regex to extract title from YAML
        const titleMatch = content.match(/^title:\s*["']?(.*?)["']?$/m)
        if (titleMatch) {
          title = titleMatch[1]
        }
      } catch (error) {
        // Ignore YAML parsing errors for title extraction
      }
    }

    const result = {
      content,
      title,
      path: filePath,
      size: content.length,
      type: fileExtension
    }
    
    return result
  } catch (error) {
    console.error('Error reading file:', error)
    
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to read file'
    })
  }
})