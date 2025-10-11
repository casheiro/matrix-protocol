# ZOF — Zion Orchestration Framework
**Acrônimo:** ZOF  
**Versão:** 0.0.1-beta  
**Última Atualização:** 2025-10-05  

> ⚠️ **IMPORTANTE**: Este documento é uma tradução informativa.

> 🚨 **AVISO IMPORTANTE**: Este documento contém EXEMPLOS ILUSTRATIVOS (como `strategy`, `operations`, etc.) que NÃO são taxonomias obrigatórias. O **MOC (Matrix Ontology Catalog)** é a única fonte definitiva para taxonomias organizacionais.

---

## 1. Introdução

O **Zion Orchestration Framework (ZOF)** especifica de forma conceitual e padronizada o framework de fluxos de trabalho para equipes orientadas a IA, definindo como descrever, executar e governar workflows como máquinas de estado independentes de tecnologia.

O ZOF define um **modelo conceitual para fluxos de trabalho orientados a IA** que permite que equipes multidisciplinares descrevam workflows como máquinas de estado independentes de tecnologia seguindo o padrão: **Evento → Consulta Oráculo → Decisão → Ação → Avaliação → Enriquecimento Condicional do Oráculo**.

O ZOF não prescreve ferramentas, motores de orquestração ou implementações técnicas - apenas direciona **como pensar e registrar o caminho** de forma conceitual, rastreável e governada.

---

## 2. Termos e Definições

- **Estados Canônicos**: Sequência universal de estados em workflows (Intake → Understand → Decide → Act → EvaluateForEnrich → Review → Enrich)
- **EvaluateForEnrich**: Checkpoint obrigatório para avaliação de enriquecimento
- **Eventos Canônicos**: Gatilhos padrão para workflows (knowledge.added, work.proposed, etc.)
- **Sinais de Explicabilidade**: Contexto, decisão e resultado registrados em cada estado
- **can_enrich?()**: Função de filtro cognitivo para decisão de enriquecimento

Referências adicionais no **MOC (Matrix Ontology Catalog)** para taxonomias organizacionais específicas.

---

## 3. Conceitos Centrais

### Essência do ZOF em 3 Conceitos

**1. Fluxo Pensado como Estado**
- Todo trabalho é uma jornada: Recebo → Entendo → Decido → Faço → Avalio → (Possivelmente) Ensino
- Cada transição é consciente: sei por que mudei de estado
- Explicabilidade é natural: registro contexto, decisão e resultado

**2. Oracle como Conselheiro Inteligente**
- Antes de decidir qualquer coisa, consulto o Oracle: "O que já sabemos sobre isso?"
- Oracle me retorna apenas conhecimento que tenho autoridade para ver (via MOC)
- No final, posso ensinar o Oracle se aprendi algo verdadeiramente novo

**3. Governança via MOC (Matrix Ontology Catalog)**
- MOC define quem pode criar conhecimento em qual escopo/domínio
- MOC estabelece critérios organizacionais para validar se vale a pena ensinar o Oracle
- Diferentes organizações configuram diferentes regras - não há imposições globais

### O Padrão Universal
```

EVENTO → CONSULTA ORACLE → DECISÃO → AÇÃO → AVALIO SE VALE ENSINAR → (ENSINO)
```


### Estados Canônicos Obrigatórios
Todo fluxo ZOF segue esta sequência conceitual:
1. **Intake**: Captura de contexto e requisitos
2. **Understand**: Consulta obrigatória ao Oráculo (UKIs)
3. **Decide**: Decisão baseada em conhecimento existente
4. **Act**: Execução da ação planejada
5. **EvaluateForEnrich**: Checkpoint obrigatório de avaliação
6. **Review**: Validação opcional do resultado
7. **Enrich**: Enriquecimento condicional do Oráculo

---

## 4. Regras Normativas

> ⚠️ Esta seção é **normativa**.

### Estados Canônicos Obrigatórios
Todos os workflows ZOF DEVEM seguir a sequência de estados canônicos sem exceção.

### Checkpoint EvaluateForEnrich Obrigatório
- DEVE ser aplicado em todos os workflows
- DEVE consultar critérios definidos no MOC organizacional
- DEVE gerar justificativa epistemológica para decisões
- DEVE respeitar autoridades e escopos do MOC
- DEVE detectar tipos de conflito H1/H2/H3 e invocar MAL se resolução local falhar
- DEVE aplicar decisões MAL quando arbitragem for necessária
- DEVE aplicar validação scope_mode para cenários de enriquecimento multi-escopo

### Sinais de Explicabilidade Obrigatórios
Cada transição de estado DEVE registrar:
- **context**: O que entrou no estado
- **decision**: Por que transicionou
- **result**: O que saiu do estado

### Consulta Oracle Obrigatória
O estado **Understand** DEVE sempre consultar o Oracle (UKIs) antes de qualquer decisão.

### Função can_enrich?() Requisitos
- DEVE implementar avaliação de novidade semântica
- DEVE implementar avaliação de valor prático
- DEVE implementar validação de autoridade via MOC
- PODE implementar critérios organizacionais adicionais

### Regras de Transição de Estado
- Transições de estado DEVEM ser sequenciais e não podem pular estados
- Cada estado DEVE completar antes de transicionar para o próximo estado
- Estado Understand DEVE receber resultados de consulta Oracle antes de prosseguir
- EvaluateForEnrich DEVE completar avaliação antes de permitir estado Enrich
- Avaliações falhadas PODEM terminar o fluxo ou requerer remediação
- Arbitragem MAL DEVE ser invocada na detecção de conflito durante EvaluateForEnrich
- Decision Records MAL DEVEM ser aplicados através de ações apropriadas (gate_enrich, deprecate, partition_scope, etc.)

### Implementação de Modo de Escopo
- **Modo Restrito**: Conhecimento permanece dentro do nível de escopo de origem
- **Modo Propagado**: Conhecimento pode cascatear para níveis de escopo superiores via promoção
- Modo de escopo DEVE ser declarado durante criação de UKI
- Promoção entre escopos DEVE seguir regras de governança MOC

### 🌐 Enriquecimento Multi-scope Cross-domain (Normativo)

ZOF DEVE implementar regras específicas para operações de enriquecimento que cruzam múltiplas fronteiras de escopo ou domínio.

#### Detecção de Enriquecimento Cross-boundary
```yaml

# --- Configuração Normativa ---
cross_boundary_detection:
  scope_crossing:
    source_scope: "team"              # UKI origina do escopo team
    enrichment_target_scope: "tribe"   # Enriquecimento visa escopo tribe
    classification: "scope_crossing"
    
  domain_crossing:
    source_domain: "technical"         # UKI origina do domínio technical
    enrichment_target_domain: "business" # Enriquecimento visa domínio business
    classification: "domain_crossing"
    
  multi_boundary_crossing:
    source: {scope: "team", domain: "technical"}
    target: {scope: "tribe", domain: "business"}
    classification: "multi_boundary_crossing"
```


#### Validação de Autoridade para Enriquecimento Cross-boundary
- **Verificação de Autoridade Hierárquica**: Usuário DEVE ter autoridade em AMBAS as hierarquias origem e destino
- **Validação Cross-domain**: Para cruzamento de domínio, usuário DEVE ter domain_access para ambos os domínios no MOC
- **Caminho de Escalação**: Se usuário carecer de autoridade cross-boundary, DEVE rotear para caminho de escalação via MOC
- **Aprovação Conjunta**: Cruzamento multi-boundary PODE requerer aprovação de autoridades em múltiplas hierarquias

#### Regras de Enriquecimento Cross-boundary
```yaml

# --- Regras Normativas ---
cross_boundary_enrichment_rules:
  scope_crossing_rules:
    upward_promotion:                    # team → tribe, tribe → org
      authority_requirement: "source_scope_authority + promotion_rights"
      approval_process: "hierarchical_escalation"
      rationale_requirement: "mandatory_promotion_rationale"
    
    lateral_crossing:                    # team-a → team-b
      authority_requirement: "both_scope_authority OR superior_authority"
      approval_process: "peer_approval OR escalation"
      conflict_resolution: "invoke_MAL_if_contested"
  
  domain_crossing_rules:
    technical_to_business:
      authority_requirement: "multi_domain_access"
      validation_criteria: "business_value_assessment + technical_accuracy"
      review_process: "cross_domain_review_committee"
    
    cross_domain_conflict_resolution:
      detection: "semantic_conflicts_across_domains"
      resolution: "invoke_MAL_with_cross_domain_context"
      outcome_application: "domain_specific_actions"
```


#### EvaluateForEnrich para Operações Cross-boundary
- **Critérios Estendidos**: Enriquecimento cross-boundary DEVE aplicar critérios de avaliação adicionais do MOC
- **Análise de Impacto**: DEVE avaliar impacto em ambas as hierarquias origem e destino
- **Detecção de Conflito**: DEVE detectar potenciais conflitos semânticos através de fronteiras
- **Validação de Autoridade**: DEVE validar autoridade para todos os níveis hierárquicos afetados
- **Modo de Validação de Escopo**: DEVE aplicar configuração scope_mode para cenários multi-escopo
- **Invocação MAL**: DEVE invocar MAL para conflitos cross-boundary que não podem ser resolvidos localmente

#### 🎯 Configuração de Modo de Escopo (Normativo)

O ZOF DEVE implementar validação scope_mode para operações de enriquecimento que afetam múltiplos escopos.

##### Tipos de Modo de Escopo
```yaml

# --- Configuração Normativa ---
scope_mode_validation:
  validation_types:
    any:                               # Satisfazer um escopo é suficiente
      description: "Enriquecimento aprovado se QUALQUER escopo afetado validar com sucesso"
      use_case: "Compartilhamento amplo de conhecimento, colaboração inter-equipes"
      authority_requirement: "minimum_scope_authority"
      validation_logic: "Operação OR em todos os escopos afetados"
      
    all:                               # Todos os escopos devem validar
      description: "Enriquecimento aprovado apenas se TODOS os escopos afetados validarem com sucesso"
      use_case: "Governança rigorosa, conhecimento crítico de conformidade"
      authority_requirement: "maximum_scope_authority"
      validation_logic: "Operação AND em todos os escopos afetados"

  configuration_source: "política organizacional MOC"
  default_behavior: "all"              # Padrão conservador para segurança
  
  scope_mode_determination:
    explicit_configuration:            # Organização define scope_mode no MOC
      source: "configuração evaluation_criteria do MOC"
      precedence: "highest"
      
    knowledge_type_based:              # Baseado no tipo de UKI (policy vs guideline)
      policy_knowledge: "all"          # Políticas requerem validação de todos os escopos
      guideline_knowledge: "any"       # Guidelines podem usar validação de qualquer escopo
      precedence: "medium"
      
    fallback_default: "all"            # Fallback conservador
    precedence: "lowest"
```


##### Exemplos de Aplicação do Modo de Escopo
```yaml

# --- Exemplos Ilustrativos ---
scope_mode_scenarios:
  scenario_1_cross_team_guideline:
    context: "Guideline de desenvolvimento da team-a enriquecendo escopo team-b"
    affected_scopes: ["team-a", "team-b"]
    knowledge_type: "guideline"
    scope_mode: "any"                  # Validação de qualquer equipe suficiente
    validation_result: "APROVADO se team-a OU team-b validar"
    
  scenario_2_organizational_policy:
    context: "Política de segurança afetando múltiplos níveis organizacionais"
    affected_scopes: ["squad", "tribe", "organization"]
    knowledge_type: "policy"
    scope_mode: "all"                  # Todos os níveis devem validar
    validation_result: "APROVADO apenas se squad E tribe E organization validarem"
    
  scenario_3_domain_crossing:
    context: "Conhecimento técnico enriquecendo domínio business"
    affected_scopes: ["technical", "business"]
    knowledge_type: "pattern"
    scope_mode: "any"                  # Compartilhamento cross-domain encorajado
    validation_result: "APROVADO se technical OU business validar"
```


##### Integração com Autoridade MOC
- **Mapeamento de Autoridade**: scope_mode DEVE respeitar hierarquias de autoridade MOC para cada escopo afetado
- **Caminhos de Escalação**: Falha de validação no modo "all" DEVE fornecer caminhos de escalação do MOC
- **Trilha de Auditoria**: Todas as decisões de validação de escopo DEVEM ser registradas com justificativa scope_mode

---

## 5. Interoperabilidade

- **MEF (Matrix Embedding Framework)**: Fornece estrutura UKI consumida e produzida pelos workflows; persiste Decision Records MAL
- **MOC (Matrix Ontology Catalog)**: Define taxonomias e critérios para checkpoint EvaluateForEnrich; configura políticas de arbitragem MAL
- **OIF (Operator Intelligence Framework)**: Implementa arquétipos que executam workflows ZOF; explica resultados de arbitragem MAL aos usuários
- **MEP (Matrix Epistemic Principle)**: Estabelece fundamentos epistemológicos para enriquecimento; fornece base para justificativas epistêmicas MAL
- **MAL (Matrix Arbiter Layer)**: Invocada pelo ZOF quando EvaluateForEnrich detecta conflitos não resolúveis (H1/H2/H3); fornece decisões de arbitragem determinística; retorna ações para execução ZOF (gate_enrich, deprecate, partition_scope)

---

## 6. Convenções e Exemplos

Todos os exemplos neste documento são **meramente ilustrativos** e não definem comportamento normativo.  
A semântica normativa (escopos, governança, arquétipos, critérios de enriquecimento) é sempre derivada do **MOC (Matrix Ontology Catalog)** de cada organização.  
Os exemplos são fornecidos para fins de clareza e PODEM ser adaptados aos contextos locais, mas NÃO DEVEM ser tratados como obrigações no nível do protocolo.

---

## 7. Exemplos Ilustrativos (Apêndice)

> **Exemplo (Informativo, Dependente do MOC)**

### **Estados Canônicos com Sinais**
```yaml

# --- Exemplo Ilustrativo ---
flow_execution:
  - state: "intake"
    signals:
      context: "História de usuário para autenticação JWT recebida"
      decision: "História clara e completa, prosseguir para entendimento"
      result: "Requisitos organizados e contexto capturado"
  
  - state: "understand"
    signals:
      context: "Consultar Oracle sobre padrões de autenticação existentes"
      decision: "UKI uki:technical:pattern:jwt-authentication encontrada"
      result: "Conhecimento existente identificado e compreendido"
  
  - state: "decide"
    signals:
      context: "Baseado em UKI existente, decidir abordagem de implementação"
      decision: "Usar biblioteca recomendada conforme padrão organizacional"
      result: "Estratégia de implementação definida"
```


### **Checkpoint EvaluateForEnrich**
```yaml

# --- Exemplo Ilustrativo ---
evaluate_for_enrich:
  checkpoint_execution:
    - state: "evaluate_for_enrich"
      signals:
        context: "Implementação JWT concluída com adaptações para contexto"
        decision: "can_enrich?(resultado, contexto, critérios_MOC) = APROVADO"
        result: "Conhecimento qualifica para enriquecimento escopo 'team'"
  
  moc_criteria_applied:
    - criterion: "relevance"
      threshold: "medium"
      evaluation: "PASS - outros desenvolvedores enfrentarão mesmo problema"
    - criterion: "reusability"
      threshold: "high"
      evaluation: "PASS - solução pode ser reutilizada em outros projetos"
```


### **Perfil Mínimo can_enrich?() - Adoção Inicial**
```yaml

# --- Exemplo Ilustrativo ---
# Para organizações iniciando com ZOF, função simplificada com 3 perguntas básicas
minimum_can_enrich_profile:
  
  # 1. NOVIDADE: Há algo novo aqui?
  semantic_novelty:
    question: "Aprendi algo que não existia antes na nossa base de conhecimento?"
    examples_yes:
      - "Descobri uma nova forma de resolver X"
      - "Identifiquei um padrão que não estava documentado"
    examples_no:
      - "Apenas executei um processo já conhecido"
      - "Deploy/build rotineiro sem descobertas"
  
  # 2. UTILIDADE: Vale a pena para outros?
  practical_value:
    question: "Outros na minha equipe se beneficiariam desse conhecimento?"
    examples_yes:
      - "Outros desenvolvedores enfrentarão este problema"
      - "Esta abordagem economiza tempo significativo"
    examples_no:
      - "É específico da minha situação particular"
      - "Informação que todos já sabem"
  
  # 3. AUTORIDADE: Posso criar conhecimento neste escopo?
  basic_authority:
    question: "Tenho autoridade para criar conhecimento neste domínio?"
    simple_check: |
      if (uki_proposal.scope_ref == "team" && 
          user_context.domains.includes(uki_proposal.domain_ref)):
        return AUTHORIZED
      else:
        return REQUIRES_APPROVAL
```


### **Eventos Canônicos**
```yaml

# --- Exemplo Ilustrativo ---
canonical_events:
  knowledge.added: "Novo conteúdo disponível"
  work.proposed: "Nova proposta de trabalho"
  work.refine.requested: "Solicitação de refinamento"
  assistance.requested: "Pedido de ajuda/colaboração"
  test.authored: "Cenários de teste criados"
  feedback.submitted: "Correção/aprendizado"

workflow_patterns:
  request_flow: "Implementação de nova funcionalidade"
  refinement_flow: "Otimização de processo existente"
  ingestion_flow: "Processamento de documentação externa"
  assistance_flow: "Suporte técnico estruturado"
  testing_flow: "Criação de cenários de teste"
  feedback_flow: "Processamento de correções"
```


### **Implementação Livre**
```yaml

# --- Exemplo Ilustrativo ---
zof_prescribes:
  how_to_think: "Como estruturar o pensamento do fluxo"
  when_to_consult: "Quando consultar o Oracle"
  how_to_evaluate: "Como avaliar se vale ensinar algo novo"
  how_to_record: "Como registrar explicabilidade das decisões"

zof_does_not_prescribe:
  which_tools: "Qual ferramenta usar (Jira, GitHub, Slack, etc.)"
  how_to_implement: "Como implementar tecnicamente"
  which_metrics: "Quais métricas coletar"
  how_to_deploy: "Como fazer deploy"

benefits:
  consistency: "Mesma forma de pensar, diferentes ferramentas"
  traceability: "Sei sempre por que tomei cada decisão"
  evolution: "Conhecimento organizacional cresce de forma governada"
  flexibility: "Cada equipe implementa com suas tecnologias"
  authority: "Respeitamos hierarquias organizacionais via MOC"
```
