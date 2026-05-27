# Tasks: V1/VE Output Slice

**Input**: Design documents from `/specs/006-v1-ve-output/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/v1-ve-output.md, quickstart.md

**Tests**: Required. This feature changes deterministic adapter logic, sql.js persistence, structured validation, traceability, warnings/errors, browser integration, and committed static runtime output.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently. US1 is the MVP for the sixth executable slice.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the V1/VE package skeleton and register it with the existing browser-only Vite/sql.js workspace without implementing valuation-listings or BSRS modules.

- [X] T001 Create the V1/VE package manifest in packages/engine/v1-ve-output/package.json
- [X] T002 Create the V1/VE TypeScript config in packages/engine/v1-ve-output/tsconfig.json
- [X] T003 [P] Add the public V1/VE barrel placeholder in packages/engine/v1-ve-output/src/index.ts
- [X] T004 [P] Add the package source type placeholder in packages/engine/v1-ve-output/src/types.ts
- [X] T005 Register the V1/VE workspace dependency in apps/web/package.json
- [X] T006 Register the V1/VE alias in tsconfig.json
- [X] T007 Register the V1/VE test alias in vitest.config.ts
- [X] T008 [P] Add the V1/VE page placeholder module in apps/web/src/pages/V1VeOutputPage.ts
- [X] T009 [P] Add the browser app state placeholder in apps/web/src/app/v1VeOutputSlice.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared types, fixture conversion, repository helpers, and deterministic boundaries that all V1/VE stories depend on.

**Critical**: No user story work can begin until this phase is complete.

- [X] T010 Add shared V1/VE module name support to StructuredIssue and ModuleTrace in packages/shared/src/types.ts
- [X] T011 Add v1_ve_output packet type support to engine input packet records in packages/db/src/repositories.ts
- [X] T012 Add repository helpers for inserting and listing v1_ve_output_row rows in packages/db/src/repositories.ts
- [X] T013 Add repository helper for fetching V1/VE runs with trace rows in packages/db/src/repositories.ts
- [X] T014 Add V1/VE fixture packet parsing utilities in packages/tests/v1-ve-output-fixtures.ts
- [X] T015 Add reviewed V1/VE packet fixture builders from committed contract rows in packages/engine/v1-ve-output/src/fixturePacketBuilder.ts
- [X] T016 Add deterministic V1/VE field lists, row-family exports, and module version exports in packages/engine/v1-ve-output/src/types.ts
- [X] T017 [P] Add V1/VE architecture notes in docs/architecture/v1_ve_output_slice_v0.1.0.md
- [X] T018 [P] Add V1/VE trace field mapping in docs/mappings/v1_ve_output_trace_map_v0.1.0.csv
- [X] T019a [P] Add the DD.csv canonical naming helper and lookup table for V1 field semantics in packages/engine/v1-ve-output/src/ddMapping.ts
- [X] T019 Verify no valuation-listings, BSRS configuration, or other output-adapter package is created for this slice under packages/output-adapters/

**Checkpoint**: Foundation ready. User story implementation can start after this phase.

---

## Phase 3: User Story 1 - Produce V1/VE Output Packets (Priority: P1) MVP

**Goal**: Transform reviewed engine results into a stable V1/VE-ready output packet and persist the adapter row for downstream spreadsheet population.

**Independent Test**: Load the committed V1/VE fixture set, build reviewed packets for supported cases with upstream date, service, compensation, form, and benefit-kernel outputs, run only `v1_ve_output`, and verify expected populated outputs, explicit nulls, warnings, and persistence.

### Tests for User Story 1

- [X] T020 [P] [US1] Add contract-shape tests for V1VeOutputRequest and V1VeOutputResult in packages/tests/v1-ve-output-contract.test.ts
- [X] T021 [P] [US1] Add deterministic output tests for committed V1/VE identity, date, form, and benefit fields in packages/tests/v1-ve-output-output.test.ts
- [X] T022a [P] [US1] Add a DD-first mapping test that fails when an emitted V1/VE field lacks a required DD mapping in packages/tests/v1-ve-output-output.test.ts
- [X] T022 [P] [US1] Add explicit-null and warning assertions for conditional V1/VE branches in packages/tests/v1-ve-output-output.test.ts
- [X] T023 [P] [US1] Add sql.js persistence tests for engine_run and v1_ve_output_row rows in packages/tests/v1-ve-output-persistence.test.ts
- [X] T024 [P] [US1] Add assertions that V1/VE runs do not write valuation-listings, BSRS, or output-adapter rows in packages/tests/v1-ve-output-persistence.test.ts

### Implementation for User Story 1

- [X] T025 [US1] Implement V1/VE packet validation for required groups, upstream output groups, and contract-supported controlled values in packages/engine/v1-ve-output/src/validatePacket.ts
- [X] T026 [US1] Implement deterministic V1/VE projection rules for identity, date, form-state, Title IV, Section 4022(c), termination-benefit, nonguaranteed, and present-value families in packages/engine/v1-ve-output/src/v1VeMath.ts
- [X] T027 [US1] Implement V1/VE output resolution for all contract output fields with unsupported fields as explicit nulls in packages/engine/v1-ve-output/src/resolveV1VeOutput.ts
- [X] T028 [US1] Implement unsupported conditional-branch warnings and override warnings without fallback output values in packages/engine/v1-ve-output/src/resolveV1VeOutput.ts
- [X] T029 [US1] Implement V1/VE run orchestration with engine_run persistence in packages/engine/v1-ve-output/src/runV1VeOutput.ts
- [X] T030 [US1] Persist successful V1/VE outputs to v1_ve_output_row only in packages/engine/v1-ve-output/src/runV1VeOutput.ts
- [X] T031 [US1] Export V1/VE runtime APIs from packages/engine/v1-ve-output/src/index.ts
- [X] T032 [US1] Integrate V1/VE fixture loading and run actions into apps/web/src/app/v1VeOutputSlice.ts
- [X] T033 [US1] Render the V1/VE fixture runner and resolved output table in apps/web/src/pages/V1VeOutputPage.ts
- [X] T034 [US1] Add V1/VE navigation without removing date, service, compensation, form, or benefit access in apps/web/src/main.ts
- [X] T035 [US1] Add V1/VE view styles in apps/web/src/styles.css
- [X] T036 [US1] Verify User Story 1 with npm test -- packages/tests/v1-ve-output-output.test.ts packages/tests/v1-ve-output-persistence.test.ts

**Checkpoint**: User Story 1 is functional and independently testable as the MVP.

---

## Phase 4: User Story 2 - Handle Conditional V1/VE Paths (Priority: P2)

**Goal**: Reflect reviewed branch conditions in V1/VE output fields without inventing fallback values.

**Independent Test**: Submit reviewed packets with in-pay, QDRO, QPSA, and override-sensitive conditions, then verify explicit nulls or populated values follow the reviewed branch and warnings are recorded.

### Tests for User Story 2

- [X] T037 [P] [US2] Add invalid-packet tests for missing required V1/VE groups in packages/tests/v1-ve-output-validation.test.ts
- [X] T038 [P] [US2] Add invalid-packet tests for missing upstream date, service, compensation, form, and benefit groups in packages/tests/v1-ve-output-validation.test.ts
- [X] T039 [P] [US2] Add invalid-packet tests for blank strings and malformed numeric values in packages/tests/v1-ve-output-validation.test.ts
- [X] T040 [P] [US2] Add invalid-packet tests for unsupported form, limitation, and present-value controlled rules in packages/tests/v1-ve-output-validation.test.ts
- [X] T041 [P] [US2] Add invalid-packet tests for missing in-pay, QDRO, QPSA, and override conditional packets in packages/tests/v1-ve-output-validation.test.ts
- [X] T042 [P] [US2] Add failed-run no-authoritative-output persistence tests in packages/tests/v1-ve-output-validation.test.ts

### Implementation for User Story 2

- [X] T043 [US2] Add structured blocking error builders in packages/engine/v1-ve-output/src/errors.ts
- [X] T044 [US2] Extend V1/VE packet validation for missing groups, missing upstream outputs, blank strings, malformed numbers, and unsupported controlled values in packages/engine/v1-ve-output/src/validatePacket.ts
- [X] T045 [US2] Extend conditional trigger validation for in-pay, QDRO, QPSA, limitation, and override packets in packages/engine/v1-ve-output/src/validatePacket.ts
- [X] T046 [US2] Persist failed validation attempts as failed engine_run records without v1_ve_output_row rows in packages/engine/v1-ve-output/src/runV1VeOutput.ts
- [X] T047 [US2] Display V1/VE validation error summaries in apps/web/src/pages/V1VeOutputPage.ts
- [X] T048 [US2] Verify User Story 2 with npm test -- packages/tests/v1-ve-output-validation.test.ts

**Checkpoint**: User Stories 1 and 2 work independently with valid and invalid packet paths.

---

## Phase 5: User Story 3 - Preserve Adapter Boundaries and Traceability (Priority: P3)

**Goal**: Provide reviewable trace metadata for every populated V1/VE output and warning-bearing completed run.

**Independent Test**: Select completed V1/VE runs and verify each populated output field has trace data containing packet, upstream deterministic outputs, module version, rule branch, and warnings when applicable.

### Tests for User Story 3

- [X] T049 [P] [US3] Add trace completeness tests for all populated V1/VE output fields in packages/tests/v1-ve-output-trace.test.ts
- [X] T050 [P] [US3] Add repeated-run determinism tests that compare V1/VE values and trace decisions across five runs in packages/tests/v1-ve-output-trace.test.ts
- [X] T051 [P] [US3] Add unsupported branch and warning trace tests for conditional V1/VE cases in packages/tests/v1-ve-output-trace.test.ts

### Implementation for User Story 3

- [X] T052 [US3] Implement trace row construction for V1/VE outputs and warnings in packages/engine/v1-ve-output/src/trace.ts
- [X] T053 [US3] Persist module_trace rows for each populated V1/VE output and warning path in packages/engine/v1-ve-output/src/runV1VeOutput.ts
- [X] T054 [US3] Add trace and warning state selectors to apps/web/src/app/v1VeOutputSlice.ts
- [X] T055 [US3] Render V1/VE trace details and warning notes in apps/web/src/pages/V1VeOutputPage.ts
- [X] T056 [US3] Verify User Story 3 with npm test -- packages/tests/v1-ve-output-trace.test.ts

**Checkpoint**: All V1/VE stories are independently functional and traceable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Complete regression, static-browser verification, docs alignment, and committed build output.

- [X] T057 [P] Add prior-slice regression guard to the V1/VE validation command notes in specs/006-v1-ve-output/quickstart.md
- [X] T058 [P] Update implementation completion notes in docs/architecture/v1_ve_output_slice_v0.1.0.md
- [X] T059 Run all deterministic tests with npm test and fix issues in packages/tests/
- [X] T060 Run lint/type checks with npm run lint and fix issues in packages/engine/v1-ve-output/src/
- [X] T061 Run the static browser build with npm run build and update committed assets under apps/web/dist/
- [X] T062 Start the Vite app and validate the quickstart flow in apps/web/src/pages/V1VeOutputPage.ts
- [X] T063 Confirm browser-only/no-network execution by inspecting V1/VE imports in packages/engine/v1-ve-output/src/
- [X] T064 Confirm valuation-listings, BSRS, and other output-adapter implementations remain out of scope in packages/output-adapters/
- [X] T065 Update task completion checkboxes in specs/006-v1-ve-output/tasks.md after implementation verification

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

- US1 Produce V1/VE Output Packets: no dependency on US2 or US3 after foundation.
- US2 Handle Conditional V1/VE Paths: no dependency on US3; shares validation and run persistence contracts with US1.
- US3 Preserve Adapter Boundaries and Traceability: depends on completed adapter run semantics from US1, but trace tests remain independently executable.

### Within Each User Story

- Write tests first and confirm they fail before implementation.
- Implement deterministic validation before output projection.
- Implement deterministic projection and warning generation before persistence integration.
- Implement persistence before browser UI display.
- Verify each story independently before moving to cross-cutting polish.

## Parallel Opportunities

- T003, T004, T008, and T009 can run in parallel after package directories exist.
- T014, T017, and T018 can run in parallel with repository helper work because they touch different files.
- T020 through T024 can run in parallel as independent US1 test files or test sections.
- T037 through T042 can run in parallel as independent invalid-packet test cases.
- T049 through T051 can run in parallel as independent trace/determinism test cases.
- US2 and US3 can begin after Phase 2 when separate contributors avoid overlapping edits to runV1VeOutput.ts.

## Parallel Example: User Story 1

```bash
Task: "T020 [P] [US1] Add contract-shape tests for V1VeOutputRequest and V1VeOutputResult in packages/tests/v1-ve-output-contract.test.ts"
Task: "T021 [P] [US1] Add deterministic output tests for committed V1/VE identity, date, form, and benefit fields in packages/tests/v1-ve-output-output.test.ts"
Task: "T023 [P] [US1] Add sql.js persistence tests for engine_run and v1_ve_output_row rows in packages/tests/v1-ve-output-persistence.test.ts"
```

## Parallel Example: User Story 2

```bash
Task: "T037 [P] [US2] Add invalid-packet tests for missing required V1/VE groups in packages/tests/v1-ve-output-validation.test.ts"
Task: "T038 [P] [US2] Add invalid-packet tests for missing upstream date, service, compensation, form, and benefit groups in packages/tests/v1-ve-output-validation.test.ts"
Task: "T041 [P] [US2] Add invalid-packet tests for missing in-pay, QDRO, QPSA, and override conditional packets in packages/tests/v1-ve-output-validation.test.ts"
```

## Parallel Example: User Story 3

```bash
Task: "T049 [P] [US3] Add trace completeness tests for all populated V1/VE output fields in packages/tests/v1-ve-output-trace.test.ts"
Task: "T050 [P] [US3] Add repeated-run determinism tests that compare V1/VE values and trace decisions across five runs in packages/tests/v1-ve-output-trace.test.ts"
Task: "T051 [P] [US3] Add unsupported branch and warning trace tests for conditional V1/VE cases in packages/tests/v1-ve-output-trace.test.ts"
```

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1 Setup.
2. Complete Phase 2 Foundational.
3. Complete Phase 3 US1.
4. Stop and validate V1/VE fixture outputs, warning behavior, persistence, and no output-adapter writes.
5. Commit the MVP only after tests, lint, build, and static artifact checks pass.

### Incremental Delivery

1. Add US2 validation blocking after the US1 happy path is stable.
2. Add US3 trace review after successful and failed run semantics are stable.
3. Finish Phase 6 with full regression, quickstart validation, and committed dist output.

### Out of Scope Guardrails

- Do not implement valuation-listings output, BSRS configuration output, or other output adapters in this slice.
- Do not add server calls, hosted APIs, telemetry dependencies, or raw-document reads.
- Do not let output adapters recalculate benefits or change resolved V1/VE outputs.
