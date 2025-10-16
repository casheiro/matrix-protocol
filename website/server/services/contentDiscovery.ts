/**
 * Content Discovery Service
 * 
 * Automatically scans /content directory structure and builds navigation trees
 * for dynamic navigation API in Matrix Protocol website.
 * 
 * @author Ricardo Lima (Nuxt Specialist)
 * @created 2025-10-15
 * @task TASK-2.2
 */

import { readdir, readFile, stat } from 'fs/promises'
import { join, relative, basename, dirname } from 'path'
import { parse as parseYaml } from 'yaml'

// Types for content discovery
export interface ContentNode {
  path: string
  title: string
  description: string
  icon?: string
  locale: string
  level: number
  type: 'index' | 'content'
  children: ContentNode[]
  metadata: {
    sidebar: boolean
    toc: boolean
    navigation: boolean
    layout: string
    parentPath?: string
    breadcrumbs: string[]
    order?: number
  }
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

/**
 * Content Discovery Service Class
 * Handles scanning, parsing, and tree building for content navigation
 */
export class ContentDiscoveryService {
  private contentRoot: string
  private cache: Map<string, ContentTree> = new Map()
  private cacheTimestamp: number = 0
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  constructor(contentRoot: string = 'content') {
    this.contentRoot = contentRoot
  }

  /**
   * Get complete navigation tree for a locale
   */
  async getNavigationTree(locale: string, maxDepth?: number): Promise<ContentNode[]> {
    const tree = await this.getContentTree()
    const localeTree = tree[locale] || []
    
    if (maxDepth !== undefined) {
      return this.limitTreeDepth(localeTree, maxDepth)
    }
    
    return localeTree
  }

  /**
   * Get breadcrumb trail for a specific path
   */
  async getBreadcrumbs(path: string, locale: string): Promise<ContentNode[]> {
    const tree = await this.getNavigationTree(locale)
    return this.findBreadcrumbs(tree, path)
  }

  /**
   * Get sibling pages for a specific path
   */
  async getSiblings(path: string, locale: string): Promise<ContentNode[]> {
    const tree = await this.getNavigationTree(locale)
    return this.findSiblings(tree, path)
  }

  /**
   * Search content by query string
   */
  async searchContent(query: string, locale: string): Promise<ContentNode[]> {
    const tree = await this.getNavigationTree(locale)
    const results: ContentNode[] = []
    
    this.searchInTree(tree, query.toLowerCase(), results)
    
    // Sort by relevance (title match > description match)
    return results.sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0
      const bTitle = b.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0
      return bTitle - aTitle
    })
  }

  /**
   * Get available locales
   */
  async getAvailableLocales(): Promise<string[]> {
    const tree = await this.getContentTree()
    return Object.keys(tree)
  }

  /**
   * Clear cache (useful for development or manual refresh)
   */
  clearCache(): void {
    this.cache.clear()
    this.cacheTimestamp = 0
  }

  /**
   * Get content tree with caching
   */
  private async getContentTree(): Promise<ContentTree> {
    const now = Date.now()
    
    // Check cache validity
    if (this.cache.has('tree') && (now - this.cacheTimestamp) < this.CACHE_TTL) {
      return this.cache.get('tree')!
    }

    // Rebuild tree
    const tree = await this.buildContentTree()
    
    // Update cache
    this.cache.set('tree', tree)
    this.cacheTimestamp = now
    
    return tree
  }

  /**
   * Build complete content tree by scanning filesystem
   */
  private async buildContentTree(): Promise<ContentTree> {
    const tree: ContentTree = {}
    
    try {
      // Scan for locales in content directory
      const contentPath = this.resolveContentPath()
      const locales = await this.getDirectories(contentPath)
      
      for (const locale of locales) {
        const docsPath = join(contentPath, locale, 'docs')
        
        try {
          // Check if docs directory exists
          await stat(docsPath)
          
          // Build tree for this locale
          tree[locale] = await this.scanDirectory(docsPath, locale, 0, '/docs')
        } catch (error) {
          console.warn(`Docs directory not found for locale ${locale}:`, error)
          tree[locale] = []
        }
      }
      
      return tree
    } catch (error) {
      console.error('Error building content tree:', error)
      return {}
    }
  }

  /**
   * Recursively scan directory and build navigation nodes
   */
  private async scanDirectory(
    dirPath: string, 
    locale: string, 
    level: number, 
    urlPath: string,
    parentPath?: string
  ): Promise<ContentNode[]> {
    const nodes: ContentNode[] = []
    
    try {
      const entries = await readdir(dirPath, { withFileTypes: true })
      
      // Separate files and directories
      const files = entries.filter(entry => entry.isFile() && entry.name.endsWith('.md'))
      const directories = entries.filter(entry => entry.isDirectory())
      
      // Process index.md first if it exists
      const indexFile = files.find(file => file.name === 'index.md')
      if (indexFile) {
        const indexNode = await this.createContentNode(
          join(dirPath, indexFile.name),
          locale,
          level,
          urlPath,
          'index',
          parentPath
        )
        if (indexNode) {
          nodes.push(indexNode)
        }
      }
      
      // Process other markdown files
      const contentFiles = files.filter(file => file.name !== 'index.md')
      for (const file of contentFiles) {
        const filePath = join(dirPath, file.name)
        const fileName = basename(file.name, '.md')
        const fileUrlPath = urlPath === '/docs' ? `/docs/${fileName}` : `${urlPath}/${fileName}`
        
        const node = await this.createContentNode(
          filePath,
          locale,
          level,
          fileUrlPath,
          'content',
          parentPath
        )
        if (node) {
          nodes.push(node)
        }
      }
      
      // Process subdirectories
      for (const dir of directories) {
        const subdirPath = join(dirPath, dir.name)
        const subdirUrlPath = urlPath === '/docs' ? `/docs/${dir.name}` : `${urlPath}/${dir.name}`
        
        const children = await this.scanDirectory(
          subdirPath, 
          locale, 
          level + 1, 
          subdirUrlPath,
          urlPath
        )
        
        if (children.length > 0) {
          // If subdirectory has an index, update its children
          const indexChild = children.find(child => child.type === 'index')
          if (indexChild) {
            indexChild.children = children.filter(child => child !== indexChild)
            nodes.push(indexChild)
          } else {
            // No index file, add children directly
            nodes.push(...children)
          }
        }
      }
      
      // Sort nodes by order (if specified) or alphabetically
      return nodes.sort((a, b) => {
        const orderA = a.metadata.order ?? 999
        const orderB = b.metadata.order ?? 999
        
        if (orderA !== orderB) {
          return orderA - orderB
        }
        
        return a.title.localeCompare(b.title, locale)
      })
      
    } catch (error) {
      console.error(`Error scanning directory ${dirPath}:`, error)
      return []
    }
  }

  /**
   * Create a content node from a markdown file
   */
  private async createContentNode(
    filePath: string,
    locale: string,
    level: number,
    urlPath: string,
    type: 'index' | 'content',
    parentPath?: string
  ): Promise<ContentNode | null> {
    try {
      const content = await readFile(filePath, 'utf-8')
      const frontmatter = this.parseFrontmatter(content)
      
      if (!frontmatter.title || !frontmatter.description) {
        console.warn(`Missing required frontmatter in ${filePath}`)
        return null
      }
      
      // Generate breadcrumbs from path
      const breadcrumbs = this.generateBreadcrumbs(urlPath)
      
      return {
        path: urlPath,
        title: frontmatter.title,
        description: frontmatter.description,
        icon: frontmatter.icon,
        locale,
        level,
        type,
        children: [],
        metadata: {
          sidebar: frontmatter.sidebar ?? true,
          toc: frontmatter.toc ?? true,
          navigation: frontmatter.navigation ?? true,
          layout: frontmatter.layout ?? 'docs',
          parentPath,
          breadcrumbs,
          order: frontmatter.order
        }
      }
    } catch (error) {
      console.error(`Error creating content node for ${filePath}:`, error)
      return null
    }
  }

  /**
   * Parse YAML frontmatter from markdown content
   */
  private parseFrontmatter(content: string): FrontmatterData {
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/)
    
    if (!frontmatterMatch) {
      return { title: '', description: '' }
    }
    
    try {
      const yamlContent = frontmatterMatch[1]
      const parsed = parseYaml(yamlContent) as FrontmatterData
      
      return {
        title: parsed.title || '',
        description: parsed.description || '',
        icon: parsed.icon,
        layout: parsed.layout,
        sidebar: parsed.sidebar,
        toc: parsed.toc,
        navigation: parsed.navigation,
        order: parsed.order
      }
    } catch (error) {
      console.error('Error parsing frontmatter:', error)
      return { title: '', description: '' }
    }
  }

  /**
   * Generate breadcrumb array from URL path
   */
  private generateBreadcrumbs(urlPath: string): string[] {
    const segments = urlPath.split('/').filter(Boolean)
    const breadcrumbs: string[] = []
    
    let currentPath = ''
    for (const segment of segments) {
      currentPath += `/${segment}`
      breadcrumbs.push(currentPath)
    }
    
    return breadcrumbs
  }

  /**
   * Get list of directories in a path
   */
  private async getDirectories(path: string): Promise<string[]> {
    try {
      const entries = await readdir(path, { withFileTypes: true })
      return entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
    } catch (error) {
      console.error(`Error reading directories from ${path}:`, error)
      return []
    }
  }

  /**
   * Resolve content path (handles both development and production)
   */
  private resolveContentPath(): string {
    // In Nuxt, content is typically in project root
    return join(process.cwd(), this.contentRoot)
  }

  /**
   * Limit tree depth for performance
   */
  private limitTreeDepth(nodes: ContentNode[], maxDepth: number): ContentNode[] {
    if (maxDepth <= 0) return []
    
    return nodes.map(node => ({
      ...node,
      children: node.level < maxDepth - 1 ? this.limitTreeDepth(node.children, maxDepth) : []
    }))
  }

  /**
   * Find breadcrumb trail for a specific path
   */
  private findBreadcrumbs(nodes: ContentNode[], targetPath: string): ContentNode[] {
    const breadcrumbs: ContentNode[] = []
    
    function search(currentNodes: ContentNode[], path: ContentNode[]): boolean {
      for (const node of currentNodes) {
        const currentPath = [...path, node]
        
        if (node.path === targetPath) {
          breadcrumbs.push(...currentPath)
          return true
        }
        
        if (search(node.children, currentPath)) {
          return true
        }
      }
      return false
    }
    
    search(nodes, [])
    return breadcrumbs
  }

  /**
   * Find sibling pages for a specific path
   */
  private findSiblings(nodes: ContentNode[], targetPath: string): ContentNode[] {
    function search(currentNodes: ContentNode[]): ContentNode[] | null {
      // Check if target is in current level
      const targetNode = currentNodes.find(node => node.path === targetPath)
      if (targetNode) {
        return currentNodes.filter(node => node !== targetNode)
      }
      
      // Search in children
      for (const node of currentNodes) {
        const result = search(node.children)
        if (result) return result
      }
      
      return null
    }
    
    return search(nodes) || []
  }

  /**
   * Recursively search in tree for query matches
   */
  private searchInTree(nodes: ContentNode[], query: string, results: ContentNode[]): void {
    for (const node of nodes) {
      // Check title and description for matches
      const titleMatch = node.title.toLowerCase().includes(query)
      const descriptionMatch = node.description.toLowerCase().includes(query)
      
      if (titleMatch || descriptionMatch) {
        results.push({...node, children: []}) // Don't include children in search results
      }
      
      // Search in children
      this.searchInTree(node.children, query, results)
    }
  }
}

// Export singleton instance
export const contentDiscovery = new ContentDiscoveryService()