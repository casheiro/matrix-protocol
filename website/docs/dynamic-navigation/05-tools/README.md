# 🔧 **05-TOOLS** - Ferramentas e Configurações

## 🎯 **Propósito desta pasta**
Centraliza documentação sobre **ferramentas CLI**, **scripts de automação** e **configurações** que suportam o projeto de navegação dinâmica.

## 📁 **Estrutura preparada**

### **scripts-docs/** 📜
- **Descrição**: Documentação detalhada dos scripts CLI em `/scripts/`
- **Conteúdo**: Manuais de uso, exemplos, troubleshooting
- **Status**: Preparado para documentação futura

## 🛠️ **Scripts CLI disponíveis**

Localização: `/scripts/` (raiz do projeto)

### **Sistema de automação completo:**
1. **`agent-context.js`** - Context dos agents especializados
2. **`next-task.js`** - Próximas tasks com dependencies
3. **`update-progress.js`** - Atualização do EXECUTION_LOG
4. **`dashboard.js`** - Dashboard em tempo real
5. **`sync-todos.js`** - Integração TodoWrite
6. **`task-agent.js`** - Integração Task tool
7. **`auto-update.js`** - Sistema de auto-update
8. **`handoff.js`** - Transferência entre agents

### **Scripts de auditoria:**
9. **`content-audit.js`** - Auditoria completa da estrutura
10. **`test-hybrid-system.js`** - Testes do sistema híbrido

## 🔗 **Navegação rápida**

- **← Relatórios** → `../04-reports/`
- **Projeto ←** → `../00-project/`
- **Scripts →** → `/scripts/` (raiz)

## 📋 **Como usar**

### **Para executar scripts:**
```bash
# Exemplo de uso dos scripts principais
node scripts/dashboard.js                    # Ver status geral
node scripts/agent-context.js alex          # Context do Alex Santos
node scripts/next-task.js ricardo           # Próxima task do Ricardo
node scripts/update-progress.js TASK_1.1.1 COMPLETED ricardo
```

### **Para integração com Claude Code:**
```bash
# Task tool integration
node scripts/task-agent.js task alex TASK_1.1.4

# TodoWrite sync
node scripts/sync-todos.js

# Auto-monitoring
node scripts/auto-update.js
```

### **Para documentar novos scripts:**
1. Criar arquivo em `scripts-docs/`
2. Seguir padrão: `[nome-script]-manual.md`
3. Incluir: propósito, uso, exemplos, troubleshooting

## 🎯 **Funcionalidades principais**

### **Automação completa:**
- **Context management** para agents IA
- **Progress tracking** automático
- **Task assignment** inteligente
- **Dashboard** em tempo real

### **Integração Claude Code:**
- **TodoWrite** sincronizado
- **Task tool** configurado
- **Bash execution** otimizada
- **MCP tools** mapeadas

## 📊 **Status dos scripts**

- ✅ **Sistema híbrido**: 100% funcional
- ✅ **Integração Claude Code**: Testada e validada
- ✅ **Automação completa**: 8/8 scripts operacionais
- 🔄 **Documentação**: Preparada para expansão

## ⚠️ **IMPORTANTE**

Os scripts estão localizados em `/scripts/` (raiz do projeto) e são **totalmente funcionais**. Esta pasta (05-tools) está preparada para **documentação futura** conforme necessário.

---
*Esta pasta suporta a **automação e tooling** do projeto.*