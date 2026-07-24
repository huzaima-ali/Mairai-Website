import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        border: "hsl(var(--border) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        card: "hsl(var(--card) / <alpha-value>)",
        ink: "#0a0a0a",
        accent: {
          DEFAULT: "#c7253e",
          soft: "#fbe3e7",
        },
      },
      borderRadius: {
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "28px",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Google Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.03em",
        snug: "-0.01em",
      },
      maxWidth: {
        content: "1760px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(10, 10, 10, 0.04), 0 10px 30px -18px rgba(10, 10, 10, 0.12)",
        card: "0 1px 0 rgba(10,10,10,0.02), 0 24px 60px -32px rgba(10, 10, 10, 0.22)",
        pill: "0 8px 20px -10px rgba(10, 10, 10, 0.5)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-soft": "cubic-bezier(0.65, 0.05, 0.36, 1)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-2%,0)" },
        },
      },
      animation: {
        marquee: "marquee var(--marquee-duration, 40s) linear infinite",
        "float-slow": "float-slow 16s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
