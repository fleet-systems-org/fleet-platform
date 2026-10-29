# Verify prototype composition at the rendered control

- Context: owner feedback on the standalone quotation prototype.
- Cause: DecimalField forwards className to its wrapper, so wrapper alignment does not override the nested input. A picker with local state also retained a selection when only the parent form was reset.
- Resolution: prototype-only wrapper-descendant selector for the approved alignment exception; reset the picker identity when starting a new entry. Shared UI code remains unchanged.
- Verification: package typecheck, source lint, exact-money assertions and browser walkthrough at real 1440/320 CSS-pixel viewports, including repeated reset, keyboard place selection and quote acceptance.
- Prevention finding: inspect computed styles and the rendered state after reset rather than inferring behaviour from class names. Browser tools may return failures as text; assert actual values and viewport width before marking a check passed.
- Supporting finding only; no standing rule or financial policy is added.
