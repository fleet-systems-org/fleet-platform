import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  build: { outDir: "../../packages/ui/.storybook/public/prototypes/quote-during-call", emptyOutDir: true },
});
