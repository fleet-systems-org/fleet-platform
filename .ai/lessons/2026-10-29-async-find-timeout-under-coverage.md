# Async queries time out under coverage on CI runners

Status: verified finding, 2026-10-29.

## Context

The unit test "CrudForm validates before submit and preserves an exact decimal string" failed once in CI (pull request #41, first attempt of the unit tests job) and passed on retry.

## Cause

The job log shows the test took 1275 ms and failed with "Unable to find an element with the text: Saved". Testing Library's `findBy…` queries wait 1000 ms by default; validation and submit run asynchronously, and v8 coverage on a shared runner made the test slower than that limit. The component behaved correctly.

## Resolution

The two asynchronous queries of that test wait up to 5 s (`{ timeout: 5_000 }`). The test still fails fast when the text never appears for a real reason, because the query stops as soon as the text is found.

## Verification

`pnpm test:coverage`: 125 tests passed, 100% coverage; CI of the pull request that adds this lesson.

## Prevention

A unit test whose `findBy…` waits for several asynchronous steps (validation, submit, server response) gives that query an explicit timeout instead of relying on the 1 s default.
