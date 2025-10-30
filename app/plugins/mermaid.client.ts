import { defineNuxtPlugin } from '#app'
import mermaid from 'mermaid'

export default defineNuxtPlugin(() => {
  // Initialize Mermaid only on client side
  if (import.meta.client) {
    mermaid.initialize({
      startOnLoad: false, // We'll manually initialize diagrams
      theme: 'base',
      themeVariables: {
        // Light theme colors
        primaryColor: '#2563eb', // blue-600
        primaryTextColor: '#1f2937', // gray-800
        primaryBorderColor: '#3b82f6', // blue-500
        lineColor: '#6b7280', // gray-500
        secondaryColor: '#f3f4f6', // gray-100
        tertiaryColor: '#ffffff',
        background: '#ffffff',
        mainBkg: '#ffffff',
        secondBkg: '#f9fafb', // gray-50
        tertiaryBkg: '#f3f4f6' // gray-100
      },
      fontFamily: 'Source Code Pro, monospace',
      fontSize: 14,
      darkMode: false, // We'll handle dark mode dynamically
      securityLevel: 'loose',
      htmlLabels: true,
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
        wrap: true,
        nodeSpacing: 50,
        rankSpacing: 50,
        diagramPadding: 8
      },
      sequence: {
        useMaxWidth: true,
        wrap: true
      },
      gantt: {
        useMaxWidth: true
      },
      journey: {
        useMaxWidth: true
      },
      timeline: {
        useMaxWidth: true
      }
    })

    // Function to update theme based on dark mode
    const updateMermaidTheme = (isDark: boolean) => {
      const themeConfig = {
        theme: (isDark ? 'dark' : 'default') as 'base' | 'default' | 'dark' | 'forest' | 'neutral' | 'null',
        themeVariables: isDark ? {
          // Dark theme colors
          primaryColor: '#3b82f6', // blue-500
          primaryTextColor: '#f9fafb', // gray-50
          primaryBorderColor: '#60a5fa', // blue-400
          lineColor: '#9ca3af', // gray-400
          secondaryColor: '#374151', // gray-700
          tertiaryColor: '#1f2937', // gray-800
          background: '#111827', // gray-900
          mainBkg: '#1f2937', // gray-800
          secondBkg: '#374151', // gray-700
          tertiaryBkg: '#4b5563' // gray-600
        } : {
          // Light theme colors
          primaryColor: '#2563eb', // blue-600
          primaryTextColor: '#1f2937', // gray-800
          primaryBorderColor: '#3b82f6', // blue-500
          lineColor: '#6b7280', // gray-500
          secondaryColor: '#f3f4f6', // gray-100
          tertiaryColor: '#ffffff',
          background: '#ffffff',
          mainBkg: '#ffffff',
          secondBkg: '#f9fafb', // gray-50
          tertiaryBkg: '#f3f4f6' // gray-100
        },
        fontFamily: 'Source Code Pro, monospace',
        fontSize: 14,
        securityLevel: 'loose' as 'loose' | 'strict' | 'antiscript' | 'sandbox',
        htmlLabels: true,
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis' as 'basis' | 'bumpX' | 'bumpY' | 'cardinal' | 'catmullRom' | 'linear' | 'monotoneX' | 'monotoneY' | 'natural' | 'step' | 'stepAfter' | 'stepBefore',
          wrap: true,
          nodeSpacing: 50,
          rankSpacing: 50,
          diagramPadding: 8
        }
      }
      
      mermaid.initialize(themeConfig)
    }

    // Provide Mermaid instance and theme updater
    return {
      provide: {
        mermaid: {
          instance: mermaid,
          updateTheme: updateMermaidTheme,
          render: async (id: string, definition: string) => {
            try {
              const { svg, bindFunctions } = await mermaid.render(id, definition)
              return { svg, bindFunctions }
            } catch (error) {
              console.error('Mermaid render error:', error)
              throw error
            }
          }
        }
      }
    }
  }
})