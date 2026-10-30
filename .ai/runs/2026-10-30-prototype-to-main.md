# Publish the clickable E01 prototype through Storybook

- Objective: owner-approved P1, publish the prototype on a new branch stacked on #62; open a PR without merging.
- Agent: Codex.
- Starting branch: prototype/e01-clickable; rebased its prototype commits onto design-system-e01-screens-1 at 635d621. The source branch is unchanged.
- Authority: owner order P1/D1, approved E01 foundations and trip-entry/quotation specifications, engineering standards, UI decisions and progress. Production specifications remain approved and unimplemented: this is a synthetic prototype.
- Findings applied: scoped test discovery, prototype composition verification, back-control and route-scale verification.
- Plan: rebase and sanitize inherited documentation/history; wire prototype build; add built-site browser smoke test and CI screenshots; run gates; inspect diff; open stacked PR.

## Actions

- Preserved #62's UI progress and current async-test lesson during rebase. Shared UI sources and stories are unchanged from #62.
- Sanitized private publication details in prototype history and reports. Fixtures remain synthetic.
- Storybook build first builds the prototype. Generated output stays ignored.
- Added desktop/mobile browser checks against the built prototype index, including page/console/network failures and screenshots in integration-evidence. CI runs these in the existing integration job.
- Stage 4 and G08 sorting remain separate work.

## Validation

Passed:

- Frozen-lockfile install.
- `pnpm lint` and explicit prototype-source ESLint; repeated repository lint after the final changes.
- `pnpm typecheck`, repeated with browser test sources included.
- `pnpm test:coverage`: 41 files, 202 tests; statements 580/580, branches 459/459, functions 184/184, lines 491/491, all 100%. No coverage exclusions or threshold changes.
- Exact prototype cost assertions: fixture shares, nine vehicle categories, zero denominator, half-up rounding, beyond-safe-integer values and whole-trip country shares.
- `pnpm test:storybook`: 26 files, 143 tests (interaction, axe and WCAG text spacing).
- UI token scan after build: zero findings. Prototype source scan: exactly eight unchanged decorative map colours, approved under N8a; no other findings. The review engine remains separate from product token checks.
- `pnpm build-storybook`: builds the prototype first, then Storybook successfully. The generated prototype index is git-ignored.
- `pnpm --filter @fleet-platform/ui test:prototype`: 2 browser tests at 1440/320 px; index HTTP 200, visible synthetic sign-in, direct s13 navigation and two resets retaining the K2 route and 21.82 EUR result; no page, console or failed-request errors. Four screenshots saved under integration-evidence; desktop details and mobile sign-in visually inspected.
- Application production build passed. Application integration: 5/5 tests with Testcontainers PostgreSQL and agent-browser after configuring the installed browser executable externally.
- Entire diff against main inspected; shared UI sources/stories have no delta against #62. Private-reference scan across all 32 prototype commit revisions and messages: zero flagged revisions. Current fixtures and public-domain map attribution inspected. Source prototype branch unchanged.
- `git diff --check` passed.

Recovered local verification failures: an overlong temporary socket path for tsx (used a short temporary directory); an occupied smoke-test port (selected a free dedicated port, still refusing server reuse); missing browser auto-discovery on the local ARM64 host (used the existing documented executable override). The legacy route helper is a browser expression, not a Node test; the new browser suite covers its direct-entry/reset regression with current component selectors and fixture labels.

Not claimed: production E01 implementation, provider/authentication integration, exhaustive cross-browser verification or remote CI success before its checks complete.

## Outcome

Ready for a stacked pull request on design-system-e01-screens-1 (#62), without changing #62/#63 or merging. G08 remains open: DataTable has no sorting API. Stage 4 teaching pages and the E01 epic page are separate follow-up work. Production specification statuses remain unchanged.
