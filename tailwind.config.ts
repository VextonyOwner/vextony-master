import type { Config } from "tailwindcss";

/**
 * VEXTONY CORE INFRASTRUCTURE: TAILWIND CONFIGURATION MATRIX
 * [STATUS: OMNIPOTENT ULTRA-MAX PRODUCTION LIVE] | [PRIVILEGE: UI DESIGN SYSTEM MANAGER]
 */

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        vextonyGold: "#D4AF37",
        vextonyDark: "#0A0A0A",
      },
    },
  },
  plugins: [],
};

export default config;
