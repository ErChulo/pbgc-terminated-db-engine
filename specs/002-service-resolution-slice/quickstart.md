# Quickstart: Service Resolution Slice

## Goal

Verify the second executable PBGC engine slice: deterministic `service_resolution`
on top of the existing browser-side SQLite foundation and date-resolution MVP.

## Prerequisites

- Repository is on branch `002-service-resolution-slice`.
- Existing browser app, sql.js foundation, and date-resolution MVP are present.
- Existing committed v0.1.0 contracts, schemas, migrations, seeds, mappings, and
  service-resolution test cases are present.

## Validation Flow

1. Start the browser app locally after implementation.
2. Confirm the existing sql.js foundation initializes from packaged static
   assets.
3. Apply or reuse the committed SQLite migrations and seeds already used by the
   first slice.
4. Load fixture rows from `packages/tests/service_resolution_test_cases_v0.1.0.csv`.
5. For each fixture, create or select a reviewed `service_resolution` input
   packet.
6. Run only the `service_resolution` module.
7. Verify persisted outputs:
   - one `engine_run` row per attempt
   - one `resolved_service_comp_output` row per successful fixture
   - service columns populated and compensation columns left null
   - `module_trace` rows for each populated service quantity
8. Verify expected fixture outputs for eligibility, vesting, benefit, and accrual
   service.
9. Re-run the same packet five times and verify resolved values and trace
   decisions remain identical except generated identifiers and timestamps.
10. Attempt invalid packets and verify they fail before writing
    `resolved_service_comp_output`.
11. Run date-resolution regression tests to confirm the first slice still passes.

## Out of Scope Checks

Do not run compensation resolution, form resolution, benefit kernel, V1/VE
output, valuation listings, or BSRS configuration in this slice.

## Completion Criteria

- Existing service-resolution fixtures pass.
- Invalid service packet checks are blocked with structured errors.
- Trace exists for every populated service output.
- Existing date-resolution tests still pass.
- No network connection is required for deterministic execution.
- Static build output is committed when implementation changes runtime assets.
