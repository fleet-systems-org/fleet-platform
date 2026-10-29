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
- N7a, R18.1/R18.2: three entry cards with exactly one open step, completed answer/neutral Gotowe badge/Zmień action, muted waiting steps and the specified next actions. Collapsed controls stay mounted and hidden, preserving customer queries, dates, freight and wash while editing an earlier step. The four-part progress bar is informational: completed checks and following lines use the action token, the current numbered circle has a pale outline, future circles are outlined/muted; labels use the 12 px role. Route/quote/details/acceptance show step 4, confirmed by the owner on 2026-10-29 ("yes").
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

1. **Resolved 2026-10-29:** the owner answered "yes"; step 4 “Wycena” is current on s11, s12, s13 and s16.
2. Navigation currently has no icons, as requested. Should it remain text-only in the final product?

Next: review Stage 1d; only the navigation-icon question remains open before authorizing Stage 2. The separate customer-directory specification questions from Stage 1c remain open.

Publication: implementation `721d2d3`; baseline merges `2bd966c` and `82d9245`. Normal push verified. Preview server HTTP 200 and index SHA-256 match verified; preview index cloud upload confirmed, second-device download unverified. Full browser and publication results are recorded in the Stage 1d run log.

## Stage 1e. Owner review fixes

Status: **done, waiting for owner review** (2026-10-29). Stage 2 remains not started.

### Defect and cause

Direct screen-picker entry to s13, and entry after a simulation reset, showed empty vehicle/place placeholders beside the K2 fixture. All route panels read the live entry state; only s12 had the quotation summary. The value-details screen also mixed evidence with working notes in paragraphs.

### Changes

- N7b/R19.1: distinct live entry route for s09/s10 and viewed K2 snapshot for s11/s12/s13/s16. The snapshot always contains Auto 01, A/PL at 11:00, B/DE at 12:00, C/CZ at 13:00, 20 km approach and 80 km loaded. Customer selections are captured when the supported entry advances; editing a later entry cannot alter the viewed quote. Direct screen selection and reset open the fixed K2 example, including its 60.00 EUR freight and 21.82 EUR result.
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

All data, country allocation, source dates and vehicle categories are fictional. No live lookup, persisted quote, customer directory or financial-policy change is introduced. The exact table exposes the fixture's evidence inline; this is not implementation of the production evidence API. Production E01 specifications remain approved and unimplemented. Stage 2 and the navigation-icon/customer-directory questions remain open.

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

Publication: implementation `7573e91`, normal push. Explicit preview index HTTP 200 and SHA-256 match verified; iCloud upload of preview/evidence/assets confirmed (66/66), CloudDocs caught-up. MacBook download/opening unverified. No PR or base-branch merge.

## Stage 1i. Vehicle tiles with driver and tractor (N7f) and map edge

Status: **done, waiting for owner review** (2026-10-29). Stage 2 remains not started.

- s09 step 1 now shows the three synthetic driver/tractor pairs as native radio tiles: three columns from 48rem, one below. Driver name uses 16 px/600; registration uses tabular meta; availability uses 14 px. Selected outline adds no layout shift; keyboard focus is visible. The group and proposal disclaimer identify the driver detail as outside the approved E01 specification.
- Existing Auto 01/02/03 IDs map to the synthetic drivers/tractors. Completed step 1 shows the chosen name and registration. Calculations and the K2 snapshot are unchanged.
- s01 generator clipping extends to -40..80 longitude and 20..85 latitude; projection, routes and city coordinates are unchanged. Extended geometry also needs SVG overflow visible inside the clipped map panel: otherwise the SVG viewport itself still cuts Scandinavia. Generated source is 116,171 bytes (limit 120 KB).
- Passed: package typecheck/build; repository typecheck/lint/198 tests; explicit prototype ESLint; tokens 0; mechanical detector 0. Engine byte comparison, routes/cities comparison, protected source diff against main and private-name scan passed. Browser at actual 1440/320 CSS pixels passed pointer selection, arrows/space, visible focus, stable tile dimensions, collapsed answer and happy path to 21.82 EUR. Map captures at 1440/1920 visually verified without artificial land edge.
- Five requested captures and built preview published outside Git; prior evidence preserved. No PR opened and no merge into main. Production coverage/integration/Storybook/cross-browser checks were not run for this prototype-only change.

### Open question for the owner

Should Auto 01 in the right-hand route panel, s12 quotation heading, s16 confirmation and s07 vehicle trips also become driver + tractor registration? These locations deliberately remain unchanged in Stage 1i. Driver identity still requires a separate specification decision before production implementation.

Next: owner review of Stage 1i and the label question; Stage 2 needs separate authorization.
