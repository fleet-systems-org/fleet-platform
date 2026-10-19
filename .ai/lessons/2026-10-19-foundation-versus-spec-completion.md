# Foundation verification is not specification completion

- Context: the owner requested implementation of the engineering standard and corrected a response that closed the request after rechecking existing API/UI foundations.
- Cause: an existing adoption record and passing tests for implemented helpers were treated as sufficient evidence for a broader requirement set. The referenced PR had not been checked before reporting status.
- Resolution: explicitly mark the standard as partially implemented and distinguish implemented requirements, missing implementation and requirements awaiting domain decisions. Check repository/PR state before making publication claims.
- Verification: compared specification sections 7–14 and 18 with current package files; production identity, tenant SQL persistence, evidence/domain logic and adapter integrations are absent. Current 34 tests cover existing foundations, not those missing capabilities.
- Prevention proposal: assess completion against a requirement-to-code-and-evidence map; successful existing tests alone cannot establish completeness. This is a finding, not a new standing process rule.

## Scope clarification from the course

- The next owner clarification identified the screenshot as the specification, not a PR. Read the Coding Standards lesson before extrapolating its implementation scope. Its adoption step changes agent instructions, structure and reusable infrastructure; it does not require building every future business capability mentioned in the standard.
- The earlier response overcorrected by presenting future authentication/domain/integration work as missing adoption work. Both “the tests pass, therefore the whole spec is done” and “all future capabilities must exist before standards are adopted” conflate different scopes.
- Verified resolution: inspected lesson 02 recording 06 and the trainer migration instructions from the course repository after fetch. Added a requirement/implementation/verification map to the standard, and implemented the missing static package-boundary checks. The owner does not need to identify a PR for this task.
