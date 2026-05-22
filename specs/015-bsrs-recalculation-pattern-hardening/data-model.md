# Data Model: BSRS Recalculation Pattern Hardening

## Recalculation Block Pattern

Approved sample-derived structure describing the recalculation block family and
its expected structural evidence.

**Fields**

- `block_family`: `recalculation`
- `source_path`: approved recalculation sample artifact path
- `required_sections`: ordered recalculation section markers expected from the
  approved sample
- `line_clusters`: approved line or row clusters that support recalculation
  validation
- `format_context`: formatting markers that help classify rows but do not
  replace semantic evidence

**Validation Rules**

- Must derive from approved recalculation BSRS sample configuration artifacts.
- Must not be inferred from raw source documents or unreviewed extraction output.
- Must preserve deterministic ordering by source path, section order, row index,
  and finding code.

## Recalculation Section Sequence

Ordered evidence that recalculation sections appear in the approved order.

**Fields**

- `source_path`
- `section_marker`
- `expected_order`
- `actual_order`
- `evidence_row_indexes`

**Validation Rules**

- Required recalculation sections must be present in approved order.
- Missing, duplicated, suspicious, orphaned, or out-of-order sections must emit
  structured findings.

## Recalculation Line Cluster

Group of related rows that together represent approved recalculation detail,
support item, subtotal, narrative, or formatting context.

**Fields**

- `source_path`
- `section_marker`
- `cluster_key`
- `row_indexes`
- `semantic_role`: `marker`, `support`, `detail`, `subtotal`, `narrative`,
  `formatting`, or `spacer`

**Validation Rules**

- Formatting and spacer rows must not be treated as missing semantic evidence.
- Orphan clusters with no approved recalculation section context must emit
  structured findings.

## Recalculation Row Role

Classification of a recalculation sample row for validation purposes.

**Fields**

- `source_path`
- `row_index`
- `section_context`
- `line_cluster`
- `semantic_role`
- `token`
- `column_name`

**Validation Rules**

- Semantic marker rows establish section context.
- Support, detail, subtotal, and narrative rows must attach to an approved
  recalculation section context.
- Formatting-only and spacer rows must be accepted without creating missing
  section findings.

## Recalculation Pattern Finding

Structured warning or error emitted by recalculation-pattern validation.

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
