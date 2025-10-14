import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

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
    
    // Construct full file path
    const fullPath = join(process.cwd(), 'content', locale, filePath.replace(/^\/docs/, 'docs'))
    
    // Check if file exists
    if (!existsSync(fullPath)) {
      throw createError({
        statusCode: 404,
        statusMessage: 'File not found'
      })
    }

    // Read file content
    const content = readFileSync(fullPath, 'utf-8')
    
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

    return {
      content,
      title,
      path: filePath,
      size: content.length
    }
  } catch (error) {
    console.error('Error reading file:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to read file'
    })
  }
})