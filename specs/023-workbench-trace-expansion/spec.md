# Feature Specification: Reconciliation Workbench Trace Expansion

**Feature Branch**: `022-reconciliation-workbench-trace-expansion`

**Created**: 2026-05-24

**Status**: Draft

**Input**: User description: "Build a reconciliation-workbench trace-expansion increment for the PBGC terminated defined-benefit engine. Scope this slice to improving the existing browser reconciliation workbench page only, using already implemented slices, approved sample artifacts already in the repository, and simulated or mocked person-level case or population data where needed. Do not use any real participant, beneficiary, or other natural-person data. Do not add new business domains or new output adapters. Focus on clickable trace-detail expansion in the existing workbench for reconciliation rows, shared-facts rows, and shared-values rows, showing analyst-readable traceability details such as compared sources, source fields, mapping basis, raw versus normalized value context where applicable, and stable deterministic expansion behavior. Preserve existing contracts, browser-only sql.js boundaries, and existing slice behavior."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Expand Trace Details (Priority: P1)

An analyst reviewing the existing reconciliation workbench can click or otherwise activate a trace control on reconciliation rows, Shared Facts rows, and Shared Values rows to see analyst-readable trace details for that row without leaving the page.

**Why this priority**: Trace expansion is the core value of this increment. It lets analysts connect visible agreement or drift back to compared sources, source fields, mapping basis, and value context while preserving the existing workbench.

**Independent Test**: Load the fixed approved sample, activate trace detail expansion for one reconciliation row, one Shared Facts row, and one Shared Values row, and confirm each expanded detail shows compared sources, source fields, mapping basis where applicable, raw versus normalized value context where applicable, and trace identifiers.

**Acceptance Scenarios**:

1. **Given** the existing workbench is loaded for the fixed approved sample, **When** the analyst expands trace details for a reconciliation row, **Then** the row shows analyst-readable compared sources, source fields, compared values, status, severity, rule version, and producing module.
2. **Given** a Shared Facts row is visible, **When** the analyst expands its trace details, **Then** the row shows compared sources, source fields, raw values, mapping basis, source paths, rule version, and producing module.
3. **Given** a Shared Values row is visible, **When** the analyst expands its trace details, **Then** the row shows compared sources, source fields, raw values, normalized values where applicable, mapping basis, normalization basis, rule version, and producing module.

---

### User Story 2 - Preserve Deterministic Expansion Behavior (Priority: P2)

An analyst can expand and collapse trace details repeatedly and receive the same details, ordering, labels, and row identity every time for the fixed approved sample.

**Why this priority**: Trace controls must not create nondeterministic review evidence or unstable display output.

**Independent Test**: Expand, collapse, and re-expand the same trace rows across repeated loads of the fixed approved sample and confirm the expansion labels, row ordering, detail content, and selected expansion states are deterministic.

**Acceptance Scenarios**:

1. **Given** the same fixed approved sample is loaded repeatedly, **When** the analyst expands trace details for the same row, **Then** the displayed trace content remains identical.
2. **Given** multiple trace rows are visible, **When** the analyst expands them in different orders, **Then** row ordering and row identities remain stable.

---

### User Story 3 - Preserve Workbench Boundaries (Priority: P3)

An analyst can inspect expanded trace details without exposing real natural-person data, changing output rows, adding adapters, or reading disallowed source layers.

**Why this priority**: The increment must remain a display-only improvement over approved deterministic evidence and mocked context.

**Independent Test**: Render and expand trace details for reconciliation, Shared Facts, and Shared Values rows, then confirm output panels, row counts, existing classifications, approved sample labels, and no-real-person-data boundaries remain unchanged.

**Acceptance Scenarios**:

1. **Given** trace details are expanded, **When** the analyst reviews the workbench, **Then** no real participant, beneficiary, alternate payee, survivor, or other natural-person data is displayed.
2. **Given** trace details are expanded or collapsed, **When** the workbench is rebuilt for the fixed approved sample, **Then** deterministic output rows, Shared Facts rows, Shared Values rows, and existing reconciliation rows are not mutated.

### Edge Cases

- A row may have no normalized value context; the expanded trace detail must show an intentional absence marker instead of an empty or misleading value.
- A row may use an approved fallback mapping rather than a DD-backed mapping; the expanded detail must show the mapping basis clearly.
- Long source names, field names, source paths, rule names, raw values, normalized values, or trace labels must remain readable without hiding status or severity at desktop 1440x900 and mobile 390x844 viewports.
- Expanding one row must not reorder rows, change row identities, or alter other row classifications.
- Repeated loads of the fixed approved sample must show identical trace-detail text for the same row.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The workbench MUST provide a visible trace-detail expansion control for reconciliation rows, Shared Facts rows, and Shared Values rows.
- **FR-002**: Expanded trace details MUST show compared sources, source fields, compared values, status, severity where applicable, rule version, and producing module for reconciliation rows.
- **FR-003**: Expanded trace details MUST show compared sources, source fields, raw values, mapping basis, source paths, rule version, and producing module for Shared Facts rows.
- **FR-004**: Expanded trace details MUST show compared sources, source fields, raw values, normalized values where applicable, mapping basis, normalization basis where applicable, rule version, and producing module for Shared Values rows.
- **FR-005**: Trace details MUST use stable row identities and deterministic ordering across repeated loads of the same fixed approved sample.
- **FR-006**: Trace expansion MUST preserve existing reconciliation status, severity, output panels, Shared Facts table, Shared Values table, and row content while adding expanded details.
- **FR-007**: Trace details MUST display intentional absence markers for non-applicable normalized values, severities, or trace fields instead of blank or misleading values.
- **FR-008**: Trace details MUST use only approved sample artifacts, existing deterministic outputs, existing reconciliation evidence, DD-backed mappings where available, approved fallback mappings where no DD field exists, and explicitly mocked or simulated display context.
- **FR-009**: The feature MUST NOT display real participant, beneficiary, alternate payee, survivor, or other natural-person data.
- **FR-010**: The feature MUST NOT add a new business domain, output adapter, persistence workflow, source ingestion workflow, or case-selection workflow.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Approved sample artifacts already committed in the repository; existing deterministic BSRS configuration output evidence; existing deterministic V1/VE output evidence; existing deterministic valuation-listing output evidence; existing reconciliation, Shared Facts, and Shared Values records; existing DD-backed and approved-fallback mapping metadata; mocked or simulated display labels authored in committed repository files.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, unreviewed extraction output, hosted services, runtime network input, uncommitted external files, and real natural-person data MUST NOT be read or displayed.
- **Source Layer Reads**: Deterministic outputs and output-adapter evidence already produced by existing slices, plus approved committed sample artifacts, reconciliation evidence, Shared Facts evidence, Shared Values evidence, and mapping metadata.
- **Source Layer Writes**: Display-only workbench state and deterministic rendered presentation for the existing page; no lower source-layer writes and no new output-adapter rows.
- **Traceability Required**: Every expanded trace detail must identify the compared source slices, compared fields, raw values, normalized values where applicable, status, severity where applicable, mapping basis, source paths where available, rule version, producing module, and stable evidence basis.
- **Expected Warnings/Errors**: The workbench displays only existing statuses, severities, and intentional absence markers; it does not introduce new calculation warnings or errors.
- **Affected Output Adapters**: Existing BSRS configuration, V1/VE, and valuation listings outputs are display sources only; the feature must not write to output-adapter rows or change adapter behavior.

### Key Entities *(include if feature involves data)*

- **Trace Detail Expansion**: A visible row-level detail panel or disclosure state that shows traceability details for one reconciliation, Shared Facts, or Shared Values row.
- **Trace Detail Row**: The analyst-readable trace fields for one expanded row, including compared sources, compared fields, values, mapping basis, rule version, producing module, and stable evidence references.
- **Expansion Control**: The user-facing row control used to expand or collapse trace details while preserving row identity and deterministic ordering.
- **Mocked Display Context**: Simulated case or population labels used only to orient the analyst and explicitly not representing real natural-person data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An analyst can expand trace details for a reconciliation row, Shared Facts row, and Shared Values row within 10 seconds of opening the workbench.
- **SC-002**: Every expanded trace detail shows compared sources, source fields, rule version, and producing module in 100% of tested rows.
- **SC-003**: Every expanded Shared Values trace detail shows raw values and normalized values or intentional absence markers in 100% of tested rows.
- **SC-004**: Repeated loads of the same fixed approved sample produce identical expanded trace-detail content for the same row in 100% of tested runs.
- **SC-005**: Existing output panels, Shared Facts rows, Shared Values rows, and reconciliation classifications remain unchanged after trace details are expanded or collapsed in 100% of regression checks.
- **SC-006**: The workbench displays zero real participant, beneficiary, alternate payee, survivor, or other natural-person names or identifiers beyond approved sample identifiers and explicitly mocked labels.

## Assumptions

- The fixed approved sample used by the existing workbench remains the initial trace-expansion sample for this increment.
- Existing reconciliation, Shared Facts, and Shared Values records already contain enough trace metadata to populate the initial expanded details.
- Mocked case and population labels may be reused from prior workbench increments when person-level context is needed.
- This increment is presentation-only and does not require new schemas, migrations, seeds, output adapters, source ingestion, or persistence behavior.
- Browser-only operation, offline deterministic behavior, and no-server-call boundaries remain unchanged from the existing workbench.
