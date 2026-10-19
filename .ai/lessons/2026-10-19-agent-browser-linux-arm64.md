# agent-browser needs a local Chromium on Linux ARM64

- Context: local `pnpm test:integration` on a Linux ARM64 host failed 5/5 with agent-browser "Chrome not found", although Testcontainers PostgreSQL and the application instance started.
- Cause: Chrome for Testing has no Linux ARM64 build, so `agent-browser install` cannot install a browser there. CI runs on x86_64 and is unaffected.
- Resolution: set `AGENT_BROWSER_EXECUTABLE_PATH` to a locally installed Chromium (for example Playwright's ARM64 Chromium). This is machine-specific setup and stays outside the repository; do not commit local browser paths.
- Verification: the PR #8 run log [2026-10-19-l03-code-review-overlay](../runs/2026-10-19-l03-code-review-overlay.md) records 5/5 local integration tests passing and 5 screenshots written to `integration-evidence/` after setting the variable.
- Related: agent sessions also need Docker socket access for Testcontainers. A service manager started before the user joined the `docker` group keeps the old group list until it restarts, so sessions it spawns get "permission denied" on the Docker socket. See also [Check local services before assuming they are unavailable](2026-10-19-check-local-services-before-assuming-unavailable.md).
- Prevention (proposal only, needs owner approval): an environment check at the start of agent runs that confirms `docker ps` works and that agent-browser can resolve a browser executable.
