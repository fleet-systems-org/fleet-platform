# Clickable prototype — Stage 1g

Status: in progress. Agent: Codex. Starting branch: prototype/e01-clickable at b3e8c35.

## Objective and authority

Implement only s11 grouped country costs (N7e / R20.1) and keyboard-only heading focus outline. Owner task is the implementation approval. Read decision record from origin/docs/quote-route-groups (N7e, R20.1, N6a, R17.1), without copying it; preserve N7c shared frame and all other screen content. Read prototype POSTEP stages 1–1f, engineering standards, lessons index and prototype composition/back/route lessons. Production specifications remain unchanged and unimplemented.

## Plan

1. Replace s11 country cards with one accessible grouped table, reusing allocation and share helpers/classes, and mobile metadata rows.
2. Suppress programmatic pointer outline only; retain keyboard focus and unchanged engine.
3. Run package/repository checks, arithmetic assertions, token scan and detector; verify actual 1440/320 viewports, identical summary and pointer/keyboard focus. Publish external build/evidence, record results and push normally. No PR or base-branch merge.

## Progress

- Main is already an ancestor of the starting branch; no new base commits require merging.
- Implemented grouped rows and responsive metadata; retained shared summary/actions and route. Verification pending.


## Validation and outcome

- Package typecheck passed; final Vite build passed in 590 ms.
- Repository typecheck and lint passed. Unit tests: 37 files, 196 tests passed. Logs retained temporarily outside Git.
- Explicit prototype ESLint passed. Exact country-share assertions: 8.6/5.7/53.6/32.1 and rounded sum 100.0 passed, alongside existing zero/rounding/large-BigInt cases (TMPDIR=/tmp avoids long IPC socket paths).
- Token scan src/app + src/main.tsx: no values outside design tokens. Impeccable detector: []. Whitespace check passed. Protected source diff against origin/main empty; engine prototype.js byte-identical to b3e8c35.
- Isolated agent-browser actual 1440/320 CSS pixels: country/group/total figures, mobile metadata/order, bottom scroll and no horizontal document overflow verified. Desktop summary width 360 px; summary innerHTML exactly matches s12. Actual click on “Wyceń”: h1 focused, focus-visible false, outline none. Tab then Enter navigation: h1 focused, focus-visible true, outline solid, at both widths. Console errors: 0.
- External preview and screenshots were kept outside the repository; client-side availability was not verified.
- Read/update supporting composition lesson for modality-specific heading outline. No financial policy or production specification changed.
- Not run: production app build/integration/coverage, Storybook tests, exhaustive accessibility or cross-browser matrix, Stage 2. Only prototype composition changed.

Outcome: implementation and requested local verification complete. Normal push and final preview synchronization verification pending. No PR or base-branch merge.
