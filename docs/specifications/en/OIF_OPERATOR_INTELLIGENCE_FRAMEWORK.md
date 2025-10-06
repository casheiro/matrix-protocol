# OIF — Operator Intelligence Framework
**Acronym:** OIF  
**Version:** 0.0.1-beta  
**Last Updated:** 2025-10-05  

> "The mind that opens to a new idea never returns to its original size." — Albert Einstein

---

## 1. Introduction

The **Operator Intelligence Framework (OIF)** is the conceptual system that defines how artificial intelligences materialize as genuine collaborators in the Matrix Protocol.

This framework establishes the ontology, methodology, and governance for creating, evaluating, and evolving intelligence archetypes that serve as a bridge between the Oracle's structured knowledge and Zion's conceptual flows.

OIF is completely **hierarchy governance-aware** through MOC, ensuring that all intelligences operate within appropriate organizational contexts.

---

## 2. Terms and Definitions

- **Intelligence Archetypes**: Conceptual models of specialized artificial intelligence
- **Knowledge Agent**: Archetype specialized in MEF knowledge with MOC access control
- **Workflow Agent**: Archetype specialized in ZOF flow orchestration
- **Hierarchical Explainability**: Explanations that cite specific MOC nodes
- **Contextual Filtering**: Knowledge filtering based on user's hierarchical context
- **Authority Validation**: Permission checks delegated to organizational MOC
- **Governance Awareness**: Complete integration with MOC hierarchies
- **Derived Authority**: Principle establishing relative authority based on organizational context

Cross-reference to **MOC (Matrix Ontology Catalog)** for organization-specific taxonomies.

---

## 3. Core Concepts

### Intelligence Archetype Definition via OIF

OIF defines three main intelligence categories:

**Knowledge Agent (Oracle Intelligence)**
- Archetype specialized in comprehension, organization, and MEF knowledge relationships
- Access control based on organizational MOC
- Capabilities: semantic search, knowledge filtering, explanation generation

**Workflow Agent (Zion Intelligence)**
- Archetype specialized in ZOF conceptual flow orchestration
- EvaluateForEnrich checkpoint execution with MOC criteria
- Capabilities: flow state management, Oracle consultation, enrichment evaluation

**Specialized Archetypes**
- Methodology for creating domain-customized intelligences
- Authority levels defined by organizational MOC
- Governance awareness: complete integration with MOC hierarchies

### MOC-Integrated Capabilities

- **Pertinence Resolution**: Filter and present UKIs based on user's scope and domain permissions defined in MOC
- **Authority Validation**: Verify if user has necessary authority for operations based on MOC governance rules
- **Governance Explainability**: Provide transparent explanations referencing specific MOC nodes
- **Escalation Paths**: Automatically route requests requiring superior authority per MOC configuration

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
- Filter knowledge based on user's hierarchical context
- Generate explanations referencing specific MOC nodes
- Implement escalation paths per MOC configuration

### Mandatory Access Control
- Knowledge Agents MUST filter UKIs based on user's scope_ref and domain_ref
- Workflow Agents MUST validate authority before executing enrichment
- Explanations MUST cite specific MOC nodes for transparency

### Intelligence Quality Requirements
Implementations MUST include metrics for:
- **Explainability**: Clarity and traceability of explanations
- **Hierarchical Filtering**: Accuracy in respecting MOC hierarchies  
- **Derived Authority**: Rate of contextualization and absolute truth avoidance

### Derived Authority Implementation
All intelligence archetypes MUST:
- Avoid absolute statements ("This is the correct way")
- Provide contextual responses referencing organizational authority
- Cite specific MOC nodes in explanations
- Implement epistemological humility in responses

### 🧩 Archetype Levels (Normative)

The Operator Intelligence Framework (OIF) defines **three levels of archetypes**.  
This classification establishes a clear distinction between elements that are **core to the Matrix Protocol** and those that are **contextually derived by organizations**.

#### 1. Canonical Archetypes (Mandatory)
- **Knowledge Agent (KAG)**  
- **Workflow Agent (WAG)**  

These archetypes are **always present** in the OIF and constitute the **irreducible minimum** of the Matrix Protocol.  
They are **protocol-wide**, independent of organizational context, and **MUST** be implemented in every deployment.

#### 2. Specialized Archetypes (Configurable)
- Defined by organizations through the **MOC (Matrix Ontology Catalog)**.  
- Always parameterized with `domain_ref` and `scope_ref`.  
- Their authority is **derivative**, validated against MOC authority maps.  
- They **MUST NOT** override canonical archetypes, but can extend them with domain-specific functions (e.g., Security Guidance Agent).  
- Specialized archetypes **MUST** produce outputs conforming to OIF explicability templates.

#### 3. Ephemeral Archetypes (Experimental, Optional)
- Created **ad-hoc** during explorations, innovation cycles, or temporary contexts.  
- Valid only within the session or restricted scope defined in the MOC.  
- They **MUST NOT** persist in the MEF or generate enduring UKIs.  
- Their status is **non-canonical** and **MUST** be explicitly flagged as `ephemeral: true`.  
- Ephemeral archetypes are intended for **experimentation and prototyping**, never for governance-critical flows.

#### 🔗 Integration Rules
- **MEP (Epistemic Principle)**: establishes that **all archetypes derive authority** from context; canonical archetypes derive it from the protocol itself.  
- **MOC (Ontology Catalog)**: provides definitions, scopes, and authority maps for specialized and ephemeral archetypes.  
- **MEF (Embedding Framework)**: may store outputs from canonical and specialized archetypes; ephemeral archetypes are explicitly excluded.  
- **ZOF (Orchestration Framework)**: orchestrates flows across archetypes, respecting authority validation from MOC.  
- **OIF (Operator Intelligence Framework)**: maintains explicability, ensuring outputs clearly distinguish archetype level (`canonical`, `specialized`, or `ephemeral`).

#### ⚖️ Normative Constraints
1. **Canonical archetypes MUST always be implemented.**  
2. **Specialized archetypes MUST be validated via MOC** and cannot supersede canonical archetypes.  
3. **Ephemeral archetypes MUST NOT persist** beyond their originating session or scope.  
4. All archetypes MUST comply with OIF explicability standards.
5. **Canonical archetype prompts MUST NEVER be overridden or modified.**

### 🔧 Archetype Metadata (Normative Extension)

Each archetype definition in the OIF MUST include a field `archetype_level` to explicitly declare its canonical status.

#### Field Specification
- **Field name**: `archetype_level`
- **Allowed values**:  
  - `canonical` → reserved for Knowledge Agent (KAG) and Workflow Agent (WAG).  
  - `specialized` → domain- or scope-specific archetypes defined via MOC.  
  - `ephemeral` → ad-hoc archetypes, temporary, non-persistent.  

#### Normative Archetype Definitions
```yaml
# Canonical Archetypes (Protocol Core)
archetype_id: kag
archetype_name: Knowledge Agent
archetype_level: canonical
domain_ref: global
scope_ref: all
specialization: "MEF knowledge comprehension and organization"

archetype_id: wag
archetype_name: Workflow Agent
archetype_level: canonical
domain_ref: global
scope_ref: all
specialization: "ZOF conceptual flow orchestration"

# Specialized Archetype Example
archetype_id: gad.security
archetype_name: Guidance Agent - Security
archetype_level: specialized
domain_ref: security
scope_ref: organization
specialization: "Domain-specific security guidance and policy compliance"
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

OIF MUST implement immutable prompt protection for canonical archetypes to preserve protocol integrity while enabling organizational customization through specialized archetypes.

#### Archetype Customization Matrix
```yaml
# --- Normative Customization Rules ---
archetype_customization_matrix:
  canonical_archetypes:
    prompt_modification: FORBIDDEN      # Core prompts are immutable
    behavioral_extension: FORBIDDEN     # Cannot change core behavior
    organizational_context: ALLOWED     # Can reference organizational MOC
    output_formatting: LIMITED          # Only presentation layer changes
    domain_specialization: FORBIDDEN    # Must remain domain-agnostic
    
  specialized_archetypes:
    prompt_modification: ALLOWED        # Can customize prompts via MOC
    behavioral_extension: ALLOWED       # Can extend base behaviors
    organizational_context: REQUIRED    # Must integrate with MOC
    output_formatting: ALLOWED          # Full formatting control
    domain_specialization: REQUIRED     # Must be domain-specific
    
  ephemeral_archetypes:
    prompt_modification: UNRESTRICTED   # Ad-hoc modification allowed
    behavioral_extension: UNRESTRICTED  # Experimental behaviors allowed
    organizational_context: OPTIONAL    # May bypass MOC validation
    output_formatting: UNRESTRICTED     # Full formatting freedom
    domain_specialization: OPTIONAL     # Can be domain-agnostic
```

#### Prompt Immutability Enforcement
```yaml
# --- Normative Protection Rules ---
canonical_prompt_protection:
  immutability_scope:
    core_system_prompt: IMMUTABLE       # Base archetype instructions never change
    knowledge_access_patterns: IMMUTABLE # How archetypes access MEF/Oracle
    workflow_integration: IMMUTABLE     # How archetypes integrate with ZOF
    authority_validation: IMMUTABLE     # How archetypes validate MOC authority
    
  permitted_variations:
    response_formatting: SURFACE_ONLY   # Presentation changes only
    language_localization: ALLOWED      # Multi-language support
    organizational_references: CONTEXT_ONLY # MOC node references in examples
    
  enforcement_mechanism:
    validation_checkpoint: "archetype_instantiation"
    authority_source: "protocol_specification"
    override_authority: NONE            # No override possible
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
- **Canonical**: Protocol-level governance; no organizational override allowed
- **Specialized**: Organizational governance via MOC; must extend, not replace, canonical behavior
- **Ephemeral**: Session-level governance; no persistent validation required

### 📋 Arbitration Explanation Template (Normative)

OIF implementations MUST provide a standardized template for explaining MAL arbitration decisions to users.

#### Mandatory Template Fields
```yaml
# --- Normative Interface ---
arbitration_explanation_template:
  decision_id: string                 # Required: MAL decision identifier
  event_type: enum[H1, H2, H3]        # Required: Conflict type
  outcome: enum[winner, coexist, reject_all, defer]  # Required: Arbitration result
  
  summary: string                     # Required: User-friendly explanation
  reason_code: string                 # Required: Structured reason identifier
  
  winner: string                      # Conditional: Chosen UKI (if outcome=winner)
  losers: array[string]               # Conditional: Defeated UKIs (if applicable)
  
  precedence_explanation:             # Required: Applied precedence rules
    - rule: string                    # P1, P2, P3, etc.
      description: string             # Human-readable explanation
      impact: string                  # How this rule affected the decision
  
  moc_references:                     # Required: Referenced authority nodes
    - node_id: string                 # MOC node identifier  
      node_type: enum[scope, domain, authority, policy]
      relevance: string               # Why this node was relevant
  
  next_steps: string                  # Required: Recommended user actions
  escalation_path: string             # Optional: Available escalation options
  
  metadata:
    decided_at: ISO8601               # Decision timestamp
    user_authority: string            # User's authority level
    user_scope: array[string]         # User's accessible scopes
```

#### Template Usage Requirements
- OIF MUST render arbitration explanations using this template structure
- All explanations MUST include epistemic rationale aligned with MEP principles
- Explanations MUST cite specific MOC nodes for transparency
- OIF MUST NOT perform arbitration; it MUST only explain MAL decisions
- Templates MUST be configurable per organization while maintaining core structure

### Archetype Lifecycle Management
- Archetypes MUST be versioned and follow semantic versioning
- Configuration changes MUST be validated against MOC rules
- Deprecated archetypes MUST provide migration paths
- All archetype operations MUST maintain backward compatibility

### Error Handling and Fallback Mechanisms
- Archetypes MUST implement graceful degradation on MOC unavailability
- Authority validation failures MUST trigger escalation workflows
- Invalid UKI references MUST be handled without system failure
- Missing domain expertise MUST route to appropriate specialists

---

## 5. Interoperability

OIF intelligence archetypes bridge human-AI interaction across all Matrix Protocol frameworks:

- **MEF (Matrix Embedding Framework)**: Knowledge Agents consume UKIs for semantic search and relationship mapping; archetypes validate UKI creation authority; process structured knowledge for contextual filtering; provides Decision Record data for arbitration explanations
- **ZOF (Zion Orchestration Framework)**: Workflow Agents orchestrate canonical states execution; handle Oracle consultation during Understand state; manage EvaluateForEnrich checkpoint evaluation; invokes MAL and delegates explanation to OIF
- **MOC (Matrix Ontology Catalog)**: Source of hierarchical context for all archetype operations; provides authority validation rules; defines escalation paths for superior authority requirements; configures arbitration explanation templates
- **MEP (Matrix Epistemic Principle)**: Implements derived authority principles in archetype responses; ensures epistemological humility through contextual explanations; mandates explainability in all intelligence operations; guides arbitration explanation rationale
- **MAL (Matrix Arbiter Layer)**: Provides Decision Records that OIF MUST explain to users via Arbitration Explanation Templates; OIF maintains epistemic humility by not overriding MAL determinations; ensures arbitration transparency

See [Matrix Protocol Integration Diagram](MATRIX_PROTOCOL_INTEGRATION_DIAGRAM.md) for intelligence archetype interaction patterns.

---

## 6. Conventions and Examples

All examples in this document are **illustrative only** and do not define normative behavior.  
Normative semantics (scopes, governance, archetypes, enrich criteria) are always derived from the **MOC (Matrix Ontology Catalog)** of each organization.  
Examples are provided for clarity and MAY be adapted to local contexts, but MUST NOT be treated as protocol-level obligations.

---

## 7. Illustrative Examples (Appendix)

> **Example (Informative, MOC-dependent)**

### **Knowledge Agent - Oracle Intelligence**
```yaml
# --- Illustrative Example ---
knowledge_agent_archetype:
  archetype_id: kag
  archetype_name: "Knowledge Agent"
  archetype_level: canonical
  specialization: "Comprehension, organization, and MEF knowledge relationships"
  moc_integration: "Access control based on organizational hierarchies"
  
  core_capabilities:
    semantic_search: "Intelligent search in UKIs with MOC filtering"
    knowledge_filtering: "Present only knowledge authorized by user context"
    explanation_generation: "Generate explanations citing specific MOC nodes"
    relationship_mapping: "Identify semantic connections between UKIs"
  
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

  example_interaction:
    user_request: "Show me authentication patterns"
    
    authority_check: |
      user_context = {scope: "team", domain_access: ["technical"], authority: "developer"}
      uki_query_scope = "organization"  # User requesting org-level patterns
      
    filtered_response: |
      "Based on your authority level 'developer' in scope 'team' (MOC: hierarchies.scope.team),
      I can show you these authentication patterns:
      
      ✅ Available patterns (team-level):
      - uki:technical:pattern:jwt-basic-auth (scope: team)
      - uki:technical:pattern:session-management (scope: team)
      
      🔒 Restricted patterns (require elevation):
      - uki:technical:pattern:enterprise-sso (scope: organization)
      
      To access organizational patterns, request approval via your team lead per MOC escalation path."
```

### **Workflow Agent - Zion Intelligence**
```yaml
# --- Illustrative Example ---
workflow_agent_archetype:
  archetype_id: wag
  archetype_name: "Workflow Agent"
  archetype_level: canonical
  specialization: "Orchestration of ZOF conceptual flows"
  checkpoint_execution: "Execution of EvaluateForEnrich with MOC criteria"
  
  core_capabilities:
    flow_state_management: "Manages transitions between canonical states"
    oracle_consultation: "Consults Knowledge Agent with MOC filtering"
    enrichment_evaluation: "Executes EvaluateForEnrich checkpoint"
    explainability_recording: "Records context, decision, and result signals"
  
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

  example_workflow_execution:
    flow_id: "jwt-implementation-workflow"
    user_context: {scope: "team", domain: "technical", authority: "developer"}
    
    understand_state: |
      knowledge_agent_query = {
        query: "JWT authentication patterns",
        user_context: user_context,
        moc_filter: {scope_max: "team", domain_filter: ["technical"]}
      }
      
    evaluate_for_enrich_state: |
      moc_criteria_results = {
        relevance: {threshold: "medium", result: "PASS", score: 0.8},
        reusability: {threshold: "high", result: "PASS", score: 0.9},
        impact: {threshold: "medium", result: "PASS", score: 0.7}
      }
      
      authority_validation = {
        user_scope: "team",
        proposed_uki_scope: "team",
        validation: "AUTHORIZED",
        moc_reference: "hierarchies.scope.team.governance.enrichment_allowed"
      }
      
      final_decision: "ENRICH_APPROVED"
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

  dynamic_authority_adaptation:
    context_aware_capabilities: |
      # Agent adapts capabilities based on user's current context
      if user_context.authority_level == "architect":
        enable_cross_domain_access()
        enable_organizational_scope_enrichment()
      elif user_context.authority_level == "developer":
        enable_team_scope_operations()
        restrict_to_assigned_domains()
      
      # Real-time adaptation based on MOC changes
      MOC.subscribe_to_changes(user_id, on_authority_change)
```

### **Intelligence Quality Metrics**
```yaml
# --- Illustrative Example ---
quality_metrics:
  explainability_metrics:
    clarity_score:
      measurement: "Rate of comprehensible explanations for users"
      target: "> 85%"
      frequency: "real_time"
      calculation: |
        comprehensible_explanations / total_explanations * 100
    
    traceability_completeness:
      measurement: "Percentage of decisions with complete MOC references"
      target: "100%"
      frequency: "daily"
      calculation: |
        decisions_with_moc_refs / total_decisions * 100
  
  hierarchical_filtering_metrics:
    precision_score:
      measurement: "Accuracy in MOC hierarchy-based filtering"
      target: "> 95%"
      frequency: "real_time"
      calculation: |
        correct_filters / total_filter_operations * 100
    
    recall_score:
      measurement: "Completeness in returning authorized content"
      target: "> 90%"
      frequency: "real_time"
      calculation: |
        returned_authorized_content / available_authorized_content * 100
    
    authority_compliance:
      measurement: "Adherence to MOC authority rules"
      target: "100%"
      frequency: "real_time"
      calculation: |
        compliant_operations / total_operations * 100
  
  derived_authority_metrics:
    contextualization_rate:
      measurement: "Rate of contextualized vs absolute responses"
      target: "> 90%"
      frequency: "weekly"
      calculation: |
        contextualized_responses / total_responses * 100
    
    absolute_truth_avoidance:
      measurement: "Percentage of responses avoiding absolute truths"
      target: "100%"
      frequency: "daily"
      calculation: |
        non_absolute_responses / total_responses * 100
    
    humility_integration:
      measurement: "Integration of epistemological humility in responses"
      target: "> 80%"
      frequency: "weekly"
      calculation: |
        humble_responses / total_responses * 100

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
  mep_integration:
    epistemological_principle: |
      "No truth is absolute. All epistemological authority derives from 
      impacted scope and organizational context defined in MOC."
  
  prohibited_patterns:
    absolute_statements:
      - "This is the correct way"
      - "Always do X"
      - "Never use Y"
      - "The best practice is Z"
      - "Everyone should implement this way"
  
  required_patterns:
    contextual_responses:
      - "In the context of your scope [{scope}], based on authority [{authority}]..."
      - "According to guidelines configured in MOC for [{domain}]..."
      - "For authority level [{user_authority}], it is recommended..."
      - "Based on organizational rules defined in [{moc_node}]..."
  
  practical_example:
    user_question: "What's the best way to implement authentication?"
    
    prohibited_response: |
      "The best way is to use JWT. Always implement with refresh tokens 
      and never use basic authentication."
    
    required_response: |
      "In the context of your 'team' scope and 'technical' domain, 
      based on 'developer' authority defined in the organizational MOC, 
      the available options are:
      
      1. JWT per uki:technical:pattern:jwt-authentication (scope: team)
      2. OAuth2 per uki:technical:pattern:oauth2-standard (scope: organization - requires approval)
      
      The choice depends on your project's specific requirements and 
      organizational policies defined in hierarchies.domain.technical.governance.
      
      For organizational-level patterns, you can request approval via your 
      escalation path: team_lead → architect → cto (MOC: hierarchies.scope.team.escalation_path)."

  implementation_checks:
    response_validation: |
      def validate_response(response, user_context):
        # Check for absolute statements
        if contains_absolute_language(response):
          return ValidationError("Absolute truth detected - violates MEP")
        
        # Ensure MOC contextualization
        if not references_moc_context(response, user_context):
          return ValidationError("Missing MOC contextualization")
        
        # Verify authority derivation
        if not derives_authority_from_context(response):
          return ValidationError("Authority not properly derived")
        
        return ValidationSuccess()
```

### **Intelligence Archetype Templates**
```yaml
# --- Illustrative Example ---
archetype_templates:
  knowledge_agent_template:
    required_capabilities:
      - "semantic_search_with_moc_filtering"
      - "authority_based_knowledge_access"
      - "moc_referenced_explanations"
      - "escalation_path_routing"
    
    optional_extensions:
      - "cross_domain_knowledge_synthesis"
      - "proactive_knowledge_recommendations"
      - "learning_from_user_interactions"
    
    governance_integration:
      moc_consultation_points:
        - "Before returning UKI search results"
        - "When generating explanations"
        - "During authority validation"
        - "For escalation path determination"
  
  workflow_agent_template:
    required_capabilities:
      - "canonical_state_management"
      - "oracle_consultation_orchestration"
      - "evaluate_for_enrich_execution"
      - "explainability_signal_recording"
    
    optional_extensions:
      - "flow_pattern_recognition"
      - "automated_workflow_optimization"
      - "predictive_enrichment_evaluation"
    
    governance_integration:
      moc_consultation_points:
        - "During EvaluateForEnrich checkpoint"
        - "For enrichment scope determination"
        - "When validating user authority for operations"
        - "For escalation requirement assessment"

  specialized_archetype_creation:
    methodology: |
      1. Identify domain-specific requirements
      2. Define MOC integration points
      3. Specify authority validation rules
      4. Implement governance-aware capabilities
      5. Create quality metrics specific to archetype
      6. Define escalation and feedback mechanisms
    
    example_specialized_archetype:
      archetype_id: gad.security
      archetype_name: "Security Intelligence Agent"
      archetype_level: specialized
      domain_ref: security
      scope_ref: organization
      domain_specialization: "security"
      moc_authority_requirements: ["security_lead", "architect"]
      moc_validation_required: true
      specialized_capabilities:
        - "threat_pattern_recognition"
        - "security_policy_compliance_checking"
        - "vulnerability_assessment_coordination"
      governance_constraints:
        - "Can only operate on security domain UKIs"
        - "Requires elevated authority for policy recommendations"
        - "Must escalate organizational impact assessments"
```

### **Archetype Capability Composition**
```yaml
# --- Illustrative Example ---
capability_composition_rules:
  capability_inheritance:
    description: "Specialized archetypes inherit from base Knowledge/Workflow Agent templates"
    rule: "All specialized archetypes MUST implement base template requirements"
    example: |
      SecurityAgent extends KnowledgeAgent {
        inherits: ["semantic_search_with_moc_filtering", "authority_based_knowledge_access"]
        adds: ["threat_pattern_recognition", "security_policy_compliance_checking"]
      }
  
  capability_conflicts:
    description: "Certain capabilities cannot coexist within same archetype"
    rule: "Conflicting capabilities MUST be resolved during archetype design"
    examples:
      - "unrestricted_domain_access conflicts with domain_specific_restriction"
      - "automatic_enrichment conflicts with manual_approval_required"
  
  capability_dependencies:
    description: "Some capabilities require other capabilities as prerequisites"
    rule: "Dependent capabilities MUST validate prerequisite availability"
    examples:
      - "cross_domain_synthesis requires semantic_search_with_moc_filtering"
      - "predictive_enrichment requires evaluate_for_enrich_execution"
  
  dynamic_capability_loading:
    description: "Capabilities can be enabled/disabled based on MOC configuration"
    rule: "Runtime capability changes MUST respect MOC authority validation"
    implementation: |
      if MOC.hasAuthority(user_context, "cross_domain_access"):
        archetype.enable_capability("cross_domain_knowledge_synthesis")
      else:
        archetype.disable_capability("cross_domain_knowledge_synthesis")
```

---

## 8. Cross-References

- [Matrix Protocol — Main Specification](MATRIX_PROTOCOL.md)  
- [Matrix Protocol Integration Diagram](MATRIX_PROTOCOL_INTEGRATION_DIAGRAM.md)  
- [Matrix Protocol Glossary](MATRIX_PROTOCOL_GLOSSARY.md)  
- [Matrix Protocol Integration Diagram — Portuguese](MATRIX_PROTOCOL_INTEGRATION_DIAGRAM_PT.md)  
- [Matrix Protocol Glossary — Portuguese](MATRIX_PROTOCOL_GLOSSARY_PT.md)  
- [MEF — Matrix Embedding Framework](MEF_MATRIX_EMBEDDING_FRAMEWORK.md)  
- [ZOF — Zion Orchestration Framework](ZOF_ZION_ORCHESTRATION_FRAMEWORK.md)  
- [MOC — Matrix Ontology Catalog](MOC_MATRIX_ONTOLOGY_CATALOG.md)  
- [MEP — Matrix Epistemic Principle](MEP_MATRIX_EPISTEMIC_PRINCIPLE.md)  
- [MAL — Matrix Arbiter Layer](MAL_MATRIX_ARBITER_LAYER.md)  