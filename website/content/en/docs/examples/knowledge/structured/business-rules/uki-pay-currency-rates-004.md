---
title: "Uki Pay Currency Rates 004"
description: "Wrapper page for YAML asset uki-pay-currency-rates-004.yaml"
layout: "docs"
sidebar: true
toc: true
navigation: true
---

> Source YAML: `en/docs/examples/knowledge/structured/business-rules/uki-pay-currency-rates-004.yaml`

**Open in Viewer:** [Uki Pay Currency Rates 004](/en/docs/viewer?file=/docs/examples/knowledge/structured/business-rules/uki-pay-currency-rates-004.yaml)



```yaml
schema: "1.0"
ontology_reference: "moc:squad-payments:v1.0"
version: "1.5.0"

id: uki:squad-payments:business_rule:currency-conversion-004
title: "Currency Conversion and Exchange Rate Rules"
scope_ref: squad-payments
scope_mode: "propagated"
domain_ref: business
type_ref: business_rule
maturity_ref: draft

created_date: 2024-03-25
last_modified: 2024-03-25
change_summary: "Definition of fallback and tolerances for unstable exchange rate API"
change_impact: minor
status: active

content: |
  ## Supported Currencies
  
  **Primary:** BRL (Brazilian Real)
  **Accepted Secondary:**
  - USD (US Dollar)  
  - EUR (Euro)
  - GBP (British Pound)
  
  ## Exchange Rate Source
  
  **Primary:** exchangerate-api.io (commercial API)
  **Backup:** Fixed rate updated weekly
  **Update frequency:** Every 1 hour during business hours
  
  ## Fallback Rules
  
  **API unavailable or timeout:**
  - EUR → BRL: 6.20 (conservative rate)
  - USD → BRL: 5.10 (conservative rate)  
  - GBP → BRL: 6.80 (conservative rate)
  
  **Suspicious variation (> 5% in 1 hour):**
  - Use previous rate until manual validation
  - Automatic alert to finance team
  - Detailed variation log for audit
  
  ## Cache and Performance
  
  **Cache TTL:** 60 minutes
  **Redis key:** "currency_rate_{from}_{to}_{date}"
  **Invalidation:** Manual via admin endpoint or automatic by timeout
  
  ## Tolerances and Margins
  
  **Safety margin:** 2% over obtained rate
  **Justification:** Coverage for fluctuation during processing
  **Rounding:** Always up, 2 decimal places
  
  ## Mandatory Validations
  
  - Rate cannot be zero or negative
  - Maximum variation 10% from previous rate (automatic block)
  - Rate date cannot be > 24h old
  - Log all conversions for financial audit

examples:
  - input: "Purchase €100, API rate 6.15, margin 2%"
    output: "Charge: R$ 628.30 (€100 × 6.15 × 1.02)"
  - input: "API timeout, purchase €50, fallback rate"
    output: "Charge: R$ 316.00 (€50 × 6.20, fallback + log alert)"
  - input: "Suspicious rate: EUR 8.50 (previous 6.15)"
    output: "Block: 38% variation > 10% threshold, use previous rate"

relationships:
  - type: implements
    target: uki:squad-payments:procedure:monitoring-alerts-016
    description: "External API integration pattern for exchange rates"
    
  - type: depends_on
    target: uki:squad-payments:technical_pattern:gateway-integration-007
    description: "Redis cache strategy for performance"
    
  - type: relates_to
    target: uki:squad-payments:procedure:monitoring-alerts-016
    description: "Suspicious rate alerts integrated with monitoring"

promotion:
  promotion_rationale: |
    Conversion rules can benefit other squads (marketplace, subscriptions).
    Demonstrated stability and was validated in production environment.

domain_of_influence: "engineering_teams"
```
