# Design system progress

Working log for the design system and its Storybook in `packages/ui`. Stage 1 and stage 2 batches 1–2 are in `main` (pull request #38, merge 196a2bb); batch 3 is on the branch `design-system-overlays`. Read this file first when resuming.

Sources the system is built from (every source code such as R06.4, A01, N4b or Q3 is explained in [design-system-decisions.md](../../.ai/specs/design-system-decisions.md)): `.ai/specs/product-brief.md`, `.ai/specs/backlog.md`, `.ai/specs/2026-10-26-e01-foundations.md`, `.ai/specs/2026-10-26-e01-trip-entry-and-quotation.md`, a screen audit and the existing `packages/ui`.

## Stages

| Stage | Status |
|---|---|
| 0. Inventory and plan | done 2026-10-29, approved |
| 1. Foundations | done 2026-10-29, waiting for owner "next" |
| 2. Primitives | batches 1 and 2 done and approved 2026-10-29; batch 3 done 2026-10-29, waiting for owner decisions on its proposals |
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

2026-10-29, owner answers after stage 2 batch 1:

- Icons: Tabler confirmed (the unfilled "[Lucide / Tabler]" template item is resolved as Tabler).
- Hover and pressed colour of the primary action `#1d4d3f` (`action-primary-hover`): approved.
- "(opcjonalne)" marks optional fields (required is the default): approved.
- Grey field labels (`text-label`, text-muted, 6.0:1): approved.
- Next: stage 2 batch 2 — Select, RadioGroup (wash question without a default choice, weekend case), status Badge (certain/estimate, loss, verification), Alert, and the documentation pages and stories of `DataTable` and the feedback messages (closes checklist item 6). Done 2026-10-29, see "Stage 2, batch 2".

2026-10-29, owner instruction for stages 3 and 4 (structure, not look):

- "Design system/Components" is a catalogue: every component with a live preview rendered from the real component, a one-line purpose and a link to its page, grouped by kind.
- "Usage and accessibility" collects the cross-cutting rules: keyboard and focus, forms and feedback, colour, motion and content, responsive compositions, and the product rules the interface carries.
- "What is missing" lists what is available, which backlog items already have reusable interface and what work remains before product use.
- One page per epic: which steps of the user journey are covered, the connected screens in their states, the shared components used and the production work still required.
- "Contributing" says how to add or change a component, what its documentation must contain, how tokens change, who owns and releases the system, and the local commands.
- Product components are grouped by domain in `src/components/<domain>/` (proposed: trips, quotes, fleet, access; confirmed against the backlog epics at the start of stage 3).

2026-10-29, owner answers after stage 2 batch 2: proposals 1–5 of batch 2 approved (weekend option names, no green badge, Alert only `neutral` and `error`, highlighted Select option with background and underline and vertical radio groups only, "Plan" badge on entered-trip history rows). The branch is pushed and opened as a pull request with batches 1 and 2; CI jobs for tokens and accessibility follow in a separate pull request.

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
| Hover | `primary/90` transparency | `action-primary-hover` #1d4d3f (approved), secondary page background, text underline | proposal |
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

## Stage 2, batch 2 (2026-10-29)

Built: `Select` (sizes default and compact), `RadioGroup` with `RadioGroupItem` (label and hint per option, no default choice), `Badge` (`neutral`, `estimate`, `loss`), `Alert` (`neutral`, `error`). Docs pages with 13 sections: Select, Radio group, Badge, Alert, Data table, Feedback messages (closes checklist item 6). No new dependencies: all four come from `radix-ui` 1.8.1, already installed; sources fetched from the shadcn new-york-v4 registry JSON, not the CLI.

Changes to existing components:

- `Field` also gives its control `aria-labelledby` (the label's id), so the same Field names a radio group, which a `<label for>` cannot name (WAI-ARIA APG Radio Group). Additive; inputs keep the same accessible name.
- Defect found by the new `DataTable` stories and fixed: the section and the scroll region had the same name, two identical landmarks (axe `landmark-unique`); only the scroll region is named now. Second defect: the pagination row overflowed at 320 px with WCAG 1.4.12 spacing; it wraps now.
- `.storybook/text-spacing.ts` skips visually hidden text (`sr-only`, such as the table caption), which has no visual box to lose.

Differences from shadcn in this batch:

| Property | shadcn new-york | Fleet Platform | Decision |
|---|---|---|---|
| Select trigger | `h-9`, `whitespace-nowrap`, value cut to one line, `shadow-xs` | at least 36 / 32 px, long values wrap, no shadow, Field wiring with `aria-required` | owner 2026-10-29, WCAG 1.4.10, 1.4.12 |
| Select list | `item-aligned`, fade and zoom animation (`tw-animate-css`, not installed), `shadow-md` | `popper` below the trigger, no animation and no shadow until the overlay batch adds the shadow token and the 110 ms appearance | owner 2026-10-29 (shadow on overlays), Q5b |
| Select option | accent background on focus, check on the right | page background and underline on highlight, `IconCheck` on the chosen option | WCAG 1.4.1, proposal |
| Radio | bare 16 px circle with a separate `Label` | whole option row (at least 36 px) is the label, optional hint per option, vertical only | WCAG 2.5.8, proposal |
| Badge | pill (`rounded-full`), six variants incl. `destructive` | 4 px radius, three variants from existing tokens, word required, no green | N4b, N5a, R11.1, spec Fleet |
| Alert | `AlertTitle` and `AlertDescription` parts, `default` and `destructive` | `title` and `action` props, `neutral` (`role="status"`) and `error` (`role="alert"`) | Q3, proposal |

Checks: typecheck, lint, 118 unit tests at 100% coverage (statements 352/352, branches 226/226, functions 98/98, lines 296/296), 70 story tests (interaction, axe, WCAG 1.4.12), app build, Storybook build; each new page opened in the built Storybook (13 sections, tables rendered, no page errors).

| # | Checklist item | Result |
|---|---|---|
| 1 | Contrast | Pass: axe colour-contrast in all 70 stories; measured: loss badge 5.93:1, estimate badge 11.12:1, neutral badge 14.71:1, input border 3.16:1, error 5.00:1 |
| 2 | Targets at least 24 px | Pass: Select trigger 36 px (compact 32), options 32 px, radio rows at least 36 px with the label clickable, pagination 36 px |
| 3 | Visible labels | Pass: Select and RadioGroup named by the Field label; radio options by their own label |
| 4 | One icon set | Pass: only Tabler (`IconChevronDown`, `IconCheck`, `IconInfoCircle`, `IconCircleCheck`, `IconCircleDashed`, `IconCircleOff`) |
| 5 | Colour not alone | Pass: kilometre statuses differ by word and icon with one background (tested); selected option has a check; selected radio a dot |
| 6 | Empty, error, loading states | Pass: `DataTable` stories for loading, error, empty; Feedback messages page with all four messages |
| 7 | Visible focus | Pass: 2 px outline on Select trigger and radio, frozen previews in the state matrices |
| 8 | No invented data | Pass: messages and cases from the E01 specification ("Zapytaj o weekend", "Brak ceny frachtu", wash, three weekend cases); synthetic trucks and places |
| 9 | Only token variants | Pass: Badge three, Alert two, Select two sizes; no new colour token |
| 10 | Zero values outside tokens | Pass in `packages/ui` (0 in src, stories, .storybook); 12 remain in app pages, outside the design system |
| 11 | Lines at most 75 characters | Pass: hints, alert descriptions and messages use `max-w-measure` (65ch) |
| 12 | Message says what happened and what to do | Pass: e.g. "Wybierz „Bez mycia” albo „Nasze mycie”. Bez odpowiedzi wycena nie zostanie policzona." |

Exception: the story "Select / Open list with groups" disables the axe rule `aria-hidden-focus`; while the list is open Radix hides the page with `aria-hidden` and traps focus in the list, which axe cannot see in a static open state.

Proposals of batch 2 (all five approved by the owner on 2026-10-29):

1. Weekend option names translated from R13: "Wraca do domu w Polsce", "Odpoczywa za granicą", "Jedzie dalej", each with a one-line cost hint.
2. No green badge at all; "Zgodne", "Niezweryfikowane", "Brak danych" share the neutral look and differ by word and icon.
3. Alert has only `neutral` and `error`; no warning or success variant (no such tokens; success uses `SuccessMessage`).
4. Highlighted Select option: page background plus underline; radio groups are vertical only.
5. "Plan" as a neutral badge on entered-trip history rows (the spec says they are labelled as plan results).

## Stage 2, batch 3 (2026-10-29)

Built: `Dialog`, `AlertDialog`, `DropdownMenu`, `Popover`, `Tooltip`, `Skeleton`. Tokens: `shadow-overlay` (T5), `bg-scrim` (T6), `animate-overlay-in` (T7), `bg-tooltip` and `text-on-tooltip` (T8); Tailwind's default shadows and animations removed from the theme. The Select list now has the overlay shadow and the 110 ms appearance. Docs pages with 13 sections for all six; Select, Motion and Shape and depth pages updated (the overlay shadow is no longer an open question). No new dependencies: all six come from `radix-ui` 1.8.1; sources fetched from the shadcn new-york-v4 registry JSON.

Differences from shadcn in this batch:

| Property | shadcn new-york | Fleet Platform | Decision |
|---|---|---|---|
| Overlay motion | fade and zoom in and out, slide from the side (`tw-animate-css`), 200 ms on dialogs | fade in only over 110 ms, instant close, 0 ms under reduced motion | Q5b, T7 |
| Shadow | `shadow-lg` dialogs, `shadow-md` menus and popovers | one `shadow-overlay` with a `border-input` border | owner 2026-10-29, T5 |
| Dialog scrim and layout | `bg-black/50`; panel fixed in the centre with `translate`, `max-w-lg` | `bg-scrim` (ink 50 %); the scrim centres and scrolls the panel, width up to 65 characters, 16 px from the screen edges | T6, WCAG 1.4.10 |
| Dialog close button | opacity 70 % X with "Close" | 32 px text icon button, `aria-label="Zamknij"` | WCAG 2.5.8 |
| Alert dialog | size `sm`, media slot, any button variant | one size; action always primary, cancel secondary and focused on open | N5a, Q3 |
| Dropdown menu | checkbox and radio items, submenus, shortcuts, `destructive` items | items, labels, groups, separators; aligned to the trigger's right edge; highlight with underline | Q5c, N5a, batch 2 proposal 4 |
| Popover | `w-72`, centred, header, title and description parts | as wide as the content up to 65 characters, never wider than the screen, aligned left; content is the consumer's | audit finding 15 |
| Tooltip | `TooltipProvider` needed at the root, arrow, `text-xs` | provider built in, no arrow, `text-table` on `bg-tooltip` | T8 |
| Skeleton | `animate-pulse`, `bg-accent` | still, `bg-divider`, always `aria-hidden` | T9, Q5b |

Checks: typecheck, lint, 125 unit tests at 100% coverage (statements 389/389, branches 235/235, functions 129/129, lines 333/333), 96 story tests in two runs (interaction, axe, WCAG 1.4.12), `lint:tokens` 0 in `packages/ui`, app build, Storybook build; in the built Storybook each new page has 13 sections and no page errors, the dialog at 320 px keeps 16 px on both sides with no horizontal scroll, the overlay animation measures 0.11 s and 0 s with reduced motion.

| # | Checklist item | Result |
|---|---|---|
| 1 | Contrast | Pass: axe colour-contrast in all 96 stories; tooltip white on ink 14.71:1; scrim and skeleton are not text or controls |
| 2 | Targets at least 24 px | Pass: dialog buttons 36 px, close button 32x32, menu trigger 36x36, menu items 32 px, popover trigger 36 px |
| 3 | Visible labels | Pass: dialog fields through `Field`; dialogs named by their title, popovers by `aria-label`, icon buttons by `aria-label` plus tooltip |
| 4 | One icon set | Pass: only Tabler (`IconX`, `IconDots`, `IconPencil`) |
| 5 | Colour not alone | Pass: highlighted menu item underlined; disabled item says why; estimate in a popover has the word "Szacunek" |
| 6 | Empty, error, loading states | Pass: field error inside a dialog; skeleton with `aria-busy` and `LoadingMessage` |
| 7 | Visible focus | Pass: focus moves into dialogs (first field or the safe answer), stays inside, returns to the trigger, also from a menu item via `onCloseAutoFocus` (tested) |
| 8 | No invented data | Pass: cancellation keeps evidence and stales successor quotes, discarding a never-accepted draft, loss reason (R12), whole km with exact value in details (R11, EV-4), fuel price from the weekly bulletin (SRC-1); numbers, places and dates synthetic |
| 9 | Only token variants | Pass: one variant per component; new tokens T5, T6, T8 in `src/styles.css` |
| 10 | Zero values outside tokens | Pass in `packages/ui` (0); 12 remain in app pages, outside the design system |
| 11 | Lines at most 75 characters | Pass: dialog, popover and tooltip limited to `max-w-measure` (65ch) |
| 12 | Message says what happened and what to do | Pass: "Wpisz powód przyjęcia straty. Bez niego kursu nie da się przyjąć."; "Usunąć szkic kursu? … Tego nie da się cofnąć." |

Exceptions: the open Dialog, Alert dialog and Dropdown menu stories disable the axe rule `aria-hidden-focus`, for the same reason as the open Select list.

Proposals of batch 3 (waiting for the owner):

1. Overlay shadow value 0 2px 6px in ink at 30 % (T5).
2. Scrim behind a modal dialog: ink at 50 % (T6).
3. Overlays only fade in; closing is instant (T7).
4. Dark tooltip without arrow, shown at once on hover and focus (T8).
5. Still skeleton without pulse (T9).
6. No red or "destructive" item: an irreversible menu item ends with "…" and opens an alert dialog whose action is the primary button.
7. Dropdown menu without checkbox and radio items, submenus and shortcuts until a screen needs them.
8. A click on the scrim closes a Dialog (input lost, a "Wróć" button stays the expected way out); an Alert dialog ignores it.

## Plan

- Storybook 10.6.5 with `@storybook/react-vite` in `packages/ui/.storybook`; addons: docs (MDX with `remark-gfm`), a11y (`test: 'error'`), vitest (stories as browser tests, Playwright Chromium); `msw` + `msw-storybook-addon` for `apiCall` responses. Separate `packages/ui/vitest.storybook.config.ts`; the root unit/coverage run stays unchanged.
- Stories and MDX pages in `packages/ui/stories/` (outside `src`, so they are not product source for coverage). Every new component in `src` gets unit tests to keep 100% coverage.
- Runtime additions: `@fontsource/ibm-plex-sans`, `lucide-react`, Radix packages and `class-variance-authority` pulled by shadcn, `cmdk` only if the place picker needs it.
- Scripts: `storybook`, `build-storybook`, `test:storybook`, `lint:tokens`.

## Open questions

- Icon sizes 16/20 px, outline-only Tabler icons, `text-body-strong` role, 768 px breakpoint, monospace for documentation code (proposals).
- App pages use 12 size/weight utilities outside the roles; changing them is app work outside this branch's scope.
- Token script lives outside coverage (`packages/ui/scripts/`).
- "Pewne" (certain) has no badge: only estimates are marked (R11.1, P4); `ValueWithSource` decides in stage 3.
- Checkbox and switch are not in the system (Q5c); a need for independent options goes to "What is missing".

## Next step

Owner decides proposals 1–8 of batch 3 and reviews the pull request of `design-system-overlays`. Then stage 3 (product components by domain, patterns, screens) and stage 4 follow the structure model recorded under "owner instruction for stages 3 and 4".
