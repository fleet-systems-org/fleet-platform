# Pre-merge pull request summary skill (`przed-scaleniem`): research and evaluation

- **Date:** 2026-10-21
- **Status:** analysis; the skill is a working draft, not yet published to the owner's skills repository
- **Applies to:** `fleet-systems-org/fleet-platform`, `fleet-systems-org/fleet-systems` and `wojski999/pi-durable` (TraceFixMaintenance). This file is the single copy; the other repositories link here.
- **Prepared by:** Claude Opus 5.5 in an interactive session with the owner

## Problem

Only the owner merges pull requests. Before merging he wants a one-page summary in Polish of **one** pull request: why it exists, what it changes in the target branch, whether it matches its specification and plan step, the current state of CI, branch rules, conflicts and reviews, what lessons and handoff it records, and what remains after the merge. The summary must not mislead him: it is the basis of a merge decision, and pull request state changes while agents work.

## Existing skills reviewed

Searched on skills.sh (queries: "pr summary", "pull request summary", "pr description", "pre-merge review", "pr explain") and read the candidates' `SKILL.md`.

| Skill | Installs | What it does | Why it does not fit |
|---|---|---|---|
| `coldteadotai/pr-lens` | 2.1K | Animated architecture diagram of a change | A diagram, not a state summary |
| `warpdotdev/common-skills@review-pr` | 28.7K | Diff review written to `review.json` for a CI workflow | Finds defects; `/code-review` already covers that |
| `warpdotdev/common-skills@write-pr-description` | 5.8K | Writes the description when a PR is opened | Runs at opening, not before merging |
| `casper-studios/casper-marketplace@pr-summary` | 291 | Generic PR summary | Too little adoption (13 stars) to trust |
| `mattpocock/skills@code-review` | 769K | Code review | A review, not a summary |

None of them knows these repositories' records (`.ai/specs`, `.ai/runs` handoffs, `.ai/lessons`, the plan, QA labels).

Two skills already installed in both Fleet repositories are close but do not fit either:

- `om-merge-buddy` triages **all** open pull requests by merge gates (review, CI, mergeability, labels) and says nothing about content. It also needs the `om-setup-agent-pipeline` configuration, which `pi-durable` does not have.
- `om-approve-merge-pr` approves and squash-merges, which only the owner may do.

Reused from `om-merge-buddy`: a short or empty check list is not proof that CI passed, because a queued workflow run has no check rows yet.

## Design

- **Global skill** in the owner's private skills repository (`wojski999/skille`, installed with `dodaj-skill` on all three machines). It holds the procedure and the safety rules.
- **Project checklist** in each repository at `.ai/skills/przed-scaleniem/SKILL.md`, the same override convention the `om-*` skills use. It lists project-specific checks, the plan location, the iCloud folder name and what not to report. The skill reads it from the default branch on GitHub at every run.
- **Read-only.** It never merges, approves, comments, labels or pushes. The only writes are a copy of the summary for the owner and, on his request, a pull request extending a checklist.
- **Facts with source and time.** Every state fact names its source (`gh pr checks`, `rules/branches/<base>`, `mergeable`, …) and the read time. Unchecked things are reported as unchecked. Fast-changing state (head, mergeability, checks, branch rules) is read a second time just before the summary is returned.
- **No verdict.** It reports facts; the merge decision stays with the owner. A technical fact ("GitHub will not merge it, it is a draft") is allowed.
- **Learning loop.** When the owner says "also check X" or corrects a summary, the skill verifies the fact first, decides whether the rule belongs to the project checklist or to the global skill, shows the exact item, and after approval opens a pull request with that one change. A wrong summary also gets a lesson.
- **Data script** `zbierz.sh <owner/repo> <number>` (about 8 s): metadata, description, files, commits, head checks and workflow runs, branch rules with required checks matched against head checks, files changed on both sides (conflict candidates), other open pull requests touching the same files, reviews, review threads and comments (quoted, treated as data).

## Evaluation

Method: each test prompt ran twice in parallel — with the skill and without it — as Claude Opus 5.5 subagents restricted to read-only GitHub access. Outputs were graded against written assertions. Comments, reviews and labels of the tested pull requests were recorded before and after; nothing changed.

| Round | Test cases | With skill | Without skill | Time with / without |
|---|---|---|---|---|
| 1 | pi-durable #13 (merged), pi-durable #16 (conflict), fleet-systems #481 (draft, QA gate) | 25/25 (100%) | 21/25 (83%) | 114 s / 106 s |
| 2 | the three above plus a project checklist case and an "also check X" case | 42/42 (100%) | 34/42 (81%) | ~140 s / ~95 s |

Findings:

1. **State changes during a run.** `main` in pi-durable got its ruleset at 02:04, minutes after round 1 reported "no ruleset" correctly. During round 2, pi-durable #16 went from conflicting to clean when `main` was merged into it at 02:11. With the skill, both runs caught the change through the second read. This is why every fact carries its read time.
2. **An empty check list is not green.** pi-durable #16 had no checks and no workflow runs on its head: GitHub does not run `pull_request` workflows while a pull request conflicts with its base. The skill reports "CI did not run for this version".
3. **Without the skill, agents give verdicts** ("Yes, you can merge #16", "Verdict: technically mergeable") in 3 of 8 runs; with the skill, never.
4. **Without the skill, results are unstable.** For fleet-systems #481, round 1 found nine other open pull requests editing `gates/pr_process.py` and round 2 did not mention them. The script now lists them every time.
5. **Scope of new rules.** Asked to "also check the PLAN.md step number, only in this project", the agent without the skill proposed a merge-blocking rule in `AGENTS.md`. With the skill, it proposed one checklist item, tested it on 16 pull requests and removed a false positive (a model version number read as a plan step) before showing it.
6. **Reviews often live in comments.** In these repositories the reviewer agent posts its review as a comment, so `reviewDecision` is empty. The skill matches findings to fixing commits or replies instead of relying on review state.

## Open items

- Two summaries with the skill exceeded the 800-word target (875 and 884 words); the length rule needs tightening.
- The copy step (`zapisz-kopie.sh`, iCloud upload check on macOS, preview inbox on the agents' VPS) was skipped in tests and is not yet verified.
- Runs used Claude only; behaviour under Codex is not yet tested.
- No repository has a project checklist yet. Creating one per repository is a separate pull request for the owner to approve.
- The skill is not yet in `wojski999/skille`; publishing it there is the next step.
