# Engineering contracts implementation

- Objective: continue implementing the approved engineering standard in code, preserving the existing uncommitted API/UI foundations.
- Agent: Codex; agents VPS; branch main; starting commit cde35e3273b4986a30318589c1351abc706803b3.
- Requirements: engineering standard sections 5 (pure error contracts), 9 (validated exact decimal strings), 11 (typed error mapping) and 13 (safe diagnostic codes and correlation IDs); AGENTS.md and the lessons index, including previous scope corrections, apply.
- Plan: add framework-independent application errors and decimal-string validation; integrate application errors and sanitized unexpected-failure reporting at the HTTP boundary; add behavior tests, run checks and update adoption evidence.
- Assumptions: no business model, authentication technology, financial precision/rounding policy or event bus is approved by this task. A lexical decimal validator preserves strings without calculating or rounding. Error contracts contain fixed public codes/message keys, not arbitrary private exception messages.
- Existing work: retain all previous edits; no commit, push or PR.
- Implemented: ApplicationError and fixed public code union in core; decimalStringSchema preserving canonical string input; package subpath exports; API status/message mapping; unexpected-error logging restricted to a constant code and correlation ID. The CRUD synthetic fixture now consumes the common decimal schema.
- Validation passed: pnpm test (63 tests across 7 files), pnpm typecheck (all four packages), pnpm lint, pnpm build and git diff --check. Inspected new source/tests and the package export diff. The 29 new cases cover decimal preservation/refusal, all five typed errors and private-detail-free diagnostics.
- Not run: PostgreSQL integration and browser checks; this change adds no SQL mapping, business data, visible page or ORM entity. Existing SQL guarantees are not inferred from synthetic service tests.
- Outcome: current infrastructure adoption additionally implements the pure contracts and diagnostic boundary required by sections 5, 9, 11 and 13. Updated the standard's implementation map and README. No precision/rounding policy, production authentication or business feature was invented. No commit, push or PR.
- Remaining: feature-specific requirements explicitly deferred by the standard remain part of future approved feature implementations. The living engineering standard stays at its owner-requested stable path.
