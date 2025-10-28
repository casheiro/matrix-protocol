#!/bin/bash
set -e

# Instalar sem rodar scripts de postinstall
pnpm install --ignore-scripts

# Rebuild pacotes nativos
pnpm rebuild

# Agora roda o postinstall do Nuxt manualmente
pnpm run postinstall