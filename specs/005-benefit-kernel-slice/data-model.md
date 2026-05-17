# Data Model: Benefit Kernel Slice

## Case Header

**Purpose**: Local case shell and plan timeline anchor for benefit calculations.

**Source**: `case_header` from `sqlite_migration_0001_v0.1.0.sql.txt`.

**Key fields**:
- `case_id`
- `plan_id`
- `dopt`
- `dotr`
- `bpd`
- `dobf`

**Validation rules**:
- `case_id` and `plan_id` are required.
- Date fields must be ISO `YYYY-MM-DD` or explicit null.
- Timeline values must match the active reviewed benefit-kernel packet.

## Resolved Fact

**Purpose**: Active reviewed participant, beneficiary, alternate-payee,
service, compensation, form, limitation, assumption, QDRO, QPSA, disability, or
payment fact used by deterministic kernel execution.

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
- Blank strings are invalid for deterministic benefit fields.
- Multiple active rows for the same case, subject, and field are blocking
  errors.

## Resolved Plan Provision

**Purpose**: Active reviewed plan logic and controlled benefit calculation
rules.

**Source**: `resolved_plan_provision` and
`vw_active_resolved_plan_provision`.

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
- Benefit rules must map to controlled formula, adjustment, limitation, and
  present-value rule shapes in `benefit_kernel_contract_v0.1.0.md`.
- Conflicting active provisions for a required kernel rule are blocking errors.

## Engine Input Packet

**Purpose**: Deterministic reviewed input bundle for one subject and packet
type.

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
- `packet_type` must equal `benefit_kernel` for this slice.
- `status` must be `active`.
- `packet_json` must include required groups from the benefit-kernel contract:
  `case_plan_timeline`, `resolved_plan_logic`,
  `participant_role_population`, `service_employment_history`,
  `compensation_accrual_inputs`, `benefit_administration_state`,
  `actuarial_assumption_factor_set`, `limitation_packet`, and upstream
  deterministic output groups.
- Conditional limitation, QDRO, QPSA, in-pay, death-benefit, contribution,
  disability, asset-recovery, or cash-balance packets are required when trigger
  fields apply.

## Prior Date Resolution Output

**Purpose**: Upstream deterministic date family used by kernel calculations.

**Source**: `resolved_dates_output` from
`sqlite_migration_0004_engine_outputs_v0.1.0.sql.txt`.

**Key fields**:
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
- Required date fields must be ISO dates or explicit null according to the
  contract.
- `subject_key` and `case_id` must match the benefit-kernel packet.

## Prior Service and Compensation Output

**Purpose**: Upstream deterministic service and compensation quantities used by
benefit formulas.

**Source**: `resolved_service_comp_output` from
`sqlite_migration_0004_engine_outputs_v0.1.0.sql.txt`.

**Key fields**:
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
- Required numeric fields must be numeric or explicit null.
- Values must match the reviewed benefit-kernel packet and active subject.

## Prior Form Resolution Output

**Purpose**: Upstream deterministic form state used by kernel form conversion
and branch logic.

**Source**: `resolved_forms_output` from
`sqlite_migration_0004_engine_outputs_v0.1.0.sql.txt`.

**Key fields**:
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
- `subject_key` and `case_id` must match the benefit-kernel packet.

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
- Completed valid kernel runs must have one matching `benefit_kernel_output`
  row per subject.
- Failed runs from validation errors must not create authoritative kernel output
  rows.

## Benefit Kernel Output

**Purpose**: Persisted deterministic benefit-kernel result.

**Source**: `benefit_kernel_output` from
`sqlite_migration_0004_engine_outputs_v0.1.0.sql.txt`.

**Key fields**:
- `benefit_kernel_output_id`
- `calculation_run_id`
- `case_id`
- `subject_key`
- plan-benefit fields including `term_mb_nrd_nsf` and `xrd_mb_term`
- Title Four fields including `pvmb_title_iv`
- section 4022(c) fields including `pvmb_4022c`
- nonguaranteed and PBGC-funds fields including `bnnfa_pvmb` and
  `pvpbl_ann_rates`
- present-value fields including `pvmb_term`

**Validation rules**:
- Numeric output fields must be computed numeric values or explicit null.
- Outputs must be generated only after packet validation succeeds.
- No V1/VE, valuation listing, BSRS, or other adapter rows are written by this
  slice.

## Module Trace

**Purpose**: Reviewable lineage for each populated kernel output, warning, and
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
- `module_name` must equal `benefit_kernel`.
- Each populated kernel output must have trace with the applied rule, upstream
  outputs, reviewed inputs, limitation branch, and present-value factor context.
