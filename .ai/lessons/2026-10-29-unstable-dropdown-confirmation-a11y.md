# Dropdown confirmation: hidden role queries do not prove unmount

Status: verified finding, 2026-10-29.

## Context

The Storybook story `OpensConfirmation` ("Menu item opens a confirmation") intermittently failed axe's `aria-hidden-focus` check:

- PR #56: the first Storybook CI attempt failed; a rerun passed.
- Documentation-only PR #57: attempts 1 and 2 failed, attempt 3 passed (run 40933854727). Earlier runs of the same PR passed.

A rerun did not establish a repair. The existing overlay lesson covered fade-in and focus restoration, but did not account for a closed menu still mounted by Radix Presence.

## Cause (observed)

The story immediately checked `queryByRole("menu")` after opening the confirmation. Default role queries exclude hidden content. In the failing run the closed menu remained mounted, with `data-state="closed"`; it still owned the `hideOthers` effect that applied `aria-hidden` to the story's container.

The test then clicked Cancel and waited only for the trigger to receive focus. The dialog unmounted and restored focus while the closed menu was still present. The play function ended with the trigger inside an `aria-hidden="true"` subtree, so the addon's subsequent whole-page axe scan correctly reported a violation.

Instrumented browser sequence in a failing repetition:

1. Menu open, focus on its content and then its item; story container hidden.
2. Dialog open, focus on Cancel; menu changes to closed but remains mounted.
3. Dialog removed; focus briefly on body, then on the menu trigger.
4. Play ends: menu still closed and mounted; trigger focused; its ancestor still aria-hidden.

Installed Radix Presence can retain an animating closed node until animation completion; its menu removes `hideOthers` on unmount, whereas focus restoration uses a separate scheduled callback. This timing makes the test's old role/focus assertions insufficient. This is a test that acts and completes during an unfinished overlay transition, not evidence that the settled dialog loses its focus trap. No component change is justified by the observed sequence.

## Resolution

Wait for the menu to disappear using a role query with `{ hidden: true }`, and for Cancel to have focus, before cancelling. After cancellation, wait for the dialog node to leave the document, the trigger to regain focus and its ancestor chain to be free of `aria-hidden="true"`. No fixed sleeps, retries, skipped tests, axe exceptions or threshold changes were added.

## Verification

- Original story in separate processes before the fix: 0/30 failures (15 normal, 15 with one busy CPU process and test affinity restricted to CPUs 0,1). Eleven full Storybook suites also passed 128/128.
- A temporary harness running 150 copies of the unchanged story in one Chromium session reproduced the exact axe violation: **1/150 failed**. An additional instrumented series also failed **1/150**, capturing the sequence above.
- The same uninstrumented 150-copy harness after the fix: **0/150 failures**. The harness was then removed.
- Separate-process verification after the fix: **0 failures in 30 executed stories**, 15 normal and 15 under the same CPU load. This required 31 launches: one launch failed iframe initialization before executing any tests; a separately logged extra normal execution passed. This infrastructure failure is retained in the run log, not counted as a passing story.
- Full `pnpm test:storybook`: 128/128; `pnpm typecheck`, `pnpm lint`, `pnpm build` and diff checks passed. `pnpm test:coverage`: 198 tests passed with 100% statements, branches, functions and lines. Configured local integration: 5/5 with five screenshot artifacts. Initial browser environment failures are recorded in the run log.

Reproduction commands and the temporary harness recipe are in the linked run log. Local results are from ARM64 Chromium; CI on the PR is separate evidence. No manual assistive-technology audit was performed.

## Prevention

Verified finding: a default role query returning null proves that an overlay is absent from the accessibility tree, not from the DOM. When subsequent behavior depends on unmount cleanup, assert actual removal (including hidden nodes) and the expected focus before taking the next action. Before the final axe scan, assert the settled focus and visibility of its ancestor chain.

Proposal, not a standing rule: use the temporary repeated-story harness described in the run log for future overlay lifecycle investigations. Do not automatically rerun failing CI as a substitute for diagnosis.

[Execution and verification](../runs/2026-10-29-dropdown-confirmation-a11y-flake.md).
