/**
 * Navigation Tree API Endpoint
 * 
 * GET /api/navigation/tree
 * Returns complete navigation tree for specified locale
 * 
 * @author Alex Santos (Tech Lead)
 * @created 2025-10-15
 * @task TASK-2.3
 */

import { contentDiscovery } from '~/server/services/contentDiscovery'
import { navigationCache } from '~/server/services/cacheManager'
import type { NavigationTreeResponse } from '~/server/types/navigation'

export default defineEventHandler(async (event) => {
  const startTime = Date.now()

  try {
    // Parse query parameters
    const query = getQuery(event)
    const locale = (query.locale as string) || 'pt'
    const depth = query.depth ? parseInt(query.depth as string) : undefined
    const enableCache = query.cache !== 'false'

    // Validate locale
    if (!['pt', 'en'].includes(locale)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid locale. Supported locales: pt, en'
      })
    }

    // Validate depth
    if (depth !== undefined && (depth < 0 || depth > 10)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid depth. Must be between 0 and 10'
      })
    }

    // Check cache first (if enabled)
    let tree
    let cached = false
    
    if (enableCache) {
      const cacheKey = `navigation_tree_${locale}_${depth || 'full'}`
      tree = navigationCache.get(cacheKey)
      
      if (tree) {
        cached = true
      }
    }

    // Get tree from service if not cached
    if (!tree) {
      tree = await contentDiscovery.getNavigationTree(locale, depth)
      
      // Cache the result (if caching enabled)
      if (enableCache) {
        const cacheKey = `navigation_tree_${locale}_${depth || 'full'}`
        navigationCache.set(cacheKey, tree, { ttl: 5 * 60 * 1000 }) // 5 minutes
      }
    }

    // Calculate response metadata
    const totalNodes = countNodes(tree)
    const maxDepth = calculateMaxDepth(tree)
    const responseTime = Date.now() - startTime

    // Set response headers
    setHeader(event, 'Content-Type', 'application/json')
    setHeader(event, 'Cache-Control', 'public, max-age=300') // 5 minutes
    setHeader(event, 'X-Response-Time', `${responseTime}ms`)
    setHeader(event, 'X-Total-Nodes', totalNodes.toString())
    setHeader(event, 'X-Max-Depth', maxDepth.toString())
    setHeader(event, 'X-Cached', cached.toString())

    // Prepare response
    const response: NavigationTreeResponse = {
      tree,
      locale,
      totalNodes,
      maxDepth,
      timestamp: Date.now(),
      cached
    }

    return response

  } catch (error) {
    console.error('Navigation tree API error:', error)
    
    // Handle specific errors
    if (error.statusCode) {
      throw error
    }

    // Generic server error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch navigation tree',
      data: {
        error: error.message,
        timestamp: Date.now()
      }
    })
  }
})

/**
 * Count total nodes in tree recursively
 */
function countNodes(nodes: any[]): number {
  return nodes.reduce((count, node) => {
    return count + 1 + (node.children ? countNodes(node.children) : 0)
  }, 0)
}

/**
 * Calculate maximum depth of tree
 */
function calculateMaxDepth(nodes: any[]): number {
  if (nodes.length === 0) return 0
  
  return Math.max(...nodes.map(node => 
    1 + (node.children ? calculateMaxDepth(node.children) : 0)
  ))
}