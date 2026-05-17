# Research: Benefit Kernel Slice

## Decision: Use the existing browser/sql.js foundation unchanged

**Rationale**: The first four executable slices already established a local
Vite runtime, sql.js database bootstrap, migrations, seeds, deterministic run
records, module trace persistence, and committed static build output. The
benefit-kernel slice can reuse this foundation without runtime architecture
changes.

**Alternatives considered**:
- Add a server or actuarial calculation endpoint. Rejected by constitution and
  feature scope.
- Add new migrations for kernel outputs. Rejected because
  `sqlite_migration_0004_engine_outputs_v0.1.0.sql.txt` already defines
  `benefit_kernel_output`.

## Decision: Add only `packages/engine/benefit-kernel/`

**Rationale**: The project uses modular deterministic packages by engine slice.
The fifth slice needs a package parallel to `date-resolution`,
`service-resolution`, `compensation-resolution`, and `form-resolution`, while
output-adapter packages remain out of scope.

**Alternatives considered**:
- Fold kernel logic into form or compensation resolution. Rejected because
  benefit calculations have their own versioned contract and output table.
- Create V1/VE, valuation, or BSRS adapter stubs. Rejected because the feature
  explicitly excludes those implementations except as referenced dependencies.

## Decision: Use committed benefit-kernel fixtures as the first executable rule path

**Rationale**: `packages/tests/benefit_kernel_test_cases_v0.1.0.csv` defines
three acceptance paths. BK001 provides the supported deterministic calculation
for monthly benefit and present value. BK002 and BK003 exercise unsupported
integrated and QPSA branches where expected outputs are blank; the MVP should
emit explicit nulls and warnings rather than inventing fallback calculations.

**Alternatives considered**:
- Implement all controlled benefit families immediately. Rejected because the
  executable slice is bounded to the existing fixture set and needs traceable
  behavior before expanding into broader actuarial branches.
- Treat blank expected fixture fields as zero. Rejected because the project
  distinguishes explicit nulls from computed zeros.

## Decision: Persist kernel values in `benefit_kernel_output`

**Rationale**: The migration and schema blueprint identify
`benefit_kernel_output` as the output table for `benefit_kernel`. Kernel runs
should populate only deterministic benefit fields and trace rows, without
creating downstream adapter outputs.

**Alternatives considered**:
- Store benefit values in prior service/compensation or form output tables.
  Rejected because the existing schema has a dedicated kernel output table.
- Add a new benefit output table. Rejected because existing migrations already
  contain the required output columns.

## Decision: Trace every populated benefit-kernel output and warning

**Rationale**: The constitution and kernel contract require traceability for
computed outputs, warnings, and blocking errors. Trace rows should record module
name, module version, rule version, input packet, upstream deterministic output
references, reviewed fields, rule branch, limitation indicators, present-value
factor assumptions, and warning context.

**Alternatives considered**:
- Record trace only at run level. Rejected because reviewers need field-level
  support for each populated benefit output.
- Omit trace for explicit null fields. Accepted for null fields, but warning
  paths still need visible warning or run-level note.

## Decision: Keep output adapters as regression-excluded downstream consumers

**Rationale**: V1/VE, valuation listings, BSRS configuration, and other
adapters depend on kernel outputs but must not recalculate or produce
deliverables in this slice. The kernel implementation should verify that no
adapter outputs are created.

**Alternatives considered**:
- Generate adapter-ready rows during kernel execution. Rejected because that
  would implement output-adapter behavior before the adapter slices are scoped.
- Ignore adapter contracts entirely. Rejected because the kernel must preserve
  downstream-compatible values without executing downstream modules.

## Decision: Keep prior date, service, compensation, and form slices as regression dependencies

**Rationale**: Benefit kernel builds on the implemented foundation and uses
upstream deterministic outputs in the packet. Prior tests should remain part of
full validation, while kernel calculation should require only an active
reviewed kernel packet that carries the reviewed upstream state required by the
contract.

**Alternatives considered**:
- Re-run upstream modules inside the kernel. Rejected because modules must have
  deterministic boundaries and no hidden side effects.
- Allow missing upstream output fields when fixture inputs are present.
  Rejected because the kernel contract requires upstream deterministic output
  families.
