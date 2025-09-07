# Matrix Protocol Website - Arquitetura e Estrutura

## 🎯 **Objetivo do Site**

Criar uma presença web oficial para o Matrix Protocol que sirva como:
- **Portal de entrada** para desenvolvedores e organizações
- **Documentação centralizada** com navegabilidade intuitiva
- **Hub de recursos** com downloads, exemplos e ferramentas
- **Showcase** das capacidades e benefícios do protocolo
- **Comunidade** para adoção e contribuições

---

## 🏗️ **Arquitetura do Site**

### **Tecnologia Recomendada**
- **Framework**: Next.js 14+ (React + SSG/SSR)
- **Styling**: Tailwind CSS + Shadcn/ui (com paleta de cores oficiais)
- **Markdown**: MDX para documentação dinâmica
- **Internacionalização**: next-i18next
- **Hospedagem**: Vercel/Netlify (deploy automático)
- **Analytics**: Plausible/Google Analytics
- **Fonts**: Rajdhani (Google Fonts) + Source Code Pro para código
- **Ícones**: Custom Matrix cubes + Lucide React para UI

### **Estrutura de Pastas**
```
website/
├── public/
│   ├── docs/                    # PDFs e arquivos para download
│   ├── examples/                # Exemplos práticos
│   └── assets/                  # Imagens, ícones, logos
│       ├── logos/               # Logos oficiais do repositório /design
│       │   ├── matrix/          # Matrix Protocol logos
│       │   │   ├── matrix-protocol-logo-gray.svg
│       │   │   ├── matrix-protocol-logo-white.svg
│       │   │   ├── matrix-protocol-icon-gray.svg
│       │   │   └── matrix-protocol-icon-white.svg
│       │   ├── mef/             # MEF logos
│       │   │   ├── mef-logo-text-color-full.svg
│       │   │   ├── mef-logo-color-text-white.svg
│       │   │   └── mef-logo-icon.svg
│       │   ├── zof/             # ZOF logos
│       │   │   ├── zof-logo-text-color-full.svg
│       │   │   ├── zof-logo-color-text-white.svg
│       │   │   └── zof-logo-icon.svg
│       │   ├── oif/             # OIF logos
│       │   │   ├── oif-logo-text-color-full.svg
│       │   │   ├── oif-logo-color-text-white.svg
│       │   │   └── oif-logo-icon.svg
│       │   ├── moc/             # MOC logos
│       │   │   ├── moc-logo-text-color-full.svg
│       │   │   ├── moc-logo-color-text-white.svg
│       │   │   └── moc-logo-icon.svg
│       │   └── mal/             # MAL logos
│       │       ├── mal-logo-text-color-full.svg
│       │       ├── mal-logo-color-text-white.svg
│       │       └── mal-logo-icon.svg
│       ├── icons/               # Ícones de interface
│       └── images/              # Imagens gerais
├── src/
│   ├── components/
│   │   ├── layout/              # Header, Footer, Navigation
│   │   ├── ui/                  # Componentes reutilizáveis
│   │   └── sections/            # Seções específicas das páginas
│   ├── pages/
│   │   ├── [locale]/            # Páginas por idioma
│   │   └── resources/           # Recursos e downloads estáticos
│   ├── content/
│   │   ├── pt-br/               # Conteúdo em português
│   │   └── en-us/               # Conteúdo em inglês
│   ├── lib/
│   │   ├── markdown.js          # Parser MDX
│   │   └── utils.js             # Utilitários
│   └── styles/
├── docs/                        # Documentação markdown
│   ├── pt-br/
│   └── en-us/
└── examples/                    # Exemplos de implementação
```

---

## 🌐 **Estrutura de Navegação**

### **Menu Principal**

#### **1. Home** (`/`)
- Hero section com value proposition
- Overview dos 4 frameworks principais
- Call-to-action para começar
- Estatísticas e benefícios

#### **2. Protocolo** (`/protocol`)
- **Visão Geral** - Introdução ao Matrix Protocol
- **Arquitetura** - Diagrama e componentes
- **Princípios** - MEP (Matrix Epistemic Principle)
- **Glossário** - Terminologia técnica

#### **3. Frameworks** (`/frameworks`)
- **MEF** - Matrix Embedding Framework
- **MOC** - Matrix Ontology Catalog
- **MAL** - Matrix Arbiter Layer
- **ZOF** - Zion Orchestration Framework
- **OIF** - Operator Intelligence Framework

#### **4. Documentação** (`/docs`)
- **Guia de Início** - Quick start
- **Manual de Implementação** - Passo a passo
- **Referência Técnica** - Especificações dos frameworks
- **Melhores Práticas** - Guidelines
- **FAQ** - Perguntas frequentes

#### **5. Exemplos** (`/examples`)
- **Casos de Uso** - Cenários reais
- **Implementações** - Código prático
- **Templates** - Modelos prontos
- **Demonstrações** - Provas de conceito

#### **6. Recursos** (`/resources`)
- **Downloads** - PDFs, templates, ferramentas
- **Comunidade** - Discord, GitHub, fóruns
- **Blog** - Artigos e atualizações
- **Roadmap** - Evolução do protocolo

#### **7. Sobre** (`/about`)
- **Visão e Missão** - Propósito do projeto
- **Equipe** - Contribuidores
- **Licença** - Termos de uso
- **Contato** - Canais de comunicação

---

## 📱 **Design System e UX**

### **Identidade Visual Oficial**

#### **Paleta de Cores Principal**
```
████████████████████████████████████████████████████████████████████████████████
█                           PALETA PRINCIPAL                                  █
████████████████████████████████████████████████████████████████████████████████
█                                                                              █
█  ████████████████████  ████████████████████  ████████████████████           █
█  █                  █  █                  █  █                  █           █
█  █  PRETO ABSOLUTO  █  █  CINZA GRAFITE   █  █  BRANCO NEUTRO   █           █
█  █     #000000      █  █     #2B2B2B      █  █     #FFFFFF      █           █
█  █                  █  █                  █  █                  █           █
█  █   Texto Principal█  █  Texto Secundário█  █   Fundos/Contrast█           █
█  █   Fundos Escuros █  █     Detalhes     █  █                  █           █
█  █                  █  █                  █  █                  █           █
█  ████████████████████  ████████████████████  ████████████████████           █
█                                                                              █
████████████████████████████████████████████████████████████████████████████████
```

- **🖤 Preto Absoluto**: `#000000` (CMYK: 0,0,0,100) - Marca principal, textos
- **⚫ Cinza Grafite**: `#2B2B2B` (CMYK: 0,0,0,82) - Textos secundários  
- **⚪ Branco Neutro**: `#FFFFFF` (CMYK: 0,0,0,0) - Fundos, contraste

#### **Paleta de Módulos**
```
████████████████████████████████████████████████████████████████████████████████
█                          PALETA DOS MÓDULOS                                 █
████████████████████████████████████████████████████████████████████████████████
█                                                                              █
█  ████████████████  ████████████████  ████████████████  ████████████████     █
█  █              █  █              █  █              █  █              █     █
█  █     MEF      █  █     ZOF      █  █     OIF      █  █     MOC      █     █
█  █  #2ECC71    █  █  #E67E22    █  █  #2980B9    █  █  #9B59B6    █     █
█  █              █  █              █  █              █  █              █     █
█  █  ESTRUTURA   █  █  MOVIMENTO   █  █ INTELIGÊNCIA █  █ ORGANIZAÇÃO  █     █
█  █  FUNDAÇÃO    █  █ ORQUESTRAÇÃO █  █   SABEDORIA  █  █   CATÁLOGO   █     █
█  █              █  █              █  █              █  █              █     █
█  ████████████████  ████████████████  ████████████████  ████████████████     █
█                                                                              █
█  ████████████████                                                           █
█  █              █                                                           █
█  █     MAL      █                                                           █
█  █  #C0392B    █                                                           █
█  █              █                                                           █
█  █ ARBITRAGEM   █                                                           █
█  █   DECISÃO    █                                                           █
█  █              █                                                           █
█  ████████████████                                                           █
█                                                                              █
████████████████████████████████████████████████████████████████████████████████
```

- **🟢 MEF**: Verde Esmeralda `#2ECC71` (CMYK: 63,0,67,0) - Estrutura/Fundação
- **🟠 ZOF**: Laranja Âmbar `#E67E22` (CMYK: 0,58,100,0) - Movimento/Orquestração  
- **🔵 OIF**: Azul Profundo `#2980B9` (CMYK: 88,50,0,0) - Inteligência/Sabedoria
- **🟣 MOC**: Lilás Neutro `#9B59B6` (CMYK: 54,79,0,0) - Catálogo/Organização
- **🔴 MAL**: Vermelho Escuro `#C0392B` (CMYK: 14,100,96,5) - Arbitragem/Decisão

#### **Tipografia Oficial**
- **Font Principal**: **Rajdhani** (futurística e geométrica)
  - **Bold**: Acrônimos dos módulos (`MEF`, `ZOF`, `OIF`, `MOC`, `MAL`)
  - **Regular**: Nomes completos (Matrix Embedding Framework)
  - **Light**: Textos auxiliares e descrições
- **Font Código**: Source Code Pro (mantido para blocos de código)

### **Componentes Principais**

#### **Navigation Header com Assets Oficiais**
```
████████████████████████████████████████████████████████████████████████████████
█                          HEADER OFICIAL                                     █
████████████████████████████████████████████████████████████████████████████████
█                                                                              █
█  ┌─────────────────┐   ┌─────────┐   ┌──────────┐   ┌─────────┐   ┌─────────┐█
█  │ MATRIX PROTOCOL │   │Protocol ▼│   │Framework ▼│   │  Docs ▼ │   │Examples ▼│█
█  │ Logo + Text     │   │  #000    │   │   MEF    │   │  #000   │   │  #000   ││
█  │ (Versão Completa│   │         │   │   ZOF    │   │         │   │         ││
█  │ ou Reduzida)    │   │         │   │   OIF    │   │         │   │         ││
█  └─────────────────┘   │         │   │   MOC    │   │         │   │         ││
█                        │         │   │   MAL    │   │         │   │         ││
█                        └─────────┘   └──────────┘   └─────────┘   └─────────┘█
█                                                              🌐 PT/EN [GitHub] █
████████████████████████████████████████████████████████████████████████████████
```

**Especificações do Logo no Header:**
- **Desktop**: `matrix-protocol-logo-gray.svg` (versão completa) 
- **Mobile**: `matrix-protocol-icon-gray.svg` (versão ícone)
- **Fundo escuro**: `matrix-protocol-logo-white.svg` ou `matrix-protocol-icon-white.svg`
- **Dimensões máximas**: 200px largura (desktop), 40px altura (mobile)
- **Área de proteção**: 16px em todas direções

#### **Hero Section com Cubo Central**
```
████████████████████████████████████████████████████████████████████████████████
█                          HERO SECTION                                       █
████████████████████████████████████████████████████████████████████████████████
█                                                                              █
█                      MATRIX PROTOCOL v1.0.0                                 █
█          Framework epistemológico para colaboração humano-AI                 █
█                                                                              █
█         ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  █
█         │ Começar     │  │ Ver Docs    │  │ Explorar    │                  █
█         │ Agora       │  │             │  │ Exemplos    │                  █
█         └─────────────┘  └─────────────┘  └─────────────┘                  █
█                                                                              █
█                          ┌─────────────┐                                    █
█                          │     ███     │ ← Cubo Central Matrix             █
█                          │     ███     │   (Perspectiva isométrica 45°)    █
█                          │     ███     │                                    █
█                          └─────────────┘                                    █
█                     ↙       ↓       ↓       ↘                              █
█                   MEF      ZOF     OIF     MOC     MAL                       █
█                 #2ECC71  #E67E22 #2980B9 #9B59B6 #C0392B                   █
█                                                                              █
████████████████████████████████████████████████████████████████████████████████
```

#### **Framework Cards com Cores Oficiais**
```
█████████████████████████████████████████████████████████████████████████████████
█                        FRAMEWORK CARDS                                        █
█████████████████████████████████████████████████████████████████████████████████
█                                                                               █
█ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐ █
█ │ 🟢    MEF       │ │ 🟠    ZOF      │ │ 🔵    OIF       │ │ 🟣    MOC    │ █
█ │   #2ECC71       │ │   #E67E22       │ │   #2980B9       │ │   #9B59B6     │ █
█ │                 │ │                 │ │                 │ │               │ █
█ │ [Logo MEF SVG]  │ │ [Logo ZOF SVG]  │ │ [Logo OIF SVG]  │ │ [Logo MOC SVG]│ █
█ │                 │ │                 │ │                 │ │               │ █
█ │ Matrix Embedding│ │ Zion Orchestr.  │ │ Operator Intell.│ │ Matrix Ontol. │ █
█ │ Framework       │ │ Framework       │ │ Framework       │ │ Catalog       │ █
█ │                 │ │                 │ │                 │ │               │ █
█ │ Estruturação    │ │ Orquestração de │ │ Arquétipos de   │ │ Catálogo de   │ █
█ │ de conhecimento │ │ workflows       │ │ IA hierárquica  │ │ ontologias    │ █
█ │ via UKIs        │ │ com checkpoints │ │ organizacional  │ │ organizacional│ █
█ │                 │ │                 │ │                 │ │               │ █
█ │  [Saiba Mais]   │ │  [Saiba Mais]   │ │  [Saiba Mais]   │ │ [Saiba Mais]  │ █
█ └─────────────────┘ └─────────────────┘ └─────────────────┘ └───────────────┘ █
█                                                                              █
█ ┌─────────────────┐                                                          █
█ │ 🔴    MAL       │                                                          █
█ │   #C0392B       │   ← Card centralizado (destaque especial)               █
█ │                 │                                                          █
█ │ [Logo MAL SVG]  │                                                          █
█ │                 │                                                          █
█ │ Matrix Arbiter  │                                                          █
█ │ Layer           │                                                          █
█ │                 │                                                          █
█ │ Arbitragem      │                                                          █
█ │ determinística  │                                                          █
█ │ de conflitos    │                                                          █
█ │                 │                                                          █
█ │  [Saiba Mais]   │                                                          █
█ └─────────────────┘                                                          █
█                                                                              █
████████████████████████████████████████████████████████████████████████████████
```

#### **Especificações dos Logos nos Cards**
- **Fundo Claro**: `{framework}-logo-text-color-full.svg` (versão colorida)
- **Fundo Escuro**: `{framework}-logo-color-text-white.svg` (texto branco) 
- **Versão Compacta**: `{framework}-logo-icon.svg` (apenas ícone)
- **Dimensões**: 80x60px para versão completa, 40x40px para ícone
- **Área de proteção**: 12px em todas direções

**Mapeamento de Arquivos por Framework:**
| Framework | Color Full | White Text | Icon |
|-----------|------------|------------|------|
| **MEF** | `mef-logo-text-color-full.svg` | `mef-logo-color-text-white.svg` | `mef-logo-icon.svg` |
| **ZOF** | `zof-logo-text-color-full.svg` | `zof-logo-color-text-white.svg` | `zof-logo-icon.svg` |
| **OIF** | `oif-logo-text-color-full.svg` | `oif-logo-color-text-white.svg` | `oif-logo-icon.svg` |
| **MOC** | `moc-logo-text-color-full.svg` | `moc-logo-color-text-white.svg` | `moc-logo-icon.svg` |
| **MAL** | `mal-logo-text-color-full.svg` | `mal-logo-color-text-white.svg` | `mal-logo-icon.svg` |

#### **Especificações Geométricas dos Componentes**
- **Cubo Central**: Grade 3×3×3, perspectiva isométrica 45°
- **Área de Proteção**: 1× altura do acrônimo em todas direções
- **Proporções**: 1:1:1 (altura:largura:profundidade)
- **Margem Mínima**: Equivalente ao tamanho do cubo

#### **Documentation Sidebar**
```
📋 Guia de Início
  ├── Instalação
  ├── Primeiro Projeto
  └── Conceitos Básicos

🏗️ Implementação
  ├── Configuração
  ├── UKIs
  └── Ontologias

🔧 Referência
  ├── Glossário Unificado
  ├── Templates MOC
  └── Exemplos Práticos
```

---

## 🎨 **Diretrizes de Aplicação da Marca**

### **Hierarquia de Versões da Marca**

```
████████████████████████████████████████████████████████████████████████████████
█                        VERSÕES DA MARCA                                     █
████████████████████████████████████████████████████████████████████████████████
█                                                                              █
█  ┌─────────────────────────────────────────────────────────────────────┐   █
█  │                        VERSÃO COMPLETA                               │   █
█  │  ┌─────┐  ┌─────────┐  ┌─────────────────────────────────────────┐  │   █
█  │  │ ███ │  │   MEF   │  │  Matrix Embedding Framework             │  │   █
█  │  │ ███ │  │   ZOF   │  │  Zion Orchestration Framework           │  │   █
█  │  │ ███ │  │   OIF   │  │  Operator Intelligence Framework        │  │   █
█  │  └─────┘  └─────────┘  └─────────────────────────────────────────┘  │   █
█  └─────────────────────────────────────────────────────────────────────┘   █
█                                                                              █
█  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐ █
█  │   VERSÃO REDUZIDA   │  │    VERSÃO ÍCONE     │  │ VERSÃO MONOCROMÁTICA│ █
█  │  ┌─────┐ ┌───────┐  │  │      ┌─────┐       │  │  ┌─────┐ ┌───────┐  │ █
█  │  │ ███ │ │  MEF  │  │  │      │ ███ │       │  │  │ ▓▓▓ │ │  MEF  │  │ █
█  │  │ ███ │ │  ZOF  │  │  │      │ ███ │       │  │  │ ▓▓▓ │ │  ZOF  │  │ █
█  │  └─────┘ └───────┘  │  │      └─────┘       │  │  └─────┘ └───────┘  │ █
█  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘ █
█                                                                              █
████████████████████████████████████████████████████████████████████████████████
```

| Versão | Composição | Aplicação no Website |
|---------|-------------|---------------------|
| 🏆 **Completa** | Símbolo + Acrônimo + Nome | Header principal, footer, páginas institucionais |
| 📱 **Reduzida** | Símbolo + Acrônimo | Headers mobile, cards de framework |
| 🎯 **Ícone** | Símbolo apenas | Favicon, avatares, apps |
| ⚫ **Monocromática** | Preto/branco | Documentos para impressão, contraste |

### **Área de Respiração e Proteção**

```
┌─────────────────────────────────────┐
│        ÁREA DE PROTEÇÃO             │  ← 1× altura do acrônimo
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │    ┌─────────────────┐      │    │  ← Zona de proteção mínima
│  │    │                 │      │    │
│  │    │   MATRIX CUBE   │      │    │
│  │    │                 │      │    │
│  │    └─────────────────┘      │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

### **Diretrizes de Uso por Contexto**

#### **✅ Usos Permitidos**
- **Marca principal**: Sempre em preto, branco ou cinza grafite
- **Módulos**: Cada um com sua cor sólida dominante oficial
- **Fundos**: Preferencialmente neutros (branco, preto, cinza)
- **Gradientes**: Apenas em materiais promocionais

#### **❌ Usos Proibidos**
- Gradientes em usos institucionais
- Alteração das cores oficiais
- Sobreposições que prejudiquem o contraste
- Uso de cores não oficiais
- Rotação ou distorção da marca
- Tipografia alternativa em aplicações oficiais

### **Aplicações por Categoria do Website**

```
████████████████████████████████████████████████████████████████████████████████
█                    APLICAÇÕES NO WEBSITE                                    █
████████████████████████████████████████████████████████████████████████████████
█                                                                              █
█  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐ █
█  │      💻 DIGITAL      │  │      📱 MOBILE      │  │   🎯 INTERATIVO      │ █
█  │                     │  │                     │  │                     │ █
█  │  ┌─────────────────┐ │  │  ┌─────────────────┐ │  │  ┌─────────────────┐ │ █
█  │  │ ███  Homepage   │ │  │  │ ▢▢▢  Header    │ │  │  │ ███  Demo       │ │ █
█  │  │ Framework Cards │ │  │  │ Navegação      │ │  │  │ Interativa      │ │ █
█  │  └─────────────────┘ │  │  └─────────────────┘ │  │  └─────────────────┘ │ █
█  │                     │  │                     │  │                     │ █
█  │  ┌─────────────────┐ │  │  ┌─────────────────┐ │  │  ┌─────────────────┐ │ █
█  │  │ ███  Dashboard  │ │  │  │ ▢▢▢  Menu      │ │  │  │ ███  Playground │ │ █
█  │  │ Documentação    │ │  │  │ Responsivo     │ │  │  │ de Código       │ │ █
█  │  └─────────────────┘ │  │  └─────────────────┘ │  │  └─────────────────┘ │ █
█  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘ █
█                                                                              █
████████████████████████████████████████████████████████████████████████████████
```

### **Checklist de Aplicação da Marca**

#### **✅ Antes de Aplicar**
- [ ] Verificar contraste adequado com fundo
- [ ] Confirmar tamanho mínimo respeitado
- [ ] Validar cores conforme paleta oficial
- [ ] Garantir área de respiração preservada
- [ ] Escolher versão apropriada para contexto
- [ ] Confirmar fonte Rajdhani disponível

#### **📋 Diretrizes Gerais**
- **Cor**: Seguir paleta cromática oficial rigorosamente
- **Tipografia**: Usar exclusivamente família Rajdhani
- **Espaçamento**: Respeitar área de proteção sempre
- **Qualidade**: Manter resolução adequada (vetorial quando possível)
- **Consistência**: Aplicar uniformemente em todo material

---

## 🌍 **Estratégia de Internacionalização**

### **Idiomas Suportados**
- **Português Brasileiro** (pt-BR) - Idioma principal
- **Inglês Americano** (en-US) - Idioma internacional

### **Estrutura de Conteúdo**
```
content/
├── pt-br/
│   ├── home.mdx
│   ├── protocol/
│   ├── frameworks/
│   ├── docs/
│   └── examples/
└── en-us/
    ├── home.mdx
    ├── protocol/
    ├── frameworks/
    ├── docs/
    └── examples/
```

### **Seletor de Idioma**
- Toggle no header: `🌐 PT | EN`
- URL structure: `/pt-br/docs` vs `/en-us/docs`
- Detecção automática baseada no browser
- Persistência da escolha via localStorage

---

## 📥 **Sistema de Downloads**

### **Categorias de Downloads**

#### **1. Documentação Oficial**
- `matrix-protocol-specification.pdf`
- `mef-implementation-guide.pdf`
- `moc-reference-manual.pdf`
- `complete-documentation-bundle.zip`

#### **2. Templates e Exemplos**
- `uki-templates-collection.zip`
- `moc-organizational-templates.zip`
- `implementation-examples.zip`
- `knowledge-comparison-demo.zip`

#### **3. Recursos de Desenvolvimento**
- `knowledge-comparison-examples.zip` (Exemplos práticos de comparação de conhecimento)
- `moc-yaml-templates.zip` (Templates YAML para MOC organizacional)
- `implementation-guides.zip` (Guias detalhados de implementação)

### **Interface de Download**
```
┌─────────────────────────────────────┐
│ 📄 Matrix Protocol Specification    │
│ Documentação completa do protocolo  │
│ [📥 Download PDF] [👁️ Visualizar]    │
│ Tamanho: 2.3MB | Versão: 1.0.0     │
└─────────────────────────────────────┘
```

---

## 🔍 **Sistema de Busca**

### **Funcionalidades**
- **Busca global** em toda documentação
- **Filtros por categoria**: Protocolo, Frameworks, Exemplos
- **Busca por idioma** específico
- **Sugestões automáticas** (autocomplete)
- **Resultados destacados** com contexto

### **Implementação**
- **Algolia DocSearch** ou **Fuse.js** para busca local
- **Indexação automática** do conteúdo MDX
- **Shortcuts de teclado**: `Ctrl+K` para abrir busca

---

## 📊 **Analytics e Métricas**

### **KPIs Principais**
- **Visitantes únicos** por mês
- **Páginas mais acessadas**
- **Downloads por categoria**
- **Tempo de permanência** na documentação
- **Taxa de conversão** (visitante → implementação)

### **Eventos Customizados**
- Download de documentação
- Acesso a exemplos específicos
- Mudança de idioma
- Busca realizada
- Link externo clicado (GitHub, Discord)

---

## 🚀 **Roadmap de Desenvolvimento**

### **Fase 1: MVP (4-6 semanas)**
- ✅ Estrutura básica Next.js
- ✅ Design system e componentes
- ✅ Páginas principais (Home, Protocolo, Frameworks)
- ✅ Sistema de internacionalização
- ✅ Documentação básica

### **Fase 2: Conteúdo (2-3 semanas)**
- ✅ Migração de toda documentação existente
- ✅ Criação de exemplos interativos
- ✅ Sistema de downloads
- ✅ Otimização SEO

### **Fase 3: Funcionalidades Avançadas (3-4 semanas)**
- ✅ Sistema de busca avançado
- ✅ Blog/artigos
- ✅ Comunidade integrada
- ✅ Analytics detalhado
- ✅ Performance optimization

### **Fase 4: Comunidade (ongoing)**
- ✅ Contribuições da comunidade
- ✅ Feedback e melhorias
- ✅ Expansão de idiomas
- ✅ Integrações com ferramentas

---

## 🔧 **Especificações Técnicas**

### **Performance**
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Lighthouse Score**: 95+ em todas as categorias
- **Bundle Size**: < 200KB inicial
- **Image Optimization**: WebP/AVIF com fallbacks
- **Font Loading**: Rajdhani com font-display: swap para performance

### **Brand Compliance**
- **Paleta de Cores**: Configuração em CSS Custom Properties
  ```css
  :root {
    --matrix-black: #000000;
    --matrix-graphite: #2B2B2B;
    --matrix-white: #FFFFFF;
    --mef-green: #2ECC71;
    --zof-orange: #E67E22;
    --oif-blue: #2980B9;
    --moc-purple: #9B59B6;
    --mal-red: #C0392B;
  }
  ```
- **Tipografia**: Rajdhani (Bold, Regular, Light) carregada via Google Fonts
- **Geometric Grid**: Sistema de grid 3×3×3 para componentes Matrix
- **Brand Assets**: Arquivos SVG oficiais mapeados do repositório `/design`
  - **Source Path**: `/design/*.svg` (repositório raiz)
  - **Target Path**: `/public/assets/logos/` (website)

### **SEO**
- **Meta tags** dinâmicos por página
- **Open Graph** para compartilhamento social
- **Structured data** (JSON-LD) com branding Matrix Protocol
- **Sitemap** automático
- **Robots.txt** otimizado
- **Favicon**: Versão ícone oficial da marca Matrix

### **Acessibilidade**
- **WCAG 2.1 AA** compliance
- **Keyboard navigation** completa
- **Screen reader** friendly
- **Color contrast**: Mínimo 4.5:1 (cumprido pela paleta oficial)
- **Focus indicators** visíveis usando cores da marca
- **Alt texts** descritivos para todos elementos visuais da marca

### **Segurança**
- **HTTPS** obrigatório
- **CSP headers** configurados
- **Input sanitization**
- **Dependency scanning**

### **Quality Standards para Brand Assets**
- **Resolução Mínima**: 300 DPI para materiais de impressão
- **Formatos**: SVG (preferencial), PNG com transparência, JPG para fotos
- **Área de Proteção**: Sempre respeitada em todos componentes
- **Contraste**: Validação automática de contraste de cores
- **Responsive**: Adaptação das versões da marca por breakpoint

---

## 🎨 **Gerenciamento de Assets Oficiais**

### **Estrutura de Assets do Brand Book**

Todos os logos e ícones oficiais estão localizados em `/design/` na raiz do repositório:

```
design/
├── matrix-protocol-logo-gray.svg      # Logo principal cinza
├── matrix-protocol-logo-white.svg     # Logo principal branco  
├── matrix-protocol-icon-gray.svg      # Ícone Matrix cinza
├── matrix-protocol-icon-white.svg     # Ícone Matrix branco
├── mef-logo-text-color-full.svg       # MEF logo completo colorido
├── mef-logo-color-text-white.svg      # MEF logo texto branco
├── mef-logo-icon.svg                  # MEF ícone apenas
├── zof-logo-text-color-full.svg       # ZOF logo completo colorido
├── zof-logo-color-text-white.svg      # ZOF logo texto branco
├── zof-logo-icon.svg                  # ZOF ícone apenas
├── oif-logo-text-color-full.svg       # OIF logo completo colorido
├── oif-logo-color-text-white.svg      # OIF logo texto branco
├── oif-logo-icon.svg                  # OIF ícone apenas
├── moc-logo-text-color-full.svg       # MOC logo completo colorido
├── moc-logo-color-text-white.svg      # MOC logo texto branco
├── moc-logo-icon.svg                  # MOC ícone apenas
├── mal-logo-text-color-full.svg       # MAL logo completo colorido
├── mal-logo-color-text-white.svg      # MAL logo texto branco
└── mal-logo-icon.svg                  # MAL ícone apenas
```

### **Mapeamento para Website**

Durante o build, os assets devem ser copiados para a estrutura do website:

```bash
# Script de cópia de assets
cp /design/matrix-protocol-*.svg /website/public/assets/logos/matrix/
cp /design/mef-logo-*.svg /website/public/assets/logos/mef/
cp /design/zof-logo-*.svg /website/public/assets/logos/zof/
cp /design/oif-logo-*.svg /website/public/assets/logos/oif/
cp /design/moc-logo-*.svg /website/public/assets/logos/moc/
cp /design/mal-logo-*.svg /website/public/assets/logos/mal/
```

### **Uso nos Componentes React**

```tsx
// Exemplo de componente Logo com seleção automática
interface LogoProps {
  framework: 'matrix' | 'mef' | 'zof' | 'oif' | 'moc' | 'mal';
  variant: 'full' | 'white' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ framework, variant, size = 'md', className }) => {
  const logoPath = `/assets/logos/${framework}/${framework}-logo-${variant === 'full' ? 'text-color-full' : variant === 'white' ? 'color-text-white' : 'icon'}.svg`;
  
  return (
    <img 
      src={logoPath}
      alt={`${framework.toUpperCase()} Logo`}
      className={`logo-${framework} logo-${size} ${className}`}
      style={{ maxHeight: size === 'sm' ? '24px' : size === 'lg' ? '80px' : '40px' }}
    />
  );
};

// Uso nos components
<Logo framework="matrix" variant="full" size="lg" />       // Header principal
<Logo framework="mef" variant="full" size="md" />          // Cards de framework
<Logo framework="zof" variant="icon" size="sm" />          // Menu mobile
```

### **Validação de Assets**

Checklist para garantir compliance com o Brand Book:

#### **✅ Validações Técnicas**
- [ ] Todos arquivos SVG são válidos e otimizados
- [ ] Dimensões respeitam proporções originais
- [ ] Cores correspondem à paleta oficial (`#2ECC71`, `#E67E22`, etc.)
- [ ] Arquivos não excedem 50KB cada
- [ ] Suporte a diferentes resoluções (responsive)

#### **✅ Validações de Brand**
- [ ] Área de proteção respeitada em todos usos
- [ ] Contraste adequado em todos backgrounds
- [ ] Versões corretas aplicadas por contexto
- [ ] Tipografia Rajdhani preservada nos logos texto
- [ ] Proporções geométricas 1:1:1 mantidas

### **Performance e Otimização**

```javascript
// next.config.js - Otimização de SVGs
module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    });
    return config;
  },
};
```

---

## 📋 **Checklist de Implementação**

### **Setup Inicial**
- [ ] Configurar repositório GitHub
- [ ] Setup Next.js + TypeScript
- [ ] Configurar Tailwind CSS + Shadcn/ui
- [ ] Setup internacionalização (next-i18next)
- [ ] Configurar MDX para documentação

### **Design e Layout**
- [ ] Criar design system baseado no Brand Book oficial
- [ ] Implementar paleta de cores oficial (CSS Custom Properties)
- [ ] Configurar tipografia Rajdhani (Bold, Regular, Light)
- [ ] Desenvolver componentes de marca (cubos, logos, versões)
- [ ] Implementar sistema de grid geométrico 3×3×3
- [ ] Desenvolver layout responsivo com breakpoints da marca
- [ ] Criar navegação principal com identidade visual oficial
- [ ] Implementar footer com aplicação correta da marca
- [ ] Validar área de proteção em todos componentes
- [ ] Configurar favicon com versão ícone oficial

### **Conteúdo**
- [ ] Migrar documentação existente
- [ ] Criar páginas principais
- [ ] Implementar sistema de downloads
- [ ] Adicionar exemplos práticos
- [ ] Configurar busca

### **Funcionalidades**
- [ ] Sistema de internacionalização
- [ ] Analytics e tracking
- [ ] Otimização SEO
- [ ] Performance optimization
- [ ] Testes automatizados

### **Deploy e Produção**
- [ ] Configurar CI/CD
- [ ] Setup domínio e DNS
- [ ] Configurar monitoramento
- [ ] Backup e recovery
- [ ] Documentação de manutenção

---

## 🎯 **Próximos Passos**

1. **Aprovação da arquitetura** proposta
2. **Setup do ambiente** de desenvolvimento
3. **Criação do design system** e protótipos
4. **Desenvolvimento iterativo** por fases
5. **Testes e feedback** contínuo
6. **Launch e promoção** da versão inicial

---

*Este documento serve como blueprint para o desenvolvimento do site oficial do Matrix Protocol, garantindo uma presença web profissional, acessível e eficiente para a comunidade global.*