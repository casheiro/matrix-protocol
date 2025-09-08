/**
 * Health Check Endpoint
 * 
 * Endpoint para verificação de status da aplicação.
 * Usado pelo Docker health check e monitoramento do Coolify.
 * 
 * GET /api/health
 * 
 * Retorna:
 * - Status: 200 OK se aplicação está funcionando
 * - JSON com informações básicas da aplicação
 */

export default defineEventHandler(() => {
  const config = useRuntimeConfig()
  
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    app: {
      name: config.public.appName,
      version: config.public.appVersion,
      environment: process.env.NODE_ENV || 'development'
    },
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
    },
    node: {
      version: process.version,
      platform: process.platform,
      arch: process.arch
    }
  }
})