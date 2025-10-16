/**
 * Navigation Builder Service
 * 
 * Builds hierarchical navigation structures and provides navigation utilities
 * for Matrix Protocol website dynamic navigation system.
 * 
 * @author Ricardo Lima (Nuxt Specialist) 
 * @created 2025-10-15
 * @task TASK-2.2
 */

import type { ContentNode } from './contentDiscovery'
import { navigationCache } from './cacheManager'

export interface NavigationItem {
  id: string
  title: string
  description: string
  path: string
  icon?: string
  level: number
  children: NavigationItem[]
  metadata: {
    hasChildren: boolean
    isActive: boolean
    isIndex: boolean
    breadcrumbs: string[]
    siblings: number
  }
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
}

/**
 * Navigation Builder Class
 * Transforms content nodes into navigation structures
 */
export class NavigationBuilder {
  /**
   * Build complete navigation menu from content nodes
   */
  buildNavigationMenu(nodes: ContentNode[], locale: string): NavigationMenu {
    const sections = this.buildSections(nodes)
    const totalItems = this.countTotalItems(sections)
    const maxDepth = this.calculateMaxDepth(sections)

    return {
      sections,
      totalItems,
      maxDepth,
      locale
    }
  }

  /**
   * Build navigation sections from top-level nodes
   */
  buildSections(nodes: ContentNode[]): NavigationSection[] {
    return nodes
      .filter(node => node.level === 0) // Top-level sections only
      .map((node, index) => this.buildSection(node, index))
      .sort((a, b) => a.order - b.order)
  }

  /**
   * Build single navigation section
   */
  buildSection(node: ContentNode, defaultOrder: number): NavigationSection {
    const items = this.buildNavigationItems(node.children, node.path)

    return {
      id: this.generateSectionId(node.path),
      title: node.title,
      description: node.description,
      icon: node.icon,
      items,
      path: node.path,
      order: node.metadata.order ?? defaultOrder
    }
  }

  /**
   * Build navigation items recursively
   */
  buildNavigationItems(nodes: ContentNode[], parentPath: string): NavigationItem[] {
    return nodes.map(node => this.buildNavigationItem(node, parentPath))
  }

  /**
   * Build single navigation item
   */
  buildNavigationItem(node: ContentNode, parentPath: string): NavigationItem {
    const children = this.buildNavigationItems(node.children, node.path)

    return {
      id: this.generateItemId(node.path),
      title: node.title,
      description: node.description,
      path: node.path,
      icon: node.icon,
      level: node.level,
      children,
      metadata: {
        hasChildren: children.length > 0,
        isActive: false, // Will be set by client
        isIndex: node.type === 'index',
        breadcrumbs: node.metadata.breadcrumbs,
        siblings: 0 // Will be calculated
      }
    }
  }

  /**
   * Build breadcrumb trail
   */
  buildBreadcrumbs(nodes: ContentNode[], targetPath: string): BreadcrumbItem[] {
    const trail = this.findNodePath(nodes, targetPath)
    
    return trail.map((node, index) => ({
      title: node.title,
      path: node.path,
      isLast: index === trail.length - 1
    }))
  }

  /**
   * Build sidebar navigation for current section
   */
  buildSidebarNavigation(nodes: ContentNode[], currentPath: string, maxDepth: number = 3): NavigationItem[] {
    // Find current section
    const currentSection = this.findCurrentSection(nodes, currentPath)
    if (!currentSection) {
      return []
    }

    // Build sidebar from section children
    const sidebarItems = this.buildNavigationItems(currentSection.children, currentSection.path)
    
    // Limit depth
    return this.limitNavigationDepth(sidebarItems, maxDepth)
  }

  /**
   * Build related pages (siblings and nearby content)
   */
  buildRelatedPages(nodes: ContentNode[], currentPath: string, limit: number = 5): NavigationItem[] {
    const siblings = this.findSiblings(nodes, currentPath)
    const related: NavigationItem[] = []

    // Add siblings
    for (const sibling of siblings.slice(0, limit)) {
      related.push(this.buildNavigationItem(sibling, sibling.metadata.parentPath || ''))
    }

    // If we need more items, add children of parent
    if (related.length < limit) {
      const parent = this.findParentNode(nodes, currentPath)
      if (parent) {
        const additionalItems = parent.children
          .filter(child => child.path !== currentPath && !siblings.includes(child))
          .slice(0, limit - related.length)

        for (const item of additionalItems) {
          related.push(this.buildNavigationItem(item, parent.path))
        }
      }
    }

    return related
  }

  /**
   * Filter navigation items based on criteria
   */
  filterNavigationItems(
    items: NavigationItem[], 
    criteria: {
      showHidden?: boolean
      maxLevel?: number
      searchQuery?: string
    }
  ): NavigationItem[] {
    return items.filter(item => {
      // Level filtering
      if (criteria.maxLevel !== undefined && item.level > criteria.maxLevel) {
        return false
      }

      // Search filtering
      if (criteria.searchQuery) {
        const query = criteria.searchQuery.toLowerCase()
        const titleMatch = item.title.toLowerCase().includes(query)
        const descriptionMatch = item.description.toLowerCase().includes(query)
        
        if (!titleMatch && !descriptionMatch) {
          return false
        }
      }

      return true
    }).map(item => ({
      ...item,
      children: this.filterNavigationItems(item.children, criteria)
    }))
  }

  /**
   * Generate unique section ID
   */
  private generateSectionId(path: string): string {
    return path.replace(/^\/docs\//, '').replace(/\//g, '-') || 'root'
  }

  /**
   * Generate unique item ID
   */
  private generateItemId(path: string): string {
    return `nav-${path.replace(/\//g, '-').replace(/^-/, '')}`
  }

  /**
   * Count total items in navigation
   */
  private countTotalItems(sections: NavigationSection[]): number {
    return sections.reduce((total, section) => {
      return total + this.countItemsRecursive(section.items)
    }, 0)
  }

  /**
   * Count items recursively
   */
  private countItemsRecursive(items: NavigationItem[]): number {
    return items.reduce((count, item) => {
      return count + 1 + this.countItemsRecursive(item.children)
    }, 0)
  }

  /**
   * Calculate maximum depth
   */
  private calculateMaxDepth(sections: NavigationSection[]): number {
    return sections.reduce((maxDepth, section) => {
      const sectionDepth = this.calculateItemDepth(section.items)
      return Math.max(maxDepth, sectionDepth)
    }, 0)
  }

  /**
   * Calculate depth of navigation items
   */
  private calculateItemDepth(items: NavigationItem[]): number {
    if (items.length === 0) return 0
    
    return Math.max(...items.map(item => 
      1 + this.calculateItemDepth(item.children)
    ))
  }

  /**
   * Find path to specific node
   */
  private findNodePath(nodes: ContentNode[], targetPath: string): ContentNode[] {
    const path: ContentNode[] = []

    function search(currentNodes: ContentNode[], currentPath: ContentNode[]): boolean {
      for (const node of currentNodes) {
        const newPath = [...currentPath, node]
        
        if (node.path === targetPath) {
          path.push(...newPath)
          return true
        }
        
        if (search(node.children, newPath)) {
          return true
        }
      }
      return false
    }

    search(nodes, [])
    return path
  }

  /**
   * Find current section node
   */
  private findCurrentSection(nodes: ContentNode[], currentPath: string): ContentNode | null {
    // Find top-level section that contains current path
    for (const node of nodes) {
      if (currentPath.startsWith(node.path)) {
        return node
      }
    }
    return null
  }

  /**
   * Find sibling nodes
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
   * Find parent node
   */
  private findParentNode(nodes: ContentNode[], targetPath: string): ContentNode | null {
    function search(currentNodes: ContentNode[]): ContentNode | null {
      for (const node of currentNodes) {
        // Check if target is a direct child
        if (node.children.some(child => child.path === targetPath)) {
          return node
        }
        
        // Search in children
        const result = search(node.children)
        if (result) return result
      }
      return null
    }
    
    return search(nodes)
  }

  /**
   * Limit navigation depth
   */
  private limitNavigationDepth(items: NavigationItem[], maxDepth: number): NavigationItem[] {
    if (maxDepth <= 0) return []
    
    return items.map(item => ({
      ...item,
      children: item.level < maxDepth - 1 ? this.limitNavigationDepth(item.children, maxDepth) : []
    }))
  }
}

// Export singleton instance
export const navigationBuilder = new NavigationBuilder()

/**
 * Utility functions for navigation
 */
export class NavigationUtils {
  /**
   * Extract navigation metadata from content nodes
   */
  static extractMetadata(nodes: ContentNode[]): {
    totalPages: number
    sections: number
    averageDepth: number
    missingIcons: string[]
    locales: string[]
  } {
    const allNodes = NavigationUtils.flattenNodes(nodes)
    const missingIcons = allNodes.filter(node => !node.icon).map(node => node.path)
    const locales = [...new Set(allNodes.map(node => node.locale))]
    const totalDepth = allNodes.reduce((sum, node) => sum + node.level, 0)

    return {
      totalPages: allNodes.length,
      sections: nodes.length,
      averageDepth: allNodes.length > 0 ? totalDepth / allNodes.length : 0,
      missingIcons,
      locales
    }
  }

  /**
   * Flatten nested nodes into array
   */
  static flattenNodes(nodes: ContentNode[]): ContentNode[] {
    const flattened: ContentNode[] = []
    
    function traverse(currentNodes: ContentNode[]) {
      for (const node of currentNodes) {
        flattened.push(node)
        traverse(node.children)
      }
    }
    
    traverse(nodes)
    return flattened
  }

  /**
   * Validate navigation structure
   */
  static validateNavigation(nodes: ContentNode[]): {
    isValid: boolean
    errors: string[]
    warnings: string[]
  } {
    const errors: string[] = []
    const warnings: string[] = []
    
    const allNodes = NavigationUtils.flattenNodes(nodes)
    
    // Check for required fields
    for (const node of allNodes) {
      if (!node.title) {
        errors.push(`Missing title: ${node.path}`)
      }
      if (!node.description) {
        errors.push(`Missing description: ${node.path}`)
      }
      if (!node.icon && node.level === 0) {
        warnings.push(`Missing icon for top-level section: ${node.path}`)
      }
    }
    
    // Check for duplicate paths
    const paths = allNodes.map(node => node.path)
    const duplicates = paths.filter((path, index) => paths.indexOf(path) !== index)
    if (duplicates.length > 0) {
      errors.push(`Duplicate paths found: ${duplicates.join(', ')}`)
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }
}