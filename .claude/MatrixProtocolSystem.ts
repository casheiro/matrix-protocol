/**
 * MatrixProtocolSystem - Sistema principal integrado
 * 
 * Orquestra todos os componentes do sistema de dynamic navigation
 * com execução real de Claude agents, otimizada para Claude Code Pro plan
 */

import { CycleAwareSprintExecutor } from './core/CycleAwareSprintExecutor'
import { PriorityQueueManager } from './core/PriorityQueueManager'
import { AgentBatchOperations } from './core/AgentBatchOperations'
import { RealTimeUsageMonitor } from './monitoring/RealTimeUsageMonitor'
import { rateLimitHandler, createSprintTask } from './utils/OptimizedRateLimitHandler'
import { ContextOptimizer } from './utils/ContextOptimizer'

interface SystemConfiguration {
  enableMonitoring: boolean
  enableBatchOperations: boolean
  enableQueueManagement: boolean
  maxConcurrentSprints: number
  autoOptimization: boolean
  debugMode: boolean
}

interface SprintDefinition {
  id: string
  number: number
  goal: string
  duration: number
  team: string[]
  backlog: any[]
  criteria: any[]
}

export class MatrixProtocolSystem {
  private sprintExecutor!: CycleAwareSprintExecutor
  private queueManager!: PriorityQueueManager
  private batchOperations!: AgentBatchOperations
  private usageMonitor!: RealTimeUsageMonitor
  private contextOptimizer!: ContextOptimizer
  private configuration: SystemConfiguration
  
  private isRunning: boolean = false
  private activeSprints: Map<string, any> = new Map()

  constructor(config?: Partial<SystemConfiguration>) {
    this.configuration = {
      enableMonitoring: true,
      enableBatchOperations: true,
      enableQueueManagement: true,
      maxConcurrentSprints: 1,
      autoOptimization: true,
      debugMode: process.env.NODE_ENV === 'development',
      ...config
    }

    this.initializeComponents()
  }

  /**
   * Inicializar todos os componentes do sistema
   */
  private initializeComponents(): void {
    console.log('🚀 Inicializando Matrix Protocol System')

    // Inicializar componentes principais
    this.sprintExecutor = new CycleAwareSprintExecutor()
    this.queueManager = new PriorityQueueManager()
    this.batchOperations = new AgentBatchOperations()
    this.contextOptimizer = new ContextOptimizer()

    // Inicializar monitoramento se habilitado
    if (this.configuration.enableMonitoring) {
      this.usageMonitor = new RealTimeUsageMonitor(
        this.queueManager,
        this.batchOperations
      )
    }

    console.log('✅ Componentes inicializados')
  }

  /**
   * Iniciar sistema completo
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('⚠️ Sistema já está em execução')
      return
    }

    console.log('🏁 Iniciando Matrix Protocol System')
    
    try {
      // Iniciar monitoramento
      if (this.configuration.enableMonitoring) {
        await this.usageMonitor.start()
      }

      this.isRunning = true
      
      console.log('✅ Sistema iniciado com sucesso')
      console.log(`📊 Monitoramento: ${this.configuration.enableMonitoring ? 'ATIVO' : 'INATIVO'}`)
      console.log(`🔄 Batch Operations: ${this.configuration.enableBatchOperations ? 'ATIVO' : 'INATIVO'}`)
      console.log(`📋 Queue Management: ${this.configuration.enableQueueManagement ? 'ATIVO' : 'INATIVO'}`)

    } catch (error) {
      console.error('❌ Erro ao iniciar sistema:', error)
      throw error
    }
  }

  /**
   * Executar sprint completa com todos os agents
   */
  async executeSprint(sprintDefinition: SprintDefinition): Promise<any> {
    if (!this.isRunning) {
      throw new Error('Sistema não está em execução. Chame start() primeiro.')
    }

    if (this.activeSprints.size >= this.configuration.maxConcurrentSprints) {
      throw new Error(`Máximo de ${this.configuration.maxConcurrentSprints} sprints concorrentes atingido`)
    }

    console.log(`🚀 Iniciando execução da Sprint ${sprintDefinition.number}`)
    console.log(`🎯 Goal: ${sprintDefinition.goal}`)
    console.log(`👥 Team: ${sprintDefinition.team.join(', ')}`)

    try {
      // Registrar sprint ativa
      this.activeSprints.set(sprintDefinition.id, {
        definition: sprintDefinition,
        startTime: new Date(),
        status: 'executing'
      })

      // Executar sprint usando o executor otimizado
      const sprintResult = await this.sprintExecutor.executeSprint(sprintDefinition)

      // Atualizar status
      const activeSprint = this.activeSprints.get(sprintDefinition.id)!
      activeSprint.status = 'completed'
      activeSprint.endTime = new Date()
      activeSprint.result = sprintResult

      console.log(`✅ Sprint ${sprintDefinition.number} completada com sucesso`)
      
      return sprintResult

    } catch (error) {
      console.error(`❌ Erro na execução da Sprint ${sprintDefinition.number}:`, error)
      
      // Atualizar status de erro
      const activeSprint = this.activeSprints.get(sprintDefinition.id)
      if (activeSprint) {
        activeSprint.status = 'failed'
        activeSprint.error = error
      }
      
      throw error
    }
  }

  /**
   * Executar operação batch com múltiplos agents
   */
  async executeBatchOperation(
    agentNames: string[],
    operationType: 'sprint-planning' | 'daily-standup' | 'implementation' | 'validation' | 'retrospective',
    context?: any
  ): Promise<any> {
    if (!this.configuration.enableBatchOperations) {
      throw new Error('Batch operations não estão habilitadas')
    }

    console.log(`🔄 Executando batch operation: ${operationType}`)
    console.log(`👥 Agents: ${agentNames.join(', ')}`)

    // Criar tasks para cada agent
    const tasks = agentNames.map(agentName => 
      createSprintTask(agentName, operationType as any, 'high', context)
    )

    // Criar e executar batch otimizado
    const batch = await this.batchOperations.createOptimizedBatch(tasks)
    const results = await this.batchOperations.executeBatch(batch.id)

    console.log(`✅ Batch operation completada: ${operationType}`)
    
    return results
  }

  /**
   * Adicionar task à fila com prioridade
   */
  async enqueueTask(
    agentName: string,
    taskType: 'sprint-planning' | 'daily' | 'implementation' | 'validation' | 'retro',
    priority: 'critical' | 'high' | 'medium' | 'low' = 'medium',
    context?: any,
    options?: {
      deadline?: Date
      dependencies?: string[]
    }
  ): Promise<string> {
    if (!this.configuration.enableQueueManagement) {
      throw new Error('Queue management não está habilitado')
    }

    const task = createSprintTask(agentName, taskType, priority, context)
    
    const queueItemId = await this.queueManager.enqueue(task, {
      priority: { type: priority, level: this.getPriorityLevel(priority) },
      deadline: options?.deadline,
      dependencies: options?.dependencies
    })

    console.log(`📥 Task enfileirada: ${agentName} - ${taskType} (${priority})`)
    
    return queueItemId
  }

  /**
   * Executar demonstração completa do sistema
   */
  async runDemonstration(): Promise<void> {
    console.log('🎭 Iniciando demonstração do Matrix Protocol System')
    
    try {
      // 1. Sprint Planning Demo
      console.log('\n🎯 === FASE 1: SPRINT PLANNING ===')
      await this.executeBatchOperation(
        ['alex-santos', 'marina-costa', 'ricardo-lima', 'camila-rodriguez', 'bruno-oliveira'],
        'sprint-planning',
        {
          sprintGoal: 'Implementar Dynamic Navigation System',
          sprintNumber: 3,
          duration: 10,
          backlogItems: [
            'Implementar useDocsNavigation.ts',
            'Criar APIs de content discovery',
            'Refatorar componentes de navegação',
            'Validar performance <200ms',
            'Documentar sistema completo'
          ]
        }
      )

      // 2. Daily Standup Demo
      console.log('\n🤝 === FASE 2: DAILY STANDUP ===')
      await this.executeBatchOperation(
        ['alex-santos', 'marina-costa', 'ricardo-lima', 'camila-rodriguez', 'bruno-oliveira'],
        'daily-standup',
        {
          day: 3,
          sprintProgress: 30,
          currentBlockers: [],
          todayPlan: 'Continue implementation work'
        }
      )

      // 3. Implementation Demo (Parallel)
      console.log('\n💻 === FASE 3: IMPLEMENTATION ===')
      const implementationResults = await Promise.all([
        this.enqueueTask('marina-costa', 'implementation', 'high', {
          component: 'useDocsNavigation.ts',
          requirements: 'Vue 3 Composition API with Nuxt Content integration'
        }),
        this.enqueueTask('ricardo-lima', 'implementation', 'high', {
          component: 'Content Discovery APIs',
          requirements: 'Performance <50ms with caching'
        }),
        this.enqueueTask('bruno-oliveira', 'implementation', 'medium', {
          component: 'Documentation and i18n',
          requirements: 'Bilingual PT/EN with metadata standards'
        })
      ])

      // 4. Validation Demo
      console.log('\n🔍 === FASE 4: VALIDATION ===')
      await this.enqueueTask('camila-rodriguez', 'validation', 'critical', {
        validationType: 'comprehensive',
        targets: ['performance', 'functionality', 'accessibility'],
        criteria: ['<200ms navigation', 'WCAG AA compliance', 'zero regressions']
      })

      // 5. Retrospective Demo
      console.log('\n🔄 === FASE 5: RETROSPECTIVE ===')
      await this.executeBatchOperation(
        ['alex-santos', 'marina-costa', 'ricardo-lima', 'camila-rodriguez', 'bruno-oliveira'],
        'retrospective',
        {
          sprintResults: 'Sprint 3 completed successfully',
          metrics: { velocity: 85, quality: 92, satisfaction: 9 },
          improvements: ['Better context optimization', 'Faster handoffs']
        }
      )

      // 6. System Status Report
      console.log('\n📊 === RELATÓRIO FINAL ===')
      await this.displaySystemStatus()

      console.log('\n✅ Demonstração completada com sucesso!')

    } catch (error) {
      console.error('❌ Erro na demonstração:', error)
      throw error
    }
  }

  /**
   * Criar sprint de exemplo para teste
   */
  createExampleSprint(): SprintDefinition {
    return {
      id: `sprint-${Date.now()}`,
      number: 3,
      goal: 'Implementar Dynamic Navigation System completo',
      duration: 10,
      team: ['alex-santos', 'marina-costa', 'ricardo-lima', 'camila-rodriguez', 'bruno-oliveira'],
      backlog: [
        {
          id: 'story-001',
          title: 'Implementar useDocsNavigation.ts',
          assignedAgent: 'marina-costa',
          estimatedComplexity: 'high',
          acceptanceCriteria: ['Integration with content discovery', 'Performance optimization', 'Type safety']
        },
        {
          id: 'story-002',
          title: 'Criar Content Discovery APIs',
          assignedAgent: 'ricardo-lima',
          estimatedComplexity: 'high',
          acceptanceCriteria: ['<50ms response time', 'Hierarchical structure', 'Caching strategy']
        },
        {
          id: 'story-003',
          title: 'Refatorar DocSidebar.vue',
          assignedAgent: 'marina-costa',
          estimatedComplexity: 'medium',
          acceptanceCriteria: ['Dynamic navigation integration', 'Responsive design', 'Accessibility']
        },
        {
          id: 'story-004',
          title: 'Validar Performance Targets',
          assignedAgent: 'camila-rodriguez',
          estimatedComplexity: 'medium',
          acceptanceCriteria: ['<200ms navigation load', 'Regression testing', 'Performance monitoring']
        },
        {
          id: 'story-005',
          title: 'Documentar Sistema Completo',
          assignedAgent: 'bruno-oliveira',
          estimatedComplexity: 'medium',
          acceptanceCriteria: ['Bilingual documentation', 'API references', 'Usage examples']
        }
      ],
      criteria: [
        { id: 'criteria-001', description: 'Navigation load time <200ms', validation: 'automated', priority: 'must' },
        { id: 'criteria-002', description: 'Full TypeScript coverage', validation: 'automated', priority: 'must' },
        { id: 'criteria-003', description: 'WCAG AA compliance', validation: 'manual', priority: 'must' },
        { id: 'criteria-004', description: 'Zero breaking changes', validation: 'automated', priority: 'must' }
      ]
    }
  }

  /**
   * Exibir status do sistema
   */
  async displaySystemStatus(): Promise<void> {
    console.log('\n╔══════════════════════════════════════════════════════════════════════════════════╗')
    console.log('║                                SYSTEM STATUS                                     ║')
    console.log('╠══════════════════════════════════════════════════════════════════════════════════╣')

    // Rate Limit Status
    const rateLimitStatus = rateLimitHandler.getStatus()
    console.log(`║ 🔥 Rate Limit: ${rateLimitStatus.state.promptsUsed}/${rateLimitStatus.state.promptsRemaining + rateLimitStatus.state.promptsUsed} prompts`)
    if (rateLimitStatus.state.resetTime) {
      console.log(`║    Reset: ${rateLimitStatus.state.resetTime.toLocaleTimeString()}`)
    }

    // Queue Status
    if (this.configuration.enableQueueManagement) {
      const queueStats = this.queueManager.getQueueStats()
      const totalQueued = Array.from(queueStats.queueSizes.values()).reduce((sum, size) => sum + size, 0)
      console.log(`║ 📋 Queue: ${totalQueued} items, ${queueStats.activeExecutions} executing, ${queueStats.pendingRetries} retries`)
    }

    // Batch Operations Status
    if (this.configuration.enableBatchOperations) {
      const batchStats = this.batchOperations.getBatchStats()
      console.log(`║ 🔄 Batches: ${batchStats.activeBatches} active, ${batchStats.totalBatchesExecuted} completed`)
      console.log(`║    Efficiency: ${batchStats.averageEfficiency.toFixed(1)}%, Prompts saved: ${batchStats.totalPromptsSaved}`)
    }

    // Context Optimizer Status
    const contextStats = this.contextOptimizer.getStats()
    console.log(`║ 🧠 Context: ${contextStats.activeSessions} sessions, ${contextStats.cacheSize} cached items`)

    // Active Sprints
    console.log(`║ 🏃‍♂️ Sprints: ${this.activeSprints.size} active`)
    this.activeSprints.forEach((sprint, id) => {
      console.log(`║    ${sprint.definition.number}: ${sprint.status} (${sprint.definition.goal})`)
    })

    // Monitoring Status
    if (this.configuration.enableMonitoring) {
      const metrics = this.usageMonitor.getCurrentMetrics()
      console.log(`║ 📊 Overall Efficiency: ${(metrics.efficiency.overall * 100).toFixed(1)}%`)
      
      const activeAlerts = this.usageMonitor.getActiveAlerts()
      if (activeAlerts.length > 0) {
        console.log(`║ 🚨 Active Alerts: ${activeAlerts.length}`)
        activeAlerts.slice(0, 2).forEach(alert => {
          console.log(`║    ${alert.type}: ${alert.message}`)
        })
      }
    }

    console.log('║                                                                                  ║')
    console.log(`║ Sistema executando: ${this.isRunning ? '🟢 ATIVO' : '🔴 INATIVO'}`)
    console.log(`║ Última atualização: ${new Date().toLocaleString()}`)
    console.log('╚══════════════════════════════════════════════════════════════════════════════════╝')
  }

  /**
   * Parar sistema
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      console.log('⚠️ Sistema já está parado')
      return
    }

    console.log('🛑 Parando Matrix Protocol System')
    
    try {
      // Parar monitoramento
      if (this.configuration.enableMonitoring) {
        this.usageMonitor.stop()
      }

      // Cleanup de componentes
      rateLimitHandler.cleanup()
      this.queueManager.cleanup()
      this.contextOptimizer.cleanupExpiredContext()

      this.isRunning = false
      
      console.log('✅ Sistema parado com sucesso')

    } catch (error) {
      console.error('❌ Erro ao parar sistema:', error)
      throw error
    }
  }

  // Helper methods
  private getPriorityLevel(priority: string): number {
    const levels = { critical: 9, high: 7, medium: 5, low: 3 }
    return levels[priority as keyof typeof levels] || 5
  }

  /**
   * Obter status de sprints ativas
   */
  getActiveSprintsStatus(): any[] {
    return Array.from(this.activeSprints.values())
  }

  /**
   * Obter configuração atual
   */
  getConfiguration(): SystemConfiguration {
    return { ...this.configuration }
  }
}

// Factory function para criar sistema com configuração padrão
export function createMatrixProtocolSystem(config?: Partial<SystemConfiguration>): MatrixProtocolSystem {
  return new MatrixProtocolSystem(config)
}

// Exemplo de uso principal
export async function runMatrixProtocolDemo(): Promise<void> {
  const system = createMatrixProtocolSystem({
    enableMonitoring: true,
    enableBatchOperations: true,
    enableQueueManagement: true,
    debugMode: true
  })

  try {
    // Iniciar sistema
    await system.start()
    
    // Executar demonstração completa
    await system.runDemonstration()
    
    // Manter sistema ativo para monitoramento
    console.log('\n🔍 Sistema ativo para monitoramento. Pressione Ctrl+C para parar.')
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Recebido sinal de interrupção. Parando sistema...')
      await system.stop()
      process.exit(0)
    })

  } catch (error) {
    console.error('❌ Erro na execução:', error)
    await system.stop()
    process.exit(1)
  }
}

// Executar demo se chamado diretamente
if (require.main === module) {
  runMatrixProtocolDemo().catch(console.error)
}