# Clickable prototype — Stage 1h

Status: in progress. Agent: Codex. Starting branch: prototype/e01-clickable at 06697ed.

## Objective and authority

Owner-authorized prototype-only sign-in through the existing office system (W2, N8a). Read N8a, R08.5, Q5a, Z6 and Q3 from origin/docs/quote-route-groups, prototype progress stages 1–1g, engineering standards, lessons index and composition/back/route lessons. No production authentication or business logic is implemented; production specifications remain unchanged. Main is already an ancestor of the starting branch.

## Plan

1. Compose the three s01 states and new-computer scenario; retain s09 happy-path destination, annotate s02–s04 as unavailable under W2.
2. Generate a public-domain Natural Earth map with independent fictional routes and token colours. Keep reference material outside Git.
3. Run package/repository checks, prototype ESLint, token scan, mechanical detector and protected/engine/private-name checks. Verify 1440/320 browser states and keyboard sequence; publish external build and captures, commit normally. No PR and no base-branch merge.

## Progress

- Added prototype-only sign-in composition, scenario/reset wiring and W2 placeholder screens. Verification in progress.

## Verification

- Package typecheck/build passed (final Vite build 626 ms). Repository typecheck, lint and tests passed: 37 files, 196 tests. Explicit prototype ESLint and frozen-lockfile installation passed. Initial typecheck ran before the direct Tabler dependency was installed; rerun passed. Lockfile contains only the prototype importer dependency addition/reordering.
- Token scan src/app + src/main.tsx: 0. Mechanical source detector: 0 findings; source regex checks only, not a rendered accessibility audit. Diff whitespace passed. private-name scan: 0.
- Protected source diff against origin/main empty; prototype.js SHA-256 matches 06697ed exactly (1ce5c7507244ae8e4162541e44eab14b69976430f6896f03018d3f6e2b7e5e95).
- Actual 1440/320 CSS-pixel isolated browser checks passed: three s01 states, recovery before/after, identical success for different logins, empty error icon/role, show/hide, retained login, password clearing, normal and approval paths to s09, logout/reset and scenario clearing, dyspozytor account, s02–s04 annotations/return links. Exact Tab sequence passed at both widths. No horizontal overflow in checked states. Browser resize minimum is 500 px, so 320 was explicitly emulated and innerWidth asserted.
- Built static preview smoke passed at both widths. Dev console clean; temporary static server only reports favicon 404, no application runtime error. Eight external captures saved. Preview index/assets replaced; prior evidence preserved.
- Not run: production app build/integration/coverage, Storybook tests, cross-browser matrix, exhaustive accessibility audit or Stage 2. No production specification marked implemented.
