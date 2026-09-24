/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#111111",
          dark: "#1A1A1A",
          card: "#222222",
          border: "#2E2E2E",
          red: "#B5121B",
          redDark: "#7D0A10",
          redLight: "#D91C27",
          white: "#FFFFFF",
          grayLight: "#F4F4F4",
          grayMuted: "#888888",
          grayDark: "#333333"
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
