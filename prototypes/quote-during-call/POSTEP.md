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
- Stage 3: notes per screen, README with simulation limits, navigation tests, browser check at 320 and 1440 px and by keyboard. README in English lists every screen s01–s19 and its states, so the screen IDs are explained in this repository (owner decision 2026-10-29).

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
- G15 route schematic: simulated A → B → C geometry, dashed approach and solid loaded segment.

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

## Stage 1b. Owner comments and quote variants

Status: **done; owner selected direction C (N6a), superseded by Stage 1c** (2026-10-29). Stage 2 remains not started.

### Owner feedback addressed

- s07 unused right-hand space: trip sequence and the free-place/time panel use two columns, collapsing to one on a narrow viewport (`src/app/App.tsx`, `styles.css`).
- s09 unused right-hand space: entry fields and route summary occupy two columns, collapsing to one (`App.tsx`, `styles.css`).
- s09 freight alignment: prototype-only `amount-left` class, explicitly marked `DS PROPOSAL: amount input left-aligned`. Shared DecimalField is unchanged.
- s10 place selection: independent loading/unloading inputs suggest from the first character, showing country, fictional region and the fictional-data label. Arrow keys, Enter and Escape are supported. Places A/B/C/E and two regional instances of Town D come from the approved synthetic map; extra towns are explicitly fictional. Only B → C has a quote in Stage 1 (`PlacePicker.tsx`). Starting a new entry also resets local suggestion/selection state. No geocoder is connected; PLACE-3 simulation note is visible.
- s11 unclear route/countries: separate approach and loaded-segment tables, whole kilometres, country fuel/toll amounts, segment totals and trip total (`CountryCosts.tsx`). Fuel follows the example's consumption: approach 2.00 EUR, loaded 16.00 EUR. Toll is 2.00 + 8.00 EUR. Each segment is allocated by country kilometres using BigInt cents; the final country receives any remainder. Current allocations have zero remainder. All country inputs are explicitly fictional.
- Back control covering content: bottom clearance uses existing spacing tokens and Back is in normal document flow through the CSS bridge; the review engine remains unchanged (`styles.css`, `src/review/mostek.css`).
- Navigation inconsistency: both product entries use the same text-button style, with `aria-current="page"` and a token-based active background (`App.tsx`, `styles.css`). Accept is the primary quote action.
- Route visibility: s09 after place selection and all s12 variants show A → B → C, dashed approach, solid loaded segment, whole km and Warsaw times. The explicit map-simulation caveat is visible (`RouteSchematic.tsx`). **DS GAP G15 route schematic** is a prototype-only composition, not a map service.
- Thin type and quote colour: three alternatives below. Fleet positions and other Stage 2 work remain deferred.

### Quote alternatives

All alternatives share one s12 ID, the scenario-panel selector (default A), visible variant marker, identical inputs, 38.18 EUR covered cost / 21.82 EUR result, estimated status, availability beside the result, every cost, source-details navigation and acceptance behaviour (`Quote.tsx`, `App.tsx`).

- **A**: current design tokens, stronger result/availability hierarchy and compact cost table. Table geometry follows the existing horizontal-line table decision R14.1 and the extended-table reference; no new DS proposal.
- **B**: route schematic occupies two thirds of the upper layout beside result/availability, with a five-value bar including approach. R07.1 informs the result bar. B1 proposes IBM Plex Sans 500 body text; B2 proposes blue ink/surface for the cost/result bar.
- **C**: calculator sections separate route costs from trip servicing, with value pills and a result badge. Grouped-calculator and value-badge references inform composition (visual sources are not copied). C1 proposes Plex 500; C2 proposes group surfaces; C3 proposes a purple profit badge, visibly marked as a proposal pending owner choice. Loss remains a red badge with the word “Strata” and minus sign, per N5a; profit is not green.

All B/C deviations are local variables in `src/app/variant-proposals.css`. No values are added to the shared UI package. Existing tokens handle spacing, focus, loss and typography sizes.

New text/background contrast, calculated from linearized sRGB relative luminance:

| Pair | Contrast | Result |
|---|---|---|
| B2/C2 blue / pale blue | 9.56:1 | passed |
| C2 blue / white pill | 10.81:1 | passed |
| C3 purple / pale purple | 10.30:1 | passed |

Body colours on other surfaces use unchanged DS pairs. Plex 500 is loaded locally from the same pinned font package as the DS. The prototype declares that direct dependency; no new library or font service.

### Validation

| Check | Result |
|---|---|
| Package typecheck/build | passed |
| Repository typecheck/lint | passed |
| Repository unit tests | passed: 155 |
| Prototype source lint | passed |
| Tokens excluding proposal CSS | passed: 0 |
| Browser 1440/320 CSS pixels | passed |
| Quote A/B/C and accepted A/B/C | passed |
| Picker keyboard/empty/reset | passed |
| Exact allocation assertions | passed |
| Protected source diff | passed: empty |
| Diff whitespace | passed |

Commands: package `typecheck`/`build`; `pnpm typecheck`, `pnpm lint`, `pnpm test`; explicit ESLint of prototype sources; `node packages/ui/scripts/check-tokens.ts` with every app source file except `variant-proposals.css`, plus `src/main.tsx`. Key results: `Tests 155 passed (155)`, `No values outside the design tokens.`, `built in 905ms`.

An isolated browser context traversed s07, s09, s10, s11, s12 A/B/C, accepted s12 A/B/C and s16 at both 1440 and 320 CSS pixels; 22 external PNGs cover those states. Verified actual viewport width, no horizontal quote overflow, exact B/C selection after one/two typed characters, arrows, Enter, Escape, empty suggestions, reset and acceptance. Computed freight alignment is `left`; Back is `static`. Route labels remain readable without scaling text down inside SVG. Screenshots are not committed.

Exact allocation assertions: 2.00 EUR approach fuel/toll → 1.20 + 0.80 EUR; 16.00 EUR loaded fuel → 10.00 + 6.00 EUR; 8.00 EUR loaded toll → 5.00 + 3.00 EUR; 1.01 EUR remainder case → 0.60 + 0.41 EUR; allocation above Number.MAX_SAFE_INTEGER preserves its BigInt sum. This fixture does not introduce a production rounding policy.

Not run: Stage 2 scenarios (including loss acceptance), production integration/coverage, full accessibility audit and cross-browser matrix. No application or shared-UI source changed. Browser console has form label/id audit notices; no runtime exception was observed in the final walkthrough. Those notices were not exhaustively audited here. No production specification is marked implemented. Stage 3 includes the English screen/state README requirement above.

Initial font-import failure was resolved by declaring the existing font package directly in the prototype. CLI keyboard injection did not emit keydown in the attached session; keyboard behaviour is verified separately through the browser provider in an isolated context. This is tool behaviour, not a claimed application regression.

Implementation: `c36db18`; baseline sync: `a4ea22a`, followed by `6db5205` for the final documentation-only main update (#49). No pull request opened and no merge into the base branch. Owner selected direction C under N6a; Stage 1c below replaces the alternatives before the next stage.


## Stage 1c. Quote screen direction C, customers, fixes

Status: **done, waiting for owner review** (2026-10-29). Stage 2 remains not started.

### Delivered

- N6a: one s12 layout with a cost/source/amount/share table beside one summary card. The route schematic remains above the table. Summary includes result, planned availability, freight, covered cost and state-dependent actions; acceptance, details and trip navigation retain their behaviour. On narrow screens the summary and accept action precede the route and table; sources move below cost labels without horizontal scrolling.
- R17.1: text percentages and decorative, aria-hidden share bars use the action token on the divider token. Exact integer-cent BigInt arithmetic rounds shares half up to one decimal. Fixture assertions: 47.1 / 26.2 / 15.7 / 10.5 / 0.5 / 0.0 %. Total stays 100.0 %; a conditional reconciliation note handles a rounded sum different from 100.0 %. Wash explicitly shows entered “Bez mycia”, 0.00 EUR, 0.0 %.
- Vehicle costs expand into the nine daily categories already explained on s13. The 6.00 EUR fixture is allocated proportionally using integer cents and largest remainders, preserving its sum. Child shares use the whole trip cost as denominator. This is a labelled synthetic illustration, not a new production financial policy.
- N2b: IBM Plex Sans 500 throughout body/label/meta roles via a local variable override. Heading roles stay unchanged. Removed the A/B/C scenario selector, variant marker and all obsolete variant colour styles; the proposal stylesheet retains only the documented typography override. Shared tokens were not edited.
- SCOPE PROPOSAL: optional loading and unloading customers on s09, identical for dispatcher and owner. Six fictional companies with one to three saved demo places; search by name/city from the first character, arrows/Enter/Escape. A single place fills automatically; multiple places offer keyboard-operable choices. Places remain independently editable/selectable without a customer. Customer selections do not alter price. Route and trip screens show the customer; accepted K2 keeps its customer snapshot after a fresh entry. Both required scope caveats are visible.
- Back: corrected the CSS bridge selector specificity so normal-flow positioning actually wins over the engine rule. The engine file is byte-identical to the previous stage; bottom clearance remains. Route: fixed 36 px drawing height with HTML labels in the 12 px label role, independent of width. No SVG text scales with the drawing.
- Merged current main (including #48) without rewriting history; DecimalField and its parser now use `amount` plus EUR currency. No protected application/shared-component/story changes relative to main. Decision records were read from the approved direction branch, not copied into this branch.

### Validation

- Package typecheck and build: passed.
- Repository `pnpm typecheck`, `pnpm lint`, `pnpm test`: passed; 34 test files, 156 tests.
- Explicit prototype source/script ESLint: passed. Token scan of app sources excluding the proposal stylesheet plus main entry: 0 findings. Style detector: 0 findings. Diff whitespace: passed.
- `pnpm exec tsx prototypes/quote-during-call/scripts/check-cost-shares.ts`: fixture shares, nine-category sum, zero total, fractional rounding and values above Number.MAX_SAFE_INTEGER passed. A shorter temporary directory was used to avoid an environment IPC path-length limit.
- Bar contrast: action `#205b49` against divider `#d9e2dd`, **5.9806:1** (linearized sRGB luminance), exceeding 3:1. These are unchanged shared token values; every category uses the same pair.
- Isolated browser at actual 1440 and 320 CSS pixels: keyboard customer selection (single/multiple saved places), first-character/name/city/no-match search, Escape, independent place selection, s09, s12 draft, nine expanded categories, s13, s16, accepted s12, s07, accepted snapshot after new entry and owner-role parity passed. Seven screenshots per width remain external to Git.
- All s01–s19 screens scrolled to the end at both widths: Back computed static and below the frame; no horizontal document overflow. Body weight computed 500; route height 36 px and label size 12 px at both widths. Mobile summary precedes the table. Runtime errors: 0.
- Protected diff against main for application/shared UI source/stories: empty. Preview index/assets replaced, prior evidence preserved.

Not run: production application build/integration/coverage, Stage 2 scenario matrix including negative-result acceptance, complete accessibility audit or cross-browser matrix. The loss presentation remains confined to the result, with the loss token pair, “Strata” and minus sign (N5a). Production specifications remain approved and unimplemented. No PR opened and no base-branch merge.

### Questions for the customer-directory specification

1. Where does the directory originate: manual records, invoices or accounting?
2. Is the ordering party distinct from the customer at a loading/unloading place?
3. Should customer identity affect similar-trip matching and result-per-customer reporting (E8)?

Next: owner review of Stage 1c, then authorization of Stage 2; the customer proposal requires specification decisions before production implementation.

## Stage 1d. Entry steps, route stops, shared frame, side navigation

Status: **done, waiting for owner review** (2026-10-29). Stage 2 remains not started.

### Delivered

- N7d: a 220 px left navigation panel on s05–s19, with demo company, quotation/trip entries, `aria-current="page"`, the existing active background, later-phase fleet entry, account and sign-out. Fleet is disabled in Phase 1 and linked in the later preview (p19). No navigation icons. At narrow widths, a Menu button opens the same entries in the shared Dialog with a text close action and focus return. s01–s04 have no product navigation; the review toolbar and engine remain unchanged.
- N7c: centred content up to 1120 px on entry/place/route/quote/details/acceptance screens. Desktop uses a main column and 360 px right panel; narrow layouts stack. s09/s11 show the route on the right; s12 keeps the quote summary on the right and route above the cost table. s10/s13/s16 use the same frame with route context.
- N7a, R18.1/R18.2: three entry cards with exactly one open step, completed answer/neutral Gotowe badge/Zmień action, muted waiting steps and the specified next actions. Collapsed controls stay mounted and hidden, preserving customer queries, dates, freight and wash while editing an earlier step. The four-part progress bar is informational: completed checks and following lines use the action token, the current numbered circle has a pale outline, future circles are outlined/muted; labels use the 12 px role. Route/quote/details/acceptance currently show step 4 pending the confirmation below.
- Loading/unloading occupy separate columns, stacking at 320 px. Optional customers retain first-character/name/city keyboard search, single-place fill and multiple-place buttons. Independent place search and More places → s10 remain available. The customer-directory scope note appears once below both columns.
- Z1 c / TIME-1: reused the delivered ZonedDateTimeField, with text DD.MM.RRRR and GG:MM inputs and a Warsaw-time label, inside Field for accessible naming/errors. Invalid or empty dates/times block progression and explain the required format. The fixed example still uses 12.11.2026, 12:00/13:00; loading time is visibly fictional. DecimalField, EUR, mandatory wash with no default and optional order reference retain their behaviour.
- N7b, R19.1: start/loading/unloading stop blocks replace the obsolete route schematic and its styles. Each shows a left label, 16 px time, date (Warsaw), place/country and label–value details; unselected customers produce no customer row. Whole kilometres (D65), empty approach/loaded wording, fictional loading-time warning, next free place and map-simulation caveat remain visible. s11 country tables and N6a/R17.1 quote table/summary are preserved.
- Responsive click correction: customer/place suggestions now overlay the following content. Closing suggestions on blur no longer moves the next action between pointer-down and pointer-up. Keyboard selection remains unchanged; the existing composition-verification lesson records the finding.
- Money and the K2 example are unchanged: Auto 01, 60.00 EUR freight, 38.18 EUR covered cost, 21.82 EUR result. No application, shared-component or story source edited. No production specification marked implemented.

### Validation

- Package typecheck and build passed; final build completed in 1.21 s.
- Repository `pnpm typecheck`, `pnpm lint`, `pnpm test` passed: 36 files, 190 tests.
- Explicit prototype source/script ESLint passed. Token scan of all app sources except `variant-proposals.css` plus `src/main.tsx`: 0 findings. Style detector: 0 findings. Diff whitespace passed.
- `check-cost-shares.ts` passed: fixture shares, vehicle sum, zero denominator, rounding and large BigInt cases.
- Isolated browser at actual 1440 and 320 CSS pixels passed: s09 steps 1→2→3, edit step 1 and return with preserved values; keyboard customer selection with one/multiple places; independent full-place search from the first character through s10; text date formats and invalid-date rejection; s11; s12 draft and accepted; s13/s16; s07; active navigation; disabled/linked fleet for p19; narrow Menu open/close/navigation. Direct next-action click with suggestions open is covered at both widths.
- All 19 screens scrolled to the end at both widths: no horizontal overflow, Back computed `static` and below the frame. Runtime errors: 0. Nineteen external screenshots cover the changed flow and narrow menu; none are committed.
- `prototype.js` is byte-identical to Stage 1c. Protected source diff against current main is empty. Main was merged without rewriting history, including the approved entry/route/navigation decision record when it landed via #54. The record was not copied from its feature branch.
- Preview index/assets replaced, preserving prior evidence directories.

Not run: production application build, production integration/coverage or Storybook story tests; Stage 2 scenarios, exhaustive accessibility audit and cross-browser matrix. Only prototype composition changed. No pull request opened and no base-branch merge.

### Questions for owner review

1. Confirm step 4 “Wycena” as current on s11, s13 and s16 (also used on s12), or specify a different current step for those screens.
2. Navigation currently has no icons, as requested. Should it remain text-only in the final product?

Next: review Stage 1d and answer these two presentation questions before authorizing Stage 2. The separate customer-directory specification questions from Stage 1c remain open.

Publication: implementation `721d2d3`; baseline merges `2bd966c` and `82d9245`. Normal push verified. Preview server HTTP 200 and index SHA-256 match verified; preview index cloud upload confirmed, second-device download unverified. Full browser and publication results are recorded in the Stage 1d run log.
