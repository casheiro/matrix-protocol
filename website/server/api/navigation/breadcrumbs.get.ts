/**
 * Breadcrumbs API Endpoint
 * 
 * GET /api/navigation/breadcrumbs
 * Returns breadcrumb trail for specified path and locale
 * 
 * @author Alex Santos (Tech Lead)
 * @created 2025-10-15
 * @task TASK-2.3
 */

import { contentDiscovery } from '../../services/contentDiscovery'
import { navigationCache } from '../../services/cacheManager'
// Tipos auto-importados do shared/types/

export default defineEventHandler(async (event) => {
  const startTime = Date.now()
  
  // Parse query parameters outside try block for error handling access
  const query = getQuery(event)
  const path = query.path as string
  const localeParam = (query.locale as string) || "pt"
  const locale = isValidLocale(localeParam) ? localeParam : "pt"

  try {
    const enableCache = query.cache !== 'false'

    // Validate required parameters
    if (!path) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required parameter: path'
      })
    }

    // Validate locale
    if (!['pt', 'en'].includes(locale)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid locale. Supported locales: pt, en'
      })
    }

    // Validate path format
    if (!path.startsWith('/docs')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid path. Must start with /docs'
      })
    }

    // Check cache first (if enabled)
    let breadcrumbs
    let cached = false
    
    if (enableCache) {
      breadcrumbs = navigationCache.getBreadcrumbs(path, locale)
      if (breadcrumbs) {
        cached = true
      }
    }

    // Get breadcrumbs from service if not cached
    if (!breadcrumbs) {
      const breadcrumbNodes = await contentDiscovery.getBreadcrumbs(path, locale)
      
      // Transform to breadcrumb format
      breadcrumbs = breadcrumbNodes.map((node, index) => ({
        title: node.title,
        path: node.path,
        isLast: index === breadcrumbNodes.length - 1,
        icon: node.icon
      }))
      
      // Cache the result (if caching enabled)
      if (enableCache) {
        navigationCache.setBreadcrumbs(path, locale, breadcrumbs)
      }
    }

    const responseTime = Date.now() - startTime

    // Set response headers
    setHeader(event, 'Content-Type', 'application/json')
    setHeader(event, 'Cache-Control', 'public, max-age=600') // 10 minutes
    setHeader(event, 'X-Response-Time', `${responseTime}ms`)
    setHeader(event, 'X-Breadcrumb-Count', breadcrumbs.length.toString())
    setHeader(event, 'X-Cached', cached.toString())

    // Prepare response
    const response: BreadcrumbsResponse = {
      breadcrumbs,
      currentPath: path,
      locale,
      timestamp: Date.now()
    }

    return response

  } catch (error) {
    console.error('Breadcrumbs API error:', error)
    
    // Handle specific errors
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    // Generic server error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch breadcrumbs',
      data: {
        error: error instanceof Error ? error.message : 'Unknown error',
        path: path,
        locale: locale,
        timestamp: Date.now()
      }
    })
  }
})