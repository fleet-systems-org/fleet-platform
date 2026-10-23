# Four-gate autonomous merging for fuel-port pull requests

Status: Draft — design only; owner approval required before implementation.

## 📝 TLDR
The owner wants incremental ports of fuel calculations and the driver report to merge without a person operating every merge. This proposal permits autonomous squash-merging only for eligible port PRs after four mandatory gates; protected changes remain owner-only.

## Open Questions
- Q1. Where will PostgreSQL containing historical comparison data run, and who operates, backs up and grants access to it? Owner decision; no autonomous answer.
- Q2. What is the data bridge from the Python collectors, including format, refresh, completeness and responsible operator? Owner decision; no autonomous answer.

## 📝 Problem Statement
Incremental porting needs repeatable verification without exposing historical customer data or weakening existing review and QA requirements.

## 📝 Proposed Solution
A scheduled VPS controller reuses the existing pipeline and merge skills, while an owner-side worker verifies equivalence on the Mac mini. Missing evidence blocks merging.

## Owner mandate and scope

Source: [owner brief](briefs/2026-10-23-auto-merge-port.md), T3 discussion, 2026-10-23. The owner said: "I don't want to be the only one merging; build a mechanism you control yourself" [PL: „nie chciałbym, żebym scalał tylko ja, tylko żeby był jakiś mechanizm, który ty sam sobie kontrolujesz”]. The selected option was "four gates" [PL: „4 bramki”].

This is a proposed, narrow exception to the existing owner-only merge instruction. Adoption of this draft does not enable automation. A separate approved implementation and owner-authorized activation are required. All non-port PRs and protected port PRs remain owner-only. This design PR itself is not eligible for automatic merging.

The port source is `fleet-systems-org/paliwo-material`; the owner estimates approximately 1,700 lines in the initial driver-report core. This estimate is supplied context, not a source-code audit. Port business semantics require their own approved specifications. This document authorizes neither business calculations nor a rounding policy.

Non-goals: implementing the port, collectors, database placement, a new merger, production deployment, storing customer data, changing installed global skills, changing CI or rulesets in this PR. No UI or application data model changes are proposed; no mockups or entity graph apply.

## Four mandatory gates

### 1. CI

Require successful current-head results for every required check, including the five names currently declared by `.github/workflows/ci.yml`: `Lint`, `Typecheck`, `Unit tests (100% coverage)`, `Build`, and `Integration tests (Testcontainers + agent-browser)`. Reconcile this list with actual branch rules at implementation and on every evaluation; additions are not silently ignored. Empty, partial, skipped, cancelled, missing, unreadable or pending results are not success. Inspect workflow runs as well as check runs so jobs not yet registered cannot appear green. Local tests cannot replace CI.

Keep 100% coverage and integration screenshot evidence requirements. Resolve merge conflicts and bring the head up to date with the current base before reevaluation. A new head invalidates prior review, QA and equivalence evidence.

### 2. Independent review

Run `om-auto-review-pr` with Claude Opus as reviewer; implementation is by Codex (Sol/Luna). Require an actual non-dismissed GitHub APPROVED review for the current SHA by a reviewer identity different from the PR author, plus trusted run provenance confirming the reviewer and model. A comment saying APPROVE, a `merge-queue` label or a different model using the author's GitHub identity is insufficient. Unresolved change requests or review conversations block merging.

The reviewer records whether the calculation method changes for every port PR, including an explicit unchanged-method verdict on the reviewed SHA. Method changes receive `zmiana-metody` and require owner merge even when historical outputs pass. Missing classification blocks automation. A trusted ledger retains the reviewer verdict: removing the label cannot erase a method-change finding. Clearing it requires a fresh independent review that explicitly supersedes the earlier verdict.

### 3. Historical real-data equivalence (port PRs only)

The Mac mini worker polls every five minutes for same-repository, open, non-draft PRs against `main` carrying `port`. It processes one pinned head at a time after independent review. It posts pending before comparison, then success or failure to the commit-status context `Equivalence on real data` using a dedicated GitHub App. Credentials stay in owner-managed local configuration, never in Git. Network/API failures retry on a later poll without assuming success; an offline Mac leaves the PR waiting indefinitely.

Run both pinned Python reference and candidate on the identical approved historical snapshot. Use a complete outer join on driver × month × metric, with internal stable driver identifiers kept locally. Require equal key sets and a non-empty, declared cohort and metric inventory covering the slice. Duplicate keys, missing periods/metrics, unexpected nulls, errors and incomplete input fail. Never compare only fleet totals: opposite individual errors must not cancel out.

For each supported metric compare exact decimal values after the owner-approved rounding policy: absolute difference must be at most `0.1` l/100 km for consumption and `0.01` PLN for money, inclusive. All other units need an explicitly approved comparator before that slice is eligible. Tolerances are not permission to change calculation methods. Use decimal.js and decimal strings throughout, with no conversion via JavaScript number. The owner must approve precision, rounding mode, rounding stages and output scales before the first comparison; record the policy version. This draft deliberately chooses none of those financial rules.

A local manifest binds repository/PR, head SHA, base SHA, Python reference commit, cohort/snapshot revision, metric inventory, comparison-tool revision and rounding-policy revision. Each new head, base, reference, snapshot or policy revision requires rerun. Default validity is 24 hours; expired evidence fails eligibility until refreshed. Local manifests and row-level diagnostic detail stay on the Mac mini. GitHub receives only status plus an allowlisted summary: tested head/base, non-sensitive policy/reference revisions, aggregate compared-cell count, mismatch count, missing/duplicate-key count, start/finish time and pass/fail. No person identifiers, registrations, per-person amounts, raw values, data fingerprints or local paths are published. Aggregate counts must not be broken down into identifying subgroups. Status descriptions are fixed text and never contain exception output.

Data must never enter the repository, GitHub Actions, GitHub logs or artifacts. The Mac mini must not run arbitrary PR install hooks or PR-defined commands with data or publisher credentials: the worker uses an owner-approved fixed runner, synthetic validation first, isolated candidate execution without network or credentials, read-only minimum input, and a separate credentialed publisher that emits only validated summary fields. If this separation cannot be enforced, fail closed and require manual handling. Approving a PR alone is not proof that arbitrary code is safe to execute against private data.

### 4. Protected areas and method changes

Propose a versioned `.ai/auto-merge-policy.json` containing protected path patterns, approved port scopes, trusted identities and policy revision. It is future implementation, not a file added here. Load policy from the approved base revision, never from candidate content. Missing/malformed policy, unknown paths or incomplete/paginated diff retrieval block automation.

The owner must ratify the exact bonus-file paths before activation; none are assumed to exist today. Protect all `packages/db/src/migrations/**` conservatively, including additions, deletions and renames. Check both old and new paths. Protect policy itself, `.github/**`, agent instructions, SDLC, tracker/config and merge/review overrides so an eligible port cannot alter its own enforcement. Any changed path outside approved slice scopes is owner-only until classified. New bonus locations require a prior owner-approved policy update; the independent review must also detect moved or newly introduced bonus logic.

An overlap with any protected pattern OR `zmiana-metody` OR a retained method-change verdict makes the PR owner-only. The trusted eligibility service reevaluates full diff, review provenance and live labels; it does not trust PR comments or author-supplied check results. Labels are reviewer signals, not access controls. Only trusted operators/reviewers may clear blocking classifications. The merger never removes blocking labels or manufactures a passing verdict.

## Architecture and enforcement

Existing: GitHub CI, configured pipeline labels, QA rules, `om-merge-buddy` (read-only classification), `om-approve-merge-pr` (squash merge), and Cezar on the agents VPS. Planned: owner-side comparison worker and publisher; VPS eligibility service and scheduled Cezar invocation. No production database connection is placed on the VPS.

Use a separate GitHub App for `Port merge eligibility`, pinned as expected source in branch protection; the equivalence publisher is a separate expected source for its own context. The eligibility App may publish checks but cannot merge; the Cezar merger has only required repository merge permissions and no ruleset/admin bypass. PR authors cannot impersonate trusted Apps. GitHub credentials and App provisioning are owner-managed prerequisites, not deliverables of this PR.

Branch rules cannot condition ordinary required contexts on a PR label. Require `Port merge eligibility` for all PRs, alongside CI and current independent approvals with stale-review dismissal and resolved conversations. For non-port PRs it reports neutral policy applicability as a successful check (explicit reason: manual route); it never invokes the merger and never requires real-data equivalence. For port PRs it succeeds only when all four gates and existing QA rules pass. `Equivalence on real data` is consumed by this aggregate check rather than globally required, so non-port PRs do not depend on the Mac mini.

For protected port PRs the aggregate check stays blocked until an explicit, current-head owner authorization is verified; it can then pass for the owner to perform the manual merge. This authorization never makes the PR eligible for the autonomous dispatcher. Equivalence, CI, independent review and QA remain required for that manual port route; no bypass is designed here. Non-port PRs remain subject to existing manual rules. The owner route must be exercised in staging before activation to prove protection does not permanently deadlock owner merges.

Freshness key: PR + head SHA + base SHA + trusted policy/review/equivalence revisions + relevant label state. Reevaluate after pushes, base changes, review dismissal, label edits, QA changes and every scheduled poll; withdraw previous success when eligibility changes. Before merging, reread all inputs, confirm required check sources and freshness, and reject concurrent changes. Serialize per PR and base branch with an expiring lock; do not enable GitHub deferred auto-merge. Invoke `om-approve-merge-pr` through a repo-local override that preserves the independent approval, refuses its normal self-approval fallback, repeats these gates and merges with expected-head SHA. It must not use admin bypass or repair blockers in the merge operation.

GitHub's merge API guards head SHA but does not atomically compare labels/base against the request. Close this gap by restricting gate-relevant mutations to trusted services/operators using the same lock, requiring strict up-to-date branch rules, and checking base immediately before dispatch. If repository permissions cannot enforce this coordination, unattended activation is blocked; a preflight reread alone is not claimed race-free. On timeout, reread PR state and merge SHA before retrying; never assume failure means no merge happened.

Cezar runs every five minutes on the agents VPS under a dedicated service identity, selects only `port` + `merge-queue` non-draft PRs, calls `om-merge-buddy`, checks protected routing itself and invokes the overridden `om-approve-merge-pr` only on an eligible candidate. One merge at a time; base movement causes reevaluation for the rest. No reviewer capacity, credentials, scheduler, status or network means waiting. Runs record sanitized SHA-bound decisions, not private comparison data.

### Existing QA and blocking labels remain binding

`needs-qa` requires `qa-approved` and a matching `QA head:` SHA. `skip-qa` and `needs-qa` cannot coexist; any stale or inconsistent QA blocks automation. Preserve the risk-high/no-self-QA rule. `blocked`, `do-not-merge`, `qa-failed`, `changes-requested`, active `qa`, draft state, conflicts and unreadable rules all stop merging. Do not reinterpret the four gates as a waiver of the current SDLC.

## Planned SDLC and instruction amendment

In the implementation PR, amend SDLC's Merge stage and the repository's owner-only instruction together, with owner approval of this limited exception. Proposed rule:

> The scheduled Cezar controller may squash-merge only same-repository port PRs into main when all four port gates, current QA evidence and existing blocking-label rules pass for the exact reviewed head and current base. Protected paths, calculation-method changes, non-port PRs and unknown classifications remain owner-only. Missing, expired or unverifiable evidence never permits an autonomous merge. The merge service cannot approve its own changes or bypass branch rules.

The existing `merge-queue` label remains a routing label, not GitHub's native merge queue. No global skill mutation is required: repository overrides carry the additional gate contract. This draft changes no active SDLC or instruction file.

## Risks, recovery and alternatives

A spoofed status, semantic change missed by review, stale evidence and accidental private-data publication are the principal risks. Expected-source Apps, positive method classification, base-bound evidence and an isolated allowlisted publisher address separate risks; historical equivalence alone cannot prove all future behavior. Owner ratification of historical coverage and metric inventory is necessary for every port slice.

Stop the scheduler and revoke its merge credential to disable automation; pending PRs revert to owner handling, not bypass. Keep required checks and their publisher operational until an owner-approved branch-rule change removes them. Stop/invalidate comparison evidence after a private-data or reference incident. Any revert of merged calculations goes through an owner-led PR and the appropriate verification; merging does not deploy or migrate production.

Rejected alternatives: author self-approval; fleet totals as equivalence; copying real records into CI; a new custom merge engine; globally requiring a Mac-only check for all PRs; GitHub deferred auto-merge detached from the scheduled final checks. These either weaken evidence or add unnecessary scope.

## Resolved assumptions (autonomous defaults)

- A1: One capability/spec: equivalence is an input gate to autonomous port merging. Standalone collector/data-bridge implementation is deferred; Q1/Q2 remain Open Questions by explicit owner instruction.
- A2: Five-minute polling and 24-hour evidence lifetime are reversible operational defaults; owner may change them before approval.
- A3: Dedicated expected-source Apps and serialized trusted mutations are the smallest enforceable security boundary proposed here. ⚠ NEEDS HUMAN CONFIRMATION: identity provisioning, repository plan/ruleset support and permissions must be demonstrated before activation; no weaker fallback.
- A4: Protect all migrations and unknown paths; owner ratifies actual bonus paths and port scope before activation. ⚠ NEEDS HUMAN CONFIRMATION.
- A5: Precision/rounding, reference revision and historical coverage remain owner approval prerequisites. No financial default is selected. ⚠ NEEDS HUMAN CONFIRMATION.

## Acceptance criteria and validation plan

1. A same-repository, unchanged-method port PR with all four gates, fresh QA when applicable and no protected changes is merged once through the existing squash skill, without per-PR human action. Different GitHub reviewer identity and Claude provenance are required.
2. Each missing/failing/skipped CI check, pending workflow, dismissed/stale review, stale QA, blocking label, conflict and draft state individually prevents dispatch and merge. Empty status lists fail.
3. Equivalence is checked at every driver/month/metric cell; cancelling errors across drivers fail. Inclusive tolerance boundaries pass, beyond-boundary values fail. Missing, duplicate, empty or extra keys and unsupported units fail. Verify with synthetic data only in CI.
4. Mac offline, revoked credentials, failed publication, stale success, spoofed publisher, new SHA/base/snapshot/policy and interrupted comparison never reuse old evidence. Refreshing verified evidence resumes the waiting PR without removing hard blocks.
5. Protected changes, bonus logic, renamed protected paths, policy edits and `zmiana-metody` route only to the owner. Removing `port` stops autonomous dispatch; removing method labels alone cannot clear the verdict. Author self-approval and App impersonation fail.
6. Non-port PRs receive manual-route applicability without a real-data check and are never dispatched for autonomous merge. Protected owner merges remain possible through explicit current-head authorization without granting the merger permission.
7. Dry-run two concurrent ticks, a push/base change/label change between evaluation and merge, merge timeout after success, lock expiry and API failure. No stale or duplicate merge; inability to enforce serialization blocks activation.
8. Inspect runner isolation and publisher field allowlist with synthetic exfiltration attempts. No records, identifiers or per-person amounts reach GitHub, Cezar logs or artifacts. Real comparison is verified on the Mac mini only after owner decisions and access controls are settled.
9. Required CI/App sources, stale-review dismissal, strict branch updates, no merger bypass, exact protected manifest and emergency stop are demonstrated in a staging repository before enabling unattended operation. If plan/permission capabilities are unavailable, report the blocker rather than weakening policy.

Design validation is document-only. No implementation, real-data comparison, credentials, scheduler or branch-protection change has been executed by this PR.

## 📋 Phasing

Phase 1 defines owner-approved policy and identity contracts, with automation disabled. Phase 2 delivers isolated local equivalence and synthetic security tests. Phase 3 wires required enforcement and Cezar in dry-run, then owner-authorized activation. Each phase remains independently testable without enabling premature merges; they deliver one coherent merge capability.

## 📋 Implementation Plan

1. Resolve Q1/Q2, rounding and reference/coverage approvals; ratify bonus paths and approved slice scopes. Publish approved contracts and the narrow instruction/SDLC exception. Verify links to owner decisions; no scheduler activation.
2. Implement base-owned policy validation, full-diff path checks, independent method-review provenance and eligibility decision logic with 100% unit coverage. Synthetic tests exercise every refusal; missing policy fails closed.
3. Build the fixed Mac mini runner and isolated publisher. Prove identical snapshot/key sets, decimal tolerances, invalidation and no data egress with synthetic fixtures; run approved real historical comparison locally only. Emit allowlisted status/summary.
4. Provision trusted Apps and independent reviewer identity; configure required aggregate/CI contexts, strict updates and non-bypass merger in staging. Exercise manual non-port and protected owner routes as well as normal ports; verify source spoofing rejection.
5. Add repo-local `om-merge-buddy`/`om-approve-merge-pr` integration and scheduled Cezar dry-run with serialization and expected-head merge. Test races, revocation, timeouts and recovery using synthetic PRs. No automatic production activation.
6. Obtain owner activation approval after staging evidence; configure production rules and scheduler in a separate authorized operational step. Observe first port and emergency stop; record sanitized run evidence and retain owner-only routing. Run all configured CI and required integration/screenshot checks for any user-visible changes made by those later PRs.

## Research and review limits

Repository baseline inspected at `5aed610327df78f8b228fe2d2ef84ca470ab1348`: SDLC, AGENTS, engineering standards, compatibility contract, CI and configured skills. No current ruleset or App capability was assumed verified. No Python source, production database or historical outputs were inspected.

GitHub is the relevant upstream platform; reuse its protection and SHA-guard mechanisms rather than building a queue. [Protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches) documents expected status sources and strict updates; [merge REST API](https://docs.github.com/en/rest/pulls/pulls#merge-a-pull-request) documents expected-head SHA. These platform mechanisms do not alone enforce mutable-label policy, hence the additional trusted eligibility and activation prerequisite. Review of those sources supports the design, not proof of a working deployment.
