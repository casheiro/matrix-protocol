/**
 * Cache Manager Service
 * 
 * Provides intelligent caching for content discovery with file system watching
 * and smart invalidation strategies for Matrix Protocol website navigation.
 * 
 * @author Ricardo Lima (Nuxt Specialist)
 * @created 2025-10-15
 * @task TASK-2.2
 */

import { watch, FSWatcher } from 'fs'
import { join } from 'path'
import type { ContentTree } from './contentDiscovery'

export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

export interface CacheOptions {
  ttl?: number  // Time to live in milliseconds
  enableFileWatcher?: boolean
  watchPattern?: string
}

/**
 * Cache Manager Class
 * Handles multi-level caching with automatic invalidation
 */
export class CacheManager {
  private memoryCache: Map<string, CacheEntry<any>> = new Map()
  private fileWatcher: FSWatcher | null = null
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

  /**
   * Get cached data or null if expired/missing
   */
  get<T>(key: string): T | null {
    const entry = this.memoryCache.get(key)
    
    if (!entry) {
      return null
    }
    
    // Check if expired
    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.memoryCache.delete(key)
      return null
    }
    
    return entry.data as T
  }

  /**
   * Set cached data with optional TTL
   */
  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const ttl = options.ttl || this.DEFAULT_TTL
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl
    }
    
    this.memoryCache.set(key, entry)
  }

  /**
   * Remove specific cache entry
   */
  delete(key: string): boolean {
    return this.memoryCache.delete(key)
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.memoryCache.clear()
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number
    entries: Array<{
      key: string
      size: number
      age: number
      ttl: number
      expired: boolean
    }>
  } {
    const now = Date.now()
    const entries = Array.from(this.memoryCache.entries()).map(([key, entry]) => ({
      key,
      size: this.estimateSize(entry.data),
      age: now - entry.timestamp,
      ttl: entry.ttl,
      expired: (now - entry.timestamp) > entry.ttl
    }))

    return {
      size: this.memoryCache.size,
      entries
    }
  }

  /**
   * Setup file system watcher for content changes
   */
  setupFileWatcher(contentPath: string, onContentChange: () => void): void {
    if (this.fileWatcher) {
      this.fileWatcher.close()
    }

    try {
      // Watch the content directory recursively
      this.fileWatcher = watch(
        contentPath,
        { recursive: true },
        (eventType, filename) => {
          if (filename && filename.endsWith('.md')) {
            console.log(`Content file changed: ${filename} (${eventType})`)
            
            // Clear content-related cache
            this.invalidateContentCache()
            
            // Notify callback
            onContentChange()
          }
        }
      )

      console.log(`File watcher setup for: ${contentPath}`)
    } catch (error) {
      console.error('Failed to setup file watcher:', error)
    }
  }

  /**
   * Cleanup file watcher
   */
  cleanup(): void {
    if (this.fileWatcher) {
      this.fileWatcher.close()
      this.fileWatcher = null
    }
  }

  /**
   * Invalidate content-related cache entries
   */
  private invalidateContentCache(): void {
    const contentKeys = Array.from(this.memoryCache.keys()).filter(key => 
      key.startsWith('content_') || 
      key.startsWith('navigation_') ||
      key.startsWith('breadcrumbs_') ||
      key.startsWith('siblings_') ||
      key.startsWith('search_')
    )

    for (const key of contentKeys) {
      this.memoryCache.delete(key)
    }

    console.log(`Invalidated ${contentKeys.length} content cache entries`)
  }

  /**
   * Estimate size of cached data (rough approximation)
   */
  private estimateSize(data: any): number {
    try {
      return JSON.stringify(data).length
    } catch {
      return 0
    }
  }

  /**
   * Clean expired entries
   */
  cleanExpired(): void {
    const now = Date.now()
    const expiredKeys: string[] = []

    for (const [key, entry] of this.memoryCache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredKeys.push(key)
      }
    }

    for (const key of expiredKeys) {
      this.memoryCache.delete(key)
    }

    if (expiredKeys.length > 0) {
      console.log(`Cleaned ${expiredKeys.length} expired cache entries`)
    }
  }
}

/**
 * Enhanced Cache Manager for Navigation
 * Specialized for content discovery caching patterns
 */
export class NavigationCacheManager extends CacheManager {
  private readonly NAVIGATION_TTL = 5 * 60 * 1000  // 5 minutes
  private readonly SEARCH_TTL = 2 * 60 * 1000      // 2 minutes
  private readonly BREADCRUMBS_TTL = 10 * 60 * 1000 // 10 minutes

  /**
   * Cache navigation tree for a locale
   */
  setNavigationTree(locale: string, tree: ContentTree[string]): void {
    const key = `navigation_tree_${locale}`
    this.set(key, tree, { ttl: this.NAVIGATION_TTL })
  }

  /**
   * Get cached navigation tree for a locale
   */
  getNavigationTree(locale: string): ContentTree[string] | null {
    const key = `navigation_tree_${locale}`
    return this.get(key)
  }

  /**
   * Cache breadcrumbs for a path
   */
  setBreadcrumbs(path: string, locale: string, breadcrumbs: any[]): void {
    const key = `breadcrumbs_${locale}_${path}`
    this.set(key, breadcrumbs, { ttl: this.BREADCRUMBS_TTL })
  }

  /**
   * Get cached breadcrumbs for a path
   */
  getBreadcrumbs(path: string, locale: string): any[] | null {
    const key = `breadcrumbs_${locale}_${path}`
    return this.get(key)
  }

  /**
   * Cache siblings for a path
   */
  setSiblings(path: string, locale: string, siblings: any[]): void {
    const key = `siblings_${locale}_${path}`
    this.set(key, siblings, { ttl: this.NAVIGATION_TTL })
  }

  /**
   * Get cached siblings for a path
   */
  getSiblings(path: string, locale: string): any[] | null {
    const key = `siblings_${locale}_${path}`
    return this.get(key)
  }

  /**
   * Cache search results
   */
  setSearchResults(query: string, locale: string, results: any[]): void {
    const key = `search_${locale}_${this.normalizeQuery(query)}`
    this.set(key, results, { ttl: this.SEARCH_TTL })
  }

  /**
   * Get cached search results
   */
  getSearchResults(query: string, locale: string): any[] | null {
    const key = `search_${locale}_${this.normalizeQuery(query)}`
    return this.get(key)
  }

  /**
   * Cache available locales
   */
  setAvailableLocales(locales: string[]): void {
    this.set('available_locales', locales, { ttl: this.NAVIGATION_TTL })
  }

  /**
   * Get cached available locales
   */
  getAvailableLocales(): string[] | null {
    return this.get('available_locales')
  }

  /**
   * Normalize search query for consistent caching
   */
  private normalizeQuery(query: string): string {
    return query.toLowerCase().trim().replace(/\s+/g, '_')
  }

  /**
   * Get cache health metrics
   */
  getHealthMetrics(): {
    totalEntries: number
    memoryUsage: number
    hitRatio: number
    expiredEntries: number
    navigationEntries: number
    searchEntries: number
  } {
    const stats = this.getStats()
    const now = Date.now()
    
    let navigationEntries = 0
    let searchEntries = 0
    let expiredEntries = 0

    for (const entry of stats.entries) {
      if (entry.key.startsWith('navigation_') || entry.key.startsWith('breadcrumbs_') || entry.key.startsWith('siblings_')) {
        navigationEntries++
      }
      if (entry.key.startsWith('search_')) {
        searchEntries++
      }
      if (entry.expired) {
        expiredEntries++
      }
    }

    return {
      totalEntries: stats.size,
      memoryUsage: stats.entries.reduce((sum, entry) => sum + entry.size, 0),
      hitRatio: 0.85, // TODO: Implement actual hit ratio tracking
      expiredEntries,
      navigationEntries,
      searchEntries
    }
  }
}

// Export singleton instance
export const navigationCache = new NavigationCacheManager()