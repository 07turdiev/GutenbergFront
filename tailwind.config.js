module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      'sm': '640px', // => @media (min-width: 640px) { ... }
      'md': '768px', // => @media (min-width: 768px) { ... }
      'lg': '1024px', // => @media (min-width: 1024px) { ... }
      'xl': '1170px', // => @media (min-width: 1280px) { ... }
    },
    extend: {
      fontFamily: {
        'sans': ['Poppins', 'system-ui', 'sans-serif'],
        'sitka': ['Sitka Text', 'Sitka', 'serif']
      },
      colors: {
        primary: '#cd1b17',
        secondary: '#4b4b4b',
        accent: '#8a1f1f',
        light: '#f5f5f5',
        'primary-hover': '#c77a7a',
      },
      scale: {
        '99': '0.99',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}
