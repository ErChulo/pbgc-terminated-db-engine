# Feature Specification: engine-hardening-review

**Feature Branch**: `[010-engine-hardening-review]`

**Created**: 2026-05-17

**Status**: Draft

**Input**: User description: "Build a hardening-review slice for the existing PBGC terminated defined-benefit engine. Scope only review, hardening, and regression protection for the already-implemented slices: date_resolution, service_resolution, compensation_resolution, form_resolution, benefit_kernel, v1_ve_output, valuation_listings_output, and bsrs_configuration_output. Do not add new output adapters or new business domains unless needed to fix defects in the existing stack. Focus on: deterministic behavior, DD.csv invariants, adapter-exclusion invariants, persistence boundaries, traceability, output-shape stability, browser-only sql.js boundaries, and alignment with the official PBGC templates and BSRS guidance already in the repository."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Protect Deterministic Outputs (Priority: P1)

As a reviewer, I want the existing output slices to remain deterministic across repeated runs so that validated casework does not drift between reviews or builds.

**Why this priority**: Deterministic results are the foundation of the engine; if repeated runs can diverge, downstream review and output sign-off become unreliable.

**Independent Test**: Run the existing reviewed fixture cases multiple times and confirm the same outputs, warnings, and trace records are produced each time.

**Acceptance Scenarios**:

1. **Given** a reviewed fixture packet that has already passed validation, **When** it is run twice without changing the inputs, **Then** the outputs and trace counts remain identical.
2. **Given** the same reviewed case executed after unrelated slice changes, **When** the existing regression suite is run, **Then** no output field changes unless the reviewed inputs changed.

---

### User Story 2 - Enforce DD.csv and Adapter Boundaries (Priority: P2)

As a reviewer, I want the canonical naming and adapter-exclusion rules to remain intact so that approved output fields stay aligned with the Data Dictionary and no downstream adapter writes appear where they do not belong.

**Why this priority**: These invariants protect traceability, naming consistency, and slice isolation across the existing output adapters.

**Independent Test**: Run focused regression checks that confirm DD-backed fields resolve to the canonical Data Dictionary names and that excluded adapter tables remain untouched during each adapter run.

**Acceptance Scenarios**:

1. **Given** an emitted field that has a matching DD.csv entry, **When** the regression checks run, **Then** the emitted field is mapped through the canonical DD name.
2. **Given** a run for one output adapter, **When** the adapter completes, **Then** no unrelated output-adapter rows are created.

---

### User Story 3 - Preserve Browser-Only Persistence and Traceability (Priority: P3)

As a reviewer, I want the engine to keep its browser-only persistence and traceability behavior stable so that reviewed outputs remain auditable without introducing external dependencies.

**Why this priority**: The engine must remain a browser-side, review-driven system with stable traces and committed output artifacts.

**Independent Test**: Verify the existing slices still persist only through the local sqlite flow and continue to produce trace records that link outputs back to reviewed inputs and rule versions.

**Acceptance Scenarios**:

1. **Given** a completed output run, **When** persistence is inspected, **Then** only the expected engine and output rows exist for that slice.
2. **Given** a generated trace set, **When** the trace records are reviewed, **Then** each populated output remains linked to the reviewed input packet and module rule version.

### Edge Cases

- A reviewed fixture produces explicit nulls for an inapplicable branch and the nulls must remain explicit rather than being replaced by fallback values.
- A field with no DD.csv mapping must still emit the approved contract field name instead of failing or inventing a substitute name.
- An output run must not create rows in unrelated output-adapter tables when only one slice is executed.
- A repeated run must not change committed output-shape ordering or the set of traceable fields.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST preserve deterministic output behavior for the existing reviewed fixture cases across repeated runs.
- **FR-002**: The system MUST accept only reviewed structured inputs already produced by the existing deterministic boundary for the hardening checks.
- **FR-003**: The system MUST continue to emit structured warnings or errors for the existing validation failures that the current slices already recognize.
- **FR-004**: The system MUST preserve field-level traceability from populated outputs to reviewed inputs, rule version, and producing module.
- **FR-005**: The system MUST preserve DD.csv canonical naming behavior for fields that already have matching Data Dictionary entries.
- **FR-006**: The system MUST preserve approved contract field names for fields that do not have matching DD.csv entries.
- **FR-007**: The system MUST preserve adapter-exclusion boundaries so that each slice continues to avoid creating rows for unrelated output adapters.
- **FR-008**: The system MUST preserve browser-only sqlite persistence boundaries and MUST NOT introduce server calls or external persistence requirements.
- **FR-009**: The system MUST keep output shapes stable for the committed adapter contracts unless a defect fix requires a targeted correction.
- **FR-010**: The system MUST remain aligned with the official PBGC deliverable templates and BSRS guidance already committed in the repository.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Reviewed fixture packets, committed contract artifacts, committed templates, committed mappings, and existing deterministic output packets.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, and unreviewed extraction output MUST NOT be read by deterministic engine modules.
- **Source Layer Reads**: source assertions, resolved facts, resolved plan provisions, engine input packets, deterministic outputs, approved templates, BSRS guidance artifacts, and `artifacts/mappings/DD.csv`.
- **Source Layer Writes**: regression evidence, validation records, traces, deterministic outputs, and existing persistence rows only where current contracts already require them; the hardening slice MUST NOT introduce new lower source-layer writes.
- **Traceability Required**: Input references, rule versions, module names, warnings, errors, DD-backed field names, and output fields that require trace links.

### Key Entities *(include if feature involves data)*

- **Reviewed Fixture Packet**: The structured input used to validate an existing slice.
- **Deterministic Output Artifact**: The committed output row and its warnings and traces.
- **DD Mapping Entry**: The canonical naming reference used when a field has a matching Data Dictionary entry.
- **Adapter Boundary Record**: The persisted evidence that only the intended output-adapter rows were created.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Re-running the same reviewed fixture cases produces identical outputs and trace counts in 100% of repeated-run checks.
- **SC-002**: 100% of fields that have matching DD.csv entries continue to resolve through the canonical Data Dictionary names in regression checks.
- **SC-003**: 100% of regression checks for excluded adapters confirm that unrelated output-adapter tables remain unchanged after a slice run.
- **SC-004**: All existing slice regressions complete without introducing browser-external persistence or server-dependent behavior.
- **SC-005**: Output-shape stability checks pass for all committed adapter contracts in the hardening review suite.

## Assumptions

- The existing reviewed fixture packets remain the authoritative basis for hardening and regression checks.
- The current committed contracts, schemas, templates, migrations, seeds, and mappings remain the source of truth for the slice behavior under review.
- The hardening slice is intended to protect existing behavior first and only permit targeted defect fixes where a regression proves the current behavior is wrong.
- Browser-only sql.js persistence remains the required runtime boundary for the engine and its adapter slices.
