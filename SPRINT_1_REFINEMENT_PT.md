# Sprint 1 – Refinement Document (PT)

Data: 2025-10-19
Responsável: Equipe de Documentação Matrix
Escopo: `website/content/pt`
Referência: `SCRUM_PLAN_DOCUMENTATION_IMPROVEMENTS_PT.md`

## Objetivos da Sprint
- Planejar e padronizar: definir padrão de frontmatter, glossário de tags, checklist editorial.
- Inventariar e priorizar criação de `index.md` faltantes.
- Comunicar e aplicar a política English-only de nomes (diretórios `kebab-case`, arquivos específicos `snake_case`, principais em maiúsculas sob `website/docs`).

## Histórias na Sprint
- US-01: Padrão de frontmatter e checklist editorial.
- US-02: `index.md` em todos os diretórios (inventário e criação inicial).

---

## US-01 — Padrão de Frontmatter e Checklist Editorial

Descrição
- Como Editor de Documentação, quero um padrão de frontmatter para garantir consistência e facilitar auditorias.

Requisitos e Funcionalidades
- Definir chaves obrigatórias: `title`, `description`, `tags[]`, `framework`, `maturity`.
- Opcional recomendado: `lang`, `last_updated`, `slug`.
- Publicar documento padrão + exemplos; checklist editorial para PRs.
- Comunicar política English-only de nomes e taxonomias alinhadas ao glossário.

Critérios de Aceitação
- Documento do padrão de frontmatter publicado e versionado.
- Checklist editorial disponível e aplicado em 10 páginas piloto.
- Glossário de tags publicado e referenciado pelo checklist.
- 100% dos novos arquivos criados seguem nomes em inglês conforme política.

Tarefas Técnicas
- Redigir `FRONTMATTER_STANDARD.md` e `EDITORIAL_CHECKLIST.md` (local: `website/docs/`).
- Criar `scripts/frontmatter-schema.json` (validação das chaves/formatos).
- Atualizar `scripts/validation-automation.js` para validar frontmatter e nomes.
- Atualizar `SYNC_GUIDE_EN.md` e `SYNC_GUIDE.md` com política de nomes e tags.
- Produzir 10 exemplos aplicados (pilot pages) em `website/content/pt`.

Dependências
- Maintainer Nuxt Content (validação nos scripts).
- Engenheiro de Conhecimento (revisão de `framework`/`maturity` e tags).
- UX Writer (linguagem padrão de `title`/`description`).

Estimativa de Esforço
- 8 pontos (planejamento, documentação, automação básica e pilotos).

Pontos de Atenção / Riscos
- Divergência de tags entre páginas antigas e glossário.
- Fricção com nomes fora da política; mitigar com lint e comunicação.
- Ajustes em build caso validação rejeite páginas sem metadados.

Detalhamento Técnico
- Amostra de frontmatter:
```
---
title: "Roteiros Conceituais da UKI"
description: "Fluxos MEP→MEF→ZOF→OIF com exemplos."
tags: [uki, mep, mef, zof, oif]
framework: "MEF"
maturity: "beta"
lang: "pt"
last_updated: "2025-10-19"
---
```
- Validação de nomes:
  - Diretórios: `^[a-z0-9-]+$` (kebab-case)
  - Arquivos específicos: `^[a-z0-9_]+\.md$` (snake_case)
  - English-only: rejeitar acentuação e termos não-ingleses nos nomes.

---

## US-02 — Inventário e Criação Inicial de `index.md`

Descrição
- Como Maintainer, quero `index.md` em todos os diretórios para estruturar corretamente a navegação.

Requisitos e Funcionalidades
- Mapear diretórios de `website/content/pt` sem `index.md`.
- Priorizar criação nas rotas críticas (manual, frameworks, examples).
- Criar `index.md` com frontmatter padrão e seção "Recursos Relacionados".

Critérios de Aceitação
- Inventário completo e priorizado dos diretórios sem `index.md`.
- Criação de `index.md` nas 10 pastas de maior impacto (pilot batch).
- Navegação intacta (sem 404s) após criação inicial.

Tarefas Técnicas
- Executar auditoria com `scripts/content-audit.js` e consolidar relatório.
- Gerar lista priorizada (CSV/JSON) para criação de `index.md`.
- Criar template de `index.md` mínimo (frontmatter + corpo padrão).
- Implementar criação em lote (10 pastas) e validar navegação.
- Atualizar interlinks onde necessário para evitar páginas órfãs.

Dependências
- Scripts de auditoria (`content-audit.js`).
- Maintainer Nuxt Content (checagem de navegação dinâmica).

Estimativa de Esforço
- 5 pontos (inventário completo + criação inicial em lote limitado).

Pontos de Atenção / Riscos
- Interlinks quebrados ao adicionar `index.md` em estrutura existente.
- Diferenças de idioma/terminologia entre PT e EN em títulos.
- Possível necessidade de redirecionamentos temporários.

Detalhamento Técnico
- Template de `index.md`:
```
---
title: "Manual — Templates"
description: "Entrada do diretório com contexto e links relacionados."
tags: [manual, templates]
framework: "MEF"
maturity: "stable"
lang: "pt"
---

# Manual — Templates

Bem-vindo. Esta página organiza os recursos do diretório.

## 📖 Recursos Relacionados
- [[Link 1]]
- [[Link 2]]
```

---

## Priorização das Histórias (Sprint 1)
- P1: US-01 — Padrão de frontmatter e checklist (fundacional).
- P2: US-02 — Inventário e criação inicial de `index.md` (navegação).

## Alinhamento com Objetivos da Sprint
- US-01 atende planejamento/padronização e comunicação da política de nomes.
- US-02 atende inventário e início da normalização estrutural sem quebrar navegação.

## Plano de Execução (Sem Ambiguidades)
- Dia 1–2: Documentar padrão, checklist e glossário; preparar schema e lint.
- Dia 3: Aplicar padrão em 10 páginas piloto; ajustar scripts de validação.
- Dia 4: Rodar auditoria, priorizar 10 pastas e gerar templates.
- Dia 5: Criar `index.md` nas 10 pastas; validar navegação e ajustar links.
- Entregáveis: documentos publicados, pilotos aplicados, inventário consolidado, lote inicial criado, política de nomes comunicada.

## Definição de Pronto (DoD – Sprint 1)
- Padrão/frontmatter publicado; checklist disponível.
- 10 páginas piloto com frontmatter padrão e checklist aprovado.
- Inventário de `index.md` completo; 10 criados nas pastas prioritárias.
- Sem links quebrados; novos arquivos seguem nomes em inglês.