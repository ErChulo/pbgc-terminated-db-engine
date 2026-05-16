# Contract: Date Resolution Slice

## Scope

This slice exposes one executable deterministic action to the browser
application: run `date_resolution` for an active reviewed input packet and
persist outputs with trace. It wraps the existing repository contracts without
changing their versions:

- `artifacts/contracts/engine_contract_v0.1.0.md`
- `artifacts/contracts/engine_packet_builder_contract_v0.1.0.md`
- `artifacts/contracts/date_resolution_contract_v0.1.0.md`

## Inputs

### RunDateResolutionRequest

| Field | Required | Description |
|-------|----------|-------------|
| `case_id` | Yes | Case identifier in `case_header`. |
| `subject_type` | Yes | `participant`, `beneficiary`, or `alternate_payee`. |
| `subject_key` | Yes | Subject identifier for the packet and output rows. |
| `input_packet_id` | Yes | Active `engine_input_packet` row with `packet_type = date_resolution`. |
| `rule_version` | Yes | Deterministic date-resolution rule version, expected `0.1.0` for this slice. |
| `deliverable_version` | Yes | Slice deliverable version, expected `0.1.0` for this slice. |

## Preconditions

- The browser-side SQLite database has applied the required committed migrations.
- The active input packet contains only reviewed structured data.
- The deterministic module does not read raw OCR, raw source documents, or
  unreviewed extraction output.
- Downstream module packets and output adapters are not executed.

## Outputs

### RunDateResolutionResult

| Field | Required | Description |
|-------|----------|-------------|
| `calculation_run_id` | Yes | Identifier for the persisted `engine_run`. |
| `run_status` | Yes | `completed` for valid execution, `failed` for blocked validation. |
| `resolved_dates_output_id` | Conditional | Present only when execution completes successfully. |
| `warning_count` | Yes | Count of non-blocking warnings. |
| `error_count` | Yes | Count of blocking errors. |
| `warnings` | Yes | Structured warning list, empty when none. |
| `errors` | Yes | Structured blocking error list, empty when none. |

### Resolved Date Fields

Successful execution writes the fields defined by
`date_resolution_contract_v0.1.0.md`:

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

## Error Contract

Blocking errors must include:

- `code`
- `message`
- `field_name` or `input_group`
- `input_packet_id`
- `module_name = date_resolution`
- `rule_version`

No `resolved_dates_output` row may be written when blocking errors exist.

## Trace Contract

Each populated resolved date must have at least one `module_trace` row with:

- `calculation_run_id`
- `module_name = date_resolution`
- `subject_key`
- `field_name`
- `rule_applied`
- `input_fields_used_json`
- `intermediate_values_json`
- `output_value`
- `warning_note` when applicable

## Determinism Contract

For the same active input packet and rule version, resolved date values and trace
decisions must be identical across repeated runs except generated identifiers and
timestamps.
