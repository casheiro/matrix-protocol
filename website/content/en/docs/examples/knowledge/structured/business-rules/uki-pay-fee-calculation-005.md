---
title: "Uki Pay Fee Calculation 005"
description: "Wrapper page for YAML asset uki-pay-fee-calculation-005.yaml"
layout: "docs"
sidebar: true
toc: true
navigation: true
---

> Source YAML: `en/docs/examples/knowledge/structured/business-rules/uki-pay-fee-calculation-005.yaml`

**Open in Viewer:** [Uki Pay Fee Calculation 005](/en/docs/viewer?file=/docs/examples/knowledge/structured/business-rules/uki-pay-fee-calculation-005.yaml)



```yaml
schema: "1.0"
ontology_reference: "moc:squad-payments:v1.0"
version: "1.2.0"

id: uki:squad-payments:business_rule:fee-calculation-005
title: "Fee Calculation by Gateway and Method"
scope_ref: squad-payments
scope_mode: "restricted"
domain_ref: business
type_ref: business_rule
maturity_ref: draft

created_date: 2024-03-25
last_modified: 2024-03-25
change_summary: "Addition of PIX method and review of negotiated rates"
change_impact: minor
status: active

content: |
  ## Fees by Gateway
  
  ### Stripe
  **Credit card:** 3.99% + $0.07 per transaction
  **Debit card:** 2.99% + $0.07 per transaction  
  **PIX:** 0.99% (no fixed fee)
  **International:** 4.99% + $0.07 + IOF
  
  ### PayPal  
  **Credit card:** 4.49% + $0.11 per transaction
  **Debit card:** 3.49% + $0.11 per transaction
  **PayPal balance:** 3.19% + $0.11 per transaction
  **International:** 5.49% + $0.11 + IOF
  
  ## Customer Pass-through
  
  **Current policy:** Fees absorbed by company (not passed through)
  **Exception:** International transactions (IOF passed through)
  **Justification:** UX improvement and competitiveness
  
  ## Limits and Special Conditions
  
  **PIX (Stripe only):**
  - Minimum limit: $0.90
  - Maximum limit: $900 per transaction
  - Available: 24/7 including weekends
  
  **Installments:**
  - Stripe: up to 12x interest-free (company absorbs)
  - PayPal: up to 6x interest-free
  - Customer interest: from 13th installment (2.99% p.m.)
  
  ## MDR Calculation (Merchant Discount Rate)
  
  **Formula:** (Transaction_Value × Percentage) + Fixed_Fee
  **Rounding:** Always up, 2 decimal places
  **Early settlement:** Available with additional 2.5% p.m. fee
  
  ## Internal Costs (not customer)
  
  **Chargeback:**
  - Stripe: $12 per occurrence
  - PayPal: $8 per occurrence  
  - Coverage: fraud insurance covers up to $1,800/month
  
  **Refund:**
  - Gateway fee is not refunded
  - Internal processing: no additional cost

examples:
  - input: "Purchase $90 credit card via Stripe"
    output: "Fee: $3.66 ($90 × 3.99% + $0.07), customer pays $90"
  - input: "PIX $36 via Stripe"  
    output: "Fee: $0.36 ($36 × 0.99%), customer pays $36"
  - input: "International purchase $100 via PayPal"
    output: "Fee: $5.60 + IOF, customer pays $100 + IOF"

relationships:
  - type: relates_to
    target: uki:squad-payments:business_rule:currency-conversion-004
    description: "Currency conversion affects international fee calculation"
    
  - type: depends_on
    target: uki:squad-payments:technical_pattern:gateway-integration-007
    description: "Technical implementation of calculations by gateway"
    
  - type: relates_to
    target: uki:squad-payments:business_rule:refund-policy-002
    description: "Refund policy considers that fees are not refunded"

domain_of_influence: "engineering_teams"
```
