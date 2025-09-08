# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Matrix Protocol Website** - a Nuxt.js 3 application for the official website of the Matrix Protocol v1.0.0. The website serves as the primary documentation hub, resource center, and community portal for the Matrix Protocol ecosystem.

The Matrix Protocol is a comprehensive framework for human-AI collaboration through three interdependent layers:
- **Oracle Layer**: Strategic governance & knowledge base management (MEF)
- **Zion Layer**: Conceptual workflow framework for AI-oriented teams (ZOF)  
- **Operator Layer**: Practical execution and implementation by development teams (OIF)

## Technology Stack

- **Framework**: Nuxt.js 3 with TypeScript
- **Package Manager**: pnpm (required)
- **Styling**: Tailwind CSS + Nuxt UI
- **State Management**: Pinia stores
- **Internationalization**: @nuxtjs/i18n (Portuguese/English)
- **Fonts**: Rajdhani (primary) + Source Code Pro (monospace)
- **Node Version**: >=20.0.0

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Generate static site
pnpm generate

# Type checking
pnpm typecheck
```

## Project Architecture

### Core Structure
```
website/
├── app.vue                 # Root application component
├── nuxt.config.ts         # Nuxt configuration with modules
├── tailwind.config.ts     # Tailwind with Matrix Protocol brand colors
├── stores/                # Pinia state management
│   └── app.ts            # Main app store (menu, framework state)
├── types/                 # TypeScript type definitions
│   └── index.d.ts        # Framework, navigation, color interfaces
├── assets/css/           # Global CSS
├── public/assets/        # Static assets (logos, icons)
└── pages/               # Auto-routed pages (currently empty)
```

### Brand System Integration

The website implements the official Matrix Protocol brand system with:

#### **Color Palette** (Tailwind configuration)
- **MEF**: `#2ECC71` (Emerald Green) - Structure/Foundation
- **ZOF**: `#E67E22` (Amber Orange) - Movement/Orchestration  
- **OIF**: `#2980B9` (Deep Blue) - Intelligence/Wisdom
- **MOC**: `#9B59B6` (Neutral Lilac) - Catalog/Organization
- **MAL**: `#C0392B` (Dark Red) - Arbitration/Decision

#### **Typography**
- **Primary**: Rajdhani (Google Fonts) - Futuristic, geometric
- **Code**: Source Code Pro - For code blocks and technical content

#### **Brand Assets**
Official logos are located in `/public/assets/logos/` with structure:
```
logos/
├── matrix/               # Matrix Protocol main logos
├── mef/                 # MEF framework logos  
├── zof/                 # ZOF framework logos
├── oif/                 # OIF framework logos
├── moc/                 # MOC framework logos
└── mal/                 # MAL framework logos
```

Each framework has three variants:
- `{framework}-logo-text-color-full.svg` - Full colored version
- `{framework}-logo-color-text-white.svg` - White text version
- `{framework}-logo-icon.svg` - Icon only

### State Management

The app uses Pinia with a main store at `stores/app.ts`:

```typescript
interface AppState {
  isMenuOpen: boolean
  currentFramework: string | null
}

// Available getters
frameworkColor: string | null  // Returns framework color class

// Available actions  
toggleMenu()                   // Toggle mobile menu
setFramework(framework)        // Set current framework context
```

### Type System

Key interfaces in `types/index.d.ts`:

```typescript
interface Framework {
  key: string
  acronym: string  
  name: string
  description: string
  colorClass: string
}

interface NavigationItem {
  label: string
  to: string
  icon?: string
}

interface MatrixColor {
  50-900: string  // Tailwind color scale
}
```

## Configuration Details

### Nuxt Configuration
- **Modules**: @nuxt/ui, @nuxtjs/i18n, @pinia/nuxt, @vueuse/nuxt, @nuxtjs/google-fonts
- **TypeScript**: Strict mode with full type checking enabled
- **CSS**: Tailwind integrated via Nuxt UI
- **Internationalization**: Portuguese (default) and English with prefix strategy

### Internationalization Setup
- **Default locale**: Portuguese (pt)
- **Supported**: English (en), Portuguese (pt)
- **Strategy**: Prefix (`/pt/page`, `/en/page`)

### Google Fonts Configuration
```typescript
googleFonts: {
  families: {
    Rajdhani: { wght: [300, 400, 500, 600, 700] },
    'Source Code Pro': { wght: [400, 500, 600] }
  }
}
```

## Development Guidelines

### Component Development
- Use Nuxt UI components as base components
- Follow Matrix Protocol brand guidelines for colors and typography
- Implement responsive design with mobile-first approach
- Use TypeScript interfaces for all props and data structures

### Styling Conventions
- Use Tailwind utility classes with Matrix Protocol brand colors
- Framework-specific colors: `mef-500`, `zof-500`, `oif-500`, `moc-500`, `mal-500`
- Font classes: `font-sans` (Rajdhani), `font-mono` (Source Code Pro)
- Maintain visual hierarchy with consistent spacing and typography scales

### Brand Compliance
- Always use official brand colors from the Tailwind configuration
- Respect logo usage guidelines with proper variants for different contexts
- Maintain minimum protection areas around brand assets
- Use Rajdhani font family consistently across all text elements

### Internationalization
- All user-facing content must be translatable
- Use i18n keys for all text content
- Maintain parallel content structure for both languages
- Test language switching functionality

## Content Strategy

The website follows the comprehensive documentation structure defined in `WEBSITE_ARCHITECTURE.md`, serving as:
- Portal for developers and organizations interested in Matrix Protocol
- Centralized documentation hub with intuitive navigation
- Resource center with downloads, examples, and tools
- Showcase of protocol capabilities and benefits
- Community hub for adoption and contributions

## Performance Requirements

- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Lighthouse Score**: 95+ in all categories
- **Bundle Size**: < 200KB initial load
- **Font Loading**: Optimized with `font-display: swap`

## Accessibility Standards

- **WCAG 2.1 AA** compliance required
- Full keyboard navigation support
- Screen reader compatibility
- Color contrast minimum 4.5:1 (achieved through official brand palette)
- Descriptive alt texts for all brand assets

## Quality Standards

- Strict TypeScript configuration with no unused variables/parameters
- ESLint and Prettier for code formatting
- Component isolation and reusability
- Comprehensive type definitions for all data structures
- Performance optimization for static assets and images

## Environment Configuration

Este projeto usa variáveis de ambiente para todas as configurações externas e sensíveis, garantindo flexibilidade entre ambientes de desenvolvimento, teste e produção.

### Setup Inicial

```bash
# Copiar template de variáveis
cp .env.example .env.local

# Editar com suas configurações locais
nano .env.local
```

### Variáveis de Ambiente Disponíveis

#### Aplicação
- `NUXT_PUBLIC_APP_NAME`: Nome da aplicação (padrão: "Matrix Protocol")
- `NUXT_PUBLIC_APP_VERSION`: Versão da aplicação (padrão: "1.0.0")
- `NUXT_PUBLIC_APP_URL`: URL pública da aplicação
- `NODE_ENV`: Ambiente (development/production)
- `PORT`: Porta do servidor (padrão: 3000)

#### Links Externos
- `NUXT_PUBLIC_GITHUB_URL`: URL do repositório GitHub (**OBRIGATÓRIA**)
- `NUXT_PUBLIC_DISCORD_URL`: URL do servidor Discord (opcional)
- `NUXT_PUBLIC_DISCUSSIONS_URL`: URL do GitHub Discussions (opcional)
- `NUXT_PUBLIC_DOCS_URL`: URL da documentação (opcional)

#### API e Backend
- `NUXT_PUBLIC_API_BASE_URL`: URL base da API
- `NUXT_API_SECRET`: Chave secreta para APIs server-side

#### Analytics (Opcional)
- `NUXT_PUBLIC_PLAUSIBLE_DOMAIN`: Domínio Plausible Analytics
- `NUXT_PUBLIC_GA_ID`: Google Analytics ID

### Importante para IA Agents e Desenvolvedores

#### ❌ **NUNCA faça isso:**
```vue
<!-- ERRADO: URL hardcoded -->
<a href="https://github.com/matrix-protocol/matrix-protocol">GitHub</a>

<!-- ERRADO: Configuração direta -->
<div>{{ "Matrix Protocol v1.0.0" }}</div>
```

#### ✅ **SEMPRE faça isso:**
```vue
<script setup>
// CORRETO: Usar composable useAppConfig
const { githubUrl, appName, appVersion } = useAppConfig()
</script>

<template>
  <!-- CORRETO: URLs via variáveis de ambiente -->
  <a :href="githubUrl">{{ appName }} v{{ appVersion }}</a>
</template>
```

### Composable useAppConfig

Use sempre o composable `useAppConfig()` para acessar configurações:

```typescript
// Exemplo completo de uso
const config = useAppConfig()

// Dados básicos da aplicação
config.appName          // "Matrix Protocol"
config.appVersion       // "1.0.0"
config.appUrl          // "https://matrix-protocol.com"

// Links externos
config.githubUrl       // URL do GitHub
config.discordUrl      // URL do Discord
config.docsUrl         // URL da documentação

// Helpers computados
config.hasAnalytics    // true se analytics configurado
config.hasExternalLinks // true se links externos disponíveis
config.getFullUrl('/about') // Gera URL completa

// Métodos utilitários
config.isDevelopment   // true em desenvolvimento
config.isProduction    // true em produção
```

## Docker & Deployment

O projeto está configurado para deploy com Docker e Coolify desde o início.

### Desenvolvimento com Docker

```bash
# Desenvolvimento com hot reload
docker-compose -f docker-compose.dev.yml up

# Ou desenvolvimento normal
pnpm dev
```

### Build para Produção

```bash
# Build da imagem Docker
docker build -t matrix-protocol-website .

# Executar em produção
docker-compose up -d
```

### Deploy com Coolify

O projeto está pronto para deploy automático com Coolify:

1. **Coolify detectará automaticamente** o `docker-compose.yml`
2. **Configure as variáveis de ambiente** no painel Coolify
3. **Deploy automático** via Git push

#### Variáveis Obrigatórias para Produção
- `NUXT_PUBLIC_APP_URL`: URL pública do site
- `NUXT_PUBLIC_GITHUB_URL`: URL do repositório
- `NODE_ENV=production`

#### Variáveis Opcionais
- `NUXT_PUBLIC_DISCORD_URL`: Para link da comunidade
- `NUXT_PUBLIC_GA_ID`: Para analytics Google
- `NUXT_API_SECRET`: Para futuras APIs server-side

### Health Check

O endpoint `/api/health` está disponível para:
- Docker health checks
- Monitoramento do Coolify
- Status da aplicação

```bash
curl http://localhost:3000/api/health
```

Retorna informações sobre status, versão, uptime e uso de memória.

### Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev
pnpm typecheck

# Docker
pnpm docker:dev    # Desenvolvimento com Docker
pnpm docker:build  # Build da imagem
pnpm docker:prod   # Produção com Docker

# Build
pnpm build
pnpm preview
```

## Estrutura de Configuração

```
├── .env.example          # Template de variáveis de ambiente
├── .env.local           # Suas configurações locais (ignorado pelo git)
├── nuxt.config.ts       # Configuração Nuxt com runtimeConfig
├── composables/
│   └── useAppConfig.ts  # Composable para acessar configurações
├── server/api/
│   └── health.get.ts    # Endpoint de health check
├── Dockerfile           # Configuração Docker multi-stage
├── docker-compose.yml   # Produção
└── docker-compose.dev.yml # Desenvolvimento
```

Essa estrutura garante que o projeto seja facilmente portable entre ambientes e pronto para CI/CD e deploy automatizado.