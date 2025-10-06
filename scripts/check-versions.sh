#!/bin/bash
# check-versions.sh
# Verifica se todas as versões estão em v0.0.1-beta e status corretos

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Matrix Protocol - Verificação de Versões${NC}"
echo "=================================================="

# Contadores
total_files=0
correct_versions=0
correct_status=0
errors=0

# Arquivos que devem ter v0.0.1-beta
core_files=(
    "MATRIX_PROTOCOL.md"
    "MEP_MATRIX_EPISTEMIC_PRINCIPLE.md"
    "MEF_MATRIX_EMBEDDING_FRAMEWORK.md"
    "ZOF_ZION_ORCHESTRATION_FRAMEWORK.md"
    "OIF_OPERATOR_INTELLIGENCE_FRAMEWORK.md"
    "MOC_MATRIX_ONTOLOGY_CATALOG.md"
    "MAL_MATRIX_ARBITER_LAYER.md"
    "MATRIX_PROTOCOL_GLOSSARY.md"
    "MATRIX_PROTOCOL_INTEGRATION_DIAGRAM.md"
    "Ontology_MEF_Support.md"
)

echo -e "\n${YELLOW}📋 Verificando arquivos principais...${NC}\n"

for file in "${core_files[@]}"; do
    if [ -f "$file" ]; then
        total_files=$((total_files + 1))
        
        echo -n "📄 $file: "
        
        # Verificar versão
        version=$(grep "Version:" "$file" | head -1 | sed 's/.*Version:\s*//' | tr -d '*' | xargs)
        
        if [[ "$version" =~ "0.0.1-beta" ]]; then
            echo -n -e "${GREEN}✅ Versão OK${NC}"
            correct_versions=$((correct_versions + 1))
        else
            echo -n -e "${RED}❌ Versão incorreta: $version${NC}"
            errors=$((errors + 1))
        fi
        
        # Verificar status (especial para MAL que tem campo Status explícito)
        if [[ "$file" == "MAL_MATRIX_ARBITER_LAYER.md" ]]; then
            status=$(grep "Status:" "$file" | head -1 | sed 's/.*Status:\s*//' | tr -d '*' | xargs)
            if [[ "$status" =~ "Active" ]]; then
                echo -e " ${GREEN}✅ Status OK (Active)${NC}"
                correct_status=$((correct_status + 1))
            else
                echo -e " ${RED}❌ Status incorreto: $status (deveria ser Active)${NC}"
                errors=$((errors + 1))
            fi
        else
            # Para outros arquivos, o status "Beta" está implícito na versão
            if [[ "$version" =~ "beta" ]]; then
                echo -e " ${GREEN}✅ Status OK (Beta implícito na versão)${NC}"
                correct_status=$((correct_status + 1))
            else
                echo -e " ${RED}❌ Status incorreto: versão não contém 'beta'${NC}"
                errors=$((errors + 1))
            fi
        fi
    else
        echo -e "${RED}❌ Arquivo não encontrado: $file${NC}"
        errors=$((errors + 1))
    fi
done

# Verificar versões PT também
echo -e "\n${YELLOW}📋 Verificando arquivos PT...${NC}\n"

pt_files=(
    "MEF_MATRIX_EMBEDDING_FRAMEWORK_PT.md"
    "MAL_MATRIX_ARBITER_LAYER_PT.md"
)

for file in "${pt_files[@]}"; do
    if [ -f "$file" ]; then
        total_files=$((total_files + 1))
        
        echo -n "📄 $file: "
        
        version=$(grep -E "(Version|Versão):" "$file" | head -1 | sed 's/.*[Vv]ers[ãa]o:\s*//' | tr -d '*' | xargs)
        
        if [[ "$version" =~ "0.0.1-beta" ]]; then
            echo -n -e "${GREEN}✅ Versão OK${NC}"
            correct_versions=$((correct_versions + 1))
        else
            echo -n -e "${RED}❌ Versão incorreta: $version${NC}"
            errors=$((errors + 1))
        fi
        
        # Verificar status para arquivos PT
        if [[ "$file" == "MAL_MATRIX_ARBITER_LAYER_PT.md" ]]; then
            status=$(grep -E "(Status|Status):" "$file" | head -1 | sed 's/.*Status:\s*//' | tr -d '*' | xargs)
            if [[ "$status" =~ "Ativo" ]] || [[ "$status" =~ "Active" ]]; then
                echo -e " ${GREEN}✅ Status OK (Ativo)${NC}"
                correct_status=$((correct_status + 1))
            else
                echo -e " ${RED}❌ Status incorreto: $status (deveria ser Ativo)${NC}"
                errors=$((errors + 1))
            fi
        else
            # Para outros arquivos PT, o status "Beta" está implícito na versão
            if [[ "$version" =~ "beta" ]]; then
                echo -e " ${GREEN}✅ Status OK (Beta implícito na versão)${NC}"
                correct_status=$((correct_status + 1))
            else
                echo -e " ${RED}❌ Status incorreto: versão não contém 'beta'${NC}"
                errors=$((errors + 1))
            fi
        fi
    fi
done

# Relatório final
echo -e "\n${BLUE}📊 RELATÓRIO FINAL${NC}"
echo "===================="
echo "Total de arquivos verificados: $total_files"
echo -e "Versões corretas: ${GREEN}$correct_versions${NC}"
echo -e "Status corretos: ${GREEN}$correct_status${NC}"

if [ $errors -eq 0 ]; then
    echo -e "\n${GREEN}🎉 SUCESSO: Todas as versões e status estão corretos!${NC}"
    exit 0
else
    echo -e "\n${RED}⚠️  ENCONTRADOS $errors PROBLEMAS${NC}"
    echo -e "${YELLOW}💡 Execute as correções necessárias e rode o script novamente${NC}"
    exit 1
fi