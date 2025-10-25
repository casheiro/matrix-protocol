---
title: Uki Pay Currency Rates 004
description: Página wrapper para o asset YAML uki-pay-currency-rates-004.yaml
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
  - business-rules
keywords:
  - Matrix Protocol
  - MEF
  - UKI
  - conversão de moeda
  - taxas de câmbio
  - cotação de moedas
  - fallback de APIs
  - margem de segurança
  - cache de cotação
  - squad payments
---
> Source YAML: `pt/docs/examples/knowledge/structured/business-rules/uki-pay-currency-rates-004.yaml`

**Abrir no Visualizador:** [Uki Pay Currency Rates 004](/pt/docs/viewer?file=/docs/examples/knowledge/structured/business-rules/uki-pay-currency-rates-004.yaml)

> 📄 Tipo: YAML • 📦 Tamanho: 3.0 KB • 🕒 Última modificação: 2025-10-10



```yaml

schema: "1.0"
ontology_reference: "moc:squad-payments:v1.0"
version: "1.5.0"

id: uki:squad-payments:business_rule:currency-conversion-004
title: "Regras de Conversão de Moeda e Cotação"
scope_ref: squad-payments
scope_mode: "propagated"
domain_ref: business
type_ref: business_rule
maturity_ref: draft

created_date: 2024-03-25
last_modified: 2024-03-25
change_summary: "Definição de fallback e tolerâncias para API de cotação instável"
change_impact: minor
status: active

content: |
  ## Moedas Suportadas
  
  **Primária:** BRL (Real Brasileiro)
  **Secundárias aceitas:**
  - USD (Dólar Americano)  
  - EUR (Euro)
  - GBP (Libra Esterlina)
  
  ## Fonte de Cotação
  
  **Primária:** exchangerate-api.io (API comercial)
  **Backup:** Cotação fixa atualizada semanalmente
  **Frequência atualização:** A cada 1 hora durante horário comercial
  
  ## Regras de Fallback
  
  **API indisponível ou timeout:**
  - EUR → BRL: 6.20 (cotação conservadora)
  - USD → BRL: 5.10 (cotação conservadora)  
  - GBP → BRL: 6.80 (cotação conservadora)
  
  **Variação suspeita (> 5% em 1 hora):**
  - Usar cotação anterior até validação manual
  - Alert automático para equipe financeira
  - Log detalhado da variação para auditoria
  
  ## Cache e Performance
  
  **TTL do cache:** 60 minutos
  **Chave Redis:** "currency_rate_{from}_{to}_{date}"
  **Invalidação:** Manual via endpoint admin ou automática por timeout
  
  ## Tolerâncias e Margens
  
  **Margem de segurança:** 2% sobre cotação obtida
  **Justificativa:** Cobertura de flutuação durante processamento
  **Arredondamento:** Sempre para cima, 2 casas decimais
  
  ## Validações Obrigatórias
  
  - Cotação não pode ser zero ou negativa
  - Variação máxima 10% da cotação anterior (bloqueio automático)
  - Data da cotação não pode ser > 24h antiga
  - Log de todas conversões para auditoria financeira

examples:
  - input: "Compra €100, cotação API 6.15, margem 2%"
    output: "Cobrança: R$ 628.30 (€100 × 6.15 × 1.02)"
  - input: "API timeout, compra €50, cotação fallback"
    output: "Cobrança: R$ 316.00 (€50 × 6.20, fallback + log alert)"
  - input: "Cotação suspeita: EUR 8.50 (anterior 6.15)"
    output: "Bloqueio: variação 38% > threshold 10%, usar cotação anterior"

relationships:
  - type: implements
    target: uki:squad-payments:procedure:monitoring-alerts-016
    description: "Padrão de integração com API externa para cotação"
    
  - type: depends_on
    target: uki:squad-payments:technical_pattern:gateway-integration-007
    description: "Estratégia de cache Redis para performance"
    
  - type: relates_to
    target: uki:squad-payments:procedure:monitoring-alerts-016
    description: "Alerts de cotação suspeita integrados ao monitoramento"

promotion:
  promotion_rationale: |
    Regras de conversão podem beneficiar outras squads (marketplace, subscriptions).
    Demonstrou estabilidade e foi validada em ambiente de produção.

domain_of_influence: "engineering_teams"
```
