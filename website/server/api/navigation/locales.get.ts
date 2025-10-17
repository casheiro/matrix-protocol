/**
 * Locales API Endpoint
 * 
 * GET /api/navigation/locales
 * Returns available locales for navigation
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

  try {
    // Parse query parameters
    const query = getQuery(event)
    const enableCache = query.cache !== 'false'

    // Check cache first (if enabled)
    let availableLocales
    let cached = false
    
    if (enableCache) {
      availableLocales = navigationCache.getAvailableLocales()
      if (availableLocales) {
        cached = true
      }
    }

    // Get locales from service if not cached
    if (!availableLocales) {
      availableLocales = await contentDiscovery.getAvailableLocales()
      
      // Cache the result (if caching enabled)
      if (enableCache) {
        navigationCache.setAvailableLocales(availableLocales)
      }
    }

    // Get current locale from headers or default
    const acceptLanguage = getHeader(event, 'accept-language')
    let currentLocale = 'pt' // default
    
    if (acceptLanguage) {
      // Simple language detection
      if (acceptLanguage.includes('en')) {
        currentLocale = 'en'
      }
    }

    const responseTime = Date.now() - startTime

    // Set response headers
    setHeader(event, 'Content-Type', 'application/json')
    setHeader(event, 'Cache-Control', 'public, max-age=900') // 15 minutes
    setHeader(event, 'X-Response-Time', `${responseTime}ms`)
    setHeader(event, 'X-Available-Locales', availableLocales.length.toString())
    setHeader(event, 'X-Cached', cached.toString())

    // Prepare response
    const response: LocalesResponse = {
      available: availableLocales,
      default: 'pt',
      current: currentLocale,
      timestamp: Date.now()
    }

    return response

  } catch (error) {
    console.error('Locales API error:', error)
    
    // Generic server error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch available locales',
      data: {
        error: (error as Error).message,
        timestamp: Date.now()
      }
    })
  }
})