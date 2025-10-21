---
title: Uki Pay Chargeback Rules 006
description: Página wrapper para o asset YAML uki-pay-chargeback-rules-006.yaml
layout: docs
sidebar: true
toc: true
navigation: true
icon: i-heroicons-code-bracket
lang: pt
last_updated: 2025-10-21
---
> Source YAML: `pt/docs/examples/knowledge/structured/business-rules/uki-pay-chargeback-rules-006.yaml`

**Abrir no Visualizador:** [Uki Pay Chargeback Rules 006](/pt/docs/viewer?file=/docs/examples/knowledge/structured/business-rules/uki-pay-chargeback-rules-006.yaml)

> 📄 Tipo: YAML • 📦 Tamanho: 4.0 KB • 🕒 Última modificação: 2025-10-10



```yaml

schema: "1.0"
ontology_reference: "moc:squad-payments:v1.0"
version: "0.0.1-beta"

id: uki:squad-payments:business_rule:chargeback-management-006
title: "Gestão de Chargebacks e Contestações"
scope_ref: squad-payments
scope_mode: "propagated"
domain_ref: business
type_ref: business_rule
maturity_ref: draft

created_date: 2024-03-25
last_modified: 2024-03-25
change_summary: "Criação inicial baseada em casos reais e best practices do setor"
change_impact: major
status: active

content: |
  ## Definições e Tipos
  
  **Chargeback:** Contestação iniciada pelo portador do cartão junto ao banco emissor
  **Reason Codes comuns:**
  - Fraud (4840): Transação não autorizada pelo portador
  - Processing Error (4855): Duplicação ou erro processamento
  - Consumer Dispute (4853): Cliente não reconhece transação
  - Authorization (4808): Autorização inadequada
  
  ## Prazos de Resposta
  
  **Primeira contestação:** 7 dias corridos para resposta
  **Pre-arbitration:** 10 dias corridos para contra-argumentação  
  **Arbitration:** 15 dias corridos (taxa adicional $500)
  **Documentação:** Deve ser completa e em inglês para cartões internacionais
  
  ## Taxa de Chargeback Aceitável
  
  **Meta organizacional:** < 0.8% do volume mensal
  **Threshold de alerta:** 0.6% (monitoramento intensivo)
  **Consequências > 1.0%:**
  - Revisão obrigatória de processos de fraude
  - Possível aumento de taxas pelos gateways
  - Análise detalhada de transações por categoria
  
  ## Estratégias de Defesa
  
  **Documentação obrigatória:**
  - Comprovante de entrega (rastreamento)
  - IP e geolocalização da compra
  - CVV e AVS match results
  - Histórico de comunicação com cliente
  - Screenshots de confirmação de pedido
  
  **Análise de viabilidade:**
  - Valor < R$ 100: avaliar custo-benefício da contestação
  - Valor > R$ 500: contestar sempre com documentação completa
  - Fraud claims: prioridade máxima na defesa
  
  ## Prevenção Proativa
  
  **Comunicação clara:**
  - Descritor no cartão deve ser reconhecível
  - Email de confirmação detalhado
  - Status de entrega proativo
  - SAC responsivo para dúvidas
  
  **Dados para retenção:**
  - Logs de autenticação por 24 meses
  - Dados de geolocalização por 18 meses
  - Comunicações com cliente por 12 meses
  - Provas de entrega por 6 meses após venda
  
  ## Processo de Contestação
  
  **1. Recebimento (Day 0):**
  - Notificação automática equipe
  - Análise inicial do caso
  - Separação por reason code
  
  **2. Investigação (Day 1-3):**
  - Coleta de documentação
  - Análise de viabilidade
  - Preparação de defesa
  
  **3. Submissão (Day 4-6):**
  - Upload de documentos
  - Argumentação estruturada
  - Follow-up com gateway

examples:
  - input: "Chargeback R$ 800 - Reason Code 4840 (fraud), cliente nega compra"
    output: "Defesa obrigatória: documentar IP, CVV match, histórico entrega, prazo 7 dias"
  - input: "Chargeback R$ 45 - Processing Error, duplicação confirmada"
    output: "Aceitar: custo defesa > valor transação, corrigir processo interno"
  - input: "Taxa mensal 0.7%, 15 chargebacks de 2000 transações"  
    output: "Alerta: acima threshold 0.6%, revisar prevenção fraude"

relationships:
  - type: complements
    target: uki:squad-payments:business_rule:fraud-thresholds-003
    description: "Prevenção de fraude reduz chargebacks por transações não autorizadas"
    
  - type: relates_to
    target: uki:squad-payments:procedure:incident-response-014
    description: "Chargeback em massa segue processo de incident response"
    
  - type: relates_to
    target: uki:squad-payments:business_rule:fee-calculation-005
    description: "Custos de chargeback impactam cálculo de taxas internas"

promotion:
  promotion_rationale: |
    Gestão de chargeback afeta equipes de atendimento, jurídico e financeiro.
    Demonstrou valor cross-functional e foi validada por stakeholders.
    Candidata à promoção organizacional.

domain_of_influence: "engineering_teams"
```
