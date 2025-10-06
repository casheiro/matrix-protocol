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
| **Startup** | Small | 5-50 | Simple | 4 core | 2-3 months |
| **Scale-up** | Medium | 50-200 | Moderate | 5-6 | 3-4 months |
| **Enterprise** | Large | 200-1000 | Complex | 6-7 | 4-6 months |
| **Corporation** | Very Large | 1000+ | Advanced | 7+ | 6-12 months |

---

## 🚀 Startup Template (5-50 employees)

### Context
- **Stage:** Early growth, product-market fit focus
- **Structure:** Flat hierarchy, cross-functional teams
- **Priorities:** Speed, simplicity, essential knowledge capture
- **Challenges:** Limited resources, rapid change, knowledge in people's heads

### MOC Configuration

```yaml
# MOC_STARTUP_TEMPLATE.yaml
moc_version: "1.0"
organization: "[STARTUP_NAME]"
created_date: "[YYYY-MM-DD]"
last_modified: "[YYYY-MM-DD]"
version: "1.0.0"

# Startup-optimized: 4 essential hierarchies only
hierarchies:
  scope:
    metadata:
      concept: "Knowledge reach and team visibility"
      governance_rules: |
        Simple 2-level model: Individual → Team → Company
        Focus on knowledge sharing and preventing single points of failure.
      level_semantics: |
        Level 0 = Company-wide knowledge (everyone can access)
        Level 1 = Team-specific knowledge (team members + leadership)
        Level 2 = Individual knowledge (personal notes, drafts)
        Higher level = more specific scope.
    nodes:
      - id: "company"
        label: "Company-wide"
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
          
      - id: "ops-team"
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
        label: "Product & Strategy"
        parent: null
        level: 0
        governance:
          owners: ["product_lead", "founders"]
          reviewers: ["team_leads"]
          validation_required: false
          
      - id: "technical"
        label: "Technical & Engineering"
        parent: null
        level: 0
        governance:
          owners: ["tech_lead", "senior_devs"]
          reviewers: ["engineering_team"]
          validation_required: true
          
      - id: "business"
        label: "Business & Operations"
        parent: null
        level: 0
        governance:
          owners: ["founders", "ops_lead"]
          reviewers: ["leadership_team"]
          validation_required: false
          
      - id: "culture"
        label: "Team & Culture"
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
        Level 0 = Draft (working notes, ideas)
        Level 1 = Validated (team reviewed, tested)
        Level 2 = Standard (company adopted, documented)
        Higher level = higher validation and adoption.
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
          mandatory_compliance: true

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
          required_fields: ["examples", "rationale"]
          applies_to_domains: ["product", "technical", "business"]
          validation_authority: "team_leads"
          
      - id: "pattern"
        label: "Best Practice"
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
    change_approval_required: false  # Rapid iteration priority
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
    description: "Speed-optimized arbitration for startup environment"
    precedence_order:
      - "P4_temporal_recency"     # Latest wins in fast-moving environment
      - "P1_authority_weight"     # Then authority
      - "P3_maturity_level"       # Then validation
      - "P6_deterministic_fallback"
    temporal_window_ms: 60000     # 1-minute concurrency window
```

### Implementation Notes for Startups

**Strengths of This Template:**
- ✅ Simple structure minimizes complexity
- ✅ Fast conflict resolution (3-day timeout)
- ✅ Emphasis on speed over formal process
- ✅ Founder authority for major decisions
- ✅ Minimal governance overhead

**Adaptation Guidelines:**
- Adjust team names to match your structure
- Add domain categories specific to your industry
- Consider adding `security` domain if handling sensitive data
- Scale up scope hierarchy as you grow teams

---

## 📈 Scale-up Template (50-200 employees)

### Context
- **Stage:** Rapid growth, scaling operations
- **Structure:** Department formation, management layer emerging
- **Priorities:** Process standardization, knowledge scaling, quality control
- **Challenges:** Growing pains, process gaps, knowledge bottlenecks

### MOC Configuration

```yaml
# MOC_SCALEUP_TEMPLATE.yaml
moc_version: "1.0"
organization: "[SCALEUP_NAME]"
created_date: "[YYYY-MM-DD]"
last_modified: "[YYYY-MM-DD]"
version: "1.0.0"

# Scale-up optimized: 5 hierarchies with growth flexibility
hierarchies:
  scope:
    metadata:
      concept: "Knowledge reach across growing organization"
      governance_rules: |
        3-level model preparing for departmental structure: 
        Individual → Team → Department → Company
      level_semantics: |
        Level 0 = Company-wide (all employees)
        Level 1 = Department-specific (department + leadership)
        Level 2 = Team-specific (team members + management)
        Level 3 = Individual (personal workspace)
    nodes:
      - id: "company"
        label: "Company-wide"
        parent: null
        level: 0
        governance:
          visibility: ["all_employees", "contractors", "board"]
          propagation: "automatic"
          authority_required: "executive_team"
          
      # Department Level (emerging structure)
      - id: "product-department"
        label: "Product Department"
        parent: "company"
        level: 1
        governance:
          visibility: ["product_department", "executive_team"]
          propagation: "restricted"
          authority_required: "head_of_product"
          
      - id: "engineering-department" 
        label: "Engineering Department"
        parent: "company"
        level: 1
        governance:
          visibility: ["engineering_department", "executive_team"]
          propagation: "restricted"
          authority_required: "vp_engineering"
          
      - id: "operations-department"
        label: "Operations Department"
        parent: "company"
        level: 1
        governance:
          visibility: ["operations_department", "executive_team"]
          propagation: "restricted"
          authority_required: "head_of_operations"
          
      # Team Level (within departments)
      - id: "frontend-team"
        label: "Frontend Team"
        parent: "engineering-department"
        level: 2
        governance:
          visibility: ["frontend_team", "engineering_department"]
          propagation: "restricted"
          authority_required: "frontend_lead"
          
      - id: "backend-team"
        label: "Backend Team"
        parent: "engineering-department"
        level: 2
        governance:
          visibility: ["backend_team", "engineering_department"]
          propagation: "restricted"
          authority_required: "backend_lead"
          
      - id: "product-team"
        label: "Product Management Team"
        parent: "product-department"
        level: 2
        governance:
          visibility: ["product_team", "product_department"]
          propagation: "restricted"
          authority_required: "product_manager"
          
      - id: "design-team"
        label: "Design Team"
        parent: "product-department"
        level: 2
        governance:
          visibility: ["design_team", "product_department"]
          propagation: "restricted"
          authority_required: "design_lead"

  domain:
    metadata:
      concept: "Specialized knowledge domains"
      governance_rules: |
        Expanded domains reflecting departmental specialization.
        Clear ownership as organization grows.
    nodes:
      - id: "product"
        label: "Product & Strategy"
        parent: null
        level: 0
        governance:
          owners: ["product_managers", "head_of_product"]
          reviewers: ["executive_team", "design_team"]
          validation_required: true
          
      - id: "technical"
        label: "Technical & Architecture"
        parent: null
        level: 0
        governance:
          owners: ["senior_engineers", "vp_engineering", "architects"]
          reviewers: ["engineering_department", "tech_committee"]
          validation_required: true
          
      - id: "business"
        label: "Business & Operations"
        parent: null
        level: 0
        governance:
          owners: ["operations_team", "business_analysts"]
          reviewers: ["executive_team", "department_heads"]
          validation_required: true
          
      - id: "design"
        label: "User Experience & Design"
        parent: null
        level: 0
        governance:
          owners: ["designers", "design_lead"]
          reviewers: ["product_team", "user_research"]
          validation_required: false
          
      - id: "security"
        label: "Security & Compliance"
        parent: null
        level: 0
        governance:
          owners: ["security_lead", "devops_team"]
          reviewers: ["engineering_department", "compliance_team"]
          validation_required: true
          authority_weight: 1.3  # Higher precedence for security
          
      - id: "culture"
        label: "Culture & People"
        parent: null
        level: 0
        governance:
          owners: ["hr_team", "culture_champions"]
          reviewers: ["department_heads", "employee_council"]
          validation_required: false

  maturity:
    metadata:
      concept: "Knowledge maturation pipeline"
      governance_rules: |
        4-level maturity supporting quality scaling.
        Emphasis on peer review and validation.
      level_semantics: |
        Level 0 = Draft (individual work)
        Level 1 = Reviewed (peer validated)
        Level 2 = Approved (department standard)
        Level 3 = Company Standard (organization-wide)
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
          mandatory_compliance: true

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
          required_fields: ["examples", "enforcement", "exceptions"]
          applies_to_domains: ["business", "security", "culture"]
          validation_authority: "executive_team"
          mandatory_compliance: true
          
      - id: "standard"
        label: "Technical Standard"
        parent: null
        level: 0
        governance:
          required_fields: ["examples", "implementation"]
          applies_to_domains: ["technical", "security"]
          validation_authority: "tech_committee"
          
      - id: "pattern"
        label: "Best Practice Pattern"
        parent: null
        level: 0
        governance:
          required_fields: ["examples", "relationships"]
          applies_to_domains: ["technical", "product", "design"]
          validation_authority: "domain_experts"
          
      - id: "procedure"
        label: "Process/Procedure"
        parent: null
        level: 0
        governance:
          required_fields: ["examples", "steps", "owners"]
          applies_to_domains: ["business", "technical", "culture"]
          validation_authority: "process_owners"
          
      - id: "guideline"
        label: "Guideline"
        parent: null
        level: 0
        governance:
          required_fields: ["examples"]
          applies_to_domains: ["design", "culture", "product"]
          validation_authority: "department_leads"
          
      - id: "decision"
        label: "Decision Record"
        parent: null
        level: 0
        governance:
          required_fields: ["examples", "rationale", "alternatives"]
          applies_to_domains: ["technical", "product", "business"]
          validation_authority: "decision_makers"

  authority:
    metadata:
      concept: "Decision authority hierarchy"
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
      - "P3_maturity_level"       # Quality matters for scaling
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
# MOC_ENTERPRISE_TEMPLATE.yaml
moc_version: "1.0"
organization: "[ENTERPRISE_NAME]"
created_date: "[YYYY-MM-DD]"
last_modified: "[YYYY-MM-DD]"
version: "1.0.0"

# Enterprise-grade: 6 comprehensive hierarchies
hierarchies:
  scope:
    metadata:
      concept: "Enterprise knowledge governance and reach"
      governance_rules: |
        4-level enterprise model: Individual → Team → Division → Organization
        Clear boundaries and governance at each level.
      level_semantics: |
        Level 0 = Organization-wide (all employees globally)
        Level 1 = Division-specific (division + executives)
        Level 2 = Team/Department specific (team + division leadership)
        Level 3 = Individual/Project specific (limited access)
    nodes:
      - id: "organization"
        label: "Organization-wide"
        parent: null
        level: 0
        governance:
          visibility: ["all_employees", "contractors", "partners", "board"]
          propagation: "automatic"
          authority_required: "c_level"
          
      # Division Level
      - id: "technology-division"
        label: "Technology Division"
        parent: "organization"
        level: 1
        governance:
          visibility: ["technology_division", "c_level", "cross_division_roles"]
          propagation: "restricted"
          authority_required: "cto"
          
      - id: "product-division"
        label: "Product Division"
        parent: "organization"
        level: 1
        governance:
          visibility: ["product_division", "c_level", "cross_division_roles"]
          propagation: "restricted"
          authority_required: "cpo"
          
      - id: "operations-division"
        label: "Operations Division"
        parent: "organization"
        level: 1
        governance:
          visibility: ["operations_division", "c_level", "cross_division_roles"]
          propagation: "restricted"
          authority_required: "coo"
          
      - id: "sales-marketing-division"
        label: "Sales & Marketing Division"
        parent: "organization"
        level: 1
        governance:
          visibility: ["sales_marketing_division", "c_level"]
          propagation: "restricted"
          authority_required: "cmo"
          
      # Department Level (within divisions)
      - id: "engineering-department"
        label: "Engineering Department"
        parent: "technology-division"
        level: 2
        governance:
          visibility: ["engineering_department", "technology_division"]
          propagation: "restricted"
          authority_required: "vp_engineering"
          
      - id: "architecture-department"
        label: "Architecture Department"
        parent: "technology-division"
        level: 2
        governance:
          visibility: ["architecture_department", "technology_division", "engineering_department"]
          propagation: "restricted"
          authority_required: "chief_architect"
          
      - id: "security-department"
        label: "Security Department"
        parent: "technology-division"
        level: 2
        governance:
          visibility: ["security_department", "all_divisions"]  # Security spans all
          propagation: "automatic"  # Security knowledge should propagate
          authority_required: "ciso"
          
      # Team Level
      - id: "backend-platform-team"
        label: "Backend Platform Team"
        parent: "engineering-department"
        level: 3
        governance:
          visibility: ["backend_platform_team", "engineering_department"]
          propagation: "none"
          authority_required: "senior_engineering_manager"

  domain:
    metadata:
      concept: "Enterprise knowledge domains with specialized ownership"
      governance_rules: |
        Comprehensive domain coverage for enterprise operations.
        Clear ownership, review chains, and compliance requirements.
    nodes:
      - id: "business_strategy"
        label: "Business Strategy & Planning"
        parent: null
        level: 0
        governance:
          owners: ["c_level", "strategy_team", "business_analysts"]
          reviewers: ["board", "executive_committee", "division_heads"]
          validation_required: true
          
      - id: "technical_architecture"
        label: "Technical Architecture & Engineering"
        parent: null
        level: 0
        governance:
          owners: ["architects", "principal_engineers", "vp_engineering"]
          reviewers: ["architecture_committee", "technology_leaders"]
          validation_required: true
          
      - id: "security_compliance"
        label: "Security & Compliance"
        parent: null
        level: 0
        governance:
          owners: ["ciso", "security_architects", "compliance_officers"]
          reviewers: ["security_committee", "audit_team", "legal"]
          validation_required: true
          authority_weight: 1.5  # Higher precedence
          
      - id: "product_management"
        label: "Product Management & Strategy"
        parent: null
        level: 0
        governance:
          owners: ["product_managers", "cpo", "product_strategy"]
          reviewers: ["product_committee", "market_research", "ux_team"]
          validation_required: true
          
      - id: "operations"
        label: "Operations & Process"
        parent: null
        level: 0
        governance:
          owners: ["operations_managers", "process_owners", "coo"]
          reviewers: ["operations_committee", "quality_assurance"]
          validation_required: true
          
      - id: "data_analytics"
        label: "Data & Analytics"
        parent: null
        level: 0
        governance:
          owners: ["data_engineers", "data_scientists", "chief_data_officer"]
          reviewers: ["data_committee", "privacy_team", "analytics_team"]
          validation_required: true
          
      - id: "finance_legal"
        label: "Finance & Legal"
        parent: null
        level: 0
        governance:
          owners: ["cfo", "legal_team", "finance_managers"]
          reviewers: ["audit_committee", "external_auditors"]
          validation_required: true
          
      - id: "human_resources"
        label: "Human Resources & Culture"
        parent: null
        level: 0
        governance:
          owners: ["chro", "hr_managers", "culture_team"]
          reviewers: ["employee_council", "leadership_team"]
          validation_required: false

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
        Level 3 = Enterprise Standard (organization-wide)
        Level 4 = Regulatory Standard (compliance/audit required)
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
          
      - id: "reviewed"
        label: "Peer Reviewed"
        parent: "draft"
        level: 1
        governance:
          auto_promotion: false
          validation_required: true
          authority_required: "peer_reviewer"
          reviewers_required: 2
          review_frequency_days: 30
          
      - id: "approved"
        label: "Department Approved"
        parent: "reviewed"
        level: 2
        governance:
          auto_promotion: false
          validation_required: true
          authority_required: "department_manager"
          reviewers_required: 3
          evidence_required: ["implementation_proof", "stakeholder_approval"]
          review_frequency_days: 60
          
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
          mandatory_compliance: true
          
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
          mandatory_compliance: true
          immutable_after_approval: true

  type:
    metadata:
      concept: "Enterprise knowledge type classification"
      governance_rules: |
        Comprehensive type system supporting all enterprise functions.
        Clear validation and compliance requirements by type.
    nodes:
      - id: "corporate_policy"
        label: "Corporate Policy"
        parent: null
        level: 0
        governance:
          required_fields: ["examples", "enforcement", "exceptions", "compliance"]
          applies_to_domains: ["business_strategy", "security_compliance", "human_resources"]
          validation_authority: "c_level"
          mandatory_compliance: true
          legal_review_required: true
          
      - id: "technical_standard"
        label: "Technical Standard"
        parent: null
        level: 0
        governance:
          required_fields: ["examples", "implementation", "testing", "migration"]
          applies_to_domains: ["technical_architecture", "security_compliance"]
          validation_authority: "architecture_committee"
          
      - id: "operational_procedure"
        label: "Operational Procedure"
        parent: null
        level: 0
        governance:
          required_fields: ["examples", "steps", "owners", "escalation", "metrics"]
          applies_to_domains: ["operations", "security_compliance", "human_resources"]
          validation_authority: "operations_committee"
          
      - id: "architectural_decision"
        label: "Architectural Decision Record"
        parent: null
        level: 0
        governance:
          required_fields: ["examples", "rationale", "alternatives", "consequences", "migration"]
          applies_to_domains: ["technical_architecture", "business_strategy"]
          validation_authority: "architecture_committee"
          immutable_after_approval: true
          
      - id: "business_rule"
        label: "Business Rule"
        parent: null
        level: 0
        governance:
          required_fields: ["examples", "conditions", "exceptions", "compliance"]
          applies_to_domains: ["business_strategy", "product_management", "finance_legal"]
          validation_authority: "business_committee"
          
      - id: "security_control"
        label: "Security Control"
        parent: null
        level: 0
        governance:
          required_fields: ["examples", "implementation", "testing", "audit_trail"]
          applies_to_domains: ["security_compliance"]
          validation_authority: "ciso"
          mandatory_compliance: true
          audit_required: true

  authority:
    metadata:
      concept: "Enterprise decision authority hierarchy"
      governance_rules: |
        Multi-level authority structure with clear escalation paths.
        Role-based authority with matrix management support.
      level_semantics: |
        Level 0 = Individual contributor
        Level 1 = Team lead/Manager
        Level 2 = Senior manager/Director
        Level 3 = Division head/VP
        Level 4 = C-level executive
        Level 5 = Board level
    nodes:
      - id: "contributor"
        label: "Individual Contributor"
        parent: null
        level: 0
        governance:
          knowledge_creation: ["draft"]
          scope_authority: ["personal"]
          
      - id: "senior_contributor"
        label: "Senior Individual Contributor"
        parent: "contributor"
        level: 1
        governance:
          knowledge_creation: ["draft", "reviewed"]
          scope_authority: ["team_influence"]
          
      - id: "team_manager"
        label: "Team Manager"
        parent: "senior_contributor"
        level: 1
        governance:
          knowledge_creation: ["draft", "reviewed", "approved"]
          scope_authority: ["team", "department_influence"]
          
      - id: "senior_manager"
        label: "Senior Manager"
        parent: "team_manager"
        level: 2
        governance:
          knowledge_creation: ["draft", "reviewed", "approved"]
          scope_authority: ["department", "division_influence"]
          
      - id: "director"
        label: "Director"
        parent: "senior_manager"
        level: 2
        governance:
          knowledge_creation: ["draft", "reviewed", "approved", "enterprise_standard"]
          scope_authority: ["department", "division", "organization_influence"]
          
      - id: "vp"
        label: "Vice President"
        parent: "director"
        level: 3
        governance:
          knowledge_creation: ["all"]
          scope_authority: ["division", "organization"]
          policy_creation: true
          
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

  lifecycle:
    metadata:
      concept: "Enterprise knowledge lifecycle management"
      governance_rules: |
        Comprehensive lifecycle policies for different knowledge criticality.
        Regulatory compliance and audit requirements.
    nodes:
      - id: "active_standard"
        label: "Active Standard"
        governance:
          review_frequency_days: 90
          automatic_deprecation: false
          stakeholder_notification: true
          change_control_required: true
          
      - id: "active_guidance"
        label: "Active Guidance"  
        governance:
          review_frequency_days: 60
          automatic_deprecation: false
          stakeholder_notification: true
          
      - id: "regulatory_active"
        label: "Regulatory Active"
        governance:
          review_frequency_days: 365
          automatic_deprecation: false
          audit_required: true
          legal_review_required: true
          
      - id: "deprecated"
        label: "Deprecated"
        governance:
          sunset_warning_days: 180
          migration_plan_required: true
          alternative_required: true
          stakeholder_communication: true
          
      - id: "archived"
        label: "Archived"
        governance:
          retention_period_days: 2555  # 7 years for compliance
          readonly_access: true
          audit_trail_preserved: true
          legal_hold_capable: true

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
    
  compliance_management:
    regulatory_frameworks: ["SOX", "GDPR", "CCPA", "ISO27001", "PCI_DSS"]
    audit_frequency: "annual"
    compliance_officer_required: true
    
named_arbitration_policies:
  "moc:arbitration:enterprise_governance":
    description: "Enterprise-grade governance-focused arbitration"
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
    
  "moc:arbitration:security_compliance":
    description: "Security and compliance prioritized arbitration"
    precedence_order:
      - "P3_maturity_level"       # Regulatory first
      - "P1_authority_weight"     # Security authority
      - "P2_scope_specificity"    # Organization-wide security
      - "P5_evidence_density"     # Compliance evidence
      - "P4_temporal_recency"
      - "P6_deterministic_fallback"
    authority_weight_multiplier: 2.0
    security_override: true
    audit_trail_enhanced: true
```

---

## 🏛️ Corporation Template (1000+ employees)

### Context
- **Stage:** Large-scale enterprise, potentially multinational
- **Structure:** Complex matrix organization, multiple business units
- **Priorities:** Global governance, regulatory compliance, knowledge at scale
- **Challenges:** Complexity management, cultural differences, regulatory diversity

### MOC Configuration

```yaml
# MOC_CORPORATION_TEMPLATE.yaml
moc_version: "1.0"
organization: "[CORPORATION_NAME]"
created_date: "[YYYY-MM-DD]"
last_modified: "[YYYY-MM-DD]" 
version: "1.0.0"

# Corporate-scale: 7+ hierarchies with maximum governance
hierarchies:
  scope:
    metadata:
      concept: "Global corporate knowledge governance and reach"
      governance_rules: |
        5-level corporate model supporting global operations:
        Individual → Team → Department → Division → Business Unit → Corporation
        Geographic and business unit matrix considerations.
      level_semantics: |
        Level 0 = Corporate-wide (global access)
        Level 1 = Business Unit specific (BU + corporate)
        Level 2 = Division specific (division + BU + corporate)
        Level 3 = Department specific (dept + div + BU)
        Level 4 = Team specific (team + management chain)
        Level 5 = Individual/Project specific (limited access)
    nodes:
      # Corporate Level
      - id: "corporation"
        label: "Corporate-wide"
        parent: null
        level: 0
        governance:
          visibility: ["all_employees_global", "contractors", "partners", "board"]
          propagation: "automatic"
          authority_required: "ceo"
          geographic_reach: "global"
          
      # Business Unit Level
      - id: "technology-business-unit"
        label: "Technology Business Unit"
        parent: "corporation"
        level: 1
        governance:
          visibility: ["technology_bu", "corporate_executives", "cross_bu_roles"]
          propagation: "restricted"
          authority_required: "president_technology"
          geographic_reach: "global"
          
      - id: "financial-services-business-unit"
        label: "Financial Services Business Unit"
        parent: "corporation"
        level: 1
        governance:
          visibility: ["financial_services_bu", "corporate_executives"]
          propagation: "restricted"
          authority_required: "president_financial_services"
          geographic_reach: "north_america_europe"
          
      - id: "healthcare-business-unit"
        label: "Healthcare Business Unit"
        parent: "corporation"
        level: 1
        governance:
          visibility: ["healthcare_bu", "corporate_executives"]
          propagation: "restricted"
          authority_required: "president_healthcare"
          geographic_reach: "global"
          regulatory_enhanced: true  # Healthcare has extra compliance
          
      # Division Level (within Business Units)
      - id: "enterprise-software-division"
        label: "Enterprise Software Division"
        parent: "technology-business-unit"
        level: 2
        governance:
          visibility: ["enterprise_software_division", "technology_bu"]
          propagation: "restricted"
          authority_required: "gm_enterprise_software"
          
      - id: "cloud-platform-division"
        label: "Cloud Platform Division"
        parent: "technology-business-unit"
        level: 2
        governance:
          visibility: ["cloud_platform_division", "technology_bu"]
          propagation: "restricted"
          authority_required: "gm_cloud_platform"
          
      # Geographic Variants (for multinational)
      - id: "technology-bu-emea"
        label: "Technology BU - EMEA Region"
        parent: "technology-business-unit"
        level: 2
        governance:
          visibility: ["technology_bu_emea", "technology_bu"]
          propagation: "restricted"
          authority_required: "regional_gm_emea"
          geographic_compliance: "gdpr_uk_data_act"
          
      - id: "technology-bu-apac"
        label: "Technology BU - APAC Region"
        parent: "technology-business-unit"
        level: 2
        governance:
          visibility: ["technology_bu_apac", "technology_bu"]
          propagation: "restricted"
          authority_required: "regional_gm_apac"
          geographic_compliance: "pdpa_cybersecurity_law"

  domain:
    metadata:
      concept: "Corporate knowledge domains with global specialization"
      governance_rules: |
        Comprehensive domain coverage for multinational corporate operations.
        Geographic and regulatory compliance considerations.
    nodes:
      - id: "corporate_strategy"
        label: "Corporate Strategy & Governance"
        parent: null
        level: 0
        governance:
          owners: ["ceo", "strategy_team", "corporate_development"]
          reviewers: ["board", "executive_committee", "business_unit_presidents"]
          validation_required: true
          board_approval_required: true
          
      - id: "enterprise_architecture"
        label: "Enterprise Architecture & Standards"
        parent: null
        level: 0
        governance:
          owners: ["chief_architect", "enterprise_architects", "cto"]
          reviewers: ["architecture_council", "technology_committee"]
          validation_required: true
          cross_bu_coordination_required: true
          
      - id: "global_security_compliance"
        label: "Global Security & Compliance"
        parent: null
        level: 0
        governance:
          owners: ["ciso", "chief_compliance_officer", "security_council"]
          reviewers: ["audit_committee", "risk_committee", "external_auditors"]
          validation_required: true
          authority_weight: 2.0  # Highest precedence
          regulatory_oversight: true
          
      - id: "product_innovation"
        label: "Product Innovation & Management"
        parent: null
        level: 0
        governance:
          owners: ["chief_product_officer", "innovation_council", "r_and_d"]
          reviewers: ["product_committee", "market_research", "customer_advisory_board"]
          validation_required: true
          
      - id: "global_operations"
        label: "Global Operations & Process"
        parent: null
        level: 0
        governance:
          owners: ["coo", "global_process_owners", "operations_excellence"]
          reviewers: ["operations_committee", "quality_council", "lean_six_sigma"]
          validation_required: true
          
      - id: "data_ai_analytics"
        label: "Data, AI & Analytics"
        parent: null
        level: 0
        governance:
          owners: ["chief_data_officer", "ai_council", "analytics_center"]
          reviewers: ["data_governance_board", "ai_ethics_committee", "privacy_team"]
          validation_required: true
          ethics_review_required: true
          
      - id: "finance_risk_legal"
        label: "Finance, Risk & Legal"
        parent: null
        level: 0
        governance:
          owners: ["cfo", "chief_risk_officer", "general_counsel"]
          reviewers: ["audit_committee", "risk_committee", "external_counsel"]
          validation_required: true
          regulatory_oversight: true
          
      - id: "global_hr_culture"
        label: "Global HR & Culture"
        parent: null
        level: 0
        governance:
          owners: ["chro", "global_hr_council", "culture_transformation"]
          reviewers: ["compensation_committee", "diversity_council", "employee_advocacy"]
          validation_required: true
          
      - id: "sustainability_esg"
        label: "Sustainability & ESG"
        parent: null
        level: 0
        governance:
          owners: ["chief_sustainability_officer", "esg_committee"]
          reviewers: ["sustainability_council", "external_esg_advisors", "board"]
          validation_required: true
          public_reporting_required: true

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
        Level 3 = Corporate Standard (corporation-wide)
        Level 4 = Regulatory Standard (compliance required)
        Level 5 = Board Standard (board approved, public impact)
    nodes:
      - id: "draft"
        label: "Draft"
        parent: null
        level: 0
        governance:
          auto_promotion: false
          validation_required: false
          creation_authority: "any_employee"
          review_frequency_days: 7
          
      - id: "reviewed"
        label: "Peer Reviewed"
        parent: "draft"
        level: 1
        governance:
          auto_promotion: false
          validation_required: true
          authority_required: "peer_reviewer"
          reviewers_required: 2
          review_frequency_days: 21
          
      - id: "approved"
        label: "Department/Division Approved"
        parent: "reviewed"
        level: 2
        governance:
          auto_promotion: false
          validation_required: true
          authority_required: "division_general_manager"
          reviewers_required: 3
          evidence_required: ["implementation_proof", "stakeholder_approval"]
          review_frequency_days: 45
          
      - id: "corporate_standard"
        label: "Corporate Standard"
        parent: "approved"
        level: 3
        governance:
          auto_promotion: false
          validation_required: true
          authority_required: "business_unit_president"
          reviewers_required: ["cross_bu_council", "corporate_committee"]
          evidence_required: ["multi_bu_validation", "executive_approval"]
          review_frequency_days: 180
          mandatory_compliance: true
          
      - id: "regulatory_standard"
        label: "Regulatory Standard"
        parent: "corporate_standard"
        level: 4
        governance:
          auto_promotion: false
          validation_required: true
          authority_required: "chief_compliance_officer"
          reviewers_required: ["legal", "compliance", "external_auditors", "regulatory_advisors"]
          evidence_required: ["regulatory_approval", "audit_validation", "legal_review"]
          review_frequency_days: 365
          mandatory_compliance: true
          immutable_after_approval: true
          public_disclosure_required: false
          
      - id: "board_standard"
        label: "Board Standard"
        parent: "regulatory_standard"
        level: 5
        governance:
          auto_promotion: false
          validation_required: true
          authority_required: "board_of_directors"
          reviewers_required: ["independent_directors", "audit_committee", "external_advisors"]
          evidence_required: ["board_resolution", "independent_validation"]
          review_frequency_days: 365
          mandatory_compliance: true
          immutable_after_approval: true
          public_disclosure_required: true
          fiduciary_impact: true

  type:
    metadata:
      concept: "Corporate knowledge type classification with governance tiers"
      governance_rules: |
        Full enterprise type system with regulatory and board-level types.
        Public disclosure and fiduciary responsibility considerations.
    nodes:
      - id: "board_resolution"
        label: "Board Resolution"
        parent: null
        level: 0
        governance:
          required_fields: ["resolution_text", "voting_record", "implementation_plan", "compliance"]
          applies_to_domains: ["corporate_strategy", "finance_risk_legal"]
          validation_authority: "board_of_directors"
          mandatory_compliance: true
          public_disclosure: true
          legal_binding: true
          
      - id: "corporate_policy"
        label: "Corporate Policy"
        parent: null
        level: 0
        governance:
          required_fields: ["policy_statement", "enforcement", "exceptions", "compliance", "training"]
          applies_to_domains: ["corporate_strategy", "global_security_compliance", "global_hr_culture"]
          validation_authority: "executive_committee"
          mandatory_compliance: true
          legal_review_required: true
          global_applicability: true
          
      - id: "regulatory_filing"
        label: "Regulatory Filing Template"
        parent: null
        level: 0
        governance:
          required_fields: ["filing_requirements", "data_sources", "validation", "approval_chain"]
          applies_to_domains: ["finance_risk_legal", "global_security_compliance", "sustainability_esg"]
          validation_authority: ["chief_compliance_officer", "general_counsel"]
          regulatory_review_required: true
          external_audit_required: true
          
      - id: "enterprise_standard"
        label: "Enterprise Technical Standard"
        parent: null
        level: 0
        governance:
          required_fields: ["technical_spec", "implementation", "testing", "migration", "compliance"]
          applies_to_domains: ["enterprise_architecture", "global_security_compliance"]
          validation_authority: "enterprise_architecture_council"
          cross_bu_validation_required: true
          
      - id: "business_critical_procedure"
        label: "Business Critical Procedure"
        parent: null
        level: 0
        governance:
          required_fields: ["procedure_steps", "owners", "escalation", "metrics", "continuity_plan"]
          applies_to_domains: ["global_operations", "finance_risk_legal", "global_security_compliance"]
          validation_authority: "operations_committee"
          disaster_recovery_tested: true
          
      - id: "strategic_decision"
        label: "Strategic Decision Record"
        parent: null
        level: 0
        governance:
          required_fields: ["decision_rationale", "alternatives", "financial_impact", "risk_assessment"]
          applies_to_domains: ["corporate_strategy", "product_innovation", "finance_risk_legal"]
          validation_authority: "strategic_planning_committee"
          board_notification_required: true

  authority:
    metadata:
      concept: "Corporate decision authority with fiduciary responsibilities"
      governance_rules: |
        Multi-tier corporate authority structure with board oversight.
        Fiduciary responsibility and public company compliance.
      level_semantics: |
        Level 0-2 = Individual contributor through senior manager
        Level 3-4 = Director through VP (business unit authority)  
        Level 5 = SVP/President (business unit leadership)
        Level 6 = C-level (corporate authority)
        Level 7 = Board (fiduciary authority)
    nodes:
      # Individual Contributor Levels (0-2)
      - id: "individual_contributor"
        label: "Individual Contributor"
        parent: null
        level: 0
        governance:
          knowledge_creation: ["draft"]
          scope_authority: ["personal"]
          
      - id: "senior_professional"
        label: "Senior Professional"
        parent: "individual_contributor"
        level: 1
        governance:
          knowledge_creation: ["draft", "reviewed"]
          scope_authority: ["team_influence"]
          
      - id: "manager"
        label: "Manager"
        parent: "senior_professional"
        level: 2
        governance:
          knowledge_creation: ["draft", "reviewed", "approved"]
          scope_authority: ["department"]
          
      # Senior Management Levels (3-4)
      - id: "senior_manager"
        label: "Senior Manager"
        parent: "manager"
        level: 3
        governance:
          knowledge_creation: ["draft", "reviewed", "approved"]
          scope_authority: ["department", "division_influence"]
          
      - id: "director"
        label: "Director"
        parent: "senior_manager"
        level: 3
        governance:
          knowledge_creation: ["draft", "reviewed", "approved", "corporate_standard"]
          scope_authority: ["division"]
          
      - id: "vice_president"
        label: "Vice President"
        parent: "director"
        level: 4
        governance:
          knowledge_creation: ["draft", "reviewed", "approved", "corporate_standard"]
          scope_authority: ["division", "business_unit_influence"]
          
      # Executive Levels (5-6)
      - id: "senior_vice_president"
        label: "Senior Vice President"
        parent: "vice_president"
        level: 5
        governance:
          knowledge_creation: ["all_except_board"]
          scope_authority: ["business_unit"]
          cross_bu_coordination: true
          
      - id: "president"
        label: "President/Business Unit Head"
        parent: "senior_vice_president"
        level: 5
        governance:
          knowledge_creation: ["all_except_board"]
          scope_authority: ["business_unit", "corporate_influence"]
          strategic_decision_authority: true
          
      - id: "c_level"
        label: "C-Level Executive"
        parent: "president"
        level: 6
        governance:
          knowledge_creation: ["all_except_board"]
          scope_authority: ["corporation"]
          policy_creation: true
          regulatory_authority: true
          
      - id: "ceo"
        label: "Chief Executive Officer"
        parent: "c_level"
        level: 6
        governance:
          knowledge_creation: ["all_except_board"]
          scope_authority: ["corporation"]
          ultimate_executive_authority: true
          
      # Board Level (7)
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
          audit_requirements: "gdpr_compliance_annual"
          
      - id: "apac"
        label: "APAC Compliance"
        governance:
          regulatory_frameworks: ["PDPA_SINGAPORE", "CYBERSECURITY_LAW_CHINA", "PRIVACY_ACT_AUSTRALIA"]
          data_residency: "asia_pacific"
          audit_requirements: "regional_privacy_compliance"
          
      - id: "global"
        label: "Global Standards"
        governance:
          regulatory_frameworks: ["ISO27001", "ISO31000", "UN_GLOBAL_COMPACT"]
          audit_requirements: "annual_global_compliance"

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
    arbitration_binding: true
    
  compliance_management:
    regulatory_frameworks: ["SOX", "GDPR", "SEC", "COSO", "ISO27001", "ISO31000"]
    audit_frequency: "continuous"
    compliance_officer_required: true
    board_reporting_required: true
    public_disclosure_requirements: true
    
  risk_management:
    enterprise_risk_assessment: true
    third_party_risk_evaluation: true
    cyber_risk_monitoring: true
    operational_risk_controls: true
    
named_arbitration_policies:
  "moc:arbitration:corporate_governance":
    description: "Corporate governance focused arbitration with board oversight"
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
    
  "moc:arbitration:regulatory_compliance":
    description: "Regulatory compliance prioritized with legal oversight"
    precedence_order:
      - "P7_regulatory_compliance" # Regulatory requirements first
      - "P3_maturity_level"        # Board/regulatory standards
      - "P1_authority_weight"      # Compliance officer authority
      - "P8_geographic_compliance" # Custom: Regional regulations
      - "P5_evidence_density"      # Compliance evidence
      - "P6_deterministic_fallback"
    authority_weight_multiplier: 3.0  # Highest for compliance
    legal_review_required: true
    regulatory_notification_required: true
    
  "moc:arbitration:cross_business_unit":
    description: "Cross business unit arbitration with corporate oversight"
    precedence_order:
      - "P1_authority_weight"     # Corporate authority over BU
      - "P2_scope_specificity"    # Corporate scope precedence
      - "P3_maturity_level"       # Corporate standards
      - "P5_evidence_density"     # Cross-BU evidence
      - "P4_temporal_recency"
      - "P6_deterministic_fallback"
    minimum_authority_required: "svp"
    cross_bu_coordination_required: true
    corporate_approval_required: true
```

---

## 🛠️ Implementation Guidelines by Template

### Template Selection Decision Matrix

| Characteristic | Startup | Scale-up | Enterprise | Corporation |
|----------------|---------|----------|------------|-------------|
| **Employee Count** | 5-50 | 50-200 | 200-1000 | 1000+ |
| **Hierarchy Levels** | 2 levels | 3 levels | 4 levels | 5+ levels |
| **Decision Speed** | Hours | Days | Weeks | Months |
| **Compliance Complexity** | Basic | Moderate | High | Regulatory |
| **Geographic Scope** | Local | Regional | National | Global |
| **Regulatory Requirements** | Minimal | Industry | Multi-industry | Public company |
| **Change Tolerance** | High | Medium | Low | Very Low |
| **Formality Level** | Informal | Semi-formal | Formal | Highly Formal |

### Customization Guidelines

#### **For All Templates:**
1. **Replace placeholders** in brackets with actual organizational values
2. **Adjust node IDs** to match your actual team/department names
3. **Modify authority levels** to reflect your organizational structure
4. **Add domain categories** specific to your industry
5. **Configure arbitration policies** based on your decision culture

#### **Common Customizations:**

**Industry-Specific Domains:**
- **Healthcare:** Add `clinical`, `research`, `regulatory_affairs`
- **Financial Services:** Add `trading`, `risk_management`, `regulatory_reporting`
- **Manufacturing:** Add `production`, `quality_assurance`, `supply_chain`
- **E-commerce:** Add `customer_experience`, `marketplace`, `logistics`

**Geographic Adaptations:**
- **European Companies:** Emphasize GDPR compliance nodes
- **Asian Companies:** Add regional regulatory frameworks
- **Multinational:** Use corporation template with regional variants

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

| Feature | Startup | Scale-up | Enterprise | Corporation |
|---------|---------|----------|------------|-------------|
| **Hierarchies** | 4 core | 5 balanced | 6 comprehensive | 7+ advanced |
| **Maturity Levels** | 3 simple | 4 moderate | 5 rigorous | 6 regulatory |
| **Authority Levels** | 3 flat | 5 structured | 6 hierarchical | 8 corporate |
| **Arbitration Policies** | 1 speed | 1 balanced | 2 governance | 3+ compliance |
| **Compliance Focus** | Basic | Industry | Multi-regulatory | Global/Public |
| **Implementation Time** | 2-3 months | 3-4 months | 4-6 months | 6-12 months |
| **Maintenance Effort** | Low | Medium | High | Very High |
| **Governance Overhead** | Minimal | Moderate | Significant | Extensive |

These templates provide a solid foundation for Matrix Protocol implementation while maintaining the flexibility to adapt to specific organizational needs and constraints.

---

**Next Steps:** Choose the template that best matches your current organizational size and complexity, then customize it based on your specific industry, geographic, and cultural requirements.