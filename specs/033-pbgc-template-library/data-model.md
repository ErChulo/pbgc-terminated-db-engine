# Data Model: PBGC Template Library

## Template Library Entry

- `template_id`: Stable template identifier.
- `title`: Analyst-facing title.
- `category`: `official_pbgc` or `reviewed_input_import`.
- `format`: File format such as `docx` or `csv`.
- `repository_path`: Committed template artifact path.
- `stage_key`: Related alpha stage key.
- `basis`: Repository/template basis.
- `ordering_key`: Stable ordering key.

## Template Readiness Preview

- `selected_template_id`: Selected template identifier.
- `status`: `browse_ready`, `input_ready`, or `planned_for_filling`.
- `status_label`: Analyst-facing readiness label.
- `dependencies`: Required future stages or available local prerequisites.
- `warnings`: Display-only warnings.
- `basis`: Browser-local readiness display basis.

## Validation Rules

- Template entries render in stable `ordering_key` order.
- Official PBGC templates are browse-ready and planned for future filling/export.
- Reviewed-input import templates are available for local preparation and are not output artifacts.
- Readiness preview must not perform filling, export, file upload, server calls, sql.js writes, or output-adapter writes.
