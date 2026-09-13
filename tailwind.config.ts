import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gold: {
          dark: "#C99732",
          DEFAULT: "#D4A63A",
          light: "#E3B95C",
          highlight: "#F5E0A9",
        },
        carbon: {
          900: "#0A0A0A",
          800: "#121212",
          700: "#171717",
          600: "#1F1F1F",
        },
        secondary: "var(--text-secondary)",
        muted: "var(--text-muted)",
      },
      fontFamily: {
        display: ["Cinzel", "Playfair Display", "Georgia", "serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
