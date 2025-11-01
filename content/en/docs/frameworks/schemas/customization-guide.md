---
title: Schema Customization Guide
description: How to extend and customize Matrix Protocol schemas while maintaining compatibility and governance
icon: i-heroicons-cog-6-tooth
layout: docs
sidebar: true
toc: true
navigation: true
lang: en
last_updated: 2025-11-01T00:00:00.000Z
order: 4
framework: general
tags:
  - schemas
  - customization
  - extensibility
  - governance
keywords:
  - Matrix Protocol
  - schema customization
  - extensibility
  - governance
  - custom validation
---

# Schema Customization Guide

**How to extend and customize Matrix Protocol schemas while maintaining compatibility, governance, and organizational consistency**

> 🎯 **Objective**: Provide practical strategies for customizing Matrix Protocol schemas according to specific organizational needs without compromising interoperability.

---

## 🎨 Customization Philosophy

### Fundamental Principles

#### 1. Compatibility First
✅ **Extensions must be additive** - Never remove required fields  
✅ **Backward compatibility** - Previous schemas must remain valid  
✅ **Interoperability** - Data must work in other implementations  

#### 2. Governed Evolution  
✅ **Controlled versioning** - Changes follow semantic versioning  
✅ **Mandatory documentation** - Justification for each customization  
✅ **Review process** - Technical committee approval for changes  

#### 3. Organizational Context
✅ **Specific needs** - Customizations address real use cases  
✅ **Corporate governance** - Alignment with organizational policies  
✅ **Compliance** - Meeting regulatory requirements  

---

## 🛠️ Customization Strategies

### Level 1: Property Extension

**Scenario**: Add specific fields without altering core

**Example - MEF UKI with corporate fields:**
```json
{
  "$schema": "https://matrix-protocol.org/schemas/mef/uki/1.0.0",
  "id": "uki:squad-payments:business_rule:discount-logic-001",
  
  // Standard Matrix Protocol fields
  "title": "Volume and Coupon Discount Rules",
  "version": "1.0.0",
  "scope_ref": "squad-payments",
  "status": "active",
  
  // ORGANIZATIONAL EXTENSIONS
  "x-corporate": {
    "compliance_status": "sox_reviewed",
    "risk_level": "low",
    "business_owner": "payments-team",
    "review_cycle": "quarterly",
    "regulatory_tags": ["pci-dss", "gdpr"],
    "cost_center": "CC-PAY-001"
  },
  
  // Additional metadata
  "x-metadata": {
    "created_by": "user@company.com",
    "approved_by": "manager@company.com",
    "environment": "production",
    "deployment_date": "2024-03-25T14:30:00Z"
  }
}
```

**Schema Implementation:**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://company.com/schemas/mef/uki-extended/1.0.0",
  
  "allOf": [
    {
      "$ref": "https://matrix-protocol.org/schemas/mef/uki/1.0.0"
    },
    {
      "type": "object",
      "properties": {
        "x-corporate": {
          "type": "object",
          "properties": {
            "compliance_status": {
              "type": "string",
              "enum": ["pending", "sox_reviewed", "audit_approved", "rejected"]
            },
            "risk_level": {
              "type": "string", 
              "enum": ["low", "medium", "high", "critical"]
            },
            "business_owner": {
              "type": "string",
              "pattern": "^[a-z0-9-]+$"
            },
            "regulatory_tags": {
              "type": "array",
              "items": {
                "type": "string",
                "enum": ["gdpr", "lgpd", "ccpa", "pci-dss", "sox", "hipaa"]
              }
            }
          },
          "required": ["compliance_status", "business_owner"]
        }
      }
    }
  ]
}
```

### Level 2: Organizational Patterns

**Scenario**: Customize patterns for specific corporate structure

**Example - UKI IDs with corporate structure:**
```json
{
  "id": {
    "pattern": "^uki:(org|div-[a-z]+|dept-[a-z0-9-]+):[a-z0-9_]+:[a-z0-9-]+$",
    "examples": [
      "uki:org:policy:data-governance",
      "uki:div-technology:standard:api-design", 
      "uki:dept-payments:business_rule:fraud-detection"
    ]
  },
  
  "scope_ref": {
    "pattern": "^(org|div-[a-z]+|dept-[a-z0-9-]+)$",
    "description": "Organizational hierarchy: org, div-{division}, dept-{department}"
  }
}
```

**Hierarchy mapping:**
```yaml
# Organizational structure
org:                    # Corporate level
  div-technology:       # Technology division
    dept-platform:      # Platform department
    dept-data:          # Data department
  div-business:         # Business division
    dept-payments:      # Payments department
    dept-logistics:     # Logistics department
```

### Level 3: Custom Types

**Scenario**: Define new organizational knowledge types

**Example - Extended type_ref:**
```json
{
  "type_ref": {
    "pattern": "^[a-z0-9_]+$",
    "enum": [
      // Standard Matrix Protocol types
      "business_rule", "pattern", "guideline", "policy",
      
      // CUSTOM ORGANIZATIONAL TYPES
      "sop",              // Standard Operating Procedure
      "checklist",        // Operational checklist
      "runbook",          // Technical runbook
      "playbook",         // Business playbook
      "template",         // Document template
      "decision_tree",    // Decision tree logic
      "escalation_path",  // Escalation procedures
      "compliance_check", // Compliance verification
      "risk_assessment",  // Risk evaluation framework
      "kpi_definition"    // KPI measurement criteria
    ]
  }
}
```

### Level 4: Specialized Workflows

**Scenario**: ZOF workflows for specific organizational processes

**Example - Compliance Review Workflow:**
```yaml
schema: "1.0"
id: "zof-wf-compliance-review-v1"
title: "Compliance Review Workflow"
framework: "ZOF"

# CUSTOMIZATION: Compliance-specific states
states:
  - state_id: "submitted"
    state_name: "Submitted for Review"
    x-compliance:
      required_reviewers: ["compliance-officer", "legal-counsel"]
      sla_hours: 72
      
  - state_id: "sox_review"
    state_name: "SOX Review"
    x-compliance:
      required_certifications: ["sox_reviewer"]
      documentation_required: true
      
  - state_id: "risk_assessment"
    state_name: "Risk Assessment"
    x-compliance:
      risk_categories: ["operational", "financial", "reputational"]
      impact_threshold: "medium"

# CUSTOMIZATION: Transitions with specific validations
transitions:
  - from_state: "submitted"
    to_state: "sox_review"
    conditions:
      x-validation:
        compliance_fields: ["risk_level", "business_owner"]
        mandatory_attachments: ["business_justification", "risk_matrix"]
```

---

## 🔧 Implementation Patterns

### Schema Inheritance Pattern

**Base schema (Matrix Protocol):**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://matrix-protocol.org/schemas/mef/uki/1.0.0",
  "type": "object",
  "properties": {
    "id": { "pattern": "^uki:[a-z0-9-]+:[a-z0-9_]+:[a-z0-9-]+$" },
    "title": { "type": "string", "minLength": 10 },
    "version": { "pattern": "^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)$" }
  },
  "required": ["id", "title", "version"]
}
```

**Extended schema (Organizational):**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://company.com/schemas/mef/uki-corporate/1.0.0",
  
  "allOf": [
    { "$ref": "https://matrix-protocol.org/schemas/mef/uki/1.0.0" },
    {
      "type": "object",
      "properties": {
        "id": {
          "pattern": "^uki:(corp|div-[a-z]+|dept-[a-z0-9-]+):[a-z0-9_]+:[a-z0-9-]+$"
        },
        "x-corporate": {
          "type": "object",
          "properties": {
            "compliance_status": { "enum": ["pending", "approved", "rejected"] },
            "business_criticality": { "enum": ["low", "medium", "high", "critical"] }
          },
          "required": ["compliance_status"]
        }
      },
      "required": ["x-corporate"]
    }
  ]
}
```

### Validation Layer Pattern

**Layered validation:**
```javascript
// Layer 1: Standard Matrix Protocol validation
const matrixValidate = ajv.compile(matrixSchema)

// Layer 2: Organizational validation
const corporateValidate = ajv.compile(corporateSchema)

// Layer 3: Business rules validation
function validateBusinessRules(data) {
  const errors = []
  
  // Rule: Critical UKIs need dual approval
  if (data['x-corporate']?.business_criticality === 'critical') {
    if (!data['x-corporate']?.dual_approval) {
      errors.push('Critical UKIs require dual approval')
    }
  }
  
  // Rule: Compliance status must align with risk level
  const compliance = data['x-corporate']?.compliance_status
  const risk = data['x-corporate']?.risk_level
  
  if (compliance === 'approved' && risk === 'high') {
    errors.push('High risk items cannot be approved without mitigation plan')
  }
  
  return errors
}

// Complete validation
function validateUKI(data) {
  // 1. Structural validation
  if (!matrixValidate(data)) {
    return { valid: false, errors: matrixValidate.errors, layer: 'matrix' }
  }
  
  // 2. Organizational validation
  if (!corporateValidate(data)) {
    return { valid: false, errors: corporateValidate.errors, layer: 'corporate' }
  }
  
  // 3. Business rules validation
  const businessErrors = validateBusinessRules(data)
  if (businessErrors.length > 0) {
    return { valid: false, errors: businessErrors, layer: 'business' }
  }
  
  return { valid: true }
}
```

---

## 🏛️ Customization Governance

### Approval Structure

#### Committee Structure
```yaml
# governance.yaml
schema_governance:
  committees:
    technical_review:
      members: ["tech-lead", "solution-architect", "platform-team"]
      responsibilities: ["technical_compatibility", "performance_impact"]
      
    business_review:
      members: ["product-owner", "business-analyst", "domain-expert"]
      responsibilities: ["business_value", "user_experience"]
      
    compliance_review:
      members: ["compliance-officer", "legal-counsel", "risk-manager"]
      responsibilities: ["regulatory_compliance", "risk_assessment"]

  approval_matrix:
    minor_extension:      # Add optional fields
      required: ["technical_review"]
      
    pattern_modification: # Modify existing patterns
      required: ["technical_review", "business_review"]
      
    major_restructure:    # Significant structural changes
      required: ["technical_review", "business_review", "compliance_review"]
```

#### Change Request Template
```yaml
# change-request-template.yaml
schema_change_request:
  metadata:
    request_id: "SCR-2024-001"
    created_date: "2024-03-25"
    created_by: "tech-lead@company.com"
    
  classification:
    change_type: "pattern_modification"  # minor_extension | pattern_modification | major_restructure
    impact_level: "medium"               # low | medium | high | critical
    affected_schemas: ["mef/uki", "zof/workflow"]
    
  business_justification:
    problem_statement: "Current UKI pattern doesn't support our organizational hierarchy"
    business_value: "Enable proper governance and compliance tracking"
    user_stories:
      - "As a compliance officer, I need to track review status"
      - "As a business owner, I need to assign responsibility"
      
  technical_specification:
    proposed_changes:
      - schema: "mef/uki/1.0.0"
        change: "Extend scope_ref pattern to support div-* and dept-*"
        rationale: "Map to organizational structure"
        
    compatibility_analysis:
      breaking_changes: false
      migration_required: false
      rollback_plan: "Revert to standard pattern if issues arise"
      
  validation_plan:
    test_cases:
      - scenario: "Valid corporate UKI creation"
        input: 'uki:div-tech:standard:api-design'
        expected: "valid"
        
    performance_impact: "Minimal - only pattern complexity increase"
    security_review: "No security implications identified"
```

### Version Management Strategy

#### Semantic Versioning for Custom Schemas
```json
{
  "versioning_strategy": {
    "major_bump": {
      "triggers": ["breaking_changes", "core_pattern_modification"],
      "example": "1.0.0 → 2.0.0",
      "migration": "required"
    },
    
    "minor_bump": {
      "triggers": ["new_optional_fields", "additional_enums"],
      "example": "1.0.0 → 1.1.0", 
      "migration": "optional"
    },
    
    "patch_bump": {
      "triggers": ["description_updates", "example_fixes"],
      "example": "1.0.0 → 1.0.1",
      "migration": "none"
    }
  }
}
```

#### Deprecation Strategy
```yaml
# deprecation-timeline.yaml
deprecation_policy:
  notice_period: "6_months"      # Minimum notice before removal
  support_period: "12_months"    # Parallel support for old versions
  
  phases:
    announcement:
      duration: "2_months"
      actions: ["documentation_update", "stakeholder_notification"]
      
    deprecation:
      duration: "4_months" 
      actions: ["warning_logs", "migration_guides", "tooling_updates"]
      
    removal:
      duration: "6_months"
      actions: ["breaking_change", "old_version_sunset"]
```

---

## 🚀 Advanced Use Cases

### Multi-Tenant Schemas

**Scenario**: SaaS platform with multiple organizations

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://platform.com/schemas/multi-tenant/uki/1.0.0",
  
  "allOf": [
    { "$ref": "https://matrix-protocol.org/schemas/mef/uki/1.0.0" },
    {
      "properties": {
        "id": {
          "pattern": "^uki:tenant-[a-z0-9]+:[a-z0-9-]+:[a-z0-9_]+:[a-z0-9-]+$",
          "description": "Format: uki:tenant-{tenant_id}:{org_scope}:{type_ref}:{slug}"
        },
        
        "x-tenant": {
          "type": "object",
          "properties": {
            "tenant_id": { "pattern": "^[a-z0-9]+$" },
            "subscription_tier": { "enum": ["basic", "premium", "enterprise"] },
            "data_residency": { "enum": ["us", "eu", "apac"] },
            "isolation_level": { "enum": ["shared", "dedicated", "private"] }
          },
          "required": ["tenant_id", "subscription_tier"]
        }
      }
    }
  ]
}
```

### Regulatory Compliance Extensions

**Scenario**: GDPR/LGPD compliance tracking

```json
{
  "x-compliance": {
    "type": "object",
    "properties": {
      "data_classification": {
        "enum": ["public", "internal", "confidential", "restricted"]
      },
      
      "personal_data": {
        "type": "object",
        "properties": {
          "contains_pii": { "type": "boolean" },
          "lawful_basis": { 
            "enum": ["consent", "contract", "legal_obligation", "vital_interests", "public_task", "legitimate_interests"]
          },
          "retention_period": { "type": "string", "pattern": "^P[0-9]+[YMD]$" },
          "data_subject_rights": {
            "type": "array",
            "items": { "enum": ["access", "rectification", "erasure", "portability", "restriction", "objection"] }
          }
        },
        "if": { "properties": { "contains_pii": { "const": true } } },
        "then": { "required": ["lawful_basis", "retention_period"] }
      }
    }
  }
}
```

### Integration Metadata

**Scenario**: System integration tracking

```json
{
  "x-integration": {
    "type": "object",
    "properties": {
      "source_systems": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "system_id": { "type": "string" },
            "api_version": { "type": "string" },
            "sync_frequency": { "enum": ["real-time", "hourly", "daily", "weekly"] },
            "data_mapping": { "type": "object" }
          }
        }
      },
      
      "downstream_consumers": {
        "type": "array", 
        "items": {
          "type": "object",
          "properties": {
            "consumer_id": { "type": "string" },
            "consumption_pattern": { "enum": ["pull", "push", "event-driven"] },
            "sla_requirements": { "type": "string" }
          }
        }
      }
    }
  }
}
```

---

## 📋 Customization Checklist

### Before Customizing

- [ ] **Validated need**: Real use case documented
- [ ] **Alternatives evaluated**: Configuration vs. extension vs. new schema
- [ ] **Impact mapped**: Affected systems identified
- [ ] **Stakeholders aligned**: Business, Tech, Compliance approved

### During Customization

- [ ] **Compatibility preserved**: Base schema remains valid
- [ ] **Naming conventions**: `x-` prefix for extensions
- [ ] **Documentation updated**: Changes explained
- [ ] **Tests created**: Valid and invalid cases tested

### After Customization

- [ ] **Complete validation**: All use cases working
- [ ] **Performance tested**: Validation impact measured
- [ ] **Rollback prepared**: Reversion plan documented
- [ ] **Teams trained**: Developers know how to use extensions

---

## 🔍 Advanced Troubleshooting

### Schema Resolution Issues

**Problem**: References between custom schemas

```javascript
// ❌ WRONG: Broken reference
{
  "$ref": "https://matrix-protocol.org/schemas/mef/uki/1.0.0#/definitions/scope_ref"
}

// ✅ CORRECT: Resolved reference
{
  "allOf": [
    { "$ref": "https://matrix-protocol.org/schemas/mef/uki/1.0.0" },
    {
      "properties": {
        "scope_ref": {
          "pattern": "^(org|div-[a-z]+|dept-[a-z0-9-]+)$"
        }
      }
    }
  ]
}
```

### Validation Performance

**Problem**: Complex schemas causing slowness

```javascript
// Optimization: Cache compiled schemas
const schemaCache = new Map()

function getCompiledSchema(schemaId) {
  if (!schemaCache.has(schemaId)) {
    const schema = loadSchema(schemaId)
    const compiled = ajv.compile(schema)
    schemaCache.set(schemaId, compiled)
  }
  return schemaCache.get(schemaId)
}

// Optimization: Stratified validation
function validateOptimized(data, schemaStack) {
  // Validate most restrictive schemas first
  const sortedSchemas = schemaStack.sort((a, b) => a.complexity - b.complexity)
  
  for (const schema of sortedSchemas) {
    const validate = getCompiledSchema(schema.id)
    if (!validate(data)) {
      return { valid: false, errors: validate.errors, failedAt: schema.id }
    }
  }
  
  return { valid: true }
}
```

### Migration Strategies

**Problem**: Migrating data to new schema

```javascript
// Migration function example
function migrateUKIToV2(ukiV1Data) {
  const ukiV2Data = {
    ...ukiV1Data,
    schema: "2.0", // Bump schema version
    
    // Migrate restructured fields
    organizational_context: {
      scope_ref: ukiV1Data.scope_ref,
      business_owner: ukiV1Data.owner || "unassigned",
      criticality: ukiV1Data.priority === "high" ? "critical" : "normal"
    },
    
    // Remove obsolete fields
    owner: undefined,
    priority: undefined
  }
  
  // Clean undefined fields
  return JSON.parse(JSON.stringify(ukiV2Data))
}

// Batch migration with validation
async function migrateBatch(ukiList) {
  const results = []
  
  for (const uki of ukiList) {
    try {
      const migrated = migrateUKIToV2(uki)
      const validation = validateUKI(migrated)
      
      if (validation.valid) {
        results.push({ status: 'success', data: migrated })
      } else {
        results.push({ status: 'validation_failed', errors: validation.errors, original: uki })
      }
    } catch (error) {
      results.push({ status: 'migration_failed', error: error.message, original: uki })
    }
  }
  
  return results
}
```

---

## 📚 Resources and References

### Ready-to-Use Templates

**Corporate UKI Schema**: `/templates/corporate-uki-schema.json`  
**Multi-tenant Extension**: `/templates/multi-tenant-extension.json`  
**Compliance Schema**: `/templates/compliance-schema.json`  
**Integration Metadata**: `/templates/integration-metadata.json`  

### Recommended Tools

**Schema Design**:
- [JSON Schema Tool](https://jsonschema.net/) - Visual schema builder
- [Altova XMLSpy](https://www.altova.com/) - Professional schema editor

**Validation Libraries**:
- **JavaScript**: `ajv` with `ajv-formats`
- **Python**: `jsonschema` with `jsonschema[format]`
- **Java**: `networknt/json-schema-validator`
- **Go**: `xeipuuv/gojsonschema`

**Testing Tools**:
- [Schema Test Suite](https://github.com/json-schema-org/JSON-Schema-Test-Suite)
- [Hypothesis](https://hypothesis.readthedocs.io/) for property-based testing

### Best Practices Reference

- [JSON Schema Best Practices](https://json-schema.org/understanding-json-schema/structuring.html)
- [Schema Versioning Guide](https://json-schema.org/draft/2019-09/json-schema-core.html#rfc.section.8.1.1)
- [Performance Optimization](https://ajv.js.org/guide/managing-schemas.html#performance)

---

**💡 Tip**: Always start with minimal extensions and evolve gradually. Excessive schema complexity can impact performance and maintainability.

**🔗 Next steps**: Consult the [Usage Guide](./schema-usage-guide) to implement validation or the [Test Cases](./test-cases) for practical examples.