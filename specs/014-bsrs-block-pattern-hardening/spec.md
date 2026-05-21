# Feature Specification: BSRS Block Pattern Hardening

**Feature Branch**: `013-bsrs-block-pattern-hardening`

**Created**: 2026-05-20

**Status**: Draft

**Input**: User description: "Build a BSRS block-pattern-hardening increment for the PBGC terminated defined-benefit engine. Scope only backend validation and regression protection for bsrs_configuration_output using the approved BSRS sample configuration artifacts already in the repository. Do not add new business domains or new output adapters. Focus on semantic validation of approved statement block patterns, approved recalculation block patterns, approved optional-form block patterns, and expected section sequencing and line-cluster behavior in BSRS samples. Preserve existing contracts, browser-only sql.js boundaries, and existing slice behavior."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Validate approved statement block patterns (Priority: P1)

A reviewer needs the BSRS configuration hardening checks to recognize the approved statement block patterns in repository-approved BSRS samples and flag structural regressions before output behavior changes.

**Why this priority**: Statement blocks are the core BSRS deliverable structure; regressions in their section sequence or line clusters can make an otherwise deterministic output unusable.

**Independent Test**: Can be fully tested by running the BSRS block-pattern validation against the approved BSRS sample configuration artifacts and confirming that expected statement sections and line clusters are accepted while malformed statement block evidence produces deterministic structured findings.

**Acceptance Scenarios**:

1. **Given** approved BSRS sample configuration artifacts with expected statement block sections, **When** block-pattern validation runs, **Then** each required statement section, line cluster, and sequence relationship is classified as accepted or reported with a structured finding.
2. **Given** a sample-derived statement block with a missing or out-of-order required section marker, **When** validation runs, **Then** the engine emits a deterministic structured warning or error that identifies the source artifact, block family, section marker, line cluster, and rule version.

---

### User Story 2 - Validate approved recalculation block patterns (Priority: P2)

A reviewer needs recalculation-oriented BSRS sample blocks to be validated against approved participant-data and recalculation-support patterns without changing existing BSRS output generation.

**Why this priority**: Recalculation blocks support PBGC casework review and must retain stable structure across hardening increments.

**Independent Test**: Can be tested by validating approved recalculation sample blocks and a malformed recalculation fixture, then comparing the accepted blocks and structured findings across repeated runs.

**Acceptance Scenarios**:

1. **Given** approved BSRS samples containing recalculation block patterns, **When** validation runs, **Then** required recalculation sections, line clusters, and sequencing rules are recognized and traced.
2. **Given** a recalculation block with a missing required cluster or unexpected section transition, **When** validation runs, **Then** the finding payload is stable across repeated runs and no unrelated output adapter is written.

---

### User Story 3 - Validate approved optional-form block patterns (Priority: P3)

A reviewer needs optional-form BSRS blocks to be checked for approved line-cluster behavior across form families while preserving approved fallback behavior already established for BSRS validation.

**Why this priority**: Optional-form blocks have recurring families and labels that are easy to regress when statement and recalculation validations evolve.

**Independent Test**: Can be tested by validating approved optional-form block samples for single-life, joint-and-survivor, QPSA, QDRO, and related approved form clusters, then confirming deterministic findings for missing or suspicious optional-form markers.

**Acceptance Scenarios**:

1. **Given** approved BSRS samples with optional-form block patterns, **When** validation runs, **Then** expected form-family labels, section sequence, and line clusters are recognized without requiring a new business domain.
2. **Given** an optional-form block with a suspicious label or orphan line cluster, **When** validation runs, **Then** a structured finding identifies the artifact, form family, section context, line cluster, and approved fallback status.

---

### Edge Cases

- Approved samples contain formatting or spacer rows that resemble block boundaries but are not semantic block markers.
- A block family is present but has a missing, duplicated, or out-of-order section marker.
- A line cluster spans adjacent rows that include blank, subtotal, explanatory, or formatting-only rows.
- Optional-form blocks include approved form-family naming variants that do not map to a new business domain.
- Repeated validation sees the same approved artifacts in a different filesystem enumeration order and must produce identical ordered findings.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST validate approved BSRS statement block patterns against the approved BSRS sample configuration artifacts already in the repository.
- **FR-002**: System MUST validate approved BSRS recalculation block patterns against required section sequencing and recalculation-support line clusters present in approved samples.
- **FR-003**: System MUST validate approved BSRS optional-form block patterns, including approved form-family labels, expected section sequencing, and expected line-cluster behavior.
- **FR-004**: System MUST distinguish semantic block markers and section sequence evidence from formatting-only, spacer, narrative, subtotal, or detail rows.
- **FR-005**: System MUST emit deterministic structured warnings or errors for missing, duplicated, suspicious, orphaned, or out-of-order block pattern evidence.
- **FR-006**: System MUST preserve traceability for every block-pattern finding, including source artifact, block family, section context, line cluster, rule version, producing module, severity, and finding code.
- **FR-007**: System MUST produce identical accepted classifications and structured finding payloads across repeated runs over the same approved BSRS sample artifacts.
- **FR-008**: System MUST preserve existing bsrs_configuration_output contracts, current successful output behavior, existing browser-only sql.js boundaries, and existing deterministic slice behavior.
- **FR-009**: System MUST NOT add new business domains, new output adapters, server calls, external persistence, raw OCR reads, raw source-document reads, or unreviewed-input reads.
- **FR-010**: System MUST limit any persistence or trace writes to existing contract-required validation evidence, deterministic outputs, warnings, errors, traces, and existing persistence rows; it MUST NOT imply new lower source-layer writes.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Approved BSRS sample configuration artifacts already committed in the repository, existing deterministic BSRS output fixtures, current BSRS contracts, and current reviewed engine/output field names already committed.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, unreviewed extraction output, hosted services, and any runtime network input MUST NOT be read by deterministic engine modules.
- **Source Layer Reads**: Existing output adapter contracts, deterministic outputs, engine input packets, approved BSRS sample configuration artifacts, and approved validation guidance already committed in the repository.
- **Source Layer Writes**: Validation evidence, structured warnings and errors, trace records, deterministic outputs, and existing output-adapter persistence rows only where current contracts already require them.
- **Traceability Required**: Every accepted block classification and every warning/error finding must trace to source artifact path, block family, section marker, line-cluster evidence, rule version, producing module, finding code, and severity.

### Key Entities *(include if feature involves data)*

- **BSRS Block Pattern**: Approved sample-derived structure describing a block family, section sequence, line clusters, marker rows, and accepted formatting context.
- **Statement Block Pattern**: A BSRS block pattern for approved participant statement sections and related line clusters.
- **Recalculation Block Pattern**: A BSRS block pattern for approved recalculation sections, participant-data support rows, and recalculation line clusters.
- **Optional-Form Block Pattern**: A BSRS block pattern for approved optional-form families, labels, section contexts, and related line clusters.
- **Section Sequence**: Ordered evidence that a block's sections appear in the approved relative order for that block family.
- **Line Cluster**: A group of related rows that together represent an approved BSRS block detail, support item, optional-form item, subtotal, or explanatory cluster.
- **Block Pattern Finding**: Deterministic validation result with severity, finding code, source location, block family, section context, line-cluster evidence, and trace metadata.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of approved statement block samples are classified as accepted or reported with deterministic structured findings for missing, duplicated, suspicious, orphaned, or out-of-order evidence.
- **SC-002**: 100% of approved recalculation block samples are validated for required section sequence and line-cluster behavior without changing existing successful BSRS output generation.
- **SC-003**: 100% of approved optional-form block families present in the approved samples are validated for expected labels, section context, and line-cluster behavior.
- **SC-004**: Repeated validation over identical approved BSRS sample artifacts produces byte-stable structured finding payloads and accepted classifications.
- **SC-005**: Existing bsrs_configuration_output behavior, current contracts, browser-only sql.js boundaries, and adapter scope remain unchanged outside the added validation and regression protection.

## Assumptions

- Approved BSRS sample configuration artifacts already committed in the repository are authoritative validation sources for this increment.
- This increment hardens backend validation and regression protection only; it does not add UI behavior, new output adapters, or new business-domain calculations.
- Existing browser-only Vite and sql.js constraints, deterministic reviewed-input boundaries, and static build delivery rules continue to apply.
- Existing BSRS semantic validation, field-reference validation, contracts, templates, and regression tests remain the baseline behavior to preserve.
