/**
 * ContextOptimizer - Sistema inteligente de gerenciamento de contexto
 * para otimização de prompts no Claude Code Pro plan
 * 
 * Implementa estratégias de context reuse, batch operations e compressão
 * para maximizar eficiência dentro dos limites de 10-40 prompts por ciclo
 */

interface ContextSession {
  id: string
  agentName: string
  sessionType: 'sprint-planning' | 'implementation' | 'validation' | 'retro' | 'daily'
  startTime: Date
  endTime?: Date
  contextSize: number
  reusableElements: ContextElement[]
  artifacts: any[]
  relatedSessions: string[]
}

interface ContextElement {
  id: string
  type: 'agent-knowledge' | 'sprint-context' | 'technical-spec' | 'validation-criteria' | 'team-state'
  content: any
  priority: 'essential' | 'important' | 'optional'
  reusability: number // 0-10 score
  lastUsed: Date
  usageCount: number
  expiresAt?: Date
}

interface BatchOperation {
  id: string
  agentGroup: string[]
  operationType: 'parallel' | 'sequential' | 'conditional'
  sharedContext: ContextElement[]
  individualContexts: Map<string, ContextElement[]>
  estimatedTokens: number
  optimizationLevel: 'aggressive' | 'balanced' | 'conservative'
}

interface ContextCompressionResult {
  originalSize: number
  compressedSize: number
  compressionRatio: number
  essentialElements: ContextElement[]
  removedElements: ContextElement[]
  compressionTechnique: string
}

export class ContextOptimizer {
  private activeSessions: Map<string, ContextSession> = new Map()
  private contextCache: Map<string, ContextElement> = new Map()
  private batchQueue: BatchOperation[] = []
  private compressionStrategies = new Map<string, Function>()

  constructor() {
    this.initializeCompressionStrategies()
  }

  /**
   * Inicializar estratégias de compressão de contexto
   */
  private initializeCompressionStrategies(): void {
    // Estratégia 1: Remoção de elementos redundantes
    this.compressionStrategies.set('deduplication', (elements: ContextElement[]) => {
      const unique = new Map<string, ContextElement>()
      elements.forEach(el => {
        const key = `${el.type}-${this.hashContent(el.content)}`
        if (!unique.has(key) || unique.get(key)!.priority === 'optional') {
          unique.set(key, el)
        }
      })
      return Array.from(unique.values())
    })

    // Estratégia 2: Summarização inteligente
    this.compressionStrategies.set('summarization', (elements: ContextElement[]) => {
      return elements.map(el => {
        if (el.type === 'sprint-context' && el.reusability < 5) {
          return {
            ...el,
            content: this.summarizeContent(el.content),
            id: `${el.id}-summarized`
          }
        }
        return el
      })
    })

    // Estratégia 3: Priorização baseada em uso
    this.compressionStrategies.set('prioritization', (elements: ContextElement[]) => {
      return elements
        .sort((a, b) => {
          // Score baseado em prioridade + reusabilidade + frequência de uso
          const scoreA = this.calculateContextScore(a)
          const scoreB = this.calculateContextScore(b)
          return scoreB - scoreA
        })
        .slice(0, Math.ceil(elements.length * 0.7)) // Keep top 70%
    })

    // Estratégia 4: Compressão temporal
    this.compressionStrategies.set('temporal', (elements: ContextElement[]) => {
      const now = new Date()
      return elements.filter(el => {
        if (el.expiresAt && el.expiresAt < now) {
          return false // Remove expired elements
        }
        // Keep recent and frequently used elements
        const daysSinceLastUse = (now.getTime() - el.lastUsed.getTime()) / (1000 * 60 * 60 * 24)
        return daysSinceLastUse < 2 || el.usageCount > 3
      })
    })
  }

  /**
   * Criar sessão de contexto otimizada para um agent
   */
  async createOptimizedSession(
    agentName: string,
    sessionType: ContextSession['sessionType'],
    baseContext?: any
  ): Promise<string> {
    const sessionId = `${agentName}-${sessionType}-${Date.now()}`
    
    // Recuperar contexto reutilizável relevante
    const reusableContext = this.getReusableContext(agentName, sessionType)
    
    // Criar elementos de contexto inicial
    const contextElements: ContextElement[] = []
    
    if (baseContext) {
      contextElements.push({
        id: `base-${sessionId}`,
        type: 'agent-knowledge',
        content: baseContext,
        priority: 'essential',
        reusability: 8,
        lastUsed: new Date(),
        usageCount: 1
      })
    }

    // Adicionar contexto de sprint se disponível
    const sprintContext = this.getActiveSprintContext()
    if (sprintContext) {
      contextElements.push({
        id: `sprint-${sessionId}`,
        type: 'sprint-context',
        content: sprintContext,
        priority: 'important',
        reusability: 9,
        lastUsed: new Date(),
        usageCount: 1
      })
    }

    // Adicionar conhecimento específico do agent
    const agentKnowledge = await this.getAgentSpecificKnowledge(agentName)
    if (agentKnowledge) {
      contextElements.push({
        id: `knowledge-${agentName}`,
        type: 'agent-knowledge',
        content: agentKnowledge,
        priority: 'essential',
        reusability: 10,
        lastUsed: new Date(),
        usageCount: 1
      })
    }

    const session: ContextSession = {
      id: sessionId,
      agentName,
      sessionType,
      startTime: new Date(),
      contextSize: this.calculateContextSize(contextElements),
      reusableElements: [...reusableContext, ...contextElements],
      artifacts: [],
      relatedSessions: this.findRelatedSessions(agentName, sessionType)
    }

    this.activeSessions.set(sessionId, session)
    
    console.log(`🧠 Sessão de contexto criada: ${sessionId}`)
    console.log(`📊 Elementos de contexto: ${session.reusableElements.length}`)
    console.log(`💾 Tamanho estimado: ${session.contextSize} tokens`)

    return sessionId
  }

  /**
   * Otimizar contexto para batch operations
   */
  async optimizeForBatch(
    agentNames: string[],
    operationType: BatchOperation['operationType'],
    sharedContext?: any
  ): Promise<BatchOperation> {
    const batchId = `batch-${Date.now()}`
    
    // Identificar contexto compartilhado entre agents
    const sharedElements = this.identifySharedContext(agentNames)
    
    // Preparar contextos individuais otimizados
    const individualContexts = new Map<string, ContextElement[]>()
    
    for (const agentName of agentNames) {
      const agentContext = await this.getOptimizedAgentContext(agentName)
      individualContexts.set(agentName, agentContext)
    }

    // Adicionar contexto compartilhado fornecido
    if (sharedContext) {
      sharedElements.push({
        id: `shared-${batchId}`,
        type: 'sprint-context',
        content: sharedContext,
        priority: 'essential',
        reusability: 10,
        lastUsed: new Date(),
        usageCount: 1
      })
    }

    const batchOperation: BatchOperation = {
      id: batchId,
      agentGroup: agentNames,
      operationType,
      sharedContext: sharedElements,
      individualContexts,
      estimatedTokens: this.estimateBatchTokens(sharedElements, individualContexts),
      optimizationLevel: 'balanced'
    }

    this.batchQueue.push(batchOperation)
    
    console.log(`🔄 Batch operation criada: ${batchId}`)
    console.log(`👥 Agents: ${agentNames.join(', ')}`)
    console.log(`📊 Tokens estimados: ${batchOperation.estimatedTokens}`)

    return batchOperation
  }

  /**
   * Comprimir contexto usando múltiplas estratégias
   */
  async compressContext(
    elements: ContextElement[],
    targetCompressionRatio: number = 0.7
  ): Promise<ContextCompressionResult> {
    const originalSize = this.calculateContextSize(elements)
    let workingElements = [...elements]
    const compressionSteps: string[] = []

    // Aplicar estratégias de compressão em ordem
    const strategies = ['temporal', 'deduplication', 'prioritization', 'summarization']
    
    for (const strategy of strategies) {
      const beforeSize = this.calculateContextSize(workingElements)
      const compressionFn = this.compressionStrategies.get(strategy)!
      workingElements = compressionFn(workingElements)
      const afterSize = this.calculateContextSize(workingElements)
      
      const currentRatio = afterSize / originalSize
      compressionSteps.push(`${strategy}: ${beforeSize} -> ${afterSize}`)
      
      if (currentRatio <= targetCompressionRatio) {
        break
      }
    }

    const compressedSize = this.calculateContextSize(workingElements)
    const compressionRatio = compressedSize / originalSize

    const result: ContextCompressionResult = {
      originalSize,
      compressedSize,
      compressionRatio,
      essentialElements: workingElements,
      removedElements: elements.filter(el => 
        !workingElements.some(we => we.id === el.id)
      ),
      compressionTechnique: compressionSteps.join(' | ')
    }

    console.log(`🗜️ Compressão aplicada: ${originalSize} -> ${compressedSize} tokens`)
    console.log(`📉 Razão de compressão: ${(compressionRatio * 100).toFixed(1)}%`)

    return result
  }

  /**
   * Otimizar contexto para reuso em sessões relacionadas
   */
  async optimizeForReuse(sessionId: string): Promise<ContextElement[]> {
    const session = this.activeSessions.get(sessionId)
    if (!session) {
      throw new Error(`Session ${sessionId} not found`)
    }

    // Identificar elementos com alto potencial de reuso
    const reusableElements = session.reusableElements.filter(el => {
      // Critérios para reusabilidade
      const isHighReusability = el.reusability >= 7
      const isEssentialOrImportant = el.priority !== 'optional'
      const isRecentlyUsed = this.isRecentlyUsed(el, 24) // 24 hours
      const hasHighUsage = el.usageCount >= 2

      return isHighReusability && isEssentialOrImportant && 
             (isRecentlyUsed || hasHighUsage)
    })

    // Marcar elementos como cacheable
    reusableElements.forEach(el => {
      this.contextCache.set(el.id, {
        ...el,
        lastUsed: new Date(),
        usageCount: el.usageCount + 1
      })
    })

    console.log(`♻️ Otimização para reuso: ${reusableElements.length} elementos cached`)

    return reusableElements
  }

  /**
   * Recuperar contexto reutilizável para um agent e tipo de sessão
   */
  private getReusableContext(
    agentName: string,
    sessionType: ContextSession['sessionType']
  ): ContextElement[] {
    const reusableElements: ContextElement[] = []

    // Buscar no cache elementos relevantes
    for (const [id, element] of this.contextCache) {
      const isAgentRelevant = id.includes(agentName) || 
                              element.type === 'sprint-context' ||
                              element.type === 'team-state'
      
      const isSessionRelevant = this.isSessionTypeCompatible(
        element.type,
        sessionType
      )

      const isNotExpired = !element.expiresAt || 
                          element.expiresAt > new Date()

      if (isAgentRelevant && isSessionRelevant && isNotExpired) {
        reusableElements.push(element)
      }
    }

    // Ordenar por relevância
    return reusableElements.sort((a, b) => 
      this.calculateContextScore(b) - this.calculateContextScore(a)
    )
  }

  /**
   * Calcular score de relevância para um elemento de contexto
   */
  private calculateContextScore(element: ContextElement): number {
    const priorityWeight = {
      'essential': 10,
      'important': 7,
      'optional': 3
    }

    const now = new Date()
    const daysSinceLastUse = (now.getTime() - element.lastUsed.getTime()) / 
                            (1000 * 60 * 60 * 24)
    
    const recencyFactor = Math.max(0, 10 - daysSinceLastUse)
    const usageFactor = Math.min(10, element.usageCount)
    const reusabilityFactor = element.reusability

    return (priorityWeight[element.priority] * 0.4) +
           (recencyFactor * 0.3) +
           (usageFactor * 0.2) +
           (reusabilityFactor * 0.1)
  }

  /**
   * Verificar compatibilidade entre tipos de contexto e sessão
   */
  private isSessionTypeCompatible(
    contextType: ContextElement['type'],
    sessionType: ContextSession['sessionType']
  ): boolean {
    const compatibility = {
      'agent-knowledge': ['sprint-planning', 'implementation', 'validation', 'retro', 'daily'],
      'sprint-context': ['sprint-planning', 'implementation', 'validation', 'retro', 'daily'],
      'technical-spec': ['implementation', 'validation'],
      'validation-criteria': ['validation', 'retro'],
      'team-state': ['daily', 'retro']
    }

    return compatibility[contextType]?.includes(sessionType) || false
  }

  /**
   * Identificar contexto compartilhado entre agents
   */
  private identifySharedContext(agentNames: string[]): ContextElement[] {
    const sharedElements: ContextElement[] = []

    // Sprint context é sempre compartilhado
    const sprintContext = this.getActiveSprintContext()
    if (sprintContext) {
      sharedElements.push({
        id: `shared-sprint-${Date.now()}`,
        type: 'sprint-context',
        content: sprintContext,
        priority: 'essential',
        reusability: 10,
        lastUsed: new Date(),
        usageCount: 1
      })
    }

    // Team state é compartilhado
    const teamState = this.getTeamState()
    if (teamState) {
      sharedElements.push({
        id: `shared-team-${Date.now()}`,
        type: 'team-state',
        content: teamState,
        priority: 'important',
        reusability: 8,
        lastUsed: new Date(),
        usageCount: 1
      })
    }

    return sharedElements
  }

  // Helper methods
  private hashContent(content: any): string {
    return Buffer.from(JSON.stringify(content)).toString('base64').slice(0, 16)
  }

  private summarizeContent(content: any): any {
    // Simplified summarization - na implementação real usaria AI
    if (typeof content === 'object' && content !== null) {
      const keys = Object.keys(content)
      if (keys.length > 5) {
        const summarized = {}
        keys.slice(0, 3).forEach(key => {
          summarized[key] = content[key]
        })
        summarized['...'] = `+${keys.length - 3} more properties`
        return summarized
      }
    }
    return content
  }

  private calculateContextSize(elements: ContextElement[]): number {
    // Estimativa simplificada de tokens
    return elements.reduce((total, el) => {
      const contentSize = JSON.stringify(el.content).length
      return total + Math.ceil(contentSize / 4) // ~4 chars per token
    }, 0)
  }

  private isRecentlyUsed(element: ContextElement, hours: number): boolean {
    const now = new Date()
    const hoursSinceLastUse = (now.getTime() - element.lastUsed.getTime()) / 
                             (1000 * 60 * 60)
    return hoursSinceLastUse <= hours
  }

  private findRelatedSessions(
    agentName: string,
    sessionType: ContextSession['sessionType']
  ): string[] {
    const related: string[] = []
    
    for (const [id, session] of this.activeSessions) {
      if (session.agentName === agentName || session.sessionType === sessionType) {
        related.push(id)
      }
    }
    
    return related
  }

  private async getAgentSpecificKnowledge(agentName: string): Promise<any> {
    // Aqui carregaria conhecimento específico do agent do .claude/agents/
    const agentKnowledge = {
      'alex-santos': { role: 'technical-leader', expertise: ['architecture', 'coordination'] },
      'marina-costa': { role: 'frontend-developer', expertise: ['vue', 'nuxt-ui'] },
      'ricardo-lima': { role: 'backend-specialist', expertise: ['nuxt-content', 'performance'] },
      'camila-rodriguez': { role: 'qa-engineer', expertise: ['testing', 'validation'] },
      'bruno-oliveira': { role: 'content-specialist', expertise: ['documentation', 'i18n'] }
    }
    
    return agentKnowledge[agentName] || null
  }

  private async getOptimizedAgentContext(agentName: string): Promise<ContextElement[]> {
    const agentKnowledge = await this.getAgentSpecificKnowledge(agentName)
    const elements: ContextElement[] = []

    if (agentKnowledge) {
      elements.push({
        id: `optimized-${agentName}`,
        type: 'agent-knowledge',
        content: agentKnowledge,
        priority: 'essential',
        reusability: 10,
        lastUsed: new Date(),
        usageCount: 1
      })
    }

    return elements
  }

  private estimateBatchTokens(
    sharedContext: ContextElement[],
    individualContexts: Map<string, ContextElement[]>
  ): number {
    const sharedTokens = this.calculateContextSize(sharedContext)
    const individualTokens = Array.from(individualContexts.values())
      .reduce((total, context) => total + this.calculateContextSize(context), 0)
    
    return sharedTokens + individualTokens
  }

  private getActiveSprintContext(): any {
    // Retorna contexto da sprint ativa
    return {
      sprintNumber: 3,
      goal: 'Dynamic Navigation Implementation',
      status: 'active',
      team: ['alex-santos', 'marina-costa', 'ricardo-lima', 'camila-rodriguez', 'bruno-oliveira']
    }
  }

  private getTeamState(): any {
    return {
      velocity: 8.5,
      qualityScore: 92,
      collaboration: 9,
      blockers: []
    }
  }

  /**
   * Finalizar sessão e persistir elementos reutilizáveis
   */
  async finalizeSession(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId)
    if (!session) return

    session.endTime = new Date()
    
    // Salvar elementos reutilizáveis para futuras sessões
    await this.optimizeForReuse(sessionId)
    
    this.activeSessions.delete(sessionId)
    console.log(`✅ Sessão finalizada: ${sessionId}`)
  }

  /**
   * Limpar cache de contexto expirado
   */
  cleanupExpiredContext(): void {
    const now = new Date()
    let removedCount = 0

    for (const [id, element] of this.contextCache) {
      if (element.expiresAt && element.expiresAt < now) {
        this.contextCache.delete(id)
        removedCount++
      }
    }

    console.log(`🧹 Context cleanup: ${removedCount} elementos removidos`)
  }

  /**
   * Obter estatísticas do otimizador
   */
  getStats(): {
    activeSessions: number
    cacheSize: number
    batchQueueSize: number
    totalTokensManaged: number
  } {
    const totalTokens = Array.from(this.contextCache.values())
      .reduce((total, el) => total + this.calculateContextSize([el]), 0)

    return {
      activeSessions: this.activeSessions.size,
      cacheSize: this.contextCache.size,
      batchQueueSize: this.batchQueue.length,
      totalTokensManaged: totalTokens
    }
  }
}