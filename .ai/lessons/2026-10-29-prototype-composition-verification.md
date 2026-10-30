# Verify prototype composition at the rendered control

- Context: owner feedback on the standalone quotation prototype.
- Cause: DecimalField forwards className to its wrapper, so wrapper alignment does not override the nested input. A picker with local state also retained a selection when only the parent form was reset.
- Resolution: prototype-only wrapper-descendant selector for the approved alignment exception; reset the picker identity when starting a new entry. Shared UI code remains unchanged.
- Verification: package typecheck, source lint, exact-money assertions and browser walkthrough at real 1440/320 CSS-pixel viewports, including repeated reset, keyboard place selection and quote acceptance.
- Prevention finding: inspect computed styles and the rendered state after reset rather than inferring behaviour from class names. Browser tools may return failures as text; assert actual values and viewport width before marking a check passed.
- Supporting finding only; no standing rule or financial policy is added.

## Stage 1d: suggestions must not move the next action

- Context: at 320 px, clicking the next-step action while a place suggestion was open did not advance the form. The same action worked on the wider two-column layout.
- Cause: the suggestion list occupied document flow. Pointer-down moved focus to the action, blur removed the list, and the action moved before pointer-up.
- Resolution: anchor the existing customer/place suggestion lists over the following content, outside normal flow, without changing keyboard selection or the review engine.
- Verification: the two-width browser walkthrough clicks the action directly after focusing the place input, with its suggestions still open; it also exercises the full-place picker by keyboard.
- Prevention finding: retain the visible-suggestion-to-next-action regression when checking responsive forms; stable geometry is part of click correctness.

## Stage 1e: reviewed quote state and common frame

- Context: direct screen selection and reset exposed blank route fields on s13 beside the fixed K2 quotation; the summary appeared only on s12.
- Cause: a single route element read the editable entry, while each quotation screen composed its own surrounding layout.
- Resolution: keep the viewed quotation's stop snapshot separate from the editable entry, share the quotation frame across every step-4 screen, and reuse category rows in the exact-value evidence table.
- Verification: repeatable browser regression checks direct screen-picker entry and repeated reset; the two-width walkthrough also checks customer snapshots after entry edits, identical summary content, mobile ordering, category expansion and acceptance.
- Supporting finding only: name each panel's content for every affected screen in future work orders, and verify direct arrival as well as the sequential path. This does not add a standing process rule.

## Stage 1f: title and responsive reading order

The shared frame needs an explicit heading slot before its summary and detail slots: placing the heading inside detail leaves it after the route, while moving the whole detail first also moves the route ahead of the mobile summary. Verified the heading/summary/route coordinates at actual 1440/320 CSS pixels and retained h1 focus on screen navigation. Ordinary text now inherits shared weight 500; no prototype token override is required. Supporting finding only.


## Stage 1g: heading focus depends on navigation modality

The unchanged review engine focuses h1 after navigation for accessibility. Suppress only `h1[tabindex="-1"]:focus:not(:focus-visible)` in prototype styles; removing focus or every outline would break keyboard orientation. Verified actual pointer clicks and Tab/Enter navigation at 1440/320 CSS pixels: focus stays on h1, pointer outline is none and keyboard outline is solid. Supporting finding only; no standing rule added.

## Stage 1n: shared picker composition and native scenario controls

- A saved map address must replace the matching provider option by ID, with saved places first; concatenating both sources produced duplicate React keys after one-action save. Verified in the isolated browser with console error collection as well as pageerror collection.
- A native select does not consume Field's control context. Give the prototype-only scenario selector an explicit accessible name; verify getByLabel and keyboard selection rather than assuming a surrounding Field connects it.
- Browser iterations need a full reload/reset: navigating only to a hash can retain the previous step. Test the updated disclosure button name after opening Menu.
- Findings concern page composition/testing only; no shared component API or standing rule changed.

## Stage 1o: inherited table rules and shared value controls

- Existing page table selectors that changed every button's padding/height also changed newly composed ValueWithSource controls. Remove those selectors rather than styling component interiors.
- With fixed-layout tables, size the header cells: widths applied only to body cells do not reliably determine the column geometry. At 320 px, budget room for the estimate word and percentage, and keep forced word breaking on source text only; a zero-overflow assertion alone does not prove readable words/units.
- Verify both collapsed and expanded vehicle-category tables at 1440/1024/768/320. The independently rounded fixed vehicle fixture still totals 6.00 EUR, so the absence of a reconciliation line is valid; total equality alone does not prove that an allocation algorithm follows the independent rate-times-time formula.
- Verified by built-browser walkthrough, screenshot inspection and an independent Decimal arithmetic check. Supporting findings only; no standing rule or financial policy introduced.
