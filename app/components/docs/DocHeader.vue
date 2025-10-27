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
        
        <!-- Breadcrumb Navigation -->
        <nav class="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
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
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
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
</script>