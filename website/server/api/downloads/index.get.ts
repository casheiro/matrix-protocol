import { readdirSync, statSync } from 'fs'
import { join, resolve, relative } from 'path'

interface DownloadFile {
  name: string
  path: string
  size: number
  modified: string
  type: string
  downloadUrl: string
}

function scanDirectory(dirPath: string, basePath: string): DownloadFile[] {
  const files: DownloadFile[] = []
  
  try {
    const items = readdirSync(dirPath)
    
    for (const item of items) {
      const fullPath = join(dirPath, item)
      const stat = statSync(fullPath)
      const relativePath = relative(basePath, fullPath)
      
      if (stat.isDirectory()) {
        // Recursively scan subdirectories
        files.push(...scanDirectory(fullPath, basePath))
      } else if (stat.isFile()) {
        // Add file to list
        const extension = item.split('.').pop()?.toLowerCase() || ''
        
        files.push({
          name: item,
          path: relativePath,
          size: stat.size,
          modified: stat.mtime.toISOString(),
          type: extension,
          downloadUrl: `/api/downloads/${relativePath}`
        })
      }
    }
  } catch (error) {
    console.error('Error scanning directory:', dirPath, error)
  }
  
  return files
}

export default defineEventHandler(async (event) => {
  try {
    // Construct path to docs/manual directory
    const docsManualPath = resolve(process.cwd(), '../docs/manual')
    
    // Scan directory for downloadable files
    const files = scanDirectory(docsManualPath, docsManualPath)
    
    // Sort files by name for consistent ordering
    files.sort((a, b) => a.name.localeCompare(b.name))
    
    return {
      success: true,
      files,
      total: files.length,
      generated: new Date().toISOString()
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error listing downloads'
    })
  }
})