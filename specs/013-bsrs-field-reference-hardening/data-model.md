# Data Model: BSRS Field Reference Hardening

## BSRS Field Reference

- **Purpose**: Represents a field-like token extracted from approved BSRS sample
  configuration rows or expressions.
- **Key attributes**: token, normalized token, source path, row index, column
  name, expression context, quoted-literal status.
- **Relationships**: Resolves to a Field Vocabulary Entry or produces a Field
  Reference Finding when unsupported.

## Field Vocabulary Entry

- **Purpose**: Represents a known semantic token that field-reference validation
  can accept.
- **Key attributes**: canonical name, vocabulary source, DD-backed status,
  approved fallback status, current committed field status, control-token
  status.
- **Relationships**: May be derived from DD.csv, current engine/output field
  names, documented controls, or approved BSRS sample fallback semantics.

## Approved Fallback Field

- **Purpose**: Represents a BSRS field reference that is valid because it appears
  in approved sample semantics even though it has no matching DD.csv entry.
- **Key attributes**: token, source sample family, first source path, first row
  index, fallback reason.
- **Relationships**: Used only after DD-backed matching is not available.

## Suspicious Field Reference

- **Purpose**: Represents a field-like token that cannot be classified as a
  valid field, control, literal, function, operator, or approved fallback.
- **Key attributes**: token, source path, row index, column name, expression
  excerpt, suspicion reason.
- **Relationships**: Produces a deterministic Field Reference Finding.

## Field Reference Finding

- **Purpose**: Represents a structured warning or error from field-reference
  validation.
- **Key attributes**: finding code, severity, category, source path, row/block
  reference, column name, token, vocabulary source, DD-backed status, approved
  fallback status, message, rule version, producing module.
- **Relationships**: Links back to a BSRS Field Reference and the vocabulary
  resolution path used to classify it.

US1 findings currently link to extracted field-like references and the
DD-backed, current committed field, or approved fallback vocabulary path used to
classify them.

## Validation Rules

- Field-like tokens must be extracted from approved BSRS sample expressions and
  rows without treating quoted narrative text as fields.
- DD-backed names must be resolved through DD.csv before approved fallback
  semantics are considered.
- Current committed engine/output field names are accepted as known field
  vocabulary when they do not conflict with DD-backed names.
- Approved no-DD sample fields remain valid when the approved sample set
  provides the semantic fallback.
- Suspicious or orphan tokens must emit deterministic structured findings.
- Findings must be stable across repeated validation runs.
- Successful existing BSRS output packet content, persistence behavior, trace
  behavior, and adapter scope must remain unchanged.
