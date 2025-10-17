/**
 * Test System - Validação básica do Matrix Protocol System
 * 
 * Testa funcionalidades essenciais do sistema sem dependências externas
 */

import { ParallelClaudeRunner } from './core/ParallelClaudeRunner'
import { rateLimitHandler } from './utils/OptimizedRateLimitHandler'
import * as fs from 'fs'
import * as path from 'path'

interface TestResult {
  name: string
  passed: boolean
  error?: string
  duration: number
}

class SystemTester {
  private results: TestResult[] = []

  async runTest(name: string, testFn: () => Promise<void>): Promise<void> {
    const startTime = Date.now()
    
    try {
      await testFn()
      this.results.push({
        name,
        passed: true,
        duration: Date.now() - startTime
      })
      console.log(`✅ ${name}`)
    } catch (error: any) {
      this.results.push({
        name,
        passed: false,
        error: error.message,
        duration: Date.now() - startTime
      })
      console.log(`❌ ${name}: ${error.message}`)
    }
  }

  async runAllTests(): Promise<void> {
    console.log('🧪 Iniciando testes do Matrix Protocol System\n')

    // Test 1: Verificar estrutura de arquivos
    await this.runTest('Estrutura de arquivos', async () => {
      const requiredFiles = [
        'core/ParallelClaudeRunner.ts',
        'utils/OptimizedRateLimitHandler.ts',
        'package.json'
      ]

      for (const file of requiredFiles) {
        const filePath = path.join(__dirname, file)
        if (!fs.existsSync(filePath)) {
          throw new Error(`Arquivo obrigatório não encontrado: ${file}`)
        }
      }
    })

    // Test 2: Verificar agents directory
    await this.runTest('Diretório de agents', async () => {
      const agentsDir = path.join(__dirname, 'agents')
      if (!fs.existsSync(agentsDir)) {
        throw new Error('Diretório de agents não encontrado')
      }

      const requiredAgents = [
        'alex-santos.md',
        'marina-costa.md',
        'ricardo-lima.md',
        'camila-rodriguez.md',
        'bruno-oliveira.md'
      ]

      for (const agent of requiredAgents) {
        const agentPath = path.join(agentsDir, agent)
        if (!fs.existsSync(agentPath)) {
          throw new Error(`Agent file não encontrado: ${agent}`)
        }

        const content = fs.readFileSync(agentPath, 'utf-8')
        if (!content.trim()) {
          throw new Error(`Agent file está vazio: ${agent}`)
        }
      }
    })

    // Test 3: ParallelClaudeRunner initialization
    await this.runTest('ParallelClaudeRunner initialization', async () => {
      const runner = new ParallelClaudeRunner()
      if (!runner) {
        throw new Error('Falha na inicialização do ParallelClaudeRunner')
      }

      // Test method availability
      if (typeof runner.isRateLimitError !== 'function') {
        throw new Error('Método isRateLimitError não disponível')
      }
    })

    // Test 4: Rate limit handler
    await this.runTest('Rate limit handler', async () => {
      const status = rateLimitHandler.getStatus()
      
      if (!status || !status.state) {
        throw new Error('Status do rate limit handler inválido')
      }

      if (typeof status.state.promptsRemaining !== 'number') {
        throw new Error('promptsRemaining deve ser um número')
      }
    })

    // Test 5: Rate limit message parsing
    await this.runTest('Rate limit message parsing', async () => {
      const testMessage = "5-hour limit reached ∙ resets 5pm"
      const result = rateLimitHandler.parseRateLimitMessage(testMessage)
      
      if (!result.isLimited) {
        throw new Error('Deveria detectar rate limit')
      }

      if (!result.resetTime) {
        throw new Error('Deveria extrair reset time')
      }
    })

    // Test 6: Claude CLI availability check
    await this.runTest('Claude CLI availability check', async () => {
      const isAvailable = await ParallelClaudeRunner.checkCLIAvailable()
      
      // Não falha se Claude CLI não está disponível, apenas reporta
      if (!isAvailable) {
        console.log('ℹ️ Claude CLI não detectado (normal em ambiente de desenvolvimento)')
      }
    })

    // Test 7: Package.json validation
    await this.runTest('Package.json validation', async () => {
      const packagePath = path.join(__dirname, 'package.json')
      const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
      
      const requiredScripts = ['start', 'demo', 'monitor', 'sprint', 'build']
      for (const script of requiredScripts) {
        if (!packageContent.scripts[script]) {
          throw new Error(`Script obrigatório não encontrado: ${script}`)
        }
      }

      const requiredDeps = ['chalk', 'inquirer']
      for (const dep of requiredDeps) {
        if (!packageContent.dependencies[dep]) {
          throw new Error(`Dependência obrigatória não encontrada: ${dep}`)
        }
      }
    })

    this.displayResults()
  }

  private displayResults(): void {
    console.log('\n📊 Resultados dos testes:')
    console.log('=' .repeat(50))

    const passed = this.results.filter(r => r.passed).length
    const failed = this.results.filter(r => r.passed === false).length
    const totalTime = this.results.reduce((sum, r) => sum + r.duration, 0)

    this.results.forEach(result => {
      const status = result.passed ? '✅' : '❌'
      const time = `${result.duration}ms`
      console.log(`${status} ${result.name.padEnd(30)} ${time}`)
      
      if (!result.passed && result.error) {
        console.log(`   └─ ${result.error}`)
      }
    })

    console.log('=' .repeat(50))
    console.log(`📈 Total: ${this.results.length} | ✅ Passed: ${passed} | ❌ Failed: ${failed}`)
    console.log(`⏱️ Tempo total: ${totalTime}ms`)

    if (failed === 0) {
      console.log('\n🎉 Todos os testes passaram! Sistema está funcional.')
    } else {
      console.log(`\n⚠️ ${failed} teste(s) falharam. Verifique as mensagens de erro acima.`)
    }
  }
}

// Execute testes se chamado diretamente
async function main() {
  const tester = new SystemTester()
  
  try {
    await tester.runAllTests()
  } catch (error: any) {
    console.error('❌ Erro crítico nos testes:', error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Erro não tratado:', error)
    process.exit(1)
  })
}

export { SystemTester }