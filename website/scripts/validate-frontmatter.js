#!/usr/bin/env node

/**
 * TASK 1.2.2: Frontmatter Validation CLI Tool
 * 
 * Complete validation tool for Matrix Protocol content metadata
 * with JSON Schema validation, custom rules, and batch processing.
 * 
 * Dependencies: TASK 1.2.1 (schema), TASK 1.1.4 (inconsistency report)
 * Usage: node scripts/validate-frontmatter.js [options]
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { program } from 'commander'
import yaml from 'js-yaml'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import chalk from 'chalk'
import ora from 'ora'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')
const CONTENT_DIR = path.join(PROJECT_ROOT, 'content')
const SCHEMA_FILE = path.join(PROJECT_ROOT, 'schemas', 'content-metadata.schema.json')

class FrontmatterValidator {
  constructor(options = {}) {
    this.options = {
      verbose: false,
      fix: false,
      outputFile: null,
      pattern: '**/*.md',
      failFast: false,
      ...options
    }
    
    this.stats = {
      totalFiles: 0,
      validFiles: 0,
      invalidFiles: 0,
      fixedFiles: 0,
      skippedFiles: 0
    }
    
    this.results = []
    this.schema = null
    this.ajv = null
    this.spinner = null
    
    this.initializeValidator()
  }

  initializeValidator() {
    // Load JSON Schema
    if (!fs.existsSync(SCHEMA_FILE)) {
      throw new Error(`Schema file not found: ${SCHEMA_FILE}`)
    }
    
    this.schema = JSON.parse(fs.readFileSync(SCHEMA_FILE, 'utf-8'))
    
    // Initialize AJV validator
    this.ajv = new Ajv({ 
      allErrors: true,
      verbose: true,
      strict: false
    })
    addFormats(this.ajv)
    
    this.validate = this.ajv.compile(this.schema)
  }

  async validateProject() {
    this.log(chalk.blue('🔍 Starting Matrix Protocol frontmatter validation...'))
    
    if (!fs.existsSync(CONTENT_DIR)) {
      throw new Error(`Content directory not found: ${CONTENT_DIR}`)
    }

    this.spinner = ora('Scanning content files...').start()
    
    try {
      await this.scanDirectory(CONTENT_DIR, '')
      
      this.spinner.succeed(`✅ Validation complete: ${this.stats.validFiles}/${this.stats.totalFiles} files valid`)
      
      this.printSummary()
      
      if (this.options.outputFile) {
        await this.generateReport()
      }
      
      return this.stats.invalidFiles === 0
      
    } catch (error) {
      this.spinner.fail(`❌ Validation failed: ${error.message}`)
      throw error
    }
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
        this.updateSpinner(`Validating ${itemRelativePath}...`)
        
        try {
          await this.validateFile(itemPath, itemRelativePath)
        } catch (error) {
          this.stats.skippedFiles++
          this.addResult(itemRelativePath, 'ERROR', [], `File processing error: ${error.message}`)
          
          if (this.options.failFast) {
            throw error
          }
        }
      }
    }
  }

  async validateFile(filePath, relativePath) {
    const content = fs.readFileSync(filePath, 'utf-8')
    const frontmatterResult = this.extractFrontmatter(content, relativePath)
    
    if (!frontmatterResult.frontmatter) {
      this.stats.invalidFiles++
      this.addResult(relativePath, 'INVALID', [], frontmatterResult.error || 'No frontmatter found')
      return
    }
    
    // JSON Schema validation
    const isValid = this.validate(frontmatterResult.frontmatter)
    const schemaErrors = this.validate.errors || []
    
    // Custom validation rules
    const customValidation = await this.validateCustomRules(frontmatterResult.frontmatter, relativePath)
    
    // Combine all validation results
    const allErrors = [
      ...schemaErrors.map(err => this.formatSchemaError(err)),
      ...customValidation.errors
    ]
    
    const warnings = customValidation.warnings || []
    
    if (allErrors.length === 0) {
      this.stats.validFiles++
      this.addResult(relativePath, 'VALID', warnings)
      
      if (this.options.verbose) {
        this.log(chalk.green(`✓ ${relativePath}`))
      }
    } else {
      this.stats.invalidFiles++
      this.addResult(relativePath, 'INVALID', warnings, null, allErrors)
      
      if (this.options.verbose) {
        this.log(chalk.red(`✗ ${relativePath}`))
        allErrors.forEach(error => {
          this.log(chalk.red(`  - ${error}`))
        })
      }
      
      // Attempt auto-fix if enabled
      if (this.options.fix) {
        const fixed = await this.attemptAutoFix(filePath, relativePath, frontmatterResult.frontmatter, allErrors)
        if (fixed) {
          this.stats.fixedFiles++
        }
      }
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
      return { frontmatter: null, error: `Invalid YAML: ${error.message}` }
    }
  }

  async validateCustomRules(frontmatter, filePath) {
    const errors = []
    const warnings = []
    
    // Framework-specific validations
    if (frontmatter.framework) {
      const frameworkErrors = this.validateFramework(frontmatter, filePath)
      errors.push(...frameworkErrors)
    }
    
    // Navigation validations
    if (frontmatter.navigation) {
      const navErrors = this.validateNavigation(frontmatter.navigation, filePath)
      errors.push(...navErrors)
    }
    
    // SEO optimizations
    const seoWarnings = this.validateSEO(frontmatter)
    warnings.push(...seoWarnings)
    
    // Multilingual consistency
    const multilingualErrors = this.validateMultilingual(frontmatter, filePath)
    errors.push(...multilingualErrors)
    
    return { errors, warnings }
  }

  validateFramework(frontmatter, filePath) {
    const errors = []
    const { framework, keywords = [], category } = frontmatter
    
    const frameworkKeywords = {
      'MEF': ['MEF', 'knowledge', 'embedding'],
      'ZOF': ['ZOF', 'workflow', 'orchestration'], 
      'OIF': ['OIF', 'operator', 'intelligence'],
      'MOC': ['MOC', 'ontology', 'catalog'],
      'MAL': ['MAL', 'arbiter', 'layer'],
      'MEP': ['MEP', 'epistemic', 'principle']
    }
    
    if (frameworkKeywords[framework]) {
      const requiredKeywords = frameworkKeywords[framework]
      const hasFrameworkKeyword = requiredKeywords.some(keyword =>
        keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase()))
      )
      
      if (!hasFrameworkKeyword) {
        errors.push(`Framework ${framework} content should include related keywords: ${requiredKeywords.join(', ')}`)
      }
    }
    
    return errors
  }

  validateNavigation(navigation, filePath) {
    const errors = []
    
    if (navigation.order !== undefined) {
      if (!Number.isInteger(navigation.order) || navigation.order < 0) {
        errors.push('Navigation order must be a non-negative integer')
      }
    }
    
    if (navigation.parent && !navigation.parent.startsWith('/')) {
      errors.push('Navigation parent path must start with "/"')
    }
    
    if (navigation.badge) {
      if (!navigation.badge.text || navigation.badge.text.length > 10) {
        errors.push('Navigation badge text must be 1-10 characters')
      }
    }
    
    return errors
  }

  validateSEO(frontmatter) {
    const warnings = []
    const { title, description, keywords = [] } = frontmatter
    
    if (title && title.length > 60) {
      warnings.push(`Title too long for SEO (${title.length} chars, recommended: ≤60)`)
    }
    
    if (description && description.length > 155) {
      warnings.push(`Description too long for SEO (${description.length} chars, recommended: ≤155)`)
    }
    
    if (keywords.length === 0) {
      warnings.push('Consider adding keywords for better SEO')
    } else if (keywords.length > 8) {
      warnings.push(`Too many keywords (${keywords.length}, recommended: 3-8)`)
    }
    
    return warnings
  }

  validateMultilingual(frontmatter, filePath) {
    const errors = []
    
    const detectedLang = filePath.includes('en/') ? 'en' : 
                        filePath.includes('pt/') ? 'pt' : 
                        filePath === 'index.md' ? null : // Root index file is allowed
                        null
    
    if (!detectedLang && filePath !== 'index.md') {
      errors.push('Cannot detect language from file path. Content must be in /pt/ or /en/ directory')
    }
    
    // Check both content.language and lang fields (skip for root index)
    const declaredLang = frontmatter.content?.language || frontmatter.lang
    if (declaredLang && detectedLang && declaredLang !== detectedLang) {
      errors.push(`Language mismatch: declared "${declaredLang}" but path indicates "${detectedLang}"`)
    }
    
    return errors
  }

  formatSchemaError(error) {
    const instancePath = error.instancePath || ''
    const field = instancePath.replace('/', '') || 'root'
    
    switch (error.keyword) {
      case 'required':
        return `Missing required field: ${error.params.missingProperty}`
      case 'type':
        return `Field "${field}" should be ${error.params.type}`
      case 'enum':
        return `Field "${field}" should be one of: ${error.params.allowedValues.join(', ')}`
      case 'minLength':
        return `Field "${field}" is too short (minimum: ${error.params.limit})`
      case 'maxLength':
        return `Field "${field}" is too long (maximum: ${error.params.limit})`
      case 'pattern':
        return `Field "${field}" format is invalid`
      default:
        return `${field}: ${error.message}`
    }
  }

  async attemptAutoFix(filePath, relativePath, frontmatter, errors) {
    // Simple auto-fixes for common issues
    let fixed = false
    const newFrontmatter = { ...frontmatter }
    
    // Auto-detect and fix language
    const detectedLang = relativePath.includes('/en/') ? 'en' : 
                        relativePath.includes('/pt/') ? 'pt' : null
    
    if (detectedLang && (!newFrontmatter.content || !newFrontmatter.content.language)) {
      if (!newFrontmatter.content) newFrontmatter.content = {}
      newFrontmatter.content.language = detectedLang
      fixed = true
    }
    
    // Auto-add missing layout
    if (!newFrontmatter.layout) {
      if (relativePath.includes('/frameworks/')) {
        newFrontmatter.layout = 'framework'
      } else if (relativePath.includes('/docs/')) {
        newFrontmatter.layout = 'docs'
      } else if (relativePath.includes('/examples/')) {
        newFrontmatter.layout = 'example'
      } else {
        newFrontmatter.layout = 'default'
      }
      fixed = true
    }
    
    if (fixed) {
      // Write back the fixed frontmatter
      const content = fs.readFileSync(filePath, 'utf-8')
      const newYaml = yaml.dump(newFrontmatter, { indent: 2 })
      const newContent = content.replace(/^---\n[\s\S]*?\n---/, `---\n${newYaml}---`)
      
      fs.writeFileSync(filePath, newContent, 'utf-8')
      this.log(chalk.yellow(`🔧 Auto-fixed: ${relativePath}`))
    }
    
    return fixed
  }

  addResult(file, status, warnings = [], error = null, errors = []) {
    this.results.push({
      file,
      status,
      warnings,
      error,
      errors: errors || []
    })
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
    console.log('\n' + chalk.bold('📊 Validation Summary'))
    console.log('─'.repeat(50))
    
    console.log(`Total Files: ${chalk.blue(this.stats.totalFiles)}`)
    console.log(`Valid Files: ${chalk.green(this.stats.validFiles)}`)
    console.log(`Invalid Files: ${chalk.red(this.stats.invalidFiles)}`)
    
    if (this.stats.fixedFiles > 0) {
      console.log(`Auto-Fixed: ${chalk.yellow(this.stats.fixedFiles)}`)
    }
    
    if (this.stats.skippedFiles > 0) {
      console.log(`Skipped Files: ${chalk.gray(this.stats.skippedFiles)}`)
    }
    
    const successRate = ((this.stats.validFiles / this.stats.totalFiles) * 100).toFixed(1)
    console.log(`Success Rate: ${chalk.blue(successRate)}%`)
    
    // Show top errors
    if (this.stats.invalidFiles > 0) {
      console.log('\n' + chalk.red('❌ Validation Errors:'))
      
      const invalidResults = this.results.filter(r => r.status === 'INVALID')
      invalidResults.slice(0, 5).forEach(result => {
        console.log(chalk.red(`  • ${result.file}`))
        if (result.errors.length > 0) {
          result.errors.slice(0, 3).forEach(error => {
            console.log(chalk.red(`    - ${error}`))
          })
        }
      })
      
      if (invalidResults.length > 5) {
        console.log(chalk.gray(`    ... and ${invalidResults.length - 5} more files with errors`))
      }
    }
  }

  async generateReport() {
    const timestamp = new Date().toISOString()
    const report = {
      timestamp,
      stats: this.stats,
      results: this.results,
      schema_version: this.schema.version
    }
    
    fs.writeFileSync(this.options.outputFile, JSON.stringify(report, null, 2), 'utf-8')
    console.log(`\n📄 Detailed report saved to: ${this.options.outputFile}`)
  }
}

// CLI Interface
program
  .name('validate-frontmatter')
  .description('Matrix Protocol frontmatter validation tool')
  .version('1.0.0')

program
  .option('-v, --verbose', 'Show detailed validation results', false)
  .option('-f, --fix', 'Attempt to auto-fix common issues', false)
  .option('-o, --output-file <file>', 'Output detailed JSON report to file')
  .option('-p, --pattern <pattern>', 'File pattern to validate', '**/*.md')
  .option('--fail-fast', 'Stop on first error', false)

program.action(async (options) => {
  try {
    const validator = new FrontmatterValidator(options)
    const success = await validator.validateProject()
    
    process.exit(success ? 0 : 1)
    
  } catch (error) {
    console.error(chalk.red(`❌ Error: ${error.message}`))
    process.exit(1)
  }
})

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  program.parse()
}

export default FrontmatterValidator