# Design system CI checks

- Objective: add independent design-token and Storybook browser-test jobs to CI.
- Agent: Codex via Cezar.
- Starting branch: ci/design-system-checks, created from fresh origin/main.
- Starting commit: 657a3081e6b2f3058288c2cd3963e1c8820943c0.
- Requirements: owner's task; approved .ai/specs/2026-10-19-pull-request-ci-and-testing.md baseline, engineering standards, design-system-decisions.md and packages/ui/POSTEP.md deferred CI decision. The explicit task authorizes these additional checks; no feature-specification status changes are needed.

## Plan and actions

1. Reuse checkout and the shared setup action for both jobs.
2. Limit token scanning to packages/ui/src, stories and .storybook.
3. Install Chromium and system dependencies through the UI package's pinned Playwright CLI; run pnpm test:storybook.
4. Run local checks, inspect the diff, open one PR against main and verify all CI jobs.

## Validation

- Passed: pnpm install --frozen-lockfile; pnpm lint; pnpm typecheck; scoped token command (no values outside tokens); git diff --check.
- Failed: first pnpm test:storybook run, 95/96 passed; existing Select / Test: click and keyboard expected CZK, received PLN. No stories changed.
- Passed: repeated pnpm test:storybook, 96/96 tests across 18 files.
- Not run: remote CI (pending).

## Outcome and remaining work

Implementation and required local validation complete; publication and remote CI pending. No component, story, test, dependency or coverage changes.
