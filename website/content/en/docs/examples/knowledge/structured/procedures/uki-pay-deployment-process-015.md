---
title: "Uki Pay Deployment Process 015"
description: "Wrapper page for YAML asset uki-pay-deployment-process-015.yaml"
layout: "docs"
sidebar: true
toc: true
navigation: true
---

> Source YAML: `en/docs/examples/knowledge/structured/procedures/uki-pay-deployment-process-015.yaml`

**Open in Viewer:** [Uki Pay Deployment Process 015](/en/docs/viewer?file=/docs/examples/knowledge/structured/procedures/uki-pay-deployment-process-015.yaml)

> 📄 Type: YAML • 📦 Size: 6.6 KB • 🕒 Last updated: 2025-10-12



```yaml
schema: "1.0"
ontology_reference: "moc:squad-payments:v1.0"
id: uki:squad-payments:procedure:deployment-process-015
title: "Secure Deployment Process for Payment Systems"
version: 1.8.0
created_date: 2024-03-25
last_modified: 2024-03-25
change_summary: "Addition of PCI validation and security gates based on compliance"
change_impact: minor
previous_version: 1.7.0

scope_ref: squad-payments
domain_ref: technical
type_ref: procedure
maturity_ref: validated
status: active

content: |
  ## Environments and Pipeline
  
  ### Environment Staging
  **Development → QA → Staging → Production**
  
  **Development:**
  - Automatic deploy on commit to `develop`
  - No approval gates
  - Synthetic data only
  
  **QA:**  
  - Manual deploy via CI/CD pipeline
  - Mandatory automated tests
  - Functionality validation
  
  **Staging:**
  - Deploy with Tech Lead approval
  - Mandatory performance testing
  - PCI compliance validation
  
  **Production:**
  - Deploy with dual approval (Tech Lead + PO)
  - Mandatory change window
  - Documented rollback plan
  
  ## Quality Gates
  
  ### Automated Quality Gates
  **Unit Tests:**
  - Minimum coverage: 80%
  - Payment-related code: 95%
  - Zero failing tests
  
  **Integration Tests:**
  - Gateway connectivity tests
  - Database transaction tests  
  - End-to-end payment flows
  
  **Security Scans:**
  - SAST: Static Application Security Testing
  - Dependency vulnerability scanning
  - Secret detection (no hardcoded credentials)
  
  ### Manual Quality Gates
  **Code Review:**
  - Minimum 2 approvals for payment-related changes
  - Security-focused review for sensitive operations
  - Performance impact assessment
  
  **QA Validation:**
  - Functional testing on QA environment
  - Regression testing for critical flows
  - Security testing for authentication/authorization
  
  ## Change Windows and Restrictions
  
  ### Production Deployment Windows
  **Allowed:**
  - Tuesday-Thursday: 10:00-16:00 EST
  - Emergency deployments: Any time with incident justification
  
  **Blocked:**  
  - Friday afternoons (high impact, low support)
  - Monday mornings (system instability risk)
  - Holidays and known high-traffic events
  - During maintenance windows
  
  ### Emergency Deployment Process
  **Trigger conditions:**
  - P0 incident resolution
  - Security vulnerability fix
  - Critical business impact > $9K/day
  
  **Approval process:**
  - Incident Commander approval
  - CTO notification (for revenue impact)
  - Accelerated testing (minimum viable)
  
  ## Deployment Strategy
  
  ### Blue-Green Deployment
  **Implementation:**
  - Maintain two identical production environments
  - Deploy to inactive environment (green)
  - Validate functionality before traffic switch
  - Instant rollback capability
  
  **Validation steps:**
  ```bash
  # Health check validation
  curl -f https://payments-green.internal/health
  
  # Database connectivity
  curl -f https://payments-green.internal/health/db
  
  # Gateway connectivity  
  curl -f https://payments-green.internal/health/gateways
  
  # Sample transaction test
  curl -X POST https://payments-green.internal/test/transaction
  ```

  
  ### Canary Release (High-risk changes)
  **Traffic distribution:**
  - 5% traffic for 30 minutes
  - 25% traffic for 1 hour
  - 50% traffic for 2 hours
  - 100% traffic if metrics stable
  
  **Monitoring during canary:**
  - Error rate comparison (new vs old)
  - Latency percentile analysis
  - Business metrics validation
  - Customer complaint monitoring
  
  ## Rollback Procedures
  
  ### Automatic Rollback Triggers
  - Error rate > 10% for 5 minutes
  - Latency p95 > 10 seconds sustained
  - Health check failures > 3 consecutive
  - Circuit breaker activation
  
  ### Manual Rollback Decision
  **Decision makers:**
  - Tech Lead (business hours)
  - On-call engineer (after hours)
  - Incident Commander (during incidents)
  
  **Rollback execution:**
  ```bash
  # Blue-green rollback (instant)
  kubectl patch service payments-service -p '{"spec":{"selector":{"version":"blue"}}}'
  
  # Database rollback (if schema changes)
  flyway undo -target=previous_version
  
  # Cache invalidation (if needed)
  redis-cli FLUSHDB
  ```

  
  ## PCI Compliance Validation
  
  ### Pre-deployment Security Checklist
  - [ ] No sensitive data in logs
  - [ ] Secrets managed via environment variables
  - [ ] TLS 1.3 configuration validated
  - [ ] Security headers properly configured
  - [ ] Access controls reviewed
  
  ### Compliance Documentation
  **Required artifacts:**
  - Change request with business justification
  - Security impact assessment
  - Testing evidence (screenshots/reports)
  - Rollback plan documentation
  - Post-deployment validation results
  
  ## Monitoring and Validation
  
  ### Post-deployment Monitoring (24 hours)
  **Business metrics:**
  - Transaction success rate
  - Revenue per hour comparison
  - Customer service ticket volume
  - Chargeback rate monitoring
  
  **Technical metrics:**
  - Application performance (CPU, memory)
  - Database connection pool utilization
  - Gateway response times
  - Error log analysis
  
  ### Success Criteria
  **Must achieve within 2 hours post-deployment:**
  - Error rate < 2% (baseline)
  - Latency p95 < 5 seconds
  - Transaction success rate > 98%
  - No critical alerts triggered
  
  ## Team Responsibilities
  
  ### Developer
  - Code quality and testing
  - Documentation updates
  - Local validation before push
  
  ### QA Engineer  
  - Test case execution
  - Regression testing
  - Performance validation
  
  ### DevOps Engineer
  - Pipeline maintenance
  - Infrastructure monitoring
  - Rollback execution if needed
  
  ### Tech Lead
  - Deployment approval
  - Risk assessment
  - Go/no-go decisions

examples:
  - input: "Hotfix deploy for critical CVV validation bug, Friday 6PM"
    output: "Emergency deployment approved: P1 incident + security fix justifies exception"
  - input: "Normal feature deploy, 15% error rate after 10 minutes"
    output: "Automatic rollback triggered: error rate > 10% for > 5 minutes"
  - input: "Canary release 5% traffic, p95 latency doubled but no errors"
    output: "Hold canary: investigate latency issue before expanding traffic"

related_to:
  - target: uki:squad-payments:procedure:pci-compliance-013
    type: implements
    description: "Deploy process implements mandatory PCI compliance validations"
  - target: uki:squad-payments:procedure:incident-response-014
    type: relates_to
    description: "Deploy failures follow incident response process"
  - target: uki:squad-payments:procedure:monitoring-alerts-016
    type: depends_on
    description: "Deploy validation depends on monitoring metrics"

domain_of_influence: "engineering_teams"
```
