# Data Model: V1/VE Output

## Engine Input Packet

**Purpose**: Reviewed downstream adapter input bundle for one case, one subject,
and one output version.

**Source**: `engine_input_packet` from `sqlite_migration_0003_engine_packets_v0.1.0.sql.txt`.

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
- `packet_type` must equal `v1_ve_output` for this slice.
- `status` must be `active`.
- `packet_json` must include required input families from the V1/VE contract.
- Missing required upstream output families are blocking errors.

## Upstream Date Resolution Output

**Purpose**: Direct date fields supplied to the adapter.

**Source**: `resolved_dates_output` from `sqlite_migration_0004_engine_outputs_v0.1.0.sql.txt`.

**Key fields**:
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
- Date fields must be ISO dates or explicit null.
- `case_id` and `subject_key` must match the reviewed packet.

## Upstream Service, Compensation, and Form Outputs

**Purpose**: Reviewed upstream state used for V1/VE projection.

**Source**: `resolved_service_comp_output` and `resolved_forms_output`.

**Key fields**:
- service quantities: `eligibility_service_resolved`, `vesting_service_resolved`,
  `benefit_service_resolved`, `accrual_service_resolved`
- compensation quantities: `compensation_resolved`,
  `average_compensation_resolved`, `covered_compensation_resolved`
- form-state fields: `rettyp`, `form_code_nsf`, `form_code_nmf`,
  `form_code_ptp`, `form_code_ptp_qpsa`, `form_code_death`,
  `annuity_status_pay`, `lsoption`, `bs_ind`, `br_ind`, `ofa_indicator`

**Validation rules**:
- Values must come from reviewed deterministic outputs.
- Conditional branch fields must be explicit nulls when not applicable.

## Upstream Benefit Kernel Output

**Purpose**: Deterministic benefit values used for projection into V1/VE.

**Source**: `benefit_kernel_output`.

**Key fields**:
- `term_mb_nrd_nsf`
- `term_surv_mb_nrd`
- `term_surv_mb_eurd`
- `term_surv_mb_erd`
- `rbd_surv_mb_term`
- `term_surv_mb_ard`
- `xrd_mb_term`
- `xrd_surv_mb_term`
- `xrd_mb_qpsa_term`
- `ls_term`
- `ls_qpsa`
- `xrd_mb_title_iv`
- `nrd_mb_title_iv_nsf`
- `eurd_mb_title_iv_nsf`
- `erd_mb_title_iv_nsf`
- `rbd_mb_title_iv`
- `ard_mb_title_iv`
- `pvmb_title_iv_no_q_no_l`
- `pvmb_title_iv_qpsa`
- `pvmb_title_iv_no_load`
- `title_iv_load`
- `pvmb_title_iv`
- `xrd_mb_4022c`
- `pvmb_4022c_no_q_no_l`
- `pvmb_4022c_qpsa`
- `pvmb_4022c_no_load`
- `load_4022c`
- `pvmb_4022c`
- `pvmb_bas_ungb_no_q_no_l`
- `pvmb_bas_ungb_qpsa`
- `bnnfa_pvmb_no_load`
- `bnnfa_load`
- `bnnfa_pvmb`
- `pvpbl_ann_rates_no_q_no_l`
- `pvpbl_ann_rates_qpsa`
- `pvpbl_ann_rates_no_load`
- `pbl_load`
- `pvpbl_ann_rates`
- `pvf_lev_ann`
- `pvf_lev_ls`
- `pvf_qpsa_ls`
- `pvmb_term_no_q_no_l`
- `pvmb_term_qpsa`
- `pvmb_term_no_load`
- `term_load`
- `pvmb_term`

**Validation rules**:
- Benefit-kernel values must exist before V1/VE projection.
- Missing required benefit-kernel values are blocking errors for the adapter.

## V1/VE Output Row

**Purpose**: Persisted adapter row containing the downstream V1/VE-ready packet.

**Source**: `v1_ve_output_row` from `sqlite_migration_0005_output_adapters_v0.1.0.sql.txt`.

**Key fields**:
- `v1_ve_output_row_id`
- `calculation_run_id`
- `case_id`
- `plan_id`
- `subject_key`
- `row_json`
- `listing_sort_key`
- `adapter_version`

**Validation rules**:
- Each successful adapter run writes one row for the reviewed case/subject.
- `row_json` must serialize the deterministic V1/VE output packet.
- Adapter version must match the committed contract version.

## V1/VE Output Packet

**Purpose**: Structured adapter packet containing the row, metadata, warnings,
and trace.

**Key fields**:
- row identity and control fields
- demographic and date fields
- form and payment-state fields
- Title IV fields
- Section 4022(c) fields
- termination-benefit fields
- nonguaranteed and PBGC-funds fields
- present-value factor fields
- trace fields

**Validation rules**:
- Required and conditional contract fields must be validated before output.
- Populated fields require trace references.
- Explicit nulls must remain explicit nulls.

## Engine Run

**Purpose**: Execution record for one deterministic adapter attempt.

**Source**: `engine_run`.

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

**Validation rules**:
- Completed valid V1/VE runs must have one matching `v1_ve_output_row`.
- Failed validation runs must not create authoritative output rows.
