# Data Model: Template Filling Export

## FilledArtifactPreview

- `artifact_id`: Stable identifier.
- `file_name`: Deterministic export file name.
- `template_id`: Template metadata identifier.
- `template_basis`: Repository path or approved artifact basis.
- `content`: Filled artifact content.
- `source_record_ids`: Approved mocked reviewed record identifiers.
- `export_status`: `ready` or `blocked`.
- `warnings`: Structured display-only warnings.
- `errors`: Structured display-only errors.
- `trace_basis`: Producing module, rule version, template id, and source record ids.

## ExportControl

- `copy_label`: Copy control label.
- `download_label`: Download control label.
- `download_name`: Deterministic file name.
- `enabled`: Whether export is ready.

## Validation Rules

- Only approved eligible rows can contribute content.
- No approved rows blocks export.
- Content rows sort by reviewed record identifier.
- Warnings and errors sort by code.
