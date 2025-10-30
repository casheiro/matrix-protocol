---
title: MEF — Matrix Embedding Framework
description: Framework for versioned knowledge structuring through UKIs (Units of Knowledge Interlinked) in Matrix Protocol
keywords:
  - MEF
  - Matrix Protocol
  - knowledge structuring
  - UKI
  - versioning
  - embedding
  - Units of Knowledge Interlinked
framework: MEF
icon: i-heroicons-cube
layout: docs
sidebar: true
toc: true
navigation: true
lang: en
last_updated: 2025-10-21T00:00:00.000Z
order: 1
---
# MEF — Matrix Embedding Framework
**Acronym:** MEF  
**Version:** 0.0.1-beta  
**Last Update:** 2025-10-05  

> ⚠️ **IMPORTANT**: This document is an informative translation.

---

## 1. Introduction

The **Matrix Embedding Framework (MEF)** comprehensively, standardized and internationally specifies the minimum and complete structure of versioned embedded knowledge to be used by people and intelligent agents in the context of Matrix Protocol.

MEF defines a **standardized model for structuring versioned knowledge** that allows any member of a multidisciplinary team to create, register, interconnect and use minimum knowledge units — called **UKIs (Units of Knowledge Interlinked)**.

---

## 2. Terms and Definitions

- **UKI**: Units of Knowledge Interlinked - basic units of structured knowledge
- **Semantic Versioning**: Version control following MAJOR.MINOR.PATCH standard
- **Ontological Relationships**: Typed connections between UKIs (depends_on, overrides, etc.)
- **Knowledge Promotion**: Formal process for scope or maturity elevation
- **Fields *_ref**: Fields that reference nodes defined in organizational MOC

---

## 3. Core Concepts

### UKI Structure
Each UKI is a structured YAML file containing:
- **Mandatory metadata**: id, title, version, dates
- **MOC references**: scope_ref, domain_ref, type_ref, maturity_ref
- **Content**: Specific structured knowledge
- **Relationships**: Typed connections with other UKIs
- **Lifecycle control**: Status and lifecycle management

### MOC Integration
- **Fields *_ref**: Reference nodes defined in organizational MOC
- **Local Flexibility**: Organizations configure hierarchies maintaining universal structure
- **Integrated Governance**: MOC defines authority and visibility rules

### MEP Orientation
- **Stratification**: maturity_ref field reflects epistemological levels
- **Responsible Promotion**: promotion_rationale field documents justifications
- **Derived Authority**: scope_ref and governance_ref fields implement contextual authority

---

## 4. Normative Rules

> ⚠️ This section is **normative**.

### Mandatory UKI Structure
Every UKI MUST contain:
- **id**: Unique identifier in format uki:[scope_ref]:[type_ref]:[slug]
- **title**: Descriptive and objective title
- **version**: Semantic versioning MAJOR.MINOR.PATCH
- **scope_ref, domain_ref, type_ref**: Valid references to organizational MOC
- **created_date, last_modified**: Creation and modification dates
- **status**: Lifecycle state (active, deprecated, archived)

### Mandatory Versioning
- MUST follow semantic MAJOR.MINOR.PATCH standard
- MUST include change_summary for versions after initial
- MUST reference previous_version when applicable
- MUST classify change_impact (major, minor, patch)

### Mandatory Relationships
- DEVE usar tipos padronizados: depends_on, overrides, conflicts_with, complements, amends, precedes, equivalent_to
- DEVE incluir description específica para cada relacionamento
- DEVE referenciar UKIs válidas no formato correto

### Persistência de Decision Record (Integração MAL)
- Implementações MEF DEVEM persistir Decision Records MAL como trilha de auditoria imutável
- Decision Records DEVEM ser armazenados com metadados completos de arbitragem
- UKIs resultantes de arbitragem MAL DEVEM referenciar o Decision Record correspondente
- Relacionamentos de Decision Record (conflicts_with, supersedes, partitioned_by_scope) DEVEM ser mantidos
- Decision Records NÃO DEVEM ser modificáveis após criação

---

## 5. Ciclo de Vida UKI (Normativo)

### 5.1 Estados Canônicos

UKIs progridem através de estados de ciclo de vida definidos:

- **Rascunho** (versão 0.x.x): Criação inicial, sem validação necessária
- **EmRevisão** (versão 0.x.x): Sob revisão de especialistas
- **Validado** (versão 0.x.x): Aprovado por especialistas, ainda não publicado
- **Publicado** (versão 1.x.x+): Oficialmente sancionado, imutável
- **Deprecado**: Substituído por UKI mais recente, substituição obrigatória
- **Arquivado**: Registro histórico, somente leitura

### 5.2 Transições de Estado

#### Rascunho → Em Revisão
- **Gatilho**: Submissão para revisão pelo autor
- **Validações**: Conformidade com esquema, validade das referências MOC
- **Autoridade**: Qualquer membro da equipe (baseado no scope_ref do MOC)

#### Em Revisão → Validado
- **Gatilho**: Aprovação pelos revisores designados
- **Validações**: Conteúdo tecnicamente correto, alinhamento estratégico
- **Autoridade**: Definido pelo MOC organizacional (scope_ref)

#### Validado → Publicado
- **Gatilho**: Promoção pelo responsável do domínio
- **Validações**: Impacto organizacional avaliado, dependências resolvidas
- **Autoridade**: domain_ref + maturity_ref no MOC

#### Publicado → Deprecado
- **Gatilho**: Conhecimento obsoleto ou substituído
- **Validações**: Plano de migração, UKIs dependentes notificados
- **Autoridade**: Mesma do estado Publicado

### 5.3 Regras de Versionamento por Estado

- **Rascunho**: 0.x.x (incremento livre)
- **Em Revisão**: 0.x.x (congelado durante revisão)
- **Validado**: Beta (primeira versão estável)
- **Publicado**: 1.x.x, 2.x.x... (versionamento semântico)
- **Deprecado**: Versão congelada
- **Arquivado**: Versão final preservada

---

## 6. Interoperability

- **MOC (Matrix Ontology Catalog)**: Defines organizational taxonomies referenced by *_ref fields
- **MEP (Matrix Epistemic Principle)**: Provides epistemological foundations for versioning and promotion
- **ZOF (Zion Orchestration Framework)**: Consumes UKIs during workflows and EvaluateForEnrich checkpoint
- **OIF (Operator Intelligence Framework)**: Uses UKIs to feed intelligence archetypes

**📋 [MEP-Framework Relationships Analysis](./mep-framework-relationships)** - Detailed mapping of how MEF implements the 5 MEP principles (Semantic Elasticity, Stratified Epistemology, Responsible Promotion, Derived Authority, Necessary Explainability) with practical examples and cross-framework integration patterns.

---

## 7. Convenções e Exemplos

Todos os exemplos neste documento são **meramente ilustrativos** e não definem comportamento normativo.  
A semântica normativa (escopos, governança, arquétipos, critérios de enriquecimento) é sempre derivada do **MOC (Matrix Ontology Catalog)** de cada organização.  
Os exemplos são fornecidos para fins de clareza e PODEM ser adaptados aos contextos locais, mas NÃO DEVEM ser tratados como obrigações no nível do protocolo.

---

## 8. Exemplos Ilustrativos (Apêndice)

> **Exemplo (Informativo, Dependente do MOC)**

### **Estrutura Padrão UKI**
```yaml


# --- Exemplo Ilustrativo ---
schema: "1.0"
ontology_reference: "Ontology_MEF_Support v1.0"
version: "0.0.1-beta"

id: uki:technical:pattern:jwt-authentication  # EXEMPLO
title: "Padrão de Autenticação JWT"
scope_ref: "team"           # Referência ao MOC
domain_ref: "technical"     # Referência ao MOC
type_ref: "pattern"         # Referência ao MOC
maturity_ref: "validated"   # Referência ao MOC
created_date: 2025-01-25
last_modified: 2025-01-25
status: active

content: |
  Implementação padronizada de autenticação JWT
  seguindo boas práticas de segurança...

relationships:
  - type: depends_on
    target: uki:technical:constraint:security-requirements
    description: "Implementa requisitos de segurança definidos"
```


### **Promoção de Conhecimento**
```yaml


# --- Exemplo Ilustrativo ---
promotion:
  is_promoted_from: uki:technical:example:local-auth-impl
  promotion_rationale: |
    Solução demonstrou valor em múltiplos projetos
    e foi validada por arquitetos de segurança.
    Promovida para padrão organizacional.

impact_analysis:
  severity: medium
  affected_domains: ["technical", "security"]
  propagation_estimate: 15
```


### **Relacionamentos Ontológicos**
```yaml


# --- Exemplo Ilustrativo ---
relationships:
  - type: depends_on
    target: uki:business:rule:authentication-policy
    description: "Implementa política de autenticação organizacional"
  
  - type: overrides
    target: uki:technical:pattern:basic-auth-deprecated
    description: "Substitui padrão de autenticação básica obsoleto"
  
  - type: complements
    target: uki:technical:pattern:authorization-rbac
    description: "Trabalha em conjunto com autorização baseada em papéis"
```
