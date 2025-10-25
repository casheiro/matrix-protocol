#!/usr/bin/env node

/**
 * TASK 1.1.4: Content Inconsistency Report Generator
 * 
 * Analyzes content structure and frontmatter to identify inconsistencies
 * that would prevent successful dynamic navigation implementation.
 * 
 * Dependencies: TASK 1.1.2 (content structure map)
 * Output: /docs/content-inconsistencies-report.md
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import yaml from 'js-yaml'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')
const CONTENT_DIR = path.join(PROJECT_ROOT, 'content')
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'docs', 'content-inconsistencies-report.md')
const STRUCTURE_MAP_FILE = path.join(PROJECT_ROOT, 'docs', 'content-structure-map.md')

class InconsistencyAnalyzer {
  constructor() {
    this.issues = {
      critical: [],
      major: [],
      minor: [],
      warnings: []
    }
    
    this.stats = {
      totalFiles: 0,
      filesAnalyzed: 0,
      filesWithFrontmatter: 0,
      filesWithoutFrontmatter: 0,
      malformedFrontmatter: 0,
      missingTitles: 0,
      missingDescriptions: 0,
      duplicatedTitles: new Map(),
      inconsistentLanguages: 0,
      orphanedFiles: [],
      missingTranslations: []
    }
    
    this.contentIndex = new Map()
    this.startTime = Date.now()
  }

  async analyze() {
    console.log('🔍 Iniciando análise de inconsistências...')
    
    // Verificar se existe o mapeamento de estrutura
    if (!fs.existsSync(STRUCTURE_MAP_FILE)) {
      throw new Error('Structure map not found. Run TASK 1.1.2 first.')
    }
    
    // Analisar todos os arquivos markdown
    await this.scanAllContent()
    
    // Executar verificações de inconsistência
    await this.detectInconsistencies()
    
    // Gerar relatório
    await this.generateReport()
    
    console.log(`✅ Análise concluída em ${Date.now() - this.startTime}ms`)
    console.log(`🔍 ${this.stats.filesAnalyzed} arquivos analisados, ${this.getTotalIssues()} problemas encontrados`)
  }

  async scanAllContent() {
    console.log('📂 Escaneando conteúdo...')
    await this.scanDirectory(CONTENT_DIR, '')
  }

  async scanDirectory(dirPath, relativePath) {
    const items = fs.readdirSync(dirPath, { withFileTypes: true })
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item.name)
      const itemRelativePath = path.join(relativePath, item.name)
      
      if (item.isDirectory()) {
        await this.scanDirectory(itemPath, itemRelativePath)
      } else if (item.name.endsWith('.md')) {
        this.stats.totalFiles++
        await this.analyzeMarkdownFile(itemPath, itemRelativePath)
      }
    }
  }

  async analyzeMarkdownFile(filePath, relativePath) {
    try {
      this.stats.filesAnalyzed++
      const content = fs.readFileSync(filePath, 'utf-8')
      
      // Extrair frontmatter
      const frontmatterResult = this.extractFrontmatter(content, relativePath)
      
      if (frontmatterResult.frontmatter) {
        this.stats.filesWithFrontmatter++
        
        // Indexar conteúdo para análises comparativas
        this.indexContent(relativePath, frontmatterResult.frontmatter, content)
        
        // Validar frontmatter individual
        this.validateFrontmatter(frontmatterResult.frontmatter, relativePath)
      } else {
        this.stats.filesWithoutFrontmatter++
        this.issues.critical.push({
          type: 'MISSING_FRONTMATTER',
          file: relativePath,
          message: 'Arquivo sem frontmatter YAML',
          impact: 'Navegação dinâmica não funcionará'
        })
      }
      
    } catch (error) {
      this.issues.critical.push({
        type: 'FILE_READ_ERROR',
        file: relativePath,
        message: `Erro ao processar arquivo: ${error.message}`,
        impact: 'Arquivo inacessível para navegação'
      })
    }
  }

  extractFrontmatter(content, filePath) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/
    const match = content.match(frontmatterRegex)
    
    if (!match) {
      return { frontmatter: null, error: 'No frontmatter found' }
    }
    
    try {
      const frontmatter = yaml.load(match[1])
      return { frontmatter, yamlContent: match[1] }
    } catch (error) {
      this.stats.malformedFrontmatter++
      this.issues.critical.push({
        type: 'MALFORMED_FRONTMATTER',
        file: filePath,
        message: `YAML inválido: ${error.message}`,
        impact: 'Frontmatter não pode ser processado'
      })
      return { frontmatter: null, error: error.message }
    }
  }

  indexContent(filePath, frontmatter, content) {
    const language = this.detectLanguage(filePath)
    const baseKey = this.getBaseContentKey(filePath)
    
    if (!this.contentIndex.has(baseKey)) {
      this.contentIndex.set(baseKey, { pt: null, en: null })
    }
    
    this.contentIndex.get(baseKey)[language] = {
      path: filePath,
      frontmatter,
      contentLength: content.length
    }
  }

  detectLanguage(filePath) {
    if (filePath.startsWith('en/')) return 'en'
    if (filePath.startsWith('pt/')) return 'pt'
    return 'unknown'
  }

  getBaseContentKey(filePath) {
    // Remove prefixo de idioma para comparar conteúdo equivalente
    return filePath.replace(/^(en|pt)\//, '')
  }

  validateFrontmatter(frontmatter, filePath) {
    // Verificar campos obrigatórios
    if (!frontmatter.title) {
      this.stats.missingTitles++
      this.issues.major.push({
        type: 'MISSING_TITLE',
        file: filePath,
        message: 'Campo "title" obrigatório não encontrado',
        impact: 'Navegação sem título identificável'
      })
    }
    
    if (!frontmatter.description) {
      this.stats.missingDescriptions++
      this.issues.major.push({
        type: 'MISSING_DESCRIPTION',
        file: filePath,
        message: 'Campo "description" obrigatório não encontrado',
        impact: 'SEO e preview de conteúdo prejudicados'
      })
    }
    
    // Verificar duplicação de títulos
    if (frontmatter.title) {
      const title = frontmatter.title.toLowerCase()
      if (!this.stats.duplicatedTitles.has(title)) {
        this.stats.duplicatedTitles.set(title, [])
      }
      this.stats.duplicatedTitles.get(title).push(filePath)
    }
    
    // Verificar consistência de idioma
    const detectedLang = this.detectLanguage(filePath)
    if (frontmatter.language && frontmatter.language !== detectedLang) {
      this.stats.inconsistentLanguages++
      this.issues.major.push({
        type: 'LANGUAGE_MISMATCH',
        file: filePath,
        message: `Idioma declarado "${frontmatter.language}" não confere com diretório "${detectedLang}"`,
        impact: 'Navegação multilingual comprometida'
      })
    }
  }

  async detectInconsistencies() {
    console.log('🔍 Detectando inconsistências...')
    
    this.detectDuplicatedTitles()
    this.detectMissingTranslations()
    this.detectNavigationIssues()
    this.detectFrameworkInconsistencies()
    this.detectSEOIssues()
  }

  detectDuplicatedTitles() {
    for (const [title, files] of this.stats.duplicatedTitles) {
      if (files.length > 1) {
        this.issues.major.push({
          type: 'DUPLICATED_TITLE',
          files: files,
          message: `Título duplicado: "${title}"`,
          impact: 'Navegação ambígua e SEO prejudicado',
          count: files.length
        })
      }
    }
  }

  detectMissingTranslations() {
    for (const [baseKey, languages] of this.contentIndex) {
      if (languages.pt && !languages.en) {
        this.stats.missingTranslations.push({ 
          base: baseKey, 
          missing: 'en', 
          existing: 'pt',
          path: languages.pt.path 
        })
        this.issues.minor.push({
          type: 'MISSING_TRANSLATION',
          file: languages.pt.path,
          message: 'Tradução em inglês não encontrada',
          impact: 'Navegação incompleta para usuários internacionais'
        })
      } else if (languages.en && !languages.pt) {
        this.stats.missingTranslations.push({ 
          base: baseKey, 
          missing: 'pt', 
          existing: 'en',
          path: languages.en.path 
        })
        this.issues.minor.push({
          type: 'MISSING_TRANSLATION',
          file: languages.en.path,
          message: 'Tradução em português não encontrada',
          impact: 'Navegação incompleta para usuários brasileiros'
        })
      }
    }
  }

  detectNavigationIssues() {
    // Analisar estrutura de navegação baseada no mapeamento
    for (const [baseKey, languages] of this.contentIndex) {
      for (const [lang, data] of Object.entries(languages)) {
        if (!data) continue
        
        const { frontmatter, path: filePath } = data
        
        // Verificar consistência de order
        if (frontmatter.navigation?.order) {
          const order = frontmatter.navigation.order
          if (!Number.isInteger(order) || order < 0) {
            this.issues.minor.push({
              type: 'INVALID_NAVIGATION_ORDER',
              file: filePath,
              message: `Ordem de navegação inválida: ${order}`,
              impact: 'Ordenação incorreta nos menus'
            })
          }
        }
        
        // Verificar parent paths
        if (frontmatter.navigation?.parent) {
          if (!frontmatter.navigation.parent.startsWith('/')) {
            this.issues.minor.push({
              type: 'INVALID_PARENT_PATH',
              file: filePath,
              message: 'Caminho pai deve começar com "/"',
              impact: 'Breadcrumb navigation quebrada'
            })
          }
        }
      }
    }
  }

  detectFrameworkInconsistencies() {
    const frameworkFiles = new Map()
    
    for (const [baseKey, languages] of this.contentIndex) {
      for (const [lang, data] of Object.entries(languages)) {
        if (!data?.frontmatter?.framework) continue
        
        const framework = data.frontmatter.framework
        if (!frameworkFiles.has(framework)) {
          frameworkFiles.set(framework, [])
        }
        frameworkFiles.get(framework).push(data.path)
        
        // Verificar keywords relacionados ao framework
        const keywords = data.frontmatter.keywords || []
        if (!keywords.some(k => k.toLowerCase().includes(framework.toLowerCase()))) {
          this.issues.warnings.push({
            type: 'MISSING_FRAMEWORK_KEYWORD',
            file: data.path,
            message: `Conteúdo do framework ${framework} deveria incluir keyword relacionado`,
            impact: 'Searchability reduzida'
          })
        }
      }
    }
  }

  detectSEOIssues() {
    for (const [baseKey, languages] of this.contentIndex) {
      for (const [lang, data] of Object.entries(languages)) {
        if (!data) continue
        
        const { frontmatter, path: filePath } = data
        
        // Verificar tamanho de title para SEO
        if (frontmatter.title && frontmatter.title.length > 60) {
          this.issues.warnings.push({
            type: 'SEO_TITLE_TOO_LONG',
            file: filePath,
            message: `Título muito longo para SEO: ${frontmatter.title.length} caracteres`,
            impact: 'Título truncado em resultados de busca'
          })
        }
        
        // Verificar tamanho de description para SEO
        if (frontmatter.description && frontmatter.description.length > 155) {
          this.issues.warnings.push({
            type: 'SEO_DESCRIPTION_TOO_LONG',
            file: filePath,
            message: `Descrição muito longa para SEO: ${frontmatter.description.length} caracteres`,
            impact: 'Descrição truncada em resultados de busca'
          })
        }
        
        // Verificar ausência de keywords
        if (!frontmatter.keywords || frontmatter.keywords.length === 0) {
          this.issues.warnings.push({
            type: 'MISSING_KEYWORDS',
            file: filePath,
            message: 'Nenhuma keyword definida',
            impact: 'SEO e discoverability prejudicados'
          })
        }
      }
    }
  }

  getTotalIssues() {
    return this.issues.critical.length + 
           this.issues.major.length + 
           this.issues.minor.length + 
           this.issues.warnings.length
  }

  async generateReport() {
    console.log('📝 Gerando relatório de inconsistências...')
    
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
    
    return `# 🚨 Content Inconsistencies Report

> **Generated**: ${timestamp}  
> **Execution Time**: ${executionTime}ms  
> **Matrix Protocol Dynamic Navigation - TASK 1.1.4**

## 📊 **Analysis Summary**

| Metric | Value | Status |
|--------|-------|--------|
| **Total Files** | ${this.stats.totalFiles} | ✅ |
| **Files Analyzed** | ${this.stats.filesAnalyzed} | ✅ |
| **With Frontmatter** | ${this.stats.filesWithFrontmatter} | ${this.stats.filesWithFrontmatter === this.stats.filesAnalyzed ? '✅' : '⚠️'} |
| **Without Frontmatter** | ${this.stats.filesWithoutFrontmatter} | ${this.stats.filesWithoutFrontmatter === 0 ? '✅' : '🚨'} |
| **Malformed YAML** | ${this.stats.malformedFrontmatter} | ${this.stats.malformedFrontmatter === 0 ? '✅' : '🚨'} |
| **Missing Titles** | ${this.stats.missingTitles} | ${this.stats.missingTitles === 0 ? '✅' : '⚠️'} |
| **Missing Descriptions** | ${this.stats.missingDescriptions} | ${this.stats.missingDescriptions === 0 ? '✅' : '⚠️'} |
| **Missing Translations** | ${this.stats.missingTranslations.length} | ${this.stats.missingTranslations.length === 0 ? '✅' : '📝'} |

## 🚨 **Critical Issues (${this.issues.critical.length})**

${this.issues.critical.length === 0 ? '_No critical issues found ✅_' : 
  this.issues.critical.map(issue => `
### ${issue.type}
- **File**: \`${issue.file}\`
- **Message**: ${issue.message}
- **Impact**: ${issue.impact}
`).join('\n')}

## ⚠️ **Major Issues (${this.issues.major.length})**

${this.issues.major.length === 0 ? '_No major issues found ✅_' : 
  this.issues.major.map(issue => `
### ${issue.type}
- **File(s)**: ${issue.files ? issue.files.map(f => `\`${f}\``).join(', ') : `\`${issue.file}\``}
- **Message**: ${issue.message}
- **Impact**: ${issue.impact}
${issue.count ? `- **Count**: ${issue.count}` : ''}
`).join('\n')}

## 📝 **Minor Issues (${this.issues.minor.length})**

${this.issues.minor.length === 0 ? '_No minor issues found ✅_' : 
  this.issues.minor.slice(0, 10).map(issue => `
### ${issue.type}
- **File**: \`${issue.file}\`
- **Message**: ${issue.message}
- **Impact**: ${issue.impact}
`).join('\n')}

${this.issues.minor.length > 10 ? `\n_... and ${this.issues.minor.length - 10} more minor issues_` : ''}

## 💡 **Warnings (${this.issues.warnings.length})**

${this.issues.warnings.length === 0 ? '_No warnings found ✅_' : 
  this.issues.warnings.slice(0, 10).map(warning => `
### ${warning.type}
- **File**: \`${warning.file}\`
- **Message**: ${warning.message}
- **Impact**: ${warning.impact}
`).join('\n')}

${this.issues.warnings.length > 10 ? `\n_... and ${this.issues.warnings.length - 10} more warnings_` : ''}

## 🌍 **Translation Analysis**

### Missing Translations (${this.stats.missingTranslations.length})

${this.stats.missingTranslations.length === 0 ? '_All content has bilingual coverage ✅_' :
  this.stats.missingTranslations.slice(0, 15).map(missing => 
    `- \`${missing.base}\` - Missing **${missing.missing.toUpperCase()}** (has ${missing.existing.toUpperCase()})`
  ).join('\n')}

${this.stats.missingTranslations.length > 15 ? `\n_... and ${this.stats.missingTranslations.length - 15} more missing translations_` : ''}

## 📈 **Quality Metrics**

### Content Completeness
- **Frontmatter Coverage**: ${((this.stats.filesWithFrontmatter / this.stats.totalFiles) * 100).toFixed(1)}%
- **Title Coverage**: ${(((this.stats.filesWithFrontmatter - this.stats.missingTitles) / this.stats.totalFiles) * 100).toFixed(1)}%
- **Description Coverage**: ${(((this.stats.filesWithFrontmatter - this.stats.missingDescriptions) / this.stats.totalFiles) * 100).toFixed(1)}%
- **Translation Parity**: ${((this.contentIndex.size - this.stats.missingTranslations.length) / this.contentIndex.size * 100).toFixed(1)}%

### Issue Severity Distribution
- **Critical**: ${this.issues.critical.length} (${((this.issues.critical.length / this.getTotalIssues()) * 100).toFixed(1)}%)
- **Major**: ${this.issues.major.length} (${((this.issues.major.length / this.getTotalIssues()) * 100).toFixed(1)}%)
- **Minor**: ${this.issues.minor.length} (${((this.issues.minor.length / this.getTotalIssues()) * 100).toFixed(1)}%)
- **Warnings**: ${this.issues.warnings.length} (${((this.issues.warnings.length / this.getTotalIssues()) * 100).toFixed(1)}%)

## 🎯 **Remediation Priority**

### Phase 1 - Critical (BLOCKING)
1. **Fix malformed frontmatter** (${this.stats.malformedFrontmatter} files)
2. **Add missing frontmatter** (${this.stats.filesWithoutFrontmatter} files)
3. **Resolve YAML parsing errors**

### Phase 2 - Major (HIGH PRIORITY)  
1. **Add missing titles** (${this.stats.missingTitles} files)
2. **Add missing descriptions** (${this.stats.missingDescriptions} files)
3. **Fix duplicated titles** (${Array.from(this.stats.duplicatedTitles.values()).filter(arr => arr.length > 1).length} sets)
4. **Resolve language mismatches** (${this.stats.inconsistentLanguages} files)

### Phase 3 - Enhancement (MEDIUM PRIORITY)
1. **Complete missing translations** (${this.stats.missingTranslations.length} files)
2. **Fix navigation inconsistencies**
3. **Optimize SEO fields**

## 🔗 **Integration with Next Tasks**

This report enables:
- **TASK 1.2.2**: Validation tool specifications targeting ${this.getTotalIssues()} issues
- **TASK 1.2.3**: Mass frontmatter application with ${this.stats.filesWithoutFrontmatter} additions
- **TASK 1.2.4**: Index file generation prioritizing critical paths

### Automation Opportunities
- **${this.stats.filesWithoutFrontmatter} files** need frontmatter scaffolding
- **${this.stats.missingTitles} files** need automated title extraction
- **${this.stats.missingTranslations.length} files** need translation workflow

---

**Generated by**: Inconsistency Analyzer v1.0  
**Dependencies**: TASK 1.1.2 (Content Structure Map)  
**Next Step**: Execute TASK 1.2.2 (Validation Tool)
`
  }
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const analyzer = new InconsistencyAnalyzer()
  analyzer.analyze().catch(console.error)
}

export default InconsistencyAnalyzer