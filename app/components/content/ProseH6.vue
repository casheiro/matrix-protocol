<template>
  <h6 
    :id="id" 
    class="scroll-m-20 text-base font-semibold tracking-tight mt-4 mb-2 text-gray-900 dark:text-white"
  >
    <slot />
  </h6>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: undefined
  }
})
</script>