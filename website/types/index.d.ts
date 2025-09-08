export interface Framework {
  key: string
  acronym: string
  nameKey: string
  descriptionKey: string
  colorClass: string
}

export interface NavigationItem {
  labelKey: string
  to: string
  icon?: string
}

export interface MatrixColor {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string  // Principal
  600: string
  700: string
  800: string
  900: string
}

// App Store interface
export interface AppState {
  isMenuOpen: boolean
  currentFramework: string | null
}

// Locale interface for i18n
export interface LocaleInfo {
  code: string
  name: string
  nativeName: string
  flag: string
  iso: string
}