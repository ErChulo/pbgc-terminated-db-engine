# Tasks: Case Workspace and Session State

**Input**: Design documents from `/specs/029-case-workspace-and-session-state/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/case-workspace-and-session-state.md, quickstart.md

**Tests**: Required because this UI slice changes local workspace/session state, browser-local save/restore behavior, display markup, and preservation behavior for existing deterministic workbench output.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm current workbench state, render flow, styles, and focused tests before adding session state.

- [X] T001 Inspect current workbench display state in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T002 Inspect current workbench action-bar and browser-local event flow in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [X] T003 [P] Inspect current responsive action/session styles in apps/web/src/styles.css
- [X] T004 [P] Inspect current focused workbench regression coverage in packages/tests/reconciliation-workbench-ui.test.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add shared display-only workspace session model pieces required by all user stories.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Extend workbench display-state types with Workspace Session Snapshot and Workspace Session Status in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T006 Add deterministic helpers for session snapshot creation and validation in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T007 Add default workspace session values to buildApprovedSampleReconciliationWorkbench without changing deterministic output rows in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T008 [P] Add baseline repeated-run tests for default workspace session state in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T009 Verify no new sql.js persistence, output-adapter writes, server calls, OCR paths, raw source reads, or real-person data paths are introduced in apps/web/src/app/reconciliationWorkbenchSlice.ts

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Save Current Workspace State (Priority: P1) MVP

**Goal**: Let analysts save current mocked workspace display state locally without changing deterministic workbench output.

**Independent Test**: Build and render a saved workspace state and confirm snapshot metadata, selected sample, theme, status filter, severity filter, output panels, rows, and trace controls are preserved.

### Tests for User Story 1

- [X] T010 [P] [US1] Add a failing session snapshot/default-state test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T011 [P] [US1] Add a failing saved workspace preservation test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T012 [P] [US1] Add a failing markup test for visible save controls and saved session labels in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 1

- [X] T013 [US1] Wire workspace session values into the workbench state builder in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T014 [US1] Render visible save workspace controls and saved session labels in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [X] T015 [US1] Add browser-local save event handling without server calls or deterministic persistence writes in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [X] T016 [US1] Style workspace session controls and saved labels in apps/web/src/styles.css

**Checkpoint**: User Story 1 is independently functional and testable as the MVP.

---

## Phase 4: User Story 2 - Restore Current Workspace State (Priority: P2)

**Goal**: Restore selected approved sample, theme, status filter, and severity filter from a valid browser-local mocked workspace snapshot.

**Independent Test**: Restore from a valid snapshot and confirm the workbench matches saved display state; restore from unavailable state and confirm stable content remains visible.

### Tests for User Story 2

- [X] T017 [P] [US2] Add a failing valid session restore test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T018 [P] [US2] Add a failing unavailable restore display test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T019 [P] [US2] Add a failing restore stable-content preservation test in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 2

- [X] T020 [US2] Add session snapshot restore input handling to buildApprovedSampleReconciliationWorkbench in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T021 [US2] Render visible restore controls and unavailable restore state in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [X] T022 [US2] Add browser-local restore event handling with validation and stable fallback in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [X] T023 [US2] Style restored and unavailable session states in apps/web/src/styles.css

**Checkpoint**: User Stories 1 and 2 are independently functional and testable.

---

## Phase 5: User Story 3 - Preserve Session Boundaries (Priority: P3)

**Goal**: Keep session controls and metadata readable on desktop/mobile while preserving browser-only and no-real-person-data boundaries.

**Independent Test**: Verify session markup and documented manual review evidence for desktop `1440x900` and mobile `390x844`, plus boundary regression checks for no server/OCR/raw/real-person paths.

### Tests for User Story 3

- [X] T024 [P] [US3] Add a failing boundary regression test for no server calls, OCR paths, raw source reads, hosted assets, upload paths, real-person data, output-adapter writes, or sql.js writes in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T025 [P] [US3] Add a failing responsive markup test for session controls/status with stable labels and no hidden required controls in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T026 [P] [US3] Add a failing repeated-run preservation test for saved/restored session states across at least two builds in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 3

- [X] T027 [US3] Refine responsive layout for session controls/status at desktop and mobile targets in apps/web/src/styles.css
- [X] T028 [US3] Preserve no-real-person-data notice and mocked context visibility while session controls are active in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [X] T029 [US3] Record desktop 1440x900 and mobile 390x844 manual review evidence in specs/029-case-workspace-and-session-state/quickstart.md

**Checkpoint**: All user stories are independently functional and preserve existing workbench behavior.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete slice and update committed browser output.

- [X] T030 Run focused workbench regression tests with npm test -- packages/tests/reconciliation-workbench-ui.test.ts
- [X] T031 Run project lint verification with npm run lint using package.json
- [X] T032 Run browser static build verification with npm run build using package.json and apps/web/dist/
- [X] T033 Update committed Vite static output in apps/web/dist/ after successful build if bundle contents changed
- [X] T034 Run full regression suite with npm test before push and PR merge
- [X] T035 Confirm no delivered .sql, .js, .ts, or .tex delivery-copy artifact is introduced for this internal UI/test slice in specs/029-case-workspace-and-session-state/tasks.md

---

## Dependencies & Execution Order

- Phase 1 Setup: no dependencies.
- Phase 2 Foundational: depends on Phase 1 and blocks all user stories.
- Phase 3 US1: depends on Phase 2 and is the MVP.
- Phase 4 US2: depends on Phase 2 and may reuse US1 snapshot helpers.
- Phase 5 US3: depends on Phase 2 and validates preservation across implemented states.
- Phase 6 Polish: depends on desired user stories being complete.

## Implementation Strategy

1. Add local mocked workspace snapshot state.
2. Add save controls and saved state.
3. Add restore controls, validation, and unavailable fallback.
4. Add responsive/boundary preservation regressions.
5. Run focused tests, lint, build, full tests, and manual viewport review.
