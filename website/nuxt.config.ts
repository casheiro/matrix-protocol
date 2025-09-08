import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2024-12-20',
  devtools: { enabled: true },
  
  // Fix unhead compatibility issue
  experimental: {
    headNext: true
  },
  
  // App configuration
  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/assets/logos/matrix-protocol-icon-gray.svg'
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/assets/logos/matrix-protocol-icon-white.svg',
          media: '(prefers-color-scheme: dark)'
        }
      ]
    }
  },
  
  // Runtime configuration for environment variables
  runtimeConfig: {
    // Private keys (server-side only)
    apiSecret: '', // NUXT_API_SECRET
    
    // Public keys (exposed to client-side)
    public: {
      appName: 'Matrix Protocol', // NUXT_PUBLIC_APP_NAME
      appVersion: '1.0.0', // NUXT_PUBLIC_APP_VERSION
      appUrl: 'http://localhost:3000', // NUXT_PUBLIC_APP_URL
      githubUrl: 'https://github.com/matrix-protocol/matrix-protocol', // NUXT_PUBLIC_GITHUB_URL
      discordUrl: '', // NUXT_PUBLIC_DISCORD_URL
      discussionsUrl: '', // NUXT_PUBLIC_DISCUSSIONS_URL
      docsUrl: '', // NUXT_PUBLIC_DOCS_URL
      apiBaseUrl: 'http://localhost:4000', // NUXT_PUBLIC_API_BASE_URL
      plausibleDomain: '', // NUXT_PUBLIC_PLAUSIBLE_DOMAIN
      gaId: '', // NUXT_PUBLIC_GA_ID
    }
  },
  
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

  // Component configuration for auto-import
  components: {
    dirs: [
      '~/components',
      { path: '~/components/layout', prefix: '' },
      { path: '~/components/navigation', prefix: '' }
    ]
  },

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
      { 
        code: 'en', 
        iso: 'en-US', 
        name: 'English',
        file: 'en-US.json'
      },
      { 
        code: 'pt', 
        iso: 'pt-BR', 
        name: 'Português',
        file: 'pt-BR.json'
      }
    ],
    defaultLocale: 'pt',
    strategy: 'prefix',
    langDir: 'locales/',
    lazy: true,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },

  // Nuxt UI já configura colorMode
  colorMode: {
    preference: 'system',
    fallback: 'light'
  },

  // Configuração Nuxt UI
  ui: {
    global: true
  },

  // Security headers
  nitro: {
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Expose-Headers': '*'
        }
      }
    }
  }
})