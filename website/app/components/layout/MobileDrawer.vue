<template>
  <!-- Backdrop/Overlay -->
  <Transition
    enter-active-class="transition-opacity duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      @click="closeDrawer"
      aria-hidden="true"
    />
  </Transition>

  <!-- Mobile Drawer -->
  <Transition
    enter-active-class="transition-transform duration-200 ease-in-out"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-200 ease-in-out"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
  >
    <div
      v-if="modelValue"
      class="fixed left-0 inset-y-0 w-full max-w-md bg-white dark:bg-slate-800 shadow-xl z-50 flex flex-col"
      role="dialog"
      aria-modal="true"
      :aria-label="$t('navigation.mobileMenu')"
    >
      <!-- Header do Drawer -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-600">
        <div class="flex items-center space-x-3">
          <img
            :src="getMatrixLogo('mobile')"
            alt=""
            class="h-8 w-auto"
          />
          <span class="text-lg font-semibold text-gray-900 dark:text-white font-rajdhani">
            Matrix Protocol
          </span>
        </div>
        <UButton 
          @click="closeDrawer"
          variant="ghost" 
          size="sm"
          icon="i-heroicons-x-mark"
          :aria-label="$t('navigation.closeMenu')"
        />
      </div>

      <!-- Navigation Items -->
      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto" role="navigation">
        <!-- Frameworks Section -->
        <div class="space-y-1" role="group" :aria-labelledby="'frameworks-heading'">
          <div 
            id="frameworks-heading"
            class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide px-3 py-2"
            role="heading"
            aria-level="2"
          >
            {{ $t('navigation.frameworks') }}
          </div>
          <!-- Overview Link -->
          <NuxtLink
            :to="`/${$i18n.locale}/frameworks`"
            class="flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors duration-200 focus:outline-none"
            :class="$route.path === `/${$i18n.locale}/frameworks` ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50'"
            :aria-label="$t('navigation.frameworksOverview')"
            @click="closeDrawer"
          >
            <div class="w-3 h-3 rounded-full flex-shrink-0 bg-gradient-to-br from-blue-500 to-emerald-500" />
            <span class="font-medium">{{ $t('navigation.frameworksOverview') }}</span>
            <span class="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
              {{ $t('navigation.overviewBadge') }}
            </span>
          </NuxtLink>

          <div class="ml-4 space-y-1" role="list">
            <NuxtLink
              v-for="framework in frameworks"
              :key="framework.key"
              :to="`/${$i18n.locale}/frameworks/${framework.key}`"
              class="flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors duration-200 focus:outline-none"
              :class="$route.path.includes(`/frameworks/${framework.key}`) ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50'"
              :aria-label="`Navegar para ${framework.acronym} - ${framework.name}`"
              role="listitem"
              @click="closeDrawer"
            >
              <div 
                class="w-3 h-3 rounded-full flex-shrink-0"
                :class="getFrameworkColorClass(framework.key)"
                :aria-label="`Cor identificadora do framework ${framework.acronym}`"
              />
              <span class="font-medium">{{ framework.acronym }}</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ framework.name }}
              </span>
            </NuxtLink>
          </div>
          
          <!-- MEP - Manifesto Epistemológico -->
          <NuxtLink
            :to="`/${$i18n.locale}/mep`"
            class="flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors duration-200 focus:outline-none ml-4"
            :class="$route.path.includes('/mep') ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50'"
            :aria-label="`Navegar para MEP - ${$t('mep.principleDescription')}`"
            @click="closeDrawer"
          >
            <div class="w-3 h-3 rounded-full flex-shrink-0 bg-gradient-to-br from-blue-600 to-purple-600" />
            <span class="font-medium">MEP</span>
            <span class="text-xs px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
              {{ $t('mep.manifestBadge') }}
            </span>
          </NuxtLink>
        </div>

        <!-- Documentação (unificada) -->
        <NuxtLink 
          :to="`/${$i18n.locale}/protocol`" 
          class="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-200 focus:outline-none"
          :class="isProtocolActive ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700/50'"
          @click="closeDrawer"
        >
          <UIcon name="i-heroicons-book-open" class="w-5 h-5" />
          {{ $t('navigation.protocol') }}
        </NuxtLink>

        <!-- Recursos -->
        <NuxtLink 
          :to="`/${$i18n.locale}/resources`" 
          class="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-200 focus:outline-none"
          :class="$route.path.includes('/resources') ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700/50'"
          @click="closeDrawer"
        >
          <UIcon name="i-heroicons-folder" class="w-5 h-5" />
          {{ $t('navigation.resources') }}
        </NuxtLink>
      </nav>
    </div>
  </Transition>
</template>

<script setup>
// Props & Emits
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'update:modelValue'])

// Composables
const { getMatrixLogo, frameworks } = useMatrixAssets()
const { locale } = useI18n()
const route = useRoute()

// Computed
const isProtocolActive = computed(() => {
  const path = route.path
  return path.includes('/protocol') || 
         path.includes('/quickstart') || 
         path.includes('/implementation') || 
         path.includes('/integration') || 
         path.includes('/glossary')
})

// Methods
const getFrameworkColorClass = (key) => {
  const colorMap = {
    mef: 'bg-emerald-500',
    zof: 'bg-orange-500', 
    oif: 'bg-blue-500',
    moc: 'bg-purple-500',
    mal: 'bg-red-500'
  }
  return colorMap[key] || 'bg-gray-500'
}

// Função para fechar drawer
const closeDrawer = () => {
  emit('update:modelValue', false)
  emit('close')
}

// Body scroll prevention when open
watchEffect(() => {
  if (props.modelValue && process.client) {
    document.body.style.overflow = 'hidden'
    
    // Gerenciar aria-hidden
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.setAttribute('aria-hidden', 'true')
    }
  } else if (process.client) {
    document.body.style.overflow = ''
    
    // Restaurar aria-hidden
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.removeAttribute('aria-hidden')
    }
  }
})

// Cleanup
onUnmounted(() => {
  if (process.client) {
    document.body.style.overflow = ''
  }
})
</script>