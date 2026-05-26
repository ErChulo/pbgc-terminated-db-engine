# Tasks: Date Resolution Slice

**Input**: Design documents from `/specs/001-date-resolution-slice/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/date-resolution-slice.md, quickstart.md

**Tests**: Required for this feature because it introduces deterministic date-resolution logic, browser-side sql.js persistence, traceability, structured warnings/errors, and committed runtime output.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other tasks marked [P] in the same phase when file paths do not overlap
- **[Story]**: User story label for story-phase tasks only
- Every task includes an exact target file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the Vite/sql.js browser project and local package layout required by all stories.

- [X] T001 Create root workspace manifest in package.json with scripts for dev, build, test, and lint
- [X] T002 Create pnpm workspace definition in pnpm-workspace.yaml for apps/web and packages/*
- [X] T003 Create TypeScript project references in tsconfig.json
- [X] T004 Create Vite app package manifest in apps/web/package.json with Vite, TypeScript, sql.js, and test dependencies
- [X] T005 Create Vite configuration in apps/web/vite.config.ts
- [X] T006 Create browser entry HTML in apps/web/index.html
- [X] T007 [P] Create application source directories with placeholder module exports in apps/web/src/main.ts
- [X] T008 [P] Create shared package manifest and TypeScript config in packages/shared/package.json
- [X] T009 [P] Create database package manifest and TypeScript config in packages/db/package.json
- [X] T010 [P] Create date-resolution package manifest and TypeScript config in packages/engine/date-resolution/package.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the shared database, contract, fixture, and type foundation that all user stories require.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T011 Define shared result, warning, error, trace, and run-status types in packages/shared/src/types.ts
- [X] T012 Define date-resolution packet and output types from the v0.1.0 contract in packages/engine/date-resolution/src/types.ts
- [X] T013 Implement deterministic ID and timestamp helpers for testable runs in packages/shared/src/determinism.ts
- [X] T014 Implement sql.js context initialization and database export helpers in packages/db/src/sqljs.ts using docs/architecture/vite_sqljs_bootstrap_v0.1.0.ts.txt as the source pattern
- [X] T015 Implement migration and seed text loading registry for committed .sql.txt artifacts in packages/db/src/artifacts.ts
- [X] T016 Implement migration/seed execution helpers in packages/db/src/migrate.ts
- [X] T017 Implement typed query helpers for engine_run, engine_input_packet, resolved_dates_output, and module_trace in packages/db/src/repositories.ts
- [X] T018 Implement CSV fixture parsing for packages/tests/date_resolution_test_cases_v0.1.0.csv in packages/tests/date-resolution-fixtures.ts
- [X] T019 [P] Create Vitest configuration in vitest.config.ts
- [X] T020 [P] Add sql.js static asset packaging notes and copy target placeholder in apps/web/public/sqljs/README.md

**Checkpoint**: Foundation ready. Story implementation can now begin in priority order.

---

## Phase 3: User Story 1 - Run Reviewed Date Resolution (Priority: P1)

**Goal**: Load reviewed date-resolution inputs, run the deterministic module, and persist expected resolved-date outputs.

**Independent Test**: Load the existing date-resolution fixtures, run each as a reviewed input packet, and verify expected `nrd`, `erd`, `rbd`, `xra`, and `xrd` outputs.

### Tests for User Story 1

- [X] T021 [P] [US1] Add contract validation tests for valid date-resolution fixture packets in packages/tests/date-resolution-contract.test.ts
- [X] T022 [P] [US1] Add deterministic output tests for DR001, DR002, and DR003 in packages/tests/date-resolution-output.test.ts
- [X] T023 [P] [US1] Add sql.js persistence tests for engine_run and resolved_dates_output in packages/tests/date-resolution-persistence.test.ts

### Implementation for User Story 1

- [X] T024 [US1] Implement fixture-to-reviewed-packet builder in packages/engine/date-resolution/src/fixturePacketBuilder.ts
- [X] T025 [US1] Implement required input-group and field validation in packages/engine/date-resolution/src/validatePacket.ts
- [X] T026 [US1] Implement date utility functions for age, first-of-month, anniversary, and null handling in packages/engine/date-resolution/src/dateMath.ts
- [X] T027 [US1] Implement deterministic rule resolution for NRD, ERD, RBD, XRA, and XRD in packages/engine/date-resolution/src/resolveDates.ts
- [X] T028 [US1] Implement run orchestration that writes engine_run and resolved_dates_output in packages/engine/date-resolution/src/runDateResolution.ts
- [X] T029 [US1] Export date-resolution public API from packages/engine/date-resolution/src/index.ts
- [X] T030 [US1] Implement browser app initialization and fixture-run action in apps/web/src/app/dateResolutionSlice.ts
- [X] T031 [US1] Render reviewed fixture selection and resolved output table in apps/web/src/pages/DateResolutionPage.ts
- [X] T032 [US1] Wire the Date Resolution page into the browser entrypoint in apps/web/src/main.ts

**Checkpoint**: User Story 1 is independently functional when fixture rows produce the expected resolved-date values and persisted output rows.

---

## Phase 4: User Story 2 - Reject Incomplete Reviewed Inputs (Priority: P2)

**Goal**: Block malformed, incomplete, unresolved, or blank-string input packets before any resolved-date output is recorded.

**Independent Test**: Omit required groups and replace explicit nulls with blank strings, then verify failed runs and structured blocking errors with no resolved_dates_output rows.

### Tests for User Story 2

- [X] T033 [P] [US2] Add missing required group rejection tests in packages/tests/date-resolution-invalid-packet.test.ts
- [X] T034 [P] [US2] Add blank-string and malformed-date rejection tests in packages/tests/date-resolution-invalid-values.test.ts

### Implementation for User Story 2

- [X] T035 [US2] Implement structured blocking error builders in packages/engine/date-resolution/src/errors.ts
- [X] T036 [US2] Extend packet validation for conditional qpsa_packet, death_benefit_packet, and qdro_packet triggers in packages/engine/date-resolution/src/validatePacket.ts
- [X] T037 [US2] Update run orchestration to persist failed engine_run records without resolved_dates_output rows in packages/engine/date-resolution/src/runDateResolution.ts
- [X] T038 [US2] Display failed run status and blocking errors in apps/web/src/pages/DateResolutionPage.ts

**Checkpoint**: User Story 2 is independently functional when invalid packets fail deterministically and never write authoritative date outputs.

---

## Phase 5: User Story 3 - Review Trace for Produced Dates (Priority: P3)

**Goal**: Persist and display trace metadata for every populated date output, warning, and date-resolution branch.

**Independent Test**: Select a completed run and verify every populated resolved-date field has trace rows back to the input packet, rule version, module version, and applied rule branch.

### Tests for User Story 3

- [X] T039 [P] [US3] Add module_trace coverage tests for populated resolved dates in packages/tests/date-resolution-trace.test.ts
- [X] T040 [P] [US3] Add repeated-run determinism tests for five identical packet executions in packages/tests/date-resolution-repeatability.test.ts

### Implementation for User Story 3

- [X] T041 [US3] Implement trace row construction for each populated resolved date in packages/engine/date-resolution/src/trace.ts
- [X] T042 [US3] Persist module_trace rows from successful and warning-producing runs in packages/engine/date-resolution/src/runDateResolution.ts
- [X] T043 [US3] Display trace details and warning notes in apps/web/src/pages/DateResolutionPage.ts
- [X] T044 [US3] Add trace query helpers for completed runs in packages/db/src/repositories.ts

**Checkpoint**: User Story 3 is independently functional when reviewers can inspect trace rows for every populated resolved date.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the full slice, update runtime artifacts, and preserve repository delivery conventions.

- [X] T045 [P] Update architecture note for the executable slice in docs/architecture/date_resolution_slice_v0.1.0.md
- [X] T046 [P] Update mapping notes for date-resolution outputs in docs/mappings/date_resolution_trace_map_v0.1.0.csv
- [X] T047 Run quickstart validation and record results in specs/001-date-resolution-slice/quickstart-results.md
- [X] T048 Run full test suite and fix any failures in packages/tests/date-resolution-output.test.ts
- [X] T049 Build the static browser app and update committed artifacts in apps/web/dist/index.html
- [X] T050 Verify no service-resolution, compensation-resolution, form-resolution, benefit-kernel, or output-adapter implementation files were added under packages/engine/service-resolution/
- [X] T051 Create email-safe .txt copies for any delivered .js or .ts artifacts that are added outside package source conventions in artifacts/samples/date_resolution_delivery_manifest_v0.1.0.txt

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Phase 1 completion; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Phase 2; this is the MVP.
- **User Story 2 (Phase 4)**: Depends on Phase 2 and may reuse US1 run orchestration; can be validated independently with invalid packets.
- **User Story 3 (Phase 5)**: Depends on Phase 2 and may reuse US1 output persistence; can be validated independently with completed runs.
- **Polish (Phase 6)**: Depends on selected user stories being complete.

### User Story Dependencies

- **US1 Run Reviewed Date Resolution**: First executable slice and MVP; no dependency on US2 or US3.
- **US2 Reject Incomplete Reviewed Inputs**: Depends on foundational validation types and run orchestration shape; does not require trace display.
- **US3 Review Trace for Produced Dates**: Depends on successful run/output paths from US1; does not require invalid packet UI from US2.

### Within Each User Story

- Write tests before implementation tasks in each story.
- Validation and contract tasks precede deterministic transform tasks.
- Deterministic transform tasks precede persistence and UI integration.
- Persistence tasks precede trace display and quickstart validation.

### Parallel Opportunities

- T007-T010 can run in parallel after T001-T006 define the workspace direction.
- T019-T020 can run in parallel with T011-T018 after setup.
- US1 tests T021-T023 can run in parallel.
- US2 tests T033-T034 can run in parallel.
- US3 tests T039-T040 can run in parallel.
- Polish docs T045-T046 can run in parallel after story implementation stabilizes.

## Parallel Example: User Story 1

```bash
Task: "T021 [P] [US1] Add contract validation tests for valid date-resolution fixture packets in packages/tests/date-resolution-contract.test.ts"
Task: "T022 [P] [US1] Add deterministic output tests for DR001, DR002, and DR003 in packages/tests/date-resolution-output.test.ts"
Task: "T023 [P] [US1] Add sql.js persistence tests for engine_run and resolved_dates_output in packages/tests/date-resolution-persistence.test.ts"
```

## Parallel Example: User Story 2

```bash
Task: "T033 [P] [US2] Add missing required group rejection tests in packages/tests/date-resolution-invalid-packet.test.ts"
Task: "T034 [P] [US2] Add blank-string and malformed-date rejection tests in packages/tests/date-resolution-invalid-values.test.ts"
```

## Parallel Example: User Story 3

```bash
Task: "T039 [P] [US3] Add module_trace coverage tests for populated resolved dates in packages/tests/date-resolution-trace.test.ts"
Task: "T040 [P] [US3] Add repeated-run determinism tests for five identical packet executions in packages/tests/date-resolution-repeatability.test.ts"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup.
2. Complete Phase 2 foundation.
3. Complete Phase 3 User Story 1.
4. Stop and validate fixture outputs before adding invalid-packet or trace review workflows.

### Incremental Delivery

1. Foundation: Vite/sql.js app, shared types, database bootstrap, migration/seed execution, fixture parsing.
2. MVP: valid reviewed fixture packets produce persisted date-resolution outputs.
3. Hardening: invalid packets fail deterministically without output rows.
4. Auditability: trace rows and trace display cover all populated outputs.
5. Delivery: quickstart validation, static build artifacts, and documentation updates.

## Notes

- Do not implement service_resolution, compensation_resolution, form_resolution, benefit_kernel, V1/VE output, valuation listings, or BSRS configuration in this slice.
- Do not read raw OCR, raw source documents, emails, images, PDFs, or unreviewed extraction output from deterministic modules.
- Existing v0.1.0 contracts, schemas, migrations, seeds, mappings, templates, and test cases are the implementation baseline.
- All generated runtime output must remain reproducible from reviewed inputs, rule version, module version, and committed artifacts.
