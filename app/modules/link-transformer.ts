// MÓDULO REMOVIDO - Sistema redundante
// A transformação de links agora é feita durante o sync via script sync-content.sh
// Mantendo arquivo para referência histórica, mas sem funcionalidade ativa

/*
 * DEPRECADO: Link Transformer Module
 * 
 * Este módulo foi substituído pela transformação durante sync em scripts/sync-content.sh
 * Estratégia anterior: Múltiplos sistemas (link-transformer + matrix-links + client plugin)
 * Estratégia atual: Single source of truth via sync script
 * 
 * O script sync-content.sh agora:
 * 1. Copia todo conteúdo de /docs para /website/content
 * 2. Transforma links problemáticos durante a cópia
 * 3. Gera estrutura unificada para o @nuxt/content
 * 
 * Esta abordagem é mais robusta e elimina os warnings do Vue Router
 * pois os links já chegam corretos no processamento do Nuxt Content.
 */

export default () => {
  // Módulo desabilitado - funcionalidade movida para sync script
}