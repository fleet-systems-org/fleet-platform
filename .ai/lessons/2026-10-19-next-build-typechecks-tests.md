# Next.js build type-checks application test files

- Context: adding unit tests under packages/app/src for 100% coverage.
- Cause: `next build` runs TypeScript over the app tsconfig, which includes `src/**/*.test.ts(x)`; Vitest does not type-check, so tests passed while the build failed on loosely typed mocks.
- Resolution: typed mocks via `Awaited<ReturnType<typeof createDatabase>>` and an explicit strict Zod object type.
- Prevention: run `pnpm typecheck` (or `pnpm build`) after writing tests, not only `pnpm test`; CI runs both.
- Verification: typecheck reported 0 errors and build passed after the fix.
