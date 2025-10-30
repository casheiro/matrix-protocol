# Padrões Visuais para Diagramas Mermaid - Matrix Protocol

Este documento estabelece os padrões visuais para todos os diagramas Mermaid no projeto Matrix Protocol, garantindo consistência, acessibilidade e alinhamento com a identidade visual da marca.

## 🎨 Sistema de Cores dos Frameworks

### Cores Primárias dos Frameworks
```css
/* Cores oficiais dos frameworks Matrix Protocol */
--mef-primary: #2ECC71;    /* MEF - Matrix Embedding Framework */
--zof-primary: #E67E22;    /* ZOF - Zion Orchestration Framework */
--oif-primary: #2980B9;    /* OIF - Operator Intelligence Framework */
--moc-primary: #9B59B6;    /* MOC - Matrix Ontology Catalog */
--mal-primary: #C0392B;    /* MAL - Matrix Arbiter Layer */
```

### Cores para Backgrounds (Alta Legibilidade)
```css
/* Fundos com contraste adequado para texto branco */
--mef-background: #1E8449;    /* Verde escuro */
--zof-background: #D35400;    /* Laranja escuro */
--oif-background: #2471A3;    /* Azul escuro */
--moc-background: #8E44AD;    /* Roxo escuro */
--mal-background: #A93226;    /* Vermelho escuro */

/* Fundos para elementos secundários */
--mef-light: #A9DFBF;         /* Verde claro */
--zof-light: #F8C471;         /* Laranja claro */
--oif-light: #A9CCE3;         /* Azul claro */
--moc-light: #D2B4DE;         /* Roxo claro */
--mal-light: #F1948A;         /* Vermelho claro */
```

### Cores Neutras e Funcionais
```css
/* Elementos neutros e estruturais */
--user-color: #34495E;        /* Azul escuro para usuário */
--system-color: #7F8C8D;      /* Cinza para sistema */
--success-color: #2ECC71;     /* Verde para sucesso */
--warning-color: #F39C12;     /* Amarelo para aviso */
--error-color: #E74C3C;       /* Vermelho para erro */
--info-color: #3498DB;        /* Azul para informação */
```

## 📐 Padrões de Aplicação por Tipo de Diagrama

### 1. Diagramas de Integração End-to-End
- **Uso**: Fluxos complexos entre múltiplos frameworks
- **Padrão**: Cores de background dos frameworks + texto branco
- **Elementos neutros**: Cores funcionais para usuário/sistema

```mermaid
classDef mef fill:#1E8449,stroke:#2ECC71,color:#fff,stroke-width:2px
classDef zof fill:#D35400,stroke:#E67E22,color:#fff,stroke-width:2px
classDef oif fill:#2471A3,stroke:#2980B9,color:#fff,stroke-width:2px
classDef moc fill:#8E44AD,stroke:#9B59B6,color:#fff,stroke-width:2px
classDef mal fill:#A93226,stroke:#C0392B,color:#fff,stroke-width:2px
classDef user fill:#34495E,stroke:#2C3E50,color:#fff,stroke-width:2px
```

### 2. Diagramas de Framework Individual
- **Uso**: Documentação específica de um framework
- **Padrão**: Gradientes da cor do framework específico
- **Hierarquia**: Tom principal → Tom claro → Tom muito claro

### 3. Diagramas de Governança e Hierarquia
- **Uso**: Estruturas organizacionais e precedências
- **Padrão**: Escala hierárquica com cores funcionais
- **Elementos**: Crítico (vermelho) → Alto (laranja) → Médio (amarelo) → Baixo (verde)

### 4. Diagramas Conceituais e Exemplos
- **Uso**: Explicações didáticas e casos de uso
- **Padrão**: Paleta harmoniosa com cores de informação
- **Foco**: Clareza pedagógica e hierarquia visual

## ✅ Checklist de Acessibilidade

### Contraste (WCAG AA - Mínimo 4.5:1)
- [ ] Texto branco em fundos escuros dos frameworks
- [ ] Texto escuro em fundos claros secundários
- [ ] Bordas contrastantes para definição de elementos
- [ ] Teste em modo claro e escuro

### Diferenciação Visual
- [ ] Elementos distinguíveis por cor AND forma/texto
- [ ] Padrões consistentes entre diagramas similares
- [ ] Hierarquia visual clara (tamanho, cor, posição)
- [ ] Legenda quando necessário

## 🔧 Templates de Implementação

### Template para Diagrama de Integração
```mermaid
%% Configuração de estilos padronizada
classDef mef fill:#1E8449,stroke:#2ECC71,color:#fff,stroke-width:2px
classDef zof fill:#D35400,stroke:#E67E22,color:#fff,stroke-width:2px
classDef oif fill:#2471A3,stroke:#2980B9,color:#fff,stroke-width:2px
classDef moc fill:#8E44AD,stroke:#9B59B6,color:#fff,stroke-width:2px
classDef mal fill:#A93226,stroke:#C0392B,color:#fff,stroke-width:2px
classDef user fill:#34495E,stroke:#2C3E50,color:#fff,stroke-width:2px
classDef system fill:#7F8C8D,stroke:#95A5A6,color:#fff,stroke-width:2px
```

### Template para Diagrama de Governança
```mermaid
%% Hierarquia de prioridade organizacional
classDef critical fill:#E74C3C,stroke:#C0392B,color:#fff,stroke-width:3px
classDef high fill:#F39C12,stroke:#E67E22,color:#fff,stroke-width:2px
classDef medium fill:#F1C40F,stroke:#F39C12,color:#000,stroke-width:2px
classDef low fill:#2ECC71,stroke:#27AE60,color:#fff,stroke-width:2px
classDef info fill:#3498DB,stroke:#2980B9,color:#fff,stroke-width:2px
```

## 📋 Migração dos Problemas Identificados

### Problemas Críticos Resolvidos
1. **Contraste insuficiente**: `#e1f5fe` → `#2471A3` (OIF)
2. **Cores conflitantes**: Padronização com cores oficiais
3. **Inconsistência**: Sistema unificado para todos os diagramas
4. **Falta hierarquia**: Templates por categoria de diagrama

### Arquivos Prioritários para Correção
1. `content/pt/docs/integration.md` - CRÍTICO
2. `content/en/docs/integration.md` - CRÍTICO
3. `content/pt/docs/frameworks/index.md` - ALTO
4. `content/en/docs/frameworks/index.md` - ALTO
5. Demais arquivos conforme lista identificada

---

**Última atualização**: 2025-10-29  
**Versão**: 1.0  
**Status**: Implementação em andamento