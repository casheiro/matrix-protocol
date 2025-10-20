---
title: "Moc Squad Payments"
description: "Wrapper page for YAML asset MOC_SQUAD_PAYMENTS.yaml"
layout: "docs"
sidebar: true
toc: true
navigation: true
---

> Source YAML: `en/docs/examples/knowledge/MOC_SQUAD_PAYMENTS.yaml`

**Open in Viewer:** [Moc Squad Payments](/en/docs/viewer?file=/docs/examples/knowledge/MOC_SQUAD_PAYMENTS.yaml)

> 📄 Type: YAML • 📦 Size: 9.3 KB • 🕒 Last updated: 2025-10-12



```yaml

moc_version: "1.0"
organization: "Example E-commerce Company"
created_date: "2024-03-25"
last_modified: "2024-03-25"
version: "0.0.1-beta"

hierarchies:
  scope:
    metadata:
      concept: "Knowledge reach and visibility"
      governance_rules: |
        Defines the organizational reach and access control for knowledge.
        Squad-level knowledge can be promoted to tribe or organization levels
        based on validation and stakeholder approval.
      level_semantics: |
        For scope hierarchy: level represents organizational depth (0=root, 1=child, 2=grandchild).
        Lower level = broader organizational reach. Higher level = more specific scope.
        Used by MAL P2 for scope specificity evaluation.
    nodes:
      - id: "squad-payments"
        label: "Squad Payments"
        parent: "tribe-commerce"
        level: 2
        governance:
          visibility: ["squad_members", "tribe_leads", "architecture_committee"]
          propagation: "restricted"
          authority_required: "tech_lead"
          promotion_criteria:
            - "Validated in production for at least 30 days"
            - "Demonstrates value across multiple use cases"
            - "Approved by relevant stakeholders"
      
      - id: "tribe-commerce"
        label: "Commerce Tribe"
        parent: "organization"
        level: 1
        governance:
          visibility: ["tribe_members", "organization_leads"]
          propagation: "automatic"
          authority_required: "tribe_lead"
      
      - id: "organization"
        label: "Organization"
        parent: null
        level: 0
        governance:
          visibility: ["all_members"]
          propagation: "automatic"
          authority_required: "architecture_committee"

  domain:
    metadata:
      concept: "Knowledge area and specialization"
      governance_rules: |
        Classifies knowledge by functional domain with specific ownership
        and review responsibilities for each area.
      level_semantics: |
        For domain hierarchy: level represents functional priority (all domains at level 0).
        Level 0 = equal functional priority across domains.
        Used by MAL P1 for authority evaluation via ownership roles.
    nodes:
      - id: "business"
        label: "Business Rules"
        parent: null
        level: 0
        governance:
          owners: ["product_managers", "business_analysts"]
          reviewers: ["stakeholders", "compliance_team"]
          validation_required: true
      
      - id: "technical"
        label: "Technical Patterns"
        parent: null
        level: 0
        governance:
          owners: ["engineering_team", "tech_leads"]
          reviewers: ["architects", "security_team"]
          validation_required: true
      
      - id: "product"
        label: "Product Guidelines"
        parent: null
        level: 0
        governance:
          owners: ["product_team", "ux_designers"]
          reviewers: ["product_managers", "user_research"]
          validation_required: false
      
      - id: "strategy"
        label: "Strategic Decisions"
        parent: null
        level: 0
        governance:
          owners: ["leadership_team", "product_strategy"]
          reviewers: ["board", "executive_committee"]
          validation_required: true
      
      - id: "culture"
        label: "Culture & Processes"
        parent: null
        level: 0
        governance:
          owners: ["engineering_managers", "hr_team"]
          reviewers: ["team_leads", "culture_committee"]
          validation_required: false

  maturity:
    metadata:
      concept: "Validation and reliability level"
      governance_rules: |
        Epistemological stratification ensuring knowledge quality progression.
        Each level requires specific validation criteria and authority approval.
      level_semantics: |
        For maturity hierarchy: level represents epistemological progression (0=lowest, 2=highest).
        Higher level = higher epistemological maturity and reliability.
        Used by MAL P3 for maturity-based precedence evaluation.
    nodes:
      - id: "draft"
        label: "Draft"
        parent: null
        level: 0
        governance:
          auto_promotion: false
          validation_required: false
          creation_authority: "any_team_member"
          review_frequency_days: 30
      
      - id: "validated"
        label: "Validated"
        parent: "draft"
        level: 1
        governance:
          auto_promotion: false
          validation_required: true
          authority_required: "domain_expert"
          reviewers_required: 2
          evidence_required: ["practical_examples", "peer_review"]
          review_frequency_days: 90
      
      - id: "approved"
        label: "Approved"
        parent: "validated"
        level: 2
        governance:
          auto_promotion: false
          validation_required: true
          authority_required: "architecture_committee"
          evidence_required: ["production_validation", "stakeholder_approval"]
          review_frequency_days: 180

  type:
    metadata:
      concept: "Knowledge type classification"
      governance_rules: |
        Defines the structural and functional classification of knowledge units
        based on their purpose and application within the organization.
    nodes:
      - id: "business_rule"
        label: "Business Rule"
        parent: null
        level: 0
        governance:
          required_fields: ["examples", "relationships"]
          applies_to_domains: ["business", "product"]
          validation_authority: "product_managers"
      
      - id: "pattern"
        label: "Pattern"
        parent: null
        level: 0
        governance:
          required_fields: ["examples", "relationships"]
          applies_to_domains: ["technical", "strategy", "culture"]
          validation_authority: "tech_leads"
      
      - id: "procedure"
        label: "Procedure"
        parent: null
        level: 0
        governance:
          required_fields: ["examples", "relationships"]
          applies_to_domains: ["culture", "technical", "business"]
          validation_authority: "process_owners"
      
      - id: "guideline"
        label: "Guideline"
        parent: null
        level: 0
        governance:
          required_fields: ["examples"]
          applies_to_domains: ["product", "culture", "technical"]
          validation_authority: "domain_experts"
      
      - id: "decision"
        label: "Decision"
        parent: null
        level: 0
        governance:
          required_fields: ["examples", "relationships"]
          applies_to_domains: ["strategy", "technical", "business"]
          validation_authority: "architects"
      
      - id: "template"
        label: "Template"
        parent: null
        level: 0
        governance:
          required_fields: ["examples"]
          applies_to_domains: ["culture", "product", "technical"]
          validation_authority: "domain_experts"

  evaluation_criteria:
    metadata:
      concept: "Criteria for EvaluateForEnrich checkpoint"
      governance_rules: |
        Defines the semantic and practical value criteria used by ZOF
        EvaluateForEnrich checkpoint to determine knowledge enrichment worthiness.
      level_semantics: |
        For evaluation_criteria hierarchy: level represents evaluation priority (all criteria at level 0).
        Level 0 = equal evaluation priority, differentiated by weight values.
        Used by ZOF EvaluateForEnrich for weighted criteria assessment.
    nodes:
      - id: "business_impact"
        label: "Business Impact"
        parent: null
        level: 0
        governance:
          threshold: "medium"
          evaluators: ["product_managers", "business_analysts"]
          weight: 0.4
          criteria:
            - "Affects revenue or cost structure"
            - "Impacts customer experience"
            - "Enables new business capabilities"
      
      - id: "reusability"
        label: "Reusability"
        parent: null
        level: 0
        governance:
          threshold: "high"
          evaluators: ["architects", "tech_leads"]
          weight: 0.3
          criteria:
            - "Applicable across multiple domains/squads"
            - "Solves recurring problems"
            - "Provides template for similar solutions"
      
      - id: "regulatory_compliance"
        label: "Regulatory Compliance"
        parent: null
        level: 0
        governance:
          threshold: "critical"
          evaluators: ["compliance_team", "legal"]
          weight: 0.3
          criteria:
            - "Addresses regulatory requirements"
            - "Mitigates compliance risks"
            - "Enables audit trail maintenance"

governance:
  version_control:
    change_approval_required: true
    change_authority: "architecture_committee"
    impact_analysis_required: true
    notification_required: ["affected_squads", "stakeholders"]
  
  audit_trail:
    track_changes: true
    change_notifications: ["all_users"]
    retention_period_days: 2555  # 7 years for compliance
    validation_frequency_days: 90
  
  conflict_resolution:
    escalation_path: ["tech_lead", "tribe_lead", "architecture_committee", "cto"]
    resolution_timeout_days: 14
    arbitration_policy: "moc:arbitration:security_conflicts"
    
  lifecycle_management:
    node_deprecation_notice_days: 90
    migration_plan_required: true
    backwards_compatibility_period_days: 180
```
