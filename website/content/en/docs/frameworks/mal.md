---
title: MAL — Matrix Arbiter Layer
description: Deterministic arbitration layer for knowledge conflict resolution
  in Matrix Protocol
icon: i-heroicons-scale
layout: docs
sidebar: true
toc: true
navigation: true
lang: en
last_updated: 2025-10-21
---
# MAL — Matrix Arbiter Layer
**Acronym:** MAL  
**Version:** 0.0.1-beta  
**Last Update:** 2025-10-05  

> ⚠️ **IMPORTANT**: This document is an informative translation. The authoritative version is MAL_MATRIX_ARBITER_LAYER.md.

> "In the absence of conflict, wisdom remains untested." — Ancient Proverb

---

## 1. Introduction

The **Matrix Arbiter Layer (MAL)** is the conflict arbitration and concurrency layer of the protocol that operates as the final decision-making authority when local governance rules cannot resolve complex conflicts.

MAL is invoked **only** when local rules (scope filtering, authority validation, EvaluateForEnrich) cannot resolve three specific types of conflict: horizontal conflicts between equivalent UKIs, concurrent enrichment attempts, and promotion contentions.

MAL does not replace MOC, ZOF, OIF, or MEF; it provides deterministic decision-making, then delegates explanation to OIF and persistence to MEF while respecting policies configured in MOC.

---

## 2. Terms and Definitions

- **Arbitration Event**: Normalized input describing a conflict or concurrency condition requiring MAL decision
- **Decision Record**: Signed and immutable result with winner/loser designation, justification and references
- **Precedence Policy**: Ordered tiebreaker rules configured in MOC with defaults provided by MAL
- **Horizontal Conflict (H1)**: Two or more equivalent scope-level UKIs that conflict semantically
- **Concurrent Enrichment (H2)**: Two or more flows attempting to enrich overlapping semantics simultaneously
- **Promotion Contention (H3)**: Competing proposals to promote distinct UKIs to higher governance level

Additional references in **MOC (Matrix Ontology Catalog)** for specific organizational arbitration policies.

---

## 3. Core Concepts

### No-Op Principle
MAL operates as a last-resort arbitration layer. If scope/authority rules can resolve conflicts locally through standard MOC validation, MAL MUST NOT be invoked.

### Deterministic Decision-Making
Given identical inputs and policy configuration, MAL MUST produce consistent and reproducible decisions across all invocations to ensure system predictability.

### Epistemic Justification Integration
Every MAL decision MUST include epistemological justification aligned with MEP principles, referencing specific MOC nodes and providing traceable reasoning.

### Auditability and Transparency
All arbitration decisions MUST be persisted as immutable Decision Records with complete traceability to input UKIs, MOC policies, and reasoning chains.

### Non-Blocking User Experience
If MAL cannot decide within configured arbitration_timeout, ZOF MUST apply safe default result:
- Outcome = no enrich
- Status = pending arbitration

OIF MUST notify user that arbitration is pending, including MOC escalation instructions if available.

---

## 4. Normative Rules

> ⚠️ This section is **normative**.

### Mandatory Invocation Conditions
ZOF MUST invoke MAL when detecting H1, H2, or H3 conflict types after completing the EvaluateForEnrich checkpoint and local resolution attempts have failed.

### Arbitration Authority Boundaries
- MAL MUST make final decisions on conflicts within its scope
- MAL MUST NOT communicate results directly to users
- OIF MUST NOT attempt arbitration; MUST only explain MAL results
- OIF MUST render all MAL results using an Arbitration Explanation Template that includes at least:
  - decision_id
  - outcome
  - winner/losers (if applicable)
  - precedence_applied
  - epistemic_rationale with moc_nodes cited
- MEF MUST persist all MAL decisions as immutable Decision Records
- MOC MUST provide policy configuration but MUST NOT override MAL decisions

### Normalized Input Requirements
Every Arbitration Event MUST contain:
- **event_id**: Unique identifier for the arbitration request
- **event_type**: One of {H1, H2, H3} indicating conflict classification
- **candidates[]**: Array of conflicting UKI references with complete metadata
- **user_moc_context**: User hierarchical claims and authority levels
- **operation**: Type of operation requested (read/enrich/promote)
- **policy_ref**: Optional reference to specific MOC arbitration policy

### Precedence Policy Hierarchy

MAL MUST apply precedence rules as configured in MOC.

If policy_ref is provided in the Arbitration Event, MAL MUST resolve using the referenced policy from MOC.

If absent, MAL MAY use its canonical default precedence (P1–P6).

Organizations MUST always configure arbitration policies in MOC to override defaults.

Canonical default precedence order:
1. **P1 Authority Weight**: Higher authority node in MOC hierarchy wins
2. **P2 Scope Specificity**: More specific scope wins for local instructions; broader scope wins for mandatory global rules
3. **P3 Maturity Level**: validated > endorsed > draft/experimental
4. **P4 Temporal Recency**: More recent version wins if not violating lifecycle rules
5. **P5 Evidence Density**: UKI with more MEF evidence links and references
6. **P6 Deterministic Fallback**: Lexicographic comparison of UKI identifier

### Decision Outcomes
MAL MUST produce one of four outcomes:
- **winner**: Single UKI chosen as authoritative
- **coexist**: Multiple UKIs valid through scope partitioning
- **reject_all**: None satisfy policy requirements
- **defer**: Requires human override or escalation

### Persistence and Communication Requirements

MAL MUST NOT introduce ontological terms outside MOC.

All results must reference existing ontology fields:
- scope_ref (partitioning)
- authority_ref (authority hierarchy)
- lifecycle_ref (promotion/deprecation rules)

Relationships (conflicts_with, supersedes) MUST be persisted in MEF, always citing MOC references.

- MEF MUST store Decision Records with conflict relationships using MOC ontological terms
- OIF MUST receive structured messages to explain decisions using Arbitration Explanation Templates
- Arbitration Explanation Templates MUST include mandatory minimum fields: decision_id, outcome, winner/losers, precedence_applied, epistemic_rationale with moc_nodes cited
- All decisions MUST include epistemic justification referencing MOC nodes and MEF evidence

### Time and Consistency Constraints
- MAL MUST complete arbitration within arbitration_timeout configured in MOC
- If MAL cannot decide within configured arbitration_timeout, ZOF MUST apply safe default result:
  - Outcome = no enrich
  - Status = pending arbitration
- OIF MUST notify user that arbitration is pending, including MOC escalation instructions if available
- Decision Records MUST be immutable once persisted

---

## 5. Interoperability

- **MEF (Matrix Embedding Framework)**: Persists Decision Records as immutable audit trail
- **ZOF (Zion Orchestration Framework)**: Detects H1/H2/H3 conditions and invokes MAL with Arbitration Events
- **OIF (Operator Intelligence Framework)**: Renders MAL decisions to users via Arbitration Explanation templates
- **MOC (Matrix Ontology Catalog)**: Provides arbitration policies and precedence rule configuration
- **MEP (Matrix Epistemic Principle)**: Guides epistemic justification generation and ensures derived authority principles

---

## 6. Conventions and Examples

All examples in this document are **merely illustrative** and do not define normative behavior.  
Normative semantics (scopes, governance, archetypes, enrichment criteria) are always derived from each organization's **MOC (Matrix Ontology Catalog)**.  
Examples are provided for clarity and MAY be adapted to local contexts, but MUST NOT be treated as protocol-level obligations.

---

## 7. Illustrative Examples (Appendix)

> **Example (Informative, MOC-Dependent)**

### **Horizontal Conflict Arbitration (H1)**
```yaml

# --- Illustrative Example ---
arbitration_event:
  event_id: "mal-evt-20250826-001"
  event_type: "H1"
  conflict_description: "Two security rules of equivalent scope in conflict"
  
  candidates:
    - uki_ref: "uki:squad-x:rule:data-retention-30d"
      scope_ref: "squad-x"
      domain_ref: "security"
      type_ref: "rule"
      maturity_level: "validated"
      version: "1.2.0"
      evidence_refs: ["uki:org:policy:gdpr-compliance", "doc:audit-logs-2024"]
    
    - uki_ref: "uki:squad-x:rule:data-retention-7d"
      scope_ref: "squad-x"
      domain_ref: "security"
      type_ref: "rule"
      maturity_level: "endorsed"
      version: "2.0.0"
      evidence_refs: ["uki:org:policy:data-minimization"]
  
  user_moc_context:
    scopes: ["squad-x", "tribe-alpha", "organization"]
    authority_level: "squad_lead"
  
  operation: "enrich"

decision_record:
  decision_id: "mal-dec-20250826-h1-001"
  outcome: "winner"
  
  winner: "uki:squad-x:rule:data-retention-30d"
  losers: ["uki:squad-x:rule:data-retention-7d"]
  
  precedence_applied:
    - "P3_maturity": "validated > endorsed"
    - "P5_evidence": "GDPR compliance supersedes data minimization in security context"
  
  epistemic_rationale:
    summary: "Validated maturity and stronger regulatory evidence"
    reasoning: |
      While both UKIs operate at equivalent squad scope, the 30-day
      retention rule demonstrates higher epistemological maturity and stronger
      regulatory evidence linked to GDPR compliance requirements.
```


### **Concurrent Enrichment Arbitration (H2)**
```yaml

# --- Illustrative Example ---
arbitration_event:
  event_id: "mal-evt-20250826-002"
  event_type: "H2"
  conflict_description: "Simultaneous enrichment attempts on authentication patterns"

decision_record:
  decision_id: "mal-dec-20250826-h2-001"
  outcome: "winner"
  
  precedence_applied:
    - "P1_authority": "tech_lead > developer"
  
  actions:
    - "allow_enrich:zof-auth-jwt-implementation-002"
    - "defer_enrich:zof-auth-jwt-implementation-001"
  
  epistemic_rationale:
    summary: "Higher authority precedence in concurrent scenario"
```


### **Promotion Contention Arbitration (H3)**
```yaml

# --- Illustrative Example ---
arbitration_event:
  event_id: "mal-evt-20250826-003"
  event_type: "H3"
  conflict_description: "Competing promotion proposals to organizational level"

decision_record:
  decision_id: "mal-dec-20250826-h3-001"
  outcome: "winner"
  
  winner: "uki:tribe-alpha:guideline:code-review-standard"
  
  precedence_applied:
    - "P1_authority": "tribe_lead > squad_lead for org-level promotions"
    - "P2_scope": "tribe level closer to org-level than squad-level"
    - "P5_evidence": "External compliance audit carries greater weight"
  
  epistemic_rationale:
    summary: "Convergence of authority, scope proximity and compliance evidence"
```


---

## 8. Minimal MAL Interfaces (Normative)

### Arbitration Event Input Schema
```yaml

# --- Normative Interface ---
arbitration_event:
  event_id: string                    # Mandatory: Unique arbitration identifier
  event_type: enum[H1, H2, H3]        # Mandatory: Conflict classification
  timestamp: ISO8601                  # Mandatory: Event creation timestamp
  
  candidates: array                   # Mandatory: Conflicting entities
    - uki_ref: string                 # UKI identifier
      scope_ref: string               # MOC scope reference
      domain_ref: string              # MOC domain reference
      maturity_level: string          # Maturity classification
      evidence_refs: array[string]    # Supporting evidence references
  
  user_moc_context:                   # Mandatory: User context
    scopes: array[string]             # User scope hierarchy
    authority_level: string           # User authority designation
  
  operation: enum[read, enrich, promote]  # Mandatory: Requested operation
  policy_ref: string                  # Optional: Specific arbitration policy
```


### Decision Record Output Schema
```yaml

# --- Normative Interface ---
decision_record:
  decision_id: string                 # Mandatory: Unique decision identifier
  event_ref: string                   # Mandatory: Reference to arbitration event
  outcome: enum[winner, coexist, reject_all, defer]  # Mandatory: Decision result
  
  winner: string                      # Conditional: Chosen UKI (if outcome=winner)
  precedence_applied: array           # Mandatory: Applied precedence rules
  
  epistemic_rationale:                # Mandatory: MEP-aligned explanation
    summary: string                   # Brief decision justification
    reasoning: string                 # Detailed explanation
    references:
      moc_nodes: array[string]        # Referenced MOC nodes
      mef_evidence: array[string]     # Referenced MEF evidence
  
  audit:                              # Mandatory: Audit information
    decided_at: ISO8601               # Decision timestamp
    decided_by: string                # MAL version identifier
    timeout_used_ms: integer          # Processing time used
```
