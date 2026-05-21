# Contract: BSRS Block Pattern Validation

## Scope

This contract defines internal backend validation behavior for block-pattern
hardening of `bsrs_configuration_output`. It does not define a new output
adapter, public API, persistence table, user-facing workflow, or business
domain.

## Input Contract

Validation consumes only approved repository artifacts and existing deterministic
semantics:

- `artifacts/reference/approved-samples/bsrs-config/statements/**`
- `artifacts/reference/approved-samples/bsrs-config/recalculations/**`
- `artifacts/reference/approved-samples/bsrs-config/optional-forms/**`
- existing BSRS sample parser and source-normalization helpers
- existing BSRS semantic finding and trace helpers
- existing deterministic BSRS output fixtures for behavior-preservation checks

Raw OCR, raw documents, emails, images, PDFs, hosted services, and unreviewed
extraction output are disallowed inputs.

## Validation Categories

### Statement Block Patterns

- Recognize approved statement section markers and line clusters from committed
  statement sample artifacts.
- Validate required section presence, relative order, and supporting line
  clusters.
- Distinguish formatting-only and narrative rows from semantic block evidence.

### Recalculation Block Patterns

- Recognize approved recalculation section markers, participant-data support
  clusters, and recalculation-support line clusters.
- Validate expected sequence and required cluster attachment to the correct
  section context.
- Emit deterministic findings for missing clusters or unexpected section
  transitions.

### Optional-Form Block Patterns

- Recognize approved optional-form families and line-cluster patterns from
  committed optional-form sample artifacts.
- Preserve approved fallback behavior for sample-backed labels that are not new
  business-domain concepts.
- Emit deterministic findings for suspicious labels, orphan clusters, or missing
  required optional-form evidence.

### Section Sequence and Line-Cluster Behavior

- Validate source-path stable section ordering for each block family.
- Classify line clusters as semantic markers, details, support rows, subtotals,
  narrative rows, formatting rows, or spacers.
- Ensure repeated validation over identical approved artifacts produces stable
  accepted classifications and finding payloads.

## Finding Shape

Each block-pattern validation finding must include:

- `code`
- `severity`
- `category`
- `source_path`
- `row_index`
- `column_name`
- `token`
- `block_family`
- `section_context`
- `line_cluster`
- `message`
- `rule_version`
- `producing_module`

Findings must be sorted and serialized deterministically across repeated runs
for the same approved artifacts and rule version.

## Behavior Preservation

Block-pattern validation must not change:

- successful `bsrs_configuration_output` packet content
- existing BSRS output persistence rows
- existing trace rows, except where current contracts already require validation
  evidence
- V1/VE output behavior
- valuation listings output behavior
- benefit calculation behavior

## Out of Scope

- New output adapters
- New business domains
- New database migrations, seeds, or persistence tables
- Runtime recalculation of benefits
- Direct reads from raw source documents or unreviewed extraction output
- UI/reporting surfaces for validation findings
