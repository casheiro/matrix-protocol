---
title: Uki Pay Chargeback Rules 006
description: Wrapper page for YAML asset uki-pay-chargeback-rules-006.yaml
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
  - UKI
  - chargeback management
  - payment disputes
  - fraud prevention
  - business rules
---
> Source YAML: `en/docs/examples/knowledge/structured/business-rules/uki-pay-chargeback-rules-006.yaml`

**Open in Viewer:** [Uki Pay Chargeback Rules 006](/en/docs/viewer?file=/docs/examples/knowledge/structured/business-rules/uki-pay-chargeback-rules-006.yaml)

> 📄 Type: YAML • 📦 Size: 3.8 KB • 🕒 Last updated: 2025-10-12



```yaml

schema: "1.0"
ontology_reference: "moc:squad-payments:v1.0"
version: "0.0.1-beta"

id: uki:squad-payments:business_rule:chargeback-management-006
title: "Chargeback and Dispute Management"
scope_ref: squad-payments
scope_mode: "propagated"
domain_ref: business
type_ref: business_rule
maturity_ref: draft

created_date: 2024-03-25
last_modified: 2024-03-25
change_summary: "Initial creation based on real cases and industry best practices"
change_impact: major
status: active

content: |
  ## Definitions and Types
  
  **Chargeback:** Dispute initiated by cardholder with issuing bank
  **Common Reason Codes:**
  - Fraud (4840): Transaction not authorized by cardholder
  - Processing Error (4855): Duplication or processing error
  - Consumer Dispute (4853): Customer does not recognize transaction
  - Authorization (4808): Inadequate authorization
  
  ## Response Timeframes
  
  **First contestation:** 7 calendar days for response
  **Pre-arbitration:** 10 calendar days for counter-argument  
  **Arbitration:** 15 calendar days (additional $500 fee)
  **Documentation:** Must be complete and in English for international cards
  
  ## Acceptable Chargeback Rate
  
  **Organizational target:** < 0.8% of monthly volume
  **Alert threshold:** 0.6% (intensive monitoring)
  **Consequences > 1.0%:**
  - Mandatory fraud process review
  - Possible gateway fee increases
  - Detailed transaction analysis by category
  
  ## Defense Strategies
  
  **Mandatory documentation:**
  - Proof of delivery (tracking)
  - Purchase IP and geolocation
  - CVV and AVS match results
  - Customer communication history
  - Order confirmation screenshots
  
  **Viability analysis:**
  - Value < $18: evaluate cost-benefit of contestation
  - Value > $90: always contest with complete documentation
  - Fraud claims: maximum priority in defense
  
  ## Proactive Prevention
  
  **Clear communication:**
  - Card descriptor must be recognizable
  - Detailed confirmation email
  - Proactive delivery status
  - Responsive customer service for questions
  
  **Data for retention:**
  - Authentication logs for 24 months
  - Geolocation data for 18 months
  - Customer communications for 12 months
  - Delivery proofs for 6 months after sale
  
  ## Contestation Process
  
  **1. Receipt (Day 0):**
  - Automatic team notification
  - Initial case analysis
  - Separation by reason code
  
  **2. Investigation (Day 1-3):**
  - Documentation collection
  - Viability analysis
  - Defense preparation
  
  **3. Submission (Day 4-6):**
  - Document upload
  - Structured argumentation
  - Gateway follow-up

examples:
  - input: "Chargeback $145 - Reason Code 4840 (fraud), customer denies purchase"
    output: "Mandatory defense: document IP, CVV match, delivery history, 7-day deadline"
  - input: "Chargeback $8 - Processing Error, duplication confirmed"
    output: "Accept: defense cost > transaction value, fix internal process"
  - input: "Monthly rate 0.7%, 15 chargebacks of 2000 transactions"  
    output: "Alert: above 0.6% threshold, review fraud prevention"

relationships:
  - type: complements
    target: uki:squad-payments:business_rule:fraud-thresholds-003
    description: "Fraud prevention reduces chargebacks from unauthorized transactions"
    
  - type: relates_to
    target: uki:squad-payments:procedure:incident-response-014
    description: "Mass chargeback follows incident response process"
    
  - type: relates_to
    target: uki:squad-payments:business_rule:fee-calculation-005
    description: "Chargeback costs impact internal fee calculation"

promotion:
  promotion_rationale: |
    Chargeback management affects customer service, legal and finance teams.
    Demonstrated cross-functional value and was validated by stakeholders.
    Candidate for organizational promotion.

domain_of_influence: "engineering_teams"
```
