# Features BDD - Matrix Protocol Website

Este documento define todas as features do website usando metodologia BDD (Behavior-Driven Development) com sintaxe Gherkin.

## Assets e Recursos Visuais

### Localização dos Assets
Todos os recursos visuais estão localizados em `/design/` no repositório:

#### Logos Matrix Protocol
- **Desktop/Claro**: `design/matrix-protocol-logo-gray.svg`
- **Desktop/Escuro**: `design/matrix-protocol-logo-white.svg`
- **Mobile/Ícone Claro**: `design/matrix-protocol-icon-gray.svg`  
- **Mobile/Ícone Escuro**: `design/matrix-protocol-icon-white.svg`

#### Logos dos 5 Frameworks
Cada framework (MEF, ZOF, OIF, MOC, MAL) possui 3 variações:
- **Logo Completo Colorido**: `design/{framework}-logo-text-color-full.svg`
- **Logo Texto Branco**: `design/{framework}-logo-color-text-white.svg`
- **Apenas Ícone**: `design/{framework}-logo-icon.svg`

#### Cores Oficiais dos Frameworks
- **MEF (Matrix Embedding Framework)**: Verde `#2ECC71`
- **ZOF (Zion Orchestration Framework)**: Laranja `#E67E22`
- **OIF (Operator Intelligence Framework)**: Azul `#2980B9`
- **MOC (Matrix Ontology Catalog)**: Roxo `#9B59B6`
- **MAL (Matrix Arbiter Layer)**: Vermelho `#C0392B`

#### Outros Assets
- **Design System Completo**: `design/design-project.svg`

## Estrutura de Épicos

### Epic 1: Navegação e Layout Base
- **Objetivo**: Estrutura básica de navegação e layout responsivo
- **Valor de Negócio**: Permitir acesso organizado ao conteúdo do protocolo

### Epic 2: Apresentação do Protocolo
- **Objetivo**: Comunicar efetivamente o que é o Matrix Protocol
- **Valor de Negócio**: Converter visitantes em usuários através de explanação clara

### Epic 3: Documentação Interativa
- **Objetivo**: Facilitar aprendizado e implementação do protocolo
- **Valor de Negócio**: Reduzir barreira de entrada para adoção

### Epic 4: Demonstrações Práticas
- **Objetivo**: Mostrar aplicações reais dos frameworks
- **Valor de Negócio**: Acelerar compreensão através de exemplos concretos

### Epic 5: Recursos e Comunidade
- **Objetivo**: Facilitar download de recursos e engajamento comunitário
- **Valor de Negócio**: Criar ecossistema ativo ao redor do protocolo

---

## Feature 1: Navegação Principal (Epic 1)

```gherkin
Feature: Navegação Principal do Website
  Como visitante do website Matrix Protocol
  Quero navegar facilmente entre seções
  Para encontrar as informações que preciso

  Background:
    Given que estou no website Matrix Protocol
    And o header de navegação está visível

  Scenario: Visualizar menu desktop
    Given que estou usando um dispositivo desktop
    When acesso qualquer página do site
    Then vejo o logo do Matrix Protocol no canto superior esquerdo
    And vejo os itens do menu: "Protocolo", "Frameworks", "Documentação", "Exemplos", "Recursos"
    And vejo o seletor de idioma (PT/EN)
    And vejo o link para GitHub

  Scenario: Interagir com dropdown de Frameworks
    Given que estou na navegação desktop
    When passo o mouse sobre "Frameworks"
    Then vejo um dropdown com os 5 frameworks
    And cada framework tem sua cor oficial (MEF: verde, ZOF: laranja, OIF: azul, MOC: roxo, MAL: vermelho)
    And posso clicar para navegar para página específica do framework

  Scenario: Navegação mobile
    Given que estou usando dispositivo mobile
    When acesso o website
    Then vejo apenas o logo e ícone de hambúrguer
    When toco no ícone de hambúrguer
    Then abre drawer lateral da direita
    And vejo todos os itens do menu desktop
    And posso expandir seção "Frameworks"

  Scenario: Indicação de página ativa
    Given que estou em qualquer página
    When visualizo o menu de navegação
    Then o item correspondente à página atual está destacado
    And outros itens não estão destacados
```

## Feature 2: Homepage/Landing (Epic 2)

```gherkin
Feature: Página Inicial do Website
  Como visitante interessado em Matrix Protocol
  Quero compreender rapidamente o que é o protocolo
  Para decidir se é relevante para minha necessidade

  Scenario: Visualizar hero section
    Given que acesso a homepage
    When a página carrega completamente
    Then vejo o título "Matrix Protocol v1.0.0"
    And vejo o subtítulo "Framework epistemológico para colaboração humano-IA"
    And vejo uma descrição clara do protocolo
    And vejo botões CTA: "Começar Agora" e "Ver Documentação"

  Scenario: Compreender frameworks principais
    Given que estou na homepage
    When rolo até a seção de frameworks
    Then vejo cards dos 5 frameworks principais
    And cada card tem: nome, sigla, descrição resumida, cor oficial
    And posso clicar "Saiba Mais" em cada framework

  Scenario: Entender diferenciais
    Given que estou na homepage
    When visualizo a seção "Por que Matrix Protocol"
    Then vejo 4 pilares principais: Epistemológico, Semântico, Colaboração IA, Governança
    And cada pilar tem ícone e descrição clara

  Scenario: Ver guia de início rápido
    Given que estou interessado em implementar
    When visualizo a seção "Início Rápido"
    Then vejo 3 passos claros: Escolher Template, Configurar Ontologia, Criar UKIs
    And cada passo tem link para documentação específica
```

## Feature 3: Páginas de Frameworks (Epic 2)

```gherkin
Feature: Páginas Individuais dos Frameworks
  Como desenvolvedor interessado em um framework específico
  Quero informações detalhadas sobre sua funcionalidade
  Para entender como implementá-lo

  Scenario: Acessar página MEF
    Given que clico no framework MEF
    When a página carrega
    Then vejo título "Matrix Embedding Framework (MEF)"
    And vejo descrição detalhada sobre estruturação de conhecimento via UKIs
    And vejo exemplos de UKIs reais
    And vejo seção sobre relacionamentos semânticos

  Scenario: Comparar frameworks
    Given que estou em qualquer página de framework
    When procuro por comparação
    Then vejo tabela comparativa dos 5 frameworks
    And vejo critérios: Propósito, Foco, Output Principal, Nível de Governança

  Scenario: Ver integração entre frameworks
    Given que quero entender como frameworks se conectam
    When acesso seção de integração
    Then vejo diagrama de fluxo ZOF → MAL → OIF
    And vejo exemplos de cenários cross-framework
```

## Feature 4: Documentação Estruturada (Epic 3)

```gherkin
Feature: Sistema de Documentação
  Como implementador do Matrix Protocol
  Quero documentação organizada e searchável
  Para encontrar rapidamente informações específicas

  Scenario: Navegar por seções
    Given que acesso a documentação
    When visualizo o índice
    Then vejo seções: Primeiros Passos, Guia de Implementação, Referência API, Exemplos, FAQ
    And posso navegar entre seções facilmente

  Scenario: Buscar na documentação
    Given que estou na documentação
    When uso a busca por "UKI"
    Then vejo resultados relevantes destacados
    And posso filtrar por seção
    And vejo snippet do contexto

  Scenario: Ver tempo de leitura
    Given que acesso qualquer página de documentação
    When visualizo o cabeçalho
    Then vejo tempo estimado de leitura
    And vejo data da última atualização
    And vejo breadcrumb da navegação
```

## Feature 5: Exemplos Interativos (Epic 4)

```gherkin
Feature: Galeria de Exemplos Práticos
  Como pessoa aprendendo Matrix Protocol
  Quero ver exemplos reais de implementação
  Para acelerar meu entendimento

  Scenario: Filtrar exemplos
    Given que estou na página de exemplos
    When visualizo os filtros disponíveis
    Then posso filtrar por: Framework (MEF, ZOF, etc), Dificuldade (Iniciante, Intermediário, Avançado), Tipo (UKI, MOC, Workflow)
    And vejo contador de resultados

  Scenario: Ver exemplo de UKI
    Given que seleciono um exemplo de UKI
    When clico no card do exemplo
    Then vejo código YAML completo
    And vejo explicação passo-a-passo
    And vejo relacionamentos com outros UKIs

  Scenario: Playground interativo
    Given que quero testar modificações
    When acesso o playground
    Then posso editar código YAML
    And vejo validação em tempo real
    And posso fazer download do resultado
```

## Feature 6: Recursos e Downloads (Epic 5)

```gherkin
Feature: Centro de Recursos
  Como organizador implementando Matrix Protocol
  Quero templates e ferramentas prontos
  Para acelerar implementação

  Scenario: Baixar templates MOC
    Given que preciso de template organizacional
    When acesso seção de templates
    Then vejo opções por porte: Pequeno, Médio, Grande
    And posso baixar YAML pronto para customizar
    And vejo preview do template antes do download

  Scenario: Acessar ferramentas
    Given que quero automatizar processos
    When visualizo seção de ferramentas
    Then vejo validadores de UKI
    And vejo geradores de MOC
    And cada ferramenta tem instruções de uso

  Scenario: Engajar com comunidade
    Given que quero participar da comunidade
    When acesso links comunitários
    Then posso acessar GitHub, Discord, Discussions
    And vejo como contribuir com código, documentação, exemplos, traduções
```

## Feature 7: Suporte Multilíngue (Epic 1)

```gherkin
Feature: Interface Bilíngue
  Como usuário brasileiro ou internacional
  Quero navegar no meu idioma preferido
  Para melhor compreensão do conteúdo

  Scenario: Alternar idioma
    Given que estou em qualquer página
    When clico no seletor de idioma
    Then vejo opções "English" e "Português"
    When seleciono português
    Then toda interface muda para português
    And URL inclui prefixo "/pt"

  Scenario: Manter idioma na navegação
    Given que estou no site em português
    When navego para qualquer página
    Then permaneço na versão em português
    And todos os links mantêm o prefixo "/pt"
```

## Feature 8: SEO e Performance (Epic 1)

```gherkin
Feature: Otimização SEO e Performance
  Como visitante chegando via busca orgânica
  Quero páginas rápidas com conteúdo relevante
  Para encontrar informações sobre Matrix Protocol

  Scenario: Meta tags otimizadas
    Given que acesso qualquer página
    When analiso o código fonte
    Then vejo title tag descritivo
    And vejo meta description relevante
    And vejo Open Graph tags para compartilhamento social

  Scenario: Performance otimizada
    Given que acesso o website
    When meço performance
    Then tempo de carregamento inicial < 3 segundos
    And score Lighthouse > 90
    And imagens estão otimizadas
```

## Feature 9: Dark Mode (Epic 1)

```gherkin
Feature: Modo Escuro
  Como usuário que prefere interfaces escuras
  Quero alternar entre modo claro e escuro
  Para melhor experiência visual

  Scenario: Detectar preferência do sistema
    Given que meu sistema está em modo escuro
    When acesso o website pela primeira vez
    Then o site carrega automaticamente em modo escuro

  Scenario: Alternar modo manualmente
    Given que estou no website
    When clico no toggle de modo escuro
    Then a interface muda imediatamente
    And a preferência é salva para próximas visitas
```

## Feature 10: Acessibilidade (Epic 1)

```gherkin
Feature: Acessibilidade Web
  Como usuário com necessidades especiais
  Quero navegar com tecnologias assistivas
  Para acessar todo conteúdo do protocolo

  Scenario: Navegação por teclado
    Given que navego apenas com teclado
    When uso Tab para navegar
    Then todos elementos interativos são alcançáveis
    And foco é visualmente indicado
    And posso ativar elementos com Enter/Espaço

  Scenario: Screen reader compatibility
    Given que uso leitor de tela
    When navego pelo site
    Then todos elementos têm labels apropriados
    And hierarquia de headings está correta
    And imagens têm alt text descritivo

  Scenario: Contraste adequado
    Given que visualizo o conteúdo
    When analiso contraste de cores
    Then contraste atende WCAG AA (4.5:1)
    And texto é legível em ambos os modos (claro/escuro)
```

---

## Critérios de Aceitação Gerais

### Responsividade
- Todos componentes funcionam em: Mobile (320px+), Tablet (768px+), Desktop (1024px+)
- Testes em Chrome, Firefox, Safari, Edge

### Performance
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1

### SEO
- Sitemap.xml gerado automaticamente
- Meta tags únicas por página
- URLs semânticas
- Schema.org markup onde aplicável

### Acessibilidade
- WCAG 2.1 AA compliance
- Navegação por teclado completa
- Screen reader compatibility
- Contraste mínimo 4.5:1

### Manutenibilidade
- Componentes reutilizáveis
- Documentação inline
- Testes unitários para lógica crítica
- CI/CD pipeline funcional