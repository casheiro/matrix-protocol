/**
 * ParallelClaudeRunner - Real Claude CLI Integration
 * 
 * Implementa execução real de agents Claude usando system calls
 * baseado no exemplo original do usuário
 */

import { spawn, ChildProcess } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'

interface ClaudeExecution {
  id: string
  agentName: string
  prompt: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'rate_limited'
  startTime?: Date
  endTime?: Date
  output?: string
  error?: string
  process?: ChildProcess
}

interface ClaudeConfig {
  maxConcurrent: number
  timeout: number
  retryAttempts: number
  retryDelay: number
  agentsDirectory: string
}

export class ParallelClaudeRunner {
  private executions: Map<string, ClaudeExecution> = new Map()
  private runningProcesses: Map<string, ChildProcess> = new Map()
  private config: ClaudeConfig
  private isShuttingDown: boolean = false

  constructor(config?: Partial<ClaudeConfig>) {
    this.config = {
      maxConcurrent: 3, // Conservative for Pro plan
      timeout: 300000, // 5 minutes
      retryAttempts: 3,
      retryDelay: 60000, // 1 minute
      agentsDirectory: path.join(__dirname, '..', 'agents'),
      ...config
    }
  }

  /**
   * Executar agent Claude com prompt específico
   */
  async executeAgent(
    agentName: string, 
    prompt: string, 
    context?: any
  ): Promise<string> {
    const executionId = `${agentName}-${Date.now()}`
    
    // Verificar se agent existe
    await this.validateAgent(agentName)
    
    // Criar execução
    const execution: ClaudeExecution = {
      id: executionId,
      agentName,
      prompt,
      status: 'pending',
      startTime: new Date()
    }
    
    this.executions.set(executionId, execution)
    
    try {
      // Aguardar slot disponível
      await this.waitForAvailableSlot()
      
      // Executar Claude CLI
      const result = await this.runClaudeCLI(execution, context)
      
      execution.status = 'completed'
      execution.endTime = new Date()
      execution.output = result
      
      console.log(chalk.green(`✅ Agent ${agentName} executado com sucesso`))
      
      return result
      
    } catch (error: any) {
      execution.status = 'failed'
      execution.endTime = new Date()
      execution.error = error.message
      
      // Verificar se é rate limit
      if (this.isRateLimitError(error.message)) {
        execution.status = 'rate_limited'
        console.log(chalk.yellow(`⏳ Rate limit detectado para ${agentName}`))
        
        // Tentar retry após delay
        const retryResult = await this.handleRateLimit(execution)
        return retryResult
      }
      
      console.error(chalk.red(`❌ Erro na execução de ${agentName}:`), error)
      throw error
      
    } finally {
      this.runningProcesses.delete(executionId)
    }
  }

  /**
   * Executar múltiplos agents em paralelo
   */
  async executeParallel(
    agentPrompts: Array<{ agentName: string; prompt: string; context?: any }>
  ): Promise<Array<{ agentName: string; result: string; error?: string }>> {
    console.log(chalk.blue(`🔄 Executando ${agentPrompts.length} agents em paralelo`))
    
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
   * Executar Claude CLI real
   */
  private async runClaudeCLI(
    execution: ClaudeExecution, 
    context?: any
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.isShuttingDown) {
        reject(new Error('System is shutting down'))
        return
      }

      // Preparar prompt que inclui informações do agent
      const agentPath = path.join(this.config.agentsDirectory, `${execution.agentName}.md`)
      
      // Ler conteúdo do agent file para incluir no prompt
      let agentContent = ''
      try {
        agentContent = fs.readFileSync(agentPath, 'utf-8')
      } catch (error) {
        console.log(chalk.yellow(`⚠️ Não foi possível ler agent file: ${agentPath}`))
      }

      // Construir prompt completo incluindo o agent
      const fullPrompt = agentContent ? 
        `${agentContent}\n\n---\n\n${execution.prompt}` : 
        execution.prompt

      const args = ['--print']

      console.log(chalk.gray(`🔧 Executando: claude --print < prompt`))
      
      // Spawn Claude CLI process
      const childProcess = spawn('claude', args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env },
        timeout: this.config.timeout
      })
      
      this.runningProcesses.set(execution.id, childProcess)
      execution.status = 'running'
      
      // Enviar prompt via stdin
      if (childProcess.stdin) {
        childProcess.stdin.write(fullPrompt)
        childProcess.stdin.end()
      }
      
      let stdout = ''
      let stderr = ''
      
      childProcess.stdout?.on('data', (data: any) => {
        stdout += data.toString()
      })
      
      childProcess.stderr?.on('data', (data: any) => {
        stderr += data.toString()
      })
      
      childProcess.on('close', (code: any) => {
        this.runningProcesses.delete(execution.id)
        
        if (code === 0) {
          // Verificar se output contém rate limit message
          if (this.isRateLimitError(stdout)) {
            reject(new Error(`Rate limit: ${stdout}`))
          } else {
            resolve(stdout.trim())
          }
        } else {
          reject(new Error(`Claude CLI failed with code ${code}: ${stderr}`))
        }
      })
      
      childProcess.on('error', (error: any) => {
        this.runningProcesses.delete(execution.id)
        reject(new Error(`Failed to start Claude CLI: ${error.message}`))
      })
      
      // Setup timeout
      setTimeout(() => {
        if (this.runningProcesses.has(execution.id)) {
          childProcess.kill('SIGTERM')
          reject(new Error(`Claude CLI timeout after ${this.config.timeout}ms`))
        }
      }, this.config.timeout)
    })
  }

  /**
   * Verificar se agent existe
   */
  private async validateAgent(agentName: string): Promise<void> {
    const agentPath = path.join(this.config.agentsDirectory, `${agentName}.md`)
    
    if (!fs.existsSync(agentPath)) {
      throw new Error(`Agent file not found: ${agentPath}`)
    }
    
    // Verificar se arquivo é legível
    try {
      await fs.promises.access(agentPath, fs.constants.R_OK)
    } catch (error) {
      throw new Error(`Agent file not readable: ${agentPath}`)
    }
  }

  /**
   * Aguardar slot disponível para execução
   */
  private async waitForAvailableSlot(): Promise<void> {
    while (this.runningProcesses.size >= this.config.maxConcurrent) {
      if (this.isShuttingDown) {
        throw new Error('System is shutting down')
      }
      
      console.log(chalk.yellow(`⏳ Aguardando slot disponível (${this.runningProcesses.size}/${this.config.maxConcurrent})`))
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  /**
   * Verificar se erro é de rate limit (método público para uso externo)
   */
  isRateLimitError(message: string): boolean {
    const rateLimitPatterns = [
      /5-hour limit reached/i,
      /usage limit reached/i,
      /rate limit/i,
      /resets.*\d{1,2}(am|pm)/i,
      /limit.*reached/i,
      /quota.*exceeded/i
    ]
    
    return rateLimitPatterns.some(pattern => pattern.test(message))
  }

  /**
   * Lidar com rate limit
   */
  private async handleRateLimit(execution: ClaudeExecution): Promise<string> {
    console.log(chalk.yellow(`🚫 Rate limit detectado para ${execution.agentName}`))
    
    // Extrair tempo de reset se disponível
    const resetTime = this.extractResetTime(execution.error || '')
    
    if (resetTime) {
      const waitTime = resetTime.getTime() - Date.now()
      if (waitTime > 0) {
        console.log(chalk.blue(`⏰ Aguardando reset em ${resetTime.toLocaleTimeString()}`))
        console.log(chalk.gray(`⏳ Tempo de espera: ${Math.round(waitTime / 60000)} minutos`))
        
        // Aguardar até o reset
        await new Promise(resolve => setTimeout(resolve, waitTime + 5000)) // +5s buffer
        
        // Retry execução
        console.log(chalk.blue(`🔄 Tentando novamente: ${execution.agentName}`))
        return await this.executeAgent(execution.agentName, execution.prompt)
      }
    }
    
    // Fallback: aguardar tempo padrão
    console.log(chalk.blue(`⏳ Aguardando tempo padrão: ${this.config.retryDelay}ms`))
    await new Promise(resolve => setTimeout(resolve, this.config.retryDelay))
    
    return await this.executeAgent(execution.agentName, execution.prompt)
  }

  /**
   * Extrair tempo de reset da mensagem de rate limit
   */
  private extractResetTime(message: string): Date | null {
    // Pattern: "resets 5pm" ou "resets at 9pm"
    const pattern = /resets?\s+(?:at\s+)?(\d{1,2})(am|pm)/i
    const match = message.match(pattern)
    
    if (match) {
      const hour = parseInt(match[1])
      const isPM = match[2].toLowerCase() === 'pm'
      
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
    
    return null
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
      rate_limited: executions.filter(e => e.status === 'rate_limited').length
    }
  }

  /**
   * Cleanup: terminar todos os processos
   */
  async cleanup(): Promise<void> {
    this.isShuttingDown = true
    
    console.log(chalk.blue('🧹 Limpando execuções do Claude CLI...'))
    
    // Terminar todos os processos em execução
    const killPromises = Array.from(this.runningProcesses.values()).map(process => {
      return new Promise<void>((resolve) => {
        process.on('close', () => resolve())
        process.kill('SIGTERM')
        
        // Force kill after 5 seconds
        setTimeout(() => {
          if (!process.killed) {
            process.kill('SIGKILL')
          }
          resolve()
        }, 5000)
      })
    })
    
    await Promise.all(killPromises)
    
    this.runningProcesses.clear()
    this.executions.clear()
    
    console.log(chalk.green('✅ Claude CLI cleanup completado'))
  }

  /**
   * Verificar se Claude CLI está disponível
   */
  static async checkCLIAvailable(): Promise<boolean> {
    return new Promise((resolve) => {
      const process = spawn('claude', ['--version'], { stdio: 'pipe' })
      
      process.on('close', (code) => {
        resolve(code === 0)
      })
      
      process.on('error', () => {
        resolve(false)
      })
      
      // Timeout after 5 seconds
      setTimeout(() => {
        process.kill()
        resolve(false)
      }, 5000)
    })
  }
}

// Create singleton instance
export const claudeRunner = new ParallelClaudeRunner()