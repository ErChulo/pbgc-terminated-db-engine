# Tasks: BSRS Configuration Output

**Input**: Design documents from `/specs/008-bsrs-configuration-output/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include tests for deterministic logic, contracts, schemas, persistence, traceability, warnings/errors, DD-first naming, and output-adapter mappings.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and BSRS slice scaffolding

- [ ] T001 Create the BSRS engine package scaffold in `packages/engine/bsrs-configuration-output/src/index.ts`
- [ ] T002 [P] Add the BSRS browser page shell in `apps/web/src/pages/BsrsConfigurationPage.tsx`
- [ ] T003 [P] Add BSRS test fixture directory scaffolding in `packages/tests/bsrs-configuration-output/fixtures/`
- [ ] T004 [P] Add BSRS package export wiring in `packages/engine/bsrs-configuration-output/package.json`
- [ ] T005 [P] Register the BSRS slice in browser app navigation wiring in `apps/web/src/main.ts`
- [ ] T006 [P] Add the BSRS slice package alias and workspace wiring in `apps/web/vite.config.ts`
- [ ] T007 [P] Add BSRS module name exports in `packages/shared/src/moduleNames.ts`
- [ ] T008 Add BSRS slice architecture notes stub in `docs/architecture/bsrs-configuration-output-slice_v0.1.0.md`
- [ ] T009 Prepare BSRS review fixture metadata in `packages/tests/bsrs-configuration-output/fixtures/README.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T010 [P] Define BSRS row and trace repository interfaces in `packages/db/src/repositories.ts`
- [ ] T011 [P] Define BSRS adapter result types in `packages/engine/bsrs-configuration-output/src/resultTypes.ts`
- [ ] T012 [P] Define BSRS packet input types in `packages/engine/bsrs-configuration-output/src/types.ts`
- [ ] T013 [P] Add reviewed-input packet builder for BSRS fixtures in `packages/engine/bsrs-configuration-output/src/fixturePacketBuilder.ts`
- [ ] T014 [P] Add BSRS trace row helper skeleton in `packages/engine/bsrs-configuration-output/src/trace.ts`
- [ ] T015 [P] Add BSRS validation and warning types in `packages/engine/bsrs-configuration-output/src/errors.ts`
- [ ] T016 [P] Add BSRS deterministic runner entrypoint in `packages/engine/bsrs-configuration-output/src/runBsrsConfiguration.ts`
- [ ] T017 [P] Add BSRS output persistence accessors in `packages/db/src/sqlite.ts`
- [ ] T018 [P] Add BSRS browser-run state wiring in `apps/web/src/app/` for adapter invocation and run status
- [ ] T019 [P] Add BSRS fixture packet loader support in `packages/tests/bsrs-configuration-output/fixtures/packet-loader.ts`
- [ ] T020 Add BSRS contract reference note in `docs/architecture/bsrs-configuration-output-slice_v0.1.0.md`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Produce BSRS Configuration Output Packets (Priority: P1) 🎯 MVP

**Goal**: Generate stable BSRS configuration packets and persist successful runs.

**Independent Test**: A committed reviewed fixture packet with all required upstream outputs produces one deterministic BSRS configuration packet and one persisted BSRS output row.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T021 [P] [US1] Add BSRS contract-shape test for required input and output families in `packages/tests/bsrs-configuration-output-contract.test.ts`
- [ ] T022 [P] [US1] Add deterministic packet output test for stable BSRS generation in `packages/tests/bsrs-configuration-output-output.test.ts`
- [ ] T023 [P] [US1] Add persistence test for `engine_run` and `bsrs_configuration_output_row` in `packages/tests/bsrs-configuration-output-persistence.test.ts`
- [ ] T024 [P] [US1] Add traceability test for populated BSRS fields in `packages/tests/bsrs-configuration-output-trace.test.ts`

### Implementation for User Story 1

- [ ] T025 [P] [US1] Implement BSRS packet projection logic in `packages/engine/bsrs-configuration-output/src/projectBsrsPacket.ts`
- [ ] T026 [P] [US1] Implement BSRS input normalization against the reviewed packet contract in `packages/engine/bsrs-configuration-output/src/normalizeInputs.ts`
- [ ] T027 [P] [US1] Implement deterministic row ordering and identity handling in `packages/engine/bsrs-configuration-output/src/sortRows.ts`
- [ ] T028 [US1] Implement BSRS run orchestration in `packages/engine/bsrs-configuration-output/src/runBsrsConfiguration.ts`
- [ ] T029 [US1] Persist successful BSRS output rows in `packages/db/src/repositories.ts`
- [ ] T030 [US1] Persist BSRS trace records in `packages/engine/bsrs-configuration-output/src/trace.ts`
- [ ] T031 [P] [US1] Add BSRS browser page output rendering in `apps/web/src/pages/BsrsConfigurationPage.tsx`
- [ ] T032 [US1] Wire BSRS run status and results into the browser app state in `apps/web/src/app/`
- [ ] T033 [P] [US1] Add BSRS fixture runner integration coverage in `packages/tests/bsrs-configuration-output-runner.test.ts`
- [ ] T034 [P] [US1] Add official PBGC template compatibility assertions in `packages/tests/bsrs-configuration-output-template.test.ts`
- [ ] T035 [US1] Add browser-side BSRS repository accessors for run and trace writes in `packages/db/src/repositories.ts`
- [ ] T036 [P] [US1] Add BSRS packet summary component in `apps/web/src/components/bsrs/BsrsPacketView.tsx`
- [ ] T037 [US1] Refresh committed browser build output for the BSRS slice in `apps/web/dist/`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Handle Conditional BSRS Paths (Priority: P2)

**Goal**: Preserve explicit nulls, branch-specific warnings, and deterministic behavior for conditional BSRS cases.

**Independent Test**: Fixture cases that exercise in-pay, survivor, form-driven, and override-sensitive conditions produce explicit nulls or values without fallback invention.

### Tests for User Story 2

- [ ] T038 [P] [US2] Add conditional nullability test cases for BSRS branches in `packages/tests/bsrs-configuration-output-conditions.test.ts`
- [ ] T039 [P] [US2] Add missing-upstream validation test cases in `packages/tests/bsrs-configuration-output-validation.test.ts`
- [ ] T040 [P] [US2] Add repeat-run determinism test for conditional BSRS packets in `packages/tests/bsrs-configuration-output-repeat.test.ts`

### Implementation for User Story 2

- [ ] T041 [P] [US2] Implement conditional branch resolution for in-pay and survivor paths in `packages/engine/bsrs-configuration-output/src/branchRules.ts`
- [ ] T042 [P] [US2] Implement structured warning and error construction in `packages/engine/bsrs-configuration-output/src/errors.ts`
- [ ] T043 [US2] Extend BSRS packet projection to preserve explicit nulls for conditional fields in `packages/engine/bsrs-configuration-output/src/projectBsrsPacket.ts`
- [ ] T044 [US2] Persist failed BSRS validation runs without authoritative output rows in `packages/db/src/repositories.ts`
- [ ] T045 [P] [US2] Add browser UI feedback for BSRS warnings and errors in `apps/web/src/pages/BsrsConfigurationPage.tsx`
- [ ] T046 [US2] Add conditional BSRS fixture cases in `packages/tests/bsrs-configuration-output/fixtures/`
- [ ] T047 [US2] Add official BSRS template row-order checks in `packages/tests/bsrs-configuration-output-template.test.ts`
- [ ] T048 [P] [US2] Add conditional packet preview support in `apps/web/src/components/bsrs/BsrsPacketView.tsx`
- [ ] T049 [US2] Update BSRS quickstart validation notes for conditional runs in `specs/008-bsrs-configuration-output/quickstart.md`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Preserve Canonical Naming and Traceability (Priority: P3)

**Goal**: Resolve BSRS names through DD.csv when available and keep field-level trace aligned with canonical naming.

**Independent Test**: A fixture case with DD-backed BSRS fields emits the canonical DD name and fails if a required DD mapping is missing.

### Tests for User Story 3

- [ ] T050 [P] [US3] Add DD.csv mapping coverage regression test in `packages/tests/bsrs-configuration-output-dd.test.ts`
- [ ] T051 [P] [US3] Add trace-field mapping test requiring DD names when available in `packages/tests/bsrs-configuration-output-trace.test.ts`
- [ ] T052 [P] [US3] Add mapping helper unit test for DD-first canonical resolution in `packages/tests/bsrs-configuration-output-mapping.test.ts`

### Implementation for User Story 3

- [ ] T053 [P] [US3] Implement DD-first field mapping helper in `packages/engine/bsrs-configuration-output/src/ddMapping.ts`
- [ ] T054 [US3] Wire DD mapping into BSRS packet projection in `packages/engine/bsrs-configuration-output/src/projectBsrsPacket.ts`
- [ ] T055 [US3] Wire canonical DD names into BSRS trace generation in `packages/engine/bsrs-configuration-output/src/trace.ts`
- [ ] T056 [P] [US3] Document BSRS DD-first mapping rules and exceptions in `docs/architecture/bsrs-configuration-output-slice_v0.1.0.md`
- [ ] T057 [US3] Add BSRS DD mapping reference notes in `specs/008-bsrs-configuration-output/contracts/bsrs-configuration-output.md`
- [ ] T058 [P] [US3] Add regression test proving BSRS generation does not write to unrelated output-adapter tables, including `v1_ve_output` and `valuation_listings_output`, in `packages/tests/bsrs-configuration-output-output.test.ts`
- [ ] T059 [P] [US3] Add regression test proving approved contract-name fallback still works when a BSRS field has no matching `DD.csv` entry in `packages/tests/bsrs-configuration-output-mapping.test.ts`

**Checkpoint**: At this point, all user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T060 [P] Update committed BSRS browser dist output in `apps/web/dist/`
- [ ] T061 [P] Create email-safe `.txt` copies for delivered `.sql`, `.js`, `.ts`, or `.tex` BSRS artifacts in `packages/db/migrations/` and `packages/engine/bsrs-configuration-output/`
- [ ] T062 [P] Run the BSRS regression suite in `packages/tests/bsrs-configuration-output-*.test.ts`
- [ ] T063 [P] Verify browser-only runtime and no server-call regressions in `apps/web/src/` and `packages/engine/bsrs-configuration-output/`
- [ ] T064 [P] Validate BSRS output ordering and trace completeness against fixture cases in `packages/tests/bsrs-configuration-output-*.test.ts`
- [ ] T065 [P] Refresh BSRS quickstart and architecture notes in `specs/008-bsrs-configuration-output/quickstart.md` and `docs/architecture/bsrs-configuration-output-slice_v0.1.0.md`
- [ ] T066 [P] Run lint and typecheck for BSRS-related packages in `packages/engine/bsrs-configuration-output/` and `apps/web/`
- [ ] T067 [P] Confirm `specs/008-bsrs-configuration-output/tasks.md` checklist completeness and dependency ordering

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation when deterministic logic, contracts, schemas, persistence, traceability, warnings/errors, or output adapters change
- Contracts/schemas before deterministic modules
- Migrations/seeds before sql.js persistence behavior
- Deterministic modules before browser UI integration
- Core implementation before browser UI integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models and helpers within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Add BSRS contract-shape test for required input and output families in packages/tests/bsrs-configuration-output-contract.test.ts"
Task: "Add deterministic packet output test for stable BSRS generation in packages/tests/bsrs-configuration-output-output.test.ts"
Task: "Add persistence test for engine_run and bsrs_configuration_output_row in packages/tests/bsrs-configuration-output-persistence.test.ts"
Task: "Add traceability test for populated BSRS fields in packages/tests/bsrs-configuration-output-trace.test.ts"

# Launch independent artifact updates for User Story 1 together:
Task: "Implement BSRS packet projection logic in packages/engine/bsrs-configuration-output/src/projectBsrsPacket.ts"
Task: "Add BSRS browser page output rendering in apps/web/src/pages/BsrsConfigurationPage.tsx"
Task: "Add BSRS fixture runner integration coverage in packages/tests/bsrs-configuration-output-runner.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently
