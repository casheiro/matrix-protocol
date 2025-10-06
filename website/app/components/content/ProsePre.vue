<template>
  <!-- Render Mermaid diagram if language is mermaid -->
  <Mermaid 
    v-if="isMermaid" 
    :definition="codeContent"
    :id="`mermaid-${Math.random().toString(36).substr(2, 9)}`"
  />
  
  <!-- Render regular code block with syntax highlighting -->
  <div v-else class="relative group my-6" :class="containerClasses">
    <!-- Filename badge if provided -->
    <div 
      v-if="filename" 
      class="absolute -top-3 left-4 px-2 py-1 text-xs font-medium bg-gray-700 text-gray-100 rounded-t-md z-10"
    >
      {{ filename }}
    </div>
    
    <!-- Language badge if provided and no filename -->
    <div 
      v-if="!filename && language && language !== 'text'" 
      class="absolute -top-3 right-4 px-2 py-1 text-xs font-medium bg-gray-700 text-gray-100 rounded-t-md z-10"
    >
      {{ language }}
    </div>
    
    <!-- Code block with syntax highlighting -->
    <pre 
      class="overflow-x-auto rounded-lg border bg-gray-900 p-4"
      :class="{ 'pt-8': filename || language }"
    >
      <code 
        v-if="highlightedCode"
        v-html="highlightedCode"
        :class="languageClass"
        class="font-mono text-sm"
      />
      <code 
        v-else
        :class="languageClass"
        class="font-mono text-sm text-gray-100"
      ><slot /></code>
    </pre>
    
    <!-- Copy button -->
    <button
      v-if="codeContent || $slots.default"
      @click="copyCode"
      class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-gray-800 hover:bg-gray-700 rounded-md z-10"
      :title="copied ? 'Copiado!' : 'Copiar código'"
    >
      <svg v-if="!copied" class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      <svg v-else class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { createHighlighter } from 'shiki'

// Props
const props = defineProps({
  code: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: ''
  },
  filename: {
    type: String,
    default: ''
  },
  highlights: {
    type: Array,
    default: () => []
  },
  meta: {
    type: String,
    default: ''
  }
})

// State
const copied = ref(false)
const highlightedCode = ref('')
const highlighter = ref(null)

// Get code content from props or slot
const codeContent = computed(() => {
  // If code prop is provided, use it
  if (props.code) {
    return props.code
  }
  
  // Otherwise, try to get content from slot
  // This is a fallback for when content is provided via slot
  return ''
})

// Check if this is a Mermaid diagram
const isMermaid = computed(() => {
  return props.language && props.language.toLowerCase() === 'mermaid'
})

// Generate language class for syntax highlighting
const languageClass = computed(() => {
  const baseClasses = []
  
  if (props.language && !isMermaid.value) {
    baseClasses.push(`language-${props.language}`)
  }
  
  if (highlightedCode.value) {
    baseClasses.push('shiki', 'shiki-themes', 'github-dark')
  }
  
  return baseClasses.join(' ')
})

// Container classes for hydration compatibility
const containerClasses = computed(() => {
  const baseClasses = []
  
  if (props.language && !isMermaid.value) {
    baseClasses.push(`language-${props.language}`)
  }
  
  if (highlightedCode.value) {
    baseClasses.push('shiki', 'shiki-themes', 'github-dark')
  }
  
  return baseClasses.join(' ')
})

// Initialize Shiki highlighter
const initHighlighter = async () => {
  try {
    highlighter.value = await createHighlighter({
      themes: ['github-dark'],
      langs: ['yaml', 'javascript', 'typescript', 'bash', 'json', 'markdown', 'vue', 'css', 'html', 'text']
    })
    
    // Highlight the code if we have language and content
    await highlightCode()
  } catch (error) {
    console.error('Failed to initialize Shiki highlighter:', error)
  }
}

// Highlight code with Shiki
const highlightCode = async () => {
  if (!highlighter.value || !codeContent.value || !props.language || isMermaid.value) {
    return
  }
  
  try {
    const result = await highlighter.value.codeToHtml(codeContent.value, {
      lang: props.language,
      theme: 'github-dark'
    })
    
    // Extract just the code content without the pre wrapper
    const codeMatch = result.match(/<code[^>]*>([\s\S]*?)<\/code>/)
    if (codeMatch) {
      highlightedCode.value = codeMatch[1]
    }
  } catch (error) {
    console.error('Failed to highlight code:', error)
  }
}

// Copy code to clipboard
const copyCode = async () => {
  let textToCopy = codeContent.value
  
  if (!textToCopy) {
    // Fallback to getting text from DOM
    const codeElement = document.querySelector('.group pre code')
    textToCopy = codeElement?.textContent || ''
  }
  
  if (!textToCopy) return
  
  try {
    await navigator.clipboard.writeText(textToCopy)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy code:', err)
  }
}

// Initialize on mount (client-side only)
onMounted(() => {
  if (import.meta.client) {
    initHighlighter()
  }
})
</script>