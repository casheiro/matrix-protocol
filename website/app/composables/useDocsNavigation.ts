export const useDocsNavigation = () => {
  const { t } = useI18n()

  const getDocsNavigation = async (locale: string) => {
    // Base navigation structure for docs
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
      },
      {
        title: t('docs.sections.examples'),
        path: `/docs/examples`,
        icon: 'i-heroicons-rectangle-stack'
      }
    ]

    return navigation
  }

  return {
    getDocsNavigation
  }
}