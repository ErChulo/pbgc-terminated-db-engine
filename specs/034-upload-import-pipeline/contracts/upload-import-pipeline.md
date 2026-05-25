# Contract: Upload Import Pipeline

## `buildUploadImportPipeline(input)`

Builds deterministic display-only state for the Upload / Import page.

### Input

- `reviewed_json_text`: Optional local text entered by the analyst.
- `external_artifact_text`: Optional local external-LLM artifact text.
- `selected_stage`: Optional stage key; defaults to `upload_import`.

### Output

- `sources`: Stable ordered import source list.
- `reviewed_json_preview`: Deterministic preview for reviewed JSON.
- `external_artifact_preview`: Deterministic inert artifact preview.
- `boundary_notice`: Browser-only boundary text.
- `trace`: Module name, rule version, selected stage, and source kinds.

### Invariants

- No network work.
- No OCR.
- No in-app scraping.
- No sql.js writes.
- No output-adapter writes.
- No real natural-person sample data.
- Repeated calls with the same input return equivalent output.
