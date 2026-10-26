# Pricing review and delivery sequence

- Objective: resolve #27, align the brief and #21/#22 with the owner's 2026-10-26 decision; one PR, no merge.
- Agent: Codex; branch: cez/f912a161; starting commit: 35c10f016c8c04075ec24fdd1869c0f9a4b8d232.
- Authority: product brief R02–R08 and D07/D10/D16–D29; engineering standards. No approved E01 implementation specification exists; this run changes documentation only.
- Plan: recover and sanitise pricing behaviour, compare current rules, replace D25 with a superseding decision, validate, publish a PR, update issues and verify CI.
- Actions: added the analysis and synthetic examples; retained historical D25 and added D29; linked the analysis for the future E01 specification. Backlog map left untouched for #32 coordination.
- Validation: pnpm lint, pnpm typecheck, pnpm test:coverage (106 tests, all four metrics 100%), pnpm build and git diff --check passed. Six independent decimal-arithmetic assertions passed. No Markdown formatter is configured. Integration coverage is delegated to PR CI; no UI changes.
- Outcome: PR #33 opened against main, not merged. #21 is now the specification-derived mockup; #22 authors the whole E01 specification before that mockup and implementation. Both issues link PR #33; read-back confirmed the sequence. Local checks passed; remote CI is running and its final result will be recorded on the PR. Owner questions remain in the analysis and PR body. No new reusable finding required a separate entry.
