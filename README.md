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

## Local setup

Requires Node.js 24, pnpm 11.10.0 and PostgreSQL (the optional Compose service uses PostgreSQL 18). Install the declared pnpm version using Corepack or `npm install --global pnpm@11.10.0`.

```sh
pnpm install --frozen-lockfile
cp .env.example .env
docker compose up -d --wait postgres
pnpm db:check
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

Database commands load the root `.env`: `pnpm db:debug` inspects ORM setup, `pnpm db:migration:create` generates a migration after entities are defined, and `pnpm db:migrate` applies reviewed migrations. Do not create business tables yet. Review debug output locally before sharing it because configuration diagnostics may contain connection details.

Shared packages export TypeScript source and are transpiled by Next.js. The shadcn/ui configuration routes shared components to `packages/ui`; run its CLI from `packages/app` when adding components. UI text is currently Polish and kept in a separate messages module.

## Tools

Claude Code and Codex are the coding agents. Shared instructions live in AGENTS.md; CLAUDE.md imports them. GitHub is the single source of truth for code, issues, pull requests and CI. CI automation is not configured yet.

## Data

This repository never contains customer data. Tests use synthetic data only.
