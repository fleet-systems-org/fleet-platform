# Design system decisions

Status: active. Owner: product owner. Explains every source code cited in the Storybook documentation, `packages/ui/src/styles.css` and `packages/ui/POSTEP.md`. One line per code: what was decided and why. "Proposal" means the rule is used but still open to the owner's change; everything else was decided by the owner on 2026-10-29 unless stated.

Code families:

- `R##.#` (with a decimal): a feature observed on a reference screen and what we take from it or do instead. References are described by what they show, not by product.
- `R##` (no decimal): a product rule from [product-brief.md](product-brief.md).
- `A##`, `B#`, `G1`: antireferences, looks the product must avoid. `K1`: a conflict between references and its resolution.
- `N#x`: owner answers on typography, colour, shape and loss. `P#` and `Z#`: proposals derived from references. `T#`: token decisions.
- `Q#`: owner answers before the design system was built (theme, scope, error colour, icons, motion). `Q3-1`: the owner's density decision, an earlier and separate question.
- `EV-#`, `WKD-#`, `DRF-#`: rules of the approved [foundations](2026-10-26-e01-foundations.md) and [trip entry and quotation](2026-10-26-e01-trip-entry-and-quotation.md) specifications.
- "Audit finding N": a finding of the screen audit made before the design system existed.

## Reference features

- **R02.3** — Results change as soon as a filter changes; no hidden filter panel and no manual refresh button (proposal), because the answer "which truck is free, where" must be the first thing visible.
- **R04.3** — An entered value is never cleared silently; a field shows that it changed and asks before overwriting (proposal), because a vanished approach distance changes the trip result.
- **R06.1** — A truck is a row and a trip is a bar with route and times on a panel surface, with a "now" line, because fleet plan and availability belong on one screen.
- **R06.4** — The whole fleet fits on one screen without scrolling, with readable text and one emphasised thing, because the fleet is small and the dispatcher has two monitors.
- **R07.1** — Cost, price and result sit together in one result bar with small muted labels above values, because the dispatcher compares cost and price before accepting.
- **R07.4** — No pop-ups or welcome layers over the result; help lives in the content, because quoting happens during a phone call.
- **R08.1** — Plan, actual and difference in adjacent right-aligned columns with thin row lines, because a trip settlement is plan against actual per component.
- **R08.4** — Details of a selected row open in a side panel without leaving the list (proposal), so the dispatcher keeps the list in view.
- **R08.5** — Icons only where they carry meaning; no emoji and no decorative brand colour, because this is an all-day work tool.
- **R11.1** — Every number carries a small muted source label and, when estimated, the word "Szacunek", because every number must show its certainty and source (R02).
- **R11.2** — Missing data is shown as a dash with "brak: …", never as zero (proposal), because a missing number must not lower or raise a result.
- **R14.1** — Typeface IBM Plex Sans and a 12/14/16/20 px scale, bold table headers and horizontal lines only, taken from a reference data table; its 48 px rows and left-aligned numbers are not taken.
- **R15.1** — A status is a word and a colour together, never colour alone, with amounts right-aligned in tabular figures; the reference's pills and large radii are not taken.
- **R16.1** — An empty state is one sentence with the reason and at most one action, without illustration, so an empty list says what to do next.
- **R17.1** — A spending breakdown with the total on top and every category as a row with its amount, a share bar and its percentage, taken for the trip cost breakdown so the dispatcher sees at once what makes up the cost; its share ring, emoji and one colour per category are not taken.
- **R18.1** — A multi-step form where completed steps collapse to one line with their answer and an edit link, one step is open and later steps wait below, taken so the dispatcher sees what is done without scrolling past it.
- **R18.2** — A step bar on one line: a completed step shows a check, the current step is filled, later steps are outlined and muted, and the line after a completed step takes the action colour, so progress reads without counting.
- **R19.1** — A trip summary where each stop is a block with its label on the left, the time first, then date and place, then details as label–value pairs, taken because a trip is read as stops and times.

## Product rules (brief)

- **R01** — A measurement is not an accusation: loss marks a trip result, never a person, so no badge or colour judges a driver or dispatcher.
- **R02** — Every number shows whether it is certain or estimated, with its source; the design system marks estimates with a badge and keeps the source next to the value.
- **R09** — Every quote needs an explicit wash answer ("Bez mycia" or "Nasze mycie" with amount and date), so the radio group has no default and a missing answer stays missing.
- **R11** — Kilometres are published and stored to three decimals; on screen they are whole numbers rounded half-up from the published value, with the exact value only in the value details (D65). FIN-2 arithmetic is unchanged.
- **R12** — A loss-making quote is accepted only with a short reason, so the loss reason field and its error exist.
- **R13** — A quote containing a weekend needs the dispatcher's choice of three cases, so the weekend question is a required radio group without a default.

## Antireferences and conflicts

- **A01** — Avoid the old office-program look: everything at once, small grey text on grey, a column of many buttons, several colours for the active state, because it makes the one important thing hard to find.
- **B2** — No tutorials, wizards or dialogs that open by themselves during work, because each one slows a quote made on the phone.
- **B3** — No number without its certainty and source, because of R02.
- **G1** — Avoid the generic generated look: unexplained action colour, the library's default blue focus, system font stack, card in card, off-grid spacing, gradients, blur, emoji and rows of big number tiles.
- **K1** — Red appears only on a trip result, never next to a person; resolved by N5a.

## Owner answers on look

- **N2a** — IBM Plex Sans (open font licence) on the 12/14/16/20 scale instead of Arial or the system stack, because the screens are mostly amounts and kilometres and need tabular figures.
- **N2b** — Body text uses IBM Plex Sans weight 500 instead of 400, because the owner found 400 too thin on work screens (owner decision 2026-10-29).
- **N3a** — The existing green `#205b49` stays the action colour, because it already exists and differs from the dispatcher's other tools.
- **N4b** — Radius 4 px for controls and badges, 8 px for panels, no pills, because square-ish shapes suit a dense work tool and avoid G1.
- **N5a** — Loss is a red badge with the word "Strata" and a minus sign, only on a trip result, because a loss must be visible at once but never judge a person (R01).
- **N6a** — The quote screen shows the cost breakdown as a table (cost, source, amount, share of cost with a share bar in the action colour, total row at 100 %) beside one summary panel with the trip result, planned availability, freight, covered cost and the accept action, following R07.1 and R17.1. There are no result tiles, so G1 and P6 stay unchanged (owner decision 2026-10-29).
- **N7a** — The quote entry form has the steps vehicle, places and times, freight and wash, and quote: one step is open, completed steps collapse to one line with "Zmień", loading and unloading sit side by side, and a step bar runs to the quote (R18.1, R18.2) (owner decision 2026-10-29).
- **N7b** — The route is shown as stop blocks (start, loading, unloading), each with time, date (Warsaw), place with country and details: customer, kilometres, and whether a leg is the approach or loaded, said in words (R19.1). It replaces the A → B → C schematic on the entry, route and quote screens (owner decision 2026-10-29).
- **N7c** — The entry, route and quote screens share one frame: centred content, a 360 px panel on the right and the same step bar, so moving between them changes the content, not the layout (owner decision 2026-10-29).
- **N7d** — Navigation lives in a left side panel on every screen, never in the top bar; entries of later phases appear muted under "Później" until they exist (owner decision 2026-10-29).

## Proposals

- **P1** — The loading-place field orders trucks by distance from where each truck becomes free, not its current position (proposal).
- **P2** — Every number has a source label in muted small text ("z GPS", "wpisane", "z faktury") (proposal).
- **P3** — Missing data is a dash with "brak: …", never zero (proposal).
- **P4** — A certain number gets no badge; an estimated one gets "Szacunek" (proposal).
- **P5** — A truck row shows where and when it becomes free and the driver's remaining drive time (proposal).
- **P6** — No KPI tiles with big numbers on dispatcher work screens; result tiles only in a later monthly summary, each with cost components (proposal).
- **P7** — Tables have a bold header and horizontal lines only, no vertical lines (proposal).
- **P8** — Numbers are right-aligned with tabular figures (proposal).
- **P9** — An empty state is one sentence of reason and one action, e.g. "show 7 days" (proposal).
- **Z1** — Results update as soon as a filter changes; no manual refresh (proposal; see R02.3).
- **Z2** — A changed or reset value is shown in place, e.g. "zmienione, było 120", and overwriting asks first (proposal; see R04.3).
- **Z6** — Icons appear only where they carry meaning, never as decoration before every label (proposal; see R08.5).

## Token decisions

- **T1** — Input borders use `border-input` (`#86948f`, 3.16 : 1 on panel), because the divider tone is below the 3 : 1 needed for interface components (WCAG 1.4.11).
- **T2** — Spacing on a 4 px grid (4, 8, 12, 16, 24, 32) with named relations (tight, group, panel, between, section), because off-grid spacing gave an uneven rhythm.
- **T3** — Table rows are 36 px; a future timeline row is 48 px for two lines, because dense tables let the whole fleet fit on one screen (Q3-1).
- **T4** — Focus is a 2 px solid outline in the action colour with a 2 px offset, not the library default, because focus must be visible (WCAG 2.4.7) and not generic (G1).
- **T5** — One shadow token, `shadow-overlay`: 0 2px 6px in the ink colour at 30 % (IBM Carbon's overlay shadow with ink instead of black), only on dialog, alert dialog, dropdown menu, popover and the Select list; Tailwind's default shadows are removed from the theme. Approved by the owner on 2026-10-29, value included.
- **T6** — A modal dialog dims the page with `bg-scrim`, the ink colour at 50 % (IBM Carbon's overlay colour with ink instead of black), so the inert page reads as background.
- **T7** — Overlays only fade in, over `motion-overlay` (110 ms, Q5b) with the productive easing; no zoom or slide, closing is instant, and nothing animates under reduced motion. Tailwind's default animations are removed from the theme.
- **T8** — Tooltips are dark labels (`tooltip-bg` ink, `tooltip-text` white, 14.71 : 1) without shadow or arrow, as the shadcn default colours, so they differ from a popover at a glance; shown at once on hover and focus.
- **T9** — A skeleton placeholder is a still block in the divider tone, without pulse, because nothing moves for decoration (Q5b); loading is said in words by `LoadingMessage`.

## Owner answers before building

- **Q1** — Light theme only, no theme switcher, because no dark theme was requested or checked for contrast.
- **Q2** — Fleet availability is the paginated table from the specification; a timeline view goes to "What is missing", so no timeline tokens are written.
- **Q2a** — Where the actions next to a truck go stays open on "What is missing".
- **Q3** — Errors have their own colour token `#da1e28`, distinct from loss, and always come with an icon and words, so an error never relies on colour.
- **Q3-1** — Dense layout: the whole fleet without scrolling, readable text and one emphasised thing per screen; this sets 36 px rows and 12 px panel padding.
- **Q4** — Only small shared pieces (decimal field, zoned date-time field, place picker, value with source, small badges) go to `packages/ui`; screens are stories composed from real components.
- **Q5a** — Icons from one set; first Lucide, superseded on 2026-10-29 by Tabler because Lucide is the library's default look.
- **Q5b** — Motion: 0 ms for state changes in place, 110 ms for overlays appearing, nothing under reduced motion, so the interface never waits on animation.
- **Q5c** — No toast, avatar, tabs, switch or checkbox, because the planned screens do not need them; a need goes to "What is missing".
- **Q5d** — The character words of the product are shown as proposals, not rules.
- **Q5e** — Proposals P1–P9 are shown as proposals until the owner decides each one.

## Specification rules

- **FIN-1** — Money and fuel travel as decimal strings, never as JavaScript numbers; the Polish comma is normalized as text; negative zero shows as zero.
- **FIN-2** — Components of a calculation are never rounded; only published values are, so a decimal field never rounds what was typed.
- **FIN-3** — Published scales: money 2, unit prices and rates 6, kilometres and litres 3; ties half-up, negative ties away from zero.
- **FIN-4** — Inputs are bounded in magnitude and scale before writes; out-of-range values are rejected, never truncated. `DecimalField` takes its scale from the kind of value as in FIN-3: unit prices, FX rates and consumption 6; kilometres and litres 3. An amount in any currency takes the decimal places `Intl.NumberFormat` gives that currency (`maximumFractionDigits`: PLN, EUR and CZK 2, HUF 0); more decimals are rejected with a message, never rounded (owner decision 2026-10-29, replacing the same day's "amounts in another source currency keep their scale").
- **EV-1** — A value has phase, state (known, missing, conflicting) and certainty; the badges show certainty and missing state as words.
- **EV-4** — Every figure is shown with `ValueWithSource`; whole kilometres on screen and the exact published scale-3 value only in accessible details are specified in the approved foundations (D65). EUR amounts retain 2 decimals; FIN-2 and FIN-3 are unchanged.
- **SRC-1** — Fuel price per country: own cards first, then the weekly public bulletin as an estimate, then older own-card prices as estimates, then a manual price; otherwise missing ("no fuel price for <country>").
- **ROUTE-1** — Routes and the country split come from one map provider without fallback; when it fails, the route is missing and the dispatcher may enter the country split by hand. Kilometres from the map provider's route are estimated (`certainty: estimated`), because the route is planned, not driven (owner decision 2026-10-29).
- **TIME-1** — Times are exact instants with the place's IANA zone; a nonexistent local time is rejected and an ambiguous one needs an offset choice. `ZonedDateTimeField` (owner decisions 2026-10-29): the date is typed as "DD.MM.RRRR" and the time as "GG:MM" (24 hours) in text boxes, checked when the dispatcher leaves the field as in `DecimalField`, with no calendar and no new libraries (a calendar may come later); a one-digit day, month or hour is accepted ("2.11.2026", "9:30"), a two-digit year is not, and typed text is never reformatted; because the browser's date and time inputs follow the browser's language; the zone comes from the place and cannot be changed in the field, named in words, with the offset shown only when the clock goes back; the two occurrences are "przed cofnięciem zegara" and "po cofnięciu zegara" with the UTC offset; a skipped time is rejected, never moved; the conversion moves from `packages/ui` to `packages/core` when the server validates TIME-1 with the same rule.
- **PLACE-2, PLACE-3** — `PlacePicker` (owner decisions 2026-10-29): the page searches and debounces and the picker only shows `options` and `status`, saved places first and while nothing is typed; results are named "Zapisane miejsce", "Adres" or "Tylko miasto"; same-named towns are both listed with region and a neutral "Do potwierdzenia" badge, and choosing one does not confirm the town; another spelling is shown as "wpisano: …" and choosing it saves no alias; when the map provider fails, saved places stay selectable, with no manual coordinates; "Dodaj miejsce…" is a text button under the box, shown only with `places.write`, its flow still open (L09); the search time limit and what the dispatcher sees after it (L08) must be decided before screens are built.
- **WKD-1** — The weekend rule: one required case for every weekend in the quote, no default, "Zapytaj o weekend" when missing.
- **DRF-1** — Several drafts for one truck are compared in a table beside them, which is a separate pattern, not `DataTable`.

## Screen audit findings

- **Audit finding 3** — The system font stack made numbers depend on the operating system; a chosen typeface with tabular figures fixes it (N2a).
- **Audit finding 4** — A card inside a card flattened the hierarchy; sections inside a panel use a heading and a line instead.
- **Audit finding 6** — Seven font sizes differing by 1 px; replaced by named text roles on one scale.
- **Audit finding 7** — Spacing off the 4 px grid; replaced by the spacing tokens (T2).
- **Audit finding 8** — The form scrolled sideways at 320 px; layouts collapse to one column (WCAG 1.4.10).
- **Audit finding 10** — Errors were not tied to their field and did not say what to do; `Field` wires errors through `aria-describedby` and every message gives the next step.
- **Audit finding 14** — Disabled buttons gave no reason; prefer an enabled action that explains what is missing, otherwise show the reason in visible text.
- **Audit finding 15** — Lines of 77–101 characters; running text is limited to about 65 characters (`max-w-measure`).
