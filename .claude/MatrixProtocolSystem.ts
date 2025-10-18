/**
 * MatrixProtocolSystem - Sistema principal simplificado
 * 
 * Foca na funcionalidade essencial: execução real de Claude agents
 * com gerenciamento de rate limits otimizado para Claude Code Pro plan
 */

import { TaskDelegator, taskDelegator } from './core/TaskDelegator'
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

interface SprintDefinition {
  id: string
  name: string
  description: string
  objectives: string[]
  phases: SprintPhase[]
  estimatedDuration: string
  status: 'planned' | 'not_started' | 'in_progress' | 'completed' | 'failed' | 'archived'
  priority: 'low' | 'medium' | 'high' | 'critical'
  tags: string[]
  created: Date
  lastExecuted?: Date
  executionCount: number
  source?: 'execution' | 'backlog' // Indicar fonte da descoberta
}

interface SprintPhase {
  name: string
  icon: string
  agent: string
  prompt: string
  estimatedTime: number // em minutos
  dependencies?: string[]
}

interface SprintExecution {
  sprintId: string
  executionId: string
  startTime: Date
  endTime?: Date
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  phases: SprintPhaseResult[]
  totalTime?: number
  successRate: number
}

interface SprintPhaseResult {
  phaseName: string
  agent: string
  success: boolean
  executionTime: number
  result?: string
  error?: string
  timestamp: Date
}

export class MatrixProtocolSystem {
  private taskDelegator: TaskDelegator
  private configuration: SystemConfiguration
  private isRunning: boolean = false
  private executionHistory: any[] = []
  private sprintCatalog: Map<string, SprintDefinition> = new Map()
  private sprintExecutions: Map<string, SprintExecution[]> = new Map()
  private currentSprintExecution: SprintExecution | null = null

  constructor(config?: Partial<SystemConfiguration>) {
    this.configuration = {
      enableMonitoring: true,
      maxConcurrentAgents: 3,
      debugMode: process.env.NODE_ENV === 'development',
      ...config
    }

    this.taskDelegator = taskDelegator
    this.initializeSprintCatalog()
  }

  /**
   * Verificar se sistema está em execução
   */
  get systemRunning(): boolean {
    return this.isRunning
  }

  /**
   * Inicializar catálogo de sprints baseado nas documentações reais
   */
  private initializeSprintCatalog(): void {
    try {
      // Descobrir sprints da estrutura de documentação
      const sprints = this.discoverSprintsFromDocs()
      
      // Carregar sprints no catálogo
      sprints.forEach(sprint => {
        this.sprintCatalog.set(sprint.id, sprint)
        this.sprintExecutions.set(sprint.id, [])
      })

      console.log(chalk.gray(`📚 Catálogo inicializado com ${sprints.length} sprints reais descobertas`))
      
    } catch (error: any) {
      console.error(chalk.red('❌ Erro ao inicializar catálogo de sprints:'), error.message)
      // Fallback para sprints mínimas
      this.initializeFallbackSprints()
    }
  }

  /**
   * Descobrir todas as sprints: executadas + planejadas
   */
  private discoverSprintsFromDocs(): SprintDefinition[] {
    try {
      // 1. Descobrir sprints executadas (com arquivos físicos)
      const executedSprints = this.discoverExecutedSprints()
      
      // 2. Descobrir sprints planejadas do backlog
      const plannedSprints = this.discoverPlannedSprintsFromBacklog()
      
      // 3. Integrar e resolver conflitos
      const allSprints = this.integrateSprintData(executedSprints, plannedSprints)
      
      console.log(chalk.gray(`📊 Descobertas: ${executedSprints.length} executadas + ${plannedSprints.length} planejadas = ${allSprints.length} total`))
      
      return allSprints
      
    } catch (error: any) {
      console.error(chalk.yellow('⚠️ Erro ao descobrir sprints:'), error.message)
      throw error
    }
  }

  /**
   * Descobrir sprints executadas da estrutura de documentação
   */
  private discoverExecutedSprints(): SprintDefinition[] {
    const docsPath = path.join(process.cwd(), '../website/docs/dynamic-navigation')
    const executionPath = path.join(docsPath, '02-execution')
    const sprintReportsPath = path.join(executionPath, 'sprint-reports')
    
    const discoveredSprints: SprintDefinition[] = []
    
    // Verificar se diretórios existem
    if (!fs.existsSync(executionPath)) {
      throw new Error(`Diretório de execução não encontrado: ${executionPath}`)
    }
    
    try {
      // 1. Procurar por arquivos de planning record
      const files = fs.readdirSync(executionPath)
      const planningFiles = files.filter(file => 
        file.startsWith('SPRINT_') && 
        file.includes('_PLANNING_RECORD.md')
      )
      
      for (const planningFile of planningFiles) {
        const sprintNumber = this.extractSprintNumber(planningFile)
        if (sprintNumber) {
          const sprint = this.parsePlanningRecord(executionPath, planningFile, sprintNumber)
          if (sprint) {
            sprint.source = 'execution'
            this.enrichSprintWithExecutionData(sprint, sprintReportsPath)
            discoveredSprints.push(sprint)
          }
        }
      }
      
      // 2. Verificar por sprints sem planning record mas com reports
      this.discoverSprintsFromReports(sprintReportsPath, discoveredSprints)
      
      return discoveredSprints
      
    } catch (error: any) {
      console.error(chalk.yellow('⚠️ Erro ao descobrir sprints executadas:'), error.message)
      throw error
    }
  }

  /**
   * Extrair número da sprint do nome do arquivo
   */
  private extractSprintNumber(filename: string): string | null {
    const match = filename.match(/SPRINT_(\d+)_/)
    return match ? match[1] : null
  }

  /**
   * Fazer parse do planning record de uma sprint
   */
  private parsePlanningRecord(executionPath: string, filename: string, sprintNumber: string): SprintDefinition | null {
    try {
      const filePath = path.join(executionPath, filename)
      const content = fs.readFileSync(filePath, 'utf-8')
      
      // Extrair informações básicas do markdown
      const titleMatch = content.match(/##\s*🚀\s*SPRINT GOAL[\s\S]*?>\s*\*\*([\s\S]*?)\*\*/)
      const sprintGoal = titleMatch ? titleMatch[1].trim() : `Sprint ${sprintNumber}`
      
      // Extrair milestones
      const milestonesRegex = /### \*\*MILESTONE \d+\.\d+:(.*?)\*\*([\s\S]*?)(?=### \*\*MILESTONE|\*\*TOTAL COMMITADO\*\*|$)/g
      const phases: SprintPhase[] = []
      let match
      
      while ((match = milestonesRegex.exec(content)) !== null) {
        const milestoneName = match[1].trim()
        const milestoneContent = match[2]
        
        const responsibleMatch = milestoneContent.match(/\*\*Responsável\*\*:\s*([\s\S]*?)\s*\(/)
        const scopeMatch = milestoneContent.match(/\*\*Escopo\*\*:\s*([\s\S]*?)(?:\n|$)/)
        const estimativeMatch = milestoneContent.match(/\*\*Estimativa\*\*:\s*(\d+)h/)
        
        const responsible = responsibleMatch ? responsibleMatch[1].trim() : 'alex-santos'
        const scope = scopeMatch ? scopeMatch[1].trim() : milestoneName
        const estimatedTime = estimativeMatch ? parseInt(estimativeMatch[1]) * 60 : 60 // converter para minutos
        
        phases.push({
          name: milestoneName,
          icon: this.getPhaseIcon(milestoneName),
          agent: this.mapResponsibleToAgent(responsible),
          prompt: this.buildPhasePrompt(milestoneName, scope),
          estimatedTime
        })
      }
      
      return {
        id: `sprint-${sprintNumber}`,
        name: sprintGoal,
        description: `Sprint ${sprintNumber} - Extracted from planning record`,
        objectives: this.extractObjectives(content),
        phases,
        estimatedDuration: this.calculateEstimatedDuration(phases),
        status: 'not_started',
        priority: this.determinePriority(content),
        tags: this.extractTags(content),
        created: new Date(),
        executionCount: 0
      }
      
    } catch (error: any) {
      console.error(chalk.red(`❌ Erro ao parse planning record ${filename}:`), error.message)
      return null
    }
  }

  /**
   * Extrair objetivos do conteúdo do planning record
   */
  private extractObjectives(content: string): string[] {
    const objectives: string[] = []
    
    // Procurar por Success Criteria
    const successCriteriaMatch = content.match(/### \*\*Success Criteria:\*\*([\s\S]*?)(?:\n###|\n\*\*|$)/)
    if (successCriteriaMatch) {
      const criteriaLines = successCriteriaMatch[1].split('\n')
      criteriaLines.forEach(line => {
        const trimmed = line.trim()
        if (trimmed.startsWith('- ✅') || trimmed.startsWith('- ')) {
          objectives.push(trimmed.replace(/^- (✅\s*)?/, ''))
        }
      })
    }
    
    return objectives.length > 0 ? objectives : ['Atingir metas da sprint']
  }

  /**
   * Obter ícone da fase baseado no nome
   */
  private getPhaseIcon(milestoneName: string): string {
    if (milestoneName.toLowerCase().includes('planning') || milestoneName.toLowerCase().includes('analysis')) {
      return '📋'
    }
    if (milestoneName.toLowerCase().includes('frontend') || milestoneName.toLowerCase().includes('component')) {
      return '🎨'
    }
    if (milestoneName.toLowerCase().includes('backend') || milestoneName.toLowerCase().includes('api')) {
      return '⚡'
    }
    if (milestoneName.toLowerCase().includes('qa') || milestoneName.toLowerCase().includes('testing') || milestoneName.toLowerCase().includes('validation')) {
      return '🔍'
    }
    if (milestoneName.toLowerCase().includes('multilingual') || milestoneName.toLowerCase().includes('i18n')) {
      return '🌍'
    }
    
    return '🔧'
  }

  /**
   * Mapear responsável para agent
   */
  private mapResponsibleToAgent(responsible: string): string {
    const mapping: { [key: string]: string } = {
      'Alex Santos': 'alex-santos',
      'Marina Costa': 'marina-costa',
      'Ricardo Lima': 'ricardo-lima',
      'Camila Rodriguez': 'camila-rodriguez',
      'Bruno Oliveira': 'bruno-oliveira'
    }
    
    return mapping[responsible] || 'alex-santos'
  }

  /**
   * Converter estimativa para minutos
   */
  private parseEstimatedTime(estimativeText: string): number {
    const hourMatch = estimativeText.match(/(\d+)h/)
    if (hourMatch) {
      return parseInt(hourMatch[1]) * 60 // converter para minutos
    }
    
    // Fallback para 60 minutos
    return 60
  }

  /**
   * Construir prompt da fase baseado no contexto
   */
  private buildPhasePrompt(milestoneName: string, scope: string): string {
    const baseContext = `Como especialista técnico no Matrix Protocol`
    
    if (scope.toLowerCase().includes('análise') || scope.toLowerCase().includes('analysis')) {
      return `${baseContext}, execute análise detalhada: ${scope}. Forneça insights técnicos, identifique padrões e documente findings para implementação.`
    }
    
    if (scope.toLowerCase().includes('api') || scope.toLowerCase().includes('endpoints')) {
      return `${baseContext}, desenvolva ${scope}. Implemente endpoints REST robustos, documentação OpenAPI e testes de integração.`
    }
    
    if (scope.toLowerCase().includes('component') || scope.toLowerCase().includes('frontend')) {
      return `${baseContext}, desenvolva ${scope}. Crie componentes Vue 3 responsivos, acessíveis e integrados com a API.`
    }
    
    if (scope.toLowerCase().includes('multilingual') || scope.toLowerCase().includes('i18n')) {
      return `${baseContext}, implemente ${scope}. Configure suporte multilíngue completo com fallbacks inteligentes.`
    }
    
    if (scope.toLowerCase().includes('testing') || scope.toLowerCase().includes('qa') || scope.toLowerCase().includes('validation')) {
      return `${baseContext}, execute ${scope}. Desenvolva testes abrangentes, validações automatizadas e relatórios de qualidade.`
    }
    
    // Prompt genérico baseado no escopo
    return `${baseContext}, execute ${milestoneName}: ${scope}. Implemente conforme especificações técnicas e padrões de qualidade estabelecidos.`
  }

  /**
   * Calcular duração estimada total
   */
  private calculateEstimatedDuration(phases: SprintPhase[]): string {
    const totalMinutes = phases.reduce((sum, phase) => sum + phase.estimatedTime, 0)
    
    if (totalMinutes > 60) {
      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60
      const days = Math.ceil(hours / 8)
      return `${hours}h (${days} dias)`
    }
    
    return 'A definir'
  }

  /**
   * Determinar prioridade baseada no conteúdo
   */
  private determinePriority(content: string): 'low' | 'medium' | 'high' | 'critical' {
    const text = content.toLowerCase()
    if (text.includes('crítico') || text.includes('critical') || text.includes('bloqueador')) {
      return 'critical'
    }
    if (text.includes('alta') || text.includes('high') || text.includes('urgente')) {
      return 'high'
    }
    if (text.includes('média') || text.includes('medium')) {
      return 'medium'
    }
    
    return 'medium'
  }

  /**
   * Extrair tags do conteúdo
   */
  private extractTags(content: string): string[] {
    const tags: string[] = []
    const text = content.toLowerCase()
    
    if (text.includes('navigation') || text.includes('navegação')) tags.push('navigation')
    if (text.includes('api') || text.includes('endpoints')) tags.push('api')
    if (text.includes('frontend') || text.includes('vue') || text.includes('nuxt')) tags.push('frontend')
    if (text.includes('backend') || text.includes('server')) tags.push('backend')
    if (text.includes('testing') || text.includes('qa')) tags.push('testing')
    if (text.includes('i18n') || text.includes('multilingual')) tags.push('i18n')
    if (text.includes('optimization') || text.includes('performance')) tags.push('optimization')
    
    return tags.length > 0 ? tags : ['general']
  }

  /**
   * Enriquecer sprint com dados de execução dos reports
   */
  private enrichSprintWithExecutionData(sprint: SprintDefinition, sprintReportsPath: string): void {
    try {
      if (!fs.existsSync(sprintReportsPath)) {
        return
      }
      
      const reportFiles = fs.readdirSync(sprintReportsPath)
      const sprintReports = reportFiles.filter(file => 
        file.includes(`sprint-${sprint.id.split('-')[1]}`) && file.endsWith('.json')
      )
      
      let reportData: any = null
      
      if (sprintReports.length > 0) {
        // Pegar o report mais recente
        const latestReport = sprintReports.sort().pop()
        const reportPath = path.join(sprintReportsPath, latestReport!)
        reportData = JSON.parse(fs.readFileSync(reportPath, 'utf-8'))
        
        // Atualizar status baseado no report
        if (reportData.finalVerdict === 'SPRINT_SUCCESS') {
          sprint.status = 'completed'
        } else if (reportData.finalVerdict === 'SPRINT_NEEDS_WORK') {
          sprint.status = 'failed'
        }
      }
      
      // Incrementar contador de execução se há reports
      sprint.executionCount = sprintReports.length
      
      // Atualizar última execução
      if (reportData && reportData.timestamp) {
        sprint.lastExecuted = new Date(reportData.timestamp)
      }
      
    } catch (error: any) {
      console.error(chalk.yellow(`⚠️ Erro ao enriquecer sprint ${sprint.id}:`), error.message)
    }
  }

  /**
   * Descobrir sprints que só existem como reports
   */
  private discoverSprintsFromReports(sprintReportsPath: string, existingSprints: SprintDefinition[]): void {
    try {
      if (!fs.existsSync(sprintReportsPath)) {
        return
      }
      
      const reportFiles = fs.readdirSync(sprintReportsPath)
      const sprintNumbers = new Set<string>()
      
      // Coletar números de sprints dos reports
      reportFiles.forEach(file => {
        const match = file.match(/sprint-(\d+)/)
        if (match) {
          sprintNumbers.add(match[1])
        }
      })
      
      // Verificar se há sprints sem planning record
      sprintNumbers.forEach(sprintNumber => {
        const existingSprint = existingSprints.find(s => s.id === `sprint-${sprintNumber}`)
        
        if (!existingSprint) {
          const sprint = this.createSprintFromReport(sprintReportsPath, sprintNumber)
          if (sprint) {
            existingSprints.push(sprint)
          }
        }
      })
      
    } catch (error: any) {
      console.error(chalk.yellow('⚠️ Erro ao descobrir sprints dos reports:'), error.message)
    }
  }

  /**
   * Criar sprint baseado apenas nos reports
   */
  private createSprintFromReport(sprintReportsPath: string, sprintNumber: string): SprintDefinition | null {
    try {
      const reportFiles = fs.readdirSync(sprintReportsPath)
      const sprintReportFiles = reportFiles.filter(file => 
        file.includes(`sprint-${sprintNumber}`) && file.endsWith('.json')
      )
      
      if (sprintReportFiles.length === 0) {
        return null
      }
      
      // Pegar o report mais recente
      const latestReport = sprintReportFiles.sort().pop()!
      const reportPath = path.join(sprintReportsPath, latestReport)
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'))
      
      // Criar fases baseadas no report
      const phases: SprintPhase[] = []
      if (report.teamPerformance) {
        Object.entries(report.teamPerformance).forEach(([agentKey, data]: [string, any]) => {
          phases.push({
            name: data.responsibility || 'Task execution',
            icon: '🔧',
            agent: this.mapAgentKey(agentKey),
            prompt: `Execute task: ${data.responsibility}`,
            estimatedTime: 60
          })
        })
      }
      
      // Determinar status baseado no verdict
      let status: 'not_started' | 'in_progress' | 'completed' | 'failed' = 'not_started'
      if (report.finalVerdict === 'SPRINT_SUCCESS') {
        status = 'completed'
      } else if (report.finalVerdict === 'SPRINT_NEEDS_WORK') {
        status = 'failed'
      }
      
      return {
        id: `sprint-${sprintNumber}`,
        name: report.sprintGoal || `Sprint ${sprintNumber}`,
        description: `Sprint ${sprintNumber} - Extracted from execution report`,
        objectives: [report.sprintGoal || 'Objetivos da sprint'],
        phases,
        estimatedDuration: '2-4h',
        status,
        priority: 'medium',
        tags: ['report-based'],
        created: new Date(),
        lastExecuted: report.timestamp ? new Date(report.timestamp) : undefined,
        executionCount: sprintReportFiles.length
      }
      
    } catch (error: any) {
      console.error(chalk.red(`❌ Erro ao criar sprint do report ${sprintNumber}:`), error.message)
      return null
    }
  }

  /**
   * Mapear chave do agent para nome completo
   */
  private mapAgentKey(agentKey: string): string {
    const mapping: { [key: string]: string } = {
      'bruno': 'bruno-oliveira',
      'marina': 'marina-costa',
      'ricardo': 'ricardo-lima',
      'camila': 'camila-rodriguez',
      'alex': 'alex-santos'
    }
    
    return mapping[agentKey] || 'alex-santos'
  }

  /**
   * Fallback para sprints mínimas caso descoberta falhe
   */
  private initializeFallbackSprints(): void {
    console.log(chalk.yellow('⚠️ Usando sprints de fallback'))
    
    const fallbackSprints: SprintDefinition[] = [
      {
        id: 'basic-navigation-setup',
        name: 'Basic Navigation Setup',
        description: 'Configuração básica de navegação para teste do sistema',
        objectives: [
          'Testar sistema de execução',
          'Validar agents',
          'Verificar integração'
        ],
        phases: [
          {
            name: 'Setup Básico',
            icon: '🔧',
            agent: 'alex-santos',
            prompt: 'Implemente componentes básicos de navegação.',
            estimatedTime: 120
          }
        ],
        estimatedDuration: '3h',
        status: 'not_started',
        priority: 'medium',
        tags: ['fallback', 'basic'],
        created: new Date(),
        executionCount: 0
      }
    ]
    
    fallbackSprints.forEach(sprint => {
      this.sprintCatalog.set(sprint.id, sprint)
      this.sprintExecutions.set(sprint.id, [])
    })

    console.log(chalk.gray(`📚 Catálogo inicializado com ${fallbackSprints.length} sprints de fallback`))
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
    
    // Verificar se diretório de agents existe
    if (!fs.existsSync(agentsDir)) {
      throw new Error(`Diretório de agents não encontrado: ${agentsDir}`)
    }

    // Verificar cada agent file
    for (const agent of requiredAgents) {
      const agentPath = path.join(agentsDir, agent)
      if (!fs.existsSync(agentPath)) {
        throw new Error(`Agent file não encontrado: ${agentPath}`)
      }

      const content = fs.readFileSync(agentPath, 'utf-8')
      if (!content.trim()) {
        console.log(chalk.yellow(`⚠️ Agent file está vazio: ${agentPath}`))
      }
    }

    // Verificar disponibilidade do Task tool
    const taskToolAvailable = await TaskDelegator.checkTaskToolAvailable()
    if (!taskToolAvailable) {
      console.log(chalk.yellow('⚠️ Task tool não detectado - modo de simulação'))
    } else {
      console.log(chalk.green('✅ Task tool detectado e disponível'))
    }

    console.log(chalk.green('✅ Validação do ambiente completada'))
  }

  /**
   * Iniciar o sistema
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
      console.log(chalk.gray(`📊 ${this.sprintCatalog.size} sprints disponíveis no catálogo`))
      
    } catch (error: any) {
      console.error(chalk.red('❌ Falha na inicialização do sistema:'), error.message)
      throw error
    }
  }

  /**
   * Parar o sistema
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      console.log(chalk.yellow('⚠️ Sistema não está em execução'))
      return
    }

    try {
      // Interromper execução atual se houver
      if (this.currentSprintExecution) {
        this.currentSprintExecution.status = 'cancelled'
        this.currentSprintExecution.endTime = new Date()
        this.currentSprintExecution = null
      }

      this.isRunning = false
      console.log(chalk.green('🛑 Matrix Protocol System finalizado'))
      
    } catch (error: any) {
      console.error(chalk.red('❌ Erro ao parar sistema:'), error.message)
    }
  }

  /**
   * Executar um agent específico
   */
  async executeAgent(agentName: string, prompt: string, context: any = {}): Promise<any> {
    if (!this.isRunning) {
      throw new Error('Sistema não está em execução')
    }

    // Criar spinner para feedback visual
    const spinner = ora({
      text: chalk.blue(`Executando ${agentName}...`),
      color: 'cyan'
    }).start()

    const startTime = Date.now()
    let executionTimer: NodeJS.Timeout | null = null

    try {
      // Configurar timeout visual
      let timeElapsed = 0
      executionTimer = setInterval(() => {
        timeElapsed = Math.floor((Date.now() - startTime) / 1000)
        spinner.text = chalk.blue(`⚡ Executando ${agentName}... (${timeElapsed}s)`)
      }, 1000)

      // Executar via Task Delegator com tools nativos do Claude Code
      const result = await this.taskDelegator.executeAgent(agentName, this.buildPrompt(agentName, 'execute', { prompt, ...context }))
      
      if (executionTimer) {
        clearTimeout(executionTimer)
        executionTimer = null
      }

      const totalTime = Math.floor((Date.now() - startTime) / 1000)
      spinner.succeed(chalk.green(`✅ ${agentName} executado com sucesso em ${totalTime}s`))
      
      this.executionHistory.push({
        agentName,
        prompt,
        success: true,
        executionTime: totalTime,
        timestamp: new Date()
      })

      return result
      
    } catch (error: any) {
      if (executionTimer) {
        clearTimeout(executionTimer)
        executionTimer = null
      }

      const totalTime = Math.floor((Date.now() - startTime) / 1000)
      
      // Verificar se é erro de rate limit
      if (error.message.includes('rate limit') || error.message.includes('too many requests')) {
        spinner.warn(chalk.yellow(`⏳ Rate limit detectado para ${agentName} após ${totalTime}s`))
        
        // Extrair tempo de reset se disponível
        const resetMatch = error.message.match(/try again in (\d+)(\w+)/)
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
        prompt,
        success: false,
        error: error.message,
        executionTime: totalTime,
        timestamp: new Date()
      })

      throw error
    }
  }

  /**
   * Executar sequência de agents
   */
  async executeAgentSequence(executions: AgentExecution[]): Promise<any[]> {
    console.log(chalk.cyan(`🔄 Executando sequência de ${executions.length} agents...`))
    const results = []

    for (const execution of executions) {
      try {
        const result = await this.executeAgent(execution.agentName, this.buildPrompt(execution.agentName, execution.taskType, execution.context), execution.context)
        results.push({ agentName: execution.agentName, result, success: true })
      } catch (error: any) {
        console.log(chalk.yellow(`⚠️ Continuando sequência apesar do erro em ${execution.agentName}`))
        results.push({ agentName: execution.agentName, error: error.message, success: false })
      }
    }

    return results
  }

  /**
   * Construir prompt personalizado para cada agent e tipo de tarefa
   */
  buildPrompt(agentName: string, taskType: string, context: any = {}): string {
    const basePrompts = {
      'sprint-planning': `Como ${agentName}, conduza um sprint planning detalhado:

- Analise os objetivos e escopo do sprint
- Quebre tarefas em unidades executáveis
- Estime tempo e esforço necessário
- Identifique riscos e dependências
- Defina critérios de sucesso claros

Context: ${JSON.stringify(context, null, 2)}`,

      'frontend-development': `Como ${agentName}, desenvolva os componentes frontend:

- Implemente componentes Vue 3 responsivos
- Garanta acessibilidade (WCAG AA)
- Otimize performance e bundle size
- Integre com APIs backend
- Execute testes unitários

Context: ${JSON.stringify(context, null, 2)}`,

      'backend-development': `Como ${agentName}, desenvolva a infraestrutura backend:

- Implemente APIs REST robustas
- Configure validação e autenticação
- Otimize performance de banco de dados
- Implemente logging e monitoramento
- Execute testes de integração

Context: ${JSON.stringify(context, null, 2)}`,

      'qa-testing': `Como ${agentName}, execute validação e testes:

- Desenvolva casos de teste abrangentes
- Execute testes manuais e automatizados
- Valide acessibilidade e usabilidade
- Verifique performance e segurança
- Documente bugs e melhorias

Context: ${JSON.stringify(context, null, 2)}`,

      'sprint-retrospective': `Como ${agentName}, conduza retrospectiva da sprint:

- Analise o que funcionou bem
- Identifique oportunidades de melhoria
- Avalie cumprimento dos objetivos
- Colete métricas de velocity e qualidade
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
        taskType: 'frontend-development',
        context: {
          feature: 'Frontend navigation components',
          technology: 'Vue 3 + Nuxt'
        }
      },
      {
        agentName: 'ricardo-lima',
        taskType: 'backend-development',
        context: {
          feature: 'Backend API endpoints',
          technology: 'Node.js + TypeScript'
        }
      },
      {
        agentName: 'camila-rodriguez',
        taskType: 'qa-testing',
        context: {
          testTypes: ['unit', 'integration', 'e2e'],
          coverage: 'minimum 80%'
        }
      },
      {
        agentName: 'alex-santos',
        taskType: 'sprint-retrospective',
        context: {
          sprintCompleted: true,
          velocity: 'as planned'
        }
      }
    ]

    try {
      demoSpinner.succeed(chalk.green('✅ Demonstração preparada'))
      
      console.log(chalk.cyan('🎭 Iniciando demonstração dos agents...'))
      const results = await this.executeAgentSequence(demonstrations)
      
      // Resumo da demonstração
      const successCount = results.filter(r => r.success).length
      const failureCount = results.length - successCount
      
      console.log(chalk.cyan('\n📊 RESUMO DA DEMONSTRAÇÃO'))
      console.log('='.repeat(50))
      console.log(chalk.white(`✅ Agents executados com sucesso: ${successCount}/${results.length}`))
      console.log(chalk.white(`❌ Falhas: ${failureCount}/${results.length}`))
      console.log(chalk.white(`🎯 Taxa de sucesso: ${Math.round((successCount / results.length) * 100)}%`))
      
    } catch (error: any) {
      demoSpinner.fail(chalk.red('❌ Erro na demonstração'))
      console.error(chalk.red('Detalhes:'), error.message)
      throw error
    }
  }

  /**
   * Exibir status detalhado do sistema
   */
  displayStatus(): void {
    console.log(chalk.cyan('\n📊 MATRIX PROTOCOL SYSTEM STATUS'))
    console.log('='.repeat(80))
    
    // Rate Limit Status
    const rateLimitStatus = rateLimitHandler.getStatus()
    const claudeStatus = this.taskDelegator.getExecutionStatus()
    
    // Prompts disponíveis
    const promptsRemaining = rateLimitStatus.state.promptsRemaining
    const promptsUsed = rateLimitStatus.state.promptsUsed
    const totalEstimated = promptsRemaining + promptsUsed
    
    // Rate limit visual
    if (promptsRemaining > 0) {
      const usedPercentage = Math.round((promptsUsed / totalEstimated) * 100)
      const rateLimitColor = promptsRemaining > 10 ? chalk.green : (promptsRemaining > 5 ? chalk.yellow : chalk.red)
      
      const filledBars = Math.floor((promptsUsed / totalEstimated) * 20)
      const emptyBars = 20 - filledBars
      const progressBar = chalk.red('█'.repeat(filledBars)) + chalk.gray('░'.repeat(emptyBars))
      console.log(`📊 Uso: [${progressBar}] ${usedPercentage}% (${promptsUsed}/${totalEstimated})`)
    }
    
    // Status de reset com countdown
    if (rateLimitStatus.state.resetTime) {
      const resetTime = new Date(rateLimitStatus.state.resetTime)
      const now = new Date()
      const timeUntilReset = resetTime.getTime() - now.getTime()
      
      if (timeUntilReset > 0) {
        const minutesUntilReset = Math.ceil(timeUntilReset / 60000)
        console.log(`⏰ Próximo Reset: ${chalk.yellow(`${minutesUntilReset} minutos`)}`)
      } else {
        console.log(`⏰ Próximo Reset: ${chalk.green('Disponível agora!')}`)
      }
    }
    
    // Claude Runner Status
    console.log(chalk.blue('\n🤖 CLAUDE RUNNER STATUS:'))
    console.log(`Status: ${claudeStatus.running > 0 ? chalk.green('✅ Executando') : chalk.yellow('⏸️ Idle')}`)
    console.log(`Total executions: ${claudeStatus.total}`)
    console.log(`Active executions: ${claudeStatus.running}`)
    console.log(`Completed: ${claudeStatus.completed}`)
    console.log(`Failed: ${claudeStatus.failed}`)
    console.log(`Rate limited: ${claudeStatus.rate_limited}`)
    
    // System Status
    console.log(chalk.blue('\n⚙️ SYSTEM STATUS:'))
    console.log(`Running: ${this.isRunning ? chalk.green('✅ Online') : chalk.red('❌ Offline')}`)
    console.log(`Sprints available: ${chalk.white(this.sprintCatalog.size)}`)
    console.log(`Total executions: ${chalk.white(this.executionHistory.length)}`)
    
    // Histórico recente
    if (this.executionHistory.length > 0) {
      console.log(chalk.blue('\n📋 EXECUÇÕES RECENTES:'))
      this.executionHistory.slice(-5).forEach((exec, index) => {
        const status = exec.success ? chalk.green('✅') : chalk.red('❌')
        const time = chalk.gray(`${exec.executionTime}s`)
        const timestamp = chalk.gray(exec.timestamp.toLocaleTimeString())
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
   * Menu interativo principal
   */
  async runInteractiveMenu(): Promise<void> {
    console.log(chalk.cyan('\n🎯 MATRIX PROTOCOL SYSTEM - MENU INTERATIVO'))
    console.log('='.repeat(80))

    while (this.isRunning) {
      try {
        const { action } = await inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: 'Escolha uma ação:',
            choices: [
              { name: '🚀 Executar Agent Individual', value: 'execute_agent' },
              { name: '📋 Gerenciar Sprints', value: 'sprint_management' },
              { name: '🎭 Demonstração Completa', value: 'run_demo' },
              { name: '📊 Atualizar Status do Sistema', value: 'show_status' },
              { name: '🔋 Monitorar Rate Limits', value: 'monitor_limits' },
              { name: '🚪 Sair', value: 'exit' }
            ]
          }
        ])

        switch (action) {
          case 'execute_agent':
            await this.handleExecuteAgent()
            break
          case 'sprint_management':
            await this.handleSprintManagement()
            break
          case 'run_demo':
            await this.runDemonstration()
            break
          case 'show_status':
            this.displayStatus()
            break
          case 'monitor_limits':
            this.showRateLimitDetails()
            break
          case 'exit':
            await this.stop()
            return
          default:
            console.log(chalk.red('❌ Opção inválida'))
        }
        
        if (action !== 'exit') {
          // Pausa antes de voltar ao menu
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
        console.error(chalk.red('❌ Erro no menu interativo:'), error.message)
        
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
   * Handler para execução individual de agent
   */
  private async handleExecuteAgent(): Promise<void> {
    const availableAgents = [
      { name: '👨‍💼 Alex Santos (Tech Lead)', value: 'alex-santos' },
      { name: '👩‍💻 Marina Costa (Frontend)', value: 'marina-costa' },
      { name: '👨‍💻 Ricardo Lima (Backend)', value: 'ricardo-lima' },
      { name: '👩‍🔬 Camila Rodriguez (QA)', value: 'camila-rodriguez' },
      { name: '🎨 Bruno Oliveira (UX/UI)', value: 'bruno-oliveira' }
    ]

    try {
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

      console.log(chalk.blue(`\n🚀 Executando ${agentName}...`))
      const result = await this.executeAgent(agentName, prompt, {})
      
      console.log(chalk.green('\n✅ RESULTADO DA EXECUÇÃO:'))
      console.log('='.repeat(50))
      
      // Limitar output para melhor legibilidade
      const maxLength = 1000
      const displayResult = result.length > maxLength 
        ? result.substring(0, maxLength) + '\n\n' + chalk.gray('[... resultado truncado para exibição ...]')
        : result
      
      console.log(chalk.white(displayResult))
      
    } catch (error: any) {
      console.error(chalk.red('❌ Erro na execução:'), error.message)
      
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
   * Handler para gerenciamento de sprints
   */
  private async handleSprintSelection(): Promise<void> {
    const sprints = Array.from(this.sprintCatalog.values())
    
    if (sprints.length === 0) {
      console.log(chalk.yellow('⚠️ Nenhuma sprint disponível no catálogo'))
      return
    }
    
    // Preparar choices com status visual
    const sprintChoices = sprints.map(sprint => ({
      name: `${this.getSprintStatusIcon(sprint.status)} ${sprint.name} ${this.getPriorityIcon(sprint.priority)}`,
      value: sprint.id,
      short: sprint.name
    }))
    
    const { selectedSprintId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedSprintId',
        message: 'Escolha a sprint para executar:',
        choices: sprintChoices,
        pageSize: 10
      }
    ])
    
    const selectedSprint = this.sprintCatalog.get(selectedSprintId)
    
    if (!selectedSprint) {
      console.log(chalk.red('❌ Sprint não encontrada'))
      return
    }
    
    // Mostrar detalhes da sprint antes de executar
    await this.showSprintDetails(selectedSprint)
    
    const { confirmExecution } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmExecution',
        message: `Executar a sprint "${selectedSprint.name}"?`,
        default: true
      }
    ])
    
    if (confirmExecution) {
      await this.executeSpecificSprint(selectedSprint)
    }
  }

  /**
   * Obter ícone do status da sprint
   */
  private getSprintStatusIcon(status: string): string {
    switch (status) {
      case 'completed': return '✅'
      case 'in_progress': return '🔄'
      case 'failed': return '❌'
      default: return '❓'
    }
  }

  /**
   * Obter ícone da prioridade
   */
  private getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'low': return '🟢'
      case 'medium': return '🟡'
      case 'high': return '🟠'
      case 'critical': return '🔴'
      default: return '⚪'
    }
  }

  /**
   * Mostrar detalhes de uma sprint
   */
  async showSprintDetails(sprint: SprintDefinition): Promise<void> {
    console.log(chalk.cyan(`\n📋 DETALHES DA SPRINT: ${sprint.name}`))
    console.log('='.repeat(70))
    
    console.log(chalk.white(`📝 Descrição: ${sprint.description}`))
    console.log(chalk.white(`🎯 Status: ${this.getSprintStatusIcon(sprint.status)} ${sprint.status}`))
    console.log(chalk.white(`⚡ Prioridade: ${this.getPriorityIcon(sprint.priority)} ${sprint.priority}`))
    console.log(chalk.white(`⏱️ Duração estimada: ${sprint.estimatedDuration}`))
    console.log(chalk.white(`🏷️ Tags: ${sprint.tags.join(', ')}`))
    
    if (sprint.objectives.length > 0) {
      console.log(chalk.white('\n🎯 Objetivos:'))
      sprint.objectives.forEach((obj, index) => {
        console.log(chalk.gray(`   ${index + 1}. ${obj}`))
      })
    }
    
    if (sprint.phases.length > 0) {
      console.log(chalk.white('\n📋 Fases:'))
      sprint.phases.forEach((phase, index) => {
        console.log(chalk.gray(`   ${index + 1}. ${phase.icon} ${phase.name} (${phase.agent}, ${phase.estimatedTime}min)`))
      })
    }
    
    console.log(chalk.white(`\n📊 Execuções: ${sprint.executionCount}`))
    if (sprint.lastExecuted) {
      console.log(chalk.white(`   📅 Última Execução: ${sprint.lastExecuted.toLocaleString()}`))
    }
    
    console.log('='.repeat(70))
  }

  /**
   * Executar sprint específica
   */
  async executeSpecificSprint(sprint: SprintDefinition): Promise<void> {
    console.log(chalk.cyan(`\n🚀 EXECUTANDO SPRINT: ${sprint.name}`))
    console.log('='.repeat(70))
    
    const executionId = `exec-${Date.now()}`
    const sprintExecution: SprintExecution = {
      sprintId: sprint.id,
      executionId,
      startTime: new Date(),
      status: 'running',
      phases: [],
      successRate: 0
    }
    
    this.currentSprintExecution = sprintExecution
    sprint.status = 'in_progress'
    
    // Progress bar para as fases
    const progressBar = new cliProgress.SingleBar({
      format: 'Progresso |{bar}| {percentage}% | {value}/{total} Fases | {phase}',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true
    })
    
    progressBar.start(sprint.phases.length, 0, { phase: 'Preparando...' })
    
    const sprintStartTime = Date.now()
    
    try {
      for (let i = 0; i < sprint.phases.length; i++) {
        const phase = sprint.phases[i]
        progressBar.update(i, { phase: `${phase.icon} ${phase.name}` })
        
        console.log(chalk.blue(`\n⚡ Executando Fase ${i + 1}: ${phase.name}`))
        
        const phaseStartTime = Date.now()
        
        try {
          const result = await this.executeAgent(phase.agent, phase.prompt, {
            phase: phase.name,
            sprintGoal: sprint.name,
            dependencies: phase.dependencies || []
          })
          
          const executionTime = Date.now() - phaseStartTime
          
          const phaseResult: SprintPhaseResult = {
            phaseName: phase.name,
            agent: phase.agent,
            success: true,
            executionTime: Math.floor(executionTime / 1000),
            result: result.substring(0, 500) + (result.length > 500 ? '...' : ''),
            timestamp: new Date()
          }
          
          sprintExecution.phases.push(phaseResult)
          console.log(chalk.green(`   ✅ Fase concluída em ${Math.floor(executionTime / 1000)}s`))
          
        } catch (error: any) {
          const executionTime = Date.now() - phaseStartTime
          
          const phaseResult: SprintPhaseResult = {
            phaseName: phase.name,
            agent: phase.agent,
            success: false,
            executionTime: Math.floor(executionTime / 1000),
            error: error.message,
            timestamp: new Date()
          }
          
          sprintExecution.phases.push(phaseResult)
          console.log(chalk.red(`   ❌ Erro na fase: ${error.message}`))
          
          // Perguntar se deve continuar
          const { continueExecution } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'continueExecution',
              message: `Erro na fase ${phase.name}. Continuar com próxima fase?`,
              default: true
            }
          ])
          
          if (!continueExecution) {
            sprint.status = 'failed'
            throw new Error(`Sprint interrompida na fase: ${phase.name}`)
          }
          
          progressBar.start(sprint.phases.length, i, { phase: 'Continuando...' })
        }
      }
      
      // Finalizar progress bar
      progressBar.update(sprint.phases.length, { phase: 'Concluído!' })
      progressBar.stop()
      
      // Calcular resultados finais
      const totalExecutionTime = Date.now() - sprintStartTime
      const successfulPhases = sprintExecution.phases.filter(p => p.success)
      
      sprintExecution.endTime = new Date()
      sprintExecution.status = 'completed'
      sprintExecution.totalTime = Math.floor(totalExecutionTime / 1000)
      sprintExecution.successRate = Math.round((successfulPhases.length / sprintExecution.phases.length) * 100)
      
      sprint.status = sprintExecution.successRate >= 80 ? 'completed' : 'failed'
      sprint.executionCount++
      sprint.lastExecuted = new Date()

      // Armazenar execução
      const executions = this.sprintExecutions.get(sprint.id) || []
      executions.push(sprintExecution)
      this.sprintExecutions.set(sprint.id, executions)
      
      // Mostrar relatório final
      await this.showSprintExecutionReport(sprint, sprintExecution)
      
    } catch (error: any) {
      progressBar.stop()
      
      sprintExecution.endTime = new Date()
      sprintExecution.status = 'failed'
      sprintExecution.totalTime = Math.floor((Date.now() - sprintStartTime) / 1000)
      sprintExecution.successRate = sprintExecution.phases.length > 0 
        ? Math.round((sprintExecution.phases.filter(p => p.success).length / sprintExecution.phases.length) * 100) 
        : 0
      
      sprint.status = 'failed'
      
      console.log(chalk.red('\n❌ SPRINT EXECUTION FAILED'))
      console.log(chalk.red('Fases executadas:'))
      
      sprintExecution.phases.forEach((phase, index) => {
        const status = phase.success ? chalk.green('✅') : chalk.red('❌')
        console.log(`${status} ${index + 1}. ${phase.phaseName} - ${phase.executionTime}s`)
      })
      
      throw error
      
    } finally {
      this.currentSprintExecution = null
    }
  }

  /**
   * Mostrar relatório de execução da sprint
   */
  async showSprintExecutionReport(sprint: SprintDefinition, execution: SprintExecution): Promise<void> {
    console.log(chalk.cyan(`\n📊 RELATÓRIO DE EXECUÇÃO - ${sprint.name}`))
    console.log('='.repeat(80))
    
    console.log(chalk.white(`🎯 Sprint: ${sprint.name}`))
    console.log(chalk.white(`⚡ Status: ${this.getSprintStatusIcon(sprint.status)} ${sprint.status}`))
    console.log(chalk.white(`⏱️ Tempo total: ${execution.totalTime}s (${Math.floor((execution.totalTime || 0) / 60)}m)`))
    console.log(chalk.white(`📈 Taxa de sucesso: ${execution.successRate}%`))
    console.log(chalk.white(`📋 Fases executadas: ${execution.phases.length}/${sprint.phases.length}`))
    
    console.log(chalk.white('\n📋 DETALHES DAS FASES:'))
    execution.phases.forEach((phase, index) => {
      const status = phase.success ? chalk.green('✅') : chalk.red('❌')
      console.log(`${status} ${index + 1}. ${phase.phaseName} (${phase.agent}) - ${phase.executionTime}s`)
      
      if (!phase.success && phase.error) {
        console.log(chalk.red(`     ⚠️ Erro: ${phase.error.substring(0, 100)}...`))
      }
    })
    
    // Estatísticas gerais
    const allExecutions = this.sprintExecutions.get(sprint.id) || []
    
    if (allExecutions.length > 0) {
      const completedExecutions = allExecutions.filter(e => e.status === 'completed')
      
      console.log(chalk.cyan('\n📈 ESTATÍSTICAS GERAIS:'))
      console.log(chalk.white(`🔄 Total de Execuções: ${allExecutions.length}`))
      console.log(chalk.white(`✅ Execuções Completas: ${completedExecutions.length}`))
      console.log(chalk.white(`❌ Execuções Falhadas: ${allExecutions.length - completedExecutions.length}`))
    }
    
    console.log(chalk.cyan('='.repeat(80)))
  }

  /**
   * Handler para gerenciamento de sprints
   */
  private async handleSprintManagement(): Promise<void> {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Gerenciamento de Sprints:',
        choices: [
          { name: '🚀 Executar Sprint', value: 'execute_sprint' },
          { name: '📋 Listar Todas as Sprints', value: 'list_sprints' },
          { name: '📊 Histórico de Execuções', value: 'execution_history' },
          { name: '🔍 Detalhes de Sprint Específica', value: 'sprint_details' },
          { name: '📈 Relatórios de Performance', value: 'performance_reports' },
          { name: '🔄 Resetar Status das Sprints', value: 'reset_status' },
          { name: chalk.gray('↩️  Voltar ao menu principal'), value: 'back' }
        ]
      }
    ])

    switch (action) {
      case 'execute_sprint':
        await this.handleSprintSelection()
        break
      case 'list_sprints':
        await this.showAllSprints()
        break
      case 'execution_history':
        await this.showExecutionHistory()
        break
      case 'sprint_details':
        await this.showSpecificSprintDetails()
        break
      case 'performance_reports':
        await this.showPerformanceReports()
        break
      case 'reset_status':
        await this.resetSprintStatus()
        break
      case 'back':
        return
    }
  }

  /**
   * Mostrar todas as sprints
   */
  private async showAllSprints(): Promise<void> {
    console.log(chalk.cyan('\n📋 TODAS AS SPRINTS DISPONÍVEIS'))
    console.log('='.repeat(80))
    
    const sprints = Array.from(this.sprintCatalog.values())
    
    sprints.forEach((sprint, index) => {
      const statusIcon = this.getSprintStatusIcon(sprint.status)
      const priorityIcon = this.getPriorityIcon(sprint.priority)
      
      console.log(chalk.white(`${index + 1}. ${statusIcon} ${sprint.name} ${priorityIcon}`))
      console.log(chalk.gray(`   📝 ${sprint.description}`))
      console.log(chalk.gray(`   ⏱️ Duração: ${sprint.estimatedDuration} | 🏷️ Tags: ${sprint.tags.join(', ')}`))
      console.log(chalk.gray(`   📊 Execuções: ${sprint.executionCount}`))
      
      if (sprint.lastExecuted) {
        console.log(chalk.gray(`   📅 Última execução: ${sprint.lastExecuted.toLocaleString()}`))
      }
    })
    
    console.log('='.repeat(80))
  }

  /**
   * Mostrar histórico de execuções
   */
  private async showExecutionHistory(): Promise<void> {
    console.log(chalk.cyan('\n📊 HISTÓRICO DE EXECUÇÕES'))
    console.log('='.repeat(80))
    
    const sprints = Array.from(this.sprintCatalog.values())
    let totalTime = 0
    let totalExecutions = 0
    let totalSuccessful = 0
    
    for (const sprint of sprints) {
      const executions = this.sprintExecutions.get(sprint.id) || []
      
      executions.forEach((execution, index) => {
        const status = execution.status === 'completed' ? chalk.green('✅') : chalk.red('❌')
        const time = chalk.gray(`${execution.totalTime || 0}s`)
        const date = chalk.gray(execution.startTime.toLocaleString())
        
        console.log(`${status} ${sprint.name} #${index + 1} - ${time} (${date})`)
        
        totalTime += execution.totalTime || 0
        totalExecutions++
        if (execution.status === 'completed') totalSuccessful++
      })
    }
    
    if (totalExecutions > 0) {
      console.log(chalk.cyan('\n📈 ESTATÍSTICAS GERAIS:'))
      console.log(chalk.white(`   🔄 Total de Execuções: ${totalExecutions}`))
      console.log(chalk.white(`   ✅ Taxa de Sucesso: ${Math.round((totalSuccessful / totalExecutions) * 100)}%`))
      console.log(chalk.white(`   ⏱️ Tempo Médio: ${Math.floor(totalTime / totalExecutions / 60)}m ${Math.floor((totalTime / totalExecutions) % 60)}s`))
    } else {
      console.log(chalk.yellow('⚠️ Nenhuma execução registrada ainda'))
    }
    
    console.log('='.repeat(80))
  }

  /**
   * Mostrar detalhes de sprint específica
   */
  private async showSpecificSprintDetails(): Promise<void> {
    const sprints = Array.from(this.sprintCatalog.values())
    
    if (sprints.length === 0) {
      console.log(chalk.yellow('⚠️ Nenhuma sprint disponível'))
      return
    }
    
    const sprintChoices = sprints.map(sprint => ({
      name: `${this.getSprintStatusIcon(sprint.status)} ${sprint.name}`,
      value: sprint.id
    }))
    
    const { selectedSprintId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedSprintId',
        message: 'Escolha a sprint para ver detalhes:',
        choices: sprintChoices
      }
    ])
    
    const sprint = this.sprintCatalog.get(selectedSprintId)
    if (sprint) {
      await this.showSprintDetails(sprint)
    }
  }

  /**
   * Mostrar relatórios de performance
   */
  private async showPerformanceReports(): Promise<void> {
    console.log(chalk.cyan('\n📈 RELATÓRIOS DE PERFORMANCE'))
    console.log('='.repeat(80))
    
    const sprints = Array.from(this.sprintCatalog.values())
    let totalTime = 0
    let totalExecutions = 0
    let totalSuccessful = 0
    
    console.log(chalk.yellow('📊 PERFORMANCE POR SPRINT:'))
    
    for (const sprint of sprints) {
      const executions = this.sprintExecutions.get(sprint.id) || []
      if (executions.length === 0) continue
      
      const successful = executions.filter(e => e.status === 'completed')
      const avgTime = executions.reduce((sum, e) => sum + (e.totalTime || 0), 0) / executions.length
      const avgSuccessRate = executions.reduce((sum, e) => sum + e.successRate, 0) / executions.length
      
      console.log(chalk.white(`\n🏃 ${sprint.name}:`))
      console.log(chalk.gray(`   📊 Execuções: ${executions.length} | ✅ Sucessos: ${successful.length}`))
      console.log(chalk.gray(`   ⏱️ Tempo Médio: ${Math.floor(avgTime / 60)}m ${Math.floor(avgTime % 60)}s`))
      console.log(chalk.gray(`   📈 Taxa Média: ${Math.round(avgSuccessRate)}%`))
      
      totalTime += avgTime * executions.length
      totalExecutions += executions.length
      totalSuccessful += successful.length
    }
    
    if (totalExecutions > 0) {
      console.log(chalk.cyan('\n🎯 PERFORMANCE GERAL:'))
      console.log(chalk.white(`   🔄 Total de Execuções: ${totalExecutions}`))
      console.log(chalk.white(`   ✅ Taxa de Sucesso: ${Math.round((totalSuccessful / totalExecutions) * 100)}%`))
      console.log(chalk.white(`   ⏱️ Tempo Médio: ${Math.floor(totalTime / totalExecutions / 60)}m ${Math.floor((totalTime / totalExecutions) % 60)}s`))
    }
    
    console.log('='.repeat(80))
  }

  /**
   * Resetar status das sprints
   */
  private async resetSprintStatus(): Promise<void> {
    const { confirmReset } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmReset',
        message: 'Tem certeza que deseja resetar o status de todas as sprints? Isso removerá todo o histórico de execuções.',
        default: false
      }
    ])
    
    if (!confirmReset) {
      console.log(chalk.gray('Operação cancelada'))
      return
    }
    
    // Resetar todas as sprints
    this.sprintCatalog.forEach(sprint => {
      sprint.status = 'not_started'
      sprint.executionCount = 0
      sprint.lastExecuted = undefined
    })
    
    // Limpar histórico de execuções
    this.sprintExecutions.forEach((_, sprintId) => {
      this.sprintExecutions.set(sprintId, [])
    })
    
    console.log(chalk.green('✅ Status de todas as sprints resetado com sucesso'))
    console.log(chalk.gray('📋 Todas as sprints agora estão marcadas como "não iniciadas"'))
    console.log(chalk.gray('🗑️ Todo o histórico de execuções foi removido'))
  }

  /**
   * Mostrar detalhes de rate limits
   */
  private showRateLimitDetails(): void {
    console.log(chalk.cyan('\n🔋 DETALHES DE RATE LIMITS'))
    console.log('='.repeat(50))
    
    const rateLimitStatus = rateLimitHandler.getStatus()
    
    console.log(`📊 Requests Restantes: ${rateLimitStatus.state.promptsRemaining || 'N/A'}`)
    console.log(`⚡ Requests Utilizados: ${rateLimitStatus.state.promptsUsed || 'N/A'}`)
    console.log(`⏰ Reset Time: ${rateLimitStatus.state.resetTime || 'N/A'}`)
    console.log(`🚦 Status: ${rateLimitStatus.state.isLimited ? chalk.red('Rate Limited') : chalk.green('Available')}`)
    
    if (rateLimitStatus.state.resetTime) {
      const resetTime = new Date(rateLimitStatus.state.resetTime)
      const now = new Date()
      const waitTime = resetTime.getTime() - now.getTime()
      
      if (waitTime > 0) {
        console.log(`⏳ Tempo até liberação: ${Math.round(waitTime / 60000)} minutos`)
      }
    }
    
    console.log('=' .repeat(50))
  }

  /**
   * Descobrir sprints planejadas do BACKLOG_EXECUTABLE.md
   */
  private discoverPlannedSprintsFromBacklog(): SprintDefinition[] {
    const docsPath = path.join(process.cwd(), '../website/docs/dynamic-navigation')
    const backlogPath = path.join(docsPath, '01-planning', 'BACKLOG_EXECUTABLE.md')
    
    if (!fs.existsSync(backlogPath)) {
      console.log(chalk.yellow('⚠️ BACKLOG_EXECUTABLE.md não encontrado'))
      return []
    }
    
    try {
      const content = fs.readFileSync(backlogPath, 'utf-8')
      const plannedSprints: SprintDefinition[] = []
      
      // Extrair informações dos épicos e mapear para sprints
      const epicSections = this.parseEpicsFromBacklog(content)
      
      epicSections.forEach((epic, index) => {
        const sprintNumber = index + 1
        const sprintId = `sprint-${sprintNumber}`
        
        plannedSprints.push({
          id: sprintId,
          name: epic.name,
          description: epic.description,
          objectives: epic.stories.map(story => story.description),
          phases: this.createPhasesFromStories(epic.stories),
          estimatedDuration: epic.estimatedDuration,
          status: 'planned',
          priority: this.determinePriorityFromEpic(epic),
          tags: this.extractTagsFromEpic(epic),
          created: new Date(),
          executionCount: 0,
          source: 'backlog'
        })
      })
      
      return plannedSprints
      
    } catch (error: any) {
      console.error(chalk.red('❌ Erro ao parse do backlog:'), error.message)
      return []
    }
  }

  /**
   * Parse dos épicos do BACKLOG_EXECUTABLE.md
   */
  private parseEpicsFromBacklog(content: string): Array<{
    name: string
    description: string
    stories: Array<{ description: string; tasks: string[] }>
    estimatedDuration: string
  }> {
    const epics = []
    const lines = content.split('\n')
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // Buscar por linhas de épico
      if (line.includes('ÉPICO') && line.startsWith('##') && line.includes('**')) {
        // Extrair número e nome do épico
        const epicMatch = line.match(/ÉPICO (\d+): (.+?)\*\*/)
        if (epicMatch) {
          const epicNumber = epicMatch[1]
          const epicName = epicMatch[2].trim()
          
          // Descrição está na próxima linha
          const epicDescription = (i + 1 < lines.length) ? 
            lines[i + 1].replace(/^\*|\*$/g, '').trim() : 
            'Descrição do épico'
          
          // Encontrar stories para este épico
          const epicSection = this.extractEpicSection(content, epicNumber)
          const stories = this.parseStoriesFromEpicSection(epicSection)
          
          // Calcular estimativa baseada no conteúdo
          const estimatedHours = this.calculateEpicEstimation(epicSection)
          
          epics.push({
            name: epicName,
            description: epicDescription,
            stories,
            estimatedDuration: `${estimatedHours}h`
          })
        }
      }
    }
    
    return epics
  }

  /**
   * Extrair seção específica de um épico
   */
  private extractEpicSection(content: string, epicNumber: string): string {
    const lines = content.split('\n')
    let startIndex = -1
    let endIndex = lines.length
    
    // Encontrar início da seção do épico
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(`ÉPICO ${epicNumber}:`) && lines[i].startsWith('##')) {
        startIndex = i
        break
      }
    }
    
    if (startIndex === -1) return ''
    
    // Encontrar fim da seção (próximo épico ou seção de métricas)
    for (let i = startIndex + 1; i < lines.length; i++) {
      if ((lines[i].includes('ÉPICO') && lines[i].startsWith('##')) || 
          lines[i].includes('MÉTRICAS DE TRACKING')) {
        endIndex = i
        break
      }
    }
    
    return lines.slice(startIndex, endIndex).join('\n')
  }

  /**
   * Parse das stories de uma seção de épico
   */
  private parseStoriesFromEpicSection(epicSection: string): Array<{ description: string; tasks: string[] }> {
    const stories = []
    const storyPattern = /### \*\*📖 STORY [\d.]+: (.+?)\*\*[\s\S]*?#### \*\*Descrição\*\*\s*([\s\S]*?)(?=#### \*\*Critérios|#### \*\*Tasks|\n###|\n##|$)/g
    
    let storyMatch
    while ((storyMatch = storyPattern.exec(epicSection)) !== null) {
      const storyName = storyMatch[1].trim()
      const storyDescription = storyMatch[2].trim()
      
      // Extrair tasks desta story
      const tasks = this.extractTasksFromStory(epicSection, storyName)
      
      stories.push({
        description: `${storyName}: ${storyDescription}`,
        tasks
      })
    }
    
    return stories
  }

  /**
   * Extrair tasks de uma story específica
   */
  private extractTasksFromStory(epicSection: string, storyName: string): string[] {
    const tasks = []
    const taskPattern = /\*\*TASK [\d.]+: (.+?)\*\*/g
    
    let taskMatch
    while ((taskMatch = taskPattern.exec(epicSection)) !== null) {
      tasks.push(taskMatch[1].trim())
    }
    
    return tasks
  }

  /**
   * Calcular estimativa de horas do épico
   */
  private calculateEpicEstimation(epicSection: string): number {
    const estimationMatches = epicSection.match(/\*\*Estimativa\*\*:\s*(\d+)h/g)
    if (!estimationMatches) return 30 // fallback
    
    let totalHours = 0
    estimationMatches.forEach(match => {
      const hours = match.match(/(\d+)h/)
      if (hours) {
        totalHours += parseInt(hours[1])
      }
    })
    
    return totalHours || 30
  }

  /**
   * Criar phases a partir das stories
   */
  private createPhasesFromStories(stories: Array<{ description: string; tasks: string[] }>): SprintPhase[] {
    return stories.map((story, index) => ({
      name: `Story ${index + 1}`,
      icon: this.getStoryIcon(story.description),
      agent: 'alex-santos', // Responsável padrão
      prompt: `Execute story: ${story.description}. Tasks: ${story.tasks.join(', ')}`,
      estimatedTime: 240 // 4h padrão por story
    }))
  }

  /**
   * Obter ícone baseado na story
   */
  private getStoryIcon(description: string): string {
    const desc = description.toLowerCase()
    if (desc.includes('auditoria') || desc.includes('analysis')) return '🔍'
    if (desc.includes('api') || desc.includes('backend')) return '⚡'
    if (desc.includes('composable') || desc.includes('frontend')) return '🎨'
    if (desc.includes('metadados') || desc.includes('schema')) return '📋'
    if (desc.includes('migração') || desc.includes('integration')) return '🔄'
    if (desc.includes('performance') || desc.includes('validation')) return '🚀'
    return '🔧'
  }

  /**
   * Determinar prioridade do épico
   */
  private determinePriorityFromEpic(epic: any): 'low' | 'medium' | 'high' | 'critical' {
    const text = `${epic.name} ${epic.description}`.toLowerCase()
    if (text.includes('preparação') || text.includes('base')) return 'high'
    if (text.includes('core') || text.includes('principal')) return 'critical'
    if (text.includes('migração') || text.includes('gradual')) return 'medium'
    return 'medium'
  }

  /**
   * Extrair tags do épico
   */
  private extractTagsFromEpic(epic: any): string[] {
    const text = `${epic.name} ${epic.description}`.toLowerCase()
    const tags = []
    
    if (text.includes('preparação') || text.includes('padronização')) tags.push('preparation')
    if (text.includes('api') || text.includes('desenvolvimento')) tags.push('development')
    if (text.includes('migração') || text.includes('integração')) tags.push('integration')
    if (text.includes('navegação')) tags.push('navigation')
    if (text.includes('conteúdo') || text.includes('content')) tags.push('content')
    
    return tags.length > 0 ? tags : ['backlog']
  }

  /**
   * Integrar sprints executadas com planejadas
   */
  private integrateSprintData(executedSprints: SprintDefinition[], plannedSprints: SprintDefinition[]): SprintDefinition[] {
    const integratedSprints: SprintDefinition[] = []
    const executedIds = new Set(executedSprints.map(s => s.id))
    
    // Adicionar sprints executadas (prioridade máxima)
    executedSprints.forEach(executedSprint => {
      // Atualizar status baseado na execução
      executedSprint.status = this.determineSprintStatus(executedSprint)
      integratedSprints.push(executedSprint)
    })
    
    // Adicionar sprints planejadas que não foram executadas
    plannedSprints.forEach(plannedSprint => {
      if (!executedIds.has(plannedSprint.id)) {
        // Verificar se sprint foi parcialmente executada
        plannedSprint.status = this.checkSprintExecutionStatus(plannedSprint.id)
        integratedSprints.push(plannedSprint)
      } else {
        // Se sprint existe nos dois, enriquecer dados da executada com dados do backlog
        const executedSprint = integratedSprints.find(s => s.id === plannedSprint.id)
        if (executedSprint) {
          // Manter dados de execução mas enriquecer com dados do backlog se necessário
          if (!executedSprint.objectives.length && plannedSprint.objectives.length) {
            executedSprint.objectives = plannedSprint.objectives
          }
          // Atualizar descrição se a do backlog for mais rica
          if (plannedSprint.description.length > executedSprint.description.length) {
            executedSprint.description = plannedSprint.description
          }
        }
      }
    })
    
    // Ordenar por número da sprint
    return integratedSprints.sort((a, b) => {
      const aNum = parseInt(a.id.replace('sprint-', ''))
      const bNum = parseInt(b.id.replace('sprint-', ''))
      return aNum - bNum
    })
  }

  /**
   * Determinar status da sprint baseado na execução
   */
  private determineSprintStatus(sprint: SprintDefinition): 'planned' | 'not_started' | 'in_progress' | 'completed' | 'failed' | 'archived' {
    // Se tem reports de execução, verificar o resultado
    if (sprint.executionCount > 0 && sprint.lastExecuted) {
      const docsPath = path.join(process.cwd(), '../website/docs/dynamic-navigation/02-execution')
      const sprintNumber = sprint.id.replace('sprint-', '')
      
      // 1. PRIORIDADE MÁXIMA: Se tem retrospective, é completed
      const retrospectiveReport = path.join(docsPath, `SPRINT_${sprintNumber}_RETROSPECTIVE.md`)
      if (fs.existsSync(retrospectiveReport)) {
        return 'completed'
      }
      
      // 2. Se tem completion report, é completed
      const completionReport = path.join(docsPath, `SPRINT_${sprintNumber}_COMPLETION_REPORT.md`)
      if (fs.existsSync(completionReport)) {
        return 'completed'
      }
      
      // 3. Se tem reports JSON, verificar verdict
      const sprintReportsPath = path.join(docsPath, 'sprint-reports')
      if (fs.existsSync(sprintReportsPath)) {
        const reportFiles = fs.readdirSync(sprintReportsPath)
        const latestReport = reportFiles
          .filter(f => f.includes(`sprint-${sprintNumber}`) && f.endsWith('.json'))
          .sort()
          .pop()
        
        if (latestReport) {
          try {
            const reportPath = path.join(sprintReportsPath, latestReport)
            const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'))
            
            if (report.finalVerdict === 'SPRINT_SUCCESS') {
              return 'completed'
            } else if (report.finalVerdict === 'SPRINT_NEEDS_WORK') {
              // Se tem retrospective mas verdict ruim, priorizar retrospective
              if (fs.existsSync(retrospectiveReport)) {
                return 'completed'
              }
              return 'failed'
            }
          } catch (error) {
            // Ignorar erro de parse
          }
        }
      }
      
      // Se tem planning record mas status indefinido
      return 'in_progress'
    }
    
    // Se não tem execução mas está no catálogo
    return sprint.source === 'backlog' ? 'planned' : 'not_started'
  }

  /**
   * Verificar status de execução de uma sprint específica
   */
  private checkSprintExecutionStatus(sprintId: string): 'planned' | 'not_started' | 'in_progress' | 'completed' | 'failed' | 'archived' {
    const docsPath = path.join(process.cwd(), '../website/docs/dynamic-navigation/02-execution')
    const sprintNumber = sprintId.replace('sprint-', '')
    
    // Verificar se tem planning record
    const planningRecord = path.join(docsPath, `SPRINT_${sprintNumber}_PLANNING_RECORD.md`)
    const completionReport = path.join(docsPath, `SPRINT_${sprintNumber}_COMPLETION_REPORT.md`)
    
    if (fs.existsSync(completionReport)) {
      return 'completed'
    }
    
    if (fs.existsSync(planningRecord)) {
      return 'in_progress'
    }
    
    // Sprint existe apenas no backlog
    return 'planned'
  }
}

/**
 * Funções de utilidade para uso externo
 */

// Função para criar instância e executar menu interativo
export async function runMatrixProtocolCLI() {
  const system = new MatrixProtocolSystem()
  
  try {
    await system.start()
    await system.runInteractiveMenu()
  } catch (error: any) {
    console.error(chalk.red('❌ Erro crítico:'), error.message)
    process.exit(1)
  } finally {
    await system.stop()
  }
}

// Função para demonstração rápida
export async function runMatrixProtocolDemo() {
  const system = new MatrixProtocolSystem()
  
  try {
    await system.start()
    await system.runDemonstration()
    system.displayStatus()
  } catch (error: any) {
    console.error(chalk.red('❌ Erro na demonstração:'), error.message)
  } finally {
    await system.stop()
  }
}

// Função para status rápido
export async function showMatrixProtocolStatus() {
  const system = new MatrixProtocolSystem()
  
  try {
    await system.start()
    system.displayStatus()
  } catch (error: any) {
    console.error(chalk.red('❌ Erro ao obter status:'), error.message)
  } finally {
    await system.stop()
  }
}

// Função para execução automatizada de sequência
export async function runMatrixProtocolSequence(executions: AgentExecution[]) {
  const system = new MatrixProtocolSystem()
  
  try {
    await system.start()
    const results = await system.executeAgentSequence(executions)
    system.displayStatus()
    await system.stop()
    return results
  } catch (error: any) {
    console.error(chalk.red('❌ Erro na sequência:'), error.message)
    await system.stop()
    throw error
  }
}

/**
 * CLI Bootstrap - detecção automática de modo
 */
if (require.main === module) {
  const args = process.argv.slice(2)
  
  if (args.includes('--demo')) {
    runMatrixProtocolDemo()
  } else if (args.includes('--status')) {
    showMatrixProtocolStatus()
  } else {
    runMatrixProtocolCLI()
  }
}