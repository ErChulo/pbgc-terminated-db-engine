# Tasks: Benefit Kernel Slice

**Input**: Design documents from `/specs/005-benefit-kernel-slice/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/benefit-kernel-slice.md, quickstart.md

**Tests**: Required. This feature changes deterministic benefit-kernel logic, sql.js persistence, structured validation, traceability, warnings/errors, browser integration, and committed static runtime output.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently. US1 is the MVP for the fifth executable slice.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the benefit-kernel package skeleton and register it with the existing browser-only Vite/sql.js workspace without implementing output-adapter modules.

- [X] T001 Create the benefit-kernel package manifest in packages/engine/benefit-kernel/package.json
- [X] T002 Create the benefit-kernel TypeScript config in packages/engine/benefit-kernel/tsconfig.json
- [X] T003 [P] Add the public benefit-kernel barrel placeholder in packages/engine/benefit-kernel/src/index.ts
- [X] T004 [P] Add the package source type placeholder in packages/engine/benefit-kernel/src/types.ts
- [X] T005 Register the benefit-kernel workspace dependency in apps/web/package.json
- [X] T006 Register the benefit-kernel alias in tsconfig.json
- [X] T007 Register the benefit-kernel test alias in vitest.config.ts
- [X] T008 [P] Add the benefit-kernel page placeholder module in apps/web/src/pages/BenefitKernelPage.ts
- [X] T009 [P] Add the browser app state placeholder in apps/web/src/app/benefitKernelSlice.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared types, fixture conversion, repository helpers, and deterministic boundaries that all benefit-kernel stories depend on.

**Critical**: No user story work can begin until this phase is complete.

- [X] T010 Add shared benefit-kernel module name support to StructuredIssue and ModuleTrace in packages/shared/src/types.ts
- [X] T011 Add benefit_kernel packet type support to engine input packet records in packages/db/src/repositories.ts
- [X] T012 Add repository helpers for inserting and listing benefit_kernel_output rows in packages/db/src/repositories.ts
- [X] T013 Add repository helper for fetching benefit-kernel runs with trace rows in packages/db/src/repositories.ts
- [X] T014 Add benefit-kernel fixture CSV parsing utilities in packages/tests/benefit-kernel-fixtures.ts
- [X] T015 Add reviewed benefit-kernel packet fixture builders from benefit CSV rows in packages/engine/benefit-kernel/src/fixturePacketBuilder.ts
- [X] T016 Add deterministic benefit-kernel rule constants, output field lists, and module version exports in packages/engine/benefit-kernel/src/types.ts
- [X] T017 [P] Add benefit-kernel architecture notes in docs/architecture/benefit_kernel_slice_v0.1.0.md
- [X] T018 [P] Add benefit-kernel trace field mapping in docs/mappings/benefit_kernel_trace_map_v0.1.0.csv
- [X] T019 Verify no V1/VE, valuation listing, BSRS, or other output-adapter package is created for this slice under packages/output-adapters/

**Checkpoint**: Foundation ready. User story implementation can start after this phase.

---

## Phase 3: User Story 1 - Run Reviewed Benefit Kernel (Priority: P1) MVP

**Goal**: Run deterministic benefit-kernel resolution for reviewed kernel packets and persist fixture-supported monthly benefit and present-value outputs.

**Independent Test**: Load `packages/tests/benefit_kernel_test_cases_v0.1.0.csv`, build reviewed packets for BK001-BK003 with upstream date/service/compensation/form groups, run only `benefit_kernel`, and verify expected populated outputs, explicit nulls, warnings, and persistence.

### Tests for User Story 1

- [X] T020 [P] [US1] Add contract-shape tests for RunBenefitKernelRequest and RunBenefitKernelResult in packages/tests/benefit-kernel-contract.test.ts
- [X] T021 [P] [US1] Add deterministic output tests for BK001 term_mb_nrd_nsf, xrd_mb_term, and pvmb_term in packages/tests/benefit-kernel-output.test.ts
- [X] T022 [P] [US1] Add explicit-null and warning assertions for BK002 integrated and BK003 QPSA fixture branches in packages/tests/benefit-kernel-output.test.ts
- [X] T023 [P] [US1] Add sql.js persistence tests for engine_run and benefit_kernel_output rows in packages/tests/benefit-kernel-persistence.test.ts
- [X] T024 [P] [US1] Add assertions that kernel runs do not write V1/VE, valuation listing, BSRS, or output-adapter rows in packages/tests/benefit-kernel-persistence.test.ts

### Implementation for User Story 1

- [X] T025 [US1] Implement benefit-kernel packet validation for required groups, upstream output groups, and fixture-supported controlled values in packages/engine/benefit-kernel/src/validatePacket.ts
- [X] T026 [US1] Implement deterministic final-average-pay benefit formula and present-value fixture calculations in packages/engine/benefit-kernel/src/benefitMath.ts
- [X] T027 [US1] Implement benefit-kernel output resolution for all contract output fields with unsupported fields as explicit nulls in packages/engine/benefit-kernel/src/resolveBenefitKernel.ts
- [X] T028 [US1] Implement unsupported integrated formula and QPSA branch warnings without fallback benefit values in packages/engine/benefit-kernel/src/resolveBenefitKernel.ts
- [X] T029 [US1] Implement benefit-kernel run orchestration with engine_run persistence in packages/engine/benefit-kernel/src/runBenefitKernel.ts
- [X] T030 [US1] Persist successful benefit-kernel outputs to benefit_kernel_output only in packages/engine/benefit-kernel/src/runBenefitKernel.ts
- [X] T031 [US1] Export benefit-kernel runtime APIs from packages/engine/benefit-kernel/src/index.ts
- [X] T032 [US1] Integrate benefit-kernel fixture loading and run actions into apps/web/src/app/benefitKernelSlice.ts
- [X] T033 [US1] Render the benefit-kernel fixture runner and resolved output table in apps/web/src/pages/BenefitKernelPage.ts
- [X] T034 [US1] Add benefit-kernel navigation without removing date, service, compensation, or form access in apps/web/src/main.ts
- [X] T035 [US1] Add benefit-kernel view styles in apps/web/src/styles.css
- [X] T036 [US1] Verify User Story 1 with npm test -- packages/tests/benefit-kernel-output.test.ts packages/tests/benefit-kernel-persistence.test.ts

**Checkpoint**: User Story 1 is functional and independently testable as the MVP.

---

## Phase 4: User Story 2 - Reject Invalid Benefit Inputs (Priority: P2)

**Goal**: Block invalid benefit-kernel packets before authoritative benefit outputs are written.

**Independent Test**: Submit packets with missing required groups, missing upstream outputs, blank strings, malformed numeric values, unsupported controlled rules, inconsistent limitations, and missing conditional packets, then verify failed runs, structured errors, and no benefit_kernel_output row.

### Tests for User Story 2

- [ ] T037 [P] [US2] Add invalid-packet tests for missing required benefit-kernel groups in packages/tests/benefit-kernel-validation.test.ts
- [ ] T038 [P] [US2] Add invalid-packet tests for missing upstream date, service, compensation, and form output groups in packages/tests/benefit-kernel-validation.test.ts
- [ ] T039 [P] [US2] Add invalid-packet tests for blank strings and malformed numeric values in packages/tests/benefit-kernel-validation.test.ts
- [ ] T040 [P] [US2] Add invalid-packet tests for unsupported formula, limitation, and present-value controlled rules in packages/tests/benefit-kernel-validation.test.ts
- [ ] T041 [P] [US2] Add invalid-packet tests for missing section 436, aggregate-limit, QDRO, QPSA, in-pay, death, contribution, disability, asset-recovery, and cash-balance conditional packets in packages/tests/benefit-kernel-validation.test.ts
- [ ] T042 [P] [US2] Add failed-run no-authoritative-output persistence tests in packages/tests/benefit-kernel-validation.test.ts

### Implementation for User Story 2

- [ ] T043 [US2] Add structured blocking error builders in packages/engine/benefit-kernel/src/errors.ts
- [ ] T044 [US2] Extend benefit-kernel packet validation for missing groups, missing upstream outputs, blank strings, malformed numbers, and unsupported controlled values in packages/engine/benefit-kernel/src/validatePacket.ts
- [ ] T045 [US2] Extend conditional trigger validation for limitation, QDRO, QPSA, in-pay, death, contribution, disability, asset-recovery, and cash-balance packets in packages/engine/benefit-kernel/src/validatePacket.ts
- [ ] T046 [US2] Persist failed validation attempts as failed engine_run records without benefit_kernel_output rows in packages/engine/benefit-kernel/src/runBenefitKernel.ts
- [ ] T047 [US2] Display benefit-kernel validation error summaries in apps/web/src/pages/BenefitKernelPage.ts
- [ ] T048 [US2] Verify User Story 2 with npm test -- packages/tests/benefit-kernel-validation.test.ts

**Checkpoint**: User Stories 1 and 2 work independently with valid and invalid packet paths.

---

## Phase 5: User Story 3 - Review Benefit Trace (Priority: P3)

**Goal**: Provide reviewable trace metadata for every populated benefit-kernel output and warning-bearing completed run.

**Independent Test**: Select completed benefit-kernel runs and verify each populated kernel field has trace rows containing packet, upstream deterministic outputs, module version, rule branch, limitation context, present-value basis, and warnings when applicable.

### Tests for User Story 3

- [X] T049 [P] [US3] Add trace completeness tests for all populated benefit-kernel output fields in packages/tests/benefit-kernel-trace.test.ts
- [X] T050 [P] [US3] Add repeated-run determinism tests that compare kernel values and trace decisions across five runs in packages/tests/benefit-kernel-trace.test.ts
- [X] T051 [P] [US3] Add unsupported integrated formula and QPSA warning trace tests for BK002 and BK003 in packages/tests/benefit-kernel-trace.test.ts

### Implementation for User Story 3

- [X] T052 [US3] Implement trace row construction for benefit-kernel outputs and warnings in packages/engine/benefit-kernel/src/trace.ts
- [X] T053 [US3] Persist module_trace rows for each populated benefit-kernel output and warning path in packages/engine/benefit-kernel/src/runBenefitKernel.ts
- [ ] T054 [US3] Add trace and warning state selectors to apps/web/src/app/benefitKernelSlice.ts
- [ ] T055 [US3] Render benefit-kernel trace details and warning notes in apps/web/src/pages/BenefitKernelPage.ts
- [X] T056 [US3] Verify User Story 3 with npm test -- packages/tests/benefit-kernel-trace.test.ts

**Checkpoint**: All benefit-kernel stories are independently functional and traceable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Complete regression, static-browser verification, docs alignment, and committed build output.

- [ ] T057 [P] Add prior-slice regression guard to the benefit-kernel validation command notes in specs/005-benefit-kernel-slice/quickstart.md
- [ ] T058 [P] Update implementation completion notes in docs/architecture/benefit_kernel_slice_v0.1.0.md
- [X] T059 Run all deterministic tests with npm test and fix issues in packages/tests/
- [X] T060 Run lint/type checks with npm run lint and fix issues in packages/engine/benefit-kernel/src/
- [X] T061 Run the static browser build with npm run build and update committed assets under apps/web/dist/
- [ ] T062 Start the Vite app and validate the quickstart flow in apps/web/src/pages/BenefitKernelPage.ts
- [X] T063 Confirm browser-only/no-network execution by inspecting benefit-kernel imports in packages/engine/benefit-kernel/src/
- [X] T064 Confirm V1/VE, valuation listing, BSRS, and other output-adapter implementations remain out of scope in packages/output-adapters/
- [X] T065 Update task completion checkboxes in specs/005-benefit-kernel-slice/tasks.md after implementation verification

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

- US1 Run Reviewed Benefit Kernel: no dependency on US2 or US3 after foundation.
- US2 Reject Invalid Benefit Inputs: no dependency on US3; shares validation and run persistence contracts with US1.
- US3 Review Benefit Trace: depends on completed kernel run semantics from US1, but trace tests remain independently executable.

### Within Each User Story

- Write tests first and confirm they fail before implementation.
- Implement deterministic validation before benefit calculation.
- Implement deterministic calculations and warning generation before persistence integration.
- Implement persistence before browser UI display.
- Verify each story independently before moving to cross-cutting polish.

## Parallel Opportunities

- T003, T004, T008, and T009 can run in parallel after package directories exist.
- T014, T017, and T018 can run in parallel with repository helper work because they touch different files.
- T020 through T024 can run in parallel as independent US1 test files or test sections.
- T037 through T042 can run in parallel as independent invalid-packet test cases.
- T049 through T051 can run in parallel as independent trace/determinism test cases.
- US2 and US3 can begin after Phase 2 when separate contributors avoid overlapping edits to runBenefitKernel.ts.

## Parallel Example: User Story 1

```bash
Task: "T020 [P] [US1] Add contract-shape tests for RunBenefitKernelRequest and RunBenefitKernelResult in packages/tests/benefit-kernel-contract.test.ts"
Task: "T021 [P] [US1] Add deterministic output tests for BK001 term_mb_nrd_nsf, xrd_mb_term, and pvmb_term in packages/tests/benefit-kernel-output.test.ts"
Task: "T023 [P] [US1] Add sql.js persistence tests for engine_run and benefit_kernel_output rows in packages/tests/benefit-kernel-persistence.test.ts"
```

## Parallel Example: User Story 2

```bash
Task: "T037 [P] [US2] Add invalid-packet tests for missing required benefit-kernel groups in packages/tests/benefit-kernel-validation.test.ts"
Task: "T038 [P] [US2] Add invalid-packet tests for missing upstream date, service, compensation, and form output groups in packages/tests/benefit-kernel-validation.test.ts"
Task: "T041 [P] [US2] Add invalid-packet tests for missing section 436, aggregate-limit, QDRO, QPSA, in-pay, death, contribution, disability, asset-recovery, and cash-balance conditional packets in packages/tests/benefit-kernel-validation.test.ts"
```

## Parallel Example: User Story 3

```bash
Task: "T049 [P] [US3] Add trace completeness tests for all populated benefit-kernel output fields in packages/tests/benefit-kernel-trace.test.ts"
Task: "T050 [P] [US3] Add repeated-run determinism tests that compare kernel values and trace decisions across five runs in packages/tests/benefit-kernel-trace.test.ts"
Task: "T051 [P] [US3] Add unsupported integrated formula and QPSA warning trace tests for BK002 and BK003 in packages/tests/benefit-kernel-trace.test.ts"
```

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1 Setup.
2. Complete Phase 2 Foundational.
3. Complete Phase 3 US1.
4. Stop and validate benefit-kernel fixture outputs, warning behavior, persistence, and no output-adapter writes.
5. Commit the MVP only after tests, lint, build, and static artifact checks pass.

### Incremental Delivery

1. Add US2 validation blocking after the US1 happy path is stable.
2. Add US3 trace review after successful and failed run semantics are stable.
3. Finish Phase 6 with full regression, quickstart validation, and committed dist output.

### Out of Scope Guardrails

- Do not implement V1/VE output, valuation listings, BSRS configuration, or other output adapters in this slice.
- Do not add server calls, hosted APIs, telemetry dependencies, or raw-document reads.
- Do not let output adapters recalculate benefits or change resolved kernel outputs.
