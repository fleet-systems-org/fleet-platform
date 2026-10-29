# Design system progress

Working log for the design system and its Storybook in `packages/ui`. Stages 1 and 2 are in `main`: pull request #38 (stage 1, stage 2 batches 1–2, merge 196a2bb) and #39 (stage 2 batch 3, merge 657a308); the design system CI jobs came with #41 (merge bdc3be6). Stage 3 batch 1 is on the branch `design-system-product-1`. Read this file first when resuming.

Sources the system is built from (every source code such as R06.4, A01, N4b or Q3 is explained in [design-system-decisions.md](../../.ai/specs/design-system-decisions.md)): `.ai/specs/product-brief.md`, `.ai/specs/backlog.md`, `.ai/specs/2026-10-26-e01-foundations.md`, `.ai/specs/2026-10-26-e01-trip-entry-and-quotation.md`, a screen audit and the existing `packages/ui`.

## Stages

| Stage | Status |
|---|---|
| 0. Inventory and plan | done 2026-10-29, approved |
| 1. Foundations | done 2026-10-29, approved (#38) |
| 2. Primitives | done 2026-10-29: batches 1–2 approved and merged (#38), batch 3 approved and merged (#39; the owner's refinements and the stable Select story follow in #42); CI for tokens and Storybook tests merged (#41) |
| 3. Product components, patterns, screens | domain split approved 2026-10-29; batch 1 merged (#43), owner decisions on its proposals applied in a follow-up pull request |
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
- **Text styles are named roles, not sizes.** Utilities in `src/styles.css`: `text-page-title` (20/28, 600), `text-section-title` (16/24, 600), `text-body` (14/21 since the line-height decision below, 500; N2b), `text-body-strong` (14/20, 600; table headers, proposal), `text-label` (12/16, 500, muted; N2b), `text-meta` (12/16, 500, muted; N2b), `text-number` (14/20, 500, tabular figures; N2b), `text-code` (documentation only, proposal). The size-only theme tokens `text-label/body/heading/page` were removed. `pnpm lint:tokens` reports size and weight utilities (`text-sm`, `font-semibold`…): 12 in existing `packages/ui` components (stage 2) and 12 in app pages (outside the design system, not changed).
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

2026-10-29, owner decision at the start of stage 3 (supersedes "grouped by domain (trips, quotes, fleet, access)" above):

- Shared product components are grouped by the foundation primitive they serve: `src/components/values/` (P01 exact values, P02 value evidence: `DecimalField`, `ValueWithSource`), `src/components/time/` (P07: `ZonedDateTimeField`), `src/components/places/` (P04: `PlacePicker`). Reason: the E01 foundations list these four as shared widgets used by several modules, and the feature specification keeps quote and schedule composition in the app until a second consumer exists.
- Domain folders (trips, quotes, fleet, access) are created only when a component gets a second consumer. E01 screens are stories composed from real components on the E01 epic page (Q4).
- Small certainty and state badges (EV-1) in `values/`: to be confirmed by the owner with their batch.

2026-10-29, owner answers after stage 2 batch 2: proposals 1–5 of batch 2 approved (weekend option names, no green badge, Alert only `neutral` and `error`, highlighted Select option with background and underline and vertical radio groups only, "Plan" badge on entered-trip history rows). The branch is pushed and opened as a pull request with batches 1 and 2; CI jobs for tokens and accessibility follow in a separate pull request.

## Stage 1 result

- Storybook 10.6.5 (`@storybook/react-vite`), addons docs + `remark-gfm`, a11y (`test: 'error'`), vitest; onboarding checklists, telemetry and update notices off; brand title "Fleet Platform".
- Tokens in `src/styles.css`: raw, semantic (with source comments), component (`table-row-height`); shadcn names kept as aliases with unchanged values; default Tailwind palette and radius scale removed from the theme.
- IBM Plex Sans 500/600 (N2b) bundled from `@fontsource/ibm-plex-sans`.
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
| Type | `text-sm`, `font-medium` | roles `text-body`, `text-label`, `text-section-title`; weights 500/600 only | Owner 2026-10-29, N2a, N2b |
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

Checks: typecheck, lint, 125 unit tests at 100% coverage (statements 390/390, branches 235/235, functions 130/130, lines 334/334), 96 story tests in three consecutive runs (interaction, axe, WCAG 1.4.12), `lint:tokens` 0 in `packages/ui`, app build, Storybook build; in the built Storybook each new page has 13 sections and no page errors, the dialog at 320 px keeps 16 px on both sides with no horizontal scroll, the overlay animation measures 0.11 s and 0 s with reduced motion.

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

Proposals of batch 3 (all eight approved by the owner on 2026-10-29, with the two refinements below):

1. Overlay shadow value 0 2px 6px in ink at 30 % (T5).
2. Scrim behind a modal dialog: ink at 50 % (T6).
3. Overlays only fade in; closing is instant (T7).
4. Dark tooltip without arrow, shown at once on hover and focus (T8).
5. Still skeleton without pulse (T9).
6. No red or "destructive" item: an irreversible menu item ends with "…" and opens an alert dialog whose action is the primary button.
7. Dropdown menu without checkbox and radio items, submenus and shortcuts until a screen needs them.
8. A click on the scrim closes a Dialog (input lost, a "Wróć" button stays the expected way out); an Alert dialog ignores it.

Owner refinements (2026-10-29), applied in the same pull request:

- To 6: the confirming button of any dialog is the action's concrete verb ("Anuluj kurs", "Usuń szkic"), never "OK" or "Potwierdź".
- To 8: a dialog with typed input (such as a reason) does not close on a scrim click, like an alert dialog. Because a Dialog exists to collect input, `DialogContent` never closes on a click or focus outside; `Escape`, the corner button and the footer's way back close it (unit and story tests).

## Stage 3, batch 1 (2026-10-29)

Built in `src/components/values/`: `ValueWithSource` (P02, EV-4) on Popover, Button and Badge, and `DecimalField` (P01) on Field and the input styles; in `src/lib/decimal.ts`: `parseDecimalInput` (Polish comma and digit-group spaces normalized as text, rejects instead of rounding: FIN-1, FIN-2, FIN-4) and `formatDecimal` (Polish separators, display rounding with ties away from zero: FIN-3; exact through `Intl.NumberFormat` on the string, never a JavaScript number; `ES2023.Intl` added to the TypeScript libraries). Translated words reach `ValueWithSource` as a `labels` prop, like Field's `optionalText`, because the foundations say the interface receives translated labels. Docs pages with 13 sections; stories under "Product/Values". No new dependencies and no new tokens. This branch starts from #42 (batch 3 refinements and the stable Select story), so #42 merges first.

Checks: typecheck, lint, 153 unit tests at 100% coverage (statements 423/423, branches 280/280, functions 137/137, lines 360/360), 107 story tests in three consecutive runs (interaction, axe, WCAG 1.4.12, overlap at 320 px), `lint:tokens` 0 in `packages/ui`, app build, Storybook build; in the built Storybook both pages have 13 sections, no page errors, no horizontal scroll at 320 px.

| # | Checklist item | Result |
|---|---|---|
| 1 | Contrast | Pass: axe colour-contrast in all 107 stories; estimate badge 11.12:1, meta text 6.0:1 |
| 2 | Targets at least 24 px | Pass: value button 36 px high (compact 32), decimal field 36 px |
| 3 | Visible labels | Pass: decimal field named by its Field label, unit in its description; details named "Szczegóły: <label>" |
| 4 | One icon set | Pass: no new icons; the Field error icon is Tabler |
| 5 | Colour not alone | Pass: "Szacunek" as a word, missing as a dash with "brak: …", conflict as "Sprzeczne dane" |
| 6 | Empty, error, loading states | Pass: decimal field empty, filled, error, disabled; value missing, provider failure, conflict, loading with Skeleton |
| 7 | Visible focus | Pass: 2 px outline; details return focus to the value (tested) |
| 8 | No invented data | Pass with two open points: sources and reasons from SRC-1, ROUTE-1, FIN and EV rules, numbers synthetic; conflict candidates are placeholders (proposal 7) and the certainty of routed kilometres is not in the specification (proposal 8) |
| 9 | Only token variants | Pass: no new token or variant |
| 10 | Zero values outside tokens | Pass in `packages/ui` (0); 12 remain in app pages, outside the design system |
| 11 | Lines at most 75 characters | Pass: details panel and hints limited to `max-w-measure` |
| 12 | Message says what happened and what to do | Pass: "Nie rozpoznano kwoty. Wpisz ją cyframi, np. 1850,00." |

Defect found by the 320 px screenshot and fixed: an estimated value with its badge overlapped the row label; the value button now lets the badge wrap under the value, and the text spacing story checks rows for overlap, which the clipping check did not catch.

Proposals of stage 3 batch 1 (owner answers 2026-10-29: 1, 2, 4, 5, 6, 7 approved; 3 and 8 decided as below):

1. Digit groups always separated, also in four-digit numbers ("1 850,00"), as in the existing examples; the Polish locale default would print "1850,00".
2. Input accepts spaces between digit groups; text with both a comma and a dot ("1.850,00") and leading zeros are rejected as unrecognized.
3. Amounts accept at most 2 decimals; the specification bounds inputs (FIN-4) without numbers. Magnitude limits stay with the feature schemas on the server.
4. The decimal field is right-aligned with tabular figures, the unit after it; typed text is never reformatted.
5. Validation when the dispatcher leaves the field and on submit, not while typing.
6. The value opening details is in the default text colour with a dotted underline (solid on hover), not in the action green.
7. Missing value as "— brak: …" (R11.2, P3) and conflict as "Sprzeczne dane" with every candidate in the details; which sources can conflict is not yet specified, so the story uses "Źródło A" and "Źródło B".
8. Are routed kilometres from the map provider certain or estimated? The specification does not say; the story shows them as certain only to show whole kilometres on screen.

Owner decisions on 3 and 8 (2026-10-29), applied on the branch `design-system-product-1-decisions`:

- To 3: 2 decimal places only for EUR amounts. `DecimalField` takes its scale from the kind of value (`kind`, FIN-3): `eurAmount` 2; `unitPrice`, `fxRate`, `consumption` 6; `kilometres`, `litres` 3; `amount` in another source currency keeps its scale. The field checks the typed text when the dispatcher leaves it and reports the result through `onDecimalChange`.
- To 8: kilometres from the map provider's route are estimated (`certainty: estimated`); recorded under ROUTE-1 in the decisions record.

Owner decision on amounts in other currencies (2026-10-29), applied on the branch `fix/amount-scale-by-currency`: not without a limit, because FIN-4 bounds the scale before writes. The `amount` kind requires a `currency` and takes its decimal places from `Intl.NumberFormat` (`maximumFractionDigits`: PLN, EUR and CZK 2, HUF 0); more decimals are rejected with a message, without rounding. `eurAmount` is replaced by `amount` with `currency: "EUR"`, which gives the same 2. The `scale` result carries the allowed scale so the message can name it; `DecimalField` shows the currency as its unit.

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

## Stage 3, batch 2 (2026-10-29)

Built in `src/components/time/`: `ZonedDateTimeField` (P07, TIME-1) on Field, RadioGroup and the input styles (first with the browser's date and time inputs, reworked after the owner's answer to proposal 1); in `src/lib/zoned-time.ts`: `resolveLocalDateTime` (a local date and time in an IANA zone is `unique`, `ambiguous` with both offsets or `nonexistent`) and `toInstant` (exact ISO instant in UTC), with `Intl` only. The field reports `{ ok, date, time, timeZone, offset, instant }` or a reason (`empty`, `missingDate`, `missingTime`, `nonexistent`, `ambiguous`) when focus leaves it; a repeated time shows a required choice of occurrence. `timeOptional` covers the wash date (D63). Translated words reach it as a `labels` prop. Docs page with 13 sections; stories under "Product/Time". No new dependencies and no new tokens. Independent of #48 (amount scale by currency).

Checks: typecheck, lint, 167 unit tests at 100% coverage (statements 491/491, branches 321/321, functions 157/157, lines 411/411), 116 story tests (interaction, axe, WCAG 1.4.12), `lint:tokens` 0 in `packages/ui`, app build, Storybook build; in the built Storybook the docs page has 13 sections, no page errors, no horizontal scroll at 320 px.

| # | Checklist item | Result |
|---|---|---|
| 1 | Contrast | Pass: axe colour-contrast in all stories |
| 2 | Targets at least 24 px | Pass: boxes 36 px high, occurrence rows 36 px |
| 3 | Visible labels | Pass: group named by the Field label, boxes "Załadunek Data" and "Załadunek Godzina", zone in the description |
| 4 | One icon set | Pass: no icons in the field |
| 5 | Colour not alone | Pass: errors in words; occurrences as words with the UTC offset |
| 6 | Empty, error, loading states | Pass: empty, filled, error, disabled, clock forward, clock back; loading not applicable |
| 7 | Visible focus | Pass: 2 px outline on the text boxes and radios |
| 8 | No invented data | Pass: clock change dates from the zone database (28.03.2027, 31.10.2027), demo time 12.11.2026 09:30 from the screen map |
| 9 | Only token variants | Pass: no new token or variant |
| 10 | Zero values outside tokens | Pass in `packages/ui` (0); 12 remain in app pages, unchanged |
| 11 | Lines at most 75 characters | Pass: messages inside `max-w-measure` |
| 12 | Message says what happened and what to do | Pass: "Tej godziny nie ma: tej nocy zegar przesuwa się do przodu. Wpisz godzinę sprzed zmiany albo po niej." |

Proposals of stage 3 batch 2 (for the owner):

1. Native date and time boxes show the format of the browser's interface language, not the page's: a browser in English shows "10/31/2027" and "02:30 AM" (seen in the screenshots), so 11/12 and 12/11 can be confused. Options: (a) keep the native boxes and require Polish browsers for dispatchers; (b) own Polish entry ("31.10.2027", 24-hour time) with a calendar in a Popover, which adds the shadcn Calendar and its `react-day-picker` dependency. Recommendation: (b), because a misread date is a wrong trip and the format must not depend on each computer.
2. The zone comes from the place and cannot be changed in the field; it is named in words ("Czas warszawski") without the offset, which is shown only when the clock goes back.
3. A repeated time is chosen as "przed cofnięciem zegara" or "po cofnięciu zegara" with "UTC+02:00" or "UTC+01:00" under it, instead of "czas letni" and "czas zimowy", so it also holds for zones without summer time names.
4. A time skipped by the clock is rejected with a message; the field never moves it to the next valid time.
5. The conversion lives in `packages/ui/src/lib/zoned-time.ts`, as `decimal.ts` does; it moves to `packages/core` when the server validates TIME-1 with the same rule.

Owner answers (2026-10-29), applied on the same branch: to 1, (c) own text boxes "DD.MM.RRRR" and "GG:MM" (24 hours), checked when the dispatcher leaves the field as in `DecimalField`, with no calendar and no new libraries; a calendar may come later. 2–5 approved. Recorded under TIME-1 in the decisions record. The field now reports `invalidDate` ("31.02.2027") and `invalidTime` ("25:00", "9:30 PM"); a one-digit day, month or hour is accepted (proposal 6, approved by the owner on 2026-10-29).

6. A one-digit day, month or hour is accepted ("2.11.2026", "9:30") and the typed text is never reformatted; a two-digit year is not ("12.11.26"). Owner answer (2026-10-29): approved; recorded under TIME-1.

## Stage 3, batch 3 (2026-10-29)

Built in `src/components/places/`: `PlacePicker` (P04, PLACE-2, PLACE-3), a WAI-ARIA combobox on the input styles, Badge and the text Button. The page passes `options` and `status` (`idle`, `searching`, `results`, `notFound`, `unavailable`); each result shows its kind, address or region and country ("kraj niepotwierdzony" when not confirmed), "Do potwierdzenia" for same-named towns and "wpisano: …" for another spelling. Down/Up wrap, Enter chooses, Escape closes; typing again clears the choice. The chosen result's kind and address are under the box and in its description. Docs page with 13 sections; stories under "Product/Places" with a simulated search on synthetic places. No new dependencies (no `cmdk`) and no new tokens.

Checks: typecheck, lint, unit tests at 100% coverage, story tests (interaction, axe, WCAG 1.4.12), `lint:tokens` 0 in `packages/ui`, Storybook build; the docs page has 13 sections, no page errors, no horizontal scroll at 320 px.

| # | Checklist item | Result |
|---|---|---|
| 1 | Contrast | Pass: axe colour-contrast in all stories |
| 2 | Targets at least 24 px | Pass: box 36 px, result rows at least 36 px |
| 3 | Visible labels | Pass: box named by the Field label; list named by it too |
| 4 | One icon set | Pass: no icons |
| 5 | Colour not alone | Pass: kinds, confirmation and spelling in words |
| 6 | Empty, error, loading states | Pass: saved places, searching, results, not found, unavailable, chosen, error, disabled |
| 7 | Visible focus | Pass: 2 px outline on the box; the active result has background and underline as in Select |
| 8 | No invented data | Pass: places A–E and Miasto D as in the screen map's synthetic data |
| 9 | Only token variants | Pass: no new token or variant |
| 10 | Zero values outside tokens | Pass in `packages/ui` (0); 12 remain in app pages, unchanged |
| 11 | Lines at most 75 characters | Pass: messages inside `max-w-measure` |
| 12 | Message says what happened and what to do | Pass: "Nie znaleziono miejsca. Sprawdź pisownię albo wpisz samo miasto." |

Proposals 1–7 (in pull request #51) approved by the owner on 2026-10-29 and recorded under PLACE-2, PLACE-3 in the decisions record: the page searches; kind words "Zapisane miejsce", "Adres", "Tylko miasto"; same-named towns marked "Do potwierdzenia" without confirming; another spelling shown, no alias saved; saved places selectable when the provider fails; "Dodaj miejsce…" under the box with `places.write`; L08 open.

## Stage 3, batch 4 (2026-10-29)

Built in `src/components/values/`: `EvidenceBadge` (EV-1, EV-2) on Badge with Tabler icons; `ValueWithSource` now shows its estimate through it and takes the evidence words as `labels.evidence` (replacing its own `estimated` and `conflicting`). Docs page with 13 sections; stories under "Product/Values" (states, history rows). No new dependencies and no new tokens.

Checks: typecheck, lint, 158 unit tests at 100% coverage, 113 story tests (interaction, axe, WCAG 1.4.12), `lint:tokens` 0 in `packages/ui`.

| # | Checklist item | Result |
|---|---|---|
| 1 | Contrast | Pass: axe colour-contrast; estimate 11.12:1, neutral 14.71:1 |
| 2 | Targets at least 24 px | Not applicable: badges are not interactive |
| 3 | Visible labels | Pass: the history table names the column "Pewność" |
| 4 | One icon set | Pass: Tabler `IconCircleOff`, `IconAlertTriangle` |
| 5 | Colour not alone | Pass: every badge is a word; icons are `aria-hidden` and beside words |
| 6 | Empty, error, loading states | Pass: a certain value renders nothing; badges have no other states |
| 7 | Visible focus | Not applicable: no focusable element |
| 8 | No invented data | Pass: words from EV-1, P4 and the History section; prices synthetic |
| 9 | Only token variants | Pass: existing `neutral` and `estimate` variants |
| 10 | Zero values outside tokens | Pass in `packages/ui` (0); 12 remain in app pages, unchanged |
| 11 | Lines at most 75 characters | Pass: one or two words per badge |
| 12 | Message says what happened and what to do | Not applicable: the reason belongs to `ValueWithSource` details |

Owner answers (2026-10-29) to the proposals in pull request #53: 1–4 approved (one component; missing and conflicting neutral with word and icon; no estimate on missing or conflicting; "Plan" only where passed). 5 rejected: `ValueWithSource` uses `EvidenceBadge` now, so "Szacunek" has one source. Recorded under EV-1 in the decisions record. The kilometre check badge is not built (Phase 2); its open question is recorded at #24 in the E01 specification.

## Stage 3, batch 5 (2026-10-29): screen requirements and frame components

Before the E01 screens are built, the decisions record and the clickable prototype (`prototype/e01-clickable` at 7231c29) were turned into requirements. A component goes to `packages/ui` only when more than one E01 screen consumes it; otherwise the screen story composes existing components.

Requirements for the E01 screens:

| Decision | Screen | Realised by |
|---|---|---|
| N6a, R17.1 | Quote | Cost table with share bar beside one summary panel (composition) |
| N7a, R18.1 | Entry | One open step, completed steps collapsed with "Zmień" (composition) |
| R18.2 | Entry, route, quote | `StepBar` |
| N7b, R19.1 | Entry, route, quote | `RouteStops` |
| N7c | Entry, route, quote | `AppFrame`: centred content, 360 px panel, the same step bar |
| N7d | Every screen | `AppFrame` navigation panel |

Design-system gaps marked `DS GAP` in the prototype:

| Gap | Decision | Where | Reason |
|---|---|---|---|
| G03 place search | Closed | `PlacePicker` (#51) | Screens use it, not the prototype's picker |
| G10 warning, success | No new tokens | Composition: Alert `neutral`, `SuccessMessage` | Batch 2: Alert only `neutral` and `error`, no green badge |
| G11 trip status words | Badge `neutral`, word from the page | Composition | Badge suffices; the status-to-word mapping is domain |
| G12 frame and navigation | `AppFrame` | Component | Every screen |
| G12 step bar | `StepBar` | Component | Entry, route, quote |
| G13 trip sequence | List | Composition | One screen |
| G13 country split | Table with fixed synthetic data | Composition | One screen; see W2 |
| G13 cost breakdown | Table with share bar | Composition | Quote only |
| G13 summary panel | Card, `ValueWithSource`, `EvidenceBadge` | Composition | Quote only |
| G15 route schematic | Superseded by N7b | `RouteStops` | Entry, route, quote |

Owner decisions (2026-10-29):

- The tables above are approved. `AppFrame`, `StepBar` and `RouteStops` extend Q4, which limited `packages/ui` to the four fields and small badges, because each has more than one consuming screen.
- W1 (a): no warning or success tokens. Following the batch 2 answer (Alert only `neutral` and `error`, no green badge), a warning is Alert `neutral` with its icon and the word "Uwaga"; icon and word meet R15.1.
- W2 (a): the prototype's `allocate` splits a segment total by kilometre share and gives the remainder to the last country. That contradicts the specification and is not ported: a country's cost is its kilometres times its rate (SRC-4), totals are rounded once from exact values, and a rounding reconciliation line is shown when displayed components differ from the total (FIN-3). Screen stories use fixed synthetic data consistent with FIN-3.
- `AppFrame`: (1) N7d supersedes L22 in the screen map: the account and "Wyloguj" sit in the left panel, not in a top bar; (2) the page passes the navigation entries according to the user's permissions (L12); the component holds no fixed list.
- Screens use `PlacePicker` from #51, not the prototype's version.
- L08 (later on 2026-10-29): no time limit on the screen. Place search (s10.2), route (s11.2) and quote (s12.20) show "Szukam…", "Liczę trasę…" or "Liczę wycenę…" until the server returns a result or an error; time limits and retries are server-side only, and a server error is the existing "service unavailable" state. `PlacePicker` is unchanged. Recorded under L08 in the decisions record.

Built: `src/components/layout/app-frame.tsx` (`AppFrame`: N7c, N7d, L12), `src/components/layout/step-bar.tsx` (`StepBar`: R18.2, N7a) and `src/components/trips/route-stops.tsx` (`RouteStops`: N7b, R19.1). Three layout tokens in `src/styles.css`: `frame-navigation` 224 px, `frame-panel` 360 px (N7c), `frame-content` 1120 px. Docs pages with 13 sections; stories under "Product/Layout" and "Product/Trips" with the prototype's synthetic trip (Auto 01, places A–C, 12.11.2026). No new dependencies.

Checks: typecheck, lint, 202 unit tests at 100% coverage (statements 579/579, branches 459/459, functions 183/183, lines 490/490), 141 story tests (interaction, axe, WCAG 1.4.12), `lint:tokens` 0, Storybook build; in the built Storybook no page errors and no horizontal scroll at 320, 600, 800, 1024 and 1440 px.

| # | Checklist item | Result |
|---|---|---|
| 1 | Contrast | Pass: axe colour-contrast in all stories |
| 2 | Targets at least 24 px | Pass: navigation entries 36 px; the step bar and route stops have no targets |
| 3 | Visible labels | Pass: navigation, panel, step list and route list are named; details are label–value pairs |
| 4 | One icon set | Pass: Tabler `IconCheck` |
| 5 | Colour not alone | Pass: current entry by weight and `aria-current`; steps by check, number and "gotowe" |
| 6 | Empty, error, loading states | Pass: stops not entered yet use the page's words; other states belong to the content |
| 7 | Visible focus | Pass: navigation links use the 2 px outline (T4) |
| 8 | No invented data | Pass: entries "Nowa wycena", "Kursy aut", "Flota" and the trip from the prototype |
| 9 | Only token variants | Pass: two `width` values of the frame; three new layout tokens |
| 10 | Zero values outside tokens | Pass in `packages/ui` (0) |
| 11 | Lines at most 75 characters | Pass: short labels and values |
| 12 | Message says what happened and what to do | Not applicable: no messages |

Proposals of stage 3 batch 5 (for the owner):

1. Navigation width 224 px (the prototype's 220 px on the 4 px grid) and centred content at most 1120 px (the prototype's value); N7c fixes only the 360 px panel.
2. `width="centred"` only on entry, route and quote; other work screens keep the whole width, as "Spacing and layout" says.
3. Breakpoints: the navigation becomes a left panel from 768 px (`md`), the panel goes beside the content from 1280 px (`xl`), because at 1024 px only about 376 px would remain for loading and unloading side by side. This adds `xl` to the one breakpoint the system relied on.
4. Under 768 px the navigation sits above the content as a plain list, with no menu button (no new component).
5. Step names at 14 px (`text-table`) instead of the prototype's 12 px, because the 12 px roles carry the muted colour and the names of done and current steps must read in the default colour.
6. The company name the prototype showed above the navigation is not in the frame; no decision asks for it.
7. Folders: `layout/` for the frame and the step bar, `trips/` for route stops, because each has several consuming screens (the stage 3 rule creates a domain folder at the second consumer).

## Next step

Conditions before screens are built (owner decision 2026-10-29): L08 is decided (no time limit on the screen; see batch 5); L09 (what the dispatcher does without the map provider and how a place is added) remains open in the screen map. Next: screens as stories from real components. Stage 4 follows the structure model recorded under "owner instruction for stages 3 and 4".

## N2b: ordinary text weight (2026-10-29)

Approved N2b is implemented in the shared roles: body (14/21), table and number (14/20), label and meta (12/16) use IBM Plex Sans 500. Page and section headings and body-strong retain 600. The existing font dependency remains at 5.3.0; the unused 400 import and weight token are removed. Components already use roles and need no weight overrides. Sizes, line heights, colours, spacing and the independently measured icon stroke token are unchanged.
