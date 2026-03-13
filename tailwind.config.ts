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
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          blue: "#1a4b9c",
          light: "#f5f5f0", // Cream
          dark: "#121212",  // Dark Slate
        }
      },
      backgroundImage: {
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))",
        "glass-gradient-dark": "linear-gradient(135deg, rgba(26, 75, 156, 0.1) 0%, rgba(18, 18, 18, 0.4) 100%)",
      },
      boxShadow: {
        "glass": "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        "glass-inset": "inset 0 1px 1px rgba(255, 255, 255, 0.2), inset 0 -1px 1px rgba(0, 0, 0, 0.1)",
        "skeuo": "5px 5px 10px rgba(0,0,0,0.1), -5px -5px 10px rgba(255,255,255,0.8)",
        "skeuo-inset": "inset 5px 5px 10px rgba(0,0,0,0.1), inset -5px -5px 10px rgba(255,255,255,0.8)",
        "skeuo-dark": "5px 5px 10px rgba(0,0,0,0.5), -5px -5px 10px rgba(255,255,255,0.05)",
        "skeuo-dark-inset": "inset 5px 5px 10px rgba(0,0,0,0.5), inset -5px -5px 10px rgba(255,255,255,0.05)",
      },
      backdropBlur: {
        "glass": "12px",
        "glass-lg": "24px",
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
};
export default config;
