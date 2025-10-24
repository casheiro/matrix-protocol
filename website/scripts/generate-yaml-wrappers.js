#!/usr/bin/env node
/**
 * Generate YAML Wrappers & Update Links
 * - Scans for .yaml/.yml assets under content
 * - Generates .md wrapper pages with frontmatter + YAML code block
 * - Updates Markdown links to point to wrappers instead of raw YAML
 * - Supports dry-run mode (default) and apply mode via --apply
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const CONTENT_ROOT = path.join(projectRoot, 'content')
// REPORT_DIR removed - no longer needed after cleanup
// const REPORT_DIR = path.join(projectRoot, 'docs', 'dynamic-navigation', '02-execution', 'slug-link-reports')

function ensureDir(dir) { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }) }

const args = process.argv.slice(2)
const APPLY_MODE = args.includes('--apply')
const UPDATE_MODE = args.includes('--update') || args.includes('--force')

function toKebab(str) {
  return str
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/_/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
}

function titleCaseFromBase(base) {
  // Convert "MOC_STARTUP" -> "Moc Startup"
  const words = base.replace(/[-_]+/g, ' ').toLowerCase().split(' ')
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  if (mb < 1024) return `${mb.toFixed(2)} MB`
  const gb = mb / 1024
  return `${gb.toFixed(2)} GB`
}

function listYamlFiles() {
  const yamlFiles = []
  for (const locale of ['pt','en']) {
    const root = path.join(CONTENT_ROOT, locale, 'docs')
    if (!fs.existsSync(root)) continue
    const stack = [root]
    while (stack.length) {
      const p = stack.pop()
      const stat = fs.statSync(p)
      if (stat.isDirectory()) {
        for (const e of fs.readdirSync(p)) stack.push(path.join(p, e))
      } else if (stat.isFile() && (p.endsWith('.yaml') || p.endsWith('.yml'))) {
        yamlFiles.push(p)
      }
    }
  }
  return yamlFiles
}

function buildWrapperPath(yamlPath) {
  const dir = path.dirname(yamlPath)
  const base = path.basename(yamlPath).replace(/\.(yaml|yml)$/i, '')
  const kebab = toKebab(base)
  return path.join(dir, `${kebab}.md`)
}

function buildWrapperContent(yamlPath, yamlContent) {
  const rel = path.relative(CONTENT_ROOT, yamlPath)
  const relParts = rel.split(path.sep)
  const locale = relParts[0] === 'en' ? 'en' : 'pt'
  const base = path.basename(yamlPath).replace(/\.(yaml|yml)$/i, '')
  const title = titleCaseFromBase(base)
  const description = locale === 'pt' 
    ? `Página wrapper para o asset YAML ${path.basename(yamlPath)}`
    : `Wrapper page for YAML asset ${path.basename(yamlPath)}`
  const fileParam = '/' + ['docs', ...relParts.slice(2)].join('/') // /docs/.../file.yaml
  const ctaText = locale === 'pt' ? 'Abrir no Visualizador' : 'Open in Viewer'
  const ctaPath = `/${locale}/docs/viewer?file=${fileParam}`

  // Badges: tipo, tamanho, última modificação
  const stat = fs.statSync(yamlPath)
  const typeLabel = yamlPath.toLowerCase().endsWith('.yml') ? 'YML' : 'YAML'
  const sizeLabel = formatSize(stat.size)
  const updatedLabel = new Date(stat.mtime).toISOString().split('T')[0]
  const infoText = locale === 'pt'
    ? `📄 Tipo: ${typeLabel} • 📦 Tamanho: ${sizeLabel} • 🕒 Última modificação: ${updatedLabel}`
    : `📄 Type: ${typeLabel} • 📦 Size: ${sizeLabel} • 🕒 Last updated: ${updatedLabel}`

  return `---\n`+
         `title: "${title}"\n`+
         `description: "${description}"\n`+
         `layout: "docs"\n`+
         `sidebar: true\n`+
         `toc: true\n`+
         `navigation: true\n`+
         `---\n\n`+
         `> Source YAML: \`${rel}\`\n\n`+
         `**${ctaText}:** [${title}](${ctaPath})\n\n`+
         `> ${infoText}\n\n`+
         `\n\n`+
         `\`\`\`yaml\n`+
         `${yamlContent}\n`+
         `\`\`\`\n`
}

function scanMarkdownFiles() {
  const files = []
  for (const locale of ['pt','en']) {
    const root = path.join(CONTENT_ROOT, locale, 'docs')
    if (!fs.existsSync(root)) continue
    const stack = [root]
    while (stack.length) {
      const p = stack.pop()
      const stat = fs.statSync(p)
      if (stat.isDirectory()) {
        for (const e of fs.readdirSync(p)) stack.push(path.join(p, e))
      } else if (stat.isFile() && p.endsWith('.md')) {
        files.push(p)
      }
    }
  }
  return files
}

function computeYamlToWrapperMap(yamlFiles) {
  const map = {}
  for (const y of yamlFiles) {
    const wrapper = buildWrapperPath(y)
    map[path.relative(CONTENT_ROOT, y)] = path.relative(CONTENT_ROOT, wrapper)
  }
  return map
}

function updateLinksInMarkdown(filePath, yamlToWrapperMap) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const hrefRegex = /\[(?:[^\]]*)\]\(([^)]+)\)/g
  const updates = []
  let updatedContent = content
  let m
  while ((m = hrefRegex.exec(content)) !== null) {
    const href = m[1]
    if (/^(https?:)?\/\//.test(href) || /^#/.test(href)) continue

    // Normalize to repo-relative for matching
    const absoluteTarget = path.resolve(path.dirname(filePath), href)
    const relToContent = path.relative(CONTENT_ROOT, absoluteTarget)

    // Direct YAML link or link missing extension but pointing to YAML basename
    const isYamlLink = /\.(yaml|yml)$/i.test(href)

    let mapped = null
    if (yamlToWrapperMap[relToContent]) {
      mapped = yamlToWrapperMap[relToContent]
    } else if (isYamlLink === false) {
      // Check basename-only links (e.g., `uki-pay-discount-logic-001` without extension)
      const dirnameRel = path.dirname(relToContent)
      const yamlRel = Object.keys(yamlToWrapperMap).find(yRel => {
        return path.dirname(yRel) === dirnameRel && path.basename(yRel).replace(/\.(yaml|yml)$/i, '') === path.basename(href)
      })
      if (yamlRel) mapped = yamlToWrapperMap[yamlRel]
    }

    if (mapped) {
      // Compute relative path from current file to wrapper
      const fromDir = path.dirname(path.relative(CONTENT_ROOT, filePath))
      const relativeWrapper = path.relative(fromDir, mapped)
      updates.push({ from: href, to: relativeWrapper })
      updatedContent = updatedContent.replace(`(${href})`, `(${relativeWrapper})`)
    }
  }
  return { updates, updatedContent }
}

async function main() {
  // Report functionality removed after cleanup
  // ensureDir(REPORT_DIR)
  const yamlFiles = listYamlFiles()
  const yamlToWrapperMap = computeYamlToWrapperMap(yamlFiles)

  const wrapperPlans = []
  for (const y of yamlFiles) {
    const wrapperPath = buildWrapperPath(y)
    const exists = fs.existsSync(wrapperPath)
    const yamlContent = fs.readFileSync(y, 'utf-8')
    const mdContent = buildWrapperContent(y, yamlContent)
    wrapperPlans.push({ yaml: path.relative(CONTENT_ROOT, y), wrapper: path.relative(CONTENT_ROOT, wrapperPath), exists })
    if (APPLY_MODE && (!exists || UPDATE_MODE)) {
      fs.writeFileSync(wrapperPath, mdContent)
    }
  }

  const mdFiles = scanMarkdownFiles()
  const linkPlans = []
  for (const f of mdFiles) {
    const { updates, updatedContent } = updateLinksInMarkdown(f, yamlToWrapperMap)
    if (updates.length) {
      linkPlans.push({ file: path.relative(CONTENT_ROOT, f), updates })
      if (APPLY_MODE) fs.writeFileSync(f, updatedContent)
    }
  }

  // Report generation removed - no longer needed
  // const ts = new Date().toISOString().replace(/[:.]/g, '-')
  // const outJson = path.join(REPORT_DIR, `yaml-wrappers-report-${ts}.json`)
  // const latestJson = path.join(REPORT_DIR, 'yaml-wrappers-report-latest.json')
  // const report = { timestamp: new Date().toISOString(), applyMode: APPLY_MODE, wrapperPlans, linkPlans }
  // fs.writeFileSync(outJson, JSON.stringify(report, null, 2))
  // fs.writeFileSync(latestJson, JSON.stringify(report, null, 2))

  console.log(`✅ YAML Wrappers ${APPLY_MODE ? 'APPLIED' : 'DRY-RUN'}`)
  console.log(`📄 Wrappers planned: ${wrapperPlans.length} (missing: ${wrapperPlans.filter(p => !p.exists).length})`)
  console.log(`🔗 Files with link updates: ${linkPlans.length}`)
  // console.log(`🗂️ Report: ${latestJson}`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => {
    console.error('❌ Error generating YAML wrappers:', err)
    process.exit(1)
  })
}