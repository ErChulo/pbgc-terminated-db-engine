# Contract: BSRS Optional-Form Pattern Validation

## Scope

This contract defines internal backend validation behavior for optional-form
pattern hardening of `bsrs_configuration_output`. It does not define a new
output adapter, public API, persistence table, user-facing workflow, or business
domain.

## Input Contract

Validation consumes only approved repository artifacts and existing deterministic
semantics:

- `artifacts/reference/approved-samples/bsrs-config/optional-forms/**`
- existing BSRS sample parser and source-normalization helpers
- existing BSRS block-pattern and semantic finding helpers
- existing deterministic BSRS output fixtures for behavior-preservation checks

Raw OCR, raw documents, emails, images, PDFs, hosted services, and unreviewed
extraction output are disallowed inputs.

## Validation Categories

### Optional-Form Block Patterns

- Recognize approved optional-form family labels, section markers, and line
  clusters from committed optional-form sample artifacts.
- Validate required section presence, relative order, and supporting line
  clusters for approved optional-form families.
- Distinguish formatting-only, narrative, and unavailable-benefit rows from
  semantic optional-form evidence.

### Optional-Form Row Role Classification

- Classify rows as semantic markers, support rows, detail rows,
  unavailable-benefit rows, subtotals, narrative rows, formatting rows, or
  spacers.
- Ensure formatting-only, narrative, spacer, and unavailable-benefit rows do not
  create false missing-section findings.
- Emit findings for orphan semantic rows that lack approved optional-form
  section context.

### Section Sequence and Stability

- Validate source-path stable optional-form section ordering.
- Ensure repeated validation over identical approved artifacts produces stable
  accepted classifications and finding payloads.

## Finding Shape

Each optional-form-pattern validation finding must include:

- `code`
- `severity`
- `category`
- `source_path`
- `row_index`
- `column_name`
- `token`
- `block_family`
- `form_family`
- `section_context`
- `line_cluster`
- `message`
- `rule_version`
- `producing_module`

Findings must be sorted and serialized deterministically across repeated runs
for the same approved artifacts and rule version.

## Behavior Preservation

Optional-form-pattern validation must not change:

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
