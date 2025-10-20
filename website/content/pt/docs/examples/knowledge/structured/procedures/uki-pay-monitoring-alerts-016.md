---
title: "Uki Pay Monitoring Alerts 016"
description: "Página wrapper para o asset YAML uki-pay-monitoring-alerts-016.yaml"
layout: "docs"
sidebar: true
toc: true
navigation: true
---

> Source YAML: `pt/docs/examples/knowledge/structured/procedures/uki-pay-monitoring-alerts-016.yaml`

**Abrir no Visualizador:** [Uki Pay Monitoring Alerts 016](/pt/docs/viewer?file=/docs/examples/knowledge/structured/procedures/uki-pay-monitoring-alerts-016.yaml)



```yaml
schema: "1.0"
ontology_reference: "moc:squad-payments:v1.0"
id: uki:squad-payments:procedure:monitoring-alerts-016
title: "Configuração de Monitoramento e Alertas"
version: 1.6.0
created_date: 2024-03-25
last_modified: 2024-03-25
change_summary: "Refinamento de thresholds baseado em análise de falsos positivos"
change_impact: minor
previous_version: 1.5.0

scope_ref: squad-payments
domain_ref: technical
type_ref: procedure
maturity_ref: validated
status: active

content: |
  ## Métricas Críticas de Negócio
  
  ### Payment Success Rate
  **Métrica:** `(successful_payments / total_payment_attempts) * 100`
  **Baseline:** 98.5%
  **Alert thresholds:**
  - Warning: < 97% por 5 minutos → Slack #alerts
  - Critical: < 95% por 2 minutos → PagerDuty
  
  ### Revenue per Hour
  **Métrica:** `sum(successful_payment_amounts) / hour`
  **Baseline:** Média das últimas 4 semanas, mesmo dia/hora
  **Alert thresholds:**
  - Warning: < 70% baseline por 30 minutos → Slack
  - Critical: < 50% baseline por 15 minutos → PagerDuty
  
  ### Gateway Availability
  **Métrica:** `successful_gateway_requests / total_gateway_requests`
  **Per gateway monitoring (Stripe, PayPal)**
  **Alert thresholds:**
  - Warning: < 99% por 5 minutos → Slack
  - Critical: < 95% por 2 minutos → PagerDuty + SMS
  
  ## Métricas Técnicas de Performance
  
  ### Response Time (Latency)
  **Métricas:** P50, P95, P99 response times
  **Endpoints críticos:** `/payments`, `/refunds`, `/webhooks`
  **Alert thresholds:**
  - Warning: P95 > 5s por 10 minutos → Slack
  - Critical: P95 > 10s por 5 minutos → PagerDuty
  - Emergency: P99 > 30s por 2 minutos → SMS + PagerDuty
  
  ### Error Rate by HTTP Status
  **Métricas:** 4xx rate, 5xx rate
  **Alert thresholds:**
  - 4xx Warning: > 20% por 15 minutos → Slack (client issues)
  - 5xx Warning: > 2% por 5 minutos → Slack  
  - 5xx Critical: > 5% por 2 minutos → PagerDuty
  
  ### Database Performance
  **Métricas:** Connection pool usage, slow query count
  **Alert thresholds:**
  - Pool usage > 80% por 10 minutos → Slack
  - Pool usage > 90% por 2 minutos → PagerDuty
  - Slow queries (> 5s) > 5/minute → Slack investigation
  
  ## Infraestrutura e Recursos
  
  ### Application Resources
  **CPU Usage:**
  - Warning: > 70% por 15 minutos → Slack
  - Critical: > 85% por 5 minutos → PagerDuty
  
  **Memory Usage:**
  - Warning: > 80% por 10 minutos → Slack  
  - Critical: > 90% por 3 minutos → PagerDuty
  
  **Disk Space:**
  - Warning: > 85% → Daily email
  - Critical: > 95% → PagerDuty
  
  ### Circuit Breaker Status
  **State Changes:**
  - OPEN state → Immediate Slack alert
  - HALF_OPEN → Info notification
  - Frequent state changes (> 5/hour) → Investigation alert
  
  ## Alertas de Segurança
  
  ### Authentication Failures
  **Métrica:** Failed login attempts per IP/user
  **Alert thresholds:**
  - 10 failures same IP in 5 minutes → Security alert
  - 5 failures same user in 5 minutes → Account lockout + alert
  
  ### PCI Compliance Violations
  **Triggers:**
  - Sensitive data detected in logs → Immediate security alert
  - Failed encryption validation → Critical alert
  - Unauthorized access attempt → Security team notification
  
  ### Webhook Security
  **Signature validation failures:**
  - > 5 failures in 5 minutes → Security investigation
  - New source IP with invalid signatures → Block + alert
  
  ## Configuração de Alertas
  
  ### Notification Channels
  **Slack #alerts (Warning level):**
  - Performance degradation
  - Business metrics deviation
  - Operational issues
  
  **PagerDuty (Critical level):**
  - System unavailability
  - Revenue impact
  - Security incidents
  
  **SMS (Emergency level):**
  - Complete system failure
  - Data breach suspicion
  - Regulatory compliance violation
  
  ### Alert Routing
  ```yaml

  alert_routing:
    business_hours: # 9:00-18:00 BRT, Mon-Fri
      - slack: "#alerts"
      - email: "squad-payments@company.com"
      
    after_hours: # Evenings, weekends, holidays  
      - pagerduty: "payments-oncall"
      - slack: "#alerts" (low priority)
      
    emergency_contact:
      - sms: "+55-11-99999-9999" (Tech Lead)
      - sms: "+55-11-88888-8888" (CTO)
  ```

  
  ## Dashboard Configuration
  
  ### Business Dashboard
  **Real-time metrics:**
  - Hourly revenue vs target
  - Payment success rate by gateway
  - Top failure reasons
  - Geographic payment distribution
  
  ### Technical Dashboard  
  **System health:**
  - Application response times
  - Error rates by endpoint
  - Database performance
  - Infrastructure utilization
  
  ### Security Dashboard
  **Security posture:**
  - Authentication success rates
  - Failed access attempts
  - Certificate expiration dates
  - Compliance status indicators
  
  ## Alert Tuning e Maintenance
  
  ### False Positive Reduction
  **Weekly review process:**
  1. Analyze alert frequency and resolution time
  2. Identify alerts that didn't require action
  3. Adjust thresholds based on historical data
  4. Remove or consolidate redundant alerts
  
  ### Threshold Optimization
  **Baseline recalculation:** Monthly
  **Seasonal adjustments:** Black Friday, holiday periods
  **A/B testing:** Gradual threshold changes with validation
  
  ### Alert Fatigue Prevention
  **Maximum alerts per person:** 5 pages/day
  **Escalation policy:** Auto-escalate unacknowledged alerts
  **Alert grouping:** Bundle related alerts into incidents
  
  ## Runbook Integration
  
  ### Auto-remediation
  **Simple issues:**
  - Restart unhealthy service instances
  - Clear full log directories
  - Reset connection pools
  
  **Complex issues:**
  - Link to specific runbook procedures
  - Include investigation commands in alert
  - Provide escalation contact information

examples:
  - input: "Payment success rate 94% por 3 minutos, baseline 98.5%"
    output: "Critical alert → PagerDuty → investigate gateway health → escalate if needed"
  - input: "P95 latency 7s por 12 minutos, threshold warning 5s/10min"  
    output: "Warning alert → Slack #alerts → monitor trends → investigate if sustained"
  - input: "Circuit breaker OPEN para Stripe gateway"
    output: "Immediate Slack alert → failover PayPal → investigate Stripe status"

related_to:
  - target: uki:squad-payments:procedure:incident-response-014
    type: enables
    description: "Alertas eficazes permitem detecção precoce de incidentes"
  - target: uki:squad-payments:technical_pattern:gateway-integration-007
    type: monitors
    description: "Monitoramento específico para saúde dos gateways"
  - target: uki:squad-payments:business_rule:fraud-thresholds-003
    type: relates_to
    description: "Alertas de segurança complementam detecção de fraude"

domain_of_influence: "engineering_teams"

```
