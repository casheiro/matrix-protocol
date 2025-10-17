/**
 * Navigation Stats API Endpoint
 * 
 * GET /api/navigation/stats
 * Returns navigation system statistics and health metrics
 * 
 * @author Alex Santos (Tech Lead)
 * @created 2025-10-15
 * @task TASK-2.3
 */

import { contentDiscovery } from '../../services/contentDiscovery'
import { navigationCache } from '../../services/cacheManager'

export default defineEventHandler(async (event) => {
  const startTime = Date.now()

  try {
    // Parse query parameters
    const query = getQuery(event)
    const localeParam = (query.locale as string) || "pt"
    const locale = isValidLocale(localeParam) ? localeParam : "pt"
    const includeCache = query.cache !== 'false'

    // Validate locale
    if (!['pt', 'en'].includes(locale)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid locale. Supported locales: pt, en'
      })
    }

    // Get navigation tree for stats
    const tree = await contentDiscovery.getNavigationTree(locale)
    const allLocales = await contentDiscovery.getAvailableLocales()

    // Calculate content statistics
    const contentStats = calculateContentStats(tree)
    
    // Get cache statistics (if requested)
    let cacheStats = null
    if (includeCache) {
      cacheStats = navigationCache.getHealthMetrics()
    }

    const responseTime = Date.now() - startTime

    // Set response headers
    setHeader(event, 'Content-Type', 'application/json')
    setHeader(event, 'Cache-Control', 'public, max-age=60') // 1 minute
    setHeader(event, 'X-Response-Time', `${responseTime}ms`)

    // Prepare response
    const response = {
      system: {
        status: 'healthy',
        version: '1.0.0',
        uptime: process.uptime(),
        nodeVersion: process.version,
        platform: process.platform,
        timestamp: Date.now()
      },
      
      content: {
        locale,
        availableLocales: allLocales,
        ...contentStats
      },
      
      performance: {
        responseTime,
        averageResponseTime: responseTime, // TODO: Track actual average
        requestsPerMinute: 0, // TODO: Implement request counting
        successRate: 1.0 // TODO: Track actual success rate
      },
      
      ...(cacheStats && { cache: cacheStats })
    }

    return response

  } catch (error) {
    console.error('Navigation stats API error:', error)
    
    // Return error stats
    const errorResponse = {
      system: {
        status: 'error',
        error: (error as Error).message,
        timestamp: Date.now()
      },
      content: null,
      performance: {
        responseTime: Date.now() - startTime,
        error: true
      }
    }

    setResponseStatus(event, 500)
    return errorResponse
  }
})

/**
 * Calculate comprehensive content statistics
 */
function calculateContentStats(tree: any[]) {
  const stats = {
    totalPages: 0,
    totalSections: 0,
    maxDepth: 0,
    averageDepth: 0,
    missingIcons: [] as string[],
    missingDescriptions: [] as string[],
    levelDistribution: {} as Record<number, number>,
    typeDistribution: {
      index: 0,
      content: 0
    },
    sections: {} as Record<string, {
      name: string,
      pages: number,
      depth: number
    }>
  }

  const allNodes: any[] = []
  
  // Flatten tree and collect all nodes
  function traverse(nodes: any[], level: number = 0) {
    for (const node of nodes) {
      allNodes.push({ ...node, level })
      
      // Update level distribution
      stats.levelDistribution[level] = (stats.levelDistribution[level] || 0) + 1
      
      // Update type distribution
      if (node.type === 'index') {
        stats.typeDistribution.index++
      } else {
        stats.typeDistribution.content++
      }
      
      // Check for missing data
      if (!node.icon && level === 0) {
        stats.missingIcons.push(node.path)
      }
      
      if (!node.description || node.description.length < 10) {
        stats.missingDescriptions.push(node.path)
      }
      
      // Process children
      if (node.children && node.children.length > 0) {
        traverse(node.children, level + 1)
      }
    }
  }

  traverse(tree)

  // Calculate basic stats
  stats.totalPages = allNodes.length
  stats.totalSections = tree.length
  stats.maxDepth = Math.max(...Object.keys(stats.levelDistribution).map(Number))
  
  if (allNodes.length > 0) {
    const totalDepth = allNodes.reduce((sum, node) => sum + node.level, 0)
    stats.averageDepth = totalDepth / allNodes.length
  }

  // Calculate section statistics
  for (const section of tree) {
    const sectionPages = countPagesInSection(section)
    const sectionDepth = calculateSectionDepth(section)
    
    stats.sections[section.path] = {
      name: section.title,
      pages: sectionPages,
      depth: sectionDepth
    }
  }

  return stats
}

/**
 * Count pages in a section recursively
 */
function countPagesInSection(section: any): number {
  let count = 1 // Count the section itself
  
  if (section.children) {
    for (const child of section.children) {
      count += countPagesInSection(child)
    }
  }
  
  return count
}

/**
 * Calculate maximum depth of a section
 */
function calculateSectionDepth(section: any): number {
  if (!section.children || section.children.length === 0) {
    return 0
  }
  
  return 1 + Math.max(...section.children.map(calculateSectionDepth))
}