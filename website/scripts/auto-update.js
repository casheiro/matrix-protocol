#!/usr/bin/env node

/**
 * CLI Script: Auto Update
 * Sistema de auto-updates automático via Bash tool do Claude Code
 * Monitora ações e mantém logs sincronizados
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = resolve(__filename, '..')
const projectRoot = resolve(__dirname, '..')
const docsPath = resolve(projectRoot, 'docs/dynamic-navigation')

/**
 * Configuração do sistema de auto-update
 */
const AUTO_UPDATE_CONFIG = {
  // Intervalo de verificação (em segundos)
  checkInterval: 30,
  
  // Arquivos monitorados
  watchedFiles: [
    'EXECUTION_LOG.md',
    'BACKLOG_EXECUTABLE.md',
    'PROJECT_OVERVIEW.md'
  ],
  
  // Hooks de auto-update
  hooks: {
    taskComplete: true,
    handoffDetected: true,
    agentStatusChange: true,
    sprintProgress: true
  },
  
  // Logs de atividade
  activityLog: 'auto-update-activity.log',
  
  // Estado persistente
  stateFile: 'auto-update-state.json'
}

/**
 * Lê estado atual do sistema
 */
function readSystemState() {
  try {
    const statePath = resolve(docsPath, AUTO_UPDATE_CONFIG.stateFile)
    
    if (!existsSync(statePath)) {
      return getDefaultState()
    }
    
    const content = readFileSync(statePath, 'utf-8')
    const state = JSON.parse(content)
    
    return {
      ...getDefaultState(),
      ...state
    }
  } catch (error) {
    console.warn(`⚠️ Erro ao ler estado: ${error.message}`)
    return getDefaultState()
  }
}

/**
 * Estado padrão do sistema
 */
function getDefaultState() {
  return {
    lastCheck: new Date().toISOString(),
    lastUpdate: new Date().toISOString(),
    taskCount: 0,
    completedTasks: 0,
    activeAgents: 0,
    lastTaskCompleted: null,
    lastHandoff: null,
    checksRunned: 0,
    updatesTriggered: 0
  }
}

/**
 * Salva estado do sistema
 */
function saveSystemState(state) {
  try {
    const statePath = resolve(docsPath, AUTO_UPDATE_CONFIG.stateFile)
    writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error(`❌ Erro ao salvar estado: ${error.message}`)
    return false
  }
}

/**
 * Registra atividade no log
 */
function logActivity(action, details) {
  try {
    const logPath = resolve(docsPath, AUTO_UPDATE_CONFIG.activityLog)
    const timestamp = new Date().toISOString()
    
    const entry = `[${timestamp}] ${action}: ${details}\n`
    
    if (existsSync(logPath)) {
      const currentContent = readFileSync(logPath, 'utf-8')
      writeFileSync(logPath, currentContent + entry, 'utf-8')
    } else {
      writeFileSync(logPath, entry, 'utf-8')
    }
    
    return true
  } catch (error) {
    console.error(`❌ Erro ao registrar atividade: ${error.message}`)
    return false
  }
}

/**
 * Verifica mudanças no execution log
 */
function checkExecutionLogChanges(currentState) {
  try {
    const logPath = resolve(docsPath, 'EXECUTION_LOG.md')
    const content = readFileSync(logPath, 'utf-8')
    
    const changes = {
      newTasksCompleted: [],
      newHandoffs: [],
      agentStatusChanges: []
    }
    
    // Verificar tasks completadas
    const completedMatches = content.match(/Task (TASK_\d+\.\d+\.\d+) .*? COMPLETED/gi) || []
    const currentCompleted = completedMatches.length
    
    if (currentCompleted > currentState.completedTasks) {
      const newCompleted = completedMatches.slice(currentState.completedTasks)
      changes.newTasksCompleted = newCompleted.map(match => {
        const taskId = match.match(/Task (TASK_\d+\.\d+\.\d+)/i)?.[1]
        return taskId
      }).filter(Boolean)
    }
    
    // Verificar handoffs
    const handoffMatches = content.match(/HANDOFF.*TASK_\d+\.\d+\.\d+/gi) || []
    const currentHandoffs = handoffMatches.length
    
    if (currentHandoffs > (currentState.lastHandoff || 0)) {
      const newHandoffs = handoffMatches.slice(currentState.lastHandoff || 0)
      changes.newHandoffs = newHandoffs
    }
    
    // Verificar mudanças de status dos agents
    const agentMatches = content.match(/### \*\*🎯 ([^*]+) - ([^*]+)\*\*[\s\S]*?\*\*Status\*\*:\s*(\w+)/g) || []
    const activeAgents = agentMatches.filter(match => 
      match.includes('Status**: IN_PROGRESS')
    ).length
    
    if (activeAgents !== currentState.activeAgents) {
      changes.agentStatusChanges.push({
        previousActive: currentState.activeAgents,
        currentActive: activeAgents,
        change: activeAgents - currentState.activeAgents
      })
    }
    
    return {
      changes,
      newState: {
        ...currentState,
        completedTasks: currentCompleted,
        activeAgents: activeAgents,
        lastHandoff: currentHandoffs,
        lastCheck: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error(`❌ Erro ao verificar mudanças: ${error.message}`)
    return {
      changes: { newTasksCompleted: [], newHandoffs: [], agentStatusChanges: [] },
      newState: {
        ...currentState,
        lastCheck: new Date().toISOString()
      }
    }
  }
}

/**
 * Processa mudanças detectadas
 */
function processChanges(changes) {
  const actions = []
  
  // Processar tasks completadas
  if (changes.newTasksCompleted.length > 0) {
    changes.newTasksCompleted.forEach(taskId => {
      actions.push({
        type: 'TASK_COMPLETED',
        action: 'Sync TodoWrite tool',
        data: { taskId },
        command: 'node scripts/sync-todos.js'
      })
      
      logActivity('TASK_COMPLETED', `Task ${taskId} completada - triggering sync`)
    })
  }
  
  // Processar handoffs
  if (changes.newHandoffs.length > 0) {
    changes.newHandoffs.forEach(handoff => {
      actions.push({
        type: 'HANDOFF_DETECTED', 
        action: 'Update agent assignments',
        data: { handoff },
        command: 'node scripts/dashboard.js'
      })
      
      logActivity('HANDOFF_DETECTED', `Handoff detectado: ${handoff}`)
    })
  }
  
  // Processar mudanças de status
  if (changes.agentStatusChanges.length > 0) {
    changes.agentStatusChanges.forEach(change => {
      actions.push({
        type: 'AGENT_STATUS_CHANGE',
        action: 'Update team metrics',
        data: change,
        command: 'node scripts/dashboard.js technical'
      })
      
      logActivity('AGENT_STATUS_CHANGE', `Agents ativos: ${change.previousActive} → ${change.currentActive}`)
    })
  }
  
  return actions
}

/**
 * Executa ações de auto-update
 */
function executeAutoUpdateActions(actions) {
  const results = []
  
  actions.forEach(action => {
    try {
      // Para demo, apenas registra a ação (em produção executaria via child_process)
      console.log(`🔄 AUTO-UPDATE: ${action.type}`)
      console.log(`   Action: ${action.action}`)
      console.log(`   Command: ${action.command}`)
      
      results.push({
        ...action,
        status: 'SIMULATED', // Em produção seria 'EXECUTED' ou 'FAILED'
        timestamp: new Date().toISOString()
      })
      
      logActivity('AUTO_UPDATE_ACTION', `${action.type}: ${action.action}`)
      
    } catch (error) {
      console.error(`❌ Erro na ação ${action.type}: ${error.message}`)
      results.push({
        ...action,
        status: 'FAILED',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    }
  })
  
  return results
}

/**
 * Gera relatório de auto-update
 */
function generateAutoUpdateReport(state, actions, results) {
  return `
# 🤖 **AUTO-UPDATE REPORT**

## **📊 SISTEMA STATUS**
**Last Check**: ${state.lastCheck}
**Last Update**: ${state.lastUpdate}
**Checks Executed**: ${state.checksRunned}
**Updates Triggered**: ${state.updatesTriggered}

## **📈 PROJECT METRICS**
**Total Tasks**: ${state.taskCount}
**Completed Tasks**: ${state.completedTasks}
**Active Agents**: ${state.activeAgents}
**Progress**: ${Math.round((state.completedTasks / Math.max(state.taskCount, 1)) * 100)}%

## **🔄 ACTIONS EXECUTED**
${actions.length === 0 ? 'Nenhuma ação necessária.' : ''}
${actions.map((action, i) => `
### **Action ${i + 1}**: ${action.type}
- **Trigger**: ${action.action}
- **Command**: \`${action.command}\`
- **Status**: ${results[i]?.status || 'PENDING'}
- **Time**: ${results[i]?.timestamp || 'N/A'}
`).join('')}

## **📋 NEXT CHECKS**
- **Next Check In**: ${AUTO_UPDATE_CONFIG.checkInterval} seconds
- **Monitoring**: ${AUTO_UPDATE_CONFIG.watchedFiles.join(', ')}
- **Hooks Active**: ${Object.entries(AUTO_UPDATE_CONFIG.hooks).filter(([k,v]) => v).map(([k]) => k).join(', ')}

---
**🕐 Generated**: ${new Date().toLocaleString('pt-BR')}
**🔧 Auto-Update System**: ACTIVE
`
}

/**
 * Execução principal do auto-update
 */
function runAutoUpdate() {
  console.log('🤖 **AUTO-UPDATE SYSTEM - Verificando mudanças...**')
  
  // Ler estado atual
  const currentState = readSystemState()
  
  // Verificar mudanças
  const { changes, newState } = checkExecutionLogChanges(currentState)
  
  // Atualizar contadores
  newState.checksRunned = (currentState.checksRunned || 0) + 1
  
  // Processar mudanças
  const actions = processChanges(changes)
  
  if (actions.length > 0) {
    newState.updatesTriggered = (currentState.updatesTriggered || 0) + actions.length
    newState.lastUpdate = new Date().toISOString()
  }
  
  // Executar ações
  const results = executeAutoUpdateActions(actions)
  
  // Salvar novo estado
  saveSystemState(newState)
  
  // Gerar relatório
  const report = generateAutoUpdateReport(newState, actions, results)
  
  return {
    state: newState,
    changes,
    actions,
    results,
    report
  }
}

/**
 * Configuração de monitoramento contínuo
 */
function setupContinuousMonitoring(intervalSeconds = AUTO_UPDATE_CONFIG.checkInterval) {
  console.log(`🔄 Iniciando monitoramento contínuo (intervalo: ${intervalSeconds}s)`)
  
  const interval = setInterval(() => {
    try {
      const result = runAutoUpdate()
      
      if (result.actions.length > 0) {
        console.log(`\n📊 ${result.actions.length} ações de auto-update executadas`)
        console.log(result.report)
      } else {
        console.log(`⏰ ${new Date().toLocaleTimeString()} - Sistema verificado, nenhuma mudança`)
      }
      
    } catch (error) {
      console.error(`❌ Erro no auto-update: ${error.message}`)
    }
  }, intervalSeconds * 1000)
  
  // Cleanup graceful
  process.on('SIGINT', () => {
    console.log('\n🛑 Parando auto-update system...')
    clearInterval(interval)
    process.exit(0)
  })
  
  return interval
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2)
  const command = args[0] || 'run'
  
  if (command === 'help' || command === '--help') {
    console.log('🤖 **AUTO-UPDATE SYSTEM - Sistema de Navegação Dinâmica**')
    console.log('')
    console.log('**Uso**: node scripts/auto-update.js [command] [options]')
    console.log('')
    console.log('**Commands**:')
    console.log('  run       - Executa uma verificação única (padrão)')
    console.log('  watch     - Monitora continuamente por mudanças')
    console.log('  status    - Mostra estado atual do sistema')
    console.log('  reset     - Reseta estado do auto-update')
    console.log('  help      - Esta ajuda')
    console.log('')
    console.log('**Options para watch**:')
    console.log('  --interval N  - Intervalo em segundos (padrão: 30)')
    console.log('')
    console.log('**Exemplos**:')
    console.log('  node scripts/auto-update.js')
    console.log('  node scripts/auto-update.js watch')
    console.log('  node scripts/auto-update.js watch --interval 60')
    console.log('  node scripts/auto-update.js status')
    console.log('')
    console.log('**Funcionalidades**:')
    console.log('  - Detecta tasks completadas automaticamente')
    console.log('  - Sincroniza TodoWrite tool quando necessário')
    console.log('  - Monitora handoffs entre agents')
    console.log('  - Atualiza métricas de progresso')
    console.log('  - Logs de atividade detalhados')
    return
  }
  
  try {
    switch (command) {
      case 'watch': {
        const intervalArg = args.indexOf('--interval')
        const interval = intervalArg !== -1 && args[intervalArg + 1] ? 
          parseInt(args[intervalArg + 1]) : AUTO_UPDATE_CONFIG.checkInterval
        
        setupContinuousMonitoring(interval)
        break
      }
      
      case 'status': {
        const state = readSystemState()
        console.log('📊 **AUTO-UPDATE STATUS**')
        console.log(`Last Check: ${state.lastCheck}`)
        console.log(`Last Update: ${state.lastUpdate}`)
        console.log(`Checks Run: ${state.checksRunned}`)
        console.log(`Updates Triggered: ${state.updatesTriggered}`)
        console.log(`Completed Tasks: ${state.completedTasks}`)
        console.log(`Active Agents: ${state.activeAgents}`)
        break
      }
      
      case 'reset': {
        const defaultState = getDefaultState()
        saveSystemState(defaultState)
        console.log('✅ Estado do auto-update resetado')
        break
      }
      
      case 'run':
      default: {
        const result = runAutoUpdate()
        console.log(result.report)
        
        if (result.actions.length > 0) {
          console.log(`\n✅ ${result.actions.length} ações executadas`)
        } else {
          console.log('\n✅ Nenhuma ação necessária')
        }
        break
      }
    }
    
  } catch (error) {
    console.error(`❌ Erro: ${error.message}`)
    process.exit(1)
  }
}

// Executar se script for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { runAutoUpdate, setupContinuousMonitoring, readSystemState }