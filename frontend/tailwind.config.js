/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#C8102E",         // Mapúa Cardinal red (vibrant)
          "red-dark": "#A8232F",
          "red-light": "#E14654",
          gold: "#FFC72C",        // Mapúa gold (Cardinal EDGE highlight)
          "gold-dark": "#B8860B",
          "gold-light": "#FFD557",
        },
        surface: {
          // Light mode
          light: "#FFFFFF",
          "light-alt": "#F5F5F5",
          "light-border": "#D4D4D4",
          // Dark mode — Cardinal EDGE near-black
          dark: "#1A1A1A",         // page background
          "dark-alt": "#262626",   // raised cards / sidebar items
          "dark-border": "#3A3A3A",
        },
        ink: {
          "light-strong": "#0A0A0A",
          "light-muted": "#525252",
          "light-faint": "#737373",
          "dark-strong": "#FAFAFA",
          "dark-muted": "#D4D4D4",
          "dark-faint": "#A3A3A3",
        },
      },
    },
  },
  plugins: [],
};
