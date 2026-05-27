# Tasks: Valuation Listings Output Slice

**Input**: Design documents from `/specs/007-valuation-listings-output/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/valuation-listings-output.md, quickstart.md

**Tests**: Required. This feature changes deterministic adapter logic, sql.js persistence, structured validation, traceability, warnings/errors, browser integration, official PBGC template compatibility, and committed static runtime output.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently. US1 is the MVP for the seventh executable slice.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the valuation-listings package skeleton and register it with the existing browser-only Vite/sql.js workspace without implementing BSRS modules.

- [X] T001 Create the valuation-listings package manifest in packages/engine/valuation-listings-output/package.json
- [X] T002 Create the valuation-listings TypeScript config in packages/engine/valuation-listings-output/tsconfig.json
- [X] T003 [P] Add the public valuation-listings barrel placeholder in packages/engine/valuation-listings-output/src/index.ts
- [X] T004 [P] Add the package source type placeholder in packages/engine/valuation-listings-output/src/types.ts
- [X] T005 Register the valuation-listings workspace dependency in apps/web/package.json
- [X] T006 Register the valuation-listings alias in tsconfig.json
- [X] T007 Register the valuation-listings test alias in vitest.config.ts
- [X] T008 [P] Add the valuation-listings page placeholder module in apps/web/src/pages/ValuationListingsOutputPage.ts
- [X] T009 [P] Add the browser app state placeholder in apps/web/src/app/valuationListingsOutputSlice.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared types, fixture conversion, repository helpers, DD naming, and deterministic boundaries that all valuation-listings stories depend on.

**Critical**: No user story work can begin until this phase is complete.

- [X] T010 Add shared valuation-listings module name support to StructuredIssue and ModuleTrace in packages/shared/src/types.ts
- [X] T011 Add valuation_listings_output packet type support to engine input packet records in packages/db/src/repositories.ts
- [X] T012 Add repository helpers for inserting and listing valuation_listings_output_row rows in packages/db/src/repositories.ts
- [X] T013 Add repository helper for fetching valuation-listing runs with trace rows in packages/db/src/repositories.ts
- [X] T014 Add valuation-listings fixture packet parsing utilities in packages/tests/valuation-listings-output-fixtures.ts
- [X] T015 Add reviewed valuation-listings packet fixture builders from committed contract rows in packages/engine/valuation-listings-output/src/fixturePacketBuilder.ts
- [X] T016 Add deterministic valuation-listings field lists, row-family exports, and module version exports in packages/engine/valuation-listings-output/src/types.ts
- [X] T017 [P] Add valuation-listings architecture notes in docs/architecture/valuation_listings_output_slice_v0.1.0.md
- [X] T018 [P] Add valuation-listings trace field mapping in docs/mappings/valuation_listings_output_trace_map_v0.1.0.csv
- [X] T019 [P] Add the DD.csv canonical naming helper and lookup table for valuation-listings field semantics in packages/engine/valuation-listings-output/src/ddMapping.ts
- [X] T020 Verify no BSRS configuration or other output-adapter package is created for this slice under packages/output-adapters/

**Checkpoint**: Foundation ready. User story implementation can start after this phase.

---

## Phase 3: User Story 1 - Produce Valuation Listing Output Packets (Priority: P1) MVP

**Goal**: Transform reviewed engine results into a stable valuation-listing-ready output packet and persist the adapter row for PBGC deliverable assembly.

**Independent Test**: Load the committed valuation-listings fixture set, build reviewed packets for supported cases with upstream date, service, compensation, form, benefit-kernel, and V1/VE outputs, run only `valuation_listings_output`, and verify expected populated outputs, explicit nulls, warnings, and persistence.

### Tests for User Story 1

- [X] T021 [P] [US1] Add contract-shape tests for ValuationListingsOutputRequest and ValuationListingsOutputResult in packages/tests/valuation-listings-output-contract.test.ts
- [X] T022 [P] [US1] Add deterministic output tests for committed valuation-listings identity, date, service, form, benefit, ordering, and template fields in packages/tests/valuation-listings-output-output.test.ts
- [X] T023 [P] [US1] Add explicit-null and warning assertions for conditional valuation-listings branches in packages/tests/valuation-listings-output-output.test.ts
- [X] T024 [P] [US1] Add sql.js persistence tests for engine_run and valuation_listings_output_row rows in packages/tests/valuation-listings-output-persistence.test.ts
- [X] T025 [P] [US1] Add assertions that valuation-listing runs do not write BSRS configuration or other output-adapter rows in packages/tests/valuation-listings-output-persistence.test.ts
- [X] T025a [P] [US1] Add a DD-backed mapping regression test that fails when any valuation-listings field requiring DD.csv coverage is missing its canonical mapping in packages/tests/valuation-listings-output-output.test.ts

### Implementation for User Story 1

- [X] T026 [US1] Implement valuation-listings packet validation for required groups, upstream output groups, and contract-supported controlled values in packages/engine/valuation-listings-output/src/validatePacket.ts
- [X] T027 [US1] Implement deterministic valuation-listings projection rules for identity, demographic, date, service, form-state, benefit, ordering, and official PBGC template families in packages/engine/valuation-listings-output/src/valuationListingsMath.ts
- [X] T028 [US1] Implement valuation-listings output resolution for all contract output fields with unsupported fields as explicit nulls in packages/engine/valuation-listings-output/src/resolveValuationListingsOutput.ts
- [X] T029 [US1] Implement unsupported conditional-branch warnings and override warnings without fallback output values in packages/engine/valuation-listings-output/src/resolveValuationListingsOutput.ts
- [X] T030 [US1] Implement valuation-listings run orchestration with engine_run persistence in packages/engine/valuation-listings-output/src/runValuationListingsOutput.ts
- [X] T031 [US1] Persist successful valuation-listings outputs to valuation_listings_output_row only in packages/engine/valuation-listings-output/src/runValuationListingsOutput.ts
- [X] T032 [US1] Export valuation-listings runtime APIs from packages/engine/valuation-listings-output/src/index.ts
- [X] T033 [US1] Integrate valuation-listings fixture loading and run actions into apps/web/src/app/valuationListingsOutputSlice.ts
- [X] T034 [US1] Render the valuation-listings fixture runner and resolved output table in apps/web/src/pages/ValuationListingsOutputPage.ts
- [X] T035 [US1] Add valuation-listings navigation without removing date, service, compensation, form, benefit, or V1/VE access in apps/web/src/main.ts
- [X] T036 [US1] Add valuation-listings view styles in apps/web/src/styles.css
- [X] T037 [US1] Verify User Story 1 with npm test -- packages/tests/valuation-listings-output-output.test.ts packages/tests/valuation-listings-output-persistence.test.ts

**Checkpoint**: User Story 1 is functional and independently testable as the MVP.

---

## Phase 4: User Story 2 - Handle Conditional Valuation Listing Paths (Priority: P2)

**Goal**: Reflect reviewed branch conditions in valuation-listing output fields without inventing fallback values.

**Independent Test**: Submit reviewed packets with in-pay, QDRO, QPSA, asset/recovery, and override-sensitive conditions, then verify explicit nulls or populated values follow the reviewed branch and warnings are recorded.

### Tests for User Story 2

- [X] T038 [P] [US2] Add invalid-packet tests for missing required valuation-listings groups in packages/tests/valuation-listings-output-validation.test.ts
- [X] T039 [P] [US2] Add invalid-packet tests for missing upstream date, service, compensation, form, benefit, and V1/VE groups in packages/tests/valuation-listings-output-validation.test.ts
- [X] T040 [P] [US2] Add invalid-packet tests for blank strings and malformed numeric values in packages/tests/valuation-listings-output-validation.test.ts
- [X] T041 [P] [US2] Add invalid-packet tests for unsupported form, template, ordering, and controlled rules in packages/tests/valuation-listings-output-validation.test.ts
- [X] T042 [P] [US2] Add invalid-packet tests for missing in-pay, QDRO, QPSA, asset/recovery, and override conditional packets in packages/tests/valuation-listings-output-validation.test.ts
- [X] T043 [P] [US2] Add failed-run no-authoritative-output persistence tests in packages/tests/valuation-listings-output-validation.test.ts

### Implementation for User Story 2

- [X] T044 [US2] Add structured blocking error builders in packages/engine/valuation-listings-output/src/errors.ts
- [X] T045 [US2] Extend valuation-listings packet validation for missing groups, missing upstream outputs, blank strings, malformed numbers, and unsupported controlled values in packages/engine/valuation-listings-output/src/validatePacket.ts
- [X] T046 [US2] Extend conditional trigger validation for in-pay, QDRO, QPSA, asset/recovery, template, and override packets in packages/engine/valuation-listings-output/src/validatePacket.ts
- [X] T047 [US2] Persist failed validation attempts as failed engine_run records without valuation_listings_output_row rows in packages/engine/valuation-listings-output/src/runValuationListingsOutput.ts
- [X] T048 [US2] Display valuation-listings validation error summaries in apps/web/src/pages/ValuationListingsOutputPage.ts
- [X] T049 [US2] Verify User Story 2 with npm test -- packages/tests/valuation-listings-output-validation.test.ts

**Checkpoint**: User Stories 1 and 2 work independently with valid and invalid packet paths.

---

## Phase 5: User Story 3 - Preserve Adapter Boundaries and Traceability (Priority: P3)

**Goal**: Provide reviewable trace metadata for every populated valuation-listing output and warning-bearing completed run.

**Independent Test**: Select completed valuation-listing runs and verify each populated output field has trace data containing packet, upstream deterministic outputs, module version, rule branch, and warnings when applicable.

### Tests for User Story 3

- [X] T050 [P] [US3] Add trace completeness tests for all populated valuation-listings output fields in packages/tests/valuation-listings-output-trace.test.ts
- [X] T051 [P] [US3] Add repeated-run determinism tests that compare valuation-listings values and trace decisions across five runs in packages/tests/valuation-listings-output-trace.test.ts
- [X] T052 [P] [US3] Add unsupported branch and warning trace tests for conditional valuation-listings cases in packages/tests/valuation-listings-output-trace.test.ts

### Implementation for User Story 3

- [X] T053 [US3] Implement trace row construction for valuation-listings outputs and warnings in packages/engine/valuation-listings-output/src/trace.ts
- [X] T054 [US3] Persist module_trace rows for each populated valuation-listings output and warning path in packages/engine/valuation-listings-output/src/runValuationListingsOutput.ts
- [X] T055 [US3] Add trace and warning state selectors to apps/web/src/app/valuationListingsOutputSlice.ts
- [X] T056 [US3] Render valuation-listings trace details and warning notes in apps/web/src/pages/ValuationListingsOutputPage.ts
- [X] T057 [US3] Verify User Story 3 with npm test -- packages/tests/valuation-listings-output-trace.test.ts

**Checkpoint**: All valuation-listings stories are independently functional and traceable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Complete regression, static-browser verification, docs alignment, official template validation, and committed build output.

- [X] T058 [P] Add prior-slice regression guard to the valuation-listings validation command notes in specs/007-valuation-listings-output/quickstart.md
- [X] T059 [P] Update implementation completion notes in docs/architecture/valuation_listings_output_slice_v0.1.0.md
- [X] T060 Run all deterministic tests with npm test and fix issues in packages/tests/
- [X] T061 Run lint/type checks with npm run lint and fix issues in packages/engine/valuation-listings-output/src/
- [X] T062 Run the static browser build with npm run build and update committed assets under apps/web/dist/
- [X] T063 Start the Vite app and validate the quickstart flow in apps/web/src/pages/ValuationListingsOutputPage.ts
- [X] T064 Confirm browser-only/no-network execution by inspecting valuation-listings imports in packages/engine/valuation-listings-output/src/
- [X] T065 Confirm BSRS configuration and other output-adapter implementations remain out of scope in packages/output-adapters/

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

- US1 Produce Valuation Listing Output Packets: no dependency on US2 or US3 after foundation.
- US2 Handle Conditional Valuation Listing Paths: no dependency on US3; shares validation and run persistence contracts with US1.
- US3 Preserve Adapter Boundaries and Traceability: depends on completed adapter run semantics from US1, but trace tests remain independently executable.

### Within Each User Story

- Write tests first and confirm they fail before implementation.
- Implement deterministic validation before output projection.
- Implement deterministic projection and warning generation before persistence integration.
- Implement persistence before browser UI display.
- Verify each story independently before moving to cross-cutting polish.

## Parallel Opportunities

- T003, T004, T008, and T009 can run in parallel after package directories exist.
- T014, T017, T018, and T019 can run in parallel with repository helper work because they touch different files.
- T021 through T025 can run in parallel as independent US1 test files or test sections.
- T038 through T043 can run in parallel as independent invalid-packet test cases.
- T050 through T052 can run in parallel as independent trace/determinism test cases.
- US2 and US3 can begin after Phase 2 when separate contributors avoid overlapping edits to runValuationListingsOutput.ts.

## Parallel Example: User Story 1

```bash
Task: "T021 [P] [US1] Add contract-shape tests for ValuationListingsOutputRequest and ValuationListingsOutputResult in packages/tests/valuation-listings-output-contract.test.ts"
Task: "T022 [P] [US1] Add deterministic output tests for committed valuation-listings identity, date, service, form, benefit, ordering, and template fields in packages/tests/valuation-listings-output-output.test.ts"
Task: "T024 [P] [US1] Add sql.js persistence tests for engine_run and valuation_listings_output_row rows in packages/tests/valuation-listings-output-persistence.test.ts"
```

## Parallel Example: User Story 2

```bash
Task: "T038 [P] [US2] Add invalid-packet tests for missing required valuation-listings groups in packages/tests/valuation-listings-output-validation.test.ts"
Task: "T039 [P] [US2] Add invalid-packet tests for missing upstream date, service, compensation, form, benefit, and V1/VE groups in packages/tests/valuation-listings-output-validation.test.ts"
Task: "T042 [P] [US2] Add invalid-packet tests for missing in-pay, QDRO, QPSA, asset/recovery, and override conditional packets in packages/tests/valuation-listings-output-validation.test.ts"
```

## Parallel Example: User Story 3

```bash
Task: "T050 [P] [US3] Add trace completeness tests for all populated valuation-listings output fields in packages/tests/valuation-listings-output-trace.test.ts"
Task: "T051 [P] [US3] Add repeated-run determinism tests that compare valuation-listings values and trace decisions across five runs in packages/tests/valuation-listings-output-trace.test.ts"
Task: "T052 [P] [US3] Add unsupported branch and warning trace tests for conditional valuation-listings cases in packages/tests/valuation-listings-output-trace.test.ts"
```

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1 Setup.
2. Complete Phase 2 Foundational.
3. Complete Phase 3 US1.
4. Stop and validate valuation-listings outputs, warning behavior, persistence, and no output-adapter writes.
5. Commit the MVP only after tests, lint, build, and static artifact checks pass.

### Incremental Delivery

1. Add US2 validation blocking after the US1 happy path is stable.
2. Add US3 trace review after successful and failed run semantics are stable.
3. Finish Phase 6 with full regression, quickstart validation, and committed dist output.

### Out of Scope Guardrails

- Do not implement BSRS configuration output or other output adapters in this slice.
- Do not add server calls, hosted APIs, telemetry dependencies, or raw-document reads.
- Do not let downstream adapters recalculate benefits or change resolved outputs.
