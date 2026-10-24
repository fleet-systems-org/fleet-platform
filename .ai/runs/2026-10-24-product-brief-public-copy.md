# Product brief: public copy

- Agent: Claude Code (Opus 5.5), interactive session with the owner.
- Starting branch: main; commit: 71341a5. Working branch: docs/product-brief.
- Objective (owner request): add the sanitised product brief at `.ai/specs/product-brief.md`, so the protected product contract in `SDLC.md` and the discovery-aware skills have a brief to read (decision D15).
- Specification: none applies; the brief is the product-context document `SDLC.md` names. Records read: AGENTS.md, `.ai/lessons.md`, `SDLC.md` (Definition of Ready, *Product decisions as a protected contract*), `.ai/agentic.config.json` (`discovery` block from PR #15).
- Actions: copied the owner's full brief (refreshed 2026-10-23, plus the owner's decisions of 2026-10-24: D16–D18, R05–R07) with the same headings and ids; named the client only as "a trading and transport company"; left out counterparties, rates, amounts, monthly figures and fleet counts; replaced private file references with source tags; replaced private decision-record ids with release element ids (E1–E15) and brief ids.
- Checks: scan of the new file for the company name, people, private paths, currency amounts and private decision ids — no hits; risk and open-question rows compared against the full brief. Not run: lint, typecheck, tests and build (documentation-only change; CI runs them).
- Outcome: brief added; awaiting owner review and merge.
- Remaining work: every later change to the full brief needs a matching update of this copy (D15); Q01 stays open, so the Definition of Ready is not signed.
