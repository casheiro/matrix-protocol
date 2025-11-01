<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  framework?: string
  color?: string
  variant?: 'soft' | 'solid' | 'outline'
  size?: 'xs' | 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'soft',
  size: 'sm'
})

const getFrameworkColors = (framework: string, variant: string) => {
  const colorMap = {
    mef: {
      soft: 'bg-green-100 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20',
      solid: 'bg-green-600 text-white ring-green-600',
      outline: 'text-green-700 ring-green-600 dark:text-green-400'
    },
    zof: {
      soft: 'bg-orange-100 text-orange-700 ring-orange-600/20 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/20',
      solid: 'bg-orange-600 text-white ring-orange-600',
      outline: 'text-orange-700 ring-orange-600 dark:text-orange-400'
    },
    oif: {
      soft: 'bg-blue-100 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20',
      solid: 'bg-blue-600 text-white ring-blue-600',
      outline: 'text-blue-700 ring-blue-600 dark:text-blue-400'
    },
    moc: {
      soft: 'bg-purple-100 text-purple-700 ring-purple-600/20 dark:bg-purple-500/10 dark:text-purple-400 dark:ring-purple-500/20',
      solid: 'bg-purple-600 text-white ring-purple-600',
      outline: 'text-purple-700 ring-purple-600 dark:text-purple-400'
    },
    mal: {
      soft: 'bg-red-100 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20',
      solid: 'bg-red-600 text-white ring-red-600',
      outline: 'text-red-700 ring-red-600 dark:text-red-400'
    }
  }

  return colorMap[framework as keyof typeof colorMap]?.[variant as keyof typeof colorMap.mef] || 
         'bg-gray-100 text-gray-700 ring-gray-600/20 dark:bg-gray-500/10 dark:text-gray-400 dark:ring-gray-500/20'
}

const getSizeClasses = (size: string) => {
  const sizeMap = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm'
  }
  return sizeMap[size as keyof typeof sizeMap] || sizeMap.sm
}

const badgeClasses = computed(() => {
  const baseClasses = 'inline-flex items-center rounded-md font-medium ring-1 ring-inset'
  const sizeClasses = getSizeClasses(props.size)
  
  if (props.framework) {
    const colorClasses = getFrameworkColors(props.framework, props.variant)
    return `${baseClasses} ${sizeClasses} ${colorClasses}`
  }
  
  // Fallback para cores customizadas se não for um framework
  const defaultClasses = 'bg-gray-100 text-gray-700 ring-gray-600/20 dark:bg-gray-500/10 dark:text-gray-400 dark:ring-gray-500/20'
  return `${baseClasses} ${sizeClasses} ${defaultClasses}`
})
</script>