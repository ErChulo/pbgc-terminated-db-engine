# Tasks: Responsiveness and Work Guards

**Input**: Design documents from `/specs/028-responsiveness-and-work-guards/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/responsiveness-and-work-guards.md, quickstart.md

**Tests**: Required because this UI slice changes local work guard state, cancellation behavior, fail-fast behavior, browser markup, and preservation behavior for existing deterministic workbench output.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm current workbench theme/progress state, render flow, styles, and focused tests before adding work guards.

- [X] T001 Inspect current theme/progress workbench display state in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T002 Inspect current workbench action-bar and event flow in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [X] T003 [P] Inspect current responsive action/progress styles in apps/web/src/styles.css
- [X] T004 [P] Inspect current focused workbench regression coverage in packages/tests/reconciliation-workbench-ui.test.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add shared display-only work guard model pieces required by all user stories.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Extend workbench display-state types with Work Guard State and Work Guard Evidence in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T006 Add deterministic helpers for guard-state normalization and supported/attempted work-unit evaluation in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T007 Add default work guard values to buildApprovedSampleReconciliationWorkbench without changing deterministic output rows in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T008 [P] Add baseline repeated-run tests for default work guard state in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T009 Verify no new persistence, output-adapter writes, server calls, OCR paths, raw source reads, or real-person data paths are introduced in apps/web/src/app/reconciliationWorkbenchSlice.ts

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Guard Delayed Workbench Refresh (Priority: P1) MVP

**Goal**: Let analysts start guarded local work, see running/cancellable state, and cancel without losing stable workbench content.

**Independent Test**: Render running and cancelled guard states and confirm visible guard status, cancel controls, selected sample, theme, filters, output panels, visible rows, and trace controls are preserved.

### Tests for User Story 1

- [X] T010 [P] [US1] Add a failing running guard-state test with visible cancel control in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T011 [P] [US1] Add a failing cancelled guard-state preservation test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T012 [P] [US1] Add a failing markup test for guarded refresh and cancel controls in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T013 [P] [US1] Add a failing deterministic markup test for repeated running/cancelled guard renders in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 1

- [X] T014 [US1] Wire active work guard values into the workbench state builder in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T015 [US1] Render visible guarded refresh, running guard status, and cancel controls in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [X] T016 [US1] Preserve selected sample, theme, status filter, severity filter, output panels, row groups, and trace controls when guard state changes in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [X] T017 [US1] Style guard controls and running/cancelled guard messages in apps/web/src/styles.css

**Checkpoint**: User Story 1 is independently functional and testable as the MVP.

---

## Phase 4: User Story 2 - Fail Fast on Unsupported Oversized Work (Priority: P2)

**Goal**: Show an immediate unsupported/fail-fast state for oversized local work with supported/attempted unit evidence.

**Independent Test**: Render unsupported oversized work and confirm the fail-fast message appears with deterministic work-unit evidence while stable workbench content remains visible and unchanged.

### Tests for User Story 2

- [X] T018 [P] [US2] Add a failing unsupported oversized work guard test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T019 [P] [US2] Add a failing work-unit evidence test for supported and attempted units in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T020 [P] [US2] Add a failing stable-content preservation test while unsupported guard state is active in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 2

- [X] T021 [US2] Add fail-fast guard-state evaluation for attempted work units above supported limit in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T022 [US2] Render unsupported oversized-work control and fail-fast guard evidence in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [X] T023 [US2] Style unsupported guard messages and evidence without disrupting existing tables in apps/web/src/styles.css

**Checkpoint**: User Stories 1 and 2 are independently functional and testable.

---

## Phase 5: User Story 3 - Preserve Responsive Work State Evidence (Priority: P3)

**Goal**: Keep guard controls and evidence readable on desktop/mobile while preserving browser-only and no-real-person-data boundaries.

**Independent Test**: Verify guard markup and documented manual review evidence for desktop `1440x900` and mobile `390x844`, plus boundary regression checks for no server/OCR/raw/real-person paths.

### Tests for User Story 3

- [X] T024 [P] [US3] Add a failing boundary regression test for no server calls, OCR paths, raw source reads, hosted assets, upload paths, real-person data, output-adapter writes, or persistence writes in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T025 [P] [US3] Add a failing responsive markup test for guard controls/evidence with stable labels and no hidden required controls in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T026 [P] [US3] Add a failing repeated-run preservation test for guard states across at least two builds in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 3

- [X] T027 [US3] Refine responsive layout for guard controls/evidence at desktop and mobile targets in apps/web/src/styles.css
- [X] T028 [US3] Preserve no-real-person-data notice and mocked context visibility while guard controls are active in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [X] T029 [US3] Record desktop 1440x900 and mobile 390x844 manual review evidence in specs/028-responsiveness-and-work-guards/quickstart.md

**Checkpoint**: All user stories are independently functional and preserve existing workbench behavior.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete slice and update committed browser output.

- [X] T030 Run focused workbench regression tests with npm test -- packages/tests/reconciliation-workbench-ui.test.ts
- [X] T031 Run project lint verification with npm run lint using package.json
- [X] T032 Run browser static build verification with npm run build using package.json and apps/web/dist/
- [X] T033 Update committed Vite static output in apps/web/dist/ after successful build if bundle contents changed
- [X] T034 Run full regression suite with npm test before push and PR merge
- [X] T035 Confirm no delivered .sql, .js, .ts, or .tex delivery-copy artifact is introduced for this internal UI/test slice in specs/028-responsiveness-and-work-guards/tasks.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 Setup: no dependencies.
- Phase 2 Foundational: depends on Phase 1 and blocks all user stories.
- Phase 3 US1: depends on Phase 2 and is the MVP.
- Phase 4 US2: depends on Phase 2 and may reuse US1 guard controls.
- Phase 5 US3: depends on Phase 2 and validates preservation across implemented states.
- Phase 6 Polish: depends on desired user stories being complete.

### User Story Dependencies

- US1 Guard Delayed Workbench Refresh: independent after Phase 2.
- US2 Fail Fast on Unsupported Oversized Work: independent after Phase 2, with shared guard state.
- US3 Preserve Responsive Work State Evidence: independent after Phase 2, with preservation checks across implemented states.

### Within Each User Story

- Write story tests first and confirm they fail before implementation.
- Update deterministic display-state helpers before browser markup.
- Update markup before CSS polish.
- Keep guard state display-only and avoid persistence, output-adapter, lower source-layer, server, raw-input, OCR, and real-person-data changes.

---

## Parallel Opportunities

- Setup inspections T003 and T004 can run in parallel with T001 and T002.
- Foundational test T008 can run in parallel with helper implementation T005-T007 after the current display model is understood.
- US1 tests T010-T013 can be written in parallel because they target separate guard assertions in packages/tests/reconciliation-workbench-ui.test.ts.
- US2 tests T018-T020 can be written in parallel because they target separate unsupported/fail-fast assertions.
- US3 tests T024-T026 can be written in parallel because they target boundary, responsive markup, and repeated-run stability.

---

## Implementation Strategy

### MVP First

1. Complete Phase 1 setup inspections.
2. Complete Phase 2 foundational work guard model.
3. Complete Phase 3 User Story 1 guarded start/cancel state.
4. Validate with `npm test -- packages/tests/reconciliation-workbench-ui.test.ts`.

### Incremental Delivery

1. Add guarded running/cancel states.
2. Add fail-fast unsupported oversized-work path.
3. Add responsive and boundary preservation regressions.
4. Run focused tests, lint, build, full tests, and manual viewport review.
