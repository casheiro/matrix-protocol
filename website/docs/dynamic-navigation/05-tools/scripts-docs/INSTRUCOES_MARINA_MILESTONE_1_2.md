# 🎯 INSTRUÇÕES PARA MARINA - MILESTONE 1.2

## 👤 **SEU PAPEL NA SPRINT 1**
Você é **Marina Torres**, especialista em **Content Specialist** executando a **MILESTONE 1.2** que depende diretamente do template criado por Bruno na MILESTONE 1.1.

## 📋 **SUA MISSÃO: CRIAR 19 ARQUIVOS INDEX.MD FALTANTES**

### **Status Atual:**
- ✅ **MILESTONE 1.1 COMPLETA** - Bruno criou template padrão + primeiro exemplo
- ⏳ **MILESTONE 1.2 AGUARDANDO** - Você deve criar os 19 arquivos restantes
- 🎯 **Meta**: Desbloquear todos os 20 bloqueadores críticos identificados

## 📝 **TEMPLATE CRIADO POR BRUNO**

### **Localização do Template:**
- **Template Master**: `/docs/dynamic-navigation/05-tools/scripts-docs/INDEX_TEMPLATE.md`
- **Exemplo Funcional**: `/content/pt/docs/manual/templates/basic/index.md` ✅ CRIADO

### **Como Usar o Template:**

1. **Abra o template master** para entender a estrutura
2. **Identifique a categoria** do arquivo que vai criar (templates, examples, quickstart)
3. **Use as regras de geração** para título, descrição e ícone
4. **Copie o template específico** para a categoria
5. **Substitua as variáveis** `{{VARIAVEL}}` pelos valores corretos
6. **Valide o resultado** comparando com o exemplo do Bruno

## 📊 **LISTA DOS 19 ARQUIVOS QUE VOCÊ DEVE CRIAR**

### **🇧🇷 PORTUGUÊS (7 arquivos restantes):**

#### **Templates (6 arquivos):**
```
1. pt/docs/manual/templates/corporation/index.md
   Template: Templates Organizacionais → Corporation
   Ícone: i-heroicons-building-office-2

2. pt/docs/manual/templates/enterprise/index.md  
   Template: Templates Organizacionais → Enterprise
   Ícone: i-heroicons-building-office

3. pt/docs/manual/templates/scaleup/index.md
   Template: Templates Organizacionais → Scaleup
   Ícone: i-heroicons-chart-bar-square

4. pt/docs/manual/templates/startup/index.md
   Template: Templates Organizacionais → Startup  
   Ícone: i-heroicons-rocket-launch

5. pt/docs/manual/templates/unified/index.md
   Template: Templates Organizacionais → Unified
   Ícone: i-heroicons-squares-plus

6. pt/docs/quickstart/templates/index.md
   Template: Quickstart Templates
   Ícone: i-heroicons-document-duplicate
```

### **🇺🇸 INGLÊS (12 arquivos):**

#### **Examples/Knowledge (5 arquivos):**
```
7. en/docs/examples/knowledge/structured/business-rules/index.md
   Template: Examples Knowledge → Business Rules
   Ícone: i-heroicons-building-office

8. en/docs/examples/knowledge/structured/procedures/index.md
   Template: Examples Knowledge → Procedures  
   Ícone: i-heroicons-clipboard-document-list

9. en/docs/examples/knowledge/structured/technical-patterns/index.md
   Template: Examples Knowledge → Technical Patterns
   Ícone: i-heroicons-cog-6-tooth

10. en/docs/examples/knowledge/structured/index.md
    Template: Examples Knowledge → Structured
    Ícone: i-heroicons-squares-2x2

11. en/docs/examples/knowledge/unstructured/index.md
    Template: Examples Knowledge → Unstructured
    Ícone: i-heroicons-document-minus

12. en/docs/examples/knowledge/index.md
    Template: Examples Knowledge → Knowledge
    Ícone: i-heroicons-light-bulb
```

#### **Frameworks (1 arquivo):**
```
13. en/docs/frameworks/index.md
    Template: Similar ao arquivo existente em PT
    Ícone: i-heroicons-cube
```

#### **Templates (5 arquivos):**
```
14. en/docs/manual/templates/basic/index.md
    Template: Templates Organizacionais → Basic (traduzir do PT)
    Ícone: i-heroicons-building-storefront

15. en/docs/manual/templates/corporation/index.md
    Template: Templates Organizacionais → Corporation  
    Ícone: i-heroicons-building-office-2

16. en/docs/manual/templates/enterprise/index.md
    Template: Templates Organizacionais → Enterprise
    Ícone: i-heroicons-building-office

17. en/docs/manual/templates/scaleup/index.md
    Template: Templates Organizacionais → Scaleup
    Ícone: i-heroicons-chart-bar-square

18. en/docs/manual/templates/startup/index.md
    Template: Templates Organizacionais → Startup
    Ícone: i-heroicons-rocket-launch
```

### **Frameworks (1 arquivo):**
```
19. en/docs/manual/templates/startup/index.md
    Template: Templates Organizacionais → Startup
    Ícone: i-heroicons-rocket-launch
```

## 🔧 **GUIA PRÁTICO DE GERAÇÃO**

### **Passo 1: Escolher Template Correto**

#### **Para Pastas `/manual/templates/[PORTE]/`:**
- Use o **Template para Templates Organizacionais** 
- Substitua `{{PORTE}}` pelo porte específico (basic, startup, etc.)
- Copie as características do `caracteristicasPorPorte` no template master

#### **Para Pastas `/examples/knowledge/`:**  
- Use o **Template para Examples/Knowledge**
- Adapte baseado no tipo (structured, unstructured, business-rules, etc.)

#### **Para Pastas `/quickstart/templates/`:**
- Use o **Template para Quickstart**
- Mantenha foco em "uso imediato"

### **Passo 2: Aplicar Regras de Geração**

#### **Título (sempre em Português/Inglês):**
```javascript
// Exemplos de títulos corretos:
'corporation' → 'Templates Corporativos' (PT) / 'Corporate Templates' (EN)
'business-rules' → 'Regras de Negócio MEF' (PT) / 'MEF Business Rules' (EN)  
'structured' → 'Conhecimento Estruturado MEF' (PT) / 'MEF Structured Knowledge' (EN)
```

#### **Descrição (50-150 caracteres):**
```javascript
// Exemplos de descrições:
corporation: "Templates específicos para grandes corporações com estruturas complexas"
business-rules: "UKIs estruturados contendo as regras fundamentais de negócio MEF"
structured: "Demonstração completa de conhecimento organizado segundo especificação MEF"
```

### **Passo 3: Validação Pré-Commit**

✅ **Frontmatter completo** - Todos os campos obrigatórios presentes  
✅ **Ícone correto** - Conferir mapeamento no template master  
✅ **Descrição adequada** - Entre 50-150 caracteres  
✅ **Links funcionais** - Verificar paths relativos  
✅ **Idioma consistente** - PT para pastas pt/, EN para pastas en/  

## 📋 **WORKFLOW RECOMENDADO**

### **Sequência Eficiente:**

1. **Comece pelos PT Templates** (corporation, enterprise, scaleup, startup, unified)
   - São todos similares, pode usar padrão repetitivo
   - Use as características do `caracteristicasPorPorte` no template

2. **Faça PT Quickstart** (quickstart/templates)
   - Template específico já definido

3. **Traduza Templates para EN** (basic, corporation, enterprise, scaleup, startup)
   - Baseie nas versões PT que acabou de criar

4. **Crie EN Examples/Knowledge** (structured, unstructured, business-rules, etc.)
   - Use exemplos existentes em PT como referência

5. **Finalize com EN Frameworks** 
   - Baseie no arquivo PT existente

### **Estimativa de Tempo:**
- **5-7 arquivos por hora** (considerando template pronto)
- **Total: 3-4 horas** para os 19 arquivos
- **Validação final: 30 minutos**

## 🎯 **SUCCESS CRITERIA PARA MILESTONE 1.2**

### **Critérios de Entrega:**
- ✅ **19 arquivos criados** conforme lista específica
- ✅ **Frontmatter consistente** em todos os arquivos
- ✅ **Navegação funcional** testada em pelo menos 3 arquivos
- ✅ **Paridade PT/EN** - templates equivalentes em ambos idiomas

### **Validação de Qualidade:**
- ✅ **Todos ícones** seguem mapeamento hierárquico
- ✅ **Todas descrições** entre 50-150 caracteres
- ✅ **Todos títulos** seguem padrão de nomenclatura
- ✅ **Todos links relativos** funcionais

## 🔄 **PRÓXIMOS PASSOS PÓS-ENTREGA**

### **Para MILESTONE 1.3 (Bruno):**
Sua entrega libera Bruno para:
- ✅ Validar navegação dinâmica funcionando
- ✅ Testar autodescoberta em 20 pastas
- ✅ Gerar relatório de conclusão da Sprint 1

### **Para ÉPICO 2:**
Sua entrega estabelece:
- ✅ **Base sólida** para navegação dinâmica
- ✅ **Padrão consistente** para futuras expansões  
- ✅ **Template validado** para novas seções

## 🚀 **RECURSOS DE APOIO**

### **Arquivos de Referência:**
- **Template Master**: `/docs/dynamic-navigation/05-tools/scripts-docs/INDEX_TEMPLATE.md`
- **Exemplo Funcional**: `/content/pt/docs/manual/templates/basic/index.md` 
- **Análise de Frontmatter**: `/docs/dynamic-navigation/03-deliverables/story-1.1-audit/TASK_1.1.3_FRONTMATTER_CATALOG.md`

### **Para Dúvidas:**
- Consulte o **exemplo do Bruno** em `/content/pt/docs/manual/templates/basic/index.md`
- Verifique **arquivos existentes** similares para comparação
- Use as **regras de geração** do template master

---

## ⭐ **VOCÊ É A CHAVE DO SUCESSO DA SPRINT 1!**

Seus 19 arquivos vão:
- 🔓 **Desbloquear** todos os 20 bloqueadores críticos
- 🚀 **Habilitar** navegação dinâmica completa  
- ✅ **Finalizar** STORY 1.1 (Content Audit + Fixing)
- 🎯 **Preparar** terreno para ÉPICO 2

**🎉 Boa sorte Marina! O template do Bruno está pronto e testado - agora é só replicar! 🎉**

---

**👤 Instruções preparadas por**: Bruno Oliveira  
**🎯 Destinatário**: Marina Torres  
**📅 Data**: 15 de outubro de 2025  
**⏱️ Status**: ✅ READY FOR MILESTONE 1.2