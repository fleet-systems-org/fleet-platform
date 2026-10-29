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
