---
title: YAML Schema Usage Guide
description: How to integrate and use Matrix Protocol JSON schemas in your projects
icon: i-heroicons-document-check
layout: docs
sidebar: true
toc: true
navigation: true
lang: en
last_updated: 2025-11-01T00:00:00.000Z
order: 1
framework: general
tags:
  - schemas
  - validation
  - json-schema
  - implementation
keywords:
  - Matrix Protocol
  - YAML schemas
  - JSON validation
  - implementation
  - MEF ZOF OIF MOC MAL
---

# YAML Schema Usage Guide

**How to integrate and validate Matrix Protocol JSON schemas in any language**

> 🎯 **Objective**: Provide everything you need to implement robust validation of Matrix Protocol schemas in your projects.

---

## 🔍 Introduction to Schemas

Matrix Protocol schemas are [JSON Schema](https://json-schema.org/) specifications that define structure and validation for each component of the 5 frameworks:

- **MEF** (Matrix Embedding Framework): UKIs and Decision Records
- **ZOF** (Zion Orchestration Framework): Workflows and State Transitions  
- **OIF** (Operator Intelligence Framework): Archetypes and Explanations
- **MOC** (Matrix Ontology Catalog): Hierarchies and Policies
- **MAL** (Matrix Arbiter Layer): Decision Records and Events

### Why JSON Schema?

✅ **Universal standard** - Supported in all modern languages  
✅ **Robust validation** - Patterns, types, formats and custom rules  
✅ **Automatic documentation** - Schemas serve as documentation  
✅ **Controlled evolution** - Versioning and guaranteed compatibility  

---

## 🚀 Quick Integration

### Accessing Schemas

All schemas are available via HTTP at standardized URLs:

```
https://matrix-protocol.org/schemas/{framework}/{type}/{version}
```

**Examples:**
- `https://matrix-protocol.org/schemas/mef/uki/1.0.0`
- `https://matrix-protocol.org/schemas/zof/workflow/1.0.0`
- `https://matrix-protocol.org/schemas/mal/decision-record/1.0.0`

### Framework → Types Mapping

| Framework | Available Types |
|-----------|-----------------|
| **MEF** | `uki`, `decision-record` |
| **ZOF** | `workflow`, `state-transition`, `enrichment-evaluation` |
| **OIF** | `archetype`, `arbitration-explanation` |
| **MOC** | `hierarchy`, `evaluation-criteria`, `arbitration-policies` |
| **MAL** | `decision-record`, `arbitration-event` |

---

## 💻 Implementation by Language

### JavaScript/Node.js

**Installation:**
```bash
npm install ajv ajv-formats
```

**Complete example:**
```javascript
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

// Configure validator
const ajv = new Ajv({ allErrors: true })
addFormats(ajv)

// Load schema
const schemaUrl = 'https://matrix-protocol.org/schemas/mef/uki/1.0.0'
const schemaResponse = await fetch(schemaUrl)
const schema = await schemaResponse.json()

// Compile validator
const validate = ajv.compile(schema)

// Validate data
const ukiData = {
  schema: "1.0",
  id: "uki:squad-payments:business_rule:discount-logic-001",
  title: "Volume and Coupon Discount Rules",
  version: "1.0.0",
  scope_ref: "squad-payments",
  domain_ref: "business",
  type_ref: "business_rule",
  maturity_ref: "validated",
  created_date: "2024-03-25",
  last_modified: "2024-03-25",
  status: "active",
  content: "## Discount Rules\n\nAutomatic application based on total value..."
}

if (validate(ukiData)) {
  console.log('✅ Valid UKI!')
} else {
  console.log('❌ Validation errors:')
  console.log(validate.errors)
}
```

### Python

**Installation:**
```bash
pip install jsonschema requests
```

**Complete example:**
```python
import requests
from jsonschema import validate, ValidationError

# Load schema
schema_url = 'https://matrix-protocol.org/schemas/mef/uki/1.0.0'
schema_response = requests.get(schema_url)
schema = schema_response.json()

# Data to validate
uki_data = {
    "schema": "1.0",
    "id": "uki:squad-payments:business_rule:discount-logic-001",
    "title": "Volume and Coupon Discount Rules",
    "version": "1.0.0",
    "scope_ref": "squad-payments",
    "domain_ref": "business",
    "type_ref": "business_rule",
    "maturity_ref": "validated",
    "created_date": "2024-03-25",
    "last_modified": "2024-03-25",
    "status": "active",
    "content": "## Discount Rules\n\nAutomatic application based on total value..."
}

# Validate
try:
    validate(instance=uki_data, schema=schema)
    print("✅ Valid UKI!")
except ValidationError as e:
    print(f"❌ Validation error: {e.message}")
    print(f"📍 Path: {'.'.join(str(p) for p in e.path)}")
```

### Go

**Installation:**
```bash
go get github.com/xeipuuv/gojsonschema
```

**Complete example:**
```go
package main

import (
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    
    "github.com/xeipuuv/gojsonschema"
)

func main() {
    // Load schema
    schemaURL := "https://matrix-protocol.org/schemas/mef/uki/1.0.0"
    resp, err := http.Get(schemaURL)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()
    
    schemaBytes, err := io.ReadAll(resp.Body)
    if err != nil {
        panic(err)
    }
    
    // Prepare validation
    schemaLoader := gojsonschema.NewBytesLoader(schemaBytes)
    
    // Data to validate
    ukiData := map[string]interface{}{
        "schema":       "1.0",
        "id":          "uki:squad-payments:business_rule:discount-logic-001",
        "title":       "Volume and Coupon Discount Rules",
        "version":     "1.0.0",
        "scope_ref":   "squad-payments",
        "domain_ref":  "business",
        "type_ref":    "business_rule",
        "maturity_ref": "validated",
        "created_date": "2024-03-25",
        "last_modified": "2024-03-25",
        "status":      "active",
        "content":     "## Discount Rules\n\nAutomatic application based on total value...",
    }
    
    ukiBytes, _ := json.Marshal(ukiData)
    documentLoader := gojsonschema.NewBytesLoader(ukiBytes)
    
    // Validate
    result, err := gojsonschema.Validate(schemaLoader, documentLoader)
    if err != nil {
        panic(err)
    }
    
    if result.Valid() {
        fmt.Println("✅ Valid UKI!")
    } else {
        fmt.Println("❌ Validation errors:")
        for _, desc := range result.Errors() {
            fmt.Printf("- %s\n", desc)
        }
    }
}
```

### Rust

**Cargo.toml:**
```toml
[dependencies]
jsonschema = "0.17"
serde_json = "1.0"
reqwest = { version = "0.11", features = ["json"] }
tokio = { version = "1.0", features = ["full"] }
```

**Complete example:**
```rust
use jsonschema::{JSONSchema, ValidationError};
use serde_json::{json, Value};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Load schema
    let schema_url = "https://matrix-protocol.org/schemas/mef/uki/1.0.0";
    let schema_value: Value = reqwest::get(schema_url)
        .await?
        .json()
        .await?;
    
    // Compile schema
    let compiled = JSONSchema::compile(&schema_value)
        .expect("Invalid schema");
    
    // Data to validate
    let uki_data = json!({
        "schema": "1.0",
        "id": "uki:squad-payments:business_rule:discount-logic-001",
        "title": "Volume and Coupon Discount Rules",
        "version": "1.0.0",
        "scope_ref": "squad-payments",
        "domain_ref": "business",
        "type_ref": "business_rule",
        "maturity_ref": "validated",
        "created_date": "2024-03-25",
        "last_modified": "2024-03-25",
        "status": "active",
        "content": "## Discount Rules\n\nAutomatic application based on total value..."
    });
    
    // Validate
    match compiled.validate(&uki_data) {
        Ok(_) => println!("✅ Valid UKI!"),
        Err(errors) => {
            println!("❌ Validation errors:");
            for error in errors {
                println!("- {}", error);
            }
        }
    }
    
    Ok(())
}
```

---

## 🔍 Complex Patterns Explained

### UKI Identifiers

**Pattern:** `^uki:[a-z0-9-]+:[a-z0-9_]+:[a-z0-9-]+$`

**Structure:** `uki:{scope_ref}:{type_ref}:{slug}`

**Valid examples:**
```yaml
✅ uki:squad-payments:business_rule:discount-logic-001
✅ uki:tribe-platform:pattern:authentication-jwt
✅ uki:organization:policy:data-retention-gdpr
```

**Invalid examples:**
```yaml
❌ uki:Squad-Payments:business_rule:discount  # Uppercase in scope
❌ uki:squad-payments:BusinessRule:discount   # Uppercase in type
❌ uki:squad_payments:business-rule:discount  # Underscore in scope
```

### Semantic Versioning

**Pattern:** `^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$`

**Valid examples:**
```yaml
✅ 1.0.0    # Initial release
✅ 2.1.3    # Patch in minor release
✅ 0.5.0    # Beta version
```

**Invalid examples:**
```yaml
❌ 1.0      # Missing patch version
❌ 01.0.0   # Leading zero
❌ 1.0.0-beta  # Suffix not allowed
```

### MAL Decision IDs

**Pattern:** `^mal-dec-[0-9]{8}-[a-z0-9]+-[0-9]+$`

**Structure:** `mal-dec-{YYYYMMDD}-{conflict_type}-{sequence}`

**Valid examples:**
```yaml
✅ mal-dec-20250826-h1-001     # H1 conflict
✅ mal-dec-20250827-h2-042     # H2 conflict, 42nd decision
✅ mal-dec-20250828-h3-100     # H3 conflict, 100th decision
```

---

## 🛠️ Troubleshooting

### Common Errors

#### 1. **Pattern Mismatch**
```json
{
  "instancePath": "/id",
  "schemaPath": "#/properties/id/pattern",
  "keyword": "pattern",
  "params": {"pattern": "^uki:[a-z0-9-]+:[a-z0-9_]+:[a-z0-9-]+$"},
  "message": "must match pattern \"^uki:[a-z0-9-]+:[a-z0-9_]+:[a-z0-9-]+$\""
}
```

**Solution:** Check that the ID follows exactly the `uki:scope:type:slug` format with lowercase characters.

#### 2. **Required Property Missing**
```json
{
  "instancePath": "",
  "schemaPath": "#/required",
  "keyword": "required",
  "params": {"missingProperty": "scope_ref"},
  "message": "must have required property 'scope_ref'"
}
```

**Solution:** Add the missing required property.

#### 3. **Invalid Enum Value**
```json
{
  "instancePath": "/status",
  "schemaPath": "#/properties/status/enum",
  "keyword": "enum",
  "params": {"allowedValues": ["active", "deprecated", "archived", "sunset"]},
  "message": "must be equal to one of the allowed values"
}
```

**Solution:** Use only allowed values from the enum.

### Date Validation

Fields with `format: date` must follow ISO 8601 (YYYY-MM-DD):
```yaml
✅ created_date: "2024-03-25"
❌ created_date: "25/03/2024"
❌ created_date: "2024-3-25"
```

Fields with `format: date-time` must include time:
```yaml
✅ decided_at: "2025-08-26T14:30:25.123Z"
❌ decided_at: "2025-08-26"
```

### Length Validation

Respect `minLength` and `maxLength`:
```yaml
# title: minLength: 10, maxLength: 200
✅ title: "Volume and Coupon Discount Rules"  # 34 characters
❌ title: "Discount"                          # 8 characters (too short)
❌ title: "Very long title that exceeds..."   # >200 characters
```

---

## 📚 Additional Resources

### Reference Documentation
- [Test Cases](./test-cases) - Valid and invalid examples
- [Patterns Reference](./patterns-reference) - Detailed regex explanations
- [Customization Guide](./customization-guide) - How to extend schemas

### External Links
- [JSON Schema Specification](https://json-schema.org/)
- [Understanding JSON Schema](https://json-schema.org/understanding-json-schema/)
- [Ajv Documentation](https://ajv.js.org/)

---

**💡 Tip:** Always validate your data against schemas before processing. This prevents runtime errors and ensures compatibility with the Matrix Protocol ecosystem.