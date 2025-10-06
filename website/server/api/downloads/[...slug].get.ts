import { existsSync, readFileSync, statSync } from 'fs'
import { join, resolve, extname } from 'path'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') as string

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'File path is required'
    })
  }

  // Construct path to docs/manual directory
  const docsManualPath = resolve(process.cwd(), '../docs/manual')
  const requestedFilePath = join(docsManualPath, slug)

  // Security check: ensure file is within docs/manual directory
  if (!requestedFilePath.startsWith(docsManualPath)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied'
    })
  }

  // Check if file exists
  if (!existsSync(requestedFilePath)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'File not found'
    })
  }

  const stat = statSync(requestedFilePath)
  
  // Only serve files, not directories
  if (!stat.isFile()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid file path'
    })
  }

  try {
    const fileContent = readFileSync(requestedFilePath)
    const extension = extname(requestedFilePath).toLowerCase()

    // Set appropriate content type based on file extension
    let contentType = 'application/octet-stream'
    
    switch (extension) {
      case '.md':
        contentType = 'text/markdown; charset=utf-8'
        break
      case '.yaml':
      case '.yml':
        contentType = 'application/x-yaml; charset=utf-8'
        break
      case '.json':
        contentType = 'application/json; charset=utf-8'
        break
      case '.txt':
        contentType = 'text/plain; charset=utf-8'
        break
      case '.pdf':
        contentType = 'application/pdf'
        break
    }

    // Set headers for download
    setHeader(event, 'Content-Type', contentType)
    setHeader(event, 'Content-Disposition', `attachment; filename="${slug.split('/').pop()}"`)
    setHeader(event, 'Content-Length', stat.size.toString())

    return fileContent
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error reading file'
    })
  }
})