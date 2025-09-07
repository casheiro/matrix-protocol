import { defineNuxtConfig } from 'nuxt/config'
export default defineNuxtConfig({
  compatibilityDate: '2024-12-20',
  devtools: { enabled: true },
  
  typescript: {
    strict: true,
    typeCheck: true
  },

  modules: [
    '@nuxt/ui',           // Nuxt UI (já inclui Tailwind)
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/google-fonts'
  ],

  css: ['~/assets/css/main.css'],

  // Configuração Google Fonts para Rajdhani
  googleFonts: {
    families: {
      Rajdhani: {
        wght: [300, 400, 500, 600, 700]
      },
      'Source Code Pro': {
        wght: [400, 500, 600]
      }
    },
    display: 'swap',
    preload: true
  },

  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', name: 'English' },
      { code: 'pt', iso: 'pt-BR', name: 'Português' }
    ],
    defaultLocale: 'pt',
    strategy: 'prefix'
  },

  // Nuxt UI já configura colorMode
  colorMode: {
    preference: 'system',
    fallback: 'light'
  },

  // Configuração Nuxt UI
  ui: {
    global: true
  }
})