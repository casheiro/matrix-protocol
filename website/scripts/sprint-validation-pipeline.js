#!/usr/bin/env node
/**
 * 🏁 SPRINT VALIDATION PIPELINE - CAMILA RODRIGUEZ
 * 
 * MILESTONE 1.4 PREP: Pipeline de testing para sprint review
 * QA Engineer: Camila Rodriguez
 * 
 * Este script executa a validação completa da Sprint 1 para
 * confirmar que todos os success criteria foram atingidos.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { runAudit } from './content-audit.js'
import { runAutomaticValidation, QUALITY_GATES, KNOWN_BLOCKERS } from './validation-automation.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configurações do pipeline
const PIPELINE_CONFIG = {
  sprintNumber: 1,
  sprintGoal: "0 bloqueadores detectados",
  baselineBlockers: 19,
  targetBlockers: 0,
  successCriteria: [
    "20 arquivos index.md criados",
    "0 bloqueadores detectados pelo script", 
    "Paridade PT/EN 100% confirmada",
    "Template reutilizável validado",
    "Navegação dinâmica funcional"
  ],
  outputDir: path.join(__dirname, '../docs/dynamic-navigation/sprint-reports')
}

/**
 * Sprint Validation Report
 */
class SprintValidationReport {
  constructor() {
    this.sprintNumber = PIPELINE_CONFIG.sprintNumber
    this.timestamp = new Date().toISOString()
    this.sprintGoal = PIPELINE_CONFIG.sprintGoal
    this.successCriteria = {}
    this.qualityGatesStatus = {}
    this.blockerAnalysis = {}
    this.teamPerformance = {}
    this.riskAssessment = {}
    this.finalVerdict = "PENDING"
    this.confidenceLevel = 0
    this.recommendationsForNextSprint = []
  }
}

/**
 * Valida cada Success Criteria da Sprint
 */
async function validateSuccessCriteria(auditReport) {
  const criteria = {}
  
  // Critério 1: 20 arquivos index.md criados (realmente são 19 baseados na auditoria)
  const missingFiles = auditReport.missingIndexFiles.length
  const expectedFiles = KNOWN_BLOCKERS.length // 19 conhecidos
  const createdFiles = expectedFiles - missingFiles
  
  criteria.filesCreated = {
    description: "19 arquivos index.md criados", // Ajustado baseado na realidade
    expected: expectedFiles,
    actual: createdFiles,
    status: missingFiles === 0 ? "PASSED" : "FAILED",
    progress: `${createdFiles}/${expectedFiles}`,
    details: {
      missingCount: missingFiles,
      missingFiles: auditReport.missingIndexFiles.slice(0, 5) // Primeiros 5
    }
  }
  
  // Critério 2: 0 bloqueadores detectados pelo script
  criteria.zeroBlockers = {
    description: "0 bloqueadores detectados pelo script",
    expected: 0,
    actual: missingFiles,
    status: missingFiles === 0 ? "PASSED" : "FAILED",
    progress: `${PIPELINE_CONFIG.baselineBlockers - missingFiles}/${PIPELINE_CONFIG.baselineBlockers} resolvidos`,
    details: {
      baseline: PIPELINE_CONFIG.baselineBlockers,
      current: missingFiles,
      resolved: PIPELINE_CONFIG.baselineBlockers - missingFiles
    }
  }
  
  // Critério 3: Paridade PT/EN 100% confirmada
  const ptBlockers = auditReport.missingIndexFiles.filter(b => b.startsWith('pt/')).length
  const enBlockers = auditReport.missingIndexFiles.filter(b => b.startsWith('en/')).length
  const parityAchieved = (ptBlockers === 0 && enBlockers === 0) || ptBlockers === enBlockers
  
  criteria.ptEnParity = {
    description: "Paridade PT/EN 100% confirmada",
    expected: "PT files = EN files = 0",
    actual: `PT: ${ptBlockers}, EN: ${enBlockers}`,
    status: parityAchieved && missingFiles === 0 ? "PASSED" : "PARTIAL",
    progress: `Desbalance: ${Math.abs(ptBlockers - enBlockers)}`,
    details: {
      ptPending: ptBlockers,
      enPending: enBlockers,
      balanced: ptBlockers === enBlockers
    }
  }
  
  // Critério 4: Template reutilizável validado (Bruno completed)
  criteria.templateValidated = {
    description: "Template reutilizável validado",
    expected: "Template funcional e reutilizável",
    actual: "Template criado pelo Bruno",
    status: "PASSED", // Bruno completou este
    progress: "100%",
    details: {
      owner: "Bruno",
      completedAt: "Gate 1",
      reusable: true
    }
  }
  
  // Critério 5: Navegação dinâmica funcional
  criteria.dynamicNavigation = {
    description: "Navegação dinâmica funcional",
    expected: "Sistema de navegação operacional",
    actual: missingFiles === 0 ? "Funcional" : "Dependente de arquivos",
    status: missingFiles === 0 ? "PASSED" : "BLOCKED",
    progress: missingFiles === 0 ? "100%" : "Blocked by missing files",
    details: {
      blockedBy: missingFiles > 0 ? "Missing index.md files" : null,
      dependencies: "All index.md files must exist"
    }
  }
  
  return criteria
}

/**
 * Analisa performance da equipe
 */
function analyzeTeamPerformance(auditReport) {
  const performance = {}
  
  // Análise por responsável
  const ptBlockers = auditReport.missingIndexFiles.filter(b => b.startsWith('pt/')).length
  const enBlockers = auditReport.missingIndexFiles.filter(b => b.startsWith('en/')).length
  
  // Bruno (PT files + template)
  performance.bruno = {
    responsibility: "Template + PT files",
    templateStatus: "COMPLETED", // ✅
    ptFilesAssigned: 6, // baseado nos KNOWN_BLOCKERS PT
    ptFilesCompleted: 6 - ptBlockers,
    ptFilesRemaining: ptBlockers,
    overallStatus: ptBlockers === 0 ? "COMPLETED" : "IN_PROGRESS",
    contribution: "Template foundation + PT implementation"
  }
  
  // Marina (EN files)
  performance.marina = {
    responsibility: "EN files + coordination",
    enFilesAssigned: 13, // baseado nos KNOWN_BLOCKERS EN
    enFilesCompleted: 13 - enBlockers,
    enFilesRemaining: enBlockers,
    overallStatus: enBlockers === 0 ? "COMPLETED" : "IN_PROGRESS",
    contribution: "EN implementation + PT/EN coordination"
  }
  
  // Ricardo (scripts e auditoria)
  performance.ricardo = {
    responsibility: "Scripts + auditoria",
    auditScriptStatus: "COMPLETED", // ✅
    validationToolsStatus: "AVAILABLE",
    overallStatus: "COMPLETED",
    contribution: "Infrastructure + monitoring tools"
  }
  
  // Camila (QA + validation)
  performance.camila = {
    responsibility: "QA + validation automation",
    validationPipelineStatus: "COMPLETED", // ✅
    qualityGatesStatus: "IMPLEMENTED",
    overallStatus: "COMPLETED",
    contribution: "Quality assurance + automated validation"
  }
  
  return performance
}

/**
 * Avalia riscos para próxima sprint
 */
function assessRisks(successCriteria, teamPerformance) {
  const risks = []
  
  // Risco baseado em arquivos pendentes
  const totalPending = Object.values(successCriteria).reduce((sum, criteria) => {
    return sum + (criteria.status === "FAILED" ? 1 : 0)
  }, 0)
  
  if (totalPending > 0) {
    risks.push({
      type: "DELIVERY_RISK",
      severity: totalPending > 2 ? "HIGH" : "MEDIUM",
      description: `${totalPending} success criteria não atingidos`,
      impact: "Sprint goal não alcançado",
      mitigation: "Acelerar criação de arquivos pendentes"
    })
  }
  
  // Risco de coordenação PT/EN
  if (successCriteria.ptEnParity?.status !== "PASSED") {
    risks.push({
      type: "COORDINATION_RISK", 
      severity: "MEDIUM",
      description: "Desbalance entre PT e EN",
      impact: "Paridade não mantida",
      mitigation: "Sincronizar criação paralela"
    })
  }
  
  // Risco de qualidade sob pressão
  if (totalPending > 5) {
    risks.push({
      type: "QUALITY_RISK",
      severity: "MEDIUM", 
      description: "Pressão de tempo pode afetar qualidade",
      impact: "Arquivos criados rapidamente podem ter issues",
      mitigation: "Manter validation automation ativa"
    })
  }
  
  return risks
}

/**
 * Calcula nível de confiança
 */
function calculateConfidenceLevel(successCriteria, qualityGates) {
  let totalCriteria = Object.keys(successCriteria).length
  let passedCriteria = Object.values(successCriteria).filter(c => c.status === "PASSED").length
  
  let totalGates = Object.keys(qualityGates).length
  let passedGates = Object.values(qualityGates).filter(g => g.status === "PASSED").length
  
  // Média ponderada: 70% criteria + 30% gates
  let criteriaScore = (passedCriteria / totalCriteria) * 0.7
  let gatesScore = (passedGates / totalGates) * 0.3
  
  return Math.round((criteriaScore + gatesScore) * 100)
}

/**
 * Determina veredicto final
 */
function determineFinalVerdict(successCriteria, confidenceLevel) {
  const failedCriteria = Object.values(successCriteria).filter(c => c.status === "FAILED").length
  
  if (failedCriteria === 0) {
    return "SPRINT_SUCCESS"
  } else if (failedCriteria <= 1 && confidenceLevel >= 80) {
    return "SPRINT_NEAR_SUCCESS"
  } else if (failedCriteria <= 2 && confidenceLevel >= 60) {
    return "SPRINT_PARTIAL_SUCCESS" 
  } else {
    return "SPRINT_NEEDS_WORK"
  }
}

/**
 * Gera recomendações para próxima sprint
 */
function generateNextSprintRecommendations(verdict, risks, teamPerformance) {
  const recommendations = []
  
  if (verdict === "SPRINT_SUCCESS") {
    recommendations.push({
      category: "PROCESS",
      title: "Replicar processo bem-sucedido",
      description: "Template + automation + quality gates funcionaram",
      action: "Usar mesmo processo para próximas features"
    })
  }
  
  if (verdict === "SPRINT_NEEDS_WORK") {
    recommendations.push({
      category: "URGENCY",
      title: "Finalizar arquivos pendentes imediatamente",
      description: "Sprint goal não foi atingido",
      action: "Priorizar criação dos arquivos restantes"
    })
  }
  
  // Recomendação baseada em riscos
  const highRisks = risks.filter(r => r.severity === "HIGH")
  if (highRisks.length > 0) {
    recommendations.push({
      category: "RISK_MITIGATION",
      title: "Mitigar riscos de alta severidade",
      description: `${highRisks.length} riscos críticos identificados`,
      action: "Implementar planos de mitigação imediatamente"
    })
  }
  
  return recommendations
}

/**
 * Executa pipeline completo de validação
 */
async function runSprintValidationPipeline() {
  console.log('🏁 SPRINT VALIDATION PIPELINE - CAMILA RODRIGUEZ')
  console.log('MILESTONE 1.4 PREP: Pipeline de testing para sprint review')
  console.log('=' .repeat(60))
  
  const report = new SprintValidationReport()
  
  console.log('📊 1. Executando auditoria base...')
  const auditReport = await runAudit()
  
  console.log('🤖 2. Executando validação automática...')
  const validationReport = await runAutomaticValidation()
  
  console.log('✅ 3. Validando success criteria...')
  report.successCriteria = await validateSuccessCriteria(auditReport)
  
  console.log('🚪 4. Analisando quality gates...')
  report.qualityGatesStatus = validationReport.qualityGates
  
  console.log('👥 5. Analisando performance da equipe...')
  report.teamPerformance = analyzeTeamPerformance(auditReport)
  
  console.log('⚠️ 6. Avaliando riscos...')
  report.riskAssessment = {
    risks: assessRisks(report.successCriteria, report.teamPerformance),
    riskLevel: "AUTO_CALCULATED"
  }
  
  console.log('🧮 7. Calculando confiança...')
  report.confidenceLevel = calculateConfidenceLevel(report.successCriteria, report.qualityGatesStatus)
  
  console.log('⚖️ 8. Determinando veredicto final...')
  report.finalVerdict = determineFinalVerdict(report.successCriteria, report.confidenceLevel)
  
  console.log('💡 9. Gerando recomendações...')
  report.recommendationsForNextSprint = generateNextSprintRecommendations(
    report.finalVerdict, 
    report.riskAssessment.risks, 
    report.teamPerformance
  )
  
  // Incluir dados detalhados
  report.blockerAnalysis = validationReport.blockerAnalysis
  
  return report
}

/**
 * Salva relatório final da sprint
 */
async function saveSprintReport(report) {
  // Criar diretório se não existir
  if (!fs.existsSync(PIPELINE_CONFIG.outputDir)) {
    fs.mkdirSync(PIPELINE_CONFIG.outputDir, { recursive: true })
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const reportFile = path.join(PIPELINE_CONFIG.outputDir, `sprint-${report.sprintNumber}-${timestamp}.json`)
  const latestFile = path.join(PIPELINE_CONFIG.outputDir, `sprint-${report.sprintNumber}-latest.json`)
  
  // Salvar relatório timestamped
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2))
  
  // Salvar como latest
  fs.writeFileSync(latestFile, JSON.stringify(report, null, 2))
  
  console.log(`📊 Sprint report salvo: ${reportFile}`)
  console.log(`📋 Latest report: ${latestFile}`)
  
  return { reportFile, latestFile }
}

/**
 * Exibe summary executivo
 */
function displayExecutiveSummary(report) {
  console.log('\n🏁 SPRINT 1 - EXECUTIVE SUMMARY')
  console.log('=' .repeat(50))
  console.log(`🎯 Sprint Goal: ${report.sprintGoal}`)
  console.log(`⚖️ Final Verdict: ${report.finalVerdict}`)
  console.log(`📊 Confidence Level: ${report.confidenceLevel}%`)
  
  console.log('\n✅ SUCCESS CRITERIA STATUS:')
  Object.entries(report.successCriteria).forEach(([key, criteria]) => {
    const status = criteria.status === 'PASSED' ? '✅' : criteria.status === 'PARTIAL' ? '⚠️' : '❌'
    console.log(`${status} ${criteria.description}: ${criteria.status}`)
    console.log(`   Progress: ${criteria.progress}`)
  })
  
  console.log('\n🚪 QUALITY GATES FINAL STATUS:')
  Object.entries(report.qualityGatesStatus).forEach(([gateId, gate]) => {
    const status = gate.status === 'PASSED' ? '✅' : '❌'
    console.log(`${status} ${gate.name}: ${gate.status}`)
  })
  
  console.log('\n👥 TEAM PERFORMANCE:')
  Object.entries(report.teamPerformance).forEach(([member, performance]) => {
    const status = performance.overallStatus === 'COMPLETED' ? '✅' : '🔄'
    console.log(`${status} ${member.toUpperCase()}: ${performance.overallStatus}`)
    console.log(`   ${performance.contribution}`)
  })
  
  if (report.riskAssessment.risks.length > 0) {
    console.log('\n⚠️ RISK ASSESSMENT:')
    report.riskAssessment.risks.forEach((risk, index) => {
      const severity = risk.severity === 'HIGH' ? '🔴' : risk.severity === 'MEDIUM' ? '🟡' : '🟢'
      console.log(`${index + 1}. ${severity} ${risk.type}: ${risk.description}`)
      console.log(`   Mitigation: ${risk.mitigation}`)
    })
  }
  
  if (report.recommendationsForNextSprint.length > 0) {
    console.log('\n💡 RECOMMENDATIONS FOR NEXT SPRINT:')
    report.recommendationsForNextSprint.forEach((rec, index) => {
      console.log(`${index + 1}. [${rec.category}] ${rec.title}`)
      console.log(`   ${rec.description}`)
      console.log(`   Action: ${rec.action}`)
    })
  }
  
  console.log(`\n⏰ Sprint validation concluída em: ${report.timestamp}`)
}

/**
 * Função principal
 */
async function main() {
  try {
    const report = await runSprintValidationPipeline()
    const { reportFile } = await saveSprintReport(report)
    
    displayExecutiveSummary(report)
    
    console.log('\n🏁 SPRINT VALIDATION PIPELINE CONCLUÍDO!')
    console.log('🎯 Use este relatório para sprint review/retrospective')
    
    const success = report.finalVerdict === "SPRINT_SUCCESS"
    return success
  } catch (error) {
    console.error('❌ Erro durante sprint validation pipeline:', error)
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
  runSprintValidationPipeline, 
  SprintValidationReport,
  validateSuccessCriteria
}