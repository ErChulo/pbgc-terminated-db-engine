# Tasks: Schema Library And Validator Surfaces

**Input**: Design documents from `/specs/032-schema-library-validator/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/schema-library-validator.md, quickstart.md

**Tests**: Required because this UI slice adds a new schema library surface, local validation preview, navigation behavior, and preservation behavior for existing dashboard/prompt/workbench surfaces.

## Phase 1: Setup

- [X] T001 Inspect committed schema artifacts in artifacts/schemas/
- [X] T002 Inspect current dashboard stage navigation in apps/web/src/app/caseNavigationDashboardSlice.ts
- [X] T003 Inspect current hash-based app rendering in apps/web/src/main.ts
- [X] T004 [P] Inspect current focused UI regression coverage in packages/tests/reconciliation-workbench-ui.test.ts

## Phase 2: Foundational

- [X] T005 Add schema entry and validation preview types in apps/web/src/app/schemaLibrarySlice.ts
- [X] T006 Add deterministic committed schema inventory in apps/web/src/app/schemaLibrarySlice.ts
- [X] T007 Add structural JSON validation preview helper in apps/web/src/app/schemaLibrarySlice.ts
- [X] T008 [P] Add baseline schema inventory and deterministic ordering tests in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T009 Verify no server, OCR, scraping execution, raw source read, hosted schema, sql.js write, output-adapter write, or real-person path is introduced in apps/web/src/app/schemaLibrarySlice.ts

## Phase 3: User Story 1 - Browse Reviewed-Input Schemas (Priority: P1) MVP

- [X] T010 [P] [US1] Add a failing schema library render test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T011 [P] [US1] Add a failing dashboard-to-schema-library navigation test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T012 [P] [US1] Add a failing selected schema details test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T013 [US1] Add schema library route target to dashboard stage inventory in apps/web/src/app/caseNavigationDashboardSlice.ts
- [X] T014 [US1] Implement schema library page markup in apps/web/src/pages/SchemaLibraryPage.ts
- [X] T015 [US1] Wire schema library hash route in apps/web/src/main.ts
- [X] T016 [US1] Style schema library list and details in apps/web/src/styles.css

## Phase 4: User Story 2 - Preview Reviewed JSON Validation (Priority: P2)

- [X] T017 [P] [US2] Add a failing accepted JSON validation preview test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T018 [P] [US2] Add a failing missing-field and malformed JSON validation preview test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T019 [US2] Render local JSON validation textarea and validation result panel in apps/web/src/pages/SchemaLibraryPage.ts
- [X] T020 [US2] Add local validation event handling without persistence writes in apps/web/src/pages/SchemaLibraryPage.ts
- [X] T021 [US2] Style validation result states in apps/web/src/styles.css

## Phase 5: User Story 3 - Preserve Local Boundaries And Responsiveness (Priority: P3)

- [X] T022 [P] [US3] Add a failing oversized JSON fail-fast preview test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T023 [P] [US3] Add a failing repeated-render boundary test for no server/OCR/scraping/raw/sql.js/output-adapter/real-person paths in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T024 [US3] Refine responsive schema library layout in apps/web/src/styles.css
- [X] T025 [US3] Record desktop 1440x900 and mobile 390x844 manual review evidence in specs/032-schema-library-validator/quickstart.md

## Phase 6: Polish

- [X] T026 Run focused schema/dashboard/prompt/workbench regression tests with npm test -- packages/tests/reconciliation-workbench-ui.test.ts
- [X] T027 Run project lint verification with npm run lint using package.json
- [X] T028 Run browser static build verification with npm run build using package.json and apps/web/dist/
- [X] T029 Update committed Vite static output in apps/web/dist/ after successful build if bundle contents changed
- [X] T030 Run full regression suite with npm test before push and PR merge
- [X] T031 Confirm no delivered .sql, .js, .ts, or .tex delivery-copy artifact is introduced for this internal UI/test slice in specs/032-schema-library-validator/tasks.md

## Dependencies & Execution Order

- Phase 1 Setup: no dependencies.
- Phase 2 Foundational: depends on Phase 1 and blocks all user stories.
- Phase 3 US1: depends on Phase 2 and is the MVP.
- Phase 4 US2: depends on Phase 2 and can reuse US1 page markup.
- Phase 5 US3: depends on Phase 2 and validates boundary/responsive behavior.
- Phase 6 Polish: depends on desired user stories being complete.

## Parallel Opportunities

- T004 can run in parallel with schema artifact inspection.
- T010-T012 can be written in parallel before US1 implementation.
- T017-T018 can be written in parallel before US2 implementation.
- T022-T023 can be written in parallel before responsive refinement.

## Implementation Strategy

1. Add deterministic schema inventory and validation preview helper.
2. Link schema library from the dashboard and render schema viewer.
3. Add local JSON validation preview.
4. Add fail-fast oversized/boundary regressions.
5. Run focused tests, lint, build, full tests, and manual viewport review.
