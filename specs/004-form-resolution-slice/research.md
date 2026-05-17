# Research: Form Resolution Slice

## Decision: Use the existing browser/sql.js foundation unchanged

**Rationale**: The first three executable slices already established a local
Vite runtime, sql.js database bootstrap, migrations, seeds, deterministic run
records, module trace persistence, and committed static build output. The form
slice can reuse this foundation without runtime architecture changes.

**Alternatives considered**:
- Add a separate server or calculation endpoint. Rejected by constitution and
  feature scope.
- Add new migrations for form outputs. Rejected because
  `sqlite_migration_0004_engine_outputs_v0.1.0.sql.txt` already defines
  `resolved_forms_output`.

## Decision: Add only `packages/engine/form-resolution/`

**Rationale**: The project uses modular deterministic packages by engine slice.
The fourth slice needs a package parallel to `date-resolution`,
`service-resolution`, and `compensation-resolution`, while benefit-kernel and
output-adapter packages remain out of scope.

**Alternatives considered**:
- Fold form logic into compensation or service resolution. Rejected because form
  state has its own versioned contract and trace semantics.
- Create benefit-kernel or output-adapter stubs. Rejected because the feature
  explicitly excludes those implementations except as referenced dependencies.

## Decision: Use committed form fixtures as the first executable rule path

**Rationale**: `packages/tests/form_resolution_test_cases_v0.1.0.csv` defines
three acceptance paths: single deferred vested participant, married participant
in pay, and QDRO separate-interest path. These provide a deterministic MVP
without expanding into full survivor, contribution, or PBGC policy override
behavior.

**Alternatives considered**:
- Implement all QPSA, death, contribution, and PBGC override behaviors
  immediately. Rejected for this slice because the fixture set and executable
  target are narrower; future versions can expand controlled behavior after
  contract review.
- Treat blank expected fixture fields as empty codes. Rejected because the
  contract distinguishes explicit null from populated form output values.

## Decision: Persist form values in `resolved_forms_output`

**Rationale**: The migration and schema blueprint identify
`resolved_forms_output` as the output table for `form_resolution`. Form runs
should populate only resolved form status fields and trace rows, without
calculating benefits or generating downstream outputs.

**Alternatives considered**:
- Store form values in the service-and-compensation table. Rejected because the
  existing schema has a dedicated `resolved_forms_output` table.
- Add a new form output table. Rejected because existing migrations already
  contain the required output columns.

## Decision: Trace every populated form output and warning

**Rationale**: The constitution and form contract require traceability for each
computed output, warning, and blocking error. Trace rows should record module
name, module version, rule version, input packet, reviewed fields, rule branch,
and branch indicators for current-pay, QDRO, QPSA, death, lump-sum,
contribution, and PBGC policy logic.

**Alternatives considered**:
- Record trace only at run level. Rejected because reviewers need field-level
  support for each populated output.
- Omit trace for null form fields. Accepted for null fields, but warning paths
  still need a visible warning or run-level note.

## Decision: Keep prior date, service, and compensation slices as regression dependencies

**Rationale**: Form resolution builds on the implemented foundation but should
not regress prior executable slices. Prior tests should remain part of full
validation, while form calculation should require only an active reviewed form
packet unless a future contract adds a hard dependency.

**Alternatives considered**:
- Require completed date, service, and compensation runs before form can
  execute. Rejected for this v0.1.0 slice because the form contract does not
  require prior module outputs as execution preconditions.
