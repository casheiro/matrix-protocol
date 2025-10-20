---
title: "Uki Pay Discount Logic 001"
description: "Página wrapper para o asset YAML uki-pay-discount-logic-001.yaml"
layout: "docs"
sidebar: true
toc: true
navigation: true
---

> Source YAML: `pt/docs/examples/knowledge/structured/business-rules/uki-pay-discount-logic-001.yaml`

**Abrir no Visualizador:** [Uki Pay Discount Logic 001](/pt/docs/viewer?file=/docs/examples/knowledge/structured/business-rules/uki-pay-discount-logic-001.yaml)

> 📄 Tipo: YAML • 📦 Tamanho: 2.2 KB • 🕒 Última modificação: 2025-10-10



```yaml
schema: "1.0"
ontology_reference: "moc:squad-payments:v1.0"
version: "2.1.0"

id: uki:squad-payments:business_rule:discount-logic-001
title: "Regras de Desconto por Volume e Cupons"
scope_ref: squad-payments
scope_mode: "restricted"
domain_ref: business
type_ref: business_rule
maturity_ref: validated

created_date: 2024-03-25
last_modified: 2024-03-25
change_summary: "Consolidação de regras conflitantes sobre descontos e definição de precedência"
change_impact: minor
status: active

content: |
  ## Regras de Desconto por Volume
  
  **Aplicação automática baseada no valor total do carrinho:**
  - R$ 500,00 - R$ 999,99: 5% de desconto
  - R$ 1.000,00 - R$ 1.999,99: 10% de desconto  
  - R$ 2.000,00 ou mais: 15% de desconto (máximo)
  
  ## Cupons de Desconto
  
  **Cupons ativos:**
  - PRIMEIRA: 20% primeira compra (máximo R$ 100 desconto)
  - VOLTA: 10% cliente recorrente (sem limite)
  - AMIGO: 5% indicação (ambos recebem)
  
  ## Precedência de Aplicação
  
  **Regra de conflito:** Cupons têm precedência sobre desconto automático por volume.
  **Exceção:** Se desconto automático for maior que cupom, aplicar o maior valor.
  **Acúmulo:** Cupons não acumulam entre si. Apenas um cupom por transação.
  
  ## Validações
  
  - Cupom PRIMEIRA: validar se é primeira compra do CPF
  - Cupom VOLTA: validar histórico de compras (mínimo 30 dias da última)
  - Cupom AMIGO: validar código de indicação válido
  - Valor mínimo: R$ 50,00 para qualquer desconto

examples:
  - input: "Carrinho R$ 1.200 + cupom PRIMEIRA (cliente novo)"
    output: "Desconto: R$ 100 (cupom PRIMEIRA limitado), não R$ 120 (10% volume)"
  - input: "Carrinho R$ 800 + cupom VOLTA (cliente recorrente)"  
    output: "Desconto: R$ 80 (10% cupom VOLTA), não R$ 40 (5% volume)"
  - input: "Carrinho R$ 2.500 + cupom AMIGO (5%)"
    output: "Desconto: R$ 375 (15% volume maior que 5% cupom)"

relationships:
  - type: implements
    target: uki:squad-payments:business_rule:fee-calculation-005
    description: "Cálculo de taxas considera descontos aplicados"
  
  - type: relates_to
    target: uki:squad-payments:business_rule:refund-policy-002
    description: "Desconto afeta cálculo de refund proporcional"

domain_of_influence: "engineering_teams"
```
