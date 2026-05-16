# form_resolution_contract v0.1.0

## Purpose

Defines the deterministic contract for the `form_resolution` module.

This module resolves the payable and valuation-relevant form-of-benefit state required downstream for benefit calculations, survivor handling, statement programming, valuation listings, and V1 or VE outputs.

It accepts only reviewed structured inputs from the deterministic boundary.
It does not read raw documents directly.

---

## Module name

`form_resolution`

## Module version

`0.1.0`

## Status

`deterministic_core_module`

---

## Scope

This module resolves:

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

It may also produce supporting intermediate form-state quantities needed for traceability.

This module does **not**:

- choose between conflicting sources
- read OCR text
- calculate service
- calculate compensation
- calculate accrued benefits
- calculate present values
- determine legal limitations directly
- determine final monthly benefit amounts

---

## Input contract

## Required input groups

### 1. case_plan_timeline
Required fields:
- `case_id`
- `plan_id`
- `dopt`
- `bpd`
- `dobf`

### 2. resolved_plan_logic
Required fields:
- `normal_single_form_rule`
- `normal_married_form_rule`
- `form_conversion_basis_rule`
- `pre_retirement_death_benefit_rule`
- `post_retirement_death_benefit_rule`
- `consensual_lump_sum_rule`
- `default_actuarial_equivalence_rule`

### 3. participant_role_population
Required fields:
- `bcv_rec_id`
- `retstat`
- `id`
- `role_type`
- `mstat`
- `psex`
- `ssex`
- `dod`
- `relation`
- `non_spouse_benf`
- `qdro_indicator`
- `qpsa_indicator`
- `retirement_status_as_of_dopt`
- `payment_status_as_of_dopt`

### 4. benefit_administration_state
Required fields:
- `dor`
- `asd`
- `sbcd`
- `current_form_code`
- `current_payment_amount`
- `current_pay_status`
- `elected_form_indicator`
- `spouse_beneficiary_commencement_state`

### 5. actuarial_assumption_factor_set
Required fields:
- `form_conversion_method`
- `lump_sum_basis_code`
- `annuity_basis_code`

### 6. limitation_packet
Required fields:
- `annuity_starting_date_limitation_indicator`
- `death_benefit_limitation_indicator`
- `form_of_benefit_limitation_indicator`
- `actuarial_equivalence_limitation_indicator`

---

## Conditional input groups

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

### qpsa_packet
Required when:
- `qpsa_indicator = true`

Fields:
- `participant_date_of_death`
- `qpsa_eligibility_date`
- `qpsa_commencement_date`
- `qpsa_form_rule`
- `qpsa_survivor_percentage`

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
- mandatory employee contribution logic affects form handling

Fields:
- `mec_balance`
- `mec_interest_basis`
- `mec_withdrawal_indicator`
- `mec_offset_rule`

### voluntary_employee_contribution_packet
Required when:
- voluntary employee contribution logic affects form handling

Fields:
- `vec_balance`
- `vec_interest_basis`
- `vec_distribution_rule`

---

## Input assumptions

1. All input fields have already passed schema validation.
2. All input facts are already resolved.
3. Form rules are already normalized into controlled codes or controlled structured text.
4. Date strings are in ISO format `YYYY-MM-DD` or null.
5. Missing inputs are explicit nulls, not blank strings.
6. Source conflicts have already been handled upstream.

---

## Deterministic rule hierarchy

The module must apply form logic in this order:

1. case timeline controls
2. resolved plan form provisions
3. participant role, marital, and death state
4. current pay status and current form evidence
5. QPSA and qualified domestic relations order branch rules
6. death-benefit form rules
7. lump-sum option rules
8. PBGC form-policy overrides where contract requires them

No raw-document reasoning is permitted inside the module.

---

## Output contract

## Primary outputs

### resolved_forms_status
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

## Supporting outputs
- `form_resolution_rule_trace`
- `form_resolution_warning_flag`
- `form_resolution_warning_note`

---

## Output definitions

### `rettyp`
Resolved retirement-type code used downstream for valuation and administration context.

### `form_code_nsf`
Resolved normal single form code under the governing plan regime.

### `form_code_nmf`
Resolved normal married form code under the governing plan regime.

### `form_code_ptp`
Resolved participant-in-pay form code.

### `form_code_ptp_qpsa`
Resolved participant-in-pay QPSA-related form code where applicable.

### `form_code_death`
Resolved death-benefit form code used for survivor or death-benefit paths.

### `annuity_status_pay`
Resolved annuity payment status classification used downstream.

### `lsoption`
Resolved lump-sum-option indicator or code.

### `bs_ind`
Resolved benefit-statement programming indicator.

### `br_ind`
Resolved benefit-recalculation programming indicator.

### `ofa_indicator`
Resolved optional-form-available indicator or code.

---

## Controlled behaviors

### Normal form behavior
The module must support at least these normalized normal-form patterns:
- single life annuity
- qualified joint and survivor annuity
- automatic unmarried form
- automatic married form
- certain-and-continuous form
- level-income option
- reviewed coded form from prior administrator data

### In-pay behavior
The module must support:
- not in pay
- participant in pay
- beneficiary in pay
- alternate payee in pay
- participant died after commencement and survivor now in pay

### Death-form behavior
The module must support:
- no death form
- QPSA form
- QJSA survivor form
- separate pre-retirement lump-sum death form
- post-retirement death form
- non-spouse beneficiary path where supported

### Qualified domestic relations order behavior
The module must support:
- no qualified domestic relations order
- shared-payment context
- separate-interest context
- survivor-right carveout where applicable

### Lump-sum behavior
The module must support:
- no lump-sum option
- consensual lump sum
- automatic de minimis cashout
- death-benefit lump sum
- contribution-related lump-sum component

### PBGC override behavior
The module must support:
- plan form preserved
- PBGC-allowed form substitution
- no lump sum before trusteeship when policy prohibits it in that context
- limitation-driven suppression of exotic or unsupported forms

---

## Error contract

The module must return structured errors, not silent failures.

### Hard errors
Examples:
- unsupported normalized form rule
- missing married-form rule when marital-state path requires it
- required conditional packet missing
- conflicting in-pay indicators that cannot be reconciled at this stage
- QDRO path requested without QDRO packet

### Soft warnings
Examples:
- current form evidence exists but normal-form path is being used
- survivor-related fields present for participant-only path
- lump-sum option present but limitation packet indicates it may not be payable
- reviewed form code supplied but does not match normalized plan form family

---

## Required trace output

The module must record:

- input snapshot id or calculation run id
- rule version
- which rule branch produced each output
- whether current pay-form evidence was used
- whether PBGC form override was used
- whether any warning was raised

Minimum trace structure:

- `field_name`
- `rule_applied`
- `input_fields_used`
- `output_value`
- `warning_note`

---

## Purity requirement

`form_resolution` must be a pure deterministic transform:

`reviewed inputs -> resolved form outputs`

It must have:
- no network access
- no file reads
- no OCR calls
- no random behavior
- no dependence on user interface state

---

## Function signature

Conceptual signature:

`resolve_forms(input_packet) -> form_resolution_output`

Where:

- `input_packet` contains only reviewed structured fields
- `form_resolution_output` contains primary outputs, warnings, and trace

---

## Minimal example

### Input
```yaml
case_plan_timeline:
  dopt: "2024-06-30"
  bpd: null
  dobf: "2011-01-01"

resolved_plan_logic:
  normal_single_form_rule: "sla"
  normal_married_form_rule: "qjsa_50"
  form_conversion_basis_rule: "plan_aeq"
  pre_retirement_death_benefit_rule: "qpsa"
  post_retirement_death_benefit_rule: "qjsa_survivor"
  consensual_lump_sum_rule: "not_available"
  default_actuarial_equivalence_rule: "plan_default"

participant_role_population:
  retstat: "2"
  id: "1"
  role_type: "participant"
  mstat: "S"
  psex: "F"
  ssex: null
  dod: null
  relation: null
  non_spouse_benf: "N"
  qdro_indicator: false
  qpsa_indicator: false
  retirement_status_as_of_dopt: "deferred_vested"
  payment_status_as_of_dopt: "not_in_pay"

benefit_administration_state:
  dor: null
  asd: null
  sbcd: null
  current_form_code: null
  current_payment_amount: null
  current_pay_status: "not_in_pay"
  elected_form_indicator: false
  spouse_beneficiary_commencement_state: null

actuarial_assumption_factor_set:
  form_conversion_method: "plan_aeq"
  lump_sum_basis_code: "plan_aeq"
  annuity_basis_code: "plan_aeq"

limitation_packet:
  annuity_starting_date_limitation_indicator: true
  death_benefit_limitation_indicator: true
  form_of_benefit_limitation_indicator: true
  actuarial_equivalence_limitation_indicator: true
```

### Output
```yaml
resolved_forms_status:
  rettyp: "deferred_vested"
  form_code_nsf: "1"
  form_code_nmf: "2"
  form_code_ptp: null
  form_code_ptp_qpsa: null
  form_code_death: "QPSA"
  annuity_status_pay: "not_in_pay"
  lsoption: "N"
  bs_ind: "Y"
  br_ind: "N"
  ofa_indicator: "Y"

form_resolution_warning_flag: "N"
form_resolution_warning_note: null
```

---

## Acceptance criteria

The module is acceptable at `v0.1.0` if:

1. It validates required and conditional form inputs.
2. It resolves all primary outputs deterministically.
3. It emits structured errors and warnings.
4. It emits rule trace output.
5. It runs without raw-document access.
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

Downstream:
- `benefit_kernel`
- `v1_ve_output`
- `valuation_listings_output`
- `bsrs_configuration_output`

---

## Versioning rule

Breaking changes to:
- required inputs
- output field names
- output meanings
- error semantics

must increment MAJOR or MINOR according to repository versioning policy.

Non-breaking clarifications increment PATCH.
