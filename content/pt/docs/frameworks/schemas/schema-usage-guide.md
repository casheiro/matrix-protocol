---
title: Guia de Uso dos Schemas YAML
description: Como integrar e usar os schemas JSON do Matrix Protocol em seus projetos
icon: i-heroicons-document-check
layout: docs
sidebar: true
toc: true
navigation: true
lang: pt
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
  - schemas YAML
  - validação JSON
  - implementação
  - MEF ZOF OIF MOC MAL
---

# Guia de Uso dos Schemas YAML

**Como integrar e validar os schemas JSON do Matrix Protocol em qualquer linguagem**

> 🎯 **Objetivo**: Fornecer tudo que você precisa para implementar validação robusta dos schemas do Matrix Protocol em seus projetos.

---

## 🔍 Introdução aos Schemas

Os schemas do Matrix Protocol são especificações [JSON Schema](https://json-schema.org/) que definem a estrutura e validação para cada componente dos 5 frameworks:

- **MEF** (Matrix Embedding Framework): UKIs e Decision Records
- **ZOF** (Zion Orchestration Framework): Workflows e State Transitions  
- **OIF** (Operator Intelligence Framework): Archetypes e Explanations
- **MOC** (Matrix Ontology Catalog): Hierarchies e Policies
- **MAL** (Matrix Arbiter Layer): Decision Records e Events

### Por que JSON Schema?

✅ **Padrão universal** - Suportado em todas as linguagens modernas  
✅ **Validação robusta** - Patterns, tipos, formatos e regras customizadas  
✅ **Documentação automática** - Schemas servem como documentação  
✅ **Evolução controlada** - Versionamento e compatibilidade garantidos  

---

## 🚀 Integração Rápida

### Acessando os Schemas

Todos os schemas estão disponíveis via HTTP em URLs padronizadas:

```
https://matrix-protocol.org/schemas/{framework}/{type}/{version}
```

**Exemplos:**
- `https://matrix-protocol.org/schemas/mef/uki/1.0.0`
- `https://matrix-protocol.org/schemas/zof/workflow/1.0.0`
- `https://matrix-protocol.org/schemas/mal/decision-record/1.0.0`

### Mapeamento Framework → Tipos

| Framework | Tipos Disponíveis |
|-----------|-------------------|
| **MEF** | `uki`, `decision-record` |
| **ZOF** | `workflow`, `state-transition`, `enrichment-evaluation` |
| **OIF** | `archetype`, `arbitration-explanation` |
| **MOC** | `hierarchy`, `evaluation-criteria`, `arbitration-policies` |
| **MAL** | `decision-record`, `arbitration-event` |

---

## 💻 Implementação por Linguagem

### JavaScript/Node.js

**Instalação:**
```bash
npm install ajv ajv-formats
```

**Exemplo completo:**
```javascript
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

// Configurar validador
const ajv = new Ajv({ allErrors: true })
addFormats(ajv)

// Carregar schema
const schemaUrl = 'https://matrix-protocol.org/schemas/mef/uki/1.0.0'
const schemaResponse = await fetch(schemaUrl)
const schema = await schemaResponse.json()

// Compilar validador
const validate = ajv.compile(schema)

// Validar dados
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
  console.log('✅ UKI válida!')
} else {
  console.log('❌ Erros de validação:')
  console.log(validate.errors)
}
```

### Python

**Instalação:**
```bash
pip install jsonschema requests
```

**Exemplo completo:**
```python
import requests
from jsonschema import validate, ValidationError

# Carregar schema
schema_url = 'https://matrix-protocol.org/schemas/mef/uki/1.0.0'
schema_response = requests.get(schema_url)
schema = schema_response.json()

# Dados para validar
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

# Validar
try:
    validate(instance=uki_data, schema=schema)
    print("✅ UKI válida!")
except ValidationError as e:
    print(f"❌ Erro de validação: {e.message}")
    print(f"📍 Caminho: {'.'.join(str(p) for p in e.path)}")
```

### Go

**Instalação:**
```bash
go get github.com/xeipuuv/gojsonschema
```

**Exemplo completo:**
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
    // Carregar schema
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
    
    // Preparar validação
    schemaLoader := gojsonschema.NewBytesLoader(schemaBytes)
    
    // Dados para validar
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
    
    // Validar
    result, err := gojsonschema.Validate(schemaLoader, documentLoader)
    if err != nil {
        panic(err)
    }
    
    if result.Valid() {
        fmt.Println("✅ UKI válida!")
    } else {
        fmt.Println("❌ Erros de validação:")
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

**Exemplo completo:**
```rust
use jsonschema::{JSONSchema, ValidationError};
use serde_json::{json, Value};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Carregar schema
    let schema_url = "https://matrix-protocol.org/schemas/mef/uki/1.0.0";
    let schema_value: Value = reqwest::get(schema_url)
        .await?
        .json()
        .await?;
    
    // Compilar schema
    let compiled = JSONSchema::compile(&schema_value)
        .expect("Schema inválido");
    
    // Dados para validar
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
    
    // Validar
    match compiled.validate(&uki_data) {
        Ok(_) => println!("✅ UKI válida!"),
        Err(errors) => {
            println!("❌ Erros de validação:");
            for error in errors {
                println!("- {}", error);
            }
        }
    }
    
    Ok(())
}
```

---

## 🔍 Patterns Complexos Explicados

### Identificadores UKI

**Pattern:** `^uki:[a-z0-9-]+:[a-z0-9_]+:[a-z0-9-]+$`

**Estrutura:** `uki:{scope_ref}:{type_ref}:{slug}`

**Exemplos válidos:**
```yaml
✅ uki:squad-payments:business_rule:discount-logic-001
✅ uki:tribe-platform:pattern:authentication-jwt
✅ uki:organization:policy:data-retention-gdpr
```

**Exemplos inválidos:**
```yaml
❌ uki:Squad-Payments:business_rule:discount  # Maiúscula no scope
❌ uki:squad-payments:BusinessRule:discount   # Maiúscula no type
❌ uki:squad_payments:business-rule:discount  # Underscore no scope
```

### Versionamento Semântico

**Pattern:** `^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$`

**Exemplos válidos:**
```yaml
✅ 1.0.0    # Release inicial
✅ 2.1.3    # Patch em minor release
✅ 0.5.0    # Versão beta
```

**Exemplos inválidos:**
```yaml
❌ 1.0      # Falta patch version
❌ 01.0.0   # Zero à esquerda
❌ 1.0.0-beta  # Sufixo não permitido
```

### IDs de Decisão MAL

**Pattern:** `^mal-dec-[0-9]{8}-[a-z0-9]+-[0-9]+$`

**Estrutura:** `mal-dec-{YYYYMMDD}-{conflict_type}-{sequence}`

**Exemplos válidos:**
```yaml
✅ mal-dec-20250826-h1-001     # Conflito H1
✅ mal-dec-20250827-h2-042     # Conflito H2, 42ª decisão
✅ mal-dec-20250828-h3-100     # Conflito H3, 100ª decisão
```

---

## 🛠️ Troubleshooting

### Erros Comuns

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

**Solução:** Verifique se o ID segue exatamente o formato `uki:scope:type:slug` com caracteres em minúsculo.

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

**Solução:** Adicione a propriedade obrigatória faltante.

#### 3. **Enum Value Invalid**
```json
{
  "instancePath": "/status",
  "schemaPath": "#/properties/status/enum",
  "keyword": "enum",
  "params": {"allowedValues": ["active", "deprecated", "archived", "sunset"]},
  "message": "must be equal to one of the allowed values"
}
```

**Solução:** Use apenas valores permitidos no enum.

### Validação de Datas

Campos `format: date` devem seguir ISO 8601 (YYYY-MM-DD):
```yaml
✅ created_date: "2024-03-25"
❌ created_date: "25/03/2024"
❌ created_date: "2024-3-25"
```

Campos `format: date-time` devem incluir horário:
```yaml
✅ decided_at: "2025-08-26T14:30:25.123Z"
❌ decided_at: "2025-08-26"
```

### Validação de Comprimento

Respeite `minLength` e `maxLength`:
```yaml
# title: minLength: 10, maxLength: 200
✅ title: "Volume and Coupon Discount Rules"  # 34 caracteres
❌ title: "Discount"                          # 8 caracteres (muito curto)
❌ title: "Very long title that exceeds..."   # >200 caracteres
```

---

## 📚 Recursos Adicionais

### Documentação de Referência
- [Casos de Teste](./test-cases) - Exemplos válidos e inválidos
- [Referência de Patterns](./patterns-reference) - Explicação detalhada de regex
- [Guia de Customização](./customization-guide) - Como estender schemas

### Links Externos
- [JSON Schema Specification](https://json-schema.org/)
- [Understanding JSON Schema](https://json-schema.org/understanding-json-schema/)
- [Ajv Documentation](https://ajv.js.org/)

---

**💡 Dica:** Sempre valide seus dados contra os schemas antes de processar. Isso previne erros runtime e garante compatibilidade com o ecossistema Matrix Protocol.