# Tasks: Reconciliation Workbench Shared Values

**Input**: Design documents from `/specs/022-workbench-shared-values/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/reconciliation-workbench-shared-values.md, quickstart.md

**Tests**: Required. This slice changes visible deterministic workbench evidence, traceability presentation, status/severity display, and repeated-render stability.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the current workbench and shared-value evidence surfaces before changing the UI.

- [X] T001 Inspect current shared-value evidence fields in packages/shared/src/crossSliceReconciliation.ts
- [X] T002 Inspect current workbench state builder and markup in apps/web/src/app/reconciliationWorkbenchSlice.ts and apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [X] T003 [P] Inspect existing focused workbench tests in packages/tests/reconciliation-workbench-ui.test.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define the display projection and deterministic boundary that every story uses.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Define WorkbenchSharedValueRow and normalized-value display fields in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T005 Define status, severity, absence-marker, and trace cue display helpers in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T006 Add deterministic shared-value row sorting by stable comparison key in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T007 [P] Add focused test coverage for shared_value_rows presence and deterministic ordering in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T008 [P] Add focused test coverage for no raw, hosted, or real-person input dependencies in packages/tests/reconciliation-workbench-ui.test.ts

**Checkpoint**: Workbench state can expose stable Shared Values display rows without renderer changes.

---

## Phase 3: User Story 1 - Compare Shared Values (Priority: P1) MVP

**Goal**: Display a visible analyst-readable Shared Values table with compared sources, fields, raw values, normalized values, status, severity, and trace cues.

**Independent Test**: Load/build the existing workbench for the fixed approved sample and confirm the Shared Values table is visible, ordered deterministically, and contains required comparison columns and row content.

### Tests for User Story 1

- [X] T009 [P] [US1] Add failing state test for Shared Values rows with compared sources, compared fields, raw values, normalized values, status, severity, and trace cue in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T010 [P] [US1] Add failing markup test for a visible Shared Values table and required headers in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T011 [P] [US1] Add failing repeated-build equality test for Shared Values row order and displayed content in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 1

- [X] T012 [US1] Map existing ValueComparisonRecord entries into shared_value_rows in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T013 [US1] Include left/right normalized values, mapping basis, required-or-nullable basis, normalization basis, and trace metadata in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T014 [US1] Render the Shared Values table in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [X] T015 [US1] Add stable analyst-readable Shared Values table styling in apps/web/src/styles.css
- [X] T016 [US1] Run the focused workbench test command from quickstart.md for packages/tests/reconciliation-workbench-ui.test.ts

**Checkpoint**: User Story 1 is independently functional and testable as the MVP.

---

## Phase 4: User Story 2 - Preserve Value Classifications (Priority: P2)

**Goal**: Preserve existing agreement, drift, warning, nullable, unsupported, and formatting-only classifications without display-layer recalculation or semantic renaming.

**Independent Test**: Inspect the Shared Values table for the fixed approved sample and confirm displayed statuses and severities match existing reconciliation evidence, including intentional absence markers when severity or normalization is not applicable.

### Tests for User Story 2

- [ ] T017 [P] [US2] Add failing classification preservation test for agreement, drift, warning, nullable, unsupported, and formatting-only display mapping in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T018 [P] [US2] Add failing absence-marker test for non-applicable normalized values and severities in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 2

- [ ] T019 [US2] Preserve existing ValueComparisonRecord status semantics in Shared Values labels in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T020 [US2] Render explicit absence markers for missing normalized values and non-applicable severities in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [ ] T021 [US2] Run value-reconciliation preservation tests in packages/tests/hardening-cross-slice-value-reconciliation.test.ts and packages/tests/reconciliation-workbench-ui.test.ts

**Checkpoint**: User Stories 1 and 2 preserve existing reconciliation classifications while improving display clarity.

---

## Phase 5: User Story 3 - Preserve Workbench Boundaries (Priority: P3)

**Goal**: Ensure the Shared Values table remains presentation-only, uses approved/mocked sources only, and does not change deterministic outputs or existing adapters.

**Independent Test**: Compare existing output, Shared Facts, Shared Values, and workbench state before and after rendering and confirm no new adapter writes, persistence behavior, raw source reads, or real natural-person data appear.

### Tests for User Story 3

- [ ] T022 [P] [US3] Add failing test proving Shared Values rendering preserves output panels, Shared Facts rows, and existing reconciliation rows in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T023 [P] [US3] Add failing no-real-person-data guardrail test for Shared Values state and markup in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T024 [P] [US3] Add failing adapter-exclusion regression check for BSRS, V1/VE, and valuation listings display-only behavior in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 3

- [ ] T025 [US3] Keep Shared Values generation display-only with no persistence or adapter mutations in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T026 [US3] Keep existing output panels, Shared Facts table, and reconciliation table behavior unchanged while adding Shared Values in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [ ] T027 [US3] Run preservation tests for packages/tests/bsrs-configuration-output-output.test.ts packages/tests/v1-ve-output-output.test.ts packages/tests/valuation-listings-output-output.test.ts packages/tests/hardening-cross-slice-reconciliation.test.ts packages/tests/hardening-cross-slice-value-reconciliation.test.ts

**Checkpoint**: All user stories are independently functional while preserving browser-only and output-adapter boundaries.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, styling checks, static bundle update, and documentation consistency.

- [ ] T028 [P] Verify 10-second identification coverage for Shared Values sources, fields, raw values, normalized values, status, severity, and trace cue against specs/022-workbench-shared-values/quickstart.md
- [ ] T029 [P] Verify long field/value/trace text remains readable at desktop 1440x900 and mobile 390x844 viewports in apps/web/src/styles.css
- [X] T030 Run npm test -- packages/tests/reconciliation-workbench-ui.test.ts
- [X] T031 Run npm run lint and npm run build for package.json workspaces and apps/web/dist/
- [X] T032 Update committed static bundle output in apps/web/dist/ if npm run build changes it
- [X] T033 Confirm no delivered .sql, .js, .ts, or .tex artifacts were added outside internal source/test files for specs/022-workbench-shared-values/tasks.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Phase 1 and blocks all user stories.
- **US1 (Phase 3)**: Depends on Phase 2 and is the MVP.
- **US2 (Phase 4)**: Depends on Phase 2 and can be implemented after or alongside US1, but final rendered validation is clearest after US1.
- **US3 (Phase 5)**: Depends on Phase 2 and should be validated after US1 markup exists.
- **Polish (Phase 6)**: Depends on selected user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after foundational tasks; no dependency on US2 or US3.
- **User Story 2 (P2)**: Starts after foundational tasks; uses the same shared_value_rows projection as US1.
- **User Story 3 (P3)**: Starts after foundational tasks; validates boundaries around the work introduced by US1/US2.

### Parallel Opportunities

- T003 can run in parallel with T001-T002.
- T007-T008 can run in parallel after T004-T006 are understood.
- T009-T011 can run in parallel before US1 implementation.
- T017-T018 can run in parallel before US2 implementation.
- T022-T024 can run in parallel before US3 implementation.
- T028-T029 can run in parallel during polish before T030-T032.

---

## Parallel Example: User Story 1

```bash
# Launch US1 test-writing tasks together:
Task: "T009 Add failing state test for Shared Values rows in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T010 Add failing markup test for visible Shared Values table in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T011 Add failing repeated-build equality test in packages/tests/reconciliation-workbench-ui.test.ts"
```

---

## Parallel Example: User Story 2

```bash
# Launch US2 test-writing tasks together:
Task: "T017 Add failing classification preservation test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T018 Add failing absence-marker test in packages/tests/reconciliation-workbench-ui.test.ts"
```

---

## Parallel Example: User Story 3

```bash
# Launch US3 boundary tests together:
Task: "T022 Add failing preservation test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T023 Add failing no-real-person-data guardrail test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T024 Add failing adapter-exclusion regression check in packages/tests/reconciliation-workbench-ui.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup review.
2. Complete Phase 2 display projection foundation.
3. Complete Phase 3 to expose and render the Shared Values table.
4. Stop and validate with `npm test -- packages/tests/reconciliation-workbench-ui.test.ts`.

### Incremental Delivery

1. US1 adds the visible Shared Values table.
2. US2 tightens classification and absence-marker display.
3. US3 verifies no output, adapter, persistence, raw-input, or real-person-data boundary changes.
4. Polish runs focused tests, preservation tests, lint, build, and static artifact update.

### Notes

- Keep implementation scoped to existing workbench display code and focused tests.
- Do not add schemas, migrations, seeds, business domains, output adapters, raw input readers, hosted services, or persistence writes.
- Preserve DD-backed names and approved fallback names already present in shared-value reconciliation evidence.
