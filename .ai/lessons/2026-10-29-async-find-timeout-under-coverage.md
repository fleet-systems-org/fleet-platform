# Passive effects can still be pending when `findBy…` resolves

Status: verified finding, 2026-10-29. Corrects the first version of this lesson, which attributed the failures to slow coverage runs and raised two query timeouts to 5 s. That raise did not fix anything and has been removed.

## Context

The unit test "CrudForm validates before submit and preserves an exact decimal string" (`packages/ui/src/backend/forms/CrudForm.test.tsx`) failed intermittently in the `pnpm test:coverage` CI job:

| Pull request | Run (attempt) | Failing test duration | Error |
| --- | --- | --- | --- |
| #41 | 40894819099 (1) | 1275 ms | Unable to find "Saved" |
| #43 | 40903738858 (1) | 1297 ms | Unable to find "Saved" |
| #53 | 40917768054 (1) | 5011 ms | Test timed out in 5000ms |

In #53 the test "protects dirty input on browser unload and clears the guard after save" also failed (`expect(savedUnload.defaultPrevented).toBe(false)`).

## Cause

The test was not slow. Every other test in the file took 5–79 ms in those runs, and each failure lasted exactly the query timeout plus about 280 ms of first-render setup (1000 ms default in #41 and #43, 5000 ms after the raise in #53). "Saved" never appeared.

The rejected submit renders the field error outside `act`, because Testing Library turns the act environment off while `findBy…` waits. The query resolves as soon as the error text reaches the DOM. The `useEffect` that moves focus to the invalid field is a passive effect and can still be pending at that moment. The next `fireEvent.change` makes React flush it first. The resulting focus event arrives in the middle of change handling, React restores the controlled value `invalid`, the edit is lost, and the second submit fails validation again. Instrumented runs showed this in every failure: `document.activeElement` was `BODY` before the change, the input received focus with the new value, and the value read `invalid` straight after `fireEvent.change`. In passing runs focus was already on the input.

The second test fails the same way: `findByText("Saved")` resolves before the passive effect cleanup that removes the `beforeunload` guard, so the dispatched event is still prevented. It fails independently, not only as a knock-on.

No user can hit this. A person cannot type in the gap before a passive effect runs, and typing starts with focusing the field.

## Resolution

- The first test waits until focus has moved to the invalid field (`await waitFor(() => expect(document.activeElement).toBe(amount))`) before editing it. This mirrors real use and also asserts the focus behaviour.
- The second test checks the cleared guard inside `waitFor`.
- Both `findBy…` queries are back on the default timeout; no limits were raised.

## Verification

Same machine, `CrudForm.test.tsx` only. Under load means six copies in parallel. Single core with coverage means `taskset -c 0` with `--coverage`.

| Condition | Before (failed runs) | After (failed runs) | After: test duration median (max) |
| --- | --- | --- | --- |
| Under load | 3/36 first test, 1/36 second test | 0/48 | 282 ms (343 ms) |
| Single core with coverage | 3/12 first test | 0/12 | 423 ms (444 ms) |

Before the fix every failure of the first test took 5012–5029 ms. The full `pnpm test:coverage` (190 tests, 100% statements, branches, functions and lines), `pnpm lint` and `pnpm typecheck` pass.

## Prevention

- When `findBy…` or `waitFor` resolves on a DOM change, effects of that render may not have run yet. Before acting on behaviour that a `useEffect` sets up or cleans up (focus, listeners, subscriptions), wait for that behaviour itself with `waitFor`.
- A test that fails at exactly its query timeout is waiting for something that never happens. Find out why; do not raise the timeout.

## Second case: focus and aria-hidden after an overlay closes (2026-10-29)

Context: the story test "Dropdown menu / Menu item opens a confirmation" failed on the first attempt of 7 of 13 CI runs between the N2b change (#56) and this fix (#53, #56, #58 and a documentation branch), always with axe `aria-hidden-focus` on a region containing the menu button; re-runs passed. It did not fail before #56, and it could not be reproduced locally (40 runs of the story under load, 12 runs of its file, 7 full suites on two cores).

Cause (inferred from the Radix sources; not reproduced): when an overlay closes, Radix returns focus to the trigger in a `setTimeout` and lifts `aria-hidden` from the rest of the page in effect cleanups of the menu and the dialog. The story waited only for the button to have focus and then ended; the axe check that runs after every story can see the button still inside an `aria-hidden` region. The changed font loading of #56 plausibly shifted the timing in CI. The same shape appears in four more overlay stories: Alert dialog, Dialog, Popover and Select asserted `toHaveFocus()` without waiting right after the overlay left the DOM, and some ended there.

Resolution: `packages/ui/.storybook/overlay.ts` adds `waitForFocusReturn(trigger)`, which waits until the trigger has focus and is no longer inside an `aria-hidden` region. It replaces the bare focus checks after closing an overlay in the Dropdown menu, Alert dialog, Dialog, Popover and Select stories and closes the play functions that end with an overlay closing. No timeout, retry or axe rule was changed.

Verification: on pull request #60 the Storybook CI job passed 6 of 6 attempts (run 40938976132), against 7 failures in 13 first attempts before; at that rate six passes in a row would happen about once in a hundred. Locally lint, typecheck and three full Storybook runs on two cores passed (128/128).

Prevention (extends the rule above): after an overlay closes, wait for the behaviour its effects and timeouts restore (focus on the trigger, no `aria-hidden` around it) before asserting, acting or ending a story; use `waitForFocusReturn`.
