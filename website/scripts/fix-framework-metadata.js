#!/usr/bin/env node

/**
 * Framework Metadata Fix Tool
 * 
 * Corrects incorrect framework classifications identified by the audit tool.
 * Applies correct framework and keywords based on file paths and content analysis.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import yaml from 'js-yaml'
import chalk from 'chalk'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')
const CONTENT_DIR = path.join(PROJECT_ROOT, 'content')

class FrameworkMetadataFixer {
  constructor(options = {}) {
    this.options = {
      dryRun: false,
      verbose: false,
      ...options
    }
    
    this.stats = {
      filesProcessed: 0,
      filesFixed: 0,
      frameworksFixed: 0,
      keywordsFixed: 0
    }
    
    this.fixes = []
    
    // Correct framework mappings - definitive source of truth
    // Keywords are EXCLUSIVE to each framework to prevent cross-contamination
    this.frameworkMappings = {
      // Core framework files
      '/frameworks/mef.md': { 
        framework: 'MEF', 
        keywords: ['MEF', 'knowledge', 'embedding', 'Matrix Protocol'],
        title_should_contain: ['MEF', 'Matrix Embedding Framework']
      },
      '/frameworks/zof.md': { 
        framework: 'ZOF', 
        keywords: ['ZOF', 'workflow', 'orchestration', 'Matrix Protocol'],
        title_should_contain: ['ZOF', 'Zion Orchestration Framework']
      },
      '/frameworks/oif.md': { 
        framework: 'OIF', 
        keywords: ['OIF', 'operator', 'intelligence', 'Matrix Protocol'],
        title_should_contain: ['OIF', 'Operator Intelligence Framework']
      },
      '/frameworks/moc.md': { 
        framework: 'MOC', 
        keywords: ['MOC', 'ontology', 'catalog', 'Matrix Protocol'], // PURE MOC keywords only
        title_should_contain: ['MOC', 'Matrix Ontology Catalog']
      },
      '/frameworks/mal.md': { 
        framework: 'MAL', 
        keywords: ['MAL', 'arbiter', 'layer', 'Matrix Protocol'], // PURE MAL keywords only
        title_should_contain: ['MAL', 'Matrix Arbiter Layer']
      },
      '/frameworks/mep.md': { 
        framework: 'MEP', 
        keywords: ['MEP', 'epistemic', 'principle', 'Matrix Protocol'],
        title_should_contain: ['MEP', 'Matrix Epistemic Principle']
      },
      '/frameworks/mef-ontology.md': { 
        framework: 'MEF', 
        keywords: ['MEF', 'ontology', 'knowledge', 'Matrix Protocol'],
        title_should_contain: ['MEF', 'ontology']
      },
      '/frameworks/inference-reasoning.md': { 
        framework: 'general', 
        keywords: ['inference', 'reasoning', 'AI', 'Matrix Protocol'],
        title_should_contain: ['inference', 'reasoning']
      },
      // Index files for frameworks section - CORRECTED
      '/frameworks/index.md': {
        framework: 'general',
        keywords: ['frameworks', 'Matrix Protocol'], // ONLY frameworks overview keywords
        title_should_contain: ['frameworks']
      }
    }
    
    // Pattern-based rules for file types
    this.patternRules = {
      // All /docs/ files (except /docs/frameworks/) should be general framework
      '^(en|pt)/docs/(?!frameworks/)': {
        framework: 'general',
        removeFrameworkKeywords: true // Remove specific framework keywords
      },
      // All /examples/ files should be general framework  
      '^(en|pt)/docs/examples/': {
        framework: 'general',
        removeFrameworkKeywords: true
      },
      // All /manual/ files should be general framework
      '^(en|pt)/docs/manual/': {
        framework: 'general',
        removeFrameworkKeywords: true
      },
      // All /quickstart/ files should be general framework
      '^(en|pt)/docs/quickstart/': {
        framework: 'general',
        removeFrameworkKeywords: true
      }
    }
  }

  async fixAll() {
    console.log(chalk.blue('🔧 Starting framework metadata fixes...'))
    
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
      const correctedFrontmatter = await this.correctFrameworkMetadata(
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

  async correctFrameworkMetadata(frontmatter, relativePath, content) {
    const corrected = { ...frontmatter }
    let hasFrameworkChanges = false
    let hasKeywordChanges = false
    
    // Normalize path for mapping lookup
    const normalizedPath = relativePath.replace(/\\/g, '/').replace(/^(en|pt)\/docs/, '')
    const mapping = this.frameworkMappings[normalizedPath]
    
    if (mapping) {
      // This is a known framework file - apply correct metadata
      
      // Fix framework
      if (corrected.framework !== mapping.framework) {
        if (this.options.verbose) {
          console.log(chalk.yellow(`🔧 ${relativePath}: framework ${corrected.framework || 'none'} → ${mapping.framework}`))
        }
        corrected.framework = mapping.framework
        hasFrameworkChanges = true
        this.stats.frameworksFixed++
      }
      
      // Fix keywords - REPLACE completely for framework files to ensure purity
      const currentKeywords = corrected.keywords || []
      const shouldHaveKeywords = mapping.keywords
      
      // For framework files, we want EXACT keywords to prevent cross-contamination
      const keywordsMatch = JSON.stringify(currentKeywords.sort()) === JSON.stringify(shouldHaveKeywords.sort())
      
      if (!keywordsMatch) {
        if (this.options.verbose) {
          console.log(chalk.yellow(`🏷️  ${relativePath}: keywords ${currentKeywords.join(', ')} → ${shouldHaveKeywords.join(', ')}`))
        }
        // COMPLETE REPLACEMENT - no merge to prevent cross-framework contamination
        corrected.keywords = [...shouldHaveKeywords]
        hasKeywordChanges = true
        this.stats.keywordsFixed++
      }
      
    } else {
      // Check pattern-based rules
      const fullPath = relativePath.replace(/\\/g, '/')
      let matchedRule = null
      
      for (const [pattern, rule] of Object.entries(this.patternRules)) {
        if (new RegExp(pattern).test(fullPath)) {
          matchedRule = rule
          break
        }
      }
      
      if (matchedRule) {
        // Apply pattern-based rule
        
        // Fix framework if different
        if (corrected.framework !== matchedRule.framework) {
          if (this.options.verbose) {
            console.log(chalk.yellow(`🔧 ${relativePath}: framework ${corrected.framework || 'none'} → ${matchedRule.framework} (pattern rule)`))
          }
          corrected.framework = matchedRule.framework
          hasFrameworkChanges = true
          this.stats.frameworksFixed++
        }
        
        // Remove framework-specific keywords if rule says so
        if (matchedRule.removeFrameworkKeywords && corrected.keywords) {
          const frameworkKeywords = ['MEF', 'ZOF', 'OIF', 'MOC', 'MAL', 'MEP', 'knowledge', 'embedding', 'workflow', 'orchestration', 'operator', 'intelligence', 'ontology', 'catalog', 'arbiter', 'layer', 'epistemic', 'principle']
          const currentKeywords = corrected.keywords || []
          const cleanedKeywords = currentKeywords.filter(keyword => 
            !frameworkKeywords.some(fw => keyword.toLowerCase().includes(fw.toLowerCase()))
          )
          
          // Keep Matrix Protocol and other generic keywords
          const genericKeywords = currentKeywords.filter(keyword =>
            keyword.toLowerCase().includes('matrix protocol') ||
            keyword.toLowerCase().includes('examples') ||
            keyword.toLowerCase().includes('docs') ||
            keyword.toLowerCase().includes('manual') ||
            keyword.toLowerCase().includes('quickstart')
          )
          
          const finalKeywords = [...new Set([...cleanedKeywords, ...genericKeywords])]
          
          if (JSON.stringify(currentKeywords.sort()) !== JSON.stringify(finalKeywords.sort())) {
            if (this.options.verbose) {
              console.log(chalk.yellow(`🏷️  ${relativePath}: removed framework keywords: ${currentKeywords.join(', ')} → ${finalKeywords.join(', ')}`))
            }
            corrected.keywords = finalKeywords
            hasKeywordChanges = true
            this.stats.keywordsFixed++
          }
        }
        
      } else {
        // Not a mapped framework file and no pattern rule - apply intelligent corrections
        
        if (corrected.framework) {
          // Has framework declaration - verify keywords are appropriate
          const frameworkKeywordMaps = {
            'MEF': ['MEF', 'knowledge', 'embedding'],
            'ZOF': ['ZOF', 'workflow', 'orchestration'],
            'OIF': ['OIF', 'operator', 'intelligence'],
            'MOC': ['MOC', 'ontology', 'catalog'],
            'MAL': ['MAL', 'arbiter', 'layer'],
            'MEP': ['MEP', 'epistemic', 'principle'],
            'general': [] // No specific keywords required
          }
          
          const requiredKeywords = frameworkKeywordMaps[corrected.framework]
          if (requiredKeywords && requiredKeywords.length > 0) {
            const currentKeywords = corrected.keywords || []
            const hasFrameworkKeyword = requiredKeywords.some(keyword =>
              currentKeywords.some(k => k.toLowerCase().includes(keyword.toLowerCase()))
            )
            
            if (!hasFrameworkKeyword) {
              // Add the main framework keyword at minimum
              const mainKeyword = requiredKeywords[0]
              if (!currentKeywords.includes(mainKeyword)) {
                corrected.keywords = [mainKeyword, ...currentKeywords]
                hasKeywordChanges = true
                this.stats.keywordsFixed++
              }
            }
          }
        }
      }
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
      return { frontmatter, yamlContent: match[1] }
    } catch (error) {
      return { frontmatter: null, error: error.message }
    }
  }

  hasChanges(original, corrected) {
    return JSON.stringify(original) !== JSON.stringify(corrected)
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
    const changes = []
    
    if (original.framework !== corrected.framework) {
      changes.push(`framework: ${original.framework || 'none'} → ${corrected.framework}`)
    }
    
    if (JSON.stringify(original.keywords) !== JSON.stringify(corrected.keywords)) {
      changes.push(`keywords: updated`)
    }
    
    this.fixes.push({
      file,
      status,
      changes,
      original: {
        framework: original.framework,
        keywords: original.keywords
      },
      corrected: {
        framework: corrected.framework,
        keywords: corrected.keywords
      }
    })
  }

  generateReport() {
    console.log('\n' + chalk.bold('📊 Framework Metadata Fix Report'))
    console.log('═'.repeat(60))
    
    console.log(chalk.blue('\n📈 Summary Statistics'))
    console.log(`Files Processed: ${this.stats.filesProcessed}`)
    console.log(`Files Fixed: ${this.stats.filesFixed}`)
    console.log(`Framework Classifications Fixed: ${this.stats.frameworksFixed}`)
    console.log(`Keyword Sets Fixed: ${this.stats.keywordsFixed}`)
    
    if (this.fixes.length > 0) {
      console.log(chalk.blue('\n🔧 Applied Fixes'))
      
      this.fixes.forEach((fix, index) => {
        const statusColor = fix.status === 'DRY_RUN' ? chalk.yellow : chalk.green
        console.log(`${index + 1}. ${statusColor(fix.status)}: ${fix.file}`)
        fix.changes.forEach(change => {
          console.log(`   • ${change}`)
        })
        console.log('')
      })
    }
    
    if (this.options.dryRun) {
      console.log(chalk.yellow('\n🔍 DRY RUN MODE - No files were actually modified'))
      console.log('Run without --dry-run to apply fixes')
    } else {
      console.log(chalk.green(`\n✅ All fixes applied successfully!`))
    }
    
    console.log('\n' + '═'.repeat(60))
  }
}

// CLI interface
import { program } from 'commander'

program
  .name('fix-framework-metadata')
  .description('Fix incorrect framework metadata in content files')
  .version('1.0.0')

program
  .option('-d, --dry-run', 'Preview fixes without applying them', false)
  .option('-v, --verbose', 'Show detailed output', false)

program.action(async (options) => {
  try {
    const fixer = new FrameworkMetadataFixer(options)
    const fixedCount = await fixer.fixAll()
    
    console.log(chalk.green(`\n🎉 Framework metadata fix complete! ${fixedCount} files fixed.`))
    
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

export default FrameworkMetadataFixer