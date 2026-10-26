# E01 specification — interactive question gate

- Objective: draft the whole E01 specification from #18/#22–#26, with backlog-driven reusable foundations; stop at Open Questions.
- Agent: Codex; branch: cez/495f3e66; starting commit: 4170463fdbbacc2696d70a7e0edcbe30b17ccaf2.
- Specification: [draft skeleton](../specs/2026-10-26-e01-trip-entry-and-quotation.md), not approved for implementation.
- Read: AGENTS.md, README, brief, backlog, older pricing review, engineering standards, lesson index and foundation-completion lesson, existing API/DI/decimal/form code; fetched issues #18–#31. Main and starting branch match for the binding inputs.
- Finding: #18 retains superseded D25 wording; D29 and updated #21/#22/backlog govern. No tracker mutation performed.
- Outcome: skeleton only, 15 unanswered owner questions, backlog feature-family inventory and post-gate design agenda. No financial policy chosen, no domain code, no research/design/review beyond the gate, no PR or merge.
- Validation: documentation diff/links/question count/privacy checked before publication; application tests not run because only Markdown changed. No claim of implementation or complete specification validation.
- Remaining: owner answers all gate questions, then detailed design, research, phased implementation plan and review; mockup follows the completed specification.

## Owner answers and linked design continuation — 2026-10-26

- Owner answered Q1–Q15 in a T3 thread and requested two linked designs, without implementation. Answers are recorded as D30–D37/R09–R12 in the brief; historical rows retained with supersession metadata. D35 records town granularity without changing brief Q05 (co-owner); D37 partially resolves Q18.
- Drafted [foundations](../specs/2026-10-26-e01-foundations.md) and expanded the feature specification together, with one shared primary-source research base, new-record Mermaid graphs, foundation-to-phase mapping, scoped API/data contracts, failure cases, synthetic examples and aligned testable steps. No framework-first phase; first clickable phase is trip entry + quote.
- Updated backlog document count and next-spec order; appended a policy supersession note to the older pricing review without treating historical examples as current fixtures.
- Remaining decisions: FQ1 weekend labour, FQ2 mail provider/sign-in, FQ3 overhead, FQ4 source aggregation/freshness/date/FX policy, FQ5 monthly boundary evidence and late corrections. No defaults chosen. The owner explicitly authorized finishing the design with FQ1/FQ2 open; new questions are surfaced as localized implementation blockers. Specs are draft, not implementation approval.
- Passed documentation checks: relative targets exist; fences/required sections/graphs present; one Markdown decision table with 37 unique ordered rows and one rule table with 12 unique rows; prior Q05 preserved; publication text checks on both E01 specs; diff whitespace check. Synthetic fuel/cost/result and half-up cases independently recalculated with rational arithmetic/Decimal, not application tests.
- Not executed: application lint/typecheck/coverage/build/integration, live source access, routing requests, authentication or runtime migrations. Markdown-only change; no claim these behaviors work or that new specs are implemented.
- Independent scope-cohesion review: pending at this checkpoint; review evidence and corrections will be appended before handback.

## Independent scope review and revisions — 2026-10-26

- Cezar review task 3a4530a5, Claude Opus 5.5, examined both specifications at 6c91027; no files changed in its branch. Validated the report against the documents and zero branch diff; no child changes to merge. Verdict: changes, four cohesion findings. Aligned phases, no framework-first runtime and no accidental E3/E4/E7 implementation were confirmed; synthetic examples were independently recomputed by the reviewer.
- F1: retained only minimal accepted correction/cancellation in Phase 1 and documented why first real-data typos must not require rewriting DB history or waiting for Phase 2; same entry/acceptance controls, no management workspace.
- F2: placed assignment-once/concurrent next-trip proof in 1.4, its first consumer. Phase 2 only displays existing review flags and adds measured-coverage reconciliation; no duplicate transition implementation.
- F3: explicitly scoped evidence phase: quotes/entered results are plan; invoice `actual` refers only to its historical `invoicedPrice` source field, still shown as estimated per D28. It supplies no actual trip cost/result.
- F4: made all P01–P09 primitive names identical in both phase tables.
- FQ3–FQ5 remain new owner questions, not accepted policies; final gate report must offer options/recommendations. FQ1/FQ2 remain owner-deferred questions.
- Follow-up scope review: pending on this revision. No application tests run; docs only.

## Final document verification — 2026-10-26

- Scope re-review e3d38be1, Claude Opus 5.5, approved b1f7cf1: all four findings resolved, D29/D33 phases aligned, no framework-first or actual-settlement/monthly-report expansion. Validated quoted passages and zero child branch diff; no child commit to merge.
- Applied the non-blocking section-heading naming nit after approval; no design or phase behavior changed. All changed files remain Markdown. Review approval is for scope cohesion, not final owner approval or implementation readiness.
- Final checks: relative link targets, Markdown fences/table shape, sequential unique D01–D37/R01–R12 records, shared P01–P09 names, mandatory design sections/Mermaid blocks, publication-text checks and independently recomputed synthetic money/fuel/rounding examples; git diff whitespace check. Passed. No live-data or runtime guarantee is inferred.
- Application lint/typecheck/coverage/build/integration not run: documentation-only change. No implementation, schema migration, production connection, PR or base-branch merge performed.
- Handoff state: linked design drafts complete for owner review, published on the task branch. Await FQ1–FQ5 policy decisions; FQ1/FQ2 explicitly deferred by the owner, FQ3–FQ5 newly raised and not defaulted. Next after specification decisions/approval is #21 synthetic mockup, then Phase 1; E3/E4 is the next specification under D37.

## Foundation answers applied — 2026-10-26

- Owner answered FQ1–FQ5 in a T3 thread; FQ2 authentication explicitly stays open. Appended D38–D41 and R13–R16 to the brief, retaining older row text and adding refinement metadata to D30/D36/R10. Q20/Q22/Q23 closed; Q24 now leaves only late post-freeze evidence open for E7. Q21 is unchanged.
- Both linked specifications now use the explicit three-case weekend choice; last-closed-month measured vehicle-day costs with labour separated and uncovered categories labelled notIncluded; ordered fuel/FX/vehicle-CAN/fleet/toll provider policies and owner-approved external thresholds. Removed independent percentage overhead from the proposed formula and updated synthetic examples to daily rates/coverage-limited results.
- D41 GPS-midnight or labelled time-proportional split is a future E7 rule only. E01 continues to store timestamps, without monthly report/GPS collection; no late-data policy invented. Sanitised aggregate evidence rationale is recorded without reproducing company percentages, rates or person data.
- New narrow gate FQ6 / Q25: whole-flat-day versus prorated charging for partial weekend days in the abroad-rest case. No answer chosen. Other modes/full-day cases are defined. FQ2 and late frozen-month evidence remain deferred exactly as instructed.
- Checks passed: relative links/fences/table columns; sequential D01–D41/R01–R16; historical policy text preserved; Q21 unchanged; identical primitive phase tables; new-publication privacy checks; independent rational daily/weekend totals and litre-weighted fuel example; git diff whitespace check.
- No application tests, production queries, credentials, source connection tests or implementation run. Scope is Markdown only. Independent policy-consistency review pending at this commit; prior scope approval is not represented as approval of this new revision.

## Cost-policy review and full-day owner answer — 2026-10-26

- Read-only reviewer 2e259fd8 examined 341c2e9 against 5a48678: core D38–D41/R13–R16 financial policies faithful, examples correct, no double-counted labour/overhead, Q21 unchanged, no E7 implementation. Verdict changes with four documentation gaps; reviewer branch has no edits to merge.
- Dispositions: weekend calendar/timezone is explicit new FQ7/Q26 (no financial calendar assumed); one trip-wide weekendCase covers all weekends of the quote per the one-case-per-quote contract, with mixed cases not silently inferred. UI flow now includes explicit weekend choice and missing-answer prompt. #25 validation matrix now traces weekend, source month/coverage/notIncluded and fuel hierarchy to checks/screenshots. Future public fuel fallback retains latest published as-of price/date and estimate label; future data is never invented.
- Owner then answered FQ6: append D42/R17, retain previous decisions/rules and close Q25. Full flat labour is charged for each weekend calendar day touched under reduced rest abroad; no proration. Both specs and synthetic partial-day examples updated; source values remain external and examples invented.
- Verified final documents: sequential D01–D42/R01–R17 in Markdown tables; Q20/Q22/Q23/Q25 closed and Q21 unchanged; relative links/fences/table columns; matching P01–P09 names and no old unresolved-FQ6 recommendation; no changed non-Markdown files; independently recomputed daily/full-weekend/partial-day and weighted-fuel illustrations; diff whitespace check. All passed.
- Review limits: reviewer approved core policy fidelity but requested the above documentation fixes; those dispositions were checked locally, not represented as an independent approval of the latest text. Application lint/typecheck/coverage/build/integration not run (documentation only). No implementation, PR, base merge, production access or credentials.
- Remaining: FQ2/Q21 personal-email method/provider stays open as instructed; FQ7/Q26 weekend calendar/timezone needs owner confirmation; late data after frozen months remains Q24 for E7. Stop before implementation, publish task branch only. Next authorized product sequence remains both-spec approval → #21 synthetic mockup → phased E01 build.

## Final owner calendar decision and approval-ready handoff — 2026-10-26

- Owner fixed labour weekend calendar to Europe/Warsaw Saturday 00:00 through Sunday 24:00, independent of vehicle position/borders. Appended D43, preserved R13/R17 rule bodies and added calendar-refinement metadata; Q26/FQ7 closed. Q21 authentication and Q24 late frozen-month evidence remain unchanged and deliberately open.
- Applied the same half-open Saturday-to-Monday interval and IANA/DST semantics to both linked specifications, including full touched-day flat billing, stored quote policy context, edge cases and implementation verification. Both statuses now read ready for owner approval, explicitly not approved/implemented. No new open item introduced.
- Passed final checks: relative link targets, Markdown table shape/fences, D01–D43 and R01–R17 sequence, matching primitive phase names, publication-text checks, no stale unresolved-calendar gate, preserved prior rule text and unchanged Q21/Q24. Independent Python zoneinfo examples verify 47-hour spring and 49-hour autumn Warsaw weekends plus an instant whose weekday differs abroad; only Warsaw governs labour. These are document reasoning checks, not executed application tests.
- Application lint/typecheck/coverage/build/integration not run (only Markdown). No implementation, production access, PR or merge. Task branch published; specs remain in active area pending owner approval. Next action: owner approval of both documents, then #21 synthetic mockup per D29/D33; resolve authentication before real-data rollout and late-data policy within E7.
