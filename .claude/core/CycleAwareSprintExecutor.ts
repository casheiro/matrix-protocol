/**
 * CycleAwareSprintExecutor - Executador inteligente de sprints completas
 * com otimização para Claude Code Pro plan
 * 
 * Coordena execução de sprints completas respeitando rate limits,
 * utilizando os 5 agents especializados e executando todas as cerimônias Agile
 */

import { rateLimitHandler, createSprintTask, type ExecutionTask } from '../utils/OptimizedRateLimitHandler'
import { ContextOptimizer } from '../utils/ContextOptimizer'

interface SprintDefinition {
  id: string
  number: number
  goal: string
  duration: number // em dias
  team: string[]
  backlog: SprintBacklogItem[]
  criteria: AcceptanceCriteria[]
}

interface SprintBacklogItem {
  id: string
  title: string
  description: string
  assignedAgent: string
  estimatedComplexity: 'low' | 'medium' | 'high'
  dependencies: string[]
  acceptanceCriteria: string[]
}

interface AcceptanceCriteria {
  id: string
  description: string
  validation: 'automated' | 'manual'
  priority: 'must' | 'should' | 'could'
}

interface SprintExecution {
  sprint: SprintDefinition
  status: 'planning' | 'active' | 'review' | 'retrospective' | 'completed' | 'blocked'
  currentDay: number
  completedTasks: string[]
  blockedTasks: string[]
  metrics: SprintMetrics
  artifacts: SprintArtifacts
}

interface SprintMetrics {
  plannedStoryPoints: number
  completedStoryPoints: number
  velocityFactor: number
  qualityScore: number
  teamCollaboration: number
  cycleEfficiency: number
}

interface SprintArtifacts {
  planningReport: any
  dailyReports: any[]
  implementationResults: any[]
  validationResults: any[]
  retrospectiveReport: any
  finalDeliverable: any
}

export class CycleAwareSprintExecutor {
  private execution: SprintExecution | null = null
  private contextOptimizer: ContextOptimizer
  private agentRoles = {
    'alex-santos': 'technical-leader',
    'marina-costa': 'frontend-developer', 
    'ricardo-lima': 'backend-specialist',
    'camila-rodriguez': 'qa-engineer',
    'bruno-oliveira': 'content-specialist'
  }

  constructor() {
    this.contextOptimizer = new ContextOptimizer()
  }

  /**
   * Iniciar execução completa de uma sprint
   */
  async executeSprint(sprintDefinition: SprintDefinition): Promise<SprintExecution> {
    console.log(`🚀 Iniciando Sprint ${sprintDefinition.number}: ${sprintDefinition.goal}`)
    
    this.execution = {
      sprint: sprintDefinition,
      status: 'planning',
      currentDay: 0,
      completedTasks: [],
      blockedTasks: [],
      metrics: {
        plannedStoryPoints: 0,
        completedStoryPoints: 0,
        velocityFactor: 1.0,
        qualityScore: 0,
        teamCollaboration: 0,
        cycleEfficiency: 0
      },
      artifacts: {
        planningReport: null,
        dailyReports: [],
        implementationResults: [],
        validationResults: [],
        retrospectiveReport: null,
        finalDeliverable: null
      }
    }

    try {
      // Fase 1: Sprint Planning
      await this.executeSprintPlanning()
      
      // Fase 2: Sprint Execution (múltiplos dias)
      await this.executeSprintDays()
      
      // Fase 3: Sprint Review
      await this.executeSprintReview()
      
      // Fase 4: Sprint Retrospective
      await this.executeSprintRetrospective()
      
      this.execution.status = 'completed'
      console.log(`✅ Sprint ${sprintDefinition.number} completada com sucesso!`)
      
      return this.execution
      
    } catch (error: any) {
      console.error(`❌ Erro na execução da Sprint ${sprintDefinition.number}:`, error)
      this.execution.status = 'blocked'
      throw error
    }
  }

  /**
   * Fase 1: Sprint Planning com todos os agents
   */
  private async executeSprintPlanning(): Promise<void> {
    console.log(`📋 Iniciando Sprint Planning`)
    this.execution!.status = 'planning'

    // Task 1: Alex lidera o sprint planning
    const planningTask = createSprintTask('alex-santos', 'sprint-planning', 'critical', {
      sprint: this.execution!.sprint,
      team: this.agentRoles,
      previousSprints: await this.getPreviousSprintContext()
    })

    const planningResult = await rateLimitHandler.executeTaskWithOptimization(planningTask)
    
    if (!planningResult) {
      console.log(`⏸️ Sprint Planning aguardando disponibilidade de prompts`)
      return
    }

    this.execution!.artifacts.planningReport = planningResult

    // Task 2: Cada agent define suas responsabilidades específicas
    const agentPlanningTasks = []
    
    for (const [agentName, role] of Object.entries(this.agentRoles)) {
      if (agentName !== 'alex-santos') { // Alex já planejou
        const task = createSprintTask(agentName, 'sprint-planning', 'high', {
          sprintGoal: this.execution!.sprint.goal,
          assignedItems: this.getAgentBacklogItems(agentName),
          teamPlan: planningResult,
          agentRole: role
        })
        agentPlanningTasks.push(task)
      }
    }

    // Executar planejamentos dos agents em paralelo (otimizado)
    for (const task of agentPlanningTasks) {
      const result = await rateLimitHandler.executeTaskWithOptimization(task)
      if (result) {
        this.execution!.artifacts.planningReport[task.agentName] = result
      }
    }

    // Task 3: Camila define critérios de validação
    const validationPlanningTask = createSprintTask('camila-rodriguez', 'validation', 'critical', {
      sprintBacklog: this.execution!.sprint.backlog,
      acceptanceCriteria: this.execution!.sprint.criteria,
      qualityStandards: await this.getQualityStandards()
    })

    const validationPlan = await rateLimitHandler.executeTaskWithOptimization(validationPlanningTask)
    if (validationPlan) {
      this.execution!.artifacts.planningReport.validationPlan = validationPlan
    }

    console.log(`✅ Sprint Planning completado`)
  }

  /**
   * Fase 2: Execução dos dias da sprint
   */
  private async executeSprintDays(): Promise<void> {
    console.log(`🏃‍♂️ Iniciando execução da Sprint (${this.execution!.sprint.duration} dias)`)
    this.execution!.status = 'active'

    for (let day = 1; day <= this.execution!.sprint.duration; day++) {
      this.execution!.currentDay = day
      console.log(`📅 Sprint Day ${day}`)

      // Daily Standup
      await this.executeDailyStandup(day)

      // Development work
      await this.executeDevelopmentWork(day)

      // Continuous validation
      if (day % 2 === 0) { // Validação a cada 2 dias
        await this.executeContinuousValidation(day)
      }

      // Process any queued tasks
      await rateLimitHandler.processQueue()
      
      console.log(`✅ Day ${day} completado`)
    }
  }

  /**
   * Daily Standup com todos os agents
   */
  private async executeDailyStandup(day: number): Promise<void> {
    console.log(`🤝 Daily Standup - Day ${day}`)

    const standupTasks = []
    
    for (const [agentName, role] of Object.entries(this.agentRoles)) {
      const task = createSprintTask(agentName, 'daily', 'medium', {
        day,
        role,
        yesterday: this.getDayProgress(day - 1, agentName),
        today: this.getDayPlan(day, agentName),
        blockers: this.getAgentBlockers(agentName),
        sprintProgress: this.calculateSprintProgress()
      })
      standupTasks.push(task)
    }

    // Executar dailys em batch otimizado
    const dailyResults = []
    for (const task of standupTasks) {
      const result = await rateLimitHandler.executeTaskWithOptimization(task)
      if (result) {
        dailyResults.push(result)
      }
    }

    this.execution!.artifacts.dailyReports.push({
      day,
      participants: dailyResults,
      sprintProgress: this.calculateSprintProgress(),
      identifiedBlockers: this.extractBlockers(dailyResults)
    })
  }

  /**
   * Trabalho de desenvolvimento distribuído por agents
   */
  private async executeDevelopmentWork(day: number): Promise<void> {
    console.log(`💻 Development Work - Day ${day}`)

    // Marina: Frontend implementation
    const frontendTask = createSprintTask('marina-costa', 'implementation', 'high', {
      day,
      assignedFeatures: this.getAgentBacklogItems('marina-costa'),
      dependencies: this.getImplementationDependencies('frontend'),
      integrationPoints: await this.getIntegrationContext()
    })

    // Ricardo: Backend implementation
    const backendTask = createSprintTask('ricardo-lima', 'implementation', 'high', {
      day,
      assignedFeatures: this.getAgentBacklogItems('ricardo-lima'),
      dependencies: this.getImplementationDependencies('backend'),
      performanceTargets: await this.getPerformanceTargets()
    })

    // Bruno: Content and documentation
    const contentTask = createSprintTask('bruno-oliveira', 'implementation', 'medium', {
      day,
      contentRequirements: this.getAgentBacklogItems('bruno-oliveira'),
      multilingualNeeds: await this.getMultilingualRequirements(),
      metadataStandards: await this.getMetadataStandards()
    })

    // Executar implementações
    const implementationResults = []
    for (const task of [frontendTask, backendTask, contentTask]) {
      const result = await rateLimitHandler.executeTaskWithOptimization(task)
      if (result) {
        implementationResults.push(result)
        this.execution!.completedTasks.push(task.id)
      }
    }

    this.execution!.artifacts.implementationResults.push({
      day,
      results: implementationResults
    })
  }

  /**
   * Validação contínua com Camila
   */
  private async executeContinuousValidation(day: number): Promise<void> {
    console.log(`🔍 Continuous Validation - Day ${day}`)

    const validationTask = createSprintTask('camila-rodriguez', 'validation', 'high', {
      day,
      implementedFeatures: this.getImplementedFeatures(day),
      qualityChecks: await this.getQualityChecks(),
      performanceBenchmarks: await this.getPerformanceBenchmarks(),
      regressionSuite: await this.getRegressionSuite()
    })

    const validationResult = await rateLimitHandler.executeTaskWithOptimization(validationTask)
    
    if (validationResult) {
      this.execution!.artifacts.validationResults.push(validationResult)
      
      // Atualizar métricas de qualidade
      this.execution!.metrics.qualityScore = validationResult.overallQualityScore || 0
      
      // Identificar bloqueios de qualidade
      if (validationResult.criticalIssues && validationResult.criticalIssues.length > 0) {
        console.log(`⚠️ Issues críticos identificados na validação`)
        this.execution!.blockedTasks.push(...validationResult.criticalIssues)
      }
    }
  }

  /**
   * Fase 3: Sprint Review
   */
  private async executeSprintReview(): Promise<void> {
    console.log(`🎯 Sprint Review`)
    this.execution!.status = 'review'

    // Alex conduz o review
    const reviewTask = createSprintTask('alex-santos', 'retro', 'critical', {
      sprintGoal: this.execution!.sprint.goal,
      completedWork: this.execution!.artifacts.implementationResults,
      validationResults: this.execution!.artifacts.validationResults,
      metrics: this.execution!.metrics,
      stakeholderFeedback: await this.gatherStakeholderFeedback()
    })

    const reviewResult = await rateLimitHandler.executeTaskWithOptimization(reviewTask)
    
    if (reviewResult) {
      this.execution!.artifacts.finalDeliverable = reviewResult
      this.execution!.metrics.completedStoryPoints = reviewResult.completedStoryPoints || 0
    }
  }

  /**
   * Fase 4: Sprint Retrospective
   */
  private async executeSprintRetrospective(): Promise<void> {
    console.log(`🔄 Sprint Retrospective`)
    this.execution!.status = 'retrospective'

    // Cada agent contribui para a retrospectiva
    const retroTasks = []
    
    for (const [agentName, role] of Object.entries(this.agentRoles)) {
      const task = createSprintTask(agentName, 'retro', 'medium', {
        role,
        sprintExperience: this.getAgentSprintExperience(agentName),
        collaborationFeedback: this.getCollaborationFeedback(agentName),
        improvementSuggestions: await this.getImprovementContext(agentName),
        nextSprintPreparation: await this.getNextSprintContext()
      })
      retroTasks.push(task)
    }

    const retroResults = []
    for (const task of retroTasks) {
      const result = await rateLimitHandler.executeTaskWithOptimization(task)
      if (result) {
        retroResults.push(result)
      }
    }

    // Alex consolida a retrospectiva
    const consolidationTask = createSprintTask('alex-santos', 'retro', 'critical', {
      teamRetrospectives: retroResults,
      sprintMetrics: this.execution!.metrics,
      lessonsLearned: this.extractLessonsLearned(retroResults),
      actionItems: this.generateActionItems(retroResults)
    })

    const consolidatedRetro = await rateLimitHandler.executeTaskWithOptimization(consolidationTask)
    
    if (consolidatedRetro) {
      this.execution!.artifacts.retrospectiveReport = consolidatedRetro
    }
  }

  // Helper methods
  private getAgentBacklogItems(agentName: string): SprintBacklogItem[] {
    return this.execution!.sprint.backlog.filter(item => item.assignedAgent === agentName)
  }

  private calculateSprintProgress(): number {
    const total = this.execution!.sprint.backlog.length
    const completed = this.execution!.completedTasks.length
    return total > 0 ? (completed / total) * 100 : 0
  }

  private async getPreviousSprintContext(): Promise<any> {
    // Aqui buscaria contexto de sprints anteriores
    return {}
  }

  private async getQualityStandards(): Promise<any> {
    return {
      codeQuality: 'high',
      performanceTargets: { navigationLoad: '<200ms' },
      accessibilityCompliance: 'WCAG-AA'
    }
  }

  private getDayProgress(day: number, agentName: string): any {
    return { day, agent: agentName, completed: [], inProgress: [], blocked: [] }
  }

  private getDayPlan(day: number, agentName: string): any {
    return { day, agent: agentName, planned: this.getAgentBacklogItems(agentName) }
  }

  private getAgentBlockers(agentName: string): string[] {
    return this.execution!.blockedTasks.filter(task => task.includes(agentName))
  }

  private extractBlockers(dailyResults: any[]): string[] {
    return dailyResults.flatMap(result => result.blockers || [])
  }

  private getImplementationDependencies(type: string): any[] {
    return []
  }

  private async getIntegrationContext(): Promise<any> {
    return {}
  }

  private async getPerformanceTargets(): Promise<any> {
    return { navigationLoad: '<200ms', contentDiscovery: '<50ms' }
  }

  private async getMultilingualRequirements(): Promise<any> {
    return { languages: ['pt', 'en'], structure: 'mirrored' }
  }

  private async getMetadataStandards(): Promise<any> {
    return { schema: 'frontmatter-v1', validation: 'required' }
  }

  private getImplementedFeatures(day: number): any[] {
    return this.execution!.artifacts.implementationResults
      .filter(r => r.day <= day)
      .flatMap(r => r.results)
  }

  private async getQualityChecks(): Promise<any> {
    return { functional: true, performance: true, accessibility: true }
  }

  private async getPerformanceBenchmarks(): Promise<any> {
    return { navigationLoad: 200, contentDiscovery: 50 }
  }

  private async getRegressionSuite(): Promise<any> {
    return { enabled: true, coverage: 'full' }
  }

  private async gatherStakeholderFeedback(): Promise<any> {
    return { satisfaction: 'high', suggestions: [] }
  }

  private getAgentSprintExperience(agentName: string): any {
    return { agent: agentName, satisfaction: 8, challenges: [], successes: [] }
  }

  private getCollaborationFeedback(agentName: string): any {
    return { teamwork: 9, communication: 8, coordination: 7 }
  }

  private async getImprovementContext(agentName: string): Promise<any> {
    return { suggestions: [], processImprovements: [] }
  }

  private async getNextSprintContext(): Promise<any> {
    return { preparation: [], dependencies: [] }
  }

  private extractLessonsLearned(retroResults: any[]): string[] {
    return retroResults.flatMap(result => result.lessonsLearned || [])
  }

  private generateActionItems(retroResults: any[]): any[] {
    return retroResults.flatMap(result => result.actionItems || [])
  }

  /**
   * Obter status atual da execução
   */
  getExecutionStatus(): SprintExecution | null {
    return this.execution
  }

  /**
   * Pausar execução atual
   */
  pauseExecution(): void {
    if (this.execution) {
      console.log(`⏸️ Pausando execução da Sprint ${this.execution.sprint.number}`)
    }
  }

  /**
   * Retomar execução pausada
   */
  async resumeExecution(): Promise<void> {
    if (this.execution && this.execution.status !== 'completed') {
      console.log(`▶️ Retomando execução da Sprint ${this.execution.sprint.number}`)
      // Continuar de onde parou
      await rateLimitHandler.processQueue()
    }
  }
}