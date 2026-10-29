import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

// Enforce the package graph for imports and re-exports, including relative paths.
function packageBoundary(files, forbiddenPackages, forbiddenLibraries = []) {
  return {
    files,
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [
          {
            regex: `^(?:@fleet-platform/(?:${forbiddenPackages.join("|")})(?:/|$)|(?:\\.\\./)+(?:${forbiddenPackages.join("|")})(?:/|$))`,
            message: "Respect the package dependency direction in the engineering standards.",
          },
          ...forbiddenLibraries.map(library => ({
            group: [library, `${library}/**`],
            message: "Keep framework, persistence and dependency-injection code in its owning layer.",
          })),
        ],
      }],
    },
  };
}

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  { settings: { next: { rootDir: "packages/app/" } } },
  packageBoundary(["packages/core/**/*.{ts,tsx}"], ["app", "db", "ui"],
    ["next", "react", "react-dom", "@mikro-orm/*", "awilix", "server-only"]),
  packageBoundary(["packages/db/**/*.{ts,tsx}"], ["app", "ui"],
    ["next", "react", "react-dom", "awilix"]),
  packageBoundary(["packages/ui/**/*.{ts,tsx}"], ["app", "db", "core"],
    ["@mikro-orm/*", "awilix", "server-only"]),
  globalIgnores(["**/.next/**", "**/dist/**", "**/next-env.d.ts", "**/storybook-static/**"]),
]);
