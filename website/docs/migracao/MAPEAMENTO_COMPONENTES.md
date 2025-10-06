# Mapeamento Detalhado de Componentes - Matrix Protocol Website

## Visão Geral

Este documento fornece um mapeamento completo de todos os componentes do projeto Matrix Protocol Website, suas dependências, e as estratégias específicas de migração para cada um.

## 1. Componentes de Layout Principal

### 1.1 app.vue
**Localização**: `app.vue`
**Função**: Componente raiz da aplicação
**Dependências**:
- `NuxtLayout`
- `NuxtPage`
- `useHead()` - Meta tags globais
- `useColorMode()` - Tema escuro/claro
- `useSeoMeta()` - SEO

**Migração Necessária**:
- ✅ Compatível com Nuxt 4.x
- ⚠️ Verificar mudanças na API de `useHead()`
- ✅ Preservar estilos CSS globais

### 1.2 layouts/default.vue
**Localização**: `layouts/default.vue`
**Função**: Layout padrão do site
**Dependências**:
- `AppHeader` component
- Sistema de roteamento Nuxt

**Migração Necessária**:
- ✅ Estrutura compatível
- ⚠️ Verificar mudanças no sistema de layouts do Nuxt 4.x

## 2. Componentes de Navegação

### 2.1 AppHeader.vue
**Localização**: `components/layout/AppHeader.vue`
**Função**: Cabeçalho principal com navegação
**Dependências**:
- `UButton` (Nuxt UI)
- `NavigationFrameworkDropdown`
- `NavigationLanguageSelector`
- `useMatrixAssets()` - Logos
- `useI18n()` - Internacionalização
- `useColorMode()` - Tema

**Componentes Nuxt UI Utilizados**:
- `UButton` - Botões de navegação
- Possivelmente `UDropdown` para menus

**Migração Necessária**:
- 🔴 **CRÍTICA**: Atualizar para Nuxt UI 3.x API
- 🔴 Revisar props do `UButton`
- ⚠️ Verificar compatibilidade com `useI18n()`
- ✅ Preservar funcionalidade de skip links (acessibilidade)

### 2.2 MobileDrawer.vue
**Localização**: `components/layout/MobileDrawer.vue`
**Função**: Menu mobile responsivo
**Dependências**:
- Componentes Nuxt UI para drawer/modal
- Sistema de navegação

**Migração Necessária**:
- 🔴 Verificar componente de drawer no Nuxt UI 3.x
- ⚠️ Atualizar API de controle de estado

### 2.3 FrameworkDropdown.vue
**Localização**: `components/navigation/FrameworkDropdown.vue`
**Função**: Dropdown para seleção de frameworks
**Dependências**:
- `UDropdown` (Nuxt UI)
- `useFrameworkNavigation()` composable
- Dados dos frameworks

**Migração Necessária**:
- 🔴 **CRÍTICA**: `UDropdown` teve mudanças significativas na v3.x
- 🔴 Revisar estrutura de items e props
- ⚠️ Testar funcionalidade de navegação

### 2.4 LanguageSelector.vue
**Localização**: `components/navigation/LanguageSelector.vue`
**Função**: Seletor de idiomas PT/EN
**Dependências**:
- `UButton` ou `UDropdown` (Nuxt UI)
- `useI18n()` - Troca de idiomas
- Ícones de bandeiras

**Migração Necessária**:
- 🔴 Atualizar componentes Nuxt UI utilizados
- ⚠️ Verificar compatibilidade com @nuxtjs/i18n

## 3. Componentes de Conteúdo

### 3.1 GlossaryContent.vue
**Localização**: `components/content/GlossaryContent.vue`
**Função**: Renderização do glossário de termos
**Dependências**:
- `@nuxt/content` - Query de dados
- Componentes de formatação de texto

**Migração Necessária**:
- 🔴 **CRÍTICA**: Atualizar para @nuxt/content 3.x API
- 🔴 Revisar queries de conteúdo
- ⚠️ Verificar renderização de markdown

### 3.2 ImplementationContent.vue
**Localização**: `components/content/ImplementationContent.vue`
**Função**: Conteúdo do guia de implementação
**Dependências**:
- `@nuxt/content`
- Componentes de código e exemplos

**Migração Necessária**:
- 🔴 Atualizar queries do @nuxt/content
- ⚠️ Verificar renderização de código

### 3.3 ProtocolContent.vue
**Localização**: `components/content/ProtocolContent.vue`
**Função**: Documentação do protocolo
**Dependências**:
- `@nuxt/content`
- Sistema de navegação interna

**Migração Necessária**:
- 🔴 Atualizar para nova API de conteúdo
- ⚠️ Preservar links internos

### 3.4 QuickStartContent.vue
**Localização**: `components/content/QuickStartContent.vue`
**Função**: Guia de início rápido
**Dependências**:
- `@nuxt/content`
- Componentes de steps/tutorial

**Migração Necessária**:
- 🔴 Atualizar queries de conteúdo
- ⚠️ Verificar componentes de tutorial

### 3.5 ProseA.vue
**Localização**: `components/content/ProseA.vue`
**Função**: Links customizados para markdown
**Dependências**:
- Sistema de roteamento Nuxt
- Detecção de links externos

**Migração Necessária**:
- ✅ Provavelmente compatível
- ⚠️ Verificar mudanças no roteamento

## 4. Componentes de Documentação

### 4.1 CodeBlock.vue
**Localização**: `components/docs/CodeBlock.vue`
**Função**: Blocos de código com syntax highlighting
**Dependências**:
- Sistema de highlighting do @nuxt/content
- Botão de cópia

**Migração Necessária**:
- 🔴 Verificar mudanças no sistema de highlighting
- ⚠️ Atualizar componentes de UI utilizados

### 4.2 DocsBreadcrumbs.vue
**Localização**: `components/docs/DocsBreadcrumbs.vue`
**Função**: Navegação breadcrumb
**Dependências**:
- Sistema de roteamento
- Dados de navegação

**Migração Necessária**:
- ⚠️ Verificar compatibilidade com roteamento Nuxt 4.x
- ✅ Lógica provavelmente compatível

### 4.3 DocsContent.vue
**Localização**: `components/docs/DocsContent.vue`
**Função**: Container principal de documentação
**Dependências**:
- `@nuxt/content`
- Componentes de layout

**Migração Necessária**:
- 🔴 Atualizar para @nuxt/content 3.x
- ⚠️ Verificar sistema de layout

### 4.4 DocsSidebar.vue
**Localização**: `components/docs/DocsSidebar.vue`
**Função**: Sidebar de navegação da documentação
**Dependências**:
- Dados de navegação
- Componentes Nuxt UI para lista/menu

**Migração Necessária**:
- 🔴 Atualizar componentes de menu/lista
- ⚠️ Verificar sistema de navegação

## 5. Componentes de Homepage

### 5.1 HeroSection.vue
**Localização**: `components/home/HeroSection.vue`
**Função**: Seção hero da homepage
**Dependências**:
- `UButton` (Nuxt UI)
- Animações CSS
- Assets de imagem

**Migração Necessária**:
- 🔴 Atualizar `UButton` para v3.x
- ✅ Preservar animações
- ✅ Assets compatíveis

### 5.2 FeaturesSection.vue
**Localização**: `components/home/FeaturesSection.vue`
**Função**: Seção de características principais
**Dependências**:
- Componentes de grid/layout
- Ícones

**Migração Necessária**:
- ⚠️ Verificar componentes de layout utilizados
- ✅ Ícones provavelmente compatíveis

### 5.3 FrameworksGrid.vue
**Localização**: `components/home/FrameworksGrid.vue`
**Função**: Grid de frameworks na homepage
**Dependências**:
- `FrameworkCard` component
- Dados dos frameworks

**Migração Necessária**:
- ⚠️ Depende da migração do `FrameworkCard`
- ✅ Estrutura de grid compatível

### 5.4 FrameworkCard.vue
**Localização**: `components/home/FrameworkCard.vue`
**Função**: Card individual de framework
**Dependências**:
- Componentes Nuxt UI para cards
- Sistema de roteamento
- Assets de logos

**Migração Necessária**:
- 🔴 Verificar componente de card no Nuxt UI 3.x
- ⚠️ Atualizar props e estrutura
- ✅ Assets compatíveis

### 5.5 QuickStartGuide.vue
**Localização**: `components/home/QuickStartGuide.vue`
**Função**: Guia rápido na homepage
**Dependências**:
- Componentes de steps
- Links de navegação

**Migração Necessária**:
- ⚠️ Verificar componentes de steps utilizados
- ✅ Links provavelmente compatíveis

## 6. Componentes de Frameworks

### 6.1 FrameworkLayout.vue
**Localização**: `components/frameworks/FrameworkLayout.vue`
**Função**: Layout específico para páginas de frameworks
**Dependências**:
- `FrameworkSidebar`
- `TableOfContents`
- Sistema de conteúdo

**Migração Necessária**:
- ⚠️ Depende da migração dos componentes filhos
- ✅ Estrutura de layout compatível

### 6.2 FrameworkSidebar.vue
**Localização**: `components/frameworks/FrameworkSidebar.vue`
**Função**: Sidebar específica de frameworks
**Dependências**:
- Dados de navegação dos frameworks
- Componentes de menu

**Migração Necessária**:
- 🔴 Atualizar componentes de menu
- ⚠️ Verificar sistema de navegação

### 6.3 TableOfContents.vue
**Localização**: `components/frameworks/TableOfContents.vue`
**Função**: Índice de conteúdo
**Dependências**:
- Parsing de headings do conteúdo
- Scroll spy functionality

**Migração Necessária**:
- ⚠️ Verificar compatibilidade com @nuxt/content 3.x
- ✅ Lógica de scroll provavelmente compatível

## 7. Composables

### 7.1 useAccessibility.ts
**Localização**: `app/composables/useAccessibility.ts`
**Função**: Funcionalidades de acessibilidade
**Dependências**:
- APIs do browser
- VueUse composables

**Migração Necessária**:
- ✅ Provavelmente compatível
- ⚠️ Verificar mudanças no VueUse

### 7.2 useFileDownload.ts
**Localização**: `app/composables/useFileDownload.ts`
**Função**: Download de arquivos
**Dependências**:
- APIs do browser
- Sistema de assets

**Migração Necessária**:
- ✅ Compatível
- ✅ Lógica independente de framework

### 7.3 useFrameworkNavigation.ts
**Localização**: `app/composables/useFrameworkNavigation.ts`
**Função**: Navegação entre frameworks
**Dependências**:
- Sistema de roteamento Nuxt
- Dados dos frameworks

**Migração Necessária**:
- ⚠️ Verificar mudanças no roteamento Nuxt 4.x
- ✅ Lógica provavelmente compatível

### 7.4 useMatrixAssets.ts
**Localização**: `app/composables/useMatrixAssets.ts`
**Função**: Gestão de assets do Matrix Protocol
**Dependências**:
- Sistema de assets Nuxt
- Configurações de tema

**Migração Necessária**:
- ⚠️ Verificar mudanças no sistema de assets
- ✅ Lógica provavelmente compatível

### 7.5 useMatrixConfig.ts
**Localização**: `app/composables/useMatrixConfig.ts`
**Função**: Configurações do Matrix Protocol
**Dependências**:
- Configurações globais
- Runtime config

**Migração Necessária**:
- ⚠️ Verificar mudanças no runtime config Nuxt 4.x
- ✅ Estrutura provavelmente compatível

### 7.6 useSEO.ts
**Localização**: `app/composables/useSEO.ts`
**Função**: Otimizações SEO
**Dependências**:
- `useHead()` e `useSeoMeta()`
- Dados de conteúdo

**Migração Necessária**:
- ⚠️ Verificar mudanças nas APIs de SEO do Nuxt 4.x
- ✅ Conceitos provavelmente compatíveis

## 8. Páginas

### 8.1 index.vue (Homepage)
**Localização**: `pages/index.vue`
**Função**: Página inicial do site
**Dependências**:
- Todos os componentes de home
- SEO composables

**Migração Necessária**:
- ⚠️ Depende da migração dos componentes filhos
- ✅ Estrutura de página compatível

### 8.2 protocol.vue
**Localização**: `pages/protocol.vue`
**Função**: Documentação do protocolo
**Dependências**:
- `ProtocolContent` component
- Sistema de conteúdo

**Migração Necessária**:
- 🔴 Depende da migração do `ProtocolContent`
- ⚠️ Verificar sistema de conteúdo

### 8.3 frameworks/index.vue
**Localização**: `pages/frameworks/index.vue`
**Função**: Lista de frameworks
**Dependências**:
- `FrameworksGrid` component
- Dados dos frameworks

**Migração Necessária**:
- ⚠️ Depende da migração do grid
- ✅ Estrutura de página compatível

### 8.4 frameworks/[slug].vue
**Localização**: `pages/frameworks/[slug].vue`
**Função**: Páginas dinâmicas dos frameworks
**Dependências**:
- `FrameworkLayout` component
- Sistema de roteamento dinâmico
- `@nuxt/content`

**Migração Necessária**:
- 🔴 Atualizar para @nuxt/content 3.x
- ⚠️ Verificar roteamento dinâmico Nuxt 4.x
- ⚠️ Depende da migração do layout

## 9. Priorização de Migração

### Prioridade CRÍTICA (🔴)
1. **AppHeader.vue** - Componente central de navegação
2. **FrameworkDropdown.vue** - Funcionalidade core
3. **Todos os componentes de conteúdo** - Sistema de CMS
4. **frameworks/[slug].vue** - Roteamento dinâmico

### Prioridade ALTA (⚠️)
1. **Todos os composables** - Funcionalidades base
2. **Componentes de documentação** - Sistema de docs
3. **FrameworkCard.vue** - Homepage principal

### Prioridade MÉDIA (✅)
1. **Componentes de layout simples**
2. **Assets e estilos**
3. **Páginas estáticas**

## 10. Estratégia de Teste

### Testes por Componente
- Cada componente deve ser testado individualmente após migração
- Verificar props, eventos e slots
- Testar responsividade e acessibilidade

### Testes de Integração
- Testar fluxos completos de navegação
- Verificar sistema de conteúdo end-to-end
- Testar internacionalização

### Testes de Performance
- Comparar tempos de carregamento
- Verificar bundle size
- Testar Core Web Vitals

## Conclusão

Este mapeamento fornece a base para uma migração sistemática e controlada, priorizando componentes críticos e identificando dependências que podem afetar o cronograma de migração.