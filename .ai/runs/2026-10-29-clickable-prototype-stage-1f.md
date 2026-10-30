# Clickable prototype — Stage 1f

Objective: owner-selected Stage 1e s12 baseline; title before route on s11/s12/s13/s16 and shared typography only.

Authority: owner assignment 2026-10-29, approved E01 specifications (remain unimplemented), prototype progress, engineering standards and prototype composition/back lessons.

Starting branch: prototype/e01-clickable at f8c62cf; merged origin/main for N2b. Agent: Codex.

Plan: move heading into shared frame before summary/route, remove local weight override/import, verify package/repository checks, browser at 1440/320, publish preview and normal branch push. No PR or base merge.

## Validation and outcome

Passed: prototype typecheck/build; pnpm typecheck; pnpm lint; pnpm test (37 files, 196 tests); prototype ESLint; token scan over src/app and src/main.tsx (0); mechanical detector (0); git diff --check; prototype.js byte comparison to f8c62cf; protected-source diff to origin/main empty.

Built preview browser: actual 1440/320 CSS pixels, s11/s12 draft/s12 accepted/s13/s16. Title precedes route, mobile title precedes summary, body computed 500 and h1 600, h1 focus retained on screen navigation. Ten screenshots saved outside Git, preview index/assets replaced. First resize attempt produced 500 px (Chrome window minimum), so repeated all mobile captures with viewport emulation and asserted innerWidth=320. MCP screenshot path restrictions required copying returned image bytes into the external evidence folder.

Out-of-scope observation: after acceptance the confirmation dialog leaves focus on body; subsequent screen navigation targets h1. No dialog or engine changes were made.

Cockpit wrote an autosave commit reversing the main merge while its correct contents remained staged. Restored the staged main contents in a separate commit without rewriting history; protected source matches main.

Not run: production build/integration/coverage, Storybook tests, full accessibility audit. No production code or specification requirements changed.

- External preview and screenshots were kept outside the repository; client-side availability was not verified.

Outcome: Stage 1f implemented and verified, ready for owner review. Next: owner review of this stage; Stage 2 requires separate authorization. The dialog-focus observation is a possible follow-up, not an additional change in this stage.

