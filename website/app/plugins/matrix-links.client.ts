// PLUGIN REMOVIDO - Sistema redundante
// A transforma��o de links agora � feita durante o sync via script sync-content.sh
// Mantendo arquivo para refer�ncia hist�rica, mas sem funcionalidade ativa

/*
 * DEPRECADO: Matrix Links Client Plugin
 * 
 * Este plugin foi desabilitado pois causava conflitos com a transforma��o server-side.
 * O novo sistema de sync unificado resolve todos os links problem�ticos na origem,
 * eliminando a necessidade de transforma��o no cliente.
 * 
 * Benef�cios da nova abordagem:
 * 1. Sem warnings do Vue Router
 * 2. Links j� corretos no SSR
 * 3. Melhor performance (sem processamento client-side)
 * 4. Fonte �nica de verdade em /docs
 */

export default () => {
  // Plugin desabilitado - funcionalidade movida para sync script
}