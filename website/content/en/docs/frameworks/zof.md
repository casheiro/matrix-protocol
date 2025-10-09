# ZOF — Zion Orchestration Framework
**Acronym:** ZOF  
**Version:** 0.0.1-beta  
**Last Updated:** 2025-10-05  

> 🚨 **IMPORTANT WARNING**: This document contains ILLUSTRATIVE EXAMPLES (such as `strategy`, `operations`, etc.) that are NOT mandatory taxonomies. The **MOC (Matrix Ontology Catalog)** is the only definitive source for organizational taxonomies.

---

## 1. Introduction

The **Zion Orchestration Framework (ZOF)** specifies in a conceptual and standardized way the workflow framework for AI-oriented teams, defining how to describe, execute, and govern workflows as technology-independent state machines.

ZOF defines a **conceptual model for AI-oriented workflows** that allows multidisciplinary teams to describe workflows as technology-independent state machines following the pattern: **Event → Oracle Query → Decision → Action → Evaluation → Conditional Oracle Enrichment**.

ZOF does not prescribe tools, orchestration engines, or technical implementations - it only directs **how to think and record the path** in a conceptual, traceable, and governed way.

---

## 2. Terms and Definitions

- **Canonical States**: Universal sequence of states in workflows (Intake → Understand → Decide → Act → EvaluateForEnrich → Review → Enrich)
- **EvaluateForEnrich**: Mandatory checkpoint for enrichment evaluation
- **Canonical Events**: Standard workflow triggers (knowledge.added, work.proposed, etc.)
- **Explainability Signals**: Context, decision, and result recorded at each state
- **can_enrich?()**: Cognitive filter function for enrichment decision
- **Scope Mode**: Propagation behavior of knowledge (restricted vs propagated)

Cross-reference to **MOC (Matrix Ontology Catalog)** for organization-specific taxonomies.

---

## 3. Core Concepts

### ZOF Essence in 3 Concepts

**1. Flow Thought as State**
- All work is a journey: Receive → Understand → Decide → Do → Evaluate → (Possibly) Teach
- Each transition is conscious: I know why I changed state
- Explainability is natural: I record context, decision and result

**2. Oracle as Intelligent Advisor**
- Before deciding anything, I consult the Oracle: "What do we already know about this?"
- Oracle returns only knowledge I have authority to see (via MOC)
- At the end, I can teach the Oracle if I learned something truly new

**3. Governance via MOC (Matrix Ontology Catalog)**
- MOC defines who can create knowledge in which scope/domain
- MOC establishes organizational criteria to validate if it's worth teaching the Oracle
- Different organizations configure different rules - there are no global impositions

### The Universal Pattern
```

EVENT → QUERY ORACLE → DECISION → ACTION → EVALUATE IF WORTH TEACHING → (TEACH)
```


### Mandatory Canonical States
Every ZOF flow follows this conceptual sequence:
1. **Intake**: Context and requirements capture
2. **Understand**: Mandatory Oracle consultation (UKIs)
3. **Decide**: Decision based on existing knowledge
4. **Act**: Execution of planned action
5. **EvaluateForEnrich**: Mandatory evaluation checkpoint
6. **Review**: Optional result validation
7. **Enrich**: Conditional Oracle enrichment

---

## 4. Normative Rules

> ⚠️ This section is **normative**.

### Mandatory Canonical States
All ZOF workflows MUST follow the canonical states sequence without exception.

### Mandatory EvaluateForEnrich Checkpoint
- MUST be applied to all workflows
- MUST consult criteria defined in organizational MOC
- MUST generate epistemological justification for decisions
- MUST respect MOC authorities and scopes
- MUST detect conflict types H1/H2/H3 and invoke MAL if local resolution fails
- MUST apply MAL decisions when arbitration is required
- MUST apply scope_mode validation for multi-scope enrichment scenarios

### Mandatory Explainability Signals
Each state transition MUST record:
- **context**: What entered the state
- **decision**: Why it transitioned
- **result**: What exited the state

### Mandatory Oracle Consultation
The **Understand** state MUST always consult the Oracle (UKIs) before any decision.

### can_enrich?() Function Requirements
- MUST implement semantic novelty evaluation
- MUST implement practical value assessment
- MUST implement authority validation via MOC
- MAY implement additional organizational criteria

### State Transition Rules
- State transitions MUST be sequential and cannot skip states
- Each state MUST complete before transitioning to next state
- Understand state MUST receive Oracle consultation results before proceeding
- EvaluateForEnrich MUST complete evaluation before allowing Enrich state
- Failed evaluations MAY terminate flow or require remediation
- MAL arbitration MUST be invoked on conflict detection during EvaluateForEnrich
- MAL Decision Records MUST be applied through appropriate actions (gate_enrich, deprecate, partition_scope, etc.)

### Scope Mode Implementation
- **Restricted mode**: Knowledge remains within originating scope level
- **Propagated mode**: Knowledge can cascade to higher scope levels via promotion
- Scope mode MUST be declared during UKI creation
- Promotion between scopes MUST follow MOC governance rules

### 🌐 Multi-scope Enrichment with Domain Validation (Normative)

ZOF MUST implement specific rules for enrichment operations that cross multiple scope or domain boundaries.

#### Cross-boundary Enrichment Detection
```yaml

# --- Normative Configuration ---
cross_boundary_detection:
  scope_crossing:
    source_scope: "team"              # UKI originates from team scope
    enrichment_target_scope: "tribe"   # Enrichment targets tribe scope
    classification: "scope_crossing"
    
  domain_crossing:
    source_domain: "technical"         # UKI originates from technical domain
    enrichment_target_domain: "business" # Enrichment targets business domain
    classification: "domain_crossing"
    
  multi_boundary_crossing:
    source: {scope: "team", domain: "technical"}
    target: {scope: "tribe", domain: "business"}
    classification: "multi_boundary_crossing"
```


#### Authority Validation for Cross-boundary Enrichment
- **Hierarchical Authority Check**: User MUST have authority in BOTH source and target hierarchies
- **Cross-domain Validation**: For domain crossing, user MUST have domain_access to both domains in MOC
- **Escalation Path**: If user lacks cross-boundary authority, MUST route to escalation path via MOC
- **Joint Approval**: Multi-boundary crossing MAY require approval from authorities in multiple hierarchies

#### Cross-boundary Enrichment Rules
```yaml

# --- Normative Rules ---
cross_boundary_enrichment_rules:
  scope_crossing_rules:
    upward_promotion:                    # team → tribe, tribe → org
      authority_requirement: "source_scope_authority + promotion_rights"
      approval_process: "hierarchical_escalation"
      rationale_requirement: "mandatory_promotion_rationale"
    
    lateral_crossing:                    # team-a → team-b
      authority_requirement: "both_scope_authority OR superior_authority"
      approval_process: "peer_approval OR escalation"
      conflict_resolution: "invoke_MAL_if_contested"
  
  domain_crossing_rules:
    technical_to_business:
      authority_requirement: "multi_domain_access"
      validation_criteria: "business_value_assessment + technical_accuracy"
      review_process: "cross_domain_review_committee"
    
    cross_domain_conflict_resolution:
      detection: "semantic_conflicts_across_domains"
      resolution: "invoke_MAL_with_cross_domain_context"
      outcome_application: "domain_specific_actions"
```


#### EvaluateForEnrich for Cross-boundary Operations
- **Extended Criteria**: Cross-boundary enrichment MUST apply additional evaluation criteria from MOC
- **Impact Analysis**: MUST assess impact on both source and target hierarchies
- **Conflict Detection**: MUST detect potential semantic conflicts across boundaries
- **Authority Validation**: MUST validate authority for all affected hierarchical levels
- **Scope Validation Mode**: MUST apply scope_mode configuration for multi-scope scenarios
- **MAL Invocation**: MUST invoke MAL for cross-boundary conflicts that cannot be resolved locally

#### 🎯 Scope Mode Configuration (Normative)

ZOF MUST implement scope_mode validation for enrichment operations that affect multiple scopes.

##### Scope Mode Types
```yaml

# --- Normative Configuration ---
scope_mode_validation:
  validation_types:
    any:                               # Satisfy one scope is sufficient
      description: "Enrichment approved if ANY affected scope validates successfully"
      use_case: "Broad knowledge sharing, cross-team collaboration"
      authority_requirement: "minimum_scope_authority"
      validation_logic: "OR operation across all affected scopes"
      
    all:                               # All scopes must validate
      description: "Enrichment approved only if ALL affected scopes validate successfully"
      use_case: "Strict governance, compliance-critical knowledge"
      authority_requirement: "maximum_scope_authority"
      validation_logic: "AND operation across all affected scopes"

  configuration_source: "MOC organizational policy"
  default_behavior: "all"              # Conservative default for safety
  
  scope_mode_determination:
    explicit_configuration:            # Organization sets scope_mode in MOC
      source: "MOC evaluation_criteria configuration"
      precedence: "highest"
      
    knowledge_type_based:              # Based on UKI type (policy vs guideline)
      policy_knowledge: "all"          # Policies require all scope validation
      guideline_knowledge: "any"       # Guidelines can use any scope validation
      precedence: "medium"
      
    fallback_default: "all"            # Conservative fallback
    precedence: "lowest"
```


##### Scope Mode Application Examples
```yaml

# --- Illustrative Examples ---
scope_mode_scenarios:
  scenario_1_cross_team_guideline:
    context: "Development guideline from team-a enriching team-b scope"
    affected_scopes: ["team-a", "team-b"]
    knowledge_type: "guideline"
    scope_mode: "any"                  # Either team validation sufficient
    validation_result: "APPROVED if team-a OR team-b validates"
    
  scenario_2_organizational_policy:
    context: "Security policy affecting multiple organizational levels"
    affected_scopes: ["squad", "tribe", "organization"]
    knowledge_type: "policy"
    scope_mode: "all"                  # All levels must validate
    validation_result: "APPROVED only if squad AND tribe AND organization validate"
    
  scenario_3_domain_crossing:
    context: "Technical knowledge enriching business domain"
    affected_scopes: ["technical", "business"]
    knowledge_type: "pattern"
    scope_mode: "any"                  # Cross-domain sharing encouraged
    validation_result: "APPROVED if technical OR business validates"
```


##### Integration with MOC Authority
- **Authority Mapping**: scope_mode MUST respect MOC authority hierarchies for each affected scope
- **Escalation Paths**: Failed validation in "all" mode MUST provide escalation paths from MOC
- **Audit Trail**: All scope validation decisions MUST be recorded with scope_mode rationale

---

## 5. Interoperability

ZOF orchestrates workflows that span all Matrix Protocol frameworks through canonical states:

- **MEF (Matrix Embedding Framework)**: Consumes UKIs during Understand state Oracle consultation; produces structured UKIs during Enrich state; maintains semantic relationships between motivating and created knowledge; persists MAL Decision Records
- **MOC (Matrix Ontology Catalog)**: Provides evaluation criteria for EvaluateForEnrich checkpoint; validates user authority for enrichment operations; defines organizational taxonomies for workflow context; configures MAL arbitration policies
- **OIF (Operator Intelligence Framework)**: Workflow Agents execute canonical states; Knowledge Agents handle Oracle consultation; intelligence archetypes provide governance-aware workflow orchestration; explains MAL arbitration outcomes to users
- **MEP (Matrix Epistemic Principle)**: Guides epistemological justification in EvaluateForEnrich; ensures derived authority principles in enrichment decisions; mandates explainability through signal recording; provides foundation for MAL epistemic rationale
- **MAL (Matrix Arbiter Layer)**: Invoked by ZOF when EvaluateForEnrich detects unresolvable conflicts (H1/H2/H3); provides deterministic arbitration decisions; returns actions for ZOF execution (gate_enrich, deprecate, partition_scope)

See Matrix Protocol Integration Diagram for detailed workflow integration patterns.

---

## 6. Conventions and Examples

All examples in this document are **illustrative only** and do not define normative behavior.  
Normative semantics (scopes, governance, archetypes, enrich criteria) are always derived from the **MOC (Matrix Ontology Catalog)** of each organization.  
Examples are provided for clarity and MAY be adapted to local contexts, but MUST NOT be treated as protocol-level obligations.

---

## 7. Illustrative Examples (Appendix)

> **Example (Informative, MOC-dependent)**

### **Canonical States with Signals**
```yaml

# --- Illustrative Example ---
flow_execution:
  - state: "intake"
    signals:
      context: "JWT authentication user story received"
      decision: "Story clear and complete, proceed to understanding"
      result: "Requirements organized and context captured"
  
  - state: "understand"
    signals:
      context: "Query Oracle about existing authentication patterns"
      decision: "UKI uki:technical:pattern:jwt-authentication found"
      result: "Existing knowledge identified and understood"
  
  - state: "decide"
    signals:
      context: "Based on existing UKI, decide implementation approach"
      decision: "Use recommended library per organizational standard"
      result: "Implementation strategy defined"
  
  - state: "act"
    signals:
      context: "Implement JWT authentication following defined strategy"
      decision: "Implementation completed with team-specific adaptations"
      result: "Working JWT authentication system deployed"
  
  - state: "evaluate_for_enrich"
    signals:
      context: "Evaluate if implementation contains teachable knowledge"
      decision: "can_enrich?(result, context, moc_criteria) = APPROVED"
      result: "Knowledge qualifies for enrichment with 'team' scope"
  
  - state: "enrich"
    signals:
      context: "Create UKI documenting team-specific JWT implementation"
      decision: "New UKI created with scope_ref='team', domain_ref='technical'"
      result: "Oracle enriched with uki:technical:example:team-jwt-implementation"
```


### **EvaluateForEnrich Checkpoint**
```yaml

# --- Illustrative Example ---
evaluate_for_enrich_execution:
  moc_criteria_consultation:
    - criterion: "relevance"
      threshold: "medium"
      evaluators: ["domain_experts"]
      evaluation: "PASS - other developers will face same problem"
    
    - criterion: "reusability"
      threshold: "high" 
      evaluators: ["architects"]
      evaluation: "PASS - solution can be reused in other projects"
    
    - criterion: "impact"
      threshold: "medium"
      evaluators: ["stakeholders"]
      evaluation: "PASS - improves security posture across team"

  authority_validation:
    user_context:
      scope_level: "team"
      domain_access: ["technical"]
      authority: "developer"
    
    proposed_uki:
      scope_ref: "team"
      domain_ref: "technical"
      type_ref: "example"
    
    validation_result: "AUTHORIZED - user can enrich at team level in technical domain"

  final_decision:
    can_enrich_result: "APPROVED"
    enrichment_scope: "team"
    justification: "Novel implementation approach with reusable value within authorized scope"
```


### **MAL Conflict Resolution in EvaluateForEnrich**
```yaml

# --- Illustrative Example ---
evaluate_for_enrich_with_conflict:
  conflict_detection:
    - conflict_type: "H1"  # Horizontal conflict
      description: "Two equivalent-scope UKIs conflict on same topic"
      candidates:
        - existing_uki: "uki:squad-x:pattern:jwt-implementation-basic"
        - proposed_uki: "uki:squad-x:pattern:jwt-implementation-advanced"
      
    local_resolution_attempts:
      - authority_check: "Both at squad level - equivalent authority"
      - scope_check: "Both squad-x scope - no hierarchy difference" 
      - maturity_check: "Both validated - no maturity difference"
      - result: "UNRESOLVABLE_LOCALLY"
    
    mal_invocation:
      event_id: "mal-evt-zof-20250826-001"
      event_type: "H1"
      arbitration_request:
        candidates:
          - uki_ref: "uki:squad-x:pattern:jwt-implementation-basic"
            scope_ref: "squad-x"
            maturity_level: "validated"
            evidence_refs: ["doc:team-requirements-v1"]
          - uki_ref: "uki:squad-x:pattern:jwt-implementation-advanced"
            scope_ref: "squad-x" 
            maturity_level: "validated"
            evidence_refs: ["doc:security-audit-2025", "uki:org:policy:security-standards"]
        user_moc_context:
          scopes: ["squad-x", "tribe-alpha"]
          authority: "developer"
        operation: "enrich"
    
    mal_decision_received:
      decision_id: "mal-dec-20250826-h1-001"
      outcome: "winner"
      winner: "uki:squad-x:pattern:jwt-implementation-advanced"
      precedence_applied: ["P5_evidence", "P1_authority"]
      actions:
        - "deprecate:uki:squad-x:pattern:jwt-implementation-basic"
        - "allow_enrich:uki:squad-x:pattern:jwt-implementation-advanced"
      
    zof_actions_execution:
      - action: "deprecate"
        target: "uki:squad-x:pattern:jwt-implementation-basic"
        result: "UKI marked as deprecated with replacement reference"
      - action: "allow_enrich"
        target: "uki:squad-x:pattern:jwt-implementation-advanced"
        result: "Enrichment approved, proceeding to Review state"
        
    final_decision:
      can_enrich_result: "APPROVED_BY_MAL"
      enrichment_scope: "squad-x"
      arbitration_ref: "mal-dec-20250826-h1-001"
      justification: "MAL resolved conflict in favor of advanced implementation based on stronger security evidence"
```


### **Minimum can_enrich?() Profile - Initial Adoption**
```yaml

# --- Illustrative Example ---
# For organizations starting with ZOF, simplified function with 3 basic questions
minimum_can_enrich_profile:
  
  # 1. NOVELTY: Is there something new here?
  semantic_novelty:
    question: "Did I learn something that didn't exist before in our knowledge base?"
    examples_yes:
      - "I discovered a new way to solve X"
      - "I identified a pattern that wasn't documented"
      - "I created a solution that others can reuse"
    examples_no:
      - "I just executed a known process"
      - "I followed an existing tutorial without adaptations"
      - "Routine deploy/build without problems or discoveries"
  
  # 2. UTILITY: Is it worth it for others?
  practical_value:
    question: "Would others in my team/organization benefit from this knowledge?"
    examples_yes:
      - "Other developers will face this same problem"
      - "This approach saves significant time"
      - "This pattern improves quality/security"
    examples_no:
      - "It's too specific to my particular situation"
      - "Information everyone already knows"
      - "Temporary solution or disposable workaround"
  
  # 3. AUTHORITY: Can I create knowledge in this scope?
  basic_authority:
    question: "Do I have authority to create/update knowledge in this domain?"
    simple_check: |
      // Simple rule: user can only enrich in "team" scope 
      // in domains they are owners or participants
      if (uki_proposal.scope_ref == "team" && 
          user_context.domains.includes(uki_proposal.domain_ref)):
        return AUTHORIZED
      else:
        return REQUIRES_APPROVAL
        
  # Minimum Result
  minimum_decision_logic: |
    if (semantic_novelty == YES && 
        practical_value == YES && 
        basic_authority == AUTHORIZED):
      return ENRICH_APPROVED
    elif (basic_authority == REQUIRES_APPROVAL):
      return ESCALATION_REQUIRED  
    else:
      return ENRICH_REJECTED

# Optional Gradual Extensions
gradual_extensions:
  level_2_mef_criteria:
    - "MEF structurability validation"
    - "UKI mandatory fields verification"
    - "Basic semantic relationships"
  
  level_3_complete_moc:
    - "Full consultation of organizational hierarchies"
    - "Multi-level authority validation"
    - "Configurable criteria per domain"
  
  level_4_intelligent_automation:
    - "Automatic evaluation via LLM"
    - "Quality metrics"
    - "Advanced semantic validation"
```


### **Canonical Events and Workflow Patterns**
```yaml

# --- Illustrative Example ---
canonical_events:
  knowledge.added:
    description: "New content available"
    typical_context: "Documentation, specifications, decisions"
  
  work.proposed:
    description: "New work proposal"
    typical_context: "Story, epic, feature, strategy"
  
  work.refine.requested:
    description: "Refinement request"
    typical_context: "Improvements, adjustments, optimizations"
  
  assistance.requested:
    description: "Help/collaboration request"
    typical_context: "Pair programming, consulting, support"
  
  test.authored:
    description: "Test scenarios created"
    typical_context: "Unit tests, integration, acceptance"
  
  feedback.submitted:
    description: "Correction/learning"
    typical_context: "Bug reports, improvements, lessons learned"

workflow_patterns:
  request_flow:
    trigger: "work.proposed"
    application: "Implementation of new functionality following canonical states"
    
  refinement_flow:
    trigger: "work.refine.requested"
    application: "Process optimization with incremental approach"
    
  ingestion_flow:
    trigger: "knowledge.added"
    application: "Processing external documentation into structured UKIs"
    
  assistance_flow:
    trigger: "assistance.requested"
    application: "Technical support or structured pair programming"
    
  testing_flow:
    trigger: "test.authored"
    application: "Test scenario creation based on knowledge"
    
  feedback_flow:
    trigger: "feedback.submitted"
    application: "Processing corrections and learnings"
```


### **Workflow Lifecycle States**
```yaml

# --- Illustrative Example ---
workflow_lifecycle:
  initiated:
    description: "Workflow started but not yet processing"
    entry_condition: "Event trigger received and validated"
    allowed_transitions: ["active"]
  
  active:
    description: "Workflow executing canonical states"
    entry_condition: "Intake state entered successfully"
    allowed_transitions: ["suspended", "completed", "failed"]
  
  suspended:
    description: "Workflow paused pending external input"
    entry_condition: "Authority escalation or external dependency"
    allowed_transitions: ["active", "cancelled"]
  
  completed:
    description: "Workflow finished successfully"
    entry_condition: "All states completed or early termination approved"
    allowed_transitions: []
  
  failed:
    description: "Workflow terminated due to error"
    entry_condition: "Critical error or validation failure"
    allowed_transitions: ["active"]  # retry allowed
  
  cancelled:
    description: "Workflow cancelled before completion"
    entry_condition: "User or system cancellation"
    allowed_transitions: []
```


### **Free Implementation Guidance**
```yaml

# --- Illustrative Example ---
zof_prescribes:
  flow_thinking: "How to structure workflow thought"
  oracle_consultation: "When to consult the Oracle"
  enrichment_evaluation: "How to evaluate if it's worth teaching something new"
  explainability_recording: "How to record decision explainability"
  state_transitions: "Sequential progression through canonical states"

zof_does_not_prescribe:
  tools_selection: "Which tool to use (Jira, GitHub, Slack, etc.)"
  technical_implementation: "How to implement technically"
  metrics_collection: "Which metrics to collect"
  deployment_methods: "How to deploy"
  persistence_mechanisms: "How to store workflow state"

immediate_benefits:
  consistency: "Same way of thinking, different tools"
  traceability: "Always know why each decision was made"
  evolution: "Organizational knowledge grows in governed way"
  flexibility: "Each team implements with their technologies"
  authority_respect: "Respect organizational hierarchies via MOC"
  lifecycle_control: "Clear workflow state management and error recovery"

state_machine_visualization:
  mermaid_diagram: |
    stateDiagram-v2
        [*] --> Intake
        Intake --> Understand
        Understand --> Decide
        Decide --> Act
        Act --> EvaluateForEnrich
        EvaluateForEnrich --> Review: if enrichment approved
        EvaluateForEnrich --> [*]: if not justified
        Review --> Enrich: approved
        Review --> [*]: rejected
        Enrich --> [*]
        
        note right of Understand
          Mandatory Oracle
          consultation (UKIs)
        end note
        
        note right of EvaluateForEnrich
          Checkpoint: evaluates MOC
          criteria for enrichment
        end note
        
        note right of Enrich
          Conditional Oracle
          enrichment (MEF UKIs)
        end note
```


### **MOC Integration Points**
```yaml

# --- Illustrative Example ---
moc_integration:
  enrichment_criteria:
    query_path: "hierarchies.evaluation_criteria.nodes"
    purpose: "Get organizational criteria for EvaluateForEnrich checkpoint"
    response_format:
      - criterion: "relevance"
        threshold: "medium"
        evaluators: ["domain_experts"]
        weight: 0.3
      - criterion: "reusability"
        threshold: "high"
        evaluators: ["architects"]
        weight: 0.4

  authority_validation:
    query_path: "hierarchies.scope.nodes[user_scope].governance"
    purpose: "Validate user authority for enrichment scope"
    validation_logic: |
      user_scope_level = MOC.getUserScopeLevel(user_context.scope_ref)
      proposed_scope_level = MOC.getScopeLevel(uki_proposal.scope_ref)
      
      if (proposed_scope_level > user_scope_level):
        return ESCALATION_REQUIRED
      else:
        return AUTHORIZED

  domain_ownership:
    query_path: "hierarchies.domain.nodes[domain].governance.owners"
    purpose: "Verify user can create knowledge in specific domain"
    validation_logic: |
      domain_owners = MOC.getDomainOwners(uki_proposal.domain_ref)
      user_roles = user_context.roles
      
      if (hasIntersection(user_roles, domain_owners)):
        return AUTHORIZED
      else:
        return REQUIRES_APPROVAL
```


### **Integration with Other Matrix Components**
```yaml

# --- Illustrative Example ---
matrix_component_integration:
  mef_integration:
    uky_consumption: "ZOF workflows consume UKIs during Understand state"
    uki_production: "ZOF workflows produce UKIs during Enrich state"
    relationship_creation: "New UKIs reference motivating UKIs via relationships"
    
  oif_integration:
    workflow_agent: "OIF Workflow Agent orchestrates ZOF flow execution"
    knowledge_agent: "OIF Knowledge Agent handles Oracle consultation"
    governance_awareness: "All agents respect MOC hierarchies during execution"
    
  mep_integration:
    epistemological_foundation: "MEP principles guide enrichment decisions"
    authority_derivation: "Derived authority principles applied via MOC"
    explainability_requirement: "MEP explainability implemented via signals"
    
  moc_integration:
    taxonomy_source: "MOC provides all organizational taxonomies"
    governance_rules: "MOC defines authority and visibility rules"
    evaluation_criteria: "MOC configures EvaluateForEnrich checkpoint criteria"
```


---

## 8. Cross-References

- Matrix Protocol — Main Specification  
- Matrix Protocol Integration Diagram  
- Matrix Protocol Glossary  
- Matrix Protocol Integration Diagram — Portuguese  
- Matrix Protocol Glossary — Portuguese  
- MEF — Matrix Embedding Framework  
- MOC — Matrix Ontology Catalog  
- OIF — Operator Intelligence Framework  
- MEP — Matrix Epistemic Principle  
- MAL — Matrix Arbiter Layer  