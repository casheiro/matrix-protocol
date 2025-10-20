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
        <!-- Search & Navigation -->
        <UInput
          v-model="searchQuery"
          :placeholder="t('viewer.search.placeholder') || 'Search in document'"
          size="sm"
          icon="i-heroicons-magnifying-glass"
          class="w-56"
        />
        <UButton
          variant="ghost"
          size="sm"
          icon="i-heroicons-chevron-up"
          :disabled="matchesCount === 0"
          @click="prevMatch"
          :title="t('viewer.search.previous') || 'Previous'"
        />
        <UButton
          variant="ghost"
          size="sm"
          icon="i-heroicons-chevron-down"
          :disabled="matchesCount === 0"
          @click="nextMatch"
          :title="t('viewer.search.next') || 'Next'"
        />
        <UBadge v-if="matchesCount > 0" color="primary" size="sm">{{ currentMatchDisplay }}</UBadge>
        <UButton
          v-if="debouncedQuery"
          variant="ghost"
          size="sm"
          icon="i-heroicons-x-mark"
          @click="clearSearch"
          :title="t('viewer.search.clear') || 'Clear'"
        />
        <!-- Section jump (top-level keys) -->
        <select v-if="sectionOptions.length" v-model="selectedSection" @change="onSectionChange" class="h-8 px-2 rounded border text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
          <option value="">{{ t('viewer.sections.jumpTo') || 'Jump to…' }}</option>
          <option v-for="opt in sectionOptions" :key="opt.id" :value="opt.id">{{ opt.label }}</option>
        </select>
        
        <!-- View toggle -->
        <UButton
          variant="ghost"
          size="sm"
          icon="i-heroicons-eye"
          @click="toggleView"
        >
          {{ isRawView ? t('viewer.buttons.formatted') : t('viewer.buttons.raw') }}
        </UButton>
        
        <!-- Copy viewer link -->
        <UButton
          variant="outline"
          size="sm"
          icon="i-heroicons-link"
          @click="copyViewerLink"
        >
          {{ t('viewer.buttons.copyLink') || 'Copy link' }}
        </UButton>
        
        <!-- Download file -->
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
        <pre class="language-yaml"><code ref="codeEl" class="language-yaml" v-html="highlightedContent"></code></pre>
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
import { nextTick } from 'vue'

interface Props {
  content: string
  filename?: string
  title?: string
  data?: Record<string, any>
}

const props = defineProps<Props>()
const { t } = useI18n()
const route = useRoute()

// Configure marked for safe HTML output
marked.setOptions({
  breaks: true,
  gfm: true
})

// State
const isRawView = ref(true)
const searchQuery = ref('')
const debouncedQuery = ref('')
let searchTimer: any = null
const matchesCount = ref(0)
const currentMatchIndex = ref(-1)
const codeEl = ref<HTMLElement | null>(null)

watch(searchQuery, (val) => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    debouncedQuery.value = val
  }, 200)
})

// Computed
const isUKI = computed(() => {
  return props.data?.schema && props.data?.id?.startsWith('uki:')
})

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function injectSectionAnchors(escaped: string) {
  const lines = escaped.split('\n')
  const processed = lines.map((line) => {
    const m = line.match(/^([A-Za-z][\w-]*):\s*/)
    if (m) {
      const id = `yaml-sec-${m[1]?.toLowerCase()}`
      return `<span id="${id}"></span>` + line
    }
    return line
  })
  return processed.join('\n')
}

const sectionOptions = computed(() => {
  const opts: { id: string; label: string }[] = []
  const seen = new Set<string>()
  const lines = (props.content || '').split('\n')
  for (const line of lines) {
    const m = line.match(/^([A-Za-z][\w-]*):\s*/)
    if (m) {
      const id = `yaml-sec-${m[1]?.toLowerCase()}`
      if (!seen.has(id)) {
        seen.add(id)
        opts.push({ id, label: m[1]! })
      }
    }
  }
  return opts
})

const selectedSection = ref('')
function onSectionChange() {
  if (!selectedSection.value) return
  const el = document.getElementById(selectedSection.value)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const highlightedContent = computed(() => {
  const raw = props.content || ''
  const escaped = escapeHtml(raw)
  let html = injectSectionAnchors(escaped)

  const q = (debouncedQuery.value || '').trim()
  if (!q) {
    matchesCount.value = 0
    currentMatchIndex.value = -1
    return html
  }
  const regex = new RegExp(escapeRegExp(q), 'gi')
  let count = 0
  html = html.replace(regex, (m) => {
    count++
    return `<mark class="yaml-highlight">${m}</mark>`
  })
  matchesCount.value = count
  if (count > 0 && currentMatchIndex.value < 0) currentMatchIndex.value = 0
  nextTick(() => scrollToCurrentMatch())
  return html
})

const currentMatchDisplay = computed(() => {
  return matchesCount.value > 0 ? `${currentMatchIndex.value + 1}/${matchesCount.value}` : '0/0'
})

function scrollToCurrentMatch() {
  const container = codeEl.value
  if (!container) return
  const marks = container.querySelectorAll('mark.yaml-highlight')
  if (!marks.length) return
  const index = Math.max(0, Math.min(currentMatchIndex.value, marks.length - 1))
  const el = marks[index] as HTMLElement
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

function nextMatch() {
  if (matchesCount.value === 0) return
  currentMatchIndex.value = (currentMatchIndex.value + 1) % matchesCount.value
  scrollToCurrentMatch()
}

function prevMatch() {
  if (matchesCount.value === 0) return
  currentMatchIndex.value = (currentMatchIndex.value - 1 + matchesCount.value) % matchesCount.value
  scrollToCurrentMatch()
}

function clearSearch() {
  searchQuery.value = ''
  debouncedQuery.value = ''
  matchesCount.value = 0
  currentMatchIndex.value = -1
}

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

const copyViewerLink = async () => {
  try {
    const href = (typeof window !== 'undefined') ? window.location.href : route.fullPath
    await navigator.clipboard.writeText(href)
    // Optionally: toast
  } catch (error) {
    console.error('Failed to copy viewer link:', error)
  }
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

mark.yaml-highlight {
  background-color: #fde68a; /* amber-200 */
  color: #1f2937; /* gray-800 */
  padding: 0 2px;
  border-radius: 2px;
}
</style>