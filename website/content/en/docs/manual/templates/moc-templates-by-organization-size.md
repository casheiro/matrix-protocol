---
title: MOC Templates by Size
description: Matrix Ontology Catalog templates adapted for organizations of different sizes, from startups to large enterprises
icon: i-heroicons-document-duplicate
layout: docs
sidebar: true
toc: true
navigation: true
lang: en
last_updated: 2025-10-23
framework: MEF
maturity: stable
tags:
  - manual
  - templates
order: 10
---

# MOC Templates by Organizational Size
**Matrix Ontology Catalog Templates for Different Organization Types**

**Version:** 0.0.1-beta  
**Date:** 2025-10-05  
**Compatibility:** Matrix Protocol v0.0.1-beta  

> 🎯 **Purpose**: Provide ready-to-use MOC templates adapted for organizations of different sizes, from startups to large enterprises.

---

## 📊 Template Overview

| Template Type | Organization Size | Employees | Complexity | Hierarchies | Implementation Time |
|---------------|-------------------|-----------|------------|-------------|-------------------|
| **Startup**    | Small            | 5-50      | Simple     | 4 core      | 2-3 months       |
| **Scale-up**   | Medium           | 50-200    | Moderate   | 5-6         | 3-4 months       |
| **Enterprise** | Large            | 200-1000  | Complex    | 6-7         | 4-6 months       |
| **Corporation** | Very Large       | 1000+     | Advanced   | 7+          | 6-12 months      |

---

## 🚀 Startup Template (5-50 employees)

### Context
- **Stage:** Initial growth, focus on product-market fit
- **Structure:** Flat hierarchy, cross-functional teams
- **Priorities:** Speed, simplicity, essential knowledge capture
- **Challenges:** Limited resources, rapid change, knowledge in people's heads

### MOC Configuration

```yaml


# MOC_TEMPLATE_STARTUP.yaml
moc_version: "1.0"
organization: "[STARTUP_NAME]"
created_date: "[YYYY-MM-DD]"
last_modified: "[YYYY-MM-DD]"
version: "1.0.0"

# Optimized for startup: only 4 essential hierarchies
hierarchies:
  scope:
    metadata:
      concept: "Knowledge reach and team visibility"
      governance_rules: |
        Simple 2-level model: Individual → Team → Company
        Focus on knowledge sharing and preventing single points of failure.
      level_semantics: |
        Level 0 = Company knowledge (everyone can access)
        Level 1 = Team-specific knowledge (team members + leadership)
        Level 2 = Individual knowledge (personal notes, drafts)
        Higher level = more specific scope.
    nodes:
      - id: "company"
        label: "Entire Company"
        parent: null
        level: 0
        governance:
          visibility: ["all_employees", "contractors"]
          propagation: "automatic"
          authority_required: "founder"
          
      - id: "team-product"
        label: "Product Team"
        parent: "company"
        level: 1
        governance:
          visibility: ["product_team", "leadership"]
          propagation: "restricted"
          authority_required: "product_lead"
          
      - id: "team-engineering"
        label: "Engineering Team" 
        parent: "company"
        level: 1
        governance:
          visibility: ["engineering_team", "leadership"]
          propagation: "restricted"
          authority_required: "tech_lead"
          
      - id: "team-operations"
        label: "Operations Team"
        parent: "company"
        level: 1
        governance:
          visibility: ["ops_team", "leadership"]
          propagation: "restricted"
          authority_required: "ops_lead"
          
      - id: "personal"
        label: "Personal Notes"
        parent: null
        level: 2
        governance:
          visibility: ["owner_only"]
          propagation: "none"
          authority_required: "self"

  domain:
    metadata:
      concept: "Functional knowledge areas"
      governance_rules: |
        Startup-focused domains covering essential business functions.
        Emphasis on product development and customer success.
    nodes:
      - id: "product"
        label: "Product and Strategy"
        parent: null
        level: 0
        governance:
          owners: ["product_lead", "founders"]
          reviewers: ["team_leads"]
          validation_required: false
          
      - id: "technical"
        label: "Technical and Engineering"
        parent: null
        level: 0
        governance:
          owners: ["tech_lead", "senior_devs"]
          reviewers: ["engineering_team"]
          validation_required: true
          
      - id: "business"
        label: "Business and Operations"
        parent: null
        level: 0
        governance:
          owners: ["founders", "ops_lead"]
          reviewers: ["leadership_team"]
          validation_required: false
          
      - id: "culture"
        label: "Team and Culture"
        parent: null
        level: 0
        governance:
          owners: ["founders", "hr_lead"]
          reviewers: ["all_employees"]
          validation_required: false

  maturity:
    metadata:
      concept: "Knowledge validation levels"
      governance_rules: |
        Simplified 3-level maturity for rapid iteration.
        Focus on practical validation over formal processes.
      level_semantics: |
        Level 0 = Draft (work notes, ideas)
        Level 1 = Validated (team-reviewed, tested)
        Level 2 = Standard (company-adopted, documented)
        Higher level = greater validation and adoption.
    nodes:
      - id: "draft"
        label: "Draft"
        parent: null
        level: 0
        governance:
          auto_promotion: false
          validation_required: false
          creation_authority: "any_employee"
          review_frequency_days: 30
          
      - id: "validated"
        label: "Team Validated"
        parent: "draft"
        level: 1
        governance:
          auto_promotion: false
          validation_required: true
          authority_required: "team_lead"
          reviewers_required: 1
          review_frequency_days: 60
          
      - id: "standard"
        label: "Company Standard"
        parent: "validated"
        level: 2
        governance:
          auto_promotion: false
          validation_required: true
          authority_required: "founder"
          review_frequency_days: 90
          compliance_mandatory: true

  type:
    metadata:
      concept: "Knowledge structure types"
      governance_rules: |
        Essential knowledge types for startup operations.
        Emphasis on practical patterns and quick decisions.
    nodes:
      - id: "decision"
        label: "Decision Record"
        parent: null
        level: 0
        governance:
          required_fields: ["examples", "justification"]
          applies_to_domains: ["product", "technical", "business"]
          validation_authority: "team_leads"
          
      - id: "pattern"
        label: "Best Practices"
        parent: null
        level: 0
        governance:
          required_fields: ["examples"]
          applies_to_domains: ["technical", "product"]
          validation_authority: "domain_experts"
          
      - id: "procedure"
        label: "Process/Procedure"
        parent: null
        level: 0
        governance:
          required_fields: ["examples", "steps"]
          applies_to_domains: ["business", "technical"]
          validation_authority: "process_owners"
          
      - id: "guideline"
        label: "Guidance"
        parent: null
        level: 0
        governance:
          required_fields: ["examples"]
          applies_to_domains: ["culture", "product"]
          validation_authority: "team_leads"

governance:
  version_control:
    change_approval_required: false  # Priority on rapid iteration
    change_authority: "founders"
    impact_analysis_required: false
    
  audit_trail:
    track_changes: true
    retention_period_days: 365  # 1 year minimum
    validation_frequency_days: 90
    
  conflict_resolution:
    escalation_path: ["team_lead", "founder"]
    resolution_timeout_days: 3  # Fast resolution needed
    
named_arbitration_policies:
  "moc:arbitration:startup_speed":
    description: "Arbitration optimized for speed in startup environment"
    precedence_order:
      - "P4_temporal_recency"     # Most recent wins in fast-moving environment
      - "P1_authority_weight"     # Then authority
      - "P3_maturity_level"       # Then validation
      - "P6_deterministic_fallback"
    temporal_window_ms: 60000     # 1-minute concurrency window
```


### Implementation Notes for Startups

**Strengths of this Template:**
- ✅ Simple structure minimizes complexity
- ✅ Fast conflict resolution (3-day timeout)
- ✅ Emphasis on speed over formal process
- ✅ Founder authority for important decisions
- ✅ Minimal governance overhead

**Adaptation Guidelines:**
- Adjust team names to match your structure
- Add domain categories specific to your sector
- Consider adding `security` domain if handling sensitive data
- Scale scope hierarchy as teams grow

---

## 📈 Scale-up Template (50-200 employees)

### Context
- **Stage:** Rapid growth, scaling operations
- **Structure:** Department formation, management layer emerging
- **Priorities:** Process standardization, knowledge scaling, quality control
- **Challenges:** Growing pains, process gaps, knowledge bottlenecks

### MOC Configuration

```yaml


# MOC_TEMPLATE_SCALEUP.yaml
moc_version: "1.0"
organization: "[SCALEUP_NAME]"
created_date: "[YYYY-MM-DD]"
last_modified: "[YYYY-MM-DD]"
version: "1.0.0"

# Optimized for scale-up: 5 hierarchies with growth flexibility
hierarchies:
  scope:
    metadata:
      concept: "Knowledge reach across growing organization"
      governance_rules: |
        3-level model preparing for departmental structure: 
        Individual → Team → Department → Company
      level_semantics: |
        Level 0 = Entire company (all employees)
        Level 1 = Department-specific (department + leadership)
        Level 2 = Team-specific (team members + management)
        Level 3 = Individual (personal workspace)
    nodes:
      - id: "company"
        label: "Entire Company"
        parent: null
        level: 0
        governance:
          visibility: ["all_employees", "contractors", "board"]
          propagation: "automatic"
          authority_required: "executive_team"
          
      # Department Level (emerging structure)
      - id: "department-product"
        label: "Product Department"
        parent: "company"
        level: 1
        governance:
          visibility: ["product_department", "executive_team"]
          propagation: "restricted"
          authority_required: "head_of_product"
          
      - id: "department-engineering" 
        label: "Engineering Department"
        parent: "company"
        level: 1
        governance:
          visibility: ["engineering_department", "executive_team"]
          propagation: "restricted"
          authority_required: "vp_engineering"
          
      - id: "department-operations"
        label: "Operations Department"
        parent: "company"
        level: 1
        governance:
          visibility: ["operations_department", "executive_team"]
          propagation: "restricted"
          authority_required: "head_of_operations"
          
      # Team Level (within departments)
      - id: "team-frontend"
        label: "Frontend Team"
        parent: "department-engineering"
        level: 2
        governance:
          visibility: ["frontend_team", "engineering_department"]
          propagation: "restricted"
          authority_required: "frontend_lead"
          
      - id: "team-backend"
        label: "Backend Team"
        parent: "department-engineering"
        level: 2
        governance:
          visibility: ["backend_team", "engineering_department"]
          propagation: "restricted"
          authority_required: "backend_lead"

  domain:
    metadata:
      concept: "Specialized knowledge domains"
      governance_rules: |
        Expanded domains reflecting departmental specialization.
        Clear ownership as organization grows.
    nodes:
      - id: "product"
        label: "Product and Strategy"
        parent: null
        level: 0
        governance:
          owners: ["product_managers", "head_of_product"]
          reviewers: ["executive_team", "design_team"]
          validation_required: true
          
      - id: "technical"
        label: "Technical and Architecture"
        parent: null
        level: 0
        governance:
          owners: ["senior_engineers", "vp_engineering", "architects"]
          reviewers: ["engineering_department", "tech_committee"]
          validation_required: true
          
      - id: "business"
        label: "Business and Operations"
        parent: null
        level: 0
        governance:
          owners: ["operations_team", "business_analysts"]
          reviewers: ["executive_team", "department_heads"]
          validation_required: true
          
      - id: "design"
        label: "User Experience and Design"
        parent: null
        level: 0
        governance:
          owners: ["designers", "design_lead"]
          reviewers: ["product_team", "user_research"]
          validation_required: false
          
      - id: "security"
        label: "Security and Compliance"
        parent: null
        level: 0
        governance:
          owners: ["security_lead", "devops_team"]
          reviewers: ["engineering_department", "compliance_team"]
          validation_required: true
          authority_weight: 1.3  # Higher precedence for security

  maturity:
    metadata:
      concept: "Knowledge maturation pipeline"
      governance_rules: |
        4-level maturity supporting quality scaling.
        Emphasis on peer review and validation.
      level_semantics: |
        Level 0 = Draft (individual work)
        Level 1 = Reviewed (peer-validated)
        Level 2 = Approved (department standard)
        Level 3 = Company Standard (entire organization)
    nodes:
      - id: "draft"
        label: "Draft"
        parent: null
        level: 0
        governance:
          auto_promotion: false
          validation_required: false
          creation_authority: "any_employee"
          review_frequency_days: 21
          
      - id: "reviewed" 
        label: "Peer Reviewed"
        parent: "draft"
        level: 1
        governance:
          auto_promotion: false
          validation_required: true
          authority_required: "peer_reviewer"
          reviewers_required: 1
          review_frequency_days: 45
          
      - id: "approved"
        label: "Department Standard"
        parent: "reviewed"
        level: 2
        governance:
          auto_promotion: false
          validation_required: true
          authority_required: "department_head"
          reviewers_required: 2
          review_frequency_days: 90
          
      - id: "company_standard"
        label: "Company Standard"
        parent: "approved"
        level: 3
        governance:
          auto_promotion: false
          validation_required: true
          authority_required: "executive_team"
          review_frequency_days: 180
          compliance_mandatory: true

  type:
    metadata:
      concept: "Knowledge classification system"
      governance_rules: |
        Comprehensive types supporting departmental needs.
        Clear validation requirements by type.
    nodes:
      - id: "policy"
        label: "Company Policy"
        parent: null
        level: 0
        governance:
          required_fields: ["examples", "application", "exceptions"]
          applies_to_domains: ["business", "security", "culture"]
          validation_authority: "executive_team"
          compliance_mandatory: true
          
      - id: "standard"
        label: "Technical Standard"
        parent: null
        level: 0
        governance:
          required_fields: ["examples", "implementation"]
          applies_to_domains: ["technical", "security"]
          validation_authority: "tech_committee"
          
      - id: "best_practice"
        label: "Best Practice Pattern"
        parent: null
        level: 0
        governance:
          required_fields: ["examples", "relationships"]
          applies_to_domains: ["technical", "product", "design"]
          validation_authority: "domain_experts"

  authority:
    metadata:
      concept: "Authority hierarchy for decision making"
      governance_rules: |
        Growing authority structure with clear escalation.
        Department-based authority emerging.
      level_semantics: |
        Level 0 = Individual contributor
        Level 1 = Team lead/Senior
        Level 2 = Department head  
        Level 3 = Executive team
    nodes:
      - id: "contributor"
        label: "Individual Contributor"
        parent: null
        level: 0
        governance:
          knowledge_creation: ["draft"]
          scope_authority: ["personal"]
          
      - id: "senior_contributor"
        label: "Senior Contributor"
        parent: "contributor"
        level: 1
        governance:
          knowledge_creation: ["draft", "reviewed"]
          scope_authority: ["team"]
          
      - id: "team_lead"
        label: "Team Lead"
        parent: "senior_contributor"
        level: 1
        governance:
          knowledge_creation: ["draft", "reviewed", "approved"]
          scope_authority: ["team", "department"]
          
      - id: "department_head"
        label: "Department Head"
        parent: "team_lead"
        level: 2
        governance:
          knowledge_creation: ["all"]
          scope_authority: ["department", "company"]
          
      - id: "executive"
        label: "Executive Team"
        parent: "department_head"
        level: 3
        governance:
          knowledge_creation: ["all"]
          scope_authority: ["company"]
          policy_creation: true

governance:
  version_control:
    change_approval_required: true
    change_authority: "department_heads"
    impact_analysis_required: true
    
  audit_trail:
    track_changes: true
    retention_period_days: 1095  # 3 years
    validation_frequency_days: 60
    
  conflict_resolution:
    escalation_path: ["team_lead", "department_head", "executive_team"]
    resolution_timeout_days: 7
    
named_arbitration_policies:
  "moc:arbitration:scaleup_balance":
    description: "Balanced arbitration for growing organization"
    precedence_order:
      - "P1_authority_weight"     # Authority structure important
      - "P3_maturity_level"       # Quality matters for scale
      - "P2_scope_specificity"    # Department vs company scope
      - "P4_temporal_recency"     # Recent decisions
      - "P5_evidence_density"     # Evidence-based decisions
      - "P6_deterministic_fallback"
```


---

## 🏢 Enterprise Template (200-1000 employees)

### Context
- **Stage:** Established organization with multiple divisions
- **Structure:** Multi-level hierarchy, specialized functions
- **Priorities:** Governance, compliance, cross-division coordination
- **Challenges:** Complexity management, knowledge silos, regulatory requirements

### MOC Configuration

```yaml


# MOC_TEMPLATE_ENTERPRISE.yaml
moc_version: "1.0"
organization: "[ENTERPRISE_NAME]"
created_date: "[YYYY-MM-DD]"
last_modified: "[YYYY-MM-DD]"
version: "1.0.0"

# Enterprise level: 6 comprehensive hierarchies
hierarchies:
  scope:
    metadata:
      concept: "Enterprise knowledge governance and reach"
      governance_rules: |
        Enterprise 4-level model: Individual → Team → Division → Organization
        Clear boundaries and governance at each level.
      level_semantics: |
        Level 0 = Entire organization (all employees globally)
        Level 1 = Division-specific (division + executives)
        Level 2 = Team/department-specific (team + division leadership)
        Level 3 = Individual/project-specific (limited access)
    nodes:
      - id: "organization"
        label: "Entire Organization"
        parent: null
        level: 0
        governance:
          visibility: ["all_employees", "contractors", "partners", "board"]
          propagation: "automatic"
          authority_required: "c_level"
          
      # Division Level
      - id: "division-technology"
        label: "Technology Division"
        parent: "organization"
        level: 1
        governance:
          visibility: ["technology_division", "c_level", "cross_division_functions"]
          propagation: "restricted"
          authority_required: "cto"
          
      - id: "division-product"
        label: "Product Division"
        parent: "organization"
        level: 1
        governance:
          visibility: ["product_division", "c_level", "cross_division_functions"]
          propagation: "restricted"
          authority_required: "cpo"
          
      - id: "division-operations"
        label: "Operations Division"
        parent: "organization"
        level: 1
        governance:
          visibility: ["operations_division", "c_level", "cross_division_functions"]
          propagation: "restricted"
          authority_required: "coo"

  domain:
    metadata:
      concept: "Enterprise knowledge domains with specialized ownership"
      governance_rules: |
        Comprehensive domain coverage for enterprise operations.
        Clear ownership, review chains, and compliance requirements.
    nodes:
      - id: "business_strategy"
        label: "Business Strategy and Planning"
        parent: null
        level: 0
        governance:
          owners: ["c_level", "strategy_team", "business_analysts"]
          reviewers: ["board", "executive_committee", "division_heads"]
          validation_required: true
          
      - id: "technical_architecture"
        label: "Technical Architecture and Engineering"
        parent: null
        level: 0
        governance:
          owners: ["architects", "principal_engineers", "vp_engineering"]
          reviewers: ["architecture_committee", "technology_leaders"]
          validation_required: true
          
      - id: "security_compliance"
        label: "Security and Compliance"
        parent: null
        level: 0
        governance:
          owners: ["ciso", "security_architects", "compliance_officers"]
          reviewers: ["security_committee", "audit_team", "legal"]
          validation_required: true
          authority_weight: 1.5  # Higher precedence

  maturity:
    metadata:
      concept: "Enterprise knowledge maturity pipeline"
      governance_rules: |
        5-level maturity supporting enterprise governance.
        Rigorous validation and compliance requirements.
      level_semantics: |
        Level 0 = Draft (individual work, experiments)
        Level 1 = Reviewed (peer/team validated)
        Level 2 = Approved (department/division standard)
        Level 3 = Enterprise Standard (entire organization)
        Level 4 = Regulatory Standard (compliance/audit mandatory)
    nodes:
      - id: "draft"
        label: "Draft"
        parent: null
        level: 0
        governance:
          auto_promotion: false
          validation_required: false
          creation_authority: "any_employee"
          review_frequency_days: 14
          
      - id: "enterprise_standard"
        label: "Enterprise Standard"
        parent: "approved"
        level: 3
        governance:
          auto_promotion: false
          validation_required: true
          authority_required: "division_head"
          reviewers_required: 5
          evidence_required: ["cross_division_validation", "executive_approval"]
          review_frequency_days: 180
          compliance_mandatory: true
          
      - id: "regulatory_standard"
        label: "Regulatory/Audit Standard"
        parent: "enterprise_standard"
        level: 4
        governance:
          auto_promotion: false
          validation_required: true
          authority_required: "c_level"
          reviewers_required: ["legal", "compliance", "external_auditor"]
          evidence_required: ["regulatory_approval", "audit_validation"]
          review_frequency_days: 365
          compliance_mandatory: true
          immutable_after_approval: true

  type:
    metadata:
      concept: "Enterprise knowledge type classification"
      governance_rules: |
        Comprehensive type system supporting all enterprise functions.
        Clear validation requirements and compliance by type.
    nodes:
      - id: "corporate_policy"
        label: "Corporate Policy"
        parent: null
        level: 0
        governance:
          required_fields: ["examples", "application", "exceptions", "compliance"]
          applies_to_domains: ["business_strategy", "security_compliance", "human_resources"]
          validation_authority: "c_level"
          compliance_mandatory: true
          legal_review_required: true

  authority:
    metadata:
      concept: "Enterprise decision authority hierarchy"
      governance_rules: |
        Multi-level authority structure with clear escalation paths.
        Function-based authority with matrix management support.
      level_semantics: |
        Level 0 = Individual contributor
        Level 1 = Team lead/Manager
        Level 2 = Senior manager/Director
        Level 3 = Division head/VP
        Level 4 = C-level executive
        Level 5 = Board level
    nodes:
      - id: "c_level"
        label: "C-Level Executive"
        parent: "vp"
        level: 4
        governance:
          knowledge_creation: ["all"]
          scope_authority: ["organization"]
          policy_creation: true
          regulatory_authority: true
          
      - id: "board"
        label: "Board of Directors"
        parent: "c_level"
        level: 5
        governance:
          knowledge_creation: ["corporate_policy", "regulatory_standard"]
          scope_authority: ["organization"]
          governance_authority: true

governance:
  version_control:
    change_approval_required: true
    change_authority: "change_control_board"
    impact_analysis_required: true
    stakeholder_notification: "automatic"
    
  audit_trail:
    track_changes: true
    retention_period_days: 2555  # 7 years
    validation_frequency_days: 30
    compliance_reporting: "quarterly"
    
  conflict_resolution:
    escalation_path: ["manager", "director", "vp", "c_level", "board"]
    resolution_timeout_days: 14
    external_mediation_available: true

named_arbitration_policies:
  "moc:arbitration:enterprise_governance":
    description: "Enterprise-level governance-focused arbitration"
    precedence_order:
      - "P1_authority_weight"     # Authority critical in enterprise
      - "P3_maturity_level"       # Regulatory standards prioritized
      - "P2_scope_specificity"    # Enterprise vs division scope
      - "P5_evidence_density"     # Evidence-based decisions
      - "P4_temporal_recency"     # Recent decisions
      - "P6_deterministic_fallback"
    minimum_authority_required: "senior_manager"
    regulatory_override: true
    compliance_validation: true
```


---

## 🏛️ Corporation Template (1000+ employees)

### Context
- **Stage:** Large-scale company, potentially multinational
- **Structure:** Complex matrix organization, multiple business units
- **Priorities:** Global governance, regulatory compliance, knowledge at scale
- **Challenges:** Complexity management, cultural differences, regulatory diversity

### MOC Configuration

```yaml


# MOC_TEMPLATE_CORPORATION.yaml
moc_version: "1.0"
organization: "[CORPORATION_NAME]"
created_date: "[YYYY-MM-DD]"
last_modified: "[YYYY-MM-DD]" 
version: "1.0.0"

# Corporate scale: 7+ hierarchies with maximum governance
hierarchies:
  scope:
    metadata:
      concept: "Global corporate knowledge governance and reach"
      governance_rules: |
        Corporate 5-level model supporting global operations:
        Individual → Team → Department → Division → Business Unit → Corporation
        Matrix geographical and business unit considerations.
      level_semantics: |
        Level 0 = Corporate (global access)
        Level 1 = Business Unit specific (BU + corporate)
        Level 2 = Division specific (division + BU + corporate)
        Level 3 = Department specific (dept + div + BU)
        Level 4 = Team specific (team + management chain)
        Level 5 = Individual/project specific (limited access)
    nodes:
      # Corporate Level
      - id: "corporation"
        label: "Corporate"
        parent: null
        level: 0
        governance:
          visibility: ["all_global_employees", "contractors", "partners", "board"]
          propagation: "automatic"
          authority_required: "ceo"
          geographical_reach: "global"
          
      # Business Unit Level
      - id: "business-unit-technology"
        label: "Technology Business Unit"
        parent: "corporation"
        level: 1
        governance:
          visibility: ["bu_technology", "corporate_executives", "cross_bu_functions"]
          propagation: "restricted"
          authority_required: "president_technology"
          geographical_reach: "global"

  domain:
    metadata:
      concept: "Corporate knowledge domains with global specialization"
      governance_rules: |
        Comprehensive domain coverage for multinational corporate operations.
        Geographic and regulatory compliance considerations.
    nodes:
      - id: "corporate_strategy"
        label: "Corporate Strategy and Governance"
        parent: null
        level: 0
        governance:
          owners: ["ceo", "strategy_team", "corporate_development"]
          reviewers: ["board", "executive_committee", "business_unit_presidents"]
          validation_required: true
          board_approval_required: true
          
      - id: "global_security_compliance"
        label: "Global Security and Compliance"
        parent: null
        level: 0
        governance:
          owners: ["ciso", "compliance_director", "security_council"]
          reviewers: ["audit_committee", "risk_committee", "external_auditors"]
          validation_required: true
          authority_weight: 2.0  # Higher precedence
          regulatory_oversight: true

  maturity:
    metadata:
      concept: "Corporate knowledge maturity with regulatory oversight"
      governance_rules: |
        6-level maturity supporting corporate governance and compliance.
        Board-level oversight for highest maturity knowledge.
      level_semantics: |
        Level 0 = Draft (individual/team work)
        Level 1 = Reviewed (peer/department validated)
        Level 2 = Approved (division/BU standard)
        Level 3 = Corporate Standard (entire corporation)
        Level 4 = Regulatory Standard (mandatory compliance)
        Level 5 = Board Standard (board-approved, public impact)
    nodes:
      - id: "board_standard"
        label: "Board Standard"
        parent: "regulatory_standard"
        level: 5
        governance:
          auto_promotion: false
          validation_required: true
          authority_required: "board_of_directors"
          reviewers_required: ["independent_directors", "audit_committee", "external_consultants"]
          evidence_required: ["board_resolution", "independent_validation"]
          review_frequency_days: 365
          compliance_mandatory: true
          immutable_after_approval: true
          public_disclosure_required: true
          fiduciary_impact: true

  type:
    metadata:
      concept: "Corporate knowledge type classification with governance levels"
      governance_rules: |
        Complete enterprise type system with regulatory and board-level types.
        Public disclosure and fiduciary responsibility considerations.
    nodes:
      - id: "board_resolution"
        label: "Board Resolution"
        parent: null
        level: 0
        governance:
          required_fields: ["resolution_text", "voting_record", "implementation_plan", "compliance"]
          applies_to_domains: ["corporate_strategy", "financial_risk_legal"]
          validation_authority: "board_of_directors"
          compliance_mandatory: true
          public_disclosure: true
          legally_binding: true

  authority:
    metadata:
      concept: "Corporate decision authority with fiduciary responsibilities"
      governance_rules: |
        Multi-level corporate authority structure with board oversight.
        Fiduciary responsibility and public company compliance.
      level_semantics: |
        Level 0-2 = Individual contributor to senior manager
        Level 3-4 = Director to VP (business unit authority)  
        Level 5 = SVP/President (business unit leadership)
        Level 6 = C-Level (corporate authority)
        Level 7 = Board (fiduciary authority)
    nodes:
      - id: "board_of_directors"
        label: "Board of Directors"
        parent: "ceo"
        level: 7
        governance:
          knowledge_creation: ["board_standard", "board_resolution"]
          scope_authority: ["corporation"]
          fiduciary_authority: true
          governance_authority: true
          shareholder_representation: true

  geographic_compliance:
    metadata:
      concept: "Geographic and regulatory compliance requirements"
      governance_rules: |
        Multi-jurisdictional compliance requirements for global operations.
        Regional regulatory framework compliance.
    nodes:
      - id: "north_america"
        label: "North America Compliance"
        governance:
          regulatory_frameworks: ["SOX", "CCPA", "PIPEDA", "SEC_REGULATIONS"]
          data_residency: "north_america"
          audit_requirements: "annual_sox_compliance"
          
      - id: "emea"
        label: "EMEA Compliance" 
        governance:
          regulatory_frameworks: ["GDPR", "UK_DATA_PROTECTION_ACT", "MiFID_II", "PSD2"]
          data_residency: "european_union"
          audit_requirements: "annual_gdpr_compliance"

governance:
  version_control:
    change_approval_required: true
    change_authority: "global_change_control_board"
    impact_analysis_required: true
    stakeholder_notification: "automatic_global"
    regulatory_impact_assessment: true
    
  audit_trail:
    track_changes: true
    retention_period_days: 2920  # 8 years for public company
    validation_frequency_days: 30
    compliance_reporting: "monthly"
    external_audit_access: true
    
  conflict_resolution:
    escalation_path: ["manager", "director", "vp", "svp", "c_level", "ceo", "board"]
    resolution_timeout_days: 21
    external_mediation_available: true
    binding_arbitration: true
    
  compliance_management:
    regulatory_frameworks: ["SOX", "GDPR", "SEC", "COSO", "ISO27001", "ISO31000"]
    audit_frequency: "continuous"
    compliance_officer_required: true
    board_reporting_required: true
    public_disclosure_requirements: true

named_arbitration_policies:
  "moc:arbitration:corporate_governance":
    description: "Board-oversight corporate governance-focused arbitration"
    precedence_order:
      - "P1_authority_weight"     # Corporate hierarchy critical
      - "P3_maturity_level"       # Board/regulatory standards first
      - "P7_regulatory_compliance" # Custom: Regulatory override
      - "P2_scope_specificity"    # Corporate vs BU scope
      - "P5_evidence_density"     # Evidence-based decisions
      - "P4_temporal_recency"
      - "P6_deterministic_fallback"
    minimum_authority_required: "director"
    regulatory_override: true
    board_escalation_required: "fiduciary_impact"
```


---

## 🛠️ Implementation Guidelines by Template

### Template Selection Decision Matrix

| Characteristic              | Startup  | Scale-up    | Enterprise      | Corporation      |
|-----------------------------|----------|-------------|-----------------|------------------|
| **Employee Count**          | 5-50     | 50-200      | 200-1000        | 1000+            |
| **Hierarchy Levels**        | 2 levels | 3 levels    | 4 levels        | 5+ levels        |
| **Decision Speed**          | Hours    | Days        | Weeks           | Months           |
| **Compliance Complexity**   | Basic    | Moderate    | High            | Regulatory       |
| **Geographic Scope**        | Local    | Regional    | National        | Global           |
| **Regulatory Requirements** | Minimal  | Sectoral    | Multi-sectoral  | Public Company   |
| **Change Tolerance**        | High     | Medium      | Low             | Very Low         |
| **Formality Level**         | Informal | Semi-formal | Formal          | Highly Formal    |

### Customization Guidelines

#### **For All Templates:**
1. **Replace placeholders** in brackets with real organizational values
2. **Adjust node IDs** to match your actual team/department names
3. **Modify authority levels** to reflect your organizational structure
4. **Add domain categories** specific to your sector
5. **Configure arbitration policies** based on your decision culture

#### **Common Customizations:**

**Sector-Specific Domains:**
- **Healthcare:** Add `clinical`, `research`, `regulatory_affairs`
- **Financial Services:** Add `trading`, `risk_management`, `regulatory_reporting`
- **Manufacturing:** Add `production`, `quality_assurance`, `supply_chain`
- **E-commerce:** Add `customer_experience`, `marketplace`, `logistics`

**Geographic Adaptations:**
- **European Companies:** Emphasize GDPR compliance nodes
- **Asian Companies:** Add regional regulatory frameworks
- **Multinationals:** Use corporation template with regional variants

**Technology-Specific:**
- **SaaS Companies:** Add `platform`, `infrastructure`, `customer_success`
- **AI/ML Companies:** Add `data_science`, `ai_ethics`, `model_governance`
- **Consulting:** Add `client_delivery`, `methodology`, `knowledge_management`

### Migration Path Between Templates

Organizations typically evolve through templates as they grow:

**Startup → Scale-up Migration:**
1. Add department-level scope nodes
2. Introduce `reviewed` maturity level
3. Add `security` domain
4. Implement formal authority hierarchy

**Scale-up → Enterprise Migration:**
1. Add division-level scope hierarchy
2. Introduce `approved` and `enterprise_standard` maturity
3. Add specialized domains (`security`, `data_analytics`)
4. Implement formal governance processes

**Enterprise → Corporation Migration:**
1. Add business unit scope level
2. Introduce `regulatory_standard` and `board_standard` maturity
3. Add compliance and geographic nodes
4. Implement board-level governance

---

## 📊 Template Comparison Summary

| Feature                    | Startup      | Scale-up       | Enterprise        | Corporation     |
|----------------------------|--------------|----------------|-------------------|----------------|
| **Hierarchies**            | 4 core       | 5 balanced     | 6 comprehensive   | 7+ advanced    |
| **Maturity Levels**        | 3 simple     | 4 moderate     | 5 rigorous        | 6 regulatory   |
| **Authority Levels**       | 3 flat       | 5 structured   | 6 hierarchical    | 8 corporate    |
| **Arbitration Policies**   | 1 speed      | 1 balanced     | 2 governance      | 3+ compliance  |
| **Compliance Focus**       | Basic        | Sectoral       | Multi-regulatory  | Global/Public  |
| **Implementation Time**    | 2-3 months   | 3-4 months     | 4-6 months        | 6-12 months    |
| **Maintenance Effort**     | Low          | Medium         | High              | Very High      |
| **Governance Overhead**    | Minimal      | Moderate       | Significant       | Extensive      |

These templates provide a solid foundation for Matrix Protocol implementation while maintaining flexibility to adapt to specific organizational needs and constraints.

---

**Next Steps:** Choose the template that best matches your current organizational size and complexity, then customize it based on your specific sector, geographic, and cultural requirements.

## 📖 Related Resources

### Matrix Protocol Frameworks
- [MEF - Matrix Embedding Framework](../../frameworks/mef) - Knowledge structuring via UKIs
- [ZOF - Zion Orchestration Framework](../../frameworks/zof) - Epistemological workflow orchestration
- [OIF - Operator Intelligence Framework](../../frameworks/oif) - AI archetypes for execution

### Documentation Related
- [Manual Implementation Guide](../../implementation) - Practical adoption guide
- [Practical Examples](../../examples/) - Real use cases
- [Organizational Templates](./index.md) - Templates by size

### Technical Resources
- [Validation Tools](../tools/) - Scripts and automations
- [Technical Specifications](../../implementation) - Implementation details
- [MOC Generation](../tools/moc-generation) - Ontology generation tools

---

> ✅ **MOC Templates by Organizational Size** - Ready-to-use Matrix Ontology Catalog templates adapted for different organization types, providing the foundation for systematic Matrix Protocol implementation with appropriate governance and complexity levels.