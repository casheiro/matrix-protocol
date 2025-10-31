/**
 * Middleware para resolver URLs de schemas do Matrix Protocol
 * Intercepta requests para /schemas/* e serve via API local
 * Funciona em qualquer ambiente (dev, staging, prod)
 */

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  
  // Só processar requests para schemas
  if (!url.pathname.startsWith('/schemas/')) {
    return
  }
  
  // Debug log para desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Schema Resolver] Processing: ${url.pathname}`)
  }
  
  // Extract path after /schemas/
  const schemaPath = url.pathname.replace('/schemas/', '')
  
  // Parse path: framework/type/version
  const pathParts = schemaPath.split('/')
  if (pathParts.length < 3) {
    // Path inválido, deixar passar para tratamento normal
    return
  }
  
  const [framework, type, version] = pathParts
  
  // Verificar se é um framework válido
  const validFrameworks = ['mef', 'moc', 'zof', 'oif', 'mal']
  if (!validFrameworks.includes(framework)) {
    return
  }
  
  // Determinar locale de forma mais robusta
  const query = getQuery(event)
  const headers = getHeaders(event)
  
  const queryLocale = query.locale as string
  const acceptLanguage = headers['accept-language'] || ''
  const referer = headers.referer || ''
  
  // Prioridade: query param > referer path > accept-language > default
  let locale = 'pt' // default
  
  if (queryLocale && ['pt', 'en'].includes(queryLocale)) {
    locale = queryLocale
  } else if (referer && referer.includes('/en/')) {
    locale = 'en'
  } else if (referer && referer.includes('/pt/')) {
    locale = 'pt'
  } else if (acceptLanguage.includes('en') && !acceptLanguage.includes('pt')) {
    locale = 'en'
  }
  
  // Construir URL da API local
  const apiUrl = `/api/schemas/${framework}/${type}/${version}?locale=${locale}`
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Schema Resolver] API URL: ${apiUrl}, Locale: ${locale}`)
  }
  
  try {
    // Fazer request interno para a API
    const response = await $fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/x-yaml',
        'User-Agent': 'Matrix Protocol Schema Resolver'
      }
    })
    
    // Configurar headers de resposta
    setHeader(event, 'Content-Type', 'application/x-yaml')
    setHeader(event, 'Cache-Control', 'public, max-age=3600')
    setHeader(event, 'Access-Control-Allow-Origin', '*')
    setHeader(event, 'Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
    setHeader(event, 'X-Resolved-Via', 'schema-middleware')
    setHeader(event, 'X-Original-Path', url.pathname)
    setHeader(event, 'X-Resolved-Locale', locale)
    setHeader(event, 'X-Schema-Framework', framework)
    setHeader(event, 'X-Schema-Type', type)
    setHeader(event, 'X-Schema-Version', version)
    
    // Retornar conteúdo do schema
    return response
    
  } catch (error: any) {
    console.error('Schema resolution error:', error)
    
    // Se não encontrar o schema, deixar passar para tratamento de 404 normal
    if (error.status === 404) {
      return
    }
    
    // Para outros erros, retornar erro genérico
    throw createError({
      statusCode: 500,
      statusMessage: 'Error resolving schema'
    })
  }
})