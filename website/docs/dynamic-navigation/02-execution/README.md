# 📊 **02-EXECUTION** - Execução e Tracking

## 🎯 **Propósito desta pasta**
Contém a documentação **dinâmica** de execução, status em tempo real e tracking de progresso do projeto.

## 📄 **Arquivos incluídos**

### **EXECUTION_LOG.md**
- **Descrição**: Log principal de execução com status em tempo real
- **Conteúdo**: Status dos agents, progresso das tasks, logs de atividades
- **Quando usar**: Atualizar após cada task, consultar para continuidade

### **sprint-reports/** (pasta)
- **Descrição**: Relatórios de cada sprint executada
- **Conteúdo**: Retrospectives, métricas, lições aprendidas (formato JSON + Markdown)
- **Arquivos disponíveis**: 
  - **Sprint 1**: `SPRINT_1_REPORT.md`, JSONs de auditoria automática
  - **Sprint 2**: `SPRINT_2_REPORT.md`, JSONs de métricas de performance
- **Quando usar**: Ao final de cada sprint para documentar resultados

## 🔗 **Navegação rápida**

- **← Planejamento** → `../01-planning/`
- **Entregáveis →** → `../03-deliverables/`
- **Relatórios →** → `../04-reports/`

## 📋 **Como usar**

### **Para verificar status atual:**
1. Abrir `EXECUTION_LOG.md`
2. Consultar seção "STATUS DOS AGENTS"
3. Ver "OVERVIEW DE ÉPICOS" para progresso geral

### **Para atualizar progresso:**
1. Usar scripts em `/scripts/update-progress.js`
2. Ou atualizar manualmente seguindo templates em `EXECUTION_LOG.md`
3. Registrar timestamp e detalhes da atividade

### **Para handoff entre agents:**
1. Seguir protocolo em `../01-planning/AGILE_RITUALS.md`
2. Atualizar EXECUTION_LOG.md com handoff realizado
3. Notificar próximo agent das entregas disponíveis

## ⚠️ **IMPORTANTE**

Esta pasta contém documentação **ativa** que muda constantemente durante a execução do projeto. Sempre verificar timestamps para garantir informações atualizadas.

---
*Esta pasta reflete o **estado atual** do projeto em tempo real.*