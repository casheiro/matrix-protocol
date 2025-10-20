# 🔄 **RITOS ÁGEIS ADAPTADOS PARA AGENTS IA**

## 🎯 **ESTRUTURA DE EXECUÇÃO ASSÍNCRONA**

### **Princípios de Adaptação**
- ⏰ **Tempo irrelevante**: Ritos baseados em triggers de conclusão, não em horários
- 🤖 **Execução por IA**: Protocolos claros para agents executarem autonomamente
- 📋 **Logs estruturados**: Registro de cada ação para continuidade assíncrona
- 🔄 **Dependencies first**: Sempre verificar dependências antes de executar
- 📊 **Status tracking**: Estado em tempo real de cada task e story

---

## **📋 SPRINT PLANNING - Ritual de Preparação**

### **Trigger de Execução**
```yaml

QUANDO: 
  - Sprint anterior concluída OU projeto iniciado
  - Todas as stories da sprint definidas
  - Critérios de aceite validados pela equipe
```

### **Protocolo de Execução**

#### **ETAPA 1: Pré-Planning (Alex - Líder)**
```markdown
**CHECKLIST PRE-PLANNING:**
- [ ] Ler PROJECT_OVERVIEW.md para contexto atualizado
- [ ] Revisar BACKLOG_EXECUTABLE.md para próximas stories
- [ ] Verificar EXECUTION_LOG.md para status atual
- [ ] Identificar dependências bloqueadoras
- [ ] Validar que todos agents estão disponíveis (status não bloqueado)

**TEMPLATE DE SAÍDA:**
---
## SPRINT PLANNING INICIADO
**Data**: [timestamp]
**Sprint Target**: [épico/stories selecionadas]
**Participants**: Alex, Marina, Ricardo, Camila, Bruno
**Dependencies**: [listar dependências identificadas]
**Estimated Effort**: [total hours]
---
```

#### **ETAPA 2: Story Refinement (Toda Equipe)**
```markdown
**Para cada Story selecionada:**

**REFINEMENT CHECKLIST:**
- [ ] Critérios de aceite claros e testáveis
- [ ] Tasks atômicas definidas (< 6h cada)
- [ ] Responsável e ferramentas MCP atribuídas
- [ ] Dependências mapeadas
- [ ] Estimativas validadas por especialista

**TEMPLATE DE REFINEMENT:**
---
### STORY [ID]: [título]
**Refined by**: [agent responsável]
**Dependencies**: [listar dependências]
**Risks**: [identificar riscos técnicos]
**DoR Verified**: ✅ Definition of Ready completa
**Tasks Count**: [número de tasks]
**Total Effort**: [horas estimadas]
---
```

#### **ETAPA 3: Sprint Commitment (Alex - Líder)**
```markdown
**SPRINT COMMITMENT CHECKLIST:**
- [ ] Capacity da equipe validada
- [ ] Dependências resolvidas ou mitigadas
- [ ] Todos agents commitados com suas tasks
- [ ] Sprint goal claro e testável
- [ ] Backlog atualizado com status "COMMITTED"

**TEMPLATE DE COMMITMENT:**
---
## SPRINT [N] COMMITTED
**Sprint Goal**: [objetivo claro em 1 frase]
**Stories Committed**: [lista]
**Total Effort**: [horas]
**Success Criteria**: [métricas objetivas]
**Start Trigger**: All agents ready
---
```

### **Entregáveis do Planning**
- ✅ Sprint backlog atualizado
- ✅ Tasks atribuídas com responsáveis
- ✅ Dependencies mapeadas
- ✅ Capacity planning validado
- ✅ Logs de planning registrados em EXECUTION_LOG.md

---

## **🔄 DAILY EXECUTION - Ritual de Progresso**

### **Trigger de Execução**
```yaml

QUANDO:
  - Agent inicia trabalho em uma task
  - Agent completa uma task
  - Agent encontra bloqueador
  - 24h desde último update (máximo)
```

### **Protocolo de Daily**

#### **FORMATO DE LOG DAILY**
```markdown
---
## DAILY UPDATE: [Agent Name]
**Timestamp**: [ISO datetime]
**Current Task**: [task ID e título]
**Status**: [STARTED/IN_PROGRESS/COMPLETED/BLOCKED]

### O que foi feito desde último update:
- [bullet points específicos]

### O que será feito até próximo update:
- [próximas ações planejadas]

### Bloqueadores/Impedimentos:
- [listar impedimentos ou "NONE"]

### Dependencies Status:
- [status das dependências da task atual]

### Tools Used:
- [ferramentas MCP utilizadas]

### Progress Metrics:
- **Task Progress**: [% complete]
- **Quality Check**: [PASS/FAIL/PENDING]
- **Estimated Remaining**: [horas]
---
```

#### **ESCALATION PROTOCOL**
```markdown
**QUANDO ESCALAR PARA ALEX:**
1. Task bloqueada > 4h
2. Dependência externa não resolvida
3. Mudança de escopo necessária
4. Conflito técnico entre agents
5. Critério de aceite ambíguo

**TEMPLATE DE ESCALATION:**
---
🚨 **ESCALATION REQUEST**
**From**: [agent name]
**Task**: [task ID]
**Issue**: [descrição concisa]
**Impact**: [impacto no sprint]
**Proposed Solution**: [sugestão]
**Urgency**: [HIGH/MEDIUM/LOW]
---
```

### **Auto-Sync Between Agents**
```markdown
**HANDOFF PROTOCOL:**
Quando task completa afeta próxima task de outro agent:

**HANDOFF TEMPLATE:**
---
📤 **HANDOFF: [From Agent] → [To Agent]**
**Completed**: [task ID e título]
**Available**: [artefatos entregues]
**Location**: [paths dos arquivos]
**Quality**: [validações realizadas]
**Next Action**: [o que o próximo agent deve fazer]
**Context**: [informações importantes para continuidade]
---
```

---

## **🔍 SPRINT REVIEW - Ritual de Validação**

### **Trigger de Execução**
```yaml

QUANDO:
  - Todas as tasks da sprint marcadas como COMPLETED
  - Critérios de aceite verificados por QA
  - Entregáveis validados tecnicamente
```

### **Protocolo de Review**

#### **ETAPA 1: Validation (Camila - QA)**
```markdown
**QUALITY VALIDATION CHECKLIST:**
- [ ] Todos critérios de aceite atendidos
- [ ] Performance metrics dentro do esperado
- [ ] Testes automatizados passando
- [ ] Funcionalidade PT/EN validada
- [ ] Regressão verificada

**VALIDATION REPORT TEMPLATE:**
---
## SPRINT [N] QUALITY REPORT
**Validator**: Camila Rodriguez
**Stories Reviewed**: [lista]
**Quality Score**: [0-100]
**Performance Impact**: [metrics]
**Regression Issues**: [lista ou NONE]
**Recommendation**: [APPROVE/REJECT/CONDITIONAL]
---
```

#### **ETAPA 2: Demo Preparation (Marina - Frontend)**
```markdown
**DEMO CHECKLIST:**
- [ ] Funcionalidade deployada em ambiente de testes
- [ ] Screenshots/videos da funcionalidade
- [ ] Comparação antes/depois preparada
- [ ] Casos de uso demonstráveis prontos

**DEMO PACKAGE:**
---
## SPRINT [N] DEMO PACKAGE
**Demonstrator**: Marina Costa
**Features Delivered**: [lista]
**Demo Environment**: [URL/environment]
**Test Cases**: [scenarios to demo]
**Performance Gains**: [metrics improvement]
---
```

#### **ETAPA 3: Stakeholder Review (Alex - Líder)**
```markdown
**STAKEHOLDER REVIEW TEMPLATE:**
---
## SPRINT [N] STAKEHOLDER REVIEW
**Review Lead**: Alex Santos
**Sprint Goal Achievement**: [✅/❌ + justificativa]
**Business Value Delivered**: [impacto real]
**Technical Debt Impact**: [aumentou/diminuiu/manteve]
**Next Sprint Recommendations**: [sugestões]
**Stakeholder Feedback**: [compilar feedback]
---
```

### **Entregáveis do Review**
- ✅ Quality validation report
- ✅ Demo package completo
- ✅ Stakeholder feedback documented
- ✅ Next sprint recommendations
- ✅ Production readiness assessment

---

## **📊 SPRINT RETROSPECTIVE - Ritual de Melhoria**

### **Trigger de Execução**
```yaml

QUANDO:
  - Sprint Review concluída
  - Todos entregáveis validados
  - Feedback coletado
```

### **Protocolo de Retrospective**

#### **ETAPA 1: Data Collection (Todos Agents)**
```markdown
**INDIVIDUAL RETROSPECTIVE TEMPLATE:**
Cada agent responde:

---
## RETROSPECTIVE INPUT: [Agent Name]
**Sprint**: [número]

### What Went Well (Celebrate 🎉):
- [successes específicos]

### What Could Be Improved (Improve 🔧):
- [friction points identificados]

### Action Items (Actions 🎯):
- [propostas específicas de melhoria]

### Tools/Process Feedback:
- **MCP Tools**: [efetividade das ferramentas usadas]
- **Documentation**: [clareza dos artefatos]
- **Communication**: [qualidade dos handoffs]
---
```

#### **ETAPA 2: Pattern Analysis (Alex - Líder)**
```markdown
**PATTERN ANALYSIS TEMPLATE:**
---
## RETROSPECTIVE ANALYSIS: SPRINT [N]
**Analyst**: Alex Santos

### Success Patterns Identified:
- [padrões que funcionaram bem]

### Pain Points Patterns:
- [problemas recorrentes]

### Process Improvements:
- [mudanças nos ritos propostas]

### Tool Optimizations:
- [ajustes nas ferramentas MCP]

### Next Sprint Adjustments:
- [mudanças para próxima sprint]
---
```

#### **ETAPA 3: Action Plan (Toda Equipe)**
```markdown
**ACTION PLAN TEMPLATE:**
---
## SPRINT [N] ACTION PLAN
**Next Sprint Improvements**:

### Process Changes:
- [ ] [mudança específica] - Owner: [agent]
- [ ] [mudança específica] - Owner: [agent]

### Tool Improvements:
- [ ] [otimização MCP] - Owner: [agent]
- [ ] [documentação update] - Owner: [agent]

### Communication Enhancements:
- [ ] [melhoria handoff] - Owner: [agent]
- [ ] [template update] - Owner: [agent]

**Implementation**: Start of next sprint
**Review**: During next retrospective
---
```

### **Entregáveis da Retrospective**
- ✅ Individual feedback compiled
- ✅ Pattern analysis documented
- ✅ Improvement action plan
- ✅ Process adjustments approved
- ✅ Next sprint optimizations planned

---

## **🔧 REFINEMENT - Ritual de Preparação Contínua**

### **Trigger de Execução**
```yaml

QUANDO:
  - 50% da sprint atual completa
  - Novas stories precisam ser detalhadas
  - Dependencies de próxima sprint precisam resolução
```

### **Protocolo de Refinement**

#### **STORY BREAKDOWN WORKSHOP**
```markdown
**REFINEMENT CHECKLIST:**
- [ ] User story bem definida (Who, What, Why)
- [ ] Critérios de aceite claros e testáveis
- [ ] Tasks atômicas (< 6h cada)
- [ ] Dependencies identificadas
- [ ] Tools MCP definidas por task
- [ ] Agent responsável atribuído
- [ ] Definition of Ready completa

**STORY REFINEMENT TEMPLATE:**
---
## STORY REFINED: [ID]
**Refiner**: [agent que liderou]
**Participants**: [agents envolvidos]

### Story Quality:
- **Clarity**: [0-10 score]
- **Testability**: [0-10 score]
- **Estimate Confidence**: [0-10 score]

### Technical Risk Assessment:
- **Complexity**: [LOW/MEDIUM/HIGH]
- **Dependencies**: [count and criticality]
- **Knowledge Gaps**: [areas needing research]

### Ready for Sprint**: [YES/NO + blockers if any]
---
```

---

## **📋 EXECUTION FRAMEWORK - Estado e Continuidade**

### **Status Definitions**
```yaml

TASK_STATUS:
  - TODO: Task definida, aguardando início
  - IN_PROGRESS: Agent trabalhando ativamente
  - BLOCKED: Impedimento identificado, escalado
  - REVIEW: Task completa, aguardando validação
  - COMPLETED: Validada e aceita
  - CANCELLED: Removida do escopo

STORY_STATUS:
  - BACKLOG: Aguardando refinement
  - REFINED: Pronta para planning
  - COMMITTED: Incluída na sprint
  - IN_PROGRESS: Tasks sendo executadas
  - TESTING: Em validação de qualidade
  - DONE: Todos critérios atendidos

SPRINT_STATUS:
  - PLANNING: Em preparação
  - ACTIVE: Execução em andamento
  - REVIEW: Validação final
  - COMPLETED: Encerrada com sucesso
```

### **Continuity Protocol**
```markdown
**Para Agent Resume Work:**
1. Ler EXECUTION_LOG.md para último status
2. Verificar handoffs pendentes
3. Validar dependencies status
4. Confirmar task ainda relevante
5. Atualizar status para IN_PROGRESS
6. Proceder com próxima action

**Para Agent Handoff:**
1. Completar current task
2. Atualizar EXECUTION_LOG.md
3. Gerar handoff message
4. Notificar next agent
5. Marcar task como COMPLETED
6. Await confirmation from receiver
```

---

**🎯 Objetivo**: Execução ágil totalmente autônoma por agents IA  
**📋 Tracking**: Todos ritos registrados em EXECUTION_LOG.md  
**🔄 Melhoria**: Retrospectives orientam evolução dos processos