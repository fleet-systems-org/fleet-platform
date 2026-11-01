# Clickable prototype — Stage 1i

Status: complete; waiting for owner review. Agent: Codex. Starting branch: prototype/e01-clickable at 9647a22.

## Authority and plan

Owner order: N7f/R21.1 tiles on s09 only, map edge on s01 only. Read N7a, R18.1, R08.5 and N7f/R21.1 on origin/docs/quote-route-groups (pending #57); prototype stages 1–1h; approved E01 baseline, engineering standards, lessons index and composition/route/discovery lessons. Production specifications are unchanged.

1. Merge latest origin/main; preserve protected sources relative to main.
2. Add native radio tiles with fictional driver/tractor mapping, preserve vehicle IDs, calculations and K2. Extend map clipping independently of projection and routes.
3. Run requested checks and browser walkthrough; publish build/screenshots outside Git; document open owner question and push normally. No PR or base merge.

## Verification

- Package typecheck/build passed; final Vite build succeeded. Repository typecheck, lint and unit tests passed: 38 files, 198 tests. Explicit prototype ESLint passed. Token check: 0. Impeccable mechanical detector: [] (0 findings; source detector, not rendered accessibility certification).
- Actual 1440/320 browser passed pointer tile choice, ArrowRight/ArrowLeft/Space, visible focus, unchanged tile dimensions when selected, no horizontal overflow, 14 px availability, collapsed driver/tractor answer and full entry through s11 to s12 result 21.82 EUR. Five requested captures saved externally. Browser test setup corrections: click visible label rather than clipped input, use existing Wyceń button, reload before second viewport to reset React state; no product changes for these test corrections.
- Initial enlarged map still clipped at the SVG viewport. Final local overflow-visible rule plus expanded data visually passed 1440/1920 captures. Generated source: 116,171 bytes; route/city exports byte-identical to baseline.
- prototype.js byte-identical to 9647a22. Protected source diff against origin/main: 0 bytes; latest main merged first. Private-name scan 0; git diff --check passed.
- External preview and screenshots were kept outside the repository; client-side availability was not verified.
- Not run: production coverage/build/integration, Storybook tests, cross-browser matrix or exhaustive accessibility audit. Production specifications remain unchanged; no PR or merge to main.

## Outcome

Only Stage 1i prototype changes and its records. Auto 01 labels elsewhere deliberately unchanged; owner question in prototype progress. No independent task dispatched because the authorized scope is small and locally verifiable. Next: owner review; Stage 2 remains unauthorized.

## Publication

- External preview and screenshots were kept outside the repository; client-side availability was not verified.
