#!/usr/bin/env node

/**
 * Content Validation Automation for Matrix Protocol Website
 * 
 * Automated validation of frontmatter, links, and content structure
 * 
 * @author Matrix Protocol Team
 * @created 2025-01-25
 * @task ÉPICO 3 - TASK 1.3
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs'
import { resolve, dirname, basename, extname, join } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import matter from 'gray-matter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = resolve(__dirname, '..')

// Validation configuration
const VALIDATION_CONFIG = {
  content: {
    directories: ['content/pt', 'content/en'],
    extensions: ['.md', '.yaml', '.yml'],
    requiredDirectories: ['docs', 'docs/frameworks', 'docs/examples']
  },
  
  frontmatter: {
    required: ['title', 'description'],
    optional: ['tags', 'keywords', 'framework', 'category', 'slug', 'navigation'],
    frameworks: ['mef', 'zof', 'oif', 'moc', 'mal'],
    categories: ['guide', 'reference', 'example', 'template', 'concept']
  },
  
  links: {
    internal: {
      baseUrls: ['/pt/', '/en/', '/docs/', '/frameworks/'],
      allowedExtensions: ['.md', '.html', '']
    },
    external: {
      timeout: 5000,
      userAgent: 'Matrix Protocol Content Validator/1.0'
    }
  },
  
  structure: {
    maxDepth: 5,
    indexFiles: ['index.md'],
    requiredFiles: {
      'content/pt/docs': ['index.md'],
      'content/en/docs': ['index.md'],
      'content/pt/docs/frameworks': ['index.md'],
      'content/en/docs/frameworks': ['index.md']
    }
  }
}

class ContentValidator {
  constructor() {
    this.config = VALIDATION_CONFIG
    this.results = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFiles: 0,
        validFiles: 0,
        warnings: 0,
        errors: 0
      },
      validations: {
        frontmatter: [],
        links: [],
        structure: []
      },
      issues: []
    }
  }

  /**
   * Run complete content validation
   */
  async validateAll() {
    console.log('🔍 Starting Content Validation...')
    console.log(`Content directories: ${this.config.content.directories.join(', ')}`)
    
    try {
      // 1. Validate directory structure
      console.log('\n📁 Validating directory structure...')
      await this.validateDirectoryStructure()
      
      // 2. Validate frontmatter
      console.log('\n📝 Validating frontmatter...')
      await this.validateFrontmatter()
      
      // 3. Validate internal links
      console.log('\n🔗 Validating internal links...')
      await this.validateLinks()
      
      // 4. Validate multilingual parity
      console.log('\n🌐 Validating multilingual parity...')
      await this.validateMultilingualParity()
      
      // 5. Generate reports
      console.log('\n📊 Generating validation reports...')
      await this.generateReports()
      
      // 6. Display summary
      this.displaySummary()
      
      return this.results
      
    } catch (error) {
      console.error('❌ Content validation failed:', error)
      throw error
    }
  }

  /**
   * Validate directory structure and required files
   */
  async validateDirectoryStructure() {
    const structureIssues = []
    
    for (const contentDir of this.config.content.directories) {
      const fullPath = resolve(projectRoot, contentDir)
      
      if (!existsSync(fullPath)) {
        structureIssues.push({
          type: 'missing_directory',
          severity: 'error',
          path: contentDir,
          message: `Content directory does not exist: ${contentDir}`
        })
        continue
      }
      
      // Check required subdirectories
      for (const requiredDir of this.config.content.requiredDirectories) {
        const requiredPath = resolve(fullPath, requiredDir)
        if (!existsSync(requiredPath)) {
          structureIssues.push({
            type: 'missing_required_directory',
            severity: 'error',
            path: `${contentDir}/${requiredDir}`,
            message: `Required directory missing: ${requiredDir}`
          })
        }
      }
      
      // Check required files
      for (const [dirPath, requiredFiles] of Object.entries(this.config.structure.requiredFiles)) {
        const checkPath = resolve(projectRoot, dirPath)
        if (existsSync(checkPath)) {
          for (const requiredFile of requiredFiles) {
            const filePath = resolve(checkPath, requiredFile)
            if (!existsSync(filePath)) {
              structureIssues.push({
                type: 'missing_required_file',
                severity: 'warning',
                path: `${dirPath}/${requiredFile}`,
                message: `Required file missing: ${requiredFile}`
              })
            }
          }
        }
      }
      
      // Validate directory depth
      this.validateDirectoryDepth(fullPath, contentDir, 0, structureIssues)
    }
    
    this.results.validations.structure = structureIssues
    structureIssues.forEach(issue => {
      if (issue.severity === 'error') {
        this.results.summary.errors++
      } else {
        this.results.summary.warnings++
      }
    })
    
    console.log(`  Found ${structureIssues.length} structure issues`)
  }

  /**
   * Validate directory depth recursively
   */
  validateDirectoryDepth(dirPath, relativePath, depth, issues) {
    if (depth > this.config.structure.maxDepth) {
      issues.push({
        type: 'excessive_depth',
        severity: 'warning',
        path: relativePath,
        message: `Directory depth exceeds maximum (${this.config.structure.maxDepth})`
      })
      return
    }
    
    try {
      const items = readdirSync(dirPath)
      for (const item of items) {
        const itemPath = resolve(dirPath, item)
        const itemRelativePath = `${relativePath}/${item}`
        
        if (statSync(itemPath).isDirectory()) {
          this.validateDirectoryDepth(itemPath, itemRelativePath, depth + 1, issues)
        }
      }
    } catch (error) {
      issues.push({
        type: 'directory_read_error',
        severity: 'error',
        path: relativePath,
        message: `Cannot read directory: ${error.message}`
      })
    }
  }

  /**
   * Validate frontmatter in all markdown files
   */
  async validateFrontmatter() {
    const frontmatterIssues = []
    const markdownFiles = this.findMarkdownFiles()
    
    for (const filePath of markdownFiles) {
      const relativePath = this.getRelativePath(filePath)
      this.results.summary.totalFiles++
      
      try {
        const fileContent = readFileSync(filePath, 'utf8')
        const parsed = matter(fileContent)
        const frontmatter = parsed.data
        
        // Validate required fields
        for (const required of this.config.frontmatter.required) {
          if (!frontmatter[required]) {
            frontmatterIssues.push({
              type: 'missing_required_field',
              severity: 'error',
              file: relativePath,
              field: required,
              message: `Required frontmatter field missing: ${required}`
            })
          }
        }
        
        // Validate framework field if present
        if (frontmatter.framework) {
          if (!this.config.frontmatter.frameworks.includes(frontmatter.framework)) {
            frontmatterIssues.push({
              type: 'invalid_framework',
              severity: 'warning',
              file: relativePath,
              field: 'framework',
              value: frontmatter.framework,
              message: `Invalid framework: ${frontmatter.framework}. Valid options: ${this.config.frontmatter.frameworks.join(', ')}`
            })
          }
        }
        
        // Validate category field if present
        if (frontmatter.category) {
          if (!this.config.frontmatter.categories.includes(frontmatter.category)) {
            frontmatterIssues.push({
              type: 'invalid_category',
              severity: 'warning',
              file: relativePath,
              field: 'category',
              value: frontmatter.category,
              message: `Invalid category: ${frontmatter.category}. Valid options: ${this.config.frontmatter.categories.join(', ')}`
            })
          }
        }
        
        // Validate title length
        if (frontmatter.title && frontmatter.title.length > 100) {
          frontmatterIssues.push({
            type: 'title_too_long',
            severity: 'warning',
            file: relativePath,
            field: 'title',
            message: `Title too long (${frontmatter.title.length} chars). Recommended: <100 chars`
          })
        }
        
        // Validate description length
        if (frontmatter.description && frontmatter.description.length > 200) {
          frontmatterIssues.push({
            type: 'description_too_long',
            severity: 'warning',
            file: relativePath,
            field: 'description',
            message: `Description too long (${frontmatter.description.length} chars). Recommended: <200 chars`
          })
        }
        
        if (frontmatterIssues.filter(issue => issue.file === relativePath && issue.severity === 'error').length === 0) {
          this.results.summary.validFiles++
        }
        
      } catch (error) {
        frontmatterIssues.push({
          type: 'parse_error',
          severity: 'error',
          file: relativePath,
          message: `Cannot parse file: ${error.message}`
        })
      }
    }
    
    this.results.validations.frontmatter = frontmatterIssues
    frontmatterIssues.forEach(issue => {
      if (issue.severity === 'error') {
        this.results.summary.errors++
      } else {
        this.results.summary.warnings++
      }
    })
    
    console.log(`  Validated ${markdownFiles.length} markdown files`)
    console.log(`  Found ${frontmatterIssues.length} frontmatter issues`)
  }

  /**
   * Validate internal links
   */
  async validateLinks() {
    const linkIssues = []
    const markdownFiles = this.findMarkdownFiles()
    
    for (const filePath of markdownFiles) {
      const relativePath = this.getRelativePath(filePath)
      
      try {
        const fileContent = readFileSync(filePath, 'utf8')
        const parsed = matter(fileContent)
        const content = parsed.content
        
        // Extract markdown links [text](url)
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
        let match
        
        while ((match = linkRegex.exec(content)) !== null) {
          const linkText = match[1]
          const linkUrl = match[2]
          
          // Skip external links (starting with http)
          if (linkUrl.startsWith('http')) {
            continue
          }
          
          // Skip anchors and fragments
          if (linkUrl.startsWith('#')) {
            continue
          }
          
          // Validate internal link
          const linkIssue = this.validateInternalLink(relativePath, linkUrl, linkText)
          if (linkIssue) {
            linkIssues.push(linkIssue)
          }
        }
        
      } catch (error) {
        linkIssues.push({
          type: 'link_extraction_error',
          severity: 'error',
          file: relativePath,
          message: `Cannot extract links: ${error.message}`
        })
      }
    }
    
    this.results.validations.links = linkIssues
    linkIssues.forEach(issue => {
      if (issue.severity === 'error') {
        this.results.summary.errors++
      } else {
        this.results.summary.warnings++
      }
    })
    
    console.log(`  Found ${linkIssues.length} link issues`)
  }

  /**
   * Validate a single internal link
   */
  validateInternalLink(sourceFile, linkUrl, linkText) {
    // Resolve relative link to absolute path
    const sourceDir = dirname(resolve(projectRoot, sourceFile))
    const targetPath = resolve(sourceDir, linkUrl)
    const relativePath = this.getRelativePath(targetPath)
    
    // Check if target exists
    if (!existsSync(targetPath)) {
      // Try with .md extension
      const targetWithMd = targetPath + '.md'
      if (existsSync(targetWithMd)) {
        return null // Valid link
      }
      
      return {
        type: 'broken_internal_link',
        severity: 'error',
        file: sourceFile,
        link: linkUrl,
        linkText: linkText,
        message: `Broken internal link: ${linkUrl}`
      }
    }
    
    return null // Valid link
  }

  /**
   * Validate multilingual parity between PT and EN content
   */
  async validateMultilingualParity() {
    const parityIssues = []
    
    // Get PT files
    const ptDir = resolve(projectRoot, 'content/pt')
    const enDir = resolve(projectRoot, 'content/en')
    
    if (!existsSync(ptDir) || !existsSync(enDir)) {
      parityIssues.push({
        type: 'missing_language_directory',
        severity: 'error',
        message: 'Missing PT or EN content directory'
      })
      return
    }
    
    const ptFiles = this.findMarkdownFiles(ptDir)
    const enFiles = this.findMarkdownFiles(enDir)
    
    // Create relative path maps
    const ptRelative = ptFiles.map(f => f.replace(ptDir, ''))
    const enRelative = enFiles.map(f => f.replace(enDir, ''))
    
    // Check for missing EN files
    for (const ptFile of ptRelative) {
      if (!enRelative.includes(ptFile)) {
        parityIssues.push({
          type: 'missing_translation',
          severity: 'warning',
          language: 'en',
          file: `content/en${ptFile}`,
          message: `Missing English translation for: content/pt${ptFile}`
        })
      }
    }
    
    // Check for missing PT files
    for (const enFile of enRelative) {
      if (!ptRelative.includes(enFile)) {
        parityIssues.push({
          type: 'missing_translation',
          severity: 'warning',
          language: 'pt',
          file: `content/pt${enFile}`,
          message: `Missing Portuguese translation for: content/en${enFile}`
        })
      }
    }
    
    this.results.validations.multilingual = parityIssues
    parityIssues.forEach(issue => {
      if (issue.severity === 'error') {
        this.results.summary.errors++
      } else {
        this.results.summary.warnings++
      }
    })
    
    console.log(`  PT files: ${ptFiles.length}, EN files: ${enFiles.length}`)
    console.log(`  Found ${parityIssues.length} multilingual parity issues`)
  }

  /**
   * Find all markdown files in content directories
   */
  findMarkdownFiles(baseDir = null) {
    const files = []
    const searchDirs = baseDir ? [baseDir] : this.config.content.directories.map(dir => resolve(projectRoot, dir))
    
    for (const dir of searchDirs) {
      if (existsSync(dir)) {
        files.push(...this.findFilesRecursive(dir, ['.md']))
      }
    }
    
    return files
  }

  /**
   * Find files recursively with specified extensions
   */
  findFilesRecursive(dirPath, extensions) {
    const files = []
    
    try {
      const items = readdirSync(dirPath)
      
      for (const item of items) {
        const itemPath = resolve(dirPath, item)
        const stat = statSync(itemPath)
        
        if (stat.isDirectory()) {
          files.push(...this.findFilesRecursive(itemPath, extensions))
        } else if (extensions.includes(extname(item))) {
          files.push(itemPath)
        }
      }
    } catch (error) {
      console.warn(`Cannot read directory ${dirPath}:`, error.message)
    }
    
    return files
  }

  /**
   * Get relative path from project root
   */
  getRelativePath(absolutePath) {
    return absolutePath.replace(projectRoot + '/', '')
  }

  /**
   * Generate validation reports
   */
  async generateReports() {
    try {
      // Ensure reports directory exists
      const reportsDir = resolve(projectRoot, 'tests/reports')
      execSync(`mkdir -p ${reportsDir}`)
      
      // Generate JSON report
      const jsonReport = resolve(reportsDir, 'content-validation-report.json')
      writeFileSync(jsonReport, JSON.stringify(this.results, null, 2))
      console.log(`📄 JSON Report: ${jsonReport}`)
      
      // Generate HTML report
      const htmlReport = this.generateHTMLReport()
      const htmlPath = resolve(reportsDir, 'content-validation-report.html')
      writeFileSync(htmlPath, htmlReport)
      console.log(`📄 HTML Report: ${htmlPath}`)
      
      // Generate summary for CI
      const summary = this.generateSummary()
      const summaryPath = resolve(reportsDir, 'content-validation-summary.txt')
      writeFileSync(summaryPath, summary)
      console.log(`📄 Summary: ${summaryPath}`)
      
    } catch (error) {
      console.error('Error generating reports:', error.message)
    }
  }

  /**
   * Generate HTML report
   */
  generateHTMLReport() {
    const timestamp = new Date(this.results.timestamp).toLocaleString()
    
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Content Validation Report - ${timestamp}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .summary-card { background: #fff; border: 2px solid #ddd; padding: 15px; border-radius: 5px; text-align: center; }
        .summary-card.valid { border-color: #28a745; }
        .summary-card.warnings { border-color: #ffc107; }
        .summary-card.errors { border-color: #dc3545; }
        .issue { margin: 10px 0; padding: 10px; border-radius: 3px; }
        .issue.error { background: #f8d7da; border: 1px solid #f5c6cb; }
        .issue.warning { background: #fff3cd; border: 1px solid #ffeaa7; }
        .section { margin: 30px 0; }
        .collapsible { cursor: pointer; padding: 10px; background: #e9ecef; border: none; width: 100%; text-align: left; }
        .content { display: none; padding: 10px; border: 1px solid #ddd; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f8f9fa; }
        .error-text { color: #dc3545; }
        .warning-text { color: #856404; }
        .success-text { color: #155724; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Content Validation Report</h1>
        <p><strong>Generated:</strong> ${timestamp}</p>
        <p><strong>Total Files Processed:</strong> ${this.results.summary.totalFiles}</p>
    </div>

    <div class="summary">
        <div class="summary-card valid">
            <h3 class="success-text">${this.results.summary.validFiles}</h3>
            <p>Valid Files</p>
        </div>
        <div class="summary-card warnings">
            <h3 class="warning-text">${this.results.summary.warnings}</h3>
            <p>Warnings</p>
        </div>
        <div class="summary-card errors">
            <h3 class="error-text">${this.results.summary.errors}</h3>
            <p>Errors</p>
        </div>
    </div>

    <div class="section">
        <button class="collapsible">📁 Structure Validation (${this.results.validations.structure.length} issues)</button>
        <div class="content">
            ${this.results.validations.structure.map(issue => `
                <div class="issue ${issue.severity}">
                    <strong>${issue.type}:</strong> ${issue.message}<br>
                    <small>Path: ${issue.path}</small>
                </div>
            `).join('')}
        </div>
    </div>

    <div class="section">
        <button class="collapsible">📝 Frontmatter Validation (${this.results.validations.frontmatter.length} issues)</button>
        <div class="content">
            ${this.results.validations.frontmatter.map(issue => `
                <div class="issue ${issue.severity}">
                    <strong>${issue.type}:</strong> ${issue.message}<br>
                    <small>File: ${issue.file}</small>
                    ${issue.field ? `<br><small>Field: ${issue.field}</small>` : ''}
                </div>
            `).join('')}
        </div>
    </div>

    <div class="section">
        <button class="collapsible">🔗 Link Validation (${this.results.validations.links.length} issues)</button>
        <div class="content">
            ${this.results.validations.links.map(issue => `
                <div class="issue ${issue.severity}">
                    <strong>${issue.type}:</strong> ${issue.message}<br>
                    <small>File: ${issue.file}</small>
                    ${issue.link ? `<br><small>Link: ${issue.link}</small>` : ''}
                </div>
            `).join('')}
        </div>
    </div>

    <div class="section">
        <button class="collapsible">🌐 Multilingual Parity (${(this.results.validations.multilingual || []).length} issues)</button>
        <div class="content">
            ${(this.results.validations.multilingual || []).map(issue => `
                <div class="issue ${issue.severity}">
                    <strong>${issue.type}:</strong> ${issue.message}<br>
                    <small>File: ${issue.file}</small>
                </div>
            `).join('')}
        </div>
    </div>

    <script>
        document.querySelectorAll('.collapsible').forEach(button => {
            button.addEventListener('click', () => {
                const content = button.nextElementSibling;
                content.style.display = content.style.display === 'block' ? 'none' : 'block';
            });
        });
    </script>
</body>
</html>
    `
  }

  /**
   * Generate summary for CI/CD
   */
  generateSummary() {
    const timestamp = new Date(this.results.timestamp).toLocaleString()
    const overallPassed = this.results.summary.errors === 0
    
    return `
CONTENT VALIDATION SUMMARY
==========================
Generated: ${timestamp}

OVERALL STATUS: ${overallPassed ? 'PASS' : 'FAIL'}

Summary:
- Total Files: ${this.results.summary.totalFiles}
- Valid Files: ${this.results.summary.validFiles}
- Warnings: ${this.results.summary.warnings}
- Errors: ${this.results.summary.errors}

Validation Results:
- Structure Issues: ${this.results.validations.structure.length}
- Frontmatter Issues: ${this.results.validations.frontmatter.length}
- Link Issues: ${this.results.validations.links.length}
- Multilingual Issues: ${(this.results.validations.multilingual || []).length}

${overallPassed ? '✅ All content validation checks passed!' : '❌ Content validation found errors. Check detailed report.'}
    `.trim()
  }

  /**
   * Display final summary
   */
  displaySummary() {
    const overallPassed = this.results.summary.errors === 0
    
    console.log('\n' + '='.repeat(50))
    console.log('📊 CONTENT VALIDATION SUMMARY')
    console.log('='.repeat(50))
    console.log(`Overall Status: ${overallPassed ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`Total Files: ${this.results.summary.totalFiles}`)
    console.log(`Valid Files: ${this.results.summary.validFiles}`)
    console.log(`Warnings: ${this.results.summary.warnings}`)
    console.log(`Errors: ${this.results.summary.errors}`)
    
    console.log('\n📋 Validation Breakdown:')
    console.log(`- Structure: ${this.results.validations.structure.length} issues`)
    console.log(`- Frontmatter: ${this.results.validations.frontmatter.length} issues`)
    console.log(`- Links: ${this.results.validations.links.length} issues`)
    console.log(`- Multilingual: ${(this.results.validations.multilingual || []).length} issues`)
    
    console.log('\n💡 Tips:')
    console.log('- Check reports in tests/reports/ directory')
    console.log('- Fix errors before warnings')
    console.log('- Use frontmatter schema for consistency')
    
    if (!overallPassed) {
      console.log('\n❌ Content validation found errors. Check detailed reports.')
      process.exit(1)
    } else {
      console.log('\n✅ All content validation checks passed!')
    }
  }
}

// CLI Usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new ContentValidator()
  validator.validateAll().catch(error => {
    console.error('❌ Content validation failed:', error)
    process.exit(1)
  })
}

export default ContentValidator