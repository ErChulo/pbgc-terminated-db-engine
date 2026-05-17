# Data Model: Form Resolution Slice

## Case Header

**Purpose**: Local case shell and plan timeline anchor for form rules.

**Source**: `case_header` from `sqlite_migration_0001_v0.1.0.sql.txt`.

**Key fields**:
- `case_id`
- `plan_id`
- `dopt`
- `bpd`
- `dobf`

**Validation rules**:
- `case_id` and `plan_id` are required.
- Date fields must be ISO `YYYY-MM-DD` or explicit null.
- Timeline values must match the active reviewed form packet.

## Resolved Fact

**Purpose**: Active reviewed participant, beneficiary, alternate-payee, payment,
marital, death, QDRO, or QPSA fact used by deterministic form execution.

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
- Blank strings are invalid for deterministic form fields.
- Multiple active rows for the same case, subject, and field are blocking
  errors.

## Resolved Plan Provision

**Purpose**: Active reviewed form logic and controlled rule values.

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
- Form rules must map to controlled normal-form, death-benefit, lump-sum, and
  conversion rule shapes in `form_resolution_contract_v0.1.0.md`.
- Conflicting active provisions for a required form rule are blocking errors.

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
- `packet_type` must equal `form_resolution` for this slice.
- `status` must be `active`.
- `packet_json` must include required groups from the form-resolution contract:
  `case_plan_timeline`, `resolved_plan_logic`,
  `participant_role_population`, `benefit_administration_state`,
  `actuarial_assumption_factor_set`, and `limitation_packet`.
- Conditional in-pay, QPSA, QDRO, death-benefit, mandatory employee
  contribution, or voluntary employee contribution packets are required when
  trigger fields apply.

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
- Completed valid form runs must have one matching `resolved_forms_output` row
  per subject.
- Failed runs from validation errors must not create authoritative form output
  rows.

## Resolved Forms Output

**Purpose**: Persisted deterministic form-resolution result.

**Source**: `resolved_forms_output` from
`sqlite_migration_0004_engine_outputs_v0.1.0.sql.txt`.

**Key fields**:
- `resolved_forms_output_id`
- `calculation_run_id`
- `case_id`
- `subject_key`
- `rettyp`
- `form_code_nsf`
- `form_code_nmf`
- `form_code_ptp`
- `form_code_ptp_qpsa`
- `form_code_death`
- `annuity_status_pay`
- `lsoption`
- `bs_ind`
- `br_ind`
- `ofa_indicator`

**Validation rules**:
- Form fields must be controlled codes or explicit null.
- Outputs must be generated only after packet validation succeeds.
- No benefit amounts or present values are written by this slice.

## Module Trace

**Purpose**: Reviewable lineage for each form output, warning, and branch.

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
- `module_name` must equal `form_resolution`.
- Each populated form output must have trace with the applied rule and reviewed
  inputs used.
- Trace must record whether current-pay evidence, QDRO, QPSA, death-benefit,
  lump-sum, contribution, or PBGC form-policy logic affected the output.

## Existing Fixture: Form Resolution Test Case

**Purpose**: Acceptance fixture row for deterministic expected outputs.

**Source**: `packages/tests/form_resolution_test_cases_v0.1.0.csv`.

**Key fields**:
- `test_case_id`
- `description`
- `role_type`
- `mstat`
- `current_pay_status`
- `qdro_indicator`
- `qpsa_indicator`
- `normal_single_form_rule`
- `normal_married_form_rule`
- `pre_retirement_death_benefit_rule`
- `consensual_lump_sum_rule`
- `expected_rettyp`
- `expected_form_code_nsf`
- `expected_form_code_nmf`
- `expected_form_code_death`
- `expected_lsoption`

**Validation rules**:
- Every fixture row must convert into a reviewed `form_resolution` packet for
  test execution.
- Expected blank fixture fields represent explicit null expected outputs.
- QDRO and in-pay fixtures may exercise branch-specific reviewed packets without
  invoking benefit-kernel or output-adapter logic.

## Prior Date, Service, and Compensation Run Context

**Purpose**: Prior executable slices available for reviewer sequencing and
regression assurance.

**Source**: `date_resolution`, `service_resolution`, `compensation_resolution`,
`resolved_dates_output`, `resolved_service_comp_output`, and related traces.

**Validation rules**:
- Form resolution must not require prior date, service, or compensation output
  unless a future versioned contract explicitly adds that dependency.
- Existing date-resolution, service-resolution, and compensation-resolution
  tests must continue to pass after form work.
