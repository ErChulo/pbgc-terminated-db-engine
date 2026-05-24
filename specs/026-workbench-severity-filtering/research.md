# Research: Reconciliation Workbench Severity Filtering

## Decision: Extend existing display-only workbench filter state

**Rationale**: Severity filtering is a review aid over already-built reconciliation rows, Shared Facts rows, and Shared Values rows. Keeping severity state beside the existing status filter preserves deterministic browser behavior and avoids new persistence, calculation, adapter, or source-layer responsibilities.

**Alternatives considered**:

- Add a new reconciliation module: Rejected because filtering does not calculate or reconcile new facts.
- Add adapter-specific filter state: Rejected because the filter applies to workbench display rows across existing adapters and must not write adapter rows.

## Decision: Derive severity options from existing row values and none/not-applicable conventions

**Rationale**: The spec requires no invented severity names. Deriving options from selected sample rows keeps choices deterministic and aligned with existing row evidence, including Shared Facts none/error conventions.

**Alternatives considered**:

- Hard-code a fixed global severity list: Rejected because approved samples may expose different severity sets.
- Allow free-form severity entry: Rejected because it would violate the approved-input and deterministic-boundary rules.

## Decision: Apply combined filters as a deterministic display projection

**Rationale**: Status filtering already narrows visible rows. Severity filtering should compose with that projection so visible rows satisfy both filters where severity applies, while preserving original relative ordering and trace details.

**Alternatives considered**:

- Re-sort rows after filtering: Rejected because the workbench already relies on stable deterministic ordering.
- Rebuild output adapter data for filtered rows: Rejected because filtering is display-only and must not add adapter writes.

## Decision: Keep empty states display-only and deterministic

**Rationale**: Empty states are expected UI feedback, not structured engine warnings/errors. They should identify the affected row group and active filters without changing row evidence or traceability records.

**Alternatives considered**:

- Emit structured engine warnings for empty filter results: Rejected because filtering does not change deterministic engine output.
- Hide empty row groups: Rejected because analysts need stable workbench context and visible table structure.
