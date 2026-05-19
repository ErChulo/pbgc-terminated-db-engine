# Research: BSRS Semantic Hardening

## Decision 1: Treat approved BSRS samples as the semantic validation source

- Decision: Use the committed approved BSRS configuration sample files under
  `artifacts/reference/approved-samples/bsrs-config/` as the source of truth for
  expected PrintCriteria, field-reference, line/section, statement,
  recalculation, and optional-form semantics.
- Rationale: The user explicitly scoped this increment to approved repository
  artifacts and existing BSRS behavior. Sample-driven checks protect real
  reviewed patterns without creating new business domains.
- Alternatives considered: Introduce synthetic BSRS semantic fixtures; rejected
  because they would expand scope and may not reflect approved casework
  artifacts.

## Decision 2: Validate Statement Authoring functions from the committed list

- Decision: Use
  `artifacts/guidance/bsrs/statement-authoring/BSRS functions.txt` as the
  allowed function vocabulary for `@FUNCTION(...)` references in BSRS sample
  expressions.
- Rationale: This keeps function semantics aligned with the approved Statement
  Authoring guidance and prevents silent acceptance of unsupported functions.
- Alternatives considered: Infer allowed functions from sample usage only;
  rejected because sample usage cannot prove unsupported functions should be
  valid.

## Decision 3: Use conservative token classification for field references

- Decision: Classify references as known fields, approved sample fields,
  Statement Authoring functions, literals, operators, control tokens, or
  semantic validation findings. Do not require every approved BSRS sample token
  to have a matching Data Dictionary entry.
- Rationale: Approved BSRS samples include contract and control names that may
  not be DD-backed. This preserves the existing DD-first invariant where a DD
  match exists while allowing approved contract-name fallback.
- Alternatives considered: Require DD.csv entries for every token; rejected
  because the existing repository already allows approved no-DD fallbacks.

## Decision 4: Add semantic validation without changing BSRS output behavior

- Decision: Add backend validation and regression protection around
  `bsrs_configuration_output`; do not alter successful BSRS packet generation,
  persistence, or adapter writes unless a regression proves a defect.
- Rationale: The user requested hardening only and explicitly prohibited new
  output adapters or business domains.
- Alternatives considered: Rework BSRS generation to consume parsed sample
  semantics at runtime; rejected as unnecessary scope expansion for this
  increment.

## Decision 5: Keep validation findings deterministic and traceable

- Decision: Validation findings must include source artifact path, row or block
  reference, referenced token, semantic category, severity, and stable code.
- Rationale: Hardening tests need repeatable structured errors/warnings and a
  reviewable path back to approved artifacts.
- Alternatives considered: Free-form assertion messages only; rejected because
  they are harder to compare across repeated runs and weaker for trace review.
