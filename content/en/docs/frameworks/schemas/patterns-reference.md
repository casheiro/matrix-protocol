---
title: Patterns Reference
description: Detailed technical explanation of all regex patterns in Matrix Protocol schemas
icon: i-heroicons-code-bracket
layout: docs
sidebar: true
toc: true
navigation: true
lang: en
last_updated: 2025-11-01T00:00:00.000Z
order: 3
framework: general
tags:
  - schemas
  - patterns
  - regex
  - validation
keywords:
  - Matrix Protocol
  - regex patterns
  - validation
  - identifiers
  - format validation
---

# Patterns Reference

**Complete technical explanation of all regex patterns used in Matrix Protocol schemas**

> 🎯 **Objective**: Document each regex pattern, its technical justification and use cases within the Matrix Protocol context.

---

## 📊 Patterns Overview

Matrix Protocol schemas utilize **238 patterns** distributed across the 5 frameworks. Each pattern was designed to:

✅ **Ensure consistency** - Standardized formats throughout the ecosystem  
✅ **Prevent errors** - Rigorous validation of critical inputs  
✅ **Facilitate integration** - Predictable and documented patterns  
✅ **Support evolution** - Controlled versioning and extensibility  

---

## 🔍 Patterns by Category

### Unique Identifiers

#### UKI (Units of Knowledge Interlinked)

**Pattern:** `^uki:[a-z0-9-]+:[a-z0-9_]+:[a-z0-9-]+$`

**Structure:** `uki:{scope_ref}:{type_ref}:{slug}`

**Justification:**
- **Global namespace**: `uki:` prefix prevents collisions with other systems
- **Hierarchical scope**: `scope_ref` maps to MOC organizational structure
- **Semantic typing**: `type_ref` categorizes knowledge (rule, pattern, policy, etc.)
- **Unique identification**: `slug` identifies the specific instance

**Detailed components:**

| Component | Pattern | Description | Examples |
|-----------|---------|-------------|----------|
| `scope_ref` | `[a-z0-9-]+` | Organizational reference (squad, tribe, org) | `squad-payments`, `tribe-platform`, `organization` |
| `type_ref` | `[a-z0-9_]+` | Knowledge type | `business_rule`, `pattern`, `guideline`, `policy` |
| `slug` | `[a-z0-9-]+` | Specific identifier | `discount-logic-001`, `authentication-jwt` |

**Valid examples:**
```
uki:squad-payments:business_rule:discount-logic-001
uki:tribe-platform:pattern:authentication-jwt
uki:organization:policy:data-retention-gdpr
uki:squad-x:rule:validation-email-format
```

**Implemented business rules:**
- **Case sensitivity**: Lowercase to avoid URL/filesystem issues
- **Safe characters**: Only alphanumeric and hyphens for web compatibility
- **Clear hierarchy**: 4-level structure facilitates navigation and organization
- **Extensibility**: Pattern supports organizational evolution

#### MAL Decision IDs

**Pattern:** `^mal-dec-[0-9]{8}-[a-z0-9]+-[0-9]+$`

**Structure:** `mal-dec-{YYYYMMDD}-{conflict_type}-{sequence}`

**Justification:**
- **MAL namespace**: `mal-dec-` prefix identifies Matrix Arbiter Layer decisions
- **Timestamp**: Date facilitates auditing and chronological ordering
- **Conflict type**: `h1`, `h2`, `h3` or alphanumeric identifiers
- **Sequence**: Unique numbering per day to avoid collisions

**Detailed components:**

| Component | Pattern | Description | Example |
|-----------|---------|-------------|---------|
| Date | `[0-9]{8}` | YYYYMMDD format | `20250826` |
| Type | `[a-z0-9]+` | Conflict type identifier | `h1`, `h2`, `h3`, `custom` |
| Sequence | `[0-9]+` | Sequential number (no leading zeros) | `001`, `042`, `100` |

**Valid examples:**
```
mal-dec-20250826-h1-001    # First H1 conflict of the day
mal-dec-20250827-h2-042    # 42nd H2 conflict of the day
mal-dec-20250828-custom-100  # 100th custom conflict of the day
```

#### MAL Event References

**Pattern:** `^mal-evt-[0-9]{8}-[0-9]+$`

**Structure:** `mal-evt-{YYYYMMDD}-{sequence}`

**Justification:**
- **Correlation**: Links arbitration events to decisions
- **Traceability**: Enables complete process auditing
- **Ordering**: Date + sequence ensures chronological order

**Valid examples:**
```
mal-evt-20250826-001    # First event of the day
mal-evt-20250826-042    # 42nd event of the day
```

### Versioning

#### Semantic Versioning

**Pattern:** `^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$`

**Justification:**
- **Industry standard**: Compatible with SemVer (semantic versioning)
- **No leading zeros**: Prevents ambiguity (01.0.0 vs 1.0.0)
- **Three components**: MAJOR.MINOR.PATCH mandatory

**Components:**

| Component | Pattern | Description | When to increment |
|-----------|---------|-------------|-------------------|
| MAJOR | `(0\|[1-9]\d*)` | Incompatible changes | Breaking changes |
| MINOR | `(0\|[1-9]\d*)` | New functionality | Backward compatible |
| PATCH | `(0\|[1-9]\d*)` | Bug fixes | Backward compatible fixes |

**Valid examples:**
```
1.0.0    # Initial release
2.1.3    # Patch in minor release
0.5.0    # Pre-release version
10.25.100 # High numbers supported
```

**Invalid examples:**
```
1.0      # Missing PATCH component
01.0.0   # Leading zero not allowed
1.0.0-beta # Suffixes not supported in this pattern
v1.0.0   # Prefixes not supported
```

#### Schema Version

**Pattern:** `^[0-9]+\.[0-9]+$`

**Justification:**
- **Simplicity**: Only MAJOR.MINOR for schemas
- **Stability**: Schemas have more controlled evolution than software
- **Compatibility**: Facilitates migrations between versions

**Valid examples:**
```
1.0      # Initial schema
1.1      # Minor update
2.0      # Major restructuring
```

### Process Identifiers

#### Persistence IDs (MEF)

**Pattern:** `^mef-dr-[0-9]{8}-[a-z0-9]{8}$`

**Structure:** `mef-dr-{YYYYMMDD}-{hash}`

**Justification:**
- **Namespace**: `mef-dr-` identifies Decision Records in MEF
- **Date**: Facilitates partitioning and archiving
- **Hash**: 8 alphanumeric characters for uniqueness

#### MAL Versioning

**Pattern:** `^mal-v[0-9]+\.[0-9]+\.[0-9]+$`

**Structure:** `mal-v{MAJOR}.{MINOR}.{PATCH}`

**Justification:**
- **Traceability**: Each decision records the MAL version that generated it
- **Auditing**: Enables correlation of behavior with specific version
- **Debugging**: Facilitates bug identification in specific versions

### Checksums and Integrity

#### SHA-256 Checksum

**Pattern:** `^[a-f0-9]{64}$`

**Justification:**
- **Integrity**: SHA-256 ensures change detection
- **Standard**: Lowercase hexadecimal is established convention
- **Fixed length**: 64 characters for SHA-256

**Example:**
```
a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

### Organizational References

#### Scope References

**Pattern:** `^[a-z0-9-]+$`

**Justification:**
- **MOC hierarchy**: Maps directly to organizational nodes
- **URL-safe**: Compatible with web systems and APIs
- **Readability**: Human-readable format

**Examples:**
```
organization        # Highest level
tribe-platform     # Specific tribe
squad-payments      # Specific squad
team-backend-api    # Additional granularity
```

#### Domain References

**Pattern:** `^[a-z0-9-]+$`

**Justification:**
- **Categorization**: Classifies knowledge by domain
- **Governance**: Facilitates policy application by domain
- **Search**: Enables efficient filtering

**Common domains:**
```
business        # Business rules
technical       # Technical standards
security        # Security policies
compliance      # Regulatory requirements
operational     # Operational procedures
```

#### Type References

**Pattern:** `^[a-z0-9_]+$`

**Justification:**
- **Semantic typing**: Classifies nature of knowledge
- **Underscores allowed**: Convention for composite types
- **Extensibility**: Organizations can define custom types

**Standard types:**
```
business_rule    # Business rules
pattern          # Architectural patterns
guideline        # Guidelines
policy           # Corporate policies
procedure        # Procedures
standard         # Technical standards
```

### Date and Time Formats

#### Date Format (ISO 8601)

**Format:** `date`

**Implicit pattern:** `YYYY-MM-DD`

**Justification:**
- **International standard**: ISO 8601 is universally accepted
- **Sorting**: Format allows lexicographic ordering
- **Parsing**: Natively supported in all programming languages

#### DateTime Format (ISO 8601)

**Format:** `date-time`

**Implicit pattern:** `YYYY-MM-DDTHH:mm:ss.sssZ`

**Justification:**
- **Precision**: Milliseconds for audit trails
- **Timezone**: UTC (Z) avoids ambiguities
- **Interoperability**: Standard for REST APIs

---

## 🏗️ Pattern Architecture

### Design Principles

#### 1. Hierarchical Composition
Patterns follow organizational hierarchy:
```
uki:organization:policy:data-governance
    └─ organization (scope)
       └─ policy (type)
          └─ data-governance (specific instance)
```

#### 2. Temporal Anchoring
Identifiers include timestamps:
```
mal-dec-20250826-h1-001
        └─ 20250826 (YYYYMMDD)
```

#### 3. Type Safety
Each pattern enforces a specific type:
```
^uki:           # Forces UKI namespace
^mal-dec-       # Forces MAL Decision namespace
^mef-dr-        # Forces MEF Decision Record namespace
```

#### 4. Evolution Support
Patterns support extensibility:
```
[a-z0-9-]+      # Allows new values
[0-9]+\.[0-9]+  # Supports versioning
```

### Stratified Validation

#### Level 1: Syntactic
- **Format**: Basic regex pattern
- **Length**: minLength/maxLength
- **Characters**: Allowed character set

#### Level 2: Semantic
- **References**: scope_ref exists in MOC
- **Versioning**: version >= previous_version
- **Relationships**: target UKIs exist

#### Level 3: Business
- **Authorization**: User can create in scope
- **Policies**: Compliance with organizational rules
- **Workflow**: State allows operation

---

## 🔧 Use Cases by Framework

### MEF (Matrix Embedding Framework)

**Critical patterns:**
- **UKI IDs**: Unique knowledge identification
- **Versioning**: Controlled UKI evolution
- **References**: Links between UKIs

**Typical scenario:**
```yaml
id: "uki:squad-payments:business_rule:discount-logic-v2"
version: "2.1.0"
previous_version: "2.0.3"
relationships:
  - target: "uki:org:policy:pricing-standards"
```

### ZOF (Zion Orchestration Framework)

**Critical patterns:**
- **Workflow IDs**: Workflow identification
- **Step IDs**: Step identification
- **Service refs**: Service references

**Typical scenario:**
```yaml
id: "zof-wf-onboarding-premium-v3"
steps:
  - step_id: "kyc_verification"
    automation_config:
      service: "kyc_service_v2"
```

### OIF (Operator Intelligence Framework)

**Critical patterns:**
- **Archetype IDs**: Archetype identification
- **Capability IDs**: Capability identification
- **Tool references**: Tool references

### MOC (Matrix Ontology Catalog)

**Critical patterns:**
- **Hierarchy IDs**: Hierarchy identification
- **Node IDs**: Node identification
- **Relationship types**: Relationship types

### MAL (Matrix Arbiter Layer)

**Critical patterns:**
- **Decision IDs**: Unique decision identification
- **Event references**: Arbitration event references
- **Precedence rules**: Rule identification

---

## 📚 Pattern Quick Reference

### Main Identifiers

| Pattern | Usage | Example |
|---------|-------|---------|
| `^uki:[a-z0-9-]+:[a-z0-9_]+:[a-z0-9-]+$` | UKI IDs | `uki:squad-x:rule:data-retention` |
| `^mal-dec-[0-9]{8}-[a-z0-9]+-[0-9]+$` | MAL Decisions | `mal-dec-20250826-h1-001` |
| `^mal-evt-[0-9]{8}-[0-9]+$` | MAL Events | `mal-evt-20250826-001` |
| `^mef-dr-[0-9]{8}-[a-z0-9]{8}$` | MEF Records | `mef-dr-20250826-a1b2c3d4` |

### Versioning

| Pattern | Usage | Example |
|---------|-------|---------|
| `^(0\|[1-9]\d*)\.(0\|[1-9]\d*)\.(0\|[1-9]\d*)$` | Semantic Versioning | `2.1.3` |
| `^[0-9]+\.[0-9]+$` | Schema Versioning | `1.0` |
| `^mal-v[0-9]+\.[0-9]+\.[0-9]+$` | MAL Versioning | `mal-v1.0.0` |

### References

| Pattern | Usage | Example |
|---------|-------|---------|
| `^[a-z0-9-]+$` | Scope/Domain refs | `squad-payments` |
| `^[a-z0-9_]+$` | Type refs | `business_rule` |
| `^[a-f0-9]{64}$` | SHA-256 checksums | `a1b2c3d4...` |

---

## 🛠️ Implementation and Debugging

### Testing Patterns

**JavaScript:**
```javascript
const ukiPattern = /^uki:[a-z0-9-]+:[a-z0-9_]+:[a-z0-9-]+$/
const testId = "uki:squad-payments:business_rule:discount-001"
console.log(ukiPattern.test(testId)) // true
```

**Python:**
```python
import re
uki_pattern = r'^uki:[a-z0-9-]+:[a-z0-9_]+:[a-z0-9-]+$'
test_id = "uki:squad-payments:business_rule:discount-001"
print(bool(re.match(uki_pattern, test_id)))  # True
```

### Debugging Common Issues

#### Case Sensitivity
```
❌ uki:Squad-Payments:Business_Rule:Discount
✅ uki:squad-payments:business_rule:discount
```

#### Character Restrictions
```
❌ uki:squad_payments:business-rule:discount
✅ uki:squad-payments:business_rule:discount
```

#### Version Format
```
❌ 1.0 (missing patch)
❌ 01.0.0 (leading zero)
✅ 1.0.0
```

---

**🔍 For more information:**
- [Usage Guide](./schema-usage-guide) - How to implement validation
- [Test Cases](./test-cases) - Valid and invalid examples
- [Customization Guide](./customization-guide) - How to extend patterns