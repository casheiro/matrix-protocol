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
import * as inquirer from 'inquirer'
const ora = require('ora')
import * as cliProgress from 'cli-progress'
const chalk = require('chalk')

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
   * Executar agent individual com feedback visual
   */
  async executeAgent(agentName: string, prompt: string, context?: any): Promise<any> {
    if (!this.isRunning) {
      throw new Error('Sistema não está em execução')
    }

    // Criar spinner para feedback visual
    const spinner = ora({
      text: chalk.blue(`Iniciando execução do agent ${agentName}...`),
      color: 'cyan'
    }).start()

    const startTime = Date.now()
    let intervalId: NodeJS.Timeout | null = null

    try {
      // Atualizar spinner com timer
      intervalId = setInterval(() => {
        const elapsed = Math.round((Date.now() - startTime) / 1000)
        spinner.text = chalk.blue(`🤖 Executando ${agentName} | ⏱️  ${elapsed}s | 🔄 Aguardando resposta...`)
      }, 1000)

      // Executar agent
      const result = await this.claudeRunner.executeAgent(agentName, prompt, context)
      
      // Limpar interval e mostrar sucesso
      if (intervalId) clearInterval(intervalId)
      const totalTime = Math.round((Date.now() - startTime) / 1000)
      
      spinner.succeed(chalk.green(`✅ Agent ${agentName} executado com sucesso em ${totalTime}s`))
      
      this.executionHistory.push({
        agentName,
        prompt: prompt.substring(0, 100) + '...',
        timestamp: new Date(),
        success: true,
        result: result.substring(0, 200) + '...',
        executionTime: totalTime
      })

      return result

    } catch (error: any) {
      // Limpar interval e mostrar erro
      if (intervalId) clearInterval(intervalId)
      const totalTime = Math.round((Date.now() - startTime) / 1000)
      
      // Verificar se é rate limit para feedback específico
      if (this.claudeRunner.isRateLimitError(error.message)) {
        spinner.warn(chalk.yellow(`⏳ Rate limit detectado para ${agentName} após ${totalTime}s`))
        
        // Extrair tempo de reset da mensagem
        const resetMatch = error.message.match(/resets?\s+(?:at\s+)?(\d{1,2})(am|pm)/i)
        if (resetMatch) {
          const resetTime = `${resetMatch[1]}${resetMatch[2]}`
          console.log(chalk.blue(`🕒 Sistema aguardará até ${resetTime} para continuar`))
        }
      } else {
        spinner.fail(chalk.red(`❌ Erro na execução do agent ${agentName} após ${totalTime}s`))
        console.log(chalk.gray(`Detalhes: ${error.message}`))
      }
      
      this.executionHistory.push({
        agentName,
        prompt: prompt.substring(0, 100) + '...',
        timestamp: new Date(),
        success: false,
        error: error.message,
        executionTime: totalTime
      })

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
   * Executar demonstração completa do sistema com feedback visual
   */
  async runDemonstration(): Promise<void> {
    const demoSpinner = ora({
      text: chalk.blue('Preparando demonstração do Matrix Protocol System...'),
      color: 'cyan'
    }).start()
    
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
      demoSpinner.succeed(chalk.green('✅ Demonstração iniciada'))
      
      const results = await this.executeAgentSequence(demonstrations)
      
      const successCount = results.filter(r => r.success).length
      const failureCount = results.length - successCount
      
      console.log(chalk.green('\n🎉 Demonstração concluída!'))
      console.log(chalk.cyan('='.repeat(50)))
      console.log(chalk.yellow(`📊 RESUMO DA DEMONSTRAÇÃO:`))
      console.log(chalk.white(`✅ Sucessos: ${successCount}/${results.length}`))
      console.log(chalk.white(`❌ Falhas: ${failureCount}/${results.length}`))
      console.log(chalk.white(`🚀 Taxa de Sucesso: ${Math.round((successCount / results.length) * 100)}%`))
      console.log(chalk.cyan('='.repeat(50)))

    } catch (error: any) {
      demoSpinner.fail(chalk.red('❌ Erro na demonstração'))
      console.error(chalk.red('Detalhes:'), error.message)
      throw error
    }
  }

  /**
   * Mostrar status do sistema com visual aprimorado
   */
  displayStatus(): void {
    console.log(chalk.cyan('\n📊 Status do Matrix Protocol System'))
    console.log('=' .repeat(50))
    
    const rateLimitStatus = rateLimitHandler.getStatus()
    const claudeStatus = this.claudeRunner.getExecutionStatus()
    
    // Rate Limit Status com indicadores visuais
    const promptsRemaining = rateLimitStatus.state.promptsRemaining
    const promptsUsed = rateLimitStatus.state.promptsUsed
    const totalEstimated = promptsRemaining + promptsUsed
    
    let rateLimitColor = chalk.green
    if (promptsRemaining < 10) rateLimitColor = chalk.red
    else if (promptsRemaining < 20) rateLimitColor = chalk.yellow
    
    console.log(`🔋 Rate Limit: ${rateLimitColor(promptsRemaining)} prompts restantes`)
    
    // Barra visual de rate limit
    if (totalEstimated > 0) {
      const usedPercentage = Math.round((promptsUsed / totalEstimated) * 100)
      const barLength = 20
      const filledBars = Math.round((usedPercentage / 100) * barLength)
      const emptyBars = barLength - filledBars
      
      const progressBar = chalk.red('█'.repeat(filledBars)) + chalk.gray('░'.repeat(emptyBars))
      console.log(`📊 Uso: [${progressBar}] ${usedPercentage}% (${promptsUsed}/${totalEstimated})`)
    }
    
    // Status de reset com countdown
    if (rateLimitStatus.state.resetTime) {
      const resetTime = rateLimitStatus.state.resetTime
      const now = new Date()
      const timeUntilReset = resetTime.getTime() - now.getTime()
      
      if (timeUntilReset > 0) {
        const hours = Math.floor(timeUntilReset / (1000 * 60 * 60))
        const minutes = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60))
        console.log(`⏰ Próximo Reset: ${resetTime.toLocaleTimeString()} (${hours}h ${minutes}m)`)
      } else {
        console.log(`⏰ Próximo Reset: ${chalk.green('Disponível agora!')}`)
      }
    }
    
    // Claude Runner Status
    const runningColor = claudeStatus.running > 0 ? chalk.yellow : chalk.green
    console.log(`⚡ Claude Runner: ${runningColor(claudeStatus.running)} execuções ativas`)
    
    // System Status
    const systemStatusColor = this.isRunning ? chalk.green : chalk.red
    const systemStatusText = this.isRunning ? '🟢 Ativo' : '🔴 Inativo'
    console.log(`🎯 Status: ${systemStatusColor(systemStatusText)}`)
    
    // Execution History com detalhes
    console.log(`📈 Histórico: ${this.executionHistory.length} execuções realizadas`)
    
    if (this.executionHistory.length > 0) {
      const successCount = this.executionHistory.filter(h => h.success).length
      const failureCount = this.executionHistory.length - successCount
      const successRate = Math.round((successCount / this.executionHistory.length) * 100)
      
      let successRateColor = chalk.green
      if (successRate < 70) successRateColor = chalk.red
      else if (successRate < 90) successRateColor = chalk.yellow
      
      console.log(`✅ Sucessos: ${chalk.green(successCount)} | ❌ Falhas: ${chalk.red(failureCount)} | Taxa: ${successRateColor(successRate + '%')}`)
      
      // Mostrar execuções recentes
      const recentExecutions = this.executionHistory.slice(-3)
      console.log(chalk.gray('📋 Últimas execuções:'))
      recentExecutions.forEach(exec => {
        const status = exec.success ? chalk.green('✅') : chalk.red('❌')
        const time = exec.executionTime ? `${exec.executionTime}s` : 'N/A'
        const timestamp = new Date(exec.timestamp).toLocaleTimeString()
        console.log(chalk.gray(`   ${status} ${exec.agentName} - ${time} (${timestamp})`))
      })
    }
    
    console.log('=' .repeat(50))
  }

  /**
   * Obter histórico de execuções
   */
  getExecutionHistory(): any[] {
    return [...this.executionHistory]
  }

  /**
   * Menu interativo com opções reais
   */
  async runInteractiveMenu(): Promise<void> {
    while (this.isRunning) {
      console.log('\n' + '='.repeat(60))
      console.log(chalk.cyan('🎯 MATRIX PROTOCOL - MENU INTERATIVO'))
      console.log('='.repeat(60))
      
      this.displayStatus()
      
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'Escolha uma opção:',
          choices: [
            { name: '🤖 Executar Agent Individual', value: 'execute_agent' },
            { name: '🎭 Executar Demonstração Completa', value: 'run_demo' },
            { name: '🏃‍♂️ Executar Sprint REAL', value: 'run_sprint' },
            { name: '📊 Atualizar Status do Sistema', value: 'show_status' },
            { name: '🔋 Monitorar Rate Limits', value: 'monitor_limits' },
            { name: '🚪 Sair', value: 'exit' }
          ]
        }
      ])

      try {
        switch (action) {
          case 'execute_agent':
            await this.handleExecuteAgent()
            break
            
          case 'run_demo':
            await this.runDemonstration()
            break
            
          case 'run_sprint':
            await this.handleRealSprint()
            break
            
          case 'show_status':
            // Status já é mostrado no início do loop
            console.log(chalk.green('✅ Status atualizado'))
            break
            
          case 'monitor_limits':
            this.displayRateLimitDetails()
            break
            
          case 'exit':
            console.log(chalk.yellow('🛑 Finalizando sistema...'))
            await this.stop()
            return
            
          default:
            console.log(chalk.red('❌ Opção inválida'))
        }
        
        if (action !== 'exit') {
          await inquirer.prompt([
            {
              type: 'confirm',
              name: 'continue',
              message: 'Pressione Enter para voltar ao menu...',
              default: true
            }
          ])
        }
        
      } catch (error: any) {
        console.error(chalk.red('❌ Erro na execução:'), error.message)
        
        const { retry } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'retry',
            message: 'Tentar novamente?',
            default: true
          }
        ])
        
        if (!retry) {
          await this.stop()
          return
        }
      }
    }
  }

  /**
   * Executar agent individual via menu com feedback visual
   */
  private async handleExecuteAgent(): Promise<void> {
    const availableAgents = [
      { name: '🧑‍💼 Alex Santos (Tech Lead)', value: 'alex-santos' },
      { name: '👩‍💻 Marina Costa (Frontend)', value: 'marina-costa' },
      { name: '👨‍💻 Ricardo Lima (Backend)', value: 'ricardo-lima' },
      { name: '👩‍🔬 Camila Rodriguez (QA)', value: 'camila-rodriguez' },
      { name: '🎨 Bruno Oliveira (UX/UI)', value: 'bruno-oliveira' }
    ]

    const { agentName } = await inquirer.prompt([
      {
        type: 'list',
        name: 'agentName',
        message: 'Escolha o agent para executar:',
        choices: availableAgents
      }
    ])

    const { prompt } = await inquirer.prompt([
      {
        type: 'input',
        name: 'prompt',
        message: 'Digite o prompt para o agent:',
        validate: (input: string) => input.trim().length > 0 || 'Prompt não pode estar vazio'
      }
    ])

    console.log(chalk.blue(`\n🤖 Preparando execução personalizada...`))
    
    try {
      const result = await this.executeAgent(agentName, prompt)
      
      // Mostrar resultado com formato melhorado
      console.log(chalk.green('\n🎉 Execução concluída com sucesso!'))
      console.log(chalk.cyan('='.repeat(70)))
      console.log(chalk.yellow('📋 RESULTADO:'))
      console.log(chalk.gray('─'.repeat(70)))
      
      // Truncar resultado se muito longo
      const maxLength = 500
      const displayResult = result.length > maxLength 
        ? result.substring(0, maxLength) + chalk.gray('\n... (resultado truncado, verifique logs completos)')
        : result
      
      console.log(chalk.white(displayResult))
      console.log(chalk.gray('─'.repeat(70)))
      console.log(chalk.cyan('='.repeat(70)))
      
    } catch (error: any) {
      console.log(chalk.red('\n❌ Falha na execução personalizada'))
      console.log(chalk.gray(`Erro: ${error.message}`))
      
      // Oferecer opção de retry
      const { retry } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'retry',
          message: 'Tentar executar novamente?',
          default: false
        }
      ])
      
      if (retry) {
        await this.handleExecuteAgent() // Recursivo para retry
      }
    }
  }

  /**
   * Executar sprint REAL com progress tracking visual
   */
  private async handleRealSprint(): Promise<void> {
    console.log(chalk.blue('🏃‍♂️ Iniciando execução de Sprint REAL...'))
    
    // Definir fases do sprint
    const sprintPhases = [
      { 
        name: 'Sprint Planning', 
        icon: '📋', 
        agent: 'alex-santos',
        prompt: 'Conduza um sprint planning real para o dynamic navigation system. Analise o backlog atual, estime esforço das tarefas, defina metas claras do sprint e identifique possíveis riscos ou dependências.'
      },
      { 
        name: 'Daily Scrum', 
        icon: '📅', 
        agent: 'marina-costa',
        prompt: 'Conduza uma daily scrum reportando o progresso atual do desenvolvimento frontend do dynamic navigation. Identifique impedimentos e próximos passos.'
      },
      { 
        name: 'Implementation', 
        icon: '⚡', 
        agent: 'ricardo-lima',
        prompt: 'Execute a implementação das APIs do dynamic navigation system. Desenvolva os endpoints necessários seguindo as especificações técnicas.'
      },
      { 
        name: 'Validation', 
        icon: '🔍', 
        agent: 'camila-rodriguez',
        prompt: 'Execute validação completa do dynamic navigation system. Teste as funcionalidades implementadas e verifique critérios de aceitação.'
      },
      { 
        name: 'Retrospective', 
        icon: '🔄', 
        agent: 'alex-santos',
        prompt: 'Conduza uma retrospectiva do sprint de dynamic navigation. Analise o que funcionou bem, identifique pontos de melhoria e proponha ações para próximos sprints.'
      }
    ]

    // Criar barra de progresso
    const progressBar = new cliProgress.SingleBar({
      format: '🏃‍♂️ Sprint Progress |' + chalk.cyan('{bar}') + '| {percentage}% | {value}/{total} Fases | {phase}',
      barCompleteChar: '█',
      barIncompleteChar: '░',
      hideCursor: true
    }, cliProgress.Presets.shades_classic)

    progressBar.start(sprintPhases.length, 0, { phase: 'Preparando...' })

    const sprintStartTime = Date.now()
    const phaseResults: any[] = []

    try {
      // Executar cada fase com tracking visual
      for (let i = 0; i < sprintPhases.length; i++) {
        const phase = sprintPhases[i]
        
        // Atualizar progress bar
        progressBar.update(i, { phase: `${phase.icon} ${phase.name}` })
        
        console.log(chalk.cyan(`\n${phase.icon} FASE ${i + 1}: ${phase.name}`))
        
        const phaseStartTime = Date.now()
        
        try {
          // Executar agent da fase
          const result = await this.executeAgent(phase.agent, phase.prompt)
          
          const phaseTime = Math.round((Date.now() - phaseStartTime) / 1000)
          
          phaseResults.push({
            phase: phase.name,
            agent: phase.agent,
            success: true,
            executionTime: phaseTime,
            result: result.substring(0, 150) + '...'
          })
          
          console.log(chalk.green(`✅ ${phase.name} concluída em ${phaseTime}s`))
          
        } catch (error: any) {
          const phaseTime = Math.round((Date.now() - phaseStartTime) / 1000)
          
          phaseResults.push({
            phase: phase.name,
            agent: phase.agent,
            success: false,
            executionTime: phaseTime,
            error: error.message
          })
          
          console.log(chalk.red(`❌ Erro na ${phase.name} após ${phaseTime}s`))
          
          // Perguntar se deve continuar
          progressBar.stop()
          const { shouldContinue } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'shouldContinue',
              message: `Erro na fase ${phase.name}. Continuar com próxima fase?`,
              default: true
            }
          ])
          
          if (!shouldContinue) {
            throw new Error(`Sprint interrompido na fase: ${phase.name}`)
          }
          
          progressBar.start(sprintPhases.length, i, { phase: 'Continuando...' })
        }
      }
      
      // Finalizar progress bar
      progressBar.update(sprintPhases.length, { phase: 'Sprint Concluído! ✅' })
      progressBar.stop()
      
      const totalSprintTime = Math.round((Date.now() - sprintStartTime) / 1000)
      const successfulPhases = phaseResults.filter(p => p.success).length
      
      console.log(chalk.green('\n🎉 Sprint REAL executado com sucesso!'))
      console.log(chalk.cyan('='.repeat(60)))
      console.log(chalk.yellow(`📊 RESUMO DO SPRINT:`))
      console.log(chalk.white(`⏱️  Tempo Total: ${Math.floor(totalSprintTime / 60)}m ${totalSprintTime % 60}s`))
      console.log(chalk.white(`✅ Fases Concluídas: ${successfulPhases}/${sprintPhases.length}`))
      console.log(chalk.white(`🚀 Taxa de Sucesso: ${Math.round((successfulPhases / sprintPhases.length) * 100)}%`))
      
      // Mostrar detalhes de cada fase
      console.log(chalk.cyan('\n📋 DETALHES POR FASE:'))
      phaseResults.forEach((phase, index) => {
        const status = phase.success ? chalk.green('✅') : chalk.red('❌')
        const time = `${phase.executionTime}s`
        console.log(`${status} ${index + 1}. ${phase.phase} (${phase.agent}) - ${time}`)
      })
      
      console.log(chalk.cyan('='.repeat(60)))
      
    } catch (error: any) {
      progressBar.stop()
      console.log(chalk.red(`❌ Sprint interrompido: ${error.message}`))
      
      // Mostrar resultados parciais
      if (phaseResults.length > 0) {
        console.log(chalk.yellow('\n📊 PROGRESSO PARCIAL:'))
        phaseResults.forEach((phase, index) => {
          const status = phase.success ? chalk.green('✅') : chalk.red('❌')
          console.log(`${status} ${index + 1}. ${phase.phase} - ${phase.executionTime}s`)
        })
      }
      
      throw error
    }
  }

  /**
   * Mostrar detalhes dos rate limits
   */
  private displayRateLimitDetails(): void {
    console.log(chalk.cyan('\n🔋 DETALHES DOS RATE LIMITS'))
    console.log('=' .repeat(50))
    
    const rateLimitStatus = rateLimitHandler.getStatus()
    
    console.log(`📊 Prompts Restantes: ${rateLimitStatus.state.promptsRemaining}`)
    console.log(`⏰ Próximo Reset: ${rateLimitStatus.state.resetTime?.toLocaleTimeString() || 'Não definido'}`)
    console.log(`🔄 Estado Atual: ${rateLimitStatus.state.isLimited ? 'Limitado' : 'Disponível'}`)
    console.log(`📈 Ciclo Atual: ${rateLimitStatus.state.currentCycle}`)
    console.log(`📋 Prompts Usados: ${rateLimitStatus.state.promptsUsed}`)
    
    if (rateLimitStatus.state.isLimited && rateLimitStatus.state.resetTime) {
      const waitTime = rateLimitStatus.state.resetTime.getTime() - Date.now()
      if (waitTime > 0) {
        console.log(`⏳ Tempo até liberação: ${Math.round(waitTime / 60000)} minutos`)
      }
    }
    
    console.log('=' .repeat(50))
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
        console.log(chalk.gray('Use as setas para navegar e Enter para selecionar'))
        
        await system.start()
        await system.runInteractiveMenu()
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