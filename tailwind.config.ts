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
        gray: {
          750: "#2b2f3a",
          800: "#21252e",
          850: "#1a1d26",
          900: "#14161d",
          950: "#0a0c10",
        },
      },
    },
  },
  plugins: [],
};

export default config;

