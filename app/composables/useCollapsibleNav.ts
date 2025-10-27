export function useCollapsibleNav(navigation: any[], currentPath: string) {
  // Estado reativo para itens expandidos
  const expandedItems = ref<Set<string>>(new Set())
  
  // Chave para localStorage
  const STORAGE_KEY = 'matrix-docs-nav-expanded'
  
  // Inicializar estado expandido baseado no localStorage e item ativo
  const initializeExpandedState = () => {
    // Tentar carregar do localStorage
    if (process.client) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const storedArray = JSON.parse(stored) as string[]
          const storedSet = new Set(storedArray)
          expandedItems.value = storedSet
        }
      } catch (error) {
        console.warn('Erro ao carregar estado de navegação:', error)
      }
    }
    
    // Expandir automaticamente item ativo
    navigation.forEach(item => {
      if (item.children && item.children.length > 0) {
        // Verifica se o item atual ou algum child está ativo
        const isItemActive = isActivePath(item.path, currentPath)
        const hasActiveChild = item.children.some((child: any) => 
          isActivePath(child.path, currentPath)
        )
        
        if (isItemActive || hasActiveChild) {
          expandedItems.value.add(item.path)
        }
      }
    })
  }
  
  // Função para verificar se um path está ativo
  const isActivePath = (path: string, current: string) => {
    if (!current || !path) return false
    
    // Remove prefixo de locale para comparação
    const currentClean = current.replace(/^\/(pt|en)/, '')
    const pathClean = path.replace(/^\/(pt|en)/, '')
    
    return currentClean === pathClean || currentClean.startsWith(pathClean + '/')
  }
  
  // Toggle do estado expandido de um item
  const toggleExpanded = (itemPath: string) => {
    if (expandedItems.value.has(itemPath)) {
      expandedItems.value.delete(itemPath)
    } else {
      expandedItems.value.add(itemPath)
    }
    
    // Salvar no localStorage
    if (process.client) {
      try {
        localStorage.setItem(
          STORAGE_KEY, 
          JSON.stringify(Array.from(expandedItems.value))
        )
      } catch (error) {
        console.warn('Erro ao salvar estado de navegação:', error)
      }
    }
  }
  
  // Verificar se um item está expandido
  const isExpanded = (itemPath: string) => {
    return expandedItems.value.has(itemPath)
  }
  
  // Expandir todos os itens
  const expandAll = () => {
    navigation.forEach(item => {
      if (item.children && item.children.length > 0) {
        expandedItems.value.add(item.path)
      }
    })
    
    if (process.client) {
      try {
        localStorage.setItem(
          STORAGE_KEY, 
          JSON.stringify(Array.from(expandedItems.value))
        )
      } catch (error) {
        console.warn('Erro ao salvar estado de navegação:', error)
      }
    }
  }
  
  // Recolher todos os itens
  const collapseAll = () => {
    expandedItems.value.clear()
    
    if (process.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
      } catch (error) {
        console.warn('Erro ao salvar estado de navegação:', error)
      }
    }
  }
  
  // Inicializar quando montado
  onMounted(() => {
    initializeExpandedState()
  })
  
  // Watch para mudanças no currentPath
  watch(
    () => currentPath,
    (newPath) => {
      if (newPath) {
        // Auto-expandir item ativo quando path mudar
        navigation.forEach(item => {
          if (item.children && item.children.length > 0) {
            const isItemActive = isActivePath(item.path, newPath)
            const hasActiveChild = item.children.some((child: any) => 
              isActivePath(child.path, newPath)
            )
            
            if (isItemActive || hasActiveChild) {
              expandedItems.value.add(item.path)
            }
          }
        })
      }
    }
  )
  
  return {
    expandedItems: readonly(expandedItems),
    toggleExpanded,
    isExpanded,
    expandAll,
    collapseAll,
    isActivePath
  }
}