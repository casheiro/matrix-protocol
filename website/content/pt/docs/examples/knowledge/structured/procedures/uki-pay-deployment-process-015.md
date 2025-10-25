---
title: Uki Pay Deployment Process 015
description: Página wrapper para o asset YAML uki-pay-deployment-process-015.yaml
icon: i-heroicons-code-bracket
layout: docs
sidebar: true
toc: true
navigation: true
lang: pt
last_updated: 2025-10-21T00:00:00.000Z
order: 10
framework: general
tags:
  - examples
  - structured
  - procedures
keywords:
  - Matrix Protocol
  - MEF
  - UKI
  - deployment process
  - blue-green deployment
  - canary release
  - rollback procedures
  - quality gates
  - change windows
  - PCI validation
  - emergency deployment
  - squad payments
---
> Source YAML: `pt/docs/examples/knowledge/structured/procedures/uki-pay-deployment-process-015.yaml`

**Abrir no Visualizador:** [Uki Pay Deployment Process 015](/pt/docs/viewer?file=/docs/examples/knowledge/structured/procedures/uki-pay-deployment-process-015.yaml)

> 📄 Tipo: YAML • 📦 Tamanho: 6.7 KB • 🕒 Última modificação: 2025-10-10



```yaml

schema: "1.0"
ontology_reference: "moc:squad-payments:v1.0"
id: uki:squad-payments:procedure:deployment-process-015
title: "Processo de Deploy Seguro para Sistema de Pagamentos"
version: 1.8.0
created_date: 2024-03-25
last_modified: 2024-03-25
change_summary: "Adição de validação PCI e gates de segurança baseados em compliance"
change_impact: minor
previous_version: 1.7.0

scope_ref: squad-payments
domain_ref: technical
type_ref: procedure
maturity_ref: validated
status: active

content: |
  ## Ambientes e Pipeline
  
  ### Staging de Ambientes
  **Development → QA → Staging → Production**
  
  **Development:**
  - Deploy automático on commit to `develop`
  - Sem gates de aprovação
  - Dados sintéticos apenas
  
  **QA:**  
  - Deploy manual via CI/CD pipeline
  - Testes automatizados obrigatórios
  - Validação de funcionalidade
  
  **Staging:**
  - Deploy com aprovação do Tech Lead
  - Performance testing obrigatório
  - PCI compliance validation
  
  **Production:**
  - Deploy com aprovação dupla (Tech Lead + PO)
  - Change window obrigatório
  - Rollback plan documentado
  
  ## Gates de Qualidade
  
  ### Automated Quality Gates
  **Unit Tests:**
  - Coverage mínimo: 80%
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
  
  ## Change Windows e Restrictions
  
  ### Production Deployment Windows
  **Allowed:**
  - Tuesday-Thursday: 10:00-16:00 BRT
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
  - Critical business impact > R$ 50K/day
  
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
  - input: "Deploy de hotfix para bug crítico de CVV validation, sexta 18:00"
    output: "Emergency deployment aprovado: P1 incident + security fix justifica exceção"
  - input: "Deploy normal feature nova, erro rate 15% após 10 minutos"
    output: "Automatic rollback triggered: erro rate > 10% por > 5 minutos"
  - input: "Canary release 5% traffic, latency p95 dobrou mas sem errors"
    output: "Hold canary: investigate latency issue before expanding traffic"

related_to:
  - target: uki:squad-payments:procedure:pci-compliance-013
    type: implements
    description: "Deploy process implementa validações obrigatórias de PCI compliance"
  - target: uki:squad-payments:procedure:incident-response-014
    type: relates_to
    description: "Deploy failures seguem processo de incident response"
  - target: uki:squad-payments:procedure:monitoring-alerts-016
    type: depends_on
    description: "Deploy validation depende de métricas de monitoramento"

domain_of_influence: "engineering_teams"

```
