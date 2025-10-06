import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    // Coleção para especificações em português - lendo de ../docs/
    pt_specs: defineCollection({
      type: 'page',
      source: {
        include: '../docs/specifications/pt/**',
        prefix: '/pt/specifications'
      }
    }),
    // Coleção para especificações em inglês - lendo de ../docs/
    en_specs: defineCollection({
      type: 'page', 
      source: {
        include: '../docs/specifications/en/**',
        prefix: '/en/specifications'
      }
    }),
    // Coleção para guides - lendo de ../docs/
    guides: defineCollection({
      type: 'page',
      source: {
        include: '../docs/guides/**',
        prefix: '/guides'
      }
    }),
    // Coleção para manual - lendo de ../docs/
    manual: defineCollection({
      type: 'page',
      source: {
        include: '../docs/manual/**',
        prefix: '/manual'
      }
    }),
    // Coleção para templates - lendo de ../docs/
    templates: defineCollection({
      type: 'page',
      source: {
        include: '../docs/templates/**',
        prefix: '/templates'
      }
    }),
    // Coleção para examples - lendo de ../docs/
    examples: defineCollection({
      type: 'page',
      source: {
        include: '../docs/examples/**',
        prefix: '/examples'
      }
    }),
    // Coleção para visualizations - lendo de ../docs/
    visualizations: defineCollection({
      type: 'page',
      source: {
        include: '../docs/visualizations/**',
        prefix: '/visualizations'
      }
    })
  }
})