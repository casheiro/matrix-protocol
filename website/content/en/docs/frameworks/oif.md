---
title: OIF — Operator Intelligence Framework
description: Framework for AI archetypes hierarchically aware of organizational governance in Matrix Protocol
icon: i-heroicons-cpu-chip
layout: docs
sidebar: true
toc: true
navigation: true
---

# OIF — Operator Intelligence Framework
**Acronym:** OIF  
**Version:** 0.0.1-beta  
**Last Update:** 2025-10-05  

> ⚠️ **IMPORTANT**: This document is an informative translation.

> "The mind that opens to a new idea will never return to its original size." — Albert Einstein

---

## 1. Introduction

The **Operator Intelligence Framework (OIF)** is the conceptual system that defines how artificial intelligences materialize as genuine collaborators in the Matrix Protocol.

This framework establishes the ontology, methodology and governance to create, evaluate and evolve intelligence archetypes that serve as a bridge between the Oracle's structured knowledge and Zion's conceptual flows.

OIF is completely **hierarchical governance-aware** through MOC, ensuring that all intelligences operate within appropriate organizational contexts.

---

## 2. Terms and Definitions

- **Intelligence Archetypes**: Conceptual models of specialized artificial intelligence
- **Knowledge Agent**: Archetype specialized in MEF knowledge with MOC access control
- **Workflow Agent**: Archetype specialized in ZOF flow orchestration
- **Hierarchical Explainability**: Explanations that cite specific MOC nodes
- **Contextual Filtering**: Knowledge filtering based on user hierarchical context
- **Authority Validation**: Permission checks delegated to organizational MOC

Additional references in **MOC (Matrix Ontology Catalog)** for specific organizational taxonomies.

---

## 3. Core Concepts

### Archetype Definition via OIF

OIF defines three main categories of intelligence:

**Knowledge Agent (Oracle Intelligence)**
- Archetype specialized in understanding, organizing and relating MEF structured knowledge
- Access control based on organizational MOC
- Capabilities: semantic search, knowledge filtering, explanation generation

**Workflow Agent (Zion Intelligence)**
- Archetype specialized in ZOF conceptual flow orchestration
- EvaluateForEnrich checkpoint execution with MOC criteria
- Capabilities: flow state management, Oracle consultation, enrichment evaluation

**Specialized Archetypes**
- Methodology for creating custom intelligences for specific domains
- Authority levels defined by organizational MOC
- Governance awareness: complete integration with MOC hierarchies

### MOC-Integrated Capabilities

- **Pertinence Resolution**: Filter and present UKIs based on user scope and domain permissions
- **Authority Validation**: Verify if user has necessary authority for operations
- **Governance Explainability**: Provide transparent explanations referencing specific MOC nodes
- **Escalation Paths**: Automatically route requests requiring higher authority

---

## 4. Normative Rules

> ⚠️ This section is **normative**.

### Mandatory Archetypes
OIF implementations MUST include at least:
- **Knowledge Agent**: For MEF knowledge management
- **Workflow Agent**: For ZOF flow orchestration

### Mandatory MOC Integration
All archetypes MUST:
- Consult MOC for authority validation before operations
- Filter knowledge based on user hierarchical context
- Generate explanations that reference specific MOC nodes
- Implement escalation paths according to MOC configuration

### Mandatory Access Control
- Knowledge Agents MUST filter UKIs based on user scope_ref and domain_ref
- Workflow Agents MUST validate authority before executing enrichment
- Explanations MUST cite specific MOC nodes for transparency

### Intelligence Quality
Implementations MUST include metrics for:
- **Explainability**: Clarity and traceability of explanations
- **Hierarchical Filtering**: Accuracy in respecting MOC hierarchies
- **Derived Authority**: Rate of contextualization and avoiding absolute truths

### 🧩 Archetype Levels (Normative)

The Operator Intelligence Framework (OIF) defines **three archetype levels**.  
This classification establishes a clear distinction between elements that are **central to Matrix Protocol** and those that are **contextually derived by organizations**.

#### 1. Canonical Archetypes (Mandatory)
- **Knowledge Agent (KAG)**  
- **Workflow Agent (WAG)**  

These archetypes are **always present** in OIF and constitute the **irreducible minimum** of Matrix Protocol.  
They are **transversal to the protocol**, independent of organizational context, and **MUST** be implemented in every deployment.

#### 2. Specialized Archetypes (Configurable)
- Defined by organizations through **MOC (Matrix Ontology Catalog)**.  
- Always parameterized with `domain_ref` and `scope_ref`.  
- Their authority is **derivative**, validated against MOC authority maps.  
- **MUST NOT** override canonical archetypes, but can extend them with domain-specific functions (e.g., Security Guidance Agent).  
- Specialized archetypes **MUST** produce outputs conforming to OIF explainability templates.

#### 3. Ephemeral Archetypes (Experimental, Optional)
- Created **ad-hoc** during explorations, innovation cycles or temporary contexts.  
- Valid only within the session or restricted scope defined in MOC.  
- **MUST NOT** persist in MEF or generate lasting UKIs.  
- Their status is **non-canonical** and **MUST** be explicitly marked as `ephemeral: true`.  
- Ephemeral archetypes are intended for **experimentation and prototyping**, never for critical governance flows.

#### 🔗 Integration Rules
- **MEP (Matrix Epistemic Principle)**: establishes that **all archetypes derive authority** from context; canonical archetypes derive it from the protocol itself.  
- **MOC (Matrix Ontology Catalog)**: provides definitions, scopes and authority maps for specialized and ephemeral archetypes.  
- **MEF (Matrix Embedding Framework)**: can store outputs from canonical and specialized archetypes; ephemeral archetypes are explicitly excluded.  
- **ZOF (Zion Orchestration Framework)**: orchestrates flows between archetypes, respecting MOC authority validation.  
- **OIF (Operator Intelligence Framework)**: maintains explainability, ensuring outputs clearly distinguish archetype level (`canonical`, `specialized`, or `ephemeral`).

#### ⚖️ Normative Restrictions
1. **Canonical archetypes MUST always be implemented.**  
2. **Specialized archetypes MUST be validated via MOC** and cannot supersede canonical archetypes.  
3. **Ephemeral archetypes MUST NOT persist** beyond their session or origin scope.  
4. All archetypes MUST comply with OIF explainability standards.
5. **Canonical archetype prompts MUST NEVER be overridden or modified.**

### 🔧 Archetype Metadata (Normative Extension)

Each archetype definition in OIF MUST include an `archetype_level` field to explicitly declare its canonical status.

#### Field Specification
- **Field name**: `archetype_level`
- **Allowed values**:  
  - `canonical` → reserved for Knowledge Agent (KAG) and Workflow Agent (WAG).  
  - `specialized` → domain or scope-specific archetypes defined via MOC.  
  - `ephemeral` → ad-hoc, temporary, non-persistent archetypes.  

#### Normative Archetype Definitions
```yaml

# Canonical Archetypes (Protocol Core)
archetype_id: kag
archetype_name: Knowledge Agent
archetype_level: canonical
domain_ref: global
scope_ref: all
specialization: "Understanding and organization of MEF knowledge"

archetype_id: wag
archetype_name: Workflow Agent
archetype_level: canonical
domain_ref: global
scope_ref: all
specialization: "Orchestration of ZOF conceptual flows"

# Specialized Archetype Example
archetype_id: gad.security
archetype_name: Guidance Agent - Security
archetype_level: specialized
domain_ref: security
scope_ref: organization
specialization: "Security-specific guidance and policy compliance"
moc_validation_required: true

# Ephemeral Archetype Example
archetype_id: gad.prototype
archetype_name: Prototype Agent
archetype_level: ephemeral
domain_ref: experimental
scope_ref: sandbox
specialization: "Ad-hoc prototyping and exploration"
session_lifetime: true
persistence_allowed: false
```


### 🔒 Canonical Prompt Preservation (Normative)

OIF MUST implement immutable prompt protection for canonical archetypes to preserve protocol integrity while allowing organizational customization through specialized archetypes.

#### Archetype Customization Matrix
```yaml

# --- Normative Customization Rules ---
archetype_customization_matrix:
  canonical_archetypes:
    prompt_modification: PROHIBITED       # Core prompts are immutable
    behavioral_extension: PROHIBITED      # Cannot alter core behavior
    organizational_context: PERMITTED     # Can reference organizational MOC
    output_formatting: LIMITED            # Only presentation layer changes
    domain_specialization: PROHIBITED     # Must remain domain-agnostic
    
  specialized_archetypes:
    prompt_modification: PERMITTED        # Can customize prompts via MOC
    behavioral_extension: PERMITTED       # Can extend base behaviors
    organizational_context: MANDATORY     # Must integrate with MOC
    output_formatting: PERMITTED          # Full formatting control
    domain_specialization: MANDATORY      # Must be domain-specific
    
  ephemeral_archetypes:
    prompt_modification: UNRESTRICTED     # Ad-hoc modification allowed
    behavioral_extension: UNRESTRICTED    # Experimental behaviors allowed
    organizational_context: OPTIONAL      # Can bypass MOC validation
    output_formatting: UNRESTRICTED       # Complete formatting freedom
    domain_specialization: OPTIONAL       # Can be domain-agnostic
```


#### Prompt Immutability Application
```yaml

# --- Normative Protection Rules ---
canonical_prompt_protection:
  immutability_scope:
    core_system_prompt: IMMUTABLE         # Base archetype instructions never change
    knowledge_access_patterns: IMMUTABLE  # How archetypes access MEF/Oracle
    workflow_integration: IMMUTABLE       # How archetypes integrate with ZOF
    authority_validation: IMMUTABLE       # How archetypes validate MOC authority
    
  permitted_variations:
    response_formatting: SURFACE_ONLY     # Only presentation changes
    language_localization: PERMITTED      # Multi-language support
    organizational_references: CONTEXT_ONLY # MOC node references in examples
    
  enforcement_mechanism:
    validation_checkpoint: "archetype_instantiation"
    authority_source: "protocol_specification"
    override_authority: NONE              # No override possible
    violation_response: REJECT_INSTANTIATION
```


#### Specialized Archetype Extension Patterns
```yaml

# --- Normative Extension Rules ---
specialized_extension_patterns:
  inheritance_model: "composition_over_modification"
  base_archetype_preservation: MANDATORY
  
  allowed_extensions:
    domain_specific_knowledge:
      source: "MOC domain hierarchies"
      validation: "domain experts via MOC authority"
      
    organizational_context:
      source: "MOC scope and governance rules"
      validation: "organizational hierarchy via MOC"
      
    specialized_workflows:
      source: "ZOF organizational flow definitions"
      validation: "workflow authorities via MOC"
      
  extension_validation:
    moc_approval_required: true
    canonical_archetype_integrity_check: true
    semantic_consistency_validation: true
    authority_scope_verification: true
```


#### Archetype Level Governance
- **Canonical**: Protocol-level governance; no organizational override permitted
- **Specialized**: Organizational governance via MOC; must extend, not replace, canonical behavior
- **Ephemeral**: Session-level governance; no persistent validation required

### 📋 Arbitration Explanation Template (Normative Extension)

OIF implementations MUST provide a standardized template for explaining MAL arbitration decisions to users.

#### Mandatory Template Fields
```yaml

# --- Normative Interface ---
arbitration_explanation_template:
  decision_id: string                 # Mandatory: MAL decision identifier
  event_type: enum[H1, H2, H3]        # Mandatory: Conflict type
  outcome: enum[winner, coexist, reject_all, defer]  # Mandatory: Arbitration result
  
  summary: string                     # Mandatory: User-friendly explanation
  reason_code: string                 # Mandatory: Structured reason identifier
  
  winner: string                      # Conditional: Chosen UKI (if outcome=winner)
  losers: array[string]               # Conditional: Defeated UKIs (if applicable)
  
  precedence_explanation:             # Mandatory: Applied precedence rules
    - rule: string                    # P1, P2, P3, etc.
      description: string             # Human-readable explanation
      impact: string                  # How this rule affected the decision
  
  moc_references:                     # Mandatory: Referenced authority nodes
    - node_id: string                 # MOC node identifier
      node_type: enum[scope, domain, authority, policy]
      relevance: string               # Why this node was relevant
  
  next_steps: string                  # Mandatory: Recommended user actions
  escalation_path: string             # Optional: Available escalation options
  
  metadata:
    decided_at: ISO8601               # Decision timestamp
    user_authority: string            # User authority level
    user_scope: array[string]         # User accessible scopes
```


#### Template Usage Requirements
- OIF MUST render arbitration explanations using this template structure
- All explanations MUST include epistemic justifications aligned with MEP principles
- Explanations MUST cite specific MOC nodes for transparency
- OIF MUST NOT execute arbitration; MUST only explain MAL decisions
- Templates MUST be configurable by organization while maintaining core structure

---

## 5. Interoperability

- **MEF (Matrix Embedding Framework)**: Archetypes consume and produce structured UKIs; provides Decision Record data for arbitration explanations
- **ZOF (Zion Orchestration Framework)**: Workflow Agents orchestrate ZOF flows; invokes MAL and delegates explanation to OIF
- **MOC (Matrix Ontology Catalog)**: Source of governance and access control for all archetypes; configures arbitration explanation templates
- **MEP (Matrix Epistemic Principle)**: Epistemological foundations for explainability and derived authority; guides arbitration explanation justifications
- **MAL (Matrix Arbiter Layer)**: Provides Decision Records that OIF MUST explain to users via Arbitration Explanation Templates; OIF maintains epistemic humility not overriding MAL determinations; ensures arbitration transparency

---

## 6. Conventions and Examples

All examples in this document are **merely illustrative** and do not define normative behavior.  
Normative semantics (scopes, governance, archetypes, enrichment criteria) are always derived from each organization's **MOC (Matrix Ontology Catalog)**.  
Examples are provided for clarity and MAY be adapted to local contexts, but MUST NOT be treated as protocol-level obligations.

---

## 7. Illustrative Examples (Appendix)

> **Example (Informative, MOC-Dependent)**

### **Knowledge Agent - Oracle Intelligence**
```yaml

# --- Illustrative Example ---
knowledge_agent_archetype:
  archetype_id: kag
  archetype_name: "Knowledge Agent"
  archetype_level: canonical
  specialization: "Understanding, organization and relationship of MEF knowledge"
  moc_integration: "Access control based on organizational hierarchies"
  
  core_capabilities:
    semantic_search: "Intelligent search in UKIs with MOC filtering"
    knowledge_filtering: "Presents only knowledge authorized by user context"
    explanation_generation: "Generates explanations citing specific MOC nodes"
    relationship_mapping: "Identifies semantic connections between UKIs"
  
  moc_aware_operations:
    pertinence_resolution: |
      user_context = getUserContextFromMOC(user_id)
      accessible_ukis = filterUKIsByScope(user_context.scope_level)
      domain_filtered = filterUKIsByDomain(accessible_ukis, user_context.domain_access)
      return domain_filtered
    
    authority_validation: |
      required_authority = MOC.getRequiredAuthority(operation, scope, domain)
      user_authority = MOC.getUserAuthority(user_context)
      return user_authority.covers(required_authority)
    
    governance_explanation: |
      explanation = {
        decision: "Access denied for organizational UKI",
        moc_nodes_cited: ["scope.team", "domain.technical"],
        escalation_path: "Request approval via team_lead → architect"
      }
```


### **Workflow Agent - Zion Intelligence**
```yaml

# --- Illustrative Example ---
workflow_agent_archetype:
  archetype_id: wag
  archetype_name: "Workflow Agent"
  archetype_level: canonical
  specialization: "Orchestration of ZOF conceptual flows"
  checkpoint_execution: "EvaluateForEnrich execution with MOC criteria"
  
  core_capabilities:
    flow_state_management: "Manages transitions between canonical states"
    oracle_consultation: "Consults Knowledge Agent with MOC filtering"
    enrichment_evaluation: "Executes EvaluateForEnrich checkpoint"
    explainability_recording: "Records context, decision and result signals"
  
  evaluate_for_enrich_execution:
    moc_criteria_consultation: |
      criteria = MOC.getEvaluationCriteria("hierarchies.evaluation_criteria.nodes")
      for criterion in criteria:
        result = evaluateCriterion(criterion, act_output, context)
        record_evaluation(criterion.name, result, criterion.threshold)
    
    authority_validation_for_enrichment: |
      proposed_uki_scope = determineEnrichmentScope(act_output, user_context)
      user_max_scope = MOC.getMaxUserScope(user_context)
      if (proposed_uki_scope <= user_max_scope):
        return AUTHORIZED
      else:
        return ESCALATION_REQUIRED
    
    enrichment_decision: |
      if (all_criteria_pass AND authority_validation == AUTHORIZED):
        return ENRICH_APPROVED
      else:
        return ENRICH_REJECTED
```


### **Governance-Aware Implementation**
```yaml

# --- Illustrative Example ---
governance_aware_implementation:
  moc_based_access_control:
    user_context_resolution: |
      user_context = {
        scope_level: "team",
        domain_access: ["technical", "business"],
        authority_level: "developer",
        escalation_paths: MOC.getEscalationPaths(user_id)
      }
    
    uki_filtering: |
      accessible_ukis = UKI.query(
        scope_ref: {"$lte": user_context.scope_level},
        domain_ref: {"$in": user_context.domain_access},
        status: "active"
      )
    
    explanation_with_moc_references: |
      explanation = {
        decision: "UKI filtered by scope",
        reasoning: "User has access only up to 'team' scope",
        moc_nodes: {
          user_scope: "hierarchies.scope.nodes.team",
          uki_scope: "hierarchies.scope.nodes.organization",
          governance_rule: "scope_level_restriction"
        },
        next_steps: "To access organizational UKIs, request authority elevation"
      }
```


### **Quality Metrics for Intelligences**
```yaml

# --- Illustrative Example ---
quality_metrics:
  explainability_metrics:
    clarity_score:
      measurement: "Rate of comprehensible explanations for users"
      target: "> 85%"
      frequency: "real_time"
    
    traceability_completeness:
      measurement: "Percentage of decisions with complete MOC references"
      target: "100%"
      frequency: "daily"
  
  hierarchical_filtering_metrics:
    precision_score:
      measurement: "Accuracy in MOC hierarchy-based filtering"
      target: "> 95%"
      frequency: "real_time"
    
    authority_compliance:
      measurement: "Adherence to MOC authority rules"
      target: "100%"
      frequency: "real_time"
  
  derived_authority_metrics:
    contextualization_rate:
      measurement: "Rate of contextualized vs absolute responses"
      target: "> 90%"
      frequency: "weekly"
    
    absolute_truth_avoidance:
      measurement: "Percentage of responses that avoid absolute truths"
      target: "100%"
      frequency: "daily"
    
    humility_integration:
      measurement: "Integration of epistemic humility in responses"
      target: "> 80%"
      frequency: "weekly"

continuous_monitoring:
  real_time_metrics: ["clarity_score", "precision_score", "authority_compliance"]
  daily_metrics: ["traceability_completeness", "absolute_truth_avoidance"]
  weekly_metrics: ["contextualization_rate", "humility_integration"]
  monthly_metrics: ["overall_intelligence_quality", "moc_integration_effectiveness"]
```


### **Derived Authority: Denial of Absolute Truths**
```yaml

# --- Illustrative Example ---
derived_authority_implementation:
  prohibited_patterns:
    - "This is the correct way"
    - "Always do X"
    - "Never use Y"
    - "The best practice is Z"
  
  required_patterns:
    - "In the context of your [team] scope, based on [domain_owner] authority..."
    - "According to guidelines configured in MOC for [domain]..."
    - "For the [user_authority] authority level, it is recommended..."
    - "Based on organizational rules defined in [moc_node]..."
  
  contextual_response_example:
    user_question: "What's the best way to implement authentication?"
    
    prohibited_response: |
      "The best way is to use JWT. Always implement with refresh tokens."
    
    required_response: |
      "In the context of your 'team' scope_ref and 'technical' domain, 
      based on the 'developer' authority defined in organizational MOC, 
      the available options are:
      
      1. JWT according to uki:technical:pattern:jwt-authentication (scope: team)
      2. OAuth2 according to uki:technical:pattern:oauth2-standard (scope: organization - requires approval)
      
      The choice depends on your project's specific requirements and 
      organizational policies defined in hierarchies.domain.technical.governance."
``` 
