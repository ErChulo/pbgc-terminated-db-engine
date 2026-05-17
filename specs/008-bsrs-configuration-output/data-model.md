# Data Model: BSRS Configuration Output

## Entities

### BSRSConfigurationPacket

- **Purpose**: Represents one deterministic BSRS configuration result for a
  reviewed case and rule version.
- **Key fields**:
  - `calculation_run_id`
  - `case_id`
  - `plan_id`
  - `subject_key`
  - `statement_row_type`
  - `statement_sort_key`
  - canonical BSRS output fields
  - trace references
- **Validation rules**:
  - Must be based on reviewed inputs only.
  - Must preserve explicit nulls for inapplicable fields.
  - Must use DD-first naming when a matching Data Dictionary entry exists.

### BSRSConfigurationOutputRow

- **Purpose**: Persisted browser-database row containing the generated BSRS
  configuration payload.
- **Key fields**:
  - `bsrs_configuration_output_row_id`
  - `calculation_run_id`
  - `case_id`
  - `plan_id`
  - `subject_key`
  - `statement_row_type`
  - `statement_sort_key`
  - `row_json`
  - `adapter_version`
- **Relationships**:
  - Belongs to one `engine_run`.
  - References one reviewed case.
  - May be accompanied by one or more `module_trace` rows.

### BSRSTraceRecord

- **Purpose**: Captures field-level trace for populated outputs and warnings.
- **Key fields**:
  - `module_trace_id`
  - `calculation_run_id`
  - `module_name`
  - `subject_key`
  - `field_name`
  - `rule_applied`
  - `input_fields_used_json`
  - `intermediate_values_json`
  - `output_value`
  - `warning_note`
- **Relationships**:
  - Belongs to one `engine_run`.
  - Tied to one output field or warning path.

### DDMappingEntry

- **Purpose**: Canonical naming entry from `artifacts/mappings/DD.csv`.
- **Key fields**:
  - Data Dictionary field name
  - semantic label
  - repository field name
  - notes
- **Relationships**:
  - Used as a reference source for BSRS field naming when a match exists.

## State Transitions

### Output generation lifecycle

1. Reviewed inputs and upstream outputs are assembled.
2. The adapter validates required and conditional inputs.
3. The adapter resolves BSRS field names through DD.csv where applicable.
4. The adapter emits the BSRS configuration packet and trace records.
5. The adapter persists a successful output row, or records a failed run with
   structured validation errors.

## Validation Rules

- Missing required upstream outputs produce blocking validation errors.
- Conditional BSRS branches must produce either explicit values or explicit
  nulls.
- Output row ordering must remain deterministic across repeated runs.
- No unrelated output adapter rows may be written during BSRS generation.
