# Tags vs Keywords Strategy - Matrix Protocol Documentation

## 🎯 Objective
Establish clear, consistent criteria for using `tags` and `keywords` in frontmatter across all 167 documentation files.

## 📊 Current State Analysis
- **Total files**: 167
- **Files with keywords**: 167 (100%)
- **Files with tags**: 45 (27%)
- **Inconsistency**: 122 files missing appropriate tags

## 🔍 Functional Differentiation

### `keywords` (Mandatory for ALL files)
- **Purpose**: External SEO + conceptual search
- **Audience**: Search engines, external users
- **Content**: Technical concepts specific to file content
- **Format**: 6-12 relevant keywords
- **Example**:
```yaml
keywords:
  - Matrix Protocol
  - MEF
  - knowledge structuring
  - UKI
  - versioning
  - embedding
```

### `tags` (Mandatory for specific categories)
- **Purpose**: Internal navigation + functional filters
- **Audience**: Users browsing documentation
- **Content**: Hierarchical and functional categories
- **Format**: 3-8 standardized tags
- **Example**:
```yaml
tags:
  - manual
  - tools
  - validation
  - quality
  - checklist
```

## 📋 Standardized Tag Taxonomy

### Framework Core (MEF, ZOF, OIF, MOC, MAL)
```yaml
tags:
  - frameworks
  - [framework-name]  # mef, zof, oif, moc, mal
  - core
```

### Manual/Tools
```yaml
tags:
  - manual
  - tools
  - [function]  # validation, automation, quality, dod, feedback
```

### Templates
```yaml
tags:
  - manual
  - templates
  - [org-size]  # startup, scaleup, enterprise, corporation, unified, basic
```

### Examples
```yaml
tags:
  - examples
  - [type]  # structured, unstructured, pilots, conceptual, knowledge
  - [category]  # business-rules, technical-patterns, procedures (if applicable)
```

### Implementation Guides
```yaml
tags:
  - implementation
  - [phase]  # quickstart, assessment, planning, manual
```

### Language/Protocol Core
```yaml
tags:
  - protocol
  - [component]  # mep, core, integration
```

## 🔧 Implementation Rules

### Files that MUST have tags:
1. **All manual/** files
2. **All examples/** files  
3. **All templates/** files
4. **All implementation guides**
5. **Tools and utilities**

### Files that MAY have only keywords:
1. **Core framework specifications** (MEF, ZOF, OIF, MOC, MAL main files)
2. **Individual UKI examples** (specific business rules, patterns)
3. **Glossary and reference materials**

## ✅ Quality Gates

### Before publication, verify:
- [ ] All files have relevant `keywords` (6-12 items)
- [ ] Applicable files have standardized `tags` (3-8 items)
- [ ] Tags follow taxonomy hierarchy
- [ ] Keywords reflect actual file content
- [ ] No generic or placeholder keywords

## 🚀 Implementation Priority

### Phase 1: Critical Categories
1. Manual/Tools files (add missing tags)
2. Template files (standardize org-size tags)
3. Example files (add type/category tags)

### Phase 2: Enhancement
1. Framework files (evaluate if tags needed)
2. Implementation guides (standardize phase tags)
3. UKI examples (selective tagging)

### Phase 3: Automation
1. Validation script for tag compliance
2. DoD checklist integration
3. Future contribution guidelines

## 📏 Success Metrics
- **100%** of applicable files have appropriate tags
- **Consistent taxonomy** across similar content types
- **Improved findability** through internal navigation
- **Enhanced SEO** through optimized keywords

---

**Created**: 2025-01-25  
**Status**: Implementation Ready  
**Owner**: Matrix Protocol Documentation Team