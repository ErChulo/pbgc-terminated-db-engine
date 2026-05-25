# Tasks: Template Filling Export

**Input**: Design documents from `/specs/036-template-filling-export/`

**Tests**: Required because the feature adds filled artifact content, export readiness, dashboard navigation, and static output changes.

## Phase 1: Setup

- [x] T001 Update `.specify/feature.json` and `AGENTS.md`
- [x] T002 [P] Create template filling/export spec artifacts

## Phase 2: Foundational

- [x] T003 [P] Define contract in `specs/036-template-filling-export/contracts/template-filling-export.md`
- [x] T004 [P] Record data model in `specs/036-template-filling-export/data-model.md`
- [x] T005 Add focused failing tests in `packages/tests/reconciliation-workbench-ui.test.ts`

## Phase 3: User Story 1 - Fill and Export One Approved Artifact (Priority: P1) MVP

- [x] T006 [P] [US1] Add deterministic filled artifact tests in `packages/tests/reconciliation-workbench-ui.test.ts`
- [x] T007 [P] [US1] Add blocked export tests in `packages/tests/reconciliation-workbench-ui.test.ts`
- [x] T008 [P] [US1] Add route/rendered page tests in `packages/tests/reconciliation-workbench-ui.test.ts`
- [x] T009 [P] [US1] Implement model in `apps/web/src/app/templateFillingExportSlice.ts`
- [x] T010 [US1] Implement page in `apps/web/src/pages/TemplateFillingExportPage.ts`
- [x] T011 [US1] Add dashboard availability and route wiring in `apps/web/src/app/caseNavigationDashboardSlice.ts` and `apps/web/src/main.ts`
- [x] T012 [US1] Add responsive styles in `apps/web/src/styles.css`
- [x] T013 [US1] Preserve existing approval/upload/workbench/library behavior in `packages/tests/reconciliation-workbench-ui.test.ts`

## Phase 4: Polish

- [x] T014 Update `apps/web/dist/`
- [x] T015 Run `npm test -- reconciliation-workbench-ui.test.ts`
- [x] T016 Run `npm run lint`
- [x] T017 Run `npm run build`
- [x] T018 Run `npm test`
- [x] T019 Record desktop 1440x900 and mobile 390x844 evidence in `specs/036-template-filling-export/quickstart.md`
- [x] T020 Verify `http://127.0.0.1:5175/` remains intended and `5176` is closed

## Dependencies & Execution Order

- Setup before foundational tasks.
- Foundational tasks before US1 implementation.
- US1 before polish.
