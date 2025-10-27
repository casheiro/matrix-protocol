/**
 * Global middleware para interceptar links problemáticos do Matrix Protocol
 * DESABILITADO - usando apenas link-transformer para evitar conflitos
 * Redireciona rotas antigas antes que o Vue Router gere warnings
 */
export default defineNuxtRouteMiddleware((to) => {
  // MIDDLEWARE DESABILITADO - o link-transformer está lidando com as transformações
  // Se ainda houver problemas, reative este middleware
  return
  
  /*
  const { resolveLink } = useMatrixLinks()
  
  // Mapeamento direto de rotas problemáticas para chaves válidas  
  const routeRedirects: Record<string, string> = {
    // Frameworks - rotas PT
    '/pt/MEF_MATRIX_EMBEDDING_FRAMEWORK': 'mef',
    '/pt/ZOF_ZION_ORCHESTRATION_FRAMEWORK': 'zof', 
    '/pt/OIF_OPERATOR_INTELLIGENCE_FRAMEWORK': 'oif',
    '/pt/MOC_MATRIX_ONTOLOGY_CATALOG': 'moc',
    '/pt/MAL_MATRIX_ARBITER_LAYER': 'mal',
    '/pt/MEP_MATRIX_EPISTEMIC_PRINCIPLE': 'mep',
    
    // Frameworks - rotas EN
    '/en/MEF_MATRIX_EMBEDDING_FRAMEWORK': 'mef',
    '/en/ZOF_ZION_ORCHESTRATION_FRAMEWORK': 'zof',
    '/en/OIF_OPERATOR_INTELLIGENCE_FRAMEWORK': 'oif', 
    '/en/MOC_MATRIX_ONTOLOGY_CATALOG': 'moc',
    '/en/MAL_MATRIX_ARBITER_LAYER': 'mal',
    '/en/MEP_MATRIX_EPISTEMIC_PRINCIPLE': 'mep',
    
    // Frameworks - rotas sem locale
    '/MEF_MATRIX_EMBEDDING_FRAMEWORK': 'mef',
    '/ZOF_ZION_ORCHESTRATION_FRAMEWORK': 'zof',
    '/OIF_OPERATOR_INTELLIGENCE_FRAMEWORK': 'oif',
    '/MOC_MATRIX_ONTOLOGY_CATALOG': 'moc', 
    '/MAL_MATRIX_ARBITER_LAYER': 'mal',
    '/MEP_MATRIX_EPISTEMIC_PRINCIPLE': 'mep'
  }
  
  const currentPath = to.path
  
  // Verifica se é uma rota que precisa de redirecionamento
  if (routeRedirects[currentPath]) {
    const key = routeRedirects[currentPath]
    const targetUrl = resolveLink(key)
    
    console.log(`[Matrix Links Middleware] Redirecting: ${currentPath} → ${targetUrl}`)
    
    return navigateTo(targetUrl, { redirectCode: 301 })
  }
  
  // Verifica também patterns mais flexíveis
  for (const [route, key] of Object.entries(routeRedirects)) {
    if (currentPath.includes(route.replace(/^\/[a-z]{2}\//, '/')) || 
        currentPath.endsWith(route.replace(/^\/[a-z]{2}\//, ''))) {
      const targetUrl = resolveLink(key)
      
      console.log(`[Matrix Links Middleware] Pattern redirect: ${currentPath} → ${targetUrl}`)
      
      return navigateTo(targetUrl, { redirectCode: 301 })
    }
  }
  */
})