---
title: Especificações MOC - Matrix Ontology Catalog
description: Schemas YAML canônicos para hierarquias, critérios e políticas do Matrix Ontology Catalog
keywords:
  - MOC
  - Matrix Ontology Catalog
  - hierarquias organizacionais
  - critérios de avaliação
  - políticas de arbitragem
  - taxonomias configuráveis
  - schemas YAML
framework: MOC
icon: i-heroicons-adjustments-horizontal
layout: docs
sidebar: true
toc: true
navigation: true
lang: pt
last_updated: 2025-10-31T00:00:00.000Z
order: 2
---

# Especificações MOC - Matrix Ontology Catalog

Esta seção contém as especificações canônicas normativas para o **Matrix Ontology Catalog (MOC)**, definindo schemas YAML para configuração de hierarquias organizacionais, critérios de avaliação e políticas de arbitragem.

## 📋 Schemas Disponíveis

### 1. MOC Hierarchy Schema
**Arquivo:** `moc-hierarchy-schema.yaml`  
**Versão:** 1.0.0  
**Propósito:** Especificação para hierarquias organizacionais configuráveis

<YamlViewer file-path="/content/pt/docs/frameworks/specifications/moc/moc-hierarchy-schema.yaml" />

#### Hierarquias Obrigatórias
- **scope:** Alcance e visibilidade do conhecimento
- **domain:** Áreas de conhecimento e especialização
- **maturity:** Níveis de validação e confiabilidade
- **evaluation_criteria:** Critérios para checkpoint EvaluateForEnrich

#### Hierarquias Opcionais
- **authority:** Autoridade organizacional
- **lifecycle:** Ciclo de vida do conhecimento

### 2. MOC Evaluation Criteria Schema
**Arquivo:** `moc-evaluation-criteria-schema.yaml`  
**Versão:** 1.0.0  
**Propósito:** Especificação para critérios organizacionais de enriquecimento

<YamlViewer file-path="/content/pt/docs/frameworks/specifications/moc/moc-evaluation-criteria-schema.yaml" />

#### Componentes Principais
- **evaluation_profiles:** Perfis de critérios para diferentes contextos
- **context_mapping:** Mapeamento de contextos para perfis específicos
- **default_profile:** Perfil padrão de avaliação

#### Métodos de Avaliação
- **manual:** Avaliação humana
- **automated:** Avaliação automatizada
- **hybrid:** Combinação manual/automatizada
- **semantic:** Avaliação semântica

### 3. MOC Arbitration Policies Schema
**Arquivo:** `moc-arbitration-policies-schema.yaml`  
**Versão:** 1.0.0  
**Propósito:** Especificação para políticas de arbitragem MAL

<YamlViewer file-path="/content/pt/docs/frameworks/specifications/moc/moc-arbitration-policies-schema.yaml" />

#### Configurações Principais
- **default_precedence_order:** Ordem padrão de regras P1-P6
- **scope_specificity_rules:** Configuração da regra P2
- **conflict_type_policies:** Políticas específicas para H1/H2/H3
- **named_policies:** Políticas customizadas organizacionais

## 🎯 Uso das Especificações

### Para Implementadores

#### Estrutura Básica de MOC
```yaml
# Exemplo mínimo de configuração MOC
schema: "1.0"
organization_id: minha-org
version: "1.0"

hierarchies:
  scope:
    description: "Estrutura organizacional"
    nodes:
      squad:
        display_name: "Squad"
        level: 0
        parent: null
        authority_roles: ["developer", "tech_lead"]
      
      tribe:
        display_name: "Tribe"
        level: 1
        parent: null
        authority_roles: ["tribe_lead", "architect"]

  domain:
    description: "Domínios de conhecimento"
    nodes:
      technical:
        display_name: "Technical"
        scope: global
        specializations: ["frontend", "backend"]
      
      business:
        display_name: "Business"
        scope: contextual
        specializations: ["product", "marketing"]

  maturity:
    description: "Níveis de maturidade"
    nodes:
      draft:
        display_name: "Draft"
        rank: 10
        criteria: ["Documentação inicial"]
        transitions:
          can_promote_to: ["validated"]
      
      validated:
        display_name: "Validated" 
        rank: 90
        criteria: ["Revisão por pares", "Testes validados"]
        transitions:
          can_demote_to: ["draft"]

  evaluation_criteria:
    description: "Critérios de avaliação"
    nodes:
      relevance:
        display_name: "Relevance"
        description: "Relevância para a equipe"
        threshold_type: high
        weight: 0.4
      
      reusability:
        display_name: "Reusability"
        description: "Potencial de reutilização"
        threshold_type: medium
        weight: 0.6

metadata:
  created_date: 2025-10-31
  last_modified: 2025-10-31
  maintainer: governance-team
```

#### Configuração de Critérios de Avaliação
```yaml
# Exemplo de perfis de avaliação
schema: "1.0"
organization_id: minha-org
version: "1.0"

evaluation_profiles:
  standard:
    display_name: "Perfil Padrão"
    description: "Avaliação padrão para conhecimento regular"
    
    criteria:
      relevance:
        display_name: "Relevância"
        description: "Relevância para outros membros"
        evaluation_method: manual
        threshold:
          type: percentage
          value: 0.7
          operator: ">="
        weight: 0.4
      
      impact:
        display_name: "Impacto"
        description: "Impacto organizacional esperado"
        evaluation_method: hybrid
        threshold:
          type: categorical
          value: medium
        weight: 0.6
    
    applicable_contexts:
      scopes: ["squad", "tribe"]
      domains: ["technical", "business"]
      maturity_levels: ["draft", "validated"]

default_profile: standard

metadata:
  created_date: 2025-10-31
  last_modified: 2025-10-31
  maintainer: platform-team
```

#### Configuração de Políticas de Arbitragem
```yaml
# Exemplo de políticas de arbitragem
schema: "1.0"
organization_id: minha-org
version: "1.0"

arbitration_policies:
  default_precedence_order:
    - "P1_authority_weight"
    - "P2_scope_specificity" 
    - "P3_maturity_level"
    - "P4_temporal_recency"
    - "P5_evidence_density"
    - "P6_deterministic_fallback"
  
  arbitration_timeout: 5000
  
  scope_specificity_rules:
    local_instructions:
      precedence_order: ["squad", "tribe", "organization"]
      applies_to_types: ["guideline", "pattern"]
    
    mandatory_rules:
      precedence_order: ["organization", "tribe", "squad"]
      applies_to_types: ["policy", "compliance"]
  
  conflict_type_policies:
    H1_horizontal_conflicts:
      enable_coexistence: true
      require_deprecation: false
      precedence_order:
        - "P1_authority_weight"
        - "P3_maturity_level"
        - "P2_scope_specificity"
    
    H2_concurrent_enrichment:
      temporal_window_ms: 30000
      precedence_order:
        - "P4_temporal_recency"
        - "P1_authority_weight"
    
    H3_promotion_contention:
      evidence_density_multiplier: 2.0
      precedence_order:
        - "P5_evidence_density"
        - "P1_authority_weight"

metadata:
  created_date: 2025-10-31
  last_modified: 2025-10-31
  maintainer: governance-team
```

### Para Organizações

#### Flexibilidade Local
- Configure hierarquias conforme estrutura organizacional
- Adapte critérios de avaliação aos processos locais
- Customize políticas de arbitragem conforme governança

#### Mantendo Conformidade
- Preserve campos obrigatórios dos schemas
- Use padrões de nomenclatura consistentes
- Valide configurações contra schemas


## ✅ Validação e Conformidade

### Hierarquias Obrigatórias
Toda configuração MOC deve incluir:
1. **scope** - com nós e níveis hierárquicos
2. **domain** - com especializações e controles
3. **maturity** - com ranks e transições
4. **evaluation_criteria** - com pesos e limiares

### Regras de Validação
- Soma de pesos de critérios ≤ 1.0
- Nós pai devem existir na hierarquia
- Referências entre hierarquias devem ser válidas
- Perfis padrão devem existir

### Consistência Organizacional
- Nomes de nós devem ser únicos por hierarquia
- Níveis hierárquicos devem ser consistentes
- Autoridades devem mapear para papéis válidos

## 🔗 Integração com Outros Frameworks

### MEF (Matrix Embedding Framework)
- Campos `*_ref` das UKIs referenciam nós MOC
- Validação de autoridade através de hierarquias
- Filtragem de conhecimento baseada em contexto

### ZOF (Zion Orchestration Framework)
- Checkpoint EvaluateForEnrich usa critérios MOC
- Validação de autoridade para enriquecimento
- Políticas de workflow configuráveis

### MAL (Matrix Arbiter Layer)
- Regras de precedência configuradas no MOC
- Políticas de arbitragem por tipo de conflito
- Timeout e configurações de decisão

### OIF (Operator Intelligence Framework)
- Filtragem hierárquica de inteligência
- Validação de autoridade para arquétipos
- Explicações referenciam nós MOC específicos

## 📖 Recursos Relacionados

### Matrix Protocol Frameworks
- **[MOC - Matrix Ontology Catalog](../../moc)** - Documentação completa do framework
- **[Especificações Canônicas](../)** - Todos os schemas do protocolo
- **[Templates MOC](/docs/manual/templates)** - Templates organizacionais

### Documentação Técnica
- **[Guia de Implementação](/docs/implementation)** - Como implementar o protocolo
- **[Governança MOC](/docs/manual/moc-governance)** - Práticas de governança
- **[Glossário](/docs/glossary)** - Definições e terminologia