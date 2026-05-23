# Implementation Plan: Reconciliation Workbench UI

**Branch**: `[018-reconciliation-workbench-ui]` | **Date**: 2026-05-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/018-reconciliation-workbench-ui/spec.md`

## Summary

Deliver one visible browser workbench page in the existing web app that presents
an approved sample's BSRS configuration output, V1/VE output, valuation listings
output, and cross-slice reconciliation findings in one deterministic
side-by-side review surface. The increment is display-only: it consumes already
implemented slices, approved sample artifacts, and existing reconciliation
helpers, while preserving current contracts, browser-only sql.js boundaries,
output adapter behavior, and deterministic slice behavior.

## Technical Context

**Language/Version**: TypeScript in the existing browser-only web app and
shared deterministic packages.

**Primary Dependencies**: Existing Vite web workspace, existing
`@pbgc/bsrs-configuration-output`, `@pbgc/v1-ve-output`,
`@pbgc/valuation-listings-output`, `@pbgc/shared` cross-slice reconciliation
helpers, approved fixture/sample artifacts already committed in `packages/tests`
and `artifacts/reference/approved-samples/`, and current web page rendering
patterns under `apps/web/src/pages/`.

**Storage**: Display-only. No new persistence tables, migrations, seeds, lower
source-layer writes, output adapter rows, or browser storage mutations are
planned for the workbench.

**Testing**: Browser-facing unit or integration tests for workbench data shape,
agreement-versus-drift presentation, traceability details, deterministic
repeated rendering, and existing output/reconciliation behavior preservation.
Build verification must update committed static output if implementation
changes the bundle.

**Target Platform**: Existing static browser application. No server runtime,
hosted API, external persistence, telemetry endpoint, or network-loaded
business logic.

**Project Type**: Browser-only Vite app with deterministic package imports and
repository-local approved sample artifacts.

**Performance Goals**: The approved sample workbench should render in normal
local browser regression flow and remain responsive for the single committed
sample scope.

**Constraints**: One visible workbench page only; approved sample artifacts and
already implemented deterministic outputs only; no new business domains; no new
output adapters; no server calls; no raw OCR/source document/email/image/PDF or
unreviewed extraction reads; no new persistence; no mutation of existing slice
outputs; preserve DD/fallback basis and traceability metadata where the
underlying reconciliation evidence provides it.

**Scale/Scope**: Single approved sample in the first increment. The page shows
three output slice panels and cross-slice reconciliation rows/findings for the
current deterministic evidence. It does not add case search, imports, editing,
exports, recalculation controls, or multi-case workflow.

**Write Scope**: Source changes are limited to the existing web app, focused
workbench presentation helpers/tests, documentation artifacts, and committed
static build output if it changes. Runtime behavior is display-only and must not
write source assertions, resolved facts, resolved provisions, engine input
packets, deterministic outputs, output adapter rows, or new persistence tables.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Browser-only static runtime: PASS. The workbench is an existing static browser
  app page and introduces no server calls, hosted APIs, remote calculation
  services, telemetry, or network-loaded business logic.
- Reviewed input boundary: PASS. The page uses approved committed samples,
  existing deterministic slice outputs, mappings, trace metadata, and
  reconciliation records only. It does not read raw OCR, source documents,
  emails, images, PDFs, or unreviewed extraction output.
- Traceability: PASS. Displayed comparisons and findings must expose compared
  slices, fields, values, classification, mapping/fallback basis, source
  artifact, rule version, and producing module where available in underlying
  deterministic evidence.
- Modular contracts: PASS. The increment presents existing BSRS, V1/VE,
  valuation listings, and shared reconciliation contracts without adding
  calculation logic, business domains, or output adapters.
- Versioned deliverables: PASS. No new delivered `.sql`, `.js`, `.ts`, or
  `.tex` artifacts are planned outside internal source/test files. Static build
  output must remain committed and be updated if implementation changes it.

## Project Structure

### Documentation (this feature)

```text
specs/018-reconciliation-workbench-ui/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── reconciliation-workbench-ui.md
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
├── engine/
│   ├── bsrs-configuration-output/
│   ├── v1-ve-output/
│   └── valuation-listings-output/
└── tests/
    ├── hardening-cross-slice-value-reconciliation.test.ts
    ├── hardening-output-shape.test.ts
    └── hardening-warning-error-stability.test.ts

artifacts/
├── mappings/
│   └── DD.csv
└── reference/
    └── approved-samples/
```

**Structure Decision**: Add a web-app page and app-level display-data builder
that call existing deterministic packages and shared reconciliation helpers.
Keep output adapters, database migrations, seeds, schemas, and engine modules
unchanged. Update `apps/web/dist/` only if the implementation changes the
static bundle.

## Complexity Tracking

No constitution violations or justified complexity exceptions.

## Phase 0: Research

See [research.md](./research.md). All decisions are resolved without remaining
clarification markers.

## Phase 1: Design

See [data-model.md](./data-model.md),
[contracts/reconciliation-workbench-ui.md](./contracts/reconciliation-workbench-ui.md),
and [quickstart.md](./quickstart.md).

## Post-Design Constitution Check

- Browser-only static runtime: PASS. Design remains inside the existing static
  web app and uses local package imports only.
- Reviewed input boundary: PASS. Workbench sources are approved committed
  samples, deterministic outputs, mappings, traces, and reconciliation evidence.
- Traceability: PASS. The UI contract and data model require trace detail
  exposure for every visible comparison/finding where the underlying evidence
  contains it.
- Modular contracts: PASS. The design presents existing module outputs and
  shared reconciliation results without changing module contracts or adding
  adapters.
- Versioned deliverables: PASS. Implementation tasks must include build
  verification and committed static output updates if bundle artifacts change.
