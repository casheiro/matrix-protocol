export interface NavigationNode {
  title: string
  path?: string
  children?: NavigationNode[]
}

export interface BreadcrumbItem {
  title: string
  path?: string
}

export interface BreadcrumbResponse {
  breadcrumbs: BreadcrumbItem[]
}

export interface SiblingsResponse {
  siblings: NavigationNode[]
  parent?: NavigationNode
  children?: NavigationNode[]
}

export interface ContentNode {
  title: string
  path: string
}

export interface Locale {
  code: string
  name: string
  file: string
  iso: string
}