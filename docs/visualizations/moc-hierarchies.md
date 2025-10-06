# MOC - Matrix Ontology Catalog - Hierarchical Structure
**Organizational Taxonomy Visualization**

## Structure of the Four MOC Hierarchies

```mermaid
graph TB
    subgraph "MOC - Matrix Ontology Catalog"
        subgraph "1️⃣ SCOPE Hierarchy"
            subgraph "🏢 Reach and Visibility"
                S0[Level 0: Organization<br/>📋 Entire organization]
                S1[Level 1: Business Unit<br/>🏛️ Business units]
                S2[Level 2: Department<br/>🏢 Departments]
                S3[Level 3: Team<br/>👥 Teams]
                S4[Level 4: Personal<br/>👤 Individual]
                
                S0 --> S1
                S1 --> S2
                S2 --> S3
                S3 --> S4
            end
        end
        
        subgraph "2️⃣ DOMAIN Hierarchy"
            subgraph "🎯 Knowledge Areas"
                D1[Technical<br/>💻 Technical knowledge]
                D2[Business<br/>📈 Business knowledge]
                D3[Operations<br/>⚙️ Operations and processes]
                D4[Legal<br/>⚖️ Legal and compliance]
                D5[HR<br/>👥 Human resources]
            end
        end
        
        subgraph "3️⃣ MATURITY Hierarchy"
            subgraph "📊 Validation Levels"
                M0[Level 0: Draft<br/>📝 Draft, not validated]
                M1[Level 1: Reviewed<br/>👁️ Team reviewed]
                M2[Level 2: Validated<br/>✅ Leader validated]
                M3[Level 3: Standard<br/>⭐ Organizational standard]
                M4[Level 4: Policy<br/>📜 Mandatory policy]
                
                M0 --> M1
                M1 --> M2
                M2 --> M3
                M3 --> M4
            end
        end
        
        subgraph "4️⃣ EVALUATION_CRITERIA Hierarchy"
            subgraph "🔍 EvaluateForEnrich Criteria"
                E1[Relevance<br/>🎯 Relevance to others]
                E2[Reusability<br/>🔄 Reuse potential]
                E3[Authority<br/>🔐 Authority level]
                E4[Quality<br/>⭐ Content quality]
                E5[Impact<br/>📊 Organizational impact]
            end
        end
    end
    
    %% Relationships between hierarchies
    subgraph "🔗 MOC Integration"
        UKI[📚 UKI Example<br/>scope_ref: team<br/>domain_ref: technical<br/>maturity_ref: validated<br/>criteria: relevance]
        
        UKI -.->|references| S3
        UKI -.->|references| D1
        UKI -.->|references| M2
        UKI -.->|evaluated by| E1
    end
    
    %% Governance
    subgraph "⚖️ Governance Rules"
        G1[Visibility Rules<br/>👁️ Who can see]
        G2[Authority Rules<br/>🔐 Who can modify]
        G3[Propagation Rules<br/>📤 How it propagates]
        G4[Evaluation Policies<br/>🔍 Specific criteria]
    end
    
    %% Styles
    classDef scope fill:#3498db,stroke:#2980b9,stroke-width:3px,color:#fff
    classDef domain fill:#e67e22,stroke:#d35400,stroke-width:3px,color:#fff
    classDef maturity fill:#2ecc71,stroke:#27ae60,stroke-width:3px,color:#fff
    classDef criteria fill:#f39c12,stroke:#e67e22,stroke-width:3px,color:#fff
    classDef governance fill:#9b59b6,stroke:#8e44ad,stroke-width:3px,color:#fff
    classDef integration fill:#1abc9c,stroke:#16a085,stroke-width:3px,color:#fff
    
    class S0,S1,S2,S3,S4 scope
    class D1,D2,D3,D4,D5 domain
    class M0,M1,M2,M3,M4 maturity
    class E1,E2,E3,E4,E5 criteria
    class G1,G2,G3,G4 governance
    class UKI integration
```

## MOC Authority Validation Service

```mermaid
flowchart TB
    subgraph "🔐 MOC Authority Validation Service"
        Input[["📥 Input Parameters<br/>• user_moc_context<br/>• operation<br/>• scope_ref<br/>• domain_ref<br/>• maturity_ref"]]
        
        Service{{"🔍 Processing<br/>MOC Validation"}}
        
        Output[["📤 Output<br/>• authorized: true/false<br/>• required_authority<br/>• escalation_hint<br/>• moc_nodes_cited"]]
        
        Input --> Service
        Service --> Output
    end
    
    subgraph "🏛️ Source of Truth"
        MOC_Rules[MOC Hierarchies<br/>Governance Rules<br/>Authority Policies]
        Service -.->|consults| MOC_Rules
    end
```

## Description

The MOC (Matrix Ontology Catalog) provides the foundational taxonomy system that enables organizational adaptation while maintaining protocol coherence.

### Four Required Hierarchies:

#### 1. SCOPE Hierarchy 🏢
- **Purpose**: Define knowledge reach and visibility
- **Levels**: Organization → Business Unit → Department → Team → Personal
- **Governance**: Controls who can see and access knowledge

#### 2. DOMAIN Hierarchy 🎯  
- **Purpose**: Define knowledge specialization areas
- **Examples**: Technical, Business, Operations, Legal, HR
- **Flexibility**: Each organization defines their own domains

#### 3. MATURITY Hierarchy 📊
- **Purpose**: Define validation and reliability levels
- **Progression**: Draft → Reviewed → Validated → Standard → Policy
- **Authority**: Higher maturity requires higher authority

#### 4. EVALUATION_CRITERIA Hierarchy 🔍
- **Purpose**: Define criteria for ZOF EvaluateForEnrich checkpoint
- **Examples**: Relevance, Reusability, Authority, Quality, Impact
- **Usage**: Determines if knowledge should enrich the Oracle

### Key Features:

- **Organizational Flexibility**: Each organization defines their own specific taxonomies
- **Universal Structure**: All organizations use the same four hierarchy types
- **Authority Integration**: Controls permissions and access across frameworks
- **Semantic Elasticity**: Local adaptation without losing global coherence

### Integration Points:

- **MEF**: UKIs reference MOC nodes via *_ref fields
- **ZOF**: Uses MOC criteria for EvaluateForEnrich decisions
- **MAL**: Consults MOC policies for arbitration precedence
- **OIF**: Filters responses based on user's MOC context

## Warning

⚠️ **IMPORTANT**: The examples shown (technical, business, draft, etc.) are **illustrative only**. Each organization must define their own hierarchies based on their specific needs and structure. The MOC specification provides the framework, not the content.