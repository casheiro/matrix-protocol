---
title: Casos de Teste dos Schemas
description: Exemplos válidos e inválidos para todos os schemas do Matrix Protocol
icon: i-heroicons-check-badge
layout: docs
sidebar: true
toc: true
navigation: true
lang: pt
last_updated: 2025-11-01T00:00:00.000Z
order: 2
framework: general
tags:
  - schemas
  - testing
  - validation
  - examples
keywords:
  - Matrix Protocol
  - casos de teste
  - exemplos válidos
  - exemplos inválidos
  - validação schemas
---

# Casos de Teste dos Schemas

**Exemplos práticos válidos e inválidos para todos os frameworks do Matrix Protocol**

> 🎯 **Objetivo**: Fornecer casos de teste compreensivos para validar implementações e entender edge cases dos schemas.

---

## 📋 Índice por Framework

- [MEF (Matrix Embedding Framework)](#mef-matrix-embedding-framework)
- [ZOF (Zion Orchestration Framework)](#zof-zion-orchestration-framework)  
- [OIF (Operator Intelligence Framework)](#oif-operator-intelligence-framework)
- [MOC (Matrix Ontology Catalog)](#moc-matrix-ontology-catalog)
- [MAL (Matrix Arbiter Layer)](#mal-matrix-arbiter-layer)

---

## MEF (Matrix Embedding Framework)

### MEF UKI Schema

#### ✅ Exemplos Válidos

**Caso 1: UKI Completa Mínima**
```yaml
schema: "1.0"
id: "uki:squad-payments:business_rule:discount-logic-001"
title: "Volume and Coupon Discount Rules"
version: "1.0.0"
scope_ref: "squad-payments"
domain_ref: "business"
type_ref: "business_rule"
maturity_ref: "validated"
created_date: "2024-03-25"
last_modified: "2024-03-25"
status: "active"
content: |
  ## Discount Rules
  
  Automatic application based on total value and available coupons.
  
  ### Logic
  1. Calculate base discount from volume
  2. Apply coupon if available
  3. Ensure maximum 30% total discount
```

**Caso 2: UKI com Relacionamentos e Metadados**
```yaml
schema: "1.0"
id: "uki:tribe-platform:pattern:authentication-jwt"
title: "JWT Authentication Pattern for APIs"
version: "2.1.0"
scope_ref: "tribe-platform"
domain_ref: "technical"
type_ref: "pattern"
maturity_ref: "endorsed"
created_date: "2024-01-15"
last_modified: "2024-03-25"
status: "active"
content: |
  ## JWT Authentication Implementation
  
  Standard pattern for API authentication using JWT tokens.
change_summary: "Added refresh token rotation and improved security headers"
change_impact: "minor"
previous_version: "2.0.3"
relationships:
  - type: "depends_on"
    target: "uki:org:policy:security-standards"
    description: "Must comply with organizational security standards"
    strength: "strong"
  - type: "complements"
    target: "uki:tribe-platform:pattern:api-versioning"
    description: "Works together with API versioning strategy"
    strength: "moderate"
tags:
  - "authentication"
  - "jwt"
  - "security"
  - "api"
authors:
  - name: "Jane Smith"
    role: "Security Architect"
    email: "jane.smith@company.com"
governance:
  approval_authority: "Security Team"
  approval_date: "2024-03-20"
  review_cycle: "quarterly"
  compliance_tags:
    - "iso27001"
    - "gdpr"
```

**Caso 3: UKI com Arbitragem MAL**
```yaml
schema: "1.0"
id: "uki:squad-x:rule:data-retention-30d"
title: "30-Day Data Retention Rule"
version: "1.0.0"
scope_ref: "squad-x"
domain_ref: "compliance"
type_ref: "rule"
maturity_ref: "validated"
created_date: "2025-08-26"
last_modified: "2025-08-26"
status: "active"
content: |
  ## Data Retention Policy
  
  All user data must be retained for exactly 30 days after account deletion.
decision_record_ref: "mal-dec-20250826-h1-001"
arbitration_metadata:
  conflict_type: "H1"
  resolution_outcome: "winner"
  arbitrated_at: "2025-08-26T14:30:25.123Z"
```

#### ❌ Exemplos Inválidos

**Erro 1: ID com formato incorreto**
```yaml
# ❌ Maiúscula no scope_ref
schema: "1.0"
id: "uki:Squad-Payments:business_rule:discount"  # ERRO: Squad-Payments
title: "Volume Discount Rules"
version: "1.0.0"
# ... resto dos campos obrigatórios
```

**Erro 2: Propriedades obrigatórias faltando**
```yaml
# ❌ Falta scope_ref, domain_ref, type_ref
schema: "1.0"
id: "uki:squad-payments:business_rule:discount-001"
title: "Volume Discount Rules"
version: "1.0.0"
# ERRO: Campos obrigatórios ausentes
created_date: "2024-03-25"
last_modified: "2024-03-25"
status: "active"
content: "Basic discount rules..."
```

**Erro 3: Versionamento inválido**
```yaml
# ❌ Formato de versão incorreto
schema: "1.0"
id: "uki:squad-payments:business_rule:discount-001"
title: "Volume Discount Rules"
version: "1.0"  # ERRO: Deve ser 1.0.0 (MAJOR.MINOR.PATCH)
# ... resto dos campos
```

**Erro 4: Enum inválido**
```yaml
# ❌ Status não permitido
schema: "1.0"
id: "uki:squad-payments:business_rule:discount-001"
title: "Volume Discount Rules"
version: "1.0.0"
scope_ref: "squad-payments"
domain_ref: "business"
type_ref: "business_rule"
maturity_ref: "validated"
created_date: "2024-03-25"
last_modified: "2024-03-25"
status: "enabled"  # ERRO: Deve ser active, deprecated, archived ou sunset
content: "Basic discount rules..."
```

**Erro 5: Título muito curto**
```yaml
# ❌ Título não atende minLength: 10
schema: "1.0"
id: "uki:squad-payments:business_rule:discount-001"
title: "Discount"  # ERRO: Apenas 8 caracteres (mínimo 10)
version: "1.0.0"
# ... resto dos campos
```

### MEF Decision Record Schema

#### ✅ Exemplos Válidos

**Caso 1: Decision Record Completo**
```yaml
schema: "1.0"
decision_id: "mal-dec-20250826-h1-001"
event_ref: "mal-evt-20250826-001"
outcome: "winner"
winner: "uki:squad-x:rule:data-retention-30d"
losers:
  - "uki:squad-x:rule:data-retention-7d"
precedence_applied:
  - rule: "P1_authority_weight"
    description: "Higher authority weight determines precedence"
    impact: "Determined winner by superior organizational authority"
    weight: 0.8
epistemic_rationale:
  summary: "Validated maturity and stronger regulatory evidence determined the choice"
  reasoning: |
    While both UKIs operate in equivalent scope, the 30-day retention rule
    has validated maturity level and stronger regulatory backing through
    GDPR compliance requirements.
  references:
    moc_nodes:
      - "hierarchies.scope.squad-x"
      - "hierarchies.domain.compliance"
    mef_evidence:
      - "uki:org:policy:gdpr-compliance"
    external_references:
      - "doc:gdpr-art-17"
      - "reg:lgpd-art-16"
audit:
  decided_at: "2025-08-26T14:30:25.123Z"
  decided_by: "mal-v1.0.0"
  timeout_used_ms: 1250
  arbitration_timeout_ms: 2000
mef_metadata:
  persistence_id: "mef-dr-20250826-a1b2c3d4"
  persistence_date: "2025-08-26T14:30:26.789Z"
  immutable: true
  checksum: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456"
  retention_policy: "permanent"
conflict_details:
  event_type: "H1"
  conflict_description: "Two data retention rules of equivalent scope in conflict"
  candidates:
    - uki_ref: "uki:squad-x:rule:data-retention-30d"
      scope_ref: "squad-x"
      domain_ref: "compliance"
      maturity_level: "validated"
      version: "1.0.0"
    - uki_ref: "uki:squad-x:rule:data-retention-7d"
      scope_ref: "squad-x"
      domain_ref: "compliance"
      maturity_level: "endorsed"
      version: "1.0.0"
```

#### ❌ Exemplos Inválidos

**Erro 1: Outcome winner sem winner especificado**
```yaml
# ❌ outcome = winner mas sem campo winner
schema: "1.0"
decision_id: "mal-dec-20250826-h1-001"
event_ref: "mal-evt-20250826-001"
outcome: "winner"  # ERRO: Requer campo 'winner'
# winner: "uki:..." # FALTANDO
precedence_applied:
  - rule: "P1_authority_weight"
    description: "Higher authority weight"
    impact: "Determined winner"
# ... resto dos campos obrigatórios
```

---

## ZOF (Zion Orchestration Framework)

### ZOF Workflow Schema

#### ✅ Exemplos Válidos

**Caso 1: Workflow de Onboarding**
```yaml
schema: "1.0"
id: "zof-wf-user-onboarding-v2"
title: "User Onboarding Workflow v2"
version: "2.1.0"
description: "Complete user onboarding process with KYC and account setup"
workflow_type: "sequential"
trigger_type: "event"
trigger_config:
  event_pattern: "user.registration.completed"
  conditions:
    - field: "user.type"
      operator: "equals"
      value: "premium"
steps:
  - step_id: "kyc_verification"
    step_type: "human_task"
    title: "KYC Document Verification"
    description: "Verify user identity documents"
    timeout_minutes: 1440  # 24 hours
    assignee_config:
      type: "role"
      value: "kyc_analyst"
    input_schema_ref: "zof:schemas:kyc_input:1.0"
    output_schema_ref: "zof:schemas:kyc_output:1.0"
  - step_id: "account_provisioning"
    step_type: "automated"
    title: "Account Provisioning"
    description: "Create user account and initial setup"
    timeout_minutes: 30
    automation_config:
      service: "account_service"
      endpoint: "/api/v1/accounts/provision"
      method: "POST"
outcome_actions:
  - condition: "workflow.status == 'completed'"
    action_type: "notification"
    config:
      template: "onboarding_complete"
      recipients: ["user", "account_manager"]
metadata:
  created_by: "workflow_designer"
  created_date: "2024-03-25"
  last_modified: "2024-03-25"
  tags:
    - "onboarding"
    - "kyc"
    - "premium"
```

#### ❌ Exemplos Inválidos

**Erro 1: step_type inválido**
```yaml
# ❌ step_type não permitido
schema: "1.0"
id: "zof-wf-invalid-step"
title: "Invalid Step Workflow"
version: "1.0.0"
description: "Workflow with invalid step type"
workflow_type: "sequential"
trigger_type: "manual"
steps:
  - step_id: "invalid_step"
    step_type: "custom_type"  # ERRO: Deve ser human_task, automated, decision, parallel, ou subprocess
    title: "Invalid Step"
# ... resto dos campos
```

---

## OIF (Operator Intelligence Framework)

### OIF Archetype Schema

#### ✅ Exemplos Válidos

**Caso 1: Archetype de Análise de Dados**
```yaml
schema: "1.0"
archetype_id: "oif-arch-data-analyst-v1"
name: "Data Analyst Archetype"
version: "1.0.0"
description: "AI archetype specialized in data analysis and insights generation"
archetype_type: "analytical"
domain_focus: "data_science"
capabilities:
  - capability_id: "data_exploration"
    name: "Data Exploration"
    description: "Analyze datasets to identify patterns and anomalies"
    proficiency_level: "expert"
    tools_required:
      - "pandas"
      - "jupyter"
      - "plotly"
  - capability_id: "statistical_analysis"
    name: "Statistical Analysis"
    description: "Perform statistical tests and hypothesis validation"
    proficiency_level: "advanced"
interaction_patterns:
  - pattern_type: "request_response"
    trigger: "analysis_request"
    expected_input:
      - "dataset_reference"
      - "analysis_objectives"
    expected_output:
      - "insights_summary"
      - "visualization_assets"
    response_time_sla: "2_hours"
knowledge_requirements:
  - domain: "statistics"
    level: "advanced"
  - domain: "data_visualization"
    level: "expert"
metadata:
  created_by: "ai_architect"
  created_date: "2024-03-25"
  maturity_level: "validated"
  tags:
    - "analytics"
    - "data_science"
    - "insights"
```

#### ❌ Exemplos Inválidos

**Erro 1: archetype_type inválido**
```yaml
# ❌ archetype_type não permitido
schema: "1.0"
archetype_id: "oif-arch-invalid"
name: "Invalid Archetype"
version: "1.0.0"
description: "Archetype with invalid type"
archetype_type: "custom_type"  # ERRO: Deve ser analytical, operational, creative, ou advisory
domain_focus: "general"
# ... resto dos campos
```

---

## MOC (Matrix Ontology Catalog)

### MOC Hierarchy Schema

#### ✅ Exemplos Válidos

**Caso 1: Hierarquia Organizacional**
```yaml
schema: "1.0"
hierarchy_id: "moc-hier-org-structure-v1"
name: "Organizational Structure Hierarchy"
version: "1.0.0"
description: "Complete organizational hierarchy with tribes and squads"
hierarchy_type: "organizational"
root_node:
  node_id: "organization"
  name: "TechCorp"
  type: "organization"
  metadata:
    employees_count: 500
    founding_year: 2010
nodes:
  - node_id: "tribe-platform"
    name: "Platform Tribe"
    type: "tribe"
    parent_id: "organization"
    children:
      - "squad-infrastructure"
      - "squad-security"
    metadata:
      tribe_lead: "Alice Johnson"
      focus_area: "platform_engineering"
  - node_id: "squad-infrastructure"
    name: "Infrastructure Squad"
    type: "squad"
    parent_id: "tribe-platform"
    metadata:
      squad_lead: "Bob Smith"
      tech_stack: ["kubernetes", "terraform", "golang"]
relationships:
  - source_node: "squad-infrastructure"
    target_node: "squad-security"
    relationship_type: "collaborates_with"
    strength: "strong"
    description: "Infrastructure squad works closely with security on platform hardening"
validation_rules:
  - rule_id: "unique_node_ids"
    description: "All node IDs must be unique within the hierarchy"
  - rule_id: "valid_parent_references"
    description: "All parent_id references must point to existing nodes"
metadata:
  created_by: "org_architect"
  created_date: "2024-03-25"
  last_updated: "2024-03-25"
  version_notes: "Initial organizational structure definition"
```

#### ❌ Exemplos Inválidos

**Erro 1: hierarchy_type inválido**
```yaml
# ❌ hierarchy_type não permitido
schema: "1.0"
hierarchy_id: "moc-hier-invalid"
name: "Invalid Hierarchy"
version: "1.0.0"
description: "Hierarchy with invalid type"
hierarchy_type: "custom_type"  # ERRO: Deve ser organizational, technical, domain, ou process
# ... resto dos campos
```

---

## MAL (Matrix Arbiter Layer)

### MAL Decision Record Schema

#### ✅ Exemplos Válidos

**Caso 1: Decisão H1 Completa**
```yaml
schema: "1.0"
decision_id: "mal-dec-20250826-h1-001"
event_ref: "mal-evt-20250826-001"
outcome: "winner"
winner: "uki:squad-x:rule:data-retention-30d"
losers:
  - "uki:squad-x:rule:data-retention-7d"
precedence_applied:
  - rule: "P1_authority_weight"
    description: "Higher authority weight determines precedence in equivalent scopes"
    impact: "Determined winner by superior organizational authority validation"
    weight: 0.85
  - rule: "P3_maturity_level"
    description: "Validated maturity takes precedence over endorsed"
    impact: "Reinforced decision through maturity level comparison"
    weight: 0.75
epistemic_rationale:
  summary: "Regulatory compliance and validated maturity determined the winning rule"
  reasoning: |
    Analysis of both competing data retention rules shows equivalent scope
    coverage but different maturity levels and regulatory backing. The 30-day
    retention rule has undergone full validation process and has explicit
    GDPR Article 17 compliance documentation, while the 7-day rule remains
    at endorsed level with limited regulatory analysis.
  references:
    moc_nodes:
      - "hierarchies.scope.squad-x"
      - "hierarchies.domain.compliance"
      - "hierarchies.authority.data-governance"
    mef_evidence:
      - "uki:org:policy:gdpr-compliance"
      - "uki:legal:requirement:data-retention-standards"
    external_references:
      - "doc:gdpr-art-17-analysis"
      - "reg:lgpd-art-16-mapping"
      - "audit:data-governance-2024"
audit:
  decided_at: "2025-08-26T14:30:25.123Z"
  decided_by: "mal-v1.0.0"
  timeout_used_ms: 1250
  arbitration_timeout_ms: 5000
mef_metadata:
  persistence_id: "mef-dr-20250826-a1b2c3d4"
  persistence_date: "2025-08-26T14:30:26.789Z"
  immutable: true
  checksum: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456"
  retention_policy: "permanent"
conflict_details:
  event_type: "H1"
  conflict_description: "Two data retention rules with equivalent scope but different retention periods in direct conflict"
  candidates:
    - uki_ref: "uki:squad-x:rule:data-retention-30d"
      scope_ref: "squad-x"
      domain_ref: "compliance"
      maturity_level: "validated"
      version: "1.0.0"
      evidence_refs:
        - "uki:org:policy:gdpr-compliance"
        - "uki:legal:requirement:data-retention-standards"
    - uki_ref: "uki:squad-x:rule:data-retention-7d"
      scope_ref: "squad-x"
      domain_ref: "compliance"
      maturity_level: "endorsed"
      version: "1.0.0"
      evidence_refs:
        - "uki:squad-x:guideline:lean-data-practices"
actions:
  - "allow_enrich:uki:squad-x:rule:data-retention-30d"
  - "deprecate:uki:squad-x:rule:data-retention-7d"
organizational_context:
  user_authority: "squad_lead"
  user_scopes:
    - "squad-x"
    - "tribe-data"
  operation: "enrich"
  policy_ref: "moc:arbitration:compliance_priority"
```

#### ❌ Exemplos Inválidos

**Erro 1: decision_id com formato incorreto**
```yaml
# ❌ Formato de decision_id inválido
schema: "1.0"
decision_id: "mal-decision-20250826-h1-001"  # ERRO: Deve ser mal-dec-YYYYMMDD-[a-z0-9]+-[0-9]+
event_ref: "mal-evt-20250826-001"
outcome: "winner"
# ... resto dos campos
```

**Erro 2: event_ref com formato incorreto**
```yaml
# ❌ Formato de event_ref inválido
schema: "1.0"
decision_id: "mal-dec-20250826-h1-001"
event_ref: "mal-event-20250826-001"  # ERRO: Deve ser mal-evt-YYYYMMDD-[0-9]+
outcome: "winner"
# ... resto dos campos
```

---

## 💡 Dicas para Casos Extremos

### Validação de Datas
- **ISO 8601 obrigatório**: `2024-03-25` (date) ou `2025-08-26T14:30:25.123Z` (date-time)
- **Fusos horários**: Sempre use UTC (Z) para timestamps
- **Precisão**: Milissegundos são opcionais mas recomendados para audit trails

### Identificadores
- **Case sensitivity**: Sempre minúsculo para UKI IDs, decision IDs, etc.
- **Caracteres especiais**: Apenas hífens (-) e underscores (_) onde permitido
- **Comprimento**: Considere limites práticos (UKI slug < 50 chars)

### Conteúdo de Texto
- **Markdown**: Campo `content` aceita Markdown para formatação
- **Codificação**: UTF-8 para suporte internacional
- **Tamanho**: Respeite `minLength` e `maxLength` rigorosamente

### Relacionamentos
- **Referência circular**: Evite UKIs que referenciam umas às outras ciclicamente
- **Targets válidos**: Sempre valide se UKIs referenciadas existem
- **Strength consistency**: Use mesma força em relacionamentos bidirecionais

---

**🔍 Para mais informações, consulte:**
- [Guia de Uso](./schema-usage-guide) - Como implementar validação
- [Referência de Patterns](./patterns-reference) - Explicação detalhada de regex
- [Guia de Customização](./customization-guide) - Como estender schemas