# Tasks: Reconciliation Workbench Sample Selector

**Input**: Design documents from `/specs/024-workbench-sample-selector/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/reconciliation-workbench-sample-selector.md, quickstart.md

**Tests**: Required. This slice changes deterministic workbench display state, approved-sample selector behavior, no-real-person-data boundaries, and trace/table preservation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inspect the current workbench builder, renderer, styles, and tests before adding selector state.

- [X] T001 Inspect current sample context and fixed-sample state in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T002 Inspect current workbench header, output panel, table, and trace markup in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [X] T003 Inspect current workbench styling for header and panel layout in apps/web/src/styles.css
- [X] T004 [P] Inspect existing focused workbench tests in packages/tests/reconciliation-workbench-ui.test.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define approved selector state and deterministic sample resolution before user stories render or test selection behavior.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Define ApprovedSampleOption and selected sample display fields in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T006 Define deterministic approved sample option inventory from existing approved fixture evidence in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T007 Define selected-sample resolution helper for default, supported, and unsupported sample ids in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T008 Preserve stable generated evidence and mocked context labels on selected sample state in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T009 [P] Add focused regression tests for approved sample option inventory shape in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T010 [P] Add focused regression tests for selected sample resolution and repeated-build stability in packages/tests/reconciliation-workbench-ui.test.ts

**Checkpoint**: Workbench state can expose approved selector options and resolve the selected approved sample deterministically.

---

## Phase 3: User Story 1 - Switch Approved Samples (Priority: P1) MVP

**Goal**: Add a clear selector or fixed-sample selector that updates the existing workbench display state for the selected approved sample.

**Independent Test**: Build/render the workbench for the default approved sample and a selected approved sample id, then confirm the header, output panels, Shared Facts table, Shared Values table, reconciliation rows, and trace details reflect that selected sample deterministically.

### Tests for User Story 1

- [X] T011 [P] [US1] Add failing state test for selected sample header and sample context updates in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T012 [P] [US1] Add failing state test proving selected sample output panels, Shared Facts rows, Shared Values rows, reconciliation rows, and trace details remain populated in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T013 [P] [US1] Add failing markup test for visible selector or fixed-sample control with selected sample label in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T014 [P] [US1] Add failing repeated-selection equality test for selected sample display state in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 1

- [X] T015 [US1] Add selected sample id parameter or options object to buildApprovedSampleReconciliationWorkbench in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T016 [US1] Populate selected sample option and selector metadata on ReconciliationWorkbenchState in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T017 [US1] Use selected sample context to update sample header labels and stable evidence values in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T018 [US1] Render the selector or fixed-sample control in the existing header in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [X] T019 [US1] Wire selector change behavior to rebuild the workbench markup from approved sample ids only in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [X] T020 [US1] Add selector readability and stable layout styles in apps/web/src/styles.css
- [X] T021 [US1] Run npm test -- packages/tests/reconciliation-workbench-ui.test.ts

**Checkpoint**: User Story 1 is independently functional and testable as the MVP.

---

## Phase 4: User Story 2 - Restrict Choices to Approved Artifacts (Priority: P2)

**Goal**: Ensure the selector exposes only approved repository-backed sample options or approved mocked contexts and cannot load raw, hosted, uploaded, or real-person data.

**Independent Test**: Inspect the selector options and rendered markup, then confirm every option has approved artifact basis and no upload, URL, raw-source, email, OCR, free-form sample, or real-person data path appears.

### Tests for User Story 2

- [X] T022 [P] [US2] Add failing test that every selector option has approved artifact or approved mocked-context basis in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T023 [P] [US2] Add failing test that selector state and markup expose no upload, URL, hosted sample, raw-source, OCR, email, or free-form loading path in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T024 [P] [US2] Add failing test that selector state, sample context, panels, tables, and trace details contain no real natural-person data markers in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T025 [P] [US2] Add failing unsupported-sample-id test proving current/default approved sample is retained without external loading in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T026 [P] [US2] Add failing selector-allowed approved sample missing required workbench evidence test using existing structured warning/error conventions in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 2

- [X] T027 [US2] Add approved-only validation for sample options in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T028 [US2] Add unsupported sample id fallback behavior that preserves the current/default approved sample in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T029 [US2] Add selector-allowed approved sample missing required workbench evidence handling with existing structured warning/error conventions in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T030 [US2] Ensure rendered selector exposes no file, URL, upload, or free-form input controls in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [X] T031 [US2] Preserve explicit no-real-person-data notice near the selector and sample context in apps/web/src/pages/ReconciliationWorkbenchPage.ts

**Checkpoint**: User Stories 1 and 2 preserve the approved-input boundary and selector restrictions.

---

## Phase 5: User Story 3 - Preserve Existing Workbench Behavior (Priority: P3)

**Goal**: Preserve existing output panels, Shared Facts table, Shared Values table, reconciliation rows, statuses, severities, ordering, and trace expansion behavior after selector changes.

**Independent Test**: Build/render the workbench before and after selected sample resolution, then confirm existing panel/table/trace structures and display-only boundaries remain unchanged.

### Tests for User Story 3

- [X] T032 [P] [US3] Add failing preservation test for three existing output panels after sample selection in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T033 [P] [US3] Add failing preservation test for Shared Facts and Shared Values table columns and deterministic ordering after sample selection in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T034 [P] [US3] Add failing preservation test for reconciliation row statuses, severities, and trace expansion controls after sample selection in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T035 [P] [US3] Add failing display-only regression test proving no adapter write or lower source-layer write field is introduced by selector state in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 3

- [X] T036 [US3] Keep output panel generation unchanged except for selected sample input in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T037 [US3] Keep Shared Facts, Shared Values, reconciliation row, and trace-detail projection unchanged except for selected sample input in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T038 [US3] Keep existing output panel, table, and trace-detail markup structure stable around the selector in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [X] T039 [US3] Run npm test -- packages/tests/reconciliation-workbench-ui.test.ts

**Checkpoint**: All user stories are independently functional while preserving existing workbench behavior.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, browser bundle update, and manual review against quickstart criteria.

- [x] T040 [P] Verify the 10-second active-sample identification check from specs/024-workbench-sample-selector/quickstart.md against the rendered workbench page
- [x] T041 [P] Verify selector/header readability for long labels at desktop and mobile review sizes in apps/web/src/styles.css
- [X] T042 Run npm test -- packages/tests/reconciliation-workbench-ui.test.ts
- [X] T043 Run npm run lint and npm run build
- [X] T044 Update committed static bundle output in apps/web/dist/ if npm run build changes it
- [X] T045 Confirm no delivered .sql, .js, .ts, or .tex artifacts were added outside internal source/test files for specs/024-workbench-sample-selector/tasks.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Phase 1 and blocks all user stories.
- **US1 (Phase 3)**: Depends on Phase 2 and is the MVP.
- **US2 (Phase 4)**: Depends on Phase 2; may run after US1 selector state exists or alongside US1 if coordinated.
- **US3 (Phase 5)**: Depends on Phase 2; preservation validation is clearest after US1 selector rendering exists.
- **Polish (Phase 6)**: Depends on selected user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after foundational tasks; no dependency on US2 or US3.
- **User Story 2 (P2)**: Starts after foundational tasks; integrates with selector option state from US1 for full UI coverage.
- **User Story 3 (P3)**: Starts after foundational tasks; validates preservation around US1/US2 behavior.

### Parallel Opportunities

- T004 can run in parallel with T001-T003.
- T009-T010 can run in parallel after T005-T008 are understood.
- T011-T014 can run in parallel before US1 implementation.
- T022-T026 can run in parallel before US2 implementation.
- T032-T035 can run in parallel before US3 implementation.
- T040-T041 can run in parallel during polish before T042-T044.

---

## Parallel Example: User Story 1

```bash
Task: "T011 Add failing state test for selected sample header and sample context updates in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T012 Add failing state test proving selected sample output panels, Shared Facts rows, Shared Values rows, reconciliation rows, and trace details remain populated in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T013 Add failing markup test for visible selector or fixed-sample control with selected sample label in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T014 Add failing repeated-selection equality test for selected sample display state in packages/tests/reconciliation-workbench-ui.test.ts"
```

---

## Parallel Example: User Story 2

```bash
Task: "T022 Add failing test that every selector option has approved artifact or approved mocked-context basis in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T023 Add failing test that selector state and markup expose no upload, URL, hosted sample, raw-source, OCR, email, or free-form loading path in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T024 Add failing test that selector state, sample context, panels, tables, and trace details contain no real natural-person data markers in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T025 Add failing unsupported-sample-id test proving current/default approved sample is retained without external loading in packages/tests/reconciliation-workbench-ui.test.ts"
```

---

## Parallel Example: User Story 3

```bash
Task: "T032 Add failing preservation test for three existing output panels after sample selection in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T033 Add failing preservation test for Shared Facts and Shared Values table columns and deterministic ordering after sample selection in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T034 Add failing preservation test for reconciliation row statuses, severities, and trace expansion controls after sample selection in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T035 Add failing display-only regression test proving no adapter write or lower source-layer write field is introduced by selector state in packages/tests/reconciliation-workbench-ui.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup inspection.
2. Complete Phase 2 foundational selector state and tests.
3. Complete Phase 3 User Story 1 selector rendering and deterministic selected-sample behavior.
4. Run `npm test -- packages/tests/reconciliation-workbench-ui.test.ts`.
5. Stop and validate the MVP before adding stricter boundary or preservation hardening.

### Incremental Delivery

1. Add User Story 1 to make the selected approved sample visible and deterministic.
2. Add User Story 2 to harden approved-only and no-real-person-data boundaries.
3. Add User Story 3 to lock existing output panels, comparison tables, and trace expansion behavior.
4. Run polish verification, lint, build, and static bundle update.
