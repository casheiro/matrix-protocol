// PLUGIN REMOVIDO - Sistema redundante
// A transformação de links agora é feita durante o sync via script sync-content.sh
// Mantendo arquivo para referência histórica, mas sem funcionalidade ativa

/*
 * DEPRECADO: Matrix Links Client Plugin
 * 
 * Este plugin foi desabilitado pois causava conflitos com a transformação server-side.
 * O novo sistema de sync unificado resolve todos os links problemáticos na origem,
 * eliminando a necessidade de transformação no cliente.
 * 
 * Benefícios da nova abordagem:
 * 1. Sem warnings do Vue Router
 * 2. Links já corretos no SSR
 * 3. Melhor performance (sem processamento client-side)
 * 4. Fonte única de verdade em /docs
 */

export default () => {
  // Plugin desabilitado - funcionalidade movida para sync script
}