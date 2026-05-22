# Data Model: BSRS Optional-Form Pattern Hardening

## Optional-Form Block Pattern

Approved sample-derived structure describing the optional-form block family and
its expected structural evidence.

**Fields**

- `block_family`: `optional_form`
- `source_path`: approved optional-form sample artifact path
- `form_family`: approved sample family such as `single_life`,
  `single_and_joint`, or `qpsa_qdro`
- `required_sections`: ordered optional-form labels expected from the approved
  samples
- `line_clusters`: approved line or row clusters that support optional-form
  validation
- `format_context`: formatting markers that help classify rows but do not
  replace semantic evidence

**Validation Rules**

- Must derive from approved optional-form BSRS sample configuration artifacts.
- Must not be inferred from raw source documents or unreviewed extraction
  output.
- Must preserve deterministic ordering by source path, form family, section
  order, row index, and finding code.

## Optional-Form Family

Approved grouping for optional-form sample patterns without creating a new
business domain.

**Fields**

- `family_key`
- `source_paths`
- `approved_labels`
- `expected_cluster_keys`

**Validation Rules**

- Family identity must be derived from approved committed sample artifacts.
- Family labels may vary by approved sample, but unrecognized suspicious labels
  must produce structured findings.
- Validation must not add actuarial calculation semantics beyond the existing
  BSRS output contract.

## Optional-Form Section Sequence

Ordered evidence that optional-form sections appear in the approved order.

**Fields**

- `source_path`
- `form_family`
- `section_marker`
- `expected_order`
- `actual_order`
- `evidence_row_indexes`

**Validation Rules**

- Required optional-form sections must be present in approved order.
- Missing, duplicated, suspicious, orphaned, or out-of-order sections must emit
  structured findings.

## Optional-Form Line Cluster

Group of related rows that together represent approved optional-form detail,
support item, unavailable-benefit message, subtotal, narrative, or formatting
context.

**Fields**

- `source_path`
- `form_family`
- `section_marker`
- `cluster_key`
- `row_indexes`
- `semantic_role`: `marker`, `support`, `detail`, `unavailable_benefit`,
  `subtotal`, `narrative`, `formatting`, or `spacer`

**Validation Rules**

- Formatting, spacer, narrative, and unavailable-benefit rows must not be
  treated as missing semantic evidence.
- Orphan clusters with no approved optional-form section context must emit
  structured findings.

## Optional-Form Row Role

Classification of an optional-form sample row for validation purposes.

**Fields**

- `source_path`
- `row_index`
- `form_family`
- `section_context`
- `line_cluster`
- `semantic_role`
- `token`
- `column_name`

**Validation Rules**

- Semantic marker rows establish section context.
- Support, detail, unavailable-benefit, subtotal, and narrative rows must attach
  to an approved optional-form section context.
- Formatting-only and spacer rows must be accepted without creating missing
  section findings.

## Optional-Form Pattern Finding

Structured warning or error emitted by optional-form-pattern validation.

**Fields**

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

**Validation Rules**

- Findings must be sorted deterministically.
- Repeated runs over identical approved samples must produce the same payload
  shape and ordering.
- Findings must not imply new persistence or adapter writes outside existing
  contracts.
