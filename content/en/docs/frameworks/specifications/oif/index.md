---
title: OIF Specifications - Operator Intelligence Framework
description: Canonical YAML schemas for intelligence archetypes and arbitration explanation templates of the Operator Intelligence Framework
keywords:
  - OIF
  - Operator Intelligence Framework
  - intelligence archetypes
  - Knowledge Agent
  - Workflow Agent
  - arbitration explanation
  - derived authority
  - YAML schemas
framework: OIF
icon: i-heroicons-cpu-chip
layout: docs
sidebar: true
toc: true
navigation: true
lang: en
last_updated: 2025-10-31T00:00:00.000Z
order: 4
---

# OIF Specifications - Operator Intelligence Framework

This section contains the normative canonical specifications for the **Operator Intelligence Framework (OIF)**, defining YAML schemas for artificial intelligence archetypes hierarchically aware of organizational governance and arbitration explanation templates.

## 📋 Available Schemas

### 1. OIF Archetype Schema
**Arquivo:** `oif-archetype-schema.yaml`  
**Versão:** 1.0.0  
**Propósito:** Especificação para definição de arquétipos de inteligência

<YamlViewer file-path="/content/pt/docs/frameworks/specifications/oif/oif-archetype-schema.yaml" />

#### Níveis de Arquétipos
- **canonical:** Arquétipos centrais do protocolo (KAG, WAG)
- **specialized:** Arquétipos específicos de domínio configurados via MOC
- **ephemeral:** Arquétipos experimentais e temporários

#### Componentes Principais
- **core_capabilities:** Funções primárias e características de performance
- **moc_integration:** Integração obrigatória com MOC organizacional
- **quality_metrics:** Métricas de explicabilidade e autoridade derivada

### 2. OIF Arbitration Explanation Schema
**Arquivo:** `oif-arbitration-explanation-schema.yaml`  
**Versão:** 1.0.0  
**Propósito:** Especificação para templates de explicação de decisões MAL

<YamlViewer file-path="/content/pt/docs/frameworks/specifications/oif/oif-arbitration-explanation-schema.yaml" />

#### Elementos de Explicação
- **precedence_explanation:** Regras de precedência aplicadas
- **moc_references:** Nós MOC citados na decisão
- **epistemic_context:** Contexto alinhado aos princípios MEP
- **presentation_config:** Configuração de audiência e formato

## 🎯 Uso das Especificações

### Para Implementadores

#### Definição de Arquétipo Canônico
```yaml
# Exemplo: Knowledge Agent (KAG)
schema: "1.0"
archetype_id: kag
archetype_name: "Knowledge Agent"
archetype_level: canonical
version: "1.0.0"
specialization: "Compreensão, organização e relacionamento de conhecimento MEF"

domain_ref: global
scope_ref: all

core_capabilities:
  primary_functions:
    - function_name: semantic_search
      description: "Busca inteligente em UKIs com filtragem MOC"
      moc_aware: true
      input_requirements: ["user_context", "query_parameters"]
      output_format: "filtered_ukis"
    
    - function_name: knowledge_filtering
      description: "Apresenta apenas conhecimento autorizado pelo contexto do usuário"
      moc_aware: true
      input_requirements: ["user_context", "uki_set"]
      output_format: "filtered_knowledge"

  input_types: ["natural_language_query", "user_context", "uki_reference"]
  output_types: ["filtered_knowledge", "explanation", "escalation_path"]

  performance_characteristics:
    response_time_target_ms: 1000
    throughput_target: 300
    accuracy_target: 0.95
    explainability_score: 0.9

moc_integration:
  authority_validation:
    enabled: true
    validation_method: moc_based
    escalation_handling: true
  
  hierarchical_filtering:
    scope_filtering:
      enabled: true
      filter_mode: hierarchical
      inheritance_rules: true
    
    domain_filtering:
      enabled: true
      access_control: role_based
      cross_domain_access: false
    
    contextual_access:
      user_context_required: true
      session_awareness: true
  
  governance_explanation:
    moc_node_citation: true
    explanation_depth: standard
    transparency_level: intermediate
    include_escalation_paths: true

level_specific_config:
  canonical_config:
    prompt_protection:
      immutable_prompts: true
      override_allowed: false
      modification_restrictions: ["core_system_prompt", "knowledge_access_patterns"]
    
    behavioral_constraints:
      domain_agnostic: true
      organization_neutral: true

quality_metrics:
  explainability_metrics:
    clarity_target: 0.85
    traceability_target: 1.0
    measurement_frequency: real_time
  
  hierarchical_filtering_metrics:
    precision_target: 0.95
    authority_compliance_target: 1.0
  
  derived_authority_metrics:
    contextualization_target: 0.9
    humility_integration_target: 0.8
    absolute_truth_avoidance_target: 1.0

metadata:
  created_date: 2025-10-31
  last_modified: 2025-10-31
  maintainer: protocol-team
  validation_status: valid
  deployment_environments: ["development", "staging", "production"]
```

#### Definição de Arquétipo Especializado
```yaml
# Exemplo: Security Guidance Agent
schema: "1.0"
archetype_id: gad.security
archetype_name: "Guidance Agent - Security"
archetype_level: specialized
version: "1.0.0"
specialization: "Orientação específica de segurança e conformidade de políticas"

domain_ref: security
scope_ref: organization

core_capabilities:
  primary_functions:
    - function_name: security_guidance
      description: "Fornece orientações específicas de segurança"
      moc_aware: true
      input_requirements: ["security_context", "compliance_requirements"]
      output_format: "security_recommendation"
    
    - function_name: compliance_validation
      description: "Valida conformidade com políticas de segurança"
      moc_aware: true
      input_requirements: ["implementation_proposal", "security_policies"]
      output_format: "compliance_report"

  input_types: ["natural_language_query", "system_state", "user_context"]
  output_types: ["recommendation", "explanation", "escalation_path"]

  performance_characteristics:
    response_time_target_ms: 2000
    throughput_target: 60
    accuracy_target: 0.98
    explainability_score: 0.95

moc_integration:
  authority_validation:
    enabled: true
    validation_method: moc_based
    escalation_handling: true
  
  hierarchical_filtering:
    scope_filtering:
      enabled: true
      filter_mode: hierarchical
    
    domain_filtering:
      enabled: true
      access_control: role_based
  
  governance_explanation:
    moc_node_citation: true
    explanation_depth: detailed
    transparency_level: full

level_specific_config:
  specialized_config:
    moc_validation_required: true
    extension_patterns:
      domain_specialization: true
      organizational_context: true
      workflow_integration: true
    base_archetype_inheritance: kag

quality_metrics:
  explainability_metrics:
    clarity_target: 0.9
    traceability_target: 1.0
  
  hierarchical_filtering_metrics:
    precision_target: 0.98
    authority_compliance_target: 1.0
  
  derived_authority_metrics:
    contextualization_target: 0.95
    humility_integration_target: 0.85

metadata:
  created_date: 2025-10-31
  last_modified: 2025-10-31
  maintainer: security-team
  validation_status: valid
  deployment_environments: ["production"]
```

#### Template de Explicação de Arbitragem
```yaml
# Exemplo: Explicação de conflito horizontal H1
schema: "1.0"
explanation_id: oif-exp-20250826-h1-001
decision_id: mal-dec-20250826-h1-001
event_type: H1
outcome: winner

summary: "A regra de retenção de dados de 30 dias foi escolhida como vencedora devido à maior maturidade epistemológica e evidência regulatória mais forte"

reason_code: MATURITY_AND_EVIDENCE_PRECEDENCE

winner: "uki:squad-x:rule:retencao-dados-30d"
losers: ["uki:squad-x:rule:retencao-dados-7d"]

precedence_explanation:
  - rule: P3_maturity_level
    description: "Conhecimento validado tem precedência sobre experimental"
    impact: "A regra de 30 dias possui status 'validated' enquanto a de 7 dias é 'endorsed'"
    weight_applied: 0.8
    decisive_factor: true
  
  - rule: P5_evidence_density
    description: "Maior densidade de evidências suporte"
    impact: "Regra de 30 dias tem evidências de conformidade LGPD mais robustas"
    weight_applied: 0.7
    decisive_factor: false

moc_references:
  - node_id: "hierarchies.scope.squad-x"
    node_type: scope
    relevance: "Define o escopo onde ambas as UKIs operam"
    node_value: "squad-x"
    decision_influence: contextual
  
  - node_id: "hierarchies.domain.security"
    node_type: domain
    relevance: "Estabelece o domínio de conhecimento aplicável"
    node_value: "security"
    decision_influence: supportive
  
  - node_id: "hierarchies.maturity.validated"
    node_type: policy
    relevance: "Critério de maturidade que determinou precedência"
    node_value: "validated"
    decision_influence: decisive

next_steps: "Utilize a regra de retenção de 30 dias aprovada. Para futuras políticas de dados, consulte a UKI vencedora como referência e garanta evidências regulatórias adequadas."

escalation_path: "Para questionar esta decisão, contacte o tech-lead responsável pelo domínio de segurança via canal #security-governance"

epistemic_context:
  humility_demonstration: "Esta decisão é baseada em critérios organizacionais específicos e pode variar em outros contextos ou com evidências adicionais"
  authority_acknowledgment: "A autoridade para esta decisão deriva da configuração organizacional MOC e das políticas de precedência estabelecidas"
  contextual_awareness: "Esta decisão se aplica especificamente ao escopo squad-x no domínio de segurança, considerando requisitos de conformidade LGPD"
  uncertainty_acknowledgment: "Embora a evidência regulatória tenha sido decisiva, reconhecemos que novos requisitos podem influenciar futuras decisões"
  learning_opportunity: "Este conflito sugere necessidade de maior alinhamento nas políticas de retenção entre equipes"

presentation_config:
  target_audience: developer
  detail_level: standard
  technical_depth: medium
  include_examples: true
  format_preference: structured

metadata:
  generated_at: 2025-08-26T14:35:00.000Z
  generator: knowledge-agent
  template_version: 1.0.0
  generation_duration_ms: 850
  
  user_context:
    user_id: dev001
    authority_level: developer
    domains_accessible: ["technical", "security"]
    preferred_language: pt
  
  quality_metrics:
    clarity_score: 0.88
    completeness_score: 0.92
    moc_citation_completeness: 1.0
```

### Para Organizações

#### Customização de Arquétipos
- Configure arquétipos especializados para domínios específicos
- Adapte métricas de qualidade aos padrões organizacionais
- Integre com hierarquias MOC locais

#### Templates de Explicação
- Customize formato de apresentação por audiência
- Configure coleta de feedback para melhoria contínua
- Adapte linguagem e profundidade técnica


## ✅ Validação e Conformidade

### Arquétipos Obrigatórios
Toda implementação OIF deve incluir:
- **Knowledge Agent (KAG):** Gestão de conhecimento MEF
- **Workflow Agent (WAG):** Orquestração de fluxos ZOF

### Integração MOC Obrigatória
- **authority_validation:** Validação baseada em hierarquias MOC
- **hierarchical_filtering:** Filtragem de conhecimento por contexto
- **governance_explanation:** Explicações citando nós MOC específicos

### Qualidade de Inteligências
- **Explicabilidade:** Clareza ≥ 85%, Rastreabilidade = 100%
- **Filtragem Hierárquica:** Precisão ≥ 95%, Conformidade = 100%
- **Autoridade Derivada:** Contextualização ≥ 90%, Humildade ≥ 80%

### Proteção de Prompts Canônicos
- Arquétipos canonical têm prompts imutáveis
- Modificações organizacionais apenas via extensão
- Comportamento central preservado

## 🔗 Integração com Outros Frameworks

### MEF (Matrix Embedding Framework)
- Knowledge Agents consomem UKIs estruturadas
- Filtragem baseada em metadados MEF
- Relacionamentos ontológicos para busca semântica

### MOC (Matrix Ontology Catalog)
- Validação de autoridade via hierarquias MOC
- Filtragem de conhecimento por contexto organizacional
- Caminhos de escalação configuráveis

### ZOF (Zion Orchestration Framework)
- Workflow Agents orquestram fluxos ZOF
- Execução de checkpoint EvaluateForEnrich
- Gestão de transições de estado

### MAL (Matrix Arbiter Layer)
- Templates de explicação para decisões MAL
- Interpretação de Decision Records
- Comunicação de resultados de arbitragem

## 📖 Recursos Relacionados

### Matrix Protocol Frameworks
- **[OIF - Operator Intelligence Framework](../../oif)** - Documentação completa do framework
- **[Especificações Canônicas](../)** - Todos os schemas do protocolo
- **[Exemplos de Arquétipos](/docs/examples)** - Casos de uso práticos

### Documentação Técnica
- **[Guia de Implementação](/docs/implementation)** - Como implementar o protocolo
- **[Manual de Ferramentas](/docs/manual/tools)** - Ferramentas de apoio OIF
- **[Glossário](/docs/glossary)** - Definições e terminologia