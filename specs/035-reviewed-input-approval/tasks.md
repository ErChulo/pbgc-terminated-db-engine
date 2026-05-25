# Tasks: Reviewed Input Approval

**Input**: Design documents from `/specs/035-reviewed-input-approval/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Required because the feature adds a new browser page, deterministic normalized rows, decision states, and static output changes.

## Phase 1: Setup

- [x] T001 Update `.specify/feature.json` and `AGENTS.md` for `specs/035-reviewed-input-approval/plan.md`
- [x] T002 [P] Create reviewed-input approval spec artifacts in `specs/035-reviewed-input-approval/`

## Phase 2: Foundational

- [x] T003 [P] Define reviewed-input approval contract in `specs/035-reviewed-input-approval/contracts/reviewed-input-approval.md`
- [x] T004 [P] Record data model and validation rules in `specs/035-reviewed-input-approval/data-model.md`
- [x] T005 Add focused failing tests for approval navigation, normalized rows, decisions, and blocking in `packages/tests/reconciliation-workbench-ui.test.ts`

## Phase 3: User Story 1 - Normalize and Decide Reviewed Records (Priority: P1) MVP

**Goal**: Analysts can review mocked normalized imported records and apply display-only approve/reject decisions.

**Independent Test**: Focused UI tests plus desktop 1440x900 and mobile 390x844 identification check.

- [x] T006 [P] [US1] Add deterministic normalized row tests in `packages/tests/reconciliation-workbench-ui.test.ts`
- [x] T007 [P] [US1] Add approve/reject and blocked packet preview tests in `packages/tests/reconciliation-workbench-ui.test.ts`
- [x] T008 [P] [US1] Add dashboard navigation and rendered page boundary tests in `packages/tests/reconciliation-workbench-ui.test.ts`
- [x] T009 [P] [US1] Implement approval model in `apps/web/src/app/reviewedInputApprovalSlice.ts`
- [x] T010 [US1] Implement Reviewed Input Approval page in `apps/web/src/pages/ReviewedInputApprovalPage.ts`
- [x] T011 [US1] Add dashboard availability and route wiring in `apps/web/src/app/caseNavigationDashboardSlice.ts` and `apps/web/src/main.ts`
- [x] T012 [US1] Add responsive approval styles in `apps/web/src/styles.css`
- [x] T013 [US1] Preserve existing upload/import, dashboard, workbench, prompt, schema, template, theme, and filter behavior in `packages/tests/reconciliation-workbench-ui.test.ts`

## Phase 4: Polish

- [x] T014 Update `apps/web/dist/` with committed static build output
- [x] T015 Run `npm test -- reconciliation-workbench-ui.test.ts`
- [x] T016 Run `npm run lint`
- [x] T017 Run `npm run build`
- [x] T018 Run `npm test`
- [x] T019 Record desktop 1440x900 and mobile 390x844 manual 10-second evidence in `specs/035-reviewed-input-approval/quickstart.md`
- [x] T020 Verify `http://127.0.0.1:5175/` remains the intended dev URL and `5176` is closed

## Dependencies & Execution Order

- Phase 1 before Phase 2.
- Phase 2 before User Story 1.
- User Story 1 before Polish.

## Parallel Opportunities

- T003-T004 can run in parallel.
- T006-T008 can run in parallel after T005.
- T009 can run before page styling once tests define expected behavior.

## Implementation Strategy

Complete US1 MVP, validate focused tests, lint, build, full tests, then merge and update `docs/project_state.md`.
