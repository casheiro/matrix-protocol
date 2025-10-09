#!/bin/bash

# Script de Sincronização Completa - Matrix Protocol
# Sincroniza TODA documentação de /docs para /website/content com transformação de links
# Substitui múltiplas estratégias por uma única fonte da verdade

set -e  # Sair em caso de erro

echo "🔄 Iniciando sincronização completa do Matrix Protocol..."

# Diretórios principais
DOCS_ROOT="../docs"
CONTENT_ROOT="content"
DOWNLOADS_ROOT="public/downloads"

# Verificar se diretório docs existe
if [ ! -d "$DOCS_ROOT" ]; then
    echo "❌ Erro: Diretório docs não encontrado: $DOCS_ROOT"
    exit 1
fi

# Função para transformar links problemáticos
transform_links() {
    local file="$1"
    echo "🔗 Transformando links em: $file"
    
    # Backup do arquivo original
    cp "$file" "$file.bak"
    
    # Transformações de links para estrutura do website
    sed -i \
        -e 's|\[\([^]]*\)\](MEF_MATRIX_EMBEDDING_FRAMEWORK[^)]*)|\1|g' \
        -e 's|\[\([^]]*\)\](ZOF_ZION_ORCHESTRATION_FRAMEWORK[^)]*)|\1|g' \
        -e 's|\[\([^]]*\)\](OIF_OPERATOR_INTELLIGENCE_FRAMEWORK[^)]*)|\1|g' \
        -e 's|\[\([^]]*\)\](MOC_MATRIX_ONTOLOGY_CATALOG[^)]*)|\1|g' \
        -e 's|\[\([^]]*\)\](MAL_MATRIX_ARBITER_LAYER[^)]*)|\1|g' \
        -e 's|\[\([^]]*\)\](MEP_MATRIX_EPISTEMIC_PRINCIPLE[^)]*)|\1|g' \
        -e 's|\[\([^]]*\)\](MATRIX_PROTOCOL[^)]*)|\1|g' \
        -e 's|\[\([^]]*\)\](\.\./manual/\([^)]*\))|\[\1\](/\2)|g' \
        -e 's|\[\([^]]*\)\](\./manual/\([^)]*\))|\[\1\](/manual/\2)|g' \
        -e 's|\[\([^]]*\)\](/manual/\([^)]*\)\.md)|\[\1\](/manual/\2)|g' \
        -e 's|\[\([^]]*\)\](\.\./specifications/pt/\([^)]*\))|\[\1\](/\2)|g' \
        -e 's|\[\([^]]*\)\](\.\./specifications/en/\([^)]*\))|\[\1\](/\2)|g' \
        -e 's|\[\([^]]*\)\](\./specifications/\([^)]*\))|\[\1\](/\2)|g' \
        -e 's|\[\([^]]*\)\]([^)]*/templates/moc/[^)]*)|\1|g' \
        "$file"
    
    # Remover backup se transformação foi bem sucedida
    rm "$file.bak"
}

# Função para copiar e transformar arquivos markdown
copy_and_transform() {
    local source_dir="$1"
    local target_dir="$2"
    local prefix="$3"
    
    echo "📁 Copiando $source_dir para $target_dir (prefix: $prefix)"
    
    # Criar diretório alvo
    mkdir -p "$target_dir"
    
    # Copiar todos os arquivos markdown
    find "$source_dir" -name "*.md" -type f | while read -r file; do
        # Calcular caminho relativo
        rel_path=$(realpath --relative-to="$source_dir" "$file")
        target_file="$target_dir/$rel_path"
        
        # Criar diretório pai se necessário
        mkdir -p "$(dirname "$target_file")"
        
        # Copiar arquivo
        cp "$file" "$target_file"
        
        # Transformar links
        transform_links "$target_file"
        
        echo "✅ $rel_path"
    done
}

# Limpar conteúdo anterior
echo "🧹 Limpando conteúdo anterior..."
rm -rf "$CONTENT_ROOT"
mkdir -p "$CONTENT_ROOT"

# 1. Sincronizar Specifications PT
echo ""
echo "🇧🇷 Sincronizando Specifications PT..."
copy_and_transform "$DOCS_ROOT/specifications/pt" "$CONTENT_ROOT/pt" "/pt"

# 2. Sincronizar Specifications EN  
echo ""
echo "🇺🇸 Sincronizando Specifications EN..."
copy_and_transform "$DOCS_ROOT/specifications/en" "$CONTENT_ROOT/en" "/en"

# 3. Sincronizar Guides PT
echo ""
echo "📚 Sincronizando Guides PT..."
copy_and_transform "$DOCS_ROOT/guides/pt" "$CONTENT_ROOT/pt/guides" "/pt/guides"

# 4. Sincronizar Guides EN
echo ""
echo "📚 Sincronizando Guides EN..."
copy_and_transform "$DOCS_ROOT/guides/en" "$CONTENT_ROOT/en/guides" "/en/guides"

# 5. Sincronizar Manual Completo (PT e EN)
echo ""
echo "📖 Sincronizando Manual Completo..."
mkdir -p "$CONTENT_ROOT/pt/manual"
mkdir -p "$CONTENT_ROOT/en/manual"

# Copiar estrutura completa do manual
if [ -d "$DOCS_ROOT/manual" ]; then
    # Documentos principais
    for file in "$DOCS_ROOT/manual"/*.md; do
        if [ -f "$file" ]; then
            basename_file=$(basename "$file")
            if [[ "$basename_file" == *"_PT.md" ]]; then
                target_name=$(echo "$basename_file" | sed 's/_PT\.md/.md/')
                cp "$file" "$CONTENT_ROOT/pt/manual/$target_name"
                transform_links "$CONTENT_ROOT/pt/manual/$target_name"
            elif [[ "$basename_file" == *"_EN.md" ]]; then
                target_name=$(echo "$basename_file" | sed 's/_EN\.md/.md/')
                cp "$file" "$CONTENT_ROOT/en/manual/$target_name"  
                transform_links "$CONTENT_ROOT/en/manual/$target_name"
            else
                # Arquivo sem sufixo de idioma - copiar para ambos
                cp "$file" "$CONTENT_ROOT/pt/manual/$basename_file"
                cp "$file" "$CONTENT_ROOT/en/manual/$basename_file"
                transform_links "$CONTENT_ROOT/pt/manual/$basename_file"
                transform_links "$CONTENT_ROOT/en/manual/$basename_file"
            fi
        fi
    done
    
    # Subdiretórios do manual
    for subdir in examples templates tools reference; do
        if [ -d "$DOCS_ROOT/manual/$subdir" ]; then
            copy_and_transform "$DOCS_ROOT/manual/$subdir" "$CONTENT_ROOT/pt/manual/$subdir" "/pt/manual/$subdir"
            copy_and_transform "$DOCS_ROOT/manual/$subdir" "$CONTENT_ROOT/en/manual/$subdir" "/en/manual/$subdir"
        fi
    done
fi

# 6. Sincronizar Examples
echo ""
echo "💡 Sincronizando Examples..."
if [ -d "$DOCS_ROOT/examples" ]; then
    copy_and_transform "$DOCS_ROOT/examples" "$CONTENT_ROOT/pt/examples" "/pt/examples"
    copy_and_transform "$DOCS_ROOT/examples" "$CONTENT_ROOT/en/examples" "/en/examples"
fi

# 7. Manter sincronização de downloads (templates, UKIs etc.)
echo ""
echo "📦 Mantendo sincronização de downloads..."
# Executar script de templates existente
if [ -f "./sync-uki-templates.sh" ]; then
    ./sync-uki-templates.sh
fi

# 8. Criar páginas dinâmicas para navegação
echo ""
echo "🔄 Criando estrutura de navegação..."

# Index pages para facilitar navegação
cat > "$CONTENT_ROOT/pt/index.md" << EOF
---
title: 'Matrix Protocol - Documentação'
description: 'Documentação completa do Matrix Protocol'
---

# Matrix Protocol - Documentação

Bem-vindo à documentação completa do Matrix Protocol.

## Navegação

### Especificações
- [Frameworks](/pt/frameworks)
- [Protocolo](/pt/protocol) 
- [MEP - Manifesto](/pt/mep)
- [Integração](/pt/integration)
- [Glossário](/pt/glossary)

### Guias
- [Implementação](/pt/guides/implementation)
- [Início Rápido](/pt/guides/quickstart)

### Manual
- [Manual Completo](/pt/manual)
- [Exemplos](/pt/examples)
EOF

cat > "$CONTENT_ROOT/en/index.md" << EOF
---
title: 'Matrix Protocol - Documentation'
description: 'Complete Matrix Protocol documentation'
---

# Matrix Protocol - Documentation

Welcome to the complete Matrix Protocol documentation.

## Navigation

### Specifications
- [Frameworks](/en/frameworks)
- [Protocol](/en/protocol)
- [MEP - Manifesto](/en/mep)
- [Integration](/en/integration)
- [Glossary](/en/glossary)

### Guides
- [Implementation](/en/guides/implementation)
- [Quick Start](/en/guides/quickstart)

### Manual
- [Complete Manual](/en/manual)
- [Examples](/en/examples)
EOF

# 9. Contar arquivos sincronizados
echo ""
echo "📊 Estatísticas da sincronização:"

PT_COUNT=$(find "$CONTENT_ROOT/pt" -name "*.md" -type f | wc -l)
EN_COUNT=$(find "$CONTENT_ROOT/en" -name "*.md" -type f | wc -l)
TOTAL_COUNT=$((PT_COUNT + EN_COUNT))

echo "   • Documentos PT: $PT_COUNT arquivos"
echo "   • Documentos EN: $EN_COUNT arquivos" 
echo "   • Total: $TOTAL_COUNT arquivos"

# 10. Criar metadados
echo ""
echo "📝 Criando metadados de sincronização..."
cat > "$CONTENT_ROOT/sync-metadata.json" << EOF
{
  "sync_date": "$(date -Iseconds)",
  "source_dir": "$DOCS_ROOT",
  "total_files": $TOTAL_COUNT,
  "languages": {
    "pt": $PT_COUNT,
    "en": $EN_COUNT
  },
  "structure": {
    "specifications": true,
    "guides": true, 
    "manual": true,
    "examples": true
  }
}
EOF

echo ""
echo "✅ Sincronização completa concluída com sucesso!"
echo "🎯 Conteúdo disponível em: $CONTENT_ROOT"
echo "📁 Downloads disponíveis em: $DOWNLOADS_ROOT"
echo ""
echo "🚀 Execute 'pnpm dev' para testar o website com novo conteúdo"