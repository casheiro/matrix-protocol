/**
 * Navigation Types
 * 
 * Shared TypeScript types for dynamic navigation system
 * in Matrix Protocol website.
 * 
 * @author Ricardo Lima (Nuxt Specialist)
 * @created 2025-10-15
 * @task TASK-2.2
 */

// ============================================================================
// CORE CONTENT TYPES
// ============================================================================

export interface ContentNode {
  path: string
  title: string
  description: string
  icon?: string
  locale: string
  level: number
  type: 'index' | 'content'
  children: ContentNode[]
  metadata: ContentMetadata
}

// Alias for components compatibility  
export interface NavigationNode extends ContentNode {
  children: NavigationNode[]
}

export interface ContentMetadata {
  sidebar: boolean
  toc: boolean
  navigation: boolean
  layout: string
  parentPath?: string
  breadcrumbs: string[]
  order?: number
  lastModified?: string
  wordCount?: number
}

export interface FrontmatterData {
  title: string
  description: string
  icon?: string
  layout?: string
  sidebar?: boolean
  toc?: boolean
  navigation?: boolean
  order?: number
}

export interface ContentTree {
  [locale: string]: ContentNode[]
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface NavigationTreeResponse {
  tree: ContentNode[]
  locale: string
  totalNodes: number
  maxDepth: number
  timestamp: number
  cached: boolean
}

export interface BreadcrumbsResponse {
  breadcrumbs: BreadcrumbItem[]
  currentPath: string
  locale: string
  timestamp: number
}

// Additional response type for breadcrumbs
export interface BreadcrumbResponse extends BreadcrumbsResponse {}

export interface SiblingsResponse {
  siblings: ContentNode[]
  parent: ContentNode | null
  children: ContentNode[]
  currentPath: string
  locale: string
  totalSiblings: number
  timestamp: number
}

export interface SearchResponse {
  results: SearchResult[]
  query: string
  locale: string
  totalResults: number
  searchTime: number
  timestamp: number
}

export interface LocalesResponse {
  available: string[]
  default: string
  current?: string
  timestamp: number
}

// ============================================================================
// NAVIGATION UI TYPES
// ============================================================================

export interface NavigationItem {
  id: string
  title: string
  description: string
  path: string
  icon?: string
  level: number
  children: NavigationItem[]
  metadata: NavigationItemMetadata
}

export interface NavigationItemMetadata {
  hasChildren: boolean
  isActive: boolean
  isIndex: boolean
  breadcrumbs: string[]
  siblings: number
  order?: number
}

export interface NavigationMenu {
  sections: NavigationSection[]
  totalItems: number
  maxDepth: number
  locale: string
}

export interface NavigationSection {
  id: string
  title: string
  description: string
  icon?: string
  items: NavigationItem[]
  path: string
  order: number
}

export interface BreadcrumbItem {
  title: string
  path: string
  isLast: boolean
  icon?: string
  type?: 'index' | 'content'
}

// ============================================================================
// SEARCH TYPES
// ============================================================================

export interface SearchResult {
  path: string
  title: string
  description: string
  icon?: string
  locale: string
  relevanceScore: number
  matchType: 'title' | 'description' | 'content'
  snippet?: string
  section: string
}

export interface SearchQuery {
  q: string
  locale?: string
  limit?: number
  section?: string
  type?: 'all' | 'pages' | 'sections'
}

export interface SearchFilters {
  sections?: string[]
  levels?: number[]
  hasIcon?: boolean
  minRelevance?: number
}

// ============================================================================
// CACHE TYPES
// ============================================================================

export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  hits?: number
}

export interface CacheStats {
  totalEntries: number
  memoryUsage: number
  hitRatio: number
  expiredEntries: number
  navigationEntries: number
  searchEntries: number
  oldestEntry?: number
  newestEntry?: number
}

export interface CacheOptions {
  ttl?: number
  enableFileWatcher?: boolean
  watchPattern?: string
}

// ============================================================================
// SERVICE CONFIGURATION TYPES
// ============================================================================

export interface ContentDiscoveryConfig {
  contentRoot: string
  enableCache: boolean
  cacheTTL: number
  enableFileWatcher: boolean
  supportedLocales: string[]
  defaultLocale: string
  maxDepth: number
  includeMetadata: boolean
}

export interface NavigationConfig {
  enableBreadcrumbs: boolean
  enableSiblings: boolean
  enableSearch: boolean
  maxSearchResults: number
  maxSidebarDepth: number
  enableRelatedPages: boolean
  relatedPagesLimit: number
}

export interface ApiConfig {
  enableRateLimit: boolean
  maxRequestsPerMinute: number
  enableCors: boolean
  enableCompression: boolean
  responseTimeout: number
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface NavigationError {
  code: string
  message: string
  path?: string
  locale?: string
  details?: Record<string, any>
  timestamp: number
}

export interface ValidationError {
  field: string
  value: any
  message: string
  path: string
}

export interface PerformanceMetrics {
  scanTime: number
  buildTime: number
  cacheHits: number
  cacheMisses: number
  memoryUsage: number
  averageResponseTime: number
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Locale = 'pt' | 'en'
export type ContentType = 'index' | 'content'
export type CacheKey = string
export type PathSegment = string
export type NavigationLevel = number

export interface PathInfo {
  segments: PathSegment[]
  locale: Locale
  section: string
  subsection?: string
  page?: string
  isIndex: boolean
}

export interface ContentStats {
  totalFiles: number
  totalDirectories: number
  averageDepth: number
  missingIcons: string[]
  missingDescriptions: string[]
  duplicateTitles: string[]
  parityIssues: Array<{
    path: string
    issue: string
    locales: string[]
  }>
}

// ============================================================================
// EVENT TYPES
// ============================================================================

export interface ContentChangeEvent {
  type: 'created' | 'modified' | 'deleted'
  path: string
  filename: string
  timestamp: number
}

export interface CacheInvalidationEvent {
  keys: string[]
  reason: string
  timestamp: number
}

export interface NavigationUpdateEvent {
  locale: string
  affectedPaths: string[]
  changeType: 'structure' | 'content' | 'metadata'
  timestamp: number
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isContentNode(obj: any): obj is ContentNode {
  return (
    obj &&
    typeof obj.path === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.locale === 'string' &&
    typeof obj.level === 'number' &&
    (obj.type === 'index' || obj.type === 'content') &&
    Array.isArray(obj.children) &&
    obj.metadata
  )
}

export function isNavigationItem(obj: any): obj is NavigationItem {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.path === 'string' &&
    typeof obj.level === 'number' &&
    Array.isArray(obj.children) &&
    obj.metadata
  )
}

export function isValidLocale(locale: string): locale is Locale {
  return locale === 'pt' || locale === 'en'
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const SUPPORTED_LOCALES: Locale[] = ['pt', 'en']
export const DEFAULT_LOCALE: Locale = 'pt'

export const CACHE_KEYS = {
  NAVIGATION_TREE: (locale: string) => `navigation_tree_${locale}`,
  BREADCRUMBS: (path: string, locale: string) => `breadcrumbs_${locale}_${path}`,
  SIBLINGS: (path: string, locale: string) => `siblings_${locale}_${path}`,
  SEARCH: (query: string, locale: string) => `search_${locale}_${query.replace(/[^a-zA-Z0-9]/g, '_')}`,
  AVAILABLE_LOCALES: 'available_locales',
  CONTENT_STATS: 'content_stats'
} as const

export const DEFAULT_CACHE_TTL = {
  NAVIGATION: 5 * 60 * 1000,    // 5 minutes
  BREADCRUMBS: 10 * 60 * 1000,  // 10 minutes
  SEARCH: 2 * 60 * 1000,        // 2 minutes
  LOCALES: 15 * 60 * 1000       // 15 minutes
} as const

export const API_LIMITS = {
  MAX_SEARCH_RESULTS: 50,
  MAX_TREE_DEPTH: 10,
  MAX_QUERY_LENGTH: 100,
  MAX_PATH_LENGTH: 500
} as const