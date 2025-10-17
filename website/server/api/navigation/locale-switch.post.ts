/**
 * Locale Switch API Endpoint
 * 
 * POST /api/navigation/locale-switch
 * Handles locale switching with content validation and URL mapping
 * 
 * @author Bruno Oliveira (Full-Stack Developer)
 * @created 2025-10-16
 * @task TASK-2.5
 */

import { contentDiscovery } from '../../services/contentDiscovery'

interface LocaleSwitchRequest {
  targetLocale: string
  currentPath: string
  preservePath?: boolean
}

interface LocaleSwitchResponse {
  success: boolean
  targetPath: string
  targetLocale: string
  pageExists: boolean
  alternativePaths?: string[]
  redirectType: 'exact' | 'fallback' | 'home'
  message?: string
}

export default defineEventHandler(async (event) => {
  const startTime = Date.now()

  try {
    // Parse request body
    const body = await readBody<LocaleSwitchRequest>(event)
    const { targetLocale, currentPath, preservePath = true } = body

    // Validate target locale
    const supportedLocales = ['pt', 'en']
    if (!supportedLocales.includes(targetLocale)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Unsupported locale',
        data: { 
          supportedLocales,
          received: targetLocale
        }
      })
    }

    // Validate current path
    if (!currentPath || typeof currentPath !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid current path'
      })
    }

    // Extract clean path (remove locale prefix)
    const cleanPath = currentPath.replace(/^\/[a-z]{2}(\/|$)/, '/').replace(/\/$/, '') || '/'

    let targetPath = `/${targetLocale}`
    let pageExists = false
    let redirectType: 'exact' | 'fallback' | 'home' = 'home'
    let alternativePaths: string[] = []

    if (preservePath && cleanPath !== '/') {
      try {
        // Check if exact page exists in target locale
        const navigationTree = await contentDiscovery.getNavigationTree(targetLocale as 'pt' | 'en')
        pageExists = await checkPageExistsInTree(navigationTree, cleanPath)

        if (pageExists) {
          targetPath = `/${targetLocale}${cleanPath}`
          redirectType = 'exact'
        } else {
          // Try to find similar pages
          alternativePaths = await findSimilarPages(navigationTree, cleanPath)
          
          if (alternativePaths.length > 0) {
            targetPath = `/${targetLocale}${alternativePaths[0]}`
            redirectType = 'fallback'
          } else {
            // Fallback to section home or site home
            const sectionPath = getSectionPath(cleanPath)
            if (sectionPath && await checkPageExistsInTree(navigationTree, sectionPath)) {
              targetPath = `/${targetLocale}${sectionPath}`
              redirectType = 'fallback'
            } else {
              targetPath = `/${targetLocale}`
              redirectType = 'home'
            }
          }
        }
      } catch (error) {
        console.warn(`Could not validate page existence for ${cleanPath} in ${targetLocale}:`, error)
        targetPath = `/${targetLocale}`
        redirectType = 'home'
      }
    }

    const responseTime = Date.now() - startTime

    // Set response headers
    setHeader(event, 'Content-Type', 'application/json')
    setHeader(event, 'X-Response-Time', `${responseTime}ms`)
    setHeader(event, 'Cache-Control', 'no-cache') // Locale switches should not be cached

    const response: LocaleSwitchResponse = {
      success: true,
      targetPath,
      targetLocale,
      pageExists,
      redirectType,
      ...(alternativePaths.length > 0 && { alternativePaths }),
      ...(redirectType !== 'exact' && { 
        message: getRedirectMessage(redirectType, targetLocale, cleanPath)
      })
    }

    return response

  } catch (error) {
    console.error('Locale switch API error:', error)
    
    const responseTime = Date.now() - startTime
    setHeader(event, 'X-Response-Time', `${responseTime}ms`)
    
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process locale switch',
      data: {
        error: (error as Error).message,
        timestamp: Date.now()
      }
    })
  }
})

/**
 * Check if a page exists in the navigation tree
 */
async function checkPageExistsInTree(tree: any[], path: string): Promise<boolean> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  
  function searchTree(nodes: any[]): boolean {
    for (const node of nodes) {
      if (node.path === normalizedPath) {
        return true
      }
      if (node.children && node.children.length > 0) {
        if (searchTree(node.children)) {
          return true
        }
      }
    }
    return false
  }
  
  return searchTree(tree)
}

/**
 * Find similar pages in the target locale
 */
async function findSimilarPages(tree: any[], targetPath: string): Promise<string[]> {
  const pathSegments = targetPath.split('/').filter(Boolean)
  const alternatives: string[] = []
  
  function searchSimilar(nodes: any[], currentDepth = 0): void {
    for (const node of nodes) {
      const nodeSegments = node.path.split('/').filter(Boolean)
      
      // Check for partial path matches
      if (nodeSegments.length >= pathSegments.length) {
        const similarity = calculatePathSimilarity(pathSegments, nodeSegments)
        if (similarity > 0.5) { // 50% similarity threshold
          alternatives.push(node.path)
        }
      }
      
      if (node.children && node.children.length > 0) {
        searchSimilar(node.children, currentDepth + 1)
      }
    }
  }
  
  searchSimilar(tree)
  
  // Sort by similarity score and return top matches
  return alternatives
    .sort((a, b) => {
      const scoreA = calculatePathSimilarity(pathSegments, a.split('/').filter(Boolean))
      const scoreB = calculatePathSimilarity(pathSegments, b.split('/').filter(Boolean))
      return scoreB - scoreA
    })
    .slice(0, 3) // Return top 3 alternatives
}

/**
 * Calculate similarity between two path arrays
 */
function calculatePathSimilarity(path1: string[], path2: string[]): number {
  const minLength = Math.min(path1.length, path2.length)
  let matches = 0
  
  for (let i = 0; i < minLength; i++) {
    if (path1[i] === path2[i]) {
      matches++
    }
  }
  
  return matches / Math.max(path1.length, path2.length)
}

/**
 * Get section path from full path
 */
function getSectionPath(fullPath: string): string | null {
  const segments = fullPath.split('/').filter(Boolean)
  
  if (segments.length >= 2) {
    return `/${segments[0]}/${segments[1]}`
  }
  
  if (segments.length === 1) {
    return `/${segments[0]}`
  }
  
  return null
}

/**
 * Get appropriate redirect message
 */
function getRedirectMessage(redirectType: string, locale: string, originalPath: string): string {
  const messages = {
    pt: {
      fallback: `Página similar encontrada. A página original "${originalPath}" não existe em português.`,
      home: `Redirecionado para a página inicial. A página "${originalPath}" não existe em português.`
    },
    en: {
      fallback: `Similar page found. The original page "${originalPath}" does not exist in English.`,
      home: `Redirected to home page. The page "${originalPath}" does not exist in English.`
    }
  }
  
  return messages[locale as keyof typeof messages]?.[redirectType as keyof typeof messages.pt] || 
         `Redirected due to content unavailability in ${locale}.`
}