# Body text weight 500

## Objective and authority

Implement approved N2b in the shared design system. Read AGENTS.md, the lessons index, the overlay timing and coverage timeout lessons, engineering standards, design-system-decisions.md (N2a, N2b, R14.1, audit finding 6), and packages/ui/POSTEP.md.

Starting branch: feat/ui-body-weight-500, from main b737232. Execution: coding assistant.

## Plan

1. Capture the existing typography, fields, table and badges.
2. Load weight 500 from the existing font dependency and update ordinary text roles and documentation. Preserve heading weights and all other tokens.
3. Run the CI commands, inspect computed browser weights and capture the same views.
4. Inspect the diff, commit and open a pull request to main without merging.

## Actions

- Confirmed ordinary roles body, table, label, meta and number use weight 400; no component weight overrides need changing.
- The icon stroke measurement is independent of font loading and stays unchanged.

## Validation and outcome

- Passed: pnpm typecheck and pnpm lint (including the final story assertion change).
- Passed: pnpm test, 190 tests; pnpm test:coverage, 190 tests, 100% statements (519/519), branches (343/343), functions (163/163), lines (432/432).
- Passed: pnpm build and pnpm build-storybook.
- Passed: pnpm test:storybook, 116 tests, including computed 500 weights for ordinary roles and unchanged 600 headings.
- Passed: node packages/ui/scripts/check-tokens.ts packages/ui/src packages/ui/stories packages/ui/.storybook; zero values outside tokens. Mechanical style scan: no findings. git diff --check passed.
- Integration: the build passed; the initial browser launch failed because the browser executable was not configured, then because the temporary socket path was too long. With the installed browser and a short temporary directory configured externally, pnpm exec vitest run --project integration passed 5/5 tests and saved five screenshots. No repository workaround was added.
- Browser verification: captured matching before/after views of Typography, Field states, Data table and Badge variants outside Git. Computed weights changed from 400 to 500 for body, table, label, meta, number and inputs; page and section titles stayed 600.
- The initial parallel build attempt encountered the build lock; an isolated repeat passed. The first added story assertion referenced a role absent from that sample; corrected before the final 116/116 pass.
- CI uploads application screenshots through the existing integration-evidence artifact. The Storybook job does not upload screenshots; the eight comparison captures remain outside Git.

Implementation complete; pull request publication follows. No merge is authorized.
