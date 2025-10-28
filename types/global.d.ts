import type { ComponentCustomProperties } from 'vue'
import type { Router } from 'vue-router'
import type { LocalePathFunction } from '@nuxtjs/i18n'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: (key: string, ...args: any[]) => string
    $te: (key: string) => boolean
    $d: (value: Date | number, ...args: any[]) => string
    $n: (value: number, ...args: any[]) => string
    $rt: (key: string, ...args: any[]) => string
    $locale: string
    $i18n: any
    $router: Router
    $route: any
    localePath: LocalePathFunction
  }
}

// Global navigation types
declare global {
  interface NavigationNode {
    title: string
    path?: string
    children?: NavigationNode[]
  }

  interface BreadcrumbItem {
    title: string
    path?: string
  }

  interface BreadcrumbResponse {
    breadcrumbs: BreadcrumbItem[]
  }

  interface SiblingsResponse {
    siblings: NavigationNode[]
    parent?: NavigationNode
    children?: NavigationNode[]
  }

  interface ContentNode {
    title: string
    path: string
  }
}

export {}