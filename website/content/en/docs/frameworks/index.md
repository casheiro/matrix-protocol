---
title: Matrix Protocol Frameworks
description: Complete overview of the 5 frameworks that compose the Matrix Protocol
icon: i-heroicons-cube
layout: docs
sidebar: true
toc: true
---

# Matrix Protocol Frameworks

The Matrix Protocol consists of **5 interdependent frameworks** that work together to create a robust human-AI collaboration system. Each framework has its specialization and integrates with the others.

## 🏛️ Framework Architecture

### Oracle Layer (Strategic)
- **[MEF - Matrix Embedding Framework](./mef)** - Versioned knowledge structuring
- **[MEF Ontology](./mef-ontology)** - MEF-specific ontology

### Zion Layer (Orchestration)  
- **[ZOF - Zion Orchestration Framework](./zof)** - AI-oriented workflows

### Operator Layer (Execution)
- **[OIF - Operator Intelligence Framework](./oif)** - AI agent archetypes

### Transversal Layers
- **[MOC - Matrix Ontology Catalog](./moc)** - Organizational ontological catalog
- **[MAL - Matrix Arbiter Layer](./mal)** - Arbitration and conflict resolution

## 📊 Comparative Overview

| Framework | Main Focus | Typical Users | Complexity |
|-----------|------------|---------------|------------|
| **MEF** | Knowledge structuring | Domain experts | ⭐⭐⭐ |
| **ZOF** | Workflow orchestration | Technical leaders | ⭐⭐⭐⭐ |
| **OIF** | AI archetypes | Developers | ⭐⭐⭐⭐⭐ |
| **MOC** | Organizational governance | Architects | ⭐⭐ |
| **MAL** | Conflict resolution | Administrators | ⭐⭐⭐⭐ |

## 🎯 Where to Start?

### For Beginners
1. **[MOC](./moc)** - Start by defining your organizational ontology
2. **[MEF](./mef)** - Learn to structure knowledge
3. **[ZOF](./zof)** - Implement basic workflows

### For Advanced Implementation
1. **[OIF](./oif)** - Configure AI archetypes
2. **[MAL](./mal)** - Set up arbitration and governance

### For Theoretical Understanding
1. **[MEF Ontology](./mef-ontology)** - MEF ontological foundations

## 🔗 Interdependencies

```mermaid
graph TB
    MOC[MOC - Base Ontology] --> MEF[MEF - Knowledge]
    MOC --> ZOF[ZOF - Workflows]
    MOC --> OIF[OIF - Archetypes]
    MOC --> MAL[MAL - Arbitration]
    
    MEF --> ZOF
    ZOF --> OIF
    ZOF --> MAL
    
    style MOC fill:#9B59B6,stroke:#8E44AD,color:#fff
    style MEF fill:#2ECC71,stroke:#27AE60,color:#fff
    style ZOF fill:#E67E22,stroke:#D35400,color:#fff
    style OIF fill:#2980B9,stroke:#2471A3,color:#fff
    style MAL fill:#C0392B,stroke:#A93226,color:#fff
```

## 📖 Detailed Documentation

### MEF - Matrix Embedding Framework
- **[Complete Specification](./mef)** - UKI structuring
- **[MEF Ontology](./mef-ontology)** - Theoretical foundations

### ZOF - Zion Orchestration Framework  
- **[Complete Specification](./zof)** - Canonical states and workflows

### OIF - Operator Intelligence Framework
- **[Complete Specification](./oif)** - Archetypes and AI agents

### MOC - Matrix Ontology Catalog
- **[Complete Specification](./moc)** - Ontological catalog

### MAL - Matrix Arbiter Layer
- **[Complete Specification](./mal)** - Deterministic arbitration

## 🚀 Practical Resources

- **[Implementation Guide](/docs/implementation)** - How to implement all frameworks
- **[Templates](/docs/manual/templates)** - Ready-to-use templates for each framework
- **[Examples](/docs/manual/examples)** - Real use cases
- **[Tools](/docs/manual/tools)** - Validation checklists

---

> **💡 Tip**: The frameworks are designed to be implemented gradually. Start with MOC and MEF, then expand to the others as your organization matures.