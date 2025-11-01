/**
 * API Route para redirecionar para a versão mais recente de um schema
 * GET /api/schemas/{framework}/{type}/latest
 */
export default defineEventHandler(async (event) => {
  const framework = getRouterParam(event, 'framework')
  const type = getRouterParam(event, 'type')
  
  if (!framework || !type) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Framework and type are required'
    })
  }
  
  // Redirecionar para a API de versões e depois para a latest
  return await sendRedirect(event, `/api/schemas/${framework}/${type}/versions`, 302)
})