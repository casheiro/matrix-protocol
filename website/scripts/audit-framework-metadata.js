#!/usr/bin/env node

/**
 * Framework Metadata Audit Tool
 * 
 * Audits all content files to identify incorrect framework classifications,
 * focusing on files in /frameworks/ directory and cross-references.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import yaml from 'js-yaml'
import chalk from 'chalk'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')
const CONTENT_DIR = path.join(PROJECT_ROOT, 'content')

class FrameworkAuditor {
  constructor() {
    this.issues = []
    this.frameworkFiles = new Map()
    this.stats = {
      totalFiles: 0,
      frameworkFilesFound: 0,
      incorrectClassifications: 0,
      missingFrameworks: 0,
      incorrectKeywords: 0
    }
    
    // Expected framework mappings based on file paths and naming
    this.expectedMappings = {
      '/frameworks/mef.md': { framework: 'MEF', keywords: ['MEF', 'knowledge', 'embedding'] },
      '/frameworks/zof.md': { framework: 'ZOF', keywords: ['ZOF', 'workflow', 'orchestration'] },
      '/frameworks/oif.md': { framework: 'OIF', keywords: ['OIF', 'operator', 'intelligence'] },
      '/frameworks/moc.md': { framework: 'MOC', keywords: ['MOC', 'ontology', 'catalog'] },
      '/frameworks/mal.md': { framework: 'MAL', keywords: ['MAL', 'arbiter', 'layer'] },
      '/frameworks/mep.md': { framework: 'MEP', keywords: ['MEP', 'epistemic', 'principle'] },
      '/frameworks/mef-ontology.md': { framework: 'MEF', keywords: ['MEF', 'ontology', 'knowledge'] },
      '/frameworks/inference-reasoning.md': { framework: 'general', keywords: ['inference', 'reasoning', 'AI'] }
    }
  }

  async audit() {
    console.log(chalk.blue('🔍 Starting framework metadata audit...'))
    
    await this.scanAllFiles(CONTENT_DIR, '')
    
    this.analyzeIssues()
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
        return // Skip files without frontmatter
      }
      
      const frontmatter = frontmatterResult.frontmatter
      
      // Check if this should be a framework file
      const isFrameworkFile = relativePath.includes('/frameworks/')
      if (isFrameworkFile) {
        this.stats.frameworkFilesFound++
        await this.auditFrameworkFile(filePath, relativePath, frontmatter)
      }
      
      // Check files with framework declarations
      if (frontmatter.framework) {
        await this.auditFrameworkDeclaration(filePath, relativePath, frontmatter)
      }
      
    } catch (error) {
      this.addIssue('FILE_READ_ERROR', relativePath, `Error reading file: ${error.message}`)
    }
  }

  async auditFrameworkFile(filePath, relativePath, frontmatter) {
    const normalizedPath = relativePath.replace(/\\/g, '/').replace(/^(en|pt)\/docs/, '')
    const expected = this.expectedMappings[normalizedPath]
    
    if (!expected) {
      this.addIssue('UNMAPPED_FRAMEWORK_FILE', relativePath, 
        `Framework file not in expected mappings: ${normalizedPath}`)
      return
    }
    
    // Check framework classification
    if (frontmatter.framework !== expected.framework) {
      this.stats.incorrectClassifications++
      this.addIssue('INCORRECT_FRAMEWORK', relativePath, 
        `Expected framework: ${expected.framework}, found: ${frontmatter.framework || 'none'}`,
        { expected: expected.framework, actual: frontmatter.framework })
    }
    
    // Check keywords
    const actualKeywords = frontmatter.keywords || []
    const expectedKeywords = expected.keywords
    
    const hasCorrectKeywords = expectedKeywords.every(keyword =>
      actualKeywords.some(k => k.toLowerCase().includes(keyword.toLowerCase()))
    )
    
    if (!hasCorrectKeywords) {
      this.stats.incorrectKeywords++
      this.addIssue('INCORRECT_KEYWORDS', relativePath,
        `Expected keywords containing: ${expectedKeywords.join(', ')}, found: ${actualKeywords.join(', ')}`,
        { expected: expectedKeywords, actual: actualKeywords })
    }
  }

  async auditFrameworkDeclaration(filePath, relativePath, frontmatter) {
    const declaredFramework = frontmatter.framework
    
    // Check if framework declaration makes sense based on file path
    if (relativePath.includes('/frameworks/')) {
      // Already handled in auditFrameworkFile
      return
    }
    
    // Check if framework-specific files have appropriate keywords
    const frameworkKeywords = {
      'MEF': ['MEF', 'knowledge', 'embedding'],
      'ZOF': ['ZOF', 'workflow', 'orchestration'],
      'OIF': ['OIF', 'operator', 'intelligence'],
      'MOC': ['MOC', 'ontology', 'catalog'],
      'MAL': ['MAL', 'arbiter', 'layer'],
      'MEP': ['MEP', 'epistemic', 'principle']
    }
    
    const expectedKeywords = frameworkKeywords[declaredFramework]
    if (!expectedKeywords) {
      return // General or unknown framework
    }
    
    const actualKeywords = frontmatter.keywords || []
    const hasFrameworkKeyword = expectedKeywords.some(keyword =>
      actualKeywords.some(k => k.toLowerCase().includes(keyword.toLowerCase()))
    )
    
    if (!hasFrameworkKeyword) {
      this.addIssue('MISSING_FRAMEWORK_KEYWORDS', relativePath,
        `Framework ${declaredFramework} should include keywords: ${expectedKeywords.join(', ')}`,
        { framework: declaredFramework, expected: expectedKeywords, actual: actualKeywords })
    }
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

  addIssue(type, file, message, details = {}) {
    this.issues.push({
      type,
      file,
      message,
      details,
      severity: this.getSeverity(type)
    })
  }

  getSeverity(type) {
    const severityMap = {
      'INCORRECT_FRAMEWORK': 'HIGH',
      'INCORRECT_KEYWORDS': 'MEDIUM',
      'MISSING_FRAMEWORK_KEYWORDS': 'LOW',
      'UNMAPPED_FRAMEWORK_FILE': 'MEDIUM',
      'FILE_READ_ERROR': 'HIGH'
    }
    
    return severityMap[type] || 'LOW'
  }

  analyzeIssues() {
    // Group issues by type and severity
    const byType = {}
    const bySeverity = { HIGH: 0, MEDIUM: 0, LOW: 0 }
    
    for (const issue of this.issues) {
      byType[issue.type] = (byType[issue.type] || 0) + 1
      bySeverity[issue.severity]++
    }
    
    this.analysis = { byType, bySeverity }
  }

  generateReport() {
    console.log('\n' + chalk.bold('📊 Framework Metadata Audit Report'))
    console.log('═'.repeat(60))
    
    // Summary stats
    console.log(chalk.blue('\n📈 Summary Statistics'))
    console.log(`Total Files Scanned: ${this.stats.totalFiles}`)
    console.log(`Framework Files Found: ${this.stats.frameworkFilesFound}`)
    console.log(`Total Issues Found: ${this.issues.length}`)
    
    // Severity breakdown
    console.log(chalk.blue('\n🚨 Issues by Severity'))
    console.log(`${chalk.red('HIGH')}: ${this.analysis.bySeverity.HIGH}`)
    console.log(`${chalk.yellow('MEDIUM')}: ${this.analysis.bySeverity.MEDIUM}`)
    console.log(`${chalk.gray('LOW')}: ${this.analysis.bySeverity.LOW}`)
    
    // Issues by type
    console.log(chalk.blue('\n📋 Issues by Type'))
    for (const [type, count] of Object.entries(this.analysis.byType)) {
      console.log(`${type}: ${count}`)
    }
    
    // Detailed issues
    console.log(chalk.blue('\n🔍 Detailed Issues'))
    
    // Show HIGH severity issues first
    const highIssues = this.issues.filter(i => i.severity === 'HIGH')
    if (highIssues.length > 0) {
      console.log(chalk.red('\n🚨 HIGH SEVERITY ISSUES'))
      highIssues.forEach((issue, index) => {
        console.log(`${index + 1}. ${chalk.red(issue.type)}: ${issue.file}`)
        console.log(`   ${issue.message}`)
        if (issue.details.expected && issue.details.actual) {
          console.log(`   Expected: ${issue.details.expected}`)
          console.log(`   Actual: ${issue.details.actual}`)
        }
        console.log('')
      })
    }
    
    // Show MEDIUM severity issues
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
    
    // Framework file specific analysis
    console.log(chalk.blue('\n🧩 Framework Files Analysis'))
    const frameworkIssues = this.issues.filter(i => i.file.includes('/frameworks/'))
    console.log(`Framework files with issues: ${frameworkIssues.length}`)
    
    if (frameworkIssues.length > 0) {
      console.log(chalk.red('\nFramework files requiring correction:'))
      frameworkIssues.forEach(issue => {
        console.log(`• ${issue.file} - ${issue.type}`)
      })
    }
    
    console.log('\n' + '═'.repeat(60))
    console.log(chalk.green(`✅ Audit complete. ${this.issues.length} issues identified for correction.`))
  }
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const auditor = new FrameworkAuditor()
  auditor.audit().catch(console.error)
}

export default FrameworkAuditor