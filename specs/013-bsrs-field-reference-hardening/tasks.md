# Tasks: BSRS Field Reference Hardening

**Input**: Design documents from `/specs/013-bsrs-field-reference-hardening/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Required for this feature because it changes deterministic semantic validation, structured findings, DD.csv invariants, traceability metadata, and BSRS regression protection.

**Organization**: Tasks are grouped by user story so each field-reference hardening increment can be implemented and tested independently.

**Artifact Scope**: New or changed `.ts` field-reference hardening tests/helpers are internal regression artifacts, not delivered artifacts, so the email-safe `.txt` delivery-copy requirement does not apply to them.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish field-reference hardening documentation and source inventories

- [X] T001 Add BSRS field-reference hardening architecture note scaffold in `docs/architecture/bsrs_field_reference_hardening_v0.1.0.md`
- [X] T002 [P] Record approved BSRS sample, DD.csv, and current field-name validation sources in `specs/013-bsrs-field-reference-hardening/quickstart.md`
- [X] T003 [P] Add field vocabulary source inventory notes in `specs/013-bsrs-field-reference-hardening/research.md`
- [X] T004 [P] Add field-reference resolution trace notes in `specs/013-bsrs-field-reference-hardening/data-model.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared extraction and vocabulary primitives required by all field-reference checks

**CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 [P] Define field-reference vocabulary and resolution types in `packages/engine/bsrs-configuration-output/src/bsrsFieldReferenceValidation.ts`
- [X] T006 [P] Add DD.csv field-name parser helper in `packages/engine/bsrs-configuration-output/src/bsrsFieldReferenceValidation.ts`
- [X] T007 [P] Add current committed BSRS/V1/output field vocabulary builder in `packages/engine/bsrs-configuration-output/src/bsrsFieldReferenceValidation.ts`
- [X] T008 [P] Add approved sample fallback vocabulary builder in `packages/engine/bsrs-configuration-output/src/bsrsFieldReferenceValidation.ts`
- [X] T009 [P] Add documented control-token and formatting-marker classifier in `packages/engine/bsrs-configuration-output/src/bsrsFieldReferenceValidation.ts`
- [X] T010 Export field-reference validation helpers from `packages/engine/bsrs-configuration-output/src/index.ts`

**Checkpoint**: Field-reference validation foundation ready - user story work can begin

---

## Phase 3: User Story 1 - Validate Referenced BSRS Fields (Priority: P1) MVP

**Goal**: Validate approved BSRS field references against DD.csv, current committed output fields, and approved no-DD fallback semantics.

**Independent Test**: Approved sample field references pass validation, DD-backed references resolve through DD.csv, and approved no-DD fallback references remain valid without changing existing BSRS output behavior.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T011 [P] [US1] Add approved sample field-reference validation test in `packages/tests/hardening-bsrs-field-references.test.ts`
- [X] T012 [P] [US1] Add DD-backed field resolution regression test in `packages/tests/hardening-bsrs-field-references.test.ts`
- [X] T013 [P] [US1] Add approved no-DD fallback field regression test in `packages/tests/hardening-bsrs-field-references.test.ts`
- [X] T014 [P] [US1] Add current committed field vocabulary regression test in `packages/tests/hardening-bsrs-field-references.test.ts`

### Implementation for User Story 1

- [X] T015 [P] [US1] Implement field-like token extraction outside quoted narrative text in `packages/engine/bsrs-configuration-output/src/bsrsFieldReferenceValidation.ts`
- [X] T016 [P] [US1] Implement DD-first field resolution in `packages/engine/bsrs-configuration-output/src/bsrsFieldReferenceValidation.ts`
- [X] T017 [P] [US1] Implement approved no-DD fallback resolution in `packages/engine/bsrs-configuration-output/src/bsrsFieldReferenceValidation.ts`
- [X] T018 [US1] Wire field-reference resolution into semantic validation orchestration in `packages/engine/bsrs-configuration-output/src/bsrsSemanticValidation.ts`

**Checkpoint**: Referenced-field validation should be independently testable

---

## Phase 4: User Story 2 - Detect Suspicious or Orphan References (Priority: P2)

**Goal**: Emit deterministic structured findings for suspicious or orphan field-like tokens while avoiding false positives for literals, controls, operators, and functions.

**Independent Test**: A synthetic unknown field-like token produces a deterministic structured error, while quoted narrative text and documented control tokens do not produce orphan-field findings.

### Tests for User Story 2

- [X] T019 [P] [US2] Add unknown field-like token structured-error regression test in `packages/tests/hardening-bsrs-field-references.test.ts`
- [X] T020 [P] [US2] Add quoted narrative non-field regression test in `packages/tests/hardening-bsrs-field-references.test.ts`
- [X] T021 [P] [US2] Add documented control-token and formatting-marker regression test in `packages/tests/hardening-bsrs-field-references.test.ts`
- [X] T022 [P] [US2] Add repeated-run field-reference finding stability test in `packages/tests/hardening-bsrs-field-references.test.ts`

### Implementation for User Story 2

- [X] T023 [P] [US2] Implement suspicious/orphan field finding construction in `packages/engine/bsrs-configuration-output/src/bsrsFieldReferenceValidation.ts`
- [X] T024 [P] [US2] Implement non-field token filtering for functions, operators, literals, controls, and formatting markers in `packages/engine/bsrs-configuration-output/src/bsrsFieldReferenceValidation.ts`
- [X] T025 [US2] Add deterministic field-reference finding metadata and sorting integration in `packages/engine/bsrs-configuration-output/src/semanticValidationTrace.ts`
- [X] T026 [US2] Wire suspicious/orphan field findings into `packages/engine/bsrs-configuration-output/src/bsrsSemanticValidation.ts`

**Checkpoint**: Suspicious-field detection should be independently testable

---

## Phase 5: User Story 3 - Preserve Existing BSRS Behavior and Scope (Priority: P3)

**Goal**: Prove field-reference hardening remains validation-only and does not alter existing BSRS packet content, persistence behavior, traces, or adapter scope.

**Independent Test**: Existing BSRS output fixtures and adapter-exclusion regressions pass unchanged after field-reference validation is added.

### Tests for User Story 3

- [X] T027 [P] [US3] Add existing BSRS output behavior preservation regression in `packages/tests/hardening-bsrs-semantic-behavior.test.ts`
- [X] T028 [P] [US3] Add no-new-adapter scope regression for field-reference hardening in `packages/tests/hardening-bsrs-semantic-behavior.test.ts`
- [X] T029 [P] [US3] Add existing BSRS persistence and trace behavior regression reference in `packages/tests/bsrs-configuration-output-persistence.test.ts`
- [X] T030 [P] [US3] Add existing BSRS output-shape regression reference in `packages/tests/bsrs-configuration-output-output.test.ts`

### Implementation for User Story 3

- [X] T031 [US3] Confirm field-reference validation remains test-local or explicitly invoked and does not change successful packet projection in `packages/engine/bsrs-configuration-output/src/resolveBsrsConfigurationOutput.ts`
- [X] T032 [US3] Confirm no new persistence tables, migrations, or output adapter modules are introduced under `packages/db/` and `packages/engine/bsrs-configuration-output/`
- [X] T033 [US3] Confirm committed browser build behavior is unchanged or refresh `apps/web/dist/` only if runtime exports affect the static bundle

**Checkpoint**: Field-reference hardening remains validation-only and scope-safe

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the full field-reference hardening increment and preserve repository contracts

- [X] T034 [P] Update BSRS field-reference hardening quickstart validation notes in `specs/013-bsrs-field-reference-hardening/quickstart.md`
- [X] T035 [P] Update BSRS field-reference hardening architecture notes in `docs/architecture/bsrs_field_reference_hardening_v0.1.0.md`
- [X] T036 [P] Run focused field-reference hardening tests in `packages/tests/hardening-bsrs-field-references.test.ts` and `packages/tests/hardening-bsrs-semantic-behavior.test.ts`
- [X] T037 [P] Run existing BSRS regression suite in `packages/tests/bsrs-configuration-output-*.test.ts`
- [X] T038 [P] Run lint and full test suite validation in `package.json`
- [X] T039 [P] Confirm no committed browser `apps/web/dist/` refresh is needed unless runtime output behavior changed
- [X] T040 [P] Verify checklist completeness in `specs/013-bsrs-field-reference-hardening/checklists/requirements.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): No dependencies, can start immediately
- Foundational (Phase 2): Depends on Setup completion and blocks all user stories
- User Stories (Phase 3+): Depend on Foundational completion
- Polish (Phase 6): Depends on all desired user stories being complete

### User Story Dependencies

- User Story 1 (P1): Can start after Foundational completion and is the MVP scope
- User Story 2 (P2): Can start after Foundational completion; uses the same extraction/vocabulary foundation and remains independently testable
- User Story 3 (P3): Can start after Foundational completion; validates scope preservation after field-reference validation is available

### Within Each User Story

- Tests must be written before implementation for deterministic validation changes
- Field vocabulary builders must exist before field-reference resolution tests can pass
- DD-backed matching must run before approved fallback matching
- Non-field token classification must run before suspicious/orphan findings are emitted
- Field-reference validation must not change successful BSRS output packet content, persistence behavior, trace behavior, or adapter scope

### Parallel Opportunities

- Setup tasks `T002` to `T004` can run in parallel
- Foundational tasks `T005` to `T009` can run in parallel after Setup
- User Story 1 tests `T011` to `T014` can run in parallel
- User Story 2 tests `T019` to `T022` can run in parallel
- User Story 3 tests `T027` to `T030` can run in parallel
- Polish tasks `T034` to `T040` can run in parallel where file paths do not overlap

---

## Parallel Example: User Story 1

```bash
Task: "Add approved sample field-reference validation test in packages/tests/hardening-bsrs-field-references.test.ts"
Task: "Add DD-backed field resolution regression test in packages/tests/hardening-bsrs-field-references.test.ts"
Task: "Add approved no-DD fallback field regression test in packages/tests/hardening-bsrs-field-references.test.ts"
Task: "Add current committed field vocabulary regression test in packages/tests/hardening-bsrs-field-references.test.ts"
```

## Parallel Example: User Story 2

```bash
Task: "Add unknown field-like token structured-error regression test in packages/tests/hardening-bsrs-field-references.test.ts"
Task: "Add quoted narrative non-field regression test in packages/tests/hardening-bsrs-field-references.test.ts"
Task: "Add documented control-token and formatting-marker regression test in packages/tests/hardening-bsrs-field-references.test.ts"
Task: "Add repeated-run field-reference finding stability test in packages/tests/hardening-bsrs-field-references.test.ts"
```

## Parallel Example: User Story 3

```bash
Task: "Add existing BSRS output behavior preservation regression in packages/tests/hardening-bsrs-semantic-behavior.test.ts"
Task: "Add no-new-adapter scope regression for field-reference hardening in packages/tests/hardening-bsrs-semantic-behavior.test.ts"
Task: "Add existing BSRS persistence and trace behavior regression reference in packages/tests/bsrs-configuration-output-persistence.test.ts"
Task: "Add existing BSRS output-shape regression reference in packages/tests/bsrs-configuration-output-output.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup
2. Complete Phase 2 foundational extraction and vocabulary helpers
3. Complete Phase 3 User Story 1
4. Stop and validate approved sample, DD-backed, current-field, and no-DD fallback field semantics independently

### Incremental Delivery

1. Add field-reference validation foundation
2. Add User Story 1 referenced-field validation
3. Add User Story 2 suspicious/orphan field detection
4. Add User Story 3 behavior and scope preservation checks
5. Validate existing BSRS behavior remains unchanged

### Scope Guardrails

- Do not add new output adapters
- Do not add new business domains
- Do not add migrations, new persistence tables, or server dependencies
- Do not change successful `bsrs_configuration_output` packet content, persistence behavior, trace behavior, or adapter writes unless a regression proves a defect and the change is explicitly scoped
