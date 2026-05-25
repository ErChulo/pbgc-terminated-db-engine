# Implementation Plan: Case Navigation Dashboard

**Branch**: `030-case-navigation-dashboard` | **Date**: 2026-05-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/030-case-navigation-dashboard/spec.md`

## Summary

Add a small top-level browser dashboard that introduces the current mocked approved-sample case workspace, shows stable alpha stage status, and links to the existing reconciliation workbench. The implementation stays in the existing Vite app, uses existing workbench/sample display state, adds no sql.js or output-adapter writes, and keeps all person/population context mocked.

## Technical Context

**Language/Version**: TypeScript in the existing browser app.

**Primary Dependencies**: Existing Vite app, existing reconciliation workbench display-state builder, existing static CSS and tests.

**Storage**: No new storage. Preserve existing browser-local workbench session state behavior.

**Testing**: Focused UI/display regression tests in `packages/tests/reconciliation-workbench-ui.test.ts`; lint, build, full test before merge.

**Target Platform**: Static browser application; no server runtime or hosted runtime dependencies.

**Project Type**: Browser-only Vite app with existing deterministic local packages.

**Performance Goals**: Dashboard render must be lightweight, deterministic, and non-blocking; no delayed stage work starts from dashboard in this MVP.

**Constraints**: No server calls; no OCR; no raw source reads; no real natural-person data; no new business domains; no new output adapters; no sql.js writes; committed `apps/web/dist/` output.

**Scale/Scope**: One mocked case workspace dashboard with deterministic alpha stage navigation and a link/action into the existing reconciliation workbench.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Browser-only static runtime: PASS. The feature is display-only in the existing Vite app and introduces no server, hosted API, telemetry, or remote calculation dependency.
- Reviewed input boundary: PASS. Dashboard reads only existing approved sample/workbench display state and mocked context; it reads no raw source/OCR/unreviewed extraction data.
- Traceability: PASS. The dashboard surfaces existing approved artifact/workbench evidence and planned-stage basis; it computes no actuarial outputs.
- Modular contracts: PASS. Existing engine/output contracts remain unchanged; dashboard navigation is a UI display contract only.
- Versioned deliverables: PASS. Static bundle output must be regenerated and committed after build; no delivered `.sql`, `.js`, `.ts`, or `.tex` delivery-copy artifact is introduced.

## Project Structure

### Documentation (this feature)

```text
specs/030-case-navigation-dashboard/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── case-navigation-dashboard.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/web/
├── src/
│   ├── app/
│   │   └── caseNavigationDashboardSlice.ts
│   ├── pages/
│   │   ├── CaseNavigationDashboardPage.ts
│   │   └── ReconciliationWorkbenchPage.ts
│   ├── main.ts
│   └── styles.css
├── dist/
└── index.html

packages/
└── tests/
    └── reconciliation-workbench-ui.test.ts
```

**Structure Decision**: Add a small dashboard display-state helper under `apps/web/src/app/` and a page renderer under `apps/web/src/pages/`. Reuse existing workbench state for approved-sample basis and workbench navigation. Keep focused UI regressions in the existing workbench UI test file to prove preservation.

## Phase 0: Research

See [research.md](./research.md).

## Phase 1: Design Artifacts

See [data-model.md](./data-model.md), [contracts/case-navigation-dashboard.md](./contracts/case-navigation-dashboard.md), and [quickstart.md](./quickstart.md).

## Post-Design Constitution Check

- Browser-only static runtime: PASS. Design adds only local page/display-state code.
- Reviewed input boundary: PASS. No raw/OCR/unreviewed paths are introduced.
- Traceability: PASS. Stage basis points to approved local evidence or planned-stage status.
- Modular contracts: PASS. No engine or output adapter contract changes.
- Versioned deliverables: PASS. `apps/web/dist/` remains committed after build.

## Complexity Tracking

No constitution violations.
