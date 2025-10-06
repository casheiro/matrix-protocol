#!/bin/bash
# check-sync.sh
# Verifica sincronização entre repositório e website

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Matrix Protocol - Verificação de Sincronização${NC}"
echo "===================================================="

# Verificar se website existe
WEBSITE_PATH="./website"
if [ ! -d "$WEBSITE_PATH" ]; then
    echo -e "${YELLOW}⚠️  Diretório website não encontrado em: $WEBSITE_PATH${NC}"
    echo "Este script assume que o website está em ./website/"
    echo "Execute de onde o website estiver acessível ou ajuste WEBSITE_PATH"
    exit 1
fi

echo -e "${GREEN}✅ Website encontrado em: $WEBSITE_PATH${NC}\n"

# Contadores
total_checks=0
sync_ok=0
sync_issues=0

# Função para verificar se arquivo existe e comparar versão
check_file_sync() {
    local repo_file="$1"
    local website_file="$2"
    local framework_name="$3"
    
    total_checks=$((total_checks + 1))
    
    echo -n "🔍 $framework_name: "
    
    if [ ! -f "$repo_file" ]; then
        echo -e "${RED}❌ Arquivo repositório não encontrado: $repo_file${NC}"
        sync_issues=$((sync_issues + 1))
        return
    fi
    
    if [ ! -f "$website_file" ]; then
        echo -e "${RED}❌ Arquivo website não encontrado: $website_file${NC}"
        sync_issues=$((sync_issues + 1))
        return
    fi
    
    # Extrair versões
    repo_version=$(grep "Version:" "$repo_file" | head -1 | sed 's/.*Version:\s*//' | tr -d '*' | xargs)
    website_version=$(grep "version:" "$website_file" | head -1 | sed 's/.*version:\s*//' | tr -d '"' | xargs)
    
    if [ "$repo_version" = "$website_version" ]; then
        echo -e "${GREEN}✅ Versões sincronizadas ($repo_version)${NC}"
        sync_ok=$((sync_ok + 1))
    else
        echo -e "${RED}❌ Versões divergentes - Repo: $repo_version | Website: $website_version${NC}"
        sync_issues=$((sync_issues + 1))
    fi
}

echo -e "${YELLOW}📋 Verificando sincronização de frameworks...${NC}\n"

# Verificar principais frameworks
check_file_sync "MEF_MATRIX_EMBEDDING_FRAMEWORK.md" "$WEBSITE_PATH/content/en/frameworks/mef.md" "MEF"
check_file_sync "ZOF_ZION_ORCHESTRATION_FRAMEWORK.md" "$WEBSITE_PATH/content/en/frameworks/zof.md" "ZOF"
check_file_sync "OIF_OPERATOR_INTELLIGENCE_FRAMEWORK.md" "$WEBSITE_PATH/content/en/frameworks/oif.md" "OIF"
check_file_sync "MOC_MATRIX_ONTOLOGY_CATALOG.md" "$WEBSITE_PATH/content/en/frameworks/moc.md" "MOC"
check_file_sync "MAL_MATRIX_ARBITER_LAYER.md" "$WEBSITE_PATH/content/en/frameworks/mal.md" "MAL"

# Verificar estruturas obrigatórias
echo -e "\n${YELLOW}📂 Verificando estruturas obrigatórias...${NC}\n"

check_structure() {
    local path="$1"
    local name="$2"
    
    total_checks=$((total_checks + 1))
    
    if [ -d "$path" ]; then
        file_count=$(find "$path" -type f -name "*.md" -o -name "*.yaml" -o -name "*.yml" | wc -l)
        echo -e "📁 $name: ${GREEN}✅ Existe ($file_count arquivos)${NC}"
        sync_ok=$((sync_ok + 1))
    else
        echo -e "📁 $name: ${RED}❌ Não encontrado${NC}"
        sync_issues=$((sync_issues + 1))
    fi
}

check_structure "./guides" "Guias (/guides)"
check_structure "./visualizations" "Visualizações (/visualizations)"
check_structure "./templates" "Templates (/templates)"
check_structure "./.github/ISSUE_TEMPLATE" "Issue Templates (.github/ISSUE_TEMPLATE)"

# Verificar arquivos de documentação críticos
echo -e "\n${YELLOW}📄 Verificando documentação crítica...${NC}\n"

critical_docs=(
    "SYNC_GUIDE.md:Guia de Sincronização"
    "NAVIGATION_MAP.md:Mapa de Navegação"
    "CHANGELOG.md:Changelog"
    "CONSOLIDATION_PLAN.md:Plano de Consolidação"
)

for doc in "${critical_docs[@]}"; do
    IFS=':' read -r file name <<< "$doc"
    total_checks=$((total_checks + 1))
    
    if [ -f "$file" ]; then
        echo -e "📄 $name: ${GREEN}✅ Existe${NC}"
        sync_ok=$((sync_ok + 1))
    else
        echo -e "📄 $name: ${RED}❌ Não encontrado${NC}"
        sync_issues=$((sync_issues + 1))
    fi
done

# Verificar conteúdo específico
echo -e "\n${YELLOW}🔍 Verificando conteúdo específico...${NC}\n"

# MEF Section 5
total_checks=$((total_checks + 1))
if grep -q "## 5\. UKI Lifecycle" "MEF_MATRIX_EMBEDDING_FRAMEWORK.md" 2>/dev/null; then
    echo -e "📝 MEF Section 5 (UKI Lifecycle): ${GREEN}✅ Presente no repositório${NC}"
    sync_ok=$((sync_ok + 1))
else
    echo -e "📝 MEF Section 5 (UKI Lifecycle): ${RED}❌ Não encontrada${NC}"
    sync_issues=$((sync_issues + 1))
fi

# ZOF Universal Pattern no website
total_checks=$((total_checks + 1))
if [ -f "$WEBSITE_PATH/content/en/frameworks/zof.md" ] && grep -q "Universal Pattern" "$WEBSITE_PATH/content/en/frameworks/zof.md"; then
    echo -e "📝 ZOF Universal Pattern: ${GREEN}✅ Presente no website${NC}"
    sync_ok=$((sync_ok + 1))
else
    echo -e "📝 ZOF Universal Pattern: ${RED}❌ Não encontrado no website${NC}"
    sync_issues=$((sync_issues + 1))
fi

# Relatório final
echo -e "\n${BLUE}📊 RELATÓRIO DE SINCRONIZAÇÃO${NC}"
echo "================================="
echo "Total de verificações: $total_checks"
echo -e "Itens sincronizados: ${GREEN}$sync_ok${NC}"
echo -e "Problemas encontrados: ${RED}$sync_issues${NC}"

# Calcular percentual
if [ $total_checks -gt 0 ]; then
    percentage=$(( (sync_ok * 100) / total_checks ))
    echo "Percentual de sincronização: $percentage%"
fi

if [ $sync_issues -eq 0 ]; then
    echo -e "\n${GREEN}🎉 SUCESSO: Repositório e website estão sincronizados!${NC}"
    exit 0
else
    echo -e "\n${RED}⚠️  ENCONTRADOS $sync_issues PROBLEMAS DE SINCRONIZAÇÃO${NC}"
    echo -e "${YELLOW}💡 Consulte SYNC_GUIDE.md para procedimentos de correção${NC}"
    exit 1
fi