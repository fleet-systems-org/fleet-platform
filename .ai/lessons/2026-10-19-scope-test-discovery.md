# Scope test discovery to product packages

- Context: initial monorepo verification.
- Cause: the default test discovery searched beyond the intended product packages.
- Resolution: explicitly include only packages/*/src/**/*.test.{ts,tsx} in the test configuration.
- Prevention: configure the test search boundary before the first run; Git ignore rules do not define a test runner's search scope.
- Verification: rerun collected only the product configuration suite; all 5 tests passed.

## Generated prototype bundles and lint discovery (2026-10-29)

- Finding: ESLint's flat configuration does not automatically inherit Git ignore entries. Building a standalone prototype into Storybook's public directory made `pnpm lint` scan bundled third-party JavaScript and fail, even though the bundle was git-ignored.
- Resolution: ignore only the generated `**/.storybook/public/prototypes/**` directory in ESLint. Keep source checks enabled; explicitly lint the new prototype source as well.
- Verification: build the prototype and Storybook, then run repository lint and explicit prototype-source lint. Both passed. This extends the existing discovery finding, not a new standing rule.

## Token discovery after prototype publication (2026-10-30)

- Finding: the UI token gate also recursively entered the generated prototype bundle under Storybook public assets. It reported bundled vendor values instead of source violations.
- Resolution: skip only the exact generated prototype output subtree, including explicit targets inside it. Keep UI source, stories and Storybook configuration scanning enabled; check prototype source separately and report the approved N8a map exception explicitly.
- Verification: after building Storybook, the UI source/configuration scan has zero findings; the prototype scan retains exactly the eight approved map-colour findings. No product-source coverage exclusion or threshold changed.
