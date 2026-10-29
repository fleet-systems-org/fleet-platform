# Design system progress

Working log for the design system and its Storybook in `packages/ui`. Local branch `design-system-storybook` (from `main` 6588042); nothing is pushed. Read this file first when resuming.

Sources the system is built from (reference IDs such as R06.4, antireferences such as A01 and token names refer to owner-provided reference and token tables kept outside this repository): `.ai/specs/product-brief.md`, `.ai/specs/backlog.md`, `.ai/specs/2026-10-26-e01-foundations.md`, `.ai/specs/2026-10-26-e01-trip-entry-and-quotation.md`, a screen audit and the existing `packages/ui`.

## Stages

| Stage | Status |
|---|---|
| 0. Inventory and plan | done 2026-10-29, approved |
| 1. Foundations | done 2026-10-29, waiting for owner "next" |
| 2. Primitives | not started |
| 3. Product components, patterns, screens | not started |
| 4. Teaching pages | not started |
| 5. Checks and report | not started |

## Inventory (stage 0)

- pnpm 11.10.0 workspace, Node 24, TypeScript 6.0.3, React 19.3.1, Next.js 16.4.2 (app only), Tailwind CSS 4.3.3 through `@tailwindcss/postcss`, Vitest 5.0.5 with projects `unit` and `integration`; coverage 100% over `packages/*/src` and `scripts/`.
- `packages/ui`: `components.json` (shadcn new-york, lucide declared but not installed), `src/styles.css` (7 colour variables, `--radius-xl`, body font Arial), `components/card.tsx` (shadcn copy), `backend/forms/CrudForm`, `backend/tables/DataTable`, `backend/api/apiCall`, four feedback messages. No Storybook, no dark theme, no icons, no Radix.
- Found defect: `ErrorMessage` uses `text-destructive`, but no `--destructive` token exists, so errors render in the default text colour.

## Approved decisions

2026-10-29, owner answers to the stage 0 questions:

- Q1: light theme only; no theme switcher.
- Q2: fleet availability follows the approved specification (paginated table); the timeline view goes to "What is missing". Timeline tokens are therefore not written.
- Q2a: the place of the actions next to a truck stays open on "What is missing".
- Q3: a separate error token, always with an icon and words. Value `#da1e28` (IBM Carbon error red) is a proposal: 5,00 : 1 on panel, 4,77 : 1 on page.
- Q4: only `DecimalField`, `ZonedDateTimeField`, `PlacePicker`, `ValueWithSource` and small badges go to `packages/ui`; screens are stories composed from real components.
- Q5a lucide icons; Q5b motion 0 ms and 110 ms, nothing under reduced motion; Q5c no toast, avatar, tabs, switch or checkbox; Q5d character words and Q5e P1–P9 shown as proposals.

## Stage 1 result

- Storybook 10.6.5 (`@storybook/react-vite`), addons docs + `remark-gfm`, a11y (`test: 'error'`), vitest; onboarding checklists, telemetry and update notices off; brand title "Fleet Platform".
- Tokens in `src/styles.css`: raw, semantic (with source comments), component (`table-row-height`); shadcn names kept as aliases with unchanged values; default Tailwind palette and radius scale removed from the theme.
- IBM Plex Sans 400/600 bundled from `@fontsource/ibm-plex-sans`.
- Foundations pages: Color (roles, measured contrast), Typography, Spacing and layout, Shape and depth, Motion, Icons, Themes.
- `pnpm lint:tokens` (`packages/ui/scripts/check-tokens.ts`): finds 2 existing arbitrary values in `card.tsx` (stage 2 decision).
- Checks: build-storybook, typecheck, lint, unit tests with 100% coverage, app build; a11y test failure verified with a deliberate violation.
- `lucide-react` pinned to 1.62.0 because 1.64.0 is younger than the repository's minimum release age; pnpm's automatic exclusion entry was reverted.

## Plan

- Storybook 10.6.5 with `@storybook/react-vite` in `packages/ui/.storybook`; addons: docs (MDX with `remark-gfm`), a11y (`test: 'error'`), vitest (stories as browser tests, Playwright Chromium); `msw` + `msw-storybook-addon` for `apiCall` responses. Separate `packages/ui/vitest.storybook.config.ts`; the root unit/coverage run stays unchanged.
- Stories and MDX pages in `packages/ui/stories/` (outside `src`, so they are not product source for coverage). Every new component in `src` gets unit tests to keep 100% coverage.
- Runtime additions: `@fontsource/ibm-plex-sans`, `lucide-react`, Radix packages and `class-variance-authority` pulled by shadcn, `cmdk` only if the place picker needs it.
- Scripts: `storybook`, `build-storybook`, `test:storybook`, `lint:tokens`.

## Open questions

- Error colour value `#da1e28` (proposal).
- Shadow on overlays: border only, or border plus shadow (stage 2).
- Existing `Card` (12 px radius, shadow, 24 px padding, two arbitrary values) and `DataTable`/`ErrorMessage`/`EmptyState` restyle (stage 2 proposal).
- Icon sizes 16/20 px, 768 px breakpoint, monospace for documentation code (proposals).
- Token script lives outside coverage (`packages/ui/scripts/`).

## Next step

Owner says "next"; then stage 2: list the differences of shape, density and states from the shadcn defaults with their decisions, then primitives in batches of about six.
