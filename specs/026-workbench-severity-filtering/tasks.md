# Tasks: Reconciliation Workbench Severity Filtering

**Input**: Design documents from `/specs/026-workbench-severity-filtering/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/reconciliation-workbench-severity-filtering.md, quickstart.md

**Tests**: Required for this slice because severity filtering changes deterministic browser display state, traceability preservation, combined-filter behavior, empty-state behavior, and output-shape stability for existing workbench rows.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the existing status-filtering implementation surface and severity-bearing row models before adding severity filters.

- [ ] T001 Inspect current status filter state, filtered row groups, and workbench row severity fields in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T002 Inspect current filter control rendering, sample selector behavior, table rendering, and trace expansion markup in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [ ] T003 [P] Inspect current filter and table styles in apps/web/src/styles.css
- [ ] T004 [P] Inspect existing status-filtering and workbench regression coverage in packages/tests/reconciliation-workbench-ui.test.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add shared deterministic severity filter model pieces that all user stories depend on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T005 Extend display-only filter state, filter option, filtered row group, and filter summary types with severity fields in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T006 Add deterministic severity option derivation helpers from existing row severity values and none/not-applicable conventions in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T007 Update deterministic row filtering helpers to apply status and severity filters while preserving original row order in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T008 Add severity filter inputs to buildApprovedSampleReconciliationWorkbench without changing sample selection or status filter defaults in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T009 [P] Add baseline regression tests for derived severity option ordering and repeated-run equality in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T010 Verify no new persistence, lower source-layer writes, output adapter writes, server calls, raw input reads, or real-person data paths are introduced in apps/web/src/app/reconciliationWorkbenchSlice.ts

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Filter Rows by Severity (Priority: P1) MVP

**Goal**: Let analysts filter reconciliation rows, Shared Facts rows, and Shared Values rows by existing severity values where severity applies while preserving deterministic ordering and clear/reset behavior.

**Independent Test**: Load an approved sample, choose a severity filter, and confirm applicable rows show only matching severities or deterministic empty states, then clear the filter and confirm rows return in the expected deterministic order.

### Tests for User Story 1

- [ ] T011 [P] [US1] Add a failing severity filter option test for existing severity and none/not-applicable choices in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T012 [P] [US1] Add a failing severity filtering test covering reconciliation rows, Shared Facts rows, and Shared Values rows in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T013 [P] [US1] Add a failing Shared Facts none/error convention test for severity filtering in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T014 [P] [US1] Add a failing clear-severity-filter test that restores row counts and deterministic ordering in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T015 [P] [US1] Add a failing severity empty-state test for row groups with no matching rows in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T016 [P] [US1] Add a failing markup test for visible active severity filter controls and labels in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 1

- [ ] T017 [US1] Wire active severity filter values into the workbench state builder in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T018 [US1] Expose severity-filtered reconciliation rows, Shared Facts rows, Shared Values rows, and severity filter summary in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T019 [US1] Apply Shared Facts none/error severity conventions without inventing new severity names in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T020 [US1] Render visible severity filter controls and active severity labels in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [ ] T021 [US1] Render severity-filtered row groups and deterministic empty states for reconciliation rows, Shared Facts rows, and Shared Values rows in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [ ] T022 [US1] Preserve approved-sample selector behavior while passing active severity filter state through browser re-renders in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [ ] T023 [US1] Style severity filter controls, active severity labels, and severity empty states in apps/web/src/styles.css

**Checkpoint**: User Story 1 is independently functional and testable as the MVP.

---

## Phase 4: User Story 2 - Combine Severity and Status Filters (Priority: P2)

**Goal**: Let analysts combine the existing status filter with the new severity filter so visible applicable rows satisfy both filters and clear/reset behavior remains deterministic.

**Independent Test**: Apply a status filter and a severity filter together, confirm every visible applicable row satisfies both filters or shows an empty state, then clear one filter and confirm the other remains active with stable ordering.

### Tests for User Story 2

- [ ] T024 [P] [US2] Add a failing combined status-and-severity filtering test for all row groups in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T025 [P] [US2] Add a failing clear-severity-while-status-active test that restores status-filtered ordering in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T026 [P] [US2] Add a failing clear-status-while-severity-active test that preserves severity-filtered ordering in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T027 [P] [US2] Add a failing combined-filter empty-state test in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 2

- [ ] T028 [US2] Update filter projection to combine active status and severity filters in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T029 [US2] Update filter summary counts and active filter labels for combined filters in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T030 [US2] Wire status and severity filter controls so browser re-renders preserve both active filters in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [ ] T031 [US2] Render combined-filter empty-state messages that identify active status and severity context in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [ ] T032 [US2] Style combined-filter controls and count summaries without disrupting existing table layout in apps/web/src/styles.css

**Checkpoint**: User Stories 1 and 2 are independently functional and testable.

---

## Phase 5: User Story 3 - Preserve Workbench Context While Severity Filtering (Priority: P3)

**Goal**: Ensure severity filtering remains a display-only review aid that preserves approved-sample selection, sample header, output panels, existing status filter, trace expansion behavior, deterministic ordering, browser-only boundaries, and no-real-person-data guarantees.

**Independent Test**: Apply, combine, and clear severity filters across approved samples and confirm the sample selector, sample header, output panels, trace details, row order, and deterministic browser-only boundaries remain stable.

### Tests for User Story 3

- [ ] T033 [P] [US3] Add a failing preservation test for sample selector, sample header, three output panels, and existing status filter while severity filters are active in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T034 [P] [US3] Add a failing trace expansion preservation test for visible severity-filtered rows in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T035 [P] [US3] Add a failing repeated-run stability test for severity and combined-filter states across at least two builds in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T036 [P] [US3] Add a failing boundary test proving severity filters do not expose raw, hosted, uploaded, free-form, URL-loaded, or real-person data paths in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T037 [P] [US3] Add a failing display-only regression test proving severity filtering does not write output-adapter rows or lower source-layer records in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 3

- [ ] T038 [US3] Preserve selected approved sample identity and deterministic severity/status filter behavior on sample changes in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [ ] T039 [US3] Preserve output panel rendering and sample context rendering while severity-filtered row groups change in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [ ] T040 [US3] Preserve trace-detail identifiers and content for visible severity-filtered rows in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [ ] T041 [US3] Preserve deterministic filter summaries, visible row counts, and original row ordering evidence in apps/web/src/app/reconciliationWorkbenchSlice.ts

**Checkpoint**: All user stories are independently functional and preserve existing workbench behavior.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete slice, update committed browser output, and document manual review evidence.

- [ ] T042 Run focused workbench regression tests with npm test -- packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T043 Run project lint verification with npm run lint using package.json
- [ ] T044 Run browser static build verification with npm run build using package.json and apps/web/dist/
- [ ] T045 Update committed Vite static output in apps/web/dist/ after successful build if bundle contents changed
- [ ] T046 Perform the 10-second check that the analyst can identify and apply the severity filter on desktop 1440x900 and mobile 390x844 and record the result in specs/026-workbench-severity-filtering/quickstart.md
- [ ] T047 Verify filtered workbench markup still contains no real participant, beneficiary, alternate payee, survivor, or other natural-person data in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T048 Confirm no delivered .sql, .js, .ts, or .tex delivery-copy artifact is introduced for this internal UI/test slice in specs/026-workbench-severity-filtering/tasks.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 Setup: no dependencies.
- Phase 2 Foundational: depends on Phase 1 and blocks all user stories.
- Phase 3 US1: depends on Phase 2 and is the MVP.
- Phase 4 US2: depends on Phase 2 and integrates with existing status filtering plus US1 severity state.
- Phase 5 US3: depends on Phase 2 and validates preservation across severity and combined filtering.
- Phase 6 Polish: depends on the desired user stories being complete.

### User Story Dependencies

- US1 Filter Rows by Severity: independent after Phase 2.
- US2 Combine Severity and Status Filters: depends on severity filter state from US1 and existing status filter behavior.
- US3 Preserve Workbench Context While Severity Filtering: independent after Phase 2, with preservation checks across any implemented filters.

### Within Each User Story

- Write the story tests first and confirm they fail before implementation.
- Update deterministic state helpers before browser markup.
- Update markup before CSS polish.
- Keep filtering display-only and avoid persistence, output-adapter, lower source-layer, server, raw-input, and real-person-data changes.

---

## Parallel Opportunities

- Setup inspections T003 and T004 can run in parallel with T001 and T002.
- Foundational test T009 can run in parallel with helper implementation T005-T008 after the existing row model is understood.
- US1 tests T011-T016 can be written in parallel because they target separate severity assertions in packages/tests/reconciliation-workbench-ui.test.ts.
- US2 tests T024-T027 can be written in parallel because they target separate combined-filter assertions.
- US3 tests T033-T037 can be written in parallel because they target preservation, traceability, determinism, boundary, and display-only invariants.
- CSS tasks T023 and T032 can proceed after their corresponding markup tasks are in place.

---

## Parallel Example: User Story 1

```bash
# Write independent US1 tests before implementation:
Task: "T011 [US1] Add a failing severity filter option test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T012 [US1] Add a failing severity filtering test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T013 [US1] Add a failing Shared Facts none/error convention test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T014 [US1] Add a failing clear-severity-filter test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T015 [US1] Add a failing severity empty-state test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T016 [US1] Add a failing markup test for visible active severity filter controls in packages/tests/reconciliation-workbench-ui.test.ts"
```

## Parallel Example: User Story 2

```bash
# Write independent US2 tests before implementation:
Task: "T024 [US2] Add a failing combined status-and-severity filtering test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T025 [US2] Add a failing clear-severity-while-status-active test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T026 [US2] Add a failing clear-status-while-severity-active test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T027 [US2] Add a failing combined-filter empty-state test in packages/tests/reconciliation-workbench-ui.test.ts"
```

## Parallel Example: User Story 3

```bash
# Write independent US3 tests before implementation:
Task: "T033 [US3] Add a failing preservation test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T034 [US3] Add a failing trace expansion preservation test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T035 [US3] Add a failing repeated-run stability test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T036 [US3] Add a failing boundary test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T037 [US3] Add a failing display-only regression test in packages/tests/reconciliation-workbench-ui.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup inspections.
2. Complete Phase 2 foundational severity filter state and deterministic helpers.
3. Complete Phase 3 User Story 1 severity filtering.
4. Stop and validate with `npm test -- packages/tests/reconciliation-workbench-ui.test.ts`.
5. Build and update `apps/web/dist/` only if the browser bundle changes.

### Incremental Delivery

1. Add severity filtering as the MVP.
2. Add combined status-and-severity filtering.
3. Add preservation regressions for sample context, output panels, trace expansion, deterministic ordering, and display-only boundaries.
4. Run focused tests, lint, build, and manual viewport review.

### Notes

- [P] tasks touch separate assertions or files and can be parallelized without same-file conflicts where noted.
- All task descriptions include concrete repository paths.
- Filtering must derive options only from existing row values and must not invent status or severity vocabularies.
- Internal `.ts` source and test changes are not delivered email-copy artifacts; no `.txt` delivery-copy task is required unless a delivered artifact is introduced later.
