/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#0b0f1a',
          925: '#0d1120',
          900: '#0f1422',
          800: '#161b2e',
          700: '#1e2a42',
          600: '#2d3f5e',
          500: '#475569',
          400: '#64748b',
        },
      },
    },
  },
  plugins: [],
}
