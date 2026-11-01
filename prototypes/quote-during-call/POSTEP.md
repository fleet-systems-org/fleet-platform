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

- Stage 1 (dispatcher, Kierowca A · DEMO 001, draft K2): s01 → s09 (step 1 vehicle) → s10 → s09 (times, freight 60,00 EUR, "Bez mycia") → s11 → s12 (cost 38,18, result 21,82, "free in Miejsce C from 13:00") → s13 → s16 → s12 accepted.
- Stage 2: s02–s05, s08, s14, s15, s18, every state, accounts and access gates; then the "show what comes later" control adds s06, s07, s19 (Phase 2) and s17 (Phase 3); s07 moved to later by owner decision S07-1, 2026-10-29.
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
- G03 place picker: **closed in Stage 1n**, shared `PlacePicker` after L09 (#62).
- G08 table sorting: **open after Stage 1o**; shared `DataTable` has no sorting API. No parallel page sorting or header buttons added.
- G10 warning/success: **closed in Stage 1n**, `Alert neutral` with icon + "Uwaga" and `SuccessMessage` (W1); no new status tokens.
- G11 trip status words: **closed in Stage 1o for s12–s16**, `Badge` `neutral` with Szkic, Przyjęty, Anulowany, Nieaktualna, Do przeglądu.
- G12 page frame/navigation/steps: **closed in Stage 1n**, shared `AppFrame` and `StepBar`; approved plain navigation list below 768 px (Stage 1n review correction).
- G13 country split: composed in Stage 1n; cost breakdown and result panel: **closed in Stage 1o**. Trip sequence outside s12–s16 remains for its own scope.
- G15 route schematic: **closed in Stage 1n**, shared `RouteStops` (N7b supersedes schematic).

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
- Kierowca A · DEMO 001, K2, freight 60.00 EUR, cost 38.18 EUR, result 21.82 EUR and next availability in Miejsce C at 13:00 Europe/Warsaw. Cost rows: fuel 18.00, toll 10.00, AdBlue 0.18, wash 0.00, vehicle 6.00, labour 4.00. Source details use ValueWithSource; the nine-category vehicle-day fixture is explained in s13.
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
- N7a, R18.1/R18.2: three entry cards with exactly one open step, completed answer/neutral Gotowe badge/Zmień action, muted waiting steps and the specified next actions. Collapsed controls stay mounted and hidden, preserving customer queries, dates, freight and wash while editing an earlier step. The four-part progress bar is informational: completed checks and following lines use the action token, the current numbered circle has a pale outline, future circles are outlined/muted; labels use the 12 px role. Route/quote/details/acceptance show step 4, confirmed by the owner on 2026-10-29 ("yes").
- Loading/unloading occupy separate columns, stacking at 320 px. Optional customers retain first-character/name/city keyboard search, single-place fill and multiple-place buttons. Independent place search and More places → s10 remain available. The customer-directory scope note appears once below both columns.
- Z1 c / TIME-1: reused the delivered ZonedDateTimeField, with text DD.MM.RRRR and GG:MM inputs and a Warsaw-time label, inside Field for accessible naming/errors. Invalid or empty dates/times block progression and explain the required format. The fixed example still uses 12.11.2026, 12:00/13:00; loading time is visibly fictional. DecimalField, EUR, mandatory wash with no default and optional order reference retain their behaviour.
- N7b, R19.1: start/loading/unloading stop blocks replace the obsolete route schematic and its styles. Each shows a left label, 16 px time, date (Warsaw), place/country and label–value details; unselected customers produce no customer row. Whole kilometres (D65), empty approach/loaded wording, fictional loading-time warning, next free place and map-simulation caveat remain visible. s11 country tables and N6a/R17.1 quote table/summary are preserved.
- Responsive click correction: customer/place suggestions now overlay the following content. Closing suggestions on blur no longer moves the next action between pointer-down and pointer-up. Keyboard selection remains unchanged; the existing composition-verification lesson records the finding.
- Money and the K2 example are unchanged: Kierowca A · DEMO 001, 60.00 EUR freight, 38.18 EUR covered cost, 21.82 EUR result. No application, shared-component or story source edited. No production specification marked implemented.

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

1. **Resolved 2026-10-29:** the owner answered "yes"; step 4 “Wycena” is current on s11, s12, s13 and s16.
2. Resolved 2026-10-29: text-only for now (N7g).

Next: review Stage 1d; navigation is resolved by N7g; Stage 2 still requires authorization. The separate customer-directory specification questions from Stage 1c remain open.

Publication: implementation `721d2d3`; baseline merges `2bd966c` and `82d9245`. Normal push verified. Preview server HTTP 200 and index SHA-256 match verified; preview index cloud upload confirmed, second-device download unverified. Full browser and publication results are recorded in the Stage 1d run log.

## Stage 1e. Owner review fixes

Status: **done, waiting for owner review** (2026-10-29). Stage 2 remains not started.

### Defect and cause

Direct screen-picker entry to s13, and entry after a simulation reset, showed empty vehicle/place placeholders beside the K2 fixture. All route panels read the live entry state; only s12 had the quotation summary. The value-details screen also mixed evidence with working notes in paragraphs.

### Changes

- N7b/R19.1: distinct live entry route for s09/s10 and viewed K2 snapshot for s11/s12/s13/s16. The snapshot always contains Kierowca A · DEMO 001, A/PL at 11:00, B/DE at 12:00, C/CZ at 13:00, 20 km approach and 80 km loaded. Customer selections are captured when the supported entry advances; editing a later entry cannot alter the viewed quote. Direct screen selection and reset open the fixed K2 example, including its 60.00 EUR freight and 21.82 EUR result.
- N7c/N6a: one shared summary-first frame for all four quotation screens. At desktop widths the same 360 px panel contains result, estimate, availability, freight, covered cost and state-dependent actions; at 320 px it precedes the route and screen content. Accept is primary only in the summary; on s16 it opens the existing confirmation. Accepted actions retain new quotation/trip navigation. The route precedes main content.
- EV-4/D65/FIN-3: s13 is the accessible exact-value view, with values, certainty, source, date and estimate reason exposed in table cells rather than hidden in paragraphs/popovers. Kilometres/litres retain three decimals, rates/consumption six, EUR amounts two. Separate empty/loaded consumption rows and vehicle/labour daily-rate formulas preserve the synthetic example. Narrow rows retain all six labelled fields without horizontal scrolling.
- R17.1: vehicle costs expand into the same nine category rows used on s12 (amount, percentage of whole trip cost and action-colour share bar). The existing exact-cent allocation is unchanged.
- Working notes about the synthetic vehicle split and missing live sources moved to the review engine's `.notes`; product content has the single sentence “Dane z przykładu specyfikacji; fikcyjne.”
- R18.1: completed entry steps stay on one line, with Gotowe, an ellipsized answer (full text retained in title and accessible text) and right-aligned Zmień. More places sits directly below and left-aligned with its place field. Warsaw time remains at the date/time fields, with no repeated footer. R19.1 route labels use the same fixed 96 px column everywhere.
- R18.2: step 4 on s11/s12/s13/s16 is confirmed by the owner's 2026-10-29 “yes”; the Stage 1d question is closed. The local 500-weight override is retained.

### Validation

- Package typecheck/build and repository typecheck/lint passed. Unit tests passed: 190 before baseline sync, 196 after syncing current main. Explicit prototype ESLint passed; token scan and design detector returned 0 findings. Exact cost-share assertions passed; review engine SHA-256 remains byte-identical to the starting commit.
- Isolated browser at actual 1440/320 CSS pixels passed direct screen-picker entry, repeated reset, all four identical summaries, summary-first narrow layout, 96 px route labels, all eleven evidence rows, nine expanded vehicle categories, s09 step 2/collapsed step 1/More places alignment, full entry-to-acceptance path and K2 customer snapshots after editing the entry.
- Every checked screen was scrolled to the end: no horizontal overflow and Back static below the frame. Runtime errors: 0. Twenty final screenshots remain outside Git. Preview index/assets replaced; prior evidence preserved.
- Not run: production application build, production integration/coverage, Storybook story tests, Stage 2 scenario matrix, exhaustive accessibility and cross-browser audits. Production source is unchanged by this stage.

The repeatable `scripts/check-quote-route.js` browser-evaluator expression checks direct screen-picker entry and repeated reset against the actual rendered K2 route and summary.

### Simulation limits

All data, country allocation, source dates and vehicle categories are fictional. No live lookup, persisted quote, customer directory or financial-policy change is introduced. The exact table exposes the fixture's evidence inline; this is not implementation of the production evidence API. Production E01 specifications remain approved and unimplemented. Stage 2 and the customer-directory questions remain open. Navigation resolved by N7g.

Publication: implementation `3638c1a`; baseline synchronization `e4392c2`. Protected application/shared UI/story diff against main is empty; no protected source was edited by this stage. Built-preview direct-entry/reset regression passed. Preview index and assets were replaced; final served-index hash and cloud synchronization are checked in the run log. Normal push to the existing prototype branch; no pull request and no base-branch merge.

Next: owner review of Stage 1e before authorizing Stage 2. No Stage 2 work has started.

## Stage 1f. Title order and shared weight

Owner approved Stage 1e s12 as the quotation-screen reference on 2026-10-29. This stage changes only title placement and removes the local typography workaround. Stage 2 remains unstarted.

- Merged origin/main, including shared N2b weight 500. Removed variant-proposals.css and its local font import; ordinary text now uses @fleet-platform/ui roles (500), headings stay 600.
- The shared quotation frame places the h1 first in the main column on s11/s12/s13/s16. At 320 px the order is steps, title, summary/actions, route, content. Existing screen-navigation focus still targets that h1. The right-hand summary and remaining content are preserved.
- Passed prototype typecheck/build, repository typecheck/lint and 196 unit tests (37 files), prototype ESLint, token scan (0), mechanical detector (0), byte-identical prototype.js and empty protected-source diff against origin/main.
- Browser verification on the built preview at actual 1440/320 CSS pixels: s11, s12 draft, s12 accepted, s13, s16; title order, 500/600 computed weights and h1 focus on screen navigation passed. Ten external screenshots in the Stage 1f preview folder; build replaced the preview index/assets.
- Observation outside this stage: accepting the confirmation dialog leaves focus on body after dialog close; navigating between screens still focuses h1. The dialog and review engine were not changed.
- No PR or merge into main. Production specifications remain approved/unimplemented.


## Stage 1g. Route and countries grouped by leg (N7e)

Status: **done, waiting for owner review** (2026-10-29). Stage 2 remains not started.

- s11 retains the shared title/step-4/360 px quotation summary and K2 RouteStops. One table replaces the segment cards, duplicate start/end paragraph and separate trip-total card. Each leg has a rowgroup heading with km, fuel, toll and total; four country rows reuse R17.1 share classes and exact BigInt helpers. The closing row totals 100 km, 18.00 fuel, 10.00 toll and 28.00 EUR. Remaining costs, full quote total, fictional-data note and weekend sentence follow it; existing actions sit below the card.
- Shares use the whole route's 28.00 EUR: 8.6 / 5.7 / 53.6 / 32.1 percent; displayed sum 100.0. Existing integer-cent allocation is unchanged. At 320 px, km/fuel/toll move under each country, group and total label; amount and share remain columns. Only horizontal rules, tabular right-aligned numbers; group rows use the same panel background as the s12 total.
- Programmatic h1 focus is retained. Pointer navigation hides its outline; keyboard Tab/Enter navigation keeps :focus-visible. Other screen content, shared UI and engine source are unchanged. N7e/R20.1 were read from origin/docs/quote-route-groups; no decision file copied.

Validation: package typecheck/build; repository typecheck/lint/test (37 files, 196 tests); explicit prototype ESLint; exact-share assertions including sum 100.0; token scan of src/app and main entry (0); mechanical detector (0); whitespace check; byte-identical prototype.js; protected diff against origin/main empty. Main was already an ancestor, so no synchronization merge was needed.

Browser: actual 1440/320 CSS pixels; s11 scrolled to bottom without horizontal overflow, mobile ordering and metadata verified, desktop summary 360 px and identical DOM to s12. Actual pointer click and keyboard Enter on “Wyceń” confirm h1 focus and the appropriate outline at both widths. Console errors: 0. Three full-page captures remain outside Git in the Stage 1g preview evidence folder; index/assets replaced while earlier evidence was preserved.

Not run: production build/integration/coverage, Storybook tests, Stage 2 scenarios, exhaustive accessibility or cross-browser audit. Production source is unchanged. No PR opened or merge into main. Next: owner review of Stage 1g; Stage 2 needs separate authorization.

## Stage 1h. Sign-in through the existing office system (W2, N8a)

Status: **done, waiting for owner review** (2026-10-29). Stage 2 remains not started.

### Changes

- s01 follows the existing office system sign-in: two equal halves with a dark, tilted/cropped European map and centred 384 px token-derived form; below 64rem the map disappears and Firma Demo appears above the form. No form card, company icon, animation or private reference material. Simulation badge replaces the previous alert.
- Public-domain Natural Earth ne_50m_land is independently projected/clipped/simplified by a Python-standard-library script. Generated data: 54,203 bytes, including source/license and source SHA-256. Six newly invented illustrative arcs use action tokens; the decorative map is aria-hidden. No live routing.
- s01 has login, administrator password-request and new-computer approval states. Login is text with username autocomplete; password is checked only for presence, stays outside React state/persistence and clears before progression. Tabler eye toggles visibility; remember choice is simulation-only. Empty credentials produce an error with colour, icon and words. Password requests retain login and return the same status for every submitted login, without email/reset links.
- New-computer scenario sends sign-in to the status screen; recheck goes to s09 and logout returns to login. Simulation reset clears sign-in state and scenario. Normal sign-in still goes to s09; navigation identifies the account as dyspozytor.
- s02–s04 stay in both screen selectors with “nie występuje przy W2” and contain only the W2 explanation and return link. No production sources, quotation content or arithmetic changed.

### Validation

- Package typecheck/build passed; final Vite build: 626 ms. Repository typecheck/lint/test passed: 37 files, 196 tests. Explicit prototype ESLint passed; frozen-lockfile installation passed.
- Token scan src/app + src/main.tsx: 0. Mechanical source detector: 0 findings (regex/source scan only, not a full accessibility audit). Whitespace check passed. private-name scan: 0.
- Protected diff against origin/main: empty. prototype.js byte-identical to starting commit 06697ed.
- Isolated browser at actual 1440 and 320 CSS pixels: login, request before/after submission, computer approval, empty error, show/hide password, exact Tab sequence login → recovery link → password → eye → remember → submit, happy path and approval to s09, logout/reset, s02–s04 selector annotations and return links. No horizontal overflow in any checked state. Built static preview smoke-checked at both widths.
- Eight screenshots saved externally in the stage-1h evidence directory; none committed. Preview index/assets replaced while preserving earlier evidence folders. Dev browser: no console errors/warnings. Temporary static server: only the browser's missing favicon request (404), no application runtime error.

Not run: production app build/integration/coverage, Storybook tests, cross-browser matrix, exhaustive accessibility audit, Stage 2. Production specifications remain unchanged and unimplemented. No PR opened and no base-branch merge.

Next: owner reviews all three s01 states before authorizing further prototype work. Publication and cloud verification are recorded in the Stage 1h run log.

- External preview and screenshots were kept outside the repository; client-side availability was not verified.

## Stage 1i. Vehicle tiles with driver and tractor (N7f) and map edge

Status: **done, waiting for owner review** (2026-10-29). Stage 2 remains not started.

- s09 step 1 now shows the three synthetic driver/tractor pairs as native radio tiles: three columns from 48rem, one below. Driver name uses 16 px/600; registration uses tabular meta; availability uses 14 px. Selected outline adds no layout shift; keyboard focus is visible. The group and proposal disclaimer identify the driver detail as outside the approved E01 specification.
- Existing Kierowca A · DEMO 001/02/03 IDs map to the synthetic drivers/tractors. Completed step 1 shows the chosen name and registration. Calculations and the K2 snapshot are unchanged.
- s01 generator clipping extends to -40..80 longitude and 20..85 latitude; projection, routes and city coordinates are unchanged. Extended geometry also needs SVG overflow visible inside the clipped map panel: otherwise the SVG viewport itself still cuts Scandinavia. Generated source is 116,171 bytes (limit 120 KB).
- Passed: package typecheck/build; repository typecheck/lint/198 tests; explicit prototype ESLint; tokens 0; mechanical detector 0. Engine byte comparison, routes/cities comparison, protected source diff against main and private-name scan passed. Browser at actual 1440/320 CSS pixels passed pointer selection, arrows/space, visible focus, stable tile dimensions, collapsed answer and happy path to 21.82 EUR. Map captures at 1440/1920 visually verified without artificial land edge.
- Five requested captures and built preview published outside Git; prior evidence preserved. No PR opened and no merge into main. Production coverage/integration/Storybook/cross-browser checks were not run for this prototype-only change.

### Open question for the owner

Resolved 2026-10-29: use driver + tractor registration throughout these locations (N7f, Stage 1l). Driver identity still requires a separate specification decision before production implementation.

Next: owner review of Stage 1i and the label question; Stage 2 needs separate authorization.

## Stage 1j. Sign-in map one to one with the office system (N8a)

Status: **done, waiting for owner review** (2026-10-29). Stage 2 remains not started.

- Corrects the custom map from 1h/1i to the owner's N8a reference: original Mercator crop, land, 5,207 road chains and twelve fictional road-following routes; 800 px perspective, 50-degree X tilt, 150% scale and 64 px translation; red/gold twin light trails with glow and top/bottom background fades. Static SVG, aria-hidden; no animation, logo or private company name.
- Standard-library generator reads external Natural Earth ne_50m_land/ne_10m_roads public-domain GeoJSON. Generated data is 243,088 bytes, below 260 KB, with source/license header. Eight colours live only in --map-* CSS variables with the N8a owner-approved R08.5 exception.
- Passed: package typecheck/build; repository typecheck/lint and 198 tests in 38 files; explicit prototype ESLint; mechanical detector 0. Token check reports exactly eight approved map values, not a clean-token pass; checker remains enabled. Engine byte-identical; protected sources unchanged; form/states and form/mobile CSS byte-identical; private-name scan 0; whitespace check passed.
- Browser: actual 1440×900, 1920×1080 and 320×900; no horizontal overflow; map hidden at 320; static glow, roads, crop and fades visually checked. Evidence hides only review chrome through temporary browser CSS for equal reference dimensions; shipped source retains review chrome. Four requested screenshots including reference | prototype comparison saved externally. Build replaces preview index/assets, preserving earlier evidence.
- Not run: production build, coverage, integration, Storybook, cross-browser matrix or exhaustive accessibility audit. No production feature or specification changed. No PR or merge.

Next: owner compares Stage 1j with the reference; Stage 2 still requires separate authorization. Publication/cloud verification is recorded in the run log.

## Stage 1k. Vehicle tiles for a fleet of twelve (N7f)

Status: **done, waiting for owner review** (2026-10-29). Stage 2 remains not started.

- s09 step 1 has twelve explicitly synthetic driver/tractor choices. Existing Kierowca A · DEMO 001/02/03 mappings are preserved; nine more choices use the same Stage 2 notice and existing non-K2 path. Only Kierowca A · DEMO 001 can satisfy the unchanged K2 calculation gate.
- Compact tiles use 8/12 px padding, 8 px grid gaps, single-line 600-weight names with ellipsis, smaller tabular registrations and 12 px availability. All fixtures share the fixed quote day (12 November 2026), so redundant dates are omitted. Unknown availability remains muted. Four columns from 48rem, two below, no horizontal overflow at 320 px.
- Chronological order uses the displayed availability time with tractor registration as tie-breaker; unknowns come last. Kierowca A · DEMO 001's existing accepted-K2 availability remains 13:00 in Miejsce C and participates in sorting. Group label and proposal disclaimer retained.
- Passed: package typecheck/build, repository typecheck/lint/198 tests, explicit prototype ESLint; tokens 0 outside the unchanged eight approved N8a map colours; mechanical detector 0; unchanged prototype.js byte comparison; protected source diff 0; private-name scan 0; diff whitespace check.
- Real VPS browser at 1440×900 and 320×900: twelve choices in expected order, four/two columns, no horizontal overflow, every tile selectable by pointer, native arrows/Space and visible keyboard focus; full happy path through s11 to s12 remains 21.82 EUR at both widths. Screenshots and built preview are external, not committed.
- No production source, calculation, other step or specification changed. No PR opened and no merge. Production build/coverage/integration/Storybook and cross-browser checks were not run for this prototype-only refinement.

Next: owner review of Stage 1k; Stage 2 requires separate authorization.


## Stage 1l. Invented driver labels, whole-cost shares on s11, text-only navigation

Status: **done, waiting for owner review** (2026-10-29). Stage 2 remains not started.

- N7f: twelve plainly invented labels, Kierowca A–L mapped to DEMO 001–012. Driver/registration replaces old vehicle labels in entry guidance, the collapsed answer, live and snapshot routes, quote heading, acceptance dialog/alert, confirmation, vehicle trips and progress notes. Internal vehicle IDs, chronological order, availability and K2 snapshot/calculations remain unchanged.
- N7e: s11 country bars and percentages use the same 38.18 EUR whole-trip cost as s12. PL 6.3%, approach DE 4.2%, loaded DE 39.3%, CZ 23.6%; whole trip 73.3%, calculated from exact country amounts before rounding (the displayed rounded shares sum to 73.4%). Group headers retain no share. Added the requested denominator explanation below the table.
- N7g: Resolved 2026-10-29: text-only for now (N7g). No navigation code changed.
- Passed: package typecheck/build, repository typecheck/lint and 198 tests in 38 files, explicit prototype ESLint, exact BigInt share assertions, detector 0, tokens 0 outside the eight unchanged approved N8a map values, engine byte comparison, protected-source diff 0, private-company scan 0, git grep of every former given name/surname 0, old vehicle labels in screen content 0 and whitespace check.
- Isolated VPS browser at actual 1440×900 and 320×900: twelve labels and unchanged order, four/two columns, collapsed step 1 and route identity, s11 percentages/bar widths/group headers, s12 result 21.82 EUR, s16, acceptance alert and s07 all passed with no horizontal overflow. Runtime errors 0 in an isolated context. Initial shared-context run hit browser-extension messaging errors; no application workaround was added.
- External preview and screenshots were kept outside the repository; client-side availability was not verified.
- Not run: production build/coverage/integration, Storybook, cross-browser matrix or exhaustive accessibility audit. No production feature/specification changed; no PR opened or merge into main.

Next: owner review of Stage 1l; Stage 2 requires separate authorization. No independent implementation task is authorized by this order.


## Stage 1m. Vehicle trips (s07) moved to later screens (owner decision S07-1)

Owner decision S07-1, 2026-10-29: vehicle trip sequence belongs to E01's Fleet (Phase 2), which states “Trip detail shows the sequence and any gap or overlap” ([specification](../../.ai/specs/2026-10-26-e01-trip-entry-and-quotation.md)). Phase 1 already shows the free place/time in accepted s12; its happy path ends there.

- Moved Kursy aut below Później before Flota, using the same disabled/linked p19 behaviour as Flota and preserving aria-current.
- Accepted quote links to s07 only with p19 set to later. New quote and the acceptance availability alert are unchanged.
- s07 content and direct map/picker entry remain unchanged, using the existing s06 behaviour. The review picker/map has no later grouping; no grouping was introduced.
- Any earlier s07 appearance feedback (including Stage 1b's right-hand-space item) is closed for Stage 1 as superseded by S07-1. No Stage 1 s07 redesign remains open.

Validation: package typecheck/build, repository typecheck/lint and 198 tests (38 files), explicit prototype ESLint, detector 0, tokens 0 outside the eight unchanged approved N8a map declarations, unchanged prototype.js, protected diff 0, private-company scan 0 and whitespace checks passed. Browser at 1440/320: happy path 21.82 EUR, accepted s12 without trip link in Phase 1, disabled ordered menu entries, direct s07 entry, p19 restoring both links and active navigation, mobile Menu open/close, no horizontal overflow and runtime errors 0. Four screenshots saved externally under etap-1m; preview build replaced without removing prior evidence. Stage 2 requires separate authorization.


## Stage 1n. Rebuild on design-system components (D1), part 1: frame, s09–s11

Status: **done, waiting for owner review** (2026-10-29). Stage 2 not started.

### Goal and changes

D1: screens live here, not as Storybook stories. Merged current main and open #62 (`design-system-e01-screens-1`) before composing shared components; no source edits to app/UI/stories.

- Product screens s05–s19 use `AppFrame`, with page-owned permission/navigation entries, later entries and account/sign-out in the left panel. Authentication s01–s04 stays outside the signed-in product frame. Centred entry/place/route/quote flow, other work screens full width. Review bar and engine remain outside the product frame.
- Shared `StepBar` (zero-based current index) and `RouteStops` replace local copies everywhere including s12–s16. Page formats Warsaw times, customer and exact/town-only endpoint labels. Removed obsolete local frame/step/route CSS.
- s09 retains one open step and completed answers with Zmień; existing vehicle/customer proposals are unchanged. s10 uses shared `PlacePicker`, saved places and company towns in not-found/unavailable states. Town-only endpoints and their distances say Tylko miasto/Szacunek. Address save is one action and disappears after saving. No manual address/coordinates.
- L08: searching stays until the simulated response, or indefinitely with the explicit searching scenario; no client cutoff. s11 pending state says Liczę trasę…; unavailable state offers labelled, whole-country km fields. Missing/invalid km never become zero; K2 quote unlocks only at its fixture distances. Other distances can be inspected but do not silently reuse K2's fixed quote.
- W2: removed `allocate`. Every country uses km × its fuel/toll rate, exact micro-EUR BigInt; each displayed aggregate rounds once half-up. Reconciliation appears when displayed components disagree with the exact aggregate. Synthetic country rates: fuel 0.100000 empty / 0.200000 loaded; toll PL 0.100400, DE 0.099400, CZ 0.101000 EUR/km. Km 12/8/50/30; fuel 18.00, toll 10.00; 28.00 + 10.18 = 38.18 EUR, freight 60.00, result **21.82 EUR unchanged**.
- W1: product warnings use neutral Alert + icon + Uwaga; successful save/acceptance uses SuccessMessage. All five G10 bridge aliases are still used by unchanged review comment CSS, so none is unused/deleted; these are review aliases, not product tokens.

### Closed and remaining gaps

G03, G10, G12 and G15 are closed by shared components/composition. G02's shared time control was already adopted; remaining G08, G11/G13 table/status/quote compositions are for part 2 (s12–s16), no new primitive invented here.

Review correction (2026-10-29): below 768 px, AppFrame navigation is a plain list above the content, without a Menu button, disclosure state or page overrides of AppFrame geometry, as approved in Stage 3 batch 5 proposal 4. The former mobile-menu gap is removed because the approved component needs no such prop. L09: successful searches contain saved places and map addresses only; company towns appear only when no address is found or the map is unavailable. Empty-query saved places and fallback lists remain unchanged. AppFrame places its panel after content below 1280 px; this shared order now applies to the quotation panel. A different mobile title/summary/route order needs a later component decision; shared source is untouched.

### Checks and handoff

- External preview and screenshots were kept outside the repository; client-side availability was not verified.

### Stage 1n review correction verification (2026-10-29)

Both requested corrections verified: prototype typecheck/build; repository typecheck/lint/test and test:coverage (202 tests, 100% in all four metrics); explicit prototype ESLint; tokens zero outside eight unchanged N8a values. Review engine unchanged; protected-source diff against main byte-identical to the starting branch. VPS browser: 320/768/1440, no Menu button or horizontal overflow, full K2 path 21.82 EUR, successful map results exclude towns, no-result/unavailable fallback includes company towns, zero runtime/console errors. Replaced 320-s10 and 768-s09 captures and added 1440-s10-wyniki externally. At exactly 768 px the approved AppFrame md breakpoint puts navigation on the left; the plain list above content applies below 768 px. No geometry workaround was introduced. Existing large-bundle warning remains. No production integration/Storybook/cross-browser run. No PR or base merge.

## Stage 1o. Rebuild on design-system components (D1), part 2: s12–s16

Status: complete and published; waiting for owner review (2026-10-29).

### Goal and changes

Compose the current design-system components without changing shared sources, the application or the review engine. Stage 2 scenarios, new screens, driver/tractor/customer-directory work remain outside this stage.

- s12 retains one cost table (source, amount, share and action-colour bar) beside one summary Card, using ValueWithSource and EvidenceBadge. Certain freight and zero wash have no badge; estimates do. Neutral Badge carries Szkic/Przyjęty. Loss uses Badge loss with Strata and minus; profit has no green signal (N5a/N6a/R11.1/R17.1/P4).
- s12's explicit synthetic response selector exercises result, loss (30.00 − 38.18 = −8.18 EUR), pending and unavailable. Pending says Liczę wycenę… with LoadingMessage, has no client timeout, hides the result and prevents acceptance; a service error uses ErrorMessage (L08). This is verification of requested states, not the Stage 2 scenario suite.
- s13 uses ValueWithSource and its shared Popover for exact values, certainty, source, date and reason. Country toll rates match the Stage 1n fixture. Vehicle details reuse the category rows.
- s14 composes Dialog, DecimalField, Field and Textarea; labelled input and source/reason are required. A valid entry is retained only in local simulation and does not silently recalculate the fixed K2 quote. Dialog preserves input on outside interaction and restores trigger focus on close.
- s15 composes DataTable and neutral status Badges with two explicitly fictitious drafts. Shared paging controls are used. No recommendation or custom sorting. Full comparison behaviour remains Stage 2.
- s16 composes AlertDialog with Textarea (optional note, required trimmed reason for a negative rounded result, max 500 characters, no personal data). Cancel initially has focus, Escape/cancel return to the trigger; acceptance keeps the quote, navigates to accepted s12 and displays SuccessMessage (W1).
- Removed the unrelated private-process sentence from the Stage 1n run log.

### Exact synthetic vehicle costs (FIN-3)

Each category is its daily EUR rate × 7200 / 86400, carried as a BigInt rational cent numerator until publication. Daily rates: 24, 8, 2, 6, 10, 8, 3, 1, 10 EUR; total 72. Each published category is independently rounded half-up: 2.00, 0.67, 0.17, 0.50, 0.83, 0.67, 0.25, 0.08, 0.83 EUR. No largest-remainder allocation and no Number conversion.

The exact aggregate is rounded once: 72 × 7200 / 86400 = **6.00 EUR**. The displayed categories also sum to 6.00, so this fixture needs no reconciliation. The composition renders a reconciliation line when their sum differs from the once-rounded exact aggregate. Covered cost **38.18 EUR** and result **21.82 EUR** remain unchanged. Rates are fictitious, not company configuration or a new financial policy; A10 remains open.

### Closed and remaining gaps

- G11 closed for s12–s16: neutral status Badge, word owned by the page.
- G13 cost breakdown and summary closed by table/Card/ValueWithSource/EvidenceBadge composition; no new primitive. Country split was covered in Stage 1n. Other screens, including sequence work, are unchanged.
- DS GAP G08 remains: DataTable exposes columns/rows/paging but no sort state, header control or sort callback. Sorting must be added to the shared component under a separate order; no workaround in this prototype.
- Shared sources remain unchanged. AppFrame's approved below-xl content-then-panel order is retained. No overrides of shared control interiors were added; inherited button geometry overrides were removed from quote/details tables.

### Checks

Passed: prototype typecheck/build; repository typecheck/lint; explicit prototype ESLint; 202 unit tests; 100% coverage (580 statements, 459 branches, 184 functions, 491 lines), without configuration/exclusion changes. Tokens: only eight unchanged N8a map colours, zero outside the exception. Mechanical detector: zero findings. BigInt fixture assertions and independent Python Decimal check agree on all category amounts and 6.00 total.

Final built-browser pass at actual 1440/1024/768/320 CSS px: s09 → s10 → s09 → s11 → s12 → s13 → s16 → accepted s12; s14 and s15; expanded nine vehicle categories in s12/s13; no horizontal page scroll. Popover/Dialog/AlertDialog keyboard opening, labels, Tab and Escape, initial cancel focus and focus return passed. Loss is −8.18 EUR and requires a reason; accepted loss remains negative. Pending stays until explicit response selection, hides result and acceptance; unavailable state is shown. Runtime/console errors zero. At 320 px page table columns retain readable evidence words without overriding shared controls.

External screenshots (not committed): 1440-s12, 1440-s12-strata, 1440-s13, 1440-s14, 1440-s15, 1440-s16, 1440-s12-przyjeta, 320-s12; extra happy-path captures retained. Build and earlier evidence are preserved in the existing preview folder. Review engine SHA256 unchanged; no edits in protected application/shared source/story folders, and their diff against origin/main equals the starting branch. Privacy scan zero; added text and commit messages contain no private-process references. Product specification status remains unchanged: this is a synthetic prototype, not implemented E01 backend.

Existing Vite large-bundle warning remains. Production integration, Storybook suite and cross-browser checks were not run. Publication evidence is recorded in the run log. No PR or base merge.

- External preview and screenshots were kept outside the repository; client-side availability was not verified.
