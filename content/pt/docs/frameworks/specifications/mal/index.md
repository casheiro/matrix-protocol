---
title: Especificações MAL - Matrix Arbiter Layer
description: Schemas YAML canônicos para eventos de arbitragem e registros de decisão do Matrix Arbiter Layer
keywords:
  - MAL
  - Matrix Arbiter Layer
  - arbitragem determinística
  - resolução de conflitos
  - conflitos horizontais
  - enriquecimento concorrente
  - contenção de promoção
  - Decision Records
  - schemas YAML
framework: MAL
icon: i-heroicons-scale
layout: docs
sidebar: true
toc: true
navigation: true
lang: pt
last_updated: 2025-10-31T00:00:00.000Z
order: 5
---

# Especificações MAL - Matrix Arbiter Layer

Esta seção contém as especificações canônicas normativas para o **Matrix Arbiter Layer (MAL)**, definindo schemas YAML para eventos de arbitragem e registros de decisão determinística para resolução de conflitos de conhecimento.

## 📋 Schemas Disponíveis

### 1. MAL Arbitration Event Schema
**Arquivo:** `mal-arbitration-event-schema.yaml`  
**Versão:** 1.0.0  
**Propósito:** Especificação para eventos de conflito que requerem arbitragem

<YamlViewer file-path="/content/pt/docs/frameworks/specifications/mal/mal-arbitration-event-schema.yaml" />

#### Tipos de Conflito
- **H1 (Horizontal Conflicts):** Conflitos entre UKIs de escopo equivalente
- **H2 (Concurrent Enrichment):** Tentativas simultâneas de enriquecimento
- **H3 (Promotion Contention):** Propostas concorrentes de promoção

#### Componentes Principais
- **candidates:** Entidades conflitantes com metadados completos
- **user_moc_context:** Contexto hierárquico e autoridade do usuário
- **conflict_details:** Detalhes específicos por tipo de conflito
- **policy_ref:** Referência a política de arbitragem MOC

### 2. MAL Decision Record Schema
**Arquivo:** `mal-decision-record-schema.yaml`  
**Versão:** 1.0.0  
**Propósito:** Especificação para registros imutáveis de decisão

<YamlViewer file-path="/content/pt/docs/frameworks/specifications/mal/mal-decision-record-schema.yaml" />

#### Resultados de Decisão
- **winner:** UKI única escolhida como autoritativa
- **coexist:** Múltiplas UKIs válidas via particionamento
- **reject_all:** Nenhuma UKI satisfaz requisitos
- **defer:** Requer intervenção humana ou escalação

#### Elementos de Decisão
- **precedence_applied:** Regras P1-P6 aplicadas na decisão
- **epistemic_rationale:** Justificativa alinhada aos princípios MEP
- **actions:** Ações derivadas para execução
- **audit:** Informações completas de auditoria

## 🎯 Uso das Especificações

### Para Implementadores

#### Evento de Arbitragem H1 (Conflito Horizontal)
```yaml
# Exemplo: Conflito entre regras de retenção de dados
schema: "1.0"
event_id: mal-evt-20250826-001
event_type: H1
timestamp: 2025-08-26T14:30:25.123Z

candidates:
  - uki_ref: "uki:squad-x:rule:retencao-dados-30d"
    scope_ref: squad-x
    domain_ref: security
    type_ref: rule
    maturity_level: validated
    version: "1.2.0"
    evidence_refs: ["uki:org:policy:lgpd-compliance", "doc:logs-auditoria-2024"]
    conflict_metadata:
      conflicting_aspects: ["retention_period"]
      semantic_similarity: 0.85
      usage_frequency: 15

  - uki_ref: "uki:squad-x:rule:retencao-dados-7d"
    scope_ref: squad-x
    domain_ref: security
    type_ref: rule
    maturity_level: endorsed
    version: "2.0.0"
    evidence_refs: ["uki:org:policy:minimizacao-dados"]
    conflict_metadata:
      conflicting_aspects: ["retention_period"]
      semantic_similarity: 0.85
      usage_frequency: 3

user_moc_context:
  user_id: dev001
  scopes: ["squad-x", "tribe-alpha", "organization"]
  authority_level: squad_lead
  domain_access: ["technical", "security"]

operation: enrich

conflict_details:
  conflict_description: "Duas regras de segurança de escopo equivalente em conflito sobre período de retenção de dados"
  detection_method: semantic_analysis
  detection_timestamp: 2025-08-26T14:30:00.000Z
  severity: high
  
  h1_details:
    scope_equivalence: true
    semantic_overlap: 0.85
    contradictory_directives: ["retention_period: 30d vs 7d"]
    domain_intersection: ["security", "compliance"]

policy_ref: "moc:arbitration:security_priority"
```

#### Evento de Arbitragem H2 (Enriquecimento Concorrente)
```yaml
# Exemplo: Tentativas simultâneas de enriquecimento
schema: "1.0"
event_id: mal-evt-20250826-002
event_type: H2
timestamp: 2025-08-26T14:35:00.000Z

candidates:
  - uki_ref: "uki:squad-payments:pattern:auth-jwt-v1"
    scope_ref: squad-payments
    domain_ref: technical
    type_ref: pattern
    maturity_level: draft
    version: "1.0.0"

  - uki_ref: "uki:squad-payments:pattern:auth-jwt-v2"
    scope_ref: squad-payments
    domain_ref: technical
    type_ref: pattern
    maturity_level: experimental
    version: "1.0.0"

user_moc_context:
  user_id: dev002
  scopes: ["squad-payments"]
  authority_level: developer
  domain_access: ["technical"]

operation: enrich

conflict_details:
  conflict_description: "Tentativas simultâneas de enriquecimento em padrões de autenticação JWT"
  detection_method: automated_workflow
  detection_timestamp: 2025-08-26T14:35:00.000Z
  severity: medium
  
  h2_details:
    concurrent_requests:
      - request_id: "req-001"
        timestamp: 2025-08-26T14:34:55.000Z
        user_id: dev001
        priority: high
      
      - request_id: "req-002"
        timestamp: 2025-08-26T14:35:02.000Z
        user_id: dev002
        priority: medium
    
    temporal_window_ms: 30000
    resource_contention: "oracle_enrichment_lock"
    first_request_advantage: false
```

#### Registro de Decisão Winner
```yaml
# Exemplo: Decisão com vencedor único
schema: "1.0"
decision_id: mal-dec-20250826-h1-001
event_ref: mal-evt-20250826-001
outcome: winner

winner: "uki:squad-x:rule:retencao-dados-30d"
losers: ["uki:squad-x:rule:retencao-dados-7d"]

precedence_applied:
  - rule_id: P3_maturity_level
    description: "Conhecimento validado tem precedência sobre experimental"
    weight: 0.8
    application_result:
      rule_outcome: "validated > endorsed"
      impact_on_decision: decisive
      numerical_score: 0.9
      compared_entities:
        - entity_ref: "uki:squad-x:rule:retencao-dados-30d"
          entity_value: "validated"
          score: 0.9
        - entity_ref: "uki:squad-x:rule:retencao-dados-7d"
          entity_value: "endorsed"
          score: 0.6

  - rule_id: P5_evidence_density
    description: "Maior densidade de evidências suporte"
    weight: 0.7
    application_result:
      rule_outcome: "2 evidências > 1 evidência"
      impact_on_decision: supportive
      numerical_score: 0.7

epistemic_rationale:
  summary: "Maturidade validada e evidência regulatória mais forte determinaram a escolha da regra de 30 dias"
  reasoning: "Enquanto ambas as UKIs operam em escopo equivalente de squad, a regra de retenção de 30 dias demonstra maior maturidade epistemológica através de seu status 'validated' e evidência regulatória mais robusta ligada aos requisitos de conformidade LGPD"
  
  references:
    moc_nodes: 
      - "hierarchies.scope.squad-x"
      - "hierarchies.domain.security"
      - "hierarchies.maturity.validated"
    mef_evidence: 
      - "uki:org:policy:lgpd-compliance"
    external_references: 
      - "doc:logs-auditoria-2024"
      - "reg:lgpd-art-6"
  
  mep_alignment:
    epistemic_humility: "Decisão baseada em critérios organizacionais específicos, reconhecendo limitações contextuais"
    derived_authority: "Autoridade deriva do MOC organizacional e configuração de políticas"
    contextual_knowledge: "Decisão específica para contexto squad-x no domínio segurança"
  
  uncertainty_assessment:
    confidence_level: 0.85
    risk_factors: ["Evidência regulatória pode mudar"]
    sensitivity_analysis: "Decisão robusta a pequenas variações nos critérios"

actions:
  - "allow_enrich:uki:squad-x:rule:retencao-dados-30d"
  - "deprecate:uki:squad-x:rule:retencao-dados-7d"

audit:
  decided_at: 2025-08-26T14:30:26.789Z
  decided_by: mal-v1.0.0
  timeout_used_ms: 1250
  arbitration_timeout_ms: 2000
  
  processing_details:
    algorithm_version: "precedence-v1.0"
    policy_config_version: "moc-policy-v1.2"
    computational_complexity: medium
    
  quality_indicators:
    consistency_check: true
    precedent_alignment: 0.88
    stakeholder_impact_assessment: moderate
```

#### Registro de Decisão Coexist
```yaml
# Exemplo: Decisão de coexistência com particionamento
schema: "1.0"
decision_id: mal-dec-20250826-h1-002
event_ref: mal-evt-20250826-003
outcome: coexist

coexistence_arrangement:
  partition_strategy: scope_partition
  
  partition_rules:
    - uki_ref: "uki:squad-a:guideline:code-review"
      assigned_context:
        scope_restriction: "squad-a"
        domain_restriction: "technical"
      conditions: ["user.scope == 'squad-a'"]
      precedence_order: 1
    
    - uki_ref: "uki:squad-b:guideline:code-review"
      assigned_context:
        scope_restriction: "squad-b"
        domain_restriction: "technical"
      conditions: ["user.scope == 'squad-b'"]
      precedence_order: 2
  
  conflict_resolution_rules:
    - "Em caso de sobreposição cross-squad, escalação automática para tribe-lead"

precedence_applied:
  - rule_id: P2_scope_specificity
    description: "Escopo mais específico vence para orientações locais"
    weight: 0.9
    application_result:
      rule_outcome: "squad-level > tribe-level para guidelines"
      impact_on_decision: decisive

epistemic_rationale:
  summary: "Particionamento por escopo permite coexistência de guidelines específicas por squad"
  reasoning: "Ambas as guidelines têm valor em seus contextos específicos e não apresentam conflito fundamental"
  
  references:
    moc_nodes: ["hierarchies.scope.squad-a", "hierarchies.scope.squad-b"]
    
actions:
  - "partition_scope:squad-a:uki:squad-a:guideline:code-review"
  - "partition_scope:squad-b:uki:squad-b:guideline:code-review"

audit:
  decided_at: 2025-08-26T14:35:15.456Z
  decided_by: mal-v1.0.0
  timeout_used_ms: 890
```

### Para Organizações

#### Configuração de Políticas
- Use `policy_ref` para aplicar políticas MOC específicas
- Configure regras de precedência organizacionais
- Adapte critérios de severidade conforme contexto

#### Integração com Workflows
- Configure detecção automática de conflitos
- Integre com sistemas de notificação
- Estabeleça caminhos de escalação claros


## ✅ Validação e Conformidade

### Eventos de Arbitragem Obrigatórios
- **event_id:** Identificador único no formato mal-evt-YYYYMMDD-NNN
- **event_type:** Deve ser H1, H2 ou H3
- **candidates:** Mínimo 2 entidades conflitantes
- **user_moc_context:** Contexto completo do usuário

### Registros de Decisão Imutáveis
- **decision_id:** Identificador único no formato mal-dec-YYYYMMDD-TYPE-NNN
- **precedence_applied:** Mínimo 1 regra aplicada
- **epistemic_rationale:** Justificativa completa alinhada ao MEP
- **audit:** Informações completas de auditoria

### Regras de Precedência P1-P6
1. **P1_authority_weight:** Peso de autoridade hierárquica
2. **P2_scope_specificity:** Especificidade de escopo
3. **P3_maturity_level:** Nível de maturidade
4. **P4_temporal_recency:** Recência temporal
5. **P5_evidence_density:** Densidade de evidência
6. **P6_deterministic_fallback:** Fallback determinístico

## 🔗 Integração com Outros Frameworks

### MEF (Matrix Embedding Framework)
- Decision Records persistidos como trilha imutável
- Relacionamentos de conflito registrados entre UKIs
- Evidências MEF utilizadas na arbitragem

### MOC (Matrix Ontology Catalog)
- Políticas de arbitragem configuradas no MOC
- Hierarquias de autoridade consultadas
- Regras de precedência organizacionais

### ZOF (Zion Orchestration Framework)
- Detecção de conflitos no checkpoint EvaluateForEnrich
- Invocação automática em conflitos H1/H2/H3
- Aplicação de ações derivadas das decisões

### OIF (Operator Intelligence Framework)
- Templates de explicação para comunicar decisões
- Interpretação de Decision Records
- Geração de explicações contextualizadas

## 📖 Recursos Relacionados

### Matrix Protocol Frameworks
- **[MAL - Matrix Arbiter Layer](../../mal)** - Documentação completa do framework
- **[Especificações Canônicas](../)** - Todos os schemas do protocolo
- **[Exemplos de Arbitragem](/docs/examples)** - Casos de uso práticos

### Documentação Técnica
- **[Guia de Implementação](/docs/implementation)** - Como implementar o protocolo
- **[Manual de Ferramentas](/docs/manual/tools)** - Ferramentas de apoio MAL
- **[Glossário](/docs/glossary)** - Definições e terminologia