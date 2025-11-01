---
title: Referência de Patterns
description: Explicação técnica detalhada de todos os patterns regex dos schemas Matrix Protocol
icon: i-heroicons-code-bracket
layout: docs
sidebar: true
toc: true
navigation: true
lang: pt
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
  - validação
  - identificadores
  - format validation
---

# Referência de Patterns

**Explicação técnica completa de todos os patterns regex utilizados nos schemas do Matrix Protocol**

> 🎯 **Objetivo**: Documentar cada pattern regex, sua justificativa técnica e casos de uso no contexto do Matrix Protocol.

---

## 📊 Visão Geral dos Patterns

Os schemas do Matrix Protocol utilizam **238 patterns** distribuídos pelos 5 frameworks. Cada pattern foi projetado para:

✅ **Garantir consistência** - Formatos padronizados em todo o ecossistema  
✅ **Prevenir erros** - Validação rigorosa de entradas críticas  
✅ **Facilitar integração** - Patterns previsíveis e documentados  
✅ **Suportar evolução** - Versionamento e extensibilidade controlados  

---

## 🔍 Patterns por Categoria

### Identificadores Únicos

#### UKI (Units of Knowledge Interlinked)

**Pattern:** `^uki:[a-z0-9-]+:[a-z0-9_]+:[a-z0-9-]+$`

**Estrutura:** `uki:{scope_ref}:{type_ref}:{slug}`

**Justificativa:**
- **Namespace global**: Prefixo `uki:` evita colisões com outros sistemas
- **Escopo hierárquico**: `scope_ref` mapeia para estrutura organizacional MOC
- **Tipagem semântica**: `type_ref` categoriza o conhecimento (rule, pattern, policy, etc.)
- **Identificação única**: `slug` identifica a instância específica

**Componentes detalhados:**

| Componente | Pattern | Descrição | Exemplos |
|------------|---------|-----------|----------|
| `scope_ref` | `[a-z0-9-]+` | Referência organizacional (squad, tribe, org) | `squad-payments`, `tribe-platform`, `organization` |
| `type_ref` | `[a-z0-9_]+` | Tipo de conhecimento | `business_rule`, `pattern`, `guideline`, `policy` |
| `slug` | `[a-z0-9-]+` | Identificador específico | `discount-logic-001`, `authentication-jwt` |

**Exemplos válidos:**
```
uki:squad-payments:business_rule:discount-logic-001
uki:tribe-platform:pattern:authentication-jwt
uki:organization:policy:data-retention-gdpr
uki:squad-x:rule:validation-email-format
```

**Regras de negócio implementadas:**
- **Case sensitivity**: Minúsculo para evitar problemas de URL/filesystem
- **Caracteres seguros**: Apenas alpanuméricos e hífens para compatibilidade web
- **Hierarquia clara**: Estrutura de 4 níveis facilita navegação e organização
- **Extensibilidade**: Pattern suporta evolução organizacional

#### MAL Decision IDs

**Pattern:** `^mal-dec-[0-9]{8}-[a-z0-9]+-[0-9]+$`

**Estrutura:** `mal-dec-{YYYYMMDD}-{conflict_type}-{sequence}`

**Justificativa:**
- **Namespace MAL**: Prefixo `mal-dec-` identifica decisões do Matrix Arbiter Layer
- **Timestamp**: Data facilita auditoria e ordenação cronológica
- **Tipo de conflito**: `h1`, `h2`, `h3` ou identificadores alfanuméricos
- **Sequência**: Numeração única por dia para evitar colisões

**Componentes detalhados:**

| Componente | Pattern | Descrição | Exemplo |
|------------|---------|-----------|---------|
| Data | `[0-9]{8}` | YYYYMMDD formato | `20250826` |
| Tipo | `[a-z0-9]+` | Identificador do tipo de conflito | `h1`, `h2`, `h3`, `custom` |
| Sequência | `[0-9]+` | Número sequencial (sem zero à esquerda) | `001`, `042`, `100` |

**Exemplos válidos:**
```
mal-dec-20250826-h1-001    # Primeiro conflito H1 do dia
mal-dec-20250827-h2-042    # 42º conflito H2 do dia
mal-dec-20250828-custom-100  # 100º conflito custom do dia
```

#### MAL Event References

**Pattern:** `^mal-evt-[0-9]{8}-[0-9]+$`

**Estrutura:** `mal-evt-{YYYYMMDD}-{sequence}`

**Justificativa:**
- **Correlação**: Liga eventos de arbitragem a decisões
- **Rastreabilidade**: Permite auditoria completa do processo
- **Ordenação**: Data + sequência garante ordem cronológica

**Exemplos válidos:**
```
mal-evt-20250826-001    # Primeiro evento do dia
mal-evt-20250826-042    # 42º evento do dia
```

### Versionamento

#### Semantic Versioning

**Pattern:** `^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$`

**Justificativa:**
- **Padrão industrial**: Compatível com SemVer (semantic versioning)
- **Zero à esquerda proibido**: Evita ambiguidade (01.0.0 vs 1.0.0)
- **Três componentes**: MAJOR.MINOR.PATCH obrigatórios

**Componentes:**

| Componente | Pattern | Descrição | Quando incrementar |
|------------|---------|-----------|-------------------|
| MAJOR | `(0\|[1-9]\d*)` | Mudanças incompatíveis | Breaking changes |
| MINOR | `(0\|[1-9]\d*)` | Novas funcionalidades | Backward compatible |
| PATCH | `(0\|[1-9]\d*)` | Bug fixes | Backward compatible fixes |

**Exemplos válidos:**
```
1.0.0    # Release inicial
2.1.3    # Patch em minor release
0.5.0    # Versão pré-release
10.25.100 # Números altos suportados
```

**Exemplos inválidos:**
```
1.0      # Falta componente PATCH
01.0.0   # Zero à esquerda não permitido
1.0.0-beta # Sufixos não suportados neste pattern
v1.0.0   # Prefixos não suportados
```

#### Schema Version

**Pattern:** `^[0-9]+\.[0-9]+$`

**Justificativa:**
- **Simplicidade**: Apenas MAJOR.MINOR para schemas
- **Estabilidade**: Schemas têm evolução mais controlada que software
- **Compatibilidade**: Facilita migrations entre versões

**Exemplos válidos:**
```
1.0      # Schema inicial
1.1      # Minor update
2.0      # Major restructuring
```

### Identificadores de Processo

#### Persistence IDs (MEF)

**Pattern:** `^mef-dr-[0-9]{8}-[a-z0-9]{8}$`

**Estrutura:** `mef-dr-{YYYYMMDD}-{hash}`

**Justificativa:**
- **Namespace**: `mef-dr-` identifica Decision Records no MEF
- **Data**: Facilita particionamento e arquivamento
- **Hash**: 8 caracteres alfanuméricos para unicidade

#### MAL Versioning

**Pattern:** `^mal-v[0-9]+\.[0-9]+\.[0-9]+$`

**Estrutura:** `mal-v{MAJOR}.{MINOR}.{PATCH}`

**Justificativa:**
- **Rastreabilidade**: Cada decisão registra versão do MAL que a gerou
- **Auditoria**: Permite correlacionar comportamento com versão específica
- **Debugging**: Facilita identificação de bugs em versões específicas

### Checksums e Integridade

#### Checksum SHA-256

**Pattern:** `^[a-f0-9]{64}$`

**Justificativa:**
- **Integridade**: SHA-256 garante detecção de alterações
- **Padrão**: Hexadecimal lowercase é convenção estabelecida
- **Comprimento fixo**: 64 caracteres para SHA-256

**Exemplo:**
```
a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

### Referências Organizacionais

#### Scope References

**Pattern:** `^[a-z0-9-]+$`

**Justificativa:**
- **Hierarquia MOC**: Mapeia diretamente para nós organizacionais
- **URL-safe**: Compatível com sistemas web e APIs
- **Legibilidade**: Formato human-readable

**Exemplos:**
```
organization        # Nível mais alto
tribe-platform     # Tribe específica
squad-payments      # Squad específica
team-backend-api    # Granularidade adicional
```

#### Domain References

**Pattern:** `^[a-z0-9-]+$`

**Justificativa:**
- **Categorização**: Classifica conhecimento por domínio
- **Governança**: Facilita aplicação de políticas por domínio
- **Busca**: Permite filtros eficientes

**Domínios comuns:**
```
business        # Regras de negócio
technical       # Padrões técnicos
security        # Políticas de segurança
compliance      # Requisitos regulatórios
operational     # Procedimentos operacionais
```

#### Type References

**Pattern:** `^[a-z0-9_]+$`

**Justificativa:**
- **Tipagem semântica**: Classifica natureza do conhecimento
- **Underscores permitidos**: Convenção para tipos compostos
- **Extensibilidade**: Organizações podem definir tipos customizados

**Tipos padrão:**
```
business_rule    # Regras de negócio
pattern          # Padrões arquiteturais
guideline        # Diretrizes
policy           # Políticas corporativas
procedure        # Procedimentos
standard         # Padrões técnicos
```

### Formatos de Data e Tempo

#### Date Format (ISO 8601)

**Format:** `date`

**Pattern implícito:** `YYYY-MM-DD`

**Justificativa:**
- **Padrão internacional**: ISO 8601 é universalmente aceito
- **Ordenação**: Formato permite ordenação lexicográfica
- **Parsing**: Suportado nativamente em todas as linguagens

#### DateTime Format (ISO 8601)

**Format:** `date-time`

**Pattern implícito:** `YYYY-MM-DDTHH:mm:ss.sssZ`

**Justificativa:**
- **Precisão**: Milissegundos para audit trails
- **Timezone**: UTC (Z) evita ambiguidades
- **Interoperabilidade**: Padrão para APIs REST

---

## 🏗️ Arquitetura dos Patterns

### Princípios de Design

#### 1. Hierarchical Composition
Patterns seguem hierarquia organizacional:
```
uki:organization:policy:data-governance
    └─ organization (scope)
       └─ policy (type)
          └─ data-governance (specific instance)
```

#### 2. Temporal Anchoring
Identificadores incluem timestamps:
```
mal-dec-20250826-h1-001
        └─ 20250826 (YYYYMMDD)
```

#### 3. Type Safety
Cada pattern enforce um tipo específico:
```
^uki:           # Força namespace UKI
^mal-dec-       # Força namespace MAL Decision
^mef-dr-        # Força namespace MEF Decision Record
```

#### 4. Evolution Support
Patterns suportam extensibilidade:
```
[a-z0-9-]+      # Permite novos valores
[0-9]+\.[0-9]+  # Suporte a versioning
```

### Validação Estratificada

#### Nível 1: Sintática
- **Formato**: Pattern regex básico
- **Comprimento**: minLength/maxLength
- **Caracteres**: Conjunto permitido

#### Nível 2: Semântica
- **Referências**: scope_ref existe no MOC
- **Versionamento**: version >= previous_version
- **Relacionamentos**: target UKIs existem

#### Nível 3: Negócio
- **Autorização**: User pode criar no scope
- **Políticas**: Compliance com regras organizacionais
- **Workflow**: Estado permite operação

---

## 🔧 Casos de Uso por Framework

### MEF (Matrix Embedding Framework)

**Patterns críticos:**
- **UKI IDs**: Identificação única de conhecimento
- **Versioning**: Evolução controlada de UKIs
- **References**: Links entre UKIs

**Cenário típico:**
```yaml
id: "uki:squad-payments:business_rule:discount-logic-v2"
version: "2.1.0"
previous_version: "2.0.3"
relationships:
  - target: "uki:org:policy:pricing-standards"
```

### ZOF (Zion Orchestration Framework)

**Patterns críticos:**
- **Workflow IDs**: Identificação de workflows
- **Step IDs**: Identificação de etapas
- **Service refs**: Referências a serviços

**Cenário típico:**
```yaml
id: "zof-wf-onboarding-premium-v3"
steps:
  - step_id: "kyc_verification"
    automation_config:
      service: "kyc_service_v2"
```

### OIF (Operator Intelligence Framework)

**Patterns críticos:**
- **Archetype IDs**: Identificação de archetypes
- **Capability IDs**: Identificação de capacidades
- **Tool references**: Referências a ferramentas

### MOC (Matrix Ontology Catalog)

**Patterns críticos:**
- **Hierarchy IDs**: Identificação de hierarquias
- **Node IDs**: Identificação de nós
- **Relationship types**: Tipos de relacionamento

### MAL (Matrix Arbiter Layer)

**Patterns críticos:**
- **Decision IDs**: Identificação única de decisões
- **Event references**: Referências a eventos de arbitragem
- **Precedence rules**: Identificação de regras

---

## 📚 Referência Rápida de Patterns

### Identificadores Principais

| Pattern | Uso | Exemplo |
|---------|-----|---------|
| `^uki:[a-z0-9-]+:[a-z0-9_]+:[a-z0-9-]+$` | UKI IDs | `uki:squad-x:rule:data-retention` |
| `^mal-dec-[0-9]{8}-[a-z0-9]+-[0-9]+$` | MAL Decisions | `mal-dec-20250826-h1-001` |
| `^mal-evt-[0-9]{8}-[0-9]+$` | MAL Events | `mal-evt-20250826-001` |
| `^mef-dr-[0-9]{8}-[a-z0-9]{8}$` | MEF Records | `mef-dr-20250826-a1b2c3d4` |

### Versionamento

| Pattern | Uso | Exemplo |
|---------|-----|---------|
| `^(0\|[1-9]\d*)\.(0\|[1-9]\d*)\.(0\|[1-9]\d*)$` | Semantic Versioning | `2.1.3` |
| `^[0-9]+\.[0-9]+$` | Schema Versioning | `1.0` |
| `^mal-v[0-9]+\.[0-9]+\.[0-9]+$` | MAL Versioning | `mal-v1.0.0` |

### Referências

| Pattern | Uso | Exemplo |
|---------|-----|---------|
| `^[a-z0-9-]+$` | Scope/Domain refs | `squad-payments` |
| `^[a-z0-9_]+$` | Type refs | `business_rule` |
| `^[a-f0-9]{64}$` | SHA-256 checksums | `a1b2c3d4...` |

---

## 🛠️ Implementação e Debugging

### Testando Patterns

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

**🔍 Para mais informações:**
- [Guia de Uso](./schema-usage-guide) - Como implementar validação
- [Casos de Teste](./test-cases) - Exemplos válidos e inválidos
- [Guia de Customização](./customization-guide) - Como estender patterns