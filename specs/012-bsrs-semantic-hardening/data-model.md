# Data Model: BSRS Semantic Hardening

## BSRS Semantic Validation Source

- **Purpose**: Represents an approved repository artifact used to validate BSRS
  semantics.
- **Key attributes**: source path, source family, artifact version context,
  row count, header set.
- **Relationships**: Contains BSRS sample rows and provides source references
  for semantic validation findings.

## BSRS Sample Row

- **Purpose**: Represents one parsed row from an approved BSRS configuration
  sample.
- **Key attributes**: source path, row index, header values, PrintCriteria,
  line/section value, description, detail, format codes.
- **Relationships**: May include function references, field references, and
  block-pattern membership.

## Statement Authoring Function Reference

- **Purpose**: Represents a function token found in BSRS configuration
  expressions.
- **Key attributes**: function name, source path, row index, expression column,
  allowed status.
- **Relationships**: Validated against the approved Statement Authoring function
  set and linked to findings when unsupported.

## BSRS Field Reference

- **Purpose**: Represents a field-like token found in PrintCriteria,
  description, detail, base-data, statement, recalculation, or optional-form
  rows.
- **Key attributes**: token name, source path, row index, expression column,
  vocabulary source, DD-backed status, approved fallback status.
- **Relationships**: Resolved against approved sample fields, existing BSRS/V1
  semantics, DD mappings when available, and documented control tokens.

## BSRS Block Pattern

- **Purpose**: Represents an approved statement, recalculation, base-data, or
  optional-form row family that must remain stable.
- **Key attributes**: block family, required headers, required row markers,
  required format codes, source files, expected row families.
- **Relationships**: Validated against sample rows and emits findings for
  missing or malformed required patterns.

## Semantic Validation Finding

- **Purpose**: Represents a structured warning or error from semantic
  validation.
- **Key attributes**: finding code, severity, category, source path, row index,
  column name, token, message, rule version, producing module.
- **Relationships**: Links back to validation source, sample row, function
  reference, field reference, or block pattern.

## Validation Rules

- Function references must resolve to the approved Statement Authoring function
  list.
- PrintCriteria expressions must have balanced quoted text and must not contain
  unsupported function references or unknown field/control tokens.
- Field references must resolve to approved sample fields, existing BSRS/V1
  field semantics, DD-backed fields where available, or documented control
  tokens.
- Statement samples must preserve required section markers, row families, and
  formatting patterns.
- Recalculation samples must preserve required participant-data and
  recalculation-support block patterns.
- Optional-form samples must preserve single-life, single-and-joint, and
  QPSA/QDRO row-family semantics.
- Findings must be deterministic across repeated validation runs.
