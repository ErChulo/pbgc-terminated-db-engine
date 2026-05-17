# Implementation Plan: BSRS Configuration Output

**Branch**: `008-bsrs-configuration-output-slice` | **Date**: 2026-05-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/008-bsrs-configuration-output/spec.md`

## Summary

Deliver the eighth executable PBGC terminated defined-benefit engine slice:
`bsrs_configuration_output` on top of the existing browser-only Vite + sql.js
foundation and the implemented `date_resolution`, `service_resolution`,
`compensation_resolution`, `form_resolution`, `benefit_kernel`,
`v1_ve_output`, and `valuation_listings_output` slices. The slice reuses the
committed BSRS contract, engine contract, schemas, migrations, seeds, official
PBGC deliverable templates, BSRS guidance, and related output fields to
transform reviewed inputs and upstream deterministic outputs into a stable
BSRS configuration output packet and persisted adapter row for statement
programming support. `artifacts/mappings/DD.csv` is the canonical naming layer
wherever a matching Data Dictionary field exists. All other output adapters
remain outside implementation scope except as referenced contracts.

## Technical Context

**Language/Version**: TypeScript for browser runtime and deterministic local
packages; committed `.sql.txt` artifacts remain the email-safe delivery format.

**Primary Dependencies**: Existing Vite app, sql.js database foundation,
shared/db packages, implemented `date_resolution`, `service_resolution`,
`compensation_resolution`, `form_resolution`, `benefit_kernel`,
`v1_ve_output`, and `valuation_listings_output` packages, existing
`bsrs_configuration_output_contract_v0.1.0.md`, committed BSRS guidance and
official PBGC deliverable template assets, and `artifacts/mappings/DD.csv`.

**Storage**: Browser SQLite via sql.js using existing committed migrations.
`sqlite_migration_0005_output_adapters_v0.1.0.sql.txt` already defines
`bsrs_configuration_output_row`; this slice writes only BSRS configuration
output rows, `module_trace` rows, and validation records needed for review.

**Testing**: Contract-shape tests, deterministic adapter tests, sql.js
persistence tests for `engine_run`, `bsrs_configuration_output_row`, and
`module_trace`, traceability tests, conditional-branch tests, blocking-error
tests, DD-first mapping regression tests, template-compatibility tests, and
regression checks that prior slices continue to pass.

**Target Platform**: Static browser application; no server runtime, no remote
calculation service, no network-dependent business logic.

**Project Type**: Browser-only Vite app with modular deterministic packages for
date resolution, service resolution, compensation resolution, form resolution,
benefit kernel, V1/VE output, valuation listings output, and BSRS
configuration output.

**Performance Goals**: Complete each committed BSRS fixture case in a short
interactive browser run without visible delay; repeated evaluation of the same
reviewed packet should produce identical outputs, DD mappings, and trace
decisions.

**Constraints**: No server calls; reviewed structured inputs only; no raw OCR or
raw source-document reads in deterministic modules; no silent fallbacks;
structured warnings/errors required; traceability required for every populated
output field; official PBGC deliverable templates and committed dist/bundle
artifacts must remain in the repository when runtime assets change.

**Scale/Scope**: Eighth executable slice only: BSRS configuration adapter
packet, adapter output persistence, trace, tests, and browser UI integration on
top of the existing foundation. V1/VE, valuation listings, and other output
adapters are dependency references only.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Browser-only static runtime: PASS. The design uses the existing Vite/sql.js
  runtime and introduces no server calls, hosted APIs, remote calculation
  dependencies, or telemetry requirements.
- Reviewed input boundary: PASS. `bsrs_configuration_output` consumes reviewed
  structured packets and upstream deterministic outputs only; it does not read
  raw documents or OCR.
- Traceability: PASS. Outputs require `engine_run`, `bsrs_configuration_output_row`,
  and `module_trace` records that preserve packet, upstream output, module, DD
  name when applicable, rule branch, and output-field context.
- DD naming: PASS. BSRS field semantics are resolved through
  `artifacts/mappings/DD.csv` first when a matching DD entry exists.
- Modular contracts: PASS. The executable scope is limited to
  `bsrs_configuration_output_contract_v0.1.0.md`; V1/VE, valuation listings,
  and other adapter contracts are dependency references only.
- Versioned deliverables: PASS. Existing v0.1.0 contracts, schemas, migrations,
  seeds, templates, mappings, and tests remain the source of truth. Any runtime
  changes must update committed `dist` artifacts.

## Project Structure

### Documentation (this feature)

```text
specs/008-bsrs-configuration-output/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── bsrs-configuration-output.md
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
│   ├── v1-ve-output/
│   ├── valuation-listings-output/
│   └── bsrs-configuration-output/
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
new `packages/engine/bsrs-configuration-output/` adapter package, browser UI
wiring, and adapter-focused tests. Do not create or implement
`packages/output-adapters/*` during this slice; V1/VE and valuation listings
remain dependency references only.

## Complexity Tracking

No constitution violations or justified complexity exceptions.

## Phase 0: Research

See [research.md](./research.md). All technical context decisions are resolved
without remaining clarification markers.

## Phase 1: Design

See [data-model.md](./data-model.md),
[contracts/bsrs-configuration-output.md](./contracts/bsrs-configuration-output.md),
and [quickstart.md](./quickstart.md).

## Post-Design Constitution Check

- Browser-only static runtime: PASS. Design artifacts keep sql.js local to the
  browser and require no network dependency for deterministic execution.
- Reviewed input boundary: PASS. Data model reads reviewed resolved rows,
  upstream deterministic outputs, and BSRS input packets; raw document/OCR
  tables remain lineage-only and not module input.
- Traceability: PASS. `module_trace`-style field trace is required for each
  populated BSRS output and structured warning/error path.
- DD naming: PASS. BSRS field semantics first map through
  `artifacts/mappings/DD.csv` whenever a matching DD field exists.
- Modular contracts: PASS. The slice contract wraps the existing
  `bsrs_configuration_output` contract without changing downstream adapter
  contracts.
- Versioned deliverables: PASS. Plan references existing v0.1.0 artifacts and
  requires committed `dist` updates when implementation changes runtime output.

## BSRS Data Dictionary Invariant

Implementation must treat `artifacts/mappings/DD.csv` as the canonical naming
layer for BSRS field semantics wherever a matching Data Dictionary field
exists.

Every BSRS field must first map to `artifacts/mappings/DD.csv` when a matching
DD field exists.
