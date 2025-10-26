# Technical Documentation - Matrix Protocol Website v2

## Overview

Complete technical documentation for the Matrix Protocol Website v2 project, covering migration from Nuxt 3.x to Nuxt 4.x, quality automation systems, and operational procedures.

## Project Architecture

### Technology Stack

#### Core Framework
- **Nuxt**: 4.1.2 (migrated from 3.13.0)
- **Vue**: 3.5.21
- **TypeScript**: 5.6.3

#### UI & Styling
- **@nuxt/ui**: 3.3.4 (migrated from 2.17.0)
- **Tailwind CSS**: v4 (breaking changes handled)
- **Headless UI**: Integrated via @nuxt/ui

#### Content & Internationalization
- **@nuxt/content**: 3.7.1 (migrated from 2.13.0)
- **@nuxtjs/i18n**: 10.1.0 (migrated from 8.5.0)
- **Supported Locales**: Portuguese (pt), English (en)

#### Development & Quality
- **Playwright**: Visual regression and multilingual testing
- **Lighthouse**: Performance benchmarking
- **ESLint + Prettier**: Code quality
- **TypeScript Strict Mode**: Type safety

### Project Structure

```
matrix-protocol-website-v2/
├── app/                          # Main application directory (Nuxt 4.x)
│   ├── assets/                   # CSS, images, fonts
│   ├── components/               # Vue components
│   │   ├── layout/               # Layout components
│   │   ├── navigation/           # Navigation components
│   │   ├── content/              # Content components
│   │   ├── docs/                 # Documentation components
│   │   ├── home/                 # Homepage components
│   │   └── frameworks/           # Framework-specific components
│   ├── composables/              # Vue composables
│   ├── layouts/                  # Application layouts
│   ├── middleware/               # Route middleware
│   ├── pages/                    # Pages/routes
│   ├── plugins/                  # Nuxt plugins
│   ├── utils/                    # Utility functions
│   ├── app.vue                   # Root component with UApp wrapper
│   ├── app.config.ts             # Runtime configuration
│   └── error.vue                 # Error page
├── content/                      # Markdown content (@nuxt/content)
│   ├── en/                       # English content
│   └── pt/                       # Portuguese content
├── i18n/                         # Internationalization
│   └── locales/                  # Translation files
│       ├── pt.json               # Portuguese translations
│       └── en.json               # English translations
├── docs/                         # Project documentation
│   ├── quality-metrics.md        # Quality standards and thresholds
│   ├── dynamic-navigation/       # Migration planning documentation
│   └── migracao/                 # Migration specific docs
├── tests/                        # Quality automation systems
│   ├── performance-benchmarks.js # Performance testing automation
│   ├── visual-regression.spec.js # Visual regression testing
│   ├── multilingual-automation.js # Multilingual testing suite
│   ├── reports/                  # Generated test reports
│   └── VISUAL_TESTING_SETUP.md   # Visual testing documentation
├── scripts/                      # Utility scripts
│   └── validate-content.js       # Content validation automation
├── nuxt.config.ts                # Nuxt configuration
├── playwright.config.js          # Playwright configuration
├── multilingual-playwright.config.js # Multilingual test config
└── package.json                  # Dependencies and scripts
```

## Critical Configuration

### Nuxt Configuration

```typescript
// nuxt.config.ts - CRITICAL: Module order dependency
export default defineConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/ui',        // MUST come before @nuxtjs/i18n
    '@nuxtjs/i18n',
    '@nuxt/image'
  ],
  
  runtimeConfig: {
    public: {
      appName: 'Matrix Protocol',
      appVersion: '0.0.1',
      casheiroUrl: 'https://casheiro.com.br',
      githubUrl: process.env.GITHUB_URL || 'https://github.com/casheiro/matrix-protocol',
      discordUrl: process.env.DISCORD_URL || 'https://discord.gg/Gd7BxsRhB4'
    }
  }
})
```

### UApp Wrapper Requirement

```vue
<!-- app.vue - MANDATORY for @nuxt/ui 3.x -->
<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
```

### Internationalization Setup

```typescript
// i18n configuration
i18n: {
  defaultLocale: 'pt',
  locales: [
    { code: 'pt', name: 'Português', file: 'pt.json' },
    { code: 'en', name: 'English', file: 'en.json' }
  ],
  strategy: 'prefix',
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'i18n_redirected',
    redirectOn: 'root'
  }
}
```

## Migration Patterns & Best Practices

### Tailwind CSS v4 Compatibility (CRITICAL)

**Problem**: Tailwind CSS v4 breaks `@apply` usage in `<style scoped>` blocks

**Solution**: Convert all `@apply` to inline classes

```vue
<!-- ❌ WRONG (breaks in Tailwind v4) -->
<template>
  <button class="nav-link" :class="{ 'nav-link-active': active }">
</template>
<style scoped>
.nav-link { @apply text-gray-600 px-3 py-2; }
.nav-link-active { @apply text-blue-600 font-semibold; }
</style>

<!-- ✅ CORRECT (Tailwind v4 compatible) -->
<template>
  <button 
    class="text-gray-600 px-3 py-2"
    :class="{ 'text-blue-600 font-semibold': active }"
  >
</template>
<style scoped>
/* Only CSS that doesn't use Tailwind classes */
.custom-height {
  height: 4.5rem;
}
</style>
```

### Nuxt UI 3.x Component Updates

**USlideover Issues**: Avoid USlideover component due to Reka UI bugs

```vue
<!-- ❌ PROBLEMATIC -->
<USlideover v-model="isOpen">
  <!-- Creates orphaned data-dismissable-layer elements -->
</USlideover>

<!-- ✅ RECOMMENDED SOLUTION -->
<Transition
  enter-active-class="transition-transform duration-200"
  enter-from-class="-translate-x-full"
  enter-to-class="translate-x-0"
>
  <div v-if="isOpen" class="fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl">
    <!-- Custom implementation -->
  </div>
</Transition>
```

### Internationalization Patterns

```vue
<!-- Route links -->
:to="localePath('/frameworks/mef')"

<!-- Fallback for problematic contexts -->
:to="`/${$i18n.locale}/frameworks/mef`"

<!-- Text internationalization -->
{{ $t('navigation.frameworks') }}

<!-- SEO internationalization -->
const seoData = useSEO({
  title: t('seo.frameworks.title'),
  description: t('seo.frameworks.description')
})
```

## Quality Automation Systems

### 1. Performance Benchmarks

**File**: `tests/performance-benchmarks.js`

**Features**:
- Lighthouse simulation for performance scoring
- Bundle size analysis and tracking
- Loading time measurement across pages
- Automated report generation (JSON, HTML, text)

**Usage**:
```bash
node tests/performance-benchmarks.js
```

**Quality Thresholds**:
- Performance: ≥90 (target: ≥95)
- Accessibility: ≥95 (target: ≥98)
- Bundle Size: ≤500KB (target: ≤350KB)

### 2. Visual Regression Testing

**File**: `tests/visual-regression-playwright.spec.js`
**Config**: `playwright.config.js`

**Features**:
- Cross-browser testing (Chromium, Firefox, WebKit)
- Multi-viewport testing (desktop, tablet, mobile, wide)
- Full-page screenshot comparisons
- Framework-specific visual validation

**Usage**:
```bash
npx playwright test visual-regression-playwright.spec.js
npx playwright test visual-regression-playwright.spec.js --update-snapshots
```

**Coverage**:
- Homepage (PT/EN)
- Framework pages (MEF, ZOF, OIF, MOC, MAL)
- Documentation navigation
- Mobile responsive layouts

### 3. Content Validation Automation

**File**: `scripts/validate-content.js`

**Features**:
- Frontmatter validation against schemas
- Internal/external link validation
- Multilingual content parity checking
- Directory structure validation
- Automated report generation

**Usage**:
```bash
node scripts/validate-content.js
```

**Validations**:
- Required frontmatter fields
- Schema compliance
- Link accessibility
- PT/EN content parity

### 4. Multilingual Testing Automation

**File**: `tests/multilingual-automation.js`
**Config**: `multilingual-playwright.config.js`

**Features**:
- Route localization testing
- Content parity validation
- SEO multilingual compliance
- User experience consistency
- Performance comparison between languages

**Usage**:
```bash
node tests/multilingual-automation.js
npx playwright test --config=multilingual-playwright.config.js
```

**Test Categories**:
1. Route accessibility in both languages
2. Language switching functionality
3. SEO element localization (meta tags, hreflang)
4. Navigation persistence across language changes
5. Performance consistency between PT/EN

## Development Workflow

### Environment Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Generate static site
pnpm generate

# Preview built site
pnpm preview
```

### Quality Gates

#### Pre-commit Validation
```bash
# TypeScript validation
pnpm typecheck

# Code quality check
pnpm lint

# Content validation
node scripts/validate-content.js
```

#### Pre-deployment Validation
```bash
# Full quality check
node tests/performance-benchmarks.js
npx playwright test visual-regression-playwright.spec.js
node tests/multilingual-automation.js

# Build validation
pnpm build
```

### Development Standards

#### Code Style
- **TypeScript Strict Mode**: Enabled
- **ESLint**: Zero errors in production
- **Prettier**: 100% compliance
- **No `any` types**: Complete type coverage

#### Component Standards
- Use `<script setup>` syntax
- Implement proper TypeScript interfaces
- Follow Vue 3 Composition API patterns
- Ensure accessibility compliance (WCAG AA)

#### Internationalization Requirements
- ALL user-facing text must use `$t()` functions
- Internal links must use `localePath()`
- Content must exist in both PT and EN
- SEO meta tags must be localized

## Matrix Protocol Specific Requirements

### Framework Colors (Mandatory)
```css
--mef-green: #2ECC71;       /* MEF - Matrix Embedding Framework */
--zof-orange: #E67E22;      /* ZOF - Zion Orchestration Framework */
--oif-blue: #2980B9;        /* OIF - Operator Intelligence Framework */
--moc-purple: #9B59B6;      /* MOC - Matrix Ontology Catalog */
--mal-red: #C0392B;         /* MAL - Matrix Arbiter Layer */
```

### Typography Standards
- **Headings**: Rajdhani (Bold/Regular)
- **Body**: Source Code Pro (Regular/Medium)
- **Code**: Source Code Pro (Monospace)

### Content Requirements
- Focus ONLY on Matrix Protocol frameworks
- Portuguese-first approach (default locale)
- Complete bilingual support (PT/EN)
- Consistent terminology across languages

## Deployment & Operations

### Production Build Process

```bash
# 1. Quality validation
node tests/performance-benchmarks.js
npx playwright test visual-regression-playwright.spec.js
node scripts/validate-content.js

# 2. Build generation
pnpm build

# 3. Final validation
pnpm preview
node tests/multilingual-automation.js
```

### Performance Monitoring

#### Automated Monitoring
- **Daily**: Lighthouse CI performance audits
- **Weekly**: Visual regression testing
- **Bi-weekly**: Comprehensive multilingual validation
- **Monthly**: Bundle size and performance trend analysis

#### Key Metrics to Track
- Core Web Vitals (LCP, FID, CLS)
- Bundle size growth
- Accessibility score maintenance
- SEO performance
- Multilingual parity compliance

### Troubleshooting Guide

#### Common Issues

1. **Build Failures**
   - Check module order in `nuxt.config.ts`
   - Verify UApp wrapper in `app.vue`
   - Validate TypeScript compilation

2. **i18n Issues**
   - Ensure all internal links use `localePath()`
   - Check locale configuration
   - Verify content exists for both languages

3. **Tailwind CSS v4 Issues**
   - Convert `@apply` to inline classes
   - Check for scoped style conflicts
   - Validate Tailwind configuration

4. **Component Issues**
   - Update @nuxt/ui component APIs for v3.x
   - Avoid problematic components (USlideover)
   - Test responsive behavior

## Quality Metrics & Success Criteria

### Current Status (Phase 1 Complete)
- [x] Performance benchmarks implemented
- [x] Visual regression testing configured
- [x] Content validation automation
- [x] Quality metrics documentation
- [x] Multilingual testing automation
- [x] Technical documentation complete

### Quality Standards Compliance
- **Performance**: All pages ≥90 Lighthouse score
- **Accessibility**: WCAG AA compliance
- **SEO**: Comprehensive multilingual SEO
- **Code Quality**: TypeScript strict mode, zero lint errors
- **Content**: 100% PT/EN parity validation
- **Visual**: Cross-browser consistency validated

### Next Phase Objectives
- Implement CI/CD quality gates
- Set up performance monitoring dashboard
- Establish automated alerting for quality regressions
- Complete migration of remaining components
- Optimize bundle size to target thresholds

## Support & Resources

### Documentation References
- **Project Rules**: `.trae/rules/project_rules.md`
- **Migration Documentation**: `docs/migracao/`
- **Quality Metrics**: `docs/quality-metrics.md`
- **Visual Testing Setup**: `tests/VISUAL_TESTING_SETUP.md`

### External Documentation
- [Nuxt 4.x Documentation](https://nuxt.com/docs)
- [@nuxt/ui 3.x Components](https://ui.nuxt.com/)
- [@nuxt/content 3.x Guide](https://content.nuxt.com/)
- [Playwright Testing](https://playwright.dev/)

### Support Channels
- **GitHub**: Issues and feature requests
- **Discord**: Community support
- **Documentation**: Comprehensive technical guides

---

**Generated**: 2025-01-25T21:46:44.041Z  
**Version**: Matrix Protocol Website v2  
**Status**: Quality Automation Phase Complete

> **Note**: This technical documentation provides complete guidance for development, migration, quality assurance, and operational procedures for the Matrix Protocol Website v2 project. All automation systems are production-ready and actively validated.