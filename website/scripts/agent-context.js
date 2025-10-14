#!/usr/bin/env node

/**
 * CLI Script: Agent Context
 * Executa via Bash tool do Claude Code para obter contexto completo de um agent
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = resolve(__filename, '..')
const projectRoot = resolve(__dirname, '..')
const docsPath = resolve(projectRoot, 'docs/dynamic-navigation')

// Configuração dos agents
const AGENTS = {
  'alex': {
    name: 'Alex Santos',
    role: 'Líder Técnico & Arquiteto',
    responsibilities: [
      'Arquitetura da Solução',
      'Coordenação Geral', 
      'Decisões Técnicas',
      'Validação de Entregáveis'
    ],
    tools: ['Context7', 'Nuxt Docs', 'Read', 'Write'],
    status: 'READY'
  },
  'marina': {
    name: 'Marina Costa',
    role: 'Frontend Developer',
    responsibilities: [
      'Implementação de Composables',
      'Componentes de Navegação',
      'Performance Frontend',
      'Integração com UI'
    ],
    tools: ['Nuxt UI', 'Edit', 'MultiEdit', 'Bash', 'Read'],
    status: 'READY'
  },
  'ricardo': {
    name: 'Ricardo Lima',
    role: 'Especialista Nuxt/Content',
    responsibilities: [
      'APIs Nuxt Content',
      'Sistema de Discovery',
      'Performance de Queries',
      'Extração de Metadados'
    ],
    tools: ['Context7', 'Read', 'Glob', 'Grep', 'Write'],
    status: 'READY'
  },
  'camila': {
    name: 'Camila Rodriguez',
    role: 'QA Engineer',
    responsibilities: [
      'Validação de Critérios',
      'Testes Automatizados',
      'Métricas de Qualidade',
      'Regressão'
    ],
    tools: ['Bash', 'Read', 'WebFetch', 'Glob'],
    status: 'READY'
  },
  'bruno': {
    name: 'Bruno Oliveira',
    role: 'Content Specialist',
    responsibilities: [
      'Padronização de Metadados',
      'Suporte Multilingual',
      'Estrutura de Content',
      'Documentação'
    ],
    tools: ['Read', 'Edit', 'Glob', 'Write'],
    status: 'READY'
  }
}

// Mapeamento de tasks por agent (baseado no backlog)
const AGENT_TASKS = {
  'alex': [
    { id: 'TASK_1.1.4', title: 'Gerar Relatório de Inconsistências', status: 'TODO', dependencies: ['TASK_1.1.2', 'TASK_1.1.3'] },
    { id: 'TASK_2.1.2', title: 'Criar Algoritmo de Construção de Árvore', status: 'TODO', dependencies: ['TASK_2.1.1'] },
    { id: 'TASK_3.1.1', title: 'Implementar Sistema de Feature Flags', status: 'TODO', dependencies: ['ÉPICO_2'] }
  ],
  'marina': [
    { id: 'TASK_2.1.3', title: 'Integrar Cache de Navegação', status: 'TODO', dependencies: ['TASK_2.1.1'] },
    { id: 'TASK_2.2.1', title: 'Implementar Sistema de Fallbacks', status: 'TODO', dependencies: ['STORY_2.1'] },
    { id: 'TASK_3.1.2', title: 'Adaptar useDocsNavigation para Duas Versões', status: 'TODO', dependencies: ['TASK_3.1.1'] },
    { id: 'TASK_3.2.2', title: 'Criar Testes de Regressão Visual', status: 'TODO', dependencies: ['TASK_3.2.1'] }
  ],
  'ricardo': [
    { id: 'TASK_1.1.1', title: 'Criar Script de Auditoria', status: 'TODO', dependencies: [] },
    { id: 'TASK_1.1.3', title: 'Extrair e Catalogar Frontmatter', status: 'TODO', dependencies: ['TASK_1.1.1'] },
    { id: 'TASK_1.2.2', title: 'Criar Ferramenta de Validação', status: 'TODO', dependencies: ['TASK_1.2.1'] },
    { id: 'TASK_2.1.1', title: 'Implementar useContentDiscovery.ts', status: 'TODO', dependencies: ['ÉPICO_1'] },
    { id: 'TASK_2.2.4', title: 'Adicionar Detecção Automática de Categorias', status: 'TODO', dependencies: ['TASK_2.2.2', 'TASK_2.2.3'] }
  ],
  'camila': [
    { id: 'TASK_2.1.4', title: 'Adicionar Tratamento de Erros', status: 'TODO', dependencies: ['TASK_2.1.2', 'TASK_2.1.3'] },
    { id: 'TASK_3.1.3', title: 'Criar Interface de Comparação A/B', status: 'TODO', dependencies: ['TASK_3.1.2'] },
    { id: 'TASK_3.2.1', title: 'Implementar Benchmarks de Performance', status: 'TODO', dependencies: ['STORY_3.1'] },
    { id: 'TASK_3.2.3', title: 'Validar Funcionalidade Multilingual', status: 'TODO', dependencies: ['TASK_3.2.1'] }
  ],
  'bruno': [
    { id: 'TASK_1.1.2', title: 'Mapear Estrutura de Diretórios', status: 'TODO', dependencies: ['TASK_1.1.1'] },
    { id: 'TASK_1.2.1', title: 'Definir Schema de Metadados Padrão', status: 'TODO', dependencies: ['STORY_1.1'] },
    { id: 'TASK_1.2.3', title: 'Aplicar Schema em Arquivos Existentes', status: 'TODO', dependencies: ['TASK_1.2.2'] },
    { id: 'TASK_1.2.4', title: 'Adicionar index.md Faltantes', status: 'TODO', dependencies: ['TASK_1.2.3'] },
    { id: 'TASK_2.2.2', title: 'Criar Mapeamento Categoria → Ícone', status: 'TODO', dependencies: ['TASK_2.2.1'] },
    { id: 'TASK_3.1.4', title: 'Documentar Processo de Rollback', status: 'TODO', dependencies: ['TASK_3.1.3'] },
    { id: 'TASK_3.2.3', title: 'Validar Funcionalidade Multilingual', status: 'TODO', dependencies: ['TASK_3.2.1'] }
  ]
}

/**
 * Lê execution log para obter status atual
 */
function getExecutionStatus() {
  try {
    const logPath = resolve(docsPath, 'EXECUTION_LOG.md')
    const content = readFileSync(logPath, 'utf-8')
    
    // Parse básico do status do projeto
    const sprintMatch = content.match(/Sprint Ativa\*\*:\s*(.+)/i)
    const currentSprint = sprintMatch ? sprintMatch[1] : 'Sprint 1'
    
    return {
      currentSprint,
      projectStatus: 'PLANEJAMENTO CONCLUÍDO',
      lastUpdate: new Date().toISOString()
    }
  } catch (error) {
    return {
      currentSprint: 'Sprint 1',
      projectStatus: 'INICIALIZAÇÃO',
      lastUpdate: new Date().toISOString()
    }
  }
}

/**
 * Encontra próxima task disponível para o agent
 */
function getNextTask(agentKey) {
  const tasks = AGENT_TASKS[agentKey] || []
  
  // Por enquanto, retorna primeira task TODO
  // TODO: Implementar verificação de dependencies
  const nextTask = tasks.find(task => task.status === 'TODO')
  
  return nextTask || null
}

/**
 * Gera contexto completo formatado para o agent
 */
function generateAgentContext(agentKey) {
  const agent = AGENTS[agentKey]
  if (!agent) {
    return null
  }

  const executionStatus = getExecutionStatus()
  const nextTask = getNextTask(agentKey)

  return {
    agent,
    executionStatus,
    nextTask,
    timestamp: new Date().toISOString()
  }
}

/**
 * Formata contexto para output do CLI
 */
function formatContextOutput(context) {
  if (!context) {
    return 'Agent não encontrado. Agents disponíveis: alex, marina, ricardo, camila, bruno'
  }

  const { agent, executionStatus, nextTask } = context

  let output = `
# 🤖 **CONTEXTO DO AGENT - ${agent.name.toUpperCase()}**

## **👤 SEU PAPEL**
**Nome**: ${agent.name}
**Função**: ${agent.role}
**Status**: ${agent.status}

## **🎯 SUAS RESPONSABILIDADES**
${agent.responsibilities.map(r => `- ${r}`).join('\n')}

## **🛠️ SUAS FERRAMENTAS MCP**
${agent.tools.map(t => `- ${t}`).join('\n')}

## **📊 STATUS DO PROJETO**
**Sprint Atual**: ${executionStatus.currentSprint}
**Status Geral**: ${executionStatus.projectStatus}
**Última Atualização**: ${executionStatus.lastUpdate.split('T')[0]}
`

  if (nextTask) {
    output += `
## **🎯 SUA PRÓXIMA TASK**
**ID**: ${nextTask.id}
**Título**: ${nextTask.title}
**Status**: ${nextTask.status}
**Dependencies**: ${nextTask.dependencies.length ? nextTask.dependencies.join(', ') : 'Nenhuma'}

### **📋 PRÓXIMA AÇÃO SUGERIDA**
Use o comando de update quando completar:
\`node scripts/update-progress.js ${nextTask.id} COMPLETED ${agent.name.split(' ')[0].toLowerCase()}\`
`
  } else {
    output += `
## **✅ STATUS DA QUEUE**
Nenhuma task pendente no momento. Verifique EXECUTION_LOG.md para atualizações.
`
  }

  output += `
## **📚 DOCUMENTAÇÃO DE REFERÊNCIA**
- **Contexto Completo**: /docs/dynamic-navigation/PROJECT_OVERVIEW.md
- **Sua Equipe**: /docs/dynamic-navigation/TEAM_AGENTS.md  
- **Backlog**: /docs/dynamic-navigation/BACKLOG_EXECUTABLE.md
- **Status**: /docs/dynamic-navigation/EXECUTION_LOG.md

## **🎯 OBJETIVO PRINCIPAL**
Implementar navegação dinâmica que autodescobra estrutura do \`/content\` como no Docusaurus.

---
**🕐 Gerado em**: ${new Date().toLocaleString('pt-BR')}
**⚡ Para executar**: Use suas ferramentas MCP atribuídas
`

  return output
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.log('❌ Uso: node scripts/agent-context.js <agent-name>')
    console.log('📋 Agents disponíveis: alex, marina, ricardo, camila, bruno')
    process.exit(1)
  }

  const agentKey = args[0].toLowerCase()
  const context = generateAgentContext(agentKey)
  const output = formatContextOutput(context)
  
  console.log(output)
}

// Executar se script for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { generateAgentContext, formatContextOutput, AGENTS, AGENT_TASKS }