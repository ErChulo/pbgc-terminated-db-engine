# Data Model: Reconciliation Workbench UI

## Approved Sample Workbench

The complete display state for the one approved sample shown in the workbench.

**Fields**

- `sample_id`
- `sample_label`
- `case_id`
- `plan_id`
- `generated_at`: stable timestamp metadata derived from existing deterministic evidence
- `output_panels`
- `reconciliation_rows`
- `findings`
- `trace_summary`

**Validation Rules**

- Must derive only from approved committed sample artifacts and already
  implemented deterministic outputs.
- Must be deterministic across repeated loads of the same approved sample, including `generated_at`.
- `generated_at` must not use wall-clock time or runtime load time.
- Must not include raw OCR, raw documents, external workbooks, or unreviewed
  extraction data.

## Output Slice Panel

Visible grouping for one output slice in the workbench.

**Fields**

- `slice_name`: `bsrs_configuration_output`, `v1_ve_output`, or
  `valuation_listings_output`
- `panel_label`
- `case_id`
- `row_identity`
- `fields`
- `warnings`
- `trace_count`

**Validation Rules**

- Must present existing deterministic row values without mutating them.
- Must identify the output slice clearly.
- Must keep long field names and values readable on 1440x900 desktop and
  390x844 mobile viewports.

## Display Field

One field/value pair shown inside an output slice panel.

**Fields**

- `field_name`
- `display_label`
- `value`
- `is_null`
- `mapping_basis`
- `dd_field_name`
- `fallback_name`

**Validation Rules**

- DD-backed basis must be shown when available.
- Approved fallback basis must be explicit when no DD mapping exists.
- Null values must be displayed intentionally rather than hidden.

## Reconciliation Row

One visible selected shared-value comparison row.

**Fields**

- `comparison_id`
- `rule_key`
- `status`
- `severity`
- `canonical_semantic_name`
- `compared_slices`
- `compared_fields`
- `compared_values`
- `normalized_values`
- `mapping_basis`
- `required_or_nullable_basis`
- `normalization_basis`

**Validation Rules**

- Must have one of the approved statuses: agreement, drift, warning, nullable,
  unsupported, or formatting-only.
- Must sort deterministically across repeated loads.
- Must preserve values and normalized values from existing reconciliation
  evidence.

## Trace Detail

The review support metadata shown for a reconciliation row or finding.

**Fields**

- `source_artifact`
- `rule_version`
- `producing_module`
- `reviewed_fact_context`
- `mapping_basis`
- `dd_field_name`
- `fallback_name`

**Validation Rules**

- Must be visible or inspectable for every displayed comparison/finding where
  underlying evidence contains the field.
- Must not invent mapping names that are not present in DD.csv or approved
  fallback evidence.
