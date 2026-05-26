# Tasks: Form Resolution Slice

**Input**: Design documents from `/specs/004-form-resolution-slice/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/form-resolution-slice.md, quickstart.md

**Tests**: Required. This feature changes deterministic form logic, sql.js persistence, structured validation, traceability, warnings/errors, browser integration, and committed static runtime output.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently. US1 is the MVP for the fourth executable slice.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the form-resolution package skeleton and register it with the existing browser-only Vite/sql.js workspace without implementing benefit-kernel or output-adapter modules.

- [X] T001 Create the form-resolution package manifest in packages/engine/form-resolution/package.json
- [X] T002 Create the form-resolution TypeScript config in packages/engine/form-resolution/tsconfig.json
- [X] T003 [P] Add the public form-resolution barrel placeholder in packages/engine/form-resolution/src/index.ts
- [X] T004 [P] Add the package source type placeholder in packages/engine/form-resolution/src/types.ts
- [X] T005 Register the form-resolution workspace dependency in apps/web/package.json
- [X] T006 Register the form-resolution alias in tsconfig.json
- [X] T007 Register the form-resolution test alias in vitest.config.ts
- [X] T008 [P] Add the form page placeholder module in apps/web/src/pages/FormResolutionPage.ts
- [X] T009 [P] Add the browser app state placeholder in apps/web/src/app/formResolutionSlice.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared types, fixture conversion, repository helpers, and deterministic boundaries that all form stories depend on.

**Critical**: No user story work can begin until this phase is complete.

- [X] T010 Add shared form-resolution module name support to StructuredIssue and ModuleTrace in packages/shared/src/types.ts
- [X] T011 Add form_resolution packet type support to engine input packet records in packages/db/src/repositories.ts
- [X] T012 Add repository helpers for inserting and listing resolved_forms_output rows in packages/db/src/repositories.ts
- [X] T013 Add repository helper for fetching form-resolution runs with trace rows in packages/db/src/repositories.ts
- [X] T014 Add form-resolution fixture CSV parsing utilities in packages/tests/form-resolution-fixtures.ts
- [X] T015 Add reviewed form packet fixture builders from form CSV rows in packages/engine/form-resolution/src/fixturePacketBuilder.ts
- [X] T016 Add deterministic form rule constants and module version exports in packages/engine/form-resolution/src/types.ts
- [X] T017 [P] Add form-resolution architecture notes in docs/architecture/form_resolution_slice_v0.1.0.md
- [X] T018 [P] Add form trace field mapping in docs/mappings/form_resolution_trace_map_v0.1.0.csv
- [X] T019 Verify no benefit-kernel or output-adapter package is created for this slice under packages/engine/ and packages/output-adapters/

**Checkpoint**: Foundation ready. User story implementation can start after this phase.

---

## Phase 3: User Story 1 - Run Reviewed Form Resolution (Priority: P1) MVP

**Goal**: Run deterministic form resolution for reviewed form packets and persist retirement type, form codes, payment status, lump-sum option, and programming indicators.

**Independent Test**: Load `packages/tests/form_resolution_test_cases_v0.1.0.csv`, build reviewed packets for FR001-FR003, run only `form_resolution`, and verify expected form outputs and persistence.

### Tests for User Story 1

- [X] T020 [P] [US1] Add contract-shape tests for RunFormResolutionRequest and RunFormResolutionResult in packages/tests/form-resolution-contract.test.ts
- [X] T021 [P] [US1] Add deterministic output tests for FR001-FR003 form fields in packages/tests/form-resolution-output.test.ts
- [X] T022 [P] [US1] Add in-pay, QDRO, explicit-null, and no-benefit-amount assertions in packages/tests/form-resolution-output.test.ts
- [X] T023 [P] [US1] Add sql.js persistence tests for engine_run and resolved_forms_output rows in packages/tests/form-resolution-persistence.test.ts
- [X] T024 [P] [US1] Add assertions that form runs do not write benefit-kernel or output-adapter rows in packages/tests/form-resolution-persistence.test.ts

### Implementation for User Story 1

- [X] T025 [US1] Implement form packet validation for required groups and fixture-supported controlled values in packages/engine/form-resolution/src/validatePacket.ts
- [X] T026 [US1] Implement deterministic normal-form, in-pay, QDRO, death-form, lump-sum, and indicator rules in packages/engine/form-resolution/src/formRules.ts
- [X] T027 [US1] Implement form output resolution for all contract output fields in packages/engine/form-resolution/src/resolveForms.ts
- [X] T028 [US1] Implement review-relevant warning generation for valid in-pay, QDRO, QPSA, death, contribution, and lump-sum branches in packages/engine/form-resolution/src/resolveForms.ts
- [X] T029 [US1] Implement form run orchestration with engine_run persistence in packages/engine/form-resolution/src/runFormResolution.ts
- [X] T030 [US1] Persist successful form outputs to resolved_forms_output only in packages/engine/form-resolution/src/runFormResolution.ts
- [X] T031 [US1] Export form-resolution runtime APIs from packages/engine/form-resolution/src/index.ts
- [X] T032 [US1] Integrate form fixture loading and run actions into apps/web/src/app/formResolutionSlice.ts
- [X] T033 [US1] Render the form-resolution fixture runner and resolved output table in apps/web/src/pages/FormResolutionPage.ts
- [X] T034 [US1] Add form-resolution navigation without removing date, service, or compensation access in apps/web/src/main.ts
- [X] T035 [US1] Add form-resolution view styles in apps/web/src/styles.css
- [X] T036 [US1] Verify User Story 1 with npm test -- packages/tests/form-resolution-output.test.ts packages/tests/form-resolution-persistence.test.ts

**Checkpoint**: User Story 1 is functional and independently testable as the MVP.

---

## Phase 4: User Story 2 - Reject Invalid Form Inputs (Priority: P2)

**Goal**: Block invalid form packets before authoritative form outputs are written.

**Independent Test**: Submit packets with missing required groups, blank strings, unsupported form rules, inconsistent pay status, and missing conditional packets, then verify failed runs, structured errors, and no resolved_forms_output row.

### Tests for User Story 2

- [X] T037 [P] [US2] Add invalid-packet tests for missing required form groups in packages/tests/form-resolution-validation.test.ts
- [X] T038 [P] [US2] Add invalid-packet tests for blank strings instead of explicit nulls or controlled values in packages/tests/form-resolution-validation.test.ts
- [X] T039 [P] [US2] Add invalid-packet tests for unsupported normal-form, death-benefit, conversion, and lump-sum rules in packages/tests/form-resolution-validation.test.ts
- [X] T040 [P] [US2] Add invalid-packet tests for conflicting current_pay_status and current pay fields in packages/tests/form-resolution-validation.test.ts
- [X] T041 [P] [US2] Add invalid-packet tests for missing in-pay, QPSA, QDRO, death-benefit, and contribution conditional packets in packages/tests/form-resolution-validation.test.ts
- [X] T042 [P] [US2] Add failed-run no-authoritative-output persistence tests in packages/tests/form-resolution-validation.test.ts

### Implementation for User Story 2

- [X] T043 [US2] Add structured blocking error builders in packages/engine/form-resolution/src/errors.ts
- [X] T044 [US2] Extend form packet validation for missing groups, blank strings, unsupported controlled rules, and malformed booleans in packages/engine/form-resolution/src/validatePacket.ts
- [X] T045 [US2] Extend conditional trigger validation for in-pay, QPSA, QDRO, death-benefit, mandatory contribution, and voluntary contribution packets in packages/engine/form-resolution/src/validatePacket.ts
- [X] T046 [US2] Persist failed validation attempts as failed engine_run records without resolved_forms_output rows in packages/engine/form-resolution/src/runFormResolution.ts
- [X] T047 [US2] Display form validation error summaries in apps/web/src/pages/FormResolutionPage.ts
- [X] T048 [US2] Verify User Story 2 with npm test -- packages/tests/form-resolution-validation.test.ts

**Checkpoint**: User Stories 1 and 2 work independently with valid and invalid packet paths.

---

## Phase 5: User Story 3 - Review Form Trace (Priority: P3)

**Goal**: Provide reviewable trace metadata for every populated form output and warning-bearing completed run.

**Independent Test**: Select completed form runs and verify each populated form field has trace rows containing packet, module, version, rule branch, reviewed fields, intermediate decisions, and warnings when applicable.

### Tests for User Story 3

- [X] T049 [P] [US3] Add trace completeness tests for all populated form output fields in packages/tests/form-resolution-trace.test.ts
- [X] T050 [P] [US3] Add repeated-run determinism tests that compare form values and trace decisions across five runs in packages/tests/form-resolution-trace.test.ts
- [X] T051 [P] [US3] Add warning trace tests for in-pay, QDRO, QPSA, death-benefit, contribution, and lump-sum branch notes in packages/tests/form-resolution-trace.test.ts

### Implementation for User Story 3

- [X] T052 [US3] Implement trace row construction for form outputs and warnings in packages/engine/form-resolution/src/trace.ts
- [X] T053 [US3] Persist module_trace rows for each populated form output and warning path in packages/engine/form-resolution/src/runFormResolution.ts
- [X] T054 [US3] Add trace and warning state selectors to apps/web/src/app/formResolutionSlice.ts
- [X] T055 [US3] Render form trace details and warning notes in apps/web/src/pages/FormResolutionPage.ts
- [X] T056 [US3] Verify User Story 3 with npm test -- packages/tests/form-resolution-trace.test.ts

**Checkpoint**: All form-resolution stories are independently functional and traceable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Complete regression, static-browser verification, docs alignment, and committed build output.

- [X] T057 [P] Add prior-slice regression guard to the form validation command notes in specs/004-form-resolution-slice/quickstart.md
- [X] T058 [P] Update implementation completion notes in docs/architecture/form_resolution_slice_v0.1.0.md
- [X] T059 Run all deterministic tests with npm test and fix issues in packages/tests/
- [X] T060 Run lint/type checks with npm run lint and fix issues in packages/engine/form-resolution/src/
- [X] T061 Run the static browser build with npm run build and update committed assets under apps/web/dist/
- [X] T062 Start the Vite app and validate the quickstart flow in apps/web/src/pages/FormResolutionPage.ts
- [X] T063 Confirm browser-only/no-network execution by inspecting form-resolution imports in packages/engine/form-resolution/src/
- [X] T064 Confirm benefit kernel, V1/VE, valuation listing, and BSRS implementations remain out of scope in packages/engine/ and packages/output-adapters/
- [X] T065 Update task completion checkboxes in specs/004-form-resolution-slice/tasks.md after implementation verification

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

- US1 Run Reviewed Form Resolution: no dependency on US2 or US3 after foundation.
- US2 Reject Invalid Form Inputs: no dependency on US3; shares validation and run persistence contracts with US1.
- US3 Review Form Trace: depends on completed form run semantics from US1, but trace tests remain independently executable.

### Within Each User Story

- Write tests first and confirm they fail before implementation.
- Implement deterministic validation before form resolution.
- Implement deterministic form rules and warning generation before persistence integration.
- Implement persistence before browser UI display.
- Verify each story independently before moving to cross-cutting polish.

## Parallel Opportunities

- T003, T004, T008, and T009 can run in parallel after package directories exist.
- T014, T017, and T018 can run in parallel with repository helper work because they touch different files.
- T020 through T024 can run in parallel as independent US1 test files or test sections.
- T037 through T042 can run in parallel as independent invalid-packet test cases.
- T049 through T051 can run in parallel as independent trace/determinism test cases.
- US2 and US3 can begin after Phase 2 when separate contributors avoid overlapping edits to runFormResolution.ts.

## Parallel Example: User Story 1

```bash
Task: "T020 [P] [US1] Add contract-shape tests for RunFormResolutionRequest and RunFormResolutionResult in packages/tests/form-resolution-contract.test.ts"
Task: "T021 [P] [US1] Add deterministic output tests for FR001-FR003 form fields in packages/tests/form-resolution-output.test.ts"
Task: "T023 [P] [US1] Add sql.js persistence tests for engine_run and resolved_forms_output rows in packages/tests/form-resolution-persistence.test.ts"
```

## Parallel Example: User Story 2

```bash
Task: "T037 [P] [US2] Add invalid-packet tests for missing required form groups in packages/tests/form-resolution-validation.test.ts"
Task: "T038 [P] [US2] Add invalid-packet tests for blank strings instead of explicit nulls or controlled values in packages/tests/form-resolution-validation.test.ts"
Task: "T041 [P] [US2] Add invalid-packet tests for missing in-pay, QPSA, QDRO, death-benefit, and contribution conditional packets in packages/tests/form-resolution-validation.test.ts"
```

## Parallel Example: User Story 3

```bash
Task: "T049 [P] [US3] Add trace completeness tests for all populated form output fields in packages/tests/form-resolution-trace.test.ts"
Task: "T050 [P] [US3] Add repeated-run determinism tests that compare form values and trace decisions across five runs in packages/tests/form-resolution-trace.test.ts"
Task: "T051 [P] [US3] Add warning trace tests for in-pay, QDRO, QPSA, death-benefit, contribution, and lump-sum branch notes in packages/tests/form-resolution-trace.test.ts"
```

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1 Setup.
2. Complete Phase 2 Foundational.
3. Complete Phase 3 US1.
4. Stop and validate form fixture outputs, warning behavior, persistence, and no benefit-kernel or output-adapter writes.
5. Commit the MVP only after tests, lint, build, and static artifact checks pass.

### Incremental Delivery

1. Add US2 validation blocking after the US1 happy path is stable.
2. Add US3 trace review after successful and failed run semantics are stable.
3. Finish Phase 6 with full regression, quickstart validation, and committed dist output.

### Out of Scope Guardrails

- Do not implement benefit_kernel, V1/VE output, valuation listings, or BSRS adapters in this slice.
- Do not add server calls, hosted APIs, telemetry dependencies, or raw-document reads.
- Do not calculate benefit amounts, present values, V1/VE outputs, valuation listings, or BSRS configuration values from form resolution.
