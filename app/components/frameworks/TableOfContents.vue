<template>
  <div class="table-of-contents bg-slate-matrix-700 rounded-lg border border-slate-matrix-600 p-4">
    <div class="toc-header mb-4">
      <h3 class="toc-title text-sm font-semibold text-white">
        {{ $t('frameworks.tableOfContents') }}
      </h3>
    </div>

    <nav
      role="navigation"
      aria-label="Table of Contents"
      class="toc-nav max-h-96 overflow-y-auto"
      @keydown="handleKeydown"
    >
      <ol role="list" class="toc-list space-y-1">
        <li
          v-for="heading in headings"
          :key="heading.id"
          role="listitem"
          :class="getTocItemClass(heading)"
        >
          <UButton
            variant="ghost"
            size="xs"
            :class="getTocLinkClass(heading)"
            @click="scrollToHeading(heading.id)"
            @keydown.stop
            :aria-current="activeHeading === heading.id ? 'location' : null"
            :title="`Ir para ${heading.text}`"
            block
            justify="start"
          >
            <span :class="getTocTextClass(heading.level)">
              {{ heading.text }}
            </span>
          </UButton>
        </li>
      </ol>
    </nav>

    <!-- Progress Indicator -->
    <div class="toc-progress mt-4 pt-4 border-t border-slate-matrix-600">
      <div class="flex items-center gap-2 text-xs text-gray-400">
        <UIcon name="i-heroicons-document-text" class="w-3 h-3" />
        <span>{{ readingProgress }}% lido</span>
      </div>
      <div class="mt-1 w-full bg-slate-matrix-600 rounded-full h-1">
        <div 
          class="bg-blue-500 h-1 rounded-full transition-all duration-300"
          :style="{ width: readingProgress + '%' }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface Heading {
  id: string
  level: number
  text: string
}

interface Props {
  headings: Heading[]
  activeHeading?: string
}

const props = withDefaults(defineProps<Props>(), {
  headings: () => [],
  activeHeading: ''
})

// Emits
const emit = defineEmits<{
  headingClick: [headingId: string]
}>()

// Reactive state
const readingProgress = ref(0)

// Methods
const scrollToHeading = (headingId: string) => {
  emit('headingClick', headingId)
  
  if (process.client) {
    const element = document.getElementById(headingId)
    if (element) {
      // Scroll with offset for fixed header
      const headerHeight = 80 // Approximate header height
      const elementPosition = element.offsetTop - headerHeight
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
      
      // Update URL without triggering navigation
      const url = new URL(window.location.href)
      url.hash = headingId
      window.history.replaceState(null, '', url)
      
      // Announce to screen readers
      announceToScreenReader(`Navegando para seção: ${element.textContent}`)
    }
  }
}

const announceToScreenReader = (message: string) => {
  if (process.client) {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }
}

// Styling helpers - converted from @apply to class strings
const getTocItemClass = (heading: Heading) => {
  const baseClass = 'list-none'
  return baseClass
}

const getTocLinkClass = (heading: Heading) => {
  const baseClasses = 'w-full px-2 py-1.5 rounded-md text-left transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 toc-link'
  
  const isActive = props.activeHeading === heading.id
  
  let stateClasses = ''
  if (isActive) {
    stateClasses = 'bg-blue-900/30 text-blue-400 font-medium'
  } else {
    stateClasses = 'text-gray-300 hover:text-white'
  }
  
  const hoverClasses = 'hover:bg-slate-matrix-600'
  
  return `${baseClasses} ${stateClasses} ${hoverClasses}`
}

const getTocTextClass = (level: number) => {
  const baseClass = 'line-clamp-2 text-left block'
  
  switch (level) {
    case 2:
      return `${baseClass} text-sm font-medium pl-0`
    case 3:
      return `${baseClass} text-sm pl-3`
    case 4:
      return `${baseClass} text-xs pl-6`
    case 5:
      return `${baseClass} text-xs pl-9 text-gray-400`
    case 6:
      return `${baseClass} text-xs pl-12 text-gray-400`
    default:
      return baseClass
  }
}

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  const currentTarget = event.currentTarget as HTMLElement
  const target = event.target as HTMLElement
  if (!currentTarget || !target) return
  
  const tocLinks = currentTarget.querySelectorAll('.toc-link') as NodeListOf<HTMLElement>
  const closestLink = target.closest('.toc-link') as HTMLElement | null
  const currentIndex = closestLink ? Array.from(tocLinks).indexOf(closestLink) : -1
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      const nextIndex = currentIndex < tocLinks.length - 1 ? currentIndex + 1 : 0
      tocLinks[nextIndex]?.focus()
      break
      
    case 'ArrowUp':
      event.preventDefault()
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : tocLinks.length - 1
      tocLinks[prevIndex]?.focus()
      break
      
    case 'Home':
      event.preventDefault()
      tocLinks[0]?.focus()
      break
      
    case 'End':
      event.preventDefault()
      tocLinks[tocLinks.length - 1]?.focus()
      break
      
    case 'Enter':
    case ' ':
      event.preventDefault()
      const target = event.target as HTMLElement
      const activeLink = target?.closest('.toc-link') as HTMLElement
      if (activeLink) {
        activeLink.click()
      }
      break
  }
}

// Reading progress calculation
const updateReadingProgress = () => {
  if (process.client) {
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrolled = window.scrollY
    const progress = documentHeight > 0 ? (scrolled / documentHeight) * 100 : 0
    readingProgress.value = Math.round(Math.min(100, Math.max(0, progress)))
  }
}

// Intersection Observer for active heading detection
let observer: IntersectionObserver | null = null

const setupIntersectionObserver = () => {
  if (process.client && props.headings.length > 0) {
    const options = {
      root: null,
      rootMargin: '-80px 0px -80% 0px', // Account for header and only trigger when in top 20%
      threshold: 0
    }
    
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          emit('headingClick', entry.target.id)
        }
      })
    }, options)
    
    // Observe all headings
    props.headings.forEach(heading => {
      const element = document.getElementById(heading.id)
      if (element && observer) {
        observer.observe(element)
      }
    })
  }
}

// Lifecycle
onMounted(() => {
  if (process.client) {
    // Set up scroll listener for reading progress
    window.addEventListener('scroll', updateReadingProgress, { passive: true })
    updateReadingProgress()
    
    // Set up intersection observer after a delay to ensure elements are rendered
    nextTick(() => {
      setTimeout(setupIntersectionObserver, 100)
    })
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('scroll', updateReadingProgress)
    
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }
})

// Watch for heading changes
watch(() => props.headings, () => {
  if (observer) {
    observer.disconnect()
  }
  nextTick(setupIntersectionObserver)
}, { deep: true })
</script>

<style scoped>
/* Line clamp utility for text truncation */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Screen reader only class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Custom scrollbar - keeping non-@apply styles */
.toc-nav::-webkit-scrollbar {
  width: 4px;
}

.toc-nav::-webkit-scrollbar-track {
  background-color: rgb(243 244 246);
  border-radius: 4px;
}

.dark .toc-nav::-webkit-scrollbar-track {
  background-color: rgb(71 85 105);
}

.toc-nav::-webkit-scrollbar-thumb {
  background-color: rgb(156 163 175);
  border-radius: 4px;
}

.dark .toc-nav::-webkit-scrollbar-thumb {
  background-color: rgb(100 116 139);
}

.toc-nav::-webkit-scrollbar-thumb:hover {
  background-color: rgb(107 114 128);
}

.dark .toc-nav::-webkit-scrollbar-thumb:hover {
  background-color: rgb(148 163 184);
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}
</style>