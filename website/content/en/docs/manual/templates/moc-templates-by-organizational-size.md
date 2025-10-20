---
title: MOC Templates by Size
description: Matrix Ontology Catalog templates adapted for organizations of different sizes, from startups to large enterprises
icon: i-heroicons-document-duplicate
layout: docs
sidebar: true
toc: true
navigation: true
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
| **Startup**   | Small            | 5-50      | Simple     | 4 core     | 2-3 months       |
| **Scale-up**  | Medium           | 50-200    | Moderate   | 5-6        | 3-4 months       |
| **Enterprise**| Large            | 200-1000  | Complex    | 6-7        | 4-6 months       |
| **Corporation**| Very Large      | 1000+     | Advanced   | 7+         | 6-12 months      |

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
          
      - id: "product-team"
        label: "Product Team"
        parent: "company"
        level: 1
        governance:
          visibility: ["product_team", "leadership"]
          propagation: "restricted"
          authority_required: "product_lead"
          
      - id: "engineering-team"
        label: "Engineering Team" 
        parent: "company"
        level: 1
        governance:
          visibility: ["engineering_team", "leadership"]
          propagation: "restricted"
          authority_required: "tech_lead"
          
      - id: "operations-team"
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
        Focus on actionable knowledge that drives business results.
    nodes:
      - id: "procedure"
        label: "Procedure"
        parent: null
        governance:
          required_fields: ["steps", "owner", "examples"]
          applies_to_domains: ["business", "technical", "culture"]
          template_enforcement: true
          
      - id: "decision"
        label: "Decision Record"
        parent: null
        governance:
          required_fields: ["context", "decision", "rationale", "consequences"]
          applies_to_domains: ["product", "technical", "business"]
          retention_period_days: 1095  # 3 years
          
      - id: "pattern"
        label: "Pattern or Best Practice"
        parent: null
        governance:
          required_fields: ["problem", "solution", "examples", "context"]
          applies_to_domains: ["technical", "product", "culture"]
          peer_review_required: true
          
      - id: "reference"
        label: "Reference Information"
        parent: null
        governance:
          required_fields: ["summary", "source", "relevance"]
          applies_to_domains: ["all"]
          update_frequency_days: 180

# Governance configuration optimized for startup agility
governance:
  change_control:
    approval_required: true
    approval_authority: "founder"
    impact_assessment_required: false  # Simplified for speed
    stakeholder_notification: ["leadership_team"]
    
  quality_standards:
    minimum_examples: 1
    peer_review_threshold: "validated"  # Only for validated and above
    compliance_checking: false  # Simplified compliance
    
  access_control:
    default_visibility: "company"  # Open by default for transparency
    security_classification: false  # No classification needed
    external_access: false
    
  conflict_resolution:
    escalation_path: ["team_lead", "founder"]
    arbitration_policy: "founder_final_decision"
    appeal_process: "direct_founder_appeal"
    
  audit_trail:
    retention_period_days: 1095  # 3 years
    detail_level: "summary"  # Simplified auditing
    compliance_reporting: false

# Evaluation criteria for ZOF EvaluateForEnrich
evaluation_criteria:
  business_impact:
    weight: 0.4
    threshold: "low"  # Low bar for knowledge capture
    evaluators: ["team_leads"]
    
  reusability:
    weight: 0.3
    threshold: "medium"
    evaluators: ["peers"]
    
  effort_vs_value:
    weight: 0.3
    threshold: "low"  # Prefer capturing over perfecting
    evaluators: ["knowledge_creator"]
```

### Implementation Guidelines for Startups

**Week 1-2: Foundation Setup**
- [ ] Customize template with actual team names and roles
- [ ] Define founder/leadership authorities
- [ ] Set up basic access controls
- [ ] Train core team on MOC usage

**Week 3-4: Initial Content**
- [ ] Create essential procedures (deployment, customer support)
- [ ] Document key decisions made to date
- [ ] Capture critical technical patterns
- [ ] Establish review processes

**Week 5-8: Adoption and Iteration**
- [ ] Encourage daily usage across teams
- [ ] Monitor adoption metrics
- [ ] Iterate based on user feedback
- [ ] Expand content gradually

**Success Metrics for Startups:**
- [ ] 80%+ of team creating UKIs within 1 month
- [ ] Key procedures documented and followed
- [ ] Decision rationale captured for major choices
- [ ] Knowledge accessible within 2 minutes average

---

## 📈 Scale-up Template (50-200 employees)

### Context
- **Stage:** Rapid growth, scaling teams and processes
- **Structure:** Department formation, specialized roles emerging
- **Priorities:** Process standardization, knowledge scaling, maintaining agility
- **Challenges:** Growing pains, knowledge distribution, maintaining culture

### MOC Configuration

```yaml

# MOC_TEMPLATE_SCALEUP.yaml
moc_version: "1.0"
organization: "[SCALEUP_NAME]"
created_date: "[YYYY-MM-DD]"
last_modified: "[YYYY-MM-DD]"
version: "1.0.0"

# Scale-up optimized: 5 hierarchies with departmental structure
hierarchies:
  scope:
    metadata:
      concept: "Organizational reach and knowledge boundaries"
      governance_rules: |
        Department-based model with cross-functional collaboration.
        Balance between team autonomy and organizational alignment.
      level_semantics: |
        Level 0 = Organization-wide (all employees)
        Level 1 = Department-wide (department + leadership)
        Level 2 = Team-specific (team + managers)
        Level 3 = Individual/private (personal workspace)
        Higher level = more restricted scope.
    nodes:
      - id: "organization"
        label: "Entire Organization"
        parent: null
        level: 0
        governance:
          visibility: ["all_employees", "contractors"]
          propagation: "automatic"
          authority_required: "executive_team"
          
      - id: "product-department"
        label: "Product Department"
        parent: "organization"
        level: 1
        governance:
          visibility: ["product_department", "executive_team", "department_heads"]
          propagation: "restricted"
          authority_required: "product_director"
          
      - id: "engineering-department"
        label: "Engineering Department"
        parent: "organization"
        level: 1
        governance:
          visibility: ["engineering_department", "executive_team", "department_heads"]
          propagation: "restricted"
          authority_required: "engineering_director"
          
      - id: "sales-marketing-department"
        label: "Sales & Marketing Department"
        parent: "organization"
        level: 1
        governance:
          visibility: ["sales_marketing_department", "executive_team", "department_heads"]
          propagation: "restricted"
          authority_required: "sales_marketing_director"
          
      - id: "operations-department"
        label: "Operations Department"
        parent: "organization"
        level: 1
        governance:
          visibility: ["operations_department", "executive_team", "department_heads"]
          propagation: "restricted"
          authority_required: "operations_director"
          
      - id: "frontend-team"
        label: "Frontend Team"
        parent: "engineering-department"
        level: 2
        governance:
          visibility: ["frontend_team", "engineering_department", "department_heads"]
          propagation: "restricted"
          authority_required: "frontend_lead"
          
      - id: "backend-team"
        label: "Backend Team"
        parent: "engineering-department"
        level: 2
        governance:
          visibility: ["backend_team", "engineering_department", "department_heads"]
          propagation: "restricted"
          authority_required: "backend_lead"
          
      - id: "devops-team"
        label: "DevOps Team"
        parent: "engineering-department"
        level: 2
        governance:
          visibility: ["devops_team", "engineering_department", "department_heads"]
          propagation: "restricted"
          authority_required: "devops_lead"

  domain:
    metadata:
      concept: "Knowledge domain specialization"
      governance_rules: |
        Specialized domains reflecting growing organizational complexity.
        Clear ownership with cross-domain collaboration.
    nodes:
      - id: "product-strategy"
        label: "Product Strategy"
        parent: null
        level: 0
        governance:
          owners: ["product_director", "product_managers"]
          reviewers: ["executive_team"]
          validation_required: true
          
      - id: "technical-architecture"
        label: "Technical Architecture"
        parent: null
        level: 0
        governance:
          owners: ["engineering_director", "principal_engineers"]
          reviewers: ["engineering_leads"]
          validation_required: true
          
      - id: "customer-operations"
        label: "Customer Operations"
        parent: null
        level: 0
        governance:
          owners: ["operations_director", "customer_success_leads"]
          reviewers: ["operations_team"]
          validation_required: true
          
      - id: "business-development"
        label: "Business Development"
        parent: null
        level: 0
        governance:
          owners: ["sales_marketing_director", "business_development_leads"]
          reviewers: ["sales_marketing_team"]
          validation_required: true
          
      - id: "organizational-culture"
        label: "Organizational Culture"
        parent: null
        level: 0
        governance:
          owners: ["ceo", "people_ops_lead"]
          reviewers: ["department_heads"]
          validation_required: false

  maturity:
    metadata:
      concept: "Knowledge validation and adoption levels"
      governance_rules: |
        4-level maturity supporting both innovation and standardization.
        Balanced validation process encouraging knowledge sharing.
      level_semantics: |
        Level 0 = Draft (work in progress, ideas)
        Level 1 = Reviewed (peer-reviewed, basic validation)
        Level 2 = Validated (team-approved, tested in practice)
        Level 3 = Standard (organization-adopted, mandatory compliance)
        Higher level = greater organizational adoption and compliance requirement.
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
          
      - id: "validated"
        label: "Team Validated"
        parent: "reviewed"
        level: 2
        governance:
          auto_promotion: false
          validation_required: true
          authority_required: "team_lead"
          reviewers_required: 2
          review_frequency_days: 90
          
      - id: "standard"
        label: "Organizational Standard"
        parent: "validated"
        level: 3
        governance:
          auto_promotion: false
          validation_required: true
          authority_required: "department_director"
          review_frequency_days: 180
          compliance_mandatory: true

  type:
    metadata:
      concept: "Structured knowledge types for scale-up operations"
      governance_rules: |
        Comprehensive knowledge types supporting operational scaling.
        Emphasis on reusable patterns and decision documentation.
    nodes:
      - id: "process"
        label: "Business Process"
        parent: null
        governance:
          required_fields: ["steps", "roles", "tools", "metrics", "examples"]
          applies_to_domains: ["customer-operations", "business-development"]
          sla_compliance_required: true
          
      - id: "technical-pattern"
        label: "Technical Pattern"
        parent: null
        governance:
          required_fields: ["problem", "solution", "implementation", "trade-offs", "examples"]
          applies_to_domains: ["technical-architecture"]
          code_review_required: true
          
      - id: "decision-record"
        label: "Decision Record"
        parent: null
        governance:
          required_fields: ["context", "options", "decision", "rationale", "consequences"]
          applies_to_domains: ["all"]
          retention_period_days: 1460  # 4 years
          stakeholder_notification_required: true
          
      - id: "best-practice"
        label: "Best Practice"
        parent: null
        governance:
          required_fields: ["practice", "context", "benefits", "implementation", "examples"]
          applies_to_domains: ["all"]
          peer_validation_required: true
          
      - id: "reference-guide"
        label: "Reference Guide"
        parent: null
        governance:
          required_fields: ["summary", "detailed_content", "examples", "related_resources"]
          applies_to_domains: ["all"]
          update_frequency_days: 90

  authority:
    metadata:
      concept: "Decision-making authority hierarchy"
      governance_rules: |
        Clear authority levels supporting both autonomy and governance.
        Escalation paths for complex decisions.
      level_semantics: |
        Level 0 = Individual contributor (personal work decisions)
        Level 1 = Team lead (team-scope decisions)
        Level 2 = Department director (department-scope decisions)
        Level 3 = Executive (organization-scope decisions)
        Higher level = broader decision-making authority.
    nodes:
      - id: "contributor"
        label: "Individual Contributor"
        parent: null
        level: 0
        governance:
          decision_scope: ["personal_work", "task_execution"]
          escalation_required: ["cross_team_impact", "resource_requests"]
          
      - id: "team_lead"
        label: "Team Lead"
        parent: "contributor"
        level: 1
        governance:
          decision_scope: ["team_processes", "resource_allocation", "hiring_decisions"]
          escalation_required: ["budget_impact", "policy_changes"]
          
      - id: "department_director"
        label: "Department Director"
        parent: "team_lead"
        level: 2
        governance:
          decision_scope: ["department_strategy", "budget_allocation", "cross_department_initiatives"]
          escalation_required: ["strategic_changes", "major_investments"]
          
      - id: "executive"
        label: "Executive Team"
        parent: "department_director"
        level: 3
        governance:
          decision_scope: ["organizational_strategy", "major_investments", "policy_creation"]
          escalation_required: ["board_level_decisions"]

# Enhanced governance for scale-up complexity
governance:
  change_control:
    approval_required: true
    approval_authority_by_impact:
      low: "team_lead"
      medium: "department_director"
      high: "executive_team"
    impact_assessment_required: true
    stakeholder_notification_required: true
    
  quality_standards:
    minimum_examples: 2
    peer_review_required: true
    compliance_checking: true
    style_guide_enforcement: true
    
  access_control:
    default_visibility: "department"
    security_classification: true
    external_access_controls: true
    audit_logging: true
    
  conflict_resolution:
    escalation_path: ["team_lead", "department_director", "executive_team"]
    arbitration_policy: "moc:arbitration:department_conflicts"
    sla_resolution_hours: 48
    
  audit_trail:
    retention_period_days: 2555  # 7 years for compliance
    detail_level: "comprehensive"
    compliance_reporting: true
    regulatory_alignment: ["sox", "gdpr"]  # Example compliance frameworks

# Sophisticated evaluation criteria for growing organization
evaluation_criteria:
  organizational_impact:
    weight: 0.3
    threshold: "medium"
    evaluators: ["department_directors"]
    
  reusability_potential:
    weight: 0.25
    threshold: "medium"
    evaluators: ["domain_experts"]
    
  quality_standards:
    weight: 0.25
    threshold: "high"
    evaluators: ["peer_reviewers"]
    
  strategic_alignment:
    weight: 0.2
    threshold: "medium"
    evaluators: ["executive_team"]
```

### Implementation Guidelines for Scale-ups

**Month 1: Foundation and Department Setup**
- [ ] Customize template for actual department structure
- [ ] Define department director authorities
- [ ] Establish cross-department collaboration rules
- [ ] Set up review and approval processes

**Month 2: Process Documentation**
- [ ] Document key business processes per department
- [ ] Capture technical patterns and standards
- [ ] Create decision record templates
- [ ] Establish quality standards

**Month 3: Adoption and Optimization**
- [ ] Roll out department by department
- [ ] Monitor cross-department knowledge sharing
- [ ] Optimize based on usage patterns
- [ ] Establish regular review cycles

**Success Metrics for Scale-ups:**
- [ ] 90%+ departments actively using MOC
- [ ] Cross-department knowledge sharing metrics
- [ ] Process standardization compliance >80%
- [ ] Decision traceability for major choices

---

## 🏢 Enterprise Template (200-1000 employees)

### Context
- **Stage:** Established organization, multiple business units
- **Structure:** Complex hierarchy, specialized functions, matrix organizations
- **Priorities:** Governance, compliance, knowledge reuse, innovation
- **Challenges:** Silos, complexity, regulatory requirements, scale

### MOC Configuration

```yaml

# MOC_TEMPLATE_ENTERPRISE.yaml
moc_version: "1.0"
organization: "[ENTERPRISE_NAME]"
created_date: "[YYYY-MM-DD]"
last_modified: "[YYYY-MM-DD]"
version: "1.0.0"

# Enterprise-optimized: 6 hierarchies with business unit structure
hierarchies:
  scope:
    metadata:
      concept: "Business unit and functional knowledge boundaries"
      governance_rules: |
        Business unit model with shared services and corporate functions.
        Matrix organization support with clear knowledge ownership.
      level_semantics: |
        Level 0 = Corporate (entire enterprise)
        Level 1 = Business unit (major business divisions)
        Level 2 = Function (departments within business units)
        Level 3 = Team (operational teams)
        Level 4 = Individual (personal workspace)
        Higher level = more specific organizational scope.
    nodes:
      - id: "corporate"
        label: "Corporate"
        parent: null
        level: 0
        governance:
          visibility: ["all_employees", "board_members"]
          propagation: "automatic"
          authority_required: "executive_committee"
          
      - id: "business-unit-products"
        label: "Products Business Unit"
        parent: "corporate"
        level: 1
        governance:
          visibility: ["products_bu", "corporate_executives", "shared_services"]
          propagation: "selective"
          authority_required: "products_bu_head"
          
      - id: "business-unit-services"
        label: "Services Business Unit"
        parent: "corporate"
        level: 1
        governance:
          visibility: ["services_bu", "corporate_executives", "shared_services"]
          propagation: "selective"
          authority_required: "services_bu_head"
          
      - id: "shared-services-it"
        label: "IT Shared Services"
        parent: "corporate"
        level: 1
        governance:
          visibility: ["all_employees"]  # IT supports everyone
          propagation: "automatic"
          authority_required: "cio"
          
      - id: "shared-services-hr"
        label: "HR Shared Services"
        parent: "corporate"
        level: 1
        governance:
          visibility: ["hr_team", "managers", "executives"]
          propagation: "restricted"
          authority_required: "chro"
          
      - id: "shared-services-finance"
        label: "Finance Shared Services"
        parent: "corporate"
        level: 1
        governance:
          visibility: ["finance_team", "budget_holders", "executives"]
          propagation: "restricted"
          authority_required: "cfo"
          
      - id: "products-engineering"
        label: "Products Engineering"
        parent: "business-unit-products"
        level: 2
        governance:
          visibility: ["products_engineering", "products_bu", "it_shared_services"]
          propagation: "restricted"
          authority_required: "products_engineering_director"

  domain:
    metadata:
      concept: "Enterprise knowledge domain specialization"
      governance_rules: |
        Comprehensive domain coverage for enterprise complexity.
        Clear domain ownership with mandatory cross-domain coordination.
    nodes:
      - id: "technology-architecture"
        label: "Technology Architecture"
        parent: null
        level: 0
        governance:
          owners: ["enterprise_architects", "cio"]
          reviewers: ["architecture_review_board"]
          validation_required: true
          compliance_frameworks: ["cobit", "togaf"]
          
      - id: "business-strategy"
        label: "Business Strategy"
        parent: null
        level: 0
        governance:
          owners: ["strategy_team", "ceo"]
          reviewers: ["executive_committee"]
          validation_required: true
          board_reporting_required: true
          
      - id: "regulatory-compliance"
        label: "Regulatory Compliance"
        parent: null
        level: 0
        governance:
          owners: ["compliance_team", "legal_counsel"]
          reviewers: ["compliance_committee"]
          validation_required: true
          external_audit_required: true
          
      - id: "operational-excellence"
        label: "Operational Excellence"
        parent: null
        level: 0
        governance:
          owners: ["operations_directors", "process_excellence_team"]
          reviewers: ["operations_committee"]
          validation_required: true
          
      - id: "innovation-research"
        label: "Innovation and Research"
        parent: null
        level: 0
        governance:
          owners: ["innovation_team", "r_and_d_heads"]
          reviewers: ["innovation_committee"]
          validation_required: false  # Encourage experimentation
          
      - id: "customer-experience"
        label: "Customer Experience"
        parent: null
        level: 0
        governance:
          owners: ["customer_experience_team", "business_unit_heads"]
          reviewers: ["customer_advisory_board"]
          validation_required: true

  maturity:
    metadata:
      concept: "Enterprise knowledge maturity and governance levels"
      governance_rules: |
        5-level maturity supporting innovation while ensuring governance.
        Rigorous validation for regulatory and operational knowledge.
      level_semantics: |
        Level 0 = Experimental (R&D, innovation projects)
        Level 1 = Draft (work in progress, team collaboration)
        Level 2 = Reviewed (peer-validated, quality assured)
        Level 3 = Approved (management-approved, operational use)
        Level 4 = Standard (enterprise-mandated, compliance required)
        Higher level = greater organizational commitment and compliance requirement.
    nodes:
      - id: "experimental"
        label: "Experimental"
        parent: null
        level: 0
        governance:
          auto_promotion: false
          validation_required: false
          creation_authority: "any_employee"
          review_frequency_days: 90
          innovation_tracking: true
          
      - id: "draft"
        label: "Draft"
        parent: "experimental"
        level: 1
        governance:
          auto_promotion: false
          validation_required: false
          creation_authority: "team_members"
          review_frequency_days: 60
          
      - id: "reviewed"
        label: "Peer Reviewed"
        parent: "draft"
        level: 2
        governance:
          auto_promotion: false
          validation_required: true
          authority_required: "domain_expert"
          reviewers_required: 2
          review_frequency_days: 90
          
      - id: "approved"
        label: "Management Approved"
        parent: "reviewed"
        level: 3
        governance:
          auto_promotion: false
          validation_required: true
          authority_required: "functional_director"
          reviewers_required: 3
          review_frequency_days: 180
          business_impact_assessment_required: true
          
      - id: "standard"
        label: "Enterprise Standard"
        parent: "approved"
        level: 4
        governance:
          auto_promotion: false
          validation_required: true
          authority_required: "executive_committee"
          review_frequency_days: 365
          compliance_mandatory: true
          audit_trail_required: true

  type:
    metadata:
      concept: "Enterprise knowledge structure types"
      governance_rules: |
        Comprehensive knowledge types for enterprise operations.
        Regulatory compliance and audit requirements embedded.
    nodes:
      - id: "policy"
        label: "Corporate Policy"
        parent: null
        governance:
          required_fields: ["purpose", "scope", "policy_statements", "procedures", "compliance_requirements"]
          applies_to_domains: ["regulatory-compliance", "business-strategy"]
          legal_review_required: true
          board_approval_required: true
          
      - id: "standard"
        label: "Technical Standard"
        parent: null
        governance:
          required_fields: ["standard_definition", "implementation_guidelines", "compliance_criteria", "exceptions"]
          applies_to_domains: ["technology-architecture", "operational-excellence"]
          architecture_review_required: true
          
      - id: "procedure"
        label: "Business Procedure"
        parent: null
        governance:
          required_fields: ["purpose", "scope", "steps", "roles", "controls", "metrics"]
          applies_to_domains: ["operational-excellence", "regulatory-compliance"]
          process_owner_required: true
          sla_definition_required: true
          
      - id: "guideline"
        label: "Guideline"
        parent: null
        governance:
          required_fields: ["guidance", "rationale", "applicability", "examples"]
          applies_to_domains: ["all"]
          expert_review_required: true
          
      - id: "decision-record"
        label: "Decision Record"
        parent: null
        governance:
          required_fields: ["context", "stakeholders", "options", "decision", "rationale", "implementation_plan"]
          applies_to_domains: ["all"]
          retention_period_days: 2555  # 7 years
          stakeholder_notification_required: true
          
      - id: "best-practice"
        label: "Best Practice"
        parent: null
        governance:
          required_fields: ["practice", "context", "benefits", "implementation", "metrics", "case_studies"]
          applies_to_domains: ["all"]
          benchmarking_data_required: true

  authority:
    metadata:
      concept: "Enterprise decision-making authority hierarchy"
      governance_rules: |
        Comprehensive authority model supporting matrix organization.
        Clear escalation paths and decision rights.
      level_semantics: |
        Level 0 = Individual contributor
        Level 1 = Team lead / supervisor
        Level 2 = Manager / functional lead
        Level 3 = Director / senior manager
        Level 4 = Vice president / business unit head
        Level 5 = Executive committee / C-level
        Level 6 = Board of directors
        Higher level = broader organizational authority and accountability.
    nodes:
      - id: "individual"
        label: "Individual Contributor"
        parent: null
        level: 0
        governance:
          decision_scope: ["personal_work", "task_execution", "skill_development"]
          budget_authority: 1000  # USD
          
      - id: "supervisor"
        label: "Team Lead / Supervisor"
        parent: "individual"
        level: 1
        governance:
          decision_scope: ["team_operations", "work_assignment", "performance_feedback"]
          budget_authority: 10000
          
      - id: "manager"
        label: "Manager"
        parent: "supervisor"
        level: 2
        governance:
          decision_scope: ["departmental_processes", "hiring_decisions", "budget_allocation"]
          budget_authority: 50000
          
      - id: "director"
        label: "Director"
        parent: "manager"
        level: 3
        governance:
          decision_scope: ["functional_strategy", "cross_functional_initiatives", "major_investments"]
          budget_authority: 250000
          
      - id: "vice_president"
        label: "Vice President"
        parent: "director"
        level: 4
        governance:
          decision_scope: ["business_unit_strategy", "major_partnerships", "organizational_changes"]
          budget_authority: 1000000
          
      - id: "executive"
        label: "Executive Committee"
        parent: "vice_president"
        level: 5
        governance:
          decision_scope: ["corporate_strategy", "major_acquisitions", "enterprise_policies"]
          budget_authority: 10000000
          
      - id: "board"
        label: "Board of Directors"
        parent: "executive"
        level: 6
        governance:
          decision_scope: ["governance_oversight", "ceo_selection", "major_strategic_decisions"]
          fiduciary_responsibility: true

  classification:
    metadata:
      concept: "Information security and access classification"
      governance_rules: |
        Security classification system for enterprise information protection.
        Regulatory compliance and data protection requirements.
      level_semantics: |
        Level 0 = Public (external sharing allowed)
        Level 1 = Internal (employee access only)
        Level 2 = Confidential (role-based access required)
        Level 3 = Restricted (explicit authorization required)
        Level 4 = Highly restricted (executive authorization required)
        Higher level = stricter access controls and protection requirements.
    nodes:
      - id: "public"
        label: "Public"
        parent: null
        level: 0
        governance:
          external_sharing_allowed: true
          protection_requirements: "basic"
          
      - id: "internal"
        label: "Internal Use"
        parent: "public"
        level: 1
        governance:
          employee_access_only: true
          protection_requirements: "standard"
          
      - id: "confidential"
        label: "Confidential"
        parent: "internal"
        level: 2
        governance:
          role_based_access: true
          protection_requirements: "enhanced"
          
      - id: "restricted"
        label: "Restricted"
        parent: "confidential"
        level: 3
        governance:
          explicit_authorization_required: true
          protection_requirements: "high"
          audit_logging_required: true
          
      - id: "highly_restricted"
        label: "Highly Restricted"
        parent: "restricted"
        level: 4
        governance:
          executive_authorization_required: true
          protection_requirements: "maximum"
          special_handling_required: true

# Enterprise-grade governance
governance:
  change_control:
    approval_required: true
    approval_matrix:
      low_impact: "manager"
      medium_impact: "director"
      high_impact: "vice_president"
      enterprise_impact: "executive_committee"
    impact_assessment_mandatory: true
    regulatory_impact_assessment_required: true
    stakeholder_analysis_required: true
    
  quality_standards:
    minimum_examples: 3
    peer_review_mandatory: true
    expert_validation_required: true
    compliance_checking_automated: true
    style_guide_enforcement: true
    accessibility_compliance: true
    
  access_control:
    default_visibility: "internal"
    security_classification_mandatory: true
    data_residency_controls: true
    external_access_approval_required: true
    audit_logging_comprehensive: true
    
  compliance_management:
    regulatory_frameworks: ["sox", "gdpr", "hipaa", "pci_dss"]
    audit_trail_immutable: true
    retention_policies_enforced: true
    data_protection_impact_assessments: true
    
  conflict_resolution:
    escalation_matrix:
      team_level: "manager"
      functional_level: "director"
      business_unit_level: "vice_president"
      enterprise_level: "executive_committee"
    arbitration_policy: "moc:arbitration:enterprise_governance"
    sla_resolution_hours: 72
    ombudsman_process: true
    
  audit_trail:
    retention_period_days: 2555  # 7 years minimum
    detail_level: "forensic"
    compliance_reporting_automated: true
    external_audit_readiness: true

# Sophisticated evaluation criteria for enterprise complexity
evaluation_criteria:
  strategic_alignment:
    weight: 0.25
    threshold: "high"
    evaluators: ["strategic_planning_team"]
    
  regulatory_compliance:
    weight: 0.2
    threshold: "mandatory"
    evaluators: ["compliance_team"]
    
  operational_impact:
    weight: 0.2
    threshold: "medium"
    evaluators: ["operations_directors"]
    
  reusability_across_business_units:
    weight: 0.15
    threshold: "medium"
    evaluators: ["domain_experts"]
    
  innovation_potential:
    weight: 0.1
    threshold: "low"  # Encourage innovation
    evaluators: ["innovation_team"]
    
  risk_mitigation:
    weight: 0.1
    threshold: "medium"
    evaluators: ["risk_management_team"]
```

### Implementation Guidelines for Enterprises

**Month 1-2: Governance Foundation**
- [ ] Establish enterprise governance committee
- [ ] Define regulatory compliance requirements
- [ ] Set up security classification system
- [ ] Create audit and compliance framework

**Month 3-4: Business Unit Rollout**
- [ ] Pilot with one business unit
- [ ] Establish cross-BU coordination mechanisms
- [ ] Implement shared services integration
- [ ] Create center of excellence

**Month 5-6: Enterprise Scale**
- [ ] Roll out to all business units
- [ ] Implement cross-enterprise knowledge sharing
- [ ] Establish performance measurement
- [ ] Optimize based on enterprise usage patterns

**Success Metrics for Enterprises:**
- [ ] 95%+ compliance with governance requirements
- [ ] Cross-business unit knowledge sharing metrics
- [ ] Regulatory audit readiness demonstrated
- [ ] Measurable operational efficiency improvements

---

## 🏛️ Corporation Template (1000+ employees)

### Context
- **Stage:** Large, complex, multi-national organization
- **Structure:** Multiple business lines, geographic regions, joint ventures
- **Priorities:** Global governance, regulatory compliance, innovation at scale
- **Challenges:** Extreme complexity, cultural diversity, regulatory fragmentation

### MOC Configuration

```yaml

# MOC_TEMPLATE_CORPORATION.yaml
moc_version: "1.0"
organization: "[CORPORATION_NAME]"
created_date: "[YYYY-MM-DD]"
last_modified: "[YYYY-MM-DD]"
version: "1.0.0"

# Corporation-optimized: 7+ hierarchies for maximum complexity
hierarchies:
  scope:
    metadata:
      concept: "Global organizational and geographic knowledge boundaries"
      governance_rules: |
        Multi-dimensional scope covering business lines, geographies, and functions.
        Matrix organization with complex reporting relationships.
      level_semantics: |
        Level 0 = Global corporate (entire corporation)
        Level 1 = Geographic region (major regional operations)
        Level 2 = Business line (major business divisions)
        Level 3 = Country/market (local market operations)
        Level 4 = Function (specialized functions within business lines)
        Level 5 = Team (operational units)
        Level 6 = Individual (personal workspace)
        Higher level = more specific organizational/geographic scope.
    nodes:
      - id: "global-corporate"
        label: "Global Corporate"
        parent: null
        level: 0
        governance:
          visibility: ["all_employees", "board_members", "external_auditors"]
          propagation: "automatic"
          authority_required: "board_of_directors"
          
      - id: "region-americas"
        label: "Americas Region"
        parent: "global-corporate"
        level: 1
        governance:
          visibility: ["americas_employees", "global_executives", "regional_boards"]
          propagation: "selective"
          authority_required: "americas_regional_president"
          
      - id: "region-emea"
        label: "EMEA Region"
        parent: "global-corporate"
        level: 1
        governance:
          visibility: ["emea_employees", "global_executives", "regional_boards"]
          propagation: "selective"
          authority_required: "emea_regional_president"
          
      - id: "region-apac"
        label: "APAC Region"
        parent: "global-corporate"
        level: 1
        governance:
          visibility: ["apac_employees", "global_executives", "regional_boards"]
          propagation: "selective"
          authority_required: "apac_regional_president"
          
      - id: "business-line-financial-services"
        label: "Financial Services Business Line"
        parent: "global-corporate"
        level: 2
        governance:
          visibility: ["financial_services_global", "global_executives"]
          propagation: "cross_regional"
          authority_required: "financial_services_global_head"
          regulatory_oversight: ["sec", "basel_committee"]
          
      - id: "business-line-technology"
        label: "Technology Business Line"
        parent: "global-corporate"
        level: 2
        governance:
          visibility: ["technology_global", "global_executives"]
          propagation: "cross_regional"
          authority_required: "technology_global_head"
          
      - id: "country-usa"
        label: "United States"
        parent: "region-americas"
        level: 3
        governance:
          visibility: ["usa_employees", "americas_leadership", "global_compliance"]
          propagation: "restricted"
          authority_required: "usa_country_manager"
          regulatory_framework: ["sox", "cfpb", "sec"]
          
      - id: "country-uk"
        label: "United Kingdom"
        parent: "region-emea"
        level: 3
        governance:
          visibility: ["uk_employees", "emea_leadership", "global_compliance"]
          propagation: "restricted"
          authority_required: "uk_country_manager"
          regulatory_framework: ["gdpr", "fca", "pra"]

  domain:
    metadata:
      concept: "Global knowledge domain specialization"
      governance_rules: |
        Comprehensive domain coverage for multinational corporation.
        Regulatory and cultural localization requirements.
    nodes:
      - id: "global-strategy"
        label: "Global Strategy"
        parent: null
        level: 0
        governance:
          owners: ["global_strategy_team", "ceo"]
          reviewers: ["board_strategy_committee"]
          validation_required: true
          board_reporting_required: true
          
      - id: "technology-architecture-global"
        label: "Global Technology Architecture"
        parent: null
        level: 0
        governance:
          owners: ["global_enterprise_architects", "global_cio"]
          reviewers: ["global_technology_committee"]
          validation_required: true
          cross_regional_coordination_required: true
          
      - id: "regulatory-compliance-global"
        label: "Global Regulatory Compliance"
        parent: null
        level: 0
        governance:
          owners: ["global_compliance_team", "chief_compliance_officer"]
          reviewers: ["compliance_committee", "external_counsel"]
          validation_required: true
          regulatory_reporting_required: true
          multi_jurisdiction_coordination: true
          
      - id: "financial-management"
        label: "Financial Management"
        parent: null
        level: 0
        governance:
          owners: ["global_finance_team", "cfo"]
          reviewers: ["audit_committee", "external_auditors"]
          validation_required: true
          financial_controls_required: true
          
      - id: "risk-management"
        label: "Enterprise Risk Management"
        parent: null
        level: 0
        governance:
          owners: ["global_risk_team", "chief_risk_officer"]
          reviewers: ["risk_committee", "board_risk_committee"]
          validation_required: true
          stress_testing_required: true
          
      - id: "innovation-research-global"
        label: "Global Innovation and Research"
        parent: null
        level: 0
        governance:
          owners: ["global_innovation_team", "chief_innovation_officer"]
          reviewers: ["innovation_steering_committee"]
          validation_required: false
          intellectual_property_protection: true

  maturity:
    metadata:
      concept: "Global knowledge maturity with regulatory compliance"
      governance_rules: |
        6-level maturity supporting global governance and local adaptation.
        Regulatory validation and multi-jurisdictional compliance.
      level_semantics: |
        Level 0 = Research (R&D, early innovation)
        Level 1 = Experimental (pilot projects, local testing)
        Level 2 = Draft (development, regional collaboration)
        Level 3 = Validated (expert-approved, regional adoption)
        Level 4 = Standard (corporate-mandated, global compliance)
        Level 5 = Regulatory (externally mandated, legal compliance)
        Higher level = greater global commitment and regulatory compliance.
    nodes:
      - id: "research"
        label: "Research"
        parent: null
        level: 0
        governance:
          creation_authority: "researchers"
          intellectual_property_protection: true
          publication_controls: true
          
      - id: "experimental"
        label: "Experimental"
        parent: "research"
        level: 1
        governance:
          pilot_approval_required: true
          risk_assessment_required: true
          local_regulatory_check: true
          
      - id: "draft"
        label: "Draft"
        parent: "experimental"
        level: 2
        governance:
          cross_regional_review: true
          cultural_adaptation_assessment: true
          
      - id: "validated"
        label: "Validated"
        parent: "draft"
        level: 3
        governance:
          expert_committee_approval: true
          regional_implementation_ready: true
          
      - id: "standard"
        label: "Corporate Standard"
        parent: "validated"
        level: 4
        governance:
          global_executive_approval: true
          mandatory_global_compliance: true
          implementation_timeline_defined: true
          
      - id: "regulatory"
        label: "Regulatory Mandate"
        parent: "standard"
        level: 5
        governance:
          external_regulatory_requirement: true
          legal_compliance_mandatory: true
          audit_trail_immutable: true

  type:
    metadata:
      concept: "Corporate knowledge structure types with regulatory compliance"
      governance_rules: |
        Comprehensive knowledge types for multinational corporation.
        Regulatory compliance and cross-jurisdictional requirements.
    nodes:
      - id: "global-policy"
        label: "Global Corporate Policy"
        parent: null
        governance:
          required_fields: ["global_scope", "local_adaptations", "compliance_matrix", "implementation_timeline"]
          board_approval_required: true
          legal_review_mandatory: true
          cultural_impact_assessment: true
          
      - id: "regional-standard"
        label: "Regional Standard"
        parent: null
        governance:
          required_fields: ["regional_scope", "local_variations", "global_alignment", "implementation_plan"]
          regional_president_approval: true
          cross_regional_coordination: true
          
      - id: "compliance-framework"
        label: "Compliance Framework"
        parent: null
        governance:
          required_fields: ["regulatory_requirements", "implementation_procedures", "monitoring_controls", "reporting_obligations"]
          chief_compliance_officer_approval: true
          external_legal_review: true
          regulatory_filing_required: true

  authority:
    metadata:
      concept: "Global corporate authority hierarchy"
      governance_rules: |
        Comprehensive authority model for multinational corporation.
        Board oversight and fiduciary responsibilities.
      level_semantics: |
        Level 0-3 = Operational levels (individual to director)
        Level 4-5 = Executive levels (VP to C-level)
        Level 6 = Board level (fiduciary oversight)
        Level 7 = Regulatory level (external authority)
        Higher level = broader authority with greater accountability.
    nodes:
      - id: "board_of_directors"
        label: "Board of Directors"
        parent: null
        level: 6
        governance:
          fiduciary_responsibility: true
          shareholder_accountability: true
          regulatory_oversight_responsibility: true
          
      - id: "global_executive_committee"
        label: "Global Executive Committee"
        parent: "board_of_directors"
        level: 5
        governance:
          global_strategy_authority: true
          major_capital_allocation: true
          regulatory_compliance_accountability: true

  classification:
    metadata:
      concept: "Global information security and regulatory classification"
      governance_rules: |
        Comprehensive classification for multinational regulatory compliance.
        Data sovereignty and cross-border transfer controls.
    nodes:
      - id: "public_disclosure"
        label: "Public Disclosure"
        parent: null
        level: 0
        governance:
          sec_filing_ready: true
          investor_communication_approved: true
          
      - id: "material_non_public"
        label: "Material Non-Public Information"
        parent: null
        level: 4
        governance:
          insider_trading_controls: true
          disclosure_committee_oversight: true
          trading_blackout_enforcement: true

  geographic:
    metadata:
      concept: "Geographic and regulatory jurisdiction hierarchy"
      governance_rules: |
        Geographic classification for regulatory compliance and data sovereignty.
        Cross-border data transfer and local law compliance.
      level_semantics: |
        Level 0 = Global (no geographic restrictions)
        Level 1 = Regional (major geographic regions)
        Level 2 = Country (national boundaries)
        Level 3 = State/province (sub-national jurisdictions)
        Level 4 = Local (city/municipal level)
        Higher level = more specific geographic restrictions.
    nodes:
      - id: "global"
        label: "Global"
        parent: null
        level: 0
        governance:
          cross_border_transfer_allowed: true
          universal_access: true
          
      - id: "eu_jurisdiction"
        label: "European Union Jurisdiction"
        parent: "global"
        level: 2
        governance:
          gdpr_compliance_required: true
          data_residency_required: true
          right_to_be_forgotten: true

# Corporate-level governance with regulatory compliance
governance:
  regulatory_compliance:
    frameworks: ["sox", "gdpr", "basel_iii", "mifid_ii", "dodd_frank"]
    audit_requirements:
      internal_audit: "quarterly"
      external_audit: "annual"
      regulatory_examination: "as_required"
    
  board_oversight:
    reporting_requirements:
      board_reporting: "quarterly"
      committee_reporting: "monthly"
      regulatory_reporting: "as_mandated"
    
  global_coordination:
    cross_regional_committees:
      - "global_risk_committee"
      - "global_compliance_committee"
      - "global_technology_committee"
    
  data_governance:
    data_sovereignty_compliance: true
    cross_border_transfer_controls: true
    privacy_by_design_required: true

# Advanced evaluation criteria for corporation-level complexity
evaluation_criteria:
  regulatory_compliance_impact:
    weight: 0.3
    threshold: "mandatory"
    evaluators: ["global_compliance_team", "external_counsel"]
    
  global_strategic_alignment:
    weight: 0.25
    threshold: "high"
    evaluators: ["global_strategy_team", "board_strategy_committee"]
    
  cross_regional_applicability:
    weight: 0.2
    threshold: "medium"
    evaluators: ["regional_presidents"]
    
  financial_materiality:
    weight: 0.15
    threshold: "medium"
    evaluators: ["global_finance_team", "audit_committee"]
    
  risk_management_impact:
    weight: 0.1
    threshold: "medium"
    evaluators: ["global_risk_team", "board_risk_committee"]
```

### Implementation Guidelines for Corporations

**Months 1-3: Global Governance Foundation**
- [ ] Establish global governance council
- [ ] Define multi-jurisdictional compliance framework
- [ ] Set up cross-regional coordination mechanisms
- [ ] Create global audit and risk management framework

**Months 4-8: Regional Rollout**
- [ ] Pilot in one region with full complexity
- [ ] Implement cross-regional knowledge sharing
- [ ] Establish regulatory compliance monitoring
- [ ] Create centers of excellence per region

**Months 9-12: Global Integration**
- [ ] Roll out to all regions and business lines
- [ ] Implement global performance measurement
- [ ] Optimize cross-regional collaboration
- [ ] Prepare for regulatory examinations

**Success Metrics for Corporations:**
- [ ] 99%+ compliance with all regulatory requirements
- [ ] Global knowledge sharing metrics across all regions
- [ ] Successful regulatory examinations and audits
- [ ] Demonstrated competitive advantage from knowledge capabilities

---

## 🔄 Template Customization Guidelines

### Adaptation Process

1. **Organizational Assessment**
   - [ ] Evaluate current organizational structure
   - [ ] Identify regulatory requirements
   - [ ] Assess cultural and geographic factors
   - [ ] Determine complexity and scale needs

2. **Template Selection and Customization**
   - [ ] Choose base template matching organizational size
   - [ ] Customize hierarchies for actual structure
   - [ ] Adapt governance rules for regulatory environment
   - [ ] Modify evaluation criteria for business priorities

3. **Validation and Testing**
   - [ ] Test with real organizational scenarios
   - [ ] Validate with key stakeholders
   - [ ] Ensure regulatory compliance
   - [ ] Performance test at expected scale

4. **Implementation Planning**
   - [ ] Create phased rollout plan
   - [ ] Establish training and support programs
   - [ ] Define success metrics and monitoring
   - [ ] Plan for continuous improvement

### Success Factors

**For All Organization Sizes:**
- Executive sponsorship and commitment
- Clear communication of benefits and expectations
- Adequate training and support resources
- Regular monitoring and optimization
- Cultural alignment and change management

**Size-Specific Success Factors:**

**Startups:** Focus on simplicity, speed, and essential knowledge capture
**Scale-ups:** Balance process standardization with agility and growth
**Enterprises:** Emphasize governance, compliance, and cross-functional coordination
**Corporations:** Prioritize regulatory compliance, global coordination, and risk management

---

**Conclusion**: These MOC templates provide ready-to-use foundations for organizations of all sizes to implement the Matrix Protocol. Each template is specifically designed for the complexity, governance requirements, and operational characteristics of different organizational types. Success depends on careful customization to specific organizational needs and disciplined implementation following the detailed guidelines provided.