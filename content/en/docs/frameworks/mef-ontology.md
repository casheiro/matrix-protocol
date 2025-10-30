---
title: MEF Support Ontology
description: Reference controlled vocabularies for UKI structure and Matrix Embedding Framework implementation
keywords:
  - Matrix Protocol
  - MEF Support Ontology
  - controlled vocabularies
  - UKI structure
  - reference taxonomies
  - Matrix Embedding Framework
framework: MEF
icon: i-heroicons-cube
layout: docs
sidebar: true
toc: true
navigation: true
lang: en
last_updated: 2025-10-21T00:00:00.000Z
order: 2
---
# MEF Support Ontology — Ontologia de Suporte MEF
**Acronym:** MEF Support Ontology  
**Version:** 0.0.1-beta  
**Last Updated:** 2025-10-05  

> ⚠️ **IMPORTANT**: This document is an informative translation.

> 🚨 **IMPORTANT WARNING**: This document contains **ONLY ILLUSTRATIVE EXAMPLES** (such as `technical`, `business`, `draft`, etc.) that are NOT mandatory taxonomies. The **MOC (Matrix Ontology Catalog)** is the only definitive source for organizational taxonomies.

---

## 1. Introduction

The **MEF Support Ontology** defines the reference controlled vocabularies that can be used in UKI structure, serving as a starter set for organizations implementing the Matrix Embedding Framework.

This document provides illustrative examples of domains, types, relationships, and other structural elements that organizations can use as a starting point when configuring their own organizational MOC.

It is important to emphasize that these are **reference examples**, not mandatory taxonomies.

---

## 2. Terms and Definitions

- **Controlled Vocabularies**: Standardized sets of terms to ensure consistency
- **Starter Set**: Initial set of examples to facilitate implementation
- **Reference Domains**: Examples of organizational knowledge areas
- **UKI Types**: Structural categories of knowledge units
- **Ontological Relationships**: Semantic connections between UKIs
- **Severity Levels**: Classifications of change impact

Definitive references in the **organizational MOC** for specific validated taxonomies.

---

## 3. Core Concepts

### Organizational Flexibility Principle
All elements in this document are **configurable suggestions**:
- Organizations can use as a foundation
- Can add specific elements
- Can modify or remove as needed
- Must define own hierarchies in the MOC

### Reference vs Implementation Separation
- **This Document**: Illustrative examples and guidance
- **Organizational MOC**: Specific authoritative definitions
- **Implementations**: Must consult MOC, not this document

---

## 4. Normative Rules

> ⚠️ This section is **normative**.

### Use of Reference Vocabularies
- Organizations MAY use the examples in this document as a starting point
- Organizations MUST define their specific vocabularies in the organizational MOC
- Systems MUST validate UKI fields against the organizational MOC, not against this document
- Implementations MUST treat this document only as illustrative reference

### Controlled Extensibility
- Vocabularies MAY be extended through the organizational MOC
- Semantic validation MUST be centralized in the MOC
- Changes MUST follow defined organizational governance process

---

## 5. Interoperability

- **MEF (Matrix Embedding Framework)**: Uses vocabularies defined in the organizational MOC
- **MOC (Matrix Ontology Catalog)**: Authoritative source of all organizational vocabularies
- **ZOF (Zion Orchestration Framework)**: Consults vocabularies during EvaluateForEnrich checkpoint
- **OIF (Operator Intelligence Framework)**: Applies vocabularies in filtering and explanations

---

## 6. Conventions and Examples

All examples in this document are **merely illustrative** and do not define normative behavior.  
Normative semantics (scopes, governance, archetypes, enrichment criteria) are always derived from each organization's **MOC (Matrix Ontology Catalog)**.  
Examples are provided for clarity purposes and MAY be adapted to local contexts, but MUST NOT be treated as protocol-level obligations.

---

## 7. Illustrative Examples (Appendix)

> **Example (Informative, MOC-Dependent)**

### **Reference Domains**
```yaml

# --- Illustrative Examples ---
domains_examples:
  strategy: "High-level decisions, strategic planning"
  operations: "Operational processes, execution and procedures"
  security: "Security, protection and risk management"
  governance: "Governance, control and oversight"
  communication: "Communication, collaboration and relationships"

# Your organization can use completely different terms:
alternative_domains:
  innovation: "Organizational innovation processes"
  quality: "Quality management and continuous improvement"
  sustainability: "Sustainable practices and environmental responsibility"
  customer_experience: "Customer experience management"
```

### **Reference UKI Types**
```yaml

# --- Illustrative Examples ---
types_examples:
  pattern: "Reusable solution for common problem"
  rule: "Business logic or constraint"
  guideline: "Best practice recommendation"
  template: "Structured format for specific use"
  constraint: "Limitation or requirement"
  decision: "Strategic or tactical choice made"
  example: "Concrete implementation instance"

# Your organization can use specific categories:
alternative_types:
  procedure: "Standardized operational sequence"
  policy: "Institutional organizational directive"
  metric: "Quantitative performance indicator"
  concept: "Definition or theoretical model"
```

### **Ontological Relationships**
```yaml

# --- Illustrative Examples ---
relationship_types:
  depends_on: "Semantically depends on another UKI"
  overrides: "Replaces or overrules content from another UKI"
  conflicts_with: "Purposefully contradicts another UKI"
  complements: "Expands or details another UKI"
  amends: "Partially corrects or updates"
  precedes: "Establishes order or priority"
  equivalent_to: "Represents semantic equivalence"

relationship_usage_examples:
  dependency_example:
    source: "uki:technical:pattern:jwt-authentication"
    target: "uki:technical:constraint:security-requirements"
    type: "depends_on"
    description: "Implements defined security requirements"
  
  override_example:
    source: "uki:technical:pattern:oauth2-enhanced"
    target: "uki:technical:pattern:basic-auth-deprecated"
    type: "overrides"
    description: "Replaces obsolete basic authentication pattern"
```

### **Severity Levels**
```yaml

# --- Illustrative Examples ---
severity_levels:
  low:
    description: "Minor impact, informational or suggestions"
    impact: "Minimal business or technical impact"
    examples: ["documentation improvements", "optimization suggestions"]
  
  medium:
    description: "Moderate impact, affects specific functionalities"
    impact: "Localized functionality impact"
    examples: ["non-critical API changes", "process adjustments"]
  
  high:
    description: "Significant impact, affects core functionalities"
    impact: "Substantial system functionality impact"
    examples: ["critical API changes", "architectural alterations"]
  
  critical:
    description: "Critical impact, system failure or major disruption"
    impact: "Severe impact causing failure or major disruption"
    examples: ["breaking compatibility changes", "critical security alterations"]
```

### **Lifecycle**
```yaml

# --- Illustrative Examples ---
lifecycle_states:
  active:
    description: "Active UKI in normal use"
    usage: "Current and valid knowledge"
    actions: ["can be referenced", "can be updated"]
  
  deprecated:
    description: "Discontinued UKI but still referenced"
    usage: "Obsolete knowledge, avoid use"
    actions: ["do not use in new implementations", "migrate to alternative"]
  
  archived:
    description: "Archived UKI for historical consultation"
    usage: "Historical preservation, do not use"
    actions: ["historical consultation only", "do not reference"]
```

### **Organizational Customization Guide**
```yaml

# --- Example of How to Customize ---
customization_guide:
  step_1_analysis:
    - "Analyze your organization's specific domains"
    - "Identify unique knowledge types in your context"
    - "Map relationships important to your business"
  
  step_2_moc_definition:
    - "Define hierarchies in your organizational MOC"
    - "Establish specific governance rules"
    - "Configure appropriate evaluation criteria"
  
  step_3_validation:
    - "Configure automatic validation based on MOC"
    - "Establish vocabulary evolution process"
    - "Implement consistency monitoring"

example_organizational_vocabulary:
  # Example for fintech company
  fintech_domains:
    - "payments"
    - "credit"
    - "financial_compliance"
    - "user_experience"
    - "financial_security"
  
  # Example for healthcare company
  healthcare_domains:
    - "clinical"
    - "health_regulatory"
    - "patient_privacy"
    - "care_quality"
    - "systems_interoperability"
```