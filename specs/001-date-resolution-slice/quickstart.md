# Quickstart: Date Resolution Slice

## Goal

Verify the first executable PBGC engine slice: browser-side SQLite foundation
plus deterministic `date_resolution` output with trace.

## Prerequisites

- Repository is on branch `001-date-resolution-slice`.
- Existing committed v0.1.0 contracts, schemas, migrations, seeds, mappings, and
  date-resolution test cases are present.
- Dependencies are installed for the Vite/sql.js browser app once implementation
  tasks create package files.

## Validation Flow

1. Start the browser app locally after implementation.
2. Confirm sql.js initializes from packaged static assets.
3. Apply committed SQLite migrations and seeds in order:
   - `packages/db/migrations/sqlite_migration_0001_v0.1.0.sql.txt`
   - `packages/db/migrations/sqlite_migration_0002_reference_tables_v0.1.0.sql.txt`
   - `packages/db/migrations/sqlite_migration_0003_engine_packets_v0.1.0.sql.txt`
   - `packages/db/migrations/sqlite_migration_0004_engine_outputs_v0.1.0.sql.txt`
   - `packages/db/seeds/seed_case_shell_v0.1.0.sql.txt`
   - `packages/db/seeds/seed_reference_tables_v0.1.0.sql.txt`
4. Load fixture rows from `packages/tests/date_resolution_test_cases_v0.1.0.csv`.
5. For each fixture, create or select a reviewed `date_resolution` input packet.
6. Run only the `date_resolution` module.
7. Verify persisted outputs:
   - one `engine_run` row per attempt
   - one `resolved_dates_output` row per successful fixture
   - `module_trace` rows for each populated resolved date
8. Verify expected fixture outputs for `nrd`, `erd`, `rbd`, `xra`, and `xrd`.
9. Re-run the same packet five times and verify resolved values and trace
   decisions remain identical except generated identifiers and timestamps.
10. Attempt invalid packets and verify they fail before writing
    `resolved_dates_output`.

## Out of Scope Checks

Do not run service resolution, compensation resolution, form resolution, benefit
kernel, V1/VE output, valuation listings, or BSRS configuration in this slice.

## Completion Criteria

- Existing date-resolution fixtures pass.
- Invalid packet checks are blocked with structured errors.
- Trace exists for every populated resolved date.
- No network connection is required for deterministic execution.
- Static build output is committed when implementation changes runtime assets.
