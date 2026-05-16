# v1_ve_output_contract v0.1.0

## Purpose

Defines the deterministic contract for the `v1_ve_output` module.

This module transforms reviewed inputs and upstream deterministic outputs into the structured output packet required for V1 or VE-style spreadsheet population, downstream listings support, and related actuarial production artifacts.

It accepts only reviewed structured inputs and upstream deterministic outputs from the deterministic boundary.
It does not read raw documents directly.

---

## Module name

`v1_ve_output`

## Module version

`0.1.0`

## Status

`deterministic_output_adapter`

---

## Scope

This module resolves, at minimum, these V1 or VE-facing output families:

### 1. Core identity and control outputs
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
- `psex`
- `ssex`
- `mstat`
- `dob`
- `sdob`
- `dor`
- `sbcd`
- `xra`
- `xrd`
- `sxra`
- `term_lw_anb`
- `term_lw_xra`

### 3. Form and payment-state outputs
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

### 4. Title Four output family
- `xrd_mb_title_iv`
- `pvmb_title_iv_no_q_no_l`
- `pvmb_title_iv_qpsa`
- `pvmb_title_iv_no_load`
- `title_iv_load`
- `pvmb_title_iv`
- `nrd_mb_title_iv_nsf`
- `eurd_mb_title_iv_nsf`
- `erd_mb_title_iv_nsf`
- `rbd_mb_title_iv`
- `ard_mb_title_iv`

### 5. Section 4022(c) output family
- `xrd_mb_4022c`
- `pvmb_4022c_no_q_no_l`
- `pvmb_4022c_qpsa`
- `pvmb_4022c_no_load`
- `load_4022c`
- `pvmb_4022c`

### 6. Termination-benefit output family
- `xrd_mb_term`
- `xrd_surv_mb_term`
- `xrd_mb_qpsa_term`
- `term_mb_nrd_nsf`
- `term_surv_mb_nrd`
- `term_surv_mb_eurd`
- `term_surv_mb_erd`
- `rbd_surv_mb_term`
- `term_surv_mb_ard`
- `pvmb_term_no_q_no_l`
- `pvmb_term_qpsa`
- `pvmb_term_no_load`
- `term_load`
- `pvmb_term`
- `ls_term`
- `ls_qpsa`

### 7. Nonguaranteed and PBGC-funds output family
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

### 8. Present-value factor outputs
- `pvf_lev_ann`
- `pvf_lev_ls`
- `pvf_qpsa_ls`

### 9. Trace outputs
- `ce_track1`
- `ce_track2`
- `ce_track3`
- `ce_track4`
- `ce_track5`
- `ce_track6`

This module may also produce supporting technical outputs needed for spreadsheet population and traceability.

This module does **not**:
- choose between conflicting sources
- read OCR text
- calculate benefits from scratch
- determine plan provisions
- determine source precedence
- draft memos
- assemble final letter text

---

## Input contract

## Required input groups

### 1. case_plan_timeline
Required fields:
- `case_id`
- `plan_id`
- `dopt`
- `dotr`
- `bpd`

### 2. participant_role_population
Required fields:
- `bcv_rec_id`
- `custid`
- `retstat`
- `id`
- `fname`
- `lname`
- `sfname`
- `slname`
- `psex`
- `ssex`
- `mstat`
- `dob`
- `sdob`
- `role_type`
- `retirement_status_as_of_dopt`
- `payment_status_as_of_dopt`

### 3. benefit_administration_state
Required fields:
- `dor`
- `sbcd`
- `current_form_code`
- `current_payment_amount`
- `current_pay_status`

### 4. limitation_packet
Required fields:
- `calc_indicator`
- `calculation_context`

### 5. Upstream deterministic outputs

#### resolved_dates
- `xra`
- `xrd`
- `sxra`
- `term_lw_anb`
- `term_lw_xra`
- `rbd`

#### resolved_forms_status
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

### 6. Trace inputs
Required fields:
- `calculation_run_id`
- `rule_trace_id`
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

### qpsa_packet
Required when:
- QPSA outputs are populated

Fields:
- `qpsa_survivor_percentage`

### qdro_packet
Required when:
- QDRO-specific V1 or VE rows must be populated

Fields:
- `qdro_type`
- `separate_interest_indicator`

### technical_output_override_packet
Required when:
- spreadsheet-specific output formatting must override default adapter behavior

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
2. direct demographic and date projection
3. direct form-state projection
4. direct benefit-family projection
5. decomposition fields such as no-Q / no-load families
6. spreadsheet-specific formatting and null handling
7. trace-field population
8. explicit technical overrides, if allowed by contract

No raw-document reasoning is permitted inside the module.

---

## Output contract

## Primary outputs

### v1_ve_output_row
A single structured row or record containing all V1 or VE-facing output fields.

### v1_ve_output_metadata
- `case_id`
- `plan_id`
- `bcv_rec_id`
- `calculation_run_id`
- `deliverable_version`
- `adapter_version`

### v1_ve_output_trace
- `v1_ve_output_rule_trace`
- `v1_ve_output_warning_flag`
- `v1_ve_output_warning_note`

---

## Output definitions

### `v1_ve_output_row`
Canonical structured output row containing deterministic fields required for V1 or VE-style spreadsheet population.

### `v1_ve_output_metadata`
Companion metadata identifying the case, row identity, run identity, and output adapter version.

### `v1_ve_output_rule_trace`
Structured trace describing how the adapter populated fields and whether defaults or overrides were used.

---

## Controlled behaviors

### Field projection behavior
The module must support:
- direct pass-through from upstream outputs
- null propagation where no value is applicable
- controlled formatting of dates, codes, numeric values, and flags
- consistent handling of no-Q and no-load decomposition fields

### Spreadsheet compatibility behavior
The module must support:
- stable output field ordering
- reproducible output naming
- explicit null rather than silent omission
- technical overrides only through controlled input packet
- compatibility with browser-side export to spreadsheet artifacts

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
- unsupported technical override field name
- incompatible data type for projected field

### Soft warnings
Examples:
- optional in-pay fields absent for non-pay row
- decomposition field null because upstream branch not applicable
- technical override applied
- field projected as null because output family not requested for this role

---

## Required trace output

The module must record:

- input snapshot id or calculation run id
- adapter version
- output field ordering version
- which source field populated each output field
- whether any technical override was used
- whether any warning was raised

Minimum trace structure:

- `output_field_name`
- `source_field_name`
- `projection_rule`
- `output_value`
- `warning_note`

---

## Purity requirement

`v1_ve_output` must be a pure deterministic transform:

`reviewed inputs + upstream deterministic outputs -> v1/ve structured output row`

It must have:
- no network access
- no file reads
- no OCR calls
- no random behavior
- no dependence on user interface state

---

## Function signature

Conceptual signature:

`build_v1_ve_output(input_packet) -> v1_ve_output_packet`

Where:

- `input_packet` contains only reviewed structured fields and upstream deterministic outputs
- `v1_ve_output_packet` contains the row, metadata, warnings, and trace

---

## Minimal example

### Input
```yaml
participant_role_population:
  bcv_rec_id: "1001"
  custid: "C001"
  retstat: "2"
  id: "1"
  fname: "Jane"
  lname: "Doe"
  psex: "F"
  mstat: "S"
  dob: "1960-04-15"

benefit_administration_state:
  dor: null
  sbcd: null
  current_pay_status: "not_in_pay"

limitation_packet:
  calc_indicator: "V"
  calculation_context: "termination_valuation"

resolved_dates:
  xra: 65
  xrd: "2025-05-01"
  sxra: null
  term_lw_anb: 64
  term_lw_xra: 65

resolved_forms_status:
  annuity_status_pay: "not_in_pay"
  lsoption: "N"
  rettyp: "deferred_vested"
  bs_ind: "Y"
  br_ind: "N"
  ofa_indicator: "Y"

plan_benefit_results:
  term_mb_nrd_nsf: 2500.00
  xrd_mb_term: 2500.00
  xrd_surv_mb_term: null
  xrd_mb_qpsa_term: null
  ls_term: null
  ls_qpsa: null

title_iv_results:
  xrd_mb_title_iv: 2500.00
  pvmb_title_iv_no_q_no_l: 198400.00
  pvmb_title_iv_qpsa: null
  pvmb_title_iv_no_load: 198400.00
  title_iv_load: 0.00
  pvmb_title_iv: 198400.00
```

### Output
```yaml
v1_ve_output_row:
  bcv_rec_id: "1001"
  custid: "C001"
  retstat: "2"
  id: "1"
  fname: "Jane"
  lname: "Doe"
  psex: "F"
  mstat: "S"
  dob: "1960-04-15"
  calc_indicator: "V"
  calculation_context: "termination_valuation"
  xra: 65
  xrd: "2025-05-01"
  term_lw_anb: 64
  term_lw_xra: 65
  annuity_status_pay: "not_in_pay"
  lsoption: "N"
  rettyp: "deferred_vested"
  bs_ind: "Y"
  br_ind: "N"
  ofa_indicator: "Y"
  term_mb_nrd_nsf: 2500.00
  xrd_mb_term: 2500.00
  xrd_mb_title_iv: 2500.00
  pvmb_title_iv: 198400.00

v1_ve_output_metadata:
  case_id: "23173400"
  plan_id: "PLAN-1"
  bcv_rec_id: "1001"
  calculation_run_id: "RUN-0001"
  deliverable_version: "0.1.0"
  adapter_version: "0.1.0"
```

---

## Acceptance criteria

The module is acceptable at `v0.1.0` if:

1. It validates required and conditional output-adapter inputs.
2. It consumes upstream resolved states without raw-document access.
3. It produces a stable structured V1 or VE output row.
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

Downstream:
- `valuation_listings_output`
- `bsrs_configuration_output`
- spreadsheet export layer

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
