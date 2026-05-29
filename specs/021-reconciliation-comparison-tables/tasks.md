# Tasks: Reconciliation Workbench Comparison Tables

**Input**: Design documents from `/specs/021-reconciliation-comparison-tables/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/reconciliation-comparison-tables.md, quickstart.md

**Tests**: Required. This feature changes a visible browser review surface, deterministic comparison-table ordering, status/severity display, normalized-value display, no-real-person-data guardrails, and committed static build output.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and has no dependency on another incomplete task
- **[Story]**: Which user story this task belongs to
- Exact file paths are included in each task description

## Phase 1: Setup (Shared Context)

**Purpose**: Confirm the current workbench, reconciliation helpers, and display-only scope before changing the page.

- [X] T001 Inspect current workbench state builder and existing reconciliation projection in `apps/web/src/app/reconciliationWorkbenchSlice.ts`
- [X] T002 Inspect current workbench renderer and combined reconciliation table markup in `apps/web/src/pages/ReconciliationWorkbenchPage.ts`
- [X] T003 [P] Inspect current workbench styles and responsive table behavior in `apps/web/src/styles.css`
- [X] T004 [P] Inspect focused workbench tests and existing deterministic render assertions in `packages/tests/reconciliation-workbench-ui.test.ts`
- [X] T005 [P] Inspect shared-fact and shared-value comparison record shapes in `packages/shared/src/crossSliceReconciliation.ts`
- [X] T006 [P] Inspect existing preservation test coverage in `packages/tests/hardening-cross-slice-reconciliation.test.ts`, `packages/tests/hardening-cross-slice-value-reconciliation.test.ts`, `packages/tests/bsrs-configuration-output-output.test.ts`, `packages/tests/v1-ve-output-output.test.ts`, and `packages/tests/valuation-listings-output-output.test.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared table display projections and ordering rules used by all stories.

**CRITICAL**: No user story work should begin until this phase is complete.

- [X] T007 Add or refine display types for shared-fact rows, shared-value rows, comparison status labels, severity labels, and ordering keys in `apps/web/src/app/reconciliationWorkbenchSlice.ts`
- [X] T008 Define deterministic ordering helpers for shared-fact and shared-value table rows in `apps/web/src/app/reconciliationWorkbenchSlice.ts`
- [X] T009 Define intentional absence display markers for missing severity and non-applicable normalized values in `apps/web/src/app/reconciliationWorkbenchSlice.ts`
- [X] T010 Extend focused test helpers for extracting rendered Shared Facts and Shared Values table sections in `packages/tests/reconciliation-workbench-ui.test.ts`
- [X] T011 Verify no new migrations, seeds, schemas, output adapter directories, server endpoints, raw/unreviewed reads, or real natural-person data sources are needed for this feature in `specs/021-reconciliation-comparison-tables/tasks.md`

**Checkpoint**: The workbench comparison-table display boundary is ready for story implementation.

---

## Phase 3: User Story 1 - Compare Shared Facts (Priority: P1) MVP

**Goal**: Show a visible Shared Facts table with compared sources, fields, values, agreement-versus-drift status, severity where applicable, and stable deterministic ordering.

**Independent Test**: `npm test -- packages/tests/reconciliation-workbench-ui.test.ts` confirms the workbench state and markup include a Shared Facts table whose rows expose compared sources, fields, values, status, severity or intentional absence marker, and repeated-load ordering stability.

### Tests for User Story 1

- [X] T012 [US1] Add a failing test that workbench state includes non-empty shared-fact table rows with `fact_label`, left/right sources, left/right fields, left/right values, status, severity label, mapping basis, and ordering key in `packages/tests/reconciliation-workbench-ui.test.ts`
- [X] T013 [US1] Add a failing test that shared-fact rows are sorted by stable ordering key across repeated workbench builds in `packages/tests/reconciliation-workbench-ui.test.ts`
- [X] T014 [US1] Add a failing rendered-markup test that the Shared Facts table is visible and includes compared sources, fields, values, status, and severity or intentional absence marker in `packages/tests/reconciliation-workbench-ui.test.ts`

### Implementation for User Story 1

- [X] T015 [US1] Project existing shared-fact reconciliation comparisons into `shared_fact_rows` display data in `apps/web/src/app/reconciliationWorkbenchSlice.ts`
- [X] T016 [US1] Preserve existing shared-fact classifications while mapping them to analyst-readable status and severity labels in `apps/web/src/app/reconciliationWorkbenchSlice.ts`
- [X] T017 [US1] Render a distinct Shared Facts table in `apps/web/src/pages/ReconciliationWorkbenchPage.ts`
- [X] T018 [US1] Add readable responsive table styles for the Shared Facts table in `apps/web/src/styles.css`
- [X] T019 [US1] Run `npm test -- packages/tests/reconciliation-workbench-ui.test.ts` and resolve US1 failures without changing output adapters or deterministic slice behavior

**Checkpoint**: User Story 1 is independently testable as the comparison-tables MVP.

---

## Phase 4: User Story 2 - Compare Shared Values (Priority: P2)

**Goal**: Show a visible Shared Values table with compared sources, fields, raw values, normalized values where applicable, status, severity where applicable, and stable deterministic ordering.

**Independent Test**: `npm test -- packages/tests/reconciliation-workbench-ui.test.ts` confirms the workbench state and markup include a Shared Values table whose rows expose raw and normalized comparison evidence, status, severity or intentional absence marker, and repeated-load ordering stability.

### Tests for User Story 2

- [X] T020 [US2] Add a failing test that workbench state includes non-empty shared-value table rows with `value_label`, left/right sources, left/right fields, left/right raw values, left/right normalized values, status, severity label, value type, required-or-nullable basis, and ordering key in `packages/tests/reconciliation-workbench-ui.test.ts`
- [X] T021 [US2] Add a failing test that normalized values are displayed when available and use the intentional absence marker when normalization is not applicable in `packages/tests/reconciliation-workbench-ui.test.ts`
- [X] T022 [US2] Add a failing test that shared-value rows are sorted by stable ordering key across repeated workbench builds in `packages/tests/reconciliation-workbench-ui.test.ts`
- [X] T023 [US2] Add a failing rendered-markup test that the Shared Values table is visible and includes compared sources, fields, raw values, normalized values, status, and severity or intentional absence marker in `packages/tests/reconciliation-workbench-ui.test.ts`

### Implementation for User Story 2

- [X] T024 [US2] Project existing shared-value reconciliation comparisons into `shared_value_rows` display data in `apps/web/src/app/reconciliationWorkbenchSlice.ts`
- [X] T025 [US2] Preserve existing shared-value classifications while mapping them to analyst-readable status, severity, nullable, unsupported, and formatting-only labels in `apps/web/src/app/reconciliationWorkbenchSlice.ts`
- [X] T026 [US2] Render a distinct Shared Values table in `apps/web/src/pages/ReconciliationWorkbenchPage.ts`
- [X] T027 [US2] Add readable responsive table styles for raw values, normalized values, and long source names in `apps/web/src/styles.css`
- [X] T028 [US2] Run `npm test -- packages/tests/reconciliation-workbench-ui.test.ts` and resolve US2 failures without changing shared reconciliation helper behavior

**Checkpoint**: User Stories 1 and 2 can be tested independently through the focused workbench suite.

---

## Phase 5: User Story 3 - Preserve Workbench Boundaries (Priority: P3)

**Goal**: Prove the comparison tables remain display-only and do not mutate deterministic outputs, add output adapters, or expose real natural-person data.

**Independent Test**: Focused workbench tests and preservation suites confirm table rendering does not change existing output rows, reconciliation classifications, browser-only boundaries, or no-real-person-data guardrails.

### Tests for User Story 3

- [X] T029 [US3] Add a failing test that rendering Shared Facts and Shared Values tables does not mutate `output_panels`, `reconciliation_rows`, or sample context in `packages/tests/reconciliation-workbench-ui.test.ts`
- [X] T030 [US3] Add a failing test that Shared Facts and Shared Values state and markup retain the explicit no-real-person-data notice and contain only approved sample identifiers or mocked labels for person-level context in `packages/tests/reconciliation-workbench-ui.test.ts`
- [X] T031 [US3] Add a failing repeated-render stability test covering table row counts, ordering keys, displayed compared sources, fields, values, normalized values, statuses, and severities in `packages/tests/reconciliation-workbench-ui.test.ts`

### Implementation for User Story 3

- [X] T032 [US3] Stabilize table projection and rendering so repeated builds produce identical Shared Facts and Shared Values state in `apps/web/src/app/reconciliationWorkbenchSlice.ts`
- [X] T033 [US3] Stabilize table markup generation so repeated renders produce identical Shared Facts and Shared Values markup in `apps/web/src/pages/ReconciliationWorkbenchPage.ts`
- [X] T034 [US3] Verify the implementation adds no persistence calls, migrations, seeds, schemas, output adapter writes, server calls, raw source reads, or real natural-person data sources in `apps/web/src/app/reconciliationWorkbenchSlice.ts` and `apps/web/src/pages/ReconciliationWorkbenchPage.ts`
- [X] T035 [US3] Run `npm test -- packages/tests/reconciliation-workbench-ui.test.ts` and resolve US3 failures without changing existing output or reconciliation classifications

**Checkpoint**: All comparison-table stories are independently functional and boundary-preserving.

---

## Phase 6: Polish & Cross-Cutting Verification

**Purpose**: Documentation, regression checks, browser verification, and committed static artifact discipline.

- [x] T036 [P] Document the comparison-table display-only and no-real-person-data boundary in `docs/architecture/reconciliation_workbench_comparison_tables.md`
- [x] T037 [P] Document displayed Shared Facts and Shared Values columns in `docs/mappings/reconciliation_workbench_comparison_tables_v0.1.0.csv`
- [X] T038 Run existing reconciliation preservation checks with `npm test -- packages/tests/hardening-cross-slice-reconciliation.test.ts packages/tests/hardening-cross-slice-value-reconciliation.test.ts`
- [X] T039 Run existing output preservation checks with `npm test -- packages/tests/bsrs-configuration-output-output.test.ts packages/tests/v1-ve-output-output.test.ts packages/tests/valuation-listings-output-output.test.ts`
- [x] T040 Run the full test suite with `npm test`
- [X] T041 Run lint verification with `npm run lint`
- [X] T042 Run production build verification with `npm run build`
- [X] T043 Update committed static output under `apps/web/dist/` if `npm run build` changes bundle artifacts
- [x] T044 Verify no delivered `.sql`, `.js`, `.ts`, or `.tex` artifact was added without the required appended `.txt` transport copy in `specs/021-reconciliation-comparison-tables/tasks.md`
- [x] T045 Keep or start the local web app on `http://127.0.0.1:5175/` with `npm --workspace @pbgc/web run dev -- --host 127.0.0.1 --port 5175` and verify against `specs/021-reconciliation-comparison-tables/quickstart.md` that an analyst can identify compared sources, fields, values, status, and severity within 10 seconds for both the Shared Facts table and the Shared Values table

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion and is the MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational completion; may reuse table helpers from US1 but remains independently testable.
- **User Story 3 (Phase 5)**: Depends on Foundational completion and validates preservation for the implemented comparison tables.
- **Polish (Phase 6)**: Depends on selected user-story scope completion.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational; no dependency on US2 or US3.
- **User Story 2 (P2)**: Can start after Foundational, but naturally follows US1 to reuse table rendering patterns.
- **User Story 3 (P3)**: Can start after US1 and US2 table projections exist, because it validates their preservation behavior.

### Within Each User Story

- Add failing tests before implementation tasks for that story.
- Keep all table data derived from approved committed samples, existing deterministic outputs, existing reconciliation evidence, DD/fallback metadata, and mocked display labels.
- Preserve display-only behavior and avoid persistence, adapter, calculation, source-layer, or raw-input changes.
- Run focused tests before moving to the next story.

---

## Parallel Opportunities

- T003, T004, T005, and T006 can run in parallel during Setup.
- T012, T013, and T014 all edit the same test file and should remain sequential.
- T020, T021, T022, and T023 all edit the same test file and should remain sequential.
- T029, T030, and T031 all edit the same test file and should remain sequential.
- T036 and T037 can run in parallel because they update separate documentation files.
- T038 and T039 can run in parallel because they execute independent regression groups.

---

## Parallel Example: Polish Verification

```bash
# Run preservation checks independently:
Task: "T038 Run existing reconciliation preservation checks"
Task: "T039 Run existing output preservation checks"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate with `npm test -- packages/tests/reconciliation-workbench-ui.test.ts`.

### Incremental Delivery

1. Add US1 to expose the Shared Facts comparison table.
2. Add US2 to expose the Shared Values comparison table with normalized values.
3. Add US3 to lock down display-only, deterministic, no-real-person-data behavior.
4. Complete Phase 6 verification and update committed static build output if changed.
