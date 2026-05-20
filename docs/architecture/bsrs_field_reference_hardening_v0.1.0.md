# BSRS Field Reference Hardening v0.1.0

This increment adds internal backend regression helpers for
`bsrs_configuration_output` field-reference validation. The MVP covers
field-like token extraction, DD-first field resolution, current committed field
vocabulary, and approved no-DD fallback semantics for committed BSRS sample
configuration artifacts.

## Validation Sources

- `artifacts/reference/approved-samples/bsrs-config/**`
- `artifacts/mappings/DD.csv`
- Current committed engine/output field names

## Boundaries

- No server calls, hosted APIs, or external persistence
- No raw OCR or raw source-document reads
- No new output adapters, migrations, or persistence tables
- No changes to successful BSRS output packet content

## Trace Shape

Field-reference findings are deterministic records containing source path, row
index, column name, token, severity, code, rule version, producing module, and
semantic category.
