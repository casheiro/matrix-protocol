// Vue i18n type declarations for Nuxt
import type { Composer } from 'vue-i18n'

declare module 'vue' {
  interface ComponentCustomProperties {
    $t: Composer['t']
    $tc: Composer['tc']
    $te: Composer['te']
    $d: Composer['d']
    $n: Composer['n']
    $rt: Composer['rt']
    $tm: Composer['tm']
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: Composer['t']
    $tc: Composer['tc']
    $te: Composer['te']
    $d: Composer['d']
    $n: Composer['n']
    $rt: Composer['rt']
    $tm: Composer['tm']
  }
}

export {}