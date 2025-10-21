---
title: Business Rules MEF
description: UKIs structured containing fundamental business rules following MEF
  v1.0.0 specification
icon: i-heroicons-building-office
layout: docs
sidebar: true
toc: true
navigation: true
lang: en
last_updated: 2025-10-21
order: 0
---
# Business Rules MEF

UKIs structured containing fundamental business rules following MEF v1.0.0 specification, demonstrating how organizational business logic transforms from scattered policies into governed knowledge units.

## 📊 Business Context Overview

### Squad Payments - E-commerce Business Rules

This section contains **6 compliant business rule UKIs** from the Example E-commerce Company, showing how critical business decisions get structured into traceable, versionable knowledge units with proper governance and relationships.

### Organizational Scope:
- **Domain**: Business rules and policies
- **Authority**: Product managers and business analysts
- **Maturity Range**: Draft → Validated → Approved
- **Governance**: MOC-controlled validation and review processes

## 📋 Available Business Rules UKIs

### 💰 Financial Rules
1. **[discount-logic-001](uki-pay-discount-logic-001.md)** - Volume and coupon discount calculations
2. **[fee-calculation-005](uki-pay-fee-calculation-005.md)** - Commission and transaction fee structures
3. **[refund-policy-003](uki-pay-refund-policy-003.yaml)** - Customer refund processing guidelines

### 🔐 Security & Validation Rules  
4. **[fraud-detection-002](uki-pay-fraud-detection-002.yaml)** - Payment security and risk assessment
5. **[customer-validation-004](uki-pay-customer-validation-004.yaml)** - Identity verification requirements
6. **[payment-processing-006](uki-pay-payment-processing-006.yaml)** - Core payment workflow business logic

## 🔗 Demonstrated Relationships

### Business Logic Interconnections:
- **Fee Calculation** `implements` Discount Logic - Commission calculation considers applied discounts
- **Payment Processing** `depends_on` Customer Validation - Payments require validated customers
- **Fraud Detection** `precedes` Payment Processing - Security checks happen before processing
- **Refund Policy** `overrides` Fee Calculation - Special fee handling for refunds

### MOC Governance Integration:
- **scope_ref**: `squad-payments` - All rules scoped to payments team
- **domain_ref**: `business` - Business domain with product manager authority
- **type_ref**: `business_rule` - Standardized business rule template requirements
- **maturity_ref**: Range from `draft` to `validated` showing evolution

## ✅ MEF Compliance Demonstrated

### Required MEF v1.0.0 Fields:
- ✅ **Complete Frontmatter** - Schema version, ontology reference, versioning
- ✅ **MOC References** - All `*_ref` fields point to organizational taxonomy
- ✅ **Semantic Versioning** - MAJOR.MINOR.PATCH with change impact tracking
- ✅ **Mandatory Examples** - Real scenario inputs and expected outputs
- ✅ **Relationship Mapping** - Standard relationship types with target UKIs

### Knowledge Evolution Tracking:
- ✅ **Change Summary** - What changed in each version
- ✅ **Change Impact** - Whether change is major/minor/patch
- ✅ **Lifecycle Status** - Active, deprecated, or archived state
- ✅ **Creation Metadata** - Dates, modification tracking, authority records

## 🎯 Business Value Demonstrated

### From Scattered Policies to Governed Rules:
- **Before**: Contradictory policies in emails, meetings, and legacy documents
- **After**: Authoritative UKIs with clear ownership, versioning, and relationships
- **Result**: Consistent business decisions backed by traceable knowledge

### Concrete Benefits Shown:
- 🎯 **Decision Consistency** - All discount calculations follow same validated logic
- 📈 **Policy Evolution** - Business rules can evolve with proper change justification
- ⚖️ **Conflict Resolution** - MAL arbitration when business rules conflict
- 🔍 **Audit Trail** - Complete history of business rule changes for compliance

## 🎯 How to Navigate

1. **Read UKI Structure** - Notice MEF v1.0.0 compliance in each file
2. **Study Relationships** - See how business rules interconnect logically
3. **Check MOC References** - Understand organizational governance context
4. **Compare Versions** - Notice semantic versioning and change tracking
5. **Analyze Examples** - Real scenarios showing rule application

### Analysis Tips:
- Each UKI shows complete business rule documentation
- Relationships reflect real business logic dependencies
- Maturity levels show organizational confidence in rules
- Examples provide concrete validation scenarios

## 📖 Related Resources

- [Technical Patterns](../technical-patterns/) - Implementation patterns for these business rules
- [Procedures](../procedures/) - Operational procedures implementing these rules
- [moc-squad-payments.yaml](../../moc-squad-payments.md) - Organizational governance foundation
- [Unstructured Examples](../../unstructured/) - Original chaotic business rule sources

### Implementation Resources:
- **[Basic Templates](../../../../manual/templates/basic/)** - Simple business rule templates
- **[Enterprise Templates](../../../../manual/templates/enterprise/)** - Complex governance business rules
- **[MEF Framework](../../../../frameworks/mef/)** - Complete knowledge structuring specification
- **[Validation Tools](../../../../manual/tools/)** - UKI compliance checking tools

---

> 💡 **Tip**: These business rules show how organizational policies transform from scattered decisions into governed knowledge. Each UKI can be independently versioned, validated, and referenced by other organizational knowledge or system implementations.