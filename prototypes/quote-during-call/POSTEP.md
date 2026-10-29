# Clickable prototype: quoting during the call — progress

Working log for the clickable prototype of #21 (E01-S01). Flow, screens and assumptions come from the grey discovery prototype [revision-002](../../.ai/prototypes/discovery/quote-during-call/revision-002/README.md) and the owner-approved screen map (2026-10-29, screens s01–s19, Phase 1 with a "show what comes later" control). Look comes from `packages/ui`; behaviour from the E01 specifications. The application does not import this prototype. Read this file first when resuming.

## Stages

| Stage | Status |
|---|---|
| 0. Plan | done 2026-10-29, approved |
| 1. Skeleton and happy path | done, waiting for owner review |
| 2. States, roles and scenarios | not started |
| 3. Honesty notes and verification | not started |

Branch `prototype/e01-clickable` from `main` 266e9e4.

## Stage 0. Plan (approved 2026-10-29)

### Technology

- React 19.3.1, Vite 8.3.5, `@vitejs/plugin-react` 6.1.2 and `@tailwindcss/vite` 4.3.3 (the exact versions of `packages/ui`) in a private package `@fleet-platform/prototype-quote-during-call`; `prototypes/*` added to `pnpm-workspace.yaml` (owner decision).
- Components, tokens and icons only from `@fleet-platform/ui` (`workspace:*`), including `DecimalField` and `ValueWithSource` (#43). Tabler icons.
- Build output: `packages/ui/.storybook/public/prototypes/quote-during-call/` with `base: "./"`, served by Storybook at `/prototypes/quote-during-call/index.html` (`staticDirs: ["./public"]`). The output is git-ignored.
- Data: fictitious, in memory, from the specification examples; fixed demo clock Thursday 2026-11-12 09:30 Europe/Warsaw. Money stays decimal strings; the result is freight minus cost in integer cents (`BigInt`), never JavaScript `number`.
- Navigation: hash `#s01`…`#s19`; each screen is `section.screen#sNN` with `.screen-meta`, `.frame` and `.notes` (review engine contract).
- Review engine (comments, screen map, presentation, Back) in `src/review/`: `prototype.js` unchanged, `comments.js` with `prototypeId: "quote-during-call"`, `mostek.css` mapped to the design tokens (light theme only).

### Screen order

- Stage 1 (dispatcher, Auto 01, draft K2): s01 → s09 (step 1 vehicle) → s10 → s09 (times, freight 60,00 EUR, "Bez mycia") → s11 → s12 (cost 38,18, result 21,82, "free in Miejsce C from 13:00") → s13 → s16 → s12 accepted → s07.
- Stage 2: s02–s05, s08, s14, s15, s18, every state, accounts and access gates; then the "show what comes later" control adds s06, s19 (Phase 2) and s17 (Phase 3).
- Stage 3: notes per screen, README with simulation limits, navigation tests, browser check at 320 and 1440 px and by keyboard.

### Review bar and scenario controls

`.doc-toolbar`, separate from the product header: "Prototyp" marker, screen select, comments, screen map, presentation, Back, reset, and a "Scenariusze" panel with controls p01–p19. No theme switch (light theme only).

### Demo accounts

`dyspozytor@`, `wlasciciel@`, `zaproszony@`, `odwolany@`, `biuro@` at `firma-demo.example` and `ktos@inna.example`. Passwords are neither checked nor stored; the sign-in screen says so and notes that the sign-in method awaits a decision. Invitation and reset e-mails are simulated.

### Components per screen

| Screen | From `packages/ui` | Gap |
|---|---|---|
| s01–s04 | Card, Field, Input, Button, Alert | — |
| s05 | Alert, Button | — |
| s06 | DataTable, Badge, Button | G12 |
| s07 | Card, Badge | G11, G13 |
| s08 | Dialog, Field, Input | G02, G03 |
| s09 | Field, DecimalField, RadioGroup, Select | G02, G03 |
| s10 | Dialog, Input, RadioGroup | G03 |
| s11 | Card, Badge, ValueWithSource | G13 |
| s12 | Card, Badge, Alert, ValueWithSource | G10, G13 |
| s13 | Popover, ValueWithSource | — |
| s14 | Dialog, DecimalField, Textarea | — |
| s15 | DataTable, Badge | G08 |
| s16 | AlertDialog, Textarea | — |
| s17 | DataTable, Badge, EmptyState | — |
| s18 | AlertDialog, Textarea | — |
| s19 | Badge, Alert | G13 |
| all | Skeleton, LoadingMessage, ErrorMessage | G12 |

### Design system gaps (`main` 266e9e4)

Each gap gets the simplest version built from tokens and existing components, marked in code with `DS GAP Gxx` and listed in the stage report.

- G02 zoned date-time field: date and time `Input`s labelled "Czas warszawski".
- G03 place picker: `Input` with results in a `Popover`.
- G08 table sorting: sort buttons in column headers.
- G10 warning: `Alert` `neutral` with a Tabler icon and the word "Uwaga".
- G11 trip status words: `Badge` `neutral` with Szkic, Przyjęty, Anulowany, Nieaktualna, Do przeglądu.
- G12 page frame, header and navigation.
- G13 trip sequence, country split and result panel.

Closed: G01 and G04 (#43), G05–G07 (#39); G09 not needed.

### Checks for every stage

- Package typecheck and build.
- `node packages/ui/scripts/check-tokens.ts prototypes/quote-during-call/src` with `src/review/` excluded (the engine has its own styles).
- Browser walk with screenshots: the stage path, one comment pinned to an element, comment export.
- `pnpm build-storybook`, then `/prototypes/quote-during-call/index.html` opened.
- `git diff --stat`: no changes in `packages/app` or `packages/ui/src`.

## Stage 1. Skeleton and happy path

Status: **done, waiting for owner review** (2026-10-29). Stages 2 and 3 remain not started.

### Delivered

- Private React/Vite workspace package using the exact existing UI dependency versions and `@fleet-platform/ui: workspace:*`. Run `pnpm --filter @fleet-platform/prototype-quote-during-call dev`; build and typecheck use the same package filter.
- Relative-asset build in the approved Storybook public directory; Storybook serves the built prototype. Generated bundles are ignored by Git and ESLint so lint still works after a build.
- Review engine copied with `prototype.js` byte-identical; comments ID `quote-during-call`; light-only token bridge. A separate integration module translates review labels without modifying the engine.
- Permanent s01–s19 sections; screen picker, map, presentation, Back, comments, reset. Only p02 dispatcher/owner and p19 Phase 1/later-preview controls. Future screens explicitly say they arrive in Stage 2.
- Happy path: s01 → s09 vehicle → s10 places → s09 times/freight/wash → s11 → s12 → s13 → s16 → accepted s12 → s07.
- Auto 01, K2, freight 60.00 EUR, cost 38.18 EUR, result 21.82 EUR and next availability in Miejsce C at 13:00 Europe/Warsaw. Cost rows: fuel 18.00, toll 10.00, AdBlue 0.18, wash 0.00, vehicle 6.00, labour 4.00. Source details use ValueWithSource; the nine-category vehicle-day fixture is explained in s13.
- Accepted K2 survives starting a blank quotation; K3 becomes stale and the terminal approach stays unassigned. Reset clears the simulation. Only the fixed example is quotable in this stage; other inputs are kept and explicitly directed to the supported example.
- Money is decimal text; result subtraction uses integer cents with BigInt. Whole kilometres on screens, exact three-decimal distances in details. No live provider or authentication calls; passwords are neither checked nor stored.

### Validation

| Check | Result |
|---|---|
| Package typecheck | passed |
| Package build | passed |
| Repository typecheck | passed |
| Repository lint | passed |
| Prototype source lint | passed |
| Repository unit tests | passed: 155 |
| Prototype token scan | passed: 0 |
| Storybook build | passed |
| Storybook hosted prototype | passed |
| Browser happy path, 1440 px | passed |
| Pinned comment + Markdown download | passed |
| Exact cents arithmetic | passed |
| Protected source diff | passed: empty |

Commands: `pnpm typecheck`, `pnpm lint`, `pnpm test`; package `typecheck` and `build`; `pnpm build-storybook`; explicit ESLint of the prototype TypeScript; `node packages/ui/scripts/check-tokens.ts prototypes/quote-during-call/src/app prototypes/quote-during-call/src/main.tsx` (review styles excluded). Key results: `Tests 155 passed (155)`, `No values outside the design tokens.`, `Storybook build completed successfully`.

The browser walkthrough checks the shown totals and availability, accepted confirmation, stale K3 and open approach; external screenshots cover every step including the acceptance dialog. A pinned review comment was downloaded through the engine's Markdown export and its screen ID and text were verified. Exact-arithmetic checks cover cost sum, positive/negative results and values beyond the JavaScript safe-integer range.

The base advanced while building: `main` incorporated #46 (`d8c8e4b`). Synced that existing baseline into this branch and adapted the prototype to DecimalField's required `kind="eurAmount"`; no design-system source was edited by this task. `git diff --stat origin/main -- packages/app packages/ui/src packages/ui/stories` is empty against that baseline.

Not run: Stage 2 scenario coverage; Stage 3 navigation suite, 320 px and exhaustive keyboard audit; application build/integration tests, coverage and Storybook story tests (production source is unchanged). Live provider correctness and real sign-in are outside this simulation. No pull request opened; no merge into the base branch.

### Design-system gaps used

- **G02** — separate date/time Inputs, explicitly Europe/Warsaw: `src/app/App.tsx`, s09 date/time block.
- **G03** — synthetic saved-place search using Input/Popover: `src/app/App.tsx`, s10.
- **G10** — engine warning/success aliases use neutral existing tokens, with words carrying status: `src/review/mostek.css`. No new success or warning palette.
- **G11** — neutral trip status words: `src/app/App.tsx`, s07.
- **G12** — review bar, header, navigation and screen frame: `src/app/App.tsx`, `src/app/styles.css`; engine stacking order and focus-shadow bridge in `src/review/mostek.css`.
- **G13** — route/result rows and trip sequence: `src/app/App.tsx`, s11/s12/s07, and `src/app/styles.css`.

G08 sorting is not used in this stage. G01/G04 use the delivered value components; G05–G07 use the delivered overlays. No shared DS component or token was added.

### Questions and explicit fixture limits

1. The owner-approved screen map assigns PL/DE/CZ to places A/B/C, but the synthetic calculation provides only approach/loaded totals, not a coherent country vector. s11 explicitly states this limit; it does not invent country kilometres or claim live cross-border pricing. Which country parts should the next stage demonstrate?
2. Loading time is absent from the example. Stage 1 visibly labels 12:00 as fictitious, between the specified 11:00 predecessor end and 13:00 unloading end. Confirm the loading time for a richer fixture.
3. The grey prototype's fictitious vehicle category split is retained as a daily-rate explanation. Whether to add per-category rounding reconciliation remains the existing revision-002 A10 question; this stage does not introduce a financial policy.

Next: owner reviews Stage 1 and decides whether to proceed to Stage 2. This prototype does not mark the E01 production specifications implemented.
