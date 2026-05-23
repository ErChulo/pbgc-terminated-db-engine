# Tasks: Reconciliation Workbench UI

**Input**: Design documents from `/specs/018-reconciliation-workbench-ui/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/reconciliation-workbench-ui.md, quickstart.md

**Tests**: Required. This feature adds a visible browser page over deterministic outputs, traceability details, agreement-versus-drift presentation, and committed static build artifacts.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and has no dependency on another incomplete task
- **[Story]**: Which user story the task belongs to
- Exact file paths are included in each task description

## Phase 1: Setup (Shared Context)

**Purpose**: Confirm existing web rendering, approved sample sources, and reconciliation helpers before adding the workbench page.

- [X] T001 Inspect current web entry and navigation patterns in `apps/web/src/main.ts` and `apps/web/src/pages/BsrsConfigurationPage.ts`
- [X] T002 Inspect current app slice patterns in `apps/web/src/app/bsrsConfigurationOutputSlice.ts`, `apps/web/src/app/v1VeOutputSlice.ts`, and `apps/web/src/app/valuationListingsOutputSlice.ts`
- [X] T003 [P] Inspect existing style constraints in `apps/web/src/styles.css`
- [X] T004 [P] Inspect existing cross-slice value reconciliation helpers in `packages/shared/src/crossSliceReconciliation.ts`
- [X] T005 [P] Inspect approved sample fixture builders in `packages/tests/bsrs-configuration-output-fixtures.ts`, `packages/tests/v1-ve-output-fixtures.ts`, and `packages/tests/valuation-listings-output-fixtures.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the display-only workbench data boundary shared by all stories.

**CRITICAL**: No user story work should begin until this phase is complete.

- [X] T006 Define workbench display data types for approved sample, output panels, display fields, reconciliation rows, and trace details in `apps/web/src/app/reconciliationWorkbenchSlice.ts`
- [X] T007 Define the approved sample data builder signature and display-only contract in `apps/web/src/app/reconciliationWorkbenchSlice.ts`
- [X] T008 Create the focused workbench test file with shared fixture helpers in `packages/tests/reconciliation-workbench-ui.test.ts`
- [X] T009 Verify no new migrations, seeds, schemas, output adapter directories, server endpoints, or raw/unreviewed input reads are needed for this feature in `specs/018-reconciliation-workbench-ui/tasks.md`

**Checkpoint**: The workbench data boundary is ready for user story implementation.

---

## Phase 3: User Story 1 - View Approved Sample Reconciliation (Priority: P1) MVP

**Goal**: Show one visible workbench screen with approved sample identity, BSRS configuration, V1/VE, valuation listings, and reconciliation rows together.

**Independent Test**: `npm test -- packages/tests/reconciliation-workbench-ui.test.ts` confirms the approved sample produces three output panels and reconciliation rows with agreement statuses.

### Tests for User Story 1

- [X] T010 [US1] Add a failing test that builds one approved sample workbench with sample identity and exactly three output slice panels in `packages/tests/reconciliation-workbench-ui.test.ts`
- [X] T011 [US1] Add a failing test that the workbench data includes reconciliation rows with agreement-versus-drift status labels in `packages/tests/reconciliation-workbench-ui.test.ts`
- [X] T012 [US1] Add a failing test that the rendered workbench markup includes BSRS configuration, V1/VE, valuation listings, and reconciliation sections in `packages/tests/reconciliation-workbench-ui.test.ts`

### Implementation for User Story 1

- [X] T013 [US1] Implement approved sample workbench data generation in `apps/web/src/app/reconciliationWorkbenchSlice.ts`
- [X] T014 [US1] Implement output slice panel field selection for BSRS configuration, V1/VE, and valuation listings in `apps/web/src/app/reconciliationWorkbenchSlice.ts`
- [X] T015 [US1] Create the visible workbench page renderer in `apps/web/src/pages/ReconciliationWorkbenchPage.ts`
- [X] T016 [US1] Update app startup to show or navigate to the workbench page in `apps/web/src/main.ts`
- [X] T017 [US1] Add workbench navigation entry from existing output pages in `apps/web/src/pages/BsrsConfigurationPage.ts`, `apps/web/src/pages/V1VeOutputPage.ts`, and `apps/web/src/pages/ValuationListingsOutputPage.ts`
- [X] T018 [US1] Add readable side-by-side workbench layout styles in `apps/web/src/styles.css`
- [X] T019 [US1] Run `npm test -- packages/tests/reconciliation-workbench-ui.test.ts` and resolve US1 failures without changing output adapters or deterministic slice behavior

**Checkpoint**: User Story 1 is independently testable as the MVP.

---

## Phase 4: User Story 2 - Inspect Agreement, Drift, and Trace Details (Priority: P2)

**Goal**: Make status severity, compared values, mapping/fallback basis, source artifacts, rule version, and producing module visible or inspectable for every displayed comparison or finding.

**Independent Test**: `npm test -- packages/tests/reconciliation-workbench-ui.test.ts` confirms reconciliation rows and findings expose trace details and distinguish warnings/drift from accepted agreements.

### Tests for User Story 2

- [ ] T020 [US2] Add a failing test that each displayed reconciliation row includes compared slices, fields, displayed values, normalized values, mapping basis, and status in `packages/tests/reconciliation-workbench-ui.test.ts`
- [ ] T021 [US2] Add a failing test that DD-backed and approved fallback basis labels are both represented when present in `packages/tests/reconciliation-workbench-ui.test.ts`
- [ ] T022 [US2] Add a failing test that warning or drift findings display severity, source artifact, rule version, and producing module in `packages/tests/reconciliation-workbench-ui.test.ts`

### Implementation for User Story 2

- [ ] T023 [US2] Add trace detail projection for reconciliation rows and findings in `apps/web/src/app/reconciliationWorkbenchSlice.ts`
- [ ] T024 [US2] Render trace details, mapping basis labels, normalized values, and severity badges in `apps/web/src/pages/ReconciliationWorkbenchPage.ts`
- [ ] T025 [US2] Add status-specific styles for accepted, warning, drift, nullable, unsupported, and formatting-only rows in `apps/web/src/styles.css`
- [ ] T026 [US2] Run `npm test -- packages/tests/reconciliation-workbench-ui.test.ts` and resolve US2 failures while preserving existing reconciliation helper outputs

**Checkpoint**: User Stories 1 and 2 can be tested independently through the focused workbench suite.

---

## Phase 5: User Story 3 - Preserve Deterministic Browser Behavior (Priority: P3)

**Goal**: Keep repeated loads stable and preserve existing output, reconciliation, browser-only, persistence, and adapter-exclusion behavior.

**Independent Test**: Repeated workbench data generation and rendering produce identical output while existing output and reconciliation regression suites still pass.

### Tests for User Story 3

- [X] T027 [US3] Add a repeated-run stability test for workbench display data ordering, statuses, trace details, and deterministic `generated_at` metadata in `packages/tests/reconciliation-workbench-ui.test.ts`
- [X] T028 [US3] Add a repeated-render markup stability test for the same approved sample, including stable `generated_at` output when displayed, in `packages/tests/reconciliation-workbench-ui.test.ts`
- [ ] T029 [US3] Add a regression assertion that the workbench data builder does not expose mutation or persistence write outputs in `packages/tests/reconciliation-workbench-ui.test.ts`

### Implementation for User Story 3

- [X] T030 [US3] Stabilize deterministic sorting and value formatting for output panels and reconciliation rows in `apps/web/src/app/reconciliationWorkbenchSlice.ts`
- [ ] T031 [US3] Verify 1440x900 desktop and 390x844 mobile layout constraints for long values and trace details with a focused render/layout assertion or documented manual verification in `apps/web/src/styles.css`
- [X] T032 [P] [US3] Run existing reconciliation hardening checks: `npm test -- packages/tests/hardening-cross-slice-value-reconciliation.test.ts packages/tests/hardening-cross-slice-reconciliation.test.ts`
- [X] T033 [P] [US3] Run existing output preservation checks: `npm test -- packages/tests/bsrs-configuration-output-contract.test.ts packages/tests/bsrs-configuration-output-output.test.ts packages/tests/v1-ve-output-contract.test.ts packages/tests/v1-ve-output-output.test.ts packages/tests/valuation-listings-output-contract.test.ts packages/tests/valuation-listings-output-output.test.ts`
- [X] T034 [US3] Run `npm test -- packages/tests/reconciliation-workbench-ui.test.ts` and resolve US3 failures without adding persistence or output-adapter behavior

**Checkpoint**: The workbench remains deterministic and behavior-preserving.

---

## Phase 6: Polish & Cross-Cutting Verification

**Purpose**: Documentation, browser verification, and committed static artifact discipline.

- [ ] T035 [P] Document the workbench display-only boundary in `docs/architecture/reconciliation_workbench_ui.md`
- [ ] T036 [P] Document the displayed reconciliation field and trace mapping in `docs/mappings/reconciliation_workbench_ui_map_v0.1.0.csv`
- [ ] T037 Verify no delivered `.sql`, `.js`, `.ts`, or `.tex` artifact was added without the required appended `.txt` transport copy in `specs/018-reconciliation-workbench-ui/tasks.md`
- [X] T038 Run full test suite with `npm test`
- [X] T039 Run lint verification with `npm run lint`
- [X] T040 Run production build verification with `npm run build`
- [X] T041 Update committed static output under `apps/web/dist/` if `npm run build` changes bundle artifacts
- [ ] T042 Start the local web app with `npm --workspace @pbgc/web run dev` and verify the workbench screen manually against `specs/018-reconciliation-workbench-ui/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion and is the MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational completion; may use US1 UI structures but remains independently testable.
- **User Story 3 (Phase 5)**: Depends on Foundational completion; final preservation checks should run after selected story implementation.
- **Polish (Phase 6)**: Depends on selected user-story scope completion.

### User Story Dependencies

- **US1**: Can start after Foundational; no dependency on US2 or US3.
- **US2**: Can start after Foundational, but integrates with the page and row structures created for US1.
- **US3**: Can start after Foundational, but preservation verification should run after US1 and US2 implementation tasks selected for delivery.

### Within Each User Story

- Add failing tests before implementation tasks for that story.
- Keep all workbench data derived from approved committed samples and existing deterministic outputs.
- Preserve display-only behavior and avoid persistence, adapter, or source-layer writes.
- Run focused tests before moving to the next story.

---

## Parallel Opportunities

- T003, T004, and T005 can run in parallel during Setup.
- T020, T021, and T022 all edit the same test file and should remain sequential.
- T032 and T033 can run in parallel because they execute independent regression groups.
- T035 and T036 can run in parallel because they update separate documentation files.

---

## Parallel Example: User Story 3

```bash
# Run preservation checks independently:
Task: "T032 Run existing reconciliation hardening checks"
Task: "T033 Run existing output preservation checks"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate with `npm test -- packages/tests/reconciliation-workbench-ui.test.ts`.

### Incremental Delivery

1. Add US1 to show the approved sample, output panels, and reconciliation rows.
2. Add US2 to expose detailed traceability and severity.
3. Add US3 to harden repeated-load determinism and behavior preservation.
4. Complete Phase 6 verification and update committed static build output if changed.
