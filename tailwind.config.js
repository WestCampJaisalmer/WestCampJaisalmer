/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#C97F2C",
          dark: "#AD671D",
          light: "#DF9745",
          glow: "rgba(201, 127, 44, 0.25)",
        },
        cream: {
          DEFAULT: "#FBF8F2",
          alt: "#F4ECE0",
        },
        teal: {
          DEFAULT: "#123038",
          dark: "#0B2026",
          light: "#1B4550",
        },
        'primary-gold': "#C97F2C",
        'primary-gold-dark': "#AD671D",
        'deep-teal': "#123038",
        'desert-sand': "#FBF8F2",
        'border-light': "#EDE5D8",
        'text-main': "#1F2022",
        'text-muted': "#6B6965",
        'text-light': "#949089",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        script: ["var(--font-autumn)", "var(--font-caveat)", "Caveat", "cursive"],
        autumn: ["var(--font-autumn)", "cursive"],
      },
      boxShadow: {
        subtle: "0 4px 20px rgba(0, 0, 0, 0.05)",
        card: "0 10px 30px rgba(0, 0, 0, 0.08)",
        hover: "0 20px 40px rgba(0, 0, 0, 0.12)",
        gold: "0 10px 25px rgba(201, 127, 44, 0.3)",
      },
      borderRadius: {
        sm: "8px",
        md: "14px",
        lg: "20px",
      },
    },
  },
  plugins: [],
};
