#!/usr/bin/env node

/**
 * Editorial Checklist Automation
 * Validates Matrix Protocol documentation against editorial standards
 */

const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

// Editorial checklist criteria
const EDITORIAL_CHECKLIST = {
  frontmatter: {
    required: ['title', 'description', 'lang', 'last_updated'],
    recommended: ['icon', 'layout', 'sidebar', 'toc', 'navigation', 'order']
  },
  content: {
    minLength: 100, // Minimum content length
    maxLineLength: 120, // Maximum line length
    requiresHeadings: true, // Must have at least one heading
    requiresResourcesSection: true // Must have "📖 Recursos Relacionados" or similar
  },
  naming: {
    filePattern: /^[a-z0-9-_]+\.md$/,
    noAccents: true,
    englishOnly: ['index.md'] // Special files that must be English-only
  }
}

const GLOSSARY_TERMS = [
  'mef', 'zof', 'oif', 'moc', 'mal', 'matrix-protocol',
  'uki', 'framework', 'implementation', 'templates',
  'business-rules', 'technical-patterns', 'procedures',
  'startup', 'scaleup', 'corporation', 'enterprise',
  'basic', 'unified', 'examples', 'manual', 'quickstart'
]

class EditorialChecker {
  constructor() {
    this.errors = []
    this.warnings = []
    this.passed = []
  }

  checkFile(filePath) {
    const result = {
      file: filePath,
      errors: [],
      warnings: [],
      passed: [],
      score: 0
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const parsed = matter(content)
      
      // Check frontmatter
      this.checkFrontmatter(parsed.data, result)
      
      // Check content quality
      this.checkContent(parsed.content, result)
      
      // Check naming conventions
      this.checkNaming(filePath, result)
      
      // Calculate score
      const total = result.errors.length + result.warnings.length + result.passed.length
      result.score = total > 0 ? (result.passed.length / total) * 100 : 0
      
    } catch (error) {
      result.errors.push(`Failed to parse file: ${error.message}`)
    }

    return result
  }

  checkFrontmatter(data, result) {
    // Required fields
    EDITORIAL_CHECKLIST.frontmatter.required.forEach(field => {
      if (data[field]) {
        result.passed.push(`✅ Required field '${field}' present`)
      } else {
        result.errors.push(`❌ Missing required field '${field}'`)
      }
    })

    // Recommended fields
    EDITORIAL_CHECKLIST.frontmatter.recommended.forEach(field => {
      if (data[field]) {
        result.passed.push(`✅ Recommended field '${field}' present`)
      } else {
        result.warnings.push(`⚠️ Missing recommended field '${field}'`)
      }
    })

    // Validate specific fields
    if (data.title && data.title.length < 3) {
      result.errors.push(`❌ Title too short: "${data.title}"`)
    }

    if (data.description && data.description.length < 10) {
      result.errors.push(`❌ Description too short: "${data.description}"`)
    }

    if (data.lang && !['pt', 'en'].includes(data.lang)) {
      result.errors.push(`❌ Invalid language: "${data.lang}" (must be 'pt' or 'en')`)
    }

    // Validate last_updated format
    if (data.last_updated) {
      const datePattern = /^\d{4}-\d{2}-\d{2}$/
      if (!datePattern.test(data.last_updated)) {
        result.errors.push(`❌ Invalid last_updated format: "${data.last_updated}" (use YYYY-MM-DD)`)
      } else {
        result.passed.push(`✅ Valid last_updated format`)
      }
    }
  }

  checkContent(content, result) {
    // Minimum content length
    if (content.length >= EDITORIAL_CHECKLIST.content.minLength) {
      result.passed.push(`✅ Content length adequate (${content.length} chars)`)
    } else {
      result.warnings.push(`⚠️ Content too short (${content.length} chars, min ${EDITORIAL_CHECKLIST.content.minLength})`)
    }

    // Check for headings
    const headings = content.match(/^#+\s+.+$/gm)
    if (headings && headings.length > 0) {
      result.passed.push(`✅ Contains ${headings.length} heading(s)`)
    } else {
      result.warnings.push(`⚠️ No headings found`)
    }

    // Check for resources section
    const resourcesPattern = /(📖|##)\s*(Recursos?\s*Relacionados?|Related\s*Resources?)/i
    if (resourcesPattern.test(content)) {
      result.passed.push(`✅ Contains resources section`)
    } else {
      result.warnings.push(`⚠️ Missing "📖 Recursos Relacionados" section`)
    }

    // Check line length
    const lines = content.split('\n')
    const longLines = lines.filter(line => line.length > EDITORIAL_CHECKLIST.content.maxLineLength)
    if (longLines.length === 0) {
      result.passed.push(`✅ All lines within length limit`)
    } else {
      result.warnings.push(`⚠️ ${longLines.length} lines exceed ${EDITORIAL_CHECKLIST.content.maxLineLength} characters`)
    }

    // Check for empty lines after headings
    let consecutiveEmpty = 0
    lines.forEach((line, index) => {
      if (line.trim() === '') {
        consecutiveEmpty++
      } else {
        if (consecutiveEmpty > 2) {
          result.warnings.push(`⚠️ Too many consecutive empty lines at line ${index - consecutiveEmpty + 1}`)
        }
        consecutiveEmpty = 0
      }
    })
  }

  checkNaming(filePath, result) {
    const fileName = path.basename(filePath)
    
    // File pattern check
    if (EDITORIAL_CHECKLIST.naming.filePattern.test(fileName)) {
      result.passed.push(`✅ Valid filename pattern`)
    } else {
      result.errors.push(`❌ Invalid filename pattern: "${fileName}"`)
    }

    // Check for accents
    if (EDITORIAL_CHECKLIST.naming.noAccents) {
      const hasAccents = /[àáâãäåæçèéêëìíîïñòóôõöøùúûüýÿ]/i.test(fileName)
      if (!hasAccents) {
        result.passed.push(`✅ No accents in filename`)
      } else {
        result.errors.push(`❌ Filename contains accents: "${fileName}"`)
      }
    }

    // English-only check for special files
    if (EDITORIAL_CHECKLIST.naming.englishOnly.includes(fileName)) {
      const nonEnglish = /[^a-z0-9-_.]/i.test(fileName.replace('.md', ''))
      if (!nonEnglish) {
        result.passed.push(`✅ English-only filename`)
      } else {
        result.warnings.push(`⚠️ Special file should use English-only naming`)
      }
    }
  }

  checkDirectory(dirPath) {
    const results = []
    const self = this
    
    function processDir(currentPath) {
      const items = fs.readdirSync(currentPath)
      
      items.forEach(item => {
        const itemPath = path.join(currentPath, item)
        const stat = fs.statSync(itemPath)
        
        if (stat.isDirectory()) {
          processDir(itemPath)
        } else if (item.endsWith('.md') && !item.endsWith('.bak')) {
          results.push(self.checkFile(itemPath))
        }
      })
    }

    processDir(dirPath)
    return results
  }

  generateReport(results) {
    const summary = {
      totalFiles: results.length,
      passed: results.filter(r => r.errors.length === 0).length,
      warnings: results.filter(r => r.warnings.length > 0 && r.errors.length === 0).length,
      errors: results.filter(r => r.errors.length > 0).length,
      averageScore: results.reduce((sum, r) => sum + r.score, 0) / results.length
    }

    const report = {
      timestamp: new Date().toISOString(),
      summary,
      results: results.sort((a, b) => b.score - a.score) // Sort by score descending
    }

    return report
  }
}

// CLI execution
if (require.main === module) {
  const checker = new EditorialChecker()
  const contentDir = path.join(process.cwd(), 'content')
  
  console.log('🔍 Running Editorial Checklist...')
  console.log(`📁 Scanning: ${contentDir}`)
  
  const results = checker.checkDirectory(contentDir)
  const report = checker.generateReport(results)
  
  // Save report
  const reportsDir = path.join(process.cwd(), 'docs/dynamic-navigation/02-execution/editorial-reports')
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true })
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const reportPath = path.join(reportsDir, `editorial-checklist-${timestamp}.json`)
  const latestPath = path.join(reportsDir, 'editorial-checklist-latest.json')
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  fs.writeFileSync(latestPath, JSON.stringify(report, null, 2))
  
  // Console output
  console.log('\n📊 Editorial Checklist Results:')
  console.log(`📄 Files scanned: ${report.summary.totalFiles}`)
  console.log(`✅ Passed: ${report.summary.passed}`)
  console.log(`⚠️ Warnings: ${report.summary.warnings}`)
  console.log(`❌ Errors: ${report.summary.errors}`)
  console.log(`📈 Average score: ${report.summary.averageScore.toFixed(1)}%`)
  
  // Show top issues
  const filesWithErrors = results.filter(r => r.errors.length > 0)
  if (filesWithErrors.length > 0) {
    console.log('\n❌ Files with errors:')
    filesWithErrors.slice(0, 5).forEach(result => {
      console.log(`   ${result.file}:`)
      result.errors.slice(0, 3).forEach(error => console.log(`     ${error}`))
    })
  }
  
  console.log(`\n📁 Report saved: ${reportPath}`)
  
  // Exit code based on results
  process.exit(report.summary.errors > 0 ? 1 : 0)
}

module.exports = EditorialChecker