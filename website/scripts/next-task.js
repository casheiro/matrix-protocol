#!/usr/bin/env node

/**
 * CLI Script: Next Task
 * Encontra próxima task disponível para um agent via Bash tool do Claude Code
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { AGENTS, AGENT_TASKS } from './agent-context.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = resolve(__filename, '..')
const projectRoot = resolve(__dirname, '..')
const docsPath = resolve(projectRoot, 'docs/dynamic-navigation')

/**
 * Lê execution log para verificar status das tasks
 */
function getTaskStatusFromLog() {
  try {
    const logPath = resolve(docsPath, 'EXECUTION_LOG.md')
    const content = readFileSync(logPath, 'utf-8')
    
    const taskStatuses = {}
    
    // Parse básico do log para encontrar tasks completed
    const completedMatches = content.match(/Task (TASK_\d+\.\d+\.\d+) .*? COMPLETED/gi)
    if (completedMatches) {
      completedMatches.forEach(match => {
        const taskId = match.match(/Task (TASK_\d+\.\d+\.\d+)/i)?.[1]
        if (taskId) {
          taskStatuses[taskId] = 'COMPLETED'
        }
      })
    }
    
    // Parse para tasks in progress
    const inProgressMatches = content.match(/Task (TASK_\d+\.\d+\.\d+) .*? IN_PROGRESS/gi)
    if (inProgressMatches) {
      inProgressMatches.forEach(match => {
        const taskId = match.match(/Task (TASK_\d+\.\d+\.\d+)/i)?.[1]
        if (taskId) {
          taskStatuses[taskId] = 'IN_PROGRESS'
        }
      })
    }
    
    // Parse para tasks blocked
    const blockedMatches = content.match(/Task (TASK_\d+\.\d+\.\d+) .*? BLOCKED/gi)
    if (blockedMatches) {
      blockedMatches.forEach(match => {
        const taskId = match.match(/Task (TASK_\d+\.\d+\.\d+)/i)?.[1]
        if (taskId) {
          taskStatuses[taskId] = 'BLOCKED'
        }
      })
    }
    
    return taskStatuses
  } catch (error) {
    console.warn(`⚠️ Não foi possível ler execution log: ${error.message}`)
    return {}
  }
}

/**
 * Verifica se dependencies de uma task estão resolvidas
 */
function areDependenciesResolved(dependencies, taskStatuses) {
  if (!dependencies || dependencies.length === 0) {
    return true
  }
  
  // Se dependency é um épico/story, assumir como resolvido por simplicidade
  const taskDependencies = dependencies.filter(dep => dep.startsWith('TASK_'))
  
  return taskDependencies.every(dep => taskStatuses[dep] === 'COMPLETED')
}

/**
 * Encontra próxima task disponível para o agent
 */
function findNextTask(agentKey) {
  const agent = AGENTS[agentKey]
  if (!agent) {
    return null
  }
  
  const agentTasks = AGENT_TASKS[agentKey] || []
  const taskStatuses = getTaskStatusFromLog()
  
  // Filtrar tasks que não estão completed e têm dependencies resolvidas
  const availableTasks = agentTasks.filter(task => {
    const currentStatus = taskStatuses[task.id] || task.status
    
    // Skip se já está completed ou em progresso por outro
    if (currentStatus === 'COMPLETED' || currentStatus === 'IN_PROGRESS') {
      return false
    }
    
    // Verificar dependencies
    return areDependenciesResolved(task.dependencies, taskStatuses)
  })
  
  // Retornar primeira task disponível (ordenado por prioridade no array)
  return availableTasks[0] || null
}

/**
 * Busca detalhes de uma task no backlog
 */
function getTaskDetails(taskId) {
  try {
    const backlogPath = resolve(docsPath, 'BACKLOG_EXECUTABLE.md')
    const content = readFileSync(backlogPath, 'utf-8')
    
    // Parse básico para encontrar detalhes da task
    const taskRegex = new RegExp(`\\*\\*TASK ${taskId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^*]*\\*\\*([\\s\\S]*?)(?=\\*\\*TASK|$)`, 'i')
    const match = content.match(taskRegex)
    
    if (match) {
      const taskSection = match[1]
      
      // Extrair informações básicas
      const responsavelMatch = taskSection.match(/\\*\\*Responsável\\*\\*:\\s*([^\\n]*)/i)
      const ferramentasMatch = taskSection.match(/\\*\\*Ferramentas\\*\\*:\\s*([^\\n]*)/i)
      const entregavelMatch = taskSection.match(/\\*\\*Entregável\\*\\*:\\s*([^\\n]*)/i)
      const estimativaMatch = taskSection.match(/\\*\\*Estimativa\\*\\*:\\s*([^\\n]*)/i)
      const dependenciasMatch = taskSection.match(/\\*\\*Dependências\\*\\*:\\s*([^\\n]*)/i)
      
      return {
        id: taskId,
        responsible: responsavelMatch ? responsavelMatch[1].trim() : 'N/A',
        tools: ferramentasMatch ? ferramentasMatch[1].trim() : 'N/A',
        deliverable: entregavelMatch ? entregavelMatch[1].trim() : 'N/A',
        estimation: estimativaMatch ? estimativaMatch[1].trim() : 'N/A',
        dependencies: dependenciasMatch ? dependenciasMatch[1].trim() : 'Nenhuma'
      }
    }
    
    return null
  } catch (error) {
    console.warn(`⚠️ Não foi possível ler detalhes da task: ${error.message}`)
    return null
  }
}

/**
 * Formata output da próxima task
 */
function formatNextTaskOutput(agentKey, task, agent) {
  if (!task) {
    return `
# 🎯 **PRÓXIMA TASK - ${agent.name.toUpperCase()}**

## ✅ **NENHUMA TASK PENDENTE**
Parabéns ${agent.name}! Você não tem tasks pendentes no momento.

### **📊 STATUS ATUAL**
- **Agent**: ${agent.name} (${agent.role})
- **Status**: ${agent.status}
- **Queue**: Vazia

### **🔍 VERIFICAÇÕES SUGERIDAS**
1. **Verificar execution log**: \`node scripts/dashboard.js\`
2. **Verificar se há handoffs pendentes**
3. **Consultar líder técnico** para novas atribuições

### **📋 PRÓXIMAS AÇÕES**
- Aguardar novas tasks serem atribuídas
- Ajudar outros agents se necessário
- Revisar documentação para melhorias

---
**🕐 Verificado em**: ${new Date().toLocaleString('pt-BR')}
`
  }
  
  const taskDetails = getTaskDetails(task.id)
  
  return `
# 🎯 **PRÓXIMA TASK - ${agent.name.toUpperCase()}**

## **📋 TASK DISPONÍVEL**
**ID**: ${task.id}
**Título**: ${task.title}
**Status**: ${task.status}

## **👤 RESPONSABILIDADE**
**Agent**: ${agent.name}
**Função**: ${agent.role}

${taskDetails ? `
## **📝 DETALHES DA TASK**
**Responsável**: ${taskDetails.responsible}
**Ferramentas**: ${taskDetails.tools}
**Entregável**: ${taskDetails.deliverable}
**Estimativa**: ${taskDetails.estimation}
**Dependencies**: ${taskDetails.dependencies}
` : ''}

## **🛠️ SUAS FERRAMENTAS MCP**
${agent.tools.map(tool => `- ${tool}`).join('\n')}

## **🚀 COMO INICIAR**
1. **Obter contexto completo**:
   \`node scripts/agent-context.js ${agentKey}\`

2. **Marcar como iniciada**:
   \`node scripts/update-progress.js ${task.id} IN_PROGRESS ${agentKey}\`

3. **Executar usando suas ferramentas MCP**

4. **Atualizar quando completar**:
   \`node scripts/update-progress.js ${task.id} COMPLETED ${agentKey}\`

## **📚 DOCUMENTAÇÃO**
- **Backlog**: /docs/dynamic-navigation/BACKLOG_EXECUTABLE.md
- **Contexto**: /docs/dynamic-navigation/PROJECT_OVERVIEW.md
- **Status**: /docs/dynamic-navigation/EXECUTION_LOG.md

## **🎯 FOCO PRINCIPAL**
Implementar navegação dinâmica que autodescobra estrutura do \`/content\` como no Docusaurus.

---
**🕐 Gerado em**: ${new Date().toLocaleString('pt-BR')}
**⚡ Para ver dashboard**: \`node scripts/dashboard.js\`
`
}

/**
 * Lista todas as tasks pendentes de todos os agents
 */
function listAllPendingTasks() {
  const taskStatuses = getTaskStatusFromLog()
  const allPendingTasks = []
  
  Object.entries(AGENT_TASKS).forEach(([agentKey, tasks]) => {
    const agent = AGENTS[agentKey]
    
    tasks.forEach(task => {
      const currentStatus = taskStatuses[task.id] || task.status
      
      if (currentStatus !== 'COMPLETED') {
        const dependenciesResolved = areDependenciesResolved(task.dependencies, taskStatuses)
        
        allPendingTasks.push({
          ...task,
          agentKey,
          agentName: agent.name,
          currentStatus,
          dependenciesResolved,
          available: dependenciesResolved && currentStatus !== 'IN_PROGRESS'
        })
      }
    })
  })
  
  // Ordenar por disponibilidade e depois por agent
  allPendingTasks.sort((a, b) => {
    if (a.available && !b.available) return -1
    if (!a.available && b.available) return 1
    return a.agentName.localeCompare(b.agentName)
  })
  
  return allPendingTasks
}

/**
 * Formata lista de todas as tasks pendentes
 */
function formatAllTasksOutput(tasks) {
  let output = `
# 📋 **TODAS AS TASKS PENDENTES**

## **⚡ TASKS DISPONÍVEIS (${tasks.filter(t => t.available).length})**
`
  
  const availableTasks = tasks.filter(t => t.available)
  if (availableTasks.length === 0) {
    output += 'Nenhuma task disponível no momento.\n'
  } else {
    availableTasks.forEach(task => {
      output += `
### **${task.id}** - ${task.agentName}
- **Título**: ${task.title}
- **Status**: ${task.currentStatus}
- **Dependencies**: ${task.dependencies.length ? task.dependencies.join(', ') : 'Nenhuma'}
- **Comando**: \`node scripts/next-task.js ${task.agentKey}\`
`
    })
  }
  
  output += `
## **⏳ TASKS BLOQUEADAS (${tasks.filter(t => !t.available && t.currentStatus !== 'IN_PROGRESS').length})**
`
  
  const blockedTasks = tasks.filter(t => !t.available && t.currentStatus !== 'IN_PROGRESS')
  if (blockedTasks.length === 0) {
    output += 'Nenhuma task bloqueada.\n'
  } else {
    blockedTasks.forEach(task => {
      output += `
### **${task.id}** - ${task.agentName}
- **Título**: ${task.title}
- **Bloqueada por**: ${task.dependencies.join(', ')}
`
    })
  }
  
  output += `
## **🔄 TASKS EM PROGRESSO (${tasks.filter(t => t.currentStatus === 'IN_PROGRESS').length})**
`
  
  const inProgressTasks = tasks.filter(t => t.currentStatus === 'IN_PROGRESS')
  if (inProgressTasks.length === 0) {
    output += 'Nenhuma task em progresso.\n'
  } else {
    inProgressTasks.forEach(task => {
      output += `
### **${task.id}** - ${task.agentName}
- **Título**: ${task.title}
- **Status**: EM PROGRESSO
`
    })
  }
  
  output += `
---
**🕐 Gerado em**: ${new Date().toLocaleString('pt-BR')}
**📊 Dashboard**: \`node scripts/dashboard.js\`
`
  
  return output
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0 || args[0] === 'all') {
    // Listar todas as tasks pendentes
    const allTasks = listAllPendingTasks()
    const output = formatAllTasksOutput(allTasks)
    console.log(output)
    return
  }
  
  if (args[0] === 'help' || args[0] === '--help') {
    console.log('🎯 **NEXT TASK - Sistema de Navegação Dinâmica**')
    console.log('')
    console.log('**Uso**: node scripts/next-task.js [agent]')
    console.log('')
    console.log('**Agents disponíveis**:')
    Object.entries(AGENTS).forEach(([key, agent]) => {
      console.log(`  ${key.padEnd(8)} - ${agent.name} (${agent.role})`)
    })
    console.log('')
    console.log('**Comandos especiais**:')
    console.log('  all     - Listar todas as tasks pendentes')
    console.log('  help    - Esta ajuda')
    console.log('')
    console.log('**Exemplos**:')
    console.log('  node scripts/next-task.js ricardo')
    console.log('  node scripts/next-task.js alex')
    console.log('  node scripts/next-task.js all')
    return
  }
  
  const agentKey = args[0].toLowerCase()
  
  if (!AGENTS[agentKey]) {
    console.log(`❌ Agent '${agentKey}' não encontrado.`)
    console.log('📋 Agents disponíveis: ' + Object.keys(AGENTS).join(', '))
    process.exit(1)
  }
  
  try {
    const agent = AGENTS[agentKey]
    const nextTask = findNextTask(agentKey)
    const output = formatNextTaskOutput(agentKey, nextTask, agent)
    
    console.log(output)
    
  } catch (error) {
    console.error(`❌ Erro ao buscar próxima task: ${error.message}`)
    process.exit(1)
  }
}

// Executar se script for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { findNextTask, formatNextTaskOutput, listAllPendingTasks }