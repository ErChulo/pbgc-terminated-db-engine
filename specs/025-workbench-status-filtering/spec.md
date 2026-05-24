# Feature Specification: Reconciliation Workbench Status Filtering

**Feature Branch**: `024-reconciliation-workbench-status-filtering`

**Created**: 2026-05-24

**Status**: Draft

**Input**: User description: "Build a reconciliation-workbench status-filtering increment for the PBGC terminated defined-benefit engine. Scope this slice to improving the existing browser reconciliation workbench page only, using already implemented slices, approved sample artifacts already in the repository, and simulated or mocked person-level case or population data where needed. Do not use any real participant, beneficiary, or other natural-person data. Do not add new business domains or new output adapters. Focus on analyst-usable status filtering in the existing workbench for reconciliation rows, Shared Facts rows, and Shared Values rows, so the analyst can filter visible rows by reconciliation status and severity where applicable while preserving approved-sample selection, sample header, output panels, trace expansion behavior, deterministic ordering, browser-only sql.js boundaries, and existing slice behavior."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Filter Rows by Status (Priority: P1)

As a casework analyst reviewing a selected approved sample, I want to filter reconciliation, Shared Facts, and Shared Values rows by reconciliation status so I can focus on agreements, drift, warnings, nullable rows, unsupported rows, or formatting-only rows without losing the surrounding workbench context.

**Why this priority**: Status filtering is the core analyst workflow for this slice and gives immediate value while preserving the current sample selector, output panels, and trace details.

**Independent Test**: Can be fully tested by loading an approved sample in the workbench, choosing a status filter, and confirming all three row groups show only rows with the selected status while retaining deterministic row order and visible active filter state.

**Acceptance Scenarios**:

1. **Given** the workbench is showing an approved sample, **When** the analyst filters by a reconciliation status that exists in one or more row groups, **Then** only rows with that status remain visible in reconciliation rows, Shared Facts rows, and Shared Values rows.
2. **Given** a status filter is active, **When** the analyst clears the filter, **Then** all previously visible rows return in their original deterministic order.

---

### User Story 2 - Filter Rows by Severity (Priority: P2)

As a casework analyst reviewing exceptions, I want to filter rows by severity where severity applies so I can focus on informational, warning, or error-level reconciliation items without changing the selected sample or output panels.

**Why this priority**: Severity filtering helps analysts triage exceptions after status filtering exists, but it depends on the same visible row filtering model.

**Independent Test**: Can be tested by applying each available severity filter and confirming rows with severity labels are filtered accordingly while rows without applicable severity are handled by the existing absence/none conventions.

**Acceptance Scenarios**:

1. **Given** Shared Values or reconciliation rows include severity labels, **When** the analyst filters by a severity, **Then** only applicable rows with that severity remain visible in those row groups.
2. **Given** Shared Facts rows use a none/error severity convention, **When** the analyst filters by severity, **Then** Shared Facts rows follow that convention rather than inventing a new severity value.

---

### User Story 3 - Preserve Workbench Context While Filtering (Priority: P3)

As an analyst using the existing workbench, I want filtering to preserve approved-sample selection, the sample header, output panels, trace expansion behavior, and deterministic ordering so filtering remains a display-only review aid.

**Why this priority**: Filtering must not change existing slice behavior, output adapter behavior, sample state, or traceability.

**Independent Test**: Can be tested by applying and clearing filters across approved samples and confirming the sample selector, sample header, output panels, trace details, row order within filtered results, and no-real-person-data boundary remain stable.

**Acceptance Scenarios**:

1. **Given** a selected approved sample and expanded trace details, **When** the analyst applies or clears filters, **Then** trace expansion controls remain available for visible rows and trace content remains deterministic.
2. **Given** filters are applied after sample selection, **When** the selected approved sample changes, **Then** the workbench displays rows from the new sample using the same approved-only and deterministic display boundaries.

### Edge Cases

- If a selected filter matches no rows, the workbench displays a clear empty-state message for the affected row group without removing the sample header or output panels.
- If a row has a status but no applicable severity, severity filtering follows the existing none/not-applicable convention instead of creating a silent fallback.
- If both status and severity filters are active, visible rows must satisfy both filters where severity applies.
- If filters are cleared, row counts and ordering return to the selected sample's unfiltered deterministic state.
- If an approved sample has different available statuses or severities, filter choices remain deterministic and do not expose raw, hosted, uploaded, or real-person data.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The workbench MUST provide visible status filter controls for reconciliation rows, Shared Facts rows, and Shared Values rows on the existing reconciliation workbench page.
- **FR-002**: The workbench MUST support filtering by the reconciliation status values already emitted by existing rows, including agreement, drift, warning, nullable, unsupported, and formatting-only where present.
- **FR-003**: The workbench MUST provide visible severity filter controls where severity applies and MUST use existing severity or none/not-applicable conventions rather than inventing new severity values.
- **FR-004**: Applying a status filter MUST update visible reconciliation rows, Shared Facts rows, and Shared Values rows without changing approved sample selection, sample header, output panels, or underlying row evidence.
- **FR-005**: Applying a severity filter MUST update visible rows with applicable severity fields without changing approved sample selection, sample header, output panels, or underlying row evidence.
- **FR-006**: If both status and severity filters are active, visible rows MUST satisfy both filters where severity applies.
- **FR-007**: Clearing filters MUST restore all rows for the selected approved sample in the same deterministic ordering as before filtering.
- **FR-008**: The workbench MUST display a clear empty-state message for each filtered row group when no rows match the active filters.
- **FR-009**: Filtering MUST preserve clickable trace-detail expansion for visible reconciliation rows, Shared Facts rows, and Shared Values rows.
- **FR-010**: Filtering MUST remain display-only and MUST NOT create new business domains, new output adapters, new persistence responsibilities, or lower source-layer writes.
- **FR-011**: Filtering MUST use only existing approved sample artifacts, deterministic workbench rows, and simulated or mocked context, and MUST NOT use real participant, beneficiary, alternate payee, survivor, or other natural-person data.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Approved sample artifacts already committed in the repository, existing deterministic workbench rows, existing output adapter display sources, existing DD-backed mappings, and simulated or mocked case/population context.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, unreviewed extraction output, real natural-person data, hosted samples, uploads, URL-loaded samples, and ad hoc analyst-entered sample data MUST NOT be read by filtering behavior.
- **Source Layer Reads**: Deterministic engine outputs, output adapter display sources, cross-slice reconciliation display rows, trace-detail display rows, approved sample artifacts, and mocked display context already accepted by prior workbench slices.
- **Source Layer Writes**: No new lower source-layer writes. This slice may update only display filter state, deterministic render evidence, regression evidence, and existing static build artifacts where current repository delivery rules require them.
- **Traceability Required**: Active filters, selected sample identity, row status, row severity where applicable, output panel source, comparison row source fields, mapping basis, rule version, producing module, and trace-detail row identity must remain traceable in display state or regression evidence.

### Key Entities *(include if feature involves data)*

- **Status Filter State**: The active status filter choice, including the unfiltered state and supported row status values.
- **Severity Filter State**: The active severity filter choice, including the unfiltered state and existing severity/none conventions.
- **Filtered Workbench Row Group**: A visible subset of reconciliation rows, Shared Facts rows, or Shared Values rows derived from the selected approved sample and active filters.
- **Filter Empty State**: A deterministic row-group message shown when active filters match no rows.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An analyst can identify and apply a status filter to the workbench in under 10 seconds.
- **SC-002**: For each supported status filter, 100% of visible reconciliation, Shared Facts, and Shared Values rows have the selected status or the row group shows a clear empty state.
- **SC-003**: For each supported severity filter, 100% of visible rows with applicable severity have the selected severity or the row group shows a clear empty state.
- **SC-004**: Clearing filters restores the selected sample's unfiltered row counts and ordering across all row groups in at least two repeated runs.
- **SC-005**: Filtering preserves the approved-sample selector, sample header, three output panels, and trace expansion controls for visible rows.
- **SC-006**: No real participant, beneficiary, alternate payee, survivor, or other natural-person data appears in filter controls, empty states, output panels, comparison tables, or trace details.

## Assumptions

- Filtering operates on the existing workbench display rows and does not modify calculation, reconciliation, or output adapter behavior.
- The initial status and severity filter choices are derived from existing row values for the selected approved sample, plus an unfiltered choice.
- Severity filtering applies only where rows already expose severity or none/not-applicable severity conventions.
- Approved sample selection remains the source of row data; filters only change which rows are visible.
- Browser-only behavior, offline review, and existing persistence boundaries remain unchanged.
