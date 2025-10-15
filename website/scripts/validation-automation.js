#!/usr/bin/env node
/**
 * 🤖 VALIDATION AUTOMATION SCRIPT - CAMILA RODRIGUEZ
 * 
 * MILESTONE 1.4 PREP: Configurar validação estrutural automatizada
 * QA Engineer: Camila Rodriguez  
 * Baseado em: content-audit.js (Ricardo)
 * 
 * Este script configura validação automática para os 19 bloqueadores
 * identificados na Sprint 1, garantindo 0 bloqueadores no final.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { runAudit } from './content-audit.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configurações de QA
const QA_CONFIG = {
  expectedBlockersCount: 19, // Baseline atual
  targetBlockersCount: 0,   // Meta da Sprint 1
  qualityGatesFile: path.join(__dirname, '../docs/dynamic-navigation/qa-quality-gates.json'),
  validationReportsDir: path.join(__dirname, '../docs/dynamic-navigation/validation-reports')
}

/**
 * Quality Gates Definition
 */
const QUALITY_GATES = {
  gate1: {
    name: "Template Validation",
    description: "Template aprovado e funcional",
    criteria: [
      "Bruno template completed",
      "Definition of Done validated",
      "Reusable structure confirmed"
    ],
    status: "PASSED", // Bruno completou
    blockers: 0,
    timestamp: null
  },
  gate2: {
    name: "First 5 Files Validation", 
    description: "Primeiros 5 arquivos criados e validados",
    criteria: [
      "5 index.md files created with complete frontmatter",
      "Hierarchical structure respected",
      "No audit script failures"
    ],
    status: "PENDING",
    blockers: null,
    timestamp: null
  },
  gate3: {
    name: "PT/EN Parity Validation",
    description: "Paridade PT/EN confirmada",
    criteria: [
      "All PT files have EN equivalents",
      "Structure mirrored between locales", 
      "No locale-specific blockers"
    ],
    status: "PENDING",
    blockers: null,
    timestamp: null
  },
  gate4: {
    name: "Final Sprint Validation",
    description: "Auditoria final 0 bloqueadores",
    criteria: [
      "All 19 blockers resolved",
      "content-audit.js reports 0 missing index files",
      "Dynamic navigation functional",
      "Complete frontmatter validation"
    ],
    status: "PENDING", 
    blockers: null,
    timestamp: null
  }
}

/**
 * Validation Report Class
 */
class ValidationReport {
  constructor() {
    this.timestamp = new Date().toISOString()
    this.sprintGoal = "0 bloqueadores detectados"
    this.currentBlockers = null
    this.targetBlockers = QA_CONFIG.targetBlockersCount
    this.qualityGates = {}
    this.progressStatus = "IN_PROGRESS"
    this.blockerAnalysis = {
      resolved: [],
      pending: [],
      newlyDetected: []
    }
    this.recommendations = []
    this.nextSteps = []
  }
}

/**
 * Análise dos 19 bloqueadores específicos identificados
 */
const KNOWN_BLOCKERS = [
  // Bruno - PT files (5 arquivos após template completion)
  "pt/docs/manual/templates/corporation",
  "pt/docs/manual/templates/enterprise", 
  "pt/docs/manual/templates/scaleup",
  "pt/docs/manual/templates/startup",
  "pt/docs/manual/templates/unified",
  "pt/docs/quickstart/templates",
  
  // Marina - EN files (12 arquivos)
  "en/docs/examples/knowledge/structured",
  "en/docs/examples/knowledge/structured/business-rules",
  "en/docs/examples/knowledge/structured/procedures", 
  "en/docs/examples/knowledge/structured/technical-patterns",
  "en/docs/examples/knowledge/unstructured",
  "en/docs/manual",
  "en/docs/manual/templates/basic",
  "en/docs/manual/templates/corporation",
  "en/docs/manual/templates/enterprise",
  "en/docs/manual/templates/scaleup", 
  "en/docs/manual/templates/startup",
  "en/docs/manual/templates/unified",
  "en/docs/quickstart/templates"
]

/**
 * Executa validação automática completa
 */
async function runAutomaticValidation() {
  console.log('🤖 CAMILA RODRIGUEZ - VALIDATION AUTOMATION')
  console.log('MILESTONE 1.4 PREP: Configurar validação estrutural automatizada')
  console.log('=' .repeat(60))
  
  const report = new ValidationReport()
  
  // 1. Executar auditoria base do Ricardo
  console.log('📊 Executando auditoria base...')
  const auditReport = await runAudit()
  report.currentBlockers = auditReport.missingIndexFiles.length
  
  console.log(`✅ Baseline confirmado: ${report.currentBlockers} bloqueadores`)
  
  // 2. Analisar bloqueadores específicos
  console.log('🔍 Analisando bloqueadores específicos...')
  report.blockerAnalysis = analyzeSpecificBlockers(auditReport.missingIndexFiles)
  
  // 3. Validar Quality Gates
  console.log('🚪 Validando Quality Gates...')
  report.qualityGates = await validateQualityGates(auditReport)
  
  // 4. Gerar recomendações de QA
  console.log('💡 Gerando recomendações...')
  report.recommendations = generateQARecommendations(report)
  
  // 5. Definir próximos passos
  report.nextSteps = defineNextSteps(report)
  
  // 6. Determinar status geral
  report.progressStatus = determineProgressStatus(report)
  
  return report
}

/**
 * Analisa bloqueadores específicos conhecidos
 */
function analyzeSpecificBlockers(currentBlockers) {
  const analysis = {
    resolved: [],
    pending: [],
    newlyDetected: []
  }
  
  // Verificar quais bloqueadores conhecidos foram resolvidos
  for (const knownBlocker of KNOWN_BLOCKERS) {
    if (!currentBlockers.includes(knownBlocker)) {
      analysis.resolved.push(knownBlocker)
    } else {
      analysis.pending.push(knownBlocker)
    }
  }
  
  // Verificar se há novos bloqueadores não mapeados
  for (const currentBlocker of currentBlockers) {
    if (!KNOWN_BLOCKERS.includes(currentBlocker)) {
      analysis.newlyDetected.push(currentBlocker)
    }
  }
  
  return analysis
}

/**
 * Valida cada Quality Gate
 */
async function validateQualityGates(auditReport) {
  const gates = { ...QUALITY_GATES }
  
  // Gate 1: Template Validation - já passou (Bruno completou)
  gates.gate1.timestamp = new Date().toISOString()
  gates.gate1.blockers = 0
  
  // Gate 2: First 5 Files - verificar se algum foi criado
  const resolvedCount = KNOWN_BLOCKERS.length - auditReport.missingIndexFiles.filter(
    blocker => KNOWN_BLOCKERS.includes(blocker)
  ).length
  
  if (resolvedCount >= 5) {
    gates.gate2.status = "PASSED"
    gates.gate2.blockers = Math.max(0, auditReport.missingIndexFiles.length - 5)
  } else {
    gates.gate2.blockers = auditReport.missingIndexFiles.length
  }
  gates.gate2.timestamp = new Date().toISOString()
  
  // Gate 3: PT/EN Parity - verificar paridade de estrutura
  const ptBlockers = auditReport.missingIndexFiles.filter(b => b.startsWith('pt/')).length
  const enBlockers = auditReport.missingIndexFiles.filter(b => b.startsWith('en/')).length
  
  if (ptBlockers === 0 && enBlockers === 0) {
    gates.gate3.status = "PASSED"
    gates.gate3.blockers = 0
  } else {
    gates.gate3.blockers = Math.abs(ptBlockers - enBlockers)
  }
  gates.gate3.timestamp = new Date().toISOString()
  
  // Gate 4: Final Sprint - meta de 0 bloqueadores
  if (auditReport.missingIndexFiles.length === 0) {
    gates.gate4.status = "PASSED"
    gates.gate4.blockers = 0
  } else {
    gates.gate4.blockers = auditReport.missingIndexFiles.length
  }
  gates.gate4.timestamp = new Date().toISOString()
  
  return gates
}

/**
 * Gera recomendações específicas de QA
 */
function generateQARecommendations(report) {
  const recommendations = []
  
  // Recomendação baseada no progresso atual
  if (report.currentBlockers > 15) {
    recommendations.push({
      priority: "HIGH",
      category: "Sprint Risk",
      title: "Acelerar criação de arquivos index.md",
      description: `${report.currentBlockers} bloqueadores ainda pendentes`,
      action: "Priorizar criação de arquivos usando template do Bruno",
      owner: "Bruno + Marina"
    })
  }
  
  // Recomendação sobre paridade PT/EN
  const ptPending = report.blockerAnalysis.pending.filter(b => b.startsWith('pt/')).length
  const enPending = report.blockerAnalysis.pending.filter(b => b.startsWith('en/')).length
  
  if (Math.abs(ptPending - enPending) > 3) {
    recommendations.push({
      priority: "MEDIUM", 
      category: "Localization",
      title: "Balancear progresso entre PT e EN",
      description: `Desbalance: ${ptPending} PT vs ${enPending} EN pendentes`,
      action: "Coordenar criação paralela para manter paridade",
      owner: "Marina"
    })
  }
  
  // Recomendação sobre novos bloqueadores
  if (report.blockerAnalysis.newlyDetected.length > 0) {
    recommendations.push({
      priority: "HIGH",
      category: "Scope Change",
      title: "Investigar novos bloqueadores detectados",
      description: `${report.blockerAnalysis.newlyDetected.length} bloqueadores não mapeados`,
      action: "Revisar se são válidos ou falsos positivos",
      files: report.blockerAnalysis.newlyDetected,
      owner: "Ricardo + Camila"
    })
  }
  
  return recommendations
}

/**
 * Define próximos passos baseados no status atual
 */
function defineNextSteps(report) {
  const steps = []
  
  if (report.currentBlockers > 10) {
    steps.push("⚡ URGENT: Acelerar criação de arquivos index.md")
    steps.push("📋 Usar template do Bruno para máxima eficiência")
    steps.push("🔄 Validação contínua a cada 5 arquivos criados")
  }
  
  if (report.currentBlockers <= 10 && report.currentBlockers > 5) {
    steps.push("🎯 FOCUS: Finalizar arquivos restantes")
    steps.push("✅ Validation checkpoint para Gate 3")
    steps.push("📊 Preparar para auditoria final")
  }
  
  if (report.currentBlockers <= 5) {
    steps.push("🏁 FINAL PUSH: Últimos arquivos")
    steps.push("🧪 Testing completo de navegação dinâmica")
    steps.push("📋 Preparar para Gate 4 (final validation)")
  }
  
  if (report.currentBlockers === 0) {
    steps.push("🎉 SUCCESS: Executar validation final completa")
    steps.push("📊 Gerar relatório de Sprint Success")
    steps.push("✅ Confirmar todos os Success Criteria")
  }
  
  return steps
}

/**
 * Determina status geral do progresso
 */
function determineProgressStatus(report) {
  if (report.currentBlockers === 0) {
    return "COMPLETED"
  } else if (report.currentBlockers <= 5) {
    return "NEAR_COMPLETION" 
  } else if (report.currentBlockers <= 10) {
    return "ON_TRACK"
  } else {
    return "NEEDS_ACCELERATION"
  }
}

/**
 * Salva relatório de validação
 */
async function saveValidationReport(report) {
  // Criar diretório se não existir
  if (!fs.existsSync(QA_CONFIG.validationReportsDir)) {
    fs.mkdirSync(QA_CONFIG.validationReportsDir, { recursive: true })
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const reportFile = path.join(QA_CONFIG.validationReportsDir, `validation-${timestamp}.json`)
  const latestFile = path.join(QA_CONFIG.validationReportsDir, 'validation-latest.json')
  
  // Salvar relatório timestamped
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2))
  
  // Salvar como latest
  fs.writeFileSync(latestFile, JSON.stringify(report, null, 2))
  
  // Salvar Quality Gates
  fs.writeFileSync(QA_CONFIG.qualityGatesFile, JSON.stringify(report.qualityGates, null, 2))
  
  console.log(`📊 Validation report salvo: ${reportFile}`)
  console.log(`📋 Latest report: ${latestFile}`)
  console.log(`🚪 Quality Gates: ${QA_CONFIG.qualityGatesFile}`)
  
  return { reportFile, latestFile }
}

/**
 * Exibe summary da validação
 */
function displayValidationSummary(report) {
  console.log('\n🤖 CAMILA RODRIGUEZ - VALIDATION SUMMARY')
  console.log('=' .repeat(50))
  console.log(`📊 Status Geral: ${report.progressStatus}`)
  console.log(`🎯 Sprint Goal: ${report.sprintGoal}`)
  console.log(`📈 Progresso: ${QA_CONFIG.expectedBlockersCount - report.currentBlockers}/${QA_CONFIG.expectedBlockersCount} resolvidos`)
  console.log(`❌ Bloqueadores Atuais: ${report.currentBlockers}`)
  console.log(`🎯 Meta: ${report.targetBlockers}`)
  
  console.log('\n🚪 QUALITY GATES STATUS:')
  Object.entries(report.qualityGates).forEach(([gateId, gate]) => {
    const status = gate.status === 'PASSED' ? '✅' : gate.status === 'PENDING' ? '⏳' : '❌'
    console.log(`${status} ${gate.name}: ${gate.status}`)
    if (gate.blockers !== null && gate.blockers > 0) {
      console.log(`   └─ Bloqueadores: ${gate.blockers}`)
    }
  })
  
  console.log('\n📊 BLOCKER ANALYSIS:')
  console.log(`✅ Resolvidos: ${report.blockerAnalysis.resolved.length}`)
  console.log(`⏳ Pendentes: ${report.blockerAnalysis.pending.length}`)
  console.log(`🔍 Novos detectados: ${report.blockerAnalysis.newlyDetected.length}`)
  
  if (report.recommendations.length > 0) {
    console.log('\n💡 QA RECOMMENDATIONS:')
    report.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. [${rec.priority}] ${rec.title}`)
      console.log(`   Owner: ${rec.owner}`)
      console.log(`   Action: ${rec.action}`)
    })
  }
  
  if (report.nextSteps.length > 0) {
    console.log('\n🔄 NEXT STEPS:')
    report.nextSteps.forEach((step, index) => {
      console.log(`${index + 1}. ${step}`)
    })
  }
  
  console.log(`\n⏰ Validation executada em: ${report.timestamp}`)
}

/**
 * Função principal
 */
async function main() {
  try {
    const report = await runAutomaticValidation()
    const { reportFile } = await saveValidationReport(report)
    
    displayValidationSummary(report)
    
    console.log('\n✅ VALIDATION AUTOMATION CONFIGURADA!')
    console.log('🔄 Execute este script sempre que quiser verificar progresso')
    console.log('📊 Quality Gates atualizados automaticamente')
    
    return report.progressStatus === "COMPLETED"
  } catch (error) {
    console.error('❌ Erro durante validation automation:', error)
    return false
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().then(success => {
    process.exit(success ? 0 : 1)
  })
}

export { 
  runAutomaticValidation, 
  ValidationReport, 
  QUALITY_GATES, 
  KNOWN_BLOCKERS 
}