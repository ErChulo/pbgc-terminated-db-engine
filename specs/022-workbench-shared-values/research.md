# Research: Reconciliation Workbench Shared Values

## Decision: Keep The Increment Presentation-Only

**Rationale**: The approved spec scopes the work to the existing browser
workbench page and requires preserving existing contracts, output adapters,
browser-only sql.js boundaries, existing Shared Facts behavior, and
deterministic slice behavior. Presenting existing shared-value reconciliation
records through a clearer table satisfies the analyst need without touching
calculation modules or persistence.

**Alternatives considered**:

- Add a new shared-value output adapter: rejected because the feature is a
  workbench display increment and explicitly excludes new output adapters.
- Persist Shared Values table rows in SQLite: rejected because the rows are
  derived display projections over existing deterministic evidence and do not
  need new storage.

## Decision: Use Existing Shared-Value Reconciliation Evidence

**Rationale**: Existing shared-value comparison records already contain the
required raw values, normalized values, status, severity, mapping basis, rule
version, producing module, and source paths. The workbench should project this
evidence into analyst-readable rows without recalculating statuses.

**Alternatives considered**:

- Recompute normalized values in the page layer: rejected because it duplicates
  deterministic helper behavior and risks display drift.
- Use only existing combined reconciliation rows: rejected because they omit
  normalized values and selected value-level basis metadata needed by analysts.

## Decision: Preserve All Existing Value Classifications

**Rationale**: Shared-value records distinguish agreement, blocking mismatch,
non-blocking warning, accepted nullable, unsupported, and formatting-only
states. The UI should translate these into readable labels while preserving the
underlying status semantics.

**Alternatives considered**:

- Collapse all outcomes into agreement/drift: rejected because nullable,
  unsupported, warning, and formatting-only outcomes would lose review meaning.
- Rename statuses to new business categories: rejected because it would create
  a second semantic layer not backed by current reconciliation contracts.

## Decision: Use Intentional Absence Markers

**Rationale**: Some rows may not have an applicable normalized value or
non-info severity. Displaying an explicit marker prevents analysts from
mistaking blank cells for rendering defects or missing data.

**Alternatives considered**:

- Leave cells blank: rejected because blank cells are ambiguous in review.
- Substitute zero or false-like values: rejected because those values would
  misrepresent evidence.

## Decision: Deterministic Ordering Comes From Stable Comparison Keys

**Rationale**: The table must remain stable across repeated loads. Existing
comparison records expose stable identifiers and rule keys, so ordering should
be derived from those stable values rather than render timing.

**Alternatives considered**:

- Preserve whatever order arrives from rendering: rejected because the plan
  needs a deterministic ordering rule.
- Sort by displayed label only: rejected because labels may be less unique than
  rule keys and comparison identifiers.
