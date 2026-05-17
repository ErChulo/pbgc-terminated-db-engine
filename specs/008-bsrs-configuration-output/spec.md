# Feature Specification: BSRS Configuration Output

**Feature Branch**: `[008-bsrs-configuration-output-slice]`

**Created**: 2026-05-17

**Status**: Draft

**Input**: User description: "Build the eighth executable slice of the PBGC terminated defined-benefit engine. Scope only the bsrs_configuration_output module on top of the already-implemented browser-side SQLite foundation, date_resolution slice, service_resolution slice, compensation_resolution slice, form_resolution slice, benefit_kernel slice, v1_ve_output slice, and valuation_listings_output slice. Use the existing bsrs_configuration_output contract, engine contract, schemas, migrations, seeds, official PBGC deliverable templates and BSRS guidance already in the repository, and related output fields already committed. Treat DD.csv as the canonical naming layer wherever a matching Data Dictionary field exists. Exclude all other output adapters from implementation except as referenced contracts."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Produce BSRS Configuration Output Packets (Priority: P1)

As a casework reviewer, I want reviewed engine results to be transformed into a stable BSRS configuration output packet so that the case can be prepared for Benefit Statement and Retirement Statement programming support.

**Why this priority**: BSRS configuration is the target deliverable for this slice and the primary value of the module.

**Independent Test**: Given a committed reviewed fixture packet with all required upstream outputs present, the system produces a complete BSRS configuration output packet with the required identity, date, form-state, benefit-support, statement-control, and trace fields populated.

**Acceptance Scenarios**:

1. **Given** a reviewed case with all required BSRS inputs and upstream outputs, **When** the reviewer requests BSRS configuration generation, **Then** the system produces one stable output packet with the required row and metadata fields.
2. **Given** the same reviewed case and the same rule version, **When** the reviewer repeats BSRS configuration generation, **Then** the output packet is identical.

---

### User Story 2 - Handle Conditional BSRS Paths (Priority: P2)

As a reviewer, I want conditional BSRS fields to reflect the case's reviewed status so that in-pay, survivor, form, and statement-programming branches remain traceable and unambiguous.

**Why this priority**: Conditional paths determine which statement-programming values are present, null, or warning-bearing and must stay deterministic for review.

**Independent Test**: Given fixture cases that exercise in-pay, survivor, form, and override-sensitive conditions, the system produces explicit nulls or populated values according to the reviewed branch without inventing fallback values.

**Acceptance Scenarios**:

1. **Given** a non-applicable reviewed case branch, **When** the BSRS configuration is generated, **Then** inapplicable fields remain explicit nulls or controlled defaults as required by the contract.
2. **Given** a case that triggers conditional form or survivor handling, **When** the BSRS configuration is generated, **Then** the corresponding conditional fields are present or null exactly as the reviewed case requires, with any warnings captured.
3. **Given** a case that includes an approved technical override, **When** the output is generated, **Then** the override is recorded and the resulting packet remains deterministic.

---

### User Story 3 - Preserve Canonical Naming and Traceability (Priority: P3)

As a reviewer, I want BSRS output field names to use the canonical Data Dictionary naming when it exists so that the deliverable stays aligned with repository-wide semantics and trace review remains consistent.

**Why this priority**: BSRS configuration must stay aligned with shared naming and trace conventions so downstream review does not drift from the canonical field vocabulary.

**Independent Test**: Given a fixture case with fields that have matching Data Dictionary entries, the generated output uses the canonical Data Dictionary names and preserves field-level trace references.

**Acceptance Scenarios**:

1. **Given** a BSRS field that has a matching entry in `artifacts/mappings/DD.csv`, **When** the output is generated, **Then** the emitted field resolves to the canonical Data Dictionary name.
2. **Given** a BSRS field that does not have a matching Data Dictionary entry, **When** the output is generated, **Then** the field still appears under its approved contract name and remains traceable.

### Edge Cases

- What happens when a required upstream deterministic output is missing for a reviewed case?
- How does the system handle a BSRS field that is present in the contract but has no matching Data Dictionary entry?
- What happens when the same reviewed case is generated twice with the same rule version and input packet?
- How does the system order rows when a case yields multiple BSRS subjects or statement row types?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST transform reviewed case data and approved upstream deterministic outputs into a BSRS configuration output packet that conforms to the approved contract and deliverable templates.
- **FR-002**: System MUST accept only reviewed structured inputs and approved upstream deterministic outputs for BSRS configuration generation.
- **FR-003**: System MUST reject raw OCR, raw source documents, and unreviewed extraction output from the deterministic BSRS path.
- **FR-004**: System MUST emit structured warnings and errors when required or conditional BSRS inputs are missing, contradictory, or inapplicable.
- **FR-005**: System MUST preserve traceability for each output field to reviewed inputs, upstream outputs, rule version, producing module, and calculation run.
- **FR-006**: System MUST use `artifacts/mappings/DD.csv` as the canonical naming layer for any BSRS field that has a matching Data Dictionary entry.
- **FR-007**: System MUST preserve the approved BSRS contract field name for any output field that does not have a matching Data Dictionary entry.
- **FR-008**: System MUST preserve explicit nulls for fields that are inapplicable to the reviewed case branch.
- **FR-009**: System MUST persist successful BSRS configuration runs and failed validation runs in the browser database with deterministic row ordering.
- **FR-010**: System MUST not recalculate benefits, invent fallback values, or alter upstream deterministic outputs while generating BSRS configuration output.
- **FR-011**: System MUST not write valuation listings, V1/VE, or any other downstream output adapter records as part of BSRS configuration generation.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: case plan timeline, participant role population, service employment history, benefit administration state, limitation packet, upstream deterministic outputs from date resolution, service resolution, compensation resolution, form resolution, benefit kernel, V1/VE output, and valuation listings output.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, and unreviewed extraction output MUST NOT be read by deterministic engine modules.
- **Source Layer Reads**: source assertions, resolved facts, resolved plan provisions, engine input packets, deterministic outputs, approved BSRS templates, BSRS guidance translated into repository artifacts, and `artifacts/mappings/DD.csv`.
- **Source Layer Writes**: deterministic BSRS configuration output rows, trace records, validation warnings, and validation errors.
- **Traceability Required**: case references, plan references, calculation run ID, module name, contract version, DD mapping reference where applicable, warnings, errors, and output fields that require trace links.

### Key Entities *(include if feature involves data)*

- **BSRS Configuration Packet**: The deterministic output set that prepares a case for statement programming support, including identity, date, form-state, benefit-support, control, and trace fields.
- **BSRS Configuration Output Row**: The persisted browser-database representation of one deterministic BSRS configuration result for a case run.
- **DD Mapping Entry**: The canonical naming record that identifies the Data Dictionary field name used when a BSRS field has a matching entry.
- **Trace Record**: The field-level linkage between output values, reviewed inputs, upstream outputs, and rule version.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of approved BSRS fixture cases with complete upstream outputs produce a complete BSRS configuration output packet with required fields populated or explicitly null according to the contract.
- **SC-002**: Repeating BSRS configuration generation for the same reviewed case and rule version yields identical output content and row ordering in 100% of runs.
- **SC-003**: 100% of BSRS fields that have a matching entry in `artifacts/mappings/DD.csv` resolve to the canonical Data Dictionary name in the emitted output and trace records.
- **SC-004**: Reviewers can identify missing or conflicting inputs through structured warnings and errors without manual repair for the approved fixture set.
- **SC-005**: No BSRS configuration run writes records for unrelated downstream output adapters.

## Assumptions

- The reviewed BSRS guidance and official PBGC deliverable templates already committed in the repository are authoritative for this slice.
- `artifacts/mappings/DD.csv` is the canonical naming source whenever a BSRS field has a matching Data Dictionary entry.
- Upstream deterministic slices for date resolution, service resolution, compensation resolution, form resolution, benefit kernel, V1/VE output, and valuation listings output are already available and stable before BSRS configuration runs.
- The browser-only persistence layer and deterministic boundary already exist and remain the only runtime environment for this feature.
