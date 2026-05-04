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
        background: "var(--bg-primary)",
        foreground: "var(--text-primary)",
        primary: "var(--bg-primary)",
        secondary: "var(--bg-secondary)",
        card: "var(--bg-card)",
        border: "var(--border)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
      },
    },
  },
  plugins: [],
};
export default config;
