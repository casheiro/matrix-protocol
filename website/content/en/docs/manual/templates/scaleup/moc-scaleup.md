---
title: "Moc Scaleup"
description: "Wrapper page for YAML asset MOC_SCALEUP.yaml"
layout: "docs"
sidebar: true
toc: true
navigation: true
---

> Source YAML: `en/docs/manual/templates/scaleup/MOC_SCALEUP.yaml`

**Open in Viewer:** [Moc Scaleup](/en/docs/viewer?file=/docs/manual/templates/scaleup/MOC_SCALEUP.yaml)

> 📄 Type: YAML • 📦 Size: 12.8 KB • 🕒 Last updated: 2025-10-12



```yaml
# Scale-up MOC Template - 50-200 Employees
# Optimized for growing companies with multiple teams and structured processes
# Focus on coordination, standardization, and governance
# 
# Based on: MOC Unified Structure v1.0
# Compliance: Matrix Protocol v1.0 normative requirements

moc_version: "1.0"
organization: "[YOUR_ORGANIZATION_NAME]"
created_date: "[YYYY-MM-DD]"
last_modified: "[YYYY-MM-DD]"
version: "0.0.1"
template_type: "scaleup"
recommended_size: "50-200 employees"

# =============================================================================
# SCALE-UP CONFIGURATION - 4-level tribe/squad structure (Unified Structure)
# =============================================================================

hierarchies:
  # Knowledge Visibility and Access Control
  scope:
    metadata:
      concept: "Who can access what type of knowledge"
      governance_rules: |
        Tribe/Squad model for scale-ups:
        - Company: All employees can access
        - Tribe: Cross-functional groups (Product, Engineering, Growth)
        - Squad: Specific feature teams within tribes
        - Individual: Personal workspace
      level_semantics: |
        Level 0 = Company-wide public knowledge
        Level 1 = Tribe-specific knowledge
        Level 2 = Squad-specific knowledge
        Level 3 = Individual knowledge
        
    nodes:
      - id: "company"
        label: "Company Knowledge"
        parent: null
        level: 0
        governance:
          visibility: ["all_employees"]
          propagation: "automatic"
          authority_required: "any_employee"
          
      - id: "product_tribe"
        label: "Product Tribe"
        parent: "company"
        level: 1
        governance:
          visibility: ["product_tribe", "leadership_team"]
          propagation: "restricted"
          authority_required: "tribe_lead"
          
      - id: "engineering_tribe"
        label: "Engineering Tribe"
        parent: "company"
        level: 1
        governance:
          visibility: ["engineering_tribe", "leadership_team"]
          propagation: "restricted"
          authority_required: "tribe_lead"
          
      - id: "growth_tribe"
        label: "Growth Tribe"
        parent: "company"
        level: 1
        governance:
          visibility: ["growth_tribe", "leadership_team"]
          propagation: "restricted"
          authority_required: "tribe_lead"
          
      - id: "platform_squad"
        label: "Platform Squad"
        parent: "engineering_tribe"
        level: 2
        governance:
          visibility: ["platform_squad", "engineering_tribe", "leadership_team"]
          propagation: "restricted"
          authority_required: "squad_lead"
          
      - id: "frontend_squad"
        label: "Frontend Squad"
        parent: "engineering_tribe"
        level: 2
        governance:
          visibility: ["frontend_squad", "engineering_tribe", "leadership_team"]
          propagation: "restricted"
          authority_required: "squad_lead"
          
      - id: "personal"
        label: "Personal Workspace"
        parent: null
        level: 3
        governance:
          visibility: ["individual", "direct_manager"]
          propagation: "blocked"
          authority_required: "individual"

  # Knowledge Categories
  domain:
    metadata:
      concept: "What type of knowledge this is"
      governance_rules: "Structured knowledge areas for scale-up operations"
      
    nodes:
      - id: "technical"
        label: "Technical & Engineering"
        governance:
          owners: ["engineering_tribe"]
          reviewers: ["senior_engineers", "tech_leads"]
          
      - id: "product"
        label: "Product & Design"
        governance:
          owners: ["product_tribe"]
          reviewers: ["product_managers", "designers"]
          
      - id: "business"
        label: "Business & Strategy"
        governance:
          owners: ["leadership_team"]
          reviewers: ["tribe_leads"]
          
      - id: "operations"
        label: "Operations & Processes"
        governance:
          owners: ["operations_team"]
          reviewers: ["all_employees"]
          
      - id: "people"
        label: "People & Culture"
        governance:
          owners: ["people_team"]
          reviewers: ["managers"]

  # Knowledge Quality Level (Unified Structure - Scale-up Variant)
  maturity:
    metadata:
      concept: "How validated and reliable this knowledge is"
      governance_rules: "4-level maturity model for structured validation with tribe coordination"
      level_semantics: |
        Level 0 = Draft (work in progress, individual contribution)
        Level 1 = Squad Reviewed (peer reviewed within immediate working group)
        Level 2 = Tribe Validated (validated by tribal/divisional leadership)
        Level 3 = Company Standard (organizational standard, mandatory compliance)
        
    nodes:
      - id: "draft"
        label: "Draft"
        level: 0
        governance:
          validation_required: false
          creation_authority: "any_employee"
          auto_expire_days: 60
          description: "Work in progress, individual contribution"
          
      - id: "squad_reviewed"
        label: "Squad Reviewed"
        parent: "draft"
        level: 1
        governance:
          validation_required: true
          reviewers_required: 2
          authority_required: "squad_lead"
          description: "Peer reviewed within immediate working group"
          
      - id: "tribe_validated"
        label: "Tribe Validated"
        parent: "squad_reviewed"
        level: 2
        governance:
          validation_required: true
          reviewers_required: 1
          authority_required: "tribe_lead"
          cross_tribe_notification: true
          description: "Validated by tribal/divisional leadership"
          
      - id: "company_standard"
        label: "Company Standard"
        parent: "tribe_validated"
        level: 3
        governance:
          validation_required: true
          authority_required: "leadership_team"
          mandatory_compliance: true
          description: "Organizational standard, mandatory compliance"
          training_required: true

  # EvaluateForEnrich Criteria (Unified Structure - Scale-up Variant)
  evaluation_criteria:
    metadata:
      concept: "Criteria for EvaluateForEnrich checkpoint evaluation"
      governance_rules: "Scale-up criteria focused on coordination and standardization"
      
    nodes:
      - id: "relevance"
        label: "Relevance"
        description: "Cross-squad and cross-tribe relevance"
        governance:
          weight: "high"
          evaluation_question: "Does this knowledge solve problems faced by multiple squads?"
          
      - id: "reusability"
        label: "Reusability"
        description: "Standardization potential across tribes"
        governance:
          weight: "high"
          evaluation_question: "Can this knowledge be standardized across different tribes?"
          
      - id: "coordination"
        label: "Coordination"
        description: "Impact on cross-tribe coordination and communication"
        governance:
          weight: "medium"
          evaluation_question: "Does this knowledge improve cross-tribe coordination?"
          
      - id: "scalability"
        label: "Scalability"
        description: "Alignment with company scaling needs"
        governance:
          weight: "medium"
          evaluation_question: "Does this knowledge support our scaling objectives?"
          
      - id: "quality"
        label: "Quality"
        description: "Documentation quality and completeness"
        governance:
          weight: "medium"
          evaluation_question: "Is this knowledge well-documented and actionable?"

  # Content Format Type (Unified Structure - Scale-up Types)
  type:
    metadata:
      concept: "How this knowledge is structured"
      
    nodes:
      - id: "decision"
        label: "Decision Record"
        governance:
          required_fields: ["context", "decision", "rationale", "alternatives", "stakeholders"]
          review_required: true
          notification_scope: "affected_tribes"
          
      - id: "process"
        label: "Process Documentation"
        governance:
          required_fields: ["steps", "owner", "frequency", "metrics", "dependencies"]
          update_frequency_months: 3
          compliance_tracking: true
          
      - id: "architecture"
        label: "Architecture Documentation"
        governance:
          required_fields: ["overview", "components", "interfaces", "decisions", "tradeoffs"]
          technical_review_required: true
          version_control_integration: true
          
      - id: "reference"
        label: "Reference Material"
        governance:
          required_fields: ["summary", "usage", "examples", "maintenance"]
          
      - id: "learning"
        label: "Learning & Knowledge"
        governance:
          required_fields: ["summary", "key_points", "applications", "next_steps"]
          sharing_encouraged: true

# =============================================================================
# SCALE-UP SPECIFIC FEATURES
# =============================================================================

scaleup_features:
  # Cross-squad coordination
  coordination:
    tribe_sync_meetings: true
    cross_squad_knowledge_sharing: true
    dependency_tracking: true
    
  # Structured governance
  governance:
    approval_chains: true
    escalation_procedures: true
    compliance_monitoring: true
    
  # Knowledge discoverability
  discovery:
    tribe_knowledge_dashboards: true
    expertise_mapping: true
    knowledge_recommendations: true

# =============================================================================
# USAGE EXAMPLES
# =============================================================================

examples:
  cross_squad_decision:
    scope: "engineering_tribe"
    domain: "technical"
    maturity: "tribe_validated"
    type: "architecture"
    evaluation_criteria: "reusability"
    title: "Example: Microservices Architecture Decision"
    
  company_process:
    scope: "company"
    domain: "people"
    maturity: "company_standard"
    type: "process"
    evaluation_criteria: "coordination"
    title: "Example: Performance Review Process"
    
  squad_learning:
    scope: "frontend_squad"
    domain: "technical"
    maturity: "squad_reviewed"
    type: "learning"
    evaluation_criteria: "scalability"
    title: "Example: React 18 Migration Learnings"

# =============================================================================
# SCALE-UP GUIDELINES
# =============================================================================

implementation_notes:
  tribe_setup: |
    1. Organize tribes by business capability, not technology
    2. Ensure each tribe has clear ownership boundaries
    3. Set up regular cross-tribe communication channels
    4. Define escalation paths for cross-tribe decisions
    
  governance_evolution: |
    1. Start with lightweight processes and add structure as needed
    2. Balance autonomy with coordination requirements
    3. Implement approval chains for decisions affecting multiple tribes
    4. Create feedback loops to improve processes continuously
    
  common_challenges: |
    - Knowledge silos between tribes
    - Inconsistent processes across squads
    - Decision paralysis due to complex approval chains
    - Lack of visibility into other tribes' work
    
  scaling_signals: |
    Consider upgrading to Enterprise template when:
    - You have 180+ employees
    - Multiple business units are forming
    - Regulatory compliance becomes critical
    - Geographic distribution requires formal governance

# =============================================================================
# UNIFIED STRUCTURE COMPLIANCE
# =============================================================================

unified_structure_compliance:
  template_version: "scaleup-v1.0"
  base_structure: "MOC_UNIFIED_STRUCTURE.yaml v1.0"
  compliance_level: "full"
  
  implemented_features:
    mandatory_hierarchies: ["scope", "domain", "maturity", "evaluation_criteria"]
    extended_domains: ["technical", "product", "business", "people"]
    scaleup_maturity_levels: ["draft", "squad_reviewed", "tribe_validated", "company_standard"]
    advanced_content_types: ["decision", "process", "reference", "learning", "architecture"]
    scaleup_optimizations:
      - tribe_coordination: true
      - structured_governance: true
      - cross_tribe_visibility: true
      - scalability_focus: true
      - standardization_emphasis: true
  
  upgrade_path:
    next_template: "MOC_ENTERPRISE_TEMPLATE.yaml"
    triggers: ["180+ employees", "business units forming", "regulatory compliance", "geographic distribution"]
    preserved_elements: ["core hierarchies", "tribe structure patterns", "coordination mechanisms"]
    
  version_history:
    v1.0: "Initial unified structure implementation with tribe/squad coordination"
```
