# Plano Scrum de Melhorias da Documentação (PT) – Protocolo Matrix

Data: 2025-10-19
Responsável: Equipe de Documentação Matrix
Escopo: Diretório `website/content/pt`
Base: `PLANO_MELHORIAS_DOCUMENTACAO_PT.md`

## Visão Geral

Este plano detalha a execução em Scrum das melhorias de documentação em português, com foco em padronização estrutural, conteúdo conceitual, explicabilidade, governança MOC, navegação, harmonização PT↔EN e métricas/QA.

## 1) Épicos

- Padronização Estrutural e Frontmatter
- Conteúdo Conceitual e Roteiros
- Explicabilidade e Templates
- Governança MOC (Documentação Conceitual)
- Navegação Dinâmica e Interlinks
- Harmonização PT↔EN
- Métricas, Feedback Loop e QA
- Enforcement de Nomenclatura (English-only filenames)

## 2) Features por Épico

**Padronização Estrutural e Frontmatter**
- Definir padrão de frontmatter: título, descrição, tags, framework, maturidade
- Criar/ajustar `index.md` faltantes em `pt/docs/...`
- Unificar taxonomias e metadados (glossário de tags)
- Checklist editorial de consistência
- Política de nomenclatura: todos os nomes em inglês; `kebab-case` para diretórios, `snake_case` para arquivos específicos, e maiúsculas para documentos principais em `website/docs`.

**Conteúdo Conceitual e Roteiros**
- Página `pt/docs/examples/roteiros-conceituais.md` com fluxos Mermaid
- Página `pt/docs/frameworks/inferencia-raciocinio.md` (DL/Datalog, KGE, GNN)
- Página `pt/docs/manual/tools/feedback-loop.md` (métricas, triggers ZOF)
- Página de aprendizado contínuo (RL/FL) integrada às anteriores

**Explicabilidade e Templates**
- `pt/docs/manual/tools/explicabilidade.md` com templates XAI/NLG
- Biblioteca de justificativas e exemplos de grafos de decisão (Mermaid)
- Guia de boas práticas de explicabilidade narrativa

**Governança MOC (Documentação Conceitual)**
- `pt/docs/manual/governanca-moc.md` (precedências, escopos, exemplos)
- Matriz de políticas e casos de decisão
- Exemplos de configuração conceitual por escopo

**Navegação Dinâmica e Interlinks**
- Refatorar links cruzados entre frameworks, manual, quickstart, exemplos
- Breadcrumbs conceituais e seção “📖 Recursos Relacionados”
- Atualização da navegação dinâmica (scripts) e auditoria de links

**Harmonização PT↔EN**
- Mapeamento de paridade por seções-chave
- Notas de divergência quando aplicável
- Processo de sincronização editorial contínua

**Métricas, Feedback Loop e QA**
- KPIs editoriais (completude, consistência, integridade, cobertura, engajamento, qualidade epistêmica)
- Baseline inicial e dashboards (via relatórios existentes)
- Auditorias periódicas e definição de DoD (Definition of Done)

## 3) Objetivos (por Feature)

**Frontmatter padrão**
- 95% das páginas com `title`, `description`, `tags`, `framework`, `maturity` padronizados

**Index.md faltantes**
- ≥95% dos diretórios de `pt/docs/*` com `index.md` criado e atualizado

**Taxonomias unificadas**
- 100% das páginas com tags de domínio validadas contra glossário

**Checklist editorial**
- 100% das novas alterações passam no checklist (estrutura, metadados, links)

**Roteiros conceituais**
- 1 página publicada com ≥3 fluxogramas Mermaid conectando MEP→MEF→ZOF→OIF

**Inferência & raciocínio**
- 1 página publicada cobrindo DL/Datalog, KGE e GNN com ≥3 exemplos conceituais

**Feedback loop (métricas/triggers)**
- 1 página publicada com ≥5 métricas e ≥3 triggers ZOF documentados

**Explicabilidade (XAI/NLG)**
- 1 página publicada com ≥3 templates e ≥3 exemplos narrativos

**Governança MOC**
- 1 página publicada com matriz de políticas e ≥3 casos de decisão

**Interlinks e navegação**
- Taxa de links válidos ≥98%; todas as páginas novas com seção “📖 Recursos Relacionados”

**Harmonização PT↔EN**
- Paridade mínima ≥90% nas seções-chave; registro de divergências justificadas

**KPIs & QA**
- Dashboard de baseline criado; melhoria de +20% em engajamento nas páginas novas após 4 semanas

## 4) Personas

- Editor de Documentação: mantém estrutura, metadados e estilo
- Engenheiro de Conhecimento: valida coerência conceitual (DL, KGE, GNN, RL/FL)
- UX Writer: melhora explicabilidade e narrativa
- Maintainer Nuxt Content: garante navegação, scripts e auditorias
- Especialista de Domínio: fornece políticas e casos de governança MOC
- Leitor/Consumidor de Conhecimento: usa a documentação para implementar e decidir
- Gestor de Governança: supervisiona coerência organizacional e precedências

## 5) Histórias de Usuário

**Padronização Estrutural**
- Como Editor de Documentação, eu quero um padrão de frontmatter para garantir consistência e facilitar auditorias.
- Como Maintainer, eu quero `index.md` em todos os diretórios para estruturar corretamente a navegação.

**Conteúdo Conceitual**
- Como Leitor, eu quero roteiros conceituais com fluxogramas para entender a jornada da UKI entre frameworks.
- Como Engenheiro de Conhecimento, eu quero páginas sobre inferência (DL/Datalog, KGE, GNN) para conectar teoria à prática conceitual.

**Explicabilidade**
- Como UX Writer, eu quero templates XAI/NLG para comunicar decisões de forma clara e auditável.
- Como Leitor, eu quero exemplos visuais de justificativas para confiar nas recomendações do MAL/OIF.

**Governança MOC**
- Como Especialista de Domínio, eu quero documentar precedências por escopo para orientar decisões consistentes.
- Como Gestor de Governança, eu quero uma matriz de políticas para supervisionar coerência organizacional.

**Navegação & Interlinks**
- Como Leitor, eu quero recursos relacionados em cada página para aprofundar rapidamente.
- Como Maintainer, eu quero auditorias de links para manter integridade da navegação dinâmica.

**Harmonização PT↔EN**
- Como Editor, eu quero paridade mínima PT↔EN para reduzir ambiguidades entre idiomas.
- Como Leitor, eu quero notas de divergência quando houver diferenças justificadas.

**Métricas & QA**
- Como Gestor, eu quero KPIs editoriais para avaliar evolução da documentação.
- Como Time, eu quero um checklist de DoD para garantir qualidade antes de publicar.

## 6) Sprints (Cronograma e Entregáveis)

**Sprint 1 – Planejamento e Padronização (Semana 1)**
- Entregáveis:
  - Definição do padrão de frontmatter e glossário de tags
  - Inventário de `index.md` faltantes com priorização
  - Versão inicial do checklist editorial
  - Política de nomenclatura English-only documentada e comunicada
- Critérios de Aceite:
  - Documento de padrão publicado
  - Backlog de diretórios sem `index.md` com status
  - 100% dos novos arquivos criados já seguem nomes em inglês

**Sprint 2 – Normalização Estrutural (Semana 2)**
- Entregáveis:
  - Criação/ajuste de `index.md` nas pastas prioritárias
  - Aplicação do frontmatter padronizado
- Critérios de Aceite:
  - Cobertura de `index.md` ≥ 80% das pastas alvo da sprint

**Sprint 3 – Conteúdo Conceitual I (Semana 3)**
- Entregáveis:
  - `pt/docs/examples/roteiros-conceituais.md` com ≥3 fluxogramas
  - `pt/docs/frameworks/inferencia-raciocinio.md` com ≥3 exemplos
- Critérios de Aceite:
  - Publicação das páginas e validação conceitual por Eng. de Conhecimento

**Sprint 4 – Explicabilidade & Governança (Semana 4)**
- Entregáveis:
  - `pt/docs/manual/tools/explicabilidade.md` com ≥3 templates
  - `pt/docs/manual/governanca-moc.md` com matriz de políticas e ≥3 casos
- Critérios de Aceite:
  - Revisão do UX Writer e Especialista de Domínio

**Sprint 5 – Navegação & Feedback Loop (Semana 5)**
- Entregáveis:
  - Interlinks e recursos relacionados revisados
  - Auditoria de links e atualização de navegação dinâmica (scripts)
  - `pt/docs/manual/tools/feedback-loop.md` com métricas e triggers
- Critérios de Aceite:
  - Links válidos ≥98%; página publicada e revisada

**Sprint 6 – Harmonização & QA (Semana 6)**
- Entregáveis:
  - Paridade PT↔EN ≥90% nas seções-chave
  - Baseline de KPIs e relatório de QA final
- Critérios de Aceite:
  - Checklist DoD aprovado em 100% das alterações

## Backlog Priorizado (Resumo)

1. Padrão de frontmatter e checklist
2. `index.md` faltantes (prioridade por navegação crítica)
3. Roteiros conceituais (Mermaid)
4. Inferência & raciocínio (DL/Datalog, KGE, GNN)
5. Explicabilidade (XAI/NLG) e exemplos
6. Governança MOC (precedências, escopos)
7. Interlinks e navegação dinâmica
8. Feedback loop (métricas/triggers)
9. Harmonização PT↔EN e QA

## Dependências e Riscos

- Dependência: validação conceitual por Eng. de Conhecimento
- Risco: sobrecarga editorial – mitigação por priorização e escopo por sprint
- Dependência: manutenção dos scripts de auditoria/navegação

## Definição de Pronto (DoD)

- Estrutura: presença de `index.md` e seção de Recursos Relacionados
- Metadados: frontmatter conforme padrão
- Qualidade: checklist editorial aprovado
- Navegação: links internos válidos
- Métricas: registro de KPIs atualizado

---
Este plano Scrum operacionaliza o `PLANO_MELHORIAS_DOCUMENTACAO_PT.md`, garantindo execução iterativa, mensurável e alinhada às prioridades de robustez e eficiência da documentação em português.