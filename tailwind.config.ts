import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        supira: {
          navy: "#0c1f33",
          primary: "#0f2744",
          "primary-light": "#1a3a5c",
          accent: "#0d6e6e",
          "accent-light": "#14b8a6",
          muted: "#64748b",
          subtle: "#94a3b8",
          border: "#e2e8f0",
          "border-strong": "#cbd5e1",
          surface: "#f8fafc",
          canvas: "#f1f5f9",
          warm: "#fffbeb",
        },
      },
      fontFamily: {
        sans: ["var(--font-noto)", "Hiragino Sans", "Yu Gothic", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(15 39 68 / 0.04), 0 4px 12px -2px rgb(15 39 68 / 0.06)",
        "card-hover":
          "0 4px 6px -1px rgb(15 39 68 / 0.06), 0 12px 24px -4px rgb(15 39 68 / 0.1)",
        sidebar: "4px 0 24px -4px rgb(15 39 68 / 0.08)",
        glow: "0 0 0 3px rgb(13 110 110 / 0.15)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
      animation: {
        "fade-in": "fadeIn 0.35s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "scale-in": "scaleIn 0.25s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
  safelist: [
    "bg-supira-canvas",
    "bg-supira-surface",
    "bg-supira-primary",
    "bg-supira-accent",
    "text-supira-muted",
    "text-supira-subtle",
    "text-supira-primary",
    "text-supira-accent",
    "border-supira-border",
    "shadow-card",
    "shadow-glow",
    "shadow-card-hover",
    "pattern-dots",
    "gradient-hero",
    "focus-ring",
    "page-enter",
    "card-elevated",
    "member-card",
    "input-field",
    "info-value-empty",
    "tab-pill",
    "tab-pill-active",
    "tab-pill-inactive",
    "gradient-sidebar-accent",
    "section-anchor",
  ],
};

export default config;
