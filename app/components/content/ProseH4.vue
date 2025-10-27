<template>
  <h4 
    :id="id" 
    class="scroll-m-20 text-xl font-semibold tracking-tight mt-5 mb-2 text-gray-900 dark:text-white"
  >
    <slot />
  </h4>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: undefined
  }
})
</script>