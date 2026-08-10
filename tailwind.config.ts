import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cyber: {
          purple: "#8b5cf6",
          cyan: "#06b6d4",
          pink: "#ec4899",
          dark: "#090d16",
          card: "rgba(17, 24, 39, 0.75)"
        }
      },
      fontFamily: {
        heading: ["var(--font-outfit)", "sans-serif"],
        sans: ["var(--font-jakarta)", "sans-serif"],
      }
    },
  },
  plugins: [],
};
export default config;
