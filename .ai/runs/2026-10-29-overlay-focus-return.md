# Overlay stories: wait for focus return and lifted aria-hidden

## Objective and authority

Fix the intermittent story test "Dropdown menu / Menu item opens a confirmation" (axe `aria-hidden-focus`), review all tests for the same race (an action or check right after a wait, before focus or effect cleanups have run), and add the second case to the lesson from #55. Owner request of 2026-10-29. Read AGENTS.md, .ai/lessons.md, the lessons on passive effects (#55) and overlay stories, and the CI logs of the failing runs.

Starting branch: fix/storybook-focus-race, from main 16ec278. Execution: coding assistant.

## Actions

- Counted first-attempt Storybook failures in the last 60 CI runs: 7 of 13 after #56 on this story; earlier failures were the Select story covered by the overlay lesson.
- Tried to reproduce locally: 40 runs of the story with a probe for an `aria-hidden` region around the focused button, 12 runs of its file under load, 7 full suites on two cores; no failure.
- Reviewed 20 places in 47 test and story files where an action follows a wait. CrudForm was fixed in #55; Place picker, Radio group and Tooltip do not depend on a pending effect or focus timeout. Dropdown menu, Alert dialog, Dialog, Popover and Select checked focus without waiting after an overlay closed, or ended there.
- Added `waitForFocusReturn` in `packages/ui/.storybook/overlay.ts` and used it in those five story files; extended the lesson and its index entry.

## Validation and outcome

- Passed locally: pnpm lint, pnpm typecheck, token check, three full Storybook test runs on two cores (128/128 each).
- CI (#60, run 40938976132): all seven jobs passed; the Storybook job then passed five re-runs, 6 of 6 in total, against 7 failures in 13 first attempts before the fix.

Outcome: fix complete; merge is the owner's decision.
