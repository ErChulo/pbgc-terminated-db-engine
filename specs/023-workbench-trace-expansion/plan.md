# Implementation Plan: Reconciliation Workbench Trace Expansion

**Branch**: `022-reconciliation-workbench-trace-expansion` | **Date**: 2026-05-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/023-workbench-trace-expansion/spec.md`

## Summary

Improve the existing browser reconciliation workbench page by adding
clickable trace-detail expansion for reconciliation rows, Shared Facts rows,
and Shared Values rows. The increment is presentation-only: it uses existing
deterministic slice evidence, approved committed sample artifacts, trace
metadata, DD/fallback mapping basis, raw and normalized value context already
available in current rows, and mocked display context while preserving
browser-only behavior, sql.js boundaries, existing output panels, existing row
classifications, output adapter behavior, and current slice contracts.

## Technical Context

**Language/Version**: TypeScript in the existing browser-only web app and shared deterministic packages.

**Primary Dependencies**: Existing Vite web workspace, existing `apps/web/src/app/reconciliationWorkbenchSlice.ts`, existing `apps/web/src/pages/ReconciliationWorkbenchPage.ts`, existing `apps/web/src/styles.css`, existing `@pbgc/shared` reconciliation helpers, existing BSRS/V1/VE/valuation output packages, approved sample fixtures already committed in `packages/tests`, and current DD/fallback mapping evidence.

**Storage**: Display-only. No new persistence tables, migrations, seeds, browser storage writes, lower source-layer writes, deterministic output rows, or output adapter rows are planned.

**Testing**: Focused workbench tests for trace expansion state and markup, reconciliation/Shared Facts/Shared Values trace details, raw and normalized value context, intentional absence markers, deterministic repeated expansion content, no-real-person-data guardrails, and existing output/reconciliation preservation checks.

**Target Platform**: Existing static browser application. No server runtime, hosted API, remote calculation service, telemetry endpoint, network-loaded data, or real natural-person data.

**Project Type**: Browser-only Vite app with deterministic package imports and repository-local approved sample artifacts.

**Performance Goals**: The fixed approved-sample workbench remains usable in normal local browser review and renders trace details without adding multi-case search, import, export, persistence, recalculation, or new case-selection workflows.

**Constraints**: Existing workbench page only; approved artifacts and mocked display labels only; no real participant, beneficiary, alternate payee, survivor, or other natural-person data; no new business domains; no new output adapters; no server calls; no raw OCR/source document/email/image/PDF/unreviewed extraction reads; no persistence mutation; deterministic row ordering and repeated expansion stability; readability at desktop 1440x900 and mobile 390x844 viewports.

**Scale/Scope**: One visible workbench page for the existing fixed approved sample. Adds expandable trace details to existing reconciliation, Shared Facts, and Shared Values rows using current evidence. Does not add case selection, editing, import, export, recalculation, multi-case workflow, or new adapters.

**Write Scope**: Source changes are limited to the existing web workbench display-data builder, page renderer, focused tests, styles, documentation artifacts, and committed static build output if the bundle changes. Runtime behavior remains display-only and must not write source assertions, resolved facts, resolved provisions, engine input packets, deterministic outputs, output adapter rows, or new persistence tables.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Browser-only static runtime: PASS. The trace-expansion increment stays inside the existing static browser app and introduces no server calls, hosted APIs, remote calculation services, telemetry, or network-loaded business logic.
- Reviewed input boundary: PASS. The workbench uses approved committed samples, deterministic outputs, mappings, trace metadata, existing reconciliation evidence, existing Shared Facts/Shared Values evidence, and explicitly mocked display labels only. It does not read raw OCR, source documents, emails, images, PDFs, unreviewed extraction output, or real natural-person data.
- Traceability: PASS. Each expanded detail must expose compared slices, source fields, raw values, normalized values where applicable, status, severity where applicable, mapping/fallback basis, source paths where available, rule version, producing module, and stable evidence basis.
- Modular contracts: PASS. The increment presents existing BSRS, V1/VE, valuation listings, reconciliation, Shared Facts, and Shared Values contracts without changing calculation modules, adding domains, or adding output adapters.
- Versioned deliverables: PASS. No new delivered `.sql`, `.js`, `.ts`, or `.tex` artifacts are planned outside internal source/test files. Static build output must remain committed and be updated if implementation changes it.

## Project Structure

### Documentation (this feature)

```text
specs/023-workbench-trace-expansion/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── reconciliation-workbench-trace-expansion.md
├── checklists/
│   └── requirements.md
└── spec.md
```

### Source Code (repository root)

```text
apps/web/
├── src/
│   ├── app/
│   │   └── reconciliationWorkbenchSlice.ts
│   ├── pages/
│   │   └── ReconciliationWorkbenchPage.ts
│   ├── main.ts
│   └── styles.css
├── dist/
└── package.json

packages/
├── shared/
│   └── src/
│       ├── crossSliceReconciliation.ts
│       └── index.ts
└── tests/
    ├── reconciliation-workbench-ui.test.ts
    ├── hardening-cross-slice-reconciliation.test.ts
    ├── hardening-cross-slice-value-reconciliation.test.ts
    ├── bsrs-configuration-output-output.test.ts
    ├── v1-ve-output-output.test.ts
    └── valuation-listings-output-output.test.ts

artifacts/
├── mappings/
│   └── DD.csv
└── reference/
    └── approved-samples/
```

**Structure Decision**: Update the existing workbench display-data builder,
page renderer, tests, and styles to expose deterministic trace-detail
expansion. Keep engine modules, output adapters, database migrations, seeds,
schemas, deterministic slice contracts, output panel behavior, Shared Facts
behavior, Shared Values behavior, and existing classifications unchanged.
Update `apps/web/dist/` only if implementation changes the static bundle.

## Complexity Tracking

No constitution violations or justified complexity exceptions.

## Phase 0: Research

See [research.md](./research.md). All decisions are resolved without remaining
clarification markers.

## Phase 1: Design

See [data-model.md](./data-model.md),
[contracts/reconciliation-workbench-trace-expansion.md](./contracts/reconciliation-workbench-trace-expansion.md),
and [quickstart.md](./quickstart.md).

## Post-Design Constitution Check

- Browser-only static runtime: PASS. Design remains an existing static browser
  page with local deterministic imports only.
- Reviewed input boundary: PASS. Display sources are approved committed
  samples, deterministic outputs, mappings, traces, reconciliation evidence,
  Shared Facts/Shared Values evidence, and explicitly mocked display labels.
- Traceability: PASS. The UI contract and data model require compared sources,
  fields, raw values, normalized values where available, status, severity,
  mapping basis, source paths where available, rule version, producing module,
  and stable evidence basis for expanded details.
- Modular contracts: PASS. The design presents existing module outputs and
  reconciliation results without changing module contracts or adding adapters.
- Versioned deliverables: PASS. Implementation tasks must include build
  verification and committed static output updates if bundle artifacts change.
