# date_resolution_contract v0.1.0

## Purpose

Defines the deterministic contract for the `date_resolution` module.

This module resolves all core dates required downstream for benefit eligibility, commencement logic, valuation timing, limitation timing, and administrative programming.

It accepts only reviewed structured inputs from the deterministic boundary.
It does not read raw documents directly.

---

## Module name

`date_resolution`

## Module version

`0.1.0`

## Status

`deterministic_core_module`

---

## Scope

This module resolves:

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

It may also produce supporting intermediate dates needed for traceability.

This module does **not**:

- calculate service
- calculate accrued benefits
- calculate present values
- determine form-of-benefit amounts
- read OCR text
- choose between conflicting sources

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

### 2. resolved_plan_logic
Required fields:
- `normal_retirement_eligibility_rule`
- `normal_retirement_start_rule`
- `early_unreduced_retirement_rule`
- `early_reduced_retirement_rule`
- `deferred_vested_normal_retirement_rule`
- `deferred_vested_early_retirement_rule`
- `late_retirement_rule`
- `default_actuarial_equivalence_rule`

### 3. participant_role_population
Required fields:
- `bcv_rec_id`
- `retstat`
- `id`
- `role_type`
- `dob`
- `sdob`
- `dod`
- `non_spouse_benf`
- `retirement_status_as_of_dopt`

### 4. service_employment_history
Required fields:
- `doh`
- `dop`
- `dote`

### 5. benefit_administration_state
Required fields:
- `dor`
- `asd`
- `sbcd`
- `current_pay_status`

### 6. actuarial_assumption_factor_set
Required fields:
- `retirement_age_convention`
- `required_beginning_date_method`

### 7. limitation_packet
Required fields:
- `bankruptcy_plan_indicator`
- `bpd_limitation_indicator`
- `annuity_starting_date_limitation_indicator`

---

## Conditional input groups

### qpsa_packet
Required when:
- `qpsa_indicator = true`

Fields:
- `participant_date_of_death`
- `qpsa_eligibility_date`
- `qpsa_commencement_date`

### death_benefit_packet
Required when:
- `dod` is not null
- or `role_type` is beneficiary

Fields:
- `death_before_commencement_indicator`
- `death_after_commencement_indicator`
- `survivor_asd`

### qdro_packet
Required when:
- `qdro_indicator = true`

Fields:
- `separate_interest_indicator`
- `qdro_effective_date`

---

## Input assumptions

1. All input fields have already passed schema validation.
2. All input facts are already resolved.
3. Plan logic rules are already normalized into controlled codes or controlled structured text.
4. Date strings are in ISO format `YYYY-MM-DD` or null.
5. Missing inputs are explicit nulls, not blank strings.

---

## Deterministic rule hierarchy

The module must apply date logic in this order:

1. case timeline controls
2. resolved plan provisions
3. participant role and status
4. death and survivor state
5. QPSA or qualified domestic relations order branch rules
6. PBGC date-policy overrides where contract requires them

No raw-document reasoning is permitted inside the module.

---

## Output contract

## Primary outputs

### resolved_dates
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

## Supporting outputs
- `date_resolution_rule_trace`
- `date_resolution_warning_flag`
- `date_resolution_warning_note`

---

## Output definitions

### `nrd`
Normal retirement date resolved under the governing plan regime.

### `erd`
Earliest reduced retirement date resolved under the governing plan regime.

### `eurd`
Earliest unreduced retirement date resolved under the governing plan regime.

### `eprd`
Earliest PBGC retirement date or equivalent controlled date used for downstream Title Four logic.

### `rbd`
Required beginning date under the selected PBGC or plan-controlled method.

### `xra`
Resolved retirement age used for the XRD or valuation commencement context.

### `xrd`
Resolved retirement date used for the XRD or valuation commencement context.

### `sxra`
Resolved survivor retirement age or spouse-related age used in downstream survivor calculations.

### `term_lw_xra`
Termination-listing working age for XRA-related downstream outputs.

### `term_lw_anb`
Termination-listing age-nearest-birthday used for downstream outputs.

---

## Controlled behaviors

### NRD behavior
The module must support at least these normalized rule shapes:
- fixed age
- first of month on or after fixed age
- first of month next following fixed age
- plan anniversary nearest fixed age

### Early retirement behavior
The module must support at least these normalized rule shapes:
- age-only threshold
- age and service threshold
- deferred-vested-specific threshold
- separate unreduced and reduced thresholds

### RBD behavior
The module must support PBGC-style required beginning date logic using:
- `retstat`
- `dopt`
- participant or beneficiary type
- `dob`
- `dote`
- `dod`
- `five_percent_owner_indicator`
- `non_spouse_benf`

### Death and survivor behavior
The module must support:
- participant alive at DOPT
- participant deceased before commencement
- participant deceased after commencement
- spouse beneficiary
- non-spouse beneficiary
- QPSA commencement branch

---

## Error contract

The module must return structured errors, not silent failures.

### Hard errors
Examples:
- missing `dob`
- missing `dopt`
- invalid date ordering such as `dob > dote`
- required conditional branch inputs missing
- unsupported normalized rule code

### Soft warnings
Examples:
- `dop` missing but not needed for a given rule
- `bpd` null in non-bankruptcy case
- survivor-related fields present for participant-only path

---

## Required trace output

The module must record:

- input snapshot id or calculation run id
- rule version
- which rule branch produced each output
- whether PBGC policy override was used
- whether any warning was raised

Minimum trace structure:

- `field_name`
- `rule_applied`
- `input_fields_used`
- `output_value`
- `warning_note`

---

## Purity requirement

`date_resolution` must be a pure deterministic transform:

`reviewed inputs -> resolved dates`

It must have:
- no network access
- no file reads
- no OCR calls
- no random behavior
- no dependence on user interface state

---

## Function signature

Conceptual signature:

`resolve_dates(input_packet) -> date_resolution_output`

Where:

- `input_packet` contains only reviewed structured fields
- `date_resolution_output` contains primary outputs, warnings, and trace

---

## Minimal example

### Input
```yaml
case_plan_timeline:
  plan_anniversary: "0101"
  dopt: "2024-06-30"
  dotr: "2024-09-01"
  bpd: null

resolved_plan_logic:
  normal_retirement_eligibility_rule: "age_65"
  normal_retirement_start_rule: "first_of_month_on_or_after"
  early_unreduced_retirement_rule: null
  early_reduced_retirement_rule: "age_55"
  deferred_vested_normal_retirement_rule: "age_65"
  deferred_vested_early_retirement_rule: "age_55"
  late_retirement_rule: "after_nrd"
  default_actuarial_equivalence_rule: "plan_default"

participant_role_population:
  retstat: "2"
  id: "1"
  role_type: "participant"
  dob: "1960-04-15"
  sdob: null
  dod: null
  non_spouse_benf: "N"
  retirement_status_as_of_dopt: "deferred_vested"

service_employment_history:
  doh: "1985-07-01"
  dop: "1986-01-01"
  dote: "2010-12-31"

benefit_administration_state:
  dor: null
  asd: null
  sbcd: null
  current_pay_status: "not_in_pay"

actuarial_assumption_factor_set:
  retirement_age_convention: "first_of_month_on_or_after"
  required_beginning_date_method: "pbgc_default"

limitation_packet:
  bankruptcy_plan_indicator: false
  bpd_limitation_indicator: false
  annuity_starting_date_limitation_indicator: true
```

### Output
```yaml
resolved_dates:
  nrd: "2025-05-01"
  erd: "2015-05-01"
  eurd: null
  eprd: "2015-05-01"
  rbd: "2032-04-01"
  xra: 65
  xrd: "2025-05-01"
  sxra: null
  term_lw_xra: 65
  term_lw_anb: 64

date_resolution_warning_flag: "N"
date_resolution_warning_note: null
```

---

## Acceptance criteria

The module is acceptable at `v0.1.0` if:

1. It validates required and conditional date inputs.
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

Downstream:
- `service_resolution`
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
