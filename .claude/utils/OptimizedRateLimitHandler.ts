/**
 * OptimizedRateLimitHandler - Sistema inteligente de gerenciamento de rate limits
 * para Claude Code Pro plan com otimização de ciclos de 5 horas
 * 
 * Baseado no plano Pro: 10-40 prompts por ciclo de 5 horas
 * Mensagem de exemplo: "5-hour limit reached ∙ resets 5pm"
 */

interface RateLimitState {
  isLimited: boolean
  resetTime: Date | null
  currentCycle: number
  promptsUsed: number
  promptsRemaining: number
  nextAvailableSlot: Date | null
}

interface CycleOptimization {
  maxPromptsPerCycle: number
  bufferPrompts: number // Reserve para operações críticas
  batchSize: number
  priorityQueue: ExecutionTask[]
  backgroundQueue: ExecutionTask[]
}

interface ExecutionTask {
  id: string
  agentName: string
  taskType: 'sprint-planning' | 'daily' | 'retro' | 'implementation' | 'validation'
  priority: 'critical' | 'high' | 'medium' | 'low'
  estimatedPrompts: number
  maxRetries: number
  currentRetries: number
  context?: any
}

export class OptimizedRateLimitHandler {
  private state: RateLimitState
  private optimization: CycleOptimization
  private timers: Map<string, NodeJS.Timeout> = new Map()

  constructor() {
    this.state = {
      isLimited: false,
      resetTime: null,
      currentCycle: 1,
      promptsUsed: 0,
      promptsRemaining: 35, // Conservative estimate for Pro plan
      nextAvailableSlot: null
    }

    this.optimization = {
      maxPromptsPerCycle: 35, // Conservative para Pro plan
      bufferPrompts: 5, // Reserve para emergências
      batchSize: 8, // Batch otimizado para agent operations
      priorityQueue: [],
      backgroundQueue: []
    }
  }

  /**
   * Parse da mensagem de rate limit do Claude
   * Formatos suportados:
   * - "5-hour limit reached ∙ resets 5pm"
   * - "Claude usage limit reached. Your limit will reset at 9pm"
   */
  parseRateLimitMessage(message: string): { resetTime: Date | null; isLimited: boolean } {
    // Pattern 1: "5-hour limit reached ∙ resets 5pm"
    const pattern1 = /resets\s+(\d{1,2})(am|pm)/i
    const match1 = message.match(pattern1)
    
    if (match1) {
      const hour = parseInt(match1[1])
      const isPM = match1[2].toLowerCase() === 'pm'
      const resetTime = this.parseTimeToDate(hour, isPM)
      
      return {
        resetTime,
        isLimited: true
      }
    }

    // Pattern 2: "Your limit will reset at 9pm"
    const pattern2 = /reset\s+at\s+(\d{1,2})(am|pm)/i
    const match2 = message.match(pattern2)
    
    if (match2) {
      const hour = parseInt(match2[1])
      const isPM = match2[2].toLowerCase() === 'pm'
      const resetTime = this.parseTimeToDate(hour, isPM)
      
      return {
        resetTime,
        isLimited: true
      }
    }

    return { resetTime: null, isLimited: false }
  }

  /**
   * Converte hora (5pm) para Date object considerando timezone
   */
  private parseTimeToDate(hour: number, isPM: boolean): Date {
    const now = new Date()
    const resetDate = new Date(now)
    
    // Convert to 24-hour format
    let hour24 = hour
    if (isPM && hour !== 12) hour24 += 12
    if (!isPM && hour === 12) hour24 = 0
    
    resetDate.setHours(hour24, 0, 0, 0)
    
    // If reset time is in the past today, it must be tomorrow
    if (resetDate <= now) {
      resetDate.setDate(resetDate.getDate() + 1)
    }
    
    return resetDate
  }

  /**
   * Processa resposta do Claude CLI e detecta rate limiting
   */
  async processClaudeResponse(response: string): Promise<{
    isRateLimited: boolean
    shouldWait: boolean
    waitUntil?: Date
    retryAfter?: number
  }> {
    const rateLimitInfo = this.parseRateLimitMessage(response)
    
    if (rateLimitInfo.isLimited) {
      this.state.isLimited = true
      this.state.resetTime = rateLimitInfo.resetTime
      
      if (rateLimitInfo.resetTime) {
        const now = new Date()
        const waitTime = rateLimitInfo.resetTime.getTime() - now.getTime()
        
        console.log(`🚫 Rate limit detected. Waiting until ${rateLimitInfo.resetTime.toLocaleTimeString()}`)
        console.log(`⏰ Wait time: ${Math.round(waitTime / 60000)} minutes`)
        
        return {
          isRateLimited: true,
          shouldWait: true,
          waitUntil: rateLimitInfo.resetTime,
          retryAfter: waitTime
        }
      }
    }

    return {
      isRateLimited: false,
      shouldWait: false
    }
  }

  /**
   * Agenda retry automático quando rate limit reset
   */
  async scheduleRetryAfterReset(task: ExecutionTask): Promise<void> {
    if (!this.state.resetTime) {
      throw new Error('No reset time available for scheduling retry')
    }

    const waitTime = this.state.resetTime.getTime() - Date.now()
    const timerId = `retry-${task.id}`

    console.log(`📅 Agendando retry para ${this.state.resetTime.toLocaleString()}`)
    console.log(`⚡ Task: ${task.agentName} - ${task.taskType}`)

    const timer = setTimeout(async () => {
      console.log(`🔄 Executando retry agendado: ${task.id}`)
      this.resetCycleState()
      await this.executeTaskWithOptimization(task)
      this.timers.delete(timerId)
    }, waitTime)

    this.timers.set(timerId, timer)
  }

  /**
   * Resetar estado quando novo ciclo inicia
   */
  private resetCycleState(): void {
    this.state.isLimited = false
    this.state.resetTime = null
    this.state.currentCycle++
    this.state.promptsUsed = 0
    this.state.promptsRemaining = this.optimization.maxPromptsPerCycle
    
    console.log(`🔄 Novo ciclo iniciado: Ciclo ${this.state.currentCycle}`)
    console.log(`💡 Prompts disponíveis: ${this.state.promptsRemaining}`)
  }

  /**
   * Executa task com otimização inteligente de prompts
   */
  async executeTaskWithOptimization(task: ExecutionTask): Promise<any> {
    // Verificar se há prompts suficientes
    if (this.state.promptsRemaining < task.estimatedPrompts) {
      console.log(`⚠️ Prompts insuficientes para ${task.id}. Adicionando à queue.`)
      this.addToQueue(task)
      return null
    }

    try {
      console.log(`🚀 Executando: ${task.agentName} - ${task.taskType}`)
      console.log(`📊 Prompts estimados: ${task.estimatedPrompts}`)
      
      // Simular execução do Claude CLI aqui
      const result = await this.executeClaudeTask(task)
      
      // Atualizar contadores
      this.state.promptsUsed += task.estimatedPrompts
      this.state.promptsRemaining -= task.estimatedPrompts
      
      console.log(`✅ Task completada. Prompts restantes: ${this.state.promptsRemaining}`)
      
      return result
      
    } catch (error: any) {
      // Verificar se é erro de rate limit
      const rateLimitResponse = await this.processClaudeResponse(error.message || '')
      
      if (rateLimitResponse.isRateLimited) {
        console.log(`🔄 Rate limit detectado. Agendando retry...`)
        await this.scheduleRetryAfterReset(task)
        return null
      }
      
      // Retry para outros erros
      if (task.currentRetries < task.maxRetries) {
        task.currentRetries++
        console.log(`🔄 Retry ${task.currentRetries}/${task.maxRetries} para ${task.id}`)
        return await this.executeTaskWithOptimization(task)
      }
      
      throw error
    }
  }

  /**
   * Simulação da execução do Claude CLI
   * Na implementação real, aqui chamaria o ParallelClaudeRunner
   */
  private async executeClaudeTask(task: ExecutionTask): Promise<any> {
    // Aqui seria a chamada real para o Claude CLI
    // Por exemplo: await claudeRunner.run(task.agentName, task.context)
    
    // Simular tempo de execução baseado no tipo de task
    const executionTime = this.getExecutionTime(task.taskType)
    await new Promise(resolve => setTimeout(resolve, executionTime))
    
    return {
      taskId: task.id,
      agent: task.agentName,
      type: task.taskType,
      status: 'completed',
      promptsUsed: task.estimatedPrompts,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Tempo estimado de execução por tipo de task (ms)
   */
  private getExecutionTime(taskType: string): number {
    const executionTimes = {
      'sprint-planning': 8000,
      'daily': 3000,
      'retro': 5000,
      'implementation': 12000,
      'validation': 6000
    }
    
    return executionTimes[taskType as keyof typeof executionTimes] || 5000
  }

  /**
   * Adicionar task à queue baseado na prioridade
   */
  addToQueue(task: ExecutionTask): void {
    if (task.priority === 'critical' || task.priority === 'high') {
      this.optimization.priorityQueue.push(task)
      this.optimization.priorityQueue.sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
        return priorityOrder[a.priority as keyof typeof priorityOrder] - 
               priorityOrder[b.priority as keyof typeof priorityOrder]
      })
    } else {
      this.optimization.backgroundQueue.push(task)
    }
    
    console.log(`📋 Task adicionada à queue: ${task.id} (${task.priority})`)
  }

  /**
   * Processa queue quando prompts estão disponíveis
   */
  async processQueue(): Promise<void> {
    // Processar priority queue primeiro
    while (this.optimization.priorityQueue.length > 0 && this.state.promptsRemaining > 5) {
      const task = this.optimization.priorityQueue.shift()!
      if (this.state.promptsRemaining >= task.estimatedPrompts) {
        await this.executeTaskWithOptimization(task)
      } else {
        // Recolocar na queue se não há prompts suficientes
        this.optimization.priorityQueue.unshift(task)
        break
      }
    }

    // Processar background queue se há prompts disponíveis
    while (this.optimization.backgroundQueue.length > 0 && this.state.promptsRemaining > 10) {
      const task = this.optimization.backgroundQueue.shift()!
      if (this.state.promptsRemaining >= task.estimatedPrompts) {
        await this.executeTaskWithOptimization(task)
      } else {
        this.optimization.backgroundQueue.unshift(task)
        break
      }
    }
  }

  /**
   * Obter status atual do rate limit handler
   */
  getStatus(): {
    state: RateLimitState
    optimization: CycleOptimization
    queueSizes: { priority: number; background: number }
    timeToReset?: number
  } {
    const status = {
      state: { ...this.state },
      optimization: { 
        ...this.optimization,
        priorityQueue: this.optimization.priorityQueue.length,
        backgroundQueue: this.optimization.backgroundQueue.length
      },
      queueSizes: {
        priority: this.optimization.priorityQueue.length,
        background: this.optimization.backgroundQueue.length
      }
    }

    if (this.state.resetTime) {
      status.timeToReset = this.state.resetTime.getTime() - Date.now()
    }

    return status as any
  }

  /**
   * Limpar todos os timers
   */
  cleanup(): void {
    this.timers.forEach(timer => clearTimeout(timer))
    this.timers.clear()
    console.log('🧹 Rate limit handler cleanup completed')
  }
}

// Singleton instance para uso global
export const rateLimitHandler = new OptimizedRateLimitHandler()

// Exemplo de uso
export function createSprintTask(
  agentName: string,
  taskType: 'sprint-planning' | 'daily' | 'retro' | 'implementation' | 'validation',
  priority: 'critical' | 'high' | 'medium' | 'low' = 'medium',
  context?: any
): ExecutionTask {
  const promptEstimates = {
    'sprint-planning': 8,
    'daily': 3,
    'retro': 5,
    'implementation': 12,
    'validation': 6
  }

  return {
    id: `${agentName}-${taskType}-${Date.now()}`,
    agentName,
    taskType,
    priority,
    estimatedPrompts: promptEstimates[taskType],
    maxRetries: 3,
    currentRetries: 0,
    context
  }
}