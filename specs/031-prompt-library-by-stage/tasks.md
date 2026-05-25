# Tasks: Prompt Library By Stage

**Input**: Design documents from `/specs/031-prompt-library-by-stage/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/prompt-library-by-stage.md, quickstart.md

**Tests**: Required because this UI slice adds a new library surface, local draft/import validation, navigation behavior, and preservation behavior for existing dashboard/workbench surfaces.

## Phase 1: Setup (Shared Infrastructure)

- [X] T001 Inspect current dashboard stage navigation in apps/web/src/app/caseNavigationDashboardSlice.ts
- [X] T002 Inspect current hash-based app rendering in apps/web/src/main.ts
- [X] T003 [P] Inspect current dashboard page rendering in apps/web/src/pages/CaseNavigationDashboardPage.ts
- [X] T004 [P] Inspect current focused UI regression coverage in packages/tests/reconciliation-workbench-ui.test.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

- [X] T005 Add prompt entry, draft, and import result types in apps/web/src/app/promptLibrarySlice.ts
- [X] T006 Add deterministic committed prompt inventory in apps/web/src/app/promptLibrarySlice.ts
- [X] T007 Add prompt library state builder and import validation helper in apps/web/src/app/promptLibrarySlice.ts
- [X] T008 [P] Add baseline prompt inventory and deterministic ordering tests in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T009 Verify no server, OCR, scraping execution, raw source read, sql.js write, output-adapter write, or real-person path is introduced in apps/web/src/app/promptLibrarySlice.ts

---

## Phase 3: User Story 1 - View Stage Prompts (Priority: P1) MVP

**Goal**: Let analysts open a prompt library from the dashboard and view selected stage prompt content.

**Independent Test**: Render the prompt library and confirm prompt entries, selected prompt body, boundary notices, and dashboard return path are visible.

### Tests for User Story 1

- [X] T010 [P] [US1] Add a failing prompt library render test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T011 [P] [US1] Add a failing dashboard-to-prompt-library navigation markup test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T012 [P] [US1] Add a failing external-LLM/no-OCR/no-scraping boundary notice test in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 1

- [X] T013 [US1] Add prompt library route target to dashboard stage inventory in apps/web/src/app/caseNavigationDashboardSlice.ts
- [X] T014 [US1] Implement prompt library page markup in apps/web/src/pages/PromptLibraryPage.ts
- [X] T015 [US1] Wire prompt library hash route in apps/web/src/main.ts
- [X] T016 [US1] Style prompt library prompt list and selected prompt panel in apps/web/src/styles.css

---

## Phase 4: User Story 2 - Edit Draft Prompt Locally (Priority: P2)

**Goal**: Show browser-local edited draft state without changing approved baseline prompts.

**Independent Test**: Build/render an edited draft and confirm baseline prompt remains visible and draft is labeled browser-local.

### Tests for User Story 2

- [X] T017 [P] [US2] Add a failing edited draft state test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T018 [P] [US2] Add a failing approved-baseline preservation test in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 2

- [X] T019 [US2] Render browser-local draft editor and status labels in apps/web/src/pages/PromptLibraryPage.ts
- [X] T020 [US2] Add local draft edit event handling without persistence writes in apps/web/src/pages/PromptLibraryPage.ts
- [X] T021 [US2] Style local draft controls and baseline/draft distinction in apps/web/src/styles.css

---

## Phase 5: User Story 3 - Import Prompt Text Or JSON Locally (Priority: P3)

**Goal**: Accept supported local prompt text/JSON as inert draft display state and reject invalid/oversized payloads.

**Independent Test**: Build/render accepted and rejected import states with stable validation messages and no execution paths.

### Tests for User Story 3

- [X] T022 [P] [US3] Add a failing accepted prompt import test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T023 [P] [US3] Add a failing rejected/oversized import boundary test in packages/tests/reconciliation-workbench-ui.test.ts
- [X] T024 [P] [US3] Add a failing repeated-render boundary test for no server/OCR/scraping/sql.js/output-adapter/real-person paths in packages/tests/reconciliation-workbench-ui.test.ts

### Implementation for User Story 3

- [X] T025 [US3] Render local prompt import textarea and validation status in apps/web/src/pages/PromptLibraryPage.ts
- [X] T026 [US3] Add local import event handling for text/JSON without server calls or execution in apps/web/src/pages/PromptLibraryPage.ts
- [X] T027 [US3] Record desktop 1440x900 and mobile 390x844 manual review evidence in specs/031-prompt-library-by-stage/quickstart.md

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T028 Run focused prompt/dashboard/workbench regression tests with npm test -- packages/tests/reconciliation-workbench-ui.test.ts
- [X] T029 Run project lint verification with npm run lint using package.json
- [X] T030 Run browser static build verification with npm run build using package.json and apps/web/dist/
- [X] T031 Update committed Vite static output in apps/web/dist/ after successful build if bundle contents changed
- [X] T032 Run full regression suite with npm test before push and PR merge
- [X] T033 Confirm no delivered .sql, .js, .ts, or .tex delivery-copy artifact is introduced for this internal UI/test slice in specs/031-prompt-library-by-stage/tasks.md

## Dependencies & Execution Order

- Phase 1 Setup: no dependencies.
- Phase 2 Foundational: depends on Phase 1 and blocks all user stories.
- Phase 3 US1: depends on Phase 2 and is the MVP.
- Phase 4 US2: depends on Phase 2 and can reuse US1 page markup.
- Phase 5 US3: depends on Phase 2 and can reuse draft/import helpers.
- Phase 6 Polish: depends on desired user stories being complete.

## Parallel Opportunities

- T003-T004 can run in parallel during setup.
- T010-T012 can be written in parallel before US1 implementation.
- T017-T018 can be written in parallel before US2 implementation.
- T022-T024 can be written in parallel before US3 implementation.

## Implementation Strategy

1. Add deterministic prompt inventory and state builder.
2. Link prompt library from the dashboard and render prompt viewer.
3. Add local draft editing state.
4. Add inert local text/JSON import validation.
5. Run focused tests, lint, build, full tests, and manual viewport review.
