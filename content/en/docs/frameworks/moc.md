---
title: MOC — Matrix Ontology Catalog
description: Organizational catalog that defines taxonomies, hierarchies and governance for structured knowledge in Matrix Protocol
keywords:
  - MOC
  - Matrix Protocol
  - ontology catalog
  - organizational taxonomies
  - hierarchies
  - governance
  - authority validation
framework: MOC
icon: i-heroicons-building-library
layout: docs
sidebar: true
toc: true
navigation: true
lang: en
last_updated: 2025-10-21T00:00:00.000Z
order: 10
---
# MOC — Matrix Ontology Catalog
**Acronym:** MOC  
**Version:** 0.0.1-beta  
**Last Update:** 2025-10-05  

> ⚠️ **IMPORTANT**: This document is an informative translation.

> 🚨 **IMPORTANT WARNING**: This document contains ILLUSTRATIVE EXAMPLES (like `technical`, `business`, `draft`, etc.) that are NOT mandatory taxonomies. Each organization defines its own hierarchies according to its specific needs. Examples serve only as conceptual reference.

> "Local flexibility preserves global coherence."

---

## 1. Introduction

The **Matrix Ontology Catalog (MOC)** is the fundamental component that allows Matrix Protocol to separate universal core concepts from organization-specific taxonomies and structures.

MOC defines **configurable hierarchies** for any concept that depends on organizational structures, maintaining global conceptual consistency while allowing total local adaptability.

MOC acts as the governance and configuration system that allows different organizations to adapt Matrix Protocol to their specific structures without losing conceptual interoperability.

---

## 2. Terms and Definitions

- **Core Concepts**: Fixed universal protocol elements (scope, domain, maturity)
- **Local Taxonomies**: Specific hierarchical structures defined by each organization
- **Configurable Hierarchies**: Classification systems adaptable to organizational needs
- **MOC Nodes**: Individual elements within a hierarchy (e.g., "team", "technical", "draft")
- **Organizational Governance**: Authority, visibility and propagation rules specific to the organization

---

## 3. Core Architecture

### 3.1 Universal Concepts (Fixed)

The MOC mandates these **universal hierarchy types** that every organization must implement:

#### **scope**
- **Concept**: Knowledge reach and visibility within organization
- **Purpose**: Defines who can access and modify knowledge
- **Organization defines**: Specific organizational levels (teams, departments, divisions)

#### **domain** 
- **Concept**: Functional knowledge areas
- **Purpose**: Categorizes knowledge by specialty domain
- **Organization defines**: Specific domains relevant to their business

#### **type**
- **Concept**: Structural knowledge classification
- **Purpose**: Defines knowledge format and required fields
- **Organization defines**: Knowledge types relevant to their processes

#### **maturity**
- **Concept**: Epistemological validation levels
- **Purpose**: Represents knowledge reliability and validation state
- **Organization defines**: Maturity progression appropriate to their governance

### 3.2 Local Implementation (Configurable)

Each organization implements the universal concepts according to their specific needs:

```yaml

# Example organizational MOC
moc_version: "1.0"
organization: "TechCorp Inc"
version: "2.1.0"

hierarchies:
  scope:
    metadata:
      concept: "Knowledge reach and visibility"
      governance_rules: |
        Defines organizational reach and access control for knowledge.
        Team-level knowledge can be promoted to higher levels.
    nodes:
      - id: "team-backend"
        label: "Backend Team"
        parent: "engineering"
        level: 2
        governance:
          visibility: ["team_members", "tech_leads"]
          authority_required: "team_lead"
          
  domain:
    nodes:
      - id: "technical"
        label: "Technical Knowledge"
        governance:
          owners: ["engineering_teams"]
          reviewers: ["tech_leads", "architects"]
          
  type:
    nodes:
      - id: "decision"
        label: "Decision Record"
        governance:
          required_fields: ["rationale", "alternatives"]
          applies_to_domains: ["technical", "business"]
          
  maturity:
    nodes:
      - id: "draft"
        label: "Draft"
        level: 0
        governance:
          validation_required: false
          creation_authority: "any_team_member"
```

---

## 4. Authority and Governance

### 4.1 Authority Validation Service

MOC provides the **Authority Validation Service** that determines:
- Who can create UKIs in specific scopes
- Who can promote knowledge between maturity levels
- Who can modify existing knowledge
- What visibility rules apply to knowledge access

### 4.2 Governance Configuration

Each MOC node can define:

```yaml

governance:
  # Who can create knowledge at this level
  creation_authority: "team_lead" | "domain_expert" | "any_member"
  
  # Who can view knowledge at this level
  visibility: ["team_members", "organization"]
  
  # How knowledge propagates to parent levels
  propagation: "automatic" | "manual" | "restricted"
  
  # Authority weight for conflict resolution
  authority_weight: 1.0  # Higher = more precedence
  
  # Required approvals for promotion
  reviewers_required: 2
  
  # Time limits
  review_period_days: 14
```

### 4.3 Precedence Rules

MOC defines how authority weight affects **MAL (Matrix Arbiter Layer)** decisions:

1. **P1_authority_weight**: Higher MOC authority wins
2. **P2_scope_specificity**: More specific scope wins
3. **P3_maturity_level**: Higher maturity wins
4. **Additional rules**: Organization-specific precedence

---

## 5. Lifecycle and Evolution

### 5.1 MOC Versioning

MOC itself follows semantic versioning:
- **Major**: Structural changes affecting UKI validation
- **Minor**: New nodes or governance rules
- **Patch**: Corrections and clarifications

### 5.2 Taxonomic Evolution

MOC supports dynamic taxonomy evolution:

```yaml

# Feedback mechanism for taxonomy improvement
taxonomic_evolution:
  feedback_collection: true
  usage_analytics: true
  optimization_suggestions: true
  
# Example: System suggests new domain based on UKI patterns
suggested_changes:
  - type: "new_domain"
    suggestion: "devops"
    rationale: "15+ UKIs created with devops-related content"
    confidence: 0.85
```

### 5.3 Migration Support

When MOC evolves, it provides:
- **Backward compatibility** validation
- **Migration scripts** for existing UKIs
- **Deprecation warnings** for obsolete nodes
- **Change impact analysis**

---

## 6. Integration with Other Frameworks

### 6.1 MEF Integration

All UKI `*_ref` fields must reference valid MOC nodes:

```yaml

# UKI references MOC
scope_ref: "team-backend"     # Must exist in MOC scope hierarchy
domain_ref: "technical"       # Must exist in MOC domain hierarchy
type_ref: "decision"          # Must exist in MOC type hierarchy
maturity_ref: "draft"         # Must exist in MOC maturity hierarchy
```

### 6.2 ZOF Integration

ZOF **EvaluateForEnrich** checkpoint uses MOC criteria:

```yaml

# MOC defines enrichment evaluation criteria
evaluation_criteria:
  - id: "business_impact"
    threshold: "medium"
    evaluators: ["product_managers"]  # MOC-defined roles
    weight: 0.4
```

### 6.3 MAL Integration

MAL arbitration uses MOC-defined precedence rules:

```yaml

# MOC configures MAL arbitration policies
arbitration_policies:
  default_policy:
    precedence_rules:
      - "P1_authority_weight"  # Uses MOC authority weights
      - "P3_maturity_level"    # Uses MOC maturity hierarchy
```

### 6.4 OIF Integration

OIF archetypes respect MOC authority structure:

```yaml

# OIF agent respects MOC permissions
agent_configuration:
  authority_context: "team-backend"  # MOC scope
  accessible_domains: ["technical"]  # MOC domain filter
  explanation_template: |
    Based on your {{scope_ref}} permissions and {{domain_ref}} expertise...
```

---

## 7. Implementation Guidelines

### 7.1 Initial MOC Setup

**Step 1**: Map organizational structure
```yaml

# Start with basic organizational levels
scope:
  nodes:
    - organization → divisions → departments → teams
```

**Step 2**: Identify knowledge domains
```yaml

# Map functional areas
domain:
  nodes:
    - technical, business, product, legal, hr
```

**Step 3**: Define knowledge types
```yaml

# Start simple, expand as needed
type:
  nodes:
    - decision, process, guideline, reference
```

**Step 4**: Establish maturity progression
```yaml

# Align with organizational validation process
maturity:
  nodes:
    - draft → reviewed → approved
```

### 7.2 Governance Best Practices

1. **Start Simple**: Begin with 3-4 nodes per hierarchy
2. **Evolve Gradually**: Add complexity based on real usage
3. **Authority Clarity**: Clear roles and responsibilities
4. **Regular Review**: Quarterly MOC effectiveness assessment

### 7.3 Common Patterns

**Startup Pattern** (5-50 people):
```yaml

scope: [personal, team, company]
domain: [technical, business, product]
type: [decision, process, knowledge]
maturity: [draft, validated]
```

**Enterprise Pattern** (200+ people):
```yaml

scope: [team, department, division, organization]
domain: [technical, business, product, legal, compliance]
type: [policy, procedure, decision, guideline, reference]
maturity: [draft, reviewed, approved, published]
```

---

## 8. Validation and Compliance

### 8.1 MOC Schema Validation

MOC files must pass validation:
- **Structure**: Valid YAML with required fields
- **References**: All parent references exist
- **Governance**: Authority rules are consistent
- **Semantic**: Level semantics make sense

### 8.2 UKI-MOC Compliance

All UKIs must validate against MOC:
- **Reference validity**: All `*_ref` fields point to existing MOC nodes
- **Authority compliance**: Creator has required authority for scope
- **Type compliance**: UKI structure matches type requirements

### 8.3 Organizational Auditing

MOC enables comprehensive knowledge auditing:
- **Access patterns**: Who accesses what knowledge
- **Authority usage**: Who creates/modifies knowledge
- **Promotion flows**: How knowledge evolves between levels
- **Compliance reporting**: Regulatory and governance compliance

---

## 9. Advanced Features

### 9.1 Multi-tenant MOC

Large organizations can implement hierarchical MOCs:

```yaml

# Corporate MOC with subsidiary MOCs
corporate_moc:
  subsidiaries:
    - subsidiary_a_moc
    - subsidiary_b_moc
  shared_hierarchies: ["type", "maturity"]
  local_hierarchies: ["scope", "domain"]
```

### 9.2 Cross-organizational Integration

MOC supports knowledge sharing between organizations:

```yaml

# External knowledge references
external_references:
  - organization: "partner_company"
    moc_version: "1.2.0"
    accessible_scopes: ["public"]
    trust_level: "validated"
```

### 9.3 Automated Governance

MOC can integrate with identity systems:

```yaml

# LDAP/Active Directory integration
identity_integration:
  provider: "ldap"
  authority_mapping:
    "cn=tech-leads,ou=groups": ["team_lead"]
    "cn=architects,ou=groups": ["domain_expert"]
```

---

## 10. Migration and Change Management

### 10.1 Phased Implementation

1. **Phase 1**: Basic scope and domain hierarchies
2. **Phase 2**: Type specialization and governance rules
3. **Phase 3**: Advanced maturity and authority structures
4. **Phase 4**: Integration with organizational systems

### 10.2 Change Impact Assessment

Before MOC changes, assess impact:
- **UKI validation**: How many UKIs will be affected
- **Authority changes**: How permissions will change
- **Integration impact**: How other frameworks are affected

### 10.3 Communication Strategy

MOC changes require clear communication:
- **Advance notice**: 30 days for structural changes
- **Migration guides**: Step-by-step transition instructions
- **Support period**: Parallel operation during transition

---

## 11. Conclusion

MOC is the governance foundation that makes Matrix Protocol organizationally adaptable while maintaining global coherence. Its configurable hierarchy system allows organizations to implement Matrix Protocol according to their specific structures and needs.

The key strength of MOC is enabling **local flexibility with global consistency** - organizations can define their own taxonomies while ensuring their knowledge structures remain compatible with Matrix Protocol standards.

---

> **💡 Implementation Tip**: Start with the simplest MOC that reflects your current organizational reality, then evolve it as your Matrix Protocol usage matures. The goal is organizational alignment, not theoretical perfection.