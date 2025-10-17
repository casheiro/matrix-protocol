/**
 * Navigation API Logging Middleware
 * 
 * Logs navigation API requests for monitoring and debugging
 * 
 * @author Alex Santos (Tech Lead)
 * @created 2025-10-15
 * @task TASK-2.3
 */

import { getHeader, getQuery } from 'h3'

interface RequestLog {
  timestamp: number
  method: string
  url: string
  userAgent?: string
  ip?: string
  responseTime?: number
  statusCode?: number
  cached?: boolean
  locale?: string
  error?: string
}

// In-memory request log (for development - use proper logging in production)
const requestLogs: RequestLog[] = []
const MAX_LOGS = 1000

export default defineEventHandler(async (event) => {
  // Only handle navigation API routes
  if (!event.node.req.url?.startsWith('/api/navigation')) {
    return
  }

  const startTime = Date.now()
  const url = event.node.req.url
  const method = event.node.req.method || 'GET'
  const userAgent = getHeader(event, 'user-agent')
  const ip = getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || event.node.req.socket.remoteAddress || 'unknown'

  // Create initial log entry
  const logEntry: RequestLog = {
    timestamp: startTime,
    method,
    url,
    userAgent,
    ip
  }

  // Extract locale from query if available
  const query = getQuery(event)
  if (query.locale) {
    logEntry.locale = query.locale as string
  }

  try {
    // Log request start
    console.log(`[NAV-API] ${method} ${url} - ${ip} - ${userAgent?.substring(0, 50)}`)

    // Continue to next handler
    const result = await Promise.resolve()

    return result
  } catch (error) {
    // Log error
    logEntry.error = error instanceof Error ? error.message : String(error)
    console.error(`[NAV-API] ERROR ${method} ${url} - ${logEntry.error}`)
    
    // Re-throw error
    throw error
  } finally {
    // Calculate response time
    logEntry.responseTime = Date.now() - startTime
    logEntry.statusCode = event.node.res.statusCode

    // Check if response was cached (from headers)
    const cached = event.node.res.getHeader('X-Cached')
    if (cached) {
      logEntry.cached = cached === 'true'
    }

    // Add to log history
    requestLogs.push(logEntry)

    // Keep only recent logs
    if (requestLogs.length > MAX_LOGS) {
      requestLogs.splice(0, requestLogs.length - MAX_LOGS)
    }

    // Log completion
    const status = logEntry.error ? 'ERROR' : 'OK'
    const cacheInfo = logEntry.cached ? '(cached)' : ''
    console.log(`[NAV-API] ${status} ${method} ${url} - ${logEntry.responseTime}ms ${cacheInfo}`)
  }
})

/**
 * Get request logs for monitoring
 * Can be exposed via admin API if needed
 */
export function getRequestLogs(limit: number = 100): RequestLog[] {
  return requestLogs.slice(-limit)
}

/**
 * Get request statistics
 */
export function getRequestStats(): {
  totalRequests: number
  averageResponseTime: number
  errorRate: number
  cacheHitRate: number
  topEndpoints: Array<{ endpoint: string; count: number }>
  recentErrors: Array<{ url: string; error: string; timestamp: number }>
} {
  const total = requestLogs.length
  
  if (total === 0) {
    return {
      totalRequests: 0,
      averageResponseTime: 0,
      errorRate: 0,
      cacheHitRate: 0,
      topEndpoints: [],
      recentErrors: []
    }
  }

  // Calculate average response time
  const totalResponseTime = requestLogs.reduce((sum, log) => sum + (log.responseTime || 0), 0)
  const averageResponseTime = totalResponseTime / total

  // Calculate error rate
  const errors = requestLogs.filter(log => log.error)
  const errorRate = errors.length / total

  // Calculate cache hit rate
  const cachedRequests = requestLogs.filter(log => log.cached === true)
  const cacheHitRate = cachedRequests.length / total

  // Calculate top endpoints
  const endpointCounts: Record<string, number> = {}
  for (const log of requestLogs) {
    const endpoint = log.url.split('?')[0] // Remove query params
    endpointCounts[endpoint] = (endpointCounts[endpoint] || 0) + 1
  }

  const topEndpoints = Object.entries(endpointCounts)
    .map(([endpoint, count]) => ({ endpoint, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Get recent errors
  const recentErrors = errors
    .slice(-10)
    .map(log => ({
      url: log.url,
      error: log.error!,
      timestamp: log.timestamp
    }))

  return {
    totalRequests: total,
    averageResponseTime: Math.round(averageResponseTime),
    errorRate: Math.round(errorRate * 100) / 100,
    cacheHitRate: Math.round(cacheHitRate * 100) / 100,
    topEndpoints,
    recentErrors
  }
}