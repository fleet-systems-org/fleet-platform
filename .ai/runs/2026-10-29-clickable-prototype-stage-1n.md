# Clickable prototype Stage 1n — frame and s09–s11

Status: complete, waiting for owner review. Agent: Codex. Starting branch: prototype/e01-clickable, origin tip 74350c2 (verified ancestry before publication).

## Objective and authority

Owner order 2026-10-29: D1, rebuild the existing clickable prototype using shared UI components; no PR or base merge. Read prototype POSTEP stages 0 and 1c–1m, UI POSTEP batch 5/group 1, design-system-decisions (N7a–d, R18, R19, L08, L09, L12, W1/W2), approved E01 entry/quotation and foundations, engineering standards, lessons index and composition/layout lessons.

## Plan

1. Merge origin/main and open PR #62 branch into prototype branch; preserve both lesson-index additions.
2. Compose AppFrame, StepBar, RouteStops, PlacePicker; retain review mechanics, existing quote content and product-source boundaries.
3. Replace country allocation with exact country km × rates and once-rounded aggregates; simulate L08/L09 and manual country distances.
4. Run package/repository validation, source boundary and privacy checks; browser at 1440/1024/768/320, keyboard and screenshots.
5. Update progress records, build external preview preserving evidence, commit and ordinary push. No PR or merge into main.

## Actions

- Merged origin/main (697f176); resolved lesson index by keeping main's corrected focus-return finding and prototype-specific findings.
- Merged origin/design-system-e01-screens-1 because PR #62 was OPEN.
- Replaced local frame/step/route rendering with shared components; page composes narrow Menu around AppFrame. Removed three local component copies.
- Added page-owned place response simulation and manual country kilometres. No server/provider connection.
- Country rates are synthetic exact micro-EUR/km; no Number conversion or allocation. Full K2 costs remain 28.00 + 10.18 = 38.18, result 60.00 − 38.18 = 21.82 EUR.
- G10 aliases remain in review bridge because all five are consumed by unchanged review CSS. Product uses neutral Alert with Uwaga and SuccessMessage.

## Validation

- Package typecheck/build passed; Vite warns about the existing large static map bundle (>500 kB).
- Repository typecheck/lint passed; explicit prototype ESLint passed after fixing state updates and native selector labels.
- `pnpm test`: 202/202 tests in 41 files. `pnpm test:coverage`: statements 580/580, branches 459/459, functions 184/184, lines 491/491 (all 100%, no exclusions changed).
- Token checker: exactly eight unchanged N8a map colours; zero outside that approved exception. Mechanical detector `[]`.
- Review engine SHA256 unchanged: 1ce5c7507244ae8e4162541e44eab14b69976430f6896f03018d3f6e2b7e5e95. Private-name scan 0; protected-source diff equals only #62, no task edits.
- Final built-browser checks passed at actual 1440/1024/768/320 CSS px: happy path s09 → s10 → s09 → s11 → s12, result 21.82 EUR, no horizontal overflow. Fallback not-found/unavailable at 1440/320, saved/company-town lists, no add action without a map address, one-action save, indefinite pending statuses, manual km missing/valid/invalid gates, labels/Tab and mobile Menu passed. Full town-only B/C quote also passed; route point and distance retain estimate words. Runtime and console errors 0.
- Manual fixture 13/8/50/30 km exercises FIN-3: displayed country components exceed the once-rounded exact aggregate by 0.01 EUR; the −0.01 EUR reconciliation line is visible, and non-K2 distances cannot open the fixed K2 quote.
- Eight external captures: 1440-s09, 1440-s10-brak-wynikow, 1440-s10-mapa-niedostepna, 1440-s11, 1440-s12, 320-s10, 768-s09, 1440-s11-zaokraglenie. Saved under /home/t3agent/podglad/prototyp-e01/etap-1n, not committed. Existing preview evidence preserved.
- Preview served HTTP 200 through http://10.171.115.31:8790/z-vps/prototyp-e01/index.html (checked from Mac mini). VPS/Mac mini index SHA256 44ca9a0088436821a329df4ee59f4b26c28a6d27866910593bc3e11f734fc7c5. Swift confirmed iCloud upload 10/10 (index, eight screenshots, report); brctl caught-up. MacBook opening/download remains unverified.
- During verification fixed duplicate provider/saved option IDs after save and missing accessible names on native scenario selects. Browser now collects console errors as well as pageerror.
- No production build/integration, Storybook suite, cross-browser matrix or exhaustive accessibility audit run; prototype uses no backend.

## Remaining

Code commit 2e288ab; merge commits 697f176 (main) and 62ee7c5 (#62). Verification complete, final documentation committed separately. Ordinary push to prototype/e01-clickable; no PR/base merge.

Remaining: owner review, then authorize part 2 (s12–s16) separately. AppFrame has no mobile-menu prop: composed page disclosure; shared panel order below 1280 px is documented in POSTEP as a limitation. All review G10 aliases remain because each is used. No unrelated downstream implementation dispatched.

## Review correction (2026-10-29)

Scope: remove page-owned mobile Menu/state and AppFrame geometry overrides in favour of approved proposal 4; restrict company towns to no-result/unavailable map fallback (L09). Shared sources and review engine remain untouched. Validation passed: package typecheck/build, repository typecheck/lint/test (202 tests), coverage 100% (580/580 statements, 459/459 branches, 184/184 functions, 491/491 lines), prototype ESLint, tokens zero except eight unchanged N8a map colours. Review engine unchanged; main protected-source diff SHA256 50219cb866849746862e09e1b6beb486ce270ef06275c1e39e4eb7737807ec1d is identical to starting state. Browser at 320/768/1440: no Menu or overflow, successful map results omit towns, fallback states retain towns, K2 21.82 EUR, runtime/console errors zero. Existing extended browser checks also passed (manual km, rounding reconciliation, town-only quote, keyboard). Exact 768 px follows the approved md left-panel breakpoint; above-content list is below 768, despite the check wording requesting it at both widths. No shared geometry override added. Three requested screenshots captured and visually inspected. Build copied to existing preview preserving evidence. Existing bundle-size warning only; production integration/Storybook/cross-browser not run. Publication verification follows.
