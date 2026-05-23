# Contract: Cross-Slice Reconciliation Validation

## Scope

This contract defines internal backend validation behavior for cross-slice
reconciliation hardening across existing `bsrs_configuration_output`,
`v1_ve_output`, and `valuation_listings_output` evidence. It does not define a
new output adapter, public API, persistence table, user-facing workflow,
business domain, or actuarial calculation.

## Input Contract

Validation consumes only approved repository artifacts and existing
deterministic evidence:

- `artifacts/mappings/DD.csv`
- `artifacts/reference/approved-samples/bsrs-config/**`
- `artifacts/reference/approved-samples/v1-workbooks/**`
- existing BSRS, V1/VE, and valuation-listing contracts
- existing output fixtures and regression evidence in `packages/tests`
- existing reviewed engine/output field names and trace mapping documents

Raw OCR, raw documents, emails, images, PDFs, hosted services, unreviewed
extraction output, runtime network input, and uncommitted external workbooks or
documents are disallowed inputs.

## Validation Categories

### Shared Fact Agreement

- Compare selected shared participant identifiers, plan or case identifiers,
  form references, and DD-backed field semantics represented in more than one
  implemented output slice.
- Emit accepted comparison records when shared facts agree after approved
  normalization.
- Emit structured drift findings when equivalent reviewed facts disagree across
  slices.

### DD-First Mapping

- Resolve matching V1/VE field semantics through `artifacts/mappings/DD.csv`
  before comparison.
- Use approved contract-name fallback only when no DD.csv entry exists.
- Record DD mapping or fallback basis in every comparison and finding.

### Boundary Classification

- Distinguish true drift from explicit nulls, unsupported-branch warnings,
  absent optional evidence, and formatting-only differences already accepted by
  current output contracts.
- Treat unsupported or optional evidence as structured non-drift statuses unless
  the current contract requires counterpart evidence.

### Deterministic Stability

- Sort comparison records and findings deterministically by case, semantic name,
  slice pair, field names, source paths, status, severity, and code.
- Ensure repeated validation over identical approved artifacts and committed
  output evidence produces byte-stable accepted comparison records and warning
  or error payloads.

## Finding Shape

Each reconciliation finding must include:

- `code`
- `severity`
- `category`
- `case_id`
- `reviewed_fact_context`
- `canonical_semantic_name`
- `mapping_basis`
- `dd_field_name`
- `fallback_name`
- `compared_slices`
- `compared_fields`
- `compared_values`
- `source_paths`
- `rule_version`
- `producing_module`
- `message`

Findings must be sorted and serialized deterministically across repeated runs
for the same approved artifacts, committed output evidence, and rule version.

## Behavior Preservation

Cross-slice reconciliation validation must not change:

- successful `bsrs_configuration_output` packet content
- successful `v1_ve_output` packet content
- successful `valuation_listings_output` packet content
- existing persistence tables, migrations, seeds, or output rows except where
  current contracts already require validation evidence
- existing trace rows except where current contracts already require validation
  evidence
- benefit, form, service, compensation, or date resolution behavior
- browser-only sql.js runtime boundaries

## Out of Scope

- New output adapters
- New business domains
- New database migrations, seeds, or persistence tables
- Runtime recalculation of benefits
- Direct reads from raw source documents or unreviewed extraction output
- UI/reporting surfaces for validation findings
- Network or hosted validation services
