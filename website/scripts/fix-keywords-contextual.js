#!/usr/bin/env node

/**
 * Contextual Keywords Fixer
 * 
 * Intelligently fixes keywords based on actual file content analysis
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import yaml from 'js-yaml'
import chalk from 'chalk'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')
const CONTENT_DIR = path.join(PROJECT_ROOT, 'content')

class ContextualKeywordsFixer {
  constructor(options = {}) {
    this.options = {
      dryRun: false,
      verbose: false,
      ...options
    }
    
    this.stats = {
      filesProcessed: 0,
      filesFixed: 0,
      keywordsAdded: 0
    }
    
    this.fixes = []
  }

  async fixAll() {
    console.log(chalk.blue('🔧 Starting contextual keywords fixes...'))
    
    await this.scanAndFix(CONTENT_DIR, '')
    
    this.generateReport()
    
    return this.stats.filesFixed
  }

  async scanAndFix(dirPath, relativePath) {
    const items = fs.readdirSync(dirPath, { withFileTypes: true })
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item.name)
      const itemRelativePath = path.join(relativePath, item.name)
      
      if (item.isDirectory()) {
        await this.scanAndFix(itemPath, itemRelativePath)
      } else if (item.name.endsWith('.md')) {
        this.stats.filesProcessed++
        await this.processFile(itemPath, itemRelativePath)
      }
    }
  }

  async processFile(filePath, relativePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const frontmatterResult = this.extractFrontmatter(content)
      
      if (!frontmatterResult.frontmatter) {
        return // Skip files without frontmatter
      }
      
      const originalFrontmatter = frontmatterResult.frontmatter
      
      // Skip files with good keywords already (not empty and not generic)
      if (this.hasGoodKeywords(originalFrontmatter, relativePath)) {
        return
      }
      
      const correctedFrontmatter = await this.generateContextualKeywords(
        originalFrontmatter, 
        relativePath, 
        content
      )
      
      if (this.hasChanges(originalFrontmatter, correctedFrontmatter)) {
        if (this.options.dryRun) {
          this.recordFix(relativePath, originalFrontmatter, correctedFrontmatter, 'DRY_RUN')
        } else {
          await this.writeFixedFile(filePath, relativePath, content, correctedFrontmatter)
          this.recordFix(relativePath, originalFrontmatter, correctedFrontmatter, 'APPLIED')
        }
        
        this.stats.filesFixed++
      }
      
    } catch (error) {
      console.error(chalk.red(`❌ Error processing ${relativePath}: ${error.message}`))
    }
  }

  hasGoodKeywords(frontmatter, relativePath) {
    // Skip framework files - they're already correct
    if (relativePath.includes('/frameworks/') && 
        ['MEF', 'ZOF', 'OIF', 'MOC', 'MAL'].includes(frontmatter.framework)) {
      return true
    }
    
    // Skip files with manually curated keywords (already done)
    const keywords = frontmatter.keywords || []
    if (keywords.length > 3 && keywords.includes('Matrix Protocol') && 
        keywords.some(k => !['Matrix Protocol'].includes(k))) {
      return true
    }
    
    return false
  }

  generateContextualKeywords(frontmatter, relativePath, content) {
    const corrected = { ...frontmatter }
    const keywords = new Set(['Matrix Protocol']) // Always include base
    
    const title = frontmatter.title || ''
    const description = frontmatter.description || ''
    const path = relativePath.toLowerCase()
    
    // Contextual keyword generation based on file path and content
    
    // Templates
    if (path.includes('/templates/')) {
      keywords.add('templates')
      keywords.add('implementation')
      
      if (path.includes('startup')) keywords.add('startup')
      if (path.includes('scaleup')) keywords.add('scaleup')
      if (path.includes('enterprise')) keywords.add('enterprise')
      if (path.includes('corporation')) keywords.add('corporation')
      if (path.includes('moc')) keywords.add('MOC')
    }
    
    // Examples
    if (path.includes('/examples/')) {
      keywords.add('examples')
      keywords.add('use cases')
      
      if (path.includes('knowledge')) keywords.add('knowledge')
      if (path.includes('structured')) keywords.add('structured')
      if (path.includes('unstructured')) keywords.add('unstructured')
      if (path.includes('business-rules')) keywords.add('business rules')
      if (path.includes('technical-patterns')) keywords.add('technical patterns')
      if (path.includes('procedures')) keywords.add('procedures')
      if (path.includes('uki-')) keywords.add('UKI')
    }
    
    // Manual and Tools
    if (path.includes('/manual/')) {
      keywords.add('manual')
      keywords.add('guide')
      
      if (path.includes('/tools/')) {
        keywords.add('tools')
        keywords.add('utilities')
      }
      
      if (title.toLowerCase().includes('audit')) keywords.add('audit')
      if (title.toLowerCase().includes('validation')) keywords.add('validation')
      if (title.toLowerCase().includes('assessment')) keywords.add('assessment')
      if (title.toLowerCase().includes('governance')) keywords.add('governance')
    }
    
    // Quickstart
    if (path.includes('/quickstart/')) {
      keywords.add('quickstart')
      keywords.add('getting started')
      keywords.add('tutorial')
    }
    
    // Content-based keywords from title and description
    const combinedText = `${title} ${description}`.toLowerCase()
    
    if (combinedText.includes('epistem')) keywords.add('epistemology')
    if (combinedText.includes('architect')) keywords.add('architecture')
    if (combinedText.includes('integrat')) keywords.add('integration')
    if (combinedText.includes('collaborat')) keywords.add('collaboration')
    if (combinedText.includes('organi')) keywords.add('organizational')
    if (combinedText.includes('implement')) keywords.add('implementation')
    if (combinedText.includes('structure')) keywords.add('structures')
    if (combinedText.includes('workflow')) keywords.add('workflows')
    if (combinedText.includes('pattern')) keywords.add('patterns')
    if (combinedText.includes('glossary') || combinedText.includes('definition')) {
      keywords.add('glossary')
      keywords.add('definitions')
    }
    
    // Convert to final format
    corrected.keywords = Array.from(keywords).slice(0, 7) // Max 7 keywords
    this.stats.keywordsAdded += corrected.keywords.length
    
    if (this.options.verbose) {
      console.log(chalk.green(`✨ ${relativePath}: ${corrected.keywords.join(', ')}`))
    }
    
    return corrected
  }

  extractFrontmatter(content) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/
    const match = content.match(frontmatterRegex)
    
    if (!match) {
      return { frontmatter: null }
    }
    
    try {
      const frontmatter = yaml.load(match[1])
      return { frontmatter }
    } catch (error) {
      return { frontmatter: null, error: error.message }
    }
  }

  hasChanges(original, corrected) {
    return JSON.stringify(original.keywords || []) !== JSON.stringify(corrected.keywords || [])
  }

  async writeFixedFile(filePath, relativePath, originalContent, correctedFrontmatter) {
    const yamlContent = yaml.dump(correctedFrontmatter, { 
      indent: 2,
      lineWidth: -1,
      noRefs: true
    })
    
    const newContent = originalContent.replace(/^---\n[\s\S]*?\n---/, `---\n${yamlContent}---`)
    
    fs.writeFileSync(filePath, newContent, 'utf-8')
    
    if (this.options.verbose) {
      console.log(chalk.green(`✅ Fixed: ${relativePath}`))
    }
  }

  recordFix(file, original, corrected, status) {
    this.fixes.push({
      file,
      status,
      original: original.keywords || [],
      corrected: corrected.keywords || []
    })
  }

  generateReport() {
    console.log('\n' + chalk.bold('📊 Contextual Keywords Fix Report'))
    console.log('═'.repeat(60))
    
    console.log(chalk.blue('\n📈 Summary Statistics'))
    console.log(`Files Processed: ${this.stats.filesProcessed}`)
    console.log(`Files Fixed: ${this.stats.filesFixed}`)
    console.log(`Keywords Added: ${this.stats.keywordsAdded}`)
    
    if (this.fixes.length > 0) {
      console.log(chalk.blue('\n🔧 Sample Fixes (First 10)'))
      
      this.fixes.slice(0, 10).forEach((fix, index) => {
        const statusColor = fix.status === 'DRY_RUN' ? chalk.yellow : chalk.green
        console.log(`${index + 1}. ${statusColor(fix.status)}: ${fix.file}`)
        console.log(`   Keywords: ${fix.corrected.join(', ')}`)
        console.log('')
      })
      
      if (this.fixes.length > 10) {
        console.log(chalk.gray(`... and ${this.fixes.length - 10} more files`))
      }
    }
    
    if (this.options.dryRun) {
      console.log(chalk.yellow('\n🔍 DRY RUN MODE - No files were actually modified'))
    } else {
      console.log(chalk.green(`\n✅ All fixes applied successfully!`))
    }
    
    console.log('\n' + '═'.repeat(60))
  }
}

// CLI interface
import { program } from 'commander'

program
  .name('fix-keywords-contextual')
  .description('Fix keywords based on contextual analysis')
  .version('1.0.0')

program
  .option('-d, --dry-run', 'Preview fixes without applying them', false)
  .option('-v, --verbose', 'Show detailed output', false)

program.action(async (options) => {
  try {
    const fixer = new ContextualKeywordsFixer(options)
    const fixedCount = await fixer.fixAll()
    
    console.log(chalk.green(`\n🎉 Contextual keywords fix complete! ${fixedCount} files fixed.`))
    
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

export default ContextualKeywordsFixer