import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => {
    return {
      isMenuOpen: false,
      currentFramework: null as string | null
    }
  },
  
  getters: {
    frameworkColor: (state) => {
      const colors = {
        mef: 'mef-500',
        zof: 'zof-500',
        oif: 'oif-500',
        moc: 'moc-500',
        mal: 'mal-500'
      }
      return state.currentFramework ? colors[state.currentFramework as keyof typeof colors] : null
    }
  },
  
  actions: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    
    setFramework(framework: string | null) {
      this.currentFramework = framework
    }
  }
})