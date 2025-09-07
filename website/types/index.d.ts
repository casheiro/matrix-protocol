export interface Framework {
  key: string
  acronym: string
  name: string
  description: string
  colorClass: string
}

export interface NavigationItem {
  label: string
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