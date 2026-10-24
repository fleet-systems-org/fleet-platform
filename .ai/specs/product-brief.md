# Granulate trip profitability — product brief

- Date: 2026-10-24 (refresh)
- Mode: client (a trading and transport company as the first, internal client; the owner decides), with own-idea checks for a later open-source direction. Owner: the product owner. Pass: full (refresh).
- Publication: this file is the product brief (D27). The client is named only as "a trading and transport company"; people, counterparties, rates, amounts, monthly figures and fleet counts are left out, and evidence is shown as source tags. The raw discovery material is kept privately.
- Evidence basis: one conversation between the owner and the granulate dispatcher (2026-10-23), the only first-hand account from the user; the owner's monthly division summary for September 2026 (aggregates; not independent of the dispatcher's quoting rate); aggregate checks of the company's fuel-system and accounting data (2026-10-22); owner accounts of 2026-10-22, 2026-10-23 and 2026-10-24; owner product decisions (2026-10-18..24); archived owner notes; public benchmarks (2026-10-18, ten products 2026-10-23). No management interview; no accounting evidence of the division loss. Most consequential untested belief: that the dispatcher will price offers in the tool during the call (A01), now the agreed check of the first specification (D21, D25).
- Coverage: 84 claims — 78 sourced (interview 15, data 5, document 54, product 2, benchmark 2), 0 synthetic, 6 assumed; 5 entries on the collection plan
- Synthetic hypotheses outside Coverage: 0
- Definition of Ready signed by: the product owner, 2026-10-24, for the first specification (D19) — scope, expected outcome and checks (D21, D25), single-trip result (D22), open approach (D23), manual entry of every truck's trips (D24), past similar trips in the quote (D26) and their source (D28). Ready for: writing the specification of the first slice; the prototype (D25); the review of the older modules (D10). Not ready for: specifications of the remaining Must items (order open, Q18).

## Decision summary

The owner has decided what the first specification covers: the Release 1.0 table binds, and the first part to specify is pricing an offer together with the truck's next move; the other Must items follow one by one, in an order not yet set (D19, Q18). This closes the question whether the 1.0 table binds (Q01).

The user is the granulate dispatcher. In his own account he answers an offer on the phone with a single rate per kilometre applied to loaded kilometres plus the unpaid approach, and plans each truck's next load around where it unloads (Problems, Key flows). The owner identifies the rate's source as his monthly summary, which shows revenue over all kilometres about equal to the division's cost per kilometre while revenue per loaded kilometre is clearly above it (Problems); the conversation and the summary both come through the owner, so they are not independent.

The first part is bounded by owner rules: a trip runs from the previous unloading to its own unloading and carries its whole approach, every kilometre belongs to one trip (R05), kilometres after the last unloading wait as an open approach until the next trip (R08), the wash question is mandatory (R06) and exact dates are required (R07). A quote shows the result of that one trip and where and when the truck becomes free, beside past similar trips; a verdict for a chain of trips is later (D22, D26). The dispatcher enters every truck's trips by hand, which is how the system knows each last unloading (D24). Per the owner the module has nothing in common with the company's office (document), messenger and warehouse systems, confirmed as no data exchange; accounting invoices are still read later (E4); all company modules are planned in this repository, added one by one (D20).

The belief most likely to change this: whether the dispatcher will use any tool at the moment of the offer. He has not seen a panel, the owner says he must be convinced, and his own remedy for idle trucks is more drivers (A01, A06). The agreed checks test exactly that: first a clickable prototype of the new design on one real offer, before the build (D25); then, with the built part, he prices one real offer during the call, and we observe whether he completes it and what is missing (D21). One observation is a first check, not proof of regular use. Manual entry of every truck's trips adds to his effort (D24, A01).

The owner chose, against the agent's recommendation, to show past similar trips in the quote (D26). A data check found that a route can be read from nearly all invoice notes and many routes repeat, but the join of invoices with unloading, fuel and the approach was not measured (P11). So a similar trip is one with the same loading → unloading pair in the same direction; the invoice history supplies its date and invoiced price, marked as an estimate, while results and empty kilometres come only from trips entered in the tool, which start empty (D28).

Next: write the specification of the first part (D19) from this brief and the older pricing review (D10); prepare the prototype for D25; the management interview (P8) stays open and matters for the monthly summary, which is not in the first part.

## Vision

For the company's management and its granulate dispatcher: one place that shows what was planned for a trip, what happened, and whether the company earned or lost — the owner's intended direction, not a demonstrated benefit. `[DOCUMENT]` owner decision, 2026-10-18 (D01)

## Target group and stakeholders

- Customer (pays): the company funds the internal module (owner's choice). `[DOCUMENT]` owner stakeholder notes, 2026-10-18
- User (uses): the granulate dispatcher, one person; one conversation recorded. `[DOCUMENT]` owner product vision notes, 2026-10-18
- User situation: office, two monitors and a phone, dispatching all the time; when he is away everything runs by phone and nobody replaces him (owner's account). `[INTERVIEW]` dispatcher conversation, 2026-10-23
- Result receiver: management, a summary after a month. `[DOCUMENT]` owner decision, 2026-10-18 (D02)
- Stakeholders: an invoicing employee re-types each order into the accounting program and passes it to accounting (owner's account). `[INTERVIEW]` owner account of the order flow, 2026-10-22
- Stakeholders: a second co-owner, whom the dispatcher calls by a senior title; per the owner's account he wants to know the results and which solutions work, only receives results and does not decide scope; he was not asked. `[INTERVIEW]` owner account, 2026-10-24
- Other company systems: an office (document) system and a messenger already work and a warehouse system is starting; per the owner the granulate module has nothing in common with them (D20). `[INTERVIEW]` owner account, 2026-10-24
- Decider for scope decisions: the product owner, sole blocker. `[DOCUMENT]` owner stakeholder notes, 2026-10-18

## Problems, with evidence

- The owner calls reducing empty kilometres the most important thing (Q13); the dispatcher describes avoiding empty legs by chaining loads and by swapping drivers on the road, and asks for more drivers for swaps (one account). `[INTERVIEW]` dispatcher conversation, 2026-10-23
- For trucks with a mass sensor, revenue over all kilometres was about equal to the division's cost per kilometre, while revenue per loaded kilometre was clearly higher; a notable share of kilometres ran without load. The same report gives two different loaded-weight thresholds, to reconcile. `[DATA]` owner's monthly division summary, 2026-09 (aggregates)
- The division result in that report is close to zero before vehicle tax and unassigned workshop invoices, which the report says would make it worse. `[DATA]` owner's monthly division summary, 2026-09
- The dispatcher quotes a rate per kilometre on loaded kilometres plus the approach; the owner identifies its source as his monthly summary, so the rate and the report are not independent evidence. Inference, not stated: the quote does not use the cost of the specific truck, route or fuel price. `[INTERVIEW]` dispatcher conversation, 2026-10-23
- The owner believes the plan for the coming days exists only in the dispatcher's head; the dispatcher did not confirm it and could not explain how he keeps the whole fleet in mind. `[INTERVIEW]` dispatcher conversation, 2026-10-23
- Driver holidays left trucks standing for one to two weeks in September while fixed costs ran on (dispatcher's account). `[INTERVIEW]` dispatcher conversation, 2026-10-23
- The owner states the company has no system that calculates trip profitability in the form it needs; he also says the older system already answers cost questions (Q06). `[DOCUMENT]` owner notes, 2026-10-18 and 2026-10-19
- The owner states the granulate division does not earn and the reason must be found; his stated monthly results are not checked against accounting and an older figure differs. `[DOCUMENT]` owner statements, 2026-10-18 and 2026-10-22 → A02
- Finding a trip's cost or a driver's data by hand used to take a long time; on 2026-10-22 the owner said the older system already handles this. Plan and execution are not set side by side. `[DOCUMENT]` owner notes, 2026-09
- Each order is typed in a second time by hand by the invoicing employee; frequency, time and error cost are not described. `[INTERVIEW]` owner account of the order flow, 2026-10-22
- Driver and load data (loads, kilometres, consumption) are spread across several programs. `[DOCUMENT]` owner notes, 2026-09
- A granulate trip history exists as transport invoices; most name the vehicle pair and the route in their notes, not in separate fields. `[DATA]` aggregate check of accounting data, 2026-10-22

## Product and how it stands out

- What it is: the first module of a modular micro-ERP — granulate trip entry, profitability before acceptance, post-trip comparison and a monthly summary; see Scope. `[DOCUMENT]` owner decisions, 2026-10-18 (D03, D05)
- What already exists: the company's older fuel system has trip pricing with both empty legs, a step-by-step pre-departure check, fuel estimates from the company's own history, post-trip closing, hourly plan-vs-fact alerts and a dispatch panel with fleet and weekly-plan screens and a map; its pricing already takes the next destination and can return a "chain link" verdict. The dispatcher does not use the panel and has not been shown it. `[PRODUCT]` the company's older fuel system (private); dispatcher use: owner, 2026-10-23
- What makes it different: not established; benchmarks describe vendor behaviour only. `[BENCHMARK]` public product pages, checked 2026-10-18
- Candidate difference, from public sources only: no checked product shows the offer, its unpaid approach, the next load and the result together (a chain verdict is Later for us, D22), none applies an approach-per-trip rule with a kilometre reconciliation (R05), and none confirms a per-trip plan-vs-fact settlement from GPS, fuel cards and invoices; the closest pieces are fireTMS (where and when a truck becomes free), IMPARGO (timeline per truck) and Fleethand (planned vs driven route). Vendor descriptions, not tested products. `[BENCHMARK]` public product pages, checked 2026-10-23
- The owner wants a new route compared with historical routes; BulkTMS shows past results of the same lane at dispatch; the older system estimates fuel from the company's own history but does not show similar past trips at an offer. `[INTERVIEW]` owner remark, 2026-10-23

| reference | what it does well | where it falls short for our users | checked on | link |
|---|---|---|---|---|
| fireTMS | Truck free from end of order | Silo match unchecked | 2026-10-23 | [Wolne pojazdy](https://pomoc.firetms.com/support/solutions/articles/1000225010-wolne-pojazdy) |
| IMPARGO | Timeline row per truck | Finds no loads | 2026-10-23 | [Dispatch](https://impargo.de/en/docs/understanding-the-dispatch-module) |
| Fleethand | Planned vs driven route | Needs driver app | 2026-10-23 | [Dispatcher Window](https://fleethand.freshdesk.com/support/solutions/articles/80001180861-dispatcher-window) |
| BulkTMS | Past lane review | US ecosystem | 2026-10-23 | [Dispatching](https://www.bulktms.com/features/dispatching) |
| TruckRadar | Asks where truck ends | US/Canada only | 2026-10-23 | [App](https://truckradar.co/app) |
| Trans.eu | Silo offers search | Offer quality unknown | 2026-10-23 | [Silo offers](https://www.trans.eu/pl/gielda-transportowa/zlecenia-transportowe/transport-silosem/) |
| PTV Map&Guide | Route variants by cost | No next-load match | 2026-10-23 | [Product](https://www.ptvlogistics.com/en/products/ptv-mapandguide) |

## Goals and success criteria

- Business goal: more control, reliable data and digitalisation for the company; later market directions are ideas. `[DOCUMENT]` owner goals, 2026-10-19
- Business goal: explain the division loss by comparing plan with execution, showing trip results and their causes without judging the dispatcher as a person. `[DOCUMENT]` owner goals, 2026-10-18
- Business goal: use the module as a showcase for new contracts and work. `[DOCUMENT]` owner stakeholder notes, 2026-10-18
- Business goal: a custom TMS for the company — review each cost the system can realistically influence; organisation, planning and dispatch first (see D13, D19). `[INTERVIEW]` owner answers, 2026-10-23
- User outcome (first specification): the dispatcher prices a real offer in the tool during the call, with approach, wash, dates and where the truck ends up, before accepting; checked first on a clickable prototype before the build (D25), then by observing one real offer with the built part (D21). `[DOCUMENT]` owner decisions, 2026-10-24 (D21, D25)
- What the owner says would convince the dispatcher: fewer empty kilometres, time saved, better planned refuelling (A06). `[INTERVIEW]` owner answers, 2026-10-23
- Primary metric, baseline today, threshold, date: the owner kept four targets — C1 plan vs actual per cost component on 100% of granulate trips, C2 a profitability calculation before every acceptance, C3 monthly division result from minus to zero or plus, C4 the module used in conversations about new contracts; achievability unverified, no baseline, no dates. A possible baseline for empty kilometres exists in the monthly summary; no target is set. `[DOCUMENT]` owner product vision notes, 2026-10-18
- What must not get worse: R01, R02.

## Scope

- **Now:** the first specification (D19): pricing an offer together with the truck's next move — manual trip entry (E1), profitability before acceptance (E2), certain/estimate marking (E6), empty kilometres per trip (E9) and future availability and next move of each truck (E11b), under R02, R04–R08; the quote shows the single trip's result (D22) beside past similar trips (D26; same route pair from invoices with date and price, results only from entered trips, D28); every truck's trips entered by hand (D24); checked by a prototype before the build (D25) and by D21. In parallel: evidence collection (Collection plan) and the review of the older modules (D10). The rest of the 1.0 table (D05, D13) binds and follows in later specifications: post-trip plan vs facts (E3), automatic GPS, fuel-card and invoice data (E4), monthly management summary (E7), email order → extraction → dispatcher confirms (E10a), entering several trips (E11a); Should: manual changes to cost components (E5); order open (Q18).
- **Later:** a verdict for a chain of trips (D22); other company modules (D20, Q17); Could items E8 (result per customer and route), E11c (live monitoring), E12 (during-trip control), E13 (selling a load to other forwarders); the history-based estimate idea (A05) as a candidate way to deliver E2; refuelling place optimisation (A06); cover when the dispatcher is away (Q12).
- **Not doing:** see Non-goals.

## Domain glossary

| Term | Meaning | Owned by | Visible to |
|---|---|---|---|
| Trip (kurs) | One transport job for one order, from the previous unloading (or the truck's position) through the empty approach, loading and everything between to its own unloading; the next trip starts there and carries its own approach (R05) | owner | dispatcher, management |
| Empty approach (dojazd) | Kilometres without load from the previous unloading or the truck's position to the loading place; not paid by the client | owner | dispatcher, management |
| Next move | The dispatcher's planning unit in his account: where the truck unloads, what load follows from nearby, and where it ends up | pending (owner) | dispatcher |
| Order (zlecenie) | The customer's transport order; agreed by phone or messenger, re-typed into the accounting program; whether every order arrives by email is unverified (A04) | pending (owner) | dispatcher, invoicing, accounting |
| Rate per km | The price per kilometre the dispatcher quotes, applied in his example to loaded kilometres plus the approach; the owner identifies the source as his monthly summary | pending (owner) | dispatcher, management |
| Tank wash (myjka) | Washing of the tank between loads: none, ours (a trip cost) or paid by the client (revenue); answered for every quote (R06) | owner | dispatcher, management |
| Active vehicle | Vehicle with a journey in the last 30 days in the fuel-system database | pending (owner) | management |
| Active driver | Driver who drove in the last 30 days; the driver register overstates who drives | pending (owner) | management |
| Certain / estimate | Marking of each number as established from a source or estimated (E6) | owner | dispatcher, management |
| Granulate division | Vehicles labelled granulate in the fuel system; vehicles may move between divisions | pending (owner) | management |

Source for definitions of active vehicles, drivers and the division: `[DATA]` aggregate check of fuel-system data, 2026-10-20.

## Key flows

- Current state (dispatcher's account of one offer): a contact calls with a load → the dispatcher adds the empty approach to the loaded kilometres → quotes a rate per kilometre from the monthly summary → accepts; near the unloading region he looks for the next load among his own forwarders, avoiding regions that are hard to leave. `[INTERVIEW]` dispatcher conversation, 2026-10-23
- Current state (owner's account): the dispatcher says "let me check, I'll call back", checks his own way and accepts; the order then arrives by email, goes to the invoicing employee, who types it into the accounting program; accounting books it; the driver receives it by phone and a messenger location pin. `[INTERVIEW]` owner accounts, 2026-10-22 and 2026-10-23
- Archived notes add: plan held in the dispatcher's head, profitability judged mentally, drivers send documents by messenger. `[DOCUMENT]` owner journey notes, 2026-10-18
- Future state: planning per D13; decided entry paths are E1 and E10a; every quote asks for the wash (R06) and the exact dates (R07); the owner's direction is a panel the dispatcher would want to use, designed from similar products, possibly with a map (Q11).

## Business rules

| Id | Rule | Applies to | Source | Status | Review by | Required path to change | Owner | Supersedes |
|---|---|---|---|---|---|---|---|---|
| R01 | A measurement is not an accusation: reports support management decisions and do not settle an employee's responsibility; raw l/100 km does not compare drivers without load, route, make and vehicle age | all reports and estimates | `[DOCUMENT]` owner goals (earlier rule, to reconfirm) | proposal | owner reconfirmation; Q04 | owner approves a superseding row | pending | none |
| R02 | Every number shows whether it is certain or an estimate, with its source | trip and monthly figures | `[DOCUMENT]` owner decision, 2026-10-18 (E6) | active | after dispatcher interview | owner approves a superseding row | owner | none |
| R03 | Money and fuel quantities are exact decimals, never floating point; precision and rounding need owner approval | all calculations | `[PRODUCT]` AGENTS.md § Stack | active | owner rounding decision | owner, recorded in this repository | owner | none |
| R04 | Before accepting a load the dispatcher calculates the trip's profitability and records it, so the company has data for analysis | granulate dispatcher, every load | `[DOCUMENT]` owner decision, 2026-10-22 (D08) | active | after dispatcher interview | owner approves a superseding row | owner | none |
| R05 | A trip's profitability includes its whole unpaid empty approach from the previous unloading; the next trip starts at its unloading. Every kilometre of a truck belongs to exactly one trip, and a check shows that every trip is closed with no gap or overlap | every trip calculation (E2, E9) | `[DOCUMENT]` owner decision, 2026-10-24 (D16) | active | if chain-level judgement is chosen (Q07) | owner approves a superseding row | owner | D09; D14 (halved and last legs) |
| R06 | A quote is not calculated until the dispatcher answers whether there is a tank wash: none; ours, with an amount, as a trip cost; or paid by the client, with an amount, as revenue. A missing answer never becomes "no wash" | every quote before acceptance (E2, E11a, R04) | `[DOCUMENT]` owner decision, 2026-10-24 (D17) | active | after the dispatcher's first use | owner approves a superseding row | owner | none |
| R07 | Every trip records the exact date and time of loading and unloading, and a quote is not calculated without them; the truck becomes free at the end of unloading; a wash has its own date and time; fuel, toll and exchange-rate prices are taken for the trip date, as an estimate (R02) until that date's prices are known | every quote, trip and availability view (E2, E3, E11b) | `[DOCUMENT]` owner decision, 2026-10-24 (D18) | active | after the dispatcher's first use | owner approves a superseding row | owner | none |
| R08 | After a truck's last unloading, kilometres without a next trip are an open approach: the kilometre check shows them as not yet assigned, until the next trip is entered and takes them as its approach | the kilometre check and availability (E9, E11b, R05) | `[DOCUMENT]` owner decision, 2026-10-24 (D23) | active | after the first months of the kilometre check | owner approves a superseding row | owner | none |

## Non-goals

| Id | We are not building | Why | Owner | Status | Review by | Required path to change | Source | Supersedes |
|---|---|---|---|---|---|---|---|---|
| N01 | Dust division in 1.0 | granulate first; dust is the next module | owner | active | after 1.0 | owner approves a superseding row | `[DOCUMENT]` owner decision, 2026-10-18 (E14) | none |
| N02 | Driver app in 1.0 | the driver enters nothing; facts come from GPS, cards, invoices | owner | active | after 1.0 | owner approves a superseding row | `[DOCUMENT]` owner decisions, 2026-10-18 (E15) | none |
| N03 | Messenger and freight-exchange import in 1.0 | manual entry covers these channels; the owner's later account adds that the messenger carries negotiation and the order comes by email (A04) | owner | active | after interviews | owner approves a superseding row | `[DOCUMENT]` owner decision, 2026-10-18 (E10) | none |
| N04 | Judging the dispatcher as a person | reports show trip results and causes, not personal blame | owner | active | unknown | owner approves a superseding row | `[DOCUMENT]` owner goals, 2026-10-18 | none |
| N05 | Storing the dispatcher's personal contacts | he will not hand them to a system; the rest he would hand over (owner's account) | pending | proposal | after the dispatcher sees a prototype | owner approves a superseding row | `[INTERVIEW]` owner answers, 2026-10-23 | none |

## Decisions

| Id | Date | Decision | Why | Owner | Status | Review by | Required path to change | Source | Supersedes |
|---|---|---|---|---|---|---|---|---|---|
| D01 | 2026-10-18 | Vision: plan, what happened, earned/lost, actual outcome | owner's statement of the product | owner | active | new evidence | owner | `[DOCUMENT]` owner decision record | none |
| D02 | 2026-10-18 | 1.0 Must: dispatcher enters trips and calculates profitability; management summary after a month | owner choice; earlier weekly wording superseded | owner | active | after management interview (P8) | owner | `[DOCUMENT]` owner decision record | none |
| D03 | 2026-10-18 | First module of a modular product | owner direction | owner | active | next module scope | owner | `[DOCUMENT]` owner decision record | none |
| D04 | 2026-10-18 | Product decisions are kept as owner decision records and take precedence for product scope | owner ruling | owner | active | unknown | owner | `[DOCUMENT]` owner scope ruling | none |
| D05 | 2026-10-18 | Release 1.0 table: 9 Must, 1 Should, 4 Could, 3 Won't (E1–E15) | owner categories on agent-compiled elements | owner | active, amended by D13; binds, specified in parts (D19) | after the first specification | owner | `[DOCUMENT]` owner release table | none |
| D06 | 2026-10-22 | Discovery material and the brief stay private; nothing goes to the public product repository | owner reversed an agent recommendation for an anonymised public brief | owner | superseded by D15 | when owner decides what may be published | owner | `[DOCUMENT]` owner decision record | none |
| D07 | 2026-10-19 | Start from the working calculation modules in the older system: recover inputs, outputs, rules and examples, then decide what to keep or port | owner clarification; existing implementations are evidence to examine | owner | active | after module review | owner | `[DOCUMENT]` owner clarification | none |
| D08 | 2026-10-22 | Pre-acceptance calculation and recording is a company requirement (R04) | owner answer to the riskiest assumption | owner | active | after dispatcher interview | owner | `[DOCUMENT]` owner decision record | none |
| D09 | 2026-10-23 | Adopt R05: half of each empty leg per trip; the client does not pay the approach | owner confirmed the older system's rule when asked full vs half | owner | superseded by D16 (2026-10-24) | Q07 | owner | `[DOCUMENT]` owner decision record | none |
| D10 | 2026-10-23 | Verify the older Python modules and port them to TypeScript with checks during the port | owner statement; refines D07 | owner | active | after module review | owner | `[DOCUMENT]` owner decision record | none |
| D11 | 2026-10-23 | The dispatcher first sees the module rebuilt on the new design, not the older panel; a competitor and demo review precedes the design | owner rejected the agent's proposal to test the older panel with the dispatcher first | owner | active | after the competitor review | owner | `[DOCUMENT]` owner decision record | none |
| D12 | 2026-10-23 | Reference views for the planning design: fireTMS Planner, IMPARGO Dispatch, Fleethand task report, in that order | owner accepted the benchmark recommendation | owner | active | after the detailed analysis or a demo | owner | `[DOCUMENT]` owner decision record | none |
| D13 | 2026-10-23 | Split E11b: future availability and next move Must (E11b), live monitoring Could (E11c); per-trip pricing stays Must | owner accepted the agent's proposal after the benchmark analysis | owner | active | after the demo scenario or first use | owner | `[DOCUMENT]` owner decision record | none |
| D14 | 2026-10-23 | First approach and last empty leg of a chain go in full to the adjacent trip; legs between trips stay halved | owner chose this after an audit of the older pricing, which drops half of each edge leg | owner | superseded in part by D16 (2026-10-24) | after the dispatcher's first use | owner | `[DOCUMENT]` owner decision record | none |
| D15 | 2026-10-24 | A sanitised copy of the brief lives in this repository at `.ai/specs/product-brief.md`; discovery material and the full brief stay private | the review and backlog gates read the brief here; under D06 they read nothing | owner | superseded by D27 (2026-10-24) | when a sanitised copy cannot carry a decision without client data | owner | `[DOCUMENT]` owner decision record | D06 |
| D16 | 2026-10-24 | A trip runs from the previous unloading through its whole empty approach, loading and everything between to its own unloading; no halves; a check that every kilometre belongs to exactly one trip | the owner found halves too complicated; it matches how the dispatcher quotes (loaded km plus the approach) and the approach is known at acceptance | owner | active | Q07 | owner approves a superseding row | `[DOCUMENT]` owner decision record | D09; D14 (halved and last legs) |
| D17 | 2026-10-24 | Every trip quote requires an answer about the tank wash (R06) | the owner wants the question asked before every quote; the older pricing only warned when it was missing | owner | active | after the dispatcher's first use | owner approves a superseding row | `[DOCUMENT]` owner decision record | none |
| D18 | 2026-10-24 | The system knows the exact date and time of loading, unloading, the truck becoming free and the wash, and prices are taken for the trip date (R07) | the owner: "the system must know the exact date"; chaining (D16) and availability (D13) depend on it | owner | active | after the dispatcher's first use | owner approves a superseding row | `[DOCUMENT]` owner decision record | none |
| D19 | 2026-10-24 | The 1.0 table binds; the first specification covers pricing an offer with the truck's next move (E1, E2, E6, E9, E11b); the other Must items follow one by one | owner chose option b of three (whole table; first slice; still open); accepted agent recommendation: E4 and E10a rest on untested A03, A04; tradeoff: the monthly summary is not in the first specification; element list proposed by the agent and confirmed by the owner | owner | active | if the module review shows the first part cannot be priced without automatic data (E4) | owner approves a superseding row | `[DOCUMENT]` owner decision record | none |
| D20 | 2026-10-24 | This repository will hold all company modules, added one by one after the granulate module; the granulate module exchanges no data with the office, messenger and warehouse systems | owner statement ("nothing in common"); the agent's reading as no data exchange confirmed by the owner; accounting invoices were not part of it (E4); refines D03 | owner | active | when the next module's scope is set | owner approves a superseding row | `[DOCUMENT]` owner decision record | none |
| D21 | 2026-10-24 | Expected outcome and check of the first specification: the dispatcher prices one real offer in the tool during the call, observed with the built part | accepted agent recommendation, taken from the A01/A06 test; no threshold or date | owner | active | after the observation | owner approves a superseding row | `[DOCUMENT]` owner decision record | none |
| D22 | 2026-10-24 | A quote shows the single trip's result and where and when the truck becomes free; a chain verdict is later | accepted agent recommendation over a chain verdict now: in the dispatcher's account he looks for the next load near the unloading; how often it is known at the quote is not observed; tradeoff: a load that pays only with the next shows as a loss | owner | active | if the D21 check shows results overridden because of the next load | owner approves a superseding row | `[DOCUMENT]` owner decision record | none |
| D23 | 2026-10-24 | Adopt R08: kilometres after the last unloading wait as an open approach | owner choice; follows R05 | owner | active | after the first months of the kilometre check | owner approves a superseding row | `[DOCUMENT]` owner decision record | none |
| D24 | 2026-10-24 | In the first part the dispatcher enters every truck's trips by hand; each last unloading comes from them | owner choice of three (manual; older system's data; position given at each quote), asked after the review found no source for the last unloading; no recommendation given | owner | active | if he does not keep entries up to date (D21, D25) | owner approves a superseding row | `[DOCUMENT]` owner decision record | none |
| D25 | 2026-10-24 | The dispatcher sees a clickable prototype of the new design on one real offer before the build; refines D11 | accepted agent recommendation: tests A01 before code; D11 asks for the new design, not a finished module | owner | active | if the session cannot be arranged | owner approves a superseding row | `[DOCUMENT]` owner decision record | none |
| D26 | 2026-10-24 | The first quote shows past similar trips (route, result, empty kilometres) | owner chose this over the agent's recommendation to defer it, because past routes are only in invoice notes (P11, unchecked); owner remark 2026-10-23: comparing with historical routes matters | owner | active | if no source yields usable past trips (Q19) | owner approves a superseding row | `[DOCUMENT]` owner decision record | none |
| D27 | 2026-10-24 | This file is the only product brief: discovery sessions write it here directly, without people, counterparties, rates, amounts, monthly figures or fleet counts; raw discovery material stays private | owner: a brief kept outside this repository cannot be read by other tools and threads, and copying it here is an extra step | owner | active | if a decision cannot be stated without client data | owner approves a superseding row | `[DOCUMENT]` owner decision record | D15 |
| D28 | 2026-10-24 | A similar past trip has the same loading → unloading pair in the same direction; the invoice history supplies its date and invoiced price as an estimate (R02); results and empty kilometres of past trips come only from trips entered in the tool (D24) | owner chose this over finishing the invoice → unloading → fuel join first or using entered trips only; accepted agent recommendation from the P11 data check: routes are readable from nearly all invoices, the join is unmeasured | owner | active | when a measured join can give results for past trips | owner approves a superseding row | `[DATA]` aggregate check of accounting and telematics data, 2026-10-24 (P11) | none |

## Riskiest assumptions

| Id | Assumption | Importance | Evidence today | If false | Smallest test | Owner | By when | Result |
|---|---|---|---|---|---|---|---|---|
| A01 | The dispatcher will actually calculate and record profitability in the tool at the moment of acceptance `[ASSUMPTION]` owner requirement R04 | high | rule set (D08); he decides on the phone from one rate per kilometre and keeps the plan in his head; he has not seen a panel; the owner says he must be convinced | records stay incomplete and post-trip comparison has no plan to compare | first a clickable prototype on one real offer before the build (D25); then, after the rebuild (D11), give him one real offer and observe whether he completes the check during the call (agreed check: D21) | owner | unknown | requirement set (D08); adoption untested |
| A02 | The granulate division loses money `[ASSUMPTION]` owner premise | high | owner-stated monthly results; the monthly summary shows a result near zero before some costs; not reconciled with accounting; an older figure differs | the "why do we lose" goal needs restating | sanitised accounting provenance note (P9, P10) | unknown | unknown | owner-stated; the latest month near zero by the owner's report |
| A03 | Trips can be joined automatically with GPS, fuel-card and invoice data `[ASSUMPTION]` owner choice E4; the owner says the link is in the accounting program | high | most transport invoices name the vehicle pair in notes; the older code pairs invoices with unloading events but misses vehicles without a mass sensor | E3, E4, E9 and A05 need manual input or later delivery | run the older pairing on one recent month and count granulate trips with vehicle, route and fuel; check a few by hand against documents (part of D10) | unknown | unknown | partly supported: the route can be read from nearly all invoice notes (P11, 2026-10-24); the invoice → unloading → fuel join is still unmeasured, so past trips give no result yet (D28) |
| A04 | Every granulate order arrives by email in a form that can be extracted `[ASSUMPTION]` one owner account | medium | owner's account; the dispatcher's example starts with a phone call; email of the order not mentioned | E10a Must loses its input | dispatcher shows the last few order emails (P2) | owner | unknown | untested |
| A05 | Past trips give a usable fuel-cost estimate per vehicle and route `[ASSUMPTION]` owner idea, 2026-10-22 | medium | transport invoices name vehicle and route in notes; the older system already estimates from own history; its accuracy not measured | the idea cannot deliver E2 | same one-month run as A03, comparing the estimate with measured litres | unknown | unknown | untested; the join it needs is unmeasured (P11, 2026-10-24) |
| A06 | Fewer empty kilometres, saved time and better refuelling places would convince the dispatcher to use the tool `[ASSUMPTION]` owner's view of the dispatcher | high | owner's account; the dispatcher himself named empty kilometres; refuelling and time not raised by him | the panel is built but not used | first a clickable prototype on one real offer before the build (D25); then, after the rebuild (D11), let the dispatcher plan one real truck on it and observe what he uses and what is missing (agreed check for the first part: D21) | owner | unknown | untested |

## Kill criteria

Not set. The owner has not said what result would make him stop or narrow the module. The D21 and D25 observations are checks, not stop rules: what the owner does if the dispatcher does not complete the quote is undecided; to be decided after those observations and P8.

## Hypotheses to test

None. No synthetic walkthrough was run.

## Open questions

| Id | Question | Blocking | Who can answer | Status |
|---|---|---|---|---|
| Q01 | Does the 1.0 release table still bind in full, or is scope still open? | yes — specification and backlog | owner | closed 2026-10-24: binds; first specification is the pricing slice (D19) |
| Q02 | Where is the trip plan (vehicle, driver, date) recorded today, if anywhere? | no for the first specification (manual entry of every truck's trips, D24); yes for multi-trip entry (E11a) | granulate dispatcher | partly answered 2026-10-23: the owner believes only in the dispatcher's head; not confirmed by the dispatcher |
| Q03 | How does the dispatcher decide that a load pays, and from what numbers? | yes — E2 design and A01 | granulate dispatcher | answered 2026-10-23: a rate per kilometre from the monthly summary on loaded kilometres plus approach, then where the truck ends up |
| Q04 | May per-driver consumption be used as an estimate input, given R01? | no — only the history idea (A05) | owner | open |
| Q05 | What role does the second co-owner have in scope and go/no-go? | no — unless he disputes scope | owner | closed 2026-10-24 on the owner's account: receives results, does not decide scope; go/no-go is the owner's alone (2026-10-18); the co-owner was not asked |
| Q06 | Is the long manual search still how it works today? | no | owner | closed 2026-10-22: the older system already handles it (owner) |
| Q07 | Does the dispatcher judge a load per single trip or per weekly cycle? | yes — the unit of E2 and E9 | granulate dispatcher | closed for the first specification 2026-10-24: per single trip with the next move shown; chain verdict later (D22) |
| Q08 | Is the monthly summary about the dispatcher's decisions or about the division's trip results (D02 wording vs N04)? | yes — E7 design | owner | open |
| Q09 | Which accounting warehouse holds granulate orders, and where are vehicle and route recorded? | no | — | closed 2026-10-23: a dedicated transport warehouse; vehicle pair and route in invoice notes |
| Q10 | Should fleet monitoring and planning of the next move (E11b) become Must in 1.0, and does per-trip pricing stay Must alongside it? | yes — specification, backlog and design | owner | answered 2026-10-23: split E11b; future availability and next move Must, live monitoring Could (D13) |
| Q11 | Should the planning view centre on a fleet map, and which reference panels should be compared? | no — design only | owner | answered 2026-10-23: fireTMS Planner, IMPARGO Dispatch, Fleethand task report, in that order (D12) |
| Q12 | Must the system let someone else take over dispatch when the dispatcher is away? | no — later scope | owner | open |
| Q13 | Who said that reducing empty kilometres is the most important thing — the dispatcher or the owner? | no — weight of the Problems line | owner | closed 2026-10-23: the owner said it and agrees; the dispatcher's own account shows he works to avoid empty legs |
| Q14 | Who is the senior person the dispatcher mentions, and does that person set the break-even target or have a say in 1.0 scope? | yes — if that person can change scope | owner | closed 2026-10-24: the co-owner (Q05); receives results, does not decide scope; whether he set the break-even target not stated |
| Q15 | Should the pre-acceptance calculation show past similar trips (route, result, empty kilometres), and is it part of E2 in 1.0 or later? | yes — that part of the first specification | owner | closed 2026-10-24: in the first part (D26); source open, Q19 |
| Q16 | How is the first empty approach of a chain (e.g. from base) and the last empty leg without a next load counted? | yes — the chain result in E11b and E2 | owner | closed 2026-10-24 (D16, D23): the first approach in full on the first trip; the empty leg after the last unloading is the next trip's approach and stays open until that trip exists (R08) |
| Q17 | Do the existing office, messenger and warehouse systems move into this repository, and in what order do other modules come? | no — later modules (D20) | owner | open |
| Q18 | In what order do the remaining 1.0 Must items follow the first specification? | no for the first specification; yes for the next one | owner | open |
| Q19 | Where do past similar trips come from in the first part — the invoice history (P11) or trips entered in the new tool — and what counts as a similar trip? | yes — the past-trips part of the first specification (D26) | owner | closed 2026-10-24: same route pair and direction; invoice date and price as an estimate; results only from entered trips (D28) |

## Definition of Ready addendum (client)

Problems and Target group have one first-hand account from the dispatcher plus the owner's monthly data and accounts; there is still no management interview and no accounting evidence (A02). The decider is named (the product owner, sole; the co-owner receives results). For the first specification (D19) the owner has set the scope, what is out of scope (Non-goals, Later), the expected outcome and its checks (D21, D25), how each truck's last unloading is known (D24), and the rules it must follow (R02, R04–R08). No question blocks it: the source of past similar trips and what counts as similar are decided (D28); place-name normalisation and the starting position of each truck before its first entered trip are specification questions. Signed by the product owner on 2026-10-24 for the first specification. Ready for: writing the specification of the first slice, the prototype (D25) and the module review (D10). Not ready for: specifications of the remaining Must items (Q18; E4 and E10a depend on A03 and A04).

## Collection plan

Entries kept privately with the discovery material and still waiting: P2 (order emails, partly answered 2026-10-23), P8 (management interview), P9 and P10 (sanitised accounting provenance), P11 (below). P12 answered 2026-10-23 by the ten-product benchmark. P3 and P4 answered by the dispatcher conversation of 2026-10-23.

### P11 — Can past granulate trips be joined with vehicle, route and fuel data?

- What decision or work needs it: Q19 answered (D28); still A03 and A05 — whether E4 automatic data and the history-based estimate are feasible in 1.0.
- Who can answer it: the agent, from read-only aggregates and the older code.
- How: aggregate checks done 2026-10-22/23 and 2026-10-24 (routes readable from nearly all invoices; many repeat; the invoice → unloading → fuel join not measured because the sources cannot be joined in one query without exporting rows). Next, when results of past trips are needed: an approved aggregate join at the sources, as part of the D10 review.
- Owner and by when: unknown.

### P12 — How do comparable dispatch and fleet-planning panels show the next move of each truck?

- What decision or work needs it: Q11 and the design of the planning view (D13).
- Who can answer it: the agent, from public product pages and documentation checked on a date.
- How: benchmark check of dispatch boards with a map (what they show for empty legs and next loads).
- Owner and by when: the agent; done 2026-10-23 (ten products).
