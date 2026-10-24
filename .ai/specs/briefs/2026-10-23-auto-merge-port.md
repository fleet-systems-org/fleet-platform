# Owner brief: four-gate automatic merging of fuel ports

Recorded: 2026-10-23, owner's T3 discussion. Status: supplied brief, retained with the draft design; no implementation authorization.

The owner will port fuel calculations and the driver report incrementally from Python material in `fleet-systems-org/paliwo-material` into fleet-platform, starting with approximately 1,700 lines of driver-report core. Every slice follows fleet-platform's process. The source size is the owner's estimate, not independently verified.

"I don't want to be the only one merging; build a mechanism you control yourself" [PL: „nie chciałbym, żebym scalał tylko ja, tylko żeby był jakiś mechanizm, który ty sam sobie kontrolujesz”]. The owner selected "four gates" [PL: „4 bramki”].

All gates are mandatory for a port PR to merge without a human:

1. Green required checks from the existing CI workflow.
2. `om-auto-review-pr` = APPROVE, with a reviewer different from the PR author. Codex implements; Claude Opus reviews.
3. Historical real-data equivalence against Python at driver × month × metric granularity, never fleet totals. Tolerances: `0.1` l/100 km and `0.01` PLN. Agree decimal.js precision/rounding before the first comparison. Real data never enters the repository, CI or GitHub logs (owner's Z1 confidentiality requirement). Compare on the owner's Mac mini; return only a commit status such as `Equivalence on real data` and an aggregate summary without names, registrations or per-person amounts. This gate applies only to port-labelled PRs, not ordinary PRs.
4. No protected changes: maintain a repository path list covering bonus files and production migrations. The reviewer applies `zmiana-metody` for calculation-method changes. These PRs remain owner-only.

Reuse `merge-queue`, `do-not-merge`, `blocked`, `om-merge-buddy`, and `om-approve-merge-pr` with its final gate recheck and squash merge. Preserve SDLC's `needs-qa` → `qa-approved` gate.

Design the Mac mini trigger/status return (for example polling port PRs), offline waiting with no bypass, required checks/rulesets, machine-enforced protected paths plus semantic label, and unattended invocation via scheduled Cezar on the agents VPS. Describe the later SDLC amendment explicitly restricting the owner-only exception to eligible port PRs.

## Open Questions — owner only

- Where will the historical-data PostgreSQL run, and who maintains it?
- How will data arrive from the Python collectors (the data bridge)?

Do not resolve these questions autonomously. Also do not invent financial precision or rounding rules.

## Deliverable and prohibitions

An English, spec-only draft design PR containing this brief and the specification. Quote owner decisions as English followed by the Polish original. No implementation code, CI edits, ruleset mutations or real data in this PR.
