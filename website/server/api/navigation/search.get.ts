/**
 * Search API Endpoint
 * 
 * GET /api/navigation/search
 * Returns search results for content based on query
 * 
 * @author Alex Santos (Tech Lead)
 * @created 2025-10-15
 * @task TASK-2.3
 */

import { contentDiscovery } from '~/server/services/contentDiscovery'
import { navigationCache } from '~/server/services/cacheManager'
import type { SearchResponse, SearchResult } from '~/server/types/navigation'

export default defineEventHandler(async (event) => {
  const startTime = Date.now()

  try {
    // Parse query parameters
    const query = getQuery(event)
    const searchQuery = query.q as string
    const locale = (query.locale as string) || 'pt'
    const limit = query.limit ? parseInt(query.limit as string) : 10
    const section = query.section as string
    const enableCache = query.cache !== 'false'

    // Validate required parameters
    if (!searchQuery) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required parameter: q (search query)'
      })
    }

    // Validate search query
    if (searchQuery.length < 2) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Search query must be at least 2 characters long'
      })
    }

    if (searchQuery.length > 100) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Search query must be less than 100 characters'
      })
    }

    // Validate locale
    if (!['pt', 'en'].includes(locale)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid locale. Supported locales: pt, en'
      })
    }

    // Validate limit
    if (limit < 1 || limit > 50) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid limit. Must be between 1 and 50'
      })
    }

    // Check cache first (if enabled)
    let searchResults
    let cached = false
    
    if (enableCache) {
      searchResults = navigationCache.getSearchResults(searchQuery, locale)
      if (searchResults) {
        cached = true
      }
    }

    // Perform search if not cached
    if (!searchResults) {
      const contentNodes = await contentDiscovery.searchContent(searchQuery, locale)
      
      // Transform to search result format
      searchResults = contentNodes.map(node => transformToSearchResult(node, searchQuery))
      
      // Cache the result (if caching enabled)
      if (enableCache) {
        navigationCache.setSearchResults(searchQuery, locale, searchResults)
      }
    }

    // Filter by section if specified
    if (section) {
      searchResults = searchResults.filter(result => 
        result.path.startsWith(`/docs/${section}`)
      )
    }

    // Apply limit and sort by relevance
    const totalResults = searchResults.length
    searchResults = searchResults
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit)

    const responseTime = Date.now() - startTime

    // Set response headers
    setHeader(event, 'Content-Type', 'application/json')
    setHeader(event, 'Cache-Control', 'public, max-age=120') // 2 minutes
    setHeader(event, 'X-Response-Time', `${responseTime}ms`)
    setHeader(event, 'X-Total-Results', totalResults.toString())
    setHeader(event, 'X-Returned-Results', searchResults.length.toString())
    setHeader(event, 'X-Cached', cached.toString())

    // Prepare response
    const response: SearchResponse = {
      results: searchResults,
      query: searchQuery,
      locale,
      totalResults,
      searchTime: responseTime,
      timestamp: Date.now()
    }

    return response

  } catch (error) {
    console.error('Search API error:', error)
    
    // Handle specific errors
    if (error.statusCode) {
      throw error
    }

    // Generic server error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to perform search',
      data: {
        error: error.message,
        query: query.q,
        locale: query.locale,
        timestamp: Date.now()
      }
    })
  }
})

/**
 * Transform content node to search result
 */
function transformToSearchResult(node: any, searchQuery: string): SearchResult {
  const query = searchQuery.toLowerCase()
  const title = node.title.toLowerCase()
  const description = node.description.toLowerCase()
  
  // Calculate relevance score
  let relevanceScore = 0
  let matchType: 'title' | 'description' | 'content' = 'content'
  
  // Title match (highest relevance)
  if (title.includes(query)) {
    relevanceScore += 100
    matchType = 'title'
    
    // Exact title match
    if (title === query) {
      relevanceScore += 50
    }
    
    // Title starts with query
    if (title.startsWith(query)) {
      relevanceScore += 25
    }
  }
  
  // Description match (medium relevance)
  if (description.includes(query)) {
    relevanceScore += 50
    if (matchType === 'content') {
      matchType = 'description'
    }
  }
  
  // Boost based on content level (higher level = more specific)
  relevanceScore += (4 - node.level) * 5
  
  // Generate snippet
  const snippet = generateSnippet(node.description, searchQuery)
  
  // Determine section
  const pathSegments = node.path.split('/').filter(Boolean)
  const section = pathSegments.length > 1 ? pathSegments[1] : 'docs'
  
  return {
    path: node.path,
    title: node.title,
    description: node.description,
    icon: node.icon,
    locale: node.locale,
    relevanceScore,
    matchType,
    snippet,
    section
  }
}

/**
 * Generate snippet with highlighted search terms
 */
function generateSnippet(text: string, searchQuery: string, maxLength: number = 150): string {
  const query = searchQuery.toLowerCase()
  const lowerText = text.toLowerCase()
  
  // Find query position
  const queryIndex = lowerText.indexOf(query)
  
  if (queryIndex === -1) {
    // Query not found, return beginning of text
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }
  
  // Calculate snippet boundaries
  const start = Math.max(0, queryIndex - 50)
  const end = Math.min(text.length, start + maxLength)
  
  let snippet = text.substring(start, end)
  
  // Add ellipsis if truncated
  if (start > 0) snippet = '...' + snippet
  if (end < text.length) snippet = snippet + '...'
  
  return snippet
}