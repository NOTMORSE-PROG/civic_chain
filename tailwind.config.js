/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        civic: {
          blue: '#1e40af',
          green: '#059669',
          red: '#dc2626',
          yellow: '#d97706',
        }
      }
    },
  },
  plugins: [],
}