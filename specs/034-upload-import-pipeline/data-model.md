# Data Model: Upload Import Pipeline

## ImportSource

- `source_id`: Stable identifier for the local input kind.
- `label`: Analyst-visible label.
- `stage_key`: Current case stage key.
- `kind`: `reviewed_structured_json` or `external_llm_artifact`.
- `boundary_basis`: Display text explaining allowed use.
- `ordering_key`: Stable sort key.

## ImportPreview

- `source_id`: Associated import source.
- `status`: `empty`, `accepted`, `invalid`, `malformed`, or `oversized`.
- `status_label`: Analyst-readable status label.
- `input_size`: Character count.
- `accepted_fields`: Deterministically sorted field names for accepted reviewed JSON.
- `warnings`: Structured display-only warnings.
- `errors`: Structured display-only errors.
- `trace_basis`: Module, selected stage, source kind, and deterministic rule version.

## Validation Rules

- Reviewed JSON must be under the MVP size limit before parsing.
- Reviewed JSON must parse as an object or array of objects.
- Accepted reviewed JSON must include mocked case identification and at least one reviewed record identifier.
- External-LLM artifact text is never parsed for case facts.
- Warnings and errors are sorted deterministically by code.
