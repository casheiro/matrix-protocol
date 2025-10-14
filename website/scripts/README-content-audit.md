# 📋 Script de Auditoria de Conteúdo

## 🎯 Objetivo

Este script faz parte da **TASK 1.1.1** do projeto de Navegação Dinâmica, executando uma auditoria completa da estrutura de conteúdo do Matrix Protocol Website para suportar a descoberta automática de navegação.

## 🛠️ Funcionalidades

### 📊 Análises Realizadas

1. **Mapeamento Estrutural**
   - Mapeia recursivamente `/content/pt/docs` e `/content/en/docs`
   - Identifica hierarquia de pastas e arquivos
   - Conta total de arquivos e pastas

2. **Análise de Frontmatter**
   - Extrai metadados de todos os arquivos `.md`
   - Identifica padrões e inconsistências
   - Lista campos disponíveis e suas frequências

3. **Detecção de Arquivos Faltantes**
   - Identifica pastas sem `index.md`
   - Essencial para navegação dinâmica

4. **Estatísticas por Extensão**
   - Conta arquivos por tipo (.md, .yaml, etc.)
   - Calcula tamanhos totais
   - Lista arquivos de cada tipo

5. **Análise de Profundidade**
   - Distribui conteúdo por nível hierárquico
   - Identifica estruturas muito profundas

6. **Comparação entre Idiomas**
   - Compara estruturas PT vs EN
   - Identifica diferenças e inconsistências

## 🚀 Como Usar

### Execução Simples
```bash
node scripts/content-audit.js
```

### Execução com NPM
```bash
npm run audit:content  # Se configurado no package.json
```

## 📋 Saídas Geradas

### 1. Console Output
Exibe resumo em tempo real:
- Total de arquivos e pastas
- Arquivos index.md faltantes  
- Campos de frontmatter encontrados
- Recomendações prioritárias

### 2. Relatórios JSON

#### `/docs/dynamic-navigation/audit-reports/content-audit-latest.json`
Relatório mais recente, sempre atualizado.

#### `/docs/dynamic-navigation/audit-reports/content-audit-[timestamp].json`
Relatórios históricos com timestamp para comparação.

## 📊 Estrutura do Relatório

```javascript
{
  "totalFiles": 125,
  "totalFolders": 48,
  "structure": [
    {
      "name": "docs",
      "fullPath": "/path/to/docs",
      "relativePath": "pt/docs", 
      "depth": 0,
      "files": [/* lista de arquivos */],
      "subfolders": [/* subpastas recursivas */],
      "hasIndexFile": true,
      "metadata": {/* frontmatter do index.md */},
      "fileCount": 10,
      "mdCount": 8,
      "yamlCount": 2
    }
  ],
  "missingIndexFiles": [
    "pt/docs/manual/templates/basic",
    "en/docs/manual"
    // ... outras pastas sem index.md
  ],
  "frontmatterPatterns": {
    "title": {
      "field": "title",
      "values": ["Docs", "Framework", /* ... */],
      "frequency": 59,
      "locations": [/* arquivos que usam */]
    }
  },
  "filesByExtension": {
    ".md": { "count": 59, "totalSize": 123456 },
    ".yaml": { "count": 50, "totalSize": 67890 }
  },
  "depthAnalysis": {
    "0": { "folders": 2, "files": 8 },
    "1": { "folders": 12, "files": 25 }
  },
  "localeComparison": {
    "commonPaths": [/* caminhos em ambos idiomas */],
    "ptOnly": [/* apenas em PT */],
    "enOnly": [/* apenas em EN */]
  },
  "recommendations": [
    {
      "priority": "HIGH",
      "category": "Structure", 
      "title": "Adicionar arquivos index.md faltantes",
      "description": "20 pastas não possuem arquivo index.md",
      "action": "Criar arquivos index.md nas pastas listadas"
    }
  ]
}
```

## 🎯 Uso para Navegação Dinâmica

### Dados Essenciais para Discovery

1. **Estrutura Hierárquica** → Geração automática de navegação
2. **Metadados Frontmatter** → Títulos, ícones, ordenação
3. **Arquivos Index Faltantes** → Criar para completude
4. **Padrões de Nomeação** → Algoritmos de fallback

### Próximos Passos

1. ✅ **TASK 1.1.1** - Script de auditoria (CONCLUÍDA)
2. 🔄 **TASK 1.1.2** - Mapear estrutura de diretórios
3. 🔄 **TASK 1.1.3** - Extrair e catalogar frontmatter
4. 🔄 **TASK 1.1.4** - Gerar relatório de inconsistências

## ⚠️ Observações Importantes

### Dependências
- **Node.js** 16+ (ESM modules)
- **Acesso ao filesystem** para leitura de `/content`

### Limitações
- Parser YAML simples (funciona para frontmatter básico)
- Não valida sintaxe YAML complexa
- Foca em metadados essenciais para navegação

### Performance
- Processa ~125 arquivos em < 1 segundo
- Usa análise síncrona (adequado para escopo atual)
- Otimizado para estruturas de documentação

## 🔧 Manutenção

### Adicionando Novos Idiomas
Edite a constante `SUPPORTED_LOCALES` no script:
```javascript
const SUPPORTED_LOCALES = ['pt', 'en', 'es'] // Adicionar espanhol
```

### Modificando Análises
As funções são modulares:
- `extractFrontmatter()` - Personalizar parsing
- `analyzeFrontmatterPatterns()` - Adicionar validações
- `generateRecommendations()` - Ajustar critérios

## 📝 Logs de Execução

O script gera logs detalhados:
- ✅ Sucesso na análise de cada locale
- ⚠️ Avisos para diretórios não encontrados
- ❌ Erros de leitura com contexto
- 📊 Métricas de progresso

---

**Desenvolvido por**: Ricardo Lima (Nuxt Specialist)  
**Task**: TASK 1.1.1 - Criar Script de Auditoria  
**Framework**: Navegação Dinâmica - Matrix Protocol