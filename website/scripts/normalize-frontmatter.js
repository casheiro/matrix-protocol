#!/usr/bin/env node
/**
 * Frontmatter Normalization Script (Sprint 2)
 * - Aplica schema mínimo (title, description, icon, layout, sidebar, toc, navigation)
 * - Adiciona campos recomendados (tags, framework, maturity, lang, last_updated)
 * - Cria index.md nos diretórios prioritários de templates (basic, corporation, enterprise, scaleup, startup, unified)
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import YAML from 'yaml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const LOCALE = 'pt'
const CONTENT_ROOT = path.join(projectRoot, 'content', LOCALE, 'docs')
const OUTPUT_DIR = path.join(projectRoot, 'docs', 'dynamic-navigation', '02-execution')

const REQUIRED_FIELDS = ['title', 'description', 'icon', 'layout', 'sidebar', 'toc', 'navigation']

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function toTitleCase(str) {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, l => l.toUpperCase())
}

function suggestIcon(pathSegments) {
  const iconMap = {
    'quickstart': 'i-heroicons-rocket-launch',
    'manual': 'i-heroicons-document-text',
    'examples': 'i-heroicons-code-bracket',
    'frameworks': 'i-heroicons-cube',
    'templates': 'i-heroicons-document-duplicate',
    'tools': 'i-heroicons-wrench-screwdriver',
    'reference': 'i-heroicons-bookmark',
    'glossary': 'i-heroicons-book-open',
    'implementation': 'i-heroicons-cog-6-tooth',
    'integration': 'i-heroicons-puzzle-piece',
    'mep': 'i-heroicons-light-bulb',
    'protocol': 'i-heroicons-globe-alt'
  }
  for (const seg of [...pathSegments].reverse()) {
    if (iconMap[seg]) return iconMap[seg]
  }
  return 'i-heroicons-document-text'
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/) // frontmatter block at start
  if (!match) return { data: {}, body: content }
  try {
    const data = YAML.parse(match[1]) || {}
    const body = content.slice(match[0].length)
    return { data, body }
  } catch (e) {
    return { data: {}, body: content }
  }
}

function buildFrontmatter(existing, filePath) {
  const rel = path.relative(CONTENT_ROOT, filePath)
  const segments = rel.split(path.sep)
  const fileName = path.basename(filePath, path.extname(filePath))
  const isIndex = fileName === 'index'
  const now = new Date().toISOString().split('T')[0]

  const fm = { ...existing }

  if (!fm.title) {
    if (isIndex) {
      const folderName = segments[segments.length - 2] || 'Documentação'
      fm.title = toTitleCase(folderName)
    } else {
      fm.title = toTitleCase(fileName)
    }
  }
  if (!fm.description) {
    fm.description = `Página de documentação para ${fm.title}`
  }
  if (!fm.icon || typeof fm.icon !== 'string' || !/^i-heroicons-[a-z0-9-]+$/.test(fm.icon)) {
    fm.icon = suggestIcon(segments)
  }
  fm.layout = 'docs'
  fm.sidebar = fm.sidebar !== undefined ? fm.sidebar : true
  fm.toc = fm.toc !== undefined ? fm.toc : true
  fm.navigation = fm.navigation !== undefined ? fm.navigation : true

  // Campos recomendados por Sprint 2
  fm.lang = LOCALE
  fm.last_updated = now

  // Heurística para tags/framework/maturity em templates/manual
  if (rel.startsWith(`manual/templates`)) {
    fm.framework = fm.framework || 'MEF'
    fm.maturity = fm.maturity || 'stable'
    const tags = Array.isArray(fm.tags) ? fm.tags : []
    if (!tags.includes('manual')) tags.push('manual')
    if (!tags.includes('templates')) tags.push('templates')
    fm.tags = tags
  }

  return fm
}

function stringifyFrontmatter(fm) {
  return `---\n${YAML.stringify(fm)}---\n`
}

function normalizeFile(filePath, report) {
  const originalContent = fs.readFileSync(filePath, 'utf-8')
  const { data, body } = parseFrontmatter(originalContent)
  const normalized = buildFrontmatter(data, filePath)
  const newContent = stringifyFrontmatter(normalized) + body.trimStart()

  if (newContent !== originalContent) {
    // Backup
    fs.writeFileSync(`${filePath}.bak`, originalContent)
    // Write updated
    fs.writeFileSync(filePath, newContent)
    report.updated.push({ file: path.relative(CONTENT_ROOT, filePath), changes: Object.keys(normalized) })
  } else {
    report.skipped.push(path.relative(CONTENT_ROOT, filePath))
  }
}

function walk(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) walk(full, files)
    else if (e.isFile() && e.name.endsWith('.md')) files.push(full)
  }
  return files
}

function ensureIndexTemplate(folderPath, titleSuffix) {
  const indexPath = path.join(folderPath, 'index.md')
  if (fs.existsSync(indexPath)) return null
  const baseTitle = toTitleCase(path.basename(folderPath))
  const title = titleSuffix ? `${baseTitle} — ${titleSuffix}` : baseTitle

  const fm = buildFrontmatter({ title, description: `Entrada do diretório ${baseTitle}` }, indexPath)
  const body = `\n# ${title}\n\nBem-vindo. Esta página organiza os recursos do diretório.\n\n## 📖 Recursos Relacionados\n- [[Link 1]]\n- [[Link 2]]\n`
  const content = stringifyFrontmatter(fm) + body
  fs.writeFileSync(indexPath, content)
  return indexPath
}

async function main() {
  const report = {
    locale: LOCALE,
    executedAt: new Date().toISOString(),
    updated: [],
    created: [] ,
    skipped: []
  }

  // 1) Normalizar todos os .md em pt/docs
  const mdFiles = walk(CONTENT_ROOT)
  for (const file of mdFiles) {
    try { normalizeFile(file, report) } catch (e) {
      console.error('Erro ao normalizar', file, e.message)
    }
  }

  // 2) Criar index.md nos diretórios prioritários
  const templatesRoot = path.join(CONTENT_ROOT, 'manual', 'templates')
  const targets = ['basic', 'corporation', 'enterprise', 'scaleup', 'startup', 'unified']
  for (const t of targets) {
    const dir = path.join(templatesRoot, t)
    if (fs.existsSync(dir)) {
      const created = ensureIndexTemplate(dir, 'Templates')
      if (created) report.created.push(path.relative(CONTENT_ROOT, created))
    }
  }

  // 3) Salvar relatório
  ensureDir(OUTPUT_DIR)
  const latestFile = path.join(OUTPUT_DIR, 'frontmatter-normalization-latest.json')
  fs.writeFileSync(latestFile, JSON.stringify(report, null, 2))

  console.log('✅ Frontmatter normalization concluída')
  console.log(`📄 Atualizados: ${report.updated.length}`)
  console.log(`🆕 Criados: ${report.created.length}`)
  console.log(`⏭️ Ignorados: ${report.skipped.length}`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => {
    console.error('❌ Erro na normalização:', err)
    process.exit(1)
  })
}