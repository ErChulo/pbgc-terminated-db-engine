# Data Model: BSRS Block Pattern Hardening

## BSRS Block Pattern

Represents an approved sample-derived block family and its expected structural
evidence.

**Fields**

- `block_family`: `statement`, `recalculation`, or `optional_form`
- `source_path`: approved sample artifact path
- `required_sections`: ordered section markers expected for the block family
- `line_clusters`: approved line or row clusters that support the block family
- `format_context`: formatting markers that help classify, but do not replace,
  semantic block evidence

**Validation Rules**

- Must derive from approved BSRS sample configuration artifacts.
- Must not be inferred from raw source documents or unreviewed extraction output.
- Must preserve deterministic ordering by source path, section order, row index,
  and finding code.

## Statement Block Pattern

Specialized block pattern for approved participant statement sections.

**Fields**

- `statement_section`: section label or marker from approved samples
- `section_order`: approved relative order
- `line_cluster_keys`: detail/support rows associated with the section
- `evidence_rows`: source row indexes that prove the pattern

**Validation Rules**

- Required statement sections must be present in approved order.
- Missing, duplicated, suspicious, orphaned, or out-of-order sections must emit
  structured findings.

## Recalculation Block Pattern

Specialized block pattern for recalculation-oriented sample blocks.

**Fields**

- `recalculation_section`: participant-data or recalculation-support section
- `section_order`: approved relative order
- `line_cluster_keys`: recalculation support clusters
- `evidence_rows`: source row indexes that prove the pattern

**Validation Rules**

- Recalculation support clusters must remain attached to the expected section
  context.
- Unexpected section transitions or missing clusters must emit structured
  findings without changing BSRS output generation.

## Optional-Form Block Pattern

Specialized block pattern for approved optional-form families.

**Fields**

- `form_family`: approved form-family label such as single-life,
  single-and-joint, QPSA, QDRO, or related approved family
- `section_context`: optional-form section marker
- `line_cluster_keys`: approved detail clusters for the form family
- `approved_fallback_status`: whether the label is accepted as an approved
  sample fallback rather than a new domain concept

**Validation Rules**

- Approved optional-form families must be recognized without adding new business
  domains.
- Suspicious labels or orphan line clusters must emit structured findings.

## Section Sequence

Ordered evidence that a block family's sections appear in the approved order.

**Fields**

- `source_path`
- `block_family`
- `section_marker`
- `expected_order`
- `actual_order`
- `evidence_row_indexes`

**Validation Rules**

- Sequence comparison must be deterministic and repeatable.
- Missing, duplicated, or out-of-order section markers must be reported with
  stable finding codes.

## Line Cluster

Group of related rows that together represent an approved BSRS block detail,
support item, subtotal, narrative, or formatting context.

**Fields**

- `source_path`
- `block_family`
- `section_marker`
- `cluster_key`
- `row_indexes`
- `semantic_role`: `marker`, `detail`, `support`, `subtotal`, `narrative`,
  `formatting`, or `spacer`

**Validation Rules**

- Formatting and spacer rows must not be treated as missing semantic evidence.
- Orphan clusters with no approved section context must emit structured
  findings.

## Block Pattern Finding

Structured warning or error emitted by block-pattern validation.

**Fields**

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

**Validation Rules**

- Findings must be sorted deterministically.
- Repeated runs over identical approved samples must produce the same payload
  shape and ordering.
- Findings must not imply new persistence or adapter writes outside existing
  contracts.
