<template>
  <div class="yaml-viewer">
    <!-- Header with file info -->
    <div class="flex items-center justify-between mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
      <div class="flex items-center gap-3">
        <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">{{ title || filename }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('viewer.document.yamlDocument') }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          variant="ghost"
          size="sm"
          icon="i-heroicons-eye"
          @click="toggleView"
        >
          {{ isRawView ? t('viewer.buttons.formatted') : t('viewer.buttons.raw') }}
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

    <!-- Content display -->
    <div class="border rounded-lg overflow-hidden">
      <!-- Raw YAML view with syntax highlighting -->
      <div v-if="isRawView" class="relative">
        <UButton
          variant="ghost"
          size="xs"
          icon="i-heroicons-clipboard"
          class="absolute top-2 right-2 z-10"
          @click="copyToClipboard"
          :title="t('viewer.buttons.copy')"
        />
        <pre class="language-yaml"><code class="language-yaml" v-html="highlightedContent"></code></pre>
      </div>

      <!-- Structured view (for UKI files) -->
      <div v-else-if="isUKI" class="p-6 space-y-6">
        <!-- UKI Header -->
        <div class="border-b pb-4">
          <div class="flex items-start justify-between">
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ data?.title || data?.id }}
              </h2>
              <div class="flex items-center gap-3 mt-3 flex-wrap">
                <!-- Type Badge -->
                <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium" :class="getTypeClasses(data?.type_ref)">
                  <UIcon name="i-heroicons-tag" class="w-4 h-4" />
                  {{ t(`viewer.types.${data?.type_ref}`) || data?.type_ref }}
                </div>
                
                <!-- Status Badge -->
                <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium" :class="getStatusClasses(data?.maturity_ref)">
                  <UIcon name="i-heroicons-shield-check" class="w-4 h-4" />
                  {{ t(`viewer.status.${data?.maturity_ref}`) || data?.maturity_ref }}
                </div>
                
                <!-- Version Badge -->
                <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                  <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                  v{{ data?.version }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Technical Information Section -->
        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">{{ t('viewer.sections.technicalInfo') }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <!-- Schema & Ontology -->
            <div v-if="data?.schema">
              <label class="font-medium text-gray-700 dark:text-gray-300">{{ t('viewer.fields.schema') }}:</label>
              <span class="text-gray-600 dark:text-gray-400 ml-2">{{ data?.schema }}</span>
            </div>
            <div v-if="data?.ontology_reference">
              <label class="font-medium text-gray-700 dark:text-gray-300">{{ t('viewer.fields.ontologyReference') }}:</label>
              <span class="text-gray-600 dark:text-gray-400 ml-2">{{ data?.ontology_reference }}</span>
            </div>
            
            <!-- ID and Scope -->
            <div v-if="data?.id" class="md:col-span-2">
              <label class="font-medium text-gray-700 dark:text-gray-300">{{ t('viewer.fields.id') }}:</label>
              <span class="text-gray-600 dark:text-gray-400 ml-2 font-mono text-xs">{{ data?.id }}</span>
            </div>
            <div v-if="data?.scope_ref">
              <label class="font-medium text-gray-700 dark:text-gray-300">{{ t('viewer.fields.scopeRef') }}:</label>
              <span class="text-gray-600 dark:text-gray-400 ml-2">{{ data?.scope_ref }}</span>
            </div>
            <div v-if="data?.scope_mode">
              <label class="font-medium text-gray-700 dark:text-gray-300">{{ t('viewer.fields.scopeMode') }}:</label>
              <span class="inline-flex items-center gap-1 ml-2">
                <UBadge :color="getScopeModeColor(data?.scope_mode)" size="xs">
                  {{ t(`viewer.scopeModes.${data?.scope_mode}`) || data?.scope_mode }}
                </UBadge>
              </span>
            </div>
            
            <!-- Domain -->
            <div v-if="data?.domain_ref">
              <label class="font-medium text-gray-700 dark:text-gray-300">{{ t('viewer.fields.domainRef') }}:</label>
              <span class="text-gray-600 dark:text-gray-400 ml-2">{{ data?.domain_ref }}</span>
            </div>
            <div v-if="data?.domain_of_influence">
              <label class="font-medium text-gray-700 dark:text-gray-300">{{ t('viewer.fields.domainOfInfluence') }}:</label>
              <span class="text-gray-600 dark:text-gray-400 ml-2">{{ data?.domain_of_influence }}</span>
            </div>
          </div>
        </div>

        <!-- Lifecycle Information Section -->
        <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">{{ t('viewer.sections.lifecycle') }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <!-- Dates -->
            <div v-if="data?.created_date">
              <label class="font-medium text-gray-700 dark:text-gray-300">{{ t('viewer.fields.createdDate') }}:</label>
              <span class="text-gray-600 dark:text-gray-400 ml-2">{{ formatDate(data?.created_date) }}</span>
            </div>
            <div v-if="data?.last_modified">
              <label class="font-medium text-gray-700 dark:text-gray-300">{{ t('viewer.fields.lastModified') }}:</label>
              <span class="text-gray-600 dark:text-gray-400 ml-2">{{ formatDate(data?.last_modified) }}</span>
            </div>
            
            <!-- Changes -->
            <div v-if="data?.change_summary" class="md:col-span-2">
              <label class="font-medium text-gray-700 dark:text-gray-300">{{ t('viewer.fields.changeSummary') }}:</label>
              <p class="text-gray-600 dark:text-gray-400 mt-1">{{ data?.change_summary }}</p>
            </div>
            <div v-if="data?.change_impact">
              <label class="font-medium text-gray-700 dark:text-gray-300">{{ t('viewer.fields.changeImpact') }}:</label>
              <span class="inline-flex items-center gap-1 ml-2">
                <UBadge :color="getChangeImpactColor(data?.change_impact)" size="xs">
                  {{ t(`viewer.changeImpacts.${data?.change_impact}`) || data?.change_impact }}
                </UBadge>
              </span>
            </div>
            <div v-if="data?.status">
              <label class="font-medium text-gray-700 dark:text-gray-300">{{ t('viewer.fields.status') }}:</label>
              <span class="inline-flex items-center gap-1 ml-2">
                <UBadge :color="getDocumentStatusColor(data?.status)" size="xs">
                  {{ t(`viewer.documentStatus.${data?.status}`) || data?.status }}
                </UBadge>
              </span>
            </div>
          </div>
        </div>

        <!-- UKI Content -->
        <div v-if="data?.content" class="prose dark:prose-invert max-w-none">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">{{ t('viewer.sections.content') }}</h3>
          <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div v-html="parseMarkdownContent(data?.content)"></div>
          </div>
        </div>
        
        <!-- Fallback for missing content -->
        <div v-else-if="!data?.content" class="text-sm text-gray-500 dark:text-gray-400 italic">
          {{ t('viewer.messages.noContent') }}
        </div>

        <!-- UKI Metadata -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Examples -->
          <div v-if="data?.examples && data?.examples.length > 0">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">{{ t('viewer.sections.examples') }}</h3>
            <div class="space-y-3">
              <div v-for="(example, index) in data?.examples" :key="index" 
                   class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Input:</div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ example.input }}</div>
                <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Output:</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">{{ example.output }}</div>
              </div>
            </div>
          </div>

          <!-- Relationships -->
          <div v-if="data?.relationships && data?.relationships.length > 0">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">{{ t('viewer.sections.relationships') }}</h3>
            <div class="space-y-2">
              <div v-for="(rel, index) in data?.relationships" :key="index"
                   class="flex items-center gap-2 text-sm">
                <UBadge :variant="getRelationshipVariant(rel.type)" size="xs">
                  {{ rel.type }}
                </UBadge>
                <span class="text-gray-600 dark:text-gray-400">{{ rel.target }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Generic structured view for other YAML files -->
      <div v-else class="p-6">
        <pre class="language-yaml"><code class="language-yaml" v-html="highlightedContent"></code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'

interface Props {
  content: string
  filename?: string
  title?: string
  data?: Record<string, any>
}

const props = defineProps<Props>()
const { t } = useI18n()

// Configure marked for safe HTML output
marked.setOptions({
  breaks: true,
  gfm: true
})

// State
const isRawView = ref(true)

// Computed
const isUKI = computed(() => {
  return props.data?.schema && props.data?.id?.startsWith('uki:')
})

const highlightedContent = computed(() => {
  // This would need a proper syntax highlighter
  // For now, return the raw content
  return props.content
})

// Methods
const toggleView = () => {
  isRawView.value = !isRawView.value
}

const downloadFile = () => {
  const blob = new Blob([props.content], { type: 'application/x-yaml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = props.filename || 'document.yaml'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.content)
    // TODO: Show toast notification
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
  }
}

const parseMarkdownContent = (content: string) => {
  try {
    // Parse markdown to HTML using marked
    return marked.parse(content)
  } catch (error) {
    console.error('Failed to parse markdown content:', error)
    // Fallback to plain text with line breaks
    return content.replace(/\n/g, '<br>')
  }
}

const getTypeClasses = (type?: string) => {
  const typeClasses: Record<string, string> = {
    business_rule: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    technical_pattern: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
    procedure: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    pattern: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300'
  }
  return typeClasses[type || ''] || 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
}

const getStatusClasses = (status?: string) => {
  const statusClasses: Record<string, string> = {
    validated: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    endorsed: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300',
    approved: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300',
    draft: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
    active: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    deprecated: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    archived: 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
  }
  return statusClasses[status || ''] || 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
}

const getRelationshipVariant = (type: string): "solid" | "outline" | "soft" | "subtle" => {
  const variants: Record<string, "solid" | "outline" | "soft" | "subtle"> = {
    depends_on: 'outline',
    implements: 'solid',
    overrides: 'soft',
    conflicts_with: 'solid',
    complements: 'subtle'
  }
  return variants[type] || 'outline'
}

const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    const { locale } = useI18n()
    return date.toLocaleDateString(locale.value === 'pt' ? 'pt-BR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    return dateString
  }
}

const getScopeModeColor = (mode?: string): "neutral" | "primary" | "secondary" | "success" | "info" | "warning" | "error" => {
  const colors: Record<string, "neutral" | "primary" | "secondary" | "success" | "info" | "warning" | "error"> = {
    restricted: 'warning',
    propagated: 'success'
  }
  return colors[mode || ''] || 'neutral'
}

const getChangeImpactColor = (impact?: string): "neutral" | "primary" | "secondary" | "success" | "info" | "warning" | "error" => {
  const colors: Record<string, "neutral" | "primary" | "secondary" | "success" | "info" | "warning" | "error"> = {
    major: 'error',
    minor: 'warning',
    patch: 'success'
  }
  return colors[impact || ''] || 'neutral'
}

const getDocumentStatusColor = (status?: string): "neutral" | "primary" | "secondary" | "success" | "info" | "warning" | "error" => {
  const colors: Record<string, "neutral" | "primary" | "secondary" | "success" | "info" | "warning" | "error"> = {
    active: 'success',
    deprecated: 'error',
    archived: 'neutral',
    draft: 'warning'
  }
  return colors[status || ''] || 'primary'
}
</script>

<style scoped>
.yaml-viewer pre {
  background-color: rgb(17 24 39); /* bg-gray-900 */
  color: rgb(243 244 246); /* text-gray-100 */
  padding: 1rem; /* p-4 */
  border-radius: 0.5rem; /* rounded-lg */
  overflow-x: auto; /* overflow-x-auto */
  font-size: 0.875rem; /* text-sm */
  line-height: 1.25rem;
}

.yaml-viewer .language-yaml {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Inconsolata, "Liberation Mono", "Courier New", monospace; /* font-mono */
}
</style>