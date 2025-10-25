#!/usr/bin/env node

/**
 * TASK 1.2.4: Generate Missing Index Files
 * 
 * Creates missing index.md files for navigation hierarchy completion.
 * Based on structure analysis and navigation requirements.
 * 
 * Dependencies: TASK 1.1.2 (structure map), TASK 1.2.3 (schema applied)
 * Output: Missing index.md files with proper frontmatter
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import yaml from 'js-yaml'
import chalk from 'chalk'
import ora from 'ora'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')
const CONTENT_DIR = path.join(PROJECT_ROOT, 'content')

class MissingIndexGenerator {
  constructor(options = {}) {
    this.options = {
      dryRun: false,
      verbose: false,
      force: false,
      ...options
    }
    
    this.stats = {
      directoriesScanned: 0,
      indexFilesFound: 0,
      indexFilesCreated: 0,
      skippedDirectories: 0
    }
    
    this.missingIndexes = []
    this.errors = []
    this.spinner = null
    
    this.categoryTitles = {
      'examples': {
        'pt': 'Exemplos',
        'en': 'Examples'
      },
      'frameworks': {
        'pt': 'Frameworks',
        'en': 'Frameworks'
      },
      'manual': {
        'pt': 'Manual',
        'en': 'Manual'
      },
      'docs': {
        'pt': 'Documentação',
        'en': 'Documentation'
      },
      'quickstart': {
        'pt': 'Início Rápido',
        'en': 'Quick Start'
      },
      'tools': {
        'pt': 'Ferramentas',
        'en': 'Tools'
      },
      'templates': {
        'pt': 'Templates',
        'en': 'Templates'
      },
      'knowledge': {
        'pt': 'Base de Conhecimento',
        'en': 'Knowledge Base'
      },
      'unstructured': {
        'pt': 'Conhecimento Não Estruturado',
        'en': 'Unstructured Knowledge'
      },
      'structured': {
        'pt': 'Conhecimento Estruturado',
        'en': 'Structured Knowledge'
      },
      'business-rules': {
        'pt': 'Regras de Negócio',
        'en': 'Business Rules'
      },
      'technical-patterns': {
        'pt': 'Padrões Técnicos',
        'en': 'Technical Patterns'
      },
      'procedures': {
        'pt': 'Procedimentos',
        'en': 'Procedures'
      },
      'pilots': {
        'pt': 'Projetos Piloto',
        'en': 'Pilot Projects'
      },
      'basic': {
        'pt': 'Estrutura Básica',
        'en': 'Basic Structure'
      },
      'startup': {
        'pt': 'Startup',
        'en': 'Startup'
      },
      'scaleup': {
        'pt': 'Scaleup',
        'en': 'Scaleup'
      },
      'corporation': {
        'pt': 'Corporação',
        'en': 'Corporation'
      },
      'enterprise': {
        'pt': 'Enterprise',
        'en': 'Enterprise'
      },
      'unified': {
        'pt': 'Estrutura Unificada',
        'en': 'Unified Structure'
      },
      'images': {
        'pt': 'Imagens',
        'en': 'Images'
      }
    }
  }

  async generateMissingIndexes() {
    this.log(chalk.blue('📁 Starting missing index.md generation...'))
    
    if (!fs.existsSync(CONTENT_DIR)) {
      throw new Error(`Content directory not found: ${CONTENT_DIR}`)
    }

    this.spinner = ora('Scanning for missing index files...').start()
    
    try {
      await this.scanForMissingIndexes(CONTENT_DIR, '')
      
      if (this.missingIndexes.length === 0) {
        this.spinner.succeed('✅ All directories already have index.md files')
        return 0
      }
      
      this.updateSpinner('Creating missing index.md files...')
      
      for (const missingIndex of this.missingIndexes) {
        await this.createIndexFile(missingIndex)
      }
      
      this.spinner.succeed(`✅ Index generation complete: ${this.stats.indexFilesCreated} files created`)
      
      this.printSummary()
      
      return this.stats.indexFilesCreated
      
    } catch (error) {
      this.spinner.fail(`❌ Index generation failed: ${error.message}`)
      throw error
    }
  }

  async scanForMissingIndexes(dirPath, relativePath) {
    const items = fs.readdirSync(dirPath, { withFileTypes: true })
    
    this.stats.directoriesScanned++
    
    // Check if current directory has an index.md
    const indexPath = path.join(dirPath, 'index.md')
    const hasIndex = fs.existsSync(indexPath)
    
    if (hasIndex) {
      this.stats.indexFilesFound++
    } else {
      // Check if directory has markdown files or subdirectories
      const hasMarkdownFiles = items.some(item => 
        !item.isDirectory() && item.name.endsWith('.md')
      )
      const hasSubdirectories = items.some(item => item.isDirectory())
      
      if (hasMarkdownFiles || hasSubdirectories) {
        // This directory needs an index.md
        this.missingIndexes.push({
          directoryPath: dirPath,
          relativePath: relativePath || '.',
          hasMarkdownFiles,
          hasSubdirectories,
          items: items.map(item => ({
            name: item.name,
            isDirectory: item.isDirectory()
          }))
        })
      }
    }
    
    // Recursively scan subdirectories
    for (const item of items) {
      if (item.isDirectory()) {
        const itemPath = path.join(dirPath, item.name)
        const itemRelativePath = path.join(relativePath, item.name)
        await this.scanForMissingIndexes(itemPath, itemRelativePath)
      }
    }
  }

  async createIndexFile(missingIndex) {
    const { directoryPath, relativePath } = missingIndex
    
    try {
      this.updateSpinner(`Creating index for ${relativePath}...`)
      
      // Generate appropriate frontmatter and content
      const frontmatter = await this.generateIndexFrontmatter(missingIndex)
      const content = await this.generateIndexContent(missingIndex)
      
      const fullContent = this.combineContent(frontmatter, content)
      
      if (this.options.dryRun) {
        this.log(chalk.yellow(`[DRY RUN] Would create: ${path.join(directoryPath, 'index.md')}`))
        this.log(chalk.gray(fullContent.split('\n').slice(0, 10).join('\n') + '...'))
      } else {
        const indexPath = path.join(directoryPath, 'index.md')
        fs.writeFileSync(indexPath, fullContent, 'utf-8')
        
        this.stats.indexFilesCreated++
        
        if (this.options.verbose) {
          this.log(chalk.green(`✓ Created: ${relativePath}/index.md`))
        }
      }
      
    } catch (error) {
      this.errors.push({
        directory: relativePath,
        error: error.message
      })
      
      if (this.options.verbose) {
        this.log(chalk.red(`❌ Error creating index for ${relativePath}: ${error.message}`))
      }
    }
  }

  async generateIndexFrontmatter(missingIndex) {
    const { relativePath, items } = missingIndex
    
    // Detect language from path
    const language = relativePath.includes('en/') ? 'en' : 
                    relativePath.includes('pt/') ? 'pt' :
                    relativePath.includes('/en') ? 'en' :
                    relativePath.endsWith('en') ? 'en' : 'pt'
    
    // Extract directory name and parent path
    const pathParts = relativePath.split('/')
    const currentDir = pathParts[pathParts.length - 1] || 'root'
    
    // Generate title based on directory name and language
    let title = this.generateTitle(currentDir, language)
    
    // Generate description
    let description = this.generateDescription(currentDir, language, items)
    
    // Determine layout and navigation properties
    const layout = this.determineLayout(relativePath)
    const order = this.determineOrder(currentDir, pathParts.length)
    
    const frontmatter = {
      title,
      description,
      layout,
      sidebar: layout === 'docs',
      toc: true,
      navigation: true,
      lang: language,
      last_updated: new Date().toISOString().split('T')[0],
      order
    }
    
    // Add category-specific fields
    if (relativePath.includes('frameworks/')) {
      frontmatter.category = 'frameworks'
    } else if (relativePath.includes('examples/')) {
      frontmatter.category = 'examples'
    } else if (relativePath.includes('manual/')) {
      frontmatter.category = 'manual'
    }
    
    // Add icon based on category
    frontmatter.icon = this.determineIcon(currentDir, relativePath)
    
    return frontmatter
  }

  generateTitle(directoryName, language) {
    // Check for predefined translations first
    if (this.categoryTitles[directoryName]) {
      return this.categoryTitles[directoryName][language]
    }
    
    // Generate title from directory name
    const humanized = directoryName
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
    
    return humanized
  }

  generateDescription(directoryName, language, items) {
    const hasSubdirs = items.some(item => item.isDirectory)
    const markdownCount = items.filter(item => !item.isDirectory && item.name.endsWith('.md')).length
    
    if (language === 'pt') {
      if (hasSubdirs && markdownCount > 0) {
        return `Seção organizacional contendo ${markdownCount} documentos e subseções relacionadas a ${directoryName.replace(/-/g, ' ')}.`
      } else if (hasSubdirs) {
        return `Seção organizacional com subseções relacionadas a ${directoryName.replace(/-/g, ' ')}.`
      } else {
        return `Coleção de ${markdownCount} documentos sobre ${directoryName.replace(/-/g, ' ')}.`
      }
    } else {
      if (hasSubdirs && markdownCount > 0) {
        return `Organizational section containing ${markdownCount} documents and subsections related to ${directoryName.replace(/-/g, ' ')}.`
      } else if (hasSubdirs) {
        return `Organizational section with subsections related to ${directoryName.replace(/-/g, ' ')}.`
      } else {
        return `Collection of ${markdownCount} documents about ${directoryName.replace(/-/g, ' ')}.`
      }
    }
  }

  determineLayout(relativePath) {
    if (relativePath.includes('/frameworks/')) return 'framework'
    if (relativePath.includes('/docs/')) return 'docs'
    if (relativePath.includes('/examples/')) return 'example'
    return 'default'
  }

  determineOrder(directoryName, depth) {
    // Higher level directories get lower order numbers
    const baseOrder = Math.max(0, 100 - (depth * 10))
    
    // Adjust based on importance
    const priorities = {
      'frameworks': 10,
      'quickstart': 20,
      'manual': 30,
      'examples': 40,
      'tools': 50,
      'templates': 60
    }
    
    return priorities[directoryName] || baseOrder
  }

  determineIcon(directoryName, relativePath) {
    const iconMap = {
      'frameworks': 'i-heroicons-puzzle-piece',
      'examples': 'i-heroicons-light-bulb',
      'manual': 'i-heroicons-book-open',
      'quickstart': 'i-heroicons-rocket-launch',
      'tools': 'i-heroicons-wrench-screwdriver',
      'templates': 'i-heroicons-document-duplicate',
      'business-rules': 'i-heroicons-clipboard-document-list',
      'technical-patterns': 'i-heroicons-cog-6-tooth',
      'procedures': 'i-heroicons-list-bullet',
      'knowledge': 'i-heroicons-academic-cap',
      'structured': 'i-heroicons-squares-2x2',
      'unstructured': 'i-heroicons-squares-plus',
      'pilots': 'i-heroicons-beaker',
      'basic': 'i-heroicons-square-2-stack',
      'startup': 'i-heroicons-rocket-launch',
      'enterprise': 'i-heroicons-building-office',
      'unified': 'i-heroicons-puzzle-piece'
    }
    
    return iconMap[directoryName] || 'i-heroicons-folder'
  }

  async generateIndexContent(missingIndex) {
    const { relativePath, items } = missingIndex
    const language = relativePath.includes('en/') ? 'en' : 
                    relativePath.includes('pt/') ? 'pt' :
                    relativePath.includes('/en') ? 'en' :
                    relativePath.endsWith('en') ? 'en' : 'pt'
    const currentDir = relativePath.split('/').pop() || 'root'
    
    let content = ''
    
    // Add main heading
    const title = this.generateTitle(currentDir, language)
    content += `# ${title}\n\n`
    
    // Add introduction
    if (language === 'pt') {
      content += `Esta seção contém documentação organizada sobre ${currentDir.replace(/-/g, ' ')}.\n\n`
    } else {
      content += `This section contains organized documentation about ${currentDir.replace(/-/g, ' ')}.\n\n`
    }
    
    // List subdirectories
    const subdirectories = items.filter(item => item.isDirectory)
    if (subdirectories.length > 0) {
      const subSectionTitle = language === 'pt' ? '## 📁 Subseções' : '## 📁 Subsections'
      content += `${subSectionTitle}\n\n`
      
      for (const subdir of subdirectories) {
        const subdirTitle = this.generateTitle(subdir.name, language)
        content += `- [${subdirTitle}](./${subdir.name}/)\n`
      }
      content += '\n'
    }
    
    // List markdown files
    const markdownFiles = items.filter(item => 
      !item.isDirectory && item.name.endsWith('.md') && item.name !== 'index.md'
    )
    
    if (markdownFiles.length > 0) {
      const documentsTitle = language === 'pt' ? '## 📄 Documentos' : '## 📄 Documents'
      content += `${documentsTitle}\n\n`
      
      for (const file of markdownFiles) {
        const fileName = path.basename(file.name, '.md')
        const fileTitle = this.generateTitle(fileName, language)
        content += `- [${fileTitle}](./${file.name})\n`
      }
      content += '\n'
    }
    
    // Add navigation help
    if (language === 'pt') {
      content += `---\n\n*Navegue pelas seções usando o menu lateral ou os links acima.*\n`
    } else {
      content += `---\n\n*Navigate through sections using the sidebar menu or the links above.*\n`
    }
    
    return content
  }

  combineContent(frontmatter, content) {
    const yamlContent = yaml.dump(frontmatter, { 
      indent: 2,
      lineWidth: -1,
      noRefs: true
    })
    
    return `---\n${yamlContent}---\n${content}`
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
    console.log('\n' + chalk.bold('📊 Index Generation Summary'))
    console.log('─'.repeat(50))
    
    console.log(`Directories Scanned: ${chalk.blue(this.stats.directoriesScanned)}`)
    console.log(`Index Files Found: ${chalk.green(this.stats.indexFilesFound)}`)
    console.log(`Index Files Created: ${chalk.yellow(this.stats.indexFilesCreated)}`)
    
    if (this.errors.length > 0) {
      console.log(`Errors: ${chalk.red(this.errors.length)}`)
      
      console.log('\n' + chalk.red('❌ Creation Errors:'))
      this.errors.slice(0, 5).forEach(error => {
        console.log(chalk.red(`  • ${error.directory}: ${error.error}`))
      })
      
      if (this.errors.length > 5) {
        console.log(chalk.gray(`    ... and ${this.errors.length - 5} more errors`))
      }
    }
    
    if (this.options.dryRun) {
      console.log(chalk.yellow('\n🔍 DRY RUN MODE - No files were actually created'))
    }
  }
}

// CLI interface
import { program } from 'commander'

program
  .name('generate-missing-index')
  .description('Generate missing index.md files for navigation')
  .version('1.0.0')

program
  .option('-d, --dry-run', 'Preview what would be created', false)
  .option('-v, --verbose', 'Show detailed output', false)
  .option('-f, --force', 'Force overwrite existing files', false)

program.action(async (options) => {
  try {
    const generator = new MissingIndexGenerator(options)
    const createdCount = await generator.generateMissingIndexes()
    
    if (createdCount > 0) {
      console.log(chalk.green(`\n🎉 Successfully created ${createdCount} missing index.md files!`))
    } else {
      console.log(chalk.blue('\n✨ All directories already have index.md files.'))
    }
    
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

export default MissingIndexGenerator