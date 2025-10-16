/**
 * Siblings API Endpoint
 * 
 * GET /api/navigation/siblings
 * Returns sibling pages for specified path and locale
 * 
 * @author Alex Santos (Tech Lead)
 * @created 2025-10-15
 * @task TASK-2.3
 */

import { contentDiscovery } from '~/server/services/contentDiscovery'
import { navigationCache } from '~/server/services/cacheManager'
import type { SiblingsResponse } from '~/server/types/navigation'

export default defineEventHandler(async (event) => {
  const startTime = Date.now()

  try {
    // Parse query parameters
    const query = getQuery(event)
    const path = query.path as string
    const locale = (query.locale as string) || 'pt'
    const limit = query.limit ? parseInt(query.limit as string) : undefined
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

    // Validate limit
    if (limit !== undefined && (limit < 0 || limit > 50)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid limit. Must be between 0 and 50'
      })
    }

    // Check cache first (if enabled)
    let siblings
    let cached = false
    
    if (enableCache) {
      siblings = navigationCache.getSiblings(path, locale)
      if (siblings) {
        cached = true
      }
    }

    // Get siblings from service if not cached
    if (!siblings) {
      siblings = await contentDiscovery.getSiblings(path, locale)
      
      // Cache the result (if caching enabled)
      if (enableCache) {
        navigationCache.setSiblings(path, locale, siblings)
      }
    }

    // Apply limit if specified
    const totalSiblings = siblings.length
    if (limit !== undefined) {
      siblings = siblings.slice(0, limit)
    }

    // Sort siblings by order if available, then alphabetically
    siblings.sort((a, b) => {
      const orderA = a.metadata.order ?? 999
      const orderB = b.metadata.order ?? 999
      
      if (orderA !== orderB) {
        return orderA - orderB
      }
      
      return a.title.localeCompare(b.title, locale)
    })

    const responseTime = Date.now() - startTime

    // Set response headers
    setHeader(event, 'Content-Type', 'application/json')
    setHeader(event, 'Cache-Control', 'public, max-age=300') // 5 minutes
    setHeader(event, 'X-Response-Time', `${responseTime}ms`)
    setHeader(event, 'X-Total-Siblings', totalSiblings.toString())
    setHeader(event, 'X-Returned-Siblings', siblings.length.toString())
    setHeader(event, 'X-Cached', cached.toString())

    // Prepare response
    const response: SiblingsResponse = {
      siblings,
      currentPath: path,
      locale,
      totalSiblings,
      timestamp: Date.now()
    }

    return response

  } catch (error) {
    console.error('Siblings API error:', error)
    
    // Handle specific errors
    if (error.statusCode) {
      throw error
    }

    // Generic server error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch siblings',
      data: {
        error: error.message,
        path: query.path,
        locale: query.locale,
        timestamp: Date.now()
      }
    })
  }
})