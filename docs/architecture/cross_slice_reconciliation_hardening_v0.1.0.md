# Architecture Note: Cross-Slice Reconciliation Hardening v0.1.0

## Scope

Backend validation and regression protection across the already implemented
`bsrs_configuration_output`, `v1_ve_output`, and `valuation_listings_output`
output slices. Compares shared reviewed case facts using approved sample
artifacts and current committed output evidence, emitting deterministic
structured findings for drift while preserving existing contracts and
browser-only sql.js boundaries.

## Module

- **Internal helper**: `packages/shared/src/crossSliceReconciliation.ts`
- **Tests**: `packages/tests/hardening-cross-slice-reconciliation.test.ts`
- **Output-shape stability**: `packages/tests/hardening-output-shape.test.ts`
- **Warning/error stability**: `packages/tests/hardening-warning-error-stability.test.ts`

## Finding Codes

### US1: Shared Fact Drift Detection

| Code | Severity | Description |
|---|---|---|
| `CROSS_SLICE_FACT_DRIFT` | error | Shared reviewed fact differs across output slices |

### US2: DD Mapping Boundaries

| Code | Severity | Description |
|---|---|---|
| `CROSS_SLICE_DD_MAPPING_MISSING` | error | DD-backed field has no matching DD.csv entry in the affected slice |
| `CROSS_SLICE_FALLBACK_UNTRACEABLE` | warning | Approved fallback field has no explicit fallback name |

### Comparison Statuses

| Status | Meaning |
|---|---|
| `accepted` | Normalized values match |
| `drift` | Values differ and are not formatting-only |
| `unsupported` | One or both values are in unsupported branch codes |
| `absent_optional` | Optional field is null/absent on one side |
| `formatting_only` | Values differ only in accepted format variants |

## DD Mapping Registry

Per-slice DD mapping lookups are registered at test time via:
- `registerDdMappingLookup(slice, hasDdMapping)` — checks if a field has a DD.csv entry
- `registerDdMappingResolver(slice, canonicalDdFieldName)` — resolves canonical DD field name
- `resetDdMappingRegistries()` — clears all registries for test isolation

Each slice's DD mapping module (`hasDdMapping`, `canonicalDdFieldName`) is imported
from the respective engine package and registered before reconciliation validation.

## Test Coverage

| Area | Test File | Tests |
|---|---|---|
| US1 shared fact drift | hardening-cross-slice-reconciliation.test.ts | inventory definition, accepted identifiers/forms, participant ID drift, form drift, trace metadata, absent_optional, repeated-run stability |
| US2 DD-first | hardening-cross-slice-reconciliation.test.ts | DD-first canonical semantics, DD mapping validation, synthetic missing DD, fallback contract-name preservation, fallback basis recording |
| US3 stability | hardening-cross-slice-reconciliation.test.ts | repeated-run byte-stability with drift, adapter-exclusion |
| US3 output-shape | hardening-output-shape.test.ts | comparison/finding payload key stability |
| US3 warning/error | hardening-warning-error-stability.test.ts | reconciliation finding payload stability across repeated runs |

## Boundary Preservation

- No new persistence tables, migrations, or seeds
- No new output adapters or business domains
- No raw source document reads, server calls, or network input
- DD mapping helpers unchanged across all three slices
- Existing BSRS, V1/VE, and valuation-listings regression tests pass unchanged
