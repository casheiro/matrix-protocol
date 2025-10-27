export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',  // Neutral color as primary to avoid forcing emerald everywhere
      secondary: 'slate',
      success: 'emerald',
      info: 'blue',
      warning: 'orange',
      error: 'red'
    },
    prose: {
      h1: {
        slots: {
          base: 'scroll-m-20 text-4xl font-extrabold tracking-tight mt-8 mb-6 first:mt-0'
        }
      },
      h2: {
        slots: {
          base: 'scroll-m-20 text-3xl font-semibold tracking-tight mt-7 mb-4'
        }
      },
      h3: {
        slots: {
          base: 'scroll-m-20 text-2xl font-semibold tracking-tight mt-6 mb-3'
        }
      },
      h4: {
        slots: {
          base: 'scroll-m-20 text-xl font-semibold tracking-tight mt-5 mb-2'
        }
      },
      h5: {
        slots: {
          base: 'scroll-m-20 text-lg font-semibold tracking-tight mt-4 mb-2'
        }
      },
      h6: {
        slots: {
          base: 'scroll-m-20 text-base font-semibold tracking-tight mt-4 mb-2'
        }
      },
      p: {
        slots: {
          base: 'leading-7 mb-5 [&:not(:first-child)]:mt-0'
        }
      },
      ul: {
        slots: {
          base: 'my-6 ml-6 space-y-2 list-disc'
        }
      },
      ol: {
        slots: {
          base: 'my-6 ml-6 space-y-2 list-decimal'
        }
      },
      li: {
        slots: {
          base: 'leading-7 mb-2'
        }
      },
      strong: {
        slots: {
          base: 'font-semibold'
        }
      },
      em: {
        slots: {
          base: 'italic'
        }
      },
      code: {
        slots: {
          base: 'relative rounded bg-muted px-2 py-1 font-mono text-sm font-semibold mx-1'
        }
      },
      pre: {
        slots: {
          base: 'my-6 overflow-x-auto rounded-lg border bg-zinc-950 p-4'
        }
      }
    }
  }
})