# Data Model: Reconciliation Workbench Status Filtering

## FilterState

Display-only active filter selection for the workbench.

Fields:

- `status`: Active reconciliation status filter or the unfiltered value.
- `severity`: Active severity filter or the unfiltered value.
- `selected_sample_id`: Approved sample whose rows are being filtered.

Validation rules:

- Status must be unfiltered or one of the status values emitted by existing workbench rows.
- Severity must be unfiltered or one of the existing severity/none conventions emitted by existing workbench rows.
- Filter state must not create persistence records, output adapter rows, or lower source-layer writes.
- Filter state must not contain raw-source, URL, upload, hosted, or real-person data references.

State transitions:

- `unfiltered` -> `status filtered`: Display only rows matching the selected status.
- `unfiltered` -> `severity filtered`: Display only rows matching the selected severity where severity applies.
- `status/severity filtered` -> `combined filtered`: Display only rows satisfying both filters where severity applies.
- `filtered` -> `unfiltered`: Restore all rows for the selected approved sample in original deterministic order.
- `filtered` -> `sample changed`: Apply deterministic workbench display boundaries for the newly selected approved sample.

## FilterOption

Deterministic visible choice in the status or severity control.

Fields:

- `value`: Stable option value.
- `label`: Analyst-readable option label.
- `kind`: Status or severity.
- `ordering_key`: Stable ordering key.
- `row_count`: Count of rows matching this option for the selected approved sample.

Validation rules:

- Must be derived from existing row values for the selected approved sample or from the unfiltered state.
- Must sort deterministically.
- Must not invent status or severity names outside existing conventions.

## FilteredRowGroup

Visible subset of one row group after active filters are applied.

Fields:

- `group_name`: Reconciliation rows, Shared Facts, or Shared Values.
- `active_status`: Active status filter.
- `active_severity`: Active severity filter.
- `rows`: Matching rows in original deterministic order.
- `empty_state`: Deterministic message when no rows match.

Validation rules:

- Matching rows must preserve their original relative order.
- Empty-state message must not replace or mutate row evidence.
- Row trace details must remain available for visible rows.

## FilterSummary

Analyst-readable summary of current filter impact.

Fields:

- `selected_sample_id`: Approved sample id.
- `active_filters`: Status/severity filter labels.
- `visible_counts`: Row counts for reconciliation rows, Shared Facts, and Shared Values.
- `unfiltered_counts`: Original row counts for reconciliation rows, Shared Facts, and Shared Values.

Validation rules:

- Counts must be deterministic for repeated builds of the same selected sample and filters.
- Summary must not include real natural-person data.
