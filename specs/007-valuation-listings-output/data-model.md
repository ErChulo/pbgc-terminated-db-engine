# Data Model: Valuation Listings Output

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
- `packet_type` must equal `valuation_listings_output` for this slice.
- `status` must be `active`.
- `packet_json` must include required input families from the valuation-listings contract.
- Missing required upstream output families are blocking errors.

## Upstream Date, Service, Compensation, and Form Outputs

**Purpose**: Reviewed upstream state used for valuation-listing projection.

**Source**: `resolved_dates_output`, `resolved_service_comp_output`, and
`resolved_forms_output`.

**Key fields**:
- date quantities: `nrd`, `erd`, `eurd`, `eprd`, `rbd`, `xra`, `xrd`, `sxra`,
  `term_lw_anb`, `term_lw_xra`
- service quantities: `eligibility_service_resolved`,
  `vesting_service_resolved`, `benefit_service_resolved`,
  `accrual_service_resolved`
- compensation quantities: `compensation_resolved`,
  `average_compensation_resolved`, `covered_compensation_resolved`
- form-state fields: `rettyp`, `form_code_nsf`, `form_code_nmf`,
  `form_code_ptp`, `form_code_ptp_qpsa`, `form_code_death`,
  `annuity_status_pay`, `lsoption`, `bs_ind`, `br_ind`, `ofa_indicator`

**Validation rules**:
- Values must come from reviewed deterministic outputs.
- Conditional branch fields must be explicit nulls when not applicable.

## Upstream Benefit Kernel and V1/VE Outputs

**Purpose**: Deterministic benefit values and prior adapter outputs used for
projection into valuation listings.

**Source**: `benefit_kernel_output` and `v1_ve_output_row`.

**Key fields**:
- benefit kernel family fields from the committed contract
- V1/VE row identity and trace context used for downstream listing population

**Validation rules**:
- Required benefit and adapter values must exist before valuation-listing
  projection.
- Missing required upstream values are blocking errors for the adapter.

## Valuation Listings Output Row

**Purpose**: Persisted adapter row containing the downstream valuation-listing-ready packet.

**Source**: adapter output persistence table defined by the committed output-adapter migration.

**Key fields**:
- `valuation_listings_output_row_id`
- `calculation_run_id`
- `case_id`
- `plan_id`
- `subject_key`
- `row_json`
- `listing_sort_key`
- `adapter_version`

**Validation rules**:
- Each successful adapter run writes one row for the reviewed case/subject.
- `row_json` must serialize the deterministic valuation-listing output packet.
- Adapter version must match the committed contract version.

## Valuation Listing Output Packet

**Purpose**: Structured adapter packet containing the row, metadata, warnings,
and trace.

**Key fields**:
- row identity and control fields
- demographic and date fields
- service and compensation fields
- form-state fields
- benefit fields
- ordering fields
- official PBGC deliverable template fields
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
- Completed valid valuation-listing runs must have one matching output row.
- Failed validation runs must not create authoritative output rows.

## DD Mapping Reference

**Purpose**: Canonical field-name layer for listing semantics where a matching
DD field exists.

**Source**: `artifacts/mappings/DD.csv`

**Validation rules**:
- Matching listing field names must resolve through DD naming first.
- The adapter must not invent alternate canonical names for fields covered by
  DD.csv.
