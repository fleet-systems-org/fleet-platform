// After an overlay closes, Radix returns focus to its trigger in a timeout and lifts aria-hidden from the rest of the page
// in effect cleanups. Neither has happened yet when the overlay leaves the DOM, so a story that asserts focus, acts again
// or ends at that moment (the axe check runs next) races them. Wait for both.
import { expect, waitFor } from "storybook/test";

export async function waitForFocusReturn(trigger: HTMLElement) {
  await waitFor(() => {
    expect(trigger).toHaveFocus();
    expect(trigger.closest("[aria-hidden=true]")).toBeNull();
  });
}
