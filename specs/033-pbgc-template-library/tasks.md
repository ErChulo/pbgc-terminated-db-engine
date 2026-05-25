# Tasks: PBGC Template Library

**Input**: Design documents from `/specs/033-pbgc-template-library/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/pbgc-template-library.md, quickstart.md

**Tests**: Required because this UI slice adds a new template library surface, readiness preview, navigation behavior, and preservation behavior for existing dashboard/prompt/schema/workbench surfaces.

## Phase 1: Setup

- [X] T001 Inspect committed template artifacts in artifacts/templates/
- [X] T002 Inspect current dashboard stage navigation in apps/web/src/app/caseNavigationDashboardSlice.ts
- [X] T003 Inspect current hash-based app rendering in apps/web/src/main.ts
- [X] T004 [P] Inspect current focused UI regression coverage in packages/tests/reconciliation-workbench-ui.test.ts

## Phase 2: Foundational

- [X] T005 Add template entry and readiness preview types in apps/web/src/app/pbgcTemplateLibrarySlice.ts
- [X] T006 Add deterministic committed template inventory in apps/web/src/app/pbgcTemplateLibrarySlice.ts
- [X] T007 Add readiness preview helper in apps/web/src/app/pbgcTemplateLibrarySlice.ts
- [X] T008 [P] Add baseline template inventory and deterministic ordering tests in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T009 Verify no server, OCR, scraping execution, raw source read, hosted template, sql.js write, output-adapter write, filling/export, or real-person path is introduced in apps/web/src/app/pbgcTemplateLibrarySlice.ts

## Phase 3: User Story 1 - Browse PBGC Templates (Priority: P1) MVP

- [X] T010 [P] [US1] Add a failing template library render test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T011 [P] [US1] Add a failing dashboard-to-template-library navigation test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T012 [P] [US1] Add a failing selected template metadata test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T013 [US1] Add template library route target to dashboard stage inventory in apps/web/src/app/caseNavigationDashboardSlice.ts
- [X] T014 [US1] Implement template library page markup in apps/web/src/pages/PbgcTemplateLibraryPage.ts
- [X] T015 [US1] Wire template library hash route in apps/web/src/main.ts
- [X] T016 [US1] Style template library list and details in apps/web/src/styles.css

## Phase 4: User Story 2 - Preview Template Readiness (Priority: P2)

- [X] T017 [P] [US2] Add a failing official template readiness test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T018 [P] [US2] Add a failing import template readiness/category test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T019 [US2] Render readiness status and dependencies in apps/web/src/pages/PbgcTemplateLibraryPage.ts
- [X] T020 [US2] Style readiness status states in apps/web/src/styles.css

## Phase 5: User Story 3 - Preserve Local Boundaries And Responsiveness (Priority: P3)

- [X] T021 [P] [US3] Add a failing repeated-render boundary test for no server/OCR/scraping/raw/sql.js/output-adapter/filling/export/real-person paths in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T022 [US3] Refine responsive template library layout in apps/web/src/styles.css
- [X] T023 [US3] Record desktop 1440x900 and mobile 390x844 manual review evidence in specs/033-pbgc-template-library/quickstart.md

## Phase 6: Polish

- [X] T024 Run focused template/dashboard/prompt/schema/workbench regression tests with npm test -- packages/tests/reconciliation-workbench-ui.test.ts
- [X] T025 Run project lint verification with npm run lint using package.json
- [X] T026 Run browser static build verification with npm run build using package.json and apps/web/dist/
- [X] T027 Update committed Vite static output in apps/web/dist/ after successful build if bundle contents changed
- [X] T028 Run full regression suite with npm test before push and PR merge
- [X] T029 Confirm no delivered .sql, .js, .ts, or .tex delivery-copy artifact is introduced for this internal UI/test slice in specs/033-pbgc-template-library/tasks.md

## Dependencies & Execution Order

- Phase 1 Setup: no dependencies.
- Phase 2 Foundational: depends on Phase 1 and blocks all user stories.
- Phase 3 US1: depends on Phase 2 and is the MVP.
- Phase 4 US2: depends on Phase 2 and can reuse US1 page markup.
- Phase 5 US3: depends on Phase 2 and validates boundary/responsive behavior.
- Phase 6 Polish: depends on desired user stories being complete.

## Parallel Opportunities

- T004 can run in parallel with template artifact inspection.
- T010-T012 can be written in parallel before US1 implementation.
- T017-T018 can be written in parallel before US2 implementation.
- T021 can be written before responsive refinement.

## Implementation Strategy

1. Add deterministic template inventory and readiness preview helper.
2. Link template library from the dashboard and render template viewer.
3. Add readiness/category display for official and import templates.
4. Add boundary/responsive regressions.
5. Run focused tests, lint, build, full tests, and manual viewport review.
