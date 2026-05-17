# Implementation Plan: Date Resolution Slice

**Branch**: `001-date-resolution-slice` | **Date**: 2026-05-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-date-resolution-slice/spec.md`

## Summary

Deliver the first executable PBGC terminated defined-benefit engine slice: a
browser-only Vite application backed by sql.js, using the committed SQLite
migrations/seeds and the existing `date_resolution` v0.1.0 contract to produce
deterministic resolved-date outputs with trace. The slice initializes the local
SQLite foundation, assembles or accepts reviewed `date_resolution` input packets,
executes only the date-resolution module, persists `engine_run`,
`resolved_dates_output`, and `module_trace` records, and validates the existing
date-resolution test cases. Service, compensation, form, benefit-kernel, and
output-adapter modules remain out of implementation scope except as referenced
contract dependencies.

## Technical Context

**Language/Version**: TypeScript for browser runtime and deterministic local
packages; existing `.sql.txt` artifacts remain email-safe delivery sources.

**Primary Dependencies**: Vite, sql.js, existing local contracts, existing
committed SQLite migrations and seeds, existing date-resolution CSV test cases.

**Storage**: Browser SQLite via sql.js using committed migrations
`sqlite_migration_0001_v0.1.0.sql.txt` through
`sqlite_migration_0004_engine_outputs_v0.1.0.sql.txt` as needed for the slice,
plus committed seed files.

**Testing**: Contract validation, deterministic date-resolution tests,
browser-side sql.js persistence tests, traceability tests, and blocked-packet
validation tests. Output-adapter tests are excluded from this slice.

**Target Platform**: Static browser application; no server runtime, no remote
calculation service, no network-dependent business logic.

**Project Type**: Browser-only Vite app with modular deterministic packages for
database bootstrap, engine packet handling, and `date_resolution`.

**Performance Goals**: Load the seeded local casework foundation and complete
each committed date-resolution test case in under 2 minutes from reviewer
interaction; deterministic module execution should complete synchronously for
the existing three-case fixture set without visible UI delay.

**Constraints**: No server calls; reviewed structured inputs only; no raw OCR or
raw source-document reads in deterministic modules; no silent fallbacks; every
computed output, warning, and blocking error must include traceable context.
Static build artifacts, including `apps/web/dist`, must remain committed when
runtime output changes.

**Scale/Scope**: First executable slice only: browser SQLite foundation,
date-resolution input packet, date-resolution outputs, trace, and existing
date-resolution tests. Downstream actuarial modules and output adapters are
referenced dependencies only.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Browser-only static runtime: PASS. The plan uses Vite and sql.js only and
  introduces no server calls, hosted APIs, remote calculation dependencies, or
  telemetry requirements.
- Reviewed input boundary: PASS. `date_resolution` consumes only reviewed
  structured rows, resolved facts, resolved plan provisions, reference rows, or
  `engine_input_packet` rows.
- Traceability: PASS. Outputs require `engine_run`, `resolved_dates_output`, and
  `module_trace` records, including input packet, module, rule branch, warning,
  and output field context.
- Modular contracts: PASS. The executable scope is limited to
  `date_resolution_contract_v0.1.0.md`; downstream service, compensation, form,
  benefit-kernel, V1/VE, valuation, and BSRS contracts are dependency references
  only.
- Versioned deliverables: PASS. Existing v0.1.0 contracts, schemas, migrations,
  seeds, mappings, templates, and tests remain the source of truth. Any runtime
  changes must update committed `dist` artifacts.

## Project Structure

### Documentation (this feature)

```text
specs/001-date-resolution-slice/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── date-resolution-slice.md
├── checklists/
│   └── requirements.md
└── spec.md
```

### Source Code (repository root)

```text
apps/web/
├── src/
│   ├── app/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   └── main.ts
├── public/
│   └── sqljs/
├── dist/
├── index.html
├── package.json
└── vite.config.ts

packages/
├── contracts/
├── db/
│   ├── migrations/
│   ├── seeds/
│   ├── queries/
│   └── schema/
├── engine/
│   └── date-resolution/
├── shared/
└── tests/

artifacts/
├── contracts/
├── schemas/
├── templates/
└── samples/

docs/
├── architecture/
└── mappings/
```

**Structure Decision**: Use the existing repository skeleton from
`docs/architecture/app_repository_skeleton_v0.1.0.txt`, but implement only the
directories required by the first slice. Keep `packages/engine/date-resolution/`
as the sole executable actuarial module for this feature. Do not implement
`packages/engine/service-resolution/`, `packages/engine/compensation-resolution/`,
`packages/engine/form-resolution/`, `packages/engine/benefit-kernel/`, or
`packages/output-adapters/*` during this slice.

## Complexity Tracking

No constitution violations or justified complexity exceptions.

## Phase 0: Research

See [research.md](./research.md). All technical context decisions are resolved
without remaining clarification markers.

## Phase 1: Design

See [data-model.md](./data-model.md), [contracts/date-resolution-slice.md](./contracts/date-resolution-slice.md),
and [quickstart.md](./quickstart.md).

## Post-Design Constitution Check

- Browser-only static runtime: PASS. Design artifacts keep sql.js local to the
  browser and require no network dependency for deterministic execution.
- Reviewed input boundary: PASS. Data model reads reviewed resolved rows and
  engine packets; raw document/OCR tables are lineage-only and not module input.
- Traceability: PASS. `module_trace` is modeled as required for each populated
  date output and structured warning/error path.
- Modular contracts: PASS. The slice contract wraps the existing
  `date_resolution` contract without changing downstream module contracts.
- Versioned deliverables: PASS. Plan references existing v0.1.0 artifacts and
  requires committed `dist` updates when implementation changes runtime output.
