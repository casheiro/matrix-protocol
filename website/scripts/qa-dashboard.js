#!/usr/bin/env node
/**
 * 📊 QA DASHBOARD - CAMILA RODRIGUEZ
 * 
 * MILESTONE 1.4 PREP: Dashboard único para validação da Sprint 1
 * QA Engineer: Camila Rodriguez
 * 
 * Comando único que executa toda a suite de validação e 
 * exibe dashboard consolidado do status da sprint.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { runSprintValidationPipeline } from './sprint-validation-pipeline.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Cores para output no terminal
 */
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
}

/**
 * Exibe header do dashboard
 */
function displayDashboardHeader() {
  console.log(colors.cyan + '╔══════════════════════════════════════════════════════════════╗' + colors.reset)
  console.log(colors.cyan + '║' + colors.white + '                     🤖 QA DASHBOARD                          ' + colors.cyan + '║' + colors.reset)
  console.log(colors.cyan + '║' + colors.white + '                  CAMILA RODRIGUEZ                            ' + colors.cyan + '║' + colors.reset)
  console.log(colors.cyan + '║' + colors.white + '             MILESTONE 1.4 PREP COMPLETE                     ' + colors.cyan + '║' + colors.reset)
  console.log(colors.cyan + '╚══════════════════════════════════════════════════════════════╝' + colors.reset)
  console.log()
}

/**
 * Exibe status dos bloqueadores com barra de progresso
 */
function displayBlockerProgress(current, baseline) {
  const resolved = baseline - current
  const percentage = Math.round((resolved / baseline) * 100)
  const barLength = 20
  const filledBars = Math.round((percentage / 100) * barLength)
  const emptyBars = barLength - filledBars
  
  const progressBar = colors.green + '█'.repeat(filledBars) + colors.red + '░'.repeat(emptyBars) + colors.reset
  
  console.log(colors.yellow + '📊 BLOCKER PROGRESS' + colors.reset)
  console.log(`${progressBar} ${percentage}%`)
  console.log(`Resolvidos: ${colors.green}${resolved}/${baseline}${colors.reset} | Pendentes: ${colors.red}${current}${colors.reset}`)
  console.log()
}

/**
 * Exibe status dos Quality Gates de forma visual
 */
function displayQualityGatesVisual(qualityGates) {
  console.log(colors.yellow + '🚪 QUALITY GATES STATUS' + colors.reset)
  
  Object.entries(qualityGates).forEach(([gateId, gate]) => {
    const status = gate.status === 'PASSED' ? 
      colors.green + '✅ PASSED' : 
      gate.status === 'PENDING' ? 
        colors.yellow + '⏳ PENDING' : 
        colors.red + '❌ FAILED'
    
    console.log(`${status}${colors.reset} ${gate.name}`)
    
    if (gate.blockers !== null && gate.blockers > 0) {
      console.log(`   ${colors.red}└─ Bloqueadores: ${gate.blockers}${colors.reset}`)
    }
  })
  console.log()
}

/**
 * Exibe performance da equipe
 */
function displayTeamPerformance(teamPerformance) {
  console.log(colors.yellow + '👥 TEAM PERFORMANCE' + colors.reset)
  
  Object.entries(teamPerformance).forEach(([member, performance]) => {
    const status = performance.overallStatus === 'COMPLETED' ? 
      colors.green + '✅' : 
      colors.yellow + '🔄'
    
    console.log(`${status} ${colors.white}${member.toUpperCase()}${colors.reset}: ${performance.overallStatus}`)
    console.log(`   ${colors.cyan}${performance.contribution}${colors.reset}`)
    
    // Detalhes específicos por membro
    if (member === 'bruno' && performance.ptFilesRemaining > 0) {
      console.log(`   ${colors.yellow}└─ PT files pendentes: ${performance.ptFilesRemaining}${colors.reset}`)
    }
    if (member === 'marina' && performance.enFilesRemaining > 0) {
      console.log(`   ${colors.yellow}└─ EN files pendentes: ${performance.enFilesRemaining}${colors.reset}`)
    }
  })
  console.log()
}

/**
 * Exibe veredicto final com cores
 */
function displayFinalVerdict(verdict, confidenceLevel) {
  console.log(colors.yellow + '⚖️ FINAL VERDICT' + colors.reset)
  
  let verdictColor = colors.green
  let verdictIcon = '🎉'
  let verdictText = verdict
  
  switch(verdict) {
    case 'SPRINT_SUCCESS':
      verdictColor = colors.green
      verdictIcon = '🎉'
      verdictText = 'SPRINT SUCCESS'
      break
    case 'SPRINT_NEAR_SUCCESS':
      verdictColor = colors.yellow
      verdictIcon = '⚡'
      verdictText = 'SPRINT NEAR SUCCESS'
      break
    case 'SPRINT_PARTIAL_SUCCESS':
      verdictColor = colors.yellow
      verdictIcon = '⚠️'
      verdictText = 'SPRINT PARTIAL SUCCESS'
      break
    case 'SPRINT_NEEDS_WORK':
      verdictColor = colors.red
      verdictIcon = '🔧'
      verdictText = 'SPRINT NEEDS WORK'
      break
  }
  
  console.log(`${verdictIcon} ${verdictColor}${verdictText}${colors.reset}`)
  console.log(`📊 Confidence Level: ${confidenceLevel >= 80 ? colors.green : confidenceLevel >= 60 ? colors.yellow : colors.red}${confidenceLevel}%${colors.reset}`)
  console.log()
}

/**
 * Exibe comandos disponíveis
 */
function displayAvailableCommands() {
  console.log(colors.yellow + '🔧 AVAILABLE COMMANDS' + colors.reset)
  console.log(`${colors.cyan}node scripts/content-audit.js${colors.reset}           # Auditoria base (Ricardo)`)
  console.log(`${colors.cyan}node scripts/validation-automation.js${colors.reset}   # Validação automática`)
  console.log(`${colors.cyan}node scripts/sprint-validation-pipeline.js${colors.reset} # Pipeline completo`)
  console.log(`${colors.cyan}node scripts/qa-dashboard.js${colors.reset}            # Este dashboard`)
  console.log()
}

/**
 * Exibe próximos passos baseados no status
 */
function displayNextSteps(nextSteps, verdict) {
  console.log(colors.yellow + '🔄 NEXT STEPS' + colors.reset)
  
  if (verdict === 'SPRINT_SUCCESS') {
    console.log(colors.green + '🎉 Sprint concluída com sucesso!' + colors.reset)
    console.log(`${colors.green}✅${colors.reset} Executar sprint retrospective`)
    console.log(`${colors.green}✅${colors.reset} Documentar lessons learned`)
    console.log(`${colors.green}✅${colors.reset} Planejar próxima sprint`)
  } else {
    nextSteps.forEach((step, index) => {
      const priority = step.includes('URGENT') ? colors.red : 
                      step.includes('FOCUS') ? colors.yellow : 
                      colors.cyan
      console.log(`${index + 1}. ${priority}${step}${colors.reset}`)
    })
  }
  console.log()
}

/**
 * Exibe footer com informações de contato
 */
function displayDashboardFooter() {
  console.log(colors.cyan + '╔══════════════════════════════════════════════════════════════╗' + colors.reset)
  console.log(colors.cyan + '║' + colors.white + '  🤖 QA Engineer: Camila Rodriguez                           ' + colors.cyan + '║' + colors.reset)
  console.log(colors.cyan + '║' + colors.white + '  📧 Contact: Sprint issues → Escalate to team                ' + colors.cyan + '║' + colors.reset)
  console.log(colors.cyan + '║' + colors.white + '  🔄 Auto-refresh: Re-run after each file creation            ' + colors.cyan + '║' + colors.reset)
  console.log(colors.cyan + '╚══════════════════════════════════════════════════════════════╝' + colors.reset)
}

/**
 * Executa dashboard completo
 */
async function runQADashboard() {
  try {
    displayDashboardHeader()
    
    console.log(colors.magenta + '🔄 Executando validação completa da Sprint 1...' + colors.reset)
    console.log()
    
    // Executar pipeline de validação
    const report = await runSprintValidationPipeline()
    
    // Exibir dashboard visual
    displayBlockerProgress(
      report.successCriteria.zeroBlockers.actual,
      19 // baseline
    )
    
    displayQualityGatesVisual(report.qualityGatesStatus)
    
    displayTeamPerformance(report.teamPerformance)
    
    displayFinalVerdict(report.finalVerdict, report.confidenceLevel)
    
    displayNextSteps(report.recommendationsForNextSprint.map(r => r.action), report.finalVerdict)
    
    displayAvailableCommands()
    
    displayDashboardFooter()
    
    return report.finalVerdict === "SPRINT_SUCCESS"
    
  } catch (error) {
    console.error(colors.red + '❌ Erro no QA Dashboard:' + colors.reset, error)
    return false
  }
}

/**
 * Função principal
 */
async function main() {
  const success = await runQADashboard()
  process.exit(success ? 0 : 1)
}

// Verificar se foi chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { runQADashboard }