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
  
  <!-- Link de Âncora -->
  <a v-else-if="isAnchorLink"
     :href="href"
     class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline decoration-1 underline-offset-2 transition-colors"
     v-bind="$attrs">
    <slot />
  </a>
  
  <!-- Link já apontando para o Viewer -->
  <NuxtLink v-else-if="isPrebuiltViewerLink"
            :to="prebuiltViewerPath"
            class="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 underline decoration-1 underline-offset-2 transition-colors"
            v-bind="$attrs">
    <UIcon :name="getFileIcon()" class="w-4 h-4" />
    <slot />
  </NuxtLink>
  
  <!-- Link para Arquivo (YAML, TXT, etc.) -->
  <NuxtLink v-else-if="isFileViewerLink"
            :to="fileViewerPath"
            class="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 underline decoration-1 underline-offset-2 transition-colors"
            v-bind="$attrs">
    <UIcon :name="getFileIcon()" class="w-4 h-4" />
    <slot />
  </NuxtLink>
  
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
const route = useRoute()
const { $i18n } = useNuxtApp()

// Computed
const isDownloadLink = computed(() => {
  return props.href && props.href.startsWith('/downloads/')
})

const isAnchorLink = computed(() => {
  return props.href && props.href.startsWith('#')
})

// Detecta links já formatados para o viewer
const isPrebuiltViewerLink = computed(() => {
  if (!props.href) return false
  const hrefLower = props.href.toLowerCase()
  return hrefLower.includes('/docs/viewer') && hrefLower.includes('?file=')
})

const isFileViewerLink = computed(() => {
  if (!props.href) return false
  // Não reescrever se já é link do viewer
  if (isPrebuiltViewerLink.value) return false
  const resolvedPath = resolveRelativePath(props.href)
  return /(\.yaml|\.yml|\.txt|\.json)$/i.test(resolvedPath)
})

const isInternalLink = computed(() => {
  if (!props.href) return false
  
  // Se é link de download, não é link interno normal
  if (isDownloadLink.value) return false
  
  // Se é arquivo para viewer, não é link interno normal
  if (isFileViewerLink.value) return false

  // Link do viewer pré-formatado é interno, mas não precisa de localePath
  if (isPrebuiltViewerLink.value) return false
  
  // Se começa com http, é externo
  if (props.href.startsWith('http')) return false
  
  // Se começa com mailto, é externo
  if (props.href.startsWith('mailto:')) return false
  
  // Se começa com #, é âncora interna
  if (props.href.startsWith('#')) return false
  
  // Senão, é link interno
  return true
})

// Função para resolver paths relativos
const resolveRelativePath = (href) => {
  if (!href) return '#'
  
  // Se já é absoluto, usa direto
  if (href.startsWith('/')) {
    return href
  }
  
  // Obter o path atual sem locale (remove apenas no início)
  const currentPath = route.path.replace(new RegExp(`^\/${$i18n.locale.value}`), '')
  
  // Se é relativo com ./
  if (href.startsWith('./')) {
    const relativePath = href.substring(2) // Remove "./"
    // Para links ./, usar o diretório atual sem remover o último segmento
    const currentDir = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath
    return `${currentDir}/${relativePath}`
  }
  
  // Se é relativo com ../
  if (href.startsWith('../')) {
    let pathParts = currentPath.split('/').filter(Boolean)
    const hrefParts = href.split('/').filter(Boolean)
    
    // Remove partes do path atual para cada "../"
    for (const part of hrefParts) {
      if (part === '..') {
        pathParts.pop()
      } else {
        pathParts.push(part)
      }
    }
    
    return '/' + pathParts.join('/')
  }
  
  // Se é relativo simples (ex: "mef", "frameworks/moc")
  // Adiciona ao diretório atual (mantém o path completo)
  const currentDir = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath
  return `${currentDir}/${href}`
}

const localizedPath = computed(() => {
  const resolvedPath = resolveRelativePath(props.href)
  return localePath(resolvedPath)
})

const prebuiltViewerPath = computed(() => {
  // Não alterar o path — já contém locale e query correta
  return props.href
})

const fileViewerPath = computed(() => {
  const resolvedPath = resolveRelativePath(props.href)
  // Create a special viewer route with the file path as a parameter
  return localePath(`/docs/viewer?file=${encodeURIComponent(resolvedPath)}`)
})

const getFileIcon = () => {
  const resolvedPath = isPrebuiltViewerLink.value ? props.href : resolveRelativePath(props.href)
  const extensionMatch = resolvedPath.match(/\.(yaml|yml|txt|json)/i)
  const extension = extensionMatch?.[1]?.toLowerCase()
  
  switch (extension) {
    case 'yaml':
    case 'yml':
      return 'i-heroicons-document-text'
    case 'txt':
      return 'i-heroicons-document'
    case 'json':
      return 'i-heroicons-code-bracket'
    default:
      return 'i-heroicons-document'
  }
}

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