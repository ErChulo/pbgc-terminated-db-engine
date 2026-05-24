# Implementation Plan: Reconciliation Workbench Status Filtering

**Branch**: `024-reconciliation-workbench-status-filtering` | **Date**: 2026-05-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/025-workbench-status-filtering/spec.md`

## Summary

Improve the existing reconciliation workbench page with analyst-usable display filters for reconciliation status and severity. The implementation will add deterministic filter state over already-built reconciliation rows, Shared Facts rows, and Shared Values rows while preserving approved-sample selection, sample header, output panels, row ordering, trace expansion, browser-only boundaries, and existing slice behavior. No new business domain, output adapter, persistence responsibility, or lower source-layer write is planned.

## Technical Context

**Language/Version**: TypeScript in the existing browser app and focused Vitest regression tests.

**Primary Dependencies**: Existing Vite browser app, sql.js boundary, already implemented deterministic packages, existing reconciliation workbench state builder, renderer, approved sample selector, and focused workbench tests.

**Storage**: No new persistence responsibility. Existing browser sql.js boundaries remain unchanged; filters are display state only.

**Testing**: Focused workbench UI/state tests in `packages/tests/reconciliation-workbench-ui.test.ts`, plus lint/build verification and committed static bundle update if the app build changes `apps/web/dist/`.

**Target Platform**: Static browser application with no server runtime and no network-loaded business logic.

**Project Type**: Existing browser-only Vite app with deterministic modular packages and internal workbench display state.

**Performance Goals**: Analysts can identify and apply a status filter in under 10 seconds. Filtering and clearing filters preserve deterministic row ordering and repeated-render equality for the selected approved sample.

**Constraints**: No server calls; reviewed/approved sample inputs only; no raw OCR, raw source document, upload, URL, email, or free-form external sample loading; no real natural-person data; no new business domains; no new output adapters; preserve approved-sample selection, output panels, Shared Facts, Shared Values, reconciliation rows, and trace expansion behavior.

**Scale/Scope**: One existing reconciliation workbench page, existing approved sample evidence, and the current row status/severity vocabularies already emitted by the implemented workbench rows.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Browser-only static runtime: PASS. Filtering is local display behavior in the existing browser page and introduces no server calls, hosted APIs, or remote dependencies.
- Reviewed input boundary: PASS. Filtering consumes only existing approved sample display rows and mocked context; raw OCR, raw source documents, uploads, URLs, emails, and unreviewed extraction output remain disallowed.
- Traceability: PASS. Active filters, selected sample identity, row status/severity, output panel source, comparison fields, mapping basis, rule version, producing module, and trace-detail row identity remain visible or regression-tested.
- Modular contracts: PASS. Existing BSRS, V1/VE, valuation listing, cross-slice reconciliation, sample selector, and workbench display contracts are preserved; no calculation module or output adapter contract is added.
- Versioned deliverables: PASS. Source, tests, and committed `apps/web/dist/` output are identified for update when implementation changes the browser bundle. No delivered `.sql`, `.js`, `.ts`, or `.tex` email-copy artifact is planned; changed source/test `.ts` files are internal regression/source artifacts.

## Project Structure

### Documentation (this feature)

```text
specs/025-workbench-status-filtering/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── reconciliation-workbench-status-filtering.md
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
│   └── styles.css
└── dist/
    ├── index.html
    └── assets/

packages/
└── tests/
    └── reconciliation-workbench-ui.test.ts

artifacts/
├── mappings/
│   └── DD.csv
└── reference/
    └── approved-samples/
```

**Structure Decision**: Use the existing workbench state builder and page renderer. Add filter-oriented display state and filtered row projections in `apps/web/src/app/reconciliationWorkbenchSlice.ts`, render status/severity controls and empty states in `apps/web/src/pages/ReconciliationWorkbenchPage.ts`, style controls in `apps/web/src/styles.css`, and extend focused regression coverage in `packages/tests/reconciliation-workbench-ui.test.ts`. Update `apps/web/dist/` only through the normal build if source changes affect the committed bundle.

## Complexity Tracking

No constitution violations are planned.

## Phase 0: Research

Research decisions are captured in [research.md](./research.md).

## Phase 1: Design & Contracts

Design artifacts:

- [data-model.md](./data-model.md)
- [contracts/reconciliation-workbench-status-filtering.md](./contracts/reconciliation-workbench-status-filtering.md)
- [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- Browser-only static runtime: PASS. Design keeps filtering in local browser display state with no network or server dependency.
- Reviewed input boundary: PASS. Contract limits filter inputs to existing approved workbench display rows and forbids raw, hosted, uploaded, free-form, and real-person data.
- Traceability: PASS. Data model and contract require active filter state, selected sample identity, row status/severity, source fields, mapping basis, rule version, producing module, and trace detail continuity.
- Modular contracts: PASS. Existing output adapters and reconciliation helpers are consumed as display sources only; no output adapter writes or recalculation behavior are added.
- Versioned deliverables: PASS. Plan includes focused tests, source updates, and static build artifact update when implementation changes bundled output.
