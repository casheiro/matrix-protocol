#!/usr/bin/env node

/**
 * CLI Script: Update Progress
 * Atualiza EXECUTION_LOG.md automaticamente via Bash tool do Claude Code
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = resolve(__filename, '..')
const projectRoot = resolve(__dirname, '..')
const docsPath = resolve(projectRoot, 'docs/dynamic-navigation/02-execution')
const logPath = resolve(docsPath, 'EXECUTION_LOG.md')

/**
 * Valida parâmetros de entrada
 */
function validateParams(taskId, status, agentName) {
  const validStatuses = ['TODO', 'IN_PROGRESS', 'BLOCKED', 'REVIEW', 'COMPLETED']
  const validAgents = ['alex', 'marina', 'ricardo', 'camila', 'bruno']
  
  if (!taskId || !taskId.startsWith('TASK_')) {
    throw new Error(`Task ID inválido: ${taskId}. Deve começar com 'TASK_'`)
  }
  
  if (!validStatuses.includes(status)) {
    throw new Error(`Status inválido: ${status}. Válidos: ${validStatuses.join(', ')}`)
  }
  
  if (!validAgents.includes(agentName.toLowerCase())) {
    throw new Error(`Agent inválido: ${agentName}. Válidos: ${validAgents.join(', ')}`)
  }
  
  return true
}

/**
 * Mapeia agent name para nome completo
 */
function getAgentFullName(agentKey) {
  const agentMap = {
    'alex': 'Alex Santos',
    'marina': 'Marina Costa',
    'ricardo': 'Ricardo Lima', 
    'camila': 'Camila Rodriguez',
    'bruno': 'Bruno Oliveira'
  }
  
  return agentMap[agentKey.toLowerCase()] || agentKey
}

/**
 * Gera entry de atividade formatada
 */
function generateActivityEntry(taskId, status, agentName, timestamp) {
  const date = timestamp.split('T')[0]
  const time = timestamp.split('T')[1].split('.')[0]
  const fullAgentName = getAgentFullName(agentName)
  
  let action = ''
  let icon = ''
  
  switch (status) {
    case 'IN_PROGRESS':
      action = 'TASK_START'
      icon = '🚀'
      break
    case 'COMPLETED':
      action = 'TASK_COMPLETE'
      icon = '✅'
      break
    case 'BLOCKED':
      action = 'TASK_BLOCKED'
      icon = '🚨'
      break
    default:
      action = 'TASK_UPDATE'
      icon = '🔄'
  }

  return `
### **${date}**

#### **${icon} ${action} - ${fullAgentName}**
\`\`\`markdown
## ATIVIDADE: ${taskId}
**Timestamp**: ${timestamp}
**Agent**: ${fullAgentName}
**Action**: ${action}
**Status**: ${status}

### Detalhes:
Task ${taskId} atualizada para ${status} por ${fullAgentName}

### Context:
- Agent: ${fullAgentName} (${agentName})
- Task: ${taskId}
- Novo Status: ${status}
- Timestamp: ${time}
\`\`\`
`
}

/**
 * Atualiza seção do agent no log
 */
function updateAgentSection(content, agentName, taskId, status) {
  const fullAgentName = getAgentFullName(agentName)
  const agentSectionRegex = new RegExp(`(### \\*\\*🎯 ${fullAgentName}[^\\n]*\\n[\\s\\S]*?)(?=### \\*\\*🎯|## 🚦|$)`)
  
  const agentMatch = content.match(agentSectionRegex)
  
  if (agentMatch) {
    let agentSection = agentMatch[1]
    
    // Atualizar current task
    if (status === 'IN_PROGRESS') {
      agentSection = agentSection.replace(
        /(\*\*Current Task\*\*:\s*).*/,
        `$1${taskId}`
      )
    } else if (status === 'COMPLETED') {
      agentSection = agentSection.replace(
        /(\*\*Current Task\*\*:\s*).*/,
        `$1Nenhuma`
      )
    }
    
    // Atualizar last update
    agentSection = agentSection.replace(
      /(\*\*Last Update\*\*:\s*).*/,
      `$1${new Date().toISOString().split('T')[0]} - ${taskId} ${status}`
    )
    
    // Atualizar status se bloqueado
    if (status === 'BLOCKED') {
      agentSection = agentSection.replace(
        /(\*\*Status\*\*:\s*)\w+/,
        `$1BLOCKED`
      )
    } else if (status === 'COMPLETED') {
      agentSection = agentSection.replace(
        /(\*\*Status\*\*:\s*)\w+/,
        `$1READY`
      )
    } else if (status === 'IN_PROGRESS') {
      agentSection = agentSection.replace(
        /(\*\*Status\*\*:\s*)\w+/,
        `$1IN_PROGRESS`
      )
    }
    
    return content.replace(agentSectionRegex, agentSection)
  }
  
  return content
}

/**
 * Atualiza métricas do projeto
 */
function updateProjectMetrics(content, status) {
  if (status === 'COMPLETED') {
    // Incrementar tasks completadas
    content = content.replace(
      /(\*\*Tasks\*\*:\s*)(\d+)(\/\d+ completadas)/,
      (match, prefix, completed, suffix) => {
        const newCompleted = parseInt(completed) + 1
        return `${prefix}${newCompleted}${suffix}`
      }
    )
    
    // Atualizar progress percentage se encontrado
    content = content.replace(
      /(\*\*Progresso\*\*:\s*)(\d+)(%)/,
      (match, prefix, percentage, suffix) => {
        // Calcular novo percentage baseado em 24 tasks total
        const tasksCompleted = content.match(/\*\*Tasks\*\*:\s*(\d+)\/24/)?.[1] || '0'
        const newPercentage = Math.round((parseInt(tasksCompleted) / 24) * 100)
        return `${prefix}${newPercentage}${suffix}`
      }
    )
  }
  
  return content
}

/**
 * Atualiza execution log
 */
function updateExecutionLog(taskId, status, agentName) {
  try {
    // Ler arquivo atual
    let content = readFileSync(logPath, 'utf-8')
    
    // Gerar timestamp
    const timestamp = new Date().toISOString()
    
    // Gerar entry de atividade
    const activityEntry = generateActivityEntry(taskId, status, agentName, timestamp)
    
    // Inserir entry no histórico de atividades
    const historySection = '## 📝 **HISTÓRICO DE ATIVIDADES**'
    const historyIndex = content.indexOf(historySection)
    
    if (historyIndex !== -1) {
      // Encontrar próxima seção após histórico
      const nextSectionIndex = content.indexOf('\n## ', historyIndex + historySection.length)
      const insertPoint = nextSectionIndex !== -1 ? nextSectionIndex : content.length
      
      content = content.slice(0, insertPoint) + activityEntry + '\n' + content.slice(insertPoint)
    } else {
      // Se não encontrar seção de histórico, adicionar no final
      content += activityEntry
    }
    
    // Atualizar seção do agent
    content = updateAgentSection(content, agentName, taskId, status)
    
    // Atualizar métricas do projeto
    content = updateProjectMetrics(content, status)
    
    // Atualizar timestamp de última atualização
    content = content.replace(
      /(\*\*📍 Status\*\*:.*?\n\*\*🔄 Última Atualização\*\*:\s*)[^\n]*/,
      `$1${timestamp.split('T')[0]}T${timestamp.split('T')[1].split('.')[0]}Z`
    )
    
    // Salvar arquivo
    writeFileSync(logPath, content, 'utf-8')
    
    return {
      success: true,
      message: `✅ Task ${taskId} atualizada para ${status} por ${getAgentFullName(agentName)}`,
      timestamp
    }
    
  } catch (error) {
    return {
      success: false,
      message: `❌ Erro ao atualizar log: ${error.message}`,
      error: error.message
    }
  }
}

/**
 * Gera próximas ações sugeridas baseado no status
 */
function generateNextActions(taskId, status, agentName) {
  const suggestions = []
  
  if (status === 'COMPLETED') {
    suggestions.push(`🎯 ${getAgentFullName(agentName)}: Verificar próxima task disponível`)
    suggestions.push(`📤 Executar handoff se necessário: \`node scripts/handoff.js ${agentName} [next-agent] ${taskId}\``)
    suggestions.push(`📊 Ver dashboard atualizado: \`node scripts/dashboard.js\``)
  } else if (status === 'BLOCKED') {
    suggestions.push(`🚨 ${getAgentFullName(agentName)}: Resolver bloqueio da task ${taskId}`)
    suggestions.push(`📞 Escalar para líder técnico se necessário`)
  } else if (status === 'IN_PROGRESS') {
    suggestions.push(`⚡ ${getAgentFullName(agentName)}: Executar task ${taskId} usando ferramentas MCP`)
    suggestions.push(`📝 Atualizar progresso quando necessário`)
  }
  
  return suggestions
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2)
  
  if (args.length < 3) {
    console.log('❌ Uso: node scripts/update-progress.js <taskId> <status> <agentName>')
    console.log('📋 Status válidos: TODO, IN_PROGRESS, BLOCKED, REVIEW, COMPLETED')
    console.log('👥 Agents válidos: alex, marina, ricardo, camila, bruno')
    console.log('')
    console.log('💡 Exemplos:')
    console.log('  node scripts/update-progress.js TASK_1.1.1 IN_PROGRESS ricardo')
    console.log('  node scripts/update-progress.js TASK_1.1.1 COMPLETED ricardo')
    console.log('  node scripts/update-progress.js TASK_2.1.1 BLOCKED marina')
    process.exit(1)
  }
  
  const [taskId, status, agentName] = args
  
  try {
    // Validar parâmetros
    validateParams(taskId, status, agentName)
    
    // Atualizar log
    const result = updateExecutionLog(taskId, status, agentName)
    
    if (result.success) {
      console.log(result.message)
      console.log(`🕐 Timestamp: ${result.timestamp}`)
      
      // Mostrar próximas ações sugeridas
      const nextActions = generateNextActions(taskId, status, agentName)
      if (nextActions.length > 0) {
        console.log('\n🎯 **PRÓXIMAS AÇÕES SUGERIDAS:**')
        nextActions.forEach(action => console.log(`  ${action}`))
      }
      
      console.log('\n📊 Ver status atualizado: `node scripts/dashboard.js`')
    } else {
      console.error(result.message)
      process.exit(1)
    }
    
  } catch (error) {
    console.error(`❌ ${error.message}`)
    process.exit(1)
  }
}

// Executar se script for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { updateExecutionLog, validateParams, generateActivityEntry }