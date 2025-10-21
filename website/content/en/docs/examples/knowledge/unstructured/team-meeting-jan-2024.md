---
title: Payments Squad Meeting Minutes - January 2024
description: "[CHAOTIC EXAMPLE] Formal meeting minutes with contradictory decisions"
icon: i-heroicons-document
layout: docs
sidebar: true
toc: false
navigation: false
lang: en
last_updated: 2025-10-21
---
# Payments Squad Meeting Minutes - January 2024

**Date:** 01/15/2024  
**Participants:** João (Tech Lead), Maria (PO), Pedro (Senior Dev), Ana (QA), Carlos (DevOps)  
**Duration:** 1h30min  

## Decisions Made

### Main Payment Gateway
After analyzing available options, we decided to adopt **Stripe** as the main gateway for the following reasons:
- More robust API
- Better documentation
- Support for more countries
- Competitive rates

**Responsible:** Pedro  
**Deadline:** End of February  

### Refund Policy
- Refunds processed in **up to 7 business days**
- Amounts above R$ 1000 need manual approval
- Partial refund allowed only once per order

### Fraud Detection
Implement basic rules:
- Transactions above R$ 5000 → manual review
- More than 3 different cards on same IP in 1 hour → block
- Invalid CVV 2x in a row → flag as suspicious

## Pending Items
- [ ] Define chargeback flow
- [ ] Review PCI compliance configurations
- [ ] Create monitoring dashboard

## Next Meeting
Date: 02/12/2024  
Agenda: Stripe implementation review