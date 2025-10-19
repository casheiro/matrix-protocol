# Plano Abrangente de Melhorias na Documentação (PT) do Protocolo Matrix

Data: 2025-10-19
Responsável: Equipe de Documentação Matrix
Escopo: Diretório `website/content/pt`

## Objetivo

Elevar a robustez e eficiência da documentação em português, conectando conceitos do MEP/MEF/ZOF/OIF à prática, padronizando estrutura e metadados, enriquecendo exemplos e melhorando a navegabilidade. Baseado em `aprimoramentos.md` e nos relatórios de auditoria de navegação dinâmica.

Requisito obrigatório: padronizar todos os nomes de arquivos em inglês; usar `kebab-case` para diretórios, `snake_case` para arquivos específicos e maiúsculas para documentos principais sob `website/docs`.

## 1. Avaliação Detalhada (Pontos de Aprimoramento)

- Conexão conceito→prática limitada: faltam “roteiros conceituais” que mostrem UKIs atravessando MEP→MEF→ZOF→OIF.
- Inferência e raciocínio: ausente detalhamento conceitual de motores de inferência, KGE, GNN e seu papel no MAL/OIF.
- Aprendizado contínuo: pouco material sobre RL, Federated Learning e feedback loops aplicados ao MOC/ZOF.
- Explicabilidade: escassez de templates narrativos e visuais (XAI, NLG, Mermaid) para decisões MAL/OIF.
- Governança: orientações conceituais de UI para MOC ainda dispersas, sem páginas síntese.
- Padronização estrutural: relatórios indicam lacunas de `index.md` e variação de frontmatter e metadados.
- Navegação e interlinks: links cruzados entre frameworks, manual, quickstart e exemplos podem ser fortalecidos.
- Consistência PT↔EN: desalinhamentos pontuais de escopo e profundidade entre idiomas.
- Métricas e validação: ausência de indicadores editoriais (completude estrutural, consistência, qualidade epistêmica).

## 2. Propostas de Solução

- Roteiros Conceituais: adicionar páginas com fluxogramas Mermaid e narrativas explicando UKIs do MEP→MEF→ZOF→OIF.
- Inferência & Raciocínio: criar seções conceituais sobre DL/Datalog, KGE (TransE/ComplEx), GNN (link prediction/classificação).
- Aprendizado Contínuo: páginas de RL (MDP, políticas), Federated Learning (agregação), e feedback loop editorial.
- Explicabilidade: templates textuais e visuais de explicações do MAL/OIF com exemplos de justificativas e grafos.
- Governança MOC: guias conceituais de definição de políticas, precedências e escopos com exemplos de configuração.
- Padronização: normalizar `index.md`, frontmatter, taxonomias e campos obrigatórios; checklist de validação.
- Navegação: reforçar interlinks e breadcrumbs conceituais; atualizar scripts de navegação dinâmica.
- Harmonização PT↔EN: alinhar estrutura e profundidade por seções-chave e manter paridade mínima.
- Métricas: estabelecer KPIs editoriais e automações de auditoria para monitoramento contínuo.

## 3. Etapas de Implementação (Sequenciais)

1) Planejamento e Padronização
- Definir padrão de frontmatter (título, descrição, tags, framework, maturidade).
- Mapear diretórios com `index.md` faltantes (usar relatórios atuais) e priorizar criação.

2) Normalização Estrutural
- Criar/ajustar `index.md` em: `pt/docs/frameworks/*`, `pt/docs/manual/*`, `pt/docs/quickstart/*` e `pt/docs/examples/*`.
- Unificar taxonomias e metadados; aplicar checklist de consistência.

3) Conteúdo Conceitual (novas páginas)
- `pt/docs/examples/roteiros-conceituais.md`
- `pt/docs/frameworks/inferencia-raciocinio.md` (DL/Datalog, KGE, GNN)
- `pt/docs/manual/tools/explicabilidade.md` (templates XAI/NLG + Mermaid)
- `pt/docs/manual/governanca-moc.md` (precedências, escopos, exemplos)
- `pt/docs/manual/tools/feedback-loop.md` (métricas, triggers ZOF)

4) Interlinks e Navegação
- Adicionar links cruzados entre frameworks, manual, quickstart e exemplos.
- Atualizar e rodar scripts de auditoria/navegação para refletir novas páginas.

5) Harmonização PT↔EN
- Revisar seções correlatas em EN; garantir paridade mínima e notas quando divergirem.

6) Validação e QA
- Executar checklist editorial: estrutura, frontmatter, links, clareza.
- Medir KPIs iniciais e registrar baseline.

## 4. Prazos Realistas (Sprints)

- Semana 1: Planejamento e padronização; inventário `index.md` faltantes; definição de frontmatter.
- Semana 2: Normalização estrutural; criação dos `index.md` faltantes; ajuste de metadados.
- Semana 3: Produção dos roteiros conceituais e página de inferência/raciocínio.
- Semana 4: Explicabilidade (templates + exemplos) e governança MOC.
- Semana 5: Feedback loop editorial e interlinks; atualizar navegação dinâmica.
- Semana 6: Harmonização PT↔EN; QA final; medição de KPIs; handoff.

## 5. Recursos Necessários

- Humanos:
  - Estratégia de Conteúdo (1): padronização, escopo e estilo.
  - Engenheiro de Conhecimento (1): DL/Datalog, KGE, GNN conceitos.
  - UX Writer/Editor (1): explicabilidade e narrativa.
  - Maintainer Nuxt Content (1): navegação, frontmatter, scripts.

- Técnicos:
  - `Nuxt Content` e scripts internos (`scripts/content-audit.js`, `dynamic-navigation`).
  - `Mermaid` para fluxogramas em Markdown.
  - Relatórios de auditoria JSON existentes para verificação.

- Temporais (por fase):
  - Planejamento: 1 semana (part-time de todos).
  - Estrutura: 1 semana (editor + maintainer).
  - Conteúdo: 2 semanas (conteúdo + conhecimento).
  - Explicabilidade/Governança: 1 semana (UX + conteúdo).
  - Navegação/Harmonização/QA: 1–2 semanas (todos).

## 6. Métricas de Sucesso

- Completude Estrutural: % diretórios com `index.md` (meta ≥ 95%).
- Consistência de Frontmatter: % páginas com metadados padrão (meta ≥ 95%).
- Integridade de Links: taxa de links válidos (meta ≥ 98%).
- Cobertura Conceitual: nº de páginas novas por tema (meta ≥ 5 principais).
- Explicabilidade: nº de templates e exemplos publicados (meta ≥ 3 por framework).
- Harmonização PT↔EN: % de seções com paridade mínima (meta ≥ 90%).
- Engajamento: visualizações/tempo médio nas páginas novas (baseline + +20%).
- Qualidade Epistêmica: checklist MEP aprovado (meta ≥ 90%).

## Entregáveis

- Páginas normalizadas com `index.md` e frontmatter padronizado.
- Novos conteúdos conceituais (roteiros, inferência, RL/FL, feedback).
- Templates de explicabilidade com exemplos visuais/narrativos.
- Navegação dinâmica atualizada e interlinks reforçados.
- Relatório final de KPIs e checklist de validação.

## Riscos & Mitigações

- Sobrecarga editorial: priorizar por impacto; limitar escopo por sprint.
- Divergência PT↔EN: definir paridade mínima e notas de diferença.
- Complexidade técnica nos conceitos: foco conceitual sem prescrever implementação.

---
Este plano orienta melhorias focadas, mensuráveis e iterativas para robustez e eficiência da documentação PT, alinhadas aos princípios do Protocolo Matrix.