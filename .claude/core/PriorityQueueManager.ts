/**
 * PriorityQueueManager - Sistema inteligente de gerenciamento de filas com prioridades
 * 
 * Gerencia múltiplas filas de execução com prioridades dinâmicas, balanceamento
 * de carga e otimização para Claude Code Pro plan rate limits
 */

import { rateLimitHandler, type ExecutionTask } from '../utils/OptimizedRateLimitHandler'
import { ContextOptimizer } from '../utils/ContextOptimizer'

interface QueueItem {
  id: string
  task: ExecutionTask
  priority: QueuePriority
  submittedAt: Date
  estimatedStartTime?: Date
  dependencies: string[]
  metadata: QueueItemMetadata
}

interface QueuePriority {
  level: number // 0-10 (10 = highest priority)
  type: 'critical' | 'high' | 'medium' | 'low' | 'background'
  boostFactor: number // Dynamic priority boost
  decayRate: number // How fast priority decays over time
  deadline?: Date
}

interface QueueItemMetadata {
  agentName: string
  taskType: string
  sprintContext?: any
  retryCount: number
  lastAttempt?: Date
  failureReason?: string
  estimatedDuration: number
  resourceRequirements: ResourceRequirements
}

interface ResourceRequirements {
  prompts: number
  memory: number
  contextSize: number
  concurrencyLimit: number
}

interface QueueConfiguration {
  maxQueueSize: number
  priorityThresholds: {
    critical: number
    high: number
    medium: number
    low: number
  }
  retryPolicies: Map<string, RetryPolicy>
  loadBalancing: LoadBalancingConfig
  deadlineManagement: DeadlineConfig
}

interface RetryPolicy {
  maxRetries: number
  backoffStrategy: 'linear' | 'exponential' | 'fixed'
  baseDelay: number
  maxDelay: number
  retryConditions: string[]
}

interface LoadBalancingConfig {
  enabled: boolean
  strategy: 'round-robin' | 'least-loaded' | 'priority-weighted' | 'deadline-aware'
  rebalanceInterval: number
  capacityLimits: Map<string, number>
}

interface DeadlineConfig {
  enabled: boolean
  urgencyThreshold: number // hours before deadline to boost priority
  emergencyThreshold: number // hours before deadline for emergency handling
  escalationPolicy: 'boost-priority' | 'preempt-others' | 'allocate-resources'
}

interface QueueMetrics {
  totalItems: number
  itemsByPriority: Map<string, number>
  averageWaitTime: number
  throughput: number
  successRate: number
  retryRate: number
  deadlineMissRate: number
  resourceUtilization: number
}

export class PriorityQueueManager {
  private queues: Map<string, QueueItem[]> = new Map()
  private configuration: QueueConfiguration
  private contextOptimizer: ContextOptimizer
  private metrics: QueueMetrics
  private activeExecutions: Map<string, QueueItem> = new Map()
  private retryScheduler: Map<string, NodeJS.Timeout> = new Map()

  constructor(config?: Partial<QueueConfiguration>) {
    this.contextOptimizer = new ContextOptimizer()
    this.configuration = this.initializeConfiguration(config)
    this.metrics = this.initializeMetrics()
    this.initializeQueues()
    this.startQueueProcessor()
  }

  /**
   * Inicializar configuração padrão
   */
  private initializeConfiguration(config?: Partial<QueueConfiguration>): QueueConfiguration {
    return {
      maxQueueSize: 1000,
      priorityThresholds: {
        critical: 9,
        high: 7,
        medium: 5,
        low: 3
      },
      retryPolicies: new Map([
        ['rate_limit', {
          maxRetries: 5,
          backoffStrategy: 'exponential',
          baseDelay: 60000, // 1 minute
          maxDelay: 300000, // 5 minutes
          retryConditions: ['rate_limit_exceeded', 'temporary_unavailable']
        }],
        ['execution_error', {
          maxRetries: 3,
          backoffStrategy: 'linear',
          baseDelay: 30000, // 30 seconds
          maxDelay: 180000, // 3 minutes
          retryConditions: ['execution_failed', 'context_error']
        }]
      ]),
      loadBalancing: {
        enabled: true,
        strategy: 'deadline-aware',
        rebalanceInterval: 30000, // 30 seconds
        capacityLimits: new Map([
          ['alex-santos', 10],
          ['marina-costa', 8],
          ['ricardo-lima', 8],
          ['camila-rodriguez', 6],
          ['bruno-oliveira', 6]
        ])
      },
      deadlineManagement: {
        enabled: true,
        urgencyThreshold: 4, // 4 hours
        emergencyThreshold: 1, // 1 hour
        escalationPolicy: 'boost-priority'
      },
      ...config
    }
  }

  /**
   * Inicializar métricas
   */
  private initializeMetrics(): QueueMetrics {
    return {
      totalItems: 0,
      itemsByPriority: new Map(),
      averageWaitTime: 0,
      throughput: 0,
      successRate: 0,
      retryRate: 0,
      deadlineMissRate: 0,
      resourceUtilization: 0
    }
  }

  /**
   * Inicializar filas por prioridade
   */
  private initializeQueues(): void {
    this.queues.set('critical', [])
    this.queues.set('high', [])
    this.queues.set('medium', [])
    this.queues.set('low', [])
    this.queues.set('background', [])
    
    console.log('📋 Filas de prioridade inicializadas')
  }

  /**
   * Adicionar item à fila com prioridade inteligente
   */
  async enqueue(task: ExecutionTask, options?: {
    priority?: Partial<QueuePriority>
    deadline?: Date
    dependencies?: string[]
    metadata?: Partial<QueueItemMetadata>
  }): Promise<string> {
    // Calcular prioridade dinâmica
    const priority = this.calculateDynamicPriority(task, options?.priority, options?.deadline)
    
    // Preparar metadados
    const metadata: QueueItemMetadata = {
      agentName: task.agentName,
      taskType: task.taskType,
      retryCount: 0,
      estimatedDuration: this.estimateTaskDuration(task),
      resourceRequirements: this.calculateResourceRequirements(task),
      ...options?.metadata
    }

    const queueItem: QueueItem = {
      id: `queue-${task.id}-${Date.now()}`,
      task,
      priority,
      submittedAt: new Date(),
      dependencies: options?.dependencies || [],
      metadata
    }

    // Adicionar à fila apropriada
    const queueType = this.getQueueType(priority)
    const queue = this.queues.get(queueType)!
    
    // Inserir mantendo ordem de prioridade
    this.insertByPriority(queue, queueItem)
    
    // Estimar tempo de início
    queueItem.estimatedStartTime = this.estimateStartTime(queueItem)

    // Atualizar métricas
    this.updateMetrics()

    console.log(`📥 Item enfileirado: ${queueItem.id}`)
    console.log(`🎯 Prioridade: ${priority.type} (${priority.level})`)
    console.log(`⏰ Início estimado: ${queueItem.estimatedStartTime?.toLocaleTimeString()}`)

    // Notificar processador se necessário
    if (priority.type === 'critical') {
      this.processHighPriorityItem(queueItem)
    }

    return queueItem.id
  }

  /**
   * Processar próximo item na fila
   */
  async dequeue(): Promise<QueueItem | null> {
    // Verificar deadlines urgentes primeiro
    const urgentItem = this.findUrgentDeadlineItem()
    if (urgentItem) {
      this.removeFromQueue(urgentItem)
      return urgentItem
    }

    // Processar por prioridade
    for (const queueType of ['critical', 'high', 'medium', 'low', 'background']) {
      const queue = this.queues.get(queueType)!
      
      for (let i = 0; i < queue.length; i++) {
        const item = queue[i]
        
        // Verificar dependências
        if (this.areDependenciesResolved(item)) {
          queue.splice(i, 1)
          this.metrics.totalItems--
          return item
        }
      }
    }

    return null
  }

  /**
   * Processar item de alta prioridade imediatamente
   */
  private async processHighPriorityItem(item: QueueItem): Promise<void> {
    console.log(`🚨 Processando item crítico: ${item.id}`)
    
    try {
      // Preparar para execução imediata
      this.activeExecutions.set(item.id, item)
      
      // Otimizar contexto
      const optimizedContext = await this.contextOptimizer.createOptimizedSession(
        item.metadata.agentName,
        item.metadata.taskType as any,
        item.task.context
      )

      // Executar task
      const result = await rateLimitHandler.executeTaskWithOptimization({
        ...item.task,
        context: optimizedContext
      })

      if (result) {
        await this.handleExecutionSuccess(item, result)
      } else {
        await this.handleExecutionFailure(item, 'rate_limit_exceeded')
      }

    } catch (error: any) {
      await this.handleExecutionFailure(item, error.message)
    } finally {
      this.activeExecutions.delete(item.id)
    }
  }

  /**
   * Iniciar processador de fila em background
   */
  private startQueueProcessor(): void {
    const processInterval = 5000 // 5 seconds
    
    setInterval(async () => {
      try {
        await this.processQueue()
        this.rebalanceQueues()
        this.updatePriorities()
        this.cleanupExpiredItems()
      } catch (error) {
        console.error('Erro no processador de fila:', error)
      }
    }, processInterval)

    console.log('🔄 Processador de fila iniciado')
  }

  /**
   * Processar fila principal
   */
  private async processQueue(): Promise<void> {
    // Verificar capacidade disponível
    const availableCapacity = this.getAvailableCapacity()
    if (availableCapacity <= 0) {
      return
    }

    // Processar até o limite de capacidade
    for (let i = 0; i < availableCapacity; i++) {
      const item = await this.dequeue()
      if (!item) break

      // Executar em background
      this.executeQueueItem(item).catch(error => {
        console.error(`Erro na execução do item ${item.id}:`, error)
      })
    }
  }

  /**
   * Executar item da fila
   */
  private async executeQueueItem(item: QueueItem): Promise<void> {
    console.log(`🔄 Executando item da fila: ${item.id}`)
    
    this.activeExecutions.set(item.id, item)
    const startTime = new Date()

    try {
      // Otimizar contexto
      const sessionId = await this.contextOptimizer.createOptimizedSession(
        item.metadata.agentName,
        item.metadata.taskType as any,
        item.task.context
      )

      // Executar task
      const result = await rateLimitHandler.executeTaskWithOptimization(item.task)

      if (result) {
        await this.handleExecutionSuccess(item, result)
      } else {
        await this.handleExecutionFailure(item, 'rate_limit_exceeded')
      }

      // Finalizar sessão de contexto
      await this.contextOptimizer.finalizeSession(sessionId)

    } catch (error: any) {
      await this.handleExecutionFailure(item, error.message)
    } finally {
      this.activeExecutions.delete(item.id)
      
      // Atualizar métricas de tempo
      const executionTime = new Date().getTime() - startTime.getTime()
      this.updateExecutionMetrics(item, executionTime)
    }
  }

  /**
   * Lidar com sucesso na execução
   */
  private async handleExecutionSuccess(item: QueueItem, result: any): Promise<void> {
    console.log(`✅ Execução bem-sucedida: ${item.id}`)
    
    // Atualizar métricas
    this.metrics.successRate = this.calculateSuccessRate()
    
    // Liberar dependências
    this.resolveDependencies(item.id)
    
    // Log para auditoria
    this.logExecution(item, 'success', result)
  }

  /**
   * Lidar com falha na execução
   */
  private async handleExecutionFailure(item: QueueItem, reason: string): Promise<void> {
    console.log(`❌ Falha na execução: ${item.id} - ${reason}`)
    
    item.metadata.retryCount++
    item.metadata.lastAttempt = new Date()
    item.metadata.failureReason = reason

    // Verificar se deve fazer retry
    const retryPolicy = this.getRetryPolicy(reason)
    if (item.metadata.retryCount <= retryPolicy.maxRetries) {
      await this.scheduleRetry(item, retryPolicy)
    } else {
      console.log(`💀 Item falhou definitivamente: ${item.id}`)
      this.logExecution(item, 'failed', { reason, retries: item.metadata.retryCount })
    }

    // Atualizar métricas
    this.metrics.retryRate = this.calculateRetryRate()
  }

  /**
   * Agendar retry com backoff
   */
  private async scheduleRetry(item: QueueItem, policy: RetryPolicy): Promise<void> {
    const delay = this.calculateRetryDelay(item.metadata.retryCount, policy)
    
    console.log(`🔄 Agendando retry em ${delay}ms: ${item.id}`)
    
    const timer = setTimeout(async () => {
      // Boost priority for retries
      item.priority.level = Math.min(10, item.priority.level + 1)
      item.priority.boostFactor += 0.2
      
      // Re-enqueue with higher priority
      const queueType = this.getQueueType(item.priority)
      const queue = this.queues.get(queueType)!
      this.insertByPriority(queue, item)
      
      this.retryScheduler.delete(item.id)
      console.log(`🔁 Item re-enfileirado para retry: ${item.id}`)
    }, delay)

    this.retryScheduler.set(item.id, timer)
  }

  /**
   * Calcular prioridade dinâmica
   */
  private calculateDynamicPriority(
    task: ExecutionTask,
    priorityOverride?: Partial<QueuePriority>,
    deadline?: Date
  ): QueuePriority {
    // Prioridade base baseada no tipo de task
    let baseLevel = {
      'sprint-planning': 8,
      'daily': 5,
      'implementation': 6,
      'validation': 7,
      'retro': 4
    }[task.taskType] || 5

    // Ajustar baseado na prioridade da task
    const taskPriorityBoost = {
      'critical': 2,
      'high': 1,
      'medium': 0,
      'low': -1
    }[task.priority] || 0

    baseLevel += taskPriorityBoost

    // Boost por deadline
    let deadlineBoost = 0
    if (deadline) {
      const hoursToDeadline = (deadline.getTime() - Date.now()) / (1000 * 60 * 60)
      if (hoursToDeadline <= this.configuration.deadlineManagement.emergencyThreshold) {
        deadlineBoost = 3
      } else if (hoursToDeadline <= this.configuration.deadlineManagement.urgencyThreshold) {
        deadlineBoost = 1
      }
    }

    const finalLevel = Math.min(10, Math.max(0, baseLevel + deadlineBoost))
    
    return {
      level: finalLevel,
      type: this.getPriorityType(finalLevel),
      boostFactor: 1.0,
      decayRate: 0.1,
      deadline,
      ...priorityOverride
    }
  }

  /**
   * Rebalancear filas baseado na carga
   */
  private rebalanceQueues(): void {
    if (!this.configuration.loadBalancing.enabled) return

    // Implementar estratégia de rebalanceamento baseada na configuração
    switch (this.configuration.loadBalancing.strategy) {
      case 'deadline-aware':
        this.rebalanceByDeadlines()
        break
      case 'priority-weighted':
        this.rebalanceByPriorities()
        break
      case 'least-loaded':
        this.rebalanceByLoad()
        break
    }
  }

  /**
   * Atualizar prioridades dinamicamente
   */
  private updatePriorities(): void {
    const now = new Date()
    
    for (const queue of this.queues.values()) {
      for (const item of queue) {
        // Decay de prioridade ao longo do tempo
        const ageInHours = (now.getTime() - item.submittedAt.getTime()) / (1000 * 60 * 60)
        const decayAmount = ageInHours * item.priority.decayRate
        
        // Boost por waiting time (prevent starvation)
        const waitBoost = Math.min(2, ageInHours * 0.1)
        
        item.priority.level = Math.max(0, Math.min(10, 
          item.priority.level - decayAmount + waitBoost
        ))

        // Boost por deadline approaching
        if (item.priority.deadline) {
          const hoursToDeadline = (item.priority.deadline.getTime() - now.getTime()) / (1000 * 60 * 60)
          if (hoursToDeadline <= this.configuration.deadlineManagement.urgencyThreshold) {
            item.priority.boostFactor += 0.5
          }
        }
      }
      
      // Re-sort queue after priority updates
      queue.sort((a, b) => this.comparePriority(b, a))
    }
  }

  // Helper methods
  private getQueueType(priority: QueuePriority): string {
    if (priority.level >= this.configuration.priorityThresholds.critical) return 'critical'
    if (priority.level >= this.configuration.priorityThresholds.high) return 'high'
    if (priority.level >= this.configuration.priorityThresholds.medium) return 'medium'
    if (priority.level >= this.configuration.priorityThresholds.low) return 'low'
    return 'background'
  }

  private getPriorityType(level: number): QueuePriority['type'] {
    if (level >= 9) return 'critical'
    if (level >= 7) return 'high'
    if (level >= 5) return 'medium'
    if (level >= 3) return 'low'
    return 'background'
  }

  private insertByPriority(queue: QueueItem[], item: QueueItem): void {
    let insertIndex = 0
    for (let i = 0; i < queue.length; i++) {
      if (this.comparePriority(item, queue[i]) > 0) {
        insertIndex = i
        break
      }
      insertIndex = i + 1
    }
    queue.splice(insertIndex, 0, item)
    this.metrics.totalItems++
  }

  private comparePriority(a: QueueItem, b: QueueItem): number {
    // Compare by adjusted priority level
    const aAdjusted = a.priority.level * a.priority.boostFactor
    const bAdjusted = b.priority.level * b.priority.boostFactor
    
    if (aAdjusted !== bAdjusted) {
      return aAdjusted - bAdjusted
    }
    
    // Tie-break by submission time (FIFO for same priority)
    return a.submittedAt.getTime() - b.submittedAt.getTime()
  }

  private estimateTaskDuration(task: ExecutionTask): number {
    const baseDurations = {
      'sprint-planning': 300000, // 5 minutes
      'daily': 60000, // 1 minute
      'implementation': 600000, // 10 minutes
      'validation': 180000, // 3 minutes
      'retro': 240000 // 4 minutes
    }
    
    return baseDurations[task.taskType as keyof typeof baseDurations] || 300000
  }

  private calculateResourceRequirements(task: ExecutionTask): ResourceRequirements {
    return {
      prompts: task.estimatedPrompts,
      memory: 100, // MB
      contextSize: 1000, // tokens
      concurrencyLimit: 1
    }
  }

  private estimateStartTime(item: QueueItem): Date {
    // Simplified estimation based on queue position and average processing time
    const queueType = this.getQueueType(item.priority)
    const queue = this.queues.get(queueType)!
    const position = queue.findIndex(qi => qi.id === item.id)
    
    const averageProcessingTime = 180000 // 3 minutes
    const estimatedWait = position * averageProcessingTime
    
    return new Date(Date.now() + estimatedWait)
  }

  private findUrgentDeadlineItem(): QueueItem | null {
    const now = new Date()
    
    for (const queue of this.queues.values()) {
      for (const item of queue) {
        if (item.priority.deadline) {
          const hoursToDeadline = (item.priority.deadline.getTime() - now.getTime()) / (1000 * 60 * 60)
          if (hoursToDeadline <= this.configuration.deadlineManagement.emergencyThreshold) {
            return item
          }
        }
      }
    }
    
    return null
  }

  private removeFromQueue(item: QueueItem): void {
    for (const queue of this.queues.values()) {
      const index = queue.findIndex(qi => qi.id === item.id)
      if (index !== -1) {
        queue.splice(index, 1)
        this.metrics.totalItems--
        break
      }
    }
  }

  private areDependenciesResolved(item: QueueItem): boolean {
    return item.dependencies.every(depId => 
      !this.activeExecutions.has(depId) && !this.isInQueue(depId)
    )
  }

  private isInQueue(itemId: string): boolean {
    for (const queue of this.queues.values()) {
      if (queue.some(item => item.id === itemId)) {
        return true
      }
    }
    return false
  }

  private getAvailableCapacity(): number {
    const maxConcurrent = 5 // Max concurrent executions
    return Math.max(0, maxConcurrent - this.activeExecutions.size)
  }

  private getRetryPolicy(reason: string): RetryPolicy {
    if (reason.includes('rate_limit')) {
      return this.configuration.retryPolicies.get('rate_limit')!
    }
    return this.configuration.retryPolicies.get('execution_error')!
  }

  private calculateRetryDelay(retryCount: number, policy: RetryPolicy): number {
    let delay = policy.baseDelay
    
    switch (policy.backoffStrategy) {
      case 'exponential':
        delay = policy.baseDelay * Math.pow(2, retryCount - 1)
        break
      case 'linear':
        delay = policy.baseDelay * retryCount
        break
      case 'fixed':
        delay = policy.baseDelay
        break
    }
    
    return Math.min(delay, policy.maxDelay)
  }

  private resolveDependencies(completedItemId: string): void {
    // Mark this item as completed for dependency resolution
    // Implementation would notify dependent items
  }

  private rebalanceByDeadlines(): void {
    // Move items with approaching deadlines to higher priority queues
  }

  private rebalanceByPriorities(): void {
    // Adjust priorities based on overall queue load
  }

  private rebalanceByLoad(): void {
    // Distribute load across available agents
  }

  private updateMetrics(): void {
    this.metrics.totalItems = Array.from(this.queues.values())
      .reduce((sum, queue) => sum + queue.length, 0)
    
    // Update priority distribution
    this.metrics.itemsByPriority.clear()
    for (const [type, queue] of this.queues) {
      this.metrics.itemsByPriority.set(type, queue.length)
    }
  }

  private updateExecutionMetrics(item: QueueItem, executionTime: number): void {
    // Update average wait time, throughput, etc.
  }

  private calculateSuccessRate(): number {
    // Calculate based on recent execution history
    return 0.95 // Placeholder
  }

  private calculateRetryRate(): number {
    // Calculate based on recent retry history
    return 0.05 // Placeholder
  }

  private cleanupExpiredItems(): void {
    // Remove items that have exceeded maximum wait time or retry limits
  }

  private logExecution(item: QueueItem, status: string, details: any): void {
    console.log(`📊 Execution log: ${item.id} - ${status}`, details)
  }

  /**
   * Obter estatísticas da fila
   */
  getQueueStats(): QueueMetrics & {
    queueSizes: Map<string, number>
    activeExecutions: number
    pendingRetries: number
  } {
    return {
      ...this.metrics,
      queueSizes: new Map(Array.from(this.queues.entries()).map(([type, queue]) => [type, queue.length])),
      activeExecutions: this.activeExecutions.size,
      pendingRetries: this.retryScheduler.size
    }
  }

  /**
   * Limpar recursos
   */
  cleanup(): void {
    // Clear all retry timers
    this.retryScheduler.forEach(timer => clearTimeout(timer))
    this.retryScheduler.clear()
    
    console.log('🧹 Priority queue manager cleanup completed')
  }
}