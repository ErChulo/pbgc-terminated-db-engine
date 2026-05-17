# Implementation Plan: Benefit Kernel Slice

**Branch**: `005-benefit-kernel-slice` | **Date**: 2026-05-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-benefit-kernel-slice/spec.md`

## Summary

Deliver the fifth executable PBGC terminated defined-benefit engine slice:
`benefit_kernel` on top of the existing browser-only Vite + sql.js foundation
and the implemented `date_resolution`, `service_resolution`,
`compensation_resolution`, and `form_resolution` slices. The slice reuses
committed v0.1.0 contracts, schemas, migrations, seeds, templates, and benefit
kernel fixtures; adds only the deterministic benefit-kernel package, browser
integration, tests, trace, validation, and persistence wiring needed to produce
the fixture-supported monthly benefit and present-value outputs. V1/VE,
valuation listings, BSRS configuration, and other output adapters remain out of
implementation scope except as referenced downstream dependencies.

## Technical Context

**Language/Version**: TypeScript for browser runtime and deterministic local
packages; existing `.sql.txt` artifacts remain email-safe delivery sources.

**Primary Dependencies**: Existing Vite app, sql.js database foundation,
existing shared/db packages, implemented `date_resolution`,
`service_resolution`, `compensation_resolution`, and `form_resolution`
packages, existing `benefit_kernel_contract_v0.1.0.md`, and existing
`benefit_kernel_test_cases_v0.1.0.csv`.

**Storage**: Browser SQLite via sql.js using existing committed migrations.
`sqlite_migration_0004_engine_outputs_v0.1.0.sql.txt` provides
`benefit_kernel_output`; this slice writes only benefit-kernel output fields and
trace rows.

**Testing**: Contract validation, deterministic benefit-kernel tests, sql.js
persistence tests for `engine_run` and `benefit_kernel_output`, traceability
tests, blocked-packet validation tests, warning tests, and regression checks
that date-resolution, service-resolution, compensation-resolution, and
form-resolution tests continue to pass.

**Target Platform**: Static browser application; no server runtime, no remote
calculation service, no network-dependent business logic.

**Project Type**: Browser-only Vite app with modular deterministic packages for
database bootstrap, date resolution, service resolution, compensation
resolution, form resolution, and benefit kernel.

**Performance Goals**: Complete each committed benefit-kernel fixture in under
2 minutes from reviewer interaction; deterministic module execution should
complete synchronously for the three-case fixture set without visible UI delay.

**Constraints**: No server calls; reviewed structured inputs only; no raw OCR or
raw source-document reads in deterministic modules; no silent fallbacks; every
computed output, warning, and blocking error must include traceable context.
Static build artifacts, including `apps/web/dist`, must remain committed when
runtime output changes.

**Scale/Scope**: Fifth executable slice only: benefit-kernel input packet,
benefit-kernel outputs, run status, trace, tests, and browser UI integration on
top of the existing foundation. V1/VE output, valuation listings, BSRS
configuration, and other output adapters are referenced dependencies only.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Browser-only static runtime: PASS. The design uses the existing Vite/sql.js
  runtime and introduces no server calls, hosted APIs, remote calculation
  dependencies, or telemetry requirements.
- Reviewed input boundary: PASS. `benefit_kernel` consumes reviewed structured
  rows, upstream deterministic outputs, or `engine_input_packet` rows and does
  not read raw documents or OCR.
- Traceability: PASS. Outputs require `engine_run`, `benefit_kernel_output`,
  and `module_trace` records, including packet, upstream run context, module,
  rule branch, limitation branch, warning, and output field context.
- Modular contracts: PASS. The executable scope is limited to
  `benefit_kernel_contract_v0.1.0.md`; V1/VE, valuation, BSRS, and other
  adapter contracts are dependency references only.
- Versioned deliverables: PASS. Existing v0.1.0 contracts, schemas, migrations,
  seeds, templates, and tests remain the source of truth. Any runtime changes
  must update committed `dist` artifacts.

## Project Structure

### Documentation (this feature)

```text
specs/005-benefit-kernel-slice/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── benefit-kernel-slice.md
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
│   ├── compensation-resolution/
│   ├── form-resolution/
│   └── benefit-kernel/
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
`date_resolution`, `service_resolution`, `compensation_resolution`, and
`form_resolution` workspace with `packages/engine/benefit-kernel/`. Do not
create or implement `packages/output-adapters/*` during this slice.

## Complexity Tracking

No constitution violations or justified complexity exceptions.

## Phase 0: Research

See [research.md](./research.md). All technical context decisions are resolved
without remaining clarification markers.

## Phase 1: Design

See [data-model.md](./data-model.md),
[contracts/benefit-kernel-slice.md](./contracts/benefit-kernel-slice.md), and
[quickstart.md](./quickstart.md).

## Post-Design Constitution Check

- Browser-only static runtime: PASS. Design artifacts keep sql.js local to the
  browser and require no network dependency for deterministic execution.
- Reviewed input boundary: PASS. Data model reads reviewed resolved rows,
  upstream deterministic outputs, and benefit-kernel input packets; raw
  document/OCR tables remain lineage-only and not module input.
- Traceability: PASS. `module_trace` is required for each populated
  benefit-kernel output and structured warning/error path.
- Modular contracts: PASS. The slice contract wraps the existing
  `benefit_kernel` contract without changing downstream adapter contracts.
- Versioned deliverables: PASS. Plan references existing v0.1.0 artifacts and
  requires committed `dist` updates when implementation changes runtime output.
