# Feature Specification: Reconciliation Workbench Comparison Tables

**Feature Branch**: `021-reconciliation-comparison-tables`

**Created**: 2026-05-24

**Status**: Draft

**Input**: User description: "Build a reconciliation-workbench comparison-tables increment for the PBGC terminated defined-benefit engine. Scope this slice to improving the existing browser reconciliation workbench page only, using already implemented slices, approved sample artifacts already in the repository, and simulated or mocked person-level case/population data where needed. Do not use any real participant, beneficiary, or other natural-person data. Do not add new business domains or new output adapters. Focus on visible analyst-readable comparison tables in the existing workbench: a shared-facts table and a shared-values table that clearly show compared sources, normalized values where applicable, agreement-versus-drift status, severity where applicable, and stable deterministic ordering. Preserve existing contracts, browser-only sql.js boundaries, and existing slice behavior."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Compare Shared Facts (Priority: P1)

An analyst viewing the existing reconciliation workbench can see a visible shared-facts comparison table that lists the selected case facts compared across BSRS configuration output, V1/VE output, valuation listings output, and DD-backed mapping evidence.

**Why this priority**: Shared-fact agreement is the first review step for detecting whether the output slices refer to the same case, participant identifier, form, and DD-backed fact basis.

**Independent Test**: Load the existing workbench for the fixed approved sample and confirm the shared-facts table is visible, ordered deterministically, and shows compared sources, compared fields, compared values, agreement-versus-drift status, and severity when present.

**Acceptance Scenarios**:

1. **Given** the existing workbench is loaded for the fixed approved sample, **When** the analyst views the reconciliation area, **Then** a shared-facts table is visible with one row per selected shared-fact comparison.
2. **Given** a shared-fact row compares evidence from two output slices, **When** the row is displayed, **Then** it shows both compared sources, both compared field names, both compared values, the agreement-versus-drift classification, and severity when applicable.
3. **Given** the same fixed approved sample is loaded repeatedly, **When** the analyst views the shared-facts table each time, **Then** the row order and displayed values remain identical.

---

### User Story 2 - Compare Shared Values (Priority: P2)

An analyst can review a visible shared-values comparison table that distinguishes raw compared values from normalized values where normalization is available.

**Why this priority**: Value-level review helps identify whether apparent differences are true drift, acceptable formatting differences, nullable conditions, or unsupported comparison branches.

**Independent Test**: Load the existing workbench for the fixed approved sample and confirm the shared-values table is visible, ordered deterministically, and shows compared sources, compared fields, compared values, normalized values where available, status, and severity.

**Acceptance Scenarios**:

1. **Given** the fixed approved sample has selected shared-value comparisons, **When** the analyst views the reconciliation area, **Then** a shared-values table is visible with one row per selected shared-value comparison.
2. **Given** a shared-value row has normalized comparison evidence, **When** the row is displayed, **Then** it shows both raw compared values and both normalized values.
3. **Given** a shared-value row is an agreement, drift, warning, nullable, unsupported, or formatting-only comparison, **When** the row is displayed, **Then** its status and severity communicate the comparison outcome without relying on technical codes alone.

---

### User Story 3 - Preserve Workbench Boundaries (Priority: P3)

An analyst can use the comparison tables without changing deterministic outputs, adding output adapters, or exposing real natural-person data.

**Why this priority**: The usability increment must remain a presentation-only improvement over already approved sample evidence and existing reconciliation outputs.

**Independent Test**: Compare output rows and workbench state before and after rendering the tables, and confirm no new business domain, output adapter, persistence behavior, raw source read, or real natural-person data appears.

**Acceptance Scenarios**:

1. **Given** the workbench renders comparison tables, **When** the page is loaded, **Then** deterministic output rows are not mutated and no new output rows are produced.
2. **Given** mocked case or population context is displayed, **When** an analyst reviews the comparison tables, **Then** the page clearly avoids real participant, beneficiary, alternate payee, survivor, or other natural-person data.

### Edge Cases

- A comparison may have no severity because the status is a clean agreement; the table must display this as an intentional non-error condition rather than a missing value.
- A comparison may have no normalized value because normalization is not applicable; the shared-values table must display a clear absence marker without treating it as drift.
- A comparison may involve nullable or unsupported evidence; the row must preserve the existing classification and not force it into agreement or drift.
- Long source names, field names, or values must remain readable without hiding the status or compared evidence.
- Repeated loads of the same fixed approved sample must not reorder rows or alter displayed comparison values.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The workbench MUST display a dedicated shared-facts comparison table for the fixed approved sample.
- **FR-002**: Each shared-facts row MUST show a business-readable fact label, compared sources, compared field names, compared values, agreement-versus-drift status, and severity when applicable.
- **FR-003**: The workbench MUST display a dedicated shared-values comparison table for the fixed approved sample.
- **FR-004**: Each shared-values row MUST show a business-readable value label, compared sources, compared field names, compared values, normalized values when applicable, agreement-versus-drift status, and severity when applicable.
- **FR-005**: Both comparison tables MUST use stable deterministic ordering across repeated loads of the same fixed approved sample.
- **FR-006**: The page MUST preserve existing output panel behavior and existing reconciliation classifications while adding the new table presentation.
- **FR-007**: The comparison tables MUST use only approved sample artifacts, existing deterministic outputs, existing reconciliation evidence, DD-backed mappings where available, and explicitly mocked or simulated display context.
- **FR-008**: The page MUST NOT display real participant, beneficiary, alternate payee, survivor, or other natural-person data.
- **FR-009**: The feature MUST NOT add a new business domain, output adapter, persistence workflow, source ingestion workflow, or case-selection workflow.
- **FR-010**: The feature MUST preserve traceability cues sufficient for an analyst to identify the compared source slices and fields for every displayed row.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Approved sample artifacts already committed in the repository; existing deterministic BSRS configuration output evidence; existing deterministic V1/VE output evidence; existing deterministic valuation-listing output evidence; existing shared-fact and shared-value reconciliation comparison records; existing DD-backed mapping metadata; mocked or simulated display labels authored in committed repository files.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, unreviewed extraction output, hosted services, runtime network input, uncommitted external files, and real natural-person data MUST NOT be read or displayed.
- **Source Layer Reads**: Deterministic outputs and output-adapter evidence already produced by existing slices, plus approved committed sample artifacts and mapping metadata.
- **Source Layer Writes**: Display-only workbench state and deterministic rendered presentation for the existing page; no lower source-layer writes and no new output-adapter rows.
- **Traceability Required**: Every displayed comparison row must identify the compared source slices, compared fields, compared values, normalized values where applicable, status, severity where applicable, and the stable evidence basis used to produce the row.
- **Expected Warnings/Errors**: The workbench displays only existing comparison statuses, severities, and intentional absence markers; it does not introduce new calculation warnings or errors.
- **Affected Output Adapters**: Existing BSRS configuration, V1/VE, and valuation listings outputs are display sources only; the feature must not write to output-adapter rows or change adapter behavior.

### Key Entities *(include if feature involves data)*

- **Shared-Fact Table Row**: A visible comparison of a selected case fact across existing output slices, including fact label, compared sources, fields, values, status, severity, and stable ordering key.
- **Shared-Value Table Row**: A visible comparison of a selected output value across existing output slices, including value label, compared sources, fields, raw values, normalized values where applicable, status, severity, and stable ordering key.
- **Comparison Source**: The existing output slice or DD-backed mapping evidence that supplied one side of a comparison row.
- **Mocked Display Context**: Simulated case or population labels used only to orient the analyst and explicitly not representing real natural-person data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An analyst can identify the compared sources, fields, values, status, and severity for any shared-facts row within 10 seconds of opening the workbench.
- **SC-002**: An analyst can identify the compared sources, raw values, normalized values where applicable, status, and severity for any shared-values row within 10 seconds of opening the workbench.
- **SC-003**: Repeated loads of the same fixed approved sample produce identical shared-facts and shared-values row order and displayed comparison content in 100% of tested runs.
- **SC-004**: The workbench displays zero real participant, beneficiary, alternate payee, survivor, or other natural-person names or identifiers beyond approved sample identifiers and explicitly mocked labels.
- **SC-005**: Existing BSRS configuration, V1/VE, valuation-listing, and reconciliation outputs remain unchanged after rendering the comparison tables in 100% of regression checks.

## Assumptions

- The fixed approved sample used by the existing workbench remains the initial comparison-table sample for this increment.
- Existing reconciliation evidence already contains enough selected shared-fact and shared-value comparisons to populate the initial tables.
- Mocked case and population labels may be reused from the prior workbench usability increment when person-level context is needed.
- This increment is presentation-only and does not require new schemas, migrations, seeds, output adapters, source ingestion, or persistence behavior.
- Browser-only operation, offline deterministic behavior, and no-server-call boundaries remain unchanged from the existing workbench.
