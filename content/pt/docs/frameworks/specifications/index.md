---
title: Canonical YAML Specifications
description: Normative YAML schemas for Matrix Protocol frameworks implementation
keywords:
  - Matrix Protocol
  - canonical specifications
  - YAML schemas
  - MEF
  - MOC
  - ZOF
  - OIF
  - MAL
  - implementation
  - standardization
icon: i-heroicons-document-text
layout: docs
sidebar: true
toc: true
navigation: true
lang: en
last_updated: 2025-10-31T00:00:00.000Z
order: 10
---

# Canonical YAML Specifications

This section contains the **normative canonical specifications** in YAML format for implementing Matrix Protocol frameworks. These specifications are mandatory to ensure interoperability and compliance with the protocol.

## 📋 Specified Frameworks

### MEF (Matrix Embedding Framework)
- **[UKI Schema](./mef/)** - Canonical specification for Units of Knowledge Interlinked
- **[Decision Record Schema](./mef/)** - Specification for MAL decision records

### MOC (Matrix Ontology Catalog)  
- **[Hierarchy Schema](./moc/)** - Specification for organizational hierarchies
- **[Criteria Schema](./moc/)** - Specification for evaluation criteria
- **[Policy Schema](./moc/)** - Specification for arbitration policies

### ZOF (Zion Orchestration Framework)
- **[Workflow Schema](./zof/)** - Specification for workflow definitions
- **[Transition Schema](./zof/)** - Specification for state transitions
- **[Evaluation Schema](./zof/)** - Specification for EvaluateForEnrich checkpoint

### OIF (Operator Intelligence Framework)
- **[Archetype Schema](./oif/)** - Specification for archetype definitions
- **[Explanation Schema](./oif/)** - Specification for explanation templates

### MAL (Matrix Arbiter Layer)
- **[Event Schema](./mal/)** - Specification for arbitration events
- **[Decision Schema](./mal/)** - Specification for decision records

## 🎯 Purpose of Specifications

### Standardization
Ensure common and consistent format for Matrix Protocol implementations across different organizations and technologies.

### Interoperability  
Enable independently implemented systems to communicate and share structured data.

### Validation
Facilitate automatic protocol compliance validation through structured schemas.

### Governance
Establish authoritative reference for resolving implementation ambiguities.


## 🔧 Using the Specifications

### For Implementers
1. Use schemas as reference for data structures
2. Validate your implementations against provided schemas
3. Consult each framework's documentation for context

### For Validation
```yaml
# Validation example using jsonschema (Python)
import yaml
import jsonschema

# Load schema and data
schema = yaml.safe_load(open('mef-uki-schema.yaml'))
data = yaml.safe_load(open('my-uki.yaml'))

# Validate
jsonschema.validate(data, schema)
```

### For Organizations
- Adapt `*_ref` fields according to your MOC configuration
- Maintain compliance with mandatory fields
- Extend with organization-specific fields when allowed

## ⚖️ Normative Status

> ⚠️ **IMPORTANT**: These specifications are **normative**.

- **MUST**: Fields marked as mandatory must be implemented
- **MAY**: Optional fields may be implemented as needed
- **MUST NOT**: Schema violations are not permitted

## 🔄 Versioning

Specifications follow semantic versioning:
- **MAJOR**: Incompatible structural changes
- **MINOR**: Compatible additions
- **PATCH**: Bug fixes and clarifications

## 📖 Related Resources

### Matrix Protocol Frameworks
- **[MEF - Matrix Embedding Framework](../mef)** - Structured knowledge
- **[MOC - Matrix Ontology Catalog](../moc)** - Organizational taxonomies
- **[ZOF - Zion Orchestration Framework](../zof)** - Workflow orchestration
- **[OIF - Operator Intelligence Framework](../oif)** - Intelligence archetypes
- **[MAL - Matrix Arbiter Layer](../mal)** - Conflict arbitration

### Technical Documentation
- **[Implementation Guide](/docs/implementation)** - How to implement the protocol
- **[Practical Examples](/docs/examples)** - Use cases and templates
- **[Glossary](/docs/glossary)** - Definitions and terminology