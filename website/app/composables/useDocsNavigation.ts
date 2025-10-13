export const useDocsNavigation = () => {
  const { t } = useI18n()

  // Helper function to build dynamic children for a section
  const buildDynamicChildren = async (locale: string, basePath: string) => {
    try {
      console.log(`🔍 Building dynamic children for ${basePath} (locale: ${locale})`)

      // Query all content under the base path for this locale
      // Fix: Include locale prefix since collections have prefix: '/pt' or '/en'
      const fullPath = `/${locale}${basePath}`
      console.log(`🔍 Searching for content with path: ${fullPath}/%`)
      
      const allContent = await queryCollection(locale as 'pt' | 'en')
        .where('path', 'LIKE', `${fullPath}/%`)
        .all()

      console.log(`📋 Found ${allContent?.length || 0} items under ${basePath}`)
      allContent?.forEach((item, index) => {
        if (index < 5) { // Show first 5 for debugging
          console.log(`  ${index + 1}. ${item.path} - ${item.title || 'No title'}`)
        }
      })

      if (!allContent || allContent.length === 0) {
        console.log(`⚠️ No content found under ${basePath}`)
        return []
      }

      // Simplified approach - create flat list first
      const children = []

      // Sort by path to ensure proper hierarchy
      // Fix 3: Use 'path' instead of '_path'
      allContent.sort((a, b) => a.path.localeCompare(b.path))

      for (const content of allContent) {
        // Skip index files at the base level (already handled by parent)
        if (content.path === basePath) continue

        // Create entry for each piece of content
        // Ensure title is always a string
        children.push({
          title: content.title || content.path.split('/').pop()?.replace(/[-_]/g, ' ') || 'Untitled',
          path: content.path,
          icon: 'i-heroicons-document-text'
        })
      }

      console.log(`✅ Built ${children.length} navigation items`)
      return children
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

    // Build dynamic examples section
    console.log('🔍 Starting dynamic examples navigation build...')
    const examplesChildren = await buildDynamicChildren(locale, '/docs/examples')
    console.log(`📁 Examples children count: ${examplesChildren.length}`)
    
    const examplesSection = {
      title: t('docs.sections.examples'),
      path: `/docs/examples`,
      icon: 'i-heroicons-rectangle-stack',
      children: examplesChildren
    }
    
    navigation.push(examplesSection)
    
    console.log(`🎯 Final navigation items: ${navigation.length}`)
    console.log('📋 Examples section:', JSON.stringify(examplesSection, null, 2))

    return navigation
  }

  return {
    getDocsNavigation
  }
}