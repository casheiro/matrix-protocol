---
title: Especificações MEF - Matrix Embedding Framework
description: Schemas YAML canônicos para UKIs e Decision Records do Matrix Embedding Framework
keywords:
  - MEF
  - Matrix Embedding Framework
  - UKI
  - Units of Knowledge Interlinked
  - Decision Record
  - schemas YAML
  - especificação canônica
framework: MEF
icon: i-heroicons-cube
layout: docs
sidebar: true
toc: true
navigation: true
lang: pt
last_updated: 2025-10-31T00:00:00.000Z
order: 1
---

# Especificações MEF - Matrix Embedding Framework

Esta seção contém as especificações canônicas normativas para o **Matrix Embedding Framework (MEF)**, definindo schemas YAML para estruturação de conhecimento embebido versionado.

## 📋 Schemas Disponíveis

### 1. MEF UKI Schema
**Arquivo:** `mef-uki-schema.yaml`  
**Versão:** 1.0.0  
**Propósito:** Especificação canônica para Units of Knowledge Interlinked (UKIs)

<YamlViewer file-path="/content/pt/docs/frameworks/specifications/mef/mef-uki-schema.yaml" />

#### Campos Obrigatórios
- **Metadados:** `schema`, `id`, `title`, `version`
- **Referências MOC:** `scope_ref`, `domain_ref`, `type_ref`, `maturity_ref`
- **Controle de Vida:** `created_date`, `last_modified`, `status`
- **Conteúdo:** `content`

#### Campos Opcionais
- **Versionamento:** `change_summary`, `change_impact`, `previous_version`
- **Relacionamentos:** `relationships` (conexões tipadas com outras UKIs)
- **Exemplos:** `examples`, `validations`
- **Governança:** `governance`, `arbitration_metadata`

### 2. MEF Decision Record Schema
**Arquivo:** `mef-decision-record-schema.yaml`  
**Versão:** 1.0.0  
**Propósito:** Especificação para persistência de Decision Records MAL no MEF

<YamlViewer file-path="/content/pt/docs/frameworks/specifications/mef/mef-decision-record-schema.yaml" />

#### Campos Obrigatórios
- **Identificação:** `decision_id`, `event_ref`
- **Resultado:** `outcome`, `precedence_applied`
- **Justificativa:** `epistemic_rationale`
- **Auditoria:** `audit`, `mef_metadata`

#### Integração MAL
- Persiste decisões de arbitragem como trilha imutável
- Mantém referências completas para rastreabilidade
- Suporta justificativas epistêmicas alinhadas ao MEP

## 🎯 Uso das Especificações

### Para Implementadores

#### Estrutura Básica de UKI
```yaml
# Exemplo mínimo conforme schema
schema: "1.0"
id: uki:minha-equipe:guideline:exemplo-001
title: "Guideline de Exemplo para Demonstração"
version: "1.0.0"

scope_ref: minha-equipe
domain_ref: technical
type_ref: guideline
maturity_ref: draft

created_date: 2025-10-31
last_modified: 2025-10-31
status: active

content: |
  ## Guideline de Exemplo
  
  Esta é uma guideline de exemplo que demonstra
  a estrutura mínima de uma UKI conforme o schema MEF.
  
  ### Aplicação
  - Usar em contextos de demonstração
  - Validar estrutura contra schema
  
relationships: []
```

#### Validação com Schema
```python
# Python com jsonschema
import yaml
import jsonschema

# Carregar schema e UKI
schema = yaml.safe_load(open('mef-uki-schema.yaml'))
uki = yaml.safe_load(open('minha-uki.yaml'))

# Validar
try:
    jsonschema.validate(uki, schema)
    print("UKI válida!")
except jsonschema.ValidationError as e:
    print(f"Erro de validação: {e.message}")
```

### Para Organizações

#### Adaptação de Campos MOC
```yaml
# Configure conforme seu MOC organizacional
scope_ref: sua-equipe        # Definido no MOC
domain_ref: seu-dominio      # Definido no MOC  
type_ref: seu_tipo          # Definido no MOC
maturity_ref: seu_nivel     # Definido no MOC
```

#### Relacionamentos Entre UKIs
```yaml
relationships:
  - type: depends_on
    target: uki:outra-equipe:pattern:base-001
    description: "Depende do padrão base para funcionamento"
    
  - type: overrides
    target: uki:minha-equipe:guideline:antiga-001
    description: "Substitui guideline anterior por nova abordagem"
```


## ✅ Validação e Conformidade

### Regras de Validação
1. **ID Format:** Deve seguir padrão `uki:[scope_ref]:[type_ref]:[slug]`
2. **Versionamento:** Deve usar versionamento semântico
3. **Referências MOC:** Todos os campos `*_ref` devem referenciar nós válidos
4. **Relacionamentos:** Devem usar tipos padronizados e referenciar UKIs válidas

### Validação Condicional
- Versões > 1.0.0 requerem `change_summary` e `change_impact`
- Status `deprecated` requer `change_summary` mencionando depreciação
- UKIs com `arbitration_metadata` devem ter `decision_record_ref`

## 🔗 Integração com Outros Frameworks

### MOC (Matrix Ontology Catalog)
- Campos `*_ref` referenciam nós definidos no MOC
- Hierarquias organizacionais configuráveis
- Validação de autoridade através do MOC

### ZOF (Zion Orchestration Framework)  
- UKIs são consultadas durante workflows ZOF
- Checkpoint EvaluateForEnrich usa critérios MEF
- Enriquecimento condicional do Oracle

### MAL (Matrix Arbiter Layer)
- Decision Records persistidos no MEF
- Relacionamentos de conflito registrados
- Trilha de auditoria imutável

### OIF (Operator Intelligence Framework)
- Knowledge Agents consomem UKIs estruturadas
- Filtragem baseada em hierarquias MOC
- Explicações referenciam UKIs específicas

## 📖 Recursos Relacionados

### Matrix Protocol Frameworks
- **[MEF - Matrix Embedding Framework](../../mef)** - Documentação completa do framework
- **[Especificações Canônicas](../)** - Todos os schemas do protocolo
- **[Exemplos Práticos](/docs/examples)** - Casos de uso e templates

### Documentação Técnica
- **[Guia de Implementação](/docs/implementation)** - Como implementar o protocolo
- **[Glossário](/docs/glossary)** - Definições e terminologia
- **[Manual de Ferramentas](/docs/manual)** - Ferramentas de apoio