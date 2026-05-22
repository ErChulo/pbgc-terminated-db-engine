# Feature Specification: BSRS Optional-Form Pattern Hardening

**Feature Branch**: `015-bsrs-optional-form-pattern-hardening`

**Created**: 2026-05-22

**Status**: Draft

**Input**: User description: "Build a BSRS optional-form-pattern-hardening increment for the PBGC terminated defined-benefit engine. Scope only backend validation and regression protection for bsrs_configuration_output using the approved BSRS sample configuration artifacts already in the repository. Do not add new business domains or new output adapters. Focus on semantic validation of approved optional-form block patterns, expected optional-form section sequencing, optional-form-specific semantic-versus-formatting row distinction, structured findings, and repeated-run stability. Preserve existing contracts, browser-only sql.js boundaries, and existing slice behavior."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Validate approved optional-form block patterns (Priority: P1)

A reviewer needs the BSRS hardening checks to recognize approved optional-form block patterns in committed BSRS sample configuration artifacts and report structural regressions before existing BSRS output behavior changes.

**Why this priority**: Optional-form blocks are a focused backend validation surface for this increment and must remain stable without broadening the engine into new domains or adapters.

**Independent Test**: Can be fully tested by running optional-form-pattern validation against the approved optional-form BSRS sample artifacts and confirming that approved optional-form labels, form-family sections, and line clusters are accepted while malformed optional-form evidence emits deterministic structured findings.

**Acceptance Scenarios**:

1. **Given** approved optional-form BSRS sample configuration artifacts for single-life, single-and-joint, and QPSA/QDRO form families, **When** optional-form-pattern validation runs, **Then** each expected optional-form section, line cluster, and sequence relationship is classified as accepted or reported with a structured finding.
2. **Given** sample-derived optional-form evidence with a missing, duplicated, suspicious, orphaned, or out-of-order optional-form section, **When** validation runs, **Then** the engine emits deterministic structured findings with source artifact, block family, form family, section context, line-cluster evidence, rule version, and producing module.

---

### User Story 2 - Preserve optional-form-specific row semantics (Priority: P2)

A reviewer needs optional-form validation to distinguish semantic optional-form rows from formatting, spacer, narrative, subtotal, unavailable-benefit, and detail rows so approved presentation rows do not create false structural failures.

**Why this priority**: Approved BSRS optional-form samples include recurring labels, explanatory lines, unavailable-benefit rows, and formatting rows that support presentation but should not be mistaken for missing semantic optional-form evidence.

**Independent Test**: Can be tested by validating sample-derived optional-form rows that include formatting-only rows and semantic form rows, then confirming that each is classified in the expected semantic role.

**Acceptance Scenarios**:

1. **Given** approved optional-form sample rows with formatting, spacer, narrative, subtotal, unavailable-benefit, and detail content, **When** validation classifies row roles, **Then** formatting and presentation rows are not treated as missing optional-form sections.
2. **Given** an optional-form line cluster with an orphan semantic row and no approved section context, **When** validation runs, **Then** a structured finding identifies the orphan evidence without changing BSRS output generation.

---

### User Story 3 - Preserve deterministic behavior and existing slice boundaries (Priority: P3)

A reviewer needs optional-form-pattern validation to produce stable findings across repeated runs while preserving existing BSRS contracts, browser-only boundaries, and downstream output behavior.

**Why this priority**: Hardening value depends on repeatable evidence and no unrelated behavior changes in the existing stack.

**Independent Test**: Can be tested by running identical optional-form validation inputs repeatedly and comparing accepted classifications, structured findings, and existing BSRS output regression behavior.

**Acceptance Scenarios**:

1. **Given** identical approved optional-form BSRS sample artifacts, **When** validation runs repeatedly, **Then** accepted classifications and finding payloads are byte-stable.
2. **Given** optional-form-pattern validation is enabled, **When** existing BSRS output regression checks run, **Then** existing contract, output, persistence, trace, and adapter-exclusion behavior remains unchanged.

---

### Edge Cases

- Approved optional-form samples contain formatting-only rows, spacer rows, explanatory rows, or unavailable-benefit rows that resemble form-family boundaries.
- An optional-form section appears before its expected predecessor or appears more than once.
- A required optional-form line cluster is missing while surrounding formatting rows remain present.
- A form-family label uses approved wording variants across single-life, single-and-joint, and QPSA/QDRO samples.
- An optional-form detail row has no recognized optional-form section context.
- Repeated validation sees approved artifacts in a different enumeration order and must still produce stable ordered results.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST validate approved BSRS optional-form block patterns against approved BSRS sample configuration artifacts already committed in the repository.
- **FR-002**: System MUST validate expected optional-form section sequencing and report missing, duplicated, out-of-order, suspicious, or orphan optional-form evidence.
- **FR-003**: System MUST classify optional-form-specific row roles, including semantic markers, support rows, detail rows, unavailable-benefit rows, subtotals, narrative rows, formatting rows, and spacers.
- **FR-004**: System MUST avoid treating formatting-only, spacer, subtotal, unavailable-benefit, or narrative rows as missing optional-form semantic evidence.
- **FR-005**: System MUST emit deterministic structured warnings or errors for optional-form-pattern failures.
- **FR-006**: System MUST preserve traceability for every optional-form-pattern finding, including source artifact, block family, form family, section context, line cluster, rule version, producing module, severity, and finding code.
- **FR-007**: System MUST produce identical accepted classifications and structured finding payloads across repeated runs over the same approved optional-form sample artifacts.
- **FR-008**: System MUST preserve existing bsrs_configuration_output contracts, current successful output behavior, existing browser-only sql.js boundaries, and existing deterministic slice behavior.
- **FR-009**: System MUST NOT add new business domains, new output adapters, server calls, external persistence, raw OCR reads, raw source-document reads, or unreviewed-input reads.
- **FR-010**: System MUST limit any persistence or trace writes to existing contract-required validation evidence, deterministic outputs, warnings, errors, traces, and existing persistence rows; it MUST NOT imply new lower source-layer writes.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Approved BSRS optional-form sample configuration artifacts already committed in the repository, existing deterministic BSRS output fixtures, current BSRS contracts, and current reviewed engine/output field names already committed.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, unreviewed extraction output, hosted services, and any runtime network input MUST NOT be read by deterministic engine modules.
- **Source Layer Reads**: Existing output adapter contracts, deterministic outputs, engine input packets, approved BSRS optional-form sample configuration artifacts, and approved validation guidance already committed in the repository.
- **Source Layer Writes**: Validation evidence, structured warnings and errors, trace records, deterministic outputs, and existing output-adapter persistence rows only where current contracts already require them.
- **Traceability Required**: Every accepted optional-form classification and every warning/error finding must trace to source artifact path, block family, form family, section marker, line-cluster evidence, rule version, producing module, finding code, and severity.

### Key Entities *(include if feature involves data)*

- **Optional-Form Block Pattern**: Approved sample-derived structure describing optional-form block family, form family, section sequence, line clusters, marker rows, and accepted formatting context.
- **Optional-Form Family**: Approved grouping for single-life, single-and-joint, QPSA/QDRO, or other committed optional-form sample families without creating a new business domain.
- **Optional-Form Section Sequence**: Ordered evidence that optional-form sections appear in approved relative order.
- **Optional-Form Line Cluster**: A group of related rows that together represent approved optional-form detail, support, unavailable-benefit, subtotal, narrative, or formatting context.
- **Optional-Form Row Role**: Classification for a row as semantic marker, support, detail, unavailable-benefit, subtotal, narrative, formatting, or spacer evidence.
- **Optional-Form Pattern Finding**: Deterministic validation result with severity, finding code, source location, block family, form family, section context, line-cluster evidence, and trace metadata.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of approved optional-form block sample evidence is classified as accepted or reported with deterministic structured findings for missing, duplicated, suspicious, orphaned, or out-of-order evidence.
- **SC-002**: 100% of approved optional-form rows are classified into semantic, support, detail, unavailable-benefit, subtotal, narrative, formatting, or spacer roles without treating formatting-only rows as missing semantic evidence.
- **SC-003**: Repeated validation over identical approved optional-form sample artifacts produces byte-stable structured finding payloads and accepted classifications.
- **SC-004**: Existing bsrs_configuration_output behavior, current contracts, browser-only sql.js boundaries, and adapter scope remain unchanged outside the added validation and regression protection.

## Assumptions

- Approved BSRS optional-form sample configuration artifacts already committed in the repository are authoritative validation sources for this increment.
- This increment hardens backend validation and regression protection only; it does not add UI behavior, new output adapters, or new business-domain calculations.
- Existing browser-only Vite and sql.js constraints, deterministic reviewed-input boundaries, and static build delivery rules continue to apply.
- Existing BSRS statement, recalculation, semantic validation, field-reference validation, contracts, templates, and regression tests remain the baseline behavior to preserve.
