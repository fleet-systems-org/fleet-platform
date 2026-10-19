# Engineering standards adoption

- Agent: Codex.
- Starting branch: main; commit: cde35e3273b4986a30318589c1351abc706803b3.
- Objective: adopt the engineering standards under the owner's explicit implementation request.
- Specification: ../specs/engineering-standards.md; existing skeleton: ../specs/implemented/2026-10-19-monorepo-skeleton.md.
- Guidance: AGENTS.md, lessons index and test-discovery lesson, previous skeleton run.
- Plan: audit the existing skeleton; adopt mandatory engineering instructions and fix applicable naming; clarify whether shared helpers should precede their first real consumer; validate the resulting changes.
- Assumption: business concepts, authentication choices and financial policies remain unapproved. Do not scaffold speculative modules or change the stack.
- Audit: current main matches origin/main; only the owner-requested standards document was untracked at start. Existing package direction, translated UI, pure core, request EntityManager scopes and explicit migrations follow the applicable baseline. No business storage, CRUD routes or browser API calls exist.
- Actions: adopted standards in AGENTS.md and README; preserved the single CLAUDE.md import; renamed existing page exports to HomePage and AdminPage; updated standards status and added an explicit adoption/deferred-capabilities record. No stack changes or speculative helper/domain implementation.
- Checks passed: pnpm typecheck (all four packages), pnpm lint, pnpm test (5 tests), pnpm build (home/admin static pages and existing health route), git diff --check, local documentation links and unchanged CLAUDE import.
- Not run: browser or live PostgreSQL checks; no visible UI, persistence or database configuration behavior changed. No new tests were added for component identifier renames.
- Scope resolution: asked whether to override the first-consumer rule; no response arrived during the independent work. Followed the specification's explicit incremental adoption order. No new durable lesson was invented for routine adoption.
- Outcome: baseline adopted for the existing skeleton. Shared helpers, authentication, tenant-owned storage and business behavior remain feature-dependent work, explicitly recorded in the standard. No commit, push or PR performed.
