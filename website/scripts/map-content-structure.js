#!/usr/bin/env node

/**
 * TASK 1.1.2: Content Structure Mapping Tool
 * 
 * Generates comprehensive analysis of content directory structure
 * for Matrix Protocol Dynamic Navigation system.
 * 
 * Output: /docs/content-structure-map.md
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')
const CONTENT_DIR = path.join(PROJECT_ROOT, 'content')
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'docs', 'content-structure-map.md')

class ContentStructureMapper {
  constructor() {
    this.stats = {
      totalFiles: 0,
      totalDirectories: 0,
      languageDistribution: {},
      depthDistribution: {},
      typeDistribution: {},
      missingIndexFiles: [],
      orphanedFiles: [],
      navigationPaths: new Set()
    }
    
    this.directoryTree = {}
    this.startTime = Date.now()
  }

  async mapStructure() {
    console.log('🗂️  Iniciando mapeamento da estrutura de conteúdo...')
    
    if (!fs.existsSync(CONTENT_DIR)) {
      throw new Error(`Content directory not found: ${CONTENT_DIR}`)
    }

    // Mapear estrutura recursivamente
    await this.scanDirectory(CONTENT_DIR, '', 0)
    
    // Identificar problemas
    this.identifyNavigationIssues()
    
    // Gerar relatório
    await this.generateReport()
    
    console.log(`✅ Mapeamento concluído em ${Date.now() - this.startTime}ms`)
    console.log(`📊 Total: ${this.stats.totalFiles} arquivos, ${this.stats.totalDirectories} diretórios`)
  }

  async scanDirectory(dirPath, relativePath, depth) {
    const items = fs.readdirSync(dirPath, { withFileTypes: true })
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item.name)
      const itemRelativePath = path.join(relativePath, item.name)
      
      if (item.isDirectory()) {
        this.stats.totalDirectories++
        this.stats.depthDistribution[depth] = (this.stats.depthDistribution[depth] || 0) + 1
        
        // Verificar se tem index.md
        const indexPath = path.join(itemPath, 'index.md')
        if (!fs.existsSync(indexPath)) {
          this.stats.missingIndexFiles.push(itemRelativePath)
        }
        
        // Mapear subdiretórios
        await this.scanDirectory(itemPath, itemRelativePath, depth + 1)
        
      } else if (item.name.endsWith('.md')) {
        this.stats.totalFiles++
        
        // Analisar arquivo
        await this.analyzeMarkdownFile(itemPath, itemRelativePath)
      }
    }
  }

  async analyzeMarkdownFile(filePath, relativePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
      
      // Detectar idioma
      const lang = relativePath.startsWith('en/') ? 'en' : 
                   relativePath.startsWith('pt/') ? 'pt' : 'unknown'
      this.stats.languageDistribution[lang] = (this.stats.languageDistribution[lang] || 0) + 1
      
      // Detectar tipo de conteúdo
      const type = this.detectContentType(relativePath)
      this.stats.typeDistribution[type] = (this.stats.typeDistribution[type] || 0) + 1
      
      // Extrair caminhos de navegação
      this.extractNavigationPaths(relativePath, frontmatterMatch)
      
    } catch (error) {
      console.warn(`⚠️  Erro ao analisar ${relativePath}: ${error.message}`)
    }
  }

  detectContentType(relativePath) {
    if (relativePath.includes('/docs/')) return 'documentation'
    if (relativePath.includes('/examples/')) return 'examples'
    if (relativePath.includes('/frameworks/')) return 'frameworks'
    if (relativePath.includes('/manual/')) return 'manual'
    if (relativePath.includes('/quickstart/')) return 'quickstart'
    if (relativePath.includes('/reference/')) return 'reference'
    if (relativePath.includes('/templates/')) return 'templates'
    if (relativePath.endsWith('index.md')) return 'index'
    return 'other'
  }

  extractNavigationPaths(relativePath, frontmatterMatch) {
    // Extrair caminhos de navegação baseados na estrutura
    const pathParts = relativePath.split('/')
    let currentPath = ''
    
    for (const part of pathParts.slice(0, -1)) { // Excluir nome do arquivo
      currentPath = currentPath ? `${currentPath}/${part}` : part
      this.stats.navigationPaths.add(currentPath)
    }
  }

  identifyNavigationIssues() {
    console.log('🔍 Identificando problemas de navegação...')
    
    // Identificar arquivos órfãos (sem estrutura de navegação clara)
    // Implementação simplificada - pode ser expandida
    this.stats.orphanedFiles = Array.from(this.stats.navigationPaths)
      .filter(path => !path.includes('index') && path.split('/').length > 3)
  }

  async generateReport() {
    console.log('📝 Gerando relatório de estrutura...')
    
    const report = this.buildMarkdownReport()
    
    // Garantir que diretório docs existe
    const docsDir = path.dirname(OUTPUT_FILE)
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true })
    }
    
    fs.writeFileSync(OUTPUT_FILE, report, 'utf-8')
    console.log(`📄 Relatório salvo em: ${OUTPUT_FILE}`)
  }

  buildMarkdownReport() {
    const timestamp = new Date().toISOString()
    const executionTime = Date.now() - this.startTime
    
    return `# 🗂️ Content Structure Map

> **Generated**: ${timestamp}  
> **Execution Time**: ${executionTime}ms  
> **Matrix Protocol Dynamic Navigation - TASK 1.1.2**

## 📊 **Summary Statistics**

| Metric | Value |
|--------|-------|
| **Total Files** | ${this.stats.totalFiles} |
| **Total Directories** | ${this.stats.totalDirectories} |
| **Navigation Paths** | ${this.stats.navigationPaths.size} |
| **Missing Index Files** | ${this.stats.missingIndexFiles.length} |
| **Potential Issues** | ${this.stats.orphanedFiles.length} |

## 🌍 **Language Distribution**

${Object.entries(this.stats.languageDistribution)
  .map(([lang, count]) => `- **${lang.toUpperCase()}**: ${count} files (${(count/this.stats.totalFiles*100).toFixed(1)}%)`)
  .join('\n')}

## 📁 **Content Type Distribution**

${Object.entries(this.stats.typeDistribution)
  .sort(([,a], [,b]) => b - a)
  .map(([type, count]) => `- **${type}**: ${count} files`)
  .join('\n')}

## 📏 **Directory Depth Analysis**

${Object.entries(this.stats.depthDistribution)
  .sort(([a], [b]) => parseInt(a) - parseInt(b))
  .map(([depth, count]) => `- **Level ${depth}**: ${count} directories`)
  .join('\n')}

## 🚨 **Navigation Issues**

### Missing Index Files (${this.stats.missingIndexFiles.length})
${this.stats.missingIndexFiles.length > 0 ? 
  this.stats.missingIndexFiles.map(path => `- \`${path}/index.md\``).join('\n') :
  '_No missing index files detected_'
}

### Navigation Paths Identified (${this.stats.navigationPaths.size})
${Array.from(this.stats.navigationPaths)
  .sort()
  .slice(0, 20) // Mostrar apenas primeiros 20
  .map(path => `- \`${path}\``)
  .join('\n')}

${this.stats.navigationPaths.size > 20 ? `\n_... and ${this.stats.navigationPaths.size - 20} more paths_` : ''}

## 🎯 **Recommendations for Dynamic Navigation**

### Critical Actions Required
1. **Create missing index.md files** (${this.stats.missingIndexFiles.length} locations)
2. **Standardize frontmatter** across all ${this.stats.totalFiles} markdown files
3. **Implement navigation hierarchy** for ${this.stats.navigationPaths.size} paths
4. **Validate bilingual content parity** (PT: ${this.stats.languageDistribution.pt || 0}, EN: ${this.stats.languageDistribution.en || 0})

### Navigation Strategy
- **Primary Languages**: Portuguese (pt) and English (en)
- **Content Types**: Focus on documentation, frameworks, and examples
- **Depth Levels**: Optimize for levels 0-3 (${Object.keys(this.stats.depthDistribution).length} levels detected)

## 🔗 **Integration Points**

This structure analysis supports:
- **TASK 1.1.4**: Inconsistency detection targeting ${this.stats.missingIndexFiles.length} gaps
- **TASK 1.2.1**: Schema design for ${this.stats.totalFiles} markdown files
- **TASK 1.2.3**: Mass frontmatter application across ${Object.keys(this.stats.typeDistribution).length} content types
- **TASK 1.2.4**: Index file generation for ${this.stats.missingIndexFiles.length} directories

---

**Generated by**: Content Structure Mapper v1.0  
**Sprint**: Dynamic Navigation Phase 1  
**Next Step**: Execute TASK 1.1.4 (Inconsistency Report)
`
  }
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const mapper = new ContentStructureMapper()
  mapper.mapStructure().catch(console.error)
}

export default ContentStructureMapper