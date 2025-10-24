# 🚀 **NAVEGAÇÃO DINÂMICA - DOCUMENTAÇÃO FUNDAMENTAL**

## 📋 **VISÃO GERAL**

Esta pasta contém a **documentação fundamental e permanente** do projeto de Navegação Dinâmica. Aqui estão os documentos que raramente mudam e fornecem o contexto base do projeto.

## 📁 **ESTRUTURA REORGANIZADA DO PROJETO**

O projeto foi reestruturado semanticamente para melhor organização:

```
docs/dynamic-navigation/
├── 📋 00-project/          # ← VOCÊ ESTÁ AQUI
├── 🔄 01-planning/         # Planejamento e rituais
└── 📊 02-execution/        # Execução e tracking
```

## 📄 **ARQUIVOS DESTA PASTA**

### **🎯 PROJECT_OVERVIEW.md**
- **Propósito**: Contexto completo do problema e solução
- **Conteúdo**: Análise do estado atual, arquitetura da solução, métricas de sucesso
- **Uso**: Leitura obrigatória antes de qualquer atividade no projeto

### **👥 TEAM_AGENTS.md**
- **Propósito**: Definição de papéis, responsabilidades e ferramentas por agent
- **Conteúdo**: 5 agents especializados com suas atribuições e autoridades
- **Uso**: Consultar antes de executar tasks para validar responsabilidades

### **📖 README.md** (este arquivo)
- **Propósito**: Índice principal e guia de navegação
- **Conteúdo**: Mapa da documentação e como usar cada seção
- **Uso**: Primeira consulta para localizar qualquer informação

## 🗺️ **NAVEGAÇÃO RÁPIDA**

### **📋 Planejamento** → `../01-planning/`
- **AGILE_RITUALS.md**: Ritos ágeis adaptados para IA
- **BACKLOG_EXECUTABLE.md**: Épicos, stories e tasks
- **todo-sync-config.json**: Configuração do sistema

### **📊 Execução** → `../02-execution/`
- **EXECUTION_LOG.md**: Status em tempo real e histórico
- **TASK_2.*.md**: Implementações técnicas core
- **frontmatter-catalog.json**: Dados técnicos

## 🤖 **COMO USAR - GUIA PARA AGENTS IA**

### **🏁 Para Iniciar Trabalho no Projeto**
1. **Ler** `PROJECT_OVERVIEW.md` (esta pasta)
2. **Consultar** `TEAM_AGENTS.md` (esta pasta)
3. **Verificar** `../02-execution/EXECUTION_LOG.md` para status atual
4. **Seguir** protocolos em `../01-planning/AGILE_RITUALS.md`

### **📋 Para Executar uma Task**
1. **Localizar task** em `../01-planning/BACKLOG_EXECUTABLE.md`
2. **Verificar dependencies** e responsável atribuído
3. **Atualizar status** em `../02-execution/EXECUTION_LOG.md`
4. **Executar work** usando ferramentas MCP atribuídas

### **🚦 Para Resolver Bloqueios**
1. **Identificar impedimento** e classificar urgência
2. **Usar escalation protocol** em `../01-planning/AGILE_RITUALS.md`
3. **Atualizar status** para BLOCKED em `../02-execution/EXECUTION_LOG.md`

## 📊 **STATUS ATUAL DO PROJETO**

### **📍 Situação**
- **Status**: PLANEJAMENTO CONCLUÍDO ✅
- **Sprint Ativa**: PRÉ-SPRINT 1
- **Próximo Marco**: Sprint Planning Sprint 1
- **Team Status**: 5/5 agents READY

### **🎯 Próximas Ações**
1. **Alex (Líder)**: Executar Sprint Planning
2. **Toda Equipe**: Participar do Planning
3. **Sprint 1**: Iniciar trabalho de Preparação e Padronização

## 🛠️ **FERRAMENTAS MCP MAPEADAS**

### **Por Agent**
- **Alex**: Context7, Nuxt Docs, Read/Write
- **Marina**: Nuxt UI, Edit/MultiEdit, Bash, Read
- **Ricardo**: Context7, Read, Glob/Grep, Write
- **Camila**: Bash, Read, WebFetch, Glob
- **Bruno**: Read, Edit, Glob, Write

### **Por Tipo de Task**
- **Research**: Context7, WebFetch, Read
- **Implementation**: Edit, MultiEdit, Write
- **Testing**: Bash, Read, Glob
- **Content**: Read, Edit, Glob, Write

## 📋 **TEMPLATES PRINCIPAIS**

### **Daily Update Template**
```markdown
---
## DAILY UPDATE: [Agent Name]
**Timestamp**: [ISO datetime]
**Current Task**: [task ID]
**Status**: [STARTED/IN_PROGRESS/COMPLETED/BLOCKED]
### Progress: [details]
### Next Actions: [next steps]
### Blockers: [impediments or NONE]
---
```

### **Handoff Template**
```markdown
---
📤 **HANDOFF: [From] → [To]**
**Completed**: [task ID]
**Available**: [deliverables]
**Location**: [file paths]
**Next Action**: [what recipient should do]
---
```

### **Escalation Template**
```markdown
---
🚨 **ESCALATION REQUEST**
**From**: [agent name]
**Task**: [task ID]
**Issue**: [concise description]
**Impact**: [sprint impact]
**Urgency**: [HIGH/MEDIUM/LOW]
---
```

## 🔍 **QUALITY ASSURANCE**

### **Definition of Done**
- ✅ Task completa conforme critérios de aceite
- ✅ Code review realizado (se aplicável)
- ✅ Tests passando (se aplicável)
- ✅ Documentation atualizada
- ✅ Handoff executado para próximo agent
- ✅ Status atualizado em EXECUTION_LOG.md

### **Quality Gates por Sprint**
- **Sprint 1**: Auditoria completa + Schema válido
- **Sprint 2**: API funcional + Performance mantida
- **Sprint 3**: Migration safe + Multilingual verified

## 🎯 **MÉTRICAS DE SUCESSO**

### **Técnicas**
- Performance: Lighthouse ≥ 90
- Bundle Size: ≤ atual + 5KB
- Loading Time: ≤ 200ms
- Test Coverage: ≥ 90%

### **Funcionais**
- Descoberta: 100% automática
- Multilingual: Paridade PT/EN
- Escalabilidade: Zero código para novos conteúdos
- Maintenance: Zero intervenção manual

### **Processo**
- Sprint Completion: 100% das tasks
- Quality Score: ≥ 95%
- Team Satisfaction: ≥ 8/10
- Stakeholder Approval: 100%

---

**🚀 Projeto pronto para execução por equipe de agents IA**  
**📋 Documentação completa e estruturada para continuidade assíncrona**  
**🎯 Objetivo claro: Navegação totalmente dinâmica e escalável**  

**Próximo passo**: Executar Sprint Planning conforme protocolo definido em AGILE_RITUALS.md