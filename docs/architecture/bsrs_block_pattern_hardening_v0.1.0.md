# BSRS Block Pattern Hardening v0.1.0

## Scope

Backend validation and regression protection for `bsrs_configuration_output` block patterns using approved BSRS sample configuration artifacts already committed in the repository. Covers statement, recalculation, and optional-form block pattern validation.

## Architecture

### Module

`packages/engine/bsrs-configuration-output/src/bsrsBlockPatternValidation.ts`

### Exported Validation Functions

| Function | Block Family | Description |
|---|---|---|
| `validateStatementBlockPatterns` | `statement` | Validates statement section sequencing and line-cluster classification |
| `validateRecalculationBlockPatterns` | `recalculation` | Validates recalculation section sequencing, cluster attachment, and row-role classification |
| `validateOptionalFormBlockPatterns` | `optional_form` | Validates optional-form family labels, section context, line clusters, and orphan detection |

### Shared Design Patterns

All three block-family validators follow the same architecture:

1. **Sample Filtering** — Filter inputs to the current block family
2. **Row Classification** — Two-pass content-driven row-role classification
3. **Section/Cluster Sequence Validation** — Check required markers, order, and completeness
4. **Finding Emission** — Structured findings with source path, row index, block family, section context, line cluster, rule version, producing module, severity, and finding code

### Row Role Classification

Rows are classified into semantic roles using content-driven heuristics:

| Role | Detection |
|---|---|
| `marker` | Matches a section/cluster definition pattern |
| `support` | Recalculation supporting data rows |
| `detail` | Contains formula references or benefit data |
| `subtotal` | Aggregated calculation rows |
| `narrative` | Long descriptive text (>40 chars) or known narrative patterns |
| `formatting` | Format tokens only (e.g., TL, TH, BOLD) |
| `spacer` | Empty rows |
| `unavailable_benefit` | Optional-form rows indicating benefit not available |

### Section Definitions

Each block family has a section/cluster definition constant (e.g., `STATEMENT_SECTION_DEFINITIONS`, `RECALCULATION_CLUSTER_DEFINITIONS`, `OPTIONAL_FORM_SECTION_DEFINITIONS`) mapping label patterns to approved sections.

## Finding Codes

### Statement Findings

| Code | Severity | Description |
|---|---|---|
| `BSRS_STATEMENT_SECTION_MISSING` | `error` | Required statement section not found |
| `BSRS_STATEMENT_SECTION_OUT_OF_ORDER` | `error` | Statement sections in wrong order |
| `BSRS_STATEMENT_SECTION_DUPLICATED` | `warning` | Duplicate statement section markers |
| `BSRS_STATEMENT_SECTION_SUSPICIOUS` | `warning` | Unrecognized section-like label |

### Recalculation Findings

| Code | Severity | Description |
|---|---|---|
| `BSRS_RECALCULATION_CLUSTER_MISSING` | `error` | Required recalculation cluster not found |
| `BSRS_RECALCULATION_CLUSTER_OUT_OF_ORDER` | `error` | Recalculation clusters in wrong order |
| `BSRS_RECALCULATION_CLUSTER_DUPLICATED` | `warning` | Duplicate recalculation cluster markers |
| `BSRS_RECALCULATION_CLUSTER_SUSPICIOUS` | `warning` | Unrecognized cluster-like marker |
| `BSRS_RECALCULATION_ROW_ORPHAN` | `warning` | Content row before first recalculation cluster |

### Optional-Form Findings

| Code | Severity | Description |
|---|---|---|
| `BSRS_OPTIONAL_FORM_SECTION_MISSING` | `error` | Required optional-form section not found |
| `BSRS_OPTIONAL_FORM_SECTION_OUT_OF_ORDER` | `error` | Optional-form sections in wrong order |
| `BSRS_OPTIONAL_FORM_SECTION_DUPLICATED` | `warning` | Duplicate section markers |
| `BSRS_OPTIONAL_FORM_SECTION_SUSPICIOUS` | `warning` | Unrecognized form-family label |
| `BSRS_OPTIONAL_FORM_ROW_ORPHAN` | `warning` | Content row before first section marker |

### Shared Finding Shape

```typescript
interface BsrsBlockPatternFinding {
  block_family: BsrsBlockFamily;
  form_family?: BsrsOptionalFormFamily;
  section_context: string;
  line_cluster: BsrsBlockLineCluster;
  code: string;
  severity: "error" | "warning";
  source_path: string;
  row_index: number;
  column_name?: string;
  token?: string;
  message: string;
  rule_version: string;
  producing_module: "bsrs_configuration_output";
}
```

## Test Coverage

| Test File | Tests | Coverage |
|---|---|---|
| `hardening-bsrs-block-patterns.test.ts` | 16 | Statement (3), Recalculation (7), Optional-Form (6) |
| `hardening-bsrs-semantic-behavior.test.ts` | 8 | Behavior preservation, adapter exclusion, field vocabulary |

## Validation Sources

- `artifacts/reference/approved-samples/bsrs-config/statements/sample-bsrs-statement-config.txt`
- `artifacts/reference/approved-samples/bsrs-config/recalculations/sample-bsrs-recalculation-config.txt`
- `artifacts/reference/approved-samples/bsrs-config/optional-forms/single-life/sample-bsrs-OFA_SingleLife-config.txt`
- `artifacts/reference/approved-samples/bsrs-config/optional-forms/single-and-joint/sample-bsrs-OFA_SingleAndJoint-config.txt`
- `artifacts/reference/approved-samples/bsrs-config/optional-forms/qpsa-qdro/sample-bsrs-OFA_QPSA-QDRO-config.txt`

## Deterministic Boundary

- Reads only approved BSRS sample configuration artifacts
- Writes only validation evidence (findings, classifications)
- Does not change BSRS output packet content, persistence behavior, or adapter scope
- No new business domains, output adapters, migrations, or external dependencies
- Repeated runs over identical artifacts produce byte-stable finding payloads
