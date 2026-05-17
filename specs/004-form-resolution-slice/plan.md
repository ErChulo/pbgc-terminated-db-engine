# Implementation Plan: Form Resolution Slice

**Branch**: `004-form-resolution-slice` | **Date**: 2026-05-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-form-resolution-slice/spec.md`

## Summary

Deliver the fourth executable PBGC terminated defined-benefit engine slice:
`form_resolution` on top of the existing browser-only Vite + sql.js foundation
and the implemented `date_resolution`, `service_resolution`, and
`compensation_resolution` slices. The slice reuses committed v0.1.0 contracts,
schemas, migrations, seeds, mappings, templates, and form fixtures; adds only
the form-resolution deterministic package, browser integration, tests, trace,
validation, and persistence wiring needed to produce retirement type, form
codes, payment status, lump-sum option, and programming indicators. Benefit
kernel, V1/VE output, valuation listings, and BSRS configuration remain out of
implementation scope except as referenced dependencies.

## Technical Context

**Language/Version**: TypeScript for browser runtime and deterministic local
packages; existing `.sql.txt` artifacts remain email-safe delivery sources.

**Primary Dependencies**: Existing Vite app, sql.js database foundation,
existing shared/db packages, implemented `date_resolution`,
`service_resolution`, and `compensation_resolution` packages, existing
`form_resolution_contract_v0.1.0.md`, and existing
`form_resolution_test_cases_v0.1.0.csv`.

**Storage**: Browser SQLite via sql.js using existing committed migrations.
`sqlite_migration_0004_engine_outputs_v0.1.0.sql.txt` provides
`resolved_forms_output`; this slice writes only form-resolution output fields
and trace rows.

**Testing**: Contract validation, deterministic form-resolution tests, sql.js
persistence tests for `engine_run` and `resolved_forms_output`, traceability
tests, blocked-packet validation tests, warning tests, and regression checks
that date-resolution, service-resolution, and compensation-resolution tests
continue to pass.

**Target Platform**: Static browser application; no server runtime, no remote
calculation service, no network-dependent business logic.

**Project Type**: Browser-only Vite app with modular deterministic packages for
database bootstrap, date resolution, service resolution, compensation
resolution, and form resolution.

**Performance Goals**: Complete each committed form-resolution fixture in under
2 minutes from reviewer interaction; deterministic module execution should
complete synchronously for the three-case fixture set without visible UI delay.

**Constraints**: No server calls; reviewed structured inputs only; no raw OCR or
raw source-document reads in deterministic modules; no silent fallbacks; every
computed output, warning, and blocking error must include traceable context.
Static build artifacts, including `apps/web/dist`, must remain committed when
runtime output changes.

**Scale/Scope**: Fourth executable slice only: form-resolution input packet,
form outputs, run status, trace, tests, and browser UI integration on top of the
existing foundation. Benefit-kernel and output-adapter modules are referenced
dependencies only.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Browser-only static runtime: PASS. The design uses the existing Vite/sql.js
  runtime and introduces no server calls, hosted APIs, remote calculation
  dependencies, or telemetry requirements.
- Reviewed input boundary: PASS. `form_resolution` consumes reviewed structured
  rows or `engine_input_packet` rows and does not read raw documents or OCR.
- Traceability: PASS. Outputs require `engine_run`, `resolved_forms_output`,
  and `module_trace` records, including packet, module, rule branch, warning,
  current-pay/QDRO/QPSA/death/lump-sum/PBGC-policy context, and output field
  context.
- Modular contracts: PASS. The executable scope is limited to
  `form_resolution_contract_v0.1.0.md`; benefit-kernel, V1/VE, valuation, and
  BSRS contracts are dependency references only.
- Versioned deliverables: PASS. Existing v0.1.0 contracts, schemas, migrations,
  seeds, mappings, templates, and tests remain the source of truth. Any runtime
  changes must update committed `dist` artifacts.

## Project Structure

### Documentation (this feature)

```text
specs/004-form-resolution-slice/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── form-resolution-slice.md
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
│   └── form-resolution/
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
`date_resolution`, `service_resolution`, and `compensation_resolution`
workspace with `packages/engine/form-resolution/`. Do not create or implement
`packages/engine/benefit-kernel/` or `packages/output-adapters/*` during this
slice.

## Complexity Tracking

No constitution violations or justified complexity exceptions.

## Phase 0: Research

See [research.md](./research.md). All technical context decisions are resolved
without remaining clarification markers.

## Phase 1: Design

See [data-model.md](./data-model.md),
[contracts/form-resolution-slice.md](./contracts/form-resolution-slice.md), and
[quickstart.md](./quickstart.md).

## Post-Design Constitution Check

- Browser-only static runtime: PASS. Design artifacts keep sql.js local to the
  browser and require no network dependency for deterministic execution.
- Reviewed input boundary: PASS. Data model reads reviewed resolved rows and
  form input packets; raw document/OCR tables remain lineage-only and not module
  input.
- Traceability: PASS. `module_trace` is required for each populated form output
  and structured warning/error path.
- Modular contracts: PASS. The slice contract wraps the existing
  `form_resolution` contract without changing downstream module contracts.
- Versioned deliverables: PASS. Plan references existing v0.1.0 artifacts and
  requires committed `dist` updates when implementation changes runtime output.
