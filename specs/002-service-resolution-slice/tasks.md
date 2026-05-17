# Tasks: Service Resolution Slice

**Input**: Design documents from `/specs/002-service-resolution-slice/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/service-resolution-slice.md, quickstart.md

**Tests**: Required. This feature changes deterministic service logic, sql.js persistence, structured validation, traceability, browser integration, and committed static runtime output.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently. US1 is the MVP for the second executable slice.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the service-resolution package skeleton and register it with the existing browser-only Vite/sql.js workspace without implementing downstream modules.

- [ ] T001 Create the service-resolution package manifest in packages/engine/service-resolution/package.json
- [ ] T002 Create the service-resolution TypeScript config in packages/engine/service-resolution/tsconfig.json
- [ ] T003 [P] Add the public service-resolution barrel placeholder in packages/engine/service-resolution/src/index.ts
- [ ] T004 [P] Add the package source type placeholder in packages/engine/service-resolution/src/types.ts
- [ ] T005 Register the service-resolution workspace dependency in apps/web/package.json
- [ ] T006 Register service-resolution build/test coverage in package.json
- [ ] T007 [P] Add the service page placeholder module in apps/web/src/pages/ServiceResolutionPage.ts
- [ ] T008 [P] Add the browser app state placeholder in apps/web/src/app/serviceResolutionSlice.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared types, fixture conversion, repository helpers, and deterministic boundaries that all service stories depend on.

**Critical**: No user story work can begin until this phase is complete.

- [ ] T009 Add shared service-resolution request/result, warning, error, and trace types in packages/shared/src/types.ts
- [ ] T010 Export shared service-resolution types from packages/shared/src/index.ts
- [ ] T011 Add resolved service output insert/list helpers for service columns only in packages/db/src/repositories.ts
- [ ] T012 Add module trace list helpers scoped by calculation run and module name in packages/db/src/repositories.ts
- [ ] T013 Add service-resolution fixture CSV parsing utilities in packages/tests/service-resolution-fixtures.ts
- [ ] T014 Add reviewed service packet fixture builders from service CSV rows in packages/engine/service-resolution/src/fixturePacketBuilder.ts
- [ ] T015 Add deterministic service rule constants and module version exports in packages/engine/service-resolution/src/types.ts
- [ ] T016 [P] Add service-resolution architecture notes in docs/architecture/service_resolution_slice_v0.1.0.md
- [ ] T017 [P] Add service trace field mapping in docs/mappings/service_resolution_trace_map_v0.1.0.csv
- [ ] T018 Verify no compensation, form, benefit-kernel, or output-adapter package is created for this slice under packages/engine/ and packages/output-adapters/

**Checkpoint**: Foundation ready. User story implementation can start after this phase.

---

## Phase 3: User Story 1 - Run Reviewed Service Resolution (Priority: P1) MVP

**Goal**: Run deterministic service resolution for reviewed service packets and persist eligibility, vesting, benefit, and accrual service results.

**Independent Test**: Load `packages/tests/service_resolution_test_cases_v0.1.0.csv`, build reviewed packets for SR001-SR003, run only `service_resolution`, and verify expected service outputs and persistence.

### Tests for User Story 1

- [ ] T019 [P] [US1] Add contract-shape tests for RunServiceResolutionRequest and RunServiceResolutionResult in packages/tests/service-resolution-contract.test.ts
- [ ] T020 [P] [US1] Add deterministic output tests for SR001-SR003 service quantities in packages/tests/service-resolution-output.test.ts
- [ ] T021 [P] [US1] Add sql.js persistence tests for engine_run and resolved_service_comp_output service columns in packages/tests/service-resolution-persistence.test.ts
- [ ] T022 [P] [US1] Add compensation-null assertions for resolved_service_comp_output in packages/tests/service-resolution-persistence.test.ts

### Implementation for User Story 1

- [ ] T023 [US1] Implement service packet validation for required groups and fixture-supported controlled values in packages/engine/service-resolution/src/validatePacket.ts
- [ ] T024 [US1] Implement plan-year service period calculation for the fixture-supported basis in packages/engine/service-resolution/src/serviceMath.ts
- [ ] T025 [US1] Implement service output resolution for eligibility, vesting, benefit, and accrual service in packages/engine/service-resolution/src/resolveService.ts
- [ ] T026 [US1] Implement service run orchestration with engine_run persistence in packages/engine/service-resolution/src/runServiceResolution.ts
- [ ] T027 [US1] Persist successful service outputs to resolved_service_comp_output service columns only in packages/engine/service-resolution/src/runServiceResolution.ts
- [ ] T028 [US1] Export service-resolution runtime APIs from packages/engine/service-resolution/src/index.ts
- [ ] T029 [US1] Integrate service fixture loading and run actions into apps/web/src/app/serviceResolutionSlice.ts
- [ ] T030 [US1] Render the service-resolution fixture runner and resolved output table in apps/web/src/pages/ServiceResolutionPage.ts
- [ ] T031 [US1] Add service-resolution navigation without removing date-resolution access in apps/web/src/main.ts
- [ ] T032 [US1] Add service-resolution view styles in apps/web/src/styles.css
- [ ] T033 [US1] Verify User Story 1 with npm test -- packages/tests/service-resolution-output.test.ts packages/tests/service-resolution-persistence.test.ts

**Checkpoint**: User Story 1 is functional and independently testable as the MVP.

---

## Phase 4: User Story 2 - Reject Invalid Service Inputs (Priority: P2)

**Goal**: Block invalid service packets before authoritative service outputs are written.

**Independent Test**: Submit packets with missing required groups, blank strings, malformed dates, and invalid date ordering, then verify failed runs, structured errors, and no resolved_service_comp_output row.

### Tests for User Story 2

- [ ] T034 [P] [US2] Add invalid-packet tests for missing required service groups in packages/tests/service-resolution-validation.test.ts
- [ ] T035 [P] [US2] Add invalid-packet tests for blank string values instead of explicit nulls in packages/tests/service-resolution-validation.test.ts
- [ ] T036 [P] [US2] Add invalid-packet tests for malformed dates and invalid date ordering in packages/tests/service-resolution-validation.test.ts
- [ ] T037 [P] [US2] Add failed-run no-output persistence tests in packages/tests/service-resolution-validation.test.ts

### Implementation for User Story 2

- [ ] T038 [US2] Add structured blocking error builders in packages/engine/service-resolution/src/errors.ts
- [ ] T039 [US2] Extend service packet validation for required groups, blank strings, malformed dates, and date ordering in packages/engine/service-resolution/src/validatePacket.ts
- [ ] T040 [US2] Persist failed validation attempts as failed engine_run records without service output rows in packages/engine/service-resolution/src/runServiceResolution.ts
- [ ] T041 [US2] Display service validation error summaries in apps/web/src/pages/ServiceResolutionPage.ts
- [ ] T042 [US2] Verify User Story 2 with npm test -- packages/tests/service-resolution-validation.test.ts

**Checkpoint**: User Stories 1 and 2 work independently with valid and invalid packet paths.

---

## Phase 5: User Story 3 - Review Service Trace (Priority: P3)

**Goal**: Provide reviewable trace metadata for every populated service quantity and warning-bearing completed run.

**Independent Test**: Select completed service runs and verify each populated service field has trace rows containing packet, module, version, rule branch, reviewed fields, intermediate decisions, and warnings when applicable.

### Tests for User Story 3

- [ ] T043 [P] [US3] Add trace completeness tests for all populated service fields in packages/tests/service-resolution-trace.test.ts
- [ ] T044 [P] [US3] Add repeated-run determinism tests that compare service values and trace decisions across five runs in packages/tests/service-resolution-trace.test.ts
- [ ] T045 [P] [US3] Add active-at-DOPT warning trace tests for SR003 in packages/tests/service-resolution-trace.test.ts

### Implementation for User Story 3

- [ ] T046 [US3] Implement trace row construction for service outputs and warnings in packages/engine/service-resolution/src/trace.ts
- [ ] T047 [US3] Persist module_trace rows for each populated service output in packages/engine/service-resolution/src/runServiceResolution.ts
- [ ] T048 [US3] Add trace and warning state selectors to apps/web/src/app/serviceResolutionSlice.ts
- [ ] T049 [US3] Render service trace details and warning notes in apps/web/src/pages/ServiceResolutionPage.ts
- [ ] T050 [US3] Verify User Story 3 with npm test -- packages/tests/service-resolution-trace.test.ts

**Checkpoint**: All service-resolution stories are independently functional and traceable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Complete regression, static-browser verification, docs alignment, and committed build output.

- [ ] T051 [P] Add date-resolution regression guard to the service validation command notes in specs/002-service-resolution-slice/quickstart.md
- [ ] T052 [P] Update implementation completion notes in docs/architecture/service_resolution_slice_v0.1.0.md
- [ ] T053 Run all deterministic tests with npm test and fix issues in packages/tests/
- [ ] T054 Run lint/type checks with npm run lint and fix issues in packages/engine/service-resolution/src/
- [ ] T055 Run the static browser build with npm run build and update committed assets under apps/web/dist/
- [ ] T056 Start the Vite app and validate the quickstart flow in apps/web/src/pages/ServiceResolutionPage.ts
- [ ] T057 Confirm browser-only/no-network execution by inspecting service-resolution imports in packages/engine/service-resolution/src/
- [ ] T058 Confirm compensation, form, benefit-kernel, V1/VE, valuation listing, and BSRS implementations remain out of scope in packages/engine/ and packages/output-adapters/
- [ ] T059 Update task completion checkboxes in specs/002-service-resolution-slice/tasks.md after implementation verification

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 Setup has no dependencies.
- Phase 2 Foundational depends on Phase 1 and blocks all user stories.
- Phase 3 US1 depends on Phase 2 and is the MVP.
- Phase 4 US2 depends on Phase 2 and can be implemented independently, but should be validated with US1 persistence behavior.
- Phase 5 US3 depends on Phase 2 and uses successful US1 run semantics for trace inspection.
- Phase 6 Polish depends on the selected user stories being complete.

### User Story Dependencies

- US1 Run Reviewed Service Resolution: no dependency on US2 or US3 after foundation.
- US2 Reject Invalid Service Inputs: no dependency on US3; shares validation and run persistence contracts with US1.
- US3 Review Service Trace: depends on completed service run semantics from US1, but trace tests remain independently executable.

### Within Each User Story

- Write tests first and confirm they fail before implementation.
- Implement deterministic validation before calculation.
- Implement deterministic calculation before persistence integration.
- Implement persistence before browser UI display.
- Verify each story independently before moving to cross-cutting polish.

## Parallel Opportunities

- T003, T004, T007, and T008 can run in parallel after package directories exist.
- T013, T016, and T017 can run in parallel with repository helper work because they touch different files.
- T019 through T022 can run in parallel as independent US1 test files or test sections.
- T034 through T037 can run in parallel as independent invalid-packet test cases.
- T043 through T045 can run in parallel as independent trace/determinism test cases.
- US2 and US3 can begin after Phase 2 when separate contributors avoid overlapping edits to runServiceResolution.ts.

## Parallel Example: User Story 1

```bash
Task: "T019 [P] [US1] Add contract-shape tests for RunServiceResolutionRequest and RunServiceResolutionResult in packages/tests/service-resolution-contract.test.ts"
Task: "T020 [P] [US1] Add deterministic output tests for SR001-SR003 service quantities in packages/tests/service-resolution-output.test.ts"
Task: "T021 [P] [US1] Add sql.js persistence tests for engine_run and resolved_service_comp_output service columns in packages/tests/service-resolution-persistence.test.ts"
```

## Parallel Example: User Story 2

```bash
Task: "T034 [P] [US2] Add invalid-packet tests for missing required service groups in packages/tests/service-resolution-validation.test.ts"
Task: "T035 [P] [US2] Add invalid-packet tests for blank string values instead of explicit nulls in packages/tests/service-resolution-validation.test.ts"
Task: "T036 [P] [US2] Add invalid-packet tests for malformed dates and invalid date ordering in packages/tests/service-resolution-validation.test.ts"
```

## Parallel Example: User Story 3

```bash
Task: "T043 [P] [US3] Add trace completeness tests for all populated service fields in packages/tests/service-resolution-trace.test.ts"
Task: "T044 [P] [US3] Add repeated-run determinism tests that compare service values and trace decisions across five runs in packages/tests/service-resolution-trace.test.ts"
Task: "T045 [P] [US3] Add active-at-DOPT warning trace tests for SR003 in packages/tests/service-resolution-trace.test.ts"
```

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1 Setup.
2. Complete Phase 2 Foundational.
3. Complete Phase 3 US1.
4. Stop and validate service fixture outputs and persistence.
5. Commit the MVP only after tests, lint, build, and static artifact checks pass.

### Incremental Delivery

1. Add US2 validation blocking after the US1 happy path is stable.
2. Add US3 trace review after successful and failed run semantics are stable.
3. Finish Phase 6 with full regression, quickstart validation, and committed dist output.

### Out of Scope Guardrails

- Do not implement compensation_resolution, form_resolution, benefit_kernel, V1/VE output, valuation listings, or BSRS adapters in this slice.
- Do not add server calls, hosted APIs, telemetry dependencies, or raw-document reads.
- Do not populate compensation columns in resolved_service_comp_output.
