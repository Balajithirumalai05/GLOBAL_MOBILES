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
          yellow: "#F2D046",      // main gold yellow (banner)
          yellowSoft: "#FFD84D",  // lighter highlight yellow
          dark: "#111111",        // deep black
          darkSoft: "#1A1A1A",    // soft black
          gray: "#2A2A2A"
        }
      },
      boxShadow: {
        glowYellow: "0 8px 30px rgba(242, 208, 70, 0.6)",
        soft: "0 10px 25px rgba(0,0,0,0.15)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      }
    },
  },
  plugins: [],
};
