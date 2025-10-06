<template>
  <h3 
    :id="id" 
    class="scroll-m-20 text-2xl font-semibold tracking-tight mt-6 mb-3 text-gray-900 dark:text-white"
  >
    <slot />
  </h3>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: undefined
  }
})
</script>