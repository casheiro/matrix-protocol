import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    // Coleção para conteúdo em português
    pt: defineCollection({
      type: 'page',
      source: {
        include: 'pt/**',
        prefix: '/pt'
      }
    }),
    // Coleção para conteúdo em inglês
    en: defineCollection({
      type: 'page', 
      source: {
        include: 'en/**',
        prefix: '/en'
      }
    })
  }
})