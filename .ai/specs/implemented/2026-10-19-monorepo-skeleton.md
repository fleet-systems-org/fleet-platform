# Monorepo skeleton

Status: implemented and verified; prepared for pull request review.
Source: owner's explicit implementation request in this thread on 2026-10-19.

## Scope

Create a runnable Next.js, React and TypeScript skeleton with app, core, db and ui workspaces. Configure PostgreSQL, MikroORM pooling and migrations, Awilix, Tailwind and shadcn/ui. Preserve agent rules, add Stack and update the README architecture and setup instructions.

## Boundaries

No business entities, domain rules, authentication or customer data. Core calculations must remain pure and database-independent. Money and fuel use PostgreSQL numeric and decimal.js, never JavaScript number; rounding policy is not decided here.

## Acceptance and validation

- Dependency installation is reproducible with the lockfile.
- Type checking, lint and production build pass without requiring a live database.
- Public and administrative placeholder pages render; UI components are shared.
- Database configuration validates input, supports an empty entity list and exposes migration commands.
- A database check and an HTTP health endpoint can execute a query against disposable PostgreSQL; failed connectivity returns a generic 503 without credentials.
- Documentation explains package boundaries, setup, checks and current limitations.

## Verification

Frozen-lockfile installation and peer checks passed. Type checking across all four packages, lint, five configuration tests and production build passed. Production routes / and /admin returned 200, rendered in a browser and used the shared styles. The admin page had no horizontal overflow at a 390px viewport.

Against disposable PostgreSQL 18, the connection check and migration command passed; /api/health returned 200 including 24 concurrent requests. With PostgreSQL stopped, health returned a generic 503 while the home page remained available. Docker Compose itself was not run because Docker was unavailable.

Compatibility deviation: TypeScript 6.0.3 and ESLint 9.39.5 are pinned because the current lint plugins do not support TypeScript 7 / ESLint 10. Next.js and React use the latest stable versions verified at implementation time. See ../../runs/2026-10-19-monorepo-skeleton.md.
