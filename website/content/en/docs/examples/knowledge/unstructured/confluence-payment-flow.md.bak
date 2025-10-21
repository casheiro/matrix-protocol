---
title: Payment Flow - Squad Wiki
description: "[CHAOTIC EXAMPLE] Outdated internal wiki documentation about payment flows"
icon: i-heroicons-document
layout: docs
sidebar: true
toc: false
navigation: false
lang: en
last_updated: 2025-10-21
---
# Payment Flow - Squad Wiki

*Last updated: March 2022*  
*Author: Pedro Silva (no longer with the company)*  

## Overview

This document describes the complete payment flow of the platform.

**⚠️ WARNING: This document may be outdated**

## Available Gateways

1. **PagSeguro** (main until Nov/2022)
2. **Mercado Pago** (backup)
3. **Stripe** (pilot - digital products only)

### Gateway Configurations

```

PagSeguro:
- Endpoint: https://ws.pagseguro.uol.com.br/v2/
- Timeout: 30s
- Retry: 3x
- Sandbox: https://ws.sandbox.pagseguro.uol.com.br/v2/

Mercado Pago:
- [Broken documentation link]
```


## Checkout Flow

1. Customer selects products
2. System calculates shipping (Correios integration)
3. Apply discount (if any)
4. Redirect to gateway
5. Payment processing
6. Webhook confirmation
7. Order update

![Flow Diagram](./images/payment-flow-2022.png) *(image not found)*

## Discount Rules

### Volume Discount
- Purchases > R$ 500: 5% discount  
- Purchases > R$ 1000: 10% discount
- Purchases > R$ 2000: 15% discount (maximum)

### Coupons
- PRIMEIRA coupon: 20% first purchase
- VOLTA coupon: 10% returning customer  
- AMIGO coupon: 5% friend referral

**Important:** Coupons don't stack with volume discounts

## Fraud Detection

Basic system implemented:
- IP geolocation (block risky countries)
- CPF validation (Federal Revenue integration - **API discontinued**)
- Behavioral analysis (more than 5 attempts = suspicious)

### Blocked Countries
- Nigeria
- Venezuela  
- Russia (added Feb/2022 due to conflict)

## Monitoring

Dashboard available at: http://internal-dash.company.com/payments *(link no longer works)*

Important metrics:
- Checkout conversion rate
- Gateway response time
- Transaction volume per hour
- Monthly chargebacks

## Important Contacts

- PagSeguro Support: suporte@pagseguro.com (old email)
- MP Account Manager: jose.silva@mercadopago.com (person left company)
- Fraud Team: fraud@company.com *(email no longer exists)*

## TODOs (never completed)

- [ ] Implement intelligent retry by gateway
- [ ] Improve audit logs  
- [ ] Create automatic SLA alerts
- [ ] Document reconciliation process
- [ ] Update PagSeguro SDK (2018 version!)

---
*This document is maintained by the Payments Squad. Contact us with questions.*