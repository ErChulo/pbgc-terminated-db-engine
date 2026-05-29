# Tasks: Cross-Slice Value Reconciliation Hardening

**Input**: Design documents from `/specs/018-cross-slice-value-reconciliation-hardening/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/cross-slice-value-reconciliation-validation.md, quickstart.md

**Tests**: Required. This hardening increment changes deterministic validation, traceability metadata, structured warnings/errors, and output-shape regression protection.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and has no dependency on another open task
- **[Story]**: Which user story the task supports
- Exact file paths are included in each task description

## Phase 1: Setup (Shared Context)

**Purpose**: Confirm the existing helper, evidence, mappings, and regression boundaries before changing validation behavior.

- [X] T001 Inspect the existing reconciliation helper and exports in `packages/shared/src/crossSliceReconciliation.ts` and `packages/shared/src/index.ts`
- [X] T002 Inspect DD-first mapping behavior in `packages/engine/v1-ve-output/src/ddMapping.ts`, `packages/engine/valuation-listings-output/src/ddMapping.ts`, `packages/engine/bsrs-configuration-output/src/ddMapping.ts`, and `artifacts/mappings/DD.csv`
- [X] T003 [P] Inspect current output fixtures in `packages/tests/v1-ve-output-fixtures.ts`, `packages/tests/valuation-listings-output-fixtures.ts`, and `packages/tests/bsrs-configuration-output-fixtures.ts`
- [X] T004 [P] Inspect existing cross-slice and stability coverage in `packages/tests/hardening-cross-slice-reconciliation.test.ts`, `packages/tests/hardening-output-shape.test.ts`, and `packages/tests/hardening-warning-error-stability.test.ts`
- [X] T005 [P] Inspect approved sample evidence in `artifacts/reference/approved-samples/bsrs-config/` and `artifacts/reference/approved-samples/v1-workbooks/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add shared value-reconciliation vocabulary and deterministic comparison primitives that all stories depend on.

**CRITICAL**: No user story implementation should begin until this phase is complete.

- [X] T006 Define `ValueReconciliationRule`, `ValueComparisonRecord`, `SeverityClassification`, `BasisMetadata`, and `ValueReconciliationFinding` types in `packages/shared/src/crossSliceReconciliation.ts`
- [X] T007 Export the new value-reconciliation types and helpers from `packages/shared/src/index.ts`
- [X] T008 Implement deterministic numeric, categorical, identifier, form-code, boolean, and nullable normalization helpers in `packages/shared/src/crossSliceReconciliation.ts`
- [X] T009 Define the selected shared-fact value rule inventory and comparison matrix in `packages/shared/src/crossSliceReconciliation.ts`, including at least one participant identifier value, one form value, one nullable-versus-required value, one numeric value, and one categorical value
- [X] T010 Implement DD-backed canonical semantic resolution plus approved fallback metadata for value rules in `packages/shared/src/crossSliceReconciliation.ts`
- [X] T011 Implement comparison-record construction that preserves raw values, normalized values, source paths, reviewed fact context, rule version, and producing module in `packages/shared/src/crossSliceReconciliation.ts`
- [X] T012 Implement deterministic sorting for value comparison records and value reconciliation findings in `packages/shared/src/crossSliceReconciliation.ts`
- [X] T013 Create focused current-output evidence builders for value reconciliation in `packages/tests/hardening-cross-slice-value-reconciliation.test.ts`
- [X] T014 Add shared assertion helpers for value comparison shape, basis metadata, and finding stability in `packages/tests/hardening-cross-slice-value-reconciliation.test.ts`

**Checkpoint**: Shared value-reconciliation primitives are ready for user-story tests and implementation.

---

## Phase 3: User Story 1 - Reconcile Shared Values Across Outputs (Priority: P1) MVP

**Goal**: Compare selected shared participant, identifier, form, nullable-versus-required, categorical, and numeric values across BSRS, V1/VE, and valuation-listing evidence with DD-first or approved fallback basis metadata.

**Independent Test**: `npm test -- packages/tests/hardening-cross-slice-value-reconciliation.test.ts` verifies matching values are accepted and mismatched selected values emit deterministic findings with traceable basis metadata.

### Tests for User Story 1

- [X] T015 [US1] Add a failing test for accepted selected participant identifier and form values across current BSRS, V1/VE, and valuation-listing evidence in `packages/tests/hardening-cross-slice-value-reconciliation.test.ts`
- [X] T016 [US1] Add a failing test for accepted selected nullable-versus-required, numeric, and categorical values after approved normalization in `packages/tests/hardening-cross-slice-value-reconciliation.test.ts`
- [X] T017 [US1] Add a failing test for numeric and categorical mismatch findings with compared slices, fields, raw values, normalized values, severity, and source paths in `packages/tests/hardening-cross-slice-value-reconciliation.test.ts`
- [X] T018 [US1] Add a failing test that DD-backed V1/VE and valuation fields use `artifacts/mappings/DD.csv` canonical semantics before comparison in `packages/tests/hardening-cross-slice-value-reconciliation.test.ts`
- [X] T019 [US1] Add a failing test that approved no-DD fallback comparisons record explicit fallback basis instead of inventing alternate semantic names in `packages/tests/hardening-cross-slice-value-reconciliation.test.ts`

### Implementation for User Story 1

- [X] T020 [US1] Implement selected shared-value extraction from current evidence records in `packages/shared/src/crossSliceReconciliation.ts`
- [X] T021 [US1] Implement pairwise value comparison for selected participant, identifier, form, numeric, and categorical rules in `packages/shared/src/crossSliceReconciliation.ts`
- [X] T022 [US1] Implement mismatch finding creation with DD/fallback basis metadata and reviewed source context in `packages/shared/src/crossSliceReconciliation.ts`
- [X] T023 [US1] Wire the focused value-reconciliation tests to the exported shared helper in `packages/tests/hardening-cross-slice-value-reconciliation.test.ts`
- [X] T024 [US1] Run `npm test -- packages/tests/hardening-cross-slice-value-reconciliation.test.ts` and resolve US1 failures without changing output adapters or existing slice behavior

**Checkpoint**: User Story 1 is independently testable as the MVP.

---

## Phase 4: User Story 2 - Classify Required, Nullable, and Unsupported Differences (Priority: P2)

**Goal**: Classify required mismatches, nullable differences, optional absence, unsupported branches, non-blocking warnings, and formatting-only differences with structured severity and basis metadata.

**Independent Test**: `npm test -- packages/tests/hardening-cross-slice-value-reconciliation.test.ts` verifies each selected difference category receives the expected status, severity, and basis metadata.

### Tests for User Story 2

- [X] T025 [US2] Add a failing test that required selected value differences are classified as blocking mismatches in `packages/tests/hardening-cross-slice-value-reconciliation.test.ts`
- [X] T026 [US2] Add a failing test that approved nullable or optional absences are classified as accepted nullable or non-blocking outcomes in `packages/tests/hardening-cross-slice-value-reconciliation.test.ts`
- [X] T027 [US2] Add a failing test that unsupported selected branches are classified as unsupported rather than factual drift in `packages/tests/hardening-cross-slice-value-reconciliation.test.ts`
- [X] T028 [US2] Add a failing test that numeric and categorical formatting-only variants are accepted without blocking findings in `packages/tests/hardening-cross-slice-value-reconciliation.test.ts`
- [X] T029 [US2] Add a failing test that every classification includes comparison type, required-or-nullable basis, mapping basis, normalization basis, rule version, producing module, code, and severity in `packages/tests/hardening-cross-slice-value-reconciliation.test.ts`

### Implementation for User Story 2

- [X] T030 [US2] Implement required-versus-nullable severity policy handling in `packages/shared/src/crossSliceReconciliation.ts`
- [X] T031 [US2] Implement approved optional, nullable, unsupported, and formatting-only classification branches in `packages/shared/src/crossSliceReconciliation.ts`
- [X] T032 [US2] Implement basis metadata population for all accepted comparisons and warning/error findings in `packages/shared/src/crossSliceReconciliation.ts`
- [X] T033 [US2] Implement deterministic finding codes and severity values for value-level mismatch categories in `packages/shared/src/crossSliceReconciliation.ts`
- [X] T034 [US2] Run `npm test -- packages/tests/hardening-cross-slice-value-reconciliation.test.ts` and resolve US2 failures without broadening the selected rule inventory beyond reviewed shared meanings

**Checkpoint**: User Stories 1 and 2 can be tested independently through the focused value-reconciliation suite.

---

## Phase 5: User Story 3 - Preserve Existing Slice Behavior and Stability (Priority: P3)

**Goal**: Keep repeated-run payloads byte-stable and preserve existing output shapes, persistence, trace, browser-only, and adapter-exclusion behavior.

**Independent Test**: Repeated focused validation produces identical accepted comparisons and findings, while existing BSRS, V1/VE, valuation-listing, output-shape, and warning/error stability tests still pass.

### Tests for User Story 3

- [X] T035 [US3] Add a repeated-run byte-stability test for accepted value comparisons and findings in `packages/tests/hardening-cross-slice-value-reconciliation.test.ts`
- [X] T036 [P] [US3] Add value-reconciliation output-shape preservation coverage to `packages/tests/hardening-output-shape.test.ts`
- [X] T037 [P] [US3] Add structured warning/error payload stability coverage for value-reconciliation findings to `packages/tests/hardening-warning-error-stability.test.ts`
- [X] T038 [US3] Add an adapter-exclusion regression that value reconciliation does not write unrelated output-adapter rows or tables in `packages/tests/hardening-cross-slice-value-reconciliation.test.ts`

### Implementation for User Story 3

- [X] T039 [US3] Harden deterministic ordering and serialization for repeated-run value comparisons and findings in `packages/shared/src/crossSliceReconciliation.ts`
- [X] T040 [US3] Verify no new lower source-layer writes, migrations, seeds, adapter modules, server calls, or raw/unreviewed input reads are introduced by changes under `packages/shared/src/` and `packages/tests/`
- [X] T041 [P] [US3] Run existing BSRS output regressions: `npm test -- packages/tests/bsrs-configuration-output-contract.test.ts packages/tests/bsrs-configuration-output-output.test.ts packages/tests/bsrs-configuration-output-persistence.test.ts packages/tests/bsrs-configuration-output-trace.test.ts`
- [X] T042 [P] [US3] Run existing V1/VE output regressions: `npm test -- packages/tests/v1-ve-output-contract.test.ts packages/tests/v1-ve-output-output.test.ts packages/tests/v1-ve-output-persistence.test.ts packages/tests/v1-ve-output-trace.test.ts`
- [X] T043 [P] [US3] Run existing valuation-listings output regressions: `npm test -- packages/tests/valuation-listings-output-contract.test.ts packages/tests/valuation-listings-output-output.test.ts packages/tests/valuation-listings-output-persistence.test.ts packages/tests/valuation-listings-output-trace.test.ts`
- [X] T044 [US3] Run stability regressions: `npm test -- packages/tests/hardening-cross-slice-value-reconciliation.test.ts packages/tests/hardening-cross-slice-reconciliation.test.ts packages/tests/hardening-output-shape.test.ts packages/tests/hardening-warning-error-stability.test.ts`

**Checkpoint**: All user stories preserve existing slice behavior and deterministic stability.

---

## Phase 6: Polish & Cross-Cutting Verification

**Purpose**: Documentation, repository discipline, and final verification.

- [X] T045 [P] Document the selected shared value inventory and comparison basis in `docs/mappings/cross_slice_value_reconciliation_map_v0.1.0.csv`
- [X] T046 [P] Document value-reconciliation hardening boundaries and reviewed-input sources in `docs/architecture/cross_slice_value_reconciliation_hardening.md`
- [X] T047 Verify changed `.ts` test/helper files remain internal regression artifacts and do not require email-safe `.txt` delivery copies under the constitution
- [X] T048 Verify no delivered `.sql`, `.js`, `.ts`, or `.tex` artifact was added without the required appended `.txt` transport copy
- [X] T049 Run full test suite with `npm test`
- [X] T050 Run lint verification with `npm run lint`
- [X] T051 Run production build verification with `npm run build` and keep committed static artifacts aligned if the build output changes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion and is the MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational completion; may reuse US1 helper behavior but remains independently testable.
- **User Story 3 (Phase 5)**: Depends on Foundational completion; should run after the selected implementation set to verify stability.
- **Polish (Phase 6)**: Depends on the selected user-story scope being complete.

### User Story Dependencies

- **US1**: No dependency on US2 or US3 after Foundational.
- **US2**: Can start after Foundational, but should integrate with the same selected rule inventory and finding vocabulary used by US1.
- **US3**: Can start after Foundational, but final stability verification should run after US1 and US2 implementation tasks selected for delivery.

### Within Each User Story

- Add failing tests before implementation tasks for that story.
- Keep selected rule inventory scoped to reviewed shared meanings from current contracts, approved samples, DD.csv, and committed evidence.
- Preserve DD-first resolution before approved fallback semantics.
- Preserve output adapter behavior and persistence boundaries while adding validation-only evidence.

---

## Parallel Opportunities

- T003, T004, and T005 can run in parallel during Setup.
- T036 and T037 can run in parallel because they touch separate existing hardening test files.
- T041, T042, and T043 can run in parallel because they execute independent output-slice regression groups.
- T045 and T046 can run in parallel because they update separate documentation files.

---

## Parallel Example: User Story 3

```bash
# Run independent output-slice preservation checks together:
Task: "T041 Run existing BSRS output regressions"
Task: "T042 Run existing V1/VE output regressions"
Task: "T043 Run existing valuation-listings output regressions"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate with `npm test -- packages/tests/hardening-cross-slice-value-reconciliation.test.ts`.

### Incremental Delivery

1. Add US1 for selected shared value agreement and mismatch findings.
2. Add US2 for required, nullable, unsupported, and formatting-only classifications.
3. Add US3 for repeated-run stability and preservation of existing slice behavior.
4. Run Phase 6 verification before delivery.
