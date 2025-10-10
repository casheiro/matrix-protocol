# StackSpot AI Knowledge Sources - Compatibility Guide

## 📋 **Formato Atual dos Arquivos**

### **✅ Knowledge Sources Estruturados (Compatível)**

**Localização**: `/structured/` (17 arquivos YAML)
**Formato**: MEF UKI compliant (YAML estruturado)
**Tamanho médio**: 1-3KB por arquivo
**Encoding**: UTF-8

**Estrutura Padrão**:
```yaml

schema: "1.0"
id: uki:squad-payments:business_rule:discount-logic-001
title: "Regras de Desconto por Volume e Cupons"
domain_ref: business
type_ref: business_rule
maturity_ref: validated
content: |
  [Conteúdo estruturado com exemplos e relacionamentos]
examples:
  - input: "Cliente VIP comprando R$ 1000"
    output: "Desconto 15% aplicado = R$ 150 de economia"
relationships:
  - type: relates_to
    target: uki:squad-payments:business_rule:refund-policy-002
```


### **✅ Knowledge Sources Não Estruturados (Compatível)**

**Localização**: `/unstructured/` (12 arquivos mistos)
**Formatos**: 
- `.md` (Markdown): 3 arquivos
- `.txt` (Plain text): 8 arquivos
**Tamanho médio**: 2-5KB por arquivo
**Encoding**: UTF-8

**Conteúdo**: Documentos reais simulando dispersão organizacional típica

---

## 🔧 **Instruções de Upload para StackSpot AI**

### **Setup Agent A (Não Estruturado)**

1. **Criar Knowledge Source**: "Payments Squad - Unstructured Docs"
2. **Upload todos os arquivos de**: `/unstructured/`
   - team-meeting-jan-2024.md
   - team-meeting-mar-2024.md  
   - confluence-payment-flow.md
   - slack-refunds-thread.txt
   - jira-fraud-detection.txt
   - pci-compliance-email.txt
   - developer-handover.txt
   - postmortem-outage-dec.txt
   - onboarding-checklist.txt
   - random-notes-mixed.txt
   - security-audit-findings.txt
3. **Agent Configuration**: System prompt padrão
4. **Nome do Agent**: "Payments Expert - Unstructured"

### **Setup Agent B (Estruturado MEF)**

1. **Criar Knowledge Source**: "Payments Squad - MEF UKIs"
2. **Upload todos os arquivos de**: `/structured/`
   - `/business-rules/` (6 UKIs)
   - `/technical-patterns/` (6 UKIs)  
   - `/procedures/` (5 UKIs)
3. **Upload adicional**: `MOC_SQUAD_PAYMENTS.yaml` (contexto organizacional)
4. **Agent Configuration**: Usar `/stackspot-agent-prompt.md`
5. **Nome do Agent**: "Payments Expert - MEF Structured"

---

## 📊 **Verificação de Compatibilidade**

### **✅ Formato Suportado**
- ✅ YAML files (UKIs estruturados)
- ✅ Markdown files (.md)
- ✅ Text files (.txt)
- ✅ UTF-8 encoding
- ✅ Tamanho adequado (<10KB por arquivo)

### **⚠️ Considerações Especiais**

**Para UKIs YAML:**
- StackSpot AI interpreta YAML como texto estruturado
- Mantém hierarquia e campos organizados
- Relacionamentos semânticos preservados

**Para Documentos Não Estruturados:**
- Conteúdo interpretado como texto livre
- Sem estrutura semântica preservada
- Informações podem ser fragmentadas no processamento

---

## 🎯 **Otimização para Demonstração**

### **Preparação dos Agents**

1. **Teste preliminar** com ambos os agents usando uma pergunta simples
2. **Calibração** do system prompt do Agent B se necessário
3. **Verificação** de que ambos acessam corretamente seus knowledge sources

### **Pontos de Atenção**

- **Agent A** deve mostrar inconsistências naturalmente presentes nos docs dispersos
- **Agent B** deve referenciar UKI IDs específicos e aproveitar relacionamentos
- **Diferença qualitativa** deve ser clara e mensurável

### **Backup Plan**

Se StackSpot AI não processar YAML adequadamente:
- **Conversão**: UKIs podem ser convertidos para Markdown mantendo estrutura
- **Script de conversão**: Preservar metadados em formato legível
- **Demonstração alternativa**: Usar content dos UKIs em formato texto estruturado

---

## 📝 **Checklist Pré-Demonstração**

- [ ] Upload de todos os 12 arquivos não estruturados no Agent A
- [ ] Upload de todos os 17 UKIs estruturados no Agent B  
- [ ] Upload do MOC_SQUAD_PAYMENTS.yaml no Agent B
- [ ] Configuração do system prompt personalizado no Agent B
- [ ] Teste das 5 perguntas estratégicas em ambos os agents
- [ ] Verificação das diferenças qualitativas esperadas
- [ ] Preparação dos pontos de destaque para cada pergunta

**Status**: ✅ **Arquivos verificados como compatíveis com StackSpot AI**

---

## 🚀 **Execução da Demonstração**

### **Fluxo Recomendado**

1. **Apresentar contexto** (2 min): Problema do conhecimento disperso
2. **Mostrar setup** (1 min): Dois agents, mesmas perguntas, sources diferentes
3. **Executar perguntas** (10 min): 5 perguntas estratégicas lado a lado
4. **Destacar diferenças** (5 min): Qualidade, precisão, rastreabilidade
5. **Próximos passos** (2 min): Como implementar na organização

### **Métricas de Sucesso**

**Qualitativas:**
- Agent B fornece respostas mais precisas e contextualizadas
- Agent B referencia fontes específicas (UKI IDs)
- Agent B identifica relacionamentos entre conceitos
- Agent A mostra inconsistências e ambiguidades

**Quantitativas:**
- Tempo de resposta similar entre agents
- Agent B cita 2-3x mais referências específicas
- Agent B fornece exemplos práticos em 80% das respostas

---

## 📋 **Troubleshooting**

### **Problemas Comuns**

**Agent não acessa knowledge source:**
- Verificar se upload foi concluído
- Confirmar encoding UTF-8 dos arquivos
- Testar com pergunta simples primeiro

**Respostas muito genéricas:**
- Ajustar system prompt para ser mais específico
- Adicionar exemplos no prompt sobre como usar UKIs
- Verificar se knowledge source está ativo

**YAML não interpretado corretamente:**
- StackSpot AI trata YAML como texto estruturado
- Estrutura hierárquica é preservada
- Relacionamentos ficam visíveis no contexto

### **Validação Final**

✅ **Checklist Completo:**
- [ ] 12 arquivos não estruturados carregados no Agent A
- [ ] 17 UKIs + MOC carregados no Agent B
- [ ] System prompt personalizado configurado
- [ ] 5 perguntas testadas e validadas
- [ ] Diferenças qualitativas confirmadas
- [ ] Pontos de destaque preparados
- [ ] Backup plan definido

**Resultado Esperado:** Demonstração clara da superioridade do conhecimento estruturado MEF para cooperação humano-IA, com evidência tangível de melhoria na qualidade das respostas.