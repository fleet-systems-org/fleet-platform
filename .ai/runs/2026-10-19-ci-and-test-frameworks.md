# CI and test frameworks

- Agent: Claude Code (Opus 5.5).
- Starting branch: main; commit: 416ddf11cbda60b5365a1a5f7ba89bb316682a93. Working branch: feat/ci-test-frameworks.
- Objective (owner request): GitHub CI for every pull request with build, lint, a TypeScript unit-test framework and an integration-test framework that starts PostgreSQL through Testcontainers, runs a disposable application instance and tests it through agent-browser. Add a standing AGENTS.md rule requiring 100% unit-test coverage for every new feature, unit tests covering 100% of existing code and integration tests for the home and admin pages.
- Specification: [engineering standards](../specs/engineering-standards.md), section 14 (tests). No separate feature specification; the owner's explicit request authorizes this infrastructure work. Lessons read: [scope test discovery](../lessons/2026-10-19-scope-test-discovery.md).
- Plan: extend the existing Vitest setup into `unit` and `integration` projects; enforce 100% v8 coverage over product sources; add a reusable disposable-instance harness (Testcontainers PostgreSQL 18 + `next start`) used by integration tests and by a manual command for agents; drive the pages with the agent-browser CLI; add a pull-request workflow; update AGENTS.md, README and the standard's command table.
