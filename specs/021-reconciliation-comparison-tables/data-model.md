# Data Model: Reconciliation Workbench Comparison Tables

## Comparison Table Source

The display-only source bundle used to populate both comparison tables.

**Fields**

- `sample_id`
- `sample_label`
- `generated_at`
- `shared_fact_comparisons`
- `shared_value_comparisons`
- `mocked_display_context`

**Validation Rules**

- Must be derived only from approved committed sample artifacts, existing
  deterministic outputs, existing reconciliation evidence, DD/fallback mapping
  metadata, and mocked display labels.
- Must not read raw OCR, raw documents, emails, images, PDFs, unreviewed
  extraction output, hosted services, runtime network input, uncommitted files,
  or real natural-person data.
- Must remain deterministic across repeated loads of the same fixed sample.

## Shared-Fact Table Row

One visible fact-level comparison across two existing output slices.

**Fields**

- `comparison_id`
- `fact_label`
- `status`
- `severity`
- `left_source`
- `left_field`
- `left_value`
- `right_source`
- `right_field`
- `right_value`
- `mapping_basis`
- `ordering_key`

**Validation Rules**

- Must show both compared sources, fields, and values.
- Must preserve the existing shared-fact status without recalculation.
- Severity may be absent only for non-error/non-warning statuses and must be
  displayed as an intentional absence marker.
- Must sort by a stable key derived from the comparison identifier and rule or
  fact key.
- Must not mutate deterministic output rows or output-adapter rows.

## Shared-Value Table Row

One visible value-level comparison across two existing output slices.

**Fields**

- `comparison_id`
- `value_label`
- `status`
- `severity`
- `left_source`
- `left_field`
- `left_value`
- `left_normalized_value`
- `right_source`
- `right_field`
- `right_value`
- `right_normalized_value`
- `value_type`
- `mapping_basis`
- `required_or_nullable_basis`
- `ordering_key`

**Validation Rules**

- Must show both raw compared values.
- Must show normalized values when available.
- Must display a clear absence marker when normalization is not applicable.
- Must preserve existing agreement, drift, warning, nullable, unsupported, and
  formatting-only classifications.
- Must sort by a stable key derived from the comparison identifier and rule key.

## Comparison Status Display

The analyst-readable presentation of an existing reconciliation classification.

**Fields**

- `status`
- `status_label`
- `severity`
- `severity_label`
- `display_classification`

**Validation Rules**

- Must not invent new status meanings.
- Must distinguish agreement from drift and preserve warnings, nullable,
  unsupported, and formatting-only statuses.
- Must show severity when present and a clear intentional absence marker when
  severity is not applicable.

## Mocked Display Context

The simulated case or population context already allowed for the workbench.

**Fields**

- `fixed_sample_label`
- `mock_case_label`
- `mock_population_label`
- `no_real_person_data_notice`

**Validation Rules**

- Must be clearly marked as mocked or simulated.
- Must not include real participant, beneficiary, alternate payee, survivor, or
  other natural-person data.
- Must not affect comparison status, ordering, or output values.
