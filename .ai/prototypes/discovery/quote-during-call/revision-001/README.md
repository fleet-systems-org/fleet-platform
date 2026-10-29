# Discovery prototype: dispatcher prices an offer during the call

- Revision: 001 (2026-10-29), no previous revision.
- Brief: [.ai/specs/product-brief.md](../../../../specs/product-brief.md), at `origin/main` `bdc3be6`.
- Specification checked: [E01 trip entry and quotation](../../../../specs/2026-10-26-e01-trip-entry-and-quotation.md) (approved by the owner 2026-10-27, not implemented), with [E01 foundations](../../../../specs/2026-10-26-e01-foundations.md). Story: #21 (E01-S01).
- Panel report: none supplied. The brief records no synthetic walkthrough ("Hypotheses to test: None"), so this revision has no `[SYNTHETIC]` input.
- Simulation boundary confirmed by the owner in the T3 thread on 2026-10-29 ("Zatwierdzam"). That approves the simulation and the assumptions below. It does not make them true.

This is a neutral, grey wireframe with fictitious in-memory data. It tests sequence, labels, choices and recovery paths. It is not research evidence, it does not test the D21 check (a real offer during a call, in the running application) and it does not satisfy the Definition of Ready.

## How to open and reset

Open `index.html` directly in a browser (`file://`, works offline, no server). Use **Resetuj symulację** in the header to return to the start. A page reload also resets, because nothing is stored. The **Stany testowe** panel switches edge states on and off. It is a reviewer aid, not part of the product.

## Flow

- Actor: the granulate dispatcher, already signed in (sign-in is outside this prototype).
- Start: the truck list (`#zestawy`) with three fictitious trucks: one free in Miasto A, one with no start entry, one free in Miasto D.
- Success: a quote is accepted, its inputs are frozen, the truck shows its new free place and time (end of unloading), and the approach after unloading is open, waiting for the next trip.
- Included: E01 UI/UX steps 1–9 (truck, start entry, places, exact times, freight with currency, mandatory wash answer, route and country split, weekend case, quote with sources and missing inputs, acceptance with a loss reason), DRF-1 draft comparison and Phase 3 similar trips.
- Excluded and labelled "Poza tą makietą" with a way back: route edit with a reason (BND-4), correction and cancellation. Not represented at all: sign-in and invitations, owner policy configuration, the fleet page and kilometre check (Phase 2), comparing one offer across trucks (later per D54), chain verdict (D22).

## Preserved rules and decisions

All of these are owner-owned, and the brief records the path to change each one ("owner approves a superseding row"). The prototype does not change any of them.

| Id | Status | How the prototype shows it |
|---|---|---|
| R02 / E6 | active | Every cost and revenue row carries a Pewne / Szacunek / Brak danych tag and its source |
| R05 / D16 | active | The trip starts at the previous unloading. The whole approach is in the quote (C → B on the second trip) |
| R07 / D18 | active | Loading and unloading end are required with date and time. Free time = end of unloading |
| R08 / D23 | active | After acceptance the approach is "otwarty, czeka na następny kurs" |
| R09 / D31, D63 | active | Wash has no default. Our wash needs an amount and a date, time is optional. No client-paid option |
| R11 | active | Exact fractions, one rounding at publication, half-up. Kilometres/litres 3 decimals, money 2, unit ratios 6 |
| R12 | active | A negative result needs a short reason. Accepted quotes are frozen and other drafts become stale |
| R13 / R17 / D42 / D43 | active | Weekend overlap requires a choice ("Zapytaj o weekend"). Rest abroad charges each touched weekend day in full |
| R14 / D46 | active | Vehicle-day and driver-day rates from the configured month 2026-09 |
| D22 | active | Single-trip result and the next free place/time only. No verdict, no chain result |
| D26 / D28 / D35 | active | Same loading → unloading town pair in the same direction. Invoice rows are estimates with no result. Entered trips start empty |
| D50 / D61 | active | Only a missing source value is typed (manual fuel price, labelled estimate, valid 14 days) |
| D54 / DRF-1 | active | Drafts from the same predecessor are compared side by side, sortable, with no recommendation |
| D55 | active | Freight in any currency converted to EUR. Without freight the costs show and the result does not |
| D64 | active | The dispatcher enters the start of a truck without trips |
| N02–N04 | active | No driver input, no import, no judgement of the dispatcher |

## Calculation check against the specification examples

| Case | Spec | Prototype |
|---|---|---|
| 20 + 80 km, 2 h, no wash | 38.18 / 21.82 | 38,18 / 21,82 |
| Same with our wash 5.00 | 43.18 / 16.82 | 43,18 / 16,82 |
| Freight 30.00 | −8.18, reason | −8,18, reason required |

Beyond the spec: for a 164 h trip over one weekend with rest abroad, a hand calculation gives vehicle 492.00, labour 232.00 + 2 × 24.00, fuel/toll/AdBlue 40.24, so a result of 87.76 on 900.00. The prototype shows 87,76. PLN freight 1 275.00 at the synthetic rate 4.250000 gives 300.00 EUR, and the result 223.97 matches.

## Assumptions

- `[ASSUMPTION] A1` Dates are typed as `DD.MM.RRRR GG:MM` text. In this Chromium build the native `datetime-local` exposed unnamed English 12-hour sub-fields, so it was replaced. Check: which shared date-time widget production uses (not specified in the foundations).
- `[ASSUMPTION] A2` Times are naive Europe/Warsaw wall-clock times, so DST is not modelled. Check: TIME-1 tests in the implementation.
- `[ASSUMPTION] A3` "Zachowaj jako wariant i wyceń inny" copies the previous draft's inputs except freight. Check: the owner should decide whether a new draft starts blank or as a copy. The spec is silent.
- `[ASSUMPTION] A4` Result per day uses the whole trip interval (previous unloading → unloading end) in 24 h days. Result per km uses approach + loaded km. Check: DRF-1 does not define either denominator.
- `[ASSUMPTION] A5` Route distances, consumption, prices and rates are fixed fictitious fixtures (all PL, one country). No country split is simulated.
- `[ASSUMPTION] A6` An entered trip appears in the history with its unloading date, plan result and approach as "puste km". Check: the spec does not name the date shown.
- `[ASSUMPTION] A7` The fixture covers every monthly category, so the "Nie uwzględniono" state is not shown.
- `[ASSUMPTION] A8` A source outage applies to one quote attempt, so "Spróbuj ponownie" recovers deterministically.

## Specification gaps found (for #21 follow-up)

1. DRF-1: result per day and per km have no defined denominator (A4) and no R11 precision class. The prototype shows 6 decimals as unit ratios.
2. DRF-1: whether a new draft copies the open draft (A3).
3. Wash date: no rule on whether it must fall within the trip interval.
4. Freight: zero or negative freight is not addressed. The prototype rejects it.
5. History: row order and row limit are not specified. The prototype sorts newest first, invoices before entered trips.
6. Date-time entry widget is not among the shared components (A1).

## Screen and state map

| Screen | Action | Next state | Rules |
|---|---|---|---|
| `#zestawy` | Wyceń kurs / Wpisz start | `#kurs` or `#start` | D24, D64 |
| `#start` | Zapisz start | `#kurs`, truck free at start | D64, A1 |
| `#kurs` | Dalej: trasa | errors with summary, or `#trasa` | R07, R09, D63 |
| `#trasa` | Wyceń (600 ms "Wyceniam…") | `#wycena` | R05, R13 |
| `#wycena` | edit any field | quote stale, accept disabled, Przelicz | DRF-1 |
| `#wycena` | missing freight / weekend / fuel | incomplete, list, manual fuel form | D55, R13, D50 |
| `#wycena` | source outage | inputs kept, Spróbuj ponownie | SRC-7, A8 |
| `#wycena` | variant | `#kurs` with a copied draft, comparison | D54, A3 |
| `#wycena` | Przyjmij (loss needs reason) | `#przyjeto`, other drafts stale | R12 |
| `#przyjeto` | next trip / back to trucks | truck at unloading place | R08 |
| `#poza` | back link | previous screen | — |
| `#brak` | unknown hash or missing step | link to `#zestawy` | — |

## Verification

Static review passed. Everything is local and inline: no URLs, `fetch`, storage, cookies, `innerHTML`, imports or form actions. User text goes into text nodes, and `node --check` passes on the script. There are semantic headings, label-associated fields, `aria-invalid` and error text, a status live region and a visible 3 px focus outline.

Browser walk: `agent-browser` 0.35.2 (repository descriptor `.ai/browsers/agent-browser.md`), isolated session `qa-quote-during-call-r001`, `file://` URL. The session was closed at the end.

| Check | Result | Evidence |
|---|---|---|
| Entry, truck list | pass | 01 |
| Empty submit → 5 errors, wash answer required | pass | 02 |
| Load before free time, reversed times | pass | — |
| Our wash without amount/date, bad optional time | pass | 03 |
| Route with whole approach, no weekend | pass | 04 |
| Complete quote 38,18 / 21,82, free place, invoices | pass | 05, 26 |
| Variant with wash 16,82, comparison table | pass | 06 |
| Edit after quote → stale, Przelicz clears it | pass | 07 |
| Loss −8,18 → reason required, then accepted | pass | 08, 27 |
| Accepted screen, open approach, browser back/forward | pass | 09 |
| Weekend question, incomplete, rest abroad 87,76 | pass | 10–12 |
| Entered trip shown in history on next quote | pass | 11 |
| Start entry with validation (31.11 rejected) | pass | 13 |
| Missing freight + missing fuel, no-history pair | pass | 14 |
| Manual fuel price error then fix, PLN freight | pass | 15, 16 |
| Source outage and retry | pass | 17 |
| History unavailable / unmatched | pass | 18, 19 |
| Out-of-prototype page and back | pass | 20 |
| Unknown fragment recovery | pass | 21 |
| Reset, blocked step after reset, fresh deep link | pass | 22 |
| Keyboard Tab/Enter, heading focus, focus outline | pass | 23 |
| 390 px viewport, no page-level horizontal scroll | pass | 24, 25 |

Fixed during the walk and rechecked: native date-time fields (A1), Polish plural "pól", the missing C/E approach fixtures, the manual fuel error id, the freight source tag, and the loss-reason field showing for positive results (`[hidden]` overridden by `.field`, rechecked in 26–27). Screenshots 01–15 predate the last three fixes. The paths those fixes affect were walked again in 16–27.

Not checked: screen-reader announcement wording (only the live-region text was asserted), real touch input and browsers other than Chromium.
