# Data Model: Service Resolution Slice

## Case Header

**Purpose**: Local case shell and plan timeline anchor for service rules.

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
- `plan_anniversary` must be a controlled month/day value when used for service
  year boundaries.

## Resolved Fact

**Purpose**: Active reviewed participant or case fact used by deterministic
service execution.

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
- Blank strings are invalid for deterministic service fields.
- Multiple active rows for the same case, subject, and field are blocking
  errors.

## Resolved Plan Provision

**Purpose**: Active reviewed service logic and controlled rule values.

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
- Service rules must map to controlled service bases and rule shapes in
  `service_resolution_contract_v0.1.0.md`.
- Conflicting active provisions for a required service rule are blocking errors.

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
- `packet_type` must equal `service_resolution` for this slice.
- `status` must be `active`.
- `packet_json` must include required groups from the service-resolution
  contract: `case_plan_timeline`, `resolved_plan_logic`,
  `participant_role_population`, `service_employment_history`,
  `actuarial_assumption_factor_set`, and `limitation_packet`.
- Conditional service segment, override, transfer, break, or frozen-accrual
  packets are required when their trigger fields apply.

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
- Completed valid service runs must have one matching
  `resolved_service_comp_output` row per subject.
- Failed runs from validation errors must not create service output rows.

## Resolved Service Output

**Purpose**: Persisted service-resolution result.

**Source**: Service columns of `resolved_service_comp_output` from
`sqlite_migration_0004_engine_outputs_v0.1.0.sql.txt`.

**Key fields**:
- `resolved_service_comp_output_id`
- `calculation_run_id`
- `case_id`
- `subject_key`
- `eligibility_service_resolved`
- `vesting_service_resolved`
- `benefit_service_resolved`
- `accrual_service_resolved`

**Validation rules**:
- Service quantities must be numeric or null.
- Compensation fields in the shared output table remain null in this slice.
- Outputs must be generated only after packet validation succeeds.

## Module Trace

**Purpose**: Reviewable lineage for each service output, warning, and branch.

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
- `module_name` must equal `service_resolution`.
- Each populated service output must have trace with the applied rule and
  reviewed inputs used.
- Trace must record whether freeze, break, transfer, segment, or override logic
  affected the output.

## Existing Fixture: Service Resolution Test Case

**Purpose**: Acceptance fixture row for deterministic expected outputs.

**Source**: `packages/tests/service_resolution_test_cases_v0.1.0.csv`.

**Key fields**:
- `test_case_id`
- `description`
- `doh`
- `dop`
- `dote`
- `dopt`
- `service_basis_code`
- `service_hours_requirement`
- `service_period_basis`
- `plan_anniversary_service_basis`
- `dobf`
- `expected_eligibility_service`
- `expected_vesting_service`
- `expected_benefit_service`
- `expected_accrual_service`

**Validation rules**:
- Every fixture row must convert into a reviewed `service_resolution` packet for
  test execution.
- Expected blank fixture fields represent explicit null expected outputs.

## Date Resolution Run Context

**Purpose**: Prior executable slice available for reviewer sequencing and
regression assurance.

**Source**: `date_resolution` package and `resolved_dates_output`.

**Validation rules**:
- Service resolution must not require date-resolution output unless a future
  versioned contract explicitly adds that dependency.
- Existing date-resolution tests must continue to pass after service work.
