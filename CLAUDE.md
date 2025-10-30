# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Matrix Protocol Website v2** - an internationalized (i18n) Nuxt 4.x documentation site for the Matrix Protocol Beta, a comprehensive framework for human-AI collaboration. The project is **completely internationalized** with full Portuguese (pt) and English (en) support, making i18n a core architectural concern that must be considered in ALL development work.

## Critical I18n Architecture

**⚠️ INTERNATIONAL PROJECT - ALL ACTIONS MUST BE I18N-AWARE**

This project is designed from the ground up for internationalization:

- **Default locale**: Portuguese (`pt`) - All development should start here
- **Secondary locale**: English (`en`) - Must maintain content parity
- **Strategy**: Prefix-based routing (`/pt/`, `/en/`)
- **Content structure**: Completely duplicated for each language in `/content/pt/` and `/content/en/`

## Essential Commands

### Development
```bash
# Start development server (includes both PT and EN routes)
pnpm dev

# Build for production 
pnpm build

# Generate static site
pnpm generate

# Preview built site
pnpm preview

# Type checking (strict mode enabled)
pnpm typecheck

# Content validation (validates both PT and EN content)
node scripts/validate-content.js
```

### Quality Assurance
```bash
# Performance benchmarks
node tests/performance-benchmarks.js

# Visual regression testing (all browsers/viewports)
npx playwright test visual-regression-playwright.spec.js

# Multilingual testing automation
node tests/multilingual-automation.js

# Update visual snapshots (when UI changes are intentional)
npx playwright test visual-regression-playwright.spec.js --update-snapshots
```

### Content Management
```bash
# Validate content structure and i18n parity
node scripts/validate-content.js

# Check for broken links in both languages
grep -r "](/" content/ | grep -v "http"

# Find missing translations
diff -r content/pt/ content/en/ --exclude="*.md" || echo "Structure differences found"
```

## Architecture Overview

### Technology Stack
- **Framework**: Nuxt 4.x with Vue 3.5.21 (Composition API)
- **UI**: @nuxt/ui 3.3.4 with Tailwind CSS v4
- **Content**: @nuxt/content 3.7.1 for markdown processing
- **I18n**: @nuxtjs/i18n 10.1.0 (prefix strategy)
- **TypeScript**: Strict mode enabled (5.6.3)
- **Quality**: Playwright for testing, automated validation pipelines

### Project Structure (I18n-First)
```
matrix-protocol/
├── app/                          # Nuxt 4.x app directory
│   ├── components/               # Vue components (i18n-aware)
│   │   ├── navigation/           # Multi-language navigation
│   │   ├── content/              # Content display components  
│   │   └── layout/               # Layout components
│   ├── composables/              # Vue composables
│   │   ├── useNavigationI18n.ts  # Navigation i18n logic
│   │   ├── useMatrixConfig.ts    # Framework configuration
│   │   └── useSEO.ts             # Multi-language SEO
│   ├── pages/                    # Route pages (auto i18n routing)
│   └── middleware/               # Global middleware
├── content/                      # Content (FULLY DUPLICATED)
│   ├── pt/                       # Portuguese content (primary)
│   │   ├── docs/                 # Documentation
│   │   │   ├── frameworks/       # MEF, ZOF, OIF, MOC, MAL
│   │   │   ├── examples/         # Use cases and examples
│   │   │   └── manual/           # Implementation guides
│   │   └── mep/                  # Matrix Epistemic Principle
│   └── en/                       # English content (mirror structure)
│       └── [same structure as pt/]
├── i18n/                         # Internationalization
│   └── locales/                  # Translation files
│       ├── pt.json               # Portuguese translations
│       └── en.json               # English translations
├── shared/types/                 # TypeScript type definitions
├── tests/                        # Quality automation systems
└── docs/                         # Technical documentation
```

## Matrix Protocol Specific Architecture

This website documents the **Matrix Protocol Beta** - a framework for human-AI collaboration consisting of:

### Five Frameworks (Each with Full I18n Support)
1. **MEF** (Matrix Embedding Framework) - Knowledge structuring - `#2ECC71`
2. **ZOF** (Zion Orchestration Framework) - Workflow orchestration - `#E67E22`  
3. **OIF** (Operator Intelligence Framework) - AI archetypes - `#2980B9`
4. **MOC** (Matrix Ontology Catalog) - Organizational hierarchies - `#9B59B6`
5. **MAL** (Matrix Arbiter Layer) - Conflict arbitration - `#C0392B`

### Content Organization Pattern
```
/content/{locale}/docs/frameworks/{framework}.md    # Framework specs
/content/{locale}/docs/examples/                    # Implementation examples  
/content/{locale}/docs/manual/                      # Detailed guides
/content/{locale}/mep/                              # Epistemic principles
```

## Critical Development Patterns

### I18n Requirements for ALL Changes

1. **Content Changes**: Must be made in BOTH `/content/pt/` AND `/content/en/`
2. **UI Text**: Must use `$t()` functions, never hardcoded strings
3. **Internal Links**: Must use `localePath()` for route generation
4. **SEO**: Meta tags, titles, descriptions must be localized
5. **Testing**: All features must work in both languages

### Nuxt 4.x Critical Requirements

```vue
<!-- app.vue - MANDATORY UApp wrapper for @nuxt/ui 3.x -->
<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
```

### Tailwind CSS v4 Compatibility
**❌ BROKEN**: `@apply` in scoped styles
```vue
<style scoped>
.nav-link { @apply text-gray-600 px-3 py-2; } /* BREAKS */
</style>
```

**✅ CORRECT**: Inline classes
```vue
<template>
  <button class="text-gray-600 px-3 py-2" :class="{ 'text-blue-600': active }">
</template>
```

### I18n-Aware Component Pattern
```vue
<template>
  <div>
    <h1>{{ $t('frameworks.mef.title') }}</h1>
    <NuxtLink :to="localePath('/frameworks/zof')">
      {{ $t('navigation.nextFramework') }}
    </NuxtLink>
  </div>
</template>

<script setup>
// Always use composables for i18n-aware logic
const { t, locale } = useI18n()
const matrixConfig = useMatrixConfig()

// SEO must be localized
useSEO({
  title: t('frameworks.mef.title'),
  description: t('frameworks.mef.description')
})
</script>
```

## Development Workflow

### Before Making Changes
1. **Understand the i18n scope**: Will this change affect both languages?
2. **Check content parity**: Run `node scripts/validate-content.js` 
3. **Verify current functionality**: Test in both Portuguese and English

### Making Content Changes
1. **Start with Portuguese** (primary language)
2. **Update corresponding English content** (maintain semantic parity)
3. **Validate content structure**: Ensure frontmatter consistency
4. **Test navigation**: Links must work in both languages

### Making Component Changes  
1. **Use composables**: `useMatrixConfig()`, `useNavigationI18n()`, `useSEO()`
2. **Avoid hardcoded strings**: Everything must use `$t()` functions
3. **Test responsive design**: Components must work across devices
4. **Validate accessibility**: WCAG AA compliance required

### Quality Gates (Run Before Committing)
```bash
# Type check (zero errors required)
pnpm typecheck

# Content validation (must pass)
node scripts/validate-content.js

# Visual consistency check
npx playwright test visual-regression-playwright.spec.js
```

## Common Tasks

### Adding New Content
1. Create content in `/content/pt/` first
2. Add corresponding file in `/content/en/` 
3. Update navigation if needed (both `pt.json` and `en.json`)
4. Validate with `node scripts/validate-content.js`

### Adding New Framework Information
1. Update `useMatrixConfig.ts` with framework data
2. Add content files in both languages
3. Update translation files for any new UI text
4. Test framework-specific colors and branding

### Fixing Broken Links
1. Run content validation to identify issues
2. Fix in both language versions if applicable
3. Test navigation flows in both languages
4. Validate with automation scripts

### Performance Optimization
1. Run performance benchmarks: `node tests/performance-benchmarks.js`
2. Check bundle size (target: ≤350KB)
3. Validate Core Web Vitals scores
4. Test across all supported browsers

## Critical Configurations

### Module Load Order (nuxt.config.ts)
```typescript
modules: [
  '@nuxt/content',
  '@nuxt/ui',        // MUST come before @nuxtjs/i18n
  '@nuxtjs/i18n',
  '@nuxt/image'
]
```

### I18n Configuration
```typescript
i18n: {
  defaultLocale: 'pt',
  strategy: 'prefix',
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'matrix_locale',
    redirectOn: 'root'
  }
}
```

## Troubleshooting

### Build Failures
- Check module order in `nuxt.config.ts`
- Verify UApp wrapper exists in `app.vue`
- Ensure TypeScript compilation passes
- Validate content structure in both languages

### I18n Issues  
- Confirm all internal links use `localePath()`
- Check translation key existence in both `pt.json` and `en.json`
- Verify content exists for both languages
- Test language switching functionality

### Content Issues
- Run `node scripts/validate-content.js` for comprehensive checks
- Check frontmatter consistency between languages
- Validate internal link targets exist
- Ensure required content structure is maintained

## Quality Standards

### Content Quality
- **Multilingual Parity**: 100% - all content must exist in both languages
- **Link Health**: 99%+ - broken links are not acceptable  
- **Frontmatter Compliance**: 100% - required fields must be present
- **Navigation Consistency**: Both languages must have equivalent navigation

### Performance Targets
- **Lighthouse Performance**: ≥95 (minimum: ≥90)
- **Accessibility**: ≥98 (minimum: ≥95)  
- **Bundle Size**: ≤350KB (maximum: ≤500KB)
- **Core Web Vitals**: All thresholds must be met

### Code Quality
- **TypeScript**: Strict mode, zero `any` types
- **ESLint**: Zero errors in production builds
- **Component Standards**: Vue 3 Composition API, proper TypeScript interfaces
- **Accessibility**: WCAG AA compliance mandatory

## Essential Composables

### useMatrixConfig()
Provides centralized access to:
- Framework information (MEF, ZOF, OIF, MOC, MAL)
- Brand assets and color schemes
- Environment configuration
- Navigation structure

### useNavigationI18n()  
Handles all i18n navigation concerns:
- Locale switching with path preservation
- Multi-language content discovery
- Breadcrumb generation per language
- SEO hreflang tag generation

### useSEO()
Manages localized SEO:
- Multi-language meta tags
- Framework-specific descriptions
- Social media optimization
- Search engine compliance

## Matrix Protocol Brand Guidelines

### Framework Colors (Mandatory)
```css
--mef-green: #2ECC71     /* MEF - Matrix Embedding Framework */
--zof-orange: #E67E22    /* ZOF - Zion Orchestration Framework */  
--oif-blue: #2980B9      /* OIF - Operator Intelligence Framework */
--moc-purple: #9B59B6    /* MOC - Matrix Ontology Catalog */
--mal-red: #C0392B       /* MAL - Matrix Arbiter Layer */
```

### Typography Standards
- **Headings**: Rajdhani (400, 500, 600, 700)
- **Body Text**: Source Code Pro (400, 500, 600)
- **Code**: Source Code Pro (monospace)

### Logo Assets (Theme: Dark Fixed)
- Main logo: `/logos/matrix/matrix-protocol-logo-white.svg`
- Icon: `/logos/matrix/matrix-protocol-icon-white.svg`
- Framework logos: `/logos/{framework}/{framework}-logo-text-color-full.svg`

## Padrões Visuais para Diagramas Mermaid

### Cores Padronizadas dos Frameworks
Utilize SEMPRE estas cores para manter consistência visual:

```css
/* Cores oficiais com alto contraste para legibilidade */
--mef-style: fill:#1E8449,stroke:#2ECC71,color:#fff,stroke-width:2px  /* Verde */
--zof-style: fill:#D35400,stroke:#E67E22,color:#fff,stroke-width:2px  /* Laranja */
--oif-style: fill:#2471A3,stroke:#2980B9,color:#fff,stroke-width:2px  /* Azul */
--moc-style: fill:#8E44AD,stroke:#9B59B6,color:#fff,stroke-width:2px  /* Roxo */
--mal-style: fill:#A93226,stroke:#C0392B,color:#fff,stroke-width:2px  /* Vermelho */
--user-style: fill:#34495E,stroke:#2C3E50,color:#fff,stroke-width:2px /* Usuário */
```

### Template Padrão para Diagramas
```mermaid
%% SEMPRE use este template em novos diagramas
classDef mef fill:#1E8449,stroke:#2ECC71,color:#fff,stroke-width:2px
classDef zof fill:#D35400,stroke:#E67E22,color:#fff,stroke-width:2px
classDef oif fill:#2471A3,stroke:#2980B9,color:#fff,stroke-width:2px
classDef moc fill:#8E44AD,stroke:#9B59B6,color:#fff,stroke-width:2px
classDef mal fill:#A93226,stroke:#C0392B,color:#fff,stroke-width:2px
classDef user fill:#34495E,stroke:#2C3E50,color:#fff,stroke-width:2px
```

### Validação de Acessibilidade
- **Contraste mínimo**: 4.5:1 (WCAG AA) ✅ Implementado
- **Texto**: Sempre branco (#fff) em fundos escuros
- **Bordas**: Cores primárias dos frameworks para definição
- **Documentação**: Ver `/docs/MERMAID_VISUAL_STANDARDS.md`

Remember: This is an **internationalized project** where i18n considerations must be part of every development decision. When in doubt about i18n requirements, check the existing patterns in the codebase and ensure both Portuguese and English versions are properly maintained.