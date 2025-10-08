#!/bin/bash

# Script de Sincronização de Templates UKI
# Mantém fonte única em /docs/examples/ sincronizada com /public/downloads/uki/

set -e  # Sair em caso de erro

echo "🔄 Sincronizando templates UKI..."

# Diretórios
SOURCE_DIR="../docs/examples/knowledge-comparison/structured"
TARGET_DIR="public/downloads/uki"
GUIDES_SOURCE="../docs/manual"
GUIDES_TARGET="public/downloads/guides"
BASE_TARGET_DIR="public/downloads"
TEMPLATES_SOURCE="../docs/manual/templates"
QUICKSTART_SOURCE="../docs/manual/quick-start"

# Verificar se diretório fonte existe
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ Erro: Diretório fonte não encontrado: $SOURCE_DIR"
    exit 1
fi

# Criar diretórios de destino
echo "📁 Criando estrutura de diretórios..."
mkdir -p "$TARGET_DIR/business-rules"
mkdir -p "$TARGET_DIR/procedures" 
mkdir -p "$TARGET_DIR/technical-patterns"
mkdir -p "$GUIDES_TARGET"

# Sincronizar templates UKI por categoria
echo "📋 Sincronizando business-rules..."
cp "$SOURCE_DIR/business-rules/"*.yaml "$TARGET_DIR/business-rules/" 2>/dev/null || {
    echo "⚠️  Nenhum arquivo business-rules encontrado"
}

echo "⚙️  Sincronizando procedures..."
cp "$SOURCE_DIR/procedures/"*.yaml "$TARGET_DIR/procedures/" 2>/dev/null || {
    echo "⚠️  Nenhum arquivo procedures encontrado"
}

echo "🔧 Sincronizando technical-patterns..."
cp "$SOURCE_DIR/technical-patterns/"*.yaml "$TARGET_DIR/technical-patterns/" 2>/dev/null || {
    echo "⚠️  Nenhum arquivo technical-patterns encontrado"
}

# Sincronizar guias de implementação existentes
echo "📖 Sincronizando guias de implementação..."
if [ -f "$GUIDES_SOURCE/MATRIX_PROTOCOL_IMPLEMENTATION_GUIDE_PT.md" ]; then
    cp "$GUIDES_SOURCE/MATRIX_PROTOCOL_IMPLEMENTATION_GUIDE_PT.md" "$GUIDES_TARGET/"
    echo "✅ Guia PT sincronizado"
fi

if [ -f "$GUIDES_SOURCE/MATRIX_PROTOCOL_IMPLEMENTATION_GUIDE_EN.md" ]; then
    cp "$GUIDES_SOURCE/MATRIX_PROTOCOL_IMPLEMENTATION_GUIDE_EN.md" "$GUIDES_TARGET/"
    echo "✅ Guia EN sincronizado"
fi

# Sincronizar quick-start templates
echo "📚 Sincronizando quick-start templates..."
mkdir -p "$BASE_TARGET_DIR/quick-start"
if [ -d "$QUICKSTART_SOURCE" ]; then
    cp "$QUICKSTART_SOURCE/"*.yaml "$BASE_TARGET_DIR/quick-start/" 2>/dev/null && {
        echo "✅ Templates quick-start sincronizados"
    } || {
        echo "⚠️  Templates quick-start não encontrados"
    }
else
    echo "⚠️  Diretório quick-start não encontrado"
fi

# Sincronizar templates MOC
echo "🏛️ Sincronizando templates MOC..."
mkdir -p "$BASE_TARGET_DIR/templates"
if [ -d "$TEMPLATES_SOURCE" ]; then
    cp "$TEMPLATES_SOURCE/"*.yaml "$BASE_TARGET_DIR/templates/" 2>/dev/null && {
        echo "✅ Templates MOC sincronizados"
    } || {
        echo "⚠️  Templates MOC não encontrados"
    }
else
    echo "⚠️  Diretório templates não encontrado"
fi

# Contar arquivos sincronizados
BUSINESS_COUNT=$(ls "$TARGET_DIR/business-rules/"*.yaml 2>/dev/null | wc -l)
PROCEDURES_COUNT=$(ls "$TARGET_DIR/procedures/"*.yaml 2>/dev/null | wc -l)
PATTERNS_COUNT=$(ls "$TARGET_DIR/technical-patterns/"*.yaml 2>/dev/null | wc -l)
TOTAL_COUNT=$((BUSINESS_COUNT + PROCEDURES_COUNT + PATTERNS_COUNT))

echo ""
echo "📊 Resumo da sincronização:"
echo "   • Business Rules: $BUSINESS_COUNT templates"
echo "   • Procedures: $PROCEDURES_COUNT templates"
echo "   • Technical Patterns: $PATTERNS_COUNT templates"
echo "   • Total: $TOTAL_COUNT templates UKI"

# Criar arquivo de metadados para rastreamento
echo "📝 Criando metadados..."
cat > "$TARGET_DIR/sync-metadata.json" << EOF
{
  "sync_date": "$(date -Iseconds)",
  "source_dir": "$SOURCE_DIR",
  "total_templates": $TOTAL_COUNT,
  "categories": {
    "business_rules": $BUSINESS_COUNT,
    "procedures": $PROCEDURES_COUNT,
    "technical_patterns": $PATTERNS_COUNT
  }
}
EOF

echo "✅ Sincronização concluída com sucesso!"
echo "🎯 Templates UKI disponíveis em: $TARGET_DIR"