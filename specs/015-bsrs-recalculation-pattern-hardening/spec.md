# Feature Specification: BSRS Recalculation Pattern Hardening

**Feature Branch**: `014-bsrs-recalculation-pattern-hardening`

**Created**: 2026-05-21

**Status**: Draft

**Input**: User description: "Build a BSRS recalculation-pattern-hardening increment for the PBGC terminated defined-benefit engine. Scope only backend validation and regression protection for bsrs_configuration_output using the approved BSRS sample configuration artifacts already in the repository. Do not add new business domains or new output adapters. Focus on semantic validation of approved recalculation block patterns, expected recalculation section sequencing, recalculation-specific semantic-versus-formatting row distinction, structured findings, and repeated-run stability. Preserve existing contracts, browser-only sql.js boundaries, and existing slice behavior."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Validate approved recalculation block patterns (Priority: P1)

A reviewer needs the BSRS hardening checks to recognize approved recalculation block patterns in committed BSRS sample configuration artifacts and report structural regressions before existing BSRS output behavior changes.

**Why this priority**: Recalculation blocks are a focused backend validation surface for this increment and must remain stable without broadening the engine into new domains or adapters.

**Independent Test**: Can be fully tested by running recalculation-pattern validation against the approved recalculation BSRS sample artifact and confirming that approved recalculation sections and line clusters are accepted while malformed recalculation evidence emits deterministic structured findings.

**Acceptance Scenarios**:

1. **Given** approved recalculation BSRS sample configuration artifacts, **When** recalculation-pattern validation runs, **Then** each expected recalculation section, line cluster, and sequence relationship is classified as accepted or reported with a structured finding.
2. **Given** sample-derived recalculation evidence with a missing, duplicated, or out-of-order recalculation section, **When** validation runs, **Then** the engine emits deterministic structured findings with source artifact, block family, section marker, line-cluster evidence, rule version, and producing module.

---

### User Story 2 - Preserve recalculation-specific row semantics (Priority: P2)

A reviewer needs recalculation validation to distinguish semantic recalculation rows from formatting, spacer, narrative, subtotal, and detail rows so approved formatting does not create false structural failures.

**Why this priority**: Approved BSRS recalculation samples contain formatting and narrative rows that support presentation but should not be mistaken for missing semantic recalculation evidence.

**Independent Test**: Can be tested by validating sample-derived recalculation rows that include formatting-only rows and semantic rows, then confirming that each is classified in the expected semantic role.

**Acceptance Scenarios**:

1. **Given** approved recalculation sample rows with formatting, spacer, narrative, subtotal, and detail content, **When** validation classifies row roles, **Then** formatting rows are not treated as missing recalculation sections.
2. **Given** a recalculation line cluster with an orphan semantic row and no approved section context, **When** validation runs, **Then** a structured finding identifies the orphan evidence without changing BSRS output generation.

---

### User Story 3 - Preserve deterministic behavior and existing slice boundaries (Priority: P3)

A reviewer needs recalculation-pattern validation to produce stable findings across repeated runs while preserving existing BSRS contracts, browser-only boundaries, and downstream output behavior.

**Why this priority**: Hardening value depends on repeatable evidence and no unrelated behavior changes in the existing stack.

**Independent Test**: Can be tested by running identical recalculation validation inputs repeatedly and comparing accepted classifications, structured findings, and existing BSRS output regression behavior.

**Acceptance Scenarios**:

1. **Given** identical approved recalculation BSRS sample artifacts, **When** validation runs repeatedly, **Then** accepted classifications and finding payloads are byte-stable.
2. **Given** recalculation-pattern validation is enabled, **When** existing BSRS output regression checks run, **Then** existing contract, output, persistence, trace, and adapter-exclusion behavior remains unchanged.

---

### Edge Cases

- Approved recalculation samples contain formatting-only rows, spacer rows, or narrative rows that resemble block boundaries.
- A recalculation section appears before its expected predecessor or appears more than once.
- A required recalculation support cluster is missing while surrounding formatting rows remain present.
- A recalculation detail row has no recognized recalculation section context.
- Repeated validation sees approved artifacts in a different enumeration order and must still produce stable ordered results.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST validate approved BSRS recalculation block patterns against approved BSRS sample configuration artifacts already committed in the repository.
- **FR-002**: System MUST validate expected recalculation section sequencing and report missing, duplicated, out-of-order, suspicious, or orphan recalculation evidence.
- **FR-003**: System MUST classify recalculation-specific row roles, including semantic markers, support rows, detail rows, subtotals, narrative rows, formatting rows, and spacers.
- **FR-004**: System MUST avoid treating formatting-only, spacer, subtotal, or narrative rows as missing recalculation semantic evidence.
- **FR-005**: System MUST emit deterministic structured warnings or errors for recalculation-pattern failures.
- **FR-006**: System MUST preserve traceability for every recalculation-pattern finding, including source artifact, block family, section context, line cluster, rule version, producing module, severity, and finding code.
- **FR-007**: System MUST produce identical accepted classifications and structured finding payloads across repeated runs over the same approved recalculation sample artifacts.
- **FR-008**: System MUST preserve existing bsrs_configuration_output contracts, current successful output behavior, existing browser-only sql.js boundaries, and existing deterministic slice behavior.
- **FR-009**: System MUST NOT add new business domains, new output adapters, server calls, external persistence, raw OCR reads, raw source-document reads, or unreviewed-input reads.
- **FR-010**: System MUST limit any persistence or trace writes to existing contract-required validation evidence, deterministic outputs, warnings, errors, traces, and existing persistence rows; it MUST NOT imply new lower source-layer writes.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Approved BSRS recalculation sample configuration artifacts already committed in the repository, existing deterministic BSRS output fixtures, current BSRS contracts, and current reviewed engine/output field names already committed.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, unreviewed extraction output, hosted services, and any runtime network input MUST NOT be read by deterministic engine modules.
- **Source Layer Reads**: Existing output adapter contracts, deterministic outputs, engine input packets, approved BSRS recalculation sample configuration artifacts, and approved validation guidance already committed in the repository.
- **Source Layer Writes**: Validation evidence, structured warnings and errors, trace records, deterministic outputs, and existing output-adapter persistence rows only where current contracts already require them.
- **Traceability Required**: Every accepted recalculation classification and every warning/error finding must trace to source artifact path, block family, section marker, line-cluster evidence, rule version, producing module, finding code, and severity.

### Key Entities *(include if feature involves data)*

- **Recalculation Block Pattern**: Approved sample-derived structure describing recalculation block family, section sequence, line clusters, marker rows, and accepted formatting context.
- **Recalculation Section Sequence**: Ordered evidence that recalculation sections appear in approved relative order.
- **Recalculation Line Cluster**: A group of related rows that together represent approved recalculation detail, support, subtotal, narrative, or formatting context.
- **Recalculation Row Role**: Classification for a row as semantic marker, support, detail, subtotal, narrative, formatting, or spacer evidence.
- **Recalculation Pattern Finding**: Deterministic validation result with severity, finding code, source location, block family, section context, line-cluster evidence, and trace metadata.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of approved recalculation block sample evidence is classified as accepted or reported with deterministic structured findings for missing, duplicated, suspicious, orphaned, or out-of-order evidence.
- **SC-002**: 100% of approved recalculation rows are classified into semantic, support, detail, subtotal, narrative, formatting, or spacer roles without treating formatting-only rows as missing semantic evidence.
- **SC-003**: Repeated validation over identical approved recalculation sample artifacts produces byte-stable structured finding payloads and accepted classifications.
- **SC-004**: Existing bsrs_configuration_output behavior, current contracts, browser-only sql.js boundaries, and adapter scope remain unchanged outside the added validation and regression protection.

## Assumptions

- Approved BSRS recalculation sample configuration artifacts already committed in the repository are authoritative validation sources for this increment.
- This increment hardens backend validation and regression protection only; it does not add UI behavior, new output adapters, or new business-domain calculations.
- Existing browser-only Vite and sql.js constraints, deterministic reviewed-input boundaries, and static build delivery rules continue to apply.
- Existing BSRS statement block-pattern validation, semantic validation, field-reference validation, contracts, templates, and regression tests remain the baseline behavior to preserve.
