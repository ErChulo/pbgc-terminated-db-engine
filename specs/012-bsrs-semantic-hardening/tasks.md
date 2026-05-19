# Tasks: BSRS Semantic Hardening

**Input**: Design documents from `/specs/012-bsrs-semantic-hardening/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Required for this feature because it changes semantic validation, structured warnings/errors, traceability metadata, and BSRS regression protection.

**Organization**: Tasks are grouped by user story so each semantic-hardening increment can be implemented and tested independently.

**Artifact Scope**: New or changed `.ts` semantic-hardening tests/helpers are internal regression artifacts, not delivered artifacts, so the email-safe `.txt` delivery-copy requirement does not apply to them.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish BSRS semantic-hardening scaffolding and documentation references

- [X] T001 Add BSRS semantic hardening architecture note scaffold in `docs/architecture/bsrs-semantic-hardening_v0.1.0.md`
- [X] T002 [P] Record approved BSRS sample inventory and Statement Authoring source paths in `specs/012-bsrs-semantic-hardening/quickstart.md`
- [X] T003 [P] Add semantic validation source inventory notes in `specs/012-bsrs-semantic-hardening/research.md`
- [X] T004 [P] Add semantic validation entity trace notes in `specs/012-bsrs-semantic-hardening/data-model.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared parser and validation primitives required by all semantic checks

**CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 [P] Define semantic validation finding types and stable code constants in `packages/engine/bsrs-configuration-output/src/semanticValidationTypes.ts`
- [X] T006 [P] Add approved BSRS sample file loader in `packages/engine/bsrs-configuration-output/src/bsrsSampleLoader.ts`
- [X] T007 [P] Add Statement Authoring function-list loader in `packages/engine/bsrs-configuration-output/src/statementAuthoringFunctions.ts`
- [X] T008 [P] Add tab-delimited BSRS sample row parser in `packages/engine/bsrs-configuration-output/src/bsrsSampleParser.ts`
- [X] T009 [P] Add deterministic finding sorter and serializer in `packages/engine/bsrs-configuration-output/src/semanticValidationTrace.ts`
- [X] T010 Export semantic validation helpers from `packages/engine/bsrs-configuration-output/src/index.ts`

**Checkpoint**: Semantic validation foundation ready - user story work can begin

---

## Phase 3: User Story 1 - Validate Statement Authoring Semantics (Priority: P1) MVP

**Goal**: Validate approved BSRS sample function references and PrintCriteria syntax against the approved Statement Authoring function list.

**Independent Test**: Approved samples pass function and PrintCriteria validation, while a sample expression with an unsupported function produces a deterministic structured error.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T011 [P] [US1] Add Statement Authoring function reference contract test in `packages/tests/hardening-bsrs-semantic-functions.test.ts`
- [X] T012 [P] [US1] Add PrintCriteria syntax and balanced-quote regression test in `packages/tests/hardening-bsrs-printcriteria.test.ts`
- [X] T013 [P] [US1] Add unsupported-function structured-error regression test in `packages/tests/hardening-bsrs-printcriteria.test.ts`
- [X] T014 [P] [US1] Add repeated-run finding stability test for function and PrintCriteria validation in `packages/tests/hardening-bsrs-semantic-functions.test.ts`

### Implementation for User Story 1

- [X] T015 [P] [US1] Implement function-reference extraction in `packages/engine/bsrs-configuration-output/src/statementAuthoringFunctions.ts`
- [X] T016 [P] [US1] Implement PrintCriteria lexical validation in `packages/engine/bsrs-configuration-output/src/printCriteriaValidation.ts`
- [X] T017 [US1] Implement Statement Authoring semantic validation orchestration in `packages/engine/bsrs-configuration-output/src/bsrsSemanticValidation.ts`
- [X] T018 [US1] Wire structured finding construction and deterministic ordering for US1 in `packages/engine/bsrs-configuration-output/src/semanticValidationTrace.ts`

**Checkpoint**: Function-set and PrintCriteria semantic validation should be independently testable

---

## Phase 4: User Story 2 - Protect Referenced Field Semantics (Priority: P2)

**Goal**: Validate field-like tokens in approved BSRS samples against approved sample fields, existing BSRS/V1 semantics, DD-backed names where available, and documented control tokens.

**Independent Test**: Approved sample field references pass validation, approved no-DD fallback names remain valid, and an unknown field-like token produces a deterministic structured error.

### Tests for User Story 2

- [ ] T019 [P] [US2] Add approved sample field-reference validation test in `packages/tests/hardening-bsrs-field-references.test.ts`
- [ ] T020 [P] [US2] Add no-DD approved fallback field-reference regression test in `packages/tests/hardening-bsrs-field-references.test.ts`
- [ ] T021 [P] [US2] Add unknown field-like token structured-error regression test in `packages/tests/hardening-bsrs-field-references.test.ts`
- [ ] T022 [P] [US2] Add DD-backed field vocabulary integration test in `packages/tests/hardening-bsrs-field-references.test.ts`

### Implementation for User Story 2

- [ ] T023 [P] [US2] Implement field-like token extraction in `packages/engine/bsrs-configuration-output/src/bsrsFieldReferenceValidation.ts`
- [ ] T024 [P] [US2] Implement approved sample field vocabulary builder in `packages/engine/bsrs-configuration-output/src/bsrsFieldReferenceValidation.ts`
- [ ] T025 [US2] Wire DD-backed and approved fallback field resolution into `packages/engine/bsrs-configuration-output/src/bsrsSemanticValidation.ts`
- [ ] T026 [US2] Add deterministic field-reference finding metadata in `packages/engine/bsrs-configuration-output/src/semanticValidationTrace.ts`

**Checkpoint**: Referenced-field semantic validation should be independently testable

---

## Phase 5: User Story 3 - Preserve Approved BSRS Block Structure (Priority: P3)

**Goal**: Validate approved statement, recalculation, base-data, and optional-form block patterns without changing existing BSRS output behavior.

**Independent Test**: Approved statement/recalculation samples and optional-form families pass block-pattern validation, and missing required block markers produce deterministic structured errors.

### Tests for User Story 3

- [ ] T027 [P] [US3] Add approved statement block-pattern regression test in `packages/tests/hardening-bsrs-block-patterns.test.ts`
- [ ] T028 [P] [US3] Add approved recalculation block-pattern regression test in `packages/tests/hardening-bsrs-block-patterns.test.ts`
- [ ] T029 [P] [US3] Add optional-form family block-pattern regression test in `packages/tests/hardening-bsrs-optional-form-patterns.test.ts`
- [ ] T030 [P] [US3] Add missing block-marker structured-error regression test in `packages/tests/hardening-bsrs-block-patterns.test.ts`
- [ ] T031 [P] [US3] Add existing BSRS output behavior preservation regression in `packages/tests/hardening-bsrs-semantic-behavior.test.ts`

### Implementation for User Story 3

- [ ] T032 [P] [US3] Implement statement and recalculation block-pattern validators in `packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts`
- [ ] T033 [P] [US3] Implement optional-form block-pattern validators in `packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts`
- [ ] T034 [US3] Wire block-pattern validation into `packages/engine/bsrs-configuration-output/src/bsrsSemanticValidation.ts`
- [ ] T035 [US3] Add block-pattern finding metadata and deterministic ordering in `packages/engine/bsrs-configuration-output/src/semanticValidationTrace.ts`

**Checkpoint**: All semantic-hardening stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the full semantic-hardening increment and preserve repository contracts

- [ ] T036 [P] Update semantic hardening quickstart validation notes in `specs/012-bsrs-semantic-hardening/quickstart.md`
- [ ] T037 [P] Update BSRS semantic hardening architecture notes in `docs/architecture/bsrs-semantic-hardening_v0.1.0.md`
- [ ] T038 [P] Verify no new output adapter, migration, or persistence table was added in `packages/engine/bsrs-configuration-output/` and `packages/db/`
- [ ] T039 [P] Run focused semantic hardening tests in `packages/tests/hardening-bsrs-semantic-*.test.ts`, `packages/tests/hardening-bsrs-printcriteria.test.ts`, `packages/tests/hardening-bsrs-field-references.test.ts`, `packages/tests/hardening-bsrs-block-patterns.test.ts`, and `packages/tests/hardening-bsrs-optional-form-patterns.test.ts`
- [ ] T040 [P] Run full regression suite for existing BSRS behavior in `packages/tests/bsrs-configuration-output-*.test.ts`
- [ ] T041 [P] Run lint and full test suite validation in `package.json`
- [ ] T042 [P] Confirm no committed browser `apps/web/dist/` refresh is needed because runtime output behavior is unchanged
- [ ] T043 [P] Verify checklist completeness in `specs/012-bsrs-semantic-hardening/checklists/requirements.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): No dependencies, can start immediately
- Foundational (Phase 2): Depends on Setup completion and blocks all user stories
- User Stories (Phase 3+): Depend on Foundational completion
- Polish (Phase 6): Depends on all desired user stories being complete

### User Story Dependencies

- User Story 1 (P1): Can start after Foundational completion and is the MVP scope
- User Story 2 (P2): Can start after Foundational completion; integrates with US1 token parsing but remains independently testable
- User Story 3 (P3): Can start after Foundational completion; uses parsed sample rows and semantic finding helpers from the foundation

### Within Each User Story

- Tests must be written before implementation for semantic validation changes
- Function-list and sample parsing helpers must exist before semantic validators
- Structured finding types must exist before warning/error tests
- Field-reference checks must preserve DD-backed names where available and approved fallback names where no DD entry exists
- Block-pattern checks must not change successful BSRS output packet content, persistence behavior, or adapter scope

### Parallel Opportunities

- Setup tasks `T002` to `T004` can run in parallel
- Foundational tasks `T005` to `T009` can run in parallel after Setup
- User Story 1 tests `T011` to `T014` can run in parallel
- User Story 2 tests `T019` to `T022` can run in parallel
- User Story 3 tests `T027` to `T031` can run in parallel
- Polish tasks `T036` to `T043` can run in parallel where file paths do not overlap

---

## Parallel Example: User Story 1

```bash
Task: "Add Statement Authoring function reference contract test in packages/tests/hardening-bsrs-semantic-functions.test.ts"
Task: "Add PrintCriteria syntax and balanced-quote regression test in packages/tests/hardening-bsrs-printcriteria.test.ts"
Task: "Add unsupported-function structured-error regression test in packages/tests/hardening-bsrs-printcriteria.test.ts"
Task: "Add repeated-run finding stability test for function and PrintCriteria validation in packages/tests/hardening-bsrs-semantic-functions.test.ts"
```

## Parallel Example: User Story 2

```bash
Task: "Add approved sample field-reference validation test in packages/tests/hardening-bsrs-field-references.test.ts"
Task: "Add no-DD approved fallback field-reference regression test in packages/tests/hardening-bsrs-field-references.test.ts"
Task: "Add unknown field-like token structured-error regression test in packages/tests/hardening-bsrs-field-references.test.ts"
Task: "Add DD-backed field vocabulary integration test in packages/tests/hardening-bsrs-field-references.test.ts"
```

## Parallel Example: User Story 3

```bash
Task: "Add approved statement block-pattern regression test in packages/tests/hardening-bsrs-block-patterns.test.ts"
Task: "Add approved recalculation block-pattern regression test in packages/tests/hardening-bsrs-block-patterns.test.ts"
Task: "Add optional-form family block-pattern regression test in packages/tests/hardening-bsrs-optional-form-patterns.test.ts"
Task: "Add existing BSRS output behavior preservation regression in packages/tests/hardening-bsrs-semantic-behavior.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup
2. Complete Phase 2 foundational parsing/finding helpers
3. Complete Phase 3 User Story 1
4. Stop and validate Statement Authoring function and PrintCriteria semantics independently

### Incremental Delivery

1. Add semantic validation foundation
2. Add User Story 1 function and PrintCriteria validation
3. Add User Story 2 field-reference validation
4. Add User Story 3 block-pattern validation
5. Validate existing BSRS behavior remains unchanged

### Scope Guardrails

- Do not add new output adapters
- Do not add new business domains
- Do not add migrations, new persistence tables, or server dependencies
- Do not change successful `bsrs_configuration_output` packet content or adapter writes unless a regression proves a defect and the change is explicitly scoped
