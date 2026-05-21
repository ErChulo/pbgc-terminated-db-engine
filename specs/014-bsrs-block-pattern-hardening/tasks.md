# Tasks: BSRS Block Pattern Hardening

**Input**: Design documents from `/specs/014-bsrs-block-pattern-hardening/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/
**Tests**: Required because this feature changes deterministic validation, structured warning/error payloads, traceability evidence, and BSRS output-adapter regression protection.
**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm existing BSRS hardening surfaces and sample artifacts before story work begins.

- [ ] T001 Inspect existing BSRS semantic validation exports in packages/engine/bsrs-configuration-output/src/index.ts
- [ ] T002 Inspect existing semantic finding shape in packages/engine/bsrs-configuration-output/src/semanticValidationTypes.ts
- [ ] T003 [P] Inspect approved statement sample artifact in artifacts/reference/approved-samples/bsrs-config/statements/sample-bsrs-statement-config.txt
- [ ] T004 [P] Inspect approved recalculation sample artifact in artifacts/reference/approved-samples/bsrs-config/recalculations/sample-bsrs-recalculation-config.txt
- [ ] T005 [P] Inspect approved optional-form sample artifacts under artifacts/reference/approved-samples/bsrs-config/optional-forms/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared block-pattern validation contracts and deterministic helper surfaces used by all user stories.

**CRITICAL**: No user story implementation should begin until this phase is complete.

- [ ] T006 Add block-pattern validation types for block family, section context, line cluster, accepted classification, and finding metadata in packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts
- [ ] T007 Implement deterministic sample row access helpers for block-pattern validation using existing parsed sample rows in packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts
- [ ] T008 Implement deterministic sorting for accepted block classifications and block-pattern findings in packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts
- [ ] T009 Extend semantic validation exports for block-pattern validation without changing existing exports in packages/engine/bsrs-configuration-output/src/index.ts
- [ ] T010 Wire block-pattern validation into the existing semantic validation boundary without changing existing US1 or field-reference behavior in packages/engine/bsrs-configuration-output/src/bsrsSemanticValidation.ts

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Validate approved statement block patterns (Priority: P1) MVP

**Goal**: Approved statement block samples validate required section sequencing and line-cluster behavior, and malformed statement evidence emits structured findings.

**Independent Test**: Run statement-focused block-pattern tests against approved statement samples and malformed synthetic statement evidence; verify deterministic accepted classifications and findings.

### Tests for User Story 1

- [ ] T011 [P] [US1] Add approved statement block-pattern acceptance test in packages/tests/hardening-bsrs-block-patterns.test.ts
- [ ] T012 [P] [US1] Add malformed statement missing-section and out-of-order-section finding tests in packages/tests/hardening-bsrs-block-patterns.test.ts
- [ ] T013 [P] [US1] Add repeated-run deterministic statement finding payload test in packages/tests/hardening-bsrs-block-patterns.test.ts

### Implementation for User Story 1

- [ ] T014 [US1] Implement statement block-family detection from approved statement samples in packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts
- [ ] T015 [US1] Implement statement section-sequence validation in packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts
- [ ] T016 [US1] Implement statement line-cluster classification that distinguishes semantic evidence from formatting, spacer, narrative, subtotal, and detail rows in packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts
- [ ] T017 [US1] Implement structured statement block-pattern findings with source path, row index, block family, section context, line cluster, rule version, producing module, severity, and finding code in packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts
- [ ] T018 [US1] Export statement block-pattern validation through the existing BSRS semantic validation module in packages/engine/bsrs-configuration-output/src/bsrsSemanticValidation.ts

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - Validate approved recalculation block patterns (Priority: P2)

**Goal**: Approved recalculation block samples validate required recalculation section sequencing and support clusters without changing BSRS output generation.

**Independent Test**: Run recalculation-focused tests against approved recalculation samples and malformed synthetic recalculation evidence; verify deterministic findings and unchanged adapter behavior.

### Tests for User Story 2

- [ ] T019 [P] [US2] Add approved recalculation block-pattern acceptance test in packages/tests/hardening-bsrs-block-patterns.test.ts
- [ ] T020 [P] [US2] Add malformed recalculation missing-cluster and unexpected-transition finding tests in packages/tests/hardening-bsrs-block-patterns.test.ts
- [ ] T021 [P] [US2] Add adapter-exclusion regression test proving recalculation validation does not write unrelated output adapters in packages/tests/hardening-bsrs-semantic-behavior.test.ts

### Implementation for User Story 2

- [ ] T022 [US2] Implement recalculation block-family detection from approved recalculation samples in packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts
- [ ] T023 [US2] Implement recalculation section-sequence validation and support-cluster attachment checks in packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts
- [ ] T024 [US2] Implement structured recalculation block-pattern findings with stable codes and trace metadata in packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts
- [ ] T025 [US2] Integrate recalculation validation with the exported block-pattern validation helper in packages/engine/bsrs-configuration-output/src/bsrsSemanticValidation.ts

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Validate approved optional-form block patterns (Priority: P3)

**Goal**: Approved optional-form samples validate form-family labels, section context, line clusters, and approved fallback behavior without adding new business domains.

**Independent Test**: Run optional-form tests against approved single-life, single-and-joint, QPSA, and QDRO samples plus malformed synthetic optional-form evidence.

### Tests for User Story 3

- [ ] T026 [P] [US3] Add approved optional-form family acceptance tests for single-life, single-and-joint, QPSA, and QDRO samples in packages/tests/hardening-bsrs-optional-form-patterns.test.ts
- [ ] T027 [P] [US3] Add suspicious optional-form label and orphan line-cluster finding tests in packages/tests/hardening-bsrs-optional-form-patterns.test.ts
- [ ] T028 [P] [US3] Add approved optional-form fallback behavior regression test in packages/tests/hardening-bsrs-optional-form-patterns.test.ts

### Implementation for User Story 3

- [ ] T029 [US3] Implement optional-form block-family detection from approved optional-form samples in packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts
- [ ] T030 [US3] Implement optional-form section-context and line-cluster validation in packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts
- [ ] T031 [US3] Implement approved optional-form fallback classification without adding new business-domain concepts in packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts
- [ ] T032 [US3] Integrate optional-form validation with the exported block-pattern validation helper in packages/engine/bsrs-configuration-output/src/bsrsSemanticValidation.ts

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify behavior preservation, documentation, and repository delivery rules.

- [ ] T033 [P] Add architecture note for BSRS block-pattern hardening scope and validation sources in docs/architecture/bsrs_block_pattern_hardening_v0.1.0.md
- [ ] T034 Verify existing BSRS output contract, output, persistence, and trace tests still pass with block-pattern validation in packages/tests/bsrs-configuration-output-contract.test.ts
- [ ] T035 Verify focused quickstart command passes for block-pattern hardening tests from specs/014-bsrs-block-pattern-hardening/quickstart.md
- [ ] T036 Run full project regression with npm test
- [ ] T037 Run lint verification with npm run lint
- [ ] T038 Run static build verification with npm run build and keep committed apps/web/dist/ output current if runtime bundles change
- [ ] T039 Confirm no new migrations, seeds, output adapters, server calls, raw source reads, or lower source-layer writes were introduced in packages/db/ and packages/output-adapters/
- [ ] T040 Mark completed tasks in specs/014-bsrs-block-pattern-hardening/tasks.md

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
- **US2**: No dependency on US3 after Phase 2; may reuse shared classifications from US1 if already complete.
- **US3**: No dependency on US2 after Phase 2; may reuse shared classifications from US1 if already complete.

### Within Each User Story

- Tests must be written and fail before implementation tasks for that story.
- Block-pattern helper changes precede semantic validation exports.
- Structured finding shape and deterministic sorting must be stable before behavior-preservation verification.
- Story checkpoint tests should pass before moving to the next priority when implementing sequentially.

### Parallel Opportunities

- T003, T004, and T005 can run in parallel during setup.
- T011, T012, and T013 can run in parallel for US1 tests.
- T019, T020, and T021 can run in parallel for US2 tests.
- T026, T027, and T028 can run in parallel for US3 tests.
- T033 can run in parallel with final verification tasks T034 through T039 after implementation is complete.

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "T011 [US1] Add approved statement block-pattern acceptance test in packages/tests/hardening-bsrs-block-patterns.test.ts"
Task: "T012 [US1] Add malformed statement missing-section and out-of-order-section finding tests in packages/tests/hardening-bsrs-block-patterns.test.ts"
Task: "T013 [US1] Add repeated-run deterministic statement finding payload test in packages/tests/hardening-bsrs-block-patterns.test.ts"
```

## Parallel Example: User Story 2

```bash
# Launch all tests for User Story 2 together:
Task: "T019 [US2] Add approved recalculation block-pattern acceptance test in packages/tests/hardening-bsrs-block-patterns.test.ts"
Task: "T020 [US2] Add malformed recalculation missing-cluster and unexpected-transition finding tests in packages/tests/hardening-bsrs-block-patterns.test.ts"
Task: "T021 [US2] Add adapter-exclusion regression test in packages/tests/hardening-bsrs-semantic-behavior.test.ts"
```

## Parallel Example: User Story 3

```bash
# Launch all tests for User Story 3 together:
Task: "T026 [US3] Add approved optional-form family acceptance tests in packages/tests/hardening-bsrs-optional-form-patterns.test.ts"
Task: "T027 [US3] Add suspicious optional-form label and orphan line-cluster finding tests in packages/tests/hardening-bsrs-optional-form-patterns.test.ts"
Task: "T028 [US3] Add approved optional-form fallback behavior regression test in packages/tests/hardening-bsrs-optional-form-patterns.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup tasks.
2. Complete Phase 2 shared block-pattern helper foundation.
3. Complete Phase 3 statement block-pattern validation.
4. Stop and validate US1 independently with `npm test -- packages/tests/hardening-bsrs-block-patterns.test.ts`.

### Incremental Delivery

1. Add US1 statement validation and verify deterministic findings.
2. Add US2 recalculation validation and verify adapter-exclusion behavior.
3. Add US3 optional-form validation and verify approved fallback behavior.
4. Run focused quickstart checks, existing BSRS output regressions, full tests, lint, and build.

### Scope Guardrails

- Do not add new business domains.
- Do not add new output adapters.
- Do not add new database migrations, seeds, or persistence tables.
- Do not read raw OCR, raw source documents, emails, images, PDFs, or unreviewed extraction output.
- Treat new `.ts` hardening tests/helpers as internal regression artifacts; the constitution's email-safe `.txt` delivery-copy requirement does not apply to them.
