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
