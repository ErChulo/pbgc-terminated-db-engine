# Data Model: Reconciliation Workbench Trace Expansion

## Trace Detail Expansion

The display-only expansion state and detail content for one existing workbench
row.

**Fields**

- `row_id`
- `row_kind`
- `row_label`
- `status`
- `severity`
- `control_label`
- `detail`

**Validation Rules**

- Must be derived only from existing reconciliation rows, Shared Facts rows,
  Shared Values rows, approved committed sample evidence, mapping metadata, and
  mocked display labels.
- Must not read raw OCR, raw documents, emails, images, PDFs, unreviewed
  extraction output, hosted services, runtime network input, uncommitted files,
  or real natural-person data.
- Must remain deterministic across repeated loads of the same fixed sample.

## Trace Detail Row

The analyst-readable trace detail shown when one row is expanded.

**Fields**

- `row_id`
- `row_kind`
- `compared_sources`
- `compared_fields`
- `raw_values`
- `normalized_values`
- `status`
- `severity`
- `mapping_basis`
- `source_paths`
- `rule_version`
- `producing_module`
- `stable_evidence_basis`

**Validation Rules**

- Must show compared sources and fields for every expanded detail.
- Must show raw values for Shared Facts and Shared Values rows.
- Must show normalized values for Shared Values rows when available.
- Must display an intentional absence marker when normalized values, severity,
  source paths, or trace fields are not applicable.
- Must preserve existing agreement, drift, warning, nullable, unsupported, and
  formatting-only classifications without recalculating them.
- Must not mutate deterministic output rows, Shared Facts rows, Shared Values
  rows, reconciliation rows, or output-adapter rows.

## Expansion Control

The analyst-facing control used to reveal or hide trace details for a row.

**Fields**

- `control_id`
- `row_id`
- `row_kind`
- `collapsed_label`
- `expanded_label`
- `expanded`

**Validation Rules**

- Must identify the row using stable row identity derived from existing
  comparison identifiers or ordering keys.
- Must not change row order, row content, output values, or reconciliation
  classifications.
- Must be usable for reconciliation rows, Shared Facts rows, and Shared Values
  rows.

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
- Must not affect expansion content, row ordering, comparison status, or output
  values.
