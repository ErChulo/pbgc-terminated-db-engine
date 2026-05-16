# bsrs_configuration_output_contract v0.1.0

## Purpose

Defines the deterministic contract for the `bsrs_configuration_output` module.

This module transforms reviewed inputs and upstream deterministic outputs into the structured configuration packet required for Benefit Statement and Retirement Statement programming support.

It accepts only reviewed structured inputs and upstream deterministic outputs from the deterministic boundary.
It does not read raw documents directly.

---

## Module name

`bsrs_configuration_output`

## Module version

`0.1.0`

## Status

`deterministic_output_adapter`

---

## Scope

This module resolves, at minimum, these Benefit Statement and Retirement Statement configuration-facing output families:

### 1. Row identity and control outputs
- `case_id`
- `plan_id`
- `bcv_rec_id`
- `custid`
- `retstat`
- `id`
- `calc_indicator`
- `calculation_context`

### 2. Person and role outputs
- `role_type`
- `fname`
- `lname`
- `sfname`
- `slname`
- `psex`
- `ssex`
- `mstat`
- `relation`
- `non_spouse_benf`

### 3. Date outputs
- `dob`
- `sdob`
- `dod`
- `doh`
- `dop`
- `dote`
- `dor`
- `asd`
- `sbcd`
- `nrd`
- `erd`
- `eurd`
- `eprd`
- `rbd`
- `xra`
- `xrd`
- `sxra`

### 4. Form and payment-state outputs
- `current_form_code`
- `form_code_nsf`
- `form_code_nmf`
- `form_code_ptp`
- `form_code_ptp_qpsa`
- `form_code_death`
- `form_code_ard`
- `spc_ard`
- `mths_ard`
- `lev_mb_ard`
- `annuity_status_pay`
- `lsoption`
- `rettyp`
- `bs_ind`
- `br_ind`
- `ofa_indicator`

### 5. Statement amount outputs
- `term_mb_nrd_nsf`
- `xrd_mb_term`
- `xrd_surv_mb_term`
- `xrd_mb_qpsa_term`
- `xrd_mb_title_iv`
- `xrd_mb_4022c`
- `current_payment_amount`
- `ls_term`
- `ls_qpsa`

### 6. Present-value and support outputs
- `pvmb_term`
- `pvmb_title_iv`
- `pvmb_4022c`
- `pvf_lev_ann`
- `pvf_lev_ls`
- `pvf_qpsa_ls`

### 7. Statement-programming control outputs
- `statement_population_indicator`
- `statement_type_code`
- `statement_status_code`
- `benefit_effective_date_for_statement`
- `display_form_code`
- `display_monthly_amount`
- `display_survivor_amount`
- `display_lump_sum_amount`
- `recalculation_trigger_indicator`
- `recalculation_reason_code`
- `suppress_statement_indicator`
- `suppression_reason_code`

### 8. Trace outputs
- `ce_track1`
- `ce_track2`
- `ce_track3`
- `ce_track4`
- `ce_track5`
- `ce_track6`
- `rule_trace_id`
- `calculation_run_id`
- `deliverable_version`
- `schema_version`

This module may also produce supporting technical outputs needed for configuration assembly, letter-program routing, and traceability.

This module does **not**:
- choose between conflicting sources
- read OCR text
- calculate benefits from scratch
- determine plan provisions
- determine source precedence
- draft statement prose
- assemble final letter body text

---

## Input contract

## Required input groups

### 1. case_plan_timeline
Required fields:
- `case_id`
- `plan_id`
- `plan_name`
- `dopt`
- `dotr`
- `bpd`

### 2. participant_role_population
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
- `relation`
- `non_spouse_benf`
- `dob`
- `sdob`
- `dod`
- `retirement_status_as_of_dopt`
- `payment_status_as_of_dopt`
- `qdro_indicator`
- `qpsa_indicator`

### 3. service_employment_history
Required fields:
- `doh`
- `dop`
- `dote`

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

### 5. limitation_packet
Required fields:
- `calc_indicator`
- `calculation_context`

### 6. Upstream deterministic outputs

#### resolved_dates
- `nrd`
- `erd`
- `eurd`
- `eprd`
- `rbd`
- `xra`
- `xrd`
- `sxra`

#### resolved_forms_status
- `form_code_nsf`
- `form_code_nmf`
- `form_code_ptp`
- `form_code_ptp_qpsa`
- `form_code_death`
- `annuity_status_pay`
- `lsoption`
- `rettyp`
- `bs_ind`
- `br_ind`
- `ofa_indicator`

#### plan_benefit_results
- `term_mb_nrd_nsf`
- `xrd_mb_term`
- `xrd_surv_mb_term`
- `xrd_mb_qpsa_term`
- `ls_term`
- `ls_qpsa`

#### title_iv_results
- `xrd_mb_title_iv`
- `pvmb_title_iv`

#### section_4022c_results
- `xrd_mb_4022c`
- `pvmb_4022c`

#### present_value_results
- `pvf_lev_ann`
- `pvf_lev_ls`
- `pvf_qpsa_ls`
- `pvmb_term`

### 7. Trace inputs
Required fields:
- `ce_track1`
- `ce_track2`
- `ce_track3`
- `ce_track4`
- `ce_track5`
- `ce_track6`
- `rule_trace_id`
- `calculation_run_id`
- `deliverable_version`
- `schema_version`

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

### qdro_packet
Required when:
- QDRO-specific statement routing or fields are needed

Fields:
- `qdro_type`
- `separate_interest_indicator`
- `alternate_payee_name`
- `alternate_payee_dob`
- `qdro_effective_date`

### qpsa_packet
Required when:
- QPSA-specific statement routing or fields are needed

Fields:
- `qpsa_survivor_percentage`
- `qpsa_commencement_date`
- `qpsa_form_rule`

### death_benefit_packet
Required when:
- death-benefit-specific statement routing or fields are needed

Fields:
- `survivor_type`
- `survivor_asd`
- `death_benefit_form`
- `death_benefit_amount`

### bsrs_projection_override_packet
Required when:
- statement-specific projection rules override default adapter behavior

Fields:
- `output_field_name`
- `override_value`
- `override_note`

---

## Input assumptions

1. All input fields have already passed schema validation.
2. All input facts are already resolved.
3. All required benefit outputs have already been computed upstream.
4. Missing inputs are explicit nulls, not blank strings.
5. Source conflicts have already been handled upstream.
6. This module is a formatting and projection adapter, not a substantive calculation engine.

---

## Deterministic rule hierarchy

The module must apply output logic in this order:

1. row identity and control fields
2. role and statement-eligibility classification
3. demographic and date projection
4. form-state and payment-state projection
5. statement amount projection
6. display-field derivation
7. statement suppression and recalculation routing
8. trace-field projection
9. explicit projection overrides, if allowed by contract

No raw-document reasoning is permitted inside the module.

---

## Output contract

## Primary outputs

### bsrs_configuration_row
A single structured row or record containing all Benefit Statement and Retirement Statement configuration-facing fields.

### bsrs_configuration_metadata
- `case_id`
- `plan_id`
- `bcv_rec_id`
- `calculation_run_id`
- `deliverable_version`
- `adapter_version`
- `statement_row_type`
- `statement_sort_key`

### bsrs_configuration_trace
- `bsrs_configuration_output_rule_trace`
- `bsrs_configuration_output_warning_flag`
- `bsrs_configuration_output_warning_note`

---

## Output definitions

### `bsrs_configuration_row`
Canonical structured output row containing deterministic fields required for statement-program configuration.

### `bsrs_configuration_metadata`
Companion metadata identifying the case, row identity, run identity, output adapter version, and row ordering context.

### `statement_row_type`
Controlled row category such as participant, beneficiary, alternate payee, survivor, or suppressed row.

### `statement_sort_key`
Stable deterministic sort key for configuration assembly.

### `statement_population_indicator`
Indicator showing whether the row should be included in statement-program population.

### `statement_type_code`
Controlled code identifying benefit statement versus retirement statement or related subtype.

### `statement_status_code`
Controlled code identifying current status of statement handling for the row.

### `benefit_effective_date_for_statement`
Controlled date used as the primary statement-effective date.

### `display_form_code`
Controlled form code intended for statement display.

### `display_monthly_amount`
Controlled monthly amount intended for statement display.

### `display_survivor_amount`
Controlled survivor amount intended for statement display.

### `display_lump_sum_amount`
Controlled lump-sum amount intended for statement display.

### `recalculation_trigger_indicator`
Indicator showing whether recalculation-driven statement programming is required.

### `recalculation_reason_code`
Controlled code identifying why recalculation programming is required.

### `suppress_statement_indicator`
Indicator showing whether statement generation should be suppressed.

### `suppression_reason_code`
Controlled code identifying why statement generation is suppressed.

---

## Controlled behaviors

### Statement eligibility behavior
The module must support:
- participant statement rows
- beneficiary statement rows
- alternate payee statement rows
- survivor-only rows
- suppressed rows

### Statement type behavior
The module must support:
- benefit determination statement
- retirement statement
- recalculation statement
- death-benefit / survivor statement route
- no-statement route

### Display behavior
The module must support:
- direct pass-through of computed amounts
- controlled display selection among plan, Title Four, and section 4022(c) families
- null propagation where no value is applicable
- deterministic display-form selection

### Suppression behavior
The module must support:
- no suppression
- suppression due to missing required downstream population status
- suppression due to death or closed status
- suppression due to explicit override
- suppression due to non-applicable role path

### Recalculation behavior
The module must support:
- no recalculation trigger
- recalculation because current-pay row changed
- recalculation because benefit family changed
- recalculation because survivor path changed
- recalculation because statement status changed

---

## Error contract

The module must return structured errors, not silent failures.

### Hard errors
Examples:
- required upstream output missing
- required row identity field missing
- unsupported statement type code request
- incompatible data type for projected field
- statement row type cannot be generated

### Soft warnings
Examples:
- optional in-pay fields absent for non-pay row
- display amount projected as null because output family not applicable
- projection override applied
- statement suppressed by control logic
- recalculation trigger set without downstream reason note

---

## Required trace output

The module must record:

- input snapshot id or calculation run id
- adapter version
- output field ordering version
- output row type
- which source field populated each output field
- whether any projection override was used
- whether suppression logic was used
- whether recalculation logic was used
- whether any warning was raised

Minimum trace structure:

- `output_field_name`
- `source_field_name`
- `projection_rule`
- `output_value`
- `warning_note`

---

## Purity requirement

`bsrs_configuration_output` must be a pure deterministic transform:

`reviewed inputs + upstream deterministic outputs -> bsrs structured configuration row`

It must have:
- no network access
- no file reads
- no OCR calls
- no random behavior
- no dependence on user interface state

---

## Function signature

Conceptual signature:

`build_bsrs_configuration_output(input_packet) -> bsrs_configuration_output_packet`

Where:

- `input_packet` contains only reviewed structured fields and upstream deterministic outputs
- `bsrs_configuration_output_packet` contains the row, metadata, warnings, and trace

---

## Minimal example

### Input
```yaml
participant_role_population:
  bcv_rec_id: "1001"
  custid: "C001"
  retstat: "2"
  id: "1"
  role_type: "participant"
  fname: "Jane"
  lname: "Doe"
  psex: "F"
  mstat: "S"
  dob: "1960-04-15"
  qdro_indicator: false
  qpsa_indicator: false

benefit_administration_state:
  dor: null
  asd: null
  sbcd: null
  current_form_code: null
  current_payment_amount: null
  current_pay_status: "not_in_pay"

limitation_packet:
  calc_indicator: "V"
  calculation_context: "termination_valuation"

resolved_dates:
  nrd: "2025-05-01"
  xra: 65
  xrd: "2025-05-01"

resolved_forms_status:
  form_code_nsf: "1"
  annuity_status_pay: "not_in_pay"
  lsoption: "N"
  rettyp: "deferred_vested"
  bs_ind: "Y"
  br_ind: "N"
  ofa_indicator: "Y"

plan_benefit_results:
  term_mb_nrd_nsf: 2500.00
  xrd_mb_term: 2500.00
  ls_term: null
  ls_qpsa: null

title_iv_results:
  xrd_mb_title_iv: 2500.00

section_4022c_results:
  xrd_mb_4022c: 2500.00
```

### Output
```yaml
bsrs_configuration_row:
  bcv_rec_id: "1001"
  custid: "C001"
  retstat: "2"
  id: "1"
  role_type: "participant"
  fname: "Jane"
  lname: "Doe"
  psex: "F"
  mstat: "S"
  dob: "1960-04-15"
  calc_indicator: "V"
  calculation_context: "termination_valuation"
  nrd: "2025-05-01"
  xra: 65
  xrd: "2025-05-01"
  form_code_nsf: "1"
  annuity_status_pay: "not_in_pay"
  lsoption: "N"
  rettyp: "deferred_vested"
  bs_ind: "Y"
  br_ind: "N"
  ofa_indicator: "Y"
  statement_population_indicator: "Y"
  statement_type_code: "BS"
  statement_status_code: "READY"
  benefit_effective_date_for_statement: "2025-05-01"
  display_form_code: "1"
  display_monthly_amount: 2500.00
  display_survivor_amount: null
  display_lump_sum_amount: null
  recalculation_trigger_indicator: "N"
  recalculation_reason_code: null
  suppress_statement_indicator: "N"
  suppression_reason_code: null

bsrs_configuration_metadata:
  case_id: "23173400"
  plan_id: "PLAN-1"
  bcv_rec_id: "1001"
  calculation_run_id: "RUN-0001"
  deliverable_version: "0.1.0"
  adapter_version: "0.1.0"
  statement_row_type: "participant"
  statement_sort_key: "participant|1001"
```

---

## Acceptance criteria

The module is acceptable at `v0.1.0` if:

1. It validates required and conditional output-adapter inputs.
2. It consumes upstream resolved states without raw-document access.
3. It produces a stable structured Benefit Statement and Retirement Statement configuration row.
4. It emits structured errors and warnings.
5. It emits field-level output trace.
6. It is reproducible for the same reviewed input packet.

---

## Dependencies

Upstream:
- `pbgc_defined_benefit_input_schema v0.1.0`
- `date_resolution_contract v0.1.0`
- `form_resolution_contract v0.1.0`
- `benefit_kernel_contract v0.1.0`
- `v1_ve_output_contract v0.1.0`
- `valuation_listings_output_contract v0.1.0`

Downstream:
- statement-program export layer
- review and audit UI layer

---

## Versioning rule

Breaking changes to:
- required inputs
- output field names
- output meanings
- error semantics
- output ordering guarantees

must increment MAJOR or MINOR according to repository versioning policy.

Non-breaking clarifications increment PATCH.
