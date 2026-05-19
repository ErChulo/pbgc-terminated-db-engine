# Implementation Plan: engine-hardening-review

**Branch**: `[010-engine-hardening-review]` | **Date**: 2026-05-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/010-engine-hardening-review/spec.md`

## Summary

Harden the existing browser-only PBGC engine by adding regression protection around the committed deterministic slices, with emphasis on repeated-run stability, DD.csv canonical naming, adapter-exclusion boundaries, browser-side persistence, traceability, and output-shape stability. The slice is review-focused and only permits defect fixes when a regression proves the current behavior is wrong.

## Technical Context

**Language/Version**: TypeScript in a browser runtime, with committed static build artifacts and email-safe `.txt` delivery copies where required; new or changed `.ts` hardening test/helper files are internal regression artifacts, not delivered artifacts

**Primary Dependencies**: Vite, sql.js, the existing `@pbgc/*` engine packages, local regression fixtures, committed PBGC templates, BSRS guidance artifacts including `artifacts/guidance/bsrs/statement-authoring/BSRS functions.txt`, approved backend validation samples in `artifacts/reference/approved-samples/bsrs-config/` and `artifacts/reference/approved-samples/v1-workbooks/`, and `artifacts/mappings/DD.csv`

**Storage**: Browser SQLite via sql.js, committed migrations and seeds, and committed output rows/traces for regression verification

**Testing**: Regression-oriented Vitest coverage for deterministic behavior, DD.csv invariants, adapter-exclusion invariants, persistence boundaries, traceability, output-shape stability, BSRS Statement Authoring function validation, approved-sample BSRS configuration shape checks, and approved-sample V1 workbook structural/reference checks

**Target Platform**: Static browser application; no server runtime

**Project Type**: Browser-only Vite app with modular deterministic packages and committed static deliverables

**Performance Goals**: Existing reviewed fixture suites should remain stable and repeatable; hardening checks should complete within normal local test execution time for the repository

**Constraints**: No server calls; reviewed structured inputs only; no raw OCR/source document reads in deterministic modules; committed dist/bundles; structured warnings/errors; traceability for every computed output; DD.csv canonical naming where matching DD fields exist; preserve adapter boundaries

**Scale/Scope**: Existing PBGC terminated defined-benefit review fixtures and committed output adapters only; no new business domains unless needed to fix a proven defect

**Write Scope**: Hardening may write regression evidence, validation records, traces, deterministic outputs, and existing persistence rows only where current contracts already require them; it does not add lower source-layer writes.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Browser-only static runtime: PASS. Hardening work stays within the Vite/sql.js browser application and does not introduce server calls or hosted dependencies.
- Reviewed input boundary: PASS. Regression checks target existing reviewed fixture packets and committed output artifacts only.
- Traceability: PASS. Hardening artifacts must preserve input references, rule versions, producing modules, and DD-backed field names in traces and persisted outputs.
- Modular contracts: PASS. The hardening slice protects the existing date, service, compensation, form, benefit kernel, V1/VE, valuation listings, and BSRS contracts rather than adding new domains.
- Versioned deliverables: PASS. Existing contracts, schemas, migrations, seeds, mappings, dist/bundles, and `.txt` delivery artifacts remain the basis for verification.

## Project Structure

### Documentation (this feature)

```text
specs/010-engine-hardening-review/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/web/
├── src/
│   ├── app/
│   ├── pages/
│   └── main.ts
├── dist/
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

**Structure Decision**: Keep the hardening slice inside the existing browser-only engine and its committed fixtures/tests. No new runtime subsystem is introduced. The plan focuses on regression coverage and narrow defect fixes against the existing adapter packages and browser app.

## Phase 0: Outline & Research

1. Review the existing deterministic slices and identify the failure modes worth hardening:
   - repeated-run non-determinism
   - DD.csv mapping drift
   - downstream adapter leakage
   - persistence boundary regressions
   - trace row instability
   - output-shape regressions
   - browser/runtime boundary regressions
   - template or BSRS guidance misalignment
   - backend validation drift from approved BSRS configuration and V1 workbook samples
2. Consolidate the findings in `research.md` with explicit decisions for:
   - what to regression-test
   - what not to change unless a defect is proven
   - how to preserve the committed output shapes

## Phase 1: Design & Contracts

**Prerequisites:** `research.md` complete

1. Extract the regression entities into `data-model.md`:
   - reviewed fixture case
   - deterministic output artifact
   - DD mapping entry
   - adapter boundary record
   - trace record
2. Capture the hardening contract boundaries in documentation where needed:
   - deterministic regression expectations
   - DD-first canonical naming invariants
   - adapter exclusion guarantees
   - browser-only persistence guarantees
   - BSRS function-set and approved-sample validation sources
3. Update `AGENTS.md` to point at this plan file during planning workflow.
4. Re-check the constitution after the design artifacts are written.

## Constitution Check

*GATE: Must pass after Phase 1 design.*

- Browser-only static runtime: PASS. The plan keeps the scope inside the existing browser/sql.js stack.
- Reviewed input boundary: PASS. The plan targets reviewed fixture regressions and committed artifacts only.
- Traceability: PASS. The plan preserves trace and output lineage checks for the existing modules.
- Modular contracts: PASS. The plan protects existing contracts rather than adding new business domains.
- Versioned deliverables: PASS. The plan preserves committed static artifacts and versioned documents.

## Complexity Tracking

No constitution violations require justification. This is a hardening slice over existing behavior, not a new functional expansion.

## Phase 2: Planning Outputs

- `research.md`
- `data-model.md`
- `quickstart.md`
- updated `AGENTS.md` plan reference
