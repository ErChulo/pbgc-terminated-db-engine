# Tasks: Reconciliation Workbench Status Filtering

**Input**: Design documents from `/specs/025-workbench-status-filtering/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/reconciliation-workbench-status-filtering.md, quickstart.md

**Tests**: Required for this slice because filtering changes deterministic browser display state, traceability preservation, empty-state behavior, and output-shape stability for existing workbench rows.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the existing workbench implementation surface and test baseline before adding display filters.

- [ ] T001 Inspect current workbench state types, row models, and sample selector behavior in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T002 Inspect current workbench markup, trace expansion, and sample selector rendering in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [ ] T003 [P] Inspect current workbench styles and responsive table patterns in apps/web/src/styles.css
- [ ] T004 [P] Inspect existing workbench regression coverage and reusable assertions in packages/tests/reconciliation-workbench-ui.test.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add shared deterministic filter model pieces that all user stories depend on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T005 Define display-only filter state, filter option, filtered row group, and filter summary types in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T006 Add deterministic status and severity option derivation helpers from existing row values in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T007 Add deterministic row filtering helpers that preserve original row order and produce row-group empty-state metadata in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T008 Add filter inputs to buildApprovedSampleReconciliationWorkbench without changing sample selection defaults in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T009 [P] Add baseline regression tests for derived filter option ordering and repeated-run equality in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T010 Verify no new persistence, lower source-layer writes, output adapter writes, server calls, raw input reads, or real-person data paths are introduced in apps/web/src/app/reconciliationWorkbenchSlice.ts

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Filter Rows by Status (Priority: P1) MVP

**Goal**: Let analysts filter reconciliation rows, Shared Facts rows, and Shared Values rows by existing reconciliation status values while preserving deterministic ordering and visible active filter state.

**Independent Test**: Load an approved sample, choose a status filter, and confirm all three row groups show only matching rows or deterministic empty states, then clear the filter and confirm original row counts and ordering return.

### Tests for User Story 1

- [ ] T011 [P] [US1] Add a failing status filter option test for existing row statuses and unfiltered choice in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T012 [P] [US1] Add a failing status filtering test covering reconciliation rows, Shared Facts rows, and Shared Values rows in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T013 [P] [US1] Add a failing clear-status-filter test that restores original row counts and ordering in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T014 [P] [US1] Add a failing status empty-state test for row groups with no matching rows in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T015 [P] [US1] Add a failing markup test for visible active status filter controls and labels in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 1

- [ ] T016 [US1] Wire active status filter values into the workbench state builder in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T017 [US1] Expose filtered reconciliation rows, filtered Shared Facts rows, filtered Shared Values rows, and status filter summary in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T018 [US1] Render visible status filter controls and active status labels in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [ ] T019 [US1] Render status-filtered row groups and deterministic empty states for reconciliation rows, Shared Facts rows, and Shared Values rows in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [ ] T020 [US1] Preserve approved-sample selector behavior while passing active status filter state through browser re-renders in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [ ] T021 [US1] Style status filter controls, active filter labels, and row-group empty states in apps/web/src/styles.css

**Checkpoint**: User Story 1 is independently functional and testable as the MVP.

---

## Phase 4: User Story 2 - Filter Rows by Severity (Priority: P2)

**Goal**: Let analysts filter rows by existing severity values where severity applies, using the established none/not-applicable conventions and combining correctly with status filters.

**Independent Test**: Apply each available severity filter and confirm applicable rows match the selected severity or show deterministic empty states, then combine with a status filter and confirm rows satisfy both filters.

### Tests for User Story 2

- [ ] T022 [P] [US2] Add a failing severity filter option test for existing severity and none/not-applicable conventions in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T023 [P] [US2] Add a failing severity filtering test for reconciliation rows and Shared Values rows in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T024 [P] [US2] Add a failing Shared Facts none/error convention test for severity filtering in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T025 [P] [US2] Add a failing combined status-and-severity filtering test in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 2

- [ ] T026 [US2] Wire active severity filter values into the workbench state builder in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T027 [US2] Apply severity filtering with existing severity and none/not-applicable conventions in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T028 [US2] Apply combined status and severity filter projection without changing original ordering in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T029 [US2] Render visible severity filter controls, active severity labels, and combined-filter empty states in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [ ] T030 [US2] Style severity filter controls and combined-filter count summaries in apps/web/src/styles.css

**Checkpoint**: User Stories 1 and 2 are independently functional and testable.

---

## Phase 5: User Story 3 - Preserve Workbench Context While Filtering (Priority: P3)

**Goal**: Ensure filtering remains a display-only review aid that preserves approved-sample selection, sample header, output panels, trace expansion behavior, deterministic ordering, browser-only boundaries, and no-real-person-data guarantees.

**Independent Test**: Apply and clear filters across approved samples and confirm the sample selector, sample header, output panels, trace details, row order, and deterministic browser-only boundaries remain stable.

### Tests for User Story 3

- [ ] T031 [P] [US3] Add a failing preservation test for sample selector, sample header, and three output panels while filters are active in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T032 [P] [US3] Add a failing trace expansion preservation test for visible filtered rows in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T033 [P] [US3] Add a failing repeated-run stability test for filtered states across at least two builds in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T034 [P] [US3] Add a failing boundary test proving filters do not expose raw, hosted, uploaded, free-form, URL-loaded, or real-person data paths in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T035 [P] [US3] Add a failing display-only regression test proving filtering does not write output-adapter rows or lower source-layer records in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 3

- [ ] T036 [US3] Preserve selected approved sample identity and reset or carry filter state deterministically on sample changes in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [ ] T037 [US3] Preserve output panel rendering and sample context rendering while filtered row groups change in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [ ] T038 [US3] Preserve trace-detail identifiers and content for visible filtered rows in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [ ] T039 [US3] Preserve deterministic filter summaries, visible row counts, and original row ordering evidence in apps/web/src/app/reconciliationWorkbenchSlice.ts

**Checkpoint**: All user stories are independently functional and preserve existing workbench behavior.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete slice, update committed browser output, and document manual review evidence.

- [ ] T040 Run focused workbench regression tests with npm test -- packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T041 Run project lint verification with npm run lint using package.json
- [ ] T042 Run browser static build verification with npm run build using package.json and apps/web/dist/
- [ ] T043 Update committed Vite static output in apps/web/dist/ after successful build if bundle contents changed
- [ ] T044 Perform the 10-second check that the analyst can identify and apply the status filter on desktop 1440x900 and mobile 390x844 and record the result in specs/025-workbench-status-filtering/quickstart.md
- [ ] T045 Verify filtered workbench markup still contains no real participant, beneficiary, alternate payee, survivor, or other natural-person data in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T046 Confirm no delivered .sql, .js, .ts, or .tex delivery-copy artifact is introduced for this internal UI/test slice in specs/025-workbench-status-filtering/tasks.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 Setup: no dependencies.
- Phase 2 Foundational: depends on Phase 1 and blocks all user stories.
- Phase 3 US1: depends on Phase 2 and is the MVP.
- Phase 4 US2: depends on Phase 2 and integrates with the shared filter model; it can be developed after or alongside US1 once the foundation exists.
- Phase 5 US3: depends on Phase 2 and validates preservation across US1/US2 behavior.
- Phase 6 Polish: depends on the desired user stories being complete.

### User Story Dependencies

- US1 Filter Rows by Status: independent after Phase 2.
- US2 Filter Rows by Severity: independent after Phase 2, with combined-filter checks integrating with US1 state.
- US3 Preserve Workbench Context While Filtering: independent after Phase 2, with preservation checks across any implemented filters.

### Within Each User Story

- Write the story tests first and confirm they fail before implementation.
- Update deterministic state helpers before browser markup.
- Update markup before CSS polish.
- Keep filtering display-only and avoid persistence, output-adapter, lower source-layer, server, raw-input, and real-person-data changes.

---

## Parallel Opportunities

- Setup inspections T003 and T004 can run in parallel with T001 and T002.
- Foundational test T009 can run in parallel with helper implementation T005-T008 after the existing row model is understood.
- US1 tests T011-T015 can be written in parallel because they target separate assertions in packages/tests/reconciliation-workbench-ui.test.ts.
- US2 tests T022-T025 can be written in parallel because they target separate severity and combined-filter assertions.
- US3 tests T031-T035 can be written in parallel because they target preservation, traceability, determinism, boundary, and display-only invariants.
- CSS tasks T021 and T030 can proceed after their corresponding markup tasks are in place.

---

## Parallel Example: User Story 1

```bash
# Write independent US1 tests before implementation:
Task: "T011 [US1] Add a failing status filter option test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T012 [US1] Add a failing status filtering test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T013 [US1] Add a failing clear-status-filter test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T014 [US1] Add a failing status empty-state test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T015 [US1] Add a failing markup test for visible active status filter controls in packages/tests/reconciliation-workbench-ui.test.ts"
```

## Parallel Example: User Story 2

```bash
# Write independent US2 tests before implementation:
Task: "T022 [US2] Add a failing severity filter option test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T023 [US2] Add a failing severity filtering test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T024 [US2] Add a failing Shared Facts none/error convention test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T025 [US2] Add a failing combined status-and-severity filtering test in packages/tests/reconciliation-workbench-ui.test.ts"
```

## Parallel Example: User Story 3

```bash
# Write independent US3 tests before implementation:
Task: "T031 [US3] Add a failing preservation test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T032 [US3] Add a failing trace expansion preservation test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T033 [US3] Add a failing repeated-run stability test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T034 [US3] Add a failing boundary test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T035 [US3] Add a failing display-only regression test in packages/tests/reconciliation-workbench-ui.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup inspections.
2. Complete Phase 2 foundational filter state and deterministic helpers.
3. Complete Phase 3 User Story 1 status filtering.
4. Stop and validate with `npm test -- packages/tests/reconciliation-workbench-ui.test.ts`.
5. Build and update `apps/web/dist/` only if the browser bundle changes.

### Incremental Delivery

1. Add status filtering as the MVP.
2. Add severity and combined filtering.
3. Add preservation regressions for sample context, output panels, trace expansion, deterministic ordering, and display-only boundaries.
4. Run focused tests, lint, build, and manual viewport review.

### Notes

- [P] tasks touch separate assertions or files and can be parallelized without same-file conflicts where noted.
- All task descriptions include concrete repository paths.
- Filtering must derive options only from existing row values and must not invent status or severity vocabularies.
- Internal `.ts` source and test changes are not delivered email-copy artifacts; no `.txt` delivery-copy task is required unless a delivered artifact is introduced later.
