#!/bin/bash

# Script para criar arquivos ZIP organizados dos templates UKI
# Cria downloads em lote por categoria

set -e

echo "📦 Criando arquivos ZIP dos templates UKI..."

UKI_DIR="public/downloads/uki"
FRAMEWORKS_DIR="public/downloads/frameworks"

# Verificar se diretório UKI existe
if [ ! -d "$UKI_DIR" ]; then
    echo "❌ Erro: Execute primeiro o script sync-uki-templates.sh"
    exit 1
fi

# Criar diretório de frameworks se não existir
mkdir -p "$FRAMEWORKS_DIR/mef"

# Remover ZIPs antigos se existirem
rm -f "$FRAMEWORKS_DIR/mef/"*.zip

echo "📋 Criando basic-templates.zip (templates essenciais)..."
cd "$UKI_DIR"
zip -r "../frameworks/mef/basic-templates.zip" \
    business-rules/uki-pay-discount-logic-001.yaml \
    business-rules/uki-pay-refund-policy-002.yaml \
    business-rules/uki-pay-fee-calculation-005.yaml \
    technical-patterns/uki-pay-gateway-integration-007.yaml \
    technical-patterns/uki-pay-retry-strategy-008.yaml \
    procedures/uki-pay-pci-compliance-013.yaml \
    procedures/uki-pay-deployment-process-015.yaml

echo "🔧 Criando advanced-templates.zip (templates complexos)..."
zip -r "../frameworks/mef/advanced-templates.zip" \
    business-rules/uki-pay-fraud-thresholds-003.yaml \
    business-rules/uki-pay-currency-rates-004.yaml \
    business-rules/uki-pay-chargeback-rules-006.yaml \
    technical-patterns/uki-pay-webhook-handling-009.yaml \
    technical-patterns/uki-pay-security-headers-010.yaml \
    technical-patterns/uki-pay-idempotency-keys-011.yaml \
    technical-patterns/uki-pay-error-handling-012.yaml \
    procedures/uki-pay-incident-response-014.yaml \
    procedures/uki-pay-monitoring-alerts-016.yaml \
    procedures/uki-pay-performance-optimization-017.yaml

echo "🎯 Criando all-uki-templates.zip (todos os templates)..."
zip -r "../frameworks/mef/all-uki-templates.zip" \
    business-rules/ \
    technical-patterns/ \
    procedures/ \
    sync-metadata.json

# Criar ZIP de business rules apenas
echo "💼 Criando business-rules-templates.zip..."
zip -r "../frameworks/mef/business-rules-templates.zip" business-rules/

# Criar ZIP de technical patterns apenas  
echo "⚙️ Criando technical-patterns-templates.zip..."
zip -r "../frameworks/mef/technical-patterns-templates.zip" technical-patterns/

# Criar ZIP de procedures apenas
echo "📋 Criando procedures-templates.zip..."
zip -r "../frameworks/mef/procedures-templates.zip" procedures/

cd - > /dev/null

echo ""
echo "📊 Arquivos ZIP criados:"
ls -la "$FRAMEWORKS_DIR/mef/"*.zip | awk '{print "   • " $9 " (" $5 " bytes)"}'

echo ""
echo "✅ Criação de ZIPs concluída com sucesso!"
echo "🎯 Arquivos disponíveis em: $FRAMEWORKS_DIR/mef/"