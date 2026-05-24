# Data Model: Reconciliation Workbench Shared Values

## Shared Values Source

The display-only source bundle used to populate the Shared Values table.

**Fields**

- `sample_id`
- `sample_label`
- `generated_at`
- `shared_value_comparisons`
- `mocked_display_context`

**Validation Rules**

- Must be derived only from approved committed sample artifacts, existing
  deterministic outputs, existing shared-value reconciliation evidence,
  DD/fallback mapping metadata, and mocked display labels.
- Must not read raw OCR, raw documents, emails, images, PDFs, unreviewed
  extraction output, hosted services, runtime network input, uncommitted files,
  or real natural-person data.
- Must remain deterministic across repeated loads of the same fixed sample.

## Shared-Value Table Row

One visible value-level comparison across two existing output slices.

**Fields**

- `comparison_id`
- `value_label`
- `status`
- `status_label`
- `severity`
- `severity_label`
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
- `normalization_basis`
- `ordering_key`
- `trace`

**Validation Rules**

- Must show both compared sources, fields, and raw values.
- Must show normalized values when available.
- Must display a clear absence marker when normalization or severity is not
  applicable.
- Must preserve existing agreement, drift, warning, nullable, unsupported, and
  formatting-only classifications.
- Must sort by a stable key derived from the comparison identifier and rule key.
- Must not mutate deterministic output rows, Shared Facts rows, or
  output-adapter rows.

## Normalized Value Display

The analyst-readable normalized value or intentional absence marker for one
side of a shared-value comparison.

**Fields**

- `raw_value`
- `normalized_value`
- `normalization_basis`
- `absence_marker`

**Validation Rules**

- Must preserve existing normalized evidence when available.
- Must use the intentional absence marker only when normalization is not
  applicable or absent.
- Must not create new calculation warnings or values.

## Shared Value Trace Cue

The compact traceability cue associated with a displayed Shared Values row.

**Fields**

- `left_source_path`
- `right_source_path`
- `rule_version`
- `producing_module`
- `mapping_basis`
- `dd_field_name`
- `fallback_name`

**Validation Rules**

- Must be derived from existing shared-value reconciliation records.
- Must identify the rule version and producing module for every displayed row.
- Must preserve DD-backed names where available and approved fallback names
  where no DD field exists.

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
