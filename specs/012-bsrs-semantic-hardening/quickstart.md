# Quickstart: BSRS Semantic Hardening

## Purpose

Use this feature to validate that `bsrs_configuration_output` remains aligned
with approved BSRS Statement Authoring semantics and approved sample
configuration patterns.

## Validation Sources

- `artifacts/guidance/bsrs/statement-authoring/BSRS functions.txt`
- `artifacts/reference/approved-samples/bsrs-config/base-data/`
- `artifacts/reference/approved-samples/bsrs-config/statements/`
- `artifacts/reference/approved-samples/bsrs-config/recalculations/`
- `artifacts/reference/approved-samples/bsrs-config/optional-forms/`

The US1 MVP reads these committed artifacts in tests and passes their reviewed
contents into pure `bsrs_configuration_output` semantic-validation helpers.

## Checks

1. Validate every approved sample function reference against the approved
   Statement Authoring function list.
2. Validate PrintCriteria expressions for supported functions, balanced quoted
   text, and recognized field/control tokens.
3. Validate referenced fields against approved sample fields, existing BSRS/V1
   semantics, DD-backed fields where available, and approved fallback names.
4. Validate approved statement and recalculation block patterns.
5. Validate approved optional-form row families for single-life,
   single-and-joint, and QPSA/QDRO samples.
6. Confirm semantic validation findings are deterministic across repeated runs.
7. Confirm successful existing `bsrs_configuration_output` behavior remains
   unchanged.

## Expected Outcomes

- Unsupported functions are reported as structured errors.
- Malformed PrintCriteria quote structure is reported as a structured error.
- Unknown field-like tokens are reported as structured errors unless approved by
  the sample semantics or existing field vocabulary.
- Approved statement, recalculation, and optional-form block patterns remain
  stable.
- Existing BSRS output contracts, browser-only sql.js boundaries, and adapter
  behavior remain unchanged.
