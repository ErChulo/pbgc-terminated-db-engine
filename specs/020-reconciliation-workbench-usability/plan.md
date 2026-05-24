# Implementation Plan: Reconciliation Workbench Usability

**Branch**: `[020-reconciliation-workbench-usability]` | **Date**: 2026-05-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/020-reconciliation-workbench-usability/spec.md`

## Summary

Improve the existing browser reconciliation workbench page so an analyst can
understand the fixed approved sample, mocked case/population context, three
business output panels, shared-facts and shared-values comparison tables, and
expandable trace details without leaving the page. The increment is
presentation-only: it uses already implemented output slices, approved sample
artifacts, existing reconciliation evidence, and mocked display labels while
preserving current contracts, browser-only sql.js boundaries, deterministic
behavior, and output adapter behavior.

## Technical Context

**Language/Version**: TypeScript in the existing browser-only web app and shared deterministic packages.

**Primary Dependencies**: Existing Vite web workspace, existing reconciliation workbench page and display-data builder, existing `@pbgc/shared` cross-slice reconciliation helpers, existing BSRS/V1/VE/valuation output packages, approved fixtures/sample artifacts already committed in `packages/tests` and `artifacts/reference/approved-samples/`.

**Storage**: Display-only. No new persistence tables, migrations, seeds, browser storage writes, lower source-layer writes, deterministic output rows, or output adapter rows are planned.

**Testing**: Focused workbench tests for mocked sample header, business panel labels, shared-facts table, shared-values table, trace-detail expansion markup/state, deterministic repeated rendering, no-real-person-data guardrails, and existing output/reconciliation preservation checks.

**Target Platform**: Existing static browser application. No server runtime, hosted API, remote calculation service, telemetry endpoint, network-loaded data, or real natural-person data.

**Project Type**: Browser-only Vite app with deterministic package imports and repository-local approved sample artifacts.

**Performance Goals**: Single approved-sample workbench remains responsive in normal local browser review and renders without introducing multi-case search/import/export workflows.

**Constraints**: Existing workbench page only; approved artifacts and mocked display labels only; no real participant, beneficiary, alternate payee, survivor, or other natural-person data; no new business domains; no new output adapters; no server calls; no raw OCR/source document/email/image/PDF/unreviewed extraction reads; no persistence mutation; deterministic ordering and repeated-render stability.

**Scale/Scope**: One visible workbench page, initially with a fixed single approved sample label. Displays three business output panels, one shared-facts table, one shared-values table, and expandable trace details for current deterministic evidence. Does not add case selection beyond approved/mock labels, editing, import, export, recalculation, multi-case workflow, or new adapters.

**Write Scope**: Source changes are limited to the existing web workbench page, display-data helpers, focused tests, style updates, documentation artifacts, and committed static build output if the bundle changes. Runtime behavior remains display-only and must not write source assertions, resolved facts, resolved provisions, engine input packets, deterministic outputs, output adapter rows, or new persistence tables.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Browser-only static runtime: PASS. The usability increment stays inside the existing static browser app and introduces no server calls, hosted APIs, remote calculation services, telemetry, or network-loaded business logic.
- Reviewed input boundary: PASS. The workbench uses approved committed samples, deterministic outputs, mappings, trace metadata, existing reconciliation evidence, and explicitly mocked display labels only. It does not read raw OCR, source documents, emails, images, PDFs, unreviewed extraction output, or real natural-person data.
- Traceability: PASS. Expanded rows must expose compared slices, fields, values, classification, mapping/fallback basis, source artifact, rule version, and producing module where available in deterministic evidence.
- Modular contracts: PASS. The increment presents existing BSRS, V1/VE, valuation listings, shared-fact, and shared-value reconciliation contracts without changing calculation modules, adding domains, or adding output adapters.
- Versioned deliverables: PASS. No new delivered `.sql`, `.js`, `.ts`, or `.tex` artifacts are planned outside internal source/test files. Static build output must remain committed and be updated if implementation changes it.

## Project Structure

### Documentation (this feature)

```text
specs/020-reconciliation-workbench-usability/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── reconciliation-workbench-usability.md
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
page renderer, tests, and styles. Keep engine modules, output adapters,
database migrations, seeds, schemas, and deterministic slice contracts
unchanged. Update `apps/web/dist/` only if the implementation changes the
static bundle.

## Complexity Tracking

No constitution violations or justified complexity exceptions.

## Phase 0: Research

See [research.md](./research.md). All decisions are resolved without remaining
clarification markers.

## Phase 1: Design

See [data-model.md](./data-model.md),
[contracts/reconciliation-workbench-usability.md](./contracts/reconciliation-workbench-usability.md),
and [quickstart.md](./quickstart.md).

## Post-Design Constitution Check

- Browser-only static runtime: PASS. Design remains an existing static browser
  page with local deterministic imports only.
- Reviewed input boundary: PASS. Display sources are approved committed
  samples, deterministic outputs, mappings, traces, reconciliation evidence,
  and explicitly mocked display labels.
- Traceability: PASS. The UI contract and data model require expanded trace
  details for shared-fact and shared-value rows where the underlying evidence
  contains them.
- Modular contracts: PASS. The design presents existing module outputs and
  reconciliation results without changing module contracts or adding adapters.
- Versioned deliverables: PASS. Implementation tasks must include build
  verification and committed static output updates if bundle artifacts change.
