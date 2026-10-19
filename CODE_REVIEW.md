# Code review rules

This file holds fleet-platform's code-review rules. `om-code-review` (and `om-auto-review-pr`) applies it automatically; human reviewers use it the same way. It complements, and does not replace, the technical review checklist in [.ai/specs/engineering-standards.md §16](.ai/specs/engineering-standards.md#16-technical-code-review-checklist). That checklist is authoritative: when this file and the standards differ, the standards win, and this file should be corrected.

## Review priorities

Review in this order and report findings in the same order:

1. **Correctness of financial results.** A wrong number in trip profitability is the most expensive defect this product can ship.
2. **Company (tenant) isolation and authorization.** A query that is missing scope can expose another company's data.
3. **Contracts.** Shared helpers, the API envelope, package exports and migrations; see [BACKWARD_COMPATIBILITY.md](BACKWARD_COMPATIBILITY.md).
4. **Tests and evidence.** 100% coverage, plus integration screenshots for the pages and flows a PR adds or changes.
5. **Code quality and naming**, per standards §6.

## Repository-specific checks

### Scope and requirements

- Business entities, rules or financial policies must trace to an approved specification in `.ai/specs/`. This phase is infrastructure only: domain code without an approved spec is a **blocker**.
- Precision, scale and rounding choices must cite the owner's approval. Library defaults are not a business decision.

### Package boundaries

- `packages/core` imports no Next.js, MikroORM, Awilix, database access, `process.env` or provider SDKs. Business calculations are pure functions there.
- `packages/ui` imports nothing from `packages/db`, `packages/app/src/server` or ORM entities. Domain schemas, DTOs and translated labels arrive through props.
- Client components never import database access or server dependencies.
- New code goes to the target locations in standards §5. Flag a new folder pattern that duplicates an existing one.

### Money and fuel

- Money amounts and fuel quantities never pass through JavaScript `number`. Reject `parseFloat`, `Number(...)`, unary `+`, `.toNumber()`, `z.coerce.number()` and numeric form coercion on these fields.
- Use PostgreSQL `numeric`, `decimal.js` in code (re-exported from `@fleet-platform/core`) and decimal strings on the wire, validated with `decimalStringSchema` from `@fleet-platform/core/contracts/decimal`.
- An ORM decimal mapping needs a round-trip test without an intermediate `number`.

### API and shared helpers

- CRUD routes are generated only by `makeCrudRoute` (`packages/app/src/server/http/make-crud-route.ts`). A hand-written CRUD route, including CRUD disguised as a custom `apiHandler`, is a **blocker**.
- Non-CRUD business operations use `apiHandler` with an explicit command and a strict Zod input schema.
- Browser calls to `/api/*` go only through `apiCall` / `apiCallOrThrow` (`@fleet-platform/ui/backend/api`). A component that calls `fetch` against the application API, or decodes `res.json()` itself, is a **major** finding.
- Panels reuse `CrudForm`, `DataTable` and the `backend/feedback/*` components rather than copying them per page.
- Use cases throw `ApplicationError` with a fixed public code. Responses never expose stack traces, SQL, tokens or raw provider messages.
- Zod object schemas for mutations are strict: unknown fields are rejected, and raw bodies are never spread into entities.

### Tenant isolation

- Trusted company scope comes from authenticated server-side context, never from a body, query, header or webhook payload.
- Every repository query on company-owned data filters by tenant, including lookups by ID, counts, exports, updates, deletes and aggregates.
- A change to storage, query or auth scope ships a two-tenant isolation test that covers allowed same-tenant access and refused cross-tenant, missing-scope and forged-scope access. Without it the finding is a **blocker**.

### Persistence

- Migrations live in `packages/db/src/migrations/` and run explicitly through `pnpm db:migrate`. Never run them at boot, during render or in `pnpm build`; the build must work without a database.
- Review generated SQL for tenant constraints, indexes and destructive changes. Destructive or data-changing migrations need a rollback or forward-recovery note in the PR body.
- Concurrent edits use optimistic version checks. Import and idempotency keys use unique constraints, because a transaction alone does not prevent a check-then-insert race.

### UI

- User-visible text lives in `packages/app/src/messages/` (Polish displayed text, stable English keys), not inline in components.
- Pages are `page.tsx` with a named PascalCase default export ending in `Page`.
- Use Tailwind and shadcn/ui; shared components go to `packages/ui`.

### Security and data

- No secrets, `.env` content or real customer data in code, fixtures, snapshots, logs, issues or PRs. Tests use synthetic data only.
- Never interpolate untrusted input into SQL, shell commands, sort expressions or paths.

## Tests and evidence

- `pnpm test:coverage` must stay at 100% for statements, branches, functions and lines over `packages/*/src` and `scripts/`. Excluding files, adding ignore comments or lowering thresholds without the owner's approval recorded in the PR is a **blocker**.
- Every user-visible page or flow that a PR adds or changes needs an integration test (`pnpm test:integration`) and a screenshot in the `integration-evidence` CI artifact. Missing evidence makes the PR incomplete.
- A behavior-relevant bug fix needs a regression test that reproduces the original failure.
- Run `pnpm typecheck` after writing tests: `next build` type-checks application tests, and Vitest does not (see `.ai/lessons/2026-10-19-next-build-typechecks-tests.md`).

## Validation gate

The local gate is `pnpm lint`, `pnpm typecheck`, `pnpm test:coverage` and `pnpm build`, in that order (`.ai/agentic.config.json`). CI (`.github/workflows/ci.yml`) also runs the integration job. Every CI check must pass before merge.

## Severity guidance

| Severity | Use for | Effect |
| --- | --- | --- |
| **Blocker** | Wrong financial result, `number` on money or fuel, missing tenant scope or isolation test, hand-written CRUD route, coverage below 100%, secrets or customer data, domain code without an approved spec, breaking a protected contract without its required path | `changes-requested` |
| **Major** | Bypassed shared helper (`fetch`, copied form or table), missing integration evidence for a changed page, a missing regression test, a broken package boundary, an untranslated user-visible string | `changes-requested` |
| **Minor** | Naming or placement deviations from standards §5–§6, unclear comments, small duplication | May approve; file a follow-up |
| **Nit** | Style preferences that tooling does not enforce | Mention only |

The review states which checks it ran and which it did not; an unverified claim is not evidence.
