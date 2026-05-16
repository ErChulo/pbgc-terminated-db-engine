# benefit_kernel_contract v0.1.0

## Purpose

Defines the deterministic contract for the `benefit_kernel` module.

This module is the core actuarial calculation kernel. It resolves the principal monthly benefit and present-value output families required downstream for valuation, administration, listings, and statement programming.

It accepts only reviewed structured inputs from the deterministic boundary.
It does not read raw documents directly.

---

## Module name

`benefit_kernel`

## Module version

`0.1.0`

## Status

`deterministic_core_module`

---

## Scope

This module resolves, at minimum, these output families:

### 1. Plan-benefit outputs
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

### 2. Title Four outputs
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

### 3. Section 4022(c) outputs
- `xrd_mb_4022c`
- `pvmb_4022c_no_q_no_l`
- `pvmb_4022c_qpsa`
- `pvmb_4022c_no_load`
- `load_4022c`
- `pvmb_4022c`

### 4. Nonguaranteed / PBGC-funds outputs
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

### 5. Present-value outputs
- `pvf_lev_ann`
- `pvf_lev_ls`
- `pvf_qpsa_ls`
- `pvmb_term_no_q_no_l`
- `pvmb_term_qpsa`
- `pvmb_term_no_load`
- `term_load`
- `pvmb_term`

This module may also produce supporting intermediate quantities needed for traceability.

This module does **not**:
- choose between conflicting sources
- read OCR text
- classify documents
- draft memos
- assemble final deliverables
- make human judgment calls about unresolved ambiguity

---

## Input contract

## Required input groups

### 1. case_plan_timeline
Required fields:
- `case_id`
- `plan_id`
- `plan_anniversary`
- `dopt`
- `dotr`
- `bpd`
- `dobf`

### 2. resolved_plan_logic
Required fields:
- `normal_retirement_eligibility_rule`
- `normal_retirement_start_rule`
- `early_unreduced_retirement_rule`
- `early_reduced_retirement_rule`
- `deferred_vested_normal_retirement_rule`
- `deferred_vested_early_retirement_rule`
- `late_retirement_rule`
- `eligibility_service_rule`
- `vesting_service_rule`
- `benefit_service_rule`
- `accrued_benefit_formula`
- `accrual_factor_rule`
- `short_service_factor_rule`
- `compensation_definition_rule`
- `average_compensation_rule`
- `covered_compensation_rule`
- `pia_offset_rule`
- `supplemental_benefit_rule`
- `normal_single_form_rule`
- `normal_married_form_rule`
- `form_conversion_basis_rule`
- `early_retirement_adjustment_rule`
- `late_retirement_adjustment_rule`
- `suspension_of_benefits_rule`
- `disability_benefit_rule`
- `pre_retirement_death_benefit_rule`
- `post_retirement_death_benefit_rule`
- `vesting_schedule_rule`
- `cash_out_rule`
- `mandatory_employee_contribution_rule`
- `voluntary_employee_contribution_rule`
- `top_heavy_rule`
- `default_actuarial_equivalence_rule`
- `consensual_lump_sum_rule`
- `additional_provisions_of_note`

### 3. participant_role_population
Required fields:
- `bcv_rec_id`
- `custid`
- `retstat`
- `id`
- `role_type`
- `fname`
- `lname`
- `sfname`
- `slname`
- `psex`
- `ssex`
- `mstat`
- `dob`
- `sdob`
- `dod`
- `relation`
- `non_spouse_benf`
- `qdro_indicator`
- `qpsa_indicator`
- `five_percent_owner_indicator`
- `substantial_owner_indicator`
- `retirement_status_as_of_dopt`
- `payment_status_as_of_dopt`

### 4. service_employment_history
Required fields:
- `doh`
- `dop`
- `dote`
- `service_basis_code`
- `service_hours_requirement`
- `service_period_basis`
- `plan_anniversary_service_basis`
- `vesting_service_at_dopt`
- `benefit_service_at_dopt`
- `accrual_service_at_dopt`

### 5. compensation_accrual_inputs
Required fields:
- `compensation_basis_code`
- `average_compensation_period`
- `compensation_history_available_indicator`
- `final_average_compensation`
- `covered_compensation_amount`
- `frozen_accrued_benefit_indicator`
- `frozen_accrued_monthly_benefit`
- `accrued_benefit_at_dopt`
- `vested_percentage_at_dopt`

### 6. benefit_administration_state
Required fields:
- `dor`
- `asd`
- `sbcd`
- `current_form_code`
- `current_payment_amount`
- `payment_history_available_indicator`
- `check_register_available_indicator`
- `current_pay_status`
- `elected_form_indicator`
- `spouse_beneficiary_commencement_state`

### 7. actuarial_assumption_factor_set
Required fields:
- `assumption_set_id`
- `plan_factor_table_id`
- `interest_basis_code`
- `mortality_basis_code`
- `pre_retirement_mortality_code`
- `post_retirement_mortality_code`
- `retirement_age_convention`
- `form_conversion_method`
- `lookback_period`
- `stability_period`
- `required_beginning_date_method`
- `lump_sum_basis_code`
- `annuity_basis_code`

### 8. limitation_packet
Required fields:
- `calc_indicator`
- `calculation_context`
- `section_436_applicable_indicator`
- `bankruptcy_plan_indicator`
- `bpd_limitation_indicator`
- `majority_owner_limitation_indicator`
- `aggregate_limit_applicable_indicator`
- `accrued_at_termination_limitation_indicator`
- `phase_in_limitation_indicator`
- `vested_at_termination_limitation_indicator`
- `annuity_starting_date_limitation_indicator`
- `death_benefit_limitation_indicator`
- `form_of_benefit_limitation_indicator`
- `actuarial_equivalence_limitation_indicator`
- `ongoing_employment_contingency_indicator`

### 9. Upstream deterministic outputs
Required fields:

#### resolved_dates
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

#### resolved_service_compensation
- `eligibility_service_resolved`
- `vesting_service_resolved`
- `benefit_service_resolved`
- `accrual_service_resolved`
- `compensation_resolved`
- `average_compensation_resolved`
- `covered_compensation_resolved`

#### resolved_forms_status
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

---

## Conditional input groups

### section_436_packet
Required when:
- `section_436_applicable_indicator = true`

Fields:
- `plan_year`
- `aftap`
- `certification_date`
- `aftap_doc_id`
- `presumed_aftap_rule`
- `restriction_period_start`
- `restriction_period_end`

### aggregate_limit_packet
Required when:
- `aggregate_limit_applicable_indicator = true`

Fields:
- `prior_plan_indicator`
- `prior_plan_id`
- `prior_plan_dopt`
- `prior_plan_dotr`
- `prior_plan_termination_initiation_date`
- `prior_plan_benefit_payable_from_pbgc_funds`
- `current_plan_indicator`
- `aggregate_limit_payee_group_id`

### qdro_packet
Required when:
- `qdro_indicator = true`

Fields:
- `qdro_type`
- `separate_interest_indicator`
- `alternate_payee_name`
- `alternate_payee_dob`
- `qdro_effective_date`
- `qdro_award_description`

### qpsa_packet
Required when:
- `qpsa_indicator = true`

Fields:
- `participant_date_of_death`
- `qpsa_eligibility_date`
- `qpsa_commencement_date`
- `qpsa_form_rule`
- `qpsa_survivor_percentage`

### in_pay_packet
Required when:
- `current_pay_status = in_pay`

Fields:
- `form_code_ard`
- `spc_ard`
- `mths_ard`
- `lev_mb_ard`
- `current_monthly_benefit`
- `last_payment_date`

### death_benefit_packet
Required when:
- `dod` is not null
- or `role_type = beneficiary`

Fields:
- `death_before_commencement_indicator`
- `death_after_commencement_indicator`
- `survivor_type`
- `survivor_asd`
- `death_benefit_form`
- `death_benefit_amount`

### mandatory_employee_contribution_packet
Required when:
- mandatory employee contribution logic applies

Fields:
- `mec_balance`
- `mec_interest_basis`
- `mec_withdrawal_indicator`
- `mec_offset_rule`

### voluntary_employee_contribution_packet
Required when:
- voluntary employee contribution logic applies

Fields:
- `vec_balance`
- `vec_interest_basis`
- `vec_distribution_rule`

### disability_packet
Required when:
- disability logic applies

Fields:
- `disability_status`
- `disability_onset_date`
- `disability_benefit_start_date`
- `disability_benefit_amount_rule`

### asset_recovery_packet
Required when:
- full PBGC payable outputs are requested

Fields:
- `asset_value_at_dopt`
- `asset_statement_id`
- `section_4044_allocation_available_indicator`
- `section_4022c_amount_available_indicator`
- `sparr_indicator`
- `sparr_ratio`
- `recovery_ratio`
- `duec_indicator`
- `duec_amount`

### cash_balance_packet
Required when:
- the plan is cash-balance or other statutory hybrid requiring these fields

Fields:
- `initial_account_balance_rule`
- `benefit_credit_rule`
- `interest_credit_rule`
- `interest_credit_timing_rule`
- `annuity_conversion_factor_rule`
- `annuity_conversion_method_rule`

---

## Input assumptions

1. All input fields have already passed schema validation.
2. All input facts are already resolved.
3. All plan provisions are already normalized into controlled codes or controlled structured text.
4. Date strings are in ISO format `YYYY-MM-DD` or null.
5. Missing inputs are explicit nulls, not blank strings.
6. Source conflicts have already been handled upstream.
7. Upstream modules have already produced reviewed date, service, compensation, and form states.

---

## Deterministic rule hierarchy

The module must apply benefit logic in this order:

1. case timeline controls
2. resolved plan provisions
3. participant role and state
4. upstream date resolution
5. upstream service and compensation resolution
6. upstream form resolution
7. branch-specific logic:
   - in-pay path
   - deferred vested path
   - QPSA path
   - QDRO path
   - death-benefit path
   - disability path
8. plan benefit computation
9. legal limitation sequencing
10. Title Four and section 4022(c) layering
11. asset / recovery / load layering
12. present-value conversion

No raw-document reasoning is permitted inside the module.

---

## Mandatory calculation subfamilies

The module must support, at minimum:

### A. Plan benefit family
- normal retirement benefit in normal single form
- early reduced benefit
- early unreduced benefit
- late retirement benefit
- deferred vested benefit
- survivor benefit
- QPSA benefit
- lump-sum equivalents where applicable

### B. Limitation family
- accrued-at-termination
- phase-in
- vested-at-termination
- majority-owner
- annuity-starting-date
- death-benefit limitation
- form-of-benefit limitation
- actuarial-equivalence limitation
- ongoing-employment contingency
- section 436 restriction effects when applicable

### C. PBGC valuation family
- Title Four benefit
- section 4022(c) benefit
- termination benefit
- nonguaranteed / PBGC-funds quantities
- present values and loads

---

## Output contract

## Primary outputs

### plan_benefit_results
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

### title_iv_results
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

### section_4022c_results
- `xrd_mb_4022c`
- `pvmb_4022c_no_q_no_l`
- `pvmb_4022c_qpsa`
- `pvmb_4022c_no_load`
- `load_4022c`
- `pvmb_4022c`

### nonguaranteed_and_pbgc_funds_results
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

### present_value_results
- `pvf_lev_ann`
- `pvf_lev_ls`
- `pvf_qpsa_ls`
- `pvmb_term_no_q_no_l`
- `pvmb_term_qpsa`
- `pvmb_term_no_load`
- `term_load`
- `pvmb_term`

## Supporting outputs
- `benefit_kernel_rule_trace`
- `benefit_kernel_warning_flag`
- `benefit_kernel_warning_note`

---

## Output definitions

### `term_mb_nrd_nsf`
Resolved termination monthly benefit payable at normal retirement date in normal single form.

### `xrd_mb_term`
Resolved termination monthly benefit at the XRD valuation commencement point.

### `xrd_surv_mb_term`
Resolved survivor termination monthly benefit at the XRD valuation commencement point.

### `xrd_mb_qpsa_term`
Resolved QPSA termination monthly benefit at the XRD valuation commencement point.

### `ls_term`
Resolved termination lump-sum amount, if applicable.

### `ls_qpsa`
Resolved QPSA lump-sum amount, if applicable.

### `xrd_mb_title_iv`
Resolved Title Four monthly benefit at XRD.

### `pvmb_title_iv`
Resolved present value of Title Four benefit after applicable loads.

### `xrd_mb_4022c`
Resolved section 4022(c) monthly benefit at XRD.

### `pvmb_4022c`
Resolved present value of section 4022(c) benefit after applicable loads.

### `bnnfa_pvmb`
Resolved present value of basic nonguaranteed benefit / related nonguaranteed family after load layering.

### `pvpbl_ann_rates`
Resolved present value of benefits payable from PBGC funds using annuity-rate basis after loads.

### `pvmb_term`
Resolved present value of termination benefit after all required layers.

---

## Controlled behaviors

### Accrued-benefit behavior
The module must support at least these normalized formula families:
- final average pay formulas
- flat-dollar formulas
- integrated formulas
- offset formulas
- cash-balance or hybrid formulas through controlled branch logic
- frozen accrued-benefit support when recomputation is not fully possible

### Retirement adjustment behavior
The module must support:
- plan early retirement factors
- plan late retirement factors
- actuarial-equivalence-based adjustments
- subsidized and unsubsidized paths
- deferred-vested-specific paths

### Form-conversion behavior
The module must support:
- normal single form
- normal married form
- participant-in-pay form
- survivor forms
- QPSA forms
- lump-sum equivalents
- PBGC-prescribed intermediate form adjustments where required by policy

### Limitation behavior
The module must support:
- sequencing of all applicable limitations
- no-limitation path for plan-benefit outputs
- no-Q / no-load decomposition where required
- QPSA decomposition where required
- load layering where required

### Asset and recovery behavior
The module must support:
- no asset/recovery layer requested
- section 4044 allocation available
- section 4022(c) amount available
- SPARR / recovery ratio path
- DUEC flag presence

### Special-role behavior
The module must support:
- participant
- beneficiary
- alternate payee
- non-spouse beneficiary where applicable
- separate-interest QDRO path
- shared-payment QDRO path
- death before commencement
- death after commencement

---

## Error contract

The module must return structured errors, not silent failures.

### Hard errors
Examples:
- required upstream outputs missing
- unsupported normalized accrued-benefit rule
- required conditional packet missing
- inconsistent role path and branch packet
- negative present value where prohibited by the controlled method
- Title Four outputs requested without necessary legal context

### Soft warnings
Examples:
- frozen accrued benefit used because full recomputation is unavailable
- asset/recovery packet absent so PBGC payable outputs are partial
- QPSA indicators present but no survivor output requested
- in-pay evidence present but benefit recalculated under non-pay path for the selected context

---

## Required trace output

The module must record:

- input snapshot id or calculation run id
- rule version
- which rule branch produced each output
- whether override or frozen-benefit support was used
- which limitations were applied and in what sequence
- whether asset / recovery layering was applied
- whether any warning was raised

Minimum trace structure:

- `field_name`
- `rule_applied`
- `input_fields_used`
- `intermediate_values`
- `output_value`
- `warning_note`

---

## Purity requirement

`benefit_kernel` must be a pure deterministic transform:

`reviewed inputs + upstream resolved states -> benefit outputs`

It must have:
- no network access
- no file reads
- no OCR calls
- no random behavior
- no dependence on user interface state

---

## Function signature

Conceptual signature:

`evaluate_benefits(input_packet) -> benefit_kernel_output`

Where:

- `input_packet` contains only reviewed structured fields and upstream deterministic outputs
- `benefit_kernel_output` contains primary outputs, warnings, and trace

---

## Minimal example

### Input
```yaml
case_plan_timeline:
  dopt: "2024-06-30"
  dotr: "2024-09-01"
  bpd: null
  dobf: "2011-01-01"

resolved_plan_logic:
  accrued_benefit_formula: "1.5pct_final_avg_pay_x_service"
  normal_single_form_rule: "sla"
  normal_married_form_rule: "qjsa_50"
  early_reduced_retirement_rule: "age_55"
  early_retirement_adjustment_rule: "4pct_per_year"
  default_actuarial_equivalence_rule: "plan_default"

participant_role_population:
  retstat: "2"
  role_type: "participant"
  mstat: "S"
  dob: "1960-04-15"
  qdro_indicator: false
  qpsa_indicator: false

resolved_dates:
  nrd: "2025-05-01"
  erd: "2015-05-01"
  eurd: null
  eprd: "2015-05-01"
  xra: 65
  xrd: "2025-05-01"

resolved_service_compensation:
  benefit_service_resolved: 25
  accrual_service_resolved: 25
  average_compensation_resolved: 80000
  covered_compensation_resolved: null

resolved_forms_status:
  rettyp: "deferred_vested"
  form_code_nsf: "1"
  form_code_nmf: "2"
  lsoption: "N"
  annuity_status_pay: "not_in_pay"

limitation_packet:
  section_436_applicable_indicator: false
  bankruptcy_plan_indicator: false
  phase_in_limitation_indicator: true
  vested_at_termination_limitation_indicator: true
```

### Output
```yaml
plan_benefit_results:
  term_mb_nrd_nsf: 2500.00
  term_surv_mb_nrd: null
  term_surv_mb_eurd: null
  term_surv_mb_erd: null
  rbd_surv_mb_term: null
  term_surv_mb_ard: null
  xrd_mb_term: 2500.00
  xrd_surv_mb_term: null
  xrd_mb_qpsa_term: null
  ls_term: null
  ls_qpsa: null

present_value_results:
  pvmb_term_no_q_no_l: 198400.00
  pvmb_term_qpsa: null
  pvmb_term_no_load: 198400.00
  term_load: 0.00
  pvmb_term: 198400.00

benefit_kernel_warning_flag: "N"
benefit_kernel_warning_note: null
```

---

## Acceptance criteria

The module is acceptable at `v0.1.0` if:

1. It validates required and conditional inputs.
2. It consumes upstream resolved states without raw-document access.
3. It resolves all requested primary outputs deterministically.
4. It emits structured errors and warnings.
5. It emits rule trace output.
6. It is reproducible for the same reviewed input packet.

---

## Dependencies

Upstream:
- `pbgc_defined_benefit_input_schema v0.1.0`
- `resolved_fact_schema v0.1.0`
- `resolved_plan_provision_schema v0.1.0`
- `schema_field_source_map v0.1.0`
- `date_resolution_contract v0.1.0`
- `service_resolution_contract v0.1.0`
- `compensation_resolution_contract v0.1.0`
- `form_resolution_contract v0.1.0`

Downstream:
- `v1_ve_output`
- `valuation_listings_output`
- `bsrs_configuration_output`
- `actuarial_case_memo_support`

---

## Versioning rule

Breaking changes to:
- required inputs
- output field names
- output meanings
- error semantics

must increment MAJOR or MINOR according to repository versioning policy.

Non-breaking clarifications increment PATCH.
