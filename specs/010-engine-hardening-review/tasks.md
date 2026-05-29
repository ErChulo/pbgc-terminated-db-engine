# Tasks: engine-hardening-review

**Input**: Design documents from `/specs/010-engine-hardening-review/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story so the hardening slice can be verified independently.

**Artifact Scope**: New or changed `.ts` hardening test/helper files are internal regression artifacts, not delivered artifacts, so the email-safe `.txt` delivery-copy requirement does not apply to them.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the review/hardening scaffolding used across all existing slices

- [X] T001 [P] Capture the hardening regression scope and fixture inventory in `specs/010-engine-hardening-review/quickstart.md`
- [x] T002 [P] Create the hardening architecture note scaffold in `docs/architecture/engine-hardening-review_v0.1.0.md`
- [X] T003 [P] Record the review target matrix and slice coverage in `specs/010-engine-hardening-review/research.md`
- [X] T004 [P] Record the hardening entity map and validation rules in `specs/010-engine-hardening-review/data-model.md`

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared regression helpers that every hardening check depends on

- [X] T005 [P] Add repeated-run comparison helpers in `packages/tests/hardening-helpers.ts`
- [x] T006 [P] Add DD.csv lookup helpers in `packages/tests/hardening-dd-helpers.ts`
- [x] T007 [P] Add sqlite table-count helpers in `packages/tests/hardening-db-helpers.ts`
- [x] T008 [P] Add trace normalization helpers in `packages/tests/hardening-trace-helpers.ts`
- [x] T009 [P] Add adapter-exclusion helpers in `packages/tests/hardening-adapter-helpers.ts`
- [x] T010 [P] Add browser-only boundary scan helpers in `packages/tests/hardening-browser-boundary.ts`

**Checkpoint**: Regression harness ready - user story work can begin

## Phase 3: User Story 1 - Protect Deterministic Outputs (Priority: P1) 🎯 MVP

**Goal**: Keep the existing reviewed fixture cases deterministic across repeated runs so outputs, warnings, and traces do not drift.

**Independent Test**: Run the existing reviewed fixture cases twice and compare outputs, warnings, and trace counts; all comparisons must remain stable.

### Tests for User Story 1

- [X] T011 [P] [US1] Add repeated-run determinism regression for `date_resolution`, `service_resolution`, `compensation_resolution`, and `form_resolution` in `packages/tests/hardening-determinism-core.test.ts`
- [X] T012 [P] [US1] Add repeated-run determinism regression for `benefit_kernel`, `v1_ve_output`, `valuation_listings_output`, and `bsrs_configuration_output` in `packages/tests/hardening-determinism-output.test.ts`
- [X] T013 [P] [US1] Add output-shape stability regression for the committed adapter contracts in `packages/tests/hardening-output-shape.test.ts`
- [X] T014 [P] [US1] Add reviewed-input boundary regression that blocks disallowed raw or unreviewed inputs before deterministic output or persistence work begins in `packages/tests/hardening-reviewed-input.test.ts`
- [X] T015 [P] [US1] Add structured warning and error payload stability regression across repeated runs in `packages/tests/hardening-warning-error-stability.test.ts`

### Implementation for User Story 1

- [X] T016 [US1] Wire the repeated-run comparison helpers into `packages/tests/hardening-determinism-core.test.ts`
- [X] T017 [US1] Wire the repeated-run comparison helpers into `packages/tests/hardening-determinism-output.test.ts`
- [X] T018 [US1] Wire the output-shape assertions into `packages/tests/hardening-output-shape.test.ts`

**Checkpoint**: The committed slices should now prove stable across repeated runs

## Phase 4: User Story 2 - Enforce DD.csv and Adapter Boundaries (Priority: P2)

**Goal**: Keep DD.csv canonical naming and adapter-exclusion rules intact across the existing output adapters.

**Independent Test**: Run focused regressions that confirm DD-backed fields resolve to canonical Data Dictionary names and unrelated adapter tables remain unchanged.

### Tests for User Story 2

- [x] T019 [P] [US2] Add DD.csv canonical-name regression for `v1_ve_output` and `valuation_listings_output` fields in `packages/tests/hardening-dd-output.test.ts`
- [x] T020 [P] [US2] Add DD.csv canonical-name regression and approved fallback coverage for `bsrs_configuration_output` fields in `packages/tests/hardening-dd-bsrs.test.ts`
- [x] T021 [P] [US2] Add adapter-exclusion regression across the existing output adapters in `packages/tests/hardening-adapter-boundaries.test.ts`

### Implementation for User Story 2

- [x] T022 [US2] Wire the canonical DD lookup assertions into `packages/tests/hardening-dd-helpers.ts`
- [x] T023 [US2] Wire the unrelated-table absence assertions into `packages/tests/hardening-adapter-boundaries.test.ts`

**Checkpoint**: DD-first naming and adapter isolation should be protected by regression checks

## Phase 5: User Story 3 - Preserve Browser-Only Persistence and Traceability (Priority: P3)

**Goal**: Keep browser-only sqlite persistence, traceability, and template alignment stable for the committed engine outputs.

**Independent Test**: Inspect persisted rows and trace output after slice runs; confirm only local sqlite artifacts exist and trace metadata still links to reviewed inputs and rule versions.

### Tests for User Story 3

- [x] T024 [P] [US3] Add persistence-boundary regression for `engine_run` and committed output rows in `packages/tests/hardening-persistence.test.ts`
- [x] T025 [P] [US3] Add traceability regression for module traces and rule versions in `packages/tests/hardening-trace.test.ts`
- [x] T026 [P] [US3] Add browser-only runtime boundary regression in `packages/tests/hardening-browser-boundary.test.ts`
- [x] T027 [P] [US3] Add BSRS template and guidance alignment regression in `packages/tests/hardening-bsrs-template.test.ts`

### Implementation for User Story 3

- [x] T028 [P] [US3] Wire sqlite table-count helpers into `packages/tests/hardening-db-helpers.ts`
- [x] T029 [P] [US3] Wire trace comparison helpers into `packages/tests/hardening-trace-helpers.ts`
- [x] T030 [US3] Wire template-alignment assertions into `packages/tests/hardening-bsrs-template.test.ts`

**Checkpoint**: Browser-only persistence, traceability, and template alignment should now be covered

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the hardening review slice as a whole and refresh the committed artifacts if runtime output changes

- [x] T031 [P] Update hardening quickstart validation notes in `specs/010-engine-hardening-review/quickstart.md`
- [x] T032 [P] Update the hardening architecture note with regression invariants in `docs/architecture/engine-hardening-review_v0.1.0.md`
- [x] T033 [P] Run lint and full test suite validation for the hardening regressions in `packages/tests/` and `apps/web/`
- [x] T034 [P] Refresh the committed browser build only if hardening checks change runtime output in `apps/web/dist/`
- [x] T035 [P] Verify checklist completeness in `specs/010-engine-hardening-review/checklists/requirements.md`
- [X] T036 [P] Add BSRS configuration syntax/function validation coverage against `artifacts/guidance/bsrs/statement-authoring/BSRS functions.txt` in `packages/tests/hardening-bsrs-function-set.test.ts`
- [X] T037 [P] Add approved-sample BSRS configuration shape regression checks using `artifacts/reference/approved-samples/bsrs-config/` in `packages/tests/hardening-bsrs-approved-samples.test.ts`
- [X] T038 [P] Add approved-sample V1 workbook structural/reference backend validation checks using `artifacts/reference/approved-samples/v1-workbooks/` in `packages/tests/hardening-v1-workbook-approved-samples.test.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): No dependencies, can start immediately
- Foundational (Phase 2): Depends on Setup completion and blocks all user stories
- User Stories (Phase 3+): Depend on Foundational completion
- Polish (Final Phase): Depends on completion of the desired user stories

### User Story Dependencies

- User Story 1: Can start after Foundational completion
- User Story 2: Can start after Foundational completion and does not depend on a new business domain
- User Story 3: Can start after Foundational completion and stays within the existing browser/sql.js stack

### Within Each User Story

- Tests should be written before or alongside the helper code they exercise
- DD.csv canonical-name checks must come before any fallback assertions
- Adapter-exclusion checks must confirm unrelated tables remain untouched
- Persistence and traceability checks must validate existing committed output contracts only

### Parallel Opportunities

- Setup tasks `T001` to `T004` can run in parallel
- Foundational tasks `T005` to `T010` can run in parallel
- User Story 1 test tasks `T011` to `T013` can run in parallel
- User Story 2 test tasks `T019` to `T021` can run in parallel
- User Story 3 test tasks `T024` to `T027` can run in parallel
- Polish tasks `T031` to `T038` can run in parallel where file paths do not overlap

---

## Implementation Strategy

### MVP First

1. Complete Phase 1 setup
2. Complete Phase 2 foundational helpers
3. Complete User Story 1
4. Stop and validate deterministic behavior and output-shape stability before expanding further

### Incremental Delivery

1. Add deterministic regression protection first
2. Add DD.csv and adapter-boundary protection next
3. Add persistence, traceability, and template-alignment protection last
4. Refresh committed browser output only if the hardening checks prove the runtime output changed
