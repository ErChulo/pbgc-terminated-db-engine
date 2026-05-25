# Data Model: Reconciliation Workbench Severity Filtering

## SeverityFilterState

Display-only active severity filter selection for the workbench.

Fields:

- `severity`: Active severity filter or the unfiltered value.
- `status`: Existing active status filter that may combine with severity filtering.
- `selected_sample_id`: Approved sample whose rows are being filtered.

Validation rules:

- Severity must be unfiltered or one of the severity/none conventions emitted by existing workbench rows for the selected sample.
- Status must continue to use existing status filter values.
- Filter state must not create persistence records, output adapter rows, or lower source-layer writes.
- Filter state must not contain raw-source, URL, upload, hosted, or real-person data references.

State transitions:

- `unfiltered` -> `severity filtered`: Display only rows matching the selected severity where severity applies.
- `status filtered` -> `combined filtered`: Display only rows satisfying both the selected status and selected severity where severity applies.
- `combined filtered` -> `status filtered`: Clearing severity restores rows allowed by the current status filter in original deterministic order.
- `filtered` -> `sample changed`: Apply deterministic approved-sample display boundaries for the newly selected sample.

## SeverityFilterOption

Deterministic visible choice in the severity control.

Fields:

- `value`: Stable severity option value.
- `label`: Analyst-readable option label.
- `kind`: Severity.
- `ordering_key`: Stable ordering key.
- `row_count`: Count of rows matching this severity for the selected approved sample.

Validation rules:

- Must be derived from existing row severity values or none/not-applicable conventions for the selected sample.
- Must sort deterministically.
- Must not invent severity names outside existing conventions.

## FilteredWorkbenchRowGroup

Visible subset of one row group after active status and severity filters are applied.

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
- Rows without applicable severity must follow existing none/not-applicable conventions.

## FilterSummary

Analyst-readable summary of current filter impact.

Fields:

- `selected_sample_id`: Approved sample id.
- `active_filters`: Status and severity filter labels.
- `visible_counts`: Row counts for reconciliation rows, Shared Facts, and Shared Values.
- `unfiltered_counts`: Original row counts for reconciliation rows, Shared Facts, and Shared Values.

Validation rules:

- Counts must be deterministic for repeated builds of the same selected sample and filters.
- Summary must not include real natural-person data.
