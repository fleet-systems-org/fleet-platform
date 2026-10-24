# Product brief: past similar trips (Q19)

- Agent: Claude Code (Opus 5.5), interactive session with the owner; data check by a Codex run (read-only, aggregates only).
- Starting branch: main; commit: see the PR base. Working branch: docs/brief-q19.
- Objective: answer Q19 — where past similar trips in the first quote come from and what counts as similar (D26).
- Actions: an aggregate check of the accounting and telematics data (P11) found routes readable from nearly all transport invoices and many repeating routes, while the invoice → unloading → fuel join stayed unmeasured; the owner chose the agent's recommendation (D28). Updated the header, Decision summary, Scope, D28, A03, A05, Q19, the Definition of Ready addendum and P11.
- Checks: scan for the company name, people, private paths, currency amounts, private decision ids and course references — no hits (the only percentage is the existing target C1); Coverage recounted (84 tagged lines). Not run: lint, typecheck, tests and build (documentation-only change; CI runs them).
- Outcome: the first specification has no blocking question left. Remaining: the specification, the prototype (D25), the management interview (P8).
