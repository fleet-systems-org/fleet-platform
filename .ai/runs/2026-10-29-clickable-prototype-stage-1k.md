# Clickable prototype — Stage 1k

## Objective and plan

Implement N7f fleet-of-twelve vehicle tiles on s09 step 1 only. Owner order authorizes this prototype refinement from origin/prototype/e01-clickable at 2076d00 (stage 1j publication). Read N7f and R21.1 from origin/docs/quote-route-groups (pending #57), stages 1i/1j, engineering standards, lessons index and relevant prototype/discovery lessons. Approved E01 remains unchanged; synthetic driver identities are a prototype proposal.

Plan: extend synthetic fixtures, compact responsive tiles and chronological sorting; retain native radios, existing Auto IDs and K2 gate; run requested checks and both-width browser walkthrough; publish preview/evidence, commit and normal push. No PR or merge.

## Validation

- Package typecheck and Vite build passed (578 ms; existing >500 KB chunk advisory).
- Repository typecheck, lint and unit tests passed: 38 files, 198 tests.
- Explicit prototype ESLint passed. Detector returned []. Token checker reports exactly eight unchanged N8a map colour declarations; a temporary source copy excluding only those declarations reports no values outside tokens. Private-name scan 0 in source and build.
- prototype.js is byte-identical to starting commit, SHA-256 1ce5c7507244ae8e4162541e44eab14b69976430f6896f03018d3f6e2b7e5e95. Protected packages/app, packages/ui/src and packages/ui/stories have 0 bytes of new diff. git diff --check passed.
- Isolated VPS Chrome, actual viewports 1440×900 and 320×900: 12 tiles; expected chronological IDs 10,04,06,01,05,08,12,03,07,11,02,09; 4/2 columns, 8 px grid gap, 8/12 px padding, 12 px availability, no horizontal overflow. All 12 pointer selections and non-Auto-01 Stage 2 notices passed at both widths. Arrows/Space, solid focus outline and complete happy path to s12 = 21.82 EUR passed at both widths.
- MCP cannot click clipped native inputs or save outside its workspace; Playwright connected to the same VPS browser exercised labels and wrote external screenshots. Verification script explicitly resets and selects s09 through the review selector; initial failed attempts were harness navigation/state issues, not passing evidence. No source workaround was added.
- Requested 1440-s09-auto.png and 320-s09-auto.png saved externally in the stage-1k preview folder and visually inspected. Built index/assets published to preview root without deleting earlier evidence.
- Not run: production build, coverage, integration, Storybook, cross-browser matrix. Approved production specifications unchanged; no new durable lesson or standing rule needed.

## Publication

- External preview and screenshots were kept outside the repository; client-side availability was not verified.
