# Research: Date Resolution Slice

## Decision: Use Vite and sql.js as a fully static browser runtime

**Rationale**: The constitution requires a browser-only application with no
server calls. The existing architecture note `vite_sqljs_bootstrap_v0.1.0.ts.txt`
already defines the sql.js initialization pattern, database export, and query
helpers expected by this repository.

**Alternatives considered**:
- Server-backed SQLite: rejected because server calls violate the constitution.
- IndexedDB-only persistence: rejected for this slice because existing committed
  migrations and seeds target SQLite/sql.js.
- Remote WASM/CDN loading: rejected because deterministic runtime assets must be
  packaged with the static app.

## Decision: Apply existing v0.1.0 migrations and seeds as the database baseline

**Rationale**: The feature explicitly requires use of committed migrations and
seeds. `sqlite_migration_0001_v0.1.0.sql.txt` creates `engine_run`,
`resolved_dates_output`, and `module_trace`; `sqlite_migration_0003` creates
`engine_input_packet`; `sqlite_migration_0002` and `seed_reference_tables` load
field/rule registries; `seed_case_shell` provides a minimal case shell.

**Alternatives considered**:
- Create new schema for this slice: rejected because it would duplicate existing
  v0.1.0 artifacts and weaken traceability.
- Apply only a hand-picked in-memory schema: rejected because it would not prove
  the browser-side SQLite foundation.

## Decision: Treat `date_resolution_contract_v0.1.0.md` as authoritative module scope

**Rationale**: The contract defines required input groups, conditional packets,
rule hierarchy, primary outputs, and supporting warning/trace outputs. The plan
does not reinterpret raw documents or unresolved assertions.

**Alternatives considered**:
- Infer additional date rules from source documents: rejected by the deterministic
  boundary.
- Implement downstream modules to consume dates immediately: rejected because the
  approved feature excludes service, compensation, form, benefit, and output
  adapters.

## Decision: Use existing CSV test cases as acceptance fixtures

**Rationale**: `packages/tests/date_resolution_test_cases_v0.1.0.csv` provides
three representative cases: deferred vested participant, in-pay participant, and
non-spouse beneficiary. These map directly to the spec's success criteria.

**Alternatives considered**:
- Postpone tests until downstream modules exist: rejected because this slice must
  be executable and reproducible on its own.
- Replace committed fixtures with new examples: rejected unless implementation
  finds a versioned contract defect.

## Decision: Persist trace through `module_trace` and run status tables

**Rationale**: The existing migration provides `engine_run` and `module_trace`,
which support calculation run identity, warning/error counts, rule applied,
input fields used, intermediate values, output value, and warning note. This
matches the constitution traceability requirement without adding a new table.

**Alternatives considered**:
- Store trace only in UI memory: rejected because outputs must be reviewable and
  reproducible from persisted local data.
- Store trace only as JSON inside output rows: rejected because existing schema
  already separates module trace for queryability.

## Decision: Represent blocked execution as failed `engine_run` with structured errors

**Rationale**: Existing `engine_run.run_status` supports `failed` and has
`error_count`. Implementation can pair failed runs with module trace or a local
structured error collection while ensuring no `resolved_dates_output` row is
created for invalid packets.

**Alternatives considered**:
- Silently skip invalid fields: rejected by the constitution.
- Create resolved output rows with partial invalid data: rejected because invalid
  packets must not produce authoritative outputs.
