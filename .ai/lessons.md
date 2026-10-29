# Lessons learned

Index of reusable findings, bug fixes and improvements. Read relevant entries before working. Follow AGENTS.md for recording and maintaining lessons.

- [Scope test discovery to product packages](lessons/2026-10-19-scope-test-discovery.md): explicitly configure test discovery rather than relying on Git ignore rules.
- [Cancellation while reading API responses](lessons/2026-10-19-api-response-cancellation.md): distinguish aborted body reads from malformed responses in the shared client.

- [Next.js build type-checks application tests](lessons/2026-10-19-next-build-typechecks-tests.md): run typecheck after writing tests; Vitest alone does not catch type errors that fail the build.

- [Foundation verification is not specification completion](lessons/2026-10-19-foundation-versus-spec-completion.md): map requirements to implemented behavior and evidence before declaring the overall specification complete.

- [Check local services before assuming they are unavailable](lessons/2026-10-19-check-local-services-before-assuming-unavailable.md): identify the port owner and try `sg docker` before planning around a missing database or Docker.

- [agent-browser needs a local Chromium on Linux ARM64](lessons/2026-10-19-agent-browser-linux-arm64.md): Chrome for Testing has no Linux ARM64 build; point `AGENT_BROWSER_EXECUTABLE_PATH` at a local Chromium outside the repository.

- [Source granularity and quote-entry effort](lessons/2026-10-26-source-granularity-and-quote-entry.md): owner-selected town matching and routed estimates preserve source semantics and phone-call usability without claiming measured completeness.

- [Overlay stories: fade-in timing and focus return from a menu](lessons/2026-10-29-overlay-stories-fade-and-focus.md): wait for an overlay to finish fading in before asserting or typing; return focus to the menu button when a menu item opens a dialog.
