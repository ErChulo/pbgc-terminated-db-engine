# Feature Specification: Cross-Slice Reconciliation Hardening

**Feature Branch**: `016-cross-slice-reconciliation-hardening`

**Created**: 2026-05-22

**Status**: Draft

**Input**: User description: "Build a cross-slice reconciliation-hardening increment for the PBGC terminated defined-benefit engine. Scope only backend validation and regression protection across already implemented slices, using the approved sample artifacts and current committed outputs already in the repository. Do not add new business domains or new output adapters. Focus on detecting cross-slice drift where the same case facts should agree across bsrs_configuration_output, v1_ve_output, valuation_listings_output, and existing DD-backed field mappings, forms, and identifiers. Preserve existing contracts, browser-only sql.js boundaries, and existing slice behavior."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Detect shared fact drift across outputs (Priority: P1)

A reviewer needs backend reconciliation checks that compare shared case facts across current BSRS configuration, V1/VE, and valuation listing outputs so mismatched identifiers, forms, or DD-backed field semantics are caught before a deterministic output set is treated as consistent.

**Why this priority**: Cross-slice drift can make individually passing output adapters disagree about the same reviewed participant or plan fact. This is the core risk addressed by this hardening increment.

**Independent Test**: Can be fully tested by running reconciliation validation against current committed output fixtures and approved sample artifacts, then confirming that matching shared facts pass and sample-derived mismatches emit deterministic structured findings.

**Acceptance Scenarios**:

1. **Given** current committed outputs for BSRS configuration, V1/VE, and valuation listings that reference the same reviewed case facts, **When** reconciliation validation runs, **Then** shared identifiers, form references, and DD-backed field semantics are reported as consistent.
2. **Given** sample-derived output evidence where a shared participant identifier, form reference, or DD-backed field value differs across slices, **When** reconciliation validation runs, **Then** the engine emits a deterministic structured finding that identifies each affected slice, field mapping, source artifact, and reviewed fact context.

---

### User Story 2 - Preserve approved fallback behavior and mapping boundaries (Priority: P2)

A reviewer needs reconciliation checks to respect existing DD-backed naming rules and approved fallback behavior so the validator flags true drift without inventing new field semantics.

**Why this priority**: The engine already treats DD.csv as canonical wherever a matching Data Dictionary field exists. Cross-slice validation must reinforce that invariant without rewriting field names or adding adapter-specific semantics.

**Independent Test**: Can be tested by reconciling DD-backed fields and approved no-DD fallback fields across committed outputs, then confirming DD-backed facts map through DD.csv while approved fallback names remain accepted when no DD entry exists.

**Acceptance Scenarios**:

1. **Given** a shared V1/VE field with a matching DD.csv entry, **When** reconciliation validation compares it to equivalent BSRS or valuation-listing evidence, **Then** the comparison uses the DD-backed canonical semantic name.
2. **Given** an approved BSRS or output field with no matching DD.csv entry, **When** reconciliation validation runs, **Then** the field can use the approved contract-name fallback and the fallback is traceable rather than silent.

---

### User Story 3 - Preserve deterministic behavior and existing slice boundaries (Priority: P3)

A reviewer needs reconciliation validation to produce stable findings across repeated runs while preserving existing output contracts, browser-only boundaries, and successful slice behavior.

**Why this priority**: Hardening value depends on repeatable evidence and no unrelated changes to already implemented modules.

**Independent Test**: Can be tested by running identical reconciliation inputs repeatedly and comparing structured findings, warnings, errors, and existing output regression behavior.

**Acceptance Scenarios**:

1. **Given** identical approved sample artifacts and committed output fixtures, **When** reconciliation validation runs repeatedly, **Then** accepted comparisons and structured finding payloads are byte-stable.
2. **Given** reconciliation validation is enabled, **When** existing BSRS, V1/VE, and valuation-listing regression checks run, **Then** existing contract, output, persistence, trace, and adapter-exclusion behavior remains unchanged.

---

### Edge Cases

- A field exists in V1/VE and DD.csv but the corresponding BSRS or valuation listing evidence uses an approved contract-name fallback.
- A participant identifier appears in one output slice but is intentionally absent from another committed output fixture.
- A form code or form label appears with approved formatting differences across output slices.
- A current output fixture has an explicit null or unsupported-branch warning that should not be reconciled as a factual mismatch.
- Repeated validation receives approved artifacts or committed output rows in a different enumeration order and must still produce stable ordered findings.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST validate cross-slice agreement for shared case facts across existing `bsrs_configuration_output`, `v1_ve_output`, and `valuation_listings_output` evidence already committed in the repository.
- **FR-002**: System MUST detect drift for shared participant identifiers, plan or case identifiers, form references, and DD-backed field semantics where those facts are represented in more than one implemented output slice.
- **FR-003**: System MUST use `artifacts/mappings/DD.csv` as the canonical naming layer wherever a matching Data Dictionary field exists.
- **FR-004**: System MUST preserve approved contract-name fallback behavior when a reconciled field has no matching DD.csv entry.
- **FR-005**: System MUST emit deterministic structured warnings or errors for cross-slice reconciliation failures.
- **FR-006**: System MUST preserve traceability for every reconciliation finding, including compared slices, compared fields, DD mapping or fallback basis, source artifacts, reviewed fact context, rule version, producing module, severity, and finding code.
- **FR-007**: System MUST distinguish true cross-slice drift from explicit nulls, unsupported-branch warnings, absent optional evidence, or formatting-only differences already accepted by existing output contracts.
- **FR-008**: System MUST produce identical accepted comparison records and structured finding payloads across repeated runs over the same approved sample artifacts and committed output fixtures.
- **FR-009**: System MUST preserve existing output contracts, current successful output behavior, browser-only sql.js boundaries, trace behavior, persistence behavior, and existing deterministic slice behavior.
- **FR-010**: System MUST NOT add new business domains, new output adapters, new persistence tables, server calls, external persistence, raw OCR reads, raw source-document reads, or unreviewed-input reads.
- **FR-011**: System MUST limit any writes to existing contract-required validation evidence, deterministic outputs, warnings, errors, traces, and existing persistence rows; it MUST NOT imply new lower source-layer writes.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Approved sample artifacts already committed in the repository, current committed output fixtures, existing DD.csv mappings, current module contracts, current reviewed engine/output field names, and existing regression evidence for BSRS configuration, V1/VE, and valuation listings.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, unreviewed extraction output, hosted services, runtime network input, and uncommitted external workbooks or documents MUST NOT be read by deterministic engine modules.
- **Source Layer Reads**: Existing deterministic outputs, output adapter contracts, engine input packets where already required by current tests, approved sample artifacts, DD.csv mappings, and approved validation guidance already committed in the repository.
- **Source Layer Writes**: Validation evidence, structured warnings and errors, trace records, deterministic outputs, and existing output-adapter persistence rows only where current contracts already require them.
- **Traceability Required**: Every accepted reconciliation comparison and every warning/error finding must trace to compared slice names, field names, DD mapping or fallback basis, source artifact path, reviewed fact context, rule version, producing module, finding code, and severity.

### Key Entities *(include if feature involves data)*

- **Reconciliation Comparison**: Deterministic comparison record linking equivalent facts across output slices, including slice names, field names, canonical DD semantic name or approved fallback name, and comparison status.
- **Shared Case Fact**: Reviewed participant, plan, form, identifier, or field semantic that appears in more than one implemented output slice and should agree when present.
- **DD-Backed Mapping**: Canonical mapping through DD.csv for shared field semantics where a matching Data Dictionary field exists.
- **Approved Fallback Mapping**: Traceable contract-name mapping used only when no matching DD.csv field exists.
- **Cross-Slice Drift Finding**: Structured warning or error describing a mismatch, missing required counterpart, mapping failure, or unsupported comparison with trace metadata.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of shared facts selected for reconciliation from committed BSRS, V1/VE, and valuation-listing evidence are either accepted as matching or reported with deterministic structured findings.
- **SC-002**: 100% of reconciled V1/VE fields with matching DD.csv entries use DD-backed canonical semantics before comparison.
- **SC-003**: 100% of approved no-DD fallback comparisons record the fallback basis and do not silently invent alternate semantic names.
- **SC-004**: Repeated validation over identical approved artifacts and committed output fixtures produces byte-stable accepted comparison records and structured finding payloads.
- **SC-005**: Existing BSRS configuration, V1/VE, valuation-listing, benefit-kernel, form-resolution, persistence, trace, browser-only, and adapter-exclusion behavior remains unchanged outside the added validation and regression protection.

## Assumptions

- Approved sample artifacts and current committed output fixtures are authoritative validation sources for this hardening increment.
- This increment adds backend validation and regression protection only; it does not add UI behavior, new output adapters, or new business-domain calculations.
- DD.csv remains the canonical naming layer for V1 field semantics wherever a matching Data Dictionary field exists.
- Existing browser-only Vite and sql.js constraints, deterministic reviewed-input boundaries, static build delivery rules, and current module contracts continue to apply.
- Existing slice tests for BSRS configuration, V1/VE output, valuation listings, form resolution, benefit kernel, traceability, persistence, and hardening behavior remain the baseline behavior to preserve.
