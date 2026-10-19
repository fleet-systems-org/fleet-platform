# Pull-request CI and testing

Status: **approved by explicit owner request (2026-10-19); in progress**.

## Problem

The repository has unit tests but no CI, no coverage requirement, no integration-test framework and no repeatable way to start a disposable application instance for browser checks. Pull requests can therefore merge without proof that the application builds, lints or works against PostgreSQL.

## Scope

- GitHub Actions workflow running on every pull request.
- Unit-test framework for TypeScript (Vitest) with an enforced 100% coverage threshold.
- Integration-test framework: PostgreSQL started by Testcontainers, reviewed migrations applied, a disposable production build of the application started against it and pages tested through the agent-browser CLI.
- A manual command that starts the same disposable instance for agents testing with agent-browser.
- A standing AGENTS.md rule requiring 100% unit-test coverage for every new feature.
- Unit tests covering 100% of existing product code; integration tests for the home and admin pages.

Out of scope: deployment, branch-protection settings (repository administration by the owner), business entities, authentication and dependency upgrades.

## Requirements

1. The workflow triggers on `pull_request` and reports separate checks for lint, typecheck, unit tests with coverage, build and integration tests. It uses read-only repository permissions, the pinned Node.js and pnpm versions and a frozen lockfile.
2. Unit tests run with `pnpm test`; `pnpm test:coverage` fails when statements, branches, functions or lines fall below 100% for any product source under `packages/*/src`, including files no test imports.
3. `pnpm test:integration` builds the application, starts PostgreSQL 18 through Testcontainers, applies migrations with the repository's MikroORM migration configuration, starts the built application on a free port and runs integration suites.
4. Integration page tests drive a real browser through the agent-browser CLI, each run in an isolated session.
5. All processes, browser sessions and containers started by tests are stopped after the run, including after failures.
6. No fixed ports: PostgreSQL uses a Testcontainers-mapped port and the application a port allocated by the operating system.
7. Documentation explains how to run unit, coverage and integration tests locally, the Docker and browser prerequisites, and how to start the disposable instance for agent-browser.
8. Test data are synthetic; logs do not expose connection strings.

## Tasks and verification

| # | Task | Verification |
| --- | --- | --- |
| T1 | Split Vitest into `unit` and `integration` projects; add v8 coverage with 100% thresholds. | Coverage run fails below the threshold (observed at 77.57% lines before new tests) and passes at 100%. |
| T2 | Add unit tests for every uncovered file and branch. | `pnpm test:coverage` reports 100% statements, branches, functions and lines. |
| T3 | Disposable-instance harness: Testcontainers PostgreSQL, migrations, `next start` on a free port, health wait, teardown. | Integration run passes; health endpoint returns 200 and the migration table exists; no containers or app processes remain afterwards. |
| T4 | agent-browser helper and page tests for `/` and `/admin`, including navigation between them. | Integration tests pass locally and in CI. |
| T5 | `pnpm app:ephemeral` command for manual agent-browser testing. | Command prints a URL; the page opens through agent-browser; Ctrl+C removes the container and process. |
| T6 | GitHub Actions workflow for pull requests. | All checks green on the pull request for this change. |
| T7 | AGENTS.md coverage rule; README and engineering-standards command table updated. | Diff review; referenced commands exist. |

## Acceptance criteria

1. **PR checks:** every pull request runs lint, typecheck, unit tests with coverage, build and integration tests as separate GitHub checks, all green for this change.
2. **Coverage 100%:** `pnpm test:coverage` enforces and reaches 100% statements, branches, functions and lines over existing product code; AGENTS.md states the rule for every new feature.
3. **Testcontainers with migration:** integration tests start PostgreSQL through Testcontainers, apply migrations with the repository migration configuration and verify the application reaches the database.
4. **agent-browser on home and admin:** integration tests use agent-browser to verify the home page, the admin page and the links between them.
5. **Cleanup:** containers, application processes and browser sessions are stopped after successful and failed runs.
6. **No fixed ports:** neither the database nor the application binds a hard-coded port during tests or the disposable instance.
7. **Run documentation:** README documents the test commands, prerequisites and disposable instance.

## Validation plan

Run lint, typecheck, `pnpm test:coverage`, `pnpm build` and `pnpm test:integration` locally on the agents VPS; check Docker for leftover containers and the process list for leftover servers after a passing and a deliberately failing run; open the pull request and confirm every CI check.

## Validation result

Pending.
