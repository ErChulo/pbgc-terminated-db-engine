# Contract: Prompt Library By Stage

## Scope

Display-only browser contract for stage-specific prompt management. It is not a server API, engine contract, schema, migration, output adapter, or sql.js persistence contract.

## Build Function

`buildPromptLibrary(options?) -> PromptLibraryState`

### Inputs

- `selected_prompt_id` optional prompt id.
- `draft_text` optional browser-local draft text.
- `import_payload` optional local prompt text or simple JSON payload.

### Output Shape

- `prompts`: deterministic stage prompt entries.
- `selected_prompt`: selected prompt entry.
- `draft`: local draft/import status and text.
- `boundary_notice`: external-LLM/no-OCR/no-scraping notice.

## Boundary Rules

- The library may display, edit, and locally import prompt text.
- The library must not call external LLMs, execute scraping, run OCR, parse source documents, write sql.js rows, or write output-adapter artifacts.
- Imported prompt content is not reviewed case evidence in this MVP.
