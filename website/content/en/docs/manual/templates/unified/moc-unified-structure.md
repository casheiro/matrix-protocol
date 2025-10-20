---
title: "Moc Unified Structure"
description: "Wrapper page for YAML asset MOC_UNIFIED_STRUCTURE.yaml"
layout: "docs"
sidebar: true
toc: true
navigation: true
---

> Source YAML: `en/docs/manual/templates/unified/MOC_UNIFIED_STRUCTURE.yaml`

**Open in Viewer:** [Moc Unified Structure](/en/docs/viewer?file=/docs/manual/templates/unified/MOC_UNIFIED_STRUCTURE.yaml)

> 📄 Type: YAML • 📦 Size: 16.9 KB • 🕒 Last updated: 2025-10-12



```yaml
# MOC Unified Structure - Normative Template
# Matrix Protocol v1.0 - Official specification compliance template
# THIS IS THE CANONICAL STRUCTURE - All MOCs MUST implement these 4 hierarchies

moc_version: "1.0"
organization: "[ORGANIZATION_NAME] - UNIFIED STRUCTURE"
created_date: "[YYYY-MM-DD]"
last_modified: "[YYYY-MM-DD]"
version: "1.0.0"
classification: "NORMATIVE"

# =============================================================================
# PROTOCOL COMPLIANCE STATEMENT
# =============================================================================
compliance:
  matrix_protocol_version: "1.0.0"
  mep_principles_implemented: ["semantic_elasticity", "stratified_epistemology", "responsible_promotion", "derived_authority", "necessary_explainability"]
  framework_compatibility: ["MEF", "ZOF", "OIF", "MOC", "MAL"]
  certification: "MATRIX_PROTOCOL_COMPLIANT_v1.0"

# =============================================================================
# MANDATORY HIERARCHIES - These 4 hierarchies are REQUIRED for Matrix Protocol compliance
# =============================================================================

hierarchies:
  # HIERARCHY 1: SCOPE (MANDATORY) - Knowledge visibility and organizational reach
  scope:
    metadata:
      concept: "Knowledge reach and visibility within organizational structure"
      protocol_requirement: "MANDATORY"
      governance_rules: |
        Defines WHO can access knowledge and HOW it propagates through organization.
        MUST reflect actual organizational structure and authority boundaries.
        Supports MEP Semantic Elasticity - adapt levels to your org, keep concept universal.
      level_semantics: |
        Organizations MUST define what each level means in their context.
        Common patterns:
        - Breadth-based: Level 0 = broadest access, higher levels = more restricted
        - Depth-based: Level 0 = deepest/most specific, higher levels = broader scope
        - Hierarchical: Levels map to organizational hierarchy levels
        
        CHOOSE ONE pattern and apply consistently across ALL scope nodes.
      
    # Starter nodes - CUSTOMIZE these to match your organizational structure
    nodes:
      - id: "organization"
        label: "Organization-wide"
        parent: null
        level: 0
        description: "Knowledge accessible to entire organization"
        governance:
          visibility: ["all_employees"]
          propagation: "automatic"
          authority_required: "any_authorized_employee"
          
      - id: "division"
        label: "Division-level"
        parent: "organization"
        level: 1
        description: "Knowledge specific to organizational division"
        governance:
          visibility: ["division_members", "senior_leadership"]
          propagation: "restricted"
          authority_required: "division_member"
          
      - id: "team"
        label: "Team-level"
        parent: "division"
        level: 2
        description: "Knowledge specific to team operations"
        governance:
          visibility: ["team_members", "team_leads", "managers"]
          propagation: "controlled"
          authority_required: "team_member"
          
      - id: "individual"
        label: "Individual-level"
        parent: "team"
        level: 3
        description: "Personal knowledge and notes"
        governance:
          visibility: ["individual", "direct_manager"]
          propagation: "blocked"
          authority_required: "individual_only"

  # HIERARCHY 2: DOMAIN (MANDATORY) - Knowledge specialization areas
  domain:
    metadata:
      concept: "Knowledge specialization and subject matter areas"
      protocol_requirement: "MANDATORY"
      governance_rules: |
        Defines WHAT type of knowledge this is and WHO has domain expertise.
        Enables proper routing to subject matter experts for validation.
        Supports domain-specific governance and review processes.
      
    nodes:
      - id: "technical"
        label: "Technical Knowledge"
        description: "Software, systems, architecture, and engineering practices"
        governance:
          owners: ["technical_leads", "principal_engineers"]
          reviewers: ["engineering_team"]
          mandatory_fields: ["technical_context", "implementation_details"]
          
      - id: "business"
        label: "Business Knowledge"
        description: "Strategy, processes, decisions, and business operations"
        governance:
          owners: ["business_analysts", "product_managers", "leadership"]
          reviewers: ["business_stakeholders"]
          mandatory_fields: ["business_impact", "stakeholders"]
          
      - id: "operational"
        label: "Operational Knowledge"
        description: "Day-to-day operations, procedures, and workflows"
        governance:
          owners: ["operations_team", "process_owners"]
          reviewers: ["operational_stakeholders"]
          mandatory_fields: ["process_steps", "responsibilities"]
          
      - id: "regulatory"
        label: "Regulatory & Compliance"
        description: "Legal, compliance, security, and regulatory requirements"
        governance:
          owners: ["compliance_team", "legal_team", "security_team"]
          reviewers: ["compliance_committee"]
          mandatory_fields: ["regulatory_basis", "compliance_requirements"]
          review_frequency: "quarterly"

  # HIERARCHY 3: MATURITY (MANDATORY) - Epistemological validation levels
  maturity:
    metadata:
      concept: "Knowledge validation and epistemological confidence level"
      protocol_requirement: "MANDATORY"
      governance_rules: |
        Implements MEP Stratified Epistemology and Responsible Promotion principles.
        Knowledge MUST progress through validation stages with explicit justification.
        Higher maturity levels require stronger authority and more rigorous validation.
      level_semantics: |
        Progression-based levels (0 = lowest maturity, higher = more validated):
        Level 0: Initial capture, unvalidated
        Level 1: Validated by domain expert
        Level 2: Approved by authority
        Level 3+: Organization-specific higher validation levels
      
    nodes:
      - id: "draft"
        label: "Draft"
        parent: null
        level: 0
        description: "Initial knowledge capture, not yet validated"
        governance:
          validation_required: false
          creation_authority: "any_employee"
          auto_expiry_days: 90
          promotion_criteria: "basic_review_completed"
          
      - id: "validated"
        label: "Validated"
        parent: "draft"
        level: 1
        description: "Reviewed and validated by domain expert"
        governance:
          validation_required: true
          authority_required: "domain_expert"
          reviewers_required: 1
          promotion_criteria: "domain_expert_approval"
          evidence_required: ["review_notes", "validation_checklist"]
          
      - id: "approved"
        label: "Approved"
        parent: "validated"
        level: 2
        description: "Officially approved for organizational use"
        governance:
          authority_required: "approval_authority"
          reviewers_required: 2
          promotion_criteria: "formal_approval_process"
          evidence_required: ["approval_documentation", "stakeholder_signoff"]
          audit_trail_required: true
          
      - id: "canonical"
        label: "Canonical"
        parent: "approved"
        level: 3
        description: "Organization-wide standard, highest confidence"
        governance:
          authority_required: "senior_leadership"
          committee_approval_required: true
          promotion_criteria: "strategic_alignment_confirmed"
          evidence_required: ["strategic_review", "impact_assessment", "compliance_validation"]
          immutable: true
          change_control_required: true

  # HIERARCHY 4: EVALUATION_CRITERIA (MANDATORY) - ZOF enrichment decisions
  evaluation_criteria:
    metadata:
      concept: "Criteria for ZOF EvaluateForEnrich checkpoint decisions"
      protocol_requirement: "MANDATORY"
      governance_rules: |
        Used by ZOF canonical states to determine if knowledge should be enriched.
        Implements algorithmic decision-making for knowledge creation.
        Prevents knowledge pollution while ensuring valuable insights are captured.
      
    nodes:
      - id: "strategic_value"
        label: "Strategic Business Value"
        description: "Knowledge has significant impact on business strategy or operations"
        governance:
          threshold: "high"
          evaluators: ["business_leaders", "strategic_planners"]
          weight: 0.35
          criteria: ["business_impact", "strategic_alignment", "competitive_advantage"]
          
      - id: "technical_value"
        label: "Technical Value"
        description: "Knowledge has significant technical merit or solves technical problems"
        governance:
          threshold: "medium"
          evaluators: ["technical_leads", "architects"]
          weight: 0.25
          criteria: ["technical_merit", "problem_solving", "innovation"]
          
      - id: "reusability"
        label: "Knowledge Reusability"
        description: "Knowledge can be applied in multiple contexts or by multiple teams"
        governance:
          threshold: "medium"
          evaluators: ["knowledge_managers", "team_leads"]
          weight: 0.20
          criteria: ["applicability_breadth", "transferability", "generalization"]
          
      - id: "urgency"
        label: "Urgency and Timeliness"
        description: "Knowledge addresses urgent needs or time-sensitive decisions"
        governance:
          threshold: "medium"
          evaluators: ["operational_managers"]
          weight: 0.20
          criteria: ["time_sensitivity", "operational_impact", "decision_dependency"]

# =============================================================================
# GOVERNANCE FRAMEWORK - Implements MEP principles
# =============================================================================
governance:
  # Version control and change management
  version_control:
    change_approval_required: true
    change_authority: "governance_committee"
    semantic_versioning: true
    backward_compatibility_required: true
    
  # Audit trail for compliance and epistemological tracking
  audit_trail:
    retention_period_days: 2555  # 7 years for regulatory compliance
    track_all_changes: true
    track_access_patterns: true
    epistemological_reasoning_required: true
    
  # Conflict resolution (MAL integration)
  conflict_resolution:
    escalation_path: ["domain_expert", "team_lead", "division_lead", "governance_committee"]
    arbitration_policy: "moc:arbitration:precedence_rules_p1_to_p6"
    timeout_policy: "5_business_days_max"
    mal_integration_enabled: true
    
  # Authority derivation (MEP Derived Authority principle)
  authority_management:
    authority_validation_service: "moc:authority:organizational_hierarchy"
    delegation_rules: "explicit_delegation_required"
    authority_audit_frequency: "monthly"
    
  # Knowledge lifecycle management
  lifecycle_management:
    automatic_review_cycles: true
    deprecation_process: "formal_deprecation_with_migration"
    archival_policy: "compliance_driven_retention"
    knowledge_evolution_tracking: true

# =============================================================================
# INTEGRATION SPECIFICATIONS - How this MOC integrates with other frameworks
# =============================================================================
integration:
  # MEF (Matrix Embedding Framework) integration
  mef_integration:
    uki_validation: "strict_moc_compliance_required"
    relationship_validation: "semantic_consistency_enforced"
    versioning_integration: "automatic_moc_version_tracking"
    
  # ZOF (Zion Orchestration Framework) integration
  zof_integration:
    oracle_consultation: "automatic_uki_query_by_scope_domain"
    enrichment_criteria: "evaluation_criteria_hierarchy_driven"
    workflow_authority: "scope_based_permission_checking"
    
  # OIF (Operator Intelligence Framework) integration
  oif_integration:
    archetype_authority: "hierarchy_based_permission_filtering"
    explanation_citations: "automatic_moc_node_referencing"
    derived_authority_compliance: "strict_no_absolute_claims"
    
  # MAL (Matrix Arbiter Layer) integration
  mal_integration:
    precedence_configuration: "p1_authority_weight_moc_driven"
    conflict_detection: "automatic_moc_hierarchy_violation_detection"
    arbitration_evidence: "moc_governance_rules_as_evidence"

# =============================================================================
# VALIDATION AND COMPLIANCE CHECKLIST
# =============================================================================
validation:
  mandatory_hierarchy_check:
    scope_hierarchy: "✓ IMPLEMENTED"
    domain_hierarchy: "✓ IMPLEMENTED"
    maturity_hierarchy: "✓ IMPLEMENTED"
    evaluation_criteria_hierarchy: "✓ IMPLEMENTED"
    
  mep_principle_compliance:
    semantic_elasticity: "✓ - Flexible level semantics, universal concepts"
    stratified_epistemology: "✓ - Clear maturity progression with validation"
    responsible_promotion: "✓ - Authority and evidence required for advancement"
    derived_authority: "✓ - All authority traced to organizational roles"
    necessary_explainability: "✓ - Complete governance documentation"
    
  framework_integration_compliance:
    mef_compliance: "✓ - UKI structure fully supported with validation"
    zof_compliance: "✓ - Oracle consultation and enrichment criteria configured"
    oif_compliance: "✓ - Authority hierarchies and explanation patterns established"
    mal_compliance: "✓ - Conflict resolution and arbitration policies configured"
    
  governance_completeness:
    version_control: "✓ - Change management process defined"
    audit_trail: "✓ - Complete tracking and retention policies"
    conflict_resolution: "✓ - Escalation and arbitration processes"
    authority_management: "✓ - Authority validation and delegation rules"
    lifecycle_management: "✓ - Review, deprecation, and archival processes"

# =============================================================================
# CUSTOMIZATION GUIDE - How to adapt this template to your organization
# =============================================================================
customization_guide:
  step_1_organization_mapping:
    - "Replace [ORGANIZATION_NAME] with your actual organization name"
    - "Map scope.nodes to your real organizational structure"
    - "Customize authority roles to match your org chart"
    - "Adjust governance.escalation_path to your management hierarchy"
    
  step_2_domain_specialization:
    - "Add domain-specific nodes relevant to your industry"
    - "Configure domain.governance.owners with your actual expert roles"
    - "Define domain-specific mandatory_fields for your knowledge types"
    
  step_3_maturity_calibration:
    - "Adjust maturity promotion criteria to your validation processes"
    - "Configure authority_required levels to match your approval processes"
    - "Set appropriate auto_expiry_days for draft knowledge"
    
  step_4_evaluation_tuning:
    - "Adjust evaluation_criteria weights based on your organizational priorities"
    - "Customize threshold levels based on your knowledge quality standards"
    - "Map evaluators to your actual roles and responsibilities"
    
  step_5_governance_alignment:
    - "Configure retention_period_days based on your compliance requirements"
    - "Adjust timeout_policy based on your decision-making speed requirements"
    - "Customize conflict_resolution based on your organizational culture"

# =============================================================================
# IMPLEMENTATION SUCCESS METRICS
# =============================================================================
success_metrics:
  adoption_metrics:
    - "UKI creation rate across all domains"
    - "Knowledge promotion rate from draft to validated"
    - "Authority validation compliance rate"
    - "Conflict resolution time and satisfaction"
    
  quality_metrics:
    - "Knowledge validation accuracy by domain experts"
    - "Relationship semantic consistency rate"
    - "Governance rule compliance percentage"
    - "Audit trail completeness score"
    
  business_impact_metrics:
    - "Decision-making speed improvement"
    - "Knowledge reuse rate across teams"
    - "Onboarding time reduction for new employees"
    - "Compliance audit pass rate improvement"

# =============================================================================
# VERSION HISTORY AND EVOLUTION
# =============================================================================
version_history:
  v1.0.0:
    date: "2024-12-01"
    changes: "Initial unified structure release"
    migration_required: false
    backward_compatible: true
    
  evolution_roadmap:
    v1.1.0: "Enhanced evaluation criteria with AI integration"
    v1.2.0: "Advanced MAL precedence rules and conflict patterns"
    v2.0.0: "Multi-organizational federation support"
```
