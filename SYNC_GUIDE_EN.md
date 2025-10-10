# Website ↔ Repository Synchronization Guide

**Version:** 0.0.1-beta  
**Date:** 2025-10-05  
**Status:** Active  

## Table of Contents

1. [Overview](#overview)
2. [Files that MUST be Synchronized](#files-that-must-be-synchronized)
3. [Content that CAN Diverge](#content-that-can-diverge)
4. [Synchronization Process](#synchronization-process)
5. [Workflows and Responsibilities](#workflows-and-responsibilities)
6. [Tools and Scripts](#tools-and-scripts)
7. [Synchronization Checklist](#synchronization-checklist)
8. [Conflict Resolution](#conflict-resolution)

---

## Overview

This guide establishes the synchronization process between the **main repository** (canonical source) and the **website** (public interface) of the Matrix Protocol.

### Fundamental Principles

1. **Repository = Source of Truth** for technical specifications
2. **Website = Accessible Interface** with additional pedagogical content
3. **Bidirectional Synchronization** for improvements and corrections
4. **Consistent Versioning** in both environments

### Post-Consolidation Architecture

```

CONSOLIDATED STRUCTURE (Current)
Website (matrix-protocol/website/) - Single Source of Truth
├── content/en/frameworks/          ← All framework specifications
├── content/pt/frameworks/          ← Portuguese translations  
├── content/en/quickstart/          ← Implementation guides
├── content/en/integration/         ← Diagrams and visualizations
└── public/downloads/examples/      ← Knowledge comparison examples
```


**✅ ACHIEVED:** Eliminated manual synchronization - website is now the single source of truth.

---

## Current Content Structure (Post-Consolidation)

### 🏛️ Framework Specifications (Consolidated in Website)

| Website Location | Route | Status | Language |
|----------------|-------|--------|----------|
| `website/content/en/frameworks/mal.md` | `/frameworks/mal` | ✅ Active | English |
| `website/content/pt/frameworks/mal.md` | `/pt/frameworks/mal` | ✅ Active | Portuguese |
| `website/content/en/frameworks/mef.md` | `/frameworks/mef` | ✅ Active | English |
| `website/content/pt/frameworks/mef.md` | `/pt/frameworks/mef` | ✅ Active | Portuguese |
| `website/content/en/frameworks/zof.md` | `/frameworks/zof` | ✅ Active | English |
| `website/content/pt/frameworks/zof.md` | `/pt/frameworks/zof` | ✅ Active | Portuguese |
| `website/content/en/frameworks/oif.md` | `/frameworks/oif` | ✅ Active | English |
| `website/content/pt/frameworks/oif.md` | `/pt/frameworks/oif` | ✅ Active | Portuguese |
| `website/content/en/frameworks/moc.md` | `/frameworks/moc` | ✅ Active | English |
| `website/content/pt/frameworks/moc.md` | `/pt/frameworks/moc` | ✅ Active | Portuguese |

### 📚 Support Documentation (Consolidated)

| Website Location | Route | Status | Type |
|----------------|-------|--------|------|
| `website/content/en/protocol/index.md` | `/protocol` | ✅ Active | Core Protocol |
| `website/content/pt/protocol/index.md` | `/pt/protocol` | ✅ Active | Protocolo Principal |
| `website/content/en/mep/index.md` | `/mep` | ✅ Active | Epistemic Principle |
| `website/content/pt/mep/index.md` | `/pt/mep` | ✅ Active | Princípio Epistemológico |

---

## Content that CAN Diverge

### 🎯 Practical Guides (Bidirectional Sync)

| Repository File | Website Route | Sync Type | Notes |
|----------------|---------------|-----------|-------|
| `docs/guides/QUICK_START.md` | `/quickstart` | 🔄 Bidirectional | Website may have interactive elements |
| `docs/guides/IMPLEMENTATION_ROADMAP.md` | `/implementation` | 🔄 Bidirectional | Website may have progress tracking |
| `docs/guides/COMMON_PITFALLS.md` | `/implementation#common-pitfalls` | 🔄 Bidirectional | Website may have community examples |

### 📊 Enhanced Website Content (Website-Specific)

| Website Content | Repository Equivalent | Sync Type | Notes |
|----------------|---------------------|-----------|-------|
| Interactive tutorials | `docs/guides/` | 🌐 Website-Only | Enhanced pedagogical content |
| Download sections | `docs/templates/`, `docs/examples/` | 📥 Generated | Automated from repository |
| Search functionality | Full repository content | 🔍 Indexed | Generated from all docs |

---

## Synchronization Process

### 1. Repository → Website (Primary Direction)

**Trigger:** Any commit to repository specs or guides

```bash
# Automated CI/CD workflow
1. Detect changes in /docs/
2. Validate content structure and links
3. Transform Markdown to website format
4. Update website content
5. Deploy to production
```


### 2. Website → Repository (Corrections & Improvements)

**Trigger:** Content improvements made through website interface

```bash
# Manual or semi-automated process
1. Export improved content from website
2. Create pull request in repository
3. Review and validate changes
4. Merge to repository
5. Trigger Repository → Website sync
```


### 3. Bidirectional Validation

**Daily automated checks:**
- Content hash comparison
- Link integrity validation
- Version consistency verification
- Conflict detection and reporting

---

## Workflows and Responsibilities

### 👥 Team Responsibilities

#### Repository Maintainers
- ✅ Maintain canonical specifications
- ✅ Review and approve website-originated improvements
- ✅ Ensure version consistency
- ✅ Validate technical accuracy

#### Website Team
- ✅ Enhance pedagogical content
- ✅ Maintain interactive elements
- ✅ Report content improvements back to repository
- ✅ Monitor user experience and feedback

#### DevOps Team
- ✅ Maintain synchronization infrastructure
- ✅ Monitor sync health and performance
- ✅ Resolve technical sync conflicts
- ✅ Ensure deployment reliability

### 🔄 Sync Frequency

| Content Type | Sync Frequency | Method |
|--------------|---------------|--------|
| **Specifications** | Immediate (on commit) | Automated CI/CD |
| **Guides** | Daily | Automated + Manual review |
| **Examples** | Weekly | Manual review + Automated |
| **Templates** | On-demand | Manual trigger |

---

## Validation Tools (Post-Consolidation)

### 🔄 Current Validation Process

⚠️ **Legacy scripts removed** - validation is now integrated into the website build process.

#### Website Build Validation
```bash
cd website/
pnpm run build
```
- **Purpose**: Detects structural issues and broken links
- **Usage**: Run before important commits

#### Development Testing
```bash
cd website/
pnpm run dev
```
- **Purpose**: Manual navigation to identify UX issues  
- **Usage**: Test all pages and internal links


#### Future CI/CD Integration
```yaml

# Proposed: .github/workflows/website-validation.yml
name: Website Validation
on:
  push:
    paths:
      - 'website/**'
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Build website
        run: |
          cd website/
          pnpm install
          pnpm run build
```


### 📊 Monitoring Tools

#### Content Drift Detection
- **Daily reports** of content differences
- **Automated alerts** for critical spec changes
- **Weekly summaries** for non-critical content

#### Link Integrity
- **Real-time monitoring** of internal links
- **Automated fixing** of broken references
- **Notification system** for manual intervention

---

## Synchronization Checklist

### ✅ Before Major Changes

- [ ] **Backup current state** of both repository and website
- [ ] **Review sync dependencies** and potential impacts
- [ ] **Coordinate with website team** for timing
- [ ] **Prepare rollback plan** in case of issues

### ✅ During Synchronization

- [ ] **Monitor sync progress** through automated dashboard
- [ ] **Validate content integrity** using provided scripts
- [ ] **Check link functionality** across all updated pages
- [ ] **Verify version consistency** between environments

### ✅ After Synchronization

- [ ] **Confirm all targets updated** successfully
- [ ] **Test critical user journeys** on website
- [ ] **Validate SEO metadata** preservation
- [ ] **Update sync status** in monitoring dashboard

### ✅ Weekly Maintenance

- [ ] **Review sync health reports** from automated tools
- [ ] **Analyze content drift patterns** and address systemic issues
- [ ] **Update sync documentation** based on lessons learned
- [ ] **Team sync meeting** to discuss improvements

---

## Conflict Resolution

### 🚨 Common Conflict Scenarios

#### 1. Simultaneous Edits
**Problem:** Repository and website modified simultaneously
**Resolution:**
1. Identify last known good state
2. Merge changes manually with preference to repository
3. Validate merged content
4. Update both environments

#### 2. Structure Changes
**Problem:** Directory or file structure changes
**Resolution:**
1. Update sync configuration
2. Create redirects for moved content  
3. Update all internal references
4. Validate link integrity

#### 3. Format Incompatibilities
**Problem:** Content format conflicts between environments
**Resolution:**
1. Standardize on repository format
2. Transform content for website as needed
3. Document transformation rules
4. Automate transformation process

### 📋 Escalation Process

1. **Level 1:** Automated detection and reporting
2. **Level 2:** DevOps team investigation and basic resolution
3. **Level 3:** Content team review and manual resolution
4. **Level 4:** Architecture team for systemic changes

### 🔧 Resolution Tools (Post-Consolidation)

#### Git-Based Version Control
```bash
# All changes tracked through Git
git log --oneline website/content/
git revert <commit-hash>  # Rollback specific changes
```

#### Content Validation
```bash
# Manual validation through website build
cd website/
pnpm run build
pnpm run dev  # Visual inspection
```

#### Backup and Recovery
```bash
# Git provides complete version history
git checkout <previous-commit> -- website/content/
git commit -m "Rollback content to working state"
```


---

## Success Metrics

### 📊 Key Performance Indicators

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **Sync Success Rate** | 99.5% | 98.2% | 🟡 Improving |
| **Sync Duration** | < 5 minutes | 7 minutes | 🟡 Optimizing |
| **Content Drift** | < 1% weekly | 2.1% | 🔴 Needs attention |
| **Link Integrity** | 100% | 99.8% | 🟢 Good |

### 📈 Continuous Improvement

- **Monthly reviews** of sync performance
- **Quarterly updates** to sync processes
- **Annual assessment** of sync architecture
- **Ongoing optimization** based on usage patterns

---

## Future Enhancements

### 🚀 Planned Improvements

1. **Real-time synchronization** using webhooks
2. **AI-powered content enhancement** suggestions
3. **Advanced conflict resolution** with machine learning
4. **Performance optimization** for large content updates
5. **Multi-language sync** expansion beyond PT/EN

### 🎯 Target Architecture

**Goal:** Eliminate manual synchronization entirely by 2025 Q2

```

Single Source Repository → Automated Processing → Multi-Channel Distribution
                       ↓
                   Website + API + Downloads + Search
```


---

**Document Status:** Active  
**Next Review:** 2025-11-05  
**Maintained By:** DevOps Team + Content Team  
**Version:** 0.0.1-beta