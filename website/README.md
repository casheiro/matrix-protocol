# Matrix Protocol Website

## Visão Geral

O **Matrix Protocol Website** é a plataforma oficial de documentação e divulgação do Matrix Protocol - um framework abrangente para colaboração humano-IA através de estruturas de conhecimento e workflows orquestrados. O site centraliza toda a documentação técnica, guias de implementação e recursos relacionados ao protocolo.

### Sobre o Matrix Protocol

O Matrix Protocol é um framework integral para colaboração humano-IA através de três camadas interdependentes:

- **🔮 Oracle (MEF)**: Governança estratégica & gestão de base de conhecimento
- **⚡ Zion (ZOF)**: Framework conceitual de workflows para equipes orientadas a IA  
- **🧠 Operator (OIF)**: Execução prática e implementação por equipes de desenvolvimento

### Objetivos do Website

- **Documentação Centralizada**: Reunir toda a especificação técnica do protocolo
- **Multilíngue**: Suporte completo para português e inglês
- **Acessibilidade**: Interface otimizada para desenvolvedores e implementadores
- **Performance**: Site estático otimizado para carregamento rápido
- **SEO**: Otimização para mecanismos de busca e descoberta

## Documentação Técnica

📚 **Toda a documentação técnica está centralizada em [`/docs`](./docs/INDEX.md)**

### Acesso Rápido à Documentação

- **[📋 Índice Completo](./docs/INDEX.md)** - Mapa de toda a documentação disponível
- **[📖 Regras de Documentação](./docs/REGRAS_DOCUMENTACAO.md)** - Diretrizes obrigatórias
- **[🏗️ Migração v1→v2](./docs/migracao/)** - Documentação completa da migração

> ⚠️ **Importante**: Toda documentação técnica deve ser criada exclusivamente em `/docs`. Consulte as [regras de documentação](./docs/REGRAS_DOCUMENTACAO.md) antes de contribuir.

## Funcionalidades

### Documentação Técnica

- **Especificação Completa**: Documentação detalhada do Matrix Protocol Beta
- **Frameworks Individuais**: Documentação específica para MEF, ZOF, OIF, MOC e MAL
- **Guias de Implementação**: Tutoriais práticos e exemplos de código
- **Glossário Técnico**: Definições e termos do ecossistema Matrix
- **Quick Start**: Guias de início rápido para diferentes cenários

### Interface e Navegação

- **Design Responsivo**: Interface adaptável para desktop, tablet e mobile
- **Tema Dark**: Interface otimizada com tema escuro fixo
- **Navegação Intuitiva**: Estrutura clara com breadcrumbs e sidebar
- **Busca Integrada**: Sistema de busca no conteúdo da documentação
- **Downloads**: Acesso direto a templates, exemplos e ferramentas

### Internacionalização

- **Inglês (Padrão)**: Idioma principal com conteúdo completo
- **Português**: Tradução completa da documentação
- **Detecção Automática**: Detecção do idioma do navegador
- **Alternância Dinâmica**: Troca de idioma sem recarregamento

### Recursos Avançados

- **Geração Estática**: Site pré-renderizado para máxima performance
- **SEO Otimizado**: Meta tags, Open Graph e Twitter Cards
- **Tipografia Matrix**: Fontes Rajdhani e Source Code Pro
- **Logos Otimizados**: Logotipos dos frameworks em formato vetorial
- **Acessibilidade**: Conformidade com padrões WCAG

## Tecnologias

### Stack Principal

- **Nuxt.js**: Framework Vue.js para aplicações universais
- **Vue.js**: Framework JavaScript reativo
- **TypeScript**: Linguagem tipada para desenvolvimento seguro
- **Nitro**: Engine de servidor universal com preset estático

### UI e Estilização

- **Nuxt UI**: Biblioteca de componentes UI baseada em Tailwind
- **Tailwind CSS**: Framework CSS utility-first integrado
- **Nuxt Image**: Otimização automática de imagens
- **Google Fonts**: Rajdhani e Source Code Pro

### Conteúdo e Internacionalização

- **Nuxt Content**: Sistema de CMS baseado em Markdown
- **@nuxtjs/i18n**: Módulo de internacionalização
- **Vue I18n**: Biblioteca de internacionalização para Vue.js

### Ferramentas de Desenvolvimento

- **VueUse**: Coleção de composables utilitários
- **@vercel/og**: Geração de imagens Open Graph
- **Iconify**: Ícones Heroicons, Simple Icons e Circle Flags

### Infraestrutura

- **Node.js**: Runtime JavaScript (versão 22+ requerida)
- **Docker**: Containerização para desenvolvimento e produção
- **Git**: Controle de versão distribuído

## Requisitos

### Requisitos de Sistema

- **Node.js**: Versão 22.x ou superior
- **PNPM**: Gerenciador de pacotes (recomendado)
- **Git**: Versão 2.x ou superior
- **Sistema Operacional**: Windows 10+, macOS 12+, ou Linux (Ubuntu 20.04+)

### Requisitos de Hardware

- **RAM**: Mínimo 4GB, recomendado 8GB
- **Processador**: Multi-core 2.0GHz ou superior
- **Armazenamento**: 2GB de espaço livre
- **Conexão**: Internet para download de dependências

### Navegadores Suportados

- **Chrome**: 90+ (recomendado)
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## Instalação

### 1. Clonagem do Repositório

```bash
git clone <repository-url>
cd matrix-protocol-website-v2
```

### 2. Instalação de Dependências

```bash
# Usando PNPM (recomendado)
pnpm install

# Alternativas (não recomendadas)
# npm install
# yarn install
```

### 3. Configuração de Ambiente

```bash
# Copiar arquivo de exemplo (opcional)
cp .env.example .env
```

### 4. Verificação da Instalação

```bash
# Executar em modo desenvolvimento
pnpm run dev

# Site estará disponível em http://localhost:3000
```

### Estrutura de Conteúdo

```
content/
├── pt/                 # Conteúdo em português
│   ├── index.md       # Página inicial
│   ├── protocol/      # Especificação do protocolo
│   ├── frameworks/    # Documentação dos frameworks
│   ├── implementation/ # Guias de implementação
│   ├── quickstart/    # Guias de início rápido
│   └── glossary/      # Glossário técnico
└── en/                # Conteúdo em inglês (estrutura idêntica)
```

## Uso

### Desenvolvimento Local

```bash
# Iniciar servidor de desenvolvimento
pnpm run dev

# Servidor com hot reload em http://localhost:3000
```

### Build de Produção

```bash
# Gerar site estático
pnpm run generate

# Visualizar build localmente
pnpm run preview
```

## Contribuição

### Diretrizes de Contribuição

1. **Fork do Repositório**: Criar fork pessoal do projeto
2. **Branch Feature**: Criar branch específica para nova funcionalidade
3. **Commits Semânticos**: Seguir padrão de commits convencionais
4. **Documentação**: Atualizar documentação relevante
5. **Testes**: Verificar funcionamento em ambos os idiomas
6. **Pull Request**: Submeter PR com descrição detalhada

### Padrões de Código

- **TypeScript**: Tipagem obrigatória para componentes e composables
- **Vue 3 Composition API**: Utilizar Composition API para todos os componentes
- **Nuxt 3 Patterns**: Seguir convenções e padrões do Nuxt 3
- **Acessibilidade**: Garantir conformidade com padrões WCAG
- **Performance**: Otimizar para carregamento e SEO

### Estrutura de Commits

```bash
feat: adicionar nova seção de documentação
fix: corrigir navegação multilíngue
docs: atualizar guia de instalação
style: ajustar tipografia dos títulos
refactor: reestruturar componentes de layout
content: adicionar documentação do framework MOC
i18n: atualizar traduções em inglês
```

### Adicionando Conteúdo

```markdown
---
title: Título da Página
description: Descrição para SEO
navigation: {}
draft: false
category: protocol
---

# Conteúdo em Markdown

Utilize a sintaxe padrão do Markdown com suporte a:
- Syntax highlighting para código
- Componentes Vue integrados
- Links automáticos entre páginas
- Imagens otimizadas
```

## Licença

### Propriedade Intelectual

Este projeto é propriedade intelectual da **Casheiro** (www.casheiro.com.br) e está licenciado sob termos proprietários. Todos os direitos reservados.

### Termos de Uso

- **Uso Comercial**: Restrito conforme acordo de licenciamento
- **Distribuição**: Proibida sem autorização expressa
- **Modificação**: Permitida apenas para uso interno autorizado
- **Atribuição**: Obrigatória em todas as implementações

### Contato Legal

Para questões relacionadas à licença e propriedade intelectual, entre em contato através dos canais oficiais da Casheiro.

---

**Matrix Protocol Beta** | Desenvolvido por **Casheiro** | www.casheiro.com.br
