# Research: BSRS Field Reference Hardening

## Decision 1: Treat approved BSRS samples as the fallback vocabulary source

- Decision: Use committed approved BSRS configuration samples under
  `artifacts/reference/approved-samples/bsrs-config/` as the source of truth for
  approved no-DD fallback field semantics.
- Rationale: The feature is explicitly scoped to approved sample artifacts and
  existing BSRS behavior. Sample-driven fallback validation preserves reviewed
  casework names that may not be DD-backed.
- Alternatives considered: Require DD.csv entries for every referenced token;
  rejected because existing BSRS sample semantics include approved contract and
  control names without DD mappings.

## Decision 2: Resolve DD-backed fields before approved fallbacks

- Decision: When a field-like token has a matching DD.csv entry, validate it
  through the DD-backed canonical name before considering approved fallback
  semantics.
- Rationale: The repository constitution and V1 data dictionary invariant make
  DD.csv the canonical naming layer wherever a matching Data Dictionary field
  exists.
- Alternatives considered: Treat sample spellings as primary and DD.csv as
  advisory; rejected because it would weaken DD-first semantics and allow drift.

## Decision 3: Use current committed engine/output fields as vocabulary inputs

- Decision: Build the known field vocabulary from current committed
  engine/output field names and existing BSRS/V1/DD mapping helpers.
- Rationale: The user scoped the feature to already committed field names and
  prohibited new business domains or output adapters. Current fields define the
  deterministic vocabulary without expanding output behavior.
- Alternatives considered: Create a new external field registry; rejected as a
  new artifact and potential governance expansion not required for hardening.

## Decision 4: Classify non-field tokens conservatively

- Decision: Classify tokens as quoted literal text, functions, operators,
  numeric values, date literals, formatting markers, documented controls,
  DD-backed fields, current committed fields, approved fallbacks, or findings.
- Rationale: BSRS samples mix formulas, prose, controls, and fields in the same
  cells. Conservative classification avoids false field-reference errors for
  narrative and formatting tokens while still surfacing suspicious names.
- Alternatives considered: Regex every uppercase token as a field; rejected
  because it would over-report quoted prose and control syntax.

## Decision 5: Preserve validation-only behavior

- Decision: Add backend validation and regression protection around
  `bsrs_configuration_output`; do not change successful BSRS packet generation,
  persistence, traces, or adapter writes unless a later regression proves an
  explicitly scoped defect.
- Rationale: The user requested hardening only and prohibited new output
  adapters, new business domains, and behavior drift.
- Alternatives considered: Rework BSRS generation to consume field-reference
  validation results at runtime; rejected as unnecessary scope expansion for
  this increment.

## US1 MVP Source Inventory

- Approved BSRS configuration samples:
  `artifacts/reference/approved-samples/bsrs-config/**`
- Data Dictionary canonical field names: `artifacts/mappings/DD.csv`
- Current committed field vocabulary: existing engine/output field constants and
  BSRS/DD mapping helpers
