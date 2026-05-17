# Research: BSRS Configuration Output

## Decision 1: Reuse the existing browser/sql.js persistence stack

- **Decision**: Implement the BSRS slice as a browser-only deterministic adapter
  on top of the existing sql.js database, committed migrations, and engine run
  tables.
- **Rationale**: The repository constitution requires static browser execution,
  committed artifacts, and deterministic persistence.
- **Alternatives considered**: A server-backed adapter or external calculation
  service. Both were rejected because they violate the browser-only and
  no-server-call constraints.

## Decision 2: Treat BSRS guidance and PBGC templates as committed reference artifacts

- **Decision**: Use the committed BSRS guidance and official PBGC deliverable
  templates already in the repository as the authoritative format references
  for the output adapter.
- **Rationale**: The feature spec requires the adapter to target existing
  repository artifacts, and the constitution requires committed static
  deliverables.
- **Alternatives considered**: Reconstructing the deliverable format from
  memory or external sources. That would make the adapter less auditable and
  would weaken traceability.

## Decision 3: Use `artifacts/mappings/DD.csv` as the canonical naming layer

- **Decision**: Resolve BSRS field names through `artifacts/mappings/DD.csv`
  first whenever a matching Data Dictionary field exists.
- **Rationale**: The spec and constitution emphasize traceable, layered naming
  semantics and repository-wide consistency.
- **Alternatives considered**: Directly emitting contract field names only, or
  keeping multiple naming layers in the adapter. Those choices would make trace
  review harder and increase the risk of naming drift.

## Decision 4: Persist BSRS output through the existing output-adapter schema

- **Decision**: Reuse the existing `bsrs_configuration_output_row` table and
  `module_trace` table for successful runs and structured validation output.
- **Rationale**: The migration and schema already define the persistence shape
  needed by this slice.
- **Alternatives considered**: Creating a new table family for BSRS. That would
  duplicate the existing adapter storage contract and introduce unnecessary
  schema churn.

## Decision 5: Keep the slice purely deterministic

- **Decision**: The adapter must not recalculate benefit values or invent
  fallback values. It only projects reviewed inputs and upstream outputs.
- **Rationale**: The constitution draws a strict boundary between deterministic
  engine outputs and output adapters.
- **Alternatives considered**: Calculating statement content inside the adapter.
  That would blur the modular actuarial contract and reduce reviewability.
