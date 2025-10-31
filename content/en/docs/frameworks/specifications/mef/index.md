---
title: MEF Specifications - Matrix Embedding Framework
description: Canonical YAML schemas for UKIs and Decision Records of the Matrix Embedding Framework
keywords:
  - MEF
  - Matrix Embedding Framework
  - UKI
  - Units of Knowledge Interlinked
  - Decision Record
  - YAML schemas
  - canonical specification
framework: MEF
icon: i-heroicons-cube
layout: docs
sidebar: true
toc: true
navigation: true
lang: en
last_updated: 2025-10-31T00:00:00.000Z
order: 1
---

# MEF Specifications - Matrix Embedding Framework

This section contains the normative canonical specifications for the **Matrix Embedding Framework (MEF)**, defining YAML schemas for versioned embedded knowledge structuring.

## 📋 Available Schemas

### 1. MEF UKI Schema
**File:** `mef-uki-schema.yaml`  
**Version:** 1.0.0  
**Purpose:** Canonical specification for Units of Knowledge Interlinked (UKIs)

<YamlViewer file-path="/content/en/docs/frameworks/specifications/mef/mef-uki-schema.yaml" />

#### Mandatory Fields
- **Metadata:** `schema`, `id`, `title`, `version`
- **MOC References:** `scope_ref`, `domain_ref`, `type_ref`, `maturity_ref`
- **Lifecycle Control:** `created_date`, `last_modified`, `status`
- **Content:** `content`

#### Optional Fields
- **Versioning:** `change_summary`, `change_impact`, `previous_version`
- **Relationships:** `relationships` (typed connections with other UKIs)
- **Examples:** `examples`, `validations`
- **Governance:** `governance`, `arbitration_metadata`

### 2. MEF Decision Record Schema
**File:** `mef-decision-record-schema.yaml`  
**Version:** 1.0.0  
**Purpose:** Specification for persisting MAL Decision Records in MEF

<YamlViewer file-path="/content/en/docs/frameworks/specifications/mef/mef-decision-record-schema.yaml" />

#### Mandatory Fields
- **Identification:** `decision_id`, `event_ref`
- **Result:** `outcome`, `precedence_applied`
- **Rationale:** `epistemic_rationale`
- **Audit:** `audit`, `mef_metadata`

#### MAL Integration
- Persists arbitration decisions as immutable trail
- Maintains complete references for traceability
- Supports epistemic rationales aligned with MEP

## 🎯 Using the Specifications

### For Implementers

#### Basic UKI Structure
```yaml
# Minimal example conforming to schema
schema: "1.0"
id: uki:my-team:guideline:example-001
title: "Example Guideline for Demonstration"
version: "1.0.0"

scope_ref: my-team
domain_ref: technical
type_ref: guideline
maturity_ref: draft

created_date: 2025-10-31
last_modified: 2025-10-31
status: active

content: |
  ## Example Guideline
  
  This is an example guideline that demonstrates
  the minimal structure of a UKI according to the MEF schema.
  
  ### Application
  - Use in demonstration contexts
  - Validate structure against schema
  
relationships: []
```

#### Schema Validation
```python
# Python with jsonschema
import yaml
import jsonschema

# Load schema and UKI
schema = yaml.safe_load(open('mef-uki-schema.yaml'))
uki = yaml.safe_load(open('my-uki.yaml'))

# Validate
try:
    jsonschema.validate(uki, schema)
    print("Valid UKI!")
except jsonschema.ValidationError as e:
    print(f"Validation error: {e.message}")
```

### For Organizations

#### MOC Field Adaptation
```yaml
# Configure according to your organizational MOC
scope_ref: your-team        # Defined in MOC
domain_ref: your-domain     # Defined in MOC  
type_ref: your_type         # Defined in MOC
maturity_ref: your_level    # Defined in MOC
```

#### Relationships Between UKIs
```yaml
relationships:
  - type: depends_on
    target: uki:other-team:pattern:base-001
    description: "Depends on base pattern for functionality"
    
  - type: overrides
    target: uki:my-team:guideline:old-001
    description: "Replaces previous guideline with new approach"
```


## ✅ Validation and Compliance

### Validation Rules
1. **ID Format:** Must follow pattern `uki:[scope_ref]:[type_ref]:[slug]`
2. **Versioning:** Must use semantic versioning
3. **MOC References:** All `*_ref` fields must reference valid nodes
4. **Relationships:** Must use standardized types and reference valid UKIs

### Conditional Validation
- Versions > 1.0.0 require `change_summary` and `change_impact`
- Status `deprecated` requires `change_summary` mentioning deprecation
- UKIs with `arbitration_metadata` must have `decision_record_ref`

## 🔗 Integration with Other Frameworks

### MOC (Matrix Ontology Catalog)
- `*_ref` fields reference nodes defined in MOC
- Configurable organizational hierarchies
- Authority validation through MOC

### ZOF (Zion Orchestration Framework)  
- UKIs are consulted during ZOF workflows
- EvaluateForEnrich checkpoint uses MEF criteria
- Conditional Oracle enrichment

### MAL (Matrix Arbiter Layer)
- Decision Records persisted in MEF
- Conflict relationships registered
- Immutable audit trail

### OIF (Operator Intelligence Framework)
- Knowledge Agents consume structured UKIs
- Filtering based on MOC hierarchies
- Explanations reference specific UKIs

## 📖 Related Resources

### Matrix Protocol Frameworks
- **[MEF - Matrix Embedding Framework](../../mef)** - Complete framework documentation
- **[Canonical Specifications](../)** - All protocol schemas
- **[Practical Examples](/docs/examples)** - Use cases and templates

### Technical Documentation
- **[Implementation Guide](/docs/implementation)** - How to implement the protocol
- **[Glossary](/docs/glossary)** - Definitions and terminology
- **[Tools Manual](/docs/manual)** - Support tools