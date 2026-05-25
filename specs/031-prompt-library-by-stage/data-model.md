# Data Model: Prompt Library By Stage

## Stage Prompt Entry

- `prompt_id`: Stable prompt identifier.
- `stage_key`: Case stage key.
- `title`: Analyst-facing prompt title.
- `body`: Approved baseline prompt text.
- `basis`: Committed prompt basis.
- `boundary_notice`: External-LLM/no-OCR/no-scraping notice.
- `ordering_key`: Stable ordering key.

## Prompt Draft State

- `selected_prompt_id`: Selected prompt identifier.
- `draft_text`: Browser-local draft prompt text.
- `status`: `baseline`, `edited`, `imported`, or `invalid`.
- `validation_message`: Display-only validation message.
- `basis`: Browser-local display-state basis.

## Prompt Import Result

- `status`: `accepted` or `rejected`.
- `stage_key`: Parsed or selected stage key.
- `prompt_text`: Imported prompt text when accepted.
- `validation_message`: Display-only validation message.

## Validation Rules

- Prompt entries render in stable `ordering_key` order.
- Imported prompt text must be non-empty and under the alpha size limit.
- Imports must be inert display state and must not execute scraping, OCR, network calls, sql.js writes, or output-adapter writes.
- Draft/import text must not include obvious real natural-person sample names.
