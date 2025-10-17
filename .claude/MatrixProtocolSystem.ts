/**
 * MatrixProtocolSystem - Sistema principal simplificado
 * 
 * Foca na funcionalidade essencial: execução real de Claude agents
 * com gerenciamento de rate limits otimizado para Claude Code Pro plan
 */

import { ParallelClaudeRunner, claudeRunner } from './core/ParallelClaudeRunner'
import { rateLimitHandler, createSprintTask } from './utils/OptimizedRateLimitHandler'
import * as fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'

interface SystemConfiguration {
  enableMonitoring: boolean
  maxConcurrentAgents: number
  debugMode: boolean
}

interface AgentExecution {
  agentName: string
  taskType: string
  context: any
}

export class MatrixProtocolSystem {
  private claudeRunner: ParallelClaudeRunner
  private configuration: SystemConfiguration
  private isRunning: boolean = false
  private executionHistory: any[] = []

  constructor(config?: Partial<SystemConfiguration>) {
    this.configuration = {
      enableMonitoring: true,
      maxConcurrentAgents: 3,
      debugMode: process.env.NODE_ENV === 'development',
      ...config
    }

    this.claudeRunner = claudeRunner
  }

  /**
   * Verificar se sistema está em execução
   */
  get systemRunning(): boolean {
    return this.isRunning
  }

  /**
   * Validação do ambiente
   */
  private async validateEnvironment(): Promise<void> {
    console.log(chalk.blue('🔍 Validando ambiente do sistema...'))
    
    const requiredAgents = [
      'alex-santos.md',
      'marina-costa.md', 
      'ricardo-lima.md',
      'camila-rodriguez.md',
      'bruno-oliveira.md'
    ]

    const agentsDir = path.join(__dirname, 'agents')
    
    // Verificar diretório de agents
    if (!fs.existsSync(agentsDir)) {
      throw new Error(`Diretório de agents não encontrado: ${agentsDir}`)
    }

    // Verificar cada agent file
    for (const agentFile of requiredAgents) {
      const agentPath = path.join(agentsDir, agentFile)
      if (!fs.existsSync(agentPath)) {
        throw new Error(`Agent file não encontrado: ${agentPath}`)
      }

      const content = fs.readFileSync(agentPath, 'utf-8')
      if (!content.trim()) {
        console.log(chalk.yellow(`⚠️ Agent file está vazio: ${agentPath}`))
      }
    }

    // Verificar disponibilidade do Claude CLI
    console.log(chalk.gray('🔧 Verificando Claude CLI...'))
    const claudeAvailable = await ParallelClaudeRunner.checkCLIAvailable()
    if (!claudeAvailable) {
      console.log(chalk.yellow('⚠️ Claude CLI não detectado. Sistema funcionará em modo simulação.'))
    } else {
      console.log(chalk.green('✅ Claude CLI detectado e disponível'))
    }

    console.log(chalk.green('✅ Validação do ambiente completada'))
  }

  /**
   * Iniciar sistema
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log(chalk.yellow('⚠️ Sistema já está em execução'))
      return
    }

    try {
      await this.validateEnvironment()
      
      this.isRunning = true

      console.log(chalk.green('🚀 Matrix Protocol System iniciado com sucesso'))

    } catch (error: any) {
      this.isRunning = false
      console.error(chalk.red('❌ Falha na inicialização do sistema:'), error.message)
      throw error
    }
  }

  /**
   * Parar sistema
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      console.log(chalk.yellow('⚠️ Sistema não está em execução'))
      return
    }

    try {
      console.log(chalk.blue('🛑 Parando Matrix Protocol System...'))
      
      this.isRunning = false

      // Cleanup Claude runner
      await this.claudeRunner.cleanup()
      
      // Rate limit handler cleanup
      rateLimitHandler.cleanup()

      console.log(chalk.green('✅ Sistema parado com sucesso'))

    } catch (error: any) {
      console.error(chalk.red('❌ Erro ao parar sistema:'), error.message)
    }
  }

  /**
   * Executar agent individual
   */
  async executeAgent(agentName: string, prompt: string, context?: any): Promise<any> {
    if (!this.isRunning) {
      throw new Error('Sistema não está em execução')
    }

    console.log(chalk.blue(`🤖 Executando agent: ${agentName}`))
    
    try {
      const result = await this.claudeRunner.executeAgent(agentName, prompt, context)
      
      this.executionHistory.push({
        agentName,
        prompt: prompt.substring(0, 100) + '...',
        timestamp: new Date(),
        success: true,
        result: result.substring(0, 200) + '...'
      })

      console.log(chalk.green(`✅ Agent ${agentName} executado com sucesso`))
      return result

    } catch (error: any) {
      this.executionHistory.push({
        agentName,
        prompt: prompt.substring(0, 100) + '...',
        timestamp: new Date(),
        success: false,
        error: error.message
      })

      console.error(chalk.red(`❌ Erro na execução do agent ${agentName}:`), error.message)
      throw error
    }
  }

  /**
   * Executar múltiplos agents em sequência
   */
  async executeAgentSequence(executions: AgentExecution[]): Promise<any[]> {
    console.log(chalk.blue(`📋 Executando sequência de ${executions.length} agents`))
    
    const results = []
    
    for (const execution of executions) {
      try {
        const prompt = this.buildPrompt(execution.agentName, execution.taskType, execution.context)
        const result = await this.executeAgent(execution.agentName, prompt, execution.context)
        results.push({ agentName: execution.agentName, result, success: true })
      } catch (error: any) {
        console.log(chalk.yellow(`⚠️ Continuando sequência apesar do erro em ${execution.agentName}`))
        results.push({ agentName: execution.agentName, error: error.message, success: false })
      }
    }

    return results
  }

  /**
   * Construir prompt otimizado para agent e task type
   */
  private buildPrompt(agentName: string, taskType: string, context: any): string {
    const basePrompts = {
      'sprint-planning': `Como ${agentName}, conduza o sprint planning:
- Analise o backlog e estime esforço
- Defina metas claras do sprint
- Identifique dependências e riscos
- Distribua responsabilidades

Context: ${JSON.stringify(context, null, 2)}`,

      'daily': `Como ${agentName}, conduza a daily scrum:
- Reporte progresso desde última reunião
- Defina próximos passos
- Identifique impedimentos
- Solicite colaboração se necessário

Context: ${JSON.stringify(context, null, 2)}`,

      'implementation': `Como ${agentName}, trabalhe na implementação:
- Desenvolva funcionalidades conforme especificação
- Mantenha qualidade e boas práticas
- Documente mudanças importantes
- Execute testes relevantes

Context: ${JSON.stringify(context, null, 2)}`,

      'validation': `Como ${agentName}, execute validação:
- Teste funcionalidades implementadas
- Verifique critérios de aceitação
- Identifique bugs ou problemas
- Valide performance e usabilidade

Context: ${JSON.stringify(context, null, 2)}`,

      'retrospective': `Como ${agentName}, conduza a retrospectiva:
- Analise o que funcionou bem
- Identifique pontos de melhoria
- Proponha ações para próximo sprint
- Colete feedback da equipe

Context: ${JSON.stringify(context, null, 2)}`
    }

    return basePrompts[taskType as keyof typeof basePrompts] || 
           `Como ${agentName}, execute: ${taskType}. Context: ${JSON.stringify(context, null, 2)}`
  }

  /**
   * Executar demonstração completa do sistema
   */
  async runDemonstration(): Promise<void> {
    console.log(chalk.blue('🎭 Iniciando demonstração do Matrix Protocol System'))
    
    const demonstrations = [
      {
        agentName: 'alex-santos',
        taskType: 'sprint-planning',
        context: {
          sprintGoal: 'Implementar dynamic navigation system',
          duration: '2 weeks',
          team: ['alex', 'marina', 'ricardo', 'camila', 'bruno']
        }
      },
      {
        agentName: 'marina-costa',
        taskType: 'implementation',
        context: {
          feature: 'Frontend navigation components',
          technology: 'Vue 3 + Nuxt'
        }
      },
      {
        agentName: 'ricardo-lima',
        taskType: 'implementation',
        context: {
          feature: 'Backend API endpoints',
          technology: 'Node.js + TypeScript'
        }
      },
      {
        agentName: 'camila-rodriguez',
        taskType: 'validation',
        context: {
          testTypes: ['unit', 'integration', 'e2e'],
          coverage: 'minimum 80%'
        }
      },
      {
        agentName: 'alex-santos',
        taskType: 'retrospective',
        context: {
          sprintCompleted: true,
          velocity: 'as planned'
        }
      }
    ]

    try {
      const results = await this.executeAgentSequence(demonstrations)
      
      console.log(chalk.green('✅ Demonstração concluída com sucesso'))
      console.log(chalk.cyan(`📊 Resumo: ${results.filter(r => r.success).length}/${results.length} agents executados com sucesso`))

    } catch (error: any) {
      console.error(chalk.red('❌ Erro na demonstração:'), error.message)
      throw error
    }
  }

  /**
   * Mostrar status do sistema
   */
  displayStatus(): void {
    console.log(chalk.cyan('\n📊 Status do Matrix Protocol System'))
    console.log('=' .repeat(50))
    
    const rateLimitStatus = rateLimitHandler.getStatus()
    const claudeStatus = this.claudeRunner.getExecutionStatus()
    
    console.log(`🔋 Rate Limit: ${rateLimitStatus.state.promptsRemaining} prompts restantes`)
    console.log(`⚡ Claude Runner: ${claudeStatus.running} execuções ativas`)
    console.log(`📈 Histórico: ${this.executionHistory.length} execuções realizadas`)
    console.log(`🎯 Status: ${this.isRunning ? 'Ativo' : 'Inativo'}`)
    
    if (this.executionHistory.length > 0) {
      const successCount = this.executionHistory.filter(h => h.success).length
      const successRate = Math.round((successCount / this.executionHistory.length) * 100)
      console.log(`✅ Taxa de sucesso: ${successRate}%`)
    }
    
    console.log('=' .repeat(50))
  }

  /**
   * Obter histórico de execuções
   */
  getExecutionHistory(): any[] {
    return [...this.executionHistory]
  }
}

/**
 * CLI Handler para diferentes modos de execução
 */
async function main() {
  const mode = process.argv.find(arg => arg.startsWith('--mode='))?.split('=')[1] || 'interactive'
  const system = new MatrixProtocolSystem()

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log(chalk.yellow('\n🛑 Recebido SIGINT - finalizando sistema...'))
    await system.stop()
    process.exit(0)
  })

  process.on('SIGTERM', async () => {
    console.log(chalk.yellow('\n🛑 Recebido SIGTERM - finalizando sistema...'))
    await system.stop()
    process.exit(0)
  })

  try {
    switch (mode) {
      case 'interactive':
        console.log(chalk.blue('🎯 Modo Interativo - Matrix Protocol System'))
        console.log(chalk.gray('Use Ctrl+C para sair'))
        
        await system.start()
        system.displayStatus()
        
        // Keep alive for interactive mode
        const keepAlive = () => setTimeout(keepAlive, 1000)
        keepAlive()
        break

      case 'demo':
        console.log(chalk.blue('🎭 Modo Demonstração - Matrix Protocol System'))
        
        await system.start()
        await system.runDemonstration()
        system.displayStatus()
        await system.stop()
        break

      case 'monitoring':
        console.log(chalk.blue('📊 Modo Monitoramento - Matrix Protocol System'))
        
        await system.start()
        
        // Display status every 10 seconds
        const statusInterval = setInterval(() => {
          if (!system.systemRunning) {
            clearInterval(statusInterval)
            return
          }
          
          system.displayStatus()
        }, 10000)
        
        // Keep alive for monitoring mode
        const keepMonitoring = () => setTimeout(keepMonitoring, 1000)
        keepMonitoring()
        break

      case 'sprint':
        console.log(chalk.blue('🏃‍♂️ Modo Sprint - Matrix Protocol System'))
        
        await system.start()
        
        // Execute sprint simulation
        const sprintTasks = [
          { agentName: 'alex-santos', taskType: 'sprint-planning', context: { goal: 'Sistema completo' } },
          { agentName: 'marina-costa', taskType: 'daily', context: { day: 1 } },
          { agentName: 'ricardo-lima', taskType: 'implementation', context: { feature: 'core-api' } },
          { agentName: 'camila-rodriguez', taskType: 'validation', context: { phase: 'integration' } },
          { agentName: 'alex-santos', taskType: 'retrospective', context: { sprint: 'completed' } }
        ]
        
        await system.executeAgentSequence(sprintTasks)
        system.displayStatus()
        await system.stop()
        break

      default:
        console.error(chalk.red(`❌ Modo desconhecido: ${mode}`))
        console.log(chalk.gray('Modos disponíveis: interactive, demo, monitoring, sprint'))
        process.exit(1)
    }

  } catch (error: any) {
    console.error(chalk.red('❌ Erro fatal:'), error.message)
    
    if (system.systemRunning) {
      await system.stop()
    }
    
    process.exit(1)
  }
}

// Execute main se chamado diretamente
if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('❌ Erro não tratado:'), error)
    process.exit(1)
  })
}