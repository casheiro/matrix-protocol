#!/usr/bin/env node
/**
 * English-only Slugs & Links Checker (Sprint 2)
 * - Varre /content/{pt,en}/docs
 * - Identifica slugs com caracteres não ASCII, espaços, underscores e palavras PT
 * - Verifica links internos quebrados e uso de caminhos não conformes
 * - Gera relatório JSON e resumo Markdown com recomendações
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const CONTENT_ROOT = path.join(projectRoot, 'content')
const OUTPUT_DIR = path.join(projectRoot, 'docs', 'dynamic-navigation', '02-execution', 'slug-link-reports')

function ensureDir(dir) { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }) }

const LOCALES = ['pt', 'en']

// Palavras genuinamente em português (removidos termos ingleses como 'manual', 'templates', 'moc')
const PT_WORDS = [
  'de','para','por','organizacional','exemplos','modelo','temas','fases','implementacao','implementação','governanca','governança','protocolo','protocole','rapido','inicio','guia','referencia','glossario'
]

// Termos técnicos válidos do projeto que não devem ser considerados não conformes
const VALID_TECH_TERMS = [
  'mef','zof','oif','moc','mal', // Frameworks do Matrix Protocol
  'implementation','manual','templates', // Termos técnicos em inglês
  'business-rules','technical-patterns','procedures', // Categorias UKI
  'stackspot','team-meeting','confluence', // Nomes específicos do projeto
  'unstructured','structured','knowledge', // Termos do domínio
  'uki-pay', 'pilot', // Prefixos comuns
  'corporation','enterprise','startup','scaleup','basic','unified', // Templates organizacionais
  'frameworks','examples','quickstart', // Seções principais
  'viewer', 'audit', 'validation' // Funcionalidades do sistema
]

function hasAccents(str) {
  return /[áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]/.test(str)
}
function isAsciiKebab(str) {
  return /^[a-z0-9-]+$/.test(str)
}
function containsPTWord(str) {
  const s = str.toLowerCase()
  return PT_WORDS.some(w => s.includes(w))
}

function isValidTechTerm(str) {
  const s = str.toLowerCase()
  return VALID_TECH_TERMS.some(term => s === term || s.startsWith(term + '-') || s.includes(term))
}
function sanitizeSegment(seg) {
  return seg
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[_\s]+/g, '-') // underscores/spaces -> hyphens
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
}

function walk(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) walk(full, list)
    else if (e.isFile() && e.name.endsWith('.md')) list.push(full)
  }
  return list
}

function analyzeSlug(filePath) {
  const rel = path.relative(CONTENT_ROOT, filePath)
  const segments = rel.split(path.sep)
  const issues = []
  const recommendations = []

  for (let i = 0; i < segments.length - 1; i++) { // diretorios
    const seg = segments[i]
    if (seg === 'content' || seg === 'docs' || seg === 'pt' || seg === 'en') continue
    // Só considera problema se não for um termo técnico válido
    const hasIssue = !isValidTechTerm(seg) && (!isAsciiKebab(seg) || hasAccents(seg) || containsPTWord(seg) || /_/.test(seg) || /\s/.test(seg))
    if (hasIssue) {
      const sanitized = sanitizeSegment(seg)
      const rec = { segment: seg, proposed: sanitized, needs_translation: containsPTWord(seg) }
      issues.push({ type: 'slug_non_conform', segment: seg })
      recommendations.push(rec)
    }
  }

  const fileName = path.basename(filePath, '.md')
  if (fileName !== 'index') {
    // Só considera problema se não for um termo técnico válido
    if (!isValidTechTerm(fileName) && (!isAsciiKebab(fileName) || hasAccents(fileName) || containsPTWord(fileName) || /_/.test(fileName) || /\s/.test(fileName))) {
      const sanitized = sanitizeSegment(fileName)
      issues.push({ type: 'filename_non_conform', segment: fileName })
      recommendations.push({ segment: fileName, proposed: sanitized, needs_translation: containsPTWord(fileName) })
    }
  }

  return { rel, issues, recommendations }
}

function extractLinks(mdContent) {
  const links = []
  const regex = /\[[^\]]*\]\(([^)]+)\)/g
  let m
  while ((m = regex.exec(mdContent)) !== null) {
    links.push(m[1])
  }
  return links
}

function isExternal(href) { 
  // URLs com protocolo (http/https) são externos
  if (/^(https?:)?\/\//i.test(href)) return true
  // URLs do viewer com query strings são internos mas dinâmicos
  if (/\/docs\/viewer\?/.test(href)) return true
  // Âncoras são consideradas internas (navegação na página)
  if (/^#/.test(href)) return true
  return false
}

function resolveTarget(baseDir, href) {
  // Âncoras são sempre válidas (navegação na página)
  if (/^#/.test(href)) return null // Null = skip validation
  
  // URLs do viewer são válidas se o arquivo referenciado existir
  if (/\/docs\/viewer\?file=(.+)/.test(href)) {
    const match = href.match(/\/docs\/viewer\?file=(.+)/)
    if (match) {
      const filePath = match[1]
      // Converter para caminho físico no content directory
      const physicalPath = path.join(CONTENT_ROOT, filePath.replace(/^\/docs/, 'pt/docs'))
      return physicalPath
    }
  }
  const ext = path.extname(href).toLowerCase()
  const isDirLike = !ext || href.endsWith('/')

  if (isDirLike) {
    // Link para diretório: resolver para index.md se existir
    const dirCandidate = path.resolve(baseDir, href)
    const idx = path.join(dirCandidate, 'index.md')
    if (fs.existsSync(idx)) return idx
    // fallback: tentar arquivo md com mesmo nome
    const mdCandidate = dirCandidate + '.md'
    return mdCandidate
  }

  if (ext === '.md') {
    return path.resolve(baseDir, href)
  }

  // Tratar assets como válidos (yaml/yml) sem transformar em .md
  if (ext === '.yaml' || ext === '.yml') {
    return path.resolve(baseDir, href)
  }

  // Outros tipos de arquivo: retornar caminho absoluto
  return path.resolve(baseDir, href)
}

function analyzeLinks(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const links = extractLinks(content)
  const baseDir = path.dirname(filePath)
  const broken = []
  const nonConformPaths = []

  for (const href of links) {
    if (isExternal(href)) continue
    const targetPath = resolveTarget(baseDir, href)
    
    // Skip validation for null paths (anchors, etc.)
    if (targetPath === null) continue
    
    const exists = fs.existsSync(targetPath)
    if (!exists) {
      broken.push({ href, resolved: targetPath })
    }
    // avaliar conformidade do caminho (apenas nos segmentos de diretório)
    const relTarget = path.relative(CONTENT_ROOT, targetPath)
    const segsRaw = relTarget.split(path.sep).filter(Boolean)
    const isIndex = segsRaw[segsRaw.length - 1] === 'index.md'
    const isAsset = /\.(yaml|yml)$/i.test(segsRaw[segsRaw.length - 1] || '')
    const segs = isIndex || isAsset ? segsRaw.slice(0, -1) : segsRaw
    // Só considera problema se não for um termo técnico válido E não for ".." (link relativo válido)
    const badSeg = segs.find(seg => seg !== '..' && !isValidTechTerm(seg) && (!isAsciiKebab(seg) || hasAccents(seg) || /_/.test(seg) || /\s/.test(seg)))
    if (badSeg) {
      nonConformPaths.push({ href, segment: badSeg })
    }
  }

  return { broken, nonConformPaths, linkCount: links.length }
}

function saveReports(summary, detailed) {
  ensureDir(OUTPUT_DIR)
  const ts = new Date().toISOString().replace(/[:.]/g, '-')
  const latestJson = path.join(OUTPUT_DIR, 'slug-link-latest.json')
  const tsJson = path.join(OUTPUT_DIR, `slug-link-${ts}.json`)
  const md = path.join(OUTPUT_DIR, 'slug-link-summary.md')

  fs.writeFileSync(latestJson, JSON.stringify(detailed, null, 2))
  fs.writeFileSync(tsJson, JSON.stringify(detailed, null, 2))

  const mdContent = `# Slugs & Links Report\n\n` +
    `- Locales: ${summary.locales.join(', ')}\n` +
    `- Files scanned: ${summary.filesScanned}\n` +
    `- Flagged slugs: ${summary.flaggedSlugs}\n` +
    `- Non-conform links: ${summary.nonConformLinks}\n` +
    `- Broken links: ${summary.brokenLinks}\n\n` +
    `## Top Recommendations\n` +
    summary.topRecommendations.map(r => `- ${r}`).join('\n') + '\n'

  fs.writeFileSync(md, mdContent)

  return { latestJson, tsJson, md }
}

async function main() {
  const detailed = { timestamp: new Date().toISOString(), locales: LOCALES, results: [] }
  let filesScanned = 0
  let flaggedSlugs = 0
  let nonConformLinks = 0
  let brokenLinks = 0
  const topRecs = new Set()

  for (const locale of LOCALES) {
    const root = path.join(CONTENT_ROOT, locale, 'docs')
    if (!fs.existsSync(root)) continue
    const files = walk(root)
    for (const file of files) {
      filesScanned++
      const slugAnalysis = analyzeSlug(file)
      const linkAnalysis = analyzeLinks(file)

      flaggedSlugs += slugAnalysis.issues.length
      nonConformLinks += linkAnalysis.nonConformPaths.length
      brokenLinks += linkAnalysis.broken.length

      slugAnalysis.recommendations.forEach(rec => {
        if (rec.needs_translation) topRecs.add('Traduzir segmentos/nomes para inglês e aplicar kebab-case')
        if (/_/.test(rec.segment)) topRecs.add('Substituir underscores por hyphens (kebab-case)')
        if (hasAccents(rec.segment)) topRecs.add('Remover acentos dos nomes de arquivos e pastas')
      })
      linkAnalysis.nonConformPaths.forEach(() => topRecs.add('Revisar links internos para apontar para slugs kebab-case'))
      linkAnalysis.broken.forEach(() => topRecs.add('Corrigir links internos quebrados (resolver para index.md quando necessário)'))

      detailed.results.push({
        file: path.relative(CONTENT_ROOT, file),
        slugIssues: slugAnalysis.issues,
        slugRecommendations: slugAnalysis.recommendations,
        linkAnalysis
      })
    }
  }

  const summary = {
    locales: LOCALES,
    filesScanned,
    flaggedSlugs,
    nonConformLinks,
    brokenLinks,
    topRecommendations: Array.from(topRecs)
  }

  const out = saveReports(summary, detailed)

  console.log('✅ Slugs & Links check concluído')
  console.log(`📄 Arquivos escaneados: ${filesScanned}`)
  console.log(`⚠️ Slugs sinalizados: ${flaggedSlugs}`)
  console.log(`🔗 Links não conformes: ${nonConformLinks}`)
  console.log(`❌ Links quebrados: ${brokenLinks}`)
  console.log(`🗂️ Report: ${out.latestJson}`)
  console.log(`📝 Summary: ${out.md}`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => {
    console.error('❌ Erro ao verificar slugs/links:', err)
    process.exit(1)
  })
}