# Quickstart: Benefit Kernel Slice

## Goal

Verify the fifth executable PBGC engine slice: deterministic `benefit_kernel`
on top of the existing browser-side SQLite foundation, date-resolution slice,
service-resolution slice, compensation-resolution slice, and form-resolution
slice.

## Prerequisites

- Repository is on the active benefit-kernel feature branch.
- Existing browser app, sql.js foundation, date-resolution slice,
  service-resolution slice, compensation-resolution slice, and form-resolution
  slice are present.
- Existing committed v0.1.0 contracts, schemas, migrations, seeds, mappings,
  templates, and benefit-kernel test cases are present.

## Validation Flow

1. Start the browser app locally after implementation.
2. Confirm the existing sql.js foundation initializes from packaged static
   assets.
3. Apply or reuse the committed SQLite migrations and seeds already used by the
   prior slices.
4. Load fixture rows from `packages/tests/benefit_kernel_test_cases_v0.1.0.csv`.
5. For each fixture, create or select a reviewed `benefit_kernel` input packet
   that includes upstream date, service, compensation, and form output groups.
6. Run only the `benefit_kernel` module.
7. Verify persisted outputs:
   - one `engine_run` row per attempt
   - one `benefit_kernel_output` row per successful fixture
   - benefit fields populated or explicitly null according to expected fixture
     values
   - no V1/VE, valuation listing, BSRS, or other output-adapter rows generated
     by this slice
   - `module_trace` rows for each populated benefit-kernel quantity and warning
     path
8. Verify expected fixture outputs for termination monthly benefit, XRD monthly
   benefit, and termination present value.
9. Re-run the same packet five times and verify populated values and trace
   decisions remain identical except generated identifiers and timestamps.
10. Attempt invalid packets and verify they fail before writing
    `benefit_kernel_output`.
11. Run date-resolution, service-resolution, compensation-resolution, and
    form-resolution regression tests to confirm prior slices still pass.

## Out of Scope Checks

Do not run V1/VE output, valuation listings, BSRS configuration, or other
output-adapter logic in this slice.

## Completion Criteria

- Existing benefit-kernel fixtures pass.
- Invalid benefit-kernel packet checks are blocked with structured errors.
- Trace exists for every populated kernel output.
- Warning-bearing unsupported branch paths preserve explicit null output values.
- Existing date-resolution, service-resolution, compensation-resolution, and
  form-resolution tests still pass.
- No network connection is required for deterministic execution.
- Static build output is committed when implementation changes runtime assets.
