---
title: "Moc Enterprise"
description: "Wrapper page for YAML asset MOC_ENTERPRISE.yaml"
layout: "docs"
sidebar: true
toc: true
navigation: true
---

> Source YAML: `en/docs/manual/templates/enterprise/MOC_ENTERPRISE.yaml`

**Open in Viewer:** [Moc Enterprise](/en/docs/viewer?file=/docs/manual/templates/enterprise/MOC_ENTERPRISE.yaml)

> 📄 Type: YAML • 📦 Size: 15.0 KB • 🕒 Last updated: 2025-10-12



```yaml

# Enterprise MOC Template - 200-1000 Employees
# Optimized for established companies with formal governance and compliance
# Focus on standardization, auditability, and risk management
# 
# Based on: MOC Unified Structure v1.0
# Compliance: Matrix Protocol v1.0 normative requirements

moc_version: "1.0"
organization: "[YOUR_ORGANIZATION_NAME]"
created_date: "[YYYY-MM-DD]"
last_modified: "[YYYY-MM-DD]"
version: "0.0.1"
template_type: "enterprise"
recommended_size: "200-1000 employees"

# =============================================================================
# ENTERPRISE CONFIGURATION - 5-level business unit hierarchy (Unified Structure)
# =============================================================================

hierarchies:
  # Knowledge Visibility and Access Control
  scope:
    metadata:
      concept: "Who can access what type of knowledge"
      governance_rules: |
        Enterprise business unit structure:
        - Corporation: All employees and contractors
        - Business Unit: Major organizational divisions
        - Department: Functional areas within BUs
        - Team: Working groups and project teams
        - Individual: Personal workspace with manager oversight
      level_semantics: |
        Level 0 = Corporation-wide public knowledge
        Level 1 = Business Unit restricted
        Level 2 = Department restricted
        Level 3 = Team restricted
        Level 4 = Individual with manager access
        
    nodes:
      - id: "corporation"
        label: "Corporation Knowledge"
        parent: null
        level: 0
        governance:
          visibility: ["all_employees", "contractors"]
          propagation: "automatic"
          authority_required: "any_employee"
          compliance_required: true
          
      - id: "product_bu"
        label: "Product Business Unit"
        parent: "corporation"
        level: 1
        governance:
          visibility: ["product_bu", "executive_team", "legal_team"]
          propagation: "restricted"
          authority_required: "bu_director"
          confidentiality_level: "internal"
          
      - id: "technology_bu"
        label: "Technology Business Unit"
        parent: "corporation"
        level: 1
        governance:
          visibility: ["technology_bu", "executive_team", "security_team"]
          propagation: "restricted"
          authority_required: "cto"
          security_classification: "internal"
          
      - id: "sales_bu"
        label: "Sales & Marketing Business Unit"
        parent: "corporation"
        level: 1
        governance:
          visibility: ["sales_bu", "executive_team", "legal_team"]
          propagation: "restricted"
          authority_required: "cro"
          
      - id: "engineering_dept"
        label: "Engineering Department"
        parent: "technology_bu"
        level: 2
        governance:
          visibility: ["engineering_dept", "technology_bu", "executive_team"]
          propagation: "department_restricted"
          authority_required: "vp_engineering"
          
      - id: "platform_team"
        label: "Platform Engineering Team"
        parent: "engineering_dept"
        level: 3
        governance:
          visibility: ["platform_team", "engineering_dept", "security_team"]
          propagation: "team_restricted"
          authority_required: "engineering_manager"
          
      - id: "personal"
        label: "Personal Workspace"
        parent: null
        level: 4
        governance:
          visibility: ["individual", "direct_manager", "hr_partner"]
          propagation: "blocked"
          authority_required: "individual"
          retention_policy: "auto_delete_on_departure"

  # Knowledge Categories
  domain:
    metadata:
      concept: "What type of knowledge this is"
      governance_rules: "Enterprise knowledge taxonomy with compliance tracking"
      
    nodes:
      - id: "technical"
        label: "Technical & Engineering"
        governance:
          owners: ["technology_bu"]
          reviewers: ["senior_engineers", "architects"]
          security_review_required: true
          
      - id: "product"
        label: "Product & Strategy"
        governance:
          owners: ["product_bu"]
          reviewers: ["product_directors", "strategy_team"]
          competitive_intelligence: true
          
      - id: "business"
        label: "Business & Operations"
        governance:
          owners: ["executive_team"]
          reviewers: ["department_heads"]
          financial_disclosure_rules: true
          
      - id: "legal"
        label: "Legal & Compliance"
        governance:
          owners: ["legal_team"]
          reviewers: ["compliance_officers"]
          attorney_client_privilege: true
          retention_mandatory: true
          
      - id: "hr"
        label: "Human Resources"
        governance:
          owners: ["hr_team"]
          reviewers: ["hr_directors"]
          confidentiality_level: "restricted"
          access_audit_required: true

  # Knowledge Quality Level (Unified Structure - Enterprise Variant)
  maturity:
    metadata:
      concept: "How validated and reliable this knowledge is"
      governance_rules: "5-level enterprise maturity with audit trails and formal governance"
      level_semantics: |
        Level 0 = Draft (work in progress, individual contribution)
        Level 1 = Team Reviewed (peer reviewed within immediate working group)
        Level 2 = Department Validated (validated by departmental leadership)
        Level 3 = Business Unit Standard (BU standard, cross-BU coordination)
        Level 4 = Corporate Policy (highest level organizational policy)
        
    nodes:
      - id: "draft"
        label: "Draft"
        level: 0
        governance:
          validation_required: false
          creation_authority: "any_employee"
          auto_expire_days: 45
          description: "Work in progress, individual contribution"
          
      - id: "team_reviewed"
        label: "Team Reviewed"
        parent: "draft"
        level: 1
        governance:
          validation_required: true
          reviewers_required: 2
          authority_required: "team_lead"
          change_log_required: true
          description: "Peer reviewed within immediate working group"
          
      - id: "department_validated"
        label: "Department Validated"
        parent: "team_reviewed"
        level: 2
        governance:
          validation_required: true
          reviewers_required: 1
          authority_required: "department_head"
          impact_assessment_required: true
          description: "Validated by departmental leadership"
          
      - id: "bu_standard"
        label: "Business Unit Standard"
        parent: "department_validated"
        level: 3
        governance:
          validation_required: true
          authority_required: "bu_director"
          cross_bu_notification: true
          compliance_review_required: true
          description: "BU standard, cross-BU coordination"
          
      - id: "corporate_policy"
        label: "Corporate Policy"
        parent: "bu_standard"
        level: 4
        governance:
          validation_required: true
          authority_required: "executive_team"
          mandatory_compliance: true
          legal_review_required: true
          training_mandatory: true
          audit_trail_required: true
          description: "Highest level organizational policy"

  # EvaluateForEnrich Criteria (Unified Structure - Enterprise Variant)
  evaluation_criteria:
    metadata:
      concept: "Criteria for EvaluateForEnrich checkpoint evaluation"
      governance_rules: "Enterprise-grade criteria with compliance and risk considerations"
      
    nodes:
      - id: "relevance"
        label: "Relevance"
        description: "Strategic and operational relevance across business units"
        governance:
          weight: "high"
          evaluation_question: "Does this knowledge address strategic business needs?"
          compliance_consideration: true
          
      - id: "reusability"
        label: "Reusability"
        description: "Cross-departmental and cross-BU reuse potential"
        governance:
          weight: "high"
          evaluation_question: "Can this knowledge be standardized across multiple units?"
          scalability_factor: true
          
      - id: "compliance"
        label: "Compliance"
        description: "Regulatory and legal compliance implications"
        governance:
          weight: "critical"
          evaluation_question: "Does this knowledge meet all regulatory requirements?"
          legal_review_required: true
          
      - id: "risk"
        label: "Risk"
        description: "Risk management and mitigation considerations"
        governance:
          weight: "high"
          evaluation_question: "What are the risk implications of this knowledge?"
          risk_assessment_required: true
          
      - id: "quality"
        label: "Quality"
        description: "Enterprise-grade quality and documentation standards"
        governance:
          weight: "medium"
          evaluation_question: "Does this meet enterprise documentation standards?"
          audit_trail_required: true

  # Content Format Type (Unified Structure - Enterprise Types)
  type:
    metadata:
      concept: "How this knowledge is structured"
      
    nodes:
      - id: "policy"
        label: "Corporate Policy"
        governance:
          required_fields: ["purpose", "scope", "policy", "procedures", "compliance", "enforcement"]
          legal_review_required: true
          version_control_mandatory: true
          
      - id: "decision"
        label: "Decision Record"
        governance:
          required_fields: ["context", "decision", "rationale", "alternatives", "stakeholders", "risks", "compliance_impact"]
          executive_notification: true
          
      - id: "process"
        label: "Process Documentation"
        governance:
          required_fields: ["purpose", "scope", "procedures", "roles", "metrics", "controls", "audit_requirements"]
          sox_compliance_check: true
          
      - id: "architecture"
        label: "Architecture Documentation"
        governance:
          required_fields: ["business_context", "architecture", "security", "compliance", "risk_assessment"]
          security_review_required: true
          
      - id: "incident"
        label: "Incident Documentation"
        governance:
          required_fields: ["timeline", "impact", "root_cause", "remediation", "prevention", "lessons_learned"]
          executive_summary_required: true
          
      - id: "audit"
        label: "Audit Documentation"
        governance:
          required_fields: ["scope", "findings", "evidence", "recommendations", "management_response"]
          retention_permanent: true

# =============================================================================
# ENTERPRISE SPECIFIC FEATURES
# =============================================================================

enterprise_features:
  # Compliance and governance
  compliance:
    sox_compliance: true
    gdpr_compliance: true
    iso27001_alignment: true
    audit_trail_complete: true
    
  # Risk management
  risk_management:
    risk_assessment_required: true
    business_continuity_planning: true
    disaster_recovery_procedures: true
    
  # Security and access control
  security:
    rbac_integration: true
    sso_required: true
    encryption_at_rest: true
    access_reviews_quarterly: true
    
  # Business intelligence
  analytics:
    knowledge_utilization_metrics: true
    compliance_dashboards: true
    risk_heat_maps: true

# =============================================================================
# USAGE EXAMPLES
# =============================================================================

examples:
  corporate_policy:
    scope: "corporation"
    domain: "legal"
    maturity: "corporate_policy"
    type: "policy"
    evaluation_criteria: "compliance"
    title: "Example: Data Privacy Policy"
    
  bu_architecture_decision:
    scope: "technology_bu"
    domain: "technical"
    maturity: "bu_standard"
    type: "architecture"
    evaluation_criteria: "reusability"
    title: "Example: Cloud Migration Strategy"
    
  incident_report:
    scope: "engineering_dept"
    domain: "technical"
    maturity: "department_validated"
    type: "incident"
    evaluation_criteria: "risk"
    title: "Example: Service Outage Post-Mortem"

# =============================================================================
# ENTERPRISE GUIDELINES
# =============================================================================

implementation_notes:
  governance_structure: |
    1. Establish clear approval hierarchies aligned with org chart
    2. Implement formal change management processes
    3. Create compliance checkpoints at each maturity level
    4. Set up regular governance review cycles
    
  risk_management: |
    1. Classify knowledge by risk and compliance requirements
    2. Implement appropriate controls for each classification
    3. Regular risk assessments of knowledge processes
    4. Business continuity planning for critical knowledge
    
  change_management: |
    1. Executive sponsorship for Matrix Protocol implementation
    2. Formal training programs for all user levels
    3. Phased rollout by business unit
    4. Success metrics and continuous improvement
    
  common_challenges: |
    - Resistance to formal processes from technical teams
    - Complex approval chains slowing down innovation
    - Knowledge buried in compliance documentation
    - Difficulty balancing governance with agility
    
  scaling_signals: |
    Consider upgrading to Corporation template when:
    - You have 900+ employees
    - Multiple geographic regions
    - Complex regulatory environments
    - Board-level governance requirements

# =============================================================================
# UNIFIED STRUCTURE COMPLIANCE
# =============================================================================

unified_structure_compliance:
  template_version: "enterprise-v1.0"
  base_structure: "MOC_UNIFIED_STRUCTURE.yaml v1.0"
  compliance_level: "full"
  
  implemented_features:
    mandatory_hierarchies: ["scope", "domain", "maturity", "evaluation_criteria"]
    extended_domains: ["technical", "product", "business", "legal", "hr"]
    enterprise_maturity_levels: ["draft", "team_reviewed", "department_validated", "bu_standard", "corporate_policy"]
    advanced_content_types: ["policy", "decision", "process", "architecture", "incident", "audit"]
    enterprise_optimizations:
      - formal_governance: true
      - compliance_tracking: true
      - audit_trails: true
      - risk_management: true
      - legal_review_integration: true
  
  upgrade_path:
    next_template: "MOC_CORPORATION_TEMPLATE.yaml"
    triggers: ["900+ employees", "multiple regions", "regulatory complexity", "board governance"]
    preserved_elements: ["core hierarchies", "enterprise governance patterns", "compliance frameworks"]
    
  version_history:
    v1.0: "Initial unified structure implementation with enterprise governance"
```
