import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm paper + ink for the editorial (light) sections.
        cream: "#f5f1e8",
        paper: "#faf7f0",
        ivory: { DEFAULT: "#f6f1e9", 2: "#fbf8f2", 3: "#ece3d4" },
        ink: "#1c1a17",
        stone: "#6b665d",
        // Winter-night palette for the cinematic (dark) sections.
        night: { DEFAULT: "#0b1420", 2: "#0f1b2b", 3: "#172639" },
        // Champagne gold accents (light on dark, dark on ivory for AA contrast).
        gold: { DEFAULT: "#c8a46e", light: "#e6cd9d", dark: "#8a6a3c" },
        // Copper call-to-action accent.
        rust: "#b5613a",
        "rust-dark": "#9c4f2d",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        // The site's signature "expo out" — fast start, long graceful settle.
        expo: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
