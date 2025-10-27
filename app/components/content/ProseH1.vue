<template>
  <h1 
    :id="id" 
    class="scroll-m-20 text-4xl font-extrabold tracking-tight mt-8 mb-6 first:mt-0 text-gray-900 dark:text-white"
  >
    <slot />
  </h1>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: undefined
  }
})
</script>