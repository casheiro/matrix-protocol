---
title: "Uki Pay Idempotency Keys 011"
description: "Página wrapper para o asset YAML uki-pay-idempotency-keys-011.yaml"
layout: "docs"
sidebar: true
toc: true
navigation: true
---

> Source YAML: `pt/docs/examples/knowledge/structured/technical-patterns/uki-pay-idempotency-keys-011.yaml`

**Abrir no Visualizador:** [Uki Pay Idempotency Keys 011](/pt/docs/viewer?file=/docs/examples/knowledge/structured/technical-patterns/uki-pay-idempotency-keys-011.yaml)



```yaml
schema: "1.0"
ontology_reference: "moc:squad-payments:v1.0"
id: uki:squad-payments:technical_pattern:idempotency-keys-011
title: "Implementação de Chaves de Idempotência"
version: 1.4.0
created_date: 2024-03-25
last_modified: 2024-03-25
change_summary: "Extensão para PUT/PATCH operations e melhoria de cleanup"
change_impact: minor
previous_version: 1.3.0

scope_ref: squad-payments
domain_ref: technical
type_ref: pattern
maturity_ref: validated
status: active

content: |
  ## Conceito e Necessidade
  
  **Definição:** Idempotência garante que operações repetidas produzam o mesmo resultado
  **Crítico para:** Pagamentos, refunds, cancelamentos
  **Benefícios:** Prevenção de double-billing, retry safety, client reliability
  
  ## Header Implementation
  
  **Header name:** `Idempotency-Key`
  **Format:** UUID v4 (36 characters)
  **Generation:** Client-side responsibility
  **Example:** `Idempotency-Key: f47ac10b-58cc-4372-a567-0e02b2c3d479`
  
  ## Supported Operations
  
  ### POST /payments (Payment Creation)
  **Status:** ✅ Implemented
  **Storage:** 24 hours in Redis
  **Key pattern:** `idempotency:payments:{uuid}`
  **Response:** Cached response for duplicate requests
  
  ### POST /refunds (Refund Processing)  
  **Status:** ✅ Implemented
  **Storage:** 48 hours in Redis (longer for accounting)
  **Key pattern:** `idempotency:refunds:{uuid}`
  **Special handling:** Refund status tracking
  
  ### PUT /payments/{id} (Payment Updates)
  **Status:** 🚧 Partially implemented  
  **Storage:** 12 hours in Redis
  **Key pattern:** `idempotency:payment-updates:{payment_id}:{uuid}`
  **Note:** Only for status transitions
  
  ### PATCH operations
  **Status:** ❌ Not implemented
  **Priority:** Low (infrequent operations)
  **Plan:** Implement if demand increases
  
  ## Storage Strategy
  
  ### Redis Schema
  ```json
  {
    "key": "idempotency:payments:f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "value": {
      "request_hash": "sha256_of_request_body",
      "response": "cached_response_json",
      "status_code": 200,
      "created_at": "2024-03-25T10:30:00Z",
      "operation_type": "payment_creation"
    },
    "ttl": 86400
  }
  ```

  
  ### Request Hash Validation
  **Algorithm:** SHA-256 of request body
  **Purpose:** Detect conflicting operations with same idempotency key
  **Action:** Return 409 Conflict if hash differs
  
  ## Error Handling
  
  ### Missing Idempotency Key
  **POST operations:** Return 400 Bad Request
  **GET operations:** Not applicable (naturally idempotent)
  **Message:** "Idempotency-Key header required for this operation"
  
  ### Invalid Key Format
  **Validation:** UUID v4 format
  **Response:** 400 Bad Request
  **Message:** "Invalid idempotency key format. Use UUID v4."
  
  ### Key Conflict (Different Request Body)
  **Detection:** SHA-256 hash comparison
  **Response:** 409 Conflict  
  **Message:** "Idempotency key reused with different request parameters"
  
  ### Redis Unavailable
  **Fallback:** Process request without idempotency protection
  **Logging:** Log warning for monitoring
  **Alert:** Alert operations team for Redis health
  
  ## Cleanup and Maintenance
  
  ### Automatic Cleanup
  **Method:** Redis TTL expiration
  **Payment operations:** 24 hours
  **Refund operations:** 48 hours
  **Update operations:** 12 hours
  
  ### Manual Cleanup
  **Trigger:** Weekly maintenance window
  **Script:** Remove expired keys with pattern matching
  **Monitoring:** Track storage usage and cleanup efficiency
  
  ## Client Integration Guidelines
  
  ### Key Generation
  ```javascript
  // Client-side example
  function generateIdempotencyKey() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  ```

  
  ### Retry Strategy with Idempotency
  ```javascript
  const idempotencyKey = generateIdempotencyKey();
  
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch('/payments', {
        method: 'POST',
        headers: { 'Idempotency-Key': idempotencyKey },
        body: JSON.stringify(paymentData)
      });
      break; // Success
    } catch (networkError) {
      // Same key for all retries
    }
  }
  ```


examples:
  - input: "POST /payments com Idempotency-Key já usado, mesmo request body"
    output: "Return cached response 200 + original payment data"
  - input: "POST /payments com Idempotency-Key já usado, request body diferente"  
    output: "Return 409 Conflict: key conflict detected"
  - input: "Retry payment após timeout, mesmo Idempotency-Key"
    output: "Safe retry: return cached response se já processado"

related_to:
  - target: uki:squad-payments:technical_pattern:retry-strategy-008
    type: enables
    description: "Idempotência permite retry seguro de operações críticas"
  - target: uki:squad-payments:technical_pattern:webhook-handling-009
    type: relates_to
    description: "Deduplicação de webhook usa conceitos similares"
  - target: uki:squad-payments:procedure:monitoring-alerts-016
    type: relates_to
    description: "Conflitos de chave integrados ao monitoramento"

domain_of_influence: "engineering_teams"

```
