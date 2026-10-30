# UI agent rules

## Objective and authority

Document the owner-approved UI agent boundaries before prototype mockups: mockups compose shared components and report gaps instead of silently changing the design system. This is a documentation-only task authorized by the owner on 2026-10-29; no separate implementation specification is required or introduced.

## Starting state

- Agent: Codex, Cezar task 6c7caec2.
- Branch: `docs/ui-agent-rules`, created from `origin/main`.
- Starting commit: d53b126e4305de257a444953a05f8428933b40c2.
- No previous run log exists for this task.

## Sources

- Root `AGENTS.md`, `README.md`, `.ai/lessons.md` and both 2026-10-29 lesson entries (overlay visibility/focus and passive-effect timing).
- `.ai/specs/engineering-standards.md`, especially shared UI boundaries and exact values.
- `.ai/specs/design-system-decisions.md`, `packages/ui/POSTEP.md` and Storybook configuration.
- Root and UI package scripts; Open Mercato `packages/ui/AGENTS.md` and `CLAUDE.md` for structure only.

## Actions

- Added concise UI instructions with Always, Ask First, Never and Validation Commands.
- Added the one-line Claude import and one root Engineering standards link.
- Confirmed `DS GAP` is already recorded in UI stage progress; prototype paths are workflow locations and need not exist on main. The prototype progress file is created with the prototype.
- Kept all component, story, token and application sources unchanged.

## Validation

- Passed: all 3 Markdown links and the Claude import resolve; all 5 commands exist; UI rules are 37 lines; diff scope is exactly the 4 requested Markdown files; `git diff --check`.
- Failed (pre-existing): `pnpm lint:tokens` exits 1 with 12 text-role violations in the two unchanged app pages. Running the same checker against a clean archive of the starting main commit reproduces the same 12 violations. No token or source change was made.
- Not run: general lint (does not lint Markdown), Storybook tests/build, typecheck, unit coverage and integration tests (no executable or rendered UI changes).

## Outcome

Documentation verified within scope; pull request to main is the delivery. The pre-existing token lint failure is disclosed for owner review. Owner merges; this run does not merge.
