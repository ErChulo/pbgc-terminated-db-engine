# Data Model: Date Resolution Slice

## Case Header

**Purpose**: Local case shell and plan timeline anchor.

**Source**: `case_header` from `sqlite_migration_0001_v0.1.0.sql.txt` and
`seed_case_shell_v0.1.0.sql.txt`.

**Key fields**:
- `case_id`
- `plan_id`
- `plan_anniversary`
- `dopt`
- `dotr`
- `bpd`

**Validation rules**:
- `case_id` and `plan_id` are required.
- Date fields must be ISO `YYYY-MM-DD` or explicit null.
- `plan_anniversary` must be a controlled month/day value when used for rules.

## Resolved Fact

**Purpose**: Active reviewed person or case fact available to deterministic
execution.

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
- Missing fields must be absent or explicit null in packet JSON; blank strings
  are invalid for deterministic date inputs.
- Multiple active rows for the same case, subject, and field are blocking errors.

## Resolved Plan Provision

**Purpose**: Active reviewed plan logic and controlled rule values.

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
- Date-resolution rules must map to controlled shapes in
  `date_resolution_contract_v0.1.0.md`.
- Conflicting active provisions for a required rule are blocking errors.

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
- `packet_type` must equal `date_resolution` for this slice.
- `status` must be `active`.
- `packet_json` must include required groups from the date-resolution contract:
  `case_plan_timeline`, `resolved_plan_logic`, `participant_role_population`,
  `service_employment_history`, `benefit_administration_state`,
  `actuarial_assumption_factor_set`, and `limitation_packet`.
- Conditional `qpsa_packet`, `death_benefit_packet`, or `qdro_packet` groups are
  required when their trigger fields apply.

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
- Completed runs with valid packets must have one matching
  `resolved_dates_output` row per subject.
- Failed runs from validation errors must not create `resolved_dates_output`.

## Resolved Dates Output

**Purpose**: Persisted date-resolution result.

**Source**: `resolved_dates_output` from
`sqlite_migration_0001_v0.1.0.sql.txt`.

**Key fields**:
- `resolved_dates_output_id`
- `calculation_run_id`
- `case_id`
- `subject_key`
- `nrd`
- `erd`
- `eurd`
- `eprd`
- `rbd`
- `xra`
- `xrd`
- `sxra`
- `term_lw_xra`
- `term_lw_anb`

**Validation rules**:
- Date fields must be ISO `YYYY-MM-DD` or null.
- Age fields must be numeric or null.
- Fields that do not apply to a role, such as participant-only outputs for a
  beneficiary path, must remain explicit nulls.

## Module Trace

**Purpose**: Reviewable lineage for each date output, warning, and branch.

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
- `module_name` must equal `date_resolution`.
- Each populated resolved date must have trace with the applied rule and reviewed
  inputs used.
- Warnings must be traceable without changing valid output values.

## Existing Fixture: Date Resolution Test Case

**Purpose**: Acceptance fixture row for deterministic expected outputs.

**Source**: `packages/tests/date_resolution_test_cases_v0.1.0.csv`.

**Key fields**:
- `test_case_id`
- `description`
- `retstat`
- `role_type`
- `dob`
- `dote`
- `dod`
- `dopt`
- `plan_anniversary`
- `normal_retirement_eligibility_rule`
- `normal_retirement_start_rule`
- `early_reduced_retirement_rule`
- `expected_nrd`
- `expected_erd`
- `expected_rbd`
- `expected_xra`
- `expected_xrd`

**Validation rules**:
- Every fixture row must convert into a reviewed `date_resolution` packet for
  test execution.
- Expected blank fixture fields represent explicit null expected outputs.
