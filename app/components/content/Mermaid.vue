<template>
  <div class="mermaid-container my-8">
    <div 
      v-if="error" 
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
    >
      <div class="flex items-center mb-2">
        <svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <h4 class="text-red-800 dark:text-red-200 font-semibold">Erro no Diagrama Mermaid</h4>
      </div>
      <p class="text-red-700 dark:text-red-300 text-sm">{{ error }}</p>
    </div>
    
    <div 
      v-else-if="loading" 
      class="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg"
    >
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span class="ml-3 text-gray-600 dark:text-gray-400">Carregando diagrama...</span>
    </div>
    
    <div 
      v-else 
      ref="mermaidContainer"
      class="mermaid-diagram flex justify-center items-center p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto"
      v-html="renderedSvg"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useColorMode } from '@vueuse/core'

// Props
const props = defineProps({
  definition: {
    type: String,
    required: true
  },
  id: {
    type: String,
    default: () => `mermaid-${Math.random().toString(36).substr(2, 9)}`
  }
})

// Reactive data
const mermaidContainer = ref(null)
const renderedSvg = ref('')
const loading = ref(true)
const error = ref('')

// Color mode
const colorMode = useColorMode()

// Nuxt plugin access
const { $mermaid } = useNuxtApp()

// Render mermaid diagram
const renderDiagram = async () => {
  if (!$mermaid || !props.definition.trim()) {
    error.value = 'Mermaid não disponível ou definição vazia'
    loading.value = false
    return
  }

  try {
    loading.value = true
    error.value = ''

    // Update theme based on current color mode
    $mermaid.updateTheme(colorMode.value === 'dark')

    // Clear previous content
    renderedSvg.value = ''

    await nextTick()

    // Render the diagram
    const result = await $mermaid.render(props.id, props.definition.trim())
    
    if (result && result.svg) {
      renderedSvg.value = result.svg
      
      // Execute bind functions if available
      if (result.bindFunctions) {
        await nextTick()
        result.bindFunctions(mermaidContainer.value)
      }
    } else {
      throw new Error('Falha ao gerar SVG do diagrama')
    }
  } catch (err) {
    console.error('Mermaid render error:', err)
    error.value = err.message || 'Erro desconhecido ao renderizar diagrama'
  } finally {
    loading.value = false
  }
}

// Watch for definition changes
watch(() => props.definition, renderDiagram, { immediate: false })

// Watch for color mode changes
watch(() => colorMode.value, renderDiagram)

// Initialize on mount
onMounted(() => {
  if (import.meta.client) {
    renderDiagram()
  }
})
</script>

<style scoped>
.mermaid-container {
  width: 100%;
  overflow-x: auto;
}

.mermaid-diagram {
  min-height: 200px;
}

/* Ensure Mermaid SVG is responsive */
.mermaid-diagram :deep(svg) {
  max-width: 100%;
  height: auto;
}

/* Style Mermaid elements for better Matrix Protocol integration */
.mermaid-diagram :deep(.node rect),
.mermaid-diagram :deep(.node circle),
.mermaid-diagram :deep(.node ellipse),
.mermaid-diagram :deep(.node polygon) {
  transition: all 0.2s ease;
}

.mermaid-diagram :deep(.node:hover rect),
.mermaid-diagram :deep(.node:hover circle),
.mermaid-diagram :deep(.node:hover ellipse),
.mermaid-diagram :deep(.node:hover polygon) {
  filter: brightness(1.1);
}

/* Improve text readability */
.mermaid-diagram :deep(text) {
  font-family: 'Source Code Pro', monospace !important;
}

/* Loading and error states */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>