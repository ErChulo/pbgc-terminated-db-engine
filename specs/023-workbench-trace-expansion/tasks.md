# Tasks: Reconciliation Workbench Trace Expansion

**Input**: Design documents from `/specs/023-workbench-trace-expansion/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/reconciliation-workbench-trace-expansion.md, quickstart.md

**Tests**: Required. This slice changes deterministic workbench traceability presentation, expansion markup, repeated-render stability, and boundary guardrails.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the current workbench row evidence and renderer structure before adding expansion behavior.

- [ ] T001 Inspect current reconciliation row evidence in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T002 Inspect current Shared Facts and Shared Values row evidence in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T003 Inspect current workbench markup structure in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [ ] T004 [P] Inspect existing focused workbench tests in packages/tests/reconciliation-workbench-ui.test.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define the deterministic trace-detail projection and stable expansion identity used by every story.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T005 Define WorkbenchTraceDetail and expansion-control display fields in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T006 Define trace-detail helpers for reconciliation, Shared Facts, and Shared Values rows in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T007 Define intentional absence marker behavior for missing normalized values, severities, source paths, and trace fields in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T008 Add stable trace expansion identifiers based on existing comparison identifiers or ordering keys in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T009 [P] Add focused test coverage for trace-detail projections and stable expansion identifiers in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T010 [P] Add focused test coverage for no raw, hosted, or real-person input dependencies in trace details in packages/tests/reconciliation-workbench-ui.test.ts

**Checkpoint**: Workbench state can expose deterministic trace-detail data before renderer changes.

---

## Phase 3: User Story 1 - Expand Trace Details (Priority: P1) MVP

**Goal**: Add visible row-level trace-detail expansion for reconciliation rows, Shared Facts rows, and Shared Values rows.

**Independent Test**: Load/build the fixed approved sample workbench, activate trace expansion for one row of each supported row kind, and confirm the expanded details show compared sources, fields, values, mapping basis where applicable, raw versus normalized value context where applicable, rule version, and producing module.

### Tests for User Story 1

- [ ] T011 [P] [US1] Add failing state test for reconciliation row trace details in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T012 [P] [US1] Add failing state test for Shared Facts row trace details in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T013 [P] [US1] Add failing state test for Shared Values row trace details with raw and normalized value context in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T014 [P] [US1] Add failing markup test for click or activation behavior on trace expansion controls and expanded details in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 1

- [ ] T015 [US1] Populate trace-detail data for reconciliation rows in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T016 [US1] Populate trace-detail data for Shared Facts rows in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T017 [US1] Populate trace-detail data for Shared Values rows in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T018 [US1] Render row-level trace expansion controls and details in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [ ] T019 [US1] Add stable trace-expansion styling for desktop and mobile readability in apps/web/src/styles.css
- [ ] T020 [US1] Run the focused workbench test command from quickstart.md for packages/tests/reconciliation-workbench-ui.test.ts

**Checkpoint**: User Story 1 is independently functional and testable as the MVP.

---

## Phase 4: User Story 2 - Preserve Deterministic Expansion Behavior (Priority: P2)

**Goal**: Ensure repeated expansion/collapse behavior produces stable details, labels, row identities, and ordering for the fixed approved sample.

**Independent Test**: Expand, collapse, and re-expand the same trace rows across repeated loads of the fixed approved sample and confirm the expansion labels, row ordering, row identities, and detail content are identical.

### Tests for User Story 2

- [ ] T021 [P] [US2] Add failing repeated-build equality test for trace-detail content in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T022 [P] [US2] Add failing ordering test proving expanded trace details do not reorder reconciliation, Shared Facts, or Shared Values rows in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 2

- [ ] T023 [US2] Preserve deterministic expansion labels and detail ordering in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T024 [US2] Ensure expansion markup uses stable row identities without render-time generated values in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [ ] T025 [US2] Run repeated-render stability tests in packages/tests/reconciliation-workbench-ui.test.ts

**Checkpoint**: User Stories 1 and 2 preserve stable trace-detail behavior across repeated loads.

---

## Phase 5: User Story 3 - Preserve Workbench Boundaries (Priority: P3)

**Goal**: Keep trace expansion display-only, approved-evidence-only, and free of real natural-person data while preserving existing rows and output behavior.

**Independent Test**: Render and expand trace details for reconciliation, Shared Facts, and Shared Values rows, then confirm output panels, row counts, existing classifications, approved sample labels, and no-real-person-data boundaries remain unchanged.

### Tests for User Story 3

- [ ] T026 [P] [US3] Add failing preservation test proving output panels and existing row counts remain unchanged after trace expansion in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T027 [P] [US3] Add failing no-real-person-data guardrail test for expanded trace details in packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T028 [P] [US3] Add failing adapter-exclusion regression check for trace expansion display-only behavior in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 3

- [ ] T029 [US3] Keep trace expansion generation display-only with no persistence or adapter mutations in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [ ] T030 [US3] Keep existing output panels, Shared Facts table, Shared Values table, and reconciliation table behavior unchanged in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [ ] T031 [US3] Run preservation tests for packages/tests/bsrs-configuration-output-output.test.ts packages/tests/v1-ve-output-output.test.ts packages/tests/valuation-listings-output-output.test.ts packages/tests/hardening-cross-slice-reconciliation.test.ts packages/tests/hardening-cross-slice-value-reconciliation.test.ts

**Checkpoint**: All user stories are independently functional while preserving browser-only and output-adapter boundaries.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, responsive readability checks, static bundle update, and documentation consistency.

- [ ] T032 [P] Verify 10-second expansion coverage for one reconciliation row, one Shared Facts row, and one Shared Values row against specs/023-workbench-trace-expansion/quickstart.md
- [ ] T033 [P] Verify long trace-detail text remains readable at desktop 1440x900 and mobile 390x844 viewports in apps/web/src/styles.css
- [ ] T034 Run npm test -- packages/tests/reconciliation-workbench-ui.test.ts
- [ ] T035 Run npm run lint and npm run build for package.json workspaces and apps/web/dist/
- [ ] T036 Update committed static bundle output in apps/web/dist/ if npm run build changes it
- [ ] T037 Confirm no delivered .sql, .js, .ts, or .tex artifacts were added outside internal source/test files for specs/023-workbench-trace-expansion/tasks.md

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
- **User Story 2 (P2)**: Starts after foundational tasks; uses the same trace-detail projection as US1.
- **User Story 3 (P3)**: Starts after foundational tasks; validates boundaries around the work introduced by US1/US2.

### Parallel Opportunities

- T004 can run in parallel with T001-T003.
- T009-T010 can run in parallel after T005-T008 are understood.
- T011-T014 can run in parallel before US1 implementation.
- T021-T022 can run in parallel before US2 implementation.
- T026-T028 can run in parallel before US3 implementation.
- T032-T033 can run in parallel during polish before T034-T036.

---

## Parallel Example: User Story 1

```bash
# Launch US1 test-writing tasks together:
Task: "T011 Add failing state test for reconciliation row trace details in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T012 Add failing state test for Shared Facts row trace details in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T013 Add failing state test for Shared Values row trace details in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T014 Add failing markup test for expansion controls and details in packages/tests/reconciliation-workbench-ui.test.ts"
```

---

## Parallel Example: User Story 2

```bash
# Launch US2 deterministic behavior tests together:
Task: "T021 Add failing repeated-build equality test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T022 Add failing ordering test in packages/tests/reconciliation-workbench-ui.test.ts"
```

---

## Parallel Example: User Story 3

```bash
# Launch US3 boundary tests together:
Task: "T026 Add failing preservation test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T027 Add failing no-real-person-data guardrail test in packages/tests/reconciliation-workbench-ui.test.ts"
Task: "T028 Add failing adapter-exclusion regression check in packages/tests/reconciliation-workbench-ui.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup review.
2. Complete Phase 2 trace-detail projection foundation.
3. Complete Phase 3 to expose and render trace expansion controls and details.
4. Stop and validate with `npm test -- packages/tests/reconciliation-workbench-ui.test.ts`.

### Incremental Delivery

1. US1 adds clickable trace expansion details.
2. US2 tightens deterministic repeated expansion behavior.
3. US3 verifies no output, adapter, persistence, raw-input, or real-person-data boundary changes.
4. Polish runs focused tests, preservation tests, lint, build, and static artifact update.

### Notes

- Keep implementation scoped to existing workbench display code and focused tests.
- Do not add schemas, migrations, seeds, business domains, output adapters, raw input readers, hosted services, or persistence writes.
- Preserve DD-backed names and approved fallback names already present in reconciliation, Shared Facts, and Shared Values evidence.
