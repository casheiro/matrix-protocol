#!/usr/bin/env node

/**
 * CLI Script: Sync Todos
 * Sincroniza TodoWrite tool do Claude Code com execution log
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { AGENT_TASKS, AGENTS } from './agent-context.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = resolve(__filename, '..')
const projectRoot = resolve(__dirname, '..')
const docsPath = resolve(projectRoot, 'docs/dynamic-navigation')

/**
 * Lê execution log para obter status atual das tasks
 */
function parseExecutionStatus() {
  try {
    const logPath = resolve(docsPath, 'EXECUTION_LOG.md')
    const content = readFileSync(logPath, 'utf-8')
    
    const taskStatuses = {}
    const agentStatuses = {}
    
    // Parse status das tasks
    const taskMatches = content.match(/Task (TASK_\d+\.\d+\.\d+) .*? (COMPLETED|IN_PROGRESS|BLOCKED)/gi)
    if (taskMatches) {
      taskMatches.forEach(match => {
        const parts = match.match(/Task (TASK_\d+\.\d+\.\d+) .*? (COMPLETED|IN_PROGRESS|BLOCKED)/i)
        if (parts) {
          const [, taskId, status] = parts
          taskStatuses[taskId] = status
        }
      })
    }
    
    // Parse status dos agents
    const agentMatches = content.match(/### \*\*🎯 ([^*]+) - ([^*]+)\*\*[\s\S]*?\*\*Status\*\*:\s*(\w+)/g)
    if (agentMatches) {
      agentMatches.forEach(match => {
        const parts = match.match(/### \*\*🎯 ([^*]+) - ([^*]+)\*\*[\s\S]*?\*\*Status\*\*:\s*(\w+)/)
        if (parts) {
          const [, name, role, status] = parts
          const agentKey = Object.keys(AGENTS).find(key => 
            AGENTS[key].name.includes(name.trim())
          )
          if (agentKey) {
            agentStatuses[agentKey] = {
              name: name.trim(),
              status: status.trim()
            }
          }
        }
      })
    }
    
    return { taskStatuses, agentStatuses }
  } catch (error) {
    console.warn(`⚠️ Erro ao ler execution log: ${error.message}`)
    return { taskStatuses: {}, agentStatuses: {} }
  }
}

/**
 * Gera todos baseado no status atual do projeto
 */
function generateTodos() {
  const { taskStatuses, agentStatuses } = parseExecutionStatus()
  const todos = []
  
  // Para cada agent, verificar suas tasks
  Object.entries(AGENT_TASKS).forEach(([agentKey, tasks]) => {
    const agent = AGENTS[agentKey]
    const agentStatus = agentStatuses[agentKey]
    
    tasks.forEach(task => {
      const currentStatus = taskStatuses[task.id] || 'TODO'
      
      // Converter status para formato TodoWrite
      let todoStatus = 'pending'
      let activeForm = `Executando ${task.title}`
      
      switch (currentStatus) {
        case 'IN_PROGRESS':
          todoStatus = 'in_progress'
          activeForm = `Executando ${task.title}`
          break
        case 'COMPLETED':
          todoStatus = 'completed'
          activeForm = `Executando ${task.title}`
          break
        case 'BLOCKED':
          todoStatus = 'pending' // Bloqueada volta para pending até resolver
          activeForm = `Aguardando desbloqueio de ${task.title}`
          break
        default:
          todoStatus = 'pending'
          activeForm = `Executar ${task.title}`
      }
      
      // Criar todo item
      todos.push({
        content: `${task.id}: ${task.title} (${agent.name})`,
        status: todoStatus,
        activeForm: activeForm
      })
    })
  })
  
  // Ordenar: in_progress primeiro, depois pending, depois completed
  const statusOrder = { 'in_progress': 0, 'pending': 1, 'completed': 2 }
  todos.sort((a, b) => {
    const orderDiff = statusOrder[a.status] - statusOrder[b.status]
    if (orderDiff !== 0) return orderDiff
    
    // Se mesmo status, ordenar por task ID
    return a.content.localeCompare(b.content)
  })
  
  return todos
}

/**
 * Gera comando TodoWrite compatível com Claude Code
 */
function generateTodoWriteCommand(todos) {
  // Limitar a máximo 10 todos para não sobrecarregar
  const limitedTodos = todos.slice(0, 10)
  
  const todoWriteData = limitedTodos.map(todo => ({
    content: todo.content,
    status: todo.status,
    activeForm: todo.activeForm
  }))
  
  return {
    todos: todoWriteData,
    command: `TodoWrite(${JSON.stringify({ todos: todoWriteData }, null, 2)})`
  }
}

/**
 * Gera relatório de sincronização
 */
function generateSyncReport(todos) {
  const stats = {
    total: todos.length,
    pending: todos.filter(t => t.status === 'pending').length,
    inProgress: todos.filter(t => t.status === 'in_progress').length,
    completed: todos.filter(t => t.status === 'completed').length
  }
  
  return `
# 📋 **SYNC REPORT - TodoWrite ↔ Execution Log**

## **📊 ESTATÍSTICAS**
- **Total de todos**: ${stats.total}
- **Pendentes**: ${stats.pending}
- **Em progresso**: ${stats.inProgress}
- **Completados**: ${stats.completed}

## **📈 PROGRESSO GERAL**
**Progress**: ${Math.round((stats.completed / stats.total) * 100)}% (${stats.completed}/${stats.total} tasks)

## **⚡ PRÓXIMAS AÇÕES**
${todos.filter(t => t.status === 'in_progress').length > 0 ? `
### **Em Execução:**
${todos.filter(t => t.status === 'in_progress').map(t => `- ${t.content}`).join('\n')}
` : ''}

${todos.filter(t => t.status === 'pending').slice(0, 3).length > 0 ? `
### **Próximas (Top 3):**
${todos.filter(t => t.status === 'pending').slice(0, 3).map(t => `- ${t.content}`).join('\n')}
` : ''}

## **🛠️ USO NO CLAUDE CODE**
Para sincronizar no Claude Code, use:
\`\`\`
TodoWrite tool com os dados gerados
\`\`\`

---
**🕐 Sincronizado em**: ${new Date().toLocaleString('pt-BR')}
**📊 Fonte**: EXECUTION_LOG.md
`
}

/**
 * Salva configuração de sync para uso posterior
 */
function saveSyncConfig(todos) {
  try {
    const configPath = resolve(docsPath, 'todo-sync-config.json')
    const config = {
      lastSync: new Date().toISOString(),
      todosCount: todos.length,
      stats: {
        pending: todos.filter(t => t.status === 'pending').length,
        inProgress: todos.filter(t => t.status === 'in_progress').length,
        completed: todos.filter(t => t.status === 'completed').length
      },
      lastTodos: todos.slice(0, 10) // Salvar apenas top 10 para referência
    }
    
    writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.warn(`⚠️ Não foi possível salvar config: ${error.message}`)
    return false
  }
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2)
  const command = args[0] || 'sync'
  
  if (command === 'help' || command === '--help') {
    console.log('📋 **SYNC TODOS - Sistema de Navegação Dinâmica**')
    console.log('')
    console.log('**Uso**: node scripts/sync-todos.js [command]')
    console.log('')
    console.log('**Commands**:')
    console.log('  sync    - Gerar todos baseado no execution log (padrão)')
    console.log('  report  - Apenas relatório, sem dados de sync')
    console.log('  json    - Output em formato JSON para integração')
    console.log('  help    - Esta ajuda')
    console.log('')
    console.log('**Exemplos**:')
    console.log('  node scripts/sync-todos.js')
    console.log('  node scripts/sync-todos.js report')
    console.log('  node scripts/sync-todos.js json')
    console.log('')
    console.log('**Integração com Claude Code**:')
    console.log('  1. Execute: node scripts/sync-todos.js')
    console.log('  2. Use dados gerados com TodoWrite tool')
    console.log('  3. TodoWrite sincroniza automaticamente')
    return
  }
  
  try {
    const todos = generateTodos()
    
    switch (command) {
      case 'json': {
        const todoWriteData = generateTodoWriteCommand(todos)
        console.log(JSON.stringify(todoWriteData, null, 2))
        break
      }
      
      case 'report': {
        const report = generateSyncReport(todos)
        console.log(report)
        break
      }
      
      case 'sync':
      default: {
        const todoWriteData = generateTodoWriteCommand(todos)
        const report = generateSyncReport(todos)
        
        // Salvar config para referência
        saveSyncConfig(todos)
        
        // Output completo
        console.log(report)
        console.log('\n' + '='.repeat(60))
        console.log('📋 **DADOS PARA TODOWRITE**')
        console.log('='.repeat(60))
        console.log('')
        console.log('**Use estes dados no TodoWrite tool do Claude Code:**')
        console.log('')
        console.log('```json')
        console.log(JSON.stringify(todoWriteData.todos, null, 2))
        console.log('```')
        console.log('')
        console.log('**💡 Tip**: Copie o JSON acima e use com TodoWrite')
        break
      }
    }
    
  } catch (error) {
    console.error(`❌ Erro no sync: ${error.message}`)
    process.exit(1)
  }
}

// Executar se script for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { generateTodos, generateTodoWriteCommand, generateSyncReport }