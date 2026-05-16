# engine_packet_builder_contract v0.1.0

## Purpose

Defines the contract for the component that assembles reviewed structured rows into deterministic engine packets.

## Module name

`engine_packet_builder`

## Version

`0.1.0`

## Responsibilities

1. Read only reviewed structured tables.
2. Assemble one packet per `(case_id, subject_type, subject_key, packet_type)`.
3. Pull from:
   - `case_header`
   - active `resolved_fact`
   - active `resolved_plan_provision`
   - conditional reviewed tables when applicable
4. Validate packet completeness against module contracts.
5. Persist one row in `engine_input_packet`.

## Packet types

- `date_resolution`
- `service_resolution`
- `compensation_resolution`
- `form_resolution`
- `benefit_kernel`
- `v1_ve_output`
- `valuation_listings_output`
- `bsrs_configuration_output`

## Inputs

- `case_id`
- `subject_type`
- `subject_key`
- `target_packet_type`
- `schema_version`
- reviewed tables only

## Outputs

- `input_packet_id`
- `packet_json`
- `packet_completeness_status`
- `missing_required_fields_json`
- `conditional_requirements_triggered_json`

## Rules

1. Never read raw OCR text.
2. Never choose among unresolved conflicting assertions.
3. Use only active resolved rows.
4. Include null explicitly for non-applicable optional fields.
5. Exclude derived fields unless the target contract requires upstream outputs.

## Error cases

- missing required resolved fact
- missing required resolved plan provision
- unsupported packet type
- multiple active rows for same fact
- invalid conditional-branch state

## Persistence

The stored `packet_json` must include:

- `packet_type`
- `schema_version`
- `case_id`
- `subject_type`
- `subject_key`
- grouped fields by contract section

## Acceptance criteria

1. Same reviewed rows always produce the same packet JSON.
2. Missing required inputs are reported deterministically.
3. Conditional branches are reported explicitly.
4. Packet build never mutates reviewed fact tables.
