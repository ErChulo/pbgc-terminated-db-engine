# Contract: Template Filling Export

## `buildTemplateFillingExport(input)`

Builds deterministic browser-local filled artifact state.

### Input

- `decisions`: Optional reviewed-input approval decisions.

### Output

- `artifact`: Filled artifact preview.
- `export_control`: Copy/download labels and enabled state.
- `boundary_notice`: Browser-local template filling boundary.

### Invariants

- No network work.
- No OCR.
- No in-app scraping.
- No sql.js writes.
- No output-adapter writes.
- No real natural-person sample data.
- Pending, rejected, malformed, and invalid rows are excluded.
