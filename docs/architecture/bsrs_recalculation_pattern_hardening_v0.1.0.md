# BSRS Recalculation Pattern Hardening — Architecture Note

**Version**: v0.1.0  
**Scope**: Backend semantic validation and regression protection for `bsrs_configuration_output` recalculation patterns.

## Overview

The recalculation-pattern hardening increment validates approved BSRS recalculation block patterns from committed sample configuration artifacts. It ensures:

- Approved recalculation section sequencing (participant data, line clusters)
- Recalculation-specific row-role classification (marker, support, detail, subtotal, narrative, formatting, spacer)
- Structured findings for missing, duplicated, out-of-order, suspicious, and orphan recalculation evidence
- Deterministic stability across repeated runs
- No leakage into unrelated output adapters or business domains

## Validation Sources

- `artifacts/reference/approved-samples/bsrs-config/recalculations/sample-bsrs-recalculation-config.txt`

## Implementation Modules

| Module | Responsibility |
|---|---|
| `bsrsBlockPatternValidation.ts` | `validateRecalculationBlockPatterns`, recalculation row classification, cluster sequence validation |
| `bsrsSemanticValidation.ts` | `validateBsrsSemanticBlockPatterns` — wrapper that calls all block-family validators |
| `semanticValidationTypes.ts` | Shared finding shape with `block_family`, `section_context`, `line_cluster` metadata |

## Recalculation Finding Codes

| Code | Severity | Description |
|---|---|---|
| `BSRS_RECALCULATION_CLUSTER_MISSING` | error | Required approved cluster not found in sample |
| `BSRS_RECALCULATION_CLUSTER_DUPLICATED` | error | Approved cluster appears more than once |
| `BSRS_RECALCULATION_CLUSTER_OUT_OF_ORDER` | error | Cluster not in approved sequence |
| `BSRS_RECALCULATION_CLUSTER_SUSPICIOUS` | warning | Row has label pattern not matching any approved cluster |
| `BSRS_RECALCULATION_ROW_ORPHAN` | warning | Row has semantic content but no recognized section context |

## Recalculation Row Roles

| Role | Description |
|---|---|
| `marker` | Section header (e.g., "Participant Data") |
| `support` | Reference data (e.g., "Normal Retirement Date:", "Earliest Retirement Date:") |
| `detail` | Value-bearing row (e.g., "Name:", "Date of Birth:", "Sex:") |
| `subtotal` | Aggregated calculation row |
| `narrative` | Long descriptive text (>40 chars) |
| `formatting` | Format codes with no content |
| `spacer` | Completely empty rows |

## Test Coverage

| Test File | Tests | Coverage |
|---|---|---|
| `hardening-bsrs-block-patterns.test.ts` | 8 recalculation tests | US1 acceptance, malformed findings, US2 row-role classification, formatting false-positive, orphan detection, US3 repeated-run stability, statement regression |
| `hardening-bsrs-semantic-behavior.test.ts` | 8 tests | US3 adapter-exclusion, module boundary isolation, field vocabulary, contract preservation |

## Boundaries Preserved

- No new business domains or output adapters
- No server calls, external persistence, or raw source reads
- No changes to existing `bsrs_configuration_output` packet content, persistence, or trace behavior
- Semantic validation is a hardening layer, not a runtime gate — `runBsrsConfiguration` does not import semantic validation helpers
