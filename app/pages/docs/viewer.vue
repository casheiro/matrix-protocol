<template>
  <div class="docs-page min-h-screen bg-slate-matrix-800 dark:bg-slate-matrix-800">
    <!-- Header with consistent DocHeader -->
    <DocHeader 
      :title="pageTitle"
      :description="pageDescription"
      :icon="pageIcon"
      :breadcrumbs="breadcrumbs"
    />

    <div class="container mx-auto px-4 py-8">
      <div v-if="pending" class="flex items-center justify-center py-12">
        <div class="text-center">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p class="text-gray-600 dark:text-gray-400">{{ $t('common.loading') || 'Loading document...' }}</p>
        </div>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 mx-auto mb-4 text-red-600" />
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ $t('viewer.messages.notFound') || 'Document Not Found' }}</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ $t('viewer.messages.notFoundDescription') || 'The requested document could not be loaded.' }}
        </p>
        <UButton
          :to="localePath('/docs')"
          icon="i-heroicons-arrow-left"
        >
          {{ $t('navigation.backToDocs') || 'Back to Documentation' }}
        </UButton>
      </div>

      <div v-else-if="fileData" class="max-w-6xl mx-auto">
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
  </div>
</template>

<script setup lang="ts">
import { parse as parseYaml } from 'yaml'
import DocHeader from '~/components/docs/DocHeader.vue'

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
const { t } = useI18n()

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

// DocHeader properties
const pageTitle = computed(() => {
  if (fileData.value?.title) {
    return fileData.value.title
  }
  return fileTitle.value || t('viewer.documentTitle') || 'Document'
})

const pageDescription = computed(() => {
  return t('viewer.documentDescription') || `View ${pageTitle.value} document`
})

const pageIcon = computed(() => {
  if (isYamlFile.value) return 'i-heroicons-document-text'
  if (isJsonFile.value) return 'i-heroicons-code-bracket'
  if (isTextFile.value) return 'i-heroicons-document'
  return 'i-heroicons-document'
})

// Helper function to translate breadcrumb segments
const translateSegment = (segment) => {
  // Try to get specific translation for the segment
  const specificTranslation = t(`navigation.breadcrumbSegments.${segment}`)
  
  // If translation exists and is different from the key, use it
  if (specificTranslation && specificTranslation !== `navigation.breadcrumbSegments.${segment}`) {
    return specificTranslation
  }
  
  // Fallback to automatic transformation
  return segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// Breadcrumbs for viewer
const breadcrumbs = computed(() => {
  const crumbs = [
    { label: t('navigation.home') || 'Home', to: localePath('/') },
    { label: t('navigation.protocol') || 'Documentation', to: localePath('/docs') }
  ]
  
  if (!filePath.value) return crumbs
  
  // Remove /docs prefix to avoid duplication since we start with /docs as base
  const cleanPath = filePath.value.replace(/^\/docs\//, '')
  const segments = cleanPath.split('/').filter(Boolean)
  let currentPath = '/docs'
  
  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1
    
    if (!isLast) {
      currentPath += `/${segment}`
      crumbs.push({
        label: translateSegment(segment),
        to: localePath(currentPath)
      })
    } else {
      // For the file itself, don't add a link
      const fileName = segment.replace(/\.(yaml|yml|txt|json)$/i, '').replace(/-/g, ' ')
      crumbs.push({
        label: fileName,
        to: null // Last item shouldn't be clickable
      })
    }
  })
  
  return crumbs
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