#!/usr/bin/env node

/**
 * TASK 1.2.3: Apply Schema to Existing Content Files
 * 
 * Mass frontmatter standardization tool based on schema validation results.
 * Applies automatic fixes and standardizes metadata across all content.
 * 
 * Dependencies: TASK 1.2.1 (schema), TASK 1.2.2 (validation tool)
 * Usage: node scripts/apply-schema-frontmatter.js [options]
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { program } from 'commander'
import yaml from 'js-yaml'
import chalk from 'chalk'
import ora from 'ora'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')
const CONTENT_DIR = path.join(PROJECT_ROOT, 'content')
const BACKUP_DIR = path.join(PROJECT_ROOT, '.backup-frontmatter')

class FrontmatterSchemaApplicator {
  constructor(options = {}) {
    this.options = {
      dryRun: false,
      backup: true,
      verbose: false,
      pattern: '**/*.md',
      force: false,
      ...options
    }
    
    this.stats = {
      totalFiles: 0,
      processedFiles: 0,
      modifiedFiles: 0,
      skippedFiles: 0,
      errorsFixed: 0,
      warningsFixed: 0
    }
    
    this.changes = []
    this.errors = []
    this.spinner = null
    
    this.frameworkMap = {
      'MEF': { keywords: ['MEF', 'knowledge', 'embedding'], color: '#2ECC71' },
      'ZOF': { keywords: ['ZOF', 'workflow', 'orchestration'], color: '#E67E22' },
      'OIF': { keywords: ['OIF', 'operator', 'intelligence'], color: '#2980B9' },
      'MOC': { keywords: ['MOC', 'ontology', 'catalog'], color: '#9B59B6' },
      'MAL': { keywords: ['MAL', 'arbiter', 'layer'], color: '#C0392B' },
      'MEP': { keywords: ['MEP', 'epistemic', 'principle'], color: '#8E44AD' }
    }
  }

  async applySchema() {
    this.log(chalk.blue('🔧 Starting Matrix Protocol schema application...'))
    
    if (!fs.existsSync(CONTENT_DIR)) {
      throw new Error(`Content directory not found: ${CONTENT_DIR}`)
    }

    if (this.options.backup) {
      await this.createBackup()
    }

    this.spinner = ora('Processing content files...').start()
    
    try {
      await this.processDirectory(CONTENT_DIR, '')
      
      this.spinner.succeed(`✅ Schema application complete: ${this.stats.modifiedFiles}/${this.stats.totalFiles} files modified`)
      
      this.printSummary()
      
      if (this.options.dryRun) {
        this.log(chalk.yellow('🔍 DRY RUN MODE - No files were actually modified'))
      }
      
      return this.stats.modifiedFiles
      
    } catch (error) {
      this.spinner.fail(`❌ Schema application failed: ${error.message}`)
      throw error
    }
  }

  async createBackup() {
    this.log(chalk.blue('💾 Creating backup...'))
    
    if (fs.existsSync(BACKUP_DIR)) {
      if (!this.options.force) {
        throw new Error(`Backup directory already exists: ${BACKUP_DIR}. Use --force to overwrite.`)
      }
      fs.rmSync(BACKUP_DIR, { recursive: true })
    }
    
    // Copy entire content directory
    fs.cpSync(CONTENT_DIR, BACKUP_DIR, { recursive: true })
    this.log(chalk.green(`📦 Backup created at: ${BACKUP_DIR}`))
  }

  async processDirectory(dirPath, relativePath) {
    const items = fs.readdirSync(dirPath, { withFileTypes: true })
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item.name)
      const itemRelativePath = path.join(relativePath, item.name)
      
      if (item.isDirectory()) {
        await this.processDirectory(itemPath, itemRelativePath)
      } else if (item.name.endsWith('.md')) {
        this.stats.totalFiles++
        this.updateSpinner(`Processing ${itemRelativePath}...`)
        
        try {
          await this.processFile(itemPath, itemRelativePath)
        } catch (error) {
          this.stats.skippedFiles++
          this.errors.push({
            file: itemRelativePath,
            error: error.message
          })
          
          if (this.options.verbose) {
            this.log(chalk.red(`❌ Error processing ${itemRelativePath}: ${error.message}`))
          }
        }
      }
    }
  }

  async processFile(filePath, relativePath) {
    this.stats.processedFiles++
    
    const originalContent = fs.readFileSync(filePath, 'utf-8')
    const frontmatterResult = this.extractFrontmatter(originalContent)
    
    if (!frontmatterResult.frontmatter) {
      // Create new frontmatter from scratch
      const newFrontmatter = await this.generateDefaultFrontmatter(relativePath, originalContent)
      const newContent = this.injectFrontmatter(originalContent, newFrontmatter)
      
      await this.writeFile(filePath, relativePath, newContent, 'CREATED_FRONTMATTER')
      return
    }
    
    // Apply schema corrections to existing frontmatter
    const improvedFrontmatter = await this.improveFrontmatter(
      frontmatterResult.frontmatter, 
      relativePath
    )
    
    if (this.hasChanges(frontmatterResult.frontmatter, improvedFrontmatter)) {
      const newContent = this.replaceFrontmatter(originalContent, improvedFrontmatter)
      await this.writeFile(filePath, relativePath, newContent, 'IMPROVED_FRONTMATTER')
    }
  }

  extractFrontmatter(content) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/
    const match = content.match(frontmatterRegex)
    
    if (!match) {
      return { frontmatter: null, error: 'No frontmatter found' }
    }
    
    try {
      const frontmatter = yaml.load(match[1])
      return { frontmatter, yamlContent: match[1] }
    } catch (error) {
      return { frontmatter: null, error: `Invalid YAML: ${error.message}` }
    }
  }

  async generateDefaultFrontmatter(filePath, content) {
    const frontmatter = {}
    
    // Extract title from first heading or filename
    const titleMatch = content.match(/^# (.+)$/m)
    if (titleMatch) {
      frontmatter.title = titleMatch[1].trim()
    } else {
      const filename = path.basename(filePath, '.md')
      frontmatter.title = this.humanizeFilename(filename)
    }
    
    // Generate description from first paragraph
    const contentWithoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '')
    const firstParagraph = contentWithoutFrontmatter
      .split('\n\n')[0]
      .replace(/^#+\s*/, '') // Remove headings
      .replace(/\n/g, ' ')   // Single line
      .trim()
    
    if (firstParagraph && firstParagraph.length > 10) {
      frontmatter.description = firstParagraph.slice(0, 150) + (firstParagraph.length > 150 ? '...' : '')
    } else {
      frontmatter.description = `Documentation for ${frontmatter.title}`
    }
    
    // Add standard fields
    await this.addStandardFields(frontmatter, filePath)
    
    return frontmatter
  }

  async improveFrontmatter(frontmatter, filePath) {
    const improved = { ...frontmatter }
    let changeCount = 0
    
    // Fix missing required fields
    if (!improved.title || improved.title.trim() === '') {
      const filename = path.basename(filePath, '.md')
      improved.title = this.humanizeFilename(filename)
      changeCount++
    }
    
    if (!improved.description || improved.description.trim() === '') {
      improved.description = `Documentation for ${improved.title}`
      changeCount++
    }
    
    // Add/fix standard fields
    changeCount += await this.addStandardFields(improved, filePath)
    
    // Fix framework-specific issues
    changeCount += this.fixFrameworkIssues(improved, filePath)
    
    // Normalize field order
    const normalizedFrontmatter = this.normalizeFieldOrder(improved)
    
    if (changeCount > 0) {
      this.stats.errorsFixed += changeCount
    }
    
    return normalizedFrontmatter
  }

  async addStandardFields(frontmatter, filePath) {
    let changeCount = 0
    
    // Detect and set language
    const detectedLang = filePath.includes('en/') ? 'en' : 
                        filePath.includes('pt/') ? 'pt' : 'pt'
    
    if (!frontmatter.lang) {
      frontmatter.lang = detectedLang
      changeCount++
    }
    
    // Set layout based on path
    if (!frontmatter.layout) {
      if (filePath.includes('/frameworks/')) {
        frontmatter.layout = 'framework'
      } else if (filePath.includes('/docs/')) {
        frontmatter.layout = 'docs'
      } else if (filePath.includes('/examples/')) {
        frontmatter.layout = 'example'
      } else {
        frontmatter.layout = 'default'
      }
      changeCount++
    }
    
    // Set navigation defaults
    if (frontmatter.navigation === undefined) {
      frontmatter.navigation = true
      changeCount++
    }
    
    // Set sidebar for docs
    if (frontmatter.layout === 'docs' && frontmatter.sidebar === undefined) {
      frontmatter.sidebar = true
      changeCount++
    }
    
    // Set toc for docs
    if (frontmatter.layout === 'docs' && frontmatter.toc === undefined) {
      frontmatter.toc = true
      changeCount++
    }
    
    // Set last_updated if missing
    if (!frontmatter.last_updated) {
      frontmatter.last_updated = new Date().toISOString().split('T')[0]
      changeCount++
    }
    
    return changeCount
  }

  fixFrameworkIssues(frontmatter, filePath) {
    let changeCount = 0
    
    // Detect framework from path or content
    if (!frontmatter.framework) {
      const detectedFramework = this.detectFramework(filePath, frontmatter)
      if (detectedFramework) {
        frontmatter.framework = detectedFramework
        changeCount++
      }
    }
    
    // Fix invalid framework values
    if (frontmatter.framework && !this.frameworkMap[frontmatter.framework]) {
      // Try to map common invalid values
      const frameworkMappings = {
        'mef': 'MEF',
        'zof': 'ZOF', 
        'oif': 'OIF',
        'moc': 'MOC',
        'mal': 'MAL',
        'mep': 'MEP',
        'general': 'general'
      }
      
      const mapped = frameworkMappings[frontmatter.framework.toLowerCase()]
      if (mapped) {
        frontmatter.framework = mapped
        changeCount++
      } else {
        // Remove invalid framework
        delete frontmatter.framework
        changeCount++
      }
    }
    
    // Add framework keywords if missing
    if (frontmatter.framework && this.frameworkMap[frontmatter.framework]) {
      const requiredKeywords = this.frameworkMap[frontmatter.framework].keywords
      const currentKeywords = frontmatter.keywords || []
      
      const missingKeywords = requiredKeywords.filter(keyword =>
        !currentKeywords.some(k => k.toLowerCase().includes(keyword.toLowerCase()))
      )
      
      if (missingKeywords.length > 0) {
        frontmatter.keywords = [...currentKeywords, ...missingKeywords]
        changeCount++
      }
    }
    
    return changeCount
  }

  detectFramework(filePath, frontmatter) {
    // Check path patterns
    if (filePath.includes('/mef/') || filePath.includes('MEF')) return 'MEF'
    if (filePath.includes('/zof/') || filePath.includes('ZOF')) return 'ZOF'
    if (filePath.includes('/oif/') || filePath.includes('OIF')) return 'OIF'
    if (filePath.includes('/moc/') || filePath.includes('MOC')) return 'MOC'
    if (filePath.includes('/mal/') || filePath.includes('MAL')) return 'MAL'
    if (filePath.includes('/mep/') || filePath.includes('MEP')) return 'MEP'
    
    // Check title and description for framework references
    const text = `${frontmatter.title || ''} ${frontmatter.description || ''}`.toLowerCase()
    for (const [framework, config] of Object.entries(this.frameworkMap)) {
      if (config.keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
        return framework
      }
    }
    
    return null
  }

  normalizeFieldOrder(frontmatter) {
    // Define preferred field order for consistency
    const fieldOrder = [
      'title',
      'description', 
      'keywords',
      'framework',
      'category',
      'difficulty',
      'icon',
      'layout',
      'sidebar',
      'toc',
      'navigation',
      'lang',
      'last_updated',
      'order'
    ]
    
    const normalized = {}
    
    // Add fields in preferred order
    for (const field of fieldOrder) {
      if (frontmatter.hasOwnProperty(field)) {
        normalized[field] = frontmatter[field]
      }
    }
    
    // Add any remaining fields
    for (const [key, value] of Object.entries(frontmatter)) {
      if (!normalized.hasOwnProperty(key)) {
        normalized[key] = value
      }
    }
    
    return normalized
  }

  hasChanges(original, improved) {
    return JSON.stringify(original) !== JSON.stringify(improved)
  }

  injectFrontmatter(content, frontmatter) {
    const yamlContent = yaml.dump(frontmatter, { 
      indent: 2,
      lineWidth: -1,
      noRefs: true
    })
    
    return `---\n${yamlContent}---\n${content}`
  }

  replaceFrontmatter(content, frontmatter) {
    const yamlContent = yaml.dump(frontmatter, { 
      indent: 2,
      lineWidth: -1,
      noRefs: true
    })
    
    return content.replace(/^---\n[\s\S]*?\n---/, `---\n${yamlContent}---`)
  }

  async writeFile(filePath, relativePath, content, changeType) {
    if (this.options.dryRun) {
      this.changes.push({
        file: relativePath,
        changeType,
        preview: content.split('\n').slice(0, 20).join('\n') + '...'
      })
    } else {
      fs.writeFileSync(filePath, content, 'utf-8')
    }
    
    this.stats.modifiedFiles++
    
    if (this.options.verbose) {
      this.log(chalk.green(`✓ ${changeType}: ${relativePath}`))
    }
  }

  humanizeFilename(filename) {
    return filename
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim()
  }

  updateSpinner(text) {
    if (this.spinner) {
      this.spinner.text = text
    }
  }

  log(message) {
    if (this.spinner) {
      this.spinner.stop()
    }
    console.log(message)
    if (this.spinner) {
      this.spinner.start()
    }
  }

  printSummary() {
    console.log('\n' + chalk.bold('📊 Schema Application Summary'))
    console.log('─'.repeat(50))
    
    console.log(`Total Files: ${chalk.blue(this.stats.totalFiles)}`)
    console.log(`Processed Files: ${chalk.green(this.stats.processedFiles)}`)
    console.log(`Modified Files: ${chalk.yellow(this.stats.modifiedFiles)}`)
    console.log(`Errors Fixed: ${chalk.red(this.stats.errorsFixed)}`)
    
    if (this.stats.skippedFiles > 0) {
      console.log(`Skipped Files: ${chalk.gray(this.stats.skippedFiles)}`)
    }
    
    const successRate = ((this.stats.modifiedFiles / this.stats.totalFiles) * 100).toFixed(1)
    console.log(`Modification Rate: ${chalk.blue(successRate)}%`)
    
    if (this.errors.length > 0) {
      console.log('\n' + chalk.red('❌ Processing Errors:'))
      this.errors.slice(0, 5).forEach(error => {
        console.log(chalk.red(`  • ${error.file}: ${error.error}`))
      })
      
      if (this.errors.length > 5) {
        console.log(chalk.gray(`    ... and ${this.errors.length - 5} more errors`))
      }
    }
    
    if (this.options.backup && !this.options.dryRun) {
      console.log(`\n💾 Backup available at: ${chalk.blue(BACKUP_DIR)}`)
    }
  }
}

// CLI Interface
program
  .name('apply-schema-frontmatter')
  .description('Apply Matrix Protocol schema to content frontmatter')
  .version('1.0.0')

program
  .option('-d, --dry-run', 'Preview changes without modifying files', false)
  .option('-v, --verbose', 'Show detailed processing results', false)
  .option('--no-backup', 'Skip creating backup', false)
  .option('-f, --force', 'Force overwrite existing backup', false)
  .option('-p, --pattern <pattern>', 'File pattern to process', '**/*.md')

program.action(async (options) => {
  try {
    const applicator = new FrontmatterSchemaApplicator(options)
    const modifiedCount = await applicator.applySchema()
    
    console.log(chalk.green(`\n🎉 Schema application complete! ${modifiedCount} files modified.`))
    
    process.exit(0)
    
  } catch (error) {
    console.error(chalk.red(`❌ Error: ${error.message}`))
    process.exit(1)
  }
})

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  program.parse()
}

export default FrontmatterSchemaApplicator