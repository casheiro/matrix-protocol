# User Stories - Matrix Protocol Website

Organização das user stories por personas e épicos, seguindo metodologia ágil para desenvolvimento do website.

## Assets e Recursos Visuais

### Localização dos Assets no Repositório
Todos os elementos visuais mencionados nas user stories estão disponíveis em `/design/`:

#### Identidade Visual Matrix Protocol
- **Logos Desktop**: `design/matrix-protocol-logo-gray.svg` (claro), `design/matrix-protocol-logo-white.svg` (escuro)
- **Ícones Mobile**: `design/matrix-protocol-icon-gray.svg` (claro), `design/matrix-protocol-icon-white.svg` (escuro)

#### Elementos dos 5 Frameworks
Para cada framework (MEF, ZOF, OIF, MOC, MAL):
- **Logo Completo**: `design/{framework}-logo-text-color-full.svg`
- **Logo para Fundo Escuro**: `design/{framework}-logo-color-text-white.svg`
- **Ícone Isolado**: `design/{framework}-logo-icon.svg`

#### Paleta de Cores Oficial
- **MEF**: Verde `#2ECC71` (bg-mef-500 no Tailwind)
- **ZOF**: Laranja `#E67E22` (bg-zof-500 no Tailwind)
- **OIF**: Azul `#2980B9` (bg-oif-500 no Tailwind)
- **MOC**: Roxo `#9B59B6` (bg-moc-500 no Tailwind)
- **MAL**: Vermelho `#C0392B` (bg-mal-500 no Tailwind)

> **Nota para Desenvolvedores**: Configurar essas cores como custom colors no Tailwind CSS para manter consistência visual.

## Personas Identificadas

### 1. **Visitante Curioso**
- **Perfil**: Pessoa que ouviu falar do Matrix Protocol e quer entender do que se trata
- **Necessidades**: Explanação clara, exemplos visuais, navegação intuitiva
- **Dispositivos**: Principalmente mobile e desktop

### 2. **Desenvolvedor/Arquiteto**
- **Perfil**: Profissional técnico avaliando adoção do protocolo
- **Necessidades**: Documentação técnica, exemplos de código, comparações
- **Dispositivos**: Principalmente desktop, alguns mobile

### 3. **Tomador de Decisão**
- **Perfil**: Gestor ou líder técnico avaliando investimento em implementação
- **Necessidades**: Casos de uso, benefícios claros, roadmap, comunidade ativa
- **Dispositivos**: Desktop e tablet

### 4. **Implementador/Usuário Ativo**
- **Perfil**: Pessoa já usando ou implementando o protocolo
- **Necessidades**: Recursos práticos, templates, ferramentas, suporte
- **Dispositivos**: Desktop principalmente

### 5. **Contribuidor Comunitário**
- **Perfil**: Desenvolvedor querendo contribuir com o protocolo
- **Necessidades**: Guias de contribuição, repositórios, canal de comunicação
- **Dispositivos**: Desktop

---

## Epic 1: Navegação e Layout Base

### NAV-001: Header Navigation
**Como** visitante do website Matrix Protocol  
**Quero** navegar pelo menu principal no cabeçalho  
**Para** acessar diferentes seções do protocolo facilmente

**Critérios de Aceitação:**
- [ ] Logo Matrix Protocol visível e clicável (leva à homepage)
- [ ] Menu horizontal: Protocolo, Frameworks, Documentação, Exemplos, Recursos
- [ ] Hover states visuais em todos os itens
- [ ] Item atual destacado visualmente
- [ ] Seletor de idioma (PT/EN) funcional
- [ ] Link GitHub com ícone
- [ ] Menu responsivo (colapsa em mobile)
- [ ] Altura consistente (72px desktop, 64px mobile)

**Story Points:** 5  
**Priority:** Must Have  
**Sprint:** 1

### NAV-002: Mobile Menu
**Como** usuário mobile do site Matrix Protocol  
**Quero** acessar o menu de navegação em dispositivos pequenos  
**Para** navegar pelo site em meu smartphone/tablet facilmente

**Critérios de Aceitação:**
- [ ] Logo reduzido em mobile (apenas ícone)
- [ ] Hamburger menu visível no canto superior direito
- [ ] Menu desktop completamente oculto em mobile
- [ ] Drawer abre da direita para esquerda
- [ ] Overlay escuro sobre conteúdo (opacity 0.5)
- [ ] Animação suave de abertura (300ms ease-out)
- [ ] Botão X para fechar
- [ ] Todos itens do menu desktop disponíveis
- [ ] Tap no overlay fecha drawer
- [ ] Swipe para direita fecha drawer
- [ ] Focus trap no drawer quando aberto

**Story Points:** 3  
**Priority:** Must Have  
**Sprint:** 1

### NAV-003: Framework Dropdown
**Como** visitante interessado nos frameworks  
**Quero** ver dropdown com os 5 frameworks principais  
**Para** navegar diretamente ao framework de interesse

**Critérios de Aceitação:**
- [ ] Hover sobre "Frameworks" mostra dropdown
- [ ] 5 frameworks listados: MEF, ZOF, OIF, MOC, MAL
- [ ] Cada framework com cor oficial identificadora
- [ ] Animação suave de aparição/desaparecimento
- [ ] Click fora fecha dropdown
- [ ] Escape fecha dropdown
- [ ] Navegação por teclado funcional

**Story Points:** 2  
**Priority:** Must Have  
**Sprint:** 1

### NAV-004: Language Selector
**Como** usuário brasileiro ou internacional  
**Quero** alternar entre português e inglês  
**Para** navegar no meu idioma preferido

**Critérios de Aceitação:**
- [ ] Dropdown com opções "English" e "Português"
- [ ] Ícone de globo identifica seletor
- [ ] URL atualiza com prefixo de idioma (/pt)
- [ ] Conteúdo muda imediatamente
- [ ] Preferência mantida na navegação
- [ ] Estado salvo para próximas visitas

**Story Points:** 3  
**Priority:** Must Have  
**Sprint:** 1

---

## Epic 2: Apresentação do Protocolo

### HOME-001: Hero Section
**Como** visitante chegando ao site pela primeira vez  
**Quero** entender imediatamente o que é Matrix Protocol  
**Para** decidir se é relevante para minha necessidade

**Critérios de Aceitação:**
- [ ] Título claro "Matrix Protocol v1.0.0"
- [ ] Subtítulo explicativo sobre colaboração humano-IA
- [ ] Descrição concisa do protocolo semântico
- [ ] Badge de versão atual destacado
- [ ] Botões CTA: "Começar Agora" e "Ver Documentação"
- [ ] Background com elementos visuais atrativos
- [ ] Responsivo em todos dispositivos

**Story Points:** 3  
**Priority:** Must Have  
**Sprint:** 2

### HOME-002: Frameworks Overview
**Como** visitante querendo conhecer os componentes  
**Quero** ver resumo visual dos 5 frameworks principais  
**Para** compreender a estrutura do protocolo

**Critérios de Aceitação:**
- [ ] Cards dos 5 frameworks: MEF, ZOF, OIF, MOC, MAL
- [ ] Cada card com: sigla, nome completo, descrição resumida
- [ ] Cores oficiais de cada framework
- [ ] Link "Saiba Mais" em cada card
- [ ] Layout responsivo (grid adaptativo)
- [ ] Animações sutis no hover

**Story Points:** 4  
**Priority:** Must Have  
**Sprint:** 2

### HOME-003: Features Section
**Como** tomador de decisão avaliando o protocolo  
**Quero** entender os diferenciais e benefícios  
**Para** avaliar se vale o investimento de implementação

**Critérios de Aceitação:**
- [ ] 4 pilares principais destacados
- [ ] Fundação Epistemológica com explicação
- [ ] Estrutura Semântica com benefícios
- [ ] Colaboração IA com casos de uso
- [ ] Governança Integrada com compliance
- [ ] Ícones representativos para cada pilar
- [ ] Seção sobre os 5 princípios MEP

**Story Points:** 3  
**Priority:** Must Have  
**Sprint:** 2

### HOME-004: Quick Start
**Como** desenvolvedor pronto para implementar  
**Quero** ver guia rápido de primeiros passos  
**Para** acelerar início da implementação

**Critérios de Aceitação:**
- [ ] 3 passos claros e numerados
- [ ] Passo 1: Escolher Template (link para recursos)
- [ ] Passo 2: Configurar Ontologia (link para MOC docs)
- [ ] Passo 3: Criar UKIs (link para MEF docs)
- [ ] Timeline visual conectando os passos
- [ ] CTA final "Ver Documentação Completa"

**Story Points:** 2  
**Priority:** Should Have  
**Sprint:** 2

---

## Epic 3: Documentação Interativa

### DOC-001: Documentation Structure
**Como** implementador do Matrix Protocol  
**Quero** documentação bem organizada e navegável  
**Para** encontrar rapidamente informações específicas

**Critérios de Aceitação:**
- [ ] Índice com seções: Getting Started, Implementation, API Reference, Examples, FAQ
- [ ] Navegação lateral sempre visível
- [ ] Breadcrumb mostrando localização atual
- [ ] Indicador de progresso de leitura
- [ ] Links de "Próximo" e "Anterior"
- [ ] Tempo estimado de leitura

**Story Points:** 5  
**Priority:** Must Have  
**Sprint:** 3

### DOC-002: Search Functionality
**Como** usuário procurando informação específica  
**Quero** buscar termos na documentação  
**Para** encontrar rapidamente o que preciso

**Critérios de Aceitação:**
- [ ] Campo de busca sempre visível
- [ ] Busca em tempo real (debounced)
- [ ] Destacar termos encontrados
- [ ] Filtros por seção/categoria
- [ ] Sugestões de termos relacionados
- [ ] "Nenhum resultado" com sugestões alternativas

**Story Points:** 8  
**Priority:** Should Have  
**Sprint:** 4

### DOC-003: Framework Deep Dives
**Como** desenvolvedor implementando framework específico  
**Quero** documentação detalhada de cada framework  
**Para** implementar corretamente seguindo especificações

**Critérios de Aceitação:**
- [ ] Página dedicada para cada framework (MEF, ZOF, OIF, MOC, MAL)
- [ ] Seções: Overview, Architecture, Implementation, Examples, API
- [ ] Diagramas explicativos (Mermaid)
- [ ] Code samples com syntax highlighting
- [ ] Links para exemplos práticos
- [ ] Changelog do framework

**Story Points:** 13  
**Priority:** Must Have  
**Sprint:** 3-4

---

## Epic 4: Demonstrações Práticas

### EX-001: Examples Gallery
**Como** pessoa aprendendo Matrix Protocol  
**Quero** ver galeria de exemplos organizados  
**Para** encontrar casos similares ao meu contexto

**Critérios de Aceitação:**
- [ ] Grid de cards com preview dos exemplos
- [ ] Filtros: Por Framework, Dificuldade, Tipo
- [ ] Tags identificando características
- [ ] Contador de resultados filtrados
- [ ] Ordem por popularidade/recência
- [ ] Busca por palavra-chave

**Story Points:** 5  
**Priority:** Should Have  
**Sprint:** 5

### EX-002: Interactive Code Viewer
**Como** desenvolvedor analisando exemplos  
**Quero** ver código completo com explicações  
**Para** entender implementação passo-a-passo

**Critérios de Aceitação:**
- [ ] Syntax highlighting para YAML/JSON
- [ ] Anotações explicativas inline
- [ ] Tabs para diferentes versões (PT/EN)
- [ ] Botão copy-to-clipboard
- [ ] Links para documentação relacionada
- [ ] Validação em tempo real do código

**Story Points:** 8  
**Priority:** Should Have  
**Sprint:** 5

### EX-003: UKI Showcase
**Como** implementador MEF  
**Quero** ver exemplos reais de UKIs bem estruturados  
**Para** usar como template para meus próprios UKIs

**Critérios de Aceitação:**
- [ ] Galeria de UKIs dos arquivos examples/
- [ ] UKI viewer com campos destacados
- [ ] Relacionamentos visualizados
- [ ] Diferentes tipos: business_rule, pattern, procedure
- [ ] Download individual de UKIs
- [ ] Explicação de cada campo obrigatório

**Story Points:** 5  
**Priority:** Must Have  
**Sprint:** 5

### EX-004: MOC Template Viewer
**Como** organizador criando MOC personalizado  
**Quero** explorar MOC_SQUAD_PAYMENTS.yaml visualmente  
**Para** entender estrutura antes de customizar

**Critérios de Aceitação:**
- [ ] Visualização hierárquica do MOC
- [ ] Árvore expansível de hierarchies
- [ ] Detalhes de governance rules
- [ ] Mapeamento scope → domain → type
- [ ] Export para YAML personalizado
- [ ] Validação de estrutura

**Story Points:** 8  
**Priority:** Should Have  
**Sprint:** 6

---

## Epic 5: Recursos e Comunidade

### RES-001: Template Downloads
**Como** implementador iniciando projeto  
**Quero** baixar templates prontos para customizar  
**Para** acelerar setup inicial do protocolo

**Critérios de Aceitação:**
- [ ] Templates por porte organizacional: Pequeno, Médio, Grande
- [ ] Preview antes do download
- [ ] Formatos disponíveis: YAML, JSON
- [ ] Documentação de customização incluída
- [ ] Versionamento dos templates
- [ ] Analytics de downloads populares

**Story Points:** 3  
**Priority:** Must Have  
**Sprint:** 6

### RES-002: Community Links
**Como** usuário querendo participar da comunidade  
**Quero** links organizados para canais de comunicação  
**Para** engajar com outros usuários e contribuidores

**Critérios de Aceitação:**
- [ ] Seção "Comunidade" bem visível
- [ ] Links para GitHub, Discord, Discussions
- [ ] Estatísticas ao vivo (stars, forks, membros)
- [ ] Guias de contribuição
- [ ] Code of conduct
- [ ] Roadmap público

**Story Points:** 2  
**Priority:** Must Have  
**Sprint:** 6

### RES-003: Tools and Utilities
**Como** usuário ativo do protocolo  
**Quero** ferramentas que facilitem implementação  
**Para** automatizar tarefas repetitivas e validações

**Critérios de Aceitação:**
- [ ] Validador de UKI online
- [ ] Gerador de MOC básico
- [ ] Conversor entre formatos
- [ ] Linter para estruturas Matrix
- [ ] CLI tools para download
- [ ] Plugins para IDEs populares

**Story Points:** 13  
**Priority:** Could Have  
**Sprint:** 7-8

---

## Epic 6: Otimizações e Acessibilidade

### OPT-001: SEO Optimization
**Como** visitante chegando via busca orgânica  
**Quero** encontrar páginas otimizadas e relevantes  
**Para** descobrir Matrix Protocol naturalmente

**Critérios de Aceitação:**
- [ ] Meta tags únicas por página
- [ ] Open Graph para compartilhamento social
- [ ] Schema.org markup
- [ ] Sitemap.xml automático
- [ ] URLs semânticas
- [ ] Core Web Vitals otimizados

**Story Points:** 5  
**Priority:** Must Have  
**Sprint:** 2

### OPT-002: Performance Optimization
**Como** usuário em qualquer dispositivo/conexão  
**Quero** site rápido e responsivo  
**Para** navegar sem frustração

**Critérios de Aceitação:**
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Lighthouse score > 90
- [ ] Lazy loading de imagens
- [ ] Code splitting por rota

**Story Points:** 8  
**Priority:** Must Have  
**Sprint:** 2

### ACC-001: Accessibility Compliance
**Como** usuário com necessidades especiais  
**Quero** navegar com tecnologias assistivas  
**Para** acessar todo conteúdo do protocolo

**Critérios de Aceitação:**
- [ ] WCAG 2.1 AA compliance
- [ ] Navegação por teclado completa
- [ ] Screen reader compatibility
- [ ] Contraste mínimo 4.5:1
- [ ] Alt text em todas imagens
- [ ] Labels apropriados em formulários

**Story Points:** 8  
**Priority:** Must Have  
**Sprint:** 1

### ACC-002: Dark Mode Support
**Como** usuário preferindo interfaces escuras  
**Quero** alternar entre modo claro e escuro  
**Para** melhor experiência visual

**Critérios de Aceitação:**
- [ ] Toggle de modo escuro no header
- [ ] Detectar preferência do sistema automaticamente
- [ ] Salvar preferência localmente
- [ ] Transição suave entre modos
- [ ] Todos componentes compatíveis
- [ ] Contraste mantido em modo escuro

**Story Points:** 3  
**Priority:** Should Have  
**Sprint:** 1

---

## Critérios de Pronto (Definition of Done)

Para cada user story ser considerada "Pronta", deve atender:

### Funcional
- [ ] Todos critérios de aceitação implementados
- [ ] Funciona em Chrome, Firefox, Safari, Edge
- [ ] Responsivo: Mobile (320px+), Tablet (768px+), Desktop (1024px+)
- [ ] Funcional em modo claro e escuro

### Qualidade
- [ ] Código revisado por peer
- [ ] Testes unitários para lógica crítica
- [ ] Testes E2E para fluxos principais
- [ ] Performance validada (Lighthouse > 85)

### Acessibilidade
- [ ] Navegação por teclado funcional
- [ ] Screen reader compatibility testado
- [ ] Contraste WCAG AA validado
- [ ] Focus indicators visíveis

### Documentação
- [ ] Componentes documentados (Storybook)
- [ ] README atualizado se necessário
- [ ] Breaking changes comunicados

### Deploy
- [ ] Deploy em ambiente de staging
- [ ] Validação por stakeholder
- [ ] Deploy em produção sem erros
- [ ] Monitoring funcionando

---

## Roadmap de Priorização

### Sprint 1 (Foundation) - 4 weeks
- NAV-001, NAV-002, NAV-003, NAV-004
- ACC-001, ACC-002
- OPT-002

### Sprint 2 (Core Content) - 4 weeks  
- HOME-001, HOME-002, HOME-003, HOME-004
- OPT-001

### Sprint 3 (Documentation Base) - 4 weeks
- DOC-001, DOC-003 (parte 1)

### Sprint 4 (Documentation Advanced) - 4 weeks
- DOC-002, DOC-003 (parte 2)

### Sprint 5 (Examples) - 4 weeks
- EX-001, EX-002, EX-003

### Sprint 6 (Resources) - 3 weeks
- RES-001, RES-002, EX-004

### Sprint 7-8 (Tools - Optional) - 6 weeks
- RES-003 (se budget/tempo permitir)

**Total Estimado:** 29-35 semanas  
**MVP (Sprints 1-3):** 12 semanas  
**Completo (Sprints 1-6):** 23 semanas