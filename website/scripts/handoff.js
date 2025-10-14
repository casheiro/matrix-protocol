#!/usr/bin/env node

/**
 * CLI Script: Handoff
 * Gerencia transferência de work entre agents via Bash tool do Claude Code
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { AGENTS } from './agent-context.js'
import { updateExecutionLog } from './update-progress.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = resolve(__filename, '..')
const projectRoot = resolve(__dirname, '..')
const docsPath = resolve(projectRoot, 'docs/dynamic-navigation')

/**
 * Valida parâmetros do handoff
 */
function validateHandoffParams(fromAgent, toAgent, taskId) {
  const validAgents = Object.keys(AGENTS)
  
  if (!validAgents.includes(fromAgent.toLowerCase())) {
    throw new Error(`Agent origem inválido: ${fromAgent}. Válidos: ${validAgents.join(', ')}`)
  }
  
  if (!validAgents.includes(toAgent.toLowerCase())) {
    throw new Error(`Agent destino inválido: ${toAgent}. Válidos: ${validAgents.join(', ')}`)
  }
  
  if (fromAgent.toLowerCase() === toAgent.toLowerCase()) {
    throw new Error('Agent origem e destino não podem ser iguais')
  }
  
  if (!taskId || !taskId.startsWith('TASK_')) {
    throw new Error(`Task ID inválido: ${taskId}. Deve começar com 'TASK_'`)
  }
  
  return true
}

/**
 * Verifica se task está elegível para handoff
 */
function isTaskEligibleForHandoff(taskId, fromAgent) {
  try {
    const logPath = resolve(docsPath, 'EXECUTION_LOG.md')
    const content = readFileSync(logPath, 'utf-8')
    
    // Verificar se task foi completada pelo agent
    const completionRegex = new RegExp(`Task ${taskId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} .*? COMPLETED .*? ${fromAgent}`, 'i')
    const isCompleted = completionRegex.test(content)
    
    if (!isCompleted) {
      throw new Error(`Task ${taskId} não foi completada por ${fromAgent}`)
    }
    
    // Verificar se já não foi feito handoff
    const handoffRegex = new RegExp(`HANDOFF.*${taskId}`, 'i')
    const hasHandoff = handoffRegex.test(content)
    
    if (hasHandoff) {
      throw new Error(`Handoff já foi realizado para task ${taskId}`)
    }
    
    return true
  } catch (error) {
    if (error.message.includes('não foi completada') || error.message.includes('já foi realizado')) {
      throw error
    }
    // Se erro de leitura, assumir que é elegível
    console.warn(`⚠️ Não foi possível verificar elegibilidade: ${error.message}`)
    return true
  }
}

/**
 * Encontra próxima task para o agent destino
 */
function findNextTaskForAgent(agentKey) {
  try {
    // Import dinâmico para evitar dependência circular
    const { findNextTask } = require('./next-task.js')
    return findNextTask(agentKey)
  } catch (error) {
    console.warn(`⚠️ Não foi possível encontrar próxima task: ${error.message}`)
    return null
  }
}

/**
 * Gera entregáveis da task baseado no backlog
 */
function getTaskDeliverables(taskId) {
  try {
    const backlogPath = resolve(docsPath, 'BACKLOG_EXECUTABLE.md')
    const content = readFileSync(backlogPath, 'utf-8')
    
    // Parse básico para encontrar entregáveis
    const taskRegex = new RegExp(`\\*\\*TASK ${taskId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^*]*\\*\\*([\\s\\S]*?)(?=\\*\\*TASK|$)`, 'i')
    const match = content.match(taskRegex)
    
    if (match) {
      const taskSection = match[1]
      const entregavelMatch = taskSection.match(/\\*\\*Entregável\\*\\*:\\s*([^\\n]*)/i)
      
      return entregavelMatch ? [entregavelMatch[1].trim()] : [`Entregáveis da ${taskId}`]
    }
    
    return [`Entregáveis da ${taskId}`]
  } catch (error) {
    console.warn(`⚠️ Não foi possível obter entregáveis: ${error.message}`)
    return [`Entregáveis da ${taskId}`]
  }
}

/**
 * Registra handoff no execution log
 */
function logHandoffActivity(fromAgent, toAgent, taskId, artifacts) {
  const timestamp = new Date().toISOString()
  const fromAgentName = AGENTS[fromAgent.toLowerCase()].name
  const toAgentName = AGENTS[toAgent.toLowerCase()].name
  
  const activityEntry = `
### **${timestamp.split('T')[0]}**

#### **📤 HANDOFF - ${fromAgentName}**
\`\`\`markdown
## ATIVIDADE: HANDOFF ${taskId}
**Timestamp**: ${timestamp}
**From Agent**: ${fromAgentName}
**To Agent**: ${toAgentName}
**Task**: ${taskId}
**Action**: HANDOFF

### Detalhes:
Transferência de work da task ${taskId} de ${fromAgentName} para ${toAgentName}

### Artefatos Entregues:
${artifacts.map(artifact => `- ${artifact}`).join('\n')}

### Status:
- ${fromAgentName}: Liberado para próxima task
- ${toAgentName}: Deve verificar entregáveis e prosseguir
- Task ${taskId}: Handoff registrado
\`\`\`
`

  try {
    const logPath = resolve(docsPath, 'EXECUTION_LOG.md')
    let content = readFileSync(logPath, 'utf-8')
    
    // Inserir entry no histórico
    const historySection = '## 📝 **HISTÓRICO DE ATIVIDADES**'
    const historyIndex = content.indexOf(historySection)
    
    if (historyIndex !== -1) {
      const nextSectionIndex = content.indexOf('\n## ', historyIndex + historySection.length)
      const insertPoint = nextSectionIndex !== -1 ? nextSectionIndex : content.length
      
      content = content.slice(0, insertPoint) + activityEntry + '\n' + content.slice(insertPoint)
    } else {
      content += activityEntry
    }
    
    // Atualizar status dos agents
    content = updateAgentStatusInLog(content, fromAgent, null, 'READY')
    content = updateAgentStatusInLog(content, toAgent, taskId, 'READY') // Próxima task disponível
    
    writeFileSync(logPath, content, 'utf-8')
    return true
  } catch (error) {
    console.error(`❌ Erro ao registrar handoff: ${error.message}`)
    return false
  }
}

/**
 * Atualiza status do agent no log
 */
function updateAgentStatusInLog(content, agentKey, taskId, status) {
  const agentName = AGENTS[agentKey.toLowerCase()].name
  const agentSectionRegex = new RegExp(`(### \\*\\*🎯 ${agentName}[^\\n]*\\n[\\s\\S]*?)(?=### \\*\\*🎯|## 🚦|$)`)
  
  const agentMatch = content.match(agentSectionRegex)
  
  if (agentMatch) {
    let agentSection = agentMatch[1]
    
    // Atualizar current task
    if (taskId) {
      agentSection = agentSection.replace(
        /(\*\*Current Task\*\*:\s*).*/,
        `$1${taskId}`
      )
    } else {
      agentSection = agentSection.replace(
        /(\*\*Current Task\*\*:\s*).*/,
        `$1Nenhuma`
      )
    }
    
    // Atualizar status
    agentSection = agentSection.replace(
      /(\*\*Status\*\*:\s*)\w+/,
      `$1${status}`
    )
    
    // Atualizar last update
    agentSection = agentSection.replace(
      /(\*\*Last Update\*\*:\s*).*/,
      `$1${new Date().toISOString().split('T')[0]} - Handoff ${taskId ? 'recebido' : 'enviado'}`
    )
    
    return content.replace(agentSectionRegex, agentSection)
  }
  
  return content
}

/**
 * Formata mensagem de handoff
 */
function formatHandoffMessage(fromAgent, toAgent, taskId, artifacts, nextTask) {
  const fromAgentInfo = AGENTS[fromAgent.toLowerCase()]
  const toAgentInfo = AGENTS[toAgent.toLowerCase()]
  
  return `
# 📤 **HANDOFF EXECUTADO**

## **✅ TRANSFERÊNCIA COMPLETADA**
**Task**: ${taskId}
**De**: ${fromAgentInfo.name} (${fromAgentInfo.role})
**Para**: ${toAgentInfo.name} (${toAgentInfo.role})
**Timestamp**: ${new Date().toISOString()}

## **📦 ARTEFATOS ENTREGUES**
${artifacts.map(artifact => `- ${artifact}`).join('\n')}

## **📋 PARA ${toAgentInfo.name.toUpperCase()}**
### **🎯 PRÓXIMAS AÇÕES SUGERIDAS**
1. **Verificar entregáveis** da task ${taskId}
2. **Validar qualidade** dos artefatos recebidos
3. **Prosseguir** com suas responsabilidades relacionadas

${nextTask ? `
### **⚡ SUA PRÓXIMA TASK DISPONÍVEL**
**ID**: ${nextTask.id}
**Título**: ${nextTask.title}
**Comando**: \`node scripts/next-task.js ${toAgent.toLowerCase()}\`
` : `
### **📊 VERIFICAR QUEUE**
Use: \`node scripts/next-task.js ${toAgent.toLowerCase()}\`
`}

## **📋 PARA ${fromAgentInfo.name.toUpperCase()}**
### **✅ STATUS ATUALIZADO**
- Task ${taskId} oficialmente transferida
- Status: READY para próxima task
- Queue: Verificar próximas atribuições

### **🔄 PRÓXIMA AÇÃO**
Use: \`node scripts/next-task.js ${fromAgent.toLowerCase()}\`

## **📊 COMANDOS ÚTEIS**
- **Ver dashboard**: \`node scripts/dashboard.js\`
- **Status do projeto**: \`node scripts/dashboard.js technical\`
- **Todas as tasks**: \`node scripts/next-task.js all\`

---
**🎯 OBJETIVO**: Implementar navegação dinâmica que autodescobra estrutura do \`/content\`
**🕐 Handoff registrado em**: ${new Date().toLocaleString('pt-BR')}
`
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2)
  
  if (args.length < 3) {
    console.log('❌ Uso: node scripts/handoff.js <fromAgent> <toAgent> <taskId>')
    console.log('')
    console.log('👥 **Agents disponíveis**:')
    Object.entries(AGENTS).forEach(([key, agent]) => {
      console.log(`  ${key.padEnd(8)} - ${agent.name} (${agent.role})`)
    })
    console.log('')
    console.log('💡 **Exemplos**:')
    console.log('  node scripts/handoff.js ricardo bruno TASK_1.1.1')
    console.log('  node scripts/handoff.js alex marina TASK_2.1.2')
    console.log('  node scripts/handoff.js bruno camila TASK_1.2.4')
    console.log('')
    console.log('📋 **Pré-requisitos**:')
    console.log('  - Task deve estar marcada como COMPLETED pelo agent origem')
    console.log('  - Handoff não pode ter sido feito anteriormente')
    console.log('  - Agents devem ser válidos')
    process.exit(1)
  }
  
  const [fromAgent, toAgent, taskId] = args
  
  try {
    // Validar parâmetros
    validateHandoffParams(fromAgent, toAgent, taskId)
    
    // Verificar se task é elegível para handoff
    isTaskEligibleForHandoff(taskId, fromAgent)
    
    // Obter artefatos da task
    const artifacts = getTaskDeliverables(taskId)
    
    // Encontrar próxima task para agent destino
    const nextTask = findNextTaskForAgent(toAgent.toLowerCase())
    
    // Registrar handoff no execution log
    const logSuccess = logHandoffActivity(fromAgent, toAgent, taskId, artifacts)
    
    if (!logSuccess) {
      throw new Error('Falha ao registrar handoff no execution log')
    }
    
    // Gerar mensagem de handoff
    const message = formatHandoffMessage(fromAgent, toAgent, taskId, artifacts, nextTask)
    
    console.log(message)
    
  } catch (error) {
    console.error(`❌ ${error.message}`)
    console.log('')
    console.log('🔍 **Verificações sugeridas**:')
    console.log('  1. Confirmar que task foi marcada como COMPLETED')
    console.log('  2. Verificar spelling dos nomes dos agents')
    console.log('  3. Consultar execution log para status atual')
    console.log('  4. Usar: `node scripts/dashboard.js` para visão geral')
    process.exit(1)
  }
}

// Executar se script for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { validateHandoffParams, isTaskEligibleForHandoff, logHandoffActivity }