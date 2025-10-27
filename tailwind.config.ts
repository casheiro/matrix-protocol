import type { Config } from 'tailwindcss'

export default <Config>{
  content: [
    './app/components/**/*.{js,vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app.vue',
    './app/error.vue'
  ],
  safelist: [
    // Matrix Protocol Framework Colors
    'bg-emerald-500', 'bg-emerald-600', 'bg-emerald-700',
    'bg-orange-500', 'bg-orange-600', 'bg-orange-700',
    'bg-blue-500', 'bg-blue-600', 'bg-blue-700',
    'bg-purple-500', 'bg-purple-600', 'bg-purple-700',
    'bg-red-500', 'bg-red-600', 'bg-red-700',
    'text-emerald-400', 'text-orange-400', 'text-blue-400', 'text-purple-400', 'text-red-400',
    'border-emerald-500', 'border-orange-500', 'border-blue-500', 'border-purple-500', 'border-red-500',
    'hover:border-emerald-500', 'hover:border-orange-500', 'hover:border-blue-500', 'hover:border-purple-500', 'hover:border-red-500'
  ],
  theme: {
    extend: {
      // Matrix Protocol Brand Colors
      colors: {
        // Modern purple-blue-gray theme palette
        'slate-matrix': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#4c5a6b',  // hover states - purple-gray
          700: '#3a4553',  // elevated elements - blue-gray
          800: '#2a3441',  // primary background - purple-blue-gray
          850: '#242937',  // card backgrounds - deeper purple-blue
          900: '#1e222d',  // secondary backgrounds - rich purple-gray
          950: '#171a23'   // deepest backgrounds - deep purple-blue
        },
        // MEF - Matrix Embedding Framework (Emerald Green)
        mef: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#2ECC71',  // Primary brand color
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b'
        },
        
        // ZOF - Zion Orchestration Framework (Amber Orange)
        zof: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#E67E22',  // Primary brand color
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f'
        },
        
        // OIF - Operator Intelligence Framework (Deep Blue)
        oif: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2980B9',  // Primary brand color
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        },
        
        // MOC - Matrix Ontology Catalog (Neutral Lilac)
        moc: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#9B59B6',  // Primary brand color
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87'
        },
        
        // MAL - Matrix Arbiter Layer (Dark Red)
        mal: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#C0392B',  // Primary brand color
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d'
        }
      },
      
      // Typography - Matrix Protocol fonts
      fontFamily: {
        sans: ['Rajdhani', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Source Code Pro', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      
      // Custom spacing for Matrix Protocol design system
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      
      // Animation for Matrix Protocol interactions
      animation: {
        'matrix-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'matrix-bounce': 'bounce 1s infinite',
        'matrix-fade-in': 'fadeIn 0.5s ease-in-out',
        'matrix-slide-up': 'slideUp 0.3s ease-out'
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          }
        }
      },
      
      // Matrix Protocol specific gradient backgrounds
      backgroundImage: {
        'matrix-gradient': 'linear-gradient(135deg, #2ECC71 0%, #E67E22 25%, #2980B9 50%, #9B59B6 75%, #C0392B 100%)',
        'mef-gradient': 'linear-gradient(135deg, #2ECC71 0%, #34d399 100%)',
        'zof-gradient': 'linear-gradient(135deg, #E67E22 0%, #fbbf24 100%)',
        'oif-gradient': 'linear-gradient(135deg, #2980B9 0%, #60a5fa 100%)',
        'moc-gradient': 'linear-gradient(135deg, #9B59B6 0%, #c084fc 100%)',
        'mal-gradient': 'linear-gradient(135deg, #C0392B 0%, #f87171 100%)'
      },
      
      // Custom shadows for Matrix Protocol cards and components
      boxShadow: {
        'matrix': '0 4px 14px 0 rgba(46, 204, 113, 0.1)',
        'mef': '0 4px 14px 0 rgba(46, 204, 113, 0.2)',
        'zof': '0 4px 14px 0 rgba(230, 126, 34, 0.2)',
        'oif': '0 4px 14px 0 rgba(41, 128, 185, 0.2)',
        'moc': '0 4px 14px 0 rgba(155, 89, 182, 0.2)',
        'mal': '0 4px 14px 0 rgba(192, 57, 43, 0.2)'
      }
    }
  },
  
  // Dark mode support
  darkMode: 'class',
  
  plugins: [
    // Typography plugin for better text rendering
    require('@tailwindcss/typography'),
    
    // Custom Matrix Protocol utilities
    function({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        '.text-matrix-gradient': {
          'background': 'linear-gradient(135deg, #2ECC71 0%, #E67E22 25%, #2980B9 50%, #9B59B6 75%, #C0392B 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text'
        },
        '.border-matrix-gradient': {
          'border': '2px solid transparent',
          'background': 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #2ECC71 0%, #E67E22 25%, #2980B9 50%, #9B59B6 75%, #C0392B 100%) border-box'
        }
      }
      addUtilities(newUtilities)
    }
  ]
}