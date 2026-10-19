# Lessons learned

Index of reusable findings, bug fixes and improvements. Read relevant entries before working. Follow AGENTS.md for recording and maintaining lessons.

- [Scope test discovery to product packages](lessons/2026-10-19-scope-test-discovery.md): explicitly configure test discovery rather than relying on Git ignore rules.
- [Cancellation while reading API responses](lessons/2026-10-19-api-response-cancellation.md): distinguish aborted body reads from malformed responses in the shared client.

- [Next.js build type-checks application tests](lessons/2026-10-19-next-build-typechecks-tests.md): run typecheck after writing tests; Vitest alone does not catch type errors that fail the build.

- [Foundation verification is not specification completion](lessons/2026-10-19-foundation-versus-spec-completion.md): map requirements to implemented behavior and evidence before declaring the overall specification complete.

- [Check local services before assuming they are unavailable](lessons/2026-10-19-check-local-services-before-assuming-unavailable.md): identify the port owner and try `sg docker` before planning around a missing database or Docker.
