#!/usr/bin/env node

/**
 * Complete Metadata Audit Tool
 * 
 * Audits ALL content files to identify any incorrect classifications,
 * inappropriate keywords, wrong frameworks, or misapplied fields.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import yaml from 'js-yaml'
import chalk from 'chalk'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')
const CONTENT_DIR = path.join(PROJECT_ROOT, 'content')

class CompleteMetadataAuditor {
  constructor() {
    this.issues = []
    this.stats = {
      totalFiles: 0,
      filesWithIssues: 0,
      frameworkIssues: 0,
      keywordIssues: 0,
      categoryIssues: 0,
      layoutIssues: 0
    }
    
    // Define what makes sense for each content type
    this.contentTypeRules = {
      '/frameworks/': {
        expectedLayouts: ['docs', 'framework'],
        expectedCategories: ['frameworks'],
        shouldHaveFramework: true,
        allowedFrameworks: ['MEF', 'ZOF', 'OIF', 'MOC', 'MAL', 'MEP', 'general']
      },
      '/examples/': {
        expectedLayouts: ['docs', 'example'],
        expectedCategories: ['examples'],
        shouldHaveFramework: false, // Examples usually don't declare framework
        allowedFrameworks: ['MEF', 'ZOF', 'OIF', 'MOC', 'MAL', 'MEP', 'general']
      },
      '/manual/': {
        expectedLayouts: ['docs'],
        expectedCategories: ['manual'],
        shouldHaveFramework: false,
        allowedFrameworks: ['general']
      },
      '/quickstart/': {
        expectedLayouts: ['docs'],
        expectedCategories: ['quickstart'],
        shouldHaveFramework: false,
        allowedFrameworks: ['general']
      },
      '/docs/': {
        expectedLayouts: ['docs'],
        expectedCategories: ['docs'],
        shouldHaveFramework: false,
        allowedFrameworks: ['general']
      }
    }
    
    // Framework-specific keyword validation
    this.frameworkKeywords = {
      'MEF': ['MEF', 'knowledge', 'embedding'],
      'ZOF': ['ZOF', 'workflow', 'orchestration'],
      'OIF': ['OIF', 'operator', 'intelligence'],
      'MOC': ['MOC', 'ontology', 'catalog'],
      'MAL': ['MAL', 'arbiter', 'layer'],
      'MEP': ['MEP', 'epistemic', 'principle'],
      'general': [] // No specific requirements
    }
    
    // Keywords that should NEVER appear together
    this.conflictingKeywords = [
      ['MEF', 'ZOF'], ['MEF', 'OIF'], ['MEF', 'MAL'], 
      ['ZOF', 'OIF'], ['ZOF', 'MOC'], ['ZOF', 'MAL'],
      ['OIF', 'MOC'], ['OIF', 'MAL'], ['MOC', 'MAL']
    ]
  }

  async audit() {
    console.log(chalk.blue('🔍 Starting complete metadata audit...'))
    
    await this.scanAllFiles(CONTENT_DIR, '')
    
    this.generateReport()
    
    return this.issues
  }

  async scanAllFiles(dirPath, relativePath) {
    const items = fs.readdirSync(dirPath, { withFileTypes: true })
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item.name)
      const itemRelativePath = path.join(relativePath, item.name)
      
      if (item.isDirectory()) {
        await this.scanAllFiles(itemPath, itemRelativePath)
      } else if (item.name.endsWith('.md')) {
        this.stats.totalFiles++
        await this.auditFile(itemPath, itemRelativePath)
      }
    }
  }

  async auditFile(filePath, relativePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const frontmatterResult = this.extractFrontmatter(content)
      
      if (!frontmatterResult.frontmatter) {
        this.addIssue('MISSING_FRONTMATTER', relativePath, 'File has no frontmatter', 'HIGH')
        return
      }
      
      const frontmatter = frontmatterResult.frontmatter
      let hasIssues = false
      
      // Audit different aspects
      if (this.auditFrameworkClassification(frontmatter, relativePath)) hasIssues = true
      if (this.auditKeywords(frontmatter, relativePath)) hasIssues = true
      if (this.auditLayout(frontmatter, relativePath)) hasIssues = true
      if (this.auditCategory(frontmatter, relativePath)) hasIssues = true
      if (this.auditConflictingKeywords(frontmatter, relativePath)) hasIssues = true
      
      if (hasIssues) {
        this.stats.filesWithIssues++
      }
      
    } catch (error) {
      this.addIssue('FILE_READ_ERROR', relativePath, `Error reading file: ${error.message}`, 'HIGH')
    }
  }

  auditFrameworkClassification(frontmatter, relativePath) {
    let hasIssues = false
    
    // Determine expected behavior based on file path
    const contentType = this.getContentType(relativePath)
    const rules = this.contentTypeRules[contentType]
    
    if (!rules) return false // No specific rules for this path
    
    if (frontmatter.framework) {
      // File has framework declaration - check if it should
      if (!rules.shouldHaveFramework && contentType !== '/frameworks/') {
        // Non-framework files usually shouldn't declare frameworks
        if (!relativePath.includes('index.md')) { // Index files might be exception
          this.addIssue('UNEXPECTED_FRAMEWORK', relativePath, 
            `File declares framework "${frontmatter.framework}" but is not a framework file`, 'MEDIUM')
          this.stats.frameworkIssues++
          hasIssues = true
        }
      }
      
      // Check if framework value is valid
      if (!rules.allowedFrameworks.includes(frontmatter.framework)) {
        this.addIssue('INVALID_FRAMEWORK', relativePath,
          `Invalid framework "${frontmatter.framework}" for content type ${contentType}`, 'HIGH')
        this.stats.frameworkIssues++
        hasIssues = true
      }
    } else {
      // File has no framework declaration - check if it should
      if (rules.shouldHaveFramework) {
        this.addIssue('MISSING_FRAMEWORK', relativePath,
          `Framework file should declare a framework`, 'HIGH')
        this.stats.frameworkIssues++
        hasIssues = true
      }
    }
    
    return hasIssues
  }

  auditKeywords(frontmatter, relativePath) {
    let hasIssues = false
    
    if (!frontmatter.keywords || frontmatter.keywords.length === 0) {
      return false // No keywords to audit
    }
    
    const keywords = frontmatter.keywords
    
    // If file declares a framework, check keywords are appropriate
    if (frontmatter.framework && this.frameworkKeywords[frontmatter.framework]) {
      const expectedKeywords = this.frameworkKeywords[frontmatter.framework]
      
      if (expectedKeywords.length > 0) {
        const hasFrameworkKeyword = expectedKeywords.some(expected =>
          keywords.some(keyword => keyword.toLowerCase().includes(expected.toLowerCase()))
        )
        
        if (!hasFrameworkKeyword) {
          this.addIssue('MISSING_FRAMEWORK_KEYWORDS', relativePath,
            `Framework ${frontmatter.framework} content should include keywords: ${expectedKeywords.join(', ')}`, 'LOW')
          this.stats.keywordIssues++
          hasIssues = true
        }
      }
    }
    
    // Check for obviously irrelevant keywords based on file path
    const irrelevantKeywords = this.findIrrelevantKeywords(keywords, relativePath)
    if (irrelevantKeywords.length > 0) {
      this.addIssue('IRRELEVANT_KEYWORDS', relativePath,
        `Keywords seem irrelevant to file content: ${irrelevantKeywords.join(', ')}`, 'MEDIUM')
      this.stats.keywordIssues++
      hasIssues = true
    }
    
    return hasIssues
  }

  auditConflictingKeywords(frontmatter, relativePath) {
    let hasIssues = false
    
    if (!frontmatter.keywords || frontmatter.keywords.length === 0) {
      return false
    }
    
    const keywords = frontmatter.keywords.map(k => k.toUpperCase())
    
    // Check for conflicting framework keywords
    for (const [fw1, fw2] of this.conflictingKeywords) {
      if (keywords.includes(fw1) && keywords.includes(fw2)) {
        this.addIssue('CONFLICTING_KEYWORDS', relativePath,
          `File has conflicting framework keywords: ${fw1} and ${fw2}`, 'HIGH')
        this.stats.keywordIssues++
        hasIssues = true
      }
    }
    
    return hasIssues
  }

  auditLayout(frontmatter, relativePath) {
    let hasIssues = false
    
    const contentType = this.getContentType(relativePath)
    const rules = this.contentTypeRules[contentType]
    
    if (!rules || !frontmatter.layout) return false
    
    if (!rules.expectedLayouts.includes(frontmatter.layout)) {
      this.addIssue('INAPPROPRIATE_LAYOUT', relativePath,
        `Layout "${frontmatter.layout}" not typical for ${contentType}. Expected: ${rules.expectedLayouts.join(', ')}`, 'LOW')
      this.stats.layoutIssues++
      hasIssues = true
    }
    
    return hasIssues
  }

  auditCategory(frontmatter, relativePath) {
    let hasIssues = false
    
    const contentType = this.getContentType(relativePath)
    const rules = this.contentTypeRules[contentType]
    
    if (!rules || !frontmatter.category) return false
    
    if (!rules.expectedCategories.includes(frontmatter.category)) {
      this.addIssue('INAPPROPRIATE_CATEGORY', relativePath,
        `Category "${frontmatter.category}" not typical for ${contentType}. Expected: ${rules.expectedCategories.join(', ')}`, 'LOW')
      this.stats.categoryIssues++
      hasIssues = true
    }
    
    return hasIssues
  }

  findIrrelevantKeywords(keywords, relativePath) {
    const irrelevant = []
    
    // Examples of obviously irrelevant combinations
    if (relativePath.includes('/manual/') && keywords.some(k => k.toLowerCase().includes('example'))) {
      irrelevant.push('example-related keywords in manual')
    }
    
    if (relativePath.includes('/examples/') && keywords.some(k => k.toLowerCase().includes('manual'))) {
      irrelevant.push('manual-related keywords in examples')
    }
    
    // Check for framework keywords in non-framework files
    if (!relativePath.includes('/frameworks/')) {
      const frameworkKeywordsFound = []
      for (const [framework, kwds] of Object.entries(this.frameworkKeywords)) {
        if (framework === 'general') continue
        
        for (const kwd of kwds) {
          if (keywords.some(k => k.toLowerCase().includes(kwd.toLowerCase()))) {
            frameworkKeywordsFound.push(kwd)
          }
        }
      }
      
      if (frameworkKeywordsFound.length > 0) {
        irrelevant.push(...frameworkKeywordsFound)
      }
    }
    
    return irrelevant
  }

  getContentType(relativePath) {
    for (const [type, rules] of Object.entries(this.contentTypeRules)) {
      if (relativePath.includes(type)) {
        return type
      }
    }
    return null
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

  addIssue(type, file, message, severity) {
    this.issues.push({
      type,
      file,
      message,
      severity
    })
  }

  generateReport() {
    console.log('\n' + chalk.bold('📊 Complete Metadata Audit Report'))
    console.log('═'.repeat(60))
    
    // Summary stats
    console.log(chalk.blue('\n📈 Summary Statistics'))
    console.log(`Total Files Scanned: ${this.stats.totalFiles}`)
    console.log(`Files with Issues: ${this.stats.filesWithIssues}`)
    console.log(`Total Issues Found: ${this.issues.length}`)
    
    // Issue breakdown
    console.log(chalk.blue('\n📋 Issues by Type'))
    console.log(`Framework Issues: ${this.stats.frameworkIssues}`)
    console.log(`Keyword Issues: ${this.stats.keywordIssues}`)
    console.log(`Layout Issues: ${this.stats.layoutIssues}`)
    console.log(`Category Issues: ${this.stats.categoryIssues}`)
    
    // Severity breakdown
    const bySeverity = { HIGH: 0, MEDIUM: 0, LOW: 0 }
    for (const issue of this.issues) {
      bySeverity[issue.severity]++
    }
    
    console.log(chalk.blue('\n🚨 Issues by Severity'))
    console.log(`${chalk.red('HIGH')}: ${bySeverity.HIGH}`)
    console.log(`${chalk.yellow('MEDIUM')}: ${bySeverity.MEDIUM}`)
    console.log(`${chalk.gray('LOW')}: ${bySeverity.LOW}`)
    
    // Show critical issues
    const highIssues = this.issues.filter(i => i.severity === 'HIGH')
    if (highIssues.length > 0) {
      console.log(chalk.red('\n🚨 HIGH SEVERITY ISSUES'))
      highIssues.slice(0, 10).forEach((issue, index) => {
        console.log(`${index + 1}. ${chalk.red(issue.type)}: ${issue.file}`)
        console.log(`   ${issue.message}`)
        console.log('')
      })
    }
    
    // Show medium issues
    const mediumIssues = this.issues.filter(i => i.severity === 'MEDIUM')
    if (mediumIssues.length > 0) {
      console.log(chalk.yellow('\n⚠️  MEDIUM SEVERITY ISSUES'))
      mediumIssues.slice(0, 10).forEach((issue, index) => {
        console.log(`${index + 1}. ${chalk.yellow(issue.type)}: ${issue.file}`)
        console.log(`   ${issue.message}`)
        console.log('')
      })
      
      if (mediumIssues.length > 10) {
        console.log(chalk.gray(`... and ${mediumIssues.length - 10} more medium issues`))
      }
    }
    
    console.log('\n' + '═'.repeat(60))
    
    if (this.issues.length === 0) {
      console.log(chalk.green('✅ No issues found! All metadata appears correct.'))
    } else {
      console.log(chalk.yellow(`⚠️  ${this.issues.length} issues found that may need correction.`))
    }
  }
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const auditor = new CompleteMetadataAuditor()
  auditor.audit().catch(console.error)
}

export default CompleteMetadataAuditor