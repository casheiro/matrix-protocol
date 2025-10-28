import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'path'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    // './app/modules/link-transformer', // REMOVIDO - transformação via sync script
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt'
  ],
  content: {
    // Disable database to avoid better-sqlite3 issues
    experimental: {
      sqliteConnector: 'native' // usa node:sqlite (Node >= 22.5)
    }
  },
  typescript: {
    typeCheck: false,
    includeWorkspace: true
  },
  i18n: {
    locales: [
      { 
        code: 'pt', 
        name: 'Português',
        file: 'pt.json',
        iso: 'pt-BR'
      },
      { 
        code: 'en', 
        name: 'English',
        file: 'en.json',
        iso: 'en-US'
      }
    ],
    defaultLocale: 'pt',
    strategy: 'prefix',
    langDir: './locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'matrix_locale',
      redirectOn: 'root',  
      alwaysRedirect: false,
      fallbackLocale: 'pt'
    }
  },
  googleFonts: {
    families: {
      'Rajdhani': [400, 500, 600, 700],
      'Source Code Pro': [400, 500, 600]
    },
    display: 'swap',
    preconnect: true,
    preload: true
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      appName: 'Matrix Protocol',
      appVersion: '0.0.1',
      siteUrl: process.env.SITE_URL || 'http://localhost:5000',
      casheiroUrl: 'https://casheiro.com.br',
      githubUrl: process.env.GITHUB_URL || 'https://github.com/casheiro/matrix-protocol',
      discordUrl: process.env.DISCORD_URL || 'https://discord.gg/Gd7BxsRhB4'
    }
  },
  app: {
    head: {
      title: 'Matrix Protocol',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Matrix Protocol - Open network for secure, decentralized communication' }
      ]
    }
  },
  devServer: {
    host: process.env.NITRO_HOST || 'localhost',
    port: process.env.NITRO_PORT ? parseInt(process.env.NITRO_PORT) : 3000
  },
  nitro: {
    experimental: {
      wasm: true
    }
  },
  // Auto-imports configuração para Nuxt 4.x
  imports: {
    dirs: [
      'shared/types/**',
      'shared/utils/**',
      'types/**'
    ]
  }
})