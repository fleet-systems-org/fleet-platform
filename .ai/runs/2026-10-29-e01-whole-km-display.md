# E01 whole-kilometre display

- Objective: record the owner's 2026-10-29 display decision and align issues #22/#25. Documentation only.
- Specification: approved [foundations](../specs/2026-10-26-e01-foundations.md), FIN-2/FIN-3/EV-4; [brief](../specs/product-brief.md), R11/D65; [design decisions](../specs/design-system-decisions.md). Overall implementation status remains unchanged.
- Agent: Codex. Starting branch: `docs/e01-whole-km-display`; starting commit: `d8c8e4b0860fbfa5261842c9ee418dc29ea109ed` (fresh `origin/main`).
- Plan: distinguish display from publication, inspect existing component, edit only the specified issue lines and comment, validate documentation, open one review-ready PR. Only the owner merges.
- Actions: clarified EV-4, added D65 while retaining R11 history, aligned design decision entries. Inspected `ValueWithSource` and decimal formatter; `displayScale=0` rounds half-up while details retain the published value. No code changes or component discrepancy found.
- Validation passed: `pnpm lint` (exit 0, no ESLint errors); `git diff --check`; manual diff review (documentation only); all 12 relative Markdown links in changed documents resolve. FIN-2 and FIN-3 text is unchanged.
- Not run: typecheck, unit/coverage, build, integration and browser QA (documentation-only change). CI is reported separately.
- Issues: #25 and #22 each received exactly the requested one-line replacement and an English decision comment referencing PR #40. Re-read full bodies through `gh issue view` and verified byte-for-byte equality with the originals after only that replacement.
- Outcome: documentation ready for review; no code changes or new follow-up found. Only the owner merges.
