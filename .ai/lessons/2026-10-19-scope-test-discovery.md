# Scope test discovery to product packages

- Context: initial monorepo verification.
- Cause: the default test discovery searched beyond the intended product packages.
- Resolution: explicitly include only packages/*/src/**/*.test.{ts,tsx} in the test configuration.
- Prevention: configure the test search boundary before the first run; Git ignore rules do not define a test runner's search scope.
- Verification: rerun collected only the product configuration suite; all 5 tests passed.
