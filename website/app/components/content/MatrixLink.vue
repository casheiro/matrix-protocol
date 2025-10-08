<template>
  <component 
    :is="linkComponent"
    v-bind="linkProps"
    :class="linkClasses"
    @click="handleClick"
  >
    <slot>{{ linkText }}</slot>
  </component>
</template>

<script setup lang="ts">
interface Props {
  /** Chave do link no mapeamento do Matrix Protocol */
  to?: string
  /** Para downloads, chave do arquivo a ser baixado */
  download?: string
  /** Locale específico (opcional, usa o atual por padrão) */
  locale?: string
  /** Classes CSS adicionais */
  class?: string
  /** Texto do link (usado se não houver slot) */
  text?: string
  /** Variante visual do link */
  variant?: 'default' | 'button' | 'nav' | 'download'
  /** Cor do link (para variante button) */
  color?: 'primary' | 'success' | 'info' | 'warning' | 'error'
  /** Tamanho do link (para variante button) */
  size?: 'sm' | 'md' | 'lg'
  /** Ícone a ser exibido */
  icon?: string
  /** Abrir em nova aba */
  external?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  color: 'primary',
  size: 'md',
  external: false
})

const { resolveLink, resolveDownload, hasLink, getLinkInfo } = useMatrixLinks()
const { t } = useI18n()

// Determina se é um link de download ou navegação
const isDownload = computed(() => !!props.download)
const linkKey = computed(() => props.download || props.to || '')

// Resolve o link baseado no tipo
const resolvedLink = computed(() => {
  if (!linkKey.value) return '#'
  
  if (isDownload.value) {
    const downloadInfo = resolveDownload(linkKey.value)
    return downloadInfo?.url || '#'
  }
  
  return resolveLink(linkKey.value, { locale: props.locale })
})

// Informações do link para validação e debugging
const linkInfo = computed(() => getLinkInfo(linkKey.value))

// Valida se o link existe
const isValidLink = computed(() => hasLink(linkKey.value))

// Componente a ser renderizado (NuxtLink ou button para downloads)
const linkComponent = computed(() => {
  if (isDownload.value || props.external) return 'button'
  if (props.variant === 'button') return resolveComponent('UButton')
  return resolveComponent('NuxtLink')
})

// Props para o componente
const linkProps = computed(() => {
  const baseProps: any = {}
  
  if (isDownload.value || props.external) {
    // Para downloads e links externos, não precisa de props especiais
    baseProps.type = 'button'
  } else if (props.variant === 'button') {
    // Para UButton
    baseProps.to = resolvedLink.value
    baseProps.color = props.color
    baseProps.size = props.size
    if (props.icon) baseProps.icon = props.icon
  } else {
    // Para NuxtLink normal
    baseProps.to = resolvedLink.value
    if (props.external) {
      baseProps.target = '_blank'
      baseProps.rel = 'noopener noreferrer'
    }
  }
  
  return baseProps
})

// Classes CSS do link
const linkClasses = computed(() => {
  const classes = [props.class]
  
  if (!isValidLink.value) {
    classes.push('text-red-500 cursor-not-allowed')
  } else {
    switch (props.variant) {
      case 'default':
        classes.push('text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors')
        break
      case 'nav':
        classes.push('text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors')
        break
      case 'download':
        classes.push('inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors')
        break
      case 'button':
        // Classes são gerenciadas pelo UButton
        break
    }
  }
  
  if (isDownload.value) {
    classes.push('cursor-pointer')
  }
  
  return classes.filter(Boolean).join(' ')
})

// Texto do link se não houver slot
const linkText = computed(() => {
  if (props.text) return props.text
  
  if (!isValidLink.value) {
    return `[Invalid link: ${linkKey.value}]`
  }
  
  // Gera texto baseado no tipo do link
  const info = linkInfo.value
  if (!info) return linkKey.value
  
  switch (info.type) {
    case 'framework':
      return info.slug?.toUpperCase()
    case 'download':
      return info.filename || 'Download'
    default:
      return linkKey.value
  }
})

// Handler para clicks (especialmente downloads)
const handleClick = async (event: Event) => {
  if (!isValidLink.value) {
    event.preventDefault()
    console.warn(`MatrixLink: Invalid link key "${linkKey.value}"`)
    return
  }
  
  if (isDownload.value) {
    event.preventDefault()
    await downloadFile()
  } else if (props.external) {
    event.preventDefault()
    window.open(resolvedLink.value, '_blank', 'noopener,noreferrer')
  }
}

// Função para fazer download de arquivos
const downloadFile = async () => {
  const downloadInfo = resolveDownload(linkKey.value)
  
  if (!downloadInfo) {
    console.error(`MatrixLink: Invalid download key "${linkKey.value}"`)
    return
  }
  
  try {
    const response = await fetch(downloadInfo.url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = downloadInfo.filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Download failed:', error)
    // Fallback: tentar abrir em nova aba
    window.open(downloadInfo.url, '_blank')
  }
}

// Warning para links inválidos em desenvolvimento
if (process.dev && !isValidLink.value && linkKey.value) {
  console.warn(`MatrixLink: Unknown link key "${linkKey.value}". Available keys:`, Object.keys(useMatrixLinks().linkMappings))
}
</script>

<style scoped>
/* Estilos específicos do componente se necessário */
.matrix-link-invalid {
  @apply text-red-500 cursor-not-allowed;
}
</style>