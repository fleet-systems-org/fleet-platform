# Dropdown confirmation accessibility flake

Status: implemented and locally verified; pull request pending owner review.

Agent: Codex (Cezar run d6f83e71). Starting commit: b7879b3, branch fix/dropdown-confirmation-a11y-flake (created from origin/main).

## Objective and authority
Repair OpensConfirmation without disabling accessibility checks. Owner authorization: 2026-10-29. Baseline: origin/main. Requirements: design-system-decisions (T7/Q5b), engineering standards, existing overlay focus lesson. No new domain specification is needed for this test repair.

## Plan
1. Reproduce the isolated story repeatedly, including CPU load; inspect focus and aria-hidden lifecycle.
2. Apply the smallest correction justified by that evidence.
3. Repeat the same experiment, run Storybook/typecheck/lint/100% coverage, inspect the diff.
4. Record both incidents (#56 and #57, CI 40933854727), findings and remaining limitations; open a PR without merging.

## Verification
Baseline isolated story: 0 failures / 30 attempts (15 normal, 15 pinned to CPUs 0,1 with one busy Python process on those CPUs). Command: `pnpm --filter @fleet-platform/ui exec vitest run --config vitest.storybook.config.ts stories/primitives/dropdown-menu.stories.tsx -t "Menu item opens a confirmation"`, per-attempt timeout 90 s. Logs: temporary `/tmp/dropdown-before/`. No source changes during these attempts. Full-suite reproduction and browser lifecycle investigation ongoing.

### Reproduction breakthrough

The initial isolated loop passed 30/30; eleven full suites passed 128/128 each. A temporary story file copied the unchanged OpensConfirmation and exported 150 named copies to exercise consecutive lifecycles in one Chromium session: **1/150 failed**, Trial 18, with the identical `aria-hidden-focus` violation on `div[data-aria-hidden="true"][aria-hidden="true"]:nth-child(6)`. Source and log retained temporarily outside the repository. Lifecycle instrumentation follows before selecting a fix.

### Observed cause and change

Instrumented repetition: **1/150 failed**, Trial 41. The captured sequence was `menu=open / dialog=open / focus=alert-dialog-cancel` → `menu=closed / dialog=open` → `menu=closed / dialog absent / focus=BODY` → `menu=closed / focus=dropdown-menu-trigger / hiddenFocus=true` → `play-end` with the same hidden focus. The story canvas remained hidden throughout. The identical nth-child(6) axe failure followed.

`queryByRole("menu")` excluded the closed hidden menu. Its retained Radix Presence node still owned the `hideOthers` effect, even though the dialog had unmounted and returned focus. The story was acting and finishing before the transition settled. The installed Radix Menu effect cleans `hideOthers` on unmount; FocusScope separately schedules focus restoration. No source-component change was needed to establish the intended settled interaction.

Changed only OpensConfirmation: wait for `queryByRole("menu", { hidden: true })` to return null and Cancel to receive focus before clicking it; after clicking, wait for dialog removal, returned focus and no aria-hidden ancestor of that focus. No sleeps, retry configuration, rule suppression or threshold changes.

### Repeated-story harness

To reproduce many independent executions without repeatedly starting Chromium, create a temporary sibling story file by copying the original dropdown story through the end of `OpensConfirmation` (before `export const Keyboard:`), change its meta title to `Diagnostics/Dropdown confirmation`, then append 150 named exports:

```js
Array.from({ length: 150 }, (_, i) =>
  `export const Trial${i}: Story = { ...OpensConfirmation, name: "Trial ${i}" };`
).join("\n")
```

Run `timeout 240 pnpm --filter @fleet-platform/ui exec vitest run --config vitest.storybook.config.ts stories/primitives/dropdown-confirmation-diagnostic.stories.tsx -t Trial`. Before and after use the same 150 copies and command; only OpensConfirmation's fix differs. `-t Trial` selects the 150 repetitions; three other copied stories are filtered out, not marked skipped in source. Remove the temporary file afterwards (done). For diagnostics only, add a MutationObserver on body (`childList`, subtree and attributes `aria-hidden`/`data-state`) and a focusin listener around play, recording menu/dialog data-state, focused data-slot, canvas hidden state and `activeElement.closest('[aria-hidden="true"]')`; log the synchronous snapshot at play end and remove both observers. This extra instrumentation is not part of the before/after harness or the committed change.

After fix: **0/150 failures** in the same uninstrumented repeated-story harness. The 30-process after-fix loop finished: 29 successful executions and one iframe initialization failure before any test ran. One separately logged normal execution passed, yielding **0 failures / 30 executed stories** (15 normal, 15 under the same CPU load) across 31 launches.

### Checks so far

- `pnpm typecheck`: passed.
- `pnpm test:coverage`: 198 tests passed; statements 570/570, branches 421/421, functions 175/175, lines 481/481, all 100%.
- `pnpm test:storybook`: 128/128 passed after removing the temporary harness.
- `pnpm lint`: passed.
- `pnpm build`: passed.
- `git diff --check`: passed; final diff inspection pending documentation completion.
- Additional `pnpm test:integration`: 5/5 passed with the external ARM64 Chromium executable and `TMPDIR=/tmp`; all five screenshot artifacts were written. Initial unconfigured environment failures are recorded below.

### Environment failures (not omitted)

The after-fix 30-process loop's launch 13 did not execute any story: Vitest reported "The iframe ... did not become ready within 60000ms", `Tests no tests`, exit 1. It is an infrastructure initialization failure, not a passing test or an axe/interaction failure. The loop continued without automatic retries; one separate extra normal execution passed and replaced this missing observation in the count of executed stories.

Additional integration attempts: plain `pnpm test:integration` failed because agent-browser could not locate Chrome on ARM64. Supplying the existing Playwright Chromium path then exposed Cezar's long TMPDIR: Chromium reported "Socket path too long" for SingletonSocket and exited before loading pages. Both runs failed 5 tests due to browser startup; no product assertion was exercised. Re-running with a short external TMPDIR and explicit local executable path; no machine paths or environment changes added to product configuration. The five failed-start agent-browser daemons from this worktree were stopped by their recorded PIDs.


## Final outcome

Final diff reviewed: one story play function, the lesson index, the requested new lesson and this run log. No component behavior, dependencies, accessibility-rule configuration or coverage thresholds changed. No specification status was moved: this repairs an existing test under the active design-system decisions, not a new specification implementation.

All requested local checks passed. Additional configured integration passed 5/5, with five screenshots. No persistent diagnostic servers or CPU-load processes remain. No manual assistive-technology audit was performed; local ARM64 results do not replace the separate PR CI. Owner review and merge remain; this run never merges into main.
