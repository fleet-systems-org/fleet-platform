import { defineConfig } from "playwright/test";

export default defineConfig({
  testDir: "./integration",
  testMatch: "prototype.spec.ts",
  timeout: 30_000,
  retries: 0,
  outputDir: "../../integration-evidence/playwright-prototype",
  use: { baseURL: "http://127.0.0.1:16106", browserName: "chromium" },
  webServer: {
    command: "pnpm exec vite preview --outDir storybook-static --host 127.0.0.1 --port 16106 --strictPort",
    url: "http://127.0.0.1:16106/prototypes/quote-during-call/index.html",
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
