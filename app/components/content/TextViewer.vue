<template>
  <div class="text-viewer">
    <!-- Header with file info -->
    <div class="flex items-center justify-between mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
      <div class="flex items-center gap-3">
        <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">{{ title || filename }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Text Document • {{ formatFileSize(content.length) }} • {{ lineCount }} lines
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          variant="ghost"
          size="sm"
          icon="i-heroicons-magnifying-glass"
          @click="toggleSearch"
        >
          {{ t('viewer.buttons.search') }}
        </UButton>
        <UButton
          variant="outline"
          size="sm"
          icon="i-heroicons-arrow-down-tray"
          @click="downloadFile"
        >
          {{ t('viewer.buttons.download') }}
        </UButton>
      </div>
    </div>

    <!-- Search bar -->
    <div v-if="showSearch" class="mb-4">
      <UInput
        v-model="searchTerm"
        placeholder="Search in document..."
        icon="i-heroicons-magnifying-glass"
        size="sm"
        class="max-w-sm"
        @input="highlightSearch"
      />
      <div v-if="searchTerm && searchResults.length > 0" class="text-sm text-gray-600 dark:text-gray-400 mt-2">
        {{ searchResults.length }} result{{ searchResults.length !== 1 ? 's' : '' }} found
      </div>
    </div>

    <!-- Content display -->
    <div class="border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
      <div class="flex">
        <!-- Line numbers -->
        <div class="bg-gray-50 dark:bg-gray-800 px-3 py-4 text-xs text-gray-500 dark:text-gray-400 font-mono select-none border-r">
          <div v-for="(line, index) in contentLines" :key="index" class="leading-6">
            {{ (index + 1).toString().padStart(3, ' ') }}
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-x-auto">
          <pre class="p-4 text-sm font-mono text-gray-800 dark:text-gray-200 leading-6 whitespace-pre-wrap"><code v-html="highlightedContent"></code></pre>
        </div>
      </div>
    </div>

    <!-- File metadata (for specific file types) -->
    <div v-if="showMetadata" class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h4 class="font-medium text-gray-900 dark:text-white mb-2">{{ t('viewer.sections.metadata') }}</h4>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div>
          <div class="text-gray-500 dark:text-gray-400">Type</div>
          <div class="font-medium">{{ getDocumentType() }}</div>
        </div>
        <div>
          <div class="text-gray-500 dark:text-gray-400">{{ t('viewer.document.lines') }}</div>
          <div class="font-medium">{{ lineCount }}</div>
        </div>
        <div>
          <div class="text-gray-500 dark:text-gray-400">{{ t('viewer.document.characters') }}</div>
          <div class="font-medium">{{ content.length.toLocaleString() }}</div>
        </div>
        <div>
          <div class="text-gray-500 dark:text-gray-400">{{ t('viewer.document.words') }}</div>
          <div class="font-medium">{{ wordCount.toLocaleString() }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  content: string
  filename?: string
  title?: string
  showMetadata?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showMetadata: true
})

const { t } = useI18n()

// State
const showSearch = ref(false)
const searchTerm = ref('')
const searchResults = ref<{ line: number; text: string }[]>([])

// Computed
const contentLines = computed(() => {
  return props.content.split('\n')
})

const lineCount = computed(() => {
  return contentLines.value.length
})

const wordCount = computed(() => {
  return props.content.split(/\s+/).filter(word => word.length > 0).length
})

const highlightedContent = computed(() => {
  if (!searchTerm.value) {
    return escapeHtml(props.content)
  }

  // Highlight search terms
  const escaped = escapeHtml(props.content)
  const regex = new RegExp(`(${escapeRegExp(searchTerm.value)})`, 'gi')
  return escaped.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-600">$1</mark>')
})

// Methods
const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (!showSearch.value) {
    searchTerm.value = ''
    searchResults.value = []
  }
}

const highlightSearch = () => {
  if (!searchTerm.value) {
    searchResults.value = []
    return
  }

  const results: { line: number; text: string }[] = []
  const regex = new RegExp(escapeRegExp(searchTerm.value), 'gi')
  
  contentLines.value.forEach((line, index) => {
    if (regex.test(line)) {
      results.push({
        line: index + 1,
        text: line.trim()
      })
    }
  })
  
  searchResults.value = results
}

const downloadFile = () => {
  const blob = new Blob([props.content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = props.filename || 'document.txt'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const getDocumentType = () => {
  if (props.filename?.includes('slack')) return 'Slack Conversation'
  if (props.filename?.includes('meeting')) return 'Meeting Notes'
  if (props.filename?.includes('postmortem')) return 'Post-mortem Report'
  if (props.filename?.includes('email')) return 'Email Thread'
  if (props.filename?.includes('notes')) return 'Internal Notes'
  return 'Text Document'
}

const escapeHtml = (text: string) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
</script>

<style scoped>
.text-viewer pre {
  margin: 0; /* m-0 */
}

.text-viewer mark {
  padding-left: 0.25rem; /* px-1 */
  padding-right: 0.25rem; /* px-1 */
  border-radius: 0.25rem; /* rounded */
}
</style>