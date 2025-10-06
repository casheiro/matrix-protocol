import { defineCollection, defineContentConfig } from '@nuxt/content'
import { resolve } from 'path'

export default defineContentConfig({
  collections: {
    // Todo conteúdo em português (specifications + guides)
    pt: defineCollection({
      type: 'page',
      source: [
        {
          // Specifications em português
          cwd: resolve(__dirname, '../docs'),
          include: 'specifications/pt/**/*.md',
          prefix: '/pt'
        },
        {
          // Guides em português
          cwd: resolve(__dirname, '../docs'),
          include: 'guides/pt/**/*.md',
          prefix: '/pt'
        }
      ]
    }),
    
    // Todo conteúdo em inglês (specifications + guides)
    en: defineCollection({
      type: 'page',
      source: [
        {
          // Specifications em inglês
          cwd: resolve(__dirname, '../docs'),
          include: 'specifications/en/**/*.md',
          prefix: '/en'
        },
        {
          // Guides em inglês
          cwd: resolve(__dirname, '../docs'),
          include: 'guides/en/**/*.md',
          prefix: '/en'
        }
      ]
    })
  }
})