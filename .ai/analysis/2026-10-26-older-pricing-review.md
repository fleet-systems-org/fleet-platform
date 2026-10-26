# Older trip pricing review

- Date: 2026-10-26
- Status: analysis complete; no calculation implementation or port approved here.
- Scope: #27, supporting E01 and its future whole-epic specification with #22.
- Authority: [product brief](../specs/product-brief.md), especially R02–R08 and D07, D10, D16–D18, D22–D24, D28–D29.
- Evidence: read-only findings and synthetic execution results recorded on 2026-10-23, reconsidered against subsequent owner decisions. The earlier audit reported 18 quotes on each of two source versions, eight chain comparisons and 13 boundary assertions. Those executions were not rerun for this documentation change. Examples below are independently recalculated illustrations, not new executions of the older module. No source code or operational records are copied.

## Inputs

The older quote accepts loading and unloading places, optional coordinates, a vehicle reference, optional explicit approach kilometres (including zero), a next destination, loading/unloading times, freight in EUR, wash responsibility and amount, weekend handling and a per-tonne payment flag. An optional calculation date defaults to the day of calculation; consumption overrides may be supplied per country.

External inputs are route distances and country splits, vehicle position and tank state, consumption loaded/empty by country, fuel prices, tolls, AdBlue cost, exchange rate, time assumptions, fixed daily costs, overhead percentage and target markups. No operational configuration values are reproduced here.

Place lookup uses supplied coordinates, known places, position history, then geocoding. Loaded distance prefers the median of at least two measured journeys, then a route cache/planner and fallback routing. Country distances use averages, which need not sum to the median total. Approach uses explicit kilometres, otherwise current vehicle position, otherwise zero with a warning. The next destination can be text; an order identifier is not resolved to its loading place.

## Outputs

The response includes loaded and allocated empty distances, country distance splits, allocated fuel litres, fuel/toll/AdBlue/wash costs, duration and fixed costs, revenue, profit, revenue per kilometre, cash/full/target thresholds, a suggested verdict, source information and warnings. A physical refuelling plan separately covers full route segments, tank reserve, range and suggested purchases. Allocated cost litres and physical purchase litres are different quantities and must not be added together.

## Rules and comparison with the current brief

1. **Distance allocation (R05, D16).** Older allocated distance is loaded + half approach + half departure. Matching adjacent legs reconcile internally, but first/last legs lose half unless handled elsewhere. This is obsolete for the product: each trip carries its whole approach from the previous unloading to its own unloading, with no halves and a gap/overlap check. A future trip must use its predecessor's planned unloading, not today's vehicle position (D24).
2. **Unknown next move (R08, D23).** Older missing, unresolved or failed next-destination routing becomes zero with a warning. The product leaves kilometres after the last unloading as an open approach for the next trip; they do not change the last trip's quote. Explicit zero and unknown must remain distinguishable. Terminal vehicles or period boundaries still need specification treatment.
3. **Route composition (R05, R07).** Explicit approach distance loses its country split; the departure half is assigned to the unloading country. The calling flow does not route through declared wash/refuelling stops. The product must reconcile all kilometres and preserve relevant country evidence; wash detour treatment needs specification. Median totals versus average country splits can also diverge and must not silently price different distances.
4. **Consumption and fuel (R02, R03, R05).** Older litres are country kilometres × loaded/empty consumption / 100. Consumption overrides replace only supplied countries. Fuel already available above reserve is costed at the domestic price; remaining allocated litres use the cheapest permitted country price. Physical range uses full segments. Unknown tank state uses half capacity with unknown sufficiency. These are observed estimate policies, not approved product defaults; disclose source/freshness and settle fallback semantics in the specification. Historical person-based estimates remain subject to Q04.
5. **Tolls and AdBlue (R03, R05, R07).** Older toll cost is country kilometres × local toll rate / exchange rate; planner tolls are a cross-check, not a second charge. AdBlue uses allocated fuel litres × configured rate / exchange rate. Preserve the no-double-charge distinction, but use exact decimals and trip-date prices with estimate labels for future prices.
6. **Wash (R06, D17).** An own wash adds cost; a client-paid wash adds revenue. Those meanings remain. The older warning-only missing answer is obsolete: none/ours/client-paid must be answered before calculating, with an amount for a paid wash. The wrapper's conversion of any wash into an own cost must not be ported. A wash has its own planned date and time (R07).
7. **Time and fixed costs (R07, D18).** Older duration uses full approach plus loaded driving, breaks/rest and loading/unloading, excluding wash/refuelling time and departure. It rounds duration up to half-days with a configured minimum; supplied dates can increase it, weekends affect labour while equipment costs continue. Exact loading and unloading dates/times are now required before a quote; availability is the end of unloading. Calculation-day price defaults and model-only dates are obsolete as product policy. Time zones, waiting and fixed-cost allocation still require specification and owner confirmation where financial policy is involved.
8. **Revenue and thresholds (R03, D22).** Older revenue is freight + client-paid wash; cost C is variable + fixed costs; displayed profit is revenue − C, before overhead G = revenue × overhead percentage. Cash threshold is variable + labour; full threshold C + G; targets multiply C + G by a markup. The label “margin” actually means markup. Thresholds computed from an existing offer are not a solved minimum new price. Confirm intended overhead, target and verdict semantics before porting.
9. **Verdict (R05–R08, D22).** Older verdicts mean accept, negotiate, chain link or reject according to thresholds on this single quote. “Chain link” checks neither neighbour nor a combined chain result. The first product scope shows a single-trip result and next availability; chain judgement is deferred. Do not present the older label as evidence that a chain pays.
10. **Rounding (R03).** Older arithmetic uses binary floats, independently rounded components/totals (money two decimals, distances/litres usually one, per-km rates three, thresholds whole EUR), with verdicts compared before display rounding. None of these precisions or tie-breaking choices is approved for the port. Exact decimal storage/transport is required; owner-approved precision and rounding remain open.
11. **Plan versus actual (R05, D10).** Older closing uses full approach plus loaded distance against a plan with halves; the difference can be allocation rather than execution. Future comparisons must use the same whole-approach boundary. No full integration behaviour or neighbour recalculation was verified by this review.

## Worked examples — synthetic only

All places are abstract A, B and C, not actual routes. Monetary inputs are synthetic EUR decimal strings. For illustration only: fuel "1.00"/litre, loaded consumption "30.00" l/100 km, empty "20.00", toll "0.10"/km, fixed cost "100.00"/trip, zero AdBlue and no wash. These simplify comparison and do not approve cost or rounding policy.

With loaded L, full approach I and full departure O, the older cost is `0.40 × L + 0.15 × (I + O) + 100`. Applying the current whole-approach boundary with the same illustrative cost assumptions gives `0.40 × L + 0.30 × I + 100`.

- **Three trips:** loaded distances 100, 120, 80 km, approaches 0, 40, 60 km, departures 40, 60, 0 km. Older costs: "146.00", "163.00", "141.00"; current boundary: "140.00", "160.00", "150.00". Both total "450.00", but attribution differs. Current distances 100 + 160 + 140 = 400 km reconcile to 300 loaded + 100 empty. Current allocated fuel 30 + 44 + 36 = 110 litres. Summing overlapping older physical fuel plans (38 + 56 + 36 = 130 litres) would double-count connectors.
- **First approach:** two trips with L=100/120, I=100/40, O=40/0. Older costs "161.00" + "154.00" = "315.00". Current costs "170.00" + "160.00" = "330.00". The older model omits 50 km and "15.00" from the first approach. Current kilometres 200 + 160 = 360 reconcile to 220 loaded + 140 empty.
- **Last departure:** L=100/120, I=0/40, O=40/80. Older total "312.00". Current completed-trip total "300.00"; 80 km after the last unloading remains an open approach, not a half-charge to the last trip (R08). A later trip takes it in full; it must not disappear from reconciliation.
- **Missing next load:** L=100, known I=0, next move unknown. Current illustrative cost "140.00" is a valid single-trip boundary, without inventing the next approach. An unknown initial approach is different: the older zero fallback must not imply a complete quote.
- **Detour:** a 40 km direct approach is actually 100 km via planned stops. Missing 60 km understates the whole-approach variable cost by "18.00" at "0.30"/km. Correct country splits still matter when rates differ.
- **Wash and dates:** with base cost "140.00" and freight "200.00", own wash "20.00" gives cost "160.00" and profit "40.00"; client-paid wash "20.00" gives revenue "220.00" and profit "80.00" before overhead. Missing wash answer or loading/unloading date/time blocks calculation. A wash requires its date/time. A future trip uses latest known prices as estimates, not a claim of known future prices.
- **Threshold semantics:** C="140.00", revenue="200.00", overhead 5% gives G="10.00", displayed profit "60.00", full threshold "150.00", 10% target "165.00". Solving the same target for a new price instead gives `154 / 0.945 = 162.962962…`. A policy decision is needed before rounding or calling either value the required price.

## Obsolete audit conclusions

- Compliance with the old half-leg R05 is no longer compliance with current R05; matched chain totals alone are insufficient.
- First/last-edge allocation is no longer awaiting Q16: the first approach is full; the last departure waits for the next trip under R08. Half-edge expected results are historical comparisons only.
- Missing next load no longer makes the last single-trip quote incomplete merely because its departure is unknown; the open approach is tracked separately.
- Wash responsibility is no longer open, and a missing answer cannot remain a warning-only path (R06). Wash type, detours and actual-cost provenance remain separate questions.
- Optional/model dates and calculation-day price defaults are not acceptable product policy (R07).
- A dispatcher prototype session before building is superseded by D29; the specification-derived mockup uses synthetic data, then D21 observes the first built phase.

Float/rounding defects, lost country splits, omitted detours, missing-approach fallbacks, threshold semantics and inconsistent plan/actual boundaries remain relevant findings, not approved behaviours to copy.

## P11 and outstanding decisions

The invoice → unloading → fuel join is **not measured**. Readable/repeating invoice routes do not establish matching coverage or estimate accuracy (A03, A05). D28 allows invoice date and price as an estimate for the same route pair and direction; past results and empty kilometres come only from entered trips. This review makes no new data-access or join claim.

Owner questions: precision, rounding stage and tie-breaking (R03); overhead/target/verdict semantics; time and waiting allocation; treatment of terminal/open approaches at period boundaries; wash detours and actual-cost provenance. Specification questions include timezone, initial truck position, place normalisation, missing-input behaviour and source freshness. No domain implementation is included. The future E01 specification must link this record; no such specification exists yet, so the brief's Next section and #22 provide the handoff link.
