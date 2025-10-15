# 📋 TEMPLATE PADRÃO PARA INDEX.MD

## 🎯 **OBJETIVO**
Template padronizado para criação dos 20 arquivos index.md faltantes, garantindo consistência na navegação dinâmica e conformidade com o schema de frontmatter identificado na TASK 1.1.3.

## 📝 **TEMPLATE MASTER**

### **Template Base Completo**
```markdown
---
title: "{{TITULO_GERADO}}"
description: "{{DESCRICAO_GERADA}}"
icon: "{{ICONE_POR_CATEGORIA}}"
layout: "docs"
sidebar: true
toc: true
navigation: true
---

# {{TITULO_GERADO}}

{{DESCRICAO_EXPANDIDA}}

## 📋 Conteúdo desta Seção

{{LISTA_CONTEUDO_AUTOMATICA}}

## 🎯 Como Navegar

{{INSTRUCOES_NAVEGACAO}}

## 📖 Recursos Relacionados

{{LINKS_RELACIONADOS}}

---

> 💡 **Dica**: {{DICA_CONTEXTUAL}}
```

## 🔧 **REGRAS DE GERAÇÃO AUTOMÁTICA**

### **1. Geração de Título (`{{TITULO_GERADO}}`)**

#### **Baseado no Path da Pasta:**
```javascript
// Algoritmo de geração de título
function gerarTitulo(path) {
  const pathSegments = path.split('/');
  const pastaAtual = pathSegments[pathSegments.length - 1];
  
  const mapeamentoTitulos = {
    // TEMPLATES
    'basic': 'Templates Básicos',
    'corporation': 'Templates Corporativos', 
    'enterprise': 'Templates Enterprise',
    'scaleup': 'Templates Scaleup',
    'startup': 'Templates Startup',
    'unified': 'Templates Unificados',
    
    // EXAMPLES/KNOWLEDGE
    'business-rules': 'Regras de Negócio MEF',
    'procedures': 'Procedimentos MEF', 
    'technical-patterns': 'Padrões Técnicos MEF',
    'structured': 'Conhecimento Estruturado MEF',
    'unstructured': 'Conhecimento Não Estruturado',
    'knowledge': 'Exemplos de Conhecimento',
    'examples': 'Exemplos Práticos',
    
    // FRAMEWORKS
    'frameworks': 'Frameworks Matrix Protocol',
    
    // QUICKSTART  
    'templates': 'Templates de Início Rápido'
  };
  
  return mapeamentoTitulos[pastaAtual] || capitalizeWords(pastaAtual);
}
```

### **2. Geração de Descrição (`{{DESCRICAO_GERADA}}`)**

#### **Por Categoria de Pasta:**
```javascript
function gerarDescricao(path, titulo) {
  if (path.includes('templates/basic')) {
    return "Templates essenciais para implementação inicial do Matrix Protocol em organizações pequenas e médias";
  }
  if (path.includes('templates/corporation')) {
    return "Templates específicos para grandes corporações com estruturas complexas e múltiplas divisões";
  }
  if (path.includes('templates/enterprise')) {
    return "Templates Enterprise para organizações com requisitos avançados de governança e compliance";
  }
  if (path.includes('templates/scaleup')) {
    return "Templates otimizados para empresas em crescimento rápido com necessidades escaláveis";
  }
  if (path.includes('templates/startup')) {
    return "Templates ágeis para startups com estruturas enxutas e processos simplificados";
  }
  if (path.includes('templates/unified')) {
    return "Templates unificados combinando múltiplas abordagens para máxima flexibilidade";
  }
  if (path.includes('business-rules')) {
    return "UKIs estruturados contendo as regras fundamentais de negócio seguindo especificação MEF v1.0.0";
  }
  if (path.includes('procedures')) {
    return "UKIs estruturados documentando processos operacionais e procedimentos organizacionais";
  }
  if (path.includes('technical-patterns')) {
    return "UKIs estruturados definindo padrões técnicos de implementação e arquitetura";
  }
  if (path.includes('structured')) {
    return "Demonstração completa de conhecimento organizado segundo especificação MEF v1.0.0";
  }
  if (path.includes('unstructured')) {
    return "Exemplos de conhecimento caótico para comparação com versões estruturadas MEF";
  }
  if (path.includes('quickstart/templates')) {
    return "Templates prontos para uso imediato do Matrix Protocol em diferentes cenários";
  }
  if (path.includes('examples/knowledge')) {
    return "Demonstração prática da transformação de conhecimento caótico em estruturas MEF organizadas";
  }
  if (path.includes('frameworks')) {
    return "Visão geral completa dos 5 frameworks que compõem o Matrix Protocol";
  }
  
  // Fallback genérico
  return `Documentação organizada de ${titulo.toLowerCase()} do Matrix Protocol`;
}
```

### **3. Mapeamento de Ícones (`{{ICONE_POR_CATEGORIA}}`)**

#### **Sistema Hierárquico de Ícones:**
```javascript
function obterIcone(path) {
  // TEMPLATES (por porte organizacional)
  if (path.includes('templates/basic')) return 'i-heroicons-building-storefront';
  if (path.includes('templates/corporation')) return 'i-heroicons-building-office-2';
  if (path.includes('templates/enterprise')) return 'i-heroicons-building-office';
  if (path.includes('templates/scaleup')) return 'i-heroicons-chart-bar-square';
  if (path.includes('templates/startup')) return 'i-heroicons-rocket-launch';
  if (path.includes('templates/unified')) return 'i-heroicons-squares-plus';
  
  // QUICKSTART
  if (path.includes('quickstart/templates')) return 'i-heroicons-document-duplicate';
  
  // EXAMPLES (por tipo de conhecimento)
  if (path.includes('business-rules')) return 'i-heroicons-building-office';
  if (path.includes('procedures')) return 'i-heroicons-clipboard-document-list';
  if (path.includes('technical-patterns')) return 'i-heroicons-cog-6-tooth';
  if (path.includes('structured')) return 'i-heroicons-squares-2x2';
  if (path.includes('unstructured')) return 'i-heroicons-document-minus';
  if (path.includes('examples/knowledge')) return 'i-heroicons-light-bulb';
  
  // FRAMEWORKS
  if (path.includes('frameworks')) return 'i-heroicons-cube';
  
  // Fallback
  return 'i-heroicons-document';
}
```

## 📋 **TEMPLATES ESPECÍFICOS POR CATEGORIA**

### **1. Template para Templates Organizacionais (`/manual/templates/*/index.md`)**

```markdown
---
title: "Templates {{PORTE}}"
description: "{{DESCRICAO_ESPECIFICA_PORTE}}"
icon: "{{ICONE_PORTE}}"
layout: "docs"
sidebar: true
toc: true
navigation: true
---

# Templates {{PORTE}}

{{DESCRICAO_ESPECIFICA_PORTE_EXPANDIDA}}

## 📋 Templates Disponíveis

Esta seção contém templates específicos para organizações {{TIPO_ORGANIZACAO}}, incluindo:

### 🏗️ Estruturas MOC
- **MOC Base** - Ontologia organizacional fundamental
- **Hierarquias Customizadas** - Adaptadas ao porte {{PORTE}}
- **Políticas de Governança** - Regras específicas de autoridade

### 📝 Templates UKI
- **Business Rules** - Regras de negócio padrão
- **Technical Patterns** - Padrões técnicos recomendados  
- **Procedures** - Processos operacionais essenciais

### 🚀 Guias de Implementação
- **Roadmap Detalhado** - Fases de implementação específicas
- **Checklists de Validação** - Verificações por etapa
- **Métricas de Sucesso** - KPIs para acompanhamento

## 🎯 Características {{PORTE}}

{{CARACTERISTICAS_ESPECIFICAS}}

## 🛠️ Como Utilizar

1. **Baixe o template** adequado à sua organização
2. **Customize as hierarquias** conforme seu contexto
3. **Adapte as políticas** às suas necessidades de governança
4. **Implemente gradualmente** seguindo o roadmap sugerido

## 📖 Recursos Relacionados

- [Guia de Implementação Geral](../../index.md)
- [Outros Templates](../index.md)
- [Exemplos Organizacionais](../../../examples)
- [Ferramentas de Validação](../../tools)

---

> 💡 **Dica**: {{DICA_ESPECIFICA_PORTE}}
```

### **2. Template para Examples/Knowledge (`/examples/knowledge/*/index.md`)**

```markdown
---
title: "{{TITULO_CONHECIMENTO}}"
description: "{{DESCRICAO_CONHECIMENTO}}"
icon: "{{ICONE_CONHECIMENTO}}"
layout: "docs"
sidebar: true
toc: true
navigation: true
---

# {{TITULO_CONHECIMENTO}}

{{DESCRICAO_EXPANDIDA_CONHECIMENTO}}

## 📊 Visão Geral da Organização

### {{TIPO_ORGANIZACAO_CONHECIMENTO}}

{{DETALHES_ORGANIZACAO}}

## 📋 Estrutura do Conteúdo

{{LISTA_UKIS_OU_DOCUMENTOS}}

## 🔗 Relacionamentos

{{RELACIONAMENTOS_IDENTIFICADOS}}

## ✅ Benefícios Demonstrados

{{BENEFICIOS_ESPECIFICOS}}

## 🎯 Como Navegar

{{INSTRUCOES_NAVEGACAO_ESPECIFICAS}}

## 📖 Recursos Relacionados

{{LINKS_RELACIONADOS_ESPECIFICOS}}

---

> 💡 **Dica**: {{DICA_ESPECIFICA_CONHECIMENTO}}
```

### **3. Template para Quickstart (`/quickstart/templates/index.md`)**

```markdown
---
title: "Templates de Início Rápido"
description: "Templates prontos para uso imediato do Matrix Protocol em diferentes cenários"
icon: "i-heroicons-document-duplicate"
layout: "docs"
sidebar: true
toc: true
navigation: true
---

# Templates de Início Rápido

Templates prontos para implementação imediata do Matrix Protocol, organizados por cenário de uso e porte organizacional.

## 🚀 Templates Disponíveis

### Por Porte Organizacional
- **[Startup](../../manual/templates/startup)** - Estruturas ágeis e simplificadas
- **[Scaleup](../../manual/templates/scaleup)** - Templates escaláveis para crescimento
- **[Corporation](../../manual/templates/corporation)** - Estruturas corporativas complexas
- **[Enterprise](../../manual/templates/enterprise)** - Governança avançada e compliance

### Templates Especializados
- **[Basic](../../manual/templates/basic)** - Implementação essencial
- **[Unified](../../manual/templates/unified)** - Abordagem híbrida

## 🎯 Como Escolher o Template Ideal

1. **Avalie o porte** da sua organização
2. **Identifique necessidades** de governança
3. **Considere recursos** disponíveis
4. **Selecione o template** mais adequado

## 📋 Próximos Passos

1. **[Escolha seu template](../../manual/templates)**
2. **[Configure a estrutura](../../manual)**
3. **[Implemente gradualmente](../../implementation)**
4. **[Valide os resultados](../../manual/tools)**

## 📖 Recursos Relacionados

- [Manual de Implementação](../../manual)
- [Exemplos Práticos](../../examples)
- [Ferramentas de Validação](../../manual/tools)

---

> 💡 **Dica**: Comece sempre com o template Basic e evolua conforme sua organização amadurecer na implementação do Matrix Protocol.
```

## 🎯 **DADOS DE PERSONALIZAÇÃO POR PORTE**

### **Características por Porte Organizacional:**

```javascript
const caracteristicasPorPorte = {
  basic: {
    tipo_organizacao: "pequenas e médias empresas",
    caracteristicas: [
      "Estrutura organizacional simples",
      "Poucos níveis hierárquicos", 
      "Processos padronizados essenciais",
      "Implementação rápida e direta"
    ],
    dica: "Ideal para quem está começando com Matrix Protocol. Foque na estrutura básica antes de expandir."
  },
  
  startup: {
    tipo_organizacao: "startups e empresas nascentes",
    caracteristicas: [
      "Máxima agilidade e flexibilidade",
      "Estruturas enxutas e adaptáveis",
      "Processos mínimos viáveis",
      "Escalabilidade futura planejada"
    ],
    dica: "Mantenha a simplicidade. O template permite crescer sem refatoração completa."
  },
  
  scaleup: {
    tipo_organizacao: "empresas em crescimento acelerado",
    caracteristicas: [
      "Estruturas escaláveis e flexíveis", 
      "Governança em evolução",
      "Processos que crescem com a organização",
      "Preparação para complexidade futura"
    ],
    dica: "Implemente gradualmente conforme o crescimento. Este template se adapta ao seu ritmo."
  },
  
  corporation: {
    tipo_organizacao: "grandes corporações estabelecidas",
    caracteristicas: [
      "Múltiplas divisões e departamentos",
      "Hierarquias complexas bem definidas",
      "Processos formalizados e documentados", 
      "Governança robusta e auditável"
    ],
    dica: "Use a governança avançada para gerenciar complexidade. Implemente por divisões."
  },
  
  enterprise: {
    tipo_organizacao: "organizações enterprise com requisitos avançados",
    caracteristicas: [
      "Compliance rigoroso e auditoria completa",
      "Segurança avançada e controle granular",
      "Integração com sistemas corporativos",
      "Governança multi-nível e federada"
    ],
    dica: "Aproveite recursos avançados de auditoria e compliance. Considere implementação federada."
  },
  
  unified: {
    tipo_organizacao: "organizações híbridas com necessidades mistas",
    caracteristicas: [
      "Combinação de abordagens diferentes",
      "Flexibilidade máxima de configuração",
      "Suporte a múltiplos cenários de uso",
      "Adaptabilidade a contextos diversos"
    ],
    dica: "Customize livremente combinando elementos de outros templates conforme necessário."
  }
};
```

## 📋 **INSTRUÇÕES DE USO**

### **Para Marina (MILESTONE 1.2):**

1. **Copie o template** adequado à pasta que está criando
2. **Substitua as variáveis** `{{VARIAVEL}}` usando as regras de geração
3. **Valide o ícone** usando o mapeamento hierárquico
4. **Teste a navegação** após criação

### **Para Bruno (Criação de Exemplos):**

1. **Use este template** para criar `/content/pt/docs/manual/templates/basic/index.md` 
2. **Aplique as regras** de geração para basic
3. **Valide a consistência** com arquivos existentes
4. **Documente qualquer ajuste** necessário

### **Para QA (Camila):**

Validar que todos os arquivos gerados seguem:
- ✅ Frontmatter completo com todos os campos obrigatórios
- ✅ Ícone consistente com categoria
- ✅ Descrição entre 50-150 caracteres
- ✅ Navegação funcional e hierárquica

## 🔧 **FERRAMENTAS DE AUTOMAÇÃO**

### **Script de Geração Rápida:**
```bash
# Uso: ./generate-index.sh [caminho_completo] [idioma]
# Exemplo: ./generate-index.sh "content/pt/docs/manual/templates/basic" "pt"

#!/bin/bash
CAMINHO=$1
IDIOMA=$2
PASTA=$(basename "$CAMINHO")

# Gera arquivo index.md automaticamente usando as regras do template
echo "Gerando index.md para: $PASTA"
# [lógica de geração baseada nas regras acima]
```

## ✅ **SUCCESS CRITERIA**

- ✅ **Template Master** criado e documentado
- ✅ **Regras de geração** automática especificadas  
- ✅ **3 templates específicos** por categoria principal
- ✅ **Mapeamento completo** de ícones e títulos
- ✅ **Instruções claras** para Marina e Bruno
- ✅ **Critérios de validação** para QA

---

**🎯 Template pronto para uso! Marina pode começar MILESTONE 1.2 imediatamente.**

---

**👤 Executado por**: Bruno Oliveira  
**🎯 Especialização**: Content Specialist + Template Design  
**📅 Concluído em**: 15 de outubro de 2025  
**⏱️ Status**: ✅ COMPLETED  
**🔄 Próximo**: MILESTONE 1.2 (Marina - Criação dos 20 arquivos)