import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors driven by CSS variables so light/dark themes stay consistent
        bg: "rgb(var(--bg) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        elevated: "rgb(var(--elevated) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          soft: "rgb(var(--primary-soft) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          soft: "rgb(var(--secondary-soft) / <alpha-value>)",
        },
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        // grammar color coding
        der: "rgb(var(--der) / <alpha-value>)",
        die: "rgb(var(--die) / <alpha-value>)",
        das: "rgb(var(--das) / <alpha-value>)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.06)",
        glow: "0 0 0 1px rgb(var(--primary) / 0.18), 0 12px 40px rgb(var(--primary) / 0.18)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-6px)" },
          "40%, 80%": { transform: "translateX(6px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out both",
        shake: "shake 0.4s ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
