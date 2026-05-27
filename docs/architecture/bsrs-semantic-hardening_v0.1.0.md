# BSRS Semantic Hardening v0.1.0

This increment adds internal backend regression helpers for
`bsrs_configuration_output` semantic validation. The complete scope covers:

- **US1**: Statement Authoring function-set validation and PrintCriteria lexical checks
- **US2**: Field-reference validation against DD.csv, committed output fields, and approved sample fallback vocabulary
- **US3**: Block-pattern validation for statement section sequencing, recalculation line clusters, and optional-form section families (single-life, single-and-joint, QPSA/QDRO)

## Validation Sources

- `artifacts/guidance/bsrs/statement-authoring/BSRS functions.txt`
- `artifacts/reference/approved-samples/bsrs-config/`
  - `base-data/`
  - `statements/`
  - `recalculations/`
  - `optional-forms/`
    - `single-life/`
    - `single-and-joint/`
    - `qpsa-qdro/`
- `artifacts/mappings/DD.csv`

## Module Boundaries

- **Semantic validation helpers** are exported from `bsrs-configuration-output` for test consumption only
- **`runBsrsConfiguration`** does NOT import or invoke semantic validation — semantic hardening is a test-time regression layer, not a runtime gate
- No server calls, hosted APIs, or external persistence
- No raw OCR or raw source-document reads
- No new output adapters, migrations, or persistence tables
- No changes to successful BSRS output packet content, persistence behavior, or adapter scope

## Trace Shape

Semantic findings are deterministic records containing source path, row index,
column name, token, severity, code, rule version, producing module, and semantic
category. Categories include:

- `statement_authoring_function` — unsupported function references
- `printcriteria` — malformed PrintCriteria expressions
- `field_reference` — unknown field-like tokens
- `block_pattern` — missing, out-of-order, duplicated, or suspicious block markers

## Finding Codes

| Code | Severity | Category |
|---|---|---|
| `BSRS_FUNCTION_REFERENCE_UNSUPPORTED` | error | statement_authoring_function |
| `BSRS_PRINTCRITERIA_UNBALANCED_QUOTES` | error | printcriteria |
| `BSRS_PRINTCRITERIA_UNSUPPORTED_FUNCTION` | error | printcriteria |
| `BSRS_FIELD_REFERENCE_UNKNOWN` | error | field_reference |
| `BSRS_STATEMENT_SECTION_MISSING` | error | block_pattern |
| `BSRS_STATEMENT_SECTION_OUT_OF_ORDER` | error | block_pattern |
| `BSRS_RECALCULATION_CLUSTER_MISSING` | error | block_pattern |
| `BSRS_RECALCULATION_CLUSTER_OUT_OF_ORDER` | error | block_pattern |
| `BSRS_RECALCULATION_CLUSTER_DUPLICATED` | error | block_pattern |
| `BSRS_OPTIONAL_FORM_SECTION_MISSING` | error | block_pattern |
| `BSRS_OPTIONAL_FORM_SECTION_OUT_OF_ORDER` | error | block_pattern |
| `BSRS_OPTIONAL_FORM_SECTION_DUPLICATED` | error | block_pattern |
| `BSRS_OPTIONAL_FORM_SECTION_SUSPICIOUS` | warning | block_pattern |

## Test Coverage

| Test File | Scope |
|---|---|
| `hardening-bsrs-semantic-functions.test.ts` | US1: function reference validation, repeated-run stability |
| `hardening-bsrs-printcriteria.test.ts` | US1: PrintCriteria syntax, balanced quotes, unsupported functions |
| `hardening-bsrs-field-references.test.ts` | US2: DD-backed resolution, approved fallback, committed field vocabulary |
| `hardening-bsrs-block-patterns.test.ts` | US3: statement, recalculation, and optional-form block patterns |
| `hardening-bsrs-semantic-behavior.test.ts` | Cross-cutting: deterministic stability, contract preservation, module boundary isolation |
