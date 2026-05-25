# Tasks: Theme and Progress

**Input**: Design documents from `/specs/027-theme-and-progress/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/theme-and-progress.md, quickstart.md

**Tests**: Required because this UI slice changes visible app state, responsiveness indicators, browser markup, and preservation behavior for existing deterministic workbench output.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm existing workbench state, rendering, styles, and tests before adding display-only theme/progress state.

- [X] T001 Inspect current workbench display state and preservation fields in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T002 Inspect current workbench render/event flow in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [X] T003 [P] Inspect current workbench layout and responsive styles in apps/web/src/styles.css
- [X] T004 [P] Inspect current focused workbench regression coverage in packages/tests/reconciliation-workbench-ui.test.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add shared display-only theme/progress model pieces required by all user stories.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Extend workbench display-state types with Theme Preference and Progress State in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T006 Add deterministic helpers for valid theme selection and progress-state normalization in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T007 Add default theme/progress values to buildApprovedSampleReconciliationWorkbench without changing deterministic output rows in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T008 [P] Add baseline repeated-run tests for default theme/progress state in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T009 Verify no new persistence, output-adapter writes, server calls, OCR paths, raw source reads, or real-person data paths are introduced in apps/web/src/app/reconciliationWorkbenchSlice.ts

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Switch Workbench Theme (Priority: P1) MVP

**Goal**: Let analysts switch between light and dark display modes while preserving current workbench state and deterministic output content.

**Independent Test**: Build and render the workbench in light and dark modes, confirm visible theme controls and labels are present, and confirm selected sample, filters, output panels, visible row counts, and trace controls are preserved.

### Tests for User Story 1

- [X] T010 [P] [US1] Add a failing theme option/default-state test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T011 [P] [US1] Add a failing theme preservation test for sample, status filter, severity filter, output panels, visible row counts, and trace controls in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T012 [P] [US1] Add a failing markup test for visible light/dark theme controls and active theme labels in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T013 [P] [US1] Add a failing deterministic markup test for repeated dark-mode renders in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 1

- [X] T014 [US1] Wire active theme values into the workbench state builder in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T015 [US1] Render visible light/dark theme controls and active theme labels in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [X] T016 [US1] Preserve selected sample, status filter, severity filter, output panels, row groups, and trace controls when theme changes in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [X] T017 [US1] Add light/dark theme styling without changing table structure in apps/web/src/styles.css

**Checkpoint**: User Story 1 is independently functional and testable as the MVP.

---

## Phase 4: User Story 2 - See Progress for Delayed Work (Priority: P2)

**Goal**: Show a visible progress/loading state for delayed local workbench actions and deterministic failed/unsupported messages without hiding stable content.

**Independent Test**: Render loading, failed, and unsupported progress states and confirm each shows the expected display message while preserving output panels, filters, tables, and trace controls.

### Tests for User Story 2

- [X] T018 [P] [US2] Add a failing loading progress-state test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T019 [P] [US2] Add a failing failed-progress display test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T020 [P] [US2] Add a failing unsupported-load display test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T021 [P] [US2] Add a failing stable-content preservation test while progress state is active in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 2

- [X] T022 [US2] Wire progress state inputs into the workbench state builder in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T023 [US2] Render visible progress/loading, failed, and unsupported display states in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [X] T024 [US2] Add a local delayed-refresh trigger that shows progress without server calls or output-adapter writes in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [X] T025 [US2] Style progress indicators and display messages in apps/web/src/styles.css

**Checkpoint**: User Stories 1 and 2 are independently functional and testable.

---

## Phase 5: User Story 3 - Preserve Responsive UI Behavior (Priority: P3)

**Goal**: Ensure theme and progress controls remain readable and reachable on desktop and mobile while preserving browser-only, no-real-person-data, and no-raw-source constraints.

**Independent Test**: Verify themed/progress markup and documented manual review evidence for desktop `1440x900` and mobile `390x844`, plus boundary regression checks for no server/OCR/raw/real-person paths.

### Tests for User Story 3

- [X] T026 [P] [US3] Add a failing boundary regression test for no server calls, OCR paths, raw source reads, hosted assets, upload paths, real-person data, output-adapter writes, or persistence writes in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T027 [P] [US3] Add a failing responsive markup test for theme and progress controls with stable labels and no hidden required controls in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T028 [P] [US3] Add a failing repeated-run preservation test for theme/progress states across at least two builds in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 3

- [X] T029 [US3] Refine responsive layout for theme/progress controls at desktop and mobile targets in apps/web/src/styles.css
- [X] T030 [US3] Preserve no-real-person-data notice and mocked context visibility while theme/progress controls are active in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [X] T031 [US3] Record desktop 1440x900 and mobile 390x844 manual review evidence in specs/027-theme-and-progress/quickstart.md

**Checkpoint**: All user stories are independently functional and preserve existing workbench behavior.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete slice and update committed browser output.

- [X] T032 Run focused workbench regression tests with npm test -- packages/tests/reconciliation-workbench-ui.test.ts
- [X] T033 Run project lint verification with npm run lint using package.json
- [X] T034 Run browser static build verification with npm run build using package.json and apps/web/dist/
- [X] T035 Update committed Vite static output in apps/web/dist/ after successful build if bundle contents changed
- [X] T036 Run full regression suite with npm test before push and PR merge
- [X] T037 Confirm no delivered .sql, .js, .ts, or .tex delivery-copy artifact is introduced for this internal UI/test slice in specs/027-theme-and-progress/tasks.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 Setup: no dependencies.
- Phase 2 Foundational: depends on Phase 1 and blocks all user stories.
- Phase 3 US1: depends on Phase 2 and is the MVP.
- Phase 4 US2: depends on Phase 2 and may reuse US1 theme controls.
- Phase 5 US3: depends on Phase 2 and validates preservation across implemented states.
- Phase 6 Polish: depends on desired user stories being complete.

### User Story Dependencies

- US1 Switch Workbench Theme: independent after Phase 2.
- US2 See Progress for Delayed Work: independent after Phase 2, with shared display-state types.
- US3 Preserve Responsive UI Behavior: independent after Phase 2, with preservation checks across implemented states.

### Within Each User Story

- Write story tests first and confirm they fail before implementation.
- Update deterministic display-state helpers before browser markup.
- Update markup before CSS polish.
- Keep theme/progress display-only and avoid persistence, output-adapter, lower source-layer, server, raw-input, OCR, and real-person-data changes.

---

## Parallel Opportunities

- Setup inspections T003 and T004 can run in parallel with T001 and T002.
- Foundational test T008 can run in parallel with helper implementation T005-T007 after the current display model is understood.
- US1 tests T010-T013 can be written in parallel because they target separate theme assertions in packages/tests/reconciliation-workbench-ui.test.ts.
- US2 tests T018-T021 can be written in parallel because they target separate progress assertions.
- US3 tests T026-T028 can be written in parallel because they target boundary, responsive markup, and repeated-run stability.

---

## Parallel Example: User Story 1

```bash
Task: "T010 [US1] Add a failing theme option/default-state test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T011 [US1] Add a failing theme preservation test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T012 [US1] Add a failing markup test for visible light/dark theme controls in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T013 [US1] Add a failing deterministic markup test for repeated dark-mode renders in packages/tests/reconciliation-workbench-ui.test.ts"
```

## Parallel Example: User Story 2

```bash
Task: "T018 [US2] Add a failing loading progress-state test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T019 [US2] Add a failing failed-progress display test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T020 [US2] Add a failing unsupported-load display test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T021 [US2] Add a failing stable-content preservation test in packages/tests/reconciliation-workbench-ui.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup inspections.
2. Complete Phase 2 foundational display-state model.
3. Complete Phase 3 User Story 1 theme toggle.
4. Stop and validate with `npm test -- packages/tests/reconciliation-workbench-ui.test.ts`.
5. Build and update `apps/web/dist/` only if the browser bundle changes.

### Incremental Delivery

1. Add theme toggle as the MVP.
2. Add delayed progress display states.
3. Add responsive and boundary preservation regressions.
4. Run focused tests, lint, build, full tests, and manual viewport review.
