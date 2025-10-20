---
title: "Moc Startup"
description: "Wrapper page for YAML asset MOC_STARTUP.yaml"
layout: "docs"
sidebar: true
toc: true
navigation: true
---

> Source YAML: `en/docs/manual/templates/startup/MOC_STARTUP.yaml`

**Open in Viewer:** [Moc Startup](/en/docs/viewer?file=/docs/manual/templates/startup/MOC_STARTUP.yaml)

> 📄 Type: YAML • 📦 Size: 9.8 KB • 🕒 Last updated: 2025-10-12



```yaml

# Startup MOC Template - 5-50 Employees
# Optimized for startups with simple structure and fast iteration
# Focus on agility, experimentation, and rapid scaling
# 
# Based on: MOC Unified Structure v1.0
# Compliance: Matrix Protocol v1.0 normative requirements

moc_version: "1.0"
organization: "[YOUR_ORGANIZATION_NAME]"
created_date: "[YYYY-MM-DD]"
last_modified: "[YYYY-MM-DD]"
version: "0.0.1"
template_type: "startup"
recommended_size: "5-50 employees"

# =============================================================================
# STARTUP CONFIGURATION - Simple 3-level hierarchy (Unified Structure)
# =============================================================================

hierarchies:
  # Knowledge Visibility and Access Control
  scope:
    metadata:
      concept: "Who can access what type of knowledge"
      governance_rules: |
        Simple 3-level model optimized for startups:
        - Company: All employees can access
        - Team: Team members + leadership
        - Personal: Individual + direct manager only
      level_semantics: |
        Level 0 = Public for entire organization
        Level 1 = Team-specific access
        Level 2 = Personal/private access
        
    nodes:
      - id: "company"
        label: "Company Knowledge"
        parent: null
        level: 0
        governance:
          visibility: ["all_employees"]
          propagation: "automatic"
          authority_required: "any_employee"
          
      - id: "engineering"
        label: "Engineering Team"
        parent: "company"
        level: 1
        governance:
          visibility: ["engineering_team", "founders", "managers"]
          propagation: "restricted"
          authority_required: "tech_lead"
          
      - id: "product"
        label: "Product Team"
        parent: "company"
        level: 1
        governance:
          visibility: ["product_team", "founders", "managers"]
          propagation: "restricted"
          authority_required: "product_lead"
          
      - id: "personal"
        label: "Personal Notes"
        parent: null
        level: 2
        governance:
          visibility: ["individual", "direct_manager"]
          propagation: "blocked"
          authority_required: "individual"

  # Knowledge Categories
  domain:
    metadata:
      concept: "What type of knowledge this is"
      governance_rules: "Essential knowledge areas for any startup"
      
    nodes:
      - id: "technical"
        label: "Technical & Development"
        governance:
          owners: ["engineering_team"]
          reviewers: ["senior_developers"]
          
      - id: "business"
        label: "Business & Strategy"
        governance:
          owners: ["founders", "management"]
          reviewers: ["team_leads"]
          
      - id: "operations"
        label: "Operations & Processes"
        governance:
          owners: ["operations_team"]
          reviewers: ["all_employees"]

  # Knowledge Quality Level (Unified Structure - Startup Variant)
  maturity:
    metadata:
      concept: "How validated and reliable this knowledge is"
      governance_rules: "Progressive validation levels from draft to standard - optimized for startup agility"
      level_semantics: |
        Level 0 = Draft (work in progress, individual contribution)
        Level 1 = Team Reviewed (peer reviewed within immediate working group)
        Level 2 = Company Standard (organizational standard, mandatory compliance)
        
    nodes:
      - id: "draft"
        label: "Draft"
        level: 0
        governance:
          validation_required: false
          creation_authority: "any_employee"
          auto_expire_days: 90
          description: "Work in progress, individual contribution"
          
      - id: "team_reviewed"
        label: "Team Reviewed"
        parent: "draft"
        level: 1
        governance:
          validation_required: true
          reviewers_required: 1
          authority_required: "team_lead"
          description: "Peer reviewed within immediate working group"
          
      - id: "company_standard"
        label: "Company Standard"
        parent: "team_reviewed"
        level: 2
        governance:
          validation_required: true
          authority_required: "founders"
          mandatory_compliance: true
          description: "Organizational standard, mandatory compliance"

  # EvaluateForEnrich Criteria (Unified Structure - Required)
  evaluation_criteria:
    metadata:
      concept: "Criteria for EvaluateForEnrich checkpoint evaluation"
      governance_rules: "Startup-optimized criteria for knowledge enrichment decisions"
      
    nodes:
      - id: "relevance"
        label: "Relevance"
        description: "How relevant this knowledge is to other team members"
        governance:
          weight: "high"
          evaluation_question: "Will other team members face similar challenges?"
          
      - id: "reusability"
        label: "Reusability"
        description: "Potential for knowledge reuse across different contexts"
        governance:
          weight: "medium"
          evaluation_question: "Can this solution be applied to other scenarios?"
          
      - id: "quality"
        label: "Quality"
        description: "Overall quality and completeness of the knowledge"
        governance:
          weight: "medium"
          evaluation_question: "Is this knowledge well-documented and actionable?"
          
      - id: "urgency"
        label: "Urgency"
        description: "How quickly this knowledge needs to be shared"
        governance:
          weight: "low"
          evaluation_question: "Do others need this knowledge immediately?"

  # Content Format Type (Unified Structure - Base Types)
  type:
    metadata:
      concept: "How this knowledge is structured"
      
    nodes:
      - id: "decision"
        label: "Decision Record"
        governance:
          required_fields: ["context", "decision", "rationale"]
          review_required: true
          
      - id: "process"
        label: "Process Documentation"
        governance:
          required_fields: ["steps", "owner", "frequency"]
          update_frequency_months: 6
          
      - id: "reference"
        label: "Reference Material"
        governance:
          required_fields: ["summary", "usage", "examples"]
          
      - id: "learning"
        label: "Learning & Knowledge"
        governance:
          required_fields: ["summary", "key_points", "applications"]
          sharing_encouraged: true

# =============================================================================
# STARTUP-SPECIFIC FEATURES
# =============================================================================

startup_features:
  # Fast iteration and experimentation
  experimental_ukis:
    enabled: true
    auto_expire_days: 30
    require_minimal_validation: true
    
  # Simplified workflows
  approval_workflows:
    simple_majority: true
    founders_veto: true
    bypass_for_experiments: true
    
  # Cross-functional knowledge sharing
  knowledge_sharing:
    daily_standup_integration: true
    all_hands_knowledge_review: true
    cross_team_visibility: "high"

# =============================================================================
# USAGE EXAMPLES
# =============================================================================

examples:
  team_decision:
    scope: "engineering"
    domain: "technical"
    maturity: "team_reviewed"
    type: "decision"
    evaluation_criteria: "relevance"
    title: "Example: API Framework Selection"
    
  company_process:
    scope: "company"
    domain: "operations"
    maturity: "company_standard"
    type: "process"
    evaluation_criteria: "reusability"
    title: "Example: Employee Onboarding Process"
    
  personal_learning:
    scope: "personal"
    domain: "technical"
    maturity: "draft"
    type: "learning"
    evaluation_criteria: "quality"
    title: "Example: New Framework Study Notes"

# =============================================================================
# STARTUP GUIDELINES
# =============================================================================

implementation_notes:
  quick_start: |
    1. Start with 1-2 UKIs about recent important decisions
    2. Focus on preventing knowledge loss as you scale
    3. Keep processes lightweight and iterate quickly
    4. Use daily standups to reinforce UKI creation habits
    
  common_pitfalls: |
    - Don't over-engineer the taxonomy from the start
    - Don't make processes too heavy for startup pace
    - Don't skip knowledge capture during rapid growth phases
    - Don't forget to evolve the MOC as you scale
    
  scaling_signals: |
    Consider upgrading to Scale-up template when:
    - You have 40+ employees
    - Multiple distinct teams are forming
    - You need more formal governance processes
    - Cross-team coordination becomes challenging

# =============================================================================
# UNIFIED STRUCTURE COMPLIANCE
# =============================================================================

unified_structure_compliance:
  template_version: "startup-v1.0"
  base_structure: "MOC_UNIFIED_STRUCTURE.yaml v1.0"
  compliance_level: "full"
  
  implemented_features:
    mandatory_hierarchies: ["scope", "domain", "maturity", "evaluation_criteria"]
    base_domains: ["technical", "business", "operations"]
    standardized_maturity_levels: ["draft", "team_reviewed", "company_standard"]
    base_content_types: ["decision", "process", "reference", "learning"]
    startup_optimizations:
      - simplified_governance: true
      - rapid_iteration_support: true
      - founder_authority: true
      - experimental_knowledge: true
  
  upgrade_path:
    next_template: "MOC_SCALEUP_TEMPLATE.yaml"
    triggers: ["40+ employees", "multiple teams", "formal processes needed"]
    preserved_elements: ["core hierarchies", "base governance patterns"]
    
  version_history:
    v1.0: "Initial unified structure implementation"
```
