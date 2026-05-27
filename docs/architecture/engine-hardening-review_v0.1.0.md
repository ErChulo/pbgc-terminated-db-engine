# Engine Hardening Review v0.1.0

## Purpose

Harden the existing PBGC terminated defined-benefit engine slices against regressions
in deterministic behavior, DD.csv canonical naming, adapter boundaries, browser-only
persistence, traceability, and output-shape stability.

## Regression Invariants

### Deterministic Outputs
- Repeated runs of the same reviewed fixture packet MUST produce identical outputs,
  warnings, and trace counts.
- No output field may change unless the reviewed inputs changed.

### DD.csv Canonical Naming
- Every field with a matching DD.csv entry MUST resolve through the canonical Data
  Dictionary name.
- Fields without DD.csv entries MUST preserve their approved contract field name.

### Adapter Boundaries
- Running one output adapter MUST NOT create rows in unrelated adapter tables.
- Each adapter run MUST only write to its designated output table.

### Browser-Only Persistence
- All persistence MUST go through the browser-side sql.js database.
- No server calls, external APIs, or native file system writes are permitted in the
  engine packages.

### Traceability
- Every populated output field MUST have an associated trace record linking to:
  - Reviewed input packet
  - Rule version
  - Producing module name
  - Input field references

### Output-Shape Stability
- Committed adapter contracts MUST preserve their output field set and ordering.
- New fields require explicit contract versioning.

## Coverage

| Slice | Determinism | DD.csv | Adapter Boundary | Persistence | Traceability |
|-------|-------------|--------|-----------------|-------------|--------------|
| date_resolution | ✅ | N/A | ✅ | ✅ | ✅ |
| service_resolution | ✅ | N/A | ✅ | ✅ | ✅ |
| compensation_resolution | ✅ | N/A | ✅ | ✅ | ✅ |
| form_resolution | ✅ | N/A | ✅ | ✅ | ✅ |
| benefit_kernel | ✅ | ✅ | ✅ | ✅ | ✅ |
| v1_ve_output | ✅ | ✅ | ✅ | ✅ | ✅ |
| valuation_listings_output | ✅ | ✅ | ✅ | ✅ | ✅ |
| bsrs_configuration_output | ✅ | ✅ | ✅ | ✅ | ✅ |

## Test Files

- `packages/tests/hardening-determinism-core.test.ts` — Core slices repeated-run determinism
- `packages/tests/hardening-determinism-output.test.ts` — Output slices repeated-run determinism
- `packages/tests/hardening-output-shape.test.ts` — Output shape stability
- `packages/tests/hardening-reviewed-input.test.ts` — Reviewed input boundary
- `packages/tests/hardening-warning-error-stability.test.ts` — Warning/error stability
- `packages/tests/hardening-dd-output.test.ts` — DD.csv canonical naming for output adapters
- `packages/tests/hardening-dd-bsrs.test.ts` — DD.csv canonical naming for BSRS
- `packages/tests/hardening-adapter-boundaries.test.ts` — Adapter boundary enforcement
- `packages/tests/hardening-persistence.test.ts` — Persistence boundary
- `packages/tests/hardening-trace.test.ts` — Traceability regression
- `packages/tests/hardening-browser-boundary.test.ts` — Browser-only runtime boundary
- `packages/tests/hardening-bsrs-template.test.ts` — BSRS template alignment
- `packages/tests/hardening-bsrs-function-set.test.ts` — BSRS function set validation
- `packages/tests/hardening-bsrs-approved-samples.test.ts` — BSRS approved samples
- `packages/tests/hardening-v1-workbook-approved-samples.test.ts` — V1 workbook samples
