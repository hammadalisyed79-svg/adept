import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: "#17252B",
          soft: "#24353C",
          muted: "#3A4D55",
        },
        champagne: {
          DEFAULT: "#B49A73",
          soft: "#C9B597",
          deep: "#8F7854",
        },
        ivory: {
          DEFAULT: "#F4F1EB",
          soft: "#FAF8F4",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "72rem",
      },
      letterSpacing: {
        wideish: "0.08em",
      },
      transitionDuration: {
        soft: "400ms",
      },
    },
  },
  plugins: [typography],
};

export default config;
