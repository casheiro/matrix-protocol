/**
 * Composable para funcionalidades de acessibilidade
 */
import { nextTick, ref, watch } from 'vue'

export const useAccessibility = () => {
  // Skip to content functionality
  const skipToContent = () => {
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.focus()
      mainContent.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Focus trap para modals/drawers
  const focusableElementsSelector = 
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(focusableElementsSelector)
    const firstElement = focusableElements[0] as HTMLElement | undefined
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement | undefined

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab
        if (firstElement && lastElement && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab
        if (firstElement && lastElement && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)

    // Focus no primeiro elemento
    nextTick(() => {
      if (firstElement) {
        firstElement.focus()
      }
    })

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }

  // Announce to screen readers
  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message

    document.body.appendChild(announcement)

    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement)
      }
    }, 1000)
  }

  // Roving tabindex para listas de itens
  const setupRovingTabindex = (container: HTMLElement, itemSelector: string) => {
    const items = container.querySelectorAll(itemSelector) as NodeListOf<HTMLElement>
    let currentIndex = 0

    // Configurar tabindex inicial
    items.forEach((item, index) => {
      item.setAttribute('tabindex', index === 0 ? '0' : '-1')
    })

    const handleKeydown = (e: KeyboardEvent) => {
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return
      
      e.preventDefault()
      
      // Remover tabindex do item atual
      const currentItem = items[currentIndex]
      if (currentItem) {
        currentItem.setAttribute('tabindex', '-1')
      }
      
      switch (e.key) {
        case 'ArrowDown':
          currentIndex = (currentIndex + 1) % items.length
          break
        case 'ArrowUp':
          currentIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1
          break
        case 'Home':
          currentIndex = 0
          break
        case 'End':
          currentIndex = items.length - 1
          break
      }
      
      // Focar no novo item
      const newItem = items[currentIndex]
      if (newItem) {
        newItem.setAttribute('tabindex', '0')
        newItem.focus()
      }
    }

    container.addEventListener('keydown', handleKeydown)
    
    return () => {
      container.removeEventListener('keydown', handleKeydown)
    }
  }

  // Detectar se usuário está navegando por teclado
  const isKeyboardUser = ref(false)
  
  const setupKeyboardDetection = () => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        isKeyboardUser.value = true
      }
    }
    
    const handleMousedown = () => {
      isKeyboardUser.value = false
    }
    
    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('mousedown', handleMousedown)
    
    return () => {
      document.removeEventListener('keydown', handleKeydown)
      document.removeEventListener('mousedown', handleMousedown)
    }
  }

  // Gerenciar foco em mudanças de rota
  const manageFocusOnRouteChange = (route: any) => {
    watch(route, () => {
      nextTick(() => {
        // Focar no h1 da página ou main content
        const h1 = document.querySelector('h1') as HTMLHeadingElement | null
        const mainContent = document.getElementById('main-content')
        
        if (h1) {
          h1.focus()
          const pageTitle = h1.textContent || 'Nova página'
          announceToScreenReader(`Página carregada: ${pageTitle}`)
        } else if (mainContent) {
          mainContent.focus()
          announceToScreenReader('Nova página carregada')
        }
      })
    })
  }

  return {
    skipToContent,
    trapFocus,
    announceToScreenReader,
    setupRovingTabindex,
    isKeyboardUser,
    setupKeyboardDetection,
    manageFocusOnRouteChange
  }
}