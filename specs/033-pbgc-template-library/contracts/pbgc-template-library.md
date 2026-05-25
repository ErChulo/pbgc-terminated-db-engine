# Contract: PBGC Template Library

## Scope

Display-only browser contract for PBGC template browsing and readiness preview. It is not a server API, engine contract, schema migration, output adapter, template-filling contract, or sql.js persistence contract.

## Build Function

`buildPbgcTemplateLibrary(options?) -> PbgcTemplateLibraryState`

### Inputs

- `selected_template_id` optional template id.

### Output Shape

- `templates`: deterministic committed template metadata entries.
- `selected_template`: selected template entry.
- `readiness`: display-only readiness preview.
- `boundary_notice`: no raw/OCR/scraping/server/persistence/filling/export notice.

## Boundary Rules

- The library may display template metadata and readiness status.
- The library must not open/parse raw source documents, run OCR, call servers, write sql.js rows, write output-adapter artifacts, fill templates, or export artifacts.
- Readiness preview is not evidence that template filling has run.
