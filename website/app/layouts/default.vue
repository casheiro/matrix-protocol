<template>
  <div class="min-h-screen bg-slate-950 text-slate-50 font-sans">
    <!-- AppHeader com navegação completa -->
    <LayoutAppHeader />

    <!-- Main content -->
    <main id="main-content" tabindex="-1" class="focus:outline-none">
      <slot />
    </main>

    <!-- Footer placeholder -->
    <footer class="border-t border-slate-800 bg-slate-900 mt-auto">
      <div class="container mx-auto px-4 py-8">
        <div class="text-center text-slate-400">
          <p>
            {{ $t('footer.createdBy') }}
            <a 
              :href="$t('footer.casheiroLink')" 
              target="_blank" 
              rel="noopener noreferrer"
              class="text-blue-400 hover:text-blue-300 underline transition-colors ml-1"
            >
              Casheiro
            </a>
          </p>
          <p class="mt-2">{{ $t('footer.copyright') }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Composables
const config = useMatrixConfig()
</script>

<style scoped>
/* Layout-specific styles if needed */
</style>