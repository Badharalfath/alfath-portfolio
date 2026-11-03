import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        paper: "var(--paper)",
        cobalt: "var(--cobalt)",
        signal: "var(--signal)",
        sunflower: "var(--sunflower)",
      },
      fontFamily: {
        display: ["var(--font-display-local)", "Arial Black", "sans-serif"],
        sans: ["var(--font-body-local)", "Arial", "sans-serif"],
        mono: ["Fragment Mono", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
