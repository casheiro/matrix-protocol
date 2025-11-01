---
title: Schema Test Cases
description: Valid and invalid examples for all Matrix Protocol schemas
icon: i-heroicons-check-badge
layout: docs
sidebar: true
toc: true
navigation: true
lang: en
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
  - test cases
  - valid examples
  - invalid examples
  - schema validation
---

# Schema Test Cases

**Practical valid and invalid examples for all Matrix Protocol frameworks**

> 🎯 **Objective**: Provide comprehensive test cases to validate implementations and understand schema edge cases.

---

## 📋 Index by Framework

- [MEF (Matrix Embedding Framework)](#mef-matrix-embedding-framework)
- [ZOF (Zion Orchestration Framework)](#zof-zion-orchestration-framework)  
- [OIF (Operator Intelligence Framework)](#oif-operator-intelligence-framework)
- [MOC (Matrix Ontology Catalog)](#moc-matrix-ontology-catalog)
- [MAL (Matrix Arbiter Layer)](#mal-matrix-arbiter-layer)

---

## MEF (Matrix Embedding Framework)

### MEF UKI Schema

#### ✅ Valid Examples

**Case 1: Minimal Complete UKI**
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

**Case 2: UKI with Relationships and Metadata**
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

**Case 3: UKI with MAL Arbitration**
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

#### ❌ Invalid Examples

**Error 1: Incorrect ID format**
```yaml
# ❌ Uppercase in scope_ref
schema: "1.0"
id: "uki:Squad-Payments:business_rule:discount"  # ERROR: Squad-Payments
title: "Volume Discount Rules"
version: "1.0.0"
# ... rest of required fields
```

**Error 2: Missing required properties**
```yaml
# ❌ Missing scope_ref, domain_ref, type_ref
schema: "1.0"
id: "uki:squad-payments:business_rule:discount-001"
title: "Volume Discount Rules"
version: "1.0.0"
# ERROR: Required fields missing
created_date: "2024-03-25"
last_modified: "2024-03-25"
status: "active"
content: "Basic discount rules..."
```

**Error 3: Invalid versioning**
```yaml
# ❌ Incorrect version format
schema: "1.0"
id: "uki:squad-payments:business_rule:discount-001"
title: "Volume Discount Rules"
version: "1.0"  # ERROR: Should be 1.0.0 (MAJOR.MINOR.PATCH)
# ... rest of fields
```

**Error 4: Invalid enum**
```yaml
# ❌ Status not allowed
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
status: "enabled"  # ERROR: Must be active, deprecated, archived or sunset
content: "Basic discount rules..."
```

**Error 5: Title too short**
```yaml
# ❌ Title doesn't meet minLength: 10
schema: "1.0"
id: "uki:squad-payments:business_rule:discount-001"
title: "Discount"  # ERROR: Only 8 characters (minimum 10)
version: "1.0.0"
# ... rest of fields
```

### MEF Decision Record Schema

#### ✅ Valid Examples

**Case 1: Complete Decision Record**
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

#### ❌ Invalid Examples

**Error 1: Outcome winner without winner specified**
```yaml
# ❌ outcome = winner but no winner field
schema: "1.0"
decision_id: "mal-dec-20250826-h1-001"
event_ref: "mal-evt-20250826-001"
outcome: "winner"  # ERROR: Requires 'winner' field
# winner: "uki:..." # MISSING
precedence_applied:
  - rule: "P1_authority_weight"
    description: "Higher authority weight"
    impact: "Determined winner"
# ... rest of required fields
```

---

## ZOF (Zion Orchestration Framework)

### ZOF Workflow Schema

#### ✅ Valid Examples

**Case 1: Onboarding Workflow**
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

#### ❌ Invalid Examples

**Error 1: Invalid step_type**
```yaml
# ❌ step_type not allowed
schema: "1.0"
id: "zof-wf-invalid-step"
title: "Invalid Step Workflow"
version: "1.0.0"
description: "Workflow with invalid step type"
workflow_type: "sequential"
trigger_type: "manual"
steps:
  - step_id: "invalid_step"
    step_type: "custom_type"  # ERROR: Must be human_task, automated, decision, parallel, or subprocess
    title: "Invalid Step"
# ... rest of fields
```

---

## OIF (Operator Intelligence Framework)

### OIF Archetype Schema

#### ✅ Valid Examples

**Case 1: Data Analysis Archetype**
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

#### ❌ Invalid Examples

**Error 1: Invalid archetype_type**
```yaml
# ❌ archetype_type not allowed
schema: "1.0"
archetype_id: "oif-arch-invalid"
name: "Invalid Archetype"
version: "1.0.0"
description: "Archetype with invalid type"
archetype_type: "custom_type"  # ERROR: Must be analytical, operational, creative, or advisory
domain_focus: "general"
# ... rest of fields
```

---

## MOC (Matrix Ontology Catalog)

### MOC Hierarchy Schema

#### ✅ Valid Examples

**Case 1: Organizational Hierarchy**
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

#### ❌ Invalid Examples

**Error 1: Invalid hierarchy_type**
```yaml
# ❌ hierarchy_type not allowed
schema: "1.0"
hierarchy_id: "moc-hier-invalid"
name: "Invalid Hierarchy"
version: "1.0.0"
description: "Hierarchy with invalid type"
hierarchy_type: "custom_type"  # ERROR: Must be organizational, technical, domain, or process
# ... rest of fields
```

---

## MAL (Matrix Arbiter Layer)

### MAL Decision Record Schema

#### ✅ Valid Examples

**Case 1: Complete H1 Decision**
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

#### ❌ Invalid Examples

**Error 1: Incorrect decision_id format**
```yaml
# ❌ Invalid decision_id format
schema: "1.0"
decision_id: "mal-decision-20250826-h1-001"  # ERROR: Should be mal-dec-YYYYMMDD-[a-z0-9]+-[0-9]+
event_ref: "mal-evt-20250826-001"
outcome: "winner"
# ... rest of fields
```

**Error 2: Incorrect event_ref format**
```yaml
# ❌ Invalid event_ref format
schema: "1.0"
decision_id: "mal-dec-20250826-h1-001"
event_ref: "mal-event-20250826-001"  # ERROR: Should be mal-evt-YYYYMMDD-[0-9]+
outcome: "winner"
# ... rest of fields
```

---

## 💡 Tips for Edge Cases

### Date Validation
- **ISO 8601 required**: `2024-03-25` (date) or `2025-08-26T14:30:25.123Z` (date-time)
- **Time zones**: Always use UTC (Z) for timestamps
- **Precision**: Milliseconds are optional but recommended for audit trails

### Identifiers
- **Case sensitivity**: Always lowercase for UKI IDs, decision IDs, etc.
- **Special characters**: Only hyphens (-) and underscores (_) where permitted
- **Length**: Consider practical limits (UKI slug < 50 chars)

### Text Content
- **Markdown**: `content` field accepts Markdown for formatting
- **Encoding**: UTF-8 for international support
- **Size**: Strictly respect `minLength` and `maxLength`

### Relationships
- **Circular reference**: Avoid UKIs that reference each other cyclically
- **Valid targets**: Always validate referenced UKIs exist
- **Strength consistency**: Use same strength in bidirectional relationships

---

**🔍 For more information, see:**
- [Usage Guide](./schema-usage-guide) - How to implement validation
- [Patterns Reference](./patterns-reference) - Detailed regex explanations
- [Customization Guide](./customization-guide) - How to extend schemas