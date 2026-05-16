# service_resolution_contract v0.1.0

## Purpose

Defines the deterministic contract for the `service_resolution` module.

This module resolves service quantities required downstream for vesting, accrual, retirement eligibility, deferred-vested eligibility, and related actuarial calculations.

It accepts only reviewed structured inputs from the deterministic boundary.
It does not read raw documents directly.

---

## Module name

`service_resolution`

## Module version

`0.1.0`

## Status

`deterministic_core_module`

---

## Scope

This module resolves:

- `eligibility_service_resolved`
- `vesting_service_resolved`
- `benefit_service_resolved`
- `accrual_service_resolved`

It may also produce supporting intermediate service quantities needed for traceability.

This module does **not**:

- choose between conflicting sources
- read OCR text
- calculate accrued benefits
- calculate present values
- calculate form-of-benefit amounts
- calculate compensation averages
- determine legal limitations directly

---

## Input contract

## Required input groups

### 1. case_plan_timeline
Required fields:
- `case_id`
- `plan_id`
- `plan_anniversary`
- `dopt`
- `bpd`
- `dobf`

### 2. resolved_plan_logic
Required fields:
- `participation_eligibility_rule`
- `participation_date_rule`
- `normal_retirement_eligibility_rule`
- `early_unreduced_retirement_rule`
- `early_reduced_retirement_rule`
- `deferred_vested_normal_retirement_rule`
- `deferred_vested_early_retirement_rule`
- `eligibility_service_rule`
- `vesting_service_rule`
- `benefit_service_rule`
- `accrued_benefit_formula`
- `accrual_factor_rule`
- `short_service_factor_rule`
- `transfer_rule`
- `one_year_break_in_service_rule`

### 3. participant_role_population
Required fields:
- `bcv_rec_id`
- `retstat`
- `id`
- `role_type`
- `retirement_status_as_of_dopt`

### 4. service_employment_history
Required fields:
- `doh`
- `dop`
- `dote`
- `service_basis_code`
- `service_hours_requirement`
- `service_period_basis`
- `plan_anniversary_service_basis`

### 5. actuarial_assumption_factor_set
Required fields:
- `retirement_age_convention`

### 6. limitation_packet
Required fields:
- `bankruptcy_plan_indicator`
- `bpd_limitation_indicator`
- `ongoing_employment_contingency_indicator`

---

## Conditional input groups

### service_segment_packet
Required when:
- full segmented history exists
- or the plan uses non-trivial service segmentation

Fields:
- `segment_start`
- `segment_end`
- `segment_type`
- `segment_hours`
- `segment_status`
- `segment_source`

### service_override_packet
Required when:
- reviewed database provides controlled service totals to be preferred over recomputation

Fields:
- `eligibility_service_override`
- `vesting_service_override`
- `benefit_service_override`
- `accrual_service_override`
- `override_basis_note`

### transfer_packet
Required when:
- `transfer_rule` is not null
- or transferred service exists

Fields:
- `transfer_service_amount`
- `transfer_effective_date`
- `transfer_source_note`

### break_in_service_packet
Required when:
- one-year-break or related break rules are applicable
- or reviewed facts indicate a break

Fields:
- `break_start_date`
- `break_end_date`
- `break_type`
- `break_resolution_note`

### frozen_accrual_packet
Required when:
- `dobf` is not null
- or accruals ceased before DOPT for plan-rule reasons

Fields:
- `accrual_freeze_date`
- `freeze_basis_note`

---

## Input assumptions

1. All input fields have already passed schema validation.
2. All input facts are already resolved.
3. Service rules are already normalized into controlled codes or controlled structured text.
4. Date strings are in ISO format `YYYY-MM-DD` or null.
5. Missing inputs are explicit nulls, not blank strings.
6. Source conflicts have already been handled upstream.

---

## Deterministic rule hierarchy

The module must apply service logic in this order:

1. case timeline controls
2. resolved plan service provisions
3. participant employment and participation dates
4. segmented service history if available
5. approved service overrides if explicitly provided
6. freeze and break rules
7. bankruptcy-date substitution where required by downstream legal context

No raw-document reasoning is permitted inside the module.

---

## Output contract

## Primary outputs

### resolved_service_compensation
- `eligibility_service_resolved`
- `vesting_service_resolved`
- `benefit_service_resolved`
- `accrual_service_resolved`

## Supporting outputs
- `service_resolution_rule_trace`
- `service_resolution_warning_flag`
- `service_resolution_warning_note`

---

## Output definitions

### `eligibility_service_resolved`
Service counted for eligibility or participation purposes under the governing plan regime.

### `vesting_service_resolved`
Service counted for vesting purposes under the governing plan regime.

### `benefit_service_resolved`
Service counted for benefit formula purposes under the governing plan regime.

### `accrual_service_resolved`
Service counted for accrual formula purposes under the governing plan regime.

---

## Controlled behaviors

### Service basis behavior
The module must support at least these normalized service bases:
- calendar-year basis
- plan-year basis
- anniversary basis
- exact elapsed-time basis
- monthly hours basis
- weekly hours basis

### Hours requirement behavior
The module must support at least these normalized rule shapes:
- full year at threshold hours
- partial service via service array
- exact service when threshold does not apply
- explicit override totals from reviewed database

### Freeze behavior
The module must support:
- no freeze
- benefit freeze before DOPT
- accrual cutoff at DOPT
- separate freeze affecting accrual but not vesting

### Break behavior
The module must support:
- no break
- one-year break in service
- ignored break when project assumptions remove break effects
- explicit override after review

### Transfer behavior
The module must support:
- no transfer
- additive transferred service
- controlled transferred service override
- transfer excluded from one or more service categories

---

## Error contract

The module must return structured errors, not silent failures.

### Hard errors
Examples:
- missing `doh`
- missing `dopt`
- invalid date ordering such as `doh > dote`
- unsupported normalized service rule
- required conditional packet missing
- service segment end before segment start

### Soft warnings
Examples:
- `dop` missing but eligibility service still computable
- `dote` null for active participant at DOPT
- service overrides present but not used
- break packet present while project assumptions suppress break effects

---

## Required trace output

The module must record:

- input snapshot id or calculation run id
- rule version
- which rule branch produced each output
- whether service override was used
- whether freeze logic was used
- whether any warning was raised

Minimum trace structure:

- `field_name`
- `rule_applied`
- `input_fields_used`
- `output_value`
- `warning_note`

---

## Purity requirement

`service_resolution` must be a pure deterministic transform:

`reviewed inputs -> resolved service outputs`

It must have:
- no network access
- no file reads
- no OCR calls
- no random behavior
- no dependence on user interface state

---

## Function signature

Conceptual signature:

`resolve_service(input_packet) -> service_resolution_output`

Where:

- `input_packet` contains only reviewed structured fields
- `service_resolution_output` contains primary outputs, warnings, and trace

---

## Minimal example

### Input
```yaml
case_plan_timeline:
  plan_anniversary: "0101"
  dopt: "2024-06-30"
  bpd: null
  dobf: "2011-01-01"

resolved_plan_logic:
  participation_eligibility_rule: "age_21_and_1_year_service"
  participation_date_rule: "next_plan_anniversary"
  normal_retirement_eligibility_rule: "age_65"
  early_unreduced_retirement_rule: null
  early_reduced_retirement_rule: "age_55"
  deferred_vested_normal_retirement_rule: "age_65"
  deferred_vested_early_retirement_rule: "age_55"
  eligibility_service_rule: "plan_year_1000_hours"
  vesting_service_rule: "plan_year_1000_hours"
  benefit_service_rule: "plan_year_1000_hours"
  accrued_benefit_formula: "1.5pct_final_avg_pay_x_service"
  accrual_factor_rule: null
  short_service_factor_rule: null
  transfer_rule: null
  one_year_break_in_service_rule: "ignore"

participant_role_population:
  retstat: "2"
  id: "1"
  role_type: "participant"
  retirement_status_as_of_dopt: "deferred_vested"

service_employment_history:
  doh: "1985-07-01"
  dop: "1986-01-01"
  dote: "2010-12-31"
  service_basis_code: "plan_year_1000_hours"
  service_hours_requirement: 1000
  service_period_basis: "plan_anniversary"
  plan_anniversary_service_basis: "0101"

actuarial_assumption_factor_set:
  retirement_age_convention: "first_of_month_on_or_after"

limitation_packet:
  bankruptcy_plan_indicator: false
  bpd_limitation_indicator: false
  ongoing_employment_contingency_indicator: false
```

### Output
```yaml
resolved_service_compensation:
  eligibility_service_resolved: 25
  vesting_service_resolved: 25
  benefit_service_resolved: 25
  accrual_service_resolved: 25

service_resolution_warning_flag: "N"
service_resolution_warning_note: null
```

---

## Acceptance criteria

The module is acceptable at `v0.1.0` if:

1. It validates required and conditional service inputs.
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

Downstream:
- `compensation_resolution`
- `form_resolution`
- `benefit_kernel`
- `v1_ve_output`
- `valuation_listings_output`

---

## Versioning rule

Breaking changes to:
- required inputs
- output field names
- output meanings
- error semantics

must increment MAJOR or MINOR according to repository versioning policy.

Non-breaking clarifications increment PATCH.
