# Clickable prototype — Stage 1j

Status: complete; waiting for owner review. Agent: Codex. Starting branch: prototype/e01-clickable at 0823e9d.

## Authority and plan

Owner order and N8a from origin/docs/quote-route-groups (PR #57); stages 1h/1i; lessons index and test-discovery lesson; engineering standards. This is a decorative prototype correction, not production implementation. Production specifications remain unchanged.

1. Port reference Mercator geometry, road graph and twelve fictional route definitions; reproduce static light layers, perspective and fades.
2. Preserve form, states, engine and protected production sources. Keep eight non-token map colours in one CSS block under the approved N8a exception.
3. Run requested checks, inspect 1440/1920/320 browser captures, publish preview and comparison externally, document and push normally. No PR or merge.

## Verification

Checks completed as recorded below.

- Package typecheck/build and explicit prototype ESLint passed. Vite build 612 ms; existing bundle-size advisory (>500 KB), no build failure.
- Repository typecheck/lint/test passed: 38 files, 198 tests.
- Token checker exited 1 with exactly eight oklch colour-function findings, all in the single --map-* block carrying “N8a: owner-approved exception to R08.5”. This is the explicitly approved exception, not disabled checking or a claim of zero findings. Mechanical detector returned [].
- Generated data 243,088 bytes; twelve original fictional route definitions; 115 land polygons and 5,207 road chains. Public-domain source/license header included.
- SignIn form/state source and form/mobile CSS byte-identical to 0823e9d; prototype.js SHA-256 1ce5c7507244ae8e4162541e44eab14b69976430f6896f03018d3f6e2b7e5e95 unchanged. Protected sources have no new diff. Private-name scan 0; git diff --check passed.
- Browser uses the isolated VPS browser via DevTools. Actual viewports 1440×900 / 1920×1080 / 320×900, no horizontal overflow. Desktop map panels 720×900 and 960×1080; mobile map display none; SVG animate count 0. Static reference composition inspected visually: land, roads, twelve routes, twin light colours, glow and top/bottom fades, no artificial edge.
- Evidence-only browser CSS hides review toolbar/back control and removes review-page padding; no shipped source altered for captures. Initial MCP file-path restrictions worked around by Playwright connected to the same browser; initial 500 px clamp and incorrect presentation toggle corrected before final captures.
- Four final PNGs in external stage evidence folder, including reference | prototype comparison. Preview index/assets replaced, old evidence preserved.
- Not run: production build/coverage/integration, Storybook, cross-browser matrix or exhaustive accessibility audit. Production specifications unchanged. No PR opened or merge.
- T3 context reader reports no measurement for this Cezar session; no percentage inferred.

## Publication

- External preview and screenshots were kept outside the repository; client-side availability was not verified.
