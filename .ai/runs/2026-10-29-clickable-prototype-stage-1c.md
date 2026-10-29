# Clickable prototype — Stage 1c

Objective: deliver N6a quote direction C, N2b body weight, R17.1 exact cost shares, optional synthetic customers and two Stage 1b layout fixes. No production implementation or pull request.

Authority: owner task 2026-10-29; design decisions N6a/N2b/R17.1 on the decision branch; approved E01 foundations and feature specifications; prototype progress and Stage 1b run log; engineering standards and lessons index.

Starting branch: prototype/e01-clickable at d7cba41. Agent: repository coding assistant.

Plan:
1. Merge current main without rewriting history and adapt DecimalField.
2. Replace variants with one responsive cost table and summary; exact BigInt shares and expandable vehicle categories.
3. Add optional synthetic customer/place selection and preserve accepted-trip snapshots.
4. Fix route text scaling and review Back clearance without editing the engine.
5. Run package/repository checks and isolated browser walkthrough at both requested widths; publish preview and record results before commit/push.

Validation: pending. Production specifications remain approved, not implemented.

## Actions and results

- Baseline merge: 24a2e74, incorporating #48 without shared-source edits.
- Replaced alternatives with N6a/R17.1 responsive table/summary; added exact-share assertions and nine-category synthetic allocation; N2b local typography override only.
- Added six fictional customers, optional independent places, first-character/name/city keyboard search, and accepted-trip customer snapshots.
- Corrected Back CSS specificity and moved route text out of scalable geometry. Recorded the repeated defect and a navigation-regression proposal in the lessons index.
- Package typecheck/build passed; final build completed in 915 ms. Repository typecheck/lint passed; unit tests: 34 files, 156 tests passed. Explicit prototype ESLint passed; token scan 0 findings; style detector 0 findings; diff whitespace passed.
- Exact assertions passed: six fixture shares, nine categories summing to 600 cents, zero denominator, half-up and fractional cases, values beyond Number.MAX_SAFE_INTEGER. Temporary-directory path length initially blocked the assertion runner; rerun with a short temporary directory passed.
- Final isolated browser traversal passed at 1440 and 320 CSS pixels: customer keyboard/city/no-match/Escape/reset, single/multiple places, optional independent places, quote/details/acceptance, nine rows, accepted snapshots and owner parity. All 19 screen ends checked for document overflow and Back/frame separation at both widths. 14 external screenshots. Runtime errors: 0.
- Computed body weight 500, route drawing height 36 px and label size 12 px at both widths. Mobile summary precedes details. Action/divider contrast 5.9806:1.
- Protected diff against main empty; engine SHA-256 matches baseline. Preview build index/assets copied without deleting earlier evidence. Direct network preview probe timed out; publication checks are recorded separately below.

## Limits

No production implementation, specification status transition, Stage 2 expansion, PR or base merge. Production application build/integration/coverage, exhaustive accessibility/cross-browser audit and negative-result acceptance not run. Customer-directory sourcing, ordering-party identity and E8 effects remain specification questions, documented in prototype progress.

Preview publication: the preview host confirms the new index exists and returns HTTP 200 through its private network address. Opening from the owner's client and completed cloud upload are distinct checks; client opening was not claimed.

Final checks: optional customers omitted with independently keyboard-selected places still produce 21.82 EUR. Package typecheck, explicit ESLint and zero-token scan passed again after the final layout adjustment. Both-width browser screenshots were refreshed after the change. Next: owner reviews Stage 1c; Stage 2 awaits authorization.
