# Implementation Plan: Case Workspace and Session State

**Branch**: `029-name-case-workspace` | **Date**: 2026-05-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/029-case-workspace-and-session-state/spec.md`

## Summary

Add browser-local mocked workspace/session state to the existing reconciliation workbench. The slice provides visible save/restore controls, deterministic session snapshots for selected sample/theme/status/severity, graceful unavailable restore state, and preservation of existing output panels, tables, filters, progress, guards, and trace controls.

## Technical Context

**Language/Version**: TypeScript for browser runtime; Markdown spec artifacts; committed Vite build output.

**Primary Dependencies**: Existing Vite browser app, reconciliation workbench state builder, current theme/progress/work-guard display state, existing test stack.

**Storage**: Browser-local display state only. No sql.js schema/migration/persistence changes.

**Testing**: Focused workbench UI regression tests for snapshot shape, save/restore display state, invalid/unavailable fallback, preservation, boundary constraints, and repeated-run stability. Existing full lint/build/test validation remains required.

**Target Platform**: Static browser application; no server runtime, hosted APIs, telemetry, or network-loaded business logic.

**Project Type**: Browser-only Vite app with deterministic local packages already implemented.

**Performance Goals**: Save/restore controls remain identifiable within 10 seconds at desktop `1440x900` and mobile `390x844`. Restore of local display state must not block or mutate deterministic output data.

**Constraints**: No server calls; no OCR; no raw source reads; no real natural-person data; no new business domains; no new output adapters; no deterministic output changes; committed `apps/web/dist/` output remains tracked.

**Scale/Scope**: One productizing slice on the existing reconciliation workbench page. Session snapshots are mocked/local display context, not case-data persistence.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Browser-only static runtime: PASS. Design uses browser-local state and introduces no server calls, hosted APIs, remote dependencies, or telemetry.
- Reviewed input boundary: PASS. Feature reads existing approved sample display state and mocked context only.
- Traceability: PASS. Existing trace details remain unchanged and visible.
- Modular contracts: PASS. No actuarial or output adapter module contract changes; this is a UI display-state contract.
- Versioned deliverables: PASS. `apps/web/dist/` will be regenerated and committed if build output changes; no delivered `.sql`, `.js`, `.ts`, or `.tex` delivery-copy artifacts are introduced.

## Project Structure

### Documentation (this feature)

```text
specs/029-case-workspace-and-session-state/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── case-workspace-and-session-state.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/web/
├── src/
│   ├── app/
│   │   └── reconciliationWorkbenchSlice.ts
│   ├── pages/
│   │   └── ReconciliationWorkbenchPage.ts
│   ├── styles.css
│   └── main.ts
└── dist/

packages/
└── tests/
    └── reconciliation-workbench-ui.test.ts
```

**Structure Decision**: Implement session snapshots as display-only workbench state and browser-local page event handlers. Keep focused tests in `packages/tests/reconciliation-workbench-ui.test.ts`.

## Complexity Tracking

No constitution violations.

## Phase 0: Research

Completed in [research.md](./research.md). Decisions:

- Save selected approved sample, theme, status filter, and severity filter only.
- Use deterministic snapshot metadata and mocked workspace labels.
- Restore only validated snapshot values; invalid snapshots leave current stable content visible.
- Keep session state outside deterministic engine/sql.js persistence.

## Phase 1: Design & Contracts

Completed artifacts:

- [data-model.md](./data-model.md)
- [contracts/case-workspace-and-session-state.md](./contracts/case-workspace-and-session-state.md)
- [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- Browser-only static runtime: PASS. Design uses only local browser display state.
- Reviewed input boundary: PASS. No raw, OCR, hosted, uploaded, or real-person data paths are added.
- Traceability: PASS. Existing trace fields remain part of the preserved workbench contract.
- Modular contracts: PASS. Actuarial and output adapter contracts remain unchanged.
- Versioned deliverables: PASS. Static `dist/` output update is required after build.
