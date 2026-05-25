# Contract: Schema Library And Validator Surfaces

## Scope

Display-only browser contract for schema browsing and local reviewed JSON validation preview. It is not a server API, engine contract, schema migration, output adapter, or sql.js persistence contract.

## Build Function

`buildSchemaLibrary(options?) -> SchemaLibraryState`

### Inputs

- `selected_schema_id` optional schema id.
- `json_text` optional browser-local reviewed structured JSON text.

### Output Shape

- `schemas`: deterministic schema entries.
- `selected_schema`: selected schema entry.
- `validation`: browser-local validation preview.
- `boundary_notice`: no raw/OCR/scraping/server/persistence notice.

## Boundary Rules

- The library may display schema metadata and preview local JSON validation.
- The library must not read hosted schemas, raw source documents, OCR, scraping output executed in the app, real natural-person data, sql.js rows, or output-adapter artifacts.
- Validation preview is not reviewed-input approval and is not durable case evidence.
