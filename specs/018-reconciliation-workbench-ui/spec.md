# Feature Specification: Reconciliation Workbench UI

**Feature Branch**: `018-reconciliation-workbench-ui`

**Created**: 2026-05-23

**Status**: Draft

**Input**: User description: "Build a reconciliation-workbench user-interface increment for the PBGC terminated defined-benefit engine. Scope this slice to one visible browser page in the existing web app, using only already implemented slices and approved sample artifacts already in the repository. Do not add new business domains or new output adapters. Focus on a side-by-side reconciliation workbench that loads an approved sample and displays bsrs_configuration_output, v1_ve_output, valuation_listings_output, and cross-slice reconciliation findings in one screen, with clear agreement-versus-drift presentation, traceability details, and deterministic browser-only behavior. Preserve existing contracts, browser-only sql.js boundaries, and existing slice behavior."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Approved Sample Reconciliation (Priority: P1)

A casework reviewer opens one reconciliation workbench screen, loads the approved sample, and sees BSRS configuration, V1/VE, valuation listings, and cross-slice reconciliation results together without switching tools.

**Why this priority**: The main value of the increment is making already implemented deterministic evidence visible and comparable in one place.

**Independent Test**: Can be tested by opening the workbench screen and confirming that the approved sample displays the three output slices and reconciliation status in a single visible view.

**Acceptance Scenarios**:

1. **Given** the reviewer opens the application, **When** the reconciliation workbench is shown, **Then** the approved sample is available and the screen displays BSRS configuration, V1/VE, valuation listings, and reconciliation findings together.
2. **Given** the approved sample has selected shared values that agree, **When** the reviewer inspects the workbench, **Then** those values are presented as agreements rather than drift.

---

### User Story 2 - Inspect Agreement, Drift, and Trace Details (Priority: P2)

A reviewer needs to understand why a compared value agrees or drifts, including which output slices, fields, values, basis, source artifact, rule version, and producing module support the result.

**Why this priority**: A visible finding is not enough for review; the reviewer must be able to trace the comparison back to the reviewed deterministic evidence.

**Independent Test**: Can be tested by selecting or inspecting a reconciliation row and confirming that agreement-versus-drift status and traceability details are visible.

**Acceptance Scenarios**:

1. **Given** a selected shared value has a reconciliation result, **When** the reviewer inspects that result, **Then** the screen shows compared slices, compared fields, compared values, normalized values when available, mapping or fallback basis, rule version, and producing module.
2. **Given** a comparison is classified as drift or warning, **When** the reviewer inspects the finding, **Then** the screen clearly distinguishes the severity from accepted agreements.

---

### User Story 3 - Preserve Deterministic Browser Behavior (Priority: P3)

A reviewer needs the workbench to remain a display layer over existing approved artifacts and deterministic outputs, without changing current calculations, persistence behavior, or output contracts.

**Why this priority**: The workbench is a review surface, not a new calculation domain or output adapter.

**Independent Test**: Can be tested by repeatedly loading the same approved sample and confirming the visible data, ordering, statuses, and trace details remain identical while existing slice regression behavior is unchanged.

**Acceptance Scenarios**:

1. **Given** the same approved sample is loaded repeatedly, **When** the reviewer views the workbench each time, **Then** displayed rows, statuses, and trace details appear in the same order with the same values.
2. **Given** the workbench is present, **When** existing output slice behavior is verified, **Then** BSRS configuration, V1/VE, valuation listings, and cross-slice reconciliation contracts remain unchanged.

---

### Edge Cases

- The approved sample produces no drift findings; the screen must still show agreement rows and an empty-state for drift.
- A selected shared value is absent or nullable in one output slice; the screen must show the classification without treating it as an unexplained failure.
- A finding references an approved fallback name instead of a Data Dictionary field; the screen must show the fallback basis clearly.
- A long field name, source path, or trace value must remain readable without hiding adjacent comparison data.
- Repeated loading of the same approved sample must not reorder rows or change displayed status labels.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide one visible reconciliation workbench screen in the existing application.
- **FR-002**: System MUST load only approved sample artifacts and already implemented deterministic slice outputs for the workbench.
- **FR-003**: System MUST display BSRS configuration output, V1/VE output, valuation listings output, and cross-slice reconciliation results in one screen.
- **FR-004**: System MUST present selected shared values with clear agreement-versus-drift status.
- **FR-005**: System MUST display severity for reconciliation warnings or drift findings.
- **FR-006**: System MUST display traceability details for each shown comparison or finding, including compared slices, fields, values, basis, source artifact, rule version, and producing module.
- **FR-007**: System MUST distinguish DD-backed field basis from approved no-DD fallback basis where shown.
- **FR-008**: System MUST preserve deterministic ordering and identical displayed content across repeated loads of the same approved sample.
- **FR-009**: System MUST NOT add new business domains, new output adapters, new deterministic calculation rules, server calls, hosted services, raw source-document reads, raw OCR reads, or unreviewed-input reads.
- **FR-010**: System MUST preserve existing BSRS configuration, V1/VE, valuation listings, cross-slice reconciliation, browser-only persistence, and slice contract behavior.
- **FR-011**: System MUST provide readable side-by-side presentation on typical desktop and mobile browser viewports without overlapping values, labels, or trace details.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Approved sample artifacts already committed in the repository, current deterministic outputs from already implemented slices, current cross-slice reconciliation records and findings, existing mappings, and existing trace metadata.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, unreviewed extraction output, hosted services, runtime network input, and uncommitted external workbooks or documents MUST NOT be read by deterministic engine modules or the workbench.
- **Source Layer Reads**: Deterministic engine outputs, output adapter rows, approved sample artifacts, cross-slice reconciliation records, mappings, and trace metadata already available within the committed application package.
- **Source Layer Writes**: The workbench is display-only and MUST NOT write source assertions, resolved facts, resolved provisions, engine input packets, deterministic outputs, output adapter rows, or new persistence tables.
- **Traceability Required**: Every visible comparison or finding must identify compared slices, fields, displayed values, classification status, mapping or fallback basis, source artifact, rule version, and producing module when that information exists in the underlying deterministic evidence.

### Key Entities *(include if feature involves data)*

- **Approved Sample Selection**: The reviewed sample artifact used to populate the workbench; includes sample identity and deterministic source context.
- **Output Slice Panel**: A visible grouping for BSRS configuration, V1/VE, or valuation listings fields and values from the approved sample.
- **Reconciliation Row**: A displayed comparison of selected shared values with agreement, drift, warning, nullable, unsupported, or formatting-only status.
- **Trace Detail**: The displayed basis for a comparison or finding, including source artifact, mapping basis, rule version, and producing module.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reviewer can open the workbench and see the approved sample's three output slice panels and reconciliation results on one screen without navigating to another page.
- **SC-002**: 100% of displayed reconciliation rows show an agreement, drift, warning, nullable, unsupported, or formatting-only status.
- **SC-003**: 100% of displayed warning or drift findings show compared slices, compared fields, compared values, severity, source artifact, rule version, and producing module.
- **SC-004**: Repeated loads of the same approved sample display rows, statuses, and trace details in identical order with identical values.
- **SC-005**: Existing deterministic output and reconciliation regression behavior remains unchanged after adding the workbench.
- **SC-006**: On desktop and mobile viewports, no displayed output value, status label, or trace detail overlaps another visible element.

## Assumptions

- The first workbench increment uses a single approved sample already committed in the repository.
- The workbench is display-only and does not introduce editing, import, export, persistence mutation, or case selection beyond the approved sample.
- Existing deterministic slice outputs and cross-slice reconciliation helpers are authoritative for displayed values and statuses.
- The screen may use concise labels and progressive detail disclosure as long as all required comparison and trace data remains available in the visible workbench experience.
