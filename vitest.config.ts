import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const appSource = fileURLToPath(new URL("./packages/app/src/", import.meta.url));

export default defineConfig({
  // Mirror the application's "@/*" TypeScript path so page modules resolve in tests.
  resolve: { alias: [{ find: /^@\//, replacement: appSource }] },
  test: {
    coverage: {
      provider: "v8",
      include: ["packages/*/src/**/*.{ts,tsx}", "scripts/**/*.ts"],
      exclude: ["**/*.test.{ts,tsx}"],
      reporter: ["text", "html"],
      // Every product source file counts, including files no test imports.
      thresholds: { 100: true },
    },
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["packages/*/src/**/*.test.{ts,tsx}", "scripts/**/*.test.ts"],
          environment: "node",
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          include: ["packages/*/integration/**/*.integration.test.ts"],
          environment: "node",
          globalSetup: ["packages/app/integration/global-setup.ts"],
          // Opens a browser per test and saves its screenshot to integration-evidence/, pass or fail.
          setupFiles: ["packages/app/integration/setup.ts"],
          fileParallelism: false,
          testTimeout: 60_000,
          hookTimeout: 180_000,
        },
      },
    ],
  },
});
