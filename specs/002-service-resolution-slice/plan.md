# Implementation Plan: Service Resolution Slice

**Branch**: `002-service-resolution-slice` | **Date**: 2026-05-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-service-resolution-slice/spec.md`

## Summary

Deliver the second executable PBGC terminated defined-benefit engine slice:
`service_resolution` on top of the existing browser-only Vite + sql.js
foundation and the implemented `date_resolution` slice. The slice reuses the
committed v0.1.0 migrations, seeds, contracts, schemas, and test fixtures;
adds only the service-resolution deterministic package, browser integration,
tests, and trace/persistence wiring needed to produce eligibility, vesting,
benefit, and accrual service outputs. Compensation resolution, form resolution,
benefit kernel, and output adapters remain out of implementation scope except as
referenced dependencies.

## Technical Context

**Language/Version**: TypeScript for browser runtime and deterministic local
packages; existing `.sql.txt` artifacts remain email-safe delivery sources.

**Primary Dependencies**: Existing Vite app, sql.js database foundation,
existing shared/db packages, implemented `date_resolution` package, existing
`service_resolution_contract_v0.1.0.md`, and existing
`service_resolution_test_cases_v0.1.0.csv`.

**Storage**: Browser SQLite via sql.js using existing committed migrations.
`sqlite_migration_0004_engine_outputs_v0.1.0.sql.txt` provides
`resolved_service_comp_output`; this slice uses only the service columns and
does not populate compensation columns.

**Testing**: Contract validation, deterministic service-resolution tests,
sql.js persistence tests for `engine_run` and `resolved_service_comp_output`,
traceability tests, blocked-packet validation tests, and regression checks that
date-resolution tests continue to pass.

**Target Platform**: Static browser application; no server runtime, no remote
calculation service, no network-dependent business logic.

**Project Type**: Browser-only Vite app with modular deterministic packages for
database bootstrap, date resolution, and service resolution.

**Performance Goals**: Complete each committed service-resolution fixture in
under 2 minutes from reviewer interaction; deterministic module execution should
complete synchronously for the three-case fixture set without visible UI delay.

**Constraints**: No server calls; reviewed structured inputs only; no raw OCR or
raw source-document reads in deterministic modules; no silent fallbacks; every
computed output, warning, and blocking error must include traceable context.
Static build artifacts, including `apps/web/dist`, must remain committed when
runtime output changes.

**Scale/Scope**: Second executable slice only: service-resolution input packet,
service outputs, run status, trace, tests, and browser UI integration on top of
the existing foundation. Compensation, form, benefit-kernel, and output-adapter
modules are referenced dependencies only.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Browser-only static runtime: PASS. The design uses the existing Vite/sql.js
  runtime and introduces no server calls, hosted APIs, remote calculation
  dependencies, or telemetry requirements.
- Reviewed input boundary: PASS. `service_resolution` consumes reviewed
  structured rows or `engine_input_packet` rows and does not read raw documents
  or OCR.
- Traceability: PASS. Outputs require `engine_run`, `resolved_service_comp_output`,
  and `module_trace` records, including packet, module, rule branch, warning,
  freeze/break/transfer/override branch context, and output field context.
- Modular contracts: PASS. The executable scope is limited to
  `service_resolution_contract_v0.1.0.md`; compensation, form, benefit-kernel,
  V1/VE, valuation, and BSRS contracts are dependency references only.
- Versioned deliverables: PASS. Existing v0.1.0 contracts, schemas, migrations,
  seeds, mappings, templates, and tests remain the source of truth. Any runtime
  changes must update committed `dist` artifacts.

## Project Structure

### Documentation (this feature)

```text
specs/002-service-resolution-slice/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── service-resolution-slice.md
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
│   └── service-resolution/
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

**Structure Decision**: Extend the existing implemented browser/sql.js and
`date_resolution` workspace with `packages/engine/service-resolution/`. Do not
create or implement `packages/engine/compensation-resolution/`,
`packages/engine/form-resolution/`, `packages/engine/benefit-kernel/`, or
`packages/output-adapters/*` during this slice.

## Complexity Tracking

No constitution violations or justified complexity exceptions.

## Phase 0: Research

See [research.md](./research.md). All technical context decisions are resolved
without remaining clarification markers.

## Phase 1: Design

See [data-model.md](./data-model.md),
[contracts/service-resolution-slice.md](./contracts/service-resolution-slice.md),
and [quickstart.md](./quickstart.md).

## Post-Design Constitution Check

- Browser-only static runtime: PASS. Design artifacts keep sql.js local to the
  browser and require no network dependency for deterministic execution.
- Reviewed input boundary: PASS. Data model reads reviewed resolved rows and
  service input packets; raw document/OCR tables remain lineage-only and not
  module input.
- Traceability: PASS. `module_trace` is required for each populated service
  output and structured warning/error path.
- Modular contracts: PASS. The slice contract wraps the existing
  `service_resolution` contract without changing downstream module contracts.
- Versioned deliverables: PASS. Plan references existing v0.1.0 artifacts and
  requires committed `dist` updates when implementation changes runtime output.
