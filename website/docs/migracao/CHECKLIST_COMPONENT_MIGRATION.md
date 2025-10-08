# Checklist de Migração de Componentes v1 → v2

Este checklist deve ser usado para **CADA** componente migrado do projeto original para garantir que todos os padrões consolidados sejam aplicados corretamente.

## 📋 Checklist Completo

### **PRÉ-MIGRAÇÃO**

#### 1. Análise do Componente Original
- [ ] Localizar o componente em `/mnt/d/projetos/matrix-protocol-website/`
- [ ] Ler código completo para entender funcionalidade
- [ ] Identificar dependências e imports
- [ ] Mapear todas as interações (cliques, navegação, etc.)

#### 2. Identificação de Problemas
- [ ] **Buscar `@apply`**: Usar comando `grep -n "@apply" path/to/component.vue`
- [ ] **Buscar USlideover**: Componente deve ser substituído
- [ ] **Buscar UDropdown**: Verificar se API v3.x é diferente
- [ ] **Listar textos hardcoded**: Que precisam i18n
- [ ] **Identificar rotas**: Que precisam `localePath()`

#### 3. Planejamento da Migração
- [ ] Listar todas as conversões necessárias
- [ ] Priorizar problemas críticos (Tailwind CSS v4)
- [ ] Verificar se há componentes Nuxt UI 3.x alternativos

---

### **MIGRAÇÃO**

#### 4. Conversão de Estilos (CRÍTICO)
- [ ] **Remover TODOS os `@apply`** de `<style scoped>`
- [ ] **Converter para classes inline** no template
- [ ] **Usar `:class` condicionais** para estados dinâmicos
- [ ] **Manter apenas CSS puro** em `<style scoped>` se necessário

**Exemplo de conversão:**
```vue
<!-- ❌ ANTES -->
<style scoped>
.nav-link { @apply text-gray-600 hover:text-gray-900; }
.nav-link-active { @apply text-blue-600 font-semibold; }
</style>

<!-- ✅ DEPOIS -->
<template>
  <a class="text-gray-600 hover:text-gray-900" 
     :class="{ 'text-blue-600 font-semibold': isActive }">
</template>
```


#### 5. Substituição de Componentes Problemáticos
- [ ] **USlideover → Transition custom**
  ```vue
  <!-- ✅ Usar este padrão -->
  <Transition
    enter-active-class="transition-transform duration-200"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
  >
    <div v-if="isOpen">...</div>
  </Transition>
  ```

- [ ] **UDropdown**: Verificar nova API v3.x se usado
- [ ] **Outros componentes UI**: Testar antes de implementar

#### 6. Internacionalização (i18n)
- [ ] **Substituir TODOS os textos hardcoded** por `$t()`
- [ ] **Adicionar traduções** em `pt.json` e `en.json`
- [ ] **Usar `localePath()`** para rotas internas
- [ ] **Fallback `/${$i18n.locale}/`** apenas quando necessário

#### 7. Configuração e Composables
- [ ] **Usar `useMatrixConfig()`** para URLs externas
- [ ] **Usar `useSEO()`** para meta tags se aplicável
- [ ] **Verificar `appName`/`appVersion`** estão no runtime config
- [ ] **Links externos**: GitHub, Discord, Casheiro via config

#### 8. Navegação MEP (se aplicável)
- [ ] **Adicionar MEP** em dropdowns/menus
- [ ] **Cores corretas**: `bg-gradient-to-br from-blue-600 to-purple-600`
- [ ] **Badge "Manifesto"**: classes purple corretas
- [ ] **Link para**: `/${$i18n.locale}/mep`

---

### **PÓS-MIGRAÇÃO**

#### 9. Testes Funcionais
- [ ] **Build sem erros**: `pnpm build`
- [ ] **Navegação PT**: Testar todos os links
- [ ] **Navegação EN**: Testar todos os links  
- [ ] **Interações**: Cliques, hovers, estados ativos
- [ ] **Responsivo**: Testar em 3+ breakpoints

#### 10. Validação Visual
- [ ] **Comparar com original**: Visual deve ser idêntico
- [ ] **Cores corretas**: Frameworks, MEP, estados
- [ ] **Tipografia**: Rajdhani para headings, Source Code Pro para body
- [ ] **Espaçamentos**: Margens e paddings consistentes
- [ ] **Animações**: Transições suaves funcionando

#### 11. Acessibilidade
- [ ] **aria-labels**: Para elementos interativos
- [ ] **role attributes**: navigation, button, etc.
- [ ] **Navegação por teclado**: Tab, Enter, Escape
- [ ] **Screen readers**: Textos descritivos adequados

#### 12. Performance
- [ ] **Bundle size**: Não aumentar significativamente
- [ ] **Lighthouse**: Manter scores ≥90
- [ ] **Lazy loading**: Se aplicável
- [ ] **Tree shaking**: Imports otimizados

---

### **VALIDAÇÃO FINAL**

#### 13. Checklist de Qualidade
- [ ] **Código limpo**: Sem console.logs, TODOs, etc.
- [ ] **Tipos TypeScript**: Sem erros de tipo
- [ ] **ESLint**: Sem warnings
- [ ] **Formatação**: Prettier aplicado
- [ ] **Comentários**: Apenas se necessários

#### 14. Conformidade com Padrões
- [ ] **Seguiu MIGRATION_PATTERNS.md**: Todos os padrões aplicados
- [ ] **Seguiu CLAUDE.md**: Regras obrigatórias respeitadas
- [ ] **Atribuição Casheiro**: Se aplicável (footer, schema.org)
- [ ] **Matrix Protocol**: Identidade visual preservada

#### 15. Documentação
- [ ] **Comentários de código**: Explicar partes complexas
- [ ] **Atualizar docs**: Se funcionalidade mudou
- [ ] **Git commit**: Mensagem clara das mudanças
- [ ] **PR description**: Listar adaptações feitas

---

## 🎯 Componentes Prioritários

### **Fase 2 - Layout (PRÓXIMOS)**
- [ ] `AppHeader.vue` - ⚠️ Tem `@apply`
- [ ] `FrameworkDropdown.vue` - ⚠️ Tem `@apply`
- [ ] `MobileDrawer.vue` - ⚠️ Tem `@apply`

### **Fase 3 - Frameworks**
- [ ] `FrameworkLayout.vue` - ⚠️ Tem `@apply`
- [ ] `FrameworkSidebar.vue` - ⚠️ Tem `@apply`
- [ ] `TableOfContents.vue` - ⚠️ Tem `@apply`

### **Fase 4 - Content**
- [ ] Componentes `/docs/` - ⚠️ Múltiplos `@apply`
- [ ] Componentes `/content/` - ⚠️ Múltiplos `@apply`

---

## ⚡ Comandos Úteis

### **Busca de Problemas**
```bash
# Buscar @apply em um componente
grep -n "@apply" path/to/component.vue

# Buscar @apply em todo o projeto original
grep -r "@apply" /mnt/d/projetos/matrix-protocol-website/components/

# Buscar USlideover
grep -r "USlideover" /mnt/d/projetos/matrix-protocol-website/components/

# Buscar textos hardcoded
grep -r "text.*:" /mnt/d/projetos/matrix-protocol-website/components/
```


### **Build e Validação**
```bash
# Build completo
pnpm build

# TypeScript check
pnpm typecheck

# Lint
pnpm lint

# Dev server
pnpm dev
```


---

## ✅ Status da Migração

### **Completados** ✅
- [x] `pages/index.vue` - 100% funcional
- [x] `composables/useSEO.ts` - i18n completo
- [x] `composables/useMatrixConfig.ts` - configuração completa
- [x] `nuxt.config.ts` - runtime config consolidado
- [x] `i18n/locales/` - traduções PT/EN completas

### **Em Andamento** 🟡
- [ ] Documentação de padrões

### **Pendentes** ⏳
- [ ] 15+ componentes com `@apply` para converter
- [ ] Componentes frameworks/
- [ ] Componentes docs/content/

---

**Data**: Janeiro 2025  
**Status**: Checklist validado com migração da index.vue  
**Próximo**: Aplicar em componentes da Fase 2