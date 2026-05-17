# Research: Compensation Resolution Slice

## Decision: Use the existing browser/sql.js foundation unchanged

**Rationale**: The first two executable slices already established a local Vite
runtime, sql.js database bootstrap, migrations, seeds, deterministic run
records, module trace persistence, and committed static build output. The
compensation slice can reuse this foundation without schema or runtime
architecture changes.

**Alternatives considered**:
- Add a separate storage table for compensation outputs. Rejected because
  `sqlite_migration_0004_engine_outputs_v0.1.0.sql.txt` already defines the
  shared `resolved_service_comp_output` table for service and compensation
  outputs.
- Add a server-side calculation endpoint. Rejected by constitution and feature
  scope.

## Decision: Add only `packages/engine/compensation-resolution/`

**Rationale**: The project uses modular deterministic packages by engine slice.
The third slice needs a package parallel to `date-resolution` and
`service-resolution`, while downstream form, benefit-kernel, and output-adapter
packages remain out of scope.

**Alternatives considered**:
- Fold compensation logic into `service-resolution`. Rejected because
  compensation has its own versioned contract and trace semantics.
- Create form or benefit-kernel stubs. Rejected because the feature explicitly
  excludes those implementations except as referenced dependencies.

## Decision: Use committed compensation fixtures as the first executable rule path

**Rationale**: `packages/tests/compensation_resolution_test_cases_v0.1.0.csv`
defines three acceptance paths: final average pay, integrated covered
compensation, and frozen benefit support. These provide a deterministic MVP
without expanding into full payroll-history recomputation.

**Alternatives considered**:
- Implement all compensation-history and cap behaviors immediately. Rejected for
  this slice because the fixture set and executable target are narrower; future
  versions can expand controlled behavior after contract review.
- Treat blank expected fixture fields as zero. Rejected because the contract
  distinguishes explicit null from numeric compensation values.

## Decision: Persist compensation values in `resolved_service_comp_output`

**Rationale**: The migration and schema blueprint identify
`resolved_service_comp_output` as the shared output of service and compensation
resolution. Compensation runs should populate compensation columns and preserve
service columns when updating a shared subject/run output context.

**Alternatives considered**:
- Write a second compensation-only row that leaves service columns null.
  Rejected as the default plan because FR-013 requires preserving the shared
  service-and-compensation output record pattern.
- Add a new migration for compensation. Rejected because existing migrations
  already contain the required output columns.

## Decision: Trace every populated compensation output and warning

**Rationale**: The constitution and compensation contract require traceability
for each computed output, warning, and blocking error. Trace rows should record
module name, module version, rule version, input packet, reviewed fields, rule
branch, and branch indicators for override/history/covered compensation/cap/
freeze/PIA logic.

**Alternatives considered**:
- Record trace only at run level. Rejected because reviewers need field-level
  support for each populated output.
- Omit trace for null frozen-support outputs. Rejected for warning paths; null
  outputs still need a visible warning or run-level note.

## Decision: Keep prior date and service slices as regression dependencies

**Rationale**: Compensation builds on the implemented foundation but should not
regress prior executable slices. Date and service tests should remain part of
full validation, while compensation calculation should require only an active
reviewed compensation packet unless a future contract adds a hard dependency.

**Alternatives considered**:
- Require a completed service run before compensation can execute. Rejected for
  this v0.1.0 slice because the compensation contract does not require prior
  service output as an execution precondition.
