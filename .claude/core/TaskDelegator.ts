/**
 * TaskDelegator - Claude Code SDK Integration
 * 
 * Executa agents usando Claude Code SDK com tools nativos
 * Real execution com criação de arquivos via Read, Edit, Write tools
 */

import { query } from "@anthropic-ai/claude-code"
import * as fs from 'fs'
import * as path from 'path'

interface ExecutionInstruction {
  action: 'create_file' | 'edit_file' | 'read_file' | 'analyze_structure'
  path: string
  content?: string
  changes?: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

interface SprintInstructions {
  sprintName: string
  phase: string
  agent: string
  context: string
  tasks: ExecutionInstruction[]
  expectedFiles: string[]
  completionCriteria: string[]
}

interface TaskExecution {
  id: string
  agentName: string
  prompt: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  startTime?: Date
  endTime?: Date
  instructions?: SprintInstructions
  result?: string
  error?: string
}

interface TaskConfig {
  maxConcurrent: number
  timeout: number
  agentsDirectory: string
}

export class TaskDelegator {
  private executions: Map<string, TaskExecution> = new Map()
  private config: TaskConfig
  private isShuttingDown: boolean = false

  constructor(config?: Partial<TaskConfig>) {
    this.config = {
      maxConcurrent: 3,
      timeout: 600000, // 10 minutes for file operations
      agentsDirectory: './agents',
      ...config
    }
  }

  /**
   * Executar agent usando Claude Code SDK
   */
  async executeAgent(
    agentName: string, 
    prompt: string, 
    context: any = {}
  ): Promise<string> {
    const executionId = `${agentName}-${Date.now()}`
    
    // Criar execução
    const execution: TaskExecution = {
      id: executionId,
      agentName,
      prompt,
      status: 'pending',
      startTime: new Date()
    }
    
    this.executions.set(executionId, execution)
    
    try {
      execution.status = 'running'
      
      console.log(`🚀 Executando ${agentName} via Claude Code SDK...`)
      
      // Carregar system prompt do agent
      const systemPrompt = await this.loadAgentSystemPrompt(agentName)
      
      // Construir prompt completo com contexto do projeto
      const fullPrompt = this.buildSprintPrompt(agentName, prompt, context)
      
      // EXECUÇÃO REAL via Claude Code SDK
      const result = await query({
        prompt: fullPrompt,
        options: {
          appendSystemPrompt: systemPrompt
        }
      })
      
      // Extrair texto do resultado Query
      const resultText = String(result)
      
      execution.status = 'completed'
      execution.endTime = new Date()
      execution.result = resultText
      
      console.log(`✅ ${agentName} executado com sucesso via SDK`)
      console.log(`📄 Resultado: ${resultText.substring(0, 100)}...`)
      
      return resultText || 'Execução completada com sucesso'
      
    } catch (error: any) {
      execution.status = 'failed'
      execution.endTime = new Date()
      execution.error = error.message
      
      console.error(`❌ Erro na execução de ${agentName} via SDK:`, error)
      throw error
      
    }
  }

  /**
   * Carregar system prompt do agent
   */
  private async loadAgentSystemPrompt(agentName: string): Promise<string> {
    try {
      const agentPath = path.join('./agents', `${agentName}.md`)
      
      if (fs.existsSync(agentPath)) {
        const agentContent = fs.readFileSync(agentPath, 'utf-8')
        
        // Adicionar contexto específico do Claude Code
        const claudeCodeContext = `
${agentContent}

## 🛠️ FERRAMENTAS DISPONÍVEIS
Você tem acesso aos seguintes tools nativos do Claude Code:
- **Read**: Para ler arquivos existentes e entender o contexto
- **Edit**: Para modificar arquivos existentes
- **Write**: Para criar novos arquivos
- **Glob**: Para encontrar arquivos por padrão

## 📍 CONTEXTO DO PROJETO
- Projeto: Matrix Protocol Dynamic Navigation
- Localização: /home/neto/projects/matrix-protocol/
- Tecnologias: Nuxt 3, Vue 3, TypeScript, @nuxt/content

## ⚡ INSTRUÇÕES IMPORTANTES
- SEMPRE use os tools nativos para criar/modificar arquivos
- Siga os padrões existentes do projeto
- Documente suas implementações
- Teste quando possível
`
        
        return claudeCodeContext
      }
      
      // Fallback para prompt genérico
      return this.getGenericAgentPrompt(agentName)
      
    } catch (error: any) {
      console.error(`❌ Erro ao carregar prompt do agent ${agentName}:`, error)
      return this.getGenericAgentPrompt(agentName)
    }
  }

  /**
   * Construir prompt específico para sprint
   */
  private buildSprintPrompt(agentName: string, basePrompt: string, context: any): string {
    const sprintContext = this.getSprintContext(context)
    
    return `
# 🎯 EXECUÇÃO DE SPRINT - MATRIX PROTOCOL

## 📋 SPRINT ATUAL
${sprintContext}

## 🎯 OBJETIVO ESPECÍFICO
${basePrompt}

## 📁 ESTRUTURA DO PROJETO
- **Root**: /home/neto/projects/matrix-protocol/
- **Website**: /home/neto/projects/matrix-protocol/website/
- **Docs**: /home/neto/projects/matrix-protocol/website/docs/dynamic-navigation/
- **Content**: /home/neto/projects/matrix-protocol/website/content/

## ⚡ AÇÕES NECESSÁRIAS
Como ${agentName}, execute as seguintes tarefas usando os tools Read, Edit, Write:

1. **Analise** a estrutura atual usando Read tool
2. **Implemente** as mudanças necessárias usando Write/Edit tools
3. **Documente** o que foi criado/modificado
4. **Siga** os padrões existentes do projeto

## 🎯 RESULTADO ESPERADO
Implementação funcional que atenda aos objetivos da sprint, com arquivos reais criados no projeto Matrix Protocol.

**IMPORTANTE**: Use sempre os tools nativos do Claude Code para modificar o projeto real.
`
  }

  /**
   * Obter contexto da sprint atual
   */
  private getSprintContext(context: any): string {
    if (context?.sprintName?.includes('3') || context?.sprintName?.includes('Migração')) {
      return `
**Sprint 3 - Migração Gradual e Integração**

**Objetivo**: Implementar sistema de feature flags para migração gradual da navegação dinâmica
**Entregas**:
- Sistema de feature flags (/website/utils/feature-flags.ts)
- Integração com navegação existente
- A/B testing e rollback system
- Performance validation (Lighthouse ≥ 90, navegação ≤ 200ms)

**Stories Principais**:
- Story 3.1: Sistema de Feature Flags
- Story 3.2: Validação e Performance
`
    }
    
    return `
**Sprint Execution**
Execução de tarefas do Matrix Protocol Dynamic Navigation project.
`
  }

  /**
   * Prompt genérico para agent
   */
  private getGenericAgentPrompt(agentName: string): string {
    const agentRoles = {
      'alex-santos': 'Líder Técnico & Arquiteto especializado em coordenação e decisões arquiteturais',
      'marina-costa': 'Frontend Developer especializada em Vue 3, Nuxt e componentes de navegação',
      'ricardo-lima': 'Nuxt/Content Specialist especializado em @nuxt/content e discovery APIs',
      'camila-rodriguez': 'QA Engineer especializada em validação e testes automatizados',
      'bruno-oliveira': 'Content Specialist especializado em estrutura de conteúdo e i18n'
    }
    
    const role = agentRoles[agentName as keyof typeof agentRoles] || 'Especialista técnico'
    
    return `
Você é ${agentName}, ${role}.

## 🛠️ FERRAMENTAS DISPONÍVEIS
- **Read**: Para ler arquivos existentes
- **Edit**: Para modificar arquivos existentes  
- **Write**: Para criar novos arquivos
- **Glob**: Para encontrar arquivos por padrão

## 📍 CONTEXTO
- Projeto: Matrix Protocol Dynamic Navigation
- Tecnologias: Nuxt 3, Vue 3, TypeScript
- Localização: /home/neto/projects/matrix-protocol/

Execute as tarefas solicitadas usando os tools nativos do Claude Code.
`
  }

  /**
   * Extrair contexto da sprint do prompt
   */
  private extractSprintContext(prompt: string, context: any): {
    sprintName: string
    phase: string
    description: string
  } {
    
    // Detectar Sprint 3 no prompt ou contexto
    if (prompt.includes('migração') || prompt.includes('Migração') || context?.sprintName?.includes('3')) {
      return {
        sprintName: "Sprint 3 - Migração Gradual e Integração",
        phase: "Story 1 - Sistema de Feature Flags",
        description: "Implementar sistema de feature flags para migração gradual da navegação dinâmica"
      }
    }
    
    // Fallback genérico
    return {
      sprintName: "Sprint 3 - Migração Gradual e Integração", 
      phase: "Implementação Geral",
      description: "Execução de tarefas da sprint de migração"
    }
  }

  /**
   * Gerar tasks específicas baseadas no agent e contexto
   */
  private generateTasksFromPrompt(
    agentName: string, 
    prompt: string, 
    sprintContext: any
  ): ExecutionInstruction[] {
    
    // Tasks específicas para Sprint 3 - alex-santos
    if (agentName === 'alex-santos' && sprintContext.sprintName.includes('Sprint 3')) {
      return [
        {
          action: 'analyze_structure',
          path: '/home/neto/projects/matrix-protocol/website/',
          description: 'Analisar estrutura atual do projeto para identificar pontos de integração',
          priority: 'high'
        },
        {
          action: 'create_file',
          path: '/home/neto/projects/matrix-protocol/website/utils/feature-flags.ts',
          content: this.generateFeatureFlagContent(),
          description: 'Criar sistema de feature flags para controle da navegação dinâmica',
          priority: 'high'
        },
        {
          action: 'read_file',
          path: '/home/neto/projects/matrix-protocol/website/composables/useDocsNavigation.ts',
          description: 'Verificar composable atual de navegação para integração',
          priority: 'medium'
        },
        {
          action: 'edit_file',
          path: '/home/neto/projects/matrix-protocol/website/composables/useDocsNavigation.ts',
          changes: 'Integrar feature flag DYNAMIC_NAVIGATION e implementar fallback',
          description: 'Integrar feature flags no composable de navegação existente',
          priority: 'high'
        }
      ]
    }
    
    // Tasks genéricas para outros agents
    return [
      {
        action: 'analyze_structure',
        path: '/home/neto/projects/matrix-protocol/website/',
        description: `Analisar projeto para execução como ${agentName}`,
        priority: 'medium'
      }
    ]
  }

  /**
   * Gerar conteúdo do sistema de feature flags
   */
  private generateFeatureFlagContent(): string {
    return `// Feature Flag System for Dynamic Navigation
// Generated by Matrix Protocol System - Sprint 3

interface FeatureFlags {
  DYNAMIC_NAVIGATION: boolean
  LEGACY_NAVIGATION: boolean
  A_B_TESTING: boolean
}

export class FeatureFlagManager {
  private flags: FeatureFlags = {
    DYNAMIC_NAVIGATION: false, // Start disabled for gradual migration
    LEGACY_NAVIGATION: true,   // Keep legacy as fallback
    A_B_TESTING: false        // Enable for testing phase
  }

  /**
   * Check if dynamic navigation is enabled
   */
  isDynamicNavigationEnabled(): boolean {
    return this.flags.DYNAMIC_NAVIGATION
  }

  /**
   * Toggle dynamic navigation (admin only)
   */
  toggleDynamicNavigation(enabled: boolean): void {
    this.flags.DYNAMIC_NAVIGATION = enabled
    this.flags.LEGACY_NAVIGATION = !enabled
  }

  /**
   * Enable A/B testing mode
   */
  enableABTesting(): void {
    this.flags.A_B_TESTING = true
  }

  /**
   * Get current flag status
   */
  getFlags(): FeatureFlags {
    return { ...this.flags }
  }
}

export const featureFlags = new FeatureFlagManager()
`
  }

  /**
   * Extrair arquivos esperados das tasks
   */
  private extractExpectedFiles(tasks: ExecutionInstruction[]): string[] {
    return tasks
      .filter(task => task.action === 'create_file' || task.action === 'edit_file')
      .map(task => task.path)
  }

  /**
   * Gerar critérios de conclusão
   */
  private generateCompletionCriteria(sprintContext: any, tasks: ExecutionInstruction[]): string[] {
    const criteria = [
      'Todos os arquivos especificados foram criados/modificados',
      'Código segue padrões existentes do projeto',
      'Funcionalidade testada e funcionando'
    ]

    if (sprintContext.sprintName.includes('Sprint 3')) {
      criteria.push(
        'Sistema de feature flags implementado e funcional',
        'Integração com navegação existente sem quebras',
        'Fallback para navegação legacy configurado'
      )
    }

    return criteria
  }

  /**
   * Exibir instruções formatadas para Claude executar
   */
  private displayInstructionsForClaude(instructions: SprintInstructions): void {
    console.log('\n' + '='.repeat(80))
    console.log(`🎯 INSTRUÇÕES PARA CLAUDE EXECUTAR`)
    console.log('='.repeat(80))
    console.log(`📋 Sprint: ${instructions.sprintName}`)
    console.log(`⚡ Fase: ${instructions.phase}`)
    console.log(`👤 Agent: ${instructions.agent}`)
    console.log(`📝 Contexto: ${instructions.context}`)
    console.log('')
    
    console.log(`📋 TASKS A EXECUTAR (${instructions.tasks.length} total):`)
    instructions.tasks.forEach((task, index) => {
      const priorityIcon = task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'
      console.log(`${index + 1}. ${priorityIcon} ${task.action.toUpperCase()}: ${task.description}`)
      console.log(`   📁 Path: ${task.path}`)
      if (task.content) {
        console.log(`   📝 Conteúdo: Será criado novo arquivo`)
      }
      if (task.changes) {
        console.log(`   ✏️ Mudanças: ${task.changes}`)
      }
      console.log('')
    })
    
    console.log(`📁 ARQUIVOS ESPERADOS (${instructions.expectedFiles.length} total):`)
    instructions.expectedFiles.forEach(file => {
      console.log(`   - ${file}`)
    })
    console.log('')
    
    console.log(`✅ CRITÉRIOS DE CONCLUSÃO:`)
    instructions.completionCriteria.forEach(criteria => {
      console.log(`   - ${criteria}`)
    })
    
    console.log('\n' + '='.repeat(80))
    console.log(`🚀 CLAUDE: Execute as tasks acima usando Read, Edit, Write tools`)
    console.log('='.repeat(80))
  }

  /**
   * Construir prompt contextual com informações do projeto
   */
  private buildContextualPrompt(basePrompt: string, context: any): string {
    const projectContext = this.gatherProjectContext()
    const currentSprint = this.getCurrentSprintContext(context)
    
    return `
# 🎯 CONTEXTO DO PROJETO MATRIX PROTOCOL

Você está executando uma sprint no projeto **Matrix Protocol Dynamic Navigation**.

## 📍 LOCALIZAÇÃO E ESTRUTURA
- **Projeto root**: /home/neto/projects/matrix-protocol/
- **Working directory**: /home/neto/projects/matrix-protocol/.claude/
- **Website**: /home/neto/projects/matrix-protocol/website/
- **Docs**: /home/neto/projects/matrix-protocol/website/docs/dynamic-navigation/

## 🎯 SPRINT ATUAL: ${currentSprint.name}
${currentSprint.context}

## 📊 STATUS DO PROJETO
${projectContext}

## 🛠️ FERRAMENTAS DISPONÍVEIS NO CLAUDE CODE
Você tem acesso total aos seguintes tools nativos:

### 📖 **Read Tool**
- Ler qualquer arquivo do projeto
- Entender estrutura existente
- Analisar código atual

### ✏️ **Edit Tool** 
- Modificar arquivos existentes
- Fazer mudanças específicas em código
- Refatorar componentes

### 📝 **Write Tool**
- Criar novos arquivos
- Implementar novos componentes
- Gerar documentação

### 🔍 **Glob Tool**
- Encontrar arquivos por padrão
- Mapear estrutura de diretórios
- Localizar recursos específicos

## 📋 INSTRUÇÕES DA SPRINT
${basePrompt}

## ⚡ AÇÕES NECESSÁRIAS
1. **SEMPRE** use Read tool primeiro para entender o contexto
2. **CRIE** arquivos reais usando Write tool 
3. **MODIFIQUE** arquivos existentes usando Edit tool
4. **DOCUMENTE** todas as mudanças que fizer
5. **SIGA** os padrões existentes do projeto
6. **TESTE** suas implementações quando possível

## 🎯 RESULTADO ESPERADO
Produzir arquivos reais, funcionais e bem integrados ao projeto Matrix Protocol.
Todas as modificações devem seguir os padrões de qualidade estabelecidos.

---
**Inicie sempre lendo a estrutura atual com Read tool, depois implemente as mudanças solicitadas.**
`
  }

  /**
   * Coletar contexto atual do projeto
   */
  private gatherProjectContext(): string {
    return `
### 📁 ESTRUTURA DO PROJETO
- **Backend**: .claude/ (sistema de agents e execução)
- **Frontend**: website/ (Nuxt 3 application)
- **Docs**: website/docs/dynamic-navigation/ (documentação e sprints)
- **Content**: website/content/ (conteúdo multilíngue PT/EN)

### 🏃 SPRINTS EXECUTADAS
- ✅ **Sprint 1**: Preparação e Padronização (COMPLETED)
- ✅ **Sprint 2**: API de Navegação Dinâmica (COMPLETED)
- 🚀 **Sprint 3**: Migração Gradual e Integração (EM EXECUÇÃO)

### 👥 TEAM AGENTS
- **alex-santos**: Líder Técnico & Arquiteto
- **marina-costa**: Frontend Developer (Vue/Nuxt)
- **ricardo-lima**: Nuxt/Content Specialist
- **camila-rodriguez**: QA Engineer
- **bruno-oliveira**: Content Specialist

### 🛠️ STACK TECNOLÓGICO
- **Framework**: Nuxt 3 + Vue 3 + TypeScript
- **Content**: @nuxt/content para documentação
- **UI**: Nuxt UI components
- **i18n**: Suporte multilíngue PT/EN
`
  }

  /**
   * Obter contexto da sprint atual
   */
  private getCurrentSprintContext(context: any): { name: string; context: string } {
    // Detectar sprint baseado no contexto
    if (context?.sprintName) {
      return {
        name: context.sprintName,
        context: this.getSprintSpecificContext(context.sprintName)
      }
    }
    
    // Fallback para Sprint 3 (mais provável)
    return {
      name: "Sprint 3 - Migração Gradual e Integração",
      context: this.getSprintSpecificContext("Sprint 3")
    }
  }

  /**
   * Contexto específico por sprint
   */
  private getSprintSpecificContext(sprintName: string): string {
    switch (sprintName) {
      case "Sprint 1":
        return `
**Foco**: Preparação e Padronização do Content
**Objetivo**: Auditar e padronizar estrutura de conteúdo para descoberta automática
**Entregas**: Scripts de auditoria, mapeamento de estrutura, catálogo de frontmatter
`
      case "Sprint 2":
        return `
**Foco**: Desenvolvimento da API de Navegação Dinâmica  
**Objetivo**: Criar sistema core de descoberta automática
**Entregas**: Composables, algoritmos de construção de árvore, cache de navegação
`
      case "Sprint 3":
      default:
        return `
**Foco**: Migração Gradual e Integração
**Objetivo**: Implementar solução preservando estabilidade
**Entregas**: Sistema de feature flags, migração por A/B testing, validação de performance

### 🎯 OBJETIVOS SPRINT 3
1. **Feature Flag System**: Implementar \`DYNAMIC_NAVIGATION\`
2. **A/B Testing**: Coexistência das duas versões
3. **Performance**: Manter Lighthouse ≥ 90, navegação ≤ 200ms
4. **Rollback**: Sistema de volta instantânea se necessário

### 📋 STORIES PRINCIPAIS
- **Story 3.1**: Migração por Feature Flag
- **Story 3.2**: Validação e Performance
`
    }
  }

  /**
   * Executar múltiplos agents em paralelo
   */
  async executeParallel(
    agentPrompts: Array<{ agentName: string; prompt: string; context?: any }>
  ): Promise<Array<{ agentName: string; result: string; error?: string }>> {
    console.log(`🔄 Executando ${agentPrompts.length} agents via Task tool`)
    
    const promises = agentPrompts.map(async ({ agentName, prompt, context }) => {
      try {
        const result = await this.executeAgent(agentName, prompt, context)
        return { agentName, result }
      } catch (error: any) {
        return { agentName, result: '', error: error.message }
      }
    })
    
    const results = await Promise.allSettled(promises)
    
    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value
      } else {
        return { 
          agentName: agentPrompts[index].agentName, 
          result: '', 
          error: result.reason.message 
        }
      }
    })
  }

  /**
   * Obter status das execuções
   */
  getExecutionStatus(): {
    total: number
    running: number
    completed: number
    failed: number
    rate_limited: number
  } {
    const executions = Array.from(this.executions.values())
    
    return {
      total: executions.length,
      running: executions.filter(e => e.status === 'running').length,
      completed: executions.filter(e => e.status === 'completed').length,
      failed: executions.filter(e => e.status === 'failed').length,
      rate_limited: 0 // Task tool não tem rate limit da mesma forma
    }
  }

  /**
   * Cleanup: limpar execuções
   */
  async cleanup(): Promise<void> {
    this.isShuttingDown = true
    console.log('🧹 Limpando execuções do Task delegator...')
    this.executions.clear()
    console.log('✅ Task delegator cleanup completado')
  }

  /**
   * Verificar se Task tool está disponível
   */
  static async checkTaskToolAvailable(): Promise<boolean> {
    // No Claude Code, Task tool sempre está disponível
    return true
  }
}

// Create singleton instance
export const taskDelegator = new TaskDelegator()