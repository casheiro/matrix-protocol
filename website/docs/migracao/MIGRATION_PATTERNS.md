# Padrões de Migração v1 → v2

Este documento consolida todos os padrões identificados durante a migração bem-sucedida da página index.vue e componentes relacionados.

## 🎯 Objetivo

Documentar **padrões críticos** para garantir que futuras migrações de componentes sigam as adaptações necessárias desde o início, evitando retrabalho.

## 📊 Análise Comparativa Realizada

### Componentes Analisados
- ✅ `pages/index.vue` (migração completa)
- ✅ `components/layout/AppHeader.vue` 
- ✅ `components/layout/MobileDrawer.vue`
- ✅ `components/navigation/FrameworkDropdown.vue`
- ✅ `composables/useSEO.ts`
- ✅ `composables/useMatrixConfig.ts`

### Status da Migração
- **100% funcional**: página index.vue
- **Navegação completa**: desktop e mobile
- **i18n integrado**: PT/EN 
- **SEO otimizado**: meta tags dinâmicas
- **Atribuição correta**: Casheiro como criador

---

## ⚠️ PADRÕES CRÍTICOS IDENTIFICADOS

### 1. **Tailwind CSS v4 - Conversão Obrigatória de @apply**

#### ❌ **PROBLEMA** (Original v1)
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


#### ✅ **SOLUÇÃO** (Nova v2)
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


#### **Arquivos que PRECISAM dessa conversão:**
- `/components/navigation/FrameworkDropdown.vue`
- `/components/layout/MobileDrawer.vue` 
- `/components/layout/AppHeader.vue`
- `/components/frameworks/TableOfContents.vue`
- `/components/frameworks/FrameworkSidebar.vue`
- `/components/frameworks/FrameworkLayout.vue`
- **+ 9 outros componentes docs/content**

**Total**: 15+ arquivos identificados com `@apply`

---

### 2. **Rotas i18n - Padrão de Uso**

#### ✅ **Padrão Preferencial**
```vue
<NuxtLink :to="localePath('/frameworks/mef')">
```


#### ⚠️ **Alternativa quando localePath falha**
```vue
<NuxtLink :to="`/${$i18n.locale}/frameworks/mef`">
```


**Contextos onde foi necessário usar alternativa:**
- MobileDrawer.vue (problemas de contexto de composable)
- Templates com v-for dinâmico
- Condições específicas de rota

---

### 3. **Configuração Runtime - Obrigatória**

#### ❌ **PROBLEMA** (Original v1)
```ts
// nuxt.config.ts - FALTAVA
runtimeConfig: {
  public: {
    siteUrl: process.env.SITE_URL || 'http://localhost:3000'
    // appName e appVersion AUSENTES
  }
}
```


#### ✅ **SOLUÇÃO** (Nova v2)
```ts
// nuxt.config.ts - OBRIGATÓRIO
runtimeConfig: {
  public: {
    appName: 'Matrix Protocol',           // ← CRÍTICO
    appVersion: '0.0.1',                  // ← CRÍTICO
    siteUrl: process.env.SITE_URL || 'http://localhost:3000',
    casheiroUrl: 'https://casheiro.com.br',
    githubUrl: process.env.GITHUB_URL || 'https://github.com/casheiro/matrix-protocol',
    discordUrl: process.env.DISCORD_URL || 'https://discord.gg/Gd7BxsRhB4'
  }
}
```


**Resultado**: Evita "undefined" nos títulos das páginas.

---

### 4. **Componentes Nuxt UI - Problemas Identificados**

#### 🚨 **USlideover - EVITAR COMPLETAMENTE**
```vue
<!-- ❌ PROBLEMÁTICO (Reka UI bugs) -->
<USlideover v-model="isOpen">
  <!-- Cria elementos órfãos data-dismissable-layer -->
</USlideover>

<!-- ✅ SOLUÇÃO -->
<Transition
  enter-active-class="transition-transform duration-200"
  enter-from-class="-translate-x-full"
  enter-to-class="translate-x-0"
>
  <div v-if="isOpen" class="fixed...">
    <!-- Implementação custom -->
  </div>
</Transition>
```


#### ⚠️ **UDropdown - API v3.x Mudou**
- Verificar sempre documentação Nuxt UI 3.x
- Props e estrutura diferentes da v2.x
- Testar isoladamente antes de usar

---

### 5. **SEO e i18n - Internacionalização Completa**

#### ❌ **PROBLEMA** (Original v1)
```ts
// useSEO.ts - Keywords hardcoded em português
keywords = 'Matrix Protocol, Framework, IA, Inteligência Artificial...'
```


#### ✅ **SOLUÇÃO** (Nova v2)
```ts
// useSEO.ts - Internacionalizado
const defaultKeywords = t('seo.keywords.default')
const pageKeywords = keywords || defaultKeywords

// pt.json
"seo": {
  "keywords": {
    "default": "Matrix Protocol, Framework, IA, Inteligência Artificial...",
  },
  "author": "Casheiro"
}

// en.json  
"seo": {
  "keywords": {
    "default": "Matrix Protocol, Framework, AI, Artificial Intelligence...",
  },
  "author": "Casheiro"
}
```


---

### 6. **Estrutura de Componentes - Auto-import Issues**

#### ❌ **PROBLEMA** (Original v1)
```vue
<!-- pages/index.vue -->
<template>
  <main>
    <HomeHeroSection />      <!-- Auto-import falhando -->
    <HomeFrameworksGrid />   <!-- Auto-import falhando -->
    <HomeFeaturesSection />  <!-- Auto-import falhando -->
  </main>
</template>
```


#### ✅ **SOLUÇÃO** (Nova v2)
```vue
<!-- pages/index.vue -->
<template>
  <div>
    <!-- Hero Section - INLINE -->
    <section class="relative py-20...">
      <!-- Conteúdo direto aqui -->
    </section>
    
    <!-- Frameworks Section - INLINE -->
    <section class="py-16...">
      <!-- Conteúdo direto aqui -->
    </section>
  </div>
</template>
```


**Razão**: Nuxt 4 tem mudanças no auto-import que causam problemas em alguns casos.

---

### 7. **Navegação MEP - Padrão Obrigatório**

#### ✅ **Deve aparecer em TODOS os menus**
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

<!-- MobileDrawer.vue -->
<NuxtLink :to="`/${$i18n.locale}/mep`" class="...">
  <div class="w-3 h-3 rounded-full flex-shrink-0 bg-gradient-to-br from-blue-600 to-purple-600" />
  <span class="font-medium">MEP</span>
  <span class="text-xs px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
    Manifesto
  </span>
</NuxtLink>
```


---

### 8. **Atribuição Casheiro - Padrão Completo**

#### ✅ **Footer obrigatório**
```vue
<p>
  {{ $t('footer.createdBy') }}
  <a :href="config.casheiroUrl" target="_blank" rel="noopener noreferrer"
     class="text-blue-400 hover:text-blue-300 underline transition-colors ml-1">
    {{ $t('footer.casheiroLink') }}
  </a>
</p>
```


#### ✅ **Schema.org**
```ts
// useSEO.ts
const generateSchemaOrg = (title: string, description: string, url: string) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Casheiro',                                    // ← OBRIGATÓRIO
    description: 'Empresa criadora e mantenedora do Matrix Protocol',
    url: toValue(config.casheiroUrl),
    // ...
  }
}
```


---

## 🔧 CHECKLIST DE MIGRAÇÃO

### Para cada componente a migrar:

#### **1. Análise Prévia**
- [ ] Listar todos os `@apply` no componente
- [ ] Identificar rotas com i18n
- [ ] Verificar componentes Nuxt UI usados
- [ ] Mapear textos que precisam i18n

#### **2. Conversões Obrigatórias**
- [ ] Converter `@apply` para classes inline
- [ ] Usar `:class` para condicionais dinâmicas
- [ ] Substituir USlideover por Transition customizada
- [ ] Verificar API de UDropdown se necessário

#### **3. i18n e Configuração**
- [ ] Todos os textos usando `$t()`
- [ ] Rotas usando `localePath()` (preferencial)
- [ ] Links externos usando config do `useMatrixConfig()`
- [ ] SEO usando composable `useSEO()`

#### **4. Navegação e MEP**
- [ ] MEP aparece em dropdowns/menus
- [ ] Cores corretas (gradiente blue-purple)
- [ ] Badge "Manifesto" implementado

#### **5. Validação Final**
- [ ] Build passa sem erros Tailwind
- [ ] Funcionamento em PT e EN
- [ ] Responsive em 3+ breakpoints
- [ ] Acessibilidade (aria-labels, etc.)

---

## 📝 PADRÕES DE CÓDIGO

### **Estrutura de Composable**
```ts
export const useMatrixConfig = () => {
  const config = useRuntimeConfig()
  
  // Computed properties
  const appName = computed(() => config.public.appName)
  
  // Helper functions
  const getFullUrl = (path: string) => {
    const baseUrl = siteUrl.value.replace(/\/$/, '')
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${baseUrl}${cleanPath}`
  }
  
  return {
    appName,
    getFullUrl,
    // ...
  }
}
```


### **Estrutura de SEO**
```ts
export const useSEO = () => {
  const { t, locale } = useI18n()
  const config = useMatrixConfig()
  
  const generatePageSEO = (options: {
    title?: string
    description?: string
    keywords?: string
    // ...
  }) => {
    const defaultKeywords = t('seo.keywords.default')
    // ...
  }
}
```


### **Estrutura de Navegação**
```vue
<template>
  <!-- Sempre com acessibilidade -->
  <nav role="navigation" aria-label="Primary navigation">
    <NuxtLink 
      :to="localePath('/path')" 
      :aria-label="$t('navigation.linkDescription')"
      class="base-classes"
      :class="{ 'active-classes': isActive }"
    >
      {{ $t('navigation.linkText') }}
    </NuxtLink>
  </nav>
</template>
```


---

## 🎯 PRÓXIMOS COMPONENTES PRIORITÁRIOS

### **Fase 2 - Layout Components**
1. `AppHeader.vue` - ⚠️ Tem `@apply` para converter
2. `FrameworkDropdown.vue` - ⚠️ Tem `@apply` para converter  
3. `MobileDrawer.vue` - ⚠️ Tem `@apply` para converter

### **Fase 3 - Framework Components**
1. `FrameworkLayout.vue` - ⚠️ Tem `@apply`
2. `FrameworkSidebar.vue` - ⚠️ Tem `@apply`
3. `TableOfContents.vue` - ⚠️ Tem `@apply`

### **Fase 4 - Content Components**
1. Todos os componentes em `/docs/` - ⚠️ Múltiplos `@apply`
2. Todos os componentes em `/content/` - ⚠️ Múltiplos `@apply`

---

## ✅ VALIDAÇÃO DE SUCESSO

### **Métricas Alcançadas na index.vue:**
- ✅ Build sem erros Tailwind CSS v4
- ✅ Navegação PT/EN funcional 
- ✅ SEO dinâmico internacional
- ✅ Performance mantida/melhorada
- ✅ Acessibilidade WCAG AA
- ✅ Todas as funcionalidades preservadas
- ✅ Visual idêntico ao original

### **Replicar em todos os próximos componentes.**

---

**Data**: Janeiro 2025  
**Status**: Padrões consolidados e validados  
**Próximo**: Aplicar em componentes da Fase 2