# Feature Specification: Reconciliation Workbench Usability

**Feature Branch**: `020-reconciliation-workbench-usability`

**Created**: 2026-05-23

**Status**: Draft

**Input**: User description: "Build a reconciliation-workbench usability increment for the PBGC terminated defined-benefit engine. Scope this slice to improving the existing browser workbench page only, using already implemented slices, approved sample artifacts already in the repository, and simulated or mocked person-level case/population data where needed. Do not use any real participant, beneficiary, or other natural-person data. Do not add new business domains or new output adapters. Focus on making the workbench analyst-usable: recognizable sample header, clearly labeled business panels, visible shared-facts and shared-values tables, clickable trace-detail expansion, and a clear fixed-sample label or sample selector backed only by approved artifacts and mocked data. Preserve existing contracts, browser-only sql.js boundaries, and existing slice behavior."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Recognize the Approved Sample (Priority: P1)

An analyst opens the existing reconciliation workbench and immediately understands which approved sample is being reviewed, which mocked case or population context is shown, and that no real natural-person data is present.

**Why this priority**: The workbench is not analyst-usable unless the sample context and privacy boundary are obvious before reviewing outputs.

**Independent Test**: Can be tested by opening the workbench and confirming that the header shows the fixed approved-sample label, mocked case or population identifiers, and a no-real-person-data notice.

**Acceptance Scenarios**:

1. **Given** the analyst opens the workbench, **When** the page is shown, **Then** the header clearly identifies the approved sample, mocked case context, and fixed-sample scope.
2. **Given** mocked person-level labels are shown, **When** the analyst reads the header or sample context, **Then** the page states that the data is simulated or mocked and not real participant, beneficiary, or natural-person data.

---

### User Story 2 - Compare Business Panels and Shared Facts (Priority: P2)

An analyst reviews clearly labeled business panels for BSRS configuration, V1/VE output, valuation listings output, shared facts, and shared values without interpreting technical slice names alone.

**Why this priority**: The existing page needs business-oriented labels and side-by-side evidence so analysts can compare the current deterministic outputs quickly.

**Independent Test**: Can be tested by opening the workbench and confirming that each panel has a business label and that shared-facts and shared-values tables are both visible.

**Acceptance Scenarios**:

1. **Given** the approved sample is loaded, **When** the analyst scans the page, **Then** the BSRS, V1/VE, valuation listings, shared-facts, and shared-values sections are clearly labeled.
2. **Given** shared facts and shared values exist for the sample, **When** the analyst views the workbench, **Then** both tables show agreement-versus-drift status, compared slices, fields, and values.

---

### User Story 3 - Expand Trace Details (Priority: P3)

An analyst expands a reconciliation row to inspect the trace details that explain the comparison basis without leaving the workbench.

**Why this priority**: Analysts need confidence in visible agreement or drift classifications, but trace details should not overwhelm the default view.

**Independent Test**: Can be tested by clicking a trace-detail control for a row and confirming that source artifact, rule version, producing module, mapping basis, and compared evidence become visible.

**Acceptance Scenarios**:

1. **Given** a reconciliation row is visible, **When** the analyst activates its trace-detail expansion, **Then** the row reveals source artifact, rule version, producing module, mapping or fallback basis, and compared evidence.
2. **Given** the analyst collapses the trace detail, **When** the workbench returns to the summary view, **Then** the row status and compared values remain unchanged.

---

### Edge Cases

- The selected approved sample has no drift findings; shared-facts and shared-values tables must still show agreement rows and a clear no-drift message.
- A shared value is nullable or absent by contract; the table must show the accepted nullable status without implying an unexplained failure.
- A mocked person-level label is required for readability; it must be clearly marked as mocked or simulated and must not resemble real natural-person data.
- A trace detail includes a long source path or field name; expanded content must remain readable without overlapping adjacent content.
- A fixed-sample selector has only one available approved sample; the page must label it as fixed or single-sample rather than implying unavailable choices.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST improve only the existing reconciliation workbench page and MUST NOT introduce new business domains or output adapters.
- **FR-002**: System MUST display a recognizable sample header with approved-sample identity, fixed-sample or sample-selector label, mocked case or population context, and a no-real-person-data notice.
- **FR-003**: System MUST use only approved sample artifacts already committed in the repository and simulated or mocked person-level case/population labels where needed.
- **FR-004**: System MUST NOT display, import, infer, or require any real participant, beneficiary, alternate payee, survivor, or other natural-person data.
- **FR-005**: System MUST present BSRS configuration, V1/VE output, and valuation listings output as clearly labeled business panels.
- **FR-006**: System MUST present a visible shared-facts table and a visible shared-values table for the approved sample.
- **FR-007**: System MUST show agreement-versus-drift, warning, nullable, unsupported, or formatting-only status for displayed shared-fact and shared-value rows.
- **FR-008**: System MUST provide clickable trace-detail expansion for reconciliation rows without navigating away from the workbench.
- **FR-009**: System MUST show source artifact, rule version, producing module, mapping or fallback basis, compared slices, compared fields, and compared values within expanded trace details where the underlying deterministic evidence provides them.
- **FR-010**: System MUST preserve existing deterministic output, reconciliation, browser-only, sql.js, and contract behavior.
- **FR-011**: System MUST preserve deterministic ordering and identical displayed content across repeated loads of the same approved sample.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Existing approved sample artifacts already committed in the repository, existing deterministic BSRS configuration output, V1/VE output, valuation listings output, existing cross-slice reconciliation evidence, existing mappings, and mocked labels authored for this feature.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, unreviewed extraction output, runtime network input, hosted services, uncommitted external files, and real natural-person data MUST NOT be read or displayed by the workbench.
- **Source Layer Reads**: Deterministic engine outputs, output adapter rows or display projections, approved sample artifacts, cross-slice reconciliation records, mappings, trace metadata, and mocked display labels already available within committed repository artifacts.
- **Source Layer Writes**: The usability increment is display-only and MUST NOT write source assertions, resolved facts, resolved provisions, engine input packets, deterministic outputs, output adapter rows, or new persistence tables.
- **Traceability Required**: Every expanded reconciliation detail must identify compared slices, fields, values, classification status, mapping or fallback basis, source artifact, rule version, and producing module when available in the deterministic evidence.

### Key Entities *(include if feature involves data)*

- **Workbench Sample Context**: The approved sample identity, fixed-sample or selector label, mocked case/population labels, and no-real-person-data notice shown in the header.
- **Business Output Panel**: A labeled panel for BSRS configuration, V1/VE output, or valuation listings output using business-readable names.
- **Shared-Fact Row**: A displayed cross-slice fact comparison with status, compared slices, compared fields, compared values, and trace metadata.
- **Shared-Value Row**: A displayed value-level reconciliation row with agreement, drift, warning, nullable, unsupported, or formatting-only status.
- **Trace Detail Expansion**: The expanded row content that presents source artifact, rule version, producing module, mapping basis, and compared evidence.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of workbench loads show the approved sample identity, fixed-sample or selector label, mocked context, and no-real-person-data notice in the first visible header area.
- **SC-002**: 100% of the three output panels use business-readable labels for BSRS configuration, V1/VE output, and valuation listings output.
- **SC-003**: A reviewer can see both shared-facts and shared-values tables on the workbench without navigating to another page.
- **SC-004**: 100% of displayed shared-fact and shared-value rows show a status and at least two compared evidence values or an explicit absence/nullable classification.
- **SC-005**: 100% of expandable trace-detail rows reveal source artifact, rule version, producing module, mapping or fallback basis, compared slices, compared fields, and compared values when the row is expanded.
- **SC-006**: Repeated loads of the same approved sample display the same sample header, panel order, row order, statuses, and trace-detail content.
- **SC-007**: Existing deterministic output and reconciliation regression behavior remains unchanged after the usability increment.

## Assumptions

- The first usability increment may use a single fixed approved sample rather than a multi-sample selector.
- Any person-level context needed for readability is mocked or simulated and clearly labeled as such.
- The current workbench data builder and existing cross-slice reconciliation helpers remain the authoritative source for displayed output and reconciliation evidence.
- Trace details can use progressive disclosure as long as all required trace fields are available after expansion.
- The increment changes presentation only and does not add editing, import, export, recalculation, persistence mutation, or new output adapters.
