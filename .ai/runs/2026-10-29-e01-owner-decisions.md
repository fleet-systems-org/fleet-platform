# E01 owner decisions — 2026-10-29

- Objective: record D63/D64 and clarify wash input and VehicleStart permission; one review-ready documentation PR to main. No issue edits, implementation, approval or merge.
- Agent: Codex, Cezar task 24d0ff69-d5bd-4612-824d-0267eb83c8c5.
- Starting branch: docs/e01-owner-decisions-2026-10-29, created from freshly fetched origin/main.
- Starting commit: 196a2bbe4d6561b53290de85ca1d492d187b7a89.
- Authority: AGENTS.md; lessons index and relevant foundation-completion and source-granularity findings; product brief; approved E01 foundations and feature specifications.
- Plan: inspect existing contracts, minimally record owner decisions, inspect diff and validate documentation, commit and open one PR. Preserve unrelated decisions and specification implementation status.

## Actions and findings

- Added D63 (mandatory wash date, optional time), refining only wash time in R07/R09/D18; added D64 confirming D61 for start entry. Updated feature data model, input, UI and scenarios; AUTH-4 explicitly assigns VehicleStart to existing trips.write for both roles.
- R09/D31 and revenue/coveredCost formulas already make our wash a carrier cost, without client-paid revenue; left them unchanged. Owner reaffirmation: "R09/D31 applies (the wash is always the carrier's cost); #25 AC3 to be corrected" [PL: „obowiązuje R09/D31 (mycie zawsze kosztem przewoźnika); #25 AC3 do poprawy”].
- Timing analysis: TIME-1 requires exact start/end on a wash MovementSegment, whereas a date-only wash cannot define those instants or duration. BND-1 and elapsed cost formulas use the whole trip anchors, not wash time directly; BND-2 uses fixed stop times. SRC-2 chooses FX by requested date but the wash document date versus entered wash date is not explicitly mapped. No default time, duration or FX mapping invented; PR records questions for the owner before implementation.
- EV-4, kilometre rounding, other policies, application code and issues #22/#25 unchanged. Specifications remain approved and not implemented.

## Validation and outcome

- Passed: `pnpm lint` (exit 0; `eslint packages scripts`, no errors).
- Passed: `git diff --check` and manual review of all specification hunks; only D63/D64 added, only R07/R09/D18 status cells refined, existing wash-cost formulas unchanged.
- Passed: local structural checks of decision IDs, Markdown table column counts, relative Markdown links in changed documents, and scope against origin/main.
- Not run: typecheck, unit/coverage, build, integration and browser QA; documentation-only changes, no executable code or UI changed. CI remains a separate check, not claimed passed.
- Outcome: documentation ready for review, with wash segment/FX questions explicitly deferred to owner review in the PR. Issues #22/#25 remain unedited; proposed AC text is in the PR body. No merge, approval or auto-merge.

- PR: https://github.com/fleet-systems-org/fleet-platform/pull/40 — opened ready for review against main; owner-only merge.
