# Quickstart: BSRS Field Reference Hardening

## Purpose

Use this feature to validate that `bsrs_configuration_output` remains aligned
with approved BSRS field-reference semantics, DD.csv canonical naming, current
committed output fields, and approved no-DD fallback behavior.

## Validation Sources

- `artifacts/reference/approved-samples/bsrs-config/base-data/`
- `artifacts/reference/approved-samples/bsrs-config/statements/`
- `artifacts/reference/approved-samples/bsrs-config/recalculations/`
- `artifacts/reference/approved-samples/bsrs-config/optional-forms/`
- `artifacts/mappings/DD.csv`
- Current committed engine/output field names

The US1 MVP reads these committed artifacts in tests and passes their reviewed
contents into pure `bsrs_configuration_output` field-reference validation
helpers.

## Checks

1. Extract field-like tokens from approved BSRS sample configuration rows.
2. Ignore quoted narrative text, functions, operators, literals, and formatting
   or control markers.
3. Resolve matching fields through DD.csv first.
4. Resolve known current committed engine/output fields.
5. Preserve approved fallback behavior for sample-approved names without DD.csv
   mappings.
6. Emit deterministic structured findings for suspicious or orphan field
   references.
7. Confirm successful existing `bsrs_configuration_output` behavior remains
   unchanged.

## Expected Outcomes

- DD-backed field references resolve through Data Dictionary names.
- Approved no-DD fallback field references remain valid.
- Suspicious or orphan field-like tokens are reported as structured errors.
- Repeated validation runs produce stable finding payloads and ordering.
- Existing BSRS output contracts, browser-only sql.js boundaries, traces,
  persistence behavior, and adapter behavior remain unchanged.
