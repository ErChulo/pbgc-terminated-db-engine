# Tasks: Cross-Slice Reconciliation Hardening

**Input**: Design documents from `/specs/017-cross-slice-reconciliation-hardening/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/cross-slice-reconciliation-validation.md, quickstart.md

**Tests**: Required because this hardening increment changes deterministic validation, DD mapping behavior, structured warnings/errors, traceability evidence, and output-shape regression protection.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing. US1 is the MVP.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm existing source boundaries and create the internal validation surface without adding new adapters or persistence.

- [X] T001 Inspect current BSRS, V1/VE, and valuation-listings fixture builders in `packages/tests/bsrs-configuration-output-fixtures.ts`, `packages/tests/v1-ve-output-fixtures.ts`, and `packages/tests/valuation-listings-output-fixtures.ts`
- [X] T002 Inspect current DD mapping helpers in `packages/engine/v1-ve-output/src/ddMapping.ts`, `packages/engine/valuation-listings-output/src/ddMapping.ts`, and `packages/engine/bsrs-configuration-output/src/ddMapping.ts`
- [X] T003 [P] Inspect existing hardening helper patterns in `packages/tests/hardening-helpers.ts`
- [X] T004 [P] Inspect approved sample artifact paths in `artifacts/reference/approved-samples/bsrs-config/`, `artifacts/reference/approved-samples/v1-workbooks/`, and `artifacts/mappings/DD.csv`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared deterministic reconciliation types and helper skeleton that all stories depend on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Define internal reconciliation comparison and finding types in `packages/shared/src/crossSliceReconciliation.ts`
- [X] T006 Export the reconciliation types from `packages/shared/src/index.ts`
- [X] T007 Implement deterministic comparison and finding sorting helpers in `packages/shared/src/crossSliceReconciliation.ts`
- [X] T008 Implement reviewed-evidence normalization helpers for identifiers, form labels, explicit nulls, unsupported branches, absent optional evidence, and formatting-only values in `packages/shared/src/crossSliceReconciliation.ts`
- [X] T009 Define the selected shared-fact inventory and comparison matrix for reconciled identifiers, forms, DD-backed fields, and approved fallbacks in `packages/shared/src/crossSliceReconciliation.ts`
- [X] T010 Add shared test fixture builders for accepted comparisons and drift scenarios in `packages/tests/hardening-cross-slice-reconciliation.test.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Detect shared fact drift across outputs (Priority: P1) MVP

**Goal**: Compare shared case facts across BSRS configuration, V1/VE, and valuation-listing evidence and emit deterministic structured findings for true drift.

**Independent Test**: Run reconciliation validation against current committed output fixtures and sample-derived mismatches, then confirm matching shared facts pass and mismatches include affected slices, fields, source artifacts, and reviewed fact context.

### Tests for User Story 1

- [X] T011 [US1] Add accepted shared identifier and form reconciliation tests in `packages/tests/hardening-cross-slice-reconciliation.test.ts`
- [X] T012 [US1] Add participant identifier drift finding tests in `packages/tests/hardening-cross-slice-reconciliation.test.ts`
- [X] T013 [US1] Add form reference drift finding tests in `packages/tests/hardening-cross-slice-reconciliation.test.ts`
- [X] T014 [US1] Add finding trace-shape tests for compared slices, fields, source paths, reviewed fact context, rule version, producing module, severity, and code in `packages/tests/hardening-cross-slice-reconciliation.test.ts`

### Implementation for User Story 1

- [X] T015 [US1] Implement shared fact comparison records for BSRS, V1/VE, and valuation-listing evidence in `packages/shared/src/crossSliceReconciliation.ts`
- [X] T016 [US1] Implement drift finding creation with deterministic warning/error payloads in `packages/shared/src/crossSliceReconciliation.ts`
- [X] T017 [US1] Implement accepted non-drift statuses for explicit nulls, unsupported branches, absent optional evidence, and formatting-only differences in `packages/shared/src/crossSliceReconciliation.ts`
- [X] T018 [US1] Wire current fixture evidence into reconciliation tests without changing output adapters in `packages/tests/hardening-cross-slice-reconciliation.test.ts`
- [X] T019 [US1] Run `npm test -- packages/tests/hardening-cross-slice-reconciliation.test.ts` and fix only US1 failures in `packages/shared/src/crossSliceReconciliation.ts`

**Checkpoint**: US1 should be independently testable as the MVP.

---

## Phase 4: User Story 2 - Preserve approved fallback behavior and mapping boundaries (Priority: P2)

**Goal**: Enforce DD-first comparison semantics while preserving traceable approved contract-name fallback where no DD.csv entry exists.

**Independent Test**: Reconcile DD-backed fields and approved no-DD fallback fields across committed outputs, then confirm DD-backed facts map through DD.csv and fallback names are accepted only with traceable fallback basis.

### Tests for User Story 2

- [ ] T020 [US2] Add DD-first V1/VE semantic comparison tests using `artifacts/mappings/DD.csv` in `packages/tests/hardening-cross-slice-reconciliation.test.ts`
- [ ] T021 [US2] Add missing required DD mapping failure tests in `packages/tests/hardening-cross-slice-reconciliation.test.ts`
- [ ] T022 [US2] Add approved no-DD contract-name fallback tests in `packages/tests/hardening-cross-slice-reconciliation.test.ts`
- [ ] T023 [US2] Add tests proving fallback basis is present in every fallback comparison and finding in `packages/tests/hardening-cross-slice-reconciliation.test.ts`

### Implementation for User Story 2

- [ ] T024 [US2] Implement DD-first semantic resolution for reconciled V1/VE fields in `packages/shared/src/crossSliceReconciliation.ts`
- [ ] T025 [US2] Implement required DD mapping validation for DD-backed reconciled fields in `packages/shared/src/crossSliceReconciliation.ts`
- [ ] T026 [US2] Implement approved fallback mapping records for no-DD fields in `packages/shared/src/crossSliceReconciliation.ts`
- [ ] T027 [US2] Preserve existing DD helper behavior without renaming fields in `packages/engine/v1-ve-output/src/ddMapping.ts`, `packages/engine/valuation-listings-output/src/ddMapping.ts`, and `packages/engine/bsrs-configuration-output/src/ddMapping.ts`
- [ ] T028 [US2] Run `npm test -- packages/tests/hardening-cross-slice-reconciliation.test.ts` and fix only US2 failures in `packages/shared/src/crossSliceReconciliation.ts`

**Checkpoint**: US1 and US2 should both work independently.

---

## Phase 5: User Story 3 - Preserve deterministic behavior and existing slice boundaries (Priority: P3)

**Goal**: Prove repeated-run payload stability and preserve existing BSRS, V1/VE, valuation-listing, browser-only, persistence, trace, and output-shape behavior.

**Independent Test**: Run identical reconciliation inputs repeatedly and compare accepted comparisons, findings, warnings, errors, and existing output regression behavior.

### Tests for User Story 3

- [ ] T029 [US3] Add repeated-run comparison and finding stability tests in `packages/tests/hardening-cross-slice-reconciliation.test.ts`
- [ ] T030 [P] [US3] Add output-shape stability coverage for reconciliation payload keys in `packages/tests/hardening-output-shape.test.ts`
- [ ] T031 [P] [US3] Add structured warning/error payload stability coverage for reconciliation findings in `packages/tests/hardening-warning-error-stability.test.ts`
- [ ] T032 [US3] Add adapter-exclusion regression coverage proving reconciliation writes no unrelated output-adapter rows in `packages/tests/hardening-cross-slice-reconciliation.test.ts`

### Implementation for User Story 3

- [ ] T033 [US3] Ensure reconciliation output ordering is byte-stable across repeated runs in `packages/shared/src/crossSliceReconciliation.ts`
- [ ] T034 [US3] Ensure reconciliation helper has no sql.js writes, server calls, raw source reads, or output-adapter side effects in `packages/shared/src/crossSliceReconciliation.ts`
- [ ] T035 [P] [US3] Run focused existing BSRS regression tests listed in quickstart in `packages/tests/bsrs-configuration-output-contract.test.ts`, `packages/tests/bsrs-configuration-output-output.test.ts`, `packages/tests/bsrs-configuration-output-persistence.test.ts`, and `packages/tests/bsrs-configuration-output-trace.test.ts`
- [ ] T036 [P] [US3] Run focused existing V1/VE regression tests listed in quickstart in `packages/tests/v1-ve-output-contract.test.ts`, `packages/tests/v1-ve-output-output.test.ts`, `packages/tests/v1-ve-output-persistence.test.ts`, and `packages/tests/v1-ve-output-trace.test.ts`
- [ ] T037 [P] [US3] Run focused existing valuation-listings regression tests listed in quickstart in `packages/tests/valuation-listings-output-contract.test.ts`, `packages/tests/valuation-listings-output-output.test.ts`, `packages/tests/valuation-listings-output-persistence.test.ts`, and `packages/tests/valuation-listings-output-trace.test.ts`
- [ ] T038 [US3] Run `npm test -- packages/tests/hardening-cross-slice-reconciliation.test.ts packages/tests/hardening-output-shape.test.ts packages/tests/hardening-warning-error-stability.test.ts` and fix only US3 failures in `packages/shared/src/crossSliceReconciliation.ts`, `packages/tests/hardening-output-shape.test.ts`, and `packages/tests/hardening-warning-error-stability.test.ts`

**Checkpoint**: All user stories should be independently functional and existing slice behavior should be preserved.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, verification, and repository hygiene after story completion.

- [ ] T039 [P] Update architecture notes for cross-slice reconciliation hardening in `docs/architecture/cross_slice_reconciliation_hardening_v0.1.0.md`
- [ ] T040 [P] Update mapping notes for reconciled DD-backed and approved fallback fields in `docs/mappings/v1_ve_output_trace_map_v0.1.0.csv`
- [ ] T041 Verify no new migrations, seeds, persistence tables, output adapters, raw-source readers, or network calls were added under `packages/db/`, `packages/engine/`, and `apps/web/src/`
- [ ] T042 Run full regression suite configured in `package.json` with `npm test`
- [ ] T043 Run type checking configured in `package.json` with `npm run lint`
- [ ] T044 Run static browser build configured in `package.json` with `npm run build` and preserve committed `apps/web/dist/` output if it changes
- [ ] T045 Confirm no delivered `.sql`, `.js`, `.ts`, or `.tex` artifacts were added without required email-safe `.txt` delivery copies in `artifacts/`, `docs/`, and `specs/017-cross-slice-reconciliation-hardening/`

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): No dependencies - can start immediately
- Foundational (Phase 2): Depends on Setup completion - blocks all user stories
- User Story 1 (Phase 3): Depends on Foundational completion and is the MVP
- User Story 2 (Phase 4): Depends on Foundational completion; can run after or alongside US1 if shared helper changes are coordinated
- User Story 3 (Phase 5): Depends on Foundational completion and benefits from US1/US2 payloads
- Polish (Phase 6): Depends on selected user stories being complete

### User Story Dependencies

- US1: Can start after Phase 2 and delivers the first independent reconciliation MVP
- US2: Can start after Phase 2 but must preserve US1 comparison and finding behavior
- US3: Can start after Phase 2 but requires final payload shapes from US1/US2 for stability tests

### Within Each User Story

- Tests T011-T014, T020-T023, and T029-T032 should be written first and fail before implementation.
- Implement shared types and sorting before comparison logic.
- Implement DD-first resolution before approved fallback handling.
- Run focused tests before broader regression suites.
- Do not change existing output adapters, migrations, seeds, or persistence tables unless a regression proves a defect in current behavior.

---

## Parallel Opportunities

- T003 and T004 can run in parallel during setup.
- T011-T014 should be sequenced because they edit the same US1 test file in `packages/tests/hardening-cross-slice-reconciliation.test.ts`.
- T020-T023 should be sequenced because they edit the same US2 test file in `packages/tests/hardening-cross-slice-reconciliation.test.ts`.
- T030 and T031 can run in parallel after Phase 2 because they update distinct stability files.
- T035-T037 can run in parallel because they run existing BSRS, V1/VE, and valuation-listing regression files independently.
- T039 and T040 can run in parallel during polish because they update distinct documentation artifacts.

---

## Parallel Example: User Story 1

```bash
# Sequence US1 test work in the shared test file:
Task: "T011 [US1] Add accepted shared identifier and form reconciliation tests in packages/tests/hardening-cross-slice-reconciliation.test.ts"
Task: "T012 [US1] Add participant identifier drift finding tests in packages/tests/hardening-cross-slice-reconciliation.test.ts"
Task: "T013 [US1] Add form reference drift finding tests in packages/tests/hardening-cross-slice-reconciliation.test.ts"
Task: "T014 [US1] Add finding trace-shape tests in packages/tests/hardening-cross-slice-reconciliation.test.ts"
```

## Parallel Example: User Story 2

```bash
# Sequence US2 mapping tests in the shared test file:
Task: "T020 [US2] Add DD-first V1/VE semantic comparison tests using artifacts/mappings/DD.csv in packages/tests/hardening-cross-slice-reconciliation.test.ts"
Task: "T021 [US2] Add missing required DD mapping failure tests in packages/tests/hardening-cross-slice-reconciliation.test.ts"
Task: "T022 [US2] Add approved no-DD contract-name fallback tests in packages/tests/hardening-cross-slice-reconciliation.test.ts"
Task: "T023 [US2] Add fallback basis tests in packages/tests/hardening-cross-slice-reconciliation.test.ts"
```

## Parallel Example: User Story 3

```bash
# Launch US3 preservation checks that touch distinct files together:
Task: "T030 [US3] Add output-shape stability coverage in packages/tests/hardening-output-shape.test.ts"
Task: "T031 [US3] Add warning/error payload stability coverage in packages/tests/hardening-warning-error-stability.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup.
2. Complete Phase 2 foundational types, sorting, normalization, and fixture scaffolding.
3. Complete Phase 3 US1 tests and implementation.
4. Stop and validate with `npm test -- packages/tests/hardening-cross-slice-reconciliation.test.ts`.

### Incremental Delivery

1. Add US1 shared fact drift detection and validate independently.
2. Add US2 DD-first and approved fallback mapping checks without changing US1 payload shapes.
3. Add US3 repeated-run stability and existing slice behavior preservation.
4. Run focused quickstart checks, then full `npm test`, `npm run lint`, and `npm run build`.

### Scope Guardrails

- Do not implement new business domains or output adapters.
- Do not add migrations, seeds, persistence tables, or lower source-layer writes.
- Do not read raw OCR, raw source documents, emails, images, PDFs, hosted services, or unreviewed extraction output.
- Keep new `.ts` hardening tests/helpers as internal regression artifacts, not delivered artifacts requiring `.txt` delivery copies.
