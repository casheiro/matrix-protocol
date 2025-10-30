---
title: Ontologia de Suporte MEF
description: Vocabulários controlados de referência para estrutura de UKIs e implementação do Matrix Embedding Framework
tags:
  - frameworks
  - mef
  - ontology
  - core
keywords:
  - MEF ontologia suporte
  - Matrix Protocol vocabulários
  - vocabulários controlados
  - UKI estrutura conhecimento
  - MEF implementation framework
  - ontological reference vocabularies
framework: MEF
icon: i-heroicons-cube
layout: docs
sidebar: true
toc: true
navigation: true
lang: pt
last_updated: 2025-10-21T00:00:00.000Z
order: 2
---
# Ontologia de Suporte MEF — MEF Support Ontology
**Acrônimo:** MEF Support Ontology  
**Versão:** 0.0.1-beta  
**Última Atualização:** 2025-10-05  

> ⚠️ **IMPORTANTE**: Este documento é uma tradução informativa.

> 🚨 **AVISO IMPORTANTE**: Este documento contém **APENAS EXEMPLOS ILUSTRATIVOS** (como `technical`, `business`, `draft`, etc.) que NÃO são taxonomias obrigatórias. O **MOC (Matrix Ontology Catalog)** é a única fonte definitiva para taxonomias organizacionais.

---

## 1. Introdução

A **Ontologia de Suporte MEF** define os vocabulários controlados de referência que podem ser utilizados na estrutura das UKIs, servindo como conjunto inicial (starter set) para organizações implementando o Matrix Embedding Framework.

Este documento fornece exemplos ilustrativos de domínios, tipos, relacionamentos e outros elementos estruturais que organizações podem usar como ponto de partida ao configurar seu próprio MOC organizacional.

É importante enfatizar que estes são **exemplos de referência**, não taxonomias obrigatórias.

---

## 2. Termos e Definições

- **Vocabulários Controlados**: Conjuntos padronizados de termos para garantir consistência
- **Starter Set**: Conjunto inicial de exemplos para facilitar implementação
- **Domínios de Referência**: Exemplos de áreas de conhecimento organizacional
- **Tipos de UKI**: Categorias estruturais de unidades de conhecimento
- **Relacionamentos Ontológicos**: Conexões semânticas entre UKIs
- **Níveis de Severidade**: Classificações de impacto de mudanças

Referências definitivas no **MOC organizacional** para taxonomias específicas validadas.

---

## 3. Conceitos Centrais

### Princípio de Flexibilidade Organizacional
Todos os elementos neste documento são **sugestões configuráveis**:
- Organizações podem usar como base
- Podem adicionar elementos específicos 
- Podem modificar ou remover conforme necessidade
- Devem definir hierarquias próprias no MOC

### Separação Referência vs Implementação
- **Este Documento**: Exemplos ilustrativos e orientações
- **MOC Organizacional**: Definições autoritativas específicas
- **Implementações**: Devem consultar MOC, não este documento

---

## 4. Regras Normativas

> ⚠️ Esta seção é **normativa**.

### Uso de Vocabulários de Referência
- Organizações PODEM usar os exemplos deste documento como ponto de partida
- Organizações DEVEM definir seus vocabulários específicos no MOC organizacional
- Sistemas DEVEM validar campos UKI contra o MOC organizacional, não contra este documento
- Implementações DEVEM tratar este documento apenas como referência ilustrativa

### Extensibilidade Controlada
- Vocabulários PODEM ser estendidos através do MOC organizacional
- Validação semântica DEVE ser centralizada no MOC
- Mudanças DEVEM seguir processo de governança organizacional definido

---

## 5. Interoperabilidade

- **MEF (Matrix Embedding Framework)**: Usa vocabulários definidos no MOC organizacional
- **MOC (Matrix Ontology Catalog)**: Fonte autoritativa de todos os vocabulários organizacionais
- **ZOF (Zion Orchestration Framework)**: Consulta vocabulários durante checkpoint EvaluateForEnrich
- **OIF (Operator Intelligence Framework)**: Aplica vocabulários na filtragem e explicações

---

## 6. Convenções e Exemplos

Todos os exemplos neste documento são **meramente ilustrativos** e não definem comportamento normativo.  
A semântica normativa (escopos, governança, arquétipos, critérios de enriquecimento) é sempre derivada do **MOC (Matrix Ontology Catalog)** de cada organização.  
Os exemplos são fornecidos para fins de clareza e PODEM ser adaptados aos contextos locais, mas NÃO DEVEM ser tratados como obrigações no nível do protocolo.

---

## 7. Exemplos Ilustrativos (Apêndice)

> **Exemplo (Informativo, Dependente do MOC)**

### **Domínios de Referência**
```yaml


# --- Exemplos Ilustrativos ---
domains_examples:
  strategy: "Decisões de alto nível, planejamento estratégico"
  operations: "Processos operacionais, execução e procedimentos"
  security: "Segurança, proteção e gerenciamento de riscos"
  governance: "Governança, controle e supervisão"
  communication: "Comunicação, colaboração e relacionamentos"

# Sua organização pode usar termos completamente diferentes:
alternative_domains:
  inovacao: "Processos de inovação organizacional"
  qualidade: "Gestão da qualidade e melhoria contínua"
  sustentabilidade: "Práticas sustentáveis e responsabilidade ambiental"
  experiencia_cliente: "Gestão da experiência do cliente"
```


### **Tipos de UKI de Referência**
```yaml


# --- Exemplos Ilustrativos ---
types_examples:
  pattern: "Solução reutilizável para problema comum"
  rule: "Lógica de negócio ou restrição"
  guideline: "Recomendação de boa prática"
  template: "Formato estruturado para uso específico"
  constraint: "Limitação ou requisito"
  decision: "Escolha estratégica ou tática feita"
  example: "Instância concreta de implementação"

# Sua organização pode usar categorias específicas:
alternative_types:
  procedimento: "Sequência operacional padronizada"
  politica: "Diretriz institucional organizacional"
  metrica: "Indicador quantitativo de desempenho"
  conceito: "Definição ou modelo teórico"
```


### **Relacionamentos Ontológicos**
```yaml


# --- Exemplos Ilustrativos ---
relationship_types:
  depends_on: "Depende semanticamente de outra UKI"
  overrides: "Substitui ou anula conteúdo de outra UKI"
  conflicts_with: "Contradiz propositalmente outra UKI"
  complements: "Expande ou detalha outra UKI"
  amends: "Corrige ou atualiza parcialmente"
  precedes: "Estabelece ordem ou prioridade"
  equivalent_to: "Representa equivalência semântica"

relationship_usage_examples:
  dependency_example:
    source: "uki:technical:pattern:jwt-authentication"
    target: "uki:technical:constraint:security-requirements"
    type: "depends_on"
    description: "Implementa requisitos de segurança definidos"
  
  override_example:
    source: "uki:technical:pattern:oauth2-enhanced"
    target: "uki:technical:pattern:basic-auth-deprecated"
    type: "overrides"
    description: "Substitui padrão de autenticação básica obsoleto"
```


### **Níveis de Severidade**
```yaml


# --- Exemplos Ilustrativos ---
severity_levels:
  low:
    description: "Impacto menor, informacional ou sugestões"
    impact: "Impacto mínimo nos negócios ou técnico"
    examples: ["melhorias de documentação", "sugestões de otimização"]
  
  medium:
    description: "Impacto moderado, afeta funcionalidades específicas"
    impact: "Impacto localizado na funcionalidade"
    examples: ["mudanças em API não crítica", "ajustes de processo"]
  
  high:
    description: "Impacto significativo, afeta funcionalidades centrais"
    impact: "Impacto substancial na funcionalidade do sistema"
    examples: ["mudanças em API crítica", "alterações arquiteturais"]
  
  critical:
    description: "Impacto crítico, falha do sistema ou grande disrupção"
    impact: "Impacto severo causando falha ou disrupção major"
    examples: ["mudanças que quebram compatibilidade", "alterações de segurança críticas"]
```


### **Ciclo de Vida**
```yaml


# --- Exemplos Ilustrativos ---
lifecycle_states:
  active:
    description: "UKI ativa e em uso normal"
    usage: "Conhecimento atual e válido"
    actions: ["pode ser referenciada", "pode ser atualizada"]
  
  deprecated:
    description: "UKI descontinuada mas ainda referenciada"
    usage: "Conhecimento obsoleto, evitar uso"
    actions: ["não usar em novas implementações", "migrar para alternativa"]
  
  archived:
    description: "UKI arquivada para consulta histórica"
    usage: "Preservação histórica, não usar"
    actions: ["consulta apenas histórica", "não referenciar"]
```


### **Guia de Customização Organizacional**
```yaml


# --- Exemplo de Como Customizar ---
customization_guide:
  step_1_analysis:
    - "Analise domínios específicos da sua organização"
    - "Identifique tipos de conhecimento únicos do seu contexto"
    - "Mapeie relacionamentos importantes para seu negócio"
  
  step_2_moc_definition:
    - "Defina hierarquias no seu MOC organizacional"
    - "Estabeleça regras de governança específicas"
    - "Configure critérios de avaliação apropriados"
  
  step_3_validation:
    - "Configure validação automática baseada no MOC"
    - "Estabeleça processo de evolução de vocabulários"
    - "Implemente monitoramento de consistência"

example_organizational_vocabulary:
  # Exemplo para empresa de tecnologia financeira
  fintech_domains:
    - "pagamentos"
    - "credito"
    - "compliance_financeiro"
    - "experiencia_usuario"
    - "seguranca_financeira"
  
  # Exemplo para empresa de healthcare
  healthcare_domains:
    - "clinico"
    - "regulatorio_saude"
    - "privacidade_paciente"
    - "qualidade_atendimento"
    - "interoperabilidade_sistemas"
```
