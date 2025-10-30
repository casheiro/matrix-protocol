<template>
  <div class="mermaid-container my-8">
    <div 
      v-if="error" 
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
    >
      <div class="flex items-center mb-2">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-red-500 mr-2" />
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
      class="mermaid-diagram group relative p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200"
      @click="openModal"
    >
      <!-- Zoom indicator -->
      <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1 z-10">
        <UIcon name="i-heroicons-magnifying-glass-plus" class="w-3 h-3" />
        Clique para ampliar
      </div>
      
      <!-- SVG container -->
      <div 
        ref="mermaidContainer"
        class="flex justify-center items-center"
        v-html="renderedSvg"
      />
    </div>

    <!-- Custom Fullscreen Modal -->
    <Teleport to="body">
      <div 
        v-if="isModalOpen"
        class="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center"
        @click="closeModal"
      >
        <div 
          class="fixed inset-0 w-screen h-screen bg-white dark:bg-gray-900 flex flex-col"
          @click.stop
        >
          <!-- Header with Controls -->
          <div class="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 pr-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Diagrama Mermaid</h3>
              
              <!-- Zoom Controls -->
              <div class="flex items-center gap-2 pr-2">
                <UButton 
                  @click="zoomOut" 
                  :disabled="zoomLevel <= 0.5"
                  variant="outline" 
                  size="sm"
                  icon="i-heroicons-minus"
                />
                <span class="text-sm text-gray-600 dark:text-gray-400 min-w-16 text-center">{{ Math.round(zoomLevel * 100) }}%</span>
                <UButton 
                  @click="zoomIn" 
                  :disabled="zoomLevel >= 3"
                  variant="outline" 
                  size="sm"
                  icon="i-heroicons-plus"
                />
                <UButton 
                  @click="resetZoom" 
                  variant="outline" 
                  size="sm"
                  icon="i-heroicons-arrow-path"
                />
                <UButton 
                  @click="closeModal" 
                  variant="outline" 
                  size="sm"
                  icon="i-heroicons-x-mark"
                />
              </div>
            </div>
          </div>

          <!-- Modal Content -->
          <div 
            ref="modalContainer"
            class="flex-1 overflow-hidden relative bg-white dark:bg-gray-900"
            @wheel.prevent="handleWheel"
            @mousedown="startPan"
            @mousemove="handlePan"
            @mouseup="endPan"
            @mouseleave="endPan"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
          >
            <div 
              ref="modalDiagram"
              class="w-full h-full flex items-center justify-center"
              :style="{ 
                transform: `translate(${panX}px, ${panY}px) scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: isPanning ? 'none' : 'transform 0.2s ease-out'
              }"
            >
              <!-- SVG container - using same technique that works -->
              <div 
                ref="svgContainer" 
                class="mermaid-modal-svg w-full h-full flex items-center justify-center"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue'
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
const modalContainer = ref(null)
const modalDiagram = ref(null)
const svgContainer = ref(null)
const renderedSvg = ref('')
const loading = ref(true)
const error = ref('')

// Modal state
const isModalOpen = ref(false)
const zoomLevel = ref(1)
const panX = ref(0)
const panY = ref(0)
const isPanning = ref(false)
const lastPanPoint = ref({ x: 0, y: 0 })

// Touch state
const touches = ref([])
const initialDistance = ref(0)
const initialZoom = ref(1)

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

// Modal functions
const openModal = async () => {
  isModalOpen.value = true
  resetZoom()
  
  // Inject SVG using the exact same technique that works in debug
  await nextTick()
  setTimeout(() => {
    if (svgContainer.value && renderedSvg.value) {
      // Apply the working innerHTML technique
      svgContainer.value.innerHTML = renderedSvg.value
      
      // Ensure SVG is properly styled for modal
      const svg = svgContainer.value.querySelector('svg')
      if (svg) {
        svg.style.maxWidth = 'none'
        svg.style.maxHeight = 'none'
        svg.style.width = 'auto'
        svg.style.height = 'auto'
      }
    }
  }, 100)
}

const closeModal = () => {
  isModalOpen.value = false
  resetZoom()
  
  // Clear SVG content when closing modal
  if (svgContainer.value) {
    svgContainer.value.innerHTML = ''
  }
}

const zoomIn = () => {
  zoomLevel.value = Math.min(zoomLevel.value + 0.25, 3)
}

const zoomOut = () => {
  zoomLevel.value = Math.max(zoomLevel.value - 0.25, 0.5)
}

const resetZoom = () => {
  zoomLevel.value = 1
  panX.value = 0
  panY.value = 0
}

// Pan functionality
const startPan = (event) => {
  if (event.button === 0) { // Only left mouse button
    isPanning.value = true
    lastPanPoint.value = { x: event.clientX, y: event.clientY }
  }
}

const handlePan = (event) => {
  if (isPanning.value) {
    const deltaX = event.clientX - lastPanPoint.value.x
    const deltaY = event.clientY - lastPanPoint.value.y
    
    panX.value += deltaX
    panY.value += deltaY
    
    lastPanPoint.value = { x: event.clientX, y: event.clientY }
  }
}

const endPan = () => {
  isPanning.value = false
}

// Mouse wheel zoom
const handleWheel = (event) => {
  const delta = event.deltaY > 0 ? -0.1 : 0.1
  const newZoom = zoomLevel.value + delta
  
  if (newZoom >= 0.5 && newZoom <= 3) {
    zoomLevel.value = newZoom
  }
}

// Touch functionality
const getDistance = (touch1, touch2) => {
  const dx = touch1.clientX - touch2.clientX
  const dy = touch1.clientY - touch2.clientY
  return Math.sqrt(dx * dx + dy * dy)
}

const handleTouchStart = (event) => {
  event.preventDefault()
  touches.value = Array.from(event.touches)
  
  if (touches.value.length === 2) {
    // Pinch gesture start
    initialDistance.value = getDistance(touches.value[0], touches.value[1])
    initialZoom.value = zoomLevel.value
  } else if (touches.value.length === 1) {
    // Pan gesture start
    isPanning.value = true
    lastPanPoint.value = { x: touches.value[0].clientX, y: touches.value[0].clientY }
  }
}

const handleTouchMove = (event) => {
  event.preventDefault()
  const currentTouches = Array.from(event.touches)
  
  if (currentTouches.length === 2 && touches.value.length === 2) {
    // Pinch zoom
    const currentDistance = getDistance(currentTouches[0], currentTouches[1])
    const scale = currentDistance / initialDistance.value
    const newZoom = initialZoom.value * scale
    
    if (newZoom >= 0.5 && newZoom <= 3) {
      zoomLevel.value = newZoom
    }
  } else if (currentTouches.length === 1 && isPanning.value) {
    // Pan
    const deltaX = currentTouches[0].clientX - lastPanPoint.value.x
    const deltaY = currentTouches[0].clientY - lastPanPoint.value.y
    
    panX.value += deltaX
    panY.value += deltaY
    
    lastPanPoint.value = { x: currentTouches[0].clientX, y: currentTouches[0].clientY }
  }
}

const handleTouchEnd = (event) => {
  event.preventDefault()
  touches.value = Array.from(event.touches)
  
  if (touches.value.length === 0) {
    isPanning.value = false
  }
}

// Keyboard shortcuts
const handleKeyboard = (event) => {
  if (!isModalOpen.value) return
  
  switch (event.key) {
    case 'Escape':
      event.preventDefault()
      closeModal()
      break
    case '+':
    case '=':
      event.preventDefault()
      zoomIn()
      break
    case '-':
      event.preventDefault()
      zoomOut()
      break
    case '0':
      event.preventDefault()
      resetZoom()
      break
  }
}

// Initialize on mount
onMounted(() => {
  if (import.meta.client) {
    renderDiagram()
    document.addEventListener('keydown', handleKeyboard)
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (import.meta.client) {
    document.removeEventListener('keydown', handleKeyboard)
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

/* Modal SVG styling */
.mermaid-modal-svg :deep(svg) {
  max-width: none !important;
  max-height: none !important;
  width: auto !important;
  height: auto !important;
}

/* Ensure modal content is visible */
.mermaid-modal-svg {
  display: flex;
  align-items: center;
  justify-content: center;
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