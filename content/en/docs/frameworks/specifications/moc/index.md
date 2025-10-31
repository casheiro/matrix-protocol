---
title: MOC Specifications - Matrix Ontology Catalog
description: Canonical YAML schemas for hierarchies, criteria and policies of the Matrix Ontology Catalog
keywords:
  - MOC
  - Matrix Ontology Catalog
  - organizational hierarchies
  - evaluation criteria
  - arbitration policies
  - configurable taxonomies
  - YAML schemas
framework: MOC
icon: i-heroicons-adjustments-horizontal
layout: docs
sidebar: true
toc: true
navigation: true
lang: en
last_updated: 2025-10-31T00:00:00.000Z
order: 2
---

# MOC Specifications - Matrix Ontology Catalog

This section contains the normative canonical specifications for the **Matrix Ontology Catalog (MOC)**, defining YAML schemas for configuring organizational hierarchies, evaluation criteria and arbitration policies.

## 📋 Available Schemas

### 1. MOC Hierarchy Schema
**File:** `moc-hierarchy-schema.yaml`  
**Version:** 1.0.0  
**Purpose:** Specification for configurable organizational hierarchies

<YamlViewer file-path="/content/en/docs/frameworks/specifications/moc/moc-hierarchy-schema.yaml" />

#### Mandatory Hierarchies
- **scope:** Knowledge reach and visibility
- **domain:** Knowledge areas and specialization
- **maturity:** Validation and reliability levels
- **evaluation_criteria:** Criteria for EvaluateForEnrich checkpoint

#### Optional Hierarchies
- **authority:** Organizational authority
- **lifecycle:** Knowledge lifecycle

### 2. MOC Evaluation Criteria Schema
**File:** `moc-evaluation-criteria-schema.yaml`  
**Version:** 1.0.0  
**Purpose:** Specification for organizational enrichment criteria

<YamlViewer file-path="/content/en/docs/frameworks/specifications/moc/moc-evaluation-criteria-schema.yaml" />

#### Main Components
- **evaluation_profiles:** Criteria profiles for different contexts
- **context_mapping:** Context mapping to specific profiles
- **default_profile:** Default evaluation profile

#### Evaluation Methods
- **manual:** Human evaluation
- **automated:** Automated evaluation
- **hybrid:** Manual/automated combination
- **semantic:** Semantic evaluation

### 3. MOC Arbitration Policies Schema
**File:** `moc-arbitration-policies-schema.yaml`  
**Version:** 1.0.0  
**Purpose:** Specification for MAL arbitration policies

<YamlViewer file-path="/content/en/docs/frameworks/specifications/moc/moc-arbitration-policies-schema.yaml" />

#### Main Configurations
- **default_precedence_order:** Default order of P1-P6 rules
- **scope_specificity_rules:** P2 rule configuration
- **conflict_type_policies:** Specific policies for H1/H2/H3
- **named_policies:** Organizational custom policies

## 🎯 Using the Specifications

### For Implementers

#### Basic MOC Structure
```yaml
# Minimal MOC configuration example
schema: "1.0"
organization_id: my-org
version: "1.0"

hierarchies:
  scope:
    description: "Organizational structure"
    nodes:
      squad:
        display_name: "Squad"
        level: 0
        parent: null
        authority_roles: ["developer", "tech_lead"]
      
      tribe:
        display_name: "Tribe"
        level: 1
        parent: null
        authority_roles: ["tribe_lead", "architect"]

  domain:
    description: "Knowledge domains"
    nodes:
      technical:
        display_name: "Technical"
        scope: global
        specializations: ["frontend", "backend"]
      
      business:
        display_name: "Business"
        scope: contextual
        specializations: ["product", "marketing"]

  maturity:
    description: "Maturity levels"
    nodes:
      draft:
        display_name: "Draft"
        rank: 10
        criteria: ["Initial documentation"]
        transitions:
          can_promote_to: ["validated"]
      
      validated:
        display_name: "Validated" 
        rank: 90
        criteria: ["Peer review", "Validated tests"]
        transitions:
          can_demote_to: ["draft"]

  evaluation_criteria:
    description: "Evaluation criteria"
    nodes:
      relevance:
        display_name: "Relevance"
        description: "Relevance to the team"
        threshold_type: high
        weight: 0.4
      
      reusability:
        display_name: "Reusability"
        description: "Reusability potential"
        threshold_type: medium
        weight: 0.6

metadata:
  created_date: 2025-10-31
  last_modified: 2025-10-31
  maintainer: governance-team
```

#### Evaluation Criteria Configuration
```yaml
# Evaluation profiles example
schema: "1.0"
organization_id: my-org
version: "1.0"

evaluation_profiles:
  standard:
    display_name: "Standard Profile"
    description: "Standard evaluation for regular knowledge"
    
    criteria:
      relevance:
        display_name: "Relevance"
        description: "Relevance to other members"
        evaluation_method: manual
        threshold:
          type: percentage
          value: 0.7
          operator: ">="
        weight: 0.4
      
      impact:
        display_name: "Impact"
        description: "Expected organizational impact"
        evaluation_method: hybrid
        threshold:
          type: categorical
          value: medium
        weight: 0.6
    
    applicable_contexts:
      scopes: ["squad", "tribe"]
      domains: ["technical", "business"]
      maturity_levels: ["draft", "validated"]

default_profile: standard

metadata:
  created_date: 2025-10-31
  last_modified: 2025-10-31
  maintainer: platform-team
```

#### Arbitration Policies Configuration
```yaml
# Arbitration policies example
schema: "1.0"
organization_id: my-org
version: "1.0"

arbitration_policies:
  default_precedence_order:
    - "P1_authority_weight"
    - "P2_scope_specificity" 
    - "P3_maturity_level"
    - "P4_temporal_recency"
    - "P5_evidence_density"
    - "P6_deterministic_fallback"
  
  arbitration_timeout: 5000
  
  scope_specificity_rules:
    local_instructions:
      precedence_order: ["squad", "tribe", "organization"]
      applies_to_types: ["guideline", "pattern"]
    
    mandatory_rules:
      precedence_order: ["organization", "tribe", "squad"]
      applies_to_types: ["policy", "compliance"]
  
  conflict_type_policies:
    H1_horizontal_conflicts:
      enable_coexistence: true
      require_deprecation: false
      precedence_order:
        - "P1_authority_weight"
        - "P3_maturity_level"
        - "P2_scope_specificity"
    
    H2_concurrent_enrichment:
      temporal_window_ms: 30000
      precedence_order:
        - "P4_temporal_recency"
        - "P1_authority_weight"
    
    H3_promotion_contention:
      evidence_density_multiplier: 2.0
      precedence_order:
        - "P5_evidence_density"
        - "P1_authority_weight"

metadata:
  created_date: 2025-10-31
  last_modified: 2025-10-31
  maintainer: governance-team
```

### For Organizations

#### Local Flexibility
- Configure hierarchies according to organizational structure
- Adapt evaluation criteria to local processes
- Customize arbitration policies according to governance

#### Maintaining Compliance
- Preserve mandatory schema fields
- Use consistent naming patterns
- Validate configurations against schemas


## ✅ Validation and Compliance

### Mandatory Hierarchies
Every MOC configuration must include:
1. **scope** - with nodes and hierarchical levels
2. **domain** - with specializations and controls
3. **maturity** - with ranks and transitions
4. **evaluation_criteria** - with weights and thresholds

### Validation Rules
- Sum of criteria weights ≤ 1.0
- Parent nodes must exist in hierarchy
- Cross-hierarchy references must be valid
- Default profiles must exist

### Organizational Consistency
- Node names must be unique per hierarchy
- Hierarchical levels must be consistent
- Authorities must map to valid roles

## 🔗 Integration with Other Frameworks

### MEF (Matrix Embedding Framework)
- UKI `*_ref` fields reference MOC nodes
- Authority validation through hierarchies
- Context-based knowledge filtering

### ZOF (Zion Orchestration Framework)
- EvaluateForEnrich checkpoint uses MOC criteria
- Authority validation for enrichment
- Configurable workflow policies

### MAL (Matrix Arbiter Layer)
- Precedence rules configured in MOC
- Arbitration policies by conflict type
- Timeout and decision configurations

### OIF (Operator Intelligence Framework)
- Hierarchical intelligence filtering
- Authority validation for archetypes
- Explanations reference specific MOC nodes

## 📖 Related Resources

### Matrix Protocol Frameworks
- **[MOC - Matrix Ontology Catalog](../../moc)** - Complete framework documentation
- **[Canonical Specifications](../)** - All protocol schemas
- **[MOC Templates](/docs/manual/templates)** - Organizational templates

### Technical Documentation
- **[Implementation Guide](/docs/implementation)** - How to implement the protocol
- **[MOC Governance](/docs/manual/moc-governance)** - Governance practices
- **[Glossary](/docs/glossary)** - Definitions and terminology