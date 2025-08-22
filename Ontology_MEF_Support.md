# 📚 ONTOLOGIA AUXILIAR DE SUPORTE AO MEF | MEF AUXILIARY SUPPORT ONTOLOGY

## 🌎 Idioma / Language

- [Português 🇧🇷](#português)
- [English 🇺🇸](#english)

---

<a name="português"></a>
# Português 🇧🇷

> Ontologia Auxiliar de Suporte ao MEF (Matrix Embedding Framework)

**Versão:** 1.0
**Status:** Ativo
**Finalidade:** Definir os vocabulários controlados que devem ser utilizados na estrutura das UKIs, garantindo consistência semântica, interoperabilidade e validação automática em todas as instâncias do protocolo Matrix.

---

## 🔖 1. Domínios (`domain_of_influence` e `id`)

Lista de domínios semânticos válidos que representam as áreas principais de influência conceitual:

```yaml
domains:
  - strategy
  - operations
  - ethics
  - finance
  - security
  - governance
  - communication
  - automation
  - intelligence
```

**Descrições dos Domínios:**

| Domínio | Descrição | Área de Influência |
|---------|-----------|-------------------|
| `strategy` | Decisões de alto nível, planejamento estratégico | Direcionamento organizacional, objetivos de longo prazo |
| `operations` | Processos operacionais, execução e procedimentos | Fluxos de trabalho, execução de tarefas |
| `ethics` | Considerações éticas, compliance e responsabilidade | Conformidade regulatória, responsabilidade social |
| `finance` | Aspectos financeiros, orçamentários e econômicos | ROI, custos, decisões de investimento |
| `security` | Segurança, proteção e gerenciamento de riscos | Controles de acesso, gestão de vulnerabilidades |
| `governance` | Governança, controle e supervisão | Estruturas de controle, supervisão organizacional |
| `communication` | Comunicação, colaboração e relacionamentos | Protocolos de comunicação, fluxos informativos |
| `automation` | Automação, eficiência e otimização de processos | Processos automatizados, eficiência operacional |
| `intelligence` | Inteligência, análise e tomada de decisão | Insights estratégicos, suporte à decisão |

---

## 🧩 2. Tipos de UKIs (`type` e `id`)

Tipos formais de unidades de conhecimento (UKIs), utilizados tanto para identificação quanto para estruturação de inferência e visualização:

```yaml
types:
  - concept       # definição ou modelo teórico
  - rule          # regra operacional ou normativa
  - metric        # indicador quantitativo
  - policy        # diretriz institucional ou adaptativa
  - procedure     # sequência operacional
  - glossary      # definição de termos ou padrões
  - constraint    # limitação formal aplicada
```

**Descrições dos Tipos:**

| Tipo | Descrição | Uso Principal |
|------|-----------|---------------|
| `concept` | Definição ou modelo teórico | Conceituação, estruturas de pensamento |
| `rule` | Regra operacional ou normativa | Validação, lógica de decisão, normas |
| `metric` | Indicador quantitativo | Medição, avaliação, monitoramento |
| `policy` | Diretriz institucional ou adaptativa | Orientação organizacional, políticas |
| `procedure` | Sequência operacional | Processos, fluxos de trabalho, execução |
| `glossary` | Definição de termos ou padrões | Padronização terminológica, referências |
| `constraint` | Limitação formal aplicada | Restrições, limitações, controles |

---

## 🔗 3. Tipos de Relacionamentos (`relationships.type`)

Relações formais entre UKIs, utilizadas para inferência semântica, navegação em grafos e validação de coerência:

```yaml
relationship_types:
  - depends_on       # depende semanticamente de outra UKI
  - overrides        # substitui ou anula o conteúdo de outra UKI
  - conflicts_with   # contradiz propositalmente outra UKI
  - complements      # expande ou detalha outra UKI
  - amends           # corrige ou atualiza parcialmente
  - precedes         # estabelece ordem ou prioridade
  - equivalent_to    # representa equivalência semântica
```

**Descrições dos Relacionamentos:**

| Tipo | Descrição | Uso Principal |
|------|-----------|---------------|
| `depends_on` | Depende semanticamente de outra UKI | Dependências estruturais |
| `overrides` | Substitui ou anula o conteúdo de outra UKI | Substituições diretas |
| `conflicts_with` | Contradiz propositalmente outra UKI | Incompatibilidades intencionais |
| `complements` | Expande ou detalha outra UKI | Extensões colaborativas |
| `amends` | Corrige ou atualiza parcialmente | Correções e ajustes |
| `precedes` | Estabelece ordem ou prioridade | Sequências e hierarquias |
| `equivalent_to` | Representa equivalência semântica | Equivalências e sinônimos |

---

## 📉 4. Níveis de Severidade de Impacto (`impact_analysis.severity`)

```yaml
severity_levels:
  - low
  - medium
  - high
  - critical
```

**Descrições dos Níveis:**

| Nível | Descrição | Impacto |
|-------|-----------|---------|
| `low` | Impacto menor, informacional ou sugestões de melhoria | Impacto mínimo nos negócios ou técnico |
| `medium` | Impacto moderado, afeta funcionalidades ou processos específicos | Impacto localizado na funcionalidade ou experiência |
| `high` | Impacto significativo, afeta funcionalidades centrais ou operações | Impacto substancial na funcionalidade do sistema |
| `critical` | Impacto crítico, falha do sistema ou grande disrupção | Impacto severo causando falha ou disrupção major |

---

## ⏳ 5. Ciclo de Vida (`status`)

```yaml
status_values:
  - active
  - deprecated
  - archived
```

**Descrições dos Status:**

| Status | Descrição | Uso |
|--------|-----------|-----|
| `active` | UKI ativa e em uso normal | Conhecimento atual e válido |
| `deprecated` | UKI descontinuada mas ainda referenciada | Conhecimento obsoleto, evitar uso |
| `archived` | UKI arquivada para consulta histórica | Preservação histórica, não usar |

---

## 📌 Observações Finais

* **Aplicação Obrigatória**: Todos os valores aqui definidos devem ser aplicados exatamente como descritos.
* **Extensibilidade Controlada**: Este vocabulário pode ser estendido, mas somente com validação semântica centralizada.
* **Validação Automatizada**: Sistemas automatizados devem validar os campos das UKIs com base nestes conjuntos controlados.
* **Integração Normativa**: Este documento integra a base normativa do Protocolo Matrix e deve acompanhar qualquer implementação ou revisão futura do MEF.

---
# English 🇺🇸

> MEF Auxiliary Support Ontology (Matrix Embedding Framework)

**Version:** 1.0
**Status:** Active
**Purpose:** Define the controlled vocabularies that must be used in UKI structures, ensuring semantic consistency, interoperability, and automatic validation across all Matrix protocol instances.

---

## 🔖 1. Domains (`domain_of_influence` and `id`)

List of valid semantic domains representing the main areas of conceptual influence:

```yaml
domains:
  - strategy
  - operations
  - ethics
  - finance
  - security
  - governance
  - communication
  - automation
  - intelligence
```

**Domain Descriptions:**

| Domain | Description | Area of Influence |
|--------|-------------|-------------------|
| `strategy` | High-level decisions, strategic planning | Organizational direction, long-term objectives |
| `operations` | Operational processes, execution and procedures | Workflows, task execution |
| `ethics` | Ethical considerations, compliance and responsibility | Regulatory compliance, social responsibility |
| `finance` | Financial, budgetary and economic aspects | ROI, costs, investment decisions |
| `security` | Security, protection and risk management | Access controls, vulnerability management |
| `governance` | Governance, control and oversight | Control structures, organizational oversight |
| `communication` | Communication, collaboration and relationships | Communication protocols, information flows |
| `automation` | Automation, efficiency and process optimization | Automated processes, operational efficiency |
| `intelligence` | Intelligence, analysis and decision making | Strategic insights, decision support |

---

## 🧩 2. UKI Types (`type` and `id`)

Formal types of knowledge units (UKIs), used for both identification and structuring of inference and visualization:

```yaml
types:
  - concept       # definition or theoretical model
  - rule          # operational or normative rule
  - metric        # quantitative indicator
  - policy        # institutional or adaptive guideline
  - procedure     # operational sequence
  - glossary      # definition of terms or standards
  - constraint    # formal limitation applied
```

**Type Descriptions:**

| Type | Description | Primary Use |
|------|-------------|-------------|
| `concept` | Definition or theoretical model | Conceptualization, thought structures |
| `rule` | Operational or normative rule | Validation, decision logic, standards |
| `metric` | Quantitative indicator | Measurement, evaluation, monitoring |
| `policy` | Institutional or adaptive guideline | Organizational guidance, policies |
| `procedure` | Operational sequence | Processes, workflows, execution |
| `glossary` | Definition of terms or standards | Terminological standardization, references |
| `constraint` | Formal limitation applied | Restrictions, limitations, controls |

---

## 🔗 3. Relationship Types (`relationships.type`)

Formal relations between UKIs, used for semantic inference, graph navigation, and coherence validation:

```yaml
relationship_types:
  - depends_on       # semantically depends on another UKI
  - overrides        # replaces or nullifies content of another UKI
  - conflicts_with   # intentionally contradicts another UKI
  - complements      # expands or details another UKI
  - amends           # corrects or partially updates
  - precedes         # establishes order or priority
  - equivalent_to    # represents semantic equivalence
```

**Relationship Descriptions:**

| Type | Description | Primary Use |
|------|-------------|-------------|
| `depends_on` | Semantically depends on another UKI | Structural dependencies |
| `overrides` | Replaces or nullifies content of another UKI | Direct replacements |
| `conflicts_with` | Intentionally contradicts another UKI | Intentional incompatibilities |
| `complements` | Expands or details another UKI | Collaborative extensions |
| `amends` | Corrects or partially updates | Corrections and adjustments |
| `precedes` | Establishes order or priority | Sequences and hierarchies |
| `equivalent_to` | Represents semantic equivalence | Equivalences and synonyms |

---

## 📉 4. Impact Severity Levels (`impact_analysis.severity`)

```yaml
severity_levels:
  - low
  - medium
  - high
  - critical
```

**Level Descriptions:**

| Level | Description | Impact |
|-------|-------------|--------|
| `low` | Minor impact, informational or enhancement suggestions | Minimal business or technical impact |
| `medium` | Moderate impact, affects specific functionality or processes | Localized impact on functionality or experience |
| `high` | Significant impact, affects core functionality or operations | Substantial impact on system functionality |
| `critical` | Critical impact, system failure or major disruption | Severe impact causing failure or major disruption |

---

## ⏳ 5. Lifecycle (`status`)

```yaml
status_values:
  - active
  - deprecated
  - archived
```

**Status Descriptions:**

| Status | Description | Usage |
|--------|-------------|-------|
| `active` | UKI active and in normal use | Current and valid knowledge |
| `deprecated` | UKI discontinued but still referenced | Obsolete knowledge, avoid use |
| `archived` | UKI archived for historical reference | Historical preservation, do not use |

---

## 📌 Final Notes

* **Mandatory Application**: All values defined here must be applied exactly as described.
* **Controlled Extensibility**: This vocabulary can be extended, but only with centralized semantic validation.
* **Automated Validation**: Automated systems must validate UKI fields based on these controlled sets.
* **Normative Integration**: This document integrates the normative base of the Matrix Protocol and must accompany any implementation or future revision of MEF.