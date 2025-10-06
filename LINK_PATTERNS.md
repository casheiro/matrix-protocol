# Link Patterns Documentation

**Version:** 0.0.1  
**Status:** Beta  
**Last Updated:** 2025-10-05  
**Purpose:** Define standardized linking patterns for repository and website cross-references

## Overview

This document establishes consistent patterns for internal and external linking across the Matrix Protocol repository and website to ensure maintainable cross-references and proper synchronization.

## Repository Link Patterns

### 1. Internal Repository Links (Preferred)

#### Framework Cross-References
```markdown
# Framework to framework references
See [ZOF Framework](./ZOF_ZION_ORCHESTRATION_FRAMEWORK.md)
See [MEF Specification](./MEF_MATRIX_EMBEDDING_FRAMEWORK.md)
See [MOC Catalog](./MOC_MATRIX_ONTOLOGY_CATALOG.md)

# Section-specific references
See [Section 5: UKI Lifecycle](./MEF_MATRIX_EMBEDDING_FRAMEWORK.md#5-uki-lifecycle)
See [EvaluateForEnrich Checkpoint](./ZOF_ZION_ORCHESTRATION_FRAMEWORK.md#evaluateforenrich-checkpoint)
```

#### Directory Structure References
```markdown
# Guides references
See [Quick Start Guide](./guides/QUICK_START.md)
See [Implementation Roadmap](./guides/IMPLEMENTATION_ROADMAP.md)
See [Common Pitfalls](./guides/COMMON_PITFALLS.md)

# Examples references
See [Knowledge Comparison Examples](./examples/knowledge-comparison/)
See [MOC Squad Payments Example](./examples/knowledge-comparison/MOC_SQUAD_PAYMENTS.yaml)
See [UKI Examples](./examples/knowledge-comparison/structured/)

# Templates references
See [MOC Templates](./templates/moc/)
See [UKI Templates](./templates/uki/)
See [Startup MOC Template](./templates/moc/startup.yaml)

# Visualizations references
See [ZOF Canonical States](./visualizations/zof-canonical-states.md)
See [MAL Arbitration Flow](./visualizations/mal-arbitration-flow.md)
See [MOC Hierarchies](./visualizations/moc-hierarchies.md)
```

#### Bilingual File References
```markdown
# English to Portuguese
See [Portuguese Version](./MATRIX_PROTOCOL_PT.md)
See [Portuguese MEF](./MEF_MATRIX_EMBEDDING_FRAMEWORK_PT.md)

# Portuguese to English
See [English Version](./MATRIX_PROTOCOL.md)
See [English MEF](./MEF_MATRIX_EMBEDDING_FRAMEWORK.md)
```

### 2. Website Reference Comments

#### Interactive Version Comments
```markdown
<!-- Interactive version: https://matrix-protocol.org/protocol -->
<!-- Interactive tutorial: https://matrix-protocol.org/quickstart -->
<!-- Interactive guide: https://matrix-protocol.org/implementation -->
<!-- Interactive diagram: https://matrix-protocol.org/frameworks/zof#canonical-states -->
```

#### Download Link Comments
```markdown
<!-- Download: https://matrix-protocol.org/downloads/examples/moc-example -->
<!-- Download templates: https://matrix-protocol.org/downloads/templates -->
<!-- Download examples: https://matrix-protocol.org/downloads/examples -->
```

#### Multi-Purpose Comments
```markdown
<!-- For interactive diagrams and visualizations, see https://matrix-protocol.org/integration -->
<!-- Implementation tips: https://matrix-protocol.org/implementation#common-pitfalls -->
```

### 3. Cross-Reference Section Structure

#### Standard Pattern for Framework Files
```markdown
## 8. Cross-References

### Framework Dependencies
- [Matrix Protocol — Main Specification](MATRIX_PROTOCOL.md) <!-- Interactive version: https://matrix-protocol.org/protocol -->
- [MOC — Matrix Ontology Catalog](MOC_MATRIX_ONTOLOGY_CATALOG.md) <!-- Interactive version: https://matrix-protocol.org/frameworks/moc -->
- [MEP — Matrix Epistemic Principle](MEP_MATRIX_EPISTEMIC_PRINCIPLE.md) <!-- Interactive version: https://matrix-protocol.org/mep -->

### Supporting Documents
- [Matrix Protocol Integration Diagram](MATRIX_PROTOCOL_INTEGRATION_DIAGRAM.md) <!-- Interactive version: https://matrix-protocol.org/integration -->
- [Matrix Protocol Glossary](MATRIX_PROTOCOL_GLOSSARY.md) <!-- Interactive version: https://matrix-protocol.org/glossary -->

### Examples and Templates
- [MOC Examples](./examples/knowledge-comparison/) <!-- Download: https://matrix-protocol.org/downloads/examples -->
- [UKI Templates](./templates/uki/) <!-- Download: https://matrix-protocol.org/downloads/templates -->
```

#### Extended Pattern for Main Protocol File
```markdown
## 8. Cross-References

### Core Specifications
- [Framework files with comments...]

### Framework Specifications
- [Framework files with comments...]

### Practical Resources
- [Guides with comments...]

### Examples and Templates
- [Examples and templates with comments...]

### Visualizations
- [Visualization files with comments...]
```

## Website Link Patterns

### 1. Internal Website Navigation

#### Framework Cross-References
```markdown
# Framework to framework links
See [MEF Framework](/frameworks/mef)
See [ZOF Framework](/frameworks/zof)
See [MOC Catalog](/frameworks/moc)

# Section-specific links
See [UKI Lifecycle](/frameworks/mef#uki-lifecycle)
See [Canonical States](/frameworks/zof#canonical-states)
```

#### Language Navigation
```markdown
# Language switching
[Portuguese Version](/pt/frameworks/mef)
[English Version](/frameworks/mef)
[Ver versão em Português](/pt/protocol)
```

#### Download and Resource Links
```markdown
# Download links
[Download Implementation Guide](/downloads/implementation-guide)
[Download MOC Template](/downloads/templates/moc-startup)
[Download Examples](/downloads/examples)

# Resource page links
See [Quick Start Tutorial](/quickstart)
See [Implementation Guide](/implementation)
See [Integration Diagrams](/integration)
```

### 2. Repository Source References

#### Specification Source Links
```markdown
# Link to complete source specification
View complete specification on [GitHub](https://github.com/user/matrix-protocol/blob/main/MEF_MATRIX_EMBEDDING_FRAMEWORK.md)

# Link to specific section in repository
See [UKI Lifecycle section](https://github.com/user/matrix-protocol/blob/main/MEF_MATRIX_EMBEDDING_FRAMEWORK.md#5-uki-lifecycle)

# Link to examples directory
Explore [examples directory](https://github.com/user/matrix-protocol/tree/main/examples/knowledge-comparison)
```

#### Template and Example References
```markdown
# Direct file links
Download [MOC startup template](https://github.com/user/matrix-protocol/blob/main/templates/moc/startup.yaml)
View [UKI example](https://github.com/user/matrix-protocol/blob/main/examples/knowledge-comparison/structured/business-rules/uki-pay-discount-logic-001.yaml)
```

## Link Validation Requirements

### 1. Repository Links Must:
- Use relative paths for internal repository references
- Point to existing files and sections
- Use consistent anchor formats (#section-name)
- Include proper file extensions (.md, .yaml)
- Work from any directory depth

### 2. Website Comments Must:
- Use HTTPS protocol
- Point to live website URLs
- Include proper URL fragments for sections
- Be consistent with website navigation structure
- Provide value-added context (interactive, download, etc.)

### 3. Cross-Reference Accuracy Must:
- Maintain semantic consistency between repository and website
- Reference correct sections and subsections
- Keep version numbers synchronized
- Ensure bilingual consistency

## Forbidden Patterns

### ❌ Absolute Repository Paths
```markdown
# WRONG - Don't use absolute paths
[MEF Framework](/home/user/projects/matrix-protocol/MEF_MATRIX_EMBEDDING_FRAMEWORK.md)

# CORRECT - Use relative paths
[MEF Framework](./MEF_MATRIX_EMBEDDING_FRAMEWORK.md)
```

### ❌ Broken Internal Links
```markdown
# WRONG - Non-existent files
[Non-existent Guide](./guides/NON_EXISTENT.md)

# WRONG - Incorrect section anchors
[Wrong Section](./MEF_MATRIX_EMBEDDING_FRAMEWORK.md#non-existent-section)
```

### ❌ Inconsistent Website URLs
```markdown
# WRONG - Inconsistent with website structure
<!-- Website: https://matrix-protocol.org/framework/mef -->

# CORRECT - Matches actual website structure
<!-- Interactive version: https://matrix-protocol.org/frameworks/mef -->
```

### ❌ Redundant Comments
```markdown
# WRONG - Unnecessary comments for external links
[Matrix Protocol Website](https://matrix-protocol.org) <!-- Website link -->

# CORRECT - Comments only for cross-reference value
[MEF Framework](./MEF_MATRIX_EMBEDDING_FRAMEWORK.md) <!-- Interactive version: https://matrix-protocol.org/frameworks/mef -->
```

## Validation Checklist

### Pre-Commit Checks
- [ ] All internal links resolve to existing files
- [ ] All section anchors exist in target documents
- [ ] Website comments match actual website URLs
- [ ] Relative paths work from file location
- [ ] Cross-references are semantically accurate

### Synchronization Checks
- [ ] Website content matches referenced repository sections
- [ ] Download links point to correct template files
- [ ] Example references match actual example files
- [ ] Version numbers are consistent across references
- [ ] Bilingual references are properly paired

### Maintenance Checks
- [ ] New files added to appropriate cross-reference sections
- [ ] Removed files cleaned from all references
- [ ] Restructured content updates all affected links
- [ ] Website changes reflected in repository comments
- [ ] Navigation map updated for structural changes

## Implementation Guidelines

### For New Documents
1. Create cross-reference section using standard patterns
2. Add appropriate website comments for each link
3. Group references by logical categories
4. Include examples and templates when relevant
5. Maintain bilingual consistency

### For Document Updates
1. Check all affected cross-references
2. Update website comments if URLs change
3. Verify section anchors still exist
4. Test all internal links
5. Update navigation map if structure changes

### For Website Synchronization
1. Ensure website structure matches reference patterns
2. Implement proper URL routing for all referenced pages
3. Create download endpoints for all template references
4. Maintain section anchor consistency
5. Provide interactive equivalents where referenced

---

**Related Documents:**
- [NAVIGATION_MAP.md](./NAVIGATION_MAP.md) - Complete file-to-URL mapping
- [SYNC_GUIDE.md](./SYNC_GUIDE.md) - Synchronization process documentation
- [CONSOLIDATION_PLAN.md](./CONSOLIDATION_PLAN.md) - Overall consolidation strategy