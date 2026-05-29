# BSRS Optional-Form Pattern Hardening v0.1.0

## Scope
Hardening the BSRS optional-form block-pattern validation to classify every optional-form row with content-driven semantic roles, detect orphan rows, and preserve deterministic behavior across repeated runs. This hardening extends the existing `validateOptionalFormBlockPatterns` surface without altering statement or recalculation validation boundaries.

## Architecture Decision: Two-Pass Content-Driven Classification

Unlike the statement block-pattern validation (where section markers are pure heading rows and get the `"marker"` role), optional-form section first-matched rows may carry content (benefit formulas, "annuity form not available" details, or narrative text). The classifier uses a two-pass approach:

1. **First pass**: Identify the FIRST matching row per approved section definition. Classify it with `classifyOptionalFormRowRole` using content-driven rules — it may receive `"detail"`, `"unavailable_benefit"`, `"narrative"`, or `"formatting"` rather than `"marker"`.

2. **Second pass**: Classify all remaining rows (not matched as section-first rows) with `classifyOptionalFormRowRole`. Section context is assigned via `nearestPriorOptionalFormSection` using the `sectionRowIndexes` Set.

## Row Roles

| Role | Detection | Used By |
|---|---|---|
| `detail` | Row has a non-empty Detail column value (formula reference, benefit amount, etc.) | Optional-form rows |
| `unavailable_benefit` | Detail column matches `annuity form not available` or `joint life amounts not requested` (case-insensitive) | Optional-form rows only |
| `narrative` | Description matches popup/explanation patterns (`* If the beneficiary`, `increases to the amount`, `Monthly Benefit for First`, `Monthly Benefit After`, `Only available for spouse`) or exceeds 40 characters | Optional-form rows; recalculation rows use similar threshold |
| `formatting` | Row has format codes (DescFormat/DtlFormat) but no content, or matches divider regex `/^[-=*_#]{3,}$/` | All block families |
| `spacer` | Row has no description, no detail, and no format codes | All block families |

The `"unavailable_benefit"` role is specific to optional-form validation. It was added to the shared `BsrsBlockSemanticRole` union type to keep the classification surface unified, but only `classifyOptionalFormRowRole` produces it.

## Orphan Detection

Rows with semantic content that appear **before the first recognized section marker** and are not formatting/spacer artifacts produce `BSRS_OPTIONAL_FORM_ROW_ORPHAN` findings (severity: `warning`). The design deliberately does not flag rows **between** sections as orphans — those are assumed to belong to the nearest prior section.

## Finding Codes

| Code | Severity | Detected By |
|---|---|---|
| `BSRS_OPTIONAL_FORM_SECTION_MISSING` | error | `validateOptionalFormSectionSequence` |
| `BSRS_OPTIONAL_FORM_SECTION_OUT_OF_ORDER` | error | `validateOptionalFormSectionSequence` |
| `BSRS_OPTIONAL_FORM_SECTION_DUPLICATED` | error | `validateOptionalFormSectionSequence` |
| `BSRS_OPTIONAL_FORM_SECTION_SUSPICIOUS` | warning | `validateOptionalFormSectionSequence` |
| `BSRS_OPTIONAL_FORM_ROW_ORPHAN` | warning | `validateOptionalFormSectionSequence` |

## Test Coverage

| Test | What It Verifies |
|---|---|
| T019 | All approved optional-form rows classified with content-driven roles (`detail`, `unavailable_benefit`, `narrative`, `formatting`). `unavailable_benefit` confirmed present in approved samples. |
| T020 | Formatting/spacer rows do not create false missing-section or orphan findings. |
| T021 | Synthetic orphan rows before the first section marker produce `BSRS_OPTIONAL_FORM_ROW_ORPHAN` findings with correct block_family, form_family, section_context, and severity. |

## Key Implementation Files

- `packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts` — Core validation logic
- `packages/tests/hardening-bsrs-block-patterns.test.ts` — Hardening test suite (16 tests)
