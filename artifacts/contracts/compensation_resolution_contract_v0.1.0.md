# compensation_resolution_contract v0.1.0

## Purpose

Defines the deterministic contract for the `compensation_resolution` module.

This module resolves compensation quantities required downstream for accrual formulas, average compensation formulas, integration features, frozen-benefit support, and related actuarial calculations.

It accepts only reviewed structured inputs from the deterministic boundary.
It does not read raw documents directly.

---

## Module name

`compensation_resolution`

## Module version

`0.1.0`

## Status

`deterministic_core_module`

---

## Scope

This module resolves:

- `compensation_resolved`
- `average_compensation_resolved`
- `covered_compensation_resolved`

It may also produce supporting intermediate compensation quantities needed for traceability.

This module does **not**:

- choose between conflicting sources
- read OCR text
- calculate service
- calculate accrued benefits
- calculate present values
- determine form-of-benefit amounts
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
- `accrued_benefit_formula`
- `compensation_definition_rule`
- `average_compensation_rule`
- `covered_compensation_rule`
- `pia_offset_rule`
- `eligibility_service_rule`
- `benefit_service_rule`
- `accrual_factor_rule`
- `short_service_factor_rule`

### 3. participant_role_population
Required fields:
- `bcv_rec_id`
- `retstat`
- `id`
- `role_type`
- `dob`
- `retirement_status_as_of_dopt`

### 4. service_employment_history
Required fields:
- `doh`
- `dop`
- `dote`

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

### 7. limitation_packet
Required fields:
- `bankruptcy_plan_indicator`
- `bpd_limitation_indicator`

---

## Conditional input groups

### compensation_history_packet
Required when:
- `compensation_history_available_indicator = true`
- and compensation must be recomputed from history

Fields:
- `compensation_period_start`
- `compensation_period_end`
- `compensation_amount`
- `compensation_type`
- `annualization_flag`
- `source_note`

### average_compensation_override_packet
Required when:
- reviewed database provides controlled final-average or career-average compensation to be preferred over recomputation

Fields:
- `average_compensation_override`
- `override_basis_note`

### covered_compensation_packet
Required when:
- `covered_compensation_rule` is not null
- or the plan is integrated

Fields:
- `covered_compensation_year`
- `covered_compensation_table_id`
- `covered_compensation_override`
- `covered_compensation_basis_note`

### compensation_limit_packet
Required when:
- compensation must reflect statutory or plan-imposed caps

Fields:
- `compensation_limit_year`
- `compensation_limit_amount`
- `compensation_limit_basis_note`

### frozen_benefit_support_packet
Required when:
- `frozen_accrued_benefit_indicator = true`

Fields:
- `freeze_basis_note`
- `frozen_accrual_date`
- `frozen_benefit_support_source`

### pia_offset_packet
Required when:
- `pia_offset_rule` is not null

Fields:
- `pia_amount`
- `pia_basis_year`
- `pia_assumption_note`

---

## Input assumptions

1. All input fields have already passed schema validation.
2. All input facts are already resolved.
3. Compensation rules are already normalized into controlled codes or controlled structured text.
4. Date strings are in ISO format `YYYY-MM-DD` or null.
5. Missing inputs are explicit nulls, not blank strings.
6. Source conflicts have already been handled upstream.

---

## Deterministic rule hierarchy

The module must apply compensation logic in this order:

1. case timeline controls
2. resolved plan compensation provisions
3. participant employment and retirement timing
4. compensation history if available
5. approved average-compensation or covered-compensation overrides if explicitly provided
6. statutory or plan compensation limits
7. freeze-support logic if full compensation history is unavailable
8. bankruptcy-date substitution where required by downstream legal context

No raw-document reasoning is permitted inside the module.

---

## Output contract

## Primary outputs

### resolved_service_compensation
- `compensation_resolved`
- `average_compensation_resolved`
- `covered_compensation_resolved`

## Supporting outputs
- `compensation_resolution_rule_trace`
- `compensation_resolution_warning_flag`
- `compensation_resolution_warning_note`

---

## Output definitions

### `compensation_resolved`
Resolved compensation basis quantity used by the governing accrued-benefit formula.

### `average_compensation_resolved`
Resolved average compensation quantity under the governing averaging method.

### `covered_compensation_resolved`
Resolved covered compensation quantity used for integrated formulas or related offsets.

---

## Controlled behaviors

### Compensation basis behavior
The module must support at least these normalized compensation bases:
- final average pay
- career average pay
- highest consecutive years
- highest non-consecutive years
- current pay at termination
- explicit frozen amount support

### Average compensation behavior
The module must support at least these normalized rule shapes:
- fixed N-year average
- highest consecutive N-year average
- highest non-consecutive N-year average
- annualized partial-year handling
- reviewed override from prior administrator data

### Covered compensation behavior
The module must support:
- no covered compensation
- table-based covered compensation
- plan-provided covered compensation
- reviewed override quantity

### Freeze-support behavior
The module must support:
- no freeze support needed
- frozen accrued monthly benefit supported directly
- final average compensation supported directly
- incomplete payroll history requiring reviewed override instead of recomputation

### Compensation-limit behavior
The module must support:
- no cap
- statutory cap by year
- plan-imposed cap
- reviewed override after cap application

---

## Error contract

The module must return structured errors, not silent failures.

### Hard errors
Examples:
- missing compensation inputs when no accepted override exists
- unsupported normalized compensation rule
- required conditional packet missing
- compensation period end before period start
- covered compensation required but unavailable

### Soft warnings
Examples:
- compensation history unavailable but reviewed override used
- covered compensation packet present for non-integrated plan
- frozen benefit support used because payroll history is incomplete
- partial-year annualization rule present but not needed

---

## Required trace output

The module must record:

- input snapshot id or calculation run id
- rule version
- which rule branch produced each output
- whether override or freeze-support logic was used
- whether compensation caps were applied
- whether any warning was raised

Minimum trace structure:

- `field_name`
- `rule_applied`
- `input_fields_used`
- `output_value`
- `warning_note`

---

## Purity requirement

`compensation_resolution` must be a pure deterministic transform:

`reviewed inputs -> resolved compensation outputs`

It must have:
- no network access
- no file reads
- no OCR calls
- no random behavior
- no dependence on user interface state

---

## Function signature

Conceptual signature:

`resolve_compensation(input_packet) -> compensation_resolution_output`

Where:

- `input_packet` contains only reviewed structured fields
- `compensation_resolution_output` contains primary outputs, warnings, and trace

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
  accrued_benefit_formula: "1.5pct_final_avg_pay_x_service"
  compensation_definition_rule: "base_wages_only"
  average_compensation_rule: "highest_consecutive_5_years"
  covered_compensation_rule: null
  pia_offset_rule: null
  eligibility_service_rule: "plan_year_1000_hours"
  benefit_service_rule: "plan_year_1000_hours"
  accrual_factor_rule: null
  short_service_factor_rule: null

participant_role_population:
  retstat: "2"
  id: "1"
  role_type: "participant"
  dob: "1960-04-15"
  retirement_status_as_of_dopt: "deferred_vested"

service_employment_history:
  doh: "1985-07-01"
  dop: "1986-01-01"
  dote: "2010-12-31"

compensation_accrual_inputs:
  compensation_basis_code: "final_average_pay"
  average_compensation_period: "5_year"
  compensation_history_available_indicator: true
  final_average_compensation: 80000
  covered_compensation_amount: null
  frozen_accrued_benefit_indicator: false
  frozen_accrued_monthly_benefit: null
  accrued_benefit_at_dopt: null
  vested_percentage_at_dopt: 1.0

benefit_administration_state:
  dor: null
  asd: null

limitation_packet:
  bankruptcy_plan_indicator: false
  bpd_limitation_indicator: false
```

### Output
```yaml
resolved_service_compensation:
  compensation_resolved: 80000
  average_compensation_resolved: 80000
  covered_compensation_resolved: null

compensation_resolution_warning_flag: "N"
compensation_resolution_warning_note: null
```

---

## Acceptance criteria

The module is acceptable at `v0.1.0` if:

1. It validates required and conditional compensation inputs.
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

Downstream:
- `benefit_kernel`
- `form_resolution`
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
