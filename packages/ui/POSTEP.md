# Design system progress

Working log for the design system and its Storybook in `packages/ui`. Local branch `design-system-storybook` (from `main` 6588042); nothing is pushed. Read this file first when resuming.

Sources the system is built from (reference IDs such as R06.4, antireferences such as A01 and token names refer to owner-provided reference and token tables kept outside this repository): `.ai/specs/product-brief.md`, `.ai/specs/backlog.md`, `.ai/specs/2026-10-26-e01-foundations.md`, `.ai/specs/2026-10-26-e01-trip-entry-and-quotation.md`, a screen audit and the existing `packages/ui`.

## Stages

| Stage | Status |
|---|---|
| 0. Inventory and plan | done 2026-10-29, approved |
| 1. Foundations | done 2026-10-29, waiting for owner "next" |
| 2. Primitives | batch 1 done 2026-10-29, waiting for owner "next" |
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
- Q5a lucide icons (superseded on 2026-10-29, see below); Q5b motion 0 ms and 110 ms, nothing under reduced motion; Q5c no toast, avatar, tabs, switch or checkbox; Q5d character words and Q5e P1–P9 shown as proposals.

2026-10-29, owner changes after stage 1:

- **Icons: Tabler Icons replace Lucide** (supersedes Q5a). One set for the whole product, `@tabler/icons-react` 3.50.0 (MIT), outline only (proposal); `iconLibrary: "tabler"` in both `components.json`. Reason given by the owner: Lucide is the default shadcn look. Line width matched to IBM Plex Sans: the 400 stem measures 80/1000 em in the bundled font file, so `--icon-stroke` = 14 px x 0.08 = 1.12 px, applied to every `.tabler-icon` with `vector-effect: non-scaling-stroke` (same line at 16 and 20 px). `pnpm lint:tokens` reports imports from other icon libraries.
- **Text styles are named roles, not sizes.** Utilities in `src/styles.css`: `text-page-title` (20/28, 600), `text-section-title` (16/24, 600), `text-body` (14/21 since the line-height decision below, 400), `text-body-strong` (14/20, 600; table headers, proposal), `text-label` (12/16, muted), `text-meta` (12/16, muted), `text-number` (14/20, tabular figures), `text-code` (documentation only, proposal). The size-only theme tokens `text-label/body/heading/page` were removed. `pnpm lint:tokens` reports size and weight utilities (`text-sm`, `font-semibold`…): 12 in existing `packages/ui` components (stage 2) and 12 in app pages (outside the design system, not changed).
- **Line height of running text** (2026-10-29): running text and messages (`text-body`) at least 1.5 x font size, now 14/21 (`--type-14-leading-text`); table rows and single-line values keep 14/20 through the new role `text-table` (and `text-number`, `text-body-strong`), so the 36 px row stays. Labels and meta stay 12/16 (short, single line).
- **WCAG 1.4.12 check on the Typography page** (2026-10-29): `.storybook/text-spacing.ts` applies line height 1.5, paragraph spacing 2 em, letter spacing 0.12 em and word spacing 0.16 em and reports clipped, truncated or overflowing text; the page has an interactive check on a 320 px sample with the real `Card`, and the story "Foundations/Typography/Text spacing (WCAG 1.4.12)" runs it in `pnpm test:storybook` (passes; a deliberately clipped probe fails as expected). Stage 2 component stories reuse the same helper.

2026-10-29, owner decisions before stage 2:

- **Error colour `#da1e28`: approved** (was a proposal).
- **Kilometres on screen are whole numbers**; the exact value (three decimals, R11) appears only in the `ValueWithSource` details. Owner decision; the matching change to EV-4 in the foundations specification is pending.
- **Control height:** 36 px by default, 32 px inside table rows; click targets stay at least 24 px (WCAG 2.5.8).
- **Shadow:** only dialog, menu and popover get one light shadow; cards and panels have no shadow, only a border.
- **Existing components restyled:** `Card` (8 px radius, no shadow, 12 px inside), `DataTable`, `ErrorMessage`, `EmptyState`: approved. The 14 values outside the tokens in `packages/ui` are fixed in stage 2.
- **Checklist after every batch**, one result per item:
  1. contrast (text 4.5 : 1, interface 3 : 1);
  2. click targets at least 24 x 24 px;
  3. every field has a visible label;
  4. one icon set (Tabler);
  5. colour is never the only carrier of meaning;
  6. empty, error and loading states exist;
  7. visible focus;
  8. no invented data;
  9. only variants built from tokens;
  10. zero values outside the tokens;
  11. lines of text at most 75 characters;
  12. every message says what happened and what to do.

## Stage 1 result

- Storybook 10.6.5 (`@storybook/react-vite`), addons docs + `remark-gfm`, a11y (`test: 'error'`), vitest; onboarding checklists, telemetry and update notices off; brand title "Fleet Platform".
- Tokens in `src/styles.css`: raw, semantic (with source comments), component (`table-row-height`); shadcn names kept as aliases with unchanged values; default Tailwind palette and radius scale removed from the theme.
- IBM Plex Sans 400/600 bundled from `@fontsource/ibm-plex-sans`.
- Foundations pages: Color (roles, measured contrast), Typography, Spacing and layout, Shape and depth, Motion, Icons, Themes.
- `pnpm lint:tokens` (`packages/ui/scripts/check-tokens.ts`): finds 2 existing arbitrary values in `card.tsx` (stage 2 decision).
- Checks: build-storybook, typecheck, lint, unit tests with 100% coverage, app build; a11y test failure verified with a deliberate violation.
- `lucide-react` pinned to 1.62.0 because 1.64.0 is younger than the repository's minimum release age; pnpm's automatic exclusion entry was reverted.

## Stage 2: differences from the shadcn defaults

| Property | shadcn new-york | Fleet Platform | Decision |
|---|---|---|---|
| Control height | `h-9` 36 px; sm 32, lg 40, xs 24 | 36 px (`min-h-control`), 32 px in table rows (`compact`); no lg or xs | Owner 2026-10-29 |
| Radius | `rounded-md` (about 6 px) | 4 px controls, 8 px panels | N4b |
| Borders | light `border-input`, buttons without border | `border-input` 3.16:1 on every control, 1 px border on every button | T1, WCAG 1.4.11 |
| Shadow | `shadow-xs` on inputs and outline buttons, `shadow-sm` on cards | none; one light shadow only on dialog, menu, popover (later batch) | Owner 2026-10-29, G1 |
| Inner spacing | button `px-4` 16 px, card `p-6` 24 px, card gap 24 px | button and input 12 px (`px-panel`), compact 8 px; card 12 px | Q3-1, owner 2026-10-29 |
| Type | `text-sm`, `font-medium` | roles `text-body`, `text-label`, `text-section-title`; weights 400/600 only | Owner 2026-10-29, N2a |
| Focus | 3 px `ring-ring/50` halo plus border colour | 2 px solid `focus-ring` outline, 2 px offset | T4, WCAG 2.4.7 |
| Hover | `primary/90` transparency | `action-primary-hover` #1d4d3f (proposal), secondary page background, text underline | proposal |
| Disabled | `opacity-50` | page background, muted text, divider border; reason in visible text | Audit finding 14 |
| Invalid | `ring-destructive/20` halo | `border-error`, error text with `IconAlertCircle` | Q3 |
| Button variants | default, destructive, outline, secondary, ghost, link; 8 sizes | primary, secondary, text; default, compact, icon, icon-compact | N5a/Q3 (no red button), Q3-1 |
| Long button labels | `whitespace-nowrap` | wrap, height grows | WCAG 1.4.10, 1.4.12 |
| Field | shadcn `field` (no ARIA wiring) | own `Field`: label, hint, error and required wired by `aria-describedby`/`aria-invalid` | WCAG 1.3.1, 3.3.1, 3.3.2 |

## Stage 2, batch 1 (2026-10-29)

Built: `Button`, `Label`, `Field`, `Input`, `Textarea`; restyled `Card`, `DataTable`, `CrudForm`, `ErrorMessage` (icon), `EmptyState` (optional action), `LoadingMessage`, `SuccessMessage`. `cn()` knows the text roles (tailwind-merge). Docs pages with 13 sections: Button, Field and Label, Input, Textarea, Card. `DataTable` and the feedback messages get their pages with the table and feedback batch. New dependencies: `radix-ui` 1.8.1, `class-variance-authority` 0.7.1.

Checks: typecheck, lint, 112 unit tests at 100% coverage, 29 story tests (interaction, axe, WCAG 1.4.12), app build, Storybook build.

| # | Checklist item | Result |
|---|---|---|
| 1 | Contrast | Pass: axe colour-contrast in all 29 stories; token pairs measured on the Color page |
| 2 | Targets at least 24 px | Pass: measured 36x36, 32x32 (icon), inputs 36 px high |
| 3 | Visible labels | Pass: every field has a `Field` label or `aria-label`; axe `label` rule passes |
| 4 | One icon set | Pass: only Tabler; `lint:tokens` finds no other icon import |
| 5 | Colour not alone | Pass: error = icon + sentence + border; disabled has a written reason |
| 6 | Empty, error, loading states | Partial: messages exist and are restyled; their stories and docs come with the feedback batch |
| 7 | Visible focus | Pass: 2 px solid outline measured on the frozen and real focus |
| 8 | No invented data | Pass: examples from the E01 specification; synthetic place names; no customer data |
| 9 | Only token variants | Pass: three variants, four sizes, all from tokens |
| 10 | Zero values outside tokens | Pass in `packages/ui` (0); 12 remain in app pages, outside the design system |
| 11 | Lines at most 75 characters | Pass for hints, errors and empty states (`max-w-measure` 65ch); card content is the consumer's |
| 12 | Message says what happened and what to do | Pass in all examples ("Nie rozpoznano kwoty. Wpisz ją cyframi, np. 1850,00.") |

For "What is missing": `CardTitle` is a `div`, so a heading goes inside it; timeline view (Q2); place of truck actions (Q2a).

## Plan

- Storybook 10.6.5 with `@storybook/react-vite` in `packages/ui/.storybook`; addons: docs (MDX with `remark-gfm`), a11y (`test: 'error'`), vitest (stories as browser tests, Playwright Chromium); `msw` + `msw-storybook-addon` for `apiCall` responses. Separate `packages/ui/vitest.storybook.config.ts`; the root unit/coverage run stays unchanged.
- Stories and MDX pages in `packages/ui/stories/` (outside `src`, so they are not product source for coverage). Every new component in `src` gets unit tests to keep 100% coverage.
- Runtime additions: `@fontsource/ibm-plex-sans`, `lucide-react`, Radix packages and `class-variance-authority` pulled by shadcn, `cmdk` only if the place picker needs it.
- Scripts: `storybook`, `build-storybook`, `test:storybook`, `lint:tokens`.

## Open questions

- Shadow on overlays: border only, or border plus shadow (stage 2).
- Existing `Card` (12 px radius, shadow, 24 px padding, two arbitrary values) and `DataTable`/`ErrorMessage`/`EmptyState` restyle (stage 2 proposal).
- Icon sizes 16/20 px, outline-only Tabler icons, `text-body-strong` role, 768 px breakpoint, monospace for documentation code (proposals).
- App pages use 12 size/weight utilities outside the roles; changing them is app work outside this branch's scope.
- Token script lives outside coverage (`packages/ui/scripts/`).

## Next step

Owner says "next"; then stage 2: list the differences of shape, density and states from the shadcn defaults with their decisions, then primitives in batches of about six.
