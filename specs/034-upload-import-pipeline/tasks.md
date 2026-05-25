# Tasks: Upload Import Pipeline

**Input**: Design documents from `/specs/034-upload-import-pipeline/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Required because the feature adds a new browser page, deterministic warning/error states, dashboard navigation, and static output changes.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish feature metadata and scope.

- [x] T001 Update `.specify/feature.json` and `AGENTS.md` for `specs/034-upload-import-pipeline/plan.md`
- [x] T002 [P] Create upload/import spec artifacts in `specs/034-upload-import-pipeline/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define deterministic local preview boundaries before UI implementation.

- [x] T003 [P] Define upload/import deterministic source and preview contract in `specs/034-upload-import-pipeline/contracts/upload-import-pipeline.md`
- [x] T004 [P] Record data model and validation rules in `specs/034-upload-import-pipeline/data-model.md`
- [x] T005 Add focused failing tests for upload/import navigation, preview statuses, and boundary invariants in `packages/tests/reconciliation-workbench-ui.test.ts`

**Checkpoint**: Foundation ready - user story implementation can start.

---

## Phase 3: User Story 1 - Preview Local Imports (Priority: P1) MVP

**Goal**: Analysts can open Upload / Import and preview mocked reviewed JSON plus inert external-LLM artifact text locally.

**Independent Test**: Run focused UI tests and manually identify/validate the page at desktop 1440x900 and mobile 390x844.

### Tests for User Story 1

- [x] T006 [P] [US1] Add deterministic accepted, malformed, invalid, empty, and oversized reviewed JSON preview tests in `packages/tests/reconciliation-workbench-ui.test.ts`
- [x] T007 [P] [US1] Add inert external-LLM artifact boundary tests in `packages/tests/reconciliation-workbench-ui.test.ts`
- [x] T008 [P] [US1] Add dashboard navigation and rendered page tests in `packages/tests/reconciliation-workbench-ui.test.ts`

### Implementation for User Story 1

- [x] T009 [P] [US1] Implement upload/import preview model in `apps/web/src/app/uploadImportPipelineSlice.ts`
- [x] T010 [US1] Implement Upload / Import page in `apps/web/src/pages/UploadImportPipelinePage.ts`
- [x] T011 [US1] Add dashboard stage availability and route wiring in `apps/web/src/app/caseNavigationDashboardSlice.ts` and `apps/web/src/main.ts`
- [x] T012 [US1] Add responsive upload/import styles in `apps/web/src/styles.css`
- [x] T013 [US1] Preserve existing workbench, prompt, schema, template, theme, progress, status/severity filtering, and trace behavior via focused regression tests in `packages/tests/reconciliation-workbench-ui.test.ts`

**Checkpoint**: User Story 1 works independently.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Validate and commit the MVP.

- [x] T014 Update `apps/web/dist/` with committed static build output
- [x] T015 Run `npm test -- reconciliation-workbench-ui.test.ts`
- [x] T016 Run `npm run lint`
- [x] T017 Run `npm run build`
- [x] T018 Run `npm test`
- [x] T019 Record desktop 1440x900 and mobile 390x844 manual 10-second Upload / Import identification evidence in `specs/034-upload-import-pipeline/quickstart.md`
- [x] T020 Verify `http://127.0.0.1:5175/` remains the only intended dev URL and `5176` is closed

---

## Dependencies & Execution Order

- Phase 1 before Phase 2.
- Phase 2 before User Story 1.
- User Story 1 before Polish.
- T005-T008 should fail before T009-T012 are implemented.

## Parallel Opportunities

- T002-T004 can run in parallel.
- T006-T008 can run in parallel after T005.
- T009 can run before page styling once tests define expected behavior.

## Implementation Strategy

### MVP First

1. Complete setup and foundational tests.
2. Implement US1 only.
3. Validate focused tests, lint, build, and full tests.
4. Commit, push, open PR, squash merge, return to main, and update `docs/project_state.md`.
