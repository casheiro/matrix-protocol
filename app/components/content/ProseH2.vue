<template>
  <h2 
    :id="id" 
    class="scroll-m-20 text-3xl font-semibold tracking-tight mt-7 mb-4 text-gray-900 dark:text-white"
  >
    <slot />
  </h2>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: undefined
  }
})
</script>