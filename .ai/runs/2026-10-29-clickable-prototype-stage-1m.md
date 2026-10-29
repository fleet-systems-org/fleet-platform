# Clickable prototype — Stage 1m

## Objective and plan

Apply owner decision S07-1 only: move s07 to later navigation and end Phase 1 at accepted s12. Starting branch prototype/e01-clickable, commit 0c04a2d. Merged the two new origin/main commits without rewriting history (design decision record only). Read prototype progress (screen order, 1k, 1l), App navigation/actions/s07/p19, prior Stage 1l run, lessons and E01 Fleet (Phase 2). Production specifications remain unchanged.

1. Reuse Flota's existing navigation gating for Kursy aut; gate the accepted quote link.
2. Record S07-1 and close Stage 1 appearance feedback; preserve s07 and review engine.
3. Run requested checks and browser walkthrough at 1440/320, publish build/evidence, commit and normal push, without PR or base merge.

## Validation

- Package typecheck and Vite build passed (578 ms; existing >500 kB advisory). Repository typecheck/lint and explicit prototype ESLint passed; 38 test files / 198 tests passed.
- Mechanical detector: []; raw token scan reports exactly eight unchanged approved N8a map declarations. A temporary source copy omitting only those declarations passes with 0 findings; checker and committed CSS unchanged.
- prototype.js byte-identical to 0c04a2d. Protected source diff against origin/main empty. Source/build private-company scan 0; git diff --check passed. Only two App.tsx hunks; s07 content, acceptance alert and picker/map unchanged.
- Existing VPS Chromium via CDP, isolated browser context at actual 1440×900 and 320×900: full happy path to 21.82 EUR; accepted s12 lacks trip link in Phase 1; menu order New quote / Later / Vehicle trips / Fleet with both later entries disabled; direct picker entry to s07 works; p19 restores both trip links; aria-current on s07; mobile menu opens/closes and closes after navigation; horizontal overflow 0; runtime errors 0.
- Initial test reused p19 between widths because reset deliberately preserves scope. Corrected test isolation with page reload, then both widths passed; no product workaround.
- External preview and screenshots were kept outside the repository; client-side availability was not verified.
- Not run: production build, coverage/integration, Storybook, exhaustive accessibility/cross-browser matrix. Production specifications stay unchanged; no new reusable lesson or standing rule warranted.

## Outcome

S07-1 implemented, verified and documented. Normal push to existing prototype branch; no PR or base merge. Next: owner review; Stage 2 needs separate authorization. 
