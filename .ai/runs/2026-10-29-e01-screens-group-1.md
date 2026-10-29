# E01 screens, group 1: s09, s10, s11

## Objective and authority

Build the E01 screens s09 (trip entry), s10 (place choice) and s11 (route and countries) as stories composed from real components in their screen-map states; record the owner's L09 decision and change `PlacePicker` for it. Read AGENTS.md, .ai/lessons.md, design-system-decisions.md, the E01 specifications (ROUTE-1, BND-3, BND-4, PLACE-1–3, AUTH-4), packages/ui/POSTEP.md and the clickable prototype.

Starting branch: design-system-e01-screens-1, from main d53b126. Execution: coding assistant.

## Actions

- Recorded L09 in the decisions record and POSTEP.md; updated the PlacePicker documentation.
- PlacePicker: lists the page's options when nothing is found; "Dodaj miejsce" only while a map address is chosen, passing it to `onAddPlace(option)`.
- Added the screen stories under `packages/ui/stories/screens/e01/`; states waiting for L01, L10, L11, L21 and L30 are listed, not drawn.

## Validation and outcome

- Passed: pnpm lint, pnpm typecheck, token check, pnpm test:coverage (202 tests, 100%), pnpm test:storybook (174 tests), pnpm build-storybook; screenshots of four screen states inspected outside Git.
- Not run locally: integration tests (no application page changed); CI runs them.

Implementation complete; pull request ready for review. Remaining: owner answers to the three proposals in POSTEP.md; open gaps L01, L10, L11, L21, L30.

## Owner decision D1

Owner decision D1: screens live in the clickable prototype, and Storybook keeps components and an epic page linking to it. The s09–s11 screen stories were removed from this branch; the pull request keeps L09 and the PlacePicker change. Rebuilding the prototype on the current components is the next pull request.
