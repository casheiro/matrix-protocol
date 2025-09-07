export default <any>{
  content: [],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cores dos Frameworks Matrix Protocol
        'mef': { 
          50: '#E8F8F5',
          100: '#D0F4EA',
          200: '#A1E9D5',
          300: '#72DEC0',
          400: '#43D3AB',
          500: '#2ECC71', // Principal
          600: '#27AE60',
          700: '#229954',
          800: '#1E8449',
          900: '#196F3D'
        },
        'zof': { 
          50: '#FDF2E9',
          100: '#FAE5D3',
          200: '#F6CBA7',
          300: '#F2B17B',
          400: '#EE974F',
          500: '#E67E22', // Principal
          600: '#D68910',
          700: '#BA7A0B',
          800: '#9E6B07',
          900: '#825C03'
        },
        'oif': { 
          50: '#EBF5FB',
          100: '#D6EAF8',
          200: '#AED6F1',
          300: '#85C1E9',
          400: '#5DADE2',
          500: '#2980B9', // Principal
          600: '#1F618D',
          700: '#1A5276',
          800: '#154360',
          900: '#10334A'
        },
        'moc': { 
          50: '#F4ECF7',
          100: '#E8DAEF',
          200: '#D7BDE2',
          300: '#C39BD3',
          400: '#AF7AC5',
          500: '#9B59B6', // Principal
          600: '#7D3C98',
          700: '#6C3483',
          800: '#5B2C6F',
          900: '#4A235A'
        },
        'mal': { 
          50: '#FADBD8',
          100: '#F5B7B1',
          200: '#F1948A',
          300: '#EC7063',
          400: '#E74C3C',
          500: '#C0392B', // Principal
          600: '#A93226',
          700: '#922B21',
          800: '#7B241C',
          900: '#641E16'
        }
      },
      fontFamily: {
        // Rajdhani como fonte principal
        'sans': ['Rajdhani', 'system-ui', 'sans-serif'],
        'display': ['Rajdhani', 'system-ui', 'sans-serif'],
        'mono': ['Source Code Pro', 'monospace']
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700'
      }
    }
  },
  plugins: []  // Nuxt UI já inclui os plugins necessários
}