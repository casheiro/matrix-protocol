# MAL - Matrix Arbiter Layer - Arbitration Flow
**Complete Arbitration Process Diagram**

## MAL Arbitration Flow - Complete Process

```mermaid
flowchart TD
    %% Conflict detection in ZOF
    A[🔍 ZOF EvaluateForEnrich<br/>Detects Conflict] --> B{Conflict<br/>Type?}
    
    B -->|H1| C[📊 Horizontal Conflict<br/>Equivalent UKIs in conflict]
    B -->|H2| D[⚡ Concurrent Enrichment<br/>Simultaneous attempts]
    B -->|H3| E[🔄 Promotion Contention<br/>Competing proposals]
    
    %% Arbitration event preparation
    C --> F[📋 Normalize Arbitration Event]
    D --> F
    E --> F
    
    F --> G["🔑 Prepare MAL Input:<br/>• event_id<br/>• event_type<br/>• candidates array<br/>• user_moc_context<br/>• operation<br/>• policy_ref"]
    
    %% MAL invocation
    G --> H[🎯 Invoke MAL]
    
    %% Arbitration process
    H --> I[⚙️ MAL: Apply MOC Policies<br/>or Default Precedence]
    
    I --> J{Specific MOC<br/>Policy?}
    J -->|Yes| K[📜 Use policy_ref from MOC]
    J -->|No| L[⚖️ Apply Canonical Precedence<br/>P1-P6]
    
    %% Canonical precedence
    K --> M[🧮 Execute Arbitration Logic]
    L --> N[📊 P1: Authority Weight<br/>P2: Scope Specificity<br/>P3: Maturity Level<br/>P4: Temporal Recency<br/>P5: Evidence Density<br/>P6: Deterministic Fallback]
    N --> M
    
    %% Timeout check
    M --> O{Within<br/>arbitration_timeout?}
    O -->|No| P["⏰ Timeout: Apply Safe Default<br/>• outcome = no enrich<br/>• status = pending arbitration"]
    O -->|Yes| Q[✅ MAL Decision Complete]
    
    %% Possible outcomes
    Q --> R{Arbitration<br/>Result?}
    R -->|winner| S[🏆 Single UKI Winner]
    R -->|coexist| T[🤝 Coexistence via<br/>Scope Partitioning]
    R -->|reject_all| U[❌ Reject All<br/>None satisfy policy]
    R -->|defer| V[⏸️ Escalate to<br/>Human Override]
    
    %% Persistence and communication
    S --> W["💾 MEF: Persist Decision Record<br/>• decision_id<br/>• outcome<br/>• winner or losers<br/>• precedence_applied<br/>• epistemic_rationale<br/>• moc_nodes cited"]
    T --> W
    U --> W
    V --> W
    P --> W
    
    W --> X["📢 OIF: Explain Decision<br/>Explanation Template:<br/>• decision_id<br/>• outcome<br/>• precedence_applied<br/>• epistemic_rationale<br/>• moc_nodes"]
    
    X --> Y["🔄 ZOF: Apply Action<br/>• gate_enrich<br/>• deprecate<br/>• partition_scope<br/>• no_enrich"]
    
    Y --> Z[✅ Process End]
    
    %% Styles
    classDef conflict fill:#e74c3c,stroke:#c0392b,stroke-width:2px,color:#fff
    classDef process fill:#3498db,stroke:#2980b9,stroke-width:2px,color:#fff
    classDef decision fill:#f39c12,stroke:#e67e22,stroke-width:2px,color:#fff
    classDef outcome fill:#27ae60,stroke:#229954,stroke-width:2px,color:#fff
    classDef persistence fill:#9b59b6,stroke:#8e44ad,stroke-width:2px,color:#fff
    classDef timeout fill:#e67e22,stroke:#d35400,stroke-width:2px,color:#fff
    
    class A,B,C,D,E conflict
    class F,G,H,I,M process
    class J,O,R decision
    class S,T,U,V,Y,Z outcome
    class W,X persistence
    class P timeout
```

## Description

This diagram shows the complete MAL (Matrix Arbiter Layer) arbitration process from conflict detection to final action application.

### Key Stages:

1. **Conflict Detection**: ZOF EvaluateForEnrich detects H1, H2, or H3 conflicts
2. **Event Normalization**: Standardize conflict data for MAL processing  
3. **Policy Application**: Apply MOC-specific policies or canonical precedence rules
4. **Decision Making**: Determine winner, coexistence, rejection, or deferral
5. **Persistence**: Store immutable Decision Record in MEF
6. **Communication**: OIF explains decision to user with cited MOC nodes
7. **Action Application**: ZOF applies the arbitration decision

### Conflict Types:
- **H1 (Horizontal)**: Equivalent UKIs that conflict semantically
- **H2 (Concurrent)**: Simultaneous enrichment attempts  
- **H3 (Promotion)**: Competing promotion proposals

### Precedence Rules (P1-P6):
- **P1**: Authority Weight (higher MOC authority wins)
- **P2**: Scope Specificity (context-dependent precedence)
- **P3**: Maturity Level (validated > endorsed > draft)
- **P4**: Temporal Recency (more recent wins, respecting lifecycle)
- **P5**: Evidence Density (more MEF references wins)
- **P6**: Deterministic Fallback (lexicographic UKI identifier)

## Integration Points

- **ZOF**: Detects conflicts and applies MAL decisions
- **MOC**: Provides arbitration policies and precedence rules
- **MEF**: Persists Decision Records as immutable audit trail
- **OIF**: Explains arbitration outcomes to users
- **MEP**: Guides epistemic rationale generation