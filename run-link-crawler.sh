#!/bin/bash

# Script para executar o link crawler
# Instala dependências se necessário e executa o crawler

set -e

echo "🔍 Link Crawler - Site Health Check"
echo "=================================="

# Verifica se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado. Instale Python 3 primeiro."
    exit 1
fi

# Instala dependências se não existirem
echo "📦 Verificando dependências..."
pip3 install -r requirements-crawler.txt --quiet

# URL base (modifique conforme necessário)
BASE_URL="http://localhost:64274"

echo "🚀 Iniciando crawl de: $BASE_URL"
echo ""

# Executa o crawler
python3 link-crawler.py "$BASE_URL" \
    --delay 0.5 \
    --max-depth 5 \
    --timeout 10

echo ""
echo "✅ Crawler finalizado! Verifique os arquivos de relatório gerados."