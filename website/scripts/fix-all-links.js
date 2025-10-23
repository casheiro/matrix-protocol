#!/usr/bin/env node
/**
 * Fix All Non-Conform Links
 * - Remove .md extensions from links
 * - Standardize relative link formats
 * - Fix index.md references to use folder paths
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const CONTENT_ROOT = path.join(projectRoot, 'content')

const args = process.argv.slice(2)
const APPLY_MODE = args.includes('--apply')

console.log(`🔧 Fix All Links Script`)
console.log(`Mode: ${APPLY_MODE ? 'APPLY' : 'DRY-RUN'}`)
console.log('=' .repeat(50))

function walk(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      walk(full, list)
    } else if (e.isFile() && e.name.endsWith('.md')) {
      list.push(full)
    }
  }
  return list
}

function fixLinksInContent(content) {
  let fixed = content
  let changes = []

  // Pattern 1: Remove .md extension from markdown links
  const mdLinkPattern = /\[([^\]]+)\]\(([^)]+)\.md\)/g
  fixed = fixed.replace(mdLinkPattern, (match, text, path) => {
    changes.push(`Removed .md from: ${match}`)
    return `[${text}](${path})`
  })

  // Pattern 2: Fix index.md references to folder paths
  const indexLinkPattern = /\[([^\]]+)\]\(([^)]+)\/index\)/g
  fixed = fixed.replace(indexLinkPattern, (match, text, path) => {
    changes.push(`Fixed index reference: ${match}`)
    return `[${text}](${path})`
  })

  // Pattern 3: Normalize relative paths (optional - be careful with this)
  // Only fix obvious cases where /index is redundant
  const redundantIndexPattern = /\[([^\]]+)\]\(([^)]*\/[^/)]+)\/index\)/g
  fixed = fixed.replace(redundantIndexPattern, (match, text, basePath) => {
    // Only if it doesn't end with a specific filename
    if (!basePath.includes('.')) {
      changes.push(`Removed redundant /index: ${match}`)
      return `[${text}](${basePath})`
    }
    return match
  })

  return { content: fixed, changes }
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const { content: fixedContent, changes } = fixLinksInContent(content)
    
    if (changes.length > 0) {
      const relativePath = path.relative(CONTENT_ROOT, filePath)
      console.log(`📝 ${relativePath}:`)
      changes.forEach(change => console.log(`  - ${change}`))
      
      if (APPLY_MODE) {
        fs.writeFileSync(filePath, fixedContent, 'utf-8')
        console.log(`  ✅ Applied ${changes.length} fixes`)
      }
      
      return changes.length
    }
    
    return 0
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message)
    return 0
  }
}

function main() {
  const files = walk(CONTENT_ROOT)
  let totalFiles = 0
  let totalChanges = 0
  let modifiedFiles = 0

  console.log(`📊 Found ${files.length} markdown files\n`)

  for (const file of files) {
    totalFiles++
    const changes = processFile(file)
    if (changes > 0) {
      modifiedFiles++
      totalChanges += changes
    }
  }

  console.log('\n' + '=' .repeat(50))
  console.log(`📊 SUMMARY:`)
  console.log(`Files scanned: ${totalFiles}`)
  console.log(`Files modified: ${modifiedFiles}`)
  console.log(`Total changes: ${totalChanges}`)
  
  if (!APPLY_MODE) {
    console.log(`\n🚀 To apply changes, run: node scripts/fix-all-links.js --apply`)
  } else {
    console.log(`\n✅ All changes applied successfully!`)
  }

  return totalChanges
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { main as fixAllLinks }