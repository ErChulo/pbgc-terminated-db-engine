# valuation_listings_output_contract v0.1.0

## Purpose

Defines the deterministic contract for the `valuation_listings_output` module.

This module transforms reviewed inputs and upstream deterministic outputs into the structured output packet required for valuation listings, audit-support listings, and human-review trace tables.

It accepts only reviewed structured inputs and upstream deterministic outputs from the deterministic boundary.
It does not read raw documents directly.

---

## Module name

`valuation_listings_output`

## Module version

`0.1.0`

## Status

`deterministic_output_adapter`

---

## Scope

This module resolves, at minimum, these valuation-listing-facing output families:

### 1. Row identity and control outputs
- `case_id`
- `plan_id`
- `bcv_rec_id`
- `custid`
- `retstat`
- `id`
- `calc_indicator`
- `calculation_context`

### 2. Core demographic and date outputs
- `fname`
- `lname`
- `sfname`
- `slname`
- `role_type`
- `psex`
- `ssex`
- `mstat`
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
- `term_lw_anb`
- `term_lw_xra`

### 3. Service and compensation outputs
- `eligibility_service_resolved`
- `vesting_service_resolved`
- `benefit_service_resolved`
- `accrual_service_resolved`
- `compensation_resolved`
- `average_compensation_resolved`
- `covered_compensation_resolved`
- `vested_percentage_at_dopt`

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

### 5. Plan-benefit outputs
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

### 6. Title Four outputs
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

### 7. Section 4022(c) outputs
- `xrd_mb_4022c`
- `pvmb_4022c_no_q_no_l`
- `pvmb_4022c_qpsa`
- `pvmb_4022c_no_load`
- `load_4022c`
- `pvmb_4022c`

### 8. Nonguaranteed and PBGC-funds outputs
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

### 9. Present-value and factor outputs
- `pvf_lev_ann`
- `pvf_lev_ls`
- `pvf_qpsa_ls`
- `pvmb_term_no_q_no_l`
- `pvmb_term_qpsa`
- `pvmb_term_no_load`
- `term_load`
- `pvmb_term`

### 10. Trace outputs
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

This module may also produce supporting technical outputs needed for listing assembly, sort order, filtering, and traceability.

This module does **not**:
- choose between conflicting sources
- read OCR text
- calculate benefits from scratch
- determine plan provisions
- determine source precedence
- draft memo prose
- assemble final spreadsheet workbook styling

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
- `dob`
- `sdob`
- `dod`
- `retirement_status_as_of_dopt`
- `payment_status_as_of_dopt`

### 3. service_employment_history
Required fields:
- `doh`
- `dop`
- `dote`

### 4. compensation_accrual_inputs
Required fields:
- `vested_percentage_at_dopt`

### 5. benefit_administration_state
Required fields:
- `dor`
- `asd`
- `sbcd`
- `current_form_code`
- `current_payment_amount`
- `current_pay_status`

### 6. limitation_packet
Required fields:
- `calc_indicator`
- `calculation_context`

### 7. Upstream deterministic outputs

#### resolved_dates
- `nrd`
- `erd`
- `eurd`
- `eprd`
- `rbd`
- `xra`
- `xrd`
- `sxra`
- `term_lw_anb`
- `term_lw_xra`

#### resolved_service_compensation
- `eligibility_service_resolved`
- `vesting_service_resolved`
- `benefit_service_resolved`
- `accrual_service_resolved`
- `compensation_resolved`
- `average_compensation_resolved`
- `covered_compensation_resolved`

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

#### title_iv_results
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

#### section_4022c_results
- `xrd_mb_4022c`
- `pvmb_4022c_no_q_no_l`
- `pvmb_4022c_qpsa`
- `pvmb_4022c_no_load`
- `load_4022c`
- `pvmb_4022c`

#### nonguaranteed_and_pbgc_funds_results
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

#### present_value_results
- `pvf_lev_ann`
- `pvf_lev_ls`
- `pvf_qpsa_ls`
- `pvmb_term_no_q_no_l`
- `pvmb_term_qpsa`
- `pvmb_term_no_load`
- `term_load`
- `pvmb_term`

### 8. Trace inputs
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
- QDRO-specific listing rows or columns are requested

Fields:
- `qdro_type`
- `separate_interest_indicator`
- `alternate_payee_name`
- `alternate_payee_dob`

### qpsa_packet
Required when:
- QPSA-specific listing rows or columns are requested

Fields:
- `qpsa_survivor_percentage`
- `qpsa_commencement_date`

### asset_recovery_packet
Required when:
- listing requires explicit asset/recovery trace columns

Fields:
- `asset_value_at_dopt`
- `section_4044_allocation_available_indicator`
- `section_4022c_amount_available_indicator`
- `sparr_indicator`
- `sparr_ratio`
- `recovery_ratio`
- `duec_indicator`
- `duec_amount`

### listing_projection_override_packet
Required when:
- listing-specific projection rules override default adapter behavior

Fields:
- `output_column_name`
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
2. demographic and date projection
3. service and compensation projection
4. form-state and payment-state projection
5. direct benefit-family projection
6. no-Q / no-load decomposition projection
7. present-value and load projection
8. trace-field projection
9. listing-specific ordering, filtering, and null handling
10. explicit projection overrides, if allowed by contract

No raw-document reasoning is permitted inside the module.

---

## Output contract

## Primary outputs

### valuation_listing_row
A single structured row or record containing all valuation-listing-facing fields.

### valuation_listing_metadata
- `case_id`
- `plan_id`
- `bcv_rec_id`
- `calculation_run_id`
- `deliverable_version`
- `adapter_version`
- `listing_row_type`
- `listing_sort_key`

### valuation_listing_trace
- `valuation_listings_output_rule_trace`
- `valuation_listings_output_warning_flag`
- `valuation_listings_output_warning_note`

---

## Output definitions

### `valuation_listing_row`
Canonical structured output row containing deterministic fields required for valuation-listing population and audit-support review.

### `valuation_listing_metadata`
Companion metadata identifying the case, row identity, run identity, output adapter version, and row ordering context.

### `listing_row_type`
Controlled row category such as participant, beneficiary, alternate payee, survivor, or summary-support row.

### `listing_sort_key`
Stable deterministic sort key for listing assembly.

### `valuation_listings_output_rule_trace`
Structured trace describing how the adapter populated fields and whether defaults or overrides were used.

---

## Controlled behaviors

### Field projection behavior
The module must support:
- direct pass-through from upstream outputs
- null propagation where no value is applicable
- controlled formatting of dates, codes, numeric values, and flags
- consistent handling of no-Q and no-load decomposition fields
- deterministic row-type tagging

### Listing compatibility behavior
The module must support:
- stable output field ordering
- stable row sorting
- explicit null rather than silent omission
- compatibility with browser-side export to spreadsheet artifacts
- projection of audit-support columns without changing substantive values

### Trace behavior
The module must support:
- row-level trace
- field-population trace
- override trace
- warning trace

---

## Error contract

The module must return structured errors, not silent failures.

### Hard errors
Examples:
- required upstream output missing
- required row identity field missing
- unsupported projection override field name
- incompatible data type for projected field
- listing sort key cannot be generated

### Soft warnings
Examples:
- optional in-pay fields absent for non-pay row
- decomposition field null because upstream branch not applicable
- projection override applied
- field projected as null because output family not requested for this role
- asset/recovery columns omitted because packet not provided

---

## Required trace output

The module must record:

- input snapshot id or calculation run id
- adapter version
- output field ordering version
- output row type
- which source field populated each output field
- whether any projection override was used
- whether any warning was raised

Minimum trace structure:

- `output_field_name`
- `source_field_name`
- `projection_rule`
- `output_value`
- `warning_note`

---

## Purity requirement

`valuation_listings_output` must be a pure deterministic transform:

`reviewed inputs + upstream deterministic outputs -> valuation listing structured output row`

It must have:
- no network access
- no file reads
- no OCR calls
- no random behavior
- no dependence on user interface state

---

## Function signature

Conceptual signature:

`build_valuation_listing_output(input_packet) -> valuation_listing_output_packet`

Where:

- `input_packet` contains only reviewed structured fields and upstream deterministic outputs
- `valuation_listing_output_packet` contains the row, metadata, warnings, and trace

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

service_employment_history:
  doh: "1985-07-01"
  dop: "1986-01-01"
  dote: "2010-12-31"

benefit_administration_state:
  dor: null
  asd: null
  current_pay_status: "not_in_pay"

limitation_packet:
  calc_indicator: "V"
  calculation_context: "termination_valuation"

resolved_dates:
  nrd: "2025-05-01"
  xra: 65
  xrd: "2025-05-01"
  term_lw_anb: 64
  term_lw_xra: 65

resolved_service_compensation:
  benefit_service_resolved: 25
  accrual_service_resolved: 25
  average_compensation_resolved: 80000

resolved_forms_status:
  annuity_status_pay: "not_in_pay"
  lsoption: "N"
  rettyp: "deferred_vested"

plan_benefit_results:
  term_mb_nrd_nsf: 2500.00
  xrd_mb_term: 2500.00

title_iv_results:
  xrd_mb_title_iv: 2500.00
  pvmb_title_iv: 198400.00

present_value_results:
  pvmb_term: 198400.00
```

### Output
```yaml
valuation_listing_row:
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
  doh: "1985-07-01"
  dop: "1986-01-01"
  dote: "2010-12-31"
  calc_indicator: "V"
  calculation_context: "termination_valuation"
  nrd: "2025-05-01"
  xra: 65
  xrd: "2025-05-01"
  term_lw_anb: 64
  term_lw_xra: 65
  benefit_service_resolved: 25
  accrual_service_resolved: 25
  average_compensation_resolved: 80000
  annuity_status_pay: "not_in_pay"
  lsoption: "N"
  rettyp: "deferred_vested"
  term_mb_nrd_nsf: 2500.00
  xrd_mb_term: 2500.00
  xrd_mb_title_iv: 2500.00
  pvmb_title_iv: 198400.00
  pvmb_term: 198400.00

valuation_listing_metadata:
  case_id: "23173400"
  plan_id: "PLAN-1"
  bcv_rec_id: "1001"
  calculation_run_id: "RUN-0001"
  deliverable_version: "0.1.0"
  adapter_version: "0.1.0"
  listing_row_type: "participant"
  listing_sort_key: "participant|1001"
```

---

## Acceptance criteria

The module is acceptable at `v0.1.0` if:

1. It validates required and conditional output-adapter inputs.
2. It consumes upstream resolved states without raw-document access.
3. It produces a stable structured valuation-listing row.
4. It emits structured errors and warnings.
5. It emits field-level output trace.
6. It is reproducible for the same reviewed input packet.

---

## Dependencies

Upstream:
- `pbgc_defined_benefit_input_schema v0.1.0`
- `date_resolution_contract v0.1.0`
- `service_resolution_contract v0.1.0`
- `compensation_resolution_contract v0.1.0`
- `form_resolution_contract v0.1.0`
- `benefit_kernel_contract v0.1.0`
- `v1_ve_output_contract v0.1.0`

Downstream:
- spreadsheet export layer
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
