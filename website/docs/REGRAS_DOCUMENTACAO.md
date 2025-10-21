# Regras de Documentação Técnica - Matrix Protocol Website v2

## 📋 Diretrizes Obrigatórias

### 1. Centralização da Documentação

**REGRA FUNDAMENTAL**: Todo conteúdo de documentação técnica deve ser criado **EXCLUSIVAMENTE** em:
```

d:\projetos\matrix-protocol-website-v2\docs\
```


### 2. Escopo do README.md Principal

O arquivo `README.md` na raiz do projeto deve conter **APENAS**:
- ✅ Visão geral do projeto
- ✅ Links para documentação completa em `/docs`
- ✅ Instruções básicas de configuração e instalação
- ✅ Scripts de desenvolvimento essenciais

**PROIBIDO** no README.md principal:
- ❌ Documentação técnica detalhada
- ❌ Especificações de arquitetura
- ❌ Guias de implementação extensos
- ❌ Diagramas técnicos complexos

### 3. Estrutura Obrigatória do Diretório `/docs`

```

docs/
├── INDEX.md                    # Mapa completo da documentação
├── REGRAS_DOCUMENTACAO.md      # Este arquivo (regras)
├── arquitetura/                # Documentação de arquitetura
├── configuracao/               # Guias de configuração
├── desenvolvimento/            # Padrões e processos de dev
├── migracao/                   # Documentação de migração
├── referencias/                # Documentação de referência
└── versioning/                 # Controle de versões da docs
```


### 4. Proibições Explícitas

#### 🚫 ESTRITAMENTE PROIBIDO:
1. **Criar documentação técnica fora de `/docs`**
   - Não criar arquivos `.md` técnicos na raiz
   - Não criar subpastas de documentação em outros locais
   - Não duplicar documentação em múltiplos locais

2. **Documentação duplicada**
   - Cada tópico deve ter um local único e definitivo
   - Links devem referenciar a fonte única
   - Evitar cópias ou resumos em outros arquivos

3. **Documentação não versionada**
   - Toda documentação deve ter controle de versão
   - Mudanças significativas devem ser documentadas
   - Manter histórico de alterações importantes

### 5. Padrões de Nomenclatura

#### Arquivos e Pastas:
- `kebab-case` minúsculo obrigatório para todos os arquivos `.md` e pastas.
- `index.md` obrigatório em pastas com conteúdo.
- Não permitir `snake_case`, espaços, acentos ou maiúsculas nos nomes.
- Exemplos: `quickstart`, `manual/reference`, `frameworks/mef.md`.

#### Estrutura de Arquivos:
```markdown
# Título Principal
## Seção
### Subseção
#### Detalhes

**Versão**: X.Y.Z
**Última atualização**: YYYY-MM-DD
**Responsável**: Nome/Equipe
```


### 6. Versionamento da Documentação

#### Controle de Versões:
- **Major (X.0.0)**: Mudanças estruturais significativas
- **Minor (X.Y.0)**: Adição de novos documentos ou seções
- **Patch (X.Y.Z)**: Correções e atualizações menores

#### Metadados Obrigatórios:
Cada documento deve incluir no cabeçalho:
```markdown
---
versao: "0.0.1"
data_criacao: "2025-01-XX"
ultima_atualizacao: "2025-01-XX"
responsavel: "Casheiro"
categoria: "arquitetura|configuracao|desenvolvimento|migracao|referencias"
status: "ativo|deprecated|rascunho"
---
```


### 7. Organização por Categorias

#### `/arquitetura`
- Diagramas de sistema
- Especificações técnicas
- Padrões arquiteturais
- Decisões de design

#### `/configuracao`
- Guias de setup
- Configurações de ambiente
- Variáveis de ambiente
- Dependências

#### `/desenvolvimento`
- Padrões de código
- Workflows de desenvolvimento
- Testes e qualidade
- Ferramentas de desenvolvimento

#### `/migracao`
- Planos de migração
- Cronogramas
- Mapeamentos de componentes
- Adaptações técnicas

#### `/referencias`
- APIs e endpoints
- Glossários
- Troubleshooting
- FAQs técnicos

### 8. Responsabilidades

#### Desenvolvedores:
- ✅ Seguir rigorosamente estas regras
- ✅ Atualizar documentação junto com código
- ✅ Revisar documentação em PRs
- ✅ Manter versionamento atualizado

#### Revisores:
- ✅ Verificar conformidade com regras
- ✅ Validar localização da documentação
- ✅ Confirmar ausência de duplicação
- ✅ Aprovar apenas se regras forem seguidas

### 9. Processo de Criação de Documentação

1. **Verificar** se já existe documentação sobre o tópico
2. **Identificar** a categoria apropriada em `/docs`
3. **Criar** o arquivo na pasta correta
4. **Incluir** metadados obrigatórios
5. **Atualizar** o `INDEX.md`
6. **Referenciar** no README.md se necessário

### 10. Penalidades por Não Conformidade

#### Ações Automáticas:
- 🚫 PRs com documentação fora de `/docs` serão **REJEITADOS**
- 🚫 Documentação duplicada será **REMOVIDA**
- 🚫 Arquivos sem versionamento serão **BLOQUEADOS**

#### Processo de Correção:
1. Identificação da violação
2. Notificação ao responsável
3. Prazo de 24h para correção
4. Remoção automática se não corrigido

---

## 🎯 Objetivo

Manter a documentação técnica **organizada**, **centralizada** e **rastreável**, garantindo que toda a equipe saiba exatamente onde encontrar e como contribuir com a documentação do projeto.

## 📞 Suporte

Para dúvidas sobre estas regras, consulte:
- `INDEX.md` - Mapa da documentação
- Equipe responsável pela documentação
- Issues no repositório com tag `documentation`

---

**Versão**: Beta  
**Data de Criação**: Janeiro 2025  
**Status**: Ativo  
**Responsável**: Casheiro

### 11. Frontmatter e Política de Nomes (Conteúdo do Site)

Esta seção complementa as regras de `/docs` e define padrões para páginas de conteúdo do site em `website/content/{pt|en}`.

- Escopo: arquivos `.md` em `website/content/{pt|en}/**`.
- Frontmatter obrigatório e recomendado:
```yaml
---
# Obrigatórios
title: "Título da página"
description: "Resumo curto (50–150 caracteres)"
icon: "i-heroicons-[nome]"
layout: "docs"
sidebar: true
toc: true
navigation: true
order: 0

# Recomendados (validados pelo schema)
lang: "pt|en"                     # Idioma do conteúdo
last_updated: "2025-10-21"        # AAAA-MM-DD
framework: "MEF|MOC|MAL|OIF|ZOF"  # Enum suportado
maturity: "stable|beta|experimental" # Estado do conteúdo
tags: ["manual", "templates"]     # lower-kebab, únicas, 1–24 chars
---
```
- Regras de validação:
  - `icon`: deve seguir o padrão `i-heroicons-*`.
  - `layout`: obrigatoriamente `docs`.
  - `sidebar`, `toc`, `navigation`: valores booleanos.
  - `order`: inteiro não negativo (default: `0` para `index.md`, `10` para páginas).
  - `lang`: `pt` ou `en`.
  - `last_updated`: formato `AAAA-MM-DD`.
  - `framework`: um de `MEF|MOC|MAL|OIF|ZOF`.
  - `maturity`: um de `stable|beta|experimental`.
  - `tags`: lista de strings em `lower-kebab`, únicas, com 1–24 caracteres.
- Política de nomes:
  - Pastas: `kebab-case` minúsculo obrigatório.
  - Arquivos: `kebab-case` minúsculo obrigatório (sem underscores, espaços, acentos ou maiúsculas).
- Validação automatizada:
  - Scripts: `website/scripts/content-audit.js` e `website/scripts/validation-automation.js`.
  - Esquema: `website/scripts/frontmatter-schema.json` (Ajv).
  - Quality Gates: PRs que quebrarem o padrão serão bloqueados pelo CI.