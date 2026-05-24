# Feature Specification: Reconciliation Workbench Severity Filtering

**Feature Branch**: `025-reconciliation-workbench-severity-filtering`

**Created**: 2026-05-24

**Status**: Draft

**Input**: User description: "Build a reconciliation-workbench severity-filtering increment for the PBGC terminated defined-benefit engine. Scope this slice to improving the existing browser reconciliation workbench page only, using already implemented slices, approved sample artifacts already in the repository, and simulated or mocked person-level case or population data where needed. Do not use any real participant, beneficiary, or other natural-person data. Do not add new business domains or new output adapters. Focus on analyst-usable severity filtering in the existing workbench for reconciliation rows, Shared Facts rows, and Shared Values rows, so the analyst can filter visible rows by severity where applicable, combine severity filtering with the existing status filtering, preserve deterministic ordering and clear/reset behavior, and preserve sample selection, sample header, output panels, trace expansion, browser-only sql.js boundaries, and existing slice behavior."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Filter Rows by Severity (Priority: P1)

As a casework analyst reviewing a selected approved sample, I want to filter reconciliation rows, Shared Facts rows, and Shared Values rows by existing severity values where severity applies so I can focus on information, warning, or error-level review items without leaving the workbench.

**Why this priority**: Severity filtering is the primary value for this slice and builds directly on the existing workbench and status-filtering behavior.

**Independent Test**: Can be fully tested by loading an approved sample, selecting each available severity filter, and confirming applicable visible rows have the selected severity while row groups with no matching rows show deterministic empty states.

**Acceptance Scenarios**:

1. **Given** the workbench is showing an approved sample, **When** the analyst filters by an available severity value, **Then** applicable reconciliation rows, Shared Facts rows, and Shared Values rows show only rows matching that severity or a clear empty state.
2. **Given** a severity filter is active, **When** the analyst clears the severity filter, **Then** all rows allowed by the current status filter return in their original deterministic order.

---

### User Story 2 - Combine Severity and Status Filters (Priority: P2)

As a casework analyst triaging review items, I want severity filtering to combine with the existing status filter so I can narrow visible rows to a specific status and severity without changing the selected approved sample or output panels.

**Why this priority**: Combined filtering is needed for practical review workflows, but it depends on the severity filter model existing first.

**Independent Test**: Can be tested by applying a status filter and a severity filter together and confirming every visible applicable row satisfies both filters or shows a deterministic row-group empty state.

**Acceptance Scenarios**:

1. **Given** a status filter is active, **When** the analyst applies a severity filter, **Then** visible applicable rows satisfy both the selected status and selected severity.
2. **Given** both filters are active, **When** the analyst clears one filter, **Then** the remaining filter still applies and row ordering remains deterministic.

---

### User Story 3 - Preserve Workbench Context While Severity Filtering (Priority: P3)

As an analyst using the existing workbench, I want severity filtering to preserve approved-sample selection, sample header, output panels, trace expansion behavior, deterministic ordering, and no-real-person-data boundaries so filtering remains a display-only review aid.

**Why this priority**: The slice must not change existing calculation, output adapter, persistence, sample selector, or traceability behavior.

**Independent Test**: Can be tested by applying, combining, and clearing severity filters across approved samples and confirming sample context, output panels, trace details, row ordering, and display-only boundaries remain stable.

**Acceptance Scenarios**:

1. **Given** visible rows have trace expansion controls, **When** severity filters are applied or cleared, **Then** trace expansion controls and trace content remain deterministic for visible rows.
2. **Given** severity filtering is active, **When** the selected approved sample changes, **Then** the workbench displays rows from the new approved sample using the same deterministic and approved-only boundaries.

### Edge Cases

- If a selected severity matches no rows in a row group, the workbench displays a deterministic empty-state message for that group without removing the sample header or output panels.
- If a row has a status but no applicable severity, severity filtering follows the existing none/not-applicable convention rather than inventing a new severity value.
- If both status and severity filters are active, visible applicable rows must satisfy both filters.
- If severity filtering is cleared while a status filter remains active, the visible row set returns to the status-filtered deterministic order.
- If an approved sample exposes a different severity set, severity choices remain deterministic and do not expose raw, hosted, uploaded, or real-person data.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The workbench MUST provide visible severity filter controls on the existing reconciliation workbench page where severity applies.
- **FR-002**: The workbench MUST derive severity filter choices only from existing row severity values and existing none/not-applicable conventions for the selected approved sample.
- **FR-003**: Applying a severity filter MUST update visible reconciliation rows, Shared Facts rows, and Shared Values rows without changing approved sample selection, sample header, output panels, or underlying row evidence.
- **FR-004**: Shared Facts rows MUST preserve their existing none/error severity convention and MUST NOT introduce invented severity names.
- **FR-005**: If both status and severity filters are active, visible applicable rows MUST satisfy both selected filters.
- **FR-006**: Clearing the severity filter MUST restore rows allowed by the current status filter in the same deterministic ordering as before severity filtering.
- **FR-007**: The workbench MUST display a clear deterministic empty-state message for each row group when no rows match the active severity and status filters.
- **FR-008**: Severity filtering MUST preserve clickable trace-detail expansion for visible reconciliation rows, Shared Facts rows, and Shared Values rows.
- **FR-009**: Severity filtering MUST remain display-only and MUST NOT create new business domains, new output adapters, new persistence responsibilities, or lower source-layer writes.
- **FR-010**: Severity filtering MUST use only existing approved sample artifacts, deterministic workbench rows, and simulated or mocked context, and MUST NOT use real participant, beneficiary, alternate payee, survivor, or other natural-person data.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Approved sample artifacts already committed in the repository, existing deterministic workbench rows, existing row status and severity values, existing output adapter display sources, existing DD-backed mappings, and simulated or mocked case/population context.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, unreviewed extraction output, real natural-person data, hosted samples, uploads, URL-loaded samples, and ad hoc analyst-entered sample data MUST NOT be read by severity filtering behavior.
- **Source Layer Reads**: Deterministic engine outputs, output adapter display sources, cross-slice reconciliation display rows, trace-detail display rows, approved sample artifacts, and mocked display context already accepted by prior workbench slices.
- **Source Layer Writes**: No new lower source-layer writes. This slice may update only display filter state, deterministic render evidence, regression evidence, and existing static build artifacts where current repository delivery rules require them.
- **Traceability Required**: Active severity filter, active status filter, selected sample identity, row status, row severity or none/not-applicable convention, output panel source, comparison row source fields, mapping basis, rule version, producing module, and trace-detail row identity must remain traceable in display state or regression evidence.
- **Expected Warnings/Errors**: Severity filtering may display only deterministic row-group empty states and existing row statuses/severities; it MUST NOT introduce new structured engine warnings or errors.
- **Affected Output Adapters**: Severity filtering may read only existing BSRS, V1/VE, and valuation listings display sources; it MUST NOT write adapter rows or add adapter responsibilities.

### Key Entities *(include if feature involves data)*

- **Severity Filter State**: The active severity filter choice, including the unfiltered state and existing severity/none conventions.
- **Status Filter State**: The existing active status filter choice that may combine with severity filtering.
- **Severity Filter Option**: A deterministic visible choice derived from selected sample rows, including row count and stable ordering.
- **Filtered Workbench Row Group**: A visible subset of reconciliation rows, Shared Facts rows, or Shared Values rows derived from the selected approved sample and active filters.
- **Filter Empty State**: A deterministic row-group message shown when active filters match no rows.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An analyst can identify and apply a severity filter to the workbench in under 10 seconds.
- **SC-002**: For each supported severity filter, 100% of visible applicable reconciliation, Shared Facts, and Shared Values rows have the selected severity or the row group shows a clear empty state.
- **SC-003**: When status and severity filters are combined, 100% of visible applicable rows satisfy both filters or the row group shows a clear empty state.
- **SC-004**: Clearing severity filtering restores the expected row counts and deterministic ordering for the current status filter in at least two repeated runs.
- **SC-005**: Severity filtering preserves the approved-sample selector, sample header, three output panels, existing status filter, and trace expansion controls for visible rows.
- **SC-006**: No real participant, beneficiary, alternate payee, survivor, or other natural-person data appears in severity controls, empty states, output panels, comparison tables, or trace details.

## Assumptions

- Severity filtering operates on the existing workbench display rows and does not modify calculation, reconciliation, or output adapter behavior.
- Severity filter choices are derived from existing row severity values and none/not-applicable conventions for the selected approved sample, plus an unfiltered choice.
- Status filtering already exists and remains the companion filter for combined filtering behavior.
- Severity filtering applies only where rows already expose severity or none/not-applicable severity conventions.
- Approved sample selection remains the source of row data; filters only change which rows are visible.
- Browser-only behavior, offline review, and existing persistence boundaries remain unchanged.
