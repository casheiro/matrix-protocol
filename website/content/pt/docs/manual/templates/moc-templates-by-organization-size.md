---
title: Templates MOC por Porte
description: Templates de Catálogo de Ontologia Matrix adaptados para organizações de diferentes portes, desde startups até grandes empresas
keywords:
  - Matrix Protocol
  - templates MOC
  - porte organizacional
  - startup
  - scale-up
  - enterprise
  - corporação
  - hierarquias organizacionais
  - governança empresarial
  - customização MOC
  - implementação gradual
framework: general
icon: i-heroicons-document-duplicate
layout: docs
sidebar: true
toc: true
navigation: true
lang: pt
last_updated: 2025-10-21T00:00:00.000Z
order: 10
maturity: stable
tags:
  - manual
  - templates
  - organizational
---
# Templates MOC por Porte Organizacional
**Templates de Catálogo de Ontologia Matrix para Diferentes Tipos de Organização**

**Versão:** 0.0.1-beta  
**Data:** 2025-10-05  
**Compatibilidade:** Protocolo Matrix v0.0.1-beta  

> 🎯 **Propósito**: Fornecer templates MOC prontos para uso adaptados para organizações de diferentes portes, desde startups até grandes empresas.

---

## 📊 Visão Geral dos Templates

| Tipo de Template | Porte da Organização | Funcionários | Complexidade | Hierarquias | Tempo de Implementação |
|------------------|----------------------|--------------|--------------|-------------|------------------------|
| **Startup**      | Pequena              | 5-50         | Simples      | 4 centrais  | 2-3 meses              |
| **Scale-up**     | Média                | 50-200       | Moderada     | 5-6         | 3-4 meses              |
| **Enterprise**   | Grande               | 200-1000     | Complexa     | 6-7         | 4-6 meses              |
| **Corporação**   | Muito Grande         | 1000+        | Avançada     | 7+          | 6-12 meses             |

---

## 🚀 Template Startup (5-50 funcionários)

### Contexto
- **Estágio:** Crescimento inicial, foco em product-market fit
- **Estrutura:** Hierarquia plana, equipes multifuncionais
- **Prioridades:** Velocidade, simplicidade, captura essencial de conhecimento
- **Desafios:** Recursos limitados, mudança rápida, conhecimento na cabeça das pessoas

### Configuração MOC

```yaml


# MOC_TEMPLATE_STARTUP.yaml
moc_version: "1.0"
organizacao: "[NOME_STARTUP]"
data_criacao: "[YYYY-MM-DD]"
ultima_modificacao: "[YYYY-MM-DD]"
versao: "1.0.0"

# Otimizado para startup: apenas 4 hierarquias essenciais
hierarquias:
  escopo:
    metadata:
      conceito: "Alcance do conhecimento e visibilidade da equipe"
      regras_governanca: |
        Modelo simples de 2 níveis: Indivíduo → Equipe → Empresa
        Foco no compartilhamento de conhecimento e prevenção de pontos únicos de falha.
      semantica_nivel: |
        Nível 0 = Conhecimento da empresa (todos podem acessar)
        Nível 1 = Conhecimento específico da equipe (membros da equipe + liderança)
        Nível 2 = Conhecimento individual (notas pessoais, rascunhos)
        Nível mais alto = escopo mais específico.
    nos:
      - id: "empresa"
        rotulo: "Toda a Empresa"
        pai: null
        nivel: 0
        governanca:
          visibilidade: ["todos_funcionarios", "contratados"]
          propagacao: "automatica"
          autoridade_necessaria: "fundador"
          
      - id: "equipe-produto"
        rotulo: "Equipe de Produto"
        pai: "empresa"
        nivel: 1
        governanca:
          visibilidade: ["equipe_produto", "lideranca"]
          propagacao: "restrita"
          autoridade_necessaria: "lider_produto"
          
      - id: "equipe-engenharia"
        rotulo: "Equipe de Engenharia" 
        pai: "empresa"
        nivel: 1
        governanca:
          visibilidade: ["equipe_engenharia", "lideranca"]
          propagacao: "restrita"
          autoridade_necessaria: "lider_tech"
          
      - id: "equipe-operacoes"
        rotulo: "Equipe de Operações"
        pai: "empresa"
        nivel: 1
        governanca:
          visibilidade: ["equipe_ops", "lideranca"]
          propagacao: "restrita"
          autoridade_necessaria: "lider_ops"
          
      - id: "pessoal"
        rotulo: "Notas Pessoais"
        pai: null
        nivel: 2
        governanca:
          visibilidade: ["apenas_dono"]
          propagacao: "nenhuma"
          autoridade_necessaria: "proprio"

  dominio:
    metadata:
      conceito: "Áreas funcionais de conhecimento"
      regras_governanca: |
        Domínios focados em startup cobrindo funções essenciais de negócio.
        Ênfase no desenvolvimento de produto e sucesso do cliente.
    nos:
      - id: "produto"
        rotulo: "Produto e Estratégia"
        pai: null
        nivel: 0
        governanca:
          proprietarios: ["lider_produto", "fundadores"]
          revisores: ["lideres_equipe"]
          validacao_necessaria: false
          
      - id: "tecnico"
        rotulo: "Técnico e Engenharia"
        pai: null
        nivel: 0
        governanca:
          proprietarios: ["lider_tech", "devs_seniors"]
          revisores: ["equipe_engenharia"]
          validacao_necessaria: true
          
      - id: "negocio"
        rotulo: "Negócio e Operações"
        pai: null
        nivel: 0
        governanca:
          proprietarios: ["fundadores", "lider_ops"]
          revisores: ["equipe_lideranca"]
          validacao_necessaria: false
          
      - id: "cultura"
        rotulo: "Equipe e Cultura"
        pai: null
        nivel: 0
        governanca:
          proprietarios: ["fundadores", "lider_rh"]
          revisores: ["todos_funcionarios"]
          validacao_necessaria: false

  maturidade:
    metadata:
      conceito: "Níveis de validação do conhecimento"
      regras_governanca: |
        Maturidade simplificada de 3 níveis para iteração rápida.
        Foco na validação prática sobre processos formais.
      semantica_nivel: |
        Nível 0 = Rascunho (notas de trabalho, ideias)
        Nível 1 = Validado (revisado pela equipe, testado)
        Nível 2 = Padrão (adotado pela empresa, documentado)
        Nível mais alto = maior validação e adoção.
    nos:
      - id: "rascunho"
        rotulo: "Rascunho"
        pai: null
        nivel: 0
        governanca:
          auto_promocao: false
          validacao_necessaria: false
          autoridade_criacao: "qualquer_funcionario"
          frequencia_revisao_dias: 30
          
      - id: "validado"
        rotulo: "Validado pela Equipe"
        pai: "rascunho"
        nivel: 1
        governanca:
          auto_promocao: false
          validacao_necessaria: true
          autoridade_necessaria: "lider_equipe"
          revisores_necessarios: 1
          frequencia_revisao_dias: 60
          
      - id: "padrao"
        rotulo: "Padrão da Empresa"
        pai: "validado"
        nivel: 2
        governanca:
          auto_promocao: false
          validacao_necessaria: true
          autoridade_necessaria: "fundador"
          frequencia_revisao_dias: 90
          compliance_obrigatorio: true

  tipo:
    metadata:
      conceito: "Tipos de estrutura do conhecimento"
      regras_governanca: |
        Tipos essenciais de conhecimento para operações de startup.
        Ênfase em padrões práticos e decisões rápidas.
    nos:
      - id: "decisao"
        rotulo: "Registro de Decisão"
        pai: null
        nivel: 0
        governanca:
          campos_obrigatorios: ["exemplos", "justificativa"]
          aplica_dominios: ["produto", "tecnico", "negocio"]
          autoridade_validacao: "lideres_equipe"
          
      - id: "padrao"
        rotulo: "Melhores Práticas"
        pai: null
        nivel: 0
        governanca:
          campos_obrigatorios: ["exemplos"]
          aplica_dominios: ["tecnico", "produto"]
          autoridade_validacao: "especialistas_dominio"
          
      - id: "procedimento"
        rotulo: "Processo/Procedimento"
        pai: null
        nivel: 0
        governanca:
          campos_obrigatorios: ["exemplos", "passos"]
          aplica_dominios: ["negocio", "tecnico"]
          autoridade_validacao: "donos_processo"
          
      - id: "diretriz"
        rotulo: "Orientação"
        pai: null
        nivel: 0
        governanca:
          campos_obrigatorios: ["exemplos"]
          aplica_dominios: ["cultura", "produto"]
          autoridade_validacao: "lideres_equipe"

governanca:
  controle_versao:
    aprovacao_mudanca_necessaria: false  # Prioridade de iteração rápida
    autoridade_mudanca: "fundadores"
    analise_impacto_necessaria: false
    
  trilha_auditoria:
    rastrear_mudancas: true
    periodo_retencao_dias: 365  # 1 ano mínimo
    frequencia_validacao_dias: 90
    
  resolucao_conflitos:
    caminho_escalacao: ["lider_equipe", "fundador"]
    timeout_resolucao_dias: 3  # Resolução rápida necessária
    
politicas_arbitragem_nomeadas:
  "moc:arbitragem:velocidade_startup":
    descricao: "Arbitragem otimizada para velocidade em ambiente de startup"
    ordem_precedencia:
      - "P4_temporalidade_recente"     # Mais recente ganha em ambiente de movimento rápido
      - "P1_peso_autoridade"     # Então autoridade
      - "P3_nivel_maturidade"       # Então validação
      - "P6_fallback_deterministico"
    janela_temporal_ms: 60000     # Janela de concorrência de 1 minuto
```


### Notas de Implementação para Startups

**Pontos Fortes deste Template:**
- ✅ Estrutura simples minimiza complexidade
- ✅ Resolução rápida de conflitos (timeout de 3 dias)
- ✅ Ênfase na velocidade sobre processo formal
- ✅ Autoridade do fundador para decisões importantes
- ✅ Sobrecarga mínima de governança

**Diretrizes de Adaptação:**
- Ajustar nomes de equipe para corresponder à sua estrutura
- Adicionar categorias de domínio específicas do seu setor
- Considerar adicionar domínio `seguranca` se lidando com dados sensíveis
- Escalar hierarquia de escopo conforme cresce as equipes

---

## 📈 Template Scale-up (50-200 funcionários)

### Contexto
- **Estágio:** Crescimento rápido, operações em escala
- **Estrutura:** Formação de departamentos, camada gerencial emergindo
- **Prioridades:** Padronização de processos, escala de conhecimento, controle de qualidade
- **Desafios:** Dores do crescimento, lacunas de processo, gargalos de conhecimento

### Configuração MOC

```yaml


# MOC_TEMPLATE_SCALEUP.yaml
moc_version: "1.0"
organizacao: "[NOME_SCALEUP]"
data_criacao: "[YYYY-MM-DD]"
ultima_modificacao: "[YYYY-MM-DD]"
versao: "1.0.0"

# Otimizado para scale-up: 5 hierarquias com flexibilidade de crescimento
hierarquias:
  escopo:
    metadata:
      conceito: "Alcance do conhecimento através da organização em crescimento"
      regras_governanca: |
        Modelo de 3 níveis preparando para estrutura departamental: 
        Indivíduo → Equipe → Departamento → Empresa
      semantica_nivel: |
        Nível 0 = Toda a empresa (todos os funcionários)
        Nível 1 = Específico do departamento (departamento + liderança)
        Nível 2 = Específico da equipe (membros da equipe + gerência)
        Nível 3 = Individual (espaço de trabalho pessoal)
    nos:
      - id: "empresa"
        rotulo: "Toda a Empresa"
        pai: null
        nivel: 0
        governanca:
          visibilidade: ["todos_funcionarios", "contratados", "conselho"]
          propagacao: "automatica"
          autoridade_necessaria: "equipe_executiva"
          
      # Nível de Departamento (estrutura emergente)
      - id: "departamento-produto"
        rotulo: "Departamento de Produto"
        pai: "empresa"
        nivel: 1
        governanca:
          visibilidade: ["departamento_produto", "equipe_executiva"]
          propagacao: "restrita"
          autoridade_necessaria: "chefe_produto"
          
      - id: "departamento-engenharia" 
        rotulo: "Departamento de Engenharia"
        pai: "empresa"
        nivel: 1
        governanca:
          visibilidade: ["departamento_engenharia", "equipe_executiva"]
          propagacao: "restrita"
          autoridade_necessaria: "vp_engenharia"
          
      - id: "departamento-operacoes"
        rotulo: "Departamento de Operações"
        pai: "empresa"
        nivel: 1
        governanca:
          visibilidade: ["departamento_operacoes", "equipe_executiva"]
          propagacao: "restrita"
          autoridade_necessaria: "chefe_operacoes"
          
      # Nível de Equipe (dentro dos departamentos)
      - id: "equipe-frontend"
        rotulo: "Equipe Frontend"
        pai: "departamento-engenharia"
        nivel: 2
        governanca:
          visibilidade: ["equipe_frontend", "departamento_engenharia"]
          propagacao: "restrita"
          autoridade_necessaria: "lider_frontend"
          
      - id: "equipe-backend"
        rotulo: "Equipe Backend"
        pai: "departamento-engenharia"
        nivel: 2
        governanca:
          visibilidade: ["equipe_backend", "departamento_engenharia"]
          propagacao: "restrita"
          autoridade_necessaria: "lider_backend"
          
      - id: "equipe-produto"
        rotulo: "Equipe de Gestão de Produto"
        pai: "departamento-produto"
        nivel: 2
        governanca:
          visibilidade: ["equipe_produto", "departamento_produto"]
          propagacao: "restrita"
          autoridade_necessaria: "gerente_produto"
          
      - id: "equipe-design"
        rotulo: "Equipe de Design"
        pai: "departamento-produto"
        nivel: 2
        governanca:
          visibilidade: ["equipe_design", "departamento_produto"]
          propagacao: "restrita"
          autoridade_necessaria: "lider_design"

  dominio:
    metadata:
      conceito: "Domínios especializados de conhecimento"
      regras_governanca: |
        Domínios expandidos refletindo especialização departamental.
        Propriedade clara conforme a organização cresce.
    nos:
      - id: "produto"
        rotulo: "Produto e Estratégia"
        pai: null
        nivel: 0
        governanca:
          proprietarios: ["gerentes_produto", "chefe_produto"]
          revisores: ["equipe_executiva", "equipe_design"]
          validacao_necessaria: true
          
      - id: "tecnico"
        rotulo: "Técnico e Arquitetura"
        pai: null
        nivel: 0
        governanca:
          proprietarios: ["engenheiros_seniors", "vp_engenharia", "arquitetos"]
          revisores: ["departamento_engenharia", "comite_tech"]
          validacao_necessaria: true
          
      - id: "negocio"
        rotulo: "Negócio e Operações"
        pai: null
        nivel: 0
        governanca:
          proprietarios: ["equipe_operacoes", "analistas_negocio"]
          revisores: ["equipe_executiva", "chefes_departamento"]
          validacao_necessaria: true
          
      - id: "design"
        rotulo: "Experiência do Usuário e Design"
        pai: null
        nivel: 0
        governanca:
          proprietarios: ["designers", "lider_design"]
          revisores: ["equipe_produto", "pesquisa_usuario"]
          validacao_necessaria: false
          
      - id: "seguranca"
        rotulo: "Segurança e Compliance"
        pai: null
        nivel: 0
        governanca:
          proprietarios: ["lider_seguranca", "equipe_devops"]
          revisores: ["departamento_engenharia", "equipe_compliance"]
          validacao_necessaria: true
          peso_autoridade: 1.3  # Maior precedência para segurança
          
      - id: "cultura"
        rotulo: "Cultura e Pessoas"
        pai: null
        nivel: 0
        governanca:
          proprietarios: ["equipe_rh", "campeoes_cultura"]
          revisores: ["chefes_departamento", "conselho_funcionarios"]
          validacao_necessaria: false

  maturidade:
    metadata:
      conceito: "Pipeline de maturação do conhecimento"
      regras_governanca: |
        Maturidade de 4 níveis suportando escala de qualidade.
        Ênfase na revisão por pares e validação.
      semantica_nivel: |
        Nível 0 = Rascunho (trabalho individual)
        Nível 1 = Revisado (validado por pares)
        Nível 2 = Aprovado (padrão do departamento)
        Nível 3 = Padrão da Empresa (toda a organização)
    nos:
      - id: "rascunho"
        rotulo: "Rascunho"
        pai: null
        nivel: 0
        governanca:
          auto_promocao: false
          validacao_necessaria: false
          autoridade_criacao: "qualquer_funcionario"
          frequencia_revisao_dias: 21
          
      - id: "revisado" 
        rotulo: "Revisado por Pares"
        pai: "rascunho"
        nivel: 1
        governanca:
          auto_promocao: false
          validacao_necessaria: true
          autoridade_necessaria: "revisor_par"
          revisores_necessarios: 1
          frequencia_revisao_dias: 45
          
      - id: "aprovado"
        rotulo: "Padrão do Departamento"
        pai: "revisado"
        nivel: 2
        governanca:
          auto_promocao: false
          validacao_necessaria: true
          autoridade_necessaria: "chefe_departamento"
          revisores_necessarios: 2
          frequencia_revisao_dias: 90
          
      - id: "padrao_empresa"
        rotulo: "Padrão da Empresa"
        pai: "aprovado"
        nivel: 3
        governanca:
          auto_promocao: false
          validacao_necessaria: true
          autoridade_necessaria: "equipe_executiva"
          frequencia_revisao_dias: 180
          compliance_obrigatorio: true

  tipo:
    metadata:
      conceito: "Sistema de classificação do conhecimento"
      regras_governanca: |
        Tipos abrangentes suportando necessidades departamentais.
        Requisitos claros de validação por tipo.
    nos:
      - id: "politica"
        rotulo: "Política da Empresa"
        pai: null
        nivel: 0
        governanca:
          campos_obrigatorios: ["exemplos", "aplicacao", "excecoes"]
          aplica_dominios: ["negocio", "seguranca", "cultura"]
          autoridade_validacao: "equipe_executiva"
          compliance_obrigatorio: true
          
      - id: "padrao"
        rotulo: "Padrão Técnico"
        pai: null
        nivel: 0
        governanca:
          campos_obrigatorios: ["exemplos", "implementacao"]
          aplica_dominios: ["tecnico", "seguranca"]
          autoridade_validacao: "comite_tech"
          
      - id: "padrao_pratica"
        rotulo: "Padrão de Melhores Práticas"
        pai: null
        nivel: 0
        governanca:
          campos_obrigatorios: ["exemplos", "relacionamentos"]
          aplica_dominios: ["tecnico", "produto", "design"]
          autoridade_validacao: "especialistas_dominio"
          
      - id: "procedimento"
        rotulo: "Processo/Procedimento"
        pai: null
        nivel: 0
        governanca:
          campos_obrigatorios: ["exemplos", "passos", "proprietarios"]
          aplica_dominios: ["negocio", "tecnico", "cultura"]
          autoridade_validacao: "donos_processo"
          
      - id: "diretriz"
        rotulo: "Diretriz"
        pai: null
        nivel: 0
        governanca:
          campos_obrigatorios: ["exemplos"]
          aplica_dominios: ["design", "cultura", "produto"]
          autoridade_validacao: "lideres_departamento"
          
      - id: "decisao"
        rotulo: "Registro de Decisão"
        pai: null
        nivel: 0
        governanca:
          campos_obrigatorios: ["exemplos", "justificativa", "alternativas"]
          aplica_dominios: ["tecnico", "produto", "negocio"]
          autoridade_validacao: "tomadores_decisao"

  autoridade:
    metadata:
      conceito: "Hierarquia de autoridade para tomada de decisão"
      regras_governanca: |
        Estrutura de autoridade crescente com escalação clara.
        Autoridade baseada em departamento emergindo.
      semantica_nivel: |
        Nível 0 = Contribuidor individual
        Nível 1 = Líder de equipe/Sênior
        Nível 2 = Chefe de departamento  
        Nível 3 = Equipe executiva
    nos:
      - id: "contribuidor"
        rotulo: "Contribuidor Individual"
        pai: null
        nivel: 0
        governanca:
          criacao_conhecimento: ["rascunho"]
          autoridade_escopo: ["pessoal"]
          
      - id: "contribuidor_senior"
        rotulo: "Contribuidor Sênior"
        pai: "contribuidor"
        nivel: 1
        governanca:
          criacao_conhecimento: ["rascunho", "revisado"]
          autoridade_escopo: ["equipe"]
          
      - id: "lider_equipe"
        rotulo: "Líder de Equipe"
        pai: "contribuidor_senior"
        nivel: 1
        governanca:
          criacao_conhecimento: ["rascunho", "revisado", "aprovado"]
          autoridade_escopo: ["equipe", "departamento"]
          
      - id: "chefe_departamento"
        rotulo: "Chefe de Departamento"
        pai: "lider_equipe"
        nivel: 2
        governanca:
          criacao_conhecimento: ["todos"]
          autoridade_escopo: ["departamento", "empresa"]
          
      - id: "executivo"
        rotulo: "Equipe Executiva"
        pai: "chefe_departamento"
        nivel: 3
        governanca:
          criacao_conhecimento: ["todos"]
          autoridade_escopo: ["empresa"]
          criacao_politicas: true

governanca:
  controle_versao:
    aprovacao_mudanca_necessaria: true
    autoridade_mudanca: "chefes_departamento"
    analise_impacto_necessaria: true
    
  trilha_auditoria:
    rastrear_mudancas: true
    periodo_retencao_dias: 1095  # 3 anos
    frequencia_validacao_dias: 60
    
  resolucao_conflitos:
    caminho_escalacao: ["lider_equipe", "chefe_departamento", "equipe_executiva"]
    timeout_resolucao_dias: 7
    
politicas_arbitragem_nomeadas:
  "moc:arbitragem:equilibrio_scaleup":
    descricao: "Arbitragem equilibrada para organização em crescimento"
    ordem_precedencia:
      - "P1_peso_autoridade"     # Estrutura de autoridade importante
      - "P3_nivel_maturidade"       # Qualidade importa para escala
      - "P2_especificidade_escopo"    # Escopo departamento vs empresa
      - "P4_temporalidade_recente"     # Decisões recentes
      - "P5_densidade_evidencia"     # Decisões baseadas em evidência
      - "P6_fallback_deterministico"
```


---

## 🏢 Template Enterprise (200-1000 funcionários)

### Contexto
- **Estágio:** Organização estabelecida com múltiplas divisões
- **Estrutura:** Hierarquia multi-nível, funções especializadas
- **Prioridades:** Governança, compliance, coordenação cross-divisão
- **Desafios:** Gestão de complexidade, silos de conhecimento, requisitos regulatórios

### Configuração MOC

```yaml


# MOC_TEMPLATE_ENTERPRISE.yaml
moc_version: "1.0"
organizacao: "[NOME_ENTERPRISE]"
data_criacao: "[YYYY-MM-DD]"
ultima_modificacao: "[YYYY-MM-DD]"
versao: "1.0.0"

# Nível enterprise: 6 hierarquias abrangentes
hierarquias:
  escopo:
    metadata:
      conceito: "Governança e alcance do conhecimento empresarial"
      regras_governanca: |
        Modelo empresarial de 4 níveis: Indivíduo → Equipe → Divisão → Organização
        Limites claros e governança em cada nível.
      semantica_nivel: |
        Nível 0 = Toda a organização (todos os funcionários globalmente)
        Nível 1 = Específico da divisão (divisão + executivos)
        Nível 2 = Específico da equipe/departamento (equipe + liderança da divisão)
        Nível 3 = Específico individual/projeto (acesso limitado)
    nos:
      - id: "organizacao"
        rotulo: "Toda a Organização"
        pai: null
        nivel: 0
        governanca:
          visibilidade: ["todos_funcionarios", "contratados", "parceiros", "conselho"]
          propagacao: "automatica"
          autoridade_necessaria: "nivel_c"
          
      # Nível de Divisão
      - id: "divisao-tecnologia"
        rotulo: "Divisão de Tecnologia"
        pai: "organizacao"
        nivel: 1
        governanca:
          visibilidade: ["divisao_tecnologia", "nivel_c", "funcoes_cross_divisao"]
          propagacao: "restrita"
          autoridade_necessaria: "cto"
          
      - id: "divisao-produto"
        rotulo: "Divisão de Produto"
        pai: "organizacao"
        nivel: 1
        governanca:
          visibilidade: ["divisao_produto", "nivel_c", "funcoes_cross_divisao"]
          propagacao: "restrita"
          autoridade_necessaria: "cpo"
          
      - id: "divisao-operacoes"
        rotulo: "Divisão de Operações"
        pai: "organizacao"
        nivel: 1
        governanca:
          visibilidade: ["divisao_operacoes", "nivel_c", "funcoes_cross_divisao"]
          propagacao: "restrita"
          autoridade_necessaria: "coo"
          
      - id: "divisao-vendas-marketing"
        rotulo: "Divisão de Vendas e Marketing"
        pai: "organizacao"
        nivel: 1
        governanca:
          visibilidade: ["divisao_vendas_marketing", "nivel_c"]
          propagacao: "restrita"
          autoridade_necessaria: "cmo"
          
      # Nível de Departamento (dentro das divisões)
      - id: "departamento-engenharia"
        rotulo: "Departamento de Engenharia"
        pai: "divisao-tecnologia"
        nivel: 2
        governanca:
          visibilidade: ["departamento_engenharia", "divisao_tecnologia"]
          propagacao: "restrita"
          autoridade_necessaria: "vp_engenharia"
          
      - id: "departamento-arquitetura"
        rotulo: "Departamento de Arquitetura"
        pai: "divisao-tecnologia"
        nivel: 2
        governanca:
          visibilidade: ["departamento_arquitetura", "divisao_tecnologia", "departamento_engenharia"]
          propagacao: "restrita"
          autoridade_necessaria: "arquiteto_chefe"
          
      - id: "departamento-seguranca"
        rotulo: "Departamento de Segurança"
        pai: "divisao-tecnologia"
        nivel: 2
        governanca:
          visibilidade: ["departamento_seguranca", "todas_divisoes"]  # Segurança abrange tudo
          propagacao: "automatica"  # Conhecimento de segurança deve se propagar
          autoridade_necessaria: "ciso"
          
      # Nível de Equipe
      - id: "equipe-plataforma-backend"
        rotulo: "Equipe de Plataforma Backend"
        pai: "departamento-engenharia"
        nivel: 3
        governanca:
          visibilidade: ["equipe_plataforma_backend", "departamento_engenharia"]
          propagacao: "nenhuma"
          autoridade_necessaria: "gerente_engenharia_senior"

  dominio:
    metadata:
      conceito: "Domínios de conhecimento empresarial com propriedade especializada"
      regras_governanca: |
        Cobertura abrangente de domínio para operações empresariais.
        Propriedade clara, cadeias de revisão e requisitos de compliance.
    nos:
      - id: "estrategia_negocio"
        rotulo: "Estratégia e Planejamento de Negócios"
        pai: null
        nivel: 0
        governanca:
          proprietarios: ["nivel_c", "equipe_estrategia", "analistas_negocio"]
          revisores: ["conselho", "comite_executivo", "chefes_divisao"]
          validacao_necessaria: true
          
      - id: "arquitetura_tecnica"
        rotulo: "Arquitetura Técnica e Engenharia"
        pai: null
        nivel: 0
        governanca:
          proprietarios: ["arquitetos", "engenheiros_principais", "vp_engenharia"]
          revisores: ["comite_arquitetura", "lideres_tecnologia"]
          validacao_necessaria: true
          
      - id: "seguranca_compliance"
        rotulo: "Segurança e Compliance"
        pai: null
        nivel: 0
        governanca:
          proprietarios: ["ciso", "arquitetos_seguranca", "oficiais_compliance"]
          revisores: ["comite_seguranca", "equipe_auditoria", "juridico"]
          validacao_necessaria: true
          peso_autoridade: 1.5  # Maior precedência
          
      - id: "gestao_produto"
        rotulo: "Gestão e Estratégia de Produto"
        pai: null
        nivel: 0
        governanca:
          proprietarios: ["gerentes_produto", "cpo", "estrategia_produto"]
          revisores: ["comite_produto", "pesquisa_mercado", "equipe_ux"]
          validacao_necessaria: true
          
      - id: "operacoes"
        rotulo: "Operações e Processo"
        pai: null
        nivel: 0
        governanca:
          proprietarios: ["gerentes_operacoes", "donos_processo", "coo"]
          revisores: ["comite_operacoes", "garantia_qualidade"]
          validacao_necessaria: true
          
      - id: "dados_analytics"
        rotulo: "Dados e Analytics"
        pai: null
        nivel: 0
        governanca:
          proprietarios: ["engenheiros_dados", "cientistas_dados", "diretor_dados"]
          revisores: ["comite_dados", "equipe_privacidade", "equipe_analytics"]
          validacao_necessaria: true
          
      - id: "financeiro_juridico"
        rotulo: "Financeiro e Jurídico"
        pai: null
        nivel: 0
        governanca:
          proprietarios: ["cfo", "equipe_juridica", "gerentes_financeiros"]
          revisores: ["comite_auditoria", "auditores_externos"]
          validacao_necessaria: true
          
      - id: "recursos_humanos"
        rotulo: "Recursos Humanos e Cultura"
        pai: null
        nivel: 0
        governanca:
          proprietarios: ["chro", "gerentes_rh", "equipe_cultura"]
          revisores: ["conselho_funcionarios", "equipe_lideranca"]
          validacao_necessaria: false

  maturidade:
    metadata:
      conceito: "Pipeline de maturidade do conhecimento empresarial"
      regras_governanca: |
        Maturidade de 5 níveis suportando governança empresarial.
        Validação rigorosa e requisitos de compliance.
      semantica_nivel: |
        Nível 0 = Rascunho (trabalho individual, experimentos)
        Nível 1 = Revisado (validado por pares/equipe)
        Nível 2 = Aprovado (padrão departamento/divisão)
        Nível 3 = Padrão Empresarial (toda a organização)
        Nível 4 = Padrão Regulatório (compliance/auditoria obrigatório)
    nos:
      - id: "rascunho"
        rotulo: "Rascunho"
        pai: null
        nivel: 0
        governanca:
          auto_promocao: false
          validacao_necessaria: false
          autoridade_criacao: "qualquer_funcionario"
          frequencia_revisao_dias: 14
          
      - id: "revisado"
        rotulo: "Revisado por Pares"
        pai: "rascunho"
        nivel: 1
        governanca:
          auto_promocao: false
          validacao_necessaria: true
          autoridade_necessaria: "revisor_par"
          revisores_necessarios: 2
          frequencia_revisao_dias: 30
          
      - id: "aprovado"
        rotulo: "Aprovado pelo Departamento"
        pai: "revisado"
        nivel: 2
        governanca:
          auto_promocao: false
          validacao_necessaria: true
          autoridade_necessaria: "gerente_departamento"
          revisores_necessarios: 3
          evidencia_necessaria: ["prova_implementacao", "aprovacao_stakeholders"]
          frequencia_revisao_dias: 60
          
      - id: "padrao_empresarial"
        rotulo: "Padrão Empresarial"
        pai: "aprovado"
        nivel: 3
        governanca:
          auto_promocao: false
          validacao_necessaria: true
          autoridade_necessaria: "chefe_divisao"
          revisores_necessarios: 5
          evidencia_necessaria: ["validacao_cross_divisao", "aprovacao_executiva"]
          frequencia_revisao_dias: 180
          compliance_obrigatorio: true
          
      - id: "padrao_regulatorio"
        rotulo: "Padrão Regulatório/Auditoria"
        pai: "padrao_empresarial"
        nivel: 4
        governanca:
          auto_promocao: false
          validacao_necessaria: true
          autoridade_necessaria: "nivel_c"
          revisores_necessarios: ["juridico", "compliance", "auditor_externo"]
          evidencia_necessaria: ["aprovacao_regulatoria", "validacao_auditoria"]
          frequencia_revisao_dias: 365
          compliance_obrigatorio: true
          imutavel_apos_aprovacao: true

  tipo:
    metadata:
      conceito: "Classificação de tipo de conhecimento empresarial"
      regras_governanca: |
        Sistema de tipo abrangente suportando todas as funções empresariais.
        Requisitos claros de validação e compliance por tipo.
    nos:
      - id: "politica_corporativa"
        rotulo: "Política Corporativa"
        pai: null
        nivel: 0
        governanca:
          campos_obrigatorios: ["exemplos", "aplicacao", "excecoes", "compliance"]
          aplica_dominios: ["estrategia_negocio", "seguranca_compliance", "recursos_humanos"]
          autoridade_validacao: "nivel_c"
          compliance_obrigatorio: true
          revisao_juridica_necessaria: true
          
      - id: "padrao_tecnico"
        rotulo: "Padrão Técnico"
        pai: null
        nivel: 0
        governanca:
          campos_obrigatorios: ["exemplos", "implementacao", "teste", "migracao"]
          aplica_dominios: ["arquitetura_tecnica", "seguranca_compliance"]
          autoridade_validacao: "comite_arquitetura"
          
      - id: "procedimento_operacional"
        rotulo: "Procedimento Operacional"
        pai: null
        nivel: 0
        governanca:
          campos_obrigatorios: ["exemplos", "passos", "proprietarios", "escalacao", "metricas"]
          aplica_dominios: ["operacoes", "seguranca_compliance", "recursos_humanos"]
          autoridade_validacao: "comite_operacoes"
          
      - id: "decisao_arquitetural"
        rotulo: "Registro de Decisão Arquitetural"
        pai: null
        nivel: 0
        governanca:
          campos_obrigatorios: ["exemplos", "justificativa", "alternativas", "consequencias", "migracao"]
          aplica_dominios: ["arquitetura_tecnica", "estrategia_negocio"]
          autoridade_validacao: "comite_arquitetura"
          imutavel_apos_aprovacao: true
          
      - id: "regra_negocio"
        rotulo: "Regra de Negócio"
        pai: null
        nivel: 0
        governanca:
          campos_obrigatorios: ["exemplos", "condicoes", "excecoes", "compliance"]
          aplica_dominios: ["estrategia_negocio", "gestao_produto", "financeiro_juridico"]
          autoridade_validacao: "comite_negocio"
          
      - id: "controle_seguranca"
        rotulo: "Controle de Segurança"
        pai: null
        nivel: 0
        governanca:
          campos_obrigatorios: ["exemplos", "implementacao", "teste", "trilha_auditoria"]
          aplica_dominios: ["seguranca_compliance"]
          autoridade_validacao: "ciso"
          compliance_obrigatorio: true
          auditoria_necessaria: true

  autoridade:
    metadata:
      conceito: "Hierarquia de autoridade para tomada de decisão empresarial"
      regras_governanca: |
        Estrutura de autoridade multi-nível com caminhos claros de escalação.
        Autoridade baseada em função com suporte de gestão matricial.
      semantica_nivel: |
        Nível 0 = Contribuidor individual
        Nível 1 = Líder de equipe/Gerente
        Nível 2 = Gerente sênior/Diretor
        Nível 3 = Chefe de divisão/VP
        Nível 4 = Executivo nível-C
        Nível 5 = Nível de conselho
    nos:
      - id: "contribuidor"
        rotulo: "Contribuidor Individual"
        pai: null
        nivel: 0
        governanca:
          criacao_conhecimento: ["rascunho"]
          autoridade_escopo: ["pessoal"]
          
      - id: "contribuidor_senior"
        rotulo: "Contribuidor Individual Sênior"
        pai: "contribuidor"
        nivel: 1
        governanca:
          criacao_conhecimento: ["rascunho", "revisado"]
          autoridade_escopo: ["influencia_equipe"]
          
      - id: "gerente_equipe"
        rotulo: "Gerente de Equipe"
        pai: "contribuidor_senior"
        nivel: 1
        governanca:
          criacao_conhecimento: ["rascunho", "revisado", "aprovado"]
          autoridade_escopo: ["equipe", "influencia_departamento"]
          
      - id: "gerente_senior"
        rotulo: "Gerente Sênior"
        pai: "gerente_equipe"
        nivel: 2
        governanca:
          criacao_conhecimento: ["rascunho", "revisado", "aprovado"]
          autoridade_escopo: ["departamento", "influencia_divisao"]
          
      - id: "diretor"
        rotulo: "Diretor"
        pai: "gerente_senior"
        nivel: 2
        governanca:
          criacao_conhecimento: ["rascunho", "revisado", "aprovado", "padrao_empresarial"]
          autoridade_escopo: ["departamento", "divisao", "influencia_organizacao"]
          
      - id: "vp"
        rotulo: "Vice-Presidente"
        pai: "diretor"
        nivel: 3
        governanca:
          criacao_conhecimento: ["todos"]
          autoridade_escopo: ["divisao", "organizacao"]
          criacao_politicas: true
          
      - id: "nivel_c"
        rotulo: "Executivo Nível-C"
        pai: "vp"
        nivel: 4
        governanca:
          criacao_conhecimento: ["todos"]
          autoridade_escopo: ["organizacao"]
          criacao_politicas: true
          autoridade_regulatoria: true
          
      - id: "conselho"
        rotulo: "Conselho de Administração"
        pai: "nivel_c"
        nivel: 5
        governanca:
          criacao_conhecimento: ["politica_corporativa", "padrao_regulatorio"]
          autoridade_escopo: ["organizacao"]
          autoridade_governanca: true

  ciclo_vida:
    metadata:
      conceito: "Gestão de ciclo de vida do conhecimento empresarial"
      regras_governanca: |
        Políticas abrangentes de ciclo de vida para diferentes criticidades de conhecimento.
        Requisitos de compliance regulatório e auditoria.
    nos:
      - id: "padrao_ativo"
        rotulo: "Padrão Ativo"
        governanca:
          frequencia_revisao_dias: 90
          depreciacao_automatica: false
          notificacao_stakeholder: true
          controle_mudanca_necessario: true
          
      - id: "orientacao_ativa"
        rotulo: "Orientação Ativa"  
        governanca:
          frequencia_revisao_dias: 60
          depreciacao_automatica: false
          notificacao_stakeholder: true
          
      - id: "regulatorio_ativo"
        rotulo: "Regulatório Ativo"
        governanca:
          frequencia_revisao_dias: 365
          depreciacao_automatica: false
          auditoria_necessaria: true
          revisao_juridica_necessaria: true
          
      - id: "depreciado"
        rotulo: "Depreciado"
        governanca:
          dias_aviso_sunset: 180
          plano_migracao_necessario: true
          alternativa_necessaria: true
          comunicacao_stakeholder: true
          
      - id: "arquivado"
        rotulo: "Arquivado"
        governanca:
          periodo_retencao_dias: 2555  # 7 anos para compliance
          acesso_somente_leitura: true
          trilha_auditoria_preservada: true
          capacidade_legal_hold: true

governanca:
  controle_versao:
    aprovacao_mudanca_necessaria: true
    autoridade_mudanca: "conselho_controle_mudanca"
    analise_impacto_necessaria: true
    notificacao_stakeholder: "automatica"
    
  trilha_auditoria:
    rastrear_mudancas: true
    periodo_retencao_dias: 2555  # 7 anos
    frequencia_validacao_dias: 30
    relatorio_compliance: "trimestral"
    
  resolucao_conflitos:
    caminho_escalacao: ["gerente", "diretor", "vp", "nivel_c", "conselho"]
    timeout_resolucao_dias: 14
    mediacao_externa_disponivel: true
    
  gestao_compliance:
    frameworks_regulatorios: ["SOX", "GDPR", "CCPA", "ISO27001", "PCI_DSS"]
    frequencia_auditoria: "anual"
    oficial_compliance_necessario: true
    
politicas_arbitragem_nomeadas:
  "moc:arbitragem:governanca_empresarial":
    descricao: "Arbitragem focada em governança de nível empresarial"
    ordem_precedencia:
      - "P1_peso_autoridade"     # Autoridade crítica em empresa
      - "P3_nivel_maturidade"       # Padrões regulatórios priorizados
      - "P2_especificidade_escopo"    # Escopo empresarial vs divisional
      - "P5_densidade_evidencia"     # Decisões baseadas em evidência
      - "P4_temporalidade_recente"     # Decisões recentes
      - "P6_fallback_deterministico"
    autoridade_minima_necessaria: "gerente_senior"
    override_regulatorio: true
    validacao_compliance: true
    
  "moc:arbitragem:seguranca_compliance":
    descricao: "Arbitragem priorizando segurança e compliance"
    ordem_precedencia:
      - "P3_nivel_maturidade"       # Regulatório primeiro
      - "P1_peso_autoridade"     # Autoridade de segurança
      - "P2_especificidade_escopo"    # Segurança organizacional
      - "P5_densidade_evidencia"     # Evidência de compliance
      - "P4_temporalidade_recente"
      - "P6_fallback_deterministico"
    multiplicador_peso_autoridade: 2.0
    override_seguranca: true
    trilha_auditoria_aprimorada: true
```


---

## 🏛️ Template Corporação (1000+ funcionários)

### Contexto
- **Estágio:** Empresa de grande escala, potencialmente multinacional
- **Estrutura:** Organização matricial complexa, múltiplas unidades de negócio
- **Prioridades:** Governança global, compliance regulatório, conhecimento em escala
- **Desafios:** Gestão de complexidade, diferenças culturais, diversidade regulatória

### Configuração MOC

```yaml


# MOC_TEMPLATE_CORPORACAO.yaml
moc_version: "1.0"
organizacao: "[NOME_CORPORACAO]"
data_criacao: "[YYYY-MM-DD]"
ultima_modificacao: "[YYYY-MM-DD]" 
versao: "1.0.0"

# Escala corporativa: 7+ hierarquias com governança máxima
hierarquias:
  escopo:
    metadata:
      conceito: "Governança e alcance do conhecimento corporativo global"
      regras_governanca: |
        Modelo corporativo de 5 níveis suportando operações globais:
        Indivíduo → Equipe → Departamento → Divisão → Unidade de Negócio → Corporação
        Considerações matriciais geográficas e de unidades de negócio.
      semantica_nivel: |
        Nível 0 = Corporativo (acesso global)
        Nível 1 = Específico da Unidade de Negócio (UN + corporativo)
        Nível 2 = Específico da divisão (divisão + UN + corporativo)
        Nível 3 = Específico do departamento (dept + div + UN)
        Nível 4 = Específico da equipe (equipe + cadeia gerencial)
        Nível 5 = Específico individual/projeto (acesso limitado)
    nos:
      # Nível Corporativo
      - id: "corporacao"
        rotulo: "Corporativo"
        pai: null
        nivel: 0
        governanca:
          visibilidade: ["todos_funcionarios_globais", "contratados", "parceiros", "conselho"]
          propagacao: "automatica"
          autoridade_necessaria: "ceo"
          alcance_geografico: "global"
          
      # Nível de Unidade de Negócio
      - id: "unidade-negocio-tecnologia"
        rotulo: "Unidade de Negócio Tecnologia"
        pai: "corporacao"
        nivel: 1
        governanca:
          visibilidade: ["un_tecnologia", "executivos_corporativos", "funcoes_cross_un"]
          propagacao: "restrita"
          autoridade_necessaria: "presidente_tecnologia"
          alcance_geografico: "global"
          
      - id: "unidade-negocio-servicos-financeiros"
        rotulo: "Unidade de Negócio Serviços Financeiros"
        pai: "corporacao"
        nivel: 1
        governanca:
          visibilidade: ["un_servicos_financeiros", "executivos_corporativos"]
          propagacao: "restrita"
          autoridade_necessaria: "presidente_servicos_financeiros"
          alcance_geografico: "america_norte_europa"
          
      - id: "unidade-negocio-saude"
        rotulo: "Unidade de Negócio Saúde"
        pai: "corporacao"
        nivel: 1
        governanca:
          visibilidade: ["un_saude", "executivos_corporativos"]
          propagacao: "restrita"
          autoridade_necessaria: "presidente_saude"
          alcance_geografico: "global"
          regulatorio_aprimorado: true  # Saúde tem compliance extra
          
      # Nível de Divisão (dentro das Unidades de Negócio)
      - id: "divisao-software-empresarial"
        rotulo: "Divisão Software Empresarial"
        pai: "unidade-negocio-tecnologia"
        nivel: 2
        governanca:
          visibilidade: ["divisao_software_empresarial", "un_tecnologia"]
          propagacao: "restrita"
          autoridade_necessaria: "gm_software_empresarial"
          
      - id: "divisao-plataforma-cloud"
        rotulo: "Divisão Plataforma Cloud"
        pai: "unidade-negocio-tecnologia"
        nivel: 2
        governanca:
          visibilidade: ["divisao_plataforma_cloud", "un_tecnologia"]
          propagacao: "restrita"
          autoridade_necessaria: "gm_plataforma_cloud"
          
      # Variantes Geográficas (para multinacional)
      - id: "un-tecnologia-emea"
        rotulo: "UN Tecnologia - Região EMEA"
        pai: "unidade-negocio-tecnologia"
        nivel: 2
        governanca:
          visibilidade: ["un_tecnologia_emea", "un_tecnologia"]
          propagacao: "restrita"
          autoridade_necessaria: "gm_regional_emea"
          compliance_geografico: "gdpr_uk_data_act"
          
      - id: "un-tecnologia-apac"
        rotulo: "UN Tecnologia - Região APAC"
        pai: "unidade-negocio-tecnologia"
        nivel: 2
        governanca:
          visibilidade: ["un_tecnologia_apac", "un_tecnologia"]
          propagacao: "restrita"
          autoridade_necessaria: "gm_regional_apac"
          compliance_geografico: "pdpa_lei_ciberseguranca"

  dominio:
    metadata:
      conceito: "Domínios corporativos de conhecimento com especialização global"
      regras_governanca: |
        Cobertura abrangente de domínio para operações corporativas multinacionais.
        Considerações geográficas e de compliance regulatório.
    nos:
      - id: "estrategia_corporativa"
        rotulo: "Estratégia e Governança Corporativa"
        pai: null
        nivel: 0
        governanca:
          proprietarios: ["ceo", "equipe_estrategia", "desenvolvimento_corporativo"]
          revisores: ["conselho", "comite_executivo", "presidentes_unidades_negocio"]
          validacao_necessaria: true
          aprovacao_conselho_necessaria: true
          
      - id: "arquitetura_empresarial"
        rotulo: "Arquitetura Empresarial e Padrões"
        pai: null
        nivel: 0
        governanca:
          proprietarios: ["arquiteto_chefe", "arquitetos_empresariais", "cto"]
          revisores: ["conselho_arquitetura", "comite_tecnologia"]
          validacao_necessaria: true
          coordenacao_cross_un_necessaria: true
          
      - id: "seguranca_compliance_global"
        rotulo: "Segurança e Compliance Global"
        pai: null
        nivel: 0
        governanca:
          proprietarios: ["ciso", "diretor_compliance", "conselho_seguranca"]
          revisores: ["comite_auditoria", "comite_risco", "auditores_externos"]
          validacao_necessaria: true
          peso_autoridade: 2.0  # Maior precedência
          supervisao_regulatoria: true
          
      - id: "inovacao_produto"
        rotulo: "Inovação e Gestão de Produto"
        pai: null
        nivel: 0
        governanca:
          proprietarios: ["diretor_produto", "conselho_inovacao", "p_d"]
          revisores: ["comite_produto", "pesquisa_mercado", "conselho_consultivo_cliente"]
          validacao_necessaria: true
          
      - id: "operacoes_globais"
        rotulo: "Operações Globais e Processo"
        pai: null
        nivel: 0
        governanca:
          proprietarios: ["coo", "donos_processo_globais", "excelencia_operacional"]
          revisores: ["comite_operacoes", "conselho_qualidade", "lean_six_sigma"]
          validacao_necessaria: true
          
      - id: "dados_ia_analytics"
        rotulo: "Dados, IA e Analytics"
        pai: null
        nivel: 0
        governanca:
          proprietarios: ["diretor_dados", "conselho_ia", "centro_analytics"]
          revisores: ["conselho_governanca_dados", "comite_etica_ia", "equipe_privacidade"]
          validacao_necessaria: true
          revisao_etica_necessaria: true
          
      - id: "financeiro_risco_juridico"
        rotulo: "Financeiro, Risco e Jurídico"
        pai: null
        nivel: 0
        governanca:
          proprietarios: ["cfo", "diretor_risco", "conselheiro_geral"]
          revisores: ["comite_auditoria", "comite_risco", "assessoria_externa"]
          validacao_necessaria: true
          supervisao_regulatoria: true
          
      - id: "rh_cultura_global"
        rotulo: "RH Global e Cultura"
        pai: null
        nivel: 0
        governanca:
          proprietarios: ["chro", "conselho_rh_global", "transformacao_cultura"]
          revisores: ["comite_remuneracao", "conselho_diversidade", "advocacia_funcionarios"]
          validacao_necessaria: true
          
      - id: "sustentabilidade_esg"
        rotulo: "Sustentabilidade e ESG"
        pai: null
        nivel: 0
        governanca:
          proprietarios: ["diretor_sustentabilidade", "comite_esg"]
          revisores: ["conselho_sustentabilidade", "consultores_esg_externos", "conselho"]
          validacao_necessaria: true
          relatorio_publico_necessario: true

  maturidade:
    metadata:
      conceito: "Maturidade corporativa do conhecimento com supervisão regulatória"
      regras_governanca: |
        Maturidade de 6 níveis suportando governança corporativa e compliance.
        Supervisão de nível de conselho para conhecimento de maior maturidade.
      semantica_nivel: |
        Nível 0 = Rascunho (trabalho individual/equipe)
        Nível 1 = Revisado (validado por pares/departamento)
        Nível 2 = Aprovado (padrão divisão/UN)
        Nível 3 = Padrão Corporativo (toda a corporação)
        Nível 4 = Padrão Regulatório (compliance obrigatório)
        Nível 5 = Padrão do Conselho (aprovado pelo conselho, impacto público)
    nos:
      - id: "rascunho"
        rotulo: "Rascunho"
        pai: null
        nivel: 0
        governanca:
          auto_promocao: false
          validacao_necessaria: false
          autoridade_criacao: "qualquer_funcionario"
          frequencia_revisao_dias: 7
          
      - id: "revisado"
        rotulo: "Revisado por Pares"
        pai: "rascunho"
        nivel: 1
        governanca:
          auto_promocao: false
          validacao_necessaria: true
          autoridade_necessaria: "revisor_par"
          revisores_necessarios: 2
          frequencia_revisao_dias: 21
          
      - id: "aprovado"
        rotulo: "Aprovado Departamento/Divisão"
        pai: "revisado"
        nivel: 2
        governanca:
          auto_promocao: false
          validacao_necessaria: true
          autoridade_necessaria: "gerente_geral_divisao"
          revisores_necessarios: 3
          evidencia_necessaria: ["prova_implementacao", "aprovacao_stakeholders"]
          frequencia_revisao_dias: 45
          
      - id: "padrao_corporativo"
        rotulo: "Padrão Corporativo"
        pai: "aprovado"
        nivel: 3
        governanca:
          auto_promocao: false
          validacao_necessaria: true
          autoridade_necessaria: "presidente_unidade_negocio"
          revisores_necessarios: ["conselho_cross_un", "comite_corporativo"]
          evidencia_necessaria: ["validacao_multi_un", "aprovacao_executiva"]
          frequencia_revisao_dias: 180
          compliance_obrigatorio: true
          
      - id: "padrao_regulatorio"
        rotulo: "Padrão Regulatório"
        pai: "padrao_corporativo"
        nivel: 4
        governanca:
          auto_promocao: false
          validacao_necessaria: true
          autoridade_necessaria: "diretor_compliance"
          revisores_necessarios: ["juridico", "compliance", "auditores_externos", "consultores_regulatorios"]
          evidencia_necessaria: ["aprovacao_regulatoria", "validacao_auditoria", "revisao_juridica"]
          frequencia_revisao_dias: 365
          compliance_obrigatorio: true
          imutavel_apos_aprovacao: true
          divulgacao_publica_necessaria: false
          
      - id: "padrao_conselho"
        rotulo: "Padrão do Conselho"
        pai: "padrao_regulatorio"
        nivel: 5
        governanca:
          auto_promocao: false
          validacao_necessaria: true
          autoridade_necessaria: "conselho_administracao"
          revisores_necessarios: ["diretores_independentes", "comite_auditoria", "consultores_externos"]
          evidencia_necessaria: ["resolucao_conselho", "validacao_independente"]
          frequencia_revisao_dias: 365
          compliance_obrigatorio: true
          imutavel_apos_aprovacao: true
          divulgacao_publica_necessaria: true
          impacto_fiduciario: true

  tipo:
    metadata:
      conceito: "Classificação de tipo de conhecimento corporativo com níveis de governança"
      regras_governanca: |
        Sistema de tipo empresarial completo com tipos regulatórios e de nível de conselho.
        Considerações de divulgação pública e responsabilidade fiduciária.
    nos:
      - id: "resolucao_conselho"
        rotulo: "Resolução do Conselho"
        pai: null
        nivel: 0
        governanca:
          campos_obrigatorios: ["texto_resolucao", "registro_votacao", "plano_implementacao", "compliance"]
          aplica_dominios: ["estrategia_corporativa", "financeiro_risco_juridico"]
          autoridade_validacao: "conselho_administracao"
          compliance_obrigatorio: true
          divulgacao_publica: true
          vinculacao_juridica: true
          
      - id: "politica_corporativa"
        rotulo: "Política Corporativa"
        pai: null
        nivel: 0
        governanca:
          campos_obrigatorios: ["declaracao_politica", "aplicacao", "excecoes", "compliance", "treinamento"]
          aplica_dominios: ["estrategia_corporativa", "seguranca_compliance_global", "rh_cultura_global"]
          autoridade_validacao: "comite_executivo"
          compliance_obrigatorio: true
          revisao_juridica_necessaria: true
          aplicabilidade_global: true
          
      - id: "arquivo_regulatorio"
        rotulo: "Template de Arquivo Regulatório"
        pai: null
        nivel: 0
        governanca:
          campos_obrigatorios: ["requisitos_arquivo", "fontes_dados", "validacao", "cadeia_aprovacao"]
          aplica_dominios: ["financeiro_risco_juridico", "seguranca_compliance_global", "sustentabilidade_esg"]
          autoridade_validacao: ["diretor_compliance", "conselheiro_geral"]
          revisao_regulatoria_necessaria: true
          auditoria_externa_necessaria: true
          
      - id: "padrao_empresarial"
        rotulo: "Padrão Técnico Empresarial"
        pai: null
        nivel: 0
        governanca:
          campos_obrigatorios: ["especificacao_tecnica", "implementacao", "teste", "migracao", "compliance"]
          aplica_dominios: ["arquitetura_empresarial", "seguranca_compliance_global"]
          autoridade_validacao: "conselho_arquitetura_empresarial"
          validacao_cross_un_necessaria: true
          
      - id: "procedimento_critico_negocio"
        rotulo: "Procedimento Crítico de Negócio"
        pai: null
        nivel: 0
        governanca:
          campos_obrigatorios: ["passos_procedimento", "proprietarios", "escalacao", "metricas", "plano_continuidade"]
          aplica_dominios: ["operacoes_globais", "financeiro_risco_juridico", "seguranca_compliance_global"]
          autoridade_validacao: "comite_operacoes"
          testado_recuperacao_desastre: true
          
      - id: "decisao_estrategica"
        rotulo: "Registro de Decisão Estratégica"
        pai: null
        nivel: 0
        governanca:
          campos_obrigatorios: ["justificativa_decisao", "alternativas", "impacto_financeiro", "avaliacao_risco"]
          aplica_dominios: ["estrategia_corporativa", "inovacao_produto", "financeiro_risco_juridico"]
          autoridade_validacao: "comite_planejamento_estrategico"
          notificacao_conselho_necessaria: true

  autoridade:
    metadata:
      conceito: "Autoridade de decisão corporativa com responsabilidades fiduciárias"
      regras_governanca: |
        Estrutura de autoridade corporativa multi-nível com supervisão do conselho.
        Responsabilidade fiduciária e compliance de empresa pública.
      semantica_nivel: |
        Nível 0-2 = Contribuidor individual até gerente sênior
        Nível 3-4 = Diretor até VP (autoridade unidade de negócio)  
        Nível 5 = SVP/Presidente (liderança unidade de negócio)
        Nível 6 = Nível-C (autoridade corporativa)
        Nível 7 = Conselho (autoridade fiduciária)
    nos:
      # Níveis de Contribuidor Individual (0-2)
      - id: "contribuidor_individual"
        rotulo: "Contribuidor Individual"
        pai: null
        nivel: 0
        governanca:
          criacao_conhecimento: ["rascunho"]
          autoridade_escopo: ["pessoal"]
          
      - id: "profissional_senior"
        rotulo: "Profissional Sênior"
        pai: "contribuidor_individual"
        nivel: 1
        governanca:
          criacao_conhecimento: ["rascunho", "revisado"]
          autoridade_escopo: ["influencia_equipe"]
          
      - id: "gerente"
        rotulo: "Gerente"
        pai: "profissional_senior"
        nivel: 2
        governanca:
          criacao_conhecimento: ["rascunho", "revisado", "aprovado"]
          autoridade_escopo: ["departamento"]
          
      # Níveis de Gerência Sênior (3-4)
      - id: "gerente_senior"
        rotulo: "Gerente Sênior"
        pai: "gerente"
        nivel: 3
        governanca:
          criacao_conhecimento: ["rascunho", "revisado", "aprovado"]
          autoridade_escopo: ["departamento", "influencia_divisao"]
          
      - id: "diretor"
        rotulo: "Diretor"
        pai: "gerente_senior"
        nivel: 3
        governanca:
          criacao_conhecimento: ["rascunho", "revisado", "aprovado", "padrao_corporativo"]
          autoridade_escopo: ["divisao"]
          
      - id: "vice_presidente"
        rotulo: "Vice-Presidente"
        pai: "diretor"
        nivel: 4
        governanca:
          criacao_conhecimento: ["rascunho", "revisado", "aprovado", "padrao_corporativo"]
          autoridade_escopo: ["divisao", "influencia_unidade_negocio"]
          
      # Níveis Executivos (5-6)
      - id: "vice_presidente_senior"
        rotulo: "Vice-Presidente Sênior"
        pai: "vice_presidente"
        nivel: 5
        governanca:
          criacao_conhecimento: ["todos_exceto_conselho"]
          autoridade_escopo: ["unidade_negocio"]
          coordenacao_cross_un: true
          
      - id: "presidente"
        rotulo: "Presidente/Chefe Unidade de Negócio"
        pai: "vice_presidente_senior"
        nivel: 5
        governanca:
          criacao_conhecimento: ["todos_exceto_conselho"]
          autoridade_escopo: ["unidade_negocio", "influencia_corporativa"]
          autoridade_decisao_estrategica: true
          
      - id: "nivel_c"
        rotulo: "Executivo Nível-C"
        pai: "presidente"
        nivel: 6
        governanca:
          criacao_conhecimento: ["todos_exceto_conselho"]
          autoridade_escopo: ["corporacao"]
          criacao_politicas: true
          autoridade_regulatoria: true
          
      - id: "ceo"
        rotulo: "Diretor Executivo"
        pai: "nivel_c"
        nivel: 6
        governanca:
          criacao_conhecimento: ["todos_exceto_conselho"]
          autoridade_escopo: ["corporacao"]
          autoridade_executiva_maxima: true
          
      # Nível Conselho (7)
      - id: "conselho_administracao"
        rotulo: "Conselho de Administração"
        pai: "ceo"
        nivel: 7
        governanca:
          criacao_conhecimento: ["padrao_conselho", "resolucao_conselho"]
          autoridade_escopo: ["corporacao"]
          autoridade_fiduciaria: true
          autoridade_governanca: true
          representacao_acionistas: true

  compliance_geografico:
    metadata:
      conceito: "Requisitos de compliance geográfico e regulatório"
      regras_governanca: |
        Requisitos de compliance multi-jurisdicionais para operações globais.
        Compliance de framework regulatório regional.
    nos:
      - id: "america_norte"
        rotulo: "Compliance América do Norte"
        governanca:
          frameworks_regulatorios: ["SOX", "CCPA", "PIPEDA", "REGULAMENTACOES_SEC"]
          residencia_dados: "america_norte"
          requisitos_auditoria: "compliance_sox_anual"
          
      - id: "emea"
        rotulo: "Compliance EMEA" 
        governanca:
          frameworks_regulatorios: ["GDPR", "UK_DATA_PROTECTION_ACT", "MiFID_II", "PSD2"]
          residencia_dados: "uniao_europeia"
          requisitos_auditoria: "compliance_gdpr_anual"
          
      - id: "apac"
        rotulo: "Compliance APAC"
        governanca:
          frameworks_regulatorios: ["PDPA_SINGAPURA", "LEI_CIBERSEGURANCA_CHINA", "PRIVACY_ACT_AUSTRALIA"]
          residencia_dados: "asia_pacifico"
          requisitos_auditoria: "compliance_privacidade_regional"
          
      - id: "global"
        rotulo: "Padrões Globais"
        governanca:
          frameworks_regulatorios: ["ISO27001", "ISO31000", "PACTO_GLOBAL_ONU"]
          requisitos_auditoria: "compliance_global_anual"

governanca:
  controle_versao:
    aprovacao_mudanca_necessaria: true
    autoridade_mudanca: "conselho_controle_mudanca_global"
    analise_impacto_necessaria: true
    notificacao_stakeholder: "automatica_global"
    avaliacao_impacto_regulatorio: true
    
  trilha_auditoria:
    rastrear_mudancas: true
    periodo_retencao_dias: 2920  # 8 anos para empresa pública
    frequencia_validacao_dias: 30
    relatorio_compliance: "mensal"
    acesso_auditoria_externa: true
    
  resolucao_conflitos:
    caminho_escalacao: ["gerente", "diretor", "vp", "svp", "nivel_c", "ceo", "conselho"]
    timeout_resolucao_dias: 21
    mediacao_externa_disponivel: true
    arbitragem_vinculativa: true
    
  gestao_compliance:
    frameworks_regulatorios: ["SOX", "GDPR", "SEC", "COSO", "ISO27001", "ISO31000"]
    frequencia_auditoria: "continua"
    oficial_compliance_necessario: true
    relatorio_conselho_necessario: true
    requisitos_divulgacao_publica: true
    
  gestao_risco:
    avaliacao_risco_empresarial: true
    avaliacao_risco_terceiros: true
    monitoramento_risco_cyber: true
    controles_risco_operacional: true
    
politicas_arbitragem_nomeadas:
  "moc:arbitragem:governanca_corporativa":
    descricao: "Arbitragem focada em governança corporativa com supervisão do conselho"
    ordem_precedencia:
      - "P1_peso_autoridade"     # Hierarquia corporativa crítica
      - "P3_nivel_maturidade"       # Padrões conselho/regulatórios primeiro
      - "P7_compliance_regulatorio" # Customizado: Override regulatório
      - "P2_especificidade_escopo"    # Escopo corporativo vs UN
      - "P5_densidade_evidencia"     # Decisões baseadas em evidência
      - "P4_temporalidade_recente"
      - "P6_fallback_deterministico"
    autoridade_minima_necessaria: "diretor"
    override_regulatorio: true
    escalacao_conselho_necessaria: "impacto_fiduciario"
    
  "moc:arbitragem:compliance_regulatorio":
    descricao: "Compliance regulatório priorizado com supervisão jurídica"
    ordem_precedencia:
      - "P7_compliance_regulatorio" # Requisitos regulatórios primeiro
      - "P3_nivel_maturidade"        # Padrões conselho/regulatórios
      - "P1_peso_autoridade"      # Autoridade de oficial de compliance
      - "P8_compliance_geografico" # Customizado: Regulamentações regionais
      - "P5_densidade_evidencia"      # Evidência de compliance
      - "P6_fallback_deterministico"
    multiplicador_peso_autoridade: 3.0  # Maior para compliance
    revisao_juridica_necessaria: true
    notificacao_regulatoria_necessaria: true
    
  "moc:arbitragem:cross_unidade_negocio":
    descricao: "Arbitragem cross unidade de negócio com supervisão corporativa"
    ordem_precedencia:
      - "P1_peso_autoridade"     # Autoridade corporativa sobre UN
      - "P2_especificidade_escopo"    # Precedência escopo corporativo
      - "P3_nivel_maturidade"       # Padrões corporativos
      - "P5_densidade_evidencia"     # Evidência cross-UN
      - "P4_temporalidade_recente"
      - "P6_fallback_deterministico"
    autoridade_minima_necessaria: "svp"
    coordenacao_cross_un_necessaria: true
    aprovacao_corporativa_necessaria: true
```


---

## 🛠️ Diretrizes de Implementação por Template

### Matriz de Decisão de Seleção de Template

| Característica                 | Startup  | Scale-up    | Enterprise      | Corporação       |
|--------------------------------|----------|-------------|-----------------|------------------|
| **Contagem de Funcionários**   | 5-50     | 50-200      | 200-1000        | 1000+            |
| **Níveis de Hierarquia**       | 2 níveis | 3 níveis    | 4 níveis        | 5+ níveis        |
| **Velocidade de Decisão**      | Horas    | Dias        | Semanas         | Meses            |
| **Complexidade de Compliance** | Básica   | Moderada    | Alta            | Regulatória      |
| **Escopo Geográfico**          | Local    | Regional    | Nacional        | Global           |
| **Requisitos Regulatórios**    | Mínimos  | Setoriais   | Multi-setoriais | Empresa pública  |
| **Tolerância a Mudança**       | Alta     | Média       | Baixa           | Muito Baixa      |
| **Nível de Formalidade**       | Informal | Semi-formal | Formal          | Altamente Formal |

### Diretrizes de Customização

#### **Para Todos os Templates:**
1. **Substituir placeholders** entre colchetes com valores organizacionais reais
2. **Ajustar IDs de nós** para corresponder aos nomes reais de equipe/departamento
3. **Modificar níveis de autoridade** para refletir sua estrutura organizacional
4. **Adicionar categorias de domínio** específicas do seu setor
5. **Configurar políticas de arbitragem** baseadas na sua cultura de decisão

#### **Customizações Comuns:**

**Domínios Específicos por Setor:**
- **Saúde:** Adicionar `clinico`, `pesquisa`, `assuntos_regulatorios`
- **Serviços Financeiros:** Adicionar `trading`, `gestao_risco`, `relatorio_regulatorio`
- **Manufatura:** Adicionar `producao`, `garantia_qualidade`, `cadeia_suprimentos`
- **E-commerce:** Adicionar `experiencia_cliente`, `marketplace`, `logistica`

**Adaptações Geográficas:**
- **Empresas Europeias:** Enfatizar nós de compliance GDPR
- **Empresas Asiáticas:** Adicionar frameworks regulatórios regionais
- **Multinacionais:** Usar template corporação com variantes regionais

**Específicos de Tecnologia:**
- **Empresas SaaS:** Adicionar `plataforma`, `infraestrutura`, `sucesso_cliente`
- **Empresas IA/ML:** Adicionar `ciencia_dados`, `etica_ia`, `governanca_modelo`
- **Consultoria:** Adicionar `entrega_cliente`, `metodologia`, `gestao_conhecimento`

### Caminho de Migração Entre Templates

Organizações tipicamente evoluem através dos templates conforme crescem:

**Migração Startup → Scale-up:**
1. Adicionar nós de escopo de nível departamental
2. Introduzir nível de maturidade `revisado`
3. Adicionar domínio `seguranca`
4. Implementar hierarquia formal de autoridade

**Migração Scale-up → Enterprise:**
1. Adicionar hierarquia de escopo de nível de divisão
2. Introduzir maturidade `aprovado` e `padrao_empresarial`
3. Adicionar domínios especializados (`seguranca`, `dados_analytics`)
4. Implementar processos formais de governança

**Migração Enterprise → Corporação:**
1. Adicionar nível de escopo de unidade de negócio
2. Introduzir maturidade `padrao_regulatorio` e `padrao_conselho`
3. Adicionar nós de compliance e geográficos
4. Implementar governança de nível de conselho

---

## 📊 Resumo de Comparação de Templates

| Funcionalidade               | Startup      | Scale-up       | Enterprise        | Corporação     |
|------------------------------|--------------|----------------|-------------------|----------------|
| **Hierarquias**              | 4 centrais   | 5 equilibradas | 6 abrangentes     | 7+ avançadas   |
| **Níveis de Maturidade**     | 3 simples    | 4 moderados    | 5 rigorosos       | 6 regulatórios |
| **Níveis de Autoridade**     | 3 planos     | 5 estruturados | 6 hierárquicos    | 8 corporativos |
| **Políticas de Arbitragem**  | 1 velocidade | 1 equilibrada  | 2 governança      | 3+ compliance  |
| **Foco de Compliance**       | Básico       | Setorial       | Multi-regulatório | Global/Público |
| **Tempo de Implementação**   | 2-3 meses    | 3-4 meses      | 4-6 meses         | 6-12 meses     |
| **Esforço de Manutenção**    | Baixo        | Médio          | Alto              | Muito Alto     |
| **Sobrecarga de Governança** | Mínima       | Moderada       | Significativa     | Extensiva      |

Estes templates fornecem uma base sólida para implementação do Protocolo Matrix mantendo a flexibilidade para adaptar às necessidades e restrições organizacionais específicas.

---

**Próximos Passos:** Escolha o template que melhor corresponde ao seu porte organizacional atual e complexidade, depois customize-o baseado nos seus requisitos específicos de setor, geográficos e culturais.