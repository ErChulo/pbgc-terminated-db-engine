# Data Model: Reconciliation Workbench Usability

## Workbench Sample Context

The first visible context block for the fixed approved sample.

**Fields**

- `sample_id`
- `sample_label`
- `fixed_sample_label`
- `mock_case_label`
- `mock_population_label`
- `no_real_person_data_notice`
- `generated_at`

**Validation Rules**

- Must identify the approved sample and fixed-sample scope.
- Mock labels must be clearly marked as mocked or simulated.
- Must not include real participant, beneficiary, alternate payee, survivor, or
  other natural-person data.
- `generated_at` must remain deterministic across repeated loads.

## Business Output Panel

A business-readable presentation of one existing output slice.

**Fields**

- `slice_name`: `bsrs_configuration_output`, `v1_ve_output`, or
  `valuation_listings_output`
- `business_label`
- `business_purpose`
- `row_identity`
- `display_fields`
- `warnings`

**Validation Rules**

- Must use business-readable labels rather than technical slice names alone.
- Must present existing deterministic values without mutating them.
- Must not add new output fields or output adapters.

## Shared-Fact Row

One visible cross-slice fact comparison.

**Fields**

- `comparison_id`
- `fact_label`
- `status`
- `severity`
- `compared_slices`
- `compared_fields`
- `compared_values`
- `trace_detail`

**Validation Rules**

- Must show a status for every displayed row.
- Must show at least two compared values or an explicit absence/nullable
  classification.
- Must sort deterministically across repeated loads.

## Shared-Value Row

One visible selected shared-value comparison.

**Fields**

- `comparison_id`
- `value_label`
- `status`
- `severity`
- `compared_slices`
- `compared_fields`
- `compared_values`
- `normalized_values`
- `trace_detail`

**Validation Rules**

- Must show agreement, drift, warning, nullable, unsupported, or
  formatting-only status.
- Must preserve existing raw and normalized evidence where available.
- Must sort deterministically across repeated loads.

## Trace Detail Expansion

The expanded evidence block associated with a shared-fact or shared-value row.

**Fields**

- `source_artifact`
- `rule_version`
- `producing_module`
- `mapping_basis`
- `dd_field_name`
- `fallback_name`
- `reviewed_fact_context`
- `compared_slices`
- `compared_fields`
- `compared_values`

**Validation Rules**

- Must be hidden or compact by default but available through a row-level
  expansion control.
- Must not invent trace metadata absent from deterministic evidence.
- Long values and source paths must remain readable.
