# Schema Hooks Testing Guide

Este documento descreve como testar e validar o funcionamento dos hooks implementados para processamento de schemas.

## Hooks Implementados

### 1. Content Hook: `content:file:beforeParse`
- **Quando executa**: Durante o parse de arquivos pelo Nuxt Content
- **Arquivos processados**: `*-schema.yaml`
- **Função**: Atualiza URLs `$id` baseado no ambiente atual

### 2. Build Hook: `build:before`
- **Quando executa**: Antes do build do Nuxt iniciar
- **Função**: Validação de schemas + processamento em debug mode
- **Configuração**: `DEBUG_SCHEMAS=true` ou `FORCE_SCHEMA_REBUILD=true`

### 3. Nitro Hook: `nitro:build:before`
- **Quando executa**: Antes do build do Nitro
- **Função**: Validação final para produção
- **Comportamento**: Falha build se schemas inválidos em produção

### 4. Build Hook: `build:done`
- **Quando executa**: Após build completado
- **Função**: Log de confirmação

## Comandos de Teste

### Scripts NPM Disponíveis

```bash
# Processamento automático antes do build
pnpm build
pnpm generate

# Processamento manual
pnpm schemas:process

# Validação apenas
pnpm schemas:validate

# Força rebuild de todos os schemas
pnpm schemas:force-rebuild
```

### Variáveis de Ambiente para Teste

```bash
# Desenvolvimento (padrão)
NODE_ENV=development
SITE_URL=http://localhost:3000

# Teste com debug
DEBUG_SCHEMAS=true pnpm build

# Força rebuild
FORCE_SCHEMA_REBUILD=true pnpm build

# Produção
NODE_ENV=production SITE_URL=https://matrix-protocol.org pnpm build

# Override de schema URL
SCHEMA_BASE_URL=https://custom.domain.com/schemas pnpm build
```

## Cenários de Teste

### Cenário 1: Desenvolvimento Local
```bash
# Setup
NODE_ENV=development
SITE_URL=http://localhost:3000

# Resultado esperado
$id: "http://localhost:3000/schemas/mef/uki/1.0.0"
```

### Cenário 2: Produção
```bash
# Setup
NODE_ENV=production
SITE_URL=https://matrix-protocol.org

# Resultado esperado
$id: "https://matrix-protocol.org/schemas/mef/uki/1.0.0"
```

### Cenário 3: Ambiente Customizado
```bash
# Setup
SCHEMA_BASE_URL=https://cdn.example.com/schemas

# Resultado esperado
$id: "https://cdn.example.com/schemas/mef/uki/1.0.0"
```

### Cenário 4: Diferentes Portas
```bash
# Setup
NITRO_HOST=0.0.0.0
NITRO_PORT=8080

# Resultado esperado
$id: "http://0.0.0.0:8080/schemas/mef/uki/1.0.0"
```

## Validação Manual

### 1. Verificar Content Hook
```bash
# Limpar e buildar com debug
pnpm clean
DEBUG_SCHEMAS=true pnpm dev

# Verificar logs: [Content Hook] Processing schema: ...
# Verificar arquivos: URLs atualizadas nos YAMLs
```

### 2. Verificar Build Hook
```bash
# Build com debug
DEBUG_SCHEMAS=true pnpm build

# Verificar logs:
# ✅ Schema processing completed via build hook
# ✅ Schema validation passed
```

### 3. Verificar Nitro Hook (Produção)
```bash
# Build produção
NODE_ENV=production pnpm build

# Verificar logs:
# 🔄 Final schema validation for production Nitro build...
# ✅ Production schema validation completed
```

### 4. Verificar URLs nos Arquivos
```bash
# Verificar um schema específico
cat content/pt/docs/frameworks/specifications/mef/mef-uki-schema.yaml | grep '$id'

# Deve mostrar URL correta para o ambiente
```

## Testes de Falha

### 1. Schema Inválido
```bash
# Corromper um schema temporariamente
echo "invalid: yaml: content" >> content/pt/docs/frameworks/specifications/mef/mef-uki-schema.yaml

# Executar validação
pnpm schemas:validate

# Deve falhar com erro claro
```

### 2. Build Produção com Schema Inválido
```bash
# Com schema corrompido
NODE_ENV=production pnpm build

# Deve falhar o build inteiro
```

### 3. URLs Malformadas
```bash
# Testar com URL base inválida
SCHEMA_BASE_URL="not-a-url" pnpm schemas:process

# Deve gerar URLs válidas ou falhar graciosamente
```

## Logs Esperados

### Desenvolvimento Normal
```
[Content Hook] Processing schema: /content/pt/docs/frameworks/specifications/mef/mef-uki-schema.yaml
[Content Hook] Updated /content/pt/docs/frameworks/specifications/mef/mef-uki-schema.yaml: http://localhost:3000/schemas/mef/uki/1.0.0
✅ Schema validation passed
🎉 Build completed! Schema URLs are ready for environment: development
```

### Produção
```
🔄 Final schema validation for production Nitro build...
✅ Production schema validation completed
🎉 Build completed! Schema URLs are ready for environment: production
```

### Debug Mode
```
🔄 Running schema processing before build...
🔄 Processing schema files before build...
✅ Schema processing completed via build hook
✅ Schema validation passed
```

## Troubleshooting

### Hook não executa
- Verificar sintaxe do `nuxt.config.ts`
- Verificar versão do Nuxt 4.x
- Checar logs de erro durante startup

### URLs não atualizam
- Verificar variáveis de ambiente
- Forçar rebuild: `FORCE_SCHEMA_REBUILD=true pnpm build`
- Verificar permissões de escrita nos arquivos

### Build falha
- Verificar sintaxe YAML dos schemas
- Verificar se módulo `yaml` está disponível
- Checar logs específicos do erro

### Performance
- Content hooks são mais eficientes que build hooks
- Use `DEBUG_SCHEMAS=false` em produção
- Monitore tempo de build se muitos schemas