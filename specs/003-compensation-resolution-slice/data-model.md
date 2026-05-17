# Data Model: Compensation Resolution Slice

## Case Header

**Purpose**: Local case shell and plan timeline anchor for compensation rules.

**Source**: `case_header` from `sqlite_migration_0001_v0.1.0.sql.txt`.

**Key fields**:
- `case_id`
- `plan_id`
- `plan_anniversary`
- `dopt`
- `bpd`
- `dobf`

**Validation rules**:
- `case_id` and `plan_id` are required.
- Date fields must be ISO `YYYY-MM-DD` or explicit null.
- Timeline values must match the active reviewed compensation packet.

## Resolved Fact

**Purpose**: Active reviewed participant or case fact used by deterministic
compensation execution.

**Source**: `resolved_fact` and `vw_active_resolved_fact`.

**Key fields**:
- `resolved_fact_id`
- `case_id`
- `subject_type`
- `subject_key`
- `field_name`
- `resolved_value`
- `resolved_value_type`
- `primary_source_assertion_id`
- `source_assertion_ids_json`
- `schema_version`
- `status`

**Validation rules**:
- Only `status = active` rows are eligible.
- Blank strings are invalid for deterministic compensation fields.
- Multiple active rows for the same case, subject, and field are blocking
  errors.

## Resolved Plan Provision

**Purpose**: Active reviewed compensation logic and controlled rule values.

**Source**: `resolved_plan_provision` and `vw_active_resolved_plan_provision`.

**Key fields**:
- `resolved_plan_provision_id`
- `case_id`
- `provision_code`
- `resolved_value`
- `resolution_basis`
- `governing_document_id`
- `source_assertion_ids_json`
- `effective_start_date`
- `effective_end_date`
- `schema_version`
- `status`

**Validation rules**:
- Only active provisions are eligible.
- Compensation rules must map to controlled compensation bases and rule shapes
  in `compensation_resolution_contract_v0.1.0.md`.
- Conflicting active provisions for a required compensation rule are blocking
  errors.

## Engine Input Packet

**Purpose**: Deterministic reviewed input bundle for one subject and packet type.

**Source**: `engine_input_packet` from
`sqlite_migration_0003_engine_packets_v0.1.0.sql.txt`.

**Key fields**:
- `input_packet_id`
- `case_id`
- `subject_type`
- `subject_key`
- `packet_type`
- `schema_version`
- `packet_json`
- `status`

**Validation rules**:
- `packet_type` must equal `compensation_resolution` for this slice.
- `status` must be `active`.
- `packet_json` must include required groups from the compensation-resolution
  contract: `case_plan_timeline`, `resolved_plan_logic`,
  `participant_role_population`, `service_employment_history`,
  `compensation_accrual_inputs`, `benefit_administration_state`, and
  `limitation_packet`.
- Conditional compensation history, average override, covered compensation,
  compensation limit, frozen-benefit support, or PIA offset packets are required
  when trigger fields apply.

## Engine Run

**Purpose**: Execution record for one deterministic calculation attempt.

**Source**: `engine_run` from `sqlite_migration_0001_v0.1.0.sql.txt`.

**Key fields**:
- `calculation_run_id`
- `case_id`
- `input_packet_id`
- `rule_version`
- `deliverable_version`
- `run_context`
- `started_at`
- `completed_at`
- `run_status`
- `warning_count`
- `error_count`

**State transitions**:
- `queued` -> `running` -> `completed`
- `queued` -> `running` -> `failed`
- `queued` or `running` -> `cancelled`

**Validation rules**:
- Completed valid compensation runs must have matching compensation output
  fields in `resolved_service_comp_output`.
- Failed runs from validation errors must not create authoritative compensation
  output values.

## Resolved Service and Compensation Output

**Purpose**: Persisted deterministic service-and-compensation result.

**Source**: Service and compensation columns of `resolved_service_comp_output`
from `sqlite_migration_0004_engine_outputs_v0.1.0.sql.txt`.

**Key fields**:
- `resolved_service_comp_output_id`
- `calculation_run_id`
- `case_id`
- `subject_key`
- `eligibility_service_resolved`
- `vesting_service_resolved`
- `benefit_service_resolved`
- `accrual_service_resolved`
- `compensation_resolved`
- `average_compensation_resolved`
- `covered_compensation_resolved`

**Validation rules**:
- Compensation quantities must be numeric or explicit null.
- Service fields from prior service resolution must be preserved when present.
- Outputs must be generated only after packet validation succeeds.

## Module Trace

**Purpose**: Reviewable lineage for each compensation output, warning, and
branch.

**Source**: `module_trace` from `sqlite_migration_0001_v0.1.0.sql.txt`.

**Key fields**:
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

**Validation rules**:
- `module_name` must equal `compensation_resolution`.
- Each populated compensation output must have trace with the applied rule and
  reviewed inputs used.
- Trace must record whether compensation history, override, covered
  compensation, cap, freeze support, or PIA logic affected the output.

## Existing Fixture: Compensation Resolution Test Case

**Purpose**: Acceptance fixture row for deterministic expected outputs.

**Source**: `packages/tests/compensation_resolution_test_cases_v0.1.0.csv`.

**Key fields**:
- `test_case_id`
- `description`
- `compensation_basis_code`
- `average_compensation_rule`
- `compensation_history_available_indicator`
- `final_average_compensation`
- `covered_compensation_amount`
- `frozen_accrued_benefit_indicator`
- `expected_compensation_resolved`
- `expected_average_compensation_resolved`
- `expected_covered_compensation_resolved`

**Validation rules**:
- Every fixture row must convert into a reviewed `compensation_resolution`
  packet for test execution.
- Expected blank fixture fields represent explicit null expected outputs.
- Frozen-benefit support fixtures may complete with warnings and null
  compensation outputs when reviewed payroll support is intentionally absent.

## Prior Date and Service Run Context

**Purpose**: Prior executable slices available for reviewer sequencing and
regression assurance.

**Source**: `date_resolution`, `service_resolution`, `resolved_dates_output`,
and service columns in `resolved_service_comp_output`.

**Validation rules**:
- Compensation resolution must not require date or service output unless a
  future versioned contract explicitly adds that dependency.
- Existing date-resolution and service-resolution tests must continue to pass
  after compensation work.
