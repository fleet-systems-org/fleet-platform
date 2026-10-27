# Backlogs

## .ai/specs/product-brief.md
Backlog source: .ai/specs/product-brief.md
Last filed: 2026-10-24

Two linked specifications cover the whole E01 epic (D33): [foundations](2026-10-26-e01-foundations.md) and [feature](2026-10-26-e01-trip-entry-and-quotation.md). #22 authors them together using the #27 review; later stories link both. No framework-first build phase. Then #21 produces a synthetic-data mockup from that specification to check it, before implementation. Build in phases, trip entry and the quote first. No dispatcher session gates the build. Phase 1 builds #22 and the first #25 slice with only the minimal parts of #23/#24 that correct quotation needs; the full #23/#24 stories follow in Phase 2, so the #25 dependency below describes the complete story, not the Phase 1 order.

E3 + E4 (actual post-trip costs) is the next specification after E01 (D37); the order of other remaining Must items remains open. Read-only dated quote-input providers in E01 (D30) are distinct from E4 settlement.

The #22 specification milestone precedes #21; only #22 implementation depends on #21. The dependencies below distinguish those milestones to avoid a circular dependency.

| Id | Issue | Title | Epic | Depends on | Adopted |
|---|---|---|---|---|---|
| E01 | [#18](https://github.com/fleet-systems-org/fleet-platform/issues/18) | Price an offer together with the truck's next move | — | — | no |
| E01-S01 | [#21](https://github.com/fleet-systems-org/fleet-platform/issues/21) | Synthetic E01 specification mockup (D29) | #18 | #22 specification | no |
| E01-S02 | [#22](https://github.com/fleet-systems-org/fleet-platform/issues/22) | Enter a truck's trip by hand | #18 | #27; #21 before build | no |
| E01-S03 | [#23](https://github.com/fleet-systems-org/fleet-platform/issues/23) | Where and when each truck is free | #18 | #22 | no |
| E01-S04 | [#24](https://github.com/fleet-systems-org/fleet-platform/issues/24) | Empty km and kilometre check | #18 | #22 | no |
| E01-S05 | [#25](https://github.com/fleet-systems-org/fleet-platform/issues/25) | Price an offer before accepting | #18 | #23, #24, #27 | no |
| E01-S05-T01 | [#27](https://github.com/fleet-systems-org/fleet-platform/issues/27) | Review the older pricing module (D10) | #18 | — | no |
| E01-S06 | [#26](https://github.com/fleet-systems-org/fleet-platform/issues/26) | Past similar trips beside the quote | #18 | #25, #28 | no |
| E01-S06-T01 | [#28](https://github.com/fleet-systems-org/fleet-platform/issues/28) | Load the invoice route history | #18 | — | no |
| E02 | [#19](https://github.com/fleet-systems-org/fleet-platform/issues/19) | Discovery: evidence for remaining 1.0 | — | — | no |
| E02-T01 | [#29](https://github.com/fleet-systems-org/fleet-platform/issues/29) | Order emails (P2, A04) | #19 | — | no |
| E02-T02 | [#30](https://github.com/fleet-systems-org/fleet-platform/issues/30) | Management interview (P8, Q08) | #19 | — | no |
| E02-T03 | [#31](https://github.com/fleet-systems-org/fleet-platform/issues/31) | Accounting provenance (P9, P10, A02) | #19 | — | no |
| E03 | [#20](https://github.com/fleet-systems-org/fleet-platform/issues/20) | Parked: rest of Release 1.0 and Later | — | — | no |
