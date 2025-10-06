# Navigation Map: Repository ↔ Website

**Version:** 0.0.1  
**Status:** Beta  
**Last Updated:** 2025-10-05  
**Purpose:** Map correspondences between repository files and website URLs for cross-reference strategy

## Core Specifications Mapping

| Repository File | Website URL | Content Type | Sync Status |
|----------------|-------------|--------------|-------------|
| `/docs/specifications/en/MATRIX_PROTOCOL.md` | `/protocol` | Main Specification | ✅ Must Sync |
| `/docs/specifications/pt/MATRIX_PROTOCOL.md` | `/pt/protocol` | Main Specification (PT) | ✅ Must Sync |
| `/docs/specifications/en/MEP_MATRIX_EPISTEMIC_PRINCIPLE.md` | `/mep` | Epistemological Manifesto | ✅ Must Sync |
| `/docs/specifications/pt/MEP_MATRIX_EPISTEMIC_PRINCIPLE.md` | `/pt/mep` | Epistemological Manifesto (PT) | ✅ Must Sync |
| `/docs/specifications/en/MEF_MATRIX_EMBEDDING_FRAMEWORK.md` | `/frameworks/mef` | Framework Specification | ✅ Must Sync |
| `/docs/specifications/pt/MEF_MATRIX_EMBEDDING_FRAMEWORK.md` | `/pt/frameworks/mef` | Framework Specification (PT) | ✅ Must Sync |
| `/docs/specifications/en/ZOF_ZION_ORCHESTRATION_FRAMEWORK.md` | `/frameworks/zof` | Framework Specification | ✅ Must Sync |
| `/docs/specifications/pt/ZOF_ZION_ORCHESTRATION_FRAMEWORK.md` | `/pt/frameworks/zof` | Framework Specification (PT) | ✅ Must Sync |
| `/docs/specifications/en/OIF_OPERATOR_INTELLIGENCE_FRAMEWORK.md` | `/frameworks/oif` | Framework Specification | ✅ Must Sync |
| `/docs/specifications/pt/OIF_OPERATOR_INTELLIGENCE_FRAMEWORK.md` | `/pt/frameworks/oif` | Framework Specification (PT) | ✅ Must Sync |
| `/docs/specifications/en/MOC_MATRIX_ONTOLOGY_CATALOG.md` | `/frameworks/moc` | Framework Specification | ✅ Must Sync |
| `/docs/specifications/pt/MOC_MATRIX_ONTOLOGY_CATALOG.md` | `/pt/frameworks/moc` | Framework Specification (PT) | ✅ Must Sync |
| `/docs/specifications/en/MAL_MATRIX_ARBITER_LAYER.md` | `/frameworks/mal` | Framework Specification | ✅ Must Sync |
| `/docs/specifications/pt/MAL_MATRIX_ARBITER_LAYER.md` | `/pt/frameworks/mal` | Framework Specification (PT) | ✅ Must Sync |
| `/docs/specifications/en/MATRIX_PROTOCOL_GLOSSARY.md` | `/glossary` | Glossary | ✅ Must Sync |
| `/docs/specifications/pt/MATRIX_PROTOCOL_GLOSSARY.md` | `/pt/glossary` | Glossary (PT) | ✅ Must Sync |
| `/docs/specifications/en/MATRIX_PROTOCOL_INTEGRATION_DIAGRAM.md` | `/integration` | Integration Diagrams | ✅ Must Sync |
| `/docs/specifications/pt/MATRIX_PROTOCOL_INTEGRATION_DIAGRAM.md` | `/pt/integration` | Integration Diagrams (PT) | ✅ Must Sync |
| `/docs/specifications/en/Ontology_MEF_Support.md` | `/frameworks/mef-ontology` | Support Ontology | ✅ Must Sync |
| `/docs/specifications/pt/Ontology_MEF_Support.md` | `/pt/frameworks/mef-ontology` | Support Ontology (PT) | ✅ Must Sync |

## Guides and Documentation Mapping

| Repository File | Website URL | Content Type | Sync Status |
|----------------|-------------|--------------|-------------|
| `/docs/guides/QUICK_START.md` | `/quickstart` | Getting Started Guide | 🔄 Can Diverge |
| `/docs/guides/IMPLEMENTATION_ROADMAP.md` | `/implementation` | Implementation Guide | 🔄 Can Diverge |
| `/docs/guides/COMMON_PITFALLS.md` | `/implementation#common-pitfalls` | Implementation Tips | 🔄 Can Diverge |
| `/manual/MATRIX_PROTOCOL_IMPLEMENTATION_GUIDE_EN.md` | `/downloads/implementation-guide` | Complete Manual | ✅ Must Sync |
| `/manual/MATRIX_PROTOCOL_IMPLEMENTATION_GUIDE_PT.md` | `/downloads/implementation-guide-pt` | Complete Manual (PT) | ✅ Must Sync |

## Examples and Templates Mapping

| Repository Path | Website URL | Content Type | Sync Status |
|----------------|-------------|--------------|-------------|
| `/examples/knowledge-comparison/` | `/downloads/examples/` | Knowledge Examples | ✅ Must Sync |
| `/examples/knowledge-comparison/MOC_SQUAD_PAYMENTS.yaml` | `/downloads/examples/moc-example` | MOC Example | ✅ Must Sync |
| `/manual/examples/TECHCORP_ORGANIZATIONAL_EXAMPLE.md` | `/downloads/examples/techcorp-case` | Case Study | ✅ Must Sync |
| `/manual/examples/EXEMPLO_ORGANIZACIONAL_TECHCORP.md` | `/downloads/examples/techcorp-case-pt` | Case Study (PT) | ✅ Must Sync |
| `/templates/moc/startup.yaml` | `/downloads/templates/moc-startup` | MOC Template | ✅ Must Sync |
| `/templates/moc/scaleup.yaml` | `/downloads/templates/moc-scaleup` | MOC Template | ✅ Must Sync |
| `/templates/moc/enterprise.yaml` | `/downloads/templates/moc-enterprise` | MOC Template | ✅ Must Sync |
| `/templates/moc/corporation.yaml` | `/downloads/templates/moc-corporation` | MOC Template | ✅ Must Sync |
| `/templates/uki/basic-template.yaml` | `/downloads/templates/uki-basic` | UKI Template | ✅ Must Sync |
| `/templates/uki/decision-record-template.yaml` | `/downloads/templates/uki-decision` | UKI Template | ✅ Must Sync |
| `/templates/uki/process-template.yaml` | `/downloads/templates/uki-process` | UKI Template | ✅ Must Sync |

## Visualizations Mapping

| Repository File | Website URL | Content Type | Sync Status |
|----------------|-------------|--------------|-------------|
| `/visualizations/mal-arbitration-flow.md` | `/frameworks/mal#arbitration-flow` | Diagram | 🔄 Can Diverge |
| `/visualizations/moc-hierarchies.md` | `/frameworks/moc#hierarchies` | Diagram | 🔄 Can Diverge |
| `/visualizations/oif-access-control.md` | `/frameworks/oif#access-control` | Diagram | 🔄 Can Diverge |
| `/visualizations/zof-canonical-states.md` | `/frameworks/zof#canonical-states` | Diagram | 🔄 Can Diverge |

## Internal Link Patterns

### Repository Internal Links

#### Relative Links (Preferred)
```markdown
# Cross-framework references
See [MEF Specification](./MEF_MATRIX_EMBEDDING_FRAMEWORK.md)
See [ZOF Framework](./ZOF_ZION_ORCHESTRATION_FRAMEWORK.md)

# Section references
See [Section 5: UKI Lifecycle](./MEF_MATRIX_EMBEDDING_FRAMEWORK.md#5-uki-lifecycle)

# Examples references
See [MOC Example](./examples/knowledge-comparison/MOC_SQUAD_PAYMENTS.yaml)

# Guide references
See [Quick Start Guide](./docs/guides/QUICK_START.md)

# Template references
See [MOC Templates](./templates/moc/startup.yaml)

# Visualization references
See [MAL Flow Diagram](./visualizations/mal-arbitration-flow.md)
```

#### Absolute Links (For External References)
```markdown
# Only for external references
See [Matrix Protocol Website](https://matrix-protocol.org)
```

### Website Link Patterns

#### Internal Website Links
```markdown
# Framework cross-references
See [MEF Framework](/frameworks/mef)
See [ZOF Framework](/frameworks/zof)

# Language switching
[Portuguese Version](/pt/frameworks/mef)

# Download links
[Download Implementation Guide](/downloads/implementation-guide)
[Download MOC Template](/downloads/templates/moc-startup)
```

#### Repository References
```markdown
# Link to source specification
View complete specification on [GitHub](https://github.com/user/matrix-protocol/blob/main/MEF_MATRIX_EMBEDDING_FRAMEWORK.md)

# Link to specific section
See [UKI Lifecycle section](https://github.com/user/matrix-protocol/blob/main/MEF_MATRIX_EMBEDDING_FRAMEWORK.md#5-uki-lifecycle)
```

## Website Comment Patterns

When adding website references in repository files:

```markdown
<!-- For interactive version with examples, see https://matrix-protocol.org/frameworks/mef -->

<!-- Download this template at https://matrix-protocol.org/downloads/templates/moc-startup -->

<!-- Visual diagram available at https://matrix-protocol.org/frameworks/mal#arbitration-flow -->
```

## Cross-Reference Integration Points

### Framework Interdependencies

| Source Framework | Target Framework | Link Type | Repository Pattern | Website Pattern |
|-----------------|-----------------|-----------|-------------------|-----------------|
| MEF | ZOF | Knowledge Query | `[ZOF Framework](./ZOF_ZION_ORCHESTRATION_FRAMEWORK.md#oracle-consultation)` | `[ZOF Framework](/frameworks/zof#oracle-consultation)` |
| ZOF | MAL | Conflict Resolution | `[MAL Arbitration](./MAL_MATRIX_ARBITER_LAYER.md#arbitration-events)` | `[MAL Arbitration](/frameworks/mal#arbitration-events)` |
| MAL | MEF | Decision Records | `[MEF Persistence](./MEF_MATRIX_EMBEDDING_FRAMEWORK.md#decision-records)` | `[MEF Persistence](/frameworks/mef#decision-records)` |
| OIF | MOC | Authority Validation | `[MOC Authority](./MOC_MATRIX_ONTOLOGY_CATALOG.md#authority-validation)` | `[MOC Authority](/frameworks/moc#authority-validation)` |
| ALL | MEP | Philosophical Foundation | `[MEP Principles](./MEP_MATRIX_EPISTEMIC_PRINCIPLE.md)` | `[MEP Principles](/mep)` |

### Example Cross-References

| Source Document | Target Document | Link Purpose | Repository Link | Website Link |
|----------------|----------------|-------------|----------------|-------------|
| MATRIX_PROTOCOL.md | MEF_MATRIX_EMBEDDING_FRAMEWORK.md | Framework Details | `[MEF Specification](./MEF_MATRIX_EMBEDDING_FRAMEWORK.md)` | `[MEF Framework](/frameworks/mef)` |
| MEF_MATRIX_EMBEDDING_FRAMEWORK.md | examples/MOC_SQUAD_PAYMENTS.yaml | MOC Example | `[MOC Example](./examples/knowledge-comparison/MOC_SQUAD_PAYMENTS.yaml)` | `[MOC Example](/downloads/examples/moc-example)` |
| ZOF_ZION_ORCHESTRATION_FRAMEWORK.md | visualizations/zof-canonical-states.md | Flow Diagram | `[ZOF States Diagram](./visualizations/zof-canonical-states.md)` | `[ZOF States Diagram](/frameworks/zof#canonical-states)` |

## Synchronization Rules

### Files That MUST Stay Synchronized
- All framework specifications (MEF, ZOF, OIF, MOC, MAL)
- MEP epistemological manifesto
- Core protocol specification
- Glossary definitions
- Integration diagrams
- MOC and UKI examples

### Content That CAN Diverge
- Website-specific frontmatter and metadata
- Interactive examples and expanded tutorials
- Pedagogical content and step-by-step guides
- Visual enhancements and UI-specific elements
- Marketing and presentation content

### Link Validation Requirements
- All internal repository links must resolve
- All website internal links must resolve
- Cross-references must maintain semantic accuracy
- Version numbers must be consistent
- Section anchors must exist in target documents

## Maintenance Checklist

### Weekly Sync Check
- [ ] Verify all framework versions match
- [ ] Check for broken internal links
- [ ] Validate cross-references accuracy
- [ ] Ensure examples are consistent
- [ ] Test download links functionality

### Monthly Review
- [ ] Update navigation map if structure changes
- [ ] Review and update link patterns
- [ ] Validate all external references
- [ ] Check for new cross-reference opportunities
- [ ] Update synchronization status

## Tools and Scripts

### Link Validation
- `scripts/check-internal-links.sh` - Validates repository internal links
- `scripts/check-cross-references.sh` - Validates cross-framework references
- `scripts/validate-navigation-map.sh` - Ensures navigation map accuracy

### Synchronization
- `scripts/sync-check.sh` - Compares repository and website content
- `scripts/update-cross-references.sh` - Updates internal link patterns
- `scripts/generate-website-links.sh` - Generates website reference comments

---

**Maintained by:** Matrix Protocol Core Team  
**Next Review:** Weekly sync check  
**Related Documents:** [SYNC_GUIDE.md](./SYNC_GUIDE.md), [CONSOLIDATION_PLAN.md](./CONSOLIDATION_PLAN.md)