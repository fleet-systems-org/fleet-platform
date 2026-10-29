# Overlay stories: fade-in timing and focus return from a menu

Status: verified finding, 2026-10-29.

## Context

Stage 2 batch 3 of the design system added the 110 ms fade-in (`animate-overlay-in`, Q5b) to dialogs, menus, popovers, tooltips and the Select list, and the first story where a menu item opens an alert dialog.

## Cause

- A story test that asserts `toBeVisible()` right after `findByRole()` can run in the first frame of the fade, when the computed opacity is still 0, so it fails intermittently. The existing Select keyboard test failed this way, once on visibility and once because the arrow key arrived before the list was ready.
- An alert dialog opened from a dropdown menu item has no trigger of its own. When it closes, Radix returns focus to the element focused when it opened (the menu item, already removed), so focus falls to the page body instead of the menu button.

## Resolution

- Wait for an overlay to be fully shown before asserting visibility: `await waitFor(() => expect(element).toBeVisible())`. Before sending arrow keys, wait for the real readiness condition, the focused item (for Select, the chosen option has focus); visibility alone still failed two of three runs. Assert the animation itself once (`getComputedStyle(panel).animationDuration` is `0.11s`) instead of disabling it for all tests.
- Return focus by hand: keep a ref to the menu button and use `onCloseAutoFocus={event => { event.preventDefault(); menuButton.current?.focus(); }}` on the dialog content.

## Verification

`pnpm test:storybook`: 96 of 96 story tests passed in three consecutive runs; the story "Dropdown menu / Menu item opens a confirmation" checks that focus returns to the menu button.

## Prevention

Every new overlay story with a play function waits for visibility after opening; every dialog opened from a menu item returns focus in `onCloseAutoFocus`. Both rules are documented on the Dialog and Dropdown menu pages.
