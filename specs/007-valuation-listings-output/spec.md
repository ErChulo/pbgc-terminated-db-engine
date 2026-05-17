# Feature Specification: Valuation Listings Output

**Feature Branch**: `[008-valuation-listings-output]`

**Created**: 2026-05-17

**Status**: Draft

**Input**: User description: "Build the seventh executable slice of the PBGC terminated defined-benefit engine. Scope only the valuation_listings_output module on top of the already-implemented browser-side SQLite foundation, date_resolution slice, service_resolution slice, compensation_resolution slice, form_resolution slice, benefit_kernel slice, and v1_ve_output slice. Use the existing valuation_listings_output contract, engine contract, schemas, migrations, seeds, templates, official PBGC deliverable templates already in the repository, and related output fields already committed. Exclude bsrs_configuration_output and other output adapters from implementation except as referenced contracts. Treat DD.csv as the canonical naming layer wherever a matching Data Dictionary field exists."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Produce Valuation Listing Output Packets (Priority: P1)

As a casework reviewer, I want reviewed engine results to be transformed into a stable valuation-listing-ready output packet so that the case can be loaded into the official PBGC deliverable templates for review and distribution.

**Why this priority**: The valuation listings adapter is the primary deliverable that turns deterministic engine outputs into the downstream listing format used for casework review.

**Independent Test**: Given a committed reviewed fixture packet with all required upstream outputs present, the system produces a complete valuation listing output packet with the expected identity, date, form-state, benefit, ordering, and trace fields populated.

**Acceptance Scenarios**:

1. **Given** a reviewed case with all required valuation-listing inputs and upstream outputs, **When** the reviewer requests valuation listing generation, **Then** the system produces one stable output packet with the required row and metadata fields.
2. **Given** the same reviewed case and the same rule version, **When** the reviewer repeats valuation listing generation, **Then** the output packet is identical.

---

### User Story 2 - Handle Conditional Valuation Listing Paths (Priority: P2)

As a reviewer, I want conditional valuation-listing fields to reflect the case's reviewed status so that in-pay, QDRO, QPSA, asset/recovery, and override-sensitive cases remain traceable and unambiguous.

**Why this priority**: Conditional branches determine which fields are present, null, or warning-bearing in the downstream packet and are needed for reliable review.

**Independent Test**: Given fixture cases that exercise in-pay, QDRO, QPSA, asset/recovery, and override-sensitive conditions, the system produces explicit nulls or populated values according to the reviewed branch without inventing fallback values.

**Acceptance Scenarios**:

1. **Given** a non-in-pay reviewed case, **When** the valuation listing is generated, **Then** in-pay-only fields remain explicit nulls or controlled defaults as required by the contract.
2. **Given** a case that triggers QDRO or QPSA handling, **When** the valuation listing is generated, **Then** the corresponding conditional fields are present or null exactly as the reviewed case requires, with any warnings captured.
3. **Given** a case that includes an approved technical override, **When** the output is generated, **Then** the override is recorded and the resulting packet remains deterministic.

---

### User Story 3 - Preserve Adapter Boundaries and Traceability (Priority: P3)

As a case reviewer, I want every valuation-listing field to remain traceable to reviewed inputs and for unrelated adapters to stay out of scope so that the valuation listing output can be audited independently.

**Why this priority**: Traceability is required for defensible output review, and the slice must not blur boundaries with BSRS configuration or other downstream adapters.

**Independent Test**: Given a successful valuation listing generation, the system records trace data for populated fields and does not generate BSRS configuration output rows.

**Acceptance Scenarios**:

1. **Given** a completed valuation listing run, **When** the reviewer inspects the output record, **Then** each populated field has a trace link to reviewed inputs and the rule version.
2. **Given** a completed valuation listing run, **When** the reviewer searches for downstream adapter results, **Then** no BSRS configuration output is produced by this slice.
3. **Given** a completed valuation listing run, **When** the reviewer compares the packet against the official PBGC deliverable template family, **Then** the required row structure and ordering are preserved.

### Edge Cases

- What happens when a required upstream output family is missing? The run must fail with a structured error and no valuation-listing output row.
- What happens when a conditional input family is absent for a case that needs it? The run must fail or emit a structured warning exactly as the contract requires, with no silent fallback.
- What happens when the same reviewed packet is processed more than once? The output must remain identical for the same rule version and reviewed inputs.
- What happens when a field is not applicable to the case? The system must preserve explicit nulls rather than inventing a value.
- What happens when the official PBGC deliverable template requires a row shape that does not match the reviewed case? The module must preserve the committed template rules and report a structured error or warning as the contract requires.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST transform reviewed valuation-listing input packets into a stable valuation-listing output packet for cases that satisfy the contract's required inputs.
- **FR-002**: System MUST accept only reviewed structured inputs and upstream deterministic outputs from the approved engine boundary.
- **FR-003**: System MUST validate required and conditional valuation-listing input families before producing output.
- **FR-004**: System MUST emit structured warnings and errors when required upstream outputs, conditional inputs, or approved override values are missing or invalid.
- **FR-005**: System MUST preserve traceability for each populated valuation-listing output field back to reviewed inputs, rule version, and producing module.
- **FR-006**: System MUST preserve explicit nulls for fields that are not applicable to the reviewed case or branch.
- **FR-007**: System MUST persist successful valuation-listing outputs as deterministic engine outputs and MUST NOT write BSRS configuration or other downstream adapter outputs in this slice.
- **FR-008**: System MUST produce identical valuation-listing outputs for the same reviewed input packet, output version, and rule version.
- **FR-009**: System MUST support the output families defined by the committed valuation-listings contract, including identity, demographic, date, service, form-state, benefit, ordering, official PBGC deliverable template, and trace fields.
- **FR-010**: System MUST map each valuation-listing field through `artifacts/mappings/DD.csv` first when a matching DD field exists, and MUST preserve the DD canonical name in the mapping helper and trace metadata.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: case plan timeline, participant role population, benefit administration state, limitation packet, resolved dates, resolved service compensation, resolved forms status, plan benefit results, Title IV results, Section 4022(c) results, nonguaranteed and PBGC funds results, present value results, valuation-listing-specific packets, and trace inputs.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, and unreviewed extraction output MUST NOT be read by deterministic engine modules.
- **Source Layer Reads**: resolved facts, resolved plan provisions, engine input packets, deterministic outputs.
- **Source Layer Writes**: engine input packets, deterministic outputs.
- **Traceability Required**: input references, rule versions, module names, warnings, errors, output-field names, row ordering context, template family references, and output-row identity fields must be traceable for populated valuation-listing outputs.

### Key Entities *(include if feature involves data)*

- **Valuation listing output row**: The structured downstream-facing row containing identity, date, form, benefit, ordering, template, and trace fields for a case.
- **Valuation listing output metadata**: The case, plan, run, adapter-version, and template-family identity that accompanies each output row.
- **Valuation listing output trace**: The field-level review record that explains how each populated value was derived from reviewed inputs.
- **Engine run**: The deterministic execution record that ties the valuation listing output back to a specific reviewed input packet and rule version.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every committed valuation-listings fixture case produces a complete downstream-ready output packet with the required fields populated or explicitly null as specified.
- **SC-002**: Reprocessing the same reviewed case five times yields identical output rows and identical trace summaries in 100% of runs.
- **SC-003**: 100% of populated valuation-listing output fields include trace data linking the field to reviewed inputs and the producing rule version.
- **SC-004**: No BSRS configuration output or other downstream adapter output is generated by this slice.
- **SC-005**: Reviewers can complete a valuation-listing generation run for committed fixture cases without manual field repair or undocumented assumptions.

## Assumptions

- Reviewed upstream outputs from date, service, compensation, form, benefit-kernel, and V1/VE slices already exist before valuation-listing generation begins.
- The valuation-listings contract is the authoritative field list for this slice; BSRS configuration remains a downstream reference only.
- `artifacts/mappings/DD.csv` is the canonical naming layer for V1 field semantics and is the first mapping source for any valuation-listing field that has a matching DD entry.
- The official PBGC deliverable templates in the repository define the target row-family and ordering expectations for this slice.
- Missing optional branch data is represented as explicit nulls rather than inferred fallback values.
- The feature is delivered through the project's existing reviewed-casework workflow and release process.

## Valuation Data Dictionary Invariant

`artifacts/mappings/DD.csv` is the canonical naming layer for field semantics wherever a matching Data Dictionary field exists.

Every valuation-listing field must first map to `artifacts/mappings/DD.csv` when a matching DD field exists.
