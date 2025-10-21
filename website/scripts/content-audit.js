#!/usr/bin/env node
/**
 * 📋 SCRIPT DE AUDITORIA - NAVEGAÇÃO DINÂMICA
 * 
 * TASK 1.1.1: Criar Script de Auditoria
 * Responsável: Ricardo (Nuxt Specialist)
 * Frameworks: Context7 + Read + Glob + Write
 * 
 * Este script mapeia toda estrutura de conteúdo e gera relatório
 * completo para o sistema de navegação dinâmica.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configurações
const CONTENT_ROOT = path.join(__dirname, '../content')
const OUTPUT_DIR = path.join(__dirname, '../docs/dynamic-navigation/audit-reports')
const SUPPORTED_LOCALES = ['pt', 'en']

/**
 * Interface para o relatório de auditoria
 */
class ContentAuditReport {
  constructor() {
    this.totalFiles = 0
    this.totalFolders = 0
    this.structure = []
    this.missingIndexFiles = []
    this.frontmatterPatterns = new Map()
    this.filesByExtension = new Map()
    this.depthAnalysis = new Map()
    this.recommendations = []
    this.localeComparison = {}
    this.metadataInconsistencies = []
    this.timestamp = new Date().toISOString()
  }
}

/**
 * Estrutura de pasta para mapeamento hierárquico
 */
class FolderStructure {
  constructor(name, fullPath, relativePath, depth = 0) {
    this.name = name
    this.fullPath = fullPath
    this.relativePath = relativePath
    this.depth = depth
    this.files = []
    this.subfolders = []
    this.hasIndexFile = false
    this.metadata = null
    this.fileCount = 0
    this.yamlCount = 0
    this.mdCount = 0
  }
}

/**
 * Padrão de metadados encontrado
 */
class MetadataPattern {
  constructor(field, values = [], frequency = 0, locations = []) {
    this.field = field
    this.values = new Set(values)
    this.frequency = frequency
    this.locations = locations
    this.isConsistent = true
  }

  addValue(value, location) {
    this.values.add(value)
    this.frequency++
    this.locations.push(location)
  }
}

/**
 * Extrai frontmatter de um arquivo markdown
 */
import Ajv from 'ajv'
const schemaPath = path.join(__dirname, './frontmatter-schema.json')
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'))
function extractFrontmatter(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/)
    
    if (!frontmatterMatch) {
      return null
    }

    const frontmatterText = frontmatterMatch[1]
    const metadata = {}
    
    // Parser simples de YAML (para as propriedades que nos interessam)
    const lines = frontmatterText.split('\n')
    for (const line of lines) {
      const match = line.match(/^(\w+):\s*(.*)$/)
      if (match) {
        const [, key, value] = match
        metadata[key] = value.replace(/^["']|["']$/g, '') // Remove aspas
      }
    }
    
    return metadata
  } catch (error) {
    console.warn(`Erro ao extrair frontmatter de ${filePath}:`, error.message)
    return null
  }
}

/**
 * Mapeia recursivamente a estrutura de diretórios
 */
function mapDirectoryStructure(dirPath, relativePath = '', depth = 0) {
  const stats = fs.statSync(dirPath)
  if (!stats.isDirectory()) {
    return null
  }

  const folderName = path.basename(dirPath)
  const folder = new FolderStructure(folderName, dirPath, relativePath, depth)
  
  try {
    const items = fs.readdirSync(dirPath)
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item)
      const itemRelativePath = path.join(relativePath, item)
      const itemStats = fs.statSync(itemPath)
      
      if (itemStats.isDirectory()) {
        // Processar subpasta
        const subfolder = mapDirectoryStructure(itemPath, itemRelativePath, depth + 1)
        if (subfolder) {
          folder.subfolders.push(subfolder)
        }
      } else {
        // Processar arquivo
        const ext = path.extname(item).toLowerCase()
        folder.files.push({
          name: item,
          path: itemPath,
          relativePath: itemRelativePath,
          extension: ext,
          size: itemStats.size,
          modified: itemStats.mtime
        })
        
        folder.fileCount++
        
        if (ext === '.md') {
          folder.mdCount++
          if (item === 'index.md') {
            folder.hasIndexFile = true
            folder.metadata = extractFrontmatter(itemPath)
          }
        } else if (ext === '.yaml' || ext === '.yml') {
          folder.yamlCount++
        }
      }
    }
  } catch (error) {
    console.warn(`Erro ao ler diretório ${dirPath}:`, error.message)
  }
  
  return folder
}

/**
 * Analisa padrões de frontmatter em todos os arquivos
 */
function validateFrontmatterSchema(metadata, filePath, ajv, report) {
  const validate = ajv.getSchema('frontmatter') || ajv.compile({ $id: 'frontmatter', ...schema })
  const valid = validate(metadata || {})
  if (!valid) {
    report.metadataInconsistencies.push({
      type: 'schema_violation',
      file: filePath,
      errors: validate.errors
    })
  }
}

function analyzeFrontmatterPatterns(structure, patterns = new Map(), report) {
  const ajv = new Ajv({ allErrors: true })
  // Analisar arquivos na pasta atual
  for (const file of structure.files) {
    if (file.extension === '.md') {
      const metadata = extractFrontmatter(file.path)
      if (metadata) {
        validateFrontmatterSchema(metadata, file.relativePath, ajv, report)
        for (const [key, value] of Object.entries(metadata)) {
          if (!patterns.has(key)) {
            patterns.set(key, new MetadataPattern(key))
          }
          patterns.get(key).addValue(value, file.relativePath)
        }
        // Política de nomes: apenas inglês para arquivos e diretórios
        const namePolicyViolations = []
        const rel = file.relativePath
        const segments = rel.split('/')
        for (const seg of segments) {
          if (seg.endsWith('.md')) {
            const base = seg.replace(/\.md$/, '')
            // Files: enforce kebab-case lowercase only
            if (!/^[a-z0-9-]+$/.test(base)) {
              namePolicyViolations.push({ segment: seg, rule: 'kebab-case lowercase (content files)' })
            }
          } else {
            // Directories: enforce kebab-case lowercase only (no underscores)
            if (!/^[a-z0-9-]+$/.test(seg)) {
              namePolicyViolations.push({ segment: seg, rule: 'kebab-case lowercase (directories)' })
            }
          }
        }
        if (namePolicyViolations.length) {
          report.metadataInconsistencies.push({
            type: 'naming_policy_violation',
            file: file.relativePath,
            violations: namePolicyViolations
          })
        }
      } else if (file.name !== 'index.md') {
        report.metadataInconsistencies.push({
          type: 'missing_frontmatter',
          file: file.relativePath,
          message: 'Arquivo .md sem frontmatter'
        })
      }
    }
  }
  
  // Analisar subpastas recursivamente
  for (const subfolder of structure.subfolders) {
    analyzeFrontmatterPatterns(subfolder, patterns, report)
  }
  
  return patterns
}

/**
 * Encontra pastas sem arquivo index.md
 */
function findMissingIndexFiles(structure, missingList = []) {
  // Verificar se a pasta atual precisa de index.md
  if (structure.files.length > 0 || structure.subfolders.length > 0) {
    if (!structure.hasIndexFile && structure.depth > 0) {
      missingList.push(structure.relativePath)
    }
  }
  
  // Verificar subpastas recursivamente
  for (const subfolder of structure.subfolders) {
    findMissingIndexFiles(subfolder, missingList)
  }
  
  return missingList
}

/**
 * Analisa estatísticas de arquivos por extensão
 */
function analyzeFilesByExtension(structure, extensionMap = new Map()) {
  for (const file of structure.files) {
    const ext = file.extension || 'no-extension'
    if (!extensionMap.has(ext)) {
      extensionMap.set(ext, { count: 0, totalSize: 0, files: [] })
    }
    const extData = extensionMap.get(ext)
    extData.count++
    extData.totalSize += file.size
    extData.files.push(file.relativePath)
  }
  
  for (const subfolder of structure.subfolders) {
    analyzeFilesByExtension(subfolder, extensionMap)
  }
  
  return extensionMap
}

/**
 * Analisa distribuição por profundidade
 */
function analyzeDepthDistribution(structure, depthMap = new Map()) {
  const depth = structure.depth
  if (!depthMap.has(depth)) {
    depthMap.set(depth, { folders: 0, files: 0, mdFiles: 0, yamlFiles: 0 })
  }
  
  const depthData = depthMap.get(depth)
  depthData.folders++
  depthData.files += structure.fileCount
  depthData.mdFiles += structure.mdCount
  depthData.yamlFiles += structure.yamlCount
  
  for (const subfolder of structure.subfolders) {
    analyzeDepthDistribution(subfolder, depthMap)
  }
  
  return depthMap
}

/**
 * Compara estruturas entre locales
 */
function compareLocaleStructures(structures) {
  const comparison = {
    commonPaths: [],
    ptOnly: [],
    enOnly: [],
    structureDifferences: []
  }
  
  if (structures.pt && structures.en) {
    const ptPaths = new Set()
    const enPaths = new Set()
    
    // Coleta todos os caminhos
    function collectPaths(structure, pathSet, prefix = '') {
      const currentPath = prefix + structure.name
      pathSet.add(currentPath)
      
      for (const subfolder of structure.subfolders) {
        collectPaths(subfolder, pathSet, currentPath + '/')
      }
    }
    
    collectPaths(structures.pt, ptPaths)
    collectPaths(structures.en, enPaths)
    
    // Compara caminhos
    comparison.commonPaths = Array.from(ptPaths).filter(path => enPaths.has(path))
    comparison.ptOnly = Array.from(ptPaths).filter(path => !enPaths.has(path))
    comparison.enOnly = Array.from(enPaths).filter(path => !ptPaths.has(path))
  }
  
  return comparison
}

/**
 * Gera recomendações baseadas na análise
 */
function generateRecommendations(report) {
  const recommendations = []
  
  // Recomendações sobre arquivos index faltantes
  if (report.missingIndexFiles.length > 0) {
    recommendations.push({
      priority: 'HIGH',
      category: 'Structure',
      title: 'Adicionar arquivos index.md faltantes',
      description: `${report.missingIndexFiles.length} pastas não possuem arquivo index.md`,
      action: 'Criar arquivos index.md nas pastas listadas',
      files: report.missingIndexFiles.slice(0, 5), // Primeiros 5
      totalAffected: report.missingIndexFiles.length
    })
  }
  
  // Recomendações sobre frontmatter
  const inconsistentFields = Array.from(report.frontmatterPatterns.values())
    .filter(pattern => pattern.values.size > 10) // Muita variação
  
  if (inconsistentFields.length > 0) {
    recommendations.push({
      priority: 'MEDIUM',
      category: 'Metadata',
      title: 'Padronizar campos de frontmatter',
      description: `${inconsistentFields.length} campos com alta variação de valores`,
      action: 'Revisar e padronizar valores dos campos',
      fields: inconsistentFields.map(f => f.field)
    })
  }
  
  // Recomendações sobre profundidade
  const maxDepth = Math.max(...report.depthAnalysis.keys())
  if (maxDepth > 4) {
    recommendations.push({
      priority: 'LOW',
      category: 'Structure',
      title: 'Revisar hierarquia profunda',
      description: `Estrutura com ${maxDepth} níveis de profundidade`,
      action: 'Considerar reorganização para reduzir complexidade'
    })
  }
  
  // Recomendações sobre diferenças entre locales
  if (report.localeComparison.ptOnly?.length > 0 || report.localeComparison.enOnly?.length > 0) {
    recommendations.push({
      priority: 'HIGH',
      category: 'Localization',
      title: 'Alinhar estruturas entre idiomas',
      description: 'Diferenças estruturais entre PT e EN',
      action: 'Sincronizar estruturas de pastas entre idiomas',
      ptOnly: report.localeComparison.ptOnly?.slice(0, 3),
      enOnly: report.localeComparison.enOnly?.slice(0, 3)
    })
  }
  
  return recommendations
}

/**
 * Conta total de arquivos recursivamente
 */
function countTotalFiles(structure) {
  let total = structure.fileCount
  for (const subfolder of structure.subfolders) {
    total += countTotalFiles(subfolder)
  }
  return total
}

/**
 * Conta total de pastas recursivamente  
 */
function countTotalFolders(structure) {
  let total = 1 // pasta atual
  for (const subfolder of structure.subfolders) {
    total += countTotalFolders(subfolder)
  }
  return total
}

/**
 * Executa a auditoria completa
 */
async function runAudit() {
  console.log('🔍 Iniciando auditoria da estrutura de conteúdo...')
  
  const report = new ContentAuditReport()
  const structures = {}
  
  // Mapear estrutura para cada locale
  for (const locale of SUPPORTED_LOCALES) {
    const localePath = path.join(CONTENT_ROOT, locale, 'docs')
    
    if (fs.existsSync(localePath)) {
      console.log(`📁 Analisando estrutura: ${locale}/docs`)
      structures[locale] = mapDirectoryStructure(localePath, `${locale}/docs`)
      
      if (structures[locale]) {
        report.structure.push(structures[locale])
        
        // Analisar padrões de frontmatter
        const patterns = analyzeFrontmatterPatterns(structures[locale], new Map(), report)
        
        // Mergear padrões no relatório
        for (const [key, pattern] of patterns) {
          if (!report.frontmatterPatterns.has(key)) {
            report.frontmatterPatterns.set(key, pattern)
          } else {
            const existingPattern = report.frontmatterPatterns.get(key)
            for (const value of pattern.values) {
              existingPattern.values.add(value)
            }
            existingPattern.frequency += pattern.frequency
            existingPattern.locations.push(...pattern.locations)
          }
        }
        
        // Encontrar arquivos index faltantes
        const missingIndexes = findMissingIndexFiles(structures[locale])
        report.missingIndexFiles.push(...missingIndexes)
        
        // Analisar arquivos por extensão
        const filesByExt = analyzeFilesByExtension(structures[locale])
        for (const [ext, data] of filesByExt) {
          if (!report.filesByExtension.has(ext)) {
            report.filesByExtension.set(ext, { count: 0, totalSize: 0, files: [] })
          }
          const existing = report.filesByExtension.get(ext)
          existing.count += data.count
          existing.totalSize += data.totalSize
          existing.files.push(...data.files)
        }
        
        // Analisar distribuição por profundidade
        const depthDist = analyzeDepthDistribution(structures[locale])
        for (const [depth, data] of depthDist) {
          if (!report.depthAnalysis.has(depth)) {
            report.depthAnalysis.set(depth, { folders: 0, files: 0, mdFiles: 0, yamlFiles: 0 })
          }
          const existing = report.depthAnalysis.get(depth)
          existing.folders += data.folders
          existing.files += data.files
          existing.mdFiles += data.mdFiles
          existing.yamlFiles += data.yamlFiles
        }
        
        // Contar totais
        report.totalFiles += countTotalFiles(structures[locale])
        report.totalFolders += countTotalFolders(structures[locale])
      }
    } else {
      console.warn(`⚠️ Diretório não encontrado: ${localePath}`)
    }
  }
  
  // Comparar estruturas entre locales
  report.localeComparison = compareLocaleStructures(structures)
  
  // Gerar recomendações
  report.recommendations = generateRecommendations(report)
  
  // Converter Maps para objetos serializáveis
  const serializedReport = {
    ...report,
    frontmatterPatterns: Object.fromEntries(
      Array.from(report.frontmatterPatterns.entries()).map(([key, pattern]) => [
        key,
        {
          ...pattern,
          values: Array.from(pattern.values),
          valuesCount: pattern.values.size
        }
      ])
    ),
    filesByExtension: Object.fromEntries(report.filesByExtension),
    depthAnalysis: Object.fromEntries(report.depthAnalysis)
  }
  
  return serializedReport
}

/**
 * Salva o relatório de auditoria
 */
async function saveAuditReport(report) {
  // Criar diretório de relatórios se não existir
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const reportFile = path.join(OUTPUT_DIR, `content-audit-${timestamp}.json`)
  const summaryFile = path.join(OUTPUT_DIR, 'content-audit-latest.json')
  
  // Salvar relatório completo com timestamp
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2))
  
  // Salvar como "latest" para fácil acesso
  fs.writeFileSync(summaryFile, JSON.stringify(report, null, 2))
  
  console.log(`📊 Relatório salvo em: ${reportFile}`)
  console.log(`📋 Resumo disponível em: ${summaryFile}`)
  
  return { reportFile, summaryFile }
}

/**
 * Exibe resumo no console
 */
function displaySummary(report) {
  console.log('\n📊 RESUMO DA AUDITORIA')
  console.log('='.repeat(50))
  console.log(`📁 Total de pastas: ${report.totalFolders}`)
  console.log(`📄 Total de arquivos: ${report.totalFiles}`)
  console.log(`📝 Arquivos .md: ${report.filesByExtension['.md']?.count || 0}`)
  console.log(`📋 Arquivos .yaml: ${(report.filesByExtension['.yaml']?.count || 0) + (report.filesByExtension['.yml']?.count || 0)}`)
  console.log(`❌ Arquivos index.md faltantes: ${report.missingIndexFiles.length}`)
  console.log(`🏷️ Campos de frontmatter encontrados: ${Object.keys(report.frontmatterPatterns).length}`)
  console.log(`⚠️ Inconsistências de metadados: ${report.metadataInconsistencies.length}`)
  console.log(`💡 Recomendações: ${report.recommendations.length}`)
  
  if (report.recommendations.length > 0) {
    console.log('\n🔧 PRINCIPAIS RECOMENDAÇÕES:')
    report.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. [${rec.priority}] ${rec.title}`)
      console.log(`   ${rec.description}`)
    })
  }
  
  console.log(`\n⏰ Auditoria concluída em: ${report.timestamp}`)
}

/**
 * Função principal
 */
async function main() {
  try {
    console.log('🚀 AUDITORIA DE CONTEÚDO - NAVEGAÇÃO DINÂMICA')
    console.log('TASK 1.1.1: Criar Script de Auditoria')
    console.log('Ricardo (Nuxt Specialist) - Matrix Protocol Website\n')
    
    const report = await runAudit()
    const { reportFile, summaryFile } = await saveAuditReport(report)
    
    displaySummary(report)
    
    console.log('\n✅ AUDITORIA CONCLUÍDA COM SUCESSO!')
    console.log(`📁 Relatórios salvos em: ${OUTPUT_DIR}`)
    
    return true
  } catch (error) {
    console.error('❌ Erro durante a auditoria:', error)
    return false
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().then(success => {
    process.exit(success ? 0 : 1)
  })
}

export { runAudit, ContentAuditReport, FolderStructure, MetadataPattern }