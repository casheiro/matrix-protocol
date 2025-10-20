---
title: "Uki Pay Retry Strategy 008"
description: "Página wrapper para o asset YAML uki-pay-retry-strategy-008.yaml"
layout: "docs"
sidebar: true
toc: true
navigation: true
---

> Source YAML: `pt/docs/examples/knowledge/structured/technical-patterns/uki-pay-retry-strategy-008.yaml`

**Abrir no Visualizador:** [Uki Pay Retry Strategy 008](/pt/docs/viewer?file=/docs/examples/knowledge/structured/technical-patterns/uki-pay-retry-strategy-008.yaml)

> 📄 Tipo: YAML • 📦 Tamanho: 4.4 KB • 🕒 Última modificação: 2025-10-10



```yaml
schema: "1.0"
ontology_reference: "moc:squad-payments:v1.0"
id: uki:squad-payments:technical_pattern:retry-strategy-008
title: "Estratégia de Retry para Operações de Pagamento"
version: 1.3.0
created_date: 2024-03-25
last_modified: 2024-03-25
change_summary: "Refinamento baseado em análise de tipos de erro e customer impact"
change_impact: minor
previous_version: 1.2.0

scope_ref: squad-payments
domain_ref: technical
type_ref: pattern
maturity_ref: validated
status: active

content: |
  ## Classificação de Operações
  
  **Idempotent operations:**
  - Payment authorization (com idempotency key)
  - Payment status inquiry
  - Refund processing
  - Webhook validation
  
  **Non-idempotent operations:**  
  - Payment capture (apenas 1 tentativa)
  - Customer registration
  - Webhook processing (depende de implementação)
  
  ## Retry Policy por Tipo de Erro
  
  ### Network/Infrastructure Errors
  **Errors:** IOException, SocketTimeoutException, ConnectException
  **Policy:** Exponential backoff with jitter
  - Attempts: 3
  - Base delay: 1000ms
  - Multiplier: 2.0  
  - Max delay: 30000ms
  - Jitter: ±25%
  
  ### HTTP 5xx Server Errors
  **Errors:** 500, 502, 503, 504
  **Policy:** Linear backoff with longer delays
  - Attempts: 3
  - Delays: [2000ms, 5000ms, 10000ms]
  - Condition: Only for GET operations
  
  ### Rate Limiting (429)
  **Policy:** Respect Retry-After header
  - Attempts: 5
  - Delay: Parse Retry-After header or default 30s
  - Max wait: 300s (5 minutes)
  - Exponential backoff if no header
  
  ### Client Errors (4xx) - NO RETRY
  **Errors:** 400, 401, 403, 404, 422
  **Policy:** Immediate failure
  **Rationale:** Client errors unlikely to resolve with retry
  
  ## Implementation Pattern
  
  ```java
  @Retryable(
    value = {IOException.class, HttpServerErrorException.class},
    maxAttempts = 3,
    backoff = @Backoff(delay = 1000, multiplier = 2.0)
  )
  public PaymentResponse processPayment(PaymentRequest request) {
    // Implementation with idempotency key
  }
  
  @Recover
  public PaymentResponse recover(Exception ex, PaymentRequest request) {
    // Fallback: try secondary gateway or manual queue
  }
  ```

  
  ## Circuit Breaker Integration
  
  **Precedence:** Circuit breaker check antes do retry
  **Open circuit:** Skip retry, fail fast
  **Half-open:** Allow retry para test requests
  **Closed:** Normal retry behavior
  
  ## Idempotency Key Strategy
  
  **Generation:** UUID v4 per operation attempt
  **Persistence:** 24 hours in Redis
  **Key format:** "idempotency:{gateway}:{operation}:{uuid}"
  **Validation:** Server-side validation by gateway
  
  ## Monitoring and Alerting
  
  **Métricas por operação:**
  - Retry attempt distribution (1st, 2nd, 3rd attempt success)
  - Total retry rate per operation type
  - Average retry delay
  - Operations requiring fallback to manual queue
  
  **Alertas:**
  - Retry rate > 20% sustained → Investigation needed
  - Operations in manual queue > 50 → Process bottleneck
  - Idempotency key conflicts > 1% → Potential bug
  
  ## Fallback Strategies
  
  **Payment authorization failure:**
  1. Retry with secondary gateway (if available)
  2. Queue for manual processing
  3. Notify customer of delay
  
  **Refund failure:**
  1. Retry with exponential backoff
  2. Manual finance team intervention
  3. Customer service notification
  
  **Webhook delivery failure:**
  1. Retry with increasing delays up to 24h
  2. Dead letter queue after max attempts
  3. Manual reconciliation process

examples:
  - input: "Payment auth IOException, 1st attempt fails"
    output: "Retry after 1000ms jitter, same idempotency key, log attempt #2"
  - input: "Stripe returns 429, Retry-After: 60"
    output: "Wait 60 seconds, retry with same parameters, max 5 attempts"
  - input: "PayPal 422 validation error on payment"
    output: "No retry, immediate failure, log client error for debugging"

related_to:
  - target: uki:squad-payments:technical_pattern:gateway-integration-007
    type: complements
    description: "Retry strategy integra com circuit breaker do padrão de gateway"
  - target: uki:squad-payments:technical_pattern:idempotency-keys-011
    type: depends_on
    description: "Retry seguro depende de implementação correta de idempotência"
  - target: uki:squad-payments:procedure:monitoring-alerts-016
    type: relates_to
    description: "Métricas de retry integradas ao monitoramento geral"

domain_of_influence: "engineering_teams"

```
