# Feature Specification: Cross-Slice Value Reconciliation Hardening

**Feature Branch**: `017-cross-slice-value-reconciliation-hardening`

**Created**: 2026-05-23

**Status**: Draft

**Input**: User description: "Build a cross-slice value-reconciliation-hardening increment for the PBGC terminated defined-benefit engine. Scope only backend validation and regression protection across already implemented slices, using the approved sample artifacts and current committed outputs already in the repository. Do not add new business domains or new output adapters. Focus on richer value-level reconciliation where the same participant, form, identifier, nullable-versus-required fact, and selected shared output values should numerically or categorically agree across bsrs_configuration_output, v1_ve_output, valuation_listings_output, and existing DD-backed mappings. Include severity-based mismatch classification and basis metadata. Preserve existing contracts, browser-only sql.js boundaries, and existing slice behavior."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reconcile Shared Values Across Outputs (Priority: P1)

A reviewer needs backend validation that compares selected shared output values across current BSRS configuration, V1/VE, and valuation listing evidence so participant facts, identifiers, forms, and selected output values agree when they represent the same reviewed case fact.

**Why this priority**: The existing cross-slice reconciliation foundation catches baseline drift. The next highest-value hardening increment is richer value-level agreement for facts that should match numerically or categorically across already implemented outputs.

**Independent Test**: Can be fully tested by running value reconciliation against committed output evidence and approved sample artifacts, then confirming that selected matching values pass while sample-derived mismatches emit deterministic structured findings with severity and basis metadata.

**Acceptance Scenarios**:

1. **Given** current committed BSRS, V1/VE, and valuation-listing evidence for the same reviewed participant, **When** value reconciliation runs, **Then** selected shared participant, identifier, form, nullable, and output-value facts are accepted when their normalized values agree.
2. **Given** sample-derived evidence where a selected shared output value differs numerically or categorically across slices, **When** value reconciliation runs, **Then** the system emits a structured mismatch finding with severity, compared values, compared slices, field names, DD or fallback basis, and reviewed fact context.

---

### User Story 2 - Classify Required, Nullable, and Unsupported Differences (Priority: P2)

A reviewer needs mismatch findings to distinguish blocking mismatches from accepted nullable, optional, unsupported, or formatting-only differences so validation noise does not obscure true cross-slice defects.

**Why this priority**: Value reconciliation is useful only if it respects existing output contract boundaries and avoids treating approved nulls or unsupported branches as factual drift.

**Independent Test**: Can be tested by reconciling selected required and nullable facts across committed outputs, then confirming each mismatch receives the expected severity and basis classification.

**Acceptance Scenarios**:

1. **Given** a selected fact is required by the current contracts in more than one output slice, **When** one slice emits a different value, **Then** the finding is classified at the configured blocking severity.
2. **Given** a selected fact is nullable, optional, unsupported, or formatting-only under current contracts, **When** reconciliation encounters a null or approved formatting difference, **Then** the comparison is recorded as non-blocking with explicit basis metadata.

---

### User Story 3 - Preserve Existing Slice Behavior and Stability (Priority: P3)

A reviewer needs value-reconciliation hardening to produce stable evidence across repeated runs while preserving current output shapes, contracts, browser-only boundaries, and successful slice behavior.

**Why this priority**: The increment is regression protection over existing outputs, not a new calculation domain. Repeatable findings and unchanged output behavior are required for reliable casework review.

**Independent Test**: Can be tested by running identical approved artifacts and committed output evidence repeatedly, then comparing accepted value comparisons, findings, warnings, errors, and existing output regression behavior.

**Acceptance Scenarios**:

1. **Given** identical approved samples and committed output evidence, **When** value reconciliation runs repeatedly, **Then** accepted comparisons and mismatch findings are byte-stable.
2. **Given** value reconciliation is present, **When** existing BSRS, V1/VE, and valuation-listing regression checks run, **Then** existing contract, output, persistence, trace, and adapter-exclusion behavior remains unchanged.

---

### Edge Cases

- A selected value is numerically equivalent but represented with different formatting across slices.
- A selected categorical value uses an approved label or code variant in one slice.
- A nullable fact is intentionally null in one slice but required in another.
- A selected DD-backed value exists in V1/VE and valuation listings but BSRS uses an approved fallback field name.
- A selected output value appears in one committed output fixture and is intentionally absent from another.
- Repeated validation receives evidence in a different enumeration order and must still produce stable ordered findings.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST validate selected shared output values across existing `bsrs_configuration_output`, `v1_ve_output`, and `valuation_listings_output` evidence already committed in the repository.
- **FR-002**: System MUST compare selected participant, form, identifier, nullable-versus-required, categorical, and numeric facts only where current contracts or approved samples establish shared reviewed meaning. The initial MVP inventory MUST include at least one participant identifier value, one form value, one nullable-versus-required value, one numeric value, and one categorical value.
- **FR-003**: System MUST use `artifacts/mappings/DD.csv` as the canonical naming layer wherever a matching Data Dictionary field exists.
- **FR-004**: System MUST preserve approved contract-name fallback behavior when a reconciled field has no matching DD.csv entry.
- **FR-005**: System MUST classify value mismatches by severity, including at least blocking mismatch, non-blocking warning, accepted optional or nullable difference, unsupported branch, and formatting-only categories.
- **FR-006**: System MUST include basis metadata for every accepted comparison and mismatch finding, including comparison type, required-or-nullable basis, DD mapping or fallback basis, normalization basis, source artifacts, reviewed fact context, rule version, producing module, severity, and finding code.
- **FR-007**: System MUST distinguish true value drift from approved numeric formatting, categorical formatting, explicit nulls, absent optional evidence, unsupported-branch warnings, and existing output contract exceptions.
- **FR-008**: System MUST produce deterministic structured findings for value-level reconciliation failures.
- **FR-009**: System MUST produce identical accepted value comparison records and structured finding payloads across repeated runs over the same approved sample artifacts and committed output evidence.
- **FR-010**: System MUST preserve existing output contracts, current successful output behavior, browser-only sql.js boundaries, trace behavior, persistence behavior, and existing deterministic slice behavior.
- **FR-011**: System MUST NOT add new business domains, new output adapters, new persistence tables, server calls, external persistence, raw OCR reads, raw source-document reads, or unreviewed-input reads.
- **FR-012**: System MUST limit any writes to existing contract-required validation evidence, deterministic outputs, warnings, errors, traces, and existing persistence rows; it MUST NOT imply new lower source-layer writes.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Approved sample artifacts already committed in the repository, current committed output fixtures, existing DD.csv mappings, current module contracts, current reviewed engine/output field names, and existing regression evidence for BSRS configuration, V1/VE, valuation listings, and cross-slice reconciliation.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, unreviewed extraction output, hosted services, runtime network input, and uncommitted external workbooks or documents MUST NOT be read by deterministic engine modules.
- **Source Layer Reads**: Existing deterministic outputs, output adapter contracts, engine input packets where already required by current tests, approved sample artifacts, DD.csv mappings, approved validation guidance, and existing cross-slice reconciliation evidence already committed in the repository.
- **Source Layer Writes**: Validation evidence, structured warnings and errors, trace records, deterministic outputs, and existing output-adapter persistence rows only where current contracts already require them.
- **Traceability Required**: Every accepted value comparison and every warning/error finding must trace to compared slice names, field names, compared values, value type, required-or-nullable basis, DD mapping or fallback basis, source artifact path, reviewed fact context, rule version, producing module, finding code, and severity.

### Key Entities *(include if feature involves data)*

- **Value Reconciliation Rule**: Reviewed comparison definition for a selected shared value, including value type, expected slices, field names, required-or-nullable basis, normalization basis, and severity policy.
- **Value Comparison Record**: Deterministic record linking equivalent selected values across output slices, including compared values, normalized values, basis metadata, and comparison status.
- **Severity Classification**: Structured category that distinguishes blocking mismatch, non-blocking warning, accepted optional or nullable difference, unsupported branch, and formatting-only difference.
- **Basis Metadata**: Traceable explanation for why a value was compared, normalized, accepted, warned, or blocked, including DD mapping or approved fallback basis.
- **Value Reconciliation Finding**: Structured warning or error describing a numeric or categorical mismatch, missing required counterpart, mapping failure, unsupported comparison, or accepted non-drift case with trace metadata.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of selected shared value rules are either accepted as matching, classified as accepted non-drift, or reported with deterministic structured findings.
- **SC-002**: 100% of reconciled V1/VE fields with matching DD.csv entries use DD-backed canonical semantics before value comparison.
- **SC-003**: 100% of approved no-DD fallback comparisons record the fallback basis and do not silently invent alternate semantic names.
- **SC-004**: 100% of mismatch findings include severity and basis metadata sufficient to identify compared slices, fields, values, value type, normalization basis, source artifact, reviewed fact context, rule version, and producing module.
- **SC-005**: Repeated validation over identical approved artifacts and committed output evidence produces byte-stable accepted comparison records and structured finding payloads.
- **SC-006**: Existing BSRS configuration, V1/VE, valuation-listing, benefit-kernel, form-resolution, persistence, trace, browser-only, and adapter-exclusion behavior remains unchanged outside the added validation and regression protection.

## Assumptions

- Approved sample artifacts and current committed output fixtures are authoritative validation sources for this hardening increment.
- The existing cross-slice reconciliation foundation remains the baseline for shared fact selection and drift evidence.
- This increment adds backend validation and regression protection only; it does not add UI behavior, new output adapters, or new business-domain calculations.
- DD.csv remains the canonical naming layer for V1 field semantics wherever a matching Data Dictionary field exists.
- Existing browser-only Vite and sql.js constraints, deterministic reviewed-input boundaries, static build delivery rules, and current module contracts continue to apply.
- Existing slice tests for BSRS configuration, V1/VE output, valuation listings, form resolution, benefit kernel, traceability, persistence, adapter exclusion, and hardening behavior remain the baseline behavior to preserve.
