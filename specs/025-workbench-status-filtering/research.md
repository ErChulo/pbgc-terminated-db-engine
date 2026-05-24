# Research: Reconciliation Workbench Status Filtering

## Decision: Treat filters as display-only workbench state

**Rationale**: The feature is scoped to the existing browser workbench page. Filters should derive visible row subsets from already-built reconciliation rows, Shared Facts rows, and Shared Values rows without modifying calculations, sample selection, output adapters, persistence, or lower source layers.

**Alternatives considered**:

- Persist active filters in a new table: rejected because filtering is navigation/display state only.
- Recompute cross-slice reconciliation for each filter: rejected because existing rows already contain the needed status, severity, and trace data.
- Add adapter-specific filtering behavior: rejected because no new output adapters or adapter writes are in scope.

## Decision: Derive filter choices from existing row vocabularies

**Rationale**: Existing row status values and severity labels are the approved vocabulary for this workbench. Filter choices should include the unfiltered option plus values already present in the selected sample's rows, preserving deterministic ordering and avoiding invented status or severity names.

**Alternatives considered**:

- Hard-code every possible status/severity regardless of sample: rejected because empty choices may distract analysts and require extra unsupported-state handling.
- Allow free-form filter text: rejected because the feature requires deterministic approved-row filtering and no ad hoc analyst-entered sample data.

## Decision: Preserve row order by filtering existing sorted arrays

**Rationale**: Prior slices already established deterministic row ordering. Filtering should remove nonmatching rows while preserving the relative order of matching rows so clearing filters returns the exact original order.

**Alternatives considered**:

- Sort filtered results by status or severity: rejected because it changes the established row order and weakens repeated-render stability.
- Group filtered results by table section dynamically: rejected because the existing row groups are already meaningful to analysts.

## Decision: Use row-group empty states instead of hiding tables

**Rationale**: When a filter matches no rows, analysts still need to know the row group was evaluated. A deterministic empty-state message preserves context and avoids making panels appear broken or missing.

**Alternatives considered**:

- Hide empty row groups: rejected because it can make analysts think the section failed to render.
- Insert synthetic comparison rows: rejected because that would blur display state with row evidence.
