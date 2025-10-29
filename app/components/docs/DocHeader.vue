<template>
  <div class="bg-slate-matrix-700 dark:bg-slate-matrix-700 border-b border-slate-matrix-600 dark:border-slate-matrix-600">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <UIcon :name="icon" class="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 class="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
            {{ title }}
          </h1>
        </div>
        
        <!-- Mobile Breadcrumb Navigation -->
        <nav class="relative" aria-label="Breadcrumb">
          <!-- Mobile Layout (sm and below) -->
          <div class="lg:hidden">
            <!-- Back Button + Current Page -->
            <div class="flex items-center space-x-2 text-sm">
              <UButton
                v-if="parentBreadcrumb"
                :to="parentBreadcrumb.to"
                variant="ghost"
                size="sm"
                icon="i-heroicons-arrow-left"
                class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white min-h-[44px] px-3"
                :aria-label="`Voltar para ${parentBreadcrumb.label}`"
              >
                <span class="hidden sm:inline">{{ parentBreadcrumb.label }}</span>
              </UButton>
              
              <!-- Breadcrumb Dropdown for Mobile -->
              <div class="relative" v-if="breadcrumbs.length > 2">
                <UButton
                  @click="showMobileBreadcrumb = !showMobileBreadcrumb"
                  variant="ghost"
                  size="sm"
                  icon="i-heroicons-ellipsis-horizontal"
                  class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white min-h-[44px] px-3"
                  :aria-label="'Mostrar caminho completo'"
                  :aria-expanded="showMobileBreadcrumb"
                />
                
                <!-- Mobile Breadcrumb Dropdown -->
                <Transition
                  enter-active-class="transition duration-100 ease-out"
                  enter-from-class="transform scale-95 opacity-0"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-75 ease-in"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0"
                >
                  <div
                    v-if="showMobileBreadcrumb"
                    class="absolute right-0 top-12 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-600 py-2 z-50"
                    @click="showMobileBreadcrumb = false"
                  >
                    <div class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Caminho Completo
                    </div>
                    <template v-for="(crumb, index) in breadcrumbs" :key="index">
                      <UButton
                        v-if="crumb.to"
                        :to="crumb.to"
                        variant="ghost"
                        size="sm"
                        class="w-full justify-start text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 min-h-[44px]"
                      >
                        <div class="flex items-center space-x-2">
                          <div class="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full" :style="`margin-left: ${index * 12}px`"></div>
                          <span>{{ crumb.label }}</span>
                        </div>
                      </UButton>
                      <div 
                        v-else
                        class="w-full px-3 py-2 text-gray-900 dark:text-white font-medium min-h-[44px] flex items-center"
                      >
                        <div class="flex items-center space-x-2">
                          <div class="w-2 h-2 bg-blue-500 rounded-full" :style="`margin-left: ${index * 12}px`"></div>
                          <span>{{ crumb.label }}</span>
                        </div>
                      </div>
                    </template>
                  </div>
                </Transition>
              </div>
              
              <!-- Current Page Name -->
              <span class="text-gray-900 dark:text-white font-medium text-sm truncate max-w-[150px] sm:max-w-[200px]">
                {{ currentPageName }}
              </span>
            </div>
          </div>

          <!-- Desktop Layout (lg and above) -->
          <div class="hidden lg:flex items-center space-x-2 text-sm">
            <template v-for="(crumb, index) in breadcrumbs" :key="index">
              <UButton
                v-if="crumb.to"
                :to="crumb.to"
                variant="ghost"
                size="sm"
                icon="i-heroicons-home"
                class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                {{ crumb.label }}
              </UButton>
              <span 
                v-else
                class="text-gray-600 dark:text-gray-300"
              >
                {{ crumb.label }}
              </span>
              
              <UIcon 
                v-if="index < breadcrumbs.length - 1"
                name="i-heroicons-chevron-right" 
                class="w-4 h-4 text-gray-400" 
              />
            </template>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'i-heroicons-book-open'
  },
  breadcrumbs: {
    type: Array,
    default: () => []
  }
})

// Mobile breadcrumb state
const showMobileBreadcrumb = ref(false)

// Computed properties for mobile navigation
const currentPageName = computed(() => {
  if (props.breadcrumbs.length === 0) return props.title
  const lastCrumb = props.breadcrumbs[props.breadcrumbs.length - 1]
  return lastCrumb.label || props.title
})

const parentBreadcrumb = computed(() => {
  if (props.breadcrumbs.length < 2) return null
  return props.breadcrumbs[props.breadcrumbs.length - 2]
})

// Close mobile dropdown when clicking outside
onMounted(() => {
  const handleClickOutside = (event) => {
    if (showMobileBreadcrumb.value) {
      const dropdown = event.target.closest('.relative')
      if (!dropdown) {
        showMobileBreadcrumb.value = false
      }
    }
  }
  
  const handleEscape = (event) => {
    if (event.key === 'Escape' && showMobileBreadcrumb.value) {
      showMobileBreadcrumb.value = false
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>