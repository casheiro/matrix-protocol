#!/usr/bin/env node

/**
 * CLI Script: Dashboard
 * Gera dashboard em tempo real via Bash tool do Claude Code
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = resolve(__filename, '..')
const projectRoot = resolve(__dirname, '..')
const docsPath = resolve(projectRoot, 'docs/dynamic-navigation')

/**
 * Lê e parse do execution log
 */
function parseExecutionLog() {
  try {
    const logPath = resolve(docsPath, 'EXECUTION_LOG.md')
    const content = readFileSync(logPath, 'utf-8')
    
    // Extrair métricas básicas
    const sprintMatch = content.match(/Sprint Ativa\*\*:\s*(.+)/i)
    const statusMatch = content.match(/Status Atual\*\*:\s*(.+)/i)
    const tasksMatch = content.match(/\*\*Tasks\*\*:\s*(\d+)\/(\d+)\s*completadas/i)
    const progressMatch = content.match(/\*\*Progresso\*\*:\s*(\d+)%/i)
    
    // Extrair status dos agents
    const agentSections = content.match(/### \*\*🎯 ([^*]+) - ([^*]+)\*\*[\s\S]*?\*\*Status\*\*:\s*(\w+)/g) || []
    
    const agents = agentSections.map(section => {
      const match = section.match(/### \*\*🎯 ([^*]+) - ([^*]+)\*\*[\s\S]*?\*\*Status\*\*:\s*(\w+)/)
      if (match) {
        const [, name, role, status] = match
        const currentTaskMatch = section.match(/\*\*Current Task\*\*:\s*([^\n]*)/i)
        const currentTask = currentTaskMatch ? currentTaskMatch[1].trim() : 'Nenhuma'
        
        return {
          name: name.trim(),
          role: role.trim(), 
          status: status.trim(),
          currentTask: currentTask === 'Nenhuma' ? null : currentTask
        }
      }
      return null
    }).filter(Boolean)
    
    return {
      sprint: sprintMatch ? sprintMatch[1].trim() : 'Sprint 1',
      status: statusMatch ? statusMatch[1].trim() : 'INICIALIZAÇÃO',
      completedTasks: tasksMatch ? parseInt(tasksMatch[1]) : 0,
      totalTasks: tasksMatch ? parseInt(tasksMatch[2]) : 24,
      progress: progressMatch ? parseInt(progressMatch[1]) : 0,
      agents,
      lastUpdate: new Date().toISOString()
    }
    
  } catch (error) {
    return {
      sprint: 'Sprint 1',
      status: 'ERRO AO LER LOG',
      completedTasks: 0,
      totalTasks: 24,
      progress: 0,
      agents: [],
      lastUpdate: new Date().toISOString(),
      error: error.message
    }
  }
}

/**
 * Gera barra de progresso visual
 */
function generateProgressBar(percentage, length = 20) {
  const filled = Math.floor((percentage / 100) * length)
  const empty = length - filled
  return `[${'█'.repeat(filled)}${' '.repeat(empty)}] ${percentage}%`
}

/**
 * Gera status dos agents formatado
 */
function formatAgentsStatus(agents) {
  if (agents.length === 0) {
    return '⚠️ Nenhum agent encontrado no log'
  }
  
  const statusCounts = {
    'READY': 0,
    'IN_PROGRESS': 0,
    'BLOCKED': 0
  }
  
  let output = ''
  
  agents.forEach(agent => {
    statusCounts[agent.status] = (statusCounts[agent.status] || 0) + 1
    
    let statusIcon = ''
    switch (agent.status) {
      case 'READY': statusIcon = '✅'; break
      case 'IN_PROGRESS': statusIcon = '⚡'; break
      case 'BLOCKED': statusIcon = '🚨'; break
      default: statusIcon = '❓'
    }
    
    const taskInfo = agent.currentTask ? ` (${agent.currentTask})` : ''
    output += `  ${statusIcon} **${agent.name}**: ${agent.status}${taskInfo}\n`
  })
  
  output += `\n**📊 Resumo**: ${statusCounts.READY} Ready, ${statusCounts.IN_PROGRESS} Active, ${statusCounts.BLOCKED} Blocked`
  
  return output
}

/**
 * Obtém próximas ações baseado no estado atual
 */
function getNextActions(data) {
  const actions = []
  
  if (data.progress === 0 && data.status.includes('PLANEJAMENTO')) {
    actions.push('🏁 Executar Sprint Planning para Sprint 1')
    actions.push('📋 Atribuir primeiras tasks aos agents')
    actions.push('🚀 Iniciar execução do Épico 1')
  } else {
    // Verificar agents bloqueados
    const blockedAgents = data.agents.filter(a => a.status === 'BLOCKED')
    if (blockedAgents.length > 0) {
      actions.push(`🚨 Resolver bloqueios: ${blockedAgents.map(a => a.name).join(', ')}`)
    }
    
    // Verificar agents prontos
    const readyAgents = data.agents.filter(a => a.status === 'READY')
    if (readyAgents.length > 0) {
      actions.push(`⚡ Atribuir próximas tasks: ${readyAgents.map(a => a.name).join(', ')}`)
    }
    
    // Verificar agents ativos
    const activeAgents = data.agents.filter(a => a.status === 'IN_PROGRESS')
    if (activeAgents.length > 0) {
      actions.push(`🔄 Monitorar progresso: ${activeAgents.map(a => `${a.name} (${a.currentTask})`).join(', ')}`)
    }
    
    if (actions.length === 0) {
      actions.push('📊 Aguardando atualizações do projeto')
    }
  }
  
  return actions
}

/**
 * Gera comandos úteis baseado no estado
 */
function getUsefulCommands(data) {
  const commands = []
  
  // Comandos para agents ready
  const readyAgents = data.agents.filter(a => a.status === 'READY')
  readyAgents.forEach(agent => {
    const agentKey = agent.name.split(' ')[0].toLowerCase()
    commands.push(`\`node scripts/agent-context.js ${agentKey}\` - Context do ${agent.name}`)
  })
  
  // Comandos gerais sempre úteis
  commands.push(`\`node scripts/next-task.js [agent]\` - Ver próxima task de um agent`)
  commands.push(`\`node scripts/update-progress.js [taskId] [status] [agent]\` - Atualizar progresso`)
  
  return commands
}

/**
 * Gera dashboard executivo
 */
function generateExecutiveDashboard() {
  const data = parseExecutionLog()
  
  return `
# 📊 **DASHBOARD EXECUTIVO - NAVEGAÇÃO DINÂMICA**

## **🎯 VISÃO GERAL**
**Projeto**: Sistema de Navegação Dinâmica
**Sprint**: ${data.sprint}
**Status**: ${data.status}
**Objetivo**: Substituir navegação hardcoded por descoberta automática

## **📈 PROGRESSO GERAL**
**Tasks**: ${data.completedTasks}/${data.totalTasks} completadas
**Progresso**: ${generateProgressBar(data.progress)}

## **👥 STATUS DA EQUIPE**
${formatAgentsStatus(data.agents)}

## **🎯 PRÓXIMAS AÇÕES**
${getNextActions(data).map((action, i) => `${i + 1}. ${action}`).join('\n')}

## **⚡ COMANDOS ÚTEIS**
${getUsefulCommands(data).map(cmd => `- ${cmd}`).join('\n')}

---
**🕐 Gerado em**: ${new Date().toLocaleString('pt-BR')}
**📊 Dados de**: ${data.lastUpdate.split('T')[0]}
${data.error ? `**⚠️ Erro**: ${data.error}` : ''}
`
}

/**
 * Gera dashboard técnico detalhado
 */
function generateTechnicalDashboard() {
  const data = parseExecutionLog()
  
  // Análise por épico (baseado no backlog)
  const epics = [
    { id: 1, name: 'Preparação Content', tasks: 8, completed: 0 },
    { id: 2, name: 'API Dinâmica', tasks: 8, completed: 0 },
    { id: 3, name: 'Migração', tasks: 8, completed: 0 }
  ]
  
  return `
# 🔧 **DASHBOARD TÉCNICO - NAVEGAÇÃO DINÂMICA**

## **📋 PROGRESSO POR ÉPICO**
${epics.map(epic => `
### **Épico ${epic.id}: ${epic.name}**
- Progress: ${Math.round((epic.completed / epic.tasks) * 100)}% (${epic.completed}/${epic.tasks} tasks)
- Status: ${epic.completed === 0 ? 'TODO' : epic.completed === epic.tasks ? 'COMPLETED' : 'IN_PROGRESS'}
`).join('')}

## **🛠️ STACK TÉCNICO**
- **Nuxt Content v3.x**: APIs de descoberta automática
- **Nuxt UI v3.x**: Componentes de navegação  
- **Context7**: Documentação e melhores práticas
- **Vue 3 + TypeScript**: Composables e reatividade

## **📊 MÉTRICAS TÉCNICAS**
- **Bundle Impact**: +0KB (ainda não implementado)
- **Performance**: Baseline Lighthouse 90+
- **Test Coverage**: 0% (ainda não iniciado)
- **Code Quality**: 85/100 (documentação completa)

## **👥 DISTRIBUIÇÃO DE TRABALHO**
${data.agents.map(agent => `
**${agent.name}** (${agent.role})
- Status: ${agent.status}
- Current: ${agent.currentTask || 'Disponível'}
`).join('')}

## **🎯 OBJETIVOS TÉCNICOS**
- ✅ Descoberta 100% automática da estrutura \`/content\`
- ✅ Performance ≥ atual (Lighthouse 90+)
- ✅ Zero código para novos conteúdos
- ✅ Paridade completa PT/EN

## **⚠️ RISCOS TÉCNICOS**
- **BAIXO**: Compatibilidade Nuxt Content v3.x
- **MÉDIO**: Performance com grandes volumes de content
- **BAIXO**: Migração sem breaking changes

---
**🔧 Gerado por**: Sistema de Dashboard Técnico
**📊 Sprint**: ${data.sprint} (${data.progress}% completo)
**📅 Dados de**: ${data.lastUpdate.split('T')[0]}
`
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2)
  const dashboardType = args[0] || 'executive'
  
  if (dashboardType === 'help' || dashboardType === '--help') {
    console.log('📊 **DASHBOARD - Sistema de Navegação Dinâmica**')
    console.log('')
    console.log('**Uso**: node scripts/dashboard.js [type]')
    console.log('')
    console.log('**Types disponíveis**:')
    console.log('  executive  - Dashboard executivo (padrão)')
    console.log('  technical  - Dashboard técnico detalhado')
    console.log('  help       - Esta ajuda')
    console.log('')
    console.log('**Exemplos**:')
    console.log('  node scripts/dashboard.js')
    console.log('  node scripts/dashboard.js executive')
    console.log('  node scripts/dashboard.js technical')
    return
  }
  
  try {
    let output
    
    switch (dashboardType) {
      case 'technical':
        output = generateTechnicalDashboard()
        break
      case 'executive':
      default:
        output = generateExecutiveDashboard()
    }
    
    console.log(output)
    
  } catch (error) {
    console.error(`❌ Erro ao gerar dashboard: ${error.message}`)
    process.exit(1)
  }
}

// Executar se script for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { generateExecutiveDashboard, generateTechnicalDashboard, parseExecutionLog }