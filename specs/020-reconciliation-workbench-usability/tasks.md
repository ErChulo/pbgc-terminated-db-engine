# Tasks: Reconciliation Workbench Usability

**Input**: Design documents from `/specs/020-reconciliation-workbench-usability/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/reconciliation-workbench-usability.md, quickstart.md

**Tests**: Required. This feature changes a visible browser review surface, no-real-person-data guardrails, trace expansion, deterministic rendering, and committed static build output.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and has no dependency on another incomplete task
- **[Story]**: Which user story the task belongs to
- Exact file paths are included in each task description

## Phase 1: Setup (Shared Context)

**Purpose**: Confirm the current workbench implementation, reconciliation helpers, and approved/mock display boundary before changing the page.

- [ ] T001 Inspect current workbench data builder and deterministic field selection in `apps/web/src/app/reconciliationWorkbenchSlice.ts`
- [ ] T002 Inspect current workbench renderer and markup structure in `apps/web/src/pages/ReconciliationWorkbenchPage.ts`
- [ ] T003 [P] Inspect current workbench styles and responsive constraints in `apps/web/src/styles.css`
- [ ] T004 [P] Inspect existing focused workbench tests in `packages/tests/reconciliation-workbench-ui.test.ts`
- [ ] T005 [P] Inspect shared-fact and shared-value reconciliation helpers in `packages/shared/src/crossSliceReconciliation.ts`
- [ ] T006 [P] Inspect approved sample fixture sources in `packages/tests/bsrs-configuration-output-fixtures.ts`, `packages/tests/v1-ve-output-fixtures.ts`, and `packages/tests/valuation-listings-output-fixtures.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared presentation model and guardrails used by all usability stories.

**CRITICAL**: No user story work should begin until this phase is complete.

- [ ] T007 Add or refine workbench sample context, mocked label, business panel, shared-fact row, shared-value row, and trace-detail display types in `apps/web/src/app/reconciliationWorkbenchSlice.ts`
- [ ] T008 Define the fixed approved-sample label and mocked no-real-person-data display contract in `apps/web/src/app/reconciliationWorkbenchSlice.ts`
- [ ] T009 Extend focused test helpers for stable workbench state and rendered markup assertions in `packages/tests/reconciliation-workbench-ui.test.ts`
- [ ] T010 Verify no new migrations, seeds, schemas, output adapter directories, server endpoints, raw/unreviewed reads, or real natural-person data sources are needed for this feature in `specs/020-reconciliation-workbench-usability/tasks.md`

**Checkpoint**: The workbench usability data boundary is ready for story implementation.

---

## Phase 3: User Story 1 - Recognize the Approved Sample (Priority: P1) MVP

**Goal**: Show a recognizable first-visible header with approved sample identity, fixed-sample scope, mocked case/population context, and no-real-person-data notice.

**Independent Test**: `npm test -- packages/tests/reconciliation-workbench-ui.test.ts` confirms the workbench header identifies the approved sample, mocked context, fixed-sample scope, and no-real-person-data notice.

### Tests for User Story 1

- [ ] T011 [US1] Add a failing test that the workbench state includes approved sample identity, fixed-sample label, mocked case label, mocked population label, and no-real-person-data notice in `packages/tests/reconciliation-workbench-ui.test.ts`
- [ ] T012 [US1] Add a failing test that rendered markup shows the approved sample identity, fixed-sample label, mocked context, and no-real-person-data notice in the first visible header area in `packages/tests/reconciliation-workbench-ui.test.ts`
- [ ] T013 [US1] Add a failing test that the workbench state and markup contain no real-person-data markers beyond explicitly mocked labels in `packages/tests/reconciliation-workbench-ui.test.ts`

### Implementation for User Story 1

- [ ] T014 [US1] Add deterministic sample context and mocked display labels to `apps/web/src/app/reconciliationWorkbenchSlice.ts`
- [ ] T015 [US1] Render the recognizable sample header, fixed-sample label, mocked context, and no-real-person-data notice in `apps/web/src/pages/ReconciliationWorkbenchPage.ts`
- [ ] T016 [US1] Style the sample header and privacy notice for first-visible readability in `apps/web/src/styles.css`
- [ ] T017 [US1] Run `npm test -- packages/tests/reconciliation-workbench-ui.test.ts` and resolve US1 failures without changing output adapters or deterministic slice behavior

**Checkpoint**: User Story 1 is independently testable as the usability MVP.

---

## Phase 4: User Story 2 - Compare Business Panels and Shared Facts (Priority: P2)

**Goal**: Show clearly labeled business panels plus separate visible shared-facts and shared-values tables with status and compared evidence.

**Independent Test**: `npm test -- packages/tests/reconciliation-workbench-ui.test.ts` confirms business panel labels and both reconciliation tables are visible with statuses, compared slices, fields, and values.

### Tests for User Story 2

- [ ] T018 [US2] Add a failing test that each output panel has a business label and business purpose in `packages/tests/reconciliation-workbench-ui.test.ts`
- [ ] T019 [US2] Add a failing test that workbench data includes a visible shared-facts table model with statuses, compared slices, fields, and values in `packages/tests/reconciliation-workbench-ui.test.ts`
- [ ] T020 [US2] Add a failing test that workbench data includes a visible shared-values table model with statuses, compared slices, fields, values, and nullable/absence classifications in `packages/tests/reconciliation-workbench-ui.test.ts`
- [ ] T021 [US2] Add a failing test that rendered markup includes separate Shared Facts and Shared Values sections in `packages/tests/reconciliation-workbench-ui.test.ts`

### Implementation for User Story 2

- [ ] T022 [US2] Add business labels and purposes for BSRS configuration, V1/VE output, and valuation listings panels in `apps/web/src/app/reconciliationWorkbenchSlice.ts`
- [ ] T023 [US2] Build shared-fact row display data from existing shared-fact reconciliation evidence in `apps/web/src/app/reconciliationWorkbenchSlice.ts`
- [ ] T024 [US2] Build shared-value row display data from existing shared-value reconciliation evidence in `apps/web/src/app/reconciliationWorkbenchSlice.ts`
- [ ] T025 [US2] Render business panel labels, Shared Facts table, and Shared Values table in `apps/web/src/pages/ReconciliationWorkbenchPage.ts`
- [ ] T026 [US2] Add readable table and status styles for business panels, shared facts, and shared values in `apps/web/src/styles.css`
- [ ] T027 [US2] Run `npm test -- packages/tests/reconciliation-workbench-ui.test.ts` and resolve US2 failures while preserving existing reconciliation helper outputs

**Checkpoint**: User Stories 1 and 2 can be tested independently through the focused workbench suite.

---

## Phase 5: User Story 3 - Expand Trace Details (Priority: P3)

**Goal**: Add clickable row-level trace expansion that reveals source artifact, rule version, producing module, mapping basis, and compared evidence without leaving the workbench.

**Independent Test**: `npm test -- packages/tests/reconciliation-workbench-ui.test.ts` confirms trace expansion markup/state exposes required trace fields and repeated rendering remains stable.

### Tests for User Story 3

- [ ] T028 [US3] Add a failing test that each expandable shared-fact row includes trace detail fields for source artifact, rule version, producing module, mapping basis, compared slices, fields, and values in `packages/tests/reconciliation-workbench-ui.test.ts`
- [ ] T029 [US3] Add a failing test that each expandable shared-value row includes trace detail fields for source artifact, rule version, producing module, mapping basis, compared slices, fields, values, and normalized values when available in `packages/tests/reconciliation-workbench-ui.test.ts`
- [ ] T030 [US3] Add a failing rendered-markup test for clickable trace-detail expansion controls without navigation in `packages/tests/reconciliation-workbench-ui.test.ts`
- [ ] T031 [US3] Add a repeated-render stability test covering header, panel order, row order, statuses, and trace-detail content in `packages/tests/reconciliation-workbench-ui.test.ts`

### Implementation for User Story 3

- [ ] T032 [US3] Add trace-detail projection for shared-fact and shared-value rows in `apps/web/src/app/reconciliationWorkbenchSlice.ts`
- [ ] T033 [US3] Render row-level clickable trace expansion controls and expanded trace detail content in `apps/web/src/pages/ReconciliationWorkbenchPage.ts`
- [ ] T034 [US3] Add styles for expanded trace content, long source paths, and non-overlapping detail rows in `apps/web/src/styles.css`
- [ ] T035 [US3] Stabilize deterministic ordering and markup generation for expanded trace details in `apps/web/src/app/reconciliationWorkbenchSlice.ts` and `apps/web/src/pages/ReconciliationWorkbenchPage.ts`
- [ ] T036 [US3] Run `npm test -- packages/tests/reconciliation-workbench-ui.test.ts` and resolve US3 failures without adding persistence or output-adapter behavior

**Checkpoint**: All usability stories are independently functional on the existing workbench page.

---

## Phase 6: Polish & Cross-Cutting Verification

**Purpose**: Documentation, browser verification, regression checks, and committed static artifact discipline.

- [ ] T037 [P] Document the workbench usability display-only and no-real-person-data boundary in `docs/architecture/reconciliation_workbench_usability.md`
- [ ] T038 [P] Document the displayed shared-fact, shared-value, and trace fields in `docs/mappings/reconciliation_workbench_usability_map_v0.1.0.csv`
- [ ] T039 Run existing reconciliation checks with `npm test -- packages/tests/hardening-cross-slice-reconciliation.test.ts packages/tests/hardening-cross-slice-value-reconciliation.test.ts`
- [ ] T040 Run existing output preservation checks with `npm test -- packages/tests/bsrs-configuration-output-output.test.ts packages/tests/v1-ve-output-output.test.ts packages/tests/valuation-listings-output-output.test.ts`
- [ ] T041 Run full test suite for `packages/tests/` with `npm test`
- [ ] T042 Run lint verification for `tsconfig.json` with `npm run lint`
- [ ] T043 Run production build verification for `apps/web/` with `npm run build`
- [ ] T044 Update committed static output under `apps/web/dist/` if `npm run build` changes bundle artifacts
- [ ] T045 Verify no delivered `.sql`, `.js`, `.ts`, or `.tex` artifact was added without the required appended `.txt` transport copy in `specs/020-reconciliation-workbench-usability/tasks.md`
- [ ] T046 Start or keep the local web app on `http://127.0.0.1:5175/` with `npm --workspace @pbgc/web run dev -- --port 5175` and verify the workbench manually against `specs/020-reconciliation-workbench-usability/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion and is the MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational completion; may use US1 header structures but remains independently testable.
- **User Story 3 (Phase 5)**: Depends on Foundational completion; may use US2 row structures but remains independently testable.
- **Polish (Phase 6)**: Depends on selected user-story scope completion.

### User Story Dependencies

- **US1**: Can start after Foundational; no dependency on US2 or US3.
- **US2**: Can start after Foundational, but integrates with the page structures visible after US1.
- **US3**: Can start after Foundational, but trace expansion is most useful after shared-fact and shared-value rows are present.

### Within Each User Story

- Add failing tests before implementation tasks for that story.
- Keep all workbench data derived from approved committed samples, mocked labels, and existing deterministic outputs.
- Preserve display-only behavior and avoid persistence, adapter, or source-layer writes.
- Run focused tests before moving to the next story.

---

## Parallel Opportunities

- T003, T004, T005, and T006 can run in parallel during Setup.
- T018, T019, T020, and T021 all edit the same test file and should remain sequential.
- T028, T029, T030, and T031 all edit the same test file and should remain sequential.
- T037 and T038 can run in parallel because they update separate documentation files.
- T039 and T040 can run in parallel because they execute independent regression groups.

---

## Parallel Example: Polish Verification

```bash
# Run preservation checks independently:
Task: "T039 Run existing reconciliation checks"
Task: "T040 Run existing output preservation checks"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate with `npm test -- packages/tests/reconciliation-workbench-ui.test.ts`.

### Incremental Delivery

1. Add US1 to make sample context and no-real-person-data boundary clear.
2. Add US2 to improve business panel labels and expose shared-fact/shared-value tables.
3. Add US3 to add row-level trace expansion.
4. Complete Phase 6 verification and update committed static build output if changed.
