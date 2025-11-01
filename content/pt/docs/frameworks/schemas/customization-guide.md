---
title: Guia de Customização de Schemas
description: Como estender e customizar os schemas Matrix Protocol mantendo compatibilidade e governança
icon: i-heroicons-cog-6-tooth
layout: docs
sidebar: true
toc: true
navigation: true
lang: pt
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
  - customização schemas
  - extensibilidade
  - governança
  - validação personalizada
---

# Guia de Customização de Schemas

**Como estender e personalizar os schemas Matrix Protocol mantendo compatibilidade, governança e consistência organizacional**

> 🎯 **Objetivo**: Fornecer estratégias práticas para customizar schemas do Matrix Protocol de acordo com necessidades organizacionais específicas, sem comprometer a interoperabilidade.

---

## 🎨 Filosofia de Customização

### Princípios Fundamentais

#### 1. Compatibility First
✅ **Extensões devem ser aditivas** - Nunca remover campos obrigatórios  
✅ **Retrocompatibilidade** - Schemas anteriores devem continuar válidos  
✅ **Interoperabilidade** - Dados devem funcionar em outras implementações  

#### 2. Governed Evolution  
✅ **Versionamento controlado** - Mudanças seguem semantic versioning  
✅ **Documentação obrigatória** - Justificativa para cada customização  
✅ **Review process** - Aprovação de mudanças por comitê técnico  

#### 3. Organizational Context
✅ **Necessidades específicas** - Customizações atendem casos de uso reais  
✅ **Governança corporativa** - Alinhamento com políticas organizacionais  
✅ **Compliance** - Atendimento a requisitos regulatórios  

---

## 🛠️ Estratégias de Customização

### Nível 1: Extensão de Propriedades

**Cenário**: Adicionar campos específicos sem alterar core

**Exemplo - MEF UKI com campos corporativos:**
```json
{
  "$schema": "https://matrix-protocol.org/schemas/mef/uki/1.0.0",
  "id": "uki:squad-payments:business_rule:discount-logic-001",
  
  // Campos padrão Matrix Protocol
  "title": "Volume and Coupon Discount Rules",
  "version": "1.0.0",
  "scope_ref": "squad-payments",
  "status": "active",
  
  // EXTENSÕES ORGANIZACIONAIS
  "x-corporate": {
    "compliance_status": "sox_reviewed",
    "risk_level": "low",
    "business_owner": "payments-team",
    "review_cycle": "quarterly",
    "regulatory_tags": ["pci-dss", "gdpr"],
    "cost_center": "CC-PAY-001"
  },
  
  // Metadados adicionais
  "x-metadata": {
    "created_by": "user@company.com",
    "approved_by": "manager@company.com",
    "environment": "production",
    "deployment_date": "2024-03-25T14:30:00Z"
  }
}
```

**Implementação no Schema:**
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

### Nível 2: Patterns Organizacionais

**Cenário**: Customizar patterns para estrutura organizacional específica

**Exemplo - UKI IDs com estrutura corporativa:**
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
# Estrutura organizacional
org:                    # Nível corporativo
  div-technology:       # Divisão de tecnologia
    dept-platform:      # Departamento de plataforma
    dept-data:          # Departamento de dados
  div-business:         # Divisão de negócio
    dept-payments:      # Departamento de pagamentos
    dept-logistics:     # Departamento de logística
```

### Nível 3: Tipos Customizados

**Cenário**: Definir novos tipos de conhecimento organizacional

**Exemplo - type_ref estendido:**
```json
{
  "type_ref": {
    "pattern": "^[a-z0-9_]+$",
    "enum": [
      // Tipos padrão Matrix Protocol
      "business_rule", "pattern", "guideline", "policy",
      
      // TIPOS ORGANIZACIONAIS CUSTOMIZADOS
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

### Nível 4: Workflows Especializados

**Cenário**: ZOF workflows para processos organizacionais específicos

**Exemplo - Workflow de Compliance:**
```yaml
schema: "1.0"
id: "zof-wf-compliance-review-v1"
title: "Compliance Review Workflow"
framework: "ZOF"

# CUSTOMIZAÇÃO: Estados específicos de compliance
states:
  - state_id: "submitted"
    state_name: "Submetido para Revisão"
    x-compliance:
      required_reviewers: ["compliance-officer", "legal-counsel"]
      sla_hours: 72
      
  - state_id: "sox_review"
    state_name: "Revisão SOX"
    x-compliance:
      required_certifications: ["sox_reviewer"]
      documentation_required: true
      
  - state_id: "risk_assessment"
    state_name: "Avaliação de Risco"
    x-compliance:
      risk_categories: ["operational", "financial", "reputational"]
      impact_threshold: "medium"

# CUSTOMIZAÇÃO: Transições com validações específicas
transitions:
  - from_state: "submitted"
    to_state: "sox_review"
    conditions:
      x-validation:
        compliance_fields: ["risk_level", "business_owner"]
        mandatory_attachments: ["business_justification", "risk_matrix"]
```

---

## 🔧 Padrões de Implementação

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

**Extended schema (Organizacional):**
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

**Validação em camadas:**
```javascript
// Camada 1: Validação padrão Matrix Protocol
const matrixValidate = ajv.compile(matrixSchema)

// Camada 2: Validação organizacional
const corporateValidate = ajv.compile(corporateSchema)

// Camada 3: Validação de negócio
function validateBusinessRules(data) {
  const errors = []
  
  // Regra: UKIs críticas precisam de aprovação dupla
  if (data['x-corporate']?.business_criticality === 'critical') {
    if (!data['x-corporate']?.dual_approval) {
      errors.push('Critical UKIs require dual approval')
    }
  }
  
  // Regra: Compliance status deve estar alinhado com risk level
  const compliance = data['x-corporate']?.compliance_status
  const risk = data['x-corporate']?.risk_level
  
  if (compliance === 'approved' && risk === 'high') {
    errors.push('High risk items cannot be approved without mitigation plan')
  }
  
  return errors
}

// Validação completa
function validateUKI(data) {
  // 1. Validação estrutural
  if (!matrixValidate(data)) {
    return { valid: false, errors: matrixValidate.errors, layer: 'matrix' }
  }
  
  // 2. Validação organizacional
  if (!corporateValidate(data)) {
    return { valid: false, errors: corporateValidate.errors, layer: 'corporate' }
  }
  
  // 3. Validação de negócio
  const businessErrors = validateBusinessRules(data)
  if (businessErrors.length > 0) {
    return { valid: false, errors: businessErrors, layer: 'business' }
  }
  
  return { valid: true }
}
```

---

## 🏛️ Governança de Customizações

### Estrutura de Aprovação

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
    minor_extension:      # Adicionar campos opcionais
      required: ["technical_review"]
      
    pattern_modification: # Alterar patterns existentes
      required: ["technical_review", "business_review"]
      
    major_restructure:    # Mudanças estruturais significativas
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
  notice_period: "6_months"      # Aviso mínimo antes de remoção
  support_period: "12_months"    # Suporte paralelo a versões antigas
  
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

## 🚀 Casos de Uso Avançados

### Multi-Tenant Schemas

**Cenário**: SaaS platform com múltiplas organizações

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

**Cenário**: GDPR/LGPD compliance tracking

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

**Cenário**: Rastreamento de integrações entre sistemas

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

## 📋 Checklist de Customização

### Antes de Customizar

- [ ] **Necessidade validada**: Caso de uso real documentado
- [ ] **Alternativas avaliadas**: Configuração vs. extensão vs. novo schema
- [ ] **Impacto mapeado**: Sistemas afetados identificados
- [ ] **Stakeholders alinhados**: Business, Tech, Compliance aprovaram

### Durante a Customização

- [ ] **Compatibilidade preservada**: Schema base permanece válido
- [ ] **Naming conventions**: Prefixo `x-` para extensões
- [ ] **Documentação atualizada**: Explicação das mudanças
- [ ] **Testes criados**: Casos válidos e inválidos testados

### Após a Customização

- [ ] **Validação completa**: Todos os casos de uso funcionando
- [ ] **Performance testada**: Impacto na validação medido
- [ ] **Rollback preparado**: Plano de reversão documentado
- [ ] **Equipes treinadas**: Desenvolvedores sabem usar as extensões

---

## 🔍 Troubleshooting Avançado

### Schema Resolution Issues

**Problema**: Referencias entre schemas customizados

```javascript
// ❌ ERRADO: Referência quebrada
{
  "$ref": "https://matrix-protocol.org/schemas/mef/uki/1.0.0#/definitions/scope_ref"
}

// ✅ CORRETO: Referência resolvida
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

**Problema**: Schemas complexos causam lentidão

```javascript
// Otimização: Cache de schemas compilados
const schemaCache = new Map()

function getCompiledSchema(schemaId) {
  if (!schemaCache.has(schemaId)) {
    const schema = loadSchema(schemaId)
    const compiled = ajv.compile(schema)
    schemaCache.set(schemaId, compiled)
  }
  return schemaCache.get(schemaId)
}

// Otimização: Validação estratificada
function validateOptimized(data, schemaStack) {
  // Validar primeiro os schemas mais restritivos
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

**Problema**: Migrar dados para novo schema

```javascript
// Migration function exemplo
function migrateUKIToV2(ukiV1Data) {
  const ukiV2Data = {
    ...ukiV1Data,
    schema: "2.0", // Bump schema version
    
    // Migrar campos reestruturados
    organizational_context: {
      scope_ref: ukiV1Data.scope_ref,
      business_owner: ukiV1Data.owner || "unassigned",
      criticality: ukiV1Data.priority === "high" ? "critical" : "normal"
    },
    
    // Remover campos obsoletos
    owner: undefined,
    priority: undefined
  }
  
  // Limpar campos undefined
  return JSON.parse(JSON.stringify(ukiV2Data))
}

// Batch migration com validação
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

## 📚 Recursos e Referências

### Templates Prontos

**Corporate UKI Schema**: `/templates/corporate-uki-schema.json`  
**Multi-tenant Extension**: `/templates/multi-tenant-extension.json`  
**Compliance Schema**: `/templates/compliance-schema.json`  
**Integration Metadata**: `/templates/integration-metadata.json`  

### Ferramentas Recomendadas

**Schema Design**:
- [JSON Schema Tool](https://jsonschema.net/) - Visual schema builder
- [Altova XMLSpy](https://www.altova.com/) - Professional schema editor

**Validation Libraries**:
- **JavaScript**: `ajv` com `ajv-formats`
- **Python**: `jsonschema` com `jsonschema[format]`
- **Java**: `networknt/json-schema-validator`
- **Go**: `xeipuuv/gojsonschema`

**Testing Tools**:
- [Schema Test Suite](https://github.com/json-schema-org/JSON-Schema-Test-Suite)
- [Hypothesis](https://hypothesis.readthedocs.io/) para property-based testing

### Best Practices Reference

- [JSON Schema Best Practices](https://json-schema.org/understanding-json-schema/structuring.html)
- [Schema Versioning Guide](https://json-schema.org/draft/2019-09/json-schema-core.html#rfc.section.8.1.1)
- [Performance Optimization](https://ajv.js.org/guide/managing-schemas.html#performance)

---

**💡 Dica**: Comece sempre com extensões mínimas e evolua gradualmente. A complexidade excessiva no schema pode impactar performance e manutenibilidade.

**🔗 Próximos passos**: Consulte o [Guia de Uso](./schema-usage-guide) para implementar validação ou os [Casos de Teste](./test-cases) para exemplos práticos.