# API and UI foundations

- Agent: Codex; starting branch: main; commit: cde35e3273b4986a30318589c1351abc706803b3.
- Specification: ../specs/engineering-standards.md; owner explicitly authorizes shared foundations before domain features.
- Scope: Zod, apiHandler, makeCrudRoute, apiCall, minimal CrudForm/DataTable/feedback; synthetic service and UI tests only. No domain entities, business pages, event bus or commit.
- Plan: define validated transport and trusted server scope; centralize request handling and scoped CRUD; implement reusable client/UI primitives; exercise synthetic two-tenant behavior and UI interactions; run types, lint, tests and build; update guidance.
- Assumptions: actual authentication and database repositories remain future integrations. No client header/body establishes a tenant. Mutations require an injected server CSRF verifier. Synthetic services exist only in tests.
- Implemented: pinned Zod and test-only Testing Library/jsdom; core result schema; server-only handler and CRUD builder; same-origin client; shared flat-string form, paginated table and four feedback renderers; Polish message adapters. Updated AGENTS.md, README and the living standard, preserving earlier uncommitted changes.
- Isolation: every service call receives immutable tenant predicates or server-stamped create data; helper rejects foreign outputs and protected input. Synthetic session/mutation verifiers exist only in tests. Production identity, CSRF integration and SQL repositories remain unimplemented.
- Checks passed: frozen-lockfile install; pnpm typecheck in all four packages; pnpm lint; pnpm test (34 tests across 5 files); pnpm build; whitespace/diff and local documentation-link review.
- Behavioral evidence: concurrent two-tenant lists/counts, allowed CRUD, foreign-ID reads/writes/deletes denied, forged scope rejected, permission/CSRF refusal, safe errors, output validation, exact decimal strings, transport/handler round trip, malformed responses, cancellation, form field errors/keyboard/pending/dirty-state handling and table states/pagination/actions.
- Correction: cancellation during response body decoding must return ABORTED rather than PROTOCOL_ERROR; regression test added and reusable finding recorded in lessons.
- Not run: live PostgreSQL or real-browser visual checks. No database entities/migrations/configuration or visible application routes changed; service tests establish helper behavior, not SQL constraints. UI interactions ran in jsdom.
- Outcome: requested generic foundations implemented and verified. No domain model, business pages, event bus, commit, push or PR. The standard remains at its stable path because it governs ongoing development, including future domain-dependent requirements.

## Open state at handoff

Completed: shared foundations, documentation and all reported checks.

- Blocking decisions for the completed foundation task: 0.
- Owner-only clicks: 0.
- Authorized agent work remaining: 0.
- Backlog / deferred: 17; none blocks this completed task.
1. Order/trip/haul cardinality.
2. Cost/revenue components.
3. Accepted-plan checkpoint.
4. Empty-distance/shared-cost allocation.
5. Division attribution/report cutoff.
6. Money/fuel precision and rounding.
7. Net/gross and exchange rates.
8. Certainty validation/source conflict precedence.
9. Roles and authentication/session design.
10. Correction/retention policy.
11. First-slice integrations.
12. Confirm candidate concepts/names/ownership per feature.
13. Production auth/CSRF and SQL repositories/isolation tests.
14. Pure calculations and owner-approved synthetic golden cases.
15. Evidence adapters/reconciliation and durable events only when needed.
16. Evidence UI, advanced widgets/sorting/optimistic editing/navigation guard.
17. CI and optional Docker setup in a separate task.
