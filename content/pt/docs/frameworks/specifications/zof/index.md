---
title: ZOF Specifications - Zion Orchestration Framework
description: Canonical YAML schemas for workflows, state transitions and EvaluateForEnrich evaluation of the Zion Orchestration Framework
keywords:
  - ZOF
  - Zion Orchestration Framework
  - conceptual workflows
  - canonical states
  - EvaluateForEnrich
  - AI orchestration
  - YAML schemas
framework: ZOF
icon: i-heroicons-bolt
layout: docs
sidebar: true
toc: true
navigation: true
lang: en
last_updated: 2025-10-31T00:00:00.000Z
order: 3
---

# ZOF Specifications - Zion Orchestration Framework

This section contains the normative canonical specifications for the **Zion Orchestration Framework (ZOF)**, defining YAML schemas for AI-oriented conceptual workflows, state transitions and EvaluateForEnrich checkpoint.

## 📋 Available Schemas

### 1. ZOF Workflow Schema
**File:** `zof-workflow-schema.yaml`  
**Version:** 1.0.0  
**Purpose:** Specification for conceptual workflow definitions

<YamlViewer file-path="/content/en/docs/frameworks/specifications/zof/zof-workflow-schema.yaml" />

#### Mandatory Canonical States
1. **intake:** Context and requirements capture
2. **understand:** Mandatory Oracle consultation (UKIs)  
3. **decide:** Decision based on existing knowledge
4. **act:** Execution of planned action
5. **evaluate_for_enrich:** Mandatory evaluation checkpoint
6. **review:** Optional result validation
7. **enrich:** Conditional Oracle enrichment

#### Canonical Trigger Events
- `knowledge.added` - New content available
- `work.proposed` - New work proposal
- `work.refine.requested` - Refinement request
- `assistance.requested` - Help/collaboration request
- `test.authored` - Test scenarios created
- `feedback.submitted` - Correction/learning

### 2. ZOF State Transition Schema
**File:** `zof-state-transition-schema.yaml`  
**Version:** 1.0.0  
**Purpose:** Specification for transitions between canonical states

<YamlViewer file-path="/content/en/docs/frameworks/specifications/zof/zof-state-transition-schema.yaml" />

#### Main Components
- **Transition Conditions:** Logic for state changes
- **Mandatory Signals:** Context, Decision, Result for explainability
- **Validations:** Checks executed during transition
- **Actions:** Operations performed in transition
- **MAL Integration:** Conflict detection and arbitration

### 3. ZOF Enrichment Evaluation Schema
**File:** `zof-enrichment-evaluation-schema.yaml`  
**Version:** 1.0.0  
**Purpose:** Specification for EvaluateForEnrich checkpoint

<YamlViewer file-path="/content/en/docs/frameworks/specifications/zof/zof-enrichment-evaluation-schema.yaml" />

#### Evaluation Elements
- **can_enrich_decision:** Result of can_enrich?() function
- **moc_criteria_results:** Evaluation based on MOC criteria
- **authority_validation:** User authority validation
- **conflict_detection:** H1/H2/H3 conflict detection
- **scope_mode_validation:** Validation for multi-scope operations

## 🎯 Using the Specifications

### For Implementers

#### Basic ZOF Workflow Structure
```yaml
# Minimal ZOF workflow example
schema: "1.0"
workflow_id: zof-basic-example
title: "Basic Example Workflow"
version: "1.0.0"

canonical_states:
  intake:
    description: "Context and requirements capture"
    signals:
      context: "Initial request received"
      decision: "Sufficient context to proceed"
      result: "Requirements organized and validated"
    transitions:
      - target_state: understand
        condition: "completion_criteria_met"
        description: "Proceed to Oracle consultation"

  understand:
    description: "Mandatory Oracle consultation"
    signals:
      context: "Consult relevant existing knowledge"
      decision: "Oracle consulted successfully"
      result: "Existing knowledge identified"
    oracle_consultation:
      required: true
      query_parameters:
        scope_filter: ["squad", "tribe"]
        domain_filter: ["technical"]
      filter_criteria:
        user_context_required: true
        authority_validation: true
    transitions:
      - target_state: decide
        condition: "oracle_consulted"
        description: "Proceed to decision"

  decide:
    description: "Knowledge-based decision"
    signals:
      context: "Oracle knowledge + request context"
      decision: "Implementation approach defined"
      result: "Clear strategy for execution"
    transitions:
      - target_state: act
        condition: "decision_made"
        description: "Execute planned action"

  act:
    description: "Planned action execution"
    signals:
      context: "Defined strategy for implementation"
      decision: "Execute as planned"
      result: "Action completed with specific result"
    transitions:
      - target_state: evaluate_for_enrich
        condition: "action_executed"
        description: "Evaluate for enrichment"

  evaluate_for_enrich:
    description: "Mandatory evaluation checkpoint"
    signals:
      context: "Action result available for evaluation"
      decision: "can_enrich?() executado com critérios MOC"
      result: "Decisão de enriquecimento tomada"
    checkpoint_config:
      can_enrich_function:
        implementation: minimum_profile
        criteria: ["semantic_novelty", "practical_value", "basic_authority"]
      moc_criteria_consultation:
        required: true
        criteria_source: "hierarchies.evaluation_criteria.nodes"
      authority_validation:
        required: true
        validation_method: moc_based
    transitions:
      - target_state: review
        condition: "evaluation_completed"
        description: "Prosseguir para revisão"
      - target_state: enrich
        condition: "can_enrich_approved"
        description: "Enriquecer Oracle diretamente"

  review:
    description: "Validação opcional do resultado"
    signals:
      context: "Resultado validado opcionalmente"
      decision: "Qualidade confirmada"
      result: "Resultado aprovado para uso"
    transitions:
      - target_state: enrich
        condition: "review_approved"
        description: "Enriquecer Oracle"
      - target_state: complete
        condition: "no_enrichment_needed"
        description: "Finalizar workflow"

  enrich:
    description: "Enriquecimento condicional do Oracle"
    signals:
      context: "Conhecimento aprovado para enriquecimento"
      decision: "Oracle será enriquecido com novo conhecimento"
      result: "Oracle enriquecido com sucesso"
    transitions:
      - target_state: complete
        condition: "enrichment_completed"
        description: "Workflow concluído"

trigger_events:
  - event_type: work.proposed
    description: "Nova proposta de trabalho"
  - event_type: knowledge.added
    description: "Novo conhecimento disponível"

metadata:
  created_date: 2025-10-31
  last_modified: 2025-10-31
  maintainer: platform-team
```

#### State Transition Configuration
```yaml
# Example of intake → understand transition
schema: "1.0"
transition_id: zof-tr-example-001
workflow_ref: zof-basic-example
from_state: intake
to_state: understand

condition:
  type: completion_criteria
  expression: "all_completion_criteria_met && context_captured"
  description: "Completion criteria met and context captured"

signals:
  context: "Intake state completed with documented requirements"
  decision: "Criteria satisfied, proceeding to Oracle consultation"
  result: "Transition to understand confirmed"

validations:
  - validation_type: state_completeness
    description: "Validate intake state completeness"
    status: passed
    details: "All mandatory fields filled"

actions:
  - action_type: oracle_consultation
    description: "Prepare Oracle consultation"
    execution_order: 1
    parameters:
      scope_filter: ["squad", "tribe"]
      domain_filter: ["technical"]

metadata:
  created_date: 2025-10-31
  execution_timestamp: 2025-10-31T14:30:25.123Z
  executor: workflow-agent
  duration_ms: 250
```

#### Configuração de Avaliação EvaluateForEnrich
```yaml
# Exemplo de avaliação EvaluateForEnrich
schema: "1.0"
evaluation_id: zof-eval-exemplo-001
workflow_ref: zof-exemplo-basico

act_output:
  result_type: implementation
  content: "Implementação de autenticação JWT com validação específica..."
  metadata:
    created_at: 2025-10-31T14:30:00.000Z
    creator: user:developer
    complexity_score: 0.7

user_context:
  user_id: dev001
  moc_context:
    scope_level: squad
    domain_access: ["technical", "business"]
    authority_level: developer

evaluation_result:
  can_enrich_decision:
    approved: true
    confidence_score: 0.85
    evaluation_method: minimum_profile
    scoring_breakdown:
      semantic_novelty: 0.8
      practical_value: 0.9
      basic_authority: 0.85

  moc_criteria_results:
    criteria_source: "hierarchies.evaluation_criteria.nodes"
    profile_used: standard
    individual_results:
      relevance:
        criterion_name: "Relevância"
        result: pass
        score: 0.8
        threshold_met: true
        explanation: "Outros desenvolvedores enfrentarão problema similar"
      
      reusability:
        criterion_name: "Reutilização"
        result: pass
        score: 0.7
        threshold_met: true
        explanation: "Solução aplicável em múltiplos contextos"

    overall_result:
      passed: true
      score: 0.75
      execution_method: weighted_scoring

  authority_validation:
    authorized: true
    validation_method: moc_based
    required_authority: developer
    user_authority: developer
    moc_nodes_cited: ["hierarchies.scope.squad", "hierarchies.domain.technical"]

  justification:
    summary: "Conhecimento aprovado baseado em relevância alta e autoridade adequada"
    reasoning: "O resultado demonstra valor prático significativo..."
    mep_alignment:
      derived_authority: "Autoridade validada através de contexto MOC"
      contextual_knowledge: "Conhecimento específico do domínio técnico"

recommended_actions:
  - action_type: proceed_to_enrich
    description: "Prosseguir para enriquecimento do Oracle"
    priority: high

metadata:
  evaluation_timestamp: 2025-10-31T14:35:00.000Z
  evaluator: workflow-agent
  duration_ms: 1500
```

### Para Organizações

#### Customização de Workflows
- Configure eventos gatilho conforme processos organizacionais
- Adapte critérios de avaliação aos padrões locais
- Customize timeouts e políticas de retry

#### Integração com MOC
- Use critérios de avaliação definidos no MOC organizacional
- Respeite hierarquias de autoridade configuradas
- Aplique políticas de arbitragem customizadas


## ✅ Validation and Compliance

### Estados Canônicos Obrigatórios
Todo workflow ZOF deve incluir os 7 estados canônicos:
1. `intake` → `understand` → `decide` → `act` → `evaluate_for_enrich` → `review`/`enrich` → `complete`

### Checkpoint EvaluateForEnrich
- **can_enrich_function:** Obrigatória em todos os workflows
- **moc_criteria_consultation:** Deve consultar MOC organizacional
- **authority_validation:** Validação de autoridade obrigatória
- **conflict_detection:** Detecção de conflitos H1/H2/H3

### Sinais de Explicabilidade
Cada transição deve registrar:
- **context:** O que entrou no estado
- **decision:** Por que transicionou
- **result:** O que saiu do estado

## 🔗 Integration with Other Frameworks

### MEF (Matrix Embedding Framework)
- Estados understand consultam UKIs estruturadas
- Enriquecimento produz novas UKIs no MEF
- Decision Records MAL persistidos no MEF

### MOC (Matrix Ontology Catalog)
- Critérios de avaliação definidos no MOC
- Validação de autoridade baseada em hierarquias MOC
- Políticas de arbitragem configuradas no MOC

### MAL (Matrix Arbiter Layer)
- Detecção de conflitos H1/H2/H3 no EvaluateForEnrich
- Invocação automática para arbitragem
- Aplicação de decisões MAL via ações específicas

### OIF (Operator Intelligence Framework)
- Workflow Agents orquestram fluxos ZOF
- Arquétipos executam estados específicos
- Explicações incorporam justificativas ZOF

## 📖 Related Resources

### Matrix Protocol Frameworks
- **[ZOF - Zion Orchestration Framework](../../zof)** - Documentação completa do framework
- **[Especificações Canônicas](../)** - Todos os schemas do protocolo
- **[Exemplos de Workflows](/docs/examples)** - Casos de uso práticos

### Documentação Técnica
- **[Guia de Implementação](/docs/implementation)** - Como implementar o protocolo
- **[Manual de Ferramentas](/docs/manual/tools)** - Ferramentas de apoio ZOF
- **[Glossário](/docs/glossary)** - Definições e terminologia