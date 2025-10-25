---
title: Uki Pay Fraud Thresholds 003
description: Wrapper page for YAML asset uki-pay-fraud-thresholds-003.yaml
icon: i-heroicons-code-bracket
layout: docs
sidebar: true
toc: true
navigation: true
lang: en
last_updated: 2025-10-21T00:00:00.000Z
order: 10
framework: general
keywords:
  - Matrix Protocol
  - examples
  - use cases
  - knowledge
  - structured
  - business rules
  - UKI
---
> Source YAML: `en/docs/examples/knowledge/structured/business-rules/uki-pay-fraud-thresholds-003.yaml`

**Open in Viewer:** [Uki Pay Fraud Thresholds 003](/en/docs/viewer?file=/docs/examples/knowledge/structured/business-rules/uki-pay-fraud-thresholds-003.yaml)

> 📄 Type: YAML • 📦 Size: 2.9 KB • 🕒 Last updated: 2025-10-12



```yaml

schema: "1.0"
ontology_reference: "moc:squad-payments:v1.0"
version: "2.2.0"

id: uki:squad-payments:business_rule:fraud-thresholds-003
title: "Fraud Detection Thresholds and Rules"
scope_ref: squad-payments
scope_mode: "restricted"
domain_ref: business
type_ref: business_rule
maturity_ref: validated

created_date: 2024-03-25
last_modified: 2024-03-25
change_summary: "Threshold adjustment based on false positive analysis"
change_impact: minor
status: active

content: |
  ## Value Threshold for Manual Review
  
  **Current value:** $630
  **Justification:** Balance between friction and security based on 3-month analysis
  **Exceptions:**
  - Recurring customer (> 5 approved purchases): $900
  - VIP customer (loyalty program): $1,350
  
  ## Behavioral Rules
  
  **Multiple attempts:**
  - 3+ different cards on same IP in 1 hour: temporary block
  - 5+ failed payment attempts: flag as suspicious
  - Same card attempted on 3+ different IPs in 30min: manual review
  
  **Data validation:**
  - Obviously invalid CVV: block (000, 111, 222, etc.)
  - Same card with name variations: flag
  - Billing vs. shipping address in different countries: manual review
  
  ## Geographic Rules
  
  **Blocked IPs by country:**
  - High-risk countries defined by compliance sector
  - Exception: customer with approved history can override
  
  **Location velocity:**
  - Same account with purchases in cities > 300mi in < 2h: flag
  
  ## Escalation Matrix
  
  **Automatic (no intervention):**
  - Transaction below threshold + basic validations OK
  
  **Flagging (log + monitoring):**
  - Suspicious behavior but below critical threshold
  - Customer with positive history
  
  **Manual review (mandatory approval):**
  - Above value threshold
  - 2+ behavioral rules violated
  - First purchase from customer with suspicious data
  
  **Automatic block:**
  - 3+ critical rules violated simultaneously
  - Country on blacklist without exception
  - Obviously invalid CVV or data

examples:
  - input: "Transaction $720, new customer, Brazil IP, consistent data"
    output: "Manual review: above $630 threshold + new customer"
  - input: "Transaction $360, recurring customer, 4th purchase this month"
    output: "Automatic approval: below threshold + trusted customer"
  - input: "Transaction $144, 3 different cards, same IP, 30min"
    output: "Temporary block: suspicious multiple attempts"

relationships:
  - type: implements
    target: uki:squad-payments:technical_pattern:error-handling-012
    description: "Technical system implements these business rules"
    
  - type: relates_to
    target: uki:squad-payments:procedure:incident-response-014
    description: "Confirmed fraud cases follow incident process"
    
  - type: complements
    target: uki:squad-payments:business_rule:chargeback-management-006
    description: "Fraud prevention complements chargeback management"

domain_of_influence: "engineering_teams"
```
