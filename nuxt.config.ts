import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'path'

// Helper function para extrair mensagens de erro de tipos unknown
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  return String(error)
}

// Função auxiliar para formatar conteúdo de schema com comentários limpos
const formatSchemaContent = (originalContent: string, updatedYaml: string): string => {
  const lines = originalContent.split('\n')
  const commentLines: string[] = []
  
  // Extrair apenas comentários reais (linhas que começam com #)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trim() ?? ''
    if (line.startsWith('#')) {
      commentLines.push(lines[i]!)
    } else if (line !== '') {
      // Primeira linha não-vazia e não-comentário = início do YAML
      break
    }
  }
  
  // Combinar comentários com YAML atualizado
  if (commentLines.length > 0) {
    // Usar apenas uma linha vazia entre comentários e YAML
    return commentLines.join('\n') + '\n\n' + updatedYaml
  }
  
  return updatedYaml
}

// Nota: Removida interface customizada ContentFileContext para usar tipos oficiais do Nuxt Content
// O Nuxt Content agora exporta FileBeforeParseHook que deve ser usado

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
      // Schema URLs - dinâmico baseado no ambiente
      schemaBaseUrl: process.env.SCHEMA_BASE_URL || (process.env.NODE_ENV === 'production' 
        ? 'https://matrix-protocol.org/schemas'
        : `${process.env.SITE_URL || 'http://localhost:3000'}/schemas`),
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
  },
  
  // Build hooks para processar schemas
  hooks: {
    // Content hook - processa schemas YAML durante parse do content
    'content:file:beforeParse': async (ctx) => {
      // Usar propriedade 'path' que está sempre disponível
      const filePath = ctx.file?.path || ''
      
      // Só processar arquivos de schema YAML  
      if (!filePath.endsWith('-schema.yaml')) {
        return
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Content Hook] Processing schema: ${filePath}`)
      }
      
      try {
        const { parse, stringify } = await import('yaml')
        
        // Parse do YAML atual
        const schema = parse(ctx.file.body)
        
        if (!schema || !schema.$id) {
          return
        }
        
        // Gerar URL baseada no ambiente (mesma lógica do script)
        const getSchemaBaseUrl = () => {
          // Prioridade 1: Override explícito
          if (process.env.SCHEMA_BASE_URL) {
            return process.env.SCHEMA_BASE_URL
          }
          
          // Prioridade 2: SITE_URL + /schemas
          if (process.env.SITE_URL) {
            return `${process.env.SITE_URL}/schemas`
          }
          
          // Prioridade 3: Detecção de ambiente
          const nodeEnv = process.env.NODE_ENV || 'development'
          const isDev = nodeEnv === 'development' || nodeEnv === 'dev'
          const isTest = nodeEnv === 'test'
          const isProd = nodeEnv === 'production'
          
          if (isProd) {
            return 'https://matrix-protocol.org/schemas'
          } else if (isTest) {
            return 'http://localhost:3000/schemas'
          } else if (isDev) {
            const port = process.env.NITRO_PORT || process.env.PORT || '3000'
            const host = process.env.NITRO_HOST || 'localhost'
            return `http://${host}:${port}/schemas`
          }
          
          return 'http://localhost:3000/schemas'
        }
        
        const baseSchemaUrl = getSchemaBaseUrl()
        
        // Extrair path do schema da URL original
        const urlMatch = schema.$id.match(/https?:\/\/[^\/]+\/schemas\/(.+)/)
        if (urlMatch) {
          const schemaPath = urlMatch[1]
          const newId = `${baseSchemaUrl}/${schemaPath}`
          
          // Atualizar $id se necessário
          if (schema.$id !== newId) {
            schema.$id = newId
            
            // Regenerar YAML com novo $id
            const updatedYaml = stringify(schema, {
              indent: 2,
              lineWidth: 120,
              minContentWidth: 0
            })
            
            // Aplicar formatação limpa mantendo comentários
            ctx.file.body = formatSchemaContent(ctx.file.body, updatedYaml)
            
            if (process.env.NODE_ENV === 'development') {
              console.log(`[Content Hook] Updated ${filePath}: ${newId}`)
            }
          }
        }
      } catch (error) {
        console.warn(`[Content Hook] Failed to process ${filePath}:`, getErrorMessage(error))
      }
    },
    
    // Build hook - fallback e validação final (documentado no Nuxt 4.x)
    'build:before': async () => {
      // Debug mode ou fallback para schemas não processados pelo content
      if (process.env.DEBUG_SCHEMAS === 'true' || process.env.FORCE_SCHEMA_REBUILD === 'true') {
        console.log('🔄 Running schema processing before build...')
        
        try {
          const { processAllSchemas } = await import('./scripts/process-schemas.js')
          await processAllSchemas()
          console.log('✅ Schema processing completed via build hook')
        } catch (error) {
          console.warn('⚠️  Schema processing failed in build hook:', getErrorMessage(error))
          // Não falhar o build, apenas avisar
        }
      }
      
      // Sempre validar schemas antes do build
      try {
        const { validateSchemas } = await import('./scripts/process-schemas.js')
        await validateSchemas()
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Schema validation passed')
        }
      } catch (error) {
        console.warn('⚠️  Schema validation failed:', getErrorMessage(error))
      }
    },
    
    // Nitro hook - configuração final antes do build do Nitro (documentado no Nuxt 4.x)
    'nitro:build:before': async (nitro) => {
      // Garantir que schemas estão corretos para o ambiente de produção
      if (process.env.NODE_ENV === 'production') {
        console.log('🔄 Final schema validation for production Nitro build...')
        
        try {
          const { validateSchemas } = await import('./scripts/process-schemas.js')
          await validateSchemas()
          console.log('✅ Production schema validation completed')
        } catch (error) {
          console.error('❌ Production schema validation failed:', getErrorMessage(error))
          throw new Error('Schema validation failed for production build')
        }
      }
    },
    
    // Hook adicional para build completed (garantir logs claros)
    'build:done': async () => {
      console.log('🎉 Build completed! Schema URLs are ready for environment:', process.env.NODE_ENV || 'development')
    }
  }
})