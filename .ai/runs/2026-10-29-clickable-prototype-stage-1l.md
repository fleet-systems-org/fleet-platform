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
- External preview and screenshots were kept outside the repository; client-side availability was not verified.
- External preview and screenshots were kept outside the repository; client-side availability was not verified.
- Not run: production build, coverage/integration, Storybook, cross-browser matrix or exhaustive accessibility review. No production specification status changed; no new durable lesson/standing rule needed.

## Outcome

Implementation and requested checks complete. Normal push to prototype/e01-clickable follows this log; no PR or merge into base. Next: owner review, then separately authorize Stage 2. 
