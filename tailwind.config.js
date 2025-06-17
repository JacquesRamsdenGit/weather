/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3498db',
          light: '#5dade2',
          dark: '#2980b9',
        },
        secondary: '#e67e22',
        tertiary: '#2ecc71',
        background: '#121212',
        card: 'rgba(30, 30, 30, 0.7)',
        text: {
          primary: '#f5f5f7',
          secondary: '#e0e0e0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        'md': '10px',
      },
    },
  },
  plugins: [],
}
