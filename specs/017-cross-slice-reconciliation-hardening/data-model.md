# Data Model: Cross-Slice Reconciliation Hardening

## Reconciliation Comparison

Deterministic record linking equivalent reviewed facts across implemented
output slices.

**Fields**

- `comparison_id`
- `case_id`
- `reviewed_fact_context`
- `canonical_semantic_name`
- `mapping_basis`: `dd` or `approved_fallback`
- `dd_field_name`
- `fallback_name`
- `left_slice`
- `left_field`
- `left_value`
- `left_source_path`
- `right_slice`
- `right_field`
- `right_value`
- `right_source_path`
- `status`: `accepted`, `drift`, `unsupported`, `absent_optional`, or
  `formatting_only`
- `rule_version`
- `producing_module`

**Validation Rules**

- Must compare only facts with reviewed equivalence across at least two current
  output slices.
- Must use DD-backed canonical semantics when a matching DD.csv entry exists.
- Must record approved fallback basis when no DD entry exists.
- Must sort deterministically by case, semantic name, slice pair, field names,
  source paths, and status.

## Shared Case Fact

Reviewed identifier, form, or field semantic that appears in more than one
implemented output slice.

**Fields**

- `fact_key`
- `case_id`
- `fact_family`: `participant_identifier`, `plan_identifier`,
  `case_identifier`, `form_reference`, or `dd_backed_field`
- `reviewed_fact_context`
- `expected_presence`
- `accepted_format_variants`
- `unsupported_branch_codes`

**Validation Rules**

- Must derive from approved samples, current committed output evidence, existing
  contracts, reviewed output field names, or existing regression evidence.
- Must not derive from raw OCR, source documents, emails, images, PDFs, hosted
  services, or unreviewed extraction output.
- Explicit nulls, unsupported branches, and absent optional evidence must not be
  reported as drift unless the current contract requires counterpart evidence.

## DD-Backed Mapping

Canonical semantic mapping through `artifacts/mappings/DD.csv`.

**Fields**

- `dd_field_name`
- `dd_semantic_name`
- `adapter_slice`
- `adapter_field_name`
- `source_path`
- `mapping_version`

**Validation Rules**

- Matching V1/VE fields must resolve through DD.csv before cross-slice
  comparison.
- Reconciliation must not invent alternate semantic names for DD-backed V1
  fields.
- Missing required DD mappings must emit structured findings.

## Approved Fallback Mapping

Traceable contract-name mapping used when a reconciled field has no matching
DD.csv entry.

**Fields**

- `fallback_name`
- `adapter_slice`
- `adapter_field_name`
- `contract_reference`
- `source_path`
- `fallback_reason`

**Validation Rules**

- Must be used only after confirming no matching DD.csv entry exists.
- Must record the contract or reviewed artifact basis for the fallback.
- Must not silently rename fields or add new semantics.

## Cross-Slice Drift Finding

Structured warning or error describing mismatch, missing required counterpart,
mapping failure, unsupported comparison, or suspicious drift.

**Fields**

- `code`
- `severity`
- `category`
- `case_id`
- `reviewed_fact_context`
- `canonical_semantic_name`
- `mapping_basis`
- `dd_field_name`
- `fallback_name`
- `compared_slices`
- `compared_fields`
- `compared_values`
- `source_paths`
- `rule_version`
- `producing_module`
- `message`

**Validation Rules**

- Findings must be sorted and serialized deterministically.
- Repeated runs over identical approved sources must produce the same payload
  shape and ordering.
- Findings must distinguish true drift from accepted null, unsupported,
  optional, or formatting-only cases.
- Findings must not imply new output-adapter writes or lower source-layer
  persistence.
