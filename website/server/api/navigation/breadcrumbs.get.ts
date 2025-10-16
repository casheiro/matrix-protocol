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

import { contentDiscovery } from '~/server/services/contentDiscovery'
import { navigationCache } from '~/server/services/cacheManager'
import type { BreadcrumbsResponse } from '~/server/types/navigation'

export default defineEventHandler(async (event) => {
  const startTime = Date.now()

  try {
    // Parse query parameters
    const query = getQuery(event)
    const path = query.path as string
    const locale = (query.locale as string) || 'pt'
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
    if (error.statusCode) {
      throw error
    }

    // Generic server error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch breadcrumbs',
      data: {
        error: error.message,
        path: query.path,
        locale: query.locale,
        timestamp: Date.now()
      }
    })
  }
})