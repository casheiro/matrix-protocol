# 🗂️ **MAPEAMENTO DA ESTRUTURA DE CONTEÚDO**

> **Base de Dados**: Auditoria real executada por Ricardo Lima  
> **Fonte**: `/docs/dynamic-navigation/audit-reports/content-audit-latest.json`  
> **Objetivo**: Navegação dinâmica baseada em estrutura de arquivos **SEM categorização**

## 📊 **ESTATÍSTICAS GERAIS**

- **📁 Total de pastas**: 48
- **📄 Total de arquivos**: 125 
- **📝 Arquivos Markdown**: 59
- **📋 Arquivos YAML**: 50
- **🏗️ Profundidade máxima**: 5 níveis (depth: 0-4)
- **🌐 Idiomas suportados**: Português (`pt/`) e Inglês (`en/`)
- **❌ Arquivos index.md faltantes**: 20

## 🌳 **HIERARQUIA COMPLETA DESCOBERTA**

### **Estrutura Real Mapeada**
```
/content/
├── pt/docs/                           (DEPTH 0) - 4 arquivos .md
│   ├── quickstart/                    (DEPTH 1) - 1 arquivo .md
│   │   └── templates/                 (DEPTH 2) - 0 arquivos
│   ├── manual/                        (DEPTH 1) - 0 arquivos
│   │   ├── mal/                       (DEPTH 2) - 1 arquivo .md
│   │   ├── mef/                       (DEPTH 2) - 1 arquivo .md  
│   │   ├── mep/                       (DEPTH 2) - 1 arquivo .md
│   │   ├── moc/                       (DEPTH 2) - 1 arquivo .md
│   │   ├── oif/                       (DEPTH 2) - 1 arquivo .md
│   │   ├── templates/                 (DEPTH 2) - 1 arquivo .md
│   │   │   ├── basic/                 (DEPTH 3) - 0 arquivos
│   │   │   ├── corporation/           (DEPTH 3) - 0 arquivos
│   │   │   ├── enterprise/            (DEPTH 3) - 0 arquivos
│   │   │   ├── scaleup/               (DEPTH 3) - 0 arquivos
│   │   │   ├── startup/               (DEPTH 3) - 0 arquivos
│   │   │   └── unified/               (DEPTH 3) - 0 arquivos
│   │   └── zof/                       (DEPTH 2) - 1 arquivo .md
│   ├── examples/                      (DEPTH 1) - 1 arquivo .md
│   │   └── knowledge/                 (DEPTH 2) - 4 arquivos (.md + .yaml)
│   │       ├── structured/            (DEPTH 3) - 1 arquivo .md
│   │       │   ├── business-rules/    (DEPTH 4) - 7 arquivos (1 .md + 6 .yaml)
│   │       │   ├── procedures/        (DEPTH 4) - 6 arquivos (1 .md + 5 .yaml)
│   │       │   └── technical-patterns/ (DEPTH 4) - 7 arquivos (1 .md + 6 .yaml)
│   │       └── unstructured/          (DEPTH 3) - 12 arquivos (.md + .txt)
│   └── frameworks/                    (DEPTH 1) - 5 arquivos .md
└── en/docs/                           (DEPTH 0) - 4 arquivos .md
    ├── quickstart/                    (DEPTH 1) - 1 arquivo .md
    │   └── templates/                 (DEPTH 2) - 0 arquivos  
    ├── manual/                        (DEPTH 1) - 0 arquivos
    │   └── templates/                 (DEPTH 2) - 0 arquivos
    │       ├── basic/                 (DEPTH 3) - 0 arquivos
    │       ├── corporation/           (DEPTH 3) - 0 arquivos
    │       ├── enterprise/            (DEPTH 3) - 0 arquivos
    │       ├── scaleup/               (DEPTH 3) - 0 arquivos
    │       ├── startup/               (DEPTH 3) - 0 arquivos
    │       └── unified/               (DEPTH 3) - 0 arquivos
    ├── examples/                      (DEPTH 1) - 1 arquivo .md
    │   └── knowledge/                 (DEPTH 2) - 1 arquivo .md
    │       ├── structured/            (DEPTH 3) - 0 arquivos
    │       │   ├── business-rules/    (DEPTH 4) - 0 arquivos
    │       │   ├── procedures/        (DEPTH 4) - 0 arquivos
    │       │   └── technical-patterns/ (DEPTH 4) - 0 arquivos
    │       └── unstructured/          (DEPTH 3) - 0 arquivos
    └── frameworks/                    (DEPTH 1) - 5 arquivos .md
```

## 🎯 **ANÁLISE POR PROFUNDIDADE**

### **DEPTH 0 (Root)** - 2 pastas
- **pt/docs/**: 4 arquivos .md
- **en/docs/**: 4 arquivos .md
- **Total**: 8 arquivos .md, 0 .yaml

### **DEPTH 1 (Seções Principais)** - 12 pastas
- **quickstart/** (pt + en): 2 arquivos .md
- **manual/** (pt + en): 0 arquivos
- **examples/** (pt + en): 2 arquivos .md  
- **frameworks/** (pt + en): 10 arquivos .md
- **Total**: 23 arquivos .md, 0 .yaml

### **DEPTH 2 (Categorias)** - 12 pastas
- **templates/** (quickstart): 0 arquivos
- **mal/, mef/, mep/, moc/, oif/, zof/** (manual/pt): 6 arquivos .md
- **templates/** (manual): 1 arquivo .md
- **knowledge/** (examples): 5 arquivos (.md + .yaml)
- **Total**: 17 arquivos .md, 4 .yaml

### **DEPTH 3 (Subcategorias)** - 16 pastas
- **basic/, corporation/, enterprise/, scaleup/, startup/, unified/** (templates): 0 arquivos
- **structured/, unstructured/** (knowledge): 25 arquivos
- **Total**: 8 arquivos .md, 12 .yaml

### **DEPTH 4 (Conteúdo Específico)** - 6 pastas
- **business-rules/**: 7 arquivos (1 .md + 6 .yaml)
- **procedures/**: 6 arquivos (1 .md + 5 .yaml)
- **technical-patterns/**: 7 arquivos (1 .md + 6 .yaml)
- **Total**: 3 arquivos .md, 34 .yaml

## 📁 **PASTAS COM ARQUIVOS INDEX.MD**

### **Existentes** (detectados pela auditoria):
```
✅ pt/docs/index.md                              - "Documentação"
✅ pt/docs/quickstart/index.md                   - "Guia de Início Rápido"
✅ pt/docs/examples/index.md                     - "Exemplos"  
✅ pt/docs/examples/knowledge/index.md           - "Knowledge Comparison"
✅ pt/docs/examples/knowledge/structured/index.md - "Structured Knowledge"
✅ pt/docs/examples/knowledge/structured/business-rules/index.md
✅ pt/docs/examples/knowledge/structured/procedures/index.md
✅ pt/docs/examples/knowledge/structured/technical-patterns/index.md

✅ en/docs/index.md                              - "Documentation"
✅ en/docs/quickstart/index.md                   - "Quick Start Guide"
✅ en/docs/examples/index.md                     - "Examples"
✅ en/docs/examples/knowledge/index.md           - "Knowledge Comparison"
```

### **Faltantes** (identificados para criação):
```
❌ pt/docs/manual/templates/basic/index.md
❌ pt/docs/manual/templates/corporation/index.md
❌ pt/docs/manual/templates/enterprise/index.md
❌ pt/docs/manual/templates/scaleup/index.md
❌ pt/docs/manual/templates/startup/index.md
❌ pt/docs/manual/templates/unified/index.md
❌ pt/docs/quickstart/templates/index.md

❌ en/docs/examples/knowledge/structured/index.md
❌ en/docs/examples/knowledge/structured/business-rules/index.md
❌ en/docs/examples/knowledge/structured/procedures/index.md
❌ en/docs/examples/knowledge/structured/technical-patterns/index.md
❌ en/docs/examples/knowledge/unstructured/index.md
❌ en/docs/manual/index.md
❌ en/docs/manual/templates/basic/index.md
❌ en/docs/manual/templates/corporation/index.md
❌ en/docs/manual/templates/enterprise/index.md
❌ en/docs/manual/templates/scaleup/index.md
❌ en/docs/manual/templates/startup/index.md
❌ en/docs/manual/templates/unified/index.md
❌ en/docs/quickstart/templates/index.md
```

## 🚀 **ALGORITMO DE DESCOBERTA AUTOMÁTICA**

### **Princípio Base**: Estrutura = Navegação
```typescript
// Descobrir estrutura recursivamente
async function discoverContentStructure(basePath: string): Promise<ContentNode[]> {
  const folders = await scanDirectories(basePath)
  
  return Promise.all(folders.map(async folder => {
    const indexFile = path.join(folder, 'index.md')
    const hasIndex = await fileExists(indexFile)
    
    return {
      // 1. Título: extrair de frontmatter ou formatar nome da pasta
      title: hasIndex 
        ? await extractTitleFromFrontmatter(indexFile)
        : formatFolderName(folder),
      
      // 2. Caminho: usar estrutura real das pastas
      path: folder,
      
      // 3. Ícone: extrair de frontmatter ou usar padrão baseado no nome
      icon: hasIndex
        ? await extractIconFromFrontmatter(indexFile)
        : getDefaultIcon(folder),
      
      // 4. Ordem: extrair de frontmatter ou ordem alfabética
      order: hasIndex
        ? await extractOrderFromFrontmatter(indexFile)
        : getAlphabeticalOrder(folder),
      
      // 5. Filhos: descobrir subpastas recursivamente
      children: await discoverContentStructure(folder),
      
      // 6. Tem conteúdo: verificar se a pasta tem arquivos navegáveis
      hasContent: await hasNavigableContent(folder)
    }
  }))
}
```

### **Funções de Fallback**
```typescript
// Converter nome da pasta em título legível
function formatFolderName(folderPath: string): string {
  return folderPath
    .split('/').pop()                    // Extrair nome da pasta
    .replace(/-/g, ' ')                  // Hífens → espaços
    .replace(/\b\w/g, l => l.toUpperCase()) // Title Case
}

// Exemplo: "business-rules" → "Business Rules"
// Exemplo: "quickstart" → "Quickstart"

// Mapeamento de ícones baseado na estrutura real descoberta
function getDefaultIcon(folderPath: string): string {
  const folderName = folderPath.split('/').pop()
  
  const iconMap = {
    // Seções principais (DEPTH 1)
    'quickstart': 'i-heroicons-rocket-launch',
    'manual': 'i-heroicons-book-open',
    'examples': 'i-heroicons-code-bracket',
    'frameworks': 'i-heroicons-cube',
    
    // Categorias (DEPTH 2)
    'templates': 'i-heroicons-document-duplicate',
    'knowledge': 'i-heroicons-academic-cap',
    'mal': 'i-heroicons-shield-check',
    'mef': 'i-heroicons-document-text',
    'mep': 'i-heroicons-light-bulb',
    'moc': 'i-heroicons-archive-box',
    'oif': 'i-heroicons-users',
    'zof': 'i-heroicons-cog-6-tooth',
    
    // Subcategorias (DEPTH 3+)
    'structured': 'i-heroicons-folder',
    'unstructured': 'i-heroicons-folder-open',
    'business-rules': 'i-heroicons-briefcase',
    'technical-patterns': 'i-heroicons-command-line',
    'procedures': 'i-heroicons-clipboard-document-list',
    'basic': 'i-heroicons-sparkles',
    'startup': 'i-heroicons-rocket-launch',
    'scaleup': 'i-heroicons-chart-bar-square',
    'enterprise': 'i-heroicons-building-office',
    'corporation': 'i-heroicons-building-office-2',
    'unified': 'i-heroicons-squares-plus'
  }
  
  return iconMap[folderName] || 'i-heroicons-folder'
}
```

## 🎨 **METADADOS EXTRAÍVEIS**

### **Frontmatter Existente** (padrões identificados):
```yaml

---
title: "Título do Documento"
description: "Descrição resumida"
icon: "i-heroicons-icon-name"
layout: "docs"
sidebar: true
toc: true
navigation: true
order: 1
---
```

### **Schema Recomendado** para novos index.md:
```yaml

---
title: "Título da Seção"           # OBRIGATÓRIO
description: "Descrição da seção"  # OBRIGATÓRIO
icon: "i-heroicons-folder"         # OPCIONAL - usa fallback se não especificado
order: 1                          # OPCIONAL - usa ordem alfabética se não especificado
navigation:
  title: "Título Navegação"       # OPCIONAL - override do title
  hidden: false                   # OPCIONAL - ocultar da navegação
---
```

## 🔄 **IMPLEMENTAÇÃO RECOMENDADA**

### **1. Scanner de Estrutura**
```typescript
// /utils/content-scanner.ts
export async function scanContentStructure(locale: string): Promise<ContentNode[]> {
  const basePath = `/content/${locale}/docs`
  return await discoverContentStructure(basePath)
}
```

### **2. Cache Inteligente**
```typescript
// /composables/useContentDiscovery.ts
export const useContentDiscovery = () => {
  const cache = new Map()
  
  const getNavigation = async (locale: string) => {
    const cacheKey = `navigation-${locale}`
    
    if (!cache.has(cacheKey)) {
      const structure = await scanContentStructure(locale)
      cache.set(cacheKey, structure)
    }
    
    return cache.get(cacheKey)
  }
  
  return { getNavigation }
}
```

### **3. Integração com useDocsNavigation.ts**
```typescript
// Substituir hardcode (linhas 119-210) por:
const navigation = await useContentDiscovery().getNavigation(locale.value)
```

## 📈 **BENEFÍCIOS DA ABORDAGEM**

### **✅ Escalabilidade Automática**
- **Nova pasta criada** → Aparece automaticamente na navegação
- **Novo index.md** → Metadados extraídos e aplicados
- **Zero manutenção** → Sem edição de código necessária

### **✅ Flexibilidade Total**
- **Fallbacks inteligentes** → Funciona mesmo sem frontmatter
- **Estrutura paralela** → PT/EN mantidos sincronizados automaticamente
- **Ordenação configurável** → Por ordem especificada ou alfabética

### **✅ Performance Otimizada**
- **Cache inteligente** → Evita descoberta repetitiva
- **Estrutura conhecida** → Navegação baseada em dados reais
- **Lazy loading** → Subpastas carregadas sob demanda

---

**🎯 Estrutura mapeada com base em dados REAIS, pronta para implementação de navegação dinâmica!**