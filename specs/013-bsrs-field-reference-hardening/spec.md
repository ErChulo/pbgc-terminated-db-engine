# Feature Specification: BSRS Field Reference Hardening

**Feature Branch**: `[012-bsrs-field-reference-hardening]`

**Created**: 2026-05-20

**Status**: Draft

**Input**: User description: "Build a BSRS field-reference-hardening increment for the PBGC terminated defined-benefit engine. Scope only backend validation and regression protection for bsrs_configuration_output using the approved BSRS sample configuration artifacts already in the repository, DD.csv, and the current engine/output field names already committed. Do not add new business domains or new output adapters. Focus on semantic validation of referenced BSRS fields, DD-backed names where applicable, approved fallback behavior where no DD mapping exists, and detection of suspicious or orphan field references in approved BSRS samples. Preserve existing contracts, browser-only sql.js boundaries, and existing slice behavior."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Validate Referenced BSRS Fields (Priority: P1)

As a casework reviewer, I want BSRS configuration field references to be checked against approved field vocabularies so that misspelled, suspicious, or orphan references are caught before reviewed BSRS output behavior drifts.

**Why this priority**: Field references connect approved BSRS samples to existing deterministic output fields. A silent field-name drift can break statement behavior even when calculations remain unchanged.

**Independent Test**: Given the approved BSRS sample configuration artifacts, Data Dictionary mappings, and current committed engine/output field names, validation extracts field-like references and reports only unsupported or suspicious references as structured findings.

**Acceptance Scenarios**:

1. **Given** approved BSRS samples with field references that match current committed output semantics, **When** field-reference validation runs, **Then** the references are accepted without changing existing BSRS output behavior.
2. **Given** a BSRS sample reference whose semantic name has a matching Data Dictionary entry, **When** field-reference validation runs, **Then** the reference is validated through the Data Dictionary-backed name.
3. **Given** a BSRS sample reference that does not have a Data Dictionary entry but is already approved by the committed BSRS sample set, **When** field-reference validation runs, **Then** the reference remains valid as an approved fallback.

---

### User Story 2 - Detect Suspicious or Orphan References (Priority: P2)

As a reviewer, I want suspicious field-like tokens in approved BSRS samples to be surfaced as structured validation findings so that accidental typos, orphan names, or unsupported references cannot hide inside PrintCriteria or detail expressions.

**Why this priority**: Approved samples contain formulas, control tokens, literal text, and field references in the same cells. Without explicit classification, new mistakes can look like valid field names.

**Independent Test**: Given a sample expression containing an unknown field-like token that is not a literal, control token, function name, DD-backed field, current output field, or approved fallback, validation emits a deterministic structured error.

**Acceptance Scenarios**:

1. **Given** an unknown uppercase field-like token in PrintCriteria, **When** validation runs, **Then** the token is reported as a field-reference error with source path and row context.
2. **Given** quoted narrative text that contains words resembling fields, **When** validation runs, **Then** literal text is not reported as a field-reference error.
3. **Given** a documented control token or formatting marker, **When** validation runs, **Then** it is classified as non-field control semantics rather than an orphan field.

---

### User Story 3 - Preserve Existing BSRS Behavior and Scope (Priority: P3)

As a PBGC engine maintainer, I want field-reference hardening to protect existing BSRS behavior without expanding adapter scope so that this increment remains a validation-only change.

**Why this priority**: The feature is hardening only. It must not introduce new business domains, adapters, persistence tables, or output behavior changes.

**Independent Test**: Existing successful BSRS configuration output scenarios produce the same output shape and adapter behavior after field-reference validation is added.

**Acceptance Scenarios**:

1. **Given** existing successful BSRS output fixtures, **When** validation is present, **Then** successful output packet content and adapter writes remain unchanged.
2. **Given** the field-reference validation run is repeated over the same approved artifacts, **When** findings are compared, **Then** structured finding payloads and ordering remain stable.
3. **Given** the hardening slice is inspected for scope, **When** validation completes, **Then** no new business domain or output adapter has been introduced.

### Edge Cases

- A token may appear in quoted narrative text and must not be treated as a field reference.
- A token may be a Statement Authoring function, logical operator, numeric value, date literal, formatting marker, or control keyword rather than a field.
- A field may be valid because it is DD-backed even if its sample spelling differs in case from the canonical field name.
- A field may be valid because it is approved in the BSRS sample set even when no DD.csv mapping exists.
- A field-like token may be suspicious because it appears only once, is not DD-backed, and is not present in current committed engine/output field names.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST extract field-like references from approved BSRS sample configuration expressions and rows.
- **FR-002**: System MUST validate extracted field references against current committed engine/output field names.
- **FR-003**: System MUST use DD.csv as the canonical naming layer when a referenced BSRS field has a matching Data Dictionary entry.
- **FR-004**: System MUST preserve approved fallback behavior for referenced BSRS fields that have no matching DD.csv entry but are present in approved BSRS samples.
- **FR-005**: System MUST distinguish field references from quoted narrative text, numeric literals, date literals, functions, operators, control tokens, and formatting markers.
- **FR-006**: System MUST emit deterministic structured errors for suspicious or orphan field references that are not DD-backed, not current committed field names, not documented controls, and not approved sample fallbacks.
- **FR-007**: System MUST include source path, row or block reference, column name, token, semantic category, rule version, producing module, and warning/error code for each field-reference finding.
- **FR-008**: System MUST preserve existing successful `bsrs_configuration_output` packet content, persistence behavior, trace behavior, and output adapter scope.
- **FR-009**: System MUST NOT add new business domains, new output adapters, server calls, external persistence, or raw source-document reads.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Approved BSRS sample configuration artifacts, DD.csv mappings, current committed engine/output field names, documented control tokens, and existing deterministic BSRS output fixtures.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, and unreviewed extraction output MUST NOT be read by deterministic engine modules.
- **Source Layer Reads**: approved BSRS sample configuration artifacts, Data Dictionary mappings, current deterministic output field names, existing engine input packets, existing deterministic outputs, and existing output adapter contracts.
- **Source Layer Writes**: semantic validation evidence, structured warnings, structured errors, regression test results, and existing BSRS trace or output rows only where current contracts already require them.
- **Traceability Required**: validation source path, row or block reference, column name, referenced token, vocabulary source, DD-backed status, approved fallback status, rule version, producing module, warning/error code, and affected BSRS semantic category.

### Key Entities *(include if feature involves data)*

- **BSRS Field Reference**: A field-like token extracted from approved BSRS sample configuration rows or expressions.
- **Field Vocabulary Entry**: A known field name from DD.csv, current committed engine/output field names, documented controls, or approved sample fallback semantics.
- **Approved Fallback Field**: A referenced BSRS field that has no matching DD.csv entry but is valid because it appears in approved BSRS sample semantics.
- **Suspicious Field Reference**: A field-like token that is not recognized as DD-backed, current committed, documented control, literal, function, operator, or approved fallback.
- **Field Reference Finding**: A deterministic structured warning or error linking a suspicious or orphan reference to its source path, row, column, token, and validation rule.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of field-like tokens extracted from approved BSRS sample configuration artifacts are classified as recognized fields, approved fallbacks, documented non-field tokens, or structured findings.
- **SC-002**: 100% of referenced fields with matching DD.csv entries are validated using the Data Dictionary-backed name.
- **SC-003**: 100% of approved no-DD fallback fields in the committed BSRS sample set remain valid.
- **SC-004**: Repeated validation over the same approved artifacts produces identical structured field-reference finding payloads and ordering.
- **SC-005**: Existing successful `bsrs_configuration_output` scenarios retain unchanged output packet content, persistence behavior, trace behavior, and adapter scope.

## Assumptions

- The committed BSRS sample configuration artifacts are authoritative for approved sample fallback behavior in this increment.
- DD.csv remains the canonical naming layer wherever a matching Data Dictionary field exists.
- Current committed engine/output field names define the known deterministic field vocabulary outside DD-backed names and approved BSRS fallbacks.
- This increment provides backend validation and regression protection only; it does not introduce a user-facing editor, new output deliverable, new adapter, or new business domain.
- Existing browser-only sql.js persistence and static delivery rules remain unchanged.
