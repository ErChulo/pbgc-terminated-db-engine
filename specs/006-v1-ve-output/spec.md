# Feature Specification: V1/VE Output

**Feature Branch**: `[007-v1-ve-output]`

**Created**: 2026-05-17

**Status**: Draft

**Input**: User description: "Build the sixth executable slice of the PBGC terminated defined-benefit engine. Scope only the v1_ve_output module on top of the already-implemented browser-side SQLite foundation, date_resolution slice, service_resolution slice, compensation_resolution slice, form_resolution slice, and benefit_kernel slice. Use the existing v1_ve_output contract, engine contract, schemas, migrations, seeds, templates, and related output fields already in the repository. Exclude valuation_listings_output, bsrs_configuration_output, and other output adapters from implementation except as referenced contracts."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Produce V1/VE Output Packets (Priority: P1)

As a casework reviewer, I want reviewed engine results to be transformed into a stable V1/VE-ready output packet so that the case can be used for downstream spreadsheet population and review.

**Why this priority**: The V1/VE adapter is the first deliverable that turns the deterministic engine's reviewed inputs and upstream outputs into a downstream-facing output family used by production casework.

**Independent Test**: Given a committed reviewed fixture packet with all required upstream outputs present, the system produces a complete V1/VE output packet with the expected identity, date, form-state, benefit, and trace fields populated.

**Acceptance Scenarios**:

1. **Given** a reviewed case with all required V1/VE inputs and upstream outputs, **When** the reviewer requests V1/VE output generation, **Then** the system produces one stable output packet with the required row and metadata fields.
2. **Given** the same reviewed case and the same rule version, **When** the reviewer repeats V1/VE output generation, **Then** the output packet is identical.

---

### User Story 2 - Handle Conditional V1/VE Paths (Priority: P2)

As a reviewer, I want conditional V1/VE fields to reflect the case's reviewed status so that in-pay, QDRO, QPSA, and override-sensitive cases remain traceable and unambiguous.

**Why this priority**: Conditional branches determine which fields are present, null, or warning-bearing in the downstream packet and are needed for reliable review.

**Independent Test**: Given fixture cases that exercise in-pay, QDRO, QPSA, and override-sensitive conditions, the system produces explicit nulls or populated values according to the reviewed branch without inventing fallback values.

**Acceptance Scenarios**:

1. **Given** a non-in-pay reviewed case, **When** the V1/VE output is generated, **Then** in-pay-only fields remain explicit nulls or controlled defaults as required by the contract.
2. **Given** a case that triggers QDRO or QPSA handling, **When** the V1/VE output is generated, **Then** the corresponding conditional fields are present or null exactly as the reviewed case requires, with any warnings captured.
3. **Given** a case that includes an approved technical override, **When** the output is generated, **Then** the override is recorded and the resulting packet remains deterministic.

---

### User Story 3 - Preserve Adapter Boundaries and Traceability (Priority: P3)

As a case reviewer, I want every V1/VE field to remain traceable to reviewed inputs and for unrelated adapters to stay out of scope so that the V1/VE output can be audited independently.

**Why this priority**: Traceability is required for defensible output review, and the slice must not blur boundaries with valuation listings, BSRS configuration, or other downstream adapters.

**Independent Test**: Given a successful V1/VE generation, the system records trace data for populated fields and does not generate valuation-listings or BSRS output rows.

**Acceptance Scenarios**:

1. **Given** a completed V1/VE run, **When** the reviewer inspects the output record, **Then** each populated field has a trace link to reviewed inputs and the rule version.
2. **Given** a completed V1/VE run, **When** the reviewer searches for downstream adapter results, **Then** no valuation-listings or BSRS configuration output is produced by this slice.

### Edge Cases

- What happens when a required upstream output family is missing? The run must fail with a structured error and no V1/VE output row.
- What happens when a conditional input family is absent for a case that needs it? The run must fail or emit a structured warning exactly as the contract requires, with no silent fallback.
- What happens when the same reviewed packet is processed more than once? The output must remain identical for the same rule version and reviewed inputs.
- What happens when a field is not applicable to the case? The system must preserve explicit nulls rather than inventing a value.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST transform reviewed V1/VE input packets into a stable V1/VE output packet for cases that satisfy the contract's required inputs.
- **FR-002**: System MUST accept only reviewed structured inputs and upstream deterministic outputs from the approved engine boundary.
- **FR-003**: System MUST validate required and conditional V1/VE input families before producing output.
- **FR-004**: System MUST emit structured warnings and errors when required upstream outputs, conditional inputs, or approved override values are missing or invalid.
- **FR-005**: System MUST preserve traceability for each populated V1/VE output field back to reviewed inputs, rule version, and producing module.
- **FR-006**: System MUST preserve explicit nulls for fields that are not applicable to the reviewed case or branch.
- **FR-007**: System MUST persist successful V1/VE outputs as deterministic engine outputs and MUST NOT write valuation-listings, BSRS configuration, or other downstream adapter outputs in this slice.
- **FR-008**: System MUST produce identical V1/VE outputs for the same reviewed input packet, output version, and rule version.
- **FR-009**: System MUST support the output families defined by the committed V1/VE contract, including identity, date, form-state, Title IV, Section 4022(c), termination-benefit, nonguaranteed, present-value factor, and trace fields.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: case plan timeline, participant role population, benefit administration state, limitation packet, resolved dates, resolved forms status, plan benefit results, Title IV results, Section 4022(c) results, nonguaranteed and PBGC funds results, present value results, and trace inputs.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, and unreviewed extraction output MUST NOT be read by deterministic engine modules.
- **Source Layer Reads**: resolved facts, resolved plan provisions, engine input packets, deterministic outputs.
- **Source Layer Writes**: engine input packets, deterministic outputs.
- **Traceability Required**: input references, rule versions, module names, warnings, errors, output-field names, and output-row identity fields must be traceable for populated V1/VE outputs.

### Key Entities *(include if feature involves data)*

- **V1/VE output row**: The structured downstream-facing row containing identity, date, form, benefit, present-value, and trace fields for a case.
- **V1/VE output metadata**: The case, plan, run, and adapter-version identity that accompanies each output row.
- **V1/VE output trace**: The field-level review record that explains how each populated value was derived from reviewed inputs.
- **Engine run**: The deterministic execution record that ties the V1/VE output back to a specific reviewed input packet and rule version.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every committed V1/VE fixture case produces a complete downstream-ready output packet with the required fields populated or explicitly null as specified.
- **SC-002**: Reprocessing the same reviewed case five times yields identical output rows and identical trace summaries in 100% of runs.
- **SC-003**: 100% of populated V1/VE output fields include trace data linking the field to reviewed inputs and the producing rule version.
- **SC-004**: No valuation-listings output, BSRS configuration output, or other downstream adapter output is generated by this slice.
- **SC-005**: Reviewers can complete a V1/VE generation run for committed fixture cases without manual field repair or undocumented assumptions.

## Assumptions

- Reviewed upstream outputs from date, service, compensation, form, and benefit-kernel slices already exist before V1/VE generation begins.
- The V1/VE contract is the authoritative field list for this slice; valuation listings and BSRS configuration remain downstream references only.
- Missing optional branch data is represented as explicit nulls rather than inferred fallback values.
- The feature is delivered through the project's existing reviewed-casework workflow and release process.
