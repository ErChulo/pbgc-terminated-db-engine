# Contract: BSRS Field Reference Validation

## Scope

This contract defines internal backend validation behavior for field-reference
hardening of `bsrs_configuration_output`. It does not define a new output
adapter, public API, persistence table, user-facing workflow, or business
domain.

## Input Contract

Validation consumes only approved repository artifacts and existing deterministic
semantics:

- `artifacts/reference/approved-samples/bsrs-config/**`
- `artifacts/mappings/DD.csv`
- current committed engine/output field names
- existing BSRS/V1/DD mapping helpers
- documented control tokens and formatting markers
- existing BSRS deterministic output fixtures for behavior-preservation checks

Raw OCR, raw documents, emails, images, PDFs, and unreviewed extraction output
are disallowed inputs.

## Validation Categories

### Field-Like Token Extraction

- Extract candidate field references from approved BSRS sample expressions and
  rows.
- Ignore tokens inside quoted narrative text.
- Ignore Statement Authoring functions, operators, numeric values, date
  literals, and formatting/control markers.

### DD-Backed Field Resolution

- Resolve candidate field references against DD.csv when a matching Data
  Dictionary entry exists.
- Preserve DD.csv as the canonical naming layer for matching fields.
- Record DD-backed status in validation evidence and findings.

### Current Field Vocabulary Resolution

- Resolve candidate field references against current committed engine/output
  field names and existing BSRS/V1/DD mapping helpers.
- Do not introduce new output fields or adapters as part of validation.

### Approved No-DD Fallback Resolution

- Accept candidate field references that are present in approved BSRS sample
  semantics when no matching DD.csv entry exists.
- Record approved fallback status and source context.

### Suspicious or Orphan Field Findings

- Emit a deterministic structured error for any candidate field reference that
  is not DD-backed, not a current committed field name, not documented
  non-field syntax, and not an approved fallback.

## Finding Shape

Each field-reference validation finding must include:

- `code`
- `severity`
- `category`
- `source_path`
- `row_index`
- `column_name`
- `token`
- `vocabulary_source`
- `dd_backed`
- `approved_fallback`
- `message`
- `rule_version`
- `producing_module`

Findings must be sorted and serialized deterministically across repeated runs
for the same approved artifacts and rule version.

## Out of Scope

- New output adapters
- New business domains
- New database migrations or persistence tables
- Runtime recalculation of benefits
- Changes to successful `bsrs_configuration_output` packet content, traces, or
  adapter writes
- Direct reads from raw source documents or unreviewed extraction output
