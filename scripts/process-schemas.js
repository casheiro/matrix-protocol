#!/usr/bin/env node

/**
 * Script para processar schemas YAML e substituir URLs hardcoded por URLs dinâmicas
 * Usado durante build para gerar schemas com URLs corretas por ambiente
 */

import { readFile, writeFile, readdir, stat } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { parse, stringify } from 'yaml'

/**
 * Função auxiliar para formatar conteúdo de schema com comentários limpos
 */
function formatSchemaContent(originalContent, updatedYaml) {
  const lines = originalContent.split('\n')
  const commentLines = []
  
  // Extrair apenas comentários reais (linhas que começam com #)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith('#')) {
      commentLines.push(lines[i])
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

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configuração
const PROJECT_ROOT = join(__dirname, '..')
const CONTENT_DIR = join(PROJECT_ROOT, 'content')
const LOCALES = ['pt', 'en']
const SPECIFICATIONS_PATH = 'docs/frameworks/specifications'

// URLs de ambiente - detecção robusta baseada em múltiplas variáveis
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
  
  // URLs baseadas no contexto detectado
  if (isProd) {
    return 'https://matrix-protocol.org/schemas'
  } else if (isTest) {
    return 'http://localhost:3000/schemas'
  } else if (isDev) {
    // Usar porta do Nitro se disponível
    const port = process.env.NITRO_PORT || process.env.PORT || '3000'
    const host = process.env.NITRO_HOST || 'localhost'
    return `http://${host}:${port}/schemas`
  }
  
  // Fallback final
  return 'http://localhost:3000/schemas'
}

/**
 * Encontrar todos os arquivos YAML de schema recursivamente
 */
async function findSchemaFiles(dir) {
  const files = []
  
  try {
    const entries = await readdir(dir)
    
    for (const entry of entries) {
      const fullPath = join(dir, entry)
      const stats = await stat(fullPath)
      
      if (stats.isDirectory()) {
        const subFiles = await findSchemaFiles(fullPath)
        files.push(...subFiles)
      } else if (entry.endsWith('-schema.yaml')) {
        files.push(fullPath)
      }
    }
  } catch (error) {
    // Diretório pode não existir
    console.warn(`Warning: Could not read directory ${dir}`)
  }
  
  return files
}

/**
 * Processar um arquivo de schema individual
 */
async function processSchemaFile(filePath) {
  try {
    console.log(`Processing: ${filePath}`)
    
    // Ler arquivo YAML
    const content = await readFile(filePath, 'utf-8')
    const schema = parse(content)
    
    if (!schema || typeof schema !== 'object') {
      console.warn(`Warning: Invalid YAML in ${filePath}`)
      return false
    }
    
    // Verificar se tem $id para processar
    if (!schema.$id || typeof schema.$id !== 'string') {
      console.log(`Skipping ${filePath}: No $id field`)
      return false
    }
    
    const originalId = schema.$id
    
    // Extrair path do schema da URL original
    const urlMatch = originalId.match(/https?:\/\/[^\/]+\/schemas\/(.+)/)
    if (!urlMatch) {
      console.warn(`Warning: Could not parse schema URL in ${filePath}: ${originalId}`)
      return false
    }
    
    const schemaPath = urlMatch[1]
    const baseUrl = getSchemaBaseUrl()
    const newId = `${baseUrl}/${schemaPath}`
    
    // Atualizar $id
    schema.$id = newId
    
    // Gerar YAML atualizado
    const updatedContent = stringify(schema, {
      indent: 2,
      lineWidth: 120,
      minContentWidth: 0
    })
    
    // Formatar conteúdo final com comentários limpos
    const finalContent = formatSchemaContent(content, updatedContent)
    
    // Escrever arquivo atualizado
    await writeFile(filePath, finalContent, 'utf-8')
    
    console.log(`✓ Updated ${filePath}`)
    console.log(`  ${originalId} → ${newId}`)
    
    return true
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message)
    return false
  }
}

/**
 * Processar todos os schemas em todos os locales
 */
async function processAllSchemas() {
  console.log('🔄 Processing schema files...')
  console.log(`Schema base URL: ${getSchemaBaseUrl()}`)
  console.log('─'.repeat(60))
  
  let totalProcessed = 0
  let totalUpdated = 0
  
  for (const locale of LOCALES) {
    console.log(`\n📂 Processing locale: ${locale}`)
    
    const specsDir = join(CONTENT_DIR, locale, SPECIFICATIONS_PATH)
    const schemaFiles = await findSchemaFiles(specsDir)
    
    console.log(`Found ${schemaFiles.length} schema files`)
    
    for (const file of schemaFiles) {
      totalProcessed++
      const updated = await processSchemaFile(file)
      if (updated) {
        totalUpdated++
      }
    }
  }
  
  console.log('\n' + '─'.repeat(60))
  console.log(`✅ Completed! Processed ${totalProcessed} files, updated ${totalUpdated}`)
  
  if (totalUpdated === 0) {
    console.log('ℹ️  No files needed updating (URLs already correct)')
  }
}

/**
 * Validar schemas após processamento
 */
async function validateSchemas() {
  console.log('\n🔍 Validating processed schemas...')
  
  let validCount = 0
  let invalidCount = 0
  
  for (const locale of LOCALES) {
    const specsDir = join(CONTENT_DIR, locale, SPECIFICATIONS_PATH)
    const schemaFiles = await findSchemaFiles(specsDir)
    
    for (const file of schemaFiles) {
      try {
        const content = await readFile(file, 'utf-8')
        const schema = parse(content)
        
        if (schema && schema.$id && schema.$schema) {
          validCount++
        } else {
          console.warn(`⚠️  Invalid schema structure: ${file}`)
          invalidCount++
        }
      } catch (error) {
        console.error(`❌ Parse error in ${file}:`, error.message)
        invalidCount++
      }
    }
  }
  
  console.log(`✓ Valid schemas: ${validCount}`)
  if (invalidCount > 0) {
    console.log(`❌ Invalid schemas: ${invalidCount}`)
    process.exit(1)
  }
}

// Executar script
async function main() {
  const args = process.argv.slice(2)
  const validateOnly = args.includes('--validate-only')
  const forceRebuild = process.env.FORCE_SCHEMA_REBUILD === 'true'
  
  try {
    if (validateOnly) {
      console.log('🔍 Running schema validation only...')
      await validateSchemas()
      console.log('\n✅ Schema validation completed successfully!')
    } else {
      if (forceRebuild) {
        console.log('🔄 Force rebuilding all schemas...')
      }
      
      await processAllSchemas()
      await validateSchemas()
      console.log('\n🎉 Schema processing completed successfully!')
    }
  } catch (error) {
    console.error('❌ Script failed:', error)
    process.exit(1)
  }
}

// Executar apenas se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { processAllSchemas, validateSchemas }