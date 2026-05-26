# Date Resolution Slice — Architecture Note v0.1.0

## Module Identity
- **Module name**: `date_resolution`
- **Module version**: `0.1.0`
- **Contract**: `date_resolution_contract_v0.1.0.md`
- **Schema**: `sqlite_migration_0001_v0.1.0.sql.txt` (engine_run, resolved_dates_output, module_trace)

## Deterministic Boundary
- **Inputs**: `engine_input_packet` (packet_type = "date_resolution", status = "active")
- **Outputs**: `engine_run`, `resolved_dates_output`, `module_trace`
- **Disallowed**: Raw OCR, source documents, unreviewed extractions

## Input Groups (Required)
1. `case_plan_timeline` — case shell anchor with plan anniversary, DOPT
2. `resolved_plan_logic` — controlled retirement eligibility/start rules
3. `participant_role_population` — participant, beneficiary, or alternate payee
4. `service_employment_history` — employment dates (DOH, DOP, DOTE)
5. `benefit_administration_state` — DOR, ASD, SBCD, current pay status
6. `actuarial_assumption_factor_set` — age convention, RBD method
7. `limitation_packet` — bankruptcy, BPD, annuity date indicators

## Conditional Groups
- `qpsa_packet` — required when `qpsa_trigger` is true
- `death_benefit_packet` — required when `death_benefit_trigger` is true
- `qdro_packet` — required when `qdro_trigger` is true

## Resolved Outputs
- `nrd` — Normal Retirement Date (ISO YYYY-MM-DD or null)
- `erd` — Early Retirement Date
- `eurd` — Early Unreduced Retirement Date
- `eprd` — Early Partially-Reduced Retirement Date
- `rbd` — Required Beginning Date
- `xra` — Expected Retirement Age (years)
- `xrd` — Expected Retirement Date
- `sxra` — Spouse Expected Retirement Age
- `term_lw_xra` — Term Life with XRA
- `term_lw_anb` — Term Life with ANB

## Rule Branches
- `date_resolution:beneficiary_path` — beneficiary role type
- `date_resolution:in_pay_participant_path` — participant with retstat=1
- `date_resolution:deferred_vested_participant_path` — all other participants

## Rule Versions
- `normal_retirement_eligibility_rule`: `age_<N>` (e.g., `age_65`)
- `normal_retirement_start_rule`: `first_of_month_on_or_after` | `first_of_month_next_following`
- `early_reduced_retirement_rule`: `age_<N>`

## Trace Format
Every populated output field produces a `module_trace` row with:
- `field_name` — output field identifier
- `rule_applied` — specific rule + version used
- `input_fields_used_json` — array of `{group, field, value}` objects
- `intermediate_values_json` — computed intermediate values
- `output_value` — final resolved value
- `warning_note` — non-blocking warning text or null

## Warnings
- Beneficiary path: participant-only fields set to null
- XRD defaults to NRD for non-in-pay participants
- EURD not resolved in current rule version
- SXRA requires spouse DOB which is not available

## Validation (Blocking Errors)
- MISSING_REQUIRED_GROUP — required input group absent or null
- BLANK_STRING_NOT_ALLOWED — blank string where explicit null expected
- INVALID_ISO_DATE — malformed or impossible date
- CONDITIONAL_PACKET_MISSING — triggered conditional group absent
- INPUT_PACKET_NOT_ACTIVE — packet not found or wrong status
