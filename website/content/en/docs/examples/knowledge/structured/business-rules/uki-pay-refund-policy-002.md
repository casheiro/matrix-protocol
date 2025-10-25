---
title: Uki Pay Refund Policy 002
description: Wrapper page for YAML asset uki-pay-refund-policy-002.yaml
icon: i-heroicons-code-bracket
layout: docs
sidebar: true
toc: true
navigation: true
lang: en
last_updated: 2025-10-21T00:00:00.000Z
order: 10
framework: general
tags:
  - examples
  - structured
  - business-rules
keywords:
  - Matrix Protocol
  - MEF
  - UKI
  - refund policy
  - payment processing
  - customer service
  - business rules
  - policy management
  - payment gateways
  - squad payments
---
> Source YAML: `en/docs/examples/knowledge/structured/business-rules/uki-pay-refund-policy-002.yaml`

**Open in Viewer:** [Uki Pay Refund Policy 002](/en/docs/viewer?file=/docs/examples/knowledge/structured/business-rules/uki-pay-refund-policy-002.yaml)

> 📄 Type: YAML • 📦 Size: 2.8 KB • 🕒 Last updated: 2025-10-12



```yaml

schema: "1.0"
ontology_reference: "moc:squad-payments:v1.0"
version: "3.0.0"

id: uki:squad-payments:business_rule:refund-policy-002
title: "Refund Policy and Deadlines"
scope_ref: squad-payments
scope_mode: "propagated"
domain_ref: business
type_ref: business_rule
maturity_ref: validated

created_date: 2024-03-25
last_modified: 2024-03-25
change_summary: "Unification of conflicting deadlines and SLA definition per gateway"
change_impact: major
status: active

content: |
  ## Refund Request Deadline
  
  **Unified standard:** 14 calendar days from purchase date
  **Justification:** Alignment with competition and UX improvement
  **Exceptions:**
  - VIP customer (loyalty program): 30 calendar days
  - Digital products: 7 calendar days (non-reversible)
  
  ## Refund Processing by Gateway
  
  **Stripe:**
  - SLA: 3-5 business days
  - Partial refund: allowed (maximum 1x per transaction)
  - Automation: < $100 (automatic), >= $100 (manual approval)
  
  **PayPal:**  
  - SLA: 2-3 business days
  - Partial refund: allowed (no quantity limit)
  - Automation: < $200 (automatic), >= $200 (manual approval)
  
  ## Business Rules
  
  **Mandatory manual approval:**
  - Values >= $1,000.00 (any gateway)
  - Multiple refunds same customer (> 3 per month)
  - Suspected fraud or historical chargeback
  
  **Proportional refund:**
  - When discount applied, refund considers original value
  - Shipping: refunded only on total refund
  - Convenience fee: not refunded
  
  ## Mandatory Validations
  
  - Verify transaction is within deadline
  - Confirm transaction was successfully captured
  - Validate no ongoing chargeback
  - Check available balance in gateway

examples:
  - input: "Purchase $800 with 10% discount, total refund after 10 days"
    output: "Approved: refund $800 (amount paid), deadline 3-5 days (Stripe)"
  - input: "VIP customer, purchase $1,200, refund after 20 days"
    output: "Approved: within 30-day VIP deadline, mandatory manual approval"
  - input: "Partial refund $50 from $150 purchase, PayPal"
    output: "Approved: automatic < $200, processing 2-3 days"

relationships:
  - type: relates_to
    target: uki:squad-payments:business_rule:discount-logic-001
    description: "Discount affects proportional refund calculation"
    
  - type: depends_on
    target: uki:squad-payments:technical_pattern:gateway-integration-007
    description: "Implementation depends on gateway-specific APIs"
    
  - type: relates_to
    target: uki:squad-payments:procedure:incident-response-014
    description: "Refund failures follow incident response process"

promotion:
  promotion_rationale: |
    Policy affects multiple squads (support, finance).
    Demonstrated organizational value and was validated by stakeholders.
    Candidate for promotion to tribe scope.

domain_of_influence: "engineering_teams"
```
