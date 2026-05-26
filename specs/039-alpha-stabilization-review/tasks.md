# Tasks: Alpha Stabilization Review

- [x] T001 Update `.specify/feature.json` and `AGENTS.md`
- [x] T002 Create spec artifacts in `specs/039-alpha-stabilization-review/`
- [x] T003 [P] Audit all 17 navigation routes in `apps/web/src/main.ts` for proper hash handlers and imports
- [x] T004 [P] Check each page renderer in `apps/web/src/pages/*.ts` for edge cases (empty state, error state, missing data)
- [x] T005 [P] Audit dark theme coverage for all page-specific CSS classes in `apps/web/src/styles.css`
- [x] T006 [P] Audit mobile responsive layout for all grid and panel layouts at 820px and 390px breakpoints
- [x] T007 [P] Check each slice in `apps/web/src/app/*.ts` for undefined/null state handling
- [x] T008 Fix any navigation, rendering, or import issues found in T003–T004
- [x] T009 Add any missing dark theme CSS variants found in T005
- [x] T010 Add any missing responsive breakpoint rules found in T006
- [x] T011 Fix any slice state edge cases found in T007
- [x] T012 Run all tests and fix any regressions in `packages/tests/`
- [x] T013 Run full build and verify clean exit with updated `apps/web/dist/`
- [x] T014 Record evidence in `specs/039-alpha-stabilization-review/quickstart.md`
