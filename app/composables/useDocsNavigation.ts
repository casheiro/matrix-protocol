export const useDocsNavigation = () => {
  const { t } = useI18n()

  // Cache for dynamic navigation to avoid repeated queries
  const navigationCache = new Map<string, { data: any[], timestamp: number }>()
  const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  // Optimized helper function to build hierarchical navigation tree
  const buildDynamicChildren = async (locale: string, basePath: string) => {
    const cacheKey = `${locale}-${basePath}`
    
    // Check cache first
    if (navigationCache.has(cacheKey)) {
      const cached = navigationCache.get(cacheKey)!
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data
      }
    }
    
    try {
      // Query all content under the base path for this locale - OPTIMIZED
      const fullPath = `/${locale}${basePath}`
      
      const allContent = await queryCollection(locale as 'pt' | 'en')
        .where('path', 'LIKE', `${fullPath}/%`)
        .all()

      if (!allContent || allContent.length === 0) {
        return []
      }

      // Sort by path to ensure proper hierarchy
      allContent.sort((a: any, b: any) => a.path.localeCompare(b.path))

      // Build hierarchical structure
      const buildHierarchy = (items: any[], currentPath: string): any[] => {
        const children = []
        const processedPaths = new Set()
        
        for (const item of items) {
          const pathWithoutLocale = item.path.replace(/^\/[a-z]{2}/, '')
          
          // Skip if already processed or if it's the exact base path
          if (processedPaths.has(pathWithoutLocale) || pathWithoutLocale === currentPath) {
            continue
          }
          
          // Get relative path from current level
          const relativePath = pathWithoutLocale.substring(currentPath.length)
          const segments = relativePath.split('/').filter(Boolean)
          
          if (segments.length === 0) continue
          
          const firstSegment = segments[0]
          const nextPath = `${currentPath}/${firstSegment}`
          
          // Check if this is a directory (has an index.md or other files under it)
          const isDirectory = items.some(other => {
            const otherPathWithoutLocale = other.path.replace(/^\/[a-z]{2}/, '')
            return otherPathWithoutLocale.startsWith(nextPath + '/') && 
                   otherPathWithoutLocale !== nextPath
          })
          
          if (isDirectory) {
            // Find the index file for this directory if it exists
            const indexFile = items.find(other => {
              const otherPathWithoutLocale = other.path.replace(/^\/[a-z]{2}/, '')
              return otherPathWithoutLocale === nextPath || 
                     otherPathWithoutLocale === `${nextPath}/index`
            })
            
            // Get all items under this directory
            const childItems = items.filter(other => {
              const otherPathWithoutLocale = other.path.replace(/^\/[a-z]{2}/, '')
              return otherPathWithoutLocale.startsWith(nextPath + '/')
            })
            
            // Recursively build children for this directory
            const grandChildren: any[] = buildHierarchy(childItems, nextPath)
            
            children.push({
              title: indexFile?.title || firstSegment.replace(/[-_]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
              path: nextPath,
              icon: 'i-heroicons-folder',
              children: grandChildren
            })
            
            // Mark all paths under this directory as processed
            childItems.forEach(child => {
              processedPaths.add(child.path.replace(/^\/[a-z]{2}/, ''))
            })
            processedPaths.add(nextPath)
            
          } else if (segments.length === 1) {
            // This is a direct file under current directory
            children.push({
              title: item.title || firstSegment.replace(/[-_]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
              path: pathWithoutLocale,
              icon: 'i-heroicons-document-text'
            })
            processedPaths.add(pathWithoutLocale)
          }
        }
        
        // Sort: directories first, then files, both alphabetically
        return children.sort((a, b) => {
          if (a.children && !b.children) return -1
          if (!a.children && b.children) return 1
          return a.title.localeCompare(b.title)
        })
      }

      const result = buildHierarchy(allContent, basePath)
      
      // Cache the result
      navigationCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      })
      
      return result
    } catch (error) {
      console.warn(`Failed to build dynamic children for ${basePath}:`, error)
      return []
    }
  }

  const getDocsNavigation = async (locale: string) => {
    // Base navigation structure for docs (keeping core structure)
    const navigation = [
      {
        title: t('docs.sections.quickstart'),
        path: `/docs/quickstart`,
        icon: 'i-heroicons-rocket-launch'
      },
      {
        title: t('docs.sections.implementation'),
        path: `/docs/implementation`,
        icon: 'i-heroicons-cog-6-tooth'
      },
      {
        title: t('docs.sections.integration'),
        path: `/docs/integration`,
        icon: 'i-heroicons-arrows-right-left'
      },
      {
        title: t('docs.sections.glossary'),
        path: `/docs/glossary`,
        icon: 'i-heroicons-book-open'
      },
      {
        title: t('docs.sections.protocol'),
        path: `/docs/protocol`,
        icon: 'i-heroicons-document-text',
        children: []
      },
      {
        title: t('docs.sections.frameworks'),
        path: `/docs/frameworks`,
        icon: 'i-heroicons-cube',
        children: [
          {
            title: t('docs.frameworks.mef'),
            path: `/docs/frameworks/mef`,
            icon: 'i-heroicons-cube'
          },
          {
            title: t('docs.frameworks.zof'), 
            path: `/docs/frameworks/zof`,
            icon: 'i-heroicons-cube'
          },
          {
            title: t('docs.frameworks.oif'),
            path: `/docs/frameworks/oif`, 
            icon: 'i-heroicons-cube'
          },
          {
            title: t('docs.frameworks.moc'),
            path: `/docs/frameworks/moc`,
            icon: 'i-heroicons-cube'
          },
          {
            title: t('docs.frameworks.mal'),
            path: `/docs/frameworks/mal`,
            icon: 'i-heroicons-cube'
          }
        ]
      },
      {
        title: t('docs.sections.mep'),
        path: `/docs/mep`,
        icon: 'i-heroicons-light-bulb'
      },
      {
        title: t('docs.sections.manual'),
        path: `/docs/manual`,
        icon: 'i-heroicons-book-open',
        children: [
          {
            title: t('docs.manual.templates'),
            path: `/docs/manual/templates`,
            icon: 'i-heroicons-document-duplicate'
          },
          {
            title: t('docs.manual.tools'),
            path: `/docs/manual/tools`,
            icon: 'i-heroicons-wrench-screwdriver'
          },
          {
            title: t('docs.manual.examples'),
            path: `/docs/manual/examples`,
            icon: 'i-heroicons-rectangle-stack'
          },
          {
            title: t('docs.manual.reference'),
            path: `/docs/manual/reference`,
            icon: 'i-heroicons-academic-cap'
          }
        ]
      }
    ]

    // Build dynamic examples section - OPTIMIZED
    const examplesChildren = await buildDynamicChildren(locale, '/docs/examples')
    
    if (examplesChildren.length > 0) {
      const examplesSection = {
        title: t('docs.sections.examples'),
        path: `/docs/examples`,
        icon: 'i-heroicons-rectangle-stack',
        children: examplesChildren
      }
      navigation.push(examplesSection)
    }
    
    // Build dynamic manual section - EXPANDED DYNAMISM
    const manualChildren = await buildDynamicChildren(locale, '/docs/manual')
    if (manualChildren.length > 0) {
      const manualSection = {
        title: t('docs.sections.manual'),
        path: `/docs/manual`,
        icon: 'i-heroicons-book-open',
        children: manualChildren
      }
      navigation.push(manualSection)
    }

    return navigation
  }

  return {
    getDocsNavigation
  }
}