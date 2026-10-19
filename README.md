# fleet-platform

fleet-platform is a micro-ERP for trading and transport companies. Its first module is trip profitability: before accepting an order, the dispatcher sees whether the trip pays; after the trip, planned and actual figures from GPS, fuel cards and invoices appear side by side for every cost component, with every number marked as certain or estimated. Management gets a monthly summary. More modules will follow, one at a time.

## Status

Early stage, built step by step. The infrastructure skeleton is in place; business modeling and trip profitability will follow requirements analysis. There are no business entities or authentication yet. This README will evolve as the project progresses.

## Architecture

A pnpm monorepo using Next.js App Router, React and TypeScript:

The initial setup pins Next.js 16.4.2 and React 19.3.1. TypeScript 6.0.3 and ESLint 9.39.5 are compatibility pins: the current Next.js lint plugins do not yet support the newest TypeScript 7 / ESLint 10 combination. Revisit these pins together when the toolchain supports it.

| Package | Responsibility |
| --- | --- |
| `packages/app` | Pages, server routes and the Awilix composition root. |
| `packages/core` | Reusable primitives and future pure business calculations, without database or framework access. |
| `packages/db` | PostgreSQL, MikroORM connection pooling and migration tooling. |
| `packages/ui` | Shared Tailwind styles and shadcn/ui components for administrative interfaces. |

The application connects these packages; core never imports app, db or ui. PostgreSQL connections are initialized lazily, with a shared pool and a fresh EntityManager for each request scope. Migrations run explicitly through the CLI, never during page rendering or builds. The entity list and migration directory are intentionally empty.

Money and fuel quantities use PostgreSQL `numeric` and `decimal.js`, never JavaScript `number`. Exact values cross JSON boundaries as decimal strings. Precision and rounding policy will be agreed before implementing calculations.

## Engineering standards

[Engineering standards](.ai/specs/engineering-standards.md) define the mandatory conventions for new features: package boundaries, tenant isolation, exact decimal values, shared API/UI patterns and technical review. AGENTS.md requires every coding agent to follow them. Shared API/UI foundations now exist: Zod contracts (including exact decimal strings), framework-independent application errors, `apiHandler` with safe diagnostic correlation IDs, tenant-scoped `makeCrudRoute`, `apiCall`, `CrudForm`, `DataTable` and feedback. Synthetic tests exercise them without domain entities or public demo routes. Real authentication, database repositories and business calculations are not implemented.

## Local setup

Requires Node.js 24, pnpm 11.10.0 and PostgreSQL (the optional Compose service uses PostgreSQL 18). Install the declared pnpm version using Corepack or `npm install --global pnpm@11.10.0`.

The quickest path is one command, which prepares everything and then tells you to run `pnpm dev`:

```sh
pnpm bootstrap
```

It installs dependencies, creates `.env` from `.env.example` when missing (an existing `.env` is never changed), checks the database at `DATABASE_URL` and applies migrations. Docker Compose starts PostgreSQL only when that database does not respond, so an already running database (for example one started from another worktree) is reused and no second container competes for the port. When neither the database nor Docker is available, the run stops with instructions. It is safe to re-run: completed steps are skipped or finish as no-ops. A failing step stops the run with a message naming the step.

Alternatively, run the same steps manually:

```sh
pnpm install --frozen-lockfile
cp .env.example .env
docker compose up -d --wait postgres
pnpm db:check
pnpm db:migrate
pnpm dev
```

If Docker is unavailable, use a separately managed PostgreSQL database and set `DATABASE_URL` in `.env`; skip the Compose command. The example credentials are for disposable local development only. Keep the URL and the Compose credentials consistent if changing them.

Open `http://localhost:3000` on the machine running the app. `/admin` is a public placeholder, not a protected management panel. `/api/health` checks the database and returns 200 on success or a generic 503 when configuration or connectivity fails. The pages and production build work without a database; the health check does not. Development and production scripts bind to loopback by default.

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm start
```

### Tests

| Command | Purpose |
| --- | --- |
| `pnpm test` | Unit tests (Vitest) under `packages/*/src`. UI and page tests use Testing Library with jsdom. |
| `pnpm test:coverage` | Unit tests with v8 coverage; fails below 100% statements, branches, functions or lines. The HTML report is written to `coverage/`. |
| `pnpm test:integration` | Builds the app, starts PostgreSQL 18 through Testcontainers, applies migrations, serves the build on a free loopback port and runs `packages/*/integration/**/*.integration.test.ts`. Pages are tested in a real browser through the agent-browser CLI. |
| Evidence | Every integration test saves `integration-evidence/<test-name>.png` after it finishes, passed or failed, together with `integration-evidence/app.log` (migration and application output, database URL masked). The directory is recreated on each run, ignored by Git and uploaded by CI as the `integration-evidence` artifact. Tests get the browser from `browser()`; `setup.ts` opens and captures it automatically. |
| `pnpm app:ephemeral` | Starts the same disposable instance and prints its URL for manual checks, e.g. `pnpm exec agent-browser open <url>`. Ctrl+C stops the app and removes the database container. |

Integration tests need a running Docker daemon reachable by the current user and a browser for agent-browser: run `pnpm exec agent-browser install` once (`--with-deps` also installs Linux system libraries), or point `AGENT_BROWSER_EXECUTABLE_PATH` at an existing Chrome/Chromium. Ports are never fixed: Testcontainers maps the database port and the app port is allocated by the operating system. Containers, the app process and browser sessions are stopped after every run, including failed runs; the Testcontainers Ryuk sidecar removes containers if the test process is killed. Neither command needs `.env`.

### Continuous integration

`.github/workflows/ci.yml` runs on every pull request with separate checks: Lint, Typecheck, Unit tests (100% coverage), Build and Integration tests (Testcontainers + agent-browser).

Database commands load the root `.env`: `pnpm db:debug` inspects ORM setup, `pnpm db:migration:create` generates a migration after entities are defined, and `pnpm db:migrate` applies reviewed migrations. Do not create business tables yet. Review debug output locally before sharing it because configuration diagnostics may contain connection details.

Shared packages export TypeScript source and are transpiled by Next.js. The shadcn/ui configuration routes shared components to `packages/ui`; run its CLI from `packages/app` when adding components. UI text is currently Polish and kept in a separate messages module.

## Tools

Claude Code and Codex are the coding agents. Shared instructions live in AGENTS.md; CLAUDE.md imports them. GitHub is the single source of truth for code, issues, pull requests and CI. CI runs on every pull request (see Tests).

## Data

This repository never contains customer data. Tests use synthetic data only.
