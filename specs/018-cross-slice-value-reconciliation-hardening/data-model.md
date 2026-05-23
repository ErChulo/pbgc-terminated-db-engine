# Data Model: Cross-Slice Value Reconciliation Hardening

## Value Reconciliation Rule

Reviewed comparison definition for a selected shared value.

**Fields**

- `rule_key`
- `fact_family`: `participant_identifier`, `plan_identifier`,
  `case_identifier`, `form_reference`, `nullable_fact`,
  `categorical_value`, or `numeric_value`
- `value_type`: `identifier`, `form_code`, `categorical`, `numeric`,
  `boolean`, or `nullable`
- `reviewed_fact_context`
- `canonical_semantic_name`
- `mapping_basis`: `dd` or `approved_fallback`
- `dd_field_name`
- `fallback_name`
- `fields_by_slice`
- `required_or_nullable_basis`
- `normalization_basis`
- `severity_policy`
- `accepted_format_variants`
- `unsupported_branch_codes`

**Validation Rules**

- Must derive from approved samples, current committed output evidence,
  existing contracts, DD.csv, reviewed output field names, or existing
  regression evidence.
- Must compare only selected values with reviewed shared meaning across at
  least two implemented output slices.
- Must use DD-backed canonical semantics when a matching DD.csv entry exists.
- Must record approved fallback basis when no DD entry exists.

## Value Comparison Record

Deterministic record linking equivalent selected values across output slices.

**Fields**

- `comparison_id`
- `rule_key`
- `case_id`
- `reviewed_fact_context`
- `value_type`
- `canonical_semantic_name`
- `mapping_basis`
- `dd_field_name`
- `fallback_name`
- `required_or_nullable_basis`
- `normalization_basis`
- `left_slice`
- `left_field`
- `left_value`
- `left_normalized_value`
- `left_source_path`
- `right_slice`
- `right_field`
- `right_value`
- `right_normalized_value`
- `right_source_path`
- `status`
- `severity`
- `rule_version`
- `producing_module`

**Validation Rules**

- Must sort deterministically by case, rule key, semantic name, slice pair,
  field names, source paths, status, and severity.
- Must preserve raw and normalized values for traceability.
- Must not imply new persistence unless current contracts require validation
  evidence.

## Severity Classification

Structured classification for value-level mismatch outcomes.

**Fields**

- `status`: `accepted`, `blocking_mismatch`, `non_blocking_warning`,
  `accepted_nullable`, `unsupported`, or `formatting_only`
- `severity`: `error`, `warning`, or `info`
- `classification_basis`
- `finding_code`

**Validation Rules**

- Required selected facts that differ must use blocking mismatch severity.
- Optional or nullable facts may use accepted nullable classification when the
  current contract allows absence.
- Unsupported branches and formatting-only differences must not be reported as
  factual drift.

## Basis Metadata

Traceable explanation for why a value was compared, normalized, accepted,
warned, or blocked.

**Fields**

- `comparison_type`
- `required_or_nullable_basis`
- `mapping_basis`
- `dd_field_name`
- `fallback_name`
- `normalization_basis`
- `source_paths`
- `reviewed_fact_context`
- `rule_version`
- `producing_module`

**Validation Rules**

- Must be present for every accepted comparison and mismatch finding.
- Must explicitly record DD mapping or approved fallback basis.
- Must not silently invent alternate semantic names.

## Value Reconciliation Finding

Structured warning or error describing value-level reconciliation outcomes that
need reviewer attention.

**Fields**

- `code`
- `severity`
- `category`
- `case_id`
- `rule_key`
- `reviewed_fact_context`
- `value_type`
- `canonical_semantic_name`
- `mapping_basis`
- `dd_field_name`
- `fallback_name`
- `required_or_nullable_basis`
- `normalization_basis`
- `compared_slices`
- `compared_fields`
- `compared_values`
- `normalized_values`
- `source_paths`
- `rule_version`
- `producing_module`
- `message`

**Validation Rules**

- Findings must be sorted and serialized deterministically.
- Repeated runs over identical approved sources must produce the same payload
  shape and ordering.
- Findings must distinguish true value drift from accepted nullable,
  unsupported, optional, and formatting-only cases.
- Findings must not change output-adapter behavior or lower source-layer
  persistence.
