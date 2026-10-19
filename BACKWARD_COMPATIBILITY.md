# Backward compatibility

This file lists the surfaces fleet-platform treats as protected contracts and the path a change to each must follow. Review skills check PRs against it; implementation skills warn when a change does not comply.

The product is pre-release: there are no external API consumers, no published packages and no persisted business data yet. Most of the protection is therefore internal. The four workspace packages, the CI pipeline and the agents that build on the shared helpers all depend on these surfaces staying stable or changing deliberately. The rules tighten when the first domain feature, real data or an external consumer arrives; update this file in the same PR that introduces one.

## What counts as breaking

A change is breaking when existing code, data, configuration or a documented command written against the previous version stops working or changes meaning without being edited. Renaming, removing, narrowing an accepted input, widening a returned shape that callers parse strictly, and changing a default are all breaking.

## Protected surfaces

### 1. Workspace package exports

The `exports` maps in `packages/core/package.json`, `packages/db/package.json` and `packages/ui/package.json` are the public API between packages:

| Package | Entry points |
| --- | --- |
| `@fleet-platform/core` | `.` (re-exports `Decimal`), `./contracts/api`, `./contracts/application-error`, `./contracts/decimal` |
| `@fleet-platform/db` | `.` (`createDatabase`, `createDatabaseConfig`, the `MikroORM` and `EntityManager` types) |
| `@fleet-platform/ui` | `./components/*`, `./lib/*`, `./styles.css`, `./backend/api`, `./backend/forms/CrudForm`, `./backend/tables/DataTable`, `./backend/feedback/*` |

Breaking: removing or renaming an entry point or an exported symbol, or changing an exported function's signature or semantics.
Required path: update every consumer in the same PR, so that `pnpm typecheck` and `pnpm build` pass across the workspace, and state the change in the PR body. Importing a package's internal files that are not in its `exports` map is not supported and is not protected.

### 2. Shared HTTP helpers

`apiHandler`, `ApiHttpError`, `readJson`, `readQuery` and `assertEmptyQuery` (`packages/app/src/server/http/api-handler.ts`), and `makeCrudRoute` (`packages/app/src/server/http/make-crud-route.ts`), with the guarantees described in standards §11: authenticated scope, permission checks, strict validation, tenant-bound service filters, bounded `offset`/`limit` pagination and safe errors.

Breaking: weakening any of those guarantees, changing the option names, or changing the methods `makeCrudRoute` generates (`collection` GET/POST, `item` GET/PATCH/DELETE).
Required path: an approved specification change, with updated tests covering both tenants, in the same PR. Any change that relaxes tenant isolation is `risk-high` (see `SDLC.md`).

### 3. API response envelope

The wire shape is `{ ok: true, data, meta? }` or `{ ok: false, error: { code, messageKey, fieldErrors?, correlationId } }`, defined by `apiResultSchema` in `packages/core/src/contracts/api.ts` and decoded by `apiCall` in `packages/ui/src/backend/api/apiCall.ts`.

Breaking: renaming or removing a field, changing the discriminator, or changing the meaning of an error `code` or `messageKey` that callers or translations rely on.
Required path: change the schema, `apiCall` and every translation key in `packages/app/src/messages/` together. Adding an optional field is not breaking.

### 4. HTTP routes

The only route today is `GET /api/health`: it returns `200 { "status": "ok" }` when the database answers and `503 { "status": "unavailable" }` otherwise, both with `Cache-Control: no-store`. Integration tests and deployment health checks depend on it.

Breaking: changing its path, method, status codes or body.
Required path: update the integration tests and note the change for whoever operates deployments. Feature routes under `packages/app/src/app/api/<concept>/` join this list when they ship; record each one here in the PR that adds it.

### 5. Database schema and migrations

Migrations live in `packages/db/src/migrations/`; none exist yet.

Breaking: editing or deleting a migration that has already merged, dropping or renaming a column or table that holds data, and narrowing a type or constraint on existing data.
Required path: never rewrite a merged migration; add a new one. Destructive or data-changing migrations need a migration test, both up and down or a stated forward-recovery path, on disposable PostgreSQL, plus a rollback plan in the PR body (`risk-high`). Accepted plans and financial evidence are kept as revisions, never silently deleted (standards §8).

### 6. Decimal string contract

`decimalStringSchema` (`@fleet-platform/core/contracts/decimal`) accepts canonical signed decimal strings, preserves every digit and rejects numbers, exponents, commas, whitespace and non-finite text.

Breaking: accepting `number`, coercing, trimming digits or changing which strings are valid.
Required path: an owner-approved change to the precision and rounding rules, then updated tests.

### 7. Environment configuration

`.env.example` documents `DATABASE_URL`, `POSTGRES_USER`, `POSTGRES_PASSWORD` and `POSTGRES_DB`; `compose.yaml` consumes the `POSTGRES_*` variables.

Breaking: renaming or removing a variable, or changing its expected format.
Required path: update `.env.example`, `compose.yaml`, `README.md` and any CI usage in the same PR, and call it out in the PR body, because every contributor's local `.env` breaks.

### 8. Root commands and CI checks

The root `package.json` scripts (`dev`, `build`, `start`, `typecheck`, `lint`, `test`, `test:coverage`, `test:integration`, `app:ephemeral`, `db:*`), the job names in `.github/workflows/ci.yml` and the `integration-evidence` and `coverage-report` artifact names are referenced by `AGENTS.md`, `SDLC.md`, `.ai/agentic.config.json` and the agent skills.

Breaking: renaming or removing a script, a CI job or an artifact.
Required path: update every reference (`AGENTS.md`, `SDLC.md`, `CODE_REVIEW.md`, `.ai/agentic.config.json`, branch protection's required checks) in the same PR.

### 9. Agent pipeline configuration

`.ai/agentic.config.json`, `.ai/trackers/github.md` and `.ai/browsers/agent-browser.md` are read by every `om-*` skill.

Breaking: removing keys, renaming labels in the taxonomy, or changing validation commands without updating `SDLC.md`.
Required path: change the config and `SDLC.md` together, and re-run `om-setup-agent-pipeline` when the toolchain or label taxonomy changes.

## Not protected

- Files outside a package's `exports` map, test helpers and `packages/app/integration/`.
- Displayed Polish text, which may change freely. Translation keys are protected only where §3 says so.
- Visual layout and styling, unless a spec states otherwise.
