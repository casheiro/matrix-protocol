---
title: "Moc Starter Template"
description: "Wrapper page for YAML asset MOC_STARTER_TEMPLATE.yaml"
layout: "docs"
sidebar: true
toc: true
navigation: true
---

> Source YAML: `en/docs/quickstart/templates/MOC_STARTER_TEMPLATE.yaml`

**Open in Viewer:** [Moc Starter Template](/en/docs/viewer?file=/docs/quickstart/templates/MOC_STARTER_TEMPLATE.yaml)

> 📄 Type: YAML • 📦 Size: 16.0 KB • 🕒 Last updated: 2025-10-12



```yaml
# Template Inicial MOC - Pronto para Usar
# Baseado na implementação hipotética TechCorp e padrões organizacionais
# Selecione e personalize o template que corresponde ao tamanho da sua organização

moc_version: "1.0"
organization: "[NOME_DA_SUA_ORGANIZACAO]"
created_date: "[AAAA-MM-DD]"
last_modified: "[AAAA-MM-DD]"
version: "0.0.1-beta"

# =============================================================================
# TEMPLATE STARTUP (5-50 pessoas) - Use para organizações em estágio inicial
# =============================================================================
startup_config:
  hierarchies:
    scope:
      metadata:
        concept: "Alcance e visibilidade do conhecimento"
        governance_rules: |
          Modelo simples de 3 níveis: Individual → Equipe → Empresa
          Foco em compartilhamento de conhecimento e prevenção de pontos únicos de falha.
        level_semantics: |
          Nível 0 = Empresa-toda (todos funcionários podem acessar)
          Nível 1 = Específico da equipe (equipe + gestores)  
          Nível 2 = Individual (pessoa + gestor direto)
          Nível menor = acesso mais amplo
          
      nodes:
        - id: "empresa"
          label: "Empresa-toda"
          parent: null
          level: 0
          governance:
            visibility: ["todos_funcionarios"]
            propagation: "automatic"
            authority_required: "qualquer_funcionario"
            
        - id: "engenharia" 
          label: "Equipe de Engenharia"
          parent: "empresa"
          level: 1
          governance:
            visibility: ["equipe_engenharia", "fundadores", "gestores"]
            propagation: "restricted"
            authority_required: "tech_lead"
            
        - id: "produto"
          label: "Equipe de Produto"
          parent: "empresa"
          level: 1
          governance:
            visibility: ["equipe_produto", "fundadores", "gestores"]
            propagation: "restricted"
            authority_required: "product_lead"
            
        - id: "pessoal"
          label: "Anotações Pessoais"
          parent: null
          level: 2
          governance:
            visibility: ["individual", "gestor_direto"]
            propagation: "blocked"
            authority_required: "individual"

    domain:
      metadata:
        concept: "Áreas de especialização do conhecimento"
        governance_rules: "Domínios práticos focados em operações diárias"
        
      nodes:
        - id: "tecnico"
          label: "Conhecimento Técnico"
          governance:
            owners: ["tech_lead", "engenheiros_senior"]
            reviewers: ["todos_engenheiros"]
            
        - id: "produto"
          label: "Conhecimento de Produto"
          governance:
            owners: ["product_lead"]
            reviewers: ["equipe_produto", "fundadores"]
            
        - id: "negocio"
          label: "Conhecimento de Negócio"
          governance:
            owners: ["fundadores"]
            reviewers: ["todos_leads"]

    type:
      metadata:
        concept: "Tipos de formato de conhecimento"
        
      nodes:
        - id: "decisao"
          label: "Registro de Decisão"
          governance:
            required_fields: ["contexto", "decisao", "rationale"]
            review_required: true
            
        - id: "processo"
          label: "Documentação de Processo"
          governance:
            required_fields: ["passos", "responsavel", "frequencia"]
            
        - id: "referencia"
          label: "Material de Referência"
          governance:
            required_fields: ["resumo", "uso"]

    maturity:
      metadata:
        concept: "Nível de validação e confiança"
        
      nodes:
        - id: "rascunho"
          label: "Rascunho"
          level: 0
          governance:
            validation_required: false
            creation_authority: "qualquer_funcionario"
            
        - id: "validado"
          label: "Validado"
          parent: "rascunho"
          level: 1
          governance:
            validation_required: true
            reviewers_required: 1
            
        - id: "aprovado"
          label: "Aprovado"
          parent: "validado"
          level: 2
          governance:
            authority_required: "team_lead_ou_fundador"

# =============================================================================
# TEMPLATE SCALE-UP (50-200 pessoas) - Use quando tiver múltiplas equipes/tribos
# =============================================================================
scaleup_config:
  hierarchies:
    scope:
      metadata:
        concept: "Alcance organizacional com tribos"
        level_semantics: |
          Nível 0 = Empresa-toda
          Nível 1 = Tribo-toda
          Nível 2 = Squad-específico
          Nível 3 = Individual
          
      nodes:
        - id: "empresa"
          label: "Empresa-toda"
          parent: null
          level: 0
          
        - id: "tribo_engenharia"
          label: "Tribo Engenharia"
          parent: "empresa"
          level: 1
          governance:
            visibility: ["tribo_engenharia", "leads_tribo", "executivos"]
            
        - id: "tribo_produto"
          label: "Tribo Produto"
          parent: "empresa"
          level: 1
          governance:
            visibility: ["tribo_produto", "leads_tribo", "executivos"]
            
        - id: "squad_backend"
          label: "Squad Backend"
          parent: "tribo_engenharia"
          level: 2
          governance:
            visibility: ["squad_backend", "tech_leads", "tribo_engenharia"]
            
        - id: "squad_frontend"
          label: "Squad Frontend"
          parent: "tribo_engenharia"
          level: 2

    authority:
      metadata:
        concept: "Hierarquia de autoridade de tomada de decisão"
        level_semantics: |
          Nível 0 = Contribuidor Individual
          Nível 1 = Lead de Squad
          Nível 2 = Lead de Tribo
          Nível 3 = Executivo
          Nível maior = autoridade mais ampla
          
      nodes:
        - id: "contribuidor"
          label: "Contribuidor Individual"
          level: 0
          governance:
            knowledge_creation: ["rascunho"]
            
        - id: "contribuidor_senior"
          label: "Contribuidor Sênior"
          parent: "contribuidor"
          level: 0
          governance:
            knowledge_creation: ["rascunho", "validado"]
            
        - id: "tech_lead"
          label: "Tech Lead"
          parent: "contribuidor_senior"
          level: 1
          governance:
            knowledge_creation: ["rascunho", "validado", "aprovado"]
            scope_authority: ["squad"]
            
        - id: "lead_tribo"
          label: "Lead de Tribo"
          parent: "tech_lead"
          level: 2
          governance:
            knowledge_creation: ["todos"]
            scope_authority: ["tribo"]
            
        - id: "executivo"
          label: "Executivo"
          parent: "lead_tribo"
          level: 3
          governance:
            knowledge_creation: ["todos"]
            scope_authority: ["empresa"]
            policy_creation: true

    # Hierarquias adicionais para scale-up...
    domain:
      nodes:
        - id: "engenharia_core"
          label: "Engenharia Core"
          governance:
            owners: ["engenheiros_principal"]
            mandatory_knowledge: ["todos_engenheiros"]
            
        - id: "arquitetura"
          label: "Arquitetura de Sistema"
          parent: "engenharia_core"
          governance:
            owners: ["engenheiros_principal", "comite_arquitetura"]
            
        - id: "estrategia_produto"
          label: "Estratégia de Produto"
          governance:
            owners: ["leads_produto"]
            
        - id: "operacoes_negocio"
          label: "Operações de Negócio"
          governance:
            owners: ["equipe_operacoes"]

# =============================================================================  
# TEMPLATE ENTERPRISE (200+ pessoas) - Complexidade total com compliance
# =============================================================================
enterprise_config:
  hierarchies:
    scope:
      metadata:
        concept: "Alcance organizacional multi-divisional"
        governance_rules: |
          Modelo de 5 níveis: Individual → Squad → Tribo → Divisão → Empresa
          Suporta múltiplas divisões, geografias e funções
        level_semantics: |
          Nível 0 = Empresa-toda
          Nível 1 = Divisão-toda
          Nível 2 = Tribo-toda  
          Nível 3 = Squad-específico
          Nível 4 = Individual
          
      nodes:
        - id: "empresa"
          label: "Empresa"
          level: 0
          governance:
            visibility: ["todos_funcionarios"]
            compliance_required: true
            
        - id: "divisao_tecnologia"
          label: "Divisão Tecnologia"
          parent: "empresa"
          level: 1
          governance:
            visibility: ["divisao_tech", "leads_divisao", "executivos"]
            
        - id: "divisao_produto"
          label: "Divisão Produto"
          parent: "empresa"
          level: 1
          
        # ... mais divisões

    authority:
      metadata:
        concept: "Autoridade organizacional formal"
        level_semantics: |
          Nível 0 = Contribuidor Individual
          Nível 1 = Lead Equipe/Squad  
          Nível 2 = Gerente Sênior/Lead Tribo
          Nível 3 = Diretor/Lead Divisão
          Nível 4 = VP/Executivo
          Nível 5 = C-Level
          
      nodes:
        - id: "contribuidor"
          label: "Contribuidor Individual"
          level: 0
          
        - id: "contribuidor_senior"
          label: "Contribuidor Sênior"
          parent: "contribuidor"
          level: 0
          
        - id: "lead_equipe"
          label: "Lead de Equipe"
          parent: "contribuidor_senior"
          level: 1
          
        - id: "gerente_senior"
          label: "Gerente Sênior"
          parent: "lead_equipe"
          level: 2
          
        - id: "diretor"
          label: "Diretor"
          parent: "gerente_senior"
          level: 3
          
        - id: "vp"
          label: "Vice Presidente"
          parent: "diretor"
          level: 4
          
        - id: "c_level"
          label: "Executivo C-Level"
          parent: "vp"
          level: 5
          governance:
            policy_creation: true
            strategic_decisions: true

    # Hierarquias enterprise adicionais
    compliance:
      metadata:
        concept: "Classificação de conformidade regulatória"
        
      nodes:
        - id: "publico"
          label: "Informação Pública"
          level: 0
          governance:
            disclosure_allowed: true
            
        - id: "interno"
          label: "Uso Interno Apenas"
          level: 1
          governance:
            employee_access_only: true
            
        - id: "confidencial"
          label: "Confidencial"
          parent: "interno"
          level: 2
          governance:
            need_to_know_basis: true
            access_approval_required: true
            
        - id: "restrito"
          label: "Restrito"
          parent: "confidencial"
          level: 3
          governance:
            executive_approval_required: true
            audit_access_log: true

    lifecycle:
      metadata:
        concept: "Gestão temporal do conhecimento"
        
      nodes:
        - id: "ativo"
          label: "Conhecimento Ativo"
          level: 0
          governance:
            review_frequency: "trimestral"
            
        - id: "deprecated"
          label: "Conhecimento Descontinuado"
          parent: "ativo"
          level: 1
          governance:
            deprecation_notice_period: 90
            migration_path_required: true
            
        - id: "arquivado"
          label: "Conhecimento Arquivado"
          parent: "deprecated"
          level: 2
          governance:
            read_only: true
            compliance_retention: true

# =============================================================================
# CONFIGURAÇÃO DE GOVERNANÇA (personalizar baseado na sua escolha de template)
# =============================================================================
governance:
  version_control:
    change_approval_required: false  # startup: false, enterprise: true
    change_authority: "fundadores"     # startup: fundadores, enterprise: comite
    
  audit_trail:
    retention_period_days: 365      # startup: 365, enterprise: 2555 (7 anos)
    
  conflict_resolution:
    escalation_path: ["team_lead", "fundador"]  # personalizar baseado na sua org
    arbitration_policy: "moc:arbitration:simple_precedence"
    timeout_policy: "48h_max"      # startup: 48h, enterprise: 5 dias úteis

# =============================================================================
# GUIA DE SELEÇÃO - Escolha seu template baseado nas características organizacionais
# =============================================================================
selection_guide:
  startup_indicators:
    - employees: 5-50
    - hierarchy_levels: "≤3"
    - decision_making: "informal e rápido"
    - documentation: "mínima mas crítica"
    - growth_stage: "crescimento inicial, encontrando product-market fit"
    
  scaleup_indicators:
    - employees: 50-200
    - hierarchy_levels: "3-4"
    - decision_making: "semi-formal com propriedade clara"
    - documentation: "estruturada mas flexível"
    - growth_stage: "escalando equipe e processos"
    
  enterprise_indicators:
    - employees: "200+"
    - hierarchy_levels: "4+"
    - decision_making: "formal com requisitos de compliance"
    - documentation: "abrangente com trilhas de auditoria"
    - growth_stage: "organização madura ou grande corporação"

# =============================================================================
# PASSOS DE IMPLEMENTAÇÃO - Siga essa sequência independente do template escolhido
# =============================================================================
implementation_steps:
  phase_1_setup:
    duration: "2-4 semanas"
    activities:
      - "Selecionar template apropriado (startup/scaleup/enterprise)"
      - "Personalizar nome da organização e stakeholders-chave"
      - "Revisar e adaptar regras de governança à sua cultura"
      - "Identificar 3-5 usuários piloto para teste inicial"
      
  phase_2_pilot:
    duration: "4-6 semanas"  
    activities:
      - "Implantar MOC com equipe piloto"
      - "Criar primeiros 10-20 UKIs para testar estrutura"
      - "Validar se hierarquia faz sentido para cenários reais"
      - "Coletar feedback e iterar nas regras de governança"
      
  phase_3_expand:
    duration: "8-12 semanas"
    activities:
      - "Expandir para organização completa gradualmente"
      - "Migrar conhecimento legado crítico"
      - "Estabelecer processos de revisão e aprovação"
      - "Monitorar métricas de adoção e qualidade"

# =============================================================================
# UKIS QUICK WIN - Crie esses UKIs primeiro para demonstrar valor
# =============================================================================
suggested_first_ukis:
  - id: "uki:[scope]:decisao:selecao-ferramenta-001"
    title: "Processo Padrão de Seleção de Ferramentas"
    rationale: "Todos enfrentam decisões de seleção de ferramentas"
    
  - id: "uki:[scope]:processo:code-review-001"  
    title: "Diretrizes de Code Review"
    rationale: "Processo de alta frequência com impacto claro"
    
  - id: "uki:[scope]:referencia:checklist-onboarding-001"
    title: "Checklist de Onboarding de Novos Funcionários"
    rationale: "Necessidade regular, fácil de medir melhoria"
    
  - id: "uki:[scope]:decisao:praticas-reuniao-001"
    title: "Práticas de Reunião Efetiva"
    rationale: "Ponto de dor universal, impacto imediato na produtividade"
    
  - id: "uki:[scope]:processo:resposta-incidente-001"
    title: "Procedimento de Resposta a Incidentes"
    rationale: "Conhecimento crítico que previne caos durante incidentes"
```
