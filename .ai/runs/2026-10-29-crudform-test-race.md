# CrudForm unit test race

- Objective: find why "CrudForm validates before submit and preserves an exact decimal string" intermittently fails in the coverage CI job (#41, #43, #53) and fix the cause without raising limits.
- Specification: none applies (test reliability only). Guided by AGENTS.md engineering standards and [the lesson](../lessons/2026-10-29-async-find-timeout-under-coverage.md), which this run corrects.
- Agent: Claude Code. Starting branch: `fix/crudform-test-slowdown` from `origin/main` at `bf659ef`.
- Actions: read the failed CI logs (runs 40894819099, 40903738858, 40917768054; first attempts); reproduced locally with and without coverage, under six parallel copies and on one core; instrumented focus, input value and submit calls; found that a pending passive focus effect discards the edit made right after `findBy…` resolves, and a pending passive cleanup leaves the `beforeunload` guard active. Changed only `CrudForm.test.tsx`: wait for focus before editing, check the cleared guard in `waitFor`, return both queries to the default timeout.
- Validation passed: before 7 failures in 48 runs, after 0 failures in 60 runs (details in the lesson); `pnpm test:coverage` (190 tests, 100% on all four metrics), `pnpm lint`, `pnpm typecheck`.
- Not run: integration tests and build (unit test change only). CI is reported on the pull request.
- Outcome: cause found with evidence and fixed in the test; the component is unchanged. Only the owner merges.
