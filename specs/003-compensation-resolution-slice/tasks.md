# Tasks: Compensation Resolution Slice

**Input**: Design documents from `/specs/003-compensation-resolution-slice/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/compensation-resolution-slice.md, quickstart.md

**Tests**: Required. This feature changes deterministic compensation logic, sql.js persistence, structured validation, traceability, warnings/errors, browser integration, and committed static runtime output.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently. US1 is the MVP for the third executable slice.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the compensation-resolution package skeleton and register it with the existing browser-only Vite/sql.js workspace without implementing downstream modules.

- [X] T001 Create the compensation-resolution package manifest in packages/engine/compensation-resolution/package.json
- [X] T002 Create the compensation-resolution TypeScript config in packages/engine/compensation-resolution/tsconfig.json
- [X] T003 [P] Add the public compensation-resolution barrel placeholder in packages/engine/compensation-resolution/src/index.ts
- [X] T004 [P] Add the package source type placeholder in packages/engine/compensation-resolution/src/types.ts
- [X] T005 Register the compensation-resolution workspace dependency in apps/web/package.json
- [X] T006 Register the compensation-resolution alias in tsconfig.json
- [X] T007 Register the compensation-resolution test alias in vitest.config.ts
- [X] T008 [P] Add the compensation page placeholder module in apps/web/src/pages/CompensationResolutionPage.ts
- [X] T009 [P] Add the browser app state placeholder in apps/web/src/app/compensationResolutionSlice.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared types, fixture conversion, repository helpers, and deterministic boundaries that all compensation stories depend on.

**Critical**: No user story work can begin until this phase is complete.

- [X] T010 Add shared compensation-resolution module name support to StructuredIssue and ModuleTrace in packages/shared/src/types.ts
- [X] T011 Add compensation packet type support to engine input packet records in packages/db/src/repositories.ts
- [X] T012 Add repository helpers for inserting and listing compensation-bearing resolved_service_comp_output rows in packages/db/src/repositories.ts
- [X] T013 Add repository helper for preserving service columns while updating compensation columns in packages/db/src/repositories.ts
- [X] T014 Add compensation-resolution fixture CSV parsing utilities in packages/tests/compensation-resolution-fixtures.ts
- [X] T015 Add reviewed compensation packet fixture builders from compensation CSV rows in packages/engine/compensation-resolution/src/fixturePacketBuilder.ts
- [X] T016 Add deterministic compensation rule constants and module version exports in packages/engine/compensation-resolution/src/types.ts
- [X] T017 [P] Add compensation-resolution architecture notes in docs/architecture/compensation_resolution_slice_v0.1.0.md
- [X] T018 [P] Add compensation trace field mapping in docs/mappings/compensation_resolution_trace_map_v0.1.0.csv
- [X] T019 Verify no form-resolution, benefit-kernel, or output-adapter package is created for this slice under packages/engine/ and packages/output-adapters/

**Checkpoint**: Foundation ready. User story implementation can start after this phase.

---

## Phase 3: User Story 1 - Run Reviewed Compensation Resolution (Priority: P1) MVP

**Goal**: Run deterministic compensation resolution for reviewed compensation packets and persist compensation, average compensation, and covered compensation results.

**Independent Test**: Load `packages/tests/compensation_resolution_test_cases_v0.1.0.csv`, build reviewed packets for CR001-CR003, run only `compensation_resolution`, and verify expected compensation outputs and persistence.

### Tests for User Story 1

- [X] T020 [P] [US1] Add contract-shape tests for RunCompensationResolutionRequest and RunCompensationResolutionResult in packages/tests/compensation-resolution-contract.test.ts
- [X] T021 [P] [US1] Add deterministic output tests for CR001-CR003 compensation quantities in packages/tests/compensation-resolution-output.test.ts
- [X] T022 [P] [US1] Add frozen-benefit support warning and explicit-null output assertions in packages/tests/compensation-resolution-output.test.ts
- [X] T023 [P] [US1] Add sql.js persistence tests for engine_run and resolved_service_comp_output compensation columns in packages/tests/compensation-resolution-persistence.test.ts
- [X] T024 [P] [US1] Add service-column preservation assertions for resolved_service_comp_output in packages/tests/compensation-resolution-persistence.test.ts

### Implementation for User Story 1

- [X] T025 [US1] Implement compensation packet validation for required groups and fixture-supported controlled values in packages/engine/compensation-resolution/src/validatePacket.ts
- [X] T026 [US1] Implement final-average-pay and covered-compensation fixture rule calculations in packages/engine/compensation-resolution/src/compensationMath.ts
- [X] T027 [US1] Implement compensation output resolution for compensation, average compensation, and covered compensation in packages/engine/compensation-resolution/src/resolveCompensation.ts
- [X] T028 [US1] Implement frozen-benefit support warning generation without fallback compensation values in packages/engine/compensation-resolution/src/resolveCompensation.ts
- [X] T029 [US1] Implement compensation run orchestration with engine_run persistence in packages/engine/compensation-resolution/src/runCompensationResolution.ts
- [X] T030 [US1] Persist successful compensation outputs to resolved_service_comp_output compensation columns only in packages/engine/compensation-resolution/src/runCompensationResolution.ts
- [X] T031 [US1] Preserve existing service fields when writing compensation outputs in packages/engine/compensation-resolution/src/runCompensationResolution.ts
- [X] T032 [US1] Export compensation-resolution runtime APIs from packages/engine/compensation-resolution/src/index.ts
- [X] T033 [US1] Integrate compensation fixture loading and run actions into apps/web/src/app/compensationResolutionSlice.ts
- [X] T034 [US1] Render the compensation-resolution fixture runner and resolved output table in apps/web/src/pages/CompensationResolutionPage.ts
- [X] T035 [US1] Add compensation-resolution navigation without removing date or service access in apps/web/src/main.ts
- [X] T036 [US1] Add compensation-resolution view styles in apps/web/src/styles.css
- [X] T037 [US1] Verify User Story 1 with npm test -- packages/tests/compensation-resolution-output.test.ts packages/tests/compensation-resolution-persistence.test.ts

**Checkpoint**: User Story 1 is functional and independently testable as the MVP.

---

## Phase 4: User Story 2 - Reject Invalid Compensation Inputs (Priority: P2)

**Goal**: Block invalid compensation packets before authoritative compensation outputs are written.

**Independent Test**: Submit packets with missing required groups, blank strings, malformed amounts, unsupported compensation bases, and missing conditional packets, then verify failed runs, structured errors, and no authoritative compensation output values.

### Tests for User Story 2

- [X] T038 [P] [US2] Add invalid-packet tests for missing required compensation groups in packages/tests/compensation-resolution-validation.test.ts
- [X] T039 [P] [US2] Add invalid-packet tests for blank strings instead of explicit null or numeric values in packages/tests/compensation-resolution-validation.test.ts
- [X] T040 [P] [US2] Add invalid-packet tests for malformed or negative compensation amounts in packages/tests/compensation-resolution-validation.test.ts
- [X] T041 [P] [US2] Add invalid-packet tests for unsupported compensation bases and missing conditional packets in packages/tests/compensation-resolution-validation.test.ts
- [X] T042 [P] [US2] Add failed-run no-authoritative-output persistence tests in packages/tests/compensation-resolution-validation.test.ts

### Implementation for User Story 2

- [X] T043 [US2] Add structured blocking error builders in packages/engine/compensation-resolution/src/errors.ts
- [X] T044 [US2] Extend compensation packet validation for missing groups, blank strings, malformed amounts, negative amounts, and unsupported bases in packages/engine/compensation-resolution/src/validatePacket.ts
- [X] T045 [US2] Extend conditional trigger validation for compensation history, covered compensation, limit, frozen-benefit support, and PIA packets in packages/engine/compensation-resolution/src/validatePacket.ts
- [X] T046 [US2] Persist failed validation attempts as failed engine_run records without authoritative compensation values in packages/engine/compensation-resolution/src/runCompensationResolution.ts
- [X] T047 [US2] Display compensation validation error summaries in apps/web/src/pages/CompensationResolutionPage.ts
- [X] T048 [US2] Verify User Story 2 with npm test -- packages/tests/compensation-resolution-validation.test.ts

**Checkpoint**: User Stories 1 and 2 work independently with valid and invalid packet paths.

---

## Phase 5: User Story 3 - Review Compensation Trace (Priority: P3)

**Goal**: Provide reviewable trace metadata for every populated compensation quantity and warning-bearing completed run.

**Independent Test**: Select completed compensation runs and verify each populated compensation field has trace rows containing packet, module, version, rule branch, reviewed fields, intermediate decisions, and warnings when applicable.

### Tests for User Story 3

- [X] T049 [P] [US3] Add trace completeness tests for all populated compensation fields in packages/tests/compensation-resolution-trace.test.ts
- [X] T050 [P] [US3] Add repeated-run determinism tests that compare compensation values and trace decisions across five runs in packages/tests/compensation-resolution-trace.test.ts
- [X] T051 [P] [US3] Add frozen-benefit warning trace tests for CR003 in packages/tests/compensation-resolution-trace.test.ts

### Implementation for User Story 3

- [X] T052 [US3] Implement trace row construction for compensation outputs and warnings in packages/engine/compensation-resolution/src/trace.ts
- [X] T053 [US3] Persist module_trace rows for each populated compensation output and warning path in packages/engine/compensation-resolution/src/runCompensationResolution.ts
- [X] T054 [US3] Add trace and warning state selectors to apps/web/src/app/compensationResolutionSlice.ts
- [X] T055 [US3] Render compensation trace details and warning notes in apps/web/src/pages/CompensationResolutionPage.ts
- [X] T056 [US3] Verify User Story 3 with npm test -- packages/tests/compensation-resolution-trace.test.ts

**Checkpoint**: All compensation-resolution stories are independently functional and traceable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Complete regression, static-browser verification, docs alignment, and committed build output.

- [X] T057 [P] Add prior-slice regression guard to the compensation validation command notes in specs/003-compensation-resolution-slice/quickstart.md
- [X] T058 [P] Update implementation completion notes in docs/architecture/compensation_resolution_slice_v0.1.0.md
- [X] T059 Run all deterministic tests with npm test and fix issues in packages/tests/
- [X] T060 Run lint/type checks with npm run lint and fix issues in packages/engine/compensation-resolution/src/
- [X] T061 Run the static browser build with npm run build and update committed assets under apps/web/dist/
- [X] T062 Start the Vite app and validate the quickstart flow in apps/web/src/pages/CompensationResolutionPage.ts
- [X] T063 Confirm browser-only/no-network execution by inspecting compensation-resolution imports in packages/engine/compensation-resolution/src/
- [X] T064 Confirm form resolution, benefit kernel, V1/VE, valuation listing, and BSRS implementations remain out of scope in packages/engine/ and packages/output-adapters/
- [X] T065 Update task completion checkboxes in specs/003-compensation-resolution-slice/tasks.md after implementation verification

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

- US1 Run Reviewed Compensation Resolution: no dependency on US2 or US3 after foundation.
- US2 Reject Invalid Compensation Inputs: no dependency on US3; shares validation and run persistence contracts with US1.
- US3 Review Compensation Trace: depends on completed compensation run semantics from US1, but trace tests remain independently executable.

### Within Each User Story

- Write tests first and confirm they fail before implementation.
- Implement deterministic validation before calculation.
- Implement deterministic calculation and warning generation before persistence integration.
- Implement persistence before browser UI display.
- Verify each story independently before moving to cross-cutting polish.

## Parallel Opportunities

- T003, T004, T008, and T009 can run in parallel after package directories exist.
- T014, T017, and T018 can run in parallel with repository helper work because they touch different files.
- T020 through T024 can run in parallel as independent US1 test files or test sections.
- T038 through T042 can run in parallel as independent invalid-packet test cases.
- T049 through T051 can run in parallel as independent trace/determinism test cases.
- US2 and US3 can begin after Phase 2 when separate contributors avoid overlapping edits to runCompensationResolution.ts.

## Parallel Example: User Story 1

```bash
Task: "T020 [P] [US1] Add contract-shape tests for RunCompensationResolutionRequest and RunCompensationResolutionResult in packages/tests/compensation-resolution-contract.test.ts"
Task: "T021 [P] [US1] Add deterministic output tests for CR001-CR003 compensation quantities in packages/tests/compensation-resolution-output.test.ts"
Task: "T023 [P] [US1] Add sql.js persistence tests for engine_run and resolved_service_comp_output compensation columns in packages/tests/compensation-resolution-persistence.test.ts"
```

## Parallel Example: User Story 2

```bash
Task: "T038 [P] [US2] Add invalid-packet tests for missing required compensation groups in packages/tests/compensation-resolution-validation.test.ts"
Task: "T039 [P] [US2] Add invalid-packet tests for blank strings instead of explicit null or numeric values in packages/tests/compensation-resolution-validation.test.ts"
Task: "T040 [P] [US2] Add invalid-packet tests for malformed or negative compensation amounts in packages/tests/compensation-resolution-validation.test.ts"
```

## Parallel Example: User Story 3

```bash
Task: "T049 [P] [US3] Add trace completeness tests for all populated compensation fields in packages/tests/compensation-resolution-trace.test.ts"
Task: "T050 [P] [US3] Add repeated-run determinism tests that compare compensation values and trace decisions across five runs in packages/tests/compensation-resolution-trace.test.ts"
Task: "T051 [P] [US3] Add frozen-benefit warning trace tests for CR003 in packages/tests/compensation-resolution-trace.test.ts"
```

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1 Setup.
2. Complete Phase 2 Foundational.
3. Complete Phase 3 US1.
4. Stop and validate compensation fixture outputs, warning behavior, service-column preservation, and persistence.
5. Commit the MVP only after tests, lint, build, and static artifact checks pass.

### Incremental Delivery

1. Add US2 validation blocking after the US1 happy path is stable.
2. Add US3 trace review after successful and failed run semantics are stable.
3. Finish Phase 6 with full regression, quickstart validation, and committed dist output.

### Out of Scope Guardrails

- Do not implement form_resolution, benefit_kernel, V1/VE output, valuation listings, or BSRS adapters in this slice.
- Do not add server calls, hosted APIs, telemetry dependencies, or raw-document reads.
- Do not recalculate or overwrite service quantities when compensation resolution writes compensation fields.
