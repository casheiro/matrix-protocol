---
title: Especificações Canônicas YAML
description: Schemas YAML normativos para implementação dos frameworks Matrix Protocol
keywords:
  - Matrix Protocol
  - especificações canônicas
  - schemas YAML
  - MEF
  - MOC
  - ZOF
  - OIF
  - MAL
  - implementação
  - padronização
icon: i-heroicons-document-text
layout: docs
sidebar: true
toc: true
navigation: true
lang: pt
last_updated: 2025-10-31T00:00:00.000Z
order: 10
---

# Especificações Canônicas YAML

Esta seção contém as **especificações canônicas normativas** em formato YAML para implementação dos frameworks Matrix Protocol. Estas especificações são obrigatórias para garantir interoperabilidade e conformidade com o protocolo.

## 📋 Frameworks Especificados

### MEF (Matrix Embedding Framework)
- **[Schema UKI](./mef/)** - Especificação canônica para Units of Knowledge Interlinked
- **[Schema Decision Record](./mef/)** - Especificação para registros de decisão MAL

### MOC (Matrix Ontology Catalog)  
- **[Schema Hierarquias](./moc/)** - Especificação para hierarquias organizacionais
- **[Schema Critérios](./moc/)** - Especificação para critérios de avaliação
- **[Schema Políticas](./moc/)** - Especificação para políticas de arbitragem

### ZOF (Zion Orchestration Framework)
- **[Schema Workflows](./zof/)** - Especificação para definição de workflows
- **[Schema Transições](./zof/)** - Especificação para transições de estado
- **[Schema Avaliação](./zof/)** - Especificação para checkpoint EvaluateForEnrich

### OIF (Operator Intelligence Framework)
- **[Schema Arquétipos](./oif/)** - Especificação para definição de arquétipos
- **[Schema Explicações](./oif/)** - Especificação para templates de explicação

### MAL (Matrix Arbiter Layer)
- **[Schema Eventos](./mal/)** - Especificação para eventos de arbitragem
- **[Schema Decisões](./mal/)** - Especificação para registros de decisão

## 🎯 Propósito das Especificações

### Padronização
Garantem formato comum e consistente para implementações do Matrix Protocol em diferentes organizações e tecnologias.

### Interoperabilidade  
Permitem que sistemas implementados independentemente se comuniquem e compartilhem dados estruturados.

### Validação
Facilitam validação automática de conformidade com o protocolo através de schemas estruturados.

### Governança
Estabelecem referência autoritativa para resolução de ambiguidades de implementação.


## 🔧 Uso das Especificações

### Para Implementadores
1. Use os schemas como referência para estruturas de dados
2. Valide suas implementações contra os schemas fornecidos
3. Consulte a documentação de cada framework para contexto

### Para Validação
```yaml
# Exemplo de validação usando jsonschema (Python)
import yaml
import jsonschema

# Carregar schema e dados
schema = yaml.safe_load(open('mef-uki-schema.yaml'))
data = yaml.safe_load(open('minha-uki.yaml'))

# Validar
jsonschema.validate(data, schema)
```

### Para Organizações
- Adapte os campos `*_ref` conforme sua configuração MOC
- Mantenha conformidade com campos obrigatórios
- Estenda com campos organizacionais específicos quando permitido

## ⚖️ Status Normativo

> ⚠️ **IMPORTANTE**: Estas especificações são **normativas**.

- **DEVE**: Campos marcados como obrigatórios devem ser implementados
- **PODE**: Campos opcionais podem ser implementados conforme necessidade
- **NÃO DEVE**: Violações dos schemas não são permitidas

## 🔄 Versionamento

As especificações seguem versionamento semântico:
- **MAJOR**: Mudanças incompatíveis na estrutura
- **MINOR**: Adições compatíveis
- **PATCH**: Correções e clarificações

## 📖 Recursos Relacionados

### Matrix Protocol Frameworks
- **[MEF - Matrix Embedding Framework](../mef)** - Conhecimento estruturado
- **[MOC - Matrix Ontology Catalog](../moc)** - Taxonomias organizacionais
- **[ZOF - Zion Orchestration Framework](../zof)** - Orquestração de workflows
- **[OIF - Operator Intelligence Framework](../oif)** - Arquétipos de inteligência
- **[MAL - Matrix Arbiter Layer](../mal)** - Arbitragem de conflitos

### Documentação Técnica
- **[Guia de Implementação](/docs/implementation)** - Como implementar o protocolo
- **[Exemplos Práticos](/docs/examples)** - Casos de uso e templates
- **[Glossário](/docs/glossary)** - Definições e terminologia