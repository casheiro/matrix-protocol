#!/usr/bin/env node
/**
 * Auto-Fix Slugs & Links
 * - Detecta problemas em slugs e links internos
 * - Gera plano de renome e sugestões de correção de links
 * - Modo dry-run (padrão) e modo apply via --apply
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const CONTENT_ROOT = path.join(projectRoot, 'content')
// OUTPUT_DIR removed - no longer needed after cleanup  
// const OUTPUT_DIR = path.join(projectRoot, 'docs', 'dynamic-navigation', '02-execution', 'slug-link-reports')

function ensureDir(dir) { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }) }
const translationMap = JSON.parse(fs.readFileSync(path.join(__dirname, 'slug-translation-map.json'), 'utf-8'))

const args = process.argv.slice(2)
const APPLY_MODE = args.includes('--apply')

function isAsciiKebab(str) { return /^[a-z0-9-]+$/.test(str) }
function hasAccents(str) { return /[áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]/.test(str) }
function containsPTWord(str) {
  const s = str.toLowerCase()
  const variants = [s, s.replace(/-/g, '_'), s.replace(/_/g, '-')]
  for (const v of variants) {
    if (translationMap[v]) return true
  }
  const ptTokens = [
    'exemplo','exemplos','implementacao','implementações','organizacional','porte','conhecimento','pagamento','desconto','logica','preco','preço','relatorio','relatório','modelo',
    'sobre','por','para','de','em','no','na','dos','das','do','da'
  ]
  return ptTokens.some(w => s.includes(w))
}
function toKebab(str) {
  return str
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/_/g, '-') // Apenas underscores, espaços são tratados separadamente
    .replace(/\s+/g, '-') // Espaços
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
}
function translateSegment(seg) {
  // Remove a extensão para a tradução
  const baseName = seg.includes('.') ? seg.substring(0, seg.lastIndexOf('.')) : seg
  const extension = seg.includes('.') ? seg.substring(seg.lastIndexOf('.')) : ''
  const s = baseName.toLowerCase()

  if (translationMap[s]) {
    return translationMap[s] + extension
  }
  return toKebab(seg)
}

function walk(dir, list = { files: [], dirs: [] }) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      list.dirs.push(full)
      walk(full, list)
    } else if (e.isFile() && e.name.endsWith('.md')) {
      list.files.push(full)
    }
  }
  return list
}

function detectSlugIssues(itemPath, isFile = false) {
  const relPath = path.relative(CONTENT_ROOT, itemPath)
  const segments = relPath.split(path.sep)
  const issues = []
  let proposedPath = relPath

  const processSegment = (seg, isLast) => {
    if ([ 'content', 'pt', 'en', 'docs' ].includes(seg)) return seg

    const baseName = isLast && isFile ? path.basename(seg, '.md') : seg
    const extension = isLast && isFile ? '.md' : ''

    const problematic = !isAsciiKebab(baseName) || hasAccents(baseName) || /_/.test(baseName) || /\s/.test(baseName) || containsPTWord(baseName)

    if (problematic) {
      const translated = translateSegment(baseName)
      const proposedSeg = translated + extension
      issues.push({ segment: seg, reason: 'non-conformant' })
      return proposedSeg
    }
    return seg
  }

  const newSegments = segments.map((seg, i) => processSegment(seg, i === segments.length - 1))

  if (issues.length > 0) {
    proposedPath = path.join(...newSegments)
    return { current: relPath, proposed: proposedPath, issues }
  }
  return null
}

function analyzeAndPropose() {
  const allPaths = []
  for (const locale of ['pt','en']) {
    const root = path.join(CONTENT_ROOT, locale, 'docs')
    if (fs.existsSync(root)) {
      const { files, dirs } = walk(root)
      allPaths.push(...dirs.map(d => ({ path: d, isFile: false })))
      allPaths.push(...files.map(f => ({ path: f, isFile: true })))
    }
  }
  
  const plans = []
  for (const { path: itemPath, isFile } of allPaths) {
    const result = detectSlugIssues(itemPath, isFile)
    if (result) {
      plans.push({ ...result, isFile })
    }
  }

  return plans
}

function scanMarkdownFiles() {
  const files = []
  for (const locale of ['pt','en']) {
    const root = path.join(CONTENT_ROOT, locale, 'docs')
    if (!fs.existsSync(root)) continue
    const entries = fs.readdirSync(root, { withFileTypes: true })
    const stack = entries.map(e => path.join(root, e.name))
    while (stack.length) {
      const p = stack.pop()
      const stat = fs.statSync(p)
      if (stat.isDirectory()) {
        fs.readdirSync(p, { withFileTypes: true }).forEach(e => stack.push(path.join(p, e.name)))
      } else if (stat.isFile() && p.endsWith('.md')) {
        files.push(p)
      }
    }
  }
  return files
}

function proposeLinkUpdates(filePath, renameMap) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const hrefRegex = /\[(?:[^\]]*)\]\(([^)]+)\)/g
  const proposals = []
  let m
  while ((m = hrefRegex.exec(content)) !== null) {
    let href = m[1]
    if (/^(https?:)?\/\//.test(href) || /^#/.test(href)) continue

    let updatedHref = href
    // Tenta aplicar renomeações de diretórios/arquivos ao link
    for (const [oldPath, newPath] of Object.entries(renameMap)) {
        const relativeOld = path.relative(path.dirname(filePath), path.join(CONTENT_ROOT, oldPath))
        const relativeNew = path.relative(path.dirname(filePath), path.join(CONTENT_ROOT, newPath))
        if (href.includes(relativeOld)) {
            updatedHref = href.replace(relativeOld, relativeNew)
        }
    }
    
    // Normaliza para kebab-case como fallback
    const kebab = updatedHref.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/_/g, '-').replace(/\s+/g, '-')
    if (kebab !== href) {
      proposals.push({ from: href, to: kebab })
    } else if (updatedHref !== href) {
      proposals.push({ from: href, to: updatedHref })
    }
  }
  return proposals
}

function applyRenames(plans) {
  const dirPlans = plans.filter(p => !p.isFile)
  const filePlans = plans.filter(p => p.isFile)

  // Renomear diretórios do mais profundo para o mais raso
  dirPlans.sort((a, b) => b.current.split(path.sep).length - a.current.split(path.sep).length)
  const applied = []

  const tryRename = (fromRel, toRel) => {
    const from = path.join(CONTENT_ROOT, fromRel)
    const to = path.join(CONTENT_ROOT, toRel)
    if (from === to) return null
    // Cria diretório pai de destino, se necessário
    const parent = path.dirname(to)
    if (!fs.existsSync(parent)) fs.mkdirSync(parent, { recursive: true })
    if (fs.existsSync(to)) {
      // Se já existe, evita sobrescrita
      return { from: fromRel, to: toRel, status: 'skipped-exists' }
    }
    fs.renameSync(from, to)
    return { from: fromRel, to: toRel, status: 'renamed' }
  }

  for (const p of dirPlans) {
    const res = tryRename(p.current, p.proposed)
    if (res) applied.push(res)
  }
  for (const p of filePlans) {
    const res = tryRename(p.current, p.proposed)
    if (res) applied.push(res)
  }
  return applied
}

function applyLinkFixes(files, renameMap) {
  const applied = []
  for (const f of files) {
    const proposals = proposeLinkUpdates(f, renameMap)
    if (proposals.length) {
      let content = fs.readFileSync(f, 'utf-8')
      for (const u of proposals) {
        const before = content
        content = content.replaceAll(`(${u.from})`, `(${u.to})`)
        if (before !== content) {
          applied.push({ file: path.relative(CONTENT_ROOT, f), from: u.from, to: u.to })
        }
      }
      fs.writeFileSync(f, content)
    }
  }
  return applied
}

async function main() {
  const renamePlans = analyzeAndPropose()
  const renameMap = renamePlans.reduce((acc, plan) => {
    acc[plan.current] = plan.proposed
    return acc
  }, {})

  const files = scanMarkdownFiles()
  const linkPlans = []
  for (const f of files) {
    const updates = proposeLinkUpdates(f, renameMap)
    if (updates.length) linkPlans.push({ file: path.relative(CONTENT_ROOT, f), updates })
  }

  let appliedRenames = []
  let appliedLinkUpdates = []
  if (APPLY_MODE) {
    appliedRenames = applyRenames(renamePlans)
    const finalMap = appliedRenames.reduce((acc, r) => { acc[r.from] = r.to; return acc }, {})
    // Re-scan files after renames to avoid ENOENT on old paths
    const filesAfterRenames = scanMarkdownFiles()
    appliedLinkUpdates = applyLinkFixes(filesAfterRenames, finalMap)
  }

  // Report generation removed - no longer needed
  // ensureDir(OUTPUT_DIR)
  // const ts = new Date().toISOString().replace(/[:.]/g, '-')
  // const outJson = path.join(OUTPUT_DIR, `auto-fix-plans-${ts}.json`)
  // const latestJson = path.join(OUTPUT_DIR, 'auto-fix-plans-latest.json')
  // const report = { timestamp: new Date().toISOString(), applyMode: APPLY_MODE, renamePlans, linkPlans, appliedRenames, appliedLinkUpdates }
  // fs.writeFileSync(outJson, JSON.stringify(report, null, 2))
  // fs.writeFileSync(latestJson, JSON.stringify(report, null, 2))

  console.log(APPLY_MODE ? '✅ Auto-fix aplicado' : '✅ Auto-fix (dry-run) concluído')
  console.log(`📁 Propostas de renome: ${renamePlans.length}`)
  console.log(`🔗 Arquivos com propostas de link: ${linkPlans.length}`)
  if (APPLY_MODE) {
    console.log(`🟢 Renomes aplicados: ${appliedRenames.length}`)
    console.log(`🟢 Atualizações de links aplicadas: ${appliedLinkUpdates.length}`)
  }
  console.log(`🗂️ Report: ${latestJson}`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => {
    console.error('❌ Erro no auto-fix:', err)
    process.exit(1)
  })
}