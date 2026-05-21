# Tasks: BSRS Recalculation Pattern Hardening

**Input**: Design documents from `/specs/015-bsrs-recalculation-pattern-hardening/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/
**Tests**: Required because this feature changes deterministic validation, structured warning/error payloads, traceability evidence, and BSRS output-adapter regression protection.
**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm existing recalculation sample inputs and BSRS validation surfaces before story work begins.

- [ ] T001 Inspect existing block-pattern validation helper in packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts
- [ ] T002 Inspect existing semantic validation wrapper in packages/engine/bsrs-configuration-output/src/bsrsSemanticValidation.ts
- [ ] T003 [P] Inspect approved recalculation sample artifact in artifacts/reference/approved-samples/bsrs-config/recalculations/sample-bsrs-recalculation-config.txt
- [ ] T004 [P] Inspect existing block-pattern test coverage in packages/tests/hardening-bsrs-block-patterns.test.ts
- [ ] T005 [P] Inspect existing BSRS behavior-preservation tests in packages/tests/bsrs-configuration-output-contract.test.ts, packages/tests/bsrs-configuration-output-output.test.ts, packages/tests/bsrs-configuration-output-persistence.test.ts, and packages/tests/bsrs-configuration-output-trace.test.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extend shared block-pattern types and deterministic helper surfaces for recalculation validation.

**CRITICAL**: No user story implementation should begin until this phase is complete.

- [ ] T006 Extend block-family and section-context types for recalculation validation in packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts
- [ ] T007 Extend accepted classification shape for recalculation section context, line cluster, and recalculation row role metadata in packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts
- [ ] T008 Extend deterministic classification and finding sorting to include recalculation evidence without changing statement ordering in packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts
- [ ] T009 Add recalculation validation export surface without changing existing statement exports in packages/engine/bsrs-configuration-output/src/index.ts
- [ ] T010 Wire recalculation-pattern validation into the existing BSRS semantic validation boundary without changing statement, function-set, PrintCriteria, or field-reference behavior in packages/engine/bsrs-configuration-output/src/bsrsSemanticValidation.ts

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Validate approved recalculation block patterns (Priority: P1) MVP

**Goal**: Approved recalculation block samples validate expected section sequencing and line-cluster behavior, and malformed recalculation evidence emits structured findings.

**Independent Test**: Run recalculation-focused block-pattern tests against approved recalculation samples and malformed synthetic recalculation evidence; verify deterministic accepted classifications and findings.

### Tests for User Story 1

- [ ] T011 [P] [US1] Add approved recalculation block-pattern acceptance test in packages/tests/hardening-bsrs-block-patterns.test.ts
- [ ] T012 [P] [US1] Add malformed recalculation missing-section, duplicated-section, and out-of-order-section finding tests in packages/tests/hardening-bsrs-block-patterns.test.ts
- [ ] T013 [P] [US1] Add recalculation finding trace-shape assertion for source path, row index, block family, section context, line cluster, rule version, producing module, severity, and finding code in packages/tests/hardening-bsrs-block-patterns.test.ts

### Implementation for User Story 1

- [ ] T014 [US1] Implement recalculation block-family detection from approved recalculation samples in packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts
- [ ] T015 [US1] Implement expected recalculation section-sequence validation in packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts
- [ ] T016 [US1] Implement recalculation line-cluster recognition and support-cluster attachment checks in packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts
- [ ] T017 [US1] Implement structured recalculation missing, duplicated, out-of-order, suspicious, and orphan section findings in packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts
- [ ] T018 [US1] Export recalculation-pattern validation through the existing BSRS semantic validation module in packages/engine/bsrs-configuration-output/src/bsrsSemanticValidation.ts

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - Preserve recalculation-specific row semantics (Priority: P2)

**Goal**: Approved recalculation rows classify semantic, support, detail, subtotal, narrative, formatting, and spacer roles without treating formatting-only rows as missing semantic evidence.

**Independent Test**: Run row-role tests against approved and sample-derived recalculation rows; verify formatting rows do not create missing-section findings and orphan semantic rows do create structured findings.

### Tests for User Story 2

- [ ] T019 [P] [US2] Add recalculation row-role classification test for semantic marker, support, detail, subtotal, narrative, formatting, and spacer rows in packages/tests/hardening-bsrs-block-patterns.test.ts
- [ ] T020 [P] [US2] Add formatting-only and spacer row false-positive regression test in packages/tests/hardening-bsrs-block-patterns.test.ts
- [ ] T021 [P] [US2] Add orphan recalculation semantic-row structured finding test in packages/tests/hardening-bsrs-block-patterns.test.ts

### Implementation for User Story 2

- [ ] T022 [US2] Implement recalculation-specific semantic-versus-formatting row classification in packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts
- [ ] T023 [US2] Implement formatting-only, spacer, narrative, subtotal, support, and detail role handling without false missing-section findings in packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts
- [ ] T024 [US2] Implement orphan recalculation row finding behavior with deterministic section-context and line-cluster metadata in packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Preserve deterministic behavior and existing slice boundaries (Priority: P3)

**Goal**: Recalculation-pattern validation is stable across repeated runs and does not alter existing BSRS contract, output, persistence, trace, or adapter-exclusion behavior.

**Independent Test**: Run repeated recalculation validation inputs, focused quickstart checks, and existing BSRS behavior-preservation regressions.

### Tests for User Story 3

- [ ] T025 [P] [US3] Add repeated-run recalculation accepted-classification and finding payload stability test in packages/tests/hardening-bsrs-block-patterns.test.ts
- [ ] T026 [P] [US3] Add recalculation adapter-exclusion regression test proving validation does not write unrelated output adapters in packages/tests/hardening-bsrs-semantic-behavior.test.ts
- [ ] T027 [P] [US3] Add existing statement block-pattern regression assertion to prove recalculation changes do not alter statement validation in packages/tests/hardening-bsrs-block-patterns.test.ts

### Implementation for User Story 3

- [ ] T028 [US3] Ensure recalculation classifications and findings use deterministic source-path, row-index, section-context, line-cluster, code, and token ordering in packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts
- [ ] T029 [US3] Ensure recalculation semantic validation wrapper preserves existing statement, function-set, PrintCriteria, and field-reference behavior in packages/engine/bsrs-configuration-output/src/bsrsSemanticValidation.ts

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify behavior preservation, documentation, and repository delivery rules.

- [ ] T030 [P] Add architecture note for BSRS recalculation-pattern hardening scope and validation sources in docs/architecture/bsrs_recalculation_pattern_hardening_v0.1.0.md
- [ ] T031 Verify focused quickstart command passes for recalculation-pattern hardening tests from specs/015-bsrs-recalculation-pattern-hardening/quickstart.md
- [ ] T032 Verify existing BSRS output contract, output, persistence, and trace tests still pass with recalculation-pattern validation in packages/tests/bsrs-configuration-output-contract.test.ts, packages/tests/bsrs-configuration-output-output.test.ts, packages/tests/bsrs-configuration-output-persistence.test.ts, and packages/tests/bsrs-configuration-output-trace.test.ts
- [ ] T033 Run full project regression with npm test
- [ ] T034 Run lint verification with npm run lint
- [ ] T035 Run static build verification with npm run build and keep committed apps/web/dist/ output current if runtime bundles change
- [ ] T036 Confirm no new migrations, seeds, output adapters, server calls, raw source reads, or lower source-layer writes were introduced in packages/db/ and packages/output-adapters/
- [ ] T037 Mark completed tasks in specs/015-bsrs-recalculation-pattern-hardening/tasks.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion and is the MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational completion; can proceed independently after shared helpers exist.
- **User Story 3 (Phase 5)**: Depends on Foundational completion; can proceed independently after shared helpers exist.
- **Polish (Phase 6)**: Depends on the desired user stories being complete.

### User Story Dependencies

- **US1**: No dependency on US2 or US3 after Phase 2.
- **US2**: Uses shared recalculation classification from US1 but remains independently testable with row-role fixtures.
- **US3**: Uses the shared validation surface from US1 and US2 but remains independently testable with repeated-run and behavior-preservation regressions.

### Within Each User Story

- Tests must be written and fail before implementation tasks for that story.
- Recalculation helper changes precede semantic validation exports.
- Structured finding shape and deterministic sorting must be stable before behavior-preservation verification.
- Story checkpoint tests should pass before moving to the next priority when implementing sequentially.

### Parallel Opportunities

- T003, T004, and T005 can run in parallel during setup.
- T011, T012, and T013 can run in parallel for US1 tests.
- T019, T020, and T021 can run in parallel for US2 tests.
- T025, T026, and T027 can run in parallel for US3 tests.
- T030 can run in parallel with final verification tasks T031 through T036 after implementation is complete.

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "T011 [US1] Add approved recalculation block-pattern acceptance test in packages/tests/hardening-bsrs-block-patterns.test.ts"
Task: "T012 [US1] Add malformed recalculation missing-section, duplicated-section, and out-of-order-section finding tests in packages/tests/hardening-bsrs-block-patterns.test.ts"
Task: "T013 [US1] Add recalculation finding trace-shape assertion in packages/tests/hardening-bsrs-block-patterns.test.ts"
```

## Parallel Example: User Story 2

```bash
# Launch all tests for User Story 2 together:
Task: "T019 [US2] Add recalculation row-role classification test in packages/tests/hardening-bsrs-block-patterns.test.ts"
Task: "T020 [US2] Add formatting-only and spacer row false-positive regression test in packages/tests/hardening-bsrs-block-patterns.test.ts"
Task: "T021 [US2] Add orphan recalculation semantic-row structured finding test in packages/tests/hardening-bsrs-block-patterns.test.ts"
```

## Parallel Example: User Story 3

```bash
# Launch all tests for User Story 3 together:
Task: "T025 [US3] Add repeated-run recalculation accepted-classification and finding payload stability test in packages/tests/hardening-bsrs-block-patterns.test.ts"
Task: "T026 [US3] Add recalculation adapter-exclusion regression test in packages/tests/hardening-bsrs-semantic-behavior.test.ts"
Task: "T027 [US3] Add existing statement block-pattern regression assertion in packages/tests/hardening-bsrs-block-patterns.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup tasks.
2. Complete Phase 2 shared recalculation helper foundation.
3. Complete Phase 3 recalculation block-pattern validation.
4. Stop and validate US1 independently with `npm test -- packages/tests/hardening-bsrs-block-patterns.test.ts`.

### Incremental Delivery

1. Add US1 recalculation block-pattern validation and verify deterministic findings.
2. Add US2 recalculation row-role validation and verify no false missing-section findings.
3. Add US3 repeated-run and behavior-preservation coverage.
4. Run focused quickstart checks, existing BSRS output regressions, full tests, lint, and build.

### Scope Guardrails

- Do not add new business domains.
- Do not add new output adapters.
- Do not add new database migrations, seeds, or persistence tables.
- Do not read raw OCR, raw source documents, emails, images, PDFs, or unreviewed extraction output.
- Treat new `.ts` hardening tests/helpers as internal regression artifacts; the constitution's email-safe `.txt` delivery-copy requirement does not apply to them.
