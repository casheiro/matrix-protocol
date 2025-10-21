---
title: Uki Pay Fraud Thresholds 003
description: Página wrapper para o asset YAML uki-pay-fraud-thresholds-003.yaml
layout: docs
sidebar: true
toc: true
navigation: true
icon: i-heroicons-code-bracket
lang: pt
last_updated: 2025-10-21
order: 10
---
> Source YAML: `pt/docs/examples/knowledge/structured/business-rules/uki-pay-fraud-thresholds-003.yaml`

**Abrir no Visualizador:** [Uki Pay Fraud Thresholds 003](/pt/docs/viewer?file=/docs/examples/knowledge/structured/business-rules/uki-pay-fraud-thresholds-003.yaml)

> 📄 Tipo: YAML • 📦 Tamanho: 3.1 KB • 🕒 Última modificação: 2025-10-10



```yaml

schema: "1.0"
ontology_reference: "moc:squad-payments:v1.0"
version: "2.2.0"

id: uki:squad-payments:business_rule:fraud-thresholds-003
title: "Thresholds e Regras de Detecção de Fraude"
scope_ref: squad-payments
scope_mode: "restricted"
domain_ref: business
type_ref: business_rule
maturity_ref: validated

created_date: 2024-03-25
last_modified: 2024-03-25
change_summary: "Ajuste de thresholds baseado em análise de falsos positivos"
change_impact: minor
status: active

content: |
  ## Threshold de Valor para Revisão Manual
  
  **Valor atual:** R$ 3.500,00
  **Justificativa:** Balanceamento entre fricção e segurança baseado em análise de 3 meses
  **Exceções:**
  - Cliente recorrente (> 5 compras aprovadas): R$ 5.000,00
  - Cliente VIP (programa fidelidade): R$ 7.500,00
  
  ## Regras Comportamentais
  
  **Múltiplas tentativas:**
  - 3+ cartões diferentes no mesmo IP em 1 hora: bloqueio temporário
  - 5+ tentativas de pagamento falhadas: sinalizar como suspeito
  - Mesmo cartão tentado em 3+ IPs diferentes em 30min: revisão manual
  
  **Validação de dados:**
  - CVV inválidos óbvios: bloquear (000, 111, 222, etc.)
  - Mesmo cartão com variações de nome: sinalizar
  - Endereço de cobrança vs. entrega em países diferentes: revisão manual
  
  ## Regras Geográficas
  
  **IPs bloqueados por país:**
  - Países de alto risco definidos pelo setor de compliance
  - Exceção: cliente com histórico aprovado pode sobrescrever
  
  **Velocidade de localização:**
  - Mesma conta com compras em cidades > 500km em < 2h: sinalizar
  
  ## Escalation Matrix
  
  **Automático (sem intervenção):**
  - Transação abaixo do threshold + validações básicas OK
  
  **Sinalização (log + monitoramento):**
  - Comportamento suspeito mas abaixo do threshold crítico
  - Cliente com histórico positivo
  
  **Revisão manual (aprovação obrigatória):**
  - Acima do threshold de valor
  - 2+ regras comportamentais violadas
  - Primeira compra de cliente com dados suspeitos
  
  **Bloqueio automático:**
  - 3+ regras críticas violadas simultaneamente
  - País em lista negra sem exceção
  - CVV ou dados obviamente inválidos

examples:
  - input: "Transação R$ 4.000, cliente novo, IP Brasil, dados consistentes"
    output: "Revisão manual: acima threshold R$ 3.500 + cliente novo"
  - input: "Transação R$ 2.000, cliente recorrente, 4ª compra no mês"
    output: "Aprovação automática: abaixo threshold + cliente confiável"
  - input: "Transação R$ 800, 3 cartões diferentes, mesmo IP, 30min"
    output: "Bloqueio temporário: múltiplas tentativas suspeitas"

relationships:
  - type: implements
    target: uki:squad-payments:technical_pattern:error-handling-012
    description: "Sistema técnico implementa estas regras de negócio"
    
  - type: relates_to
    target: uki:squad-payments:procedure:incident-response-014
    description: "Casos de fraude confirmada seguem processo de incident"
    
  - type: complements
    target: uki:squad-payments:business_rule:chargeback-management-006
    description: "Prevenção de fraude complementa gestão de chargebacks"

domain_of_influence: "engineering_teams"
```
