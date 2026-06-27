import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        aether: {
          bg:     "#08090c",
          card:   "#0f1117",
          border: "#1c1f2e",
          signal: "#00d4aa",
          live:   "#ff4444",
          gold:   "#f5a623",
          blue:   "#0094ff",
        },
      },
    },
  },
  plugins: [],
};

export default config;
