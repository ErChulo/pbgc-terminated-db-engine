# Feature Specification: BSRS Semantic Hardening

**Feature Branch**: `[012-bsrs-semantic-hardening]`

**Created**: 2026-05-19

**Status**: Draft

**Input**: User description: "Build a BSRS semantic-hardening increment for the PBGC terminated defined-benefit engine. Scope only backend validation and regression protection for bsrs_configuration_output using the approved BSRS sample configuration artifacts already in the repository and the Statement Authoring function list. Do not add new business domains or new output adapters. Focus on semantic validation of PrintCriteria, referenced functions, referenced fields, line/section structure, and approved statement/recalculation block patterns. Preserve existing contracts, browser-only sql.js boundaries, and existing slice behavior."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Validate Statement Authoring Semantics (Priority: P1)

As a casework reviewer, I want BSRS configuration samples to be checked against the approved Statement Authoring rules so that invalid functions, malformed PrintCriteria expressions, or unsupported references are caught before BSRS output behavior drifts.

**Why this priority**: Function and PrintCriteria semantics are the highest-risk source of BSRS configuration defects because they control conditional statement output and recalculation paths.

**Independent Test**: Given the committed BSRS configuration samples and the approved Statement Authoring function list, validation identifies every referenced function and confirms no unsupported function or malformed PrintCriteria expression is accepted.

**Acceptance Scenarios**:

1. **Given** an approved BSRS configuration sample with Statement Authoring expressions, **When** semantic validation runs, **Then** every referenced function is found in the approved function list.
2. **Given** a BSRS PrintCriteria expression with an unsupported function reference, **When** semantic validation runs, **Then** the validation reports a structured error and does not treat the sample as approved.
3. **Given** a BSRS PrintCriteria expression with nested conditions, quoted text, and field comparisons, **When** semantic validation runs, **Then** the expression is checked without changing the existing BSRS output contract.

---

### User Story 2 - Protect Referenced Field Semantics (Priority: P2)

As a reviewer, I want referenced BSRS fields to be validated against approved configuration samples and existing BSRS/V1 field semantics so that sample-driven backend checks can catch unknown or misspelled field references.

**Why this priority**: Referenced fields bridge BSRS configuration, V1-style field names, and existing output rows. Unknown names can silently break downstream statement behavior if they are not detected.

**Independent Test**: Given the approved BSRS base data, statement, recalculation, and optional-form samples, validation extracts field references and confirms they are either known approved sample fields, existing BSRS/V1 fields, or documented literal/control tokens.

**Acceptance Scenarios**:

1. **Given** an approved BSRS sample that references V1-style participant fields, **When** field validation runs, **Then** the references are recognized as approved backend validation fields.
2. **Given** a sample row with an unknown field-like token in PrintCriteria or detail expressions, **When** validation runs, **Then** the validation reports the token as an error.
3. **Given** a field that has no matching Data Dictionary entry but is approved by the BSRS configuration sample set, **When** validation runs, **Then** the field remains valid under the approved sample semantics.

---

### User Story 3 - Preserve Approved BSRS Block Structure (Priority: P3)

As a reviewer, I want approved statement and recalculation block patterns to remain stable so that changes to BSRS configuration handling do not alter expected line, section, and formatting structure.

**Why this priority**: Statement and recalculation sections are reviewed as structured deliverable patterns. Shape regressions can be missed if only individual field names are checked.

**Independent Test**: Given the approved BSRS statement, recalculation, base-data, and optional-form samples, validation confirms expected headers, row families, line/section markers, formatting codes, and approved block patterns are present and stable.

**Acceptance Scenarios**:

1. **Given** the approved statement sample, **When** block-pattern validation runs, **Then** required statement sections and line/section markers are present.
2. **Given** the approved recalculation sample, **When** block-pattern validation runs, **Then** required participant data and recalculation-support rows are present.
3. **Given** approved optional-form samples, **When** validation runs, **Then** expected option labels, detail columns, and formatting patterns remain stable.

### Edge Cases

- A PrintCriteria cell may be a literal control value, an empty cell, or a quoted expression.
- A sample may contain quoted text that includes words resembling field names or functions but should not be treated as references.
- Some approved samples may use a historical header spelling while still representing an approved structure.
- A field-like token may be valid because it appears in approved sample configuration even when it has no Data Dictionary mapping.
- A recalculation or statement row may intentionally contain blank line fields while still requiring a stable row shape.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST validate every Statement Authoring function reference in approved BSRS configuration samples against `artifacts/guidance/bsrs/statement-authoring/BSRS functions.txt`.
- **FR-002**: System MUST reject unsupported Statement Authoring function references with structured validation errors.
- **FR-003**: System MUST validate PrintCriteria expressions for balanced quoted text, supported function references, and recognizable field/control tokens.
- **FR-004**: System MUST validate field references in approved BSRS sample configuration rows against approved sample fields, existing BSRS/V1 field semantics, or documented control tokens.
- **FR-005**: System MUST preserve approved contract-name behavior for BSRS fields that have no matching Data Dictionary entry but are present in approved samples.
- **FR-006**: System MUST validate approved BSRS statement sample block patterns, including required section headers, row families, line/section markers, and format codes.
- **FR-007**: System MUST validate approved BSRS recalculation sample block patterns, including required participant-data and recalculation-support rows.
- **FR-008**: System MUST validate approved optional-form sample patterns for single-life, single-and-joint, and QPSA/QDRO form families.
- **FR-009**: System MUST emit deterministic, structured warnings or errors for semantic validation failures without changing successful `bsrs_configuration_output` behavior.
- **FR-010**: System MUST preserve existing BSRS contracts, existing browser-only persistence boundaries, and existing output adapter behavior.
- **FR-011**: System MUST NOT add new business domains, new output adapters, server calls, external persistence, or raw source-document reads.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Approved BSRS sample configuration artifacts, the approved Statement Authoring function list, existing BSRS/V1 output semantics, existing Data Dictionary mappings where available, and existing deterministic BSRS output fixtures.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, and unreviewed extraction output MUST NOT be read by deterministic engine modules.
- **Source Layer Reads**: approved BSRS guidance artifacts, approved BSRS sample configuration artifacts, Data Dictionary mappings, existing deterministic outputs, engine input packets, and existing output adapter contracts.
- **Source Layer Writes**: semantic validation evidence, structured warnings, structured errors, regression test results, and existing BSRS trace or output rows only where current contracts already require them.
- **Traceability Required**: validation source path, row or block reference, referenced function, referenced field, rule version, producing module, warning/error code, and affected BSRS semantic category.

### Key Entities *(include if feature involves data)*

- **BSRS Semantic Validation Source**: Approved configuration or guidance artifact used as the source of truth for semantic validation.
- **Statement Authoring Function Reference**: A function token referenced by BSRS configuration expressions and checked against the approved function set.
- **BSRS Field Reference**: A field-like token referenced by PrintCriteria, detail, base-data, statement, recalculation, or optional-form rows.
- **BSRS Block Pattern**: A reviewed statement, recalculation, base-data, or optional-form row family whose structure must remain stable.
- **Semantic Validation Finding**: Structured warning or error identifying the source, row or block, semantic category, and failed invariant.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of function references in approved BSRS sample configurations are either accepted from the approved function list or reported as structured validation errors.
- **SC-002**: 100% of approved BSRS sample files produce deterministic semantic validation results across repeated runs.
- **SC-003**: 100% of approved statement and recalculation samples pass required block-pattern checks for committed fixtures.
- **SC-004**: 100% of approved optional-form sample families pass required row-family and formatting checks for committed fixtures.
- **SC-005**: No semantic-hardening validation run changes existing successful `bsrs_configuration_output` packet content, persistence behavior, or output adapter scope.

## Assumptions

- The committed BSRS sample configuration artifacts and Statement Authoring function list are authoritative for this increment.
- Existing BSRS/V1 field semantics and Data Dictionary mappings remain the reference vocabulary for known output fields.
- This increment provides backend validation and regression protection only; it does not introduce a user-facing editor or new output deliverable.
- Existing browser-only sql.js persistence and static delivery rules remain unchanged.
