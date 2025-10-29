import { defineCollection, defineContentConfig } from '@nuxt/content'
import { resolve } from 'path'

export default defineContentConfig({
  collections: {
    // Conteúdo completo em português - FONTE ÚNICA via sync-content.sh
    pt: defineCollection({
      type: 'page',
      source: {
        // Todo conteúdo PT sincronizado em /content/pt/
        cwd: resolve(__dirname, './content'),
        include: 'pt/**/*.{md,yaml,yml}',
        prefix: '/pt'
      }
    }),
    
    // Conteúdo completo em inglês - FONTE ÚNICA via sync-content.sh  
    en: defineCollection({
      type: 'page',
      source: {
        // Todo conteúdo EN sincronizado em /content/en/
        cwd: resolve(__dirname, './content'),
        include: 'en/**/*.{md,yaml,yml}',
        prefix: '/en'
      }
    })
  }
})