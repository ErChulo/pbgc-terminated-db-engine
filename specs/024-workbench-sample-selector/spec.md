# Feature Specification: Reconciliation Workbench Sample Selector

**Feature Branch**: `023-reconciliation-workbench-sample-selector`

**Created**: 2026-05-24

**Status**: Draft

**Input**: User description: "Build a reconciliation-workbench sample-selector increment for the PBGC terminated defined-benefit engine. Scope this slice to improving the existing browser reconciliation workbench page only, using already implemented slices, approved sample artifacts already in the repository, and simulated or mocked person-level case or population data where needed. Do not use any real participant, beneficiary, or other natural-person data. Do not add new business domains or new output adapters. Focus on a clear fixed-sample selector or sample picker in the existing workbench that lets the analyst switch among approved artifacts only, updates the sample header and displayed outputs deterministically, preserves shared-facts and shared-values tables plus trace expansion behavior, and keeps stable browser-only behavior. Preserve existing contracts, browser-only sql.js boundaries, and existing slice behavior."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Switch Approved Samples (Priority: P1)

As a casework analyst reviewing reconciliation behavior, I want a clear sample selector on the existing workbench so I can identify the active approved sample and, when another supported approved sample exists, switch to it and immediately see the header, output panels, comparison tables, and trace details for the selected sample.

**Why this priority**: The selector is the core value of this slice; without it the workbench remains tied to one fixed sample and cannot support analyst comparison across approved artifacts.

**Independent Test**: Can be fully tested by opening the workbench and confirming the fixed approved sample is identifiable; if at least two supported approved samples exist, select another approved sample and confirm the visible header, output panels, Shared Facts table, Shared Values table, reconciliation rows, and trace expansions all reflect the selected approved sample.

**Acceptance Scenarios**:

1. **Given** the workbench is loaded with the default approved sample, **When** at least two supported approved samples exist and the analyst selects another approved sample, **Then** the visible sample label, mocked case/population context, output panels, shared-facts rows, shared-values rows, reconciliation rows, and trace details update to the selected sample.
2. **Given** the analyst has switched samples, **When** the same sample is selected again in a repeated load, **Then** the displayed rows, statuses, severities, ordering, and trace-detail content are identical.

---

### User Story 2 - Restrict Choices to Approved Artifacts (Priority: P2)

As a reviewer responsible for deterministic evidence boundaries, I want the selector to offer only approved sample artifacts so that the workbench cannot load raw, unreviewed, hosted, or real-person data.

**Why this priority**: The project boundary requires approved reviewed inputs only; selection must not become a back door to unsupported source layers.

**Independent Test**: Can be tested by inspecting the selector choices and attempting the available selection flow, confirming every option is backed by an approved repository artifact and no free-form file, URL, upload, or raw-document input is available.

**Acceptance Scenarios**:

1. **Given** the selector is visible, **When** the analyst reviews the options, **Then** every option clearly names an approved sample artifact or approved mocked sample context.
2. **Given** the analyst interacts with the selector, **When** no approved option exists for a requested sample, **Then** the workbench keeps the current selected sample and displays no raw-source, upload, URL, or free-form input path.

---

### User Story 3 - Preserve Existing Workbench Behavior (Priority: P3)

As an analyst using existing reconciliation views, I want sample switching to preserve the current output panels, Shared Facts table, Shared Values table, and trace expansion behavior so that the selector improves navigation without changing reconciliation semantics.

**Why this priority**: The slice must improve the existing page only and must not alter already-implemented output adapter behavior or cross-slice reconciliation semantics.

**Independent Test**: Can be tested by switching among approved samples and confirming existing table columns, status labels, severity labels, row ordering rules, trace expansion controls, and output panel structures remain present and deterministic.

**Acceptance Scenarios**:

1. **Given** the workbench supports trace expansion, **When** the analyst switches samples and opens a trace detail, **Then** the expanded detail remains analyst-readable and includes compared sources, source fields, mapping basis, and raw/normalized value context where applicable.
2. **Given** the analyst switches between approved samples, **When** the workbench refreshes the displayed data, **Then** no new output adapter, persistence write, or lower source-layer write is introduced.

### Edge Cases

- If only one approved sample is available, the control still clearly labels the fixed selected sample and does not imply unsupported choices.
- If an approved sample lacks a value that another sample contains, the workbench displays the existing absence, nullable, warning, unsupported, or formatting-only status conventions rather than inventing a fallback.
- If the analyst selects the already active sample, the visible state remains stable and no duplicate rows or trace controls are added.
- If a sample has long labels or long trace evidence, the selector and updated header remain readable at standard desktop and mobile review sizes.
- If an approved sample is allowed in the selector but lacks required workbench evidence, the workbench displays existing structured warning/error conventions for that sample and does not load raw or lower source-layer material.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The workbench MUST present a clear fixed-sample selector or sample picker within the existing reconciliation workbench page.
- **FR-002**: The selector MUST include only approved sample artifacts or approved mocked sample contexts already present in the repository.
- **FR-003**: Selecting an approved sample MUST update the sample header, selected-sample label, mocked case/population context, output panels, Shared Facts table, Shared Values table, reconciliation rows, and trace-detail content for that sample.
- **FR-004**: The workbench MUST preserve the existing output panel areas for BSRS configuration, V1/VE output, and valuation listings output without adding new output adapters.
- **FR-005**: The workbench MUST preserve Shared Facts and Shared Values table columns that show compared sources, compared fields, values, statuses, severities where applicable, and traceability cues.
- **FR-006**: The workbench MUST preserve clickable trace-detail expansion for reconciliation rows, Shared Facts rows, and Shared Values rows after sample changes.
- **FR-007**: The selector MUST produce deterministic repeated-load behavior for each approved sample, including stable row ordering, stable status/severity labels, stable selected-sample labels, and stable trace-detail content.
- **FR-008**: The workbench MUST NOT expose upload, URL entry, raw document browsing, OCR browsing, email import, or free-form external sample loading.
- **FR-009**: The workbench MUST use simulated or mocked person-level case/population context when a human-readable context is needed and MUST NOT display real participant, beneficiary, alternate payee, survivor, or other natural-person data.
- **FR-010**: The workbench MUST display structured warnings or errors using existing conventions when an approved sample, including a selector-allowed sample, cannot fully populate the workbench display because required workbench evidence is missing.
- **FR-011**: The sample selector MUST remain display/navigation-only and MUST NOT create new business domains, new output adapters, or new persistence responsibilities.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Approved sample artifacts already committed in the repository, existing deterministic outputs from implemented slices, existing DD-backed mappings, and simulated or mocked case/population context.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, unreviewed extraction output, real natural-person data, hosted samples, uploads, URL-loaded samples, and ad hoc analyst-entered sample data MUST NOT be read by deterministic engine modules or the workbench selector.
- **Source Layer Reads**: Deterministic engine outputs, output adapter display sources, DD-backed mappings, approved sample artifacts, and mocked display context already accepted by prior workbench slices.
- **Source Layer Writes**: No new lower source-layer writes. This slice may update only display state, deterministic render evidence, regression evidence, and existing static build artifacts where current repository delivery rules require them.
- **Traceability Required**: Selected sample identity, approved artifact basis, output panel source, comparison row source fields, mapping basis, status/severity labels, rule version, producing module, and trace-detail row identity must remain traceable.

### Key Entities *(include if feature involves data)*

- **Approved Sample Option**: A selectable repository-backed sample identity with display label, approved artifact references, mocked context label, and deterministic ordering key.
- **Selected Workbench Sample**: The active sample option used to populate the workbench header, output panels, comparison rows, and trace details.
- **Workbench Display State**: The visible header, output panels, Shared Facts rows, Shared Values rows, reconciliation rows, warnings/errors, and trace-detail expansions derived from the selected sample.
- **Mocked Case/Population Context**: Simulated display context used to make the approved sample recognizable without using real natural-person data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: If at least two supported approved samples exist, an analyst can identify the active sample and switch to another approved sample in under 10 seconds; otherwise, the analyst can identify the fixed approved sample in under 10 seconds.
- **SC-002**: For each available approved sample, repeated selection produces identical visible labels, row counts, ordering, statuses, severities, and trace-detail content across at least two consecutive loads.
- **SC-003**: 100% of selector options are backed by approved repository artifacts or approved mocked contexts, with zero upload, URL, raw-source, or free-form external loading paths.
- **SC-004**: After sample switching, the workbench still displays the three existing output panels, the Shared Facts table, the Shared Values table, and trace expansion controls for supported rows.
- **SC-005**: No real participant, beneficiary, alternate payee, survivor, or other natural-person data appears in the selector, sample header, mocked context, output panels, comparison tables, warnings/errors, or trace details.

## Assumptions

- Approved sample artifacts currently in the repository are sufficient for the initial selector; if only one fully supported sample exists, the MVP may present a fixed-sample selector that is ready for additional approved options.
- Sample labels and mocked case/population context are display aids only and do not create new reviewed facts or output adapter records.
- Existing reconciliation rows, shared-fact rows, shared-value rows, output panel structures, and trace expansion behavior remain the source of truth for display shape.
- Browser-only behavior, offline review, and existing persistence boundaries remain unchanged.
- This slice improves the existing workbench page only and does not implement new calculation logic, new business domains, or new output adapters.
