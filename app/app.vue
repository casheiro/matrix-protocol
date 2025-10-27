<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup>
// Configuração apenas do favicon dinâmico baseado no tema do navegador
useHead({
  link: [
    // Favicon para tema claro do navegador
    { 
      rel: 'icon', 
      type: 'image/svg+xml', 
      href: '/logos/matrix/matrix-protocol-icon-gray.svg',
      media: '(prefers-color-scheme: light)'
    },
    // Favicon para tema escuro do navegador
    { 
      rel: 'icon', 
      type: 'image/svg+xml', 
      href: '/logos/matrix/matrix-protocol-icon-white.svg',
      media: '(prefers-color-scheme: dark)'
    },
    // Fallback para browsers que não suportam SVG
    { 
      rel: 'icon', 
      type: 'image/x-icon', 
      href: '/favicon.ico'
    }
  ]
})
</script>
