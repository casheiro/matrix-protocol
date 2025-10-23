#!/usr/bin/env node

/**
 * Tag Validation Automation
 * Validates tags against Matrix Protocol glossary and taxonomy
 */

const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

// Official Matrix Protocol tag taxonomy
const TAG_TAXONOMY = {
  frameworks: ['mef', 'zof', 'oif', 'moc', 'mal', 'matrix-protocol'],
  domains: ['business', 'technical', 'product', 'strategy', 'culture'],
  types: ['business-rule', 'pattern', 'procedure', 'guideline', 'decision', 'template'],
  maturity: ['draft', 'validated', 'approved', 'deprecated', 'archived'],
  scope: ['startup', 'scaleup', 'corporation', 'enterprise', 'unified', 'basic'],
  sections: ['manual', 'examples', 'quickstart', 'implementation', 'frameworks'],
  categories: [
    'business-rules', 'technical-patterns', 'procedures', 
    'templates', 'tools', 'reference', 'assessment', 'planning'
  ]
}

// Allowed tags (all taxonomy values)
const ALLOWED_TAGS = [
  ...TAG_TAXONOMY.frameworks,
  ...TAG_TAXONOMY.domains,
  ...TAG_TAXONOMY.types,
  ...TAG_TAXONOMY.maturity,
  ...TAG_TAXONOMY.scope,
  ...TAG_TAXONOMY.sections,
  ...TAG_TAXONOMY.categories
]

// Required tag combinations by file type
const TAG_REQUIREMENTS = {
  'index.md': {
    required: ['section'],
    recommended: ['category', 'maturity'],
    forbidden: []
  },
  'framework': {
    required: ['framework', 'maturity'],
    recommended: ['domain'],
    forbidden: ['deprecated']
  },
  'example': {
    required: ['examples', 'maturity'],
    recommended: ['domain', 'type'],
    forbidden: []
  },
  'manual': {
    required: ['manual', 'maturity'],
    recommended: ['category'],
    forbidden: ['draft']
  }
}

class TagValidator {
  constructor() {
    this.issues = []
    this.warnings = []
    this.validations = []
  }

  validateFile(filePath) {
    const result = {
      file: filePath,
      issues: [],
      warnings: [],
      validations: [],
      score: 0
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const parsed = matter(content)
      const tags = parsed.data.tags || []

      // Validate tag format
      this.validateTagFormat(tags, result)
      
      // Validate against taxonomy
      this.validateTaxonomy(tags, result)
      
      // Validate tag combinations
      this.validateCombinations(tags, filePath, result)
      
      // Validate consistency with content
      this.validateConsistency(tags, parsed, result)
      
      // Calculate score
      const total = result.issues.length + result.warnings.length + result.validations.length
      result.score = total > 0 ? (result.validations.length / total) * 100 : 100
      
    } catch (error) {
      result.issues.push(`Failed to parse file: ${error.message}`)
    }

    return result
  }

  validateTagFormat(tags, result) {
    if (!Array.isArray(tags)) {
      result.issues.push('❌ Tags must be an array')
      return
    }

    tags.forEach((tag, index) => {
      if (typeof tag !== 'string') {
        result.issues.push(`❌ Tag ${index} is not a string: ${typeof tag}`)
        return
      }

      // Check format (lowercase, kebab-case)
      if (!/^[a-z0-9-]+$/.test(tag)) {
        result.issues.push(`❌ Invalid tag format: "${tag}" (use lowercase kebab-case)`)
      } else {
        result.validations.push(`✅ Valid tag format: "${tag}"`)
      }

      // Check length
      if (tag.length < 2) {
        result.issues.push(`❌ Tag too short: "${tag}"`)
      } else if (tag.length > 30) {
        result.warnings.push(`⚠️ Tag very long: "${tag}"`)
      }
    })

    // Check for duplicates
    const uniqueTags = [...new Set(tags)]
    if (uniqueTags.length !== tags.length) {
      result.issues.push('❌ Duplicate tags found')
    } else if (tags.length > 0) {
      result.validations.push('✅ No duplicate tags')
    }
  }

  validateTaxonomy(tags, result) {
    tags.forEach(tag => {
      if (ALLOWED_TAGS.includes(tag)) {
        result.validations.push(`✅ Valid taxonomy tag: "${tag}"`)
      } else {
        // Check if it's a compound tag (e.g., "matrix-protocol-mef")
        const isCompound = tag.split('-').some(part => ALLOWED_TAGS.includes(part))
        if (isCompound) {
          result.warnings.push(`⚠️ Compound tag: "${tag}" (consider splitting)`)
        } else {
          result.issues.push(`❌ Unknown tag: "${tag}" (not in taxonomy)`)
        }
      }
    })

    // Check taxonomy coverage
    const frameworks = tags.filter(tag => TAG_TAXONOMY.frameworks.includes(tag))
    const domains = tags.filter(tag => TAG_TAXONOMY.domains.includes(tag))
    const sections = tags.filter(tag => TAG_TAXONOMY.sections.includes(tag))

    if (frameworks.length === 0) {
      result.warnings.push('⚠️ No framework tags specified')
    }

    if (domains.length === 0) {
      result.warnings.push('⚠️ No domain tags specified')
    }

    if (sections.length === 0) {
      result.warnings.push('⚠️ No section tags specified')
    }
  }

  validateCombinations(tags, filePath, result) {
    const fileName = path.basename(filePath)
    let requirements = null

    // Determine file type and requirements
    if (fileName === 'index.md') {
      requirements = TAG_REQUIREMENTS['index.md']
    } else if (tags.some(tag => TAG_TAXONOMY.frameworks.includes(tag))) {
      requirements = TAG_REQUIREMENTS['framework']
    } else if (tags.includes('examples')) {
      requirements = TAG_REQUIREMENTS['example']
    } else if (tags.includes('manual')) {
      requirements = TAG_REQUIREMENTS['manual']
    }

    if (!requirements) {
      result.warnings.push('⚠️ Could not determine file type for tag requirements')
      return
    }

    // Check required tags
    requirements.required.forEach(requiredCategory => {
      const categoryTags = TAG_TAXONOMY[requiredCategory] || [requiredCategory]
      const hasRequired = tags.some(tag => categoryTags.includes(tag))
      
      if (hasRequired) {
        result.validations.push(`✅ Required category "${requiredCategory}" present`)
      } else {
        result.issues.push(`❌ Missing required category: "${requiredCategory}"`)
      }
    })

    // Check recommended tags
    requirements.recommended.forEach(recommendedCategory => {
      const categoryTags = TAG_TAXONOMY[recommendedCategory] || [recommendedCategory]
      const hasRecommended = tags.some(tag => categoryTags.includes(tag))
      
      if (hasRecommended) {
        result.validations.push(`✅ Recommended category "${recommendedCategory}" present`)
      } else {
        result.warnings.push(`⚠️ Missing recommended category: "${recommendedCategory}"`)
      }
    })

    // Check forbidden tags
    requirements.forbidden.forEach(forbiddenCategory => {
      const categoryTags = TAG_TAXONOMY[forbiddenCategory] || [forbiddenCategory]
      const hasForbidden = tags.some(tag => categoryTags.includes(tag))
      
      if (!hasForbidden) {
        result.validations.push(`✅ No forbidden tags from "${forbiddenCategory}"`)
      } else {
        result.issues.push(`❌ Contains forbidden tag from category: "${forbiddenCategory}"`)
      }
    })
  }

  validateConsistency(tags, parsed, result) {
    const { data: frontmatter, content } = parsed

    // Check consistency with framework field
    if (frontmatter.framework) {
      const frameworkTag = frontmatter.framework.toLowerCase()
      if (tags.includes(frameworkTag)) {
        result.validations.push(`✅ Framework tag matches frontmatter: "${frameworkTag}"`)
      } else {
        result.warnings.push(`⚠️ Framework "${frameworkTag}" not in tags`)
      }
    }

    // Check consistency with maturity field
    if (frontmatter.maturity) {
      const maturityTag = frontmatter.maturity.toLowerCase()
      if (tags.includes(maturityTag)) {
        result.validations.push(`✅ Maturity tag matches frontmatter: "${maturityTag}"`)
      } else {
        result.warnings.push(`⚠️ Maturity "${maturityTag}" not in tags`)
      }
    }

    // Check consistency with content (simple keyword matching)
    const contentLower = content.toLowerCase()
    tags.forEach(tag => {
      if (contentLower.includes(tag) || contentLower.includes(tag.replace('-', ' '))) {
        result.validations.push(`✅ Tag "${tag}" mentioned in content`)
      } else {
        result.warnings.push(`⚠️ Tag "${tag}" not found in content`)
      }
    })
  }

  validateDirectory(dirPath) {
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
          results.push(self.validateFile(itemPath))
        }
      })
    }

    processDir(dirPath)
    return results
  }

  generateReport(results) {
    const summary = {
      totalFiles: results.length,
      passed: results.filter(r => r.issues.length === 0).length,
      warnings: results.filter(r => r.warnings.length > 0 && r.issues.length === 0).length,
      errors: results.filter(r => r.issues.length > 0).length,
      averageScore: results.reduce((sum, r) => sum + r.score, 0) / results.length,
      tagUsage: this.analyzeTagUsage(results)
    }

    const report = {
      timestamp: new Date().toISOString(),
      taxonomy: TAG_TAXONOMY,
      summary,
      results: results.sort((a, b) => b.score - a.score)
    }

    return report
  }

  analyzeTagUsage(results) {
    const tagCounts = {}
    const taxonomyCoverage = {}

    results.forEach(result => {
      try {
        const content = fs.readFileSync(result.file, 'utf-8')
        const parsed = matter(content)
        const tags = parsed.data.tags || []

        tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1
        })
      } catch (error) {
        // Skip files that can't be parsed
      }
    })

    // Calculate taxonomy coverage
    Object.keys(TAG_TAXONOMY).forEach(category => {
      const categoryTags = TAG_TAXONOMY[category]
      const usedTags = categoryTags.filter(tag => tagCounts[tag] > 0)
      taxonomyCoverage[category] = {
        total: categoryTags.length,
        used: usedTags.length,
        coverage: (usedTags.length / categoryTags.length) * 100
      }
    })

    return {
      mostUsed: Object.entries(tagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count })),
      taxonomyCoverage
    }
  }
}

// CLI execution
if (require.main === module) {
  const validator = new TagValidator()
  const contentDir = path.join(process.cwd(), 'content')
  
  console.log('🏷️  Running Tag Validation...')
  console.log(`📁 Scanning: ${contentDir}`)
  
  const results = validator.validateDirectory(contentDir)
  const report = validator.generateReport(results)
  
  // Save report
  const reportsDir = path.join(process.cwd(), 'docs/dynamic-navigation/02-execution/tag-reports')
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true })
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const reportPath = path.join(reportsDir, `tag-validation-${timestamp}.json`)
  const latestPath = path.join(reportsDir, 'tag-validation-latest.json')
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  fs.writeFileSync(latestPath, JSON.stringify(report, null, 2))
  
  // Console output
  console.log('\n📊 Tag Validation Results:')
  console.log(`📄 Files scanned: ${report.summary.totalFiles}`)
  console.log(`✅ Passed: ${report.summary.passed}`)
  console.log(`⚠️ Warnings: ${report.summary.warnings}`)
  console.log(`❌ Errors: ${report.summary.errors}`)
  console.log(`📈 Average score: ${report.summary.averageScore.toFixed(1)}%`)
  
  // Show taxonomy coverage
  console.log('\n📋 Taxonomy Coverage:')
  Object.entries(report.summary.tagUsage.taxonomyCoverage).forEach(([category, stats]) => {
    console.log(`   ${category}: ${stats.used}/${stats.total} (${stats.coverage.toFixed(1)}%)`)
  })
  
  // Show most used tags
  console.log('\n🏆 Most Used Tags:')
  report.summary.tagUsage.mostUsed.slice(0, 5).forEach(({ tag, count }) => {
    console.log(`   ${tag}: ${count} files`)
  })
  
  console.log(`\n📁 Report saved: ${reportPath}`)
  
  // Exit code based on results
  process.exit(report.summary.errors > 0 ? 1 : 0)
}

module.exports = TagValidator