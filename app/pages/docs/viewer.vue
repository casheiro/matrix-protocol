<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="pending" class="flex items-center justify-center py-12">
      <div class="text-center">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p class="text-gray-600 dark:text-gray-400">Loading document...</p>
      </div>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 mx-auto mb-4 text-red-600" />
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Document Not Found</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        The requested document could not be loaded.
      </p>
      <UButton
        :to="localePath('/docs')"
        icon="i-heroicons-arrow-left"
      >
        Back to Documentation
      </UButton>
    </div>

    <div v-else-if="fileData" class="max-w-6xl mx-auto">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
        <NuxtLink :to="localePath('/docs')" class="hover:text-gray-900 dark:hover:text-white">
          Docs
        </NuxtLink>
        <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
        <template v-for="(segment, index) in pathSegments" :key="index">
          <NuxtLink 
            v-if="index < pathSegments.length - 1"
            :to="localePath(segment.path)" 
            class="hover:text-gray-900 dark:hover:text-white"
          >
            {{ segment.name }}
          </NuxtLink>
          <span v-else class="text-gray-900 dark:text-white font-medium">
            {{ segment.name }}
          </span>
          <UIcon v-if="index < pathSegments.length - 1" name="i-heroicons-chevron-right" class="w-4 h-4" />
        </template>
      </nav>

      <!-- File Viewer -->
      <YamlViewer 
        v-if="isYamlFile"
        :content="fileContent"
        :filename="filename"
        :title="fileTitle"
        :data="yamlData"
      />
      
      <TextViewer
        v-else-if="isTextFile || isJsonFile"
        :content="fileContent"
        :filename="filename"
        :title="fileTitle"
      />

      <div v-else class="text-center py-12">
        <UIcon name="i-heroicons-document" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ $t('viewer.messages.unsupportedFile') }}</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ $t('viewer.messages.unsupportedFile') }}
        </p>
        <UButton
          @click="downloadFile"
          icon="i-heroicons-arrow-down-tray"
          variant="outline"
        >
          {{ $t('viewer.messages.downloadFile') }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { parse as parseYaml } from 'yaml'

// Type definitions
interface FileContentResponse {
  content: string
  title: string | null
  path: string
  size: number
  type: string
}

// Get file parameter from query
const route = useRoute()
const localePath = useLocalePath()
const { $i18n } = useNuxtApp()

const filePath = computed(() => {
  return route.query.file as string
})

// Fetch file content
const { data: fileData, pending, error } = await useFetch<FileContentResponse>(`/api/file-content`, {
  query: {
    path: filePath,
    locale: $i18n.locale.value
  },
  // Allow SSR for better performance and SEO
  server: true,
  // Add proper error handling
  onResponseError({ response }) {
    console.error('[viewer] API Error:', response.status, response.statusText)
  }
})

// Computed properties
const filename = computed(() => {
  if (!filePath.value) return ''
  return filePath.value.split('/').pop() || ''
})

const fileTitle = computed(() => {
  if (!fileData.value?.title && !filename.value) return 'Document'
  return fileData.value?.title || filename.value.replace(/\.(yaml|yml|txt|json)$/i, '')
})

const fileContent = computed(() => {
  return fileData.value?.content || ''
})

const fileExtension = computed(() => {
  return filename.value.split('.').pop()?.toLowerCase() || ''
})

const isYamlFile = computed(() => {
  return ['yaml', 'yml'].includes(fileExtension.value)
})

const isTextFile = computed(() => {
  return ['txt'].includes(fileExtension.value)
})

const isJsonFile = computed(() => {
  return ['json'].includes(fileExtension.value)
})

const yamlData = computed(() => {
  if (!isYamlFile.value) return null
  try {
    return parseYaml(fileContent.value)
  } catch (error) {
    console.error('Failed to parse YAML:', error)
    return null
  }
})

interface PathSegment {
  name: string
  path: string
}

const pathSegments = computed(() => {
  if (!filePath.value) return []
  
  const segments = filePath.value.split('/').filter(Boolean)
  const result: PathSegment[] = []
  let currentPath = ''
  
  segments.forEach((segment, index) => {
    currentPath += '/' + segment
    
    // Don't include the file itself in breadcrumb links
    if (index < segments.length - 1) {
      result.push({
        name: segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        path: currentPath
      })
    } else {
      result.push({
        name: segment.replace(/\.(yaml|yml|txt|json)$/i, '').replace(/-/g, ' '),
        path: currentPath
      })
    }
  })
  
  return result
})

// Methods
const downloadFile = () => {
  if (!fileContent.value || !filename.value) return
  
  const blob = new Blob([fileContent.value], { 
    type: getContentType(fileExtension.value) 
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.value
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const getContentType = (extension: string) => {
  switch (extension) {
    case 'yaml':
    case 'yml':
      return 'application/x-yaml'
    case 'json':
      return 'application/json'
    case 'txt':
      return 'text/plain'
    default:
      return 'application/octet-stream'
  }
}

// SEO
const title = computed(() => `${fileTitle.value} | Matrix Protocol`)
const description = computed(() => `View ${fileTitle.value} document`)

useSeoMeta({
  title: title.value,
  description: description.value
})
</script>