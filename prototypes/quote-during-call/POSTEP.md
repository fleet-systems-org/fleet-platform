# Clickable prototype: quoting during the call — progress

Working log for the clickable prototype of #21 (E01-S01). Flow, screens and assumptions come from the grey discovery prototype [revision-002](../../.ai/prototypes/discovery/quote-during-call/revision-002/README.md) and the owner-approved screen map (2026-10-29, screens s01–s19, Phase 1 with a "show what comes later" control). Look comes from `packages/ui`; behaviour from the E01 specifications. The application does not import this prototype. Read this file first when resuming.

## Stages

| Stage | Status |
|---|---|
| 0. Plan | done 2026-10-29, approved |
| 1. Skeleton and happy path | in progress |
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

Not started.
