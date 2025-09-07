export default defineAppConfig({
  ui: {
    // Cores primárias do Matrix Protocol
    primary: 'blue',
    gray: 'slate',
    
    // Customização global de componentes
    button: {
      default: {
        loadingIcon: 'i-heroicons-arrow-path-20-solid'
      }
    },
    
    // Notificações
    notifications: {
      position: 'top-0 bottom-auto'
    },

    // Cards
    card: {
      rounded: 'rounded-xl'
    }
  }
})