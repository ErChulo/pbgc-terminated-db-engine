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

All user stories (US1 function/PrintCriteria, US2 field references, US3 block
patterns) use these committed artifacts in tests and pass their reviewed
contents into pure `bsrs_configuration_output` semantic-validation helpers.

## Checks (All User Stories — Complete)

1. ✅ Validate every approved sample function reference against the approved
   Statement Authoring function list.
2. ✅ Validate PrintCriteria expressions for supported functions, balanced quoted
   text, and recognized field/control tokens.
3. ✅ Validate referenced fields against approved sample fields, existing BSRS/V1
   semantics, DD-backed fields where available, and approved fallback names.
4. ✅ Validate approved statement and recalculation block patterns.
5. ✅ Validate approved optional-form row families for single-life,
   single-and-joint, and QPSA/QDRO samples.
6. ✅ Confirm semantic validation findings are deterministic across repeated runs.
7. ✅ Confirm successful existing `bsrs_configuration_output` behavior remains
   unchanged.
8. ✅ Confirm semantic validation helpers are NOT wired into runBsrsConfiguration (test-time only).

## Test Commands

```bash
# Run all semantic hardening tests
npx vitest run packages/tests/hardening-bsrs-*.test.ts

# Run full BSRS regression suite
npx vitest run packages/tests/bsrs-configuration-output-*.test.ts

# Run full test suite
npm test
```

## Expected Outcomes (All Verified)

- ✅ Unsupported functions are reported as structured errors.
- ✅ Malformed PrintCriteria quote structure is reported as a structured error.
- ✅ Unknown field-like tokens are reported as structured errors unless approved by
  the sample semantics or existing field vocabulary.
- ✅ Approved statement, recalculation, and optional-form block patterns remain
  stable.
- ✅ Existing BSRS output contracts, browser-only sql.js boundaries, and adapter
  behavior remain unchanged.
- ✅ Semantic validation is test-time only; runBsrsConfiguration does not import
  semantic validation helpers.
