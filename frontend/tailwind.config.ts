import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sarabun)", "sans-serif"],
        display: ["var(--font-kanit)", "sans-serif"],
      },
      colors: {
        brand: {
          primary: "#0b4f9f",
          "primary-hover": "#0e62c4",
          "primary-ink": "#0a3f82",
          soft: "#e7eef8",
        },
      },
    },
  },
  plugins: [],
};

export default config;
