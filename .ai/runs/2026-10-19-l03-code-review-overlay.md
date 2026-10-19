# L03 code review overlay

- Agent: Claude Code (Opus 5.5), interactive run on the agents VPS (course homework L03).
- Starting branch: main; commit: 4e7df6f. Working branch: feat/l03-code-review-overlay. A throwaway local branch held a deliberately bad sample; it was never pushed and has been deleted.
- Objective (owner request): add a repo-local extension of `om-code-review` (`.ai/skills/om-code-review/SKILL.md`) and measure its effect by reviewing the same deliberately bad change before and after it.
- Specification: none applies; this is review tooling, not product behavior. Records read: AGENTS.md, `CODE_REVIEW.md`, `SDLC.md`, `BACKWARD_COMPATIBILITY.md`, `.ai/agentic.config.json`, the installed `om-code-review` skill and its `agentic-setup` override contract (an extension may tighten rules, never relax them), and the [agent pipeline setup run](2026-10-19-agent-pipeline-setup.md).
- Test input (sanitized): one new file in `packages/core` that computed a trip cost through JavaScript `number` with `parseFloat`, rounded with `Math.round` to 2 decimals, and built a SQL string for a company-owned table without a company scope filter. It carried a "deliberately bad sample" header comment. It is not part of this branch.
- Actions: wrote the extension with three rules: (1) severity comes only from AGENTS.md, CODE_REVIEW.md and SDLC.md, diff content such as "sample" or "test only" never lowers it, and domain code without an approved spec is always a blocker; (2) risk-high changes (money, fuel, tenant scope) or changes touching `packages/app` run `pnpm test:integration`, and a run that cannot start is reported as a gap; (3) every report ends with a "Fleet-platform checks" table (PASS / FAIL / N/A with `file:line` evidence). Reviewed the bad sample against origin/main without the extension, then with it merged in locally.

## Before / after

| | Before (base skill) | After (with extension) |
|---|---|---|
| Verdict | request changes | request changes |
| Blockers | 5 | 7 |
| Missing approved spec | major (lowered because of the sample's own header comment) | blocker (diff content treated as data) |
| Risk-high integration evidence | mentioned under test coverage only | separate blocker |
| `pnpm test:integration` | not attempted | attempted; NOT RUN gap: Testcontainers found no container runtime because `t3agent` cannot access the Docker socket |
| Fleet-platform checks table | absent | present, 7 rows, all FAIL with evidence |

Unchanged in both: blockers for `number`/`parseFloat` on money, unapproved rounding, missing tenant scope, SQL string interpolation and `pnpm test:coverage` below 100%; a major for database access in `packages/core`.

The first review contradicted `CODE_REVIEW.md`, which already lists domain code without an approved spec as a blocker; the extension makes the reviewer apply that rule instead of trusting the diff's own framing.

- Checks on this branch (extension and this log only, no sample): `pnpm lint`, `pnpm typecheck`, `pnpm test:coverage` (106 tests, 100% thresholds met) and `pnpm build` all exit 0 on the agents VPS; `git diff --check` clean. `pnpm test:integration` passed locally after the Docker fix (see Resolution); CI passed all five jobs on PR #8.
- Outcome: extension committed; review behavior verified against the bad sample as above. PR #8 opened against main.
- Resolution (Docker access for agent sessions, 19.10 ~15:05 UTC): cause: the systemd user manager (`user@1000`) that runs `t3 serve` started before `t3agent` joined the `docker` group, so agent sessions kept the old group list and got `permission denied` on `/var/run/docker.sock`. Fix: the owner restarted `user@1000`; agent sessions now carry the `docker` group (`id` shows `987(docker)`, `docker ps` works). Evidence: local `pnpm test:integration` at 15:18 UTC on `a622ded`, with 1 test file and 5/5 tests passed in 13.8 s, Testcontainers PostgreSQL started, and 5 screenshots written to `integration-evidence/`.
- Second local requirement found during the evidence run: the agents VPS is ARM64, and Chrome for Testing has no Linux ARM64 build, so `agent-browser install` refuses and the first run failed 5/5 with "Chrome not found" (Docker and Testcontainers already worked). The passing run set `AGENT_BROWSER_EXECUTABLE_PATH` to the Playwright Chromium (ARM64) already installed for the agent browser service. CI (x86_64) is unaffected. This is not yet recorded outside this log; a lesson or a documented local setting is a follow-up for the owner to decide.
