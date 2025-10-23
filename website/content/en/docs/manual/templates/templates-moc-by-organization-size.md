---
title: MOC Templates by Organization Size
description: Pre-configured MOC templates optimized for different organizational sizes and complexities
icon: i-heroicons-building-office
layout: docs
sidebar: true
toc: true
navigation: true
lang: en
last_updated: 2025-10-23
order: 3
---

# MOC Templates by Organization Size

## Overview

This document provides pre-configured Matrix Ontology Catalog (MOC) templates optimized for different organizational sizes, complexity levels, and maturity stages. Each template includes governance structures, authority mappings, and arbitration policies tailored to specific organizational contexts.

## Template Categories

### By Organization Size
- **[Startup Template](#startup-template)** - 5-20 people, minimal hierarchy
- **[Scaleup Template](#scaleup-template)** - 20-100 people, emerging structure
- **[Corporation Template](#corporation-template)** - 100-1000 people, defined departments
- **[Enterprise Template](#enterprise-template)** - 1000+ people, complex matrix structure

### By Implementation Approach
- **[Basic Template](#basic-template)** - Minimal implementation, quick start
- **[Unified Template](#unified-template)** - Comprehensive governance, full features

## Startup Template (5-20 people)

### Characteristics
- Flat organizational structure
- Limited formal hierarchy
- Fast decision-making
- High individual authority

### MOC Configuration
```yaml
hierarchies:
  scope:
    nodes:
      - id: "company"
        label: "Company"
        level: 0
        governance:
          visibility: ["all_members"]
          authority_required: "founder"
      
      - id: "team"
        label: "Core Team"
        parent: "company"
        level: 1
        governance:
          visibility: ["team_members"]
          authority_required: "lead"

  domain:
    nodes:
      - id: "product"
        label: "Product & Development"
        governance:
          owners: ["product_lead", "tech_lead"]
      
      - id: "business"
        label: "Business & Operations"
        governance:
          owners: ["founder", "operations_lead"]

  maturity:
    nodes:
      - id: "working"
        label: "Working"
        level: 0
        governance:
          creation_authority: "any_team_member"
          validation_required: false
      
      - id: "validated"
        label: "Validated"
        level: 1
        governance:
          authority_required: "domain_lead"
          reviewers_required: 1
```

### Key Features
- **Minimal Bureaucracy**: Fast validation processes
- **High Flexibility**: Easy policy changes
- **Broad Authority**: Most team members can create knowledge
- **Simple Arbitration**: Founder has final decision authority

## Scaleup Template (20-100 people)

### Characteristics
- Emerging departmental structure
- Growing process formalization
- Multiple expertise areas
- Scaling coordination needs

### MOC Configuration
```yaml
hierarchies:
  scope:
    nodes:
      - id: "company"
        label: "Company"
        level: 0
      
      - id: "department"
        label: "Department"
        parent: "company"
        level: 1
        
      - id: "team"
        label: "Team"
        parent: "department"
        level: 2

  domain:
    nodes:
      - id: "engineering"
        label: "Engineering"
        governance:
          owners: ["engineering_leads"]
          reviewers: ["architects", "senior_devs"]
      
      - id: "product"
        label: "Product Management"
        governance:
          owners: ["product_managers"]
          reviewers: ["stakeholders"]
      
      - id: "operations"
        label: "Operations"
        governance:
          owners: ["ops_leads"]
          reviewers: ["department_heads"]

  maturity:
    nodes:
      - id: "draft"
        label: "Draft"
        level: 0
        governance:
          creation_authority: "team_member"
      
      - id: "reviewed"
        label: "Peer Reviewed"
        level: 1
        governance:
          authority_required: "peer_reviewer"
          reviewers_required: 2
      
      - id: "approved"
        label: "Approved"
        level: 2
        governance:
          authority_required: "department_head"
```

### Key Features
- **Departmental Autonomy**: Domain-specific governance
- **Peer Review**: Quality validation through peer review
- **Structured Growth**: Supports organizational scaling
- **Clear Escalation**: Department-level arbitration

## Corporation Template (100-1000 people)

### Characteristics
- Established departmental hierarchy
- Formal governance processes
- Specialized expertise centers
- Complex approval workflows

### MOC Configuration
```yaml
hierarchies:
  scope:
    nodes:
      - id: "organization"
        label: "Organization"
        level: 0
      
      - id: "division"
        label: "Division"
        parent: "organization"
        level: 1
      
      - id: "department"
        label: "Department"
        parent: "division"
        level: 2
      
      - id: "team"
        label: "Team"
        parent: "department"
        level: 3

  domain:
    nodes:
      - id: "technology"
        label: "Technology Domain"
        governance:
          owners: ["cto", "tech_directors"]
          reviewers: ["architects", "security_team"]
          validation_required: true
      
      - id: "business"
        label: "Business Domain"
        governance:
          owners: ["business_directors"]
          reviewers: ["analysts", "compliance"]
          validation_required: true
      
      - id: "compliance"
        label: "Compliance & Risk"
        governance:
          owners: ["compliance_officers"]
          reviewers: ["legal", "audit"]
          validation_required: true

  maturity:
    nodes:
      - id: "draft"
        label: "Draft"
        level: 0
        governance:
          creation_authority: "any_employee"
          validation_required: false
      
      - id: "peer_reviewed"
        label: "Peer Reviewed"
        level: 1
        governance:
          authority_required: "domain_expert"
          reviewers_required: 2
          evidence_required: ["peer_validation"]
      
      - id: "approved"
        label: "Management Approved"
        level: 2
        governance:
          authority_required: "director"
          reviewers_required: 3
          evidence_required: ["business_validation"]
      
      - id: "certified"
        label: "Certified"
        level: 3
        governance:
          authority_required: "c_level"
          evidence_required: ["compliance_validation"]
```

### Key Features
- **Formal Governance**: Multiple approval levels
- **Domain Specialization**: Expert-driven validation
- **Compliance Focus**: Regulatory compliance integration
- **Audit Trail**: Complete change tracking

## Enterprise Template (1000+ people)

### Characteristics
- Complex matrix organization
- Multiple business units
- Global operations
- Regulatory requirements

### MOC Configuration
```yaml
hierarchies:
  scope:
    metadata:
      level_semantics: |
        Enterprise-grade scope hierarchy supporting global operations
        with regional and business unit variations.
    nodes:
      - id: "global"
        label: "Global Organization"
        level: 0
      
      - id: "region"
        label: "Regional Division"
        parent: "global"
        level: 1
      
      - id: "business_unit"
        label: "Business Unit"
        parent: "region"
        level: 2
      
      - id: "product_line"
        label: "Product Line"
        parent: "business_unit"
        level: 3
      
      - id: "team"
        label: "Execution Team"
        parent: "product_line"
        level: 4

  domain:
    nodes:
      - id: "strategic"
        label: "Strategic Domain"
        governance:
          owners: ["c_suite", "strategic_planning"]
          reviewers: ["board", "external_advisors"]
      
      - id: "regulatory"
        label: "Regulatory Domain"
        governance:
          owners: ["chief_compliance_officer"]
          reviewers: ["legal", "external_auditors"]
      
      - id: "operational"
        label: "Operational Domain"
        governance:
          owners: ["ops_directors"]
          reviewers: ["process_owners", "audit"]
      
      - id: "technical"
        label: "Technical Domain"
        governance:
          owners: ["cto", "chief_architect"]
          reviewers: ["technical_committee", "security"]

  maturity:
    nodes:
      - id: "draft"
        label: "Draft"
        level: 0
        governance:
          creation_authority: "any_employee"
          auto_promotion: false
      
      - id: "peer_validated"
        label: "Peer Validated"
        level: 1
        governance:
          authority_required: "domain_expert"
          reviewers_required: 3
          evidence_required: ["peer_review", "test_validation"]
      
      - id: "management_approved"
        label: "Management Approved"
        level: 2
        governance:
          authority_required: "director"
          reviewers_required: 5
          evidence_required: ["business_case", "risk_assessment"]
      
      - id: "executive_certified"
        label: "Executive Certified"
        level: 3
        governance:
          authority_required: "c_level"
          evidence_required: ["compliance_validation", "audit_approval"]
      
      - id: "board_ratified"
        label: "Board Ratified"
        level: 4
        governance:
          authority_required: "board"
          evidence_required: ["strategic_alignment", "regulatory_compliance"]
```

### Key Features
- **Global Governance**: Multi-regional coordination
- **Regulatory Compliance**: Built-in compliance workflows
- **Executive Oversight**: C-level and board governance
- **Complex Arbitration**: Multi-level escalation paths

## Basic Template (Quick Start)

For organizations wanting to start simple:

```yaml
hierarchies:
  scope:
    nodes:
      - id: "org"
        label: "Organization"
        level: 0
      - id: "team"
        label: "Team"
        parent: "org"
        level: 1

  domain:
    nodes:
      - id: "general"
        label: "General Knowledge"
        governance:
          owners: ["team_lead"]

  maturity:
    nodes:
      - id: "active"
        label: "Active"
        level: 0
        governance:
          creation_authority: "any_member"
```

## Implementation Guidelines

### Choosing the Right Template

1. **Assess Organizational Size**
   - Count active knowledge workers
   - Consider growth trajectory
   - Evaluate decision complexity

2. **Evaluate Governance Needs**
   - Regulatory requirements
   - Risk tolerance
   - Change velocity needs

3. **Consider Implementation Capacity**
   - Available resources
   - Technical expertise
   - Change management capability

### Customization Guidelines

1. **Start Conservative**
   - Begin with simpler structure
   - Add complexity as needed
   - Monitor adoption success

2. **Adapt to Culture**
   - Match existing governance patterns
   - Respect organizational values
   - Maintain change compatibility

3. **Plan for Growth**
   - Design for next organizational stage
   - Ensure migration path exists
   - Build flexibility into structure

## Migration Between Templates

### Startup → Scaleup
- Add departmental scope level
- Introduce peer review maturity
- Expand domain specialization

### Scaleup → Corporation
- Add formal approval processes
- Introduce compliance domain
- Implement audit requirements

### Corporation → Enterprise
- Add regional/global scope
- Implement board-level governance
- Add regulatory compliance integration

## Next Steps

1. **Select Your Template** based on organizational assessment
2. **Customize Configuration** to match your specific needs
3. **Implement Gradually** starting with pilot areas
4. **Monitor and Adjust** based on adoption feedback

---

> 💡 **Best Practice**: Start with a template one level simpler than your current organization size. It's easier to add complexity than to remove it once established.