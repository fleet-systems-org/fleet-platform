# Product brief: public copy

- Agent: Claude Code (Opus 5.5), interactive session with the owner.
- Starting branch: main; commit: 71341a5. Working branch: docs/product-brief.
- Objective (owner request): add the sanitised product brief at `.ai/specs/product-brief.md`, so the protected product contract in `SDLC.md` and the discovery-aware skills have a brief to read (decision D15).
- Specification: none applies; the brief is the product-context document `SDLC.md` names. Records read: AGENTS.md, `.ai/lessons.md`, `SDLC.md` (Definition of Ready, *Product decisions as a protected contract*), `.ai/agentic.config.json` (`discovery` block from PR #15).
- Actions: copied the owner's full brief (refreshed 2026-10-23, plus the owner's decisions of 2026-10-24: D16–D18, R05–R07) with the same headings and ids; named the client only as "a trading and transport company"; left out counterparties, rates, amounts, monthly figures and fleet counts; replaced private file references with source tags; replaced private decision-record ids with release element ids (E1–E15) and brief ids.
- Checks: scan of the new file for the company name, people, private paths, currency amounts and private decision ids — no hits; risk and open-question rows compared against the full brief. Not run: lint, typecheck, tests and build (documentation-only change; CI runs them).
- Outcome: brief added; awaiting owner review and merge.
- Remaining work: every later change to the full brief needs a matching update of this copy (D15); Q01 stays open, so the Definition of Ready is not signed.

## Refresh, 2026-10-24 (later the same day)

- Agent: Claude Code (Opus 5.5), interactive discovery session with the owner (`om-discover --mode client --refresh`), three question rounds.
- Objective: settle whether the Release 1.0 table binds and what the first specification covers; update stakeholders.
- Actions: recorded the owner's decisions D19–D27 and rule R08; closed Q01, Q05, Q07, Q14, Q15 and Q16; added Q17–Q19; rewrote the header, Decision summary and Definition of Ready addendum; marked D15 superseded by D27, so this file is now the only product brief, written here directly without client data.
- Review: two independent skeptical readings of the draft. The first found one critical gap (no source for each truck's last unloading in the first slice), answered by the owner (D24), and seven warnings, corrected (frequency overstated in D22, a co-owner's role resting on the owner's account, stale references); the second found no critical issue and four minor wording fixes, applied.
- Checks: scan for the company name, people, private paths, currency amounts, private decision ids and course references — no hits; Coverage recounted (83 tagged lines). Not run: lint, typecheck, tests and build (documentation-only change; CI runs them).
- Outcome: Definition of Ready signed by the owner for the first specification, except the past-trips comparison (Q19). Remaining: the P11 one-month check, the specification of the first slice, the prototype (D25), the management interview (P8).
