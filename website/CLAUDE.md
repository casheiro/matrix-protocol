# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Matrix Protocol Website v2** - a migration of the Matrix Protocol official documentation website from Nuxt 3.x to Nuxt 4.x with major framework upgrades. The project is currently in **Phase 1 of Migration** from the original project located at `../matrix-protocol-website/`.

### Mission Statement
The Matrix Protocol Website is the official platform for documenting and promoting **Matrix Protocol Beta** - a comprehensive framework for human-AI collaboration through knowledge structures and orchestrated workflows.

## 🚨 CRITICAL MIGRATION RULES - NON-NEGOTIABLE

### Strict Scope Enforcement
- **ONLY Matrix Protocol elements are allowed**: MEF, ZOF, OIF, MOC, MAL frameworks
- **STRICTLY FORBIDDEN**: Other protocols, e-commerce, social features, games, blogs, forums
- **Language Support**: Portuguese and English ONLY
- **Every implementation must respect the project rules in `.trae/rules/project_rules.md`**

### Mandatory Consultation Requirements
Before implementing ANY migration:
1. **ALWAYS consult the Context7 documentation** and official docs for current versions
2. **ALWAYS check `.trae/rules/project_rules.md` for compliance**
3. **ALWAYS verify the original implementation** in `../matrix-protocol-website/*`
4. **ALWAYS follow the detailed migration documentation** in `/docs/migracao/`

## Technical Stack & Dependencies

### Current Stack (Target - v2)
```json
{
  "nuxt": "4.1.2",
  "@nuxt/ui": "3.3.4", 
  "@nuxt/content": "3.7.1",
  "@nuxtjs/i18n": "^10.1.0",
  "vue": "3.5.21",
  "typescript": "^5.6.3"
}
```

### Original Stack (Source - v1)
```json
{
  "nuxt": "3.13.0",
  "@nuxt/ui": "2.17.0",
  "@nuxt/content": "2.13.0", 
  "@nuxtjs/i18n": "8.5.0",
  "vue": "3.5.21",
  "typescript": "5.4.5"
}
```

## 🔴 REGRA DE OURO - GERENCIAMENTO DE DEPENDÊNCIAS (INVIOLÁVEL)

### ⚠️ NUNCA edite package.json diretamente para adicionar dependências!

#### Comandos CORRETOS para dependências:
```bash
# Para adicionar dependências de produção
pnpm add <package-name>

# Para adicionar dependências de desenvolvimento
pnpm add -D <package-name>

# Para remover dependências
pnpm remove <package-name>
```

#### ❌ PROIBIDO - O que NUNCA fazer:
- Editar seção `dependencies` ou `devDependencies` manualmente
- Especificar versões ao instalar: `pnpm add nuxt@4.1.2` ❌
- Usar `npm` ou `yarn` em projetos pnpm

#### ✅ OBRIGATÓRIO - O que SEMPRE fazer:
- Deixar o pnpm decidir as versões: `pnpm add nuxt` ✅
- Consultar Context7 e documentação oficial antes de instalar
- Verificar compatibilidade entre pacotes
- Manter pnpm-lock.yaml sempre atualizado

#### 🔍 Antes de instalar qualquer dependência:
1. **Consulte Context7** para verificar versões compatíveis com Nuxt 4
2. **Acesse documentação oficial** do pacote
3. **Verifique no projeto original** se o pacote já era usado
4. **Confirme compatibilidade** com as versões atuais do projeto

### ⚡ Violação desta regra = ERRO CRÍTICO que pode quebrar o projeto!

---

## Available Commands

### Development
```bash
pnpm dev                 # Start development server
pnpm build              # Build for production
pnpm generate           # Generate static site
pnpm preview            # Preview built site
```

### Migration & Validation (To be implemented)
```bash
pnpm typecheck          # TypeScript validation
pnpm lint               # ESLint + Prettier
pnpm test               # Unit tests
pnpm lighthouse         # Performance audit
```

## Critical Architecture Components

### Module Configuration Order (CRITICAL)
In `nuxt.config.ts`, modules MUST be in this exact order:
```typescript
modules: [
  '@nuxt/content',
  '@nuxt/ui',        // MUST come before @nuxtjs/i18n
  '@nuxtjs/i18n',
  '@nuxt/image'
]
```

### UApp Wrapper Requirement
The `app.vue` MUST include the UApp wrapper for Nuxt UI 3.x compatibility:
```vue
<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
```

### Project Structure
```
matrix-protocol-website-v2/
├── .nuxt/                  # Build artifacts (gerado)
├── .output/                # Output da build (gerado)
├── app/                    # Diretório principal da aplicação
│   ├── assets/             # CSS, imagens, fontes
│   ├── components/         # Componentes Vue
│   │   ├── layout/         # Layout components
│   │   ├── navigation/     # Navigation components
│   │   ├── content/        # Content components
│   │   ├── docs/           # Documentation components
│   │   ├── home/           # Homepage components
│   │   └── frameworks/     # Framework-specific components
│   ├── composables/        # Vue composables
│   ├── layouts/            # Layouts da aplicação
│   ├── middleware/         # Route middleware
│   ├── pages/              # Páginas/rotas
│   ├── plugins/            # Plugins do Nuxt
│   ├── utils/              # Funções utilitárias
│   ├── app.vue             # Componente raiz
│   ├── app.config.ts       # Configuração runtime
│   └── error.vue           # Página de erro
├── content/                # Conteúdo Markdown (@nuxt/content)
│   ├── en/                 # English content
│   └── pt/                 # Portuguese content
├── i18n/                   # Arquivos de internacionalização
│   └── locales/            # Traduções PT/EN
│       ├── pt.json
│       └── en.json
├── modules/                # Módulos locais do Nuxt
├── public/                 # Arquivos estáticos servidos diretamente
├── server/                 # API routes e middleware do servidor
├── shared/                 # Código compartilhado entre client/server
├── docs/                   # Documentação técnica do projeto
├── .nuxtrc                 # Configuração do Nuxt RC
├── nuxt.config.ts          # Configuração principal do Nuxt
└── package.json            # Dependências e scripts
```

## Matrix Protocol Framework Colors (MANDATORY)

### Official Framework Colors
```css
--mef-green: #2ECC71;       /* MEF - Matrix Embedding Framework */
--zof-orange: #E67E22;      /* ZOF - Zion Orchestration Framework */
--oif-blue: #2980B9;        /* OIF - Operator Intelligence Framework */
--moc-purple: #9B59B6;      /* MOC - Matrix Ontology Catalog */
--mal-red: #C0392B;         /* MAL - Matrix Arbiter Layer */
```

### Typography Requirements
- **Headings**: Rajdhani (Bold/Regular)
- **Body**: Source Code Pro (Regular/Medium)
- **Code**: Source Code Pro (Monospace)

## Critical Migration Considerations

### Breaking Changes from Nuxt UI 2.x to 3.x
1. **UDropdown API completely rewritten** - requires full component rewrites
2. **Requires UApp wrapper** in app.vue
3. **Module order dependency** - @nuxt/ui must come before @nuxtjs/i18n
4. **New theming system** - previous themes need adaptation

## ⚠️ **PADRÕES CONSOLIDADOS DA MIGRAÇÃO - CRÍTICOS**

**ATENÇÃO**: Estes padrões foram identificados e validados durante a migração bem-sucedida da página index.vue e componentes relacionados. **OBRIGATÓRIO** seguir em todas as futuras migrações.

### 🔥 **Tailwind CSS v4 - Conversão Obrigatória de @apply**
**NUNCA use `@apply` em blocos `<style scoped>`** - quebra no Tailwind CSS v4!

**15+ arquivos no projeto original precisam dessa conversão:**
- `/components/navigation/FrameworkDropdown.vue`
- `/components/layout/MobileDrawer.vue` 
- `/components/layout/AppHeader.vue`
- `/components/frameworks/*` (múltiplos)
- `/components/docs/*` (múltiplos)
- `/components/content/*` (múltiplos)

#### ❌ ERRADO - Padrão original v1:
```vue
<style scoped>
.nav-link {
  @apply text-gray-600 hover:text-gray-900 px-3 py-2;
}
.nav-link-active {
  @apply text-blue-600 font-semibold;
}
</style>
```

#### ✅ CORRETO - Padrão obrigatório v2:
```vue
<template>
  <button 
    class="text-gray-600 hover:text-gray-900 px-3 py-2"
    :class="{ 'text-blue-600 font-semibold': isActive }"
  >
    Button
  </button>
</template>

<style scoped>
/* Apenas CSS puro que não usa classes Tailwind */
.custom-height {
  height: 4.5rem;
}
</style>
```

### 🔧 **Componentes Nuxt UI - Problemas Identificados**

#### 🚨 **USlideover - EVITAR COMPLETAMENTE**
```vue
<!-- ❌ PROBLEMÁTICO (Reka UI bugs) -->
<USlideover v-model="isOpen">
  <!-- Cria elementos órfãos data-dismissable-layer -->
</USlideover>

<!-- ✅ SOLUÇÃO VALIDADA -->
<Transition
  enter-active-class="transition-transform duration-200"
  enter-from-class="-translate-x-full"
  enter-to-class="translate-x-0"
>
  <div v-if="isOpen" class="fixed...">
    <!-- Implementação custom com Transition -->
  </div>
</Transition>
```

#### ⚠️ **UDropdown - API v3.x Mudou**
- API completamente diferente da v2.x
- Sempre verificar documentação Nuxt UI 3.x atual
- Testar isoladamente antes de implementar

### 🌐 **Configuração Runtime - OBRIGATÓRIA**

```ts
// nuxt.config.ts - SEMPRE incluir essas configurações
runtimeConfig: {
  public: {
    appName: 'Matrix Protocol',           // ← CRÍTICO (evita "undefined")
    appVersion: '0.0.1',                  // ← CRÍTICO
    casheiroUrl: 'https://casheiro.com.br',
    githubUrl: process.env.GITHUB_URL || 'https://github.com/casheiro/matrix-protocol',
    discordUrl: process.env.DISCORD_URL || 'https://discord.gg/Gd7BxsRhB4'
  }
}
```

### 🗺️ **Rotas i18n - Padrões Validados**

```vue
<!-- ✅ PREFERENCIAL -->
:to="localePath('/frameworks/mef')"

<!-- ⚠️ ALTERNATIVA (quando localePath falha) -->
:to="`/${$i18n.locale}/frameworks/mef`"
```

**Contextos onde alternativa foi necessária:**
- MobileDrawer.vue (problemas de contexto de composable)
- Templates com v-for dinâmico

### 🎯 **MEP - Padrão de Navegação Obrigatório**

**DEVE aparecer em TODOS os menus de navegação:**

```vue
<!-- FrameworkDropdown.vue -->
<div v-else-if="item.type === 'mep'" class="flex items-center gap-3 w-full">
  <div class="w-3 h-3 rounded-full flex-shrink-0 bg-gradient-to-br from-blue-600 to-purple-600" />
  <div class="flex-1 min-w-0">
    <div class="flex items-center gap-2">
      <span class="font-medium text-gray-900 dark:text-white">MEP</span>
      <span class="text-xs px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
        Manifesto
      </span>
    </div>
    <p class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
      Princípio Epistemológico Matrix
    </p>
  </div>
</div>
```

### 🏢 **Atribuição Casheiro - Padrão Completo**

#### Footer obrigatório:
```vue
<p>
  {{ $t('footer.createdBy') }}
  <a :href="config.casheiroUrl" target="_blank" rel="noopener noreferrer"
     class="text-blue-400 hover:text-blue-300 underline transition-colors ml-1">
    {{ $t('footer.casheiroLink') }}
  </a>
</p>
```

#### Schema.org obrigatório:
```ts
// useSEO.ts
name: 'Casheiro',
description: 'Empresa criadora e mantenedora do Matrix Protocol',
url: toValue(config.casheiroUrl)
```

### 🌍 **i18n Completo - Todos os Textos**

```ts
// SEMPRE internacionalizar:
const defaultKeywords = t('seo.keywords.default')  // ← Era hardcoded em PT
const pageAuthor = t('seo.author')                 // ← "Casheiro"
```

```json
// pt.json & en.json - SEMPRE adicionar
"seo": {
  "keywords": {
    "default": "Matrix Protocol, Framework, IA...",
    "frameworks": "MEF, ZOF, OIF, MOC, MAL..."
  },
  "author": "Casheiro"
},
"footer": {
  "createdBy": "Matrix Protocol - Protocolo idealizado, criado e mantido pela",
  "casheiroLink": "Casheiro"
}
```

### 📋 **CHECKLIST DE MIGRAÇÃO OBRIGATÓRIO**

Para cada componente:

#### 1. Análise Prévia
- [ ] Mapear todos os `@apply` no componente original
- [ ] Identificar componentes Nuxt UI problemáticos
- [ ] Listar textos que precisam i18n

#### 2. Conversões Obrigatórias  
- [ ] Converter `@apply` para classes inline + `:class`
- [ ] Substituir USlideover por Transition custom
- [ ] Verificar/atualizar API UDropdown se usado

#### 3. Configuração e i18n
- [ ] Todos os textos usando `$t()`
- [ ] Links externos usando `useMatrixConfig()`
- [ ] SEO usando `useSEO()` internacionalizado

#### 4. Navegação
- [ ] MEP aparece com cores e badge corretos
- [ ] Rotas usando `localePath()` ou fallback validado

#### 5. Validação Final
- [ ] Build passa sem erros Tailwind CSS v4
- [ ] Funcionamento em PT e EN
- [ ] Visual idêntico ao original
- [ ] Performance mantida/melhorada

### 📖 **Documentação Completa**

Ver arquivo detalhado: `/docs/migracao/MIGRATION_PATTERNS.md`

### ⚠️ **CRITICAL: Tailwind CSS v4 Compatibility (MANTIDO)**

### Internationalization (i18n) Critical Requirements
- **ALL internal links MUST use `localePath()`** to preserve language context
- **Language switching must work on every page**
- **URL structure: `/pt/page` and `/en/page`**
- **Default locale: Portuguese (pt)**

### Content Migration Strategy
When migrating components from the original project:
1. **Preserve ALL functionality** - no feature loss allowed
2. **Maintain visual design** - colors, layouts, typography
3. **Update APIs** for Nuxt 4.x and @nuxt/ui 3.x compatibility
4. **⚠️ CRITICAL: Fix Tailwind CSS v4 compatibility** - convert `@apply` to inline classes
5. **Test multilingual functionality** - both PT and EN must work
6. **Validate performance** - maintain or improve Lighthouse scores

### 🔧 **Tailwind CSS v4 Migration Steps (MANDATORY)**
Para cada componente Vue migrado que usa `@apply`:

#### Step 1: Identificar estilos problemáticos
```bash
# Buscar por @apply em componentes
grep -r "@apply" app/components/
```

#### Step 2: Converter estilos
1. **Copiar classes** do `@apply` para variável/constante
2. **Aplicar inline** no template usando `class="..."`  
3. **Usar `:class` condicionais** para estados dinâmicos
4. **Remover `@apply`** completamente do `<style scoped>`

#### Step 3: Exemplo prático de conversão
```vue
<!-- ANTES (quebra no Tailwind v4) -->
<template>
  <button class="nav-link" :class="{ 'nav-link-active': active }">
</template>
<style scoped>
.nav-link { @apply text-gray-600 px-3 py-2; }
.nav-link-active { @apply text-blue-600 font-semibold; }
</style>

<!-- DEPOIS (compatível com Tailwind v4) -->
<template>
  <button 
    class="text-gray-600 px-3 py-2"
    :class="{ 'text-blue-600 font-semibold': active }"
  >
</template>
<style scoped>
/* Remover @apply ou manter apenas CSS puro */
</style>
```

#### Step 4: Validação
- Build deve passar sem erros de Tailwind
- Visual deve permanecer idêntico
- Estados dinâmicos devem funcionar

## Performance Requirements

### Mandatory Metrics (Lighthouse)
- **Performance**: ≥90
- **Accessibility**: ≥95  
- **Best Practices**: ≥90
- **SEO**: ≥95
- **Bundle Size**: ≤500KB (gzipped)

## Component Migration Priority

### Phase 1: Core Infrastructure
1. **Layout components** (`AppHeader.vue`, `MobileDrawer.vue`)
2. **Navigation components** (`FrameworkDropdown.vue`, `LanguageSelector.vue`)
3. **Main pages** (`index.vue`, `protocol.vue`)

### Phase 2: Content Components  
1. **Documentation components** (all `/docs` components)
2. **Framework pages** (`/frameworks` directory)
3. **Content processors** (markdown rendering)

### Phase 3: Advanced Features
1. **Composables** (all utility functions)
2. **Download system** 
3. **Search functionality**

## Testing & Validation Requirements

### Pre-Migration Checklist
- [ ] Read original component implementation
- [ ] Check project rules compliance 
- [ ] Verify framework documentation for current versions
- [ ] Plan API adaptations for Nuxt 4.x/@nuxt/ui 3.x
- [ ] **🔍 Identify `@apply` usage** in original component styles

### Post-Migration Validation
- [ ] Visual comparison with original
- [ ] Functional testing (all interactions work)  
- [ ] Responsive testing (3+ breakpoints)
- [ ] Multilingual testing (PT/EN switching)
- [ ] **✅ Tailwind CSS v4 compatibility** - no `@apply` in `<style scoped>`
- [ ] **🏗️ Build passes** without Tailwind errors
- [ ] Performance testing (Lighthouse ≥90)
- [ ] Accessibility testing (WCAG AA compliance)

## Documentation References

### Project-Specific Documentation
- **Project Rules**: `.trae/rules/project_rules.md` (MANDATORY reading)
- **Migration Plan**: `docs/migracao/PLANO_MIGRACAO_DETALHADO.md`
- **Component Mapping**: `docs/migracao/MAPEAMENTO_COMPONENTES.md`
- **Technical Adaptations**: `docs/migracao/ADAPTACOES_TECNICAS.md`

### Original Project Reference
- **Source Code**: `../matrix-protocol-website/` (complete reference implementation)
- **Component Structure**: Preserve hierarchy and organization
- **Content**: Located in `../matrix-protocol-website/content/`
- **Assets**: Logos and images in `../matrix-protocol-website/assets/`

### Official Framework Documentation
Always consult the official docs for the versions used in this project:
- **Nuxt 4.x**: Latest documentation for current features
- **@nuxt/ui 3.x**: Component API reference and migration guides
- **@nuxt/content 3.x**: Content management and querying
- **@nuxtjs/i18n 10.x**: Internationalization setup

## Development Workflow

### Before Making Changes
1. **Check todo list** and mark task as in_progress
2. **Read project rules** to ensure compliance
3. **Research current framework versions** and best practices
4. **Plan implementation** strategy respecting migration requirements

### During Implementation
1. **Follow Matrix Protocol identity** (colors, typography, structure)
2. **Preserve all functionality** from original implementation
3. **Test multilingual support** throughout development
4. **Maintain performance standards**

### After Implementation
1. **Run validation commands** (lint, typecheck, build)
2. **Test all functionality** including edge cases
3. **Verify compliance** with project rules
4. **Mark todo as completed**
5. **Document any changes or decisions**

## Emergency Procedures

### If Build Fails
1. Check module order in `nuxt.config.ts`
2. Verify UApp wrapper in `app.vue`
3. Ensure all imports use correct Nuxt 4.x syntax
4. Validate TypeScript types for new versions

### If i18n Breaks
1. Check all internal links use `localePath()`
2. Verify locale configuration in `nuxt.config.ts`
3. Ensure content exists for both PT and EN
4. Test language switching functionality

### If Components Break
1. Check @nuxt/ui 3.x component API changes
2. Verify prop names and structure updates
3. Update slot syntax if needed  
4. Test responsive behavior

## Key Success Metrics

### Migration Completion Criteria
- [ ] 100% functionality preserved from original
- [ ] All content migrated and validated
- [ ] Multilingual support fully functional
- [ ] Performance ≥ original metrics
- [ ] Zero accessibility violations
- [ ] Complete documentation
- [ ] All tests passing
- [ ] Production deployment functional

---

**Version**: Beta  
**Last Updated**: January 2025  
**Status**: Active Migration Phase 1

> ⚠️ **IMPORTANT**: This project follows strict migration rules that are NON-NEGOTIABLE. Always consult project documentation and original implementation before making any changes. When in doubt, ask for clarification rather than assuming implementation details.