# Implementation Plan: V1/VE Output

**Branch**: `007-v1-ve-output-slice` | **Date**: 2026-05-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-v1-ve-output/spec.md`

## Summary

Deliver the sixth executable PBGC terminated defined-benefit engine slice:
`v1_ve_output` on top of the existing browser-only Vite + sql.js foundation and
the implemented `date_resolution`, `service_resolution`,
`compensation_resolution`, `form_resolution`, and `benefit_kernel` slices. The
slice reuses the committed v0.1.0 contracts, schemas, migrations, seeds,
templates, and related output fields to transform reviewed inputs and upstream
deterministic outputs into the structured V1/VE-ready output packet and
persisted adapter row required for downstream spreadsheet population. Valuation
listings, BSRS configuration, and other output adapters remain outside
implementation scope except as referenced contracts.

## Technical Context

**Language/Version**: TypeScript for browser runtime and deterministic local
packages; committed `.sql.txt` artifacts remain the email-safe delivery format.

**Primary Dependencies**: Existing Vite app, sql.js database foundation,
shared/db packages, implemented `date_resolution`, `service_resolution`,
`compensation_resolution`, `form_resolution`, and `benefit_kernel` packages,
existing `v1_ve_output_contract_v0.1.0.md`, and committed V1/VE fixture
content.

**Storage**: Browser SQLite via sql.js using existing committed migrations.
`sqlite_migration_0005_output_adapters_v0.1.0.sql.txt` already defines
`v1_ve_output_row`; this slice writes only V1/VE adapter output and trace data
needed for review.

**Testing**: Contract-shape tests, deterministic adapter tests, sql.js
persistence tests for `engine_run` and `v1_ve_output_row`, traceability tests,
conditional-branch tests, blocking-error tests, and regression checks that
benefit-kernel and prior slices continue to pass.

**Target Platform**: Static browser application; no server runtime, no remote
calculation service, no network-dependent business logic.

**Project Type**: Browser-only Vite app with modular deterministic packages for
date resolution, service resolution, compensation resolution, form resolution,
benefit kernel, and V1/VE output.

**Performance Goals**: Complete each committed V1/VE fixture case in a short
interactive browser run without visible delay; repeated evaluation of the same
reviewed packet should produce identical outputs and trace decisions.

**Constraints**: No server calls; reviewed structured inputs only; no raw OCR or
raw source-document reads in deterministic modules; no silent fallbacks;
structured warnings/errors required; traceability required for every populated
output field; committed dist/bundle artifacts must remain in the repository when
runtime assets change.

**Scale/Scope**: Sixth executable slice only: V1/VE adapter packet, adapter
output persistence, trace, tests, and browser UI integration on top of the
existing foundation. Valuation listings, BSRS configuration, and other output
adapters are dependency references only.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Browser-only static runtime: PASS. The design uses the existing Vite/sql.js
  runtime and introduces no server calls, hosted APIs, remote calculation
  dependencies, or telemetry requirements.
- Reviewed input boundary: PASS. `v1_ve_output` consumes reviewed structured
  packets and upstream deterministic outputs only; it does not read raw
  documents or OCR.
- Traceability: PASS. Outputs require `engine_run`, `v1_ve_output_row`, and
  trace records that preserve packet, upstream output, module, rule branch, and
  output-field context.
- Modular contracts: PASS. The executable scope is limited to
  `v1_ve_output_contract_v0.1.0.md`; valuation listings, BSRS, and other
  adapter contracts are dependency references only.
- Versioned deliverables: PASS. Existing v0.1.0 contracts, schemas, migrations,
  seeds, templates, and tests remain the source of truth. Any runtime changes
  must update committed `dist` artifacts.

## Project Structure

### Documentation (this feature)

```text
specs/006-v1-ve-output/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── v1-ve-output.md
├── checklists/
│   └── requirements.md
└── spec.md
```

### Source Code (repository root)

```text
apps/web/
├── src/
│   ├── app/
│   ├── pages/
│   ├── styles.css
│   └── main.ts
├── public/
├── dist/
├── index.html
├── package.json
└── vite.config.ts

packages/
├── db/
│   ├── migrations/
│   ├── seeds/
│   └── src/
├── engine/
│   ├── date-resolution/
│   ├── service-resolution/
│   ├── compensation-resolution/
│   ├── form-resolution/
│   ├── benefit-kernel/
│   └── v1-ve-output/
├── shared/
└── tests/

artifacts/
├── contracts/
├── schemas/
├── templates/
└── mappings/

docs/
├── architecture/
└── mappings/
```

**Structure Decision**: Extend the existing browser/sql.js workspace with a
new `packages/engine/v1-ve-output/` adapter package, browser UI wiring, and
adapter-focused tests. Do not create or implement `packages/output-adapters/*`
during this slice; valuation listings and BSRS remain dependency references
only.

## Complexity Tracking

No constitution violations or justified complexity exceptions.

## Phase 0: Research

See [research.md](./research.md). All technical context decisions are resolved
without remaining clarification markers.

## Phase 1: Design

See [data-model.md](./data-model.md),
[contracts/v1-ve-output.md](./contracts/v1-ve-output.md), and
[quickstart.md](./quickstart.md).

## Post-Design Constitution Check

- Browser-only static runtime: PASS. Design artifacts keep sql.js local to the
  browser and require no network dependency for deterministic execution.
- Reviewed input boundary: PASS. Data model reads reviewed resolved rows,
  upstream deterministic outputs, and V1/VE input packets; raw document/OCR
  tables remain lineage-only and not module input.
- Traceability: PASS. `module_trace`-style field trace is required for each
  populated V1/VE output and structured warning/error path.
- Modular contracts: PASS. The slice contract wraps the existing
  `v1_ve_output` contract without changing downstream adapter contracts.
- Versioned deliverables: PASS. Plan references existing v0.1.0 artifacts and
  requires committed `dist` updates when implementation changes runtime output.
