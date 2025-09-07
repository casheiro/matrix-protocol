# MEF Knowledge Sources Demonstration Script

## Apresentação: "Knowledge Sources Estruturados para Cooperação Humano-IA"

---

## 🎯 **Setup da Demonstração**

### **Contexto (2 minutos)**
> *"Todos nós já vivemos a frustração de buscar uma informação na empresa e encontrar versões diferentes em lugares diferentes. Hoje vou mostrar como conhecimento estruturado muda isso radicalmente quando trabalhamos com IA."*

### **Configuração StackSpot AI**

**Agent A**: "Payments Expert" com knowledge source **NÃO ESTRUTURADO**
- Upload: `/unstructured/` (12 documentos dispersos)
- System prompt padrão

**Agent B**: "Payments Expert MEF" com knowledge source **ESTRUTURADO** 
- Upload: `/structured/` (17 UKIs organizados)
- System prompt: `/stackspot-agent-prompt.md`

---

## 📋 **Script de Perguntas Estratégicas**

### **Pergunta 1: Políticas Conflitantes**
**Pergunta**: *"Qual é o prazo para processar refunds de clientes VIP?"*

**Resultado Esperado:**
- **Agent A (não estruturado)**: Informações conflitantes (7 dias vs 14 dias), necessita validação
- **Agent B (estruturado)**: Resposta precisa com referência UKI, versioning, e detalhes de implementação

**Ponto de Destaque**: *"Vejam como o conhecimento estruturado elimina ambiguidades e fornece a fonte exata da informação."*

---

### **Pergunta 2: Implementação Técnica**
**Pergunta**: *"Como implementar autenticação JWT segura seguindo nossas práticas?"*

**Resultado Esperado:**
- **Agent A**: Implementação genérica, mix de fontes inconsistentes
- **Agent B**: Padrão específico da empresa, exemplos de código, relacionamentos semânticos com outros UKIs

**Ponto de Destaque**: *"O MEF não só estrutura informação, mas cria relacionamentos semânticos entre conceitos."*

---

### **Pergunta 3: Regras de Negócio**
**Pergunta**: *"Quais são os thresholds de fraude para transações internacionais?"*

**Resultado Esperado:**
- **Agent A**: Valores conflitantes entre documentos (R$ 5.000 vs R$ 10.000 vs R$ 3.500)
- **Agent B**: Valor oficial validado, histórico de mudanças, rationale das decisões

**Ponto de Destaque**: *"Versioning e rastreabilidade garantem que sempre temos a informação mais atual e seu contexto."*

---

### **Pergunta 4: Processos Complexos**
**Pergunta**: *"Qual o processo completo para deploy de mudanças em produção?"*

**Resultado Esperado:**
- **Agent A**: Processo fragmentado, steps em documentos diferentes, informações desatualizadas
- **Agent B**: Processo completo e atual, com relacionamentos para outros UKIs (testes, monitoramento, rollback)

**Ponto de Destaque**: *"Knowledge graphs implícitos conectam procedimentos relacionados automaticamente."*

---

### **Pergunta 5: Cálculos de Negócio**
**Pergunta**: *"Como calcular descontos em cascata para clientes enterprise?"*

**Resultado Esperado:**
- **Agent A**: Fórmulas inconsistentes, exemplos desatualizados
- **Agent B**: Fórmula oficial, exemplos validados, casos edge documentados

**Ponto de Destaque**: *"Estruturação garante consistência em regras críticas de negócio."*

---

### **Pergunta 6: Compliance e Auditoria**
**Pergunta**: *"Quais são os requisitos PCI DSS que precisamos atender para processar cartões?"*

**Resultado Esperado:**
- **Agent A**: Informações espalhadas, versões diferentes de compliance, checklist incompleto
- **Agent B**: Requisitos organizados por categoria, checklist validado, relacionamentos com procedimentos técnicos

**Ponto de Destaque**: *"Compliance exige precisão absoluta - conhecimento estruturado elimina gaps de auditoria."*

---

### **Pergunta 7: Integração e Dependências**
**Pergunta**: *"Como implementar retry strategy para falhas de gateway mantendo idempotência?"*

**Resultado Esperado:**
- **Agent A**: Conceitos misturados, implementações parciais, sem contexto de relacionamentos
- **Agent B**: Padrão técnico completo, relacionamentos com UKIs de idempotência e error handling, exemplos de código validados

**Ponto de Destaque**: *"Knowledge graphs conectam conceitos técnicos automaticamente, acelerando implementação."*

---

## 🎬 **Roteiro de Apresentação**

### **Abertura (2 min)**
1. **Contexto**: "Quantas vezes vocês já encontraram informações conflitantes?"
2. **Proposta**: "Hoje vou mostrar como estruturação resolve isso na prática"
3. **Tool**: "Usando StackSpot AI como demonstração"

### **Demonstração (12 min)**
1. **Setup rápido**: Mostrar os dois agents configurados
2. **Pergunta 1**: Fazer nos dois, mostrar diferença
3. **Pergunta 2**: Enfatizar relacionamentos semânticos
4. **Pergunta 3**: Destacar versioning e confiabilidade
5. **Pergunta 4**: Mostrar completude vs fragmentação
6. **Pergunta 5**: Evidenciar precisão vs ambiguidade
7. **Pergunta 6**: Demonstrar compliance e auditoria
8. **Pergunta 7**: Mostrar knowledge graphs técnicos

### **Síntese (3 min)**
1. **Benefícios evidenciados**: Precisão, contexto, relacionamentos, versioning
2. **Impacto organizacional**: Menos tempo perdido, mais confiança nas decisões
3. **Próximos passos**: Como implementar na nossa realidade

---

## 📊 **Métricas de Impacto para Apresentar**

### **Antes (Conhecimento Não Estruturado)**
- ❌ 5+ contradições identificadas em 12 documentos
- ❌ 67% informação desatualizada (8 de 12 docs)  
- ❌ 15-30 minutos para encontrar informação confiável
- ❌ 0 relacionamentos explícitos entre conhecimentos

### **Depois (MEF Estruturado)**
- ✅ 100% conflitos resolvidos com rationale documentado
- ✅ 17 UKIs organizados com 42 relacionamentos semânticos
- ✅ 2-5 minutos para encontrar informação precisa
- ✅ Rastreabilidade completa e versioning controlado

---

## 💡 **Pontos-Chave para Enfatizar**

1. **Não é sobre tecnologia, é sobre qualidade da informação**
2. **IA amplifica tanto conhecimento bom quanto ruído - estruturação importa**
3. **Investimento inicial em estruturação paga dividendos exponenciais**
4. **Cooperação humano-IA depende de contexto preciso e confiável**
5. **Scaling knowledge workers através de knowledge assets estruturados**

---

## 🎯 **Call to Action**

> *"O que vocês viram hoje não é teoria - é uma transformação prática na forma como nossa organização pode trabalhar com IA. O conhecimento que já temos pode ser estruturado gradualmente, começando pelas áreas mais críticas. Quem topa começar um piloto?"*