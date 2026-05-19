# Contract: BSRS Semantic Validation

## Scope

This contract defines the internal backend validation behavior for semantic
hardening of `bsrs_configuration_output`. It does not define a new output
adapter, public API, persistence table, or user-facing workflow.

## Input Contract

Validation consumes only approved repository artifacts and existing deterministic
semantics:

- `artifacts/guidance/bsrs/statement-authoring/BSRS functions.txt`
- `artifacts/reference/approved-samples/bsrs-config/**`
- existing BSRS/V1 output field semantics
- `artifacts/mappings/DD.csv` where a matching field exists
- existing BSRS deterministic output fixtures for behavior-preservation checks

Raw OCR, raw documents, emails, images, PDFs, and unreviewed extraction output
are disallowed inputs.

## Validation Categories

### Statement Authoring Functions

- Extract `@FUNCTION(...)` references from approved BSRS sample expressions.
- Resolve each function name against the approved Statement Authoring function
  list.
- Emit an error for any unsupported function reference.

### PrintCriteria Semantics

- Validate that PrintCriteria cells are parseable as one of:
  - blank criteria
  - literal numeric/control criteria
  - quoted criteria
  - expression criteria with supported functions and recognized tokens
- Emit an error for malformed quotes, unsupported functions, or unknown
  field/control tokens.

### Field References

- Extract field-like tokens from PrintCriteria, description, detail, and
  base-data fields.
- Resolve tokens against approved sample fields, existing BSRS/V1 semantics,
  DD-backed fields where available, or documented control tokens.
- Preserve approved no-DD fallback semantics where the sample set approves the
  token.

### Block Patterns

- Validate statement, recalculation, base-data, and optional-form row families.
- Required patterns include section headers, line/section markers, row-family
  labels, detail columns, and format-code families.

## Finding Shape

Each validation finding must include:

- `code`
- `severity`
- `category`
- `source_path`
- `row_index`
- `column_name`
- `token`
- `message`
- `rule_version`
- `producing_module`

Findings must be stable across repeated runs for the same approved artifacts and
rule version.

## Out of Scope

- New output adapters
- New business domains
- New database migrations or persistence tables
- Runtime recalculation of benefits
- Changes to successful `bsrs_configuration_output` packet content or adapter
  writes
- Direct reads from raw source documents or unreviewed extraction output
