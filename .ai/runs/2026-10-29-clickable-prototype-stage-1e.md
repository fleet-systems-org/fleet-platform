# Clickable prototype — Stage 1e

Objective: correct the owner-reviewed quotation route, common summary, value-details table and entry layout. No pull request or base-branch merge.

Authority: owner assignment 2026-10-29; design-system decisions N6a, N7a–N7d, R17.1, R18.1/R18.2, R19.1, EV-4 and D65/FIN-3; approved E01 foundations and trip-entry specifications; engineering standards; prototype progress and composition lessons.

Starting branch: prototype/e01-clickable at 7231c29. Agent: repository coding assistant.

Plan:
1. Reproduce the direct-entry empty-route defect and separate the viewed K2 snapshot from the editable entry.
2. Share the summary-first quotation frame across s11/s12/s13/s16; retain the entry route on s09/s10.
3. Replace s13 paragraphs with an explicit evidence table and reusable nine-category cost rows; fix entry alignment and collapsed answers.
4. Run package/repository/static checks and browser regressions at 1440/320; publish the build and external evidence.
5. Record verified results, commit and publish normally to the existing prototype branch. Resolve any baseline mismatch without modifying protected source.

Initial finding: RouteStops reads current entry state on quotation screens; direct s13 shows empty vehicle/places. Only s12 owns the summary panel. Current main has advanced since the requested prototype starting commit, so protected-source baseline comparison needs resolution before publication.

Validation: package typecheck/build, repository typecheck/lint and 190 tests passed; prototype ESLint, exact-cost-share checks and token scan passed (0 findings); design detector 0 findings. Browser walkthrough passed at actual 1440/320 CSS pixels, runtime errors 0. Production specifications remain approved and unimplemented.

## Actions and evidence

- Reproduced s13 direct-entry placeholders in the isolated browser before editing. Separated the K2 snapshot and entry route; snapshot customers survive later entry edits and acceptance.
- Shared QuoteFrame across s11/s12/s13/s16; shared cost category rows across s12/s13. Inline exact-value evidence table retains published scales. Entry collapsed answers, place-link alignment and fixed route-label widths are verified.
- Browser regression expression checks direct screen-picker arrival and repeated reset. Full walkthrough verifies both widths, identical panels, mobile summary order, 96 px route labels, eleven evidence rows, nine expanded categories, s09 step 2 and collapsed step 1, source-to-acceptance path, accepted quote and scroll-end clearance. Twenty final screenshots remain external to Git.
- Initial mobile test was interrupted when the bounded development server expired and its restart reset app state. The repeated run exposed a test setup assumption about retained expanded rows; made the external runner establish its own collapse state. Final full walkthrough passed both widths; no product failure was suppressed.
- Review engine SHA-256: 1ce5c7507244ae8e4162541e44eab14b69976430f6896f03018d3f6e2b7e5e95, equal to starting commit. Local typography override remains. Protected source diff from starting commit: empty before baseline sync.
- Updated progress, existing composition lesson and owner-confirmed step 4 question. No production specification status changed.

## Final verification and publication

- Implementation: 3638c1a. Baseline synchronization: e4392c2. Only the lessons index conflicted; retained the main lesson description and both prototype links. No protected source was manually edited.
- After synchronization: repository typecheck/lint and 37 files / 196 unit tests passed. Package typecheck/build passed. Protected diff against main for application/shared UI source/stories is empty.
- The built preview passed the direct screen-picker and repeated-reset regression at 320 px. Preview index/assets replaced; twenty final screenshots remain external. HTTP and cloud publication results are recorded below.
- No pull request or base-branch merge. Stage 2 remains unstarted; owner review is next.

Not run: production application build/integration/coverage, Storybook story tests, Stage 2 scenarios, full accessibility or cross-browser audits.

- Final built-version walkthrough repeated the complete 1440/320 checks successfully, including eleven evidence rows and published-scale strings; runtime errors 0. Preview index SHA-256: 2b32e691574a091d0d0c16f0ecf8faaa36167da61ad394be63f6859a83cc031d. The served network index matches it and returns HTTP 200. Index cloud upload is true; cloud status reports caught-up. Download/opening on another device is unverified.
- Final outcome: Stage 1e complete, ready for owner review. Normal branch push is authorized by the assignment; no pull request or base-branch merge. The existing composition lesson captures the cause and prevention finding without adding standing rules.
