export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // Basic health check response
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'matrix-protocol-website',
    version: config.public.appVersion || '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  }

  // Set proper headers
  setHeader(event, 'Content-Type', 'application/json')
  setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate')
  
  return health
})