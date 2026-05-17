# Contract: Form Resolution Slice

## Scope

This slice exposes one executable deterministic action to the browser
application: run `form_resolution` for an active reviewed input packet and
persist form outputs with trace. It wraps existing repository contracts without
changing their versions:

- `artifacts/contracts/engine_contract_v0.1.0.md`
- `artifacts/contracts/engine_packet_builder_contract_v0.1.0.md`
- `artifacts/contracts/form_resolution_contract_v0.1.0.md`

## Inputs

### RunFormResolutionRequest

| Field | Required | Description |
|-------|----------|-------------|
| `case_id` | Yes | Case identifier in `case_header`. |
| `subject_type` | Yes | `participant`, `beneficiary`, or `alternate_payee`. |
| `subject_key` | Yes | Subject identifier for the packet and output rows. |
| `input_packet_id` | Yes | Active `engine_input_packet` row with `packet_type = form_resolution`. |
| `rule_version` | Yes | Deterministic form-resolution rule version, expected `0.1.0` for this slice. |
| `deliverable_version` | Yes | Slice deliverable version, expected `0.1.0` for this slice. |

## Preconditions

- The browser-side SQLite database has applied the required committed
  migrations.
- The active input packet contains only reviewed structured form inputs.
- The deterministic module does not read raw OCR, raw source documents, or
  unreviewed extraction output.
- Benefit-kernel and output-adapter modules are not executed.

## Outputs

### RunFormResolutionResult

| Field | Required | Description |
|-------|----------|-------------|
| `calculation_run_id` | Yes | Identifier for the persisted `engine_run`. |
| `run_status` | Yes | `completed` for valid execution, `failed` for blocked validation. |
| `resolved_forms_output_id` | Conditional | Present only when execution completes successfully. |
| `warning_count` | Yes | Count of non-blocking warnings. |
| `error_count` | Yes | Count of blocking errors. |
| `warnings` | Yes | Structured warning list, empty when none. |
| `errors` | Yes | Structured blocking error list, empty when none. |

### Resolved Form Fields

Successful execution writes the form fields defined by
`form_resolution_contract_v0.1.0.md`:

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

No benefit amounts, present values, or output-adapter fields are written in this
slice.

## Warning Contract

Non-blocking warnings must include:

- `code`
- `message`
- `field_name` or `input_group`
- `input_packet_id`
- `module_name = form_resolution`
- `rule_version`

Warning-bearing completed paths must not alter valid form outputs.

## Error Contract

Blocking errors must include:

- `code`
- `message`
- `field_name` or `input_group`
- `input_packet_id`
- `module_name = form_resolution`
- `rule_version`

No `resolved_forms_output` row may be written when blocking errors exist.

## Trace Contract

Each populated resolved form field must have at least one `module_trace` row
with:

- `calculation_run_id`
- `module_name = form_resolution`
- `subject_key`
- `field_name`
- `rule_applied`
- `input_fields_used_json`
- `intermediate_values_json`
- `output_value`
- `warning_note` when applicable

`intermediate_values_json` must indicate whether current-pay evidence, QDRO,
QPSA, death-benefit, lump-sum, contribution, or PBGC form-policy logic affected
the output.

## Determinism Contract

For the same active input packet and rule version, resolved form values and
trace decisions must be identical across repeated runs except generated
identifiers and timestamps.
