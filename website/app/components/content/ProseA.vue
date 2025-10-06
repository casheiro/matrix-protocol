<template>
  <!-- Link de Download -->
  <a v-if="isDownloadLink" 
     @click.prevent="handleDownload"
     :href="href"
     class="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer transition-colors"
     v-bind="$attrs">
    <UIcon name="i-heroicons-arrow-down-tray" class="w-4 h-4" />
    <slot />
  </a>
  
  <!-- Link Interno Normal -->
  <NuxtLink v-else-if="isInternalLink" 
            :to="localizedPath" 
            class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline decoration-1 underline-offset-2 transition-colors"
            v-bind="$attrs">
    <slot />
  </NuxtLink>
  
  <!-- Link Externo -->
  <a v-else 
     :href="href" 
     class="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline decoration-1 underline-offset-2 transition-colors"
     v-bind="$attrs" 
     target="_blank" 
     rel="noopener noreferrer">
    <slot />
    <UIcon name="i-heroicons-arrow-up-right" class="w-3 h-3" />
  </a>
</template>

<script setup>
// Props
const props = defineProps({
  href: {
    type: String,
    default: ''
  }
})

// Composables
const localePath = useLocalePath()

// Computed
const isDownloadLink = computed(() => {
  return props.href && props.href.startsWith('/downloads/')
})

const isInternalLink = computed(() => {
  if (!props.href) return false
  
  // Se é link de download, não é link interno normal
  if (isDownloadLink.value) return false
  
  // Se começa com http, é externo
  if (props.href.startsWith('http')) return false
  
  // Se começa com mailto, é externo
  if (props.href.startsWith('mailto:')) return false
  
  // Se começa com #, é âncora interna
  if (props.href.startsWith('#')) return false
  
  // Senão, é link interno
  return true
})

const localizedPath = computed(() => {
  if (!props.href) return '#'
  
  // Se já tem barra, usa direto
  if (props.href.startsWith('/')) {
    return localePath(props.href)
  }
  
  // Se é relativo tipo "mep" ou "frameworks/moc"
  // Adiciona barra e usa localePath
  return localePath('/' + props.href)
})

// Função de download (mesma da resources.vue)
const handleDownload = async () => {
  const fileName = props.href.split('/').pop()
  
  try {
    const response = await fetch(props.href)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Download failed:', error)
    // Fallback: tentar abrir em nova aba
    window.open(props.href, '_blank')
  }
}
</script>