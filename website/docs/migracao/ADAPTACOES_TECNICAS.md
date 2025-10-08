# Adaptações Técnicas Necessárias - Matrix Protocol Website

## 🎯 Visão Geral

Este documento detalha todas as adaptações técnicas necessárias para migrar o Matrix Protocol Website do projeto original para o v2, preservando funcionalidades enquanto atualiza para as versões mais recentes do Nuxt e Nuxt UI.

## ⚠️ ATENÇÃO CRÍTICA: Navegação Multilíngue (Nuxt UI 3.x)

### 🚨 PADRÃO OBRIGATÓRIO: UApp + localePath

**TODOS os links internos DEVEM usar `localePath()`** dentro do contexto do `UApp` para preservar o idioma atual:

#### ❌ INCORRETO (quebra navegação multilíngue):
```vue
<!-- app.vue - SEM UApp (QUEBRA I18N) -->
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<!-- Componente qualquer - Links sem localePath -->
<template>
  <!-- NUNCA fazer isso -->
  <NuxtLink to="/about">About</NuxtLink>
  <NuxtLink to="/docs/getting-started">Docs</NuxtLink>
  
  <!-- Também INCORRETO -->
  <router-link to="/contact">Contact</router-link>
  <a href="/services">Services</a>
</template>
```


#### ✅ CORRETO (preserva idioma + Nuxt UI 3.x):
```vue
<!-- app.vue - COM UApp (OBRIGATÓRIO) -->
<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const { locale } = useI18n()
</script>

<template>
  <UApp :locale="locales[locale]">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<!-- Componente qualquer - Links com localePath -->
<script setup>
const localePath = useLocalePath()
</script>

<template>
  <!-- Sempre usar localePath() -->
  <NuxtLink :to="localePath('/about')">About</NuxtLink>
  <NuxtLink :to="localePath('/docs/getting-started')">Docs</NuxtLink>
  
  <!-- Para rotas dinâmicas -->
  <NuxtLink :to="localePath({ name: 'docs-slug', params: { slug: 'api' } })">
    API Docs
  </NuxtLink>
</template>
```


#### 📋 Padrão Obrigatório em Todos os Componentes:

```vue
<script setup>
// SEMPRE importar localePath
const localePath = useLocalePath()
</script>

<template>
  <!-- Links simples -->
  <UButton :to="localePath('/protocol')">{{ $t('navigation.protocol') }}</UButton>
  
  <!-- Links dinâmicos -->
  <UButton :to="localePath(`/frameworks/${framework.key}`)">{{ framework.name }}</UButton>
  
  <!-- Links com âncoras -->
  <UButton :to="localePath(`/frameworks/${slug}#architecture`)">Arquitetura</UButton>
  
  <!-- Links com query params -->
  <UButton :to="localePath(`/resources?framework=${framework.key}`)">Recursos</UButton>
</template>
```


### 🔍 Padrões Obrigatórios (Nuxt UI 3.x)

| Componente | Padrão Obrigatório | Exemplo |
|------------|-------------------|---------|
| **app.vue** | `<UApp :locale="locales[locale]">` | Componente raiz obrigatório |
| **Todos os .vue** | `const localePath = useLocalePath()` | `<script setup>const localePath = useLocalePath()</script>` |
| **UButton** | `:to="localePath('/rota')"` | `<UButton :to="localePath('/about')">About</UButton>` |
| **NuxtLink** | `:to="localePath('/rota')"` | `<NuxtLink :to="localePath('/docs')">Docs</NuxtLink>` |
| **Navegação** | Sempre usar `localePath()` | `navigateTo(localePath('/contact'))` |

#### 🔍 Componentes que DEVEM ser Verificados:

| Componente | Prioridade | Links Críticos |
|------------|------------|----------------|
| `AppHeader.vue` | 🔴 Crítica | Navegação principal |
| `MobileDrawer.vue` | 🔴 Crítica | Menu mobile |
| `FrameworkDropdown.vue` | 🔴 Crítica | Dropdown de frameworks |
| `FrameworkSidebar.vue` | 🔴 Crítica | Navegação lateral |
| `FrameworkCard.vue` | 🟡 Alta | Cards de frameworks |
| `HeroSection.vue` | 🟡 Alta | CTAs principais |
| `QuickStartGuide.vue` | 🟡 Alta | Links de guia |
| `FeaturesSection.vue` | 🟡 Alta | Links de features |
| `DocsBreadcrumbs.vue` | 🟡 Alta | Breadcrumbs |

### 📋 Componentes Críticos a Migrar

| Arquivo | Mudança Necessária | Prioridade |
|---------|-------------------|-----------|
| `app.vue` | 🔴 **Adicionar UApp wrapper** | 🔴 CRÍTICA |
| `nuxt.config.ts` | 🔴 **Ordem módulos + strategy** | 🔴 CRÍTICA |
| `AppHeader.vue` | ⚠️ Verificar localePath | 🔴 Alta |
| `AppFooter.vue` | ⚠️ Verificar localePath | 🔴 Alta |
| `FrameworkSidebar.vue` | ⚠️ Verificar localePath | 🔴 Alta |
| `pages/*.vue` | ⚠️ Verificar localePath | 🔴 Alta |

### ✅ Validação Automática

O Nuxt UI 3.x com `UApp` **automaticamente valida** a configuração de i18n. Não são necessários scripts adicionais - o próprio framework detectará problemas de configuração durante o desenvolvimento.

#### 🧪 Teste Manual de Validação:

```javascript
// Script de teste para validar localePath
// Executar em cada página para verificar links
function validateLocalePaths() {
  const links = document.querySelectorAll('a[href^="/"]')
  const invalidLinks = []
  
  links.forEach(link => {
    const href = link.getAttribute('href')
    if (!href.startsWith('/pt/') && !href.startsWith('/en/')) {
      invalidLinks.push({
        element: link,
        href: href,
        text: link.textContent.trim()
      })
    }
  })
  
  if (invalidLinks.length > 0) {
    console.error('❌ Links sem localePath encontrados:', invalidLinks)
    return false
  }
  
  console.log('✅ Todos os links estão usando localePath corretamente')
  return true
}
```


## 1. Nuxt 4.x - Mudanças Principais

### 1.1 Configuração do Nuxt Config

#### Antes (Nuxt 3.13.0)
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    compatibilityDate: '2025-07-15',
    preset: 'static',
    prerender: {
      routes: ['/'],
      crawlLinks: true
    }
  },
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxtjs/i18n'
  ]
})
```


#### Depois (Nuxt 4.1.2)
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // Nitro config simplificado
  nitro: {
    preset: 'static',
    prerender: {
      routes: ['/'],
      crawlLinks: true
    }
  },
  
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxtjs/i18n'
  ]
})
```


**Mudanças Necessárias**:
- ✅ `compatibilityDate` movido para nível raiz
- ⚠️ Verificar se todas as configurações do Nitro são compatíveis
- ✅ Estrutura de módulos mantida

### 1.2 Sistema de Layouts

#### Antes
```vue
<!-- layouts/default.vue -->
<template>
  <div>
    <AppHeader />
    <main>
      <slot />
    </main>
  </div>
</template>
```


#### Depois
```vue
<!-- layouts/default.vue -->
<template>
  <div>
    <AppHeader />
    <main>
      <slot />
    </main>
  </div>
</template>
```


**Mudanças Necessárias**:
- ✅ Estrutura de layouts mantida
- ✅ Sem breaking changes significativos

### 1.3 Composables e APIs

#### useHead() - Mantido
```typescript
// Antes e Depois - Compatível
useHead({
  titleTemplate: (title) => title ? `${title} - Matrix Protocol` : 'Matrix Protocol',
  meta: [
    { name: 'description', content: 'Framework description' }
  ]
})
```


#### Runtime Config - Verificar
```typescript
// Verificar se há mudanças na API
const config = useRuntimeConfig()
```


## 2. Nuxt UI 3.x - Breaking Changes Críticos

### 2.1 UButton - Mudanças na API

#### Antes (Nuxt UI 2.17.0)
```vue
<template>
  <UButton 
    variant="outline" 
    size="sm"
    :to="localePath('/protocol')"
    class="nav-link"
  >
    {{ $t('navigation.protocol') }}
  </UButton>
</template>
```


#### Depois (Nuxt UI 3.3.4)
```vue
<template>
  <UButton 
    variant="outline" 
    size="sm"
    :to="localePath('/protocol')"
    class="nav-link"
  >
    {{ $t('navigation.protocol') }}
  </UButton>
</template>
```


**Verificações Necessárias**:
- ✅ Props básicas mantidas
- ⚠️ Verificar se `variant` e `size` têm os mesmos valores
- ⚠️ Testar comportamento de navegação com `:to`

### 2.2 UDropdown - Mudanças Significativas

#### Antes (Nuxt UI 2.x)
```vue
<template>
  <UDropdown 
    :items="frameworkItems"
    :popper="{ placement: 'bottom-start' }"
  >
    <UButton variant="ghost" trailing-icon="i-heroicons-chevron-down-20-solid">
      Frameworks
    </UButton>
  </UDropdown>
</template>

<script setup>
const frameworkItems = [
  [{
    label: 'MEF',
    to: '/frameworks/mef',
    icon: 'i-custom-mef'
  }]
]
</script>
```


#### Depois (Nuxt UI 3.x)
```vue
<template>
  <UDropdown>
    <UButton variant="ghost" trailing-icon="i-heroicons-chevron-down-20-solid">
      Frameworks
    </UButton>
    
    <template #content>
      <UDropdownItem 
        v-for="item in frameworkItems" 
        :key="item.label"
        :to="item.to"
        :icon="item.icon"
      >
        {{ item.label }}
      </UDropdownItem>
    </template>
  </UDropdown>
</template>

<script setup>
const frameworkItems = [
  {
    label: 'MEF',
    to: '/frameworks/mef',
    icon: 'i-custom-mef'
  }
]
</script>
```


**Mudanças Críticas**:
- 🔴 **BREAKING**: Estrutura de items completamente diferente
- 🔴 **BREAKING**: Uso de slots em vez de props para conteúdo
- 🔴 **BREAKING**: `UDropdownItem` como componente separado

### 2.3 UModal - Nova API

#### Antes (Nuxt UI 2.x)
```vue
<template>
  <UModal v-model="isOpen">
    <div class="p-4">
      <h3>Modal Title</h3>
      <p>Modal content</p>
    </div>
  </UModal>
</template>

<script setup>
const isOpen = ref(false)
</script>
```


#### Depois (Nuxt UI 3.x)
```vue
<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <h3>Modal Title</h3>
      </template>
      
      <p>Modal content</p>
    </UCard>
  </UModal>
</template>

<script setup>
const isOpen = ref(false)
</script>
```


**Mudanças**:
- ⚠️ Recomendado usar `UCard` dentro do modal
- ✅ `v-model` mantido para controle de estado

## 3. @nuxt/content 3.x - Mudanças na API

### 3.1 Query de Conteúdo

#### Antes (@nuxt/content 2.13.0)
```typescript
// Composable ou página
const { data: frameworks } = await $content('frameworks').fetch()
const { data: protocol } = await $content('protocol').fetch()

// Com filtros
const { data: posts } = await $content('blog')
  .where({ published: true })
  .sortBy('date', 'desc')
  .fetch()
```


#### Depois (@nuxt/content 3.7.1)
```typescript
// Composable ou página
const frameworks = await queryContent('frameworks').find()
const protocol = await queryContent('protocol').findOne()

// Com filtros
const posts = await queryContent('blog')
  .where({ published: true })
  .sort({ date: -1 })
  .find()
```


**Mudanças Críticas**:
- 🔴 **BREAKING**: `$content()` → `queryContent()`
- 🔴 **BREAKING**: `.fetch()` → `.find()` ou `.findOne()`
- 🔴 **BREAKING**: `.sortBy()` → `.sort()`

### 3.2 Navegação de Conteúdo

#### Antes
```typescript
const { data: navigation } = await $content()
  .only(['title', 'slug', 'dir'])
  .where({ dir: '/frameworks' })
  .fetch()
```


#### Depois
```typescript
const navigation = await queryContent()
  .only(['title', 'slug', '_path'])
  .where({ _path: { $contains: '/frameworks' } })
  .find()
```


**Mudanças**:
- 🔴 **BREAKING**: `dir` → `_path`
- ⚠️ Sintaxe de filtros atualizada

### 3.3 Componentes de Conteúdo

#### Antes
```vue
<template>
  <div>
    <nuxt-content :document="doc" />
  </div>
</template>
```


#### Depois
```vue
<template>
  <div>
    <ContentRenderer :value="doc" />
  </div>
</template>
```


**Mudanças**:
- 🔴 **BREAKING**: `<nuxt-content>` → `<ContentRenderer>`
- 🔴 **BREAKING**: `:document` → `:value`

## 4. Internacionalização (Nuxt UI 3.x + @nuxtjs/i18n)

### ⚠️ MUDANÇA CRÍTICA: Integração Nuxt UI 3.x

O Nuxt UI 3.x introduz um **novo padrão obrigatório** para internacionalização que requer:

1. **Componente UApp obrigatório**
2. **Integração com locales do Nuxt UI**
3. **Configuração híbrida @nuxtjs/i18n + Nuxt UI**

### 4.1 Configuração Atual vs Nova

#### Antes (Nuxt 3.x + @nuxtjs/i18n apenas)
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'pt', file: 'pt.json' }
    ],
    defaultLocale: 'en',
    langDir: 'locales/',
    strategy: 'prefix'
  }
})
```


```vue
<!-- app.vue - ANTES -->
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```


#### Depois (Nuxt 4.x + Nuxt UI 3.x)
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',           // OBRIGATÓRIO antes do @nuxtjs/i18n
    '@nuxtjs/i18n'
  ],
  i18n: {
    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'pt', file: 'pt.json' }
    ],
    defaultLocale: 'en',
    langDir: 'locales/',
    strategy: 'prefix_except_default', // Mudança principal
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'matrix_locale',
      redirectOn: 'root'
    }
  }
})
```


```vue
<!-- app.vue - DEPOIS (OBRIGATÓRIO) -->
<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const { locale } = useI18n()
</script>

<template>
  <UApp :locale="locales[locale]">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
```


**Mudanças Críticas**:
- 🔴 **BREAKING**: Componente `UApp` obrigatório no root
- 🔴 **BREAKING**: Ordem dos módulos importa (`@nuxt/ui` antes de `@nuxtjs/i18n`)
- 🔴 **BREAKING**: Integração com locales do Nuxt UI
- ⚠️ Strategy recomendada: `prefix_except_default`
- ✅ `localePath()` e `$t()` mantidos

## 5. Adaptações Específicas por Componente

### 5.1 AppHeader.vue

#### Problemas Identificados
1. **UButton**: Verificar props e comportamento
2. **Dropdown de Frameworks**: Migração crítica necessária
3. **Language Selector**: Atualizar componente

#### Estratégia de Migração
```vue
<!-- Antes -->
<UButton
  :to="localePath('/protocol')"
  variant="ghost"
  class="nav-link"
  size="sm"
>
  {{ $t('navigation.protocol') }}
</UButton>

<!-- Depois - Verificar se mantém -->
<UButton
  :to="localePath('/protocol')"
  variant="ghost"
  class="nav-link"
  size="sm"
>
  {{ $t('navigation.protocol') }}
</UButton>
```


### 5.2 FrameworkDropdown.vue

#### Migração Crítica
```vue
<!-- ANTES (Nuxt UI 2.x) -->
<template>
  <UDropdown 
    :items="frameworkItems"
    :popper="{ placement: 'bottom-start' }"
  >
    <UButton variant="ghost" trailing-icon="i-heroicons-chevron-down-20-solid">
      {{ $t('navigation.frameworks') }}
    </UButton>
  </UDropdown>
</template>

<!-- DEPOIS (Nuxt UI 3.x) -->
<template>
  <UDropdown>
    <UButton variant="ghost" trailing-icon="i-heroicons-chevron-down-20-solid">
      {{ $t('navigation.frameworks') }}
    </UButton>
    
    <template #content>
      <div class="p-1">
        <UDropdownItem 
          v-for="framework in frameworks" 
          :key="framework.slug"
          :to="localePath(`/frameworks/${framework.slug}`)"
          class="flex items-center gap-2"
        >
          <img 
            :src="framework.icon" 
            :alt="framework.name"
            class="w-4 h-4"
          />
          {{ framework.name }}
        </UDropdownItem>
      </div>
    </template>
  </UDropdown>
</template>
```


### 5.3 Componentes de Conteúdo

#### GlossaryContent.vue
```vue
<!-- ANTES -->
<script setup>
const { data: glossary } = await $content('glossary').fetch()
</script>

<!-- DEPOIS -->
<script setup>
const glossary = await queryContent('glossary').findOne()
</script>
```


#### ProtocolContent.vue
```vue
<!-- ANTES -->
<script setup>
const { data: protocol } = await $content('protocol').fetch()
const { data: navigation } = await $content()
  .only(['title', 'slug'])
  .where({ dir: '/protocol' })
  .fetch()
</script>

<!-- DEPOIS -->
<script setup>
const protocol = await queryContent('protocol').findOne()
const navigation = await queryContent()
  .only(['title', 'slug', '_path'])
  .where({ _path: { $contains: '/protocol' } })
  .find()
</script>
```


## 6. Testes de Compatibilidade

### 6.1 Checklist de Verificação

#### Nuxt UI Components
- [ ] `UButton` - Props e comportamento
- [ ] `UDropdown` - Nova estrutura de slots
- [ ] `UModal` - API de controle
- [ ] `UInput` - Validação e eventos
- [ ] `UCard` - Estrutura e slots
- [ ] `UBadge` - Estilos e variantes

#### @nuxt/content
- [ ] `queryContent()` - Substituição de `$content()`
- [ ] `.find()` vs `.fetch()`
- [ ] Filtros e ordenação
- [ ] `ContentRenderer` - Substituição de `nuxt-content`
- [ ] Navegação de conteúdo
- [ ] Syntax highlighting

#### Nuxt 4.x
- [ ] Configuração do `nuxt.config.ts`
- [ ] Sistema de layouts
- [ ] Roteamento dinâmico
- [ ] Composables (`useHead`, `useSeoMeta`)
- [ ] Runtime config
- [ ] Build e deployment

### 6.2 Plano de Testes

#### Fase 1: Componentes Isolados
1. Criar versões de teste de cada componente
2. Verificar props e eventos
3. Testar responsividade
4. Validar acessibilidade

#### Fase 2: Integração
1. Testar navegação completa
2. Verificar sistema de conteúdo
3. Testar internacionalização
4. Validar SEO e meta tags

#### Fase 3: Performance
1. Comparar bundle size
2. Testar Core Web Vitals
3. Verificar tempos de carregamento
4. Validar SSG/SSR

## 7. Scripts de Migração

### 7.1 Script de Atualização de Queries
```javascript
// scripts/update-content-queries.js
const fs = require('fs')
const path = require('path')

function updateContentQueries(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  
  // Substituir $content por queryContent
  content = content.replace(/\$content\(/g, 'queryContent(')
  
  // Substituir .fetch() por .find()
  content = content.replace(/\.fetch\(\)/g, '.find()')
  
  // Substituir .sortBy por .sort
  content = content.replace(/\.sortBy\(([^,]+),\s*['"]([^'"]+)['"]\)/g, '.sort({ $1: "$2" === "desc" ? -1 : 1 })')
  
  fs.writeFileSync(filePath, content)
}
```


### 7.2 Script de Atualização de Componentes
```javascript
// scripts/update-ui-components.js
function updateUIComponents(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  
  // Atualizar nuxt-content para ContentRenderer
  content = content.replace(/<nuxt-content\s+:document="([^"]+)"/g, '<ContentRenderer :value="$1"')
  content = content.replace(/<\/nuxt-content>/g, '</ContentRenderer>')
  
  fs.writeFileSync(filePath, content)
}
```


## 8. Rollback Strategy

### 8.1 Backup Completo
- Manter projeto original intacto
- Criar branch de backup antes da migração
- Documentar todas as mudanças

### 8.2 Pontos de Rollback
1. **Após configuração base**: Se build falhar
2. **Após migração de componentes**: Se UI quebrar
3. **Após migração de conteúdo**: Se CMS falhar
4. **Antes do deploy**: Validação final

### 8.3 Critérios de Rollback
- Build failures que não podem ser resolvidos em 2 horas
- Perda de funcionalidade crítica
- Problemas de performance significativos
- Quebras de acessibilidade

## 9. 🚨 CRÍTICO: Tailwind CSS v4 Compatibility

### 9.1 Problema Identificado

**Erro comum durante o build**:
```

ERROR [@tailwindcss/vite:generate:build] Cannot apply unknown utility class text-gray-600. 
Are you using CSS modules or similar and missing @reference?
```


**Causa**: Classes `@apply` em blocos `<style scoped>` não são compatíveis com Tailwind CSS v4.

### 9.2 Componentes Afetados

Todos os componentes que usam padrão `@apply` em estilos escopados:
- `AppHeader.vue`
- `FrameworkDropdown.vue` 
- `LanguageSelector.vue`
- `MobileDrawer.vue`
- Qualquer componente migrado com esse padrão

### 9.3 Solução Obrigatória

#### ❌ ANTES (Original - Quebra no build)
```vue
<template>
  <button class="nav-link" :class="{ 'nav-link-active': isActive }">
    {{ label }}
  </button>
</template>
<style scoped>
.nav-link {
  @apply text-gray-600 dark:text-gray-300 hover:text-gray-900 px-3 py-2;
}
.nav-link-active {
  @apply text-blue-600 dark:text-blue-400 font-semibold bg-blue-50;
}
</style>
```


#### ✅ DEPOIS (v2 - Compatível com Tailwind v4)
```vue
<template>
  <button 
    class="text-gray-600 dark:text-gray-300 hover:text-gray-900 px-3 py-2 transition-colors duration-200"
    :class="{ 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/20': isActive }"
  >
    {{ label }}
  </button>
</template>
<style scoped>
/* Apenas CSS puro se absolutamente necessário */
.custom-height {
  height: 4.5rem;
}
</style>
```


### 9.4 Processo de Conversão

#### Passo 1: Identificar estilos problemáticos
```bash
# Buscar por @apply em componentes
grep -r "@apply" app/components/
```


#### Passo 2: Extrair classes Tailwind
1. Copiar todas as classes dos blocos `@apply`
2. Criar constantes/variáveis se necessário
3. Preparar classes condicionais para estados

#### Passo 3: Aplicar no template
```vue
<!-- Exemplo de conversão completa -->
<template>
  <nav>
    <button 
      v-for="item in items"
      :key="item.id"
      class="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      :class="getItemClasses(item)"
    >
      {{ item.label }}
    </button>
  </nav>
</template>

<script setup>
const getItemClasses = (item) => {
  return item.active 
    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-matrix-600'
}
</script>
```


#### Passo 4: Remover `@apply`
- Deletar completamente todos os blocos `@apply`
- Manter apenas CSS puro se necessário
- Remover `<style scoped>` vazio

#### Passo 5: Validar
```bash
pnpm build  # Deve passar sem erros Tailwind
```


### 9.5 Componentes Já Migrados (Referência)

Os seguintes componentes foram corrigidos e podem servir de referência:
- `✅ app/components/layout/AppHeader.vue`
- `✅ app/components/navigation/FrameworkDropdown.vue`
- `✅ app/components/navigation/LanguageSelector.vue`  
- `✅ app/components/layout/MobileDrawer.vue`

### 9.6 Checklist de Migração de Estilos

Para cada componente migrado:
- [ ] Identificar todos os `@apply` no componente original
- [ ] Extrair classes Tailwind para template
- [ ] Implementar estados dinâmicos com `:class`
- [ ] Remover `@apply` completamente
- [ ] Testar build (`pnpm build`)
- [ ] Validar visual permanece idêntico
- [ ] Confirmar interações funcionam

## Conclusão

Esta documentação fornece um guia completo para todas as adaptações técnicas necessárias, incluindo a correção crítica para Tailwind CSS v4. A migração deve ser feita de forma incremental, testando cada componente após a atualização e mantendo sempre a possibilidade de rollback.