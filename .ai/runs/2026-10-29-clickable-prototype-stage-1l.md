# Clickable prototype — Stage 1l

## Objective and plan

Apply owner decisions N7e/N7f/N7g from PR #59 (`origin/docs/vehicle-labels-shares`) to the standalone prototype only. Start: `origin/prototype/e01-clickable` 2b2eed3; merged current origin/main (decision records only). Read README, engineering standards, lessons index and relevant prototype/discovery lessons, previous Stage 1k run and progress stages 1i–1k. Production E01 specifications remain unchanged.

1. Replace twelve realistic demo driver identities with invented A–L labels and use driver/registration wherever a vehicle is named, preserving internal IDs, ordering, availability and K2 snapshot.
2. Use the existing exact whole-cost fixture for s11 shares and add BigInt assertions, including the unrounded total.
3. Resolve text-only navigation in the progress record; run requested static checks and two-width browser walkthrough, publish build and screenshots externally, commit and normal push without a PR.

## Validation

- Package and repository typecheck passed. Prototype Vite build passed (748 ms; existing >500 KB bundle advisory). Repository lint and explicit prototype ESLint passed.
- Unit tests: 38 files, 198 tests passed. Exact BigInt assertions cover expected country tenths [63, 42, 393, 236], exact 2800-cent sum and whole-cost total 733 tenths, distinct from rounded-row sum 734.
- Mechanical detector returned []. Token check on a temporary source copy omitting only the eight unchanged approved N8a map declarations returned no findings; committed sources/checker unchanged.
- git grep for every old given name and surname returned no matches; source/build private-company scan 0; old Auto labels in screen content 0 (internal IDs deliberately retained). prototype.js byte-identical to 2b2eed3. No changes to packages/app, packages/ui/src or packages/ui/stories. git diff --check passed.
- Playwright connected to the existing VPS browser (CDP 127.0.0.1:9222), using a fresh isolated context: actual 1440×900 and 320×900; twelve mapped driver labels, chronological order and selection, four/two columns, collapsed answer/route identity, s11 exact shares/bar widths and blank group shares, s12 = 21.82 EUR, s16, acceptance and s07 passed. No horizontal overflow or runtime errors. Initial shared-profile execution completed the functional checks but caught extension messaging errors; isolation eliminated them, without changing product code.
- Four requested screenshots saved externally under the stage-1l evidence directory and visually inspected. Build copied into the existing preview root without deleting previous evidence. All five resources (index and screenshots) returned HTTP 200 from the Mac mini network endpoint. Files exist in iCloud on Mac mini, but uploaded flags were not yet true; do not claim availability on both Macs. MacBook download/opening unverified.
- Not run: production build, coverage/integration, Storybook, cross-browser matrix or exhaustive accessibility review. No production specification status changed; no new durable lesson/standing rule needed.

## Outcome

Implementation and requested checks complete. Normal push to prototype/e01-clickable follows this log; no PR or merge into base. Next: owner review, then separately authorize Stage 2. Course progress update is left to the coordinating session, keeping this order within prototype/run-log scope.
