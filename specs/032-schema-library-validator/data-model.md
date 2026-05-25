# Data Model: Schema Library And Validator Surfaces

## Schema Library Entry

- `schema_id`: Stable schema identifier.
- `stage_key`: Related case stage key.
- `title`: Analyst-facing title.
- `repository_path`: Committed schema artifact path.
- `required_fields`: Fields required for preview validation.
- `optional_fields`: Fields displayed for context.
- `basis`: Repository/schema version basis.
- `ordering_key`: Stable ordering key.

## Schema Validation Preview

- `selected_schema_id`: Selected schema identifier.
- `status`: `empty`, `accepted`, `invalid`, `malformed`, or `oversized`.
- `checked_fields`: Required fields checked against parsed JSON.
- `warnings`: Display-only warning messages.
- `errors`: Display-only error messages.
- `input_size`: Character count for fail-fast guard evidence.
- `basis`: Browser-local validation preview basis.

## Validation Rules

- Schema entries render in stable `ordering_key` order.
- Validation preview accepts only object JSON values.
- Missing required fields produce deterministic invalid status and field-specific errors.
- Malformed JSON produces deterministic malformed status.
- Oversized text fails before parsing.
- Preview state must not write persistence rows or run deterministic engine/output adapters.
