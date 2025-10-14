#!/usr/bin/env node

/**
 * CLI Script: Task Agent
 * Integração com Task tool do Claude Code para execução por agents especializados
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { AGENTS } from './agent-context.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = resolve(__filename, '..')
const projectRoot = resolve(__dirname, '..')
const docsPath = resolve(projectRoot, 'docs/dynamic-navigation')

/**
 * Gera prompt especializado para Task tool baseado no agent e task
 */
function generateTaskPrompt(agentKey, taskId, context = {}) {
  const agent = AGENTS[agentKey]
  if (!agent) {
    throw new Error(`Agent '${agentKey}' não encontrado`)
  }

  // Ler contexto do projeto
  const projectOverview = readProjectOverview()
  const taskDetails = getTaskDetails(taskId)
  
  const prompt = `
# 🤖 **AGENT ESPECIALIZADO: ${agent.name.toUpperCase()}**

## **👤 SEU PAPEL**
Você é **${agent.name}**, especialista em **${agent.role}** no projeto de Navegação Dinâmica.

### **🎯 SUAS RESPONSABILIDADES**
${agent.responsibilities.map(r => `- ${r}`).join('\n')}

### **🛠️ SUAS FERRAMENTAS MCP**
${agent.tools.map(t => `- ${t}`).join('\n')}

## **📋 TASK A EXECUTAR**
${taskDetails ? `
**ID**: ${taskId}
**Título**: ${taskDetails.title || 'N/A'}
**Descrição**: ${taskDetails.description || 'Consultar backlog para detalhes completos'}
**Entregáveis**: ${taskDetails.deliverables || 'Consultar BACKLOG_EXECUTABLE.md'}
**Ferramentas Específicas**: ${taskDetails.tools || agent.tools.join(', ')}
**Dependencies**: ${taskDetails.dependencies || 'Verificar no backlog'}
` : `
**ID**: ${taskId}
**Status**: Consultar BACKLOG_EXECUTABLE.md para detalhes completos
**Localização**: /docs/dynamic-navigation/BACKLOG_EXECUTABLE.md
`}

## **🎯 OBJETIVO PRINCIPAL**
${projectOverview.objective || 'Implementar navegação dinâmica que autodescobra estrutura do `/content` como no Docusaurus'}

## **📚 DOCUMENTAÇÃO DE REFERÊNCIA**
- **Contexto Completo**: /docs/dynamic-navigation/PROJECT_OVERVIEW.md
- **Backlog com Tasks**: /docs/dynamic-navigation/BACKLOG_EXECUTABLE.md  
- **Status do Projeto**: /docs/dynamic-navigation/EXECUTION_LOG.md
- **Sua Equipe**: /docs/dynamic-navigation/TEAM_AGENTS.md

## **🔄 WORKFLOW DE EXECUÇÃO**
1. **Ler documentação** relevante usando Read tool
2. **Executar task** usando suas ferramentas MCP específicas
3. **Atualizar progresso** ao final: \`node scripts/update-progress.js ${taskId} COMPLETED ${agentKey}\`
4. **Fazer handoff** se necessário para próximo agent

## **💡 CONTEXTO ADICIONAL**
${context.additionalInfo || 'Use suas ferramentas MCP para implementar a funcionalidade necessária.'}

## **⚠️ IMPORTANTE**
- Mantenha foco no objetivo da navegação dinâmica
- Use apenas suas ferramentas MCP atribuídas
- Consulte documentação antes de implementar
- Registre progresso durante execução

---
**🚀 Execute a task usando suas ferramentas especializadas!**
`

  return prompt
}

/**
 * Lê overview do projeto
 */
function readProjectOverview() {
  try {
    const overviewPath = resolve(docsPath, 'PROJECT_OVERVIEW.md')
    const content = readFileSync(overviewPath, 'utf-8')
    
    // Parse básico do objective
    const objectiveMatch = content.match(/## \*\*🎯 OBJETIVO DA SOLUÇÃO\*\*[\s\S]*?Substituir o sistema atual por uma \*\*navegação completamente dinâmica\*\* que:([\s\S]*?)(?=##|$)/i)
    
    return {
      objective: objectiveMatch ? 
        'Substituir navegação hardcoded por sistema dinâmico que autodescobra estrutura do /content' :
        'Implementar navegação dinâmica para o projeto'
    }
  } catch (error) {
    return {
      objective: 'Implementar navegação dinâmica que autodescobra estrutura do /content como no Docusaurus'
    }
  }
}

/**
 * Obtém detalhes da task do backlog
 */
function getTaskDetails(taskId) {
  try {
    const backlogPath = resolve(docsPath, 'BACKLOG_EXECUTABLE.md')
    const content = readFileSync(backlogPath, 'utf-8')
    
    // Parse da task específica
    const taskRegex = new RegExp(`\\*\\*TASK ${taskId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^*]*\\*\\*([\\s\\S]*?)(?=\\*\\*TASK|##|$)`, 'i')
    const match = content.match(taskRegex)
    
    if (match) {
      const taskSection = match[1]
      
      // Extrair campos
      const titleMatch = taskSection.match(/\*\*Título\*\*:\s*([^\n]*)/i)
      const responsavelMatch = taskSection.match(/\*\*Responsável\*\*:\s*([^\n]*)/i) 
      const ferramentasMatch = taskSection.match(/\*\*Ferramentas\*\*:\s*([^\n]*)/i)
      const entregavelMatch = taskSection.match(/\*\*Entregável\*\*:\s*([^\n]*)/i)
      const dependenciasMatch = taskSection.match(/\*\*Dependências\*\*:\s*([^\n]*)/i)
      
      return {
        title: titleMatch ? titleMatch[1].trim() : null,
        responsible: responsavelMatch ? responsavelMatch[1].trim() : null,
        tools: ferramentasMatch ? ferramentasMatch[1].trim() : null,
        deliverables: entregavelMatch ? entregavelMatch[1].trim() : null,
        dependencies: dependenciasMatch ? dependenciasMatch[1].trim() : null
      }
    }
    
    return null
  } catch (error) {
    console.warn(`⚠️ Não foi possível ler detalhes da task: ${error.message}`)
    return null
  }
}

/**
 * Gera configuração para Task tool
 */
function generateTaskToolConfig(agentKey, taskId, context = {}) {
  const prompt = generateTaskPrompt(agentKey, taskId, context)
  
  return {
    subagent_type: "general-purpose",
    description: `${AGENTS[agentKey].name} executing ${taskId}`,
    prompt: prompt
  }
}

/**
 * Gera configuração para agent específico sem task
 */
function generateAgentConfig(agentKey, purpose = "contexto e próxima ação") {
  const agent = AGENTS[agentKey]
  if (!agent) {
    throw new Error(`Agent '${agentKey}' não encontrado`)
  }

  const prompt = `
# 🤖 **CONTEXTO DO AGENT: ${agent.name.toUpperCase()}**

## **👤 SEU PAPEL**
Você é **${agent.name}**, especialista em **${agent.role}** no projeto de Navegação Dinâmica.

### **🎯 SUAS RESPONSABILIDADES**
${agent.responsibilities.map(r => `- ${r}`).join('\n')}

### **🛠️ SUAS FERRAMENTAS MCP**
${agent.tools.map(t => `- ${t}`).join('\n')}

## **📋 INSTRUÇÕES**
1. **Use Read tool** para consultar: \`/docs/dynamic-navigation/EXECUTION_LOG.md\`
2. **Identifique** sua próxima task disponível
3. **Execute** \`node scripts/next-task.js ${agentKey}\` para ver detalhes
4. **Proceda** conforme orientações da próxima task

## **🎯 OBJETIVO PRINCIPAL**
Implementar navegação dinâmica que autodescobra estrutura do \`/content\` como no Docusaurus.

## **📚 DOCUMENTAÇÃO**
- **Status**: /docs/dynamic-navigation/EXECUTION_LOG.md
- **Backlog**: /docs/dynamic-navigation/BACKLOG_EXECUTABLE.md
- **Contexto**: /docs/dynamic-navigation/PROJECT_OVERVIEW.md

---
**⚡ Comece verificando seu status atual e próxima task!**
`

  return {
    subagent_type: "general-purpose", 
    description: `${agent.name} agent context and next actions`,
    prompt: prompt
  }
}

/**
 * Lista configurações disponíveis para todos os agents
 */
function listAvailableConfigs() {
  const configs = []
  
  Object.entries(AGENTS).forEach(([key, agent]) => {
    configs.push({
      agentKey: key,
      agentName: agent.name,
      role: agent.role,
      tools: agent.tools,
      contextCommand: `node scripts/task-agent.js context ${key}`,
      taskCommand: `node scripts/task-agent.js task ${key} [TASK_ID]`
    })
  })
  
  return configs
}

/**
 * Formata output de help
 */
function formatHelpOutput() {
  const configs = listAvailableConfigs()
  
  return `
# 🤖 **TASK AGENT - Integração com Task Tool**

## **📋 USO**
\`node scripts/task-agent.js <command> <agentKey> [taskId]\`

## **🔧 COMANDOS**

### **context <agentKey>**
Gera configuração para obter contexto do agent via Task tool
\`\`\`bash
node scripts/task-agent.js context ricardo
\`\`\`

### **task <agentKey> <taskId>**
Gera configuração para executar task específica via Task tool
\`\`\`bash
node scripts/task-agent.js task ricardo TASK_1.1.1
\`\`\`

### **json <command> <agentKey> [taskId]**
Output em formato JSON para integração direta
\`\`\`bash
node scripts/task-agent.js json task ricardo TASK_1.1.1
\`\`\`

## **👥 AGENTS DISPONÍVEIS**
${configs.map(config => `
### **${config.agentKey}** - ${config.agentName}
- **Role**: ${config.role}
- **Tools**: ${config.tools.join(', ')}
- **Context**: \`${config.contextCommand}\`
- **Task**: \`${config.taskCommand}\`
`).join('')}

## **🔗 INTEGRAÇÃO COM CLAUDE CODE**

### **Passo 1**: Gerar configuração
\`\`\`bash
node scripts/task-agent.js task ricardo TASK_1.1.1
\`\`\`

### **Passo 2**: Usar com Task tool
\`\`\`javascript
await Task({
  subagent_type: "general-purpose",
  description: "Ricardo executing TASK_1.1.1", 
  prompt: "[prompt gerado pelo script]"
})
\`\`\`

### **Passo 3**: Agent executa automaticamente
O Task tool invoca agent especializado com contexto completo.

---
**💡 Use este sistema para execução automatizada via Task tool do Claude Code!**
`
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0 || args[0] === 'help' || args[0] === '--help') {
    console.log(formatHelpOutput())
    return
  }
  
  const [command, agentKey, taskId] = args
  const outputJson = command === 'json'
  const actualCommand = outputJson ? args[1] : command
  const actualAgentKey = outputJson ? args[2] : agentKey
  const actualTaskId = outputJson ? args[3] : taskId
  
  if (!actualAgentKey || !AGENTS[actualAgentKey.toLowerCase()]) {
    console.error(`❌ Agent '${actualAgentKey}' não encontrado.`)
    console.log('👥 Agents disponíveis: ' + Object.keys(AGENTS).join(', '))
    process.exit(1)
  }
  
  try {
    let config
    
    switch (actualCommand) {
      case 'context':
        config = generateAgentConfig(actualAgentKey.toLowerCase())
        break
        
      case 'task':
        if (!actualTaskId) {
          console.error('❌ Task ID necessário para comando task')
          console.log('💡 Uso: node scripts/task-agent.js task <agentKey> <taskId>')
          process.exit(1)
        }
        config = generateTaskToolConfig(actualAgentKey.toLowerCase(), actualTaskId)
        break
        
      default:
        console.error(`❌ Comando inválido: ${actualCommand}`)
        console.log('📋 Comandos válidos: context, task, json')
        process.exit(1)
    }
    
    if (outputJson) {
      console.log(JSON.stringify(config, null, 2))
    } else {
      console.log('🤖 **CONFIGURAÇÃO PARA TASK TOOL**')
      console.log('='.repeat(50))
      console.log('')
      console.log('**Use com Task tool do Claude Code:**')
      console.log('')
      console.log('```javascript')
      console.log('await Task({')
      console.log(`  subagent_type: "${config.subagent_type}",`)
      console.log(`  description: "${config.description}",`)
      console.log(`  prompt: \`${config.prompt.slice(0, 100)}...\``)
      console.log('})')
      console.log('```')
      console.log('')
      console.log('**Prompt completo:**')
      console.log('```')
      console.log(config.prompt)
      console.log('```')
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

export { generateTaskPrompt, generateTaskToolConfig, generateAgentConfig }