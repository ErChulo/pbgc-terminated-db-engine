# Quickstart: Compensation Resolution Slice

## Goal

Verify the third executable PBGC engine slice: deterministic
`compensation_resolution` on top of the existing browser-side SQLite foundation,
date-resolution slice, and service-resolution slice.

## Prerequisites

- Repository is on branch `003-compensation-resolution-slice`.
- Existing browser app, sql.js foundation, date-resolution slice, and
  service-resolution slice are present.
- Existing committed v0.1.0 contracts, schemas, migrations, seeds, mappings,
  templates, and compensation-resolution test cases are present.

## Validation Flow

1. Start the browser app locally after implementation.
2. Confirm the existing sql.js foundation initializes from packaged static
   assets.
3. Apply or reuse the committed SQLite migrations and seeds already used by the
   prior slices.
4. Load fixture rows from
   `packages/tests/compensation_resolution_test_cases_v0.1.0.csv`.
5. For each fixture, create or select a reviewed `compensation_resolution` input
   packet.
6. Run only the `compensation_resolution` module.
7. Verify persisted outputs:
   - one `engine_run` row per attempt
   - one compensation-bearing `resolved_service_comp_output` row per successful
     fixture
   - compensation columns populated or explicitly null according to expected
     fixture values
   - service columns preserved when a service output row is present
   - `module_trace` rows for each populated compensation quantity and warning
     path
8. Verify expected fixture outputs for compensation, average compensation, and
   covered compensation.
9. Re-run the same packet five times and verify resolved values and trace
   decisions remain identical except generated identifiers and timestamps.
10. Attempt invalid packets and verify they fail before writing authoritative
    compensation values.
11. Run date-resolution and service-resolution regression tests to confirm prior
    slices still pass.

## Out of Scope Checks

Do not run form resolution, benefit kernel, V1/VE output, valuation listings, or
BSRS configuration in this slice.

## Completion Criteria

- Existing compensation-resolution fixtures pass.
- Invalid compensation packet checks are blocked with structured errors.
- Trace exists for every populated compensation output.
- Frozen-benefit support warnings are visible without fallback compensation
  values.
- Existing date-resolution and service-resolution tests still pass.
- No network connection is required for deterministic execution.
- Static build output is committed when implementation changes runtime assets.
