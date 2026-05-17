# Implementation Plan: Compensation Resolution Slice

**Branch**: `003-compensation-resolution-slice` | **Date**: 2026-05-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-compensation-resolution-slice/spec.md`

## Summary

Deliver the third executable PBGC terminated defined-benefit engine slice:
`compensation_resolution` on top of the existing browser-only Vite + sql.js
foundation and the implemented `date_resolution` and `service_resolution`
slices. The slice reuses committed v0.1.0 contracts, schemas, migrations,
seeds, mappings, templates, and compensation fixtures; adds only the
compensation-resolution deterministic package, browser integration, tests,
trace, validation, and persistence wiring needed to produce compensation,
average compensation, and covered compensation outputs. Form resolution, benefit
kernel, V1/VE output, valuation listings, and BSRS configuration remain out of
implementation scope except as referenced dependencies.

## Technical Context

**Language/Version**: TypeScript for browser runtime and deterministic local
packages; existing `.sql.txt` artifacts remain email-safe delivery sources.

**Primary Dependencies**: Existing Vite app, sql.js database foundation,
existing shared/db packages, implemented `date_resolution` and
`service_resolution` packages, existing
`compensation_resolution_contract_v0.1.0.md`, and existing
`compensation_resolution_test_cases_v0.1.0.csv`.

**Storage**: Browser SQLite via sql.js using existing committed migrations.
`sqlite_migration_0004_engine_outputs_v0.1.0.sql.txt` provides
`resolved_service_comp_output`; this slice writes only compensation columns and
preserves existing service columns when a shared service-and-compensation record
is updated.

**Testing**: Contract validation, deterministic compensation-resolution tests,
sql.js persistence tests for `engine_run` and `resolved_service_comp_output`,
traceability tests, blocked-packet validation tests, frozen-benefit warning
tests, and regression checks that date-resolution and service-resolution tests
continue to pass.

**Target Platform**: Static browser application; no server runtime, no remote
calculation service, no network-dependent business logic.

**Project Type**: Browser-only Vite app with modular deterministic packages for
database bootstrap, date resolution, service resolution, and compensation
resolution.

**Performance Goals**: Complete each committed compensation-resolution fixture
in under 2 minutes from reviewer interaction; deterministic module execution
should complete synchronously for the three-case fixture set without visible UI
delay.

**Constraints**: No server calls; reviewed structured inputs only; no raw OCR or
raw source-document reads in deterministic modules; no silent fallbacks; every
computed output, warning, and blocking error must include traceable context.
Static build artifacts, including `apps/web/dist`, must remain committed when
runtime output changes.

**Scale/Scope**: Third executable slice only: compensation-resolution input
packet, compensation outputs, run status, trace, tests, and browser UI
integration on top of the existing foundation. Form-resolution, benefit-kernel,
and output-adapter modules are referenced dependencies only.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Browser-only static runtime: PASS. The design uses the existing Vite/sql.js
  runtime and introduces no server calls, hosted APIs, remote calculation
  dependencies, or telemetry requirements.
- Reviewed input boundary: PASS. `compensation_resolution` consumes reviewed
  structured rows or `engine_input_packet` rows and does not read raw documents
  or OCR.
- Traceability: PASS. Outputs require `engine_run`, compensation fields in
  `resolved_service_comp_output`, and `module_trace` records, including packet,
  module, rule branch, warning, override/history/covered-compensation/cap/freeze
  context, and output field context.
- Modular contracts: PASS. The executable scope is limited to
  `compensation_resolution_contract_v0.1.0.md`; form, benefit-kernel, V1/VE,
  valuation, and BSRS contracts are dependency references only.
- Versioned deliverables: PASS. Existing v0.1.0 contracts, schemas, migrations,
  seeds, mappings, templates, and tests remain the source of truth. Any runtime
  changes must update committed `dist` artifacts.

## Project Structure

### Documentation (this feature)

```text
specs/003-compensation-resolution-slice/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── compensation-resolution-slice.md
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
│   └── sqljs/
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
│   └── compensation-resolution/
├── shared/
└── tests/

artifacts/
├── contracts/
├── schemas/
└── templates/

docs/
├── architecture/
└── mappings/
```

**Structure Decision**: Extend the existing implemented browser/sql.js,
`date_resolution`, and `service_resolution` workspace with
`packages/engine/compensation-resolution/`. Do not create or implement
`packages/engine/form-resolution/`, `packages/engine/benefit-kernel/`, or
`packages/output-adapters/*` during this slice.

## Complexity Tracking

No constitution violations or justified complexity exceptions.

## Phase 0: Research

See [research.md](./research.md). All technical context decisions are resolved
without remaining clarification markers.

## Phase 1: Design

See [data-model.md](./data-model.md),
[contracts/compensation-resolution-slice.md](./contracts/compensation-resolution-slice.md),
and [quickstart.md](./quickstart.md).

## Post-Design Constitution Check

- Browser-only static runtime: PASS. Design artifacts keep sql.js local to the
  browser and require no network dependency for deterministic execution.
- Reviewed input boundary: PASS. Data model reads reviewed resolved rows and
  compensation input packets; raw document/OCR tables remain lineage-only and
  not module input.
- Traceability: PASS. `module_trace` is required for each populated
  compensation output and structured warning/error path.
- Modular contracts: PASS. The slice contract wraps the existing
  `compensation_resolution` contract without changing downstream module
  contracts.
- Versioned deliverables: PASS. Plan references existing v0.1.0 artifacts and
  requires committed `dist` updates when implementation changes runtime output.
