# Implementation Plan: Cross-Slice Reconciliation Hardening

**Branch**: `[016-cross-slice-reconciliation-hardening]` | **Date**: 2026-05-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/017-cross-slice-reconciliation-hardening/spec.md`

## Summary

Deliver backend cross-slice reconciliation hardening across the already
implemented `bsrs_configuration_output`, `v1_ve_output`, and
`valuation_listings_output` slices. The increment compares shared reviewed case
facts, identifiers, forms, and DD-backed field semantics using approved sample
artifacts and current committed output evidence only. It emits deterministic
structured findings for drift while preserving existing contracts, browser-only
sql.js boundaries, output shapes, and slice behavior.

## Technical Context

**Language/Version**: TypeScript for browser-compatible deterministic helpers
and Vitest regression coverage; approved samples, DD mappings, contracts, and
current committed output evidence remain repository-local validation sources.

**Primary Dependencies**: Existing Vite/sql.js workspace, existing
`bsrs_configuration_output`, `v1_ve_output`, and `valuation_listings_output`
packages, current DD mapping helpers, `artifacts/mappings/DD.csv`, committed
approved BSRS samples in `artifacts/reference/approved-samples/bsrs-config/`,
approved V1 workbook samples in
`artifacts/reference/approved-samples/v1-workbooks/`, existing output fixtures,
and existing hardening test helpers.

**Storage**: No new persistence tables, migrations, seeds, lower source-layer
writes, or adapter tables. Reconciliation validation evidence is test-local or
uses existing validation evidence, deterministic outputs, warnings, errors,
traces, and existing persistence rows only where current contracts already
require them.

**Testing**: Regression tests for shared fact agreement, deterministic drift
findings, DD-first comparison semantics, approved no-DD fallback handling,
identifier and form reconciliation, repeated-run payload stability, and existing
BSRS, V1/VE, and valuation-listing behavior preservation.

**Target Platform**: Static browser application and repository-local
validation; no server runtime, hosted API, external persistence, or
network-loaded business logic.

**Project Type**: Browser-only Vite app with modular deterministic packages and
repository-local hardening tests across existing output slices.

**Performance Goals**: Reconciliation over the committed approved samples and
current output fixtures completes within normal local regression-suite
execution time and produces deterministic ordered comparison records and
findings across repeated runs.

**Constraints**: No server calls; reviewed structured inputs and approved
repository artifacts only; no raw OCR/source document reads; no unreviewed
inputs; no new business domains; no new output adapters; no new persistence
tables; DD.csv is canonical wherever a matching Data Dictionary field exists;
approved no-DD fallbacks must be traceable; structured warnings/errors for
validation failures.

**Scale/Scope**: Cross-slice backend validation for committed evidence covering
`bsrs_configuration_output`, `v1_ve_output`, `valuation_listings_output`, and
existing DD-backed field mappings, forms, and identifiers. Reconciliation is
validation vocabulary over current outputs, not a new calculation slice or
output adapter.

**Write Scope**: Hardening may write regression evidence, validation records,
traces, deterministic outputs, warnings, errors, and existing persistence rows
only where current contracts already require them. It must not imply new lower
source-layer writes or new adapter persistence.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Browser-only static runtime: PASS. The increment uses committed artifacts and
  browser-compatible repository-local validation helpers without server calls,
  hosted APIs, remote calculation services, telemetry, or network-loaded
  business logic.
- Reviewed input boundary: PASS. Validation consumes approved sample artifacts,
  current committed output evidence, DD.csv, existing contracts, reviewed field
  names, and existing regression evidence only. It does not read raw OCR, source
  documents, emails, images, PDFs, hosted services, or unreviewed extraction
  output.
- Traceability: PASS. Reconciliation comparison records and findings require
  compared slices, compared fields, DD mapping or fallback basis, source
  artifact path, reviewed fact context, rule version, producing module,
  severity, and finding code.
- Modular contracts: PASS. Scope is limited to validation around existing
  BSRS, V1/VE, and valuation-listing output contracts. No new business domains
  or output adapters are introduced.
- Versioned deliverables: PASS. Existing contracts, mappings, guidance,
  samples, tests, and committed static artifacts remain the source of truth.
  New `.ts` hardening tests/helpers are internal regression artifacts, not
  delivered artifacts, so email-safe `.txt` delivery copies do not apply.

## Project Structure

### Documentation (this feature)

```text
specs/017-cross-slice-reconciliation-hardening/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── cross-slice-reconciliation-validation.md
├── checklists/
│   └── requirements.md
└── spec.md
```

### Source Code (repository root)

```text
packages/
├── engine/
│   ├── bsrs-configuration-output/
│   │   └── src/
│   ├── v1-ve-output/
│   │   └── src/
│   └── valuation-listings-output/
│       └── src/
├── shared/
│   └── src/
│       └── crossSliceReconciliation.ts
├── tests/
│   ├── hardening-cross-slice-reconciliation.test.ts
│   ├── hardening-output-shape.test.ts
│   ├── hardening-warning-error-stability.test.ts
│   ├── bsrs-configuration-output-*.test.ts
│   ├── v1-ve-output-*.test.ts
│   └── valuation-listings-output-*.test.ts

artifacts/
├── mappings/
│   └── DD.csv
└── reference/
    └── approved-samples/
        ├── bsrs-config/
        └── v1-workbooks/

docs/
└── mappings/
    └── v1_ve_output_trace_map_v0.1.0.csv
```

**Structure Decision**: Keep cross-slice reconciliation hardening in the
existing output-slice validation/test boundary. Add a small internal
reconciliation helper at `packages/shared/src/crossSliceReconciliation.ts` and
focused repository tests only as needed to compare current output evidence. Do
not create `packages/output-adapters/*`, new database migrations, new UI pages,
new runtime subsystems, or new source-layer storage.

## Complexity Tracking

No constitution violations or justified complexity exceptions.

## Phase 0: Research

See [research.md](./research.md). All technical context decisions are resolved
without remaining clarification markers.

## Phase 1: Design

See [data-model.md](./data-model.md),
[contracts/cross-slice-reconciliation-validation.md](./contracts/cross-slice-reconciliation-validation.md),
and [quickstart.md](./quickstart.md).

## Post-Design Constitution Check

- Browser-only static runtime: PASS. Design artifacts keep validation local to
  committed repository artifacts and browser-compatible deterministic helpers.
- Reviewed input boundary: PASS. Validation sources are approved samples,
  current committed output fixtures/evidence, existing contracts, reviewed
  output field names, DD.csv, and existing regression evidence only.
- Traceability: PASS. The reconciliation validation contract records compared
  slices, fields, canonical DD semantic or fallback basis, source artifact,
  reviewed fact context, severity, code, rule version, and producing module for
  every accepted comparison and finding.
- Modular contracts: PASS. The design adds validation coverage across existing
  output slices without adding business domains, calculation behavior, or output
  adapters.
- Versioned deliverables: PASS. New or changed `.ts` hardening tests/helpers are
  internal regression artifacts. Runtime or delivered artifact changes, if any
  are later proven necessary, must update versioned artifacts and committed
  build output according to the constitution.
