import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          deep: "#030712",
          main: "#080d1a",
          surface: "#0f172a",
          elevated: "#1e293b",
        },
        brand: {
          blue: "#3b82f6",
          cyan: "#06b6d4",
          purple: "#8b5cf6",
          pink: "#ec4899",
          orange: "#f97316",
        },
        cyber: {
          purple: "#8b5cf6",
          cyan: "#06b6d4",
          pink: "#ec4899",
          dark: "#080d1a",
          card: "rgba(15, 23, 42, 0.75)",
        },
      },
      fontFamily: {
        heading: ["var(--font-outfit)", "sans-serif"],
        sans: ["var(--font-jakarta)", "sans-serif"],
      },
      boxShadow: {
        'glow-blue': '0 0 25px rgba(59, 130, 246, 0.35)',
        'glow-purple': '0 0 25px rgba(139, 92, 246, 0.35)',
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.35)',
        'glow-pink': '0 0 25px rgba(236, 72, 153, 0.35)',
        'glow-orange': '0 0 25px rgba(249, 115, 22, 0.35)',
        'glass': '0 10px 30px -10px rgba(0, 0, 0, 0.6)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
export default config;
