import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        // The greys read their values from CSS variables, so the dark theme flips every grey on the site at once.
        gray: Object.fromEntries(
          [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((n) => [String(n), `rgb(var(--gray-${n}) / <alpha-value>)`])
        ),
        brand: {
          gold: "rgb(var(--gold-rgb) / <alpha-value>)",
          "gold-dark": "var(--sun-hover)",
          black: "var(--ink)",
          navy: "var(--ink)",
          panel: "var(--ink)",
          cream: "var(--stone)",
          leaf: "var(--leaf)",
          "leaf-ink": "var(--leaf-ink)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
