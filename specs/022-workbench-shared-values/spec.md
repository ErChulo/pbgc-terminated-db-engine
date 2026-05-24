# Feature Specification: Reconciliation Workbench Shared Values

**Feature Branch**: `021-reconciliation-workbench-shared-values`

**Created**: 2026-05-24

**Status**: Draft

**Input**: User description: "Build a reconciliation-workbench shared-values increment for the PBGC terminated defined-benefit engine. Scope this slice to improving the existing browser reconciliation workbench page only, using already implemented slices, approved sample artifacts already in the repository, and simulated or mocked person-level case or population data where needed. Do not use any real participant, beneficiary, or other natural-person data. Do not add new business domains or new output adapters. Focus on a visible analyst-readable Shared Values table in the existing workbench that clearly shows compared sources, compared fields, raw values, normalized values where applicable, agreement-versus-drift status, severity where applicable, traceability cues, and stable deterministic ordering. Preserve existing contracts, browser-only sql.js boundaries, and existing slice behavior."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Compare Shared Values (Priority: P1)

An analyst viewing the existing reconciliation workbench can see a visible Shared Values table that compares selected output values across BSRS configuration output, V1/VE output, valuation listings output, and DD-backed or approved-fallback mapping evidence.

**Why this priority**: Value-level comparison is the next analyst review step after shared-fact agreement. It helps distinguish true drift from agreement, nullable conditions, unsupported cases, and formatting-only differences.

**Independent Test**: Load the existing workbench for the fixed approved sample and confirm the Shared Values table is visible, ordered deterministically, and shows compared sources, compared fields, raw values, normalized values where applicable, status, severity when applicable, and traceability cues.

**Acceptance Scenarios**:

1. **Given** the existing workbench is loaded for the fixed approved sample, **When** the analyst views the reconciliation area, **Then** a Shared Values table is visible with one row per selected shared-value comparison.
2. **Given** a shared-value row compares evidence from two output slices, **When** the row is displayed, **Then** it shows both compared sources, both compared field names, both raw values, both normalized values where applicable, status, severity when applicable, and traceability cues.
3. **Given** the same fixed approved sample is loaded repeatedly, **When** the analyst views the Shared Values table each time, **Then** the row order and displayed comparison content remain identical.

---

### User Story 2 - Preserve Value Classifications (Priority: P2)

An analyst can interpret whether each shared-value comparison is agreement, drift, warning, nullable, unsupported, or formatting-only without the workbench recalculating or renaming the existing classifications.

**Why this priority**: Preserving existing classifications prevents the display layer from changing deterministic reconciliation meaning.

**Independent Test**: Inspect the Shared Values table for the fixed approved sample and confirm the displayed statuses and severities match existing reconciliation evidence, including intentional absence markers when severity or normalization is not applicable.

**Acceptance Scenarios**:

1. **Given** a shared-value row has an existing agreement, drift, warning, nullable, unsupported, or formatting-only classification, **When** it is displayed, **Then** the displayed status preserves that classification.
2. **Given** a shared-value row has no applicable normalized value or severity, **When** it is displayed, **Then** the table shows an intentional absence marker rather than a blank or misleading value.

---

### User Story 3 - Preserve Workbench Boundaries (Priority: P3)

An analyst can use the Shared Values table without changing deterministic outputs, adding output adapters, or exposing real natural-person data.

**Why this priority**: The increment must remain a presentation-only improvement over already approved sample evidence and existing reconciliation outputs.

**Independent Test**: Compare output rows, shared-fact rows, shared-value rows, and workbench state before and after rendering the table, and confirm no new business domain, output adapter, persistence behavior, raw source read, or real natural-person data appears.

**Acceptance Scenarios**:

1. **Given** the workbench renders the Shared Values table, **When** the page is loaded, **Then** deterministic output rows and existing Shared Facts rows are not mutated.
2. **Given** mocked case or population context is displayed, **When** an analyst reviews the Shared Values table, **Then** the page clearly avoids real participant, beneficiary, alternate payee, survivor, or other natural-person data.

### Edge Cases

- A comparison may have normalized values that match while raw values differ; the table must preserve the existing formatting-only classification.
- A comparison may be nullable or unsupported; the row must preserve the existing classification rather than forcing agreement or drift.
- A comparison may have no applicable normalized value or severity; the table must show a clear intentional absence marker.
- Long source names, field names, raw values, normalized values, or traceability cues must remain readable without hiding status or severity at desktop 1440x900 and mobile 390x844 viewports.
- Repeated loads of the same fixed approved sample must not reorder rows or alter displayed shared-value content.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The workbench MUST display a dedicated Shared Values table for the fixed approved sample.
- **FR-002**: Each Shared Values row MUST show a business-readable value label, compared sources, compared field names, raw compared values, normalized values where applicable, reconciliation status including agreement, drift, warning, nullable, unsupported, and formatting-only where applicable, severity when applicable, mapping basis, and traceability cues.
- **FR-003**: The Shared Values table MUST use stable deterministic ordering across repeated loads of the same fixed approved sample.
- **FR-004**: The Shared Values table MUST preserve existing agreement, drift, warning, nullable, unsupported, and formatting-only classifications from the existing reconciliation evidence.
- **FR-005**: The Shared Values table MUST display intentional absence markers for non-applicable severity or normalized values.
- **FR-006**: The page MUST preserve existing output panel behavior, existing Shared Facts behavior, and existing reconciliation classifications while adding the Shared Values table.
- **FR-007**: The Shared Values table MUST use only approved sample artifacts, existing deterministic outputs, existing reconciliation evidence, DD-backed mappings where available, approved fallback mappings where no DD field exists, and explicitly mocked or simulated display context.
- **FR-008**: The page MUST NOT display real participant, beneficiary, alternate payee, survivor, or other natural-person data.
- **FR-009**: The feature MUST NOT add a new business domain, output adapter, persistence workflow, source ingestion workflow, or case-selection workflow.
- **FR-010**: The feature MUST preserve traceability cues sufficient for an analyst to identify the compared source slices, source fields, raw values, normalized values where applicable, status, severity, mapping basis, rule version, and producing module for every displayed row.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Approved sample artifacts already committed in the repository; existing deterministic BSRS configuration output evidence; existing deterministic V1/VE output evidence; existing deterministic valuation-listing output evidence; existing shared-value reconciliation comparison records; existing DD-backed and approved-fallback mapping metadata; mocked or simulated display labels authored in committed repository files.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, unreviewed extraction output, hosted services, runtime network input, uncommitted external files, and real natural-person data MUST NOT be read or displayed.
- **Source Layer Reads**: Deterministic outputs and output-adapter evidence already produced by existing slices, plus approved committed sample artifacts, shared-value reconciliation evidence, and mapping metadata.
- **Source Layer Writes**: Display-only workbench state and deterministic rendered presentation for the existing page; no lower source-layer writes and no new output-adapter rows.
- **Traceability Required**: Every displayed Shared Values row must identify the compared source slices, compared fields, raw values, normalized values where applicable, status, severity where applicable, mapping basis, rule version, producing module, and stable evidence basis.
- **Expected Warnings/Errors**: The workbench displays only existing shared-value statuses, severities, and intentional absence markers; it does not introduce new calculation warnings or errors.
- **Affected Output Adapters**: Existing BSRS configuration, V1/VE, and valuation listings outputs are display sources only; the feature must not write to output-adapter rows or change adapter behavior.

### Key Entities *(include if feature involves data)*

- **Shared-Value Table Row**: A visible comparison of a selected output value across existing output slices, including value label, compared sources, fields, raw values, normalized values where applicable, status, severity, mapping basis, traceability cues, and stable ordering key.
- **Normalized Value Display**: The analyst-readable normalized comparison value or intentional absence marker for each side of a shared-value row.
- **Comparison Source**: The existing output slice or DD-backed/approved-fallback mapping evidence that supplied one side of a comparison row.
- **Mocked Display Context**: Simulated case or population labels used only to orient the analyst and explicitly not representing real natural-person data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An analyst can identify the compared sources, fields, raw values, normalized values where applicable, status, and severity for any Shared Values row within 10 seconds of opening the workbench.
- **SC-002**: Repeated loads of the same fixed approved sample produce identical Shared Values row order and displayed comparison content in 100% of tested runs.
- **SC-003**: The workbench displays zero real participant, beneficiary, alternate payee, survivor, or other natural-person names or identifiers beyond approved sample identifiers and explicitly mocked labels.
- **SC-004**: Existing BSRS configuration, V1/VE, valuation-listing, Shared Facts, and reconciliation outputs remain unchanged after rendering the Shared Values table in 100% of regression checks.
- **SC-005**: Every displayed Shared Values row includes a status, severity or intentional absence marker, and traceability cue in 100% of tested rows.

## Assumptions

- The fixed approved sample used by the existing workbench remains the initial Shared Values sample for this increment.
- Existing shared-value reconciliation evidence already contains enough selected comparisons to populate the initial table.
- Mocked case and population labels may be reused from prior workbench increments when person-level context is needed.
- This increment is presentation-only and does not require new schemas, migrations, seeds, output adapters, source ingestion, or persistence behavior.
- Browser-only operation, offline deterministic behavior, and no-server-call boundaries remain unchanged from the existing workbench.
