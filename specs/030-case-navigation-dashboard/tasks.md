# Tasks: Case Navigation Dashboard

**Input**: Design documents from `/specs/030-case-navigation-dashboard/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/case-navigation-dashboard.md, quickstart.md

**Tests**: Required because this UI slice adds a new top-level navigation surface, route/render behavior, deterministic stage display state, and preservation behavior for the existing reconciliation workbench.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm current app entry points, workbench state, styles, and test coverage before adding the dashboard.

- [X] T001 Inspect current app navigation/render entry in apps/web/src/main.ts
- [X] T002 Inspect current reconciliation workbench display state in apps/web/src/app/reconciliationWorkbenchSlice.ts
- [X] T003 [P] Inspect current page rendering patterns in apps/web/src/pages/ReconciliationWorkbenchPage.ts
- [X] T004 [P] Inspect current workbench/navigation styles in apps/web/src/styles.css
- [X] T005 [P] Inspect current focused UI regression coverage in packages/tests/reconciliation-workbench-ui.test.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add shared display-only dashboard model pieces required by all user stories.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T006 Add case dashboard summary and stage navigation types in apps/web/src/app/caseNavigationDashboardSlice.ts
- [X] T007 Add deterministic stage inventory and ordering helper in apps/web/src/app/caseNavigationDashboardSlice.ts
- [X] T008 Add dashboard state builder that reuses existing approved-sample workbench state without changing output rows in apps/web/src/app/caseNavigationDashboardSlice.ts
- [X] T009 [P] Add baseline deterministic dashboard state tests in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T010 Verify no new sql.js persistence, output-adapter writes, server calls, OCR paths, raw source reads, upload execution, or real-person data paths are introduced in apps/web/src/app/caseNavigationDashboardSlice.ts

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Open Case Workspace From Dashboard (Priority: P1) MVP

**Goal**: Let analysts open the app to a mocked case dashboard and navigate to the existing reconciliation workbench.

**Independent Test**: Render the dashboard and confirm it shows the mocked workspace, approved-sample basis, no-real-person-data notice, and deterministic workbench navigation target while preserving existing workbench output.

### Tests for User Story 1

- [X] T011 [P] [US1] Add a failing dashboard summary and no-real-person-data test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T012 [P] [US1] Add a failing dashboard-to-workbench navigation markup test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T013 [P] [US1] Add a failing preservation test proving dashboard state does not change existing workbench output/session state in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 1

- [X] T014 [US1] Implement dashboard page markup in apps/web/src/pages/CaseNavigationDashboardPage.ts
- [X] T015 [US1] Wire the dashboard as the app entry point while preserving the existing workbench render path in apps/web/src/main.ts
- [X] T016 [US1] Add dashboard navigation action or target to the existing workbench surface in apps/web/src/pages/CaseNavigationDashboardPage.ts
- [X] T017 [US1] Style dashboard summary and workbench action in apps/web/src/styles.css

**Checkpoint**: User Story 1 is independently functional and testable as the MVP.

---

## Phase 4: User Story 2 - Inspect Stage Status (Priority: P2)

**Goal**: Show deterministic alpha case stages with clear available/current/planned/unavailable labels.

**Independent Test**: Render the dashboard and confirm all required alpha stage keys appear in stable order with display-only status details for planned stages.

### Tests for User Story 2

- [X] T018 [P] [US2] Add a failing required stage inventory and ordering test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T019 [P] [US2] Add a failing planned-stage display-only boundary test in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 2

- [X] T020 [US2] Render stage status list with stable labels and status markers in apps/web/src/pages/CaseNavigationDashboardPage.ts
- [X] T021 [US2] Style stage status list, planned-stage labels, and unavailable markers in apps/web/src/styles.css

**Checkpoint**: User Stories 1 and 2 are independently functional and testable.

---

## Phase 5: User Story 3 - Preserve Responsive Navigation (Priority: P3)

**Goal**: Keep dashboard navigation readable on desktop and mobile while preserving browser-only/no-real-person-data boundaries.

**Independent Test**: Verify dashboard markup and documented manual review evidence for desktop `1440x900` and mobile `390x844`.

### Tests for User Story 3

- [X] T022 [P] [US3] Add a failing responsive dashboard markup test with stable labels and no hidden required controls in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T023 [P] [US3] Add a failing repeated-render boundary test for no server/OCR/raw/upload/sql.js/output-adapter/real-person paths in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 3

- [X] T024 [US3] Refine responsive dashboard layout for desktop and mobile targets in apps/web/src/styles.css
- [X] T025 [US3] Record desktop 1440x900 and mobile 390x844 manual review evidence in specs/030-case-navigation-dashboard/quickstart.md

**Checkpoint**: All user stories are independently functional and preserve existing workbench behavior.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete slice and update committed browser output.

- [X] T026 Run focused dashboard/workbench regression tests with npm test -- packages/tests/reconciliation-workbench-ui.test.ts
- [X] T027 Run project lint verification with npm run lint using package.json
- [X] T028 Run browser static build verification with npm run build using package.json and apps/web/dist/
- [X] T029 Update committed Vite static output in apps/web/dist/ after successful build if bundle contents changed
- [X] T030 Run full regression suite with npm test before push and PR merge
- [X] T031 Confirm no delivered .sql, .js, .ts, or .tex delivery-copy artifact is introduced for this internal UI/test slice in specs/030-case-navigation-dashboard/tasks.md

---

## Dependencies & Execution Order

- Phase 1 Setup: no dependencies.
- Phase 2 Foundational: depends on Phase 1 and blocks all user stories.
- Phase 3 US1: depends on Phase 2 and is the MVP.
- Phase 4 US2: depends on Phase 2 and can be implemented after or alongside US1 page markup.
- Phase 5 US3: depends on Phase 2 and validates preservation across implemented dashboard states.
- Phase 6 Polish: depends on desired user stories being complete.

## Parallel Opportunities

- T003-T005 can run in parallel during setup.
- T009 can run in parallel with manual boundary inspection in T010 after dashboard types are known.
- T011-T013 can be written in parallel before US1 implementation.
- T018-T019 can be written in parallel before US2 implementation.
- T022-T023 can be written in parallel before responsive refinement.

## Implementation Strategy

1. Add deterministic dashboard display state.
2. Add dashboard summary and workbench navigation as the MVP.
3. Add visible stage status list.
4. Add responsive/boundary preservation regressions.
5. Run focused tests, lint, build, full tests, and manual viewport review.
