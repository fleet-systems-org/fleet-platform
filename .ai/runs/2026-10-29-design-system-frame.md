# Design system: screen requirements and frame components

## Objective and authority

Record the owner's decisions of 2026-10-29 on the E01 screen requirements and design-system gaps in packages/ui/POSTEP.md, then build `AppFrame`, `StepBar` and `RouteStops` in packages/ui. Read AGENTS.md, the lessons index, design-system-decisions.md (N6a, N7a–N7d, R17.1–R19.1, N2b, N4b, T4), the E01 foundations specification (SRC-4, FIN-3), packages/ui/POSTEP.md and the clickable prototype (`prototype/e01-clickable` at 7231c29).

Starting branch: design-system-product-5, from design-system-product-4 5c8e025 (pull request #53, not yet merged). Execution: coding assistant.

## Plan

1. Record requirements, gaps and owner decisions in packages/ui/POSTEP.md.
2. Build the three components with unit tests at 100% coverage, stories with interaction, axe and text-spacing tests, and a 13-section documentation page each.
3. Run typecheck, lint, coverage, token check, Storybook tests and build; inspect the diff; open a pull request without merging.

## Actions

- Recorded the requirements, gaps and owner decisions (W1, W2, AppFrame) in packages/ui/POSTEP.md.
- Built `AppFrame`, `StepBar` and `RouteStops` with unit tests, stories and documentation pages; added three layout tokens.
- Synthetic data aligned with the prototype (Auto 01, places A–C, 12.11.2026, Klient D) after a first draft used other values.
- Step names use `text-table`: the 12 px roles set the muted colour, and combining them with a colour utility has no precedent in the system.
- After #53 merged, the base moved to main and main was merged in without conflicts.
- Recorded the owner's L08 decision (no time limit on the screen; server-side limits and retries) under L08 in the decisions record and in POSTEP.md; the PlacePicker page no longer calls the time limit open. The screen map entry is in the private course repository (260eacd).
- Owner answers to proposals 1–7: 1–6 approved; `RouteStops` moved from `trips/` to `places/` (folders by foundation primitive), recorded in POSTEP.md.

## Validation and outcome

- Passed: pnpm typecheck, pnpm lint, node packages/ui/scripts/check-tokens.ts (zero values outside tokens).
- Passed: pnpm test:coverage, 202 tests, 100% statements (579/579), branches (459/459), functions (183/183), lines (490/490).
- Passed: pnpm test:storybook, 141 tests (interaction, axe, WCAG 1.4.12); pnpm build-storybook.
- Browser check of the built Storybook outside Git: no page errors and no horizontal scroll at 320, 600, 800, 1024 and 1440 px; screenshots inspected.
- Not run locally: integration tests (no application page changed); CI runs them.

Implementation complete; pull request publication follows. No merge is authorized. Remaining: L09 stays open.
