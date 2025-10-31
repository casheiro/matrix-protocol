---
title: Especificações ZOF - Zion Orchestration Framework
description: Schemas YAML canônicos para workflows, transições de estado e avaliação EvaluateForEnrich do Zion Orchestration Framework
keywords:
  - ZOF
  - Zion Orchestration Framework
  - workflows conceituais
  - estados canônicos
  - EvaluateForEnrich
  - orquestração IA
  - schemas YAML
framework: ZOF
icon: i-heroicons-bolt
layout: docs
sidebar: true
toc: true
navigation: true
lang: pt
last_updated: 2025-10-31T00:00:00.000Z
order: 3
---

# Especificações ZOF - Zion Orchestration Framework

Esta seção contém as especificações canônicas normativas para o **Zion Orchestration Framework (ZOF)**, definindo schemas YAML para workflows conceituais orientados a IA, transições de estado e checkpoint EvaluateForEnrich.

## 📋 Schemas Disponíveis

### 1. ZOF Workflow Schema
**Arquivo:** `zof-workflow-schema.yaml`  
**Versão:** 1.0.0  
**Propósito:** Especificação para definição de workflows conceituais

<YamlViewer file-path="/content/pt/docs/frameworks/specifications/zof/zof-workflow-schema.yaml" />

#### Estados Canônicos Obrigatórios
1. **intake:** Captura de contexto e requisitos
2. **understand:** Consulta obrigatória ao Oracle (UKIs)  
3. **decide:** Decisão baseada em conhecimento existente
4. **act:** Execução da ação planejada
5. **evaluate_for_enrich:** Checkpoint obrigatório de avaliação
6. **review:** Validação opcional do resultado
7. **enrich:** Enriquecimento condicional do Oracle

#### Eventos Gatilho Canônicos
- `knowledge.added` - Novo conteúdo disponível
- `work.proposed` - Nova proposta de trabalho
- `work.refine.requested` - Solicitação de refinamento
- `assistance.requested` - Pedido de ajuda/colaboração
- `test.authored` - Cenários de teste criados
- `feedback.submitted` - Correção/aprendizado

### 2. ZOF State Transition Schema
**Arquivo:** `zof-state-transition-schema.yaml`  
**Versão:** 1.0.0  
**Propósito:** Especificação para transições entre estados canônicos

<YamlViewer file-path="/content/pt/docs/frameworks/specifications/zof/zof-state-transition-schema.yaml" />

#### Componentes Principais
- **Condições de Transição:** Lógica para mudança de estado
- **Sinais Obrigatórios:** Context, Decision, Result para explicabilidade
- **Validações:** Verificações executadas durante transição
- **Ações:** Operações realizadas na transição
- **Integração MAL:** Detecção e arbitragem de conflitos

### 3. ZOF Enrichment Evaluation Schema
**Arquivo:** `zof-enrichment-evaluation-schema.yaml`  
**Versão:** 1.0.0  
**Propósito:** Especificação para checkpoint EvaluateForEnrich

<YamlViewer file-path="/content/pt/docs/frameworks/specifications/zof/zof-enrichment-evaluation-schema.yaml" />

#### Elementos de Avaliação
- **can_enrich_decision:** Resultado da função can_enrich?()
- **moc_criteria_results:** Avaliação baseada em critérios MOC
- **authority_validation:** Validação de autoridade do usuário
- **conflict_detection:** Detecção de conflitos H1/H2/H3
- **scope_mode_validation:** Validação para operações multi-escopo

## 🎯 Uso das Especificações

### Para Implementadores

#### Estrutura Básica de Workflow ZOF
```yaml
# Exemplo mínimo de workflow ZOF
schema: "1.0"
workflow_id: zof-exemplo-basico
title: "Workflow de Exemplo Básico"
version: "1.0.0"

canonical_states:
  intake:
    description: "Captura de contexto e requisitos"
    signals:
      context: "Requisição inicial recebida"
      decision: "Contexto suficiente para prosseguir"
      result: "Requisitos organizados e validados"
    transitions:
      - target_state: understand
        condition: "completion_criteria_met"
        description: "Prosseguir para consulta Oracle"

  understand:
    description: "Consulta obrigatória ao Oracle"
    signals:
      context: "Consultar conhecimento existente relevante"
      decision: "Oracle consultado com sucesso"
      result: "Conhecimento existente identificado"
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
        description: "Prosseguir para decisão"

  decide:
    description: "Decisão baseada em conhecimento"
    signals:
      context: "Conhecimento Oracle + contexto requisição"
      decision: "Abordagem de implementação definida"
      result: "Estratégia clara para execução"
    transitions:
      - target_state: act
        condition: "decision_made"
        description: "Executar ação planejada"

  act:
    description: "Execução da ação planejada"
    signals:
      context: "Estratégia definida para implementação"
      decision: "Executar conforme planejado"
      result: "Ação concluída com resultado específico"
    transitions:
      - target_state: evaluate_for_enrich
        condition: "action_executed"
        description: "Avaliar para enriquecimento"

  evaluate_for_enrich:
    description: "Checkpoint obrigatório de avaliação"
    signals:
      context: "Resultado da ação disponível para avaliação"
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

#### Configuração de Transição de Estado
```yaml
# Exemplo de transição intake → understand
schema: "1.0"
transition_id: zof-tr-exemplo-001
workflow_ref: zof-exemplo-basico
from_state: intake
to_state: understand

condition:
  type: completion_criteria
  expression: "all_completion_criteria_met && context_captured"
  description: "Critérios de completude atendidos e contexto capturado"

signals:
  context: "Estado intake finalizado com requisitos documentados"
  decision: "Critérios satisfeitos, prosseguindo para consulta Oracle"
  result: "Transição para understand confirmada"

validations:
  - validation_type: state_completeness
    description: "Validar completude do estado intake"
    status: passed
    details: "Todos os campos obrigatórios preenchidos"

actions:
  - action_type: oracle_consultation
    description: "Preparar consulta ao Oracle"
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


## ✅ Validação e Conformidade

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

## 🔗 Integração com Outros Frameworks

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

## 📖 Recursos Relacionados

### Matrix Protocol Frameworks
- **[ZOF - Zion Orchestration Framework](../../zof)** - Documentação completa do framework
- **[Especificações Canônicas](../)** - Todos os schemas do protocolo
- **[Exemplos de Workflows](/docs/examples)** - Casos de uso práticos

### Documentação Técnica
- **[Guia de Implementação](/docs/implementation)** - Como implementar o protocolo
- **[Manual de Ferramentas](/docs/manual/tools)** - Ferramentas de apoio ZOF
- **[Glossário](/docs/glossary)** - Definições e terminologia