# 👥 **EQUIPE DE AGENTS IA - NAVEGAÇÃO DINÂMICA**

## 🤖 **COMPOSIÇÃO DA EQUIPE**

### **🎯 ALEX SANTOS - Líder Técnico & Arquiteto**

#### **Responsabilidades Principais**
- 🏗️ **Arquitetura da Solução**: Definir padrões e estruturas técnicas
- 📋 **Coordenação Geral**: Alinhar trabalho entre agents
- 🔍 **Decisões Técnicas**: Resolver bloqueadores e conflitos
- 📊 **Validação de Entregáveis**: Aprovar implementações

#### **Ferramentas MCP Atribuídas**
- **Context7**: Consultar documentação oficial e melhores práticas
- **Nuxt Docs**: Pesquisar APIs e padrões arquiteturais
- **Read/Write**: Criar documentação técnica e especificações

#### **Autoridades e Escopo**
- ✅ **Aprovação Final**: Todas as decisões arquiteturais
- ✅ **Desbloqueio**: Resolver impedimentos técnicos
- ✅ **Qualidade**: Validar aderência aos padrões do projeto
- ❌ **Implementação Direta**: Não executa código, apenas orienta

---

### **💻 MARINA COSTA - Frontend Developer**

#### **Responsabilidades Principais**
- 🔧 **Implementação de Composables**: `useDocsNavigation.ts`, `useContentDiscovery.ts`
- 🎨 **Componentes de Navegação**: Refatoração e adaptação
- ⚡ **Performance Frontend**: Otimização de queries e cache
- 🔄 **Integração com UI**: Adaptar componentes Nuxt UI

#### **Ferramentas MCP Atribuídas**
- **Nuxt UI**: Implementar componentes de navegação
- **Edit/MultiEdit**: Refatorar código existente
- **Bash**: Executar builds e testes
- **Read**: Analisar código atual para refatoração

#### **Autoridades e Escopo**
- ✅ **Implementação**: Composables e componentes Vue
- ✅ **Refatoração**: Código de navegação e UI
- ✅ **Otimização**: Performance e bundle size
- ❌ **APIs Backend**: Não mexe em server-side

---

### **🔧 RICARDO LIMA - Especialista Nuxt/Content**

#### **Responsabilidades Principais**
- 📚 **APIs Nuxt Content**: `queryCollection()`, `where()`, `all()`
- 🔍 **Sistema de Discovery**: Algoritmos de descoberta automática
- 🚀 **Performance de Queries**: Otimização de consultas
- 📄 **Extração de Metadados**: Frontmatter e estrutura de arquivos

#### **Ferramentas MCP Atribuídas**
- **Context7**: Consultar documentação Nuxt Content v3.x
- **Read**: Analisar estrutura atual do `/content`
- **Glob/Grep**: Mapear arquivos e estruturas
- **Write**: Implementar utilitários de content discovery

#### **Autoridades e Escopo**
- ✅ **APIs de Content**: Todas as queries e descoberta
- ✅ **Algoritmos**: Lógica de construção hierárquica
- ✅ **Metadados**: Extração e processamento
- ❌ **Componentes UI**: Não mexe em templates Vue

---

### **🧪 CAMILA RODRIGUEZ - QA Engineer**

#### **Responsabilidades Principais**
- ✅ **Validação de Critérios**: Testar cada story e task
- 🎯 **Testes Automatizados**: Implementar validação contínua
- 📊 **Métricas de Qualidade**: Performance, acessibilidade, usabilidade
- 🔍 **Regressão**: Garantir que funcionalidades não quebrem

#### **Ferramentas MCP Atribuídas**
- **Bash**: Executar suites de teste e builds
- **Read**: Analisar resultados de testes
- **WebFetch**: Validar documentação e padrões
- **Glob**: Localizar arquivos de teste

#### **Autoridades e Escopo**
- ✅ **Aprovação de Qualidade**: Critérios de aceite das stories
- ✅ **Bloqueio de Entrega**: Pode rejeitar se não atender critérios
- ✅ **Métricas**: Definir e validar benchmarks
- ❌ **Implementação**: Não escreve código de produção

---

### **✍️ BRUNO OLIVEIRA - Content Specialist**

#### **Responsabilidades Principais**
- 📋 **Padronização de Metadados**: Schema de frontmatter
- 🌍 **Suporte Multilingual**: Consistência PT/EN
- 📁 **Estrutura de Content**: Organização e categorização
- 📝 **Documentação**: Registros e especificações

#### **Ferramentas MCP Atribuídas**
- **Read**: Analisar conteúdo atual e metadados
- **Edit**: Padronizar frontmatter nos arquivos
- **Glob**: Mapear estrutura de conteúdo
- **Write**: Criar documentação e especificações

#### **Autoridades e Escopo**
- ✅ **Schema de Metadados**: Definir padrões de frontmatter
- ✅ **Estrutura de Content**: Organizar hierarquias
- ✅ **Multilingual**: Garantir paridade PT/EN
- ❌ **Código**: Não implementa lógica de programação

## 🔄 **FLUXO DE COLABORAÇÃO**

### **Sequência de Execução por Tipo de Task**

#### **📋 Planning & Discovery Tasks**
1. **Alex** (Líder) → Define objetivos e arquitetura
2. **Ricardo** (Nuxt) → Avalia APIs e possibilidades técnicas
3. **Bruno** (Content) → Mapeia estrutura atual de conteúdo
4. **Camila** (QA) → Define critérios de aceite
5. **Marina** (Frontend) → Planeja implementação

#### **🔧 Implementation Tasks**
1. **Ricardo** (Nuxt) → Implementa discovery e queries
2. **Marina** (Frontend) → Desenvolve composables e componentes
3. **Bruno** (Content) → Padroniza metadados se necessário
4. **Camila** (QA) → Valida durante desenvolvimento
5. **Alex** (Líder) → Aprova e orienta ajustes

#### **✅ Review & Validation Tasks**
1. **Camila** (QA) → Executa testes e validações
2. **Alex** (Líder) → Revisa arquitetura e qualidade
3. **Marina** (Frontend) → Ajusta baseado em feedback
4. **Ricardo** (Nuxt) → Otimiza performance se necessário
5. **Bruno** (Content) → Valida funcionalidade multilingual

## 🚦 **PROTOCOLOS DE COMUNICAÇÃO**

### **Handoffs Entre Agents**

#### **Ricardo → Marina** (API → Implementation)
```markdown
**HANDOFF: Discovery API Ready**
- ✅ Functions implemented: `discoverContentStructure()`, `extractMetadata()`
- ✅ Performance benchmarks: < 200ms per query
- 📋 Next: Integrate into `useDocsNavigation.ts`
- 🔗 Files: `/composables/useContentDiscovery.ts`
```

#### **Marina → Camila** (Implementation → Testing)
```markdown
**HANDOFF: Feature Ready for Testing**
- ✅ Implementation complete: Dynamic navigation working
- ✅ Manual testing done: PT/EN verified
- 📋 Next: Automated tests and performance validation
- 🔗 Files: `/composables/useDocsNavigation.ts`, `/components/docs/DocSidebar.vue`
```

#### **Camila → Alex** (Testing → Approval)
```markdown
**HANDOFF: Quality Validation Complete**
- ✅ All criteria met: Performance, functionality, accessibility
- ✅ Regression tests pass: No breaking changes
- 📋 Next: Final architectural review and approval
- 📊 Metrics: Lighthouse 94, Bundle +2KB, Load time 150ms
```

## 📋 **RESPONSABILIDADE MATRIX**

| **Atividade** | **Alex** | **Marina** | **Ricardo** | **Camila** | **Bruno** |
|---------------|----------|------------|-------------|------------|-----------|
| **Arquitetura** | ✅ Lead | 🔄 Input | 🔄 Input | ❌ | ❌ |
| **Implementation** | ❌ | ✅ Lead | ✅ APIs | ❌ | 🔄 Support |
| **Testing** | 🔄 Review | 🔄 Support | 🔄 Support | ✅ Lead | 🔄 Validation |
| **Content** | ❌ | ❌ | 🔄 Integration | 🔄 Validation | ✅ Lead |
| **Documentation** | 🔄 Review | 🔄 Input | 🔄 Input | 🔄 Input | ✅ Lead |

**Legenda**: ✅ Responsável Principal | 🔄 Colabora/Suporte | ❌ Não Envolvido

---

**📍 Status**: Equipe definida e pronta para execução  
**🔄 Próximo Passo**: Iniciar Sprint Planning com toda equipe  
**📋 Autoridade Final**: Alex Santos (Líder Técnico)